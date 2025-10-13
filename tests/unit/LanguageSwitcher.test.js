import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LanguageSwitcher from '../../src/components/LanguageSwitcher.vue'

describe('LanguageSwitcher.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(LanguageSwitcher, {
      props: {
        currentLanguage: 'en'
      }
    })
  })

  it('renders language switcher component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.find('.language-switcher').exists()).toBe(true)
  })

  it('displays current language', () => {
    expect(wrapper.text()).toContain('English')
  })

  it('shows dropdown toggle button', () => {
    const toggle = wrapper.find('.dropdown-toggle')
    expect(toggle.exists()).toBe(true)
    expect(toggle.attributes('aria-expanded')).toBe('false')
  })

  it('toggles dropdown on click', async () => {
    const toggle = wrapper.find('.dropdown-toggle')
    await toggle.trigger('click')

    expect(wrapper.vm.showDropdown).toBe(true)
    expect(wrapper.find('.dropdown-menu.show').exists()).toBe(true)
  })

  it('displays available languages in dropdown', async () => {
    await wrapper.find('.dropdown-toggle').trigger('click')

    const dropdownItems = wrapper.findAll('.dropdown-item')
    expect(dropdownItems).toHaveLength(2)
    expect(dropdownItems[0].text()).toContain('English')
    expect(dropdownItems[1].text()).toContain('中文')
  })

  it('emits language-change event when language is selected', async () => {
    await wrapper.find('.dropdown-toggle').trigger('click')

    const chineseOption = wrapper.findAll('.dropdown-item')[1]
    await chineseOption.trigger('click')

    expect(wrapper.emitted('language-change')).toBeTruthy()
    expect(wrapper.emitted('language-change')[0]).toEqual(['zh'])
  })

  it('closes dropdown after language selection', async () => {
    await wrapper.find('.dropdown-toggle').trigger('click')
    expect(wrapper.vm.showDropdown).toBe(true)

    const chineseOption = wrapper.findAll('.dropdown-item')[1]
    await chineseOption.trigger('click')

    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('shows active state for current language', async () => {
    await wrapper.find('.dropdown-toggle').trigger('click')

    const englishOption = wrapper.findAll('.dropdown-item')[0]
    expect(englishOption.classes()).toContain('active')
  })

  it('closes dropdown when clicking outside', async () => {
    await wrapper.find('.dropdown-toggle').trigger('click')
    expect(wrapper.vm.showDropdown).toBe(true)

    // Simulate click outside
    document.dispatchEvent(new Event('click'))

    expect(wrapper.vm.showDropdown).toBe(false)
  })

  it('supports custom language list', () => {
    const customLanguages = [
      { code: 'en', name: 'English', flag: 'us' },
      { code: 'zh', name: '中文', flag: 'cn' },
      { code: 'ja', name: '日本語', flag: 'jp' }
    ]

    wrapper = mount(LanguageSwitcher, {
      props: {
        currentLanguage: 'en',
        availableLanguages: customLanguages
      }
    })

    expect(wrapper.vm.availableLanguages).toHaveLength(3)
  })
})