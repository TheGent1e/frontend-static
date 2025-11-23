<template>
  <div class="health-record">
    <!-- 顶部装饰条 -->
    <div class="top-decoration"></div>
    
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2 class="header-title">健康档案</h2>
      <p class="header-desc">完整记录您的健康数据，随时查看健康趋势</p>
    </div>

    <!-- 返回按钮 -->
    <div class="back-button-container">
      <el-button 
        type="primary" 
        icon="el-icon-arrow-left" 
        @click="goBack"
        class="back-btn"
      >
        返回首页
      </el-button>
    </div>

    <!-- 健康数据概览卡片 -->
    <el-card class="overview-card" shadow="hover">
      <template #header>
        <div class="card-header">
          <span class="card-header-title">健康数据概览</span>
          <div class="card-header-line"></div>
        </div>
      </template>
      
      <div class="health-overview">
        <div class="overview-item" :class="{'hover-scale': true}">
          <div class="overview-icon blood-pressure-icon">
            <el-icon class="icon-inner"><Operation /></el-icon>
          </div>
          <div class="overview-content">
            <div class="overview-title">血压</div>
            <div class="overview-value">{{ healthData?.bloodPressure?.latest?.systolic || '-' }}/{{ healthData?.bloodPressure?.latest?.diastolic || '-' }} mmHg</div>
            <div class="overview-date">测量时间：{{ healthData?.bloodPressure?.latest?.date || '-' }}</div>
          </div>
          <div class="overview-tag">
            <el-tag :type="getBloodPressureStatus(
              healthData?.bloodPressure?.latest?.systolic || 0,
              healthData?.bloodPressure?.latest?.diastolic || 0
            )">
              {{ getBloodPressureStatusText(
                healthData?.bloodPressure?.latest?.systolic || 0,
                healthData?.bloodPressure?.latest?.diastolic || 0
              ) }}
            </el-tag>
          </div>
        </div>
        
        <div class="overview-item" :class="{'hover-scale': true}">
          <div class="overview-icon blood-sugar-icon">
            <el-icon class="icon-inner"><Cpu /></el-icon>
          </div>
          <div class="overview-content">
            <div class="overview-title">血糖</div>
            <div class="overview-value">{{ healthData?.bloodSugar?.latest?.value || '-' }} mmol/L</div>
            <div class="overview-date">测量时间：{{ healthData?.bloodSugar?.latest?.date || '-' }}</div>
          </div>
          <div class="overview-tag">
            <el-tag :type="getStatusType(healthData?.bloodSugar?.latest?.value || 0)">
              {{ getStatusText(healthData?.bloodSugar?.latest?.value || 0) }}
            </el-tag>
          </div>
        </div>
        
        <div class="overview-item" :class="{'hover-scale': true}">
          <div class="overview-icon heart-rate-icon">
            <el-icon class="icon-inner"><HeartPulse /></el-icon>
          </div>
          <div class="overview-content">
            <div class="overview-title">心率</div>
            <div class="overview-value">{{ healthData?.heartRate?.latest?.value || '-' }} 次/分</div>
            <div class="overview-date">测量时间：{{ healthData?.heartRate?.latest?.date || '-' }}</div>
          </div>
          <div class="overview-tag">
            <el-tag :type="getStatusType(healthData?.heartRate?.latest?.value || 0)">
              {{ getStatusText(healthData?.heartRate?.latest?.value || 0) }}
            </el-tag>
          </div>
        </div>
      </div>
    </el-card>

    <!-- 健康数据记录区域 -->
    <div class="health-records-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">健康数据记录</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-header-right">
          <el-select 
            v-model="activeTab" 
            placeholder="选择数据类型" 
            size="small"
            class="data-select"
          >
            <el-option label="血压记录" value="bloodPressure" />
            <el-option label="血糖记录" value="bloodSugar" />
            <el-option label="心率记录" value="heartRate" />
          </el-select>
          <el-input
            v-model="searchKeyword"
            placeholder="搜索备注信息..."
            size="small"
            clearable
            :prefix-icon="Search"
            class="search-input"
          />
          <el-button 
            type="primary" 
            size="small" 
            @click="addNewRecord"
            class="add-btn"
          >
            <el-icon class="add-icon"><Plus /></el-icon> 添加记录
          </el-button>
        </div>
      </div>

      <!-- 数据表格 -->
      <el-card class="records-table-card" shadow="hover">
        <div class="table-container">
          <el-table 
              :data="currentRecordsList" 
              style="width: 100%"
              :border="true"
              :header-cell-style="tableHeaderStyle"
              row-class-name="table-row-hover"
              :default-sort="tableSort"
              @sort-change="handleSortChange"
              empty-text="暂无数据"
              v-loading="tableLoading"
              element-loading-text="加载中..."
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              class="health-records-table"
            >
            <!-- 血压记录表格 -->
            <template v-if="activeTab === 'bloodPressure'">
              <el-table-column prop="systolic" label="收缩压" width="100">
                <template #default="scope">
                  <span class="table-value">{{ scope.row.systolic }} mmHg</span>
                </template>
              </el-table-column>
              <el-table-column prop="diastolic" label="舒张压" width="100">
                <template #default="scope">
                  <span class="table-value">{{ scope.row.diastolic }} mmHg</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getBloodPressureStatus(scope.row.systolic, scope.row.diastolic)" class="status-tag">
                    {{ getBloodPressureStatusText(scope.row.systolic, scope.row.diastolic) }}
                  </el-tag>
                </template>
              </el-table-column>
            </template>

            <!-- 血糖/心率记录表格 -->
            <template v-else>
              <el-table-column prop="value" label="数值" width="120">
                <template #default="scope">
                  <span class="table-value">{{ scope.row.value }} {{ activeTab === 'bloodSugar' ? 'mmol/L' : '次/分' }}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" width="100">
                <template #default="scope">
                  <el-tag :type="getStatusType(scope.row.value)" class="status-tag">
                    {{ getStatusText(scope.row.value) }}
                  </el-tag>
                </template>
              </el-table-column>
            </template>

            <!-- 通用列 -->
            <el-table-column 
              prop="date" 
              label="测量日期" 
              width="150" 
              sortable="custom"
            />
            <el-table-column 
              prop="time" 
              label="测量时间" 
              width="100" 
              sortable="custom"
            />
            <el-table-column prop="notes" label="备注" />
            <el-table-column label="操作" width="140" fixed="right">
              <template #default="scope">
                <el-button 
                  type="primary" 
                  size="small" 
                  text 
                  @click="editRecord(scope.row)"
                  class="operation-btn edit-btn"
                >
                  编辑
                </el-button>
                <el-button 
                  type="danger" 
                  size="small" 
                  text 
                  @click="deleteRecord(scope.row.id)"
                  class="operation-btn delete-btn"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination-container" v-if="totalRecords > 0">
          <el-pagination
            v-model:current-page="pagination.currentPage"
            v-model:page-size="pagination.pageSize"
            :page-sizes="[10, 20, 50]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalRecords"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            class="custom-pagination"
            background
          />
        </div>
      </el-card>
    </div>

    <!-- 健康趋势图表 -->
    <div class="health-trends-section">
      <div class="section-header">
        <div class="section-header-left">
          <h3 class="section-title">健康趋势分析</h3>
          <div class="section-line"></div>
        </div>
        <div class="section-header-right">
          <el-select 
            v-model="chartType" 
            placeholder="选择图表类型" 
            size="small"
            class="chart-select"
          >
            <el-option label="最近7天" value="7days" />
            <el-option label="最近30天" value="30days" />
            <el-option label="最近90天" value="90days" />
          </el-select>
        </div>
      </div>

      <el-card class="trends-chart-card" shadow="hover">
        <div class="chart-container">
          <!-- 图表占位区域，添加加载动画和提示 -->
          <div class="chart-placeholder" v-if="!chartLoaded">
            <el-loading type="spinner" text="加载趋势图表中..." class="chart-loading"></el-loading>
          </div>
          <div id="healthTrendsChart" class="chart-content"></div>
        </div>
      </el-card>
    </div>
    
    <!-- 底部装饰 -->
    <div class="bottom-decoration"></div>
  </div>
    
    <!-- 健康记录添加/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        v-if="dialogVisible"
        :model="currentRecord"
        ref="recordFormRef"
        label-width="100px"
        class="record-form"
      >
        <!-- 血压记录表单 -->
        <template v-if="activeTab === 'bloodPressure'">
          <el-form-item label="收缩压 (mmHg)" prop="systolic">
            <el-input
              v-model.number="currentRecord.systolic"
              type="number"
              placeholder="请输入收缩压"
              :min="60"
              :max="250"
              required
            />
          </el-form-item>
          <el-form-item label="舒张压 (mmHg)" prop="diastolic">
            <el-input
              v-model.number="currentRecord.diastolic"
              type="number"
              placeholder="请输入舒张压"
              :min="40"
              :max="150"
              required
            />
          </el-form-item>
        </template>
        
        <!-- 血糖/心率记录表单 -->
        <template v-else>
          <el-form-item label="数值" prop="value">
            <el-input
              v-model.number="currentRecord.value"
              type="number"
              :placeholder="activeTab === 'bloodSugar' ? '请输入血糖值 (mmol/L)' : '请输入心率值 (次/分)'"
              :min="activeTab === 'bloodSugar' ? 1 : 30"
              :max="activeTab === 'bloodSugar' ? 30 : 250"
              required
            />
          </el-form-item>
          <el-form-item>
            <span class="form-unit">
              单位: {{ activeTab === 'bloodSugar' ? 'mmol/L' : '次/分' }}
            </span>
          </el-form-item>
        </template>
        
        <!-- 通用表单字段 -->
        <el-form-item label="测量日期" prop="date">
          <el-date-picker
            v-model="currentRecord.date"
            type="date"
            placeholder="选择日期"
            style="width: 100%"
            :max-date="new Date()"
            required
          />
        </el-form-item>
        <el-form-item label="测量时间" prop="time">
          <el-time-picker
            v-model="currentRecord.time"
            placeholder="选择时间"
            style="width: 100%"
            format="HH:mm"
            value-format="HH:mm"
            required
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="currentRecord.notes"
            type="textarea"
            placeholder="添加备注信息（如测量状态、特殊情况等）"
            rows="3"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecord" :loading="formLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { Operation, Cpu, HeartPulse, Plus, Search } from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('bloodPressure')
