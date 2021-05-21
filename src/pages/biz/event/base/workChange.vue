<template>
    <el-form style="width:100%">
        <!--服务申请信息，不可修改-->
        <serve-message :main-data="mainDataItem"></serve-message>
        <!--服务单基础信息，不可修改-->
        <serve-foundation :main-data="mainDataFound" ref="serveFoundation"></serve-foundation>
        <!--处理信息，可修改-->
        <dispose-message :about-data="saveList"
                         :main-data.sync="mainDataOid"
                         :mainData="mainData"
                         ref="disposeMessage"
                         @change="estimate"
                         @changeRefurbish="technology"
                         @refurbish="thirdparty"></dispose-message>
        <!--附件信息，不可修改-->
        <ice-grid-layout name="附件信息" :columns="1">
            <ice-multiple-upload v-model="mainDataOid.targetId" :disabled="clickType"></ice-multiple-upload>
        </ice-grid-layout>
        <!--附属信息-->
        <subsidiary-message :main-data="mainDataForm" ref="subsidiaryMessage"></subsidiary-message>
        <el-form-item label-width="105px" class="footer-center">
            <el-button :disabled="clickType" type="primary" @click="submitNum">保存</el-button>
            <el-button type="info" @click="cancel">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import ServiceSupplement from "./serviceSupplement";
    import ServeFoundation from "./serveFoundation";
    import DisposeMessage from "./disposeMessage";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import SubsidiaryMessage from "./subsidiaryMessage";
    import ServeMessage from "./serveMessage";

    export default {
        name: "workChange",
        components: {
            ServeMessage,
            SubsidiaryMessage,
            IceMultipleUpload, IceGridLayout, DisposeMessage, ServeFoundation, ServiceSupplement
        },
        data() {
            return {
                workTickets: "",
                targetId: "",
                DataNum: {},
                bizData: {},
                clickType: false,
                saveList: {
                    flagList: false,
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
                    proposerDescribe: ""
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
            }
        },
        methods: {
            /*提交所有数据*/
            submitNum() {
                //    biz/ProEvtServiceTicket/updateFormData
                this.mainDataOid = this.mainData;
                this.bizData = this.mainDataOid;
                this.$axios.post('biz/ProEvtWorkTicket/updateFormData', this.bizData).then(result => {
                    this.$message.success("保存成功!");
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            /*取消修改*/
            cancel() {
                this.$router.go(-1);
            },
            /* 刷新参与人信息 */
            estimate() {
                this.$axios.get("biz/ProEvtEngineer/getEngineer", {params: {workTicket: this.workTickets}}).then(result => {
                });
            },
            /* 点击刷新技术服务目录 */
            technology() {
                let _this = this;
                _this.$axios.get("biz/ProEvtServiceTicket/searchTech", {params: {id: _this.mainDataOid.catalogId}}).then(result => {
                })
            },
            /*点击刷新第三方厂商*/
            thirdparty() {
                this.$axios.get("biz/ProEvtCoopUnit/orderList", {params: {workTicket: this.workTickets}}).then(result => {
                })
            },
        },
        created() {
            let oid = this.$route.query['dataId'];
            this.$axios.get('biz/ProEvtWorkTicket/get', {params: {id: oid}}).then(result => {
                this.mainData = result.data;
                this.mainData.source = this.mainData.source ? this.mainData.source.toString() : '1';
                this.mainData.userLevel = this.mainData.userLevel ? this.mainData.userLevel.toString() : '1';
                if (this.mainData.status == "") {
                    this.mainData.status = "0";
                } else {
                    this.mainData.status = this.mainData.status ? this.mainData.status.toString() : '';
                }
                this.mainData.serviceWay = this.mainData.serviceWay ? this.mainData.serviceWay.toString() : '';
                this.mainDataOid = result.data;
                this.workTickets = result.data.workTicket;
                this.mainDataOid.workTicket = result.data.workTicket;
                this.$axios.get("/biz/ProEvtServiceTicket/getByServiceTicket", {params: {id: result.data.serviceTicket}}).then(success => {
                    this.mainDataItem = success.data;
                    this.mainDataOid.serviceTicket = this.mainDataItem.serviceTicket;
                    this.mainDataForm.serviceTicket = success.data.serviceTicket;
                    this.$refs.subsidiaryMessage.refFirst();
                });
                this.$axios.get("biz/ProEvtServiceTicket/getData", {params: {serviceTicket: result.data.serviceTicket}}).then(success => {
                    this.mainDataFound = success.data;
                    this.mainDataFound.durationDoneUnit = this.mainDataFound.durationDoneUnit ? this.mainDataFound.durationDoneUnit.toString() : '2';
                })
            });
        },
        mounted() {
            let clickType = this.$route.query['click'];
            if (clickType == "look") {
                this.clickType = true;
            } else {
                this.clickType = false;
            }
            this.$refs.disposeMessage.lookChange(clickType);
        }
    }
</script>

<style scoped>
    .footer-center {
        width: 20%;
        margin: auto;
    }
</style>