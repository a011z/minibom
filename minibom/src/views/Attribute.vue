<template>
  <div>
    <el-container style="height: 500px; border: 1px solid #eee">
      <el-header style="height: 50px; font-size: 40px; color: red"
        >MiniBom</el-header
      >
      <el-container>
        <!-- 左侧边栏 -->
        <el-aside width="230px" style="border: 1px solid #eee">
          <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
            <el-menu :default-openeds="['1', '2']">
              <el-menu-item index="1-1"
                ><router-link to="/layout"
                  >Part&BOM管理</router-link
                ></el-menu-item
              >
              <!-- <el-menu-item index="1-2"><router-link to="/bom">BOM管理</router-link></el-menu-item> -->
              <el-menu-item index="1-2"
                ><router-link to="/attribute"
                  >属性管理</router-link
                ></el-menu-item
              >
            </el-menu>
          </el-aside>
        </el-aside>
        <el-main style="padding-top: 0px">
          <!-- 查询表单 -->
          <div>
            <el-radio-group v-model="selectedType">
              <el-radio :label="'category'">分类信息查询</el-radio>
              <el-input
                v-model="CategoryForm.nameOrCode"
                placeholder="请输入关键字"
                style="width: 300px; margin-left: 1px"
                :disabled="selectedType !== 'category'"
              ></el-input>
              <el-radio :label="'attribute'" style="margin-left: 100px"
                >属性信息查询</el-radio
              >
              <el-input
                v-model="AttributeForm.name"
                placeholder="请输入关键字"
                style="width: 300px"
                :disabled="selectedType !== 'attribute'"
              ></el-input>
            </el-radio-group>
            <el-button
              type="primary"
              @click="handleSearch"
              style="margin-left: 10px"
              >查询</el-button
            >
            <el-button
              type="primary"
              plain
              style="margin-left: 50px"
              @click="handleCreate"
              >创建</el-button
            >
          </div>

          <!-- <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="属性信息查询">
                  <el-input v-model="searchForm.name" placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" plain style="margin-left: 50px;" @click="AttributeSearch">查询</el-button>
                  <el-button type="primary" plain style="margin-left: 50px;" @click="CreatePage=true">创建</el-button>
                </el-form-item>
              </el-form> -->

          <!-- 属性表单 -->
          <div v-if="selectedType === 'attribute'">
            <el-table :data="attributeTable" style="border: 1 px">
              <el-table-column
                prop="name"
                label="属性中文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="nameEn"
                label="属性英文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="中文描述"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="descriptionEn"
                label="英文描述"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="category"
                label="数据类型"
                width="200"
              ></el-table-column>
              <el-table-column label="查看属性所在分类">
                <template #default="{ row }">
                  <el-button @click="(ViewPage = true), AttributeView(row)"
                    ><el-icon><View /></el-icon
                  ></el-button>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button @click="AttributeUpdateEcho(row)"
                    ><el-icon><Edit /></el-icon
                  ></el-button>
                  <el-button @click="AttributeDelete(row)"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 属性分类信息 -->
            <el-table :data="ViewModel">
              <el-table-column
                prop="folder.businessCode"
                label="分类码"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="name"
                label="属性中文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="nameEn"
                label="属性英文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="folder.name"
                label="分类中文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="folder.nameEn"
                label="分类英文名称"
                width="200"
              ></el-table-column>
            </el-table>
          </div>

          <!-- 分类表单 -->
          <div v-if="selectedType === 'category'">
            <el-table :data="categoryTable" style="border: 1 px">
              <el-table-column prop="id" label="分类编码" width="200">
                <template #default="{ row }">
                  <el-button type="link" @click="() => openDialog(row, 'id')">{{
                    row.businessCode
                  }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="分类中文名称" width="200">
                <template #default="{ row }">
                  <el-button
                    type="link"
                    @click="() => openDialog(row, 'name')"
                    >{{ row.name }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column
                prop="nameEn"
                label="分类英文名称"
                width="200"
              ></el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button @click="CategoryUpdateEcho(row)"
                    ><el-icon><Edit /></el-icon
                  ></el-button>
                  <el-button @click="CategoryDelete(row)"
                    ><el-icon><Delete /></el-icon
                  ></el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- 分类属性信息 -->
          <el-dialog v-model="categoryDialog" width="1000" @close="closeDialog">
            <h3>父节点分类信息</h3>
            <div class="category-info">
              <div
                v-for="[key, value] in Object.entries(categoryDetail)"
                :key="key"
                title="查看分类"
                class="category-item"
              >
                <span class="category-key">{{ key }}:</span>
                <span class="category-value">{{ value }}</span>
              </div>
            </div>

            <h3>属性信息</h3>
            <el-table
              :data="categoryDetailTable"
              title="属性信息"
              class="category-table"
            >
              <el-table-column
                prop="name"
                label="属性中文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="nameEn"
                label="属性英文名称"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="description"
                label="中文描述"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="descriptionEn"
                label="英文描述"
                width="200"
              ></el-table-column>
              <el-table-column prop="type" label="数据类型"></el-table-column>
            </el-table>
          </el-dialog>

          <!-- 创建窗口 -->
          <el-dialog v-model="CreatePage" title="添加属性">
            <el-form :model="AttributeModel" label-width="120px">
              <el-form-item label="中文名称" required>
                <el-input v-model="AttributeModel.name"> </el-input>
              </el-form-item>
              <el-form-item label="英文名称" required>
                <el-input v-model="AttributeModel.nameEn"> </el-input>
              </el-form-item>
              <el-form-item label="中文描述" required>
                <el-input v-model="AttributeModel.description"> </el-input>
              </el-form-item>
              <el-form-item label="英文描述">
                <el-input v-model="AttributeModel.descriptionEn"> </el-input>
              </el-form-item>
              <el-form-item label="数据类型" required>
                <el-select
                  v-model="AttributeModel.type"
                  placeholder="请选择数据类型"
                  filterable
                >
                  <el-option label="字符型" value="STRING"></el-option>
                  <el-option label="整数型" value="INTEGER"></el-option>
                  <el-option label="实数型" value="DECIMAL"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性类型">
                <el-input v-model="AttributeModel.category"> </el-input>
              </el-form-item>
              <el-form-item label="属性状态">
                <el-select
                  v-model="AttributeModel.disableFlag"
                  placeholder="请选择属性状态"
                  filterable
                >
                  <el-option label="有效" value="true"></el-option>
                  <el-option label="失效" value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="CreatePage = false">取消</el-button>
                <el-button type="primary" @click="AttributeCreate">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>

          <!-- 属性修改窗口 -->
          <el-dialog v-model="UpdatePage" title="属性修改">
            <el-form :model="UpdateModel">
              <el-form-item label="中文描述" prop="description">
                <el-input v-model="UpdateModel.description"></el-input>
              </el-form-item>
              <el-form-item label="英文描述" prop="descriptioEn">
                <el-input v-model="UpdateModel.descriptionEn"></el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <span class="dialog-footer">
                <el-button @click="UpdatePage = false">取消</el-button>
                <el-button type="primary" @click="AttributeUpdate">
                  确认
                </el-button>
              </span>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
  <script setup>
import { reactive, ref, computed } from "vue";
//属性搜索栏输入
const AttributeForm = reactive({
  name: "",
});
//表单
const attributeTable = ref([]);

//创建用模型
const AttributeModel = ref({
  id: null,
  name: null,
  nameEn: null,
  description: null,
  descriptionEn: null,
  businessCode: null,
  category: "拓展属性",
  type: null,
  disableFlag: null,
  folder: {
    businessCode: null,
    name: null,
    nameEn: null,
  },
});

//更新用模型
const UpdateModel = ref({
  id: "",
  description: "",
  descriptionEn: "",
});

//属性查看分类模型
const ViewModel = ref([]);

//属性创建窗口
const CreatePage = ref(false);
//属性分类窗口
const ViewPage = ref(false);
//属性编辑窗口
const UpdatePage = ref(false);

import {
  AttributeSearchService,
  AttributeCreateService,
  AttributeUpdateService,
  AttributeDeleteService,
  CategoryDetailService,
  CategorySearchService,
} from "@/api/attributeAPI.js";
import { ElMessage, ElMessageBox } from "element-plus";

//属性搜索
const AttributeSearch = async () => {
  const params = String(AttributeForm.name); // 确保将 name 转为字符串

  console.log(params);
  // 将 params 对象转为查询字符串

  let result =
    params === ""
      ? await AttributeSearchService(null)
      : await AttributeSearchService(params);
  console.log(result.data);
  attributeTable.value = result.data;
};
//获取所有属性
const getAllAttribute = async () => {
  let result = await AttributeSearchService(null);
  attributeTable.value = result.data;
};
getAllAttribute();

//某一行属性所在分类查看
const AttributeView = async (row) => {
  let result = await AttributeSearchService(row.name);
  ViewModel.value = result.data;
};
//属性创建
const AttributeCreate=async()=>{
  let result=await AttributeCreateService(AttributeModel.value);
  CreatePage.value=false;
  if(result.code===59999){
  ElMessage.error(result.message);
  }else{
    ElMessage.success(result.message);
  }
  getAllAttribute();
};

//属性删除
const AttributeDelete = (row) => {
  ElMessageBox.confirm("你确认删除该分类信息吗？", "温馨提示", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log(row.id);
      // 将单个字符串 id 转换为字符串数组
      const idArray = [row.id];
      console.log(idArray); // 打印出转换后的字符串数组
      //用户点击了确认
      let result = await AttributeDeleteService(idArray);
      ElMessage.success(result.message ? result.message : "删除成功");
      //再次调用getAllCategory，获取所有文章分类
      getAllAttribute();
    })
    .catch(() => {
      //用户点击了取消
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};

// 记录当前选中的类型
const selectedType = ref("category");

// 分类信息搜索
const CategoryForm = reactive({
  nameOrCode: "",
});
//分类表单
const categoryTable = ref([]);
//分类细节
const categoryDetail = ref({});
//分类属性数组
const categoryDetailTable = ref([]);

//分类属性表单
const categoryDialog = ref(false);

// 查询按钮的处理函数
const handleSearch = () => {
  if (selectedType.value === "category") {
    // 执行分类信息查询的逻辑
    console.log("分类信息查询关键字:", CategoryForm.nameOrCode);
    CategorySearch();
  } else if (selectedType.value === "attribute") {
    // 执行属性信息查询的逻辑
    console.log("属性信息查询关键字:", AttributeForm.name);
    AttributeSearch();
  }
};
//创建按钮的处理函数
const handleCreate = () => {
  if (selectedType.value === "attribute") {
    CreatePage.value = true;
  }
};

//分类查询
const CategorySearch = async () => {
  const params = String(CategoryForm.nameOrCode); // 确保将 name 转为字符串
  console.log(params);
  // 将 params 对象转为查询字符串

  let result =
    params === ""
      ? await CategorySearchService(null)
      : await CategorySearchService(params);
  console.log(result.data);
  categoryTable.value = result.data;
};
//获取所有属性
const getAllCategory = async () => {
  let result = await CategorySearchService(null);
  categoryTable.value = result.data;
};
getAllCategory();

const selectedRow = ref();
// 打开弹窗的方法
const openDialog = (row, type) => {
  if (type === "id" || type === "name") {
    selectedRow.value = row.id;
    console.log(selectedRow.value);
    CategoryDetailSearch();
    categoryDialog.value = true;
  }
};

const closeDialog = () => {
  categoryDetail.value = {};
  categoryDetailTable.value = [];
};

//分类详细查询
const CategoryDetailSearch = async () => {
  let result = await CategoryDetailService(selectedRow.value);
  console.log(result.data);
  if (result.data.parentNode != null) {
    categoryDetail.value = result.data.parentNode;
  }
  console.log(categoryDetail.value);
  categoryDetailTable.value = result.data.attrs;
};
</script>

<style scoped>
.category-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px 20px;
  align-items: center;
  margin-top: 1px;
}

.category-item {
  display: contents; /* 使用 display: contents 使得直接子元素被直接放入网格 */
}

.category-key {
  font-weight: bold;
  text-align: left; /* 右对齐 */
}

.category-value {
  text-align: left; /* 左对齐 */
}
</style> 
  