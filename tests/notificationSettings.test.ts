import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { ref, computed } from 'vue';
import NotificationSettings from '../src/components/NotificationSettings.vue';
import type { HolidayData } from '../src/types/notifications';

// Create a proper mock for the composable
const mockPreferences = ref({
  dailyReminder: { enabled: false, time: { hour: 9, minute: 0 } },
  weeklyWellness: { enabled: false, time: { hour: 20, minute: 0 }, dayOfWeek: 0 },
  holidayAlert: { enabled: false, daysBeforeAlert: 3 },
});

const mockPermissionState = ref({ granted: false, denied: false, pending: true });
const mockLastError = ref<any>(null);
const mockIsLoading = ref(false);

const mockRequestPermission = vi.fn().mockResolvedValue(true);
const mockToggleDailyReminder = vi.fn();
const mockUpdateDailyReminderTime = vi.fn();
const mockToggleWeeklyWellness = vi.fn();
const mockUpdateWeeklyWellnessTime = vi.fn();
const mockToggleHolidayAlert = vi.fn();
const mockUpdateHolidayAlertDays = vi.fn();
const mockResetPreferences = vi.fn();
const mockGetPendingCount = vi.fn().mockResolvedValue(0);

vi.mock('../src/composables/useNotifications', () => ({
  useNotifications: () => ({
    preferences: mockPreferences,
    permissionState: mockPermissionState,
    lastError: mockLastError,
    isLoading: mockIsLoading,
    hasPermission: computed(() => mockPermissionState.value.granted),
    needsPermission: computed(() => !mockPermissionState.value.granted && !mockPermissionState.value.denied),
    anyNotificationEnabled: computed(() => 
      mockPreferences.value.dailyReminder.enabled ||
      mockPreferences.value.weeklyWellness.enabled ||
      mockPreferences.value.holidayAlert.enabled
    ),
    requestPermission: mockRequestPermission,
    checkPermission: vi.fn(),
    toggleDailyReminder: mockToggleDailyReminder,
    updateDailyReminderTime: mockUpdateDailyReminderTime,
    toggleWeeklyWellness: mockToggleWeeklyWellness,
    updateWeeklyWellnessTime: mockUpdateWeeklyWellnessTime,
    toggleHolidayAlert: mockToggleHolidayAlert,
    updateHolidayAlertDays: mockUpdateHolidayAlertDays,
    resetPreferences: mockResetPreferences,
    getPendingCount: mockGetPendingCount,
  }),
}));

describe('NotificationSettings Component', () => {
  const mockHolidays: HolidayData[] = [
    { event: 'Christmas', date: 'December 25, 2025' },
    { event: 'New Year', date: 'January 1, 2026' },
  ];

  const createWrapper = (props = {}) => {
    return mount(NotificationSettings, {
      props: {
        language: 'en',
        holidays: mockHolidays,
        ...props,
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Reset mock values
    mockPreferences.value = {
      dailyReminder: { enabled: false, time: { hour: 9, minute: 0 } },
      weeklyWellness: { enabled: false, time: { hour: 20, minute: 0 }, dayOfWeek: 0 },
      holidayAlert: { enabled: false, daysBeforeAlert: 3 },
    };
    mockPermissionState.value = { granted: false, denied: false, pending: true };
    mockLastError.value = null;
    mockIsLoading.value = false;
  });

  it('should render component', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.notification-settings').exists()).toBe(true);
    expect(wrapper.find('h3').text()).toContain('Notification Preferences');
  });

  it('should display permission request when permission not granted', () => {
    const wrapper = createWrapper();
    const permissionAlert = wrapper.find('.wellness-alert-warning');
    expect(permissionAlert.exists()).toBe(true);
    expect(permissionAlert.text()).toContain('Enable Notifications for Wellness');
  });

  it('should display all notification setting items', () => {
    const wrapper = createWrapper();
    const settingItems = wrapper.findAll('.wellness-setting-card');
    expect(settingItems).toHaveLength(3); // Daily, Weekly, Holiday
  });

  it('should show daily reminder settings', () => {
    const wrapper = createWrapper();
    const dailySection = wrapper.findAll('.wellness-setting-card')[0];
    expect(dailySection.text()).toContain('Daily Holiday Reminder');
  });

  it('should show weekly wellness settings', () => {
    const wrapper = createWrapper();
    const weeklySection = wrapper.findAll('.wellness-setting-card')[1];
    expect(weeklySection.text()).toContain('Weekly Wellness Check-in');
  });

  it('should show holiday alert settings', () => {
    const wrapper = createWrapper();
    const holidaySection = wrapper.findAll('.wellness-setting-card')[2];
    expect(holidaySection.text()).toContain('Holiday Alerts');
  });

  it('should render in Chinese when language is zh', () => {
    const wrapper = createWrapper({ language: 'zh' });
    expect(wrapper.text()).toContain('啟用通知以促進健康');
  });

  it('should show time picker when daily reminder is enabled', async () => {
    mockPreferences.value.dailyReminder.enabled = true;
    
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    const timePickers = wrapper.findAll('.time-picker-section');
    expect(timePickers.length).toBeGreaterThan(0);
  });

  it('should call requestPermission when grant button clicked', async () => {
    const wrapper = createWrapper();
    const grantButton = wrapper.find('.btn-wellness-primary');
    
    await grantButton.trigger('click');
    
    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('should show permission denied message when denied', () => {
    mockPermissionState.value = { granted: false, denied: true, pending: false };
    
    const wrapper = createWrapper();
    const deniedAlert = wrapper.find('.wellness-alert-danger');
    
    expect(deniedAlert.exists()).toBe(true);
    expect(deniedAlert.text()).toContain('Notifications Blocked');
  });

  it('should show reset button when notifications are enabled', async () => {
    mockPreferences.value.dailyReminder.enabled = true;
    
    const wrapper = createWrapper();
    await wrapper.vm.$nextTick();

    const resetButton = wrapper.find('.btn-reset');
    expect(resetButton.exists()).toBe(true);
  });

  it('should display error message when lastError is set', () => {
    mockLastError.value = {
      type: 'permission_denied',
      message: 'Test error message',
      timestamp: new Date(),
    };
    
    const wrapper = createWrapper();
    const errorAlert = wrapper.findAll('.wellness-alert-danger');
    
    expect(errorAlert.length).toBeGreaterThan(0);
    expect(wrapper.text()).toContain('Test error message');
  });

  it('should show pending notification count when has permission', async () => {
    mockPermissionState.value = { granted: true, denied: false, pending: false };
    mockGetPendingCount.mockResolvedValue(5);
    
    const wrapper = createWrapper();
    await new Promise(resolve => setTimeout(resolve, 100));
    await wrapper.vm.$nextTick();

    expect(mockGetPendingCount).toHaveBeenCalled();
  });

  it('should disable toggles when permission not granted', () => {
    const wrapper = createWrapper();
    const switches = wrapper.findAll('.custom-control-input');
    
    switches.forEach(switchElement => {
      expect(switchElement.attributes('disabled')).toBeDefined();
    });
  });

  it('should have correct default time values', () => {
    const wrapper = createWrapper();
    const vm = wrapper.vm as any;

    expect(vm.dailyHour).toBe(9);
    expect(vm.dailyMinute).toBe(0);
    expect(vm.weeklyDay).toBe(0);
    expect(vm.weeklyHour).toBe(20);
    expect(vm.weeklyMinute).toBe(0);
    expect(vm.holidayDaysBefore).toBe(3);
  });
});
