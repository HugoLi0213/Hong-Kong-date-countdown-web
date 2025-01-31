
<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-end mb-3">
      <button @click="toggleLanguage" class="btn btn-secondary ml-2">
        <i class="fas fa-language"></i>
      </button>
      <button @click="sortDatesAscending" class="btn btn-secondary ml-2">
        <i class="fas fa-sort-amount-up"></i>
      </button>
      <button @click="sortDatesDescending" class="btn btn-secondary ml-2">
        <i class="fas fa-sort-amount-down"></i>
      </button>
    </div>
    
    <transition name="fade" mode="out-in">
      <div class="row" :key="language">
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
            </div>
          </div>
        </div>
      </div>
    </transition>

    <div class="github-link">
      <a href="https://github.com/HugoLi0213" target="_blank" rel="noopener">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" 
             alt="GitHub" />
      </a>
    </div>
    <footer class="site-footer">
      <div class="footer-content">
        <p class="copyright">&copy; 2025 Hugo. All rights reserved.</p>
        <p class="tech-stack">
          Built with <span class="tech-item">Vue.js</span> |
          Styled with <span class="tech-item">Bootstrap</span> |
          Hosted on <span class="tech-item">Vercel</span>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      language: 'en',
      sortDirection: 'asc',
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
      return [...this.dates].sort((a, b) => 
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

.github-link {
  text-align: center;
  margin-top: 10px;
}

.github-link a {
  color: #fff;
  text-decoration: none;
  font-size: 1rem;
}

.github-link img {
  width: 24px;
  height: 24px;
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

.tech-stack {
  font-style: italic;
}

.tech-item {
  color: #fff;
  font-weight: bold;
  transition: color 0.3s ease;
}

.tech-item:hover {
  color: #007bff;
}

@media (max-width: 768px) {
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
</style>


