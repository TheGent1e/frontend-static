<template>
  <div class="checkout-container">
    <div class="checkout">
      <div class="checkout-header">
        <h2>确认订单</h2>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item @click="goToMall">商城首页</el-breadcrumb-item>
          <el-breadcrumb-item @click="goToCart">购物车</el-breadcrumb-item>
          <el-breadcrumb-item>确认订单</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 结算内容 -->
      <div v-if="!loading" class="checkout-content">
        <!-- 收货地址 -->
        <div class="checkout-section address-section">
          <div class="section-header">
            <h3>收货信息</h3>
            <el-button type="text" @click="showAddressDialog = true">管理地址</el-button>
          </div>
          
          <div v-if="addresses.length > 0" class="address-list">
            <div
              v-for="address in addresses"
              :key="address.id"
              class="address-item"
              :class="{ active: selectedAddressId === address.id }"
              @click="selectedAddressId = address.id"
            >
              <div class="address-info">
                <div class="address-name-phone">
                  <span class="address-name">{{ address.receiverName }}</span>
                  <span class="address-phone">{{ address.phone }}</span>
                  <el-tag v-if="address.isDefault" size="small" type="success">默认</el-tag>
                </div>
                <div class="address-detail">{{ address.province }}{{ address.city }}{{ address.district }}{{ address.detail }}</div>
              </div>
              <div class="address-actions">
                <el-radio v-model="selectedAddressId" :label="address.id" size="large" />
              </div>
            </div>
          </div>
          
          <div v-else class="no-address">
            <el-empty description="暂无收货地址" :image-size="100">
              <el-button type="primary" @click="showAddressDialog = true">添加地址</el-button>
            </el-empty>
          </div>
        </div>

        <!-- 订单商品 -->
        <div class="checkout-section order-items-section">
          <div class="section-header">
            <h3>商品信息</h3>
          </div>
          
          <div class="order-items">
            <div v-for="item in orderItems" :key="item.id" class="order-item">
              <div class="item-image">
                <img :src="item.image" :alt="item.name" />
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-specs">{{ getSpecsText(item.specs) }}</div>
              </div>
              <div class="item-price">¥{{ item.price }}</div>
              <div class="item-quantity">x{{ item.quantity }}</div>
              <div class="item-subtotal">¥{{ item.subtotal }}</div>
            </div>
          </div>
        </div>

        <!-- 配送方式 -->
        <div class="checkout-section delivery-section">
          <div class="section-header">
            <h3>配送方式</h3>
          </div>
          
          <div class="delivery-options">
            <el-radio-group v-model="selectedDeliveryId">
              <div
                v-for="delivery in deliveryOptions"
                :key="delivery.id"
                class="delivery-option"
                :class="{ active: selectedDeliveryId === delivery.id }"
              >
                <el-radio :label="delivery.id">{{ delivery.name }}</el-radio>
                <div class="delivery-desc">
                  {{ delivery.description }}
                  <span v-if="delivery.fee > 0" class="delivery-fee">+¥{{ delivery.fee }}</span>
                </div>
              </div>
            </el-radio-group>
          </div>
        </div>

        <!-- 支付方式 -->
        <div class="checkout-section payment-section">
          <div class="section-header">
            <h3>支付方式</h3>
          </div>
          
          <div class="payment-options">
            <el-radio-group v-model="selectedPaymentId">
              <div
                v-for="payment in paymentOptions"
                :key="payment.id"
                class="payment-option"
                :class="{ active: selectedPaymentId === payment.id }"
              >
                <el-radio :label="payment.id">{{ payment.name }}</el-radio>
                <div class="payment-icon">{{ payment.icon }}</div>
              </div>
            </el-radio-group>
          </div>
        </div>

        <!-- 优惠券 -->
        <div class="checkout-section coupon-section">
          <div class="section-header">
            <h3>优惠券</h3>
          </div>
          
          <div class="coupon-selector" @click="showCouponDialog = true">
            <span v-if="selectedCoupon">
              {{ selectedCoupon.name }} (¥{{ selectedCoupon.value }}折扣)
            </span>
            <span v-else>请选择优惠券</span>
            <el-icon class="el-icon--right"><ArrowRight /></el-icon>
          </div>
        </div>

        <!-- 订单备注 -->
        <div class="checkout-section remark-section">
          <div class="section-header">
            <h3>订单备注</h3>
          </div>
          
          <el-input
            v-model="orderRemark"
            placeholder="选填，请输入订单备注信息"
            type="textarea"
            :rows="2"
            @input="sanitizeInput"
          />
        </div>

        <!-- 订单金额 -->
        <div class="checkout-section order-amount-section">
          <div class="amount-item">
            <span>商品总价</span>
            <span>¥{{ productTotal }}</span>
          </div>
          <div class="amount-item">
            <span>运费</span>
            <span>¥{{ deliveryFee }}</span>
          </div>
          <div class="amount-item" v-if="couponDiscount > 0">
            <span class="text-success">优惠券折扣</span>
            <span class="text-success">-¥{{ couponDiscount }}</span>
          </div>
          <div class="amount-item total">
            <span>实付款</span>
            <span class="total-price">¥{{ totalAmount }}</span>
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <div v-else class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>
    </div>

    <!-- 底部提交栏 -->
    <div class="checkout-footer" v-if="!loading">
      <div class="footer-content">
        <div class="total-info">
          实付款：<span class="total-price">¥{{ totalAmount }}</span>
        </div>
        <div class="submit-section">
          <el-button type="primary" @click="submitOrder" :loading="submitting">
            提交订单
          </el-button>
        </div>
      </div>
    </div>

    <!-- 地址管理弹窗 -->
    <el-dialog
      v-model="showAddressDialog"
      title="管理收货地址"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="address-dialog-content">
        <div class="address-form">
          <el-form :model="addressForm" :rules="addressRules" ref="addressFormRef">
            <el-form-item label="收货人" prop="receiverName">
              <el-input v-model="addressForm.receiverName" placeholder="请输入收货人姓名" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
              <el-input v-model="addressForm.phone" placeholder="请输入手机号码" />
            </el-form-item>
            <el-form-item label="所在地区" prop="region">
              <el-cascader
                v-model="addressForm.region"
                :options="regionOptions"
                placeholder="请选择省/市/区"
                filterable
                @change="handleRegionChange"
              />
            </el-form-item>
            <el-form-item label="详细地址" prop="detail">
              <el-input
                v-model="addressForm.detail"
                type="textarea"
                :rows="3"
                placeholder="请输入详细地址"
              />
            </el-form-item>
            <el-form-item>
              <el-checkbox v-model="addressForm.isDefault">设为默认地址</el-checkbox>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template #footer>
        <el-button @click="showAddressDialog = false">取消</el-button>
        <el-button type="primary" @click="saveAddress">保存</el-button>
      </template>
    </el-dialog>

    <!-- 优惠券选择弹窗 -->
    <el-dialog
      v-model="showCouponDialog"
      title="选择优惠券"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="coupon-dialog-content">
        <div v-if="availableCoupons.length > 0" class="coupon-list">
          <div
            v-for="coupon in availableCoupons"
            :key="coupon.id"
            class="coupon-item"
            :class="{ active: selectedCouponId === coupon.id }"
            @click="handleCouponSelect(coupon)"
          >
            <div class="coupon-value">¥{{ coupon.value }}</div>
            <div class="coupon-info">
              <div class="coupon-name">{{ coupon.name }}</div>
              <div class="coupon-condition">满{{ coupon.minSpend }}可用</div>
              <div class="coupon-expire">有效期至：{{ coupon.expireDate }}</div>
            </div>
            <el-radio v-model="selectedCouponId" :label="coupon.id" size="large" />
          </div>
        </div>
        <div v-else class="no-coupon">
          <el-empty description="暂无可用优惠券" />
        </div>
      </div>
      <template #footer>
        <el-button @click="showCouponDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ArrowRight } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const loading = ref(false)
