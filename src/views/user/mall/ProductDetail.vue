<template>
  <div class="product-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>

    <!-- 商品详情 -->
    <div v-else-if="product" class="product-content">
      <el-row :gutter="30">
        <!-- 商品图片区域 -->
        <el-col :xs="24" :md="10">
          <div class="product-image-section">
            <div class="main-image">
              <img :src="product.image" :alt="product.name" />
              <div v-if="product.isNew" class="new-tag">新品</div>
              <div v-if="product.discount > 0" class="discount-tag">{{ product.discount }}% OFF</div>
            </div>
          </div>
        </el-col>

        <!-- 商品信息区域 -->
        <el-col :xs="24" :md="14">
          <div class="product-info-section">
            <!-- 面包屑导航 -->
            <div class="breadcrumb">
              <el-breadcrumb separator="/">
                <el-breadcrumb-item @click="goToMall">商城首页</el-breadcrumb-item>
                <el-breadcrumb-item>{{ getCategoryName(product.categoryId) }}</el-breadcrumb-item>
                <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
              </el-breadcrumb>
            </div>

            <!-- 商品标题 -->
            <h1 class="product-title">{{ product.name }}</h1>

            <!-- 评分 -->
            <div class="product-rating">
              <el-rate v-model="product.rating" disabled :show-score="true" />
              <span class="rating-count">({{ product.reviewCount }}条评价)</span>
            </div>

            <!-- 价格信息 -->
            <div class="price-section">
              <div class="current-price">¥{{ product.price }}</div>
              <div v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</div>
              <div class="sales-info">已售 {{ product.salesCount }} 件</div>
            </div>

            <!-- 数量选择 -->
            <div class="quantity-section">
              <span class="section-label">数量：</span>
              <el-input-number v-model="quantity" :min="1" :max="99" size="small" />
            </div>

            <!-- 操作按钮 -->
            <div class="action-buttons">
              <el-button type="primary" size="large" @click="buyNow" class="buy-now-btn">
                立即购买
              </el-button>
              <el-button size="large" @click="addToCart" class="add-cart-btn">
                <ShoppingCart /> 加入购物车
              </el-button>
              <el-button size="large" :type="isFavorite ? 'success' : 'default'" @click="addFavorite">
                <Star /> {{ isFavorite ? '已收藏' : '收藏' }}
              </el-button>
            </div>
          </div>
        </el-col>
      </el-row>

      <!-- 商品详情标签页 -->
      <div class="detail-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="商品详情" name="detail">
            <div class="detail-content" v-html="product.detailHtml"></div>
          </el-tab-pane>
          <el-tab-pane label="规格参数" name="specs">
            <div class="specs-content">
              <el-table :data="getSpecsTableData(product.params)" border>
                <el-table-column prop="key" label="参数名" width="120"></el-table-column>
                <el-table-column prop="value" label="参数值"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 商品不存在 -->
    <div v-else class="empty-container">
      <el-empty description="商品不存在或已下架" />
      <div style="text-align: center; margin-top: 20px;">
        <el-button type="primary" @click="goToMall">返回商城首页</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart, Star } from '@element-plus/icons-vue'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const product = ref(null)
const quantity = ref(1)
const isFavorite = ref(false)
const activeTab = ref('detail')

// 商品分类数据
const categories = ref([
  { id: 'medical', name: '医疗器械' },
  { id: 'nutritional', name: '营养保健品' },
  { id: 'fitness', name: '健身器材' },
  { id: 'elderly', name: '老年用品' },
  { id: 'beauty', name: '美容养颜' }
])

// 生命周期钩子
onMounted(() => {
  loadProductDetail()
})

// 加载商品详情
const loadProductDetail = () => {
  const { productId } = route.params
  if (!productId) {
    ElMessage.error('商品ID不存在')
    return
  }

  loading.value = true
  try {
    // 使用模拟数据
    product.value = getMockProductDetail(productId)
    checkFavoriteStatus(productId)
  } catch (error) {
    console.error('加载商品详情失败', error)
    ElMessage.error('加载商品详情失败，请重试')
  } finally {
    loading.value = false
  }
}

