<template>
  <div class="shopping-cart">
    <!-- 顶部装饰条 -->
    <div class="top-decoration"></div>
    
    <div class="cart-container">
      <div class="cart-header">
        <h2>我的购物车</h2>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="goToMall">商城首页</el-breadcrumb-item>
          <el-breadcrumb-item>购物车</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 购物车内容 -->
      <div class="cart-content">
      <!-- 购物车为空 -->
      <div v-if="cartItems.length === 0" class="empty-cart">
        <el-empty description="购物车是空的" :image-size="200">
          <template #description>
            快去选购心仪的商品吧
          </template>
          <el-button type="primary" @click="goToMall">去购物</el-button>
        </el-empty>
      </div>

      <!-- 购物车商品列表 -->
      <div v-else class="cart-items">
        <!-- 商品表格 -->
        <el-table
          v-loading="loading"
          :data="cartItems"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="name" label="商品信息" min-width="300">
            <template #default="scope">
              <div class="product-info">
                <div class="product-image-container">
                  <img :src="scope.row.image" :alt="scope.row.name" class="product-image" @click="goToProductDetail(scope.row.productId)" />
                </div>
                <div class="product-details">
                  <div class="product-name" @click="goToProductDetail(scope.row.productId)">{{ scope.row.name }}</div>
                  <div class="product-specs">{{ getSpecsText(scope.row.specs) }}</div>
                  <div class="product-actions">
                    <el-button size="small" type="link" @click="goToProductDetail(scope.row.productId)">查看详情</el-button>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" width="120" align="center">
            <template #default="scope">
              <span class="price">¥{{ scope.row.price }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" label="数量" width="180" align="center">
            <template #default="scope">
              <el-input-number
                v-model="scope.row.quantity"
                :min="1"
                :max="99"
                size="small"
                class="quantity-input"
                @change="(value) => handleQuantityChange(scope.row, value)"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column prop="subtotal" label="小计" width="120" align="center">
            <template #default="scope">
              <span class="subtotal price">¥{{ scope.row.subtotal }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template #default="scope">
              <el-button
                type="text"
                danger
                @click="handleDelete(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 操作栏 -->
        <div class="cart-actions">
          <div class="left-actions">
            <el-checkbox v-model="allSelected" @change="handleSelectAll" class="all-select-checkbox">
              <span class="checkbox-text">全选</span>
            </el-checkbox>
            <el-button 
              type="text" 
              @click="handleDeleteSelected" 
              :disabled="selectedItems.length === 0"
              class="batch-delete-btn"
              :class="{ disabled: selectedItems.length === 0 }"
            >
              批量删除
            </el-button>
            <el-button 
              type="text" 
              @click="clearCart"
              class="clear-cart-btn"
            >
              清空购物车
            </el-button>
          </div>
          <div class="right-actions">
            <div class="total-section">
              <div class="total-info">
                <span class="total-text">合计：</span>
                <span class="total-price">¥{{ (selectedItems.length > 0 ? selectedTotalAmount : totalAmount).toFixed(2) }}</span>
              </div>
              <div class="total-quantity">共 {{ totalQuantity }} 件商品</div>
            </div>
            <div class="checkout-section">
              <el-button 
                type="primary" 
                @click="goToCheckout" 
                :disabled="selectedItems.length === 0"
                class="checkout-button"
                :class="{ active: selectedItems.length > 0 }"
              >
                结算 ({{ selectedItems.length }})
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
    
    <!-- 推荐商品 -->
    <div v-if="cartItems.length > 0" class="recommendations">
      <h3 class="recommend-title">猜你喜欢</h3>
      <div class="recommend-list">
        <div v-for="item in recommendedProducts" :key="item.id" class="recommend-item" @click="goToProductDetail(item.id)">
          <div class="recommend-image">
            <img :src="item.image" :alt="item.name" />
          </div>
          <div class="recommend-info">
            <div class="recommend-name">{{ item.name }}</div>
            <div class="recommend-price">¥{{ item.price }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 响应式数据
const loading = ref(false)
const cartItems = ref([])
const allSelected = ref(false)
const selectedItems = ref([])

// 推荐商品数据
const recommendedProducts = ref([
  {
    id: 3,
    name: '家用血糖仪套装精准测血糖仪器',
    price: 199.00,
    image: '/images/products/blood-sugar.jpg'
  },
  {
    id: 5,
    name: '智能手环心率血压监测运动计步器',
    price: 199.00,
    image: '/images/products/fitness-band.jpg'
  },
  {
    id: 7,
    name: '家用制氧机老人氧气机',
    price: 2499.00,
    image: '/images/products/oxygen.jpg'
  },
  {
    id: 9,
    name: '医用红外额温枪电子体温计',
    price: 129.00,
    image: '/images/products/thermometer.jpg'
  }
])

// 生命周期钩子
onMounted(() => {
  loadCartItems()
})

// 加载购物车数据
const loadCartItems = async () => {
  loading.value = true
  try {
    // 模拟API调用
    // const res = await api.mall.getCart()
    // if (res.code === 200) {
    //   cartItems.value = res.data.map(item => ({
    //     ...item,
    //     subtotal: item.price * item.quantity
    //   }))
    // }

    // 模拟数据
    cartItems.value = getMockCartItems()
    
    // 加载完成后自动全选商品
    selectedItems.value = [...cartItems.value]
    allSelected.value = cartItems.value.length > 0
  } catch (error) {
    console.error('加载购物车失败', error)
    ElMessage.error('加载购物车失败，请重试')
  } finally {
    loading.value = false
  }
}

// 模拟购物车数据
const getMockCartItems = () => {
  return [
    {
      id: 1,
      productId: 1,
      name: '智能血压计家用上臂式全自动测量仪',
      image: '/images/products/blood-pressure.jpg',
      price: 299.00,
      quantity: 1,
      specs: { '颜色': '白色', '型号': 'BP-3000' },
      subtotal: 299.00
    },
    {
      id: 2,
      productId: 2,
      name: '家用血糖仪套装精准测血糖仪器',
      image: '/images/products/blood-sugar.jpg',
      price: 199.00,
      quantity: 2,
      specs: { '规格': '50试纸', '品牌': '健康卫士' },
      subtotal: 398.00
    }
  ]
}

// 计算选中商品总价
const selectedTotalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 计算所有商品总价
const totalAmount = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 计算总数量
const totalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
  allSelected.value = selection.length === cartItems.value.length && selection.length > 0
  
  // 添加选择变化的反馈提示
  if (selection.length > 0) {
    ElMessage.info(`已选择 ${selection.length} 件商品`)
  }
}

// 全选/取消全选
const handleSelectAll = () => {
  if (allSelected.value) {
    selectedItems.value = [...cartItems.value]
  } else {
    selectedItems.value = []
  }
}

// 处理数量变化
const handleQuantityChange = async (item, newQuantity) => {
  try {
    // 保存旧数量，以便出错时恢复
    const oldQuantity = item.quantity
    
    // 更新数量并计算小计
    item.quantity = newQuantity
    item.subtotal = item.price * newQuantity
    
    // 模拟API调用
    // await api.mall.updateCartItem(item.id, newQuantity)
    
    ElMessage.success(`已将 "${item.name}" 数量更新为 ${newQuantity}`)
  } catch (error) {
    console.error('更新数量失败', error)
    ElMessage.error('更新失败，请重试')
    // 恢复原数量
    item.quantity = item.oldQuantity || item.quantity
    item.subtotal = item.price * item.quantity
  }
}

// 删除单个商品
const handleDelete = async (item) => {
  try {
    await ElMessageBox.confirm(`确定要删除 "${item.name}" 吗？`, '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    // await api.mall.deleteCartItem(item.id)
    
    // 从本地删除
    const index = cartItems.value.findIndex(i => i.id === item.id)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
    
    // 同步更新选中项
    selectedItems.value = selectedItems.value.filter(i => i.id !== item.id)
    
    // 更新全选状态
    allSelected.value = selectedItems.value.length === cartItems.value.length
    
    ElMessage.success(`已删除 "${item.name}"`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 批量删除
const handleDeleteSelected = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要删除的商品')
    return
  }
  
  try {
    await ElMessageBox.confirm(`确定要删除选中的 ${selectedItems.value.length} 件商品吗？`, '确认批量删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const itemIds = selectedItems.value.map(item => item.id)
    const deletedCount = selectedItems.value.length
    
    // 模拟API调用
    // await api.mall.deleteCartItems(itemIds)
    
    // 从本地删除
    cartItems.value = cartItems.value.filter(item => !itemIds.includes(item.id))
    selectedItems.value = []
    allSelected.value = false
    
    ElMessage.success(`已成功删除 ${deletedCount} 件商品`)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败', error)
      ElMessage.error('删除失败，请重试')
    }
  }
}

// 清空购物车
const clearCart = async () => {
  try {
    await ElMessageBox.confirm('确定要清空购物车吗？', '确认清空', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    // await api.mall.clearCart()
    
    cartItems.value = []
    selectedItems.value = []
    allSelected.value = false
    
    ElMessage.success('购物车已清空')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('清空购物车失败', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 前往结算
const goToCheckout = async () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  try {
    // 计算选中商品的总金额
    const total = selectedItems.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    
    await ElMessageBox.confirm(`确认结算 ${selectedItems.value.length} 件商品，合计金额：¥${total.toFixed(2)}？`, '确认结算', {
      confirmButtonText: '确认结算',
      cancelButtonText: '取消',
      type: 'primary'
    })
    
    // 构建结算参数
    const checkoutParams = {
      items: selectedItems.value.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        name: item.name
      })),
      totalAmount: total
    }
    
    // 存储结算参数
    sessionStorage.setItem('checkoutParams', JSON.stringify(checkoutParams))
    
    // 跳转到结算页面
    router.push('/user/mall/checkout')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('结算失败', error)
      ElMessage.error('操作失败，请重试')
    }
  }
}

// 前往商城首页
const goToMall = () => {
  router.push('/user/mall')
}

// 前往商品详情
const goToProductDetail = (productId) => {
  router.push(`/user/mall/product/${productId}`)
}

// 格式化规格文本
const getSpecsText = (specs) => {
  if (!specs) return ''
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}
</script>

<style scoped>
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

.shopping-cart {
  min-height: calc(100vh - var(--header-height, 0));
  background-color: var(--bg-dark); /* 使用统一的健康主题背景色 */
  padding: var(--space-lg, 24px) 0;
  font-family: var(--font-family); /* 使用主题中的字体变量 */
  position: relative;
  background-image: radial-gradient(var(--el-color-primary) 1px, transparent 1px);
  background-size: 30px 30px;
  background-attachment: scroll;
  background-position: top left;
  background-repeat: repeat;
}

/* 医疗风格装饰元素 */
.top-decoration {
  background: linear-gradient(90deg, var(--el-color-primary), #0284c7);
  height: 4px;
  margin: -24px -24px 20px -24px;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.cart-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-glass);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.cart-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.cart-title::before {
  content: '💊';
  font-size: 28px;
}

.breadcrumb {
  font-size: 14px;
  color: var(--text-secondary);
}

.breadcrumb a {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-fast);
  position: relative;
  padding: 0 2px;
}

.breadcrumb a:hover {
  color: var(--primary-color);
  text-decoration: none;
  transition: var(--transition-fast);
  position: relative;
  padding: 0 2px;
}

.breadcrumb a:hover {
  color: var(--primary-color-dark);
}

.breadcrumb a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--mall-primary-gradient);
  transition: width 0.3s ease;
}

.breadcrumb a:hover::after {
  width: 100%;
}

.cart-content {
  background: transparent;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  border: none;
  backdrop-filter: none;
  box-shadow: none;
}

.empty-cart {
  text-align: center;
  padding: var(--spacing-xl) * 2;
  background: var(--bg-color-light);
  position: relative;
}

.empty-cart::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: var(--mall-primary-gradient);
  border-radius: 2px;
}