const chartType = ref('7days')
const chartLoaded = ref(false)
const healthData = ref({
  bloodPressure: {
    latest: {
      systolic: 120,
      diastolic: 80,
      date: '2024-10-23'
    }
  },
  bloodSugar: {
    latest: {
      value: 5.6,
      date: '2024-10-23'
    }
  },
  heartRate: {
    latest: {
      value: 72,
      date: '2024-10-23'
    }
  }
})

// 分页数据
const pagination = ref({
  currentPage: 1,
  pageSize: 10
})

// 搜索功能
const searchKeyword = ref('')

// 模拟数据
const mockBloodPressureData = [
  { id: 1, systolic: 120, diastolic: 80, date: '2024-10-23', time: '08:00', notes: '晨起测量' },
  { id: 2, systolic: 125, diastolic: 82, date: '2024-10-22', time: '18:30', notes: '晚餐后' },
  { id: 3, systolic: 118, diastolic: 78, date: '2024-10-21', time: '07:45', notes: '晨起测量' },
  { id: 4, systolic: 130, diastolic: 85, date: '2024-10-20', time: '20:00', notes: '睡前测量' },
  { id: 5, systolic: 122, diastolic: 81, date: '2024-10-19', time: '08:15', notes: '晨起测量' }
]

const mockBloodSugarData = [
  { id: 1, value: 5.6, date: '2024-10-23', time: '08:00', notes: '空腹' },
  { id: 2, value: 7.2, date: '2024-10-23', time: '12:30', notes: '餐后2小时' },
  { id: 3, value: 5.8, date: '2024-10-22', time: '07:45', notes: '空腹' },
  { id: 4, value: 6.9, date: '2024-10-22', time: '12:15', notes: '餐后2小时' },
  { id: 5, value: 5.5, date: '2024-10-21', time: '08:10', notes: '空腹' }
]

