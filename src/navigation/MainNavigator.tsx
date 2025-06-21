import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { MainTabParamList } from './types';

import HomePage from '~/screens/HomePage/HomePage';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomePage} />
    </Tab.Navigator>
  );
};
