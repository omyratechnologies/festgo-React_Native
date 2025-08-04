import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';

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
  { label: 'Card', value: 'CARD' },
  { label: 'UPI', value: 'UPI' },
  { label: 'Wallet', value: 'WALLET' },
];

const HotelBookingCheckout = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<any>();
  const { checkoutData } = route.params || {};

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    payment_method: 'CARD',
  });
  const [submitting, setSubmitting] = useState(false);

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
      // Here you would typically make an API call to process the booking
      // For now, we'll just show a success message
      setTimeout(() => {
        Alert.alert('Success', 'Hotel booking successful!', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('HomePage'),
          },
        ]);
      }, 1000);
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const [day, month, year] = dateString.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-white">Checkout</Text>
          <View style={{ width: 24 }} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
            {/* Booking Details */}
            <View className="mb-6 mt-4">
              <Text className="mb-3 text-xl font-bold">Booking Details</Text>
              <View className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Property Type</Text>
                  <Text className="text-base font-semibold">{checkoutData?.property_type}</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Location</Text>
                  <Text className="text-base font-semibold">{checkoutData?.location}</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Check-in</Text>
                  <Text className="text-base font-semibold">
                    {checkoutData?.todate ? formatDate(checkoutData.todate) : 'N/A'}
                  </Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Check-out</Text>
                  <Text className="text-base font-semibold">
                    {checkoutData?.enddate ? formatDate(checkoutData.enddate) : 'N/A'}
                  </Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Duration</Text>
                  <Text className="text-base font-semibold">{checkoutData?.staynight} nights</Text>
                </View>
                <View className="mb-3">
                  <Text className="text-sm font-medium text-gray-600">Guests</Text>
                  <Text className="text-base font-semibold">
                    {checkoutData?.rooms} Room(s), {checkoutData?.adult} Adult(s)
                    {checkoutData?.child && checkoutData.child !== '0'
                      ? `, ${checkoutData.child} Child(ren)`
                      : ''}
                  </Text>
                </View>
              </View>
            </View>

            {/* Guest Information */}
            <View className="mb-6">
              <Text className="mb-3 text-xl font-bold">Guest Information</Text>
              <View className="gap-4">
                {/* Name */}
                <View>
                  <Text className="mb-1 font-poppins text-sm font-semibold">Full Name</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                    <TextInput
                      placeholder="Enter full name"
                      value={form.name}
                      onChangeText={(v) => handleInput('name', v)}
                      className="flex-1 font-poppins text-base"
                    />
                    {icons.name}
                  </View>
                </View>
                {/* Phone */}
                <View>
                  <Text className="mb-1 font-poppins text-sm font-semibold">Phone Number</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                    <TextInput
                      keyboardType="phone-pad"
                      placeholder="Enter phone number"
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
                  <Text className="mb-1 font-poppins text-sm font-semibold">Email ID</Text>
                  <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                    <TextInput
                      keyboardType="email-address"
                      placeholder="Enter email"
                      value={form.email}
                      onChangeText={(v) => handleInput('email', v)}
                      className="flex-1 font-poppins text-base"
                      autoCapitalize="none"
                    />
                    {icons.email}
                  </View>
                </View>
              </View>
            </View>

            {/* Payment Method */}
            <View className="mb-6">
              <Text className="mb-3 font-poppins text-xl font-bold">Payment Method</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.value}
                  className={`mb-2 flex-row items-center rounded-lg border px-4 py-3 ${
                    form.payment_method === method.value
                      ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                      : 'border-gray-300'
                  }`}
                  onPress={() => handleRadio(method.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: form.payment_method === method.value }}>
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
                  <Text className="font-poppins text-base">{method.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              className="mb-8 mt-4 rounded-lg bg-[#0E54EC] py-4"
              onPress={handleContinue}
              disabled={submitting}
              accessibilityRole="button">
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-poppins text-lg font-semibold text-white">
                  Confirm Booking
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

export default HotelBookingCheckout;
