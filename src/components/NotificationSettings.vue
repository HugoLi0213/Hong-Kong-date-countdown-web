<template>
  <div class="notification-settings" role="region" aria-label="Notification Settings">
    <div class="card wellness-card mb-4">
      <div class="card-header wellness-header d-flex justify-content-between align-items-center">
        <h3 class="mb-0" id="notification-settings-title">
          <i class="fas fa-bell" aria-hidden="true"></i>
          <span class="wellness-title">{{ language === 'en' ? 'Notification Preferences' : '通知偏好設置' }}</span>
        </h3>
        <div class="header-actions">
          <button
            v-if="anyNotificationEnabled"
            @click="handleReset"
            class="btn btn-sm btn-reset"
            :title="language === 'en' ? 'Reset all settings' : '重置所有設置'"
            :aria-label="language === 'en' ? 'Reset all notification settings' : '重置所有通知設置'"
          >
            <i class="fas fa-redo" aria-hidden="true"></i>
            {{ language === 'en' ? 'Reset' : '重置' }}
          </button>
        </div>
      </div>

      <div class="card-body wellness-body">
        <!-- Permission Status -->
        <div v-if="!hasPermission" class="alert wellness-alert-warning mb-4" role="alert">
          <div class="alert-icon">
            <i class="fas fa-bell-slash" aria-hidden="true"></i>
          </div>
          <div class="alert-content">
            <h5 class="alert-heading">
              {{ language === 'en' ? 'Enable Notifications for Wellness' : '啟用通知以促進健康' }}
            </h5>
            <p>
              {{
                language === 'en'
                  ? 'Stay mindful of upcoming holidays and take regular wellness breaks. Grant notification permissions to receive gentle reminders that support your work-life balance.'
                  : '關注即將到來的假期並定期進行健康休息。授予通知權限以接收溫和的提醒，支持您的工作與生活平衡。'
              }}
            </p>
            <button 
              @click="handleRequestPermission" 
              class="btn btn-wellness-primary" 
              :disabled="isLoading"
              :aria-label="language === 'en' ? 'Grant notification permissions' : '授予通知權限'"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm mr-2" role="status" aria-hidden="true"></span>
              <i v-if="!isLoading" class="fas fa-check-circle mr-2" aria-hidden="true"></i>
              {{ language === 'en' ? 'Enable Notifications' : '啟用通知' }}
            </button>
          </div>
        </div>

        <div v-if="permissionState.denied" class="alert wellness-alert-danger mb-4" role="alert">
          <div class="alert-icon">
            <i class="fas fa-times-circle" aria-hidden="true"></i>
          </div>
          <div class="alert-content">
            <h5 class="alert-heading">
              {{ language === 'en' ? 'Notifications Blocked' : '通知被阻止' }}
            </h5>
            <p>
              {{
                language === 'en'
                  ? 'Notification permissions were denied. To enable wellness reminders, please allow notifications in your browser settings.'
                  : '通知權限被拒絕。要啟用健康提醒，請在瀏覽器設置中允許通知。'
              }}
            </p>
            <div class="alert-help">
              <small>
                <i class="fas fa-info-circle mr-1" aria-hidden="true"></i>
                {{ language === 'en' ? 'Click the lock icon in your browser address bar to change permissions' : '點擊瀏覽器地址欄中的鎖圖標以更改權限' }}
              </small>
            </div>
          </div>
        </div>

        <!-- Error Display -->
        <div v-if="lastError" class="alert wellness-alert-danger mb-4" role="alert">
          <button 
            type="button" 
            class="close" 
            @click="clearError"
            :aria-label="language === 'en' ? 'Close error message' : '關閉錯誤消息'"
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <div class="alert-content">
            <i class="fas fa-exclamation-circle mr-2" aria-hidden="true"></i>
            <span>{{ lastError.message }}</span>
          </div>
        </div>

        <!-- Pending Notifications Counter -->
        <div v-if="hasPermission && pendingCount > 0" class="wellness-status mb-4" role="status" aria-live="polite">
          <div class="status-icon">
            <i class="fas fa-calendar-check" aria-hidden="true"></i>
          </div>
          <div class="status-content">
            <strong>{{ language === 'en' ? 'Active Reminders' : '活動提醒' }}</strong>
            <p class="mb-0">
              {{
                language === 'en'
                  ? `${pendingCount} notification${pendingCount !== 1 ? 's' : ''} scheduled`
                  : `已安排 ${pendingCount} 個通知`
              }}
            </p>
            <small class="text-muted">
              {{ language === 'en' ? 'Next reminder will arrive at the scheduled time' : '下一個提醒將在預定時間到達' }}
            </small>
          </div>
        </div>

        <!-- Success message after save -->
        <transition name="fade">
          <div v-if="showSaveSuccess" class="alert wellness-alert-success mb-4" role="alert" aria-live="polite">
            <i class="fas fa-check-circle mr-2" aria-hidden="true"></i>
            {{ language === 'en' ? 'Settings saved successfully!' : '設置保存成功！' }}
          </div>
        </transition>

        <!-- Daily Reminder Settings -->
        <div class="wellness-setting-card mb-4" :class="{ 'setting-active': preferences.dailyReminder.enabled }">
          <div class="setting-header">
            <div class="setting-info">
              <div class="setting-icon daily-icon">
                <i class="fas fa-sun" aria-hidden="true"></i>
              </div>
              <div class="setting-text">
                <h5 class="mb-1">
                  {{ language === 'en' ? 'Daily Holiday Reminder' : '每日假期提醒' }}
                </h5>
                <small class="setting-description">
                  {{
                    language === 'en'
                      ? 'Start your day mindfully with holiday awareness'
                      : '以假期意識開始新的一天'
                  }}
                </small>
              </div>
            </div>
            <div class="custom-control custom-switch wellness-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="dailyReminderSwitch"
                :checked="preferences.dailyReminder.enabled"
                @change="handleToggleDaily"
                :disabled="!hasPermission && !preferences.dailyReminder.enabled"
                :aria-label="language === 'en' ? 'Toggle daily holiday reminder' : '切換每日假期提醒'"
                :aria-describedby="preferences.dailyReminder.enabled ? 'daily-next-time' : ''"
              />
              <label class="custom-control-label" for="dailyReminderSwitch"></label>
            </div>
          </div>

          <transition name="expand">
            <div v-if="preferences.dailyReminder.enabled" class="setting-details">
              <div class="time-picker-section">
                <label class="wellness-label">
                  <i class="fas fa-clock mr-2" aria-hidden="true"></i>
                  {{ language === 'en' ? 'Choose Your Reminder Time' : '選擇提醒時間' }}
                </label>
                <div class="row">
                  <div class="col-6">
                    <label for="daily-hour" class="sr-only">Hour</label>
                    <select
                      id="daily-hour"
                      v-model.number="dailyHour"
                      @change="handleUpdateDailyTime"
                      class="form-control wellness-select"
                      :aria-label="language === 'en' ? 'Select hour for daily reminder' : '選擇每日提醒的小時'"
                    >
                      <option v-for="h in 24" :key="h - 1" :value="h - 1">
                        {{ formatHour(h - 1) }}
                      </option>
                    </select>
                  </div>
                  <div class="col-6">
                    <label for="daily-minute" class="sr-only">Minute</label>
                    <select
                      id="daily-minute"
                      v-model.number="dailyMinute"
                      @change="handleUpdateDailyTime"
                      class="form-control wellness-select"
                      :aria-label="language === 'en' ? 'Select minute for daily reminder' : '選擇每日提醒的分鐘'"
                    >
                      <option :value="0">00</option>
                      <option :value="15">15</option>
                      <option :value="30">30</option>
                      <option :value="45">45</option>
                    </select>
                  </div>
                </div>
                <div class="next-notification-time" id="daily-next-time" role="status" aria-live="polite">
                  <i class="fas fa-info-circle mr-2" aria-hidden="true"></i>
                  <span>
                    {{ language === 'en' ? 'Next reminder:' : '下一個提醒：' }}
                    <strong>{{ getNextDailyTime() }}</strong>
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Weekly Wellness Settings -->
        <div class="wellness-setting-card mb-4" :class="{ 'setting-active': preferences.weeklyWellness.enabled }">
          <div class="setting-header">
            <div class="setting-info">
              <div class="setting-icon wellness-icon">
                <i class="fas fa-heart" aria-hidden="true"></i>
              </div>
              <div class="setting-text">
                <h5 class="mb-1">
                  {{ language === 'en' ? 'Weekly Wellness Check-in' : '每週健康檢查' }}
                </h5>
                <small class="setting-description">
                  {{
                    language === 'en'
                      ? 'Plan ahead with a weekly moment of reflection'
                      : '每週反思，提前計劃'
                  }}
                </small>
              </div>
            </div>
            <div class="custom-control custom-switch wellness-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="weeklyWellnessSwitch"
                :checked="preferences.weeklyWellness.enabled"
                @change="handleToggleWeekly"
                :disabled="!hasPermission && !preferences.weeklyWellness.enabled"
                :aria-label="language === 'en' ? 'Toggle weekly wellness check-in' : '切換每週健康檢查'"
                :aria-describedby="preferences.weeklyWellness.enabled ? 'weekly-next-time' : ''"
              />
              <label class="custom-control-label" for="weeklyWellnessSwitch"></label>
            </div>
          </div>

          <transition name="expand">
            <div v-if="preferences.weeklyWellness.enabled" class="setting-details">
              <div class="time-picker-section">
                <label class="wellness-label">
                  <i class="fas fa-calendar-week mr-2" aria-hidden="true"></i>
                  {{ language === 'en' ? 'Choose Your Check-in Day & Time' : '選擇您的檢查日期和時間' }}
                </label>
                <div class="row mb-3">
                  <div class="col-12">
                    <label for="weekly-day" class="sr-only">Day of week</label>
                    <select
                      id="weekly-day"
                      v-model.number="weeklyDay"
                      @change="handleUpdateWeeklyTime"
                      class="form-control wellness-select"
                      :aria-label="language === 'en' ? 'Select day for weekly check-in' : '選擇每週檢查的日期'"
                    >
                      <option
                        v-for="(day, index) in daysOfWeek"
                        :key="index"
                        :value="index"
                      >
                        {{ day }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="row">
                  <div class="col-6">
                    <label for="weekly-hour" class="sr-only">Hour</label>
                    <select
                      id="weekly-hour"
                      v-model.number="weeklyHour"
                      @change="handleUpdateWeeklyTime"
                      class="form-control wellness-select"
                      :aria-label="language === 'en' ? 'Select hour for weekly check-in' : '選擇每週檢查的小時'"
                    >
                      <option v-for="h in 24" :key="h - 1" :value="h - 1">
                        {{ formatHour(h - 1) }}
                      </option>
                    </select>
                  </div>
                  <div class="col-6">
                    <label for="weekly-minute" class="sr-only">Minute</label>
                    <select
                      id="weekly-minute"
                      v-model.number="weeklyMinute"
                      @change="handleUpdateWeeklyTime"
                      class="form-control wellness-select"
                      :aria-label="language === 'en' ? 'Select minute for weekly check-in' : '選擇每週檢查的分鐘'"
                    >
                      <option :value="0">00</option>
                      <option :value="15">15</option>
                      <option :value="30">30</option>
                      <option :value="45">45</option>
                    </select>
                  </div>
                </div>
                <div class="next-notification-time" id="weekly-next-time" role="status" aria-live="polite">
                  <i class="fas fa-info-circle mr-2" aria-hidden="true"></i>
                  <span>
                    {{ language === 'en' ? 'Next check-in:' : '下一次檢查：' }}
                    <strong>{{ getNextWeeklyTime() }}</strong>
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Holiday Alert Settings -->
        <div class="wellness-setting-card mb-4" :class="{ 'setting-active': preferences.holidayAlert.enabled }">
          <div class="setting-header">
            <div class="setting-info">
              <div class="setting-icon holiday-icon">
                <i class="fas fa-calendar-check" aria-hidden="true"></i>
              </div>
              <div class="setting-text">
                <h5 class="mb-1">
                  {{ language === 'en' ? 'Pre-Holiday Alerts' : '假期前提醒' }}
                </h5>
                <small class="setting-description">
                  {{
                    language === 'en'
                      ? 'Prepare mindfully for upcoming celebrations'
                      : '為即將到來的慶祝活動做好準備'
                  }}
                </small>
              </div>
            </div>
            <div class="custom-control custom-switch wellness-switch">
              <input
                type="checkbox"
                class="custom-control-input"
                id="holidayAlertSwitch"
                :checked="preferences.holidayAlert.enabled"
                @change="handleToggleHoliday"
                :disabled="!hasPermission && !preferences.holidayAlert.enabled"
                :aria-label="language === 'en' ? 'Toggle pre-holiday alerts' : '切換假期前提醒'"
                :aria-describedby="preferences.holidayAlert.enabled ? 'holiday-next-time' : ''"
              />
              <label class="custom-control-label" for="holidayAlertSwitch"></label>
            </div>
          </div>

          <transition name="expand">
            <div v-if="preferences.holidayAlert.enabled" class="setting-details">
              <div class="time-picker-section">
                <label class="wellness-label">
                  <i class="fas fa-hourglass-half mr-2" aria-hidden="true"></i>
                  {{ language === 'en' ? 'Advance Notice Period' : '提前通知期' }}
                </label>
                <label for="holiday-days" class="sr-only">Days before holiday</label>
                <select
                  id="holiday-days"
                  v-model.number="holidayDaysBefore"
                  @change="handleUpdateHolidayDays"
                  class="form-control wellness-select"
                  :aria-label="language === 'en' ? 'Select days before holiday for alert' : '選擇假期前幾天提醒'"
                >
                  <option :value="1">1 {{ language === 'en' ? 'day before' : '天前' }}</option>
                  <option :value="2">2 {{ language === 'en' ? 'days before' : '天前' }}</option>
                  <option :value="3">3 {{ language === 'en' ? 'days before' : '天前' }}</option>
                  <option :value="5">5 {{ language === 'en' ? 'days before' : '天前' }}</option>
                  <option :value="7">7 {{ language === 'en' ? 'days before' : '天前' }}</option>
                </select>
                <div class="next-notification-time" id="holiday-next-time" role="status" aria-live="polite">
                  <i class="fas fa-info-circle mr-2" aria-hidden="true"></i>
                  <span>
                    {{ language === 'en' ? 'Next alert:' : '下一個提醒：' }}
                    <strong>{{ getNextHolidayAlert() }}</strong>
                  </span>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <!-- Save Confirmation -->
        <div class="wellness-footer" v-if="hasPermission">
          <div class="footer-info">
            <i class="fas fa-shield-alt mr-2" aria-hidden="true"></i>
            <small>
              {{ language === 'en' 
                ? 'Your preferences are saved automatically and stored securely on your device.' 
                : '您的偏好設置會自動保存並安全地存儲在您的設備上。' 
              }}
            </small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useNotifications } from '../composables/useNotifications.js';

