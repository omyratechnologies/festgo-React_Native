import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthNavigator } from '~/navigation/AuthNavigator';
import { MainNavigator } from '~/navigation/MainNavigator';
import { RootStackParamList } from '~/navigation/types';
import { useFonts } from 'expo-font';

import './global.css';
import HomePage from '~/screens/HomePage/HomePage';

const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  const [fontsLoaded] = useFonts({
    BlackShield: require('./assets/fonts/blackerShield.ttf'),
    Baloo: require('./assets/fonts/baloodaa.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Auth"}>
          {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Main" component={MainNavigator} />
          <Stack.Screen name="HomePage" component={HomePage} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}