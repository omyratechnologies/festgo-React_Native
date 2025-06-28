import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingSearchCard from '~/components/HotelBooking/HotelBookingSearch/HotelBookingSearchCard';
import BackIcon from '~/assets/icons/hotelBooking/BackIcon.svg';
import EditIcon from '~/assets/icons/hotelBooking/EditIcon.svg';
import FilterIcon from '~/assets/icons/hotelBooking/Filter.svg';
import SortIcon from '~/assets/icons/hotelBooking/Sort.svg';
import PropertyTypeIcon from '~/assets/icons/hotelBooking/PropertyType.svg';
import FilterOptionsModal from './FilterOptionsModal';

const dummyHotels = [
  {
    hotelName: 'Grand Palace Hotel',
    image:
      'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
    location: 'Mumbai, India',
    price: 3500,
    discount: 20,
    pricePerNight: 2800,
    amenities: ['Free WiFi', 'Pool', 'Breakfast'],
    rooms: 2,
    numberOfReviews: 124,
    features: ['Pet Friendly', 'Airport Shuttle'],
    isFavorite: true,
  },
  {
    hotelName: 'Seaside Resort',
    image:
      'https://media.istockphoto.com/id/119926339/photo/resort-swimming-pool.jpg?s=612x612&w=0&k=20&c=9QtwJC2boq3GFHaeDsKytF4-CavYKQuy1jBD2IRfYKc=',
    location: 'Goa, India',
    price: 5000,
    discount: 10,
    pricePerNight: 4500,
    amenities: ['Beach Access', 'Spa', 'Bar'],
    rooms: 1,
    numberOfReviews: 89,
    features: ['Sea View', 'Free Parking'],
    isFavorite: false,
  },
  {
    hotelName: 'Mountain View Inn',
    image:
      'https://media.istockphoto.com/id/104731717/photo/luxury-resort.jpg?s=612x612&w=0&k=20&c=cODMSPbYyrn1FHake1xYz9M8r15iOfGz9Aosy9Db7mI=',
    location: 'Manali, India',
    price: 2500,
    pricePerNight: 2500,
    amenities: ['Mountain View', 'Heater'],
    rooms: 3,
    numberOfReviews: 56,
    features: ['Family Rooms'],
    isFavorite: false,
  },
];

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Price', value: 'price' },
];

const PROPERTY_TYPES = [
  { label: 'Hotels', value: 'hotels' },
  { label: 'Villas', value: 'villas' },
  { label: 'Resorts', value: 'resorts' },
  { label: 'Apartments', value: 'apartments' },
];

