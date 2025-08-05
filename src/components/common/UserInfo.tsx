import React from 'react';
import { View, Text, Image } from 'react-native';
import useUserStore from '~/store/userStore';

interface UserInfoProps {
  showCoins?: boolean;
  showLocation?: boolean;
}

const UserInfo: React.FC<UserInfoProps> = ({ 
  showCoins = true, 
  showLocation = true 
}) => {
  const { userData } = useUserStore();

  if (!userData) {
    return null;
  }

  return (
    <View className="p-4 bg-white rounded-lg shadow-sm">
      <View className="flex-row items-center space-x-3">
        <Image
          source={{ uri: userData.image_url }}
          className="w-12 h-12 rounded-full"
        />
        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">
            {userData.firstname} {userData.lastname}
          </Text>
          <Text className="text-sm text-gray-600">{userData.email}</Text>
          {showLocation && userData.location && (
            <Text className="text-xs text-gray-500 mt-1">
              📍 {userData.location}
            </Text>
          )}
        </View>
      </View>
      
      {showCoins && (
        <View className="mt-3 flex-row items-center justify-between bg-orange-50 p-3 rounded-lg">
          <Text className="text-sm font-medium text-gray-700">
            FestGo Coins
          </Text>
          <Text className="text-lg font-bold text-orange-600">
            {userData.festgo_coins.toLocaleString()}
          </Text>
        </View>
      )}
      
      <View className="mt-3 flex-row justify-between">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {userData.bookingsCount}
          </Text>
          <Text className="text-xs text-gray-600">Bookings</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {userData.offers}
          </Text>
          <Text className="text-xs text-gray-600">Offers</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-900">
            {userData.profileCompletion}%
          </Text>
          <Text className="text-xs text-gray-600">Profile</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfo; 