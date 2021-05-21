<template>
    <div class="ice-container">
        <ice-tree-grid :columns="columns"
                       :lazy="false"
                       :operations="operations"
                       :pagination="true"
                       :query="query"
                       @node-click="dataTree"
                       data-url="/biz/BizArCorrectiveAf/list"
                       label-prop="name"
                       load-url="/biz/BizArReport/typeTree"
                       ref="iceGrid"
                       value-prop="code">
        </ice-tree-grid>
        <el-dialog v-dialogDrag
                   title="整改附件下载"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="1000px"
                   append-to-body
                   :close-on-click-modal="false">
            <ice-query-grid data-url="/biz/BizArCorrectiveDetail/attachmentList"
                            :query="queryDialog"
                            :columns="columnsDialog"
                            ref="gridDialog"
                            :pagination="false"
                            :gridAutoRefresh="false"
                            :operations="operationsDialog"
                            :buttons="buttons">
            </ice-query-grid>
        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";

    export default {
        name: "corrReportRepoList",
        components: {IceTreeGrid, IceQueryGrid},
        data() {
            return {
                corrNo: '',
                query: [
                    {type: 'input', label: '整改单号', code: 'corrNo', value: ''},
                    {type: 'input', label: '报告单号', code: 'reportNo', value: this.reportNo},
                    {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                    {type: 'date', label: '上报时间开始', code: 'reportTime', exp: '>=', value: ''},
                    {type: 'date', label: '上报时间结束', code: 'reportTime', exp: '<=', value: ''},
                    {type: 'select', label: '报告表单名称', code: 'reportName', value: '', mapTypeCode: 'OR_REPORT_TYPE'},
                    {type: 'select', label: '状态', code: 'afStatus', exp: '=', value: '', mapTypeCode: 'flow_af_status'},
                    {
                        type: 'static', code: 'reportType', exp: '=', value: () => {
                            return this.treeCode
                        }
                    },
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {code: "reportId", hidden: true},
                    {
                        label: '问题整改单号', code: 'corrNo', sortable: true, width: 150, renderCell(h, data) {
                            return <a title="查看审批信息" style="color:#333333;text-decoration:underline"{...{
                                on: {
                                    'click': () => {
                                        this.$router.push("/biz/auditreport/questionImproveReport?dataId=" + data.row.oid)
                                    }
                                }
                            }}>{data.row.corrNo}</a>;
                        }
                    },
                    {
                        label: '运维报告编号', code: 'reportNo', sortable: true, width: 150, renderCell: (h, data) => {
                            return <a title="查看审批信息" style="color:#333333;text-decoration:underline" {...{
                                on: {
                                    'click': () => {
                                        this.$router.push("/biz/auditreport/seasonReport?dataId=" + data.row.reportId)
                                    }
                                }
                            }}> {data.row.reportNo}</a>;
                        }
                    },
                    {label: '运维报告周期', code: 'reportPeriod', width: 150, sortable: true},
                    {label: '运维报告分类', code: 'reportType', mapTypeCode: 'OR_REPORT_TYPE', width: 200, sortable: true},
                    {label: '运维报告名称', code: 'reportName', width: 200, sortable: true},
                    {label: '上报人', code: 'afUserName', width: 100, sortable: true},
                    {label: '入库时间', code: 'updateDate', sortable: true, width: 150},
                    {label: '审批状态', code: 'afStatus', mapTypeCode: 'flow_af_status', sortable: true, width: 100},
                ],
                operations: [
                    {name: '下载附件', callback: this.openDialog}
                ],
                queryDialog: [
                    {type: 'static', label: '整改编号', code: 'corrNo', exp: '=', value: () => this.corrNo}
                ],
                columnsDialog: [
                    {label: '整改编号', code: 'corrNo', width: 150},
                    {label: '附件名称', code: 'fileName', width: 300},
                    {label: '上传人', code: 'uploadUserName', width: 200},
                    {label: '上传时间', code: 'uploadDate', width: 100},
                ],
                operationsDialog: [
                    {name: '下载', callback: this.download}
                ],
                buttons: [],
                dialogVisible: false
            }
        },
        methods: {
            dataTree(val) {
                if ('all' === val) {
                    this.treeCode = '';
                } else {
                    this.treeCode = val;
                }
            },
            /**打开附件列表*/
            openDialog(row) {
                this.corrNo = row.corrNo;
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.$refs.gridDialog.search(true)
                })
            },
            /**下载附件*/
            download(row) {
                this.$downloadFile(row.fileId);
            }
        },
        mounted() {
        }

    }
</script>

<style scoped>

</style>