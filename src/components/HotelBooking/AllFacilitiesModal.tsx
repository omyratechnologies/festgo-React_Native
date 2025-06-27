import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Feather } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FACILITY_COLORS = ['#247C22', '#90E2B5', '#FFD88D', '#F7A072'];
const FACILITIES = [
  {
    category: 'General',
    icon: 'wifi', 
    services: [
      { icon: 'wifi', title: 'Free WiFi' },
      { icon: 'coffee', title: 'Breakfast' },
      { icon: 'tv', title: 'Cable TV' },
      { icon: 'airplay', title: 'Air Conditioning' },
    ],
  },
  {
    category: 'Transport',
    icon: 'car',
    services: [
      { icon: 'car', title: 'Parking' },
      { icon: 'navigation', title: 'Airport Shuttle' },
      { icon: 'map-pin', title: 'City Tours' },
    ],
  },
  {
    category: 'Hotel Service',
    icon: 'bell',
    services: [
      { icon: 'bell', title: 'Room Service' },
      { icon: 'users', title: 'Family Rooms' },
      { icon: 'lock', title: 'Safe Deposit' },
    ],
  },
];

const AllFacilitiesModal = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const handleToggle = (category: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  return (
    <View className="mx-4 my-2 rounded-2xl bg-white p-5">
      {FACILITIES.map((cat, sIdx) => (
        <View key={cat.category} className="mb-3">
          <TouchableOpacity
            onPress={() => handleToggle(cat.category)}
            className="flex-row items-center py-3"
            activeOpacity={0.7}
            style={{ justifyContent: 'space-between' }}>
            <View className="flex-row items-center">
              <View
                className="mr-3 w-12 h-12 items-center justify-center rounded-full bg-gray-100 p-2"
                style={{
                  backgroundColor: FACILITY_COLORS[sIdx % FACILITY_COLORS.length],
                }}>
                <Feather name={cat.icon as any} size={22} color="#247C22 " />
              </View>
              <Text className="text-base font-semibold">
                {cat.category}{' '}
                <Text className="text-gray-500">({cat.services.length} facilites)</Text>
              </Text>
            </View>
            {/* Right: Plus/Minus Icon */}
            <Feather name={expanded[cat.category] ? 'minus' : 'plus'} size={22} color="#333" />
          </TouchableOpacity>
          {expanded[cat.category] && (
            <View className="pl-12 pt-2">
              {cat.services.map((service) => (
                <View key={service.title} className="mb-2 flex-row items-center">
                  <Text className="text-base">{service.title}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

export default AllFacilitiesModal;
