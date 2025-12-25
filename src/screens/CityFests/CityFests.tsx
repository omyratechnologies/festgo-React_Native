import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';
import { API_URL } from '~/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  image: string;
}

interface CityFest {
  id: string;
  categoryId: string;
  location: string;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  cityfest_category_name: string;
  cityfest_category_image: string;
  pricing_types: any[];
}

const locations = ['All Cities', 'Hyderabad', 'Guntur', 'Mumbai', 'Delhi'];

const CityFests = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedLocation, setSelectedLocation] = useState('All Cities');
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [fests, setFests] = useState<CityFest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingFests, setLoadingFests] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const location = selectedLocation === 'All Cities' ? 'hyderabad' : selectedLocation.toLowerCase();
        const response = await fetch(`${API_URL}/city-fests/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ location }),
        });
        const data = await response.json();
        if (data.success && data.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [selectedLocation]);

  // Check authentication and fetch all fests
  useEffect(() => {
    const checkAuthAndFetchFests = async () => {
      try {
        setLoadingFests(true);
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          setIsAuthenticated(false);
          setFests([]);
          setLoadingFests(false);
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
          // Filter by location if not "All Cities"
          let filteredFests = data.fests;
          if (selectedLocation !== 'All Cities') {
            filteredFests = data.fests.filter(
              (fest: CityFest) => fest.location.toLowerCase() === selectedLocation.toLowerCase()
            );
          }
          // Filter by search query
          if (searchQuery) {
            filteredFests = filteredFests.filter(
              (fest: CityFest) =>
                fest.highlights?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fest.cityfest_category_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                fest.location?.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }
          setFests(filteredFests);
        } else {
          console.error('API Error:', data);
          setFests([]);
        }
      } catch (error) {
        console.error('Error fetching fests:', error);
        setFests([]);
      } finally {
        setLoadingFests(false);
        setLoading(false);
      }
    };
    checkAuthAndFetchFests();
  }, [selectedLocation, searchQuery]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date;
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

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View
        style={{
          height: 200,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden bg-[#0E54EC]">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            }}
            className="h-full w-full opacity-20"
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
            City Fests
          </Text>
        </View>

      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white -mt-6 rounded-t-[40px]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120, paddingTop: 16 }}>
        {/* Location Filter Tabs - Below Search Bar */}

        <View className="my-6">
          <View className="relative">
            <View className="overflow-hidden rounded-full bg-white border border-gray-300">
              <View className="flex-row items-center px-4 py-4">
                <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" className="mr-3">
                  <Path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="#666"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
                <TextInput
                  placeholder="Search City Fests"
                  placeholderTextColor="#999"
                  className="flex-1 font-poppins text-base"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
              </View>
            </View>
          </View>
        </View>
        <View className="mb-6">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                onPress={() => setSelectedLocation(location)}
                className={`rounded-full mr-2 px-4 py-2 ${
                  selectedLocation === location ? 'bg-[#0E54EC]' : 'bg-white border border-gray-300'
                }`}
                >
                <Text
                  className={`font-poppins text-sm font-medium ${
                    selectedLocation === location ? 'text-white' : 'text-gray-700'
                  }`}>
                  {location}
                  </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* All City Fests Section */}
        <View className="mb-6">
          <Text className="mb-4 font-baloo text-2xl font-bold text-black">All City Fests</Text>
          {!isAuthenticated ? (
            <View className="items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-8">
              <Text className="mb-2 text-center font-baloo text-xl font-bold text-gray-800">
                Login Required
              </Text>
              <Text className="mb-6 text-center font-poppins text-base text-gray-600">
                Please login to view city fests
              </Text>
              <TouchableOpacity
                onPress={() => {
                    navigation.navigate('Auth', { screen: 'Login' });
                }}
                className="rounded-full bg-[#0E54EC] px-6 py-3">
                <Text className="font-poppins font-semibold text-white">Go to Login</Text>
              </TouchableOpacity>
          </View>
          ) : loadingFests ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#0E54EC" />
            </View>
          ) : fests.length === 0 ? (
            <View className="items-center justify-center py-10">
              <Text className="font-poppins text-gray-500">No fests found</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {fests.map((fest) => (
                <TouchableOpacity
                  key={fest.id}
                  className="mb-4 w-[48%]"
                  onPress={() => navigation.navigate('Main', { screen: 'CityFestDetails', params: { festId: fest.id } })}>
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
                        top: -25,
                        right: -25,
                        backgroundColor: '#0E54EC',
                        borderRadius: 9999,
                        width: 80,
                        height: 80,
                        zIndex: 3,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                        paddingBottom: 14,
                        paddingLeft: 18,
                      }}>
                      <Text className="text-center text-lg font-bold leading-none text-white">
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
          )}
        </View>
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFests;
