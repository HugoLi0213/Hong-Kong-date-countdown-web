<template>
    <div class="onboarding">
        <h1>{{ $t('Welcome to Hong Kong Holiday Countdown!') }}</h1>
        <div class="onboarding-illustration">
            <img src="/logo-192x192.png" alt="App Logo" />
        </div>
        <ul class="benefits">
            <li>🔔 {{ $t('Get gentle reminders for upcoming holidays') }}</li>
            <li>🌿 {{ $t('Plan your rest and wellness ahead') }}</li>
            <li>🎉 {{ $t('Never miss a long weekend') }}</li>
            <li>🧘 {{ $t('Balance work and life with mindful notifications') }}</li>
        </ul>
        <button class="primary" @click="$emit('finish')">{{ $t('Get Started') }}</button>
    </div>
</template>

<script setup>
// ...existing code...
</script>

<style scoped>
.onboarding {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 2em;
    background: linear-gradient(135deg, #e0f7fa 0%, #fff 100%);
}
.onboarding-illustration img {
    width: 120px;
    margin-bottom: 1.5em;
}
.benefits {
    list-style: none;
    padding: 0;
    margin: 1em 0 2em 0;
    font-size: 1.2em;
}
.benefits li {
    margin-bottom: 0.7em;
    display: flex;
    align-items: center;
}
.primary {
    background: #488AFF;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 0.8em 2em;
    font-size: 1.1em;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(72,138,255,0.15);
    transition: background 0.2s;
}
.primary:hover {
    background: #357ae8;
}
@media (max-width: 600px) {
    .onboarding {
        padding: 1em;
    }
    .benefits {
        font-size: 1em;
    }
    .primary {
        font-size: 1em;
        padding: 0.6em 1.2em;
    }
}
</style>
