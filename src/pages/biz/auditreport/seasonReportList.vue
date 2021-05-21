<template>
    <div class="ice-container">
        <ice-query-grid data-url="/biz/BizArReportForm/list"
                        :pagination="true"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "seasonReportList",
        components: {IceQueryGrid},
        data() {
            return {
                query: [],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '报告编号', code: 'reportNo', sortable: true, width: 140},
                    {label: '报告周期', code: 'reportPeriod', sortable: true, width: 150},
                    {label: '区域', code: 'areaName', width: 120},
                    {label: '报告类型', code: 'reportType', mapTypeCode: 'OR_REPORT_TYPE', sortable: true, width: 150},
                    {label: '报告名称', code: 'reportName', sortable: true, width: 300},
                    {
                        label: '密级',
                        code: 'reportSecretLevel',
                        sortable: true,
                        width: 80,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: '上报人', code: 'afUserName', sortable: true, width: 100},
                    {
                        label: '状态', code: 'afStatus', sortable: true, width: 100, renderCell(h, data) {
                            return (data.row.afStatus==-1?"草稿":(data.row.afStatus==1?"运行中":(data.row.afStatus==2?"已完成":(data.row.afStatus==3?"驳回":""))))}},
                    {label: '发起时间', code: 'afDate', sortable: true, width: 150}
                ],
                operations: [
                    {name: '查看', callback: this.lookItem},
                    {name: '发起整改', callback: this.startItem,isShow: function (row) {
                            if (row.afStatus == 2) {
                                return true;
                            }
                            return false;
                        }}
                ],
                options:[],
            }
        },
        methods: {
            /**新增*/
            addItem(code) {
            },
            /**查看*/
            lookItem(row) {
                this.$router.push("/biz/auditreport/seasonReport?dataId=" + row.oid);
            },
            /**发起整改*/
            startItem(row) {
                this.$router.push("/biz/auditreport/questionImproveReport?id="+row.oid);
            }
        },
        mounted() {
            this.$axios.get('/pro/ProScBizCatalog/areaAll')
                .then(result => {
                    this.options = [];
                    result.data.forEach(item=>{
                        let obj = {};
                        obj.name = item.shortname;
                        obj.code = item.shortname;
                        this.options.push(obj);
                    });
                    this.query = [
                        {type: 'input', label: '报告编号', code: 'reportNo', value: ''},
                        {type: 'input', label: '报告周期', code: 'reportPeriod', value: ''},
                        {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                        {type: 'select', label: '密级', code: 'reportSecretLevel', mapTypeCode: 'DATA_SECRET_LEVEL'},
                        {type: 'select', label: '区域', code: 'areaName',textProp: 'name',
                            codeProp: 'code', options: this.options},
                        {type: 'input', label: '上报人', code: 'afUserName', value: ''},
                        {type: 'select', label: '状态', code: 'afStatus', value: '', mapTypeCode: 'flow_af_status'},
                        {type: 'date', label: '发起时间开始', code: 'afDate', exp: '>=', value: ''},
                        {type: 'date', label: '发起时间结束', code: 'afDate', exp: '<=', value: ''},
                        {type: 'select', label: '报告类型', code: 'reportType', value: '', mapTypeCode: 'OR_REPORT_TYPE'},
                    ];
                }).catch(error => {
                this.$message.error(error.msg);
            });
        }

    }
</script>

<style scoped>

</style>