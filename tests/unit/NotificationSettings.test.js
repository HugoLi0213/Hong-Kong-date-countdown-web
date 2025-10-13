import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationSettings from '../../src/components/NotificationSettings.vue'

describe('NotificationSettings.vue', () => {
  let wrapper

  beforeEach(() => {
    // Clear all mocks
    vi.clearAllMocks()

    wrapper = mount(NotificationSettings, {
      props: {
        language: 'en'
      }
    })
  })

  it('renders notification settings component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.notification-settings').exists()).toBe(true)
  })

  it('displays notification settings title', () => {
    expect(wrapper.text()).toContain('Notification Settings')
  })

  it('has notification toggle switch', () => {
    const toggle = wrapper.find('#enableNotifications')
    expect(toggle.exists()).toBe(true)
  })

  it('shows notification options when enabled', async () => {
    const toggle = wrapper.find('#enableNotifications')
    await toggle.setValue(true)

    expect(wrapper.text()).toContain('Notify me for:')
    expect(wrapper.find('#notifyUpcoming').exists()).toBe(true)
    expect(wrapper.find('#notifyLongWeekends').exists()).toBe(true)
    expect(wrapper.find('#notifyPublicHolidays').exists()).toBe(true)
  })

  it('hides notification options when disabled', async () => {
    const toggle = wrapper.find('#enableNotifications')
    await toggle.setValue(false)

    expect(wrapper.text()).not.toContain('Notify me for:')
  })

  it('has reminder time selector', async () => {
    const toggle = wrapper.find('#enableNotifications')
    await toggle.setValue(true)

    const timeSelect = wrapper.find('#reminderTime')
    expect(timeSelect.exists()).toBe(true)
    expect(timeSelect.findAll('option')).toHaveLength(4)
  })

  it('saves settings to localStorage', async () => {
    const toggle = wrapper.find('#enableNotifications')
    await toggle.setValue(true)

    const upcomingCheckbox = wrapper.find('#notifyUpcoming')
    await upcomingCheckbox.setValue(false)

    // Trigger save (this would normally happen on change events)
    wrapper.vm.saveSettings()

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'notificationSettings',
      expect.stringContaining('"notificationsEnabled":true')
    )
  })

  it('loads settings from localStorage on mount', () => {
    const mockSettings = {
      notificationsEnabled: true,
      notifyUpcoming: false,
      notifyLongWeekends: true,
      notifyPublicHolidays: true,
      reminderTime: '18:00'
    }

    localStorage.getItem.mockReturnValue(JSON.stringify(mockSettings))

    // Remount component to trigger mounted lifecycle
    wrapper = mount(NotificationSettings, {
      props: { language: 'en' }
    })

    expect(wrapper.vm.notificationsEnabled).toBe(true)
    expect(wrapper.vm.notifyUpcoming).toBe(false)
    expect(wrapper.vm.reminderTime).toBe('18:00')
  })

  it('supports Chinese language', () => {
    wrapper = mount(NotificationSettings, {
      props: { language: 'zh' }
    })

    expect(wrapper.text()).toContain('通知設定')
  })
})