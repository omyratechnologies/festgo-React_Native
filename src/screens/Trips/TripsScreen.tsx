import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import WalletIcon from '~/assets/images/common/Navbar/walletLight.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';
import Svg, { Path } from 'react-native-svg';
import BottomMenu from '~/components/common/BottomMenu';

const TripsScreen: React.FC = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden">
          <Image
            source={require('~/assets/images/trips/bg.png')}
            className="h-full w-full"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <UserProfileLight width={32} height={32} />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} className="mr-4">
              <WalletIcon width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
              <NotificationIcon width={28} height={28} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Navigation and Title */}
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
            <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
              <Path
                d="M15 18l-6-6 6-6"
                stroke="white"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </TouchableOpacity>
          <Text className="font-baloo" style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            Trips
          </Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 52 }} className='flex-1 bg-white -mt-20 rounded-t-[40px]'>
        <View style={{ flexDirection: 'row', gap: 12, marginTop: -32 }}>
          {/* Book a Trip */}
          <View style={styles.optionCard}>
            <Image
              source={require('~/assets/images/trips/bookatrip.png')}
              style={{ width: 132, height: 110, marginBottom: 8, borderRadius: 16 }}
              resizeMode="cover"
            />
            <Text style={[styles.optionTitle]} className='font-baloo text-primary'>Book a Trip</Text>
            <Text style={styles.optionDesc}>
              Discover and book{'\n'}pre-organized{'\n'}group trips
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TripBrowse')}
              style={[styles.ctaButton, { backgroundColor: '#0E54EC' }]}>
              <Text style={styles.ctaText} className='font-baloo text-white'>Book Now</Text>
            </TouchableOpacity>
          </View>
          {/* Plan my Trip */}
          <View style={styles.optionCard}>
            <Image
              source={require('~/assets/images/trips/planatrip.png')}
              style={{ width: 132, height: 110, marginBottom: 8, borderRadius: 16 }}
              resizeMode="cover"
            />
            <Text style={[styles.optionTitle]} className='font-baloo text-secondary'>Plan my Trip</Text>
            <Text style={styles.optionDesc}>
              Provide details to{'\n'}plan a custom trip{'\n'}tailored for you
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TripPlan')}
              style={[styles.ctaButton, { backgroundColor: '#0E54EC' }]}>
              <Text style={styles.ctaText} className='font-baloo text-white'>Plan Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Poster image */}
        <View
          style={{
            marginTop: 24,
            height: 240,
            borderRadius: 16,
            backgroundColor: '#F3F4F6',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}>
          <Image
            source={require('~/assets/images/trips/poster.png')}
            style={{ width: '100%', height: '100%', borderRadius: 16, marginBottom: 16 }}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

const styles = StyleSheet.create({
  optionCard: {
    flex: 1,
    borderRadius: 18,
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 16,
  },
  optionTitle: {
    fontSize: 16,
    marginTop: 2,
  },
  optionDesc: {
    marginTop: 8,
    color: '#374151',
    textAlign: 'center',
    fontSize: 13,
  },
  ctaButton: {
    marginTop: 16,
    borderRadius: 99,
    paddingVertical: 8,
    width: '100%',
  },
  ctaText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  },
});

export default TripsScreen;
