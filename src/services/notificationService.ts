/**
 * Notification Service
 * Handles all notification scheduling, permissions, and management using Capacitor LocalNotifications
 */

import { LocalNotifications, ScheduleOptions } from '@capacitor/local-notifications';
import {
  NotificationType,
  type NotificationPreferences,
  type NotificationSchedule,
  type NotificationPermissionState,
  type NotificationError,
  type HolidayData,
} from '@/types/notifications';

class NotificationService {
  private static instance: NotificationService;
  private permissionState: NotificationPermissionState = {
    granted: false,
    denied: false,
    pending: true,
  };

  private constructor() {
    this.initializeListeners();
  }

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification event listeners
   */
  private initializeListeners(): void {
    LocalNotifications.addListener('localNotificationReceived', (notification) => {
      console.log('Notification received:', notification);
    });

    LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
      console.log('Notification action performed:', notification);
    });
  }

  /**
   * Request notification permissions with user-friendly explanation
   */
  async requestPermissions(): Promise<NotificationPermissionState> {
    try {
      const result = await LocalNotifications.requestPermissions();
      
      this.permissionState = {
        granted: result.display === 'granted',
        denied: result.display === 'denied',
        pending: false,
      };

      return this.permissionState;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      this.permissionState = {
        granted: false,
        denied: true,
        pending: false,
      };
      throw this.createError('permission_denied', 'Failed to request notification permissions');
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
   * Schedule daily holiday reminder at specified time (default 9 AM)
   */
  async scheduleDailyReminder(hour: number = 9, minute: number = 0): Promise<void> {
    if (!this.permissionState.granted) {
      throw this.createError('permission_denied', 'Notification permissions not granted');
    }

    try {
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: 1,
            title: '🇭🇰 Hong Kong Holiday Reminder',
            body: 'Check today\'s countdown to upcoming holidays!',
            schedule: {
              every: 'day',
              on: {
                hour,
                minute,
              },
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log('Daily reminder scheduled successfully');
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw this.createError('scheduling_failed', 'Failed to schedule daily reminder');
    }
  }

  /**
   * Schedule weekly wellness check-in (default: Sunday 8 PM)
   */
  async scheduleWeeklyWellness(
    dayOfWeek: number = 0,
    hour: number = 20,
    minute: number = 0
  ): Promise<void> {
    if (!this.permissionState.granted) {
      throw this.createError('permission_denied', 'Notification permissions not granted');
    }

    try {
      const notification: ScheduleOptions = {
        notifications: [
          {
            id: 2,
            title: '💚 Weekly Wellness Check-in',
            body: 'Take a moment to plan your upcoming week and upcoming holidays!',
            schedule: {
              every: 'week',
              on: {
                hour,
                minute,
                day: dayOfWeek,
              },
            },
          },
        ],
      };

      await LocalNotifications.schedule(notification);
      console.log('Weekly wellness check-in scheduled successfully');
    } catch (error) {
      console.error('Error scheduling weekly wellness:', error);
      throw this.createError('scheduling_failed', 'Failed to schedule weekly wellness check-in');
    }
  }

  /**
   * Schedule smart contextual alerts for upcoming holidays
   */
  async scheduleHolidayAlerts(
    holidays: HolidayData[],
    daysBeforeAlert: number = 3
  ): Promise<void> {
    if (!this.permissionState.granted) {
      throw this.createError('permission_denied', 'Notification permissions not granted');
    }

    try {
      // Cancel existing holiday alerts
      await this.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);

      const notifications: ScheduleOptions = {
        notifications: [],
      };

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      holidays.forEach((holiday, index) => {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);

        // Calculate alert date
        const alertDate = new Date(holidayDate);
        alertDate.setDate(alertDate.getDate() - daysBeforeAlert);
        alertDate.setHours(9, 0, 0, 0);

        // Only schedule if alert date is in the future
        if (alertDate > today) {
          notifications.notifications.push({
            id: 1000 + index, // Start from 1000 to avoid conflicts
            title: '🎉 Upcoming Holiday Alert',
            body: `${holiday.event} is coming up in ${daysBeforeAlert} days on ${this.formatDate(holidayDate)}!`,
            schedule: {
              at: alertDate,
            },
          });
        }
      });

      if (notifications.notifications.length > 0) {
        await LocalNotifications.schedule(notifications);
        console.log(`Scheduled ${notifications.notifications.length} holiday alerts`);
      }
    } catch (error) {
      console.error('Error scheduling holiday alerts:', error);
      throw this.createError('scheduling_failed', 'Failed to schedule holiday alerts');
    }
  }

  /**
   * Cancel specific notification by ID
   */
  async cancelNotification(id: number): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log(`Notification ${id} cancelled`);
    } catch (error) {
      console.error(`Error canceling notification ${id}:`, error);
      throw this.createError('unknown', 'Failed to cancel notification');
    }
  }

  /**
   * Cancel notifications by type
   */
  async cancelNotificationsByType(type: NotificationType): Promise<void> {
    try {
      const pending = await LocalNotifications.getPending();
      const idsToCancel: number[] = [];

      switch (type) {
        case NotificationType.DAILY_REMINDER:
          idsToCancel.push(1);
          break;
        case NotificationType.WEEKLY_WELLNESS:
          idsToCancel.push(2);
          break;
        case NotificationType.HOLIDAY_ALERT:
          // Holiday alerts use IDs starting from 1000
          pending.notifications.forEach((notif) => {
            if (notif.id >= 1000) {
              idsToCancel.push(notif.id);
            }
          });
          break;
      }

      if (idsToCancel.length > 0) {
        await LocalNotifications.cancel({
          notifications: idsToCancel.map((id) => ({ id })),
        });
        console.log(`Cancelled notifications of type: ${type}`);
      }
    } catch (error) {
      console.error(`Error canceling notifications by type ${type}:`, error);
      throw this.createError('unknown', 'Failed to cancel notifications by type');
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await LocalNotifications.cancel({ notifications: [] });
      console.log('All notifications cancelled');
    } catch (error) {
      console.error('Error canceling all notifications:', error);
      throw this.createError('unknown', 'Failed to cancel all notifications');
    }
  }

  /**
   * Get all pending notifications
   */
  async getPendingNotifications(): Promise<any[]> {
    try {
      const result = await LocalNotifications.getPending();
      return result.notifications;
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  /**
   * Helper method to format date
   */
  private formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  /**
   * Create standardized error object
   */
  private createError(
    type: NotificationError['type'],
    message: string
  ): NotificationError {
    return {
      type,
      message,
      timestamp: new Date(),
    };
  }

  /**
   * Get current permission state
   */
  getPermissionState(): NotificationPermissionState {
    return { ...this.permissionState };
  }
}

export default NotificationService.getInstance();
