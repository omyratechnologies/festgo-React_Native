import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import BottomMenuIcon from '~/assets/images/homepage/BottomMenu.svg';
import MenuPlayButton from '~/assets/images/homepage/MenuPlayButton.svg';
import HomeIcon from '~/assets/images/common/BottomMenu/HomeIcon.svg';
import UpcomingIcon from '~/assets/images/common/BottomMenu/Upcoming.svg';
import ReferIcon from '~/assets/images/common/BottomMenu/Refer.svg';
import HelpIcon from '~/assets/images/common/BottomMenu/HelpIcon.svg';

const MENU_ITEMS = [
  { key: 'home', label: 'Home', Icon: HomeIcon },
  { key: 'upcoming', label: 'Upcoming', Icon: UpcomingIcon },
  { key: 'refer', label: 'Refer', Icon: ReferIcon },
  { key: 'help', label: 'Help', Icon: HelpIcon },
];

const ACTIVE_COLOR = '#02AFFF';
const INACTIVE_COLOR = '#888';

const BottomMenu = () => {
  const [active, setActive] = useState('home');

  return (
    <View className="absolute bottom-3 left-0 right-0 h-[90px] items-center justify-center">
      <BottomMenuIcon width="100%" style={{ ...StyleSheet.absoluteFillObject }} />
      <View className="absolute bottom-0 w-full flex-row items-end justify-between px-8">
        {/* Left icons */}
        {MENU_ITEMS.slice(0, 2).map(({ key, label, Icon }) => (
          <TouchableOpacity
            key={key}
            className="w-[48px] items-center py-6"
            onPress={() => setActive(key)}>
            <Icon color={active === key ? ACTIVE_COLOR : INACTIVE_COLOR} width={20} height={20} />
            <Text
              className={`mt-1 text-[8px] ${active === key ? 'text-[#02AFFF]' : 'text-[#888]'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
        <View className="w-[64px]" />
        {/* Right icons */}
        {MENU_ITEMS.slice(2).map(({ key, label, Icon }) => (
          <TouchableOpacity
            key={key}
            className="w-[48px] items-center py-6"
            onPress={() => setActive(key)}>
            <Icon color={active === key ? ACTIVE_COLOR : INACTIVE_COLOR} width={20} height={20} />
            <Text
              className={`mt-1 text-[8px] ${active === key ? 'text-[#02AFFF]' : 'text-[#888]'}`}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Play Button */}
      <MenuPlayButton
        style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          marginLeft: -50,
          width: 75,
          height: 75,
          zIndex: 2,
        }}
      />
    </View>
  );
};

export default BottomMenu;
