import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    // 当前主题状态
    isDark: false,
    // 主题配置对象
    themeConfig: {
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease'
    }
  }),
  
  getters: {
    // 获取当前主题名称
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
    
    // 获取主题CSS变量（用于调试或特殊情况）
    getCssVars: () => {
      const vars = {}
      const style = window.getComputedStyle(document.documentElement)
      Array.from(style).forEach(key => {
        if (key.startsWith('--')) {
          vars[key] = style.getPropertyValue(key).trim()
        }
      })
      return vars
    }
  },
  
  actions: {
    // 初始化主题
    initTheme() {
      // 从本地存储读取主题偏好
      const savedTheme = localStorage.getItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      
      // 如果有保存的主题设置，则使用保存的设置，否则根据系统偏好
      const shouldUseDark = savedTheme ? savedTheme === 'dark' : prefersDark
      
      // 应用主题
      this.applyTheme(shouldUseDark)
      
      // 监听系统主题变化
      this.setupMediaQueryListener()
    },
    
    // 应用主题
    applyTheme(dark) {
      this.isDark = dark
      
      // 设置data-theme属性
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
      
      // 保存到本地存储
      localStorage.setItem('theme', dark ? 'dark' : 'light')
      
      // 触发自定义事件，通知应用各部分主题已变更
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { isDark: dark }
      }))
    },
    
    // 切换主题
    toggleTheme() {
      this.applyTheme(!this.isDark)
    },
    
    // 设置系统主题变化监听器
    setupMediaQueryListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        // 只在没有用户自定义设置时跟随系统变化
        if (!localStorage.getItem('theme')) {
          this.applyTheme(e.matches)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      // 保存监听器引用，以便在需要时移除
      this._mediaQueryListener = handleChange
    },
    
    // 更新主题配置
    updateConfig(newConfig) {
      this.themeConfig = { ...this.themeConfig, ...newConfig }
    },
    
    // 手动设置特定CSS变量（用于高级自定义）
    setCssVariable(name, value) {
      document.documentElement.style.setProperty(name, value)
    },
    
    // 重置为默认主题
    resetTheme() {
      localStorage.removeItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.applyTheme(prefersDark)
    },
    
    // 清理
    $dispose() {
      // 移除系统主题监听器
      if (this._mediaQueryListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.removeEventListener('change', this._mediaQueryListener)
      }
    }
  }
})

// 提供全局方法，保持向后兼容
if (!window.toggleTheme) {
  window.toggleTheme = () => {
    const themeStore = useThemeStore()
    themeStore.toggleTheme()
  }
}