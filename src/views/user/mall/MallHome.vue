<template>
  <div class="mall-home">
    <!-- 商城头部 -->
    <div class="mall-header">
      <h1>健康商城</h1>
      <p>精选健康产品，为您的健康保驾护航</p>
    </div>

    <!-- 搜索和筛选区域 -->
    <div class="search-filter-section">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="16">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索商品"
            prefix-icon="el-icon-search"
            @keyup.enter="searchProducts"
            clearable
          />
        </el-col>
        <el-col :xs="24" :sm="8">
          <el-button type="primary" @click="searchProducts" class="search-btn">搜索</el-button>
          <el-button @click="resetFilters" class="ml-2">重置</el-button>
        </el-col>
      </el-row>

      <!-- 分类筛选 -->
      <div class="category-filter">
        <span class="filter-label">商品分类：</span>
        <el-radio-group v-model="selectedCategory" size="small">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button v-for="category in categories" :key="category.id" :label="category.id">
            {{ category.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 排序选项 -->
      <div class="sort-options">
        <span class="filter-label">排序方式：</span>
        <el-select v-model="sortBy" placeholder="默认排序" size="small">
          <el-option label="默认排序" value="default"></el-option>
          <el-option label="价格从低到高" value="price_asc"></el-option>
          <el-option label="价格从高到低" value="price_desc"></el-option>
          <el-option label="最新上架" value="newest"></el-option>
          <el-option label="销量优先" value="sales"></el-option>
        </el-select>
      </div>
    </div>

    <!-- 商品列表区域 -->
    <div class="products-section">
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="8" animated />
      </div>

      <div v-else-if="products.length === 0" class="empty-container">
        <el-empty description="暂无商品" />
      </div>

      <div v-else class="products-grid">
        <div v-for="product in products" :key="product.id" class="product-card">
          <div class="product-image">
            <img :src="product.image" :alt="product.name" @click="goToProductDetail(product.id)" />
            <div v-if="product.isNew" class="new-tag">新品</div>
            <div v-if="product.discount > 0" class="discount-tag">{{ product.discount }}% OFF</div>
          </div>
          
          <div class="product-info" @click="goToProductDetail(product.id)">
            <div class="product-category">{{ getCategoryName(product.categoryId) }}</div>
            <div class="product-name">{{ product.name }}</div>
            <div class="product-description">{{ product.description }}</div>
            
            <div class="product-price-section">
              <div class="current-price">¥{{ product.price }}</div>
              <div v-if="product.originalPrice" class="original-price">¥{{ product.originalPrice }}</div>
            </div>
            
            <div class="product-footer">
              <div class="sales-count">已售 {{ product.salesCount }}</div>
              <el-rate
                v-model="product.rating"
                disabled
                :show-score="false"
                size="small"
              />
            </div>
          </div>
          
          <div class="product-actions">
            <el-button size="small" type="primary" @click.stop="addToCart(product.id)">
              <el-icon><ShoppingCart /></el-icon>
              加入购物车
            </el-button>
            <el-button size="small" type="success" @click.stop="buyNow(product.id)">
              立即购买
            </el-button>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="products.length > 0" class="pagination">
        <el-pagination
          :current-page="currentPage"
          @update:current-page="currentPage = $event"
          :page-size.sync="pageSize"
          :page-sizes="[12, 24, 36]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalProducts"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { ShoppingCart } from '@element-plus/icons-vue'
import api from '../../../api'

// 路由相关
const router = useRouter()

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const selectedCategory = ref('all')
const sortBy = ref('default')
const currentPage = ref(1)
const pageSize = ref(12)
const totalProducts = ref(0)

// 商品分类数据
const categories = ref([
  { id: 'medical', name: '医疗器械' },
  { id: 'nutritional', name: '营养保健品' },
  { id: 'fitness', name: '健身器材' },
  { id: 'elderly', name: '老年用品' },
  { id: 'beauty', name: '美容养颜' }
])

// 商品列表数据
const products = ref([
  {
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
    rating: 4.5
  },
  {
    id: 2,
    name: '家用血糖仪套装精准测血糖仪器',
    description: '快速出值，误差小，含50片试纸和采血针',
    price: 199.00,
    originalPrice: 249.00,
    image: '/images/products/blood-sugar.jpg',
    categoryId: 'medical',
    isNew: false,
    discount: 20,
    salesCount: 892,
    rating: 4.6
  },
  {
    id: 3,
    name: '记忆棉颈椎枕芯护颈枕',
    description: '慢回弹记忆棉，贴合颈椎曲线，缓解颈椎疲劳',
    price: 129.00,
    image: '/images/products/pillow.jpg',
    categoryId: 'elderly',
    isNew: false,
    discount: 0,
    salesCount: 2341,
    rating: 4.8
  },
  {
    id: 4,
    name: '蛋白质粉增强免疫力',
    description: '乳清蛋白粉，富含多种氨基酸，增强体质',
    price: 368.00,
    originalPrice: 498.00,
    image: '/images/products/protein.jpg',
    categoryId: 'nutritional',
    isNew: true,
    discount: 26,
    salesCount: 567,
    rating: 4.7
  },
  {
    id: 5,
    name: '家用跑步机静音折叠健身器材',
    description: '静音设计，折叠收纳，适合家庭使用',
    price: 1999.00,
    originalPrice: 2499.00,
    image: '/images/products/treadmill.jpg',
    categoryId: 'fitness',
    isNew: false,
    discount: 20,
    salesCount: 342,
    rating: 4.5
  },
  {
    id: 6,
    name: '智能手环心率血压监测运动计步器',
    description: '24小时监测心率血压，记录运动数据，防水设计',
    price: 199.00,
    image: '/images/products/fitness-band.jpg',
    categoryId: 'fitness',
    isNew: true,
    discount: 0,
    salesCount: 1893,
    rating: 4.4
  },
  {
    id: 7,
    name: '钙片中老年补钙维生素D',
    description: '易吸收，预防骨质疏松，适合中老年人',
    price: 89.00,
    originalPrice: 119.00,
    image: '/images/products/calcium.jpg',
    categoryId: 'nutritional',
    isNew: false,
    discount: 25,
    salesCount: 3201,
    rating: 4.9
  },
  {
    id: 8,
    name: '老人坐便椅可折叠移动马桶',
    description: '稳固耐用，折叠设计，适合行动不便的老人',
    price: 239.00,
    image: '/images/products/toilet-chair.jpg',
    categoryId: 'elderly',
    isNew: false,
    discount: 0,
    salesCount: 678,
    rating: 4.6
  },
  {
    id: 9,
    name: '胶原蛋白肽粉美容养颜',
    description: '深海鱼胶原蛋白，改善肌肤状态，延缓衰老',
    price: 298.00,
    originalPrice: 398.00,
    image: '/images/products/collagen.jpg',
    categoryId: 'beauty',
    isNew: true,
    discount: 25,
    salesCount: 954,
    rating: 4.7
  },
  {
    id: 10,
    name: '家用制氧机老人氧气机',
    description: '医用级制氧，噪音小，操作简便',
    price: 2499.00,
    originalPrice: 2999.00,
    image: '/images/products/oxygen.jpg',
    categoryId: 'medical',
    isNew: false,
    discount: 17,
    salesCount: 234,
    rating: 4.8
  },
  {
    id: 11,
    name: '瑜伽垫加厚加宽加长健身垫',
    description: '环保材质，防滑设计，双面可用',
    price: 89.00,
    originalPrice: 129.00,
    image: '/images/products/yoga-mat.jpg',
    categoryId: 'fitness',
    isNew: false,
    discount: 31,
    salesCount: 1456,
    rating: 4.5
  },
  {
    id: 12,
    name: '维生素E软胶囊美容护肤',
    description: '抗氧化，美容养颜，提高免疫力',
    price: 58.00,
    originalPrice: 78.00,
    image: '/images/products/vitamin-e.jpg',
    categoryId: 'beauty',
    isNew: false,
    discount: 26,
    salesCount: 2890,
    rating: 4.6
  }
])

// 生命周期钩子
onMounted(() => {
  loadProducts()
})

// 加载商品列表
const loadProducts = async () => {
  loading.value = true
  try {
    // 模拟API调用，实际应替换为真实API
    // const res = await api.mall.getProducts({
    //   keyword: searchKeyword.value,
    //   category: selectedCategory.value === 'all' ? '' : selectedCategory.value,
    //   sort: sortBy.value,
    //   page: currentPage.value,
    //   pageSize: pageSize.value
    // })
    // 
    // if (res.code === 200) {
    //   products.value = res.data.list
    //   totalProducts.value = res.data.total
    // }
    
    // 使用模拟数据
    totalProducts.value = products.value.length
  } catch (error) {
    console.error('加载商品失败', error)
    ElMessage.error('加载商品失败，请重试')
  } finally {
    loading.value = false
  }
}

// 搜索商品
const searchProducts = () => {
  currentPage.value = 1
  loadProducts()
}

// 重置筛选条件
const resetFilters = () => {
  searchKeyword.value = ''
  selectedCategory.value = 'all'
  sortBy.value = 'default'
  currentPage.value = 1
  loadProducts()
}

// 跳转到商品详情
const goToProductDetail = (productId) => {
  router.push(`/user/mall/product/${productId}`)
}

// 添加到购物车
const addToCart = async (productId) => {
  try {
    // 模拟API调用
    // const res = await api.mall.addToCart(productId)
    // if (res.code === 200) {
      ElMessage.success('已成功添加到购物车')
    // }
  } catch (error) {
    ElMessage.error('添加失败，请重试')
  }
}

// 立即购买
const buyNow = (productId) => {
  router.push(`/user/mall/checkout?productId=${productId}&quantity=1`)
}

// 获取分类名称
const getCategoryName = (categoryId) => {
  const category = categories.value.find(c => c.id === categoryId)
  return category ? category.name : '未分类'
}

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size
  loadProducts()
}

const handleCurrentChange = (current) => {
  currentPage.value = current
  loadProducts()
}
</script>

<style scoped>
.mall-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* 商城头部 */
.mall-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px 0;
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.mall-header h1 {
  font-size: 36px;
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.mall-header p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

/* 搜索和筛选区域 */
.search-filter-section {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.search-btn {
  width: 100%;
}

.category-filter,
.sort-options {
  margin-top: 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.filter-label {
  font-weight: 500;
  color: #333;
  margin-right: 10px;
}

/* 商品列表区域 */
.loading-container,
.empty-container {
  background-color: #fff;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.product-card {
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.product-image {
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  cursor: pointer;
}

.product-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.new-tag,
.discount-tag {
  position: absolute;
  top: 10px;
  padding: 4px 8px;
  font-size: 12px;
  color: #fff;
  border-radius: 4px;
}

.new-tag {
  left: 10px;
  background-color: #1890ff;
}

.discount-tag {
  right: 10px;
  background-color: #ff4d4f;
}

.product-info {
  padding: 15px;
  flex: 1;
  cursor: pointer;
}

.product-category {
  font-size: 12px;
  color: #999;
  margin-bottom: 5px;
}

.product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-description {
  font-size: 14px;
  color: #666;
  margin-bottom: 10px;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price-section {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.current-price {
  font-size: 20px;
  font-weight: bold;
  color: #ff4d4f;
  margin-right: 10px;
}

.original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sales-count {
  font-size: 12px;
  color: #999;
}

.product-actions {
  padding: 15px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 10px;
}

.product-actions .el-button {
  flex: 1;
}

/* 分页 */
.pagination {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .mall-header h1 {
    font-size: 28px;
  }
  
  .search-filter-section {
    padding: 15px;
  }
  
  .category-filter,
  .sort-options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-label {
    width: 100%;
    margin-bottom: 10px;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  
  .product-actions {
    flex-direction: column;
  }
}
</style>