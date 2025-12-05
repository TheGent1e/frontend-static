<template>
  <div class="health-record">
    <!-- 内容简化，只保留基本结构 -->
    <div class="top-decoration"></div>
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
    
    <!-- 健康数据导航 -->
    <el-tabs v-model="activeTab" class="health-tabs">
      <el-tab-pane label="体检报告" name="physical-exam" />
      <el-tab-pane label="就诊记录" name="medical-records" />
      <el-tab-pane label="日常指标" name="daily-indicators" />
      <el-tab-pane label="用药记录" name="medication-records" />
      <el-tab-pane label="运动数据" name="exercise-data" />
      <el-tab-pane label="睡眠数据" name="sleep-data" />
      <el-tab-pane label="饮食记录" name="diet-records" />
      <el-tab-pane label="健康趋势" name="health-trends" />
    </el-tabs>
    
    <!-- 数据内容区域 -->
    <div class="health-content">
      <!-- 体检报告 -->
      <div v-if="activeTab === 'physical-exam'" class="tab-content">
        <el-card shadow="hover" class="content-card">
          <template #header>
            <div class="card-header">
              <span>体检报告管理</span>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog('physical-exam')">
                添加报告
              </el-button>
            </div>
          </template>
          <el-table :data="physicalExamRecords" style="width: 100%">
            <el-table-column prop="date" label="体检日期" width="180" />
            <el-table-column prop="hospital" label="体检机构" />
            <el-table-column prop="type" label="体检类型" />
            <el-table-column prop="status" label="报告状态" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="viewReport(scope.row.id)">查看报告</el-button>
                <el-button size="small" type="primary" @click="shareReport(scope.row.id)">分享</el-button>
                <el-button size="small" type="danger" @click="deleteReport(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <!-- 就诊记录 -->
      <div v-else-if="activeTab === 'medical-records'" class="tab-content">
        <el-card shadow="hover" class="content-card">
          <template #header>
            <div class="card-header">
              <span>就诊记录管理</span>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog('medical-records')">
                添加记录
              </el-button>
            </div>
          </template>
          <el-table :data="medicalRecords" style="width: 100%">
            <el-table-column prop="date" label="就诊日期" width="180" />
            <el-table-column prop="hospital" label="医院" />
            <el-table-column prop="department" label="科室" />
            <el-table-column prop="doctor" label="医生" />
            <el-table-column prop="diagnosis" label="诊断结果" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="viewMedicalRecord(scope.row.id)">查看详情</el-button>
                <el-button size="small" type="danger" @click="deleteMedicalRecord(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <!-- 日常指标 -->
      <div v-else-if="activeTab === 'daily-indicators'" class="tab-content">
        <el-card shadow="hover" class="content-card">
          <template #header>
            <div class="card-header">
              <span>日常指标管理</span>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog('daily-indicators')">
                添加指标
              </el-button>
            </div>
          </template>
          <el-tabs v-model="indicatorTab" class="indicator-tabs">
            <el-tab-pane label="血压" name="blood-pressure" />
            <el-tab-pane label="血糖" name="blood-sugar" />
            <el-tab-pane label="心率" name="heart-rate" />
            <el-tab-pane label="体重" name="weight" />
            <el-tab-pane label="BMI" name="bmi" />
          </el-tabs>
          <div class="indicator-content">
            <!-- 血压指标 -->
            <div v-if="indicatorTab === 'blood-pressure'">
              <div class="chart-container">
                <h3>血压趋势图</h3>
                <div class="chart-placeholder">血压图表区域</div>
              </div>
              <el-table :data="bloodPressureData" style="width: 100%">
                <el-table-column prop="date" label="记录日期" width="180" />
                <el-table-column prop="time" label="记录时间" width="120" />
                <el-table-column prop="systolic" label="收缩压" width="100" />
                <el-table-column prop="diastolic" label="舒张压" width="100" />
                <el-table-column prop="pulse" label="脉搏" width="100" />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button size="small" type="danger" @click="deleteIndicator(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <!-- 其他指标内容类似 -->
            <div v-else>
              <div class="chart-container">
                <h3>{{ indicatorTab === 'blood-sugar' ? '血糖' : indicatorTab === 'heart-rate' ? '心率' : indicatorTab === 'weight' ? '体重' : 'BMI' }}趋势图</h3>
                <div class="chart-placeholder">{{ indicatorTab === 'blood-sugar' ? '血糖' : indicatorTab === 'heart-rate' ? '心率' : indicatorTab === 'weight' ? '体重' : 'BMI' }}图表区域</div>
              </div>
              <el-table :data="[]" style="width: 100%">
                <el-table-column prop="date" label="记录日期" width="180" />
                <el-table-column prop="time" label="记录时间" width="120" />
                <el-table-column prop="value" label="数值" width="100" />
                <el-table-column prop="status" label="状态" width="100" />
                <el-table-column label="操作" width="120" fixed="right">
                  <template #default="scope">
                    <el-button size="small" type="danger" @click="deleteIndicator(scope.row.id)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 用药记录 -->
      <div v-else-if="activeTab === 'medication-records'" class="tab-content">
        <el-card shadow="hover" class="content-card">
          <template #header>
            <div class="card-header">
              <span>用药记录管理</span>
              <el-button type="primary" icon="el-icon-plus" @click="showAddDialog('medication-records')">
                添加用药记录
              </el-button>
            </div>
          </template>
          <el-table :data="medicationRecords" style="width: 100%">
            <el-table-column prop="drugName" label="药品名称" />
            <el-table-column prop="dosage" label="剂量" width="120" />
            <el-table-column prop="usage" label="用法用量" />
            <el-table-column prop="startDate" label="开始日期" width="180" />
            <el-table-column prop="endDate" label="结束日期" width="180" />
            <el-table-column prop="effect" label="用药效果" />
            <el-table-column label="操作" width="200" fixed="right">
              <template #default="scope">
                <el-button size="small" @click="viewMedicationRecord(scope.row.id)">查看详情</el-button>
                <el-button size="small" type="danger" @click="deleteMedicationRecord(scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </div>
      
      <!-- 其他标签内容类似，简化展示 -->
      <div v-else class="tab-content">
        <el-card shadow="hover" class="content-card">
          <template #header>
            <div class="card-header">
              <span>{{ activeTab === 'exercise-data' ? '运动数据' : activeTab === 'sleep-data' ? '睡眠数据' : activeTab === 'diet-records' ? '饮食记录' : '健康趋势' }}</span>
              <el-button v-if="activeTab !== 'health-trends'" type="primary" icon="el-icon-plus" @click="showAddDialog(activeTab)">
                添加记录
              </el-button>
            </div>
          </template>
          <div class="content-placeholder">
            {{ activeTab === 'exercise-data' ? '运动数据内容区域' : activeTab === 'sleep-data' ? '睡眠数据内容区域' : activeTab === 'diet-records' ? '饮食记录内容区域' : '健康趋势分析区域' }}
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 表单对话框结尾部分 - 这是修复的关键点 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form :model="formData" :rules="formRules" ref="formRef" label-width="120px">
        <!-- 体检报告表单 -->
        <template v-if="currentRecordType === 'physical-exam'">
          <el-form-item label="体检日期" prop="date">
            <el-date-picker v-model="formData.date" type="date" placeholder="选择体检日期" style="width: 100%" />
          </el-form-item>
          <el-form-item label="体检机构" prop="hospital">
            <el-input v-model="formData.hospital" placeholder="输入体检机构" />
          </el-form-item>
          <el-form-item label="体检类型" prop="type">
            <el-select v-model="formData.type" placeholder="选择体检类型">
              <el-option label="常规体检" value="常规体检" />
              <el-option label="专项体检" value="专项体检" />
              <el-option label="高端体检" value="高端体检" />
            </el-select>
          </el-form-item>
          <el-form-item label="报告状态" prop="status">
            <el-select v-model="formData.status" placeholder="选择报告状态">
              <el-option label="已完成" value="已完成" />
              <el-option label="待取报告" value="待取报告" />
            </el-select>
          </el-form-item>
          <el-form-item label="报告文件">
            <el-upload action="#" :auto-upload="false" :file-list="fileList">
              <el-button slot="trigger" type="primary">选择文件</el-button>
              <div slot="tip" class="el-upload__tip">只能上传PDF文件，且不超过50MB</div>
            </el-upload>
          </el-form-item>
        </template>
        
        <!-- 其他表单内容根据currentRecordType动态生成 -->
        <template v-else>
          <el-form-item label="记录日期" prop="date">
            <el-date-picker v-model="formData.date" type="date" placeholder="选择记录日期" style="width: 100%" />
          </el-form-item>
          <el-form-item label="记录内容" prop="content">
            <el-input v-model="formData.content" type="textarea" :rows="4" placeholder="输入记录内容" />
          </el-form-item>
        </template>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRecord" :loading="formLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// 简化的脚本部分
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import { Operation, Cpu, Plus, Search } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('physical-exam')
const indicatorTab = ref('blood-pressure')
const dialogVisible = ref(false)
const dialogTitle = ref('')
const currentRecordType = ref('')
const formLoading = ref(false)
const currentRecord = ref({})
const formRef = ref(null)
const fileList = ref([])

