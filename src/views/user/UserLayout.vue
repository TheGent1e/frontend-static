<template>
  <div class="user-layout">
    <!-- 顶部标题栏 -->
    <header class="user-header">
      <div class="header-left">
        <h1 class="platform-title">老年人健康服务平台</h1>
      </div>
      
      <div class="header-right">
        <span class="welcome-text">欢迎回来，{{ userStore.getUserName }}</span>
        <el-button 
          type="primary" 
          size="small" 
          @click="handleLogout"
          style="margin-left: 20px"
        >
          退出登录
        </el-button>
      </div>
    </header>
    
    <!-- 主内容区域 -->
    <main class="user-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../../store/user'

// 定义组件名称
const name = 'UserLayout'

// 路由相关
const router = useRouter()

// Store
const userStore = useUserStore()

// 生命周期钩子
onMounted(() => {
  // 恢复用户信息
  userStore.restoreUser()
})

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 清除登录状态
    userStore.logout()
    // 跳转到登录页
    router.push('/login')
    ElMessage.success('退出登录成功')
  }).catch(() => {
    // 取消退出
  })
}
</script>

<style scoped>
.user-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f8f9fa;
}

/* 顶部标题栏 */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background-color: #52c41a; /* 温暖柔和的绿色调 */
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.platform-title {
  font-size: 24px; /* 较大的字体，适合老年人 */
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.welcome-text {
  font-size: 16px;
  margin-right: 20px;
}

/* 主内容区域 */
.user-content {
  flex: 1;
  padding: 20px;
  background-color: #f8f9fa;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .user-header {
    padding: 10px 20px;
    flex-direction: column;
    text-align: center;
  }
  
  .platform-title {
    font-size: 20px;
    margin-bottom: 10px;
  }
  
  .header-right {
    flex-direction: column;
  }
  
  .welcome-text {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .user-content {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .platform-title {
    font-size: 18px;
  }
  
  .welcome-text {
    font-size: 14px;
  }
}
</style>