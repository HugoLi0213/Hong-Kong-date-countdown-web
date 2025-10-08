# Android App Testing Guide

## Complete Testing Strategy for Hong Kong Holidays Android App

### 🎯 Testing Overview

This guide covers all aspects of testing the Capacitor Android app, including unit tests, integration tests, and manual testing procedures.

---

## 1. Unit Tests (Automated)

### Current Test Suite Status
✅ **All 45 tests passing**

#### Test Breakdown:
- **notificationService.test.ts**: 18/18 tests
- **useNotifications.test.ts**: 12/12 tests  
- **notificationSettings.test.ts**: 15/15 tests

### Running Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- notificationService.test.ts
```

### Test Coverage Goals
- **Target**: 80%+ code coverage
- **Critical paths**: 100% coverage for notification scheduling
- **Edge cases**: Permission denied, network errors, invalid dates

---

## 2. Integration Tests

### Notification Service Integration

#### Test: Permission Flow
```typescript
describe('Notification Permission Integration', () => {
  it('should request permissions and schedule notifications', async () => {
    // 1. Check initial permission state
    const initial = await notificationService.checkPermissions();
    expect(initial.granted).toBe(false);
    
    // 2. Request permissions
    const granted = await notificationService.requestPermissions();
    expect(granted).toBe(true);
    
    // 3. Schedule notifications
    await notificationService.scheduleDailyReminder(9, 0);
    
    // 4. Verify pending notifications
    const pending = await notificationService.getPendingNotifications();
    expect(pending.length).toBeGreaterThan(0);
  });
});
```

#### Test: Lifecycle Management
```typescript
describe('App Lifecycle Integration', () => {
  it('should maintain notifications across app states', async () => {
    // 1. Schedule notifications
    await scheduleAllNotifications();
    
    // 2. Simulate app going to background
    App.emit('appStateChange', { isActive: false });
    
    // 3. Verify notifications persist
    const pending = await getPendingNotifications();
    expect(pending.length).toBe(expectedCount);
    
    // 4. Simulate app returning to foreground
    App.emit('appStateChange', { isActive: true });
    
    // 5. Verify notifications are still valid
    const updated = await getPendingNotifications();
    expect(updated.length).toBe(expectedCount);
  });
});
```

---

## 3. Manual Testing Checklist

### 📱 Device Requirements
- [ ] Android 5.1+ (API 22+)
- [ ] Physical device (recommended) or emulator
- [ ] Notifications enabled in system settings
- [ ] Internet connection for initial setup

### ✅ Pre-Testing Setup
1. [ ] Build app: `npm run build`
2. [ ] Sync to Android: `npx cap sync android`
3. [ ] Open in Android Studio: `npx cap open android`
4. [ ] Install on device/emulator
5. [ ] Grant notification permissions

---

### Test Case 1: Permission Request
**Priority**: Critical

**Steps**:
1. Open app for first time
2. Observe permission request dialog
3. Tap "Enable Notifications"
4. Grant permission in system dialog

**Expected**:
- ✅ Friendly explanation of why permissions needed
- ✅ System dialog appears
- ✅ Permission granted successfully
- ✅ Success message displayed

**Failure Cases**:
- [ ] Test permission denial
- [ ] Test "Don't ask again" scenario
- [ ] Test navigating to settings to grant later

---

### Test Case 2: Daily Reminder
**Priority**: Critical

**Steps**:
1. Enable "Daily Holiday Reminder" toggle
2. Select time (e.g., 9:00 AM)
3. Wait for confirmation message
4. Check system notification settings
5. Wait until scheduled time (or use time travel in emulator)

**Expected**:
- ✅ Toggle animates smoothly
- ✅ Time picker appears
- ✅ "Settings saved" message shows
- ✅ Notification appears at scheduled time
- ✅ Notification shows correct icon and color
- ✅ Tapping notification opens app

**Android-Specific Checks**:
- [ ] Notification uses "daily_reminders" channel
- [ ] Sound plays (gentle_reminder.mp3)
- [ ] Vibration works
- [ ] LED color is #488AFF (blue)
- [ ] Works when device is locked
- [ ] Works when app is closed
- [ ] Works after device restart

---

### Test Case 3: Weekly Wellness
**Priority**: High

**Steps**:
1. Enable "Weekly Wellness Check-in" toggle
2. Select day (e.g., Sunday)
3. Select time (e.g., 8:00 PM)
4. Verify settings saved
5. Wait for scheduled day/time

**Expected**:
- ✅ Settings persist after app restart
- ✅ Notification appears on correct day and time
- ✅ Notification has green indicator (#66BB6A)
- ✅ Can reschedule to different day/time
- ✅ Disabling toggle cancels future notifications

---

### Test Case 4: Holiday Alerts
**Priority**: High

**Steps**:
1. Enable "Holiday Alerts" toggle
2. Set days-before (e.g., 3 days)
3. Check upcoming holidays list
4. Wait for alert time

**Expected**:
- ✅ Alerts scheduled for all upcoming holidays
- ✅ Notification appears 3 days before holiday
- ✅ Notification shows holiday name and date
- ✅ Orange indicator color (#FFA726)
- ✅ Multiple holidays create multiple notifications
- ✅ Past holidays don't create notifications

---

### Test Case 5: Settings Persistence
**Priority**: High

**Steps**:
1. Configure all notification settings
2. Close app completely
3. Reopen app
4. Check settings UI

**Expected**:
- ✅ All toggles in correct state
- ✅ All times preserved
- ✅ Pending notifications still scheduled

---

### Test Case 6: Reset Functionality
**Priority**: Medium

**Steps**:
1. Enable all notifications with custom times
2. Tap "Reset" button
3. Confirm reset dialog

**Expected**:
- ✅ Confirmation dialog appears
- ✅ Canceling dialog does nothing
- ✅ Confirming resets all settings
- ✅ All notifications disabled
- ✅ Times return to defaults (Daily: 9:00, Weekly: Sunday 8:00 PM, Holiday: 3 days)
- ✅ Pending notifications cancelled

---

### Test Case 7: App Lifecycle
**Priority**: Critical

**Scenario A: App in Background**
1. Enable notifications
2. Press Home button (app to background)
3. Wait for notification time

**Expected**:
- ✅ Notifications still delivered
- ✅ Tapping notification brings app to foreground

**Scenario B: App Force Closed**
1. Enable notifications
2. Force stop app in system settings
3. Wait for notification time

**Expected**:
- ✅ Notifications still delivered
- ✅ App state preserved when reopened

**Scenario C: Device Restart**
1. Enable notifications
2. Restart device
3. Wait for notification time (without opening app)

**Expected**:
- ✅ Notifications rescheduled after boot
- ✅ All settings preserved

---

### Test Case 8: Notification Interactions
**Priority**: High

**Actions to Test**:
1. **Tap notification**: Opens app
2. **Swipe away**: Dismisses notification
3. **Expand notification**: Shows full message
4. **Long press**: Shows notification settings

**Expected**:
- ✅ Tap opens app to main screen
- ✅ Swipe dismisses without errors
- ✅ Expanded view shows complete message
- ✅ Long press shows channel settings
- ✅ Can block notifications from channel settings

---

### Test Case 9: Error Handling
**Priority**: High

**Scenarios to Test**:
1. **Permission Denied**:
   - Deny notification permission
   - Check UI shows appropriate message
   - Verify button to open system settings

2. **Battery Optimization**:
   - Enable battery optimization for app
   - Check if notifications are delayed
   - Verify app suggests disabling optimization

3. **Do Not Disturb**:
   - Enable Do Not Disturb mode
   - Check notification behavior
   - Verify notifications appear after DND ends

4. **Storage Full**:
   - Fill device storage
   - Try to save settings
   - Verify graceful error handling

---

### Test Case 10: Accessibility
**Priority**: Medium

**Checks**:
- [ ] TalkBack screen reader support
- [ ] All interactive elements have content descriptions
- [ ] Color contrast meets WCAG AA standards
- [ ] Touch targets are minimum 48x48dp
- [ ] Can navigate entirely with keyboard
- [ ] Focus order is logical
- [ ] No keyboard traps

---

## 4. Performance Testing

### Battery Usage
```bash
# Monitor battery usage
adb shell dumpsys batterystats
```

**Acceptable Thresholds**:
- [ ] Background battery drain < 1% per hour
- [ ] Foreground battery usage reasonable
- [ ] No wakelocks preventing sleep

### Memory Usage
```bash
# Monitor memory
adb shell dumpsys meminfo com.hongkongholidays.countdown
```

**Targets**:
- [ ] Heap usage < 50MB in background
- [ ] No memory leaks during long sessions
- [ ] Garbage collection not excessive

### Notification Delivery Time
**Targets**:
- [ ] Notification appears within 5 seconds of scheduled time
- [ ] No missed notifications
- [ ] Recurring notifications maintain accuracy

---

## 5. Compatibility Testing

### Android Versions to Test
- [ ] Android 5.1 (API 22) - Minimum supported
- [ ] Android 8.0 (API 26) - Notification channels introduced
- [ ] Android 10 (API 29) - Background restrictions
- [ ] Android 12 (API 31) - Exact alarm restrictions
- [ ] Android 13 (API 33) - Notification permission runtime
- [ ] Android 14 (API 34) - Latest version

### Device Manufacturers
- [ ] Samsung (One UI)
- [ ] Google Pixel (Stock Android)
- [ ] Xiaomi (MIUI)
- [ ] Huawei/Honor (EMUI)
- [ ] OnePlus (OxygenOS)

**Known Issues**:
- MIUI: Aggressive battery optimization
- EMUI: Requires manual autostart permission
- Samsung: May need "Allow in background" setting

---

## 6. Regression Testing

Before each release, verify:

- [ ] All 45 unit tests pass
- [ ] Build completes without errors
- [ ] APK size is reasonable (< 10MB)
- [ ] App opens without crash
- [ ] All 10 manual test cases pass
- [ ] No new ANR (Application Not Responding) issues
- [ ] No memory leaks
- [ ] Notifications work on all test devices
- [ ] Settings persist correctly
- [ ] No UI glitches or rendering issues

---

## 7. Test Automation

### Run Full Test Suite
```bash
# Step 1: Unit tests
npm test

