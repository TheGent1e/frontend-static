<template>
  <div class="employee-management">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>员工信息管理</h2>
      <p>管理系统中的所有员工信息</p>
    </div>
    
    <!-- 内容卡片 -->
    <el-card class="content-card shadow-card">
      <template #header>
        <div class="card-header">
          <span>员工列表</span>
          <div class="header-buttons">
            <el-button 
              type="danger" 
              @click="handleBatchDelete" 
              plain 
              :disabled="selectedRows.length === 0"
            >
              <i class="el-icon-delete"></i> 批量删除 ({{ selectedRows.length }})
            </el-button>
            <el-button type="primary" @click="handleAddEmployee" plain>
              <i class="el-icon-plus"></i> 添加员工
            </el-button>
          </div>
        </div>
      </template>

      <!-- 员工添加/编辑对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="dialogTitle"
        width="600px"
        :close-on-click-modal="false"
        class="employee-dialog"
        :append-to-body="true"
        @close="handleDialogClose"
        >     <!-- 新增自定义类名 -->  <!-- 添加到body以避免父容器样式影响 -->  <!-- 添加关闭事件处理 -->
      
        <el-form
          ref="employeeFormRef"
          :model="employeeForm"
          :rules="rules"
          label-width="100px"
          label-position="right"
          class="dialog-form"
        >
          <el-form-item label="员工姓名" prop="name">
            <el-input v-model="employeeForm.name" placeholder="请输入员工姓名" />
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-select v-model="employeeForm.gender" placeholder="请选择性别">
              <el-option label="未知" :value="0" />
              <el-option label="男" :value="1" />
              <el-option label="女" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="职位" prop="position">
            <el-input v-model="employeeForm.position" placeholder="请输入职位" />
          </el-form-item>
          <el-form-item label="所属部门" prop="departmentId">
            <el-select v-model="employeeForm.departmentId" placeholder="请选择部门">
              <el-option
                v-for="dept in departments"
                :key="dept.id"
                :label="dept.name"
                :value="dept.id"/> <!-- value为数字类型，与employeeForm.departmentId类型一致 -->
            </el-select>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="employeeForm.phone" placeholder="请输入联系电话" />
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-switch
              v-model="employeeForm.status"
              active-value="1"
              inactive-value="0"
              active-text="在职"
              inactive-text="离职"
              active-color="#67c23a"
              inactive-color="#dcdfe6"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="submitForm">确定</el-button>
          </div>
        </template>
      </el-dialog>
      
      <!-- 搜索区域 -->
      <div class="search-bar">
        <div class="search-container">
          <el-form :inline="false" :model="queryForm" class="demo-form" label-width="80px">
            <div class="form-grid">
              <div class="form-column">
                <el-form-item label="员工姓名">
                  <el-input v-model="queryForm.name" placeholder="请输入员工姓名" clearable />
                </el-form-item>
                
                <el-form-item label="部门名称">
                  <el-input v-model="queryForm.departmentName" placeholder="请输入部门名称" clearable />
                </el-form-item>
              </div>
              
              <div class="form-column">
                <el-form-item label="性别">
                  <el-select v-model="queryForm.gender" placeholder="请选择性别" clearable>
                    <el-option label="全部" value="" />
                    <el-option label="未知" value="0" />
                    <el-option label="男" value="1" />
                    <el-option label="女" value="2" />
                  </el-select>
                </el-form-item>
                
                <el-form-item label="职位">
                  <el-input v-model="queryForm.position" placeholder="请输入职位" clearable />
                </el-form-item>
              </div>
            </div>
            
            <div class="form-row">
              <el-form-item label="创建时间" class="date-range-item">
                <el-date-picker
                  v-model="dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="YYYY-MM-DD"
                  :unlink-panels="true"
                  range-picker-options
                  style="width: 100%; max-width: 400px;"
                />
              </el-form-item>
              
              <el-form-item class="button-item">
                <div class="button-group">
                  <el-button type="primary" @click="handleSearch" class="search-btn">
                    <i class="el-icon-search"></i> 搜索
                  </el-button>
                  <el-button @click="resetSearch" class="reset-btn">
                    <i class="el-icon-refresh"></i> 重置
                  </el-button>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
      </div>
      
      <!-- 员工表格 -->
      <el-table 
        :data="employeesData" 
        style="width: 100%"
        :header-cell-style="{backgroundColor: '#f7f9fc', fontWeight: 'bold'}"
        row-class-name="employee-row"
        v-loading="loading"
        row-key="id"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="员工ID" width="80" />
        <el-table-column prop="name" label="员工姓名" />
        <el-table-column prop="gender" label="性别">
          <template #default="scope">
            {{ scope.row.gender === '1' ? '男' : scope.row.gender === '2' ? '女' : '未知' }}
          </template>
        </el-table-column>
        <el-table-column prop="position" label="职位" />
        <el-table-column prop="departmentName" label="所属部门">
          <template #default="scope">
            {{ scope.row.departmentId === 0 ? '无' : scope.row.departmentName }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="联系电话" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="scope">
            <el-switch 
              v-model="scope.row.status" 
              active-value="1" 
              inactive-value="0" 
              active-text="在职" 
              inactive-text="离职" 
              @change="handleStatusChange(scope.row)"
              active-color="#67c23a" 
              inactive-color="#dcdfe6"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditEmployee(scope.row)" type="primary" plain>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteEmployee(scope.row.id)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页组件 -->
      <div class="pagination">
        <el-pagination
          :current-page.sync="currentPage"
          :page-size.sync="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import api from '../../api'

// 定义组件名称
const name = 'EmployeeManagement'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)

