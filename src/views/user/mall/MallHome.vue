<template>
  <div class="mall-home">
    <!-- 顶部装饰条 -->
    <div class="top-decoration"></div>
    
    <!-- 页面标题区域 -->
    <div class="page-header">
      <h2 class="header-title">健康商城</h2>
      <p class="header-desc">精选健康产品，呵护您的健康生活</p>
    </div>

    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <el-button 
        type="primary" 
        @click="goBack"
        class="back-button"
      >
        返回首页
      </el-button>
      
      <!-- 购物车按钮 -->
      <el-button 
        :type="'primary'"
        icon="el-icon-shopping-cart" 
        @click="goToCart"
        class="cart-button"
      >
        购物车 ({{ cartItemsCount }})
      </el-button>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-card :shadow="'hover'" class="search-card">
        <div class="search-content">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索健康产品"
            clearable
            prefix-icon="el-icon-search"
            class="search-input"
          />
          <el-select
            v-model="selectedCategory"
            placeholder="选择产品分类"
            clearable
            class="category-select"
          >
            <el-option label="血压监测" value="blood-pressure" />
            <el-option label="血糖监测" value="blood-sugar" />
            <el-option label="心率监测" value="heart-rate" />
            <el-option label="保健产品" value="health-care" />
            <el-option label="医疗器械" value="medical-device" />
          </el-select>
          <el-button type="primary" @click="searchProducts" class="search-button">搜索</el-button>
        </div>
      </el-card>
    </div>

    <!-- 热门推荐 -->
    <div class="recommendations-section">
      <div class="section-header">
        <h3 class="section-title">热门推荐</h3>
        <div class="section-line"></div>
      </div>
      
      <el-row :gutter="24">
        <el-col :xs="12" :sm="6" :md="4" v-for="product in featuredProducts" :key="product.id">
          <el-card :shadow="'hover'" class="product-card" @click="viewProductDetail(product.id)">
            <!-- 商品图片区域 -->
            <div class="product-image-container">
              <img :src="product.image" :alt="product.name" class="product-image" />
              <!-- 标签区域 -->
              <div class="product-badges">
                <div v-if="product.isNew" class="badge new-badge">新品</div>
                <div v-if="product.isDiscount" class="badge discount-badge">促销</div>
              </div>
            </div>
            
            <!-- 商品信息区域 -->
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <div class="price-rating-container">
                <div class="product-price">¥{{ product.price }}</div>
                <div class="product-rating">
                  <el-rate :value="product.rating" disabled size="small" />
                  <span class="rating-count">({{ product.reviewCount }})</span>
                </div>
              </div>
              <el-button 
                type="primary" 
                size="small" 
                @click.stop="addToCart(product.id)"
                class="add-to-cart-btn"
              >
                <el-icon><ShoppingCart /></el-icon> 加入购物车
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 商品分类展示 -->
    <div class="categories-section">
      <div class="section-header">
        <h3 class="section-title">商品分类</h3>
        <div class="section-line"></div>
      </div>
      
      <div v-for="category in productCategories" :key="category.id" class="category-item">
        <h4 class="category-title">{{ category.name }}</h4>
        <el-row :gutter="24">
          <el-col :xs="12" :sm="6" :md="4" v-for="product in getCategoryProducts(category.id)" :key="product.id">
            <el-card :shadow="'hover'" class="product-card" @click="viewProductDetail(product.id)">
              <div class="product-image-container">
                <img :src="product.image" :alt="product.name" class="product-image" />
              </div>
              <div class="product-info">
                <h4 class="product-name">{{ product.name }}</h4>
                <div class="product-price">¥{{ product.price }}</div>
                <el-button 
                  type="primary" 
                  size="small" 
                  @click.stop="addToCart(product.id)"
                  class="add-to-cart-btn"
                >
                  <el-icon><ShoppingCart /></el-icon> 加入购物车
                </el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'

const router = useRouter()

// 状态管理
const searchKeyword = ref('')
const selectedCategory = ref('')
const cartItemsCount = ref(0)

