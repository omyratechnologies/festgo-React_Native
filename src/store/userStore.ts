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
        if (response.status === 401) {
          // Token is invalid or expired
          await AsyncStorage.removeItem('jwtToken');
          set({ 
            isLoading: false, 
            error: 'Authentication failed',
            userData: null 
          });
          return;
        }
        
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
      }

      const data = await response.json();
      
      if (data.success && data.user) {
        set({ 
          userData: data.user, 
          isLoading: false, 
          error: null 
        });
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'An error occurred',
        userData: null 
      });
    }
  },
}));

export default useUserStore; 