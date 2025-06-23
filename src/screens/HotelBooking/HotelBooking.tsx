import { View } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import HeaderMenu from '../HomePage/HeaderMenu';
import HotelBackgroundImage from '~/assets/images/homepage/HomeBackground.svg';

const HotelBooking = () => {
  return (
    <View className="flex-1">
      <View className="flex-1 relative bg-[#F9F9F9]">
        <HotelBackgroundImage className=''/>
        <HeaderMenu />
      </View>

      <BottomMenu />
    </View>
  );
};

export default HotelBooking;
