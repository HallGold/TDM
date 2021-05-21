<template>
    <el-form :model="mainDataForm" :disabled="aclKeyReadonly" :rules="formRules" ref="form">
        <ice-grid-layout :columns="3" name="">
            <el-form-item layout="3" label="用户是否存在:" prop="proEvtUserTicket.sysuser">
                <el-radio-group class="user" v-model="mainDataForm.proEvtUserTicket.sysuser">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
                <div style="display: none;">
                    <!--页面属性-->
                    <!--判断页面入口-->
                    <!-- isBreakdownEntry 是否从故障入口申请 true故障 false服务申请 -->
                    <el-input value="1" x
                              v-model="mainDataForm.proEvtUserTicket.isBreakdownEntry"></el-input>
                    <!--创建人-->
                    <!-- creatorRole 创建人身份 0=用户,1=调度中心,2=工程师 -->
                    <el-input value="false"
                              v-model="mainDataForm.proEvtUserTicket.creatorRole"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="用户:" label-width="115px" prop="proEvtUserTicket.userName">
                <ice-persion-selector title="请选择用户"
                                      :allDept="true"
                                      @select-confirm="selectDeptConfirm"
                                      v-if="mainDataForm.proEvtUserTicket.sysuser == 0"
                                      v-model="mainDataForm.proEvtUserTicket.userName"
                                      choose-item="single"
                                      :mode=change1
                ></ice-persion-selector>
                <el-input title="请选择" v-model="mainDataForm.proEvtUserTicket.userName"
                          v-if="mainDataForm.proEvtUserTicket.sysuser == 1"></el-input>
            </el-form-item>
            <el-form-item label="用户单位:" label-width="115px" prop="proEvtUserTicket.userDeptName">
                <ice-dept-selector
                        v-model="mainDataForm.proEvtUserTicket.userDeptName"
                        choose-item="single"
                        :mode=change2
                ></ice-dept-selector>
            </el-form-item>
            <el-form-item label="用户星级:" label-width="115px">
                <el-input :disabled="true"
                          v-model="mainDataForm.proEvtUserTicket.userLevel+'星级'"
                ></el-input>
            </el-form-item>
            <el-form-item
                    label="用户座机:"
                    label-width="115px"
                    prop="proEvtUserTicket.userTelephone"
            >
                <el-input placeholder="用户座机" :disabled="aclKeyReadonly"
                          v-model="mainDataForm.proEvtUserTicket.userTelephone"></el-input>
            </el-form-item>
            <el-form-item label="用户手机:" label-width="115px" prop="proEvtUserTicket.userMobile"
            >
                <el-input placeholder="用户手机" :disabled="aclKeyReadonly"
                          v-model="mainDataForm.proEvtUserTicket.userMobile"></el-input>
            </el-form-item>
            <el-form-item label="用户邮箱:" label-width="115px" prop="proEvtUserTicket.userMail"
            >
                <el-input placeholder="用户邮箱" :disabled="aclKeyReadonly"
                          v-model="mainDataForm.proEvtUserTicket.userMail"></el-input>
            </el-form-item>
            <el-form-item label="申请人:" label-width="115px" prop="">
                <el-input :disabled="true"
                          v-model="mainDataForm.proEvtUserTicket.createrName"></el-input>
            </el-form-item>
            <el-form-item label="申请人单位:" label-width="115px" prop="cycle">
                <el-input :disabled="true"
                          v-model="mainDataForm.proEvtUserTicket.creatorDeptName"></el-input>
            </el-form-item>
            <el-form-item label="申请人座机:" label-width="115px" prop="proEvtUserTicket.creatorTelephone"
            >
                <el-input placeholder="申请人座机"
                          v-model="mainDataForm.proEvtUserTicket.creatorTelephone"></el-input>
            </el-form-item>
            <el-form-item label="申请人手机:" label-width="115px" prop="proEvtUserTicket.creatorMobile"
            >
                <el-input placeholder="申请人手机"
                          v-model="mainDataForm.proEvtUserTicket.creatorMobile"></el-input>
            </el-form-item>
            <el-form-item label="申请人邮箱:" label-width="115px" prop="proEvtUserTicket.creatorMail"
            >
                <el-input placeholder="申请人邮箱"
                          v-model="mainDataForm.proEvtUserTicket.creatorMail"></el-input>
            </el-form-item>
            <el-form-item label="来源:" label-width="115px" prop="proEvtUserTicket.source">
                <ice-select value="请选择..." placeholder="请选择..." map-type-code="eventSource"
                            v-model="mainDataForm.proEvtUserTicket.source">
                </ice-select>
            </el-form-item>
            <el-form-item label-width="115px" label="申请时间" prop="proEvtUserTicket.gmtCreate">
                <ice-date-picker v-model="mainDataForm.proEvtUserTicket.gmtCreate" type="datetime">
                </ice-date-picker>
            </el-form-item>
            <el-form-item label="故障开始时间:" label-width="115px" prop="proEvtUserTicket.gmtBegin"
                          type="datetime"
                          v-show="this.number==2">
                <ice-date-picker
                        v-model="mainDataForm.proEvtUserTicket.gmtBegin" type="datetime"
                ></ice-date-picker>
            </el-form-item>
            <el-form-item layout="3" label="申请描述：" label-width="115px" prop="proEvtUserTicket.description">
                <el-input rows="6" type="textarea"
                          v-model="mainDataForm.proEvtUserTicket.description"></el-input>
            </el-form-item>
            <el-form-item layout="3" rows="6" label="附件上传:" label-width="115px" prop="proEvtUserTicket.targetId">
                <ice-multiple-upload v-model="mainDataForm.proEvtUserTicket.targetId" value-model="string" doSecret
                                     ref="uploadFile"></ice-multiple-upload>
            </el-form-item>

        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import ServeMessage from "./serveMessage"
    import BaseMessage from "./baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "./affiliatedMessage"
    import serviceApplyFor from "./serviceApplyFor"
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import detail from "./detail";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import {validatePhone, validateTelphone, validateEMail} from "./Validator.js"
    import bus from "./bus.js"

    export default {
        name: "serviceSecond",
        components: {
            IceDatePicker, bus,
            IceDialog,
            IceFlowForm,
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, IceDeptSelector,
            IcePersionSelector, IceMultipleUpload, detail, IceSingleUpload,
        },
        props: {
            mainDataForm: {},
            number: {
                required: true,
                default: () => {
                    return [];
                }
            },
            newNumber: String
        },
        data() {
            return {
                numId: 0,
                activeIndex: '1',
                I: "",
                activeTab: '0',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                message: "",
                change1: "input",
                change2: "readonly",
                formRules: {
                    'proEvtUserTicket.userTelephone': [{validator: validateTelphone, trigger: 'blur'}, {
                        required: true,
                        message: '请输入座机号码',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.userMobile": [{validator: validatePhone, trigger: 'blur'}, {
                        message: '请输入手机号码',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.userMail": [{validator: validateEMail, trigger: 'blur'}, {
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.creatorTelephone": [{
                        validator: validateTelphone,
                        trigger: 'blur'
                    }, {required: true, message: '请输入座机号码', trigger: 'blur'}],
                    "proEvtUserTicket.creatorMobile": [{validator: validatePhone, trigger: 'blur'}, {
                        message: '请输入手机号码',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.creatorMail": [{validator: validateEMail, trigger: 'blur'}, {
                        message: '请输入邮箱',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.gmtCreate": [{
                        required: true,
                        message: '请选择申请时间',
                        trigger: 'blur'
                    }],
                    "proEvtUserTicket.source": [{required: true, message: '请选择来源', trigger: 'blur',}],
                    "proEvtUserTicket.userName": [{required: true, message: '请输入用户名', trigger: 'blur',}],
                    "proEvtUserTicket.userDeptName": [{required: true, message: '请选择用户单位', trigger: 'blur',}],
                },
            }
        },
        methods: {
            /**刷新数据*/
            ssClear() {
                /*清除附件*/
                // this.$refs.uploadFile.clearFiles();
                /*清除form表单*/
                this.$refs.form.resetFields();
            },
            isTrue() {
                let flag = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            again() {
                let bizData = this.$userInfo;
                this.mainDataForm.proEvtUserTicket.userName = bizData.userName;
                this.mainDataForm.proEvtUserTicket.userCode = bizData.userCode;
                //用户单位及code
                this.mainDataForm.proEvtUserTicket.userDeptName = bizData.orgName + '-' + bizData.deptName;
                this.mainDataForm.proEvtUserTicket.userDeptCode = bizData.deptCode;
                //渲染申请人信息
                this.mainDataForm.proEvtUserTicket.createrName = bizData.userName;
                //申请人单位
                this.mainDataForm.proEvtUserTicket.creatorDeptName = bizData.orgName + '-' + bizData.deptName;
                this.$axios.get('biz/ProEvtUserTicket/getUserLevel', {params: {"code": bizData.userCode}}).then(result => {
                    if (result.data == null) {
                        this.mainDataForm.proEvtUserTicket.userLevel = "1";
                    } else {
                        this.mainDataForm.proEvtUserTicket.userLevel = result.data.userLevel;
                        //用户手机
                        this.mainDataForm.proEvtUserTicket.userMobile = result.data.cellphone;
                        //用户座机
                        this.mainDataForm.proEvtUserTicket.userTelephone = result.data.telephone;
                        //用户邮箱
                        this.mainDataForm.proEvtUserTicket.userMail = result.data.email;
                        //申请人手机
                        this.mainDataForm.proEvtUserTicket.creatorMobile = result.data.cellphone;
                        //申请人座机
                        this.mainDataForm.proEvtUserTicket.creatorTelephone = result.data.telephone;
                        //申请人邮箱
                        this.mainDataForm.proEvtUserTicket.creatorMail = result.data.email;
                        //申请时间
                        this.mainDataForm.proEvtUserTicket.gmtCreate = result.data.createDate;
                        //故障开始时间 updateDate
                        this.mainDataForm.proEvtUserTicket.gmtBegin = result.data.updateDate;
                    }
                })
            },
            selectDeptConfirm(rows, index) {
                this.mainDataForm.proEvtUserTicket.userDeptName = rows[0].deptShortName;
            },
        },
        mounted() {
            this.ssClear();
            this.again();
        },
        beforeUpdate() {
            let num = this.mainDataForm.proEvtUserTicket.sysuser;
            if (num != this.numId) {
                this.mainDataForm.proEvtUserTicket.userName = "";
                this.mainDataForm.proEvtUserTicket.userDeptName = "";
                this.mainDataForm.proEvtUserTicket.userDeptCode = "";
                this.mainDataForm.proEvtUserTicket.userMobile = "";
                this.mainDataForm.proEvtUserTicket.userTelephone = "";
                this.mainDataForm.proEvtUserTicket.userMail = '';
                this.numId = this.numId == 1 ? 0 : 1;
            }
            if (this.mainDataForm.proEvtUserTicket.sysuser == 1) {
                this.change1 = "readonly";
                this.change2 = "input";
            } else {
                this.change1 = "input";
                this.change2 = "readonly";
            }
        },
    }
</script>

<style scoped>

</style>