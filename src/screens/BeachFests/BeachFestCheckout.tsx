import React, { useState, useEffect, use } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from '../HomePage/HeaderMenu';
import { ScrollView } from 'react-native-gesture-handler';
import BottomMenu from '~/components/common/BottomMenu';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Path } from 'react-native-svg';

const ICON_SIZE = 22;

const icons = {
  passes: (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="#888"
      />
      <Path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5-5-2.24-5-5z" fill="#888" />
    </Svg>
  ),
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

const BeachFestCheckout = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { festId } = route.params || {};

  const [fest, setFest] = useState<any>(null);
  const [loadingFest, setLoadingFest] = useState(true);
  const [form, setForm] = useState({
    passes: '',
    name: '',
    phone: '',
    email: '',
    payment_method: 'CARD',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFest = async () => {
      try {
        setLoadingFest(true);
        const res = await fetch(`https://server.festgo.in/api/beach-fests/${festId}`);
        if (!res.ok) throw new Error('Failed to fetch fest details');
        const data = await res.json();
        setFest(data);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        Alert.alert('Error', errorMessage);
      } finally {
        setLoadingFest(false);
      }
    };
    fetchFest();
  }, [festId]);
  const handleInput = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRadio = (value: string) => {
    setForm((prev) => ({ ...prev, payment_method: value }));
  };

  const handleContinue = async () => {
    if (!form.passes || !form.name || !form.phone || !form.email) {
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
      console.log(
        JSON.stringify({
          passes: Number(form.passes),
          name: form.name,
          phone: form.phone,
          email: form.email,
          payment_method: form.payment_method,
          fest_type: fest?.name,
          id: festId,
        })
      );
      console.log('auth token:', jwtToken);

      const res = await fetch('https://server.festgo.in/api/beachfest-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({
          passes: Number(form.passes),
          name: form.name,
          phone: form.phone,
          email: form.email,
          payment_method: form.payment_method,
          fest_type: fest?.name,
          id: festId,
        }),
      });
      console.log(res)
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Booking failed');
      }
      Alert.alert('Success', 'Booking successful!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1">
        <HeaderMenu />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
            {/* Back Button & Heading */}
            <View className="mb-6 flex-row items-center">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className=" p-2"
                accessibilityLabel="Go back">
                <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
                  <Path
                    d="M15 18l-6-6 6-6"
                    stroke="#222"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </TouchableOpacity>
              <Text className="mt-2 font-baloo text-2xl font-bold">Check out</Text>
            </View>

            {/* Fest Image Placeholder */}
            <View className="mb-6 h-40 w-full items-center justify-center overflow-hidden rounded-xl bg-gray-200">
              {loadingFest ? (
                <ActivityIndicator size="large" color="#888" />
              ) : fest?.image_urls ? (
                <Image
                  source={{ uri: fest.image_url?.[0] }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri: 'https://festgo.blr1.digitaloceanspaces.com/festgo/public/1753272751709-dd0009ac8f8325258b38268cf5026b7bae72c4ba.png',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              )}
            </View>

            {/* Input Fields */}
            <View className="gap-4 gap-4">
              {/* Passes */}
              <View>
                <Text className="mb-1 font-poppins text-sm font-semibold">Number of Passes</Text>
                <View className="flex-row items-center rounded-lg border border-gray-300 px-3 py-3">
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Enter no. of passes"
                    value={form.passes}
                    onChangeText={(v) => handleInput('passes', v.replace(/[^0-9]/g, ''))}
                    className="flex-1 font-poppins text-base"
                  />
                  {icons.passes}
                </View>
              </View>
              {/* Name */}
              <View>
                <Text className="mb-1 font-poppins text-sm font-semibold">Name</Text>
                <View className="flex-row items-center rounded-lg border border-gray-300 p-3">
                  <TextInput
                    placeholder="Enter name"
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

            {/* Payment Method */}
            <View className="mb-4 mt-8">
              <Text className="mb-3 font-poppins text-base font-semibold">Payment Method</Text>
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.value}
                  className={`mb-2 flex-row items-center rounded-lg border px-4 py-3 ${
                    form.payment_method === method.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                  onPress={() => handleRadio(method.value)}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: form.payment_method === method.value }}>
                  <View
                    className={`mr-3 h-5 w-5 rounded-full border-2 ${
                      form.payment_method === method.value
                        ? 'border-blue-500 bg-blue-500'
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
              className="mb-48 mt-4 rounded-lg bg-blue-600 py-4"
              onPress={handleContinue}
              disabled={submitting}
              accessibilityRole="button">
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-poppins text-lg font-semibold text-white">
                  Continue
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

export default BeachFestCheckout;
