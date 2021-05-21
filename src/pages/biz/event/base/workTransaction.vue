<template>
    <ice-flow-form name valiate
                   id="iceFlowForm"
                   :flow-ready="flowReady" ref="flowForm"
                   :flow-operate-btn="flowOperateBtn"
                   :flow-biz-data="flowBizData"
                   :btn-extend1="accept"
                   :btn-extend2="applyReturn"
                   :btn-extend3="applyShift"
                   :btn-extend4="applyUpgrade"
                   :btn-extend5="applyHangup"
                   :btn-extend6="alteration"
                   :btn-extend7="centerConfirm"
                   :btn-extend8="centerRefuse">
        <div v-show="showHeaders" slot="fixed"
             style="background-color: #fff;padding:20px;z-index: 10 ;left: 0;top: 0;height: 80px;width: 100%;box-sizing: border-box">
            <el-form>
                <el-row :gutter="10">
                    <el-col :span="8">
                        <el-form-item label="服务单号:" label-width="80px" prop="remark">
                                         <span v-model="mainData.serviceTicket">
                                             {{mainDataItem.serviceTicket}}
                                         </span>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="服务单状态:" label-width="105px"
                                      prop="serviceStatus">
                            <ice-datamap-translater :value="mainData.serviceStatus"
                                                    mapTypeCode="serviceStatus">

                            </ice-datamap-translater>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>

        <el-form :model="mainData" label-position="right" class="conditon-bar" ref="form"
                 style="height: 100%;width: 100%;overflow: hidden">
            <div style="height: 100%;width: 100%;display: flex;flex-direction: column;background-color: #fff;"
                 id="content">
                <el-container id="conditon-bar">
                    <el-header>

                    </el-header>
                    <!-- </div>-->
                    <el-main>
                        <div class="box-botton" style="flex-grow: 1;overflow-y: auto">
                            <!--服务申请信息-->
                            <serve-message :main-data="mainDataItem" :is-success="measurement"></serve-message>
                            <!--服务单基础信息-->
                            <serve-foundation :main-data="mainDataFound" ref="serveFoundation"></serve-foundation>
                            <!--处理信息-->
                            <dispose-message :about-data="saveList"
                                             :main-data.sync="mainDataOid"
                                             ref="disposeMessage"
                                             @change="estimate"
                                             @saveMeeage="msgMeeage"
                                             @changeRefurbish="technology"
                                             @refurbish="thirdparty"></dispose-message>
                            <!--附件信息-->
                            <ice-grid-layout name="附件信息" :columns="columns">
                                <!--多文件上传-->
                                <el-form-item label="附件信息:" label-width="105px" prop="targetId" layout="3">
                                    <ice-multiple-upload v-model="targetId" value-model="string" doSecret
                                                         　:disabled=judge
                                    　　　　　　　　　　　　></ice-multiple-upload>
                                    <!--<span v-model="targetId" value-model="string" :disabled=judge></span> -->
                                </el-form-item>
                            </ice-grid-layout>
                            <!-- 附属信息-->
                            <subsidiary-message :main-data="mainDataForm" ref="subsidiaryMessage"></subsidiary-message>
                        </div>
                    </el-main>
                </el-container>
            </div>
        </el-form>
        <ice-dialog title="工单转派" :visible.sync="redeploy" height="300px" width="450px">
            <redeploy @confirmShift="confirmShift" @cancelShift="cancelShift" ref="redeploy"></redeploy>
        </ice-dialog>
        <!-- 转派原因弹窗 -->
        <ice-dialog title="工单升级" :visible.sync="upgrade" height="300px" width="450px">
            <upgrade @confirmUpgrade="confirmUpgrade" @cancelUpgrade="cancelUpgrade" ref="upgrade"></upgrade>
        </ice-dialog>
        <!-- 退回原因  -->
        <ice-dialog title="工单退回" :visible.sync="sendBack" height="270px" width="450px">
            <send-back @confirmReturn="confirmReturn" @cancelReturn="cancelReturn" ref="sendBack">
            </send-back>
        </ice-dialog>
        <!--   挂起原因     -->
        <ice-dialog title="工单申请挂起" :visible.sync="hangUp" height="270px" width="450px">
            <hang-up @confirmHangUp="confirmHangUp" @cancelHangUp="cancelHangUp" ref="hangUp">
            </hang-up>
        </ice-dialog>
        <!-- 调度中心-拒绝退回 -->
        <ice-dialog title="拒绝退回" :visible.sync="refuseSendBack" height="270px" width="450px">
            <refuse-send-back @confirmRefuseSendBack="confirmRefuseSendBack"
                              @cancelRefuseSendBack="cancelRefuseSendBack"></refuse-send-back>
        </ice-dialog>
        <!-- 调度中心-拒绝转派 -->
        <ice-dialog title="拒绝转派" :visible.sync="refuseRedeploy" height="270px" width="450px">
            <refuse-redeploy @confirmRefuseRedeploy="confirmRefuseRedeploy" @cancelRefuseRedeploy="cancelRefuseRedeploy"
                             ref="refuseRedeploy"></refuse-redeploy>
        </ice-dialog>
        <!-- 调度中心-拒绝升级 -->
        <ice-dialog title="拒绝升级" :visible.sync="refuseUpgrade" height="270px" width="450px">
            <refuse-upgrade @confirmRefuseUpgrade="confirmRefuseUpgrade" @cancelRefuseUpgrade="cancelRefuseUpgrade"
                            ref="refuseUpgrade"></refuse-upgrade>
        </ice-dialog>
        <!-- 调度中心-拒绝挂起 -->
        <ice-dialog title="拒绝挂起" :visible.sync="refuseHangUp" height="270px" width="450px">
            <refuse-hang-up @confirmRefuseHangUp="confirmRefuseHangUp" @cancelRefuseHangUp="cancelRefuseHangUp"
                            ref="refuseHangUp"></refuse-hang-up>
        </ice-dialog>
        <!-- 调度中心-取消 -->
        <ice-dialog title="取消工单" :visible.sync="cancelWork" height="270px" width="450px">
            <cancel-work @confirmCancelWork="confirmCancelWork" @cancelCancelWork="cancelCancelWork"
                         ref="cancelWork"></cancel-work>
        </ice-dialog>
        <!--  调度中心-确认挂起 -->
        <ice-dialog title="确认挂起" :visible.sync="affirmHangUp" height="270px" width="540px">
            <affirm-hang-up @confirmAffirmHangUp="confirmAffirmHangUp" @cancelAffirmHangUp="cancelAffirmHangUp"
                            ref="affirmHangUp"></affirm-hang-up>
        </ice-dialog>
        <!--分派弹窗-->
        <ice-dialog :title="returnAssignTitle" :visible.sync="returnAssign" width="1000px" height="500px">
            <assign :areaID="areaID" @cancel="closeAssign"
                    @confirm="confirmAssign">
            </assign>
        </ice-dialog>
    </ice-flow-form>
