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
        name: "flowOperationDetails",
        components: {IceQueryGrid},
        data(){
            return{
                query:[
                    {type: 'input', label: '环节名称', code: 'name'},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '流程ID', code: 'name', width: 120},
                    {label: '环节名称', code: 'name', width: 120},
                    {label: '环节CODE', code: 'name', width: 120},
                    {label: '开始时间', code: 'name', width: 120},
                    {label: '预计结束时间', code: 'name', width: 120},
                    {label: '实际结束时间', code: 'name', width: 120},
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
                    /*this.$axios.delete("url").then(success=>{
                        this.$message.success("删除成功")
                    }).catch(error=>{
                        this.$message({
                            type:'error',
                            message:error.msg
                        })
                    })*/
                })
            }
        }
    }
</script>

<style scoped>

</style>