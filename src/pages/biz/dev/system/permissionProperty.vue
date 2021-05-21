<template>
    <div class="form-content">
        <el-form :model="mainData.extendData"
                 :rules="rulesReport"
                 :ref="PAGE_ENUM.REFS.FORM.REF"
                 :disabled="!isEdit"
                 v-if="mainData.extendData"
                 label-width="100px">
            <ice-grid-layout :columns="2" name="许可验证">
                <el-form-item label="检测单位" prop="checkDeptName">
                    <el-input v-model="mainData.extendData.checkDeptName"></el-input>
                </el-form-item>
                <el-form-item label="通过离线安全测评" prop="passOfflineValid" label-width="140px">
                    <el-radio-group v-model="mainData.extendData.passOfflineValid">
                        <el-radio v-for="item in ENUMS.TRUE_AND_FALSE.properties" :key="item.code" :label="item.code">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="测评结论" layout="2"
                              v-if="mainData.extendData.passOfflineValid == ENUMS.TRUE_AND_FALSE.TRUE">
                    <upload-attachment v-if="showAttachment" :is-edit="isEdit"
                                       :remove-call-back="removeAttachment"
                                       :dev-id="mainData.extendData.devId" :child-type="attachment.dev_cpjl"
                                       :upload-success="uploadSuccessHandler"
                                       :file-info="mainData.reFileVoList"></upload-attachment>
                </el-form-item>
                <el-form-item label="测评报告" layout="2"
                              v-if="mainData.extendData.passOfflineValid == ENUMS.TRUE_AND_FALSE.TRUE">
                    <upload-attachment v-if="showAttachment" :is-edit="isEdit" :remove-call-back="removeAttachment"
                                       :dev-id="mainData.extendData.devId" :child-type="attachment.dev_cpbg"
                                       :upload-success="uploadSuccessHandler"
                                       :file-info="mainData.reFileVoList"></upload-attachment>
                </el-form-item>
                <el-form-item label="在线验证" prop="validConclusion">
                    <el-radio-group v-model="mainData.extendData.validConclusion">
                        <el-radio v-for="(item,key) in ENUMS.TRUE_AND_FALSE.properties" :key="key" :label="item.code">
                            {{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="验证时间" prop="onlineValidDate"
                              v-if="mainData.extendData.validConclusion == ENUMS.TRUE_AND_FALSE.TRUE">
                    <el-date-picker v-model="mainData.extendData.onlineValidDate"></el-date-picker>
                </el-form-item>
                <el-form-item v-if="mainData.extendData.validConclusion == ENUMS.TRUE_AND_FALSE.FALSE"></el-form-item>
                <el-form-item label="许可类型" prop="licenseType">
                    <el-radio-group v-model="mainData.extendData.licenseType">
                        <el-radio v-for="(item,key) in ENUMS.PERMISSION_TYPE_DATA.properties" :key="key"
                                  :label="item.code">{{item.name}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="有效期限" prop="validDate"
                              v-if="mainData.extendData.licenseType != ENUMS.PERMISSION_TYPE_DATA.NULL">
                    <el-date-picker v-model="mainData.extendData.validDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="许可文件" layout="2"
                              v-if="mainData.extendData.licenseType == ENUMS.PERMISSION_TYPE_DATA.FILE">
                    <upload-attachment v-if="showAttachment" :is-edit="isEdit" :remove-call-back="removeAttachment"
                                       :dev-id="mainData.extendData.devId" :child-type="attachment.dev_xkwj"
                                       :upload-success="uploadSuccessHandler"
                                       :file-info="mainData.reFileVoList"></upload-attachment>
                </el-form-item>
                <el-form-item label="序列号" prop="license" layout="2"
                              v-if="mainData.extendData.licenseType == ENUMS.PERMISSION_TYPE_DATA.NUM">
                    <el-input v-model="mainData.extendData.license"></el-input>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import uploadAttachment from "../comm/uploadAttachment";

    export default {
        name: "permissionProperty",
        components: {uploadAttachment, IceGridLayout},
        mixins: [bizComm, devComm],
        props: {
            mainData: {},
            isEdit: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            /* mainData: {
                 handler(newData) {
                     debugger
                     this.$emit("update:mainData", newData);
                 }, deep: true
             },*/
        },
        data() {
            return {
                rulesReport: {//表单字段规则
                    passOfflineValid: {required: true, message: '请选择是否通过安全测评', trigger: 'blur'},
                    validConclusion: {required: true, message: '请选择是否在线验证', trigger: 'blur'},
                    licenseType: {required: true, message: '请选择许可类型', trigger: 'blur'},
                    onlineValidDate: {required: true, message: '请选择在线验证时间', trigger: 'blur'},
                    validDate: {required: true, message: '请选择许可验证有效时间', trigger: 'blur'},
                    checkDeptName: {required: true, whitespace: true, message: '请输入检测单位', trigger: 'blur'},
                    license: {required: true, whitespace: true, message: '请输入序列号', trigger: 'blur'}
                },
                showAttachment: false,
                attachment: {},
                attachmentMap: {},
                PAGE_ENUM: {
                    REFS: {
                        FORM: {REF: "permissionForm"}
                    }
                }
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initData();
                this.$nextTick(() => this.showAttachment = true);
            },
            /**
             * 初始化页面数据
             */
            initData() {
                for (let i = 0; i < this.ENUMS.ATTACHMENT_TYPE_DATA.length; i++) {
                    let _attachment = this.ENUMS.ATTACHMENT_TYPE_DATA[i];
                    this.attachment[_attachment.code] = _attachment.code;
                }
                this.attachment.properties = this.ENUMS.ATTACHMENT_TYPE_DATA;
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
                    if (_this.mainData.extendData.passOfflineValid == _this.ENUMS.TRUE_AND_FALSE.TRUE) {
                        //测评结论
                        if (!_this.attachmentMap[this.attachment.dev_cpjl] || _this.attachmentMap[this.attachment.dev_cpjl].length == 0) {
                            _this.$alert("请上传测评结论", "提示");
                            reject();
                        }
                        //测评报告
                        if (!_this.attachmentMap[_this.attachment.dev_cpbg] || _this.attachmentMap[_this.attachment.dev_cpbg].length == 0) {
                            _this.$alert("请上传测评报告", "提示");
                            reject();
                        }
                    }
                    if (_this.mainData.extendData.licenseType == _this.ENUMS.PERMISSION_TYPE_DATA.FILE) {
                        //许可文件
                        if (!_this.attachmentMap[this.attachment.dev_xkwj] || _this.attachmentMap[this.attachment.dev_xkwj].length == 0) {
                            _this.$alert("请上传许可文件", "提示");
                            reject();
                        }
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
            //预处理任务链
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.ATTACHMENT_TYPE.CODE).then(this.initControls);
        }
    }
</script>

<style scoped>
    .form-content {
        width: 100%;
    }
</style>