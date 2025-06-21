import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useRef, useEffect, useState } from 'react';
import { View, Dimensions, Animated } from 'react-native';

import { Button } from '~/components/ui/Button';
import Typography from '~/components/ui/Typography';
import { RootStackParamList } from '~/navigation/types';

const { width } = Dimensions.get('window');

const carouselImages = [
  require('~/assets/images/welcome/image1.png'),
  require('~/assets/images/welcome/image2.png'),
  require('~/assets/images/welcome/image3.png'),
];

type WelcomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Welcome'>;

const carouselTexts = [
  'Instant Lawn Care Quotes, Just a Tap Away',
  'Snow Removal Service You Can Count On',
  'Complete Property Care, Made Easy',
];

const WelcomeScreen = () => {
  const navigation = useNavigation<WelcomeScreenNavigationProp>();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const slidesRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % carouselImages.length;
      (slidesRef.current as any)?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const renderItem = ({ item }: { item: number }) => {
    return (
      <Animated.Image
        source={item}
        style={{
          width,
          height: '100%',
          resizeMode: 'cover',
        }}
      />
    );
  };

  const handleNext = () => {
    if (currentIndex === carouselImages.length - 1) {
      navigation.push('Auth', { screen: 'Login' });
    } else {
      const nextIndex = currentIndex + 1;
      (slidesRef.current as any)?.scrollToOffset({
        offset: nextIndex * width,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <View className="flex-1">
      <View className="absolute inset-0">
        <Animated.FlatList
          ref={slidesRef}
          data={carouselImages}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: true,
          })}
          scrollEventThrottle={16}  
          decelerationRate="fast"    
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(newIndex);
          }}
        />
      </View>


        <View className="flex h-full w-full justify-end gap-6 py-12">
          <View className="w-full">
            <Animated.View style={{ opacity: fadeAnim }}>
              <Typography variant="h3" weight="semibold" className="px-4 text-4xl text-center text-white">
                {carouselTexts[currentIndex]}
              </Typography>
            </Animated.View>

            <View className="mt-6 flex-row justify-center">
              {carouselImages.map((_, index) => {
                const inputRange = [
                  (index - 1) * width,
                  index * width,
                  (index + 1) * width,
                ];


                const opacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0.3, 1, 0.3],
                  extrapolate: 'clamp',
                });

                const scaleX = scrollX.interpolate({
                  inputRange,
                  outputRange: [1, 1.5, 1],
                  extrapolate: 'clamp',
                });

                return (
                  <Animated.View
                    key={index}
                    className={`h-2 w-2 rounded-full ${index === currentIndex ? 'mx-3 w-8 bg-[#7AC943]' : 'mx-1 bg-white'}`}
                    style={{
                      opacity,
                      transform: [{ scaleX }],
                    }}
                  />
                );
              })}
            </View>
          </View>

          <Button
            title={currentIndex === carouselImages.length - 1 ? "Get Started" : "Next"}
            onPress={handleNext}
            variant="primary"
            size="lg"
            className="mx-8"
            disabled={currentIndex !== carouselImages.length - 1 && currentIndex === carouselImages.length - 1}
          />
        </View>
    </View>
  );
};

export default WelcomeScreen;
