// Environment Configuration
// This file should be added to .gitignore in production

export const ENV_CONFIG = {
  // API Configuration
  API_URL: 'https://server.festgo.in/api',
  
  // OAuth Configuration
  OAUTH: {
    GOOGLE: {
      CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    },
    FACEBOOK: {
      APP_ID: process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || 'YOUR_FACEBOOK_APP_ID',
    },
  },
  
  // App Configuration
  APP: {
    SCHEME: 'festgo',
    BUNDLE_ID: 'com.festgo.app',
  },
};

// Development vs Production configuration
export const isDevelopment = __DEV__;

// Helper function to get configuration
export const getConfig = () => {
  if (isDevelopment) {
    console.log('Running in development mode');
  }
  return ENV_CONFIG;
};
