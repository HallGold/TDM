<template>
    <div>
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="组织机构" name="org">
                <ice-query-grid
                        ref="gridOrg"
                        data-url="/permission/frame_org/load_table_next_children?deptCode=90&hasSelf=true&loadDisabled=false"
                        :query="orgquery"
                        :columns="orgcolumns"
                        :pagination=false
                        choose-item="single">
                </ice-query-grid>
            </el-tab-pane>
            <el-tab-pane label="客户单位" name="unit">
                <ice-query-grid
                        ref="gridUnit"
                        data-url="/pro/ProBaseCustUnit/list"
                        :query="unitquery"
                        :columns="unitcolumns"
                        :pagination=true
                        choose-item="single">
                </ice-query-grid>
            </el-tab-pane>
        </el-tabs>
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
        name: "FrameOrgCustChoose",
        components: {IceQueryGrid},
        data() {
            let norgColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: 'deptCode', code: 'deptCode', hidden: true},
                {label: '部门名称', code: 'deptName', width: 190},
                {label: '部门简称', code: 'deptShortName', width: 100}];

            let nunitColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '客户单位名称', code: 'unitname', width: 190},
                {label: '分类', code: 'unitType', width: 180, mapTypeCode: "PRO_UNIT_TYPE"},
                {label: '组织代码', code: 'unitcode', width: 100}];

            return {
                traceData: {},
                activeName: 'org',
                orgquery: common.toQuery(norgColumns),
                orgcolumns: norgColumns,
                unitquery: common.toQuery(nunitColumns),
                unitcolumns: nunitColumns

            }
        },
        methods: {
            selectConfirm() {
                let result = {
                    type: this.activeName
                };
                if (this.activeName == 'org') {
                    let rows = this.$refs.gridOrg.getSelections();
                    if (rows.length == 0) {
                        this.$message.error("请选择");
                        return;
                    }
                    result['oid'] = rows[0].oid;
                    result['code'] = rows[0].deptCode;
                    result['name'] = rows[0].deptName;
                }
                if (this.activeName == 'unit') {
                    let rows = this.$refs.gridUnit.getSelections();
                    if (rows.length == 0) {
                        this.$message.error("请选择");
                        return;
                    }
                    result['oid'] = rows[0].oid;
                    result['code'] = rows[0].unitcode;
                    result['name'] = rows[0].unitname;
                }
                this.$emit("select-confirm", result);
            },
            selectCannel() {
                this.$emit("select-cannel");
            }
        }
    }
</script>

<style scoped>

</style>