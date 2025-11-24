<template>
  <!-- 根元素：确保单根结构 -->
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
              <div class="card-actions">
                <el-button type="text" size="small" @click="showInfoDetail">详情</el-button>
                <el-button type="primary" size="small" @click="() => { showEditDialog(); detailDialogVisible = false }">编辑</el-button>
              </div>
            </div>
          </template>
          
          <div class="basic-info-content">
            <div class="info-item">
              <span class="info-label">姓 名:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">年 龄:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.age || '-' }}岁</span>
            </div>
            <div class="info-item">
              <span class="info-label">性 别:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.gender || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">健康档案号:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.healthRecordNumber || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">联系电话:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.phone || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">邮箱:&nbsp;&nbsp;&nbsp;</span>
              <span class="info-value">{{ userInfo?.email || '-' }}</span>
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
    
    <!-- 用户信息详情对话框 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="个人信息详情"
      width="600px"
      :close-on-click-modal="false"
      class="dark-tech-dialog"
      :append-to-body="true"
    >
      <div class="user-detail-content">
        <!-- 用户头像和基本信息顶部区域 -->
        <div class="user-profile-header">
          <div class="user-avatar">
            <div class="avatar-circle">
              {{ userInfo?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
          </div>
          <div class="user-basic-header">
            <h3 class="user-name">{{ userInfo?.name || '用户' }}</h3>
            <div class="user-badge">
              <el-tag :type="userInfo?.role === 0 ? 'danger' : 'primary'" size="small">
                {{ userInfo?.role === 0 ? '管理员' : '普通用户' }}
              </el-tag>
              <el-tag :type="userInfo?.status ? 'success' : 'danger'" size="small" class="ml-2">
                {{ userInfo?.status ? '已启用' : '已禁用' }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 基础信息区域 -->
        <div class="detail-section">
          <h4 class="section-subtitle">基础信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">用户名</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ userInfo?.username || '-' }}</span>
                <span class="detail-tooltip">登录账号</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">健康档案号</span>
              <div class="detail-value-container">
                <span class="detail-value highlight-code">{{ userInfo?.healthRecordNumber || '-' }}</span>
                <span class="detail-tooltip">唯一标识</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">年龄</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ userInfo?.age || '-' }}岁</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">性别</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ userInfo?.gender || '-' }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 联系方式区域 -->
        <div class="detail-section">
          <h4 class="section-subtitle">联系方式</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">联系电话</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ userInfo?.phone || '-' }}</span>
                <el-button type="text" size="small" class="contact-action ml-2">
                  <el-icon><Phone /></el-icon>
                </el-button>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">邮箱</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ userInfo?.email || '-' }}</span>
                <el-button type="text" size="small" class="contact-action ml-2">
                  <el-icon><Message /></el-icon>
                </el-button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 账户信息区域 -->
        <div class="detail-section">
          <h4 class="section-subtitle">账户信息</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">创建时间</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ formatDateTime(userInfo?.createdAt) }}</span>
              </div>
            </div>
            <div class="detail-item">
              <span class="detail-label">最近登录</span>
              <div class="detail-value-container">
                <span class="detail-value">{{ formatDateTime(userInfo?.lastLoginAt || userInfo?.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button type="primary" @click="() => { showEditDialog(); detailDialogVisible = false }">编辑信息</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 用户信息编辑对话框 -->
    <el-dialog
      v-model="editDialogVisible"
      title="编辑个人信息"
      width="600px"
      :close-on-click-modal="false"
      class="dark-tech-dialog"
      :append-to-body="true"
    >
      <el-form
        :model="editForm"
        :rules="editRules"
        ref="editFormRef"
        label-width="120px"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="editForm.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input-number
            v-model="editForm.age"
            :min="0"
            :max="150"
            placeholder="请输入年龄"
          />
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-select v-model="editForm.gender" placeholder="请选择性别">
            <el-option label="男" value="男" />
            <el-option label="女" value="女" />
            <el-option label="其他" value="其他" />
          </el-select>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleUpdateInfo" :loading="updateLoading">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
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

// 对话框相关数据
const detailDialogVisible = ref(false)
const editDialogVisible = ref(false)
const updateLoading = ref(false)
const editFormRef = ref(null)

// 编辑表单数据
const editForm = reactive({
  name: '',
  age: 0,
  gender: '',
  phone: '',
  email: ''
})

// 编辑表单验证规则
const editRules = {
  name: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度应在2-20个字符之间', trigger: 'blur' }
  ],
  age: [
    { required: true, message: '请输入年龄', trigger: 'blur' },
    { type: 'number', min: 0, max: 150, message: '年龄应在0-150之间', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

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
    // 显示加载提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    })
    
    try {
      // 首先从localStorage获取用户基本信息（登录时已存储）
      const storedUserInfo = localStorage.getItem('userInfo')
      if (storedUserInfo) {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo)
          // 保持用户信息的原始结构，并确保有必要的属性
          userInfo.value = {
            ...parsedUserInfo,
            // 只有当这些属性不存在时才使用默认值
            age: parsedUserInfo.age || 65,
            gender: parsedUserInfo.gender || '男',
            healthRecordNumber: parsedUserInfo.healthRecordNumber || 'HR20240001',
            phone: parsedUserInfo.phone || parsedUserInfo.username,
            email: parsedUserInfo.email || ''
          }
        } catch (e) {
          console.error('解析localStorage用户信息失败', e)
          ElMessage.warning('用户信息解析失败，使用默认设置')
        }
      }
      
      // 尝试从API获取最新用户信息
      try {
        const response = await api.user.getUserBasicInfo(userInfo.value?.id)
        // 确保响应格式符合预期
        if (response && response.code === 1 && response.data) {
          const apiUserInfo = response.data
          // 合并API返回的用户信息，保留现有信息的优先级
          userInfo.value = {
            ...userInfo.value,
            ...apiUserInfo
          }
          
          // 更新localStorage中的用户信息
          localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
          localStorage.setItem('userId', userInfo.value.id)
        }
      } catch (e) {
        console.warn('获取最新用户信息失败', e)
        // 继续使用localStorage中的数据，不影响主要功能
      }
      
      // 健康数据和服务记录调用 - 使用改进的错误处理和mock数据
      try {
        const healthDataRes = await api.user.getHealthData()
        // 支持API文档中的响应格式（code为200）和原有的格式（code为1）
        if ((healthDataRes && healthDataRes.code === 200 && healthDataRes.data) ||
            (healthDataRes && healthDataRes.code === 1 && healthDataRes.data)) {
          healthData.value = healthDataRes.data
        } else {
          console.warn('获取健康数据返回格式不符合预期:', healthDataRes)
          // 提供默认健康数据，确保UI显示正常
          healthData.value = {
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
        // 支持API文档中的响应格式（code为200）和原有的格式（code为1）
        if ((serviceRecordsRes && serviceRecordsRes.code === 200 && serviceRecordsRes.data) ||
            (serviceRecordsRes && serviceRecordsRes.code === 1 && serviceRecordsRes.data)) {
          serviceRecords.value = serviceRecordsRes.data
        } else {
          console.warn('获取服务记录返回格式不符合预期:', serviceRecordsRes)
          // 提供默认服务记录数据，确保UI显示正常
          serviceRecords.value = [
              { id: 1, type: '健康体检', date: '2024-10-15', employeeName: '张医生', employeeDepartment: '体检科', status: 1 },
              { id: 2, type: '上门问诊', date: '2024-10-10', employeeName: '李护士', employeeDepartment: '社区医疗', status: 1 },
              { id: 3, type: '慢病管理', date: '2024-10-05', employeeName: '王医生', employeeDepartment: '内科', status: 1 }
            ]
        }
      } catch (e) {
        console.warn('获取服务记录失败，使用默认数据', e)
        // 提供默认服务记录数据，确保UI显示正常
        serviceRecords.value = [
            { id: 1, type: '健康体检', date: '2024-10-15', employeeName: '张医生', employeeDepartment: '体检科', status: 1 },
            { id: 2, type: '上门问诊', date: '2024-10-10', employeeName: '李护士', employeeDepartment: '社区医疗', status: 1 },
            { id: 3, type: '慢病管理', date: '2024-10-05', employeeName: '王医生', employeeDepartment: '内科', status: 1 }
          ]
      }
    } finally {
      // 无论成功失败，都关闭加载提示
      setTimeout(() => {
        loadingInstance.close()
      }, 300)
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
  try {
    router.push('/user/service-appointment')
  } catch (error) {
    console.error('导航失败:', error)
    ElMessage.error('导航失败，请稍后重试')
  }
}

// 跳转到健康档案
const goToHealthRecord = () => {
  try {
    router.push('/user/health-record')
  } catch (error) {
    console.error('导航失败:', error)
    ElMessage.error('导航失败，请稍后重试')
  }
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

// 显示信息详情对话框
const showInfoDetail = () => {
  detailDialogVisible.value = true
}

// 显示编辑对话框
const showEditDialog = () => {
  // 填充表单数据
  editForm.name = userInfo.value?.name || ''
  editForm.age = userInfo.value?.age || 0
  editForm.gender = userInfo.value?.gender || ''
  editForm.phone = userInfo.value?.phone || ''
  editForm.email = userInfo.value?.email || ''
  
  // 显示对话框
  editDialogVisible.value = true
}

// 更新用户信息
  const handleUpdateInfo = async () => {
    await editFormRef.value.validate(async (valid) => {
      if (valid) {
        // 显示加载状态
        const loadingInstance = ElLoading.service({
          lock: true,
          text: '保存中...',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        
        try {
          // 准备更新数据
          const updateData = {
            id: userInfo.value?.id,
            name: editForm.name,
            age: editForm.age,
            gender: editForm.gender,
            phone: editForm.phone,
            email: editForm.email
          }
          
          // 调用API更新用户信息
          const response = await api.user.updateUser(updateData)
          
          // 确保响应格式符合预期
          if (response && response.code === 1) {
            // 更新成功，更新本地数据
            userInfo.value = {
              ...userInfo.value,
              ...updateData
            }
            
            // 更新localStorage
            localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
            localStorage.setItem('userId', userInfo.value.id)
            
            ElMessage.success('个人信息更新成功')
            editDialogVisible.value = false
          } else {
            // 处理非预期的响应格式
            const errorMsg = response && response.msg ? response.msg : '未知错误'
            ElMessage.error('更新失败：' + errorMsg)
          }
        } catch (error) {
          console.error('更新用户信息失败', error)
          ElMessage.error('更新失败，请检查网络连接')
        } finally {
          // 无论成功失败，都关闭加载提示
          setTimeout(() => {
            loadingInstance.close()
          }, 300)
        }
      }
    })
  }

// 格式化日期时间
const formatDateTime = (dateTime) => {
  if (!dateTime) return '-'
  const date = new Date(dateTime)
  if (isNaN(date.getTime())) return '-'
  
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  
  return `${year}-${month}-${day} ${hours}:${minutes}`
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

<style>
:root {
  /* 全局深色科技感变量（保留原有基调，提亮文字） */
  --bg-dark: #0f172a; /* 页面主背景（原深色不变，保证科技感） */
  --bg-darker: #020617; /* 深层背景（原不变，增强层次） */
  --text-primary: #ffffff; /* 提亮为纯白！核心文字更醒目 */
  --text-secondary: #e0f2fe; /* 次要文字提亮为亮浅蓝 */
  --border-glass: rgba(138, 205, 236, 0.4); /* 边框透明度提高，更亮更醒目 */
  --glow-blue: 0 0 18px rgba(14, 165, 233, 0.7); /* 蓝光更亮，增强科技感 */
  --glow-green: 0 0 18px rgba(16, 185, 129, 0.7); /* 绿光同步提亮 */
  
  /* Element UI 全局覆盖变量（同步优化，保持蓝紫协调） */
  --el-bg-color: rgb(15, 23, 42); /* 组件基础背景（深色） */
  --el-text-color-primary: #38bdf8; /* 组件主文字（亮天蓝） */
  --el-border-color: rgba(14, 165, 233, 0.5); /* 边框透明度提高，更亮 */
  --el-color-primary: #38bdf8; /* 主色调（亮天蓝） */
  --el-text-color-regular: #38bdf8; /* table文字颜色 */
  /* 补充缺失变量，优化细节 */
  --el-text-color-secondary: #e0f2fe; /* 次要文字同步提亮 */
  --el-text-color-placeholder: #93c5fd; /* 占位文字提亮，避免过暗 */
  --el-border-color-hover: rgba(14, 165, 233, 0.8); /* hover 边框更亮 */
  /* 新增：输入框专属深色背景（核心优化） */
  --el-input-bg: #0f172a; /* 输入框/下拉框深色背景，比组件背景更深 */
  --el-input-hover-bg: #1e293b; /* 输入框hover背景 */
}
</style>

<!-- 2. 页面核心样式：作用域内的公共样式 + 组件基础样式 -->
<style scoped>
/* ==========================================
   一、页面布局与全局容器样式（最顶层结构）
   ========================================== */
.user-home {
  max-width: 1200px;
  margin:  20px,auto;
  padding: 0 var(--spacing-md);
  min-height: 100vh;
  background-color: var(--bg-dark);
  color: var(--text-primary);
}

/* 仅在暗色模式下将页面容器背景设为 #182131 */
:deep([data-theme="dark"] .user-home) {
  background-color: #182131 !important;
}

/* ==========================================
   二、公共组件样式（页面内复用的基础组件）
   ========================================== */
/* 卡片基础样式（所有 el-card 通用） */
.el-card {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border: 2px solid var(--border-glass);
  border-radius: 16px !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  margin: 10px 10px;
}

.el-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--glow-blue), 0 8px 32px rgba(0, 0, 0, 0.2);
  border-color: var(--el-color-primary);
}

/* 卡片头部通用样式 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--el-color-primary);
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

/* 按钮基础样式（页面内非对话框按钮） */
.el-button {
  transition: all 0.3s ease;
  border-radius: 6px;
}

/* 文本按钮样式 */
.el-button--text {
  color: var(--el-color-primary) !important;
  font-weight: 500;
}

.el-button--text:hover {
  color: #66b1ff !important;
  text-decoration: underline;
}

/* ==========================================
   三、核心优化：输入框/下拉框/数字输入框样式
   （深色背景 + 浅色文字，确保可读性）
   ========================================== */
/* 输入框/下拉框/数字输入框 容器 */
:deep(.el-input__wrapper),
:deep(.el-select__wrapper),
:deep(.el-input-number) {
  background-color: var(--el-input-bg) !important; /* 核心：深色背景 */
  border: 1.5px solid var(--el-border-color) !important;
  border-radius: 8px !important;
  box-shadow: 0 0 0 1px rgba(14, 165, 233, 0.15) !important;
  transition: all 0.3s ease;
}

/* 输入框/下拉框 hover 状态 */
:deep(.el-input__wrapper:hover),
:deep(.el-select__wrapper:hover),
:deep(.el-input-number:hover) {
  background-color: var(--el-input-hover-bg) !important; /* hover 加深背景 */
  border-color: var(--el-border-color-hover) !important;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.2) !important;
}

/* 输入框/下拉框 聚焦状态 */
:deep(.el-input__wrapper.is-focus),
:deep(.el-input__wrapper:focus-within),
:deep(.el-select__wrapper:focus-within) {
  border-color: var(--el-color-primary) !important;
  box-shadow: 0 0 0 2px rgba(14, 165, 233, 0.3), 0 0 10px rgba(14, 165, 233, 0.5) !important;
}

/* 输入框内部文字 */
:deep(.el-input__inner),
:deep(.el-select__input),
:deep(.el-select__selected-item),
:deep(.el-input-number__input) {
  color: var(--el-text-color-primary) !important; /* 亮天蓝文字，对比清晰 */
  background-color: transparent !important; /* 继承深色背景 */
  font-size: 15px !important;
}

/* 输入框光标颜色 */
:deep(.el-input__inner) {
  caret-color: var(--el-color-primary) !important; /* 天蓝光标，科技感 */
}

/* 占位符样式 */
:deep(.el-input__placeholder),
:deep(.el-select__placeholder) {
  color: var(--el-text-color-placeholder) !important; /* 淡天蓝占位符，不突兀 */
  opacity: 0.9 !important;
}

/* 数字输入框按钮 */
:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  color: var(--el-text-color-placeholder) !important;
  border-color: var(--el-border-color) !important;
  background-color: transparent !important;
}

:deep(.el-input-number__decrease:hover),
:deep(.el-input-number__increase:hover) {
  color: var(--el-text-color-primary) !important;
  background-color: rgba(14, 165, 233, 0.1) !important;
  border-color: var(--el-color-primary) !important;
}

/* 下拉框菜单样式 */
:deep(.el-select__popper) {
  background-color: var(--el-input-bg) !important; /* 下拉框深色背景 */
  border: 1px solid var(--el-border-color-hover) !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2) !important;
}

/* 下拉框选项 */
:deep(.el-select__option) {
  color: var(--el-text-color-secondary) !important; /* 亮浅蓝选项文字 */
  padding: 10px 16px !important;
}

:deep(.el-select__option:hover) {
  background-color: rgba(14, 165, 233, 0.2) !important; /* 天蓝透明hover背景 */
  color: var(--el-text-color-primary) !important;
}

:deep(.el-select__option--selected) {
  background-color: rgba(14, 165, 233, 0.3) !important; /* 选中背景 */
  color: var(--el-color-primary) !important; /* 选中文字提亮 */
}

/* ==========================================
   四、功能模块样式（按页面区域划分）
   ========================================== */
/* 1. 欢迎区域 */
.welcome-section {
  margin-bottom: var(--spacing-xl);
  text-align: center;
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  border-radius: 16px;
  border: 1px solid var(--border-glass);
  box-shadow: var(--glow-blue);
  animation: fadeInUp 0.6s ease-out;
  backdrop-filter: blur(10px);
}

.welcome-section h1 {
  font-size: 2.5rem;
  color: var(--el-color-primary);
  margin-bottom: var(--spacing-sm);
  font-weight: 700;
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.welcome-section p {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* 2. 快捷功能入口区域 */
.quick-access-section {
  margin-bottom: var(--spacing-xl);
}

.quick-card {
  height: 100%;
  overflow: hidden;
}

.quick-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md) 0;
  height: 100%;
}

.quick-card-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  font-size: 2.2rem;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.3);
  background: rgba(14, 165, 233, 0.1);
  border: 1px solid rgba(14, 165, 233, 0.3);
}

/* 快捷入口图标差异化样式 */
.health-icon {
  background-color: rgba(14, 165, 233, 0.1);
  color: var(--el-color-primary);
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.quick-card:hover .health-icon {
  background-color: var(--el-color-primary);
  color: white;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.7);
}

.mall-icon {
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.quick-card:hover .mall-icon {
  background-color: #10b981;
  color: white;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.7);
}

.service-icon {
  background-color: rgba(251, 191, 36, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.quick-card:hover .service-icon {
  background-color: #fbbf24;
  color: #0f172a;
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.7);
}

.record-icon {
  background-color: rgba(236, 72, 153, 0.1);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.quick-card:hover .record-icon {
  background-color: #ec4899;
  color: white;
  box-shadow: 0 0 20px rgba(236, 72, 153, 0.7);
}

.quick-card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

.quick-card-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin: 0;
  flex: 1;
}

/* 3. 主要内容区域（左右分栏） */
.main-content {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
  margin: 30px auto;
}

.left-panel {
  flex: 2;
}

.right-panel {
  flex: 1;
}

/* 区域标题通用样式 */
.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: var(--spacing-md);
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(14, 165, 233, 0.3);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

/* 4. 个人信息卡片 */
.info-card {
  margin-bottom: var(--spacing-lg);
}

.card-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.basic-info-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  padding: 0 var(--spacing-md) var(--spacing-md);
}

.basic-info-content .info-label {
  color: #7bbdff;
  font-weight: 500;
}

.basic-info-content .info-value {
  color: var(--text-primary);
  font-weight: 600;
}

/* 5. 健康数据区域 */
.health-section {
  margin-bottom: var(--spacing-lg);
}

.health-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: 10px;
}

.indicator-card {
  text-align: center;
  height: 100%;
}

.indicator-content {
  padding: var(--spacing-md) 0;
}

.latest-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: #10b981;
  text-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
  margin-bottom: var(--spacing-xs);
  transition: color 0.3s ease;
}

.indicator-card:hover .latest-value {
  color: #34d399;
  text-shadow: 0 0 15px rgba(16, 185, 129, 0.5);
}

.unit {
  font-size: 1rem;
  color: #94a3b8;
  margin-bottom: var(--spacing-sm);
}

.measure-time {
  font-size: 0.85rem;
  color: #64748b;
}

/* 6. 商城推荐区域 */
.mall-section {
  margin-bottom: var(--spacing-lg);
}

.mall-products {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.product-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  margin: 10px 10px;
}

.product-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--glow-blue), 0 8px 20px rgba(0, 0, 0, 0.2);
  border-color: var(--el-color-primary);
}

