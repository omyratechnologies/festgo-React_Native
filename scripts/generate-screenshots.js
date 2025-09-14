#!/usr/bin/env node

/**
 * Screenshot Generation Script for FestGo App Store Submission
 * 
 * This script helps you generate the required screenshots for iOS App Store submission.
 * Run this script after testing your app thoroughly.
 */

const fs = require('fs');
const path = require('path');

// Screenshot requirements for iOS App Store
const SCREENSHOT_REQUIREMENTS = {
  'iPhone 6.7"': {
    width: 1290,
    height: 2796,
    device: 'iPhone 14 Pro Max',
    count: 5
  },
  'iPhone 6.5"': {
    width: 1242,
    height: 2688,
    device: 'iPhone 14 Plus',
    count: 5
  },
  'iPhone 5.5"': {
    width: 1242,
    height: 2208,
    device: 'iPhone 8 Plus',
    count: 5
  },
};

// Key screens to capture
const KEY_SCREENS = [
  {
    name: 'home',
    description: 'Home Screen - Main dashboard with services',
    priority: 1
  },
  {
    name: 'hotel-booking',
    description: 'Hotel Booking - Search and booking interface',
    priority: 1
  },
  {
    name: 'events',
    description: 'Events Page - Festival and event listings',
    priority: 1
  },
  {
    name: 'beach-fest',
    description: 'Beach Fest - Beach festival details',
    priority: 2
  },
  {
    name: 'profile',
    description: 'Profile Screen - User profile and bookings',
    priority: 2
  },
  {
    name: 'booking-success',
    description: 'Booking Success - Confirmation screen',
    priority: 3
  },
  {
    name: 'payment',
    description: 'Payment Screen - Payment processing',
    priority: 3
  }
];

console.log('🎯 FestGo App Store Screenshot Generator');
console.log('=====================================\n');

console.log('📱 Required Screenshots:');
Object.entries(SCREENSHOT_REQUIREMENTS).forEach(([device, specs]) => {
  console.log(`   ${device}: ${specs.width}x${specs.height} (${specs.count} screenshots)`);
});

console.log('\n📸 Key Screens to Capture:');
KEY_SCREENS.forEach(screen => {
  console.log(`   ${screen.priority === 1 ? '🔥' : screen.priority === 2 ? '⚡' : '💡'} ${screen.name}: ${screen.description}`);
});

console.log('\n📋 Instructions:');
console.log('1. Test your app thoroughly on all target devices');
console.log('2. Take screenshots of the key screens listed above');
console.log('3. Ensure screenshots are high quality and showcase your app\'s best features');
console.log('4. Save screenshots in the correct dimensions for each device');
console.log('5. Upload screenshots to App Store Connect');

console.log('\n🎨 Screenshot Tips:');
console.log('• Use real data, not placeholder content');
console.log('• Show the app in its best light');
console.log('• Include screenshots that demonstrate core functionality');
console.log('• Ensure text is readable and UI elements are clear');
console.log('• Avoid showing personal information or sensitive data');

console.log('\n📁 Create these folders for organization:');
const folders = [
  'screenshots/iphone-6-7',
  'screenshots/iphone-6-5', 
  'screenshots/iphone-5-5',
];

folders.forEach(folder => {
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
    console.log(`   ✅ Created: ${folder}`);
  } else {
    console.log(`   📁 Exists: ${folder}`);
  }
});

console.log('\n🚀 Next Steps:');
console.log('1. Set up Apple Developer account ($99/year)');
console.log('2. Create app in App Store Connect');
console.log('3. Generate screenshots using this guide');
console.log('4. Build app with EAS: eas build --platform ios --profile production');
console.log('5. Submit to App Store Connect');
console.log('6. Configure app metadata and description');
console.log('7. Submit for review');

console.log('\n📞 Support:');
console.log('• Apple Developer Documentation: https://developer.apple.com/documentation/');
console.log('• App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/');
console.log('• Expo Documentation: https://docs.expo.dev/');

console.log('\n✨ Good luck with your App Store submission!');
