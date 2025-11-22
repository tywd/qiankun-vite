# 主子应用样式隔离方案

在微前端架构中，主应用和子应用之间可能会出现样式冲突问题。本文档详细介绍我们采用的样式隔离方案。

## 样式冲突问题

在 qiankun 微前端架构中，主子应用之间可能出现同名类名样式冲突的问题，主要表现为：
1. 主应用和子应用使用了相同的 CSS 类名
2. 全局样式影响到子应用的显示效果
3. Element Plus 等第三方组件库样式相互干扰

## 解决方案

我们采用了多种方案来解决样式冲突问题：

### 1. CSS Modules（子应用）

在子应用中启用 CSS Modules，为类名生成唯一的哈希值：

```typescript
// vite.config.ts
css: {
  modules: {
    generateScopedName: '[name]__[local]___[hash:base64:5]'
  }
}
```

### 2. 命名空间前缀（主应用）

为主应用的样式添加命名空间前缀，避免全局样式污染：

```scss
// 主应用全局样式
.main-app {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  // 其他样式...
}
```

### 3. qiankun 样式隔离配置

在主应用中启用 qiankun 的实验性样式隔离：

```typescript
start({
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true
  }
})
```

### 4. Scoped CSS

在 Vue 组件中使用 scoped CSS，确保样式只作用于当前组件：

```vue
<style scoped>
.container {
  padding: 20px;
}
</style>
```

## 实施效果

通过以上方案的组合使用，我们有效解决了主子应用之间的样式冲突问题：
1. 子应用的样式通过 CSS Modules 实现局部化
2. 主应用的样式通过命名空间前缀避免全局污染
3. qiankun 的样式隔离机制进一步确保了样式隔离
4. Scoped CSS 确保组件级别的样式隔离

## 最佳实践

1. **命名规范**：建立统一的 CSS 命名规范，为主应用添加 `.main-app` 前缀
2. **组件级别隔离**：在组件级别使用 scoped 或 CSS Modules
3. **第三方组件库处理**：对 Element Plus 等第三方组件库使用命名空间包装
4. **样式变量管理**：使用 CSS 自定义属性隔离主题变量