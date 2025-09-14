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