export default {
  name: 'NotificationSettings',
  props: {
    language: {
      type: String,
      required: true
    },
    holidays: {
      type: Array,
      required: true
    }
  },
  emits: ['settingsChanged', 'permissionGranted', 'error'],
  setup(props, { emit }) {

const {
  preferences,
  permissionState,
  lastError,
  isLoading,
  hasPermission,
  needsPermission,
  anyNotificationEnabled,
  requestPermission,
  toggleDailyReminder,
  updateDailyReminderTime,
  toggleWeeklyWellness,
  updateWeeklyWellnessTime,
  toggleHolidayAlert,
  updateHolidayAlertDays,
  resetPreferences,
  getPendingCount,
} = useNotifications();

// Local reactive state for inputs
const dailyHour = ref(preferences.value.dailyReminder.time.hour);
const dailyMinute = ref(preferences.value.dailyReminder.time.minute);
const weeklyDay = ref(preferences.value.weeklyWellness.dayOfWeek);
const weeklyHour = ref(preferences.value.weeklyWellness.time.hour);
const weeklyMinute = ref(preferences.value.weeklyWellness.time.minute);
const holidayDaysBefore = ref(preferences.value.holidayAlert.daysBeforeAlert);
const pendingCount = ref(0);
const showSaveSuccess = ref(false);

const daysOfWeek = computed(() =>
  props.language === 'en'
    ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
);

// Update pending count
async function updatePendingCount() {
  pendingCount.value = await getPendingCount();
}

// Clear error
function clearError() {
  lastError.value = null;
}

// Show save success message
function showSaveMessage() {
  showSaveSuccess.value = true;
  setTimeout(() => {
    showSaveSuccess.value = false;
  }, 3000);
}

// Format hour for display (with AM/PM or 24-hour)
function formatHour(hour) {
  if (props.language === 'en') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  }
  return `${String(hour).padStart(2, '0')}:00`;
}

// Get next daily reminder time
function getNextDailyTime() {
  const now = new Date();
  const next = new Date();
  next.setHours(dailyHour.value, dailyMinute.value, 0, 0);
  
  // If time has passed today, show tomorrow
  if (next <= now) {
    next.setDate(next.getDate() + 1);
  }
  
  return formatDateTime(next);
}

// Get next weekly reminder time
function getNextWeeklyTime() {
  const now = new Date();
  const next = new Date();
  const currentDay = now.getDay();
  const targetDay = weeklyDay.value;
  
  let daysUntil = targetDay - currentDay;
  if (daysUntil < 0 || (daysUntil === 0 && now.getHours() * 60 + now.getMinutes() >= weeklyHour.value * 60 + weeklyMinute.value)) {
    daysUntil += 7;
  }
  
  next.setDate(now.getDate() + daysUntil);
  next.setHours(weeklyHour.value, weeklyMinute.value, 0, 0);
  
  return formatDateTime(next);
}

// Get next holiday alert
function getNextHolidayAlert() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  
  // Find the next upcoming holiday
  for (const holiday of props.holidays) {
    const holidayDate = new Date(holiday.date);
    holidayDate.setHours(0, 0, 0, 0);
    
    const alertDate = new Date(holidayDate);
    alertDate.setDate(alertDate.getDate() - holidayDaysBefore.value);
    alertDate.setHours(9, 0, 0, 0);
    
    if (alertDate > now) {
      return `${formatDateTime(alertDate)} (${holiday.event})`;
    }
  }
  
  return props.language === 'en' ? 'No upcoming holidays' : '沒有即將到來的假期';
}

