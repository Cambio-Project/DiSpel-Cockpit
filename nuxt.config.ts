// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // @ts-ignore
  runtimeConfig: {
    public:{
      pspDomain: process.env.PSP_WIZARD_DOMAINNAME || "localhost",
      pspPort: process.env.PSP_WIZARD_PORT || 8080,
      tqPropRefinerDomain: process.env.TQ_PROP_REFINER_DOMAINNAME || "localhost",
      tqPropRefinerPort: process.env.TQ_PROP_REFINER_PORT || 8084
    }
  },
  devtools: { enabled: true },
})
