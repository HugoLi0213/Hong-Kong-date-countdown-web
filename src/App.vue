<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">Important Dates for Hong Kong</h1>
    <DatesList />
  </div>
</template>

<script>
import DatesList from './components/DatesList.vue';

export default {
  components: {
    DatesList
  }
};
</script>

<style>
body {
  background-color: #f8f9fa;
}
</style>
