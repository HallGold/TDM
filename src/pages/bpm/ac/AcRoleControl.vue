<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="流程角色管理"
                        data-url="/bpm/AcRole/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth="200"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

        <ice-dialog :title="tittle" :visible.sync="dialogVisible" width="600px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" ref="form">
                    <ice-grid-layout name="流程角色信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="角色KEY:" label-width="100px" prop="roleKey">
                                    <el-input placeholder="角色KEY" maxlength="40" onchange="this.value=this.value.toUpperCase()"
                                              v-model="mainDataForm.roleKey" :disabled="aclKeyReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="角色名称:" label-width="100px" prop="roleName">
                                    <el-input placeholder="名称" maxlength="50" v-model="mainDataForm.roleName"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="角色类型:" label-width="100px" prop="roleName">
                                    <el-select v-model="mainDataForm.roleType" placeholder="请选择">
                                        <el-option
                                                v-for="item in roleTypeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>


        <ice-dialog :title="tittle" :visible.sync="AcRoleUserdialogVisible" width="800px" heigth="500px">
            <ac-role-user-control :role="mainDataForm"></ac-role-user-control>
        </ice-dialog>

        <ice-dialog :title="tittle" :visible.sync="AcRoleFlowdialogVisible" height="600px" width="800px">
            <ac-role-flow-control :role="mainDataForm"></ac-role-flow-control>
        </ice-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'
    import AcRoleUserControl from '@/pages/bpm/ac/AcRoleUserControl.vue'
    import AcRoleFlowControl from '@/pages/bpm/ac/AcRoleFlowControl.vue'
    import IceDialog from "../../../components/common/base/IceDialog";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";

    export default {
        name: 'AcRoleControl',
        props: {},
        data() {
            return {
                roleTypeOptions: [{value: "common", label: "普通"}, {value: "manage", label: "管理"}],
                query: [
                    {type: 'input', label: 'KEY', code: 'roleKey', exp: "upperLike"},
                    {type: 'input', label: '名称', code: 'roleName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: 'KEY', code: 'roleKey', width: 200,sortable: true,align:'left'},
                    {label: '名称', code: 'roleName', width: 300,sortable: true,align:'left'},
                    {
                        label: '类型', code: 'roleType', width: 100, formatter: function (row) {
                            if (row.roleType == "common") {
                                return "普通";
                            }
                            return "管理";
                        },sortable: true
                    },
                    {label: '最后操作人', code: 'updateUser', width: 150,sortable: true,align:'left'},
                    {label: '最后操作时间', code: 'updateDate', width: 120}],
                operations: [
                    {
                        name: '删除', ctrlCode: "BSC", callback: this.deleteAcl, isShow: function (row) {
                            if (row.roleKey != 'ROLE_APPLY_ALL' && row.roleKey != 'RLOE_ADMIN_ALL') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '编辑', ctrlCode: "BBJ", callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                            this.dialogVisible = true;
                            this.aclKeyReadonly = true;
                            this.mainDataForm.roleKeyOnly = objMain.roleKey;
                            this.tittle = '编辑'
                        }
                    }/*,
                    {
                        name: '角色人员',ctrlCode:"BJSRY", callback: (row) => {
                        this.mainDataForm=row;
                        this.AcRoleUserdialogVisible=true;
                        this.aclKeyReadonly=true;
                        this.tittle='角色人员'
                    },isShow: function (row) {
                            if (row.roleKey != 'ROLE_APPLY_ALL') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '角色流程',ctrlCode:"BJSLC", callback: (row) => {
                        this.mainDataForm=row;
                        this.AcRoleFlowdialogVisible=true;
                        this.tittle='角色流程'
                    }
                    }*/
                ],
                buttons: [{
                    name: '新增', icon: 'el-icon-plus', ctrlCode: "BXZ", type: 'primary', callback: () => {
                        this.mainDataForm = {};
                        this.aclKeyReadonly = false;
                        this.dialogVisible = true;
                        this.tittle = '新增'
                    }
                }],
                dialogVisible: false,
                AcRoleUserdialogVisible: false,
                AcRoleFlowdialogVisible: false,
                aclKeyReadonly: false,

                mainDataForm: {},
                formRules: {
                    roleKey: [{
                        required: true,
                        message: '请输入KEY仅由英文字母，数字以及下划线组成',
                        trigger: 'blur',
                        validator: isLetterAndNumber
                    }],
                    roleName: [{
                        required: true, message: '请输入名称', trigger: 'blur', transform: function (val) {
                            return val.trim();
                        }
                    }],
                    roleType: [{required: true, message: '请选择类型', trigger: 'blur'}]
                },
                tittle: ''
            }
        },
        methods: {
            editAcl(row, index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                if (row && row.roleKey && (row.roleKey.indexOf("ALL") != -1)) {
                    this.$message.error("全局角色不允许删除");
                    return;
                }
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/AcRole/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        //debugger
                        this.$message.error(error.msg)
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            save() {
                this.$refs['form'].validate((valid) => {
                    //console.log("form", valid)
                    if (valid) {
                        let obj = this.mainDataForm;
                        if (this.aclKeyReadonly) {
                            if (this.mainDataForm.roleKey != this.mainDataForm.roleKeyOnly) {
                                this.$message.error("key不允许修改");
                                return;
                            }
                        }
                        this.$axios.post('/bpm/AcRole/saveOrUpdate', obj).then(result => {
                            this.$message.success("新增成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            showAcRoleUserdialog() {
                this.AcRoleUserdialogVisible = true;
            }
        },
        components: {
            IceDialog,
            IceQueryGrid,
            AcRoleUserControl,
            AcRoleFlowControl,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
