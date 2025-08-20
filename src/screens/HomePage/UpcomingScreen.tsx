import { View, Text } from 'react-native';
import React from 'react';
import BottomMenu from '~/components/common/BottomMenu';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';

const UpcomingScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 justify-start">
      <ProfileHeaderMenu isDifferentPage pageTitle="Upcoming" />

        <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
          <Text className="text-lg font-semibold text-[#00A44E] mb-1">
            Coming Soon on FestGo!  🌟
          </Text>
          <Text className="font-baloo text-base text-[#333] mb-2">
            Here's what's live now:
          </Text>
          <View className="mb-4 pl-2">
            <Text className="text-base text-[#0601B4] font-semibold mb-1">
              We're Growing, Just for You!
            </Text>
            <Text className="text-base text-[#444] mb-1">
              • Hotels & Resorts Booking
            </Text>
            <Text className="text-base text-[#444]">
              • Beach Party & Event Services
            </Text>
          </View>
          <Text className="font-baloo text-base text-[#333] mb-2">
            🚀 Coming Very Soon:
          </Text>
          <View className="mb-4 pl-2">
            <Text className="text-base text-[#0601B4] font-semibold mb-1">
              Trips & Group Travel
            </Text>
            <Text className="text-base text-[#444] mb-1">
              Adventure Planning Made Easy
            </Text>
            <Text className="text-base text-[#444] mb-2">
              Plan college trips, family tours, and weekend getaways with ease! Connect with friends, split costs, and create unforgettable memories together.
            </Text>
            <Text className="text-base text-[#0601B4] font-semibold mb-1">
              FestBite – Food & Catering
            </Text>
            <Text className="text-base text-[#444] font-semibold mb-1">
              Delicious Dining On-Demand
            </Text>
            <Text className="text-base text-[#444]">
              Order delicious local food and snacks right at your beach or event location. From fresh seafood to tropical treats, satisfy your cravings instantly!
            </Text>
          </View>
        </ScrollView>
        <BottomMenu />
      </View>
    </View>
  );
};

export default UpcomingScreen;
