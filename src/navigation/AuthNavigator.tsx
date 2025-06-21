import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthStackParamList } from './types';

import LoginScreen from '~/screens/auth/LoginScreen';
import OTPScreen from '~/screens/auth/OTPScreen';
import SignupScreen from '~/screens/auth/SignupScreen';
import Onboarding from '~/screens/Onboarding/Onboarding';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="OTP"
        component={OTPScreen}
      />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="Onboarding" component={Onboarding} />
    </Stack.Navigator>
  );
};
