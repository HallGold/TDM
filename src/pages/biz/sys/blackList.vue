<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="数字黑名单"
                        data-url="/biz/BlacklistAf/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>

    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'blackList',
        data() {
            return {
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: 'afStatus',
                        value: 'all',//[-1:草稿,1:运行中,2:已完成,3驳回]
                        tablist: [{label: '全部', value: 'all'},
                            {label: '草稿', value: '-1', hiddenColumns: ['afStatus']},
                            {label: '运行中', value: '1', hiddenColumns: ['afStatus']},
                            {label: '驳回', value: '3', hiddenColumns: ['afStatus']},
                            {label: '已完成', value: '2', hiddenColumns: ['afStatus']}
                        ]
                    },
                    {type: 'input', label: '发布人', code: 'afUserName',exp:"upperLike",value:""},
                    {type: 'input', label: '发布部门', code: 'afDepartmentName',value:""},
                    {type: 'date', label: '发布日期从', code: 'afDate', value: '', exp: '>=',value:""},
                    {type: 'date', label: '至', code: 'afDate', value: '', exp: '<=',value:""},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '发布人', code: 'afUserName', width: 140,sortable: true},
                    //{label: '发起周期', code: 'season', width: 140,sortable:true},
                    {label: '发布部门', code: 'afDepartmentName', width: 140,sortable:true},
                    {label: '发布日期', code: 'afDate', width: 180,sortable:true},
                    //{label: '接收单位', code: 'responseDept',sortable:true},
                    {label: '备注', code: 'remark'},
                    {label: '状态', code: 'afStatus',mapTypeCode: "flow_af_status", width: 80,sortable:true}],
                operations: [
                    {
                        name: '详情', callback: (row) => {
                            this.$router.push("/biz/sys/blackListAf?dataId="+row.oid)
                        }
                    }
                ],
                buttons: [/*{name: '新增',code:"BXZ",icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.$router.push("/biz/sys/blackListAf")
                    }}*/]
            }
        },
        methods: {
            editAcl(row,index) {
                this.dialogVisible = true;
            },
            addItem() {
                this.dialogVisible = true;
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
