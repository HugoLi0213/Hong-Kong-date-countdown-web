<template>
  <section class="calendar-container" role="application" aria-label="Hong Kong holidays calendar">
    <header class="calendar-header d-flex justify-content-between align-items-center mb-3">
      <button @click="previousMonth" 
              class="btn btn-outline-light btn-sm"
              :aria-label="`Go to previous month`">
        <i class="fas fa-chevron-left" aria-hidden="true"></i>
      </button>
      <h1 class="month-year h4" role="heading" aria-level="1">{{ currentMonthYear }}</h1>
      <button @click="nextMonth" 
              class="btn btn-outline-light btn-sm"
              :aria-label="`Go to next month`">
        <i class="fas fa-chevron-right" aria-hidden="true"></i>
      </button>
    </header>

    <div class="calendar-grid" role="grid" aria-label="Calendar grid">
      <div class="calendar-weekdays" role="row">
        <div v-for="day in weekdays" 
             :key="day" 
             class="weekday" 
             role="columnheader"
             :aria-label="`${day} column`">
          {{ day }}
        </div>
      </div>
      
      <div class="calendar-days">
        <div
          v-for="(day, index) in calendarDays"
          :key="index"
          :class="[
            'calendar-day',
            {
              'other-month': !day.isCurrentMonth,
              'has-holiday': day.holiday,
              'is-today': day.isToday,
              'is-weekend': day.isWeekend,
              'consecutive-holiday': day.isConsecutiveHoliday && !day.holiday,
              'consecutive-start': day.isConsecutiveStart,
              'consecutive-end': day.isConsecutiveEnd
            }
          ]"
          @click="selectDay(day)"
        >
          <div class="day-content">
            <span class="day-number">{{ day.date }}</span>
            
            <!-- 假期名稱簡寫 -->
            <div v-if="day.holiday" class="holiday-name-short">
              {{ getShortHolidayName(day.holiday.event) }}
            </div>
            
            <!-- 連續假期指示器 -->
            <div v-if="day.isConsecutiveHoliday" class="consecutive-indicator">
              <small>{{ language === 'en' ? 'Long' : '連假' }}</small>
            </div>
            
            <!-- 假期按鈕 -->
            <button v-if="day.holiday" class="holiday-btn" @click.stop="selectDay(day)">
              <i class="fas fa-info-circle"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Holiday Details Modal -->
    <div v-if="selectedDay && selectedDay.holiday" class="holiday-modal-overlay" @click="closeModal">
      <div class="holiday-modal" @click.stop>
        <div class="modal-header">
          <h5>{{ translatedDate(selectedDay.dateString) }}</h5>
          <button @click="closeModal" class="btn-close">×</button>
        </div>
        <div class="modal-body">
          <div class="holiday-info">
            <h6 class="holiday-name">
              <i class="fas fa-calendar-day"></i>
              {{ translatedEvent(selectedDay.holiday.event) }}
            </h6>
            <div class="countdown-info">
              <span :class="[
                'badge',
                'countdown-badge',
                isExpired(selectedDay.holiday.date) ? 'bg-danger' : 'bg-primary'
              ]">
                {{ formattedCountdown(selectedDay.holiday.date) }}
              </span>
            </div>
            <div v-if="getConsecutiveHolidays(selectedDay.holiday.date).length > 1" class="consecutive-info mt-3">
              <div class="consecutive-badge">
                <i class="fas fa-calendar-check"></i>
                {{ language === 'en' ? 'Long Weekend' : '連續假期' }}: 
                {{ getConsecutiveHolidays(selectedDay.holiday.date).length }} {{ language === 'en' ? 'days' : '天' }}
              </div>
              <div class="consecutive-details">
                {{ formatConsecutiveHolidays(selectedDay.holiday.date) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    dates: {
      type: Array,
      required: true
    },
    language: {
      type: String,
      default: 'en'
    },
    translations: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      currentDate: new Date(),
      selectedDay: null,
      weekdays: this.language === 'en' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  computed: {
    currentMonthYear() {
      if (this.language === 'en') {
        return this.currentDate.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        })
      } else {
        return `${this.currentDate.getFullYear()}年${this.currentDate.getMonth() + 1}月`
      }
    },

    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()
      const firstDay = new Date(year, month, 1)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const days = []
      const today = new Date()
      
      // 先創建所有日期
      for (let i = 0; i < 42; i++) {
        const currentDay = new Date(startDate)
        currentDay.setDate(startDate.getDate() + i)
        
        const dateString = currentDay.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
        
        const holiday = this.dates.find(date => date.date === dateString)
        
        days.push({
          date: currentDay.getDate(),
          dateString: dateString,
          fullDate: new Date(currentDay),
          isCurrentMonth: currentDay.getMonth() === month,
          isToday: currentDay.toDateString() === today.toDateString(),
          isWeekend: currentDay.getDay() === 0 || currentDay.getDay() === 6,
          holiday: holiday,
          isConsecutiveHoliday: false,
          isConsecutiveStart: false,
          isConsecutiveEnd: false
        })
      }
      
      // 標記連續假期
      days.forEach((day) => {
        if (day.holiday) {
          const consecutiveDays = this.getConsecutiveHolidays(day.holiday.date)
          if (consecutiveDays.length > 1) {
            // 找到這個假期在連續假期中的位置
            const holidayIndex = consecutiveDays.findIndex(d => 
              d.toDateString() === day.fullDate.toDateString()
            )
            
            if (holidayIndex === 0) {
              day.isConsecutiveStart = true
            }
            if (holidayIndex === consecutiveDays.length - 1) {
              day.isConsecutiveEnd = true
            }
            
            // 標記所有相關的週末和假期
            consecutiveDays.forEach(consDay => {
              const dayInCalendar = days.find(d => 
                d.fullDate.toDateString() === consDay.toDateString()
              )
              if (dayInCalendar) {
                dayInCalendar.isConsecutiveHoliday = true
              }
            })
          }
        }
      })
      
      return days
    }
  },

  watch: {
    language() {
      this.weekdays = this.language === 'en' 
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['日', '一', '二', '三', '四', '五', '六']
    }
  },

  methods: {
    previousMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1)
    },

    nextMonth() {
      this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1)
    },

    selectDay(day) {
      if (day.holiday) {
        this.selectedDay = day
      }
    },

    closeModal() {
      this.selectedDay = null
    },

    getShortHolidayName(event) {
      const shortNames = {
        'en': {
          "New Year's Day": "New Year",
          "Lunar New Year's Day": "CNY",
          'Second day of Lunar New Year': "CNY+1",
          'Third day of Lunar New Year': "CNY+2",
          'Ching Ming Festival': "Ching Ming",
          'Good Friday': "Good Fri",
          'The day following Good Friday': "Easter Sat",
          'Easter Monday': "Easter Mon",
          'Labour Day': "Labour",
          "The Birthday of the Buddha": "Buddha",
          'Tuen Ng Festival': "Dragon Boat",
          'Hong Kong Special Administrative Region Establishment Day': "HKSAR",
          'National Day': "National",
          'The day following the Chinese Mid-Autumn Festival': "Mid-Autumn+1",
          'Chung Yeung Festival': "Chung Yeung",
          'Christmas Day': "Christmas",
          'The first weekday after Christmas Day': "Boxing"
        },
        'zh': {
          "New Year's Day": "元旦",
          "Lunar New Year's Day": "年初一",
          'Second day of Lunar New Year': "年初二",
          'Third day of Lunar New Year': "年初三",
          'Ching Ming Festival': "清明",
          'Good Friday': "受難日",
          'The day following Good Friday': "受難翌日",
          'Easter Monday': "復活節",
          'Labour Day': "勞動節",
          "The Birthday of the Buddha": "佛誕",
          'Tuen Ng Festival': "端午",
          'Hong Kong Special Administrative Region Establishment Day': "回歸日",
          'National Day': "國慶",
          'The day following the Chinese Mid-Autumn Festival': "中秋翌日",
          'Chung Yeung Festival': "重陽",
          'Christmas Day': "聖誕",
          'The first weekday after Christmas Day': "節禮日"
        }
      }
      
      return shortNames[this.language][event] || event
    },

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

    getConsecutiveHolidays(dateString) {
      const targetDate = new Date(dateString)
      const consecutiveDays = []
      
      let currentDate = new Date(targetDate)
      
      while (this.isHolidayOrWeekend(currentDate)) {
        currentDate.setDate(currentDate.getDate() - 1)
      }
      currentDate.setDate(currentDate.getDate() + 1)
      
      while (this.isHolidayOrWeekend(currentDate)) {
        consecutiveDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      
      return consecutiveDays
    },

    isHolidayOrWeekend(date) {
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        return true
      }
      
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
.calendar-container {
  background-color: #000;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
}

.calendar-header {
  margin-bottom: 20px;
}

.month-year {
  color: #fff;
  margin: 0;
  font-weight: 600;
}

.calendar-grid {
  max-width: 100%;
  margin: 0 auto;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  margin-bottom: 10px;
}

.weekday {
  text-align: center;
  padding: 10px 5px;
  font-weight: bold;
  color: #ccc;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-day {
  position: relative;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 4px;
}

.calendar-day:hover {
  background-color: rgba(255, 255, 255, 0.1);
  transform: scale(1.02);
}

.calendar-day.other-month {
  opacity: 0.3;
}

.calendar-day.is-today {
  background-color: rgba(0, 123, 255, 0.4);
  border-color: #007bff;
  box-shadow: 0 0 10px rgba(0, 123, 255, 0.5);
}

.calendar-day.is-weekend {
  background-color: rgba(255, 255, 255, 0.02);
}

.calendar-day.has-holiday {
  background-color: rgba(255, 193, 7, 0.3);
  border-color: #ffc107;
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.4);
}

