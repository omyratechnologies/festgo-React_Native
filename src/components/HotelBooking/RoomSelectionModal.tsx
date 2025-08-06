import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native';
import { API_URL, fetchUpdatedRooms, Room, RoomSearchParams } from '~/utils/api';
import BackIconModal from '~/assets/icons/hotelBooking/BackIcon.svg';
import StarIcon from '~/assets/icons/star.svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface RoomSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  propertyId: string;
  searchParams: {
    todate?: string;
    enddate?: string;
    adult?: string;
    child?: string;
    rooms?: string;
    staynight?: string;
    location?: string;
  };
  onRoomSelect: (room: Room) => void;
}

const RoomSelectionModal: React.FC<RoomSelectionModalProps> = ({
  visible,
  onClose,
  propertyId,
  searchParams,
  onRoomSelect,
}) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const fetchRooms = async () => {
    if (!propertyId || !searchParams.todate || !searchParams.enddate) {
      setError('Missing required parameters');
      return;
    }

    // Helper to convert date to yyyy-mm-dd
    const formatDate = (dateStr: string) => {
      // Accepts dd-mm-yyyy or yyyy-mm-dd, returns yyyy-mm-dd
      if (!dateStr) return '';
      // If already yyyy-mm-dd, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
      // If dd-mm-yyyy, convert
      const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(dateStr);
      if (match) {
        const [, dd, mm, yyyy] = match;
        return `${yyyy}-${mm}-${dd}`;
      }
      // fallback: try to parse with Date
      const d = new Date(dateStr);
      if (!isNaN(d.getTime())) {
        return d.toISOString().slice(0, 10);
      }
      return dateStr;
    };

    try {
      setLoading(true);
      setError(null);

      const params: RoomSearchParams = {
        propertyId,
        adults: searchParams.adult || '1',
        children: searchParams.child || '0',
        requestedRooms: searchParams.rooms || '1',
        startDate: formatDate(searchParams.todate),
        endDate: formatDate(searchParams.enddate),
      };

      const jwtToken = await AsyncStorage.getItem('jwtToken');
      if (!jwtToken) {
        throw new Error('JWT token not found');
      }
      console.log(JSON.stringify(params));
      const response = await fetch(`${API_URL}/properties/getupdated-room/p`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(params),
      });
      console.log(response);
      const data = await response.json();
      console.log(data);
      setRooms(data.rooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible && propertyId) {
      fetchRooms();
    }
  }, [visible, propertyId, searchParams]);

  const handleRoomSelect = (room: Room) => {
    setSelectedRoomId(room.id);
    onRoomSelect(room);
  };

  const renderRoomAmenities = (amenities: any[]) => {
    const allAmenities = amenities.flatMap(category => 
      category.items.filter((item: any) => item.selected)
    );

    return (
      <View className="flex-row flex-wrap">
        {allAmenities.slice(0, 4).map((amenity: any, index: number) => (
          <View
            key={index}
            className="mr-2 mb-1 rounded-full bg-blue-50 px-2 py-1"
          >
            <Text className="text-xs text-blue-600">{amenity.name}</Text>
          </View>
        ))}
        {allAmenities.length > 4 && (
          <View className="mr-2 mb-1 rounded-full bg-gray-50 px-2 py-1">
            <Text className="text-xs text-gray-600">+{allAmenities.length - 4} more</Text>
          </View>
        )}
      </View>
    );
  };

  const renderRoomCard = (room: Room) => {
    const isSelected = selectedRoomId === room.id;
    
    return (
      <TouchableOpacity
        key={room.id}
        className={`mb-4 rounded-xl border-2 p-4 ${
          isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'
        }`}
        onPress={() => handleRoomSelect(room)}
      >
        {/* Room Photos */}
        {room.photos && room.photos.length > 0 && (
          <View className="mb-3 h-40 w-full overflow-hidden rounded-lg">
            <Image
              source={{ uri: room.photos[0] }}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
        )}

        {/* Room Header */}
        <View className="mb-3">
          <Text className="font-poppins text-lg font-bold text-gray-900">
            {room.room_name}
          </Text>
          <Text className="font-poppins text-sm text-gray-600">
            {room.room_type} • {room.area}
          </Text>
        </View>

        {/* Description */}
        <Text className="mb-3 font-poppins text-sm text-gray-700" numberOfLines={2}>
          {room.description}
        </Text>

        {/* Sleeping Arrangement */}
        <View className="mb-3">
          <Text className="font-poppins text-sm font-semibold text-gray-800 mb-1">
            Sleeping Arrangement
          </Text>
          <View className="flex-row flex-wrap">
            {room.sleeping_arrangement.beds.map((bed, index) => (
              <View key={index} className="mr-2 mb-1 flex-row items-center rounded-full bg-gray-100 px-2 py-1">
                <Text className="mr-1">{bed.icon}</Text>
                <Text className="font-poppins text-xs text-gray-700">
                  {bed.quantity} {bed.bedType}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Amenities */}
        <View className="mb-3">
          <Text className="font-poppins text-sm font-semibold text-gray-800 mb-1">
            Room Features
          </Text>
          {renderRoomAmenities(room.amenities)}
        </View>

        {/* Pricing */}
        <View className="mb-3 flex-row items-center justify-between">
          <View>
            <Text className="font-poppins text-sm text-gray-500 line-through">
              ₹{room.pricing.originalPrice?.toLocaleString()}
            </Text>
            <Text className="font-poppins text-xl font-bold text-blue-600">
              ₹{room.pricing.pricePerNight?.toLocaleString()}
            </Text>
            <Text className="font-poppins text-xs text-gray-500">per night</Text>
          </View>
          <View className="items-end">
            <Text className="font-poppins text-sm text-gray-600">
              {room.availableRooms} rooms available
            </Text>
            <Text className="font-poppins text-xs text-green-600">
              {room.free_cancellation === 'Yes' ? 'Free Cancellation' : 'Cancellation Policy'}
            </Text>
          </View>
        </View>

        {/* Meal Plan */}
        {room.meal_plan && (
          <View className="mb-3">
            <View className="flex-row items-center">
              <Ionicons name="restaurant" size={16} color="#02AFFF" />
              <Text className="ml-1 font-poppins text-sm text-blue-600">
                {room.meal_plan === 'free_breakfast' ? 'Free Breakfast' : 
                 room.meal_plan === 'breakfast_only' ? 'Breakfast Only' : 
                 room.meal_plan}
              </Text>
            </View>
          </View>
        )}

        {/* Select Button */}
        <TouchableOpacity
          className={`rounded-lg py-2 px-4 ${
            isSelected ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onPress={() => handleRoomSelect(room)}
        >
          <Text className={`text-center font-poppins font-semibold ${
            isSelected ? 'text-white' : 'text-gray-700'
          }`}>
            {isSelected ? 'Selected' : 'Select Room'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3 pt-12">
          <TouchableOpacity onPress={onClose}>
            <BackIconModal width={24} height={24} />
          </TouchableOpacity>
          <Text className="font-poppins text-lg font-semibold">Select Room</Text>
          <View className="w-6" />
        </View>

        {/* Content */}
        <ScrollView className="flex-1 px-4">
          {loading ? (
            <View className="flex-1 items-center justify-center py-20">
              <ActivityIndicator size="large" color="#02AFFF" />
              <Text className="mt-4 font-poppins text-gray-600">Loading rooms...</Text>
            </View>
          ) : error ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="font-poppins text-red-600 text-center">{error}</Text>
              <TouchableOpacity
                className="mt-4 rounded-lg bg-blue-600 px-4 py-2"
                onPress={fetchRooms}
              >
                <Text className="font-poppins font-semibold text-white">Retry</Text>
              </TouchableOpacity>
            </View>
          ) : rooms &&  rooms.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="font-poppins text-gray-600 text-center">
                No rooms available for the selected dates
              </Text>
            </View>
          ) : (
            <View className="py-4">
              <Text className="mb-4 font-poppins text-lg font-semibold text-gray-800">
                {rooms && rooms.length} room{ rooms && rooms.length !== 1 ? 's' : ''} available
              </Text>
              {rooms && rooms.map(renderRoomCard)}
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default RoomSelectionModal; 