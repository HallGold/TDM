<template>
    <el-dialog v-dialogDrag
               :title="title"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="750px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div class="outer">
            <div class="inner">
                <el-form :model="mainDataForm"
                         :rules="formRules"
                         ref="form"
                         style="margin-top: 15px"
                         label-width="100px">

                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="页面名称" prop="pageName">
                                <el-input v-model="mainDataForm.pageName"
                                          maxlength="100" @input="pageNameChanged"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="页面编码" prop="pageCode">
                                <el-input v-model="mainDataForm.pageCode"
                                          :disabled="isEdit"
                                          maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="所属模块" prop="logEnabled">
                                <el-input v-model="mainDataForm.a" readonly></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所属子模块" prop="submodelId">
                                <el-input v-model="mainDataForm.submodelId" readonly></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>-->
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="页面分组" prop="pageGroup">
                                <ice-select v-model="mainDataForm.pageGroup"
                                            map-type-code="PAGE_GROUP"
                                            @change="$nextTick(()=>{$refs.form.validateField('pageGroup',error=>{})})">
                                </ice-select>
                                <!--<el-select v-model="mainDataForm.pageGroup">
                                    <el-option label="分组一" value="1"></el-option>
                                    <el-option label="分组二" value="2"></el-option>
                                </el-select>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="页面类型" prop="pageType">
                                <ice-select v-model="mainDataForm.pageType"
                                            map-type-code="PAGE_TYPE"
                                            @change="$nextTick(()=>{$refs.form.validateField('pageType',error=>{})})">
                                </ice-select>
                                <!--<el-select v-model="mainDataForm.pageType">
                                    <el-option label="类型一" value="1"></el-option>
                                    <el-option label="类型二" value="2"></el-option>
                                </el-select>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="页面Url" prop="pageUrl">
                                <el-input v-model="mainDataForm.pageUrl"
                                          maxlength="500" type="textarea" rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="页面描述" prop="pageDesc">
                                <el-input v-model="mainDataForm.pageDesc"
                                          maxlength="100" type="textarea" rows="3"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="启用功能授权" prop="funcAuthEnabled">
                                <el-checkbox true-label="Y" false-label="N"
                                             v-model="mainDataForm.funcAuthEnabled"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="授权模式" prop="funcAuthMode">
                                <ice-select v-model="mainDataForm.funcAuthMode"
                                            map-type-code="funcAuthMode"
                                            @change="$nextTick(()=>{$refs.form.validateField('funcAuthMode',error=>{})})">
                                </ice-select>
                                <!--<el-select v-model="mainDataForm.funcAuthMode">
                                    <el-option label="模式一" value="A"></el-option>
                                    <el-option label="模式二" value="P"></el-option>
                                </el-select>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-col :span="24">
                        <el-form-item label="启用数据隔离" prop="dataAuthEnabled">
                            <el-checkbox true-label="Y" false-label="N"
                                         v-model="mainDataForm.dataAuthEnabled"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-form>
            </div>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save">保存</el-button>
            <el-button type="info" @click="closeDialog">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import pinyin4js from 'pinyin4js';

    export default {
        name: "addEdit",
        components: {IceSelect},
        props: {
            isSuccess: Function,
            mainDataForm: {},
            title: String,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                dialogVisible: false,        //弹窗的开关属性
                formRules: {
                    pageType: [{required: true, message: '请选择页面类型', trigger: 'change'}],
                    /*funcAuthMode:[{required: true, message: '请选择授权模式', trigger: 'change'}],*/
                    pageGroup: [{required: true, message: '请选择页面分组', trigger: 'change'}],
                    pageName: [{required: true,whitespace:true, message: '请输入页面名称', trigger: 'blur'}],
                    pageCode: [{required: true,whitespace:true, message: '请输入页面编码', trigger: 'change'}],
                    pageUrl: [{required: true,whitespace:true, message: '请输入页面url', trigger: 'blur'}]
                }
            }
        },
        methods: {
            pageNameChanged(e) {
                if (!this.isEdit || !this.mainDataForm.oid || this.mainDataForm.oid == '') {
                    this.mainDataForm.pageCode = pinyin4js.convertToPinyinString(e, '', pinyin4js.FIRST_LETTER).toUpperCase();
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
                        this.$axios.post("/permission/res/page/outer/save/page_base_info", this.mainDataForm).then(success => {
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
