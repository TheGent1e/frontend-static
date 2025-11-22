import { defineStore } from 'pinia'
import { useUserStore } from './user'

export const useAIConsultStore = defineStore('aiConsult', {
  state: () => ({
    conversations: [],
    isLoading: false,
    fontSize: 16 // 默认字体大小
  }),
  
  actions: {
    // 获取用户特定的存储键
    getUserSpecificKey(baseKey) {
      const userStore = useUserStore()
      // 如果用户已登录，使用用户名作为键的一部分
      if (userStore.isLoggedIn && userStore.userInfo) {
        return `${baseKey}_${userStore.userInfo.username}`
      }
      // 如果用户未登录，使用默认键（可能是访客模式）
      return baseKey + '_guest'
    },
    
    // 添加用户消息
    addUserMessage(message) {
      const newMessage = {
        id: Date.now(),
        type: 'user',
        content: message,
        timestamp: new Date().toISOString()
      }
      this.conversations.push(newMessage)
      this.saveToLocalStorage()
    },
    
    // 添加AI回复
    addAIResponse(response) {
      const newMessage = {
        id: Date.now(),
        messageId: response.messageId || Date.now(),
        type: 'ai',
        content: this.cleanMessageContent(response.content),
        responseType: response.type || 'text',
        recommendService: response.recommendService || null,
        timestamp: new Date().toISOString()
      }
      this.conversations.push(newMessage)
      this.saveToLocalStorage()
    },
    
    // 更新AI回复内容（用于流式响应）
    updateAIMessage(messageId, content) {
      const messageIndex = this.conversations.findIndex(msg => 
        msg.type === 'ai' && msg.messageId === messageId
      )
      if (messageIndex !== -1) {
        this.conversations[messageIndex].content = this.cleanMessageContent(content)
        this.saveToLocalStorage()
      }
    },
    
    // 清空对话历史
    clearConversations() {
      this.conversations = []
      // 使用用户特定的键来清除存储
      const key = this.getUserSpecificKey('ai_conversations')
      sessionStorage.removeItem(key)
    },
    
    // 清理消息内容，移除event前缀等无效信息，保留正确的Markdown格式
    cleanMessageContent(content) {
      if (!content) return '';
      
      // 移除event:开头的前缀行
      let lines = content.split('\n');
      const cleanedLines = lines.filter(line => {
        return !line.trim().startsWith('event:') && line.trim() !== '';
      });
      
      let cleanedContent = cleanedLines.join('\n');
      
      // 更精确地过滤JSON格式的控制信息
      // 查找JSON对象的起始位置，但要确保不会误删有效的Markdown内容
      const jsonRegex = /\{"msg_type":[^}]*\}/g;
      cleanedContent = cleanedContent.replace(jsonRegex, '').trim();
      
      // 处理可能的重复内容
      // 通过检测内容中的重复段落来减少重复
      const paragraphs = cleanedContent.split('\n\n');
      const uniqueParagraphs = [];
      const seenParagraphs = new Set();
      
      paragraphs.forEach(para => {
        const trimmedPara = para.trim();
        // 只有当段落不为空且未被处理过时才添加
        if (trimmedPara && !seenParagraphs.has(trimmedPara)) {
          uniqueParagraphs.push(para);
          // 对于较长的段落，我们认为它可能是重要的内容，加入到已见集合中
          if (trimmedPara.length > 100) {
            seenParagraphs.add(trimmedPara);
          }
        }
      });
      
      cleanedContent = uniqueParagraphs.join('\n\n');
      
      return cleanedContent;
    },
    
    // 保存对话到会话存储（浏览器关闭时会自动清除）
    saveToLocalStorage() {
      // 创建处理后的对话副本，只保留有效信息
      const processedConversations = this.conversations.map(msg => {
        if (msg.type === 'ai') {
          return {
            ...msg,
            content: this.cleanMessageContent(msg.content)
          };
        }
        return msg;
      });
      
      // 使用用户特定的键来保存对话记录
      const key = this.getUserSpecificKey('ai_conversations')
      sessionStorage.setItem(key, JSON.stringify(processedConversations))
    },
    
    // 从会话存储恢复对话
    loadFromLocalStorage() {
      // 使用用户特定的键来加载对话记录
      const key = this.getUserSpecificKey('ai_conversations')
      const saved = sessionStorage.getItem(key)
      if (saved) {
        try {
          this.conversations = JSON.parse(saved)
        } catch (error) {
          console.error('Failed to load conversations from sessionStorage', error)
        }
      }
    },
    
    // 设置加载状态
    setLoading(status) {
      this.isLoading = status
    },
    
    // 调整字体大小
    adjustFontSize(size) {
      this.fontSize = size
      sessionStorage.setItem('ai_font_size', size.toString())
    },
    
    // 从会话存储恢复字体大小
    loadFontSize() {
      const savedSize = sessionStorage.getItem('ai_font_size')
      if (savedSize) {
        this.fontSize = parseInt(savedSize)
      }
    }
  },
  
  getters: {
    // 获取对话历史
    getConversations: (state) => {
      return state.conversations
    },
    
    // 获取当前字体大小
    getFontSize: (state) => {
      return state.fontSize
    }
  }
})