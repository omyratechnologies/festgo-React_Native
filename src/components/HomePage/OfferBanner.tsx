import React, { useRef, useEffect, useState } from 'react';
import { Text, StyleSheet, View, FlatList, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// Consistent card dimensions
const CARD_HORIZONTAL_PADDING = 16; // px-4
const CARD_WIDTH = width - CARD_HORIZONTAL_PADDING * 2;
const CARD_HEIGHT = 120; // Fixed consistent height

const styles = StyleSheet.create({
  banner: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 12,
  },
  text: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
  highlight: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
});

const banners = [
  {
    key: '1',
    text: (
      <>
        Get Up to <Text style={styles.highlight}>50% OFF</Text> on Festive Bookings
      </>
    ),
    colors: ['#00E871', '#008742'],
  },
  {
    key: '2',
    text: (
      <>
        <Text style={styles.highlight}>Refer & Earn </Text>
        exciting Rewards!
      </>
    ),
    colors: ['#FFBF47', '#FF8C00'],
  },
  {
    key: '3',
    text: (
      <>
        Special <Text style={styles.highlight}>Weekend Sale!</Text> Save Big!
      </>
    ),
    colors: ['#2FB1FF', '#0050B3'],
  },
];

const AUTO_SCROLL_INTERVAL = 2000;

const OfferBanner = () => {
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // For smoothness of transition (snapping) on scroll
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex === banners.length) nextIndex = 0;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(interval);
  }, [currentIndex]);

  // In case user manually scrolls (optional: update currentIndex)
  const onMomentumScrollEnd = (event: any) => {
    const newIdx = Math.round(event.nativeEvent.contentOffset.x / CARD_WIDTH);
    setCurrentIndex(newIdx);
  };

  return (
    <View style={{ paddingHorizontal: CARD_HORIZONTAL_PADDING }}>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <LinearGradient
            colors={item.colors}
            style={styles.banner}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text className="font-baloo" style={styles.text}>
              {item.text}
            </Text>
          </LinearGradient>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH,
          offset: CARD_WIDTH * index,
          index,
        })}
        style={{ width: '100%' }}
        contentContainerStyle={{}}
        onMomentumScrollEnd={onMomentumScrollEnd}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default OfferBanner;
