<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                data-url="biz/ProEvtServiceTicketExt/searchServiceTicketExtPage"
                :columns=columns
                :buttons=buttons
                :query="[...commonQuery,...queryMap[activeTab]]"
                :gridData="information"
                chooseItem="single"
                @selection-change="select"
                :title="exportTitle"
                ref="grids"
        ></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import ServeMessage from "./base/serveMessage"
    import BaseMessage from "./base/baseMessage"
    import AccessMessage from "./base/AccessoryMessage"
    import affiliatedMessage from "./base/affiliatedMessage"
    import serviceApplyFor from "./base/serviceApplyFor"
    import serveFoundation from './base/serveFoundation'
    import detail from "./base/detail"
    import satelliteInformation from "./base/satelliteInformation";
    import returnInformation from "./base/returnInformation";
    import workOrderInformation from "./base/workOrderInformation";

    export default {
        name: "serviceTicketHandleMessage",
        components: {
            IceQueryGrid, detail, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, serveFoundation,
            satelliteInformation, returnInformation, workOrderInformation
        },
        data() {
            return {
                exportTitle: "服务单处理信息查询-服务单处理信息查询",
                Visible: false,
                aclKeyReadonly: true,
                information: [],
                detailArr: [],
                columns: [],
                columnes: [],
                columnse: [],
                queryMap: {
                    '0': [
                        {
                            type: 'static', code: 'service_Status', exp: 'in', value: () => {
                                return "4,5,7";
                            }
                        },
                        {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                        {
                            type: 'select', label: '状态', code: 'serviceStatus', value: '', mapTypeCode: "serviceStatus"
                        },
                        {
                            type: 'select',
                            label: '最终处置角色',
                            code: 'LAST_CHARACTER',
                            value: '',
                            mapTypeCode: "operationalRole"
                        },
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
                            this.exportTitle = "服务单处理信息查询-服务单处理信息查询";
                            this.columns = this.columnes;
                            this.queryMap = {
                                '0': [
                                    {
                                        type: 'static', code: 'service_Status', exp: 'in', value: () => {
                                            return "4,5,7";
                                        }
                                    },
                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'serviceStatus',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '最终处置角色',
                                        code: 'LAST_CHARACTER',
                                        value: '',
                                        mapTypeCode: "operationalRole"
                                    },
                                ],
                            };
                        } else if (value === '1') {
                            this.exportTitle = "服务单处理信息查询-服务单基础信息查询";
                            this.columns = this.columnse;
                            this.queryMap = {
                                '0': [
                                    {
                                        type: 'static', code: 'service_Status', exp: 'in', value: () => {
                                            return "4,5,7";
                                        }
                                    },
                                    {type: 'input', label: '服务单号', code: 'SERVICE_TICKET', value: '',},
                                    {
                                        type: 'select',
                                        label: '状态',
                                        code: 'serviceStatus',
                                        value: '',
                                        mapTypeCode: "serviceStatus"
                                    },
                                    {
                                        type: 'select',
                                        label: '最终处置角色',
                                        code: 'LAST_CHARACTER',
                                        value: '',
                                        mapTypeCode: "operationalRole"
                                    },
                                ],
                            };
                        }
                        this.$refs.grids.refresh();
                        this.$refs.grids.refreshAndPageReset();
                    },
                    tablist: [
                        {label: '服务单处理信息查询', value: '0',},
                        {label: '服务单基础信息查询', value: '1'},
                    ]
                },
                ],
                buttons: [
                    {
                        name: '详情',
                        icon: 'el-icon-info',
                        type: '', code: '',
                        callback: this.detail
                    },
                    {
                        name: '导出',
                        icon: 'el-icon-download',
                        type: 'export',
                    },
                ]
            }
        },
        methods: {
            initTemplate() {
                let _this = this;
                this.columns = [
                    {label: '服务单号', code: 'serviceTicket', width: 200},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"},
                    {
                        label: '0线响应时长', code: 'durationResponseZero', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseZero);
                        }
                    },
                    {
                        label: '1线响应时长', code: 'durationResponseOne', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseOne);
                        }
                    },
                    {
                        label: '1线处置时长', code: 'durationDoneOne', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneOne);
                        }
                    },
                    {
                        label: '2线响应时长', code: 'durationResponseTwo', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseTwo);
                        }
                    },
                    {
                        label: '2线处置时长', code: 'durationDoneTwo', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneTwo);
                        }
                    },
                    {
                        label: '3线响应时长', code: 'durationResponseThree', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseThree);
                        }
                    },
                    {
                        label: '3线处置时长', code: 'durationDoneThree', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneThree);
                        }
                    },
                    {
                        label: '最终处置时长', code: 'durationDoneEnd', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneEnd);
                        }
                    },
                    {label: '最终处置角色', code: 'lastCharacter', width: 100, mapTypeCode: "operationalRole"},
                    {label: '处置是否超时', code: 'doneIsTimeOut', width: 100,},
                    {label: '满意度', code: 'satisfaction',},
                    {label: '返工次数', code: 'numRework',},
                    {label: '工单数', code: 'numWorkTicket',},
                    {label: '转派次数', code: 'numShift',},
                    {label: '挂起次数', code: 'numHangup',},
                ];
                this.columnes = [
                    {label: '服务单号', code: 'serviceTicket', width: 200},
                    {label: '状态', code: 'serviceStatus', mapTypeCode: "serviceStatus"},
                    {
                        label: '0线响应时长', code: 'durationResponseZero', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseZero);
                        }
                    },
                    {
                        label: '1线响应时长', code: 'durationResponseOne', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseOne);
                        }
                    },
                    {
                        label: '1线处置时长', code: 'durationDoneOne', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneOne);
                        }
                    },
                    {
                        label: '2线响应时长', code: 'durationResponseTwo', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseTwo);
                        }
                    },
                    {
                        label: '2线处置时长', code: 'durationDoneTwo', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneTwo);
                        }
                    },
                    {
                        label: '3线响应时长', code: 'durationResponseThree', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationResponseThree);
                        }
                    },
                    {
                        label: '3线处置时长', code: 'durationDoneThree', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneThree);
                        }
                    },
                    {
                        label: '最终处置时长', code: 'durationDoneEnd', width: 100, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneEnd);
                        }
                    },
                    {label: '最终处置角色', code: 'lastCharacter', width: 100, mapTypeCode: "operationalRole"},
                    {label: '处置是否超时', code: 'doneIsTimeOut', width: 100,},
                    {label: '满意度', code: 'satisfaction',},
                    {label: '返工次数', code: 'numRework',},
                    {label: '工单数', code: 'numWorkTicket',},
                    {label: '转派次数', code: 'numShift',},
                    {label: '挂起次数', code: 'numHangup',},
                ];
                this.columnse = [
                    {label: '服务单号', code: 'serviceTicket', width: 200},
                    {label: '开始处理时间', code: 'gmtBegin', width: 200},
                    {label: '处理人角色', code: 'engineerRole', width: 200},
                    {label: '工程师最终解决时间', code: 'gmtDoneEg', width: 200},
                    {
                        label: '一线处置时长', code: 'durationDoneOne', width: 200, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneOne);
                        }
                    },
                    {
                        label: '二线处置时长', code: 'durationDoneTwo', width: 200, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneTwo);
                        }
                    },
                    {
                        label: '三线处置时长', code: 'durationDoneThree', width: 200, renderCell(h, data) {
                            return _this.timeItem(data.row.durationDoneThree);
                        }
                    },
                    {label: '最终处置角色', code: ' lastCharacter ', width: 200},
                    {label: '派工时间', code: 'gmtSchedule', width: 200},
                    {label: '响应时间', code: 'gmtResponse', width: 200},
                    {label: '工程师最初响应时间', code: 'gmtResponseEg', width: 200},
                ];
            },
            timeItem(data) {
                if (data > 1440) {
                    return parseInt(data / 1440) + "天" + parseInt((data % 1440) / 60) + "小时" + (data % 1440) % 60 + "分钟"
                } else if (data == 0 || data == undefined) {
                    return "-"
                } else if (data > 60) {
                    return parseInt(data / 60) + "小时" + data % 60 + "分钟"
                }
                return data + "分钟"
            },
            detail() {
                if (this.detailArr.length == "0" || this.detailArr.length > "1") {
                    this.$confirm('请选择一条数据进行查看！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                } else if (this.detailArr.length == "1") {
                    this.$router.push("serviceTicket/transaction?dataId=" + this.detailArr[0].oid + "&tabs=0&type=detail&state=" + this.detailArr[0].serviceStatus + "&page=3&service=" + this.detailArr[0].serviceTicket);
                }
            },
            select(row) {
                this.detailArr = row;
            }
        },
        mounted() {
            this.initTemplate();
        }
    }
</script>

<style scoped>

</style>