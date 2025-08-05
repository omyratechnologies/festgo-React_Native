import React from 'react';
import { View, Text } from 'react-native';
import useUserStore from '~/store/userStore';

const UserCoinsDisplay: React.FC = () => {
  const { userData } = useUserStore();

  if (!userData) {
    return null;
  }

  return (
    <View className="bg-orange-50 p-3 rounded-lg">
      <Text className="text-sm font-medium text-gray-700">
        Your FestGo Coins
      </Text>
      <Text className="text-2xl font-bold text-orange-600">
        {userData.festgo_coins.toLocaleString()}
      </Text>
    </View>
  );
};

export default UserCoinsDisplay; 