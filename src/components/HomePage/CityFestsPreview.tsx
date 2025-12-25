import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import { API_URL } from '~/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CityFest {
  id: string;
  categoryId: string;
  location: string;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  cityfest_category_name: string;
  pricing_types: any[];
}

const CityFestsPreview = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [fests, setFests] = useState<CityFest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFests = async () => {
      try {
        setLoading(true);
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          setFests([]);
          setLoading(false);
          return;
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        };
        
        const response = await fetch(`${API_URL}/city-fests/getall/cityfests`, {
          method: 'GET',
          headers,
        });
        const data = await response.json();
        if (data.success && data.fests) {
          // Show only first 6 fests
          setFests(data.fests.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching fests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFests();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date;
  };

  if (loading) {
    return (
      <View className="items-center justify-center py-4">
        <ActivityIndicator size="small" color="#0E54EC" />
      </View>
    );
  }

  if (fests.length === 0) {
    return null;
  }

  return (
    <View className="mb-6 px-4">
      <View className="mb-4 flex-row items-center justify-between">
        <Text className="font-baloo text-xl font-bold text-black">City Fests</Text>
        <TouchableOpacity onPress={() => navigation.navigate('CityFestsPage')}>
          <Text className="font-poppins text-sm font-medium text-[#0E54EC]">See all</Text>
        </TouchableOpacity>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        <View className="flex-row gap-4">
          {fests.map((fest) => (
            <TouchableOpacity
              key={fest.id}
              className="w-48"
              onPress={() => navigation.navigate('CityFestDetails', { festId: fest.id })}>
              <View className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image
                  source={{
                    uri: fest.image_urls?.[0] || 'https://via.placeholder.com/300',
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
                {/* Date Badge - Quarter Circle */}
                <View
                  style={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    backgroundColor: '#0E54EC',
                    borderRadius: 9999,
                    width: 80,
                    height: 80,
                    zIndex: 3,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                    paddingBottom: 8,
                    paddingLeft: 8,
                  }}>
                  <Text className="text-center text-base font-bold leading-none text-white">
                    {formatDate(fest.event_start).getDate()}
                  </Text>
                  <Text className="text-xs text-center font-semibold leading-none text-white">
                    {formatDate(fest.event_start)
                      .toLocaleDateString('en-US', { month: 'short' })
                      .toUpperCase()}
                  </Text>
                </View>
                {/* Gradient Overlay */}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: '50%',
                    backgroundColor: 'rgba(0,0,0,0.4)',
                  }}
                />
                {/* Event Details Overlay */}
                <View
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    padding: 12,
                    zIndex: 2,
                  }}>
                  <Text className="text-base font-bold text-white" numberOfLines={1}>
                    {fest.cityfest_category_name || 'City Fest'}
                  </Text>
                  <Text className="text-sm text-gray-200" numberOfLines={1}>
                    {fest.location ? fest.location : ''}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default CityFestsPreview;

