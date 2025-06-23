import { View, Text, ScrollView } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import HeaderMenu from './HeaderMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServiceDetails from '~/components/HomePage/ServiceDetails';
import OfferBanner from '~/components/HomePage/OfferBanner';
import OffersScrollable from '~/components/HomePage/OffersScrollable';

const HomePage = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-start">
        <HeaderMenu />
        <ScrollView>
          <ServiceDetails />
          <OfferBanner />
          <OffersScrollable />
        </ScrollView>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

export default HomePage;