.product-image {
  width: 120px;
  height: 120px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-item:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  flex: 1;
}

.product-name {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #10b981;
  text-shadow: 0 0 5px rgba(16, 185, 129, 0.3);
}

.add-cart-btn {
  position: absolute;
  right: var(--spacing-md);
  background: linear-gradient(135deg, var(--el-color-primary), #0284c7) !important;
  color: white !important;
  border: none !important;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.add-cart-btn:hover {
  background: linear-gradient(135deg, #0284c7, #0369a1) !important;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5), inset 0 0 10px rgba(255, 255, 255, 0.2);
}

.view-more,
.view-all {
  text-align: center;
  margin-top: var(--spacing-md);
}

/* 7. 服务记录区域 */
.service-section {
  margin-bottom: var(--spacing-lg);
}

.service-card {
  height: 100%;
}

.service-content {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  padding: var(--spacing-md);
  gap: var(--spacing-md);
}

.service-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  flex: 1;
  margin-bottom: var(--spacing-md);
}

.service-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  border: 1px solid var(--border-glass);
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.service-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--glow-blue), 0 8px 20px rgba(0, 0, 0, 0.2);
  border-color: var(--el-color-primary);
}

.service-info {
  flex: 1;
}

.service-type {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.service-date,
.service-person {
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 3px;
}

.service-status {
  margin-left: var(--spacing-md);
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(14, 165, 233, 0.3);
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

/* ==========================================
   五、对话框样式（独立模块，优先级高于基础组件）
   ========================================== */
/* 对话框专属变量（复用全局变量，保持统一） */
.dark-tech-dialog {
  position: relative;
  box-sizing: border-box;
}

/* 1. 对话框外层容器（遮罩） */
:deep(.dark-tech-dialog .el-dialog__wrapper) {
  background-color: rgba(15, 23, 42, 0.85) !important;
  z-index: 2005 !important;
}

/* 2. 对话框主体容器 */
:deep(.dark-tech-dialog .el-dialog) {
  background: #182131 !important;
  border: 1px solid var(--el-border-color-hover) !important;
  border-radius: 20px !important;
  box-shadow: 
    0 0 0 1px rgba(14, 165, 233, 0.2),
    0 10px 30px rgba(0, 0, 0, 0.3),
    0 0 20px rgba(14, 165, 233, 0.1) !important;
  backdrop-filter: blur(10px) !important;
  position: relative;
  overflow: hidden;
  color: var(--el-text-color-primary) !important;
}

/* 对话框装饰线 */
:deep(.dark-tech-dialog .el-dialog::before),
:deep(.dark-tech-dialog .el-dialog::after) {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--el-color-primary), transparent);
}

