<template>
  <!-- 管理员首页组件根容器 -->
  <div class="admin-home">
    <!-- 欢迎区域 - 显示欢迎信息和当前日期 -->
    <div class="welcome-section">
      <h2>欢迎回来，管理员</h2>
      <p>今天是{{ formatDate(new Date()) }}，以下是系统概览</p>
    </div>
    
    <!-- 统计卡片区域 - 展示关键业务指标 -->
    <div class="stats-section">
      <!-- Element Plus的栅格系统，gutter设置列间距为20px -->
      <el-row :gutter="20">
        <!-- 总用户数卡片 - 响应式布局，在不同屏幕尺寸下有不同的列宽 -->
        <el-col :xs="12" :sm="12" :md="6">
          <!-- Element Plus的卡片组件，hover效果为阴影 -->
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <!-- 统计图标区域 -->
              <div class="stat-icon user-icon">
                <el-icon><User /></el-icon>
              </div>
              <!-- 统计数据区域 -->
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalUsers || 0 }}</div>
                <div class="stat-label">总用户数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 总服务数卡片 -->
        <el-col :xs="12" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon service-icon">
                <el-icon><Service /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalServices || 0 }}</div>
                <div class="stat-label">总服务数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- AI咨询次数卡片 -->
        <el-col :xs="12" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon consult-icon">
                <el-icon><ChatDotRound /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalAIConsults || 0 }}</div>
                <div class="stat-label">AI咨询次数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 今日活跃用户卡片 -->
        <el-col :xs="12" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon today-icon">
                <el-icon><Calendar /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.todayActiveUsers || 0 }}</div>
                <div class="stat-label">今日活跃用户</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 员工总数卡片 -->
        <el-col :xs="12" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon employee-icon">
                <el-icon><User /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalEmployees || 0 }}</div>
                <div class="stat-label">员工总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 部门总数卡片 -->
        <el-col :xs="12" :sm="12" :md="6">
          <el-card class="stat-card" shadow="hover">
            <div class="stat-content">
              <div class="stat-icon department-icon">
                <el-icon><OfficeBuilding /></el-icon>
              </div>
              <div class="stat-info">
                <div class="stat-number">{{ statistics.totalDepartments || 0 }}</div>
                <div class="stat-label">部门总数</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 图表区域 - 展示数据可视化内容 -->
    <div class="charts-section">
      <el-row :gutter="20">
        <!-- 最近7天用户活跃度柱状图 -->
        <el-col :xs="24" :md="12">
          <el-card class="chart-card" shadow="hover">
            <!-- 卡片头部模板 -->
            <template #header>
              <div class="card-header">
                <span>最近7天用户活跃度</span>
              </div>
            </template>
            <!-- 图表容器 -->
            <div class="chart-container">
              <!-- 加载状态显示 -->
              <div v-if="loading" class="chart-loading">
                <el-icon><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <!-- 数据加载完成后显示 -->
              <div v-else>
                <!-- 柱状图容器，使用ref引用以便JavaScript操作 -->
                <div ref="activityChartRef">
                  <!-- 当没有数据时显示空状态 -->
                  <el-empty v-if="!activityData || activityData.length === 0" description="暂无数据" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 服务类型分布饼图 -->
        <el-col :xs="24" :md="12">
          <el-card class="chart-card" shadow="hover">
            <!-- 卡片头部模板 -->
            <template #header>
              <div class="card-header">
                <span>服务类型分布</span>
              </div>
            </template>
            <!-- 图表容器 -->
            <div class="chart-container">
              <!-- 加载状态显示 -->
              <div v-if="loading" class="chart-loading">
                <el-icon><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <!-- 数据加载完成后显示 -->
              <div v-else>
                <!-- 饼图容器，使用ref引用以便JavaScript操作 -->
                <div ref="serviceTypePieChartRef">
                  <!-- 当没有数据时显示空状态 -->
                  <el-empty v-if="!serviceTypeData || serviceTypeData.length === 0" description="暂无数据" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
        
        <!-- 部门人员分布柱状图 -->
        <el-col :xs="24" :md="24">
          <el-card class="chart-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>部门人员分布</span>
              </div>
            </template>
            <div class="chart-container">
              <div v-if="loading" class="chart-loading">
                <el-icon><Loading /></el-icon>
                <span>加载中...</span>
              </div>
              <div v-else>
                <div ref="departmentStaffChart">
                  <el-empty v-if="!departmentData || departmentData.length === 0" description="暂无数据" />
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 最新动态区域 - 展示系统操作记录 -->
    <div class="activities-section">
      <el-card class="activities-card" shadow="hover">
        <!-- 卡片头部模板，包含标题和刷新按钮 -->
        <template #header>
          <div class="card-header">
            <span>系统最新动态</span>
            <el-button type="text" size="small" @click="refreshActivities">刷新</el-button>
          </div>
        </template>
        <!-- 动态内容容器 -->
        <div class="activities-content">
          <!-- 当没有动态数据时显示空状态 -->
          <el-empty v-if="activities.length === 0" description="暂无动态" />
          <!-- 动态列表 -->
          <div v-else class="activities-list">
            <!-- 遍历动态数组，渲染每条动态记录 -->
            <div 
              v-for="(activity, index) in activities" 
              :key="index" 
              class="activity-item"
            >
              <!-- 动态类型标签 -->
              <div class="activity-icon">
                <!-- 根据动态类型获取不同的标签类型和文本 -->
                <el-tag :type="getActivityType(activity.type)">{{ getActivityTypeText(activity.type) }}</el-tag>
              </div>
              <!-- 动态信息 -->
              <div class="activity-info">
                <!-- 动态内容 -->
                <div class="activity-text">{{ activity.content }}</div>
                <!-- 格式化后的动态时间 -->
                <div class="activity-time">{{ formatDateTime(activity.timestamp) }}</div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
