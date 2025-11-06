import axios from 'axios'

// 创建axios实例
const api = axios.create({
  baseURL: '/api', // 使用/api前缀，配合vite代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 创建扣子智能体API实例
const cozeApi = axios.create({
  baseURL: '/coze-api', // 使用vite代理路径
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer cztei_l1U55TNtsiaD1ZAQR5R7OU5ug087ZuVdJjxaDINtb3aTWkctSqdlobCLGIGrN5gAb'
  }
})

// 请求拦截器
api.interceptors.request.use(
  config => {
    // 确保headers对象存在
    if (!config.headers) {
      config.headers = {}
    }

    // 从localStorage获取token
    const token = localStorage.getItem('token')
    console.log('请求拦截器 - 检查token:', token ? '存在' : '不存在')
    console.log('请求URL:', config.url)

    if (token) {
      // 添加token到请求头，同时支持多种常用认证头格式
      config.headers.token = token; // 原始格式
      config.headers.Authorization = `Bearer ${token}`; // 标准Bearer格式
      console.log('添加token到请求头(token字段):', token)
      console.log('添加token到请求头(Authorization字段):', `Bearer ${token}`)
      console.log('请求头信息:', JSON.stringify(config.headers))
    } else {
      console.warn('未找到token，无法添加到请求头')
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  response => {
    // 直接返回后端的原始响应格式，不进行转换
    return response.data
  },
  error => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回错误状态码
      const { status } = error.response
      if (status === 401) {
        // 未授权，清除token并重定向到登录页
        localStorage.removeItem('token')
        localStorage.removeItem('role')
        localStorage.removeItem('userInfo')

        // 确保用户状态被重置
        try {
          const { useUserStore } = require('../store/user')
          const userStore = useUserStore()
          if (userStore) {
            userStore.logout()
          }
        } catch (e) {
          console.warn('无法重置用户状态:', e)
        }

        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// 导出API方法
export default {
  // 用户相关API
  user: {
    // 登录
    login(data) {
      // 根据后端API文档，调用实际的登录接口
      // 后端不再需要前端传递role参数，直接从登录信息中判断角色
      return api.post('/login', {
        username: data.username,
        password: data.password
      })
    },

    // 获取用户信息
    getUserInfo() {
      // 模拟API响应，使用后端API的code: 1格式
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 1,
            data: {
              id: 1,
              name: '张三',
              age: 65,
              gender: '男',
              healthRecordNumber: 'HR20240001',
              phone: '13800138001',
              address: '北京市朝阳区健康路88号',
              emergencyContact: '李四',
              emergencyPhone: '13900139001'
            },
            msg: 'success'
          })
        }, 500)
      })
    },

    // 获取健康数据
    getHealthData() {
      // 模拟API响应，使用后端API的code: 1格式
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 1,
            data: {
              bloodPressure: {
                latest: { systolic: 120, diastolic: 80, date: '2024-10-23' },
                trend: [
                  { date: '2024-10-20', systolic: 125, diastolic: 82 },
                  { date: '2024-10-21', systolic: 122, diastolic: 81 },
                  { date: '2024-10-22', systolic: 123, diastolic: 80 },
                  { date: '2024-10-23', systolic: 120, diastolic: 80 }
                ]
              },
              bloodSugar: {
                latest: { value: 5.6, date: '2024-10-23' },
                trend: [
                  { date: '2024-10-20', value: 5.8 },
                  { date: '2024-10-21', value: 5.7 },
                  { date: '2024-10-22', value: 5.9 },
                  { date: '2024-10-23', value: 5.6 }
                ]
              },
              heartRate: {
                latest: { value: 72, date: '2024-10-23' },
                trend: [
                  { date: '2024-10-20', value: 75 },
                  { date: '2024-10-21', value: 73 },
                  { date: '2024-10-22', value: 74 },
                  { date: '2024-10-23', value: 72 }
                ]
              }
            },
            msg: 'success'
          })
        }, 500)
      })
    },

    // 获取服务记录
    getServiceRecords() {
      // 模拟API响应，使用后端API的code: 1格式
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            code: 1,
            data: [
              {
                id: 1,
                type: '健康体检',
                date: '2024-10-15',
                servicePerson: '张医生',
                status: '已完成'
              },
              {
                id: 2,
                type: '上门问诊',
                date: '2024-10-10',
                servicePerson: '李护士',
                status: '已完成'
              },
              {
                id: 3,
                type: '慢病管理',
                date: '2024-10-05',
                servicePerson: '王医生',
                status: '已完成'
              }
            ],
            msg: 'success'
          })
        }, 500)
      })
    }
  },

  // 管理员相关API
  admin: {
    // 获取用户列表
    getUserList(params) {
      // 模拟API响应
      return new Promise((resolve) => {
        setTimeout(() => {
          const mockUsers = [
            { id: 1, name: '张三', gender: '男', age: 65, phone: '13800138001', registerTime: '2024-01-15', status: 'active' },
            { id: 2, name: '李四', gender: '女', age: 68, phone: '13800138002', registerTime: '2024-02-20', status: 'active' },
            { id: 3, name: '王五', gender: '男', age: 72, phone: '13800138003', registerTime: '2024-03-10', status: 'inactive' },
            { id: 4, name: '赵六', gender: '女', age: 63, phone: '13800138004', registerTime: '2024-04-05', status: 'active' },
            { id: 5, name: '钱七', gender: '男', age: 70, phone: '13800138005', registerTime: '2024-05-12', status: 'active' }
          ]
          resolve({
            code: 200,
            data: {
              list: mockUsers,
              total: mockUsers.length,
              page: params.page || 1,
              pageSize: params.pageSize || 10
            }
          })
        }, 500)
      })
    },

    // 添加用户
    addUser(data) {
      return api.post('/admin/users', data)
    },

    // 更新用户
    updateUser(id, data) {
      return api.put(`/admin/users/${id}`, data)
    },

    // 删除用户
    deleteUser(id) {
      return api.delete(`/admin/users/${id}`)
    },

    // 获取统计数据
    getCount() {
      // 由于vite.config.js中的代理配置会移除/api前缀，所以这里直接使用正确的路径
      return api.post('/admin/count')
    },

    // 获取员工列表（多条件分页查询）
    getEmployees(queryData) {
      // 由于vite.config.js中的代理配置会移除/api前缀，这里使用正确的路径
      // 使用GET请求并通过URL查询参数传递条件
      return api.get('/admin/emp/list', { params: queryData })
    },

    // 添加员工
    addEmployee(employeeData) {
      return api.post('/admin/emp/add', employeeData)
    },

    // 删除员工（单个或批量）
    deleteEmployee(ids) {
      // 后端API使用DELETE方法，URL参数格式为 /admin/emp/delete/{ids}
      // 将ids数组转换为逗号分隔的字符串
      const idsStr = Array.isArray(ids) ? ids.join(',') : ids
      return api.delete(`/admin/emp/delete/${idsStr}`)
    },

    // 根据ID查询员工信息
    findEmpbyId(id) {
      // 后端API使用GET方法，URL格式为 /admin/emp/findEmpbyId/{id}
      return api.get(`/admin/emp/findEmpbyId/${id}`)
    },

    // 更新员工信息
    updateEmployee(employeeData) {
      // 后端API使用POST方法，URL格式为 /admin/emp/update
      return api.post('/admin/emp/update', employeeData)
    },

    // 获取部门ID和名称映射
    findDeptIdAndName() {
      // 后端API使用GET方法，URL格式为 /admin/dept/findDeptIdAndName
      return api.get('/admin/dept/findDeptIdAndName')
    },

    // 获取部门列表
    getDeptList() {
      // 后端API使用GET方法，URL格式为 /admin/dept/list
      // 注意：vite会自动代理并处理路径
      return api.get('/admin/dept/list')
    },

    // 添加部门
    addDept(deptData) {
      // 后端API使用POST方法，URL格式为 /admin/dept/add
      // 注意：vite会自动代理并处理路径
      return api.post('/admin/dept/add', deptData)
    },

    // 更新部门
    updateDept(deptData) {
      // 后端API使用POST方法，URL格式为 /admin/dept/update
      // 注意：vite会自动代理并处理路径
      return api.post('/admin/dept/update', deptData)
    },

    /**
     * 根据ID查询部门信息（回显部门）
     * @description 获取指定ID的部门详细信息，用于编辑部门时的数据回显
     * @param {number} id - 部门ID
     * @returns {Promise} - 返回Promise对象，解析为部门详细信息
     * @api GET /admin/dept/findById/{id}
     * @returns {
     *   code: number, // 状态码，1表示成功
     *   msg: string,  // 提示信息
     *   data: {
     *     id: number,           // 部门ID
     *     departmentName: string, // 部门名称
     *     description: string,   // 部门描述
     *     managerId: number,     // 部门经理ID
     *     managerName: string,   // 部门经理名称
     *     employeeCount: number, // 员工人数
     *     createdAt: string,     // 创建时间
     *     updatedAt: string      // 更新时间
     *   }
     * }
     */
    findDeptById(id) {
      // 根据后端API文档实现，使用GET方法查询指定ID的部门信息
      // URL格式：/admin/dept/findById/{id}
      // 注意：vite配置的baseURL为'/api'，代理会自动处理路径
      return api.get(`/admin/dept/findById/${id}`)
    },

    // 删除部门
    deleteDept(id) {
      // 后端API使用GET方法，URL格式为 /admin/dept/delete/{id}
      // 注意：vite会自动代理并处理路径
      return api.delete(`/admin/dept/delete/${id}`)
    },

    // 获取动态员工列表（用于部门经理下拉选择）
    getDynamicEmployees(name = '') {
      // 使用name参数而不是type，匹配后端API要求
      return api.get('/admin/emp/dynamic', { params: { name } })
    }
  },

  // AI咨询相关API
  ai: {
    // 发送咨询请求
    consult(data) {
      // 模拟AI回复
      return new Promise((resolve) => {
        setTimeout(() => {
          // 根据问题内容模拟不同的回复
          let replyContent = ''
          let recommendService = null

          if (data.question.includes('高血压')) {
            replyContent = `<p>高血压患者在饮食上需要注意以下几点：</p><ul><li>减少钠盐摄入，每日食盐量不超过5克</li><li>增加钾盐摄入，多吃新鲜蔬菜和水果</li><li>减少高脂肪、高胆固醇食物的摄入</li><li>适量摄入优质蛋白质</li><li>戒烟限酒</li></ul><p style='color:red;'>特别提醒：请定期监测血压，遵医嘱服药，不要擅自停药或更改药物剂量。</p>`
            recommendService = '慢病管理服务'
          } else if (data.question.includes('血糖')) {
            replyContent = `<p>控制血糖的方法：</p><ul><li>合理饮食：控制总热量，少量多餐</li><li>适量运动：每周至少150分钟中等强度有氧运动</li><li>定期监测：空腹血糖和餐后血糖</li><li>遵医嘱用药</li><li>保持良好心态</li></ul>`
          } else if (data.question.includes('失眠')) {
            replyContent = `<p>改善失眠的建议：</p><ul><li>保持规律的作息时间</li><li>睡前避免使用电子设备</li><li>创造舒适的睡眠环境</li><li>睡前可进行放松活动，如热水泡脚</li><li>避免睡前饮用咖啡、茶等刺激性饮料</li></ul>`
          } else {
            replyContent = `<p>感谢您的咨询。基于您的问题，我建议您：</p><ul><li>保持健康的生活方式</li><li>定期进行体检</li><li>如有不适，请及时就医</li></ul><p>如果您有更具体的健康问题，请详细描述，我可以提供更有针对性的建议。</p>`
          }

          resolve({
            code: 200,
            data: {
              replyContent,
              replyType: 'richText',
              recommendService
            }
          })
        }, 2000) // 模拟2秒的思考时间
      })
    }
  },

  // 扣子智能体相关API
  cozeAI: {
    // 创建对话
    createConversation(data) {
      // 使用正确的认证令牌
      const config = {
        headers: {
          'Authorization': 'Bearer pat_5ZVugLBFEj8nBFq2r8zOimwp9bFXNA5zHv5v6jpPCwemMR3rzRxcy7lQOKoWPIeb'
        }
      }

      // 调用创建对话API
      return cozeApi.post('/conversation/create', {
        bot_id: '7568083956755972134',
        name: data.name || '健康',
        connector_id: '1024',
        messages: [
          {
            role: 'user',
            type: 'question',
            content: data.content,
            content_type: 'text'
          }
        ]
      }, config)
    },

    // 发送智能体对话请求（非流式）
    chat(data) {
      // 使用正确的认证令牌
      const config = {
        headers: {
          'Authorization': 'Bearer pat_5ZVugLBFEj8nBFq2r8zOimwp9bFXNA5zHv5v6jpPCwemMR3rzRxcy7lQOKoWPIeb'
        }
      }
      // 调用扣子智能体API
      return cozeApi.post('/chat', {
        bot_id: '7568083956755972134',
        user_id: data.userId || '111',
        auto_save_history: true,
        stream: data.stream !== false, // 默认启用流式响应
        additional_messages: [
          {
            role: 'user',
            type: 'question',
            content_type: 'text',
            content: data.question
          }
        ]
      }, config)
    },

    // 发送智能体对话请求（流式处理）
    async streamChat(data, onChunk, onComplete, onError) {
      // 创建AbortController用于中断请求
      const controller = new AbortController();
      const signal = controller.signal;

      // 存储用于取消模拟响应的定时器
      let timeoutIds = [];

      // 提供取消方法
      const cancelFn = () => {
        // 取消fetch请求
        controller.abort();

        // 清除所有定时器
        timeoutIds.forEach(id => clearTimeout(id));
        timeoutIds = [];

        console.log('流式请求已取消');
      };

      // 将取消函数添加到返回值中，以便外部调用
      this.currentAbortController = cancelFn;

      try {
        // 设置正确的认证令牌和响应类型
        const response = await fetch('/coze-api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer pat_5ZVugLBFEj8nBFq2r8zOimwp9bFXNA5zHv5v6jpPCwemMR3rzRxcy7lQOKoWPIeb'
          },
          body: JSON.stringify({
            bot_id: '7568083956755972134',
            user_id: data.userId || '111',
            auto_save_history: true,
            stream: true,
            additional_messages: [
              {
                role: 'user',
                type: 'question',
                content_type: 'text',
                content: data.question
              }
            ]
          }),
          signal // 添加AbortSignal
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let fullContent = ''

        // 处理流式响应
        while (true) {
          // 检查是否已取消
          if (signal.aborted) {
            console.log('请求已取消，停止处理');
            // 取消读取器
            reader.cancel();
            // 如果已经收到了部分内容，发送已收到的内容
            if (fullContent.trim()) {
              onChunk(fullContent, fullContent);
              onComplete(fullContent);
            }
            return { success: false, canceled: true, content: fullContent };
          }

          const { done, value } = await reader.read()

          if (done) {
            // 全部接收完成后，只发送完成通知，不再重复发送内容
            if (fullContent.trim()) {
              onComplete(fullContent)
            }
            break
          }

          try {
            // 解码chunk
            const chunkText = decoder.decode(value, { stream: true })

            // 处理可能的多个chunk
            const chunks = chunkText.split('\n').filter(line => line.trim())

            for (const chunk of chunks) {
              if (chunk.startsWith('data:')) {
                const jsonStr = chunk.substring(5).trim()
                if (jsonStr === '[DONE]') {
                  if (fullContent.trim()) {
                    onChunk(fullContent, fullContent)
                    onComplete(fullContent)
                  }
                  return { success: true, content: fullContent }
                }

                try {
                  const jsonData = JSON.parse(jsonStr)
                  // 支持不同的响应格式，只提取实际内容
                  const content = jsonData.choices?.[0]?.delta?.content ||
                    jsonData.content ||
                    jsonData.text || ''

                  if (content) {
                    fullContent += content
                    // 实时发送累积的内容
                    onChunk(content, fullContent)
                  }
                } catch (jsonError) {
                  console.warn('解析JSON失败:', jsonError)
                }
              } else if (chunk.trim()) {
                // 尝试直接解析非data:前缀的内容
                try {
                  const jsonData = JSON.parse(chunk)
                  const content = jsonData.content ||
                    jsonData.text ||
                    ''
                  if (content) {
                    fullContent += content
                    // 实时发送累积的内容
                    onChunk(content, fullContent)
                  }
                } catch (jsonError) {
                  // 过滤掉event:等前缀信息，只保留实际内容
                  if (!chunk.startsWith('event:')) {
                    fullContent += chunk
                    // 实时发送累积的内容
                    onChunk(chunk, fullContent)
                  }
                }
              }
            }
          } catch (e) {
            console.error('处理chunk失败:', e)
            // 错误处理，但不立即发送
          }
        }

        return { success: true, content: fullContent }
      } catch (error) {
        // 检查是否是由于取消请求导致的错误
        if (error.name === 'AbortError') {
          console.log('请求已被用户取消');
          return { success: false, canceled: true };
        }

        console.error('流式请求失败:', error)
        if (onError) {
          onError(error)
        }

        // 降级为模拟流式响应
        if (onChunk && onComplete) {
          const fallbackResponses = {
            '头晕': [
              '头晕可能由多种原因引起，',
              '包括贫血、低血压、颈椎病等。',
              '建议您保持充足的休息，',
              '避免突然起身，如果症状持续，',
              '请及时就医检查。'
            ],
            '高血压': [
              '高血压患者应注意低盐饮食，',
              '控制体重，适量运动，',
              '保持良好的作息，',
              '定期监测血压，',
              '遵医嘱服药。'
            ],
            '糖尿病': [
              '糖尿病患者需要控制碳水化合物摄入，',
              '保持规律饮食，',
              '适量运动，',
              '定期监测血糖，',
              '遵循医生的治疗方案。'
            ]
          }

          // 根据问题内容选择合适的回复模板
          let selectedResponse = fallbackResponses['头晕'];
          const lowerQuestion = data.question.toLowerCase();
          if (lowerQuestion.includes('高血压') || lowerQuestion.includes('血压高')) {
            selectedResponse = fallbackResponses['高血压'];
          } else if (lowerQuestion.includes('糖尿病') || lowerQuestion.includes('血糖高')) {
            selectedResponse = fallbackResponses['糖尿病'];
          }

          let fullContent = '';
          let index = 0;

          // 模拟流式返回
          const simulateStreamResponse = () => {
            // 检查是否已取消
            if (timeoutIds.length === 0) {
              console.log('模拟响应已取消');
              // 如果已经收到了部分内容，发送已收到的内容
              if (fullContent.trim()) {
                onChunk(fullContent, fullContent);
                onComplete(fullContent);
              }
              return;
            }

            if (index < selectedResponse.length) {
              const chunk = selectedResponse[index];
              fullContent += chunk;
              onChunk(chunk, fullContent);
              index++;

              // 保存定时器ID以便后续可以取消
              const timeoutId = setTimeout(simulateStreamResponse, 300);
              timeoutIds.push(timeoutId);
            } else {
              onComplete(fullContent);
              // 完成后清空定时器列表
              timeoutIds = [];
            }
          };

          // 开始模拟
          const initialTimeoutId = setTimeout(simulateStreamResponse, 500);
          timeoutIds.push(initialTimeoutId);
        }

        return {
          success: false,
          error: error.message,
          fallbackContent: '抱歉，我暂时无法回答您的问题，请稍后再试。'
        }
      } finally {
        // 清理引用，避免内存泄漏
        if (!signal.aborted) {
          this.currentAbortController = null;
        }
      }
    },

    // 发送智能体对话请求（处理响应为项目统一格式）
    consult(data) {
      // 使用内部chat方法
      return this.chat(data)
        .then(response => {
          // 转换为项目统一的响应格式
          return {
            code: 200,
            data: {
              replyContent: response.data.content || '',
              replyType: 'richText',
              originalResponse: response.data
            },
            msg: 'success'
          }
        })
        .catch(error => {
          console.error('扣子智能体调用失败:', error)
          // 返回模拟数据作为降级方案，模拟流式响应效果
          return new Promise((resolve) => {
            // 模拟流式响应处理
            if (typeof data.onChunk === 'function' && typeof data.onComplete === 'function') {
              // 如果提供了流式回调，使用模拟流式响应
              const messages = [
                '<p>您好！',
                '我是您的健康助手。',
                '请问有什么可以帮助您的健康问题吗？</p>'
              ];
              let fullContent = '';
              let index = 0;

              const simulateStream = () => {
                if (index < messages.length) {
                  const chunk = messages[index];
                  fullContent += chunk;
                  data.onChunk(chunk, fullContent);
                  index++;
                  setTimeout(simulateStream, 300); // 模拟流式响应的延迟
                } else {
                  data.onComplete(fullContent);
                  resolve({
                    code: 200,
                    data: {
                      replyContent: fullContent,
                      replyType: 'richText',
                      isFallback: true
                    },
                    msg: '使用模拟流式响应'
                  });
                }
              };

              // 开始模拟流式响应
              setTimeout(simulateStream, 200);
            } else {
              // 如果没有提供流式回调，返回普通响应
              resolve({
                code: 200,
                data: {
                  replyContent: '<p>您好！我是您的健康助手。请问有什么可以帮助您的健康问题吗？</p>',
                  replyType: 'richText',
                  isFallback: true
                },
                msg: '使用降级方案'
              });
            }
          });
        })
    }
  }
}