const mockHeartRateData = [
  { id: 1, value: 72, date: '2024-10-23', time: '08:00', notes: '静息状态' },
  { id: 2, value: 85, date: '2024-10-23', time: '14:30', notes: '轻度活动后' },
  { id: 3, value: 70, date: '2024-10-22', time: '07:45', notes: '静息状态' },
  { id: 4, value: 92, date: '2024-10-22', time: '18:00', notes: '运动后' },
  { id: 5, value: 71, date: '2024-10-21', time: '08:15', notes: '静息状态' }
]

// 过滤后的数据
const filteredData = computed(() => {
  let data = []
  switch (activeTab.value) {
    case 'bloodPressure':
      data = mockBloodPressureData
      break
    case 'bloodSugar':
      data = mockBloodSugarData
      break
    case 'heartRate':
      data = mockHeartRateData
      break
    default:
      data = []
  }
  
  // 根据搜索关键词过滤数据
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    data = data.filter(item => {
      return item.notes?.toLowerCase().includes(keyword)
    })
  }
  
  return data
})

// 计算属性：当前显示的记录列表（分页后）
const currentRecordsList = computed(() => {
  const start = (pagination.value.currentPage - 1) * pagination.value.pageSize
  const end = start + pagination.value.pageSize
  return filteredData.value.slice(start, end)
})

