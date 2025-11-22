<template>
  <div class="ai-consult">
    <!-- 页面标题 -->
    <div class="page-header">
      <div style="display: flex; align-items: center; gap: 15px;">
        <el-button 
          type="text" 
          class="back-home-btn"
          size="large"
          @click="navigateToHome"
        >
          返回首页
        </el-button>
        <h2>AI健康咨询助手</h2>
      </div>
      <div class="header-controls">
        <el-popover placement="bottom" width="240" trigger="click">
          <template #reference>
            <el-button type="text" icon="el-icon-s-operation">设置</el-button>
          </template>
          <div class="settings-panel">
            <div class="setting-item">
              <span>字体大小：</span>
              <el-slider v-model="fontSize" :min="14" :max="24" :step="1" @change="updateFontSize"></el-slider>
              <span>{{ fontSize }}px</span>
            </div>
            <el-button type="danger" plain @click="confirmClearMessages" size="small" icon="el-icon-delete">
              清空聊天记录
            </el-button>
          </div>
        </el-popover>
      </div>
    </div>
  
    <!-- 聊天历史区域 -->
    <div class="chat-history" ref="chatHistoryRef" :style="{ fontSize: fontSize + 'px' }">
      <el-empty v-if="messages.length === 0" description="暂无对话记录" />
      <div v-else class="messages">
        <div v-for="(message, index) in messages" :key="index" :class="['message-item', message.type]">
          <div class="message-header">
            <div class="avatar">
              {{ message.type === 'user' ? '我' : 'AI助手' }}
            </div>
            <div class="time">{{ formatTime(message.timestamp) }}</div>
          </div>
          <div class="message-content">
            <!-- 使用v-html确保HTML格式正确渲染 -->
            <div v-if="message.type === 'ai'" v-html="formatMessageContent(message.content)"></div>
            <!-- 用户消息仍然使用普通文本渲染 -->
            <div v-else>{{ message.content }}</div>
          </div>
        </div>
        <div v-if="isLoading" class="loading-indicator">
          <el-icon>
            <Loading />
          </el-icon>
          <span>AI助手正在思考...</span>
        </div>
      </div>
    </div>
  
    <!-- 输入区域 -->
    <div class="input-area">
      <el-input v-model="inputMessage" type="textarea" :rows="3" placeholder='请输入您的健康问题，例如："我最近总是头晕，应该怎么办？"' 
        :maxlength="500" show-word-limit resize="none" @keydown.enter.exact.prevent="handleEnterKey"></el-input>
      <div class="input-controls">
        <div class="quick-questions">
          <el-button v-for="(question, index) in quickQuestions" :key="index" type="text" size="small" 
            @click="useQuickQuestion(question)">
            {{ question }}
          </el-button>
        </div>
        <div class="action-buttons">
          <el-button v-if="isLoading" type="danger" @click="stopAIResponse" size="default" 
            icon="el-icon-circle-close">
            停止回答
          </el-button>
          <el-button v-else type="primary" @click="sendMessage" :disabled="!inputMessage.trim()" size="default" 
           >
            发送
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Loading } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import api from '../../api'
import { useAIConsultStore } from '../../store/aiConsult'
import MarkdownIt from 'markdown-it'

// 初始化markdown-it实例
const md = new MarkdownIt({
  html: true,         // 允许HTML标签
  breaks: true,       // 转换换行符为<br>
  linkify: true,      // 自动转换URL为链接
  typographer: true,  // 启用一些语言中立的替换和引号美化
  xhtmlOut: true      // 使用xhtml风格的标签闭合
});

// 定义组件名称
const name = 'AIConsult'

// 响应式数据
const inputMessage = ref('')
const quickQuestions = ref([
  '我最近总是头晕，应该怎么办？',
  '老年人如何保持健康？',
  '血压高应该注意什么？',
  '糖尿病患者的饮食建议'
])
const chatHistoryRef = ref(null)
const currentAIMessageId = ref(null)

// 初始化Pinia store
const aiStore = useAIConsultStore()
const router = useRouter()

// 返回首页
const navigateToHome = () => {
  router.push('/user/home')
}

// 计算属性
const messages = computed(() => {
  return aiStore?.conversations || []
})

