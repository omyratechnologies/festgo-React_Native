import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';

interface EmailVerificationScreenProps {
  token: string;
}

const EmailVerificationScreen: React.FC<EmailVerificationScreenProps> = ({ token }) => {
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && token.trim() !== '') {
      verifyEmailToken();
    } else {
      console.log('No token provided for email verification');
      setError('No verification token found. Please try clicking the link in your email again.');
      setLoading(false);
    }
  }, [token]);

  const verifyEmailToken = async () => {
    try {
      setLoading(true);
      setError(null);

      // console.log('Verifying email token:', token);

      const response = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
        }),
      });

      const data = await response.json();
      console.log('Email verification response:', data);

      if (data.success) {
        setVerified(true);
        
        // Store user data if provided
        if (data.user && data.user.id) { 
          console.log('Storing user data:', data.user);
          await AsyncStorage.setItem('userId', data.user.id);
          await AsyncStorage.setItem('userData', JSON.stringify(data.user));
        }

        // Store JWT token if provided
        if (data.jwtToken && data.jwtToken !== null && data.jwtToken !== undefined) {
          console.log('Storing JWT token');
          await AsyncStorage.setItem('jwtToken', data.jwtToken);
          await AsyncStorage.setItem('isLoggedIn', 'true');
        }

        // Automatically navigate to homepage without alert
        console.log('Email verified successfully, navigating to homepage');
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main', params: { screen: 'HomePage' } }],
        });
      } else {
        console.log('Email verification failed:', data.message);
        setError(data.message || 'Email verification failed');
      }
    } catch (err) {
      console.error('Email verification error:', err);
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    verifyEmailToken();
  };

  const handleGoToLogin = () => {
    navigation.navigate('Auth', { screen: 'Login' });
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#F15A29" />
          <Text className="mt-4 text-center font-poppins text-lg text-gray-600">
            Verifying your email...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (verified) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center px-6">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <Text className="text-4xl">✓</Text>
          </View>
          <Text className="mb-2 text-center font-poppins text-2xl font-bold text-gray-800">
            Email Verified!
          </Text>
          <Text className="mb-8 text-center font-poppins text-gray-600">
            Your email has been successfully verified.
          </Text>
          <TouchableOpacity
            className="w-full rounded-full bg-[#F15A29] py-4"
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { screen: 'HomePage' } }],
              });
            }}
          >
            <Text className="text-center font-poppins text-lg font-semibold text-white">
              Continue to App
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <Text className="text-4xl">✗</Text>
        </View>
        <Text className="mb-2 text-center font-poppins text-2xl font-bold text-gray-800">
          Verification Failed
        </Text>
        <Text className="mb-8 text-center font-poppins text-gray-600">
          {error || 'Unable to verify your email. The link may be expired or invalid.'}
        </Text>
        <View className="w-full space-y-4">
          <TouchableOpacity
            className="w-full rounded-full bg-[#F15A29] py-4"
            onPress={handleRetry}
          >
            <Text className="text-center font-poppins text-lg font-semibold text-white">
              Try Again
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="w-full rounded-full border-2 border-[#F15A29] py-4"
            onPress={handleGoToLogin}
          >
            <Text className="text-center font-poppins text-lg font-semibold text-[#F15A29]">
              Go to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;
