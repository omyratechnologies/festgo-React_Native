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
  Alert,
} from 'react-native';
import HotelBookingSearchCard from '~/components/HotelBooking/HotelBookingSearch/HotelBookingSearchCard';
import BackIcon from '~/assets/icons/hotelBooking/BackIcon.svg';
import EditIcon from '~/assets/icons/hotelBooking/EditIcon.svg';
import FilterOptionsModal from './FilterOptionsModal';
import EditSearchModal from './EditSearchModal';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { API_URL, fetchFilteredHotels, FilterParams } from '~/utils/api';
import HotelBookingBottomFiltersMenu from './HotelBookingBottomFiltersMenu';

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

export interface Amenity {
  amenity_id: number;
  is_selected: string;
  amenity_name: string;
  selected_attributes: any[];
  selected_sub_attributes: {
    [key: string]: any;
  };
}

export interface Hotel {
  id: string;
  vendorId?: string;
  name: string;
  property_type?: string;
  email?: string;
  star_rating?: number;
  price?: {
    child_charge?: number;
    extra_adult_charge?: string;
    base_price_for_2_adults?: string;
    [key: string]: any;
  };
  pricePerNight?: string;
  originalPrice?: string;
  discount?: string;
  additionalInfo?: string;
  freeBreakfast?: string;
  freeCancellation?: string;
  review_count?: number;
  location?: {
    lat?: number;
    lng?: number;
    city?: string;
    state?: string;
    address?: string;
    country?: string;
    pincode?: string;
    locality?: string;
    houseNumber?: string;
    searchLocation?: string;
    [key: string]: any;
  };
  facilities?: Amenity[];
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
  // Allow searchResults to be either Hotel[] or an object with a properties field
  type SearchResultsType = Hotel[] | { properties: Hotel[] };

  const { searchResults = [], searchParams = {} } = routeParams as {
    searchResults?: SearchResultsType;
    searchParams?: SearchParams;
  };
  console.log('Route Params:', routeParams);
  console.log('Search Results:', searchResults);

