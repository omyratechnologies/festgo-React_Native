import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarIcon from '~/assets/icons/star.svg'
import MapPinIcon from '~/assets/icons/location-icon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';


// Dummy data
const hotels = [
  {
    id: '1',
    name: 'Grand Palace',
    location: 'Mumbai',
    rating: 4.5,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '2',
    name: 'Sea View Resort',
    location: 'Goa',
    rating: 4.2,
    price: 4100,
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    location: 'Manali',
    rating: 4.8,
    price: 2800,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
  },
];

const HotelCard = ({ hotel }: { hotel: typeof hotels[0] }) => (
  <View className="w-[170px] h-[230px] relative rounded-2xl overflow-hidden bg-white mb-2">
    <Image source={{ uri: hotel.image }} className="w-full h-full" />
    <LinearGradient
      colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
      className="absolute w-full h-full"
    />
    <TouchableOpacity className="absolute top-2.5 right-2.5 z-10 bg-white rounded-full p-1.5 shadow">
      <HeartIcon />
    </TouchableOpacity>
    <View className="absolute bottom-3 left-3 right-3">
      <Text className="text-white font-poppins font-bold text-base mb-1" numberOfLines={1}>{hotel.name}</Text>
      <View className="flex-row items-center mb-1">
        <MapPinIcon className='mr-2'/>
        <Text className="text-white font-poppins text-xs">{hotel.location}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <StarIcon />
          <Text className="text-yellow-400 font-poppins font-bold text-xs">{hotel.rating}</Text>
        </View>
        <Text className="text-white font-poppins font-bold text-sm">₹{hotel.price}</Text>
      </View>
    </View>
  </View>
);

const NearbyHotels = () => {
  return (
    <View className="mt-48 my-4">
      <Text className="text-xl font-poppins px-8 font-bold mb-3">Hotel Nearby</Text>
      <FlatList
        data={hotels}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <HotelCard hotel={item} />}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    </View>
  );
};

export default NearbyHotels;
