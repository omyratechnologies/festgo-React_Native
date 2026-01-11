import { MainStackParamList } from './types';
import HomePage from '~/screens/HomePage/HomePage';
import ProfileScreen from '~/screens/Profile/ProfileScreen';
import { ProtectedScreenWrapper } from '~/components/providers/ProtectedScreenWrapper';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReferAndEarn from '~/screens/Profile/ReferAndEarn';
import EditProfile from '~/screens/Profile/EditProfile';
import MyOrders from '~/screens/Profile/MyOrders';
import WalletScreen from '~/screens/Profile/WalletScreen';
import NotificationsScreen from '~/screens/Profile/NotificationsScreen';
import OrderDetails from '~/screens/Profile/OrderDetails';
import WishlistPage from '~/screens/Profile/WishlistPage';
import SavedCards from '~/screens/Profile/SavedCards';
import HotelBooking from '~/screens/HotelBooking/HotelBooking';
import HotelBookingSingleDetail from '~/screens/HotelBooking/HotelBookingSingleDetail';
import HotelBookingSearch from '~/screens/HotelBooking/HotelBookingSearch';
import HotelBookingCheckout from '~/screens/HotelBooking/ConfirmScreen';
import UpcomingScreen from '~/screens/HomePage/UpcomingScreen';
import HelpScreen from '~/screens/Profile/HelpScreen';
import EventsPage from '~/screens/Events/EventsPage';
import EventInfoPage from '~/screens/Events/EventInfoPage';
import CityFests from '~/screens/CityFests/CityFests';
import CityFestCategories from '~/screens/CityFests/CityFestCategories';
import CityFestDetails from '~/screens/CityFests/CityFestDetails';
import CityFestSectionSelection from '~/screens/CityFests/CityFestSectionSelection';
import CityFestCheckout from '~/screens/CityFests/CityFestCheckout';
import BeachFestCheckout from '~/screens/BeachFests/BeachFestCheckout';
import BeachFest from '~/screens/BeachFests/BeachFest';
import FestBite from '~/screens/FestBite/FestBite';
import RecommendAndEarn from '~/screens/Profile/RecommendAndEarn';
import OffersPage from '~/screens/Profile/OffersPage';
import GSTDetails from '~/screens/Profile/GSTDetails';
import DeviceActivityScreen from '~/screens/Profile/DeviceActivityScreen';
import BookingSuccessScreen from '~/screens/common/BookingSuccessScreen';
import PaymentWebView from '~/screens/Payments/PaymentWebView';
import TripsScreen from '~/screens/Trips/TripsScreen';
import TripBrowse from '~/screens/Trips/TripBrowse';
import TripDetailsFlow from '~/screens/Trips/TripDetailsFlow';
import TripPlan from '~/screens/Trips/TripPlan';

const Stack = createNativeStackNavigator<MainStackParamList>();

// Helper components to wrap protected screens
const ProtectedProfileScreen = () => (
  <ProtectedScreenWrapper><ProfileScreen /></ProtectedScreenWrapper>
);
const ProtectedReferAndEarn = () => (
  <ProtectedScreenWrapper><ReferAndEarn /></ProtectedScreenWrapper>
);
const ProtectedRecommendAndEarn = () => (
  <ProtectedScreenWrapper><RecommendAndEarn /></ProtectedScreenWrapper>
);
const ProtectedEditProfile = () => (
  <ProtectedScreenWrapper><EditProfile /></ProtectedScreenWrapper>
);
const ProtectedMyOrders = () => (
  <ProtectedScreenWrapper><MyOrders /></ProtectedScreenWrapper>
);
const ProtectedMyOrderDetails = (props: any) => (
  <ProtectedScreenWrapper><OrderDetails {...props} /></ProtectedScreenWrapper>
  
);
const ProtectedWallet = () => (
  <ProtectedScreenWrapper><WalletScreen /></ProtectedScreenWrapper>
);
const ProtectedNotifications = () => (
  <ProtectedScreenWrapper><NotificationsScreen /></ProtectedScreenWrapper>
);
const ProtectedWishlist = () => (
  <ProtectedScreenWrapper><WishlistPage /></ProtectedScreenWrapper>
);
const ProtectedOffers = () => (
  <ProtectedScreenWrapper><OffersPage /></ProtectedScreenWrapper>
);
const ProtectedSavedCards = () => (
  <ProtectedScreenWrapper><SavedCards /></ProtectedScreenWrapper>
);
const ProtectedHelpScreen = () => (
  <ProtectedScreenWrapper><HelpScreen /></ProtectedScreenWrapper>
);
const ProtectedGSTDetails = () => (
  <ProtectedScreenWrapper><GSTDetails /></ProtectedScreenWrapper>
);
const ProtectedDeviceActivityScreen = () => (
  <ProtectedScreenWrapper><DeviceActivityScreen /></ProtectedScreenWrapper>
);
const ProtectedCityFestCheckout = () => (
  <ProtectedScreenWrapper><CityFestCheckout /></ProtectedScreenWrapper>
);
const ProtectedHotelBookingCheckout = () => (
  <ProtectedScreenWrapper><HotelBookingCheckout /></ProtectedScreenWrapper>
);

