//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
//const baseURL='http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})

import { useTokenStore } from '@/stores/token.js';
//添加请求拦截器
instance.interceptors.request.use(
    (config)=>{
        //添加token
        const tokenStore=useTokenStore();
        if(tokenStore){
            config.headers.token=tokenStore.token
        }
        return config;
    },
    (err)=>{

        Promise.reject(err)

    }
)
import { useRouter } from 'vue-router';
const router=useRouter();

//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        // if(result.data.code===200||result.data.code===116){
        // ElMessage.success(result.data.message?result.data.message:'服务异常')
        return result.data;
        
        // }
        // else{
        //     ElMessage.error(result.data.message?result.data.message:'服务异常')
        //     return Promise.reject(result.data)

        // }

    },
    err=>{

        //判断响应状态码
        if(err.response.status===401){
            ElMessage.error('请先登录')
            router.push('/login')

        }else{
            ElMessage.error('服务异常')
        }
        return Promise.reject(err);//异步的状态转化成失败的状态


    }
)

export default instance;