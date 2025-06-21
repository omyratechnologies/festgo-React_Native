import { View, Pressable, Animated, Easing } from 'react-native';
import { useState, useEffect } from 'react';
import Typography from './Typography';

interface TabToggleProps {
  leftTab: string;
  rightTab: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const TabToggle = ({ leftTab, rightTab, value, onValueChange }: TabToggleProps) => {
  const [slideAnim] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      duration: 300,
      easing: Easing.inOut(Easing.ease)
    }).start();
  }, [value]);

  return (
    <View className="flex-row items-center justify-center bg-[#EDF1F3] rounded-full h-16 p-0.5 w-full">
      <Animated.View
        className="absolute bg-text-primary rounded-full"
        style={{
          left: slideAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['2%', '50%']
          }),
          width: '50%',
          height: '92%',
          top: '4%',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3
        }}
      />
      <Pressable
        onPress={() => onValueChange(false)}
        className="flex-1 items-center justify-center h-full z-10"
      >
        <Typography
          variant="body"
          weight="semibold"
          className={`text-center ${!value ? 'text-white' : 'text-[#000]'}`}
        >
          {leftTab}
        </Typography>
      </Pressable>
      <Pressable
        onPress={() => onValueChange(true)}
        className="flex-1 items-center justify-center h-full z-10"
      >
        <Typography
          variant="body"
          weight="semibold"
          className={`text-center ${value ? 'text-white' : 'text-[#000]'}`}
        >
          {rightTab}
        </Typography>
      </Pressable>
    </View>
  );
};

export default TabToggle;