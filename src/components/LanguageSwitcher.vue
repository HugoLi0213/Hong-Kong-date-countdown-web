<template>
  <div class="language-switcher">
    <div class="dropdown" :class="{ 'show': showDropdown }" @click="toggleDropdown">
      <button
        class="btn btn-outline-secondary btn-sm dropdown-toggle"
        type="button"
        :aria-expanded="showDropdown"
        aria-haspopup="true"
      >
        <i class="fas fa-globe mr-1" aria-hidden="true"></i>
        <span class="language-text">{{ currentLanguageText }}</span>
        <i class="fas fa-chevron-down ml-1 chevron-icon" :class="{ 'rotate': showDropdown }" aria-hidden="true"></i>
      </button>

      <div class="dropdown-menu" :class="{ 'show': showDropdown }">
        <button
          v-for="lang in availableLanguages"
          :key="lang.code"
          class="dropdown-item"
          :class="{ 'active': lang.code === currentLanguage }"
          type="button"
          @click.stop="switchLanguage(lang.code)"
        >
          {{ lang.name }}
          <i v-if="lang.code === currentLanguage" class="fas fa-check ml-auto text-success" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LanguageSwitcher',
  props: {
    currentLanguage: {
      type: String,
      default: 'en'
    },
    availableLanguages: {
      type: Array,
      default: () => [
        { code: 'en', name: 'English', flag: 'us' },
        { code: 'zh', name: '中文', flag: 'cn' }
      ]
    }
  },
  data() {
    return {
      showDropdown: false
    }
  },
  computed: {
    currentLanguageText() {
      const lang = this.availableLanguages.find(l => l.code === this.currentLanguage)
      return lang ? lang.name : 'English'
    }
  },
  mounted() {
    // Close dropdown when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
    },
    switchLanguage(langCode) {
      if (langCode !== this.currentLanguage) {
        this.$emit('language-change', langCode)
        localStorage.setItem('preferredLanguage', langCode)
      }
      this.showDropdown = false
    },
    handleClickOutside(event) {
      if (!this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    }
  }
}
</script>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.dropdown-toggle {
  border: 1px solid #dee2e6;
  background-color: #fff;
  color: #495057;
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: all 0.15s ease-in-out;
  min-width: 120px;
  justify-content: space-between;
}

.dropdown-toggle:hover {
  background-color: #f8f9fa;
  border-color: #adb5bd;
}

.dropdown-toggle:focus {
  box-shadow: 0 0 0 0.2rem rgba(108, 117, 125, 0.25);
  outline: none;
}

.language-text {
  font-weight: 500;
}

.chevron-icon {
  transition: transform 0.2s ease;
  font-size: 0.75rem;
}

.chevron-icon.rotate {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  display: none;
  float: left;
  min-width: 160px;
  padding: 0.5rem 0;
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #212529;
  text-align: left;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.15);
  border-radius: 0.375rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
}

.dropdown-menu.show {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.5rem 1rem;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.dropdown-item:hover,
.dropdown-item:focus {
  color: #16181b;
  text-decoration: none;
  background-color: #f8f9fa;
}

.dropdown-item.active {
  color: #fff;
  text-decoration: none;
  background-color: #007bff;
}

.dropdown-item.active:hover,
.dropdown-item.active:focus {
  color: #fff;
  background-color: #0056b3;
}

.flag-icon {
  width: 20px;
  height: 15px;
  border-radius: 2px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);
}

/* Fallback flag styles if flag-icon-css is not available */
.flag-icon-us {
  background: linear-gradient(to bottom, #b22234 33%, #ffffff 33%, #ffffff 66%, #3c3b6e 66%);
}

.flag-icon-cn {
  background: linear-gradient(to bottom, #de2910 50%, #ffde00 50%);
}

@media (max-width: 576px) {
  .dropdown-toggle {
    min-width: 100px;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .language-text {
    display: none;
  }

  .dropdown-menu {
    min-width: 140px;
  }
}
</style>
