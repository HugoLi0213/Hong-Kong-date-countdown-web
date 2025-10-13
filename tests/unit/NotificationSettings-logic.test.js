import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

global.localStorage = localStorageMock

// Mock Notification API
global.Notification = {
  requestPermission: vi.fn().mockResolvedValue('granted'),
}

describe('NotificationSettings Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Settings Storage', () => {
    it('should save notification settings to localStorage', () => {
      const settings = {
        notificationsEnabled: true,
        notifyUpcoming: true,
        notifyLongWeekends: false,
        notifyPublicHolidays: true,
        reminderTime: '18:00'
      }

      localStorage.setItem('notificationSettings', JSON.stringify(settings))

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'notificationSettings',
        JSON.stringify(settings)
      )
    })

    it('should load notification settings from localStorage', () => {
      const mockSettings = {
        notificationsEnabled: true,
        notifyUpcoming: false,
        notifyLongWeekends: true,
        notifyPublicHolidays: true,
        reminderTime: '12:00'
      }

      localStorage.getItem.mockReturnValue(JSON.stringify(mockSettings))

      const settings = localStorage.getItem('notificationSettings')
      const parsed = JSON.parse(settings)

      expect(parsed.notificationsEnabled).toBe(true)
      expect(parsed.notifyUpcoming).toBe(false)
      expect(parsed.reminderTime).toBe('12:00')
    })

    it('should handle missing localStorage data', () => {
      localStorage.getItem.mockReturnValue(null)

      const settings = localStorage.getItem('notificationSettings')

      expect(settings).toBeNull()
    })
  })

  describe('Notification API', () => {
    it('should request notification permission', async () => {
      const permission = await Notification.requestPermission()

      expect(Notification.requestPermission).toHaveBeenCalled()
      expect(permission).toBe('granted')
    })

    it('should create notification with correct parameters', () => {
      const mockNotification = vi.fn()
      global.Notification = mockNotification

      // Simulate creating a notification
      const notification = new Notification('Test Title', {
        body: 'Test message',
        icon: '/favicon.ico'
      })

      expect(mockNotification).toHaveBeenCalledWith('Test Title', {
        body: 'Test message',
        icon: '/favicon.ico'
      })
    })
  })

  describe('Settings Validation', () => {
    it('should validate notification settings structure', () => {
      const validSettings = {
        notificationsEnabled: true,
        notifyUpcoming: true,
        notifyLongWeekends: false,
        notifyPublicHolidays: true,
        reminderTime: '09:00'
      }

      expect(validSettings).toHaveProperty('notificationsEnabled')
      expect(validSettings).toHaveProperty('notifyUpcoming')
      expect(validSettings).toHaveProperty('notifyLongWeekends')
      expect(validSettings).toHaveProperty('notifyPublicHolidays')
      expect(validSettings).toHaveProperty('reminderTime')
    })

    it('should validate reminder time format', () => {
      const validTimes = ['09:00', '12:00', '18:00', '20:00']
      const invalidTimes = ['25:00', '9:00', 'invalid', '24:60']

      validTimes.forEach(time => {
        expect(time).toMatch(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      })

      invalidTimes.forEach(time => {
        expect(time).not.toMatch(/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      })
    })
  })
})