import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';

import Onboard1 from '~/assets/images/onboarding/1.svg';
import Onboard2 from '~/assets/images/onboarding/2.svg';
import Onboard3 from '~/assets/images/onboarding/3.svg';
import Onboard4 from '~/assets/images/onboarding/4.svg';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome to FestGo 🎉',
    subtitle: 'Your one-stop app for events, resorts, and trips!',
    Image: Onboard1,
  },
  {
    id: '2',
    title: 'Discover Local & Beach Events',
    subtitle: 'From city fests to beach vibes – explore and book with ease.',
    Image: Onboard2,
  },
  {
    id: '3',
    title: 'Premium Stays at Best Prices',
    subtitle: 'Get amazing deals on top-rated hotels and hourly stays.',
    Image: Onboard3,
  },
  {
    id: '4',
    title: 'Invite & Earn',
    subtitle: 'Share FestGo with friends. Earn rewards on every referral!',
    Image: Onboard4,
  },
];

const Onboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: slides.length - 1 });
  };

  const renderItem = ({ item }: any) => {
    const { Image, title, subtitle } = item;
    return (
      <View className="my-12 w-full flex-1 items-center gap-4 px-6" style={{ width }}>
        <Text className="mt-10 text-center font-baloo text-2xl font-bold text-gray-800">
          {title}
        </Text>
        <Image width={300} height={300} />
        <Text className="mt-4 text-center font-baloo text-lg text-gray-500">{subtitle}</Text>
      </View>
    );
  };

  const Indicator = () => {
    return (
      <View className="mb-4 mt-6 flex-row items-center justify-center gap-2 space-x-2">
        {slides.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <View
              key={i}
              className={`h-2 rounded-full ${isActive ? 'w-9 bg-[#F15A29]' : 'w-3 bg-[#D9D9D9]'}`}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-white">
      <View className="bg-white justify-around">
        <FlatList
          data={slides}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          ref={flatListRef}
        />

        <Indicator />

        {/* Footer Buttons */}
        <View className="flex-row items-center justify-between mt-10 px-10 pb-10">
          {currentIndex < slides.length - 1 ? (
            <>
              <TouchableOpacity onPress={handleSkip}>
                <Text className="font-semibold text-gray-500">Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNext}>
                <Text className="rounded-3xl bg-[#F15A29] px-6 py-3 font-semibold text-white">
                  Next
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <View className='w-full items-center'>

            <TouchableOpacity
              onPress={() => navigation.replace('HomePage')}
              className="items-center px-7 justify-center rounded-full bg-[#F15A29] py-3">
              <Text className="text-base font-bold text-white">Get Started</Text>
            </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Onboarding;
