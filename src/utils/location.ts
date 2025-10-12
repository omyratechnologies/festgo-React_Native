import * as Location from 'expo-location';
import { Alert, Linking } from 'react-native';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

/**
 * Requests location permission once.
 * Returns true if granted, false otherwise.
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch (error) {
    console.error('Error requesting location permission:', error);
    return false;
  }
};

/**
 * Attempts to get the current location.
 * If the user denies permission, it does NOT force them to enable it.
 */
export const getCurrentLocation = async (): Promise<LocationCoords | null> => {
  try {
    const hasPermission = await requestLocationPermission();

    if (!hasPermission) {
      // Politely inform, but don’t force or redirect
      Alert.alert(
        'Location Permission Denied',
        'You can still use the app, but location-based features (like nearby hotels) will be limited.',
        [
          { text: 'OK' },
          // Optional: allow user to open settings themselves
          {
            text: 'Open Settings',
            onPress: () => Linking.openSettings(),
          },
        ]
      );
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting current location:', error);
    Alert.alert('Location Error', 'Unable to get your current location. Please try again later.');
    return null;
  }
};

/**
 * Calculates the distance between two coordinates (in kilometers).
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
