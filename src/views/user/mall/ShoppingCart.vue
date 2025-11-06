<template>
  <div class="shopping-cart">
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
                <img :src="scope.row.image" :alt="scope.row.name" class="product-image" />
                <div class="product-details">
                  <div class="product-name" @click="goToProductDetail(scope.row.productId)">{{ scope.row.name }}</div>
                  <div class="product-specs">{{ getSpecsText(scope.row.specs) }}</div>
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
                @change="handleQuantityChange(scope.row)"
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
                @click="handleDelete(scope.row.id)"
                confirm-message="确定要删除该商品吗？"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 操作栏 -->
        <div class="cart-actions">
          <div class="left-actions">
            <el-checkbox v-model="allSelected" @change="handleSelectAll">全选</el-checkbox>
            <el-button type="text" @click="handleDeleteSelected" :disabled="selectedItems.length === 0">
              批量删除
            </el-button>
            <el-button type="text" @click="clearCart">清空购物车</el-button>
          </div>
          <div class="right-actions">
            <div class="total-section">
              <span class="total-text">合计：</span>
              <span class="total-price">¥{{ totalAmount }}</span>
              <span class="total-quantity">共 {{ totalQuantity }} 件商品</span>
            </div>
            <div class="checkout-section">
              <el-button type="primary" @click="goToCheckout" :disabled="selectedItems.length === 0">
                结算 ({{ selectedItems.length }})
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 推荐商品 -->
    <div v-if="cartItems.length > 0" class="recommendations">
      <h3>猜你喜欢</h3>
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

// 计算总价
const totalAmount = computed(() => {
  return selectedItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

// 计算总数量
const totalQuantity = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.quantity, 0)
})

// 处理选择变化
const handleSelectionChange = (selection) => {
  selectedItems.value = selection
  allSelected.value = selection.length === cartItems.value.length && selection.length > 0
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
const handleQuantityChange = async (item) => {
  try {
    // 重新计算小计
    item.subtotal = item.price * item.quantity
    
    // 模拟API调用
    // await api.mall.updateCartItem(item.id, item.quantity)
    
    ElMessage.success('已更新商品数量')
  } catch (error) {
    console.error('更新数量失败', error)
    ElMessage.error('更新失败，请重试')
    // 恢复原数量
    const cartItem = cartItems.value.find(i => i.id === item.id)
    if (cartItem) {
      cartItem.quantity = cartItem.oldQuantity || cartItem.quantity
    }
  }
}

// 删除单个商品
const handleDelete = async (itemId) => {
  try {
    await ElMessageBox.confirm('确定要删除该商品吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    // 模拟API调用
    // await api.mall.deleteCartItem(itemId)
    
    // 从本地删除
    const index = cartItems.value.findIndex(item => item.id === itemId)
    if (index > -1) {
      cartItems.value.splice(index, 1)
    }
    
    // 同步更新选中项
    selectedItems.value = selectedItems.value.filter(item => item.id !== itemId)
    
    ElMessage.success('删除成功')
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
    await ElMessageBox.confirm('确定要删除选中的商品吗？', '确认删除', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    
    const itemIds = selectedItems.value.map(item => item.id)
    
    // 模拟API调用
    // await api.mall.deleteCartItems(itemIds)
    
    // 从本地删除
    cartItems.value = cartItems.value.filter(item => !itemIds.includes(item.id))
    selectedItems.value = []
    allSelected.value = false
    
    ElMessage.success('批量删除成功')
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
const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    ElMessage.warning('请选择要结算的商品')
    return
  }
  
  // 构建结算参数
  const checkoutParams = {
    items: selectedItems.value.map(item => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity
    }))
  }
  
  // 这里可以将结算参数存储到sessionStorage或通过路由参数传递
  sessionStorage.setItem('checkoutParams', JSON.stringify(checkoutParams))
  
  // 跳转到结算页面
  router.push('/user/mall/checkout')
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
.shopping-cart {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

.cart-header {
  margin-top: 20px;
  margin-bottom: 20px;
}

.cart-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.cart-content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

/* 空购物车 */
.empty-cart {
  padding: 60px 0;
}

/* 购物车商品 */
.product-info {
  display: flex;
  align-items: center;
}

.product-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.product-details {
  flex: 1;
}

.product-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 5px;
  cursor: pointer;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-name:hover {
  color: #1890ff;
}

.product-specs {
  font-size: 12px;
  color: #999;
}

.price {
  font-weight: 600;
  color: #ff4d4f;
}

.subtotal {
  font-weight: 600;
  color: #ff4d4f;
  font-size: 16px;
}

/* 操作栏 */
.cart-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.left-actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.right-actions {
  display: flex;
  align-items: center;
  gap: 30px;
}

.total-section {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.total-text {
  font-size: 16px;
  color: #333;
}

.total-price {
  font-size: 24px;
  font-weight: bold;
  color: #ff4d4f;
}

.total-quantity {
  font-size: 14px;
  color: #666;
}

.checkout-section .el-button {
  min-width: 120px;
  font-size: 16px;
  padding: 12px 24px;
}

/* 推荐商品 */
.recommendations {
  margin-top: 40px;
}

.recommendations h3 {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #f0f0f0;
}

.recommend-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.recommend-item {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  cursor: pointer;
}

.recommend-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.recommend-image {
  padding-top: 75%;
  position: relative;
  overflow: hidden;
}

.recommend-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-info {
  padding: 15px;
}

.recommend-name {
  font-size: 14px;
  color: #333;
  margin-bottom: 10px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-price {
  font-size: 18px;
  font-weight: bold;
  color: #ff4d4f;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cart-content {
    padding: 15px;
  }
  
  .cart-actions {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .right-actions {
    width: 100%;
    justify-content: space-between;
    gap: 20px;
  }
  
  .total-section {
    flex-wrap: wrap;
  }
  
  .product-info {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }
  
  .product-image {
    margin-right: 0;
    margin-bottom: 10px;
  }
  
  .recommend-list {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>