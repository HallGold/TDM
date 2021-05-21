<template>
    <ice-dialog v-dialogDrag
               :title="title"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <el-form :model="mainDataForm" :rules="formRules" label-width="100px" ref="form">
            <ice-grid-layout name="角色信息" :columns=1 gutter="0px" :expandable=false>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="角色名称" prop="name">
                        <el-input v-model="mainDataForm.name" maxlength="30" @input="roleNameChanged"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="角色编码" prop="code">
                        <el-input v-model="mainDataForm.code" maxlength="30" :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="角色类型" prop="type">
                        <el-select placeholder="请选择" v-model="mainDataForm.type">
                            <el-option
                                    v-for="item in roleTypeOptions"
                                    :key="item.oid"
                                    :label="item.name"
                                    :value="item.code">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序" prop="sequencing">
                        <el-input-number v-model="mainDataForm.sequencing"
                                         :min="0"
                                         :max="99"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="24">
                    <el-form-item label="角色描述" prop="desp">
                        <el-input v-model="mainDataForm.desp" type="textarea" rows="3" maxlength="256"></el-input>
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
    import pinyin4js from 'pinyin4js'
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "roleEdit",
        components: {IceGridLayout},
        props: {
            title: String,
            isSuccess: Function,
            mainDataForm: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                roleTypeOptions: [],
                dialogVisible: false,
                formRules: {//表单字段规则
                    name: [{required: true, whitespace: true, message: '请输入角色名称', trigger: 'blur'}],
                    code: [{required: true, whitespace: true, message: '请输入角色编码', trigger: 'blur'}],
                }
            }
        },
        mounted() {
            this.$axios.get('permission/dataDictionary/listByActType?typeCodes=Role_Type')
                .then(result => {
                    if (result.data[0]) {
                        this.roleTypeOptions = [];
                        for (let i = 0; i < result.data[0].appDataList.length; i++) {
                            let item = result.data[0].appDataList[i]
                            if (item.code >= 20 || this.$userInfo.userType == 0xFF) {
                                this.roleTypeOptions.push(item);
                            }
                        }
                    }
                }).catch(error => {

            })
        },
        methods: {
            roleNameChanged(e) {
                if (!this.isEdit) {
                    this.mainDataForm.code = 'ROLE_' + pinyin4js.convertToPinyinString(e, '', pinyin4js.FIRST_LETTER).toUpperCase();
                }
            },
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.isEdit) {
                            delete this.mainDataForm.oid;
                        }
                        this.$axios.post("/permission/role/outer/save/role_info", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
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
