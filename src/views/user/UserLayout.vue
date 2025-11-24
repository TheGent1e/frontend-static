<template>
  <div class="user-layout">
    <!-- 顶部标题栏 -->
    <header class="user-header">
      <div class="header-left">
        <h1 class="platform-title">老年人健康服务平台</h1>
      </div>
      
      <!-- ThemeToggle按钮精确定位至header容器的垂直和水平居中位置 -->
      <ThemeToggle class="theme-toggle-centered" />
      
      <div class="header-right">
      <div class="welcome-text">欢迎，{{ username }}</div>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import ThemeToggle from '@/components/ThemeToggle.vue'

// 定义组件名称
const name = 'UserLayout'

// 路由相关
const router = useRouter()

// 使用模拟数据代替user store
const username = ref('用户')

// 处理退出登录
const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    // 移除本地存储中的用户信息
    localStorage.removeItem('userInfo')
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
  background-color: #0c0a0a;

}

/* 顶部标题栏 */
.user-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.95));
  color: var(--text-primary);
  border-bottom: 1px solid var(--primary-color);
  backdrop-filter: blur(8px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  position: relative; /* 为子元素的绝对定位提供参考 */
  transition: background-color 0.3s ease, border-color 0.3s ease;
}

/* 深色模式下的header背景 */
[data-theme="dark"] .user-header {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  color: white;
  border-bottom: 1px solid var(--primary-light);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

/* ThemeToggle按钮精确定位至header容器的垂直和水平居中 */
.theme-toggle-centered {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10; /* 确保按钮在其他元素之上 */
}

.platform-title {
  font-size: 24px; /* 较大的字体，适合老年人 */
  font-weight: bold;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.welcome-text {
  font-size: 16px;
  color: var(--text-primary);
  /* 使用CSS变量确保在浅色模式下有良好对比度 */
  transition: color 0.3s ease;
  /* 添加过渡效果使颜色变化更平滑 */
}

/* 深色模式下保持白色文字 */
[data-theme="dark"] .welcome-text {
  color: white;
}

/* 悬停状态效果 */
.welcome-text:hover {
  color: var(--primary-color);
  /* 悬停时显示主题色，增强交互反馈 */
  cursor: default;
}

/* 激活状态效果 */
.welcome-text:active {
  color: var(--primary-dark);
  /* 激活时使用稍深的主题色 */
}

/* 主内容区域 */
.user-content {
  flex: 1;
  padding: 20px;
  background-color: #0107042a;
  margin: auto auto;
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