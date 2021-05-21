<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" class="ClassName">
        <!--服务单跟踪 主列表-->
        <!-- /biz/ProEvtServiceTicket/searchPageUserServTicket-->
        <ice-query-grid
                data-url="/biz/ProEvtServiceTicket/searchPageTrackingServTicket"
                :columns=columns
                :query="[...commonQuery,...queryMap[activeTab]]"
                :operations="operations"
                :operationsWidth=100
                :buttons="buttons"
                :gridData="information"
                chooseItem="multiple"
                @selection-change="select"
                :title="exportTitle"
                ref="grids">
        </ice-query-grid>
        <!--对服务单进行标注-->
        <ice-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="VisibleItemLabel"
                    width="50%" append-to-body :close-on-click-modal="false" remounted>
            <el-form :model="labelForm" :rules="formRules" ref="saveLabelForm">
                <el-form-item label="服务单号:" label-width="105px">
                    {{serviceTicket}}
                </el-form-item>
                <el-form-item label="标注:" label-width="105px" prop="labelContent">
                    <el-input type="textarea" maxlength="1024" v-model="labelForm.labelContent"></el-input>
                    <el-input type="hidden" v-model="labelForm.serviceTicket"></el-input>
                </el-form-item>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveLabel">确定</el-button>
                <el-button type="info" @click="closeLabel">取消</el-button>
            </div>
        </ice-dialog>
        <!--查看派出工单弹出框-->
        <ice-dialog v-dialogDrag title="查看派出工单" custom-class="ice-dialog" center :visible.sync="Visible2"
                    width="1200px" append-to-body :close-on-click-modal="false" remounted>
            <look-over :hasTicket="hasTicket" :catalogNum="catalogNum"></look-over>
        </ice-dialog>
        <!--服务申请补录-->
        <ice-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="VisibleItem"
                    width="1200px" height="560px" append-to-body :close-on-click-modal="false" remounted :before-close="clickClose">
            <div style="overflow-y: scroll;overflow-x: hidden;height: 500px">
                <!--申请信息-->
                <el-tabs v-model="activeName" type="card">
                    <!--服务单补录-->
                    <el-tab-pane label="服务单补录" name="first" :disabled="order">
                        <!--申请补录 申请信息-->
                        <ice-grid-layout name="申请信息" :columns="1">
                            <service-second ref="serviceData" :mainDataForm="mainDataForm"
                                            :number="this.num"></service-second>
                        </ice-grid-layout>
                        <add-to-message ref="dataForm" :dataForm="dataForm"></add-to-message>
                    </el-tab-pane>
                    <!--工单补录-->
                    <el-tab-pane label="工单补录" name="second" :disabled="orderes">
                        <service-ticket-tracking :Forms="Forms" ref="STTforms"></service-ticket-tracking>
                        <div style="height: 30px;width: 100%"></div>
                    </el-tab-pane>
                </el-tabs>
                <!--保存 取消按钮-->
                <div class="footer">
                    <el-button type="primary" @click="save">保存
                    </el-button>
                    <el-button type="info" @click="close">取消</el-button>
                </div>
            </div>
        </ice-dialog>
        <!--抄送人员选择-->
        <ice-persion-selector ref="person" mode="hidden" @select-confirm="blameSelectUser"></ice-persion-selector>
    </div>
</template>