// 模拟商品数据
const allProducts = ref([
  // 膳食补充剂
  {
    id: 1,
    name: '维生素C咀嚼片',
    price: 59.00,
    image: '/images/products/vitamin-c.jpg',
    category: 'supplements',
    rating: 4.8,
    reviewCount: 234,
    isNew: false,
    isDiscount: true
  },
  {
    id: 2,
    name: '深海鱼油胶囊',
    price: 129.00,
    image: '/images/products/fish-oil.jpg',
    category: 'supplements',
    rating: 4.7,
    reviewCount: 189,
    isNew: false,
    isDiscount: false
  },
  {
    id: 3,
    name: '乳清蛋白粉',
    price: 299.00,
    image: '/images/products/whey-protein.jpg',
    category: 'supplements',
    rating: 4.9,
    reviewCount: 345,
    isNew: true,
    isDiscount: false
  },
  {
    id: 4,
    name: '益生菌粉',
    price: 89.00,
    image: '/images/products/probiotics.jpg',
    category: 'supplements',
    rating: 4.6,
    reviewCount: 156,
    isNew: false,
    isDiscount: false
  },
  
  // 家用医疗设备
  {
    id: 5,
    name: '智能血压计',
    price: 299.00,
    image: '/images/products/blood-pressure.jpg',
    category: 'medical-devices',
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    isDiscount: false
  },
  {
    id: 6,
    name: '血糖仪套装',
    price: 199.00,
    image: '/images/products/blood-sugar.jpg',
    category: 'medical-devices',
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isDiscount: true
  },
  {
    id: 7,
    name: '电子体温计',
    price: 89.00,
    image: '/images/products/thermometer.jpg',
    category: 'medical-devices',
    rating: 4.4,
    reviewCount: 112,
    isNew: false,
    isDiscount: true
  },
  {
    id: 8,
    name: '雾化器',
    price: 399.00,
    image: '/images/products/nebulizer.jpg',
    category: 'medical-devices',
    rating: 4.5,
    reviewCount: 78,
    isNew: true,
    isDiscount: false
  },
  
  // 健康食品
  {
    id: 9,
    name: '有机核桃',
    price: 69.00,
    image: '/images/products/walnuts.jpg',
    category: 'health-food',
    rating: 4.7,
    reviewCount: 123,
    isNew: false,
    isDiscount: false
  },
  {
    id: 10,
    name: '低糖燕麦片',
    price: 49.00,
    image: '/images/products/oatmeal.jpg',
    category: 'health-food',
    rating: 4.6,
    reviewCount: 198,
    isNew: false,
    isDiscount: true
  },
  {
    id: 11,
    name: '蜂蜜礼盒',
    price: 159.00,
    image: '/images/products/honey.jpg',
    category: 'health-food',
    rating: 4.9,
    reviewCount: 89,
    isNew: false,
    isDiscount: false
  },
  {
    id: 12,
    name: '益生菌酸奶',
    price: 39.00,
    image: '/images/products/yogurt.jpg',
    category: 'health-food',
    rating: 4.5,
    reviewCount: 210,
    isNew: true,
    isDiscount: false
  },
  
  // 运动健康
  {
    id: 13,
    name: '瑜伽垫',
    price: 89.00,
    image: '/images/products/yoga-mat.jpg',
    category: 'sports-health',
    rating: 4.7,
    reviewCount: 145,
    isNew: false,
    isDiscount: false
  },
  {
    id: 14,
    name: '智能手环',
    price: 199.00,
    image: '/images/products/smart-band.jpg',
    category: 'sports-health',
    rating: 4.8,
    reviewCount: 267,
    isNew: true,
    isDiscount: false
  },
  {
    id: 15,
    name: '筋膜枪',
    price: 299.00,
    image: '/images/products/fascia-gun.jpg',
    category: 'sports-health',
    rating: 4.6,
    reviewCount: 134,
    isNew: false,
    isDiscount: true
  },
  {
    id: 16,
    name: '哑铃套装',
    price: 159.00,
    image: '/images/products/dumbbells.jpg',
    category: 'sports-health',
    rating: 4.5,
    reviewCount: 98,
    isNew: false,
    isDiscount: false
  },
  
  // 个人护理
  {
    id: 17,
    name: '电动牙刷',
    price: 129.00,
    image: '/images/products/electric-toothbrush.jpg',
    category: 'personal-care',
    rating: 4.8,
    reviewCount: 201,
    isNew: false,
    isDiscount: true
  },
  {
    id: 18,
    name: '护眼仪',
    price: 199.00,
    image: '/images/products/eye-massager.jpg',
    category: 'personal-care',
    rating: 4.7,
    reviewCount: 156,
    isNew: true,
    isDiscount: false
  },
  {
    id: 19,
    name: '冲牙器',
    price: 159.00,
    image: '/images/products/water-flosser.jpg',
    category: 'personal-care',
    rating: 4.6,
    reviewCount: 178,
    isNew: false,
    isDiscount: false
  },
  {
    id: 20,
    name: '蒸汽眼罩',
    price: 39.00,
    image: '/images/products/steam-eye-mask.jpg',
    category: 'personal-care',
    rating: 4.5,
    reviewCount: 234,
    isNew: false,
    isDiscount: true
  },
  
  // 血压监测
  {
    id: 21,
    name: '智能血压计',
    price: 299.00,
    image: '/images/products/blood-pressure.jpg',
    category: 'blood-pressure',
    rating: 4.8,
    reviewCount: 156,
    isNew: true,
    isDiscount: false
  },
  {
    id: 22,
    name: '臂式血压计',
    price: 199.00,
    image: '/images/products/arm-blood-pressure.jpg',
    category: 'blood-pressure',
    rating: 4.6,
    reviewCount: 123,
    isNew: false,
    isDiscount: false
  },
  
  // 血糖监测
  {
    id: 23,
    name: '血糖仪套装',
    price: 199.00,
    image: '/images/products/blood-sugar.jpg',
    category: 'blood-sugar',
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    isDiscount: true
  },
  {
    id: 24,
    name: '血糖试纸',
    price: 89.00,
    image: '/images/products/test-strips.jpg',
    category: 'blood-sugar',
    rating: 4.9,
    reviewCount: 189,
    isNew: false,
    isDiscount: false
  },
  
  // 心率监测
  {
    id: 25,
    name: '智能心率手环',
    price: 159.00,
    image: '/images/products/heart-rate.jpg',
    category: 'heart-rate',
    rating: 4.7,
    reviewCount: 234,
    isNew: false,
    isDiscount: false
  },
  {
    id: 26,
    name: '心率监测手表',
    price: 399.00,
    image: '/images/products/heart-rate-watch.jpg',
    category: 'heart-rate',
    rating: 4.8,
    reviewCount: 167,
    isNew: true,
    isDiscount: false
  }
])

