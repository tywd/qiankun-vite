// 声明qiankun全局变量
declare global {
  interface Window {
    __POWERED_BY_QIANKUN__?: boolean
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__?: string
  }
}
export {}; // 如果需要模块化，可以添加空导出