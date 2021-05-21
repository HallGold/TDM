<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" id="$gridwrapper$">
        <ice-query-grid title="岗位人员维护"
                        data-url="/permission/work_position/list"
                        :pagination="false"
                        :query="queryWork"
                        :columns="columnsWork"
                        :chooseItem="choose"
                        ref="grid"
                        :operationsWidth="90"
                        :operations="operationsWork"
                        :buttons="buttonsWork"></ice-query-grid>
        <work-position-person-selector ref="personMaint"></work-position-person-selector>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import WorkPositionPersonSelector from "./WorkPositionPersonSelector";
    import {Loading} from 'element-ui';

    export default {
        name: "WorkPositionWorkManger",
        components: {WorkPositionPersonSelector, IcePersionSelector, IceDialog, IceQueryGrid},
        props: {
            choose: String
        },
        data() {
            return {
                queryWork: [
                    {type: 'input', label: '岗位名称', code: 'name', value: ''},
                    {type: 'input', label: '岗位编码', code: 'code', value: ''},
                ],
                columnsWork: [
                    {code: "oid", hidden: true},
                    {label: '岗位名称', code: 'name', width: 200,sortable: true,align:'left'},
                    {label: '岗位编码', code: 'code', width: 150,sortable: true,align:'left'},
                    {label: '描述', code: 'desp', width: 300, showTips:true, align:"left"},
                    {label: '备注', code: 'remark', showTips:true, align:"left"},
                    {label: '排序', code: 'sequencing', width: 100},
                ],
                operationsWork: [
                    // {name: '选人', callback: this.chooseItem},
                    // {name: '查看', callback: this.lookItem},
                    {name: '人员维护', callback: this.personalMaint}
                ],
                buttonsWork: [],
                title: ''
            }
        },
        methods: {
            personalMaint(row) {
                this.$refs.personMaint.openDialog(row);
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .look {
        margin: 0;
        padding: 0;
    }
</style>