// 产品分类
const productCategories = ref([
  { id: 'supplements', name: '膳食补充剂' },
  { id: 'medical-devices', name: '家用医疗设备' },
  { id: 'health-food', name: '健康食品' },
  { id: 'sports-health', name: '运动健康' },
  { id: 'personal-care', name: '个人护理' },
  { id: 'blood-pressure', name: '血压监测' },
  { id: 'blood-sugar', name: '血糖监测' },
  { id: 'heart-rate', name: '心率监测' }
])

// 计算属性：精选产品
const featuredProducts = computed(() => {
  return allProducts.value.slice(0, 8)
})

// 获取分类商品
const getCategoryProducts = (categoryId) => {
  return allProducts.value.filter(product => product.category === categoryId).slice(0, 4)
}

// 方法：返回首页
const goBack = () => {
  router.push('/user/home')
}

// 方法：跳转到购物车
const goToCart = () => {
  router.push('/user/mall/cart')
}

// 方法：查看商品详情
const viewProductDetail = (productId) => {
  router.push(`/user/mall/product/${productId}`)
}

// 方法：加入购物车
const addToCart = (productId) => {
  // 模拟添加购物车逻辑
  cartItemsCount.value++
  ElMessage.success('已添加到购物车')
  // 在实际应用中，这里应该调用API将商品添加到购物车
}

// 方法：搜索商品
const searchProducts = () => {
  // 模拟搜索逻辑
  ElMessage.info(`搜索关键词: ${searchKeyword.value}, 分类: ${selectedCategory.value}`)
  // 在实际应用中，这里应该调用API进行商品搜索
}

// 生命周期钩子
onMounted(() => {
  // 初始化购物车数量
  // 在实际应用中，这里应该从API或localStorage获取购物车数量
  cartItemsCount.value = Math.floor(Math.random() * 10)
})
</script>

<style>
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
</style>

<style scoped>
/* 健康商城页面样式 */
.mall-home {
  padding: 20px;
  background-color: var(--bg-dark);
  min-height: 100vh;
  /* 简化背景纹理，确保在各环境下显示一致 */
  background-image: radial-gradient(var(--el-color-primary) 1px, transparent 1px);
  background-size: 30px 30px;
  background-attachment: scroll;
  background-position: top left;
  background-repeat: repeat;
  /* 限制最大宽度并居中 */
  max-width: 1200px;
  margin: 0 auto;
}

