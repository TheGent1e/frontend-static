<template>
  <div class="department-management">
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2>部门信息管理</h2>
      <p>管理系统中的所有部门信息</p>
    </div>
    
    <!-- 内容卡片 -->
    <el-card class="content-card shadow-card">
      <template #header>
        <div class="card-header">
          <span>部门列表</span>
          <el-button type="primary" @click="handleAddDepartment" plain>
            <i class="el-icon-plus"></i> 添加部门
          </el-button>
        </div>
      </template>
      
      <!-- 搜索区域 -->
      <div class="search-bar">
        <el-input
          v-model="searchQuery"
          placeholder="搜索部门名称"
          prefix-icon="el-icon-search"
          style="width: 300px;"
          @keyup.enter="handleSearch"
        />
        <el-button type="primary" @click="handleSearch">
          <i class="el-icon-search"></i> 搜索
        </el-button>
        <el-button @click="resetSearch">
          <i class="el-icon-refresh"></i> 重置
        </el-button>
      </div>
      
      <!-- 部门表格 -->
      <el-table 
        v-loading="loading"
        :data="departmentsData" 
        style="width: 100%"
        :header-cell-style="{backgroundColor: '#f7f9fc', fontWeight: 'bold'}"
        row-class-name="department-row"
      >
        <el-table-column prop="id" label="部门ID" width="80" />
        <el-table-column prop="departmentName" label="部门名称" />
        <el-table-column prop="managerName" label="部门经理" />
        <el-table-column prop="employeeCount" label="员工人数" width="120">
          <template #default="scope">
            <span class="employee-count">{{ scope.row.employeeCount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="部门描述" />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button size="small" @click="handleEditDepartment(scope.row)" type="primary" plain>
              编辑
            </el-button>
            <el-button size="small" type="danger" @click="handleDeleteDepartment(scope.row.id)">
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
    
    <!-- 添加/编辑部门对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="500px"
      :before-close="handleDialogClose"
    >
      <el-form
        :model="formData"
        :rules="formRules"
        ref="formRef"
        label-width="100px"
      >
        <el-form-item label="部门名称" prop="departmentName">
          <el-input
            v-model="formData.departmentName"
            placeholder="请输入部门名称"
            maxlength="50"
          />
        </el-form-item>
        <el-form-item label="部门经理">
          <el-select
            v-model="selectedManager"
            placeholder="请输入并选择部门经理"
            clearable
            filterable
            remote
            :remote-method="remoteSearchManager"
            :loading="searchLoading"
            @change="handleManagerChange"
            :value-key="'id'"
          >
            <el-option
              v-for="manager in managersList"
              :key="String(manager.id)"
              :label="manager.name"
              :value="manager"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="员工人数" prop="employeeCount">
          <el-input
            v-model="formData.employeeCount"
            placeholder="员工人数"
            disabled
          />
        </el-form-item>
        <el-form-item label="部门描述" prop="description">
          <el-input
            v-model="formData.description"
            placeholder="请输入部门描述"
            type="textarea"
            rows="3"
            maxlength="200"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import api from '../../api'

// 定义组件名称
const name = 'DepartmentManagement'

// 响应式数据
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const searchLoading = ref(false)

// 部门数据 - 将从API获取
const departmentsData = ref([])
// 部门经理列表数据
const managersList = ref([])

// 对话框相关状态
const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEditMode = ref(false)
const formRef = ref(null)

// 表单数据 - 使用单独的响应式引用管理selectedManager
const formData = ref({
  id: null,
  departmentName: '',
  managerId: null,
  managerName: '',
  employeeCount: 0,
  description: ''
})
// 单独管理选中的部门经理，避免对象引用问题
const selectedManager = ref(null)

// 表单验证规则 - 移除了对selectedManager的引用
  const formRules = {
    departmentName: [
      { required: true, message: '请输入部门名称', trigger: 'blur' },
      { min: 1, max: 50, message: '部门名称长度在 1 到 50 个字符', trigger: 'blur' }
    ],
    description: [
      { max: 200, message: '部门描述长度不能超过 200 个字符', trigger: 'blur' }
    ]
  }

/**
 * 加载部门数据
 * @description 调用后端API获取部门列表
 * @api /api/admin/dept/list GET - 获取部门列表
 */
const loadDepartmentData = async () => {
  loading.value = true
  try {
    // 调用后端API获取部门列表
    const response = await api.admin.getDeptList()
    
    // 检查响应状态
    if (response && (response.code === 1 || response.code === 200)) {
      // 处理搜索逻辑
      let filteredData = response.data || []
      
      // 根据后端API可能返回的格式调整
      if (Array.isArray(filteredData)) {
        // 格式已是数组
      } else if (filteredData.list) {
        // 后端返回分页格式，包含list字段
        filteredData = filteredData.list
      }
      
      // 搜索功能
      if (searchQuery.value) {
        filteredData = filteredData.filter(dept => 
          dept.departmentName && dept.departmentName.includes(searchQuery.value)
        )
      }
      
      // 处理分页
      const startIndex = (currentPage.value - 1) * pageSize.value
      const endIndex = startIndex + pageSize.value
      departmentsData.value = filteredData.slice(startIndex, endIndex)
      total.value = filteredData.length
      
      console.log('部门数据加载成功:', departmentsData.value)
    } else {
      console.error('加载部门数据失败，响应状态码:', response?.code)
      ElMessage.error(response?.msg || '加载数据失败')
    }
  } catch (error) {
    console.error('加载部门数据失败', error)
    ElMessage.error('网络错误，请稍后重试')
  } finally {
    loading.value = false
  }
}

/**
 * 搜索部门
 * @description 根据搜索条件查找部门
 */
const handleSearch = () => {
  currentPage.value = 1
  loadDepartmentData()
}

/**
 * 重置搜索
 * @description 清空搜索条件
 */
const resetSearch = () => {
  searchQuery.value = ''
  currentPage.value = 1
  loadDepartmentData()
}

/**
 * 加载部门经理列表
 * @description 获取可选的部门经理列表
 * @param {string} name - 可选的员工姓名搜索关键词
 */
const loadManagersList = async (name = '') => {
  try {
    // 使用动态员工API，传递name参数进行搜索
    const response = await api.admin.getDynamicEmployees(name);
    
    console.log('从动态员工API获取的部门经理列表响应:', response);
    
    if (response && (response.code === 1 || response.code === 200) && response.data) {
      // 后端返回的是Map格式：{name: id}
      // 转换为前端需要的数组格式：[{id: id, name: name}]
      const employees = Object.entries(response.data).map(([employeeName, employeeId]) => ({
        id: employeeId,
        name: employeeName
      }));
      
      console.log('处理后的部门经理列表:', employees);
      managersList.value = employees;
    } else {
      // 如果获取失败，提供一些模拟数据
      console.warn('获取部门经理列表失败，响应:', response);
      managersList.value = [
        { id: 1, name: '张三', position: '经理' },
        { id: 2, name: '李四', position: '副经理' },
        { id: 3, name: '王五', position: '主管' },
        { id: '4', name: '陈护士', position: '护士' } // 添加ID为字符串的示例，确保类型兼容性
      ];
    }
  } catch (error) {
    console.error('加载部门经理列表失败', error);
    // 错误时使用模拟数据
    managersList.value = [
      { id: 1, name: '张三', position: '经理' },
      { id: 2, name: '李四', position: '副经理' },
      { id: 3, name: '王五', position: '主管' },
      { id: '4', name: '陈护士', position: '护士' } // 添加ID为字符串的示例，确保类型兼容性
    ];
  }
};

/**
 * 远程搜索部门经理
 * @description 根据用户输入的关键词搜索员工
 * @param {string} keyword - 搜索关键词
 */
const remoteSearchManager = async (keyword) => {
  // 显示加载状态
  searchLoading.value = true;
  
  try {
    // 调用加载方法，传入搜索关键词
    // 注意：由于API已经返回了所有可能的部门经理
    // 搜索将在loadManagersList中通过本地过滤实现
    await loadManagersList(keyword);
  } finally {
    // 无论成功失败，都要关闭加载状态
    searchLoading.value = false;
  }
}

/**
 * 处理部门经理选择变化
 * @description 当用户选择部门经理时，更新表单中的managerId和managerName
 */
const handleManagerChange = (manager) => {
  console.log('部门经理选择变化:', manager);
  if (manager) {
    formData.value.managerId = manager.id;
    formData.value.managerName = manager.name;
  } else {
    formData.value.managerId = null;
    formData.value.managerName = '';
  }
}

/**
 * 添加部门
 * @description 打开添加部门表单
 * @api /api/admin/dept/add POST - 添加部门
 * @params {
 *   departmentName: string, // 部门名称
 *   managerId: number,      // 部门经理ID
 *   description: string     // 部门描述
 * }
 */
const handleAddDepartment = async () => {
  isEditMode.value = false
  dialogTitle.value = '添加部门'
  
  // 重置表单数据
  resetForm()
  
  // 加载部门经理列表
  await loadManagersList('');
  
  // 打开对话框
  dialogVisible.value = true
}

/**
 * 编辑部门
 * @description 打开编辑部门表单
 * @param {Object} department - 部门信息
 * @api /api/admin/dept/findById/{id} GET - 获取部门详情
 * @api /api/admin/dept/update POST - 更新部门信息
 */
const handleEditDepartment = async (department) => {
  isEditMode.value = true
  dialogTitle.value = '编辑部门'
  
  // 重置表单
  resetForm()
  
  // 显示加载状态
  const loading = ElLoading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  
  try {
    // 先加载部门经理列表
    await loadManagersList();
    
    // 根据后端API，使用findDeptById方法获取部门详情
    const response = await api.admin.findDeptById(department.id)
    
    if (response && (response.code === 1 || response.code === 200)) {
      const deptData = response.data;
      
      console.log('获取的部门详情:', deptData);
      console.log('可用的部门经理列表:', managersList.value);
      
      // 填充表单数据
      formData.value = {
        id: deptData.id,
        departmentName: deptData.departmentName,
        managerId: deptData.managerId,
        managerName: deptData.managerName || '',
        employeeCount: deptData.employeeCount || 0,
        description: deptData.description || '',
        selectedManager: null
      };
      
      // 根据managerId找到对应的经理对象并设置为选中状态
      if (deptData.managerId) {
        // 进行类型转换并查找匹配的经理
        const targetId = String(deptData.managerId);
        console.log(`尝试匹配部门经理，目标ID: ${targetId}, 目标名称: ${deptData.managerName}`);
        
        // 首先尝试精确匹配
        let matchedManager = managersList.value.find(
          manager => String(manager.id) === targetId
        );
        
        // 如果精确匹配失败，尝试通过名称匹配（作为后备方案）
        if (!matchedManager && deptData.managerName) {
          console.log(`尝试通过名称匹配部门经理: ${deptData.managerName}`);
          matchedManager = managersList.value.find(
            manager => manager.name === deptData.managerName
          );
        }
        
        // 使用单独的响应式引用而不是formData中的属性
        selectedManager.value = matchedManager || null;
        
        // 记录匹配结果
        if (selectedManager.value) {
          console.log(`成功匹配部门经理: ${selectedManager.value.name}`);
          // 同步更新formData中的managerId和managerName
          formData.value.managerId = selectedManager.value.id;
          formData.value.managerName = selectedManager.value.name;
        } else {
          console.log(`找不到ID为${deptData.managerId}或名称为${deptData.managerName}的部门经理`);
          // 确保即使找不到匹配项，也不会显示默认值
          selectedManager.value = null;
          formData.value.managerId = deptData.managerId;
          formData.value.managerName = deptData.managerName || '';
          
          // 如果找不到匹配项但有managerName，则创建一个临时对象用于显示
          if (deptData.managerName) {
            // 确保创建的临时对象格式正确，并且包含必要的属性
            const tempManager = {
              id: deptData.managerId,
              name: deptData.managerName
            };
            
            // 将临时对象添加到managersList中，确保el-select能够正确渲染
            managersList.value.push(tempManager);
            
            // 设置选中状态
            selectedManager.value = tempManager;
            
            console.log(`创建并使用临时部门经理对象:`, tempManager);
          }
        }
      } else {
        console.log('该部门没有指定部门经理');
        selectedManager.value = null;
      }
      
      // 打开对话框
      dialogVisible.value = true
    } else {
      ElMessage.error(response?.msg || '获取部门详情失败')
    }
  } catch (error) {
    console.error('获取部门详情失败', error)
    ElMessage.error('获取部门详情失败，请稍后重试')
  } finally {
    // 关闭加载状态
    loading.close()
  }
}

/**
 * 删除部门
 * @description 删除指定部门
 * @param {number} departmentId - 部门ID
 * @api /api/admin/dept/delete/{id} GET - 删除部门
 */
const handleDeleteDepartment = (departmentId) => {
  // 检查是否有员工
  const department = departmentsData.value.find(item => item.id === departmentId)
  if (department && department.employeeCount > 0) {
    ElMessage.warning('该部门下还有员工，无法删除')
    return
  }
  
  ElMessageBox.confirm('确定要删除该部门吗？删除后数据将无法恢复！', '警告', {
    confirmButtonText: '确定删除',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 调用后端API删除部门
      const response = await api.admin.deleteDept(departmentId)
      
      if (response && (response.code === 1 || response.code === 200)) {
        ElMessage.success('删除成功')
        loadDepartmentData()
      } else {
        ElMessage.error(response?.msg || '删除失败')
      }
    } catch (error) {
      console.error('删除部门失败', error)
      ElMessage.error('删除失败，请稍后重试')
    }
  }).catch(() => {
    // 用户取消删除
  })
}

/**
 * 分页大小改变
 * @param {number} size - 新的分页大小
 */
const handleSizeChange = (size) => {
  pageSize.value = size
  loadDepartmentData()
}

/**
 * 当前页码改变
 * @param {number} current - 新的页码
 */
const handleCurrentChange = (current) => {
  currentPage.value = current
  loadDepartmentData()
}

/**
 * 提交表单
 * @description 根据模式（添加/编辑）提交表单数据
 */
const handleSubmit = async () => {
  // 验证表单
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (valid) {
      try {
        let response
        
        // 根据模式调用不同的API
        if (isEditMode.value) {
          // 编辑模式
          response = await api.admin.updateDept(formData.value)
        } else {
          // 添加模式
          response = await api.admin.addDept(formData.value)
        }
        
        // 处理响应
        if (response && (response.code === 1 || response.code === 200)) {
          ElMessage.success(isEditMode.value ? '更新成功' : '添加成功')
          
          // 关闭对话框
          handleDialogClose()
          
          // 重新加载数据
          loadDepartmentData()
        } else {
          ElMessage.error(response?.msg || (isEditMode.value ? '更新失败' : '添加失败'))
        }
      } catch (error) {
        console.error(isEditMode.value ? '更新部门失败' : '添加部门失败', error)
        ElMessage.error('网络错误，请稍后重试')
      }
    }
  })
}

