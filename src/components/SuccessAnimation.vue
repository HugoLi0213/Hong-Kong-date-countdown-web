<template>
    <div class="success-animation" v-if="show">
        <svg class="checkmark" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14 27l7 7 16-16"/>
        </svg>
        <span class="success-text">{{ $t('Notification Scheduled!') }}</span>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const show = ref(false);

function trigger() {
    show.value = true;
    setTimeout(() => show.value = false, 1800);
}

defineExpose({ trigger });
</script>

<style scoped>
.success-animation {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 30%;
    left: 50%;
    transform: translate(-50%, -30%);
    z-index: 1000;
    background: rgba(255,255,255,0.95);
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(72,138,255,0.18);
    padding: 2em 2.5em;
}
.checkmark {
    width: 52px;
    height: 52px;
    stroke: #4CAF50;
    stroke-width: 3;
    stroke-linecap: round;
    stroke-linejoin: round;
    animation: checkmark 0.7s cubic-bezier(0.65,0,0.45,1) forwards;
}
.checkmark-circle {
    stroke: #4CAF50;
    stroke-width: 3;
    animation: circle 0.5s ease-in-out forwards;
}
.checkmark-check {
    stroke: #4CAF50;
    stroke-width: 3;
    stroke-dasharray: 48;
    stroke-dashoffset: 48;
    animation: check 0.5s 0.5s ease forwards;
}
.success-text {
    margin-top: 1em;
    font-size: 1.2em;
    color: #357ae8;
    font-weight: bold;
}
@keyframes circle {
    0% { stroke-dasharray: 0 157; }
    100% { stroke-dasharray: 157 0; }
}
@keyframes check {
    100% { stroke-dashoffset: 0; }
}
@media (max-width: 600px) {
    .success-animation {
        padding: 1em 1.2em;
    }
    .success-text {
        font-size: 1em;
    }
}
</style>
