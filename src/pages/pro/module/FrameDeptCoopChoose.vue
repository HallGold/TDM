<template>
    <div style="background-color: white;height: calc(100%);">
        <div style="width: 100%;">
            <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="组织机构" name="org">
                    <ice-tree style="height: 500px;width: 100%;"
                              ref="treeOrg"
                              :lazy="false"
                              :showTreeCheckbox="true"
                              labelProp="deptName"
                              valueProp="deptCode"
                              :check-strictly="checkStrictly"
                              load-url="/permission/frame_org/load_all_tree?loadDisabled=false"
                              @node-check="nodeCheck"
                    >
                    </ice-tree>
                </el-tab-pane>
                <el-tab-pane label="合作单位" name="unit">
                    <ice-query-grid
                            ref="gridUnit"
                            data-url="/pro/ProBaseCoopUnit/list"
                            :query="unitquery"
                            :columns="unitcolumns"
                            :pagination=true
                            style="width: 100%"
                            :minHeight="510"
                            choose-item="multiple"
                            @selection-change="handleSelectionChange">
                    </ice-query-grid>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-row style="text-align: center;clear: both;">
            <el-button @click="selectCannel">取消</el-button>
            <el-button type="primary" @click="selectConfirm">确定选择</el-button>
        </el-row>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import common from '@/utils/common.js';
    import IceTree from "../../../components/common/base/IceTree";

    export default {
        name: "FrameDeptCoopChoose",
        components: {IceTree, IceQueryGrid},
        props: {
            checkStrictly: {
                type: Boolean,
                default: true
            }
        },
        data() {
            let nunitColumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '客户单位名称', code: 'unitname', width: 190},
                {label: '分类', code: 'unitType', mapTypeCode: "PRO_UNIT_TYPE"},
                {label: '单位代码', code: 'unitcode', hidden: true}];

            return {
                activeName: 'org',
                unitquery: common.toQuery(nunitColumns),
                unitcolumns: nunitColumns,
                treeSelects: [],
                gridSelect: []

            }
        },
        methods: {
            nodeCheck(changeNode, nodeStatus) {
                this.treeSelects = [];
                this.$refs.treeOrg.getCheckedNodes().forEach(item => {
                    this.treeSelects.push({
                        code: item.deptCode,
                        name: item.deptName,
                        deptId: item.oid
                    });
                })
            },
            handleSelectionChange(selections) {
                this.gridSelect = [];
                selections.forEach(item => {
                    this.gridSelect.push({
                        code: item.oid,
                        name: item.unitname,
                        deptId: item.oid
                    });
                })
            },
            selectConfirm() {
                let result = {
                    treeSelects: [...this.treeSelects],
                    gridSelect: [...this.gridSelect]
                };
                if (result.treeSelects.length == 0 && result.gridSelect.length == 0) {
                    this.$message.error("请选择");
                    return;
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