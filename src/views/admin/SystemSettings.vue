<template>
  <div class="system-settings">
    <div class="page-header">
      <h2>系统设置</h2>
      <p>配置系统参数和管理系统信息</p>
    </div>
    
    <el-tabs v-model="activeTab">
      <el-tab-pane label="基本设置" name="basic">
        <el-card class="settings-card">
          <h3>基本设置</h3>
          
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            
            <el-form-item label="系统描述">
              <el-input
                v-model="basicSettings.systemDescription"
                type="textarea"
                :rows="3"
                placeholder="请输入系统描述"
              />
            </el-form-item>
            
            <el-form-item label="首页公告">
              <el-input
                v-model="basicSettings.homepageAnnouncement"
                type="textarea"
                :rows="4"
                placeholder="请输入首页公告内容"
              />
            </el-form-item>
            
            <el-form-item label="系统状态">
              <el-switch v-model="basicSettings.systemStatus" active-text="运行中" inactive-text="维护中" />
            </el-form-item>
            
            <el-form-item label="注册开关">
              <el-switch v-model="basicSettings.registrationEnabled" active-text="开启" inactive-text="关闭" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveBasicSettings">保存设置</el-button>
              <el-button @click="resetBasicSettings">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="安全设置" name="security">
        <el-card class="settings-card">
          <h3>安全设置</h3>
          
          <el-form :model="securitySettings" label-width="120px">
            <el-form-item label="密码策略">
              <el-select v-model="securitySettings.passwordPolicy" placeholder="请选择密码策略">
                <el-option label="标准" value="standard" />
                <el-option label="高安全" value="high" />
                <el-option label="超高安全" value="ultra" />
              </el-select>
            </el-form-item>
            
            <el-form-item label="会话超时时间">
              <el-input-number
                v-model="securitySettings.sessionTimeout"
                :min="15"
                :max="480"
                :step="15"
                placeholder="会话超时时间（分钟）"
              />
              <span class="form-hint">分钟</span>
            </el-form-item>
            
            <el-form-item label="登录失败次数限制">
              <el-input-number
                v-model="securitySettings.loginAttempts"
                :min="3"
                :max="20"
                :step="1"
                placeholder="登录失败次数限制"
              />
              <span class="form-hint">次</span>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSecuritySettings">保存设置</el-button>
              <el-button @click="resetSecuritySettings">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-tab-pane>
      
      <el-tab-pane label="系统信息" name="info">
        <el-card class="settings-card">
          <h3>系统信息</h3>
          
          <el-descriptions>
            <el-descriptions-item label="系统版本">
              {{ systemInfo.version }}
            </el-descriptions-item>
            <el-descriptions-item label="部署环境">
              {{ systemInfo.environment }}
            </el-descriptions-item>
            <el-descriptions-item label="服务器地址">
              {{ systemInfo.serverAddress }}
            </el-descriptions-item>
            <el-descriptions-item label="数据库类型">
              {{ systemInfo.databaseType }}
            </el-descriptions-item>
            <el-descriptions-item label="运行时长">
              {{ systemInfo.uptime }}
            </el-descriptions-item>
            <el-descriptions-item label="最后更新时间">
              {{ systemInfo.lastUpdated }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import api from '../../api'

// 定义组件名称
const name = 'SystemSettings'

// 响应式数据
const activeTab = ref('basic')

// 基本设置
const basicSettings = reactive({
  systemName: '健康服务平台',
  systemDescription: '提供专业的健康咨询、体检预约、报告解读等服务',
  homepageAnnouncement: '欢迎使用健康服务平台！我们致力于为您提供专业的健康服务。',
  systemStatus: true,
  registrationEnabled: true
})

// 安全设置
const securitySettings = reactive({
  passwordPolicy: 'standard',
  sessionTimeout: 30,
  loginAttempts: 5
})

// 系统信息
const systemInfo = reactive({
  version: 'v1.0.0',
  environment: 'production',
  serverAddress: '192.168.1.100',
  databaseType: 'MySQL',
  uptime: '15天23小时45分钟',
  lastUpdated: '2025-04-01 12:30:45'
})

// 保存基本设置
const saveBasicSettings = async () => {
  try {
    // 这里将替换为实际的API调用
    // await api.admin.updateBasicSettings(basicSettings)
    ElMessage.success('基本设置保存成功')
  } catch (error) {
    console.error('保存基本设置失败', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 重置基本设置
const resetBasicSettings = () => {
  Object.assign(basicSettings, {
    systemName: '健康服务平台',
    systemDescription: '提供专业的健康咨询、体检预约、报告解读等服务',
    homepageAnnouncement: '欢迎使用健康服务平台！我们致力于为您提供专业的健康服务。',
    systemStatus: true,
    registrationEnabled: true
  })
}

// 保存安全设置
const saveSecuritySettings = async () => {
  try {
    // 这里将替换为实际的API调用
    // await api.admin.updateSecuritySettings(securitySettings)
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    console.error('保存安全设置失败', error)
    ElMessage.error('保存失败，请重试')
  }
}

// 重置安全设置
const resetSecuritySettings = () => {
  Object.assign(securitySettings, {
    passwordPolicy: 'standard',
    sessionTimeout: 30,
    loginAttempts: 5
  })
}
</script>

<style scoped>
.system-settings {
  max-width: 1200px;
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

.settings-card {
  margin-bottom: 20px;
}

.settings-card h3 {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.form-hint {
  margin-left: 10px;
  color: #909399;
}

.el-descriptions {
  margin-top: 20px;
}

.el-descriptions-item__label {
  font-weight: bold;
}
</style>