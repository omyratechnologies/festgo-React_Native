import React from 'react';
import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native';
import StarIcon from '~/assets/icons/star.svg';
import MapPinIcon from '~/assets/icons/location-pin.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';

const hotels = [
  {
    id: '1',
    name: 'Grand Palace Hotel',
    location: 'New York, NY',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    rating: 4.5,
    reviews: 120,
    price: 180,
    saved: false,
  },
  {
    id: '2',
    name: 'Ocean View Resort',
    location: 'Miami, FL',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 98,
    price: 220,
    saved: true,
  },
  {
    id: '3',
    name: 'Ocean View Resort',
    location: 'Miami, FL',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 98,
    price: 220,
    saved: true,
  },
  {
    id: '4',
    name: 'Ocean View Resort',
    location: 'Miami, FL',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    rating: 4.8,
    reviews: 98,
    price: 220,
    saved: true,
  },
];

const RecommendationHotels = () => {
  return (
    <View className="px-4 py-2">
      <Text className="font-poppins mb-3 px-4 text-xl font-bold">Recommendation</Text>
      <FlatList
        data={hotels}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            className="mb-4 flex-row rounded-xl bg-white p-3"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 1, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 4,
              elevation: 9,
            }}>
            <Image
              source={{ uri: item.image }}
              className="h-20 w-20 rounded-lg"
              resizeMode="cover"
            />
            <View className="ml-3 flex-1 justify-between">
              <View>
                <Text className="text-base font-semibold">{item.name}</Text>
                <View className="mt-1 flex-row items-center">
                  <MapPinIcon height={16} width={16} color="#6b7280" />
                  <Text className="ml-1 text-xs text-gray-500">{item.location}</Text>
                </View>
              </View>
              <View className="mt-2 flex-row items-center">
                <StarIcon height={16} width={16} color="#fbbf24" fill="#fbbf24" />
                <Text className="ml-1 text-xs text-yellow-500">{item.rating}</Text>
                <Text className="ml-2 text-xs text-gray-400">({item.reviews} reviews)</Text>
              </View>
            </View>
            <View className="ml-2 items-end justify-between">
              <Text className="text-base font-bold text-indigo-600">
                ${item.price}
                <Text className="text-xs font-normal text-gray-500">/night</Text>
              </Text>
              <TouchableOpacity className="mt-2">
                <HeartIcon
                  height={16}
                  width={22}
                  color={item.saved ? '#ef4444' : '#9ca3af'}
                  fill={item.saved ? '#ef4444' : 'none'}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default RecommendationHotels;
