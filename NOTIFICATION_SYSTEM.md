# Hong Kong Date Countdown - Notification Management System

## Features

### Notification Types

1. **Daily Holiday Reminders** (Default: 9:00 AM)
   - Receive daily notifications about upcoming Hong Kong holidays
   - Customizable notification time
   - User-configurable on/off toggle

2. **Weekly Wellness Check-ins** (Default: Sunday 8:00 PM)
   - Plan your week with holiday awareness
   - Configurable day of week and time
   - Promotes work-life balance

3. **Smart Holiday Alerts** (Default: 3 days before)
   - Contextual notifications before public holidays
   - Configurable advance notice (1-7 days)
   - Automatically excludes past holidays

## Technical Implementation

### Architecture

```
src/
├── types/
│   └── notifications.ts          # TypeScript interfaces and enums
├── services/
│   └── notificationService.ts    # Capacitor LocalNotifications wrapper
├── composables/
│   └── useNotifications.ts       # Vue 3 Composition API state management
└── components/
    └── NotificationSettings.vue  # UI component
```

### Key Technologies

- **Vue 3 Composition API**: Reactive state management
- **TypeScript**: Strict typing for type safety
- **Capacitor LocalNotifications**: Native notification API
- **localStorage**: Persistent preference storage
- **Vitest**: Unit testing framework

## Usage

### In Your Vue Component

```vue
<template>
  <NotificationSettings 
    :language="currentLanguage" 
    :holidays="holidaysList" 
  />
</template>

<script setup>
import NotificationSettings from '@/components/NotificationSettings.vue';
import { ref } from 'vue';

const currentLanguage = ref('en'); // or 'zh'
const holidaysList = ref([
  { event: 'Christmas', date: 'December 25, 2025' },
  // ... more holidays
]);
</script>
```

### Using the Composable Directly

```typescript
import { useNotifications } from '@/composables/useNotifications';

const {
  preferences,
  hasPermission,
  requestPermission,
  toggleDailyReminder,
  updateDailyReminderTime
} = useNotifications();

// Request permissions
await requestPermission();

// Enable daily reminder
await toggleDailyReminder(true);

// Change reminder time to 10:30 AM
await updateDailyReminderTime(10, 30);
```

## API Reference

### useNotifications Composable

#### State

- `preferences`: Reactive notification preferences object
- `permissionState`: Current permission status
- `lastError`: Last error that occurred
- `isLoading`: Loading state indicator

#### Computed Properties

- `hasPermission`: Boolean indicating if notifications are allowed
- `needsPermission`: Boolean indicating if permission needs to be requested
- `anyNotificationEnabled`: Boolean indicating if any notification type is enabled

#### Methods

- `requestPermission()`: Request notification permissions
- `checkPermission()`: Check current permission status
- `toggleDailyReminder(enabled: boolean)`: Toggle daily reminders
- `updateDailyReminderTime(hour: number, minute: number)`: Update reminder time
- `toggleWeeklyWellness(enabled: boolean)`: Toggle weekly check-ins
- `updateWeeklyWellnessTime(dayOfWeek: number, hour: number, minute: number)`: Update wellness time
- `toggleHolidayAlert(enabled: boolean, holidays: HolidayData[])`: Toggle holiday alerts
- `updateHolidayAlertDays(daysBeforeAlert: number, holidays: HolidayData[])`: Update alert timing
- `resetPreferences()`: Reset all preferences to defaults
- `getPendingCount()`: Get number of scheduled notifications

### NotificationService

The notification service is a singleton that wraps Capacitor LocalNotifications.

```typescript
import notificationService from '@/services/notificationService';

// Schedule notifications
await notificationService.scheduleDailyReminder(9, 0);
await notificationService.scheduleWeeklyWellness(0, 20, 0);
await notificationService.scheduleHolidayAlerts(holidays, 3);

// Cancel notifications
await notificationService.cancelNotification(1);
await notificationService.cancelAllNotifications();

// Check permissions
const state = await notificationService.checkPermissions();
```

## Testing

### Run Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

### Test Coverage

- ✅ Notification Service unit tests
- ✅ useNotifications composable tests
- ✅ NotificationSettings component tests
- ✅ Permission handling
- ✅ Error handling
- ✅ localStorage persistence

## Error Handling

The system includes comprehensive error handling:

1. **Permission Denials**: User-friendly messages with instructions
2. **Scheduling Failures**: Graceful degradation with error notifications
3. **localStorage Errors**: Fallback to default preferences
4. **Network Issues**: Offline capability with local scheduling

### Error Types

```typescript
type ErrorType = 'permission_denied' | 'scheduling_failed' | 'unknown';

interface NotificationError {
  type: ErrorType;
  message: string;
  timestamp: Date;
}
```

## Browser Compatibility

- ✅ Chrome/Edge (Desktop & Mobile)
- ✅ Firefox (Desktop & Mobile)
- ✅ Safari (iOS 15+)
- ⚠️ Safari (macOS) - Requires user interaction
- ❌ Internet Explorer - Not supported

## Capacitor Platform Support

- ✅ iOS (via @capacitor/ios)
- ✅ Android (via @capacitor/android)
- ✅ Web (via Notification API)

## localStorage Schema

```json
{
  "hk_notification_preferences": {
    "dailyReminder": {
      "enabled": false,
      "time": { "hour": 9, "minute": 0 }
    },
    "weeklyWellness": {
      "enabled": false,
      "time": { "hour": 20, "minute": 0 },
      "dayOfWeek": 0
    },
    "holidayAlert": {
      "enabled": false,
      "daysBeforeAlert": 3
    }
  }
}
```

## Security Considerations

1. **Permission Gating**: All notifications require explicit user permission
2. **Data Privacy**: No notification data sent to external servers
3. **Local Storage**: Preferences stored only on user's device
4. **No Tracking**: No analytics or tracking of notification interactions

## Future Enhancements

- [ ] Custom notification sounds
- [ ] Snooze functionality
- [ ] Notification history
- [ ] Multiple reminder times
- [ ] Holiday categories (filter by type)
- [ ] Export/import preferences
- [ ] Push notifications (with backend)

## Contributing

When contributing to the notification system:

1. Maintain strict TypeScript typing
2. Add tests for new features
3. Update documentation
4. Follow Vue 3 Composition API patterns
5. Handle errors gracefully

## License

Part of the Hong Kong Date Countdown Web project.