const submitting = ref(false)
const orderItems = ref([])
const addresses = ref([])
const selectedAddressId = ref('')
const deliveryOptions = ref([])
const selectedDeliveryId = ref('')
const paymentOptions = ref([])
const selectedPaymentId = ref('')
const availableCoupons = ref([])
const selectedCouponId = ref(null)
const selectedCoupon = ref(null)
const orderRemark = ref('')

// 弹窗控制
const showAddressDialog = ref(false)
const showCouponDialog = ref(false)

// 地址表单
const addressForm = ref({
  receiverName: '',
  phone: '',
  region: [],
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: false
})

const addressRules = {
  receiverName: [
    { required: true, message: '请输入收货人姓名', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ],
  region: [
    { required: true, message: '请选择所在地区', trigger: 'change' }
  ],
  detail: [
    { required: true, message: '请输入详细地址', trigger: 'blur' }
  ]
}

// 地区选项（模拟数据）
const regionOptions = ref([
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '朝阳区', label: '朝阳区' },
          { value: '海淀区', label: '海淀区' },
          { value: '东城区', label: '东城区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '浦东新区', label: '浦东新区' },
          { value: '黄浦区', label: '黄浦区' }
        ]
      }
    ]
  }
])

// 生命周期钩子
onMounted(() => {
  loadCheckoutData()
})

