// 导入Vue Router的核心函数
import { createRouter, createWebHistory } from 'vue-router'
// 导入用户状态管理store
import { useUserStore } from '../store/user'

// 路由配置 - 定义应用的所有路由
const routes = [
  // 公共路由 - 无需登录即可访问
  {
    path: '/login', // 路由路径
    name: 'Login',  // 路由名称
    // 懒加载组件 - 按需加载，提高初始加载性能
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }  // 元数据，标记不需要认证
  },
  {
    path: '/register', // 注册页面路由
    name: 'Register',  // 路由名称
    // 懒加载组件 - 按需加载，提高初始加载性能
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }  // 元数据，标记不需要认证
  },

  // 管理员角色路由 - 需要管理员权限
  {
    path: '/admin',
    name: 'AdminLayout',
    component: () => import('../views/admin/AdminLayout.vue'),
    // 元数据：需要认证且角色必须是admin
    meta: { requiresAuth: true, role: 'admin' },
    // 嵌套路由 - 管理员相关功能页面
    children: [
      { path: 'home', name: 'AdminHome', component: () => import('../views/admin/AdminHome.vue') },
      { path: 'users', name: 'UserManagement', component: () => import('../views/admin/UserManagement.vue') },
      { path: 'employees', name: 'EmployeeManagement', component: () => import('../views/admin/EmployeeManagement.vue') },
      { path: 'departments', name: 'DepartmentManagement', component: () => import('../views/admin/DepartmentManagement.vue') },
      { path: 'services', name: 'ServiceManagement', component: () => import('../views/admin/ServiceManagement.vue') },
      { path: 'ai-records', name: 'AIRecords', component: () => import('../views/admin/AIRecords.vue') },
      { path: 'system', name: 'SystemSettings', component: () => import('../views/admin/SystemSettings.vue') }
    ]
  },

  // 用户角色路由 - 需要普通用户权限
  {
    path: '/user',
    name: 'UserLayout',
    component: () => import('../views/user/UserLayout.vue'),
    // 元数据：需要认证且角色必须是user
    meta: { requiresAuth: true, role: 'user' },
    // 嵌套路由 - 用户相关功能页面
    children: [
      { path: 'home', name: 'UserHome', component: () => import('../views/user/UserHome.vue') },
      { path: 'ai-consult', name: 'AIConsult', component: () => import('../views/user/AIConsult.vue') },
      // 商城相关路由
      { path: 'mall', name: 'MallHome', component: () => import('../views/user/mall/MallHome.vue') },
      { path: 'mall/product/:productId', name: 'ProductDetail', component: () => import('../views/user/mall/ProductDetail.vue') },
      { path: 'mall/cart', name: 'ShoppingCart', component: () => import('../views/user/mall/ShoppingCart.vue') },
      { path: 'mall/checkout', name: 'Checkout', component: () => import('../views/user/mall/Checkout.vue') }
    ]
  },

  // 默认路由重定向 - 访问根路径时自动跳转到登录页
  {
    path: '/',
    redirect: '/login'
  },

  // 404页面 - 匹配所有未定义的路由
  {
    path: '/:pathMatch(.*)*', // 捕获所有未匹配的路由
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 使用HTML5 History模式
  routes // 应用路由配置
})

// 路由守卫 - 用于权限控制
router.beforeEach((to, from, next) => {
  // 获取用户store实例
  const userStore = useUserStore()
  const requiresAuth = to.meta.requiresAuth

  // 检查是否需要认证
  if (requiresAuth) {
    // 验证用户是否已登录
    if (!userStore.isLoggedIn) {
      console.log('路由守卫: 需要登录但未登录，重定向到登录页')
      // 需要登录但未登录，重定向到登录页
      next('/login')
      return
    }

    // 验证用户角色权限
    if (to.meta.role && to.meta.role !== userStore.role) {
      console.log(`路由守卫: 角色权限不足 - 当前角色: ${userStore.role}, 需要角色: ${to.meta.role}`)
      // 角色不匹配，根据当前用户角色重定向到对应首页
      if (userStore.isAdmin) {
        // 管理员尝试访问普通用户页面，重定向到管理员首页
        next('/admin/home')
      } else {
        // 普通用户尝试访问管理员页面，重定向到普通用户首页
        next('/user/home')
      }
      return
    }
  }

  // 无需认证或权限验证通过，允许访问
  next()
})

// 导出路由实例供main.js使用
export default router