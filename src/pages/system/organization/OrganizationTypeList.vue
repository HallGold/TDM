<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/permission/department_type/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :pagination="false"
                :operations="operations"
                :operations-width="90">
        </ice-query-grid>
        <ice-dialog v-dialogDrag title="组织类型修改" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form">
                    <ice-grid-layout name="组织类型信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="类型名称:" label-width="100px" prop="name">
                                <el-input placeholder="不超过20个字" v-model="mainDataForm.name" maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型编码:" label-width="100px" prop="code">
                                <el-input placeholder="类型编码"
                                          v-model="mainDataForm.code"
                                          :disabled="isUpData"
                                          @keyup.native="codeItem"
                                          maxlength="30" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="机构类型:" label-width="100px" prop="orgType">
                                <el-select placeholder="机构类型" v-model="mainDataForm.orgType">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="排序:" label-width="100px" prop="sequencing">
                                <el-input placeholder="只能输入1至7位数字"
                                          v-model="mainDataForm.sequencing"
                                          maxlength="7"
                                          @keyup.native="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                <el-select placeholder="启用状态" v-model="mainDataForm.enabled">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>

            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import OrganizationTypeEdit from "./OrganizationTypeEdit";
    import OrgComm from "@/pages/system/comm/OrgComm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "OrganizationTypeList",
        data(){
          return{
              query: [
                  {type: 'input', label: '类型名称', code: 'name', value: ''},
                  {type: 'input', label: '类型编码', code: 'code', value: ''}
              ],
              columns: [
                  {label: '类型名称', code: 'name', width: 150},
                  {label: '类型编码', code: 'code', width: 150,align:'left'},
                  {label: '机构类型', code: 'orgType', width: 150,renderCell(h, data){
                          return (data.row.orgType==1?"是":(data.row.orgType==0?"否":""))}},
                  {label: '排序', code: 'sequencing', width: 150,align:'left'},
                  {label: '启用状态', code: 'enabled', width: 150,renderCell(h, data){
                          return (data.row.enabled==1?"是":(data.row.enabled==0?"否":""))}},
                  {label: '最后修改时间', code: 'updateDate', width: 150},
              ],
              operations: [
                  {name: '编辑', callback: this.editPageFuncItem},
                  {
                      name: '启用', callback: this.enabl, isShow: function (row) {
                          if (row.enabled == 0) {
                              return true;
                          }
                          return false;
                      }
                  },
                  {
                      name: '停用', callback: this.enabl, isShow: function (row) {
                          if (row.enabled == null || row.enabled == 1) {
                              return true;
                          }
                          return false;
                      }
                  }
              ],
              buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
              dialogVisible: false,
              status:true,
              editTypeList:false,
              isUpData:false,
              mainDataForm: {
                  code: '',
                  name: '',
                  orgType: '',
                  sequencing:'',
                  enabled: 1,
                  oid:''
              },
              formRules: {
                  orgType: [{required: true, message: '请选择机构类型', trigger: 'blur'}],
                  code: [{required: true,whitespace: true, message: '请输入类型编码', trigger: 'blur'}],
                  name: [{required: true,whitespace: true, message: '请输入类型名称', trigger: 'blur'}],
                  sequencing: [{required: true,whitespace: true, message: '请输入排序', trigger: 'blur'}],
              },
          }
        },
        methods:{
            /**新增*/
            addItem() {
                this.isUpData = false;
                this.mainDataForm.oid = '';
                this.mainDataForm.orgType = '';
                this.mainDataForm.code = '';
                this.mainDataForm.name = '';
                this.mainDataForm.enabled = '';
                this.mainDataForm.sequencing = '';
                this.dialogVisible = true;
                this.editTypeList = false;
            },
            /**维护*/
            editPageFuncItem(row) {
                this.isUpData = true;
                this.mainDataForm.oid = row.oid;
                this.mainDataForm.orgType = row.orgType==1?"是":(row.orgType==0?"否":"");
                this.mainDataForm.code = row.code;
                this.mainDataForm.name = row.name;
                this.mainDataForm.enabled = row.enabled==1?"是":(row.enabled==0?"否":"");
                this.mainDataForm.sequencing = row.sequencing;
                this.dialogVisible = true;
                this.editTypeList = true;
            },
            /**启用或禁用*/
            enabl(row){
                if(row.enabled==1){
                    this.status=false;
                }else{
                    this.status=true;
                }
                this.$axios.put("/permission/department_type/change_status",{oid:row.oid,status:this.status}).then(success=>{
                    this.$refs.iceGrid.refresh();
                    this.$message.success("操作成功");
                }).catch(error=>{
                    this.$message({
                        type:'error',
                        message:error.msg ? error.msg : '操作出错了'
                    })
                });

            },
            closeItem(){
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**效验排序只能输入数字*/
            number(){
                this.mainDataForm.sequencing=this.mainDataForm.sequencing.replace(/[^\.\d]/g,'');
                this.mainDataForm.sequencing=this.mainDataForm.sequencing.replace('.','');
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem(){
                this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/,'');
            },
            /**保存*/
            save(){
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if(this.editTypeList){
                        this.mainDataForm.enabled = this.mainDataForm.enabled=="是"?1:(this.mainDataForm.enabled=="否"?0:this.mainDataForm.enabled);
                        this.mainDataForm.orgType = this.mainDataForm.orgType=="是"?1:(this.mainDataForm.orgType=="否"?0:this.mainDataForm.orgType);
                    }
                    this.$axios.patch("/permission/department_type/save_update",this.mainDataForm).then(success=>{
                        this.$message.success("保存成功");
                        this.$refs.iceGrid.refresh();
                        this.closeDialog();
                    }).catch(error=>{
                        this.$message({
                            type:'error',
                            message:error.msg ? error.msg : '操作出错了'
                        })
                    });
                });
            },
            /**弹窗关闭*/
            closeDialog() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            }
        },
        /*mixins: [OrgComm],
        data() {
            return {
                data: [],
                curData: {},
                columns: [],
                buttons: [],
                dialogVisible: false,
            }
        },
        methods: {
            openDialog() {
                if (this.$refs.editDialog) {
                    this.$refs.editDialog.reset(this.curData);
                }
            },
            add() {
                //在第一行新增数据
                this.curData = {oid: "", enabled: 1};
                this.data.unshift(this.curData);
                this.dialogVisible = true;

            },
            edit() {
                //编辑当前选中数据
                let curRow = this.$refs.iceGrid.getSelections()[0];
                if (!!curRow) {
                    this.curData = curRow;
                    this.dialogVisible = true;
                } else {
                    this.$message.warning("请选择要编辑的数据!");
                }
            },
            closeDialog(obj) {
                this.dialogVisible = false;
                if (!!obj) {
                    //更新数据
                    Object.assign(this.curData, obj);
                } else {
                    //新增取消处理
                    this.data.shift();
                }
            },
            enabled() {
                //启用按钮响应函数
                this.changeStatus(this.ENABLED_ENUM.ENABLED);
            },
            disabled() {
                //禁用按钮响应函数
                this.changeStatus(this.ENABLED_ENUM.DISABLED);
            },
            changeStatus(_status) {
                let curRow = this.$refs.iceGrid.getSelections()[0];
                if (!!!curRow) {
                    this.$message.warning("请选择要操作的数据!");
                    return;
                }
                let param = {
                    oid: curRow.oid,
                    status: _status
                };
                let _this = this;
                this.axios(this.ACTIONS_ENUM.ORG_TYPE.CHANGE_STATUS, param, [res => {
                    curRow.enabled = _status;
                }]);
            },
            loadData() {
                return new Promise(function (resolve, reject) {
                    let _this = this;
                    this.axios(this.ACTIONS_ENUM.ORG_TYPE.LOAD_LIST, null, [res => {
                        if (_this.frameAjaxSuccess(res, false)) {
                            _this.data = res.data;
                            resolve("数据加载完成!");
                        } else {
                            if (!!res.code) {
                                reject(_this.getErrorNameByCode(res.code));
                            } else {
                                reject("数据加载失败!");
                            }
                        }
                    }]);
                }.bind(this));
            },
            initData() {
                let _this = this;
                this.loadData().then(function (msg) {
                    _this.$message({
                        message: msg,
                        type: 'success'
                    });
                }).catch(function (msg) {
                    _this.$message.error(msg);
                });
            },
            refresh() {
                this.initData();
            },
            initControls() {
                this.initButtons();
                this.initColumns();
            },
            initButtons() {
                this.buttons = [
                    Object.assign({},this.BUTTON_ENUM.ADD, {callback: this.add}),
                    Object.assign({},this.BUTTON_ENUM.EDIT, {callback: this.edit}),
                    Object.assign({},this.BUTTON_ENUM.ENABLED, {callback: this.enabled}),
                    Object.assign({},this.BUTTON_ENUM.DISABLED, {callback: this.disabled}),
                    Object.assign({},this.BUTTON_ENUM.REFRESH, {callback: this.refresh}),
                ];
            },
            initColumns() {
                this.columns = [
                    {label: '类型名称', code: 'name', width: 400},
                    {label: '类型编码', code: 'code', width: 160},
                    {label: '机构类型', code: 'orgType', width: 180, render: this.commOrgTypeRender},
                    {label: '排序', code: 'sequencing', width: 180},
                    {label: '启用状态', code: 'enabled', width: 180, render: this.commEnabledRender},
                    {label: '最后修改时间', code: 'updateDate', width: 120},
                ];
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.initControls();
            this.initData();
        },*/
       components: {IceGridLayout, IceQueryGrid, OrganizationTypeEdit}
    }
</script>
<style scoped>

</style>
