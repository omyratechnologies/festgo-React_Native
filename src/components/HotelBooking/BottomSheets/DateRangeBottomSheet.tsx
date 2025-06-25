import React from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface DateRangeBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const DateRangeBottomSheet = ({ visible, onClose }: DateRangeBottomSheetProps) => {
  const snapPoints = ['100%'];

  if (!visible) return null;

  return (
    <BottomSheet index={0} snapPoints={snapPoints} onClose={onClose}>
      <View className="p-4">
        <Text className="text-lg font-semibold mb-4">Select Date Range</Text>
        {/* Replace this with actual date range picker */}
        <View className="h-96 bg-gray-100 rounded-lg justify-center items-center">
          <Text className="text-gray-500">Date Picker Component</Text>
        </View>
      </View>
    </BottomSheet>
  );
};

export default DateRangeBottomSheet;
