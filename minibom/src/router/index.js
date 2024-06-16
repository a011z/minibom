import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import PartVue from '@/views/Part.vue'

//路由关系
const routes =[
    {path:'/login',component:LoginVue},
    {path:'/',component:LayoutVue},
    {path:'/part',component:PartVue},

]

//路由器
const router =createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router