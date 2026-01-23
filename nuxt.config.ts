// frontend/nuxt.config.ts
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-socket-io',
  ],

  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: '#6366f1',
            secondary: '#ec4899',
          }
        }
      }
    }
  },

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