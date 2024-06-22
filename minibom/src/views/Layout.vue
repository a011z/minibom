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
                <el-menu-item index="1-2"><router-link to="/bom">BOM管理</router-link></el-menu-item>
                <el-menu-item index="1-3"><router-link to="/attribute" title="属性管理">属性管理</router-link></el-menu-item>
              </el-menu>
            </el-aside>
          </el-aside>
  
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
  
<!--展示查询结果-->
          <el-table :data="tableData"  style="margin-top: 0px;">
            <el-table-column prop="partNumber" label="部件编码" width="180"></el-table-column>
            <el-table-column prop="partId" label="Master编码" width="180"></el-table-column>
            <el-table-column prop="partName" label="部件名称" width="160"></el-table-column>
            <el-table-column prop="versionId" label="版本ID" width="200"></el-table-column>
            <el-table-column prop="version" label="版本号" width="80"></el-table-column>
            <el-table-column prop="partType" label="装配模式" width="150"></el-table-column>
            <el-table-column prop="businessCode" label="分类编码" width="200"></el-table-column>
            <el-table-column #default="{row}" label="操作">
              <el-button type="primary" size="mini" @click="handleRowClick(row)">修改</el-button>
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

                              <el-form-item label="Master编码：" :label-width="formLabelWidth" required>
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

                  <el-tab-pane label="BOM清单">BOM清单</el-tab-pane>
                  <el-tab-pane label="版本管理">版本管理</el-tab-pane>
                  
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
            <el-dialog v-model ="showAdd" title="创建新的部件">
              <el-form :model="addform">
                <el-tabs type="border-card">
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


                  <el-tab-pane label="BOM清单">
                    <div>
                      <el-button plain @click="subPart = true">新增子项</el-button>
                      <el-button plain >查看BOM清单</el-button>
                      <el-button plain>查看父项</el-button>
                    </div>
                    <!--新增子项弹窗-->
                    <el-dialog v-model="subPart" title="添加部件" width="70%">
                      <el-form :model="searchForm">
                        <el-form-item label="按编码查询">
                          <el-input v-model="searchForm.partNumber" placeholder="按编码查询"></el-input>
                        </el-form-item>
                        <!-- <el-form-item style="margin-left: 100px;" label="按部件名称"> -->
                        <el-form-item  label="按部件名称">
                          <el-input v-model="searchForm.partName" placeholder="按部件名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                          <el-button type="primary" style="margin-left: 50px;" >搜索</el-button>
                          <el-button type="danger" style="margin-left: 50px;">重置</el-button>
                        </el-form-item>
                        <el-table :data="tableData"  style="margin-top: 0px;">
                          <el-table-column prop="partNumber" label="编码" width="200"></el-table-column>
                          <el-table-column prop="partName" label="名称" width="200"></el-table-column>
                          <el-table-column prop="version" label="数量" width="200"></el-table-column>
                          <el-table-column prop="partType" label="位号" width="200"></el-table-column>
                          <el-table-column prop="businessCode" label="" width="200"></el-table-column>
                        </el-table>
                      </el-form>
                      <template #footer>
                        <span class= "dialog-footer">
                          <el-button plain>确认</el-button>
                          <el-button type="danger" @click="subPart =false">取消</el-button>
                        </span>
                      </template>

                    </el-dialog>



                    

                  </el-tab-pane>
                  <!-- <el-tab-pane label="版本管理">
                    <el-form :model="versionSearch">
                      <el-form-item label="按编码查询">
                          <el-input v-model="versionSearch.partId" placeholder="按编码查询"></el-input>
                        </el-form-item>
                    </el-form>
                    <el-form-item>
                          <el-button type="primary" style="margin-left: 50px;" @click="SeachVersionById">搜索</el-button>
                          <el-button type="danger" style="margin-left: 50px;">重置</el-button>
                        </el-form-item>
                    <el-table :data="versiontable"  style="margin-top: 0px;">
                          <el-table-column prop="partId" label="编码" width="200"></el-table-column>
                          <el-table-column prop="partNumber" label="part号码" width="200"></el-table-column>
                          <el-table-column prop="versionId" label="版本Id" width="200"></el-table-column>
                          <el-table-column prop="version" label="版本" width="200"></el-table-column>
                          <el-table-column prop="name" label="名称" width="200"></el-table-column>
                        </el-table>

                  </el-tab-pane> -->
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
  
  <script setup>
  import { ref, reactive,onMounted } from 'vue';
  import axios from 'axios';
  import request from '@/utils/request.js'
  import { ElMessage , ElMessageBox} from 'element-plus';
  
  
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
      const handleRowClick = (row) => {

    //调用检出接口
    request.put("/part/checkout/?id="+row.partId, {
     
    }).then(async (result) => {
      console.log(result);
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
        }
      }
      
      

    });
    
    };


// 更新部件
const updatePart = (row) => {

 
  console.log(row);
    let ret = {};
    clsData.value.forEach(attr => {
      ret[attr.nameEn] = attr.value ?? null;
    });

    
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
  request.put("/part/undoCheckout?id="+row.partId, {
     
    }).then((result) => {
      console.log(result);
     

      if(result.code === 60003){
        console.log(result);
        
        ElMessage.success(result.message)
      }else{
        ElMessage.error(result.message)
        
      }
      dialogFormVisible.value = false;
     
    });
  

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
  </script>
  

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}

.set {
  padding: 20px;
}

</style>

