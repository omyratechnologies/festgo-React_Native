import { View, Text, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useRef, useState } from 'react';
import ProfileHeaderMenu from '~/components/Profile/ProfileHeaderMenu';
import BottomMenu from '~/components/common/BottomMenu';
import ArrowRightIcon from '~/assets/icons/rightIcon.svg';
import HeartIcon from '~/assets/icons/profile/HeartIcon.svg';

const FILTERS = ['All', 'Hotels', 'Resorts', 'Events', 'Trips', 'More', 'Specials', 'Offers'];
const CARD_DATA = [
  {
    id: 1,
    title: 'Flat 15% savings at Park Hyatt',
    description: 'Enjoy exclusive savings at Park Hyatt hotels worldwide.',
    image:
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  {
    id: 2,
    title: 'Resort Bliss',
    description: 'Relax and unwind at top-rated resorts with special offers.',
    image:
      'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
  {
    id: 3,
    title: 'Event Gala',
    description: 'Attend exclusive events and galas with premium access.',
    image:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg',
  },
];

const { width } = Dimensions.get('window');

const WishlistPage = () => {
  const [selected, setSelected] = useState('All');
  const filterScrollRef = useRef<ScrollView>(null);

  const handleArrowPress = () => {
    filterScrollRef.current?.scrollTo({ x: width / 2, animated: true });
  };
  return (
    <View className="w-full flex-1 justify-start bg-white">
      <ProfileHeaderMenu isDifferentPage pageTitle="Wishlist" />
      <ScrollView className="w-full">
        <View className="w-full p-4">
          <View className="mb-4 flex-row items-center">
            <ScrollView
              ref={filterScrollRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-1">
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  className={`mx-1 flex rounded-xl border p-[4px] px-4 pt-2 ${
                    selected === filter
                      ? 'border-[#F15A29BD] bg-[#F15A299C] '
                      : 'border-[#6666667D] bg-white'
                  }`}
                  onPress={() => setSelected(filter)}>
                  <Text
                    className={`font-baloo text-sm font-medium ${
                      selected === filter ? 'text-white' : 'text-[#222]'
                    }`}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity className="ml-2 rounded-full p-2" onPress={handleArrowPress}>
              <ArrowRightIcon color="#222" />
            </TouchableOpacity>
          </View>

          <View className="mb-32 flex-col gap-4 px-2">
            {CARD_DATA.map((card) => (
              <View
                key={card.id}
                className="mb-6 rounded-xl bg-white"
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 1, height: 2 },
                  shadowOpacity: 0.07,
                  shadowRadius: 4,
                  elevation: 9,
                }}>
                <Image
                  source={{ uri: card.image }}
                  style={{ width: '100%', height: 220 }}
                  resizeMode="cover"
                  className="rounded-t-xl"
                />
                <View className="flex-row items-start justify-between p-4">
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text className="mb-1 font-baloo text-lg font-bold text-[#222]">
                      {card.title}
                    </Text>
                    <Text className="text-base text-[#666]">{card.description}</Text>
                  </View>
                  <TouchableOpacity>
                    <HeartIcon width={28} height={28} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
      <BottomMenu />
    </View>
  );
};

export default WishlistPage;
