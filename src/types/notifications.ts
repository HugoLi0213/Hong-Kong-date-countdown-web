/**
 * Notification Types and Interfaces
 * Strict TypeScript definitions for the notification management system
 */

export enum NotificationType {
  DAILY_REMINDER = 'daily_reminder',
  WEEKLY_WELLNESS = 'weekly_wellness',
  HOLIDAY_ALERT = 'holiday_alert',
}

export interface NotificationTime {
  hour: number; // 0-23
  minute: number; // 0-59
}

export interface NotificationPreferences {
  dailyReminder: {
    enabled: boolean;
    time: NotificationTime;
  };
  weeklyWellness: {
    enabled: boolean;
    time: NotificationTime;
    dayOfWeek: number; // 0 (Sunday) - 6 (Saturday)
  };
  holidayAlert: {
    enabled: boolean;
    daysBeforeAlert: number; // Days before holiday to send alert
  };
}

export interface HolidayData {
  event: string;
  date: string;
}

export interface NotificationSchedule {
  id: number;
  type: NotificationType;
  title: string;
  body: string;
  schedule: {
    at?: Date;
    every?: 'day' | 'week';
    on?: {
      hour: number;
      minute: number;
      day?: number;
    };
  };
}

export interface NotificationPermissionState {
  granted: boolean;
  denied: boolean;
  pending: boolean;
}

export interface NotificationError {
  type: 'permission_denied' | 'scheduling_failed' | 'unknown';
  message: string;
  timestamp: Date;
}