:deep(.dark-tech-dialog .el-dialog::before) {
  top: 0;
}

:deep(.dark-tech-dialog .el-dialog::after) {
  bottom: 0;
}

/* 3. 对话框结构（Header/Body/Footer） */
:deep(.dark-tech-dialog .el-dialog__header),
:deep(.dark-tech-dialog .el-dialog__footer) {
  border-color: var(--el-border-color) !important;
  background: #182131 !important;
  color: var(--text-primary) !important;
}

:deep(.dark-tech-dialog .el-dialog__header) {
  border-bottom: 1px solid var(--el-border-color) !important;
  padding: 22px 24px 16px !important;
}

:deep(.dark-tech-dialog .el-dialog__body) {
  padding: 24px !important;
  color: var(--text-primary) !important;
  background-color: transparent !important;
}

:deep(.dark-tech-dialog .el-dialog__footer) {
  border-top: 1px solid var(--el-border-color) !important;
  padding: 16px 24px 22px !important;
}

/* 4. 对话框标题 */
:deep(.dark-tech-dialog .el-dialog__title) {
  color: var(--el-color-primary) !important;
  font-size: 1.3rem !important;
  font-weight: 700 !important;
  text-shadow: 0 0 8px rgba(14, 165, 233, 0.4), 0 1px 3px rgba(0, 0, 0, 0.4);
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
  position: relative;
  z-index: 1;
}