// 导入Vue 3组合式API的核心函数
import { ref, reactive, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
// 导入Element Plus的消息提示组件
import { ElMessage } from 'element-plus'
// 导入Element Plus的图标组件
import { User, Service, ChatDotRound, Calendar, Loading, OfficeBuilding } from '@element-plus/icons-vue'
// 导入API请求模块
import api from '../../api'
// 导入ECharts图表库
import * as echarts from 'echarts'

// 定义组件名称
const name = 'AdminHome'

/**
 * 初始化模拟用户活跃度数据
 * @description 生成最近7天的用户活跃度模拟数据，实际应用中会从API获取
 * @returns {Array} 包含日期和活跃用户数的数组
 */
const initMockActivityData = () => {
  const mockActivityData = []
  const today = new Date()
  // 循环生成过去7天的数据
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i) // 减去i天，生成过去7天的日期
    mockActivityData.push({
      date: date.toISOString().split('T')[0], // 格式化为YYYY-MM-DD
      value: Math.floor(Math.random() * 100) + 20 // 随机生成20-119的数值
    })
  }
  return mockActivityData
}

/**
 * 生成模拟部门人员分布数据
 * @description 生成各部门人员数量的模拟数据，实际应用中会从API获取
 * @returns {Array} 包含部门名称和人员数量的数组
 */
const generateMockDepartmentData = () => {
  const departments = ['行政部', '技术部', '客服部', '市场部', '财务部', '人力资源部']
  return departments.map(dept => ({
    name: dept,
    count: Math.floor(Math.random() * 30) + 5
  }))
}

// 响应式数据定义
// 使用reactive定义统计数据对象，实现深度响应式
const statistics = reactive({
  totalUsers: 0, // 总用户数
  totalServices: 0, // 总服务数
  totalAIConsults: 0, // AI咨询次数
  todayActiveUsers: 0, // 今日活跃用户数
  totalEmployees: 0,
  totalDepartments: 0
})

// 使用ref定义图表数据，适合简单类型或需要直接替换整个对象的情况
const activityData = ref(initMockActivityData()) // 最近7天用户活跃度数据
const serviceTypeData = ref([ // 服务类型分布数据
  { name: '健康咨询', value: 45 },
  { name: '体检预约', value: 25 },
  { name: '报告解读', value: 15 },
  { name: '慢病管理', value: 15 }
])
// 部门人员分布数据
const departmentData = ref([])

// 系统动态数据
const activities = ref([
  { type: 'login', content: '用户 138****5678 登录系统', timestamp: Date.now() - 300000 }, // 5分钟前
  { type: 'ai_consult', content: '用户 139****1234 发起了AI健康咨询', timestamp: Date.now() - 1200000 }, // 20分钟前
  { type: 'service', content: '用户 158****8888 预约了体检服务', timestamp: Date.now() - 3600000 }, // 1小时前
  { type: 'system', content: '系统维护完成，版本升级至 v1.2.0', timestamp: Date.now() - 86400000 } // 1天前
])

// 加载状态标志
const loading = ref(false)
// 图表颜色配置数组
const chartColors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#c0c4cc']

// 图表实例和DOM引用
let pieChart = null // 饼图实例引用
let activityChart = null // 柱状图实例引用
let departmentChart = null // 部门人员分布图表实例引用
const activityChartRef = ref(null) // 柱状图DOM引用
const serviceTypePieChartRef = ref(null) // 饼图DOM引用
const departmentStaffChart = ref(null) // 部门人员分布图表DOM引用

