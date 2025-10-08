/**
 * Notification Service (JavaScript Version)
 * Handles all notification scheduling, permissions, and management using Capacitor LocalNotifications
 */

import { LocalNotifications } from '@capacitor/local-notifications';
import { NotificationType } from '../types/notifications.js';

class NotificationService {
  constructor() {
    this.permissionState = {
      granted: false,
      denied: false,
      pending: true,
    };
    this.initializeListeners();
  }

  static getInstance() {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Initialize notification event listeners
   */
  initializeListeners() {
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
  async requestPermissions() {
    try {
      const result = await LocalNotifications.requestPermissions();
      this.permissionState = {
        granted: result.display === 'granted',
        denied: result.display === 'denied',
        pending: result.display === 'prompt',
      };
      console.log('Notification permissions:', this.permissionState);
      return this.permissionState;
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      throw new Error('Failed to request notification permissions' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Check current permission status
   */
  async checkPermissions() {
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
   * Schedule daily holiday reminder
   */
  async scheduleDailyReminder(hour = 9, minute = 0) {
    const startTime = Date.now();
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

      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.generateNotificationId(NotificationType.DAILY_REMINDER),
            title: '🌅 Daily Holiday Reminder',
            body: 'Start your day mindfully with awareness of upcoming Hong Kong holidays',
            schedule: {
              at: scheduledTime,
              every: 'day',
            },
            extra: {
              type: NotificationType.DAILY_REMINDER,
            },
          },
        ],
      });

      console.log('Daily reminder scheduled successfully');
      const duration = Date.now() - startTime;
      console.log(`Notification scheduling performance: ${duration}ms`);
    } catch (error) {
      console.error('Error scheduling daily reminder:', error);
      throw new Error('Failed to schedule daily reminder' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Schedule weekly wellness check-in
   */
  async scheduleWeeklyWellness(dayOfWeek = 0, hour = 20, minute = 0) {
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

      await LocalNotifications.schedule({
        notifications: [
          {
            id: this.generateNotificationId(NotificationType.WEEKLY_WELLNESS),
            title: '💚 Weekly Wellness Check-in',
            body: 'Take a moment to plan ahead and reflect on your work-life balance',
            schedule: {
              at: scheduledTime,
              every: 'week',
            },
            extra: {
              type: NotificationType.WEEKLY_WELLNESS,
            },
          },
        ],
      });

      console.log('Weekly wellness check-in scheduled successfully');
    } catch (error) {
      console.error('Error scheduling weekly wellness:', error);
      throw new Error('Failed to schedule weekly wellness' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Schedule holiday alerts based on upcoming holidays
   */
  async scheduleHolidayAlerts(holidays, daysBefore = 3) {
    try {
      await this.cancelNotificationsByType(NotificationType.HOLIDAY_ALERT);
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const notifications = [];
      // Limit to 10 alerts to preserve battery
      const limitedHolidays = holidays.slice(0, 10);
      for (const holiday of limitedHolidays) {
        const holidayDate = new Date(holiday.date);
        holidayDate.setHours(0, 0, 0, 0);
        // Calculate alert date
        const alertDate = new Date(holidayDate);
        alertDate.setDate(alertDate.getDate() - daysBefore);
        alertDate.setHours(9, 0, 0, 0); // Alert at 9 AM
        // Only schedule if alert date is in the future
        if (alertDate > now) {
          notifications.push({
            id: this.generateNotificationId(NotificationType.HOLIDAY_ALERT, holiday.event),
            title: `📅 Upcoming Holiday: ${holiday.event}`,
            body: `${holiday.event} is coming up in ${daysBefore} day${daysBefore !== 1 ? 's' : ''}! Prepare mindfully.`,
            schedule: {
              at: alertDate,
            },
            extra: {
              type: NotificationType.HOLIDAY_ALERT,
              holidayName: holiday.event,
              holidayDate: holiday.date,
            },
          });
        }
      }
      if (notifications.length > 0) {
        await LocalNotifications.schedule({ notifications });
        console.log(`Scheduled ${notifications.length} holiday alerts`);
      }
    } catch (error) {
      console.error('Error scheduling holiday alerts:', error);
      throw new Error('Failed to schedule holiday alerts' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Cancel notification by ID
   */
  async cancelNotification(id) {
    try {
      await LocalNotifications.cancel({ notifications: [{ id }] });
      console.log(`Notification ${id} cancelled`);
    } catch (error) {
      console.error(`Error canceling notification ${id}:`, error);
      throw new Error('Failed to cancel notification' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Cancel all notifications of a specific type
   */
  async cancelNotificationsByType(type) {
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
      throw new Error('Failed to cancel notifications' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications() {
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
      throw new Error('Failed to cancel all notifications' + (error.message ? `: ${error.message}` : ''));
    }
  }

  /**
   * Get all pending notifications
   */
  async getPendingNotifications() {
    try {
      const result = await LocalNotifications.getPending();
      return (result && result.notifications) ? result.notifications : [];
    } catch (error) {
      console.error('Error getting pending notifications:', error);
      return [];
    }
  }

  /**
   * Generate unique notification ID based on type and optional identifier
   */
  generateNotificationId(type, identifier) {
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
}

// Export singleton instance
const notificationServiceInstance = NotificationService.getInstance();
export default notificationServiceInstance;
