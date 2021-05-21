<template>

    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" class="ClassName">
        <!-- :gridData="ccc" -->
        <ice-query-grid data-url="biz/ProEvtWorkTicket/workOrderHandleList"
                        chooseItem="multiple"
                        @selection-change="trace"
                        :query="queryMap"
                        :columns="columns"
                        :operations="operations"
                        :operationsWidth=100
                        :buttons="buttons"
                        :export-title="Database"
                        ref="grids">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout'
    import ServeMessage from "./base/serveMessage"
    import serveFoundation from "./base/serveFoundation"
    import disposeMessage from "./base/disposeMessage"
    import subsidiaryMessage from "./base/subsidiaryMessage"
    import AccessoryMessage from "./base/AccessoryMessage"
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import Bus from "./base/bus.js";

    export default {
        name: 'workTrack',
        data() {

            return {
                opinionData: "",
                Database: "工单跟踪",
                rowItem: [],
                mainData: {
                    serviceTicket: "",
                    serviceStatus: "",
                    oid: "",
                },
                queryMap: [
                    {type: 'input', label: '工单号', code: 'WORK_TICKET'},
                    {type: 'select', label: '工单状态', code: 'WORK_STATUS', mapTypeCode: 'serviceStatus', value: ''},
                    {type: 'select', label: '服务单状态', code: 'SERVICE_STATUS', mapTypeCode: 'serviceStatus', value: ''},
                    {type: 'input', label: '用户信息', code: 'USER_NAME'},
                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: 'userLevel', value: ''},
                    {type: 'input', label: '联系电话', code: 'USER_TELEPHONE'},/*   */
                    {type: 'input', label: '申请人信息', code: 'CREATOR_NAME_DEPT'},
                    {type: 'input', label: '申请描述', code: 'DESCRIPTION'},
                    {type: 'date', label: '开始时间(开始)', code: 'gmtBegin', exp: ">=",compare:1},
                    {type: 'date', label: '开始时间(结束)', code: 'gmtBegin', exp: "<=",compare:2},
                    {type: 'select', label: '报障方式', code: 'IS_BREAKDOWN', mapTypeCode: 'isBreakdown', value: ''},
                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: ''},
                    {type: 'input', label: '服务名称', code: 'CATEGORYNAME'},
                    {type: 'select', label: '服务级别', code: 'LV', mapTypeCode: 'servLevel'},
                    {type: 'select', label: '来源', code: 'SOURCE', mapTypeCode: "eventSource", value: ''},
                    {type: 'date', label: '开始处理时间(开始)', code: 'startHandleTime', value: '', exp: '>=',compare:3},
                    {type: 'date', label: '开始处理时间(结束)', code: 'startHandleTime', value: '', exp: '<=',compare:4},
                    {type: 'date', label: '解决处理时间(开始)', code: 'solveGmtEnd', value: '', exp: '>=',compare:5},
                    {type: 'date', label: '解决处理时间(结束)', code: 'solveGmtEnd', value: '', exp: '<>>=',compare:6},
                    {type: 'select', label: '起因', code: 'REASON', mapTypeCode: 'eventCause', value: ''},
                    {type: 'select', label: '解决状态', code: 'RESOLVE_STATUS', value: '', mapTypeCode: 'resolveStatus'},
                    {type: 'input', label: '处理人', code: 'ENGINEER_NAME'},
                    {type: 'select', label: '处理角色', code: 'ENGINEER_ROLE', value: '', mapTypeCode: 'operationalRole'},
                    {type: 'input', label: '第三方厂商', code: 'UNITNAMES'},
                    {type: 'input', label: '变更号', code: 'SHIFT_TICKETS'},

                ],
                num: [],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'id', hidden: true},
                    {label: '工单号', code: 'workTicket', width: 160},
                    {label: '工单状态', code: 'workStatus', width: 100, mapTypeCode: 'workStatus'},
                    {label: '服务单状态', code: 'serviceStatus', width: 120, mapTypeCode: 'serviceStatus'},
                    {label: '用户信息', code: 'userName', width: 120},
                    {label: '用户星级', code: 'userLevel', width: 100, mapTypeCode: 'userLevel'},
                    {label: '联系电话', code: 'userTelephone', width: 100},
                    {label: '申请人信息', code: 'creatorNameDept', width: 120},
                    {label: '申请描述', code: 'description', width: 100},
                    {label: '开始时间', code: 'gmtBegin', width: 160},
                    {label: '报障方式', code: 'isBreakdown', width: 100, mapTypeCode: 'isBreakdown'},
                    {label: '区域', code: 'areaShortname', width: 100},
                    {label: '服务名称', code: 'categoryname', width: 100},
                    {label: '服务级别', code: 'lv', width: 100, mapTypeCode: 'servLevel'},
                    {label: '来源', code: 'source', width: 100, mapTypeCode: 'eventSource'},
                    {label: '开始处理时间', code: 'startHandleTime', width: 160},
                    {label: '解决处理时间', code: 'solveGmtEnd', width: 160},
                    {label: '起因', code: 'reason', width: 100, mapTypeCode: 'eventCause'},
                    {label: '解决状态', code: 'resolveStatus', width: 100, mapTypeCode: 'resolveStatus'},
                    {label: '处理人', code: 'engineerName', width: 100},
                    {label: '处理角色', code: 'engineerRole', width: 100, mapTypeCode: 'operationalRole'},
                    {label: '第三方厂商', code: 'unitnames', width: 100},
                    {label: '变更号', code: 'shiftTickets', width: 160},
                    {
                        label: '关注', code: 'ticket',fixed:"right",width:100, renderCell(h, data) {
                            return <div class="cell" title={data.row.ticket}>
                                <el-tag size="mini" type="danger">{data.row.ticket}</el-tag>
                            </div>;
                        }
                    },
                ],
                operations: [
                    {name: '详情', icon: 'el-icon-info', type: 'primary', dbclick: true, callback: this.particular,}
                ],
                buttons: [
                    {
                        name: '关注', icon: 'el-icon-check', callback: () => {
                            this.remind();
                        }
                    },
                    {
                        name: '取消关注', icon: 'el-icon-close', callback: () => {
                            this.noRemind();
                        }
                    },
                    {name: '导出', type: "export", icon: 'el-icon-download'}
                ],
                dialogVisible: false,
                mainDataForm: {},
                tittle: ''
            }
        },
        methods: {
            /*操作*/
            particular(data) {
                this.$router.push("workTransaction?&dataId=" + data.oid + "&opinionData=" + 1);
            },
            /*详情*/

            /*刷新主列表*/
            RefFather() {
                this.$refs.grids.refresh();
            },
            /*列表选中的信息*/
            trace(rows) {
                this.rowItem = rows;
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
                    if (this.rowItem[i].ticket !== "未关注") {
                        unattention.push(this.rowItem[i].ticket);
                    }
                }
                if (this.num.length > 0) {
                    /*console.log(unique(this.num));*/
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
            IceSelect,
            IceQueryGrid,
            IceGridLayout,
            ServeMessage,
            serveFoundation,
            disposeMessage,
            subsidiaryMessage,
            AccessoryMessage,
            IceDialog,
            IceEditableTable,
            IceEditableTableColumn,
            IceMultipleUpload,
            Bus
        }

    }

</script>


<!--<style scoped>
  .button-center {
       margin:  50px 150px;
  }
    .box-top {
        height: 50px;
        width: 100%;
    }

</style>-->
<style lang="less">

</style>
