<template>
  <div class="service-appointment">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>服务预约</h2>
      <p>便捷预约各类健康服务，提前规划您的健康管理</p>
    </div>

    <!-- 返回按钮 - 调整位置 -->
    <div class="back-button-container">
      <el-button class="back-home-btn" @click="goBack">返回首页</el-button>
    </div>

    <!-- 服务分类和搜索 -->
    <el-card class="search-filter-card" shadow="hover">
      <div class="search-filter">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索服务名称或医生"
          clearable
          prefix-icon="el-icon-search"
          class="search-input"
        />
        <el-select v-model="serviceCategory" placeholder="选择服务分类" class="category-select">
          <el-option label="全部服务" value="all" />
          <el-option label="常规体检" value="physical" />
          <el-option label="专家问诊" value="consultation" />
          <el-option label="专科检查" value="specialist" />
          <el-option label="健康评估" value="assessment" />
          <el-option label="康复治疗" value="rehabilitation" />
        </el-select>
        <el-date-picker
          v-model="selectedDate"
          type="date"
          placeholder="选择预约日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
          class="date-picker"
        />
        <el-button type="primary" @click="searchServices">搜索</el-button>
      </div>
    </el-card>

    <!-- 热门服务推荐 -->
    <div class="hot-services-section">
      <div class="section-header">
        <h3>热门服务推荐</h3>
      </div>
      <div class="hot-services-grid">
          <div
            v-for="service in hotServices"
            :key="service.id"
            class="service-card"
            @click="viewServiceDetail(service.id)"
          >
            <div class="service-card-content">
              <div class="image-placeholder">
                <div class="placeholder-icon">
                  <i class="el-icon-picture-outline"></i>
                </div>
                <div class="placeholder-text">图片区域</div>
              </div>
              <div class="service-info">
                <div class="service-name">{{ service.name }}</div>
                <div class="service-description">{{ service.description || '提供专业的健康服务，满足您的健康需求。' }}</div>
                <div class="service-price-container">
                  <div class="service-price">¥{{ service.price }}</div>
                </div>
                <el-button class="add-to-cart-btn" @click.stop="makeAppointment(service)">
                  <i class="el-icon-shopping-cart-2"></i>
                  加入购物车
                </el-button>
              </div>
            </div>
          </div>
        </div>
    </div>

    <!-- 所有服务列表 -->
    <div class="all-services-section">
      <div class="section-header">
        <h3>所有服务</h3>
        <el-pagination
