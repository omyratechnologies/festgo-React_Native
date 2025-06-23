import { View, Text } from 'react-native';
import React from 'react';
import HotelIcon from '~/assets/images/homepage/details/Hotels.svg';
import ResortsIcon from '~/assets/images/homepage/details/Resorts.svg';
import EventsIcon from '~/assets/images/homepage/details/Events.svg';
import BanquetsIcon from '~/assets/images/homepage/details/Banquets.svg';
import BeachFestIcon from '~/assets/images/homepage/details/BeachFest.svg';
import CityFestsIcon from '~/assets/images/homepage/details/CityFests.svg';
import TripsIcon from '~/assets/images/homepage/details/Trips.svg';
import FestBiteIcon from '~/assets/images/homepage/details/FestBite.svg';

const services = [
  { icon: HotelIcon, label: 'Hotels' },
  { icon: ResortsIcon, label: 'Resorts' },
  { icon: EventsIcon, label: 'Events' },
  { icon: BanquetsIcon, label: 'Banquets' },
  { icon: BeachFestIcon, label: 'Beach Fest' },
  { icon: CityFestsIcon, label: 'City Fests' },
  { icon: TripsIcon, label: 'Trips' },
  { icon: FestBiteIcon, label: 'Fest Bite' },
];

const MyBookings = () => {
  return (
    <View
      className="m-4 mt-12 rounded-3xl bg-white p-4"
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.07,
        shadowRadius: 4,
        elevation: 9,
      }}>
      <Text className="mb-3 px-4 font-baloo text-lg font-bold text-black">My Bookings</Text>
      <View className="flex-row flex-wrap justify-between">
        {services.map(({ icon: Icon, label }) => (
          <View
            key={label}
            className="mx-2 mb-4 w-1/5 items-center justify-center rounded-full bg-white p-2">
            <Icon width={30} height={30} />
            <Text className="mt-2 font-baloo text-xs font-semibold text-[#222]">{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MyBookings;
