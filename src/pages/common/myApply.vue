<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="我的申请"
                        data-url="/bpm/pro/myApply"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :operationsWidth=100
                        ref="grid">
        </ice-query-grid>
        <!--<ice-grid-layout :columns="4" gutter="20px">-->

        <!--</ice-grid-layout>-->
    </div>
</template>


<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'myApply',
        data() {
            return {
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'afStatus',
                        value: '1',
                        tablist: [
                            {label: '全部', value: 'all'},
                            {label: '运行中', value: '1', hiddenColumns: ['afStatus']},
                            {label: '已完成', value: '2', hiddenColumns: ['afStatus']},
                            {label: '驳回', value: '3', hiddenColumns: ['afStatus']}
                        ]
                    },
                    {type: 'input', label: '单号', code: 'bizInfo'},
                    {type: 'input', label: '流程名称', code: 'bpmDefName'},
                    {type: 'input', label: '当前环节', code: 'currentNodeName'},
                    //{type: 'input', label: '实例标题', code: 'subject'},
                    {type: 'date', label: '发起时间从', code: 'beginTime', value: '', exp: '>=', value: ""},
                    {type: 'date', label: '至', code: 'beginTime', value: '', exp: '<=', value: ""},

                    {type: 'select', label: '流程状态', code: 'afStatus', mapTypeCode: "flow_af_status"}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'formId', hidden: true},
                    {label: '单号', code: 'bizInfo', width: 200, sortable: true, align: 'left', hidden: true},
                    {label: '流程KEY', code: 'actDefKey', hidden: true, width: 110},
                    {label: '流程名称', code: 'bpmDefName', sortable: true, align: 'left'},
                    {label: '当前环节', code: 'currentNodeName', sortable: true, align: 'left'},
                    // {label: '标题', code: 'subject'},
                    {label: '发起时间', code: 'beginTime', width: 200, sortable: true},
                    {label: '结束时间', code: 'endTime', width: 200, sortable: true},
                    //{label: '业务描述', code: 'bizInfo', hidden: true, width: 120},
                    {
                        label: '状态',
                        code: 'afStatus',
                        width: 80,
                        mapTypeCode: "flow_af_status",
                        sortable: true,
                        align: 'left'
                    }],
                operations: [
                    {
                        name: '查看', callback: this.showItem, dbclick: true, isShow: _ => {
                            return this.query[0].value != 3
                        }
                    },
                    {
                        name: '处理', callback: this.showItem, isShow: _ => {
                            return this.query[0].value == 3
                        }
                    },
                ]
            }
        },
        methods: {
            export(item) {
                this.$router.push("/bpm/")
            },
            showItem(item) {
                this.$router.push(item.formId);
            },
            deleteItem() {
                this.$router.push("/bpm/")
            },
            $refresh() {
                this.$refs.grid.refresh();
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
