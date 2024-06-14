<template>
    <div>
      <el-container style="height:  500px; border: 1px solid #eee">
        <el-header style="height:  50px;font-size: 40px;color: red;">MiniBom
        </el-header>
       
        <el-container>
  
          <!--左侧边框-->
          <el-aside width="230px" style="border: 1px solid #eee">
            <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
              <el-menu :default-openeds="['1', '2']">
  
                <el-menu-item index="1-1"><router-link to="/Emp">部件管理</router-link></el-menu-item>
                <el-menu-item index="1-2"><router-link to="/res">BOM管理</router-link></el-menu-item>
  
              </el-menu>
            </el-aside>
          </el-aside>

          <el-main style="padding-top: 0px;">
            <!--Form表单-->
  
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
  
  
  
            <el-table :data="tableData" border style="margin-top: 0px;">
              <el-table-column prop="partNumber" label="部件编码" width="200"></el-table-column>
             
              <el-table-column prop="partName" label="部件名称" width="200">
              </el-table-column>
              <el-table-column prop="version" label="版本号" width="200"></el-table-column>
              <el-table-column prop="partType" label="装配模式" width="200"></el-table-column>
              <el-table-column prop="businessCode" label="分类编码" width="200"></el-table-column>
              <el-table-column #default="{row}" label="操作">
                <el-button type="primary" size="mini" @click="dialogFormVisible = true; form = row">修改</el-button>
                <el-button type="danger" style="margin-left: 10px;" size="mini" @click="Delete(row)">删除</el-button>
              </el-table-column>
            </el-table>
  
  


              <!--修改模块-->
              <!-- edit window -->
            <!-- <el-dialog title="研究室信息" :visible.sync="dialogFormVisible">
              <el-form :model="form">
                <el-form-item label="名称" :label-width="formLabelWidth">
                  <el-input v-model="form.name" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="研究领域" :label-width="formLabelWidth">
                  <el-input v-model="form.researchField" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="地址" :label-width="formLabelWidth">
                  <el-input v-model="form.address" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="面积" :label-width="formLabelWidth">
                  <el-input v-model="form.area" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="是否正在使用" :label-width="formLabelWidth">
                  <el-input v-model="form.isUsing" autocomplete="off"></el-input>
                </el-form-item>
              </el-form>
  
              <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="Udatelab(form)">确 定</el-button>
              </div>
            </el-dialog> -->
  

            <!--创建模块-->
            <!-- add window -->
            <el-dialog title="" :visible.sync="showAdd">
              <el-form :model="addform">
                <el-tabs type="border-card">
                    <el-tab-pane label="基本属性">
                        <el-collapse v-model="activeNames" @change="handleChange">

                            <el-collapse-item title="基本属性" name="1">
                                <div class="set">产品：笔记本电脑</div>
                                <el-form-item label="部件名称：" :label-width="formLabelWidth" required>
                                    <el-input v-model="addform.name" autocomplete="off"></el-input>
                                  </el-form-item>
                                  
                                  <el-form-item label="默认单位：" :label-width="formLabelWidth" required>
                                    <el-select v-model="addform.value" placeholder="请选择">
                                        <el-option
                                          v-for="item in options"
                                          :key="item.value"
                                          :label="item.label"
                                          :value="item.value">
                                        </el-option>
                                      </el-select>
                                  </el-form-item>

                                  <el-form-item label="来源：" :label-width="formLabelWidth" required>
                                    <el-select v-model="addform.value1" placeholder="请选择">
                                        <el-option
                                          v-for="item in options1"
                                          :key="item.value1"
                                          :label="item.label1"
                                          :value="item.value1">
                                        </el-option>
                                      </el-select>
                                  </el-form-item>

                                  <el-form-item label="装配模式：" :label-width="formLabelWidth">
                                    <el-select v-model="addform.value2" placeholder="请选择">
                                        <el-option
                                          v-for="item in options2"
                                          :key="item.value2"
                                          :label="item.label2"
                                          :value="item.value2">
                                        </el-option>
                                      </el-select>
                                  </el-form-item>

                                  <el-form-item label="分类：" :label-width="formLabelWidth" required>
                                    <el-input v-model="addform.businessType" autocomplete="off"></el-input>
                                  </el-form-item>                                   

                            </el-collapse-item>



                            
                            <el-collapse-item title="扩展属性" name="2">
                             
                                <el-form-item label="分类代码：" :label-width="formLabelWidth">
                                    <el-input v-model="addform.businessCode" autocomplete="off"></el-input>
                                  </el-form-item>
                                  <el-form-item label="品牌：" :label-width="formLabelWidth">
                                    <el-input v-model="addform.pinPai" autocomplete="off"></el-input>
                                  </el-form-item>
                                  <el-form-item label="型号：" :label-width="formLabelWidth">
                                    <el-input v-model="addform.xingHao" autocomplete="off"></el-input>
                                  </el-form-item>
                                  
                            </el-collapse-item>
                           
                          </el-collapse>

                    </el-tab-pane>
                    
                    <el-tab-pane label="BOM清单">BOM清单</el-tab-pane>
                    <el-tab-pane label="版本管理">版本管理</el-tab-pane>
                  </el-tabs>
               
              </el-form>
  
              <div slot="footer" class="dialog-footer">
                <el-button @click="showAdd = false">取 消</el-button>
                <el-button type="primary" @click="Addlab(form)">提交</el-button>
              </div>
            </el-dialog>
          </el-main>
        </el-container>
      </el-container>
  
    </div>
  
  </template>
  
  <script>
  
    import axios from 'axios';
  
    export default {
      data() {
        return {

            options: [{
          value: '选项1',
          label: 'PCS'
        }, {
          value: '选项2',
          label: 'SITE'
        }, {
          value: '选项3',
          label: 'SET'
        }, {
          value: '选项4',
          label: 'M'
        }, {
          value: '选项5',
          label: 'EACH'
        },
        {
          value: '选项6',
          label: 'HOP'
        },
        {
          value: '选项7',
          label: 'M*M'
        },
        {
          value: '选项8',
          label: 'TRP'
        },
        {
          value: '选项9',
          label: 'MON'
        },
        {
          value: '选项10',
          label: 'KG'
        }
    ],


    options1: [{
          value1: '选项1',
          label1: '制造'
        }, {
          value1: '选项2',
          label1: '购买'
        }
        
    ],

    options2: [{
          value2: '选项1',
          label2: '装配part'
        }, {
          value2: '选项2',
          label2: '零件part'
        } ],
            activeNames: ['1'],
          dialogFormVisible: false,
          showAdd: false,
          form: {
            id: '',
            name: '',
            researchField: '',
            address: '',
            area: '',
            isUsing: ''
          },


          //创建
          addform: {},

          formLabelWidth: '120px',
          tableData: [],//接受传来的数组，并渲染
          searchForm: {//输入的
            //v-model的东西要在这里声明
  
            partNumber: "",
            
            partName: ""
  
          }
        }
      },
      methods: {
        handleChange(val) {
        console.log(val);
      },
  
        onSubmit: function (searchForm) {
          // alert("查询")
        //   var partNumber1 = this.searchForm.partNumber;
        //   var name1 = this.searchForm.partName;
          axios.post("http://localhost:8080/part/query", {
            
            partNumber:this.searchForm.partNumber,
            partName:this.searchForm.partName
  
          }).then(
            (result) => {
              console.log(result);
              console.log(searchForm);
              this.tableData = result.data.data;
  
            }
          );
        },
  
  

        //删除
        // Delete: function (row) {
        //   console.log(row);
  
        //   axios.delete("http://localhost:8080/ulab/" + row.id, {
  
        //   }).then(
        //     (result) => {
        //       console.log(result);
        //       this.tableData = result.data.data;
        //       var name1 = this.searchForm.name;
        //       var researchField1 = this.searchForm.researchField;
        //       axios(
        //         {
        //           methods: "GET",
        //           url: "http://localhost:8080/ulab?name=" + name1 + "&researchField=" + researchField1
  
        //           // data:{
        //           //   name:name1,
        //           //   researchField:researchField1,
        //           // },
  
        //         }
        //       ).then(
        //         (result) => {
        //           console.log(result);
  
        //           this.tableData = result.data.data;
  
        //         }
        //       );
        //     }
        //   );
        // },
  


        //修改
  
        // Udatelab: function (row) {
        //   // alert("修改研究室数据")
        //   console.log(row);
  
        //   axios.put("http://localhost:8080/ulab", {
        //     id: row.id,
        //     name: this.form.name,
        //     researchField: this.form.researchField,
        //     address: this.form.address,
        //     area: this.form.area,
        //     isUsing: this.form.isUsing
  
        //   }).then((result) => {
        //     console.log(result)
        //     this.dialogFormVisible = false
  
        //     var name1 = this.searchForm.name;
        //     var researchField1 = this.searchForm.researchField;
        //     axios(
        //       {
        //         methods: "GET",
        //         url: "http://localhost:8080/ulab?name=" + name1 + "&researchField=" + researchField1
  
        //         // data:{
        //         //   name:name1,
        //         //   researchField:researchField1,
        //         // },
  
        //       }
        //     ).then(
        //       (result) => {
        //         console.log(result);
        //         this.tableData = result.data.data;
        //       });
        //   }
        //   );
  
        // },



        //创建模块
        // Addlab: function (row) {
         
        //   console.log(row);
  
        //   axios.post("http://localhost:8080/ulab", {
        //     name: this.addform.name,
        //     researchField: this.addform.researchField,
        //     address: this.addform.address,
        //     area: this.addform.area,
        //     isUsing: this.addform.isUsing
  
        //   }).then((result) => {
        //     console.log(result)
        //     this.dialogFormVisible = false
  
        //     var name1 = this.searchForm.name;
        //     var researchField1 = this.searchForm.researchField;
        //     axios(
        //       {
        //         methods: "GET",
        //         url: "http://localhost:8080/ulab?name=" + name1 + "&researchField=" + researchField1
  
        //         // data:{
        //         //   name:name1,
        //         //   researchField:researchField1,
        //         // },
  
        //       }
        //     ).then(
        //       (result) => {
        //         console.log(result);
        //         this.tableData = result.data.data;
        //         this.showAdd = false
        //       });
        //   }
        //   );
  
        // },
      },
  
    }
  
  
  </script>
  
  
  <style>
    .set{
        margin-left: 52px;
        font-size: 15px;
        margin-bottom: 5px;
    }
  
  </style>