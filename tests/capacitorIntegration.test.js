/**
 * Integration tests for Capacitor plugin interactions
 */
import { describe, it, expect, vi } from 'vitest';
import { LocalNotifications } from '@capacitor/local-notifications';
import notificationService from '../src/services/notificationService.js';

describe('Capacitor Plugin Integration', () => {
    it('should request permissions using Capacitor plugin', async () => {
        vi.spyOn(LocalNotifications, 'requestPermissions').mockResolvedValue({ display: true });
        const result = await notificationService.requestPermissions();
        expect(result).toHaveProperty('granted');
    });

    it('should schedule notification using Capacitor plugin', async () => {
        const scheduleSpy = vi.spyOn(LocalNotifications, 'schedule').mockResolvedValue({ notifications: [{ id: 1 }] });
        const result = await notificationService.scheduleDailyReminder(9, 0, { title: 'Test', body: 'Body' });
        expect(scheduleSpy).toHaveBeenCalled();
    });

    it('should cancel notification using Capacitor plugin', async () => {
        const cancelSpy = vi.spyOn(LocalNotifications, 'cancel').mockResolvedValue({ notifications: [{ id: 1 }] });
        const getPendingSpy = vi.spyOn(LocalNotifications, 'getPending').mockResolvedValue({ notifications: [{ id: 1000, extra: { type: 'daily_reminder' } }] });
        const { NotificationType } = require('../src/types/notifications.js');
        await notificationService.cancelNotificationsByType(NotificationType.DAILY_REMINDER);
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('should get pending notifications using Capacitor plugin', async () => {
        vi.spyOn(LocalNotifications, 'getPending').mockResolvedValue({ notifications: [{ id: 1 }] });
        const result = await notificationService.getPendingNotifications();
        expect(Array.isArray(result)).toBe(true);
    });

    it('should handle plugin errors gracefully', async () => {
        vi.spyOn(LocalNotifications, 'schedule').mockRejectedValue(new Error('Plugin error'));
        await expect(notificationService.scheduleDailyReminder(9, 0, { title: 'Test', body: 'Body' })).rejects.toThrow('Plugin error');
    });
});
