// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // @ts-ignore
  modules: ['nuxt-proxy'],
  runtimeConfig: {
    public:{
      pspDomain: process.env.PSP_WIZARD_DOMAINNAME || "localhost",
      pspPort: process.env.PSP_WIZARD_PORT || 8080
    }
  },
  proxy: {
    options: {
        target: 'http://localhost:80',
        changeOrigin: true,
        pathRewrite: {
            '^/tqPropRefinerContainer': ''
        },
        pathFilter: [
            '/tqPropRefinerContainer'
        ]
    }
  },
  devtools: { enabled: true },
})
