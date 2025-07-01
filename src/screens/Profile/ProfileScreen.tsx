import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import BottomMenu from '~/components/common/BottomMenu';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import MyBookings from '~/components/Profile/MyBookings';
import PaymentMethods from '~/components/Profile/PaymentMethods';
import ProfileDetails from '~/components/Profile/ProfileDetails';
import ProfileOptions from '~/components/Profile/ProfileOptions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';

const ProfileScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        if (!jwtToken) {
          console.log('No JWT token found');
          setLoading(false);
          return;
        }
        const response = await fetch(`${API_URL}/me`, {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        });
        const data = await response.json();
        setData(data.user);
      } catch (error) {
        console.log('Error fetching user details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-white justify-center items-center">
        {/* <ProfileHeaderMenu /> */}
        <ActivityIndicator size="large" color="#000" />
        <BottomMenu />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="flex-1 justify-start">
        <ProfileHeaderMenu />
        <ScrollView>
          <ProfileDetails data={data}/>
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
