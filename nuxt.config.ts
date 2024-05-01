// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
    // @ts-ignore
    runtimeConfig: {
        public: {
            pspDomain: process.env.PSP_WIZARD_DOMAINNAME || "localhost",
            pspPort: process.env.PSP_WIZARD_PORT || "8080",
            tqPropRefinerDomain: process.env.TQ_PROP_REFINER_DOMAINNAME || "localhost",
            tqPropRefinerPort: process.env.TQ_PROP_REFINER_PORT || "8084",
            miSimDomain: process.env.MI_SIM_DOMAINNAME || "localhost",
            miSimPort: process.env.MI_SIM_PORT || "8084",
            tbVerifierDomain: process.env.TB_VERIFIER_DOMAINNAME || "localhost",
            tbVerifierPort: process.env.TB_VERIFIER_PRORT || "8083",
            moSimDomain: process.env.MO_SIM_DOMAINNAME || "localhost",
            moSimPort: process.env.MO_SIM_PRORT || "8087"
        }
    },
    devtools: {enabled: true},
    modules: [
        'nuxt-mongoose',
        '@nuxt/ui'
    ],
    mongoose: {
        uri: process.env.MONGODB_URI,
        options: {},
        modelsDir: 'models',
    },
    colorMode: {
        preference: "light"
    }
})
