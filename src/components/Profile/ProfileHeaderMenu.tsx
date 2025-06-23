import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import HamburngerMenuIcon from '~/assets/images/common/Navbar/HamburgerMenu.svg';
import WalletIcon from '~/assets/images/common/Navbar/WalletIcon.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationIcon.svg';
import BackIcon from '~/assets/icons/ArrowLeft.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

type ProfileHeaderMenuProps = {
  isDifferentPage?: boolean;
  pageTitle?: string;
};

const ProfileHeaderMenu: React.FC<ProfileHeaderMenuProps> = ({
  isDifferentPage = false,
  pageTitle = '',
}) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const bgColor = isDifferentPage ? '#F15A29' : 'transparent';

  return (
    <View
      className={`w-full flex-row items-center justify-between px-8 pb-6 ${isDifferentPage ? 'pt-16' : 'pt-2'}`}
      style={{ backgroundColor: bgColor }}>
      {/* Left Section */}
      <View className="flex-row items-center">
        {isDifferentPage ? (
          <>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="ml-3 font-baloo text-xl pt-1 font-bold text-white">{pageTitle}</Text>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <HamburngerMenuIcon width={24} height={24} />
            </TouchableOpacity>
            <TouchableOpacity className="ml-3 flex-row items-center">
              <Text className="mr-1 text-base font-medium">My Profile</Text>
            </TouchableOpacity>
          </>
        )}
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

export default ProfileHeaderMenu;
