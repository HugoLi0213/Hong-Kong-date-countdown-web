// main.js
import { inject } from '@vercel/analytics';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router.js';

const app = createApp(App);
app.use(router);
inject();
app.mount('#app');