// 加载结算页面数据
const loadCheckoutData = async () => {
  loading.value = true
  try {
    // 加载商品数据
    const checkoutParams = sessionStorage.getItem('checkoutParams')
    if (checkoutParams) {
      const params = JSON.parse(checkoutParams)
      // 这里可以根据params加载商品详情
      orderItems.value = getMockOrderItems(params)
    } else {
      // 也可以从路由参数获取商品ID和数量
      const { productId, quantity } = route.query
      if (productId) {
        orderItems.value = getMockOrderItemsFromParams({ productId, quantity })
      } else {
        ElMessage.warning('请从购物车或商品详情页进入结算')
        router.push('/user/mall')
        return
      }
    }

    // 加载地址数据
    // const addressRes = await api.mall.getAddresses()
    addresses.value = getMockAddresses()
    // 设置默认选中的地址
    const defaultAddress = addresses.value.find(addr => addr.isDefault)
    if (defaultAddress) {
      selectedAddressId.value = defaultAddress.id
    } else if (addresses.value.length > 0) {
      selectedAddressId.value = addresses.value[0].id
    }

    // 加载配送方式
    deliveryOptions.value = getMockDeliveryOptions()
    selectedDeliveryId.value = deliveryOptions.value[0].id

    // 加载支付方式
    paymentOptions.value = getMockPaymentOptions()
    selectedPaymentId.value = paymentOptions.value[0].id

    // 加载优惠券
    availableCoupons.value = getMockAvailableCoupons()
  } catch (error) {
    console.error('加载结算数据失败', error)
    ElMessage.error('加载数据失败，请重试')
  } finally {
    loading.value = false
  }
}