// Format date/time for display
function formatDateTime(date) {
  const options = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  };
  
  return date.toLocaleString(props.language === 'en' ? 'en-US' : 'zh-HK', options);
}

// Event handlers
async function handleRequestPermission() {
  await requestPermission();
  await updatePendingCount();
  if (hasPermission.value) {
    showSaveMessage();
  }
}

async function handleToggleDaily(event) {
  const target = event.target;
  await toggleDailyReminder(target.checked);
  await updatePendingCount();
  showSaveMessage();
  
  // Emit event for parent component
  emitSettingsChange();
}

async function handleUpdateDailyTime() {
  await updateDailyReminderTime(dailyHour.value, dailyMinute.value);
  await updatePendingCount();
  showSaveMessage();
  emitSettingsChange();
}

async function handleToggleWeekly(event) {
  const target = event.target;
  await toggleWeeklyWellness(target.checked);
  await updatePendingCount();
  showSaveMessage();
  emitSettingsChange();
}

async function handleUpdateWeeklyTime() {
  await updateWeeklyWellnessTime(weeklyDay.value, weeklyHour.value, weeklyMinute.value);
  await updatePendingCount();
  showSaveMessage();
  emitSettingsChange();
}

async function handleToggleHoliday(event) {
  const target = event.target;
  await toggleHolidayAlert(target.checked, props.holidays);
  await updatePendingCount();
  showSaveMessage();
  emitSettingsChange();
}