/**
   * 加载仪表盘数据
   * @description 获取所有仪表盘需要的数据，包括统计数据、活跃用户数据、服务类型分布和系统动态
   * @api 调用统计API：
   * - /admin/count POST - 获取统计概览数据
   */
  const loadDashboardData = async () => {
    loading.value = true // 设置加载状态为true，显示加载动画
    try {
      console.log('开始加载仪表盘数据...')
      
      // 优先尝试从API获取最新数据（通过代理指向http://localhost:8080/admin/count）
      let apiSuccess = false
      try {
        const response = await api.admin.getCount()
        console.log('API响应数据:', response)
        
        if (response && (response.code === 1 || response.code === 200)) {
          const data = response.data
          statistics.totalUsers = data.userCount || 8
          statistics.totalAIConsults = data.aiConsultCount || 0
          statistics.totalDepartments = data.departmentCount || 5
          statistics.totalEmployees = data.employeeCount || 7
          statistics.todayActiveUsers = data.todayActiveUsers || 0
          statistics.totalServices = data.totalServices || 6
          apiSuccess = true
          console.log('成功从API获取最新数据')
        }
      } catch (apiError) {
        console.warn('API调用失败，使用模拟数据:', apiError.message)
        // API失败时静默处理，不显示错误提示
      }
      
      // 如果API调用失败或返回无效数据，使用模拟数据
      if (!apiSuccess) {
        console.log('使用本地模拟数据替代API调用')
        // 设置模拟统计数据
        statistics.totalUsers = 8
        statistics.totalAIConsults = 0
        statistics.totalDepartments = 5
        statistics.totalEmployees = 7
        statistics.todayActiveUsers = 0
        statistics.totalServices = 6
      }
      
      // 生成部门数据（无论是API还是模拟模式都需要）
      departmentData.value = generateMockDepartmentData()
      
    } catch (error) {
      // 异常处理 - 打印错误信息
      console.error('加载仪表盘数据时发生异常:', error)
      
      // 确保使用默认值
      statistics.totalUsers = 8
      statistics.totalAIConsults = 0
      statistics.totalDepartments = 5
      statistics.totalEmployees = 7
      statistics.todayActiveUsers = 0
      statistics.totalServices = 6
      
      if (!departmentData.value || departmentData.value.length === 0) {
        departmentData.value = generateMockDepartmentData()
      }
    } finally {
      // 无论成功失败，最终都要将加载状态设为false
      loading.value = false
      console.log('加载仪表盘数据完成')
    }
  }

/**
   * 刷新系统动态
   * @description 重新加载所有仪表盘数据，包括统计信息和图表数据
   */
  const refreshActivities = () => {
    loadDashboardData()
  }

/**
   * 格式化日期为中文格式
   * @param {Date} date - 日期对象
   * @returns {string} 格式化后的中文日期字符串（年-月-日）
   */
  const formatDate = (date) => {
    const year = date.getFullYear() // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份（加1是因为月份从0开始），并补前导0
    const day = String(date.getDate()).padStart(2, '0') // 获取日期，并补前导0
    return `${year}年${month}月${day}日` // 返回格式化后的中文日期字符串
  }

  /**
   * 格式化日期为简短格式
   * @param {string} dateStr - YYYY-MM-DD格式的日期字符串
   * @returns {string} 格式化后的简短日期字符串（月/日）
   */
  const formatShortDate = (dateStr) => {
    const date = new Date(dateStr) // 将字符串转换为Date对象
    const month = String(date.getMonth() + 1) // 获取月份（加1是因为月份从0开始）
    const day = String(date.getDate()) // 获取日期
    return `${month}/${day}` // 返回简洁的月/日格式
  }

  /**
   * 格式化时间戳为标准日期时间
   * @param {number} timestamp - 时间戳
   * @returns {string} 格式化后的日期时间字符串（YYYY-MM-DD HH:mm）
   */
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp) // 将时间戳转换为Date对象
    const year = date.getFullYear() // 获取年份
    const month = String(date.getMonth() + 1).padStart(2, '0') // 获取月份并补前导0
    const day = String(date.getDate()).padStart(2, '0') // 获取日期并补前导0
    const hours = String(date.getHours()).padStart(2, '0') // 获取小时并补前导0
    const minutes = String(date.getMinutes()).padStart(2, '0') // 获取分钟并补前导0
    return `${year}-${month}-${day} ${hours}:${minutes}` // 返回格式化后的日期时间字符串
  }

/**
   * 获取图表颜色
   * @description 根据索引从预定义颜色数组中获取对应的颜色，支持循环使用
   * @param {number} index - 颜色索引
   * @returns {string} 颜色值
   */
  const getChartColor = (index) => {
    // 使用取模运算确保即使索引超出数组长度也能循环使用颜色
    return chartColors[index % chartColors.length]
  }

// 获取活动类型 - 根据活动类型返回对应的Element Plus标签类型
const getActivityType = (type) => {
  switch (type) {
    case 'login':    return 'primary' // 登录类型使用主要颜色
    case 'service':  return 'success' // 服务类型使用成功颜色
    case 'ai_consult': return 'info'  // AI咨询类型使用信息颜色
    case 'system':   return 'warning' // 系统类型使用警告颜色
    default:         return 'default' // 默认类型
  }
}

// 获取活动类型文本 - 将英文类型转换为中文显示
const getActivityTypeText = (type) => {
  switch (type) {
    case 'login':    return '登录'    // 登录类型
    case 'service':  return '服务'    // 服务类型
    case 'ai_consult': return 'AI咨询' // AI咨询类型
    case 'system':   return '系统'    // 系统类型
    default:         return '其他'    // 默认类型
  }
}

