import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingSearchCard from '~/components/HotelBooking/HotelBookingSearch/HotelBookingSearchCard';
import BackIcon from '~/assets/icons/hotelBooking/BackIcon.svg';
import EditIcon from '~/assets/icons/hotelBooking/EditIcon.svg';
import FilterIcon from '~/assets/icons/hotelBooking/Filter.svg';
import SortIcon from '~/assets/icons/hotelBooking/Sort.svg';
import PropertyTypeIcon from '~/assets/icons/hotelBooking/PropertyType.svg';

const dummyHotels = [
  {
    hotelName: 'Grand Palace Hotel',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    location: 'Mumbai, India',
    price: 3500,
    discount: 20,
    pricePerNight: 2800,
    amenities: ['Free WiFi', 'Pool', 'Breakfast'],
    rooms: 2,
    numberOfReviews: 124,
    features: ['Pet Friendly', 'Airport Shuttle'],
    isFavorite: true,
  },
  {
    hotelName: 'Seaside Resort',
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
    location: 'Goa, India',
    price: 5000,
    discount: 10,
    pricePerNight: 4500,
    amenities: ['Beach Access', 'Spa', 'Bar'],
    rooms: 1,
    numberOfReviews: 89,
    features: ['Sea View', 'Free Parking'],
    isFavorite: false,
  },
  {
    hotelName: 'Mountain View Inn',
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429',
    location: 'Manali, India',
    price: 2500,
    pricePerNight: 2500,
    amenities: ['Mountain View', 'Heater'],
    rooms: 3,
    numberOfReviews: 56,
    features: ['Family Rooms'],
    isFavorite: false,
  },
];

const HotelBookingSearch = () => {
  return (
    <View className="flex-1 bg-white ">
      {/* Header with back icon, location, date range, guests, rooms, and edit icon */}
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>
      {/* Left: Back Icon */}
      <View className="flex-row bg-white items-center w-full justify-between py-4 px-6">
        <View className="flex-row items-center">
          {/* Replace with your SVG */}
          <BackIcon width={24} height={24} />
          <View className="ml-3">
            {/* Location Name */}
            <Text className="text-lg font-poppins font-semibold text-black">Mumbai, India</Text>
            {/* Date Range, Guests, Rooms */}
            <Text className="mt-1 font-poppins text-xs text-black">12 Jun - 15 Jun · 2 Guests · 1 Room</Text>
          </View>
        </View>
        {/* Right: Edit Icon */}
        {/* Replace with your SVG */}
        <EditIcon width={24} height={24} />
      </View>
      {/* Sort, Filters, Property Type Buttons */}
      <View className="mb-2 bg-white mt-2 flex-row justify-center px-4">
        <TouchableOpacity className="mr-2 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2">
          <SortIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity className="mx-1 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2">
          <FilterIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity className="ml-2 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2">
          <PropertyTypeIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Property type</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="mt-2 bg-gray-50 p-4">
        {dummyHotels.map((hotel, idx) => (
          <HotelBookingSearchCard key={idx} {...hotel} onHeartPress={() => {}} />
        ))}
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default HotelBookingSearch;
