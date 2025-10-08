/**
 * Android-specific Type Definitions for Capacitor Notifications
 * Extends the base notification types with Android platform features
 */

import { LocalNotificationSchema } from '@capacitor/local-notifications';

/**
 * Android notification importance levels
 * Maps to NotificationManager importance constants
 */
export enum AndroidImportance {
  NONE = 0,          // Notification won't be shown
  MIN = 1,           // Only in notification shade, no sound/vibration
  LOW = 2,           // Notification shade and status bar, no sound
  DEFAULT = 3,       // Notification with sound
  HIGH = 4,          // Notification with sound and heads-up
  MAX = 5            // Critical notification, always appears
}

/**
 * Android notification visibility on lock screen
 */
export enum AndroidVisibility {
  SECRET = -1,       // Don't show on lock screen
  PRIVATE = 0,       // Show notification but hide sensitive content
  PUBLIC = 1         // Show full notification
}

/**
 * Extended Android notification schema
 */
export interface AndroidNotificationSchema extends LocalNotificationSchema {
  channelId?: string;
  importance?: AndroidImportance;
  visibility?: AndroidVisibility;
  autoCancel?: boolean;
  ongoing?: boolean;
  color?: string;
  largeIcon?: string;
  bigText?: string;
  bigPicture?: string;
  subText?: string;
  ticker?: string;
  inboxLines?: string[];
  category?: NotificationCategory;
  priority?: NotificationPriority;
  timeoutAfter?: number;
  chronometer?: boolean;
  when?: number;
  showWhen?: boolean;
  allowWhileIdle?: boolean;
}

/**
 * Android notification categories
 */
export enum NotificationCategory {
  ALARM = 'alarm',
  CALL = 'call',
  EMAIL = 'email',
  ERROR = 'err',
  EVENT = 'event',
  MESSAGE = 'msg',
  NAVIGATION = 'navigation',
  PROGRESS = 'progress',
  PROMO = 'promo',
  RECOMMENDATION = 'recommendation',
  REMINDER = 'reminder',
  SERVICE = 'service',
  SOCIAL = 'social',
  STATUS = 'status',
  SYSTEM = 'sys',
  TRANSPORT = 'transport',
}

/**
 * Android notification priority (legacy, pre-channels)
 */
export enum NotificationPriority {
  MIN = -2,
  LOW = -1,
  DEFAULT = 0,
  HIGH = 1,
  MAX = 2,
}

/**
 * Notification action button configuration
 */
export interface NotificationAction {
  id: string;
  title: string;
  icon?: string;
  launchApp?: boolean;
  destructive?: boolean;
  authenticationRequired?: boolean;
  input?: boolean;
  inputPlaceholder?: string;
}

/**
 * Notification schedule configuration for Android
 */
export interface AndroidSchedule {
  at?: Date;
  every?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';
  count?: number;
  on?: {
    year?: number;
    month?: number;
    day?: number;
    hour?: number;
    minute?: number;
    second?: number;
  };
  allowWhileIdle?: boolean;
}

/**
 * Notification statistics and tracking
 */
export interface NotificationStats {
  id: number;
  type: string;
  scheduledAt: Date;
  deliveredAt?: Date;
  tappedAt?: Date;
  dismissedAt?: Date;
  actionPerformed?: string;
  error?: string;
}

/**
 * App lifecycle state
 */
export enum AppLifecycleState {
  ACTIVE = 'active',
  PAUSED = 'paused',
  RESUMED = 'resumed',
  DESTROYED = 'destroyed',
}

/**
 * App state change event
 */
export interface AppStateChangeEvent {
  isActive: boolean;
  lifecycleState: AppLifecycleState;
}

/**
 * Deep link data from notification
 */
export interface NotificationDeepLink {
  url: string;
  sourceApplication?: string;
}

/**
 * Notification received event
 */
export interface NotificationReceivedEvent {
  id: number;
  title: string;
  body: string;
  extra?: any;
  schedule?: any;
}

