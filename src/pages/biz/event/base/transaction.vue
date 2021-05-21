<template>
    <div>
        <ice-flow-form
                class="changeWidth"
                ref="flowForm"
                style="width: 100%"
                :flow-ready="flowReady"
                :flow-biz-data="flowBizData"
                :flow-operate-btn="flowOperateBtn"
                :btn-extend1="quickSolve"
                :btn-extend2="userAppraiseUnsolved"
                :btn-extend3="refuseRework">
            <!--头部状态及服务单号-->
            <div v-show="showHeaders" slot="fixed"
                 style="background-color: #fff;padding:20px;z-index: 10 ;left: 0;top: 0;height: 80px;width: 100%;box-sizing: border-box">
                <el-form :disabled="all">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="服务单号:" label-width="80px" prop="">
                            <span class="serviceId" v-model="mainDataForm.proEvtUserTicket.serviceTicket">
                                {{mainDataForm.proEvtUserTicket.serviceTicket}}
                            </span>
                            </el-form-item>
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="服务单状态:" label-width="105px"
                                          prop="">
                                <el-col :span="8">
                                    <ice-datamap-translater
                                            :value="mainDataForm.proEvtUserTicket.serviceStatus?mainDataForm.proEvtUserTicket.serviceStatus:''"
                                            mapTypeCode="serviceStatus">
                                    </ice-datamap-translater>
                                </el-col>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div v-if="showBase">
                <service-ask @change="formChange" ref="serviceAsk" :bData="preposeData"></service-ask>
            </div>
            <div class="grid-container" v-if="showNumber">
                <el-form :disabled="overflowH">

                    <div style="height: 80px"></div>
                    <!--服务申请信息-->
                    <div style="width: 100%">
                        <service-supplement :mainDataForm="mainDataForm" ref="serviceSupplement"></service-supplement>
                    </div>
                    <!--服务受理==》办理==》基础信息-->
                    <base-message :Form="Form" ref="baseItem"
                                  :mainDataForm="mainDataForm"
                                  :serviceStatu="mainDataForm.proEvtUserTicket.serviceStatus"
                                  :serviceTicket="mainDataForm.proEvtUserTicket.serviceTicket"
                    ></base-message>
                    <!--详情中的工单信息-->
                    <ice-grid-layout :columns="1" name="工单信息" v-show="workShow">
                        <work-order-information ref="workOrderInformation"></work-order-information>
                    </ice-grid-layout>
                    <!--服务单处理信息查询 详情 回访-->
                    <return-visit v-show="againShow" :disabled="objDis"
                                  ref="returnVisit"></return-visit>
                    <!--服务对象查询 详情 处理信息-->
                    <process></process>
                    <!--附件信息-->
                    <ice-grid-layout :columns="1" name="附件信息">
                        <ice-multiple-upload v-model="Form.centerServiceVo.targetId"
                                             value-model="string"
                                             doSecret></ice-multiple-upload>
                    </ice-grid-layout>
                    <!--附属信息-->
                    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                        <ice-grid-layout :columns="1" name="附属信息">
                            <el-tabs v-model="activeName">
                                <!-- 关联服务单列表 -->
                                <el-tab-pane label="关联服务单" name="first">
                                    <ice-query-grid
                                            :data-url="urlWith"
                                            :columns=columnsWith
                                            :buttons="buttons"
                                            :query="queryWith"
                                            :gridData="information"
                                            chooseItem="multiple"
                                            @selection-change="selectse"
                                            ref="auxGrid">
                                    </ice-query-grid>
                                </el-tab-pane>
                                <!--  操作记录列表 -->
                                <el-tab-pane label="操作记录" name="second">
                                    <ice-query-grid
                                            :data-url="urlRecord"
                                            :columns="columnsRecord"
                                            :query="queryRecord"
                                            ref="grid">
                                    </ice-query-grid>
                                </el-tab-pane>
                            </el-tabs>
                            <!--关联弹窗-->
                            <ice-dialog v-dialogDrag title="关联" custom-class="ice-dialog" center
                                        :visible.sync="VisibleWith" remounted
                                        width="1200px" append-to-body :close-on-click-modal="false">
                                <relevance @selection-change="child"></relevance>
                                <el-form-item label-width="105px" class="footer">
                                    <el-button type="primary" @click="confirmWith">确定
                                    </el-button>
                                    <el-button type="info" @click="close">取消</el-button>
                                </el-form-item>
                            </ice-dialog>
                        </ice-grid-layout>
                    </div>
                    <!--快速解决弹窗-->
                    <ice-dialog v-dialogDrag title="快速解决" :visible.sync="Visible" width="600px">
                        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                            <el-form :model="quickSolveData" :disabled="aclKeyReadonly">
                                <el-form-item label="起因:" label-width="105px">
                                    <el-col :span="24">
                                        <ice-select placeholder="请选择..." v-model="quickSolveData.reason"
                                                    map-type-code="eventCause">
                                        </ice-select>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="处置情况:" label-width="105px">
                                    <el-col :span="24">
                                        <el-input placeholder="请填写处置情况"
                                                  v-model="quickSolveData.detail" rows="6"
                                                  type="textarea"></el-input>
                                    </el-col>
                                </el-form-item>
                            </el-form>
                            <el-form style="text-align: center">
                                <el-button type="primary" @click="confirmQuickSolve">确定</el-button>
                                <el-button type="info" @click="closesQuickSolve">取消</el-button>
                            </el-form>
                        </div>
                    </ice-dialog>
                    <!--分派弹窗-->
                    <ice-dialog title="分派" :visible.sync="VisiblePart" width="1000px" height="500px">
                        <assign @cancel="closeAssign"
                                @confirm="confirmAssign"
                                :areaID="Form.centerServiceVo.areaId">
                        </assign>
                    </ice-dialog>
                    <!-- 调度中心取消服务单 -->
                    <ice-dialog title="取消服务单" :visible.sync="cancelService" height="270px" width="450px">
                        <cancel-service @confirmCancelService="confirmCancelService"
                                        @cancelCancelService="cancelCancelService" ref="cancelService"></cancel-service>
                    </ice-dialog>
                    <!-- 用户确认未解决 -->
                    <ice-dialog title="确认未解决" :visible.sync="appraiseUnsolved" height="270px" width="550px">
                        <appraise-unsolved @confirmAppraiseUnsolved="confirmAppraiseUnsolved"
                                           @cancelAppraiseUnsolved="cancelAppraiseUnsolved" ref="appraiseUnsolved">
                        </appraise-unsolved>
                    </ice-dialog>
                    <ice-dialog title="服务单拒绝返工" :visible.sync="centerRefuseRework" height="270px" width="550px">
                        <refuse-rework @confirmRefuseRework="confirmRefuseRework"
                                       @cancelRefuseRework="cancelRefuseRework" ref="refuseRework">
                        </refuse-rework>
                    </ice-dialog>
                </el-form>
            </div>

        </ice-flow-form>
        <div style="position: relative;" v-if="prefixForm">
            <el-button circle style="background-color: rgba(16,150,209,0.3);" title="点我查看前置表单">
                <i class="el-icon-star-off" style="color: black"  @click="lookItem" title="点我查看前置表单">查看</i>
            </el-button>
        </div>
    </div>

