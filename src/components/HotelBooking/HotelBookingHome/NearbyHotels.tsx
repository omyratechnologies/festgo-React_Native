import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarIcon from '~/assets/icons/star.svg';
import MapPinIcon from '~/assets/icons/location-icon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

// Dummy data
const hotels = [
  {
    id: '1',
    name: 'Grand Palace',
    location: 'Mumbai',
    rating: 4.5,
    price: 3200,
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Sea View Resort',
    location: 'Goa',
    rating: 4.2,
    price: 4100,
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    location: 'Manali',
    rating: 4.8,
    price: 2800,
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  },
];

const HotelCard = ({ hotel }: { hotel: (typeof hotels)[0] }) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('HotelBookingDetails', { hotelId: 'one' })}
      className="relative mb-2 h-[230px] w-[170px] overflow-hidden rounded-2xl bg-white">
      <Image source={{ uri: hotel.image }} className="h-full w-full" />
      <LinearGradient
        colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
        className="absolute h-full w-full"
      />
      <TouchableOpacity className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white p-1.5 shadow">
        <HeartIcon />
      </TouchableOpacity>
      <View className="absolute bottom-3 left-3 right-3">
        <Text className="mb-1 font-poppins text-base font-bold text-white" numberOfLines={1}>
          {hotel.name}
        </Text>
        <View className="mb-1 flex-row items-center">
          <MapPinIcon className="mr-2" />
          <Text className="font-poppins text-xs text-white">{hotel.location}</Text>
        </View>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <StarIcon />
            <Text className="font-poppins text-xs font-bold text-yellow-400">{hotel.rating}</Text>
          </View>
          <Text className="font-poppins text-sm font-bold text-white">₹{hotel.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NearbyHotels = () => {
  return (
    <View className="my-4 mt-48">
      <Text className="mb-3 px-8 font-poppins text-xl font-bold">Hotel Nearby</Text>
      <FlatList
        data={hotels}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HotelCard hotel={item} />}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </View>
  );
};

export default NearbyHotels;
