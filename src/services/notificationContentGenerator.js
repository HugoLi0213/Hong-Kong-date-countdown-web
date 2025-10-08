/**
 * Notification Content Generator
 * Generates personalized, bilingual notification content with wellness-focused messaging
 */

import { NotificationType } from '../types/notifications.js';

/**
 * Calculate days until a holiday
 */
function getDaysUntil(holidayDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const target = new Date(holidayDate);
  target.setHours(0, 0, 0, 0);
  
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Detect if a holiday is part of a long weekend
 */
function detectLongWeekend(holiday, allHolidays) {
  const holidayDate = new Date(holiday.date);
  const dayOfWeek = holidayDate.getDay();
  
  // Check if it's a Friday or Monday (potential long weekend)
  if (dayOfWeek === 5 || dayOfWeek === 1) {
    return true;
  }
  
  // Check if adjacent to weekend or another holiday
  const prevDay = new Date(holidayDate);
  prevDay.setDate(prevDay.getDate() - 1);
  
  const nextDay = new Date(holidayDate);
  nextDay.setDate(nextDay.getDate() + 1);
  
  const hasAdjacentHoliday = allHolidays.some(h => {
    const hDate = new Date(h.date);
    return hDate.getTime() === prevDay.getTime() || hDate.getTime() === nextDay.getTime();
  });
  
  return hasAdjacentHoliday;
}

/**
 * Get wellness-focused prefix based on time of day
 */
function getTimeBasedPrefix(language) {
  const hour = new Date().getHours();
  
  if (language === 'zh') {
    if (hour < 12) return '早晨好';
    if (hour < 18) return '午安';
    return '晚上好';
  } else {
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }
}

/**
 * Format countdown text
 */
function formatCountdown(days, language) {
  if (days === 0) {
    return language === 'zh' ? '今天' : 'Today';
  } else if (days === 1) {
    return language === 'zh' ? '明天' : 'Tomorrow';
  } else if (days === 2) {
    return language === 'zh' ? '後天' : 'In 2 days';
  } else {
    return language === 'zh' ? `${days} 天後` : `In ${days} days`;
  }
}

/**
 * Generate Daily Reminder Content
 */
function generateDailyReminderContent(holiday, language, options = {}) {
  const daysUntil = getDaysUntil(holiday.date);
  const countdown = formatCountdown(daysUntil, language);
  const isLongWeekend = options.allHolidays ? detectLongWeekend(holiday, options.allHolidays) : false;
  
  if (language === 'zh') {
    const titles = [
      '🌅 每日節日提醒',
      '🌸 今日假期資訊',
      '☀️ 早安！假期倒數',
    ];
    
    let body = `${countdown}是${holiday.event}`;
    
    if (isLongWeekend) {
      body += ' 🎉 長周末！';
    }
    
    if (daysUntil <= 7 && daysUntil > 0) {
      body += '\n是時候計劃你的休息時光了 🌿';
    } else if (daysUntil === 0) {
      body += '\n享受你的假期，好好放鬆 🎊';
    }
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body,
      actionButtons: [
        { title: '查看詳情', action: 'view_details' },
        { title: '稍後提醒', action: 'remind_later' },
      ],
    };
  } else {
    const titles = [
      '🌅 Daily Holiday Reminder',
      '🌸 Today\'s Holiday Info',
      '☀️ Good Morning! Holiday Update',
    ];
    
    let body = `${countdown} is ${holiday.event}`;
    
    if (isLongWeekend) {
      body += ' 🎉 Long weekend ahead!';
    }
    
    if (daysUntil <= 7 && daysUntil > 0) {
      body += '\nTime to plan your rest and relaxation 🌿';
    } else if (daysUntil === 0) {
      body += '\nEnjoy your holiday and unwind 🎊';
    }
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body,
      actionButtons: [
        { title: 'View Details', action: 'view_details' },
        { title: 'Remind Later', action: 'remind_later' },
      ],
    };
  }
}

/**
 * Generate Weekly Wellness Content
 */
