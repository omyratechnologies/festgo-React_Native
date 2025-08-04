import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Mock data for categories
const categories = [
  { id: 1, name: 'DJ Nights', icon: '🎤', color: '#8B5CF6' },
  { id: 2, name: 'Concerts', icon: '🎵', color: '#F59E0B' },
  { id: 3, name: 'Sports', icon: '🏏', color: '#10B981' },
  { id: 4, name: 'Music', icon: '🎶', color: '#EF4444' },
];

// Mock data for popular events
const popularEvents = [
  {
    id: 1,
    title: 'Concert Nights',
    location: '@ Park Hyatt',
    price: 'Rs 500/- onwards',
    date: '5th Jun',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    title: 'DJ Night',
    location: '@ Taj Palace',
    price: 'Rs 800/- onwards',
    date: '7th Jun',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    title: 'Rock Concert',
    location: '@ Marriott',
    price: 'Rs 1200/- onwards',
    date: '10th Jun',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
  },
];

// Mock data for nearby events
const nearbyEvents = [
  {
    id: 1,
    title: 'Comedy Nights',
    location: '@ Park Hyatt',
    price: 'Rs 500/- onwards',
    date: '5th Jun',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
  },
  {
    id: 2,
    title: 'Stand-up Comedy',
    location: '@ Taj Palace',
    price: 'Rs 600/- onwards',
    date: '6th Jun',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
  },
  {
    id: 3,
    title: 'Open Mic Night',
    location: '@ Marriott',
    price: 'Rs 400/- onwards',
    date: '8th Jun',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
  },
  {
    id: 4,
    title: 'Poetry Slam',
    location: '@ Hilton',
    price: 'Rs 300/- onwards',
    date: '9th Jun',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=200&fit=crop',
  },
];

const CityFests = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');

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
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden rounded-b-[30px] bg-[#0E54EC]">
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

        {/* Search Bar */}
        <View className="absolute bottom-16 left-4 right-4">
          <View className="relative">
            <View className="overflow-hidden rounded-full bg-white shadow-lg">
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
                  placeholder="Search Fests"
                  placeholderTextColor="#999"
                  className="flex-1 font-poppins text-base"
                />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Categories Section */}
        <View className="mb-6">
          <Text className="mb-4 font-baloo text-xl font-bold text-black">Categories</Text>
          <View className="flex-row justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="items-center"
                onPress={() =>
                  navigation.navigate('CityFestCategory', {
                    categoryId: category.id.toString(),
                    categoryName: category.name,
                  })
                }>
                <View
                  className="mb-2 h-24 w-24 items-center justify-center rounded-full border border-gray-200 bg-white"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 10 },
                    shadowOpacity: 0.2,
                    shadowRadius: 3.84,
                  }}>
                  <Text className="text-2xl">{category.icon}</Text>
                  <Text className="text-center font-poppins text-xs text-gray-700">
                    {category.name}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Events Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-baloo text-xl font-bold text-black">Popular Events</Text>
            <TouchableOpacity>
              <Text className="font-poppins text-sm font-medium text-[#0E54EC]">See all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-4">
              {popularEvents.map((event) => (
                <TouchableOpacity
                  key={event.id}
                  className="w-80"
                  onPress={() =>
                    navigation.navigate('CityFestDetails', { festId: event.id.toString() })
                  }>
                  <View className="overflow-hidden rounded-xl shadow-sm">
                    <Image
                      source={{ uri: event.image }}
                      className="h-40 w-full"
                      resizeMode="cover"
                    />
                    <View className="rounded-b-xl border border-[#00000047] bg-[#FCF0F0] p-3">
                      <Text className="mb-1 font-poppins font-semibold text-black">
                        {event.title}
                      </Text>
                      <Text className="mb-1 font-poppins text-sm text-gray-600">
                        {event.location}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
                              stroke="#0E54EC"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <Path
                              d="M8 12h.01M12 12h.01M16 12h.01"
                              stroke="#0E54EC"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                          <Text className="font-poppins text-sm font-medium text-[#0E54EC]">
                            {event.price}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-2">
                          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                            <Path
                              d="M8 2v2M16 2v2M3 7h18M5 11h2M9 11h2M13 11h2M17 11h2M5 15h2M9 15h2M13 15h2M17 15h2M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"
                              stroke="#0E54EC"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </Svg>
                          <Text className="font-poppins text-sm text-gray-500">{event.date}</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Nearby Events Section */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="font-baloo text-xl font-bold text-black">Nearby Events</Text>
            <TouchableOpacity>
              <Text className="font-poppins text-sm font-medium text-[#0E54EC]">See all</Text>
            </TouchableOpacity>
          </View>

          <View className="gap-3">
            {nearbyEvents.map((event) => (
              <TouchableOpacity
                key={event.id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
                onPress={() =>
                  navigation.navigate('CityFestDetails', { festId: event.id.toString() })
                }>
                <View className="flex-row">
                  <Image source={{ uri: event.image }} className="h-24 w-24" resizeMode="cover" />
                  <View className="flex-1 justify-between rounded-r-xl border border-[#00000047] bg-[#FCF0F0] p-3">
                    <View>
                      <Text className="mb-1 font-poppins font-semibold text-black">
                        {event.title}
                      </Text>
                      <Text className="font-poppins text-sm text-gray-600">{event.location}</Text>
                    </View>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
                          <Path
                            d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
                            stroke="#0E54EC"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <Path
                            d="M8 12h.01M12 12h.01M16 12h.01"
                            stroke="#0E54EC"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </Svg>
                        <Text className="font-poppins text-sm font-medium text-[#0E54EC]">
                          {event.price}
                        </Text>
                      </View>
                      <Text className="font-poppins text-sm text-gray-500">{event.date}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFests;
