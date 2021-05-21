<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid data-url="/pro/ProScTechCatalogHistory/list"
                        :query="query"
                        exportTitle="技术服务目录修改记录"
                        :columns="columns"
                        :operationsWidth=100
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>
    </div>
</template>

<script>

    import common from '@/utils/common.js';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "ProBaseContacter",
        data() {
            return {
                query: [
                    {label: '修改人', code: 'updateUser',type: 'input' },
                    {label: '修改时间', code: 'updateDate',type: 'date' },
                    {label: '区域', code: 'area',type: 'input' },
                    {label: '服务名称', code: 'category', type: 'input'},
                    {label: '修改内容', code: 'content', type: 'input'},
                    {label: '详情', code: 'detail',type: 'input'}
                ],
                columns: [
                    {label: 'oid', code: 'oid', hidden: true},
                    {label: '修改人', code: 'updateUser', width: 160},
                    {label: '修改时间', code: 'updateDate', width: 160,sortable:true},
                    {label: '区域', code: 'area', width: 160},
                    {label: '服务名称', code: 'category', width: 220},
                    {label: '修改内容', code: 'content', width: 240},
                    {label: '详情', code: 'detail', align:"left"}
                    ],
                buttons: [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export'},
                    ],
            }
        },
        methods: {
            /**
             * 刷新
             */
            refresh(){
                this.$refs.mainQueryGrid.refresh();
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>