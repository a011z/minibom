<template>

  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-header style="height: 50px; font-size: 40px; color: red;">MiniBom</el-header>
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside width="230px" style="border: 1px solid #eee">
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '2']">
              <el-menu-item index="1-1"><router-link to="/layout">Part&BOM管理</router-link></el-menu-item>
              <!-- <el-menu-item index="1-2"><router-link to="/bom">BOM管理</router-link></el-menu-item> -->
              <el-menu-item index="1-2"><router-link to="/attribute" title="属性管理">属性管理</router-link></el-menu-item>
            </el-menu>
          </el-aside>
        </el-aside>


        <!--主栏目-->>
        <el-main style="padding-top: 0px;">



         <!-- 查询表单 -->
         <el-form :inline="true" :model="searchForm" class="demo-form-inline">
              <el-form-item label="按编码查询">
                <el-input v-model="searchForm.partNumber" placeholder="按编码查询"></el-input>
              </el-form-item>
  
              <el-form-item style="margin-left: 100px;" label="按部件名称">
                <el-input v-model="searchForm.partName" placeholder="按部件名称"></el-input>
              </el-form-item>
  
              <el-form-item>
                <el-button type="primary" plain style="margin-left: 50px;" @click="onSubmit">查询</el-button>
                <el-button type="primary" plain style="margin-left: 50px;" @click="showAdd = true">创建</el-button>
              </el-form-item>
            </el-form>

          <!-- 数据表格 -->
          <el-table :data="tableData"  style="margin-top: 0px;">
            <el-table-column prop="partNumber" label="部件编码" width="180"></el-table-column>
            <el-table-column prop="partId" label="Master编码" width="180"></el-table-column>
            <el-table-column prop="partName" label="部件名称" width="160"></el-table-column>
            <el-table-column prop="versionId" label="版本ID" width="200"></el-table-column>
            <el-table-column prop="version" label="版本号" width="80"></el-table-column>
            <el-table-column prop="partType" label="装配模式" width="150"></el-table-column>
            <el-table-column prop="businessCode" label="分类编码" width="200"></el-table-column>
            <el-table-column #default="{ row }" label="操作">
              <!-- 修改的时候同时保存该项id,用于新增子项 -->
              <el-button type="primary" size="mini"
              @click="handleRowClick(row); getParentList(row.partId);getSubPartList(row.versionId);addSubpartModel.sourceId = row.partId;setVersionId(row.versionId);seleteIdForTree(row.partId);">修改</el-button>
              <el-button type="danger" style="margin-left: 10px;" size="mini" @click="deletePart(row)">删除</el-button>
            </el-table-column>
          </el-table>


          <!-- part修改模块 -->
          <el-dialog title="" v-model="dialogFormVisible">
            <el-form :model="form">
              <el-tabs type="border-card">
                <el-tab-pane label="基本属性">
                      <el-collapse v-model="activeNames1" @change="handleChange">
                          <el-collapse-item title="基本属性" name="1">
                              <div class="set">产品：笔记本电脑</div>

                              <el-form-item label="Master编码:" :label-width="formLabelWidth" required>
                                  <el-input v-model="form.partId" autocomplete="false"></el-input>
                                </el-form-item>

                                <el-form-item label="部件编码：" :label-width="formLabelWidth" required>
                                  <el-input v-model="form.partNumber" autocomplete="false"></el-input>
                                </el-form-item>

                              <el-form-item label="部件名称：" :label-width="formLabelWidth" required>
                                  <el-input v-model="form.partName" autocomplete="false"></el-input>
                                </el-form-item>

                                <el-form-item label="来源：" :label-width="formLabelWidth" required>
                                  <el-select v-model="form.partSource" placeholder="请选择">
                                      <el-option
                                        v-for="item in options1"
                                        :key="item.value1"
                                        :label="item.label1"
                                        :value="item.value1">
                                      </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="装配模式：" :label-width="formLabelWidth">
                                  <el-select v-model="form.partType" placeholder="请选择">
                                      <el-option
                                        v-for="item in options2"
                                        :key="item.value2"
                                        :label="item.label2"
                                        :value="item.value2">
                                      </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="分类代码：" :label-width="formLabelWidth" required>
                                  <!-- <el-input v-model="form.businessCode" @blur="Update_getcls($event)" autocomplete="off"></el-input> -->
                                  <el-input v-model="form.businessCode" autocomplete="off"></el-input>
                                </el-form-item>                                   

                          </el-collapse-item>
                      
                          <el-collapse-item title="扩展属性" name="2">
                           
                                <el-form-item v-for="(item, index) in clsData" :key="index" :label="item.name" :label-width="formLabelWidth">
                                  <el-input v-model="item.value" autocomplete="off"></el-input>
                                </el-form-item>
                          </el-collapse-item>
                         
                        </el-collapse>

                  </el-tab-pane>

                <el-tab-pane label="BOM清单">
                  <div>
                    <el-button plain @click="dialogVisible1 = true">新增子项</el-button>

                    <!-- 直接跳转到BOM页面 -->
                    <el-button plain @click="dialogVisible4=true,bomListView()">查看BOM清单</el-button>
                    <el-button plain @click=" dialogVisible3 = true">查看父项</el-button>

                    <!-- 显示该part的子项 -->
                    <el-table :data="subPartModel" style="width: 100%">
                      <el-table-column label="序号" width="100" type="index"> </el-table-column>
                      <el-table-column label="bomLinkId" prop="bomLinkId"></el-table-column>
                      <el-table-column label="编号" prop="targetPartMasterId"></el-table-column>
                      <el-table-column label="名称" prop="targetName"></el-table-column>
                      <el-table-column label="数量" prop="quantity"></el-table-column>
                      <el-table-column label="位号" prop="referenceDesignator"></el-table-column>


                      <el-table-column label="操作" width="100">
                        <template #default="{ row }">
                          <!-- 编辑 -->
                          <el-button :icon="Edit" circle plain type="primary" @click="showDialog(row)"></el-button>
                          <!-- 删除 -->
                          <el-button :icon="Delete" circle plain type="danger" @click="deleteSubPart(row)"></el-button>
                        </template>
                      </el-table-column>
                      <template #empty>
                        <el-empty description="没有数据" />
                      </template>
                    </el-table>


                  </div>
                </el-tab-pane>


                <el-tab-pane label="版本管理"></el-tab-pane>

                <!--新增子项弹窗-->
                <el-dialog v-model="dialogVisible1" title="新增子项" width="70%">
                  <el-form :model="partModel" :rules="rules">
                    <el-form-item label="按编码查询">
                      <el-input v-model="partModel.partNumber" placeholder="按编码查询"></el-input>
                    </el-form-item>
                    <!-- <el-form-item style="margin-left: 100px;" label="按部件名称"> -->
                    <el-form-item label="按部件名称查询">
                      <el-input v-model="partModel.partName" placeholder="按部件名称查询"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" style="margin-left: 50px;" @click="getPartList(partModel.partNumber,partModel.partName)">搜索</el-button>
                      <el-button type="danger" style="margin-left: 50px;">重置</el-button>
                    </el-form-item>
                    <el-table :data="partModel" style="margin-top: 0px;">
                      <el-table-column label="部件编码" prop="partName"></el-table-column>
                      <el-table-column label="Master编码" prop="partId"></el-table-column>
                      <el-table-column label="名称" prop="partName"></el-table-column>
                      <el-table-column label="" width="200">
                        <template #default="{ row }">
                          <!-- 添加选定项 -->
                          <el-button 
                          :class="{'default-style': !row.isActive, 'active-style': row.isActive}"  
                          @click="postTargetId(row)">添加选定项</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>

                  <!-- 编辑BOM信息 -->
                  <div>
                    <h1>
                      BOM信息
                    </h1>
                    <el-form-item label="数量">
                      <el-input v-model="partModel.quantity "></el-input>
                    </el-form-item>
                    <el-form-item label="位号">
                      <el-input v-model="partModel.referenceDesignator "></el-input>
                    </el-form-item>

                  </div>

                  <template #footer>
                    <span class="dialog-footer">
                      <el-button type="primary" @click="addSubpartModel.quantity = partModel.quantity;
                      addSubpartModel.referenceDesignator = partModel.referenceDesignator; addSubpartApi()">确认</el-button>
                      <el-button type="danger" @click="dialogVisible1 = false">取消</el-button>
                    </span>
                  </template>
                </el-dialog>


                <!-- 修改part子项弹窗 -->
                <el-dialog v-model="dialogVisible2" title="修改part子项" width="30%">
                  <el-form :model="subPartModel" label-width="100px" style="padding-right: 30px">
                    <el-form-item label="数量" prop="quantity">
                      <el-input v-model="subPartModel.quantity" minlength="1" maxlength="10"></el-input>
                    </el-form-item>
                    <el-form-item label="位号" prop="referenceDesignator">
                      <el-input v-model="subPartModel.referenceDesignator" minlength="1" maxlength="15"></el-input>
                    </el-form-item>
                  </el-form>
                  <template #footer>
                    <span class="dialog-footer">
                      <el-button @click="dialogVisible2 = false">取消</el-button>
                      <el-button type="primary" @click="updateSubPart"> 确认 </el-button>
                    </span>
                  </template>
                </el-dialog>

                <!-- 查看父项弹窗 -->
                <el-dialog v-model="dialogVisible3" title="查看父项" width="50%">
                  <!-- <el-form :model="parent"> -->
                    <el-table :data="parent" style="width: 100%">
                    <el-table-column label="部件编号" prop="partNumber"></el-table-column>
                    <el-table-column label="名称" prop="partName"></el-table-column>
                    <el-table-column label="Master编号" prop="partId"></el-table-column>
                    <el-table-column label="版本" prop="version"></el-table-column>
                    <el-table-column label="迭代次数" prop="iteration"></el-table-column>
                    <el-table-column label="部件类型" prop="partType"></el-table-column>
                    <el-table-column label="部件来源" prop="partSource"></el-table-column>
                    <el-table-column label="分类属性" prop="clsAttrs"></el-table-column>
                    <el-table-column label="业务编号" prop="businessCode"></el-table-column>
                  </el-table>

                  <!-- </el-form> -->
                </el-dialog>>

                <!-- 查看BOM清单 -->
                 <el-dialog v-model="dialogVisible4" title="查看BOM清单" width="70%">
                  <template #default>
                    <el-table :data="flattenedData" border style="width: 100%">
                      <el-table-column prop="partId" label="Part ID" width="180"></el-table-column>
                      <el-table-column prop="number" label="Number" width="180"></el-table-column>
                      <el-table-column prop="name" label="Name" width="300"></el-table-column>
                      <el-table-column prop="level" label="Level" width="100"></el-table-column>
                    </el-table>
                  </template>
                 </el-dialog>







              </el-tabs>

            </el-form>
            <template v-slot:footer>
              <div class="dialog-footer">
                <el-button @click="undo(form)">取 消</el-button>
                <el-button type="primary" @click="updatePart(form)">提交</el-button>
              </div>
            </template>
          </el-dialog>




          <!-- 创建模块 -->
          <el-dialog v-model="showAdd" title="创建新的部件">
            <el-form :model="addform">
              <el-tabs type="border-card">


                <!--小窗“基本属性”-->
                <el-tab-pane label="基本属性">
                      <el-collapse v-model="activeNames" @change="handleChange">
                          <el-collapse-item title="基本属性" name="1">
                              <div class="set">产品：笔记本电脑</div>
                              <el-form-item label="部件名称：" :label-width="formLabelWidth" required>
                                  <el-input v-model="addform.name" autocomplete="off"></el-input>
                                </el-form-item>

                                <el-form-item label="来源：" :label-width="formLabelWidth" required>
                                  <el-select v-model="addform.partSource" placeholder="请选择">
                                      <el-option
                                        v-for="item in options1"
                                        :key="item.value1"
                                        :label="item.label1"
                                        :value="item.value1">
                                      </el-option>
                                    </el-select>
                                </el-form-item>

                                <el-form-item label="装配模式：" :label-width="formLabelWidth">
                                  <el-select v-model="addform.assemblyMode" placeholder="请选择">
                                      <el-option
                                        v-for="item in options2"
                                        :key="item.value2"
                                        :label="item.label2"
                                        :value="item.value2">
                                      </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="分类代码：" :label-width="formLabelWidth" required>
                                  <el-input v-model="addform.businessCode" @blur="getcls($event)" autocomplete="off"></el-input>
                                </el-form-item>                                   
                          </el-collapse-item>

                          <el-collapse-item title="扩展属性" name="2">                           
                                <el-form-item v-for="(item, index) in clsData" :key="index" :label="item.name" :label-width="formLabelWidth">
                                  <el-input v-model="item.value" autocomplete="off"></el-input>
                                </el-form-item>
                          </el-collapse-item>
                         
                        </el-collapse>

                  </el-tab-pane>







                <!--小窗“版本管理”---->
                <el-tab-pane label="版本管理">
                  版本管理
                </el-tab-pane>
              </el-tabs>
            </el-form>

            <template #footer>
              <el-button @click="showAdd = false">取消</el-button>
              <el-button type="primary" @click="addPart(addform)">提交</el-button>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>







