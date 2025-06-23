import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';

const WalletScreen = () => {
  return (
    <View className="flex-1 justify-start">
      <ProfileHeaderMenu isDifferentPage pageTitle="Wallet" />
      <ScrollView>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800">Wallet</Text>
          {/* Add your form fields here */}
          <Text className="mt-4 text-gray-600">This is a placeholder for the Wallet Screen</Text>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default WalletScreen;
