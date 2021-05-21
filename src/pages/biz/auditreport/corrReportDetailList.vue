<template>
    <div class="ice-container">
        <ice-tree-grid :columns="columns"
                       :lazy="false"
                       :operations="operations"
                       :pagination="true"
                       :query="query"
                       @node-click="dataTree"
                       data-url="/biz/BizArCorrectiveDetail/list"
                       label-prop="name"
                       load-url="/biz/BizArReport/typeTree"
                       ref="iceGrid"
                       value-prop="code">
        </ice-tree-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "opsReportRepoList",
        components: {IceTreeGrid, IceQueryGrid, fileUtil},
        data() {
            return {
                query: [
                    {type: 'input', label: '整改编号', code: 'reportNo', value: ''},
                    {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                    {type: 'input', label: '责任人', code: 'dutyUserName'},
                    {type: 'input', label: '责任部门', code: 'dutyDeptName'},
                    {type: 'date', label: '完成时间从', code: 'endTimeExpect', exp: '>=', value: ''},
                    {type: 'date', label: '完成时间至', code: 'endTimeExpect', exp: '<=', value: ''},
                    {
                        type: 'select',
                        label: '是否完成',
                        code: 'completeType',
                        mapTypeCode: 'OR_CORR_COMPLETE_TYPE',
                        value: ''
                    },
                    // /*{type: 'static', label: '状态', code: 'afStatus', exp: '=', value: 2},*/
                    {
                        type: 'static', code: 'reportType', exp: '=', value: () => {
                            return this.treeCode
                        }
                    },
                    // {type: 'static', code: 'afStatus', exp: '=', value: '2'}
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {
                        label: '整改编号', code: 'reportNo', sortable: true, width: 150, renderCell(h, data) {
                            return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                'on': {
                                    'click': () => {
                                        this.$axios.get("/biz/BizArCorrectiveAf/getByNo?corrNo=" + data.row.reportNo).then(succ => {
                                            window.open("#/biz/auditreport/questionImproveReport?dataId=" + succ.data.oid, "_blank");
                                        })
                                    }
                                }
                            }
                            }
                            >{data.row.reportNo}</a>;
                        }
                    },
                    {label: '审计问题', code: 'auditIssue', sortable: true, width: 450},
                    {label: '责任人', code: 'dutyUserName', sortable: true, width: 100},
                    {label: '责任部门', code: 'dutyDeptName', sortable: true, width: 150},
                    {
                        label: '是否完成',
                        code: 'completeType',
                        sortable: true,
                        width: 100,
                        mapTypeCode: 'OR_CORR_COMPLETE_TYPE'
                    },
                    {label: '完成时间', code: 'endTimeExpect', sortable: true, width: 100}
                ],
                operations: [],
                treeCode: '',                    //根据树形节点值--加载不同类型的数据列表
            }
        },
        methods: {
            /**点击树形节点，获取树形节点的数据*/
            dataTree(val) {
                this.treeCode = val;
                this.$axios.get("/biz/BizArCorrectiveAf/corrType", {"params": {"reportType": val}}).then(success => {
                    if (success.data === 'USER') {
                        this.columns = [
                            {code: "oid", hidden: true},
                            {
                                label: '整改编号', code: 'reportNo', sortable: true, width: 150, renderCell(h, data) {
                                    return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                        'on': {
                                            'click': () => {
                                                this.$axios.get("/biz/BizArCorrectiveAf/getByNo?corrNo=" + data.row.reportNo).then(succ => {
                                                    window.open("#/biz/auditreport/questionImproveReport?dataId=" + succ.data.oid, "_blank");
                                                })
                                            }
                                        }
                                    }
                                    }
                                    >{data.row.reportNo}</a>;
                                }
                            },
                            {label: '审计问题', code: 'auditIssue', sortable: true, width: 150},
                            {
                                label: '安全风险',
                                code: 'auditRisk',
                                sortable: true,
                                width: 150,
                                mapTypeCode: 'OR_RISK_LEVEL'
                            },
                            {label: '整改建议', code: 'correctiveSuggest', sortable: true, width: 150},
                            {label: '责任人', code: 'dutyUserName', sortable: true, width: 100},
                            {label: '责任部门', code: 'dutyDeptName', sortable: true, width: 150},
                            {
                                label: '是否完成',
                                code: 'completeType',
                                sortable: true,
                                width: 100,
                                mapTypeCode: 'OR_CORR_COMPLETE_TYPE'
                            },
                            {label: '完成时间', code: 'endTimeExpect', sortable: true, width: 100}
                        ];
                    } else if (success.data === 'LEAK') {
                        this.columns = [
                            {code: "oid", hidden: true},
                            {
                                label: '整改编号', code: 'reportNo', sortable: true, width: 150, renderCell(h, data) {
                                    return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                        'on': {
                                            'click': () => {
                                                this.$axios.get("/biz/BizArCorrectiveAf/getByNo?corrNo=" + data.row.reportNo).then(succ => {
                                                    window.open("#/biz/auditreport/questionImproveReport?dataId=" + succ.data.oid, "_blank");
                                                })
                                            }
                                        }
                                    }
                                    }
                                    >{data.row.reportNo}</a>;
                                }
                            },
                            {label: '漏扫名称', code: 'leakName', sortable: true, width: 300},
                            {label: '影响IP', code: 'leakIp', sortable: true, width: 150},
                            {label: '责任人', code: 'dutyUserName', sortable: true, width: 100},
                            {label: '责任部门', code: 'dutyDeptName', sortable: true, width: 150},
                            {
                                label: '是否完成',
                                code: 'completeType',
                                sortable: true,
                                width: 100,
                                mapTypeCode: 'OR_CORR_COMPLETE_TYPE'
                            },
                            {label: '完成时间', code: 'endTimeExpect', sortable: true, width: 100}
                        ];
                    } else if (success.data === 'PRIVILEGE') {
                        this.columns = [
                            {code: "oid", hidden: true},
                            {
                                label: '整改编号', code: 'reportNo', sortable: true, width: 150, renderCell(h, data) {
                                    return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                        'on': {
                                            'click': () => {
                                                this.$axios.get("/biz/BizArCorrectiveAf/getByNo?corrNo=" + data.row.reportNo).then(succ => {
                                                    window.open("#/biz/auditreport/questionImproveReport?dataId=" + succ.data.oid, "_blank");
                                                })
                                            }
                                        }
                                    }}
                                    >{data.row.reportNo}</a>;
                                }
                            },
                            {label: '审计问题', code: 'auditIssue', sortable: true, width: 200},
                            {label: '整改建议', code: 'correctiveSuggest', sortable: true, width: 200},
                            {label: '责任人', code: 'dutyUserName', sortable: true, width: 100},
                            {label: '责任部门', code: 'dutyDeptName', sortable: true, width: 150},
                            {
                                label: '是否完成',
                                code: 'completeType',
                                sortable: true,
                                width: 100,
                                mapTypeCode: 'OR_CORR_COMPLETE_TYPE'
                            },
                            {label: '完成时间', code: 'endTimeExpect', sortable: true, width: 100}
                        ];
                    }
                });
            }
        },
    }
</script>

<style scoped>

</style>