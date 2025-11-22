<template>
  <div class="service-appointment">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>服务预约</h2>
      <p>便捷预约各类健康服务，提前规划您的健康管理</p>
    </div>

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <el-button type="primary" icon="el-icon-arrow-left" @click="goBack">返回首页</el-button>
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
        <el-card
          v-for="service in hotServices"
          :key="service.id"
          class="service-card"
          shadow="hover"
          @click="viewServiceDetail(service.id)"
        >
          <div class="service-card-content">
            <div class="service-image">
              <img :src="service.imageUrl" :alt="service.name" class="service-img" />
            </div>
            <div class="service-info">
              <h4 class="service-name">{{ service.name }}</h4>
              <div class="service-doctor">{{ service.doctor }}</div>
              <div class="service-price">¥{{ service.price }}</div>
              <div class="service-tags">
                <el-tag v-for="tag in service.tags" :key="tag" size="small" :type="getTagType(tag)">
                  {{ tag }}
                </el-tag>
              </div>
              <el-button type="primary" size="small" class="appointment-btn" @click.stop="makeAppointment(service)">
                立即预约
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 所有服务列表 -->
    <div class="all-services-section">
      <div class="section-header">
        <h3>所有服务</h3>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
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
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="prev, pager, next, jumper"
            :total="totalServices"
            @current-change="handleCurrentChange"
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
        <el-table :data="myAppointments" style="width: 100%">
          <el-table-column prop="serviceName" label="服务名称" width="180" />
          <el-table-column prop="appointmentDate" label="预约日期" width="120" />
          <el-table-column prop="appointmentTime" label="预约时间" width="100" />
          <el-table-column prop="doctor" label="医生" width="120" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <el-tag :type="getStatusType(scope.row.status)">
                {{ scope.row.status }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
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
  background-color: var(--el-bg-color);
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
}

.search-filter-card {
  margin-bottom: 24px;
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
}

.service-card:hover {
  transform: translateY(-4px);
}

.service-card-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.service-image {
  height: 160px;
  overflow: hidden;
  margin-bottom: 12px;
  border-radius: var(--el-border-radius-base);
}

.service-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.service-card:hover .service-img {
  transform: scale(1.05);
}

.service-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.service-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--el-text-color-primary);
}

.service-doctor {
  font-size: 14px;
  color: var(--el-text-color-secondary);
  margin-bottom: 6px;
}

.service-price {
  font-size: 18px;
  font-weight: 600;
  color: #f56c6c;
  margin-bottom: 8px;
}

.service-tags {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.appointment-btn {
  margin-top: auto;
  width: 100%;
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

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
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

@media (max-width: 768px) {
  .service-appointment {
    padding: 16px;
  }
  
  .page-header h2 {
    font-size: 20px;
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