function generateWeeklyWellnessContent(upcomingHolidays, language) {
  const greeting = getTimeBasedPrefix(language);
  
  if (language === 'zh') {
    const titles = [
      '💚 每週健康檢查',
      '🧘 週末規劃時光',
      '🌿 工作生活平衡提醒',
    ];
    
    let body = `${greeting}！花點時間為下週做規劃 ✨`;
    
    if (upcomingHolidays && upcomingHolidays.length > 0) {
      const nextHoliday = upcomingHolidays[0];
      const daysUntil = getDaysUntil(nextHoliday.date);
      
      if (daysUntil <= 14) {
        body += `\n\n即將到來：${nextHoliday.event}`;
        body += `\n${formatCountdown(daysUntil, language)} 🗓️`;
        body += '\n\n記得安排你的工作和休息時間';
      }
    } else {
      body += '\n\n深呼吸，照顧好自己 🌸';
    }
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body,
      actionButtons: [
        { title: '查看所有假期', action: 'view_all_holidays' },
        { title: '設置提醒', action: 'set_reminder' },
      ],
    };
  } else {
    const titles = [
      '💚 Weekly Wellness Check-in',
      '🧘 Weekend Planning Time',
      '🌿 Work-Life Balance Reminder',
    ];
    
    let body = `${greeting}! Take a moment to plan ahead for next week ✨`;
    
    if (upcomingHolidays && upcomingHolidays.length > 0) {
      const nextHoliday = upcomingHolidays[0];
      const daysUntil = getDaysUntil(nextHoliday.date);
      
      if (daysUntil <= 14) {
        body += `\n\nComing up: ${nextHoliday.event}`;
        body += `\n${formatCountdown(daysUntil, language)} 🗓️`;
        body += '\n\nRemember to balance work and rest';
      }
    } else {
      body += '\n\nTake a deep breath and care for yourself 🌸';
    }
    
    return {
      title: titles[Math.floor(Math.random() * titles.length)],
      body,
      actionButtons: [
        { title: 'View All Holidays', action: 'view_all_holidays' },
        { title: 'Set Reminder', action: 'set_reminder' },
      ],
    };
  }
}

/**
 * Generate Holiday Alert Content
 */
function generateHolidayAlertContent(holiday, daysBeforeAlert, language, options = {}) {
  const daysUntil = getDaysUntil(holiday.date);
  const countdown = formatCountdown(daysUntil, language);
  const isLongWeekend = options.allHolidays ? detectLongWeekend(holiday, options.allHolidays) : false;
  
  if (language === 'zh') {
    let title = '📅 假期提醒';
    
    if (daysUntil <= 3) {
      title = '🎉 假期即將到來！';
    } else if (daysUntil <= 7) {
      title = '📆 即將到來的假期';
    }
    
    let body = `${holiday.event}將在${countdown}到來`;
    
    if (isLongWeekend) {
      body += ' 🌟\n\n太棒了！這將是一個長周末';
      body += '\n非常適合計劃短途旅行或好好休息 🏖️';
    } else {
      body += ' 🌟';
    }
    
    if (daysUntil === 3) {
      body += '\n\n是時候完成工作並準備放鬆了 💆';
    } else if (daysUntil === 7) {
      body += '\n\n提前規劃，讓假期更美好 ✨';
    }
    
    // Add mindfulness tip
    const tips = [
      '\n記得保持平衡，照顧好自己 🌿',
      '\n享受當下，珍惜休息時光 🧘',
      '\n放慢腳步，為自己充電 🔋',
    ];
    body += tips[Math.floor(Math.random() * tips.length)];
    
    return {
      title,
      body,
      actionButtons: [
        { title: '查看假期詳情', action: 'view_holiday_details' },
        { title: '計劃活動', action: 'plan_activities' },
        { title: '關閉', action: 'dismiss' },
      ],
    };
  } else {
    let title = '📅 Holiday Reminder';
    
    if (daysUntil <= 3) {
      title = '🎉 Holiday Coming Soon!';
    } else if (daysUntil <= 7) {
      title = '📆 Upcoming Holiday Alert';
    }
    
    let body = `${holiday.event} is ${countdown}`;
    
    if (isLongWeekend) {
      body += ' 🌟\n\nGreat news! This is a long weekend';
      body += '\nPerfect for planning a short trip or quality rest 🏖️';
    } else {
      body += ' 🌟';
    }
    
    if (daysUntil === 3) {
      body += '\n\nTime to wrap up work and prepare to unwind 💆';
    } else if (daysUntil === 7) {
      body += '\n\nPlan ahead to make the most of your holiday ✨';
    }
    
    // Add mindfulness tip
    const tips = [
      '\nRemember to stay balanced and care for yourself 🌿',
      '\nEnjoy the present moment and cherish your time off 🧘',
      '\nSlow down and recharge your energy 🔋',
    ];
    body += tips[Math.floor(Math.random() * tips.length)];
    
    return {
      title,
      body,
      actionButtons: [
        { title: 'View Holiday Details', action: 'view_holiday_details' },
        { title: 'Plan Activities', action: 'plan_activities' },
        { title: 'Dismiss', action: 'dismiss' },
      ],
    };
  }
}

/**
 * Generate Urgent Notification Content
 */