:current-page="pagination.currentPage"
          :page-size.sync="pagination.pageSize"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes"
          :total="totalServices"
          @size-change="handleSizeChange"
        />
      </div>
      
      <el-card class="services-table-card" shadow="hover">
        <el-table :data="servicesList" style="width: 100%">
          <el-table-column prop="name" label="服务名称" min-width="150">
            <template #default="scope">
              <div class="service-name-cell">
                <img :src="scope.row.imageUrl" :alt="scope.row.name" class="service-cell-img" />
                <span>{{ scope.row.name }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="doctor" label="主治医生" width="120" />
          <el-table-column prop="category" label="服务分类" width="120">
            <template #default="scope">
              <el-tag size="small" type="info">{{ scope.row.category }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="服务价格" width="100">
            <template #default="scope">
              <span class="price-tag">¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="duration" label="服务时长" width="100">
            <template #default="scope">
              {{ scope.row.duration }}分钟
            </template>
          </el-table-column>
          <el-table-column prop="rating" label="用户评分" width="100">
            <template #default="scope">
              <div class="rating">
                <el-rate :model-value="scope.row.rating" disabled show-score text-color="#ff9900" />
              </div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="scope">
              <el-button type="primary" size="small" @click="viewServiceDetail(scope.row.id)">详情</el-button>
              <el-button type="success" size="small" @click="makeAppointment(scope.row)">预约</el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination-container">
          <el-pagination
            :current-page.sync="pagination.currentPage"
            :page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="prev, pager, next, jumper"
            :total="totalServices"
            @current-change="handleCurrentChange"
            class="enhanced-pagination"
          />
        </div>
      </el-card>
    </div>

    <!-- 我的预约列表 -->
    <div class="my-appointments-section">
      <div class="section-header">
        <h3>我的预约</h3>
      </div>
      
      <el-card class="appointments-table-card" shadow="hover">
        <el-table :data="myAppointments" style="width: 100%" fit>
          <el-table-column prop="serviceName" label="服务名称" min-width="180" />
          <el-table-column prop="appointmentDate" label="预约日期" min-width="120" />
          <el-table-column prop="appointmentTime" label="预约时间" min-width="100" />
          <el-table-column prop="doctor" label="医生" min-width="120" />
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150" fixed="right">
            <template #default="scope">
              <el-button v-if="scope.row.status === '已预约'" type="danger" size="small" @click="cancelAppointment(scope.row.id)">
                取消
              </el-button>
              <el-button v-if="scope.row.status === '已完成'" type="primary" size="small" @click="viewReport(scope.row.id)">
                查看报告
              </el-button>
              <el-button type="info" size="small" @click="viewAppointmentDetail(scope.row.id)">
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const serviceCategory = ref('all')
const selectedDate = ref('')

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 模拟数据 - 热门服务
const hotServices = ref([
  {
    id: 1,
    name: '全面体检套餐',
    doctor: '张医生',
    price: 1280,
    tags: ['热门', '全面'],
    imageUrl: '/health-service-platform/service1.jpg'
  },
  {
    id: 2,
    name: '心血管健康评估',
    doctor: '李医生',
    price: 880,
    tags: ['专家', '专科'],
    imageUrl: '/health-service-platform/service2.jpg'
  },
  {
    id: 3,
    name: '中医体质辨识',
    doctor: '王医生',
    price: 380,
    tags: ['特色', '中医'],
    imageUrl: '/health-service-platform/service3.jpg'
  },
  {
    id: 4,
    name: '亚健康调理',
    doctor: '陈医生',
    price: 580,
    tags: ['调理', '健康'],
    imageUrl: '/health-service-platform/service4.jpg'
  }
])

// 模拟数据 - 所有服务
const allServices = ref([
  {
    id: 1,
    name: '全面体检套餐',
    doctor: '张医生',
    category: '常规体检',
    price: 1280,
    duration: 120,
    rating: 4.8,
    imageUrl: '/health-service-platform/service1.jpg'
  },
  {
    id: 2,
    name: '心血管健康评估',
    doctor: '李医生',
    category: '专科检查',
    price: 880,
    duration: 90,
    rating: 4.9,
    imageUrl: '/health-service-platform/service2.jpg'
  },
  {
    id: 3,
    name: '中医体质辨识',
    doctor: '王医生',
    category: '健康评估',
    price: 380,
    duration: 60,
    rating: 4.7,
    imageUrl: '/health-service-platform/service3.jpg'
  },
  {
    id: 4,
    name: '亚健康调理',
    doctor: '陈医生',
    category: '康复治疗',
    price: 580,
    duration: 45,
    rating: 4.6,
    imageUrl: '/health-service-platform/service4.jpg'
  },
  {
    id: 5,
    name: '心理咨询服务',
    doctor: '刘医生',
    category: '专家问诊',
    price: 680,
    duration: 50,
    rating: 4.8,
    imageUrl: '/health-service-platform/service5.jpg'
  },
  {
    id: 6,
    name: '骨密度检查',
    doctor: '赵医生',
    category: '专科检查',
    price: 480,
    duration: 30,
    rating: 4.7,
    imageUrl: '/health-service-platform/service6.jpg'
  },
  {
    id: 7,
    name: '血糖监测套餐',
    doctor: '黄医生',
    category: '常规体检',
    price: 280,
    duration: 40,
    rating: 4.5,
    imageUrl: '/health-service-platform/service7.jpg'
  },
  {
    id: 8,
    name: '营养师咨询',
    doctor: '孙医生',
    category: '健康评估',
    price: 380,
    duration: 50,
    rating: 4.9,
    imageUrl: '/health-service-platform/service8.jpg'
  }
])

// 模拟数据 - 我的预约
const myAppointments = ref([
  {
    id: 1,
    serviceName: '心血管健康评估',
    appointmentDate: '2024-10-28',
    appointmentTime: '09:30',
    doctor: '李医生',
    status: '已预约'
  },
  {
    id: 2,
    serviceName: '全面体检套餐',
    appointmentDate: '2024-10-15',
    appointmentTime: '14:00',
    doctor: '张医生',
    status: '已完成'
  },
  {
    id: 3,
    serviceName: '中医体质辨识',
    appointmentDate: '2024-10-20',
    appointmentTime: '10:00',
    doctor: '王医生',
    status: '已完成'
  }
])

// 计算属性：过滤后的服务列表
const servicesList = computed(() => {
  let filtered = [...allServices.value]
  
  // 根据关键词过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(keyword) || 
      service.doctor.toLowerCase().includes(keyword)
    )
  }
  
  // 根据分类过滤
  if (serviceCategory.value !== 'all') {
    const categoryMap = {
      'physical': '常规体检',
      'consultation': '专家问诊',
      'specialist': '专科检查',
      'assessment': '健康评估',
      'rehabilitation': '康复治疗'
    }
    filtered = filtered.filter(service => 
      service.category === categoryMap[serviceCategory.value]
    )
  }
  
  // 分页处理
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filtered.slice(start, end)
})

