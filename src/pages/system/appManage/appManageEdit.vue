<template>
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisible"
                width="750px"
                append-to-body
                :before-close="closeDialog"
                :close-on-click-modal="false">
        <el-form :model="mainDataForm" :rules="formRules"
                 ref="form">
            <ice-grid-layout name="APP信息" :columns=1 gutter="0px" :expandable=false>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="名称" label-width="100px" prop="name">
                        <el-input placeholder="名称" v-model="mainDataForm.name" maxlength="30"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="APP图标" label-width="100px" prop="smallIconUrl">
                        <ice-image-uploader v-model="mainDataForm.smallIconUrl"
                                            class="avatar-uploader"></ice-image-uploader>
                        <ice-select v-model="mainDataForm.dataSecretLevcode"
                                    map-type-code="DATA_SECRET_LEVEL"
                                    filterable placeholder="请选择">
                        </ice-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="12">
                    <el-form-item label="编码" label-width="100px" prop="appCode">
                        <el-input placeholder="由数字英文字母下划线组成"
                                  v-model="mainDataForm.appCode"
                                  @keyup.native="codeItem"
                                  maxlength="30"
                                  :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40" v-if="!isEdit">
                <el-col :span="12">
                    <el-form-item label="启用状态" label-width="100px" prop="enabled">
                        <el-radio-group v-model="mainDataForm.enabled">
                            <el-radio v-for="item in objectValueToArray(ENABLED_ENUM.properties).reverse()"
                                      :label="item.code" :key="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="40" v-if="$userInfo.userType == 0xFF">
                <el-col :span="12">
                    <el-form-item label="是否可见" label-width="100px" prop="visible">
                        <el-radio-group v-model="mainDataForm.visible">
                            <el-radio v-for="item in objectValueToArray(YES_NO_ENUM.properties).reverse()"
                                      :label="item.code" :key="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
                <el-row>
                    <div style="height: 15px;"></div>
                </el-row>
            <el-row :gutter="40">
                <el-col :span="12" v-if="$userInfo.userType == 0xFF">
                    <el-form-item label="APP类型" label-width="100px" prop="appType">
                        <el-select v-model="mainDataForm.appType" placeholder="请选择">
                            <el-option v-for="item in appTypeMap"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序" label-width="100px" prop="displayno">
                        <el-input-number v-model="mainDataForm.displayno" :disabled="mainDataForm.doEdit < 2"
                                         :min="1" :max="10000"></el-input-number>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="24">
                    <el-form-item label="URL" label-width="100px" prop="url">
                        <el-input placeholder="URL" type="textarea" v-model="mainDataForm.url" :rows="2"
                                  maxlength="100" :disabled="mainDataForm.doEdit < 2"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="40">
                <el-col :span="24">
                    <el-form-item label="备注" label-width="100px" prop="desp">
                        <el-input placeholder="备注" type="textarea" v-model="mainDataForm.desp" :rows="3"
                                  maxlength="256" :disabled="mainDataForm.doEdit < 2"></el-input>
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
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "appManageEdit",
        components: {IceGridLayout, IceImageUploader},
        mixins: [OrgComm],
        props: {
            title: {
                type: String,
                default: ''
            },
            mainDataForm: {
                dataSecretLevcode: '1'
            },
            isSuccess: Function,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogVisible: false,       //弹窗开关属性
                formRules: {//表单字段规则
                    typeCode: [{required: true, whitespace: true, message: '请选择类型', trigger: 'blur'}],
                    name: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    appCode: [
                        {required: true, whitespace: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 16, message: `编码长度在1-16之间`, trigger: 'blur'},
                        {validator: isLetterAndNumber, trigger: 'blur'}
                    ],
                },
                appTypeMap: [
                    {value: 'B', label: '业务'},
                    {value: 'S', label: '系统管理'}
                ]
            }
        },
        methods: {
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                this.mainDataForm.appCode = this.mainDataForm.appCode.replace(/[^\w||_]+$/, '');
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
                        this.$axios.post("/permission/res/app/outer/save/appinfo", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
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
             * 打开弹窗
             */
            openDialog() {
                // console.log('this.mainDataFrom : %o', this.mainDataForm)
                this.dialogVisible = true;

            },
            resetForm() {
                this.$refs.form.resetFields();
            }
        },
        mounted() {
        },
    }
</script>

<style scoped>
    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;
    }
</style>
