import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import EditIcon from '~/assets/icons/EditIcon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import LuggageBagIcon from '~/assets/icons/profile/LuggageBag.svg';
import DiscountIcon from '~/assets/icons/profile/Discount.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const user = {
  name: 'Joan Okoro',
  email: 'joanoko@gmail.com',
  profilePic: 'https://randomuser.me/api/portraits/men/1.jpg',
  stats: [
    { icon: LuggageBagIcon, number: 20, label: 'My Orders', page: 'MyOrders' },
    { icon: HeartIcon, number: 18, label: 'Wishlist', page: 'Wishlist' },
    { icon: DiscountIcon, number: 18, label: 'Offers', page: 'Wishlist' },
  ],
};
const ProfileDetails = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <View className="mx-4 mt-6 rounded-2xl bg-[#F15A29] p-5">
      {/* Top Row */}
      <View className="flex-row items-center">
        {/* Profile Picture */}
        <View className="mr-4 rounded-full border-4 border-white">
          <Image source={{ uri: user.profilePic }} className="h-16 w-16 rounded-full" />
        </View>
        {/* Name & Email */}
        <View className="flex-1">
          <Text className="font-baloo text-lg font-bold text-white">{user.name}</Text>
          <Text className="font-baloo text-sm text-white opacity-80">{user.email}</Text>
        </View>
        {/* Edit Icon */}
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
          <EditIcon width={30} height={30} className="text-white" />
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <View className="h-3 overflow-hidden rounded-full bg-white">
          <View className="h-3 rounded-full" style={{ width: '70%', backgroundColor: '#08F67C' }} />
        </View>
        <Text className="mt-2 font-baloo text-sm text-white">Your profile is 70% completed.</Text>
      </View>

      <View className="mt-6 flex-row items-center justify-between rounded-xl bg-white px-4 py-3">
        {user.stats.map((stat, idx) => (
          <React.Fragment key={stat.label}>
            <TouchableOpacity
              onPress={() => navigation.navigate({ name: stat.page as any, params: undefined })}
              className="flex-1 flex-row items-center justify-center">
              <stat.icon width={24} height={24} className="mr-2" />
              <View className="ml-2">
                <Text className="font-baloo text-base font-bold text-black">{stat.number}</Text>
                <Text className="font-baloo text-xs text-gray-700">{stat.label}</Text>
              </View>
            </TouchableOpacity>
            {idx < user.stats.length - 1 && (
              <View className="mx-2 h-6 w-0.5 rounded-full bg-black opacity-60" />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

export default ProfileDetails;
