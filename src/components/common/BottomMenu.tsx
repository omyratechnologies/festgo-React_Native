import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import BottomMenuIcon from '~/assets/images/homepage/BottomMenu.svg';
import MenuPlayButton from '~/assets/images/homepage/MenuPlayButton.svg';
import HomeIcon from '~/assets/images/common/BottomMenu/Home.svg';
import HomeIconActive from '~/assets/images/common/BottomMenu/HomeActive.svg';
import UpcomingIcon from '~/assets/images/common/BottomMenu/Upcoming.svg';
import UpcomingIconActive from '~/assets/images/common/BottomMenu/UpcomingActive.svg';
import ReferIcon from '~/assets/images/common/BottomMenu/Refer.svg';
import ReferIconActive from '~/assets/images/common/BottomMenu/ReferActive.svg';
import HelpIcon from '~/assets/images/common/BottomMenu/HelpIcon.svg';
import HelpIconActive from '~/assets/images/common/BottomMenu/HelpIconActive.svg';

const MENU_ITEMS = [
  { key: 'home', label: 'Home', Icon: HomeIcon, ActiveIcon: HomeIconActive, route: 'HomePage' },
  {
    key: 'upcoming',
    label: 'Upcoming',
    Icon: UpcomingIcon,
    ActiveIcon: UpcomingIconActive,
    route: 'UpcomingScreen',
  },
  {
    key: 'refer',
    label: 'Refer',
    Icon: ReferIcon,
    ActiveIcon: ReferIconActive,
    route: 'ReferAndEarn',
  },
  { key: 'help', label: 'Help', Icon: HelpIcon, ActiveIcon: HelpIconActive, route: 'HelpScreen' },
];

const ACTIVE_COLOR = '#02AFFF';
const INACTIVE_COLOR = '#888';

const BottomMenu = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Find the menu item whose route matches the current route name
  const activeKey = MENU_ITEMS.find((item) => item.route === route.name)?.key || 'home';

  const handlePress = (key: string, route: string) => {
    navigation.navigate(route as never);
  };

  return (
    <View className="absolute bottom-3 left-0 right-0 h-[90px] items-center justify-center">
      <BottomMenuIcon width="100%" style={{ ...StyleSheet.absoluteFillObject }} />
      <View className="absolute bottom-0 w-full flex-row items-end justify-between px-8">
        {/* Left icons */}
        {MENU_ITEMS.slice(0, 2).map(({ key, label, Icon, ActiveIcon, route }) => {
          const isActive = activeKey === key;
          const IconComponent = isActive ? ActiveIcon : Icon;
          return (
            <TouchableOpacity
              key={key}
              className="w-[48px] items-center py-6"
              onPress={() => handlePress(key, route)}>
              <IconComponent
                color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                width={20}
                height={20}
              />
              <Text className={`mt-1 text-[8px] ${isActive ? 'text-[#02AFFF]' : 'text-[#888]'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
        <View className="w-[64px]" />
        {/* Right icons */}
        {MENU_ITEMS.slice(2).map(({ key, label, Icon, ActiveIcon, route }) => {
          const isActive = activeKey === key;
          const IconComponent = isActive ? ActiveIcon : Icon;
          return (
            <TouchableOpacity
              key={key}
              className="w-[48px] items-center py-6"
              onPress={() => handlePress(key, route)}>
              <IconComponent
                color={isActive ? ACTIVE_COLOR : INACTIVE_COLOR}
                width={20}
                height={20}
              />
              <Text className={`mt-1 text-[8px] ${isActive ? 'text-[#02AFFF]' : 'text-[#888]'}`}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {/* Play Button with drop shadow */}
      <View
        style={{
          position: 'absolute',
          bottom: 20,
          width: 100,
          height: 100,
          zIndex: 2,
          shadowColor: '#EF0000A8',
          shadowOffset: { width: 1, height: 2 },
          shadowOpacity: 0.44,
          shadowRadius: 8,
          elevation: 9,
          borderRadius: 37.5,
          backgroundColor: 'transparent',
        }}>
        <MenuPlayButton width={'100%'} height={'100%'} />
      </View>
    </View>
  );
};

export default BottomMenu;
