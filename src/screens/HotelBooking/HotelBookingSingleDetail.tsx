import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, Modal } from 'react-native';
import ArrowRightIcon from '~/assets/icons/rightIcon.svg';
import PencilIcon from '~/assets/icons/EditIcon.svg';
import ChevronLeftIcon from '~/assets/icons/ArrowLeft.svg';
import BottomMenu from '~/components/common/BottomMenu';
// import { Accordion } from 'native-base';

const facilities = [
  { icon: 'wifi', label: 'Free WiFi' },
  { icon: 'pool', label: 'Pool' },
  { icon: 'breakfast', label: 'Breakfast' },
  // ...more
];

const allFacilities = [
  { title: 'General', data: ['Free WiFi', 'Parking', '24h Reception'] },
  { title: 'Room', data: ['AC', 'TV', 'Mini Bar'] },
  // ...more
];

const reviews = [
  { user: 'Alice', comment: 'Great stay!', rating: 5 },
  { user: 'Bob', comment: 'Very clean.', rating: 4 },
];

const rules = ['No smoking', 'No pets', 'Check-in after 2PM'];

export default function HotelBookingSingleDetail() {
  const [showFacilities, setShowFacilities] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="mb-32 flex-1 bg-white">
        {/* Image Section */}
        <Image
          source={{ uri: 'https://placehold.co/400x200' }}
          className="h-52 w-full"
          resizeMode="cover"
        />

        {/* Rating, Name, Reviews, Location */}
        <View className="px-4 py-3">
          <View className="flex-row items-center space-x-2">
            <Text className="font-bold text-yellow-500">★ 4.5</Text>
            <Text className="text-lg font-semibold">Hotel Name</Text>
          </View>
          <Text className="text-gray-500">123 reviews · New York, USA</Text>
        </View>

        {/* Dates, Rooms, Adults, Edit */}
        <View className="mx-4 mb-3 flex-row items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
          <View>
            <Text className="text-gray-700">12 Jun - 14 Jun</Text>
            <Text className="text-xs text-gray-500">2 Rooms · 4 Adults</Text>
          </View>
          <Pressable className="p-2" onPress={() => {}}>
            <PencilIcon width={20} color="#2563eb" />
          </Pressable>
        </View>

        {/* Description */}
        <View className="mb-3 px-4">
          <Text className="text-base text-gray-700">
            This is a beautiful hotel located in the heart of the city. Enjoy modern amenities and
            excellent service.
          </Text>
        </View>

        {/* Common Facilities */}
        <Pressable
          className="mx-4 mb-3 flex-row items-center justify-between rounded-lg bg-gray-100 px-4 py-3"
          onPress={() => setShowFacilities(true)}>
          <View className="flex-row space-x-4">
            {facilities.slice(0, 3).map((f, i) => (
              <View key={i} className="items-center">
                {/* Replace with your icon */}
                <View className="mb-1 rounded-full bg-blue-100 p-2">
                  <Text className="text-blue-600">{f.icon}</Text>
                </View>
                <Text className="text-xs text-gray-700">{f.label}</Text>
              </View>
            ))}
          </View>
          <ArrowRightIcon width={20} color="#2563eb" />
        </Pressable>

        {/* Facilities Modal */}
        <Modal visible={showFacilities} animationType="slide">
          <View className="flex-1 bg-white">
            <View className="mt-12 flex-row items-center border-b border-gray-200 bg-[#0E54EC] px-4 py-3">
              <Pressable onPress={() => setShowFacilities(false)} className="mr-2">
                <ChevronLeftIcon width={24} color="#2563eb" />
              </Pressable>
              <Text className="text-lg font-semibold">All Facilities</Text>
            </View>
            <ScrollView className="px-4">
              {allFacilities.map((section, idx) => (
                <View key={idx} className="mb-4">
                  <Text className="mb-2 font-bold">{section.title}</Text>
                  {section.data.map((item, i) => (
                    // <Accordion key={i} title={item}>
                    <Text className="px-2 py-1 text-gray-600">{item} details...</Text>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>

        {/* Price & Select Room */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <Text className="text-xl font-bold text-gray-900">
            $120 <Text className="text-base font-normal text-gray-500">/night</Text>
          </Text>
          <Pressable className="rounded-lg bg-blue-600 px-5 py-2" onPress={() => {}}>
            <Text className="font-semibold text-white">Select Room</Text>
          </Pressable>
        </View>

        {/* Location & Map */}
        <View className="mb-3 px-4">
          <Pressable className="mb-2 flex-row items-center" onPress={() => {}}>
            <Text className="mr-2 font-semibold text-blue-600">View Map</Text>
            <ArrowRightIcon width={16} color="#2563eb" />
          </Pressable>
          <Image
            source={{ uri: 'https://placehold.co/400x120' }}
            className="h-28 w-full rounded-lg"
            resizeMode="cover"
          />
        </View>

        {/* Reviews */}
        <View className="mb-3 px-4">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="text-lg font-bold">Reviews</Text>
            <Pressable onPress={() => {}}>
              <Text className="font-semibold text-blue-600">View All</Text>
            </Pressable>
          </View>
          {reviews.slice(0, 2).map((r, i) => (
            <View key={i} className="mb-2">
              <Text className="font-semibold">{r.user}</Text>
              <Text className="text-gray-600">{r.comment}</Text>
              <Text className="text-yellow-500">★ {r.rating}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View className="mb-3 px-4">
          <Text className="mb-2 text-lg font-bold">Recommendations</Text>
          {/* Add your recommendations here */}
          <View className="rounded-lg bg-gray-100 p-4">
            <Text className="text-gray-700">Hotel ABC, Hotel XYZ...</Text>
          </View>
        </View>

        {/* Property Rules */}
        <View className="mb-3 px-4">
          <Text className="mb-2 text-lg font-bold">Property Rules</Text>
          {rules.map((rule, i) => (
            <View key={i} className="mb-1 flex-row items-center">
              {/* <CheckCircleIcon size={18} color="#2563eb" className="mr-2" /> */}
              <Text className="text-gray-700">{rule}</Text>
            </View>
          ))}
          <Pressable onPress={() => {}}>
            <Text className="mt-1 font-semibold text-blue-600">View All Rules</Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
}
