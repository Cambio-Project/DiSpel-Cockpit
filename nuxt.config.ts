// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      pspDomain: process.env.PSP_WIZARD_DOMAINNAME,
      pspPort: process.env.PSP_WIZARD_PORT,
    }
  }
})