/* 顶部装饰条 - 使用健康主题绿色 */
.top-decoration {
  background: linear-gradient(90deg, var(--el-color-primary), #0284c7);
  height: 4px;
  margin: -20px -20px 20px -20px;
  border-radius: 0 0 2px 2px;
  box-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

/* 页面标题区域 - 健康风格设计 */
.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 20px 0;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(22, 34, 51, 0.8));
  border-radius: 16px;
  border: 1px solid var(--border-glass);
  box-shadow: var(--glow-blue);
  backdrop-filter: blur(8px);
  position: relative;
  overflow: hidden;
}

/* 装饰元素 - 医疗风格 */
.page-header::before {
  content: '';
  position: absolute;
  top: -10px;
  right: -10px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(14, 165, 233, 0.2);
  opacity: 0.6;
  z-index: 0;
}

.page-header::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 20%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  opacity: 0.6;
  z-index: 0;
}

.header-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--el-color-primary);
  margin-bottom: 12px;
  line-height: 1.2;
  position: relative;
  z-index: 1;
  /* 添加医疗风格的文字装饰 */
  text-shadow: 0 0 10px rgba(14, 165, 233, 0.5);
}

.header-desc {
  font-size: 16px;
  /* 提高颜色对比度以符合WCAG标准（至少4.5:1） */
  color: var(--text-primary);
  /* 增加文本粗细以提高可读性 */
  font-weight: 500;
  line-height: 1.6;
  position: relative;
  z-index: 1;
  text-shadow: 0 0 5px rgba(14, 165, 233, 0.3);
}

/* 操作按钮区域 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 16px;
}

.back-button {
  background: linear-gradient(135deg, var(--el-color-primary), #0284c7) !important;
  border: none !important;
  color: white !important;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
  border-radius: 8px;
}

.back-button:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(14, 165, 233, 0.5) !important;
}

.cart-button {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
  color: white !important;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  border-radius: 8px;
}

.cart-button:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5) !important;
}

/* 搜索和筛选区域 */
.search-filter-section {
  margin-bottom: var(--space-xl);
}

.search-card {
  border-radius: var(--radius-md);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-primary);
  box-shadow: var(--health-card-shadow);
  transition: all var(--transition-base);
  position: relative;
  overflow: hidden;
}

.search-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--health-gradient-primary);
}

.search-card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--primary-light);
  transform: translateY(-2px);
}

.search-content {
  display: flex;
  gap: var(--space-base);
  align-items: center;
  flex-wrap: wrap;
  padding: var(--space-base);
  position: relative;
  z-index: 1;
}

.search-input {
  flex: 1;
  min-width: 200px;
  border-radius: var(--radius-base);
  border-color: var(--border-primary);
  transition: all var(--transition-base);
}

.search-input:hover,
.search-input:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.category-select {
  width: 200px;
  border-radius: var(--radius-base);
  border-color: var(--border-primary);
  transition: all var(--transition-base);
}

.category-select:hover,
.category-select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.search-button {
  white-space: nowrap;
  padding: 0 var(--space-lg);
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transition: all var(--transition-base);
  border-radius: var(--radius-base);
}

.search-button:hover {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.search-button:focus {
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5), 0 0 0 4px rgba(76, 175, 80, 0.3);
}

/* 区域标题 - 健康主题样式 */
.section-header {
  margin-bottom: var(--space-lg);
  position: relative;
  padding-bottom: var(--space-xs);
  display: flex;
  align-items: center;
  gap: var(--space-base);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--primary-color);
  margin-bottom: 0;
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  position: relative;
}

/* 健康主题装饰图标 */
.section-title::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--primary-color);
}

.section-line {
  height: 3px;
  background: var(--health-gradient-primary);
  border-radius: 2px;
  flex: 1;
  transition: all var(--transition-base);
}

/* 内容区域 */
.recommendations-section,
.categories-section {
  margin-bottom: var(--space-2xl);
}

/* 商品卡片 - 健康主题设计 */
.product-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-primary);
  overflow: hidden;
  background-color: var(--bg-primary);
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--health-card-shadow);
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary-color);
  /* 添加健康主题的悬停效果 */
  background-color: var(--bg-secondary);
}

