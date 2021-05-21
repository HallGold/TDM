<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReadyHandler"
                       :flow-operate-btn="flowBtnClickHandler"
                       :flow-biz-data="submitBizData">
            <div slot-scope="flowScope">
                <el-form :ref="REF.FLOW_FORM" :model="UNIVERSAL.bizData" status-icon ref="online"
                         label-width="140px" :rules="RULES" :disabled="readOnly">
                    <ice-grid-layout :columns="3" name="基础信息">
                        <el-form-item label="系统用户" prop="systemUser">
                            <el-radio-group v-model="UNIVERSAL.bizData.systemUser" :disabled="flowScope.formReadonly">
                                <el-radio v-for="item in UNIVERSAL.ENUM.YES_NO.properties" :label="item.code"
                                          @change="systemUserChangeHandler">{{item.name}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="申请项" prop="itemType">
                            <el-input v-model="UNIVERSAL.bizData.itemType" :disabled="flowScope.formReadonly" readonly>
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline" :disabled="flowScope.formReadonly"
                                               @click="selectItemType"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item label="责任人" prop="dutyUser">
                            <ice-persion-selector
                                    v-model="UNIVERSAL.bizData.dutyUser"
                                    text-prop="name"
                                    code-prop="code"
                                    :mode="flowScope.formReadonly?`readonly`:UNIVERSAL.bizData.systemUser == UNIVERSAL.ENUM.YES_NO.NO?`hidden`:`onlySelect`"
                                    choose-item="single"
                                    @select-confirm="selectDutyNameConfirm">
                            </ice-persion-selector>
                            <el-input v-model="UNIVERSAL.bizData.dutyUser"
                                      :disabled="flowScope.formReadonly"
                                      v-if="!flowScope.formReadonly && UNIVERSAL.bizData.systemUser == UNIVERSAL.ENUM.YES_NO.NO"/>
                        </el-form-item>
                        <el-form-item label="责任人单位" prop="dutyUserDept">
                            <el-input v-model="UNIVERSAL.bizData.dutyUserDept" :disabled="flowScope.formReadonly"
                                      readonly>
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline"
                                               :disabled="flowScope.formReadonly || UNIVERSAL.bizData.systemUser == UNIVERSAL.ENUM.YES_NO.YES"
                                               @click="selectOrg"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item label="责任人座机" prop="dutyUserTel">
                            <el-input v-model="UNIVERSAL.bizData.dutyUserTel" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="责任人手机" prop="dutyUserPhone">
                            <el-input v-model="UNIVERSAL.bizData.dutyUserPhone" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="责任人邮箱" prop="dutyUserMail">
                            <el-input v-model="UNIVERSAL.bizData.dutyUserMail" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="申请人" prop="applyUser">
                            <el-input v-model="UNIVERSAL.bizData.applyUser" :disabled="flowScope.formReadonly"
                                      readonly/>
                        </el-form-item>
                        <el-form-item label="申请人单位" prop="applyUserDept">
                            <el-input v-model="UNIVERSAL.bizData.applyUserDept" :disabled="flowScope.formReadonly"
                                      readonly/>
                        </el-form-item>
                        <el-form-item></el-form-item>
                        <el-form-item label="申请人座机" prop="applyUserTel">
                            <el-input v-model="UNIVERSAL.bizData.applyUserTel" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="申请人手机" prop="applyUserPhone">
                            <el-input v-model="UNIVERSAL.bizData.applyUserPhone" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="申请人邮箱" prop="applyUserMail">
                            <el-input v-model="UNIVERSAL.bizData.applyUserMail" :disabled="flowScope.formReadonly"/>
                        </el-form-item>
                        <el-form-item label="申请描述" layout="3">
                            <el-input type="textarea" :rows="3" v-model="UNIVERSAL.bizData.applyRemark"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="相关附件" layout="3">
                            <biz-upload-attachment
                                    :readonly="flowScope.formReadonly"
                                    :obj-id="UNIVERSAL.bizData.oid"
                                    :remove-call-back="removeFileCallBack"
                                    :change-success-handler="changeSuccessHandler"
                                    :file-info="UNIVERSAL.bizData.reFileVoList">
                            </biz-upload-attachment>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <el-dialog
                v-dialogDrag
                width="80%"
                title="单位选择"
                center
                append-to-body
                :close-on-press-escape="false"
                :visible.sync="dialogVisible">
            <frame-org-cust-choose @select-confirm="orgSelectedHandler"
                                   @select-cannel="orgSelectCancel"></frame-org-cust-choose>
        </el-dialog>
        <pro-sc-common-biz-catalog :title="REF.SELECT_ITEM_TYPE.TITLE"
                                   v-if="REF.SELECT_ITEM_TYPE.SHOW" :ref="REF.SELECT_ITEM_TYPE.REFS"
                                   @selection-change="selectItemTypeData"></pro-sc-common-biz-catalog>
    </div>
</template>

<script>
    import universalComm from "./js/comm";
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import BizUploadAttachment from "@/pages/biz/components/BizUploadAttachment"
    import FrameOrgCustChoose from "@/pages/pro/module/FrameOrgCustChoose.vue";
    import {validateTelphone, validatePhone, validateEMail} from "@/pages/biz/js/Validator.js"
    import ProScCommonBizCatalog from "../../pro/sc/common/ProScCommonBizCatalog";

    export default {
        name: "edit",
        components: {
            ProScCommonBizCatalog,
            IceFlowForm, IcePersionSelector, IceGridLayout, BizUploadAttachment, FrameOrgCustChoose
        },
        mixins: [universalComm],
        props: {},
        data() {
            return {
                //是否只读
                readOnly: false,
                dialogVisible: false,
                REF: {
                    FLOW_FORM: "flowForm",
                    SELECT_ITEM_TYPE: {TITLE: "申请项", REFS: "selectItemType", SHOW: false}
                },
                //字段校验规则
                RULES: {
                    systemUser: {required: true, message: "请选择是否为系统用户", trigger: "change"},
                    itemType: {required: true, message: "请选择申请项", trigger: "change"},
                    dutyUser: {required: true, message: "责任人不能为空", trigger: "change"},
                    dutyUserDept: {required: true, message: "责任人部门不能为空", trigger: "change"},
                    dutyUserTel: [
                        {required: true, message: "责任人座机不能为空", trigger: "change"},
                        {validator: validateTelphone, message: "责任人座机号码格式不正确", trigger: 'blur'}
                    ],
                    applyUserTel: [
                        {required: true, message: "申请人座机不能为空", trigger: "change"},
                        {validator: validateTelphone, message: "申请人座机号码格式不正确", trigger: 'blur'}
                    ],
                    dutyUserPhone: {validator: validatePhone, message: "责任人手机格式不正确", trigger: 'blur'},
                    applyUserPhone: {validator: validatePhone, message: "申请人手机格式不正确", trigger: 'blur'},
                    dutyUserMail: {validator: validateEMail, message: "责任人邮箱格式不正确", trigger: 'blur'},
                    applyUserMail: {validator: validateEMail, message: "申请人邮箱格式不正确", trigger: 'blur'}
                },
                //附件id数组
                fileIds: [],
            };
        },
        methods: {
            /**
             * 流程数据请求成功后的回调
             * @param flowCtx 流程上下文
             * @param flowData 业务数据
             */
            flowReadyHandler(flowCtx, flowData) {
                if (flowData.oid) {
                    Object.assign(this.UNIVERSAL.bizData, flowData);
                } else {
                    //新增
                    this.initData(flowData);
                }
                this.initControls();
            },
            /**
             * 流程按钮点击响应回调
             * @param flowCtx
             * @param flowData
             */
            flowBtnClickHandler(flowCtx, flowData) {
                return this.dataValidate();
            },
            /**
             * 页面数据校验
             */
            dataValidate() {
                return this.$refs[this.REF.FLOW_FORM].validate();
            },
            /**
             * 保存按钮响应回调处理
             */
            saveClickHandler() {
                return this.dataValidate();
            },
            /**
             * 提交按钮响应回调处理
             */
            submitClickHandler() {
                return this.dataValidate();
            },
            /**
             * 提交业务数据给流程引擎
             */
            submitBizData() {
                return this.UNIVERSAL.bizData;
            },
            /**
             * 重置责任人信息
             */
            resetDutyInfo() {
                this.UNIVERSAL.bizData.dutyUser = "";
                this.UNIVERSAL.bizData.dutyUserCode = "";
                this.UNIVERSAL.bizData.dutyUserDept = "";
                this.UNIVERSAL.bizData.dutyUserDeptCode = "";
                this.UNIVERSAL.bizData.dutyUserTel = "";
                this.UNIVERSAL.bizData.dutyUserPhone = "";
                this.UNIVERSAL.bizData.dutyUserMail = "";

            },
            /**
             * 是否系统用户切换响应方法
             * @param selectValue 当前选中值
             */
            systemUserChangeHandler(selectValue) {
                this.resetDutyInfo();
            },
            /**
             * 选择责任人单位
             */
            selectOrg() {
                this.dialogVisible = true;
            },
            /**
             * 取消责任人单位选择回调
             */
            orgSelectCancel() {
                this.dialogVisible = false;
            },
            /**
             *  责任人单位选择确定回调
             *  @param result
             */
            orgSelectedHandler(result) {
                this.UNIVERSAL.bizData.dutyUserDept = result.name;
                this.UNIVERSAL.bizData.dutyUserDeptCode = result.code;
                this.dialogVisible = false;
            },
            /**
             * 选择申请项
             */
            selectItemType() {
                this.REF.SELECT_ITEM_TYPE.SHOW = true;
                let _this = this;
                this.$nextTick(() => {
                    _this.$refs[_this.REF.SELECT_ITEM_TYPE.REFS].openDialog();
                });
            },
            /**
             *
             */
            selectItemTypeData(data) {
                this.UNIVERSAL.bizData.itemType = data[0].catalogName;
                this.UNIVERSAL.bizData.apprRoute = data[0].apprRoute;
            },
            /**
             * 文件删除回调
             */
            removeFileCallBack({fileId}) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(_this.COMM_ENUMS.ACTION.REMOVE_FILE, {fileId: fileId}, [res => {
                        if (res.data) {
                            _this.$message.success("文件已删除!");
                        } else {
                            _this.$message.error("文件删除失败!");
                        }
                        resolve();
                    }, res => {
                        _this.$message.error("文件删除失败!");
                        resolve();
                    }]);
                });
            },
            /**
             * 文件上传或者删除完成后的回调
             * @param dataArr
             * @param childType
             */
            changeSuccessHandler(dataArr, childType) {
                this.UNIVERSAL.bizData.reFileVoList = dataArr;
            },
            /**
             * 新增时初始化数据
             */
            initData() {
                //初始化责任人信息
                this.initDutyData();
                //初始化申请人信息
                this.initApplyInfo();
            },
            /**
             * 责任人选择完成回调
             */
            selectDutyNameConfirm(data) {
                this.UNIVERSAL.bizData.dutyUser = data[0].name;
                this.UNIVERSAL.bizData.dutyUserCode = data[0].code;
                this.UNIVERSAL.bizData.dutyUserDept = data[0].deptShortName;
                this.UNIVERSAL.bizData.dutyUserDeptCode = data[0].deptCode;
                this.UNIVERSAL.bizData.dutyUserTel = data[0].landlineTel;
                this.UNIVERSAL.bizData.dutyUserPhone = data[0].handphoneTel;
                this.UNIVERSAL.bizData.dutyUserMail = data[0].email;
            },
            /*
             * 初始化责任人信息
             */
            initDutyData() {
                this.UNIVERSAL.bizData.dutyUser = this.$userInfo.userName;
                this.UNIVERSAL.bizData.dutyUserCode = this.$userInfo.userCode;
                this.UNIVERSAL.bizData.dutyUserDept = this.$userInfo.deptName;
                this.UNIVERSAL.bizData.dutyUserDeptCode = this.$userInfo.deptCode;
                this.UNIVERSAL.bizData.dutyUserTel = this.$userInfo.landlineTel;
                this.UNIVERSAL.bizData.dutyUserPhone = this.$userInfo.handphoneTel;
                this.UNIVERSAL.bizData.dutyUserMail = this.$userInfo.email;
            },
            /**
             * 初始化申请人信息
             */
            initApplyInfo() {
                this.UNIVERSAL.bizData.applyUser = this.$userInfo.userName;
                this.UNIVERSAL.bizData.applyUserCode = this.$userInfo.userCode;
                this.UNIVERSAL.bizData.applyUserDept = this.$userInfo.deptName;
                this.UNIVERSAL.bizData.applyUserDeptCode = this.$userInfo.deptCode;
                this.UNIVERSAL.bizData.applyUserTel = this.$userInfo.landlineTel;
                this.UNIVERSAL.bizData.applyUserPhone = this.$userInfo.handphoneTel;
                this.UNIVERSAL.bizData.applyUserMail = this.$userInfo.email;
                this.UNIVERSAL.bizData.orgCode = this.$userInfo.orgCode;
            },
            /**
             * 数据加载完成后的页面控件初始化方法
             */
            initControls() {
                //根据是否系统用户初始化控件
                // if (this.UNIVERSAL.bizData.systemUser == this.UNIVERSAL.ENUM.YES_NO.YES) {
                //
                // } else {
                //
                // }
            },
        },
        mounted() {
            if (this.$route.query.readOnly) {
                this.readOnly = JSON.parse(this.$route.query.readOnly);
            }
        }
    }
</script>

<style scoped>

</style>