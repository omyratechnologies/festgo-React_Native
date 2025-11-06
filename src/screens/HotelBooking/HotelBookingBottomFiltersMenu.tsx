import React, { useState, useRef } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Pressable,
  Animated,
  Easing,
} from 'react-native';
import FilterIcon from '~/assets/icons/FilterIcon.svg';
import PropertyIcon from '~/assets/icons/PropertyIcon.svg';
import SortIcon from '~/assets/icons/SortIcon.svg';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

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

const FILTER_OPTIONS = [
  { value: 'free_wifi', label: 'Free WiFi' },
  { value: 'breakfast', label: 'Breakfast Included' },
  { value: 'pool', label: 'Pool' },
  { value: 'parking', label: 'Parking' },
  { value: 'pet_friendly', label: 'Pet Friendly' },
];

interface HotelBookingBottomFiltersMenuProps {
  selectedSort?: 'popularity' | 'rating' | 'price';
  selectedPropertyType?: 'hotels' | 'villas' | 'resorts' | 'apartments';
  selectedFilters?: string[];
  onSortChange?: (sort: 'popularity' | 'rating' | 'price') => void;
  onPropertyTypeChange?: (propertyType: 'hotels' | 'villas' | 'resorts' | 'apartments') => void;
  onFiltersChange?: (filters: string[]) => void;
}

const HotelBookingBottomFiltersMenu: React.FC<HotelBookingBottomFiltersMenuProps> = ({
  selectedSort: parentSelectedSort = 'popularity',
  selectedPropertyType: parentSelectedPropertyType = 'hotels',
  selectedFilters: parentSelectedFilters = [],
  onSortChange,
  onPropertyTypeChange,
  onFiltersChange,
}) => {
  // State for which bottom sheet is open
  const [openSheet, setOpenSheet] = useState<null | 'sort' | 'filter' | 'property'>(null);

  // Use parent state or local fallback
  const selectedSort = parentSelectedSort;
  const selectedPropertyType = parentSelectedPropertyType;
  const selectedFilters = [...parentSelectedFilters];

  // Animation for bottom sheet
  const sheetAnim = useRef(new Animated.Value(0)).current;

  // Open/close bottom sheet with animation
  const openBottomSheet = (key: 'sort' | 'filter' | 'property') => {
    setOpenSheet(key);
    Animated.timing(sheetAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  const closeBottomSheet = () => {
    Animated.timing(sheetAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: false,
    }).start(() => setOpenSheet(null));
  };

  // For seamless transition
  const sheetTranslateY = sheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_HEIGHT + 40, 0],
  });

  // Filter toggle
  const toggleFilter = (value: string) => {
    const newFilters = selectedFilters.includes(value)
      ? selectedFilters.filter((v) => v !== value)
      : [...selectedFilters, value];
    onFiltersChange?.(newFilters);
  };

  // Handle sort change
  const handleSortChange = (sortValue: 'popularity' | 'rating' | 'price') => {
    onSortChange?.(sortValue);
  };

  // Handle property type change
  const handlePropertyTypeChange = (propertyValue: 'hotels' | 'villas' | 'resorts' | 'apartments') => {
    onPropertyTypeChange?.(propertyValue);
    // Close sheet after selection for better UX
    setTimeout(() => closeBottomSheet(), 200);
  };

  return (
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

      {/* Overlay and Bottom Sheet */}
      {openSheet && (
        <>
          {/* Overlay */}
          <Pressable
            className="absolute top-0 left-0 right-0 bottom-0 bg-black/20 z-20"
            onPress={closeBottomSheet}
          />

          {/* Bottom Sheet */}
          <Animated.View
            className="absolute left-0 right-0 bottom-0 bg-white rounded-t-[28px] pt-4 px-5 z-30"
            style={{
              height: BOTTOM_SHEET_HEIGHT,
              transform: [{ translateY: sheetTranslateY }],
              elevation: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.12,
              shadowRadius: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold font-poppins text-[#222]">
                {openSheet === 'sort'
                  ? 'Sort by'
                  : openSheet === 'filter'
                  ? 'My Filters'
                  : 'Property Type'}
              </Text>
              <TouchableOpacity onPress={closeBottomSheet}>
                <Text className="text-base font-semibold text-[#0E54EC] font-poppins">Done</Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              className="flex-1"
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
                      // Close sheet after selection for better UX
                      setTimeout(() => closeBottomSheet(), 200);
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

              {openSheet === 'filter' &&
                FILTER_OPTIONS.map((filter) => (
                  <TouchableOpacity
                    key={filter.value}
                    className="flex-row items-center py-3"
                    onPress={() => toggleFilter(filter.value)}
                    activeOpacity={0.7}
                  >
                    <View
                      className="mr-3 items-center justify-center"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 5,
                        borderWidth: 2,
                        borderColor: '#0E54EC',
                        backgroundColor: selectedFilters.includes(filter.value)
                          ? '#0E54EC'
                          : 'white',
                      }}
                    >
                      {selectedFilters.includes(filter.value) && (
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
                      className={`text-base font-poppins ml-2 ${selectedFilters.includes(filter.value) ? 'font-bold text-[#0E54EC]' : 'text-[#222]'}`}
                    >
                      {filter.label}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            {/* Footer for filter sheet */}
            {openSheet === 'filter' && (
              <View className="flex-row justify-between mb-8 items-center border-t border-gray-200 pt-4 pb-2 px-1 bg-white">
                <TouchableOpacity
                  onPress={() => {
                    onFiltersChange?.([]);
                  }}
                  className="py-2 px-4 rounded bg-[#F2F7FF]"
                >
                  <Text className="text-[#0E54EC] font-semibold">Reset All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={closeBottomSheet}
                  className="py-2 px-6 rounded-full bg-[#0E54EC]"
                >
                  <Text className="text-white font-semibold">Apply</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </>
      )}
    </View>
  );
};

export default HotelBookingBottomFiltersMenu;
