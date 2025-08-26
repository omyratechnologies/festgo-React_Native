# 🚀 FestGo iOS App Store Submission Checklist

## ✅ Pre-Submission Checklist

### 1. Apple Developer Account
- [ ] Enrolled in Apple Developer Program ($99/year)
- [ ] Have access to App Store Connect
- [ ] Team ID noted down

### 2. App Configuration
- [x] Bundle identifier: `com.festgo.app`
- [x] Version: `1.0.0`
- [x] Build number: `1`
- [x] Required permissions configured
- [x] Usage descriptions added
- [x] App icon (1024x1024px)
- [x] Splash screen configured

### 3. Legal Requirements
- [ ] Privacy Policy URL: `https://festgo.in/privacy-policy`
- [ ] Terms of Service URL: `https://festgo.in/terms-of-service`
- [ ] Data collection declaration completed
- [ ] GDPR compliance (if serving EU users)

### 4. App Store Assets
- [ ] Screenshots for iPhone 6.7" (1290x2796px) - 5 screenshots
- [ ] Screenshots for iPhone 6.5" (1242x2688px) - 5 screenshots
- [ ] Screenshots for iPhone 5.5" (1242x2208px) - 5 screenshots
- [ ] Screenshots for iPad Pro 12.9" (2048x2732px) - 5 screenshots
- [ ] App preview video (optional, 30 seconds max)

### 5. App Store Metadata
- [ ] App name: "FestGo"
- [ ] Subtitle: "Your Festival Companion"
- [ ] Keywords: "festival,events,hotels,booking,travel"
- [ ] Description (4000 characters max)
- [ ] Categories: Travel (Primary), Entertainment (Secondary)
- [ ] Age rating: 4+
- [ ] Contact information
- [ ] Demo account credentials

### 6. Technical Testing
- [ ] App launches successfully
- [ ] All core features work
- [ ] Payment flows tested
- [ ] Location services work
- [ ] Camera/photo access works
- [ ] Push notifications work
- [ ] Offline functionality tested
- [ ] Performance optimized
- [ ] No crashes or bugs

### 7. Build & Submit
- [ ] EAS CLI installed: `npm install -g @expo/eas-cli`
- [ ] Logged into Expo: `eas login`
- [ ] EAS project configured: `eas build:configure`
- [ ] Production build created: `npm run build:ios`
- [ ] Build successful and downloaded
- [ ] App submitted to App Store Connect: `npm run submit:ios`

## 📋 App Store Connect Setup

### 1. Create App
- [ ] Go to https://appstoreconnect.apple.com
- [ ] Click "My Apps" → "+" → "New App"
- [ ] Platform: iOS
- [ ] Name: FestGo
- [ ] Primary Language: English
- [ ] Bundle ID: com.festgo.app
- [ ] SKU: festgo-ios
- [ ] User Access: Full Access

### 2. App Information
- [ ] App name: FestGo
- [ ] Subtitle: Your Festival Companion
- [ ] Keywords: festival,events,hotels,booking,travel
- [ ] Description: [See guide for full description]
- [ ] Categories: Travel, Entertainment
- [ ] Age Rating: 4+
- [ ] Copyright: © 2024 FestGo

### 3. App Review Information
- [ ] Contact Information: [Your details]
- [ ] Demo Account: [Test credentials]
- [ ] Notes: [Any special instructions]

### 4. App Privacy
- [ ] Data Collection: Declare all data collected
- [ ] Privacy Policy URL: https://festgo.in/privacy-policy
- [ ] Data Usage: Transparent about usage

## 🔧 Build Commands

```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure EAS project
eas build:configure

# Build for iOS
npm run build:ios

# Submit to App Store
npm run submit:ios

# Generate screenshot guide
npm run screenshots
```

## 📱 Screenshot Requirements

### iPhone 6.7" (1290x2796px)
- [ ] Home screen
- [ ] Hotel booking
- [ ] Events page
- [ ] Beach fest
- [ ] Profile screen

### iPhone 6.5" (1242x2688px)
- [ ] Home screen
- [ ] Hotel booking
- [ ] Events page
- [ ] Beach fest
- [ ] Profile screen

### iPhone 5.5" (1242x2208px)
- [ ] Home screen
- [ ] Hotel booking
- [ ] Events page
- [ ] Beach fest
- [ ] Profile screen

### iPad Pro 12.9" (2048x2732px)
- [ ] Home screen
- [ ] Hotel booking
- [ ] Events page
- [ ] Beach fest
- [ ] Profile screen

## 🎯 Key Features to Showcase

### Primary Features (Must Show)
- [ ] Hotel & Resort Booking
- [ ] Event Discovery
- [ ] Beach Festivals
- [ ] User Profile & Bookings

### Secondary Features (Nice to Show)
- [ ] Payment Processing
- [ ] Location Services
- [ ] Real-time Notifications
- [ ] User Reviews

## ⚠️ Common Rejection Reasons

### Technical Issues
- [ ] App crashes on launch
- [ ] Broken functionality
- [ ] Poor performance
- [ ] Missing required permissions

### Content Issues
- [ ] Inappropriate content
- [ ] Copyright violations
- [ ] Misleading information
- [ ] Incomplete app

### Policy Issues
- [ ] Missing privacy policy
- [ ] Unclear data usage
- [ ] Violation of guidelines
- [ ] Inappropriate age rating

## 📞 Support Resources

### Official Documentation
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo Documentation](https://docs.expo.dev/)

### Community Support
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [Apple Developer Forums](https://developer.apple.com/forums/)

## 🚀 Timeline

### Week 1: Preparation
- [ ] Set up Apple Developer account
- [ ] Prepare assets and metadata
- [ ] Configure build system
- [ ] Test app thoroughly

### Week 2: Building & Testing
- [ ] Create production build
- [ ] Test on multiple devices
- [ ] Fix any issues
- [ ] Generate screenshots

### Week 3: Submission
- [ ] Submit to App Store Connect
- [ ] Configure listing
- [ ] Submit for review
- [ ] Monitor review status

### Week 4: Review & Launch
- [ ] App review process
- [ ] Address any issues
- [ ] App goes live
- [ ] Monitor for issues

## 💰 Cost Breakdown

### Required Costs
- Apple Developer Program: $99/year
- **Total Required**: $99/year

### Optional Costs
- App Store Optimization Tools: $50-200/month
- Analytics Services: $0-100/month
- Crash Reporting: $0-50/month

## 🎉 Success Checklist

### Before Submission
- [ ] All checkboxes above completed
- [ ] App thoroughly tested
- [ ] All assets prepared
- [ ] Legal documents ready

### After Submission
- [ ] Review status monitored
- [ ] Respond to reviewer questions
- [ ] Address any rejections
- [ ] App approved and live

### Post-Launch
- [ ] Monitor app performance
- [ ] Respond to user reviews
- [ ] Plan for updates
- [ ] Track analytics

---

**Good luck with your App Store submission! 🚀**

Remember: The review process can take 24-48 hours, and rejections are common. Don't get discouraged - just fix the issues and resubmit!
