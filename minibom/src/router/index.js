import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import BomManageVue from '@/views/bom/BomManage.vue'


//路由关系
const routes =[
    {path:'/',redirect:'/login'},
    {path:'/layout',component:LayoutVue},
    {path:'/bom/bommanage',component:BomManageVue},
    {path:'/login',component:LoginVue},


]

//路由器
const router =createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router