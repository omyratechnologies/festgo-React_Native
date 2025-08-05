import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import { AntDesign } from '@expo/vector-icons';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';

const { width } = Dimensions.get('window');

type Offer = {
  id: string;
  name: string;
  image: string;
  discount: string;
  type: string;
  promoCode: string;
  description: string;
  bookingWindowStart?: string;
  bookingWindowEnd?: string;
  stayDatesStart?: string;
  stayDatesEnd?: string;
  entityNames?: string[];
  status?: string;
};

type OfferCardProps = {
  offer: Offer;
  onPress: () => void;
};

const OfferCard: React.FC<OfferCardProps> = ({ offer, onPress }) => {
  return (
    <View className="mx-4 mb-6">
      <View className="rounded-2xl bg-white shadow-lg overflow-hidden relative">
        {/* Offer Image with Inverted Circles */}
        <View className="relative">
          <Image
            source={{ uri: offer.image }}
            className="w-full h-44"
            resizeMode="cover"
          />
          {/* Inverted Circles - left, right, bottom */}
          <View
            className="absolute left-[-18px] top-1/2"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'white',
              transform: [{ translateY: -18 }],
            }}
          />
          <View
            className="absolute right-[-18px] top-1/2"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'white',
              transform: [{ translateY: -18 }],
            }}
          />
          <View
            className="absolute left-1/2 bottom-[-18px]"
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'white',
              transform: [{ translateX: -18 }],
            }}
          />
          {/* Gradient overlay for promo code and highlight */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              height: 80,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          />
          {/* Promo code and highlight text */}
          <View className="absolute bottom-3 left-4 right-4 flex-row items-end justify-between">
            <View>
              <Text className="font-baloo text-lg font-bold text-white">
                {offer.name}
              </Text>
              <Text className="font-baloo text-xs text-white opacity-80 mt-1">
                {offer.discount} | {offer.type}
              </Text>
            </View>
            <View className="bg-white/80 px-3 py-1 rounded-full">
              <Text className="font-bold text-xs text-black tracking-widest">
                {offer.promoCode}
              </Text>
            </View>
          </View>
        </View>
        {/* Highlight/Description */}
        <View className="px-4 py-3">
          <Text className="font-baloo text-base text-gray-800 mb-2" numberOfLines={2}>
            {offer.description}
          </Text>
          <TouchableOpacity
            className="self-end mt-2 rounded-full px-5 py-2 bg-[#F15A29]"
            onPress={onPress}
            activeOpacity={0.85}
          >
            <Text className="font-bold text-white text-sm">View Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

type OfferDetailModalProps = {
  visible: boolean;
  offer: Offer | null;
  onClose: () => void;
};

const OfferDetailModal: React.FC<OfferDetailModalProps> = ({ visible, offer, onClose }) => {
  if (!offer) return null;
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-white">
        {/* Header with close button */}
        <View className="flex-row items-center justify-between px-6 pt-12 pb-4 bg-[#F15A29] rounded-b-3xl">
          <Text className="font-baloo text-xl font-bold text-white">Offer Details</Text>
          <TouchableOpacity onPress={onClose} className="p-2">
            <AntDesign name="close" size={28} color="white" />
          </TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
          {/* Image with gradient and promo code */}
          <View className="relative">
            <Image
              source={{ uri: offer.image }}
              className="w-full h-60"
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 100,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            />
            <View className="absolute bottom-5 left-6 right-6 flex-row items-end justify-between">
              <View>
                <Text className="font-baloo text-2xl font-bold text-white">
                  {offer.name}
                </Text>
                <Text className="font-baloo text-base text-white opacity-80 mt-1">
                  {offer.discount} | {offer.type}
                </Text>
              </View>
              <View className="bg-white/80 px-4 py-2 rounded-full">
                <Text className="font-bold text-base text-black tracking-widest">
                  {offer.promoCode}
                </Text>
              </View>
            </View>
          </View>
          {/* Details */}
          <View className="px-6 py-6">
            <Text className="font-baloo text-lg font-bold text-gray-900 mb-2">
              {offer.description}
            </Text>
            <View className="mb-3">
              <Text className="font-baloo text-base text-gray-700">
                <Text className="font-bold">Booking Window: </Text>
                {offer.bookingWindowStart} to {offer.bookingWindowEnd}
              </Text>
              <Text className="font-baloo text-base text-gray-700 mt-1">
                <Text className="font-bold">Stay Dates: </Text>
                {offer.stayDatesStart} to {offer.stayDatesEnd}
              </Text>
              <Text className="font-baloo text-base text-gray-700 mt-1">
                <Text className="font-bold">Applicable On: </Text>
                {offer.entityNames && offer.entityNames.length > 0
                  ? offer.entityNames.join(', ')
                  : 'All'}
              </Text>
              <Text className="font-baloo text-base text-gray-700 mt-1">
                <Text className="font-bold">Status: </Text>
                {offer.status}
              </Text>
            </View>
            <View className="mt-4">
              <Text className="font-baloo text-base text-gray-800">
                <Text className="font-bold">Promo Code: </Text>
                <Text className="text-[#F15A29] font-bold">{offer.promoCode}</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const OffersPage: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fetchOffers = useCallback(async () => {
    setLoading(true);
    try {
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      const res = await fetch(`${API_URL}/offers/getoffers`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e) {
      setOffers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOffers();
  };

  const openOffer = (offer: Offer) => {
    setSelectedOffer(offer);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOffer(null);
  };

  return (
    <View className="flex-1 ">
    <ProfileHeaderMenu isDifferentPage pageTitle='Offers'/>
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#F15A29" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 mt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {offers.length === 0 ? (
            <View className="mt-20 items-center">
              <Text className="font-baloo text-lg text-gray-500">No offers available right now.</Text>
            </View>
          ) : (
            offers.map((offer) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                onPress={() => openOffer(offer)}
              />
            ))
          )}
        </ScrollView>
      )}
      <OfferDetailModal
        visible={modalVisible}
        offer={selectedOffer}
        onClose={closeModal}
      />
      <BottomMenu />
    </View>
  );
};

export default OffersPage;