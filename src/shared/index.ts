// 共享配置
export const SHARED_CONFIG = {
  // 应用版本
  version: '1.0.0',
  
  // API基础URL
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || '',
  
  // 应用主题
  theme: {
    primaryColor: '#409EFF',
    successColor: '#67C23A',
    warningColor: '#E6A23C',
    dangerColor: '#F56C6C',
    infoColor: '#909399'
  },
  
  // 路由配置
  routes: {
    home: '/',
    user: '/user',
    system: '/system'
  },
  
  // 其他共享配置
  settings: {
    enableDebug: import.meta.env.DEV,
    pageSize: 20,
    timeout: 5000
  }
}