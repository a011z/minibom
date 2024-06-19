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
                  <!-- <template #default="{ row }">
                  <el-button @click="AttributeView(row) ;ViewPage=true"><el-icon><View /></el-icon></el-button>
                </template> -->
                <el-button @click="ViewPage=true"><el-icon><View /></el-icon></el-button>
                </el-table-column>
                <el-table-column label="操作" >
                  <template #default="{ row }">
                    <el-button @click="AttributeEdit(row)"><el-icon><Edit /></el-icon></el-button>
                    <el-button @click="AttributeDelete(row)"><el-icon><Delete /></el-icon></el-button>
                  </template>
                </el-table-column> 
               </el-table>
               <!-- 属性分类信息 -->
               <el-dialog v-model="ViewPage" title="属性所在分类信息" width="50%" >
                <el-table :data ="AttributaModel">
                <el-table-column prop="businessCode" label="分类码" width="200"></el-table-column> 
                <el-table-column prop="name" label="属性中文名称" width="200"></el-table-column>
                <el-table-column prop="nameEn" label="属性英文名称" width="200"></el-table-column>
                <el-table-column prop="folder.name" label="分类中文名称" width="200"></el-table-column>
                <el-table-column prop="folder.nameEn" label="分类英文名称" width="200"></el-table-column>
                </el-table>
               </el-dialog>
               <!-- 创建窗口 -->
               <el-dialog v-model="EditPage" title="添加属性" >
                <el-form :model="AttributaModel"  >
                  <el-form-item label="中文名称" prop="name">
                    <el-input v-model="AttributaModel.name" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="英文名称" prop="nameEn">
                    <el-input v-model="AttributaModel.nameEn" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="中文描述" prop="description">
                    <el-input v-model="AttributaModel.description" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="英文描述" prop="descriptionEn">
                    <el-input v-model="AttributaModel.descriptionEn" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="数据类型" prop="type">
                    <el-input v-model="AttributaModel.type" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="属性类型" prop="category">
                    <el-input v-model="AttributaModel.category" >
                    </el-input>
                  </el-form-item>
                  <el-form-item label="属性状态" prop="disableFlag">
                    <el-input v-model="AttributaModel.disableFlag" >
                    </el-input>
                  </el-form-item>
                </el-form>   
                 <template #footer>
                  <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary"> 确认 </el-button>
                  </span>
                </template>
               </el-dialog>
  

               
          </el-main>
        </el-container>
      </el-container>
  </div>
  </template>
  <script setup>
  
  import { reactive ,ref} from "vue";
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



  const AttributaModel=ref({
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
//属性分类窗口
  const ViewPage=ref(false)
  //属性编辑窗口
  const EditPage=ref(false)



  import { AttributeSearchService }from "@/api/attributeAPI.js"
  //属性搜索
  const AttributeSearch= async()=>{
    const params = searchForm.name;
    let result= await AttributeSearchService(params);
    tableData.value=result.data;
  }


  //提取当前行的name用于后续的修改与删除
  const updateCategoryEcho = (row) => {

    EditPage.value = true;
    //将row中的数据赋值给AttributeModel
    AttributaModel.value.name=row.categoryName;

}
  //某一行属性所在分类查看
    const AttributeView=async()=>{
      const params=AttributaModel.value.name;
      AttributaModel.value.name="";
      let result=await AttributeSearchService(params);
      AttributaModel.value=result.data;


}
  //属性更改
  const AttributeEdit=async()=>{

  }

  //属性删除
  const AttributeDelete=async()=>{

}


  
  </script>
  