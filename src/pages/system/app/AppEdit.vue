<template>
    <el-dialog
            custom-class="ice-dialog"
            :title="title"
            :visible.sync="dialogVisible"
            :append-to-body="true"
            :close-on-click-modal="false"
            width="800px">
        <el-form :model="formData" :rules="detailRules" label-position="right" class="conditon-bar"
                 ref="form" style="margin-top: 10px">
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="名称" label-width="100px" prop="name">
                        <el-input placeholder="名称" v-model="formData.name" maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="APP图标" label-width="100px" prop="smallIconUrl">
                        <ice-image-uploader v-model="formData.smallIconUrl" class="avatar-uploader"></ice-image-uploader>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="编码" label-width="100px" prop="appCode">
                        <el-input placeholder="由数字英文字母下划线组成"
                                  v-model="formData.appCode"
                                  @keyup.native="codeItem"
                                  maxlength="30"
                                  :disabled="isUpData"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="12">
                    <el-form-item label="启用状态" label-width="100px" prop="enabled">
                        <el-radio-group v-model="formData.enabled">
                            <el-radio v-for="item in objectValueToArray(ENABLED_ENUM.properties).reverse()"
                                      :label="item.code" :key="item.code">
                                {{item.name}}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="URL" label-width="100px"  prop="url">
                        <el-input placeholder="URL" type="textarea" v-model="formData.url" :rows="3" maxlength="100"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="备注"  label-width="100px" prop="desp">
                        <el-input placeholder="备注" type="textarea" v-model="formData.desp" :rows="3" maxlength="256"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="saveClickHandler">保存</el-button>
            <el-button type="info" @click="closeHandler">返回</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import OrgComm from "@/pages/system/comm/OrgComm";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";

    export default {
        name: "AppEdit",
        components: {IceImageUploader},
        mixins: [OrgComm],
        data() {
            return {
                dialogVisible: false,
                title:'',
                isUpData:false,
                formData: {
                    oid: ``,
                    name: ``,
                    smallIconUrl:'',
                    openType: ``,
                    appCode: '',
                    url: ``,
                    desp: "",
                    visible: "",
                    enabled: 1
                },
                extendFormData: {},
                detailRules: {
                    typeCode: [{required: true,whitespace: true, message: '请选择类型', trigger: 'blur'}],
                    name: [{required: true,whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    appCode: [
                        {required: true,whitespace: true, message: '请输入编码', trigger: 'blur'},
                        {min: 1, max: 16, message: `编码长度在1-16之间`, trigger: 'blur'},
                        {validator: isLetterAndNumber, trigger: 'blur'}
                    ],
                },
            }
        },
        methods: {
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem(){
                this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/,'');
            },
            open(record) {
                let _this = this;
                if (!!record) {
                    if (!!record.oid) {
                        //编辑
                        _this.loadData(record.oid).then(() => {
                        });
                        this.title = "编辑";
                        this.isUpData = true;
                    } else {
                        //新增
                        Object.assign(this.formData, record);
                        this.title = "新增";
                        this.isUpData = false;
                    }
                    _this.dialogVisible = true;
                    // });
                } else {
                    this.$message.error("页面参数为空!")
                }
            },
            loadData(oid) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ACTIONS_ENUM.APP.LOAD_SINGLE, {oid: oid}, [res => {
                        Object.assign(_this.formData, res.data);
                        resolve();
                    }, res => {
                        reject(res);
                    }, res => {
                        reject(res);
                    }]);
                });
            },
            closeHandler(data) {
                /*this.$emit("beforeClose", data);*/
                this.dialogVisible = false;
            },
            close() {
                //释放内存
                this.formData = {};
                this.dialogVisible = false;
            },
            saveClickHandler() {
                let _this = this;
                this.axios(this.ACTIONS_ENUM.APP.SAVE_SINGLE, this.formData,
                    [res => {
                        _this.closeHandler(Object.assign(_this.formData, res.data));
                        this.$parent.refresh();
                    }]);
            },
        },
        mounted() {

        },
    }
</script>

<style scoped>
    .avatar-uploader{
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;
    }
</style>
