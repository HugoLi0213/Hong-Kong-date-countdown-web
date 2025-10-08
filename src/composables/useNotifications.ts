/**
 * Notification Composable
 * Vue 3 Composition API composable for managing notification state and preferences
 */

import { ref, computed, watch } from 'vue';
import notificationService from '@/services/notificationService';
import {
  NotificationType,
  NotificationPreferences,
  NotificationPermissionState,
  NotificationError,
  HolidayData,
} from '@/types/notifications';

const STORAGE_KEY = 'hk_notification_preferences';

// Default preferences
const defaultPreferences: NotificationPreferences = {
  dailyReminder: {
    enabled: false,
    time: { hour: 9, minute: 0 },
  },
  weeklyWellness: {
    enabled: false,
    time: { hour: 20, minute: 0 },
    dayOfWeek: 0, // Sunday
  },
  holidayAlert: {
    enabled: false,
    daysBeforeAlert: 3,
  },
};

export function useNotifications() {
  // Reactive state
  const preferences = ref(loadPreferences());
  const permissionState = ref({
    granted: false,
    denied: false,
    pending: true,
  });
  const lastError = ref(null);
  const isLoading = ref(false);

  // Computed properties
  const hasPermission = computed(() => permissionState.value.granted);
  const needsPermission = computed(() => !permissionState.value.granted && !permissionState.value.denied);
  const anyNotificationEnabled = computed(() => 
    preferences.value.dailyReminder.enabled ||
    preferences.value.weeklyWellness.enabled ||
    preferences.value.holidayAlert.enabled
  );

  /**
   * Load preferences from localStorage
   */
  function loadPreferences(): NotificationPreferences {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...defaultPreferences, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
    return { ...defaultPreferences };
  }

  /**
   * Save preferences to localStorage
   */
  function savePreferences(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences.value));
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      lastError.value = {
        type: 'unknown',
        message: 'Failed to save preferences',
        timestamp: new Date(),
      };
    }
  }

  /**
   * Apply all preferences (used after granting permission)
   */
  async function applyAllPreferences(holidays?: HolidayData[]): Promise<void> {
    if (!permissionState.value.granted) return;

    try {
      if (preferences.value.dailyReminder.enabled) {
        await notificationService.scheduleDailyReminder(
          preferences.value.dailyReminder.time.hour,
          preferences.value.dailyReminder.time.minute
        );
      }

      if (preferences.value.weeklyWellness.enabled) {
        await notificationService.scheduleWeeklyWellness(
          preferences.value.weeklyWellness.dayOfWeek,
          preferences.value.weeklyWellness.time.hour,
          preferences.value.weeklyWellness.time.minute
        );
      }

      if (preferences.value.holidayAlert.enabled && holidays) {
        await notificationService.scheduleHolidayAlerts(
          holidays,
          preferences.value.holidayAlert.daysBeforeAlert
        );
      }
    } catch (error) {
      lastError.value = error as NotificationError;
    }
  }

  /**
   * Request notification permissions
   */
  async function requestPermission(): Promise<boolean> {
    isLoading.value = true;
    lastError.value = null;

    try {
      const state = await notificationService.requestPermissions();
      permissionState.value = state;
      
      if (state.granted) {
        // Apply current preferences if any are enabled
        await applyAllPreferences();
      }

      return state.granted;
    } catch (error) {
      lastError.value = error as NotificationError;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Check current permission status
   */
  async function checkPermission(): Promise<void> {
    try {
      const state = await notificationService.checkPermissions();
      permissionState.value = state;
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  }

  /**
   * Toggle daily reminder
   */
  async function toggleDailyReminder(enabled: boolean): Promise<void> {
    if (enabled && !permissionState.value.granted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    preferences.value.dailyReminder.enabled = enabled;
    savePreferences();

    try {
      if (enabled) {
        await notificationService.scheduleDailyReminder(
          preferences.value.dailyReminder.time.hour,
          preferences.value.dailyReminder.time.minute
        );
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.DAILY_REMINDER);
      }
    } catch (error) {
      lastError.value = error as NotificationError;
      preferences.value.dailyReminder.enabled = false;
      savePreferences();
    }
  }

  /**
   * Update daily reminder time
   */
  async function updateDailyReminderTime(hour: number, minute: number): Promise<void> {
    preferences.value.dailyReminder.time = { hour, minute };
    savePreferences();

    if (preferences.value.dailyReminder.enabled && permissionState.value.granted) {
      try {
        await notificationService.scheduleDailyReminder(hour, minute);
      } catch (error) {
        lastError.value = error as NotificationError;
      }
    }
  }

  /**
   * Toggle weekly wellness check-in
   */
  async function toggleWeeklyWellness(enabled: boolean): Promise<void> {
    if (enabled && !permissionState.value.granted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    preferences.value.weeklyWellness.enabled = enabled;
    savePreferences();

    try {
      if (enabled) {
        await notificationService.scheduleWeeklyWellness(
          preferences.value.weeklyWellness.dayOfWeek,
          preferences.value.weeklyWellness.time.hour,
          preferences.value.weeklyWellness.time.minute
        );
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.WEEKLY_WELLNESS);
      }
    } catch (error) {
      lastError.value = error as NotificationError;
      preferences.value.weeklyWellness.enabled = false;
      savePreferences();
    }
  }

  /**
   * Update weekly wellness time and day
   */
  async function updateWeeklyWellnessTime(
    dayOfWeek: number,
    hour: number,
    minute: number
  ): Promise<void> {
    preferences.value.weeklyWellness.dayOfWeek = dayOfWeek;
    preferences.value.weeklyWellness.time = { hour, minute };
    savePreferences();

    if (preferences.value.weeklyWellness.enabled && permissionState.value.granted) {
      try {
        await notificationService.scheduleWeeklyWellness(dayOfWeek, hour, minute);
      } catch (error) {
        lastError.value = error as NotificationError;
      }
    }
  }

  /**
   * Toggle holiday alerts
   */
  async function toggleHolidayAlert(enabled: boolean, holidays: HolidayData[]): Promise<void> {
    if (enabled && !permissionState.value.granted) {
      const granted = await requestPermission();
      if (!granted) return;
    }

    preferences.value.holidayAlert.enabled = enabled;
    savePreferences();

    try {
      if (enabled) {
        await notificationService.scheduleHolidayAlerts(
          holidays,
          preferences.value.holidayAlert.daysBeforeAlert
        );
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);
      }
    } catch (error) {
      lastError.value = error as NotificationError;
      preferences.value.holidayAlert.enabled = false;
      savePreferences();
    }
  }

  /**
   * Update holiday alert days before
   */
  async function updateHolidayAlertDays(
    daysBeforeAlert: number,
    holidays: HolidayData[]
  ): Promise<void> {
    preferences.value.holidayAlert.daysBeforeAlert = daysBeforeAlert;
    savePreferences();

    if (preferences.value.holidayAlert.enabled && permissionState.value.granted) {
      try {
        await notificationService.scheduleHolidayAlerts(holidays, daysBeforeAlert);
      } catch (error) {
        lastError.value = error as NotificationError;
      }
    }
  }

  /**
   * Reset all preferences
   */
  async function resetPreferences(): Promise<void> {
    preferences.value = { ...defaultPreferences };
    savePreferences();
    await notificationService.cancelAllNotifications();
  }

  /**
   * Get pending notifications count
   */
  async function getPendingCount(): Promise<number> {
    try {
      const pending = await notificationService.getPendingNotifications();
      return pending.length;
    } catch (error) {
      console.error('Error getting pending notifications count:', error);
      return 0;
    }
  }

  // Watch for permission state changes
  watch(permissionState, (newState) => {
    if (newState.denied) {
      // If permission is denied, disable all notifications
      preferences.value.dailyReminder.enabled = false;
      preferences.value.weeklyWellness.enabled = false;
      preferences.value.holidayAlert.enabled = false;
      savePreferences();
    }
  });

  // Initialize permission state on mount
  checkPermission();

  return {
    // State
    preferences,
    permissionState,
    lastError,
    isLoading,

    // Computed
    hasPermission,
    needsPermission,
    anyNotificationEnabled,

    // Methods
    requestPermission,
    checkPermission,
    toggleDailyReminder,
    updateDailyReminderTime,
    toggleWeeklyWellness,
    updateWeeklyWellnessTime,
    toggleHolidayAlert,
    updateHolidayAlertDays,
    resetPreferences,
    getPendingCount,
  };
}
