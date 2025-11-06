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

type RouteP = RouteProp<MainStackParamList, 'TripDetailsFlow'>;

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
        return 'Preview';
      case 3:
        return 'Traveler Details';
      default:
        return trip.tripName;
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
              {trip.pricing?.map((p: any) => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => setSelectedPricing(p)}
                  className={`mb-3 rounded-xl border p-4 ${selectedPricing?.id === p.id ? 'border-[#0E54EC] bg-[#0E54EC]/10' : 'border-gray-300 bg-white'}`}
                >
                  <Text className="font-semibold text-base">{p.title}</Text>
                  <Text className="text-gray-600 mt-1">{p.price}</Text>
                </TouchableOpacity>
              ))}
              <StepButton title="Next" onPress={goNext} disabled={!canContinuePricing} />
              <StepButton title="Back" onPress={goBack} />
            </View>
          )}

          {step === 2 && (
            <View>
              <Text className="text-lg font-semibold mb-3 font-baloo">Preview</Text>
              <View className="mb-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
                <Text className="text-gray-700 mb-2"><Text className="font-semibold">Trip:</Text> {trip.tripName}</Text>
                <Text className="text-gray-700 mb-2"><Text className="font-semibold">Dates:</Text> {trip.startDate} → {trip.endDate}</Text>
                <Text className="text-gray-700 mb-2"><Text className="font-semibold">Duration:</Text> {trip.numberOfDays} days</Text>
                {selectedPricing && (
                  <Text className="text-gray-700"><Text className="font-semibold">Selected Plan:</Text> {selectedPricing.title} ({selectedPricing.price})</Text>
                )}
              </View>
              <StepButton title="Next" onPress={goNext} />
              <StepButton title="Back" onPress={goBack} />
            </View>
          )}

          {step === 3 && (
            <View>
              <Text className="text-lg font-semibold mb-4 font-baloo">Traveler Details</Text>
              <View className="mb-3">
                <Text className="mb-1 text-gray-700 font-medium">Name</Text>
                <TextInput value={name} onChangeText={setName} placeholder="Enter name" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>
              <View className="mb-3">
                <Text className="mb-1 text-gray-700 font-medium">Phone</Text>
                <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="Enter phone" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>
              <View className="mb-3">
                <Text className="mb-1 text-gray-700 font-medium">Email</Text>
                <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Enter email" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>
              <View className="mb-3">
                <Text className="mb-1 text-gray-700 font-medium">Number of Persons</Text>
                <TextInput value={numPersons} onChangeText={setNumPersons} keyboardType="number-pad" placeholder="e.g. 4" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>
              <View className="mb-3">
                <Text className="mb-1 text-gray-700 font-medium">Referral ID (optional)</Text>
                <TextInput value={referralId} onChangeText={setReferralId} placeholder="Enter referral id" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>
              <View className="mb-4">
                <Text className="mb-1 text-gray-700 font-medium">Coins to use (optional)</Text>
                <TextInput value={requestedCoins} onChangeText={setRequestedCoins} keyboardType="number-pad" placeholder="e.g. 100" className="rounded-xl border border-gray-300 px-3 py-3 bg-white" />
              </View>

              <Text className="mb-2 text-gray-700 font-medium">Payment Method</Text>
              <View className="flex-row gap-2 mb-4">
                {['upi','card','wallet'].map((m) => (
                  <TouchableOpacity key={m} onPress={() => setPaymentMethod(m as any)} className={`rounded-full border px-4 py-2 ${paymentMethod===m ? 'border-[#0E54EC] bg-[#0E54EC]/10' : 'border-gray-300 bg-white'}`}>
                    <Text className={`${paymentMethod===m ? 'text-[#0E54EC] font-semibold' : 'text-gray-700'}`}>{m.toUpperCase()}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <StepButton title="Confirm Booking" onPress={handleBook} />
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


