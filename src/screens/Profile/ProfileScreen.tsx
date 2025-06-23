import { View, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '~/components/common/BottomMenu';

import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import MyBookings from '~/components/Profile/MyBookings';
import PaymentMethods from '~/components/Profile/PaymentMethods';
import ProfileDetails from '~/components/Profile/ProfileDetails';
import ProfileOptions from '~/components/Profile/ProfileOptions';

const ProfileScreen = () => {
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-start">
        <ProfileHeaderMenu />
        <ScrollView>
          <ProfileDetails />
          <MyBookings />
          <PaymentMethods />
          <ProfileOptions />
        </ScrollView>
        <BottomMenu />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
