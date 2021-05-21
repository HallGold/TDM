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
        <el-form :model="mainDataForm"
                 :rules="formRules"
                 ref="form"
                 style="margin-top: 15px"
                 label-width="100px">
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="功能名称" prop="name">
                        <el-input v-model="mainDataForm.name" maxlength="30" @input="funcNameChanged"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="功能编码" prop="code">
                        <el-input v-model="mainDataForm.code" maxlength="30" :disabled="isEdit"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="功能类型" prop="pageFuncType">
                        <ice-select v-model="mainDataForm.pageFuncType"
                                    :disabled="isEdit"
                                    map-type-code="PAGE_FUNCTION_TYPE"
                                    @change="$nextTick(()=>{$refs.form.validateField('pageFuncType',error=>{})})">
                        </ice-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="排序" prop="code">
                        <el-input-number v-model="mainDataForm.displayno" :max="99"></el-input-number>
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
                    <el-form-item label="启用数据授权" prop="dataAuthEnabled">
                        <el-checkbox true-label="Y" false-label="N"
                                     v-model="mainDataForm.dataAuthEnabled"></el-checkbox>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="功能描述" prop="remark">
                        <el-input v-model="mainDataForm.remark" type="textarea" rows="3" maxlength="256"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
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
        name: "functionEdit",
        components: {IceSelect},
        props: {
            title: String,
            isSuccess: Function,
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                // children:[],
                dialogVisible: false,

                mainDataForm: {
                    name: '',
                    code: '',
                    itemType: 'button',
                    itemTypeName: '功能按钮',
                    pageFuncType: 'F10',
                    funcAuthEnabled: 'Y',
                    dataAuthEnabled: 'Y',
                    dataParentKey: '',
                    remark: ''
                },
                formRules: {
                    pageFuncType: [{required: true, message: '请选择页面功能类型', trigger: 'change'}]
                }
            }
        },
        methods: {
            funcNameChanged(e) {
                if (!this.isEdit) {
                    if (this.mainDataForm.pageFuncType == 'F10' || this.mainDataForm.pageFuncType == 'C00') {
                        this.mainDataForm.code = 'B' + pinyin4js.convertToPinyinString(e, '', pinyin4js.FIRST_LETTER).toUpperCase();
                    } else {
                        this.mainDataForm.code = 'B' + pinyin4js.convertToPinyinString(e, '', pinyin4js.FIRST_LETTER).toUpperCase();
                    }
                }
            },
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/permission/res/page/outer/save/pagefunc_base", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.closeDialog();
                            /*this.children.push(success.data);*/
                            this.isSuccess();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
                    }
                });
            },
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            openDialog(row) {
                if (this.isEdit) {
                    this.mainDataForm = {...row};
                    this.mainDataForm.children = []
                } else {
                    this.mainDataForm = {
                        name: '',
                        code: '',
                        itemType: 'button',
                        itemTypeName: '功能按钮',
                        pageFuncType: 'F10',
                        funcAuthEnabled: 'Y',
                        dataAuthEnabled: 'Y',
                        dataParentKey: row.dataKey,
                        remark: ''
                    };
                }
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
