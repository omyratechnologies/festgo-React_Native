# User Store Documentation

This directory contains the global state management for user profile data using Zustand.

## Files

- `userStore.ts` - Main Zustand store for user data
- `../types/user.ts` - TypeScript interfaces for user data
- `../hooks/useAuth.ts` - Custom hook for authentication logic
- `../components/providers/AuthGuard.tsx` - Guard component for protected routes
- `../components/providers/AuthProvider.tsx` - Provider component for loading states

## Usage

### Basic Usage in Components

```typescript
import useUserStore from '~/store/userStore';

const MyComponent = () => {
  const { userData, isLoading, error, fetchUserProfile } = useUserStore();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View>
      <Text>Welcome, {userData?.firstname}!</Text>
      <Text>Coins: {userData?.festgo_coins}</Text>
    </View>
  );
};
```

### Using the Auth Hook

```typescript
import { useAuth } from '~/hooks/useAuth';

const MyComponent = () => {
  const { userData, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout(); // This will clear data and navigate to login
  };

  return (
    <View>
      {isAuthenticated ? (
        <Text>Welcome back!</Text>
      ) : (
        <Text>Please log in</Text>
      )}
    </View>
  );
};
```

### Store Methods

- `setUserData(data: User)` - Set user data manually
- `clearUserData()` - Clear user data and reset state
- `setLoading(loading: boolean)` - Set loading state
- `setError(error: string | null)` - Set error state
- `fetchUserProfile()` - Fetch user profile from API

### Authentication Flow

1. App starts and `AuthGuard` wraps the MainNavigator
2. `useAuth` hook checks for JWT token in AsyncStorage
3. If token exists, fetches user profile from API
4. If token is invalid/expired, clears data and redirects to login
5. If no token, redirects to login immediately

### API Endpoint

The store expects the API endpoint to be: `${API_URL}/user/profile`

Expected response format:
```json
{
  "success": true,
  "user": {
    "id": "user-id",
    "firstname": "John",
    "lastname": "Doe",
    "email": "john@example.com",
    "festgo_coins": 1000,
    // ... other user fields
  },
  "status": 200
}
```

### Error Handling

- 401 responses automatically clear the JWT token and redirect to login
- Network errors are captured and displayed
- Invalid response formats throw descriptive errors

### Integration with Navigation

The auth system automatically handles navigation to login screen when:
- No JWT token is found
- Token is invalid/expired (401 response)
- Authentication fails

## TypeScript Support

All user data is fully typed with interfaces in `src/types/user.ts`:

- `User` - Main user interface
- `LoginHistory` - Login history entries
- `GstDetail` - GST details
- `UserProfileResponse` - API response format
- `UserStore` - Store interface

## Best Practices

1. Always use the `useAuth` hook for authentication-aware components
2. Use `useUserStore` directly for components that only need user data
3. Handle loading states appropriately
4. Use the provided logout function instead of manually clearing data
5. The store automatically handles token validation and cleanup 