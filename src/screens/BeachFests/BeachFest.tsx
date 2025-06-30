import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import BeachFestImageBackground from '~/assets/images/events/CityFests.svg';
import { MainTabNavigationProp } from '~/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const BeachFest = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const handleBack = () => {
    navigation.navigate('HomePage');
  };
  return (
    <View className="flex-1 justify-start">
      <View>
        <View
          style={{
            height: 180,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <HotelBookingHeaderMenu white />
          <BeachFestImageBackground
            width="100%"
            height="100%"
            style={StyleSheet.absoluteFill}
            preserveAspectRatio="none"
          />
          <View
            style={{
              position: 'absolute',
              top: 110,
              left: 20,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 2,
            }}>
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 10 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text
              className="font-baloo "
              style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
              Beach Fests
            </Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View className="p-4">
          <Text className="text-lg font-bold text-gray-800">Beach </Text>
          {/* Add your form fields here */}
          <Text className="mt-4 text-gray-600">
            This is where you can edit your profile details.
          </Text>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default BeachFest;