.empty-cart-icon {
  font-size: 80px;
  color: var(--primary-color);
  margin-bottom: var(--spacing-lg);
  opacity: 0.8;
  filter: var(--mall-health-icon-filter);
}

.empty-cart-text {
  font-size: 16px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
}

.go-shopping-btn {
  background: var(--mall-health-primary-gradient);
  border: none;
  color: white;
  padding: 10px 24px;
  border-radius: var(--border-radius-base);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: var(--transition-base);
  box-shadow: var(--mall-health-button-shadow);
  position: relative;
  overflow: hidden;
}

.go-shopping-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.go-shopping-btn:hover::before {
  width: 300px;
  height: 300px;
}

.go-shopping-btn:hover {
  box-shadow: var(--mall-health-button-hover-shadow);
  transform: translateY(-2px);
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg-color-card);
}

.cart-table th {
  background-color: var(--bg-color-light);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  border-bottom: 1px solid var(--border-light);
  position: relative;
}

.cart-table th::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: var(--spacing-md);
  right: var(--spacing-md);
  height: 1px;
  background: var(--mall-health-border-gradient);
}

.cart-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
  transition: var(--transition-fast);
  position: relative;
}

.cart-table tbody tr {
  transition: var(--transition-base);
}

.cart-table tbody tr:hover {
  background-color: var(--border-extra-light);
  transform: translateY(-1px);
  box-shadow: var(--shadow-light);
}

