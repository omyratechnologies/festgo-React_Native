import React from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { useState } from 'react';

const TABS = ['Hotels', 'Resorts', 'HourlyStay'];

type HotelBookingCardProps = {
  onLocationPress: () => void;
  onDatePress: () => void;
  onGuestsPress: () => void;
};

const HotelBookingCard: React.FC<HotelBookingCardProps> = ({ onLocationPress, onDatePress, onGuestsPress }) => {
  const [activeTab, setActiveTab] = useState('Hotels');

  return (
    <View className="mx-4 absolute w-[85%] -bottom-1/2 rounded-[30px] bg-white p-7 shadow-md">
      {/* Tabs */}
      <View className="flex-row mx-1 bg-blue-100 justify-between rounded-full overflow-hidden mb-4">
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 ${activeTab === tab ? 'bg-[#0E54EC] rounded-full' : 'bg-blue-100'}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`text-center ${activeTab === tab ? 'text-white' : 'text-black'}`}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Location */}
      <TouchableOpacity onPress={onLocationPress}>
        <View className="border border-[#00000024] rounded-2xl p-3 py-4 mb-4">
          <Text className="text-gray-700">Select Location</Text>
        </View>
      </TouchableOpacity>

      {/* Date and Guests */}
      <View className="flex-row space-x-4">
        <TouchableOpacity onPress={onDatePress} className="flex-1 border-l border-y border-[#00000024] rounded-l-2xl p-3">
          <Text className="text-sm text-gray-500">Date</Text>
          <Text className="text-gray-700">Select dates</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onGuestsPress} className="flex-1 border border-[#00000024] rounded-r-2xl p-3">
          <Text className="text-sm text-gray-500">Guests</Text>
          <Text className="text-gray-700">1 Room, 2 Adults</Text>
        </TouchableOpacity>
      </View>

      {/* Search Button */}
      <TouchableOpacity className="mt-6 bg-[#0E54EC] py-3 rounded-full">
        <Text className="text-center text-white font-semibold text-lg">Search</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HotelBookingCard;
