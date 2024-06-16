import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';


//路由关系
const routes =[
    {path:'/layout',component:LayoutVue},
    {path:'/login',component:LoginVue},
    {path:'/',redirect:'/login'}
]

//路由器
const router =createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router