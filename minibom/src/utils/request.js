//定制请求的实例

//导入axios  npm install axios
import axios from 'axios';
import { ElMessage } from 'element-plus';
//定义一个变量,记录公共的前缀  ,  baseURL
//const baseURL='http://localhost:8080';
const baseURL = '/api';
const instance = axios.create({baseURL})


//添加响应拦截器
instance.interceptors.response.use(
    result=>{
        if(result.data.code===123||result.data.code===116){
        return result.data;
        }
        
        ElMessage.error(result.data.message?result.data.message:'服务异常')
        return Promise.reject(result.data)
    },
    err=>{
        Element.error(result.data.msg?result.data.msg:'服务异常');
        return Promise.reject(err);//异步的状态转化成失败的状态
    }
)

export default instance;