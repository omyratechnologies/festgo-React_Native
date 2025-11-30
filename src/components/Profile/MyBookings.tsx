import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import HotelIcon from '~/assets/images/homepage/details/Hotels.svg';
import ResortsIcon from '~/assets/images/homepage/details/Resorts.svg';
import EventsIcon from '~/assets/images/homepage/details/Events.svg';
import BeachFestIcon from '~/assets/images/homepage/details/BeachFest.svg';
// import BanquetsIcon from '~/assets/images/homepage/details/Banquets.svg';
// import CityFestsIcon from '~/assets/images/homepage/details/CityFests.svg';
// import TripsIcon from '~/assets/images/homepage/details/Trips.svg';
// import FestBiteIcon from '~/assets/images/homepage/details/FestBite.svg';

const services = [
  { icon: HotelIcon, label: 'Hotels', filter: 'hotel' as const },
  { icon: ResortsIcon, label: 'Resorts', filter: 'hotel' as const },
  { icon: EventsIcon, label: 'Events', filter: 'event' as const },
  { icon: BeachFestIcon, label: 'Beach Fest', filter: 'beachfest' as const },
  // { icon: BanquetsIcon, label: 'Banquets' },
  // { icon: CityFestsIcon, label: 'City Fests' },
  // { icon: TripsIcon, label: 'Trips' },
  // { icon: FestBiteIcon, label: 'Fest Bite' },
];

const MyBookings = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const handleServicePress = (service: typeof services[0]) => {
    // Navigate to MyOrders with the appropriate filter
    if (service.filter) {
      navigation.navigate('MyOrders', { filter: service.filter });
    }
  };

  const handleViewAllBookings = () => {
    navigation.navigate('MyOrders');
  };

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
      <View className="mb-3 flex-row items-center justify-between px-4">
        <Text className="font-baloo text-lg font-bold text-black">My Bookings</Text>
        <TouchableOpacity
          onPress={handleViewAllBookings}
          activeOpacity={0.7}
          className="rounded-full bg-[#F15A29] px-3 py-1">
          <Text className="font-baloo text-xs font-semibold text-white">View All</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap justify-between">
        {services.map(({ icon: Icon, label, filter }) => (
          <TouchableOpacity
            key={label}
            className="mx-2 mb-4 w-1/5 items-center justify-center rounded-full bg-white p-2"
            onPress={() => handleServicePress({ icon: Icon, label, filter })}
            activeOpacity={0.7}
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}>
            <Icon width={30} height={30} />
            <Text className="mt-2 font-baloo text-xs font-semibold text-[#222]">{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default MyBookings;
