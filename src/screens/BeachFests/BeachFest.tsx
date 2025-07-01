import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingHeaderMenu from '~/components/HotelBooking/HotelBookingHeaderMenu';
import BeachFestImageBackground from '~/assets/images/events/CityFests.svg';
import { MainTabNavigationProp } from '~/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '~/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import BeachFestDetails from './BeachFestDetails';

export type BeachFestItem = {
  id: string;
  type: string;
  location: string;
  latitude: number;
  longitude: number;
  total_passes: number;
  available_passes: number;
  price_per_pass: number;
  event_start: string;
  event_end: string;
  highlights: string;
  image_urls: string[];
  gmap_url: string;
  whats_included: string[];
  createdAt: string;
  updatedAt: string;
};

type BeachFestResponse = {
  success: boolean;
  message: string;
  data: BeachFestItem[];
};

const BeachFest = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fests, setFests] = useState<BeachFestItem[]>([]);
  const [selectedFest, setSelectedFest] = useState<BeachFestItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleFestPress = (fest: BeachFestItem) => {
    setSelectedFest(fest);
    setShowModal(true);
  };

  const handleBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const fetchFests = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`${API_URL}/beach-fests`);
        if (!res.ok) throw new Error('Failed to fetch');
        const json: BeachFestResponse = await res.json();
        if (!json.success) throw new Error(json.message);
        setFests(json.data);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchFests();
  }, []);

  return (
    <View className="flex-1 justify-start bg-white">
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
            }}>
            <TouchableOpacity onPress={handleBack} style={{ marginRight: 10 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <Text
              className="font-baloo"
              style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>
              Beach Fests
            </Text>
          </View>
        </View>
      </View>
      <ScrollView className="flex-1">
        <View className="p-4">
          {loading && (
            <View className="flex items-center justify-center py-10">
              <ActivityIndicator size="large" color="#2563eb" />
              <Text className="mt-2 text-gray-500">Loading beach fests...</Text>
            </View>
          )}
          {error && (
            <View className="flex items-center justify-center py-10">
              <Text className="font-bold text-red-500">Error: {error}</Text>
              <TouchableOpacity
                className="mt-4 rounded bg-blue-600 px-4 py-2"
                onPress={() => {
                  setLoading(true);
                  setError(null);
                  setFests([]);
                  // re-fetch
                  (async () => {
                    try {
                      const res = await fetch(`${API_URL}/beach-fests`);
                      if (!res.ok) throw new Error('Failed to fetch');
                      const json: BeachFestResponse = await res.json();
                      if (!json.success) throw new Error(json.message);
                      setFests(json.data);
                    } catch (err: any) {
                      setError(err.message || 'Something went wrong');
                    } finally {
                      setLoading(false);
                    }
                  })();
                }}>
                <Text className="font-semibold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          {!loading && !error && fests.length === 0 && (
            <View className="flex items-center justify-center py-10">
              <Text className="text-gray-500">No beach fests found.</Text>
            </View>
          )}
          {!loading && !error && fests.length > 0 && (
            <View className="flex-wrap gap-4 space-y-6 ">
              {fests.map((fest) => (
                <TouchableOpacity
                  onPress={() => handleFestPress(fest)}
                  key={fest.id}
                  className="relative mb-4 aspect-auto w-[45%] overflow-hidden rounded-2xl bg-white">
                  <View className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg">
                    <Image
                      source={{
                        uri:
                          fest.image_urls?.[0] ||
                          'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
                      }}
                      className="h-40 w-full"
                      resizeMode="cover"
                    />
                    <View
                      style={{
                        position: 'absolute',
                        top: -40,
                        right: -40,
                        backgroundColor: '#0E54EC',
                        borderRadius: 9999,
                        paddingVertical: 16,
                        paddingHorizontal: 16,
                        zIndex: 3,
                        width: 100,
                        height: 100,
                        minWidth: 60,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                      }}>
                      <Text className="text-center text-xl font-bold leading-none text-white">
                        {new Date(fest.event_start).toLocaleDateString('en-IN', { day: '2-digit' })}
                      </Text>
                      <Text className="text-md text-center font-semibold leading-none text-white">
                        {new Date(fest.event_start)
                          .toLocaleDateString('en-IN', { month: 'short' })
                          .toUpperCase()}
                      </Text>
                    </View>
                    <LinearGradient
                      colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.9)']}
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        top: 0,
                        bottom: 0,
                        borderRadius: 12,
                      }}
                    />
                    <View
                      style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        padding: 12,
                        zIndex: 2,
                      }}>
                      <Text className="text-lg font-bold text-white">{fest.type}</Text>
                      <Text className="text-sm text-gray-200">{fest.location}</Text>
                      <Text className="mt-1 text-base font-semibold text-white">
                        ₹{fest.price_per_pass}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        {selectedFest && (
          <Modal visible={showModal} animationType="slide" presentationStyle="fullScreen">
            <BeachFestDetails
              fest={selectedFest}
              onClose={() => {
                setSelectedFest(null);
                setShowModal(false);
              }}
            />
          </Modal>
        )}
      </ScrollView>

      <BottomMenu />
    </View>
  );
};

export default BeachFest;