async function handleUpdateHolidayDays() {
  await updateHolidayAlertDays(holidayDaysBefore.value, props.holidays);
  await updatePendingCount();
  showSaveMessage();
  emitSettingsChange();
}

async function handleReset() {
  const confirmMessage = props.language === 'en' 
    ? 'Are you sure you want to reset all notification settings? This will disable all reminders and restore default times.' 
    : '您確定要重置所有通知設置嗎？這將禁用所有提醒並恢復默認時間。';
    
  if (confirm(confirmMessage)) {
    await resetPreferences();
    dailyHour.value = 9;
    dailyMinute.value = 0;
    weeklyDay.value = 0;
    weeklyHour.value = 20;
    weeklyMinute.value = 0;
    holidayDaysBefore.value = 3;
    await updatePendingCount();
    showSaveMessage();
    emitSettingsChange();
  }
}

// Emit settings change event
function emitSettingsChange() {
  emit('settingsChanged', preferences.value);
}

// Watch for preference changes from localStorage
watch(
  () => preferences.value,
  (newPrefs) => {
    dailyHour.value = newPrefs.dailyReminder.time.hour;
    dailyMinute.value = newPrefs.dailyReminder.time.minute;
    weeklyDay.value = newPrefs.weeklyWellness.dayOfWeek;
    weeklyHour.value = newPrefs.weeklyWellness.time.hour;
    weeklyMinute.value = newPrefs.weeklyWellness.time.minute;
    holidayDaysBefore.value = newPrefs.holidayAlert.daysBeforeAlert;
  },
  { deep: true }
);

