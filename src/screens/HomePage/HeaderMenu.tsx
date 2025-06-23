import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import UserProfileIcon from '~/assets/images/common/Navbar/UserProfile.svg';
import WalletIcon from '~/assets/images/common/Navbar/WalletIcon.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationIcon.svg';
import ChevronDown from '~/assets/images/common/Navbar/ChevronDown.svg';

const HeaderMenu = () => {
    return (
        <View className="w-full flex-row items-center justify-between px-8 pb-6 pt-2 bg-transparent">
            {/* Left Section */}
            <View className="flex-row items-center">
                <TouchableOpacity>
                    <UserProfileIcon width={32} height={32} />
                </TouchableOpacity>
                <TouchableOpacity className="flex-row items-center ml-3">
                    <Text className="text-base font-medium mr-1">Hyderabad</Text>
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