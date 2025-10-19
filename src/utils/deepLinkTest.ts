import * as Linking from 'expo-linking';

// Test function to simulate deep link
export const testEmailVerificationLink = () => {
  const testToken = '952df66120b62e055f6d4889c32a2087582100ad637ef5bc83126d6553d07969';
  const testUrl = `https://www.festgo.in/verify?token=${testToken}`;
  
  console.log('Testing deep link:', testUrl);
  
  // This would normally be triggered by clicking the email link
  // For testing purposes, you can call this function
  Linking.openURL(testUrl);
};

// Function to generate test email verification URL
export const generateEmailVerificationUrl = (token: string) => {
  return `https://www.festgo.in/verify?token=${token}`;
};

// Function to parse token from URL
export const parseTokenFromUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('token');
  } catch (error) {
    console.error('Error parsing URL:', error);
    return null;
  }
};

// Enhanced URL parsing with fallback
export const parseTokenFromUrlEnhanced = (url: string): string | null => {
  try {
    // First try proper URL parsing
    const urlObj = new URL(url);
    const token = urlObj.searchParams.get('token');
    if (token) {
      return decodeURIComponent(token);
    }
  } catch (error) {
    console.log('URL parsing failed, trying regex fallback');
  }
  
  // Fallback to regex parsing
  const tokenMatch = url.match(/token=([^&]+)/);
  if (tokenMatch && tokenMatch[1]) {
    return decodeURIComponent(tokenMatch[1]);
  }
  
  return null;
};

// Debug function to log deep link information
export const debugDeepLink = (url: string) => {
  // console.log('=== Deep Link Debug Info ===');
  // console.log('Original URL:', url);
  // console.log('Contains /verify:', url.includes('/verify'));
  // console.log('Contains token=:', url.includes('token='));
  
  const token = parseTokenFromUrlEnhanced(url);
  // console.log('Extracted token:', token);
  // console.log('Token length:', token ? token.length : 0);
  // console.log('============================');
  
  return token;
};
