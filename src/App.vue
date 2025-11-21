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
/* CSS变量定义 - 主题颜色和尺寸 */
:root {
  /* 主色调 */
  --primary-color: #409eff;
  --success-color: #67c23a;
  --warning-color: #e6a23c;
  --danger-color: #f56c6c;
  --info-color: #909399;
  
  /* 文字颜色 */
  --text-primary: #303133;
  --text-regular: #606266;
  --text-secondary: #909399;
  --text-placeholder: #c0c4cc;
  
  /* 边框颜色 */
  --border-base: #dcdfe6;
  --border-light: #e4e7ed;
  --border-lighter: #ebeef5;
  --border-extra-light: #f2f6fc;
  
  /* 背景颜色 */
  --bg-color: #f5f7fa;
  --bg-color-light: #ffffff;
  --bg-color-page: #f2f3f5;
  
  /* 尺寸变量 */
  --header-height: 60px;
  --sidebar-width: 240px;
  --content-width: calc(100% - var(--sidebar-width));
  
  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* 圆角 */
  --border-radius-base: 4px;
  --border-radius-small: 2px;
  --border-radius-round: 20px;
  --border-radius-circle: 50%;
  
  /* 阴影 */
  --shadow-base: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  --shadow-light: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  --shadow-elevated: 0 4px 20px rgba(0, 0, 0, 0.15);
}

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
  color: var(--text-primary); /* 主文本颜色 */
  background-color: var(--bg-color-page); /* 页面背景色 */
  font-size: 14px; /* 基础字体大小 */
  line-height: 1.5; /* 行高 */
  transition: background-color 0.3s ease; /* 背景色过渡效果 */
}

/* 应用容器样式 */
.app-container {
  min-height: 100vh; /* 确保容器至少占满整个视口高度 */
  background-color: var(--bg-color);
  padding-top: var(--header-height); /* 为固定头部留出空间 */
}

/* 通用卡片样式 */
.card {
  background: var(--bg-color-light);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-base);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  transition: all 0.3s ease;
}

.card:hover {
  box-shadow: var(--shadow-light);
  transform: translateY(-2px);
}

/* 通用按钮容器 */
.btn-group {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.btn-group-right {
  justify-content: flex-end;
}

/* 通用表单样式 */
.form-item {
  margin-bottom: var(--spacing-md);
}

.form-label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
  font-weight: 500;
}

/* 响应式工具类 */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 响应式网格系统 */
.row {
  display: flex;
  flex-wrap: wrap;
  margin: 0 calc(-1 * var(--spacing-sm));
}

.col {
  flex: 1;
  padding: 0 var(--spacing-sm);
}

.col-6 {
  flex: 0 0 50%;
  max-width: 50%;
  padding: 0 var(--spacing-sm);
}

.col-4 {
  flex: 0 0 33.3333%;
  max-width: 33.3333%;
  padding: 0 var(--spacing-sm);
}

.col-3 {
  flex: 0 0 25%;
  max-width: 25%;
  padding: 0 var(--spacing-sm);
}

/* 响应式设计 - 适配不同屏幕尺寸 */
/* 大屏（桌面） */
@media (min-width: 1200px) {
  .container {
    padding: 0 var(--spacing-lg);
  }
}

/* 中屏（平板横屏） */
@media (max-width: 1199px) and (min-width: 992px) {
  :root {
    --sidebar-width: 200px;
  }
  
  .col-3 {
    flex: 0 0 33.3333%;
    max-width: 33.3333%;
  }
}

/* 小屏（平板竖屏） */
@media (max-width: 991px) and (min-width: 768px) {
  :root {
    --sidebar-width: 180px;
    --header-height: 56px;
  }
  
  .app-container {
    font-size: 13px;
  }
  
  .col-4,
  .col-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
  
  .col-3 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* 超小屏（手机） */
@media (max-width: 767px) {
  :root {
    --header-height: 50px;
    --spacing-lg: 16px;
    --spacing-md: 12px;
    --spacing-sm: 6px;
  }
  
  body {
    font-size: 12px;
  }
  
  .app-container {
    padding-top: var(--header-height);
  }
  
  .card {
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
  }
  
  .btn-group {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .col,
  .col-3,
  .col-4,
  .col-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
  
  /* 表格在移动端的特殊处理 */
  .table-responsive {
    overflow-x: auto;
  }
  
  /* 对话框在移动端全屏显示 */
  .dialog-mobile-fullscreen {
    width: 95% !important;
    max-width: none !important;
  }
}

/* 导航栏响应式 */
@media (max-width: 767px) {
  .nav-menu {
    position: fixed;
    top: var(--header-height);
    left: 0;
    right: 0;
    background: var(--bg-color-light);
    box-shadow: var(--shadow-base);
    z-index: 100;
    transform: translateY(-150%);
    transition: transform 0.3s ease;
  }
  
  .nav-menu.active {
    transform: translateY(0);
  }
}

/* 通用过渡动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* 滚动条样式优化 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--border-lighter);
  border-radius: var(--border-radius-small);
}

::-webkit-scrollbar-thumb {
  background: var(--text-secondary);
  border-radius: var(--border-radius-small);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-regular);
}

/* 加载状态样式 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* 错误信息样式 */
.error-message {
  color: var(--danger-color);
  font-size: 12px;
  margin-top: 4px;
}
</style>
