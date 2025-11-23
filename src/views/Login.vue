<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2>老年人健康服务平台</h2>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <!-- 用户名/账号 -->
        <el-form-item label="账号" prop="username" class="login-form-item" >
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账号"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 密码 -->
        <el-form-item label="密码" prop="password" class="login-form-item">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            show-password
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
          <!-- 记住密码 -->
        <el-form-item class="login-form-item remember-password text-center">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
          <br>
          <el-button type="text" @click="handleForgotPassword" :disabled="loading">忘记密码？</el-button>
        </el-form-item>
        
        <!-- 重置按钮 -->
        <el-form-item class="login-form-item login-button-group">
          <div class="button-container">
            <el-button 
              type="primary" 
              @click="handleLogin" 
              :loading="loading"
              class="login-btn"
            >
              登录
            </el-button>
            <el-button 
              @click="handleReset" 
              :disabled="loading"
              class="reset-btn"
            >
              重置
            </el-button>
          </div>
        </el-form-item>
        
        <!-- 注册按钮 -->
        <el-form-item class="login-form-item">
          <el-button type="text" @click="handleRegister" :disabled="loading">
            还没有账号？立即注册
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" show-icon :closable="false"></el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import { useUserStore } from '../store/user'
import api from '../api'

// 定义组件名称
const name = 'Login'

// 表单引用
const loginFormRef = ref(null)