/* 5. 关闭按钮 */
:deep(.dark-tech-dialog .el-dialog__close) {
  color: var(--el-text-color-placeholder) !important;
  transition: all 0.3s ease;
  font-size: 18px;
}

:deep(.dark-tech-dialog .el-dialog__close:hover) {
  color: var(--text-primary) !important;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 50%;
}

/* 6. 对话框表单标签 */
:deep(.dark-tech-dialog .el-form-item__label) {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
  width: 120px !important; /* 保持原有宽度 */
}

:deep(.dark-tech-dialog .el-form-item__label.is-required::before) {
  content: "*";
  color: #f87171 !important;
  opacity: 0.9;
}

/* 7. 对话框按钮样式 */
/* 默认按钮（取消） */
:deep(.dark-tech-dialog .el-button--default) {
  background-color: var(--el-input-bg) !important;
  border-color: var(--el-border-color) !important;
  color: var(--el-text-color-primary) !important;
  padding: 10px 24px !important;
}

:deep(.dark-tech-dialog .el-button--default:hover) {
  background-color: var(--el-input-hover-bg) !important;
  border-color: var(--el-color-primary) !important;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.2) !important;
}

/* 主按钮（保存） */
:deep(.dark-tech-dialog .el-button--primary) {
  background: linear-gradient(135deg, var(--el-color-primary), #0284c7) !important;
  border: 1px solid var(--el-color-primary) !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 10px 24px !important;
}

:deep(.dark-tech-dialog .el-button--primary:hover) {
  background: linear-gradient(135deg, #0284c7, #0369a1) !important;
  border-color: #0277be !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.5), 0 0 30px rgba(14, 165, 233, 0.3) !important;
}

/* 按钮通用交互 */
:deep(.dark-tech-dialog .el-button) {
  position: relative;
  overflow: hidden !important;
}

:deep(.dark-tech-dialog .el-button:hover::before) {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(14, 165, 233, 0.2), transparent);
  transition: left 0.5s ease;
  left: 100%;
}

/* 个人信息详情对话框内容样式 */
:deep(.user-detail-content) {
  padding: var(--spacing-sm) 0;
  color: var(--text-primary) !important;
}

/* 用户头像和基本信息顶部区域 */
:deep(.user-profile-header) {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05));
  border-radius: 16px;
  border: 1px solid var(--el-border-color-hover);
  position: relative;
  overflow: hidden;
}

