import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';
import routes from 'pages-generated';
import { applyRouteMeta } from './documentHead.js';

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.afterEach((to) => {
    applyRouteMeta(to.path);
});

createApp(App).use(router).mount('#app');
