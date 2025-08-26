// OAuth Configuration
// Replace these with your actual OAuth credentials

export const OAUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your Google Client ID
    // For Android: com.yourcompany.festgo
    // For iOS: com.yourcompany.festgo
    // For Web: http://localhost:19006
  },
  FACEBOOK: {
    APP_ID: 'YOUR_FACEBOOK_APP_ID', // Replace with your Facebook App ID
    // For Android: com.yourcompany.festgo
    // For iOS: com.yourcompany.festgo
    // For Web: http://localhost:19006
  },
};

// Instructions for setting up OAuth:
// 
// Google OAuth Setup:
// 1. Go to https://console.developers.google.com/
// 2. Create a new project or select existing one
// 3. Enable Google+ API
// 4. Go to Credentials > Create Credentials > OAuth 2.0 Client IDs
// 5. Add authorized redirect URIs:
//    - Android: com.yourcompany.festgo:/auth
//    - iOS: com.yourcompany.festgo:/auth
//    - Web: http://localhost:19006/auth
// 6. Copy the Client ID and replace YOUR_GOOGLE_CLIENT_ID
//
// Facebook OAuth Setup:
// 1. Go to https://developers.facebook.com/
// 2. Create a new app or select existing one
// 3. Add Facebook Login product
// 4. Go to Settings > Basic and copy App ID
// 5. Go to Facebook Login > Settings
// 6. Add Valid OAuth Redirect URIs:
//    - Android: com.yourcompany.festgo:/auth
//    - iOS: com.yourcompany.festgo:/auth
//    - Web: http://localhost:19006/auth
// 7. Copy the App ID and replace YOUR_FACEBOOK_APP_ID
