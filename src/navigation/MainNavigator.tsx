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
import HotelBookingSingleDetail from '~/screens/HotelBooking/HotelBookingSingleDetail';
import HotelBookingSearch from '~/screens/HotelBooking/HotelBookingSearch';
import UpcomingScreen from '~/screens/HomePage/UpcomingScreen';
import HelpScreen from '~/screens/Profile/HelpScreen';
import EventsPage from '~/screens/Events/EventsPage';
import EventInfoPage from '~/screens/Events/EventInfoPage';
import CityFests from '~/screens/CityFests/CityFests';
import CityFestCategories from '~/screens/CityFests/CityFestCategories';
import CityFestDetails from '~/screens/CityFests/CityFestDetails';
import CityFestCheckout from '~/screens/CityFests/CityFestCheckout';
import BeachFestCheckout from '~/screens/BeachFests/BeachFestCheckout';
import BeachFest from '~/screens/BeachFests/BeachFest';
import FestBite from '~/screens/FestBite/FestBite';
import RecommendAndEarn from '~/screens/Profile/RecommendAndEarn';

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
      <Stack.Screen name="RecommendAndEarn" component={RecommendAndEarn} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="MyOrders" component={MyOrders} />
      <Stack.Screen name="MyOrderDetails" component={OrderDetails} />
      <Stack.Screen name="Wallet" component={WalletScreen} />
      <Stack.Screen name="Wishlist" component={WishlistPage} />
      <Stack.Screen name="UpcomingScreen" component={UpcomingScreen} />
      <Stack.Screen name="SavedCards" component={SavedCards} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />

      <Stack.Screen name="EventsPage" component={EventsPage} />
      <Stack.Screen name="EventsInfoPage" component={EventInfoPage} />

      <Stack.Screen name="CityFestsPage" component={CityFests} />
      <Stack.Screen name="CityFestCategory" component={CityFestCategories} />
      <Stack.Screen name="CityFestDetails" component={CityFestDetails} />
      <Stack.Screen name="CityFestCheckout" component={CityFestCheckout} />

      <Stack.Screen name="BeachFestsPage" component={BeachFest} />
      <Stack.Screen name="BeachFestCheckout" component={BeachFestCheckout} />

      <Stack.Screen name="FestBite" component={FestBite} />

      {/* Hotel Booking Screens */}
      <Stack.Screen name="HotelBooking" component={HotelBooking} />
      <Stack.Screen name="HotelBookingDetails" component={HotelBookingSingleDetail} />
      <Stack.Screen name="HotelBookingSearch" component={HotelBookingSearch} />
    </Stack.Navigator>
  );
};
