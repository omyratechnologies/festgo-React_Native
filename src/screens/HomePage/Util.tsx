import { View, Text } from 'react-native';
import React from 'react';
import HomeBackground from '~/assets/images/homepage/HomeBackground.svg';
import BottomMenu from '~/assets/images/homepage/BottomMenu.svg';
import MenuPlayButton from '~/assets/images/homepage/MenuPlayButton.svg';

const HomePage = () => {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <HomeBackground width="100%" height={250} preserveAspectRatio="xMidYMax slice" />
      <Text>HomePage</Text>
      <MenuPlayButton
        style={{
          position: 'absolute',
          width: 65,
          height: 65,
          bottom: 20,
          left: '50%',
          transform: [{ translateX: '-50%' }],
        }}
      />
      <BottomMenu
        width="100%"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
        }}
      />
    </View>
  );
};

export default HomePage;
