<template>
    <div class="empty-state">
        <svg class="empty-icon" viewBox="0 0 48 48"><path d="M24 4a20 20 0 1020 20A20 20 0 0024 4zm0 36a16 16 0 1116-16 16 16 0 01-16 16zm-4-16a4 4 0 118 0 4 4 0 01-8 0zm-6 8a6 6 0 0112 0z" fill="#bdbdbd"/></svg>
        <h2>{{ $t('Notifications are disabled') }}</h2>
        <p>{{ $t('Enable notifications to get reminders for holidays and wellness tips.') }}</p>
        <button class="primary" @click="$emit('enable')">{{ $t('Enable Notifications') }}</button>
    </div>
</template>

<script setup>
// ...existing code...
</script>

<style scoped>
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2em;
    min-height: 40vh;
    color: #757575;
}
.empty-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 1em;
}
.primary {
    background: #488AFF;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.7em 1.8em;
    font-size: 1em;
    cursor: pointer;
    margin-top: 1.2em;
    box-shadow: 0 2px 8px rgba(72,138,255,0.12);
    transition: background 0.2s;
}
.primary:hover {
    background: #357ae8;
}
@media (max-width: 600px) {
    .empty-state {
        padding: 1em;
    }
    .empty-icon {
        width: 48px;
        height: 48px;
    }
    .primary {
        font-size: 0.9em;
        padding: 0.5em 1em;
    }
}
</style>
