
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
    
    <transition name="fade" mode="out-in">
      <!-- List View -->
      <section v-if="viewMode === 'list'" 
               class="row" 
               :key="language + '-list'"
               role="region"
               :aria-label="`${showExpired ? 'Past' : 'Upcoming'} Hong Kong holidays`">
        <article v-for="(date, index) in sortedDates" 
                 :key="index" 
                 class="col-12 col-md-6 col-lg-4 mb-2"
                 itemscope 
                 itemtype="https://schema.org/Event">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h2 class="card-title h5" itemprop="name">{{ translatedEvent(date.event) }}</h2>
              <time class="card-subtitle mb-2 text-white h6" 
                    :datetime="date.date" 
                    itemprop="startDate">
                {{ translatedDate(date.date) }}
              </time>
              <div :class="[
                'badge',
                'countdown-display',
                isExpired(date.date) ? 'bg-danger' : 'bg-primary'
              ]"
              role="timer"
              :aria-label="`Time until ${translatedEvent(date.event)}`">
                {{ formattedCountdown(date.date) }}
              </div>
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
        </article>
      </section>

      <!-- Calendar View -->
      <section v-else-if="viewMode === 'calendar'" 
               :key="language + '-calendar'"
               role="region"
               aria-label="Hong Kong holidays calendar view">
        <CalendarView 
          :dates="dates" 
          :language="language" 
          :translations="translations"
        />
      </section>
    </transition>

    <footer class="site-footer" role="contentinfo">
      <div class="footer-content">
        <p class="copyright">&copy; 2026 Hugo. All rights reserved.</p>
      </div>
    </footer>
  </main>
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
        { event: "The first day of January", date: 'January 1, 2026' },
        { event: "Lunar New Year’s Day", date: 'February 17, 2026' },
        { event: "The second day of Lunar New Year", date: 'February 18, 2026' },
        { event: "The third day of Lunar New Year", date: 'February 19, 2026' },
        { event: "Good Friday", date: 'April 3, 2026' },
        { event: "The day following Good Friday", date: 'April 4, 2026' },
        { event: "The day following Ching Ming Festival", date: 'April 6, 2026' },
        { event: "The day following Easter Monday", date: 'April 7, 2026' },
        { event: "Labour Day", date: 'May 1, 2026' },
        { event: "The day following the Birthday of the Buddha", date: 'May 25, 2026' },
        { event: "Tuen Ng Festival", date: 'June 19, 2026' },
        { event: "Hong Kong Special Administrative Region Establishment Day", date: 'July 1, 2026' },
        { event: "The day following the Chinese Mid-Autumn Festival", date: 'September 26, 2026' },
        { event: "National Day", date: 'October 1, 2026' },
        { event: "The day following Chung Yeung Festival", date: 'October 19, 2026' },
        { event: "Christmas Day", date: 'December 25, 2026' },
        { event: "The first weekday after Christmas Day", date: 'December 26, 2026' }
      ],
      translations: {
        en: {
          events: {
            "The first day of January": "The first day of January",
            "Lunar New Year’s Day": "Lunar New Year’s Day",
            "The second day of Lunar New Year": "The second day of Lunar New Year",
            "The third day of Lunar New Year": "The third day of Lunar New Year",
            "Good Friday": "Good Friday",
            "The day following Good Friday": "The day following Good Friday",
            "The day following Ching Ming Festival": "The day following Ching Ming Festival",
            "The day following Easter Monday": "The day following Easter Monday",
            "Labour Day": "Labour Day",
            "The day following the Birthday of the Buddha": "The day following the Birthday of the Buddha",
            "Tuen Ng Festival": "Tuen Ng Festival",
            "Hong Kong Special Administrative Region Establishment Day": "Hong Kong Special Administrative Region Establishment Day",
            "The day following the Chinese Mid-Autumn Festival": "The day following the Chinese Mid-Autumn Festival",
            "National Day": "National Day",
            "The day following Chung Yeung Festival": "The day following Chung Yeung Festival",
            "Christmas Day": "Christmas Day",
            "The first weekday after Christmas Day": "The first weekday after Christmas Day"
          },
          dates: {
            'January 1, 2026': 'January 1, 2026',
            'February 17, 2026': 'February 17, 2026',
            'February 18, 2026': 'February 18, 2026',
            'February 19, 2026': 'February 19, 2026',
            'April 3, 2026': 'April 3, 2026',
            'April 4, 2026': 'April 4, 2026',
            'April 6, 2026': 'April 6, 2026',
            'April 7, 2026': 'April 7, 2026',
            'May 1, 2026': 'May 1, 2026',
            'May 25, 2026': 'May 25, 2026',
            'June 19, 2026': 'June 19, 2026',
            'July 1, 2026': 'July 1, 2026',
            'September 26, 2026': 'September 26, 2026',
            'October 1, 2026': 'October 1, 2026',
            'October 19, 2026': 'October 19, 2026',
            'December 25, 2026': 'December 25, 2026',
            'December 26, 2026': 'December 26, 2026'
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
            "The first day of January": "一月一日",
            "Lunar New Year’s Day": "農曆年初一",
            "The second day of Lunar New Year": "農曆年初二",
            "The third day of Lunar New Year": "農曆年初三",
            "Good Friday": "耶穌受難節",
            "The day following Good Friday": "耶穌受難節翌日",
            "The day following Ching Ming Festival": "清明節翌日",
            "The day following Easter Monday": "復活節星期一翌日",
            "Labour Day": "勞動節",
            "The day following the Birthday of the Buddha": "佛誕翌日",
            "Tuen Ng Festival": "端午節",
            "Hong Kong Special Administrative Region Establishment Day": "香港特別行政區成立紀念日",
            "The day following the Chinese Mid-Autumn Festival": "中秋節翌日",
            "National Day": "國慶日",
            "The day following Chung Yeung Festival": "重陽節翌日",
            "Christmas Day": "聖誕節",
            "The first weekday after Christmas Day": "聖誕節後第一個周日"
          },
          dates: {
            'January 1, 2026': '2026年1月1日',
            'February 17, 2026': '2026年2月17日',
            'February 18, 2026': '2026年2月18日',
            'February 19, 2026': '2026年2月19日',
            'April 3, 2026': '2026年4月3日',
            'April 4, 2026': '2026年4月4日',
            'April 6, 2026': '2026年4月6日',
            'April 7, 2026': '2026年4月7日',
            'May 1, 2026': '2026年5月1日',
            'May 25, 2026': '2026年5月25日',
            'June 19, 2026': '2026年6月19日',
            'July 1, 2026': '2026年7月1日',
            'September 26, 2026': '2026年9月26日',
            'October 1, 2026': '2026年10月1日',
            'October 19, 2026': '2026年10月19日',
            'December 25, 2026': '2026年12月25日',
            'December 26, 2026': '2026年12月26日'
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