// 计算属性：总记录数
const totalRecords = computed(() => {
  return filteredData.value.length
})

// 表格加载状态
const tableLoading = ref(false)

// 表格排序
const tableSort = ref({
  prop: 'date',
  order: 'descending'
})

const handleSortChange = ({ prop, order }) => {
  tableSort.value = { prop, order }
  // 重置页码到第一页
  pagination.value.currentPage = 1
  
  // 模拟排序加载
  tableLoading.value = true
  setTimeout(() => {
    // 这里可以实现真实的排序逻辑
    tableLoading.value = false
  }, 300)
}

// 表格头部样式（使用主题色）
const tableHeaderStyle = {
  'background-color': 'var(--el-color-primary-light-9)',
  'color': 'var(--el-color-primary)',
  'font-weight': '600',
  'border-bottom': '1px solid var(--el-color-primary-light-7)'
}

// 方法
const goBack = () => {
  router.push('/user/home')
}

// 对话框状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRecord = ref({})
const formLoading = ref(false)

// 全局错误处理器
const handleGlobalError = (error, message = '操作失败') => {
  console.error(`${message}:`, error)
  ElMessage.error(message)
  formLoading.value = false
}

// 添加新记录
const addNewRecord = () => {
  try {
    dialogTitle.value = '添加健康记录'
    // 根据当前选中的标签类型初始化表单数据
    if (activeTab.value === 'bloodPressure') {
      currentRecord.value = {
        systolic: '',
        diastolic: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        notes: ''
      }
    } else {
      currentRecord.value = {
        value: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().substring(0, 5),
        notes: ''
      }
    }
    dialogVisible.value = true
  } catch (error) {
    handleGlobalError(error, '打开添加记录对话框失败')
  }
}

// 编辑记录
const editRecord = (record) => {
  try {
    if (!record || !record.id) {
      ElMessage.warning('无效的记录数据')
      return
    }
    dialogTitle.value = '编辑健康记录'
    // 深拷贝记录对象，避免修改原始数据
    currentRecord.value = JSON.parse(JSON.stringify(record))
    dialogVisible.value = true
  } catch (error) {
    handleGlobalError(error, '打开编辑记录对话框失败')
  }
}

// 表单验证
const validateForm = () => {
  // 验证必填字段和数据有效性
  if (activeTab.value === 'bloodPressure') {
    const systolic = Number(currentRecord.value.systolic)
    const diastolic = Number(currentRecord.value.diastolic)
    
    if (!currentRecord.value.systolic || !currentRecord.value.diastolic) {
      ElMessage.warning('请输入完整的血压数据')
      return false
    }
    
    if (isNaN(systolic) || isNaN(diastolic) || systolic <= 0 || diastolic <= 0) {
      ElMessage.warning('请输入有效的血压数值')
      return false
    }
    
    if (systolic <= diastolic) {
      ElMessage.warning('收缩压必须大于舒张压')
      return false
    }
  } else {
    const value = Number(currentRecord.value.value)
    
    if (!currentRecord.value.value) {
      ElMessage.warning('请输入健康指标值')
      return false
    }
    
    if (isNaN(value) || value <= 0) {
      ElMessage.warning('请输入有效的数值')
      return false
    }
    
    // 根据不同指标设置合理范围
    if (activeTab.value === 'bloodSugar' && (value < 1 || value > 30)) {
      ElMessage.warning('血糖值应在1-30 mmol/L之间')
      return false
    }
    
    if (activeTab.value === 'heartRate' && (value < 30 || value > 250)) {
      ElMessage.warning('心率值应在30-250 bpm之间')
      return false
    }
  }
  
  if (!currentRecord.value.date || !currentRecord.value.time) {
    ElMessage.warning('请选择完整的日期和时间')
    return false
  }
  
  return true
}

// 生成新记录ID
const generateNewId = (dataArray) => {
  if (!dataArray || dataArray.length === 0) {
    return 1
  }
  const maxId = Math.max(...dataArray.map(item => item.id || 0))
  return maxId + 1
}

