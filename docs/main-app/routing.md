# 主应用路由配置

主应用的路由配置基于 Vue Router，同时需要考虑与子应用的集成。

## 路由配置文件

主应用的路由配置位于 [router/index.ts](file:///Users/shichuyu/Desktop/web/qoder/qiankun-vite-main/src/router/index.ts) 文件中。

### 基础路由配置

```typescript
import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 主应用路由
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/index.vue'),
    meta: { title: '首页' }
  }
]

// 合并主应用路由和子应用路由
const allRoutes = [...routes, ...getSubRoute()]

const router = createRouter({
  history: createWebHistory('/'),
  routes: allRoutes
})

export default router
```

## 子应用路由配置

子应用路由配置在 [utils/index.ts](file:///Users/shichuyu/Desktop/web/qoder/qiankun-vite-main/src/utils/index.ts) 中定义：

```typescript
// 获取子应用路由(如果加了新的子应用，需要在主应用此处注册好新的子应用路由信息)
export const getSubRoute = () => {
    return [
        {
            path: '/qiankun-vite-sub/:path(.*)*',
            name: 'subApp',
            component: () => import('@/components/SubApp.vue'),
            meta: { title: '子应用' }
        }
    ]
}
```

## 路由工具函数

### 路由转换函数

在 [utils/index.ts](file:///Users/shichuyu/Desktop/web/qoder/qiankun-vite-main/src/utils/index.ts) 中提供了路由转换函数：

```typescript
// 处理原始route路径为 vue-router可用的格式
export const transformRoutes = (routes: any[]): any[] => {
    // 使用 import.meta.glob 预加载所有视图组件，避免动态导入路径问题
    const viewModules = import.meta.glob('@/views/**/*.vue');

    const newRoutes: any[] = routes.map(route => {
        const transformd: any = {
            path: route.path,
            name: route.name,
            meta: route.meta
        }
        if (route.children && route.children.length > 0) {
            transformd.children = transformRoutes(route.children);
        } else {
            // 检查组件是否存在
            if (viewModules[`/src/views${route.path}.vue`]) {
                transformd.component = viewModules[`/src/views${route.path}.vue`];
            } else {
                // 如果组件不存在，提供一个默认组件并添加错误处理
                transformd.component = () => import('@/views/index.vue').catch(() => {
                    return Promise.resolve({
                        template: '<div>页面开发中...</div>'
                    });
                });
            }
        }
        return transformd;
    })
    return newRoutes;
}
```

## 路由守卫

主应用可以配置路由守卫来实现权限控制等功能：

```typescript
// 路由前置守卫
router.beforeEach((to, from, next) => {
  // 权限检查逻辑
  const isAuthenticated = checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})
```

## 动态路由

主应用支持动态添加路由，这对于根据用户权限动态加载菜单非常有用：

```typescript
// 动态添加路由
router.addRoute({
  path: '/dynamic',
  name: 'dynamic',
  component: () => import('@/views/dynamic.vue')
})
```

## 路由最佳实践

1. **路由懒加载**：使用动态导入实现路由组件的懒加载
2. **路由元信息**：通过 meta 字段存储路由相关信息（如标题、权限等）
3. **路由参数**：合理使用路由参数和查询参数
4. **路由守卫**：使用路由守卫实现权限控制和页面访问控制
5. **路由命名**：为路由命名以便于程序化导航