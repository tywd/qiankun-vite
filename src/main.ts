import { createApp } from 'vue'
import type { Component } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue'
import router from '@/router'
import { registerApps, setupErrorHandler } from '@/micro'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import '@/styles/index.scss';

// 创建Vue应用
const app = createApp(App)

// 创建Pinia实例
const pinia = createPinia()

// 注册Element Plus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component as Component)
}

// 注册Vue Router 、 pinia、注册Element Plus
app.use(router).use(pinia).use(ElementPlus)

// 挂载主应用
app.mount('#app')

// 等待路由就绪后进行微前端初始化（但不立即启动）
router.isReady().then(() => {
  console.log('主应用路由就绪，初始化微前端配置')
  
  // 注册微应用（只注册，不启动）
  registerApps()
  
  // 设置错误处理
  setupErrorHandler()
  
  console.log('微前端配置初始化完成，等待用户访问时启动')
})
