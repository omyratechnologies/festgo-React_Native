import React, { useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BeachFestItem } from './BeachFest';
import BeachFestImageBackground from '~/assets/images/events/CityFests.svg';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import { useAuth } from '~/hooks/useAuth';

function extractLatLngFromGMapUrl(url: string): { latitude: number; longitude: number } | null {
  const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
  const regex2 = /[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/;
  const regex3 = /\/place\/(-?\d+\.\d+),(-?\d+\.\d+)/;
  let match = url.match(regex);
  if (!match) match = url.match(regex2);
  if (!match) match = url.match(regex3);
  if (match) {
    return {
      latitude: parseFloat(match[1]),
      longitude: parseFloat(match[2]),
    };
  }
  return null;
}

const BeachFestDetails = React.memo(({ fest, onClose }: { fest: BeachFestItem; onClose: () => void }) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const { isAuthenticated } = useAuth();

  const handleBookNow = useCallback(() => {
    if (!fest.id) return;
    onClose();
    navigation.navigate('BeachFestCheckout', { festId: fest.id });
  }, [fest.id, onClose, navigation]);

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

  const handleOpenMap = useCallback(() => {
    if (fest.gmap_url) {
      Linking.openURL(fest.gmap_url);
    }
  }, [fest.gmap_url]);

  const mapCoords = useMemo(() => {
    if (fest.gmap_url) {
      return extractLatLngFromGMapUrl(fest.gmap_url);
    }
    return null;
  }, [fest.gmap_url]);

  // Generate Google Static Maps API URL for preview
  const staticMapUrl = useMemo(() => {
    if (mapCoords) {
      const { latitude, longitude } = mapCoords;
      // You can add your Google Maps Static API key if you want higher resolution or more features
      // const apiKey = 'YOUR_GOOGLE_MAPS_STATIC_API_KEY';
      // &key=${apiKey}
      return `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}&scale=2`;
    }
    return null;
  }, [mapCoords]);

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

        {/* Google Maps Preview Map */}
        {/* {fest.gmap_url && mapCoords && staticMapUrl ? (
          <TouchableOpacity
            className="mt-12 mb-4 overflow-hidden rounded-lg"
            onPress={handleOpenMap}
            activeOpacity={0.85}
            style={{
              height: 192, // h-48
              width: '100%',
              borderRadius: 16,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <Image
              source={{ uri: staticMapUrl }}
              style={{
                width: '100%',
                height: '100%',
                borderRadius: 16,
                resizeMode: 'cover',
              }}
              resizeMode="cover"
            />
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255,255,255,0.85)',
                padding: 10,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomLeftRadius: 16,
                borderBottomRightRadius: 16,
              }}
            >
              <Ionicons name="map" size={22} color="#2563eb" style={{ marginRight: 8 }} />
              <Text className="font-poppins text-base font-semibold text-blue-700 underline">
                View on Google Maps
              </Text>
            </View>
          </TouchableOpacity>
        ) : null} */}

        {isAuthenticated && (
          <TouchableOpacity
            className="mb-12 mt-2 rounded-full bg-blue-600 px-4 py-3 text-center"
            onPress={handleBookNow}>
            <Text className="text-center text-lg font-semibold text-white">
              Entry Pass at ₹{fest.price_per_pass} only
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
});

export default BeachFestDetails;