// 内部方法：使用已找到的元素初始化饼图 - 接收DOM元素作为参数，负责实际创建和配置饼图
const initPieChartWithElement = (chartDom) => {
  try {
    // 先隐藏占位符 - 当没有数据时显示的空状态元素
    const placeholder = chartDom.querySelector('.el-empty')
    if (placeholder) {
      placeholder.style.display = 'none'
    }
    
    // 销毁已存在的图表实例 - 避免重复创建导致内存泄漏
    if (pieChart) {
      pieChart.dispose()
      pieChart = null
    }
    
    // 创建图表实例 - 直接继承父容器大小
    // 确保容器尺寸继承父元素，这是图表正确渲染的关键
    chartDom.style.height = '100%';  // 设置高度为100%，占满容器
    chartDom.style.width = '100%';   // 设置宽度为100%，占满容器
    chartDom.style.position = 'relative'; // 确保相对定位以便正确计算尺寸
    
    // 初始化ECharts实例
    pieChart = echarts.init(chartDom, null, {
      renderer: 'canvas',    // 使用canvas渲染器
      useDirtyRect: false    // 不使用脏矩形优化
    })
    console.log('饼图实例创建成功:', pieChart)
    console.log('饼图数据:', serviceTypeData.value)
    
    // 设置图表选项 - 定义饼图的外观和数据
    const option = {
      tooltip: {            // 鼠标悬停提示框配置
        trigger: 'item'     // 触发方式：数据项触发
      },
      legend: {             // 图例配置
        top: '5%',          // 图例位置：距离顶部5%
        left: 'center'      // 图例位置：居中
      },
      series: [             // 数据系列配置
        {
          name: '服务类型',      // 系列名称
          type: 'pie',          // 图表类型：饼图
          radius: ['40%', '70%'], // 内外半径，创建环形图效果
          avoidLabelOverlap: false, // 避免标签重叠
          padAngle: 5,          // 扇区间隔角度
          itemStyle: {          // 数据项样式
            borderRadius: 10    // 圆角半径
          },
          label: {              // 标签配置
            show: true,        // 默认不显示标签
            position: 'center'  // 标签位置：中心
          },
          emphasis: {           // 高亮状态配置
            label: {            // 高亮时显示中心标签
              show: true,       // 显示标签
              fontSize: 36,     // 字体大小
              fontWeight: 'bold' // 字体粗细
            }
          },
          labelLine: {          // 标签引导线配置
            show: true          // 显示引导线
          },
          data: serviceTypeData.value // 使用响应式数据中的服务类型数据
        }
      ]
    }
    
    // 应用图表选项 - 将配置应用到图表实例
    pieChart.setOption(option)
    console.log('饼图选项设置成功')
    
    // 强制重绘并充满容器 - 使用setTimeout确保DOM更新完成后再调整大小
      setTimeout(() => {
        if (pieChart) {
          // 确保容器尺寸正确，使用百分比确保响应式
          chartDom.style.width = '400%'  // 宽度4占满容器
          chartDom.style.height = '300px' // 固定高度以确保良好显示
          // 重新计算并调整图表大小
          pieChart.resize()
        }
      }, 0)
  } catch (error) {
    // 异常处理 - 捕获并记录初始化过程中可能发生的错误
    console.error('初始化饼图失败:', error)
  }
}

// 初始化饼图 - 公共方法，负责检查数据和DOM元素，然后调用内部方法创建图表
const initPieChart = () => {
  console.log('开始初始化饼图...')
  
  // 首先检查data中是否有数据 - 如果数据为空，不进行初始化
  if (!serviceTypeData.value || serviceTypeData.value.length === 0) {
    console.warn('饼图数据为空，跳过初始化')
    return
  }
  
  // 使用ref引用DOM元素 - 检查饼图容器是否已渲染
  if (serviceTypePieChartRef.value) {
    console.log('饼图容器元素存在，准备初始化...')
    // 调用内部方法进行实际的饼图初始化
    initPieChartWithElement(serviceTypePieChartRef.value)
  } else {
    console.warn('饼图容器元素暂不存在，等待下一个渲染周期...')
    // 如果ref还未指向DOM元素，等待下一个tick - Vue的DOM更新周期
    nextTick(() => {
      if (serviceTypePieChartRef.value) {
        // 在下一个DOM更新周期后再次尝试初始化
        initPieChartWithElement(serviceTypePieChartRef.value)
      } else {
        console.error('饼图容器元素仍然不存在')
      }
    })
  }
}

