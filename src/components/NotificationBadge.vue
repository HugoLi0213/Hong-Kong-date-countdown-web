<template>
    <div class="notification-badge" v-if="count > 0">
        <span class="badge-count">{{ count }}</span>
        <svg class="badge-icon" viewBox="0 0 24 24"><!-- bell icon --><path d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 00-3 0v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29A1 1 0 006 19h12a1 1 0 00.71-1.71L18 16z"/></svg>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import useNotifications from '../composables/useNotifications.js';

const { getPendingCount } = useNotifications();
const count = ref(0);

onMounted(async () => {
    count.value = await getPendingCount();
});
</script>

<style scoped>
.notification-badge {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}
.badge-count {
    background: #488AFF;
    color: #fff;
    border-radius: 50%;
    padding: 0.3em 0.7em;
    font-size: 1em;
    font-weight: bold;
    position: absolute;
    top: -10px;
    right: -10px;
    z-index: 2;
}
.badge-icon {
    width: 24px;
    height: 24px;
    fill: #488AFF;
}
@media (max-width: 600px) {
    .badge-count {
        font-size: 0.8em;
        padding: 0.2em 0.5em;
    }
    .badge-icon {
        width: 20px;
        height: 20px;
    }
}
</style>