// 模拟商品详情数据
const getMockProductDetail = (productId) => {
  const mockProducts = {
    '1': {
      id: 1,
      name: '智能血压计家用上臂式全自动测量仪',
      description: '大屏幕显示，一键测量，操作简单，适合老年人使用',
      price: 299.00,
      originalPrice: 399.00,
      image: '/images/products/blood-pressure.jpg',
      categoryId: 'medical',
      isNew: true,
      discount: 25,
      salesCount: 1256,
      reviewCount: 250,
      rating: 4.5,
      params: {
        '品牌': '健康卫士',
        '型号': 'BP-3000',
        '适用人群': '中老年',
        '测量方式': '上臂式',
        '显示方式': 'LCD大屏',
        '电源': '4节5号电池/DC电源'
      },
      detailHtml: `
        <div class="detail-content-wrapper">
          <h3>产品介绍</h3>
          <p>本款智能血压计采用先进的示波法测量技术，提供准确可靠的血压测量结果。大屏幕显示设计，让老年人也能轻松读取数据。一键测量功能，操作简单方便。</p>
          <h3>产品特点</h3>
          <ul>
            <li>大屏幕LCD显示，清晰易读</li>
            <li>一键操作，简单便捷</li>
            <li>自动加压和排气，舒适测量</li>
            <li>100组测量数据记忆功能</li>
          </ul>
        </div>
      `
    }
  }
  
  return mockProducts[productId] || mockProducts['1']
}

// 检查收藏状态
const checkFavoriteStatus = (productId) => {
  isFavorite.value = false
}

// 跳转到商城首页
const goToMall = () => {
  router.push('/user/mall')
}

// 添加到购物车
const addToCart = () => {
  ElMessage.success(`已成功将${quantity.value}件商品添加到购物车`)
}

// 立即购买
const buyNow = () => {
  router.push(`/user/mall/checkout?productId=${product.value.id}&quantity=${quantity.value}`)
}

// 添加/取消收藏
const addFavorite = () => {
  isFavorite.value = !isFavorite.value
  ElMessage.success(isFavorite.value ? '收藏成功' : '取消收藏成功')
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

// 将参数转换为表格数据格式
const getSpecsTableData = (params) => {
  return Object.entries(params).map(([key, value]) => ({
    key,
    value
  }))
}
</script>

<style scoped>
.product-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: var(--bg-dark);
  min-height: calc(100vh - var(--header-height, 0));
  background-image: radial-gradient(var(--el-color-primary) 1px, transparent 1px);
  background-size: 30px 30px;
  background-attachment: scroll;
  background-position: top left;
  background-repeat: repeat;
}

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

.loading-container,
.empty-container {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
}

.product-content {
  margin-top: 24px;
}

.product-image-section {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-image-section:hover {
  box-shadow: 0 8px 24px rgba(14, 165, 233, 0.15);
  border-color: rgba(14, 165, 233, 0.3);
}

.main-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.5);
  transition: all 0.3s;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.main-image:hover img {
  transform: scale(1.03);
}

.new-tag,
.discount-tag {
  position: absolute;
  top: 24px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 10;
  transition: all 0.3s;
}

.new-tag {
  left: 24px;
  background-color: #0ea5e9;
}

.discount-tag {
  right: 24px;
  background-color: #f43f5e;
}

.product-info-section {
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
}

.breadcrumb {
  margin-bottom: 24px;
  font-size: 14px;
}

.breadcrumb a {
  color: #6b7280;
  text-decoration: none;
  transition: color 0.3s;
}

.breadcrumb a:hover {
  color: #0ea5e9;
}

.breadcrumb span {
  color: #9ca3af;
  margin: 0 8px;
}

.product-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 20px;
  line-height: 1.5;
  position: relative;
  padding-bottom: 16px;
}

.product-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 100%);
  border-radius: 1.5px;
}

.product-rating {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(15, 23, 42, 0.8);
  border-radius: 8px;
  border: 1px solid var(--border-glass);
}

.rating-stars {
  color: #f59e0b;
  font-size: 16px;
  margin-right: 8px;
}

.rating-score {
  font-weight: 600;
  color: #333;
  margin-right: 8px;
  font-size: 16px;
}

.rating-count {
  color: #6b7280;
  font-size: 14px;
}

.price-section {
  background: rgba(15, 23, 42, 0.8);
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  border-left: 4px solid var(--el-color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--border-glass);
}

.current-price {
  font-size: 36px;
  font-weight: bold;
  color: #f43f5e;
  transition: color 0.3s;
}

.product-info-section:hover .current-price {
  color: #0ea5e9;
}

.original-price {
  font-size: 18px;
  color: #9ca3af;
  text-decoration: line-through;
}

.sales-info {
  font-size: 14px;
  color: var(--text-secondary);
  padding: 4px 12px;
  background: rgba(14, 165, 233, 0.1);
  border-radius: 6px;
  border: 1px solid var(--border-glass);
}

.quantity-section {
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-glass);
}