.product-info {
    display: flex;
    align-items: center;
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-base);
    transition: background-color 0.3s ease;
  }

  .product-info:hover {
    background-color: rgba(59, 130, 246, 0.05);
  }

  .product-image-container {
    width: 80px;
    height: 80px;
    border-radius: var(--border-radius-small);
    overflow: hidden;
    margin-right: var(--spacing-md);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid var(--border-light);
    background: white;
    cursor: pointer;
  }

  .product-image-container:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(59, 130, 246, 0.2);
  }

  .product-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  .product-image-container:hover .product-image {
    transform: scale(1.05);
  }

  .product-details {
    flex: 1;
    min-width: 0;
  }

  .product-name {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-primary);
    margin-bottom: var(--spacing-xs);
    transition: var(--transition-fast);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
  }

  .product-name:hover {
    color: var(--primary-color);
  }

  .product-name:hover::after {
    content: attr(data-name);
    position: absolute;
    bottom: 100%;
    left: 0;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: normal;
    z-index: 1000;
    max-width: 300px;
  }

  .product-specs {
    font-size: 14px;
    color: var(--text-secondary);
    margin-bottom: 8px;
  }

  .product-actions {
    margin-top: var(--spacing-xs);
  }

  .quantity-input {
    width: 120px;
  }

  .el-input__wrapper {
  background-color: rgba(15, 23, 42, 0.8) !important;
  border: 1px solid var(--border-glass) !important;
  transition: all 0.3s ease;
  box-shadow: none !important;
}

