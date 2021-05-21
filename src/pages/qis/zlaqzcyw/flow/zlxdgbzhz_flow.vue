<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="padding: 10px 20px;" slot-scope="flowScope">
                <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
                    <el-tab-pane label="基本信息" name="first" style="height: 300px;">
                        <el-form :model="formModel" ref="form" :rules="rules">
                            <div class="formItem">
                                <!--第一行-->
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="班组编号" label-width="140px" prop="bzCode">
                                            <el-input disabled v-model="formModel.bzCode" placeholder="自动生成"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="班组名称" label-width="140px" prop="bzName">
                                            <el-input v-model="formModel.bzName" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="单位名称" label-width="140px" prop="dwName">
                                            <ice-dept-selector  chooseItem="single" :disabled="flowScope.formReadonly" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                v-model="formModel.dwName"
                                                                @select-confirm="depts=>formModel.dwCode=depts[0].deptCode">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第二行-->
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="主管部门" label-width="140px" prop="zgbmName">
                                            <ice-dept-selector :disabled="flowScope.formReadonly"  chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                v-model="formModel.zgbmName"
                                                                @select-confirm="depts=>formModel.zgbmCode=depts[0].deptCode">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="班组组长" label-width="140px" prop="zzName">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.zzName"  placeholder="请输入"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="联系人" label-width="140px" prop="lxr">
                                            <el-input v-model="formModel.lxr" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第三行-->
                                <el-row :gutter="20">
                                    <el-col :span="8">
                                        <el-form-item label="联系电话" label-width="140px" prop="lxdd">
                                            <el-input disabled v-model="formModel.lxdd" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="传真" label-width="140px" prop="fax">
                                            <el-input v-model="formModel.fax" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="8">
                                        <el-form-item label="密级" label-width="140px" prop="bzCode">
                                            <ice-select :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL"
                                                        filterable placeholder="请选择">
                                            </ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <!--第四行-->
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="班组职责" label-width="140px" prop="bzDuty">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.bzDuty" placeholder="填写不超过500个字" type="textarea" :rows="2">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--第五行-->
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="工作内容" label-width="140px" prop="gznr">
                                            <el-input :disabled="flowScope.formReadonly" v-model="formModel.gznr" placeholder="填写不超过500个字" type="textarea" :rows="2">
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--底部按钮-->
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="小组成员" name="xzcy" style="height: 300px;">
                        <div class="formItem">
                            <div class="addXzcy" v-if="!flowScope.formReadonly">
                                <el-button type="success" @click="addCy"><i class="el-icon-circle-plus" style="margin-right: 5px;"></i>添加</el-button>
                            </div>
                            <vxe-table
                                    ref="xzcy"
                                    border="inner"
                                    :align="allAlign"
                                    :edit-config=true
                                    :data="tableData">
                                <vxe-table-column type="seq" width="60"></vxe-table-column>
                                <vxe-table-column field="name" title="姓名" :edit-render="{name: 'input', autoselect: true}">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-input v-model="row.cyName"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="sex" title="性别">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <ice-select v-model="row.cySex"
                                                    map-type-code="SEX"
                                                    filterable placeholder="请选择">
                                        </ice-select>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="age" title="年龄">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-input v-model="row.cyAge"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column field="zy" title="职务">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-input v-model="row.cyPositon"></el-input>
                                    </template>
                                </vxe-table-column>
                                <vxe-table-column title="操作">
                                    <template v-slot="{ row, rowIndex, columnIndex }">
                                        <el-button type="text" @click="delRow(row)">删除</el-button>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="附件" name="fj" style="height: 300px;">
                        <div class="formItem">
                            <ATTACHMENT :isHandleer="!flowScope.formReadonly"  Height="200px" :data="xtFjList" ref="qisAqJj"></ATTACHMENT>
                        </div>

                    </el-tab-pane>
                </el-tabs>
            </div>

        </ice-flow-form>
    </div>
</template>

