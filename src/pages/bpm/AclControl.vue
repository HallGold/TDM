<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="按钮组管理"
                        data-url="/bpm/sysAcl/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <ice-dialog :title="tittle"
                    :visible.sync="dialogVisible"
                    width="600px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form">
                    <ice-grid-layout name="按钮组信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="按钮组KEY" label-width="100px" prop="aclKey">
                                    <el-input placeholder="按钮组KEY" maxlength="40"  onchange="this.value=this.value.toUpperCase()" v-model="mainDataForm.aclKey" :disabled="aclKeyReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="组名称" label-width="100px" prop="aclName">
                                    <el-input placeholder="组名称" maxlength="60" v-model="mainDataForm.aclName"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="描述" label-width="100px" prop="aclType">
                                    <!--<el-select placeholder="ACL类型" v-model="mainDataForm.aclType">
                                        <el-option label="流程" value="flow"></el-option>
                                        <el-option label="表单" value="form"></el-option>
                                    </el-select>-->
                                    <el-input placeholder="描述" maxlength="60" v-model="mainDataForm.aclType"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'
    import FlowFromRole from "./FlowFromRole.vue";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: 'AclControl',
        data() {
            return {
                query: [
                    {type: 'input', label: '按钮组KEY', code: 'aclKey',exp:"upperLike"},
                    {type: 'input', label: '组名称', code: 'aclName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '按钮组KEY', code: 'aclKey', width: 150,sortable: true,align:'left'},
                    {label: '组名称', code: 'aclName', width: 300,sortable: true,align:'left'},
                    {label: '最后操作时间', code: 'updateDate', width: 120,sortable: true},
                    {label: '描述', code: 'aclType', width: 300,align:'left'},
                    //{label: '最后操作人', code: 'updateUser', width: 100},
                ],
                operations: [
                    {name: '删除',ctrlCode:"BSC", callback: this.deleteAcl},
                    {
                        name: '编辑',ctrlCode:"BBJ", callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                            this.mainDataForm.aclKeyOnly=objMain.aclKey;
                            /*this.mainDataForm=row;*/
                            this.dialogVisible=true;
                            this.aclKeyReadonly=true;
                            this.tittle='按钮组编辑'
                            this.$refs.form.resetFields();
                        }
                    }
                ],
                buttons: [{name: '新增',ctrlCode:"BXZ", icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.mainDataForm={};
                        this.aclKeyReadonly=false;
                        this.dialogVisible=true;
                        this.$nextTick(()=>{
                            this.$refs.form.resetFields();
                        });
                        this.tittle='按钮组新增'
                    }}],
                dialogVisible: false,
                aclKeyReadonly:false,
                mainDataForm: {},
                mainDataFormval:{},
                formRules: {
                    aclKey: [{required: true,validator:isLetterAndNumber, message: '请输入KEY仅由英文字母，数字以及下划线组成', trigger: 'blur'}],
                    aclName: [{required: true, message: '请输入组名称', trigger: 'blur',transform:function (val) {
                            if(val){
                                return val.trim();
                            }
                            return val;
                        }
                    }],
                    aclType: [{required: true, message: '请输入类型名称', trigger: 'blur',transform:function (val) {
                            if(val){
                                return val.trim();
                            }
                            return val;
                        }
                    }],
                },
                tittle:''
            }
        },
        methods: {
            editAcl(row,index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                if(row&&(row.aclKey=="AF_ASSIGNER"||row.aclKey=="SYS_ADMIN"||row.aclKey=="AF_ADMIN")){
                    this.$message.error("全局ACL不允许删除");
                    return;
                }

                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/sysAcl/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            save(){
                this.$refs['form'].validate((valid) => {
                    //console.log("form", valid)
                    if (valid) {
                        let obj =this.mainDataForm;
                        if(this.aclKeyReadonly){
                            if(this.mainDataForm.aclKey!=this.mainDataForm.aclKey){
                                this.$message.error("key不允许修改");
                                return;
                            }
                        }
                        this.$axios.post('/bpm/sysAcl/saveOrUpdate', obj).then(result => {
                            this.$message.success("成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        components: {
            FlowFromRole,
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
