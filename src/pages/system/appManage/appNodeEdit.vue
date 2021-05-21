<template>
    <div>
        <el-dialog v-dialogDrag
                   :title="title"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="1000px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <el-form :model="mainDataForm" :rules="formRules" label-width="100px" ref="form" style="margin-top: 15px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="名称" prop="name">
                            <el-input v-model="mainDataForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="打开方式" prop="openType">
                            <ice-select v-model="mainDataForm.openType" placeholder="请选择" map-type-code="Menu_OpenType">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="页面" prop="pageName">
                            <el-input v-model="mainDataForm.pageName" readonly
                                      clearable>
                                <i slot="suffix" class="el-icon-s-tools" @click="choosePage"
                                   style="padding-right: 10px;color: #5daf34"></i>
                                <i slot="suffix" class="el-icon-delete" @click="chooseClear"
                                   style="padding-right: 5px;color: #e04735"></i>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="URL" prop="url">
                            <el-input v-model="mainDataForm.url" readonly placeholder="由页面带出"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row :gutter="60">-->
                    <!--<el-col :span="12">-->
                        <!--<el-form-item label="大图标" prop="bigIconUrl">-->
                            <!--<ice-image-uploader v-model="mainDataForm.bigIconUrl"-->
                                                <!--class="avatar-uploader"></ice-image-uploader>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <!--<el-col :span="12">-->
                        <!--<el-form-item label="小图标" prop="smallIconUrl">-->
                            <!--<ice-image-uploader v-model="mainDataForm.smallIconUrl"-->
                                                <!--class="avatar-uploader"></ice-image-uploader>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                <!--</el-row>-->
                <!--<br/><br/><br/><br/>-->
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="是否可见" prop="isVisiblable">
                            <el-checkbox v-model="mainDataForm.isVisiblable"
                                         true-label="Y"
                                         false-label="N"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="排序" prop="sequencing">
                            <el-input-number v-model="mainDataForm.sequencing"
                                             controls-position="right"
                                             :min="0"
                                             :max="99"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="是否启用" prop="enabled">
                            <el-checkbox v-model="mainDataForm.enabled" true-label="1" false-label="0"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
        <page-edit ref="pageEdit" :selectedHanlder="selectedHanlder"></page-edit>
    </div>

</template>

<script>
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import PageEdit from "../informationPreserve/pageEdit";
    import IceSelect from "../../../components/common/base/IceSelect";


    export default {
        name: "appNodeEdit",
        components: {IceSelect, PageEdit, IceImageUploader},
        props: {
            title: String,
            mainDataForm: {},
            isEdit: {
                type: Boolean,
                default: false
            },
            isSuccess: Function
        },
        data() {
            return {
                dialogVisible: false,        //弹框的开关属性
                menuListId: '',              //所属菜单ID
                parentId: '',                //父节点ID
                appId: '',
                appCode: '',
                formRules: {//表单字段规则
                    name: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    /*pageName: [{required: true, whitespace: true, message: '请选择页面', trigger: 'change'}],//测试暂时屏蔽*/
                }
            }
        },
        methods: {
            selectedHanlder(rows) {
                this.mainDataForm.pageName = rows[0].pageName;
                this.mainDataForm.pageId = rows[0].oid;
                this.mainDataForm.url = rows[0].pageUrl;
                this.mainDataForm.name = rows[0].pageName;
            },
            /**
             * 选择页面
             */
            choosePage() {
                this.$refs.pageEdit.openDialog();
            },
            /**
             * 清除所选页面
             */
            chooseClear() {
                this.mainDataForm.pageName = '';
                this.mainDataForm.pageId = '';
                this.mainDataForm.url = '';
            },
            /**
             *保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.isEdit) {
                            this.mainDataForm.menuListId = this.menuListId;
                            this.mainDataForm.parentId = this.parentId;
                            this.mainDataForm.appId = this.appId;
                            this.mainDataForm.appCode = this.appCode;
                            delete this.mainDataForm.oid
                        }
                        this.$axios.post("/permission/res/app/outer/save/appfunc_info", this.mainDataForm).then(success => {
                            this.$message.success("保存成功");
                            this.isSuccess();
                            this.closeDialog();
                        }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
                    }
                })
            },
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(parentId, menuListId, appId, appCode) {
                this.menuListId = menuListId;
                this.parentId = parentId;
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
    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;
    }
</style>