// 表单数据
const formData = ref({
  date: '',
  hospital: '',
  type: '',
  status: '',
  content: ''
})

// 表单验证规则
const formRules = ref({
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  hospital: [{ required: true, message: '请输入体检机构', trigger: 'blur' }],
  type: [{ required: true, message: '请选择体检类型', trigger: 'change' }],
  status: [{ required: true, message: '请选择报告状态', trigger: 'change' }],
  content: [{ required: true, message: '请输入记录内容', trigger: 'blur' }]
})

// 模拟数据
const physicalExamRecords = ref([
  {
    id: 1,
    date: '2024-01-15',
    hospital: '健康医院',
    type: '常规体检',
    status: '已完成'
  },
  {
    id: 2,
    date: '2023-06-20',
    hospital: '人民医院',
    type: '专项体检',
    status: '已完成'
  }
])

const medicalRecords = ref([
  {
    id: 1,
    date: '2024-02-10',
    hospital: '健康医院',
    department: '内科',
    doctor: '张医生',
    diagnosis: '感冒'
  },
  {
    id: 2,
    date: '2023-12-05',
    hospital: '人民医院',
    department: '外科',
    doctor: '李医生',
    diagnosis: '阑尾炎'
  }
])

const bloodPressureData = ref([
  {
    id: 1,
    date: '2024-03-01',
    time: '08:00',
    systolic: 120,
    diastolic: 80,
    pulse: 75,
    status: '正常'
  },
  {
    id: 2,
    date: '2024-03-02',
    time: '08:30',
    systolic: 125,
    diastolic: 85,
    pulse: 78,
    status: '正常'
  },
  {
    id: 3,
    date: '2024-03-03',
    time: '09:00',
    systolic: 130,
    diastolic: 90,
    pulse: 80,
    status: '轻度高血压'
  }
])

