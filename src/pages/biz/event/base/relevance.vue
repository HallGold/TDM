<template>
    <!--        服务单待受理==》办理==》附属信息==》关联弹窗-->
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                :data-url="url"
                :columns="columns"
                :query="query"
                :gridData="information"
                chooseItem="multiple"
                @selection-change="selects"
                ref="gridWith">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import {EventEmitter as $} from "events";

    export default {
        name: 'relevance',
        components: {
            IceQueryGrid
        },
        data() {
            return {
                url: "/biz/ProEvtServiceTicket/searchPageUserServTicket",
                columns: [
                    {label: '服务单号', code: 'serviceTicket', width: 200},
                    {
                        label: '状态', code: 'serviceStatus', renderCell(h, data) {
                            let Statu = ["草稿", "待分派", "已分派", "处理中", "待回访", "待确认", "返工待分派", "已关闭", "已取消",];
                            return Statu[data.row.serviceStatus]
                        }
                    },
                    {label: '用户', code: 'userName',},
                    {label: '用户星级', code: 'userLevel', mapTypeCode: "userLevel"},
                    {label: '处理人', code: 'disposePerson',},
                    {label: '申请人', code: 'creatorName',},
                    {label: '描述', code: 'description',},
                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                    {label: '区域', code: 'areaShortname',},
                    {label: '业务服务名称', code: 'categoryname',width:150},
                    {label: '服务项', code: 'catalogname',},
                    {label: '性质', code: 'serviceProperty', mapTypeCode: "serviceProperties"},
                    {label: '申请时间', code: 'gmtCreate',},
                    {
                        label: '关注', code: 'isFocus', renderCell(h, data) {
                            if (data.row.ticket !== null) {
                                return <div class="cell" title={data.row.isFocus}>
                                    <el-tag size="mini" type="danger">已关注</el-tag>
                                    {data.row.isFocus}</div>;
                            }
                            return <div class="cell" title={data.row.isFocus}>
                                <el-tag size="mini" type="danger">未关注</el-tag>
                                {data.row.isFocus}</div>;
                        }
                    },
                ],
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'IS_BREAKDOWN',
                        value: '0',
                        click: value => {
                            if (value == '0') {
                                this.lab = '服务申请';
                                this.editUrl = "/biz/event/serviceTicket/transaction";
                                this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket";
                                this.columns = [
                                    {label: '服务单号', code: 'serviceTicket', width: 200},
                                    {
                                        label: '状态', code: 'serviceStatus', renderCell(h, data) {
                                            let Statu = ["草稿", "待分派", "已分派", "处理中", "待回访", "待确认", "返工待分派", "已关闭", "已取消",];
                                            return Statu[data.row.serviceStatus]
                                        }
                                    },
                                    {label: '用户', code: 'userName',},
                                    {label: '用户星级', code: 'userLevel', mapTypeCode: "userLevel"},
                                    {label: '处理人', code: 'disposePerson',},
                                    {label: '申请人', code: 'creatorName',},
                                    {label: '描述', code: 'description',},
                                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                    {label: '区域', code: 'areaShortname',},
                                    {label: '业务服务名称', code: 'categoryname',width:150},
                                    {label: '服务项', code: 'catalogname',},
                                    {label: '性质', code: 'serviceProperty', mapTypeCode: "serviceProperties"},
                                    {label: '申请时间', code: 'gmtCreate',},
                                    {
                                        label: '关注', code: 'isFocus', renderCell(h, data) {
                                            if (data.row.ticket !== null) {
                                                return <div class="cell" title={data.row.isFocus}>
                                                    <el-tag size="mini" type="danger">已关注</el-tag>
                                                    {data.row.isFocus}</div>;
                                            }
                                            return <div class="cell" title={data.row.isFocus}>
                                                <el-tag size="mini" type="danger">未关注</el-tag>
                                                {data.row.isFocus}</div>;
                                        }
                                    },
                                    {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '0', hidden: true}
                                ];
                            } else if (value == '1') {
                                this.lab = '故障申报';
                                this.url = "/biz/ProEvtServiceTicket/searchPageUserServTicket";
                                this.editUrl = "/biz/event/serviceTicket/transaction";
                                this.columns = [
                                    {label: '服务单号', code: 'serviceTicket', width: 200},
                                    {
                                        label: '状态', code: 'serviceStatus', renderCell(h, data) {
                                            let Statu = ["草稿", "待分派", "已分派", "处理中", "待回访", "待确认", "返工待分派", "已关闭", "已取消",];
                                            return Statu[data.row.serviceStatus]
                                        }
                                    },
                                    {label: '用户', code: 'userName',},
                                    {label: '用户星级', code: 'userLevel', mapTypeCode: "userLevel"},
                                    {label: '处理人', code: 'disposePerson',},
                                    {label: '申请人', code: 'creatorName',},
                                    {label: '描述', code: 'description',},
                                    {label: '来源', code: 'source', mapTypeCode: "eventSource"},
                                    {label: '区域', code: 'areaShortname',},
                                    {label: '业务服务名称', code: 'categoryname',width:150},
                                    {label: '服务项', code: 'catalogname',},
                                    {label: '性质', code: 'serviceProperty',width:150, mapTypeCode: "serviceProperties"},
                                    {label: '故障开始时间', code: 'gmtBegin',width:150},
                                    {label: '申请时间', code: 'gmtCreate',width:150},
                                    {
                                        label: '关注', code: 'isFocus', renderCell(h, data) {
                                            if (data.row.ticket !== null) {
                                                return <div class="cell" title={data.row.isFocus}>
                                                    <el-tag size="mini" type="danger">已关注</el-tag>
                                                    {data.row.isFocus}</div>;
                                            }
                                            return <div class="cell" title={data.row.isFocus}>
                                                <el-tag size="mini" type="danger">未关注</el-tag>
                                                {data.row.isFocus}</div>;
                                        }
                                    },
                                    {type: 'input', label: '服务单号', code: 'IS_BREAKDOWN', value: '1', hidden: true}
                                ];
                            }
                            this.$refs.gridWith.refresh();
                        },
                        tablist: [
                            {label: '服务申请', value: '0',},
                            {label: '故障', value: '1'},
                        ]
                    },
                ],
                information: [],
                lab: '服务申请',
                editUrl: "/biz/event/serviceTicket/transaction"
            }
        },
        methods: {
            selects(row) {
                this.$emit('selection-change', row, this.lab, this.editUrl);
            },
        }
    }

</script>


<style scoped>

</style>