# Step 2: Build app
npm run build

# Step 3: Sync to Android
npx cap sync android

# Step 4: Build APK
cd android && ./gradlew assembleDebug

# Step 5: Install on device
adb install -r app/build/outputs/apk/debug/app-debug.apk

# Step 6: Launch app
adb shell am start -n com.hongkongholidays.countdown/.MainActivity

# Step 7: Grant permissions
adb shell pm grant com.hongkongholidays.countdown android.permission.POST_NOTIFICATIONS
```

---

## 8. Bug Reporting Template

When issues are found:

```markdown
**Bug Title**: [Short description]

**Severity**: Critical / High / Medium / Low

**Environment**:
- Device: [Manufacturer Model]
- Android Version: [Version Number]
- App Version: [Version from package.json]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happened]

**Screenshots/Logs**:
[Attach screenshots or logcat output]

**Workaround**:
[If any]
```

---

## 9. Test Results Documentation

### Test Run Log
```
Date: [Date]
Tester: [Name]
Build Version: [Version]
Device: [Device Info]

Test Cases Passed: X/45
Test Cases Failed: Y/45
Test Cases Blocked: Z/45

Critical Issues Found: N
High Priority Issues: M
Medium Priority Issues: L
Low Priority Issues: K

Overall Status: ✅ Pass / ❌ Fail / ⚠️ Conditional Pass
```

---

## 10. Testing Commands Reference

```bash
# View app logs
adb logcat | grep "Capacitor"

# View notification logs
adb logcat | grep "NotificationService"

# Clear app data
adb shell pm clear com.hongkongholidays.countdown

# Force stop app
adb shell am force-stop com.hongkongholidays.countdown

# Check notification permissions
adb shell dumpsys notification

# Test notification at specific time
adb shell date [MMDDhhmm[[CC]YY][.ss]]

# Take screenshot
adb shell screencap /sdcard/screen.png
adb pull /sdcard/screen.png

# Record video
adb shell screenrecord /sdcard/demo.mp4
# (Press Ctrl+C to stop)
adb pull /sdcard/demo.mp4
```

---

## ✅ Final Checklist

Before marking testing as complete:

- [ ] All automated tests pass (45/45)
- [ ] All manual test cases executed
- [ ] Tested on at least 3 different Android versions
- [ ] Tested on at least 2 different manufacturers
- [ ] Battery usage acceptable
- [ ] Memory usage acceptable
- [ ] Notifications deliver accurately
- [ ] No critical bugs remaining
- [ ] Known issues documented
- [ ] Test results logged
- [ ] Stakeholders informed

---

**Status**: Ready for comprehensive testing once build completes! 🚀
