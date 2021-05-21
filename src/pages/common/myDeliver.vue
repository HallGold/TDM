<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="我的抄送"
                        data-url="/bpm/ProDeliver/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
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
        name: 'myDeliver',
        data() {
            return {
                query: [
                    {
                        type: 'tab',
                        label: '类型',
                        code: 'type',
                        value: '1',
                        tablist: [{label: '抄送给我', value: '1'}
                            , {label: '我的抄送', value: '0'}]
                    },
                    {type: 'input', label: '流程名称', code: 'actDefName',value:''},
                    {type: 'input', label: '环节名称', code: 'nodeName',value:''},
                    {type: 'input', label: '抄送人', code: 'operaterName',value:''},
                    {type: 'input', label: '接收人', code: 'toUserName',value:''}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'formId', hidden: true},
                    {label: '流程名称', code: 'actDefName', width: 180,sortable: true,align:'left'},
                    {label: '环节名称', code: 'nodeName', width: 110,sortable: true,align:'left'},
                    {label: '抄送人', code: 'operaterName', width: 130,sortable: true,align:'left'},
                    {label: '接收人', code: 'toUserName', width: 130,sortable: true,align:'left'},
                    {label: '抄送时间', code: 'operateTime', width: 135,sortable: true},
                    {label: '任务描述', code: 'taskName', width: 250,align:'left'},
                    ],
                operations: [
                    {name: '查看', callback: this.showItem,dbclick: true}
                ]
            }
        },
        methods: {
            export(item) {
                this.$router.push("/bpm/")
            },
            showItem(item) {
                // debugger
                this.$openFlow(item.formId);
                // this.$router.push(item.formId);
            },
            deleteItem() {
                this.$router.push("/bpm/")
            },
            $refresh(){
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