const medicationRecords = ref([
  {
    id: 1,
    drugName: '感冒灵颗粒',
    dosage: '10g',
    usage: '每日3次，每次1袋',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    effect: '症状缓解'
  },
  {
    id: 2,
    drugName: '阿莫西林胶囊',
    dosage: '0.5g',
    usage: '每日3次，每次2粒',
    startDate: '2023-12-05',
    endDate: '2023-12-12',
    effect: '恢复良好'
  }
])

// 方法定义
const goBack = () => {
  router.push('/user/home')
}

// 显示添加记录对话框
const showAddDialog = (recordType) => {
  currentRecordType.value = recordType
  
  // 设置对话框标题
  switch(recordType) {
    case 'physical-exam':
      dialogTitle.value = '添加体检报告'
      break
    case 'medical-records':
      dialogTitle.value = '添加就诊记录'
      break
    case 'daily-indicators':
      dialogTitle.value = '添加日常指标'
      break
    case 'medication-records':
      dialogTitle.value = '添加用药记录'
      break
    case 'exercise-data':
      dialogTitle.value = '添加运动数据'
      break
    case 'sleep-data':
      dialogTitle.value = '添加睡眠数据'
      break
    case 'diet-records':
      dialogTitle.value = '添加饮食记录'
      break
    default:
      dialogTitle.value = '添加记录'
  }
  
  // 重置表单
  formData.value = {
    date: '',
    hospital: '',
    type: '',
    status: '',
    content: ''
  }
  
  if (formRef.value) {
    formRef.value.resetFields()
  }
  
  fileList.value = []
  dialogVisible.value = true
}