/**
 * Notification action performed event
 */
export interface NotificationActionEvent {
  actionId: string;
  inputValue?: string;
  notification: {
    id: number;
    title: string;
    body: string;
    extra?: any;
  };
}

/**
 * Notification permission result for Android
 */
export interface AndroidPermissionResult {
  display: 'granted' | 'denied' | 'prompt';
  receive?: 'granted' | 'denied' | 'prompt';
  sound?: 'granted' | 'denied' | 'prompt';
  alert?: 'granted' | 'denied' | 'prompt';
  badge?: 'granted' | 'denied' | 'prompt';
}

/**
 * Notification channel configuration for Android
 */
export interface AndroidChannel {
  id: string;
  name: string;
  description?: string;
  importance?: AndroidImportance;
  visibility?: AndroidVisibility;
  sound?: string;
  vibration?: boolean;
  lights?: boolean;
  lightColor?: string;
  badge?: boolean;
  groupId?: string;
}

/**
 * Notification channel group
 */
export interface AndroidChannelGroup {
  id: string;
  name: string;
  description?: string;
}

/**
 * Holiday data with Android-specific metadata
 */
export interface AndroidHolidayData {
  event: string;
  date: string;
  category?: string;
  isPublicHoliday?: boolean;
  notificationSent?: boolean;
  lastNotificationDate?: Date;
}

/**
 * User preferences with Android-specific settings
 */
export interface AndroidNotificationPreferences {
  dailyReminder: {
    enabled: boolean;
    time: { hour: number; minute: number };
    sound?: string;
    vibrate?: boolean;
    importance?: AndroidImportance;
  };
  weeklyWellness: {
    enabled: boolean;
    dayOfWeek: number;
    time: { hour: number; minute: number };
    sound?: string;
    vibrate?: boolean;
    importance?: AndroidImportance;
  };
  holidayAlert: {
    enabled: boolean;
    daysBeforeAlert: number;
    sound?: string;
    vibrate?: boolean;
    importance?: AndroidImportance;
  };
  quietHours?: {
    enabled: boolean;
    start: { hour: number; minute: number };
    end: { hour: number; minute: number };
  };
}

/**
 * Notification error types specific to Android
 */
export enum AndroidNotificationError {
  PERMISSION_DENIED = 'android_permission_denied',
  CHANNEL_BLOCKED = 'android_channel_blocked',
  SCHEDULE_EXACT_ALARM_DENIED = 'android_schedule_exact_alarm_denied',
  BATTERY_OPTIMIZATION = 'android_battery_optimization',
  DO_NOT_DISTURB = 'android_do_not_disturb',
  INVALID_SOUND = 'android_invalid_sound',
  INVALID_ICON = 'android_invalid_icon',
  SCHEDULING_FAILED = 'android_scheduling_failed',
  UNKNOWN = 'android_unknown_error',
}

/**
 * Error handler result
 */
export interface NotificationErrorResult {
  errorType: AndroidNotificationError;
  message: string;
  suggestion?: string;
  canRetry: boolean;
  requiresUserAction: boolean;
}

/**
 * Battery optimization status
 */
export interface BatteryOptimizationStatus {
  isIgnoringOptimizations: boolean;
  canRequestIgnore: boolean;
  shouldShowRationale: boolean;
}

/**
 * Notification delivery status
 */
export interface NotificationDeliveryStatus {
  scheduled: number;
  delivered: number;
  pending: number;
  failed: number;
  dismissed: number;
}

/**
 * Android platform info
 */
export interface AndroidPlatformInfo {
  version: number; // Android API level
  manufacturer: string;
  model: string;
  hasNotificationChannels: boolean; // API 26+
  hasExactAlarms: boolean; // API 31+
  requiresScheduleExactAlarm: boolean; // API 31+
}

export default {
  AndroidImportance,
  AndroidVisibility,
  NotificationCategory,
  NotificationPriority,
  AppLifecycleState,
  AndroidNotificationError,
};
