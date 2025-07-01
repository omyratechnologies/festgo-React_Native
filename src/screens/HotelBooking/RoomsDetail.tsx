import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
  room_amenities?: { value: boolean; roomAmenityId: string; name?: string; icon?: string }[];
  photos?: any[];
  videos?: any[];
  createdAt?: string;
  updatedAt?: string;
  roomAmenities?: any[];
};

type RoomsDetailProps = {
  room: Room;
};

const { width } = Dimensions.get('window');

const RoomsDetail: React.FC<RoomsDetailProps> = ({ room }) => {
  const navigation = useNavigation();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Carousel auto-scroll
  React.useEffect(() => {
    if (!room.photos || room.photos.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev + 1 >= room.photos!.length ? 0 : prev + 1;
        flatListRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [room.photos]);

  const handleSelectRoom = () => {
    if (room.id && room.propertyId) {
      setSelectedRoomId(room.id);
      // navigation.navigate('Confirm', { propertyId: room.propertyId, roomId: room.id });
    }
  };

  // Room amenities mapping
  const amenities = room.room_amenities || room.roomAmenities || [];

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 items-center bg-white overflow-hidden rounded-xl p-5">
        {/* Carousel */}
        {room.photos && room.photos.length > 0 && (
          <View style={{ width: '100%', height: 210, marginBottom: 20, overflow: 'hidden' }}>
            <FlatList
              ref={flatListRef}
              data={room.photos}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => idx.toString()}
              renderItem={({ item }) => (
                <Image
                  source={{ uri: item.url || item }}
                  style={{ width: width - 40, height: 210, borderRadius: 16 }}
                  resizeMode="cover"
                />
              )}
              onMomentumScrollEnd={(e) => {
                const idx = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                setActiveIndex(idx);
              }}
            />
            {/* Dots */}
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
              {room.photos.map((_, idx) => (
                <View
                  key={idx}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: activeIndex === idx ? '#02AFFF' : '#E0E0E0',
                    marginHorizontal: 3,
                  }}
                />
              ))}
            </View>
          </View>
        )}

        {/* Title, Area, Price */}
        <View className="mb-2 w-full flex-row items-start justify-between">
          <View style={{ flex: 1 }}>
            <Text className="font-poppins text-2xl font-bold text-gray-900" numberOfLines={1}>
              {room.room_name}
            </Text>
            <Text className="mt-0.5 font-poppins text-base text-gray-500" numberOfLines={1}>
              {room.room_type} • {room.area}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end', minWidth: 110 }}>
            <Text className="font-poppins text-base text-gray-400 line-through">
              ₹{room.original_price?.toLocaleString() || '-'}
            </Text>
            <Text className="font-poppins text-xl font-bold text-[#02AFFF]">
              ₹{room.discounted_price?.toLocaleString() || '-'}
            </Text>
            {room.discount && (
              <Text className="font-poppins text-base font-bold text-green-600">
                {room.discount} OFF
              </Text>
            )}
          </View>
        </View>

        {/* Description */}
        <Text className="mb-4 w-full font-poppins text-base text-gray-700">{room.description}</Text>
        <View className="w-full flex-row items-center">
          {room.free_breakfast && (
            <Text className="mr-2 rounded-full border border-[#00AEEF1A] bg-[#00AEEF1A] px-3 font-poppins text-sm font-semibold text-gray-600">
              Free Breakfast
            </Text>
          )}
          {room.free_cancellation && (
            <Text className="rounded-full border border-[#00AEEF1A] bg-[#00AEEF1A] px-3 font-poppins text-sm font-semibold text-gray-600">
              Free Cancellation
            </Text>
          )}
        </View>
        {/* Facilities */}
        <View className="mb-4 w-full">
          <Text className="mb-2 font-poppins text-lg font-bold text-gray-800">Room Facilities</Text>
          <View className="flex-row flex-wrap">
            {amenities.length > 0 ? (
              amenities.map((amenity, idx) =>
                amenity.value !== false ? (
                  <View
                    key={amenity.roomAmenityId || idx}
                    style={{
                      backgroundColor: '#F3FAFF',
                      borderRadius: 16,
                      paddingVertical: 6,
                      paddingHorizontal: 14,
                      marginRight: 8,
                      marginBottom: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    {/* If you have icons, render them here */}
                    {/* {amenity.icon && <Image source={{ uri: amenity.icon }} style={{ width: 18, height: 18, marginRight: 6 }} />} */}
                    <Text className="font-poppins text-base text-[#02AFFF]">
                      {amenity.name || amenity.roomAmenityId}
                    </Text>
                  </View>
                ) : null
              )
            ) : (
              <Text className="font-poppins text-gray-400">No facilities listed.</Text>
            )}
          </View>
        </View>

        {/* Details */}
        {/* <View className="mb-2 w-full flex-row justify-between">
          <Text className="font-poppins text-base font-semibold text-gray-600">View:</Text>
          <Text className="font-poppins text-base text-gray-800">{room.view || '-'}</Text>
        </View>
        <View className="mb-2 w-full flex-row justify-between">
          <Text className="font-poppins text-base font-semibold text-gray-600">Max People:</Text>
          <Text className="font-poppins text-base text-gray-800">{room.max_people}</Text>
        </View>
        <View className="mb-2 w-full flex-row justify-between">
          <Text className="font-poppins text-base font-semibold text-gray-600">Sleeping:</Text>
          <Text className="font-poppins text-base text-gray-800">
            {room.sleeping_arrangement || '-'}
          </Text>
        </View>
        <View className="mb-2 w-full flex-row justify-between">
          <Text className="font-poppins text-base font-semibold text-gray-600">Bathroom:</Text>
          <Text className="font-poppins text-base text-gray-800">
            {room.bathroom_details || '-'}
          </Text>
        </View> */}
        {/* Button */}
        <TouchableOpacity
          className="mt-4 w-full items-center rounded-full px-10 py-3 "
          style={{ backgroundColor: '#02AFFF' }}
          onPress={handleSelectRoom}
          activeOpacity={0.85}>
          <Text className="font-poppins text-lg font-bold text-white">Select Room</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default RoomsDetail;