<script>
  import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
  import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
  import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
  import IceSelect from "@/components/common/base/IceSelect";
  import codeConfigRequest from '@/utils/codeConfigRequest'
  export default {
    name: "zlxdgbzhz_flow",
      mixins: [codeConfigRequest],
    components: {
      IceFlowForm,
      ATTACHMENT,
      IceDeptSelector,
      IceSelect
    },
    data () {
      return {
        allAlign: null,
        activeName: 'first',
        //验证不能为空
        rules:{
          hdName: [
            { required: true, message: '名称不能为空'}
          ],
        },
        //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
        formModel:{
          oid:'',
          bzId:'',//班组ID
          bzCode:'',//班组编号
          bzName:'',//班组名称
          dwCode:'',//单位编号
          dwName:'',//单位名称
          zgbmCode:'',//主管部门编号
          zgbmName:'',//主管部门名称
          zzName:'',//组长名称
          lxr:'',//联系人
          lxdd:'',//联系电话
          fax:'',//传真
          bzDuty:'',//班组职责
          gznr:'',//工作内容
          docIds:'',//附件ID集合
          dataSecretLevcode:'',//密级
          dateRemark:'',//备注
        },
        loading: false,
        disabled: false,
        tableData: [
          {
            cyName: '',
            cySex: '1',
            cyAge: '',
            cyPositon: ''
          }
        ],
        xtFjList:[],

      }
    },
    created () {
      let NumEmptyAllInps = []; // 判断为空的数据个数
      this.tableData.forEach((c)=>{
        // 拿到所有为空的值
        if (c.countnumber===''||c.countnumber===undefined||c.countnumber==null) {
          NumEmptyAllInps.push(c)
        }
      })
      if (NumEmptyAllInps.length<=0) {
        console.log('全部不为空，有值');
        return;
      }
    },
    methods: {
        // 获取编码
        getCode() {
            this.loadProjectCode({name: 'aqlzsb'}).then(res => {
                this.formModel.bzCode = res.number;
            })
        },
      flowReady(flowContext, bizdata) {
        console.log(bizdata)
        //流程初始化
        if (bizdata.oid) {
          this.edit(bizdata)
        } else {
          this.$refs.form.resetFields();
          this.getCode();
        }
        let flowData = this.$refs.flow.flowInstData;
        if(flowData.proOperates != null){

        }

      },
      flowOperateBtn(flowContext, bizdata) {
        //按钮操作事件
        return this.$refs.form.validate();
      },
      flowBizData() {
        // 传递数据整合
        this.formModel.dataSecretLevcode = 2;
        console.log(this.formModel)
        let fj = this.$refs.qisAqJj.getData();
        this.formModel.xtFjList = fj.length != 0 ? fj : [];

        let cy = this.$refs.xzcy.getTableData().tableData;
        let deldata = this.$refs.xzcy.getRemoveRecords();
        deldata.map((c)=>{
          c.version = -1;
        })
        cy = cy.concat(deldata);
        this.formModel.qisXdgBzcyList = cy.length != 0 ? cy : [];
        this.formModel.qisXdgBzcyList.map((c)=>{
          c.dataSecretLevcode = 2;
        })
        return this.formModel;
      },
      // 保存成功后的回调
      handleCallbackFlow (data) {
        this.formModel = data;
        this.xtFjList = this.formModel.xtFjList;
        this.tableData = this.formModel.qisXdgBzcyList;
      },
      // 查询小组成员
      searchXzcy (oid) {
        this.$axios.get("/pms/QisXdgbz/querylistByOidZlxdgbzhzCy", {params: {oid: oid}})
          .then(result => {
            this.tableData = result.data;
          })
          .catch(error => {
            this.$message.error(fail)
          })
          .finally(_ => {
            this.loading = false
          })
      },
      // 查询附件
      getFj (oid) {
        this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
          .then(result => {
            this.xtFjList = result.data;
          })
          .catch(error => {
            this.$message.error(fail)
          })
          .finally(_ => {
            this.loading = false
          })
      },
      //选中一行进行编辑
      edit(row){
        this.$nextTick(_ => {
          this.$refs.form.resetFields();
          this.formModel = {...row}
          this.searchXzcy(row.oid)
          this.getFj(row.oid)
          this.$refs.qisAqJj.resize();
        })
        //this.getFjData(row);
      },
      handleClick (e) {
        console.log(e)
        if (e.name=='fj') {
          this.$refs.qisAqJj.resize();
        }
        if (e.name=='xzcy') {
          this.$nextTick(()=>{
            this.$refs.xzcy.recalculate();
          })
        }
      },
      // 新增成员
      addCy () {
        let record = {
          cyName: '1',
          cySex: '1',
          cyAge: '',
          cyPositon: ''
        };
        console.log(123)
        this.$refs.xzcy.insertAt(record, -1)
          .then(({row}) => this.$refs.xzcy.setActiveCell(row))
      },
    }
  }
</script>

<style scoped>

</style>