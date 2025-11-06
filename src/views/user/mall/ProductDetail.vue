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
}

.loading-container,
.empty-container {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-top: 20px;
}

.product-content {
  margin-top: 20px;
}

.product-image-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.main-image {
  position: relative;
  width: 100%;
  padding-top: 100%;
  overflow: hidden;
}

.main-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.new-tag,
.discount-tag {
  position: absolute;
  top: 20px;
  padding: 6px 12px;
  font-size: 14px;
  color: #fff;
  border-radius: 4px;
}

.new-tag {
  left: 20px;
  background-color: #1890ff;
}

.discount-tag {
  right: 20px;
  background-color: #ff4d4f;
}

.product-info-section {
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 14px;
}

.product-title {
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 15px;
  line-height: 1.4;
}

.product-rating {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.rating-count {
  margin-left: 10px;
  color: #999;
  font-size: 14px;
}

.price-section {
  background-color: #fafafa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.current-price {
  font-size: 32px;
  font-weight: bold;
  color: #ff4d4f;
}

.original-price {
  font-size: 18px;
  color: #999;
  text-decoration: line-through;
}

.sales-info {
  font-size: 14px;
  color: #999;
}

.quantity-section {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.section-label {
  margin-right: 10px;
  font-size: 14px;
  color: #333;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.buy-now-btn {
  width: 160px;
}

.add-cart-btn {
  width: 160px;
}

.detail-tabs {
  margin-top: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.detail-content {
  padding: 30px;
}

.specs-content {
  padding: 30px;
}
</style>