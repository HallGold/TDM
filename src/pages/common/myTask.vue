<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="我的待办"
                        data-url="/bpm/proTaskUser/myTask"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :operationsWidth=50
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
    </div>
</template>


<script>

    import IceQueryGrid from '../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'myTask',
        data() {
            return {
                buttons: [],
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'status',
                        value: '0',
                        tablist: [
                            {label: '全部', value: 'all', hiddenColumns: ['userName','createUser','createDate']},
                            {label: '未处理', value: '0', hiddenColumns: ['beginTime','endTime']},
                            {label: '已处理', value: '1', hiddenColumns: ['userName','createUser','createDate']}
                        ]
                    },
                    {type: 'static', label: '任务名称', code: 'groupTask', exp: "!=", value: 1},
                    //{type: 'input', label: '单号', code: 'bizInfo'},
                    {type: 'input', label: '任务名称', code: 'taskName',value:''},
                    {type: 'input', label: '流程名称', code: 'actDefName',value:''},
                    {type: 'input', label: '节点名称', code: 'nodeName',value:''}
                ],
                columns: [
                    {label: 'bizInfo', code: 'bizInfo', hidden: true, width: 200},
                    {
                        label: '流程节点名称', code: 'actDefName', width: 200, align: "left",formatter(row) {
                            // if (row.bizInfo) {
                            //     return row.actDefName + '-单号:' + row.bizInfo;
                            // }
                            return row.actDefName+"-"+row.nodeName;
                        },sortable: true
                    },
                    {label: '任务名称', code: 'taskName',sortable: true,align:'left'},
                    // {label: '节点名称', code: 'nodeName', width: 150},
                    //{label: '开始时间', code: 'beginTime', width: 170},
                    {label: '上一环节处理人', code: 'userName', width: 120,sortable: true,align:'left'},
                    {label: '上一环节处理时间', code: 'createDate', width: 140,sortable: true},
                    {label: '流程发起时间', code: 'actStartTime', width: 140,sortable: true},
                    {label: '任务结束时间', code: 'endTime', width: 140,sortable: true},
                    {
                        label: '状态', code: 'status', width: 50, formatter(row) {
                            return row['status'] == '1' ? '已处理' : '未处理'
                        },sortable: true
                    }
                ],
                operations: [
                    {
                        name: '处理', callback: this.showItem, isShow: function (row) {
                            if (row.status == '0') {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '查看',dbclick: true, callback: this.showItem, isShow: function (row) {
                            if (row.status == '1') {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                storageListener: evt => {
                    if (evt && evt.key == "refresh.myTask") {
                        this.$refresh();
                    }
                }
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
                this.$router.push(this.$routerCheckPush(item.assignerId, item.formId + "&taskUserId=" + item.oid + "&$fromPage=myTask"));
            },
            deleteItem() {
                this.$router.push("/bpm/")
            },
            $refresh() {
                this.$refs.grid.refresh();
            }
        },
        mounted() {
            window.addEventListener("storage", this.storageListener)
        },
        beforeDestroy() {
            window.removeEventListener("storage", this.storageListener)
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>

<style scoped>

</style>
