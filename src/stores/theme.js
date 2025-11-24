import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: false,
    mode: 'auto',
    customColors: {},
    themeConfig: {
      transitionDuration: '0.3s',
      transitionTimingFunction: 'ease'
    }
  }),
  
  getters: {
    currentTheme: (state) => state.isDark ? 'dark' : 'light',
    
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
    initTheme() {
      const savedMode = localStorage.getItem('themeMode')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.mode = savedMode === 'light' || savedMode === 'dark' ? savedMode : 'auto'
      const shouldUseDark = this.mode === 'auto' ? prefersDark : this.mode === 'dark'
      this.applyTheme(shouldUseDark)
      this.applySavedColors()
      this.setupMediaQueryListener()
    },
    
    applyTheme(dark) {
      this.isDark = dark
      
      if (dark) {
        document.documentElement.setAttribute('data-theme', 'dark')
      } else {
        document.documentElement.setAttribute('data-theme', 'light')
      }
      
      if (this.mode !== 'auto') {
        localStorage.setItem('themeMode', dark ? 'dark' : 'light')
      }
      
      window.dispatchEvent(new CustomEvent('themeChanged', {
        detail: { isDark: dark }
      }))
    },
    
    toggleTheme() {
      this.mode = !this.isDark ? 'dark' : 'light'
      localStorage.setItem('themeMode', this.mode)
      this.applyTheme(this.mode === 'dark')
    },
    
    setupMediaQueryListener() {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e) => {
        if (this.mode === 'auto') {
          this.applyTheme(e.matches)
        }
      }
      
      mediaQuery.addEventListener('change', handleChange)
      
      this._mediaQueryListener = handleChange
    },
    
    updateConfig(newConfig) {
      this.themeConfig = { ...this.themeConfig, ...newConfig }
    },
    
    setCssVariable(name, value) {
      document.documentElement.style.setProperty(name, value)
    },
    
    resetTheme() {
      localStorage.removeItem('theme')
      localStorage.removeItem('themeMode')
      localStorage.removeItem('themeColors')
      this.customColors = {}
      Object.keys(this.getCssVars()).forEach(key => {
        if (document.documentElement.style.getPropertyValue(key)) {
          document.documentElement.style.setProperty(key, '')
        }
      })
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.mode = 'auto'
      this.applyTheme(prefersDark)
    },
    
    setMode(mode) {
      this.mode = mode
      localStorage.setItem('themeMode', mode)
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const shouldUseDark = mode === 'auto' ? prefersDark : mode === 'dark'
      this.applyTheme(shouldUseDark)
    },

    setThemeColors(colors) {
      this.customColors = { ...this.customColors, ...colors }
      Object.entries(colors).forEach(([k, v]) => {
        this.setCssVariable(k, v)
      })
      localStorage.setItem('themeColors', JSON.stringify(this.customColors))
    },

    clearCustomColors() {
      Object.keys(this.customColors).forEach(k => {
        document.documentElement.style.setProperty(k, '')
      })
      this.customColors = {}
      localStorage.removeItem('themeColors')
    },

    applySavedColors() {
      try {
        const saved = localStorage.getItem('themeColors')
        if (saved) {
          const obj = JSON.parse(saved)
          this.customColors = obj
          Object.entries(obj).forEach(([k, v]) => {
            this.setCssVariable(k, v)
          })
        }
      } catch {}
    },

    $dispose() {
      if (this._mediaQueryListener) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        mediaQuery.removeEventListener('change', this._mediaQueryListener)
      }
    }
  }
})

if (!window.toggleTheme) {
  window.toggleTheme = () => {
    const themeStore = useThemeStore()
    themeStore.toggleTheme()
  }
}