// 保存记录
const saveRecord = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    formLoading.value = true
    
    // 模拟保存操作
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('记录保存成功')
    dialogVisible.value = false
    formLoading.value = false
    
    // 这里可以添加刷新数据的逻辑
  } catch (error) {
    console.error('表单验证失败:', error)
    formLoading.value = false
  }
}

// 查看报告
const viewReport = (id) => {
  ElMessage.info('查看报告功能正在开发中')
}

// 分享报告
const shareReport = (id) => {
  ElMessage.info('分享报告功能正在开发中')
}

// 删除报告
const deleteReport = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这份体检报告吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟删除操作
    physicalExamRecords.value = physicalExamRecords.value.filter(record => record.id !== id)
    ElMessage.success('体检报告已删除')
  } catch (error) {
    // 用户取消操作
  }
}

// 查看就诊记录
const viewMedicalRecord = (id) => {
  ElMessage.info('查看就诊记录功能正在开发中')
}

// 删除就诊记录
const deleteMedicalRecord = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条就诊记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟删除操作
    medicalRecords.value = medicalRecords.value.filter(record => record.id !== id)
    ElMessage.success('就诊记录已删除')
  } catch (error) {
    // 用户取消操作
  }
}

// 删除指标
const deleteIndicator = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条指标记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟删除操作
    bloodPressureData.value = bloodPressureData.value.filter(record => record.id !== id)
    ElMessage.success('指标记录已删除')
  } catch (error) {
    // 用户取消操作
  }
}

// 查看用药记录
const viewMedicationRecord = (id) => {
  ElMessage.info('查看用药记录功能正在开发中')
}

