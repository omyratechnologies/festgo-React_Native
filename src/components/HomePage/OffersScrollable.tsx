import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import ArrowRightIcon from '~/assets/icons/rightIcon.svg';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '~/navigation/types';

const FILTERS = [
  { label: 'All', key: 'All' },
  { label: 'Hotels', key: 'Hotels' },
  { label: 'Resorts', key: 'Resorts' },
  { label: 'Events', key: 'Events' },
  { label: 'Trips', key: 'Trips' },
  { label: 'More', key: 'More' },
  { label: 'Specials', key: 'Specials' },
  { label: 'Offers', key: 'Offers' },
];

// Add a "type" property to each card for filtering
const CARD_DATA = [
  {
    id: 1,
    title: 'Flat 15% savings at Park Hyatt',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Hotels',
  },
  {
    id: 2,
    title: 'Resort Bliss',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Resorts',
  },
  {
    id: 3,
    title: 'Event Gala',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Events',
  },
  {
    id: 4,
    title: 'Trip to Paradise',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Trips',
  },
  {
    id: 5,
    title: 'Special Beach Offer',
    image:
      'https://images.unsplash.com/photo-1465156799763-2c087c332922?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Specials',
  },
  {
    id: 6,
    title: 'Limited Time Offer',
    image:
      'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'Offers',
  },
  {
    id: 7,
    title: 'More Fun Awaits',
    image:
      'https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
    type: 'More',
  },
];

const { width } = Dimensions.get('window');

const OffersScrollable = () => {
  const [selected, setSelected] = useState('All');
  const filterScrollRef = useRef<ScrollView>(null);
  const navigation = useNavigation<NavigationProp>();

  const handleArrowPress = () => {
    filterScrollRef.current?.scrollTo({ x: width / 2, animated: true });
  };

  // Filter cards based on selected tab
  const filteredCards =
    selected === 'All'
      ? CARD_DATA
      : CARD_DATA.filter((card) => card.type === selected);

  const handleCardPress = (card: typeof CARD_DATA[0]) => {
    // Navigate to Offers page (assuming route name is 'Offers')
    navigation.navigate('Main', {screen: 'Offers'});
  };

  return (
    <View className="m-4 mb-32 mt-12 rounded-3xl border border-[#66656580] bg-white p-4">
      {/* Heading */}
      <Text className="mb-3 text-lg font-baloo font-bold text-black">Offers</Text>

      {/* Filter Options */}
      <View className="mb-4 flex-row items-center">
        <ScrollView
          ref={filterScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-1">
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              className={`mx-1 flex rounded-xl border p-[4px] px-4 pt-2 ${
                selected === filter.key
                  ? 'border-[#F15A29BD] bg-[#F15A299C] '
                  : 'border-[#6666667D] bg-white'
              }`}
              onPress={() => setSelected(filter.key)}>
              <Text
                className={`font-baloo text-sm font-medium ${
                  selected === filter.key ? 'text-white' : 'text-[#222]'
                }`}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity className="ml-2 rounded-full p-2" onPress={handleArrowPress}>
          <ArrowRightIcon color="#222" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
        {filteredCards.length === 0 ? (
          <View className="flex items-center justify-center h-44 w-72">
            <Text className="text-[#888] font-baloo">No offers found.</Text>
          </View>
        ) : (
          filteredCards.map((card) => (
            <TouchableOpacity
              key={card.id}
              className="relative mr-4 h-44 w-72 overflow-hidden rounded-xl"
              activeOpacity={0.85}
              onPress={() => handleCardPress(card)}
            >
              <Image
                source={{ uri: card.image }}
                className="absolute h-full w-full"
                resizeMode="cover"
              />
              {/* Gradient Overlay */}
              <LinearGradient
                colors={['rgba(0,0,0,0.5)', 'transparent']}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '100%',
                  justifyContent: 'space-between',
                }}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}>
                {/* Logo Top Left */}
                <View
                  style={{
                    position: 'absolute',
                    left: 12,
                    top: 12,
                    borderRadius: 999,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    padding: 4,
                  }}>
                  <Image
                    source={{ uri: card.logo }}
                    style={{ height: 28, width: 28, borderRadius: 999 }}
                    resizeMode="contain"
                  />
                </View>
                {/* Title Bottom Left */}
                <View style={{ position: 'absolute', left: 12, bottom: 12 }}>
                  <Text className="font-baloo text-lg font-bold text-white">{card.title}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default OffersScrollable;
