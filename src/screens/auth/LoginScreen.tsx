import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Linking,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import React, { useState } from 'react';
import LoginLogo from '~/assets/images/auth/Group.svg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '~/components/ui/Button';
import MailIcon from '~/assets/icons/mail.svg';
import PhoneIcon from '~/assets/icons/phone.svg'; // Add phone icon
import FacebookIcon from '~/assets/icons/facebook.svg';
import GoogleIcon from '~/assets/icons/google.svg';
// import CheckIcon from '~/assets/icons/check.svg'; // Add check icon for success modal
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetView } from '@gorhom/bottom-sheet';
import { API_URL } from '~/utils/api';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [loginType, setLoginType] = useState<'email' | 'phone'>('email');
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const handleLoginTypeToggle = () => {
    setLoginType(loginType === 'email' ? 'phone' : 'email');
    setInputValue('');
  };

  const validateInput = () => {
    if (loginType === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(inputValue);
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      return phoneRegex.test(inputValue);
    }
  };

  const handleLogin = async () => {
    if (!inputValue.trim()) {
      Alert.alert('Error', `Please enter your ${loginType}`);
      return;
    }

    if (!validateInput()) {
      Alert.alert('Error', `Please enter a valid ${loginType}`);
      return;
    }

    setLoading(true);

    try {
      const requestBody =
        loginType === 'email'
          ? {
              email: inputValue,
              loginType: 'gmail',
              firstname: '',
              lastname: '',
            }
          : {
              email: inputValue,
              loginType: 'mobile',
            };

      const response = await fetch(`${API_URL}/userlogin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      // console.log('Login response:', data);
      if (data.status === 200) {
        // Save JWT token and user ID to AsyncStorage
        if (loginType === 'email') {
          await AsyncStorage.setItem('jwtToken', data.jwtToken);
          await AsyncStorage.setItem('userId', data.user.id);
          await AsyncStorage.setItem('isLoggedIn', 'true');
          Alert.alert('Success', 'Login successful');
          console.log('User ID:', data.user.id);
          bottomSheetModalRef.current?.present();
        } else {
          console.log('Navigating to OTP screen with phone number:', inputValue);
          navigation.navigate('Auth', {
            screen: 'OTP',
            params: {
              phoneNumber: inputValue,
              email: '',
              name: '',
              referralCode: '',
              password: '',
            },
          });
        }
      } else {
        Alert.alert('Error', data.message || 'Login failed');
        await AsyncStorage.setItem('isLoggedIn', 'false');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Network error. Please try again.');
      await AsyncStorage.setItem('isLoggedIn', 'false');
    } finally {
      setLoading(false);
    }
  };

  const openEmailApp = () => {
    Linking.openURL('mailto:');
    bottomSheetModalRef.current?.dismiss();
    navigation.navigate('Main', { screen: 'HomePage' });
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView edges={['top']} className="flex-1 bg-white">
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View className="flex-1 justify-between bg-white px-6">
            {/* SVG Graphic */}
            <View className="mb-6 items-center">
              <LoginLogo width="256" height="256" />
            </View>

            {/* Heading */}
            <View className="mb-2 items-center">
              <Text className="font-blackshield text-3xl font-bold leading-[140%] text-gray-800">
                Welcome to <Text className="text-[#F15A29]">FestGo</Text> world
              </Text>
              <Text className="mt-1 font-baloo text-gray-500">Sign in to your account</Text>
            </View>

            {/* Input Fields */}
            <View className="mt-4 h-14 flex-row items-center rounded-[35px] border border-[#A4A4A4] bg-white px-[25px]">
              {loginType === 'email' ? (
                <MailIcon width={20} height={20} style={{ marginRight: 10 }} />
              ) : (
                <PhoneIcon width={20} height={20} style={{ marginRight: 10 }} />
              )}
              <TextInput
                className="flex-1 text-gray-800"
                placeholder={loginType === 'email' ? 'Email' : 'Phone Number'}
                placeholderTextColor="#9CA3AF"
                style={{ paddingVertical: 0 }}
                value={inputValue}
                onChangeText={setInputValue}
                keyboardType={loginType === 'email' ? 'email-address' : 'phone-pad'}
                autoCapitalize="none"
              />
            </View>

            <View className="flex w-full items-end justify-end">
              <TouchableOpacity onPress={handleLoginTypeToggle}>
                <Text className="text-md mb-3 mt-2 font-baloo font-bold leading-[140%] text-[#F15A29]">
                  Login/signup using {loginType === 'email' ? 'mobile' : 'email'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <Button
              title={loading ? 'Please wait...' : 'Confirm'}
              variant="primary"
              className="mb-4 items-center rounded-full bg-[#F15A29] p-3 font-blackshield"
              onPress={handleLogin}
              disabled={loading}
            />

            {/* Divider */}
            <View className="mb-4 flex-row items-center">
              <View className="h-px flex-1 bg-gray-300" />
              <Text className="mx-3 text-gray-500">or login with</Text>
              <View className="h-px flex-1 bg-gray-300" />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity className="mb-3 h-14 flex-row items-center justify-center rounded-2xl border border-[#E2E8F0] p-3">
              <FacebookIcon width={20} height={20} />
              <Text className="ml-2 font-baloo text-gray-700">Login with Facebook</Text>
            </TouchableOpacity>

            <TouchableOpacity className="h-14 flex-row items-center justify-center rounded-2xl border border-[#E2E8F0] p-3">
              <GoogleIcon width={20} height={20} />
              <Text className="ml-2 font-baloo text-gray-700">Login with Google</Text>
            </TouchableOpacity>

            {/* Bottom Color Div */}
            <View className="mt-6 h-4 flex-row">
              <View className="flex-1 rounded-l-md bg-[#00A450]" />
              <View className="flex-1 rounded-r-md bg-[#F15A29]" />
            </View>
          </View>
        </TouchableWithoutFeedback>

        {/* Email Verification Bottom Sheet */}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={['50%']}
          backgroundStyle={{ backgroundColor: 'white' }}
          handleIndicatorStyle={{ backgroundColor: '#E2E8F0' }}>
          <BottomSheetView className="flex-1 items-center justify-center px-6">
            {/* Success Icon */}
            <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-100">
              {/* <CheckIcon width={40} height={40} color="#10B981" /> */}
            </View>

            {/* Title */}
            <Text className="mb-4 text-center font-blackshield text-xl font-bold text-gray-800">
              Verification Email Sent
            </Text>

            {/* Description */}
            <Text className="mb-8 text-center font-baloo leading-6 text-gray-600">
              A verification email has been sent to your email {inputValue}. Please check your email
              and click the link provided in the email to complete your account registration.
            </Text>

            {/* Open Email Button */}
            <TouchableOpacity
              onPress={openEmailApp}
              className="w-full rounded-full bg-[#F15A29] px-6 py-4">
              <Text className="text-center font-blackshield font-bold text-white">
                Open Email App
              </Text>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
};

export default LoginScreen;