// 查询条件对象
const queryForm = ref({
  name: '',
  gender: '',
  position: '',
  departmentName: ''
})

// 日期范围
const dateRange = ref([])

// 模拟员工数据 - 实际应用中应通过API获取
const employeesData = ref([
  { id: 1, name: '张三', position: '技术经理', departmentName: '技术部', phone: '138****1234', status: '1' },
  { id: 2, name: '李四', position: '客服专员', departmentName: '客服部', phone: '139****5678', status: '1' },
  { id: 3, name: '王五', position: '财务会计', departmentName: '财务部', phone: '158****8888', status: '0' },
  { id: 4, name: '赵六', position: '行政助理', departmentName: '行政部', phone: '188****9999', status: '1' },
  { id: 5, name: '钱七', position: '市场推广', departmentName: '市场部', phone: '177****6666', status: '1' },
  { id: 6, name: '孙八', position: '人力资源专员', departmentName: '人力资源部', phone: '166****5555', status: '0' }
])

// 选中的员工ID数组
const selectedRows = ref([])

// 对话框相关数据
const dialogVisible = ref(false)
const dialogTitle = ref('添加员工')
const employeeFormRef = ref()
const employeeForm = ref({
  id: null,
  name: '',
  gender: '0', // 0未知1男2女
  position: '',
  departmentId: 0,
  phone: '',
  status: '1' // 0-离职/1-在职
})

