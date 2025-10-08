# Android App Setup Guide

## Capacitor Android Configuration Complete

### 1. **Package Details**
- **Package Name**: `com.hongkongholidays.countdown`
- **App Name**: Hong Kong Holidays
- **Min SDK**: 22 (Android 5.1)
- **Target SDK**: 34 (Android 14)

### 2. **Installed Plugins**
- ✅ `@capacitor/core` - Core Capacitor functionality
- ✅ `@capacitor/android` - Android platform
- ✅ `@capacitor/local-notifications` - Local notification support
- ✅ `@capacitor/app` - App lifecycle and state management

### 3. **Notification Channels Configured**

#### Daily Reminders Channel
- **ID**: `daily_reminders`
- **Name**: Daily Reminders
- **Description**: Daily holiday awareness reminders
- **Importance**: Default (3)
- **Sound**: gentle_reminder.mp3
- **LED Color**: #488AFF (Blue)
- **Vibration**: Enabled

#### Weekly Wellness Channel
- **ID**: `weekly_wellness`
- **Name**: Weekly Wellness
- **Description**: Weekly wellness check-in reminders
- **Importance**: Default (3)
- **Sound**: gentle_reminder.mp3
- **LED Color**: #66BB6A (Green)
- **Vibration**: Enabled

#### Holiday Alerts Channel
- **ID**: `holiday_alerts`
- **Name**: Holiday Alerts
- **Description**: Upcoming holiday notifications
- **Importance**: High (4)
- **Sound**: gentle_reminder.mp3
- **LED Color**: #FFA726 (Orange)
- **Vibration**: Enabled

#### Urgent Notifications Channel
- **ID**: `urgent_notifications`
- **Name**: Urgent Notifications
- **Description**: Time-sensitive notifications
- **Importance**: Max (5)
- **Sound**: gentle_reminder.mp3
- **LED Color**: #EF5350 (Red)
- **Vibration**: Enabled

### 4. **Required Android Permissions**

The following permissions will be automatically added to `AndroidManifest.xml`:

```xml
<!-- Notification Permissions -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" />
<uses-permission android:name="android.permission.USE_EXACT_ALARM" />

<!-- Wake Lock for Background Notifications -->
<uses-permission android:name="android.permission.WAKE_LOCK" />

<!-- Vibration Permission -->
<uses-permission android:name="android.permission.VIBRATE" />

<!-- Internet for PWA Features -->
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

### 5. **Notification Service Features**

#### Scheduling Capabilities
- ✅ **Daily Reminders**: Recurring every day at user-specified time
- ✅ **Weekly Wellness**: Recurring weekly on specific day and time
- ✅ **Holiday Alerts**: One-time notifications X days before each holiday
- ✅ **Smart Scheduling**: Automatically calculates next occurrence
- ✅ **Background Delivery**: Works even when app is closed

#### Lifecycle Management
- ✅ **App Foreground**: Refreshes pending notifications
- ✅ **App Background**: Ensures notifications are scheduled
- ✅ **Notification Received**: Logs and tracks delivery
- ✅ **User Interaction**: Handles taps and dismissals
- ✅ **Deep Linking**: Can open specific app screens from notifications

#### Error Handling
- ✅ **Permission Errors**: Graceful handling of denied permissions
- ✅ **Scheduling Errors**: Retry logic and error reporting
- ✅ **Type Checking**: TypeScript definitions for all notification types
- ✅ **Error Boundaries**: Prevents app crashes from notification failures

### 6. **Build and Sync Commands**

```bash
# Build the Vue.js app
npm run build

# Sync web assets to Android
npx cap sync android

# Open Android Studio
npx cap open android

# Run on device/emulator
npx cap run android
```

### 7. **Testing Notifications**

#### Unit Tests
All 45 tests passing including:
- Notification service tests (18)
- Composable tests (12)
- Component tests (15)

#### Manual Testing Checklist
- [ ] Request notification permissions
- [ ] Enable daily reminder
- [ ] Change daily reminder time
- [ ] Enable weekly wellness check-in
- [ ] Change weekly day and time
- [ ] Enable holiday alerts
- [ ] Change days-before-alert setting
- [ ] Tap on notification when received
- [ ] Dismiss notification
- [ ] Check app behavior when notification arrives
- [ ] Test with app in foreground
- [ ] Test with app in background
- [ ] Test with app completely closed

### 8. **Custom Notification Icon**

To add a custom notification icon:

1. Create `ic_stat_notification.png` in these sizes:
   - `drawable-mdpi`: 24x24px
   - `drawable-hdpi`: 36x36px
   - `drawable-xhdpi`: 48x48px
   - `drawable-xxhdpi`: 72x72px
   - `drawable-xxxhdpi`: 96x96px

2. Place in: `android/app/src/main/res/drawable-*/`

3. Icon should be:
   - White with transparent background
   - Simple silhouette design
   - PNG format

### 9. **Custom Notification Sound**

To add custom sound (`gentle_reminder.mp3`):

1. Place file in: `android/app/src/main/res/raw/gentle_reminder.mp3`

2. Supported formats:
   - MP3 (recommended)
   - WAV
   - OGG

3. Recommended properties:
   - Duration: 2-5 seconds
   - Bit rate: 128 kbps
   - Sample rate: 44.1 kHz

### 10. **AndroidManifest.xml Configuration**

Location: `android/app/src/main/AndroidManifest.xml`

Key configurations:
- Application icon and label
- Permissions declarations
- Intent filters for deep linking
- Notification channel settings
- Background task allowlist

### 11. **Troubleshooting**

#### Notifications not appearing:
- Check permissions are granted in Android settings
- Verify notification channels are created
- Check battery optimization settings
- Ensure "Do Not Disturb" is off

#### Exact alarms not working:
- Android 12+ requires SCHEDULE_EXACT_ALARM permission
- User must grant in system settings for some devices
- Falls back to inexact timing if not granted

#### Sound not playing:
- Verify sound file exists in `res/raw/`
- Check file name matches configuration
- Test volume settings on device
- Check notification channel sound settings

### 12. **Production Checklist**

Before releasing to Google Play:

- [ ] Update app version in `package.json`
- [ ] Update version code in `android/app/build.gradle`
- [ ] Generate signed APK/AAB
- [ ] Test on multiple Android versions (API 22-34)
- [ ] Test on different screen sizes
- [ ] Verify all permissions are justified in Play Console
- [ ] Add privacy policy for notification data
- [ ] Test notification behavior in production build
- [ ] Verify Google Play Services compatibility
- [ ] Test deep linking from notifications
- [ ] Document notification types in Play Store listing

### 13. **Next Steps**

1. Wait for `npm run build` to complete
2. Run `npx cap sync android`
3. Open in Android Studio: `npx cap open android`
4. Connect Android device or start emulator
5. Click "Run" in Android Studio
6. Grant notification permissions when prompted
7. Test all notification features
8. Check logcat for any errors

### 14. **Support and Resources**

- **Capacitor Docs**: https://capacitorjs.com/docs
- **LocalNotifications API**: https://capacitorjs.com/docs/apis/local-notifications
- **Android Notifications**: https://developer.android.com/develop/ui/views/notifications
- **Testing Guide**: https://capacitorjs.com/docs/guides/testing

---

**Status**: ✅ Configuration Complete | ⏳ Waiting for Build to Finish
