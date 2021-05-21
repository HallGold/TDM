<template>
    <ice-dialog v-dialogDrag
               title="数据隔离策略分组维护"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-form :model="mainDataForm"
                 :rules="formRules"
                 ref="form"
                 label-width="100px">
            <ice-grid-layout name="隔离策略分组信息" :columns=1 gutter="0px" :expandable=false>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="分组名称" prop="privtypeName" label-width="120px">
                        <el-input v-model="mainDataForm.privtypeName" maxlength="30"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分组编码" prop="privtypeCode" label-width="120px">
                        <el-input v-model="mainDataForm.privtypeCode" maxlength="30" :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="分组类型" prop="privtypeType" label-width="120px">
                        <ice-select v-model="mainDataForm.privtypeType" map-type-code="PRIVTYPE_TYPE"></ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="分组连接方式" prop="mergeType" label-width="120px">
                        <!--<el-input v-model="mainDataForm.mergeType" maxlength="30"></el-input>-->
                        <el-select v-model="mainDataForm.mergeType">
                            <el-option label="AND" value="AND"></el-option>
                            <el-option label="OR" value="OR"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            </ice-grid-layout>
        </el-form>
        <div class="ice-button-bar" slot="footer">
            <el-button type="primary" size="medium" @click="save">保存</el-button>
            <el-button type="info" size="medium" @click="closeDialog">取消</el-button>
        </div>
    </ice-dialog>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    export default {
        name: "groupEdit",
        components: {IceGridLayout, IceSelect},
        props: {
            mainDataForm: {},
            isSuccess: Function,
            isEdit: {
                type: Boolean,
                default: false,
            }
        },
        data() {
            return {
                dialogVisible: false,        //弹窗的开关属性
                formRules: {//表单字段规则
                    privtypeCode: [{required: true, whitespace: true, message: '请输入分组编码', trigger: 'blur'}],
                    privtypeName: [{required: true, whitespace: true, message: '请输入分组名称', trigger: 'blur'}]
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
                            delete this.mainDataForm.oid;
                        }
                        this.$axios.post("/permission/datapriv/outer/save/privtype_info", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        })
                    }
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog() {
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