/* 用户头像 */
:deep(.user-avatar) {
  flex-shrink: 0;
}

:deep(.avatar-circle) {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--el-color-primary), #0284c7);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 2.2rem;
  font-weight: 700;
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.4);
  border: 2px solid rgba(255, 255, 255, 0.2);
}

/* 用户基本信息头部 */
:deep(.user-basic-header) {
  flex: 1;
}

:deep(.user-name) {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: var(--spacing-sm);
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
}

:deep(.user-badge) {
  display: flex;
  align-items: center;
}

/* 详情区域 */
:deep(.user-detail-content .detail-section) {
  margin-bottom: 24px;
  padding: 20px;
  background: rgba(15, 23, 42, 0.7);
  border-radius: 12px;
  border: 1px solid var(--el-border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
}

:deep(.user-detail-content .detail-section::before) {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--el-color-primary), transparent);
}

:deep(.user-detail-content .detail-section:hover) {
  transform: translateY(-2px);
  box-shadow: var(--glow-blue), 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--el-border-color-hover);
}

:deep(.user-detail-content .detail-section:last-child) {
  margin-bottom: 0;
}

/* 区域标题 */
:deep(.user-detail-content .section-subtitle) {
  color: var(--el-color-primary) !important;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--el-border-color);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
  position: relative;
  padding-left: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
  background-size: 200% 1px;
  background-position: 0 100%;
  background-repeat: no-repeat;
}

