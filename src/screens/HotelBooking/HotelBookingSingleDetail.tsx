import React, { useState, useEffect } from 'react';
import { View, Text, Image, Pressable, ScrollView, Modal, ActivityIndicator } from 'react-native';
import ArrowRightIcon from '~/assets/icons/rightIcon.svg';
import PencilIcon from '~/assets/icons/EditIcon.svg';
import BottomMenu from '~/components/common/BottomMenu';
import BackIcon from '~/assets/icons/ArrowLeft.svg';
import HeartIcon from '~/assets/icons/BlueHeart.svg';
import CameraIcon from '~/assets/icons/CameraIcon.svg';
import StarIcon from '~/assets/icons/star.svg';
import LocationIcon from '~/assets/icons/location-pin.svg';
import BackIconModal from '~/assets/icons/hotelBooking/BackIcon.svg';
import TickIcon from '~/assets/icons/Tick.svg';
import WineglassIcon from '~/assets/icons/hotelBooking/Wineglass.svg';
import RecommendationHotels from '~/components/HotelBooking/HotelBookingHome/RecommendationHotels';
import { API_URL } from '~/utils/api';
import { FlatList } from 'react-native';
import RoomsDetail from './RoomsDetail';

export default function HotelBookingSingleDetail() {
  // const { propertyId } = route.params;
  const propertyId = '6a4c110b-e3bd-4e53-895b-2d185153db10';
  type RoomAmenity = {
    name: string;
    iconRes?: string;
  };

  type RoomPhoto = {
    tag?: string;
    url: string;
  };

  type RoomVideo = {
    tag?: string;
    url: string;
  };

  type Room = {
    id?: string;
    propertyId?: string;
    room_type?: string;
    view?: string;
    area?: string;
    room_name?: string;
    number_of_rooms?: number;
    description?: string;
    max_people?: number;
    sleeping_arrangement?: string;
    bathroom_details?: string;
    original_price?: number;
    discounted_price?: number;
    max_adults?: number;
    max_children?: number;
    discount?: string;
    free_cancellation?: string;
    additional_info?: string;
    free_breakfast?: string;
    meal_plans?: string[];
    inventory_details?: string;
    room_amenities?: { value: boolean; roomAmenityId: string }[];
    photos?: RoomPhoto[];
    videos?: RoomVideo[];
    createdAt?: string;
    updatedAt?: string;
    roomAmenities?: RoomAmenity[];
  };

  type HotelData = {
    hotelName?: string;
    rating?: number;
    latitude?: number;
    longitude?: number;
    price?: { amount?: number; currency?: string; perNight?: boolean };
    description?: string;
    commonFacilities?: { iconRes?: string; name?: string }[];
    totalReviewRate?: number;
    review?: { user?: string; comment?: string; rating?: number }[];
    propertyRules?: { rulesData: string }[];
    rooms?: Room[];
  };

  const [hotelData, setHotelData] = useState<HotelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFacilities, setShowFacilities] = useState(false);
  const [showRoomSelectModal, setshowRoomSelectModal] = useState(false);

  // Fetch hotel details
  const fetchHotelDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/properties/p/property-details`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          propertyId: propertyId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setHotelData(data);
      } else {
        setError('Failed to fetch hotel details');
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
          <Pressable className="rounded-full bg-[#0E54EC] px-6 py-3" onPress={fetchHotelDetails}>
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
    price,
    description,
    commonFacilities,
    review,
    propertyRules,
    rooms,
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
              <Image
                source={{
                  uri:
                    rooms?.[0]?.photos?.[0]?.url ||
                    'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
                }}
                className="h-64 w-full"
                resizeMode="cover"
              />
              <View className="absolute bottom-0 w-full flex-row items-center justify-center gap-2 py-2">
                <View className="flex-row items-center justify-center rounded-full bg-[#00000091] p-1 px-3">
                  <CameraIcon width={10} height={10} color="#ffffff" />
                  <Text className="ml-1 text-sm font-semibold text-white">
                    Hotel Photos {rooms?.[0]?.photos?.length || 0}
                  </Text>
                </View>
                <View className="flex-row items-center justify-center rounded-full bg-[#00000091] p-1 px-3">
                  <CameraIcon width={10} height={10} color="#ffffff" />
                  <Text className="ml-1 text-sm font-semibold text-white">Guest Photos 0</Text>
                </View>
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
                  <View className="flex-row items-center space-x-2">
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
                <Text className="font-poppins text-gray-700">12 Jun - 14 Jun</Text>
                <Text className="font-poppins text-xs text-gray-500">Sun · Tue</Text>
              </View>
              <Text className="font-poppins text-xs text-gray-500">2 Rooms · 4 Adults</Text>
              <Pressable className="rounded-r-xl bg-[#0E54EC] px-4 py-4" onPress={() => {}}>
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
              <Text className="mb-2 text-xl font-bold">Common Facilities</Text>
              <View className="mb-4 flex-row items-end justify-between">
                <View className="mt-4 flex-row flex-wrap gap-3">
                  {commonFacilities?.slice(0, 4).map((facility, index) => {
                    const bgColors = ['#FFBC99', '#CABDFF', '#B1E5FC', '#FFE4E1'];
                    const bgColor = bgColors[index % bgColors.length];
                    return (
                      <View
                        key={index}
                        className="mr-1 h-[60px] w-[60px] flex-row items-center justify-center rounded-full p-4"
                        style={{ backgroundColor: bgColor }}>
                        {facility.iconRes ? (
                          <Image
                            source={{ uri: facility.iconRes }}
                            className="h-7 w-7"
                            resizeMode="contain"
                          />
                        ) : (
                          <WineglassIcon width={28} height={28} />
                        )}
                      </View>
                    );
                  })}
                </View>
                {commonFacilities && commonFacilities?.length > 1 && (
                  <Pressable
                    className="mx-4 h-[60px] w-[60px] flex-row items-center justify-center rounded-full border border-[#ECECEC] p-4"
                    onPress={() => setShowFacilities(true)}>
                    <ArrowRightIcon width={36} color="#2563eb" />
                  </Pressable>
                )}
              </View>
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
                    {commonFacilities?.map((facility, index) => (
                      <View key={index} className="w-full flex-row items-center py-3">
                        {facility.iconRes ? (
                          <Image
                            source={{ uri: facility.iconRes }}
                            className="mr-3 h-6 w-6"
                            resizeMode="contain"
                          />
                        ) : (
                          <WineglassIcon width={24} height={24} className="mr-3" />
                        )}
                        <Text className="font-poppins text-gray-700">{facility.name}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </View>
            </Modal>

            {/* Price & Select Room */}
            <View className="flex-row items-center justify-between px-4 py-3">
              <View className="flex-col items-start">
                <Text className="text-3xl font-bold text-[#00AEEF]">₹{price?.amount || 0}</Text>
                <Text className="text-md font-normal text-gray-500">
                  {price?.perNight ? 'Per night' : 'Total'}
                </Text>
              </View>
              <Pressable className="rounded-full bg-blue-600 px-5 py-3" onPress={() => setshowRoomSelectModal(true)}>
                <Text className="text-lg font-semibold text-white">Select Room</Text>
              </Pressable>
            </View>

            <Modal visible={showRoomSelectModal} animationType="slide">
              <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
              <View className="w-full flex-1 bg-white">
                <View className="relative w-full flex-row items-center border-b border-gray-200 px-4 py-3">
                  <Pressable
                    onPress={() => setshowRoomSelectModal(false)}
                    className="absolute left-4 z-10">
                    <BackIconModal width={24} color="#2563eb" />
                  </Pressable>
                  <View className="flex-1 items-center py-3">
                    <Text className="text-center text-lg font-semibold">Select Rooms</Text>
                  </View>
                </View>
                <ScrollView className="flex-1 p-4">
                  <View className="flex-row flex-wrap gap-4">
                    {rooms?.map((room, index) => (
                     <RoomsDetail key={index} room={room}/>
                    ))}
                  </View>
                </ScrollView>
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

            <RecommendationHotels />

            {/* Property Rules */}
            <View className="mb-3 mt-4 px-4">
              <Text className="mb-2 font-poppins text-xl font-bold">Property Rules</Text>
              {propertyRules?.map((rule, i) => (
                <View key={i} className="mb-2 flex-row items-start">
                  <TickIcon width={20} height={20} color="#2563eb" className="mt-1" />
                  <Text className="ml-2 flex-1 font-poppins text-gray-700">{rule.rulesData}</Text>
                </View>
              ))}
              <Pressable
                className="flex items-center rounded-full bg-[#0E54EC] py-3"
                onPress={() => {}}>
                <Text className="font-poppins font-semibold text-white">View All Rules</Text>
              </Pressable>
            </View>
          </>
        )}
        showsVerticalScrollIndicator={false}
      />
      <BottomMenu />
    </View>
  );
}