<script lang="ts"  setup>
  import { ref, reactive,onMounted, defineProps,watch } from 'vue';

import BomManage from './bom/BomManage.vue';
import { useRouter } from 'vue-router'
import { ElMessage , ElMessageBox,ElTree} from 'element-plus';
import {
  Edit,
  Delete
} from '@element-plus/icons-vue'
import axios from 'axios';
import request from '@/utils/request.js'


// 初始化状态
 // 初始化状态
 const options1 = ref([
    { value1: 'Make', label1: '制造' },
    { value1: 'Buy', label1: '购买' },
    { value1: 'Buy_SingleSource', label1: '购买-单一供应源' }
  ]);

  const options2 = ref([
    { value2: 'Separable', label2: '可分离' },
    { value2: 'Inseparable', label2: '不可分离' },
    { value2: 'Part', label2: '零件' }
  ]);

  const activeNames = ref(['1']);
  const activeNames1 = ref(['1']);
  const dialogFormVisible = ref(false);
  const showAdd = ref(false);
  const form = reactive({});
  const addform = reactive({});
  const formLabelWidth = ref('120px');
  const tableData = ref([
]);
  const clsData = ref([]);
  const searchForm = reactive({
    partNumber: null,
    partName: null
  });

  onMounted(()=>{
    
  })
  