const fontSize = computed(() => {
  return aiStore?.fontSize || 16
})

const isLoading = computed(() => {
  return aiStore?.isLoading || false
})

// 发送消息
const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return

  const message = inputMessage.value.trim()
  // 添加用户消息
  addUserMessage(message)
  // 清空输入框
  inputMessage.value = ''
  // 设置加载状态
  aiStore.setLoading(true)
  
  // 将aiMessageId移到try块外，使其在finally块中也可访问
  const aiMessageId = Date.now() // 用于标识AI回复
  currentAIMessageId.value = aiMessageId // 保存当前AI消息ID以便停止时使用

  try {
    // 创建对话（首次发送时）
    if (aiStore.conversations.length === 1) {
      try {
        await api.cozeAI.createConversation({
          content: message,
          name: '健康咨询'
        })
        console.log('对话创建成功')
      } catch (error) {
        console.warn('对话创建失败，继续使用现有会话:', error)
      }
    }
    
    // 添加一个空的AI回复占位符
    addAIMessage('', aiMessageId)
    
    // 调用流式API
    await api.cozeAI.streamChat(
      { question: message },
      // 接收到每个数据块时
      (chunk, fullContent) => {
        // 更新AI回复内容
        aiStore.updateAIMessage(aiMessageId, fullContent)
      },
      // 完成时
      (fullContent) => {
        console.log('流式响应完成:', fullContent)
        currentAIMessageId.value = null // 清除当前AI消息ID
      },
      // 错误时
      (error) => {
        console.error('流式调用错误:', error)
        aiStore.updateAIMessage(aiMessageId, '抱歉，我暂时无法回答您的问题，请稍后再试。')
        currentAIMessageId.value = null // 清除当前AI消息ID
      }
    )
  } catch (error) {
    console.error('发送消息失败', error)
    // 添加错误提示消息
    addAIMessage('抱歉，我暂时无法回答您的问题，请稍后再试。', aiMessageId)
    ElMessage.error('发送消息失败，请重试')
  } finally {
    // 关闭加载状态
    aiStore.setLoading(false)
    // 确保清除当前AI消息ID
    if (currentAIMessageId.value === aiMessageId) {
      currentAIMessageId.value = null
    }
  }
}

// 添加默认问候语
const addDefaultGreeting = () => {
  const greeting = {
    content: '您好！我是AI健康咨询助手，很高兴为您提供健康相关的咨询服务。请问有什么健康问题可以帮您解答？',
    messageId: Date.now()
  }
  aiStore.addAIResponse(greeting)
}

// 添加用户消息
const addUserMessage = (content) => {
  aiStore.addUserMessage(content)
}

// 添加AI消息
const addAIMessage = (content = '', messageId = null) => {
  aiStore.addAIResponse({ 
    content, 
    messageId: messageId || Date.now() 
  })
}

// 确认清空消息
const confirmClearMessages = () => {
  ElMessageBox.confirm(
    '确定要清空所有聊天记录吗？此操作不可恢复。',
    '确认清空',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      aiStore.clearConversations()
      // 清空后添加默认问候语
      addDefaultGreeting()
      ElMessage.success('聊天记录已清空')
    })
    .catch(() => { })
}

// 更新字体大小
const updateFontSize = () => {
  aiStore.adjustFontSize(fontSize.value)
  // 确保字体大小样式正确应用到消息容器
  if (chatHistoryRef.value) {
    chatHistoryRef.value.style.fontSize = fontSize.value + 'px'
  }
}

// 使用快捷问题
const useQuickQuestion = (question) => {
  inputMessage.value = question
}

