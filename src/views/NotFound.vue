<template>
  <div class="not-found">
    <div class="error-code">404</div>
    <h2>页面不存在</h2>
    <p>抱歉，您访问的页面不存在或已被删除</p>
    <el-button type="primary" @click="goHome">返回首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

// 定义组件名称
const name = 'NotFound'

// 路由
const router = useRouter()

// 返回首页方法
const goHome = () => {
  // 判断用户是否已登录，跳转到相应的首页
  const userRole = localStorage.getItem('userRole')
  if (userRole === 'admin') {
    router.push('/admin/home')
  } else if (userRole === 'user') {
    router.push('/user/home')
  } else {
    router.push('/login')
  }
}
</script>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 20px;
  background-color: #f5f5f5;
}

.error-code {
  font-size: 120px;
  font-weight: bold;
  color: #409eff;
  margin-bottom: 20px;
  line-height: 1;
}

.not-found h2 {
  font-size: 32px;
  color: #333;
  margin-bottom: 15px;
}

.not-found p {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
  max-width: 400px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .error-code {
    font-size: 80px;
  }
  
  .not-found h2 {
    font-size: 24px;
  }
  
  .not-found p {
    font-size: 14px;
  }
}
</style>