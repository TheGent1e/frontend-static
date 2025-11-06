import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null,
    token: sessionStorage.getItem('token') || '',
    role: sessionStorage.getItem('role') || '',
    isLoggedIn: false
  }),

  actions: {
    // 登录
    login(userData) {
      this.userInfo = userData.userInfo
      this.token = userData.token
      this.role = userData.userInfo.role
      this.isLoggedIn = true

      // 保存到sessionStorage
      sessionStorage.setItem('token', userData.token)
      sessionStorage.setItem('userInfo', JSON.stringify(userData.userInfo))
      sessionStorage.setItem('role', userData.userInfo.role)
    },

    // 登出
    logout() {
      this.userInfo = null
      this.token = ''
      this.role = ''
      this.isLoggedIn = false

      // 清除sessionStorage
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('userInfo')
      sessionStorage.removeItem('role')
    },

    // 恢复用户信息
    restoreUser() {
      const token = sessionStorage.getItem('token')
      const userInfo = sessionStorage.getItem('userInfo')
      const role = sessionStorage.getItem('role')

      if (token && userInfo && role) {
        this.token = token
        this.userInfo = JSON.parse(userInfo)
        this.role = role
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