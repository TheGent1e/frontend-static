<template>
  <div class="login-container">
    <div class="login-form-wrapper">
      <div class="login-header">
        <h2>老年人健康服务平台</h2>
        <p>系统登录</p>
      </div>
      
      <el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
        <!-- 用户名/账号 -->
        <el-form-item label="账号" prop="username" class="login-form-item">
          <el-input 
            v-model="loginForm.username" 
            placeholder="请输入账号"
            prefix-icon="el-icon-user"
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 密码 -->
        <el-form-item label="密码" prop="password" class="login-form-item">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
          <!-- 记住密码 -->
        <el-form-item class="login-form-item remember-password text-center">
          <el-checkbox v-model="loginForm.rememberMe">记住密码</el-checkbox>
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
import { ElMessage } from 'element-plus'
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
      loading.value = true
      errorMessage.value = ''
      
      try {
        // 调用登录API，不再传递role参数，使用后端返回的role值
        const response = await api.user.login(loginForm)
        
        if (response && response.code === 1) {
          // 登录成功，保存用户信息到store
          const userStore = useUserStore()
          userStore.login(response.data)
          
          // 将token单独存储到sessionStorage
          sessionStorage.setItem('token', response.data.token)
          
          
          // 如果用户选择记住密码，只存储用户名，不存储密码或token等敏感信息
          if (loginForm.rememberMe) {
            rememberPassword()
          } else {
            clearRememberedPassword()
          }
          
          // 根据store中转换后的角色跳转到对应的首页
          if (userStore.role === 'admin') {
            router.push('/admin/home')
          } else {
            router.push('/user/home')
          }
        } else {
          // 处理后端返回的错误信息
          errorMessage.value = response.msg || response.message || '用户名或密码错误'
        }
      } catch (error) {
        // 尝试从error.response中获取后端返回的错误信息
        if (error.response && error.response.data) {
          errorMessage.value = error.response.data.msg || error.response.data.message || '用户名或密码错误'
        } else {
          errorMessage.value = '用户名或密码错误'
        }
      } finally {
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
  ElMessage('注册功能开发中')
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
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-form-wrapper {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 0 auto;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #303133;
  margin-bottom: 10px;
}

.login-header p {
  color: #606266;
  font-size: 14px;
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

/* 确保表单项标签居中 */
.login-form-item .el-form-item__label {
  text-align: center;
  display: block;
  margin-bottom: 10px;
}

.login-form {
  width: 100%;
  text-align: center;
}

/* 确保所有输入框和选择框有统一的宽度 */
.login-form-item .el-input,
.login-form-item .el-select {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* 调整表单项的内部布局 */
.login-form-item .el-form-item__content {
  display: flex;
  justify-content: center;
}

.remember-password {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.remember-password .el-checkbox {
  margin-right: 0;
}

.login-button-group {
  margin-top: 30px;
}

.button-container {
  display: flex;
  gap: 15px;
  width: 100%;
}

.login-btn,
.reset-btn {
  flex: 1;
  min-width: 0;
}

.login-btn {
  background-color: #409eff;
  border-color: #409eff;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
}

.login-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.error-message {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-form-wrapper {
    padding: 20px;
  }
}
</style>