function generateUrgentContent(holiday, language) {
  const daysUntil = getDaysUntil(holiday.date);
  
  if (language === 'zh') {
    return {
      title: '⚡ 重要提醒',
      body: `${holiday.event}將在${daysUntil}天內到來！\n\n請確保完成所有必要的準備工作 📋`,
      actionButtons: [
        { title: '立即查看', action: 'view_now' },
        { title: '稍後', action: 'later' },
      ],
    };
  } else {
    return {
      title: '⚡ Important Reminder',
      body: `${holiday.event} is just ${daysUntil} day${daysUntil !== 1 ? 's' : ''} away!\n\nMake sure to complete any necessary preparations 📋`,
      actionButtons: [
        { title: 'View Now', action: 'view_now' },
        { title: 'Later', action: 'later' },
      ],
    };
  }
}

/**
 * Main function to generate notification content
 * 
 * @param {Object} holiday - Holiday object with event, date, etc.
 * @param {string} language - 'en' or 'zh' for language preference
 * @param {string} notificationType - Type from NotificationType
 * @param {Object} options - Additional options (allHolidays, daysBeforeAlert, etc.)
 * @returns {Object} - { title, body, actionButtons }
 */
export function generateNotificationContent(holiday, language, notificationType, options = {}) {
  // Validate inputs
  if (!holiday || !holiday.event || !holiday.date) {
    throw new Error('Invalid holiday object');
  }
  
  if (!['en', 'zh'].includes(language)) {
    language = 'en'; // Default to English
  }
  
  // Generate content based on notification type
  switch (notificationType) {
    case NotificationType.DAILY_REMINDER:
      return generateDailyReminderContent(holiday, language, options);
    
    case NotificationType.WEEKLY_WELLNESS:
      // For weekly wellness, we might pass multiple upcoming holidays
      const upcomingHolidays = options.upcomingHolidays || [holiday];
      return generateWeeklyWellnessContent(upcomingHolidays, language);
    
    case NotificationType.HOLIDAY_ALERT:
      return generateHolidayAlertContent(
        holiday,
        options.daysBeforeAlert || 3,
        language,
        options
      );
    
    case 'urgent':
      return generateUrgentContent(holiday, language);
    
    default:
      // Fallback to daily reminder format
      return generateDailyReminderContent(holiday, language, options);
  }
}

/**
 * Generate content for multiple holidays (useful for summary notifications)
 */
export function generateMultiHolidayContent(holidays, language, title) {
  if (!holidays || holidays.length === 0) {
    return {
      title: language === 'zh' ? '📅 沒有即將到來的假期' : '📅 No Upcoming Holidays',
      body: language === 'zh' 
        ? '目前沒有即將到來的假期\n繼續保持專注和平衡 🌿' 
        : 'No upcoming holidays at the moment\nStay focused and balanced 🌿',
      actionButtons: [],
    };
  }
  
  const holidayList = holidays.map(h => {
    const daysUntil = getDaysUntil(h.date);
    const countdown = formatCountdown(daysUntil, language);
    return language === 'zh' 
      ? `• ${h.event} - ${countdown}` 
      : `• ${h.event} - ${countdown}`;
  }).join('\n');
  
  const customTitle = title || (language === 'zh' ? '📅 即將到來的假期' : '📅 Upcoming Holidays');
  
  return {
    title: customTitle,
    body: holidayList,
    actionButtons: [
      {
        title: language === 'zh' ? '查看全部' : 'View All',
        action: 'view_all',
      },
    ],
  };
}

/**
 * Get a random wellness tip
 */
export function getWellnessTip(language) {
  const tips = language === 'zh' ? [
    '記得定期休息，保持身心平衡 🧘',
    '充足的睡眠對健康很重要 😴',
    '花時間與親友相處，培養關係 👨‍👩‍👧‍👦',
    '適度運動，保持活力 🏃',
    '正念呼吸，減輕壓力 🌬️',
    '規劃休息時間，避免過度勞累 ⏰',
    '享受大自然，放鬆心情 🌳',
    '保持感恩的心態 🙏',
  ] : [
    'Remember to take regular breaks and stay balanced 🧘',
    'Quality sleep is essential for wellbeing 😴',
    'Spend time with loved ones and nurture relationships 👨‍👩‍👧‍👦',
    'Stay active with moderate exercise 🏃',
    'Practice mindful breathing to reduce stress 🌬️',
    'Plan your downtime to avoid burnout ⏰',
    'Enjoy nature and relax 🌳',
    'Cultivate an attitude of gratitude 🙏',
  ];
  
  return tips[Math.floor(Math.random() * tips.length)];
}

export default {
  generateNotificationContent,
  generateMultiHolidayContent,
  getWellnessTip,
};
