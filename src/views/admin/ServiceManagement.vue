<template>
  <div class="service-management">
    <div class="page-header">
      <h2>服务管理</h2>
      <p>管理系统提供的所有健康服务</p>
    </div>
    
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>服务列表</span>
          <el-button type="primary" @click="handleAddService">添加服务</el-button>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索服务名称或描述"
          prefix-icon="el-icon-search"
          style="width: 300px;"
        />
        <el-select v-model="serviceType" placeholder="服务类型" style="width: 150px; margin-left: 10px;">
          <el-option label="全部" value="" />
          <el-option label="健康咨询" value="consultation" />
          <el-option label="体检预约" value="physical" />
          <el-option label="报告解读" value="report" />
          <el-option label="慢病管理" value="chronic" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="servicesData" style="width: 100%">
        <el-table-column prop="id" label="服务ID" width="80" />
        <el-table-column prop="name" label="服务名称" />
        <el-table-column prop="type" label="服务类型">
          <template #default="scope">
            <el-tag :type="getServiceTypeTag(scope.row.type)">{{ getServiceTypeName(scope.row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格">
          <template #default="scope">
            ¥{{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="服务时长">
          <template #default="scope">
            {{ scope.row.duration }}分钟
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-switch v-model="scope.row.status" active-text="启用" inactive-text="禁用" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEditService(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDeleteService(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          @update:current-page="currentPage = $event"
          :page-size="pageSize"
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
const name = 'ServiceManagement'

// 响应式数据
const searchQuery = ref('')
const serviceType = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const servicesData = ref([
  { id: 1, name: '在线健康咨询', type: 'consultation', price: 50, duration: 30, status: true },
  { id: 2, name: '全面体检套餐', type: 'physical', price: 380, duration: 120, status: true },
  { id: 3, name: '体检报告解读', type: 'report', price: 120, duration: 45, status: true },
  { id: 4, name: '高血压管理计划', type: 'chronic', price: 200, duration: 60, status: true },
  { id: 5, name: '糖尿病管理计划', type: 'chronic', price: 250, duration: 60, status: true }
])

// 加载服务数据
const loadServiceData = async () => {
  try {
    // 这里将替换为实际的API调用
    // const response = await api.admin.getServices(currentPage.value, pageSize.value, searchQuery.value, serviceType.value)
    // servicesData.value = response.data.items
    // total.value = response.data.total
    total.value = servicesData.value.length
  } catch (error) {
    console.error('加载服务数据失败', error)
    ElMessage.error('加载数据失败，请重试')
  }
}

// 搜索服务
const handleSearch = () => {
  currentPage.value = 1
  loadServiceData()
}

// 添加服务
const handleAddService = () => {
  ElMessage.info('添加服务功能待实现')
}

// 编辑服务
const handleEditService = (service) => {
  ElMessage.info(`编辑服务: ${service.name}`)
}

// 删除服务
const handleDeleteService = (serviceId) => {
  ElMessageBox.confirm('确定要删除该服务吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    ElMessage.success('删除成功')
    loadServiceData()
  }).catch(() => {})
}

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size
  loadServiceData()
}

// 当前页码改变
const handleCurrentChange = (current) => {
  currentPage.value = current
  loadServiceData()
}

// 获取服务类型标签
const getServiceTypeTag = (type) => {
  const tagMap = {
    consultation: 'primary',
    physical: 'success',
    report: 'info',
    chronic: 'warning'
  }
  return tagMap[type] || 'default'
}

// 获取服务类型名称
const getServiceTypeName = (type) => {
  const nameMap = {
    consultation: '健康咨询',
    physical: '体检预约',
    report: '报告解读',
    chronic: '慢病管理'
  }
  return nameMap[type] || type
}

// 生命周期钩子
onMounted(() => {
  loadServiceData()
})
</script>

<style scoped>
.service-management {
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
  flex-wrap: wrap;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar > * {
    width: 100% !important;
    margin-left: 0 !important;
  }
}
</style>