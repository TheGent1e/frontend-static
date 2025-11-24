<template>
  <div class="theme-toggle-container">
    <el-button
      class="theme-toggle-btn"
      type="default"
      :icon="isDark ? 'el-icon-sunny' : 'el-icon-moon'"
      @click="toggleTheme"
      :title="isDark ? '切换到浅色模式' : '切换到深色模式'"
      circle
      size="small"
    />
    <el-select v-model="mode" size="small" class="theme-mode-select">
      <el-option label="自动" value="auto" />
      <el-option label="浅色" value="light" />
      <el-option label="深色" value="dark" />
    </el-select>
    <el-color-picker v-model="primaryColor" size="small" class="theme-color-picker" />
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useThemeStore } from '@/stores/theme'

// 获取主题store实例
const themeStore = useThemeStore()

// 计算属性：当前是否为深色主题
const isDark = computed(() => themeStore.isDark)

// 切换主题
const toggleTheme = () => {
  themeStore.toggleTheme()
}

// 监听存储变化（在其他标签页切换主题时）
const handleStorageChange = (e) => {
  if (e.key === 'theme') {
    const newTheme = e.newValue
    if (newTheme === 'dark' || newTheme === 'light') {
      themeStore.applyTheme(newTheme === 'dark')
    }
  }
}

// 监听主题变化事件
const handleThemeChanged = () => {
  // 这里可以添加主题变化时的额外逻辑
}

onMounted(() => {
  window.addEventListener('storage', handleStorageChange)
  window.addEventListener('themeChanged', handleThemeChanged)
})

onUnmounted(() => {
  window.removeEventListener('storage', handleStorageChange)
  window.removeEventListener('themeChanged', handleThemeChanged)
})

const mode = ref(themeStore.mode)
watch(mode, (m) => {
  themeStore.setMode(m)
})

const readPrimary = () => {
  const s = window.getComputedStyle(document.documentElement)
  const v = s.getPropertyValue('--primary-color').trim()
  return v || '#4CAF50'
}

const primaryColor = ref(readPrimary())
watch(primaryColor, (c) => {
  themeStore.setThemeColors({ '--primary-color': c })
})
</script>

<style scoped>
/* 按钮容器 - 确保居中显示 */
.theme-toggle-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

/* 主题切换按钮样式 - 增强辨识度 */
.theme-toggle-btn {
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: var(--text-primary);
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  opacity: 0.9;
}

.theme-mode-select {
  width: 96px;
}

.theme-color-picker {
  --el-color-picker-size: 24px;
}

/* 悬停状态 - 增强交互反馈 */
.theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.3);
  color: var(--primary-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  opacity: 1;
  transform: translateY(-1px);
}

/* 点击状态 - 提供即时反馈 */
.theme-toggle-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* 深色模式适配 */
[data-theme="dark"] .theme-toggle-btn {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--text-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .theme-toggle-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* 图标样式 - 增强视觉效果 */
.theme-toggle-btn .el-icon {
  font-size: 18px;
  font-weight: 600;
  transition: transform 0.2s ease;
}

.theme-toggle-btn:hover .el-icon {
  transform: rotate(10deg);
}

/* 响应式设计 - 确保在不同屏幕尺寸下都有良好表现 */
@media (max-width: 768px) {
  .theme-toggle-btn {
    min-width: 32px;
    height: 32px;
  }
  
  .theme-toggle-btn .el-icon {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .theme-toggle-btn {
    min-width: 28px;
    height: 28px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  }
  
  .theme-toggle-btn .el-icon {
    font-size: 14px;
  }
}
</style>