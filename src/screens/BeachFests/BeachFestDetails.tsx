import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BeachFestItem } from './BeachFest';
import BeachFestImageBackground from '~/assets/images/events/CityFests.svg';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';

type Props = {
  fest: BeachFestItem;
  onClose: () => void;
};

const BeachFestDetails = React.memo(({ fest, onClose }: Props) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  
  const handleBookNow = useCallback(() => {
    if (!fest.id) return;
    onClose();
    navigation.navigate('BeachFestCheckout', { festId: fest.id });
  }, [fest.id, onClose, navigation]);
  console.log("festId", fest.id)

  // Memoize date formatting to prevent re-renders
  const formattedStartDate = useMemo(() => {
    return new Date(fest.event_start).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  }, [fest.event_start]);

  const formattedStartTime = useMemo(() => {
    return new Date(fest.event_start).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, [fest.event_start]);

  const formattedEndTime = useMemo(() => {
    return new Date(fest.event_end).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, [fest.event_end]);

  return (
    <View className="flex-1 bg-white">
      <View
        style={{
          height: 250,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        <HotelBookingHeaderMenu white />
        <BeachFestImageBackground
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
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
            marginBottom: 10,
          }}>
          <TouchableOpacity onPress={onClose} style={{ marginRight: 10 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text
            className="font-baloo capitalize"
            style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
            {fest.type}
          </Text>
        </View>
        <View
          style={{
            position: 'absolute',
            top: 150,
            left: 20,
            flexDirection: 'column',
            alignItems: 'flex-start',
            zIndex: 2,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="location-sharp" size={16} color="#d1d5db" style={{ marginRight: 4 }} />
            <Text className="font-poppins text-sm text-white">{fest.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
            <Ionicons name="calendar" size={16} color="#d1d5db" style={{ marginRight: 4 }} />
            <Text className="font-poppins text-sm text-white">
              {formattedStartDate} | {formattedStartTime} - {formattedEndTime}
            </Text>
          </View>
        </View>
      </View>

      {/* Header */}
      <View className="flex items-center justify-center bg-white px-10 py-2">
        <View className="relative -mt-12 h-52 w-full items-center justify-center overflow-hidden rounded-3xl">
          <Image
            source={{
              uri: 'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
            }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            }}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 px-10  py-4">
        <View className="rounded-3xl border border-[#00000052] p-4">
          <Text className="font text-base font-semibold">Highlights</Text>
          <Text className="mb-4 font-poppins text-sm text-gray-600">{fest.highlights}</Text>

          <Text className="mb-2 text-base font-semibold">What’s Included</Text>
          {fest.whats_included.map((item, idx) => (
            <Text key={idx} className="font-poppins text-sm text-gray-700">
              • {item}
            </Text>
          ))}
        </View>

        <View className="mt-12 h-48 overflow-hidden rounded-lg">
          <Image
            source={{ uri: 'https://staticmapmaker.com/img/google-placeholder.png' }}
            className="h-40 w-full rounded-3xl"
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity
          className="mb-12 mt-2 rounded-full bg-blue-600 px-4 py-3 text-center"
          onPress={handleBookNow}>
          <Text className="text-center text-lg font-semibold text-white">
            Entry Pass at ₹{fest.price_per_pass} only
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

export default BeachFestDetails;