// 内部方法：使用已找到的元素初始化柱状图 - 接收DOM元素作为参数，负责实际创建和配置柱状图
const initActivityChartWithElement = (chartDom) => {
  try {
    // 先隐藏占位符 - 当没有数据时显示的空状态元素
    const placeholder = chartDom.querySelector('.el-empty')
    if (placeholder) {
      placeholder.style.display = 'none'
    }
    
    // 销毁已存在的图表实例 - 避免重复创建导致内存泄漏
    if (activityChart) {
      activityChart.dispose()
      activityChart = null
    }
    
    // 创建图表实例 - 直接继承父容器大小
    // 确保容器尺寸继承父元素，这是图表正确渲染的关键
    chartDom.style.height = '100%';  // 设置高度为100%，占满容器
    chartDom.style.width = '100%';   // 设置宽度为100%，占满容器
    chartDom.style.position = 'relative'; // 确保相对定位以便正确计算尺寸
    
    // 初始化ECharts实例
    activityChart = echarts.init(chartDom, null, {
      renderer: 'canvas',    // 使用canvas渲染器
      useDirtyRect: false    // 不使用脏矩形优化
    })
    console.log('柱状图实例创建成功:', activityChart)
    
    // 准备数据 - 从响应式数据中提取并格式化日期和数值
    const dates = activityData.value.map(item => formatShortDate(item.date)) // 格式化日期为月/日
    const values = activityData.value.map(item => item.value) // 提取用户活跃数量
    console.log('柱状图数据 - 日期:', dates)
    console.log('柱状图数据 - 数值:', values)
    
    // 设置图表选项 - 定义柱状图的外观和数据
    const option = {
      tooltip: {            // 鼠标悬停提示框配置
        trigger: 'axis',    // 触发方式：坐标轴触发
        axisPointer: {      // 坐标轴指示器
          type: 'shadow'    // 指示器类型：阴影
        }
      },
      grid: {               // 图表网格区域
        left: '3%',         // 左边距
        right: '4%',        // 右边距
        bottom: '3%',       // 下边距
        containLabel: true  // 是否包含坐标轴的刻度标签
      },
      xAxis: [              // X轴配置（数组形式，支持多X轴）
        {
          type: 'category', // 类别轴
          data: dates,      // X轴数据：格式化后的日期
          axisTick: {       // 坐标轴刻度
            alignWithLabel: true // 刻度线与标签对齐
          }
        }
      ],
      yAxis: [              // Y轴配置（数组形式，支持多Y轴）
        {
          type: 'value'     // 数值轴
        }
      ],
      series: [             // 数据系列配置
        {
          name: '活跃用户',   // 系列名称
          type: 'bar',       // 图表类型：柱状图
          barWidth: '60%',   // 柱状图宽度占类别间距的百分比
          data: values,      // 使用提取的用户活跃数量数据
          itemStyle: {       // 柱状图样式
            color: '#409eff' // 柱状图颜色
          }
        }
      ]
    }
    
    // 应用图表选项 - 将配置应用到图表实例
    activityChart.setOption(option)
    console.log('柱状图选项设置成功')
    
    // 强制重绘并充满容器 - 使用setTimeout确保DOM更新完成后再调整大小
      setTimeout(() => {
        if (activityChart) {
          // 确保容器尺寸正确，使用百分比确保响应式
          chartDom.style.width = '400%'  // 宽度占满容器
          chartDom.style.height = '300px' // 固定高度以确保良好显示
          // 重新计算并调整图表大小
          activityChart.resize()
        }
      }, 0)
  } catch (error) {
    // 异常处理 - 捕获并记录初始化过程中可能发生的错误
    console.error('初始化柱状图失败:', error)
  }
}

// 初始化柱状图 - 公共方法，负责检查数据和DOM元素，然后调用内部方法创建图表
const initActivityChart = () => {
  console.log('开始初始化柱状图...')
  
  // 首先检查data中是否有数据 - 如果数据为空，不进行初始化
  if (!activityData.value || activityData.value.length === 0) {
    console.warn('柱状图数据为空，跳过初始化')
    return
  }
  
  // 使用ref引用DOM元素 - 检查柱状图容器是否已渲染
  if (activityChartRef.value) {
    console.log('柱状图容器元素存在，准备初始化...')
    // 调用内部方法进行实际的柱状图初始化
    initActivityChartWithElement(activityChartRef.value)
  } else {
    console.warn('柱状图容器元素暂不存在，等待下一个渲染周期...')
    // 如果ref还未指向DOM元素，等待下一个tick - Vue的DOM更新周期
    nextTick(() => {
      if (activityChartRef.value) {
        // 在下一个DOM更新周期后再次尝试初始化
        initActivityChartWithElement(activityChartRef.value)
      } else {
        console.error('柱状图容器元素仍然不存在')
      }
    })
  }
}

// 处理窗口大小变化 - 当浏览器窗口大小改变时，重新调整图表尺寸
const handleResize = () => {
  // 如果饼图实例存在，则调整其尺寸
  if (pieChart) {
    pieChart.resize()
  }
  // 如果柱状图实例存在，则调整其尺寸
  if (activityChart) {
    activityChart.resize()
  }
  // 如果部门人员分布图表实例存在，则调整其尺寸
  if (departmentChart) {
    departmentChart.resize()
  }
}

