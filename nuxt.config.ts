// frontend/nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-socket-io',
  ],

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || 'http://localhost:9000',
      wsUrl: process.env.WS_URL || 'http://localhost:3001',
    }
  },

  io: {
    sockets: [{
      name: 'main',
      url: process.env.WS_URL || 'http://localhost:3001',
    }]
  },

  compatibilityDate: '2024-01-23',
})