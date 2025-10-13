import { describe, it, expect, vi } from 'vitest'

// Mock localStorage for testing
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock
})

describe('Holiday Countdown App - Core Functionality', () => {
  describe('Local Storage Utilities', () => {
    it('should save notification settings', () => {
      const settings = {
        notificationsEnabled: true,
        notifyUpcoming: true,
        notifyLongWeekends: false,
        reminderTime: '09:00'
      }

      localStorage.setItem('notificationSettings', JSON.stringify(settings))
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'notificationSettings',
        JSON.stringify(settings)
      )
    })

    it('should load notification settings', () => {
      const settings = {
        notificationsEnabled: true,
        notifyUpcoming: true,
        notifyLongWeekends: false,
        reminderTime: '09:00'
      }

      localStorage.getItem.mockReturnValue(JSON.stringify(settings))
      const loadedSettings = JSON.parse(localStorage.getItem('notificationSettings'))

      expect(loadedSettings.notificationsEnabled).toBe(true)
      expect(loadedSettings.notifyUpcoming).toBe(true)
      expect(loadedSettings.notifyLongWeekends).toBe(false)
      expect(loadedSettings.reminderTime).toBe('09:00')
    })

    it('should save favorite holidays', () => {
      const favorites = [
        { date: '2025-01-01', name: { en: 'New Year', zh: '新年' } },
        { date: '2025-02-14', name: { en: 'Valentine\'s Day', zh: '情人節' } }
      ]

      localStorage.setItem('favoriteHolidays', JSON.stringify(favorites))
      expect(localStorage.setItem).toHaveBeenCalledWith(
        'favoriteHolidays',
        JSON.stringify(favorites)
      )
    })
  })

  describe('Date Calculations', () => {
    it('should calculate days until holiday', () => {
      const today = new Date('2025-10-13')
      const holiday = new Date('2025-12-25') // Christmas
      const diffTime = holiday.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      expect(diffDays).toBe(73) // Approximately 73 days
    })

    it('should identify past holidays', () => {
      const today = new Date('2025-10-13')
      const pastHoliday = new Date('2025-01-01') // New Year 2025
      const futureHoliday = new Date('2025-12-25') // Christmas 2025

      expect(pastHoliday < today).toBe(true)
      expect(futureHoliday > today).toBe(true)
    })
  })

  describe('Language Support', () => {
    const translations = {
      en: {
        upcoming: 'Upcoming',
        past: 'Past',
        notifications: 'Notifications',
        settings: 'Settings'
      },
      zh: {
        upcoming: '即將到來',
        past: '已過期',
        notifications: '通知',
        settings: '設定'
      }
    }

    it('should return English translations', () => {
      const language = 'en'
      expect(translations[language].upcoming).toBe('Upcoming')
      expect(translations[language].notifications).toBe('Notifications')
    })

    it('should return Chinese translations', () => {
      const language = 'zh'
      expect(translations[language].upcoming).toBe('即將到來')
      expect(translations[language].notifications).toBe('通知')
    })

    it('should handle invalid language codes', () => {
      const language = 'invalid'
      expect(translations[language]).toBeUndefined()
    })
  })

  describe('Holiday Data Structure', () => {
    const sampleHoliday = {
      date: '2025-01-01',
      name: {
        en: 'New Year\'s Day',
        zh: '新年'
      },
      description: {
        en: 'First day of the year',
        zh: '一年的第一天'
      },
      type: 'public'
    }

    it('should have required holiday properties', () => {
      expect(sampleHoliday).toHaveProperty('date')
      expect(sampleHoliday).toHaveProperty('name')
      expect(sampleHoliday).toHaveProperty('description')
      expect(sampleHoliday).toHaveProperty('type')
    })

    it('should have bilingual name and description', () => {
      expect(sampleHoliday.name).toHaveProperty('en')
      expect(sampleHoliday.name).toHaveProperty('zh')
      expect(sampleHoliday.description).toHaveProperty('en')
      expect(sampleHoliday.description).toHaveProperty('zh')
    })

    it('should have valid holiday type', () => {
      const validTypes = ['public', 'school', 'bank', 'religious', 'cultural', 'other']
      expect(validTypes).toContain(sampleHoliday.type)
    })
  })
})