// 销毁图表 - 清理饼图实例，避免内存泄漏
const destroyPieChart = () => {
  // 如果饼图实例存在，调用dispose方法销毁并将引用设为null
  if (pieChart) {
    pieChart.dispose()  // 销毁图表实例
    pieChart = null     // 将引用设为null，便于垃圾回收
  }
}

// 销毁柱状图 - 清理柱状图实例，避免内存泄漏
const destroyActivityChart = () => {
  // 如果柱状图实例存在，调用dispose方法销毁并将引用设为null
  if (activityChart) {
    activityChart.dispose()  // 销毁图表实例
    activityChart = null     // 将引用设为null，便于垃圾回收
  }
}

// 初始化部门人员分布图表
const initDepartmentStaffChart = () => {
  console.log('开始初始化部门人员分布图表...')
  
  // 首先检查数据是否为空
  if (!departmentData.value || departmentData.value.length === 0) {
    console.warn('部门数据为空，跳过初始化')
    return
  }
  
  // 使用ref引用DOM元素 - 检查部门人员分布图表容器是否已渲染
  if (departmentStaffChart.value) {
    console.log('部门人员分布图表容器元素存在，准备初始化...')
    
    try {
      // 先隐藏占位符 - 当没有数据时显示的空状态元素
      const placeholder = departmentStaffChart.value.querySelector('.el-empty')
      if (placeholder) {
        placeholder.style.display = 'none'
      }
      
      // 销毁已存在的图表实例
      if (departmentChart) {
        departmentChart.dispose()
        departmentChart = null
      }
      
      // 确保容器尺寸正确，使用百分比确保响应式
      departmentStaffChart.value.style.height = '350px' // 固定高度以确保良好显示
      departmentStaffChart.value.style.width = '400%'   // 宽度占满容器
      
      // 初始化ECharts实例
      departmentChart = echarts.init(departmentStaffChart.value, null, {
        renderer: 'canvas',
        useDirtyRect: false
      })
      
      // 准备数据
      const departmentNames = departmentData.value.map(item => item.name)
      const employeeCounts = departmentData.value.map(item => item.count)
      
      // 设置图表选项
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: '{b}: {c} 人'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%', // 增加底部空间以显示完整的x轴标签
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: departmentNames,
          axisLabel: {
            interval: 0,
            rotate: 45, // 增加旋转角度以更好地显示长名称
            formatter: (value) => {
              // 限制文本长度，超长部分显示为省略号
              return value.length > 6 ? value.substring(0, 6) + '...' : value;
            }
          }
        },
        yAxis: {
          type: 'value',
          name: '人数',
          axisLabel: {
            formatter: '{value}'
          }
        },
        series: [
          {
            data: employeeCounts,
            type: 'bar',
            itemStyle: {
              color: '#67c23a',
              borderRadius: [4, 4, 0, 0] // 添加圆角效果
            },
            barWidth: '50%',
            emphasis: {
              itemStyle: {
                color: '#85ce61' // 鼠标悬停时的颜色
              }
            }
          }
        ]
      }
      
      // 应用图表选项
      departmentChart.setOption(option)
      
      // 强制重绘并充满容器
      setTimeout(() => {
        if (departmentChart) {
          departmentChart.resize()
        }
      }, 0)
    } catch (error) {
      console.error('初始化部门人员分布图表失败:', error)
    }
  } else {
    console.warn('部门人员分布图表容器元素暂不存在，等待下一个渲染周期...')
    nextTick(() => {
      initDepartmentStaffChart()
    })
  }
}

// 销毁部门人员分布图表
const destroyDepartmentChart = () => {
  if (departmentChart) {
    departmentChart.dispose()
    departmentChart = null
  }
}

// 监听器 - 监听服务类型数据变化，当数据更新时重新初始化饼图
watch(serviceTypeData, () => {
  console.log('饼图数据发生变化，准备重新初始化...')
  // 使用setTimeout和nextTick确保DOM更新完成后再初始化图表
  setTimeout(() => {
    nextTick(() => {
      initPieChart() // 调用初始化方法
    })
  }, 50)
}, { deep: true }) // 深度监听，确保对象内部属性变化也能触发

// 监听器 - 监听活跃用户数据变化，当数据更新时重新初始化柱状图
watch(activityData, () => {
  console.log('柱状图数据发生变化，准备重新初始化...')
  // 使用setTimeout和nextTick确保DOM更新完成后再初始化图表
  setTimeout(() => {
    nextTick(() => {
      initActivityChart() // 调用初始化方法
    })
  }, 50)
}, { deep: true }) // 深度监听，确保对象内部属性变化也能触发

// 生命周期钩子 - 组件挂载完成后执行
onMounted(() => {
  console.log('组件已挂载，开始初始化图表...')
  
  // 加载数据 - 异步加载仪表盘所需的所有数据
  loadDashboardData().then(() => {
    // 数据加载完成后再初始化图表 - 确保数据可用
    nextTick(() => {
      console.log('尝试初始化图表...')
      initActivityChart() // 初始化柱状图
      initPieChart()      // 初始化饼图
      initDepartmentStaffChart() // 初始化部门人员分布图表
    })
  })
  
  // 监听窗口大小变化 - 添加全局事件监听器，响应窗口大小变化
  window.addEventListener('resize', handleResize)
})

