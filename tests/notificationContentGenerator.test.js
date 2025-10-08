/**
 * Tests for Notification Content Generator
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateNotificationContent,
  generateMultiHolidayContent,
  getWellnessTip,
} from '../src/services/notificationContentGenerator.js';
import { NotificationType } from '../src/types/notifications.js';

describe('Notification Content Generator', () => {
  // Sample holiday data
  const sampleHoliday = {
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    event: 'Dragon Boat Festival',
    description: 'Traditional Chinese festival',
  };

  const todayHoliday = {
    date: new Date().toISOString(),
    event: 'Christmas Day',
    description: 'Christian holiday',
  };

  const tomorrowHoliday = {
    date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    event: 'Boxing Day',
    description: 'Day after Christmas',
  };

  const threeDaysHoliday = {
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    event: 'New Year\'s Day',
    description: 'First day of the year',
  };

  describe('Daily Reminder Content Generation', () => {
    it('should generate English daily reminder content', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.body).toBeDefined();
      expect(result.actionButtons).toHaveLength(2);
      expect(result.body).toContain('Dragon Boat Festival');
      expect(result.title).toMatch(/🌅|🌸|☀️/); // Should contain an emoji
    });

    it('should generate Traditional Chinese daily reminder content', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'zh',
        NotificationType.DAILY_REMINDER
      );

      expect(result).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.body).toBeDefined();
      expect(result.actionButtons).toHaveLength(2);
      expect(result.body).toContain('Dragon Boat Festival');
      expect(result.title).toMatch(/🌅|🌸|☀️/);
    });

    it('should include countdown information in body', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toMatch(/In \d+ days|Today|Tomorrow/);
    });

    it('should add planning message for upcoming holidays', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toContain('🌿');
    });

    it('should show "Today" for current day holidays', () => {
      const result = generateNotificationContent(
        todayHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toContain('Today');
      expect(result.body).toContain('Enjoy your holiday');
    });

    it('should show "Tomorrow" for next day holidays', () => {
      const result = generateNotificationContent(
        tomorrowHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toContain('Tomorrow');
    });

    it('should detect long weekends when provided with all holidays', () => {
      const fridayHoliday = {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Good Friday',
      };
      
      // Set the date to be a Friday
      const date = new Date(fridayHoliday.date);
      date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7));
      fridayHoliday.date = date.toISOString();

      const result = generateNotificationContent(
        fridayHoliday,
        'en',
        NotificationType.DAILY_REMINDER,
        { allHolidays: [fridayHoliday] }
      );

      expect(result.body).toContain('Long weekend');
    });

    it('should have valid action buttons with correct structure', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.actionButtons).toBeDefined();
      expect(result.actionButtons[0]).toHaveProperty('title');
      expect(result.actionButtons[0]).toHaveProperty('action');
      expect(result.actionButtons[0].action).toBe('view_details');
    });
  });

  describe('Weekly Wellness Content Generation', () => {
    it('should generate English weekly wellness content', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.WEEKLY_WELLNESS
      );

      expect(result).toBeDefined();
      expect(result.title).toMatch(/💚|🧘|🌿/);
      expect(result.body).toMatch(/Good morning|Good afternoon|Good evening/);
      expect(result.actionButtons).toHaveLength(2);
    });

    it('should generate Traditional Chinese weekly wellness content', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'zh',
        NotificationType.WEEKLY_WELLNESS
      );

      expect(result).toBeDefined();
      expect(result.title).toMatch(/💚|🧘|🌿/);
      expect(result.body).toMatch(/早晨好|午安|晚上好/);
      expect(result.actionButtons).toHaveLength(2);
    });

    it('should include upcoming holiday information', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.WEEKLY_WELLNESS,
        { upcomingHolidays: [sampleHoliday] }
      );

      expect(result.body).toContain('Coming up');
      expect(result.body).toContain('Dragon Boat Festival');
    });

    it('should show wellness message when no upcoming holidays', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.WEEKLY_WELLNESS,
        { upcomingHolidays: [] }
      );

      expect(result.body).toMatch(/deep breath|care for yourself/);
    });

    it('should adapt greeting based on time of day', () => {
      // Mock different times
      const originalDate = Date;
      
      // Morning test
      vi.spyOn(global, 'Date').mockImplementation(() => {
        const d = new originalDate();
        d.getHours = () => 9;
        return d;
      });

      const morningResult = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.WEEKLY_WELLNESS
      );
      expect(morningResult.body).toContain('Good morning');

      vi.restoreAllMocks();
    });
  });

  describe('Holiday Alert Content Generation', () => {
    it('should generate English holiday alert content', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT,
        { daysBeforeAlert: 3 }
      );

      expect(result).toBeDefined();
      expect(result.title).toContain('🎉');
      expect(result.body).toContain('New Year\'s Day');
      expect(result.actionButtons).toHaveLength(3);
    });

    it('should generate Traditional Chinese holiday alert content', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'zh',
        NotificationType.HOLIDAY_ALERT,
        { daysBeforeAlert: 3 }
      );

      expect(result).toBeDefined();
      expect(result.body).toContain('New Year\'s Day');
      expect(result.actionButtons).toHaveLength(3);
    });

    it('should show different messages based on days until holiday', () => {
      const sevenDaysResult = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT,
        { daysBeforeAlert: 7 }
      );

      expect(sevenDaysResult.body).toContain('Plan ahead');

      const threeDaysResult = generateNotificationContent(
        threeDaysHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT,
        { daysBeforeAlert: 3 }
      );

      expect(threeDaysResult.body).toContain('wrap up work');
    });

    it('should include long weekend detection', () => {
      const fridayHoliday = {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Good Friday',
      };
      
      // Set to Friday
      const date = new Date(fridayHoliday.date);
      date.setDate(date.getDate() + ((5 - date.getDay() + 7) % 7));
      fridayHoliday.date = date.toISOString();

      const result = generateNotificationContent(
        fridayHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT,
        { allHolidays: [fridayHoliday] }
      );

      expect(result.body).toMatch(/long weekend/i);
    });

    it('should include wellness tips', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT
      );

      expect(result.body).toMatch(/🌿|🧘|🔋/);
    });

    it('should have appropriate action buttons', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT
      );

      expect(result.actionButtons[0].action).toBe('view_holiday_details');
      expect(result.actionButtons[1].action).toBe('plan_activities');
      expect(result.actionButtons[2].action).toBe('dismiss');
    });
  });

  describe('Urgent Notification Content Generation', () => {
    it('should generate English urgent notification', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'en',
        'urgent'
      );

      expect(result).toBeDefined();
      expect(result.title).toContain('⚡');
      expect(result.title).toContain('Important');
      expect(result.body).toContain('just');
      expect(result.actionButtons).toHaveLength(2);
    });

    it('should generate Traditional Chinese urgent notification', () => {
      const result = generateNotificationContent(
        threeDaysHoliday,
        'zh',
        'urgent'
      );

      expect(result).toBeDefined();
      expect(result.title).toContain('⚡');
      expect(result.title).toContain('重要');
      expect(result.actionButtons).toHaveLength(2);
    });
  });

  describe('Multi-Holiday Content Generation', () => {
    const multipleHolidays = [
      {
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Dragon Boat Festival',
      },
      {
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Mid-Autumn Festival',
      },
      {
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'National Day',
      },
    ];

    it('should generate English multi-holiday summary', () => {
      const result = generateMultiHolidayContent(multipleHolidays, 'en');

      expect(result).toBeDefined();
      expect(result.title).toContain('Upcoming Holidays');
      expect(result.body).toContain('Dragon Boat Festival');
      expect(result.body).toContain('Mid-Autumn Festival');
      expect(result.body).toContain('National Day');
      expect(result.body).toMatch(/•/);
    });

    it('should generate Traditional Chinese multi-holiday summary', () => {
      const result = generateMultiHolidayContent(multipleHolidays, 'zh');

      expect(result).toBeDefined();
      expect(result.title).toContain('即將到來的假期');
      expect(result.body).toContain('Dragon Boat Festival');
    });

    it('should handle empty holiday list', () => {
      const result = generateMultiHolidayContent([], 'en');

      expect(result).toBeDefined();
      expect(result.title).toContain('No Upcoming Holidays');
      expect(result.body).toMatch(/Stay focused/);
    });

    it('should accept custom title', () => {
      const customTitle = 'This Month\'s Holidays';
      const result = generateMultiHolidayContent(
        multipleHolidays,
        'en',
        customTitle
      );

      expect(result.title).toBe(customTitle);
    });

    it('should include countdown for each holiday', () => {
      const result = generateMultiHolidayContent(multipleHolidays, 'en');

      expect(result.body).toMatch(/In \d+ days/);
    });
  });

  describe('Wellness Tips', () => {
    it('should return English wellness tip', () => {
      const tip = getWellnessTip('en');

      expect(tip).toBeDefined();
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
      expect(tip).toMatch(/🧘|😴|👨‍👩‍👧‍👦|🏃|🌬️|⏰|🌳|🙏/);
    });

    it('should return Traditional Chinese wellness tip', () => {
      const tip = getWellnessTip('zh');

      expect(tip).toBeDefined();
      expect(typeof tip).toBe('string');
      expect(tip.length).toBeGreaterThan(0);
      expect(tip).toMatch(/🧘|😴|👨‍👩‍👧‍👦|🏃|🌬️|⏰|🌳|🙏/);
    });

    it('should return different tips on multiple calls', () => {
      const tips = new Set();
      for (let i = 0; i < 20; i++) {
        tips.add(getWellnessTip('en'));
      }

      // Should have some variety
      expect(tips.size).toBeGreaterThan(1);
    });
  });

  describe('Input Validation', () => {
    it('should throw error for invalid holiday object', () => {
      expect(() => {
        generateNotificationContent(null, 'en', NotificationType.DAILY_REMINDER);
      }).toThrow('Invalid holiday object');
    });

    it('should throw error for holiday missing event', () => {
      expect(() => {
        generateNotificationContent(
          { date: new Date().toISOString() },
          'en',
          NotificationType.DAILY_REMINDER
        );
      }).toThrow('Invalid holiday object');
    });

    it('should throw error for holiday missing date', () => {
      expect(() => {
        generateNotificationContent(
          { event: 'Test Holiday' },
          'en',
          NotificationType.DAILY_REMINDER
        );
      }).toThrow('Invalid holiday object');
    });

    it('should default to English for invalid language', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'invalid-lang',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toMatch(/In \d+ days/); // English format
    });

    it('should fallback to daily reminder for unknown notification type', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        'unknown-type'
      );

      expect(result).toBeDefined();
      expect(result.title).toBeDefined();
      expect(result.body).toBeDefined();
    });
  });

  describe('Emoji Usage', () => {
    it('should include appropriate emoji in all notification types', () => {
      const types = [
        NotificationType.DAILY_REMINDER,
        NotificationType.WEEKLY_WELLNESS,
        NotificationType.HOLIDAY_ALERT,
      ];

      types.forEach(type => {
        const result = generateNotificationContent(
          sampleHoliday,
          'en',
          type
        );

        // Should have at least one emoji (broader regex including all emoji ranges)
        expect(result.title).toMatch(/[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
      });
    });

    it('should not overwhelm with too many emoji', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      // Count emoji (broader regex)
      const emojiCount = (result.title.match(/[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length +
                        (result.body.match(/[\u{1F000}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;

      expect(emojiCount).toBeLessThan(10); // Reasonable limit
    });
  });

  describe('Bilingual Consistency', () => {
    it('should maintain consistent structure across languages', () => {
      const enResult = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      const zhResult = generateNotificationContent(
        sampleHoliday,
        'zh',
        NotificationType.DAILY_REMINDER
      );

      expect(enResult.actionButtons.length).toBe(zhResult.actionButtons.length);
      expect(enResult.actionButtons[0].action).toBe(zhResult.actionButtons[0].action);
    });

    it('should have same action button keys across languages', () => {
      const enResult = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.HOLIDAY_ALERT
      );

      const zhResult = generateNotificationContent(
        sampleHoliday,
        'zh',
        NotificationType.HOLIDAY_ALERT
      );

      expect(enResult.actionButtons.map(b => b.action)).toEqual(
        zhResult.actionButtons.map(b => b.action)
      );
    });
  });

  describe('Countdown Formatting', () => {
    it('should format today correctly', () => {
      const result = generateNotificationContent(
        todayHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toContain('Today');
    });

    it('should format tomorrow correctly', () => {
      const result = generateNotificationContent(
        tomorrowHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toContain('Tomorrow');
    });

    it('should format multiple days correctly', () => {
      const result = generateNotificationContent(
        sampleHoliday,
        'en',
        NotificationType.DAILY_REMINDER
      );

      expect(result.body).toMatch(/In \d+ days/);
    });
  });
});
