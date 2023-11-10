import { createRouter, createWebHashHistory  } from "vue-router";
import Home from '@/views/Home.vue'
import NotFound from '@/views/NotFound.vue'

const routes = [
    {path: '/', name: "Home", component: Home},
    {path: '/:catchAll(.*)', name: "NotFound", component: NotFound},        
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router
