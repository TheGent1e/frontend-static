<template>
  <div class="ai-consult">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>AI健康咨询助手</h2>
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
            icon="el-icon-send">
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
  aiStore.loadFromSessionStorage()
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
.ai-consult {
  height: calc(100vh - 200px);
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 16px;
  overflow: hidden;
}

/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
  background: #fafafa;
  border-radius: 12px;
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #333;
  font-weight: 600;
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

/* 聊天历史区域 */
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
  background-color: #ffffff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Markdown样式 */
.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3),
.message-content :deep(h4),
.message-content :deep(h5),
.message-content :deep(h6) {
  margin: 15px 0 10px 0;
  font-weight: 600;
  line-height: 1.5;
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
}

.message-content :deep(strong) {
  font-weight: 600;
}

.message-content :deep(em) {
  font-style: italic;
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
  background-color: #667eea;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 3px 10px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.avatar:hover {
  transform: scale(1.05);
}

.message-item.ai .avatar {
  background-image: url('/AiICon1.png');
  background-size: cover;
  background-position: center;
  color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.8);
}

.time {
  font-size: 12px;
  color: #999;
}

.message-content {
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 14px 18px;
  line-height: 1.6;
  word-wrap: break-word;
  transition: all 0.3s ease;
  border: 1px solid #e8e8e8;
}

.message-content:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.message-item.user .message-content {
  background-color: #409eff;
  color: white;
  border: none;
}

.message-item.user .message-content:hover {
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.5);
}

/* 加载指示器 */
.loading-indicator {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #555;
  padding: 12px 20px;
  align-self: flex-start;
  background-color: #f5f5f5;
  border-radius: 12px;
  border: 1px solid #e8e8e8;
  animation: pulse 1.5s infinite ease-in-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* 输入区域 */
.input-area {
  border-top: 1px solid #e8e8e8;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  margin-top: 20px;
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

/* 快捷问题 */
.quick-questions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  flex: 1;
}

.quick-questions .el-button {
  background-color: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  transition: all 0.3s ease;
  border-radius: 20px;
}

.quick-questions .el-button:hover {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 3px 12px rgba(102, 126, 234, 0.4);
}

/* 滚动条样式 */
.chat-history::-webkit-scrollbar {
  width: 6px;
}

.chat-history::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.02);
  border-radius: 3px;
}

.chat-history::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  transition: background 0.3s ease;
}

.chat-history::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
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

:deep(.el-input__inner) {
  transition: all 0.3s ease;
  border-radius: 16px;
  border-color: rgba(224, 224, 224, 0.8);
  background-color: rgba(255, 255, 255, 0.8);
}

:deep(.el-input__inner:focus) {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

/* 快速追问按钮样式 */
.message-content :deep(.message-quick-questions) {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.message-content :deep(.quick-question-button) {
  background-color: rgba(102, 126, 234, 0.1);
  color: #667eea;
  border: 1px solid rgba(102, 126, 234, 0.2);
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.message-content :deep(.quick-question-button:hover) {
  background-color: #667eea;
  color: white;
  border-color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

/* 优化Markdown内容样式 */
.message-content :deep(h1),
.message-content :deep(h2),
.message-content :deep(h3) {
  color: #333;
  font-weight: 700;
}

.message-item.user .message-content :deep(h1),
.message-item.user .message-content :deep(h2),
.message-item.user .message-content :deep(h3) {
  color: white;
  font-weight: 700;
}
</style>