// Initial pending count
updatePendingCount();

// Return all reactive properties and methods for the template
return {
  preferences,
  permissionState,
  lastError,
  isLoading,
  hasPermission,
  needsPermission,
  anyNotificationEnabled,
  dailyHour,
  dailyMinute,
  weeklyDay,
  weeklyHour,
  weeklyMinute,
  holidayDaysBefore,
  pendingCount,
  showSaveSuccess,
  daysOfWeek,
  formatHour,
  getNextDailyTime,
  getNextWeeklyTime,
  getNextHolidayAlert,
  handleRequestPermission,
  handleToggleDaily,
  handleUpdateDailyTime,
  handleToggleWeekly,
  handleUpdateWeeklyTime,
  handleToggleHoliday,
  handleUpdateHolidayDays,
  handleReset,
  clearError,
};
  }
};
</script>

<style scoped>
/* Main Container */
.notification-settings {
  margin-top: 2rem;
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Wellness Card */
.wellness-card {
  background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%);
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.wellness-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
}

.wellness-header {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  color: white;
  padding: 1.5rem;
  border-bottom: none;
}

.wellness-title {
  font-weight: 600;
  font-size: 1.25rem;
  margin-left: 0.75rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-reset {
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0.5rem;
  padding: 0.5rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-reset:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.05);
}

