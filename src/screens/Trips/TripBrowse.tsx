import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import WalletIcon from '~/assets/images/common/Navbar/walletLight.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';
import Svg, { Path } from 'react-native-svg';
import BottomMenu from '~/components/common/BottomMenu';

const TripBrowse: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [trips, setTrips] = useState<any[]>([]);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = await AsyncStorage.getItem('jwtToken');
        if (!token) {
          Alert.alert('Login required', 'Please log in to view your trips.');
          setLoading(false);
          return;
        }
        const resp = await fetch(`${API_URL}/trips/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await resp.json();
        if (data.success) {
          setTrips(data.trips || []);
        } else {
          Alert.alert('Error', data.message || 'Failed to fetch trips');
        }
      } catch (e) {
        console.error('Fetch trips error', e);
        Alert.alert('Error', 'Network error while fetching trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator color="#F15A29" size="large" />
        <Text className="mt-3 text-gray-600">Loading trips...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden">
          <Image
            source={require('~/assets/images/trips/bg.png')}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <UserProfileLight width={32} height={32} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} className="mr-4">
              <WalletIcon width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <NotificationIcon width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation and Title */}
        <View
          style={{
            position: 'absolute',
            top: 110,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            zIndex: 2,
          }}>
          <TouchableOpacity onPress={handleBack} style={{ marginRight: 10 }}>
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="font-baloo" style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            Book a Trip
          </Text>
        </View>
      </View>
      {/* Removed ScrollView to avoid VirtualizedLists inside ScrollViews */}
      <View className="flex-1 bg-white -mt-20 rounded-t-[40px]" style={{ paddingHorizontal: 16, paddingTop: 52 }}>
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="mb-4 rounded-[20px] bg-white border flex-row"
              onPress={() => navigation.navigate('TripDetailsFlow', { trip: item })}
            >
              <Image source={require('~/assets/images/trips/bus.png')} style={{ width: 110, height: 100, borderRadius: 20 }} />
              <View className="ml-3 flex-1 items-start h-full justify-center">
                <Text className="font-baloo font-semibold text-lg">{item.tripName}</Text>
                <Text className="text-gray-600 mt-1">{item.startDate} → {item.endDate}</Text>
                <Text className="text-gray-600">{item.numberOfDays} days</Text>
                <Text className="text-gray-600">{item.price} INR</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={<Text className="text-center text-gray-500 mt-10">No trips found</Text>}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={trips && trips.length === 0 ? undefined : { paddingBottom: 32 }}
        />
      </View>
      <BottomMenu />
    </View>
  );
};

export default TripBrowse;

