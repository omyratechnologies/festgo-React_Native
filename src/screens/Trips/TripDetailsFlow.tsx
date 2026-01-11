import React, { useMemo, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { API_URL } from '~/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList, MainTabNavigationProp } from '~/navigation/types';
import WalletIcon from '~/assets/images/common/Navbar/walletLight.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';
import Svg, { Path } from 'react-native-svg';
import BottomMenu from '~/components/common/BottomMenu';
import { Ionicons } from '@expo/vector-icons';

type RouteP = RouteProp<MainStackParamList, 'TripDetailsFlow'>;

const ICON_SIZE = 22;

const inputIcons = {
  name: <Ionicons name="person-outline" size={ICON_SIZE} color="#888" />,
  phone: <Ionicons name="call-outline" size={ICON_SIZE} color="#888" />,
  email: <Ionicons name="mail-outline" size={ICON_SIZE} color="#888" />,
};

const paymentMethodIcons = {
  card: <Ionicons name="card-outline" size={ICON_SIZE} color="#666" />,
  upi: <Ionicons name="phone-portrait-outline" size={ICON_SIZE} color="#666" />,
  wallet: <Ionicons name="wallet-outline" size={ICON_SIZE} color="#666" />,
};

const StepButton = ({ title, onPress, disabled }: { title: string; onPress: () => void; disabled?: boolean }) => (
  <TouchableOpacity onPress={onPress} disabled={disabled} className={`mt-4 rounded-full py-3 ${disabled ? 'bg-gray-400' : 'bg-[#0E54EC]'}`}>
    <Text className="text-center text-white font-semibold">{title}</Text>
  </TouchableOpacity>
);

const TripDetailsFlow: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<RouteP>();
  const trip = route.params.trip as any;

  const [step, setStep] = useState<0 | 1 | 2 | 3>(0); // 0: highlights, 1: pricing, 2: preview, 3: form
  const [selectedPricing, setSelectedPricing] = useState<any | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'wallet' | ''>('');
  const [numPersons, setNumPersons] = useState('1');
  const [referralId, setReferralId] = useState('');
  const [requestedCoins, setRequestedCoins] = useState('');

  const canContinuePricing = useMemo(() => !!selectedPricing, [selectedPricing]);

  const goNext = () => setStep((s) => (s < 3 ? ((s + 1) as any) : s));
  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      setStep((s) => (s > 0 ? ((s - 1) as any) : s));
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return 'Trip Highlights';
      case 1:
        return 'Select Plan';
      case 2:
        return 'Check out';
      case 3:
        return 'Check out';
      default:
        return trip.tripName;
    }
  };

  const formatDisplayDate = (dateString: string) => {
    try {
      // Try to parse the date - handle different formats
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // If parsing fails, try DD-MM-YYYY format
        const parts = dateString.split(/[-/]/);
        if (parts.length === 3) {
          const [day, month, year] = parts;
          const parsedDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
          return parsedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
        return dateString;
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  const handleBook = async () => {
    try {
      const token = await AsyncStorage.getItem('jwtToken');
      if (!token) {
        Alert.alert('Login required', 'Please login to continue');
        return;
      }

      if (!name || !email || !phone || !paymentMethod) {
        Alert.alert('Missing info', 'Please fill all details and select a payment method');
        return;
      }

      const body = {
        id: trip.id,
        name,
        number: phone,
        email,
        payment_method: paymentMethod,
        numberOfPersons: numPersons,
        referral_id: referralId,
        requestedCoins,
      };

      const resp = await fetch(`${API_URL}/trips-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const result = await resp.json();
      if (!resp.ok || !result.success) {
        // Handle specific error with available tiers
        if (result.availableTiers && Array.isArray(result.availableTiers) && result.availableTiers.length > 0) {
          const availableTiersText = result.availableTiers.join(', ');
          const firstAvailableTier = result.availableTiers[0];
          
          Alert.alert(
            'Invalid Group Size',
            `${result.message || 'Selected group size is not applicable for this trip.'}\n\nAvailable group sizes: ${availableTiersText}\n\nWould you like to use ${firstAvailableTier} persons instead?`,
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },
              {
                text: `Use ${firstAvailableTier}`,
                onPress: () => {
                  setNumPersons(firstAvailableTier);
                },
              },
            ]
          );
          return;
        }
        throw new Error(result.message || 'Booking failed');
      }

      const { booking, razorpayOrder } = result.data;

      // Navigate to payment webview
      navigation.navigate('PaymentWebView', {
        razorpayOptions: {
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'FestGo Trip',
          description: `Trip booking for ${trip.tripName}`,
          order_id: razorpayOrder.id,
          prefill: { email, contact: phone, name },
          notes: {
            booking_id: booking.id,
            payment_for: 'trip_booking',
            payment_type: paymentMethod,
          },
          theme: { color: '#F15A29' },
        },
        bookingData: booking,
        bookingType: 'trip',
      });
    } catch (e: any) {
      console.error('Trip booking error', e);
      Alert.alert('Error', e.message || 'Booking failed');
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden">
          <Image
            source={require('~/assets/images/trips/bg.png')}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <UserProfileLight width={32} height={32} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} className="mr-4">
              <WalletIcon width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <NotificationIcon width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation and Title */}
        <View
          style={{
            position: 'absolute',
            top: 110,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 2,
          }}>
          <TouchableOpacity onPress={goBack} style={{ marginRight: 10 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="font-baloo" style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            {getStepTitle()}
          </Text>
        </View>
      </View>

      {/* Content Area */}
      <View className="flex-1 bg-white -mt-20 rounded-t-[40px]" style={{ paddingHorizontal: 16, paddingTop: 52 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Trip Info Header */}
          {step === 0 && (
            <View className="flex-row items-center mb-5">
              {trip.imageUrl && (
                <Image source={{ uri: trip.imageUrl }} style={{ width: 72, height: 72, borderRadius: 12 }} />
              )}
              <View className="ml-3 flex-1">
                <Text className="text-xl font-semibold font-baloo">{trip.tripName}</Text>
                <Text className="text-gray-600 mt-1">{trip.numberOfDays} days · {trip.pickupLocation}</Text>
              </View>
            </View>
          )}

          {/* Steps */}
          {step === 0 && (
            <View>
              <Text className="text-lg font-semibold mb-3 font-baloo">Highlights</Text>
              {trip.highlights?.map((h: string, idx: number) => (
                <Text key={idx} className="text-gray-700 mb-2 text-base">• {h}</Text>
              ))}
              <StepButton title="Next" onPress={goNext} />
            </View>
          )}

          {step === 1 && (
            <View>
              <Text className="text-lg font-semibold mb-3 font-baloo">Tuning Plans – Group Pricing</Text>
              {trip.pricing?.map((p: any, idx: number) => {
                const vehicleImages = [
                  require('~/assets/images/trips/car.png'),
                  require('~/assets/images/trips/van.png'),
                  require('~/assets/images/trips/bus2.png'),
                ];
                const vehicleImage = vehicleImages[idx] || vehicleImages[0];
                return (
                  <TouchableOpacity
                    key={p.id}
                    onPress={() => setSelectedPricing(p)}
                    className={`mb-3 rounded-xl border p-4 flex-row items-center justify-between ${selectedPricing?.id === p.id ? 'border-[#0E54EC] bg-[#0E54EC]/10' : 'border-gray-300 bg-white'}`}
                  >
                    <View className="flex-1">
                      <Text className="font-semibold text-base">{p.title}</Text>
                      <Text className="text-gray-600 mt-1">{p.price}</Text>
                    </View>
                    <Image 
                      source={vehicleImage} 
                      style={{ width: 60, height: 60 }} 
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                );
              })}
              <StepButton title="Next" onPress={goNext} disabled={!canContinuePricing} />
              <Image 
                source={require('~/assets/images/trips/bottom.png')} 
                style={{ width: '100%', marginTop: 16 }} 
                resizeMode="contain"
              />
              <StepButton title="Back" onPress={goBack} />
            </View>
          )}

          {step === 2 && (
            <View>
              <View className="rounded-xl border border-gray-200 bg-white p-5 mb-4">
                {/* Trip Title */}
                <Text className="text-2xl font-bold mb-2 font-baloo text-black">{trip.tripName}</Text>
                
                {/* Trip Summary */}
                <Text className="text-base text-gray-700 mb-5">
                  {trip.numberOfDays} days Trip | {numPersons} Member{parseInt(numPersons) !== 1 ? 's' : ''}
                </Text>

                {/* Selected Plan with Image */}
                {selectedPricing && (
                  <View className="mb-5 flex-row items-center">
                    <Image
                      source={
                        (() => {
                          const pricingIndex = trip.pricing?.findIndex((p: any) => p.id === selectedPricing.id) ?? 0;
                          const vehicleImages = [
                            require('~/assets/images/trips/car.png'),
                            require('~/assets/images/trips/van.png'),
                            require('~/assets/images/trips/bus2.png'),
                          ];
                          return vehicleImages[pricingIndex] || vehicleImages[0];
                        })()
                      }
                      style={{ width: 80, height: 80, borderRadius: 12, marginRight: 16 }}
                      resizeMode="contain"
                    />
                    <View className="flex-1">
                      <Text className="text-base text-gray-700 mb-1">For {numPersons} member{parseInt(numPersons) !== 1 ? 's' : ''}</Text>
                      <Text className="text-lg font-semibold text-gray-900">{selectedPricing.price}</Text>
                    </View>
                  </View>
                )}

                {/* Depart Date */}
                <View className="mb-4 flex-row items-center">
                  <Text className="font-semibold text-base text-gray-900 mr-2">Depart Date</Text>
                  <Ionicons name="calendar-outline" size={18} color="#666" style={{ marginRight: 8 }} />
                  <Text className="text-base text-gray-700">{formatDisplayDate(trip.startDate)}</Text>
                </View>

                {/* Pickup Location */}
                <View className="mb-4 flex-row items-center">
                  <Text className="font-semibold text-base text-gray-900 mr-2">Pickup Location</Text>
                  <Ionicons name="location-outline" size={18} color="#666" style={{ marginRight: 8 }} />
                  <Text className="text-base text-gray-700">{trip.pickupLocation}</Text>
                </View>

                {/* Inclusions */}
                <View className="mb-5 flex-row items-center">
                  <Text className="font-semibold text-base text-gray-900 mr-2">Inclusions</Text>
                  <Text className="text-sm text-gray-500 mr-2">(costs extra)</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#0E54EC" style={{ marginRight: 8 }} />
                  <Text className="text-base text-gray-700 flex-1">
                    {trip.inclusions && trip.inclusions.length > 0 
                      ? trip.inclusions.join(', ') 
                      : 'Accommodation, Transport, etc'}
                  </Text>
                </View>

                {/* Confirm Button */}
                <TouchableOpacity
                  onPress={goNext}
                  className="mt-4 rounded-full bg-[#0E54EC] py-3"
                >
                  <Text className="text-center text-white font-semibold text-base">Confirm</Text>
                </TouchableOpacity>
              </View>
              <StepButton title="Back" onPress={goBack} />
            </View>
          )}

          {step === 3 && (
            <View className="pb-32">
              {/* Input Fields */}
              <View className="mb-6 gap-4">
                {/* Name */}
                <View>
                  <Text className="mb-1 text-gray-700 font-medium">Name</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-3">
                    <TextInput
                      value={name}
                      onChangeText={setName}
                      placeholder="Enter Name"
                      className="flex-1 text-base"
                    />
                    {inputIcons.name}
                  </View>
                </View>
                {/* Phone */}
                <View>
                  <Text className="mb-1 text-gray-700 font-medium">Phone no.</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-3">
                    <Text className="text-gray-500 mr-2">+91</Text>
                    <TextInput
                      value={phone}
                      onChangeText={(v) => setPhone(v.replace(/[^0-9]/g, ''))}
                      keyboardType="phone-pad"
                      placeholder=""
                      className="flex-1 text-base"
                      maxLength={10}
                    />
                    {inputIcons.phone}
                  </View>
                </View>
                {/* Email */}
                <View>
                  <Text className="mb-1 text-gray-700 font-medium">Email id</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 bg-white px-3 py-3">
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      keyboardType="email-address"
                      placeholder="Enter your email"
                      autoCapitalize="none"
                      className="flex-1 text-base"
                    />
                    {inputIcons.email}
                  </View>
                </View>
              </View>

              {/* Payment Method */}
              <View className="mb-6">
                <Text className="mb-3 text-gray-700 font-semibold">Payment Method</Text>
                {[
                  { value: 'card', label: 'Card' },
                  { value: 'upi', label: 'UPI' },
                  { value: 'wallet', label: 'Wallet' },
                ].map((method) => (
                  <TouchableOpacity
                    key={method.value}
                    className={`mb-2 flex-row items-center justify-between rounded-lg border px-4 py-3 ${
                      paymentMethod === method.value
                        ? 'border-[#0E54EC] bg-blue-50'
                        : 'border-gray-300 bg-white'
                    }`}
                    onPress={() => setPaymentMethod(method.value as any)}>
                    <View className="flex-row items-center flex-1">
                      {paymentMethodIcons[method.value as keyof typeof paymentMethodIcons]}
                      <Text className="ml-3 text-base text-gray-900">{method.label}</Text>
                    </View>
                    <View
                      className={`h-5 w-5 rounded-full border-2 ${
                        paymentMethod === method.value
                          ? 'border-[#0E54EC] bg-[#0E54EC]'
                          : 'border-gray-400 bg-white'
                      } items-center justify-center`}>
                      {paymentMethod === method.value && (
                        <View className="h-2.5 w-2.5 rounded-full bg-white" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Continue Payment Button */}
              <TouchableOpacity
                onPress={handleBook}
                className="rounded-lg bg-[#0E54EC] py-4 mb-4">
                <Text className="text-center text-white font-semibold text-base">
                  Continue Payment
                </Text>
              </TouchableOpacity>
              <StepButton title="Back" onPress={goBack} />
            </View>
          )}
        </ScrollView>
      </View>
      <BottomMenu />

    </View>
  );
};

export default TripDetailsFlow;


