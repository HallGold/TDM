<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/permission/frame_org/load_tenant"
                :operationsWidth="200"
                :query="query"
                :pagination="false"
                :columns="columns"
                :operations="operations"
                ></ice-query-grid>
        <el-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form" style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="租户名称" label-width="100px" prop="deptName">
                                <el-input placeholder="租户名称" v-model="mainDataForm.deptName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="租户编码" label-width="100px" prop="inputDeptCode">
                                <el-input placeholder="由数字英文字母或者下划线组成"
                                          v-model="mainDataForm.inputDeptCode"
                                          :disabled="isUpData"
                                          maxlength="30"
                                          @keyup.native="codeItem"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="排序" label-width="100px" prop="sequencing">
                                <el-input placeholder="只能输入1至7位数字哦"
                                          v-model="mainDataForm.sequencing"
                                          maxlength="7"
                                          @keyup.native="number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="启用状态" label-width="100px" prop="enabled">
                                <el-select placeholder="启用状态" v-model="mainDataForm.enabled">
                                    <el-option label="是" value="1"></el-option>
                                    <el-option label="否" value="0"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button type="info" @click="closeDialog">返回</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import OrgEdit from "./OrgEdit";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";

    export default {
        name: "TenantManage",
        mixins: [OrgComm],
        components: {IceQueryGrid, OrgEdit},
        data(){
            return{
                query:[
                    {type: 'input', label: '租户', code: 'code'},
                ],
                columns:[
                    {code:'oid',hidden:true},
                    {label: '租户名称', code: 'deptName', width: 200},
                    {label: '租户编码', code: 'inputDeptCode', width: 200},
                    {label: '排序', code: 'sequencing', width: 200},
                    {label: '启用状态', code: 'enabled', width: 200,renderCell(h, data){
                            return (data.row.enabled==1?"是":(data.row.enabled==0?"否":""))}},
                ],
                operations:[
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
                    },
                    {name: '删除', callback: this.deleteItem},
                ],
                formRules: {
                    deptName: [{required: true,whitespace: true, message: '请输入租户名称', trigger: 'blur'}],
                    inputDeptCode: [{required: true,whitespace: true, message: '请输入租户编码', trigger: 'blur'}],
                    sequencing: [{required: true,whitespace: true, message: '请输入排序', trigger: 'blur'}],
                    enabled: [{required: true, message: '请选择启用状态', trigger: 'blur'}],
                },
                parentCode:0,
                dialogVisible:false,
                mainDataForm:{},
                title:'',
                isUpData:false
            }
        },
        methods:{
            closeItem(){
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**效验排序只能输入数字*/
            number(){
                this.formData.sequencing=this.formData.sequencing.replace(/[^\.\d]/g,'');
                this.formData.sequencing=this.formData.sequencing.replace('.','');
            },
            /**新增*/
            addItem() {
                this.isUpData = false;
                this.title = '新增';
                this.mainDataForm={};
                this.mainDataForm.parentCode=this.parentCode;
                this.dialogVisible = true;
            },
            /**编辑*/
            editPageFuncItem(row) {
                this.isUpData = true;
                alert("编辑第一次可以保存成功，但没有对原数据进行改变，只是新增了一条，第二次操作就不可编辑，调整中");
                this.$axios.get("/permission/frame_org/get_by_code",{"params":{"deptCode":row.inputDeptCode}}).then(success=>{
                    this.title = '编辑';
                    this.dialogVisible = true;
                    let obj ={};
                    Object.assign(obj,success.data.departmentInfoVo,success.data.departmentInfoExpandVo);
                    this.mainDataForm = obj;
                }).catch(error=>{
                    this.$message({
                        type:'error',
                        message:error.msg ? error.msg : '操作出错了'
                    })
                });
            },
            /**初始化*/
            inStar(){
                alert("待接口");
            },
            /**启用或禁用*/
            enabl(row){
                alert("待接口")
                if(row.enabled==1){
                    this.status=0;
                }else{
                    this.status=1;
                }
                this.$axios.patch("/permission/frame_org/enabled_status",{"params":{"deptCode":row.inputDeptCode,"status":this.status}}).then(success=>{
                    this.$message.success("操作成功");
                    this.$refs.iceGrid.refresh();
                }).catch(error=>{
                    this.$message({
                        type:'error',
                        message:error.msg ? error.msg : '操作出错了'
                    })
                });

            },
            /**删除*/
            /**右边列表操作下的删除按钮*/
            deleteItem(row){
                alert("可以删除没有经过编辑的，经过编辑的都不可删除，调整中")
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.delete("/permission/frame_org/delete",{"params":{"deptCode":row.inputDeptCode}}).then(success=>{
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.refresh();
                    }).catch(error=>{
                        this.$message({
                            type:'error',
                            message:error.msg ? error.msg : '操作出错了'
                        })
                    });
                });
            },
            /**保存*/
            save(){
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        // console.log('error submit!!');
                        return false;
                    }
                    this.$axios.patch("/permission/frame_org/save",{"departmentInfoVo":this.mainDataForm,"departmentInfoExpandVo":this.mainDataForm}).then(success=>{
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.$refs.iceGrid.refresh();
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
        }
    }
</script>

<style scoped>

</style>