.wellness-body {
  padding: 2rem;
  background-color: #F9FBE7;
}

/* Alerts */
.wellness-alert-warning,
.wellness-alert-danger,
.wellness-alert-success {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.wellness-alert-warning {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFECB3 100%);
  color: #5D4037;
}

.wellness-alert-danger {
  background: linear-gradient(135deg, #FFCDD2 0%, #F8BBD0 100%);
  color: #B71C1C;
}

.wellness-alert-success {
  background: linear-gradient(135deg, #C8E6C9 0%, #DCEDC8 100%);
  color: #1B5E20;
}

.alert-icon {
  font-size: 2rem;
  margin-right: 1rem;
  opacity: 0.8;
  flex-shrink: 0;
}

.alert-content {
  flex-grow: 1;
}

.alert-heading {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.alert-help {
  margin-top: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 0.25rem;
}

.btn-wellness-primary {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  margin-top: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 187, 106, 0.3);
}

.btn-wellness-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #81C784 0%, #66BB6A 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 187, 106, 0.4);
}

.btn-wellness-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Status Display */
.wellness-status {
  display: flex;
  align-items: center;
  padding: 1.25rem;
  background: linear-gradient(135deg, #E3F2FD 0%, #E1F5FE 100%);
  border-radius: 0.75rem;
  border-left: 4px solid #42A5F5;
  color: #01579B;
}

.status-icon {
  font-size: 2rem;
  margin-right: 1rem;
  color: #42A5F5;
  flex-shrink: 0;
}

.status-content {
  flex-grow: 1;
}

/* Setting Cards */
.wellness-setting-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1.5rem;
  border: 2px solid #E0E0E0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.wellness-setting-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, #BDBDBD 0%, #E0E0E0 100%);
  transition: all 0.3s ease;
}

.wellness-setting-card:hover {
  border-color: #AED581;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.wellness-setting-card.setting-active {
  border-color: #81C784;
  background: linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%);
}

