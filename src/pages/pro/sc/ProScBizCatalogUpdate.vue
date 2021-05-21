<template>
    <div style="width: 100%;height: 100%;background: white">
        <el-tabs v-model="activeName" type="card" class="full-content">
            <el-tab-pane label="业务服务目录操作记录" name="first" style="width: 100%;height: 100%;">
                <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
                    <ice-query-grid exportTitle="业务服务目录修改记录"
                                    data-url="/pro/ProScBizCatalogHistory/list"
                                    :query="query"
                                    :columns="columns"
                                    :operationsWidth=200
                                    ref="mainQueryGrid"
                                    :buttons="buttons">
                    </ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="技术服务目录操作记录" name="second" style="width: 100%;height: 100%">
                <pro-sc-tech-catalog-options-log style="width: 100%;height: 100%"></pro-sc-tech-catalog-options-log>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import ProScTechCatalogOptionsLog from "./ProScTechCatalogOptionsLog";

    export default {
        name: "ProScBizCatalogUpdate",
        data() {
            return {
                query: [
                    {label: '修改人', code: 'updateUser',type: 'input',value:'' },
                    {label: '区域', code: 'area',type: 'input' ,value:''},
                    {label: '服务名称', code: 'category', type: 'input',value:''},
                    {label: '修改内容', code: 'content', type: 'input',value:''},
                    {label: '详情', code: 'detail',type: 'input',value:''},
                    {label: '修改时间', code: 'updateDate',type: 'date',value:'' },
                ],
                columns: [
                    {label: 'oid', code: 'oid', hidden: true},
                    {label: '修改人', code: 'updateUser', width: 120,sortable:true},
                    {label: '修改时间', code: 'updateDate', width: 150,sortable:true},
                    {label: '区域', code: 'area', width: 200},
                    {label: '服务名称', code: 'category', width: 200},
                    {label: '修改内容', code: 'content', width: 300},
                    {label: '详情', code: 'detail', width: 100,align:'left'}
                    ],
                buttons: [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export'},
                    ],
                activeName: 'first',
            }
        },
        methods:{
            /**
             * 刷新
             */
            refresh(){
                this.$refs.mainQueryGrid.refresh();
            }
        },
        components: {ProScTechCatalogOptionsLog, IceQueryGrid}
    }
</script>

<style scoped>

</style>