<template>
        <ice-flow-form
                name valiate
                ref="flowForm"
                :flow-ready="flowReady"
                :flow-biz-data="flowBizData"
                :flow-operate-btn="flowOperateBtn"
                style="width: 100%">
                <el-form :model="mainDataForm" :disabled="aclKeyReadonly">
                        <ice-grid-layout :columns="3" name="">
                                <el-form-item layout="3" label="用户是否存在:">
                                        <el-radio-group v-model="mainDataForm.proEvtUserTicket.sysuser">
                                                <el-radio label="0">是</el-radio>
                                                <el-radio label="1">否</el-radio>
                                        </el-radio-group>
                                        <div style="display: none;">
                                                <!--页面属性-->
                                                <!--判断页面入口-->
                                                <!-- isBreakdownEntry 是否从故障入口申请 true故障 false服务申请 -->
                                                <el-input value=""  v-model="mainDataForm.proEvtUserTicket.isBreakdownEntry"></el-input>
                                                <!--创建人-->
                                                <!-- creatorRole 创建人身份 0=用户,1=调度中心,2=工程师 -->
                                                <el-input value=""  v-model="mainDataForm.proEvtUserTicket.creatorRole"></el-input>
                                        </div>
                                </el-form-item>
                                <el-form-item label="用户:" label-width="105px" prop="user">
                                        <ice-persion-selector title="请选择"
                                                              v-model="mainDataForm.proEvtUserTicket.userName"
                                                              choose-item="single"
                                                              :mode=change1
                                        ></ice-persion-selector>
                                </el-form-item>
                                <el-form-item label="用户单位:" label-width="105px" prop="userUnit">
                                        <ice-dept-selector
                                                v-model="mainDataForm.proEvtUserTicket.userDeptName"
                                                choose-item="single"
                                                :mode=change2
                                        ></ice-dept-selector>
                                </el-form-item>
                                <el-form-item label="用户星级:" label-width="105px" prop="formname">
                                        <el-input :disabled="true"
                                                  v-model="mainDataForm.proEvtUserTicket.userLevel"></el-input>
                                </el-form-item>
                                <el-form-item label="用户座机:" label-width="105px" prop="userPhone"
                                              :rules="formRules.prompt1">
                                        <el-input placeholder="用户座机" :disabled="aclKeyReadonly"
                                                  v-model="mainDataForm.proEvtUserTicket.userTelephone"></el-input>
                                </el-form-item>
                                <el-form-item label="用户手机:" label-width="105px" prop="userCellPhone"
                                              :rules="formRules2.prompt1">
                                        <el-input placeholder="用户手机" :disabled="aclKeyReadonly"
                                                  v-model="mainDataForm.proEvtUserTicket.userMobile"></el-input>
                                </el-form-item>
                                <el-form-item label="用户邮箱:" label-width="105px" prop="userEmail"
                                              :rules="formRules.prompt2">
                                        <el-input placeholder="用户邮箱" :disabled="aclKeyReadonly"
                                                  v-model="mainDataForm.proEvtUserTicket.userMail"></el-input>
                                </el-form-item>
                                <el-form-item label="申请人:" label-width="105px" prop="currentvalue">
                                        <el-input :disabled="true"
                                                  v-model="mainDataForm.proEvtUserTicket.createrName"></el-input>
                                </el-form-item>
                                <el-form-item label="申请人单位:" label-width="105px" prop="cycle">
                                        <el-input :disabled="true"
                                                  v-model="mainDataForm.proEvtUserTicket.creatorDeptName"></el-input>
                                </el-form-item>
                                <el-form-item label="申请人座机:" label-width="105px" prop="proposerPhone"
                                              :rules="formRules.prompt1">
                                        <el-input placeholder="申请人座机"
                                                  v-model="mainDataForm.proEvtUserTicket.creatorTelephone"></el-input>
                                </el-form-item>
                                <el-form-item label="申请人手机:" label-width="105px" prop="proposerCellPhone"
                                              :rules="formRules2.prompt1">
                                        <el-input placeholder="申请人手机"
                                                  v-model="mainDataForm.proEvtUserTicket.creatorMobile"></el-input>
                                </el-form-item>
                                <el-form-item label="申请人邮箱:" label-width="105px" prop="proposerEmail"
                                              :rules="formRules.prompt2">
                                        <el-input placeholder="申请人邮箱"
                                                  v-model="mainDataForm.proEvtUserTicket.creatorMail"></el-input>
                                </el-form-item>
                                <el-form-item label="来源:" label-width="105px" prop="cycle">
                                        <ice-select value="请选择..." placeholder="请选择..." map-type-code="Source"
                                                    v-model="mainDataForm.proEvtUserTicket.source">
                                        </ice-select>
                                </el-form-item>
                                <el-form-item label="故障开始时间:" label-width="105px" prop="cycle">
                                        <ice-date-picker value="请选择" v-model="mainDataForm.proEvtUserTicket.gmtBegin"></ice-date-picker>
                                </el-form-item>
                                <el-form-item layout="3" label="故障描述：" label-width="105px">
                                        <el-input rows="6" type="textarea" v-model="mainDataForm.proEvtUserTicket.description"></el-input>
                                </el-form-item>
                                <el-form-item layout="3" label="附件上传:" label-width="105px" prop="remark">
                                      <ice-multiple-upload></ice-multiple-upload>
                                </el-form-item>
                        </ice-grid-layout>
                </el-form>
        </ice-flow-form>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import ServeMessage from "./serveMessage"
    import BaseMessage from "./baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "./affiliatedMessage"
    import serviceApplyFor from "./serviceApplyFor"
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";

    export default {
        name: "soppageAsk",
        components: {
            IceDeptSelector,
            IcePopSelector,
            IceDatePicker,
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, IceFlowForm
            , IceDialog,IcePersionSelector,IceMultipleUpload
        },
        data() {
            return {
                activeIndex: '1',
                devEnterNetData: {
                    detailList: []
                },
                activeTab: '0',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                visible: false,
                visibles: false,
                visiblis: false,
                message: "",
                change1:"input",
                change2:"readonly",
                mainDataForm: {
                    proEvtUserTicket: {
                        userMail: "",
                        sysuser: "0",
                        source: "",
                        description: "",
                        //用户
                        serviceTicket: "",
                        userCode: "",
                        userName: "",
                        userLevel: "",
                        userDeptCode: "",
                        userDeptName: "",
                        userTelephone: "",
                        userMobile: "",
                        //申请人
                        createrName: "",
                        creatorDeptName: "",
                        creatorMobile: "",
                        creatorMail: "",
                        creatorTelephone: '',
                        //页面属性
                        creatorRole: "1",
                        isBreakdownEntry:"false",
                        gmtBegin:'',
                    },
                },
                layoutColumns: [],
                form: {
                    resource: '',
                    region: '',
                    date1: ''
                },
                columns: [
                    {label: '服务单号', code: '',},
                    {label: '用户', code: '',},
                    {label: '用户星级', code: '',},
                    {label: '用户单位', code: '',},
                    {label: '申请人', code: '',},
                ],
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'afStatus',
                        value: '0',
                        click: value => {
                            if (value === '0') {
                                this.columns = [
                                    {label: '部门名称', code: '',},
                                    {label: '部门级别', code: '',},
                                    {label: '部门编码', code: '',},
                                    {label: '是否法人单位', code: '',},
                                    {label: '是否启用', code: '',},
                                ]
                            } else if (value === '1') {
                                this.columns = [
                                    {label: '合作单位名称', code: '',},
                                    {label: '分类', code: '',},
                                    {label: '企业性质', code: '',},
                                    {label: '企业法人', code: '',},
                                    {label: '组织代码', code: '',},
                                    {label: '企业网站', code: '',},
                                    {label: '企业地址', code: '',},
                                ]
                            }
                        },
                        tablist: [
                            {label: '组织机构', value: '0', name: "0"},
                            {label: '客户单位', value: '1'},]
                    }
                ],
                formRules: {
                    prompt1: [{required: true, message: '请输入座机号', trigger: 'blur'}],
                    prompt2: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                },
                formRules2: {
                    prompt1: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                }
            }
        },
        methods: {
            //点击提交时调用
            flowBizData() {
                return this.mainDataForm;
            }
            ,
            //页面加载完成时调用
            flowReady(flowcont, bizdata) {
                //渲染登录人信息   bizdata
                //用户信息及code
                this.mainDataForm.proEvtUserTicket.userName = bizdata.afUserName;
                this.mainDataForm.proEvtUserTicket.userCode = bizdata.afUserCode;
                //用户单位及code
                this.mainDataForm.proEvtUserTicket.userDeptName = bizdata.afOrgName;
                this.mainDataForm.proEvtUserTicket.userDeptCode = bizdata.afOrgCode;
                //用户手机号码
                this.mainDataForm.proEvtUserTicket.userMobile = bizdata.afPhone;
                //用户座机号码
                this.mainDataForm.proEvtUserTicket.userTelephone = bizdata.afNo;
                //渲染申请人信息
                this.mainDataForm.proEvtUserTicket.createrName = bizdata.afUserName;
                this.mainDataForm.proEvtUserTicket.creatorDeptName = bizdata.afOrgName;
                this.mainDataForm.proEvtUserTicket.creatorMobile = bizdata.afPhone;
                this.mainDataForm.proEvtUserTicket.creatorTelephone = bizdata.afNo;
                // 故障开始时间
                this.mainDataForm.proEvtUserTicket.gmtBegin=bizdata.afDate;
            }
            ,
            //校验页面数据函数
            flowOperateBtn() {
                if (this.mainDataForm.proEvtUserTicket.userName === "" || this.mainDataForm.proEvtUserTicket.userDeptName === "" || this.mainDataForm.proEvtUserTicket.userMobile === "") {
                    console.log("error");
                    return false;
                } else {
                    console.log(this.mainDataForm,this.mainDataForm.proEvtUserTicket.userName);
                    return true;
                }

            }
        },
        beforeUpdate() {
            if (this.mainDataForm.proEvtUserTicket.radio == 1){
                this.change1="readonly";
                this.change2="input";
                this.mainDataForm.proEvtUserTicket.userName = "";
                this.mainDataForm.proEvtUserTicket.userCode = "";
                //用户单位及code
                this.mainDataForm.proEvtUserTicket.userDeptName = "";
                this.mainDataForm.proEvtUserTicket.userDeptCode = "";
                //用户手机号码
                this.mainDataForm.proEvtUserTicket.userMobile = "";
                //用户座机号码
                this.mainDataForm.proEvtUserTicket.userPhone = "";
            }else {
                this.change1="input";
                this.change2="readonly";
            }
        }
    }
</script>

<style scoped>
</style>