// 模拟订单商品数据（从购物车）
const getMockOrderItems = (params) => {
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

// 模拟订单商品数据（从商品详情页直接购买）
const getMockOrderItemsFromParams = (params) => {
  return [
    {
      id: 1,
      productId: params.productId,
      name: '智能血压计家用上臂式全自动测量仪',
      image: '/images/products/blood-pressure.jpg',
      price: 299.00,
      quantity: params.quantity || 1,
      specs: { '颜色': '白色', '型号': 'BP-3000' },
      subtotal: 299.00 * (params.quantity || 1)
    }
  ]
}

// 模拟收货地址数据
const getMockAddresses = () => {
  return [
    {
      id: '1',
      receiverName: '张三',
      phone: '13800138000',
      province: '北京市',
      city: '北京市',
      district: '朝阳区',
      detail: '某某街道某某小区1号楼101室',
      isDefault: true
    },
    {
      id: '2',
      receiverName: '李四',
      phone: '13900139000',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      detail: '某某路某某花园2号楼202室',
      isDefault: false
    }
  ]
}

// 模拟配送方式数据
const getMockDeliveryOptions = () => {
  return [
    {
      id: 'standard',
      name: '标准配送',
      description: '3-5个工作日送达',
      fee: 0
    },
    {
      id: 'express',
      name: '加急配送',
      description: '1-2个工作日送达',
      fee: 15
    }
  ]
}

// 模拟支付方式数据
const getMockPaymentOptions = () => {
  return [
    {
      id: 'alipay',
      name: '支付宝',
      icon: '💳'
    },
    {
      id: 'wechat',
      name: '微信支付',
      icon: '💳'
    },
    {
      id: 'card',
      name: '银行卡支付',
      icon: '💳'
    }
  ]
}

// 模拟可用优惠券数据
const getMockAvailableCoupons = () => {
  return [
    {
      id: '1',
      name: '新人专享优惠券',
      value: 20,
      minSpend: 100,
      expireDate: '2023-12-31'
    },
    {
      id: '2',
      name: '满300减50',
      value: 50,
      minSpend: 300,
      expireDate: '2023-12-31'
    }
  ]
}

// 计算属性
const productTotal = computed(() => {
  return orderItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
})

const deliveryFee = computed(() => {
  const delivery = deliveryOptions.value.find(d => d.id === selectedDeliveryId.value)
  return delivery ? delivery.fee : 0
})

// 判断是否可以使用优惠券
const canUseCoupon = computed(() => {
  if (!selectedCoupon.value) return false
  return productTotal.value >= selectedCoupon.value.minSpend
})

const couponDiscount = computed(() => {
    if (!selectedCoupon.value) return 0
    // 检查是否满足优惠券使用条件
    return canUseCoupon.value ? selectedCoupon.value.discount : 0
  })

const totalAmount = computed(() => {
  return Math.max(0, productTotal.value + deliveryFee.value - couponDiscount.value)
})

// 事件处理函数
const handleRegionChange = (value) => {
  if (value && value.length >= 3) {
    addressForm.value.province = value[0]
    addressForm.value.city = value[1]
    addressForm.value.district = value[2]
  }
}

const saveAddress = async () => {
  try {
    // 模拟API调用
    // await api.mall.saveAddress(addressForm.value)
    
    // 更新本地地址列表
    const newAddress = {
      id: Date.now().toString(),
      ...addressForm.value
    }
    
    addresses.value.push(newAddress)
    
    // 如果设为默认地址，更新其他地址
    if (addressForm.value.isDefault) {
      addresses.value.forEach(addr => {
        if (addr.id !== newAddress.id) {
          addr.isDefault = false
        }
      })
    }
    
    // 选中新添加的地址
    selectedAddressId.value = newAddress.id
    
    // 重置表单
    resetAddressForm()
    
    showAddressDialog.value = false
    ElMessage.success('地址保存成功')
  } catch (error) {
    console.error('保存地址失败', error)
    ElMessage.error('保存失败，请重试')
  }
}

const resetAddressForm = () => {
  addressForm.value = {
    receiverName: '',
    phone: '',
    region: [],
    province: '',
    city: '',
    district: '',
    detail: '',
    isDefault: false
  }
}

const handleCouponSelect = (coupon) => {
  // 检查是否满足使用条件
  if (productTotal.value < coupon.minSpend) {
    ElMessage.warning(`订单金额需满${coupon.minSpend}元才能使用该优惠券`)
    return
  }
  
  selectedCouponId.value = coupon.id
  selectedCoupon.value = coupon
  showCouponDialog.value = false
}

const submitOrder = async () => {
  // 校验
  if (!selectedAddressId.value) {
    ElMessage.warning('请选择收货地址')
    return
  }
  
  try {
    submitting.value = true
    
    // 构建订单数据
    const orderData = {
      addressId: selectedAddressId.value,
      deliveryId: selectedDeliveryId.value,
      paymentId: selectedPaymentId.value,
      couponId: selectedCouponId.value,
      remark: orderRemark.value,
      items: orderItems.value.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    }
    
    // 模拟API调用
    // const res = await api.mall.createOrder(orderData)
    // if (res.code === 200) {
      // 模拟订单创建成功
      await ElMessageBox.alert(
        '订单提交成功！即将跳转到支付页面。',
        '提交成功',
        {
          confirmButtonText: '确定',
          callback: () => {
            // 跳转到支付页面或订单详情
            router.push('/user/mall/orders')
            // 清空购物车中已购买的商品
            sessionStorage.removeItem('checkoutParams')
          }
        }
      )
    // }
  } catch (error) {
    console.error('提交订单失败', error)
    ElMessage.error('提交订单失败，请重试')
  } finally {
    submitting.value = false
  }
}

// 辅助函数
const getSpecsText = (specs) => {
  if (!specs) return ''
  return Object.entries(specs)
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}

// 导航函数
const goToMall = () => {
  router.push('/user/mall')
}

const goToCart = () => {
  router.push('/user/mall/cart')
}
</script>

<style scoped>
/* 结算页面样式优化 - 科技蓝主题 */
.checkout-container {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary-light) 0%, var(--bg-secondary-light) 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  padding-bottom: 100px;
  position: relative;
  overflow: hidden;
}

