import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import StarIcon from '~/assets/icons/star.svg';
import MapPinIcon from '~/assets/icons/location-icon.svg';
import HeartIcon from '~/assets/icons/profile/Heart.svg';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '~/navigation/types';
import { fetchNearbyHotels, ApiResponse } from '~/utils/api';
import { getCurrentLocation } from '~/utils/location';

interface Hotel {
  id: string;
  name: string;
  location: string | {
    lat: number;
    lng: number;
    city: string;
    state: string;
    country: string;
    pincode: string;
    locality: string;
    houseNumber: string;
    searchLocation: string;
  };
  rating: number;
  price: number;
  image: string;
  latitude?: number;
  longitude?: number;
}

const HotelCard = ({ hotel }: { hotel: Hotel }) => {
  const navigation = useNavigation<MainTabNavigationProp>();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('HotelBookingDetails', {
          hotelId: hotel.id,
          propertyType: 'hotel', // Since this is NearbyHotels, it's always hotel type
          searchParams: {
            todate: '26-07-2025',
            enddate: '27-07-2025',
            adult: '1',
            child: '0',
            rooms: '1',
            staynight: '1',
            location: 'Current Location',
          },
        })
      }
      className="relative mb-2 h-[230px] w-[170px] overflow-hidden rounded-2xl bg-white">
      <Image source={{ uri: hotel.image }} className="h-full w-full" />
      <LinearGradient
        colors={['rgba(0,0,0,0.5)', 'transparent']}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
        }}
        start={{ x: 0, y: 1 }}
        end={{ x: 0, y: 0 }}>
        <TouchableOpacity className="absolute right-2.5 top-2.5 z-10 rounded-full bg-white p-1.5 shadow">
          <HeartIcon />
        </TouchableOpacity>
        <View className="absolute bottom-3 left-3 right-3">
          <Text className="mb-1 font-poppins text-base font-bold text-white" numberOfLines={1}>
            {hotel.name}
          </Text>
          <View className="mb-1 flex-row items-center">
            <MapPinIcon className="mr-2" />
            <Text className="ml-1 font-poppins text-xs text-white">
              {typeof hotel.location === 'string' 
                ? hotel.location 
                : hotel.location.city || hotel.location.locality || hotel.location.searchLocation || 'Location not available'}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <StarIcon />
              <Text className="font-poppins text-xs font-bold text-yellow-400">{hotel.rating}</Text>
            </View>
            <Text className="font-poppins text-sm font-bold text-white">₹{hotel.price}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const NearbyHotels = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNearbyHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      const location = await getCurrentLocation();
      if (!location) {
        setLoading(false);
        return;
      }

      // For nearby hotels, we only send coordinates, not location name
      const data: ApiResponse<Hotel[]> = await fetchNearbyHotels({
        latitude: location.latitude,
        longitude: location.longitude,
        radius: 50,
        property_type: 'hotel',
        rooms: '1',
        adult: '1',
        child: '0',
        staynight: '1',
      });

      if (data.success && data.properties) {
        const hotelArray = Array.isArray(data.properties) ? data.properties : [];
        setHotels(hotelArray);
      } else {
        setHotels([]);
      }
    } catch (err) {
      console.error('Error fetching nearby hotels:', err);
      setError('Failed to load nearby hotels. Please try again.');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNearbyHotels();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <View className="h-[230px] items-center justify-center">
          <ActivityIndicator size="large" color="#0E54EC" />
          <Text className="mt-2 font-poppins text-sm text-gray-600">Finding nearby hotels...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="h-[230px] items-center justify-center px-4">
          <Text className="mb-2 font-poppins text-base font-semibold text-red-600">Error</Text>
          <Text className="mb-4 text-center font-poppins text-sm text-gray-600">{error}</Text>
          <TouchableOpacity
            onPress={loadNearbyHotels}
            className="rounded-lg bg-[#0E54EC] px-4 py-2">
            <Text className="font-poppins text-sm font-semibold text-white">Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (hotels.length === 0) {
      return (
        <View className="h-[230px] items-center justify-center px-4">
          <Text className="mb-2 font-poppins text-base font-semibold text-gray-800">
            No Nearby Hotels
          </Text>
          <Text className="mb-4 text-center font-poppins text-sm text-gray-600">
            No hotels found in your area. Try changing your location or expanding your search
            radius.
          </Text>
          <TouchableOpacity
            onPress={loadNearbyHotels}
            className="rounded-lg bg-[#0E54EC] px-4 py-2">
            <Text className="font-poppins text-sm font-semibold text-white">Refresh</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <FlatList
        data={hotels}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HotelCard hotel={item} />}
        contentContainerStyle={{ paddingHorizontal: 20 }}
        ItemSeparatorComponent={() => <View style={{ width: 16 }} />}
      />
    );
  };

  return (
    <View className="my-4 mt-48">
      <View className="mb-3 flex-row items-center justify-between px-8">
        <Text className="font-poppins text-xl font-bold">Hotel Nearby</Text>
        <TouchableOpacity onPress={loadNearbyHotels} className="p-2">
          <Text className="font-poppins text-sm text-[#0E54EC]">Refresh</Text>
        </TouchableOpacity>
      </View>
      {renderContent()}
    </View>
  );
};

export default NearbyHotels;