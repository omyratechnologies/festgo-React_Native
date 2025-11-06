import React, { useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
} from 'react-native';
import FilterIcon from '~/assets/icons/FilterIcon.svg';
import PropertyIcon from '~/assets/icons/PropertyIcon.svg';
import SortIcon from '~/assets/icons/SortIcon.svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.75;

const MENU_ITEMS = [
  { key: 'sort', label: 'Sort', Icon: SortIcon, ActiveIcon: SortIcon },
  { key: 'filter', label: 'Filter', Icon: FilterIcon, ActiveIcon: FilterIcon },
  { key: 'property', label: 'Property', Icon: PropertyIcon, ActiveIcon: PropertyIcon },
];

const ACTIVE_COLOR = '#02AFFF';
const INACTIVE_COLOR = '#888';

// Sort options that map to parent component's sort values
const SORT_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'rating', label: 'Customer Rating' },
  { value: 'price', label: 'Price: Low to High' },
];

const PROPERTY_TYPES = [
  { value: 'hotels', label: 'Hotels' },
  { value: 'villas', label: 'Villas' },
  { value: 'resorts', label: 'Resorts' },
  { value: 'apartments', label: 'Apartments' },
];

// Popular Filters
const POPULAR_FILTERS = [
  { value: 'couple_friendly', label: 'Couple Friendly' },
  { value: 'book_at_0', label: 'Book @ ₹0' },
  { value: 'great_location', label: 'Great Location' },
  { value: 'flexible_checkin', label: 'Flexible Check in' },
  { value: 'early_bird_deal', label: 'Early Bird Deal' },
  { value: 'free_cancellation', label: 'Free Cancellation' },
  { value: 'free_breakfast', label: 'Free Breakfast' },
];

// Star Rating Options
const STAR_RATINGS = [5, 4, 3, 2, 1];

// User Rating Options
const USER_RATINGS = [
  { value: 'excellent', label: 'Excellent: 4.2+', minRating: 4.2 },
  { value: 'very_good', label: 'Very Good: 3.5+', minRating: 3.5 },
  { value: 'good', label: 'Good: 3+ Hotel', minRating: 3.0 },
];

// Room Amenities
const ROOM_AMENITIES = [
  { value: 'fireplace', label: 'Fireplace' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'smoking_room', label: 'Smoking Room' },
  { value: 'heater', label: 'Heater' },
  { value: 'kitchenette', label: 'Kitchenette' },
  { value: 'living_area', label: 'Living Area' },
  { value: 'cook_butler', label: 'Cook & Butler Service' },
  { value: 'bathtub', label: 'Bathtub' },
];

// Room Views
const ROOM_VIEWS = [
  { value: 'pool_view', label: 'Pool View' },
  { value: 'garden_view', label: 'Garden View' },
  { value: 'beach_view', label: 'Beach View' },
  { value: 'sea_view', label: 'Sea View' },
  { value: 'city_view', label: 'City View' },
];

// House Rules
const HOUSE_RULES = [
  { value: 'smoking_allowed', label: 'Smoking Allowed' },
  { value: 'unmarried_couples', label: 'Unmarried Couples Allowed' },
  { value: 'pets_allowed', label: 'Pets Allowed' },
  { value: 'alcohol_allowed', label: 'Alcohol Allowed' },
];

// Amenities
const AMENITIES = [
  { value: 'cafe', label: 'Cafe' },
  { value: 'beach', label: 'Beach' },
  { value: 'barbeque', label: 'Barbeque' },
  { value: 'bonfire', label: 'Bonfire' },
  { value: 'bar', label: 'Bar' },
];

interface HotelBookingBottomFiltersMenuProps {
  selectedSort?: 'popularity' | 'rating' | 'price';
  selectedPropertyType?: 'hotels' | 'villas' | 'resorts' | 'apartments';
  selectedFilters?: string[];
  onSortChange?: (sort: 'popularity' | 'rating' | 'price') => void;
  onPropertyTypeChange?: (propertyType: 'hotels' | 'villas' | 'resorts' | 'apartments') => void;
  onFiltersChange?: (filters: string[]) => void;
  onApplyFilters?: (filters: any) => void;
}

