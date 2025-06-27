import React, { useState } from 'react';
import { View, Text, Image, Pressable, ScrollView, Modal } from 'react-native';
import ArrowRightIcon from '~/assets/icons/rightIcon.svg';
import PencilIcon from '~/assets/icons/EditIcon.svg';
import ChevronLeftIcon from '~/assets/icons/ArrowLeft.svg';
import BottomMenu from '~/components/common/BottomMenu';
import BackIcon from '~/assets/icons/ArrowLeft.svg';
import HeartIcon from '~/assets/icons/BlueHeart.svg';
import CameraIcon from '~/assets/icons/CameraIcon.svg';
import StarIcon from '~/assets/icons/star.svg';
import LocationIcon from '~/assets/icons/location-pin.svg';
import BackIconModal from '~/assets/icons/hotelBooking/BackIcon.svg';
import TickIcon from '~/assets/icons/Tick.svg';
import WineglassIcon from '~/assets/icons/hotelBooking/Wineglass.svg';
import RecommendationHotels from '~/components/HotelBooking/HotelBookingHome/RecommendationHotels';
import AllFacilitiesModal from '~/components/HotelBooking/AllFacilitiesModal';

// import { Accordion } from 'native-base';

const facilities = [
  { icon: 'wifi', label: 'Free WiFi' },
  { icon: 'pool', label: 'Pool' },
  { icon: 'breakfast', label: 'Breakfast' },
  { icon: 'wifi', label: 'Free WiFi' },
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

const rules = [
  'Primary guest should be at least 18 years of age.',
  'Passport, Aadhar, Driving License and Govt. ID are accepted as ID proof(s). ',
  'Local IDs are allowed.',
];

export default function HotelBookingSingleDetail() {
  const [showFacilities, setShowFacilities] = useState(false);

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

      <ScrollView className="mb-32 flex-1 bg-white">
        <View className="relative flex-row items-center justify-between">
          <BackIcon
            width={36}
            height={36}
            style={{
              position: 'absolute',
              left: 12,
              top: 12,
              zIndex: 2,
            }}
          />
          <View className="absolute right-4 top-4 z-50 rounded-full bg-white p-2">
            <HeartIcon width={20} height={20} />
          </View>
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
            }}
            className="h-64 w-full"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 w-full flex-row items-center justify-center gap-2 py-2">
            <View className="flex-row items-center justify-center rounded-full bg-[#00000091] p-1 px-3">
              <CameraIcon width={10} height={10} color="#ffffff" />
              <Text className="ml-1 text-sm font-semibold text-white">Hotel Photos 80</Text>
            </View>
            <View className="flex-row items-center justify-center rounded-full bg-[#00000091] p-1 px-3">
              <CameraIcon width={10} height={10} color="#ffffff" />
              <Text className="ml-1 text-sm font-semibold text-white">Guest Photos 80</Text>
            </View>
          </View>
        </View>
        {/* Rating, Name, Reviews, Location */}
        <View className="w-full px-4 py-3">
          <View className="w-full flex-row items-center justify-between">
            <View className="w-[75%] flex-col items-start ">
              <View className="my-2 mb-1 mr-2 flex-row items-center rounded-full border border-[#D2D3D8] px-3 py-1 font-poppins text-xs">
                <Text className="font-poppins text-sm font-semibold text-gray-700">3</Text>
                <StarIcon width={12} height={12} className="mx-1" />
                <Text className="ml-1 font-poppins text-xs text-gray-500">Hotel</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Text className="font-poppins text-lg font-semibold">
                  Aalankrita Resort & Conventi
                </Text>
              </View>
            </View>
            <View className="mb-2 flex-col items-center justify-between">
              <View className="w-[80px] rounded-t-xl bg-[#199855] py-2">
                <Text className="text-center font-poppins text-xs font-semibold text-white">
                  Very Good
                </Text>
              </View>
              <View className="w-[80px] flex-row items-center justify-center gap-3 rounded-b-xl border border-[#0000001A] py-2">
                <View className="flex-row items-center">
                  <HeartIcon width={16} height={16} className="" />
                  <Text className="ml-1 font-poppins text-xs font-semibold text-gray-700">4.5</Text>
                </View>
                <Text className="text-center font-poppins text-xs font-semibold text-black">
                  120
                </Text>
              </View>
            </View>
          </View>
          <View className="mb-2 flex-row items-center">
            <LocationIcon width={16} height={16} className="mr-1" />
            <Text className="font-poppins text-sm text-gray-600">Gachibowli</Text>
          </View>
        </View>

        {/* Dates, Rooms, Adults, Edit */}
        <View className="mx-4 mb-3 flex-row items-center justify-between overflow-hidden rounded-xl border border-[#00000024]">
          <View className="p-4">
            <Text className="font-poppins text-gray-700">12 Jun - 14 Jun</Text>
            <Text className="font-poppins text-xs text-gray-500">Sun · Tue</Text>
          </View>
          <Text className="font-poppins text-xs text-gray-500">2 Rooms · 4 Adults</Text>
          <Pressable className="rounded-r-xl bg-[#0E54EC] px-4 py-4" onPress={() => {}}>
            <PencilIcon width={24} color="#2563eb" />
          </Pressable>
        </View>

        {/* Description */}
        <View className="mb-3 px-4">
          <Text className="font-poppins text-base text-gray-700">
            Located in Hyderabad, within 1.9 km of AP State Archaeology Museum and 2.9 km of
            Ravindra Bharathi, New Hotel Suhail provides accommodation with a garden and free WiFi
            throughout the property as well as free private parking for guests who drive. The
            property is around 3.2 km from Charminar, 3.5 km from Mecca Masjid and 4.2 km from
            Chowmahalla Palace. The accommodation offers room service and a 24-hour front desk for
            guests
          </Text>
        </View>

        {/* Common Facilities */}
        <View className="my-4 px-4">
          <Text className="mb-2 text-xl font-bold">Common Facilities</Text>
          <View className="mb-4 flex-row items-end justify-between">
            <View className="mt-4 flex-row flex-wrap gap-3">
              {facilities.map((_facility, index) => {
                const bgColors = ['#FFBC99', '#CABDFF', '#B1E5FC'];
                const bgColor = bgColors[index % bgColors.length];
                return (
                  <View
                    key={index}
                    className="mr-1 h-[60px] w-[60px] flex-row items-center justify-center rounded-full p-4"
                    style={{ backgroundColor: bgColor }}>
                    <WineglassIcon width={28} height={28} />
                  </View>
                );
              })}
            </View>
            <Pressable
              className="mx-4 h-[60px] w-[60px] flex-row items-center justify-center rounded-full border border-[#ECECEC] p-4"
              onPress={() => setShowFacilities(true)}>
              <ArrowRightIcon width={36} color="#2563eb" />
            </Pressable>
          </View>
        </View>

        {/* Facilities Modal */}
        <Modal visible={showFacilities} animationType="slide">
          <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
          <View className="w-full flex-1 bg-white">
            <View className="relative w-full flex-row items-center border-b border-gray-200 px-4 py-3">
              <Pressable onPress={() => setShowFacilities(false)} className="absolute left-4 z-10">
                <BackIconModal width={24} color="#2563eb" />
              </Pressable>
              <View className="flex-1 items-center py-3">
                <Text className="text-center text-lg font-semibold">All Facilities</Text>
              </View>
            </View>
            <AllFacilitiesModal />
          </View>
        </Modal>

        {/* Price & Select Room */}
        <View className="flex-row items-center justify-between px-4 py-3">
          <View className="flex-col items-start">
            <Text className="text-3xl font-bold text-[#00AEEF]">₹4617</Text>
            <Text className="text-md font-normal text-gray-500">Per night</Text>
          </View>
          <Pressable className="rounded-full bg-blue-600 px-5 py-3" onPress={() => {}}>
            <Text className="text-lg font-semibold text-white">Select Room</Text>
          </Pressable>
        </View>

        {/* Location & Map */}
        <View className="my-6 px-4">
          <View className="mb-1 flex-row items-center justify-between">
            <Text className="mr-2 font-poppins font-semibold text-blue-600">Location</Text>
            <Pressable className="mb-2 flex-row items-center" onPress={() => {}}>
              <Text className="mr-2 font-poppins font-semibold text-[#00AEEF]">View Map</Text>
            </Pressable>
          </View>
          <View className="mb-2 flex-col items-center justify-between rounded-xl border border-[#F3F3F3] p-2">
            <Image
              source={{ uri: 'https://staticmapmaker.com/img/google-placeholder.png' }}
              className="h-40 w-full rounded-lg"
              resizeMode="cover"
            />
            <Text className="w-full py-1 text-start font-poppins text-sm text-gray-600">
              Madhapur Hitech City, 500081 Hyderabad, India
            </Text>
          </View>
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

        <RecommendationHotels />

        {/* Property Rules */}
        <View className="mb-3 mt-4 px-4">
          <Text className="mb-2 font-poppins text-xl font-bold">Property Rules</Text>
          {rules.map((rule, i) => (
            <View key={i} className="mb-2 flex-row items-center">
              <TickIcon width={20} height={20} color="#2563eb" className="" />
              <Text className="ml-1 font-poppins text-gray-700">{rule}</Text>
            </View>
          ))}
          <Pressable
            className="flex items-center rounded-full bg-[#0E54EC] py-3"
            onPress={() => {}}>
            <Text className="font-poppins font-semibold text-white">View All Rules</Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
}
