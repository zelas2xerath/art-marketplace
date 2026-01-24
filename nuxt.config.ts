// frontend/nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@pinia/nuxt', '@vueuse/nuxt', '@nuxt/icon'],
  //, 'nuxt-socket-io' ,这个模块有问题：DeprecationWarning: Passing invalid argument types to fs.existsSync is deprecated
  css: ['~/assets/css/main.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
      autoprefixer: {},
    },
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:9000',
      wsUrl: process.env.WS_URL || 'http://localhost:3001',
    }
  },

  // io: {
  //   sockets: [{
  //     name: 'main',
  //     url: process.env.WS_URL || 'http://localhost:3001',
  //   }]
  // },

  compatibilityDate: '2024-01-23',
})