const HotelBookingBottomFiltersMenu: React.FC<HotelBookingBottomFiltersMenuProps> = ({
  selectedSort: parentSelectedSort = 'popularity',
  selectedPropertyType: parentSelectedPropertyType = 'hotels',
  selectedFilters: parentSelectedFilters = [],
  onSortChange,
  onPropertyTypeChange,
  onFiltersChange,
  onApplyFilters,
}) => {
  // State for which bottom sheet is open
  const [openSheet, setOpenSheet] = useState<null | 'sort' | 'filter' | 'property'>(null);

  // Filter states
  const [popularFilters, setPopularFilters] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([3000, 6000]);
  const [starRating, setStarRating] = useState<number | null>(null);
  const [userRatings, setUserRatings] = useState<string[]>([]);
  const [roomAmenities, setRoomAmenities] = useState<string[]>([]);
  const [roomViews, setRoomViews] = useState<string[]>([]);
  const [houseRules, setHouseRules] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);

  // Use parent state or local fallback
  const selectedSort = parentSelectedSort;
  const selectedPropertyType = parentSelectedPropertyType;
  const selectedFilters = [...parentSelectedFilters];

  // Open/close bottom sheet
  const openBottomSheet = (key: 'sort' | 'filter' | 'property') => {
    setOpenSheet(key);
  };

  const closeBottomSheet = () => {
    setOpenSheet(null);
  };

  // Filter toggle functions
  const togglePopularFilter = (value: string) => {
    setPopularFilters((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleStarRating = (rating: number) => {
    setStarRating((prev) => (prev === rating ? null : rating));
  };

  const toggleUserRating = (value: string) => {
    setUserRatings((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleRoomAmenity = (value: string) => {
    setRoomAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleRoomView = (value: string) => {
    setRoomViews((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleHouseRule = (value: string) => {
    setHouseRules((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const toggleAmenity = (value: string) => {
    setAmenities((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setPopularFilters([]);
    setPriceRange([3000, 6000]);
    setStarRating(null);
    setUserRatings([]);
    setRoomAmenities([]);
    setRoomViews([]);
    setHouseRules([]);
    setAmenities([]);
    onFiltersChange?.([]);
  };

  const handleApplyFilters = () => {
    // Collect all filter states and format them
    const filters: any = {
      popular: popularFilters.length > 0 ? popularFilters : undefined,
      minPrice: priceRange[0] !== 3000 ? priceRange[0] : undefined,
      maxPrice: priceRange[1] !== 6000 ? priceRange[1] : undefined,
      starRatings: starRating ? [starRating] : undefined,
      userRatings: userRatings.length > 0 ? userRatings : undefined,
      roomAmenities: roomAmenities.length > 0 ? roomAmenities : undefined,
      roomView: roomViews.length > 0 ? roomViews : undefined,
      houseRules: houseRules.length > 0 ? houseRules : undefined,
      amenities: amenities.length > 0 ? amenities : undefined,
    };

    // Remove undefined values
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== undefined)
    );

    // Call the parent's apply filters function
    onApplyFilters?.(cleanFilters);
    
    // Also update the simple filters for backward compatibility
    const allFilterValues = [
      ...popularFilters,
      ...userRatings,
      ...roomAmenities,
      ...roomViews,
      ...houseRules,
      ...amenities,
    ];
    onFiltersChange?.(allFilterValues);
    
    // Close the modal
    closeBottomSheet();
  };

  // Handle sort change
  const handleSortChange = (sortValue: 'popularity' | 'rating' | 'price') => {
    onSortChange?.(sortValue);
  };

  // Handle property type change
  const handlePropertyTypeChange = (propertyValue: 'hotels' | 'villas' | 'resorts' | 'apartments') => {
    onPropertyTypeChange?.(propertyValue);
    closeBottomSheet();
  };

  return (
    <>
    <View className="absolute left-0 right-0 bottom-0 h-20 items-center justify-center z-10 bg-black">
      <View className="absolute bottom-0 w-full flex-row items-center justify-center px-4 py-6 z-20">
        {MENU_ITEMS.map(({ key, label, Icon, ActiveIcon }, idx, arr) => {
          const isActive = openSheet === key;
          const IconComponent = isActive ? ActiveIcon : Icon;
          const showDivider = idx < arr.length - 1;
          return (
            <React.Fragment key={key}>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center px-4 py-3 rounded-2xl mx-1 bg-transparent"
                onPress={() => openBottomSheet(key as any)}
                activeOpacity={0.8}
              >
                <IconComponent
                  color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                  width={22}
                  height={22}
                />
                <Text
                  className={`ml-2 text-[15px] font-semibold ${isActive ? 'text-[#02AFFF]' : 'text-white'}`}
                  style={{ letterSpacing: 0.2 }}
                >
                  {label}
                </Text>
              </TouchableOpacity>
              {showDivider && (
                <View className="h-9 w-[1.5px] bg-white mx-0.5 self-center rounded" />
              )}
            </React.Fragment>
          );
        })}
        </View>
      </View>

      {/* Overlay and Bottom Sheet */}
      {openSheet && (
        <Modal
          visible={true}
          transparent
          animationType="none"
          onRequestClose={closeBottomSheet}
          statusBarTranslucent
        >
          <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          {/* Overlay */}
          <Pressable
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            onPress={closeBottomSheet}
          />

            {/* Bottom Sheet - positioned absolutely at bottom */}
            <View
            style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                width: '100%',
              height: BOTTOM_SHEET_HEIGHT,
                backgroundColor: 'white',
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                paddingTop: 16,
                paddingHorizontal: 20,
                elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.25,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold font-poppins text-[#222]">
                {openSheet === 'sort'
                  ? 'Sort by'
                  : openSheet === 'filter'
                  ? 'Filters'
                  : 'Property Type'}
              </Text>
              <View className="flex-row items-center gap-4">
                {openSheet === 'filter' && (
                  <TouchableOpacity onPress={clearAllFilters}>
                    <Text className="text-base font-semibold text-gray-600 font-poppins">Clear</Text>
                  </TouchableOpacity>
                )}
              <TouchableOpacity onPress={closeBottomSheet}>
                  <Text className="text-xl font-bold text-[#222] font-poppins">×</Text>
              </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1 }}>
            <ScrollView
                style={{ flex: 1 }}
              contentContainerStyle={{ paddingBottom: 32 }}
              showsVerticalScrollIndicator={false}
            >
              {openSheet === 'sort' &&
                SORT_OPTIONS.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    className={`flex-row items-center py-3 w-full border p-3 mb-2 rounded-lg ${
                      selectedSort === option.value ? 'border-[#0E54EC] bg-[#0E54EC2B]/20' : 'border-gray-300'
                    }`}
                    onPress={() => {
                      handleSortChange(option.value as 'popularity' | 'rating' | 'price');
                      closeBottomSheet();
                    }}
                    activeOpacity={0.7}
                  >
                    <View
                      className="mr-3 items-center justify-center"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 40,
                        borderWidth: 2,
                        borderColor: '#0E54EC',
                        backgroundColor: selectedSort === option.value ? '#0E54EC' : 'white',
                      }}
                    >
                      {selectedSort === option.value && (
                        <View
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 40,
                            backgroundColor: 'white',
                          }}
                        />
                      )}
                    </View>
                    <Text
                      className={`text-base font-poppins ml-2 ${selectedSort === option.value ? 'font-bold text-[#0E54EC]' : 'text-[#222]'}`}
                    >
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}

              {openSheet === 'property' &&
                PROPERTY_TYPES.map((type, idx) => (
                  <React.Fragment key={type.value}>
                    <TouchableOpacity
                      className={`flex-row items-center py-3 w-full border p-3 mb-2 rounded-lg ${
                        selectedPropertyType === type.value ? 'border-[#0E54EC] bg-[#0E54EC2B]/20' : 'border-gray-300'
                      }`}
                      onPress={() => handlePropertyTypeChange(type.value as 'hotels' | 'villas' | 'resorts' | 'apartments')}
                      activeOpacity={0.7}
                    >
                      <View
                        className="mr-3 items-center justify-center"
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 40,
                          borderWidth: 2,
                          borderColor: '#0E54EC',
                          backgroundColor: selectedPropertyType === type.value ? '#0E54EC' : 'white',
                        }}
                      >
                        {selectedPropertyType === type.value && (
                          <View
                            style={{
                              width: 10,
                              height: 10,
                              borderRadius: 40,
                              backgroundColor: 'white',
                            }}
                          />
                        )}
                      </View>
                      <Text
                        className={`text-base font-poppins ml-2 ${selectedPropertyType === type.value ? 'font-bold text-[#0E54EC]' : 'text-[#222]'}`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  </React.Fragment>
                ))}

              {openSheet === 'filter' && (
                <>
                  {/* Popular Filters */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      Popular Filters
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {POPULAR_FILTERS.map((filter) => (
                  <TouchableOpacity
                    key={filter.value}
                          onPress={() => togglePopularFilter(filter.value)}
                          className={`rounded-full border px-4 py-2 ${
                            popularFilters.includes(filter.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`font-poppins text-sm ${
                              popularFilters.includes(filter.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {filter.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* Price Range */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      Price range
                    </Text>
                    <View className="mb-2 flex-row items-center justify-between">
                      <Text className="font-poppins text-base font-medium text-[#222]">
                        ₹{priceRange[0]}
                      </Text>
                      <Text className="font-poppins text-base font-medium text-[#222]">
                        ₹{priceRange[1]}
                      </Text>
                    </View>
                    {/* Simple Price Range Slider */}
                    <View className="mb-2 h-2 rounded-full bg-gray-200">
                        <View
                        className="h-full rounded-full bg-[#0E54EC]"
                          style={{
                          width: `${((priceRange[1] - priceRange[0]) / 10000) * 100}%`,
                          marginLeft: `${((priceRange[0] - 0) / 10000) * 100}%`,
                        }}
                      />
                    </View>
                    <View className="flex-row gap-2">
                      <TextInput
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-poppins text-sm"
                        keyboardType="numeric"
                        value={priceRange[0].toString()}
                        onChangeText={(v) => setPriceRange([Number(v) || 0, priceRange[1]])}
                        placeholder="Min"
                      />
                      <TextInput
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-poppins text-sm"
                        keyboardType="numeric"
                        value={priceRange[1].toString()}
                        onChangeText={(v) => setPriceRange([priceRange[0], Number(v) || 0])}
                        placeholder="Max"
                      />
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* Star Rating */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      Star rating
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {STAR_RATINGS.map((rating) => (
                        <TouchableOpacity
                          key={rating}
                          onPress={() => toggleStarRating(rating)}
                          className={`flex-row items-center rounded-full border px-4 py-2 ${
                            starRating === rating
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`mr-1 font-poppins text-base ${
                              starRating === rating ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            ★
                          </Text>
                          <Text
                            className={`font-poppins text-sm ${
                              starRating === rating
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {rating}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* User Rating */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      User rating
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {USER_RATINGS.map((rating) => (
                        <TouchableOpacity
                          key={rating.value}
                          onPress={() => toggleUserRating(rating.value)}
                          className={`flex-row items-center rounded-full border px-4 py-2 ${
                            userRatings.includes(rating.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`mr-1 font-poppins text-base ${
                              userRatings.includes(rating.value) ? 'text-white' : 'text-gray-700'
                            }`}
                          >
                            ★
                          </Text>
                          <Text
                            className={`font-poppins text-sm ${
                              userRatings.includes(rating.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {rating.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* Room Amenities */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      Room Amenities
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {ROOM_AMENITIES.map((amenity) => (
                        <TouchableOpacity
                          key={amenity.value}
                          onPress={() => toggleRoomAmenity(amenity.value)}
                          className={`rounded-full border px-4 py-2 ${
                            roomAmenities.includes(amenity.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`font-poppins text-sm ${
                              roomAmenities.includes(amenity.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {amenity.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* Room Views */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      Room Views
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {ROOM_VIEWS.map((view) => (
                        <TouchableOpacity
                          key={view.value}
                          onPress={() => toggleRoomView(view.value)}
                          className={`rounded-full border px-4 py-2 ${
                            roomViews.includes(view.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                    <Text
                            className={`font-poppins text-sm ${
                              roomViews.includes(view.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {view.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* House Rules */}
                  <View className="mb-4">
                    <Text className="mb-3 font-poppins text-base font-semibold text-[#222]">
                      House Rules
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {HOUSE_RULES.map((rule) => (
                        <TouchableOpacity
                          key={rule.value}
                          onPress={() => toggleHouseRule(rule.value)}
                          className={`rounded-full border px-4 py-2 ${
                            houseRules.includes(rule.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`font-poppins text-sm ${
                              houseRules.includes(rule.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {rule.label}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>

                  {/* HR Separator */}
                  <View className="mb-4 h-[1px] bg-gray-200" />

                  {/* Amenities */}
                  <View className="mb-4">
                    <View className="mb-3 flex-row items-center justify-between">
                      <Text className="font-poppins text-base font-semibold text-[#222]">
                        Amenities
                      </Text>
                      <TouchableOpacity>
                        <Text className="font-poppins text-sm font-medium text-[#0E54EC]">
                          View All
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <View className="flex-row flex-wrap gap-2">
                      {AMENITIES.map((amenity) => (
                        <TouchableOpacity
                          key={amenity.value}
                          onPress={() => toggleAmenity(amenity.value)}
                          className={`rounded-full border px-4 py-2 ${
                            amenities.includes(amenity.value)
                              ? 'border-[#0E54EC] bg-[#0E54EC]'
                              : 'border-gray-300 bg-white'
                          }`}
                        >
                          <Text
                            className={`font-poppins text-sm ${
                              amenities.includes(amenity.value)
                                ? 'font-semibold text-white'
                                : 'text-gray-700'
                            }`}
                          >
                            {amenity.label}
                    </Text>
                  </TouchableOpacity>
                ))}
                    </View>
                  </View>
                </>
              )}
            </ScrollView>
            </View>
            {/* Footer for filter sheet */}
            {openSheet === 'filter' && (
              <View className="flex-row justify-between items-center border-t border-gray-200 pt-4 pb-6 px-1 bg-white">
                <TouchableOpacity
                  onPress={clearAllFilters}
                  className="py-2 px-4 rounded bg-[#F2F7FF]"
                >
                  <Text className="font-poppins text-[#0E54EC] font-semibold">Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleApplyFilters}
                  className="py-2 px-6 rounded-full bg-[#0E54EC]"
                >
                  <Text className="font-poppins text-white font-semibold">Apply Changes</Text>
                </TouchableOpacity>
              </View>
            )}
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

export default HotelBookingBottomFiltersMenu;
