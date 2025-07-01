import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import EventsBackgroundImage from '~/assets/images/events/EventsBackground.svg';
import { Ionicons } from '@expo/vector-icons';
import { MainTabNavigationProp } from '~/navigation/types';
import { API_URL } from '~/utils/api';

const eventColors = [
  '#FF6565',
  '#65D6FF',
  '#FBA255',
  '#FF65B4',
  '#FF373A',
  '#37FF62',
  '#FF9D00',
  '#3E37FF',
];

type EventType = {
  id: string;
  name: string;
  imageUrl: string;
};

const EventsPage = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events/event-types`);
        const data = await res.json();
        setEvents(data);
      } catch (e) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleEventPress = (event: EventType) => {
    navigation.navigate('EventsInfoPage', { eventId: event.id });
  };

  const handleBack = () => {
    navigation.goBack();
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
            <Text
              className="font-baloo "
              style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
              Events
            </Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 40 }}>
            <ActivityIndicator size="large" color="#FF6565" />
          </View>
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
            {events.map((event, idx) => (
              <TouchableOpacity
                key={event.id}
                onPress={() => handleEventPress(event)}
                style={{
                  width: '48%',
                  backgroundColor: eventColors[idx % eventColors.length],
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
                <View style={{ paddingVertical: 12 }}>
                  <Text
                    className="w-full whitespace-nowrap text-center font-baloo"
                    style={{ fontWeight: 'bold', fontSize: 18, color: '#fff' }}>
                    {event.name}
                  </Text>
                </View>
                <Image
                  source={{ uri: event.imageUrl }}
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
        )}
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default EventsPage;
