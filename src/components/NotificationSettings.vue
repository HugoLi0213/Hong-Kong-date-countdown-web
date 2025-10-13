<template>
  <div class="notification-settings">
    <div class="card">
      <div class="card-header">
        <h5 class="mb-0">
          <i class="fas fa-bell mr-2"></i>
          {{ language === 'en' ? 'Notification Settings' : '通知設定' }}
        </h5>
      </div>
      <div class="card-body">
        <div class="form-group">
          <div class="custom-control custom-switch">
            <input
              type="checkbox"
              class="custom-control-input"
              id="enableNotifications"
              v-model="notificationsEnabled"
              @change="saveSettings"
            >
            <label class="custom-control-label" for="enableNotifications">
              {{ language === 'en' ? 'Enable Notifications' : '啟用通知' }}
            </label>
          </div>
        </div>

        <div v-if="notificationsEnabled" class="mt-3">
          <h6>{{ language === 'en' ? 'Notify me for:' : '通知我以下事項：' }}</h6>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="notifyUpcoming"
              v-model="notifyUpcoming"
              @change="saveSettings"
            >
            <label class="form-check-label" for="notifyUpcoming">
              {{ language === 'en' ? 'Upcoming holidays (7 days before)' : '即將到來的假期（提前7天）' }}
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="notifyLongWeekends"
              v-model="notifyLongWeekends"
              @change="saveSettings"
            >
            <label class="form-check-label" for="notifyLongWeekends">
              {{ language === 'en' ? 'Long weekends' : '長週末' }}
            </label>
          </div>

          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="notifyPublicHolidays"
              v-model="notifyPublicHolidays"
              @change="saveSettings"
            >
            <label class="form-check-label" for="notifyPublicHolidays">
              {{ language === 'en' ? 'Public holidays' : '公眾假期' }}
            </label>
          </div>

          <div class="form-group mt-3">
            <label for="reminderTime">
              {{ language === 'en' ? 'Reminder Time' : '提醒時間' }}
            </label>
            <select
              class="form-control"
              id="reminderTime"
              v-model="reminderTime"
              @change="saveSettings"
            >
              <option value="09:00">{{ language === 'en' ? '9:00 AM' : '上午9:00' }}</option>
              <option value="12:00">{{ language === 'en' ? '12:00 PM' : '中午12:00' }}</option>
              <option value="18:00">{{ language === 'en' ? '6:00 PM' : '下午6:00' }}</option>
              <option value="20:00">{{ language === 'en' ? '8:00 PM' : '晚上8:00' }}</option>
            </select>
          </div>
        </div>

        <div class="mt-3">
          <button
            class="btn btn-primary btn-sm"
            @click="testNotification"
            :disabled="!notificationsEnabled"
          >
            <i class="fas fa-test-tube mr-1"></i>
            {{ language === 'en' ? 'Test Notification' : '測試通知' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotificationSettings',
  props: {
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      notificationsEnabled: false,
      notifyUpcoming: true,
      notifyLongWeekends: true,
      notifyPublicHolidays: true,
      reminderTime: '09:00'
    }
  },
  mounted() {
    this.loadSettings()
  },
  methods: {
    loadSettings() {
      const settings = localStorage.getItem('notificationSettings')
      if (settings) {
        const parsed = JSON.parse(settings)
        Object.assign(this.$data, parsed)
      }
    },
    saveSettings() {
      const settings = {
        notificationsEnabled: this.notificationsEnabled,
        notifyUpcoming: this.notifyUpcoming,
        notifyLongWeekends: this.notifyLongWeekends,
        notifyPublicHolidays: this.notifyPublicHolidays,
        reminderTime: this.reminderTime
      }
      localStorage.setItem('notificationSettings', JSON.stringify(settings))
      this.$emit('settings-changed', settings)
    },
    testNotification() {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            new Notification('Hong Kong Holiday Countdown', {
              body: this.language === 'en' ? 'This is a test notification!' : '這是一個測試通知！',
              icon: '/favicon.ico'
            })
          }
        })
      }
    }
  }
}
</script>

<style scoped>
.notification-settings {
  max-width: 500px;
}

.custom-control-label {
  font-weight: normal;
}

.form-check-label {
  font-size: 0.9rem;
}
</style>
