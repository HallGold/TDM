<template>
    <el-form style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" :modal="Forms" :rules="Rules"
             ref="forms">
        <!-- 工单信息-->
        <ice-grid-layout name="工单信息" :columns="1">
            <el-form-item><!--  -->
                <ice-query-grid
                        :columns=columnsB
                        :buttons=buttonsB
                        :grid-data="workData"
                        :pagination="false"
                        ref="queryGrid"
                ></ice-query-grid>
            </el-form-item>
        </ice-grid-layout>
        <ice-grid-layout name="用户评价" :columns="2">
            <el-input v-show="false" v-model="Forms.proEvtUserTicket.ticketNumber"></el-input>
            <el-form-item label="解决情况:" label-width="105px" prop="proEvtUserTicket.isDone">
                <el-radio-group v-model="Forms.proEvtUserTicket.isDone">
                    <el-radio label="1">已解决</el-radio>
                    <el-radio label="0">未解决</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="评价用户:" label-width="105px" prop="proEvtUserTicket.userNameFeed">
                <ice-persion-selector title="请选择"
                                      v-model="Forms.proEvtUserTicket.userNameFeed"
                                      choose-item="single"
                ></ice-persion-selector>
            </el-form-item>
            <el-form-item v-show="yes" label="响应速度:" label-width="105px" prop="proEvtUserTicket.responseSpeed">
                <el-rate
                        v-model="Forms.proEvtUserTicket.responseSpeed"
                        show-text>
                </el-rate>
            </el-form-item>
            <el-form-item v-show="yes" label="处理速度:" label-width="105px" prop="proEvtUserTicket.disposeSpeed">
                <el-rate
                        v-model="Forms.proEvtUserTicket.disposeSpeed"
                        show-text>
                </el-rate>
            </el-form-item>
            <el-form-item v-show="yes" label="服务态度:" label-width="105px" prop="proEvtUserTicket.servSpeed">
                <el-rate
                        v-model="Forms.proEvtUserTicket.servSpeed"
                        show-text>
                </el-rate>
            </el-form-item>
            <el-form-item v-show="yes" label="专业能力:" label-width="105px" prop="proEvtUserTicket.ability">
                <el-rate
                        v-model="Forms.proEvtUserTicket.ability"
                        show-text>
                </el-rate>
            </el-form-item>
            <el-form-item v-show="yes" label="总分:" label-width="105px" layout="2" prop="proEvtUserTicket.totalScore">
                <el-input v-model="Forms.proEvtUserTicket.totalScore"></el-input>
            </el-form-item>
            <el-form-item v-show="yes" label="评价:" label-width="105px" layout="2" prop="proEvtUserTicket.evaluation">
                <el-input v-model="Forms.proEvtUserTicket.evaluation" type="textarea"
                          rows="6"></el-input>
            </el-form-item>
            <div v-show="no" layout="2">
                <el-form-item label="未解决原因:" label-width="105px" layout="2" prop="proEvtUserTicket.undoneReason">
                    <el-input
                            v-model="Forms.proEvtUserTicket.undoneReason"></el-input>
                </el-form-item>
                <el-form-item label="未解决说明:" label-width="105px" layout="2" prop="proEvtUserTicket.undoneDetail">
                    <el-input v-model="Forms.proEvtUserTicket.undoneDetail"
                              type="textarea" rows="6"></el-input>
                </el-form-item>
            </div>
        </ice-grid-layout>
        <!--添加工单弹窗-->
        <ice-dialog
                v-dialogDrag title="工单补录" custom-class="ice-dialog" center
                :visible.sync="Visible" remounted
                width="1200px" append-to-body :close-on-click-modal="false">
            <div style="overflow-y: scroll;overflow-x: hidden;height: 500px">
                <work-message :lookNum="lookNum" :workForm="workForm" :number="this.number" :clickNum="this.clickNum"
                              ref="workMessage"
                              :cheng="renovate"></work-message>
            </div>
            <div class="footer" layout="2">
                <el-button type="primary" @click="save">保存
                </el-button>
                <el-button type="info" @click="cancel">取消</el-button>
            </div>
        </ice-dialog>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import BaseMessage from "./base/baseMessage";
    import ServiceAsk from "./base/serviceAsk";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import ServeMessage from "./base/serveMessage"
    import AccessMessage from "./base/AccessoryMessage"
    import affiliatedMessage from "./base/affiliatedMessage"
    import serviceApplyFor from "./base/serviceApplyFor"
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import detail from "./base/detail";
    import {EventEmitter as $} from "events";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import WorkMessage from "./base/workMessage";
    import Bus from "./base/bus.js"

    export default {
        name: "serviceTicketTracking",
        components: {
            WorkMessage, IceSelect, IceDialog, IceQueryGrid, IceSingleUpload,
            ServiceAsk, BaseMessage, IceGridLayout, IceEditableTable, ServeMessage,
            AccessMessage, affiliatedMessage, serviceApplyFor, IceFlowForm, IceDeptSelector,
            IcePersionSelector, IceMultipleUpload, IceDatePicker, Bus
        },
        props: {
            Forms: {}
        },
        data() {
            return {
                gridDataList: [],
                workForm: {
                    proEvtUserTicket: {
                        serviceTicket: "",
                        workTicket: "",
                        status: "10",
                        serviceWay: "",
                        engineerRole: '',
                        engineerName: '',
                        reason: '',
                        gmtBegin: '',
                        gmtEnd: '',
                        resolveStatus: '',
                        measure: '',
                        engineerCode: "",
                        proEvtWorkTicketCatalogList: [],
                    },
                    ProEvtEngineer: [],
                    ApplyInVo: [
                        {
                            orgCode: "1",
                            state: "1",
                            applyTime: "2030-12-30 00:00:00",
                            applyCode: "1",
                            inLocation: "1",
                            applyerName: "1",
                            applyerCode: "1",
                            applyerDepartment: "1"
                        }
                    ]
                },
                workData: [],
                clickNum: "0",
                Visible: false,
                activeName: "first",
                value1: null,
                value2: null,
                value3: null,
                value4: null,
                no: "",
                yes: true,
                activeIndex: '1',
                activeTab: '0',
                aclKeyReadonly: false,
                message: "",
                only: false,
                dataArr: [],
                number: [],
                ProEvtEngineer: [],
                lookNum: "",
                columnsB: [
                    {label: '工单号', code: 'workTicket', width: 200},
                    {label: '工单状态', code: 'status', mapTypeCode: "workStatus"},
                    {label: '工程师角色', code: 'engineerRole', mapTypeCode: "engineerRole"},
                    {label: '工程师名称', code: 'engineerName',},
                    {label: '起因', code: 'reason', mapTypeCode: "eventCause"},
                    {label: '服务方式', code: 'serviceWay', mapTypeCode: "serviceWay"},
                    {
                        label: '开始处理时间', code: 'gmtBegin', width: 200, value: "date", renderCell(h, data) {
                            return data.row.gmtBegin
                        }
                    },
                    {
                        label: '问题解决时间', code: 'gmtEnd', width: 200, renderCell(h, data) {
                            return data.row.gmtEnd
                        }
                    },
                    {label: '解决状态', code: 'resolveStatus', mapTypeCode: "resolveStatus"},
                ],
                buttonsB: [
                    {
                        name: '添加工单', icon: 'el-icon-plus', type: 'primary', callback: this.addThing
                    },
                ],
                Rules: {
                    'proEvtUserTicket.isDone': [{required: true, message: '请选择解决情况', trigger: 'blur'}],
                    'proEvtUserTicket.userNameFeed': [{required: true, message: '请选择评价人', trigger: 'blur'}],
                    'proEvtUserTicket.totalScore': [{required: true, message: '请打分', trigger: 'blur'}],
                },
            }
        },
        methods: {
            /*单号数据*/
            numTicket() {
                this.clickNum = "0"
            },
            /*清空数据并刷新*/
            removeArefresh() {
                this.workData = [];
                this.$refs.queryGrid.refresh();
                this.$refs.forms.resetFields();
                this.Forms.proEvtUserTicket = {
                    ticketNumber: "",
                    ticketType: "0",
                    feedbackType: "0",
                    isDone: "1",
                    userNameFeed: "",
                    totalScore: "",
                    evaluation: "",
                    undoneReason: "",
                    undoneDetail: "",
                    responseSpeed: 0,
                    disposeSpeed: 0,
                    servSpeed: 0,
                    ability: 0
                };
            },
            /* 刷新工单补录 */
            renovate() {
                this.$refs.workMessage.refresh()
            },
            isSuccess() {
                let flag = false;
                this.$refs.forms.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            addThing() {
                this.Visible = true;
                this.clickNum++;
                this.$nextTick(() => {
                    this.$refs.workMessage.delData();
                });
                Bus.$emit("refresh", "true");
            },
            cancel() {
                this.$refs.workMessage.delData();
                this.$nextTick(() => {
                    this.Visible = false;
                    this.lookNum = "close";
                })
            },
            save() {
                if (this.$refs.workMessage.formIsTrue() == false) {
                } else {
                    if (this.workForm.proEvtUserTicket.technologyData == undefined) {

                    } else {
                        for (let j = 0; j < this.workForm.proEvtUserTicket.technologyData.length; j++) {
                            let n = {
                                shortname: this.workForm.proEvtUserTicket.technologyData[j].areaName,
                                areaId: this.workForm.proEvtUserTicket.technologyData[j].areaId,
                                catalogId: this.workForm.proEvtUserTicket.technologyData[j].catalogId,
                                isDefault: "0",
                                parentName: this.workForm.proEvtUserTicket.technologyData[j].shortname,
                                techCategoryName: this.workForm.proEvtUserTicket.technologyData[j].categoryName,
                                techSname: this.workForm.proEvtUserTicket.technologyData[j].bigcategoryName,
                                proEvtWorkTicketDev: {}
                            }
                            n.proEvtWorkTicketDev.devName = this.workForm.proEvtUserTicket.technologyData[j].devName;
                            n.proEvtWorkTicketDev.devId = this.workForm.proEvtUserTicket.technologyData[j].devId;
                            n.proEvtWorkTicketDev.operation = this.workForm.proEvtUserTicket.technologyData[j].operation;
                            n.proEvtWorkTicketDev.gmtCreate = this.workForm.proEvtUserTicket.technologyData[j].gmtCreate;
                            this.workForm.proEvtUserTicket.proEvtWorkTicketCatalogList.push(n);
                        }
                    }
                    if (this.workForm.ProEvtEngineer.length == undefined) {
                        this.ProEvtEngineer = [];
                    } else {
                        for (let i = 0; i < this.workForm.ProEvtEngineer.length; i++) {
                            let m = {
                                engineerCode: this.workForm.ProEvtEngineer[i].usercode,
                                engineerName: this.workForm.ProEvtEngineer[i].engineerName,
                                contribution: this.workForm.ProEvtEngineer[i].contribution,
                                matter: this.workForm.ProEvtEngineer[i].matter,
                                operation: this.workForm.ProEvtEngineer[i].operation,
                            };
                            this.ProEvtEngineer.push(m);
                        }
                    }
                    this.$confirm('确定保存?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {

                        this.$axios.post('biz/ProEvtServiceTicket/additionalWorkTicketMain', {
                            /*处理信息上方form表单*/
                            proEvtWorkTicket: this.workForm.proEvtUserTicket,
                            /*参与人信息*/
                            proEvtEngineers: this.ProEvtEngineer,
                            /*进入申请信息*/
                            applyIns: this.workForm.ApplyInVo
                        }).then(result => {
                            this.$message.success("保存成功！");
                            this.Visible = false;
                            let arr = "";
                            // arr.push(this.workForm.proEvtUserTicket);
                            // this.workData.push(this.workForm.proEvtUserTicket);
                            this.Forms.proEvtUserTicket.ticketNumber = this.workForm.proEvtUserTicket.serviceTicket;
                            arr = JSON.stringify(this.workForm.proEvtUserTicket);
                            this.workData.push(JSON.parse(arr));
                            this.$refs.workMessage.delData();
                            this.lookNum = "close";
                        }).catch(() => {
                            this.$message.error("保存失败！");
                        })
                    });
                }
            },
            //技术目录新增
            //技术服务目录删除
            change(row) {
                this.dataArr = row;
            },
            /**
             * 工单列表必填校验
             * */
            need() {
                if (this.workData.length == "0") {
                    this.$confirm('请添加工单!', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                    return false
                }
                return true
            },
        },
        beforeUpdate() {
            if (this.Forms.proEvtUserTicket.isDone == "0") {
                this.yes = false;
                this.no = true;
            } else if (this.Forms.proEvtUserTicket.isDone == "1") {
                this.yes = true;
                this.no = false;
            }
            if (!!this.Forms.proEvtUserTicket.responseSpeed && !!this.Forms.proEvtUserTicket.disposeSpeed && !!this.Forms.proEvtUserTicket.servSpeed && !!this.Forms.proEvtUserTicket.ability) {
                this.Forms.proEvtUserTicket.totalScore = (this.Forms.proEvtUserTicket.responseSpeed + this.Forms.proEvtUserTicket.disposeSpeed + this.Forms.proEvtUserTicket.servSpeed + this.Forms.proEvtUserTicket.ability) * 0.25;
            }
        },
        mounted() {
            Bus.$on("number", (data => {
                this.number = data;
            }))
        },
        watch: {
            "Forms.proEvtUserTicket.userNameFeed": function (nowVal, oldVal) {
                this.$refs.forms.clearValidate("proEvtUserTicket.userNameFeed");
            }
        }
    }
</script>

<style scoped>
    .footer {
        width: 100%;
        margin-top: 10px;
        display: flex;
        justify-content: center;
    }
</style>