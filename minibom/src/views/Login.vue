<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { ElMessage } from 'element-plus';
import CryptoJs from'crypto-js';
//控制注册与登录表单的显示， 默认显示注册
const isRegister = ref(false)
//定义数据模型
const registerData = ref({
    name:'',
    password:'',
    email:'',
    telephone:'',
    rePassword:''
})

//加密数据模型

//校验密码的函数
const checkRePassword = (rule,value,callback)=>{
    if(value===''){
        callback(new Error('请再次确认密码'))
    }else if(value !== registerData.value.password){
        callback(new Error('请确保两次输入的密码一样'))
    }else{
        callback()
    }
}

//定义表单校验规则
const rules = ({
    name:[
        {required:true,message: '请输入用户名',trigger:'blur'},
        {pattern: /^[a-zA-Z0-9]{6,32}$/,
            min: 6, max: 32, message: '长度为6~32位非空字符', trigger: 'blur'}

    ],
    telephone:[
        {required:true,message: '请输入电话号码',trigger:'blur'},
        {pattern:/^1[3-9]\\d{9}$/,trigger:'blur'}
    ],
    email:[
        {required:true,message:"请输入邮箱"},
        {pattern: /^[a-zA-Z0-9]{6,32}$/,
            min: 6, max: 32, message: '长度为6~32位非空字符', trigger: 'blur'}

    ],
    password:[
        {required:true,message: '请输入密码',trigger:'blur'},
        {pattern: /^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,32}$/,
        min: 8, max: 32, message: '长度为8~32位非空字符', trigger: 'blur'}
    ],
    rePassword:[
        {validator:checkRePassword,trigger: 'blur'}
    ]
})

//调用后台接口完成注册
import {userRegisterService,  userLoginService }from '@/api/user.js'
const register = async()=>{
    //try{
        const dataToRegister = Object.assign({}, registerData.value);
        if (dataToRegister.password) {
            // 使用 SHA-256 算法对密码进行哈希加密
            const hashedPassword = CryptoJs.SHA256(dataToRegister.password).toString();
            
            // 用加密后的密码替换原始密码
            dataToRegister.password = hashedPassword;
            if(dataToRegister.rePassword){
                const hashedrePassword = CryptoJs.SHA256(dataToRegister.rePassword).toString();
            
                // 用加密后的密码替换原始密码
                dataToRegister.rePassword = hashedrePassword;
            }
        }
    
    //registerData是响应式对象，获取值需要.value
    let result = await userRegisterService(dataToRegister);


    // if(result.code===0){
    //     alert(result.msg?result.msg : '注册成功');
    // }else{
    // alert('注册失败');
    // }
    ElMessage.success(result.message)
    

    // }catch(error){
    //     ElMessage.error('注册失败');
    // }

}

//绑定数据，复用注册表单的数据模型
//表单数据校验
//登录函数
import{useTokenStore} from'@/stores/token.js'
import{useRouter} from 'vue-router'
const router =useRouter()
const tokenStore=useTokenStore();
const login = async ()=>{
    try{
        const dataToLogin=registerData.value;
        if(dataToLogin.password){
            const hashedPassword = CryptoJs.SHA256(dataToLogin.password).toString();
            dataToLogin.password = hashedPassword;
        }

    
    //调用接口，完成登录
    let result = await userLoginService(dataToLogin);
    // if(result.code===0){
    //     alert(result.msg?result.msg:'登录成功')
    // }else{
    //     alert('登录失败')
    // }
    //ElMessage.success(result.msg?result.msg : '登录成功')
    ElMessage.success(result.message)
    tokenStore.setToken(result.data)
    //路由完成跳转
     router.push('/layout')
    }catch{

        ElMessage.error('登录失败');
    }
}

//定义函数，清空数据模型的数据
const clearRegisterData =() =>{
    registerData.value={
        name:'',
        telephone:'',
        email:'',
        password:'',
    //    rePassword:''
    }
}
</script>

<template>
    <el-row class="login-page">
        <el-col :span="12" class="bg"></el-col>
        <el-col :span="6" :offset="3" class="form">
            <!-- 注册表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-if="isRegister" :model="registerData" :rules="rules">
                <el-form-item>
                    <h1>注册</h1>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.name"></el-input>
                </el-form-item>
                <el-form-item prop="telephone">
                    <el-input :prefix-icon="User" placeholder="请输入电话号码" v-model="registerData.telephone"></el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input :prefix-icon="User" placeholder="请输入邮箱" v-model="registerData.email"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item prop="rePassword">
                    <el-input :prefix-icon="Lock" type="password" placeholder="请再次输入密码" v-model="registerData.rePassword"></el-input>
                </el-form-item>
                <!-- 注册按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="register">
                        注册
                    </el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = false;clearRegisterData()">
                        ← 返回
                    </el-link>
                </el-form-item>
            </el-form>
            <!-- 登录表单 -->
            <el-form ref="form" size="large" autocomplete="off" v-else :model="registerData">
                <el-form-item>
                    <h1>登录</h1>
                </el-form-item>
                <el-form-item>
                    <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"></el-input>
                </el-form-item>
                <el-form-item class="flex">
                    <div class="flex">
                        <el-checkbox>记住我</el-checkbox>
                        <el-link type="primary" :underline="false">忘记密码？</el-link>
                    </div>
                </el-form-item>
                <!-- 登录按钮 -->
                <el-form-item>
                    <el-button class="button" type="primary" auto-insert-space @click="login">登录</el-button>
                </el-form-item>
                <el-form-item class="flex">
                    <el-link type="info" :underline="false" @click="isRegister = true;clearRegisterData()">
                        注册 →
                    </el-link>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
    height: 100vh;
    background-color: #fff;

    .bg {
        background: url('@/assets/logo3.png') no-repeat 60% center / 240px auto,
            url('@/assets/login_bg.jpg') no-repeat center / cover;
        border-radius: 0 20px 20px 0;
    }

    .form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        user-select: none;

        .title {
            margin: 0 auto;
        }

        .button {
            width: 100%;
        }

        .flex {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }
    }
}
</style>