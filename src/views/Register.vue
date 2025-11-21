<template>
  <div class="register-container">
    <div class="register-form-wrapper">
      <div class="register-header">
        <h2>老年人健康服务平台</h2>
        <p>用户注册</p>
      </div>
      
      <el-form :model="registerForm" :rules="registerRules" ref="registerFormRef" class="register-form">
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username" class="register-form-item">
          <el-input 
            v-model="registerForm.username" 
            placeholder="请输入用户名（登录账号）"
            prefix-icon="el-icon-user" 
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 姓名 -->
        <el-form-item label="姓名" prop="name" class="register-form-item">
          <el-input 
            v-model="registerForm.name" 
            placeholder="请输入您的真实姓名"
            prefix-icon="el-icon-user-solid" 
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 密码 -->
        <el-form-item label="密码" prop="password" class="register-form-item">
          <el-input 
            v-model="registerForm.password" 
            type="password" 
            placeholder="请设置密码（至少6位）"
            prefix-icon="el-icon-lock" 
            show-password
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 确认密码 -->
        <el-form-item label="确认密码" prop="confirmPassword" class="register-form-item">
          <el-input 
            v-model="registerForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入密码"
            prefix-icon="el-icon-lock" 
            show-password
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 联系方式 -->
        <el-form-item label="手机号" prop="phone" class="register-form-item">
          <el-input 
            v-model="registerForm.phone" 
            placeholder="请输入手机号码"
            prefix-icon="el-icon-phone" 
            :disabled="loading"
          ></el-input>
        </el-form-item>
        
        <!-- 注册按钮 -->
        <el-form-item class="register-form-item register-button-group">
          <div class="button-container">
            <el-button 
              type="primary" 
              @click="handleRegister" 
              :loading="loading"
              class="register-btn"
            >
              注册
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
        
        <!-- 登录链接 -->
        <el-form-item class="register-form-item">
          <el-button type="text" @click="handleLogin" :disabled="loading">
            已有账号？立即登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <!-- 错误提示 -->
      <div v-if="errorMessage" class="error-message">
        <el-alert :title="errorMessage" type="error" show-icon :closable="false"></el-alert>
      </div>
      
      <!-- 成功提示 -->
      <div v-if="successMessage" class="success-message">
        <el-alert :title="successMessage" type="success" show-icon :closable="false"></el-alert>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
import api from '../api'

// 定义组件名称
const name = 'Register'

// 表单引用
const registerFormRef = ref(null)

// 响应式数据 - 注册表单
const registerForm = reactive({
  username: '',    // 用户名（登录账号）
  name: '',        // 真实姓名
  password: '',    // 密码
  confirmPassword: '', // 确认密码
  phone: ''        // 手机号码
})

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应在3-20个字符之间', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应在2-20个字符之间', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    { pattern: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 
      message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    // 自定义验证器，检查两次密码是否一致
    {
      validator: (rule, value, callback) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码格式', trigger: 'blur' }
  ]
}

// 状态变量
const loading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// 路由
const router = useRouter()

// 处理注册
const handleRegister = async () => {
  registerFormRef.value.validate(async (valid) => {
    if (valid) {
      // 使用ElLoading替代自定义loading状态，提供更好的用户体验
      const loadingInstance = ElLoading.service({
        lock: true,
        text: '注册中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      
      try {
        // 准备注册数据，确保与后端API文档兼容
        const registerData = {
          username: registerForm.username,
          password: registerForm.password,
          name: registerForm.name,
          phone: registerForm.phone
        }
        
        // 调用后端API进行注册
        const response = await api.user.register(registerData)
        
        if (response && response.code === 1) {
          ElMessage.success('注册成功！即将跳转到登录页面')
          // 注册成功后跳转到登录页面
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        } else {
          // 处理后端返回的错误信息
          const errorMsg = response?.msg || response?.message || '注册失败，请重试'
          ElMessage.error('注册失败：' + errorMsg)
        }
      } catch (error) {
        // 处理API调用错误
        console.error('注册请求失败:', error)
        if (error.response && error.response.data) {
          const errorMsg = error.response.data.msg || error.response.data.message || '注册失败，请重试'
          ElMessage.error('注册失败：' + errorMsg)
        } else {
          ElMessage.error('网络错误，请稍后重试')
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
  registerFormRef.value.resetFields()
  errorMessage.value = ''
  successMessage.value = ''
}

// 跳转到登录页面
const handleLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.register-form-wrapper {
  width: 100%;
  max-width: 450px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin: 0 auto;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;
}

.register-header h2 {
  color: #303133;
  margin-bottom: 10px;
}

.register-header p {
  color: #606266;
  font-size: 14px;
}

.register-form {
  width: 100%;
}

.register-form-item {
  margin-bottom: 20px;
}

.text-center {
  text-align: center;
}

/* 确保表单项标签居中 */
.register-form-item .el-form-item__label {
  text-align: center;
  display: block;
  margin-bottom: 10px;
}

.register-form {
  width: 100%;
  text-align: center;
}

/* 确保所有输入框有统一的宽度 */
.register-form-item .el-input {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* 调整表单项的内部布局 */
.register-form-item .el-form-item__content {
  display: flex;
  justify-content: center;
}

.register-button-group {
  margin-top: 30px;
}

.button-container {
  display: flex;
  gap: 15px;
  width: 100%;
}

.register-btn, .reset-btn {
  flex: 1;
  min-width: 0;
}

.register-btn {
  background-color: #409eff;
  border-color: #409eff;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  display: block;
}

.register-btn:hover {
  background-color: #66b1ff;
  border-color: #66b1ff;
}

.error-message,
.success-message {
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-form-wrapper {
    padding: 20px;
  }
}
</style>