import { partListService, subPartListService, AddSubpartService, subPartUpdateService, subPartDeleteService,parentListService,bomListService } from '../api/layout';



// 用于新增子项(林翰)

//控制新增子项弹窗
const dialogVisible1 = ref(false)

//控制对当前part的子项进行修改的弹窗

//添加part数据模型
const partModel = ref([
  {
  //   "enCode": 1,
  //   "name": "显示器",
  //   "amount": "1",
  //   "locationTag": "A01",
  }
])
const getPartList = async (partNumber, partName) => {
  let result = await partListService(partNumber, partName);
  partModel.value = result.data;
}
getPartList();

//控制查看父项弹窗
const dialogVisible3 = ref(false)
//定义查看父项的数据模型
const parent =ref([{
  "partId":'',
  "partName":'',
  "partNumber":'',
  "version":'',
  "iteration":'',
  "partType":'',
  "partSource":'',
  "clsAttrs":'',
  "businessCode":''
}
])
//查询父项
const getParentList = async (sonItemId) => {
  let result = await parentListService(sonItemId);
  parent.value = result.data;
}
getParentList();




//1、查看当前part的子项
//定义当前part的子项
const subPartModel = ref([
  {
  //   "enCode": 1,
  //   "name": "显示器",
  //   "amount": "1",
  //   "locationTag": "A01",
  // },
  // {
  //   "enCode": 2,
  //   "name": "键盘",
  //   "amount": "1",
  //   "locationTag": "A02",
  }
])

