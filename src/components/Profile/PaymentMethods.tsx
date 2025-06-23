import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import WalletIcon from '~/assets/images/profile/paymentMethods/Wallet.svg';
import SavedCardsIcon from '~/assets/images/profile/paymentMethods/SavedCards.svg';
import GSTDetailsIcon from '~/assets/images/profile/paymentMethods/GSTDetails.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const icons = [
  { label: 'Wallet', Source: WalletIcon, page: 'Wallet' },
  { label: 'Saved Cards', Source: SavedCardsIcon, page: 'SavedCards' },
  { label: 'GST Details', Source: GSTDetailsIcon, page: 'Wallet' },
];

const PaymentMethods = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <View className="mx-4 rounded-3xl bg-[#00A44E29] p-5 py-6">
      <Text className="mb-6 font-baloo text-lg font-bold">Payment Methods</Text>
      <View className="flex-row justify-between">
        {icons.map((icon) => (
          <TouchableOpacity
            onPress={() => navigation.navigate({ name: icon.page as any, params: undefined })}
            className="flex-1  items-center gap-2"
            key={icon.label}>
            <icon.Source width={60} height={40} />
            <Text className="font-baloo text-base text-[#333]">{icon.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default PaymentMethods;
