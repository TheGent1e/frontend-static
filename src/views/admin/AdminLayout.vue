<template>
  <div class="admin-layout">
    <!-- 顶部导航栏 -->
    <header class="top-navbar">
      <div class="navbar-left">
        <div class="logo">老年人健康服务平台</div>
      </div>
      
      <div class="navbar-center">
        <span class="welcome-text">欢迎，{{ userStore.getUserName }}</span>
      </div>
      
      <div class="navbar-right">
        <el-button 
          type="primary" 
          plain 
          @click="handleLogout"
          icon="el-icon-switch-button"
        >
          退出登录
        </el-button>
      </div>
    </header>
    
    <div class="main-content">
      <!-- 左侧侧边栏 -->
      <aside class="sidebar">
        <el-menu 
          :default-active="activeMenu" 
          class="el-menu-vertical-left" 
          @select="handleMenuSelect"
          background-color="#001529" 
          text-color="#fff" 
          active-text-color="#409EFF"
        >
          <el-menu-item index="/admin/home">
            <i class="el-icon-s-home"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-menu-item index="/admin/users">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户信息管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/employees">
            <i class="el-icon-user"></i>
            <span slot="title">员工信息管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/departments">
            <i class="el-icon-office-building"></i>
            <span slot="title">部门管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/services">
            <i class="el-icon-s-order"></i>
            <span slot="title">服务管理</span>
          </el-menu-item>
          <el-menu-item index="/admin/ai-records">
            <i class="el-icon-document"></i>
            <span slot="title">统计报表</span>
          </el-menu-item>
          <el-menu-item index="/admin/system">
            <i class="el-icon-setting"></i>
            <span slot="title">系统设置</span>
          </el-menu-item>
        </el-menu>
      </aside>
      
      <!-- 主内容区域 -->
      <main class="content-wrapper">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '../../store/user'

// 定义组件名称
const name = 'AdminLayout'

// 路由相关
const router = useRouter()
const route = useRoute()

// Store
const userStore = useUserStore()

// 计算属性
const activeMenu = computed(() => {
  // 获取当前路由路径作为激活菜单
  return route.path
})

// 生命周期钩子
onMounted(() => {
  // 恢复用户信息
  userStore.restoreUser()
})

// 处理菜单选择
const handleMenuSelect = (key) => {
  router.push(key)
}

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
.admin-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
}

/* 顶部导航栏 */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.navbar-left .logo {
  font-size: 20px;
  font-weight: bold;
  color: #1890ff;
}

.navbar-center .welcome-text {
  font-size: 14px;
  color: #666;
}

/* 主内容区域 */
.main-content {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* 左侧侧边栏 */
.sidebar {
  width: 200px;
  background-color: #001529;
  overflow-y: auto;
}

.sidebar .el-menu-vertical-left {
  border-right: none;
  height: 100%;
}

/* 内容包装器 */
.content-wrapper {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f0f2f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sidebar {
    width: 64px;
  }
  
  .navbar-left .logo {
    font-size: 16px;
  }
  
  .content-wrapper {
    padding: 10px;
  }
}
</style>