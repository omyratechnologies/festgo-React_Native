import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import EventsBackgroundImage from '~/assets/images/events/EventsBackground.svg';
import MarraigeImage from '~/assets/images/events/Marraige.png';
import { Ionicons } from '@expo/vector-icons';
import { MainTabNavigationProp } from '~/navigation/types';

const eventColors = [
  '#FF6565', '#65D6FF', '#FBA255', '#FF65B4',
  '#FF373A', '#37FF62', '#FF9D00', '#3E37FF'
];

const events = [
  {
    id: 1,
    name: 'Wedding',
    image: MarraigeImage,
    color: eventColors[0],
  },
  {
    id: 2,
    name: 'Birthdays',
    image: MarraigeImage,
    color: eventColors[1],
  },
  {
    id: 3,
    name: 'Corporate Events',
    image: MarraigeImage,
    color: eventColors[2],
  },
  {
    id: 4,
    name: 'Anniversary',
    image: MarraigeImage,
    color: eventColors[3],
  },
  {
    id: 5,
    name: 'Engagement',
    image: MarraigeImage,
    color: eventColors[4],
  },
  {
    id: 6,
    name: 'House Warming',
    image: MarraigeImage,
    color: eventColors[5],
  },
  {
    id: 7,
    name: 'Half Saree',
    image: MarraigeImage,
    color: eventColors[6],
  },
  {
    id: 8,
    name: 'Others',
    image: MarraigeImage,
    color: eventColors[7],
  },
];

const EventsPage = () => {
  const navigation = useNavigation<MainTabNavigationProp>();

  const handleEventPress = (event: (typeof events)[0]) => {
    navigation.navigate('EventsInfoPage', { eventId: event.id });
  };

  const handleBack = () => {
    navigation.navigate('HomePage');
  };

  return (
    <View className="flex-1 bg-white">
      <View>
        <View
          style={{
            height: 180,
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'flex-start',
          }}>
          <HotelBookingHeaderMenu white />
          <EventsBackgroundImage
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
            <Text className='font-baloo ' style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
              Events
            </Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              onPress={() => handleEventPress(event)}
              style={{
                width: '48%',
                backgroundColor: event.color,
                borderRadius: 25,
                marginBottom: 16,
                overflow: 'hidden',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 4,
              }}
              activeOpacity={0.85}>
              <View style={{ padding: 12 }}>
                <Text className='text-center font-baloo w-full' style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                  {event.name}
                </Text>
              </View>
              <Image
                source={event.image}
                style={{
                  width: '100%',
                  height: 120,
                  borderBottomLeftRadius: 16,
                  borderBottomRightRadius: 16,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default EventsPage;

