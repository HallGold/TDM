<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="任务池"
                        data-url="/bpm/proTaskUser/myTask"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <!--<ice-grid-layout :columns="4" gutter="20px">-->

        <!--</ice-grid-layout>-->
    </div>
</template>


<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'taskPool',
        data() {
            return {
                query: [
                    {type: 'static', code: 'groupTask',value:1},
                    {type: 'static', code: 'status',value:0},
                    {type: 'input', label: '任务名称', code: 'taskName'},
                    {type: 'input', label: '流程名称', code: 'actDefName'},
                  /*  {type: 'date', label: '开始时间', code: 'beginTime'},
                    {type: 'date', label: '结束时间', code: 'endTime'},*/
                    {type: 'input', label: '节点名称', code: 'nodeName'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: 'bizInfo', code: 'bizInfo',hidden:true, width: 200},
                    {label: '流程名称', code: 'actDefName', width: 300, formatter(row) {
                            if(row.bizInfo){
                                return row.actDefName+'-单号:'+row.bizInfo;
                            }
                            return row.actDefName;
                        },sortable: true,align:'left'
                    },
                    {label: '节点名称', code: 'nodeName', width: 110,sortable: true,align:'left'},
                    {label: '任务名称', code: 'taskName', width: 250,sortable: true,align:'left'},
                    {label: '流程创建人', code: 'proCreaterName', width: 100,sortable: true,align:'left'},
                    {label: '开始时间', code: 'beginTime', width: 150,sortable: true},
                    //{label: '结束时间', code: 'endTime', width: 120},
                    ],
                operations: [
                    {name: '领取', callback: this.goGet},
                    {name: '查看', callback: this.showItem,dbclick: true}
                ],
                buttons: []
            }
        },
        methods: {
            export(item) {
                this.$router.push("/bpm/")
            },
            showItem(item) {
                this.$router.push(item.formId);
            },
            goGet(item) {
                this.$confirm('确定领取该任务吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get('/bpm/pro/singleClaim', {params: {taskUserIds: item.oid}}).then(result => {
                        this.$message.success("领取成功");
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
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
