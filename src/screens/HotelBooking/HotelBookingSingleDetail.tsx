import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';
import { useAuth } from '~/hooks/useAuth';

import PencilIcon from '~/assets/icons/EditIcon.svg';
import BottomMenu from '~/components/common/BottomMenu';
import BackIcon from '~/assets/icons/ArrowLeft.svg';
import HeartIcon from '~/assets/icons/BlueHeart.svg';
import StarIcon from '~/assets/icons/star.svg';
import LocationIcon from '~/assets/icons/location-pin.svg';
import BackIconModal from '~/assets/icons/hotelBooking/BackIcon.svg';
import TickIcon from '~/assets/icons/Tick.svg';
import { fetchPropertyDetails, PropertyDetailsParams, Room } from '~/utils/api';
import EditSearchModal from './EditSearchModal';
import RoomSelectionModal from '~/components/HotelBooking/RoomSelectionModal';
import { useRoute, RouteProp } from '@react-navigation/native';
import HotelBookingCheckout from './HotelBookingCheckout';

type RootStackParamList = {
  HotelBookingDetails: {
    hotelId: string;
    propertyType?: string;
    searchParams?: {
      todate?: string;
      enddate?: string;
      adult?: string;
      child?: string;
      rooms?: string;
      staynight?: string;
      location?: string;
    };
  };
};

type HotelBookingDetailsRouteProp = RouteProp<RootStackParamList, 'HotelBookingDetails'>;