// 创建一个参数保存versionId
const versionIdState = ref('');
function setVersionId(newId) {
  versionIdState.value = newId;
}


const getSubPartList = async (versionId) => {
  let result = await subPartListService(versionId);
  subPartModel.value = result.data;
}
getSubPartList(versionIdState.value);

//定义变量，控制标题的展示
const title = ref('')

//控制修改part的子项的弹窗
const dialogVisible2 = ref(false)
//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible2.value = true;
  title.value = '编辑part子项'
  //数据拷贝回显
  subPartModel.value.quantity = row.quantity;
  subPartModel.value.referenceDesignator = row.referenceDesignator;

  // 扩展enCode属性，传递给后台，完成编辑的修改
  subPartModel.value.bomLinkId = row.bomLinkId;

}

const updateSubPart = async () => {
  let result = await subPartUpdateService(subPartModel.value);
  ElMessage.success(result.msg ? result.msg : '修改成功')

  dialogVisible2.value = false;
  // // //刷新子项列表
  // getSubPartList(useForUpdateSubPartList.versionId)
  getSubPartList(versionIdState.value);


}



//删除part子项
const deleteSubPart = (row) => {
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
    .then(async () => {
      //调用删除接口
      let result = await subPartDeleteService(row.bomLinkId);
      ElMessage({
        type: 'success',
        message: '删除成功',
      })
      getSubPartList(versionIdState.value);


    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '用户取消了删除',
      })
    })
    

}



