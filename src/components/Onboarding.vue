<template>
  <div v-if="showOnboarding" class="onboarding-modal">
    <div class="modal-backdrop" @click="closeOnboarding"></div>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">
          <i class="fas fa-star text-warning mr-2"></i>
          {{ language === 'en' ? 'Welcome to Hong Kong Holiday Countdown!' : '歡迎使用香港假期倒數計時器！' }}
        </h5>
        <button type="button" class="close" @click="closeOnboarding">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="step-indicator">
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-dot"
            :class="{ active: index === currentStep, completed: index < currentStep }"
          ></div>
        </div>

        <div class="step-content">
          <div class="step-icon mb-3">
            <i :class="steps[currentStep].icon" class="fa-3x text-primary"></i>
          </div>

          <h4 class="step-title mb-3">{{ steps[currentStep].title }}</h4>
          <p class="step-description mb-4">{{ steps[currentStep].description }}</p>

          <div v-if="steps[currentStep].features" class="features-list">
            <ul class="list-unstyled">
              <li v-for="feature in steps[currentStep].features" :key="feature" class="mb-2">
                <i class="fas fa-check text-success mr-2"></i>
                {{ feature }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          v-if="currentStep > 0"
          type="button"
          class="btn btn-outline-secondary"
          @click="previousStep"
        >
          <i class="fas fa-arrow-left mr-1"></i>
          {{ language === 'en' ? 'Previous' : '上一步' }}
        </button>

        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          class="btn btn-primary"
          @click="nextStep"
        >
          {{ language === 'en' ? 'Next' : '下一步' }}
          <i class="fas fa-arrow-right ml-1"></i>
        </button>

        <button
          v-else
          type="button"
          class="btn btn-success"
          @click="completeOnboarding"
        >
          <i class="fas fa-check mr-1"></i>
          {{ language === 'en' ? 'Get Started' : '開始使用' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppOnboarding',
  props: {
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      showOnboarding: false,
      currentStep: 0,
      steps: []
    }
  },
  created() {
    this.initializeSteps()
    this.checkFirstVisit()
  },
  methods: {
    initializeSteps() {
      this.steps = [
        {
          icon: 'fas fa-calendar-alt',
          title: this.language === 'en' ? 'Track Hong Kong Holidays' : '追蹤香港假期',
          description: this.language === 'en'
            ? 'Stay updated with all public holidays, school holidays, and special events in Hong Kong.'
            : '隨時了解香港所有公眾假期、學校假期和特別活動。',
          features: this.language === 'en'
            ? ['Public holidays', 'School holidays', 'Bank holidays', 'Cultural festivals']
            : ['公眾假期', '學校假期', '銀行假期', '文化節慶']
        },
        {
          icon: 'fas fa-clock',
          title: this.language === 'en' ? 'Countdown Timer' : '倒數計時器',
          description: this.language === 'en'
            ? 'See exactly how many days are left until your next holiday or long weekend.'
            : '準確查看距離下一個假期或長週末還有多少天。',
          features: this.language === 'en'
            ? ['Real-time countdown', 'Long weekend alerts', 'Multiple view modes', 'Smart sorting']
            : ['即時倒數', '長週末提醒', '多種查看模式', '智慧排序']
        },
        {
          icon: 'fas fa-bell',
          title: this.language === 'en' ? 'Smart Notifications' : '智慧通知',
          description: this.language === 'en'
            ? 'Get notified about upcoming holidays and never miss important dates.'
            : '接收即將到來的假期通知，永遠不會錯過重要日期。',
          features: this.language === 'en'
            ? ['Customizable reminders', 'Browser notifications', 'Weekly summaries', 'Holiday alerts']
            : ['可自訂提醒', '瀏覽器通知', '每週摘要', '假期警報']
        },
        {
          icon: 'fas fa-heart',
          title: this.language === 'en' ? 'Personalize Your Experience' : '個人化體驗',
          description: this.language === 'en'
            ? 'Customize the app to match your preferences and favorite holidays.'
            : '自訂應用程式以符合您的偏好和最愛的假期。',
          features: this.language === 'en'
            ? ['Favorite holidays', 'Language switching', 'Export data', 'Dark mode support']
            : ['收藏假期', '語言切換', '匯出資料', '深色模式支援']
        }
      ]
    },
    checkFirstVisit() {
      const hasVisited = localStorage.getItem('hasVisitedBefore')
      if (!hasVisited) {
        this.showOnboarding = true
      }
    },
    nextStep() {
      if (this.currentStep < this.steps.length - 1) {
        this.currentStep++
      }
    },
    previousStep() {
      if (this.currentStep > 0) {
        this.currentStep--
      }
    },
    completeOnboarding() {
      this.showOnboarding = false
      localStorage.setItem('hasVisitedBefore', 'true')
      this.$emit('onboarding-completed')
    },
    closeOnboarding() {
      this.showOnboarding = false
      localStorage.setItem('hasVisitedBefore', 'true')
      this.$emit('onboarding-skipped')
    }
  }
}
</script>

<style scoped>
.onboarding-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  z-index: 1051;
}

.modal-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 500;
}

.close {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: #6c757d;
  cursor: pointer;
  padding: 0;
}

.modal-body {
  padding: 1.5rem;
}

.step-indicator {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.step-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #dee2e6;
  margin: 0 0.25rem;
  transition: all 0.3s ease;
}

.step-dot.active {
  background-color: #007bff;
  transform: scale(1.2);
}

.step-dot.completed {
  background-color: #28a745;
}

.step-content {
  text-align: center;
}

.step-title {
  color: #495057;
  font-weight: 600;
}

.step-description {
  color: #6c757d;
  line-height: 1.5;
}

.features-list {
  text-align: left;
  max-width: 300px;
  margin: 0 auto;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
}

@media (max-width: 576px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
