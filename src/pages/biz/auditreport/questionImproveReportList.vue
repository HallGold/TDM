<template>
    <div class="ice-container">
        <ice-query-grid data-url="/biz/BizArCorrectiveAf/list"
                        :pagination="true"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        exportTitle="问题整改报告"
                        :buttons="buttons"
                        :operations="operations">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "questionImproveReportList",
        components: {IceQueryGrid},
        data() {
            return {
                query: [
                    {type: 'input', label: '整改单号', code: 'corrNo', value: ''},
                    {type: 'input', label: '整改发起人', code: 'afUserName', value: ''},
                    {type: 'input', label: '运维报告编号', code: 'reportNo', value: ''},
                    {type: 'input', label: '运维报告名称', code: 'reportName', value: ''},
                    {type: 'select', label: '流程状态', code: 'afStatus', value: '', mapTypeCode: 'flow_af_status'},
                    {type: 'date', label: '整改发起时间起', code: 'afDate', value: '', exp: '>='},
                    {type: 'date', label: '整改发起时间止', code: 'afDate', value: '', exp: '<='},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '整改单号', code: 'corrNo', width: 150, sortable: true},
                    {label: '整改发起时间', code: 'afDate', width: 150, sortable: true},
                    {label: '整改发起人', code: 'afUserName', width: 120, sortable: true},
                    {label: '流程状态', code: 'afStatus', sortable: true, width: 100, mapTypeCode: 'flow_af_status'},
                    // {label: '整改报告类型', code: 'corrLevel', width: 140, mapTypeCode: 'OR_CORR_LEVEL', sortable: true},
                    {label: '对应报告编号', code: 'reportNo', width: 200, sortable: true},
                    {label: '对应报告名称', code: 'reportName', sortable: true, width: 300},
                    {
                        label: '对应报告密级',
                        code: 'reportSecretLevel',
                        width: 130,
                        mapTypeCode: 'DATA_SECRET_LEVEL',
                        sortable: true
                    }
                ],
                operations: [
                    {name: '查看', callback: this.lookItem},
                    {
                        name: '删除', callback: this.deleteItem, isShow: function (row) {
                            return row.afStatus == -1;
                        }
                    }
                ],
                buttons: [
                    {name: '导出', type: 'export'},
                ]
            }
        },
        methods: {
            /**查看*/
            lookItem(row) {
                this.$router.push("/biz/auditreport/questionImproveReport?dataId=" + row.oid);
            },
            /**
             * 删除
             * @param row
             */
            deleteItem(row) {
                this.$axios.delete("/biz/BizArCorrectiveAf/del", {params: {id: row.oid}}).then(success => {
                    this.$message.success("删除成功");
                    this.refresh();
                }).catch(error => {
                    this.$message.error(error.msg);
                })

            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.grid.refresh();
            }
        }
    }
</script>

<style scoped>

</style>