import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthNavigator } from '~/navigation/AuthNavigator';
import { MainNavigator } from '~/navigation/MainNavigator';
import { RootStackParamList } from '~/navigation/types';
import { useFonts } from 'expo-font';

import './global.css';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createBottomTabNavigator<RootStackParamList>();
export default function App() {
  const [fontsLoaded] = useFonts({
    BlackShield: require('./assets/fonts/blackerShield.ttf'),
    Baloo: require('./assets/fonts/baloodaa.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}
          initialRouteName="Main">
          <Stack.Screen name="Auth" component={AuthNavigator} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
        <StatusBar style="light" />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
