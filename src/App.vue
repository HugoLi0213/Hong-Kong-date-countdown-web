<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Hong Kong Holidays Countdown</h1>
    <DatesList />
    <Onboarding :language="language" @onboarding-completed="onOnboardingCompleted" @onboarding-skipped="onOnboardingSkipped" />
  </div>
</template>

<script>
import DatesList from './components/DatesList.vue';
import Onboarding from './components/Onboarding.vue';

export default {
  components: {
    DatesList,
    Onboarding
  },
  data() {
    return {
      language: 'en'
    }
  },
  methods: {
    onOnboardingCompleted() {
      console.log('Onboarding completed');
    },
    onOnboardingSkipped() {
      console.log('Onboarding skipped');
    }
  }
};
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
