import React, { useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const recentSearches = ['New York', 'Los Angeles', 'Mumbai'];
const popularCities = ['Dubai', 'Paris', 'Singapore', 'London'];

export type LocationBottomSheetRef = {
  open: () => void;
  close: () => void;
};

interface LocationBottomSheetProps {
  onClose: () => void;
}

const LocationBottomSheet = forwardRef<LocationBottomSheetRef, LocationBottomSheetProps>(
  ({ onClose }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);

    useImperativeHandle(ref, () => ({
      open: () => sheetRef.current?.expand(),
      close: () => sheetRef.current?.close(),
    }));

    return (
      <BottomSheet
        ref={sheetRef}
        snapPoints={['100%']}
        index={-1}
        enablePanDownToClose
        onClose={onClose}
      >
        <View className="px-4">
          <TextInput
            placeholder="Search cities or hotels"
            className="my-4 rounded-lg border border-gray-300 p-3"
          />
          <Text className="mb-2 font-semibold">Recent Searches</Text>
          {recentSearches.map((item) => (
            <Text key={item} className="py-2 text-gray-700">
              {item}
            </Text>
          ))}
          <View className="my-4 border-t border-gray-300" />
          <Text className="mb-2 font-semibold">Popular Cities</Text>
          <FlatList
            data={popularCities}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity className="m-1 rounded-full bg-gray-100 px-4 py-2">
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
          />
        </View>
      </BottomSheet>
    );
  }
);

export default LocationBottomSheet;