// 格式化消息内容，过滤掉JSON格式的控制信息并转换Markdown为HTML
const formatMessageContent = (content) => {
  if (!content) return '';
  
  try {
    // 检查并过滤JSON格式的控制信息
    let processedContent = content;
    let quickQuestions = [];
    
    // 1. 检查是否有JSON格式控制信息
    const jsonStart = content.indexOf('{"msg_type":');
    if (jsonStart > 0) {
      // 只保留JSON对象之前的内容
      processedContent = content.substring(0, jsonStart).trim();
    }
    
    // 2. 检查是否有类似 `",“from_module”:null,“from_unit”:null}问题文本` 的模式
    const jsonEndPattern = /",“from_module”:null,“from_unit”:null\}([^，。.；;]+)/g;
    let match;
    while ((match = jsonEndPattern.exec(content)) !== null) {
      // 提取问题文本并添加到快速问题列表
      const question = match[1].trim();
      if (question && !question.includes('{') && !question.includes('}')) {
        quickQuestions.push(question);
      }
    }
    
    // 3. 处理中文数字标题和其他标题格式
    processedContent = processedContent.replace(/^(一|二|三|四|五|六|七|八|九|十|百|千)、(.*)$/gm, '# $2');
    processedContent = processedContent.replace(/^(\d+)\.|^(\d+)\)(.*)$/gm, '## $2$3');
    
    // 4. 使用markdown-it进行Markdown到HTML的转换
    let html = md.render(processedContent);
    
    // 5. 添加快速追问按钮（如果有）
    if (quickQuestions.length > 0) {
      let quickQuestionsHtml = '<div class="message-quick-questions">';
      quickQuestions.forEach((question, index) => {
        // 使用data-question属性存储问题文本
        quickQuestionsHtml += `<button 
          class="quick-question-button"
          data-question="${question}"
          onclick="document.querySelector('.el-textarea__inner').value = this.getAttribute('data-question');">
          ${question}
        </button>`;
      });
      quickQuestionsHtml += '</div>';
      
      html += quickQuestionsHtml;
    }
    
    // 6. 添加字体大小样式到内容容器
    html = `<div style="font-size: inherit;">${html}</div>`;
    
    return html;
  } catch (error) {
    console.warn('格式化消息内容失败:', error);
    return content;
  }
};

// 停止AI回答
const stopAIResponse = () => {
  if (api.cozeAI.currentAbortController) {
    // 调用中断方法 - 正确调用currentAbortController函数
    api.cozeAI.currentAbortController();
    
    // 更新UI状态
    aiStore.setLoading(false);
    
    // 如果有当前AI消息，添加一个已中断的标记
    if (currentAIMessageId.value) {
      const currentMessage = messages.value.find(
        msg => msg.type === 'ai' && msg.messageId === currentAIMessageId.value
      );
      
      if (currentMessage) {
        // 如果消息内容为空，设置为默认中断提示
        const content = currentMessage.content || '回答已中断。';
        aiStore.updateAIMessage(
          currentAIMessageId.value, 
          content + '<br><small style="color: gray;">(回答已中断)</small>'
        );
      }
    }
    
    currentAIMessageId.value = null;
    console.log('已停止AI回答');
  }
}

// 处理回车键发送
const handleEnterKey = (event) => {
  // 按下Ctrl+Enter换行（已经通过prevent阻止了默认行为）
  // 这里只处理普通Enter键发送
  if (!event.ctrlKey) {
    sendMessage()
  }
}

