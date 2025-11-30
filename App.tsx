import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Linking from 'expo-linking';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, useRef } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AuthNavigator } from '~/navigation/AuthNavigator';
import { MainNavigator } from '~/navigation/MainNavigator';
import { RootStackParamList } from '~/navigation/types';
import { debugDeepLink } from '~/utils/deepLinkTest';


import './global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList | null>(null);
  const [deepLinkParams, setDeepLinkParams] = useState<any>(null);
  const deepLinkTokenRef = useRef<string | null>(null);

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

  // Handle deep links - extract token and store it for EmailVerification screen
  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('Deep link received:', url);
      
      // Use enhanced debug function to extract token
      const token = debugDeepLink(url);
      
      // Check if it's an email verification link
      if (url.includes('/verify')) {
        if (token) {
          console.log('Email verification token found:', token);
          deepLinkTokenRef.current = token;
          setDeepLinkParams({ token });
        } else {
          console.log('Email verification link detected but no token found');
          deepLinkTokenRef.current = null;
          setDeepLinkParams({ token: '' });
        }
      }
    };

    // Handle initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial URL detected:', url);
        handleDeepLink(url);
      }
    });

    // Handle deep links when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log('Deep link event received:', event.url);
      handleDeepLink(event.url);
    });

    return () => {
      subscription?.remove();
    };
  }, []);

  if (!fontsLoaded || initialRoute === null) {
    return null; // Or a loading screen component
  }

  // Deep linking configuration with route mapping
  const linking = {
    prefixes: [
      Linking.createURL('/'), 
      'festgo://', 
      'https://www.festgo.in',
      'https://festgo.in'
    ],
    config: {
      screens: {
        Auth: {
          screens: {
            EmailVerification: {
              path: 'verify',
              // React Navigation automatically parses query parameters
              // The token will be available in route.params.token
            },
          },
        },
      },
    },
    // Custom function to ensure query parameters are properly handled
    getStateFromPath(path: string, options: any) {
      // Handle /verify?token=xxx URLs
      if (path.includes('/verify')) {
        try {
          // Parse the URL to extract query parameters
          const fullPath = path.startsWith('http') ? path : `https://www.festgo.in${path}`;
          const url = new URL(fullPath);
          const token = url.searchParams.get('token');
          
          if (token) {
            // Store token in ref for backup
            deepLinkTokenRef.current = token;
            // Update state for manual deep link handling
            setDeepLinkParams({ token });
            
            // Return navigation state that navigates to EmailVerification with token
            return {
              routes: [
                {
                  name: 'Auth',
                  state: {
                    routes: [
                      {
                        name: 'EmailVerification',
                        params: { token },
                      },
                    ],
                  },
                },
              ],
            };
          }
        } catch (error) {
          console.error('Error parsing deep link URL:', error);
          // Fall through to default handling
        }
      }
      
      // Let React Navigation handle other paths with default parsing
      return undefined;
    },
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
