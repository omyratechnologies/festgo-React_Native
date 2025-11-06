import React from 'react';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '~/hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import HomePageLogoIcon from '~/assets/images/homepage/details/HomePageLogo.svg';

interface ProtectedScreenWrapperProps {
  children: React.ReactNode;
}

export const ProtectedScreenWrapper: React.FC<ProtectedScreenWrapperProps> = ({ children }) => {
  const { isLoading, isAuthenticated } = useAuth();
  const navigation = useNavigation<NavigationProp>();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F15A29" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-white px-6">
        <HomePageLogoIcon width={250} height={180} />

        <Text className="text-xl font-bold text-gray-800 mb-4 text-center">
          Login Required
        </Text>
        <Text className="text-gray-600 mb-6 text-center">
          Please login to access this feature
        </Text>
        <TouchableOpacity
          onPress={() => {
            try {
              if (navigation && typeof navigation.navigate === 'function') {
                navigation.navigate('Auth', { screen: 'Login' });
              }
            } catch (error) {
              console.error('Navigation error:', error);
            }
          }}
          className="bg-[#F15A29] px-6 py-3 rounded-full">
          <Text className="text-white font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <>{children}</>;
};
