//Vue.js
<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-end mb-3">
      <button @click="toggleLanguage" class="btn btn-secondary">{{ language === 'en' ? '切換到中文' : 'Switch to English' }}</button>
    </div>
    <transition name="fade" mode="out-in">
      <div class="row" :key="language">
        <div v-for="(date, index) in dates" :key="index" class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title">{{ translateEvent(date.event) }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ translateDate(date.date) }}</h6>
              <p :class="['badge', date.timeRemaining === (language === 'en' ? 'Event has passed' : '事件已結束') ? 'bg-danger' : 'bg-primary']">{{ formatCountdown(date.timeRemaining) }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      language: 'en',
      dates: [
        { event: "New Year's Day", date: 'January 1, 2024', timeRemaining: '' },
        { event: 'Spring Festival', date: 'February 10, 2024', timeRemaining: '' },
        { event: 'Good Friday', date: 'March 29, 2024', timeRemaining: '' },
        { event: 'Easter Monday', date: 'April 1, 2024', timeRemaining: '' },
        { event: 'Ching Ming Festival', date: 'April 4, 2024', timeRemaining: '' },
        { event: 'Labour Day', date: 'May 1, 2024', timeRemaining: '' },
        { event: "Buddha's Birthday", date: 'May 15, 2024', timeRemaining: '' },
        { event: 'Dragon Boat Festival', date: 'June 10, 2024', timeRemaining: '' },
        { event: 'Hong Kong SAR Establishment Day', date: 'July 1, 2024', timeRemaining: '' },
        { event: 'Day after Mid-Autumn Festival', date: 'September 18, 2024', timeRemaining: '' },
        { event: 'National Day', date: 'October 1, 2024', timeRemaining: '' },
        { event: 'Chung Yeung Festival', date: 'October 11, 2024', timeRemaining: '' },
        { event: 'Christmas Day', date: 'December 25, 2024', timeRemaining: '' },
        { event: 'Boxing Day', date: 'December 26, 2024', timeRemaining: '' }
      ],
      translations: {
        en: {
          "New Year's Day": "New Year's Day",
          'Spring Festival': 'Spring Festival',
          'Good Friday': 'Good Friday',
          'Easter Monday': 'Easter Monday',
          'Ching Ming Festival': 'Ching Ming Festival',
          'Labour Day': 'Labour Day',
          "Buddha's Birthday": "Buddha's Birthday",
          'Dragon Boat Festival': 'Dragon Boat Festival',
          'Hong Kong SAR Establishment Day': 'Hong Kong SAR Establishment Day',
          'Day after Mid-Autumn Festival': 'Day after Mid-Autumn Festival',
          'National Day': 'National Day',
          'Chung Yeung Festival': 'Chung Yeung Festival',
          'Christmas Day': 'Christmas Day',
          'Boxing Day': 'Boxing Day',
          'January 1, 2024': 'January 1, 2024',
          'February 10, 2024': 'February 10, 2024',
          'March 29, 2024': 'March 29, 2024',
          'April 1, 2024': 'April 1, 2024',
          'April 4, 2024': 'April 4, 2024',
          'May 1, 2024': 'May 1, 2024',
          'May 15, 2024': 'May 15, 2024',
          'June 10, 2024': 'June 10, 2024',
          'July 1, 2024': 'July 1, 2024',
          'September 18, 2024': 'September 18, 2024',
          'October 1, 2024': 'October 1, 2024',
          'October 11, 2024': 'October 11, 2024',
          'December 25, 2024': 'December 25, 2024',
          'December 26, 2024': 'December 26, 2024',
          'Event has passed': 'Event has passed'
        },
        zh: {
          "New Year's Day": "元旦",
          'Spring Festival': '春節',
          'Good Friday': '耶穌受難日',
          'Easter Monday': '復活節星期一',
          'Ching Ming Festival': '清明節',
          'Labour Day': '勞動節',
          "Buddha's Birthday": '佛誕',
          'Dragon Boat Festival': '端午節',
          'Hong Kong SAR Establishment Day': '香港特別行政區成立紀念日',
          'Day after Mid-Autumn Festival': '中秋節翌日',
          'National Day': '國慶日',
          'Chung Yeung Festival': '重陽節',
          'Christmas Day': '聖誕節',
          'Boxing Day': '節禮日',
          'January 1, 2024': '2024年1月1日',
          'February 10, 2024': '2024年2月10日',
          'March 29, 2024': '2024年3月29日',
          'April 1, 2024': '2024年4月1日',
          'April 4, 2024': '2024年4月4日',
          'May 1, 2024': '2024年5月1日',
          'May 15, 2024': '2024年5月15日',
          'June 10, 2024': '2024年6月10日',
          'July 1, 2024': '2024年7月1日',
          'September 18, 2024': '2024年9月18日',
          'October 1, 2024': '2024年10月1日',
          'October 11, 2024': '2024年10月11日',
          'December 25, 2024': '2024年12月25日',
          'December 26, 2024': '2024年12月26日',
          'Event has passed': '事件已結束'
        }
      },
      timeTranslations: {
        en: {
          day: 'day',
          days: 'days',
          hour: 'hour',
          hours: 'hours',
          minute: 'minute',
          minutes: 'minutes',
          second: 'second',
          seconds: 'seconds'
        },
        zh: {
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
  },
  methods: {
    calculateTimeRemaining(eventDate) {
      const now = new Date();
      const targetDate = new Date(eventDate);
      const timeDiff = targetDate - now;

      if (timeDiff <= 0) {
        return this.language === 'en' ? 'Event has passed' : '事件已結束';
      }

      const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    },
    formatCountdown(timeRemaining) {
      if (timeRemaining === (this.language === 'en' ? 'Event has passed' : '事件已結束')) {
        return timeRemaining;
      }

      const [days, hours, minutes, seconds] = timeRemaining.split(' ');

      return `${days} ${this.timeTranslations[this.language][days === '1d' ? 'day' : 'days']}, ${hours} ${

this.timeTranslations[this.language][hours === '1h' ? 'hour' : 'hours']}, ${minutes} ${this.timeTranslations[this.language][minutes === '1m' ? 'minute' : 'minutes']}, and ${seconds} ${this.timeTranslations[this.language][seconds === '1s' ? 'second' : 'seconds']}`;
    },
    updateCountdown() {
      this.dates.forEach(date => {
        date.timeRemaining = this.calculateTimeRemaining(date.date);
      });
    },
    toggleLanguage() {
      this.language = this.language === 'en' ? 'zh' : 'en';
    },
    translateEvent(event) {
      return this.translations[this.language][event];
    },
    translateDate(date) {
      return this.translations[this.language][date];
    }
  },
  mounted() {
    this.updateCountdown();
    setInterval(this.updateCountdown, 1000);
  }
};
</script>

<style scoped>
body {
  background-color: #000;
  color: #fff;
}
.container-fluid {
  background-color: #000;
}
.card {
  height: 100%;
}
.card-title {
  font-size: 1.2rem;
}
.card-subtitle {
  font-size: 1rem;
  color: #aaa;
}
.badge {
  font-size: 0.9rem;
  padding: 5px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
@media (max-width: 768px) {
  .card-title {
    font-size: 1rem;
  }
  .card-subtitle {
    font-size: 0.8rem;
  }
  .badge {
    font-size: 0.8rem;
    padding: 3px;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>
