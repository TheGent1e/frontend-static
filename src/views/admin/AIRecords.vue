<template>
  <div class="ai-records">
    <div class="page-header">
      <h2>统计报表</h2>
      <p>查看AI咨询记录和系统使用统计</p>
    </div>
    
    <el-card class="content-card">
      <template #header>
        <div class="card-header">
          <span>AI咨询记录</span>
          <div class="header-actions">
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="handleDateRangeChange"
            />
            <el-button type="primary" @click="handleExport">导出数据</el-button>
          </div>
        </div>
      </template>
      
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索咨询内容、用户信息"
          prefix-icon="el-icon-search"
          style="width: 300px;"
        />
        <el-select v-model="statusFilter" placeholder="状态" style="width: 120px; margin-left: 10px;">
          <el-option label="全部" value="" />
          <el-option label="已完成" value="completed" />
          <el-option label="进行中" value="processing" />
          <el-option label="已取消" value="cancelled" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      
      <el-table :data="aiRecords" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="80" />
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="question" label="咨询问题" show-overflow-tooltip>
          <template #default="scope">
            <div class="question-preview">{{ scope.row.question }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="keywords" label="关键词">
          <template #default="scope">
            <el-tag v-for="(tag, index) in scope.row.keywords" :key="index" size="small" type="info" effect="plain">
              {{ tag }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template #default="scope">
            <el-tag :type="getStatusTag(scope.row.status)">
              {{ getStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="consultTime" label="咨询时间" width="180" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          :current-page="currentPage"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    
    <!-- 数据统计图表 -->
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>AI咨询趋势</span>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-icon">📊</div>
              <p>AI咨询趋势图表区域</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card class="chart-card">
          <template #header>
            <div class="card-header">
              <span>问题分类统计</span>
            </div>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-icon">📈</div>
              <p>问题分类统计图表区域</p>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

// 定义组件名称
const name = 'AIRecords'

// 响应式数据
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref(null)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const aiRecords = ref([
  {
    id: 1,
    userId: 101,
    username: '张三',
    question: '最近总是感到疲劳，有什么改善方法吗？',
    keywords: ['疲劳', '健康建议'],
    status: 'completed',
    consultTime: '2025-04-01 10:15:30'
  },
  {
    id: 2,
    userId: 102,
    username: '李四',
    question: '高血压患者应该注意哪些饮食问题？',
    keywords: ['高血压', '饮食'],
    status: 'completed',
    consultTime: '2025-04-01 14:20:15'
  },
  {
    id: 3,
    userId: 103,
    username: '王五',
    question: '如何科学减重不反弹？',
    keywords: ['减重', '健康生活'],
    status: 'processing',
    consultTime: '2025-04-02 09:30:45'
  },
  {
    id: 4,
    userId: 104,
    username: '赵六',
    question: '体检报告显示血糖偏高，需要进一步检查吗？',
    keywords: ['血糖', '体检', '健康检查'],
    status: 'completed',
    consultTime: '2025-04-02 16:45:20'
  },
  {
    id: 5,
    userId: 105,
    username: '钱七',
    question: '长期久坐如何保护颈椎？',
    keywords: ['颈椎', '久坐', '职业病预防'],
    status: 'completed',
    consultTime: '2025-04-03 11:05:10'
  }
])

// 生命周期钩子
onMounted(() => {
  loadAIRecords()
})

// 加载AI咨询记录
const loadAIRecords = async () => {
  try {
    // 这里将替换为实际的API调用
    // const response = await api.admin.getAIRecords(currentPage.value, pageSize.value, {
    //   search: searchQuery.value,
    //   status: statusFilter.value,
    //   dateRange: dateRange.value
    // })
    // aiRecords.value = response.data.items
    // total.value = response.data.total
    total.value = aiRecords.value.length
  } catch (error) {
    console.error('加载AI咨询记录失败', error)
    ElMessage.error('加载数据失败，请重试')
  }
}

// 搜索记录
const handleSearch = () => {
  currentPage.value = 1
  loadAIRecords()
}

// 日期范围变化
const handleDateRangeChange = () => {
  currentPage.value = 1
  loadAIRecords()
}

// 导出数据
const handleExport = () => {
  ElMessage.info('导出数据功能待实现')
}

// 查看详情
const viewDetail = (recordId) => {
  ElMessage.info(`查看记录详情: ${recordId}`)
}

// 分页大小改变
const handleSizeChange = (size) => {
  pageSize.value = size
  loadAIRecords()
}

// 当前页码改变
const handleCurrentChange = (current) => {
  currentPage.value = current
  loadAIRecords()
}

// 获取状态标签类型
const getStatusTag = (status) => {
  const tagMap = {
    completed: 'success',
    processing: 'warning',
    cancelled: 'danger'
  }
  return tagMap[status] || 'default'
}

// 获取状态文本
const getStatusText = (status) => {
  const textMap = {
    completed: '已完成',
    processing: '进行中',
    cancelled: '已取消'
  }
  return textMap[status] || status
}
</script>

<style scoped>
.ai-records {
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
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

.question-preview {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chart-card {
  margin-bottom: 20px;
}

.chart-container {
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-placeholder {
  text-align: center;
  color: #909399;
}

.chart-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .search-bar,
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar > *,
  .header-actions > * {
    width: 100% !important;
    margin-left: 0 !important;
  }
}
</style>