/* 健康主题卡片装饰线 */
.product-card::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: var(--health-gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.product-card:hover::after {
  transform: scaleX(1);
}

/* 确保鼠标悬停状态下的反馈更加明显，提升可访问性 */
.product-card:focus-within {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 商品图片区域 */
.product-image-container {
  position: relative;
  padding: var(--space-base);
  text-align: center;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-tertiary);
  flex-shrink: 0;
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

/* 标签区域 - 健康主题样式 */
.product-badges {
  position: absolute;
  top: var(--space-base);
  left: var(--space-base);
  right: var(--space-base);
  display: flex;
  justify-content: space-between;
}

.badge {
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 600;
  color: white;
  white-space: nowrap;
  border: 1px solid transparent;
  transition: all var(--transition-base);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translateY(0);
}

.product-card:hover .badge {
  transform: translateY(-2px);
}

.new-badge {
  background-color: var(--health-tag-new);
  border-color: var(--health-tag-new);
}

.discount-badge {
  background-color: var(--health-tag-discount);
  border-color: var(--health-tag-discount);
}

/* 商品信息区域 */
.product-info {
  padding: var(--space-base);
  flex: 1;
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--border-tertiary);
}

.product-name {
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: var(--space-sm);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-height: var(--line-height-base);
  min-height: 48px;
  transition: color var(--transition-base);
}

.product-card:hover .product-name {
  color: var(--primary-color);
}

/* 价格和评分容器 */
.price-rating-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
  flex-wrap: wrap;
  gap: var(--space-xs);
}

/* 商品价格 - 健康主题样式 */
.product-price {
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--health-price-color);
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.product-price::before {
  content: '¥';
  font-size: var(--font-size-base);
}

.product-rating {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.rating-count {
  font-size: var(--font-size-xs);
  color: var(--text-secondary);
}

/* 加入购物车按钮 - 健康主题样式 */
.add-to-cart-btn {
  width: 100%;
  margin-top: auto;
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
  transition: all 0.3s ease;
  border-radius: var(--radius-base);
  position: relative;
  overflow: hidden;
}

.add-to-cart-btn::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  transition: width 0.4s ease;
  transform: translate(-50%, -50%);
}

.add-to-cart-btn:hover::before {
  width: 100%;
}

.add-to-cart-btn:hover {
  background-color: var(--primary-hover) !important;
  border-color: var(--primary-hover) !important;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.add-to-cart-btn:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* 分类项 - 健康主题样式 */
.category-item {
  margin-bottom: var(--space-xl);
  padding-top: var(--space-md);
  border-top: 1px solid var(--border-tertiary);
  transition: all var(--transition-base);
}

.category-item:first-child {
  border-top: none;
  padding-top: 0;
}

.category-title {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--space-base);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--border-secondary);
  display: inline-block;
  transition: all var(--transition-base);
  background: linear-gradient(to right, var(--primary-light), transparent);
  padding-left: var(--space-sm);
  padding-right: var(--space-sm);
  border-radius: 2px 2px 0 0;
}

.category-title:hover {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
  transform: translateY(-1px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mall-home {
    padding: var(--space-base);
    background-size: 20px 20px;
  }
  
  .top-decoration {
    margin: calc(var(--space-base) * -1) calc(var(--space-base) * -1) var(--space-base) calc(var(--space-base) * -1);
  }
  
  .search-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-sm);
  }
  
  .search-input,
  .category-select {
    width: 100%;
    max-width: none;
    border-color: var(--border-primary);
  }
  
  .price-rating-container {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-xs);
  }
  
  .product-name {
    min-height: auto;
    -webkit-line-clamp: 1;
    color: var(--text-primary);
  }
  
  .product-image {
    height: 150px;
  }
  
  .product-image-container {
    min-height: 180px;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-sm);
  }
  
  .header-title {
    font-size: var(--font-size-xl);
    color: var(--primary-color);
  }
  
  .section-title {
    font-size: var(--font-size-lg);
    color: var(--primary-color);
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-xs);
  }
  
  .section-line {
    width: 100%;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .action-buttons {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
  
  .search-content {
    flex-wrap: wrap;
    gap: var(--space-sm);
  }
}

/* 动画效果 - 健康主题 */
.product-card {
  animation: fadeInUp 0.6s ease-out;
}

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

/* 页面底部 - 健康主题样式 */
.page-footer {
  margin-top: var(--space-2xl);
  text-align: center;
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--border-tertiary);
  background-color: var(--bg-secondary);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  margin-bottom: 0;
  background-image: linear-gradient(to bottom, transparent, var(--primary-light) 100%);
  background-size: 100% 200%;
  background-position: 0 0;
  transition: background-position 0.3s ease;
}

.page-footer:hover {
  background-position: 0 100%;
}

.footer-text {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  position: relative;
  z-index: 1;
}
</style>