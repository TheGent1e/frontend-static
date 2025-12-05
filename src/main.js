import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/styles/theme.css'
import './theme/theme-colors.scss'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// 拦截并过滤控制台日志
const originalLog = console.log
const originalError = console.error
const originalWarn = console.warn
const originalInfo = console.info

// 定义过滤函数
const filterLogs = (...args) => {
  // 检查是否包含内存地址格式的日志（如 [0xc003efcb00 0xc003efcb30]）
  const containsMemoryAddress = args.some(arg => {
    if (typeof arg === 'string') {
      return /\[0x[a-f0-9]{10} 0x[a-f0-9]{10}\]/.test(arg)
    }
    return false
  })
  
  // 如果不包含内存地址，则正常输出
  if (!containsMemoryAddress) {
    return true
  }
  return false
}

// 重写控制台方法
console.log = (...args) => {
  if (filterLogs(...args)) {
    originalLog.apply(console, args)
  }
}

console.error = (...args) => {
  if (filterLogs(...args)) {
    originalError.apply(console, args)
  }
}

console.warn = (...args) => {
  if (filterLogs(...args)) {
    originalWarn.apply(console, args)
  }
}

console.info = (...args) => {
  if (filterLogs(...args)) {
    originalInfo.apply(console, args)
  }
}

// 清除初始日志
console.clear()

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')