// 计算属性：总服务数
const totalServices = computed(() => {
  let filtered = [...allServices.value]
  
  // 应用相同的过滤条件
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(service => 
      service.name.toLowerCase().includes(keyword) || 
      service.doctor.toLowerCase().includes(keyword)
    )
  }
  
  if (serviceCategory.value !== 'all') {
    const categoryMap = {
      'physical': '常规体检',
      'consultation': '专家问诊',
      'specialist': '专科检查',
      'assessment': '健康评估',
      'rehabilitation': '康复治疗'
    }
    filtered = filtered.filter(service => 
      service.category === categoryMap[serviceCategory.value]
    )
  }
  
  return filtered.length
})

// 方法
const goBack = () => {
  router.push('/user/home')
}

const searchServices = () => {
  pagination.value.currentPage = 1
  console.log('搜索服务', { searchKeyword: searchKeyword.value, category: serviceCategory.value, date: selectedDate.value })
}

const viewServiceDetail = (serviceId) => {
  ElMessage.info('查看服务详情功能正在开发中')
}

const makeAppointment = (service) => {
  ElMessage.info(`预约服务：${service.name}`)
}

const cancelAppointment = async (appointmentId) => {
  try {
    await ElMessageBox.confirm('确定要取消这个预约吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    ElMessage.success('预约已取消')
    // 这里应该调用API取消预约
  } catch (error) {
    // 用户取消操作
  }
}

const viewReport = (appointmentId) => {
  ElMessage.info('查看报告功能正在开发中')
}

const viewAppointmentDetail = (appointmentId) => {
  ElMessage.info('查看预约详情功能正在开发中')
}

// 获取标签类型
const getTagType = (tag) => {
  const tagTypes = {
    '热门': 'danger',
    '全面': 'info',
    '专家': 'warning',
    '专科': 'success',
    '特色': 'primary',
    '中医': 'info',
    '调理': 'success',
    '健康': 'primary'
  }
  return tagTypes[tag] || 'info'
}

// 获取状态类型
const getStatusType = (status) => {
  const statusTypes = {
    '已预约': 'primary',
    '已完成': 'success',
    '已取消': 'danger',
    '进行中': 'warning'
  }
  return statusTypes[status] || 'info'
}

// 分页处理
const handleSizeChange = (size) => {
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
}

const handleCurrentChange = (current) => {
  pagination.value.currentPage = current
}

// 生命周期钩子
onMounted(() => {
  // 这里应该调用API获取服务数据
  console.log('加载服务预约数据')
})
</script>

<style scoped>
.service-appointment {
  padding: 20px;
  min-height: 100vh;
  background-color: #0f172a;
  background-image: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
}

.page-header {
  margin-bottom: 24px;
  text-align: center;
}

.page-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: var(--el-text-color-secondary);
}

.back-button-container {
    margin-bottom: 20px;
    text-align: right; /* 将按钮右对齐，减少视觉突兀感 */
  }
  
  .back-home-btn {
    background: transparent;
    color: #3b82f6;
    border: 1px solid #3b82f6;
    transition: all 0.3s ease;
  }
  
  .back-home-btn:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #2563eb;
    border-color: #2563eb;
  }

.search-filter-card {
  margin-bottom: 24px;
  background-color: rgba(30, 41, 59, 0.9);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.search-filter {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  align-items: center;
}

.search-input {
  width: 280px;
}

.category-select,
.date-picker {
  width: 200px;
}

.hot-services-section,
.all-services-section,
.my-appointments-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin: 0;
}

.hot-services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.service-card {
  cursor: pointer;
  transition: transform 0.3s ease;
  background-color: rgba(23, 37, 84, 0.8);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(59, 130, 246, 0.5);
}

.service-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.3);
}

.service-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 16px;
}