</template>

<script>

    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import ServeMessage from "./serveMessage"
    import BaseMessage from "./baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "./affiliatedMessage"
    import serviceApplyFor from "./serviceApplyFor"
    import solveQuickly from "./solveQuickly";
    import assign from "./assign";
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import serveMessage from "./serveMessage";
    import basedOnRepeat from "./basedOnRepeat";
    import serviceAsk from "./serviceAsk";
    import operateType from "./operateType.js";
    import Relevance from "./relevance";
    import WorkOrderInformation from "./workOrderInformation";
    import ServiceSupplement from "./serviceSupplement";
    import ReturnVisit from "./returnVisit";
    import Process from "../../businessprocess/osReinstall/process";
    import Bus from "./bus.js"
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import CancelService from "./cancelService";
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";
    import AppraiseUnsolved from "./appraiseUnsolved";
    import RefuseRework from "./refuseRework";
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";

    export default {
        name: 'transaction',
        mixins: [operateType],
        data() {
            return {
                Form: {
                    centerServiceVo: {
                        serviceTicket: "",
                        serviceProperty: "",
                        isBreakdown: "0",
                        serviceRange: 0,
                        serviceEmergency: 0,
                        servicePriority: 0,
                        areaShortname: "",
                        areaCode: "",
                        psbcname: "",
                        sname: "",
                        lvTitle: 0,
                        durationDoneExpected: "10",
                        description: "",
                        isServiceBreakdown: "0",
                        durationDoneUnit: "2",
                        isLevelZero: "0",
                        durationDoneCustom: "",
                        targetId: "",
                        areaId: "",
                        catalogId: "",
                        techId: ""
                    },
                },
                quickSolveData: {
                    serviceTicket: "",
                    reason: "",
                    detail: ""
                },
                all: false,
                /*服务申请信息回显数据*/
                preposeData: {},
                /*基础信息回显数据*/
                baseData: {},
                activeName: 'first',
                aclKeyReadonly: false,
                Visible: false,
                VisiblePart: false,
                VisibleWith: false,
                show: true,
                showNumber: true,
                showBase: false,
                objDis: true,
                cancelService: false,
                appraiseUnsolved: false,
                centerRefuseRework: false,
                information: [],
                targetId: "",
                I: "",
                arr: [],
                delArr: [],
                tableData: [],
                delSum: [],
                service: "",
                workShow: "",
                againShow: false,
                url: "/biz/ProEvtServiceTicket/searchPageUserServTicket",
                urlWith: "",
                urlRecord: "",
                showHeaders: true,
                overflowH: false,
                timeStatus: "",
                changeType: false,
                nowClick: "",
                statistics: "0",
                queryWith: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.preposeData.serviceTicket;
                        }
                    },

                ],
                queryRecord: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.preposeData.serviceTicket;
                        }
                    },

                ],
                columnsWith: [
                    {code: 'oid', hidden: true},
                    {label: '服务单号', code: 'serviceTicketRelevant', width: 200},
                    {label: '状态', code: 'serviceStatus', width: 100, mapTypeCode: "serviceStatus"},
                    {label: '用户描述', code: 'description',},
                ],
                columnsRecord: [
                    {label: '操作类型', code: 'operationType', mapTypeCode: "ServiceOperateType"},
                    {label: '原因', code: 'reason',},
                    {label: '说明', code: 'detail',},
                    {label: '确认人', code: 'creatorName',},
                    {label: '确认时间', code: 'gmtCreate',},
                ],
                queryMap: {
                    '0': [
                        {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '0', hidden: true}
                    ],
                },
                buttons: [
                    {
                        name: '关联', icon: 'el-icon-plus', type: 'primary', callback: this.rel
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.del
                    },
                ],
                mainDataForm: {
                    proEvtUserTicket: {
                        userPhone: "",
                        userMail: "",
                        sysuser: "0",
                        source: "",
                        description: "",
                        creatorName: "",
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
                        creatorDeptName: "",
                        creatorMobile: "",
                        creatorMail: "",
                        creatorTelephone: '',
                        //页面属性
                        creatorRole: "1",
                        isBreakdownEntry: "",
                        gmtBegin: "",
                        gmtCreate: "",
                        serviceStatus: "",
                        //附件id
                        targetId: "",
                        num: ""
                    },
                    centerServiceVo: {},
                    proEvtServiceTicketLog: {},
                    assignVo: {},
                    proUserFeedback: {},
                    childBizData: {},//子流程的map对象
                    serviceTicketCatalogs: [],
                },
                flowCont: {},
                layoutColumns: [],
                form: {
                    resource: '',
                    region: '',
                    date1: ''
                },
                query: [
                    {type: 'input', label: '服务单号', code: 'serviceTicket', value: '', exp: ''},
                    {type: 'input', label: '用户', code: 'userName', value: '', exp: ''},
                    {type: 'button', label: '高级查询', code: '', value: ''}
                ],
                formRules: {
                    prompt1: [{required: true, message: '请输入座机号', trigger: 'blur'}],
                    prompt2: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                    prompt3: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                },
                flowUrl:'',//前置表单的路径
                prefixForm:false,//是否存在前置表单
            }
        },
        methods: {
            /**
             * 查看前置表单
             */
            lookItem(){
                let host = window.location.href.substring(0, window.location.href.indexOf("#") + 1);
                window.open(host + this.flowUrl);
            },
            child(data) {
                this.arr = data;
            },
            /**
             * 调度中心快速解决
             */
            quickSolve(flowContext, bizdata) {
                flowContext.processVar = {
                    fastSolve: "1",
                    isSolve: "1",
                    confirmation: "1",
                    finish: 0
                };
                this.Visible = true;
            },
            /**
             * 点击提交时调用
             * */
            flowBizData() {
                if (this.flowCont.nodeId == "assign" && this.flowCont.operateType == "submit") {
                    if (this.mainDataForm.assignVo.operType == this.serviceOperateType.DELIVER) {
                        this.setChildBus();
                    } else if (this.mainDataForm.assignVo.operType == this.serviceOperateType.QUICK_RESOLVE) {

                    }
                }
                this.mainDataForm.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                return this.mainDataForm;
            },
            /**
             * 页面加载完成时调用
             * */
            flowReady(flowcont, bizdata) {
                if(bizdata.devFlow && bizdata.devFlow.flowUrl){//是否存在前置表单
                    this.flowUrl = bizdata.devFlow.flowUrl;
                    this.prefixForm = true
                }
                if (bizdata.oid) {
                    this.mainDataForm.serviceStatus = bizdata.serviceStatus;
                }
                if (flowcont.nodeId == "valuation") {
                    let look = "head";
                    this.$refs.workOrderInformation.refresh(bizdata.serviceTicket, look);
                }
                let task = this.$refs.flowForm.flowInstData.currentTask;
                this.timeStatus = task ? task.groupTask : "";
                //获取前一页面所传ID
                if (task && task.groupTask == 1) {
                    this.disabledAll();
                    this.$refs.baseItem.hidens();
                    this.overflowH = true;
                }
                if (this.timeStatus == "2") {
                    this.overflowH = false;
                    this.$refs.baseItem.refreshForm();
                    if (this.statistics == "1") {
                        this.overflowH = true;
                        this.disabledAll();
                    } else {
                        this.overflowH = false;
                    }
                }
                /**
                 * 获取路由所传值
                 * */
                let ruotes = this.$route.query;
                /**
                 * 确定它是服务申请还是故障申报
                 * */
                this.I = ruotes.tabs;
                /**详情*/
                if (ruotes.type === "detail") {
                    this.disabledAll();
                }
                /**
                 * 当dataId 不为空或者undefined 时，此时为新建申请
                 * */
                if (ruotes.dataId != null || ruotes.dataId != undefined) {
                    /**
                     * 此时新建申请已经提交或者保存，生成了dataId
                     * */
                    this.initialize();
                    /**草稿*/
                    if (bizdata.serviceStatus == "0") {
                        this.mainDataForm.serviceStatus = "0";
                        this.showBase = true;
                        this.showHeaders = false;
                        this.showNumber = false;
                        this.$nextTick(() => {
                            this.$refs.serviceAsk.setServiceData(this.preposeData);
                            //详情
                            if (ruotes.type == "c") {
                                this.$refs.serviceAsk.ServiceAskD();
                            }
                        });
                    }
                    /**待分派*/
                    else if (this.mainDataForm.proEvtUserTicket.serviceStatus == "1") {
                        this.showHeaders = true;
                        this.showBase = false;
                        this.showNumber = true;
                        if (ruotes.type == "detail") {
                            this.workShow = false;
                            this.disabledAll();
                            this.$nextTick(() => {
                                this.$refs.baseItem.hidens();
                            })
                        }
                        this.giveNum();
                    } else if (this.mainDataForm.proEvtUserTicket.serviceStatus == "3") {
                        this.showHeaders = true;
                        this.showBase = false;
                        this.showNumber = true;
                        if (ruotes.type == "detail") {
                            this.workShow = false;
                            this.disabledAll();
                            this.$nextTick(() => {
                                this.$refs.baseItem.hidens();
                            })
                        }
                        this.giveNum();
                    }
                    /**已分派*/
                    else if (this.mainDataForm.proEvtUserTicket.serviceStatus == "2") {
                        this.$refs.baseItem.hidens();
                        this.overflowH = true;
                        this.showHeaders = true;
                        this.showBase = false;
                        this.showNumber = true;
                        this.giveNum();
                        this.disabledAll();
                    }
                    /**已关闭*/
                    else if (this.mainDataForm.proEvtUserTicket.serviceStatus == "7") {
                        //回访信息显示
                        this.againShow = true;
                        //所有可操作项禁用
                        this.overflowH = true;
                        //工单信息显示
                        this.workShow = true;
                        //头部服务单号及服务单状态显示
                        this.showHeaders = true;
                        //页面除基础信息外数据显示
                        this.showNumber = true;
                        this.$refs.baseItem.hidens();
                        this.giveNum();
                        this.disabledAll();
                        this.$nextTick(() => {
                            this.$refs.returnVisit.returnVisit(this.preposeData.serviceTicket);
                        })
                    }
                    /**待回访*/
                    else if (this.mainDataForm.proEvtUserTicket.serviceStatus == "4") {
                        this.workShow = true;
                        this.overflowH = true;
                        this.$refs.baseItem.hidens();
                        this.overflowH = true;
                        this.showHeaders = true;
                        this.showBase = false;
                        this.showNumber = true;
                        this.giveNum();
                        this.disabledAll();
                    } else if (
                        this.mainDataForm.proEvtUserTicket.serviceStatus == "5" ||
                        this.mainDataForm.proEvtUserTicket.serviceStatus == "6" ||
                        this.mainDataForm.proEvtUserTicket.serviceStatus == "8"
                    ) {
                        this.workShow = true;
                        this.overflowH = true;
                        this.$refs.baseItem.hidens();
                        this.overflowH = true;
                        this.showHeaders = true;
                        this.showBase = false;
                        this.showNumber = true;
                        this.giveNum();
                        this.disabledAll();
                    }
                    this.mainDataForm.proEvtUserTicket.num = this.preposeData.num;
                    this.mainDataForm.proEvtUserTicket = this.preposeData;
                    this.mainDataForm.proEvtUserTicket.serviceStatus = this.baseData.serviceStatus ? (this.baseData.serviceStatus).toString() : "";
                } else {
                    /**
                     * 此时渲染新建申请，也就是当前登录人的信息
                     * */
                    this.showBase = true;
                    this.showHeaders = false;
                    this.showNumber = false;
                    this.$nextTick(() => {
                        this.$refs.serviceAsk.setUserData();
                    })
                }
            },
            /*页面数据赋值*/
            giveNum() {
                this.mainDataForm.proEvtUserTicket.num = this.preposeData.num;
                this.mainDataForm.proEvtUserTicket = this.preposeData;
                this.mainDataForm.proEvtUserTicket.serviceStatus = this.baseData.serviceStatus ? (this.baseData.serviceStatus).toString() : "";
                let serviceID = this.preposeData.serviceTicket;
                this.$refs.workOrderInformation.refresh(serviceID);
                this.$nextTick(() => {
                    this.$refs.baseItem.startUrl();
                });
                if (this.baseData.durationDoneCustom != null || this.baseData.durationDoneExpected != null) {
                    this.$refs.baseItem.isLevelZeroShow(this.baseData);
                }
            },
            /*禁用页面所有可操作项*/
            disabledAll() {
                this.$refs.baseItem.hidens();
                this.all = true;
                this.overflowH = true
            },
            //校验页面数据函数,点击时触发
            flowOperateBtn(flowContext, bizdata) {
                this.flowCont = flowContext;
                if (flowContext.nodeId == "FirstNode" && flowContext.operateType != "save") {
                    //服务申请环节保存不校验
                    this.$refs.serviceAsk.isTrue();
                    this.mainDataForm.serviceStatus = "1";
                    return this.$refs.serviceAsk.isTrue()
                } else if (flowContext.nodeId == "assign" && flowContext.operateType == "submit") {
                    this.$refs.baseItem.suerType();
                    this.$refs.baseItem.isLevelZeroShow(this.baseData);
                    Object.assign(this.mainDataForm, this.Form.centerServiceVo);
                    //调度中心分派服务单
                    flowContext.processVar = {
                        fastSolve: "0",
                        isSolve: "1",
                        confirmation: "1",
                        finish: 0
                    };
                    this.showAssign();
                    return false;
                } else if (flowContext.nodeId == "assign" && flowContext.operateType == "save") {
                    Object.assign(this.mainDataForm, this.Form.centerServiceVo);
                    this.$refs.baseItem.suerType();
                    this.$refs.baseItem.isLevelZeroShow(this.baseData);
                    let arr = [];
                    for (let i = 0; i < this.Form.centerServiceVo.techId.length; i++) {
                        let obj = {
                            catalogId: this.Form.centerServiceVo.techId[i].techId,
                            isDefault: "0",
                            serviceTicket: this.preposeData.serviceTicket
                        };
                        arr.push(obj);
                    }
                    this.mainDataForm.serviceTicketCatalogs = arr;
                    return true;
                } else if (flowContext.nodeId == "assign" && flowContext.operateType == "stop") {
                    //调度中心取消服务单
                    flowContext.processVar = {
                        fastSolve: "0",
                        isSolve: "1",
                        confirmation: "1",
                        finish: 1
                    };
                    this.cancelService = true;
                    return false;
                } else if (flowContext.nodeId == "valuation" && flowContext.operateType == "submit") {
                    //用户确认已经解决
                    flowContext.processVar = {
                        fastSolve: "0",
                        isSolve: "1",
                        confirmation: "1"
                    };
                    this.mainDataForm.proUserFeedback = {
                        ticketNumber: this.mainDataForm.proEvtUserTicket.serviceTicket,
                        isDone: "1",
                        totalScore: "0"
                    };
                    return true;
                } else if (flowContext.nodeId == "centerConfirm" && flowContext.operateType == "submit") {
                    //调度中心确认返工
                    flowContext.processVar = {
                        fastSolve: "0",
                        isSolve: "1",
                        confirmation: "0"
                    };
                    this.mainDataForm.proEvtServiceTicketLog = {
                        serviceTicket: this.mainDataForm.proEvtUserTicket.serviceTicket,
                        operationType: this.serviceOperateType.ACCEPT_REWORK_NUM
                    };
                    return true;
                }
                return true;
            },
            /**
             * 将serviceAsk中搜集的数据传入mainDataForm
             * */
            formChange(data) {
                Object.assign(this.mainDataForm, data);
            },
            /**
             确定快速解决
             */
            confirmQuickSolve() {
                this.mainDataForm.assignVo.operType = this.serviceOperateType.QUICK_RESOLVE;
                this.quickSolveData.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                this.mainDataForm.proEvtServiceTicketLog = this.quickSolveData;
                this.Form.centerServiceVo.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                Object.assign(this.mainDataForm, this.Form.centerServiceVo);
                this.Visible = false;
                this.$refs.flowForm.flowContext.operateType = "submit";
                this.$refs.flowForm.flowGetNexNode();
                this.$refs.flowForm.flowOperate();
            },
            /**
             取消快速解决
             */
            closesQuickSolve() {
                this.Visible = false;
            },
            /**
             * 调度中心确定取消
             */
            confirmCancelService(value) {
                this.$refs.cancelService.isTrue();
                if (this.$refs.cancelService.getIsTrue()) {
                    this.mainDataForm.proEvtServiceTicketLog = value;
                    this.mainDataForm.proEvtServiceTicketLog.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                    this.$nextTick(() => {
                        this.cancelService = false;
                        this.$refs.flowForm.flowContext.operateType = "stop";
                        this.$refs.flowForm.flowGetNexNode();
                        this.$refs.flowForm.flowOperate();
                    });
                }
            },
            cancelCancelService() {
                this.cancelService = false;
            },
            /**
             * 用户确认未解决
             */
            userAppraiseUnsolved(flowContext, bizData) {
                flowContext.processVar = {
                    fastSolve: "0",
                    isSolve: "0",
                    confirmation: "1"
                };
                this.appraiseUnsolved = true;
            },
            /**
             * 用户确认确认未解决
             */
            confirmAppraiseUnsolved(value) {
                this.$refs.appraiseUnsolved.isTrue();
                if (this.$refs.appraiseUnsolved.getIsTrue()) {
                    this.mainDataForm.proUserFeedback = value;
                    this.mainDataForm.proUserFeedback.ticketNumber = this.mainDataForm.proEvtUserTicket.serviceTicket;
                    this.mainDataForm.proUserFeedback.isDone = "0";
                    this.$nextTick(() => {
                        this.appraiseUnsolved = false;
                        this.$refs.flowForm.flowContext.operateType = "submit";
                        this.$refs.flowForm.flowGetNexNode();
                        this.$refs.flowForm.flowOperate();
                    });
                }
            },
            cancelAppraiseUnsolved() {
                this.appraiseUnsolved = false;
            },
            /**
             * 调度中心拒绝返工
             */
            refuseRework(flowContext, bizData) {
                //调度中心拒绝返工
                flowContext.processVar = {
                    fastSolve: "0",
                    isSolve: "1",
                    confirmation: "1"
                };
                this.centerRefuseRework = true;
            },
            /**
             * 调度中心确认拒绝返工
             */
            confirmRefuseRework(value) {
                this.$refs.refuseRework.isTrue();
                if (this.$refs.refuseRework.getIsTrue()) {
                    this.mainDataForm.proEvtServiceTicketLog = value;
                    this.mainDataForm.proEvtServiceTicketLog.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                    this.mainDataForm.proEvtServiceTicketLog.operationType = this.serviceOperateType.REFUSE_REWORK_NUM;
                    this.$nextTick(() => {
                        this.centerRefuseRework = false;
                        this.$refs.flowForm.flowContext.operateType = "submit";
                        this.$refs.flowForm.flowGetNexNode();
                        this.$refs.flowForm.flowOperate();
                    });
                }
            },
            cancelRefuseRework() {
                this.centerRefuseRework = false;
            },
            /**
             打开关联页面
             */
            rel() {
                this.aclKeyReadonly = false;
                this.VisibleWith = true;
            },
            /**
             取消关联
             */
            close() {
                this.VisibleWith = false;
            },
            showAssign() {
                /*验证基础信息*/
                this.$refs.baseItem.testing();
                if (this.$refs.baseItem.testing() == true) {
                    Object.assign(this.mainDataForm, this.Form.centerServiceVo);
                    let serviceTicketCatalogs = [];
                    for (let i = 0; i < this.Form.centerServiceVo.techId.length; i++) {
                        let m = {
                            catalogId: this.Form.centerServiceVo.techId[i].techId,
                            serviceTicket: this.mainDataForm.proEvtUserTicket.serviceTicket,
                            isDefault: "0"
                        };
                        serviceTicketCatalogs.push(m);
                    }
                    this.mainDataForm.serviceTicketCatalogs = serviceTicketCatalogs;
                    this.VisiblePart = true;

                } else {
                    this.VisiblePart = false;
                }
            },
            closeAssign(value) {
                this.VisiblePart = value;
            },
            confirmAssign(value) {
                this.mainDataForm.assignVo = value;
                this.mainDataForm.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                this.mainDataForm.assignVo.serviceTicket = this.mainDataForm.proEvtUserTicket.serviceTicket;
                this.mainDataForm.assignVo.operType = this.serviceOperateType.DELIVER;
                this.VisiblePart = false;
                this.$refs.flowForm.flowContext.operateType = "submit";
                this.$refs.flowForm.flowGetNexNode();
                this.$refs.flowForm.flowOperate();
                this.disabledAll();
                this.statistics = "1";
            },
            /**
             * 设置子流程的数据
             */
            setChildBus() {
                if (this.mainDataForm.assignVo.maintainMembers.length > 0) {
                    let userCodes = "";
                    for (let i = 0; i < this.mainDataForm.assignVo.maintainMembers.length; i++) {
                        let maintainMember = this.mainDataForm.assignVo.maintainMembers[i];
                        let workTicketVO = {
                            assignVo: {}
                        };
                        userCodes += "," + maintainMember.usercode;
                        Object.assign(workTicketVO.assignVo, this.mainDataForm.assignVo);
                        workTicketVO.assignVo.specialPerson = maintainMember.usercode;
                        workTicketVO.engineerCode = maintainMember.usercode;
                        workTicketVO.engineerName = maintainMember.username;
                        this.mainDataForm.childBizData[maintainMember.usercode] = workTicketVO;
                    }
                    this.mainDataForm.specialPerson = userCodes.substr(1);
                }
            },
            /**
             保存，关联弹窗中的保存
             */
            confirmWith() {
                let selectArr = [];
                if (this.arr.length != "0") {
                    for (let i = 0; i < this.arr.length; i++) {
                        selectArr.push(this.arr[i].serviceTicket);
                    }
                    if (selectArr.indexOf(this.preposeData.serviceTicket) == "-1") {
                        this.$axios.post("biz/ProEvtServiceTicketRelevan/save", {
                            serviceTicket: this.preposeData.serviceTicket,
                            serviceTicketRelevant: selectArr.join(",")
                        }).then(result => {
                            this.arr = [];
                            selectArr = [];
                            this.$message.success("关联成功！");
                            this.$refs.auxGrid.refresh();
                            this.VisibleWith = false;
                        });
                    } else {
                        this.$confirm('不可以关联自己！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        });
                    }
                } else {
                    this.$confirm('请选择想要关联的数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                }
            },
            /**
             * 删除，关联服务单中的数据
             * */
            del() {
                if (this.delArr.length == 0) {
                    this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    this.delArr = [];
                } else {
                    this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.delArr.length; i++) {
                            this.delSum.push(this.delArr[i].oid)
                        }
                        this.delSum = this.delSum.join(",");
                        this.$axios.delete("biz/ProEvtServiceTicketRelevan/del", {params: {id: this.delSum}}).then(result => {
                            this.$message.success("删除成功");
                            this.$refs.auxGrid.refresh();
                            this.delSum = [];
                        });
                    })
                }
                this.$refs.grid.refresh();
            },
            /**
             * 选中列表的值
             * */
            selectse(row) {
                this.delArr = row;
            },
            /**
             * 页面初始化
             * */
            initialize() {
                let dataId = this.$route.query['dataId'];
                if (dataId == null || dataId == undefined) {
                } else {
                    /*服务申请信息*/
                    this.$axios.get('biz/ProEvtUserTicket/getByServiceId', {params: {id: dataId}}).then(result => {
                        this.preposeData = result.data;
                        /**
                         * 关联服务单接口
                         * */
                        this.urlWith = "biz/ProEvtServiceTicketRelevan/list";
                        /**
                         * 操作记录接口
                         * */
                        this.urlRecord = "biz/ProEvtServiceTicketLog/list";
                        /*基础信息*/
                        this.$axios.get('biz/ProEvtServiceTicket/getData', {params: {serviceTicket: result.data.serviceTicket}}).then(success => {
                            this.baseData = success.data;
                            this.mainDataForm.proEvtUserTicket.serviceStatus = this.baseData.serviceStatus ? (this.baseData.serviceStatus).toString() : "";
                            this.Form.centerServiceVo.serviceProperty = success.data.serviceProperty;
                            this.Form.centerServiceVo.isBreakdown = success.data.isBreakdown;
                            this.Form.centerServiceVo.serviceRange = success.data.serviceRange;
                            this.Form.centerServiceVo.serviceEmergency = success.data.serviceEmergency;
                            this.Form.centerServiceVo.servicePriority = success.data.servicePriority;
                            this.Form.centerServiceVo.areaCode = success.data.areaCode;
                            this.Form.centerServiceVo.psbcname = success.data.psbcname;
                            this.Form.centerServiceVo.sname = success.data.sname;
                            this.Form.centerServiceVo.lvTitle = success.data.lvText;
                            this.Form.centerServiceVo.isLevelZero = success.data.isLevelZero;
                            this.Form.centerServiceVo.durationDoneExpected = success.data.durationDoneExpected;
                            this.Form.centerServiceVo.isServiceBreakdown = success.data.isServiceBreakdown;
                            this.Form.centerServiceVo.description = success.data.description;
                            this.Form.centerServiceVo.targetId = success.data.targetId;
                            this.Form.centerServiceVo.catalogId = success.data.catalogId;
                            this.Form.centerServiceVo.areaId = success.data.areaId;
                            this.$refs.baseItem.templateData(success.data.catalogId, success.data.areaId);
                            if (success.data.durationDoneUnit == null) {
                                this.Form.centerServiceVo.durationDoneUnit = "2";
                            } else {
                                this.Form.centerServiceVo.durationDoneUnit = success.data.durationDoneUnit + '';
                            }
                        })
                    })
                }
            }
        },
        created() {
            this.initialize();
        },
        /* watch: {
             timeStatus(nowVal) {
                 if (nowVal == "2") {
                     this.overflowH = false;
                     this.$refs.baseItem.refreshForm();
                 }
             },
             deep: true
         },*/
        components: {
            IceFormGroup,
            RefuseRework,
            AppraiseUnsolved,
            IceDatamapTranslater,
            CancelService,
            IceMultipleUpload,
            IceSelect,
            IceDialog,
            IceGridLayout,
            Process, ReturnVisit, ServiceSupplement,
            WorkOrderInformation, Relevance, IceQueryGrid, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, solveQuickly,
            assign, IceFlowForm, serveMessage, basedOnRepeat,
            serviceAsk, Bus
        }
    }
</script>

<style scoped>
    .grid-container {
        width: 100%;
    }

    .footer {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
</style>