import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';
import { API_URL } from '~/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface CityFest {
  id: string;
  categoryId: string;
  location: string;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  whats_included: string[];
  gmap_url: string;
  cityfest_category_name: string;
  pricing_types: any[];
}

const CityFestDetails = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<any>();
  const { festId } = route.params || {};
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');
  const [fest, setFest] = useState<CityFest | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const fetchFestDetails = async () => {
      try {
        setLoading(true);
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
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
          const festData = data.fests.find((f: CityFest) => f.id === festId);
          if (festData) {
            setFest(festData);
          } else {
            console.error('Fest not found with id:', festId);
          }
        } else {
          console.error('API Error:', data);
        }
      } catch (error) {
        console.error('Error fetching fest details:', error);
      } finally {
        setLoading(false);
      }
    };
    if (festId) {
      fetchFestDetails();
    }
  }, [festId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${day}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getMinPrice = (pricingTypes: any[]) => {
    if (!pricingTypes || pricingTypes.length === 0) return '500';
    let minPrice = Infinity;
    pricingTypes.forEach((category) => {
      category.types?.forEach((type: any) => {
        if (type.price < minPrice) {
          minPrice = type.price;
        }
      });
    });
    return minPrice === Infinity ? '500' : minPrice.toString();
  };

  const handleBookNow = () => {
    navigation.navigate('Main', { screen: 'CityFestSectionSelection', params: { festId: festId } });
  };

  const handleOpenMap = () => {
    if (fest?.gmap_url) {
      Linking.openURL(fest.gmap_url);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#0E54EC" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 bg-white">
        {/* Header Section */}
        <View
          style={{
            height: 280,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
            <View className="h-full w-full opacity-20" />
          </View>
          <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
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
          </View>
        </View>
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-2 text-center font-baloo text-2xl font-bold text-gray-800">
            Login Required
          </Text>
          <Text className="mb-6 text-center font-poppins text-base text-gray-600">
            Please login to view fest details
          </Text>
          <TouchableOpacity
            onPress={() => {
              const rootNavigation = navigation.getParent()?.getParent();
              if (rootNavigation) {
                (rootNavigation as any).navigate('Auth', { screen: 'Login' });
              }
            }}
            className="rounded-full bg-[#0E54EC] px-6 py-3">
            <Text className="font-poppins font-semibold text-white">Go to Login</Text>
          </TouchableOpacity>
        </View>
        <BottomMenu />
      </View>
    );
  }

  if (!fest) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="font-poppins text-gray-500">Fest not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View
        style={{
          height: 320,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
          <Image
            source={{
              uri: fest.image_urls?.[0] || 'https://via.placeholder.com/400',
            }}
            className="h-full w-full opacity-30"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity className="flex-row items-center">
              <View className="mr-2 h-8 w-8 rounded-full bg-white/20" />
              <Text className="mr-1 font-poppins text-base font-medium text-white">
                {selectedLocation}
              </Text>
              <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M7 10l5 5 5-5"
                  stroke="white"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4">
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
                  fill="white"
                />
                <Path
                  d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"
                  fill="white"
                />
              </Svg>
            </TouchableOpacity>
            <TouchableOpacity>
              <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z"
                  fill="white"
                />
              </Svg>
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
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 10 }}>
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
            {fest.cityfest_category_name || 'City Fest'}
          </Text>
        </View>

        {/* Event Details */}
        <View
          style={{
            position: 'absolute',
            top: 150,
            left: 20,
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 2,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="mr-1">
              <Path
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <Path
                d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-poppins text-sm text-white">{fest.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Svg width={16} height={16} viewBox="0 0 24 24" fill="none" className="mr-1">
              <Path
                d="M8 2v2M16 2v2M3 7h18M5 11h2M9 11h2M13 11h2M17 11h2M5 15h2M9 15h2M13 15h2M17 15h2M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                stroke="#d1d5db"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
            <Text className="font-poppins text-sm text-white">
              {formatDate(fest.event_start)} | {formatTime(fest.event_start)} -{' '}
              {formatTime(fest.event_end)}
            </Text>
          </View>
        </View>

        {/* Event Image */}
        <View
          style={{
            position: 'absolute',
            bottom: -60,
            left: 20,
            right: 20,
            height: 120,
            borderRadius: 16,
            overflow: 'hidden',
            zIndex: 3,
          }}>
          <Image
            source={{
              uri: fest.image_urls?.[0] || 'https://via.placeholder.com/400',
            }}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {/* Content Card */}
        <View
          className="mb-6 mt-16 overflow-hidden rounded-3xl border border-[#00000061] bg-white p-6 shadow-sm"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
          {/* Highlights Section */}
          <View className="mb-6">
            <Text className="mb-3 font-baloo text-3xl font-bold text-black">Highlights</Text>
            <Text className="font-poppins text-base leading-6 text-gray-700">
              {fest.highlights}
            </Text>
          </View>

          {/* What's Included Section */}
          <View>
            <Text className="mb-3 font-baloo text-3xl font-bold text-black">What's included</Text>
            <View className="gap-3">
              {fest.whats_included?.map((item: string, index: number) => (
                <View key={index} className="flex-row items-center">
                  <Text className="mr-3 text-2xl">✓</Text>
                  <Text className="font-poppins text-base text-gray-700">{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View className="mb-6">
          <TouchableOpacity
            onPress={handleOpenMap}
            className="h-48 w-full overflow-hidden rounded-2xl bg-gray-200">
            <View className="flex-1 items-center justify-center">
              <Svg width={48} height={48} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
                  stroke="#EF4444"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Path
                  d="M12 11a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                  stroke="#EF4444"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text className="mt-2 font-poppins text-sm text-gray-600">{fest.location}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Call to Action Button */}
        <TouchableOpacity
          onPress={handleBookNow}
          className="mb-6 overflow-hidden rounded-full bg-[#FF3E00] p-4 shadow-lg"
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 8,
          }}>
          <Text className="text-center font-poppins text-lg font-semibold text-white">
            Entry Pass at ₹{getMinPrice(fest.pricing_types)}/- Only
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFestDetails;