/* 图片预留区域样式 */
.image-placeholder {
  aspect-ratio: 16/9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  border: 2px dashed rgba(59, 130, 246, 0.5);
  border-radius: 8px;
  margin-bottom: 12px;
  transition: all 0.3s ease;
}

.image-placeholder:hover {
  background-color: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.8);
}

.placeholder-icon {
  font-size: 32px;
  color: rgba(59, 130, 246, 0.6);
  margin-bottom: 8px;
}

.placeholder-text {
  font-size: 14px;
  color: rgba(59, 130, 246, 0.6);
  font-weight: 500;
}

.service-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  position: relative;
}

.service-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #ffffff;
}

.service-description {
  font-size: 15px; /* 约为标题文本的83% */
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.service-price-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.service-price {
  font-size: 24px;
  font-weight: 700;
  color: #22c55e;
  background: linear-gradient(90deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0) 100%);
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.add-to-cart-btn {
  margin-top: auto;
  width: 100%;
  background-color: #3b82f6;
  border: none;
  font-weight: 600;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.add-to-cart-btn:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

/* 表格卡片样式 - 调整颜色方案 */
.services-table-card,
.appointments-table-card {
  background-color: rgba(30, 41, 59, 0.8); /* 调整透明度 */
  border: 1px solid rgba(59, 130, 246, 0.5); /* 增加边框不透明度 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

.services-table-card,
.appointments-table-card {
  overflow: hidden;
}

.service-name-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.service-cell-img {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.price-tag {
  font-size: 16px;
  font-weight: 600;
  color: #f56c6c;
}

.rating {
  display: flex;
  align-items: center;
}

/* 增强的边框样式 - 全局CSS变量 */
/* 基础容器样式 */
.pagination-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
}

/* Gradient border for primary buttons - using theme colors */
.el-button--primary {
  position: relative;
  background: linear-gradient(135deg, #165DFF, #409EFF) !important;
  border: none !important;
  color: white !important;
  transition: all 0.3s ease;
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #0040CC, #165DFF) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.3);
}

/* Subtle border animation for default buttons */
.el-button {
  position: relative;
  border-width: 2px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.el-button:hover {
  border-color: #165DFF;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.1);
}

/* Accessibility: Focus states for keyboard navigation */
.el-button:focus {
  outline: none;
  border-color: #0040CC;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.2);
}

.el-button:focus-visible {
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.3);
}

/* List item border styling with hover effect */
.el-table-row {
  position: relative;
  transition: all 0.3s ease;
}

.el-table-row:hover {
  border-color: #165DFF;
  background-color: rgba(22, 93, 255, 0.05);
}

/* 卡片和容器的增强边框 */
.el-card {
  position: relative;
  border: none;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.el-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #165DFF, #409EFF);
}

/* Layered border for cards and containers */
.card,
.content-card,
.service-card {
  position: relative;
  border-radius: 8px;
  border: 2px solid rgba(22, 93, 255, 0.3);
  overflow: hidden;
  transition: all 0.3s ease;
}

.card:hover,
.content-card:hover,
.service-card:hover {
  border-color: #165DFF;
  box-shadow: 0 6px 20px rgba(22, 93, 255, 0.2);
}

/* Gradient top border for cards */
.service-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #165DFF, #409EFF);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.5s ease;
}

.service-card:hover::after {
  transform: scaleX(1);
}

/* 装饰性角落处理 */
.service-card {
  position: relative;
  transition: all 0.3s ease;
}

.service-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 24px;
  height: 24px;
  border-top: 2px solid #165DFF;
  border-left: 2px solid #165DFF;
  border-top-left-radius: 8px;
}

/* 选择器和输入框的增强边框 */
.el-select, .el-input, .el-date-picker {
  position: relative;
}

.el-select .el-input__wrapper, .el-input .el-input__wrapper {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background-clip: padding-box;
  background-origin: padding-box;
}

.el-select:hover .el-input__wrapper,
.el-input:hover .el-input__wrapper,
.el-select:focus-within .el-input__wrapper,
.el-input:focus-within .el-input__wrapper {
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.3);
}

/* Accessibility: High contrast focus indicators */
.el-select .el-input__wrapper:focus,
.el-input .el-input__wrapper:focus {
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.2);
}

/* Ensure proper color contrast for text readability */
.el-button--primary {
  color: white !important; /* High contrast for button text */
  /* Ensures WCAG AA compliance for color contrast */
}

/* Pagination accessibility */
.el-pagination .el-pager li:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(22, 93, 255, 0.2);
}