  // State management
  const [sortModalVisible, setSortModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [propertyTypeModalVisible, setPropertyTypeModalVisible] = useState<boolean>(false);
  const [editSearchModalVisible, setEditSearchModalVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [bookingData, setBookingData] = useState<SearchParams>(searchParams);

  const [selectedSort, setSelectedSort] = useState<SortOption['value']>(SORT_OPTIONS[0].value);
  const [selectedPropertyType, setSelectedPropertyType] = useState<PropertyType['value']>(
    PROPERTY_TYPES[0].value
  );
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedBadges, setSelectedBadges] = useState<string[]>([]);
  console.log('Search Results:', searchResults);
  console.log('Search Params:', searchParams);
  // Initialize hotels data
  useEffect(() => {
    if (searchResults) {
      if (Array.isArray(searchResults)) {
        setHotels(searchResults);
      } else if (
        typeof searchResults === 'object' &&
        'properties' in searchResults &&
        Array.isArray(searchResults.properties)
      ) {
        setHotels(searchResults.properties);
      }
    }
    console.log('Initial Hotels:', searchResults);
    console.log('hotels', hotels);
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
      console.log('API Response:', response);
      if (response.ok) {
        const data = await response.json();
        console.log('Updated Search Results:', data);
        const properties: Hotel[] = data?.properties || [];
        console.log('properties', properties);
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
    filteredHotels = filteredHotels.filter((hotel: Hotel) => {
      // Check both property_type and propertyType fields (API might use either)
      const hotelPropertyType = (hotel.property_type || hotel.propertyType || '').toLowerCase().trim();
      
      // Map property types to match API values (API typically returns singular forms)
      const typeMapping: { [key: string]: string[] } = {
        'hotels': ['hotel'],
        'resorts': ['resort'],
        'villas': ['villa'],
        'apartments': ['apartment'],
      };
      
      const expectedTypes = typeMapping[selectedPropertyType] || [selectedPropertyType.replace(/s$/, '')]; // Remove 's' as fallback
      
      // Check if hotel property type matches any expected type
      return expectedTypes.some(type => hotelPropertyType === type || hotelPropertyType.includes(type));
    });

    // Apply other filters (check facilities/amenities)
    if (selectedFilters.length > 0) {
      filteredHotels = filteredHotels.filter((hotel: Hotel) => {
        // Check both amenities array and facilities array
        const hotelAmenities = hotel.amenities || [];
        const hotelFacilities = hotel.facilities || [];
        
        // Get amenity names from facilities
        const facilityNames = hotelFacilities.map((f: any) => 
          f.amenity_name?.toLowerCase() || ''
        );
        
        // Check if any selected filter matches
        return selectedFilters.some((filter: string) => {
          const filterLower = filter.toLowerCase().replace(/\s+/g, '_');
          // Check direct match
          if (hotelAmenities.includes(filter) || hotelAmenities.includes(filterLower)) {
            return true;
          }
          // Check facility names
          return facilityNames.some((name: string) => 
            name.includes(filterLower) || name.includes(filter.replace(/_/g, ' ').toLowerCase())
          );
        });
      });
    }

    // Apply sorting
    switch (selectedSort) {
      case 'rating':
        filteredHotels.sort((a: Hotel, b: Hotel) => {
          // Check both rating and star_rating fields
          const ratingA = a.rating || a.star_rating || 0;
          const ratingB = b.rating || b.star_rating || 0;
          return ratingB - ratingA;
        });
        break;
      case 'price':
        filteredHotels.sort((a: Hotel, b: Hotel) => {
          // Check pricePerNight first, then base_price_for_2_adults
          let priceA = 0;
          if (a.pricePerNight) {
            priceA = typeof a.pricePerNight === 'string' ? Number(a.pricePerNight) : a.pricePerNight;
          } else if (a.price?.base_price_for_2_adults) {
            priceA = typeof a.price.base_price_for_2_adults === 'string'
              ? Number(a.price.base_price_for_2_adults)
              : a.price.base_price_for_2_adults;
          } else if (a.originalPrice) {
            priceA = typeof a.originalPrice === 'string' ? Number(a.originalPrice) : a.originalPrice;
          }

          let priceB = 0;
          if (b.pricePerNight) {
            priceB = typeof b.pricePerNight === 'string' ? Number(b.pricePerNight) : b.pricePerNight;
          } else if (b.price?.base_price_for_2_adults) {
            priceB = typeof b.price.base_price_for_2_adults === 'string'
              ? Number(b.price.base_price_for_2_adults)
              : b.price.base_price_for_2_adults;
          } else if (b.originalPrice) {
            priceB = typeof b.originalPrice === 'string' ? Number(b.originalPrice) : b.originalPrice;
          }

          return priceA - priceB;
        });
        break;
      case 'popularity':
      default:
        filteredHotels.sort((a: Hotel, b: Hotel) => {
          // Check popularity field or use a default
          const popularityA = a.popularity || 0;
          const popularityB = b.popularity || 0;
          return popularityB - popularityA;
        });
        break;
    }

    return filteredHotels;
  };

  const toggleFilter = (value: string): void => {
    setSelectedFilters((prev: string[]) =>
      prev.includes(value) ? prev.filter((v: string) => v !== value) : [...prev, value]
    );
  };

  const toggleBadge = (badge: string): void => {
    setSelectedBadges((prev: string[]) =>
      prev.includes(badge) ? prev.filter((v: string) => v !== badge) : [...prev, badge]
    );
  };

  const handleApplyFilters = async (filters: any) => {
    setLoading(true);
    setFilterModalVisible(false);

    try {
      const filterParams: FilterParams = {
        ...bookingData,
        ...filters,
      };

      const data = await fetchFilteredHotels(filterParams);

      if (data.success && data.properties) {
        const hotelArray = Array.isArray(data.properties) ? data.properties : [];
        setHotels(hotelArray);
      } else {
        setHotels([]);
      }
    } catch (error) {
      console.error('Error applying filters:', error);
      Alert.alert('Error', 'Failed to apply filters. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSearchDisplay = (): { location: string; dateRange: string; guestsInfo: string } => {
    if (!bookingData || Object.keys(bookingData).length === 0) {
      return {
        location: 'Search Results',
        dateRange: 'No dates selected',
        guestsInfo: 'No guest info',
      };
    }

    const {
      destination,
      location,
      checkIn,
      checkOut,
      todate,
      enddate,
      adults,
      adult,
      children,
      child,
      rooms,
    } = bookingData;

    let checkInDate = '';
    let checkOutDate = '';

    try {
      // Try different date formats
      if (checkIn) {
        checkInDate = new Date(checkIn).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
      } else if (todate) {
        // Handle DD-MM-YYYY format
        const [day, month, year] = todate.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        checkInDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
      }

      if (checkOut) {
        checkOutDate = new Date(checkOut).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
      } else if (enddate) {
        // Handle DD-MM-YYYY format
        const [day, month, year] = enddate.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        checkOutDate = date.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
        });
      }
    } catch (error) {
      console.error('Error formatting dates:', error);
    }

    const adultsCount = adults || adult || 2;
    const childrenCount = children || child || 0;
    const roomsCount = rooms || 1;

    const dateRange =
      checkInDate && checkOutDate ? `${checkInDate} - ${checkOutDate}` : 'Select dates';
    const guestsInfo = `${adultsCount} Guest${Number(adultsCount) > 1 ? 's' : ''}${Number(childrenCount) > 0 ? `, ${childrenCount} Child${Number(childrenCount) > 1 ? 'ren' : ''}` : ''} · ${roomsCount} Room${Number(roomsCount) > 1 ? 's' : ''}`;

    return {
      location: destination || location || 'Search Results',
      dateRange,
      guestsInfo,
    };
  };

  const searchDisplay = formatSearchDisplay();
  const filteredHotels = getFilteredAndSortedHotels();
  const screenHeight = Dimensions.get('window').height;
  const modalHeight = screenHeight * 0.2;

  const renderContent = (): JSX.Element => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-50">
          <ActivityIndicator size="large" color="#0E54EC" />
          <Text className="mt-4 font-poppins text-base text-gray-600">Searching for hotels...</Text>
        </View>
      );
    }

    if (!filteredHotels || filteredHotels.length === 0) {
      return (
        <View className="flex-1 items-center justify-center bg-gray-50 px-6">
          <Text className="mb-2 text-center font-poppins text-xl font-semibold text-gray-800">
            No Hotels Found
          </Text>
          <Text className="mb-6 text-center font-poppins text-base text-gray-600">
            We couldn't find any hotels matching your search criteria. Try adjusting your filters or
            search parameters.
          </Text>
          <TouchableOpacity
            onPress={() => setEditSearchModalVisible(true)}
            className="rounded-full bg-[#0E54EC] px-6 py-3">
            <Text className="font-poppins font-medium text-white">Modify Search</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <ScrollView className="mt-2 bg-gray-50 p-4">
        {filteredHotels.map((hotel: Hotel, idx: number) => {
          console.log('Hotel data:', hotel.id, hotel.name, hotel.property_type);
          console.log('Full hotel object:', JSON.stringify(hotel, null, 2));
          return (
            <HotelBookingSearchCard
              key={hotel.id || `hotel-${idx}`}
              image={hotel.imageList?.[1] || ''}
              hotelName={hotel.name}
              location={hotel.location?.city || ''}
              price={hotel.originalPrice ? Number(hotel.originalPrice) : 0}
              pricePerNight={hotel.pricePerNight ? Number(hotel.pricePerNight) : 0}
              amenities={hotel.facilities || []}
              numberOfReviews={hotel.review_count || 0}
              features={hotel.facilities?.map((f) => f.amenity_name) || []}
              propertyType={hotel.property_type}
              hotelId={hotel.id}
              searchParams={bookingData}
            />
          );
        })}
      </ScrollView>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16"></View>

      <View className="w-full bg-white px-6 py-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon width={24} height={24} />
            </TouchableOpacity>
            <View className="ml-3">
              <Text className="font-poppins text-lg font-semibold text-black">
                {searchDisplay.location}
              </Text>
              <Text className="mt-1 font-poppins text-sm text-gray-600">
                {searchDisplay.dateRange} • {searchDisplay.guestsInfo}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setEditSearchModalVisible(true)}>
            <EditIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        {/* Hotel Feature Badges */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3"
          contentContainerStyle={{ paddingHorizontal: 0 }}>
          <View className="flex-row gap-3 px-0">
            <TouchableOpacity
              onPress={() => toggleBadge('Couple Friendly')}
              className={`flex-row items-center rounded-xl border px-4 py-3 ${
                selectedBadges.includes('Couple Friendly')
                  ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-poppins text-sm font-medium ${
                  selectedBadges.includes('Couple Friendly') ? 'text-[#0E54EC]' : 'text-gray-700'
                }`}>
                Couple Friendly
              </Text>
              {selectedBadges.includes('Couple Friendly') && (
                <Text className="ml-2 font-poppins text-sm font-bold text-[#0E54EC]">×</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBadge('Book @ ₹0')}
              className={`flex-row items-center rounded-xl border px-4 py-3 ${
                selectedBadges.includes('Book @ ₹0')
                  ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-poppins text-sm font-medium ${
                  selectedBadges.includes('Book @ ₹0') ? 'text-[#0E54EC]' : 'text-gray-700'
                }`}>
                Book @ ₹0
              </Text>
              {selectedBadges.includes('Book @ ₹0') && (
                <Text className="ml-2 font-poppins text-sm font-bold text-[#0E54EC]">×</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBadge('Great Location')}
              className={`flex-row items-center rounded-xl border px-4 py-3 ${
                selectedBadges.includes('Great Location')
                  ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-poppins text-sm font-medium ${
                  selectedBadges.includes('Great Location') ? 'text-[#0E54EC]' : 'text-gray-700'
                }`}>
                Great Location
              </Text>
              {selectedBadges.includes('Great Location') && (
                <Text className="ml-2 font-poppins text-sm font-bold text-[#0E54EC]">×</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBadge('Flexible Check-in')}
              className={`flex-row items-center rounded-xl border px-4 py-3 ${
                selectedBadges.includes('Flexible Check-in')
                  ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-poppins text-sm font-medium ${
                  selectedBadges.includes('Flexible Check-in') ? 'text-[#0E54EC]' : 'text-gray-700'
                }`}>
                Flexible Check-in
              </Text>
              {selectedBadges.includes('Flexible Check-in') && (
                <Text className="ml-2 font-poppins text-sm font-bold text-[#0E54EC]">×</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleBadge('Free Cancellation')}
              className={`flex-row items-center rounded-xl border px-4 py-3 ${
                selectedBadges.includes('Free Cancellation')
                  ? 'border-[#0E54EC] bg-[#0E54EC]/10'
                  : 'border-gray-300 bg-white'
              }`}>
              <Text
                className={`font-poppins text-sm font-medium ${
                  selectedBadges.includes('Free Cancellation') ? 'text-[#0E54EC]' : 'text-gray-700'
                }`}>
                Free Cancellation
              </Text>
              {selectedBadges.includes('Free Cancellation') && (
                <Text className="ml-2 font-poppins text-sm font-bold text-[#0E54EC]">×</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSortModalVisible(false)}>
        <View className="flex-row items-center justify-between bg-[#0E54EC] px-4 pb-4 pt-16" />
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
            onApplyFilters={handleApplyFilters}
            initialFilters={selectedFilters}
          />
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

      {!loading && (
        <HotelBookingBottomFiltersMenu
          selectedSort={selectedSort}
          selectedPropertyType={selectedPropertyType}
          selectedFilters={selectedFilters}
          onSortChange={setSelectedSort}
          onPropertyTypeChange={setSelectedPropertyType}
          onFiltersChange={setSelectedFilters}
        />
      )}
    </View>
  );
};

export default HotelBookingSearch;
