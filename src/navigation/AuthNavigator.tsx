import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';

import { AuthStackParamList } from './types';

import LoginScreen from '~/screens/auth/LoginScreen';
import OTPScreen from '~/screens/auth/OTPScreen';
import SignupScreen from '~/screens/auth/SignupScreen';
import Onboarding from '~/screens/Onboarding/Onboarding';
import EmailVerificationScreen from '~/screens/auth/EmailVerificationScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthNavigatorProps {
  deepLinkParams?: { token: string };
}

export const AuthNavigator = ({ deepLinkParams }: AuthNavigatorProps) => {
  // Determine initial route based on deep link params
  const getInitialRouteName = () => {
    if (deepLinkParams?.token) {
      return 'EmailVerification';
    }
    return 'Onboarding';
  };

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={getInitialRouteName()}>
      <Stack.Screen name="Onboarding" component={Onboarding} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="OTP" component={OTPScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen 
        name="EmailVerification"
        component={({ route }: { route: RouteProp<AuthStackParamList, 'EmailVerification'> }) => {
          // Get token from route params (React Navigation linking) or deepLinkParams (manual handling)
          const token = route.params?.token || deepLinkParams?.token || '';
          return <EmailVerificationScreen token={token} />;
        }}
      />
    </Stack.Navigator>
  );
};