.wellness-setting-card.setting-active::before {
  background: linear-gradient(180deg, #66BB6A 0%, #81C784 100%);
}

.setting-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0;
}

.setting-info {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.setting-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 1rem;
  transition: transform 0.3s ease;
  flex-shrink: 0;
}

.wellness-setting-card:hover .setting-icon {
  transform: scale(1.1);
}

.daily-icon {
  background: linear-gradient(135deg, #FFF9C4 0%, #FFECB3 100%);
  color: #F57C00;
}

.wellness-icon {
  background: linear-gradient(135deg, #FFCDD2 0%, #F8BBD0 100%);
  color: #C62828;
}

.holiday-icon {
  background: linear-gradient(135deg, #C8E6C9 0%, #DCEDC8 100%);
  color: #2E7D32;
}

.setting-text h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 0.25rem;
}

.setting-description {
  color: #607D8B;
  font-size: 0.9rem;
}

/* Custom Switch */
.wellness-switch {
  margin-left: 1rem;
}

.wellness-switch .custom-control-input:checked ~ .custom-control-label::before {
  background: linear-gradient(135deg, #66BB6A 0%, #81C784 100%);
  border-color: #66BB6A;
  box-shadow: 0 2px 8px rgba(102, 187, 106, 0.4);
}

.wellness-switch .custom-control-label {
  cursor: pointer;
}

.wellness-switch .custom-control-label::before {
  width: 3rem;
  height: 1.5rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.wellness-switch .custom-control-label::after {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

/* Setting Details (Expandable Section) */
.setting-details {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #E0E0E0;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  margin-top: 0;
}

/* Time Picker Section */
.time-picker-section {
  background: white;
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid #E0E0E0;
}

.wellness-label {
  font-weight: 600;
  color: #2C3E50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

.wellness-select {
  background-color: #F5F5F5;
  border: 2px solid #E0E0E0;
  color: #2C3E50;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
}

.wellness-select:hover {
  border-color: #AED581;
  background-color: #F1F8E9;
}

.wellness-select:focus {
  background-color: #E8F5E9;
  border-color: #81C784;
  box-shadow: 0 0 0 0.2rem rgba(129, 199, 132, 0.25);
  outline: none;
}

.wellness-select option {
  background-color: white;
  color: #2C3E50;
  padding: 0.5rem;
}

/* Next Notification Time Display */
.next-notification-time {
  margin-top: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #E3F2FD 0%, #E1F5FE 100%);
  border-radius: 0.5rem;
  border-left: 3px solid #42A5F5;
  color: #01579B;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
}

.next-notification-time strong {
  color: #0277BD;
  font-weight: 600;
}

/* Footer */
.wellness-footer {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px dashed #E0E0E0;
}

.footer-info {
  display: flex;
  align-items: center;
  color: #607D8B;
  font-size: 0.85rem;
}

/* Close Button */
.close {
  color: inherit;
  opacity: 0.7;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1;
  background: transparent;
  border: none;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.close:hover {
  opacity: 1;
}

/* Spinner */
.spinner-border-sm {
  width: 1rem;
  height: 1rem;
  border-width: 0.15em;
}

/* Fade Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .wellness-body {
    padding: 1.5rem;
  }

  .wellness-header {
    padding: 1rem;
  }

  .wellness-title {
    font-size: 1.1rem;
  }

  .setting-icon {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.25rem;
  }

  .setting-text h5 {
    font-size: 1rem;
  }

  .wellness-setting-card {
    padding: 1rem;
  }
}

/* Keyboard Focus Styles */
*:focus {
  outline: 2px solid #81C784;
  outline-offset: 2px;
}

button:focus,
input:focus,
select:focus {
  outline: 2px solid #66BB6A;
  outline-offset: 2px;
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .wellness-card {
    border: 2px solid #000;
  }

  .wellness-setting-card {
    border: 2px solid #000;
  }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