/* 装饰性背景动画 */
.checkout-container::before {
  content: '';
  position: absolute;
  top: -10%;
  right: -10%;
  width: 40%;
  height: 40%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
  animation: float 15s ease-in-out infinite;
  z-index: 0;
}

.checkout-container::after {
  content: '';
  position: absolute;
  bottom: -10%;
  left: -10%;
  width: 30%;
  height: 30%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%);
  animation: float 12s ease-in-out infinite reverse;
  z-index: 0;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(20px, 20px) scale(1.05); }
}

.checkout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.checkout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-color);
  background: var(--bg-card);
  padding: 20px 24px;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-card);
}

.checkout-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-color-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.checkout-content {
  background: var(--bg-card);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-card);
}

.checkout-section {
  padding: 24px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.checkout-section:hover {
  background-color: rgba(59, 130, 246, 0.02);
}

.checkout-section:last-child {
  border-bottom: none;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

/* 地址样式 */
.address-list {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.address-item {
  flex: 1;
  min-width: 300px;
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--bg-card);
  position: relative;
  overflow: hidden;
}

.address-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: transparent;
  transition: background 0.3s ease;
}

.address-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.address-item.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.address-item.active::before {
  background: var(--primary-color);
}

.address-name-phone {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.address-name {
  font-weight: 600;
  color: var(--text-primary);
}

.address-phone {
  color: var(--text-secondary);
}

.address-detail {
  color: var(--text-secondary);
  line-height: 1.6;
}

.address-actions {
  position: absolute;
  top: 20px;
  right: 20px;
}

/* 订单商品样式 */
.order-items {
  background: var(--bg-card);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.order-item {
  display: grid;
  grid-template-columns: 100px 1fr 100px 80px 100px;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.3s ease;
}

.order-item:last-child {
  border-bottom: none;
}

.order-item:hover {
  background-color: rgba(59, 130, 246, 0.02);
}

.item-image {
  width: 80px;
  height: 80px;
  border-radius: var(--border-radius-md);
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-image:hover img {
  transform: scale(1.05);
}

.item-info {
  padding: 0 16px;
}

.item-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
  overflow: hidden;
  /* 标准版本的line-clamp属性，提高兼容性 */
  display: -webkit-box;
  display: -moz-box;
  display: box;
  display: -ms-flexbox;
  display: flex;
  -webkit-line-clamp: 2;
  -moz-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  -moz-box-orient: vertical;
  box-orient: vertical;
  -webkit-flex-direction: column;
  -ms-flex-direction: column;
  flex-direction: column;
}

.item-specs {
  font-size: 14px;
  color: var(--text-secondary);
}

.item-price, .item-subtotal {
  font-weight: 600;
  color: var(--text-primary);
  text-align: right;
}

.item-price {
  color: var(--primary-color);
}

.item-quantity {
  text-align: right;
  color: var(--text-secondary);
}

/* 配送方式和支付方式 */
.delivery-options, .payment-options {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.delivery-option, .payment-option {
  flex: 1;
  min-width: 250px;
  padding: 16px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
}

.delivery-option:hover, .payment-option:hover {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.delivery-option.active, .payment-option.active {
  border-color: var(--primary-color);
  background-color: rgba(59, 130, 246, 0.05);
}

.delivery-desc {
  flex: 1;
  color: var(--text-secondary);
}

.delivery-fee {
  color: var(--primary-color);
  font-weight: 600;
}

.payment-icon {
  margin-left: auto;
  font-size: 20px;
}

/* 优惠券样式 */
.coupon-selector {
  padding: 16px;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
}

.coupon-selector:hover {
  border-color: var(--primary-color);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent);
}

/* 订单备注 */
.el-input__wrapper {
  border-radius: var(--border-radius-md) !important;
  box-shadow: none !important;
}

.el-input__wrapper:hover {
  box-shadow: 0 0 0 1px var(--primary-color) !important;
}

/* 订单金额 */
.order-amount-section {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
}

.amount-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  color: var(--text-secondary);
}

.amount-item.total {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
}

.amount-item.total span:first-child {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 16px;
}

.total-price {
  font-size: 24px;
  font-weight: 700;
  color: var(--primary-color);
}

/* 底部提交栏 */
.checkout-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-card);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  padding: 16px 0;
  z-index: 1000;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.total-info {
  font-size: 16px;
  color: var(--text-secondary);
}

.submit-section .el-button {
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-color-dark));
  border: none;
  border-radius: var(--border-radius-md);
  transition: all 0.3s ease;
}

