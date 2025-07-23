import { View, Text } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderMenu from './HeaderMenu';
import { ScrollView } from 'react-native-gesture-handler';

const UpcomingScreen = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-start">
        <HeaderMenu />
        <ScrollView></ScrollView>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

export default UpcomingScreen;
