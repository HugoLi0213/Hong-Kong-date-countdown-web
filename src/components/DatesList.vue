
<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap">
      <div class="btn-group-container mb-2 mb-md-0">
        <button @click="viewMode = 'list'" :class="['btn', 'btn-sm', 'mr-2', viewMode === 'list' ? 'btn-success' : 'btn-outline-success']">
          <i class="fas fa-list"></i> {{ language === 'en' ? 'List' : '列表' }}
        </button>
        <button @click="viewMode = 'calendar'" :class="['btn', 'btn-sm', 'mr-2', viewMode === 'calendar' ? 'btn-success' : 'btn-outline-success']">
          <i class="fas fa-calendar"></i> {{ language === 'en' ? 'Calendar' : '日曆' }}
        </button>
      </div>
      <div v-if="viewMode === 'list'" class="btn-group-container mb-2 mb-md-0">
        <button @click="showExpired = false" :class="['btn', 'btn-sm', 'mr-2', !showExpired ? 'btn-primary' : 'btn-outline-primary']">
          {{ language === 'en' ? 'Upcoming' : '即將到來' }}
        </button>
        <button @click="showExpired = true" :class="['btn', 'btn-sm', showExpired ? 'btn-primary' : 'btn-outline-primary']">
          {{ language === 'en' ? 'Past' : '已過期' }}
        </button>
      </div>
      <div class="btn-group-container">
        <button @click="toggleLanguage" class="btn btn-secondary btn-sm ml-1">
          <i class="fas fa-language"></i>
        </button>
        <button v-if="viewMode === 'list'" @click="sortDatesAscending" class="btn btn-secondary btn-sm ml-1">
          <i class="fas fa-sort-amount-up"></i>
        </button>
        <button v-if="viewMode === 'list'" @click="sortDatesDescending" class="btn btn-secondary btn-sm ml-1">
          <i class="fas fa-sort-amount-down"></i>
        </button>
      </div>
    </div>
    
    <transition name="fade" mode="out-in">
      <!-- List View -->
      <div v-if="viewMode === 'list'" class="row" :key="language + '-list'">
        <div v-for="(date, index) in sortedDates" :key="index" 
             class="col-12 col-md-6 col-lg-4 mb-2">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title">{{ translatedEvent(date.event) }}</h5>
              <h6 class="card-subtitle mb-2 text-white">
                {{ translatedDate(date.date) }}
              </h6>
              <p :class="[
                'badge',
                'countdown-display',
                isExpired(date.date) ? 'bg-danger' : 'bg-primary'
              ]">
                {{ formattedCountdown(date.date) }}
              </p>
              <div v-if="getConsecutiveHolidays(date.date).length > 1" class="consecutive-holiday-info mt-2">
                <small class="text-warning">
                  <i class="fas fa-calendar-check"></i>
                  {{ language === 'en' ? 'Long Weekend' : '連續假期' }}: 
                  {{ getConsecutiveHolidays(date.date).length }} {{ language === 'en' ? 'days' : '天' }}
                </small>
                <div class="holiday-details">
                  <small class="text-muted">
                    {{ formatConsecutiveHolidays(date.date) }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Calendar View -->
      <div v-else-if="viewMode === 'calendar'" :key="language + '-calendar'">
        <CalendarView 
          :dates="dates" 
          :language="language" 
          :translations="translations"
        />
      </div>
    </transition>

    <footer class="site-footer">
      <div class="footer-content">
        <p class="copyright">&copy; 2025 Hugo. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
import CalendarView from './CalendarView.vue';

export default {
  components: {
    CalendarView
  },
  data() {
    return {
      language: 'en',
      sortDirection: 'asc',
      showExpired: false, // 新增狀態來控制顯示過期或未過期事件
      viewMode: 'list', // 新增視圖模式：'list' 或 'calendar'
      dates: [
        { event: "New Year's Day", date: 'January 1, 2025' },
        { event: "Lunar New Year's Day", date: 'January 29, 2025' },
        { event: 'Second day of Lunar New Year', date: 'January 30, 2025' },
        { event: 'Third day of Lunar New Year', date: 'January 31, 2025' },
        { event: 'Ching Ming Festival', date: 'April 4, 2025' },
        { event: 'Good Friday', date: 'April 18, 2025' },
        { event: 'The day following Good Friday', date: 'April 19, 2025' },
        { event: 'Easter Monday', date: 'April 21, 2025' },
        { event: 'Labour Day', date: 'May 1, 2025' },
        { event: "The Birthday of the Buddha", date: 'May 5, 2025' },
        { event: 'Tuen Ng Festival', date: 'May 31, 2025' },
        { event: 'Hong Kong Special Administrative Region Establishment Day', date: 'July 1, 2025' },
        { event: 'National Day', date: 'October 1, 2025' },
        { event: 'The day following the Chinese Mid-Autumn Festival', date: 'October 7, 2025' },
        { event: 'Chung Yeung Festival', date: 'October 29, 2025' },
        { event: 'Christmas Day', date: 'December 25, 2025' },
        { event: 'The first weekday after Christmas Day', date: 'December 26, 2025' }
      ],
      translations: {
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
            "New Year's Day": "元旦",
            "Lunar New Year's Day": "農曆新年首日",
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
      }
    }
  },

  computed: {
    sortedDates() {
      // 根據 showExpired 狀態來決定顯示哪些事件
      const filteredDates = this.showExpired 
        ? this.dates.filter(date => this.isExpired(date.date))  // 顯示已過期的事件
        : this.dates.filter(date => !this.isExpired(date.date)) // 顯示未過期的事件
      
      return filteredDates.sort((a, b) => 
        this.sortDirection === 'asc' 
          ? new Date(a.date) - new Date(b.date)
          : new Date(b.date) - new Date(a.date)
      )
    }
  },

  methods: {
    translatedEvent(event) {
      return this.translations[this.language].events[event]
    },

    translatedDate(date) {
      return this.translations[this.language].dates[date]
    },

    isExpired(dateString) {
      return new Date(dateString) <= new Date()
    },

    formattedCountdown(dateString) {
      const now = new Date()
      const target = new Date(dateString)
      const diff = target - now
      
      if (diff <= 0) {
        return this.language === 'en' ? 'Event has passed' : '事件已結束'
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      const units = this.translations[this.language].timeUnits
      return `${days}${units.days}, ${hours}${units.hours}, ${minutes}${units.minutes}, ${seconds}${units.seconds}`
    },

    toggleLanguage() {
      this.language = this.language === 'en' ? 'zh' : 'en'
    },

    sortDatesAscending() {
      this.sortDirection = 'asc'
    },

    sortDatesDescending() {
      this.sortDirection = 'desc'
    },

    getConsecutiveHolidays(dateString) {
      const targetDate = new Date(dateString)
      const consecutiveDays = []
      
      // 找出以這個日期為中心的連續假期
      let currentDate = new Date(targetDate)
      
      // 往前找連續假期的開始
      while (this.isHolidayOrWeekend(currentDate)) {
        currentDate.setDate(currentDate.getDate() - 1)
      }
      currentDate.setDate(currentDate.getDate() + 1) // 回到第一個假期日
      
      // 從開始日期往後找所有連續假期
      while (this.isHolidayOrWeekend(currentDate)) {
        consecutiveDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return consecutiveDays
    },

    isHolidayOrWeekend(date) {
      // 檢查是否為週末（週六=6, 週日=0）
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return true
      }
      
      // 檢查是否為公眾假期
      const dateString = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      })
      
      return this.dates.some(holiday => holiday.date === dateString)
    },

    formatConsecutiveHolidays(dateString) {
      const consecutiveDays = this.getConsecutiveHolidays(dateString)
      if (consecutiveDays.length <= 1) return ''
      
      const startDate = consecutiveDays[0]
      const endDate = consecutiveDays[consecutiveDays.length - 1]
      
      if (this.language === 'en') {
        return `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
      } else {
        return `${startDate.getMonth() + 1}月${startDate.getDate()}日 - ${endDate.getMonth() + 1}月${endDate.getDate()}日`
      }
    }
  },

  mounted() {
    setInterval(() => this.$forceUpdate(), 1000)
  }
}
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