.el-input__wrapper:hover {
  background-color: rgba(15, 23, 42, 0.9) !important;
  border-color: var(--el-color-primary) !important;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2) !important;
}

.el-input__wrapper.is-focus {
  background-color: rgba(15, 23, 42, 0.9) !important;
  border-color: var(--el-color-primary) !important;
  box-shadow: 0 0 15px rgba(14, 165, 233, 0.3) !important;
}

.el-input__inner {
  background-color: transparent !important;
  color: var(--el-text-color-primary) !important;
}

/* 输入框前缀/后缀图标颜色 */
.el-input__prefix-inner,
.el-input__suffix-inner {
  color: var(--el-text-color-secondary) !important;
}

/* 输入框清空按钮样式 */
.el-input__clear {
  color: var(--el-text-color-secondary) !important;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.el-input__clear:hover {
  color: var(--el-color-primary) !important;
  opacity: 1;
}

.el-input-number {
  --el-input-number-bg-color: rgba(15, 23, 42, 0.8);
  --el-input-number-btn-bg-color: rgba(15, 23, 42, 0.8);
  --el-input-number-btn-hover-bg-color: rgba(14, 165, 233, 0.1);
  --el-input-number-btn-border-color: var(--border-glass);
  --el-input-number-input-bg-color: rgba(15, 23, 42, 0.8);
  --el-input-number-input-text-color: var(--el-text-color-primary);
  --el-input-number-input-border-color: var(--border-glass);
}

.el-input-number__decrease,
.el-input-number__increase {
  background-color: rgba(15, 23, 42, 0.8) !important;
  border-color: var(--border-glass) !important;
  color: var(--el-text-color-primary) !important;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  background-color: rgba(14, 165, 233, 0.1) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
}

  .el-input-number__decrease:hover:not(.is-disabled),
  .el-input-number__increase:hover:not(.is-disabled) {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }

.product-price {
  font-size: 16px;
  font-weight: 600;
  color: var(--mall-price-color);
  display: inline-block;
  position: relative;
}

.product-price::after {
  content: '¥';
  font-size: 12px;
  position: absolute;
  left: -10px;
  top: 0;
  opacity: 0.8;
}

.quantity-control {
  display: flex;
  align-items: center;
  border-radius: var(--border-radius-small);
  overflow: hidden;
}

.quantity-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--border-base);
  background-color: var(--bg-color-light);
  color: var(--text-primary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: var(--transition-base);
  position: relative;
  z-index: 1;
}

.quantity-btn:first-child {
  border-radius: var(--border-radius-small) 0 0 var(--border-radius-small);
}

.quantity-btn:last-child {
  border-radius: 0 var(--border-radius-small) var(--border-radius-small) 0;
}

.quantity-btn:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  background: var(--bg-color-card);
}

