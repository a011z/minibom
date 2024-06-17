<template>
    <div>
      <el-container style="height: 500px; border: 1px solid #eee">
        <el-header style="height: 50px; font-size: 40px; color: red;">MiniBom</el-header>
        <el-container>
          <!-- 左侧边栏 -->
          <el-aside width="230px" style="border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu :default-openeds="['1', '2']">
                <el-menu-item index="1-1"><router-link to="/Emp">部件管理</router-link></el-menu-item>
                <el-menu-item index="1-2"><router-link to="/res">BOM管理</router-link></el-menu-item>
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
                <el-button type="primary" style="margin-left: 50px;" @click="onSubmit">查询</el-button>
                <el-button type="danger" style="margin-left: 50px;" @click="showAdd = true">创建</el-button>
              </el-form-item>
            </el-form>
  
            <!-- 数据表格 -->
            <el-table :data="tableData" border style="margin-top: 0px;">
              <el-table-column prop="partNumber" label="部件编码" width="200"></el-table-column>
              <el-table-column prop="partName" label="部件名称" width="200"></el-table-column>
              <el-table-column prop="version" label="版本号" width="200"></el-table-column>
              <el-table-column prop="partType" label="装配模式" width="200"></el-table-column>
              <el-table-column prop="businessCode" label="分类编码" width="200"></el-table-column>
              <el-table-column label="操作">
                <template #default="{ row }">
                  <el-button type="primary" size="mini" @click="editRow(row)">修改</el-button>
                  <el-button type="danger" style="margin-left: 10px;" size="mini" @click="deleteRow(row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
  
            <!-- 创建模块 -->
            <el-dialog v-model:visible="showAdd" title="创建新的部件">
              <el-form :model="addForm">
                <el-tabs type="border-card">
                  <el-tab-pane label="基本属性">
                    <el-collapse v-model="activeNames" @change="handleChange">
                      <el-collapse-item title="基本属性" name="1">
                        <div class="set">产品：笔记本电脑</div>
                        <el-form-item label="部件名称：" :label-width="formLabelWidth" required>
                          <el-input v-model="addForm.name" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="默认单位：" :label-width="formLabelWidth" required>
                          <el-select v-model="addForm.value" placeholder="请选择">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="来源：" :label-width="formLabelWidth" required>
                          <el-select v-model="addForm.value1" placeholder="请选择">
                            <el-option v-for="item in options1" :key="item.value1" :label="item.label1" :value="item.value1"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="装配模式：" :label-width="formLabelWidth">
                          <el-select v-model="addForm.value2" placeholder="请选择">
                            <el-option v-for="item in options2" :key="item.value2" :label="item.label2" :value="item.value2"></el-option>
                          </el-select>
                        </el-form-item>
                        <el-form-item label="分类：" :label-width="formLabelWidth" required>
                          <el-input v-model="addForm.businessType" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-collapse-item>
                      <el-collapse-item title="扩展属性" name="2">
                        <el-form-item label="分类代码：" :label-width="formLabelWidth">
                          <el-input v-model="addForm.businessCode" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="品牌：" :label-width="formLabelWidth">
                          <el-input v-model="addForm.pinPai" autocomplete="off"></el-input>
                        </el-form-item>
                        <el-form-item label="型号：" :label-width="formLabelWidth">
                          <el-input v-model="addForm.xingHao" autocomplete="off"></el-input>
                        </el-form-item>
                      </el-collapse-item>
                    </el-collapse>
                  </el-tab-pane>
                  <el-tab-pane label="BOM清单">BOM清单</el-tab-pane>
                  <el-tab-pane label="版本管理">版本管理</el-tab-pane>
                </el-tabs>
              </el-form>
  
              <template #footer>
                <el-button @click="showAdd = false">取消</el-button>
                <el-button type="primary" @click="addPart">提交</el-button>
              </template>
            </el-dialog>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </template>
  
  <script>
  import { ref, reactive } from 'vue';
  import axios from 'axios';
  
  export default {
    setup() {
      // 下拉选项
      const options = ref([
        { value: '选项1', label: 'PCS' },
        { value: '选项2', label: 'SITE' },
        { value: '选项3', label: 'SET' },
        { value: '选项4', label: 'M' },
        { value: '选项5', label: 'EACH' },
        { value: '选项6', label: 'HOP' },
        { value: '选项7', label: 'M*M' },
        { value: '选项8', label: 'TRP' },
        { value: '选项9', label: 'MON' },
        { value: '选项10', label: 'KG' }
      ]);
  
      const options1 = ref([
        { value1: '选项1', label1: '制造' },
        { value1: '选项2', label1: '购买' }
      ]);
  
      const options2 = ref([
        { value2: '选项1', label2: '装配part' },
        { value2: '选项2', label2: '零件part' }
      ]);
  
      const activeNames = ref(['1']);
      const dialogFormVisible = ref(false);
      const showAdd = ref(false);
  
      const searchForm = reactive({
        partNumber: '',
        partName: ''
      });
  
      const addForm = reactive({
        name: '',
        value: '',
        value1: '',
        value2: '',
        businessType: '',
        businessCode: '',
        pinPai: '',
        xingHao: ''
      });
  
      const tableData = ref([]);
      const formLabelWidth = '120px';
  
      // 方法
      const handleChange = (val) => {
        console.log(val);
      };
  
      const onSubmit = () => {
        axios.get('http://localhost:8080/part/enum/query/PartSource', {
          params: {
            partNumber: searchForm.partNumber,
            partName: searchForm.partName
          }
        }).then((result) => {
          console.log(result);
          tableData.value = result.data.data;
        });
      };
  
      const editRow = (row) => {
        dialogFormVisible.value = true;
        // Assuming we have the logic to load the form with the row data
      };
  
      const deleteRow = (row) => {
        axios.delete(`http://localhost:8080/ulab/${row.id}`).then((result) => {
          console.log(result);
          // Refresh the tableData after deletion
        });
      };
  
      const addPart = () => {
      axios.post('http://localhost:8080/ulab', addForm).then((result) => {
        console.log(result);
        showAdd.value = false;
        // Refresh the tableData after addition
      });
    };

    return {
      options,
      options1,
      options2,
      activeNames,
      dialogFormVisible,
      showAdd,
      searchForm,
      addForm,
      tableData,
      formLabelWidth,
      handleChange,
      onSubmit,
      editRow,
      deleteRow,
      addPart
    };
  }
};
</script>

<style scoped>
.set {
  margin-bottom: 15px;
  font-size: 14px;
}
</style>