// 简单的事件总线实现
class EventBus {
  private events: Record<string, Function[]> = {}

  on(event: string, callback: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  off(event: string, callback?: Function) {
    if (!this.events[event]) return
    
    if (callback) {
      const index = this.events[event].indexOf(callback)
      if (index > -1) {
        this.events[event].splice(index, 1)
      }
    } else {
      this.events[event] = []
    }
  }

  emit(event: string, ...args: any[]) {
    if (!this.events[event]) return
    
    this.events[event].forEach(callback => {
      try {
        callback(...args)
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error)
      }
    })
  }
}

// 创建全局事件总线实例
export const globalEventBus = new EventBus()

// 应用事件管理
export const appEvents = {
  mounted: (appName: string) => {
    console.log(`应用 ${appName} 已挂载`)
    globalEventBus.emit('app:mounted', appName)
  },
  
  unmounted: (appName: string) => {
    console.log(`应用 ${appName} 已卸载`)
    globalEventBus.emit('app:unmounted', appName)
  },
  
  error: (appName: string, error: any) => {
    console.error(`应用 ${appName} 发生错误:`, error)
    globalEventBus.emit('app:error', { appName, error })
  }
}

// 导出事件总线的方法
export const eventBus = {
  on: (event: string, callback: Function) => {
    globalEventBus.on(event, callback)
  },
  
  off: (event: string, callback?: Function) => {
    globalEventBus.off(event, callback)
  },
  
  emit: (event: string, ...args: any[]) => {
    globalEventBus.emit(event, ...args)
  }
}