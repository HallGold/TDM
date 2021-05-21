<template>
    <div style="width: 100%" class="ClassName">
        <ice-query-grid data-url="biz/ProEvtWorkTicket/workOrderHandleList"
                        chooseItem="single"
                        :query="queryMap"
                        :columns="columns"
                        :operations="operations"
                        :export-title="Database"
                        ref="grids">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "workBusiness",
        components: {IceQueryGrid},
        data() {
            return {
                Database: "工单跟踪",
                queryMap: [
                    {type: 'input', label: '工单号', value: '', code: 'WORK_TICKET'},
                    {type: 'select', label: '工单状态', code: 'WORK_STATUS', mapTypeCode: 'serviceStatus', value: ''},
                    {type: 'select', label: '服务单状态', code: 'SERVICE_STATUS', mapTypeCode: 'serviceStatus', value: ''},
                    {type: 'input', label: '用户信息', value: '', code: 'USER_NAME'},
                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: 'userLevel', value: ''},
                    {type: 'input', label: '联系电话', value: '', code: 'USER_TELEPHONE'},/*   */
                    {type: 'input', label: '申请人信息', value: '', code: 'CREATOR_NAME_DEPT'},
                    {type: 'input', label: '申请描述', value: '', code: 'DESCRIPTION'},
                    {type: 'date', label: '开始时间(开始)', code: 'gmtBegin', exp: ">=",compare:1},
                    {type: 'date', label: '开始时间(结束)', value: '', code: 'gmtBegin', exp: "<=",compare:2},
                    {type: 'select', label: '报障方式', code: 'IS_BREAKDOWN', mapTypeCode: 'isBreakdown', value: ''},
                    {type: 'input', label: '区域', code: 'AREA_SHORTNAME', value: ''},
                    {type: 'input', label: '服务名称', value: '', code: 'CATEGORYNAME'},
                    {type: 'input', label: '服务级别', value: '', code: 'LV', mapTypeCode: 'servLevel'},
                    {type: 'select', label: '来源', code: 'SOURCE', mapTypeCode: 'eventSource', value: ''},
                    {type: 'date', label: '开始处理时间(开始)', value: '', code: 'startHandleTime', exp: ">=",compare:3},
                    {type: 'date', label: '开始处理时间(结束)', value: '', code: 'startHandleTime', exp: "<=",compare:4},
                    {type: 'date', label: '解决处理时间(开始)', value: '', code: 'solveGmtEnd', exp: ">=",compare:5},
                    {type: 'date', label: '解决处理时间(结束)', value: '', code: 'solveGmtEnd', exp: "<=",compare:6},
                    {type: 'select', label: '起因', code: 'REASON', mapTypeCode: 'eventCause', value: ''},
                    {type: 'select', label: '解决状态', code: 'RESOLVE_STATUS', value: '', mapTypeCode: "resolveStatus"},
                    {type: 'input', label: '处理人', value: '', code: 'ENGINEER_NAME'},
                    {type: 'select', label: '处理角色', code: 'ENGINEER_ROLE', value: '', mapTypeCode: "operationalRole"},
                    {type: 'input', label: '第三方厂商', value: '', code: 'UNITNAMES'},
                    {type: 'input', label: '变更号', value: '', code: 'SHIFT_TICKETS'},

                ],
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
                        label: '关注', code: 'isFocus',fixed:'right',width:100, renderCell(h, data) {
                            if (data.row.ticket !== null) {
                                return <div class="cell" title={data.row.isFocus}>
                                    <el-tag size="mini" type="danger">已关注</el-tag>
                                    {data.row.isFocus}</div>;
                            } else {
                                return <div class="cell" title={data.row.isFocus}>
                                    <el-tag size="mini" type="danger">未关注</el-tag>
                                    {data.row.isFocus}</div>;
                            }
                        }
                    },
                ],
                operations: [
                    {name: '修改', icon: 'el-icon-plus', type: 'primary', callback: this.changeNum,},
                    {name: '查看', icon: 'el-icon-plus', type: 'primary', callback: this.lookNum,}
                ],
            }
        },
        methods: {
            changeNum(data) {
                /*修改*/
                this.$router.push("workBusiness/workChange?dataId=" + data.oid + "&click=change");
            },
            lookNum(data) {
                /*查看*/
                this.$router.push("workBusiness/workChange?dataId=" + data.oid + "&click=look");
            }
        }
    }
</script>

<style scoped lang="less">
</style>