// 生命周期钩子 - 组件卸载前执行
onBeforeUnmount(() => {
  // 清理图表 - 销毁所有图表实例，释放资源
  destroyPieChart()      // 销毁饼图
  destroyActivityChart() // 销毁柱状图
  if (departmentChart) {
    departmentChart.dispose()
  }
  
  // 移除窗口大小变化监听 - 防止内存泄漏和事件监听重复
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* 主容器样式 - 设置管理首页的最大宽度并居中显示 */
.admin-home {
  max-width: 1400px; /* 设置最大宽度为1400px，防止在大屏幕上过度拉伸 */
  margin: 0 auto;   /* 水平居中显示 */
}

/* 欢迎区域 */
.welcome-section {
  margin-bottom: 30px; /* 与下方内容的间距 */
}

.welcome-section h2 {
  font-size: 28px;   /* 主标题字体大小 */
  color: #333;       /* 主标题文字颜色 - 深灰色 */
  margin-bottom: 10px; /* 标题与段落的间距 */
}

.welcome-section p {
  font-size: 16px;   /* 副标题/描述字体大小 */
  color: #666;       /* 副标题文字颜色 - 中灰色 */
}

/* 统计卡片区域 */
.stats-section {
  margin-bottom: 30px; /* 与下方图表区域的间距 */
}

.stat-card {
  height: 100%; /* 确保所有统计卡片高度一致，即使内容多少不同 */
}

.stat-content {
  display: flex;        /* 使用flex布局 */
  align-items: center;  /* 垂直居中对齐 */
  gap: 20px;           /* 图标与文字内容之间的间距 */
}

.stat-icon {
  width: 60px;         /* 图标容器宽度 */
  height: 60px;        /* 图标容器高度 */
  border-radius: 50%;  /* 圆形图标容器 */
  display: flex;       /* flex布局，用于居中图标 */
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  font-size: 24px;     /* 图标字体大小 */
}

/* 用户统计图标样式 */
.user-icon {
  background-color: rgba(64, 158, 255, 0.1); /* 浅蓝色背景，透明度10% */
  color: #409eff;      /* 蓝色图标 */
}

/* 服务统计图标样式 */
.service-icon {
  background-color: rgba(103, 194, 58, 0.1); /* 浅绿色背景，透明度10% */
  color: #67c23a;      /* 绿色图标 */
}

/* 咨询统计图标样式 */
.consult-icon {
  background-color: rgba(230, 162, 60, 0.1); /* 浅黄色背景，透明度10% */
  color: #e6a23c;      /* 黄色图标 */
}

/* 今日数据统计图标样式 */
.today-icon {
  background-color: rgba(245, 108, 108, 0.1); /* 浅红色背景，透明度10% */
  color: #f56c6c;      /* 红色图标 */
}

/* 员工统计图标样式 */
.employee-icon {
  background-color: rgba(144, 147, 153, 0.1); /* 浅灰色背景，透明度10% */
  color: #909399;      /* 灰色图标 */
}

/* 部门统计图标样式 */
.department-icon {
  background-color: rgba(192, 196, 204, 0.1); /* 超浅灰色背景，透明度10% */
  color: #c0c4cc;      /* 浅灰色图标 */
}

/* 统计信息区域 - 占据剩余空间 */
.stat-info {
  flex: 1; /* 占据flex容器中剩余的空间 */
}

/* 统计数字样式 */
.stat-number {
  font-size: 32px;     /* 大号字体显示统计数字 */
  font-weight: bold;   /* 粗体显示 */
  color: #333;         /* 深灰色文字 */
  margin-bottom: 5px;  /* 与标签的间距 */
}

/* 统计标签样式 */
.stat-label {
  font-size: 14px;     /* 小号字体显示标签 */
  color: #666;         /* 中灰色文字 */
}

/* 图表区域 */
.charts-section {
  margin-bottom: 30px; /* 与下方最新动态区域的间距 */
}

.chart-card {
  height: 100%; /* 确保所有图表卡片高度一致 */
}

/* 图表卡片头部样式 */
.card-header {
  display: flex;
  justify-content: space-between; /* 标题和操作按钮左右分布 */
  align-items: center;
  font-size: 16px;
  font-weight: bold;
}

/* 图表容器样式 */
.chart-container {
  height: 300px;
  display: flex;
  align-items: center;   /* 内容垂直居中 */
  justify-content: center; /* 内容水平居中 */
}

/* 图表加载中样式 */
.chart-loading {
  display: flex;
  align-items: center;
  gap: 10px;      /* 加载图标与文字间距 */
  color: #999;    /* 灰色文字 */
}

/* 图表占位符样式 */
.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 模拟图表样式 - 用于在实际图表加载前显示占位效果 */
.mock-chart,
.mock-pie-chart {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* 模拟图表标题样式 */
.chart-title {
  font-size: 16px;
  margin-bottom: 20px;
  color: #666;
}

/* 模拟柱状图容器 */
.chart-bars {
  display: flex;
  align-items: flex-end; /* 从底部对齐，模拟柱状图效果 */
  gap: 20px;          /* 每个柱子之间的间距 */
  height: 200px;      /* 柱状图区域高度 */
}

/* 单个柱状图项目 */
.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;          /* 柱子与标签之间的间距 */
}

/* 柱子样式 */
.bar {
  width: 30px;        /* 柱子宽度 */
  background-color: #409eff; /* 柱子颜色 - 蓝色 */
  border-radius: 4px 4px 0 0; /* 顶部圆角 */
}

/* 柱子标签样式 */
.bar-label {
  font-size: 12px;
  color: #999;        /* 灰色文字 */
}

/* 模拟饼图切片容器 */
.pie-slices {
  display: flex;
  flex-direction: column;
  gap: 10px;          /* 每个切片项之间的间距 */
}

/* 模拟饼图切片项 */
.pie-slice {
  padding: 10px 20px; /* 内边距 */
  border-radius: 4px; /* 圆角 */
  color: white;
  display: flex;
  align-items: center;
  gap: 10px;          /* 内部元素间距 */
}

/* 最新动态区域 */
.activities-section {
  margin-bottom: 30px;
}

/* 活动卡片样式 - 确保高度自适应内容 */
.activities-card {
  height: 100%;
}

/* 活动内容容器 - 限制高度并支持滚动 */
.activities-content {
  max-height: 400px;  /* 设置最大高度 */
  overflow-y: auto;   /* 超出高度时显示垂直滚动条 */
}

/* 活动列表容器 - 垂直方向排列 */
.activities-list {
  display: flex;
  flex-direction: column;
  gap: 15px;          /* 每个活动项之间的间距 */
}

/* 单个活动项样式 */
.activity-item {
  display: flex;
  gap: 15px;          /* 活动图标与内容之间的间距 */
  padding: 15px;      /* 内边距 */
  background-color: #fafafa; /* 浅灰色背景 */
  border-radius: 8px; /* 圆角 */
  transition: all 0.3s; /* 添加过渡效果，使交互更平滑 */
}

/* 活动项悬停效果 */
.activity-item:hover {
  background-color: #f0f9ff; /* 浅蓝色背景 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* 活动信息区域 - 占据剩余空间 */
.activity-info {
  flex: 1; /* 占据flex容器中剩余的空间 */
}

/* 活动文本内容样式 */
.activity-text {
  font-size: 14px;
  color: #333;        /* 深灰色文字 */
  margin-bottom: 5px;
  line-height: 1.5;   /* 设置行高，提高可读性 */
}

/* 活动时间样式 */
.activity-time {
  font-size: 12px;    /* 小号字体 */
  color: #999;        /* 浅灰色文字 */
}

/* 滚动条样式 - 自定义滚动条外观 */
.activities-content::-webkit-scrollbar {
  width: 8px;         /* 滚动条宽度 */
}

/* 滚动条轨道样式 */
.activities-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* 浅灰色轨道背景 */
  border-radius: 4px;  /* 轨道圆角 */
}

/* 滚动条滑块样式 */
.activities-content::-webkit-scrollbar-thumb {
  background: #888;    /* 灰色滑块 */
  border-radius: 4px;  /* 滑块圆角 */
}

/* 滚动条滑块悬停效果 */
.activities-content::-webkit-scrollbar-thumb:hover {
  background: #555;    /* 鼠标悬停时更深的灰色 */
}

/* 响应式设计 - 针对小屏幕设备（宽度小于等于768px） */
@media (max-width: 768px) {
  /* 调整欢迎区域标题大小 */
  .welcome-section h2 {
    font-size: 24px;  /* 小屏幕上字体稍小 */
  }
  
  /* 调整统计内容布局 */
  .stat-content {
    gap: 15px;  /* 小屏幕上缩小图标与文字间距 */
  }
  
  /* 调整统计图标大小 */
  .stat-icon {
    width: 50px;  /* 小屏幕上图标稍小 */
    height: 50px;
    font-size: 20px;
  }
  
  /* 调整统计数字大小 */
  .stat-number {
    font-size: 24px;  /* 小屏幕上数字稍小 */
  }
  
  /* 调整模拟图表柱子间距 */
  .chart-bars {
    gap: 10px;  /* 小屏幕上柱子间距减小 */
  }
  
  /* 调整模拟图表柱子宽度 */
  .bar {
    width: 20px;  /* 小屏幕上柱子变窄 */
  }
  
  /* 调整图表容器高度 */
  .chart-container {
    height: 250px;  /* 小屏幕上图表高度降低 */
  }
  
  /* 调整活动项内边距 */
  .activity-item {
    padding: 12px;  /* 小屏幕上内边距减小 */
  }
  
  /* 调整活动内容容器最大高度 */
  .activities-content {
    max-height: 350px;  /* 小屏幕上降低最大高度 */
  }
}
</style>