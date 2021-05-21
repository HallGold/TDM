<template>
    <ice-pop-selector
            data-url="/biz/BizArReportForm/list"
            textProp="reportName"
            codeProp="oid"
            ref="select"
            mode="hidden"
            :height="400"
            :gridIndex="true"
            @select-confirm="selectConfirm"
            @select-cannel="selectCannel"
            :selections="selections"
            :query="query"
            :columns="columns"
            dialog-width="1000px">
    </ice-pop-selector>
</template>

<script>
    import IcePopSelector from "../../../components/common/base/IcePopSelector";

    export default {
        name: "reportSelectors",
        model: {
            prop: 'value',
            event: 'IcePersionSelectorchange'
        },
        props: {
            value: String,

            //打开弹窗--回显--传入当行的oid
            selectedReport: {
                type: Array,
                default: () => []
            },

            //传入的参数
            reportType: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                innerValue: '',
                selections: [],
                query: [
                    {type: 'input', label: '报告编号', code: 'reportNo', value: ''},
                    {type: 'input', label: '报告周期', code: 'reportPeriod', value: ''},
                    {type: 'input', label: '报告名称', code: 'reportName', value: ''},
                    {type: 'input', label: '密级', code: 'reportSecretLevel', value: ''},
                    {type: 'select', label: '网络类型', code: 'reportScope', mapTypeCode: 'PRO_NETWORK'},
                    {type: 'static', code: 'afStatus', exp: '=', value: '2'},
                    {
                        type: 'static', code: 'reportType', exp: 'in', value: () => {
                            return this.reportType;
                        }
                    },
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '报告编号', code: 'reportNo', sortable: true, width: 140},
                    {label: '报告周期', code: 'reportPeriod', sortable: true, width: 100},
                    {label: '报告名称', code: 'reportName', sortable: true, width: 300},
                    {
                        label: '密级',
                        code: 'reportSecretLevel',
                        sortable: true,
                        width: 120,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: '网络类型', code: 'reportScope', sortable: true, width: 120},
                    {label: '上报人', code: 'afUserName', sortable: true, width: 100},
                    {
                        label: '状态', code: 'afStatus', sortable: true, width: 100, renderCell(h, data) {
                            return (data.row.afStatus == -1 ? "草稿" : (data.row.afStatus == 1 ? "运行中" : (data.row.afStatus == 2 ? "已完成" : (data.row.afStatus == 3 ? "驳回" : ""))))
                        }
                    },
                    {label: '完成时间', code: 'updateDate', sortable: true, width: 150}
                ]
            }
        },
        methods: {
            /**
             * 保存
             * @param rows
             */
            selectConfirm(rows) {
                this.$emit("getData", rows);
            },
            /**
             * 关闭窗口
             */
            selectCannel() {
                this.$emit("selectCannel");
            },
            /**
             * 打开窗口
             */
            openDialog() {
                this.$refs.select.openDialog();
            },
            loadSectionsList() {
                this.selections = this.selectedReport;
            }
        },
        computed: {},
        watch: {
            value() {
                this.innerValue = this.value;
            },
            selectedReport() {
                this.loadSectionsList()
            }
        },
        created() {
            this.loadSectionsList()
        },
        mounted() {
            this.innerValue = this.value;
        },
        components: {IcePopSelector}
    }

</script>


<style scoped>

</style>
