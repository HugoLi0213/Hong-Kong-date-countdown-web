/**
 * Enhanced Notification Service for Android
 * Handles notification channels, scheduling, permissions, and lifecycle management
 */

import { LocalNotifications, ScheduleOptions, LocalNotificationSchema, Channel } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import {
  NotificationType,
  type NotificationPreferences,
  type NotificationSchedule,
  type NotificationPermissionState,
  type NotificationError,
  type HolidayData,
} from '@/types/notifications';

/**
 * Notification channels for Android with different priority levels
 */
export enum NotificationChannel {
  DAILY = 'daily_reminders',
  WEEKLY = 'weekly_wellness',
  HOLIDAY = 'holiday_alerts',
  URGENT = 'urgent_notifications',
}

/**
 * Channel configurations for Android
 */
const CHANNEL_CONFIGS: Record<NotificationChannel, Channel> = {
  [NotificationChannel.DAILY]: {
    id: NotificationChannel.DAILY,
    name: 'Daily Reminders',
    description: 'Daily holiday awareness reminders',
    importance: 3, // Default importance
    visibility: 1, // Public
    sound: 'gentle_reminder.mp3',
    vibration: true,
    lights: true,
    lightColor: '#488AFF',
  },
  [NotificationChannel.WEEKLY]: {
    id: NotificationChannel.WEEKLY,
    name: 'Weekly Wellness',
    description: 'Weekly wellness check-in reminders',
    importance: 3,
    visibility: 1,
    sound: 'gentle_reminder.mp3',
    vibration: true,
    lights: true,
    lightColor: '#66BB6A',
  },
  [NotificationChannel.HOLIDAY]: {
    id: NotificationChannel.HOLIDAY,
    name: 'Holiday Alerts',
    description: 'Upcoming holiday notifications',
    importance: 4, // High importance
    visibility: 1,
    sound: 'gentle_reminder.mp3',
    vibration: true,
    lights: true,
    lightColor: '#FFA726',
  },
  [NotificationChannel.URGENT]: {
    id: NotificationChannel.URGENT,
    name: 'Urgent Notifications',
    description: 'Time-sensitive notifications',
    importance: 5, // Max importance
    visibility: 1,
    sound: 'gentle_reminder.mp3',
    vibration: true,
    lights: true,
    lightColor: '#EF5350',
  },
};

class NotificationService {
  private static instance: NotificationService;
  private isAndroid: boolean = false;
  private channelsCreated: boolean = false;
  private permissionState: NotificationPermissionState = {
    granted: false,
    denied: false,
    pending: true,
  };
  private appStateListener: any = null;

  private constructor() {
    this.isAndroid = Capacitor.getPlatform() === 'android';
    this.initializeChannels();
    this.initializeListeners();
    this.initializeAppLifecycle();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize Android notification channels
   */
  private async initializeChannels(): Promise<void> {
    if (!this.isAndroid || this.channelsCreated) {
      return;
    }

    try {
      // Create all notification channels
      const channels = Object.values(CHANNEL_CONFIGS);
      await LocalNotifications.createChannel(CHANNEL_CONFIGS[NotificationChannel.DAILY]);
      await LocalNotifications.createChannel(CHANNEL_CONFIGS[NotificationChannel.WEEKLY]);
      await LocalNotifications.createChannel(CHANNEL_CONFIGS[NotificationChannel.HOLIDAY]);
      await LocalNotifications.createChannel(CHANNEL_CONFIGS[NotificationChannel.URGENT]);

      this.channelsCreated = true;
      console.log('Android notification channels created successfully');
    } catch (error) {
      console.error('Error creating notification channels:', error);
    }
  }

  /**
   * Initialize notification event listeners for user interactions
   */
  private initializeListeners(): void {
    // Listen for notification received
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
      this.handleNotificationReceived(notification);
    });

