import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Welcome: undefined;
  Auth: { screen: string };
  Main: undefined;
  Services: undefined;
  HomePage: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Profile: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  OTP: {
    phoneNumber: string;
    email: string;
    name: string;
    referralCode: string;
    password: string;
  };
  VerifyDetails: {
    email: string;
    password: string;
  };
  SignupScreen: undefined;
  Onboarding: undefined;
};


export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;