export const MainNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'simple_push' }}
      initialRouteName="HomePage">
        {/* Public screens - no authentication required */}
        <Stack.Screen 
          name="HomePage" 
          component={HomePage} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="EventsPage" component={EventsPage} />
        <Stack.Screen name="EventsInfoPage" component={EventInfoPage} />
        <Stack.Screen name="CityFestsPage" component={CityFests} />
        <Stack.Screen name="CityFestCategory" component={CityFestCategories} />
        <Stack.Screen name="CityFestDetails" component={CityFestDetails} />
        <Stack.Screen name="CityFestSectionSelection" component={CityFestSectionSelection} />
        <Stack.Screen name="BeachFestsPage" component={BeachFest} />
        <Stack.Screen name="FestBite" component={FestBite} />
        <Stack.Screen 
          name="UpcomingScreen" 
          component={UpcomingScreen} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="TripsScreen" component={TripsScreen} />
        <Stack.Screen name="TripBrowse" component={TripBrowse} />
        <Stack.Screen name="TripDetailsFlow" component={TripDetailsFlow} />
        <Stack.Screen name="TripPlan" component={TripPlan} />

        {/* Hotel Booking Screens - Public viewing, protected checkout */}
        <Stack.Screen name="HotelBooking" component={HotelBooking} />
        <Stack.Screen name="HotelBookingDetails" component={HotelBookingSingleDetail} />
        <Stack.Screen name="HotelBookingSearch" component={HotelBookingSearch} />

        {/* Protected screens - authentication required */}
        <Stack.Screen name="Profile" component={ProtectedProfileScreen} />
        <Stack.Screen 
          name="ReferAndEarn" 
          component={ProtectedReferAndEarn} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="RecommendAndEarn" component={ProtectedRecommendAndEarn} />
        <Stack.Screen name="EditProfile" component={ProtectedEditProfile} />
        <Stack.Screen name="MyOrders" component={ProtectedMyOrders} />
        <Stack.Screen name="MyOrderDetails" component={ProtectedMyOrderDetails} />
        <Stack.Screen name="Wallet" component={ProtectedWallet} />
        <Stack.Screen name="Notifications" component={ProtectedNotifications} />
        <Stack.Screen name="Wishlist" component={ProtectedWishlist} />
        <Stack.Screen name="Offers" component={ProtectedOffers} />
        <Stack.Screen name="SavedCards" component={ProtectedSavedCards} />
        <Stack.Screen 
          name="HelpScreen" 
          component={ProtectedHelpScreen} 
          options={{ animation: 'none' }}
        />
        <Stack.Screen name="GSTDetails" component={ProtectedGSTDetails} />
        <Stack.Screen name="DeviceActivityScreen" component={ProtectedDeviceActivityScreen} />

        {/* Protected checkout screens */}
        <Stack.Screen name="CityFestCheckout" component={ProtectedCityFestCheckout} />
        <Stack.Screen name="BeachFestCheckout" component={BeachFestCheckout} />
        <Stack.Screen name="HotelBookingCheckout" component={ProtectedHotelBookingCheckout} />

        {/* Payment Screen */}
        <Stack.Screen name="PaymentWebView" component={PaymentWebView} />

        {/* Booking Success Screen */}
        <Stack.Screen name="BookingSuccess" component={BookingSuccessScreen} />
      </Stack.Navigator>
  );
};