</template>
<script>
    import affirmHangUp from "./affirmHangUp"
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload"
    import cancelWork from "./cancelWork"
    import refuseHangUp from "./refuseHangUp"
    import refuseUpgrade from "./refuseUpgrade"
    import refuseRedeploy from "./refuseRedeploy"
    import refuseSendBack from "./refuseSendBack"
    import IceFlowForm from "../../../../components/common/base/IceFlowForm"
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout'
    import IceDialog from "../../../../components/common/base/IceDialog"
    import ServeMessage from "./serveMessage"
    import serveFoundation from "./serveFoundation"
    import disposeMessage from "./disposeMessage"
    import subsidiaryMessage from "./subsidiaryMessage"
    import AccessoryMessage from "./AccessoryMessage"
    import upgrade from "./upgrade"
    import sendBack from "./sendBack"
    import redeploy from "./redeploy"
    import hangUp from "./hangUp"
    import operateType from "./operateType"
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";
    import Assign from "./assign";

    export default {
        name: "workTransaction",
        mixins: [operateType],
        props: {
            change: {}
        },
        data() {

            return {
                areaID: "",
                judge: true,
                alterationDatalist: {},
                mainDataList: "",
                alterationDialog: false,
                areaDataList: [],
                opinionData: "",
                isBreakdownEntry: "",
                targetId: "",
                showHeaders: true,
                returnAssign: false,
                returnAssignTitle: "",
                dataList: Array,
                cancelWork: false,
                affirmHangUp: false,
                refuseHangUp: false,
                refuseUpgrade: false,
                refuseRedeploy: false,
                refuseSendBack: false,
                widthNum: 0,
                catalogId: '',
                workTicket: "",
                serviceTicket: '',
                areaCode: "",
                redeploy: false,
                upgrade: false,
                sendBack: false,
                hangUp: false,
                text: "",
                url1: "",
                saveList: {
                    flagList: false,
                },
                alterationData: {
                    workTicket: "",
                    provisionalData: [],
                    alteration: "",
                    areaCode: "",
                    areaId: ""
                },
                mainData: {
                    serviceTicket: "",
                    serviceStatus: "",
                    user: "",
                    userMonad: "",
                    userGrade: "",
                    userDel: "",
                    userPhone: "",
                    userMailbox: "",
                    proposer: "",
                    proposerUnit: "",
                    proposerPhone: "",
                    proposerDel: "",
                    proposerMailbox: "",
                    applyTime: "",
                    startTime: "",
                    source: "",
                    proposerDescribe: "",
                    technologyData: [],

                },
                /*申请信息字段*/
                mainDataItem: {
                    num: "",
                    isBreakdownEntry: "",
                    targetId: "",
                    userLevel: "",
                    workStatus: "",
                    serviceTicket: "",
                    serviceStatus: "",
                    user: "",
                    userMonad: "",
                    userGrade: "",
                    userDel: "",
                    userPhone: "",
                    userMailbox: "",
                    proposer: "",
                    proposerUnit: "",
                    proposerPhone: "",
                    proposerDel: "",
                    proposerMailbox: "",
                    applyTime: "",
                    startTime: "",
                    source: "",
                    proposerDescribe: ""
                },
                /*服务单基础信息*/
                mainDataFound: {
                    durationDoneUnit: "",
                    targetId: "",
                    serviceProperty: "",
                    isBreakdown: "",
                    areaShortname: "",
                    psbcname: "",
                    sname: "",
                    lvText: "",
                    isLevelZero: "",
                    durationDoneExpected: "",
                    description: ""
                },
                /*处理信息*/
                mainDataOid: {
                    justNumber: "",
                    num: "",
                    time: "",
                    version: "",
                    targetId: "",
                    opinionData: "",
                    areaId: "",
                    widthNum: "",
                    serviceTicket: "",
                    catalogId: "",
                    oid: "",
                    workTicket: "",
                    status: "",
                    serviceWay: "",
                    gmtBegin: "",
                    gmtEnd: "",
                    resolveStatus: "",
                    reason: "",
                    measure: "",
                    handleTime: "",
                    //工单参与人维护列表
                    proEvtEngineers: [],
                    //进入申请列表
                    applyIns: [],
                    //技术服务目录和服务对象--catalogId
                    techCataMsgData: [],
                    //技术服务目录和服务对象--储存devId和操作内容，操作时间
                    ProEvtWorkTicketDev: {},
                    //服务单操作记录
                    proEvtServiceTicketLog: {},
                    //工单操作记录
                    proEvtWorkTicketLog: {},
                    //调度中心分派信息
                    assignVo: {},
                    //第三方厂商
                    coopUnitVos: [],
                    dataList: [],/*参与人信息数组*/
                    technologyData: [],/*技术服务目录数组*/
                },
                /*附属信息字段*/
                mainDataForm: {
                    scienceData: [],
                    opinionData: "",
                    serviceTicket: "",
                    workTicket: '',
                    workStatus: '',
                    serviceWay: '',
                    gmtBegin: '',
                    gmtEnd: '',
                    resolveStatus: '',
                    reason: '',
                    measure: '',
                    activeName: '',
                    catalogId: "",
                    workstauts: ""
                },
                mainDataErea: {},
                columns: 0,
            }

        },
        mounted() {
            this.widthNum = document.getElementById("iceFlowForm").offsetWidth;
            this.mainDataOid.widthNum = this.widthNum
        },
        methods: {
            /*但变更点击确定时，将数据传过去*/
            alterationClick(data) {
                this.alterationData.id = this.$route.query.dataId;
                this.alterationData.url = this.$route.path;
                let a = Date.parse(new Date());
                this.alterationData.workTicket = this.mainDataOid.workTicket;
                this.alterationData.serviceTicket = this.mainDataOid.serviceTicket;
                this.alterationData.areaName = this.mainDataFound.areaShortname;
                this.alterationData.isBreakdown = this.mainDataFound.isBreakdown;
                this.alterationData.areaCode = this.mainDataOid.areaCode;
                this.alterationData.areaId = this.mainDataOid.areaId;
                this.alterationData.alterationDatalist = this.mainDataFound;
                this.mainDataList = JSON.stringify(this.alterationData);
                localStorage.setItem(a, this.mainDataList);
                this.$router.push("/biz/alteration/alterationEdit?actionData=" + a);
            },
            /* 点击刷新技术服务目录 */
            technology() {
                let _this = this;
                _this.$axios.get("biz/ProEvtServiceTicket/searchTech", {params: {id: _this.mainDataOid.catalogId}}).then(result => {
                })
            },
            /*点击刷新第三方厂商*/
            thirdparty() {
                this.$axios.get("biz/ProEvtCoopUnit/orderList", {params: {workTicket: this.mainDataOid.workTicket}}).then(result => {
                })
            },
            /* 刷新参与人信息 */
            estimate() {
                this.$axios.get("biz/ProEvtEngineer/getEngineer", {params: {workTicket: this.mainDataForm.workTicket}}).then(result => {
                });
            },
            /* 点击解决时-传送收集起来的数据 */
            msgMeeage(techCataObj) {
                let _this = this;
                let objData = {};
                _this.mainDataOid.techCataMsgData = [];
                _this.mainDataOid = techCataObj;
                _this.mainDataOid.proEvtEngineers = techCataObj.dataList;
                for (let i = 0; i < techCataObj.technologyData.length; i++) {
                    let workTicketDev = {};
                    objData = techCataObj.technologyData[i];
                    workTicketDev.devId = techCataObj.technologyData[i].devId;
                    workTicketDev.operateContent = techCataObj.technologyData[i].operateContent;
                    workTicketDev.operateDate = techCataObj.technologyData[i].operateDate;
                    _this.mainDataOid.techCataMsgData.ProEvtWorkTicketDev = workTicketDev;
                    objData.ProEvtWorkTicketDev = workTicketDev;
                    _this.mainDataOid.techCataMsgData.push(objData);
                }
                this.mainDataOid.targetId = this.targetId;
            },
            flowReady(flowcont, bizdata) {
                let total = this.$route.query;
                this.opinionData = total.opinionData;
                this.showOrHiddenBtn(flowcont, bizdata);
                if (total.type == "detail") {
                    this.$refs[`flowForm`].hiddenBtn("save,submit,extend1,extend2,extend3,extend4,extend5,extend6,extend7,extend8");
                }
                let _this = this;

                /*处理信息*/
                this.$axios.get('biz/ProEvtWorkTicket/get', {params: {id: total.dataId}}).then(result => {
                    /*拿到回显的附件信息*/
                    _this.targetId = result.data.targetId;
                    let workTicket = '';
                    Object.assign(_this.mainDataOid, result.data);
                    _this.mainDataOid.time = result.data.gmtBegin;
                    /*判断附件上传是否可以操作*/
                    if (_this.mainDataOid.status == 1) {
                        _this.judge = false;
                    }
                    this.showOrHiddenBtn(flowcont, bizdata,result.data.status);
                    workTicket = _this.mainDataOid.workTicket;
                    _this.mainDataOid.status = _this.mainDataOid.status.toString();
                    /*获取工单状态判断关联列表的按钮是否显现*/
                    _this.workStatus = result.data.status;
                    _this.mainDataForm.serviceTicket = result.data.serviceTicket;
                    _this.mainDataItem.workStatus = result.data.status;
                    _this.$refs.subsidiaryMessage.refresh({
                        workStatus: _this.workStatus,
                        opinionData: this.opinionData
                    });
                    _this.$refs.disposeMessage.refresh({
                        workTicket: _this.mainDataOid.workTicket,
                        status: _this.mainDataOid.status,
                        opinionData: this.opinionData
                    });
                    let data = result.data;
                    _this.mainDataForm.workTicket = result.data.workTicket;
                    /*判断后台工单服务目录是否有数据*/
                    _this.version = result.data.version;
                    /*工单技术服务目录赋值*/
                    _this.areaDataList = result.data.proEvtWorkTicketCatalogList;
                    this.participantMessage(_this.mainDataForm.workTicket);
                    this.getApply(result.data.serviceTicket);
                    this.serveData(data.serviceTicket);

                    this.coopUnitVosData(workTicket);
                    _this.mainDataOid.workTicket = workTicket;
                });
                if (flowcont.nodeId == "centerHandle") {
                    this.$refs.flowForm.hiddenBtn('submit');
                }
            },
            coopUnitVosData(data) {
                let _this = this;
                _this.$axios.get("biz/ProEvtCoopUnit/orderList", {params: {workTicket: data}}).then(result => {
                    /*第三方厂商-数组*/
                    _this.mainDataOid.coopUnitVos = result.data;

                })
            },
            /*参与人信息请求*/
            participantMessage(data) {
                this.$axios.get("biz/ProEvtEngineer/getEngineer", {params: {workTicket: data}}).then(result => {
                    /*参与人信息-数组*/
                    this.mainDataOid.dataList = result.data;
                });
            },
            /* 服务单基础信息 */
            getApply(data) {
                let _this = this;
                this.$axios.get("biz/ProEvtServiceTicket/getData", {params: {serviceTicket: data}}).then(success => {
                    _this.mainDataOid.catalogId = success.data.catalogId;
                    /*取到区域code*/
                    _this.mainDataOid.areaCode = success.data.areaCode;
                    _this.mainDataForm.catalogId = success.data.catalogId;
                    this.mainDataFound = success.data;
                    // this.mainDataFound.durationDoneUnit = success.data.durationDoneUnit.toString();
                    this.mainDataFound.durationDoneUnit = '2';
                    this.mainData.serviceStatus = success.data.serviceStatus ? success.data.serviceStatus + "" : "";
                    this.mainDataFound.isLevelZero = success.data.isLevelZero ? success.data.isLevelZero + "" : "";
                    this.mainDataFound.serviceProperty = success.data.serviceProperty ? success.data.serviceProperty + '' : '';
                    /*区域名遍历取id*/
                    this.$axios.get('/pro/ProBaseArea/tree').then(result => {
                        _this.area = result.data[0].children;
                        for (let i = 0; i < _this.area.length; i++) {
                            if (_this.area[i].code == _this.mainDataOid.areaCode) {
                                _this.mainDataOid.areaId = _this.area[i].oid;
                            }
                        }
                    });
                    if (this.version == 0) {
                        /*服务单技术目录*/
                        this.getDataList(data);
                    }
                    {
                        /*工单技术目录*/
                        this.getListData(data);
                    }
                }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            /*工单技术服务目录*/
            getListData(data) {
                if (this.areaDataList.length == "0") {

                } else {
                    for (let i = 0; i < this.areaDataList.length; i++) {
                        let mianList = {};
                        mianList.shortname = this.areaDataList[i].shortname;
                        mianList.parentName = this.areaDataList[i].parentName;
                        mianList.techCategoryName = this.areaDataList[i].techCategoryName;
                        mianList.techSname = this.areaDataList[i].techSname;
                        if (this.areaDataList[i].proEvtWorkTicketDev != null) {
                            mianList.devName = this.areaDataList[i].proEvtWorkTicketDev.devName;
                            mianList.operateContent = this.areaDataList[i].proEvtWorkTicketDev.operateContent;
                            mianList.operateDate = this.areaDataList[i].proEvtWorkTicketDev.operateDate;
                            mianList.devId = this.areaDataList[i].proEvtWorkTicketDev.devId;
                        }
                        this.mainDataOid.technologyData.push(mianList);
                    }
                }
            },
            /*服务单技术服务目录*/
            getDataList(data) {
                let _this = this;
                _this.$axios.get("biz/ProEvtServiceTicket/getData", {params: {serviceTicket: data}}).then(result => {
                    this.areaID = result.data.areaId;
                    if (result.data) {
                        _this.alterationData.provisionalData = result.data.viewProScBizTeches;
                        _this.mainDataOid.technologyData = result.data.viewProScBizTeches;
                        for (let i = 0; i < _this.mainDataOid.technologyData.length; i++) {
                            _this.mainDataOid.technologyData[i].catalogId = _this.mainDataOid.technologyData[i].techId;
                        }
                    }
                });
            },
            /*服务单申请信息*/
            serveData(data) {
                this.$axios.get("/biz/ProEvtServiceTicket/getByServiceTicket", {params: {id: data}}).then(success => {
                    let that = this;
                    if (success.data) {
                        that.mainDataItem = success.data;
                        that.mainDataOid.num = success.data.num;
                        that.mainDataOid.justNumber = success.data.num;
                        that.mainDataItem.userLevel = success.data.userLevel ? success.data.userLevel + "" : "";
                        that.mainDataForm.serviceTicket = success.data.serviceTicket;
                        /*判断报障方式*/
                        that.isBreakdownEntry = success.data.isBreakdownEntry;
                        that.measurement(that.isBreakdownEntry);
                        that.$refs.subsidiaryMessage.refresh({
                            workStatus: that.workStatus,
                            opinionData: that.opinionData
                        });
                        that.mainDataItem.source = success.data.source.toString();
                    }
                })
            },
            measurement(data) {
                this.isBreakdownEntry = data;
            },
            flowOperateBtn(flowcont, bizdata) {
                if (flowcont.nodeId == "workTicketHandle" && flowcont.operateType == "submit") {
                    this.$refs.disposeMessage.isTrue();
                    if (this.$refs.disposeMessage.getIsTrue()) {
                        //工单解决
                        flowcont.processVar = {
                            finish: "1",
                            confirm: "agree"
                        };
                        this.mainDataOid.proEvtWorkTicketLog = {
                            workTicket: this.mainDataOid.workTicket,
                            operationType: this.workTicketOperateType.SOLVE_TYPE
                        };
                        /*this.msgMeeage();*/
                        return true;
                    }
                } else if (flowcont.nodeId == "centerHandle" && flowcont.operateType == "stop") {
                    //调度中心取消
                    flowcont.processVar = {
                        finish: "0",
                        confirm: "refuse"
                    };
                    this.cancelWork = true;
                    return false;
                } else {
                    this.$refs.disposeMessage.getIsTrue();
                    return true;
                }
            },

            flowBizData() {
                return this.mainDataOid;
            },
            /**
             * 受理
             * @param flowContext
             * @param bizData
             */
            accept(flowContext, bizData) {
                this.$confirm('请确定是否受理工单！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.put("/biz/ProEvtWorkTicket/accept", {workTicket: this.mainDataOid.workTicket}).then(success => {
                        this.$message.success("受理成功！");
                        this.flowReady(flowContext, bizData);
                    }).catch(error => {
                        this.$message.error("受理失败！" + error)
                    })
                });
            },
            /**
             * 申请退回
             * @param flowContext
             * @param bizData
             */
            applyReturn(flowContext, bizData) {
                this.sendBack = true;
                flowContext.processVar = {
                    finish: "0",
                    confirm: "agree"
                };
            },
            confirmReturn(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.APPLY_BACK_TYPE;
                this.$refs.sendBack.isTrue();
                if (this.$refs.sendBack.getIsTrue()) {
                    this.$nextTick(() => {
                        this.sendBack = false;
                        this.commitFlow();
                    });
                }
            },
            cancelReturn() {
                this.sendBack = false;
            },
            /**
             * 申请转派
             * @param flowContext
             * @param bizData
             */
            applyShift(flowContext, bizData) {
                this.redeploy = true;
                flowContext.processVar = {
                    finish: "0",
                    confirm: "agree"
                };
            },
            confirmShift(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.APPLY_DISPATCH_TYPE;
                this.$refs.redeploy.isTrue();
                if (this.$refs.redeploy.getIsTrue()) {
                    this.$nextTick(() => {
                        this.redeploy = false;
                        this.commitFlow();
                    });
                }
            },
            cancelShift() {
                this.redeploy = false;
            },
            /**
             * 申请升级
             * @param flowContext
             * @param bizData
             */
            applyUpgrade(flowContext, bizData) {
                this.upgrade = true;
                flowContext.processVar = {
                    finish: "0",
                    confirm: "agree"
                };
            },
            confirmUpgrade(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = "10";
                this.$refs.upgrade.isTrue();
                if (this.$refs.upgrade.getIsTrue()) {
                    this.$nextTick(() => {
                        this.upgrade = false;
                        this.commitFlow();
                    });
                }
            },
            cancelUpgrade() {
                this.upgrade = false;
            },
            /**
             * 申请挂起
             * @param flowContext
             * @param bizData
             */
            applyHangup(flowContext, bizData) {
                this.hangUp = true;
                flowContext.processVar = {
                    finish: "0",
                    confirm: "agree"
                };
            },
            confirmHangUp(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.APPLY_HANG_UP_TYPE;
                this.$refs.hangUp.isTrue();
                if (this.$refs.hangUp.getIsTrue()) {
                    this.$nextTick(() => {
                        this.hangUp = false;
                        this.commitHangup(this.mainDataOid.proEvtWorkTicketLog);
                    });
                }
            },
            cancelHangUp() {
                this.hangUp = false;
            },
            /**
             * 变更
             * @param flowContext
             * @param bizData
             */
            alteration(flowContext, bizData) {
                this.$confirm("是否确定要变更?", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.alterationClick();
                })


            },
            /**
             * 提交挂起
             */
            commitHangup(proEvtWorkTicketLog) {
                this.$axios.post('/biz/ProEvtWorkTicket/workTicketHangup', proEvtWorkTicketLog).then(result => {
                    this.$message.success("挂起成功");
                })
            },
            /**
             * 提交流程
             */
            commitFlow() {
                this.$refs.flowForm.flowContext.operateType = "submit";
                this.$refs.flowForm.flowGetNexNode();
                this.$refs.flowForm.flowOperate();
            },
            /**
             * 调度中心确认
             */
            centerConfirm(flowContext, bizData) {
                let workStatus = this.mainDataOid.status;
                flowContext.processVar = {
                    finish: "1",
                    confirm: "agree"
                };
                switch (workStatus) {
                    case "2":
                        //确认挂起
                        flowContext.processVar = {
                            finish: "1",
                            confirm: "refuse"
                        };
                        this.affirmHangUp = true;
                        break;
                    case "3":
                        //确认升级
                        this.returnAssignTitle = "确认升级";
                        this.returnAssign = true;
                        break;
                    case "4":
                        //确认转派
                        this.returnAssignTitle = "确认转派";
                        this.returnAssign = true;
                        break;
                    case "5":
                        //确认退回
                        this.returnAssignTitle = "确认退回";
                        this.returnAssign = true;
                        break;
                    default:
                }
            },
            /**
             * 调度中心确认升级、转派、退回再分派
             */
            confirmAssign(value) {
                this.mainDataOid.assignVo = value;
                this.mainDataOid.assignVo.serviceTicket = this.mainDataOid.serviceTicket;
                this.mainDataOid.assignVo.workTicket = this.mainDataOid.workTicket;
                switch (this.mainDataOid.status) {
                    case "3":
                        //确认升级
                        this.mainDataOid.assignVo.operType = this.serviceOperateType.ACCEPT_UPGRADE;
                        this.mainDataOid.proEvtWorkTicketLog.operationType = "12";
                        break;
                    case "4":
                        //确认转派
                        this.mainDataOid.assignVo.operType = this.serviceOperateType.ACCEPT_SHIFT;
                        this.mainDataOid.proEvtWorkTicketLog.operationType = "22";
                        break;
                    case "5":
                        //确认退回
                        this.mainDataOid.assignVo.operType = this.serviceOperateType.ACCEPT_RETURN;
                        this.mainDataOid.proEvtWorkTicketLog.operationType = "8";
                        break;
                    default:
                }
                this.returnAssign = false;
                this.commitFlow();
            },
            closeAssign(value) {
                this.returnAssign = value;
            },

            /**
             * 调度中心确认挂起
             */
            confirmAffirmHangUp(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.CONFIRM_HANG_UP_TYPE;
                this.refuseSendBack = false;
                this.commitFlow();
            },
            cancelAffirmHangUp() {
                this.affirmHangUp = false;
            },
            /**
             * 调度中心拒绝
             */
            centerRefuse(flowContext, bizData) {
                let workStatus = this.mainDataOid.status;
                flowContext.processVar = {
                    finish: "0",
                    confirm: "refuse"
                };
                switch (workStatus) {
                    case "2":
                        //拒绝挂起
                        this.refuseHangUp = true;
                        break;
                    case "3":
                        //拒绝升级
                        this.refuseUpgrade = true;
                        break;
                    case "4":
                        //拒绝转派
                        this.refuseRedeploy = true;
                        break;
                    case "5":
                        //拒绝退回
                        this.refuseSendBack = true;
                        break;
                    default:
                }
            },

            /**
             * 拒绝退回确认
             */
            confirmRefuseSendBack(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.REFUSE_BACK_TYPE;
                this.refuseSendBack = false;
                this.commitFlow();
            },
            cancelRefuseSendBack() {
                this.refuseSendBack = false;
            },

            /**
             * 拒绝转派确认
             */
            confirmRefuseRedeploy(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.REFUSE_DISPATCH_TYPE;
                this.refuseRedeploy = false;
                this.commitFlow();
            },
            cancelRefuseRedeploy() {
                this.refuseRedeploy = false;
            },

            /**
             * 拒绝升级确认
             */
            confirmRefuseUpgrade(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.REFUSE_UPGRADE_TYPE;
                this.refuseRedeploy = false;
                this.commitFlow();
            },
            cancelRefuseUpgrade() {
                this.refuseUpgrade = false;
            },
            /**
             * 拒绝挂起确认
             */
            confirmRefuseHangUp(value) {
                this.mainDataOid.proEvtWorkTicketLog = value;
                this.mainDataOid.proEvtWorkTicketLog.workTicket = this.mainDataOid.workTicket;
                this.mainDataOid.proEvtWorkTicketLog.operationType = this.workTicketOperateType.REFUSE_HANG_UP_TYPE;
                this.refuseRedeploy = false;
                this.commitFlow();
            },
            cancelRefuseHangUp() {
                this.refuseHangUp = false;
            },

            /**
             * 调度中心确认取消
             */
            confirmCancelWork(value) {
                this.$refs.cancelWork.isTrue();
                if (this.$refs.cancelWork.getIsTrue()) {
                    this.mainDataOid.proEvtServiceTicketLog = value;
                    this.mainDataOid.proEvtServiceTicketLog.serviceTicket = this.mainDataOid.serviceTicket;
                    this.$nextTick(() => {
                        this.cancelWork = false;
                        this.$refs.flowForm.flowContext.operateType = "stop";
                        this.$refs.flowForm.flowGetNexNode();
                        this.$refs.flowForm.flowOperate();
                    });
                }
            },
            cancelCancelWork() {
                this.cancelWork = false;
            },
            /**
             * @Desc   控制按钮的显示隐藏
             * @Date   2019/8/20 11:41
             */
            showOrHiddenBtn(flowContext, bizData,data) {
                console.log(bizData);
                console.log(data);
                // 工单处理环节流程按钮显隐
                if (flowContext.nodeId == 'workTicketHandle' && flowContext.getIsAuthor()) {
                    if (bizData.status == "0") {
                        //工单待受理（受理前）
                        this.$refs.flowForm.hiddenBtn('save,submit,extend3,extend4,extend5,extend6');
                    }
                    if (data == "1") {
                        //工单处理中（受理后）
                        this.$refs.flowForm.hiddenBtn('extend1');
                        this.$refs.flowForm.showBtn('save,submit,extend2,extend3,extend4,extend5,extend6');
                    } else if (data == "7") {
                        //工单已挂起
                        this.$refs.flowForm.hiddenBtn('save,submit,extend1,extend2,extend3,extend4,extend5,extend6');
                    }
                }
            }
        },
        components: {
            Assign,
            IceDatamapTranslater,
            AccessoryMessage,
            subsidiaryMessage,
            disposeMessage,
            serveFoundation,
            ServeMessage,
            IceQueryGrid,
            IceGridLayout,
            IceFlowForm,
            upgrade,
            sendBack,
            hangUp,
            redeploy,
            IceDialog,
            refuseSendBack,
            refuseRedeploy,
            refuseUpgrade,
            refuseHangUp,
            cancelWork,
            IceMultipleUpload,
            affirmHangUp,
        }
    }
</script>

<style scoped>
    box-left {
        margin-left: 70px;
    }

</style>