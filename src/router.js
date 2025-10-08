import { createRouter, createWebHistory } from 'vue-router';
import DatesList from './components/DatesList.vue';
import NotificationSettings from './components/NotificationSettings.vue';

const routes = [
  { path: '/', component: DatesList },
  { path: '/settings', component: NotificationSettings },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
