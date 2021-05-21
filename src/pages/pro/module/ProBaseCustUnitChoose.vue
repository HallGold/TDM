<template>
    <div class="grid-container">
        <!-- 主表格 -->
        <ice-query-grid 　data-url="/pro/ProBaseCustUnit/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :pagination=true
                        ref="gridRef"
                        :choose-item="chooseItem">
        </ice-query-grid>

        <el-row style="text-align: center;">
            <el-button @click="selectCannel">取消</el-button>
            <el-button type="primary" @click="selectConfirm">确定选择</el-button>
        </el-row>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';

    export default {
        name: "ProBaseCustUnitChoose",
        props: {
            chooseItem: String
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '客户单位名称', code: 'unitname', width: 190},
                {label: '分类', code: 'unitType', width: 180, mapTypeCode: "PRO_UNIT_TYPE"},
                {label: '组织代码', code: 'unitcode', width: 100}];

            return {
                query: common.toQuery(ncolumns),
                columns: ncolumns,
            }
        },
        methods: {
            selectConfirm() {
                let rows = this.$refs.gridRef.getSelections();
                if (rows.length == 0) {
                    this.$message.error("请选择客户单位。");
                    return;
                }
                this.$emit("select-confirm", rows);
            },
            selectCannel() {
                this.$emit("select-cannel");
            }
        },
        mounted() {
            this.$refs.gridRef.refresh();
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>