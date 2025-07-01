import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import HeartIcon from '~/assets/icons/profile/HeartIcon.svg';
import ShieldDoneIcon from '~/assets/icons/profile/ShieldDone.svg';
import LogoutIcon from '~/assets/icons/profile/Logout.svg';
import Notification from '~/assets/icons/profile/Notification.svg';
import ProfileIcon from '~/assets/icons/profile/Profile.svg';
import ChevronRightIcon from '~/assets/icons/profile/ChevronRight.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '~/navigation/types';

const OptionRow = ({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}) => (
  <TouchableOpacity
    className={`bg-whiterounded-xl mb-3 flex-row items-center px-4 py-3`}
    onPress={onPress}
    activeOpacity={onPress ? 0.7 : 1}
  >
    <View className={`mr-4 rounded-full bg-[#0601B41A] p-2`}>{icon}</View>
    <View className={`flex-1`}>
      <Text className={`font-baloo text-base font-semibold text-black`}>{title}</Text>
      <Text className={`font-baloo text-xs text-gray-500`}>{subtitle}</Text>
    </View>
    <ChevronRightIcon color="#A3A3A3" />
  </TouchableOpacity>
);


const ProfileOptions = () => {
  const navigation = useNavigation<NavigationProp>();
    const handleLogout = async () => {
    await AsyncStorage.multiRemove(['jwtToken', 'userId', 'isLoggedIn']);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Auth' }],
    });
  };

  const optionsTop = [
    {
      icon: <ProfileIcon width={24} height={24} color="#0601B4" />,
      title: 'Refer & Earn 5000',
      subtitle: 'Invite friends and earn rewards',
      onPress: () => navigation.navigate('Main', {screen: 'ReferAndEarn'}),
    },
    {
      icon: <ProfileIcon width={24} height={24} color="#0601B4" />,
      title: 'Recommend and Earn',
      subtitle: 'Recommend us and get benefits',
      onPress: () => navigation.navigate('Main', {screen: 'RecommendAndEarn'}),
    },
    {
      icon: <ShieldDoneIcon width={24} height={24} color="#0601B4" />,
      title: 'Delete my account',
      subtitle: 'Permanently remove your account',
    },
    {
      icon: <LogoutIcon width={24} height={24} color="#0601B4" />,
      title: 'Logout',
      subtitle: 'Sign out from your account',
      onPress: handleLogout,
    },
  ];

  const optionsBottom = [
    {
      icon: <Notification width={24} height={24} color="#0601B4" />,
      title: 'Help & support',
      subtitle: 'Get assistance and support',
    },
    {
      icon: <HeartIcon width={24} height={24} color="#0601B4" />,
      title: 'About App',
      subtitle: 'Learn more about the app',
    },
  ];

  return (
    <View className={`mb-32 mt-2 p-4`}>
      <View
        className={`mb-6 rounded-3xl bg-white px-2 py-4`}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 4,
          elevation: 9,
        }}>
        {optionsTop.map((opt, idx) => (
          <OptionRow key={idx} {...opt} />
        ))}
      </View>
      <View
        className="rounded-3xl bg-white px-2 py-4"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.07,
          shadowRadius: 4,
          elevation: 9,
        }}>
        {optionsBottom.map((opt, idx) => (
          <OptionRow key={idx} {...opt} />
        ))}
      </View>
    </View>
  );
};

export default ProfileOptions;
