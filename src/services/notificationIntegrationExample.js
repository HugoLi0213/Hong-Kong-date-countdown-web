/**
 * Integration Example: Notification Content Generator + Notification Service
 * 
 * This file demonstrates how to integrate the notification content generator
 * with the existing notification service for personalized, bilingual notifications.
 */

import { generateNotificationContent, generateMultiHolidayContent, getWellnessTip } from '@/services/notificationContentGenerator.js';
import notificationService from '@/services/notificationService.js';
import { NotificationType } from '@/types/notifications.js';

// ==========================================
// EXAMPLE 1: Enhanced Daily Reminder
// ==========================================

/**
 * Schedule a daily reminder with personalized content
 */
export async function scheduleEnhancedDailyReminder(holiday, userPreferences, allHolidays) {
  try {
    // Generate personalized content
    const content = generateNotificationContent(
      holiday,
      userPreferences.language || 'en',
      NotificationType.DAILY_REMINDER,
      { allHolidays }
    );

    // Schedule notification with generated content
    await notificationService.scheduleDailyReminder(
      userPreferences.dailyReminderHour || 9,
      userPreferences.dailyReminderMinute || 0,
      {
        title: content.title,
        body: content.body,
        extra: {
          holidayDate: holiday.date,
          holidayEvent: holiday.event,
          actionButtons: content.actionButtons
        }
      }
    );

    console.log('Enhanced daily reminder scheduled:', content.title);
    return { success: true, content };
  } catch (error) {
    console.error('Error scheduling enhanced daily reminder:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 2: Weekly Wellness with Multiple Holidays
// ==========================================

/**
 * Schedule a weekly wellness check-in with upcoming holidays
 */
export async function scheduleEnhancedWeeklyWellness(upcomingHolidays, userPreferences) {
  try {
    if (!upcomingHolidays || upcomingHolidays.length === 0) {
      console.log('No upcoming holidays for weekly wellness');
      return { success: false, reason: 'no_holidays' };
    }

    // Generate content with upcoming holidays context
    const content = generateNotificationContent(
      upcomingHolidays[0], // Next holiday
      userPreferences.language || 'en',
      NotificationType.WEEKLY_WELLNESS,
      { upcomingHolidays }
    );

    // Add a wellness tip
    const wellnessTip = getWellnessTip(userPreferences.language || 'en');
    const enhancedBody = `${content.body}\n\n💡 ${wellnessTip}`;

    // Schedule weekly wellness notification
    await notificationService.scheduleWeeklyWellness(
      userPreferences.weeklyWellnessDay || 0, // Sunday
      userPreferences.weeklyWellnessHour || 10,
      userPreferences.weeklyWellnessMinute || 0,
      {
        title: content.title,
        body: enhancedBody,
        extra: {
          upcomingCount: upcomingHolidays.length,
          actionButtons: content.actionButtons
        }
      }
    );

    console.log('Enhanced weekly wellness scheduled:', content.title);
    return { success: true, content };
  } catch (error) {
    console.error('Error scheduling enhanced weekly wellness:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 3: Holiday Alerts with Smart Timing
// ==========================================

/**
 * Schedule holiday alerts with personalized content and smart timing
 */
export async function scheduleEnhancedHolidayAlerts(holidays, userPreferences, allHolidays) {
  try {
    const scheduledAlerts = [];

    for (const holiday of holidays) {
      // Determine optimal notification timing
      const daysUntil = Math.ceil(
        (new Date(holiday.date) - new Date()) / (1000 * 60 * 60 * 24)
      );

      // Skip past holidays
      if (daysUntil < 0) continue;

      // Determine alert timing based on proximity
      let alertTiming;
      if (daysUntil <= 1) {
        alertTiming = 0; // Alert today
      } else if (daysUntil <= 3) {
        alertTiming = 1; // Alert 1 day before
      } else if (daysUntil <= 7) {
        alertTiming = 3; // Alert 3 days before
      } else {
        alertTiming = 7; // Alert 7 days before
      }

      // Generate personalized content
      const content = generateNotificationContent(
        holiday,
        userPreferences.language || 'en',
        NotificationType.HOLIDAY_ALERT,
        {
          allHolidays,
          daysBeforeAlert: alertTiming
        }
      );

      // Schedule the alert
      await notificationService.scheduleHolidayAlerts(
        [holiday],
        alertTiming,
        {
          title: content.title,
          body: content.body,
          extra: {
            holidayDate: holiday.date,
            holidayEvent: holiday.event,
            daysUntil,
            actionButtons: content.actionButtons
          }
        }
      );

      scheduledAlerts.push({
        holiday: holiday.event,
        alertDate: new Date(new Date(holiday.date).getTime() - alertTiming * 24 * 60 * 60 * 1000),
        content
      });
    }

    console.log(`Scheduled ${scheduledAlerts.length} enhanced holiday alerts`);
    return { success: true, alerts: scheduledAlerts };
  } catch (error) {
    console.error('Error scheduling enhanced holiday alerts:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 4: Multi-Holiday Summary
// ==========================================

/**
 * Generate and send a multi-holiday summary notification
 */
export async function sendHolidaySummary(holidays, userPreferences, customTitle) {
  try {
    // Generate multi-holiday content
    const content = generateMultiHolidayContent(
      holidays,
      userPreferences.language || 'en',
      customTitle
    );

    // Schedule immediate notification (using daily reminder slot)
    await notificationService.scheduleDailyReminder(
      new Date().getHours(),
      new Date().getMinutes() + 1, // Schedule 1 minute from now
      {
        title: content.title,
        body: content.body,
        extra: {
          type: 'summary',
          holidayCount: holidays.length,
          actionButtons: content.actionButtons
        }
      }
    );

    console.log('Holiday summary notification scheduled:', content.title);
    return { success: true, content };
  } catch (error) {
    console.error('Error sending holiday summary:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 5: Complete Notification Setup
// ==========================================

/**
 * Complete notification setup with all types
 */
export async function setupCompleteNotificationSystem(holidays, userPreferences) {
  const results = {
    dailyReminder: null,
    weeklyWellness: null,
    holidayAlerts: null
  };

  try {
    // Get upcoming holidays
    const now = new Date();
    const upcomingHolidays = holidays
      .filter(h => new Date(h.date) > now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // 1. Schedule Daily Reminder (next holiday)
    if (upcomingHolidays.length > 0 && userPreferences.dailyReminderEnabled) {
      results.dailyReminder = await scheduleEnhancedDailyReminder(
        upcomingHolidays[0],
        userPreferences,
        holidays
      );
    }

    // 2. Schedule Weekly Wellness (all upcoming holidays)
    if (userPreferences.weeklyWellnessEnabled) {
      results.weeklyWellness = await scheduleEnhancedWeeklyWellness(
        upcomingHolidays.slice(0, 3), // Next 3 holidays
        userPreferences
      );
    }

    // 3. Schedule Holiday Alerts (all upcoming holidays)
    if (userPreferences.holidayAlertsEnabled) {
      results.holidayAlerts = await scheduleEnhancedHolidayAlerts(
        upcomingHolidays,
        userPreferences,
        holidays
      );
    }

    console.log('Complete notification system setup:', results);
    return { success: true, results };
  } catch (error) {
    console.error('Error setting up notification system:', error);
    return { success: false, error, results };
  }
}

// ==========================================
// EXAMPLE 6: Dynamic Content Updates
// ==========================================

/**
 * Update notification content when user changes language
 */
export async function updateNotificationLanguage(holidays, newLanguage, currentPreferences) {
  try {
    // Cancel all existing notifications
    await notificationService.cancelAllNotifications();

    // Re-setup with new language
    const updatedPreferences = {
      ...currentPreferences,
      language: newLanguage
    };

    const result = await setupCompleteNotificationSystem(holidays, updatedPreferences);

    console.log(`Notifications updated to ${newLanguage}`);
    return result;
  } catch (error) {
    console.error('Error updating notification language:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 7: Preview Notification Content
// ==========================================

/**
 * Generate preview of all notification types for a holiday
 */
export function previewNotificationContent(holiday, language, allHolidays) {
  const previews = {};

  try {
    // Daily Reminder Preview
    previews.dailyReminder = generateNotificationContent(
      holiday,
      language,
      NotificationType.DAILY_REMINDER,
      { allHolidays }
    );

    // Weekly Wellness Preview
    previews.weeklyWellness = generateNotificationContent(
      holiday,
      language,
      NotificationType.WEEKLY_WELLNESS,
      { upcomingHolidays: [holiday] }
    );

    // Holiday Alert Preview
    previews.holidayAlert = generateNotificationContent(
      holiday,
      language,
      NotificationType.HOLIDAY_ALERT,
      { allHolidays, daysBeforeAlert: 3 }
    );

    // Wellness Tip
    previews.wellnessTip = getWellnessTip(language);

    console.log('Notification previews generated');
    return { success: true, previews };
  } catch (error) {
    console.error('Error generating previews:', error);
    return { success: false, error };
  }
}

// ==========================================
// EXAMPLE 8: Smart Notification Scheduler
// ==========================================

/**
 * Intelligently schedule notifications based on user behavior and preferences
 */
export async function smartScheduleNotifications(holidays, userPreferences, userBehavior = {}) {
  try {
    const {
      preferredNotificationTime = { hour: 9, minute: 0 },
      mostEngagedNotificationType = NotificationType.DAILY_REMINDER,
      averageResponseTime = 3600000, // 1 hour in ms
      quietHours = { start: 22, end: 7 }
    } = userBehavior;

    // Get upcoming holidays
    const upcomingHolidays = holidays
      .filter(h => new Date(h.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (upcomingHolidays.length === 0) {
      return { success: true, message: 'No upcoming holidays' };
    }

    // Determine optimal notification times
    const { hour: preferredHour, minute: preferredMinute } = preferredNotificationTime;

    // Schedule based on user engagement
    if (mostEngagedNotificationType === NotificationType.DAILY_REMINDER) {
      // Focus on daily reminders
      await scheduleEnhancedDailyReminder(
        upcomingHolidays[0],
        { ...userPreferences, dailyReminderHour: preferredHour, dailyReminderMinute: preferredMinute },
        holidays
      );
    } else if (mostEngagedNotificationType === NotificationType.WEEKLY_WELLNESS) {
      // Focus on weekly wellness
      await scheduleEnhancedWeeklyWellness(
        upcomingHolidays.slice(0, 3),
        { ...userPreferences, weeklyWellnessHour: preferredHour, weeklyWellnessMinute: preferredMinute }
      );
    }

    // Schedule holiday alerts at optimal times (avoiding quiet hours)
    const filteredHolidays = upcomingHolidays.filter(holiday => {
      const alertHour = new Date(holiday.date).getHours();
      return alertHour < quietHours.start && alertHour >= quietHours.end;
    });

    await scheduleEnhancedHolidayAlerts(filteredHolidays, userPreferences, holidays);

    console.log('Smart notifications scheduled based on user behavior');
    return { success: true, scheduled: true };
  } catch (error) {
    console.error('Error in smart scheduling:', error);
    return { success: false, error };
  }
}

// ==========================================
// USAGE EXAMPLE
// ==========================================

/**
 * Example usage in a Vue component or service
 */
export async function exampleUsage() {
  // Sample data
  const holidays = [
    {
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      event: 'Dragon Boat Festival',
      description: 'Traditional Chinese festival'
    },
    {
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      event: 'Mid-Autumn Festival',
      description: 'Moon festival'
    }
  ];

  const userPreferences = {
    language: 'en',
    dailyReminderEnabled: true,
    dailyReminderHour: 9,
    dailyReminderMinute: 0,
    weeklyWellnessEnabled: true,
    weeklyWellnessDay: 0,
    weeklyWellnessHour: 10,
    weeklyWellnessMinute: 0,
    holidayAlertsEnabled: true
  };

  // Setup complete notification system
  const result = await setupCompleteNotificationSystem(holidays, userPreferences);

  if (result.success) {
    console.log('✅ All notifications scheduled successfully');
    console.log('Daily Reminder:', result.results.dailyReminder);
    console.log('Weekly Wellness:', result.results.weeklyWellness);
    console.log('Holiday Alerts:', result.results.holidayAlerts);
  } else {
    console.error('❌ Error setting up notifications:', result.error);
  }

  // Preview notification content
  const preview = previewNotificationContent(holidays[0], 'en', holidays);
  console.log('Notification Previews:', preview);

  return result;
}

// ==========================================
// EXPORT ALL FUNCTIONS
// ==========================================

export default {
  scheduleEnhancedDailyReminder,
  scheduleEnhancedWeeklyWellness,
  scheduleEnhancedHolidayAlerts,
  sendHolidaySummary,
  setupCompleteNotificationSystem,
  updateNotificationLanguage,
  previewNotificationContent,
  smartScheduleNotifications,
  exampleUsage
};
