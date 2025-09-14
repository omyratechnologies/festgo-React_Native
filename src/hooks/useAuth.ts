import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useUserStore from '~/store/userStore';
import { NavigationProp } from '~/navigation/types';

export const useAuth = () => {
  const navigation = useNavigation<NavigationProp>();
  const { 
    userData, 
    isLoading, 
    error, 
    fetchUserProfile, 
    clearUserData 
  } = useUserStore();

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      try {
        const jwtToken = await AsyncStorage.getItem('jwtToken');
        
        if (!jwtToken) {
          clearUserData();
          return; // Don't navigate automatically, let individual screens handle this
        }

        await fetchUserProfile();
      } catch (error) {
        console.error('Error in auth check:', error);
        clearUserData();
        // Don't navigate automatically, let individual screens handle this
      }
    };

    checkAuthAndLoadProfile();
  }, [navigation]);

  useEffect(() => {
    if (error && (error.includes('Authentication failed') || error.includes('No authentication token found'))) {
      clearUserData();
      // Don't navigate automatically, let individual screens handle this
    }
  }, [error, navigation]);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('jwtToken');
      clearUserData();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return {
    userData,
    isLoading,
    error,
    isAuthenticated: !!userData,
    logout,
    refetchProfile: fetchUserProfile,
  };
}; 