// 响应式数据
const loginForm = reactive({
  username: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = {
  username: [
    { required: true, message: '请输入账号信息', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

// 其他状态
const loading = ref(false)
const errorMessage = ref('')

// 路由和store
const router = useRouter()

// 生命周期钩子
onMounted(() => {
  // 检查是否有记住的密码
  checkRememberedPassword()
})

// 处理登录
const handleLogin = async () => {
  loginFormRef.value.validate(async (valid) => {
    if (valid) {
      // 使用ElLoading替代自定义loading状态，提供更好的用户体验
      const loadingInstance = ElLoading.service({
        lock: true,
        text: '登录中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      errorMessage.value = ''
      
      try {
        // 调用登录API，确保与更新后的API调用方式一致
        const response = await api.user.login(loginForm)
        
        if (response && response.code === 1) {
          // 登录成功，保存用户信息到store
          const userStore = useUserStore()
          console.log('登录响应数据:', response.data)
          console.log('token是否存在于响应中:', response.data.token ? '是' : '否')
          
          userStore.login(response.data)
          
          // 将完整的用户信息存储到localStorage，确保包含所有字段
          localStorage.setItem('userInfo', JSON.stringify(response.data))
          console.log('userInfo已存储到localStorage')
          
          // 特别确保token单独存储
          localStorage.setItem('token', response.data.token)
          console.log('token已单独存储到localStorage:', response.data.token)
          // 与userStore保持一致，将数字角色转换为字符串格式
          const roleString = response.data.role === 0 ? 'admin' : 'user'
          localStorage.setItem('role', roleString)
          localStorage.setItem('userId', response.data.user?.id || '')
          
          // 验证token是否成功存储
          const storedToken = localStorage.getItem('token')
          console.log('验证token存储结果:', storedToken ? '成功' : '失败')
          
          if (loginForm.rememberMe) {
            rememberPassword()
          } else {
            clearRememberedPassword()
          }
          
          ElMessage.success('登录成功')
          
          // 根据store中转换后的角色跳转到对应的首页
          if (userStore.role === 'admin') {
            router.push('/admin/home')
          } else {
            router.push('/user/home')
          }
        } else {
          // 处理后端返回的错误信息 - 更友好的错误提示
          ElMessage.error('登录失败：' + (response?.msg || response?.message || '用户名或密码错误'))
        }
      } catch (error) {
        // 尝试从error.response中获取后端返回的错误信息
        console.error('登录请求失败:', error)
        if (error.response && error.response.data) {
          ElMessage.error('登录失败：' + (error.response.data.msg || error.response.data.message || '用户名或密码错误'))
        } else {
          ElMessage.error('登录失败：用户名或密码错误')
        }
      } finally {
        // 确保始终关闭loading
        setTimeout(() => {
          loadingInstance.close()
        }, 300)
        // 重置组件内部的loading状态
        loading.value = false
      }
    }
  })
}

// 重置表单
const handleReset = () => {
  loginFormRef.value.resetFields()
  errorMessage.value = ''
}

// 忘记密码
const handleForgotPassword = () => {
  ElMessage('密码重置功能开发中')
}

// 注册
const handleRegister = () => {
  // 跳转到注册页面
  router.push('/register')
}

// 记住密码
const rememberPassword = () => {
  localStorage.setItem('remembered_username', loginForm.username)
  // 注意：在实际项目中，密码不应该明文存储，这里为了演示简化处理
}

// 检查记住的密码
const checkRememberedPassword = () => {
  const username = localStorage.getItem('remembered_username')
  
  if (username) {
    loginForm.username = username
    loginForm.rememberMe = true
  }
}

// 清除记住的密码
const clearRememberedPassword = () => {
  localStorage.removeItem('remembered_username')
}
</script>

<style scoped>
/* 全局样式重置 */
:deep(html),
:deep(body) {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

/* 主题配色变量 - 科技感风格 */
/* 直接在组件中定义CSS变量，不使用:root选择器 */
.login-container {
  /* 主色调 */
  --primary-color: #2db7f5;
  --primary-dark: #20a0ff;
  --primary-light: #409eff;
  
  /* 背景色 */
  --bg-primary: #0f1a30;
  --bg-secondary: #1a2a4a;
  --bg-tertiary: #1e3a68;
  
  /* 文字颜色 */
  --text-primary: #1a1a2e;
  --text-secondary: #6c757d;
  --text-muted: #888;
  
  /* 边框颜色 */
  --border-color: #dcdfe6;
  --border-hover: var(--primary-color);
  
  /* 表单元素颜色 */
  --input-bg: rgba(255, 255, 255, 0.9);
  --input-border: #dcdfe6;
  --input-focus: var(--primary-color);
  
  /* 按钮颜色 */
  --btn-primary: var(--primary-color);
  --btn-primary-hover: var(--primary-dark);
  --btn-primary-text: #ffffff;
  --btn-secondary: transparent;
  --btn-secondary-hover: #f0f0f0;
  --btn-secondary-text: var(--text-secondary);
  
  /* 装饰光效 */
  --glow-primary: rgba(34, 193, 195, 0.1);
  --glow-secondary: rgba(153, 102, 255, 0.1);
  
  /* 容器样式 */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  margin: 0;
  padding: 20px;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

/* 科技感网格背景 */
.login-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(var(--glow-primary) 1px, transparent 1px),
    linear-gradient(90deg, var(--glow-primary) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
  animation: gridMove 60s linear infinite;
}

/* 发光粒子效果 */
.login-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle, rgba(34, 193, 195, 0.3) 1px, transparent 1px),
    radial-gradient(circle, var(--glow-secondary) 1px, transparent 1px);
  background-size: 100px 100px;
  background-position: 0 0, 50px 50px;
  z-index: 1;
  animation: particleFloat 20s ease-in-out infinite;
}

/* 网格移动动画 */
@keyframes gridMove {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 300px 300px;
  }
}

/* 粒子浮动动画 */
@keyframes particleFloat {
  0%, 100% {
    background-position: 0 0, 50px 50px;
    opacity: 0.4;
  }
  50% {
    background-position: 100px 100px, 0 0;
    opacity: 0.6;
  }
}

/* 滑动入场动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 淡入上移动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px) translateX(-50%);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(-50%);
  }
}

/* 表单元素入场动画 */
.login-form-item {
  animation: slideUp 0.5s ease-out;
  animation-fill-mode: both;
  opacity: 0;
}

.login-form-item:nth-child(1) {
  animation-delay: 0.2s;
}

.login-form-item:nth-child(2) {
  animation-delay: 0.3s;
}

.login-form-item:nth-child(3) {
  animation-delay: 0.4s;
}

.login-form-item:nth-child(4) {
  animation-delay: 0.5s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 错误提示动画 */
:deep(.el-form-item__error) {
  animation: shake 0.3s ease-in-out;
}

@keyframes shake {
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-3px);
  }
  75% {
    transform: translateX(3px);
  }
}

.login-form-wrapper {
  width: 100%;
  max-width: 450px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  padding: 40px;
  margin: 0 auto;
  position: relative;
  z-index: 10;
  overflow: hidden;
}

/* 表单容器装饰光效 */
.login-form-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--glow-primary), var(--glow-secondary));
  border-radius: 50%;
  transform: translate(50%, -50%);
  z-index: -1;
}

.login-form-wrapper::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 150px;
  height: 150px;
  background: linear-gradient(135deg, var(--glow-secondary), var(--glow-primary));
  border-radius: 50%;
  transform: translate(-50%, 50%);
  z-index: -1;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
  position: relative;
  animation: slideDown 0.5s ease-out;
}

.login-header h2 {
  color: var(--text-primary);
  margin-bottom: 12px;
  font-size: 28px;
  font-weight: 600;
  letter-spacing: 0.5px;
  position: relative;
  display: inline-block;
}

.login-header h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-light), var(--btn-primary));
  border-radius: 3px;
  opacity: 0;
  animation: fadeInUp 0.5s ease 0.3s forwards;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 15px;
  opacity: 0;
  animation: fadeInUp 0.5s ease 0.5s forwards;
}

