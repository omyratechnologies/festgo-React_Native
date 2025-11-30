import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, RefreshControl, Alert } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MainTabNavigationProp, MainStackParamList } from '~/navigation/types';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import dayjs from 'dayjs';
import { API_URL } from '~/utils/api';
import { cancelBooking, getBookingDetails } from '~/utils/payment';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TABS = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const MyOrders = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<RouteProp<MainStackParamList, 'MyOrders'>>();
  const filter = route.params?.filter; // 'hotel' | 'event' | 'beachfest' | undefined
  const [activeTab, setActiveTab] = useState('upcoming');
  const [propertyBookings, setPropertyBookings] = useState<any[]>([]);
  const [eventBookings, setEventBookings] = useState<any[]>([]);
  const [beachfestBookings, setBeachfestBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const res = await fetch(`${API_URL}/property-booking/my-bookings`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await res.json();
      setPropertyBookings(data.propertyBookings || []);
      setEventBookings(data.events || []);
      setBeachfestBookings(data.beachfestBookings || []);
    } catch (e) {
      console.error('Error fetching orders:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, [fetchOrders]);

  // Helper to determine if an event is upcoming or completed
  const isUpcoming = (date: string) => {
    return dayjs(date).isAfter(dayjs(), 'day');
  };

  // Map and filter bookings by tab
  const filteredEventBookings = eventBookings.filter((event) =>
    activeTab === 'upcoming' ? isUpcoming(event.eventDate) : !isUpcoming(event.eventDate)
  );

  const filteredPropertyBookings = propertyBookings.filter((booking) =>
    activeTab === 'upcoming'
      ? isUpcoming(booking.checkInDate || booking.bookedDate)
      : !isUpcoming(booking.checkInDate || booking.bookedDate)
  );

  const filteredBeachfestBookings = beachfestBookings.filter((booking) =>
    activeTab === 'upcoming'
      ? isUpcoming(booking.eventDate || booking.bookedDate)
      : !isUpcoming(booking.eventDate || booking.bookedDate)
  );

  // Helper to get days left or completed
  const getDaysLeft = (date: string) => {
    const today = dayjs();
    const eventDate = dayjs(date);
    const diff = eventDate.diff(today, 'day');
    return diff > 0 ? `${diff} days left` : 'Completed';
  };

  // Handle booking card press
  const handleBookingPress = async (booking: any, type: 'event' | 'hotel' | 'beachfest') => {
    try {
      const bookingDetails = await getBookingDetails(booking.id, type);
      // Navigate to booking details screen or show details modal
      Alert.alert(
        'Booking Details',
        `Booking ID: ${booking.id}\nType: ${type}\nStatus: ${booking.status || 'Confirmed'}`,
        [
          { text: 'OK', style: 'default' },
          { text: 'Cancel Booking', style: 'destructive', onPress: () => handleCancelBooking(booking.id, type) },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to load booking details');
    }
  };

  // Handle booking cancellation
  const handleCancelBooking = async (bookingId: string, type: 'event' | 'hotel' | 'beachfest') => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await cancelBooking(bookingId, type);
              if (success) {
                Alert.alert('Success', 'Booking cancelled successfully');
                fetchOrders(); // Refresh the list
              } else {
                Alert.alert('Error', 'Failed to cancel booking');
              }
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to cancel booking');
            }
          },
        },
      ]
    );
  };

  // Render a single event booking card
  const renderEventBooking = (event: any) => (
    <TouchableOpacity
      key={event.id}
      className="mb-4 flex-row rounded-xl bg-white p-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => handleBookingPress(event, 'event')}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: event.eventTypeImage }}
        className="h-20 w-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />
      <View className="flex-1 pl-3">
        <Text className="font-baloo text-base font-bold text-black">{event.eventType}</Text>
        <Text className="text-xs text-gray-500 mt-1">{event.eventLocation}</Text>
        <Text className="text-xs text-gray-500 mt-1">
          Guests: {event.numberOfGuests}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Date: {dayjs(event.eventDate).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Booked On: {dayjs(event.createdAt).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs mt-1" style={{ color: isUpcoming(event.eventDate) ? '#F15A29' : '#888' }}>
          {getDaysLeft(event.eventDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render a single property booking card
  const renderPropertyBooking = (booking: any) => (
    <TouchableOpacity
      key={booking.id}
      className="mb-4 flex-row rounded-xl bg-white p-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => handleBookingPress(booking, 'hotel')}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: booking.propertyImage || 'https://festgo.blr1.digitaloceanspaces.com/festgo/public/1753272751709-dd0009ac8f8325258b38268cf5026b7bae72c4ba.png' }}
        className="h-20 w-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />
      <View className="flex-1 pl-3">
        <Text className="font-baloo text-base font-bold text-black">{booking.propertyName || 'Property Booking'}</Text>
        <Text className="text-xs text-gray-500 mt-1">{booking.location || booking.address}</Text>
        <Text className="text-xs text-gray-500 mt-1">
          Date: {dayjs(booking.checkInDate || booking.bookedDate).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Booked On: {dayjs(booking.createdAt).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs mt-1" style={{ color: isUpcoming(booking.checkInDate || booking.bookedDate) ? '#F15A29' : '#888' }}>
          {getDaysLeft(booking.checkInDate || booking.bookedDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Render a single beachfest booking card
  const renderBeachfestBooking = (booking: any) => (
    <TouchableOpacity
      key={booking.id}
      className="mb-4 flex-row rounded-xl bg-white p-3"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => handleBookingPress(booking, 'beachfest')}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: booking.image_url || 'https://festgo.blr1.digitaloceanspaces.com/festgo/public/1753272751709-dd0009ac8f8325258b38268cf5026b7bae72c4ba.png' }}
        className="h-20 w-20 rounded-lg bg-gray-200"
        resizeMode="cover"
      />
      <View className="flex-1 pl-3">
        <Text className="font-baloo text-base font-bold text-black">{booking.fest_type || 'Beach Fest'}</Text>
        <Text className="text-xs text-gray-500 mt-1">{booking.location || booking.venue}</Text>
        <Text className="text-xs text-gray-500 mt-1">
          Date: {dayjs(booking.eventDate || booking.bookedDate).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs text-gray-500 mt-1">
          Booked On: {dayjs(booking.createdAt).format('DD MMM YYYY')}
        </Text>
        <Text className="text-xs mt-1" style={{ color: isUpcoming(booking.eventDate || booking.bookedDate) ? '#F15A29' : '#888' }}>
          {getDaysLeft(booking.eventDate || booking.bookedDate)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="My Orders" />
      {/* Tabs */}
      <View className="w-full flex-row items-center justify-center px-12 pb-2 pt-4 ">
        {TABS.map((tab) => (
          <TouchableOpacity key={tab.key} className="w-1/3" onPress={() => setActiveTab(tab.key)}>
            <Text
              style={{
                color: activeTab === tab.key ? '#F15A29' : '#888',
                fontWeight: activeTab === tab.key ? 'bold' : 'normal',
                borderBottomWidth: 2,
                borderBottomColor: activeTab === tab.key ? '#F15A29' : '#D9D9D9',
                paddingBottom: 4,
                fontSize: 16,
              }}
              className="text-center font-baloo">
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#F15A29" />
        }
      >
        <View className="p-4">
          {loading && (
            <Text className="text-center text-gray-500 mt-8">Loading your bookings...</Text>
          )}
          {!loading && (() => {
            // Check if there are any bookings to show based on filter
            const hasEventBookings = (!filter || filter === 'event') && filteredEventBookings.length > 0;
            const hasPropertyBookings = (!filter || filter === 'hotel') && filteredPropertyBookings.length > 0;
            const hasBeachfestBookings = (!filter || filter === 'beachfest') && filteredBeachfestBookings.length > 0;
            const hasNoBookings = !hasEventBookings && !hasPropertyBookings && !hasBeachfestBookings;
            
            if (hasNoBookings) {
              const filterLabel = filter === 'hotel' ? 'hotel/resort' : filter === 'event' ? 'event' : filter === 'beachfest' ? 'beach fest' : '';
              return (
                <Text className="text-center text-gray-500 mt-8">
                  No {activeTab === 'upcoming' ? 'upcoming' : activeTab === 'completed' ? 'completed' : 'cancelled'} {filterLabel ? `${filterLabel} ` : ''}bookings found.
                </Text>
              );
            }
            return null;
          })()}
          {/* Event Bookings - show only if filter is 'event' or no filter */}
          {(!filter || filter === 'event') && filteredEventBookings.map(renderEventBooking)}
          {/* Property Bookings - show only if filter is 'hotel' or no filter */}
          {(!filter || filter === 'hotel') && filteredPropertyBookings.map(renderPropertyBooking)}
          {/* Beachfest Bookings - show only if filter is 'beachfest' or no filter */}
          {(!filter || filter === 'beachfest') && filteredBeachfestBookings.map(renderBeachfestBooking)}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default MyOrders;
