// // import * as AuthSession from 'expo-auth-session';
// import * as WebBrowser from 'expo-web-browser';
// import { Platform } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { getConfig } from '../config/env';

// // Configure WebBrowser for auth
// WebBrowser.maybeCompleteAuthSession();

// const config = getConfig();

// // Google OAuth configuration
// const GOOGLE_CLIENT_ID = config.OAUTH.GOOGLE.CLIENT_ID;
// // const GOOGLE_REDIRECT_URI = AuthSession.makeRedirectUri({
// //   scheme: config.APP.SCHEME,
// //   path: 'auth',
// // });

// // Facebook OAuth configuration
// const FACEBOOK_APP_ID = config.OAUTH.FACEBOOK.APP_ID;
// // const FACEBOOK_REDIRECT_URI = AuthSession.makeRedirectUri({
// //   scheme: config.APP.SCHEME,
// //   path: 'auth',
// // });

// export interface SocialLoginResponse {
//   success: boolean;
//   message: string;
//   user?: any;
//   jwtToken?: string;
// }

// export interface DeviceInfo {
//   deviceModel: string;
//   deviceBrand: string;
//   osVersion: string;
//   platform: string;
//   location: string;
// }

// // Get device information
// const getDeviceInfo = (): DeviceInfo => {
//   return {
//     deviceModel: Platform.constants.Brand || 'Unknown',
//     deviceBrand: Platform.constants.Brand || 'Unknown',
//     osVersion: `${Platform.OS} ${Platform.Version}`,
//     platform: Platform.OS,
//     location: 'Unknown', // You can integrate with location services later
//   };
// };

// // Google Sign In
// export const signInWithGoogle = async (): Promise<SocialLoginResponse> => {
//   try {
//     const request = new AuthSession.AuthRequest({
//       clientId: GOOGLE_CLIENT_ID,
//       scopes: ['openid', 'profile', 'email'],
//       redirectUri: GOOGLE_REDIRECT_URI,
//       responseType: AuthSession.ResponseType.Code,
//       extraParams: {
//         access_type: 'offline',
//       },
//     });

//     const result = await request.promptAsync({
//       authorizationEndpoint: 'https://accounts.google.com/oauth/authorize',
//     });

//     if (result.type === 'success' && result.params.code) {
//       // Exchange code for tokens
//       const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           code: result.params.code,
//           client_id: GOOGLE_CLIENT_ID,
//           redirect_uri: GOOGLE_REDIRECT_URI,
//           grant_type: 'authorization_code',
//         }).toString(),
//       });

//       const tokenData = await tokenResponse.json();

//       if (tokenData.access_token) {
//         // Get user info
//         const userInfoResponse = await fetch(
//           `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenData.access_token}`
//         );
//         const userInfo = await userInfoResponse.json();

//         // Send to your API
//         return await sendSocialLoginToAPI({
//           email: userInfo.email,
//           loginType: 'gmail',
//           firstname: userInfo.given_name || '',
//           lastname: userInfo.family_name || '',
//           image_url: userInfo.picture || '',
//           ...getDeviceInfo(),
//           referral_id: '',
//         });
//       }
//     }

//     return {
//       success: false,
//       message: 'Google sign in was cancelled or failed',
//     };
//   } catch (error) {
//     console.error('Google sign in error:', error);
//     return {
//       success: false,
//       message: 'Google sign in failed. Please try again.',
//     };
//   }
// };

// // Facebook Sign In
// export const signInWithFacebook = async (): Promise<SocialLoginResponse> => {
//   try {
//     const request = new AuthSession.AuthRequest({
//       clientId: FACEBOOK_APP_ID,
//       scopes: ['public_profile', 'email'],
//       redirectUri: FACEBOOK_REDIRECT_URI,
//       responseType: AuthSession.ResponseType.Code,
//     });

//     const result = await request.promptAsync({
//       authorizationEndpoint: 'https://www.facebook.com/v18.0/dialog/oauth',
//     });

//     if (result.type === 'success' && result.params.code) {
//       // Exchange code for access token
//       const tokenResponse = await fetch('https://graph.facebook.com/v18.0/oauth/access_token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: new URLSearchParams({
//           client_id: FACEBOOK_APP_ID,
//           redirect_uri: FACEBOOK_REDIRECT_URI,
//           code: result.params.code,
//         }).toString(),
//       });

//       const tokenData = await tokenResponse.json();

//       if (tokenData.access_token) {
//         // Get user info
//         const userInfoResponse = await fetch(
//           `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${tokenData.access_token}`
//         );
//         const userInfo = await userInfoResponse.json();

//         // Parse name into first and last name
//         const nameParts = userInfo.name ? userInfo.name.split(' ') : ['', ''];
//         const firstname = nameParts[0] || '';
//         const lastname = nameParts.slice(1).join(' ') || '';

//         // Send to your API
//         return await sendSocialLoginToAPI({
//           email: userInfo.email || '',
//           loginType: 'facebook',
//           firstname,
//           lastname,
//           image_url: userInfo.picture?.data?.url || '',
//           ...getDeviceInfo(),
//           referral_id: '',
//         });
//       }
//     }

//     return {
//       success: false,
//       message: 'Facebook sign in was cancelled or failed',
//     };
//   } catch (error) {
//     console.error('Facebook sign in error:', error);
//     return {
//       success: false,
//       message: 'Facebook sign in failed. Please try again.',
//     };
//   }
// };

// // Send social login data to your API
// const sendSocialLoginToAPI = async (userData: any): Promise<SocialLoginResponse> => {
//   try {
//     const response = await fetch(`${config.API_URL}/userlogin`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userData),
//     });

//     const data = await response.json();

//     if (data.status === 200) {
//       // Save authentication data
//       await AsyncStorage.setItem('jwtToken', data.jwtToken);
//       await AsyncStorage.setItem('userId', data.user.id);
//       await AsyncStorage.setItem('isLoggedIn', 'true');

//       return {
//         success: true,
//         message: 'Login successful',
//         user: data.user,
//         jwtToken: data.jwtToken,
//       };
//     } else {
//       return {
//         success: false,
//         message: data.message || 'Login failed',
//       };
//     }
//   } catch (error) {
//     console.error('API error:', error);
//     return {
//       success: false,
//       message: 'Network error. Please try again.',
//     };
//   }
// };