export default function HotelBookingSingleDetail() {
  const route = useRoute<HotelBookingDetailsRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { isAuthenticated } = useAuth();
  console.log('Route params:', route.params);
  const propertyId = route.params?.hotelId;

  type HotelData = {
    success?: boolean;
    status?: number;
    hotelName?: string;
    description?: string;
    cuisines?: { food: string }[];
    rating?: number;
    latitude?: number;
    longitude?: number;
    amenities?: {
      category: string;
      items: { name: string; selected: boolean }[];
    }[];
    totalReviewRate?: number;
    review?: any[];
    propertyRules?: { rulesData: string }[];
    photos?: string[];
    videos?: string[];
  };

  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showRoomSelectModal, setshowRoomSelectModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [editSearchModalVisible, setEditSearchModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState(route.params?.searchParams || {});
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAllRulesModal, setShowAllRulesModal] = useState(false);

  // Checkout modal state
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Fetch hotel details
  const fetchHotelDetails = async () => {
    if (!propertyId) {
      setError('No property ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      console.log('Fetching hotel details for propertyId:', propertyId);

      const params: PropertyDetailsParams = {
        propertyId: propertyId,
      };

      const data = await fetchPropertyDetails(params);

      if (data.success) {
        // The API response contains the hotel data directly
        setHotelData(data);
        console.log('Hotel details fetched successfully:', data);
        console.log('Photos array:', (data as any).photos);
        console.log('Photos length:', (data as any).photos?.length);
      } else {
        setError(data.message || 'Failed to fetch hotel details');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Error fetching hotel details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchHotelDetails();
    }
  }, [propertyId]);

  // Add retry functionality
  const handleRetry = () => {
    if (propertyId) {
      fetchHotelDetails();
    }
  };

  // Loading state
  if (loading) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0E54EC" />
          <Text className="mt-4 font-poppins text-gray-600">Loading hotel details...</Text>
        </View>
        <BottomMenu />
      </View>
    );
  }

  // Error state
  if (error || !hotelData) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="mb-4 text-center font-poppins text-lg text-red-600">
            {error || 'Failed to load hotel details'}
          </Text>
          <Pressable className="rounded-full bg-[#0E54EC] px-6 py-3" onPress={handleRetry}>
            <Text className="font-poppins font-semibold text-white">Retry</Text>
          </Pressable>
        </View>
        <BottomMenu />
      </View>
    );
  }

  const {
    hotelName,
    rating,
    description,
    amenities,
    review,
    propertyRules,
    photos,
    totalReviewRate,
  } = hotelData;

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />

      <FlatList
        className="mb-32 flex-1 bg-white"
        data={[{}]}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={() => (
          <>
            <View className="relative flex-row items-center justify-between">
              <BackIcon
                width={36}
                height={36}
                style={{
                  position: 'absolute',
                  left: 12,
                  top: 12,
                  zIndex: 2,
                }}
              />
              <View className="absolute right-4 top-4 z-50 rounded-full bg-white p-2">
                <HeartIcon width={20} height={20} />
              </View>

              {/* Image Carousel */}
              <View className="h-64 w-full">
                {(() => {
                  console.log('Rendering carousel - photos:', photos, 'length:', photos?.length);
                  return null;
                })()}

                {photos && photos.length > 0 ? (
                  <>
                    <FlatList
                      data={photos}
                      horizontal
                      pagingEnabled
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(item, index) => index.toString()}
                      onMomentumScrollEnd={(event) => {
                        const index = Math.round(
                          event.nativeEvent.contentOffset.x /
                            event.nativeEvent.layoutMeasurement.width
                        );
                        setCurrentImageIndex(index);
                      }}
                      renderItem={({ item, index }) => {
                        console.log('Rendering image:', index, item);
                        return (
                          <View style={{ width: Dimensions.get('window').width, height: 256 }}>
                            <Image
                              source={{ uri: item }}
                              style={{ width: '100%', height: '100%' }}
                              resizeMode="cover"
                              onError={() => console.log('Image failed to load:', index)}
                              onLoad={() => console.log('Image loaded:', index)}
                            />
                          </View>
                        );
                      }}
                    />

                    {/* Pagination Dots */}
                    {photos.length > 1 && (
                      <View className="absolute bottom-4 left-0 right-0 flex-row justify-center">
                        {photos.map((_, index) => (
                          <View
                            key={index}
                            className={`mx-1 h-2 w-2 rounded-full ${
                              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </View>
                    )}

                    {/* Image counter overlay */}
                    <View className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1">
                      <Text className="text-xs font-semibold text-white">
                        {currentImageIndex + 1} / {photos.length}
                      </Text>
                    </View>
                  </>
                ) : (
                  <Image
                    source={{
                      uri: 'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
                    }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                )}
              </View>
            </View>

            {/* Rating, Name, Reviews, Location */}
            <View className="w-full px-4 py-3">
              <View className="w-full flex-row items-center justify-between">
                <View className="w-[75%] flex-col items-start">
                  <View className="my-2 mb-1 mr-2 flex-row items-center rounded-full border border-[#D2D3D8] px-3 py-1 font-poppins text-xs">
                    <Text className="font-poppins text-sm font-semibold text-gray-700">
                      {rating || 0}
                    </Text>
                    <StarIcon width={12} height={12} className="mx-1" />
                    <Text className="ml-1 font-poppins text-xs text-gray-500">Hotel</Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <Text className="font-poppins text-lg font-semibold">
                      {hotelName || 'Hotel Name'}
                    </Text>
                  </View>
                </View>
                <View className="mb-2 flex-col items-center justify-between">
                  <View className="w-[80px] rounded-t-xl bg-[#199855] py-2">
                    <Text className="text-center font-poppins text-xs font-semibold text-white">
                      {(rating ?? 0) >= 4 ? 'Excellent' : (rating ?? 0) >= 3 ? 'Very Good' : 'Good'}
                    </Text>
                  </View>
                  <View className="w-[80px] flex-row items-center justify-center gap-3 rounded-b-xl border border-[#0000001A] py-2">
                    <View className="flex-row items-center">
                      <HeartIcon width={16} height={16} className="" />
                      <Text className="ml-1 font-poppins text-xs font-semibold text-gray-700">
                        {rating || 0}
                      </Text>
                    </View>
                    <Text className="text-center font-poppins text-xs font-semibold text-black">
                      {totalReviewRate || 0}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="mb-2 flex-row items-center">
                <LocationIcon width={16} height={16} className="mr-1" />
                <Text className="font-poppins text-sm text-gray-600">Location</Text>
              </View>
            </View>

            {/* Dates, Rooms, Adults, Edit */}
            <View className="mx-4 mb-3 flex-row items-center justify-between overflow-hidden rounded-xl border border-[#00000024]">
              <View className="p-4">
                <Text className="font-poppins text-gray-700">
                  {searchParams?.todate && searchParams?.enddate
                    ? `${searchParams.todate} - ${searchParams.enddate}`
                    : 'Select dates'}
                </Text>
                <Text className="font-poppins text-xs text-gray-500">
                  {searchParams?.staynight ? `${searchParams.staynight} night(s)` : 'Select stay'}
                </Text>
              </View>
              <Text className="font-poppins text-xs text-gray-500">
                {searchParams?.rooms || '1'} Room · {searchParams?.adult || '1'} Adult
                {searchParams?.child && Number(searchParams.child) > 0
                  ? `, ${searchParams.child} Child`
                  : ''}
              </Text>
              <Pressable
                className="rounded-r-xl bg-[#0E54EC] px-4 py-4"
                onPress={() => setEditSearchModalVisible(true)}>
                <PencilIcon width={24} color="#2563eb" />
              </Pressable>
            </View>

            {/* Description */}
            <View className="mb-3 px-4">
              <Text className="font-poppins text-base text-gray-700">
                {description || 'No description available for this property.'}
              </Text>
            </View>

            {/* Common Facilities */}
            <View className="my-4 px-4">
              <Text className="mb-2 text-xl font-poppins font-semibold">Amenities</Text>
              <View className="mb-4 flex-row items-end justify-between">
                {/* 6 main amenities, 3 left, 3 right */}
                <View className="flex-1 flex-row">
                  {/* Left column */}
                  <View className="flex-1">
                    {amenities?.[0]?.items?.slice(0, 3).map((item, idx) => (
                      <View key={idx} className="flex-row items-center mb-3">
                        <TickIcon width={18} height={18} color="#22C55E" />
                        <Text className="ml-2 font-poppins text-sm font-semibold text-gray-700">
                          {item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                  {/* Right column */}
                  <View className="flex-1">
                    {amenities?.[0]?.items?.slice(3, 6).map((item, idx) => (
                      <View key={idx} className="flex-row items-center mb-3">
                        <TickIcon width={18} height={18} color="#22C55E" />
                        <Text className="ml-2 font-poppins text-sm font-semibold text-gray-700">
                          {item.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
              {/* View all amenities link */}
              {amenities?.[0]?.items && amenities[0].items.length > 6 && (
                <Pressable
                  className="mt-2 self-start"
                  onPress={() => setShowFacilities(true)}
                  hitSlop={10}
                >
                  <Text className="font-poppins text-sm font-semibold text-[#0E54EC] underline">
                    View all amenities
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Facilities Modal */}
            <Modal visible={showFacilities} animationType="slide">
              <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
              <View className="w-full flex-1 bg-white">
                <View className="relative w-full flex-row items-center border-b border-gray-200 px-4 py-3">
                  <Pressable
                    onPress={() => setShowFacilities(false)}
                    className="absolute left-4 z-10">
                    <BackIconModal width={24} color="#2563eb" />
                  </Pressable>
                  <View className="flex-1 items-center py-3">
                    <Text className="text-center text-lg font-semibold">All Facilities</Text>
                  </View>
                </View>
                <ScrollView className="flex-1 p-4">
                  <View className="flex-row flex-wrap gap-4">
                    {amenities?.[0]?.items?.map((item, index) => (
                      <View key={index} className="w-full flex-row items-center py-3">
                        <Text className="font-poppins text-gray-700">{item.name}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </Modal>

            {/* Price & Booking Section */}
            {isAuthenticated ? (
              <>
                {/* Logged in - Show room selection and checkout */}
                <View className="flex-row items-center justify-between px-4 py-3">
                  <View className="flex-col items-start">
                    {selectedRoom ? (
                      <>
                        <Text className="text-3xl font-bold text-[#00AEEF]">
                          ₹{selectedRoom.pricing?.pricePerNight?.toLocaleString() || '0'}
                        </Text>
                        <Text className="text-md font-normal text-gray-500">Per night</Text>
                        <Text className="text-sm text-gray-600">{selectedRoom.room_name}</Text>
                      </>
                    ) : (
                      <>
                        <Text className="text-3xl font-bold text-[#00AEEF]">₹0</Text>
                        <Text className="text-md font-normal text-gray-500">Per night</Text>
                      </>
                    )}
                  </View>
                  <Pressable
                    className="rounded-full bg-blue-600 px-5 py-3"
                    onPress={() => setshowRoomSelectModal(true)}>
                    <Text className="text-lg font-semibold text-white">
                      {selectedRoom ? 'Change Room' : 'Select Room'}
                    </Text>
                  </Pressable>
                </View>

                <RoomSelectionModal
                  visible={showRoomSelectModal}
                  onClose={() => setshowRoomSelectModal(false)}
                  propertyId={propertyId || ''}
                  searchParams={searchParams}
                  onRoomSelect={(room) => {
                    setSelectedRoom(room);
                    setshowRoomSelectModal(false);
                  }}
                />

                {/* Checkout Button */}
                <View className="px-4 mb-4">
                  <Pressable
                    className={`w-full rounded-full py-4 ${selectedRoom ? 'bg-[#0E54EC]' : 'bg-gray-300'}`}
                    onPress={() => {
                      if (selectedRoom) setShowCheckoutModal(true);
                    }}
                    disabled={!selectedRoom}
                  >
                    <Text className="text-center font-poppins text-lg font-semibold text-white">
                      Proceed to Checkout
                    </Text>
                  </Pressable>
                </View>
              </>
            ) : (
              <>
                {/* Not logged in - Show login prompt */}
                <View className="mx-4 mb-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
                  <View className="mb-4 items-center">
                    <Text className="mb-2 text-center font-poppins text-lg font-semibold text-gray-800">
                      Login Required
                    </Text>
                    <Text className="text-center font-poppins text-sm text-gray-600">
                      Please login to select rooms and proceed with your booking
                    </Text>
                  </View>
                  <Pressable
                    className="w-full rounded-full bg-[#0E54EC] py-4"
                    onPress={() => navigation.navigate('Auth', { screen: 'Login' })}
                  >
                    <Text className="text-center font-poppins text-lg font-semibold text-white">
                      Login to Book
                    </Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* Checkout Modal */}
            <Modal
              visible={showCheckoutModal}
              animationType="slide"
              transparent={false}
              onRequestClose={() => setShowCheckoutModal(false)}
              statusBarTranslucent
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: '#fff',
                }}
              >
                {/* Header */}
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: 48,
                    paddingBottom: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F1F1F1',
                    backgroundColor: '#fff',
                    elevation: 2,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'Poppins-Bold',
                      fontSize: 20,
                      color: '#222',
                      fontWeight: 'bold',
                    }}
                  >
                    Checkout
                  </Text>
                  <Pressable
                    onPress={() => setShowCheckoutModal(false)}
                    style={{
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      backgroundColor: '#F3F6FA',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: 16,
                        color: '#0E54EC',
                        fontWeight: '600',
                      }}
                    >
                      Close
                    </Text>
                  </Pressable>
                </View>
                {/* Content */}
                <View style={{ flex: 1 }}>
                  <HotelBookingCheckout
                    bookingData={searchParams}
                    hotelData={hotelData}
                    roomData={selectedRoom}
                    onClose={() => setShowCheckoutModal(false)}
                  />
                </View>
              </View>
            </Modal>

            {/* Reviews */}
            <View className="mb-3 px-4">
              <View className="mb-2 flex-row items-center justify-between">
                <Text className="text-lg font-bold">Reviews</Text>
                <Pressable onPress={() => {}}>
                  <Text className="font-semibold text-blue-600">View All</Text>
                </Pressable>
              </View>
              {review && review.length > 0 ? (
                review.slice(0, 2).map((r, i) => (
                  <View key={i} className="mb-2">
                    <Text className="font-semibold">{r.user || 'Anonymous'}</Text>
                    <Text className="text-gray-600">{r.comment}</Text>
                    <Text className="text-yellow-500">★ {r.rating}</Text>
                  </View>
                ))
              ) : (
                <Text className="text-gray-500">No reviews available</Text>
              )}
            </View>

            {/* Property Rules */}
            {/* Property Rules (show only 4, each with info icon, and "View All Rules" button opens modal) */}
            <View className="mb-3 mt-4 px-4">
              <Text className="mb-2 font-poppins text-xl font-bold">Property Rules</Text>
              {(propertyRules?.slice(0, 4) || []).map((rule, i) => (
                <View key={i} className="mb-2 flex-row items-center">
                  {/* Info Icon */}
                  <View className="mt-0.5 mr-2">
                    <Text>
                      {/* Unicode info icon, or replace with an SVG if you have one */}
                      <Text style={{ color: '#2563eb', fontSize: 18 }}>ℹ️</Text>
                    </Text>
                  </View>
                  <Text className="flex-1 font-poppins text-gray-700">{rule.rulesData}</Text>
                </View>
              ))}
              {propertyRules && propertyRules.length > 4 && (
                <Pressable
                  className="flex items-center rounded-full bg-[#0E54EC] py-3 mt-2"
                  onPress={() => setShowAllRulesModal(true)}>
                  <Text className="font-poppins font-semibold text-white">View All Rules</Text>
                </Pressable>
              )}
            </View>

            {/* Modal for all property rules */}
            <Modal
              visible={!!showAllRulesModal}
              animationType="slide"
              transparent
              onRequestClose={() => setShowAllRulesModal(false)}
            >
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: 'white', borderRadius: 16, width: '90%', maxHeight: '80%', padding: 20 }}>
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="font-poppins text-xl font-bold">All Property Rules</Text>
                    <Pressable onPress={() => setShowAllRulesModal(false)}>
                      <Text className="font-poppins text-base font-semibold text-blue-600">Close</Text>
                    </Pressable>
                  </View>
                  <ScrollView>
                    {(propertyRules || []).map((rule, i) => (
                      <View key={i} className="mb-3 flex-row items-center">
                        <View className="mr-2">
                          <Text>
                            <Text style={{ color: '#2563eb', fontSize: 18 }}>ℹ️</Text>
                          </Text>
                        </View>
                        <Text className="flex-1 font-poppins text-gray-700">{rule.rulesData}</Text>
                      </View>
                    ))}
                  </ScrollView>
                  <Pressable
                    className="mt-4 items-center"
                    onPress={() => setShowAllRulesModal(false)}
                  >
                    <Text className="font-poppins font-semibold text-blue-600">Close</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>

            {/* Location & Map */}
            <View className="my-6 px-4">
              <View className="mb-1 flex-row items-center justify-between">
                <Text className="mr-2 font-poppins font-semibold text-blue-600">Location</Text>
                <Pressable className="mb-2 flex-row items-center" onPress={() => {}}>
                  <Text className="mr-2 font-poppins font-semibold text-[#00AEEF]">View Map</Text>
                </Pressable>
              </View>
              <View className="mb-2 flex-col items-center justify-between rounded-xl border border-[#F3F3F3] p-2">
                <Image
                  source={{ uri: 'https://staticmapmaker.com/img/google-placeholder.png' }}
                  className="h-40 w-full rounded-lg"
                  resizeMode="cover"
                />
                <Text className="w-full py-1 text-start font-poppins text-sm text-gray-600">
                  Hotel Location
                </Text>
              </View>
            </View>

          </>
        )}
        showsVerticalScrollIndicator={false}
      />
      <BottomMenu />

      {/* Edit Search Modal */}
      <Modal
        visible={editSearchModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditSearchModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <TouchableOpacity onPress={() => setEditSearchModalVisible(false)}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="font-poppins text-lg font-semibold">Edit Search</Text>
            <TouchableOpacity onPress={() => setEditSearchModalVisible(false)}>
              <Text className="font-poppins text-base font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>
          <EditSearchModal
            data={searchParams}
            onSave={async (newParams) => {
              setSearchParams(newParams);
              setEditSearchModalVisible(false);
            }}
            onClose={() => setEditSearchModalVisible(false)}
          />
        </View>
      </Modal>
    </View>
  );
}
