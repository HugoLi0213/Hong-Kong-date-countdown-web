<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-end mb-3">
      <button @click="toggleLanguage" class="btn btn-secondary ml-2"><i class="fas fa-language"></i></button>
      <button @click="sortDatesAscending" class="btn btn-secondary ml-2"><i class="fas fa-sort-amount-up"></i></button>
      <button @click="sortDatesDescending" class="btn btn-secondary ml-2"><i class="fas fa-sort-amount-down"></i></button>
    </div>
    <transition name="fade" mode="out-in">
      <div class="row" :key="language">
        <div v-for="(date, index) in dates" :key="index" class="col-12 col-md-6 col-lg-4 mb-2">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title">{{ translateEvent(date.event) }}</h5>
              <h6 class="card-subtitle mb-2 text-white">{{ translateDate(date.date) }}</h6>
              <p :class="['badge', 'countdown-display', date.timeRemaining === (language === 'en' ? 'Event has passed' : '事件已結束') ? 'bg-danger' : 'bg-primary']">
                {{ formatCountdown(date.timeRemaining) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <div class="github-link">
      <a href="https://github.com/HugoLi0213" target="_blank" rel="noopener">
        <img src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" alt="GitHub" />
      </a>
    </div>
    <footer class="site-footer">
      <div class="footer-content">
        <p class="copyright">&copy; 2024 Hugo. All rights reserved.</p>
        <p class="tech-stack">
          Built with <span class="tech-item">Vue.js</span> | 
          Styled with <span class="tech-item">Bootstrap</span> | 
          Hosted on <span class="tech-item">Vercel</span>
        </p>
      </div>
    </footer>
  </div>
</template>
import { inject } from "@vercel/analytics"

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

      const parts = timeRemaining.split(' ');
      const days = parts[0];
      const hours = parts[1];
      const minutes = parts[2];
      const seconds = parts[3];

      return `${parseInt(days)} ${this.timeTranslations[this.language]['days']}, ${parseInt(hours)} ${this.timeTranslations[this.language]['hours']}, ${parseInt(minutes)} ${this.timeTranslations[this.language]['minutes']}, and ${parseInt(seconds)} ${this.timeTranslations[this.language]['seconds']}`;
    },
    updateCountdown() {
      this.dates.forEach(date => {
        date.timeRemaining = this.calculateTimeRemaining(date.date);
      });
    },
    sortDatesAscending() {
      this.dates.sort((a, b) => new Date(a.date) - new Date(b.date));
    },
    sortDatesDescending() {
      this.dates.sort((a, b) => new Date(b.date) - new Date(a.date));
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
    this.sortDatesDescending(); // 默认降序排序
    this.updateCountdown();
    setInterval(this.updateCountdown, 1000);
  }
};
</script>

<style scoped>
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
  color: #007bff; /* Bootstrap primary color */
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
