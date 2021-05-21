<template>

    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" class="ClassName">
        <ice-query-grid :data-url="url"
                        chooseItem="multiple"
                        @selection-change="optfor"
                        :query="[...commonQuery,...queryMap[nav]]"
                        :columns="columns"
                        :operations="operations"
                        :operationsWidth=100
                        :buttons="buttons"
                        :title="commonBase"
                        ref="grids">
        </ice-query-grid>


    </div>


</template>


<script>

    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout'
    import ServeMessage from "./base/serveMessage"
    import serveFoundation from "./base/serveFoundation"
    import disposeMessage from "./base/disposeMessage"
    import subsidiaryMessage from "./base/subsidiaryMessage"
    import AccessoryMessage from "./base/AccessoryMessage"
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import MaintainMenber from "./base/maintainMenber";
    import Validator from "./base/Validator";
    import redeploy from "./base/redeploy";
    import Bus from "./base/bus.js"

    export default {

        name: 'myServeWork',

        data() {
            return {

                tableData: [],
                serviceTicket: '',
                num: [],
                commonBase: "我的服务工单-待办工单",
                rowItem: [],
                url: "biz/ProEvtWorkTicket/workOrderList",
                dialogVisible: false,
                Visible: false,
                aclKeyReadonly: false,
                mainDataForm: {usecycle: "0", isprefix: "0", cycle: "", usecycle1: "0"},
                mainData: {
                    serveName: "",
                    serveStatus: "",
                },
                queryMap: {
                    "0": [
                        {type: 'input', label: '工单号', code: 'WORK_TICKET', width: 120, value: ''},
                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', width: 120, value: ''},
                        {type: 'input', label: '用户', code: 'USER_NAME', width: 120, value: ''},
                        {type: 'input', label: '申请人', code: 'CREATOR_NAME', width: 120, value: ''},
                        {type: 'date', label: '开始时间(开始)', code: 'gmtBegin', width: 120, value: '', exp: ">=",compare:1},
                        {type: 'date', label: '开始时间(结束)', code: 'gmtBegin', width: 120, value: '', exp: "<=",compare:2},
                        {
                            type: 'select',
                            label: '类别',
                            code: 'IS_BREAKDOWN',
                            width: 100,
                            mapTypeCode: 'isBreakdown',
                            value: ''
                        },
                        {type: 'input', label: '区域', code: 'AREA_SHORTNAME', width: 120, value: ''},
                        {type: 'input', label: '服务名称', code: 'categoryname', width: 120, value: ''},
                        {type: 'input', label: '服务项', code: 'SNAME', width: 120, value: ''},
                        {type: 'input', label: '服务级别', code: 'LV', width: 120, value: ''}
                    ]
                },
                nav: "0",
                commonQuery: [
                    {
                        exp: "in",
                        type: 'tab',
                        label: '状态',
                        code: 'work_Status',
                        value: '0',
                        tablist: [{label: '待办工单', value: '0'}, {label: '办理中工单', value: '1'}, {
                            label: '已办工单',
                            value: '2,3,4,5,6,7,8,9,10,11,12,13'
                        }],
                        click: value => {
                            if (value == '0') {
                                this.columns = [
                                    {code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                                    {label: '工单状态', code: 'workStatus', hidden: true},
                                    {type: 'input', label: '工单号', code: 'workTicket', width: 160},
                                    {type: 'input', label: '服务单号', code: 'serviceTicket', width: 160},
                                    {type: 'input', label: '区域', code: 'areaShortname', width: 120},
                                    {type: 'input', label: '服务名称', code: 'categoryname', width: 180},
                                    {type: 'input', label: '服务项', code: 'sname', width: 180},
                                    {type: 'input', label: '用户', code: 'userName', width: 160},
                                    {type: 'input', label: '申请人', code: 'creatorName', width: 120},
                                    {
                                        type: 'input',
                                        label: '类别',
                                        code: 'isBreakdown',
                                        width: 100,
                                        mapTypeCode: 'isBreakdown'
                                    },
                                    {type: 'input', label: '服务级别', code: 'lv', width: 120, mapTypeCode: 'servLevel'},
                                    {type: 'input', label: '开始时间', code: 'gmtBegin', width: 160},
                                    {
                                        label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },
                                ];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'WORK_TICKET', width: 120, value: ''},
                                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', width: 120, value: ''},
                                        {type: 'input', label: '用户', code: 'USER_NAME', width: 120, value: ''},
                                        {type: 'input', label: '申请人', code: 'CREATOR_NAME', width: 120, value: ''},
                                        {
                                            type: 'date',
                                            label: '开始时间(开始)',
                                            code: 'gmtBegin',
                                            width: 120,
                                            value: '',
                                            exp: ">=",
                                            compare:1
                                        },
                                        {
                                            type: 'date',
                                            label: '开始时间(结束)',
                                            code: 'gmtBegin',
                                            width: 120,
                                            value: '',
                                            exp: "<=",
                                            compare:2
                                        },
                                        {
                                            type: 'select',
                                            label: '类别',
                                            code: 'IS_BREAKDOWN',
                                            width: 100,
                                            mapTypeCode: 'isBreakdown',
                                            value: ''
                                        },
                                        {type: 'input', label: '区域', code: 'AREA_SHORTNAME', width: 120, value: ''},
                                        {type: 'input', label: '服务名称', code: 'categoryname', width: 120, value: ''},
                                        {type: 'input', label: '服务项', code: 'SNAME', width: 120, value: ''},
                                        {type: 'input', label: '服务级别', code: 'LV', width: 120, value: ''},
                                    ]
                                };
                                this.value = "0";
                                this.$set(this.buttons[1], "disabled", false);
                                this.url = "biz/ProEvtWorkTicket/workOrderList?type=1"
                                this.commonBase = "我的服务工单-待办工单";
                                this.rowItem = [];
                            } else if (value == '1') {
                                this.columns = [
                                    {code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                                    {label: '服务单号', code: 'serviceTicket', hidden: true},
                                    {label: '工单状态', code: 'workStatus', hidden: true},
                                    {label: '工单号', code: 'workTicket', width: 160},
                                    {label: '服务单号', code: 'serviceTicket', width: 160},
                                    {label: '区域', code: 'areaShortname', width: 120},
                                    {label: '服务名称', code: 'categoryname', width: 180},
                                    {label: '服务项', code: 'sname', width: 180},
                                    {label: '服务级别', code: 'lv', width: 120, mapTypeCode: 'servLevel'},
                                    {label: '用户', code: 'userName', width: 100},
                                    {label: '申请人', code: 'creatorName', width: 120},
                                    {label: '类别', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                                    {label: '开始时间', code: 'gmtBegin', width: 120},
                                    {label: '开始处理时间', code: 'startHandleTime', width: 160},
                                    {label: '剩下处置时长', code: 'timeLength', width: 120},
                                    {
                                        label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'WORK_TICKET', width: 120, value: ''},
                                        {
                                            type: 'date',
                                            label: '开始处理时间(开始)',
                                            code: 'START_HANDLE_TIME',
                                            width: 140,
                                            value: '',
                                            exp: ">=",
                                            compare:2
                                        },
                                        {
                                            type: 'date',
                                            label: '开始处理时间(结束)',
                                            code: 'START_HANDLE_TIME',
                                            width: 140,
                                            value: '',
                                            exp: "<=",
                                            compare:3
                                        },
                                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', width: 120, value: ''},
                                        {type: 'input', label: '用户', code: 'USER_NAME', width: 100, value: ''},
                                        {type: 'input', label: '申请人', code: 'CREATOR_NAME', width: 120, value: ''},
                                        {
                                            type: 'date',
                                            label: '开始时间(开始)',
                                            code: 'gmtBegin',
                                            width: 120,
                                            value: '',
                                            exp: ">=",
                                            compare:1
                                        },
                                        {
                                            type: 'date',
                                            label: '开始时间(结束)',
                                            code: 'gmtBegin',
                                            width: 120,
                                            value: '',
                                            exp: "<=",
                                            compare:4
                                        },
                                        {
                                            type: 'select',
                                            label: '类别',
                                            code: 'IS_BREAKDOWN',
                                            width: 100,
                                            mapTypeCode: 'isBreakdown',
                                            value: ''
                                        },
                                        {type: 'input', label: '区域', code: 'AREA_SHORTNAME', width: 120, value: ''},
                                        {type: 'input', label: '服务名称', code: 'categoryname', width: 120, value: ''},
                                        {type: 'input', label: '服务项', code: 'SNAME', width: 120, value: ''},
                                        {type: 'input', label: '服务级别', code: 'LV', width: 120, value: ''}
                                    ]
                                };
                                this.value = "1";
                                this.$set(this.buttons[1], "disabled", false);
                                this.url = "biz/ProEvtWorkTicket/workOrderList?type=2"
                                this.commonBase = "我的服务工单-办理中工单";
                                this.rowItem = [];
                            } else if (value == '2,3,4,5,6,7,8,9,10,11,12,13') {
                                this.columns = [
                                    {code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单号', code: 'serviceTicket', hidden: true},
                                    {label: '工单号', code: 'workTicket', width: 160,},
                                    {label: '工单状态', code: 'workStatus', width: 100, mapTypeCode: 'workStatus'},
                                    {label: '服务单状态', code: 'serviceStatus', width: 100, mapTypeCode: 'serviceStatus'},
                                    {label: '解决状态', code: 'resolveStatus', width: 100, mapTypeCode: 'resolveStatus'},
                                    {label: '区域', code: 'areaShortname', width: 100},
                                    {label: '服务名称', code: 'categoryname', width: 180},
                                    {label: '用户信息', code: 'userNameDept', width: 100},
                                    {label: '处理人', code: 'engineerName', width: 100},
                                    {label: '申请人信息', code: 'creatorNameDept', width: 100},
                                    {label: '起因', code: 'reason', width: 100, mapTypeCode: 'eventCause'},
                                    {label: '用户星级', code: 'userLevel', width: 100, mapTypeCode: 'userLevel'},
                                    {label: '报障方式', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                                    {label: '服务级别', code: 'lv', width: 100, mapTypeCode: 'servLevel'},
                                    {label: '服务方式', code: 'source', width: 100, mapTypeCode: 'serviceWay'},
                                    {label: '处理角色', code: 'engineerRole', width: 100, mapTypeCode: 'operationalRole'},
                                    {label: '第三方厂商', code: 'unitnames', width: 100},
                                    {label: '联系电话', code: 'userTelephone', width: 100},
                                    {label: '开始时间', code: 'gmtBegin', width: 140},
                                    {label: '开始处理时间', code: 'startHandleTime', width: 140},
                                    {label: '解决处理时间', code: 'solveGmtEnd', width: 140},
                                    {label: '变更号', code: 'shiftTickets', width: 100},
                                    {
                                        label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },
                                ];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'WORK_TICKET',},
                                        {
                                            type: 'select',
                                            label: '工单状态',
                                            code: 'WORK_STATUS',
                                            mapTypeCode: 'workStatus',
                                            value: ''
                                        },
                                        {
                                            type: 'select',
                                            label: '服务单状态',
                                            code: 'SERVICE_STATUS',
                                            mapTypeCode: 'serviceStatus',
                                            value: ''
                                        },
                                        {type: 'input', label: '用户信息', code: 'USER_NAME_DEPT', value: ''},
                                        {
                                            type: 'select',
                                            label: '用户星级',
                                            code: 'USER_LEVEL',
                                            mapTypeCode: 'userLevel',
                                            value: ''
                                        },
                                        {type: 'input', label: '联系电话', code: 'USER_TELEPHONE', value: ''},
                                        {type: 'input', label: '申请人信息', code: 'CREATOR_NAME_DEPT', value: ''},
                                        {type: 'input', label: '申请描述', code: 'DESCRIPTION', value: '',},
                                        {type: 'date', label: '开始时间(开始)', code: 'gmtBegin', value: '', exp: ">=",compare:1},
                                        {type: 'date', label: '开始时间(结束)', code: 'gmtBegin', value: '', exp: "<=",compare:4},
                                        {
                                            type: 'select',
                                            label: '报障方式',
                                            code: 'IS_BREAKDOWN',
                                            mapTypeCode: 'isBreakdown',
                                            value: ''
                                        },/*mapTypeCode:'BREAKDOWN_NAME'*/
                                        {type: 'input', label: '区域', code: 'AREA_SHORTNAME', width: 100, value: ''},
                                        {type: 'input', label: '服务名称', code: 'CATEGORYNAME', width: 100, value: ''},
                                        {type: 'input', label: '服务级别', code: 'LV', width: 100, value: ''},
                                        {type: 'input', label: '服务方式', code: 'SOURCE', width: 100, value: ''},
                                        {
                                            type: 'date',
                                            label: '解决处理时间(开始)',
                                            code: 'solveGmtEnd',
                                            width: 100,
                                            value: '',
                                            exp: ">=",
                                            compare:2
                                        },
                                        {
                                            type: 'date',
                                            label: '解决处理时间(结束)',
                                            code: 'solveGmtEnd',
                                            width: 100,
                                            value: '',
                                            exp: "<=",
                                            compare:3
                                        },
                                        {
                                            type: 'select',
                                            label: '解决状态',
                                            code: 'RESOLVE_STATUS',
                                            width: 100,
                                            mapTypeCode: 'resolveStatus',
                                            value: ''
                                        },
                                        {
                                            type: 'select',
                                            label: '起因',
                                            code: 'reason',
                                            width: 100,
                                            value: '',
                                            mapTypeCode: "eventCause"
                                        },
                                        {type: 'input', label: '处理人', code: 'ENGINEER_NAME', width: 100, value: ''},
                                        {
                                            type: 'select',
                                            label: '处理角色',
                                            code: 'ENGINEER_ROLE',
                                            width: 100,
                                            mapTypeCode: 'operationalRole',
                                            value: ''
                                        },
                                        {type: 'input', label: '第三方厂商', code: 'UNITNAMES', width: 100, value: ''},
                                        {type: 'input', label: '变更号', code: 'SHIFT_TICKETS', width: 100, value: ''},
                                    ]
                                };
                                this.value = "2";
                                this.$set(this.buttons[1], "disabled", true);
                                this.url = "biz/ProEvtWorkTicket/workOrderHandleList";
                                this.commonBase = "我的服务工单-已办工单";
                                this.rowItem = [];
                            }

                        },
                    },
                ],
                columns: [
                    {code: 'id', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'formId', hidden: true},
                    {label: '工单状态', code: 'workStatus', hidden: true},
                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                    {label: '工单号', code: 'workTicket', width: 180},
                    {label: '服务单号', code: 'serviceTicket', width: 180},
                    {label: '区域', code: 'areaShortname', width: 120},
                    {label: '服务名称', code: 'categoryname', width: 180},
                    {label: '服务项', code: 'sname', width: 180},
                    {label: '服务级别', code: 'lv', width: 120, mapTypeCode: 'servLevel'},
                    {label: '用户', code: 'userName', width: 180},
                    {label: '申请人', code: 'creatorName', width: 120},
                    {label: '类别', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                    {label: '开始时间', code: 'gmtBegin', width: 120},
                    {
                        label: '关注', code: 'ticket',fixed:'right',width:100, renderCell(h, data) {
                            return <div class="cell" title={data.row.ticket}>
                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                            </div>;
                        }
                    },

                ],
                operations: [
                    {
                        name: '详情',
                        icon: 'el-icon-plus',
                        hidden: true,
                        type: 'primary',
                        dbclick: true,
                        callback: this.particular,
                    }
                ],
                buttons: [
                    {
                        name: '办理', icon: 'el-icon-news', callback: () => {
                            this.transaction()
                        }
                    },
                    {
                        name: '关注', icon: 'el-icon-check', callback: () => {
                            this.remind()
                        }
                    },
                    {
                        name: '取消关注', icon: 'el-icon-close', callback: () => {
                            this.noRemind()
                        }
                    },
                    {name: '导出', type: 'export', icon: 'el-icon-upload2'},

                ],
                formRules: {},
            }
        },
        methods: {
            particular(data) {
                this.$router.push("workTransaction?dataId=" + data.oid);
            },
            /*列表选中的信息*/
            optfor(rows) {
                if (rows.length != 0) {
                    this.serviceTicket = rows[0].serviceTicket;
                    this.rowItem = rows;
                }
            },
            /*关注 提醒方法判断*/
            remind() {
                let attention = [];
                for (let i = 0; i < this.rowItem.length; i++) {
                    this.num.push(this.rowItem[i].oid);
                    if (this.rowItem[i].ticket == "未关注") {
                        attention.push(this.rowItem[i].ticket);
                    }
                }
                if (this.num.length > 0) {
                    this.$confirm("是否关注！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.post('biz/ProEvtUserFocus/fouceWork', {ids: this.num.join(",")}).then(result => {
                            if (result.status == "200") {
                                Bus.$emit("focus", "true");
                            } else {
                                Bus.$emit("focus", "false");
                            }
                            if (attention.length == "0") {
                                this.$message.warning("无可关注项!");
                                this.$refs.grids.refresh();
                                this.rowItem = [];
                                this.num = [];
                            } else {
                                this.$message.success("已关注" + attention.length + "条数据!");
                                this.$refs.grids.refresh();
                                this.rowItem = [];
                                this.num = [];
                            }
                        });

                    });
                } else {
                    this.$confirm("请选择一条或多条数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },

            /*取消关注*/
            noRemind() {
                let unattention = [];
                for (let i = 0; i < this.rowItem.length; i++) {
                    this.num.push(this.rowItem[i].workTicket);
                    if (this.rowItem[i].ticket !== '未关注') {
                        unattention.push(this.rowItem[i].ticket);
                    }
                }
                if (this.rowItem.length > 0) {
                    this.$confirm("是否取消关注！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete('biz/ProEvtUserFocus/del', {params: {ids: this.num.join(",")}}).then(result => {
                            if (result.status == "200") {
                                Bus.$emit("focus", "true");
                            } else {
                                Bus.$emit("focus", "false");
                            }
                            if (unattention.length == "0") {
                                this.$message.warning("无取消关注项!");
                                this.$refs.grids.refresh();
                                this.rowItem = [];
                                this.num = [];
                            } else {
                                this.$message.success("已取消关注" + unattention.length + "条数据!");
                                this.$refs.grids.refresh();
                                this.rowItem = [];
                                this.num = [];
                            }
                        })
                    });
                } else {
                    this.$confirm("请选择一条或多条数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /* 办理*/
            transaction() {
                if (this.rowItem.length == 1) {
                    let sense = this.commonQuery[0].value
                    this.$router.push("workTransaction?dataId=" + this.rowItem[0].oid);
                } else {
                    this.$confirm("请选择一条数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
        },
        components: {
            MaintainMenber,
            IceDialog,
            AccessoryMessage,
            subsidiaryMessage,
            disposeMessage,
            serveFoundation,
            ServeMessage,
            IceQueryGrid,
            IceGridLayout,
            IceSelect,
            IceMultipleUpload,
            IcePersionSelector,
            Validator,
            redeploy,
            Bus
        },
    }


</script>


<style lang="less" scoped>
    .left {
        margin-left: 150px;
    }

    .right {
        padding-right: 20px;
    }
</style>