.login-form {
  width: 100%;
}

.login-form-item {
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
}

/* 最高优先级 label 样式：多层类叠加 + !important 全覆盖（替换原有label样式） */
.login-form .login-form-item.el-form-item .el-form-item__label {
  /* 基础布局优先级 */
  display: block !important;
  width: 100% !important;
  max-width: 360px !important;
  margin: 0 0 10px !important; /* 上下间距+水平居中 */
  padding: 0 !important; /* 清除默认内边距 */
  
  /* 文本样式优先级 */
  text-align: center !important;
  color: var(--text-secondary) !important;
  font-size: 16px !important;
  font-weight: 500 !important;
  line-height: 24px !important; /* 行高也加 !important 防止覆盖 */
  
  /* 额外提升优先级：强制继承/覆盖 */
  box-sizing: border-box !important;
  background: transparent !important; /* 清除可能的背景干扰 */
  height: auto !important;
  flex: none !important;
  align-items: center !important;
}

/* 针对 Element Plus 原生样式的深度穿透增强（确保万无一失） */
:deep(.login-form .login-form-item.el-form-item .el-form-item__label) {
  display: block;
  text-align: center ;
  margin-top: 10px ;
  width: 100%t;
  max-width: 60px ;
  color: var(--text-secondary) ;
  font-size: 16px ;
  font-weight: 500 ;
  line-height: 24px ;
  padding: 0 ;
  height: auto ;
  flex: none ;
  align-items: center ;
}

.login-form {
  width: 100%;
  text-align: center;
}

/* 优化输入框样式 */
.login-form-item .el-input {
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

/* Element Plus 输入框深度样式定制 */
:deep(.el-input__wrapper) {
  border-radius: 8px !important;
  transition: all 0.3s ease;
  background-color: var(--input-bg) !important;
  border: 1px solid var(--input-border) !important;
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--primary-light) !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

:deep(.el-input__wrapper.is-focus) {
  border-color: var(--input-focus) !important;
  box-shadow: 0 0 0 2px rgba(45, 183, 245, 0.2) !important;
  transform: translateY(-1px);
}

/* 输入框输入时的微动画 */
:deep(.el-input__wrapper) {
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}

/* 输入内容时的反馈 */
:deep(.el-input__wrapper input:not(:placeholder-shown)) {
  font-weight: 500;
}

:deep(.el-input__inner) {
  color: var(--text-primary) !important;
  font-size: 16px;
  padding: 14px 15px !important;
  height: 48px !important;
  line-height: 24px !important;
}

/* 调整表单项的内部布局 */
.login-form-item .el-form-item__content {
  display: flex;
  justify-content: center;
}

/* 记住密码区域样式优化 */
.remember-password {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  margin-bottom: 25px;
  padding: 0 20px;
}

.remember-password .el-checkbox {
  margin-right: 0;
  font-size: 16px;
  display: flex;
  align-items: center;
}

:deep(.el-checkbox__label) {
  color: var(--text-secondary) !important;
  font-size: 16px !important;
  display: inline-block;
  vertical-align: middle;
  margin: auto 1px;
}

/* 忘记密码文本按钮样式 */
.remember-password .el-button--text {
  font-size: 16px !important;
  color: rgb(36, 167, 252) !important;
  height: auto !important;
  line-height: 24px !important;
  display: inline-block;
  vertical-align: middle;
  margin-top: 3px;
  margin-left: 40px;
}

.remember-password .el-button--text:hover {
  color: var(--primary-color) !important;
}

:deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
  background-color: var(--btn-primary) !important;
  border-color: var(--btn-primary) !important;
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

:deep(.el-checkbox__input .el-checkbox__inner) {
  transition: all 0.3s ease;
}

:deep(.el-checkbox__input:hover .el-checkbox__inner) {
  border-color: var(--primary-light) !important;
}

/* 忘记密码链接样式 */
:deep(.el-button--text) {
  color: var(--btn-primary) !important;
  font-size: 16px;
}

:deep(.el-button--text:hover) {
  color: var(--primary-light) !important;
}

/* 按钮组样式优化 */
.login-button-group {
  margin-top: 25px;
}

.button-container {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
}

/* 主要按钮样式 */
.login-btn {
  flex: 1;
  background: linear-gradient(135deg, var(--btn-primary), var(--primary-light)) !important;
  border: none !important;
  border-radius: 8px !important;
  color: var(--btn-primary-text) !important;
  font-weight: 500 !important;
  font-size: 17px !important;
  padding: 14px 24px !important;
  height: 48px !important;
  transition: all 0.3s ease !important;
  position: relative;
  overflow: hidden;
  will-change: transform, box-shadow;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.5s, height 0.5s;
}

.login-btn:active::before {
  width: 300px;
  height: 300px;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(45, 183, 245, 0.4) !important;
  background: linear-gradient(135deg, var(--btn-primary-hover), var(--btn-primary)) !important;
}

.login-btn:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
}

