import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: localStorage.getItem('token') || '',
    role: localStorage.getItem('role') || '',
    isLoggedIn: !!localStorage.getItem('token')
  }),

  actions: {
    // 登录
    login(userData) {
      // 根据后端API文档，userData直接包含所需的字段
      this.userInfo = {
        id: userData.id,
        name: userData.name,
        username: userData.username
      }
      this.token = userData.token
      // 将数字角色转换为字符串便于前端使用
      // 根据需求，只有role为0时才代表管理员
      this.role = userData.role === 0 ? 'admin' : 'user'
      this.isLoggedIn = true

      // 持久化存储
      localStorage.setItem('token', userData.token)
      localStorage.setItem('role', this.role) // 存储转换后的字符串角色
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
    },

    // 登出
    logout() {
      this.userInfo = null
      this.token = ''
      this.role = ''
      this.isLoggedIn = false

      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('userInfo')
    },

    // 从本地存储恢复用户信息
    restoreUser() {
      const token = localStorage.getItem('token')
      const role = localStorage.getItem('role')
      const userInfoStr = localStorage.getItem('userInfo')

      if (token && role && userInfoStr) {
        this.token = token
        this.role = role
        this.userInfo = JSON.parse(userInfoStr)
        this.isLoggedIn = true
      }
    }
  },

  getters: {
    // 获取用户名
    getUserName: (state) => {
      return state.userInfo?.name || '用户'
    },

    // 判断是否为管理员
    isAdmin: (state) => {
      return state.role === 'admin'
    },

    // 判断是否为普通用户
    isUser: (state) => {
      return state.role === 'user'
    }
  }
})