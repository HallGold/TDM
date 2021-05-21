<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column; width: 100%" class="ClassName">
        <!-- data-url="biz/ProEvtWorkTicket/centerWorkHandleList" -->
        <ice-query-grid :data-url="dataUrl"
                        :query="[...commonQuery,...queryMap[nav]]"
                        :columns="columns"
                        chooseItem="multiple"
                        :buttons="buttons"
                        :operations="operations"
                        :operationsWidth=100
                        @selection-change="generation"
                        :title="exportdan"
                        ref="grids">
        </ice-query-grid><!--  :gridData="information" -->

    </div>
</template>


<script>
    import Bus from './base/bus.js'
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout'
    import ServeMessage from "./base/serveMessage"
    import serveFoundation from "./base/serveFoundation"
    import disposeMessage from "./base/disposeMessage"
    import subsidiaryMessage from "./base/subsidiaryMessage"
    import AccessoryMessage from "./base/AccessoryMessage"
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import operateType from "./base/operateType";

    export default {

        name: 'workTicket',
        mixins: [operateType],
        data() {
            return {
                proEvtWorkTicketLog: {},
                serviceTicket: "",
                selectReason: "",
                rowItem: [],
                num: [],
                dialogVisible: false,
                Visible: false,
                aclKeyReadonly: false,
                exportdan: "工单待受理-待处理工单",
                mainData: {
                    serveName: "",
                    serveStatus: "",
                },
                dataUrl: "biz/ProEvtWorkTicket/centerWorkHandleList",
                queryMap: {
                    "0": [
                        {type: 'input', label: '工单号', code: 'WORK_TICKET', value: ""},
                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: ""},
                        {type: 'select', label: '类别', code: 'IS_BREAKDOWN', mapTypeCode: 'isBreakdown', value: ""},
                        {type: 'select', label: '工单状态', code: 'WORK_STATUS', mapTypeCode: 'workStatus', value: ""},
                        {
                            type: 'select',
                            label: '操作类型',
                            code: 'OPERATION_TYPE',
                            mapTypeCode: 'operationType',
                            value: ""
                        },
                        {type: 'date', label: '操作时间(开始)', code: 'gmtCreate', exp: ">=", value: "",compare:1},
                        {type: 'date', label: '操作时间(结束)', code: 'gmtCreate', exp: "<=", value: "",compare:2},
                        {type: 'input', label: '原因', code: 'REASON', value: ""},
                        {type: 'input', label: '说明', code: 'DETAIL', value: ""},
                        {type: 'input', label: '推荐工程师', code: 'NEXT_ENGINEER', value: ""},
                    ]
                },
                nav: "0",
                commonQuery: [
                    {
                        exp: "in",
                        type: 'tab',
                        label: '状态',
                        code: 'work_Status',
                        value: "2,3,4,5",
                        name: "dispsoeWord",
                        tablist: [
                            {label: '待处理工单', value: '2,3,4,5', name: "dispsoeWord"},
                            {label: '挂起工单', value: '7', name: "putWork"},
                            {label: '超时提醒', value: 'all', name: "timeOut"}],
                        click: value => {
                            if (value == '2,3,4,5') {
                                this.$set(this.buttons[1], "disabled", false);
                                this.columns = [
                                    {code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                                    {label: '工单号', code: 'workTicket', width: 160,},
                                    {label: '服务单号', code: 'serviceTicket', width: 160},
                                    {label: '类别', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                                    {label: '工单状态', code: 'workStatus', width: 100, mapTypeCode: 'workStatus'},
                                    {label: '操作类型', code: 'operationType', width: 120, mapTypeCode: 'operationType'},
                                    {label: '操作时间', code: 'gmtCreate', width: 160},
                                    {label: '原因', code: 'reason', width: 120},
                                    {label: '说明', code: 'detail', width: 120},
                                    {label: '推荐工程师', code: 'nextEngineer', width: 120},
                                    {
                                        label: '关注', code: 'ticket',fixed:'right', renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },
                                ];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'WORK_TICKET', value: ""},
                                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: ""},
                                        {
                                            type: 'select',
                                            label: '类别',
                                            code: 'IS_BREAKDOWN',
                                            mapTypeCode: 'isBreakdown',
                                            value: ""
                                        },
                                        {
                                            type: 'select',
                                            label: '工单状态',
                                            code: 'WORK_STATUS',
                                            mapTypeCode: 'workStatus',
                                            value: ""
                                        },
                                        {
                                            type: 'select',
                                            label: '操作类型',
                                            code: 'OPERATION_TYPE',
                                            mapTypeCode: 'operationType',
                                            value: ""
                                        },
                                        {type: 'date', label: '操作时间(开始)', code: 'gmtCreate', exp: ">=", value: "",compare:1},
                                        {type: 'date', label: '操作时间(结束)', code: 'gmtCreate', exp: "<=", value: "",compare:2},
                                        {
                                            type: 'input',
                                            label: '原因',
                                            code: 'REASON',
                                            mapTypeCode: 'redeployReason',
                                            value: ""
                                        },
                                        {type: 'input', label: '说明', code: 'DETAIL', value: ""},
                                        {type: 'input', label: '推荐工程师', code: 'nextEngineer', value: ""},
                                    ]
                                };
                                this.exportdan = "工单待受理-待处理工单";
                                this.dataUrl = "biz/ProEvtWorkTicket/centerWorkHandleList?type=1";
                                this.operations = [
                                    {
                                        name: '详情',
                                        icon: 'el-icon-info',
                                        type: 'primary',
                                        dbclick: true,
                                        callback: this.particular,
                                    }
                                ];
                                this.rowItem = [];
                            } else if (value == '7') {
                                this.$set(this.buttons[1], "disabled", false);
                                this.columns = [{code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                                    {label: '工单号', code: 'workTicket', width: 180},
                                    {label: '服务单号', code: 'serviceTicket', width: 180},
                                    {
                                        label: '类别',
                                        code: 'isBreakdown',
                                        width: 120,
                                        mapTypeCode: 'isBreakdown',
                                        value: ""
                                    },
                                    {label: '用户', code: 'userName', width: 160},
                                    {label: '用户星级', code: 'userLevel', width: 160, mapTypeCode: 'userLevel', value: ""},
                                    {label: '申请时间', code: 'applyTime', width: 180},
                                    {label: '描述', code: 'description', width: 160},
                                    {
                                        label: '工单状态',
                                        code: 'workStatus',
                                        width: 120,
                                        mapTypeCode: 'workStatus',
                                        value: ""
                                    },
                                    {label: '处理人', code: 'engineerName', width: 160},
                                    {label: '挂起时长(分钟)', code: 'time', width: 160},
                                    {label: '挂起说明', code: 'detail', width: 160},
                                    {
                                        label: '关注', code: 'ticket',fixed:'right', width: 80, renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },
                                ];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'workTicket', value: ""},
                                        {type: 'input', label: '服务单号', code: 'serviceTicket', value: ""},
                                        {
                                            type: 'select',
                                            label: '类别',
                                            code: 'IS_BREAKDOWN',
                                            mapTypeCode: 'isBreakdown',
                                            value: ""
                                        },
                                        {type: 'input', label: '用户', code: 'USER_NAME'},
                                        {
                                            type: 'select',
                                            label: '用户星级',
                                            code: 'USER_LEVEL',
                                            mapTypeCode: 'userLevel',
                                            value: ""
                                        },
                                        {type: 'date', label: '申请时间(开始)', code: 'applyTime', exp: ">=", value: "",compare:1},
                                        {type: 'date', label: '申请时间(结束)', code: 'applyTime', exp: "<=", value: "",compare:2},
                                        {type: 'input', label: '描述', code: 'DESCRIPTION', value: ""},
                                        {
                                            type: 'select',
                                            label: '工单状态',
                                            code: 'WORK_STATUS',
                                            mapTypeCode: 'workStatus',
                                            value: ""
                                        },
                                        {type: 'input', label: '处理人', code: 'ENGINEER_NAME', value: ""},
                                        {type: 'input', label: '挂起说明', code: 'DETAIL', value: ""},
                                    ]
                                };
                                this.exportdan = "工单待受理-挂起工单";
                                this.dataUrl = "biz/ProEvtWorkTicket/centerWorkHangupList?type=2";
                                this.operations = [
                                    {
                                        name: '解除挂起',
                                        icon: 'el-icon-plus',
                                        type: 'primary',
                                        dbclick: true,
                                        callback: this.workTicketReleaseHangup
                                    }
                                ];
                                this.rowItem = [];
                            } else if (value == 'all') {
                                this.$set(this.buttons[1], "disabled", true);
                                this.columns = [{code: 'id', hidden: true},
                                    {code: 'oid', hidden: true},
                                    {label: '服务单状态', code: 'serviceStatus', hidden: true},
                                    {label: '工单号', code: 'workTicket', width: 180},
                                    {label: '服务单号', code: 'serviceTicket', width: 180},
                                    {label: '类别', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown',},
                                    {label: '用户', code: 'userName', width: 160},
                                    {label: '用户星级', code: 'userLevel', width: 100, mapTypeCode: 'userLevel',},
                                    {label: '申请时间', code: 'applyTime', width: 160},
                                    {label: '描述', code: 'description', width: 120},
                                    {label: '工单状态', code: 'workStatus', width: 160, mapTypeCode: 'workStatus'},
                                    {label: '处理人', code: 'engineerName', width: 120},
                                    {label: '处理人座机', code: 'deptcode', width: 100},
                                    {label: '响应剩下时长(分钟)', code: 'responseTimeLen', width: 140},
                                    {label: '处置剩下时长(分钟)', code: 'handleTimeLen', width: 140},
                                    {
                                        label: '关注', code: 'ticket',fixed:"right",width:80,renderCell(h, data) {
                                            return <div class="cell" title={data.row.ticket}>
                                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                            </div>;
                                        }
                                    },
                                ];
                                this.queryMap = {
                                    "0": [
                                        {type: 'input', label: '工单号', code: 'WORK_TICKET', value: ""},
                                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: ""},
                                        {
                                            type: 'select',
                                            label: '类别',
                                            code: 'isBreakdown',
                                            mapTypeCode: 'isBreakdown',
                                            value: ""
                                        },
                                        {type: 'input', label: '用户', code: 'USER_NAME', value: ""},
                                        {
                                            type: 'select',
                                            label: '用户星级',
                                            code: 'USER_LEVEL',
                                            mapTypeCode: 'userLevel',
                                            value: ""
                                        },
                                        {type: 'date', label: '申请时间(开始)', code: 'applyTime', exp: ">=", value: "",compare:1},
                                        {type: 'date', label: '申请时间(结束)', code: 'applyTime', exp: "<=", value: "",compare:2},
                                        {type: 'input', label: '描述', code: 'DESCRIPTION', value: ""},
                                        {
                                            type: 'select',
                                            label: '工单状态',
                                            code: 'workStatus',
                                            mapTypeCode: 'workStatus',
                                            value: ""
                                        },
                                        {type: 'input', label: '处理人', code: 'engineerName', value: ""},
                                        {type: 'input', label: '处理人座机', code: 'DEPTCODE', value: ""},
                                        {type: 'date', label: '响应剩下时长', code: 'responseTimeLen', value: ""},
                                        {type: 'date', label: '处置剩下时长', code: 'handleTimeLen', value: ""},
                                    ]
                                };
                                this.exportdan = "工单待受理-超时提醒";
                                this.dataUrl = "biz/ProEvtWorkTicket/centerWorkTimeoutList";
                                this.operations = [
                                    {
                                        name: '详情',
                                        icon: 'el-icon-plus',
                                        type: 'primary',
                                        dbclick: true,
                                        callback: this.particular,
                                    }
                                ];
                                this.rowItem = [];
                            }
                        },
                    },
                ],
                columns:
                    [
                        {code: 'id', hidden: true},
                        {code: 'oid', hidden: true},
                        {label: '服务单状态', code: 'serviceStatus', hidden: true},
                        {label: '工单号', code: 'workTicket', width: 160},
                        {label: '服务单号', code: 'serviceTicket', width: 160},
                        {label: '类别', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                        {label: '工单状态', code: 'workStatus', width: 100, mapTypeCode: 'workStatus'},
                        {label: '操作类型', code: 'operationType', width: 120, mapTypeCode: 'operationType'},
                        {label: '操作时间', code: 'gmtCreate', width: 160},
                        {label: '原因', code: 'reason', width: 120},
                        {label: '说明', code: 'detail', width: 120},
                        {label: '推荐工程师', code: 'nextEngineer', width: 120},
                        {
                            label: '关注', code: 'ticket',fixed:'right', width: 80, renderCell(h, data) {
                                return <div class="cell" title={data.row.ticket}>
                                    <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                                </div>;
                            }
                        },],
                operations: [
                    {name: '详情', icon: 'el-icon-info', type: 'primary', dbclick: true, callback: this.particular,}
                ],
                buttons: [
                    {
                        name: '办理', icon: 'el-icon-news', callback: () => {
                            this.transaction()
                        }
                    },
                    {
                        name: '关注', icon: 'el-icon-check', callback: () => {
                            this.prefix()
                        }
                    },
                    {
                        name: '取消关注', icon: 'el-icon-close', callback: () => {
                            this.noPrefix()
                        }
                    },
                    {name: '导出', type: 'export', icon: 'el-icon-download'},
                ],
                formRules: {},
            }
        },
        methods: {
            /*解除挂起*/
            workTicketReleaseHangup(flowContext, bizData) {
                this.proEvtWorkTicketLog = {
                    workTicket: flowContext.workTicket,
                    operationType: this.workTicketOperateType.RELEASE_HANG_UP_TYPE
                };
                this.$confirm('请确认是否解除挂起工单！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.post("/biz/ProEvtWorkTicket/workTicketReleaseHangup", this.proEvtWorkTicketLog).then(success => {
                        this.$message.success("解除成功！");
                        this.$refs.grids.refresh();
                    }).catch(error => {
                        this.$message.error("解除失败！" + error)
                    })
                });
            },

            particular(data) {
                this.$router.push("/biz/event/workTransaction?dataId=" + data.oid)
            },

            /*办理*/

            transaction() {
                if (this.rowItem.length == 1) {
                    let sense = this.commonQuery[0].value
                    this.$router.push("/biz/event/workTransaction?dataId=" + this.rowItem[0].oid)
                } else {
                    this.$confirm("请选择一条数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /*列表选中的数据*/
            generation(rows) {
                this.rowItem = rows;
            },
            /*关注 提醒方法判断*/
            prefix() {
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
            noPrefix() {
                let unattention = [];
                for (let i = 0; i < this.rowItem.length; i++) {
                    this.num.push(this.rowItem[i].workTicket);
                    if (this.rowItem[i].ticket !== "未关注") {
                        unattention.push(this.rowItem[i].ticket);
                    }
                }
                if (this.num.length > 0) {
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
                    this.$confirm("请选择一条或多条已关注数据！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
        },
        components: {
            AccessoryMessage,
            subsidiaryMessage,
            disposeMessage,
            serveFoundation,
            ServeMessage,
            IceQueryGrid,
            IceGridLayout,
            IceDialog,
            IceMultipleUpload,
            IceSelect,
            Bus


        }
    }


</script>


<style scoped lang="less">

</style>