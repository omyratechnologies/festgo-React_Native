import { MainStackParamList } from './types';
import HomePage from '~/screens/HomePage/HomePage';
import ProfileScreen from '~/screens/Profile/ProfileScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReferAndEarn from '~/screens/Profile/ReferAndEarn';
import EditProfile from '~/screens/Profile/EditProfile';
import MyOrders from '~/screens/Profile/MyOrders';
import WalletScreen from '~/screens/Profile/WalletScreen';
import OrderDetails from '~/screens/Profile/OrderDetails';
import WishlistPage from '~/screens/Profile/WishlistPage';
import SavedCards from '~/screens/Profile/SavedCards';
import HotelBooking from '~/screens/HotelBooking/HotelBooking';

const Stack = createNativeStackNavigator<MainStackParamList>();

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'simple_push' }}
      initialRouteName="HomePage">
      <Stack.Screen name="HomePage" component={HomePage} />

      {/* Profile pages */}
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="ReferAndEarn" component={ReferAndEarn} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="MyOrderDetails" component={OrderDetails} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Wishlist" component={WishlistPage} />
      <Stack.Screen name="SavedCards" component={SavedCards} />

      {/* Hotel Booking Screens */}
      <Stack.Screen name="HotelBooking" component={HotelBooking} />
    </Stack.Navigator>
  );
};
