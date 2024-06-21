
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
              <el-menu-item index="1-2"><router-link to="/bom/bommanage">BOM管理</router-link></el-menu-item>
              <el-menu-item index="1-3"><router-link to="/attribute" title="属性管理">属性管理</router-link></el-menu-item>
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
              <el-button type="danger" plain style="margin-left: 50px;" @click="showAdd = true">创建</el-button>
            </el-form-item>
          </el-form>

          <!-- 数据表格 -->
          <el-table :data="tableData" border style="margin-top: 0px;">
            <el-table-column prop="partNumber" label="部件编码" width="200"></el-table-column>
            <el-table-column prop="partName" label="部件名称" width="200"></el-table-column>
            <el-table-column prop="version" label="版本号" width="200"></el-table-column>
            <el-table-column prop="partType" label="装配模式" width="200"></el-table-column>
            <el-table-column prop="businessCode" label="分类编码" width="200"></el-table-column>
            <el-table-column #default="{ row }" label="操作">
              <!-- 修改的时候同时保存该项id,用于新增子项 -->
              <el-button type="primary" size="mini" @click="dialogFormVisible = true; form = row;addSubpartModel.sourceId = row.partNumber">修改</el-button>
              <el-button type="danger" style="margin-left: 10px;" size="mini" @click="DeletePart(row)">删除</el-button>
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
                      <el-form-item label="部件名称：" :label-width="formLabelWidth" required>
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                      </el-form-item>

                      <el-form-item label="来源：" :label-width="formLabelWidth" required>
                        <el-select v-model="form.partSource" placeholder="请选择">
                          <el-option v-for="item in options1" :key="item.value1" :label="item.label1"
                            :value="item.value1">
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="装配模式：" :label-width="formLabelWidth">
                        <el-select v-model="form.assemblyMode" placeholder="请选择">
                          <el-option v-for="item in options2" :key="item.value2" :label="item.label2"
                            :value="item.value2">
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <el-form-item label="分类代码：" :label-width="formLabelWidth" required>
                        <el-input v-model="form.number" @blur="getcls($event)" autocomplete="off"></el-input>
                      </el-form-item>

                    </el-collapse-item>

                    <el-collapse-item title="扩展属性" name="2">

                      <el-form-item v-for="(item, index) in clsData" :key="index" :label="item.name"
                        :label-width="formLabelWidth">
                        <el-input v-model="item.value" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-collapse-item>

                  </el-collapse>

                </el-tab-pane>

                <el-tab-pane label="BOM清单">
                  <div>
                    <el-button plain @click="dialogVisible1=true">新增子项</el-button>

                    <!-- 直接跳转到BOM页面 -->
                    <el-button plain @click="bomList">查看BOM清单</el-button>
                    <el-button plain @click="getParent">查看父项</el-button>

                    <!-- 显示该part的子项 -->
                    <el-table :data="subPartModel" style="width: 100%">
                            <el-table-column label="序号" width="100" type="index"> </el-table-column>
                            <el-table-column label="编号" prop="enCode"></el-table-column>
                            <el-table-column label="名称" prop="name"></el-table-column>
                            <el-table-column label="数量" prop="amount"></el-table-column>
                            <el-table-column label="位号" prop="locationTag"></el-table-column>


                            <el-table-column label="操作" width="100">
                                <template #default="{ row }">
                                    <!-- 编辑 -->
                                    <el-button :icon="Edit" circle plain type="primary"
                                        @click="showDialog(row)"></el-button>
                                    <!-- 删除 -->
                                    <el-button :icon="Delete" circle plain type="danger"
                                        @click="deleteSubPart(row)"></el-button>
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
                      <el-input v-model="partModel.enCode" placeholder="按编码查询"></el-input>
                    </el-form-item>
                    <!-- <el-form-item style="margin-left: 100px;" label="按部件名称"> -->
                    <el-form-item label="按部件名称查询">
                      <el-input v-model="partModel.name" placeholder="按部件名称查询"></el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" style="margin-left: 50px;" @click="getPartList">搜索</el-button>
                      <el-button type="danger" style="margin-left: 50px;">重置</el-button>
                    </el-form-item>
                    <el-table :data="partModel" style="margin-top: 0px;">
                      <el-table-column label="编号" prop="enCode"></el-table-column>
                      <el-table-column label="名称" prop="name"></el-table-column>
                      <el-table-column label="数量" prop="amount"></el-table-column>
                      <el-table-column label="位号" prop="locationTag"></el-table-column>
                      <el-table-column label="" width="200">
                        <template #default="{ row }">
                          <!-- 添加选定项 -->
                          <el-button @click="postTargetId(row)">添加选定项</el-button>
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
                      <el-input v-model="partModel.amount"></el-input>
                    </el-form-item>
                    <el-form-item label="位号">
                      <el-input v-model="partModel.locationTag"></el-input>
                    </el-form-item>

                  </div>

                  <template #footer>
                    <span class="dialog-footer">
                      <el-button type="primary" @click="addSubpartModel.quantity=partModel.amount;
                      addSubpartModel.referenceDesignator=partModel.locationTag;addSubpartApi">确认</el-button>
                      <el-button type="danger" @click="dialogVisible1 = false">取消</el-button>
                    </span>
                  </template>
                </el-dialog>


                 <!-- 修改part子项弹窗 -->
                 <el-dialog v-model="dialogVisible2" title="修改part子项" width="30%">
                            <el-form :model="subPartModel" :rules="rules" label-width="100px" style="padding-right: 30px">
                                <el-form-item label="数量" prop="amount">
                                    <el-input v-model="subPartModel.amount" minlength="1" maxlength="10"></el-input>
                                </el-form-item>
                                <el-form-item label="位号" prop="locationTag">
                                    <el-input v-model="subPartModel.locationTag" minlength="1" maxlength="15"></el-input>
                                </el-form-item>
                            </el-form>
                            <template #footer>
                                <span class="dialog-footer">
                                    <el-button @click="dialogVisible2 = false">取消</el-button>
                                    <el-button type="primary" @click="updateSubPart"> 确认 </el-button>
                                </span>
                            </template>
                        </el-dialog>




              </el-tabs>

            </el-form>
            <template v-slot:footer>
              <div class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
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
                      <!-- <el-form-item label="默认单位：" :label-width="formLabelWidth" required>
                        <el-select v-model="addForm.value" placeholder="请选择">
                          <el-option v-for="item in options" :key="item.value" :label="item.label"
                            :value="item.value"></el-option>
                        </el-select>
                      </el-form-item> -->
                      <el-form-item label="来源：" :label-width="formLabelWidth" required>
                        <el-select v-model="addform.partSource" placeholder="请选择">
                          <el-option v-for="item in options1" :key="item.value1" :label="item.label1"
                            :value="item.value1">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="装配模式：" :label-width="formLabelWidth">
                        <el-select v-model="addform.assemblyMode" placeholder="请选择">
                          <el-option v-for="item in options2" :key="item.value2" :label="item.label2"
                            :value="item.value2">
                          </el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="分类代码：" :label-width="formLabelWidth" required>
                        <el-input v-model="addform.number" @blur="getcls($event)" autocomplete="off"></el-input>
                      </el-form-item>
                    </el-collapse-item>

                    <el-collapse-item title="扩展属性" name="2">
                      <el-form-item v-for="(item, index) in clsData" :key="index" :label="item.name"
                        :label-width="formLabelWidth">
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
              <el-button type="primary" @click="addPart(form)">提交</el-button>
            </template>
          </el-dialog>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>







