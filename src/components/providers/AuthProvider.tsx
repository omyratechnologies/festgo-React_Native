import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import useUserStore from '~/store/userStore';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { isLoading } = useUserStore();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#F15A29" />
      </View>
    );
  }

  return <>{children}</>;
}; 