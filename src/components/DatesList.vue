<template>
    <div class="container-fluid">
      <div class="row">
        <div v-for="(date, index) in dates" :key="index" class="col-12 col-md-6 col-lg-4 mb-3">
          <div class="card bg-dark text-white">
            <div class="card-body">
              <h5 class="card-title">{{ date.event }}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{{ date.date }}</h6>
              <p :class="['badge', date.timeRemaining === 'Event has passed' ? 'bg-danger' : 'bg-primary']">{{ formatCountdown(date.timeRemaining) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        dates: [
          { event: 'New Year\'s Day', date: 'January 1', timeRemaining: '' },
          { event: 'Spring Festival', date: 'February 10, 2024', timeRemaining: '' },
          { event: 'Good Friday', date: 'March 29, 2024', timeRemaining: '' },
          { event: 'Easter Monday', date: 'April 1, 2024', timeRemaining: '' },
          { event: 'Ching Ming Festival', date: 'April 4, 2024', timeRemaining: '' },
          { event: 'Labour Day', date: 'May 1, 2024', timeRemaining: '' },
          { event: 'Buddha\'s Birthday', date: 'May 15, 2024', timeRemaining: '' },
          { event: 'Dragon Boat Festival', date: 'June 10, 2024', timeRemaining: '' },
          { event: 'Hong Kong SAR Establishment Day', date: 'July 1, 2024', timeRemaining: '' },
          { event: 'Day after Mid-Autumn Festival', date: 'September 18, 2024', timeRemaining: '' },
          { event: 'National Day', date: 'October 1, 2024', timeRemaining: '' },
          { event: 'Chung Yeung Festival', date: 'October 11, 2024', timeRemaining: '' },
          { event: 'Christmas Day', date: 'December 25, 2024', timeRemaining: '' },
          { event: 'Boxing Day', date: 'December 26, 2024', timeRemaining: '' }
        ]
      };
    },
    methods: {
      calculateTimeRemaining(eventDate) {
        const now = new Date();
        const targetDate = new Date(eventDate);
        const timeDiff = targetDate - now;
  
        if (timeDiff <= 0) {
          return 'Event has passed';
        }
  
        const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
      },
      formatCountdown(timeRemaining) {
        if (timeRemaining === 'Event has passed') {
          return timeRemaining;
        }
  
        const [days, hours, minutes, seconds] = timeRemaining.split(' ');
  
        return `${days} ${days === '1d' ? 'day' : 'days'}, ${hours} ${hours === '1h' ? 'hour' : 'hours'}, ${minutes} ${minutes === '1m' ? 'minute' : 'minutes'}, and ${seconds} ${seconds === '1s' ? 'second' : 'seconds'}`;
      },
      updateCountdown() {
        this.dates.forEach(date => {
          date.timeRemaining = this.calculateTimeRemaining(date.date);
        });
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
  }
  .badge {
    font-size: 0.9rem;
    padding: 5px;
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
  