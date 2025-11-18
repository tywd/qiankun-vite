<template>
  <div class="error-container">
    <div class="error-card">
      <h2 class="error-title">子应用加载失败</h2>
      <p class="error-message">{{ errorMessage || '请检查子应用是否已启动或配置正确' }}</p>
      <div class="error-details" v-if="errorDetails">
        <p>错误详情：</p>
        <pre>{{ errorDetails }}</pre>
      </div>
      <button @click="reloadApp" class="reload-btn">重试加载</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// 接收错误信息
const props = defineProps<{
  errorMessage?: string
  errorDetails?: string
  appName?: string
}>()

// 触发重试
const emit = defineEmits<{
  (e: 'reload'): void
}>()

const reloadApp = () => {
  emit('reload')
}
</script>

<style scoped>
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 1rem;
}

.error-card {
  width: 100%;
  max-width: 600px;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.error-title {
  color: #e53e3e;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.error-message {
  color: #4a5568;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.error-details {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 4px;
  font-size: 0.9rem;
}

pre {
  white-space: pre-wrap;
  word-break: break-all;
  color: #718096;
}

.reload-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.reload-btn:hover {
  background-color: #2b6cb0;
}
</style>