const HotelBookingSearch = () => {
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [propertyTypeModalVisible, setPropertyTypeModalVisible] = useState(false);
  const [editSearchModalVisible, setEditSearchModalVisible] = useState(false);

  const [selectedSort, setSelectedSort] = useState(SORT_OPTIONS[0].value);
  const [selectedPropertyType, setSelectedPropertyType] = useState(PROPERTY_TYPES[0].value);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.2;

  return (
    <View className="flex-1 bg-white ">
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>
      <View className="w-full flex-row items-center justify-between bg-white px-6 py-4">
        <View className="flex-row items-center">
          <BackIcon width={24} height={24} />
          <View className="ml-3">
            <Text className="font-poppins text-lg font-semibold text-black">Mumbai, India</Text>
            <Text className="mt-1 font-poppins text-xs text-black">
              12 Jun - 15 Jun · 2 Guests · 1 Room
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setEditSearchModalVisible(true)}>
          <EditIcon width={24} height={24} />
        </TouchableOpacity>
      </View>
      <View className="mb-2 mt-2 flex-row justify-center bg-white px-4">
        <TouchableOpacity
          className="mr-2 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2"
          onPress={() => setSortModalVisible(true)}>
          <SortIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Sort</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="mx-1 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2"
          onPress={() => setFilterModalVisible(true)}>
          <FilterIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Filters</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="ml-2 flex-row items-center gap-2 rounded-full border border-[#02AFFF] bg-white px-4 py-2"
          onPress={() => setPropertyTypeModalVisible(true)}>
          <PropertyTypeIcon width={16} height={16} className="mx-auto mb-1" />
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">Property type</Text>
        </TouchableOpacity>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSortModalVisible(false)}>
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}>
          {/* Backdrop */}
          <Pressable style={{ flex: 1 }} onPress={() => setSortModalVisible(false)} />
          {/* Modal Content */}
          <View
            style={{
              backgroundColor: 'white',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              padding: 20,
              minHeight: 180,
              width: '100%',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              elevation: 5,
            }}>
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-poppins text-lg font-semibold">Sort by</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Text className="font-poppins text-base font-medium text-[#0E54EC]">Done</Text>
              </TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                className="flex-row items-center py-2"
                onPress={() => setSelectedSort(option.value)}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: '#0E54EC',
                    backgroundColor: selectedSort === option.value ? '#0E54EC' : 'white',
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {selectedSort === option.value && (
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 2,
                        backgroundColor: 'white',
                      }}
                    />
                  )}
                </View>
                <Text
                  className={`font-poppins text-base ${
                    selectedSort === option.value ? 'font-bold text-[#0E54EC]' : 'text-black'
                  }`}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Property Type Modal */}
      <Modal
        visible={propertyTypeModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setPropertyTypeModalVisible(false)}>
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

        <View style={{ flex: 1 }}>
          {/* Backdrop */}
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
            onPress={() => setPropertyTypeModalVisible(false)}
          />
          {/* Modal Content */}
          <View
            style={{
              height: modalHeight,
              backgroundColor: 'white',
              borderBottomLeftRadius: 32,
              borderBottomRightRadius: 32,
              padding: 20,
              minHeight: 220,
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              elevation: 5,
            }}>
            <Text className="mb-3 font-poppins text-lg font-semibold">Property Type</Text>
            {PROPERTY_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                className="flex-row items-center py-2"
                onPress={() => {
                  setSelectedPropertyType(type.value);
                  setPropertyTypeModalVisible(false);
                }}>
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: '#0E54EC',
                    backgroundColor: selectedPropertyType === type.value ? '#0E54EC' : 'white',
                    marginRight: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {selectedPropertyType === type.value && (
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: 'white',
                      }}
                    />
                  )}
                </View>
                <Text
                  className={`font-poppins text-base ${
                    selectedPropertyType === type.value ? 'font-bold text-[#0E54EC]' : 'text-black'
                  }`}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFilterModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <BackIcon width={24} height={24} />
            <Text className="font-poppins text-lg font-semibold">My Filters</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text className="font-poppins text-base font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>
          <FilterOptionsModal 
           />
          <View className="flex-row bg-white justify-between border-t border-gray-200 px-6 py-8">
            <TouchableOpacity
              onPress={() => setSelectedFilters([])}
              className="rounded px-4 py-2">
              <Text className="font-poppins text-[#0E54EC]">Reset All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setFilterModalVisible(false)}
              className="rounded-full bg-[#0E54EC] px-5 py-2">
              <Text className="font-poppins text-white">Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit Search Modal */}
      <Modal
        visible={editSearchModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditSearchModalVisible(false)}>
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 40 }}>
          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <Text className="font-poppins text-lg font-semibold">Edit Search</Text>
            <TouchableOpacity onPress={() => setEditSearchModalVisible(false)}>
              <Text className="font-poppins text-base font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>
          {/* Place your edit search form here */}
          <View className="flex-1 items-center justify-center">
            <Text className="font-poppins text-base text-gray-500">Edit search form goes here</Text>
          </View>
        </View>
      </Modal>

      <ScrollView className="mt-2 bg-gray-50 p-4">
        {dummyHotels.map((hotel, idx) => (
          <HotelBookingSearchCard key={idx} {...hotel} onHeartPress={() => {}} />
        ))}
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default HotelBookingSearch;
