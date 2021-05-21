<template>
    <div class="form-content">
        <el-form :model="mainData.extendData"
                 :rules="rulesReport"
                 :ref="PAGE_ENUM.REFS.FORM.REF"
                 label-width="100px">
            <ice-grid-layout :columns="3" name="许可验证">
                <el-form-item label="许可类型" prop="licenseType" layout="3">
                    <el-radio-group v-model="mainData.extendData.licenseType">
                        <el-radio v-for="(item,key) in ENUMS.PERMISSION_TYPE_DATA.properties"
                                  :key="key"
                                  :label="item.code">{{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效期" prop="validDate"
                              v-if="mainData.extendData.licenseType != ENUMS.PERMISSION_TYPE_DATA.NULL">
                    <el-date-picker v-model="mainData.extendData.validDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="序列号" prop="license"
                              v-if="mainData.extendData.licenseType == ENUMS.PERMISSION_TYPE_DATA.NUM">
                    <el-input v-model="mainData.extendData.license"></el-input>
                </el-form-item>
                <el-form-item label="许可文件" prop="" layout="3"
                              v-if="mainData.extendData.licenseType == ENUMS.PERMISSION_TYPE_DATA.FILE">
                    <div class="attachmentBorder">
                        <upload-attachment :is-edit="isEdit" :remove-call-back="removeAttachment"
                                           :dev-id="mainData.extendData.devId"
                                           :child-type="ENUMS.ATTACHMENT_MAP.dev_xkwj"
                                           :upload-success="uploadSuccessHandler"
                                           :file-info="mainData.reFileVoList"></upload-attachment>
                    </div>
                    <div class="tableTips" style="margin-top: -8px;height: 10px" v-if="validateType.xkwj">请上传许可文件</div>
                </el-form-item>
                <el-form-item label="授权账号" prop="softwareAccount" layout="3">
                    <el-input type="textarea" rows="3" v-model="mainData.extendData.softwareAccount"></el-input>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import UploadAttachment from "../comm/uploadAttachment";
    import {resetRule} from "@/pages/biz/dev/js/comm/devT.js";

    export default {
        name: "permissionProperty_storage",
        components: {UploadAttachment, IceGridLayout},
        mixins: [bizComm, devComm],
        props: {
            mainData: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                rulesReport: {//表单字段规则
                    licenseType: {required: true, message: '请选择许可类型', trigger: 'blur'},
                    validDate: {required: true, message: '请选择许可验证有效时间', trigger: 'blur'},
                    softwareAccount: {required: true, whitespace: true, message: '请输入授权账号', trigger: 'blur'},
                    license: {required: true, whitespace: true, message: '请输入序列号', trigger: 'blur'}
                },
                PAGE_ENUM: {
                    REFS: {
                        FORM: {REF: "permissionForm"}
                    }
                },
                attachment: {},
                attachmentMap: {},
                validateType: {
                    xkwj: false
                }
            }
        },
        methods: {
            /**
             * 初始化页面数据
             */
            initData() {
                //设置页面规则
                resetRule(this.rulesReport, this.mainData.commDTO.category, this.mainData.commDTO.childType);
                this.mainData.extendData = this.mainData.extendData || {};
            },
            /**
             * 删除附件回调方法
             */
            removeAttachment(res, childType) {
                // this.mainData.reFileVoList = res;
                this.attachmentMap[childType] = res;
                this.setReFileVoList(res, childType);
            },
            /**
             * 附件上传成功后回调
             */
            uploadSuccessHandler(data, childType) {
                // this.mainData.reFileVoList = data;
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType);
            },
            /**
             * 设置附件list
             */
            setReFileVoList(data, childType) {
                this.deletes(this.mainData.reFileVoList, this.findSameChildTypeList(childType));
                this.mainData.reFileVoList.push(...data);
            },
            /**
             * 删除childType一样的附件list
             */
            findSameChildTypeList(childType) {
                let list = [];
                for (let i = 0; i < this.mainData.reFileVoList.length; i++) {
                    let fileInfo = this.mainData.reFileVoList[i];
                    if (fileInfo.childType1 == childType) {
                        list.push(fileInfo);
                    }
                }
                return list;
            },
            /**
             * 校验页面数据
             * @returns {*}
             */
            validateData() {
                return Promise.all([this.$refs[this.PAGE_ENUM.REFS.FORM.REF].validate(), this.validateAttachment()]);
            },
            /**
             * 校验附件
             * @returns {Promise<any>}
             */
            validateAttachment() {
                this.assembleAttachmentMap();
                let _this = this;
                return new Promise((resolve, reject) => {
                    if (_this.mainData.extendData.licenseType == _this.ENUMS.PERMISSION_TYPE_DATA.FILE) {
                        //许可文件
                        if (!_this.attachmentMap[this.ENUMS.ATTACHMENT_MAP.dev_xkwj] || _this.attachmentMap[this.ENUMS.ATTACHMENT_MAP.dev_xkwj].length == 0) {
                            _this.validateType.xkwj = true;
                            reject('请上传许可文件,请核对!');
                        }
                        resolve();
                    }
                    resolve();
                });
            },
            /**
             * 组装附件map
             */
            assembleAttachmentMap() {
                if (this.mainData.reFileVoList) {
                    for (let i = 0; i < this.mainData.reFileVoList.length; i++) {
                        let _attachment = this.mainData.reFileVoList[i];
                        if (!this.attachmentMap[_attachment.childType1]) {
                            this.attachmentMap[_attachment.childType1] = [_attachment];
                        } else {
                            this.attachmentMap[_attachment.childType1].push(_attachment);
                        }
                    }
                }
            }
        },
        mounted() {
            this.initData();
            this.initPageOver();
        }
    }
</script>

<style scoped>
    @import "../../dev/style/edit.less";

    .form-content {
        width: 100%;
    }
</style>