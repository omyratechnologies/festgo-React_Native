import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useRef, useState, useEffect } from 'react';
import LoginLogo from '~/assets/images/auth/Group.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/Button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';

const OTPScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isResendEnabled, setIsResendEnabled] = useState(false);

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
    if (!/^\d*$/.test(text)) return; // Allow only digits

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
    setOtp(['', '', '', '']);
    setTimer(60);
    setIsResendEnabled(false);
    // Trigger resend API call here
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 justify-between bg-white px-6">
          {/* SVG Graphic */}
          <View className="mb-6 items-center">
            <LoginLogo width="256" height="256" />
          </View>

          {/* Heading */}
          <View className="mb-2 items-center">
            <Text className="font-blackshield text-3xl font-bold leading-[140%] text-gray-800">
              Verification <Text className="text-[#F15A29]">Code</Text>
            </Text>
            <Text className="mt-1 text-center font-baloo text-gray-500">
              Enter the verification code that we have sent to your email
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View className="mb-6 items-center ">
            <View className="mb-2 mt-2 flex-row justify-between gap-5 space-x-3">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el!;
                  }}
                  className="h-16 w-14 rounded-xl border border-gray-300 text-center text-2xl text-gray-800"
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
          <Button
            title="Confirm"
            variant="primary"
            className="mb-4 items-center rounded-full bg-[#F15A29] p-3 font-blackshield"
            onPress={() => navigation.push('Auth', { screen: 'SignupScreen' })}
          />

          {/* Bottom Color Div */}
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
