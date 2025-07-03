import React, { useState, useEffect, JSX } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import BottomMenu from '~/components/common/BottomMenu';
import HotelBookingSearchCard from '~/components/HotelBooking/HotelBookingSearch/HotelBookingSearchCard';
import BackIcon from '~/assets/icons/hotelBooking/BackIcon.svg';
import EditIcon from '~/assets/icons/hotelBooking/EditIcon.svg';
import FilterIcon from '~/assets/icons/hotelBooking/Filter.svg';
import SortIcon from '~/assets/icons/hotelBooking/Sort.svg';
import PropertyTypeIcon from '~/assets/icons/hotelBooking/PropertyType.svg';
import FilterOptionsModal from './FilterOptionsModal';
import EditSearchModal from './EditSearchModal';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL } from '~/utils/api';

// Type definitions
export interface SearchParams {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
  children?: string;
  rooms?: string;
  [key: string]: any;
}

export interface Hotel {
  id: string;
  vendorId?: string;
  name: string;
  property_type?: string; 
  email?: string;
  star_rating?: number;
  pricePerNight?: string;
  originalPrice?: string;
  discount?: string;
  additionalInfo?: string;
  freeBreakfast?: string;
  freeCancellation?: string;
  review_count?: number;
  location?: {
    city?: string;
    state?: string;
    address?: string;
    country?: string;
    pincode?: string;
    landmark?: string;
    latitude?: string;
    longitude?: string;
  };
  facilities?: string[];
  imageList?: string[];
  [key: string]: any;
}

interface SortOption {
  label: string;
  value: 'popularity' | 'rating' | 'price';
}

interface PropertyType {
  label: string;
  value: 'hotels' | 'villas' | 'resorts' | 'apartments';
}

type RootStackParamList = {
  HotelBookingSearch: {
    searchResults?: Hotel[];
    searchParams?: SearchParams;
  };
  [key: string]: any;
};

type HotelBookingSearchRouteProp = RouteProp<RootStackParamList, 'HotelBookingSearch'>;
type HotelBookingSearchNavigationProp = NativeStackNavigationProp<RootStackParamList>;

const SORT_OPTIONS: SortOption[] = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Customer Rating', value: 'rating' },
  { label: 'Price', value: 'price' },
];

const PROPERTY_TYPES: PropertyType[] = [
  { label: 'Hotels', value: 'hotels' },
  { label: 'Villas', value: 'villas' },
  { label: 'Resorts', value: 'resorts' },
  { label: 'Apartments', value: 'apartments' },
];

