<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="流程任务监控"
                        data-url="/bpm/proTaskUser/all"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <!--<ice-grid-layouts :columns="4" gutter="20px">-->

        <!--</ice-grid-layouts>-->
    </div>
</template>


<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'ProcessTaskMonitor',
        data() {
            return {
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'status',
                        value: '0',
                        tablist: [{label: '全部', value: 'all'},{label: '未处理', value: '0'}, {label: '已处理', value: '1'}]
                    },
                    {type: 'input', label: '流程名称', code: 'actDefName', value: ''},
                    {type: 'input', label: '任务名称', code: 'taskName', value: ''},
                    {type: 'input', label: '处理人', code: 'assignerName', value: ''},
                    //{type: 'input', label: '拥有人', code: 'ownerName'},
                   // {type: 'date', label: '开始时间', code: 'beginTime'},
                   // {type: 'date', label: '结束时间', code: 'endTime'},
                    {type: 'date', label: '开始时间从', code: 'beginTime', value: '', exp: '>=', max: 'weeks:1'},
                    {type: 'date', label: '至', code: 'beginTime', value: '', exp: '<=', max: 'weeks:1'},

                    {type: 'input', label: '业务单号', code: 'bizInfo', value: ''},

                    {type: 'input', label: '节点名称', code: 'nodeName', value: ''}
                ],
                columns: [
                    {label: '流程名称', code: 'actDefName', width: 150,sortable: true,align:'left'},
                    {label: '任务名称', code: 'taskName', width: 230,sortable: true,align:'left'},
                    {label: '节点名称', code: 'nodeName', width: 100,align:'left'},
                    {label: '业务单号', code: 'bizInfo', width: 130,sortable: true,align:'left'},
                    {label: '处理人', code: 'assignerName', width: 100,sortable: true,align:'left'},
                    {label: '流程创建人', code: 'proCreaterName', width: 100,sortable: true,align:'left'},
                    {label: '是否授权', code: 'authorized', width: 90,mapTypeCode:"YES_NO"},
                    {label: '群组任务', code: 'groupTask', width:100,mapTypeCode:"YES_NO"},
                    {label: '上个操作类型', code: 'inOperateType', width: 110},
                    //{label: '拥有人', code: 'ownerName', width: 130},
                    {label: '状态', code: 'status', width: 80,mapTypeCode:"TODO"},
                    {label: '开始时间', code: 'beginTime', width: 140,sortable: true},
                    {label: '结束时间', code: 'endTime', width: 140,sortable: true},



                    //{label: '节点ID', code: 'nodeId', width: 100},

                    ],
                operations: [
                    {name: '查看', callback: this.showItem},
                    {name: '删除', callback: this.deleteItem, isShow: function (row){
                            if (row.nodeType == "单签多人"&&row.status==0) {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                buttons: [/*{name: '删除', icon: 'el-icon-plus', type: 'primary', callback: this.deleteItem},*/
                    {name: '导出', icon: 'el-icon-plus', type: 'export'}]
            }
        },
        methods: {
            export(item) {
                this.$router.push("/bpm/")
            },
            showItem(item) {
                if (item.formId.indexOf("?") == -1) {
                    item.formId = item.formId + "?";
                }
                //this.$router.push(item.formId + "&taskUserId=" + item.oid );
                this.$openFlow(item.formId)
            },
            deleteItem(row) {

                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get('/bpm/proTaskUser/del', {params: {oid: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
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
