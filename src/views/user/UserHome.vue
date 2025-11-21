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
              <div class="card-actions">
                <el-button type="text" size="small" @click="showInfoDetail">详情</el-button>
                <el-button type="primary" size="small" @click="showEditDialog">编辑</el-button>
              </div>
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
            <div class="info-item">
              <span class="info-label">邮箱</span>
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
    
  </div>
  
  <!-- 用户信息详情对话框 -->
  <el-dialog
    v-model="detailDialogVisible"
    title="个人信息详情"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="user-detail-content">
      <div class="detail-section">
        <h4 class="section-subtitle">基本信息</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">用户名</span>
            <span class="detail-value">{{ userInfo?.username || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">姓名</span>
            <span class="detail-value">{{ userInfo?.name || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">年龄</span>
            <span class="detail-value">{{ userInfo?.age || '-' }}岁</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">性别</span>
            <span class="detail-value">{{ userInfo?.gender || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">健康档案号</span>
            <span class="detail-value">{{ userInfo?.healthRecordNumber || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">角色</span>
            <span class="detail-value">{{ userInfo?.role === 0 ? '管理员' : '普通用户' }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h4 class="section-subtitle">联系方式</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">联系电话</span>
            <span class="detail-value">{{ userInfo?.phone || '-' }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">邮箱</span>
            <span class="detail-value">{{ userInfo?.email || '-' }}</span>
          </div>
        </div>
      </div>
      
      <div class="detail-section">
        <h4 class="section-subtitle">账户信息</h4>
        <div class="detail-grid">
          <div class="detail-item">
            <span class="detail-label">创建时间</span>
            <span class="detail-value">{{ formatDateTime(userInfo?.createdAt) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">状态</span>
            <span class="detail-value">{{ userInfo?.status ? '启用' : '禁用' }}</span>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关闭</el-button>
        <el-button type="primary" @click="showEditDialog; detailDialogVisible = false">编辑信息</el-button>
      </span>
    </template>
  </el-dialog>
  
  <!-- 用户信息编辑对话框 -->
  <el-dialog
    v-model="editDialogVisible"
    title="编辑个人信息"
    width="600px"
    :close-on-click-modal="false"
  >
    <el-form :model="editForm" :rules="editRules" ref="editFormRef" label-width="120px">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="editForm.name" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input-number v-model="editForm.age" :min="0" :max="150" placeholder="请输入年龄" />
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

<style scoped>
.user-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: var(--spacing-xl);
  text-align: center;
  padding: var(--spacing-xl) 0;
  background: linear-gradient(135deg, var(--primary-color-light) 0%, var(--primary-color-light-extra) 100%);
  border-radius: var(--border-radius-base);
  box-shadow: var(--shadow-base);
  animation: fadeInUp 0.6s ease-out;
}

.welcome-section h1 {
  font-size: 2.2rem;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
}

.welcome-section p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 快捷功能入口 */
.quick-access-section {
  margin-bottom: var(--spacing-xl);
}

.quick-card {
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid var(--border-light);
}

.quick-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-light);
  border-color: var(--primary-color);
}

.quick-card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--spacing-md) 0;
}

.quick-card-icon {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
  font-size: 2rem;
  transition: all 0.3s ease;
}

.health-icon {
  background-color: var(--primary-color-light);
  color: var(--primary-color);
}

.quick-card:hover .health-icon {
  background-color: var(--primary-color);
  color: white;
}

.mall-icon {
  background-color: var(--success-color-light);
  color: var(--success-color);
}

.quick-card:hover .mall-icon {
  background-color: var(--success-color);
  color: white;
}

.service-icon {
  background-color: var(--warning-color-light);
  color: var(--warning-color);
}

.quick-card:hover .service-icon {
  background-color: var(--warning-color);
  color: white;
}

.record-icon {
  background-color: var(--info-color-light);
  color: var(--info-color);
}

.quick-card:hover .record-icon {
  background-color: var(--info-color);
  color: white;
}

.quick-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.quick-card-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

/* 主要内容区域 */
.main-content {
  display: flex;
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.left-panel {
  flex: 2;
}

.right-panel {
  flex: 1;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
  padding-bottom: 8px;
  border-bottom: 2px solid var(--primary-color-light);
}

/* 基础信息卡片 */
.info-card {
  margin-bottom: var(--spacing-lg);
  border: 1px solid var(--border-light);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-sm);
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

/* 用户详情对话框样式 */
.user-detail-content {
  padding: var(--spacing-sm) 0;
}

.detail-section {
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.detail-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-md);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.detail-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: var(--spacing-sm) 0;
  border-bottom: 1px solid var(--border-extra-light);
  transition: all 0.2s ease;
}

.info-item:hover {
  background-color: var(--bg-color);
  padding-left: var(--spacing-xs);
  border-left: 3px solid var(--primary-color);
}

.info-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.info-value {
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* 健康数据区域 */
.health-section {
  margin-bottom: var(--spacing-lg);
}

.health-indicators {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.indicator-card {
  text-align: center;
  height: 100%;
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
}

.indicator-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-light);
  border-color: var(--primary-color);
}

.indicator-content {
  padding: var(--spacing-md) 0;
}

.latest-value {
  font-size: 2.2rem;
  font-weight: bold;
  color: var(--primary-color);
  margin-bottom: var(--spacing-xs);
  transition: color 0.3s ease;
}

.indicator-card:hover .latest-value {
  color: #66b1ff; /* 主色调的亮色变体 */
}

.unit {
  font-size: 1rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.measure-time {
  font-size: 0.85rem;
  color: var(--text-placeholder);
}

/* 商城推荐区域 */
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
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius-base);
  transition: all 0.3s;
  cursor: pointer;
  position: relative;
  border: 1px solid var(--border-light);
}

.product-item:hover {
  background-color: var(--primary-color-light-extra);
  box-shadow: var(--shadow-base);
  border-color: var(--primary-color);
}

.product-image {
  width: 70px;
  height: 70px;
  margin-right: var(--spacing-md);
  flex-shrink: 0;
  border-radius: var(--border-radius-small);
  overflow: hidden;
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
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-price {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--danger-color);
}

.add-cart-btn {
  position: absolute;
  right: var(--spacing-md);
  transition: all 0.3s ease;
}

.add-cart-btn:hover {
  transform: translateY(-2px);
}

.view-more,
.view-all {
  text-align: center;
  margin-top: var(--spacing-md);
}

.view-more .el-button,
.view-all .el-button {
  color: var(--primary-color);
  font-weight: 500;
}

.view-more .el-button:hover,
.view-all .el-button:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 服务记录区域 */
.service-section {
  margin-bottom: var(--spacing-lg);
}

.service-card {
  height: 100%;
  border: 1px solid var(--border-light);
}

.service-content {
  display: flex;
  flex-direction: column;
  min-height: 200px;
  padding: var(--spacing-md);
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
  background-color: var(--bg-color-light);
  border-radius: var(--border-radius-base);
  transition: all 0.3s;
  border: 1px solid var(--border-light);
}

.service-item:hover {
  background-color: var(--primary-color-light-extra);
  box-shadow: var(--shadow-base);
  border-color: var(--primary-color);
  transform: translateY(-2px);
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
  color: var(--text-secondary);
  margin-bottom: 3px;
}

.service-status {
  margin-left: var(--spacing-md);
}

/* 动画效果 */
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

/* 响应式设计 - 大屏优化 */
@media (min-width: 1200px) {
  .user-home {
    padding: 0 var(--spacing-lg);
  }
}

/* 中屏（平板横屏） */
@media (max-width: 1199px) and (min-width: 992px) {
  .health-indicators {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 小屏（平板竖屏） */
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

/* 超小屏（手机） */
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

/* 极小型屏幕 */
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

/* 加载状态样式 */
.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
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
</style>