.quantity-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--mall-health-primary-gradient);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.quantity-btn:hover::before {
  opacity: 0.1;
}

.quantity-input {
  width: 60px;
  height: 32px;
  text-align: center;
  border: 1px solid var(--border-base);
  border-left: none;
  border-right: none;
  font-size: 14px;
  background: white;
}

.subtotal {
  font-size: 16px;
  font-weight: 600;
  color: var(--mall-price-color);
  display: inline-block;
  position: relative;
}

.subtotal::after {
  content: '¥';
  font-size: 12px;
  position: absolute;
  left: -10px;
  top: 0;
  opacity: 0.8;
}

.action-btn {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 14px;
  transition: var(--transition-fast);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-small);
  position: relative;
  overflow: hidden;
}

.action-btn:hover {
  color: var(--danger-color);
  background-color: var(--border-extra-light);
}

.action-btn::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--danger-color);
  transform: translateX(-50%);
  transition: width 0.3s ease;
}

.action-btn:hover::after {
  width: 100%;
}

.cart-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.9);
    border-top: 1px solid var(--border-glass);
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  }

  .left-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-lg);
  }

  .right-actions {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
  }

  /* 全选样式 */
  .all-select-checkbox {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  .checkbox-text {
    margin-left: 6px;
    font-size: 14px;
    color: var(--text-primary);
    transition: color 0.3s ease;
  }

  .all-select-checkbox:hover .checkbox-text {
    color: var(--primary-color);
  }

  /* 批量删除按钮样式 */
  .batch-delete-btn {
    position: relative;
    padding: 4px 0;
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }

  .batch-delete-btn:not(.disabled):hover {
    color: var(--danger-color);
  }

  .batch-delete-btn:not(.disabled):hover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--danger-color);
    transition: width 0.3s ease;
  }

  /* 清空购物车按钮样式 */
  .clear-cart-btn {
    position: relative;
    padding: 4px 0;
    color: var(--text-secondary);
    transition: color 0.3s ease;
  }

  .clear-cart-btn:hover {
    color: var(--warning-color);
  }

  .clear-cart-btn:hover::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--warning-color);
    transition: width 0.3s ease;
  }

  /* 合计金额样式 */
  .total-section {
    display: flex;
    align-items: flex-end;
    gap: var(--spacing-lg);
  }

  .total-info {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
  }

  .total-text {
    color: var(--text-primary);
    font-size: 16px;
    font-weight: 500;
  }

  .total-price {
    color: var(--danger-color);
    font-size: 28px;
    font-weight: 700;
    transition: transform 0.2s ease;
  }

  .total-price:hover {
    transform: scale(1.05);
  }

  .total-quantity {
    color: var(--text-secondary);
    font-size: 14px;
    margin-bottom: 4px;
  }

  /* 结算按钮样式 */
  .checkout-section {
    display: flex;
    align-items: center;
  }

  .checkout-button {
    min-width: 140px;
    height: 44px;
    padding: 0 24px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 22px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .checkout-button.active {
    background: linear-gradient(135deg, #4096ff 0%, #66b1ff 100%);
    border-color: #4096ff;
  }

  .checkout-button.active:hover {
    background: linear-gradient(135deg, #337ecc 0%, #4096ff 100%);
    border-color: #337ecc;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(64, 150, 255, 0.3);
  }

  .checkout-button.active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }

  .checkout-button.active:hover::before {
    width: 300px;
    height: 300px;
  }

.recommendations {
  max-width: 1200px;
  margin: 40px auto 0;
  padding: 24px;
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  transition: all 0.3s ease;
}

.recommend-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--el-color-primary);
  margin-bottom: 24px;
  padding-bottom: 12px;
  position: relative;
  display: inline-block;
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

.recommend-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), #0284c7);
  border-radius: 1.5px;
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.recommend-item {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  position: relative;
  cursor: pointer;
}

.recommend-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--el-color-primary), #0284c7);
}

.recommend-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--glow-blue), 0 8px 32px rgba(0, 0, 0, 0.2);
  border-color: var(--el-color-primary);
}

.recommend-image {
  height: 150px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.recommend-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  border-radius: 8px;
}

.recommend-item:hover .recommend-image img {
  transform: scale(1.1);
}

.recommend-info {
  padding: 16px;
  background: rgba(15, 23, 42, 0.5);
}

.recommend-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 8px;
  height: 48px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.recommend-item:hover .recommend-name {
  color: var(--el-color-primary);
}

