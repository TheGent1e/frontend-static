// 导入Vue的核心函数 - 创建应用实例
import { createApp } from 'vue'
// 导入Pinia状态管理库
import { createPinia } from 'pinia'
// 导入Element Plus UI组件库
import ElementPlus from 'element-plus'

// 导入Element Plus中文语言包
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 导入Element Plus的全局样式
import 'element-plus/dist/index.css'
// 导入根组件
import App from './App.vue'
// 导入路由配置
import router from './router'

// 创建Vue应用实例
const app = createApp(App)
// 创建Pinia实例用于状态管理
const pinia = createPinia()

// 注册Pinia状态管理
app.use(pinia)
// 注册路由
app.use(router)
// 注册Element Plus组件库并配置中文语言
app.use(ElementPlus, {
  // 配置中文语言包
  locale: zhCn,
});

// 将应用挂载到HTML中的#app元素
app.mount('#app')
