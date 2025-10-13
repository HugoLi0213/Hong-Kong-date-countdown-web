<template>
  <div class="empty-state">
    <div class="empty-state-content">
      <div class="empty-state-icon mb-4">
        <i :class="iconClass" class="fa-4x text-muted"></i>
      </div>

      <h3 class="empty-state-title mb-3">{{ title }}</h3>
      <p class="empty-state-message mb-4">{{ message }}</p>

      <div v-if="showActions" class="empty-state-actions">
        <button
          v-if="primaryActionText"
          class="btn btn-primary"
          @click="handlePrimaryAction"
        >
          <i v-if="primaryActionIcon" :class="primaryActionIcon" class="mr-2"></i>
          {{ primaryActionText }}
        </button>

        <button
          v-if="secondaryActionText"
          class="btn btn-outline-secondary ml-2"
          @click="handleSecondaryAction"
        >
          <i v-if="secondaryActionIcon" :class="secondaryActionIcon" class="mr-2"></i>
          {{ secondaryActionText }}
        </button>
      </div>

      <div v-if="suggestions && suggestions.length > 0" class="empty-state-suggestions mt-4">
        <h5 class="suggestions-title mb-3">
          {{ language === 'en' ? 'Suggestions:' : '建議：' }}
        </h5>
        <ul class="suggestions-list">
          <li v-for="suggestion in suggestions" :key="suggestion" class="suggestion-item">
            <i class="fas fa-lightbulb text-warning mr-2"></i>
            {{ suggestion }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmptyState',
  props: {
    type: {
      type: String,
      default: 'default',
      validator: value => ['default', 'no-results', 'no-favorites', 'no-notifications', 'error'].includes(value)
    },
    language: {
      type: String,
      default: 'en'
    },
    customTitle: {
      type: String,
      default: ''
    },
    customMessage: {
      type: String,
      default: ''
    },
    customIcon: {
      type: String,
      default: ''
    },
    primaryActionText: {
      type: String,
      default: ''
    },
    primaryActionIcon: {
      type: String,
      default: ''
    },
    secondaryActionText: {
      type: String,
      default: ''
    },
    secondaryActionIcon: {
      type: String,
      default: ''
    },
    showActions: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    title() {
      if (this.customTitle) return this.customTitle

      const titles = {
        'no-results': this.language === 'en' ? 'No Results Found' : '未找到結果',
        'no-favorites': this.language === 'en' ? 'No Favorite Holidays' : '沒有收藏的假期',
        'no-notifications': this.language === 'en' ? 'No Notifications' : '沒有通知',
        'error': this.language === 'en' ? 'Something Went Wrong' : '發生錯誤',
        'default': this.language === 'en' ? 'Nothing to Show' : '沒有內容顯示'
      }
      return titles[this.type] || titles.default
    },
    message() {
      if (this.customMessage) return this.customMessage

      const messages = {
        'no-results': this.language === 'en'
          ? 'Try adjusting your search criteria or filters to find what you\'re looking for.'
          : '請嘗試調整您的搜尋條件或篩選器以找到您要的內容。',
        'no-favorites': this.language === 'en'
          ? 'You haven\'t added any holidays to your favorites yet. Click the heart icon on holidays you want to save.'
          : '您尚未將任何假期加入收藏。點擊假期上的心形圖標來儲存您想要的假期。',
        'no-notifications': this.language === 'en'
          ? 'You\'re all caught up! No new notifications at the moment.'
          : '您已經看完所有內容！目前沒有新通知。',
        'error': this.language === 'en'
          ? 'We encountered an error while loading the content. Please try again later.'
          : '載入內容時發生錯誤。請稍後再試。',
        'default': this.language === 'en'
          ? 'There\'s nothing here yet. Check back later or try a different view.'
          : '這裡還沒有內容。請稍後再查看或嘗試不同的視圖。'
      }
      return messages[this.type] || messages.default
    },
    iconClass() {
      if (this.customIcon) return this.customIcon

      const icons = {
        'no-results': 'fas fa-search',
        'no-favorites': 'fas fa-heart',
        'no-notifications': 'fas fa-bell-slash',
        'error': 'fas fa-exclamation-triangle',
        'default': 'fas fa-inbox'
      }
      return icons[this.type] || icons.default
    },
    suggestions() {
      const suggestionSets = {
        'no-results': this.language === 'en'
          ? [
              'Check your spelling and try different keywords',
              'Try using broader search terms',
              'Remove some filters to see more results',
              'Switch between list and calendar view'
            ]
          : [
              '檢查拼寫並嘗試不同的關鍵字',
              '嘗試使用更廣泛的搜尋詞',
              '移除一些篩選器以查看更多結果',
              '在列表和日曆視圖之間切換'
            ],
        'no-favorites': this.language === 'en'
          ? [
              'Browse upcoming holidays in the list view',
              'Look for long weekends and public holidays',
              'Check holidays with special cultural significance',
              'Explore school holidays for planning family time'
            ]
          : [
              '在列表視圖中瀏覽即將到來的假期',
              '尋找長週末和公眾假期',
              '查看具有特殊文化意義的假期',
              '探索學校假期以規劃家庭時間'
            ],
        'no-notifications': this.language === 'en'
          ? [
              'Enable notifications in settings to stay updated',
              'Add some holidays to your favorites for reminders',
              'Check back during holiday season for more alerts'
            ]
          : [
              '在設定中啟用通知以保持更新',
              '將一些假期加入收藏以接收提醒',
              '在假期季節回來查看更多警報'
            ]
      }
      return suggestionSets[this.type] || []
    }
  },
  methods: {
    handlePrimaryAction() {
      this.$emit('primary-action')
    },
    handleSecondaryAction() {
      this.$emit('secondary-action')
    }
  }
}
</script>

<style scoped>
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  padding: 2rem 1rem;
}

.empty-state-content {
  text-align: center;
  max-width: 500px;
}

.empty-state-icon {
  opacity: 0.6;
}

.empty-state-title {
  color: #495057;
  font-weight: 600;
  font-size: 1.5rem;
}

.empty-state-message {
  color: #6c757d;
  font-size: 1rem;
  line-height: 1.5;
}

.empty-state-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.empty-state-suggestions {
  text-align: left;
  background-color: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
}

.suggestions-title {
  color: #495057;
  font-size: 1.1rem;
  font-weight: 600;
}

.suggestions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.suggestion-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.suggestion-item i {
  margin-top: 0.1rem;
  flex-shrink: 0;
}

@media (max-width: 576px) {
  .empty-state-actions {
    flex-direction: column;
  }

  .empty-state-actions .btn {
    margin-bottom: 0.5rem;
    width: 100%;
  }

  .empty-state-suggestions {
    padding: 1rem;
  }
}
</style>
