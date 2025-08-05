import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '~/utils/api';
import { User, UserStore } from '~/types/user';

const useUserStore = create<UserStore>((set, get) => ({
  userData: null,
  isLoading: false,
  error: null,

  setUserData: (data: User) => {
    set({ userData: data, error: null });
  },

  clearUserData: () => {
    set({ userData: null, error: null });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  fetchUserProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const jwtToken = await AsyncStorage.getItem('jwtToken');
      
      if (!jwtToken) {
        set({ 
          isLoading: false, 
          error: 'No authentication token found',
          userData: null 
        });
        return;
      }

      const response = await fetch(`${API_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // For any error response, clear the token and set authentication error
        await AsyncStorage.removeItem('jwtToken');
        set({ 
          isLoading: false, 
          error: 'Authentication failed',
          userData: null 
        });
        return;
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        set({ 
          userData: data.user, 
          isLoading: false, 
          error: null 
        });
      } else {
        // Invalid response format - treat as authentication error
        await AsyncStorage.removeItem('jwtToken');
        set({ 
          isLoading: false, 
          error: 'Authentication failed',
          userData: null 
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // For any network or other errors, clear the token and set authentication error
      await AsyncStorage.removeItem('jwtToken');
      set({ 
        isLoading: false, 
        error: 'Authentication failed',
        userData: null 
      });
    }
  },
}));

export default useUserStore; 