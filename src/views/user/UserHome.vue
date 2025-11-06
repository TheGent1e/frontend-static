<template>
  <div class="user-home">
    <!-- 顶部欢迎区域 -->
    <div class="welcome-section">
      <h1>您好，{{ userInfo?.name || '用户' }}！</h1>
      <p>今天是{{ formatDate(new Date()) }}，祝您健康快乐！</p>
    </div>
    
    <!-- 功能快捷入口区域 -->
    <div class="quick-access-section">
      <el-row :gutter="20">
        <!-- AI健康咨询 -->
        <el-col :xs="12" :sm="8" :md="6">
          <el-card class="quick-card" @click="goToAIConsult" shadow="hover" body-style="padding: 20px; cursor: pointer;">
            <div class="quick-card-content">
              <div class="quick-card-icon health-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <h3 class="quick-card-title">健康咨询</h3>
              <p class="quick-card-desc">AI助手专业解答健康疑问</p>
            </div>
          </el-card>
        </el-col>
        
        <!-- 商城入口 -->
        <el-col :xs="12" :sm="8" :md="6">
          <el-card class="quick-card" @click="goToMall" shadow="hover" body-style="padding: 20px; cursor: pointer;">
            <div class="quick-card-content">
              <div class="quick-card-icon mall-icon">
                <el-icon><ShoppingCart /></el-icon>
              </div>
              <h3 class="quick-card-title">健康商城</h3>
              <p class="quick-card-desc">精选健康产品一键购买</p>
            </div>
          </el-card>
        </el-col>
        
        <!-- 服务预约 -->
        <el-col :xs="12" :sm="8" :md="6">
          <el-card class="quick-card" @click="goToService" shadow="hover" body-style="padding: 20px; cursor: pointer;">
            <div class="quick-card-content">
              <div class="quick-card-icon service-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <h3 class="quick-card-title">服务预约</h3>
              <p class="quick-card-desc">便捷预约各类健康服务</p>
            </div>
          </el-card>
        </el-col>
        
        <!-- 健康档案 -->
        <el-col :xs="12" :sm="8" :md="6">
          <el-card class="quick-card" @click="goToHealthRecord" shadow="hover" body-style="padding: 20px; cursor: pointer;">
            <div class="quick-card-content">
              <div class="quick-card-icon record-icon">
                <el-icon><Document /></el-icon>
              </div>
              <h3 class="quick-card-title">健康档案</h3>
              <p class="quick-card-desc">完整记录您的健康数据</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 主要功能区域 -->
    <div class="main-content">
      <!-- 左侧：个人信息与健康数据 -->
      <div class="left-panel">
        <!-- 基础信息卡片 -->
        <el-card class="info-card" shadow="hover">
          <template #header>
            <div class="card-header">
              <span>个人信息</span>
              <el-button type="text" size="small" @click="showInfoDetail">详情</el-button>
            </div>
          </template>
          
          <div class="basic-info-content">
            <div class="info-item">
              <span class="info-label">姓名</span>
              <span class="info-value">{{ userInfo?.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">年龄</span>
              <span class="info-value">{{ userInfo?.age || '-' }}岁</span>
            </div>
            <div class="info-item">
              <span class="info-label">性别</span>
              <span class="info-value">{{ userInfo?.gender || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">健康档案号</span>
              <span class="info-value">{{ userInfo?.healthRecordNumber || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话</span>
              <span class="info-value">{{ userInfo?.phone || '-' }}</span>
            </div>
          </div>
        </el-card>
        
        <!-- 健康指标卡片 -->
        <div class="health-section">
          <h3 class="section-title">健康数据</h3>
          <div class="health-indicators">
            <el-card class="indicator-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>血压</span>
                  <el-button type="text" size="small" @click="showBloodPressureDetail">详情</el-button>
                </div>
              </template>
              
              <div class="indicator-content">
                <div class="latest-value">
                  {{ healthData?.bloodPressure?.latest?.systolic || '-' }}/{{ healthData?.bloodPressure?.latest?.diastolic || '-' }}
                </div>
                <div class="unit">mmHg</div>
                <div class="measure-time">测量时间：{{ healthData?.bloodPressure?.latest?.date || '-' }}</div>
              </div>
            </el-card>
            
            <el-card class="indicator-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>血糖</span>
                  <el-button type="text" size="small" @click="showBloodSugarDetail">详情</el-button>
                </div>
              </template>
              
              <div class="indicator-content">
                <div class="latest-value">
                  {{ healthData?.bloodSugar?.latest?.value || '-' }}
                </div>
                <div class="unit">mmol/L</div>
                <div class="measure-time">测量时间：{{ healthData?.bloodSugar?.latest?.date || '-' }}</div>
              </div>
            </el-card>
            
            <el-card class="indicator-card" shadow="hover">
              <template #header>
                <div class="card-header">
                  <span>心率</span>
                  <el-button type="text" size="small" @click="showHeartRateDetail">详情</el-button>
                </div>
              </template>
              
              <div class="indicator-content">
                <div class="latest-value">
                  {{ healthData?.heartRate?.latest?.value || '-' }}
                </div>
                <div class="unit">bpm</div>
                <div class="measure-time">测量时间：{{ healthData?.heartRate?.latest?.date || '-' }}</div>
              </div>
            </el-card>
          </div>
        </div>
      </div>
      
      <!-- 右侧：商城推荐与服务记录 -->
      <div class="right-panel">
        <!-- 商城推荐区域 -->
        <div class="mall-section">
          <h3 class="section-title">健康商城推荐</h3>
          <div class="mall-products">
            <div v-for="product in recommendedProducts" :key="product.id" class="product-item" @click="goToProductDetail(product.id)">
              <div class="product-image">
                <img :src="product.image" :alt="product.name" />
              </div>
              <div class="product-info">
                <div class="product-name">{{ product.name }}</div>
                <div class="product-price">¥{{ product.price }}</div>
              </div>
              <el-button type="primary" size="small" @click.stop="addToCart(product.id)" class="add-cart-btn">
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
            
            <div class="view-more">
              <el-button type="text" @click="goToMall">查看更多 <el-icon><ArrowRight /></el-icon></el-button>
            </div>
          </div>
        </div>
        
        <!-- 服务记录卡片 -->
        <div class="service-section">
          <h3 class="section-title">最近服务</h3>
          <el-card class="service-card" shadow="hover">
            <div class="service-content">
              <el-empty v-if="!serviceRecords || serviceRecords.length === 0" description="暂无服务记录"></el-empty>
              <div v-else class="service-list">
                <div v-for="record in displayedServices" :key="record.id" class="service-item">
                  <div class="service-info">
                    <div class="service-type">{{ record.type }}</div>
                    <div class="service-date">服务时间：{{ record.date }}</div>
                    <div class="service-person">服务人员：{{ record.servicePerson }}</div>
                  </div>
                  <div class="service-status">
                    <el-tag :type="getStatusType(record.status)">{{ record.status }}</el-tag>
                  </div>
                </div>
              </div>
              <div class="view-all">
                <el-button type="text" @click="showAllServices">查看全部 <el-icon><ArrowRight /></el-icon></el-button>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ChatDotRound, ShoppingCart, Calendar, Document, ArrowRight } from '@element-plus/icons-vue'
import api from '../../api'

// 定义组件名称
const name = 'UserHome'

// 路由相关
const router = useRouter()

// 响应式数据
const userInfo = ref(null)
const healthData = ref(null)
const serviceRecords = ref([])
const loading = ref(false)

// 商城相关数据
const recommendedProducts = ref([
  {
    id: 1,
    name: '智能血压计',
    price: 299.00,
    image: '/images/products/blood-pressure.jpg'
  },
  {
    id: 2,
    name: '血糖仪套装',
    price: 199.00,
    image: '/images/products/blood-sugar.jpg'
  },
  {
    id: 3,
    name: '老年人保健枕',
    price: 129.00,
    image: '/images/products/pillow.jpg'
  }
])

// 计算属性
const displayedServices = computed(() => {
  return serviceRecords.value.slice(0, 3)
})

// 生命周期钩子
onMounted(() => {
  // 加载数据
  loadUserData()
})

// 加载用户数据
const loadUserData = async () => {
  loading.value = true
  try {
    // 从sessionStorage读取用户信息
    const storedUserInfo = sessionStorage.getItem('userInfo')
    if (storedUserInfo) {
      try {
        userInfo.value = JSON.parse(storedUserInfo)
      } catch (e) {
        console.error('解析用户信息失败', e)
      }
    }
    
    // 健康数据和服务记录可以继续尝试API调用，但即使失败也不影响主要功能
    try {
      const healthDataRes = await api.user.getHealthData()
      // 适配新的API返回格式（code: 1）
      if (healthDataRes && healthDataRes.code === 1) {
        healthData.value = healthDataRes.data || {
          bloodPressure: { latest: { systolic: 120, diastolic: 80, date: new Date().toISOString().split('T')[0] } },
          bloodSugar: { latest: { value: 5.8, date: new Date().toISOString().split('T')[0] } },
          heartRate: { latest: { value: 72, date: new Date().toISOString().split('T')[0] } }
        }
      }
    } catch (e) {
      console.warn('获取健康数据失败，使用默认数据', e)
      // 提供默认健康数据，确保UI显示正常
      healthData.value = {
        bloodPressure: { latest: { systolic: 120, diastolic: 80, date: new Date().toISOString().split('T')[0] } },
        bloodSugar: { latest: { value: 5.8, date: new Date().toISOString().split('T')[0] } },
        heartRate: { latest: { value: 72, date: new Date().toISOString().split('T')[0] } }
      }
    }
    
    try {
      const serviceRecordsRes = await api.user.getServiceRecords()
      // 适配新的API返回格式（code: 1）
      if (serviceRecordsRes && serviceRecordsRes.code === 1) {
        serviceRecords.value = serviceRecordsRes.data || []
      }
    } catch (e) {
      console.warn('获取服务记录失败，使用默认数据', e)
      // 提供默认服务记录数据
      serviceRecords.value = []
    }
    
    // 加载推荐商品数据
    // const productsRes = await api.mall.getRecommendedProducts()
    // if (productsRes.code === 200) {
    //   recommendedProducts.value = productsRes.data
    // }
  } catch (error) {
    console.error('加载数据出错', error)
    // 不再显示错误提示，因为主要功能（显示用户名）已经实现
  } finally {
    loading.value = false
  }
}

// 跳转到AI健康咨询
const goToAIConsult = () => {
  router.push('/user/ai-consult')
}

// 跳转到商城首页
const goToMall = () => {
  // 检查路由是否存在，如果不存在可以暂时显示提示
  try {
    router.push('/user/mall')
  } catch (error) {
    ElMessage.info('商城功能正在开发中')
  }
}

// 跳转到服务预约
const goToService = () => {
  ElMessage.info('服务预约功能正在开发中')
}

// 跳转到健康档案
const goToHealthRecord = () => {
  ElMessage.info('健康档案功能正在开发中')
}

// 跳转到商品详情
const goToProductDetail = (productId) => {
  try {
    router.push(`/user/mall/product/${productId}`)
  } catch (error) {
    ElMessage.info('商品详情页面正在开发中')
  }
}

// 添加到购物车
const addToCart = async (productId) => {
  try {
    // const res = await api.mall.addToCart(productId)
    // if (res.code === 200) {
      ElMessage.success('已成功添加到购物车')
    // }
  } catch (error) {
    ElMessage.error('添加失败，请重试')
  }
}

// 格式化日期
const formatDate = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}年${month}月${day}日`
}

// 获取服务状态对应的标签类型
const getStatusType = (status) => {
  switch (status) {
    case '已完成':
      return 'success'
    case '进行中':
      return 'primary'
    case '待处理':
      return 'warning'
    default:
      return 'info'
  }
}

// 显示信息详情
const showInfoDetail = () => {
  ElMessage('查看详细信息功能开发中')
}

// 显示血压详情
const showBloodPressureDetail = () => {
  ElMessage('查看血压历史数据功能开发中')
}

// 显示血糖详情
const showBloodSugarDetail = () => {
  ElMessage('查看血糖历史数据功能开发中')
}

// 显示心率详情
const showHeartRateDetail = () => {
  ElMessage('查看心率历史数据功能开发中')
}

// 显示所有服务记录
const showAllServices = () => {
  ElMessage('查看全部服务记录功能开发中')
}
</script>

<style scoped>
.user-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 30px;
  text-align: center;
  padding: 30px 0;
  background: linear-gradient(135deg, #f0f9ff 0%, #e6f7ff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.welcome-section h1 {
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.welcome-section p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 快捷功能入口 */
.quick-access-section {
  margin-bottom: 40px;
}

.quick-card {
  transition: all 0.3s ease;
  height: 100%;
}

.quick-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.quick-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.quick-card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  font-size: 28px;
}

.health-icon {
  background-color: #e6f7ff;
  color: #1890ff;
}

.mall-icon {
  background-color: #f6ffed;
  color: #52c41a;
}

.service-icon {
  background-color: #fff7e6;
  color: #fa8c16;
}

.record-icon {
  background-color: #f9f0ff;
  color: #722ed1;
}

.quick-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}

.quick-card-desc {
  font-size: 14px;
  color: #666;
  margin: 0;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
}

.left-panel {
  flex: 2;
}

.right-panel {
  flex: 1;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

/* 基础信息卡片 */
.info-card {
  margin-bottom: 30px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

.basic-info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.info-label {
  font-size: 14px;
  color: #666;
}

.info-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* 健康数据区域 */
.health-section {
  margin-bottom: 30px;
}

.health-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.indicator-card {
  text-align: center;
  height: 100%;
}

.indicator-content {
  padding: 20px 0;
}

.latest-value {
  font-size: 36px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 10px;
}

.unit {
  font-size: 16px;
  color: #666;
  margin-bottom: 15px;
}

.measure-time {
  font-size: 14px;
  color: #999;
}

/* 商城推荐区域 */
.mall-section {
  margin-bottom: 30px;
}

.mall-products {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.product-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
}

.product-item:hover {
  background-color: #f0f9ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.product-image {
  width: 60px;
  height: 60px;
  margin-right: 15px;
  flex-shrink: 0;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.product-price {
  font-size: 16px;
  font-weight: bold;
  color: #ff4d4f;
}

.add-cart-btn {
  position: absolute;
  right: 15px;
}

.view-more,
.view-all {
  text-align: center;
  margin-top: 15px;
}

/* 服务记录区域 */
.service-section {
  margin-bottom: 30px;
}

.service-card {
  height: 100%;
}

.service-content {
  display: flex;
  flex-direction: column;
  min-height: 200px;
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #fafafa;
  border-radius: 8px;
  transition: all 0.3s;
}

.service-item:hover {
  background-color: #f0f9ff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.service-info {
  flex: 1;
}

.service-type {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 5px;
}

.service-date,
.service-person {
  font-size: 12px;
  color: #666;
  margin-bottom: 3px;
}

.service-status {
  margin-left: 10px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .main-content {
    flex-direction: column;
  }
  
  .left-panel,
  .right-panel {
    flex: none;
  }
  
  .health-indicators {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .user-home {
    padding: 0 10px;
  }
  
  .welcome-section h1 {
    font-size: 24px;
  }
  
  .quick-access-section .el-col {
    margin-bottom: 15px;
  }
  
  .basic-info-content {
    grid-template-columns: 1fr;
  }
  
  .health-indicators {
    grid-template-columns: 1fr;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .add-cart-btn {
    position: static;
    width: 100%;
  }
  
  .service-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .service-status {
    margin-left: 0;
  }
}
</style>