<template>
  <div class="sub-app-container">
     <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <span>正在加载微应用...</span>
    </div>
    <!-- 微应用容器 -->
    <div 
      id="micro-app-container" 
      ref="containerRef"
      class="micro-app-content"
      key="micro-container"
      v-show="!loading"
    ></div>
    
    <!-- 错误状态 -->
    <div v-if="error" class="error-container">
      <SubAppError 
        :error-message="errorTitle" 
        :error-details="error" 
        app-name="sub-app"
        @reload="retry"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { startMicroAppsOnDemand } from '../micro'
import SubAppError from '@/components/SubAppError.vue'

const loading = ref(true)
const errorTitle = ref('')
const error = ref('')
const containerRef = ref<HTMLElement>()

const retry = () => {
  error.value = ''
  loading.value = true
  // 重新加载页面
  window.location.reload()
}

onMounted(async () => {
  await nextTick()
  
  // 确保容器元素存在
  // 直接检查DOM中是否存在容器元素，而不是依赖ref
  const container = document.querySelector('#micro-app-container')
  if (container) {
    console.log('微应用容器已就绪:', container)
    
    try {
      // 容器就绪后，立即启动qiankun（如果还没有启动的话）
      await startMicroAppsOnDemand()
      console.log('qiankun启动成功，微应用将被加载')
      loading.value = false
    } catch (startError) {
      console.error('qiankun启动失败:', startError)
      errorTitle.value = '子应用加载失败，请确认子应用是否已启动'
      error.value = `qiankun启动失败: ${(startError as Error).message || '未知错误'}`
      loading.value = false
      console.error('子应用加载错误:', error)
    }
  } else {
    error.value = '微应用容器初始化失败，找不到容器，请检查挂载的容器是否存在'
    loading.value = false
  }
})

// 微应用容器组件
// qiankun会自动将子应用挂载到 #micro-app-container 容器中
</script>

<style scoped>
.sub-app-container {
  width: 100%;
}
.micro-app-container {
  width: 100%;
  flex: 1;
  min-height: 600px;
  position: relative;
  /* 移除可能影响子应用的样式 */
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
}

.micro-app-content {
  width: 100%;
  height: 100%;
  min-height: 600px;
  /* 确保子应用有完整的空间 */
  padding: 0;
  margin: 0;
  border: none;
  background: transparent;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #909399;
  font-size: 14px;
}

.loading-container .el-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

.error-container {
  padding: 20px;
  text-align: center;
}
</style>