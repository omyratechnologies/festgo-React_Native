import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import UserProfileIcon from '~/assets/images/common/Navbar/UserProfile.svg';
import WalletIcon from '~/assets/images/common/Navbar/WalletIcon.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationIcon.svg';
import ChevronDown from '~/assets/images/common/Navbar/ChevronDown.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const HeaderMenu = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <View className="w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
      {/* Left Section */}
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <UserProfileIcon width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-3 flex-row items-center">
          <Text className="mr-1 text-base font-medium">Hyderabad</Text>
          <ChevronDown width={18} height={18} />
        </TouchableOpacity>
      </View>
      {/* Right Section */}
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-4">
          <WalletIcon width={28} height={28} />
        </TouchableOpacity>
        <TouchableOpacity>
          <NotificationIcon width={28} height={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HeaderMenu;
