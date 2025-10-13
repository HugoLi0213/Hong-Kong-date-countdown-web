// main.js
import { inject } from '@vercel/analytics';
import { createApp } from 'vue';
import App from './App.vue';

// Create and mount the Vue app
const app = createApp(App);

// Inject Vercel Analytics
inject();

// Mount the app to the DOM
app.mount('#app');
