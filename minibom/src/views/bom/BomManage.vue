<script setup>
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'
import { ref } from 'vue'
const bomList = ref([
    {
        "enCode": 1,
        "name": "显示器",
        "amount": "1",
        "locationTag": "A01",
    },
    {
        "enCode": 2,
        "name": "键盘",
        "amount": "1",
        "locationTag": "A02",
    }
])

const partList = ref([
    {
        "enCode": 1,
        "name": "显示器",
        "amount": "1",
        "locationTag": "A01",
    },
    {
        "enCode": 2,
        "name": "键盘",
        "amount": "1",
        "locationTag": "A02",
    }
])

import { bomManageListService, bomManageAddSubpartService, bomManageUpdateService ,bomManageDeleteService} from '@/api/bom.js'
//声明一个异步函数获取bom清单
const bomManageList = async () => {
    let result = await bomManageListService();
    bomList.value = result.data;
}
bomManageList();

//控制新增子项弹窗
const dialogVisible1 = ref(false)

//控制修改bom弹窗
const dialogVisible2 = ref(false)


//添加part数据模型
const partModel = ref({
    enCode: '',
    name: '',
    amount: '',
    locationTag: ''
})

//添加part校验
const rules = {
    enCode: [
        { required: true, message: '请输入编码', trigger: 'blur' }
    ],
    name: [
        { required: true, message: '请输入部件名称', trigger: 'blur' }
    ]
}


//调用接口，新增子项
import { ElMessage } from 'element-plus'
const addSubpart = async () => {
    //调用接口
    let result = await bomManageAddSubpartService(partModel.value);
    ElMessage.success(result.msg ? result.msg : '新增成功')

    dialogVisible1.value = false;
    //刷新列表
    bomManageList();

}

//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible2.value = true; title.value = '编辑bom'
    //数据拷贝
    partModel.value.amount = row.amount;
    partModel.value.locationTag = row.locationTag;

    // 扩展id属性，传递给后台，完成编辑的修改
    partList.value.enCode = row.enCode;

}

//调用接口，修改Bom
const updateBom = async () => {
    let result = await bomManageUpdateService(partModel.value);
    ElMessage.success(result.msg ? result.msg : '修改成功')

    dialogVisible2.value = false;
    //刷新列表
    bomManageList();


}

import { ElMessageBox } from 'element-plus'
//删除bom
const deleteBom = (row) => {
    //提升用户 确认框
    ElMessageBox.confirm(
        '你确认要删除该bom信息吗',
        '温馨提示',
        {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async() => {
            //调用删除接口
            let result = await bomManageDeleteService(row.enCode);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            bomManageList();

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })

}




</script>
<template>
    <div>
        <el-container style="height: 500px; border: 1px solid #eee">
            <el-header style="height: 50px; font-size: 40px; color: red;">MiniBom</el-header>
            <el-container>
                <!-- 左侧边栏 -->
                <el-aside width="230px" style="border: 1px solid #eee">
                    <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
                        <el-menu :default-openeds="['1', '2']">
                            <el-menu-item index="1-1"><router-link to="/layout">部件管理</router-link></el-menu-item>
                            <el-menu-item index="1-2"><router-link
                                    to="/bom/bommanage">BOM管理</router-link></el-menu-item>
                        </el-menu>
                    </el-aside>
                </el-aside>

                <!--主栏目-->>
                <el-main style="padding-top: 0px;">
                    <el-card class="page-container">
                        <template #header>
                            <div class="header">
                                <span>Bom管理</span>

                                <div class="extra">
                                    <el-button type="primary" @click="dialogVisible1 = true">新增子项</el-button>
                                </div>
                            </div>
                        </template>
                        <el-table :data="bomList" style="width: 100%">
                            <el-table-column label="序号" width="100" type="index"> </el-table-column>
                            <el-table-column label="编号" prop="enCode"></el-table-column>
                            <el-table-column label="名称" prop="name"></el-table-column>
                            <el-table-column label="数量" prop="amount"></el-table-column>
                            <el-table-column label="位号" prop="locationTag"></el-table-column>


                            <el-table-column label="操作" width="100">
                                <template #default="{ row }">
                                    <!-- 编辑 -->
                                    <el-button :icon="Edit" circle plain type="primary" @click="showDialog"></el-button>
                                    <!-- 删除 -->
                                    <el-button :icon="Delete" circle plain type="danger" @click="deleteBom(row)"></el-button>
                                </template>
                            </el-table-column>
                            <template #empty>
                                <el-empty description="没有数据" />
                            </template>
                        </el-table>

                        <!--新增子项弹窗-->
                        <el-dialog v-model="dialogVisible1" title="新增子项" width="70%">
                            <el-form :model="partModel" :rules="rules">
                                <el-form-item label="按编码查询">
                                    <el-input v-model="partModel.enCode" placeholder="按编码查询"></el-input>
                                </el-form-item>
                                <!-- <el-form-item style="margin-left: 100px;" label="按部件名称"> -->
                                <el-form-item label="按部件名称查询">
                                    <el-input v-model="partModel.name" placeholder="按部件名称查询"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" style="margin-left: 50px;">搜索</el-button>
                                    <el-button type="danger" style="margin-left: 50px;">重置</el-button>
                                </el-form-item>
                                <el-table :data="partList" style="margin-top: 0px;">
                                    <el-table-column label="编号" prop="enCode"></el-table-column>
                                    <el-table-column label="名称" prop="name"></el-table-column>
                                    <el-table-column label="数量" prop="amount"></el-table-column>
                                    <el-table-column label="位号" prop="locationTag"></el-table-column>
                                    <el-table-column prop="businessCode" label="" width="200"></el-table-column>
                                </el-table>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button type="primary" @click="addSubpart">确认</el-button>
                                    <el-button type="danger" @click="dialogVisible1 = false">取消</el-button>
                                </span>
                            </template>
                        </el-dialog>

                        <!-- 修改bom弹窗 -->
                        <el-dialog v-model="dialogVisible2" title="修改bom" width="30%">
                            <el-form :model="partModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                                <el-form-item label="数量" prop="amount">
                                    <el-input v-model="partModel.amount" minlength="1" maxlength="10"></el-input>
                                </el-form-item>
                                <el-form-item label="位号" prop="locationTag">
                                    <el-input v-model="partModel.locationTag" minlength="1" maxlength="15"></el-input>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="dialogVisible2 = false">取消</el-button>
                                    <el-button type="primary" @click="updateBom"> 确认 </el-button>
                                </span>
                            </template>
                        </el-dialog>




                    </el-card>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style lang="scss" scoped>
.page-container {
    min-height: 100%;
    box-sizing: border-box;

    .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
}
</style>