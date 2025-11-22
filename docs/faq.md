# 常见问题解答

## 样式隔离相关问题

### 1. 为什么主应用和子应用会出现样式冲突？

在微前端架构中，主应用和子应用的样式都在同一个页面中加载，如果没有适当的隔离措施，可能会出现以下情况：
1. 主应用和子应用使用了相同的 CSS 类名
2. 全局样式（如 reset 样式）相互影响
3. 第三方组件库（如 Element Plus）的样式相互覆盖

### 2. 如何解决主子应用的样式冲突问题？

我们采用了多种方案来解决样式冲突问题：

#### CSS Modules（子应用）
在子应用中启用 CSS Modules，为类名生成唯一的哈希值：

```typescript
// vite.config.ts
css: {
  modules: {
    generateScopedName: '[name]__[local]___[hash:base64:5]'
  }
}
```

#### 命名空间前缀（主应用）
为主应用的样式添加命名空间前缀，避免全局样式污染：

```scss
.main-app {
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  // 其他样式...
}
```

#### qiankun 样式隔离配置
在主应用中启用 qiankun 的实验性样式隔离：

```typescript
start({
  sandbox: {
    strictStyleIsolation: false,
    experimentalStyleIsolation: true
  }
})
```

### 3. CSS Modules 和 Scoped CSS 有什么区别？

#### CSS Modules
- 为类名生成唯一的哈希值，如 `.container__abc123`
- 需要在模板中使用 `$style` 对象引用类名
- 提供更强的样式隔离能力

```vue
<template>
  <div :class="$style.container">
    <h1 :class="$style.title">标题</h1>
  </div>
</template>

<style module>
.container {
  padding: 20px;
}
</style>
```

#### Scoped CSS
- 为组件添加唯一属性选择器，如 `[data-v-123456]`
- 可以直接使用类名，无需特殊语法
- 提供组件级别的样式隔离

```vue
<template>
  <div class="container">
    <h1 class="title">标题</h1>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
}
</style>
```

### 4. 什么时候使用 CSS Modules，什么时候使用 Scoped CSS？

#### 推荐使用 CSS Modules 的场景：
1. 需要动态绑定类名的组件
2. 对样式隔离要求非常严格的组件
3. 大型项目中需要避免命名冲突的组件

#### 推荐使用 Scoped CSS 的场景：
1. 简单的静态样式组件
2. 不需要动态绑定类名的组件
3. 快速开发和原型设计

### 5. 如何处理 Element Plus 等第三方组件库的样式冲突？

对于第三方组件库，我们建议采用以下方案：

1. **命名空间包装**：将第三方组件库的样式包装在特定的命名空间中
2. **按需引入**：只引入需要的组件和样式，减少样式冲突的可能性
3. **样式覆盖**：使用更具体的选择器来覆盖默认样式

```scss
// 为 Element Plus 添加命名空间
.main-app {
  @import '~element-plus/theme-chalk/index.css';
  
  // 覆盖 Element Plus 样式
  .el-button {
    // 主应用特定的按钮样式
  }
}
```

## 部署相关问题

### 1. 为什么 .env 文件不提交到线上？

.env 文件通常包含敏感信息（如 API 密钥、数据库密码等），提交到代码仓库会有安全风险。正确的做法是：
1. 将 .env 文件添加到 .gitignore 中
2. 在部署平台（如 Vercel）的环境变量设置中配置这些变量
3. 在代码中通过 `process.env.VARIABLE_NAME` 访问这些变量

### 2. Vercel 自动化部署如何获取环境变量？

在 Vercel 中，环境变量通过以下方式配置：
1. 在 Vercel 项目设置中添加环境变量
2. 在部署时，Vercel 会自动将这些变量注入到运行环境中
3. 代码中可以通过 `process.env.VARIABLE_NAME` 访问这些变量

### 3. 为什么子应用独立部署后样式丢失？

子应用独立部署后样式丢失可能有以下几个原因：
1. **CSS Modules 配置问题**：确保在独立运行时也启用了 CSS Modules
2. **资源路径问题**：检查 CSS 文件和静态资源的路径是否正确
3. **构建配置问题**：确保 Vite 构建配置正确处理了 CSS 文件

解决方案：
1. 检查 `vite.config.ts` 中的 CSS 配置
2. 确保 `base` 路径配置正确
3. 验证构建输出目录中的 CSS 文件是否存在

## 微前端相关问题

### 1. 主应用如何与子应用通信？

主应用与子应用之间可以通过以下方式通信：
1. **Props 传递**：主应用通过 props 向子应用传递数据
2. **全局状态管理**：使用 Qiankun 提供的全局状态管理功能
3. **事件总线**：通过自定义事件总线实现通信

### 2. 子应用如何独立运行？

子应用支持独立运行，通过以下方式实现：
1. **环境检测**：检测是否在 Qiankun 环境中运行
2. **独立初始化**：在非 Qiankun 环境中直接初始化应用
3. **路由配置**：根据运行环境动态配置路由基础路径

### 3. 如何处理跨域问题？

在开发环境中，可以通过以下方式处理跨域问题：
1. **代理配置**：在 Vite 配置中设置代理
2. **CORS 配置**：在服务端设置 CORS 头
3. **开发服务器配置**：确保开发服务器支持跨域请求