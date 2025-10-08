
<template>
  <main class="container-fluid" role="main">
    <header class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
      <nav class="btn-group-container mb-2 mb-md-0" role="navigation" aria-label="View mode selection">
        <button @click="viewMode = 'list'" 
                :class="['btn', 'btn-sm', 'mr-2', viewMode === 'list' ? 'btn-success' : 'btn-outline-success']"
                :aria-pressed="viewMode === 'list'"
                aria-label="Switch to list view">
          <i class="fas fa-list" aria-hidden="true"></i> {{ language === 'en' ? 'List' : '列表' }}
        </button>
        <button @click="viewMode = 'calendar'" 
                :class="['btn', 'btn-sm', 'mr-2', viewMode === 'calendar' ? 'btn-success' : 'btn-outline-success']"
                :aria-pressed="viewMode === 'calendar'"
                aria-label="Switch to calendar view">
          <i class="fas fa-calendar" aria-hidden="true"></i> {{ language === 'en' ? 'Calendar' : '日曆' }}
        </button>
      </nav>
      <nav v-if="viewMode === 'list'" class="btn-group-container mb-2 mb-md-0" role="navigation" aria-label="Holiday filter">
        <button @click="showExpired = false" 
                :class="['btn', 'btn-sm', 'mr-2', !showExpired ? 'btn-primary' : 'btn-outline-primary']"
                :aria-pressed="!showExpired"
                aria-label="Show upcoming holidays">
          {{ language === 'en' ? 'Upcoming' : '即將到來' }}
        </button>
        <button @click="showExpired = true" 
                :class="['btn', 'btn-sm', showExpired ? 'btn-primary' : 'btn-outline-primary']"
                :aria-pressed="showExpired"
                aria-label="Show past holidays">
          {{ language === 'en' ? 'Past' : '已過期' }}
        </button>
      </nav>
      <div class="btn-group-container" role="toolbar" aria-label="Tools">
        <button @click="toggleLanguage" 
                class="btn btn-secondary btn-sm ml-1"
                :aria-label="`Switch to ${language === 'en' ? 'Chinese' : 'English'}`">
          <i class="fas fa-language" aria-hidden="true"></i>
        </button>
        <button @click="toggleSettings" class="btn btn-info btn-sm ml-1" aria-label="Notification Settings">
          <i class="fas fa-cog"></i>
        </button>
        <button v-if="viewMode === 'list'" 
                @click="sortDatesAscending" 
                class="btn btn-secondary btn-sm ml-1"
                aria-label="Sort dates ascending">
          <i class="fas fa-sort-amount-up" aria-hidden="true"></i>
        </button>
        <button v-if="viewMode === 'list'" 
                @click="sortDatesDescending" 
                class="btn btn-secondary btn-sm ml-1"
                aria-label="Sort dates descending">
          <i class="fas fa-sort-amount-down" aria-hidden="true"></i>
        </button>
      </div>
    </header>
    <transition name="fade">
      <div v-if="showSettings" class="settings-modal-overlay" @click.self="toggleSettings">
        <div class="settings-modal">
          <component :is="NotificationSettingsComponent" :language="language" :holidays="dates" v-if="NotificationSettingsComponent" />
          <button class="btn btn-secondary close-modal-btn" @click="toggleSettings" style="margin-top:1em;">
            <i class="fas fa-times"></i> Close
          </button>
        </div>
      </div>
    </transition>
    <transition name="fade" mode="out-in">
      <!-- List View -->
      <section v-if="viewMode === 'list'" class="row" :key="language + '-list'" role="region" :aria-label="`${showExpired ? 'Past' : 'Upcoming'} Hong Kong holidays`">
        <article v-for="(date, index) in sortedDates" :key="index" class="col-12 col-md-6 col-lg-4 mb-2" itemscope itemtype="https://schema.org/Event">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h2 class="card-title h5" itemprop="name">{{ translatedEvent(date.event) }}</h2>
              <time class="card-subtitle mb-2 text-white h6" :datetime="date.date" itemprop="startDate">{{ translatedDate(date.date) }}</time>
              <div :class="['badge', 'countdown-display', isExpired(date.date) ? 'bg-danger' : 'bg-primary']" role="timer" :aria-label="`Time until ${translatedEvent(date.event)}`">{{ formattedCountdown(date.date) }}</div>
              <div v-if="getConsecutiveHolidays(date.date).length > 1" class="consecutive-holiday-info mt-2">
                <small class="text-warning"><i class="fas fa-calendar-check"></i> {{ language === 'en' ? 'Long Weekend' : '連續假期' }}: {{ getConsecutiveHolidays(date.date).length }} {{ language === 'en' ? 'days' : '天' }}</small>
              </div>
              <div class="holiday-details">
                <small class="text-muted">{{ formatConsecutiveHolidays(date.date) }}</small>
              </div>
            </div>
          </div>
        </article>
      </section>
      <!-- Calendar View -->
      <section v-else>
        <CalendarView :dates="dates" :language="language" :translations="translations" />
      </section>
    </transition>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import CalendarView from './CalendarView.vue';