<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';
import BomManage from './bom/BomManage.vue';
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
    Edit,
    Delete
} from '@element-plus/icons-vue'

// 初始化状态
const options1 = ref([
  { value1: '选项1', label1: '制造' },
  { value1: '选项2', label1: '购买' },
  { value1: '选项3', label1: '购买-单一供应源' }
]);

const options2 = ref([
  { value2: '选项1', label2: '可分离' },
  { value2: '选项2', label2: '不可分离' },
  { value2: '选项3', label2: '零件' }
]);

const activeNames = ref(['1']);
const activeNames1 = ref(['1']);
const dialogFormVisible = ref(false);
const showAdd = ref(false);
const form = reactive({});
const addform = reactive({});
const formLabelWidth = ref('120px');
const tableData = ref([]);
const clsData = ref([]);
const searchForm = ref({
  partNumber: "",
  partName: ""
});



import { partListService,subPartListService,AddSubpartService,subPartUpdateService,subPartDeleteService } from '../api/layout';



// 用于新增子项(林翰)

  //控制新增子项弹窗
const dialogVisible1 = ref(false)

//控制对当前part的子项进行修改的弹窗

//添加part数据模型
const partModel = ref([
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

//条件查询part
const getPartList = async (partId,partName) => {
    let result = await partListService(partId,partName);
    partModel.value = result.data;
}
getPartList();

//1、查看当前part的子项
//定义当前part的子项
const subPartModel = ref([
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
//定义变量，控制标题的展示
const title = ref('')

//控制修改part的子项的弹窗
const dialogVisible2 = ref(false)
//展示编辑弹窗
const showDialog = (row) => {
    dialogVisible2.value = true;
    title.value = '编辑part子项'
    //数据拷贝
    subPartModel.value.amount = row.amount;
    subPartModel.value.locationTag = row.locationTag;

    // 扩展enCode属性，传递给后台，完成编辑的修改
    subPartModel.value.enCode = row.enCode;

}

const updateSubPart = async () => {
    let result = await subPartUpdateService(partModel.value);
    ElMessage.success(result.msg ? result.msg : '修改成功')

    dialogVisible2.value = false;
    // //刷新刷新子项列表
    // bomManageList();


}



import { ElMessageBox } from 'element-plus'
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
            let result = await subPartDeleteService(row.enCode);
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
            //刷新列表
            // subPartManageList();刷新子项列表

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '用户取消了删除',
            })
        })

}



