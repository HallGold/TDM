<template>
    <el-container style="height: 100%;overflow-y: auto;">
        <el-main>
            <el-form :rules="rules" label-width="100px" ref="form" :model="formModel">
                <el-form-item label="系统安装配置手册" prop="pzsc">
                    <div class="attachmentBorder">
                        <upload-attachment :is-edit="isEdit"
                                           :remove-call-back="removeAttachment"
                                           :dev-id="oid" :child-type="attachment.institute_pzsc"
                                           :upload-success="uploadSuccessHandler"
                                           :file-info="formModel.reFileVoList"></upload-attachment>
                    </div>
                </el-form-item>
                <el-form-item label="系统需求说明书" prop="zyxq">
                    <div class="attachmentBorder">
                        <upload-attachment :is-edit="isEdit"
                                           :remove-call-back="removeAttachment"
                                           :dev-id="oid" :child-type="attachment.institute_zyxq"
                                           :upload-success="uploadSuccessHandler"
                                           :file-info="formModel.reFileVoList"></upload-attachment>
                    </div>
                </el-form-item>
                <el-form-item label="系统运维手册" prop="ywsc">
                    <div class="attachmentBorder">
                        <upload-attachment :is-edit="isEdit"
                                           :remove-call-back="removeAttachment"
                                           :dev-id="oid" :child-type="attachment.institute_ywsc"
                                           :upload-success="uploadSuccessHandler"
                                           :file-info="formModel.reFileVoList"></upload-attachment>
                    </div>
                </el-form-item>
                <el-form-item label="系统程序包">
                    <div class="attachmentBorder">
                        <upload-attachment :is-edit="isEdit"
                                           :remove-call-back="removeAttachment"
                                           :dev-id="oid" :child-type="attachment.institute_cxb"
                                           :upload-success="uploadSuccessHandler"
                                           :file-info="formModel.reFileVoList"></upload-attachment>
                    </div>
                </el-form-item>
            </el-form>
        </el-main>
        <el-footer v-if="isEdit">
            <div class="ice-button-bar">
                <el-button type="primary" @click="sure">确定</el-button>
                <el-button @click="cancel">取消</el-button>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
    import UploadAttachment from "../../dev/comm/uploadAttachment";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import attachment from "../comm/attachment";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"

    export default {
        name: "factoryUpload",
        components: {IceGridLayout, UploadAttachment},
        mixins: [attachment, devComm],
        props: {
            oid: {
                type: String,
                default: ""
            },
            isEdit: {
                type: Boolean,
                default: true
            },
            attachment: {
                type: Object,
                default: () => {
                    return {}
                }
            },
            fileList: {
                type: Array
            }
        },
        data() {
            let _this = this;
            let validateFile = function (rule, value, callback) {
                if (!_this.attachmentMap[rule.field] || _this.attachmentMap[rule.field].length == 0) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            return {
                formModel: {
                    reFileVoList: [],
                },
                rules: {
                    pzsc: {required: true, message: '请上传系统配置手册', validator: validateFile, trigger: 'blur'},
                    zyxq: {required: true, message: '请上传系统需求说明书', validator: validateFile, trigger: 'blur'},
                    ywsc: {required: true, message: '请上传系统运维手册', validator: validateFile, trigger: 'blur'},
                },
                attachmentMap: {}
            }
        },
        methods: {
            /**
             * 删除附件回调方法
             */
            removeAttachment(res, childType) {
                // this.mainData.reFileVoList = res;
                this.attachmentMap[childType] = res;
                this.setReFileVoList(res, childType, this.formModel.reFileVoList);
            },
            /**
             * 附件上传成功后回调
             */
            uploadSuccessHandler(data, childType) {
                // this.mainData.reFileVoList = data;
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType, this.formModel.reFileVoList);
            },
            /**
             * 获取附件list
             * @returns {[]}
             */
            getFileList() {
                return this.formModel.reFileVoList;
            },
            /**
             * 批量删除
             * @param list
             * @param deleteList
             */
            deletes(list, deleteList) {
                for (let i = 0; i < deleteList.length; i++) {
                    list.splice(list.indexOf(deleteList[i]), 1);
                }
            },
            /**
             * 组装附件map
             */
            assembleAttachmentMap() {
                if (this.formModel.reFileVoList) {
                    for (let i = 0; i < this.formModel.reFileVoList.length; i++) {
                        let _attachment = this.formModel.reFileVoList[i];
                        if (!this.attachmentMap[_attachment.childType1]) {
                            this.attachmentMap[_attachment.childType1] = [_attachment];
                        } else {
                            this.attachmentMap[_attachment.childType1].push(_attachment);
                        }
                    }
                }
            },
            /**
             * 确定按钮响应事件
             */
            sure() {
                this.assembleAttachmentMap();
                let _this = this;
                this.$refs.form.validate(valid => {
                    if (valid) {
                        _this.$emit("selectComfirm", this.formModel.reFileVoList);
                    }
                });
            },
            /**
             * 取消按钮响应事件
             */
            cancel() {
                this.$emit("selectCannel");
            }
        },
        mounted() {
            this.formModel.reFileVoList = this.fileList || [];
        }
    }
</script>

<style scoped>
    @import "../../dev/style/edit.less";

    .divContent {
        display: flex;
        align-items: center;
        background-color: white;
        width: 100%;
    }

    .text {
        width: 80px;
        text-align: right;
        padding-right: 12px;
    }

</style>