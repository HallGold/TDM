<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-query-grid title="服务目录联合查询"
                            data-url="/pro/ProScBizTech/list"
                            :query="query"
                            :columns="columns"
                            :operationsWidth=100
                            ref="mainQueryGrid"
                            :buttons="buttons">
            </ice-query-grid>
        </div>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';

    export default {
        name: "ProScBizCatalogUnionQuery",
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '区域', code: 'areaName', width: 155,sortable:true},
                {label: '业务服务名称', code: 'bizCategoryName', width: 130,sortable:true},
                {label: '业务服务项', code: 'bizCatalogName', width: 130,sortable:true},
                {label: '技术服务大类', code: 'techBigCategoryName', width: 130,sortable:true},
                {label: '技术服务分类', code: 'techCategoryName', width: 130,sortable:true},
                {label: '技术服务项', code: 'techCatalogName', width: 120,sortable:true},
                {label: '贡献值', code: 'score', width: 100,sortable:true,sortable:true},
                {label: '难度系数', code: 'difficuty', width: 100,sortable:true,sortable:true},
                {label: '担当岗位', code: 'role', width: 120,sortable:true},
                ]
            return {
                query: common.toQuery(ncolumns),
                columns: ncolumns,
                buttons: [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export'},
                    ],
            }
        },
        methods: {
            refresh(){
                this.$refs.mainQueryGrid.refresh();
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>