import holidaysData from '@/data/holidays.json';

const viewMode = ref('list');
const showExpired = ref(false);
const language = ref('en');
const showSettings = ref(false);
const sortDirection = ref('asc');

// Map holidays data into a reactive ref used across the component
const dates = ref(holidaysData.map(h => ({ event: h.event, date: h.date })));

// Lazy load NotificationSettings
const NotificationSettingsComponent = ref(null);

async function loadNotificationSettings() {
  if (!NotificationSettingsComponent.value) {
    NotificationSettingsComponent.value = (await import('./NotificationSettings.vue')).default;
  }
}

async function toggleSettings() {
  showSettings.value = !showSettings.value;
  if (showSettings.value) {
    await loadNotificationSettings();
  }
}

const translations = {
  en: {
    events: {
      "New Year's Day": "New Year's Day",
      "Lunar New Year's Day": "Lunar New Year's Day",
      'Second day of Lunar New Year': 'Second day of Lunar New Year',
      'Third day of Lunar New Year': 'Third day of Lunar New Year',
      'Ching Ming Festival': 'Ching Ming Festival',
      'Good Friday': 'Good Friday',
      'The day following Good Friday': 'The day following Good Friday',
      'Easter Monday': 'Easter Monday',
      'Labour Day': 'Labour Day',
      "The Birthday of the Buddha": "The Birthday of the Buddha",
      'Tuen Ng Festival': 'Tuen Ng Festival',
      'Hong Kong Special Administrative Region Establishment Day': 'Hong Kong Special Administrative Region Establishment Day',
      'National Day': 'National Day',
      'The day following the Chinese Mid-Autumn Festival': 'The day following the Chinese Mid-Autumn Festival',
      'Chung Yeung Festival': 'Chung Yeung Festival',
      'Christmas Day': 'Christmas Day',
      'The first weekday after Christmas Day': 'The first weekday after Christmas Day'
    },
    dates: {
      'January 1, 2025': 'January 1, 2025',
      'January 29, 2025': 'January 29, 2025',
      'January 30, 2025': 'January 30, 2025',
      'January 31, 2025': 'January 31, 2025',
      'April 4, 2025': 'April 4, 2025',
      'April 18, 2025': 'April 18, 2025',
      'April 19, 2025': 'April 19, 2025',
      'April 21, 2025': 'April 21, 2025',
      'May 1, 2025': 'May 1, 2025',
      'May 5, 2025': 'May 5, 2025',
      'May 31, 2025': 'May 31, 2025',
      'July 1, 2025': 'July 1, 2025',
      'October 1, 2025': 'October 1, 2025',
      'October 7, 2025': 'October 7, 2025',
      'October 29, 2025': 'October 29, 2025',
      'December 25, 2025': 'December 25, 2025',
      'December 26, 2025': 'December 26, 2025'
    },
    timeUnits: {
      day: 'day',
      days: 'days',
      hour: 'hour',
      hours: 'hours',
      minute: 'minute',
      minutes: 'minutes',
      second: 'second',
      seconds: 'seconds'
    }
  },
  zh: {
    events: {
      "New Year's Day": '元旦',
      "Lunar New Year's Day": '農曆新年首日',
      'Second day of Lunar New Year': '農曆新年第二天',
      'Third day of Lunar New Year': '農曆新年第三天',
      'Ching Ming Festival': '清明節',
      'Good Friday': '耶穌受難日',
      'The day following Good Friday': '耶穌受難日翌日',
      'Easter Monday': '復活節星期一',
      'Labour Day': '勞動節',
      "The Birthday of the Buddha": '佛誕',
      'Tuen Ng Festival': '端午節',
      'Hong Kong Special Administrative Region Establishment Day': '香港特別行政區成立紀念日',
      'National Day': '國慶日',
      'The day following the Chinese Mid-Autumn Festival': '中秋節翌日',
      'Chung Yeung Festival': '重陽節',
      'Christmas Day': '聖誕節',
      'The first weekday after Christmas Day': '聖誕節後首個周日'
    },
    dates: {
      'January 1, 2025': '2025年1月1日',
      'January 29, 2025': '2025年1月29日',
      'January 30, 2025': '2025年1月30日',
      'January 31, 2025': '2025年1月31日',
      'April 4, 2025': '2025年4月4日',
      'April 18, 2025': '2025年4月18日',
      'April 19, 2025': '2025年4月19日',
      'April 21, 2025': '2025年4月21日',
      'May 1, 2025': '2025年5月1日',
      'May 5, 2025': '2025年5月5日',
      'May 31, 2025': '2025年5月31日',
      'July 1, 2025': '2025年7月1日',
      'October 1, 2025': '2025年10月1日',
      'October 7, 2025': '2025年10月7日',
      'October 29, 2025': '2025年10月29日',
      'December 25, 2025': '2025年12月25日',
      'December 26, 2025': '2025年12月26日'
    },
    timeUnits: {
      day: '天',
      days: '天',
      hour: '小時',
      hours: '小時',
      minute: '分鐘',
      minutes: '分鐘',
      second: '秒',
      seconds: '秒'
    }
  }
};

