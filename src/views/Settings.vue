<template>
    <div class="settings-page">
        <h1>{{ $t('Notification Settings') }}</h1>
        <div class="preview-section">
            <h2>{{ $t('Preview Notification') }}</h2>
            <div class="preview-card">
                <div class="preview-title">{{ preview.title }}</div>
                <div class="preview-body">{{ preview.body }}</div>
                <div class="preview-actions">
                    <button v-for="btn in preview.actionButtons" :key="btn.action" class="preview-btn">{{ btn.title }}</button>
                </div>
            </div>
            <button class="refresh-btn" @click="refreshPreview">{{ $t('Refresh Preview') }}</button>
        </div>
        <!-- ...existing settings controls... -->
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { generateNotificationContent } from '../services/notificationContentGenerator.js';
import { NotificationType } from '../types/notifications.js';

const preview = ref({ title: '', body: '', actionButtons: [] });

function refreshPreview() {
    // Example holiday for preview
    const holiday = {
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        event: 'Dragon Boat Festival'
    };
    preview.value = generateNotificationContent(
        holiday,
        'en',
        NotificationType.DAILY_REMINDER
    );
}

refreshPreview();
</script>

<style scoped>
.settings-page {
    max-width: 600px;
    margin: 0 auto;
    padding: 2em 1em;
}
.preview-section {
    background: #f5f7fa;
    border-radius: 12px;
    padding: 1.5em;
    margin-bottom: 2em;
    box-shadow: 0 2px 8px rgba(72,138,255,0.08);
}
.preview-card {
    background: #fff;
    border-radius: 8px;
    padding: 1em;
    margin-bottom: 1em;
    box-shadow: 0 1px 4px rgba(72,138,255,0.06);
}
.preview-title {
    font-weight: bold;
    font-size: 1.1em;
    margin-bottom: 0.5em;
}
.preview-body {
    font-size: 1em;
    margin-bottom: 0.7em;
}
.preview-actions {
    display: flex;
    gap: 0.5em;
}
.preview-btn {
    background: #488AFF;
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 0.5em 1.2em;
    font-size: 0.95em;
    cursor: pointer;
    transition: background 0.2s;
}
.preview-btn:hover {
    background: #357ae8;
}
.refresh-btn {
    background: #e0e7ff;
    color: #357ae8;
    border: none;
    border-radius: 6px;
    padding: 0.5em 1.2em;
    font-size: 0.95em;
    cursor: pointer;
    margin-top: 1em;
    transition: background 0.2s;
}
.refresh-btn:hover {
    background: #c7d2fe;
}
@media (max-width: 600px) {
    .settings-page {
        padding: 1em 0.5em;
    }
    .preview-section {
        padding: 1em;
    }
    .preview-card {
        padding: 0.7em;
    }
}
</style>
