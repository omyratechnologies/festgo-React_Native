import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { NavigatorScreenParams } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SearchParams } from '~/screens/HotelBooking/HotelBookingSearch';

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
  RecommendAndEarn: undefined;
  UpcomingScreen: undefined;

  EventsPage: undefined;
  EventsInfoPage: { eventId: string };

  BeachFestsPage: undefined;
  BeachFestCheckout: {
    festId: string;
  };
  BeachFestDetails: { festId: string };

  CityFestsPage: undefined;
  CityFestCategory: { categoryId: string; categoryName: string };
  CityFestDetails: { festId: string };
  CityFestCheckout: {
    festId: string;
  };

  FestBite: undefined;

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
  HotelBookingSearch: {
    searchResults: any; 
    searchParams: SearchParams;
  };
};

export type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainTabNavigationProp = BottomTabNavigationProp<MainStackParamList>;

export type AuthRouteProp<T extends keyof AuthStackParamList> = RouteProp<AuthStackParamList, T>;