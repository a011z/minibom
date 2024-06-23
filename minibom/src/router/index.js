import { createRouter, createWebHistory } from "vue-router";

import LoginVue from '@/views/Login.vue';
import LayoutVue from '@/views/Layout.vue';
import BomManageVue from '@/views/bom/BomManage.vue'
import AttributeVue from '@/views/Attribute.vue';
import component from "element-plus/es/components/tree-select/src/tree-select-option.mjs";


//路由关系
const routes =[
    {path:'/',redirect:'/login'},
    {path:'/layout',component:LayoutVue},
    {path:'/bom',component:BomManageVue},
    {path:'/login',component:LoginVue},

    {path:'/login',component:LoginVue},
    {path:'/attribute',component:AttributeVue}

]

//路由器
const router =createRouter({
    history:createWebHistory(),
    routes:routes
})

export default router