// 保存记录（添加或编辑）
const saveRecord = async () => {
  try {
    // 表单验证
    if (!validateForm()) {
      return
    }
    
    formLoading.value = true
    
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 根据当前标签类型更新对应的数据
    switch (activeTab.value) {
      case 'bloodPressure':
        // 检查是添加还是编辑
        if (!currentRecord.value.id) {
          // 添加新记录
          const newId = generateNewId(mockBloodPressureData)
          const systolic = Number(currentRecord.value.systolic)
          const diastolic = Number(currentRecord.value.diastolic)
          mockBloodPressureData.unshift({
            id: newId,
            ...currentRecord.value,
            systolic,
            diastolic
          })
          ElMessage.success('血压记录添加成功')
        } else {
          // 编辑现有记录
          const index = mockBloodPressureData.findIndex(item => item.id === currentRecord.value.id)
          if (index !== -1) {
            mockBloodPressureData[index] = {
              ...currentRecord.value,
              systolic: Number(currentRecord.value.systolic),
              diastolic: Number(currentRecord.value.diastolic)
            }
            ElMessage.success('血压记录更新成功')
          } else {
            ElMessage.warning('记录不存在或已被删除')
          }
        }
        break
      case 'bloodSugar':
        if (!currentRecord.value.id) {
          const newId = generateNewId(mockBloodSugarData)
          mockBloodSugarData.unshift({
            id: newId,
            ...currentRecord.value,
            value: Number(currentRecord.value.value)
          })
          ElMessage.success('血糖记录添加成功')
        } else {
          const index = mockBloodSugarData.findIndex(item => item.id === currentRecord.value.id)
          if (index !== -1) {
            mockBloodSugarData[index] = {
              ...currentRecord.value,
              value: Number(currentRecord.value.value)
            }
            ElMessage.success('血糖记录更新成功')
          } else {
            ElMessage.warning('记录不存在或已被删除')
          }
        }
        break
      case 'heartRate':
        if (!currentRecord.value.id) {
          const newId = generateNewId(mockHeartRateData)
          mockHeartRateData.unshift({
            id: newId,
            ...currentRecord.value,
            value: Number(currentRecord.value.value)
          })
          ElMessage.success('心率记录添加成功')
        } else {
          const index = mockHeartRateData.findIndex(item => item.id === currentRecord.value.id)
          if (index !== -1) {
            mockHeartRateData[index] = {
              ...currentRecord.value,
              value: Number(currentRecord.value.value)
            }
            ElMessage.success('心率记录更新成功')
          } else {
            ElMessage.warning('记录不存在或已被删除')
          }
        }
        break
    }
    
    dialogVisible.value = false
  } catch (error) {
    console.error('保存记录失败:', error)
    ElMessage.error('保存记录失败，请重试')
  } finally {
    formLoading.value = false
  }
}

// 删除记录
const deleteRecord = async (id) => {
  try {
    // 增强的确认对话框
    const confirmResult = await ElMessageBox.confirm(
      '确定要删除这条记录吗？此操作不可恢复。', 
      '删除确认', 
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false,
        distinguishCancelAndClose: true
      }
    )
    
    formLoading.value = true
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 统一的删除逻辑函数
    const performDelete = (dataArray, successMessage) => {
      const index = dataArray.findIndex(item => item.id === id)
      if (index !== -1) {
        dataArray.splice(index, 1)
        return {
          success: true,
          message: successMessage
        }
      }
      return {
        success: false,
        message: '记录不存在或已被删除'
      }
    }
    
    // 根据当前标签类型删除对应的数据
    let result
    switch (activeTab.value) {
      case 'bloodPressure':
        result = performDelete(mockBloodPressureData, '血压记录删除成功')
        break
      case 'bloodSugar':
        result = performDelete(mockBloodSugarData, '血糖记录删除成功')
        break
      case 'heartRate':
        result = performDelete(mockHeartRateData, '心率记录删除成功')
        break
      default:
        result = { success: false, message: '未知的记录类型' }
    }
    
    // 根据结果显示对应消息
    if (result.success) {
      ElMessage.success(result.message)
    } else {
      ElMessage.warning(result.message)
    }
  } catch (error) {
    // 用户取消删除或发生错误
    if (error !== 'cancel' && error !== 'close') {
      console.error('删除记录失败:', error)
      ElMessage.error('删除记录失败，请重试')
    }
  } finally {
    formLoading.value = false
  }
}

// 获取血压状态 - 更详细的分类
const getBloodPressureStatus = (systolic, diastolic) => {
  if (systolic < 90 || diastolic < 60) {
    return 'danger'  // 低血压
  } else if (systolic < 120 && diastolic < 80) {
    return 'success' // 正常
  } else if (systolic < 130 && diastolic < 80) {
    return 'info'    // 正常高值
  } else if (systolic < 140 || diastolic < 90) {
    return 'warning' // 轻度高血压
  } else if (systolic < 180 || diastolic < 120) {
    return 'danger'  // 中度/重度高血压
  } else {
    return 'danger'  // 高血压危象
  }
}

