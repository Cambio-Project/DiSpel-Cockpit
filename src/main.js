import { createApp } from 'vue'
//import Vue from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import store from './store'

// Import our custom CSS
import './scss/styles.scss'


const routes = [
    { path: '/pspwizard', component: () => import("@/components/PSPWizard.vue") },
    { path: '/scenarios', component: () => import("@/components/Scenarios.vue") },
    { path: '/dashboard', component: () => import("@/components/Dashboard.vue") },
    { path: '/scenarioeditor', component: () => import("@/components/ScenarioEditor.vue") },
];

// create router for dealing with different Vue components
const router = createRouter({
    history: createWebHistory(),
    routes,
    preserveQuery: false,
  });

const app = createApp(App);

// Install Vue Router
app.use(router);

// Use Vuex store
app.use(store);

// Mount the app
app.mount('#app');
