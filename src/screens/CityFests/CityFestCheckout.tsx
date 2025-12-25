import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from '../HomePage/HeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';
import { API_URL } from '~/utils/api';
import { createRazorpayOptions } from '~/utils/payment';

const ICON_SIZE = 22;

const icons = {
  name: (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 100-8 4 4 0 000 8z"
        fill="#888"
      />
    </Svg>
  ),
  phone: (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 5a1 1 0 011-1h3.5a1 1 0 011 1c0 1.35.27 2.67.76 3.88a1 1 0 01-.21 1.11l-2.2 2.2z"
        fill="#888"
      />
    </Svg>
  ),
  email: (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 2v.01L12 13 4 6.01V6h16zM4 20V8.99l8 6.99 8-6.99V20H4z"
        fill="#888"
      />
    </Svg>
  ),
};

const paymentMethods = [
  { label: 'Card', value: 'card', icon: '💳' },
  { label: 'UPI', value: 'upi', icon: '📱' },
  { label: 'Wallet', value: 'wallet', icon: '👛' },
];

interface CityFest {
  id: string;
  categoryId: string;
  location: string;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  cityfest_category_name: string;
  pricing_types: any[];
}

const CityFestCheckout = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { festId, selectedSection, selectedType, quantity = 1 } = route.params || {};

  const [fest, setFest] = useState<CityFest | null>(null);
  const [loadingFest, setLoadingFest] = useState(true);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    payment_method: 'card',
  });
  const [payLater, setPayLater] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedTicketPrice, setSelectedTicketPrice] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchFest = async () => {
      try {
        setLoadingFest(true);
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          setIsAuthenticated(false);
          setLoadingFest(false);
          return;
        }

        setIsAuthenticated(true);
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        };
        const response = await fetch(`${API_URL}/city-fests/getall/cityfests`, {
          method: 'GET',
          headers,
        });
        const data = await response.json();
        if (data.success && data.fests) {
          const festData = data.fests.find((f: CityFest) => f.id === festId);
          if (festData) {
            setFest(festData);
            // Calculate ticket price
            if (selectedSection && selectedType && festData.pricing_types) {
              const section = festData.pricing_types.find(
                (p: any) => p.name.toLowerCase() === selectedSection.toLowerCase()
              );
              if (section && section.types) {
                const ticketType = section.types.find(
                  (t: any) => t.type.toLowerCase() === selectedType.toLowerCase()
                );
                if (ticketType) {
                  setSelectedTicketPrice(ticketType.price * quantity);
                }
              }
            }
          } else {
            console.error('Fest not found with id:', festId);
          }
        } else {
          console.error('API Error:', data);
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error('Error fetching fest:', error);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoadingFest(false);
      }
    };
    if (festId) {
      fetchFest();
    }
  }, [festId, selectedSection, selectedType, quantity]);

  const handleInput = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRadio = (value: string) => {
    setForm((prev) => ({ ...prev, payment_method: value }));
  };

  const handleContinue = async () => {
    if (!form.name || !form.phone || !form.email) {
      Alert.alert('Missing Fields', 'Please fill all fields.');
      return;
    }
    setSubmitting(true);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        Alert.alert('Error', 'You must be logged in to book a fest.');
        return;
      }

      // Build pricing_type object based on selected type
      const pricingType: Record<string, number> = {};
      if (selectedType) {
        pricingType[selectedType] = quantity;
      }

      const bookingData = {
        id: festId,
        name: form.name,
        phone: form.phone,
        email: form.email,
        payment_method: form.payment_method.toLowerCase(),
        pricing_category: selectedSection || 'general',
        pricing_type: pricingType,
        referral_id: '',
        requestedCoins: payLater ? '0' : '0', // Can be updated if user wants to use coins
        coupon_code: '',
      };

      const res = await fetch(`${API_URL}/cityfest-booking`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(bookingData),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Booking failed');
      }

      const result = await res.json();
      if (result.success) {
        const { booking, razorpayOrder } = result.data;
        
        // If pay later is selected, skip payment and go to success screen
        if (payLater) {
          navigation.navigate('Main', { screen: 'BookingSuccess', params: {
            bookingData: booking,
              paymentId: 'pay_later',
              bookingType: 'cityfest',
            },
          });
          return;
        }
        
        // Create Razorpay options for WebView
        const razorpayOptions = createRazorpayOptions({
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'FestGo CityFest',
          description: `CityFest booking for ${booking.name}`,
          orderId: razorpayOrder.id,
          bookingId: booking.id,
          prefill: {
            email: booking.email,
            contact: booking.phone,
            name: booking.name,
          },
          notes: {
            booking_id: booking.id,
            payment_for: 'cityfest_booking',
            payment_type: booking.payment_method,
          },
        });

        console.log('Created Razorpay options:', razorpayOptions);

        // Navigate to PaymentWebView
        navigation.navigate('Main', { screen: 'PaymentWebView', params: {
          razorpayOptions,
          bookingData: booking,
          bookingType: 'cityfest',
        },
      });
      } else {
        throw new Error(result.message || 'Booking failed');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTicketName = () => {
    if (!selectedSection || !selectedType) return 'Ticket';
    const sectionName = selectedSection.charAt(0).toUpperCase() + selectedSection.slice(1);
    const typeName = selectedType.charAt(0).toUpperCase() + selectedType.slice(1);
    return `${sectionName} ${typeName}`;
  };

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        {/* Header Section */}
        <View
          style={{
            height: 280,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
            <View className="h-full w-full opacity-20" />
          </View>
          <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
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
              Check out
            </Text>
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-2 text-center font-baloo text-2xl font-bold text-gray-800">
            Login Required
          </Text>
          <Text className="mb-6 text-center font-poppins text-base text-gray-600">
            Please login to proceed with checkout
          </Text>
          <TouchableOpacity
            onPress={() => {
              const rootNavigation = navigation.getParent()?.getParent();
              if (rootNavigation) {
                (rootNavigation as any).navigate('Auth', { screen: 'Login' });
              }
            }}
            className="rounded-full bg-[#0E54EC] px-6 py-3">
            <Text className="font-poppins font-semibold text-white">Go to Login</Text>
          </TouchableOpacity>
        </View>
        <BottomMenu />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
          {fest?.image_urls?.[0] && (
            <Image
              source={{ uri: fest.image_urls[0] }}
              className="h-full w-full opacity-20"
              resizeMode="cover"
            />
          )}
        </View>

        {/* Top Bar */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center">
              <View className="mr-2 h-8 w-8 rounded-full bg-white/20" />
              <Text className="mr-1 font-poppins text-base font-medium text-white">
                {fest?.location || 'Hyderabad'}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M8 2v2M16 2v2M3 7h18M5 11h2M9 11h2M13 11h2M17 11h2M5 15h2M9 15h2M13 15h2M17 15h2M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                  fill="white"
                />
              </Svg>
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
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
            Check out
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
          {/* Tickets Section */}
          <View className="mb-6">
            <Text className="mb-3 font-baloo text-xl font-bold text-black">Tickets</Text>
            <View className="rounded-xl border border-gray-200 bg-white p-4">
              <Text className="font-poppins text-base font-semibold text-black">
                {getTicketName()}
              </Text>
              <Text className="mt-1 font-poppins text-lg font-bold text-[#0E54EC]">
                ₹{selectedTicketPrice.toLocaleString('en-IN')}
              </Text>
            </View>
          </View>

          {/* Input Fields */}
          <View className="mb-6 gap-4">
            {/* Name */}
            <View>
              <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                <TextInput
                  placeholder="Enter Name"
                  value={form.name}
                  onChangeText={(v) => handleInput('name', v)}
                  className="flex-1 font-poppins text-base"
                />
                {icons.name}
              </View>
            </View>
            {/* Phone */}
            <View>
              <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                <TextInput
                  keyboardType="phone-pad"
                  placeholder="+91"
                  value={form.phone}
                  onChangeText={(v) => handleInput('phone', v.replace(/[^0-9]/g, ''))}
                  className="flex-1 font-poppins text-base"
                  maxLength={10}
                />
                {icons.phone}
              </View>
            </View>
            {/* Email */}
            <View>
              <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                <TextInput
                  keyboardType="email-address"
                  placeholder="Enter your email"
                  value={form.email}
                  onChangeText={(v) => handleInput('email', v)}
                  className="flex-1 font-poppins text-base"
                  autoCapitalize="none"
                />
                {icons.email}
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View className="mb-6">
            <Text className="mb-3 font-poppins text-base font-semibold">Payment Method</Text>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.value}
                className={`mb-2 flex-row items-center rounded-lg border px-4 py-3 ${
                  form.payment_method === method.value
                    ? 'border-[#0E54EC] bg-blue-50'
                    : 'border-gray-300'
                }`}
                onPress={() => handleRadio(method.value)}>
                <View
                  className={`mr-3 h-5 w-5 rounded-full border-2 ${
                    form.payment_method === method.value
                      ? 'border-[#0E54EC] bg-[#0E54EC]'
                      : 'border-gray-400'
                  } items-center justify-center`}>
                  {form.payment_method === method.value && (
                    <View className="h-2.5 w-2.5 rounded-full bg-white" />
                  )}
                </View>
                <Text className="mr-2 text-lg">{method.icon}</Text>
                <Text className="font-poppins text-base">{method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Pay Later Option */}
          <View className="mb-6">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setPayLater(!payLater)}>
              <View
                className={`mr-2 h-5 w-5 rounded border-2 ${
                  payLater ? 'border-[#0E54EC] bg-[#0E54EC]' : 'border-gray-400'
                } items-center justify-center`}>
                {payLater && (
                  <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                    <Path
                      d="M20 6L9 17l-5-5"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </Svg>
                )}
              </View>
              <Text className="font-poppins text-base">Book for ₹0 and pay later</Text>
            </TouchableOpacity>
          </View>

          {/* Continue Payment Button */}
          <TouchableOpacity
            className="mb-6 overflow-hidden rounded-lg bg-[#0E54EC] py-4"
            onPress={handleContinue}
            disabled={submitting}>
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-center font-poppins text-lg font-semibold text-white">
                Continue Payment
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <BottomMenu />
    </View>
  );
};

export default CityFestCheckout;