const getBloodPressureStatusText = (systolic, diastolic) => {
  if (systolic < 90 || diastolic < 60) {
    return '低血压'
  } else if (systolic < 120 && diastolic < 80) {
    return '正常'
  } else if (systolic < 130 && diastolic < 80) {
    return '正常高值'
  } else if (systolic < 140 || diastolic < 90) {
    return '轻度高血压'
  } else if (systolic < 180 || diastolic < 120) {
    return '中度/重度高血压'
  } else {
    return '高血压危象'
  }
}

// 获取血糖状态
const getBloodSugarStatus = (value) => {
  if (value < 3.9) {
    return 'danger'  // 低血糖
  } else if (value < 6.1) {
    return 'success' // 正常
  } else if (value < 7.0) {
    return 'info'    // 轻度升高
  } else if (value < 11.1) {
    return 'warning' // 中度升高
  } else {
    return 'danger'  // 重度升高
  }
}

const getBloodSugarStatusText = (value) => {
  if (value < 3.9) {
    return '低血糖'
  } else if (value < 6.1) {
    return '正常'
  } else if (value < 7.0) {
    return '轻度升高'
  } else if (value < 11.1) {
    return '中度升高'
  } else {
    return '重度升高'
  }
}

// 获取心率状态
const getHeartRateStatus = (value) => {
  if (value < 60) {
    return 'info'    // 心动过缓
  } else if (value <= 100) {
    return 'success' // 正常
  } else if (value <= 120) {
    return 'warning' // 轻度心动过速
  } else if (value <= 150) {
    return 'warning' // 中度心动过速
  } else {
    return 'danger'  // 重度心动过速
  }
}

const getHeartRateStatusText = (value) => {
  if (value < 60) {
    return '心动过缓'
  } else if (value <= 100) {
    return '正常'
  } else if (value <= 120) {
    return '轻度心动过速'
  } else if (value <= 150) {
    return '中度心动过速'
  } else {
    return '重度心动过速'
  }
}

// 获取其他指标状态
const getStatusType = (value) => {
  if (activeTab.value === 'bloodSugar') {
    return getBloodSugarStatus(value)
  } else { // heartRate
    return getHeartRateStatus(value)
  }
}

const getStatusText = (value) => {
  if (activeTab.value === 'bloodSugar') {
    return value < 6.1 ? '正常' : (value < 7.0 ? '正常高值' : '偏高')
  } else { // heartRate
    return value >= 60 && value <= 100 ? '正常' : (value < 60 ? '偏低' : '偏高')
  }
}

// 分页处理
const handleSizeChange = async (size) => {
  tableLoading.value = true
  pagination.value.pageSize = size
  pagination.value.currentPage = 1
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  tableLoading.value = false
}

const handleCurrentChange = async (current) => {
  tableLoading.value = true
  pagination.value.currentPage = current
  
  // 模拟加载延迟
  await new Promise(resolve => setTimeout(resolve, 300))
  tableLoading.value = false
}

// 初始化图表（模拟加载）
const initChart = () => {
  // 模拟图表加载延迟
  const loadingInstance = ElLoading.service({
    target: '#healthTrendsChart',
    text: '加载趋势图表中...',
    background: 'rgba(255, 255, 255, 0.8)'
  })
  
  setTimeout(() => {
    try {
      loadingInstance.close()
      chartLoaded.value = true
      // 替换直接的console.log，避免在生产环境产生不必要的日志
      if (process.env.NODE_ENV !== 'production') {
        console.info('图表初始化完成')
      }
      // 实际项目中这里会初始化ECharts等图表库
    } catch (error) {
      handleGlobalError(error, '图表加载失败，请刷新页面重试')
    }
  }, 1500)
}

// 生命周期钩子
onMounted(async () => {
  try {
    // 这里应该调用API获取健康数据
    if (process.env.NODE_ENV !== 'production') {
      console.info('加载健康档案数据')
    }
    
    // 初始化图表
    initChart()
    
    // 模拟加载数据
    setTimeout(() => {
      try {
        // 数据已在初始化时设置为mock数据
        if (process.env.NODE_ENV !== 'production') {
          console.info('数据加载完成')
        }
      } catch (error) {
        handleGlobalError(error, '模拟数据初始化失败')
      }
    }, 500)
  } catch (error) {
    handleGlobalError(error, '数据加载失败，请检查网络连接后重试')
  }
})
</script>

