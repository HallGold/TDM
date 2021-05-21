<template>
    <div class="ice-container">
        <ice-query-grid data-url="/permission/work_position_type/list"
                        :pagination="false"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    export default {
        name: "reportFormsDetails",
        components: {IceQueryGrid},
        data(){
            return{
                query:[
                    {type: 'input', label: '报告表单名称', code: 'name', value: ''},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '操作类型', code: 'name', width: 120},
                    {label: '报告表单名称', code: 'name', width: 120},
                    {label: '报告表单ID', code: 'name', width: 120},
                    {label: '下载附件名称', code: 'name', width: 120},
                    {label: '下载附件ID', code: 'name', width: 120},
                    {label: '操作用户名称', code: 'name', width: 120},
                    {label: '操作用户CODE', code: 'name', width: 120},
                    {label: '报告表单年度信息', code: 'name', width: 120},
                    {label: '报告表单季度信息', code: 'name', width: 120},
                    {label: '报告表单月度信息', code: 'name', width: 120},
                ],
                operations:[
                    {name: '删除', callback: this.deleteItem}
                ]
            }
        },
        methods:{
            /**删除*/
            deleteItem(){
                this.$confirm("确定要删除吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>