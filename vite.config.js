import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // vueDevTools(), // 禁用 vueDevTools 插件
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 性能优化配置
  build: {
    // 启用CSS代码分割
    cssCodeSplit: true,
    // 压缩CSS
    minify: 'esbuild',
    // 为静态资源添加hash，避免缓存问题
    assetsDir: 'assets',
    // 生成source map用于调试
    sourcemap: false,
    // 分块策略
    rollupOptions: {
      output: {
        manualChunks: {
          // 将第三方库分块，提高缓存命中率
          vendor: ['vue', 'vue-router', 'pinia'],
          element: ['element-plus'],
          echarts: ['echarts'],
        },
      },
    },
  },
  // CSS优化
  css: {
    // 提取CSS到单独文件
    extract: true,
    // 配置CSS模块
    modules: {
      generateScopedName: '[local]_[hash:base64:5]',
    },
    // 预处理器选项
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/variables.scss";
`,
      },
    },
  },
  server: {
    proxy: {
      // 将/api请求代理到后端服务器
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // 移除/api前缀
      },
      // 扣子智能体API代理配置
      '/coze-api': {
        target: 'https://api.coze.cn/v3',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/coze-api/, '')
      }
    }
  }
})
