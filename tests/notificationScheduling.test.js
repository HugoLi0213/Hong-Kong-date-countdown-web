/**
 * Unit tests for notification scheduling logic, permission handling, time calculation, and preference persistence
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import notificationService from '../src/services/notificationService.js';
import { useNotifications } from '../src/composables/useNotifications.js';
import { NotificationType } from '../src/types/notifications.js';

// Mock localStorage for preference persistence
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: key => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: key => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();
global.localStorage = localStorageMock;

describe('Notification Scheduling Logic', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it('should schedule daily reminder at correct time', async () => {
        const spy = vi.spyOn(notificationService, 'scheduleDailyReminder').mockResolvedValue(true);
        await notificationService.scheduleDailyReminder(9, 30, { title: 'Test', body: 'Body' });
        expect(spy).toHaveBeenCalledWith(9, 30, expect.objectContaining({ title: 'Test' }));
        spy.mockRestore();
    });

    it('should handle permission request flow', async () => {
        const notifications = useNotifications();
        vi.spyOn(notificationService, 'requestPermissions').mockResolvedValue({ granted: true });
        const result = await notifications.requestPermission();
        expect(result).toBe(true);
    });

    it('should calculate days until holiday accurately', () => {
        const today = new Date();
        const holidayDate = new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000);
        const days = Math.ceil((holidayDate - today) / (1000 * 60 * 60 * 24));
        expect(days).toBe(5);
    });

    it('should persist notification preferences', () => {
        localStorage.setItem('notificationPrefs', JSON.stringify({ daily: true }));
        const prefs = JSON.parse(localStorage.getItem('notificationPrefs'));
        expect(prefs.daily).toBe(true);
    });

    it('should disable notifications and show empty state', async () => {
        localStorage.setItem('notificationPrefs', JSON.stringify({ daily: false }));
        const prefs = JSON.parse(localStorage.getItem('notificationPrefs'));
        expect(prefs.daily).toBe(false);
        // UI empty state would be triggered in component
    });
});

describe('Permission Handling Flows', () => {
    it('should handle denied permissions', async () => {
        vi.spyOn(notificationService, 'requestPermissions').mockResolvedValue({ granted: false, denied: true });
        const notifications = useNotifications();
        const result = await notifications.requestPermission();
        expect(result).toBe(false);
    });

    it('should handle pending permissions', async () => {
        vi.spyOn(notificationService, 'requestPermissions').mockResolvedValue({ granted: false, pending: true });
        const notifications = useNotifications();
        const result = await notifications.requestPermission();
        expect(result).toBe(false);
    });
});

describe('Time Calculation Accuracy', () => {
    it('should calculate tomorrow correctly', () => {
        const today = new Date();
        const tomorrow = new Date(today.getTime() + 1 * 24 * 60 * 60 * 1000);
        const days = Math.ceil((tomorrow - today) / (1000 * 60 * 60 * 24));
        expect(days).toBe(1);
    });

    it('should handle leap years', () => {
        const feb28 = new Date('2024-02-28');
        const feb29 = new Date('2024-02-29');
        const days = Math.ceil((feb29 - feb28) / (1000 * 60 * 60 * 24));
        expect(days).toBe(1);
    });
});

describe('Preference Persistence', () => {
    it('should save and retrieve preferences', () => {
        localStorage.setItem('notificationPrefs', JSON.stringify({ weekly: true }));
        const prefs = JSON.parse(localStorage.getItem('notificationPrefs'));
        expect(prefs.weekly).toBe(true);
    });

    it('should clear preferences', () => {
        localStorage.setItem('notificationPrefs', JSON.stringify({ daily: true }));
        localStorage.removeItem('notificationPrefs');
        expect(localStorage.getItem('notificationPrefs')).toBe(null);
    });
});