.submit-section .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  background: linear-gradient(135deg, var(--primary-color-dark), var(--primary-color-darker));
}

.submit-section .el-button:active {
  transform: translateY(0);
}

/* 加载状态 */
.loading-container {
  padding: 40px 24px;
}

/* 地址管理弹窗样式 */
.address-dialog-content {
  max-height: 500px;
  overflow-y: auto;
}

.address-form {
  padding: 16px 0;
}

/* 优惠券弹窗样式 */
.coupon-dialog-content {
  max-height: 400px;
  overflow-y: auto;
}

.coupon-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.coupon-item {
  display: flex;
  align-items: center;
  padding: 20px;
  border: 2px solid var(--border-color);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), transparent);
}

.coupon-item:hover, .coupon-item.active {
  border-color: var(--primary-color);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.15);
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent);
}

.coupon-value {
  font-size: 28px;
  font-weight: bold;
  color: var(--primary-color);
  margin-right: 20px;
  min-width: 80px;
  background: linear-gradient(45deg, var(--primary-color), var(--primary-color-dark));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.coupon-info {
  flex: 1;
}

.coupon-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
  font-size: 16px;
}

.coupon-condition, .coupon-expire {
  font-size: 12px;
  color: var(--text-secondary);
}

.no-coupon {
  padding: 40px 0;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .checkout {
    padding: 16px;
    padding-bottom: 120px;
  }
  
  .checkout-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .checkout-header h2 {
    font-size: 24px;
  }
  
  .checkout-section {
    padding: 16px;
  }
  
  .section-header h3 {
    font-size: 18px;
  }
  
  .address-item {
    min-width: 100%;
  }
  
  .order-item {
    grid-template-columns: 1fr;
    gap: 10px;
    align-items: flex-start;
  }
  
  .item-info, .item-price, .item-quantity, .item-subtotal {
    padding: 0;
  }
  
  .item-price, .item-quantity, .item-subtotal {
    text-align: left;
  }
  
  .delivery-option, .payment-option {
    min-width: 100%;
  }
  
  .footer-content {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
  
  .submit-section .el-button {
    width: 100%;
  }
  
  .total-price {
    font-size: 20px;
  }
}
</style>