.el-pagination .el-pager li.is-active {
  /* Maintain high contrast for active pagination items */
  color: white !important;
  background-color: #165DFF !important;
}

/* Reduce animation duration for users who prefer reduced motion */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}

/* 分页组件增强 */
.el-pagination {
  --pagination-color: #165DFF;
}

.el-pagination .el-pager li {
  position: relative;
  border-radius: 8px;
  transition: all 0.3s ease;
  z-index: 0;
}

.el-pagination .el-pager li::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #165DFF, #409EFF);
  z-index: -1;
  opacity: 0;
  border-radius: 8px;
  transition: opacity 0.3s ease;
}

.el-pagination .el-pager li:hover::before,
.el-pagination .el-pager li.is-active::before {
  opacity: 1;
}

.el-pagination .el-pager li:hover,
.el-pagination .el-pager li.is-active {
  color: white;
}

/* Gradient border for specific div elements */
.special-div {
  position: relative;
  border: 2px solid transparent;
  background: linear-gradient(rgba(30, 41, 59, 0.8), rgba(30, 41, 59, 0.8)) padding-box,
              linear-gradient(135deg, #165DFF, #409EFF) border-box;
  border-radius: 8px;
}

/* Responsive adjustments for consistent rendering across screen sizes */
@media (max-width: 768px) {
  /* Adjust border styling for mobile devices */
  .el-button {
    border-width: 1.5px;
  }
  
  .card,
  .content-card,
  .service-card {
    border-width: 1.5px;
  }
  
  /* Scale down decorative elements */
  .service-card::before {
    width: 18px;
    height: 18px;
  }
  
  /* Thinner gradient borders */
  .card::after,
  .content-card::after,
  .service-card::after {
    height: 2px;
  }
  
  /* Adjust input borders */
  .el-select .el-input__wrapper,
  .el-input__wrapper {
    border-width: 1.5px;
  }
}

@media (max-width: 480px) {
  /* Further adjustments for small mobile screens */
  .el-button {
    border-width: 1px;
    border-radius: var(--radius-sm);
  }
  
  .card,
  .content-card,
  .service-card {
    border-width: 1px;
    border-radius: var(--radius-sm);
  }
  
  /* Minimal decorative elements */
  .service-card::before {
    width: 12px;
    height: 12px;
    border-width: 1px;
  }
  
  /* Pagination adjustments */
  .el-pagination .el-pager li {
    border-radius: var(--radius-sm);
  }
}

@media (min-width: 1200px) {
  /* Enhanced styling for larger screens */
  .card:hover,
  .content-card:hover,
  .service-card:hover {
    transform: translateY(-2px);
  }
  
  /* More pronounced hover effects */
  .el-button:hover {
    box-shadow: 0 0 0 4px rgba(22, 93, 255, 0.1);
  }
}

/* 动画关键帧 */
@keyframes borderRotate {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 页面标题样式 - 增大字体提升可读性 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
}

.page-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--text-primary);
  line-height: 1.2;
}

.page-header p {
  font-size: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
}

/* 为特定的div元素添加增强边框 */
.section-header {
  position: relative;
  padding-bottom: 10px;
  margin-bottom: 20px;
}

.section-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .hot-services-grid {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 16px;
  }
  
  .search-input {
    width: 240px;
  }
  
  .category-select,
  .date-picker {
    width: 180px;
  }
}

/* 分页组件响应式设计 */
@media (max-width: 768px) {
  .pagination-container {
    margin-top: 15px;
    margin-bottom: 15px;
    min-height: 50px;
  }
}

@media (max-width: 768px) {
  .service-appointment {
    padding: 16px;
  }
  
  .page-header h2 {
    font-size: 24px;
  }
  
  .page-header p {
    font-size: 16px;
  }
  
  .search-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .search-input,
  .category-select,
  .date-picker {
    width: 100%;
  }
  
  .hot-services-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .section-header h3 {
    text-align: center;
  }
  
  .service-image {
    height: 140px;
  }
}

@media (max-width: 480px) {
  .service-appointment {
    padding: 12px;
  }
  
  /* 小屏幕下的标题样式调整 */
  .page-header h2 {
    font-size: 22px;
  }
  
  .page-header p {
    font-size: 15px;
  }
  
  .service-image {
    height: 120px;
  }
  
  .service-name {
    font-size: 15px;
  }
  
  .service-price {
    font-size: 16px;
  }
}
</style>