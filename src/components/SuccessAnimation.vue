<template>
  <div v-if="show" class="success-animation-overlay">
    <div class="success-animation">
      <div class="success-icon">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark__circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark__check" fill="none" d="m14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>

      <div class="success-message">
        <h4 class="success-title">{{ title }}</h4>
        <p v-if="message" class="success-text">{{ message }}</p>
      </div>

      <div class="success-actions" v-if="showActions">
        <button
          v-if="actionText"
          class="btn btn-primary btn-sm"
          @click="handleAction"
        >
          {{ actionText }}
        </button>
        <button
          class="btn btn-outline-secondary btn-sm ml-2"
          @click="close"
        >
          {{ language === 'en' ? 'Close' : '關閉' }}
        </button>
      </div>

      <!-- Confetti animation -->
      <div class="confetti-container" v-if="showConfetti">
        <div
          v-for="i in 50"
          :key="i"
          class="confetti-piece"
          :style="{
            left: Math.random() * 100 + '%',
            animationDelay: Math.random() * 3 + 's',
            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)]
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessAnimation',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    actionText: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    },
    showConfetti: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: true
    },
    autoCloseDelay: {
      type: Number,
      default: 3000
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  data() {
    return {
      confettiColors: [
        '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
        '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9'
      ]
    }
  },
  watch: {
    show(newVal) {
      if (newVal && this.autoClose) {
        setTimeout(() => {
          this.close()
        }, this.autoCloseDelay)
      }
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    handleAction() {
      this.$emit('action')
    }
  }
}
</script>

<style scoped>
.success-animation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
  animation: fadeIn 0.3s ease-out;
}

.success-animation {
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 90%;
  position: relative;
  overflow: hidden;
}

.success-icon {
  margin-bottom: 1.5rem;
}

.checkmark {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #4CAF50;
  stroke-miterlimit: 10;
  margin: 0 auto;
  animation: checkmark 0.8s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #4CAF50;
  fill: none;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

.success-title {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.success-text {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.success-actions {
  margin-top: 1.5rem;
}

.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.confetti-piece {
  position: absolute;
  width: 8px;
  height: 8px;
  animation: confetti-fall 3s linear infinite;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes checkmark {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes confetti-fall {
  0% {
    transform: translateY(-100vh) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: translateY(100vh) rotate(720deg);
    opacity: 0;
  }
}

@media (max-width: 576px) {
  .success-animation {
    padding: 1.5rem;
    margin: 1rem;
  }

  .success-actions {
    display: flex;
    flex-direction: column;
  }

  .success-actions .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
