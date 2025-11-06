<template>
  <div class="user-management">
    <div class="page-header">
      <h2>用户信息管理</h2>
      <p>管理系统中的所有用户信息</p>
    </div>
    
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAddUser">添加用户</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索用户名、手机号或邮箱"
          prefix-icon="el-icon-search"
          style="width: 300px;"
        />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="usersData" style="width: 100%">
        <el-table-column prop="id" label="用户ID" width="80" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="phone" label="手机号" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="createdAt" label="创建时间" />
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEditUser(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteUser(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api'

// 定义组件名称
const name = 'UserManagement'

// 响应式数据
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const usersData = ref([
  { id: 1, username: '张三', phone: '138****1234', email: 'zhangsan@example.com', role: '用户', status: true, createdAt: '2025-01-15' },
  { id: 2, username: '李四', phone: '139****5678', email: 'lisi@example.com', role: '用户', status: true, createdAt: '2025-02-20' },
  { id: 3, username: '王五', phone: '158****8888', email: 'wangwu@example.com', role: '管理员', status: true, createdAt: '2025-03-10' }
])

// 加载用户数据
const loadUserData = async () => {
  try {
    // 这里将替换为实际的API调用
    // const response = await api.admin.getUsers(currentPage.value, pageSize.value, searchQuery.value)
    // usersData.value = response.data.items
    // total.value = response.data.total
    total.value = usersData.value.length
  } catch (error) {
    console.error('加载用户数据失败', error)
    ElMessage.error('加载数据失败，请重试')
  }
}

// 搜索用户
const handleSearch = () => {
  currentPage.value = 1
  loadUserData()
}

// 添加用户
const handleAddUser = () => {
  ElMessage.info('添加用户功能待实现')
}

// 编辑用户
const handleEditUser = (user) => {
  ElMessage.info(`编辑用户: ${user.username}`)
}

// 删除用户
const handleDeleteUser = (userId) => {
  ElMessageBox.confirm('确定要删除该用户吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadUserData()
  }).catch(() => {})
}

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size
  loadUserData()
}

// 当前页码改变
const handleCurrentChange = (current) => {
  currentPage.value = current
  loadUserData()
}

// 生命周期钩子
onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
.user-management {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 14px;
  color: #666;
}

.content-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.search-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  align-items: center;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>