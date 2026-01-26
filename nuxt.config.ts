import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxt/icon',
    'shadcn-nuxt',
  ],
  css: ['~/assets/css/main.css'],

  // 禁用 Vue DevTools 以避免模块导出错误
  devtools: { enabled: false },

  // Vite 配置优化
  vite: {
    plugins: [tailwindcss()],
    server: {
      hmr: {
        protocol: 'ws',
        host: 'localhost',
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:9000',
      wsUrl: process.env.WS_URL || 'http://localhost:3001',
    }
  },

  compatibilityDate: '2025-07-15',
})