const HotelBookingSearch: React.FC = () => {
  const route = useRoute<HotelBookingSearchRouteProp>();
  const navigation = useNavigation<HotelBookingSearchNavigationProp>();
  
  // Get data from navigation params with proper fallback
  const routeParams = route.params || {};
  const { searchResults = [], searchParams = {} } = routeParams;
  
  // State management
  const [sortModalVisible, setSortModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [propertyTypeModalVisible, setPropertyTypeModalVisible] = useState<boolean>(false);
  const [editSearchModalVisible, setEditSearchModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookingData, setBookingData] = useState<SearchParams>(searchParams);

  const [selectedSort, setSelectedSort] = useState<SortOption['value']>(SORT_OPTIONS[0].value);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType['value']>(PROPERTY_TYPES[0].value);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  console.log('Search Results:', searchResults);
  console.log('Search Params:', searchParams);
  // Initialize hotels data
  useEffect(() => {
    if (searchResults && Array.isArray(searchResults) && searchResults.length > 0) {
      setHotels(searchResults);
    }
  }, [searchResults]);

  // Handle edit search
  const handleEditSearch = async (newSearchParams: SearchParams): Promise<void> => {
    setLoading(true);
    setEditSearchModalVisible(false);
    
    try {
      // Make API call with new search parameters
      const response = await fetch(`${API_URL}/properties/p/active-r`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSearchParams),
      });

      if (response.ok) {
        const data = await response.json();
        const properties: Hotel[] = data?.properties || [];
        setHotels(properties);
        setBookingData(newSearchParams);
      } else {
        console.error('Failed to fetch updated search results');
      }
    } catch (error) {
      console.error('Error updating search:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filters and sorting
  const getFilteredAndSortedHotels = (): Hotel[] => {
    if (!Array.isArray(hotels)) return [];
    
    let filteredHotels: Hotel[] = [...hotels];

    // Apply property type filter
    if (selectedPropertyType !== 'hotels') {
      filteredHotels = filteredHotels.filter((hotel: Hotel) => 
        hotel.propertyType?.toLowerCase() === selectedPropertyType
      );
    }

    // Apply other filters
    if (selectedFilters.length > 0) {
      filteredHotels = filteredHotels.filter((hotel: Hotel) =>
        selectedFilters.some((filter: string) => 
          hotel.amenities?.includes(filter)
        )
      );
    }

    // Apply sorting
    switch (selectedSort) {
      case 'rating':
        filteredHotels.sort((a: Hotel, b: Hotel) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'price':
        filteredHotels.sort((a: Hotel, b: Hotel) => (a.price || 0) - (b.price || 0));
        break;
      case 'popularity':
      default:
        filteredHotels.sort((a: Hotel, b: Hotel) => (b.popularity || 0) - (a.popularity || 0));
        break;
    }

    return filteredHotels;
  };

  const toggleFilter = (value: string): void => {
    setSelectedFilters((prev: string[]) =>
      prev.includes(value) ? prev.filter((v: string) => v !== value) : [...prev, value]
    );
  };

  const formatSearchDisplay = (): { location: string; details: string } => {
    if (!bookingData || Object.keys(bookingData).length === 0) {
      return {
        location: 'Search Results',
        details: 'No search details available'
      };
    }
    
    const { destination, checkIn, checkOut, guests, rooms } = bookingData;
    
    let checkInDate = '';
    let checkOutDate = '';
    
    try {
      if (checkIn) {
        checkInDate = new Date(checkIn).toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short' 
        });
      }
      if (checkOut) {
        checkOutDate = new Date(checkOut).toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short' 
        });
      }
    } catch (error) {
      console.error('Error formatting dates:', error);
    }
    
    return {
      location: destination || 'Search Results',
      details: `${checkInDate} - ${checkOutDate} · ${guests || 2} Guests · ${rooms || 1} Room`
    };
  };

  const searchDisplay = formatSearchDisplay();
  const filteredHotels = getFilteredAndSortedHotels();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.2;

  const renderContent = (): JSX.Element => {
    if (loading) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#0E54EC" />
          <Text className="mt-4 font-poppins text-base text-gray-600">
            Searching for hotels...
          </Text>
        </View>
      );
    }

    if (!filteredHotels || filteredHotels.length === 0) {
      return (
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
          <Text className="font-poppins text-xl font-semibold text-gray-800 text-center mb-2">
            No Hotels Found
          </Text>
          <Text className="font-poppins text-base text-gray-600 text-center mb-6">
            We couldn't find any hotels matching your search criteria. Try adjusting your filters or search parameters.
          </Text>
          <TouchableOpacity
            onPress={() => setEditSearchModalVisible(true)}
            className="bg-[#0E54EC] px-6 py-3 rounded-full">
            <Text className="font-poppins text-white font-medium">
              Modify Search
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView className="mt-2 bg-gray-50 p-4">
        {filteredHotels.map((hotel: Hotel, idx: number) => (
          <HotelBookingSearchCard 
            image={hotel.imageList?.[1] || ''}
            hotelName={hotel.name}
            location={hotel.location?.city || ''}
            price={hotel.originalPrice ? Number(hotel.originalPrice) : 0}
            pricePerNight={hotel.pricePerNight ? Number(hotel.pricePerNight) : 0}
            amenities={hotel.facilities || []}
            numberOfReviews={hotel.review_count || 0}
            features={hotel.facilities || []}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>
      
      <View className="w-full flex-row items-center justify-between bg-white px-6 py-4">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <BackIcon width={24} height={24} />
          </TouchableOpacity>
          <View className="ml-3">
            <Text className="font-poppins text-lg font-semibold text-black">
              {searchDisplay.location}
            </Text>
            <Text className="mt-1 font-poppins text-xs text-black">
              {searchDisplay.details}
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
          <Text className="text-center font-poppins font-medium text-[#02AFFF]">
            Filters{selectedFilters.length > 0 && ` (${selectedFilters.length})`}
          </Text>
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
          <Pressable style={{ flex: 1 }} onPress={() => setSortModalVisible(false)} />
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
            {SORT_OPTIONS.map((option: SortOption) => (
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
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
            onPress={() => setPropertyTypeModalVisible(false)}
          />
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
            {PROPERTY_TYPES.map((type: PropertyType) => (
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
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <Text className="font-poppins text-lg font-semibold">My Filters</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text className="font-poppins text-base font-medium text-[#0E54EC]">Done</Text>
            </TouchableOpacity>
          </View>
          <FilterOptionsModal 
            // selectedFilters={selectedFilters}
            // toggleFilter={toggleFilter}
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
        animationType="fade"
        transparent
        onRequestClose={() => setEditSearchModalVisible(false)}>
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>
        <View style={{ flex: 1 }}>
          <Pressable
            style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)' }}
            onPress={() => setEditSearchModalVisible(false)}
          />
          <View
            style={{
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
            <Text className="mb-3 font-poppins text-lg font-semibold">Edit Search</Text>
            <EditSearchModal 
              data={bookingData}
              onSave={handleEditSearch}
              onClose={() => setEditSearchModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {renderContent()}
      
      {!loading && <BottomMenu />}
    </View>
  );
};

export default HotelBookingSearch;