<style scoped>
/* 核心修改：使用 Element Plus 原生主题色变量，统一主题 */
:root {
  /* 直接使用 Element Plus 原生主题色变量，确保一致性 */
  --primary-color: var(--el-color-primary); /* #409eff */
  --primary-light: var(--el-color-primary-light-7); /* #a0cfff */
  --primary-dark: var(--el-color-primary-dark-2); /* #1e88e5 */
  --success-color: var(--el-color-success); /* #67c23a */
  --info-color: var(--el-color-info); /* #909399 */
  --warning-color: var(--el-color-warning); /* #e6a23c */
  --danger-color: var(--el-color-danger); /* #f56c6c */
  --bg-color:  #ffffff00; /* #f5f7fa */
  --card-bg: #ffffff00; /* #ffffff */
  --text-primary: var(--el-color-primary); /* 主题色文字 */
  --text-secondary: var(--el-text-color-secondary); /* #606266 */
  --border-color: var(--el-border-color); /* #e4e7ed */
  --hover-color: var(--el-color-primary-light-9); /* #f0f7ff */
}

/* 关键设置：给 el-fill-color-blank 类设置背景色 */
.el-fill-color-blank {
  background-color: var(--el-bg-color) !important; /* 使用 Element 背景色，可根据需求调整 */
  /* 可选：添加边框和圆角，增强视觉效果 */
  border: 1px solid var(--el-border-color) !important;
  border-radius: var(--el-border-radius-base) !important;
}

.health-record {
  padding: 20px;
  min-height: 100vh;
  background-color: var(--bg-color);
  position: relative;
  overflow: hidden;
}

/* 顶部底部装饰条（使用主题色） */
.top-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--primary-color), var(--success-color));
}

.bottom-decoration {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--success-color), var(--primary-color));
}

/* 页面标题 */
.page-header {
  margin-bottom: 30px;
  text-align: center;
  padding: 15px 0;
  position: relative;
}

.header-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 10px;
  position: relative;
  display: inline-block;
}

.header-title::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--primary-color), transparent);
  border-radius: 3px;
}

.header-desc {
  font-size: 16px;
  color: var(--text-secondary);
  opacity: 0.9;
}

/* 返回按钮 */
.back-button-container {
  margin-bottom: 25px;
}

.back-btn {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  transition: all 0.3s ease !important;
}

.back-btn:hover {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 概览卡片 */
.overview-card {
  margin-bottom: 30px;
  border-radius: var(--el-border-radius-lg) !important; /* 使用 Element 圆角变量 */
  border: none !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  background-color: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
}

.card-header-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-right: 15px;
}

.card-header-line {
  flex: 1;
  height: 1px;
  background-color: var(--border-color);
}

.health-overview {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  padding: 25px;
}

.overview-item {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 20px;
  background-color: var(--card-bg);
  border-radius: var(--el-border-radius-base);
  flex: 1;
  min-width: 280px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

/* 悬停缩放效果 */
.hover-scale {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(64, 158, 255, 0.15);
}

.overview-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: var(--primary-color);
}

.overview-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.overview-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  height: 70%;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.3);
  z-index: -1;
}

.icon-inner {
  z-index: 2;
}

/* 图标背景色使用主题色相关 */
.blood-pressure-icon {
  background-color: rgba(236, 72, 153, 0.15);
  color: #ec4899;
  border: 1px solid rgba(236, 72, 153, 0.2);
}