// 删除用药记录
const deleteMedicationRecord = async (id) => {
  try {
    await ElMessageBox.confirm('确定要删除这条用药记录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟删除操作
    medicationRecords.value = medicationRecords.value.filter(record => record.id !== id)
    ElMessage.success('用药记录已删除')
  } catch (error) {
    // 用户取消操作
  }
}

// 生命周期钩子
onMounted(() => {
  // 这里应该调用API获取健康数据
})
</script>

<style>
/* 应用UserHome页面的颜色主题 */
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

<style scoped>
/* 返回按钮样式 */
.back-button-container {
  margin-bottom: 20px;
}

/* 头部描述文本样式 - 符合WCAG可访问性标准 */
.header-desc {
  font-size: 16px;
  /* 提高颜色对比度以符合WCAG标准（至少4.5:1） */
  color: var(--text-primary);
  /* 增加文本粗细以提高可读性 */
  font-weight: 500;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

.back-btn {
  background: linear-gradient(135deg, var(--el-color-primary), #0284c7) !important;
  border: none !important;
  color: white !important;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.back-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5) !important;
}

/* 健康档案样式 */
.health-record {
  padding: 20px;
  min-height: 100vh;
  background-color: var(--bg-dark);
}

.top-decoration {
  height: 4px;
  background: linear-gradient(90deg, var(--el-color-primary), #0284c7);
  margin-bottom: 20px;
  border-radius: 2px;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 16px;
  border: 1px solid var(--border-glass);
  box-shadow: var(--glow-blue);
  backdrop-filter: blur(8px);
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 12px;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

/* 健康数据导航 */
.health-tabs {
  margin-bottom: 20px;
  background-color: rgba(15, 23, 42, 0.8);
  border-radius: 16px;
  padding: 5px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
}

/* 数据内容区域 */
.health-content {
  margin-top: 20px;
}

.tab-content {
  margin-bottom: 20px;
}

.content-card {
  margin-bottom: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--glow-blue), 0 8px 32px rgba(0, 0, 0, 0.2);
  border-color: var(--el-color-primary);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--el-color-primary);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

/* 指标标签页 */
.indicator-tabs {
  margin-bottom: 20px;
  border-bottom: 1px solid var(--el-border-color);
}

.indicator-content {
  padding: 20px 0;
}

/* 图表容器 */
.chart-container {
  margin-bottom: 20px;
  background-color: rgba(15, 23, 42, 0.8);
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
}

.chart-container h3 {
  margin-bottom: 15px;
  font-size: 16px;
  font-weight: 600;
  color: var(--el-color-primary);
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

.chart-placeholder {
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--el-input-bg);
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 14px;
  transition: all 0.3s ease;
}

.chart-placeholder:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

/* 内容占位符 */
.content-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(15, 23, 42, 0.8);
  border: 1px dashed var(--el-border-color);
  border-radius: 8px;
  color: var(--text-secondary);
  font-size: 16px;
  transition: all 0.3s ease;
}

.content-placeholder:hover {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

/* 表格样式 */
.el-table {
  margin-top: 20px;
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--el-input-bg);
}

.el-table__header-wrapper th {
  background-color: rgba(15, 23, 42, 0.8);
  font-weight: 600;
  color: var(--el-text-color-primary);
  border-bottom: 1px solid var(--el-border-color);
}

.el-table__body-wrapper tr {
  transition: all 0.3s ease;
}

.el-table__body-wrapper tr:hover {
  background-color: rgba(14, 165, 233, 0.1);
  box-shadow: inset 0 0 10px rgba(14, 165, 233, 0.1);
}

/* 表单样式 */
.el-form-item {
  margin-bottom: 20px;
}

.el-form-item__label {
  color: var(--text-primary) !important;
  font-weight: 600 !important;
}

/* 输入框样式 */
.el-input__wrapper {
  background-color: var(--el-input-bg) !important;
  border: 1px solid var(--el-border-color) !important;
}

.el-input__inner {
  background-color: transparent !important;
  color: var(--el-text-color-primary) !important;
}

/* 日期选择器样式 */
.el-date-editor .el-input__wrapper {
  background-color: var(--el-input-bg) !important;
}

/* 下拉选择器样式 */
.el-select .el-input__wrapper {
  background-color: var(--el-input-bg) !important;
}

.el-select-dropdown {
  background-color: var(--el-input-bg) !important;
  border: 1px solid var(--el-border-color) !important;
}

.el-select-dropdown__item {
  color: var(--el-text-color-primary) !important;
}

.el-select-dropdown__item:hover {
  background-color: rgba(14, 165, 233, 0.1) !important;
  color: var(--el-color-primary) !important;
}

/* 上传组件样式 */
.el-upload {
  margin-top: 10px;
}

.el-upload-dragger {
  background-color: var(--el-input-bg) !important;
  border: 1px dashed var(--el-border-color) !important;
  color: var(--el-text-color-primary) !important;
}

.el-upload-dragger:hover {
  border-color: var(--el-color-primary) !important;
}

/* 数字输入框样式 */
.el-input-number {
  --el-input-number-bg-color: var(--el-input-bg);
}

.el-input-number__decrease,
.el-input-number__increase {
  background-color: transparent !important;
  color: var(--el-text-color-primary) !important;
  border-color: var(--el-border-color) !important;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  background-color: rgba(14, 165, 233, 0.1) !important;
  color: var(--el-color-primary) !important;
  border-color: var(--el-color-primary) !important;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .health-record {
    padding: 10px;
  }
  
  .header-title {
    font-size: 24px;
  }
  
  .health-tabs {
    overflow-x: auto;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .chart-container {
    padding: 10px;
  }
  
  .chart-placeholder {
    height: 150px;
  }
}
</style>