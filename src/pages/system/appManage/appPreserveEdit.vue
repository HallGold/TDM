<template>
    <div>
        <el-dialog v-dialogDrag
                   :title="title"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="750px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <el-form :model="mainDataForm" label-width="100px" :rules="formRules" ref="form">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="菜单编码" prop="menulistCode">
                            <el-input v-model="mainDataForm.menulistCode" :disabled="isEdit" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menulistName">
                            <el-input v-model="mainDataForm.menulistName" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="是否启用" prop="isEnabled">
                            <el-checkbox v-model="mainDataForm.isEnabled"
                                         :disabled="isEdit"
                                         true-label="Y"
                                         false-label="N"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="资源定义" prop="isDefappres">
                            <el-checkbox v-model="mainDataForm.isDefappres"
                                         true-label="Y"
                                         false-label="N"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="菜单描述" prop="remark">
                            <el-input type="textarea" rows="3" v-model="mainDataForm.remark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "appPreserveEdit",
        props: {
            title: String,
            mainDataForm: {},
            isSuccess: Function,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                appId: '',
                appCode: '',
                dialogVisible: false,        //弹窗的开关属性
                formRules: {//表单字段规则
                    menulistCode: [{required: true, whitespace: true, message: '请输入菜单编码', trigger: 'blur'}],
                    menulistName: [{required: true, whitespace: true, message: '请输入菜单名称', trigger: 'blur'}]
                }
            }
        },
        methods: {
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.isEdit) {
                            this.mainDataForm.appid = this.appId;
                            this.mainDataForm.appCode = this.appCode;
                            delete this.mainDataForm.oid;
                        }
                        this.$axios.post("/permission/res/app/outer/save/menulist_info", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.isSuccess();
                            this.closeDialog();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        })
                    }
                })
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开
             */
            openDialog(appId, appCode) {
                this.appId = appId;
                this.appCode = appCode;
                this.dialogVisible = true;
            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