.blood-pressure-icon::before {
  background: linear-gradient(135deg, #ec4899, #f472b6);
}

.blood-sugar-icon {
  background-color: rgba(59, 130, 246, 0.15);
  color: var(--primary-color);
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.blood-sugar-icon::before {
  background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
}

.heart-rate-icon {
  background-color: rgba(239, 68, 68, 0.15);
  color: var(--danger-color);
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.heart-rate-icon::before {
  background: linear-gradient(135deg, var(--danger-color), #f87171);
}

.overview-content {
  flex: 1;
}

.overview-title {
  font-size: 15px;
  color: var(--text-secondary);
  margin-bottom: 6px;
  font-weight: 500;
}

.overview-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 6px;
  line-height: 1.2;
}

.overview-date {
  font-size: 13px;
  color: var(--text-secondary);
  opacity: 0.8;
}

.overview-tag {
  margin-left: auto;
}

/* 区域标题 */
.health-records-section,
.health-trends-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  position: relative;
}

.section-line {
  width: 40px;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 1px;
}

.section-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 选择器样式 */
.data-select,
.chart-select {
  border-radius: var(--el-border-radius-base) !important;
  border-color: var(--border-color) !important;
  transition: all 0.3s ease !important;
}

.data-select:hover,
.chart-select:hover {
  border-color: var(--primary-color) !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1) !important;
}

/* 添加按钮 */
.add-btn {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  border-radius: var(--el-border-radius-base) !important;
  transition: all 0.3s ease !important;
}

.add-btn:hover {
  background-color: var(--primary-dark) !important;
  border-color: var(--primary-dark) !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.add-icon {
  margin-right: 4px;
}

/* 表格卡片 */
.records-table-card,
.trends-chart-card {
  border-radius: var(--el-border-radius-lg) !important;
  border: none !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  overflow: hidden;
}

.table-container {
  padding: 10px;
}

.table-row-hover {
  transition: background-color 0.2s ease;
}

.el-table__row:hover {
  background-color: var(--hover-color) !important;
}

.table-value {
  font-weight: 500;
  color: var(--text-primary);
}

.status-tag {
  border-radius: var(--el-border-radius-round) !important; /* 圆形标签 */
  padding: 2px 8px !important;
  font-size: 12px !important;
}

/* 操作按钮 */
.operation-btn {
  transition: all 0.2s ease !important;
  border-radius: var(--el-border-radius-base) !important;
  padding: 4px 8px !important;
}

/* 表单样式 */
.record-form {
  margin-top: 10px;
}

.form-unit {
  color: #909399;
  font-size: 12px;
}

/* 美化按钮和交互效果 */
.el-button--primary {
  background-color: #4CAF50;
  border-color: #4CAF50;
}

.el-button--primary:hover {
  background-color: #5CBF60;
  border-color: #5CBF60;
}

/* 操作按钮样式 */
.el-button--text {
  color: #409eff;
}

.el-button--text:hover {
  color: #66b1ff;
  background-color: rgba(64, 158, 255, 0.05);
}

/* 数据状态标签样式 */
.el-tag {
  margin-right: 4px;
}

/* 表格行悬停效果 */
.el-table__row:hover {
  background-color: #f9fafc;
}

.edit-btn:hover {
  color: var(--primary-dark) !important;
  background-color: rgba(64, 158, 255, 0.1) !important;
}

.delete-btn:hover {
  color: var(--danger-color) !important;
  background-color: rgba(245, 108, 108, 0.1) !important;
}

/* 分页 */
.pagination-container {
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
  padding: 15px;
  background-color: var(--card-bg);
  border-top: 1px solid var(--border-color);
}

.custom-pagination {
  --el-pagination-color: var(--text-secondary);
  --el-pagination-hover-color: var(--primary-color);
  --el-pagination-active-color: var(--primary-color);
  --el-pagination-active-bg-color: var(--hover-color);
}

/* 图表容器 */
.chart-container {
  width: 100%;
  height: 420px;
  position: relative;
}

.chart-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.5);
}

.chart-loading {
  --el-loading-spinner-color: var(--primary-color);
  --el-loading-text-color: var(--text-secondary);
}

.chart-content {
  width: 100%;
  height: 100%;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .health-overview {
    gap: 20px;
    padding: 20px;
  }
  
  .overview-item {
    min-width: 250px;
    padding: 18px;
  }
}

@media (max-width: 768px) {
  .health-record {
    padding: 16px;
  }
  
  .page-header {
    margin-bottom: 25px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .health-overview {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .overview-item {
    min-width: auto;
    padding: 16px;
  }
  
  .overview-icon {
    width: 56px;
    height: 56px;
    font-size: 24px;
  }
  
  .overview-value {
    font-size: 22px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .section-header-left {
    justify-content: center;
  }
  
  .section-title {
    font-size: 18px;
    text-align: center;
  }
  
  .chart-container {
    height: 350px;
  }
}

@media (max-width: 480px) {
  .health-record {
    padding: 12px;
  }
  
  .page-header {
    margin-bottom: 20px;
  }
  
  .header-title {
    font-size: 22px;
  }
  
  .header-desc {
    font-size: 14px;
  }
  
  .overview-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 15px;
  }
  
  .overview-tag {
    margin-left: 0;
    margin-top: 8px;
  }
  
  .overview-icon {
    width: 50px;
    height: 50px;
    font-size: 22px;
  }
  
  .overview-value {
    font-size: 20px;
  }
  
  .chart-container {
    height: 280px;
  }
  
  .el-table {
    font-size: 13px;
  }
  
  .el-table-column {
    width: auto !important;
  }
}

/* 健康记录中不应包含商品卡片样式，已移除可能导致背景显示问题的样式覆盖 */
/* 如需商品卡片样式，请在相关组件中使用正确的作用域样式 */
</style>