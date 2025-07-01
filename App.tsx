import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-gesture-handler';
import 'react-native-reanimated';
import { AuthNavigator } from '~/navigation/AuthNavigator';
import { MainNavigator } from '~/navigation/MainNavigator';
import { RootStackParamList } from '~/navigation/types';
import { useFonts } from 'expo-font';

import './global.css';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createBottomTabNavigator<RootStackParamList>();
export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);

  const [fontsLoaded] = useFonts({
    BlackShield: require('./assets/fonts/blackerShield.ttf'),
    Baloo: require('./assets/fonts/baloodaa.ttf'),
    Poppins: require('./assets/fonts/poppins.ttf'),
  });

  useEffect(() => {
    const checkUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userId');
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        const isLoggedIn = await AsyncStorage.getItem('isLoggedIn');

        if (userData && jwtToken && isLoggedIn === 'true') {
          setInitialRoute('Main');
        } else {
          setInitialRoute('Auth');
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        setInitialRoute('Main');
      }
    };

    checkUserData();
  }, []);

  if (!fontsLoaded || initialRoute === null) {
    return null; // Or a loading screen component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
          initialRouteName="Auth">
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
