import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  ActivityIndicator,
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

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef<TextInput[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendEnabled(true);
    }
  }, [timer]);

  const handleOtpChange = (text: string, index: number) => {
    if (!/^\d*$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    if (!isResendEnabled) return;

    // Reset UI
    setOtp(['', '', '', '', '', '']);
    setTimer(60);
    setIsResendEnabled(false);

    // TODO: Trigger resend OTP API here if needed
    Alert.alert('OTP Resent', `A new OTP has been sent to ${phoneNumber}`);
  };

  const handleLogin = async () => {
    const finalOtp = otp.join('');

    if (finalOtp.length !== 6) {
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
          otp: finalOtp,
        }),
      });

      const data = await response.json();
      console.log('OTP Verify Response:', data);

      if (data.success) {
        await AsyncStorage.setItem('jwtToken', data.jwtToken);
        await AsyncStorage.setItem('userId', data.user.id);
        await AsyncStorage.setItem('isLoggedIn', 'true');

        Alert.alert('Success', 'Login successful');
        navigation.navigate('Main', { screen: 'HomePage' });
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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

          {/* OTP Inputs */}
          <View className="mb-6 items-center">
            <View className="mb-4 mt-2 flex-row justify-between gap-4 space-x-3">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el!; }}
                  className="h-16 w-12 rounded-xl border border-gray-300 text-center text-2xl text-gray-800"
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleOtpChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Timer and Resend */}
            <View className="mb-12 w-full flex-row justify-between px-12">
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
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-lg font-blackshield">Confirm</Text>
            )}
          </TouchableOpacity>

          {/* Bottom Color Bar */}
          <View className="mt-6 h-4 flex-row">
            <View className="flex-1 rounded-l-md bg-[#00A450]" />
            <View className="flex-1 rounded-r-md bg-[#F15A29]" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default OTPScreen;
