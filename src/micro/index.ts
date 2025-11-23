import { registerMicroApps, start, addGlobalUncaughtErrorHandler, initGlobalState } from 'qiankun'
import type { RegistrableApp } from 'qiankun'
import { globalEventBus, appEvents } from '../shared/eventBus'
import { SHARED_CONFIG } from '../shared/index'
import { getSubApp } from '@/utils';

// 微应用配置
const microApps: RegistrableApp<any>[] = getSubApp();

const { onGlobalStateChange, setGlobalState } = initGlobalState({
  user: null,
  theme: 'default',
  permissions: []
})

// 注册微应用
export function registerApps() {
  console.log('注册微应用配置:', microApps)
  
  registerMicroApps(microApps, {
    beforeLoad: (app) => {
      console.log('开始加载微应用:', app.name, 'entry:', app.entry)
      appEvents.mounted(app.name)
      return Promise.resolve()
    },
    beforeMount: (app) => {
      console.log('开始挂载微应用:', app.name)
      return Promise.resolve()
    },
    afterMount: (app) => {
      console.log('微应用挂载完成:', app.name)
      return Promise.resolve()
    },
    beforeUnmount: (app) => {
      console.log('开始卸载微应用:', app.name)
      return Promise.resolve()
    },
    afterUnmount: (app) => {
      console.log('微应用卸载完成:', app.name)
      appEvents.unmounted(app.name)
      return Promise.resolve()
    }
  })
}

// 全局标记，确保qiankun只启动一次
let isQiankunStarted = false

// 按需启动微前端（当容器元素存在时调用）
export function startMicroAppsOnDemand() {
  if (isQiankunStarted) {
    console.log('qiankun已经启动，跳过重复启动')
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    // 检查容器是否存在
    const container = document.querySelector('#micro-app-container')
    if (!container) {
      console.error('微前端容器不存在，无法启动qiankun')
      reject(new Error('Container not found'))
      return
    }

    console.log('容器已存在，开始启动qiankun')
    
    try {
      start({
        prefetch: 'all', // 预加载所有微应用
        sandbox: {
          strictStyleIsolation: false,  // 关闭严格样式隔离，避免Element Plus样式问题
          experimentalStyleIsolation: false // 关闭实验性样式隔离，防止子应用样式被清除
        },
        singular: false, // 是否为单实例场景
        fetch: (url, options) => {
          // 自定义fetch，增强错误处理
          console.log('正在加载微应用资源:', url)
          return window.fetch(url, {
            ...options,
            mode: 'cors',
            credentials: 'omit'
          }).catch(error => {
            console.error('微应用资源加载失败:', url, error)
            throw error
          })
        }
      })
      
      isQiankunStarted = true
      console.log('qiankun启动成功')
      resolve()
    } catch (error) {
      console.error('qiankun启动失败:', error)
      reject(error)
    }
  })
}

// 启动微前端（保留原有接口，但改为按需启动方式）
export function startMicroApps() {
  // 等待容器元素就绪（完全优化版本）
  const waitForContainer = () => {
    return new Promise<void>((resolve, reject) => {
      // 首先检查容器是否已经存在
      const container = document.querySelector('#micro-app-container')
      if (container) {
        console.log('微前端容器已存在，直接启动qiankun')
        resolve()
        return
      }

      console.log('容器不存在，使用MutationObserver等待容器出现...')
      
      let isResolved = false // 防止重复解析
      
      // 设置超时器
      const timeout = setTimeout(() => {
        if (isResolved) return
        isResolved = true
        observer.disconnect()
        console.error('微前端容器等待超时5秒，启动失败')
        reject(new Error('Container timeout after 5 seconds'))
      }, 5000) // 增加到5秒超时

      // 使用MutationObserver监听DOM变化
      const observer = new MutationObserver((mutations) => {
        if (isResolved) return
        
        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            const container = document.querySelector('#micro-app-container')
            if (container) {
              isResolved = true
              clearTimeout(timeout)
              observer.disconnect()
              console.log('微前端容器通过MutationObserver检测到，开始启动qiankun')
              resolve()
              return
            }
          }
        }
      })

      // 监听整个document的子节点变化
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })

      // 移除轮询机制，完全依赖MutationObserver
      // 这样就不会有无限循环的问题了
    })
  }

  waitForContainer()
    .then(() => {
      return startMicroAppsOnDemand()
    })
    .catch(error => {
      console.error('微前端启动失败:', error)
      // 可以在这里添加用户友好的错误提示
    })
}

// 全局错误处理
export function setupErrorHandler() {
  addGlobalUncaughtErrorHandler((event) => {
    console.error('微应用加载错误:', event)
    console.error('错误类型:', typeof event)
    console.error('错误详情:', JSON.stringify(event, null, 2))
    appEvents.error('unknown', event)
    // 这里可以添加错误上报逻辑
  })
}

// 导出全局状态管理
export { onGlobalStateChange, setGlobalState }
export { microApps }