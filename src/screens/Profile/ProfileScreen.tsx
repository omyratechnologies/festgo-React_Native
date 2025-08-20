import { View, ScrollView, ActivityIndicator, Text, RefreshControl } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '~/components/common/BottomMenu';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import MyBookings from '~/components/Profile/MyBookings';
import PaymentMethods from '~/components/Profile/PaymentMethods';
import ProfileDetails from '~/components/Profile/ProfileDetails';
import ProfileOptions from '~/components/Profile/ProfileOptions';
import useUserStore from '~/store/userStore';

const ProfileScreen = () => {
  const { userData, isLoading, error, fetchUserProfile } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  // Handler to reload user data
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchUserProfile?.();
    } catch (e) {
      // Optionally handle error here
    }
    setRefreshing(false);
  }, [fetchUserProfile]);

  if (isLoading && !refreshing) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
        <BottomMenu />
      </SafeAreaView>
    );
  }

  if (error && !refreshing) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-white justify-center items-center">
        <Text className="text-red-500 mb-4">{error}</Text>
        <BottomMenu />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-start">
        <ProfileHeaderMenu
        />
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <ProfileDetails data={userData} />
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