:deep(.user-detail-content .section-subtitle::before) {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 18px;
  background: linear-gradient(180deg, var(--el-color-primary), #66b1ff);
  border-radius: 3px;
  box-shadow: 0 0 10px var(--el-color-primary);
  animation: pulse-border 2s infinite;
}

/* 标题文字装饰 */
:deep(.user-detail-content .section-subtitle::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 20px;
  width: 30%;
  height: 2px;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
  border-radius: 1px;
}

/* 标题悬停效果 */
:deep(.user-detail-content .section-subtitle:hover) {
  color: #66b1ff !important;
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
  background-position: 100% 100%;
}

/* 边框脉冲动画 */
@keyframes pulse-border {
  0%, 100% {
    opacity: 0.8;
    box-shadow: 0 0 10px var(--el-color-primary);
  }
  50% {
    opacity: 1;
    box-shadow: 0 0 15px var(--el-color-primary), 0 0 20px rgba(14, 165, 233, 0.3);
  }
}

/* 信息网格布局 */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

/* 信息项 */
:deep(.detail-item) {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px 16px;
  position: relative;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* 信息项背景装饰 */
:deep(.detail-item::before) {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle, rgba(14, 165, 233, 0.1), transparent 70%);
  border-radius: 50%;
  transform: translate(40%, -40%);
  transition: all 0.3s ease;
}

/* 信息项悬停效果 */
:deep(.detail-item:hover) {
  border-color: var(--el-border-color-hover);
  background: rgba(15, 23, 42, 0.8);
  transform: translateX(4px);
  box-shadow: 0 2px 10px rgba(14, 165, 233, 0.1);
}

:deep(.detail-item:hover::before) {
  background: radial-gradient(circle, rgba(14, 165, 233, 0.2), transparent 70%);
  transform: translate(30%, -30%) scale(1.2);
}

/* 标签样式 */
:deep(.user-detail-content .detail-label) {
  color: #94a3b8 !important;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  position: relative;
  display: inline-block;
  transition: color 0.3s ease;
}

/* 标签悬停效果 */
:deep(.detail-item:hover .detail-label) {
  color: var(--el-color-primary) !important;
}

/* 值容器 */
:deep(.detail-value-container) {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  position: relative;
}

/* 值样式 */
:deep(.user-detail-content .detail-value) {
  color: var(--text-primary) !important;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
  padding: 4px 0;
}

/* 值悬停效果 */
:deep(.detail-item:hover .detail-value) {
  color: var(--el-color-primary-light-5) !important;
}

/* 值聚焦装饰线 */
:deep(.user-detail-content .detail-value::after) {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--el-color-primary), transparent);
  transition: width 0.3s ease;
}

:deep(.detail-item:hover .detail-value::after) {
  width: 100%;
}

/* 高亮代码样式 */
:deep(.highlight-code) {
  color: #34d399 !important;
  font-family: 'Courier New', monospace;
  background: rgba(16, 185, 129, 0.1);
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  font-weight: 600;
}

/* 详情提示 */
:deep(.detail-tooltip) {
  margin-left: 8px;
  font-size: 0.8rem;
  color: #94a3b8;
  background: rgba(148, 163, 184, 0.1);
  padding: 2px 6px;
  border-radius: 10px;
  border: 1px solid rgba(148, 163, 184, 0.2);
}

/* 联系方式操作按钮 */
:deep(.contact-action) {
  color: var(--el-color-primary) !important;
  margin-left: 8px !important;
  transition: all 0.3s ease;
}

:deep(.contact-action:hover) {
  color: #66b1ff !important;
  background: rgba(14, 165, 233, 0.1);
  transform: scale(1.1);
}

