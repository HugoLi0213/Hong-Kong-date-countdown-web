/**
 * Notification Types and Interfaces (JavaScript Version)
 */

// Export as plain objects since JavaScript doesn't have enums
export const NotificationType = {
  DAILY_REMINDER: 'daily_reminder',
  WEEKLY_WELLNESS: 'weekly_wellness',
  HOLIDAY_ALERT: 'holiday_alert',
};

// Export notification type constants for convenience
export const DAILY_REMINDER = NotificationType.DAILY_REMINDER;
export const WEEKLY_WELLNESS = NotificationType.WEEKLY_WELLNESS;
export const HOLIDAY_ALERT = NotificationType.HOLIDAY_ALERT;

// Days of the week
export const DaysOfWeek = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

// Default notification preferences structure
export const defaultPreferences = {
  dailyReminder: {
    enabled: false,
    time: { hour: 9, minute: 0 },
  },
  weeklyWellness: {
    enabled: false,
    time: { hour: 20, minute: 0 },
    dayOfWeek: DaysOfWeek.SUNDAY,
  },
  holidayAlert: {
    enabled: false,
    daysBeforeAlert: 3,
  },
};

// Permission states
export const PermissionStates = {
  GRANTED: 'granted',
  DENIED: 'denied',
  PROMPT: 'prompt',
};

// Error types
export const ErrorTypes = {
  PERMISSION_ERROR: 'permission_error',
  SCHEDULE_ERROR: 'schedule_error',
  CANCEL_ERROR: 'cancel_error',
  STORAGE_ERROR: 'storage_error',
  UNKNOWN_ERROR: 'unknown_error',
};

/**
 * Create a notification error object
 */
export function createNotificationError(type, message) {
  return {
    type: type || ErrorTypes.UNKNOWN_ERROR,
    message: message || 'An unknown error occurred',
    timestamp: new Date(),
  };
}

/**
 * Create a permission state object
 */
export function createPermissionState(granted = false, denied = false, pending = true) {
  return {
    granted,
    denied,
    pending,
  };
}

/**
 * Check if a notification type is valid
 */
export function isValidNotificationType(type) {
  return Object.values(NotificationType).includes(type);
}

/**
 * Get notification type display name
 */
export function getNotificationTypeDisplayName(type, language = 'en') {
  const names = {
    [NotificationType.DAILY_REMINDER]: {
      en: 'Daily Reminder',
      zh: '每日提醒',
    },
    [NotificationType.WEEKLY_WELLNESS]: {
      en: 'Weekly Wellness',
      zh: '每週健康',
    },
    [NotificationType.HOLIDAY_ALERT]: {
      en: 'Holiday Alert',
      zh: '假期提醒',
    },
  };

  return names[type]?.[language] || type;
}

/**
 * Get day of week display name
 */
export function getDayOfWeekDisplayName(day, language = 'en') {
  const names = {
    0: { en: 'Sunday', zh: '星期日' },
    1: { en: 'Monday', zh: '星期一' },
    2: { en: 'Tuesday', zh: '星期二' },
    3: { en: 'Wednesday', zh: '星期三' },
    4: { en: 'Thursday', zh: '星期四' },
    5: { en: 'Friday', zh: '星期五' },
    6: { en: 'Saturday', zh: '星期六' },
  };

  return names[day]?.[language] || 'Unknown';
}

// Export everything as default too for convenience
export default {
  NotificationType,
  DAILY_REMINDER,
  WEEKLY_WELLNESS,
  HOLIDAY_ALERT,
  DaysOfWeek,
  defaultPreferences,
  PermissionStates,
  ErrorTypes,
  createNotificationError,
  createPermissionState,
  isValidNotificationType,
  getNotificationTypeDisplayName,
  getDayOfWeekDisplayName,
};
