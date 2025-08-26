import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import Svg, { Path } from 'react-native-svg';
import BottomMenu from '~/components/common/BottomMenu';

interface BookingSuccessScreenProps {
  route: {
    params: {
      bookingData: any;
      paymentId: string;
      bookingType: 'beachfest' | 'hotel' | 'event';
    };
  };
}

const BookingSuccessScreen: React.FC<BookingSuccessScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp>();
  const { bookingData, paymentId, bookingType } = route.params;

  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getBookingTypeIcon = () => {
    switch (bookingType) {
      case 'beachfest':
        return (
          <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
            <Path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="#22C55E"
            />
          </Svg>
        );
      case 'hotel':
        return (
          <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
            <Path
              d="M7 13c1.65 0 3-1.35 3-3S8.65 7 7 7s-3 1.35-3 3 1.35 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"
              fill="#0E54EC"
            />
          </Svg>
        );
      case 'event':
        return (
          <Svg width={60} height={60} viewBox="0 0 24 24" fill="none">
            <Path
              d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"
              fill="#F15A29"
            />
          </Svg>
        );
      default:
        return null;
    }
  };

  const getBookingTypeTitle = () => {
    switch (bookingType) {
      case 'beachfest':
        return 'BeachFest Booking Confirmed!';
      case 'hotel':
        return 'Hotel Booking Confirmed!';
      case 'event':
        return 'Event Booking Confirmed!';
      default:
        return 'Booking Confirmed!';
    }
  };

  const handleViewBookings = () => {
    navigation.navigate('Main', { screen: 'Profile' });
  };

  const handleGoHome = () => {
    navigation.navigate('Main', { screen: 'HomePage' });
  };

  const handleShareBooking = () => {
    // Implement sharing functionality
    Alert.alert('Share', 'Sharing functionality will be implemented here');
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Success Header */}
          <View className="items-center bg-gradient-to-b from-green-50 to-white px-6 py-8">
            <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-green-100">
              {getBookingTypeIcon()}
            </View>
            <Text className="mb-2 text-center font-blackshield text-2xl font-bold text-gray-800">
              {getBookingTypeTitle()}
            </Text>
            <Text className="text-center font-baloo text-gray-600">
              Your booking has been successfully confirmed
            </Text>
          </View>

          {/* Booking Details */}
          <View className="px-6 py-6">
            <Text className="mb-4 font-blackshield text-xl font-bold text-gray-800">
              Booking Details
            </Text>

            <View className="mb-6 rounded-xl bg-gray-50 p-4">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Booking ID</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  #{bookingData?.id?.slice(-8) || 'N/A'}
                </Text>
              </View>

              {bookingType === 'beachfest' && (
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Event Name</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.beachfest_name || 'BeachFest'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Passes</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.passes || 0}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Event Date</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.event_start ? formatDate(bookingData.event_start) : 'N/A'}
                    </Text>
                  </View>
                </>
              )}

              {bookingType === 'hotel' && (
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Hotel Name</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.hotel_name || 'Hotel'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Check-in</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.check_in ? formatDate(bookingData.check_in) : 'N/A'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Check-out</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.check_out ? formatDate(bookingData.check_out) : 'N/A'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Nights</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.nights || 1}
                    </Text>
                  </View>
                </>
              )}

              {bookingType === 'event' && (
                <>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Event Name</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.event_name || 'Event'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Event Date</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.event_date ? formatDate(bookingData.event_date) : 'N/A'}
                    </Text>
                  </View>
                  <View className="mb-2 flex-row items-center justify-between">
                    <Text className="font-baloo text-sm text-gray-600">Tickets</Text>
                    <Text className="font-baloo font-semibold text-gray-800">
                      {bookingData?.tickets || 0}
                    </Text>
                  </View>
                </>
              )}

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Guest Name</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {bookingData?.name || bookingData?.guest_name || 'N/A'}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Email</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {bookingData?.email || 'N/A'}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Phone</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {bookingData?.phone || 'N/A'}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Payment Method</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {bookingData?.payment_method || 'N/A'}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Payment Status</Text>
                <View className="flex-row items-center">
                  <View className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                  <Text className="font-baloo font-semibold text-green-600">Paid</Text>
                </View>
              </View>
            </View>

            {/* Payment Details */}
            <View className="mb-6 rounded-xl bg-gray-50 p-4">
              <Text className="mb-4 font-blackshield text-lg font-bold text-gray-800">
                Payment Details
              </Text>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Payment ID</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {paymentId || 'N/A'}
                </Text>
              </View>

              <View className="mb-2 flex-row items-center justify-between">
                <Text className="font-baloo text-sm text-gray-600">Base Price</Text>
                <Text className="font-baloo font-semibold text-gray-800">
                  {formatCurrency(bookingData?.base_price || 0)}
                </Text>
              </View>

              {bookingData?.service_fee && (
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-baloo text-sm text-gray-600">Service Fee</Text>
                  <Text className="font-baloo font-semibold text-gray-800">
                    {formatCurrency(bookingData.service_fee)}
                  </Text>
                </View>
              )}

              {bookingData?.gst_fee && (
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-baloo text-sm text-gray-600">GST ({bookingData?.gst_percentage || 18}%)</Text>
                  <Text className="font-baloo font-semibold text-gray-800">
                    {formatCurrency(bookingData.gst_fee)}
                  </Text>
                </View>
              )}

              {bookingData?.festgo_coin_discount && (
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-baloo text-sm text-green-600">FestGo Coins Used</Text>
                  <Text className="font-baloo font-semibold text-green-600">
                    -{formatCurrency(bookingData.festgo_coin_discount)}
                  </Text>
                </View>
              )}

              {bookingData?.offer_discount && (
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="font-baloo text-sm text-green-600">Offer Discount</Text>
                  <Text className="font-baloo font-semibold text-green-600">
                    -{formatCurrency(bookingData.offer_discount)}
                  </Text>
                </View>
              )}

              <View className="border-t border-gray-200 pt-2">
                <View className="flex-row items-center justify-between">
                  <Text className="font-blackshield text-lg font-bold text-gray-800">Total Paid</Text>
                  <Text className="font-blackshield text-xl font-bold text-[#F15A29]">
                    {formatCurrency(bookingData?.amount_paid || 0)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mb-8 space-y-3">
              <TouchableOpacity
                onPress={handleViewBookings}
                className="rounded-full bg-[#F15A29] py-4">
                <Text className="text-center font-baloo text-lg font-bold text-white">
                  View My Bookings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleShareBooking}
                className="rounded-full border-2 border-[#F15A29] py-4">
                <Text className="text-center font-baloo text-lg font-bold text-[#F15A29]">
                  Share Booking Details
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleGoHome}
                className="rounded-full bg-gray-100 py-4">
                <Text className="text-center font-baloo text-lg font-bold text-gray-600">
                  Back to Home
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

export default BookingSuccessScreen;
