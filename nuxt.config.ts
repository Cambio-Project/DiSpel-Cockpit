// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // @ts-ignore
  runtimeConfig: {
    public:{
      pspDomain: process.env.PSP_WIZARD_DOMAINNAME || "localhost",
      pspPort: process.env.PSP_WIZARD_PORT || 8080
    }
  },
  devtools: { enabled: true },
})
