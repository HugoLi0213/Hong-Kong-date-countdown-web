import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EmptyState from '../../src/components/EmptyState.vue'

describe('EmptyState.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(EmptyState, {
      props: {
        language: 'en'
      }
    })
  })

  it('renders empty state component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.empty-state').exists()).toBe(true)
  })

  it('displays default empty state', () => {
    expect(wrapper.text()).toContain('Nothing to Show')
    expect(wrapper.text()).toContain('There\'s nothing here yet')
  })

  it('shows no-results empty state', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-results',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('No Results Found')
    expect(wrapper.text()).toContain('Try adjusting your search criteria')
  })

  it('shows no-favorites empty state', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-favorites',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('No Favorite Holidays')
    expect(wrapper.text()).toContain('Click the heart icon on holidays')
  })

  it('shows no-notifications empty state', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-notifications',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('No Notifications')
    expect(wrapper.text()).toContain('You\'re all caught up')
  })

  it('shows error empty state', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'error',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('Something Went Wrong')
    expect(wrapper.text()).toContain('We encountered an error')
  })

  it('displays custom title and message', () => {
    wrapper = mount(EmptyState, {
      props: {
        customTitle: 'Custom Title',
        customMessage: 'Custom message here',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('Custom Title')
    expect(wrapper.text()).toContain('Custom message here')
  })

  it('shows action buttons when showActions is true', () => {
    wrapper = mount(EmptyState, {
      props: {
        primaryActionText: 'Primary Action',
        secondaryActionText: 'Secondary Action',
        showActions: true,
        language: 'en'
      }
    })

    expect(wrapper.findAll('.btn')).toHaveLength(2)
    expect(wrapper.text()).toContain('Primary Action')
    expect(wrapper.text()).toContain('Secondary Action')
  })

  it('hides action buttons when showActions is false', () => {
    wrapper = mount(EmptyState, {
      props: {
        primaryActionText: 'Primary Action',
        showActions: false,
        language: 'en'
      }
    })

    expect(wrapper.findAll('.btn')).toHaveLength(0)
  })

  it('emits primary-action event when primary button is clicked', async () => {
    wrapper = mount(EmptyState, {
      props: {
        primaryActionText: 'Click Me',
        showActions: true,
        language: 'en'
      }
    })

    const primaryButton = wrapper.find('.btn-primary')
    await primaryButton.trigger('click')

    expect(wrapper.emitted('primary-action')).toBeTruthy()
  })

  it('emits secondary-action event when secondary button is clicked', async () => {
    wrapper = mount(EmptyState, {
      props: {
        secondaryActionText: 'Secondary Action',
        showActions: true,
        language: 'en'
      }
    })

    const secondaryButton = wrapper.find('.btn-outline-secondary')
    await secondaryButton.trigger('click')

    expect(wrapper.emitted('secondary-action')).toBeTruthy()
  })

  it('shows suggestions for no-results type', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-results',
        language: 'en'
      }
    })

    expect(wrapper.text()).toContain('Suggestions:')
    expect(wrapper.findAll('.suggestion-item')).toHaveLength(4)
  })

  it('shows suggestions for no-favorites type', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-favorites',
        language: 'en'
      }
    })

    expect(wrapper.findAll('.suggestion-item')).toHaveLength(4)
  })

  it('supports Chinese language', () => {
    wrapper = mount(EmptyState, {
      props: {
        type: 'no-results',
        language: 'zh'
      }
    })

    expect(wrapper.text()).toContain('未找到結果')
  })

  it('uses custom icon when provided', () => {
    wrapper = mount(EmptyState, {
      props: {
        customIcon: 'fas fa-star',
        language: 'en'
      }
    })

    expect(wrapper.find('.fa-star').exists()).toBe(true)
  })
})