// 表单验证规则
const rules = ref({
  name: [
    { required: true, message: '请输入员工姓名', trigger: 'blur' }
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  position: [
    { required: true, message: '请输入职位', trigger: 'blur' }
  ],
  departmentId: [
    { required: true, message: '请选择所属部门', trigger: 'change' }
  ],
  phone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
})

// 部门列表（将从API动态获取）
const departments = ref([])

/**
 * 加载部门数据
 * @description 调用后端API获取部门列表
 * @api /api/admin/dept/findDeptIdAndName GET - 获取部门ID和名称列表
 */
const loadDepartmentsData = async () => {
  try {
    console.log('开始加载部门数据...')
    // 使用findDeptIdAndName API获取部门ID和名称列表
    console.log('调用API: api.admin.findDeptIdAndName()') // 对应API路径: /api/admin/dept/findDeptIdAndName
    const response = await api.admin.findDeptIdAndName()
    
    console.log('部门数据API响应:', response)
    
    // 检查响应是否有效
    console.log('API响应对象:', response)
    if (!response) {
      throw new Error('API返回了空响应')
    }
    
    // 处理不同的成功状态码
    if (response.code === 1 || response.code === 200) {
      console.log('API调用成功，状态码:', response.code)
      // 确保data字段存在
      if (response.data) {
        // 处理Map格式数据 {"1": "体检科", "2": "社区医疗", ...}
        if (typeof response.data === 'object' && !Array.isArray(response.data) && !response.data.rows) {
          // 将Map格式转换为数组格式 [{id: 1, name: '体检科'}, ...]
          departments.value = Object.entries(response.data).map(([id, name]) => ({
            id: Number(id),
            name: name
          }))
          console.log('部门数据(Map格式)加载成功，共', departments.value.length, '个部门')
          //打印部门Map数据
          console.log('部门完整数据：', departments.value); // 打印整个数组
          console.log('每个部门的id和name：', departments.value.map(dept => `id: ${dept.id}, name: ${dept.name}`)); // 逐个打印

        } else if (Array.isArray(response.data)) {
          // 直接使用响应数据，根据需要调整格式
          // 假设响应格式为 [{id: 1, name: '体检科'}, ...]
          departments.value = response.data
          console.log('部门数据(数组格式)加载成功，共', response.data.length, '个部门')
          console.log('部门完整数据：', departments.value); // 打印整个数组
        } else if (Array.isArray(response.data.rows)) {
          // 如果响应格式为 {rows: [...]}，使用rows数组
          departments.value = response.data.rows
          console.log('部门数据(rows格式)加载成功，共', response.data.rows.length, '个部门')
        } else {
          console.warn('部门数据格式异常，使用默认数据')
          // 数据格式异常时使用默认数据
          departments.value = [
            { id: 1, name: '体检科' },
            { id: 2, name: '社区医疗' },
            { id: 3, name: '内科' },
            { id: 4, name: '内分泌科' },
            { id: 5, name: '心内科' }
          ]
        }
      } else {
        console.warn('部门数据为空，使用默认数据')
        departments.value = [
          { id: 1, name: '体检科' },
          { id: 2, name: '社区医疗' },
          { id: 3, name: '内科' },
          { id: 4, name: '内分泌科' },
          { id: 5, name: '心内科' }
        ]
      }
    } else {
      const errorMsg = response.msg || '加载部门数据失败'
      console.error('部门数据加载失败:', errorMsg)
      ElMessage.error(errorMsg)
      
      // 失败时设置默认部门数据
      departments.value = [
        { id: 1, name: '体检科' },
        { id: 2, name: '社区医疗' },
        { id: 3, name: '内科' },
        { id: 4, name: '内分泌科' },
        { id: 5, name: '心内科' }
      ]
    }
  } catch (error) {
    console.error('加载部门数据异常:', error)
    ElMessage.error('网络错误或后端服务异常，请稍后重试')
    
    // 为了防止页面出错，设置默认部门数据
    departments.value = [
      { id: 1, name: '体检科' },
      { id: 2, name: '社区医疗' },
      { id: 3, name: '内科' },
      { id: 4, name: '内分泌科' },
      { id: 5, name: '心内科' }
    ]
  }
}

/**
 * 加载员工数据
 * @description 调用后端API获取员工列表，支持分页和多条件搜索
 * @api /api/admin/emp/list GET - 多条件分页查询员工列表
 * @params {
 *   page: number, // 当前页码
 *   pageSize: number, // 每页大小
 *   name: string, // 员工姓名（模糊查询）
 *   gender: number, // 性别（0 - 未知 / 1 - 男 / 2 - 女）
 *   position: string, // 职位（模糊查询）
 *   departmentName: string, // 部门名称（模糊查询）
 *   begin: string, // 创建时间开始（yyyy-MM-dd）
 *   end: string // 创建时间结束（yyyy-MM-dd）
 * }
 * @returns {
 *   code: number, // 状态码
 *   msg: string, // 消息
 *   data: {
 *     rows: Array, // 员工列表数据
 *     total: number // 总数
 *   }
 * }
 */
const loadEmployeeData = async () => {
  loading.value = true
  try {
    // 构建查询条件
    const queryData = {
      page: currentPage.value,
      pageSize: pageSize.value,
      name: queryForm.value.name,
      gender: queryForm.value.gender ? Number(queryForm.value.gender) : undefined,
      position: queryForm.value.position,
      departmentName: queryForm.value.departmentName,
      begin: dateRange.value[0],
      end: dateRange.value[1]
    }

    // 过滤掉undefined和空字符串字段
    const filteredQuery = {};
    Object.keys(queryData).forEach(key => {
      if (queryData[key] !== undefined && queryData[key] !== '') {
        filteredQuery[key] = queryData[key];
      }
    });

    // 实际API调用（GET请求，查询参数会自动拼接到URL）
    const response = await api.admin.getEmployees(filteredQuery)
    
    if (response.code === 1) { // 假设后端成功码为1
      // 直接使用API返回的数据
      employeesData.value = response.data.rows
      total.value = response.data.total
    } else {
      ElMessage.error(response.msg || '加载数据失败')
    }
  } catch (error) {
    console.error('加载员工数据失败', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索员工
 * @description 根据多条件表单查找员工
 */
const handleSearch = () => {
  currentPage.value = 1
  loadEmployeeData()
}

/**
 * 重置搜索
 * @description 清空所有搜索条件
 */
const resetSearch = () => {
  // 重置表单
  queryForm.value = {
    name: '',
    gender: '',
    position: '',
    departmentName: ''
  }
  dateRange.value = []
  currentPage.value = 1
  loadEmployeeData()
}

/**
 * 添加员工
 * @description 打开添加员工表单
 * @api /api/admin/emp/add POST - 添加员工
 */
const handleAddEmployee = async () => {
  dialogTitle.value = '添加员工'
  
  // 先重置表单数据
  employeeForm.value = {
    id: null,
    name: '',
    gender: '0', // 0未知1男2女
    position: '',
    departmentId: 0,
    phone: '',
    status: '1' // 0-离职/1-在职
  }
  
  // 等待DOM更新后再打开对话框
  await nextTick()
  
  // 避免频繁操作导致的渲染问题
  setTimeout(() => {
    dialogVisible.value = true
  }, 50)
}

/**
 * 提交表单
 * @description 处理添加或编辑员工的表单提交
 */
const submitForm = async () => {
  if (!employeeFormRef.value) return
  
  try {
    await employeeFormRef.value.validate()
    
    // 准备提交数据
    const submitData = {
      ...employeeForm.value,
      departmentId: employeeForm.value.departmentId ? Number(employeeForm.value.departmentId) : null,
      gender: Number(employeeForm.value.gender),
      status: Number(employeeForm.value.status)
    }
    
    let response
    let successMessage
    
    // 判断是添加还是编辑操作
    if (employeeForm.value.id) {
      // 编辑操作
      response = await api.admin.updateEmployee(submitData)
      successMessage = '编辑员工成功'
    } else {
      // 添加操作
      // 准备提交数据，添加时间戳
      const now = new Date();
      // 格式化为后端需要的格式：2025-11-04T10:30:00
      const formattedDate = now.toISOString().split('.')[0];
      
      const addData = {
        ...submitData,
        createdAt: formattedDate,
        updatedAt: formattedDate
      }
      
      response = await api.admin.addEmployee(addData)
      successMessage = '添加员工成功'
    }
    
    if (response.code === 1 || response.code === 200) {
      ElMessage.success(successMessage)
      
      // 使用更可靠的方式处理对话框关闭和数据刷新
      dialogVisible.value = false
      
      // 给足够的时间让对话框完全关闭动画完成
      setTimeout(() => {
        loadEmployeeData()
      }, 300)
    } else {
      ElMessage.error(response.msg || '操作失败')
    }
  } catch (error) {
    console.error('操作失败', error)
    ElMessage.error('操作失败，请稍后重试')
  }
}

/**
 * 编辑员工
 * @description 打开编辑员工表单并回显数据
 * @param {Object} employee - 员工信息
 * @api /api/admin/emp/findEmpbyId/{id} GET - 根据ID查询员工信息
 */
const handleEditEmployee = async (employee) => {
  try {
    dialogTitle.value = '编辑员工'
    
    // 确保部门数据已加载
    if (departments.value.length === 0) {
      await loadDepartmentsData()
    }
    
    // 调用API获取员工详细信息
    const response = await api.admin.findEmpbyId(employee.id)
    
    if (response.code === 1) {
      // 填充表单数据
      const empData = response.data
      
      // 先设置基本表单数据
      employeeForm.value = {
        id: empData.id,
        name: empData.name,
        gender: empData.gender || '0',
        position: empData.position,
        // 用 Number() 转换，兼容字符串/数字类型的 departmentId，转换失败则设为 0
         departmentId: Number(empData.departmentId) || 0, // 强制转数字
        phone: empData.phone,
        status: empData.status || '1'
      }
      
      // 检查部门ID是否存在于departments列表中
      if (empData.departmentId) {
        const tempDeptId = Number(empData.departmentId); // 转数字
        const departmentExists = departments.value.some(
          dept => dept.id === tempDeptId // 数字类型比较
        )
        
        // 如果部门ID不存在于列表中，创建一个临时部门对象
        if (!departmentExists && empData.departmentName) {
          console.log(`创建临时部门对象，ID: ${empData.departmentId}, 名称: ${empData.departmentName}`)
          const tempDepartment = {
            id: tempDeptId, // 统一数字类型
            name: empData.departmentName
          }
          // 将临时部门添加到列表中，确保下拉框能正确显示
          departments.value.push(tempDepartment)
        }
      }
      
      // 等待DOM更新后再打开对话框
      await nextTick()
      
      setTimeout(() => {
        dialogVisible.value = true
      }, 50)
    } else {
      ElMessage.error(response.msg || '获取员工信息失败')
    }
  } catch (error) {
    console.error('获取员工信息失败', error)
    ElMessage.error('获取员工信息失败，请稍后重试')
  }
}

/**
 * 删除员工
 * @description 删除指定员工
 * @param {number} employeeId - 员工ID
 * @api /api/admin/emp/delete POST - 删除员工
 */
const handleDeleteEmployee = (employeeId) => {
  ElMessageBox.confirm('确定要删除该员工吗？删除后数据将无法恢复！', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 实际API调用 - 单个删除也使用数组格式
      const response = await api.admin.deleteEmployee([employeeId])
      
      if (response.code === 1 || response.code === 200) {
        ElMessage.success('删除成功')
        loadEmployeeData()
      } else {
        ElMessage.error(response.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除员工失败', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

/**
 * 修改员工状态
 * @description 更新员工在职状态
 * @param {Object} employee - 员工信息
 * @api /api/admin/employees/status PUT - 更新员工状态
 * @params {
 *   id: number,
 *   status: string // 状态（0-离职/1-在职）
 * }
 */
const handleStatusChange = async (employee) => {
  // 保存当前状态，用于错误时回滚
  const currentStatus = employee.status;
  
  try {
    // 实际API调用
    // const response = await api.admin.updateEmployeeStatus({
    //   id: employee.id,
    //   status: employee.status
    // })
    // 
    // if (response.code !== 200) {
    //   // 恢复原状态
    //   employee.status = currentStatus;
    //   ElMessage.error(response.message || '更新状态失败')
    // }
    
    // 模拟状态更新成功
    ElMessage.success('状态更新成功')
  } catch (error) {
    // 发生错误时恢复原状态
    employee.status = currentStatus;
    console.error('更新员工状态失败', error)
    ElMessage.error('更新失败，请稍后重试')
  }
}

/**
 * 分页大小改变
 * @param {number} size - 新的分页大小
 */
const handleSizeChange = (size) => {
  pageSize.value = size
  loadEmployeeData()
}

/**
 * 当前页码改变
 * @param {number} current - 新的页码
 */
const handleCurrentChange = (current) => {
  currentPage.value = current
  loadEmployeeData()
}

/**
 * 处理表格选择变化
 * @param {Array} selection - 选中的行数组
 */
const handleSelectionChange = (selection) => {
  // 直接映射选中行的ID到selectedRows数组
  selectedRows.value = selection.map(row => row.id);
};

/**
 * 对话框关闭前的处理
 * @description 确保对话框关闭时的平滑过渡
 */
const handleDialogClose = () => {
  // 可以在这里添加关闭前的清理逻辑
  if (employeeFormRef.value) {
    employeeFormRef.value.resetFields();
  }
  return true; // 返回true允许关闭对话框
};

/**
 * 批量删除员工
 * @description 删除选中的多个员工
 * @api /api/admin/emp/delete POST - 批量删除员工
 */
const handleBatchDelete = () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的员工');
    return;
  }

  ElMessageBox.confirm(
    `确定要删除选中的 ${selectedRows.value.length} 名员工吗？删除后数据将无法恢复！`, 
    '警告', 
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(async () => {
    try {
      // 实际API调用
      const response = await api.admin.deleteEmployee(selectedRows.value)
      
      if (response.code === 1 || response.code === 200) {
        ElMessage.success('批量删除成功')
        // 清空选中状态
        selectedRows.value = [];
        loadEmployeeData()
      } else {
        ElMessage.error(response.msg || '批量删除失败')
      }
    } catch (error) {
      console.error('批量删除员工失败', error);
      ElMessage.error('批量删除失败，请稍后重试');
    }
  }).catch(() => {
    // 用户取消删除
  });
};

// 生命周期钩子
onMounted(() => {
  // 先加载部门数据，再加载员工数据
  loadDepartmentsData().then(() => {
    loadEmployeeData()
  })
})
</script>

<style scoped>
.employee-management {
  margin: 0 auto;
  padding: 20px;
  /* 移除 max-width 对对话框的潜在影响 */
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #409EFF;
}

.page-header h2 {
  font-size: 28px;
  color: #1f2937;
  margin-bottom: 10px;
  font-weight: 600;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
  opacity: 0.9;
}

/* 内容卡片样式 */
.content-card {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.content-card:hover {
  transform: translateY(-2px);
}

.shadow-card {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 卡片头部 */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 18px;
    font-weight: 600;
    color: #333;
  }

  .header-buttons {
    display: flex;
    gap: 10px;
  }

/* 搜索区域 */
.search-bar {
  margin-bottom: 25px;
  padding: 15px 0;
}

.search-container {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.04);
}

/* 新的表单网格布局 */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-column {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.demo-form .el-form-item {
  margin-bottom: 15px;
}

.demo-form .el-input,
.demo-form .el-select {
  width: 100%;
  max-width: 300px;
}

/* 日期范围和按钮行 */
.form-row {
  display: flex;
  align-items: flex-end;
  gap: 30px;
  margin-top: 10px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.date-range-item {
  flex: 1;
  max-width: 400px;
}

.button-item {
  margin-left: auto;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.search-btn {
  min-width: 90px;
}

.reset-btn {
  min-width: 90px;
}

/* 响应式搜索表单 */
@media (max-width: 1400px) {
  .form-grid {
    gap: 15px;
  }
  
  .form-row {
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .demo-form .el-input,
  .demo-form .el-select {
    max-width: 100%;
  }
  
  .date-range-item {
    max-width: 100%;
  }
  
  .button-item {
    margin-left: 0;
  }
  
  .button-group {
    justify-content: flex-start;
  }
}

/* 表格样式 */
.employee-row:hover {
  background-color: #f8f9fa;
}



.el-table {
  border-radius: 6px;
  overflow: hidden;
}

.el-table__header-wrapper th {
  background-color: #f7f9fc !important;
  font-weight: 600 !important;
  color: #4b5563 !important;
}

/* 对话框样式隔离 - 强制样式重置 */
:global(.employee-dialog) {
  /* 重置对话框的定位和动画 */
  transform: translate(-50%, -50%) !important;
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  margin: 0 !important;
  transition: none !important;
  min-height: 300px;
}

:global(.employee-dialog .el-dialog__wrapper) {
  /* 确保遮罩层正确覆盖 */
  position: fixed !important;
  top: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  left: 0 !important;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5) !important;
}

:global(.employee-dialog .el-dialog) {
  /* 重置对话框本身样式 */
  position: relative !important;
  margin: 0 !important;
  padding: 0 !important;
  width: 600px !important;
  max-width: 90vw !important;
  background-color: #fff !important;
  border-radius: 6px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1) !important;
  transform: none !important;
  transition: none !important;
}

:global(.employee-dialog .el-dialog__header) {
  padding: 20px 20px 10px !important;
  border-bottom: 1px solid #ebeef5 !important;
}

:global(.employee-dialog .el-dialog__body) {
  padding: 20px !important;
  min-height: 300px !important;
  box-sizing: border-box !important;
}

:global(.employee-dialog .el-dialog__footer) {
  padding: 15px 20px !important;
  border-top: 1px solid #ebeef5 !important;
  text-align: right !important;
}

/* 对话框表单样式优化 */
.dialog-form {
  padding: 0 !important;
  min-height: 260px;
}

/* 表单项目样式优化 - 更紧凑的布局 */
.dialog-form .el-form-item {
  margin-bottom: 15px !important;
  min-height: 55px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
}

/* 确保标签和输入框对齐 */
.dialog-form .el-form-item__label {
  padding: 0 0 0 10px !important;
  height: auto !important;
  line-height: 32px !important;
  color: #606266 !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  text-align: right !important;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

/* 内容区域优化 */
.dialog-form .el-form-item__content {
  margin-left: 100px !important;
  padding-left: 15px !important;
  flex: 1;
  display: flex;
  align-items: center;
  vertical-align: middle;
}

/* 输入框和选择框样式优化 */
.dialog-form .el-input,
.dialog-form .el-select,
.dialog-form .el-switch {
  width: 100%;
  max-width: 350px;
}

/* 输入框内边距优化 */
.dialog-form .el-input__inner {
  padding: 0 15px !important;
  height: 32px !important;
  line-height: 32px !important;
  border-radius: 4px !important;
  border-color: #dcdfe6 !important;
  transition: all 0.3s !important;
}

/* 输入框聚焦效果 */
.dialog-form .el-input__inner:focus {
  border-color: #409EFF !important;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2) !important;
}

/* 选择框样式优化 */
.dialog-form .el-select .el-input__inner {
  height: 32px !important;
  line-height: 32px !important;
}

/* 开关组件位置调整 */
.dialog-form .el-switch {
  margin-top: 0 !important;
}

/* 确保错误提示不会导致布局跳动 */
.dialog-form .el-form-item__error {
  position: absolute;
  bottom: -18px;
  left: 100px;
  margin-left: 15px;
  font-size: 12px;
  color: #f56c6c;
  line-height: 1;
  padding-top: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 350px;
}

/* 必填星号样式优化 */
.dialog-form .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
}



/* 分页样式 */
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  padding-top: 15px;
  border-top: 1px solid #ebeef5;
}

/* 按钮样式增强 */
.el-button {
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media (max-width: 768px) {
    .employee-management {
      padding: 10px;
    }
    
    .page-header h2 {
      font-size: 24px;
    }
    
    .search-container {
      padding: 12px;
    }
    
    .demo-form-inline label-width {
      width: 60px;
    }
    
    .demo-form-inline .el-form-item {
      margin-right: 0;
      margin-bottom: 10px;
    }
    
    .demo-form-inline .el-input,
    .demo-form-inline .el-select,
    .demo-form-inline .el-date-editor {
      width: 100%;
    }
    
    .button-group {
      flex-direction: column;
    }
    
    .search-btn,
    .reset-btn {
      width: 100%;
    }
    
    .pagination {
      justify-content: center;
    }
  }
</style>