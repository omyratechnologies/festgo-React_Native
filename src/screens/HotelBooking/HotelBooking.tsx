import { View, StyleSheet, FlatList } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBackgroundImage from '~/assets/images/homepage/HomeBackground.svg';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import HotelBookingCard from '~/components/HotelBooking/HotelBookingCard';
import NearbyHotels from '~/components/HotelBooking/HotelBookingHome/NearbyHotels';
import RecommendationHotels from '~/components/HotelBooking/HotelBookingHome/RecommendationHotels';

type DataItem = 'spacer' | 'nearby' | 'recommendations';

const DATA: DataItem[] = ['spacer', 'nearby', 'recommendations'];

const HotelBooking = () => {
  // Removed unused 'sheet' and 'setSheet'

  const renderItem = ({ item }: { item: DataItem }) => {
    if (item === 'spacer') {
      return (
        <View>
          <View
            style={{ height: 280, position: 'relative', display: 'flex', alignItems: 'center' }}>
            <HotelBookingHeaderMenu white />
            <HotelBackgroundImage
              width="100%"
              height="100%"
              style={StyleSheet.absoluteFill}
              preserveAspectRatio="none"
            />
            <HotelBookingCard />
          </View>
        </View>
      );
    }
    if (item === 'nearby') {
      return <NearbyHotels />;
    }
    if (item === 'recommendations') {
      return <RecommendationHotels />;
    }
    return null;
  };

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={DATA}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        ListFooterComponent={<View style={{ height: 100 }} />}
        showsVerticalScrollIndicator={false}
      />
      <BottomMenu />
    </View>
  );
};

export default HotelBooking;
