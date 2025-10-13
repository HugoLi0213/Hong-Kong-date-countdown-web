<template>
  <div v-if="showBadge" class="notification-badge">
    <span
      class="badge badge-pill"
      :class="badgeClass"
      @click="handleClick"
      :title="tooltipText"
    >
      <i :class="iconClass" aria-hidden="true"></i>
      <span v-if="count > 0" class="count">{{ count }}</span>
    </span>
  </div>
</template>

<script>
export default {
  name: 'NotificationBadge',
  props: {
    type: {
      type: String,
      default: 'notification',
      validator: value => ['notification', 'reminder', 'alert', 'info'].includes(value)
    },
    count: {
      type: Number,
      default: 0
    },
    language: {
      type: String,
      default: 'en'
    },
    clickable: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    showBadge() {
      return this.count > 0 || this.type === 'notification'
    },
    badgeClass() {
      const baseClass = 'badge-'
      switch (this.type) {
        case 'reminder':
          return baseClass + 'warning'
        case 'alert':
          return baseClass + 'danger'
        case 'info':
          return baseClass + 'info'
        default:
          return baseClass + 'primary'
      }
    },
    iconClass() {
      switch (this.type) {
        case 'reminder':
          return 'fas fa-clock'
        case 'alert':
          return 'fas fa-exclamation-triangle'
        case 'info':
          return 'fas fa-info-circle'
        default:
          return 'fas fa-bell'
      }
    },
    tooltipText() {
      if (this.count === 0) {
        return this.language === 'en' ? 'No new notifications' : '沒有新通知'
      }
      return this.language === 'en'
        ? `${this.count} new ${this.type}${this.count > 1 ? 's' : ''}`
        : `${this.count} 個新${this.getTypeText}`
    },
    getTypeText() {
      switch (this.type) {
        case 'reminder':
          return '提醒'
        case 'alert':
          return '警報'
        case 'info':
          return '資訊'
        default:
          return '通知'
      }
    }
  },
  methods: {
    handleClick() {
      if (this.clickable) {
        this.$emit('badge-click', {
          type: this.type,
          count: this.count
        })
      }
    }
  }
}
</script>

<style scoped>
.notification-badge {
  display: inline-block;
  cursor: pointer;
}

.notification-badge .badge {
  position: relative;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  transition: all 0.2s ease;
}

.notification-badge .badge:hover {
  transform: scale(1.05);
}

.notification-badge .count {
  margin-left: 0.25rem;
  font-weight: bold;
}

.notification-badge .badge.badge-warning {
  background-color: #ffc107;
  color: #212529;
}

.notification-badge .badge.badge-danger {
  background-color: #dc3545;
}

.notification-badge .badge.badge-info {
  background-color: #17a2b8;
}
</style>
