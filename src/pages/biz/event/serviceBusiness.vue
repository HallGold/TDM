<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" class="ClassName">
        <ice-query-grid
                data-url="/biz/ProEvtServiceTicket/searchPageTrackingServTicket"
                :columns=columns
                :query="[...commonQuery,...queryMap[activeTab]]"
                :operations="operations"
                :gridData="information"
                chooseItem="single"
                @selection-change="select"
                :title="exportTitle"
                ref="grids">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "serviceBusiness",
        components: {IceQueryGrid},
        data() {
            return {
                information: [],
                dataArray: [],
                exportTitle: "服务单跟踪-服务申请",
                columns: [
                    {label: '服务单号', code: 'serviceTicket', width: 200},
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
                    {label: '申请人', code: 'creatorName', width: 100},
                    {label: '描述', code: 'description', width: 300},
                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                    {label: '区域', code: 'areaShortname', width: 100},
                    {label: '业务服务名称', code: 'categoryname', width: 100},
                    {label: '服务项', code: 'catalogname', width: 100},
                    {label: '性质', code: 'serviceProperty', mapTypeCode: "serviceProperties", width: 100},
                    {label: '申请时间', code: 'gmtCreate', width: 200},
                    {label: '派单时间', code: 'gmtSchedule', width: 200},
                    {label: '工程师响应时间', code: 'gmtResponseEg', width: 200},
                    {label: '关单时间', code: 'gmtClose', width: 200},
                    {label: '满意度', code: 'satisfaction',},
                    {label: '评价模式', code: 'feedbackType', mapTypeCode: "feedbackType"},
                    {
                        label: '关注', code: 'isFocus',fixed:'right',width:100, renderCell(h, data) {
                            if (data.row.ticket !== "未关注") {
                                return <div class="cell" title={data.row.isFocus}>
                                    <el-tag size="mini" type="danger">已关注</el-tag>
                                    {data.row.isFocus}</div>;
                            }
                            return <div class="cell" title={data.row.isFocus}>
                                <el-tag size="mini" type="danger">未关注</el-tag>
                                {data.row.isFocus}</div>;
                        }
                    },
                    {label: '', code: 'IS_BREAKDOWN', hidden: true, value: 0},
                ],
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
                                {label: '服务单号', code: 'serviceTicket', width: 200},
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
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '描述', code: 'description', width: 300},
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
                                    label: '关注', code: 'isFocus',fixed:'right',width:100, renderCell(h, data) {
                                        if (data.row.ticket !== "未关注") {
                                            return <div class="cell" title={data.row.isFocus}>
                                                <el-tag size="mini" type="danger">已关注</el-tag>
                                                {data.row.isFocus}</div>;
                                        }
                                        return <div class="cell" title={data.row.isFocus}>
                                            <el-tag size="mini" type="danger">未关注</el-tag>
                                            {data.row.isFocus}</div>;
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
                                    {type: 'select', label: '用户星级', code: 'USER_LEVEL', mapTypeCode: "userLevel"},
                                    {
                                        type: 'select',
                                        label: '服务单状态',
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
                                    {
                                        type: 'select',
                                        label: '派单方式',
                                        code: 'scheduleWay',
                                        value: '',
                                        mapTypeCode: "SCHEDULEWAY"
                                    },
                                    {type: 'input', label: '业务服务名称', code: 'CATEGORYNAME', value: ''},
                                    {type: 'input', label: '服务项', code: 'CATALOGNAME', value: '',},
                                    {type: 'date', label: '派单时间(开始)', code: 'gmtSchedule', value: '', exp: ">="},
                                    {type: 'date', label: '派单时间(结束)', code: 'gmtSchedule', value: '', exp: "<="},
                                    {
                                        type: 'select',
                                        label: '评价模式',
                                        code: 'feedbackType',
                                        value: '',
                                        mapTypeCode: "feedbackType"
                                    },
                                    // {type: 'date', label: '工程师响应时间', code: 'gmtResponseeg', value: '',},
                                    // {type: 'date', label: '关单时间', code: 'gmtClose', value: '',},
                                ],
                            };
                        } else if (value === '1') {
                            this.dataArray = [];
                            this.exportTitle = "服务单跟踪-故障";
                            this.columns = [
                                {label: '服务单号', code: 'serviceTicket', width: 200},
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
                                {label: '申请人', code: 'creatorName', width: 100},
                                {label: '描述', code: 'description', width: 300},
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
                                    label: '关注', code: 'isFocus',fixed:'right',width:100, renderCell(h, data) {
                                        if (data.row.ticket !== "未关注") {
                                            return <div class="cell" title={data.row.isFocus}>
                                                <el-tag size="mini" type="danger">已关注</el-tag>
                                                {data.row.isFocus}</div>;
                                        }
                                        return <div class="cell" title={data.row.isFocus}>
                                            <el-tag size="mini" type="danger">未关注</el-tag>
                                            {data.row.isFocus}</div>;
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
                }],
                operations: [
                    {
                        name: '修改',
                        callback: this.changeData,
                    },
                    {
                        name: '查看',
                        callback: this.lookData,
                    },
                ],
            }
        },
        methods: {
            changeData(data) {
                this.$router.push("serviceBusiness/serviceChange?dataId=" + data.oid + "&click=change");
            },
            lookData(data) {
                this.$router.push("serviceBusiness/serviceChange?dataId=" + data.oid + "&click=look");
            },
            select(row) {
                this.dataArray = row;
            },
        }
    }
</script>

<style scoped lang="less">
</style>