.calendar-day.consecutive-holiday {
  background-color: rgba(40, 167, 69, 0.2);
  border-color: #28a745;
}

.calendar-day.consecutive-start {
  border-left: 3px solid #28a745;
}

.calendar-day.consecutive-end {
  border-right: 3px solid #28a745;
}

.calendar-day.has-holiday:hover {
  background-color: rgba(255, 193, 7, 0.4);
  transform: scale(1.05);
}

.day-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  width: 100%;
}

.day-number {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 2px;
}

.holiday-name-short {
  font-size: 8px;
  text-align: center;
  color: #ffc107;
  font-weight: bold;
  line-height: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.consecutive-indicator {
  position: absolute;
  top: 2px;
  right: 2px;
  background-color: rgba(40, 167, 69, 0.8);
  border-radius: 3px;
  padding: 1px 3px;
}

.consecutive-indicator small {
  font-size: 6px;
  color: white;
  font-weight: bold;
}

.holiday-btn {
  background-color: rgba(255, 193, 7, 0.9);
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 2px;
}

.holiday-btn:hover {
  background-color: #ffc107;
  transform: scale(1.1);
}

.holiday-btn i {
  font-size: 10px;
  color: #000;
}

.holiday-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.holiday-modal {
  background-color: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  max-width: 400px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h5 {
  margin: 0;
  color: #fff;
}

.btn-close {
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-close:hover {
  color: #ffc107;
}

.modal-body {
  padding: 20px;
}

.holiday-info {
  text-align: center;
}

.holiday-name {
  color: #ffc107;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.holiday-name i {
  margin-right: 8px;
}

.countdown-info {
  margin-bottom: 15px;
}

.countdown-badge {
  font-size: 0.9rem;
  padding: 8px 12px;
  border-radius: 6px;
}

.consecutive-info {
  background-color: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 6px;
  padding: 12px;
}

.consecutive-badge {
  color: #ffc107;
  font-weight: bold;
  margin-bottom: 8px;
}

.consecutive-badge i {
  margin-right: 6px;
}

.consecutive-details {
  color: #ccc;
  font-size: 0.9em;
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 10px;
  }
  
  .calendar-day {
    height: 70px;
  }
  
  .day-number {
    font-size: 14px;
  }
  
  .holiday-name-short {
    font-size: 7px;
  }
  
  .consecutive-indicator small {
    font-size: 5px;
  }
  
  .holiday-btn {
    width: 18px;
    height: 18px;
  }
  
  .holiday-btn i {
    font-size: 9px;
  }
  
  .weekday {
    padding: 8px 3px;
    font-size: 12px;
  }
  
  .holiday-modal {
    width: 95%;
  }
  
  .modal-body {
    padding: 15px;
  }
  
  .holiday-name {
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .calendar-day {
    height: 60px;
  }
  
  .day-number {
    font-size: 12px;
  }
  
  .holiday-name-short {
    font-size: 6px;
  }
  
  .consecutive-indicator {
    top: 1px;
    right: 1px;
    padding: 0px 2px;
  }
  
  .consecutive-indicator small {
    font-size: 4px;
  }
  
  .holiday-btn {
    width: 16px;
    height: 16px;
  }
  
  .holiday-btn i {
    font-size: 8px;
  }
  
  .weekday {
    padding: 6px 2px;
    font-size: 11px;
  }
}
</style>
