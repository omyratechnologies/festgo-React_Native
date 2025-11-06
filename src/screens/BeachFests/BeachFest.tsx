import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
  Dimensions,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import { MainTabNavigationProp } from '~/navigation/types';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '~/utils/api';
import { LinearGradient } from 'expo-linear-gradient';
import BeachFestDetails from './BeachFestDetails';
import Svg, { Path } from 'react-native-svg';
import WalletIcon from '~/assets/images/common/Navbar/walletLight.svg';
import NotificationIcon from '~/assets/images/common/Navbar/NotificationLight.svg';
import UserProfileLight from '~/assets/images/common/Navbar/userProfileLight.svg';


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
  const [selectedLocation, setSelectedLocation] = useState('Hyderabad');

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

  const Wallet = WalletIcon;
  const Notification = NotificationIcon;

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View
        style={{
          height: 280,
          position: 'relative',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {/* Background Image */}
        <View className="absolute inset-0 overflow-hidden bg-[#0E54EC]">
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
            }}
            className="h-full w-full opacity-20"
            resizeMode="cover"
          />
        </View>

        {/* Top Bar with Location and Icons */}
        <View className="absolute z-10 mt-16 w-full flex-row items-center justify-between bg-transparent px-8 pb-6 pt-2">
          <View className="flex-row items-center">
            <TouchableOpacity  onPress={() => navigation.navigate('Profile')}>
          <UserProfileLight width={32} height={32} />
        </TouchableOpacity>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.navigate('Wallet')} className="mr-4">
              <Wallet width={28} height={28} />
            </TouchableOpacity>
            <TouchableOpacity  onPress={() => navigation.navigate('Notifications')}>
              <Notification width={28} height={28} />
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
            Beach Fests
          </Text>
        </View>
      </View>

      {/* Main Content */}
      <ScrollView
        className="flex-1 bg-white -mt-20 rounded-t-[40px]"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 120, paddingTop: 36 }}>
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
          <View className="flex-row flex-wrap justify-between">
            {fests.map((fest) => (
              <TouchableOpacity
                onPress={() => handleFestPress(fest)}
                key={fest.id}
                className="mb-4 w-[48%]">
                <View className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-sm">
                  <Image
                    source={{
                      uri:
                        fest.image_urls?.[0] ||
                        'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                  {/* Quarter Circle Date */}
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
                  {/* Gradient Overlay */}
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
                  {/* Event Details Overlay */}
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
                    <View className="mt-1 flex-row items-center gap-2">
                      <Svg width={16} height={16} viewBox="0 0 24 24" fill="none">
                        <Path
                          d="M4 9V7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z"
                          stroke="#0E54EC"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <Path
                          d="M8 12h.01M12 12h.01M16 12h.01"
                          stroke="#0E54EC"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </Svg>
                      <Text className="text-base font-semibold text-white">
                        ₹{fest.price_per_pass}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

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

      <BottomMenu />
    </View>
  );
};

export default BeachFest;
