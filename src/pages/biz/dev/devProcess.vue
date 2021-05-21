<template>
    <div>
        <ice-query-grid
                v-if="initOver"
                :data-url="ENUMS.ACTIONS.GET_PROCESS_BY_DEV.URL()"
                :query="PAGE_ENUM.QUERY"
                :columns="PAGE_ENUM.COLUMNS"
                :operations="PAGE_ENUM.OPERATIONS"
                @dbClick="openForm"
                :ref="PAGE_ENUM.REFS.GRID"></ice-query-grid>
    </div>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import IceQueryGrid from '@/components/common/base/IceQueryGrid';

    export default {
        name: "devProcess",
        mixins: [bizComm, devComm],
        components: {IceQueryGrid},
        props: {
            //设备Id
            devId: {
                type: String,
                default: ""
            }
        },
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {GRID: "grid"},
                    QUERY: [],
                    COLUMNS: [],
                    OPERATIONS: []
                },
                initOver: false,
            };
        },
        methods: {
            /**
             * 初始化查询条件
             */
            initQuery() {
                this.PAGE_ENUM.QUERY = [
                    {type: 'static', label: '设备ID', code: 'devId', width: 80, value: this.devId},
                    {type: 'static', label: '状态', code: 'afStatus', exp: "!=", value: -1}
                ];
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.PAGE_ENUM.COLUMNS = [
                    {code: 'oid', hidden: true},
                    {label: '审批单号', code: 'formNo', width: 300},
                    {label: '流程名称', code: 'flowName', width: 300},
                    {label: '状态', code: 'status', width: 100},
                    {label: '创建人', code: 'createUserName', width: 100},
                    {label: '创建时间', code: 'createDate', width: 180}
                ];
            },
            /**
             * 双击打开表单
             * @param url
             */
            openForm(row) {
                window.open(row.flowUrl);
            },
        },
        mounted() {
            this.initColumns();
            this.initQuery();
            this.initOver = true;
        }
    }
</script>

<style scoped>

</style>