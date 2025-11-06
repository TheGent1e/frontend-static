<template>
  <!-- 应用主容器 -->
  <div class="app-container">
    <!-- 路由视图 - 显示当前路由对应的组件 -->
    <router-view />
  </div>
</template>

<script setup>
// 使用Vue 3的组合式API (Composition API)
// 定义组件名称
const name = 'App'
</script>

<style>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 盒模型设置为border-box，便于布局计算 */
}

/* 全局字体和样式设置 */
body {
  /* 使用系统默认字体栈，确保在不同设备上显示良好 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  /* 优化字体渲染，使字体更加平滑 */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333; /* 主文本颜色 */
  background-color: #f5f5f5; /* 页面背景色 */
}

/* 应用容器样式 */
.app-container {
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
  background-color: #f5f5f5;
}

/* 响应式全局样式 - 适配小屏幕设备 */
@media (max-width: 768px) {
  body {
    font-size: 14px; /* 在小屏幕上减小字体大小，提高可读性 */
  }
}
</style>
