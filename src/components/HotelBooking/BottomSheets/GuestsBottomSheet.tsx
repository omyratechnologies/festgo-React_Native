import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

interface GuestsBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

interface CounterProps {
  label: string;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
}

const Counter: React.FC<CounterProps> = ({ label, count, setCount }) => (
  <View className="flex-row items-center justify-between py-3">
    <Text className="text-base">{label}</Text>
    <View className="flex-row items-center gap-4">
      <TouchableOpacity
        onPress={() => setCount(Math.max(0, count - 1))}
        className="rounded-full bg-gray-200 px-3 py-1">
        <Text className="text-lg">−</Text>
      </TouchableOpacity>
      <Text className="text-lg">{count}</Text>
      <TouchableOpacity
        onPress={() => setCount(count + 1)}
        className="rounded-full bg-gray-200 px-3 py-1">
        <Text className="text-lg">+</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const GuestsBottomSheet = ({ visible, onClose }: GuestsBottomSheetProps) => {
  const snapPoints = ['100%'];
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  if (!visible) return null;

  return (
    <BottomSheet index={0} snapPoints={snapPoints} onClose={onClose}>
      <View className="p-4">
        <Text className="mb-4 text-lg font-semibold">Guests & Rooms</Text>
        <Counter label="Rooms" count={rooms} setCount={setRooms} />
        <Counter label="Adults" count={adults} setCount={setAdults} />
        <Counter label="Children" count={children} setCount={setChildren} />
      </View>
    </BottomSheet>
  );
};

export default GuestsBottomSheet;
