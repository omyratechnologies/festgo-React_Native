import React from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarIcon from '~/assets/icons/star.svg';
import MapPinIcon from '~/assets/icons/location-icon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const hotels = [
  {
    id: '1',
    name: 'Grand Palace',
    location: 'Mumbai',
    rating: 4.5,
    price: 3200,
    image:
      'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=',
  },
  {
    id: '2',
    name: 'Sea View Resort',
    location: 'Goa',
    rating: 4.2,
    price: 4100,
    image:
      'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
  },
  {
    id: '3',
    name: 'Mountain Retreat',
    location: 'Manali',
    rating: 4.8,
    price: 2800,
    image:
      'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=',
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
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}>
        <TouchableOpacity className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white p-1.5 shadow">
          <HeartIcon />
        </TouchableOpacity>
        <View className="absolute bottom-3 left-3 right-3">
          <Text className="mb-1 font-poppins text-base font-bold text-white" numberOfLines={1}>
            {hotel.name}
          </Text>
          <View className="mb-1 flex-row items-center">
            <MapPinIcon className="mr-2" />
            <Text className="font-poppins ml-1 text-xs text-white">{hotel.location}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <StarIcon />
              <Text className="font-poppins text-xs font-bold text-yellow-400">{hotel.rating}</Text>
            </View>
            <Text className="font-poppins text-sm font-bold text-white">₹{hotel.price}</Text>
          </View>
        </View>
      </LinearGradient>
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