/* ==========================================
   六、动画与工具类样式（全局复用）
   ========================================== */
/* 淡入上移动画 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 加载骨架屏样式 */
.loading-skeleton {
  background: linear-gradient(90deg, #1e293b 25%, #2d3748 50%, #1e293b 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: var(--border-radius-base);
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ==========================================
   七、响应式样式（按屏幕尺寸从大到小）
   ========================================== */
/* 大屏优化（≥1200px） */
@media (min-width: 1200px) {
  .user-home {
    padding: 0 var(--spacing-lg);
  }
}

/* 中屏（平板横屏，992px-1199px） */
@media (max-width: 1199px) and (min-width: 992px) {
  .health-indicators {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 小屏（平板竖屏，768px-991px） */
@media (max-width: 991px) and (min-width: 768px) {
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

/* 超小屏（手机，≤767px） */
@media (max-width: 767px) {
  .user-home {
    padding: 0 var(--spacing-sm);
  }
  
  .welcome-section h1 {
    font-size: 1.8rem;
  }
  
  .quick-access-section .el-col {
    margin-bottom: var(--spacing-md);
  }
  
  .quick-card-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .basic-info-content {
    grid-template-columns: 1fr;
  }
  
  .health-indicators {
    grid-template-columns: 1fr;
  }
  
  .indicator-content .latest-value {
    font-size: 1.8rem;
  }
  
  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .product-image {
    width: 100px;
    height: 100px;
    margin-right: 0;
    margin-bottom: var(--spacing-sm);
  }
  
  .add-cart-btn {
    position: static;
    width: 100%;
    margin-top: var(--spacing-sm);
  }
  
  .service-item {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }
  
  .service-status {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }
  
  .card-actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
}

/* 极小型屏幕（≤360px） */
@media (max-width: 360px) {
  .user-home {
    padding: 0 var(--spacing-xs);
  }
  
  .welcome-section {
    padding: var(--spacing-lg) 0;
  }
  
  .welcome-section h1 {
    font-size: 1.6rem;
  }
  
  .quick-card-icon {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
  
  .indicator-content .latest-value {
    font-size: 1.5rem;
  }
}

/* ==========================================  
   八、微交互和动画效果（增强用户体验）
   ========================================== */

/* 对话框过渡动画 */
:deep(.user-detail-dialog .el-dialog__wrapper) {
  animation: dialogWrapperFade 0.4s ease-out;
}

:deep(.user-detail-dialog .el-dialog) {
  animation: dialogSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes dialogWrapperFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes dialogSlideIn {
  from {
    transform: translate(-50%, -40%) scale(0.95);
    opacity: 0;
  }
  to {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

/* 信息区块进入动画 */
.user-detail-content > * {
  animation: blockFadeInUp 0.5s ease-out backwards;
}

.user-detail-content > *:nth-child(1) {
  animation-delay: 0.1s;
}

.user-detail-content > *:nth-child(2) {
  animation-delay: 0.2s;
}

.user-detail-content > *:nth-child(3) {
  animation-delay: 0.3s;
}

.user-detail-content > *:nth-child(4) {
  animation-delay: 0.4s;
}

@keyframes blockFadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 骨架屏加载动画优化 */
.loading-skeleton {
  background: linear-gradient(
    90deg,
    rgba(30, 41, 59, 0.8) 25%,
    rgba(45, 55, 72, 0.6) 50%,
    rgba(30, 41, 59, 0.8) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: var(--border-radius-base);
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* 头像呼吸灯效果 */
:deep(.user-avatar-container) {
  position: relative;
}

:deep(.user-avatar-container::after) {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--el-color-primary), transparent);
  opacity: 0.3;
  animation: pulse 2.5s infinite;
  z-index: -1;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.6;
  }
}

/* 数字脉冲动画 */
@keyframes numberPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

:deep(.highlight-number) {
  display: inline-block;
  animation: numberPulse 2s infinite;
}

/* 信息项点击效果 */
:deep(.detail-item) {
  cursor: pointer;
  transition: all 0.2s ease;
}

:deep(.detail-item:active) {
  transform: scale(0.98) translateX(2px);
  box-shadow: 0 1px 5px rgba(14, 165, 233, 0.05);
}

/* 按钮交互增强 */
:deep(.action-buttons .el-button) {
  position: relative;
  overflow: hidden;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

:deep(.action-buttons .el-button::before) {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
  z-index: -1;
}

:deep(.action-buttons .el-button:hover::before) {
  width: 300px;
  height: 300px;
}

:deep(.action-buttons .el-button--primary::before) {
  background: rgba(255, 255, 255, 0.3);
}

/* 滚动条美化 */
:deep(.el-dialog__body)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep(.el-dialog__body)::-webkit-scrollbar-track {
  background: rgba(30, 41, 59, 0.5);
  border-radius: 3px;
}

:deep(.el-dialog__body)::-webkit-scrollbar-thumb {
  background: var(--el-color-primary);
  border-radius: 3px;
  transition: background 0.3s;
}

:deep(.el-dialog__body)::-webkit-scrollbar-thumb:hover {
  background: #66b1ff;
}

/* ==========================================  
   九、个人信息详情对话框专用响应式样式
   ========================================== */

/* 超大屏幕 - 1400px以上 */
@media (min-width: 1400px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 800px !important;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: row;
    gap: 40px;
    align-items: center;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: left;
    flex: 1;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 120px;
    height: 120px;
  }
  .detail-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
}

/* 大屏幕 - 1200px-1399px */
@media (min-width: 1200px) and (max-width: 1399px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 700px !important;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: row;
    gap: 30px;
    align-items: center;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: left;
    flex: 1;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 110px;
    height: 110px;
  }
  .detail-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 18px;
  }
}

/* 中屏幕 - 992px-1199px */
@media (min-width: 992px) and (max-width: 1199px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 600px !important;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: row;
    gap: 25px;
    align-items: center;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: left;
    flex: 1;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 100px;
    height: 100px;
  }
  .user-detail-content {
    padding: 20px 15px;
  }
  :deep(.user-detail-content .section-subtitle) {
    font-size: 1rem;
    padding-left: 16px;
  }
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

/* 小屏幕 - 768px-991px */
@media (min-width: 768px) and (max-width: 990px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 500px !important;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: center;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 90px;
    height: 90px;
  }
  .user-detail-content {
    padding: 15px 12px;
  }
  :deep(.user-detail-content .section-subtitle) {
    font-size: 0.95rem;
    padding-left: 14px;
    margin-bottom: 12px;
  }
  :deep(.detail-item) {
    padding: 10px 12px;
    gap: 6px;
  }
  :deep(.user-detail-content .detail-label) {
    font-size: 0.8rem;
  }
  :deep(.user-detail-content .detail-value) {
    font-size: 0.95rem;
  }
  .detail-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }
}

/* 平板端 - 576px-767px */
@media (min-width: 576px) and (max-width: 767px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 90% !important;
    margin: 5vh auto !important;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: center;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 80px;
    height: 80px;
  }
  .user-detail-content {
    padding: 12px 10px;
  }
  :deep(.user-detail-content .section-subtitle) {
    font-size: 0.9rem;
    padding-left: 12px;
    margin-bottom: 10px;
  }
  :deep(.detail-item) {
    padding: 8px 10px;
    gap: 5px;
  }
  :deep(.user-detail-content .detail-label) {
    font-size: 0.75rem;
  }
  :deep(.user-detail-content .detail-value) {
    font-size: 0.9rem;
  }
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

/* 科技感信息面板样式 - 全局应用 */
.user-detail-content {
  position: relative;
  padding: 20px 0;
}

/* 科技感装饰 */
.user-detail-content::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(46, 125, 255, 0.2) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* 用户头像区域增强 */
.user-profile-header {
  position: relative;
  z-index: 1;
}

.user-avatar .avatar-circle {
  position: relative;
  overflow: hidden;
}

.user-avatar .avatar-circle::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: linear-gradient(45deg, transparent 48%, rgba(255, 255, 255, 0.2) 49%, rgba(255, 255, 255, 0.2) 51%, transparent 52%);
  animation: shine 3s linear infinite;
}

@keyframes shine {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 信息分区样式 */
.detail-section {
  border: 1px solid var(--el-border-color);
  position: relative;
  overflow: hidden;
}

.detail-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--el-primary-color), transparent);
}

.detail-section::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--el-primary-color), transparent);
}

