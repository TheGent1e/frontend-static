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
    
    <!-- 其余内容将通过后续步骤添加 -->
    
    <!-- 表单对话框结尾部分 - 这是修复的关键点 -->
    <el-dialog v-model="dialogVisible">
      <el-form>
        <!-- 表单内容 -->
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
import { Operation, Cpu, Heart, Plus, Search } from '@element-plus/icons-vue'

const router = useRouter()
const activeTab = ref('bloodPressure')
const dialogVisible = ref(false)
const formLoading = ref(false)
const currentRecord = ref({})

// 临时函数定义
const saveRecord = () => {}
const getBloodPressureStatus = () => {}
const getBloodPressureStatusText = () => {}
const goBack = () => {
  router.push('/user/home')
}
</script>

<style scoped>
/* 返回按钮样式 */
.back-button-container {
  margin-bottom: 20px;
}

/* 头部描述文本样式 - 符合WCAG可访问性标准 */
.header-desc {
  font-size: var(--font-size-base);
  /* 提高颜色对比度以符合WCAG标准（至少4.5:1） */
  color: var(--text-primary);
  /* 增加文本粗细以提高可读性 */
  font-weight: 500;
  line-height: var(--line-height-base);
  position: relative;
  z-index: 1;
}

.back-btn {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  color: white !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}
</style>