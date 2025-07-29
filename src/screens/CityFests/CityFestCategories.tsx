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
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Mock data for category events
const getCategoryEvents = (categoryName: string) => {
  const allEvents = [
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
    {
      id: 4,
      title: 'Jazz Night',
      location: '@ Hilton',
      price: 'Rs 600/- onwards',
      date: '12th Jun',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
    },
    {
      id: 5,
      title: 'Pop Concert',
      location: '@ Oberoi',
      price: 'Rs 900/- onwards',
      date: '15th Jun',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
    },
    {
      id: 6,
      title: 'Classical Music',
      location: '@ Leela Palace',
      price: 'Rs 700/- onwards',
      date: '18th Jun',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
    },
  ];

  // Filter events based on category (for demo, return all events)
  return allEvents;
};

const CityFestCategories = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<any>();
  const { categoryId, categoryName } = route.params || {};
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');

  const categoryEvents = getCategoryEvents(categoryName);

  const formatDate = (dateString: string) => {
    // Convert "5th Jun" format to Date object for quarter circle
    const day = parseInt(dateString.split(' ')[0]);
    const month = dateString.split(' ')[1];
    const currentYear = new Date().getFullYear();
    const monthIndex = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ].indexOf(month);
    return new Date(currentYear, monthIndex, day);
  };

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
            {categoryName}
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
                  placeholder="Search Events"
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
        {/* Category Title */}
        <View className="mb-6 mt-4">
          <Text className="font-baloo text-3xl font-bold text-black">{categoryName}</Text>
        </View>

        {/* Events Grid */}
        <View className="flex-row flex-wrap justify-between">
          {categoryEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="mb-4 w-[48%]"
              onPress={() =>
                navigation.navigate('CityFestDetails', { festId: event.id.toString() })
              }>
              <View className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-sm">
                <Image source={{ uri: event.image }} className="h-full w-full" resizeMode="cover" />

                {/* Quarter Circle Date */}
                <View
                  style={{
                    position: 'absolute',
                    top: -40,
                    right: -40,
                    backgroundColor: '#0E54EC',
                    borderRadius: 9999,
                    paddingVertical: 16,
                    paddingHorizontal: 16,
                    zIndex: 3,
                    width: 100,
                    height: 100,
                    minWidth: 60,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-end',
                  }}>
                  <Text className="text-center text-xl font-bold leading-none text-white">
                    {formatDate(event.date).getDate().toString().padStart(2, '0')}
                  </Text>
                  <Text className="text-md text-center font-semibold leading-none text-white">
                    {formatDate(event.date)
                      .toLocaleDateString('en-IN', { month: 'short' })
                      .toUpperCase()}
                  </Text>
                </View>

                {/* Gradient Overlay */}
                <LinearGradient
                  colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0,
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
                  <Text className="text-lg font-bold text-white">{event.title}</Text>
                  <Text className="text-sm text-gray-200">{event.location}</Text>
                  <View className="mt-1 flex-row items-center gap-2">
                    <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                      <Path
                        d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <Path
                        d="M8 12h.01M12 12h.01M16 12h.01"
                        stroke="#FFFFFF"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </Svg>
                    <Text className="text-base font-semibold text-white">{event.price}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFestCategories;
