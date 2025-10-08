/**
 * Notification Composable (JavaScript Version)
 * Vue 3 Composition API composable for managing notification state and preferences
 */

import { ref, computed, watch } from 'vue';
import notificationService from '../services/notificationService.js';
import { NotificationType } from '../types/notifications.js';

const STORAGE_KEY = 'hk_notification_preferences';

// Default preferences
const defaultPreferences = {
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

// Load preferences from localStorage
function loadPreferences() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultPreferences, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error loading preferences:', error);
  }
  return defaultPreferences;
}

// Save preferences to localStorage
function savePreferences(prefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

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
   * Check notification permissions
   */
  async function checkPermission() {
    try {
      const state = await notificationService.checkPermissions();
      permissionState.value = state;
      return state;
    } catch (error) {
      console.error('Error checking permissions:', error);
      lastError.value = {
        type: 'permission_error',
        message: 'Failed to check notification permissions',
        timestamp: new Date(),
      };
      return permissionState.value;
    }
  }

  /**
   * Request notification permissions
   */
  async function requestPermission() {
    isLoading.value = true;
    lastError.value = null;

    try {
      const result = await notificationService.requestPermissions();
      
      permissionState.value = {
        granted: result.granted,
        denied: result.denied,
        pending: result.pending,
      };

      return result.granted;
    } catch (error) {
      console.error('Error requesting permissions:', error);
      lastError.value = error;
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Toggle daily reminder
   */
  async function toggleDailyReminder(enabled) {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (enabled) {
        const { hour, minute } = preferences.value.dailyReminder.time;
        await notificationService.scheduleDailyReminder(hour, minute);
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.DAILY_REMINDER);
      }

      preferences.value.dailyReminder.enabled = enabled;
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error toggling daily reminder:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update daily reminder time
   */
  async function updateDailyReminderTime(hour, minute) {
    isLoading.value = true;
    lastError.value = null;

    try {
      preferences.value.dailyReminder.time = { hour, minute };
      
      if (preferences.value.dailyReminder.enabled) {
        await notificationService.scheduleDailyReminder(hour, minute);
      }
      
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error updating daily reminder time:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Toggle weekly wellness check-in
   */
  async function toggleWeeklyWellness(enabled) {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (enabled) {
        const { hour, minute } = preferences.value.weeklyWellness.time;
        const { dayOfWeek } = preferences.value.weeklyWellness;
        await notificationService.scheduleWeeklyWellness(dayOfWeek, hour, minute);
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.WEEKLY_WELLNESS);
      }

      preferences.value.weeklyWellness.enabled = enabled;
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error toggling weekly wellness:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update weekly wellness time
   */
  async function updateWeeklyWellnessTime(dayOfWeek, hour, minute) {
    isLoading.value = true;
    lastError.value = null;

    try {
      preferences.value.weeklyWellness.time = { hour, minute };
      preferences.value.weeklyWellness.dayOfWeek = dayOfWeek;
      
      if (preferences.value.weeklyWellness.enabled) {
        await notificationService.scheduleWeeklyWellness(dayOfWeek, hour, minute);
      }
      
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error updating weekly wellness time:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Toggle holiday alerts
   */
  async function toggleHolidayAlert(enabled, holidays) {
    isLoading.value = true;
    lastError.value = null;

    try {
      if (enabled && holidays && holidays.length > 0) {
        const daysBefore = preferences.value.holidayAlert.daysBeforeAlert;
        await notificationService.scheduleHolidayAlerts(holidays, daysBefore);
      } else {
        await notificationService.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);
      }

      preferences.value.holidayAlert.enabled = enabled;
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error toggling holiday alert:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Update holiday alert days before
   */
  async function updateHolidayAlertDays(daysBefore, holidays) {
    isLoading.value = true;
    lastError.value = null;

    try {
      preferences.value.holidayAlert.daysBeforeAlert = daysBefore;
      
      if (preferences.value.holidayAlert.enabled && holidays && holidays.length > 0) {
        await notificationService.scheduleHolidayAlerts(holidays, daysBefore);
      }
      
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error updating holiday alert days:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Reset all preferences to defaults
   */
  async function resetPreferences() {
    isLoading.value = true;
    lastError.value = null;

    try {
      // Cancel all notifications
      await notificationService.cancelNotificationsByType(NotificationType.DAILY_REMINDER);
      await notificationService.cancelNotificationsByType(NotificationType.WEEKLY_WELLNESS);
      await notificationService.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);

      // Reset preferences
      preferences.value = { ...defaultPreferences };
      savePreferences(preferences.value);
    } catch (error) {
      console.error('Error resetting preferences:', error);
      lastError.value = error;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get count of pending notifications
   */
  async function getPendingCount() {
    try {
      const pending = await notificationService.getPendingNotifications();
      return pending.length;
    } catch (error) {
      console.error('Error getting pending count:', error);
      return 0;
    }
  }

  // Watch preferences and save to localStorage
  watch(
    () => preferences.value,
    (newPrefs) => {
      savePreferences(newPrefs);
    },
    { deep: true }
  );

  // Initial permission check
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
