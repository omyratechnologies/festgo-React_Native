import { useNavigation } from '@react-navigation/native';

// Returns navigation if available
// Note: This hook will throw an error if used outside NavigationContainer
// Components using this should always be rendered within a NavigationContainer
export function useOptionalNavigation<T = any>(): T {
  // Just use the regular hook - components should always be in NavigationContainer
  return useNavigation<T>();
}