<script>
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import IceDialog from "../../../components/common/base/IceDialog";
    import ServiceTicketTracking from "./serviceTicketTracking";
    import serviceAsk from "./base/serviceAsk";
    import BaseMessage from "./base/baseMessage";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import LookOver from "./base/lookOver";
    import AddToMessage from "./base/addToMessage";
    import ServiceSecond from "./base/serviceSecond";
    import bus from './base/bus.js'

    export default {
        name: 'serviceTrack',
        data() {
            return {
                labelContent: '', //标注
                activetime: 'all',
                activeName: "first",
                Visiblel: false,
                Visible2: false,
                VisibleItemLabel: false,
                VisibleItem: false,
                Visible4: false,
                aclKeyReadonly: false,
                dataArray: [],
                information: [],
                attentionArr: [],
                unAttentionArr: [],
                people: [],
                incident: [],
                hasTicket: "",
                catalogNum: "",
                order: false,
                orderes: true,
                serviceTicket: "",
                exportTitle: "服务单跟踪-服务申请",
                childs: "",
                title: "",
                num: "1",
                areaIds: "",
                templateIds: "",
                newServiceTicket: "",
                formRules: {//标注表单字段规则
                    labelContent: [{required: true, message: '请输入标注内容', trigger: 'blur'}]
                },
                Form: {
                    proEvtUserTicket: {
                        shortname: "",
                        psbcname: "",
                        sname: "",
                        isUsrLv: "",
                        lv: ""
                    }
                },
                //工单补录页面数据
                Forms: {
                    proEvtUserTicket: {
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
                        ability: 0,
                        targetId: []
                    }
                },
                //服务单补录页面数据
                labelForm: {
                    labelContent: "",
                    serviceTicket: ""
                },
                dataForm: {
                    ProEvtServiceTicket: {
                        serviceProperty: "",
                        isBreakdown: "0",
                        serviceRange: "",
                        serviceEmergency: "",
                        servicePriority: "",
                        areaCode: "请选择",
                        psbcname: "",
                        sname: "",
                        lvTitle: "",
                        handlerText: "",
                        description: "",
                        isServiceBreakdown: "0",
                        durationDoneUnit: "",
                        isLevelZero: "0",
                        targetId: [],
                    },
                    serviceTicketCatalogs: []
                },
                //服务单补录 申请信息
                mainDataForm: {
                    proEvtUserTicket: {
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
                        targetId: [],
                        gmtCreate: "",
                        malfunction: "7",
                    },
                },
                columns: [
                    {label: '服务单号', code: 'serviceTicket', width: 150},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"},
                    {label: '用户', code: 'userName', width: 100},
                    {
                        label: '用户星级', code: 'userLevel', renderCell(h, data) {
                            if (data.row.userLevel == null) {
                                return '1星级'
                            }
                            return data.row.userLevel + '星级'
                        }
                    },
                    {label: '派单人', code: 'schedulerName', width: 100},
                    {label: '处理人', code: 'disposePerson', width: 100},
                    // {label: '申请人', code: 'creatorName', width: 100},
                    {label: '描述', code: 'description', width: 300, align: "left"},
                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                    {label: '区域', code: 'areaShortname', width: 100},
                    {label: '业务服务名称', code: 'categoryname', width: 100},
                    {label: '服务项', code: 'catalogname', width: 100},
                    {label: '性质', code: 'serviceProperty', mapTypeCode: "serviceProperties", width: 100},
                    {label: '申请时间', code: 'gmtCreate', width: 200},
                    {label: '派单时间', code: 'gmtSchedule', width: 200},
                    {label: '派单方式', code: 'scheduleWay', width: 200, mapTypeCode: "SCHEDULEWAY"},
                    {label: '工程师响应时间', code: 'gmtResponseEg', width: 200},
                    {label: '关单时间', code: 'gmtClose', width: 200},
                    {label: '满意度', code: 'satisfaction',},
                    {label: '评价模式', code: 'feedbackType', mapTypeCode: "feedbackType"},
                    {
                        label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                            return <div class="cell" title={data.row.ticket}>
                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                            </div>;
                        }
                    },
                    {label: '', code: 'IS_BREAKDOWN', hidden: true, value: 0},
                ],
                form: {
                    resource: '',
                    region: ''
                },
                queryMap: {
                    '0': [
                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                        {type: 'input', label: '申请用户', code: 'USER_NAME', value: '',},
                        {type: 'date', label: '建单时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                        {type: 'date', label: '建单时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                        {type: 'input', label: '派单人', code: 'SCHEDULER_NAME', value: '',},
                        // {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: ''},
                        {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                        {
                            type: 'select',
                            label: '服务单状态',
                            code: 'SERVICE_STATUS',
                            value: '',
                            mapTypeCode: "serviceStatus"
                        },
                        {type: 'select', label: '来源', code: 'SOURCE', value: '', mapTypeCode: "eventSource"},
                        {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',},
                        {
                            type: 'select',
                            label: '性质',
                            code: 'SERVICE_PROPERTY',
                            value: '',
                            mapTypeCode: "serviceProperties"
                        },
                        {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: '',},
                        {type: 'select', label: '满意度', code: 'satisfaction', value: '', mapTypeCode: "satisfaction"},
                        {type: 'select', label: '派单方式', code: 'scheduleWay', value: '', mapTypeCode: "SCHEDULEWAY"},
                        {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: ''},
                        {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                        {type: 'date', label: '派单时间(开始)', code: 'gmtSchedule', value: '', exp: ">=",compare:3},
                        {type: 'date', label: '派单时间(结束)', code: 'gmtSchedule', value: '', exp: "<=",compare:4},
                        {type: 'select', label: '评价模式', code: 'feedbackType', value: '', mapTypeCode: "feedbackType"},
                        // {type: 'date', label: '工程师响应时间', code: 'gmtResponseeg', value: '',},
                        // {type: 'date', label: '关单时间', code: 'gmtClose', value: '',},
                    ],
                },
                activeTab: '0',
                commonQuery: [{
                    type: 'tab',
                    label: '状态',
                    code: 'IS_BREAKDOWN',
                    value: '0',
                    click: value => {
                        if (value === '0') {
                            this.dataArray = [];
                            this.exportTitle = "服务单跟踪-服务申请";
                            this.columns = [
                                {label: '服务单号', code: 'serviceTicket', width: 150},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '派单人', code: 'schedulerName', width: 100},
                                {label: '处理人', code: 'disposePerson', width: 100},
                                // {label: '申请人', code: 'creatorName', width: 100},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '区域', code: 'areaShortname',},
                                {label: '业务服务名称', code: 'categoryname', width: 200},
                                {label: '服务项', code: 'catalogname',},
                                {label: '性质', code: 'serviceProperty', mapTypeCode: "serviceProperties"},
                                {label: '申请时间', code: 'gmtCreate', width: 200},
                                {label: '派单时间', code: 'gmtSchedule', width: 200},
                                {label: '工程师响应时间', code: 'gmtResponseEg', width: 200},
                                {label: '关单时间', code: 'gmtClose', width: 200},
                                {label: '满意度', code: 'satisfaction',},
                                {label: '评价模式', code: 'feedbackType', mapTypeCode: "feedbackType"},
                                {
                                    label: '关注', code: 'ticket',fixed:"right", renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                },
                                {label: '', code: 'IS_BREAKDOWN', hidden: true, value: 0},
                            ];
                            this.queryMap = {
                                '0': [
                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '申请用户', code: 'USER_NAME', value: '',},
                                    {type: 'date', label: '建单时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '建单时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '派单人', code: 'SCHEDULER_NAME', value: '',},
                                    // {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: ''},
                                    {
                                        type: 'select',
                                        label: '用户星级',
                                        code: 'USER_LEVEL',
                                        mapTypeCode: "userLevel",
                                        value: ""
                                    },
                                    {
                                        type: 'select',
                                        label: '解决状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '来源',
                                        code: 'SOURCE',
                                        value: '',
                                        mapTypeCode: "eventSource"
                                    },
                                    {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',},
                                    {
                                        type: 'select',
                                        label: '性质',
                                        code: 'SERVICE_PROPERTY',
                                        value: '',
                                        mapTypeCode: "serviceProperties"
                                    },
                                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '满意度',
                                        code: 'satisfaction',
                                        value: '',
                                        mapTypeCode: "satisfaction"
                                    },
                                    {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: ''},
                                    {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                                    {type: 'date', label: '派单时间', code: 'gmtSchedule', value: '',compare:3},
                                    {type: 'select', label: '评价模式', code: 'feedbackType', value: ''},
                                    // {type: 'date', label: '工程师响应时间', code: 'gmtResponseeg', value: '',},
                                    // {type: 'date', label: '关单时间', code: 'gmtClose', value: '',},
                                ],
                            };
                        } else if (value === '1') {
                            this.dataArray = [];
                            this.exportTitle = "服务单跟踪-故障";
                            this.columns = [
                                {label: '服务单号', code: 'serviceTicket', width: 150},
                                {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"},
                                {label: '用户', code: 'userName', width: 100},
                                {
                                    label: '用户星级', code: 'userLevel', renderCell(h, data) {
                                        if (data.row.userLevel == null) {
                                            return '1星级'
                                        }
                                        return data.row.userLevel + '星级'
                                    }
                                },
                                {label: '派单人', code: 'schedulerName', width: 100},
                                {label: '处理人', code: 'disposePerson', width: 100},
                                // {label: '申请人', code: 'creatorName', width: 100},
                                {label: '描述', code: 'description', width: 300, align: "left"},
                                {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                {label: '区域', code: 'areaShortname',},
                                {label: '业务服务名称', code: 'categoryname', width: 200},
                                {label: '服务项', code: 'catalogname',},
                                {label: '故障开始时间', code: 'gmtBegin', width: 200},
                                {label: '申请时间', code: 'gmtCreate', width: 200},
                                {label: '派单时间', code: 'gmtSchedule', width: 200},
                                {label: '工程师响应时间', code: 'gmtResponseEg', width: 200},
                                {label: '关单时间', code: 'gmtClose', width: 200},
                                {label: '满意度', code: 'satisfaction',},
                                {label: '评价模式', code: 'feedbackType', mapTypeCode: "feedbackType"},
                                {
                                    label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                        return <div class="cell" title={data.row.ticket}>
                                            <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                        </div>;
                                    }
                                },
                                {label: '', code: 'IS_BREAKDOWN', hidden: true, value: 1},
                            ];
                            this.queryMap = {
                                '0': [
                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {type: 'input', label: '申请用户', code: 'USER_NAME', value: '',},
                                    {type: 'date', label: '建单时间(开始)', code: 'gmtCreate', value: '', exp: '>=',compare:1},
                                    {type: 'date', label: '建单时间(结束)', code: 'gmtCreate', value: '', exp: '<=',compare:2},
                                    {type: 'input', label: '派单人', code: 'SCHEDULER_NAME', value: '',},
                                    // {type: 'input', label: '申请人', code: 'CREATOR_NAME', value: ''},
                                    {type: 'input', label: '描述', code: 'DESCRIPTION', value: '',},
                                    {
                                        type: 'select',
                                        label: '解决状态',
                                        code: 'SERVICE_STATUS',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: '',},
                                    {
                                        type: 'select',
                                        label: '满意度',
                                        code: 'satisfaction',
                                        value: '',
                                        mapTypeCode: "satisfaction"
                                    },
                                    {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: ''},
                                    {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                                    {type: 'date', label: '故障开始时间(开始)', code: 'gmtBegin', value: '', exp: ">=",compare:3},
                                    {type: 'date', label: '故障开始时间(结束)', code: 'gmtBegin', value: '', exp: "<=",compare:4},
                                    {type: 'date', label: '派单时间(开始)', code: 'gmtSchedule', value: '', exp: ">=",compare:5},
                                    {type: 'date', label: '派单时间(结束)', code: 'gmtSchedule', value: '', exp: "<=",compare:6},
                                    {
                                        type: 'select',
                                        label: '评价模式',
                                        code: 'feedbackType',
                                        value: '',
                                        mapTypeCode: "feedbackType"
                                    },
                                    // {type: 'date', label: '工程师响应时间', code: 'gmtResponseEg', value: '',},
                                    // {type: 'date', label: '关单时间', code: 'gmtClose', value: '',},
                                ],
                            };
                        }
                        this.$refs.grids.refresh();
                        this.$refs.grids.refreshAndPageReset();
                    },
                    tablist: [
                        {label: '服务申请', value: '0',},
                        {label: '故障', value: '1'},
                    ]
                },
                ],
                operations: [
                    {
                        name: '详情',
                        callback: this.detail,
                        dbclick: true,
                        isShow: function () {
                            return false;
                        }
                    },
                    {
                        name: '标注',
                        callback: this.label,
                        dbclick: true,
                        isShow: function () {
                            return true;
                        }
                    },
                ],
                buttons: [
                    {
                        name: '查看派出工单',
                        icon: 'el-icon-document',
                        type: "",
                        callback: this.hasSent,
                    },
                    {
                        name: '关注',
                        icon: 'el-icon-check',
                        callback: this.attention
                    },
                    {
                        name: '导出',
                        type: 'export',
                        icon: 'el-icon-download',

                    },
                    {
                        name: '取消关注',
                        icon: 'el-icon-close',
                        callback: this.unAttention
                    },
                    {
                        name: '更多功能',
                        icon: 'el-icon-plus',
                        type: 'dropdown',
                        callback: this.moreItem,
                        items: [
                            {name: '服务申请补录', code: 'publishCallback'},
                            {name: '故障申报补录', code: 'cancelPublishCallback'},
                            {name: '抄送', code: 'startCallback'},
                        ]
                    },

                ],
            }
        },
        methods: {
            /**
             * 更多功能
             */
            moreItem(code) {
                if (code == 'publishCallback') {
                    /**
                     * 服务申请
                     * */
                    this.serBL();
                } else if (code == 'cancelPublishCallback') {
                    /**
                     * 故障申报
                     * */
                    this.serGBL();
                } else if (code == "startCallback") {
                    /**
                     * 抄送
                     * */
                    this.copyTo()
                }
            },
            /**
             *服务单标注保存
             */
            saveLabel() {
                this.$refs['saveLabelForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/biz/ProEvtServiceLabel/saveOrUpdate", this.labelForm)
                        .then(result => {
                            this.$message.success(result.data == null ? "保存成功" : result.data);
                            this.VisibleItemLabel = false;
                            this.$refs.mainQueryGrid.refresh();
                            this.isSuccess();
                        }).catch(error => {
                    });
                });
            },
            closeLabel() {
                this.VisibleItemLabel = false;
            },
            //标注
            label(row) {
                this.labelForm.serviceTicket = row.serviceTicket;
                this.serviceTicket = row.serviceTicket;
                this.$axios.get("/biz/ProEvtServiceLabel/getServiceTicket", {params: {serviceTicket: this.serviceTicket}})
                    .then(result => {
                        if (result.data == null) {
                            this.labelForm.labelContent = "";
                        } else {
                            this.labelForm.labelContent = result.data.labelContent;
                        }
                        this.dialogVisible = true;
                        this.VisibleItemLabel = true;
                        this.title = "服务单标注";
                    }).catch(error => {
                    this.dialogVisible = true;
                    this.VisibleItemLabel = true;
                    this.title = "服务单标注";
                });
            },
            //详情
            detail(row) {
                this.tabs = this.commonQuery[0].value;
                if (this.tabs == "0") {
                    this.tabs = 0;
                } else if (this.tabs == "1") {
                    this.tabs = 1;
                }
                this.$router.push("serviceTicket/transaction?dataId=" + row.oid + "&Id=" + row.id + "&tabs=" + this.tabs + "&type=detail&state=" + row.serviceStatus + "&page=1");

            },
            //查看派出工单
            hasSent() {
                if (this.dataArray.length == "0" || this.dataArray.length > "1") {
                    this.$confirm('请选择一条数据进行查看?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    if (this.dataArray[0].serviceStatus == "1" || this.dataArray[0].serviceStatus == "0") {
                        this.$confirm('请选择正确的数据进行查看！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            this.$refs.grids.refresh();
                        })
                    } else {
                        //查看派出工单传值，上列表
                        this.hasTicket = this.dataArray[0].serviceTicket;
                        this.catalogNum = this.dataArray[0].catalogId;
                        this.aclKeyReadonly = false;
                        this.Visible2 = true;
                        this.$refs.grids.refresh();
                        this.dataArray = [];
                    }
                }
            },
            select(row) {
                this.dataArray = row;
            },
            //关注
            attention() {
                let attentionA = [];
                for (let i = "0"; i < this.dataArray.length; i++) {
                    this.attentionArr.push(this.dataArray[i].id);
                    if (this.dataArray[i].ticket == "未关注") {
                        attentionA.push(this.dataArray[i].ticket);
                    }
                }
                if (this.attentionArr.length != "0") {
                    this.$confirm('是否关注?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.post('biz/ProEvtUserFocus/fouce', {ids: this.attentionArr.join(",")}).then(result => {
                            if (attentionA.length == "0") {
                                this.$message.warning("无可关注项!");
                                this.$refs.grids.refresh();
                                this.attentionArr = [];
                                this.dataArray = [];
                            } else {
                                this.$message.success("已关注" + attentionA.length + "条数据!");
                                this.$refs.grids.refresh();
                                this.attentionArr = [];
                                this.dataArray = [];
                            }
                        })
                    });
                } else {
                    this.$confirm('请选择一条或者多条数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            //取消关注
            unAttention() {
                let unattentionA = [];
                for (let i = 0; i < this.dataArray.length; i++) {
                    this.attentionArr.push(this.dataArray[i].serviceTicket);
                    if (this.dataArray[i].ticket != "未关注") {
                        unattentionA.push(this.dataArray[i].ticket);
                    }
                }
                if (this.attentionArr.length > 0) {
                    this.$confirm('是否取消关注?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.attentionArr = this.attentionArr.join(",");
                        this.$axios.delete('biz/ProEvtUserFocus/del', {params: {ids: this.attentionArr}}).then(result => {
                            if (unattentionA.length == "0") {
                                this.$message.warning("无可取消关注项!");
                                this.$refs.grids.refresh();
                                this.attentionArr = [];
                                this.dataArray = [];
                            } else {
                                this.$message.success("已取消关注" + unattentionA.length + "条数据!");
                                this.$refs.grids.refresh();
                                this.attentionArr = [];
                                this.dataArray = [];
                            }
                        })
                    });
                } else {
                    this.$confirm('请选择一条或者多条数据！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            close() {
                this.$refs.serviceData.ssClear();
                this.$refs.dataForm.ATMRefresh();
                this.$nextTick(() => {
                    this.VisibleItem = false;
                    this.activeName = "first";
                    this.order = false;
                    this.orderes = true;
                })

            },
            save() {
                this.$refs.serviceData.isTrue();
                this.$refs.dataForm.isOK();
                if (this.$refs.serviceData.isTrue() == false || this.$refs.dataForm.isOK() == false) {

                } else {
                    if (this.activeName == "first") {
                        let serviceTicketCatalogs = [];
                        for (let i = 0; i < this.dataForm.serviceTicketCatalogs.length; i++) {
                            let m = {
                                catalogId: this.dataForm.serviceTicketCatalogs[i].techId,
                                serviceTicket: "IM_201909030018",
                                isDefault: "0"
                            };
                            serviceTicketCatalogs.push(m);
                        }
                        this.$axios.post('biz/ProEvtServiceTicket/additionalServiceTicket',
                            {
                                proEvtUserTicket: this.mainDataForm.proEvtUserTicket,
                                proEvtServiceTicket: this.dataForm.ProEvtServiceTicket,
                                serviceTicketCatalogs: serviceTicketCatalogs,
                            }).then(result => {
                            this.newServiceTicket = result.data;
                            this.$message.success("保存成功！");
                            this.activeName = "second";
                            this.order = true;
                            this.orderes = false;
                            let arr = {
                                "areaId": this.dataForm.ProEvtServiceTicket.areaId,
                                "templateId": this.dataForm.ProEvtServiceTicket.templateId,
                                "serviceTicket": this.newServiceTicket
                            };
                            bus.$emit("number", arr);
                        }).catch(error => {
                            this.$message.error("保存失败！");
                        });
                        this.$refs.STTforms.removeArefresh();
                    } else if (this.activeName == "second") {
                        this.$refs.STTforms.need();
                        let bType = this.$refs.STTforms.need();
                        if (bType == false) {
                        } else {
                            this.$refs.STTforms.isSuccess();
                            this.$axios.post('biz/ProEvtServiceTicket/additionalUserFeedBack',
                                this.Forms.proEvtUserTicket
                            ).then(result => {
                                this.$message.success("保存成功！");
                                this.$refs.serviceData.ssClear();
                                this.$refs.dataForm.ATMRefresh();
                                this.VisibleItem = false;
                            }).catch(error => {
                                this.$message.error("保存失败！");
                            })
                        }
                    }
                }
            },
            clickClose() {
                this.$refs.serviceData.ssClear();
                this.$refs.dataForm.ATMRefresh();
                this.VisibleItem = false;
            },
            //服务申请补录
            serBL() {
                this.aclKeyReadonly = false;
                this.dialogVisible = true;
                this.VisibleItem = true;
                this.title = "服务申请补录";
                this.num = "1";
                this.activeName = "first";
                /*申请补录 基础信息 清除痕迹*/
                // this.$refs.dataForm.ATMRefresh();
                // this.$refs.dataForm.ATMRefresh();
                /*申请补录 申请信息 清除痕迹*/
                // this.$refs.mainDataForm.SSRefresh();
                // this.$refs.serviceData.ssClear();
                /*申请补录 申请信息 附件上传 清除痕迹*/
                // this.$refs.mainDataForm.refreshMessage();
                /*申请补录 每次进入时渲染登录人信息*/
                // this.$refs.mainDataForm.again();
                /*工单补录 工单信息，用户评价 清除痕迹*/
                // this.$refs.STTforms.removeArefresh();
                /*工单补录 重置工单序号*/
                // this.$refs.STTforms.numTicket();
                /*申请补录 基础信息 清除痕迹*/
                // this.$refs.dataForm.refreshData();
                bus.$emit("service", "service");
            },
            //故障申报补录
            serGBL() {
                this.aclKeyReadonly = false;
                this.dialogVisible = true;
                this.VisibleItem = true;
                this.title = "故障申报补录";
                this.num = "2";
                this.activeName = "first";
                bus.$emit("service", "service");

            },
            copyTo() {
                if (this.dataArray.length == "0") {
                    this.$confirm("请选择一条或多条数据进行抄送！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else {
                    this.$refs.person.openDialog();
                    for (let i = 0; i < this.dataArray.length; i++) {
                        this.incident.push(this.dataArray[i].serviceTicket);
                    }
                    this.incident = this.incident.join(",");
                }
            },
            blameSelectUser(row) {
                for (let i = 0; i < row.length; i++) {
                    this.people.push(row[i].code)
                }
                this.people = this.people.join(",");
                this.$axios.post('biz/ProEvtServiceTicketCc/createBatch', {
                    tickets: this.incident,
                    users: this.people
                }).then(result => {
                    //person
                    this.$refs.grids.refresh();
                    this.dataArray = [];
                    this.incident = [];
                    this.people = [];
                    this.$refs.person.cleanColumnSelect();
                    this.$message.success("抄送成功！");
                }).catch(error => {
                    this.$refs.grids.refresh();
                    this.$refs.person.cleanColumnSelect();
                    this.dataArray = [];
                    this.incident = [];
                    this.people = [];
                    this.$message.success("抄送失败！");
                })
            },
        },
        components: {
            ServiceSecond,
            AddToMessage,
            LookOver,
            IcePersionSelector,
            BaseMessage,
            ServiceTicketTracking,
            IceQueryGrid, IceSelect,
            IceGridLayout,
            IceDialog,
            serviceAsk,
            bus,
            IceSingleUpload
        }
    }
</script>


<style scoped lang="less">
    .footer {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 20px;
        z-index: 99;
    }
</style>