    // Listen for notification action (tap, dismiss, etc.)
    LocalNotifications.addListener('localNotificationActionPerformed', (actionData) => {
      console.log('Notification action performed:', actionData);
      this.handleNotificationAction(actionData);
    });
  }

  /**
   * Initialize app lifecycle listeners
   */
  private initializeAppLifecycle(): void {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    // Listen for app state changes
    this.appStateListener = App.addListener('appStateChange', async (state) => {
      console.log('App state changed:', state);
      
      if (state.isActive) {
        // App came to foreground - refresh pending notifications
        await this.syncNotifications();
      } else {
        // App went to background - ensure notifications are scheduled
        await this.ensureNotificationsScheduled();
      }
    });

    // Listen for app URL open (deep linking)
    App.addListener('appUrlOpen', (data) => {
      console.log('App opened from URL:', data.url);
      // Handle deep link if needed
    });
  }

  /**
   * Handle notification received event
   */
  private handleNotificationReceived(notification: any): void {
    // Track notification analytics
    const notificationType = notification.extra?.type as NotificationType;
    console.log(`Notification received: ${notificationType}`);
    
    // You can add custom handling here (e.g., update app state, show in-app message)
  }

  /**
   * Handle notification action (tap, button press, etc.)
   */
  private handleNotificationAction(actionData: any): void {
    const notification = actionData.notification;
    const actionId = actionData.actionId;
    const notificationType = notification.extra?.type as NotificationType;

    console.log(`Notification action: ${actionId} for type: ${notificationType}`);

    // Handle different action types
    switch (actionId) {
      case 'tap':
        // User tapped on notification - open app to relevant screen
        this.handleNotificationTap(notificationType);
        break;
      case 'dismiss':
        // User dismissed notification
        console.log('Notification dismissed');
        break;
      default:
        console.log(`Unknown action: ${actionId}`);
    }
  }

  /**
   * Handle notification tap - navigate to relevant screen
   */
  private handleNotificationTap(type: NotificationType): void {
    // Emit custom event that the app can listen to for navigation
    const event = new CustomEvent('notificationTapped', {
      detail: { type },
    });
    window.dispatchEvent(event);
  }

  /**
   * Sync notifications with current preferences
   */
  private async syncNotifications(): Promise<void> {
    try {
      const pending = await this.getPendingNotifications();
      console.log(`Syncing ${pending.length} pending notifications`);
      
      // Remove any expired or invalid notifications
      const now = new Date().getTime();
      const expiredIds = pending
        .filter(n => n.schedule?.at && new Date(n.schedule.at).getTime() < now)
        .map(n => n.id);
      
      if (expiredIds.length > 0) {
        await LocalNotifications.cancel({ notifications: expiredIds.map(id => ({ id })) });
        console.log(`Cancelled ${expiredIds.length} expired notifications`);
      }
    } catch (error) {
      console.error('Error syncing notifications:', error);
    }
  }

  /**
   * Ensure notifications are scheduled when app goes to background
   */
  private async ensureNotificationsScheduled(): Promise<void> {
    try {
      const pending = await this.getPendingNotifications();
      
      if (pending.length === 0) {
        console.warn('No notifications scheduled when app went to background');
      } else {
        console.log(`${pending.length} notifications scheduled for background delivery`);
      }
    } catch (error) {
      console.error('Error ensuring notifications:', error);
    }
  }

  /**
   * Request notification permissions with user-friendly explanation
   */
  async requestPermissions(): Promise<boolean> {
    try {
      const result = await LocalNotifications.requestPermissions();
      
      this.permissionState = {
        granted: result.display === 'granted',
        denied: result.display === 'denied',
        pending: result.display === 'prompt',
      };

      if (this.permissionState.granted && this.isAndroid) {
        // Ensure channels are created after permission granted
        await this.initializeChannels();
      }

      console.log('Notification permissions:', this.permissionState);
      return this.permissionState.granted;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      throw this.createError('permission_error', 'Failed to request notification permissions');
    }
  }

  /**
   * Check current permission status
   */
  async checkPermissions(): Promise<NotificationPermissionState> {
    try {
      const result = await LocalNotifications.checkPermissions();
      
      this.permissionState = {
        granted: result.display === 'granted',
        denied: result.display === 'denied',
        pending: result.display === 'prompt',
      };

      return this.permissionState;
    } catch (error) {
      console.error('Error checking permissions:', error);
      return this.permissionState;
    }
  }

  /**
   * Get channel ID based on notification type
   */
  private getChannelId(type: NotificationType): NotificationChannel {
    switch (type) {
      case NotificationType.DAILY_REMINDER:
        return NotificationChannel.DAILY;
      case NotificationType.WEEKLY_WELLNESS:
        return NotificationChannel.WEEKLY;
      case NotificationType.HOLIDAY_ALERT:
        return NotificationChannel.HOLIDAY;
      default:
        return NotificationChannel.DAILY;
    }
  }

  /**
   * Schedule daily holiday reminder
   */
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<void> {
    try {
      // Cancel existing daily reminders first
      await this.cancelNotificationsByType(NotificationType.DAILY_REMINDER);

      const now = new Date();
      const scheduledTime = new Date();
      scheduledTime.setHours(hour, minute, 0, 0);

      // If time has passed today, schedule for tomorrow
      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      const notification: LocalNotificationSchema = {
        id: this.generateNotificationId(NotificationType.DAILY_REMINDER),
        title: '🌅 Daily Holiday Reminder',
        body: 'Start your day mindfully with awareness of upcoming Hong Kong holidays',
        schedule: {
          at: scheduledTime,
          every: 'day',
          allowWhileIdle: true,
        },
        sound: 'gentle_reminder.mp3',
        smallIcon: 'ic_stat_notification',
        iconColor: '#488AFF',
        extra: {
          type: NotificationType.DAILY_REMINDER,
        },
      };

      // Add Android-specific channel
      if (this.isAndroid) {
        (notification as any).channelId = this.getChannelId(NotificationType.DAILY_REMINDER);
      }

      await LocalNotifications.schedule({
        notifications: [notification],
      });

      console.log('Daily reminder scheduled successfully');
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw this.createError('schedule_error', 'Failed to schedule daily reminder');
    }
  }

  /**
   * Schedule weekly wellness check-in
   */
  async scheduleWeeklyWellness(
    dayOfWeek: number = 0,
    hour: number = 20,
    minute: number = 0
  ): Promise<void> {
    try {
      await this.cancelNotificationsByType(NotificationType.WEEKLY_WELLNESS);

      const now = new Date();
      const scheduledTime = new Date();
      
      // Calculate next occurrence of the specified day
      const currentDay = now.getDay();
      let daysUntil = dayOfWeek - currentDay;
      
      if (daysUntil < 0 || (daysUntil === 0 && now.getHours() * 60 + now.getMinutes() >= hour * 60 + minute)) {
        daysUntil += 7;
      }
      
      scheduledTime.setDate(now.getDate() + daysUntil);
      scheduledTime.setHours(hour, minute, 0, 0);

      const notification: LocalNotificationSchema = {
        id: this.generateNotificationId(NotificationType.WEEKLY_WELLNESS),
        title: '💚 Weekly Wellness Check-in',
        body: 'Take a moment to plan ahead and reflect on your work-life balance',
        schedule: {
          at: scheduledTime,
          every: 'week',
          allowWhileIdle: true,
        },
        sound: 'gentle_reminder.mp3',
        smallIcon: 'ic_stat_notification',
        iconColor: '#66BB6A',
        extra: {
          type: NotificationType.WEEKLY_WELLNESS,
        },
      };

      if (this.isAndroid) {
        (notification as any).channelId = this.getChannelId(NotificationType.WEEKLY_WELLNESS);
      }

      await LocalNotifications.schedule({
        notifications: [notification],
      });

      console.log('Weekly wellness check-in scheduled successfully');
    } catch (error) {
      console.error('Error scheduling weekly wellness:', error);
      throw this.createError('schedule_error', 'Failed to schedule weekly wellness');
    }
  }

  /**
   * Schedule holiday alerts based on upcoming holidays
   */
  async scheduleHolidayAlerts(holidays: HolidayData[], daysBefore: number = 3): Promise<void> {
    try {
      await this.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);

      const now = new Date();
      now.setHours(0, 0, 0, 0);

      const notifications: LocalNotificationSchema[] = [];

      for (const holiday of holidays) {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);

        // Calculate alert date
        const alertDate = new Date(holidayDate);
        alertDate.setDate(alertDate.getDate() - daysBefore);
        alertDate.setHours(9, 0, 0, 0); // Alert at 9 AM

        // Only schedule if alert date is in the future
        if (alertDate > now) {
          const notification: LocalNotificationSchema = {
            id: this.generateNotificationId(NotificationType.HOLIDAY_ALERT, holiday.event),
            title: `📅 Upcoming Holiday: ${holiday.event}`,
            body: `${holiday.event} is coming up in ${daysBefore} day${daysBefore !== 1 ? 's' : ''}! Prepare mindfully.`,
            schedule: {
              at: alertDate,
              allowWhileIdle: true,
            },
            sound: 'gentle_reminder.mp3',
            smallIcon: 'ic_stat_notification',
            iconColor: '#FFA726',
            extra: {
              type: NotificationType.HOLIDAY_ALERT,
              holidayName: holiday.event,
              holidayDate: holiday.date,
            },
          };

          if (this.isAndroid) {
            (notification as any).channelId = this.getChannelId(NotificationType.HOLIDAY_ALERT);
          }

          notifications.push(notification);
        }
      }

      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Scheduled ${notifications.length} holiday alerts`);
      }
    } catch (error) {
      console.error('Error scheduling holiday alerts:', error);
      throw this.createError('schedule_error', 'Failed to schedule holiday alerts');
    }
  }

  /**
   * Cancel notification by ID
   */
  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log(`Notification ${id} cancelled`);
    } catch (error) {
      console.error(`Error canceling notification ${id}:`, error);
      throw this.createError('cancel_error', 'Failed to cancel notification');
    }
  }

  /**
   * Cancel all notifications of a specific type
   */
  async cancelNotificationsByType(type: NotificationType): Promise<void> {
    try {
      const pending = await this.getPendingNotifications();
      const typeNotifications = pending.filter(n => n.extra?.type === type);
      
      if (typeNotifications.length > 0) {
        await LocalNotifications.cancel({
          notifications: typeNotifications.map(n => ({ id: n.id })),
        });
        console.log(`Cancelled notifications of type: ${type}`);
      }
    } catch (error) {
      console.error('Error canceling notifications by type:', error);
      throw this.createError('cancel_error', 'Failed to cancel notifications');
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      const pending = await this.getPendingNotifications();
      if (pending.length > 0) {
        await LocalNotifications.cancel({
          notifications: pending.map(n => ({ id: n.id })),
        });
      }
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      throw this.createError('cancel_error', 'Failed to cancel all notifications');
    }
  }

  /**
   * Get all pending notifications
   */
  async getPendingNotifications(): Promise<LocalNotificationSchema[]> {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications || [];
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  /**
   * Generate unique notification ID based on type and optional identifier
   */
  private generateNotificationId(type: NotificationType, identifier?: string): number {
    const typeIds = {
      [NotificationType.DAILY_REMINDER]: 1000,
      [NotificationType.WEEKLY_WELLNESS]: 2000,
      [NotificationType.HOLIDAY_ALERT]: 3000,
    };

    const baseId = typeIds[type];
    
    if (identifier) {
      // Generate consistent ID from identifier string
      let hash = 0;
      for (let i = 0; i < identifier.length; i++) {
        hash = ((hash << 5) - hash) + identifier.charCodeAt(i);
        hash = hash & hash;
      }
      return baseId + Math.abs(hash % 1000);
    }
    
    return baseId;
  }

  /**
   * Create standardized error object
   */
  private createError(type: string, message: string): NotificationError {
    return {
      type: type as any,
      message,
      timestamp: new Date(),
    };
  }

  /**
   * Clean up listeners on service destruction
   */
  async destroy(): Promise<void> {
    try {
      await LocalNotifications.removeAllListeners();
      
      if (this.appStateListener) {
        this.appStateListener.remove();
      }
      
      console.log('NotificationService destroyed and listeners removed');
    } catch (error) {
      console.error('Error destroying NotificationService:', error);
    }
  }
}

// Export singleton instance
export default NotificationService.getInstance();
