// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      script: [
        {
          src: 'https://kit.fontawesome.com/4cd87bf5ed.js',
          crossorigin: 'anonymous'
        }
      ]
    }
  },
  modules: ['@sidebase/nuxt-auth']
})
