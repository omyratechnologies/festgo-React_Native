import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import LoginLogo from '~/assets/images/auth/Group.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthRouteProp, NavigationProp } from '~/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';

const OTPScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<AuthRouteProp<'OTP'>>();

  const { phoneNumber } = route.params;

  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleOtpChange = (text: string) => {
    // Only allow digits and max 6 characters
    const cleanText = text.replace(/\D/g, '').slice(0, 6);
    setOtp(cleanText);
  };

  const handleResend = () => {
    if (!isResendEnabled) return;

    // Reset UI
    setOtp('');
    setTimer(60);
    setIsResendEnabled(false);

    // TODO: Trigger resend OTP API here if needed
    Alert.alert('OTP Resent', `A new OTP has been sent to ${phoneNumber}`);
  };

  const handleLogin = async () => {
    if (otp.length !== 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          number: phoneNumber,
          otp: otp,
        }),
      });

      const data = await response.json();
      console.log('OTP Verify Response:', data);

      if (data.success) {
        if (data.jwtToken && data.jwtToken !== null && data.jwtToken !== undefined) {
          await AsyncStorage.setItem('jwtToken', data.jwtToken);
        }
        if (data.user && data.user.id) {
          await AsyncStorage.setItem('userId', data.user.id);
        }
        await AsyncStorage.setItem('isLoggedIn', 'true');

        Alert.alert('Success', 'Login successful');
        navigation.replace('Main', { screen: 'HomePage' });
      } else {
        Alert.alert('Error', data.message || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'space-between' }}
            keyboardShouldPersistTaps="handled">
            <View className="flex-1 justify-between bg-white px-6">
              {/* Logo */}
              <View className="mb-6 items-center">
                <LoginLogo width="256" height="256" />
              </View>

              {/* Headings */}
              <View className="mb-2 items-center">
                <Text className="font-blackshield text-3xl font-bold leading-[140%] text-gray-800">
                  Verification <Text className="text-[#F15A29]">Code</Text>
                </Text>
                <Text className="mt-1 text-center font-baloo text-gray-500">
                  Enter the code we sent to {phoneNumber}
                </Text>
              </View>

              {/* OTP Input */}
              <View className="mb-6 items-center">
                <TextInput
                  className="mb-4 h-16 w-64 rounded-xl border border-gray-300 text-center text-2xl text-gray-800"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={otp}
                  onChangeText={handleOtpChange}
                  placeholder="Enter 6-digit code"
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                />
                
                {/* Visual Indicators */}
                <View className="flex-row gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <View
                      key={index}
                      className={`h-3 w-3 rounded-full ${
                        index < otp.length ? 'bg-[#F15A29]' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </View>

                {/* Timer and Resend */}
                <View className="my-12 w-full flex-row justify-between px-12">
                  <Text className="font-baloo text-[#F15A29]">
                    {timer > 0 ? `Resend in ${timer}s` : ''}
                  </Text>
                  <TouchableOpacity onPress={handleResend} disabled={!isResendEnabled}>
                    <Text
                      className={`font-baloo text-[#F15A29] ${!isResendEnabled ? 'opacity-40' : ''}`}>
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Button */}
              <TouchableOpacity
                className="mb-4 items-center rounded-full bg-[#F15A29] p-3 font-blackshield"
                onPress={handleLogin}
                disabled={loading}
                activeOpacity={0.8}>
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="font-blackshield text-lg text-white">Confirm</Text>
                )}
              </TouchableOpacity>

              {/* Bottom Color Bar */}
              <View className="mt-6 h-4 flex-row">
                <View className="flex-1 rounded-l-md bg-[#00A450]" />
                <View className="flex-1 rounded-r-md bg-[#F15A29]" />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default OTPScreen;
