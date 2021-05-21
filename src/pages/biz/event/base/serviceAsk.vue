<template>
    <el-form :model="mainDataForm" :disabled="aclKeyReadonly" :rules="formRules" ref="form">
        <ice-grid-layout :columns="3" name="服务单申请信息" :expandable="false">
            <el-form-item label-width="115px" layout="3" label="用户是否存在:">
                <el-radio-group class="user" v-model="mainDataForm.proEvtUserTicket.sysuser">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
                <div v-show="false">
                    <!--页面属性-->
                    <!--判断页面入口-->
                    <!-- isBreakdownEntry 是否从故障入口申请 true故障 false服务申请 -->
                    <el-input value="1"
                              v-model="mainDataForm.proEvtUserTicket.isBreakdownEntry"></el-input>
                    <!--创建人-->
                    <!-- creatorRole 创建人身份 0=用户,1=调度中心,2=工程师 -->
                    <el-input value="false"
                              v-model="mainDataForm.proEvtUserTicket.creatorRole"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="用户:" label-width="115px" prop="proEvtUserTicket.userName">
                <ice-persion-selector title="请选择"
                                      @select-confirm="selectDeptConfirm"
                                      v-if="mainDataForm.proEvtUserTicket.sysuser == 0"
                                      v-model="mainDataForm.proEvtUserTicket.userName"
                                      choose-item="single"
                                      mode="onlySelect"
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
                          v-model="mainDataForm.proEvtUserTicket.userLevel+'星级'"></el-input>
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
            <el-form-item label="申请人:" label-width="115px" prop="currentvalue">
                <el-input :disabled="true"
                          v-model="mainDataForm.proEvtUserTicket.createrName"></el-input>
            </el-form-item>
            <el-form-item label="申请人单位:" label-width="115px" prop="">
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
            <el-form-item label="批量数:" label-width="115px" 　prop="proEvtUserTicket.num">
                <el-input-number placeholder="1"
                                 :min="1"
                                 :precision="0"
                                 :max="999999"
                                 v-model="mainDataForm.proEvtUserTicket.num"></el-input-number>
            </el-form-item>
            <el-form-item label="故障开始时间:" label-width="115px" prop="proEvtUserTicket.gmtBegin"
                          v-show="this.I==1">
                <ice-date-picker
                        type="datetime"
                        v-model="mainDataForm.proEvtUserTicket.gmtBegin"
                ></ice-date-picker>
            </el-form-item>
            <el-form-item layout="3" label="申请描述：" label-width="115px">
                <el-input rows="6" type="textarea"
                          v-model="mainDataForm.proEvtUserTicket.description"
                          :maxlength="256"
                          resize="none"></el-input>
            </el-form-item>
            <div>
                <el-form-item layout="1" rows="6" label="附件上传:" label-width="115px" prop="">
                    <ice-multiple-upload value-model="string"
                                         doSecret
                                         v-model="mainDataForm.proEvtUserTicket.targetId"
                    ></ice-multiple-upload>
                </el-form-item>
            </div>
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
    import {EventEmitter as $} from "events";
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import {validatePhone, validateTelphone, validateEMail} from "@/pages/biz/js/Validator.js"

    export default {
        name: "serviceAsk",
        props: {
            bData: {}
        },
        components: {
            IceDatePicker, IceDialog, IceFlowForm, IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable, ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, IceDeptSelector,
            IcePersionSelector, IceMultipleUpload, detail, IceSingleUpload
        },
        data() {
            return {
                numId: 0,            //用于用户是否存在--切换状态清空页面值
                activeIndex: '1',
                I: "",
                activeTab: '0',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                message: "",
                change2: "readonly",
                gmtbegin: "",
                Arr: [],
                mainDataForm: {
                    proEvtUserTicket: {
                        num: "",
                        userPhone: "",
                        userMail: "",
                        sysuser: "0",
                        source: "",
                        description: "",
                        createrName: "",
                        //用户
                        userCode: "",
                        userName: "",
                        userLevel: "",
                        userDeptCode: "",
                        userDeptName: "",
                        userTelephone: "",
                        userMobile: "",
                        //申请人
                        creatorDeptName: "",
                        creatorMobile: "",
                        creatorMail: "",
                        creatorTelephone: '',
                        //页面属性
                        creatorRole: "1",
                        isBreakdownEntry: "0",
                        //附件id
                        targetId: "",
                        serviceTicket: ""
                    },
                },
                formRules: {
                    "proEvtUserTicket.num": [{required: true, message: '请输入数量', trigger: 'change'}],
                    "proEvtUserTicket.userName": [{required: true, message: '请选择用户', trigger: 'change'}],
                    "proEvtUserTicket.userDeptName": [{required: true, message: '请选择用户单位', trigger: 'change'}],
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
                    "proEvtUserTicket.source": [{required: true, message: '请选择来源', trigger: 'blur',}],
                    'proEvtUserTicket.gmtBegin': this.gmtbegin
                },
            }
        },
        methods: {
            /*页面禁用*/
            ServiceAskD() {
                this.aclKeyReadonly = true;
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
            selectDeptConfirm(rows, index) {
                this.mainDataForm.proEvtUserTicket.userDeptName = rows[0].deptShortName;
            },
            /**
             * 当保存或者提交后，使用数据库里的数据进行渲染
             * */
            setServiceData(bizData) {
                this.mainDataForm.proEvtUserTicket.serviceTicket = bizData.serviceTicket;
                this.mainDataForm.proEvtUserTicket.userName = bizData.userName;
                this.mainDataForm.proEvtUserTicket.userCode = bizData.userCode;
                this.mainDataForm.proEvtUserTicket.userDeptName = bizData.userDeptName;
                this.mainDataForm.proEvtUserTicket.userDeptCode = bizData.userDeptCode;
                this.mainDataForm.proEvtUserTicket.creatorDeptName = bizData.creatorDeptName;
                this.mainDataForm.proEvtUserTicket.createrName = bizData.creatorName;
                this.mainDataForm.proEvtUserTicket.userLevel = bizData.userLevel;
                this.mainDataForm.proEvtUserTicket.userMobile = bizData.userMobile;
                this.mainDataForm.proEvtUserTicket.userTelephone = bizData.userTelephone;
                this.mainDataForm.proEvtUserTicket.userMail = bizData.userMail;
                this.mainDataForm.proEvtUserTicket.creatorMobile = bizData.creatorMobile;
                this.mainDataForm.proEvtUserTicket.creatorTelephone = bizData.creatorTelephone;
                this.mainDataForm.proEvtUserTicket.creatorMail = bizData.creatorMail;
                this.mainDataForm.proEvtUserTicket.description = bizData.description;
                this.mainDataForm.proEvtUserTicket.source = bizData.source;
                this.mainDataForm.proEvtUserTicket.targetId = bizData.targetId;
                this.$emit("change", this.mainDataForm);
            },
            /**
             * 新建服务或者故障申请时，使用当前登录人的数据进行渲染
             * */
            setUserData() {
                let bizData = this.$userInfo;
                this.mainDataForm.proEvtUserTicket.userName = bizData.userName;
                this.mainDataForm.proEvtUserTicket.userCode = bizData.userCode;
                this.mainDataForm.proEvtUserTicket.userDeptName = bizData.orgName + '-' + bizData.deptName;
                this.mainDataForm.proEvtUserTicket.userDeptCode = bizData.deptCode;
                this.mainDataForm.proEvtUserTicket.userName = bizData.userName;
                this.mainDataForm.proEvtUserTicket.userCode = bizData.userCode;
                this.mainDataForm.proEvtUserTicket.userDeptName = bizData.orgName;
                this.mainDataForm.proEvtUserTicket.userDeptCode = bizData.orgCode;
                this.mainDataForm.proEvtUserTicket.creatorDeptName = bizData.orgName + '-' + bizData.deptName;
                this.mainDataForm.proEvtUserTicket.createrName = bizData.userName;
                this.$axios.get('biz/ProEvtUserTicket/getUserLevel', {params: {"code": bizData.userCode}}).then(result => {
                    if (result.data == null || result.data == undefined) {
                        this.mainDataForm.proEvtUserTicket.userLevel = "1";
                    } else {
                        if (result.data.userLevel == "") {
                            this.mainDataForm.proEvtUserTicket.userLevel = "1";
                        } else {
                            this.mainDataForm.proEvtUserTicket.userLevel = result.data.userLevel;
                        }
                        this.mainDataForm.proEvtUserTicket.userMobile = result.data.cellphone;
                        this.mainDataForm.proEvtUserTicket.userTelephone = result.data.telephone;
                        this.mainDataForm.proEvtUserTicket.userMail = result.data.email;
                        this.mainDataForm.proEvtUserTicket.creatorMobile = result.data.cellphone;
                        this.mainDataForm.proEvtUserTicket.creatorTelephone = result.data.telephone;
                        this.mainDataForm.proEvtUserTicket.creatorMail = result.data.email;
                    }
                });
                this.$emit("change", this.mainDataForm);
            }
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
                this.change2 = "onlySelect";
            } else {
                this.change2 = "readonly";
            }
            let tabs = this.$route.query['tabs'];
            let type = this.$route.query['type'];
            if (tabs == "1") {
                this.mainDataForm.proEvtUserTicket.isBreakdownEntry = "0";
                this.I = 0;
            } else if (tabs == "2") {
                this.mainDataForm.proEvtUserTicket.isBreakdownEntry = "1";
                this.I = 1;
                this.gmtbegin = [{required: true, message: '请选择故障开始时间', trigger: 'blur',}];
            }
            if (type == "c" && tabs == "2") {
                this.I = 0;
                this.mainDataForm.proEvtUserTicket.isBreakdownEntry = "1";
            } else if (type == "c" && tabs == "1") {
                this.I = 0;
                this.mainDataForm.proEvtUserTicket.isBreakdownEntry = "0";
            }
        },
        watch: {
            mainDataForm() {
                this.$emit("change", this.mainDataForm)
            },
        }
    }
</script>

<style scoped>
</style>