import { useThemeStore } from '@/stores/theme'
import config from '@/theme/theme-config.json'

export function initTheme() {
  const store = useThemeStore()
  store.initTheme()
  if (!localStorage.getItem('themeMode') && config.mode) {
    store.setMode(config.mode)
  }
  if (!localStorage.getItem('themeColors') && config.colors) {
    store.setThemeColors(config.colors)
  }
}

export function setMode(mode) {
  const store = useThemeStore()
  store.setMode(mode)
}

export function toggleMode() {
  const store = useThemeStore()
  store.toggleTheme()
}

export function setThemeColors(colors) {
  const store = useThemeStore()
  store.setThemeColors(colors)
}

export function setPrimaryColor(color) {
  setThemeColors({ '--primary-color': color })
}

export function getCurrentTheme() {
  const store = useThemeStore()
  return store.currentTheme
}

export function getCssVars() {
  const store = useThemeStore()
  return store.getCssVars
}