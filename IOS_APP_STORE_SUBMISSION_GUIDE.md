# iOS App Store Submission Guide for FestGo

## Prerequisites

### 1. Apple Developer Account
- **Cost**: $99/year
- **Required**: Yes, mandatory for App Store submission
- **Sign up**: https://developer.apple.com/programs/

### 2. App Store Connect Access
- Access to App Store Connect (https://appstoreconnect.apple.com)
- Admin or App Manager role for your app

### 3. Development Environment
- macOS (required for iOS development)
- Xcode (latest version recommended)
- Expo CLI and EAS CLI installed

## Step-by-Step Process

### Step 1: Prepare Your App

#### 1.1 Update Configuration Files
✅ **COMPLETED**: Updated `app.json` with:
- iOS bundle identifier: `com.festgo.app`
- Required permissions and usage descriptions
- App metadata and URLs
- Build configuration

✅ **COMPLETED**: Created `eas.json` for build configuration

#### 1.2 Required Assets
Create the following assets in the correct sizes:

**App Icon** (already exists):
- 1024x1024px (App Store)
- 180x180px (iPhone)
- 167x167px (iPad)

**Screenshots** (you need to create these):
- iPhone 6.7" (1290x2796px): 3-5 screenshots
- iPhone 6.5" (1242x2688px): 3-5 screenshots  
- iPhone 5.5" (1242x2208px): 3-5 screenshots
- iPad Pro 12.9" (2048x2732px): 3-5 screenshots

**App Preview Videos** (optional but recommended):
- 30 seconds max
- 1920x1080px resolution
- MP4 format

### Step 2: Set Up EAS Build

#### 2.1 Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

#### 2.2 Login to Expo
```bash
eas login
```

#### 2.3 Configure EAS Project
```bash
eas build:configure
```

#### 2.4 Update Configuration
Replace placeholders in `eas.json`:
- `[YOUR_APPLE_ID]`: Your Apple ID email
- `[YOUR_APP_STORE_CONNECT_APP_ID]`: App Store Connect App ID
- `[YOUR_APPLE_TEAM_ID]`: Your Apple Developer Team ID

### Step 3: Create App Store Connect App

#### 3.1 Access App Store Connect
1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple Developer account
3. Click "My Apps"

#### 3.2 Create New App
1. Click the "+" button
2. Select "New App"
3. Fill in the details:
   - **Platforms**: iOS
   - **Name**: FestGo
   - **Primary Language**: English
   - **Bundle ID**: com.festgo.app
   - **SKU**: festgo-ios (unique identifier)
   - **User Access**: Full Access

#### 3.3 Get App Information
- Note down the **App ID** (you'll need this for EAS configuration)
- Note down the **Apple Team ID** (found in your developer account)

### Step 4: Build Your App

#### 4.1 Create Production Build
```bash
eas build --platform ios --profile production
```

#### 4.2 Monitor Build Progress
- The build will take 10-20 minutes
- You can monitor progress in the terminal or EAS dashboard
- Build will be available for download when complete

### Step 5: Submit to App Store Connect

#### 5.1 Submit Build
```bash
eas submit --platform ios --profile production
```

#### 5.2 Alternative: Manual Upload
If automatic submission fails:
1. Download the `.ipa` file from EAS
2. Use Xcode or Application Loader to upload
3. Or use Transporter app (recommended)

### Step 6: Configure App Store Listing

#### 6.1 App Information
In App Store Connect, fill in:

**App Information**:
- **Name**: FestGo
- **Subtitle**: Your Festival Companion
- **Keywords**: festival,events,hotels,booking,travel
- **Description**: 
```
FestGo is your ultimate festival companion app. Discover and book hotels, resorts, and events for the best festivals around the world.

Features:
• Hotel & Resort Bookings
• Event Discovery & Booking
• Beach Festivals
• City Festivals
• Secure Payment Processing
• Real-time Notifications
• Location-based Services
• User Reviews & Ratings

Perfect for festival-goers who want to plan their entire experience in one place.
```

**Categories**:
- **Primary**: Travel
- **Secondary**: Entertainment

#### 6.2 App Review Information
- **Contact Information**: Your contact details
- **Demo Account**: Create test account credentials
- **Notes**: Any special instructions for reviewers

#### 6.3 App Privacy
- **Data Collection**: Declare what data you collect
- **Privacy Policy URL**: https://festgo.in/privacy-policy
- **Data Usage**: Be transparent about data usage

### Step 7: App Review Process

#### 7.1 Submit for Review
1. Ensure all required fields are filled
2. Upload screenshots and metadata
3. Click "Submit for Review"

#### 7.2 Review Timeline
- **Typical duration**: 24-48 hours
- **Complex apps**: Up to 1 week
- **Rejections**: Common, don't worry

#### 7.3 Common Rejection Reasons
- Missing privacy policy
- Incomplete app functionality
- Poor UI/UX
- Missing required permissions
- Inappropriate content
- Performance issues

### Step 8: Post-Submission

#### 8.1 Monitor Review Status
- Check App Store Connect regularly
- Respond to any reviewer questions promptly

#### 8.2 Handle Rejections
If rejected:
1. Read the rejection reason carefully
2. Fix the issues
3. Resubmit with explanation
4. Consider appealing if appropriate

#### 8.3 App Goes Live
Once approved:
- App will be available in App Store within 24 hours
- Monitor for any issues
- Respond to user reviews
- Plan for updates

## Required Legal Documents

### 1. Privacy Policy
**Required**: Yes
**URL**: https://festgo.in/privacy-policy
**Content**: Must cover:
- Data collection practices
- How data is used
- Third-party services
- User rights
- Contact information

### 2. Terms of Service
**Required**: Recommended
**URL**: https://festgo.in/terms-of-service
**Content**: Should cover:
- App usage terms
- User responsibilities
- Payment terms
- Dispute resolution

### 3. Data Processing Agreement
**Required**: If using third-party services
**Coverage**: GDPR compliance if serving EU users

## Technical Requirements Checklist

### ✅ App Configuration
- [x] Bundle identifier configured
- [x] Version and build numbers set
- [x] Required permissions declared
- [x] Usage descriptions provided

### ✅ Assets
- [ ] App icon (1024x1024px)
- [ ] Screenshots for all device sizes
- [ ] App preview video (optional)

### ✅ Legal
- [ ] Privacy policy URL
- [ ] Terms of service URL
- [ ] Data collection declaration

### ✅ Testing
- [ ] Test on multiple devices
- [ ] Test all core features
- [ ] Test payment flows
- [ ] Test offline functionality

### ✅ Performance
- [ ] App launch time < 3 seconds
- [ ] Smooth navigation
- [ ] No crashes
- [ ] Proper error handling

## Cost Breakdown

### Apple Developer Program
- **Annual Fee**: $99/year
- **Required**: Yes

### Additional Services (Optional)
- **App Store Optimization Tools**: $50-200/month
- **Analytics Services**: $0-100/month
- **Crash Reporting**: $0-50/month

## Timeline Estimate

### Week 1: Preparation
- Set up Apple Developer account
- Prepare assets and metadata
- Configure build system

### Week 2: Building & Testing
- Create production build
- Test thoroughly
- Fix any issues

### Week 3: Submission
- Submit to App Store Connect
- Configure listing
- Submit for review

### Week 4: Review & Launch
- App review process
- Address any issues
- App goes live

**Total Time**: 3-4 weeks

## Support Resources

### Official Documentation
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Expo Documentation](https://docs.expo.dev/)

### Community Support
- [Expo Discord](https://discord.gg/expo)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/expo)
- [Apple Developer Forums](https://developer.apple.com/forums/)

## Next Steps

1. **Immediate**: Set up Apple Developer account
2. **This Week**: Prepare screenshots and metadata
3. **Next Week**: Create production build
4. **Following Week**: Submit for review

## Important Notes

- **Backup**: Keep backups of all configurations
- **Testing**: Test thoroughly before submission
- **Patience**: Review process can take time
- **Communication**: Respond promptly to reviewer questions
- **Updates**: Plan for regular app updates

Good luck with your App Store submission! 🚀
