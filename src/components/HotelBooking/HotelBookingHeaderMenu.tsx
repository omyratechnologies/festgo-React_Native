import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import UserProfileIcon from '~/assets/images/common/Navbar/UserProfile.svg';
import WalletIcon from '~/assets/images/common/Navbar/WalletIcon.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationIcon.svg';
import ChevronDown from '~/assets/images/common/Navbar/ChevronDown.svg';
import ChevronDownLight from '~/assets/images/common/Navbar/ChevronDownLight.svg';
import NotificationLight from '~/assets/images/common/Navbar/NotificationLight.svg';
import WalletLight from '~/assets/images/common/Navbar/walletLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

type HeaderMenuProps = {
  white?: boolean;
};

const HotelBookingHeaderMenu: React.FC<HeaderMenuProps> = ({ white = false }) => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const UserIcon = white ? UserProfileLight : UserProfileIcon;
  const Wallet = white ? WalletLight : WalletIcon;
  const Notification = white ? NotificationLight : NotificationIcon;
  const ChevronDownIcon = white ? ChevronDownLight : ChevronDown;
  const textColor = white ? 'text-white' : 'text-black';

  return (
    <View className="absolute mt-16 z-10 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
      {/* Left Section */}
      <View className="flex-row items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <UserIcon width={32} height={32} />
        </TouchableOpacity>
        <TouchableOpacity className="ml-3 flex-row items-center">
          <Text className={`mr-1 text-base font-poppins font-medium ${textColor}`}>Hyderabad</Text>
          <ChevronDownIcon width={18} height={18} />
        </TouchableOpacity>
      </View>
      {/* Right Section */}
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-4">
          <Wallet width={28} height={28} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Notification width={28} height={28} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HotelBookingHeaderMenu;
