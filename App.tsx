import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthNavigator } from '~/navigation/AuthNavigator';
import { MainNavigator } from '~/navigation/MainNavigator';
import { RootStackParamList } from '~/navigation/types';


import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [deepLinkParams, setDeepLinkParams] = useState<any>(null);

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
        const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
        
        if (userData && jwtToken && isLoggedIn === 'true') {
          setInitialRoute('Main');
        } else if (hasSeenOnboarding === 'true') {
          setInitialRoute('Main'); // Show main app without auth guard
        } else {
          setInitialRoute('Auth'); // Show onboarding first
        }
      } catch (error) {
        console.error('Error checking user data:', error);
        setInitialRoute('Auth');
      }
    };

    checkUserData();
  }, []);

  // Handle deep links
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      
      // Check if it's an email verification link
      if (url.includes('/verify?token=')) {
        const token = url.split('token=')[1];
        if (token) {
          setDeepLinkParams({ token });
          setInitialRoute('Auth'); // Navigate to auth stack for verification
        }
      }
    };

    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!fontsLoaded || initialRoute === null) {
    return null; // Or a loading screen component
  }

  // Deep linking configuration
  const linking = {
    prefixes: [Linking.createURL('/'), 'festgo://', 'https://www.festgo.in'],
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
          <Stack.Screen name="Auth">
            {(props) => <AuthNavigator {...props} deepLinkParams={deepLinkParams} />}
          </Stack.Screen>
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