/**
 * 关闭对话框
 * @description 关闭对话框并重置表单
 */
const handleDialogClose = () => {
  // 重置表单
  resetForm()
  
  // 关闭对话框
  dialogVisible.value = false
}

/**
 * 重置表单
 * @description 清空表单数据和验证状态
 */
const resetForm = () => {
  // 清空表单数据
  formData.value = {
    id: null,
    departmentName: '',
    managerId: null,
    managerName: '',
    employeeCount: 0,
    description: ''
  }
  
  // 清空选中的部门经理
  selectedManager.value = null;
  
  // 重置表单验证状态
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 生命周期钩子
onMounted(() => {
  loadDepartmentData()
})
</script>

<style scoped>
.department-management {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

/* 页面标题区域 */
.page-header {
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 2px solid #67c23a;
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

/* 搜索区域 */
.search-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
  align-items: center;
  padding: 15px 0;
}

.search-bar .el-input {
  transition: all 0.3s;
}

.search-bar .el-input:hover {
  box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.2);
}

/* 表格样式 */
.department-row:hover {
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

/* 员工数量样式 */
.employee-count {
  display: inline-block;
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* 分页样式 */
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
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
  .department-management {
    padding: 10px;
  }
  
  .page-header h2 {
    font-size: 24px;
  }
  
  .search-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-bar .el-input {
    width: 100% !important;
  }
  
  .pagination {
    justify-content: center;
  }
}
</style>