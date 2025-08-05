import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EditIcon from '~/assets/icons/EditIcon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import LuggageBagIcon from '~/assets/icons/profile/LuggageBag.svg';
import DiscountIcon from '~/assets/icons/profile/Discount.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import { API_URL } from '~/utils/api';

interface StatsData {
  icon: any;
  number: number;
  label: string;
  page: string;
  loading?: boolean;
}

const ProfileDetails = ({ data }: { data: any }) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [stats, setStats] = useState<StatsData[]>([
    { icon: LuggageBagIcon, number: 0, label: 'My Orders', page: 'MyOrders', loading: true },
    { icon: HeartIcon, number: 0, label: 'Wishlist', page: 'Wishlist' },
    { icon: DiscountIcon, number: 0, label: 'Offers', page: 'Offers', loading: true },
  ]);

  const fetchOrdersCount = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) return;

      const response = await fetch(`${API_URL}/orders/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => prev.map(stat => 
          stat.label === 'My Orders' 
            ? { ...stat, number: data.count || 0, loading: false }
            : stat
        ));
      } else {
        setStats(prev => prev.map(stat => 
          stat.label === 'My Orders' 
            ? { ...stat, number: 0, loading: false }
            : stat
        ));
      }
    } catch (error) {
      console.error('Error fetching orders count:', error);
      setStats(prev => prev.map(stat => 
        stat.label === 'My Orders' 
          ? { ...stat, number: 0, loading: false }
          : stat
      ));
    }
  };

  const fetchOffersCount = async () => {
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) return;

      const response = await fetch(`${API_URL}/offers/count`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(prev => prev.map(stat => 
          stat.label === 'Offers' 
            ? { ...stat, number: data.count || 0, loading: false }
            : stat
        ));
      } else {
        setStats(prev => prev.map(stat => 
          stat.label === 'Offers' 
            ? { ...stat, number: 0, loading: false }
            : stat
        ));
      }
    } catch (error) {
      console.error('Error fetching offers count:', error);
      setStats(prev => prev.map(stat => 
        stat.label === 'Offers' 
          ? { ...stat, number: 0, loading: false }
          : stat
      ));
    }
  };

  useEffect(() => {
    fetchOrdersCount();
    fetchOffersCount();
  }, []);

  const renderStatItem = (stat: StatsData, idx: number) => (
    <React.Fragment key={stat.label}>
      <TouchableOpacity
        onPress={() => navigation.navigate(stat.page as any)}
        className="flex-1 flex-row items-center justify-center">
        <stat.icon width={24} height={24} className="mr-2" />
        <View className="ml-2">
          {stat.loading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <Text className="font-baloo text-base font-bold text-black">{stat.number}</Text>
          )}
          <Text className="font-baloo text-xs text-gray-700">{stat.label}</Text>
        </View>
      </TouchableOpacity>
      {idx < stats.length - 1 && (
        <View className="mx-2 h-6 w-0.5 rounded-full bg-black opacity-60" />
      )}
    </React.Fragment>
  );

  return (
    <View className="mx-4 mt-6 rounded-2xl bg-[#F15A29] p-5">
      {/* Top Row */}
      <View className="flex-row items-center">
        {/* Profile Picture */}
        <View className="mr-4 rounded-full border-4 border-white">
          <Image
            source={{ uri: data?.image_url || 'https://randomuser.me/api/portraits/men/1.jpg' }}
            className="h-16 w-16 rounded-full"
          />
        </View>
        {/* Name & Email */}
        <View className="flex-1">
          <Text className="font-baloo text-lg font-bold text-white">
            {data?.firstname} {data?.lastname}
          </Text>
          <Text className="font-baloo text-sm text-white opacity-80">{data?.email}</Text>
        </View>
        {/* Edit Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <EditIcon width={30} height={30} className="text-white" />
        </TouchableOpacity>
      </View>

      {/* Profile Completion Bar */}
      <View className="mt-6">
        <View className="h-3 overflow-hidden rounded-full bg-white">
          <View
            className="h-3 rounded-full"
            style={{ width: `${data.profileCompletion && data.profileCompletion ? data.profileCompletion : 0}%`, backgroundColor: '#08F67C' }}
          />
        </View>
        <Text className="mt-2 font-baloo text-sm text-white">
          Your profile is {data.profileCompletion && data.profileCompletion > 0 ? data.profileCompletion : 0}% completed.
        </Text>
      </View> 

      {/* Stats Section */}
      <View className="mt-6 flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
        {stats.map((stat, idx) => renderStatItem(stat, idx))}
      </View>
    </View>
  );
};

export default ProfileDetails;