//作为新增子项的数据模型(给后端)
const addSubpartModel = ref(
{sourceId: '',//父项编码
  targetId: '',//子项编码
  quantity: '',//数量
  referenceDesignator: ''//位号}
}
)
//添加part校验
const rules = {
  enCode: [
    { required: true, message: '请输入编码', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入部件名称', trigger: 'blur' }
  ]
}


const isActive = ref(false);
//新增子项的数据模型
const postTargetId = (row) => {
  // 切换 isActive 的状态
  row.isActive = !row.isActive;

  if (row.isActive) {
        // 如果按钮变为激活状态，执行添加选中项的逻辑
        addSubpartModel.value.targetId = row.partId; // 获取子项的编号
      } else {
        // 如果按钮变为非激活状态，执行取消选中项的逻辑
        addSubpartModel.value.targetId = null; // 取消选中
      }

  // addSubpartModel.value.targetId = row.partId;//获取子项的编号


}


//调用接口，新增子项
const addSubpartApi = async () => {


  //调用接口
  let result = await AddSubpartService(addSubpartModel.value);
  ElMessage.success(result.message);

  //刷新列表
  getSubPartList(versionIdState.value);
  // getSubPartList();
  dialogVisible1.value = false;

 

}


// 查看BOM清单
//控制查看BOM清单弹窗
const dialogVisible4 = ref(false);





const showQuery = () => {  
    request.post("/part/query", {
      partNumber: (searchForm.partNumber==="")?null:searchForm.partNumber,
      partName: (searchForm.partName==="")?null:searchForm.partName
    }).then((result) => {
      if(result.code === 20041){
        console.log(result);
        tableData.value = result.data;

      }else{

        tableData.value = result.data;
      }

    });

  };

  // 表单提交处理
  const onSubmit = () => {  
    request.post("/part/query", {
      partNumber: (searchForm.partNumber==="")?null:searchForm.partNumber,
      partName: (searchForm.partName==="")?null:searchForm.partName
    }).then((result) => {
      if(result.code === 20041){
        console.log(result);
        tableData.value = result.data;
        ElMessage.success(result.message)
      }else{
        ElMessage.error(result.message)
        tableData.value = result.data;
      }

    });

  };
  onSubmit();
  
  // 添加时查询扩展属性
  const getcls = (e) => {
    console.log(e);
    var businessCode1 = addform.businessCode;
    console.log(businessCode1);
    request.get(`/part/ClassificationNode/getCategoryNodeInfo?id=${businessCode1}`)
      .then((result) => {
        console.log(result);
        clsData.value = result.data;
      });
  };

// 修改时查询扩展属性,不绑定鼠标焦点事件，直接在点击修改后调用
const Update_getcls = async () => {
    // console.log(e);
    var businessCode1 = form.businessCode;
    console.log(businessCode1);
    await request.get(`/part/ClassificationNode/getCategoryNodeInfo?id=${businessCode1}`)
      .then((result) => {
        console.log(result);
        clsData.value = result.data;
      });
  };


  
  // 删除部件
  const deletePart = (row) => {

     ElMessageBox.confirm(
      '你确认要删除该part吗',
      '温馨提示',
      {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
      }
      ).then(async () => {
    console.log(row),
    request.delete(`/part/delete/${row.partId}`)
      .then((result) => {     
        if(result.code === 20021){
          console.log(result);
          tableData.value = result.data;
          ElMessage.success(result.message)
        }else{
        ElMessage.error(result.message)
        tableData.value = result.data;
        }
      }
      ) 
      showQuery();
    }
    )
      .catch(() => {
        ElMessage({
        type: 'info',
        message: '用户取消了删除',
        })
        })
     
      }
  
      //点击修改按钮触发
      const handleRowClick = async(row) => {

    // //调用检出接口
    // request.put("/part/checkout/?id="+row.partId, {
     
    // }).then(async (result) => {
    //   console.log(result);
    //    //显示对话框
    //    dialogFormVisible.value = true;
      
    //   // 自动填充原来的各种属性值
    //   form.partId=row.partId;
    //   form.partNumber=row.partNumber;
    //   form.partName=row.partName;
    //   form.partSource=row.partSource;
    //   form.partType=row.partType;
    //   form.businessCode=row.businessCode;
    //   await Update_getcls();
    //   console.log(row);
    //   let cls = row.clsAttrs;
    //   if(cls != null){
    //     for(let i=0;i < cls.length; i++){
    //       if(cls[i]["Classification"] != null){
    //         // 找到了分类的扩展属性
    //         let extAttrs = cls[i]["Classification"];
    //         // 将扩展属性填到输入框中
    //         for(let key in extAttrs){
    //           for(let j = 0;j < clsData.value.length;j++){
    //             if(clsData.value[j].nameEn == key){
    //               clsData.value[j]["value"] = extAttrs[key];
    //             }
    //           }
    //         }
    //         break;
    //       }
    //     }
    //   }
    //显示对话框
       dialogFormVisible.value = true;
      
      // 自动填充原来的各种属性值
      form.partId=row.partId;
      form.partNumber=row.partNumber;
      form.partName=row.partName;
      form.partSource=row.partSource;
      form.partType=row.partType;
      form.businessCode=row.businessCode;
      await Update_getcls();
      console.log(row);
      let cls = row.clsAttrs;
      if(cls != null){
        for(let i=0;i < cls.length; i++){
          if(cls[i]["Classification"] != null){
            // 找到了分类的扩展属性
            let extAttrs = cls[i]["Classification"];
            // 将扩展属性填到输入框中
            for(let key in extAttrs){
              for(let j = 0;j < clsData.value.length;j++){
                if(clsData.value[j].nameEn == key){
                  clsData.value[j]["value"] = extAttrs[key];
                }
              }
            }
            break;
          }
        }}

    // });
    
    };


// 更新部件
const updatePart =  (row) => {

 //调用checkout
  request.put("/part/checkout?id="+row.partId, {
     
    }).then ( async (result) => {
      console.log(result);
      console.log(158);
      form.partId=row.partId;
      form.partNumber=row.partNumber;
      form.partName=row.partName;
      form.partSource=row.partSource;
      form.partType=row.partType;
      form.businessCode=row.businessCode;
      await Update_getcls();
      console.log(row);
      let cls = row.clsAttrs;
      if(cls != null){
        for(let i=0;i < cls.length; i++){
          if(cls[i]["Classification"] != null){
            // 找到了分类的扩展属性
            let extAttrs = cls[i]["Classification"];
            // 将扩展属性填到输入框中
            for(let key in extAttrs){
              for(let j = 0;j < clsData.value.length;j++){
                if(clsData.value[j].nameEn == key){
                  clsData.value[j]["value"] = extAttrs[key];
                }
              }
            }
            break;
          }}}
     
    });
  


  console.log(row);
    let ret = {};
    clsData.value.forEach(attr => {
      ret[attr.nameEn] = attr.value ?? null;
    });

    //检入
    request.put("/part/updateAndCheckin", {
      masterId: form.partId,
      number: form.partNumber,
      name: form.partName,
      partSource: form.partSource,
      assemblyMode: form.partType,
      clsAttrs: ret,
      clsNumber:form.businessCode
    }).then((result) => {
      console.log(result.message);
      showAdd.value = false;

      if(result.code === 20031){
        console.log(result);
        
        ElMessage.success(result.message)
      }else{
        ElMessage.error(result.message)
        
      }
      dialogFormVisible.value = false;
      // 更新后刷新表格数据
      request.post("/part/query", {
        partNumber: (searchForm.partNumber==="")?null:searchForm.partNumber,
        partName: (searchForm.partName==="")?null:searchForm.partName
      }).then((result) => {
        console.log(result);
        tableData.value = result.data;
      });
    });

  };
  
 //撤销修改
 const undo = (row) => {

  dialogFormVisible.value = false;
/*   request.put("/part/undoCheckout?id="+row.partId, {
     
    }).then((result) => {
      console.log(result);
     

      if(result.code === 60003){
        console.log(result);
        
        ElMessage.success(result.message)
      }else{
        ElMessage.error(result.message)
        
      }
      dialogFormVisible.value = false;
     
    }); */
  

};

  // 添加部件
  const addPart = (row) => {
    console.log(row);
    let ret = {};
    clsData.value.forEach(attr => {
      ret[attr.nameEn] = attr.value ?? null;
    });
    console.log(ret);
  
    request.post("/part/create", {
      name: addform.name,
      partSource: addform.partSource,
      assemblyMode: addform.assemblyMode,
      clsAttrs: ret,
      number: addform.businessCode
    }).then((result) => {
      console.log(result.message);
      showAdd.value = false;

      if(result.code === 20011){
        console.log(result);
        
        ElMessage.success(result.message)
      }else{
        ElMessage.error(result.message)
        
      }
  
      // 添加后刷新表格数据
      request.post("/part/query", {
        partNumber: (searchForm.partNumber==="")?null:searchForm.partNumber,
        partName: (searchForm.partName==="")?null:searchForm.partName
      }).then((result) => {
        console.log(result);
        tableData.value = result.data;
      });
    });
  };


  //跳转至bom页面
const router = useRouter()
const bomList = () => {
  router.push('/bom/bommanage');
}



//查看bom清单

//bom数据
const bomData= ref<Part | null>(null)
const flattenedData = ref<any[]>([]);

//父节点id
const parentId =reactive({
  masterId:null
})

//给父节点赋值
const seleteIdForTree=(partId)=>{
  parentId.masterId=partId;
}

//后端返回bom清单，保存在treedata
const bomListView=async()=>{
  const params = String(parentId.masterId) 
  console.log(params)
  let result=await bomListService(params)

  bomData.value=result.data
  console.log(bomData.value)
  if (bomData.value) {
      flattenedData.value = flattenData(bomData.value);
    }
}

// 定义接口
interface Part {
  partId: string;
  number: string;
  name: string;
  subParts?: Part[];
}

// 展平（扁平化）函数
const flattenData = (data: Part, level = 1): any[] => {
  const flatList = [{ ...data, level }];
  if (data.subParts && data.subParts.length > 0) {
    data.subParts.forEach(subPart => {
      flatList.push(...flattenData(subPart, level + 1));
    });
  }
  return flatList;
};



  </script>



<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}

.set {
  padding: 20px;
}

.set {
  padding: 20px;
}

.default-style {
  background-color: #409eff; /* 蓝色 */
  color: white;
  border-color: #409eff;
}

.active-style {
  background-color: #67c23a; /* 绿色 */
  color: white;
  border-color: #67c23a;
}

</style>

