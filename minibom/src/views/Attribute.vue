<template>
  <div>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-header style="height: 50px; font-size: 40px; color: red;">MiniBom</el-header>
        <el-container>
          <!-- 左侧边栏 -->
          <el-aside width="230px" style="border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu :default-openeds="['1', '2']">
                <el-menu-item index="1-1"><router-link to="/part">部件管理</router-link></el-menu-item>
                <el-menu-item index="1-2"><router-link to="/bom">BOM管理</router-link></el-menu-item>
                <el-menu-item index="1-3"><router-link to="/attribute" >属性管理</router-link></el-menu-item>
              </el-menu>
            </el-aside>
          </el-aside>
          <el-main style="padding-top: 0px;">
              <!-- 查询表单 -->
              <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="属性信息查询">
                  <el-input v-model="searchForm.attribute" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain style="margin-left: 50px;" @click="AttributeSearch">查询</el-button>
                  <el-button type="primary" plain style="margin-left: 50px;" @click="AttributeCreate">创建</el-button>
                </el-form-item>
              </el-form>
              <!-- 属性表单 -->
              <el-table :data="tableData" border style="margin-top: 0px;">
                <el-table-column prop="name" label="属性中文名称" width="200"></el-table-column>
                <el-table-column prop="nameEn" label="属性英文名称" width="200"></el-table-column>
                <el-table-column prop="description " label="中文描述" width="200"></el-table-column>
                <el-table-column prop="descriptionEn" label="英文描述" width="200"></el-table-column>
                <el-table-column prop="catagory" label="数据类型" width="200"></el-table-column> 
                
                <el-table-column label="查看属性所在分类">
                  <template #default="{ row }">
                <el-button @click="ViewPage=true,AttributeView(row)"><el-icon><View /></el-icon></el-button>
              </template>
                </el-table-column>
                <el-table-column label="操作" >
                  <template #default="{ row }">
                    <el-button @click="AttributeUpdateEcho(row)"><el-icon><Edit /></el-icon></el-button>
                    <el-button @click="AttributeDelete(row)"><el-icon><Delete /></el-icon></el-button>
                  </template>
                </el-table-column> 
               </el-table>
               <!-- 属性分类信息 -->
               <el-dialog v-model="ViewPage" title="属性所在分类信息" width="50%" >
                <div v-for="item in ViewModel" :key="item.key" class="attribute-item">
                  <span>{{ item.label }}:</span> 
                  <span>{{ item.value }}</span>
                </div>
               </el-dialog>
               <!-- 创建窗口 -->
               <el-dialog v-model="CreatePage" title="添加属性" >
                <el-form :model="AttributeModel"  >
                  <el-form-item label="中文名称" prop="name" required>
                    <el-input v-model="AttributeModel.name" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="英文名称" prop="nameEn" required>
                    <el-input v-model="AttributeModel.nameEn" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="中文描述" prop="description" required>
                    <el-input v-model="AttributeModel.description" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="英文描述" prop="descriptionEn" required>
                    <el-input v-model="AttributeModel.descriptionEn" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="数据类型" prop="type" required>
                    <el-input v-model="AttributeModel.type" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="属性类型" prop="category" required>
                    <el-input v-model="AttributeModel.category" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="属性状态" prop="disableFlag" required>
                    <el-input v-model="AttributeModel.disableFlag" >
                    </el-input>
                  </el-form-item>
                </el-form>   
                 <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary"> 确认 </el-button>
                  </span>
                </template>
                <!-- 属性修改窗口 -->
               </el-dialog>
               
               <el-dialog>



               </el-dialog>
  

               
          </el-main>
        </el-container>
      </el-container>
  </div>
  </template>
  <script setup>
  
  import { reactive ,ref,computed} from "vue";
  //搜索栏输入
  const searchForm=reactive({
       name:null
  });
//表单
  const tableData=reactive([
    {
      "id":123456,
      "name":"品牌",
      "nameEn":"Brand",
      "description":"",
      "descriptionEn":"",
      "businessCode":"",
      "category":"",
      folder:{
        "businessCode":"FL00000001",
        "name":"默认目录",
        "nameEn":"DefaultDictionary"
      },
      "disableFlag":"",
      "type":"STRING"
    }
  ])



  //创建用模型
  const AttributeModel=ref({
    id:'',
    name:'',
    nameEn:'',
    description:'',
    descriptionEn:'',
    businessCode:'',
    category:'',
    type:'',
    folder:{
      businessCode:'',
      name:'',
      nameEn:''
    }
  })
  //更新用模型
  const UpdateModel=ref({
    id:'',
    description:'',
    descriptionEn:''

  })
  //属性查看分类模型
// 用于存储被点击行的响应式引用
const selectedRow = ref(null);
// 计算属性，用于获取特定的属性值
const ViewModel = computed(() => {
  if (!selectedRow.value) return [];
  const { name, nameEn, folder } = selectedRow.value;
  return [
    { key: 'name', label: '属性中文名称', value: name },
    { key: 'nameEn', label: '属性英文名称', value: nameEn },
    { key: 'folderName', label: '分类中文名称', value: folder.name },
    { key: 'folderNameEn', label: '分类英文名称', value: folder.nameEn },
    { key: 'folderBusinessCode', label: '分类码', value: folder.businessCode }
  ];
});

//属性创建窗口
const CreatePage=ref(false)
//属性分类窗口
  const ViewPage=ref(false)
  //属性编辑窗口
  const UpdatePage=ref(false)



  import { AttributeSearchService,AttributeCreateService,AttributeUpdateService,AttributeDeleteService }from "@/api/attributeAPI.js"
import { ElMessage } from "element-plus";
  //属性搜索
  const AttributeSearch= async()=>{
    const params = searchForm.name;
    let result= await AttributeSearchService(params);
    tableData.value=result.data;
  }


  //某一行属性所在分类查看
    const AttributeView=(row)=>{
      selectedRow.value = row; // 将点击的行数据赋值给 selectedRow




}
//属性创建
const AttributeCreate=async()=>{
  let result=await AttributeCreateService(AttributeModel.value);
  ElMessage(result.message)




}
//属性回显
const AttributeUpdateEcho=(row)=>{
  UpdateModel.id=row.value.id
  UpdateModel.description=row.value.description
  UpdateModel.descriptionEn=row.value.descriptionEn




}
  //属性更改
  const AttributeUpdate=async()=>{
    let result=await AttributeUpdateService(UpdateModel.value);
    ElMessage(result.message)

  }

  //属性删除
  const AttributeDelete=async()=>{

}


  
  </script>
  