import React from 'react';
import { View, Text, Image, TouchableOpacity, ViewComponent } from 'react-native';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import StarIcon from '~/assets/icons/star.svg';
import LocationIcon from '~/assets/icons/location-pin.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

type HotelBookingSearchCardProps = {
  hotelName: string;
  image: string;
  location: string;
  price: number;
  discount?: number;
  pricePerNight: number;
  amenities: string[];
  rooms: number;
  numberOfReviews: number;
  features: string[];
  onHeartPress?: () => void;
  isFavorite?: boolean;
};

const HotelBookingSearchCard: React.FC<HotelBookingSearchCardProps> = ({
  hotelName,
  image,
  location,
  price,
  discount,
  pricePerNight,
  amenities,
  rooms,
  numberOfReviews,
  features,
  onHeartPress,
  isFavorite,
}) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('HotelBookingDetails', { hotelId: 'something' })}
      className="mb-4 overflow-hidden rounded-xl bg-white shadow-md">
      <View className="relative">
        <Image source={{ uri: image }} className="h-48 w-full" resizeMode="cover" />
        <TouchableOpacity
          className="absolute right-3 top-3 rounded-full bg-white/80 p-2"
          onPress={onHeartPress}>
          <HeartIcon
            width={24}
            height={24}
            color={isFavorite ? '#ef4444' : '#6b7280'}
            fill={isFavorite ? '#ef4444' : 'none'}
          />
        </TouchableOpacity>
        <View className="absolute bottom-0 right-0 w-[80px] rounded-t-xl bg-[#199855] py-2">
          <Text className="text-center font-poppins text-xs font-semibold text-white">
            Very Good
          </Text>
        </View>
      </View>
      <View className="flex-1 items-start ">
        <View className="mb-2 w-full flex-row items-center justify-between">
          <View className="my-2 mb-1 ml-2 mr-2 flex-row items-center rounded-full border border-[#D2D3D8] px-3 py-1 font-poppins text-xs">
            <Text className="font-poppins text-sm font-semibold text-gray-700">3</Text>
            <StarIcon width={16} height={16} className="mx-1" />
            <Text className="ml-1 font-poppins text-xs text-gray-500">Hotel</Text>
          </View>
          <View className="-mt-2 w-[80px] rounded-b-xl border border-[#0000001A] bg-white px-4 py-2">
            <Text className="text-center font-poppins text-xs font-semibold text-black">
              {numberOfReviews}
            </Text>
          </View>
        </View>
        <View className="mb-2 w-full flex-row items-start justify-between px-4 ">
          <View className="w-2/3 flex-col items-start ">
            <Text className="mb-1 font-poppins text-lg font-bold">{hotelName}</Text>
            <View className="mb-2 flex-row items-center">
              <LocationIcon width={16} height={16} className="mr-1" />
              <Text className="font-poppins text-sm text-gray-600">{location}</Text>
            </View>
            <View className="flex-row flex-wrap">
              {features.map((feature, idx) => (
                <Text
                  key={idx}
                  className="mb-1 mr-2 rounded-full border border-[#00AEEF1A] bg-[#00AEEF1A] px-3 py-1 font-poppins text-xs text-blue-700">
                  {feature}
                </Text>
              ))}
            </View>
            <View className="my-2 flex-row flex-wrap">
              {amenities.map((amenity, idx) => (
                <Text
                  key={idx}
                  className="mb-1 mr-2 rounded bg-gray-100 px-2 py-0.5 font-poppins text-xs text-gray-700">
                  {amenity}
                </Text>
              ))}
            </View>
          </View>
          <View className="mb-2 w-1/3 flex-col items-end">
            <Text className="mr-2 font-poppins text-xl font-bold text-primary">
              ₹{pricePerNight}
              <Text className="font-poppins text-xs text-gray-500">/night</Text>
            </Text>
            {discount && (
              <View className="ml-2 rounded bg-green-100 px-2 py-0.5">
                <Text className="font-poppins text-xs font-semibold text-green-600">
                  {discount}% OFF
                </Text>
              </View>
            )}
            {/* <Text className="w-1/2 font-poppins text-xs text-gray-500">
              +₹400 taxes & free for 2rooms per night
            </Text> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default HotelBookingSearchCard;
