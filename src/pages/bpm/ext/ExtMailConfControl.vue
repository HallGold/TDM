<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="邮箱账号配置"
                        data-url="/bpm/ExtMailConf/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth="250"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
<!--
            <div slot="operation-bar">
                1215454
            </div>-->
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="600px" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">

                    <el-form-item label="邮箱标识:" label-width="100px" prop="serviceKey">
                            <el-input placeholder="邮箱标识KEY" v-model="mainDataForm.serviceKey" :disabled="aclKeyReadonly"></el-input>
                    </el-form-item>
                    <el-form-item label="服务邮箱:" label-width="100px" prop="serviceEmail">
                        <el-input placeholder="服务邮箱" v-model="mainDataForm.serviceEmail"></el-input>
                    </el-form-item>

                    <el-form-item label="代理服务器:" label-width="100px" prop="serviceHose">
                        <el-input placeholder="代理服务器" v-model="mainDataForm.serviceHose"></el-input>
                    </el-form-item>
                    <el-form-item label="端口:" label-width="100px" prop="servicePort">
                        <el-input placeholder="端口" v-model="mainDataForm.servicePort"></el-input>
                    </el-form-item>

                    <el-form-item label="发送者:" label-width="100px" prop="sender">
                        <el-input placeholder="发送者" v-model="mainDataForm.sender"></el-input>
                    </el-form-item>
                    <el-form-item label="发送者密码:" label-width="100px" prop="password">
                        <el-input placeholder="发送者密码" v-model="mainDataForm.password"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="save">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>


        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="AcRoleUserdialogVisible"
                   min-width="800px"  heigth="500px" append-to-body :close-on-click-modal="false">
            <ac-role-user-control  :role="mainDataForm"></ac-role-user-control>
        </el-dialog>

        <el-dialog v-dialogDrag :title="tittle" custom-class="ice-dialog" center :visible.sync="AcRoleFlowdialogVisible"
                   min-width="800px"  heigth="500px" append-to-body :close-on-click-modal="false">
            <ac-role-flow-control  :role="mainDataForm"></ac-role-flow-control>
        </el-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from '@/components/common/base/IceQueryGrid'
    import IceGridLayout from '@/components/common/base/IceGridLayout.vue'

    export default {
        name: 'ExtMailConfControl',
        props:{

        },
        data() {
            return {
                query: [
                    {type: 'input', label: '邮箱标识', code: 'serviceKey',value:''},
                    {type: 'input', label: '服务邮箱', code: 'serviceEmail',value:''}
                ],
                columns: [
                   {code: 'oid', hidden: true},
                    {label: '邮箱标识', code: 'serviceKey', width: 160},
                    {label: '服务邮箱', code: 'serviceEmail', width: 200},
                    {label: '代理服务器', code: 'serviceHose', width: 100},
                    {label: '端口', code: 'servicePort', width: 100},
                    {label: '发送者', code: 'sender', width: 100},
                    {label: '发送者密码', code: 'password', width: 100},
                    {label: '最后操作时间', code: 'updateDate', width: 130}],
                formRules: {
                    serviceKey: [{required: true, message: '请输入邮箱标识', trigger: 'blur'}],
                    serviceEmail: [{required: true, message: '请输入服务邮箱', trigger: 'blur'}],
                    serviceHose: [{required: true, message: '请输入代理服务器', trigger: 'blur'}],
                    servicePort: [{required: true, message: '请输入端口', trigger: 'blur'}],
                    sender: [{required: true, message: '请输入发送者', trigger: 'blur'}],
                    password: [{required: true, message: '请输入发送者密码', trigger: 'blur'}]
                },
                operations: [
                    {name: '删除', callback: this.deleteAcl},
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                            this.dialogVisible=true;
                            this.aclKeyReadonly=true;
                            this.tittle='编辑'
                        }
                    }
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.mainDataForm={};
                        this.aclKeyReadonly=false;
                        this.dialogVisible=true;
                        this.tittle='新增'
                    }}],
                dialogVisible: false,
                AcRoleUserdialogVisible:false,
                AcRoleFlowdialogVisible:false,
                aclKeyReadonly:false,

                mainDataForm: {},
                tittle:''
            }
        },
        methods: {
            editAcl(row,index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/ExtMailConf/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
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
                        this.$axios.post('/bpm/ExtMailConf/saveOrUpdate', obj).then(result => {
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
            showAcRoleUserdialog(){
                this.AcRoleUserdialogVisible=true;
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
