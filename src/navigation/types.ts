import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';

// Root Stack - switches between Auth and Main flows
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

// Auth Stack - for authentication flow
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

// Main Tab - for main app navigation with tabs
export type MainStackParamList = {
  HomePage: undefined;
  Profile: undefined;
  ReferAndEarn: undefined;
  UpcomingScreen: undefined;

  EventsPage: undefined;
  EventsInfoPage: { eventId: number };


  // profile
  EditProfile: undefined;
  MyOrders: undefined;
  Services: undefined;
  Rewards: undefined;
  MyOrderDetails: { orderId: string };
  Wallet: undefined;
  Wishlist: undefined;
  SavedCards: undefined;
  HelpScreen: undefined;

  
  // hotel bookings
  HotelBooking: undefined;
  HotelBookingDetails: { hotelId: string };
  HotelBookingSearch: undefined;
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainStackParamList>;