/* 科技感网格背景 */
.detail-grid {
  position: relative;
}

.detail-grid::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    linear-gradient(rgba(46, 125, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(46, 125, 255, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
  z-index: 0;
}

/* 信息项样式 */
.detail-item {
  position: relative;
  z-index: 1;
  transition: all 0.3s ease;
}

.detail-item:hover {
  background-color: rgba(46, 125, 255, 0.08);
  box-shadow: 0 2px 8px rgba(46, 125, 255, 0.1);
}

/* 标签样式增强 */
.detail-label {
  display: inline-block;
  padding: 2px 8px;
  background-color: rgba(46, 125, 255, 0.1);
  border-radius: 4px;
  border-left: 3px solid var(--el-primary-color);
}

/* 值样式增强 */
.detail-value {
  font-weight: 600;
  padding: 4px 0;
}

/* 高亮代码样式 */
.detail-value.highlight-code {
  font-family: 'Courier New', monospace;
  background-color: rgba(46, 125, 255, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
  border: 1px solid rgba(46, 125, 255, 0.2);
}

/* 移动端 - 小于576px */
@media (max-width: 575px) {
  :deep(.user-detail-dialog .el-dialog) {
    width: 95% !important;
    margin: 2vh auto !important;
    max-height: 95vh;
    overflow-y: auto;
  }
  :deep(.user-detail-content .avatar-section) {
    flex-direction: column;
    text-align: center;
    gap: 10px;
  }
  :deep(.user-detail-content .user-basic-info) {
    text-align: center;
  }
  :deep(.user-detail-content .user-avatar) {
    width: 70px;
    height: 70px;
  }
  :deep(.user-detail-content .user-name) {
    font-size: 1.2rem;
  }
  :deep(.user-detail-content .user-role) {
    font-size: 0.8rem;
  }
  .user-detail-content {
    padding: 10px 8px;
  }
  :deep(.user-detail-content .section-subtitle) {
    font-size: 0.85rem;
    padding-left: 10px;
    margin-bottom: 8px;
  }
  :deep(.detail-item) {
    padding: 6px 8px;
    gap: 4px;
    min-height: 60px; /* 触摸友好的高度 */
  }
  :deep(.user-detail-content .detail-label) {
    font-size: 0.7rem;
    letter-spacing: 0.4px;
  }
  :deep(.user-detail-content .detail-value) {
    font-size: 0.85rem;
  }
  .detail-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }
  /* 调整标题装饰元素 */
  :deep(.user-detail-content .section-subtitle::before) {
    width: 4px;
    height: 14px;
  }
}
</style>

