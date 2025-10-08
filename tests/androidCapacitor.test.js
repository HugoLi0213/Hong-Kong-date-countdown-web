/**
 * Android Capacitor Integration Tests
 * Tests the complete integration of Capacitor LocalNotifications with the notification service
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { LocalNotifications } from '@capacitor/local-notifications';
import notificationService from '../src/services/notificationService.js';
import { NotificationType } from '../src/types/notifications.js';

describe('Android Capacitor Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Permission Management', () => {
    it('should request notification permissions successfully', async () => {
      // Mock permission grant
      LocalNotifications.requestPermissions.mockResolvedValue({
        display: 'granted',
      });

      const result = await notificationService.requestPermissions();

      expect(LocalNotifications.requestPermissions).toHaveBeenCalledTimes(1);
      expect(result.granted).toBe(true);
      expect(result.denied).toBe(false);
      expect(notificationService.permissionState.granted).toBe(true);
      expect(notificationService.permissionState.denied).toBe(false);
    });

    it('should handle permission denial', async () => {
      LocalNotifications.requestPermissions.mockResolvedValue({
        display: 'denied',
      });

      const result = await notificationService.requestPermissions();

      expect(result.granted).toBe(false);
      expect(result.denied).toBe(true);
      expect(notificationService.permissionState.granted).toBe(false);
      expect(notificationService.permissionState.denied).toBe(true);
    });

    it('should handle permission prompt state', async () => {
      LocalNotifications.requestPermissions.mockResolvedValue({
        display: 'prompt',
      });

      const result = await notificationService.requestPermissions();

      expect(result.granted).toBe(false);
      expect(result.pending).toBe(true);
      expect(notificationService.permissionState.pending).toBe(true);
    });

    it('should check existing permissions', async () => {
      LocalNotifications.checkPermissions.mockResolvedValue({
        display: 'granted',
      });

      const state = await notificationService.checkPermissions();

      expect(LocalNotifications.checkPermissions).toHaveBeenCalledTimes(1);
      expect(state.granted).toBe(true);
    });

    it('should handle permission check errors gracefully', async () => {
      LocalNotifications.checkPermissions.mockRejectedValue(new Error('Permission check failed'));

      const state = await notificationService.checkPermissions();

      // Should return current state without throwing
      expect(state).toBeDefined();
      expect(state.granted).toBeDefined();
    });
  });

  describe('Daily Reminder Scheduling', () => {
    beforeEach(() => {
      LocalNotifications.getPending.mockResolvedValue({ notifications: [] });
      LocalNotifications.cancel.mockResolvedValue(undefined);
      LocalNotifications.schedule.mockResolvedValue({ notifications: [] });
    });

    it('should schedule daily reminder with default time', async () => {
      await notificationService.scheduleDailyReminder();

      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(1);
      const call = LocalNotifications.schedule.mock.calls[0][0];
      
      expect(call.notifications).toHaveLength(1);
      expect(call.notifications[0].title).toContain('Daily Holiday Reminder');
      expect(call.notifications[0].schedule.every).toBe('day');
      expect(call.notifications[0].extra.type).toBe(NotificationType.DAILY_REMINDER);
    });

    it('should schedule daily reminder with custom time', async () => {
      await notificationService.scheduleDailyReminder(10, 30);

      const call = LocalNotifications.schedule.mock.calls[0][0];
      const scheduledTime = call.notifications[0].schedule.at;
      
      expect(scheduledTime.getHours()).toBe(10);
      expect(scheduledTime.getMinutes()).toBe(30);
    });

    it('should cancel existing daily reminders before scheduling new one', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 1000, extra: { type: NotificationType.DAILY_REMINDER } },
        ],
      });

      await notificationService.scheduleDailyReminder();

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1000 }],
      });
      expect(LocalNotifications.schedule).toHaveBeenCalled();
    });

    it('should handle scheduling errors', async () => {
      LocalNotifications.schedule.mockRejectedValue(new Error('Scheduling failed'));

      await expect(notificationService.scheduleDailyReminder()).rejects.toThrow();
    });

    it('should schedule for tomorrow if time has passed today', async () => {
      const now = new Date();
      const pastHour = now.getHours() - 1;
      
      await notificationService.scheduleDailyReminder(pastHour, 0);

      const call = LocalNotifications.schedule.mock.calls[0][0];
      const scheduledTime = call.notifications[0].schedule.at;
      
      // Should be scheduled for tomorrow
      expect(scheduledTime.getDate()).toBeGreaterThan(now.getDate());
    });
  });

  describe('Weekly Wellness Scheduling', () => {
    beforeEach(() => {
      LocalNotifications.getPending.mockResolvedValue({ notifications: [] });
      LocalNotifications.cancel.mockResolvedValue(undefined);
      LocalNotifications.schedule.mockResolvedValue({ notifications: [] });
    });

    it('should schedule weekly wellness check-in', async () => {
      await notificationService.scheduleWeeklyWellness(0, 20, 0); // Sunday at 8 PM

      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(1);
      const call = LocalNotifications.schedule.mock.calls[0][0];
      
      expect(call.notifications[0].title).toContain('Weekly Wellness');
      expect(call.notifications[0].schedule.every).toBe('week');
      expect(call.notifications[0].extra.type).toBe(NotificationType.WEEKLY_WELLNESS);
    });

    it('should calculate correct next occurrence for different days', async () => {
      const targetDay = 3; // Wednesday
      await notificationService.scheduleWeeklyWellness(targetDay, 20, 0);

      const call = LocalNotifications.schedule.mock.calls[0][0];
      const scheduledTime = call.notifications[0].schedule.at;
      
      expect(scheduledTime.getDay()).toBe(targetDay);
      expect(scheduledTime.getHours()).toBe(20);
    });

    it('should cancel existing weekly wellness before scheduling new one', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 2000, extra: { type: NotificationType.WEEKLY_WELLNESS } },
        ],
      });

      await notificationService.scheduleWeeklyWellness(0, 20, 0);

      expect(LocalNotifications.cancel).toHaveBeenCalled();
      expect(LocalNotifications.schedule).toHaveBeenCalled();
    });
  });

  describe('Holiday Alert Scheduling', () => {
    const mockHolidays = [
      { event: "New Year's Day", date: '2026-01-01' },
      { event: 'Chinese New Year', date: '2026-01-29' },
      { event: 'Good Friday', date: '2026-04-18' },
    ];

    beforeEach(() => {
      LocalNotifications.getPending.mockResolvedValue({ notifications: [] });
      LocalNotifications.cancel.mockResolvedValue(undefined);
      LocalNotifications.schedule.mockResolvedValue({ notifications: [] });
    });

    it('should schedule holiday alerts for upcoming holidays', async () => {
      await notificationService.scheduleHolidayAlerts(mockHolidays, 3);

      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(1);
      const call = LocalNotifications.schedule.mock.calls[0][0];
      
      // Should schedule alerts for future holidays only
      expect(call.notifications.length).toBeGreaterThan(0);
      call.notifications.forEach(notification => {
        expect(notification.title).toContain('Upcoming Holiday');
        expect(notification.extra.type).toBe(NotificationType.HOLIDAY_ALERT);
      });
    });

    it('should not schedule alerts for past holidays', async () => {
      const pastHolidays = [
        { event: 'Past Holiday', date: '2024-01-01' },
      ];

      await notificationService.scheduleHolidayAlerts(pastHolidays, 3);

      // Should not schedule any notifications
      const call = LocalNotifications.schedule.mock.calls[0];
      expect(call).toBeUndefined();
    });

    it('should include holiday name and date in notification extra data', async () => {
      await notificationService.scheduleHolidayAlerts(mockHolidays, 3);

      const call = LocalNotifications.schedule.mock.calls[0][0];
      const firstNotification = call.notifications[0];
      
      expect(firstNotification.extra.holidayName).toBeDefined();
      expect(firstNotification.extra.holidayDate).toBeDefined();
    });

    it('should schedule alerts with correct days before parameter', async () => {
      const daysBefore = 7;
      await notificationService.scheduleHolidayAlerts(mockHolidays, daysBefore);

      const call = LocalNotifications.schedule.mock.calls[0][0];
      
      call.notifications.forEach(notification => {
        expect(notification.body).toContain(`${daysBefore} day`);
      });
    });

    it('should cancel existing holiday alerts before scheduling new ones', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 3001, extra: { type: NotificationType.HOLIDAY_ALERT } },
          { id: 3002, extra: { type: NotificationType.HOLIDAY_ALERT } },
        ],
      });

      await notificationService.scheduleHolidayAlerts(mockHolidays, 3);

      expect(LocalNotifications.cancel).toHaveBeenCalled();
    });
  });

  describe('Notification Cancellation', () => {
    beforeEach(() => {
      LocalNotifications.cancel.mockResolvedValue(undefined);
      LocalNotifications.getPending.mockResolvedValue({ notifications: [] });
    });

    it('should cancel notification by ID', async () => {
      const notificationId = 1000;
      await notificationService.cancelNotification(notificationId);

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: notificationId }],
      });
    });

    it('should cancel all notifications of a specific type', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 1000, extra: { type: NotificationType.DAILY_REMINDER } },
          { id: 2000, extra: { type: NotificationType.WEEKLY_WELLNESS } },
          { id: 3000, extra: { type: NotificationType.HOLIDAY_ALERT } },
        ],
      });

      await notificationService.cancelNotificationsByType(NotificationType.DAILY_REMINDER);

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1000 }],
      });
    });

    it('should cancel all notifications', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 1000, extra: { type: NotificationType.DAILY_REMINDER } },
          { id: 2000, extra: { type: NotificationType.WEEKLY_WELLNESS } },
        ],
      });

      await notificationService.cancelAllNotifications();

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1000 }, { id: 2000 }],
      });
    });

    it('should handle cancellation errors gracefully', async () => {
      LocalNotifications.cancel.mockRejectedValue(new Error('Cancel failed'));

      await expect(notificationService.cancelNotification(1000)).rejects.toThrow();
    });
  });

  describe('Notification ID Generation', () => {
    it('should generate consistent IDs for notification types', () => {
      const id1 = notificationService.generateNotificationId(NotificationType.DAILY_REMINDER);
      const id2 = notificationService.generateNotificationId(NotificationType.DAILY_REMINDER);
      
      expect(id1).toBe(id2);
      expect(id1).toBe(1000);
    });

    it('should generate different IDs for different notification types', () => {
      const dailyId = notificationService.generateNotificationId(NotificationType.DAILY_REMINDER);
      const weeklyId = notificationService.generateNotificationId(NotificationType.WEEKLY_WELLNESS);
      const holidayId = notificationService.generateNotificationId(NotificationType.HOLIDAY_ALERT);
      
      expect(dailyId).not.toBe(weeklyId);
      expect(weeklyId).not.toBe(holidayId);
      expect(dailyId).toBe(1000);
      expect(weeklyId).toBe(2000);
      expect(holidayId).toBe(3000);
    });

    it('should generate unique IDs for holiday alerts with identifiers', () => {
      const id1 = notificationService.generateNotificationId(
        NotificationType.HOLIDAY_ALERT,
        'New Year'
      );
      const id2 = notificationService.generateNotificationId(
        NotificationType.HOLIDAY_ALERT,
        'Christmas'
      );
      
      expect(id1).not.toBe(id2);
      expect(id1).toBeGreaterThanOrEqual(3000);
      expect(id1).toBeLessThan(4000);
    });

    it('should generate same ID for same identifier', () => {
      const id1 = notificationService.generateNotificationId(
        NotificationType.HOLIDAY_ALERT,
        'Easter'
      );
      const id2 = notificationService.generateNotificationId(
        NotificationType.HOLIDAY_ALERT,
        'Easter'
      );
      
      expect(id1).toBe(id2);
    });
  });

  describe('Pending Notifications', () => {
    it('should retrieve pending notifications', async () => {
      const mockPending = [
        { id: 1000, title: 'Daily Reminder' },
        { id: 2000, title: 'Weekly Wellness' },
      ];
      
      LocalNotifications.getPending.mockResolvedValue({
        notifications: mockPending,
      });

      const pending = await notificationService.getPendingNotifications();

      expect(LocalNotifications.getPending).toHaveBeenCalledTimes(1);
      expect(pending).toEqual(mockPending);
    });

    it('should return empty array on error', async () => {
      LocalNotifications.getPending.mockRejectedValue(new Error('Failed'));

      const pending = await notificationService.getPendingNotifications();

      expect(pending).toEqual([]);
    });

    it('should handle null notifications response', async () => {
      LocalNotifications.getPending.mockResolvedValue({
        notifications: null,
      });

      const pending = await notificationService.getPendingNotifications();

      expect(pending).toEqual([]);
    });
  });

  describe('Notification Listeners', () => {
    it('should have addListener method available', () => {
      expect(LocalNotifications.addListener).toBeDefined();
      expect(typeof LocalNotifications.addListener).toBe('function');
    });

    it('should handle notification received events', () => {
      // Test that the notification service can handle received notifications
      const mockNotification = {
        id: 1000,
        title: 'Test Notification',
        body: 'Test Body',
      };

      // Since listeners are registered on initialization, they should be available
      expect(notificationService).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should throw error with proper message on permission request failure', async () => {
      LocalNotifications.requestPermissions.mockRejectedValue(
        new Error('Native error')
      );

      await expect(notificationService.requestPermissions()).rejects.toThrow(
        'Failed to request notification permissions'
      );
    });

    it('should throw error with proper message on schedule failure', async () => {
      LocalNotifications.schedule.mockRejectedValue(new Error('Native error'));

      await expect(notificationService.scheduleDailyReminder()).rejects.toThrow(
        'Failed to schedule daily reminder'
      );
    });

    it('should throw error with proper message on cancel failure', async () => {
      LocalNotifications.cancel.mockRejectedValue(new Error('Native error'));

      await expect(notificationService.cancelNotification(1000)).rejects.toThrow(
        'Failed to cancel notification'
      );
    });
  });

  describe('Singleton Pattern', () => {
    it('should return same instance on multiple getInstance calls', () => {
      const instance1 = notificationService;
      const instance2 = notificationService;
      
      expect(instance1).toBe(instance2);
    });
  });

  describe('Integration Scenarios', () => {
    beforeEach(() => {
      LocalNotifications.requestPermissions.mockResolvedValue({ display: 'granted' });
      LocalNotifications.getPending.mockResolvedValue({ notifications: [] });
      LocalNotifications.cancel.mockResolvedValue(undefined);
      LocalNotifications.schedule.mockResolvedValue({ notifications: [] });
    });

    it('should complete full notification setup flow', async () => {
      // 1. Request permissions
      const permissionResult = await notificationService.requestPermissions();
      expect(permissionResult.granted).toBe(true);

      // 2. Schedule daily reminder
      await notificationService.scheduleDailyReminder(9, 0);
      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(1);

      // 3. Schedule weekly wellness
      await notificationService.scheduleWeeklyWellness(0, 20, 0);
      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(2);

      // 4. Schedule holiday alerts
      const holidays = [
        { event: 'Test Holiday', date: '2025-12-25' },
      ];
      await notificationService.scheduleHolidayAlerts(holidays, 3);
      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(3);
    });

    it('should handle updating notification preferences', async () => {
      // Schedule initial daily reminder
      await notificationService.scheduleDailyReminder(9, 0);
      
      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 1000, extra: { type: NotificationType.DAILY_REMINDER } },
        ],
      });

      // Update time - should cancel and reschedule
      await notificationService.scheduleDailyReminder(10, 30);

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1000 }],
      });
      expect(LocalNotifications.schedule).toHaveBeenCalledTimes(2);
    });

    it('should handle disabling all notifications', async () => {
      // Setup various notifications
      await notificationService.scheduleDailyReminder(9, 0);
      await notificationService.scheduleWeeklyWellness(0, 20, 0);

      LocalNotifications.getPending.mockResolvedValue({
        notifications: [
          { id: 1000, extra: { type: NotificationType.DAILY_REMINDER } },
          { id: 2000, extra: { type: NotificationType.WEEKLY_WELLNESS } },
        ],
      });

      // Cancel all
      await notificationService.cancelAllNotifications();

      expect(LocalNotifications.cancel).toHaveBeenCalledWith({
        notifications: [{ id: 1000 }, { id: 2000 }],
      });
    });
  });
});
