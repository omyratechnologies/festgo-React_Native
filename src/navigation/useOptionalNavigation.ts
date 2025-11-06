import { useNavigation } from '@react-navigation/native';

// Returns navigation if available, or undefined when not inside a NavigationContainer
export function useOptionalNavigation<T = any>(): T | undefined {
  try {
    // Always call the hook; catch missing context at runtime
    return useNavigation<T>();
  } catch (error) {
    console.warn('Navigation context not available:', error);
    return undefined;
  }
}


