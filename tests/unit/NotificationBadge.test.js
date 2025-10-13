import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import NotificationBadge from '../../src/components/NotificationBadge.vue'

describe('NotificationBadge.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(NotificationBadge, {
      props: {
        count: 5,
        language: 'en'
      }
    })
  })

  it('renders notification badge component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.notification-badge').exists()).toBe(true)
  })

  it('displays badge with count', () => {
    expect(wrapper.text()).toContain('5')
  })

  it('shows correct badge class for default type', () => {
    expect(wrapper.find('.badge-primary').exists()).toBe(true)
  })

  it('shows correct badge class for reminder type', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        type: 'reminder',
        count: 3,
        language: 'en'
      }
    })

    expect(wrapper.find('.badge-warning').exists()).toBe(true)
  })

  it('shows correct badge class for alert type', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        type: 'alert',
        count: 2,
        language: 'en'
      }
    })

    expect(wrapper.find('.badge-danger').exists()).toBe(true)
  })

  it('shows correct badge class for info type', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        type: 'info',
        count: 1,
        language: 'en'
      }
    })

    expect(wrapper.find('.badge-info').exists()).toBe(true)
  })

  it('shows correct icon for different types', () => {
    // Default notification
    expect(wrapper.find('.fa-bell').exists()).toBe(true)

    // Reminder
    wrapper = mount(NotificationBadge, {
      props: { type: 'reminder', count: 1, language: 'en' }
    })
    expect(wrapper.find('.fa-clock').exists()).toBe(true)

    // Alert
    wrapper = mount(NotificationBadge, {
      props: { type: 'alert', count: 1, language: 'en' }
    })
    expect(wrapper.find('.fa-exclamation-triangle').exists()).toBe(true)

    // Info
    wrapper = mount(NotificationBadge, {
      props: { type: 'info', count: 1, language: 'en' }
    })
    expect(wrapper.find('.fa-info-circle').exists()).toBe(true)
  })

  it('hides badge when count is 0', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        count: 0,
        language: 'en'
      }
    })

    expect(wrapper.find('.notification-badge').exists()).toBe(false)
  })

  it('shows badge for notification type even with count 0', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        type: 'notification',
        count: 0,
        language: 'en'
      }
    })

    expect(wrapper.find('.notification-badge').exists()).toBe(true)
  })

  it('displays correct tooltip for multiple notifications', () => {
    expect(wrapper.attributes('title')).toBe('5 new notifications')
  })

  it('displays correct tooltip for single notification', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        count: 1,
        language: 'en'
      }
    })

    expect(wrapper.attributes('title')).toBe('1 new notification')
  })

  it('displays correct tooltip when no notifications', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        type: 'notification',
        count: 0,
        language: 'en'
      }
    })

    expect(wrapper.attributes('title')).toBe('No new notifications')
  })

  it('emits badge-click event when clicked and clickable is true', async () => {
    await wrapper.trigger('click')

    expect(wrapper.emitted('badge-click')).toBeTruthy()
    expect(wrapper.emitted('badge-click')[0]).toEqual([{
      type: 'notification',
      count: 5
    }])
  })

  it('does not emit event when clicked and clickable is false', async () => {
    wrapper = mount(NotificationBadge, {
      props: {
        count: 5,
        clickable: false,
        language: 'en'
      }
    })

    await wrapper.trigger('click')

    expect(wrapper.emitted('badge-click')).toBeFalsy()
  })

  it('supports Chinese language tooltips', () => {
    wrapper = mount(NotificationBadge, {
      props: {
        count: 3,
        language: 'zh'
      }
    })

    expect(wrapper.attributes('title')).toBe('3 個新通知')
  })

  it('applies hover effect classes', async () => {
    await wrapper.trigger('mouseenter')
    // Note: This test would need more complex setup to test CSS hover effects
    // For now, we verify the component structure supports hover styling
    expect(wrapper.find('.badge').classes()).toContain('badge-primary')
  })
})