/* 按钮加载状态 */
.login-btn.loading {
  pointer-events: none;
  opacity: 0.8;
}

/* 重置按钮样式 */
.reset-btn {
  flex: 1;
  background-color: var(--btn-secondary) !important;
  border: 1px solid var(--border-color) !important;
  border-radius: 8px !important;
  color: var(--btn-secondary-text) !important;
  font-weight: 500 !important;
  font-size: 17px !important;
  padding: 14px 24px !important;
  height: 48px !important;
  transition: all 0.3s ease !important;
}

.reset-btn:hover {
  border-color: var(--border-hover) !important;
  background-color: var(--btn-secondary-hover) !important;
  color: var(--primary-light) !important;
}

/* 错误提示样式优化 */
.error-message {
  margin-top: 25px;
  max-width: 360px;
  margin-left: auto;
  margin-right: auto;
}

/* 响应式设计 - 平板设备 */
@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 30px 25px;
    margin: 0 15px;
    max-width: none;
  }
  
  .login-header h2 {
    font-size: 24px;
  }
  
  .login-form-item .el-input {
    max-width: 100%;
  }
  
  .button-container {
    max-width: 100%;
  }
  
  /* 缩小网格背景 */
  .login-container::before {
    background-size: 20px 20px;
  }
}

/* 响应式设计 - 手机设备横屏 */
@media (max-width: 640px) {
  .login-container {
    padding: 15px;
  }
  
  .login-form-wrapper {
    padding: 25px 20px;
    border-radius: 10px;
  }
  
  .login-header {
    margin-bottom: 30px;
  }
  
  .login-header h2 {
    font-size: 22px;
  }
  
  .login-header p {
    font-size: 14px;
  }
  
  .login-form-item {
    margin-bottom: 18px;
  }
  
  .remember-password {
    gap: 20px;
    padding: 0 10px;
    margin-bottom: 20px;
  }
  
  .login-button-group {
    margin-top: 30px;
  }
  
  .button-container {
    gap: 15px;
  }
}

/* 响应式设计 - 手机设备竖屏 */
@media (max-width: 480px) {
  .login-container {
    padding: 10px;
  }
  
  .login-form-wrapper {
    padding: 20px 15px;
    margin: 0 10px;
  }
  
  .login-header h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  .login-header p {
    font-size: 13px;
  }
  
  /* 输入框调整 */
  :deep(.el-input__inner) {
    font-size: 13px;
    padding: 10px 12px !important;
    height: 40px !important;
  }
  
  /* 按钮调整 */
  .login-btn,
  .reset-btn {
    font-size: 14px !important;
    height: 42px !important;
  }
  
  /* 记住密码区域垂直排列 */
  .remember-password {
    flex-direction: column;
    gap: 10px;
    align-items: center;
  }
  
  /* 隐藏装饰性光效 */
  .login-form-wrapper::before,
  .login-form-wrapper::after {
    display: none;
  }
  
  /* 简化背景动画 */
  .login-container::after {
    animation-duration: 30s;
  }
}

/* 响应式设计 - 小屏手机 */
@media (max-width: 360px) {
  .login-form-wrapper {
    padding: 15px 12px;
    margin: 0 8px;
  }
  
  .login-header h2 {
    font-size: 18px;
  }
  
  .button-container {
    flex-direction: column;
    gap: 12px;
  }
  
  .login-btn,
  .reset-btn {
    width: 100%;
  }
  
  /* 关闭网格背景以提升性能 */
  .login-container::before {
    display: none;
  }
}
</style>