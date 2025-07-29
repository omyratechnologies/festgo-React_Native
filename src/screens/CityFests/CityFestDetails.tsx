import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import BottomMenu from '~/components/common/BottomMenu';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

// Mock event data
const getEventDetails = (festId: string) => {
  const events: Record<
    string,
    {
      id: string;
      title: string;
      location: string;
      date: string;
      time: string;
      price: string;
      image: string;
      highlights: string;
      whatsIncluded: { icon: string; label: string }[];
      mapLocation: string;
    }
  > = {
    '1': {
      id: '1',
      title: 'DJ Nights',
      location: 'Park Hyatt',
      date: 'May 30',
      time: '7:30 PM - 11:00 PM',
      price: '500',
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&h=300&fit=crop',
      highlights:
        'Join us for a weekend of night lights and music at the DJ Nights! Enjoy live performances, food Stalls and more',
      whatsIncluded: [
        { icon: '🎵', label: 'Music' },
        { icon: '⭐', label: 'Live Performance' },
        { icon: '🍔', label: 'Food Stalls' },
      ],
      mapLocation: 'Park Hyatt, Hyderabad',
    },
    '2': {
      id: '2',
      title: 'Concert Nights',
      location: 'Taj Palace',
      date: 'Jun 7',
      time: '8:00 PM - 12:00 AM',
      price: '800',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      highlights:
        'Experience the ultimate concert night with amazing performances and great atmosphere!',
      whatsIncluded: [
        { icon: '🎤', label: 'Live Music' },
        { icon: '🎪', label: 'Stage Show' },
        { icon: '🍹', label: 'Beverages' },
      ],
      mapLocation: 'Taj Palace, Hyderabad',
    },
    '3': {
      id: '3',
      title: 'Rock Concert',
      location: 'Marriott',
      date: 'Jun 10',
      time: '7:00 PM - 11:30 PM',
      price: '1200',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      highlights:
        'Get ready for an electrifying rock concert experience with top bands and amazing sound!',
      whatsIncluded: [
        { icon: '🎸', label: 'Rock Music' },
        { icon: '🎭', label: 'Band Performance' },
        { icon: '🍕', label: 'Food & Drinks' },
      ],
      mapLocation: 'Marriott, Hyderabad',
    },
  };

  return events[festId] || events['1'];
};

const CityFestDetails = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<any>();
  const { festId } = route.params || {};
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');

  const eventDetails = getEventDetails(festId);

  const handleBookNow = () => {
    navigation.navigate('CityFestCheckout', { festId: festId });
  };

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
            source={{ uri: eventDetails.image }}
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
            {eventDetails.title}
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
            <Text className="font-poppins text-sm text-white">{eventDetails.location}</Text>
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
              {eventDetails.date} | {eventDetails.time}
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
            source={{ uri: eventDetails.image }}
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
              {eventDetails.highlights}
            </Text>
          </View>

          {/* What's Included Section */}
          <View>
            <Text className="mb-3 font-baloo text-3xl font-bold text-black">What's included</Text>
            <View className="gap-3">
              {eventDetails.whatsIncluded.map(
                (item: { icon: string; label: string }, index: number) => (
                  <View key={index} className="flex-row items-center">
                    <Text className="mr-3 text-2xl">{item.icon}</Text>
                    <Text className="font-poppins text-base text-gray-700">{item.label}</Text>
                  </View>
                )
              )}
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View className="mb-6">
          <View className="h-48 w-full overflow-hidden rounded-2xl bg-gray-200">
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
              <Text className="mt-2 font-poppins text-sm text-gray-600">
                {eventDetails.mapLocation}
              </Text>
            </View>
          </View>
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
            Entry Pass at ₹{eventDetails.price}/- Only
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default CityFestDetails;
