import { createPinia } from 'pinia'
import user from './user'
import aiConsult from './aiConsult'

// 创建pinia实例
const pinia = createPinia()

// 导出pinia实例
export default pinia

// 导出各个store模块
export { user, aiConsult }