//作为新增子项的数据模型(给后端)
const addSubpartModel = ref({
    sourceId: '',//父项编码
    targetId: '',//子项编码
    quantity: '',//数量
    referenceDesignator: ''//位号}

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

//新增子项的数据模型
const postTargetId= (row) => {
    addSubpartModel.value.targetId = row.enCode;//获取子项的编号
}

//调用接口，新增子项
const addSubpartApi = async () => {
    //调用接口
    let result = await AddSubpartService(addSubpartModel.value);
    ElMessage.success(result.msg ? result.msg : '新增成功')

    dialogVisible1.value = false;
    //刷新列表
    // bomManageList();

}



 




// 表单提交处理
const onSubmit = () => {
  // 测试数据
  let result = {
    "code": 20041,
    "message": "查询成功",
    "data": [
      { "partId": 643938945230446593, "partName": "PART", "partNumber": "Part000000032", "version": "A", "iteration": 4, "partType": "零件", "businessCode": null },
      { "partId": 10000001, "partName": "华为Mate60Pro", "partNumber": "Part000000033", "version": "A", "iteration": 4, "partType": "零件", "businessCode": null },
      { "partId": 644609559540797441, "partName": "PART(555555)", "partNumber": "Part000000039", "version": "A", "iteration": 1, "partType": "零件", "businessCode": null },
      { "partId": 10000002, "partName": "6.8英寸屏幕", "partNumber": "Part000000035", "version": "A", "iteration": 2, "partType": "零件", "businessCode": null }
    ]
  };
  console.log(result.data);
  tableData.value = result.data;

  // 联调阶段的代码
  axios.post("http://localhost:8080/part/query", {
    partNumber: searchForm.partNumber,
    partName: searchForm.partName
  }).then((result) => {
    console.log(result);
    tableData.value = result.data;
  });
};

// 查询扩展属性
const getcls = (e) => {
  console.log(e);
  var businessCode1 = addform.businessCode;
  console.log(businessCode1);

  // 测试数据
  let result = {
    "code": 20041,
    "message": "查询指定分类结点的全部分类属性 成功",
    "data": [
      { "id": "642731228134379525", "name": "宽度", "nameEn": "Width", "description": "宽度", "type": "DECIMAL" },
      { "id": "642731228134379524", "name": "重量", "nameEn": "Weight", "description": "重量", "type": "DECIMAL" },
      { "id": "642731228134379523", "name": "长度", "nameEn": "Length", "description": "长度", "type": "DECIMAL" },
      { "id": "642731228134379522", "name": "型号", "nameEn": "Mode", "description": "型号", "type": "STRING" },
      { "id": "642731228134379521", "name": "大小", "nameEn": "Size", "description": "大小", "type": "DECIMAL" },
      { "id": "642731228134379520", "name": "高度/厚度", "nameEn": "Height or thickness", "description": "高度/厚度", "type": "DECIMAL" }
    ]
  };
  console.log(result.data);
  clsData.value = result.data;

  // 联调阶段的代码
  // axios.get(`http://localhost:8080/part/ClassificationNode/getCategoryNodeInfo?id=${businessCode1}`)
  //   .then((result) => {
  //     console.log(result);
  //     clsData.value = result.data;
  //   });
};

// 删除部件
const deletePart = (row) => {
  console.log(row);
  axios.delete(`http://localhost:8080/part/delete/${row.partId}`)
    .then((result) => {
      console.log(result);
      tableData.value = result.data;

      // 删除后刷新表格数据
      axios.post("http://localhost:8080/part/query")
        .then((result) => {
          console.log(result);
          tableData.value = result.data;
        });
    });
};

// 更新部件
const updatePart = (row) => {
  console.log(row);
  let ret = {};
  clsData.value.forEach(attr => {
    ret[attr.nameEn] = attr.value ?? "";
  });
  console.log(ret);

  axios.put("http://localhost:8080/part/updateAndCheckin", {
    masterId: clsData.value.partId,
    name: form.name,
    partSource: form.partSource,
    assemblyMode: form.assemblyMode,
    clsAttrs: ret,
    number: form.number
  }).then((result) => {
    console.log(result);
    dialogFormVisible.value = false;

    // 更新后刷新表格数据
    axios.post("http://localhost:8080/part/query")
      .then((result) => {
        console.log(result);
        tableData.value = result.data;
      });
  });
};

// 添加部件
const addPart = (row) => {
  console.log(row);
  let ret = {};
  clsData.value.forEach(attr => {
    ret[attr.nameEn] = attr.value ?? "";
  });
  console.log(ret);

  axios.post("http://localhost:8080/part/create", {
    name: addform.name,
    partSource: addform.partSource,
    assemblyMode: addform.assemblyMode,
    clsAttrs: ret,
    clsnumber: addform.number
  }).then((result) => {
    console.log(result);
    dialogFormVisible.value = false;

    // 添加后刷新表格数据
    axios.post("http://localhost:8080/part/query", {
      partNumber: searchForm.partNumber,
      partName: searchForm.partName
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

</script>

<style scoped>
.demo-form-inline {
  margin-bottom: 20px;
}

.set {
  padding: 20px;
}
</style>