.recommend-price {
  font-size: 18px;
  font-weight: 600;
  color: #10b981;
  margin-bottom: 8px;
  display: inline-block;
  position: relative;
}



/* Element UI 表格样式覆盖 */
.el-table {
  --el-table-bg-color: transparent;
  --el-table-header-bg-color: rgba(15, 23, 42, 0.8);
  --el-table-border-color: var(--border-glass);
  --el-table-text-color: var(--el-text-color-primary);
  --el-table-row-hover-bg-color: rgba(14, 165, 233, 0.1);
  background: transparent;
}

.el-table__inner-wrapper {
  background: transparent;
}

/* 表格滚动条样式 */
.el-table__body-wrapper .el-scrollbar {
  background: transparent;
}

.el-table__body-wrapper .el-scrollbar__wrap {
  background: transparent;
}

.el-table__body-wrapper .el-scrollbar__view {
  background: transparent;
}

/* 隐藏列样式 */
.hidden-columns {
  background: transparent;
}

.el-table__header-wrapper th {
  background-color: rgba(15, 23, 42, 0.8) !important;
  color: var(--el-text-color-primary) !important;
  font-weight: 600 !important;
  border-bottom: 1px solid var(--border-glass) !important;
}

.el-table__body-wrapper tr {
  transition: all 0.3s ease;
  background-color: rgba(15, 23, 42, 0.6) !important;
  border-bottom: 1px solid var(--border-glass) !important;
}

.el-table__body-wrapper tr:hover {
  background-color: rgba(14, 165, 233, 0.1) !important;
  box-shadow: inset 0 0 10px rgba(14, 165, 233, 0.1) !important;
  transform: translateY(-1px) !important;
}

.el-table__body-wrapper td {
  color: var(--el-text-color-primary) !important;
  border-bottom: 1px solid var(--border-glass) !important;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .cart-container {
    padding: 0 16px;
  }
  
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
  
  .cart-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
  
  .right-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .checkout-button {
    min-width: 100px;
    padding: 10px 20px;
  }
  
  .recommend-list {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .product-image-container {
    width: 60px;
    height: 60px;
  }
  
  .el-table {
    font-size: 14px;
  }
  
  .quantity-input {
    width: 80px;
  }
  
  .recommendations {
    padding: 16px;
  }
  
  .total-price {
    font-size: 24px;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cart-content,
.recommendations {
  animation: fadeInUp 0.6s ease-out;
}

.el-table__body tr {
  animation: fadeInUp 0.4s ease-out;
  animation-fill-mode: both;
}

.el-table__body tr:nth-child(1) { animation-delay: 0.1s; }
.el-table__body tr:nth-child(2) { animation-delay: 0.2s; }
.el-table__body tr:nth-child(3) { animation-delay: 0.3s; }
.el-table__body tr:nth-child(4) { animation-delay: 0.4s; }
.el-table__body tr:nth-child(5) { animation-delay: 0.5s; }

/* 链接按钮样式优化 */
.el-button--link {
  color: var(--el-color-primary) !important;
  background-color: transparent !important;
  border: none !important;
  transition: all 0.3s ease;
}

.el-button--link:hover {
  color: var(--el-color-primary) !important;
  background-color: rgba(14, 165, 233, 0.1) !important;
  border-color: transparent !important;
  text-decoration: none !important;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

.el-button--link:active {
  color: var(--el-color-primary) !important;
  background-color: rgba(14, 165, 233, 0.2) !important;
  border-color: transparent !important;
}

/* 文字按钮样式优化 */
.el-button--text {
  color: var(--text-secondary) !important;
  background-color: transparent !important;
  border: none !important;
  transition: all 0.3s ease;
  padding: 6px 12px !important;
  border-radius: 8px !important;
}

.el-button--text:hover {
  color: var(--el-color-primary) !important;
  background-color: rgba(14, 165, 233, 0.1) !important;
  border-color: transparent !important;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

.el-button--text:active {
  color: var(--el-color-primary) !important;
  background-color: rgba(14, 165, 233, 0.2) !important;
  border-color: transparent !important;
}

/* 主按钮样式优化 */
.el-button--primary {
  background: linear-gradient(135deg, var(--el-color-primary) 0%, #0284c7 100%) !important;
  border: none !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
}

.el-button--primary:hover {
  background: linear-gradient(135deg, #0284c7 0%, var(--el-color-primary) 100%) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.4);
}

.el-button--primary:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(14, 165, 233, 0.3);
}
</style>