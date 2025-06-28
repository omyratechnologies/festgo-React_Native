import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import HotelIcon from '~/assets/images/homepage/details/Hotels.svg';
import ResortsIcon from '~/assets/images/homepage/details/Resorts.svg';
import EventsIcon from '~/assets/images/homepage/details/Events.svg';
import BanquetsIcon from '~/assets/images/homepage/details/Banquets.svg';
import BeachFestIcon from '~/assets/images/homepage/details/BeachFest.svg';
import CityFestsIcon from '~/assets/images/homepage/details/CityFests.svg';
import TripsIcon from '~/assets/images/homepage/details/Trips.svg';
import FestBiteIcon from '~/assets/images/homepage/details/FestBite.svg';
import HomePageLogoIcon from '~/assets/images/homepage/details/HomePageLogo.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

const topServices = [
  { icon: HotelIcon, label: 'Hotels', page: 'HotelBooking' },
  { icon: ResortsIcon, label: 'Resorts', page: 'HotelBooking' },
  { icon: EventsIcon, label: 'Events', page: 'EventsPage' },
  { icon: BanquetsIcon, label: 'Banquets', page: 'HotelBooking' },
];

const bottomServices = [
  { icon: BeachFestIcon, label: 'Beach Fest', page: 'HotelBooking' },
  { icon: CityFestsIcon, label: 'City Fests', page: 'HotelBooking' },
  { icon: TripsIcon, label: 'Trips', page: 'HotelBooking' },
  { icon: FestBiteIcon, label: 'Fest Bite', page: 'HotelBooking' },
];

const ServiceDetails = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <View className="items-center justify-center">
      <View className="mb-8 items-center justify-center">
        <HomePageLogoIcon width={250} height={180} />
      </View>
      <View className="mb-5 flex-row justify-center space-x-4">
        {topServices.map(({ icon: Icon, label, page }) => (
          <TouchableOpacity
            key={label}
            onPress={() => navigation.navigate({ name: page as any, params: undefined })}
            className="mx-2 h-[80px] w-[80px] items-center justify-center rounded-full bg-white p-4 shadow-md"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <Icon width={40} height={40} />
            <Text className="mt-2 font-baloo text-xs font-semibold text-[#222]">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="mb-5 flex-row justify-center space-x-3">
        {bottomServices.map(({ icon: Icon, label }) => (
          <View
            key={label}
            className="mx-1.5 h-[60px] w-[72px] items-center justify-center rounded-xl bg-white shadow"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 4,
            }}>
            <Icon width={28} height={28} />
            <Text className="mt-1.5 text-center font-baloo text-xs font-medium text-[#444]">
              {label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default ServiceDetails;
