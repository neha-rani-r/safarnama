# Safarnama — Mobile App Build Guide

## Prerequisites
- Android Studio installed (brew install --cask android-studio)
- Xcode installed (Mac App Store, free)
- Node.js 20+

## Android APK (Free — share directly)

### First time setup
```bash
npm install
npx cap add android
```

### Every time you want to update
```bash
npm run build:apk
npx cap open android
```

### In Android Studio
1. Wait for Gradle sync to finish
2. Build → Generate Signed Bundle/APK
3. Choose APK
4. Create new keystore (first time) or use existing
5. Select release build
6. Find APK at: android/app/build/outputs/apk/release/app-release.apk
7. Share this file directly via WhatsApp, Google Drive, email

### Install on Android phone (recipients)
1. Download the APK file
2. Settings → Security → Enable "Install unknown apps"
3. Open the APK and install

## iOS (TestFlight — free, up to 10,000 testers)

### First time setup
```bash
npx cap add ios
```

### Every time
```bash
npm run deploy:mobile
npx cap open ios
```

### In Xcode
1. Sign in with Apple ID (free account works for personal testing)
2. Select your iPhone as target
3. Product → Run (installs directly on phone)
4. For TestFlight: requires $99/yr Apple Developer account
   - Archive → Distribute → TestFlight
   - Share the TestFlight link publicly

## PWA (Works right now, no setup)
Share this link — works on any phone:
https://neha-rani-r.github.io/safarnama/

iPhone: Safari → Share → Add to Home Screen
Android: Chrome → ⋮ → Add to Home Screen