const sortedDates = computed(() => {
  const list = dates.value.slice();
  const now = new Date();
  let filtered = list.filter(h => {
    const d = new Date(h.date);
    return showExpired.value ? true : d >= now;
  });
  filtered.sort((a, b) => {
    const diff = new Date(a.date) - new Date(b.date);
    return sortDirection.value === 'asc' ? diff : -diff;
  });
  return filtered;
});

function formatDate(dateString) {
  // Prefer translation mapping when available (original repo used formatted strings)
  const mapped = translations[language.value] && translations[language.value].dates && translations[language.value].dates[dateString];
  if (mapped) return mapped;
  const d = new Date(dateString);
  return d.toLocaleDateString(language.value === 'en' ? 'en-US' : 'zh-HK', { month: 'short', day: 'numeric', year: 'numeric' });
}

function toggleLanguage() {
  language.value = language.value === 'en' ? 'zh' : 'en';
}
function sortDatesAscending() {
  sortDirection.value = 'asc';
}
function sortDatesDescending() {
  sortDirection.value = 'desc';
}
function translatedDate(date) {
  // use formatDate to ensure we reuse mapping and fallback formatting
  return formatDate(date);
}
function translatedEvent(event) {
  return (translations[language.value] && translations[language.value].events && translations[language.value].events[event]) || event;
}
function isExpired(dateString) {
  return new Date(dateString) <= new Date();
}
const now = ref(Date.now());
function formattedCountdown(dateString) {
  const nowDate = new Date(now.value);
  const target = new Date(dateString);
  const diff = target - nowDate;
  if (diff <= 0) {
    return language.value === 'en' ? 'Event has passed' : '事件已結束';
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  const units = translations[language.value].timeUnits;
  return `${days}${units.days}, ${hours}${units.hours}, ${minutes}${units.minutes}, ${seconds}${units.seconds}`;
}
function getConsecutiveHolidays(dateString) {
  const targetDate = new Date(dateString);
  const consecutiveDays = [];
  let currentDate = new Date(targetDate);
  while (isHolidayOrWeekend(currentDate)) {
    currentDate.setDate(currentDate.getDate() - 1);
  }
  currentDate.setDate(currentDate.getDate() + 1);
  while (isHolidayOrWeekend(currentDate)) {
    consecutiveDays.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return consecutiveDays;
}
function isHolidayOrWeekend(date) {
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return true;
  }
  const dateString = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  return dates.value.some(holiday => holiday.date === dateString);
}
function formatConsecutiveHolidays(dateString) {
  const consecutiveDays = getConsecutiveHolidays(dateString);
  if (consecutiveDays.length <= 1) return '';
  const startDate = consecutiveDays[0];
  const endDate = consecutiveDays[consecutiveDays.length - 1];
  if (language.value === 'en') {
    return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
  } else {
    return `${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`;
  }
}
onMounted(() => {
  // update `now` every second so countdown badges update reactively
  setInterval(() => { now.value = Date.now(); }, 1000);
});
</script>
<style scoped>
/* Styles remain largely unchanged */
body {
  background-color: #000;
  color: #fff;
  padding-top: 0;
  margin: 0;
}

.container-fluid {
  background-color: #000;
  padding-top: 10px;
}

.card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.card-body {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-title {
  font-size: 1rem;
}

.card-subtitle {
  font-size: 0.8rem;
  color: #fff;
}

.badge {
  font-size: 0.7rem;
  padding: 3px;
}

.countdown-display {
  font-size: 0.9rem;
  padding: 5px;
  line-height: 1.2;
  white-space: normal;
  max-width: 100%;
  word-wrap: break-word;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.btn-group-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.consecutive-holiday-info {
  padding: 0.25rem 0;
  border-radius: 0.25rem;
}

.consecutive-holiday-info .text-warning {
  font-weight: bold;
}

.holiday-details {
  margin-top: 0.25rem;
}

.holiday-details .text-muted {
  font-size: 0.75rem;
}

.site-footer {
  margin-top: 20px;
  padding: 10px 0;
  background-color: rgba(255, 255, 255, 0.05);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.footer-content p {
  margin: 5px 0;
  font-size: 0.8rem;
  color: #aaa;
}

.view-mode-buttons {
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  padding-right: 0.5rem;
  margin-right: 0.5rem;
}

.btn-success, .btn-outline-success {
  border-radius: 0.25rem;
}

.btn-success:hover, .btn-outline-success:hover {
  background-color: #28a745;
  border-color: #28a745;
}

@media (max-width: 768px) {
  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: stretch !important;
  }
  
  .btn-group-container {
    justify-content: center;
    margin-bottom: 0.5rem;
  }
  
  .btn-group-container:last-child {
    margin-bottom: 0;
  }
  
  .holiday-details .text-muted {
    font-size: 0.65rem;
  }
  
  .consecutive-holiday-info {
    padding: 0.2rem 0;
  }

/* Modal styles for NotificationSettings */
.settings-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.settings-modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(72,138,255,0.18);
  padding: 2em 1em;
  max-width: 95vw;
  width: 400px;
  position: relative;
}
.close-modal-btn {
  display: block;
  margin: 0 auto;
}
  
  .card-title {
    font-size: 0.9rem;
  }
  
  .card-subtitle {
    font-size: 0.7rem;
  }
  
  .badge {
    font-size: 0.6rem;
    padding: 2px;
  }
  
  .countdown-display {
    font-size: 0.8rem;
  }
  
  h1 {
    font-size: 1.2rem;
  }
  
  .footer-content p {
    font-size: 0.7rem;
  }
}

@media (max-width: 576px) {
  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
  
  .container-fluid {
    padding-left: 10px;
    padding-right: 10px;
  }
  
  .col-12 {
    padding-left: 5px;
    padding-right: 5px;
  }
}
</style>