// 滚动到最新消息
const scrollToBottom = () => {
  if (chatHistoryRef.value) {
    const chatHistory = chatHistoryRef.value
    chatHistory.scrollTop = chatHistory.scrollHeight
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${hours}:${minutes}`
}

// 生命周期钩子
onMounted(() => {
  // 从本地存储加载数据
  aiStore.loadFromLocalStorage()
  aiStore.loadFontSize()
  
  // 添加默认问候语（如果没有现有对话）
  if (aiStore.conversations.length === 0) {
    addDefaultGreeting()
  }
  
  // 使用nextTick确保DOM已经更新
  nextTick(() => {
    // 数据加载完成后滚动到底部
    scrollToBottom()
    
    // 为确保在某些较慢的渲染情况下也能正确滚动，添加一个小延迟
    setTimeout(() => {
      scrollToBottom()
    }, 100)
  })
  
  // 监听消息变化，自动滚动到底部
  watch(
    () => messages.value.length,
    () => nextTick(() => scrollToBottom())
  )
  
  // 监听消息内容的变化，确保在流式更新时也能滚动
  watch(
    () => messages.value,
    () => nextTick(() => scrollToBottom()),
    { deep: true }
  )
})
</script>

<style scoped>
/* 深色科技感主题变量 */
:root {
  --bg-dark: #0f172a;
  --bg-darker: #030712;
  --bg-card: rgba(30, 41, 59, 0.7);
  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-tertiary: #64748b;
  --primary-blue: #0ea5e9;
  --primary-blue-dark: #0284c7;
  --primary-blue-light: rgba(14, 165, 233, 0.1);
  --primary-green: #10b981;
  --primary-green-light: rgba(16, 185, 129, 0.1);
  --border-glass: rgba(14, 165, 233, 0.2);
  --glow-blue: 0 0 20px rgba(14, 165, 233, 0.3);
  --glow-green: 0 0 20px rgba(16, 185, 129, 0.3);
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

.ai-consult {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-dark);
  color: var(--text-primary);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  overflow: hidden;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.05) 0%, transparent 50%);
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--border-glass);
  background: rgba(30, 41, 59, 0.5);
  border-radius: 12px;
  margin-bottom: 20px;
}

/* 返回首页按钮样式 */
.back-home-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #0ea5e9, #38bdf8);
  border: 2px solid #0ea5e9;
  border-radius: 24px;
  color: white;
  font-size: 17px;
  font-weight: 700;
  padding: 12px 24px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
}

.back-home-btn:hover {
  background: linear-gradient(135deg, #0284c7, #0ea5e9);
  color: white;
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.4);
  border-color: #0284c7;
}

.back-home-btn:active {
  transform: translateY(0);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.3);
}

.back-home-btn .el-icon {
  margin-right: 6px;
  font-size: 20px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #0ea5e9;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.3);
}

.header-controls {
  display: flex;
  gap: 10px;
}

/* 设置面板 */
.settings-panel {
  padding: 10px;
}

.setting-item {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 聊天历史区域 - 深色科技感 */
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 20px 0;
  min-height: 0;
  background: transparent;
  scroll-behavior: smooth;
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

/* Markdown样式 - 深色科技感 */
.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4),
.message-content :deep(h5),
.message-content :deep(h6) {
  margin: 15px 0 10px 0;
  font-weight: 700;
  line-height: 1.5;
  color: #0ea5e9;
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.2);
}

.message-content :deep(h1) { font-size: 1.8em; }
.message-content :deep(h2) { font-size: 1.6em; }
.message-content :deep(h3) { font-size: 1.4em; }
.message-content :deep(h4) { font-size: 1.2em; }
.message-content :deep(h5),
.message-content :deep(h6) { font-size: 1em; }

.message-content :deep(ul),
.message-content :deep(ol) {
  margin: 10px 0;
  padding-left: 25px;
}

.message-content :deep(li) {
  margin: 5px 0;
  line-height: 1.6;
  color: #e2e8f0;
}

.message-content :deep(strong) {
  font-weight: 700;
  color: #0ea5e9;
}

.message-content :deep(em) {
  font-style: italic;
  color: #94a3b8;
}

.message-content :deep(br) {
  display: block;
  margin: 5px 0;
}

.message-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 80%;
  animation: messageSlideIn 0.3s ease-out;
}

@keyframes messageSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message-item.user {
  align-items: flex-end;
  align-self: flex-end;
}

.message-item.ai {
  align-items: flex-start;
  align-self: flex-start;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.message-item.user .message-header {
  flex-direction: row-reverse;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: #0ea5e9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
  transition: all 0.3s ease;
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.6);
}

.message-item.ai .avatar {
  background-image: url('/AiICon1.png');
  background-size: cover;
  background-position: center;
  color: transparent;
  border: 2px solid rgba(16, 185, 129, 0.6);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.4);
}

.message-item.ai .avatar:hover {
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
}

.time {
  font-size: 12px;
  color: #94a3b8;
}

.message-content {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
  color: #f8fafc;
  border-radius: 16px;
  padding: 14px 18px;
  line-height: 1.6;
  word-wrap: break-word;
  transition: all 0.3s ease;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(4px);
}

.message-content:hover {
  box-shadow: 0 0 20px rgba(14, 165, 233, 0.2);
  transform: translateY(-1px);
}

.message-item.user .message-content {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.8), rgba(10, 148, 206, 0.8));
  color: white;
  border: 1px solid rgba(14, 165, 233, 0.3);
}

.message-item.user .message-content:hover {
  box-shadow: 0 0 25px rgba(14, 165, 233, 0.5);
}

/* 加载指示器 - 深色科技感 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0ea5e9;
  padding: 12px 20px;
  align-self: flex-start;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.8), rgba(15, 23, 42, 0.8));
  border-radius: 16px;
  border: 1px solid rgba(14, 165, 233, 0.3);
  animation: pulse 1.5s infinite ease-in-out;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.2);
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 输入区域 - 深色科技感 */
.input-area {
  border-top: 1px solid var(--border-glass);
  padding: 20px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.9));
  border-radius: 16px;
  margin-top: 20px;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.input-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  gap: 16px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

/* 快捷问题 - 深色科技感 */
.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.quick-questions .el-button {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
  border: 1px solid rgba(14, 165, 233, 0.3);
  transition: all 0.3s ease;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.1);
}

.quick-questions .el-button:hover {
  background-color: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(14, 165, 233, 0.5);
}

/* 滚动条样式 - 深色科技感 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: rgba(15, 23, 42, 0.3);
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: rgba(14, 165, 233, 0.5);
  border-radius: 3px;
  transition: background 0.3s ease;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: rgba(14, 165, 233, 0.8);
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.4);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-consult {
    height: calc(100vh - 150px);
    padding: 0 15px;
  }

  .page-header h2 {
    font-size: 20px;
  }

  .message-item {
    max-width: 90%;
  }

  .input-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }

  .quick-questions {
    justify-content: center;
  }

  .header-controls {
    flex-direction: column;
    gap: 5px;
  }
}

/* 适配老年人为使用的辅助样式 */
.message-content {
  transition: all 0.3s;
}

:deep(.el-button) {
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-1px);
}

:deep(.el-textarea__inner) {
  resize: none;
  min-height: 100px;
  border-radius: 20px;
  border: 2px solid transparent;
  background: linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #0ea5e9, #6366f1) border-box;
  background-color: rgba(255, 255, 255, 0.95);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 16px 20px;
  font-size: 16px;
  line-height: 1.7;
  letter-spacing: 0.3px;
  color: #1e293b;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

:deep(.el-textarea__inner:focus) {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.3), 0 4px 20px rgba(14, 165, 233, 0.15);
  background-color: white;
  transform: translateY(-1px);
  border-image: linear-gradient(135deg, #0ea5e9, #6366f1) 1;
}

:deep(.el-textarea__inner:hover:not(:focus)) {
  border-color: rgba(14, 165, 233, 0.5);
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.15);
}

/* 优化placeholder样式 */
:deep(.el-textarea__inner::placeholder) {
  color: #94a3b8;
  font-style: italic;
  transition: color 0.3s ease;
}

:deep(.el-textarea__inner:focus::placeholder) {
  color: #cbd5e1;
}

/* 字数统计样式优化 */
:deep(.el-input__count) {
  color: #64748b;
  font-size: 12px;
  padding: 4px 12px;
  background-color: rgba(248, 250, 252, 0.8);
  border-radius: 12px;
  margin-top: 8px;
  align-self: flex-end;
  transition: all 0.3s ease;
}

:deep(.el-input__count:hover) {
  background-color: rgba(241, 245, 249, 1);
  color: #475569;
}

/* 快速追问按钮样式 - 深色科技感 */
.message-content :deep(.message-quick-questions) {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.message-content :deep(.quick-question-button) {
  background-color: rgba(14, 165, 233, 0.1);
  color: #0ea5e9;
  border: 1px solid rgba(14, 165, 233, 0.3);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(14, 165, 233, 0.1);
}

.message-content :deep(.quick-question-button:hover) {
  background-color: #0ea5e9;
  color: white;
  border-color: #0ea5e9;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.4);
}

/* 优化Markdown内容样式 - 深色科技感 */
.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3) {
  color: #0ea5e9;
  font-weight: 700;
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.2);
}

.message-item.user .message-content :deep(h1),
.message-item.user .message-content :deep(h2),
.message-item.user .message-content :deep(h3) {
  color: white;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
}
</style>