.section-label {
  margin-right: 16px;
  font-size: 15px;
  color: var(--text-primary);
  font-weight: 500;
  min-width: 80px;
}

.quantity-input {
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s;
}

.quantity-input:hover {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.quantity-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  cursor: pointer;
  user-select: none;
  color: #6b7280;
  transition: all 0.3s;
}

.quantity-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
  color: #0ea5e9;
}

.quantity-btn:disabled {
  background-color: #f9fafb;
  color: #d1d5db;
  cursor: not-allowed;
}

.quantity-number {
  width: 70px;
  text-align: center;
  border: none;
  outline: none;
  font-size: 16px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 16px;
  margin-top: 32px;
}

.buy-now-btn,
.add-cart-btn {
  width: 180px;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.buy-now-btn {
  background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%);
  border: none;
  color: #fff;
}

.buy-now-btn:hover {
  background: linear-gradient(135deg, #0c84ac 0%, #0ea5e9 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
}

.add-cart-btn {
  background: linear-gradient(135deg, #22c55e 0%, #4ade80 100%);
  border: none;
  color: #fff;
}

.add-cart-btn:hover {
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(34, 197, 94, 0.3);
}

.detail-tabs {
  margin-top: 32px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid var(--border-glass);
  backdrop-filter: blur(8px);
}

.detail-tabs .el-tabs__header {
  border-bottom: 1px solid var(--border-glass);
  background: rgba(15, 23, 42, 0.9);
}

.detail-tabs .el-tabs__nav {
  padding: 0 24px;
}

.detail-tabs .el-tabs__item {
  font-size: 16px;
  font-weight: 500;
  padding: 0 24px;
  height: 56px;
  line-height: 56px;
  color: #6b7280;
  transition: all 0.3s;
}

.detail-tabs .el-tabs__item:hover {
  color: #0ea5e9;
}

.detail-tabs .el-tabs__item.is-active {
  color: #0ea5e9;
  font-weight: 600;
}

.detail-content {
  padding: 32px;
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 16px;
  background: rgba(15, 23, 42, 0.8);
}

.detail-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 16px auto;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.detail-content h3 {
  color: var(--el-color-primary);
  margin-top: 24px;
  margin-bottom: 16px;
}

.detail-content p {
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.detail-content ul {
  color: var(--text-secondary);
  margin-left: 24px;
  margin-bottom: 16px;
}

.detail-content li {
  margin-bottom: 8px;
}

.specs-content {
  padding: 32px;
  background: rgba(15, 23, 42, 0.8);
}

.specifications-table {
  width: 100%;
  border-collapse: collapse;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid var(--border-glass);
}

.specifications-table th {
  background: rgba(14, 165, 233, 0.1);
  padding: 14px;
  text-align: left;
  font-weight: 600;
  border-bottom: 1px solid var(--border-glass);
  color: var(--el-color-primary);
  font-size: 15px;
}

.specifications-table td {
  padding: 14px;
  border-bottom: 1px solid var(--border-glass);
  color: var(--text-secondary);
  font-size: 15px;
  background: rgba(15, 23, 42, 0.8);
}

.specifications-table tr:last-child td {
  border-bottom: none;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .product-content {
    margin-top: 20px;
  }
  
  .product-image-section,
  .product-info-section {
    padding: 20px;
  }
  
  .new-tag,
  .discount-tag {
    top: 16px;
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .new-tag {
    left: 16px;
  }
  
  .discount-tag {
    right: 16px;
  }
  
  .product-title {
    font-size: 24px;
    margin-bottom: 16px;
    padding-bottom: 12px;
  }
  
  .current-price {
    font-size: 30px;
  }
  
  .action-buttons {
    flex-direction: column;
    gap: 12px;
  }
  
  .buy-now-btn,
  .add-cart-btn {
    width: 100%;
    padding: 12px 20px;
  }
  
  .detail-content,
  .specs-content {
    padding: 20px;
  }
  
  .detail-content {
    font-size: 15px;
  }
}

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

/* 输入框样式优化 - 统一所有页面的输入框样式 */
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

/* 数量输入框样式优化 */
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
  transition: all 0.3s ease;
}

.el-input-number__decrease:hover,
.el-input-number__increase:hover {
  background-color: rgba(14, 165, 233, 0.1) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.2);
}

.el-input-number__decrease:active,
.el-input-number__increase:active {
  background-color: rgba(14, 165, 233, 0.2) !important;
  border-color: var(--el-color-primary) !important;
  color: var(--el-color-primary) !important;
}
</style>