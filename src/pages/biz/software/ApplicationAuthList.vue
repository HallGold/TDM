<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/biz/BizSoftwareAuthAf/list"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "ApplicationAuthList",
        components: {IceQueryGrid},
        data(){
            return{
                query: [
                    {type: 'input', label: '申请单号', code: 'afNo', value: ''},
                    {type: 'input', label: '代申请人', code: 'consignorName', value: ''},
                    {type: 'input', label: '用户列表', code: 'userName', value: ''},
                    {type: 'input', label: '软件列表', code: 'softName', value: ''},
                    {type: 'input', label: '反馈信息', code: 'feedback', value: ''},
                    {type: 'date', label: '授权起始时间', code: 'authDateStart', exp: '>='},
                    {type: 'date', label: '授权结束时间', code: 'authDateEnd', exp: '<='},
                    {type: 'select', label: '状态', code: 'afStatus', exp: '', mapTypeCode: 'flow_af_status'},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '申请单号', code: 'afNo', width: 170, sortable: true},
                    {label: '代申请人', code: 'consignorName', width: 100, sortable: true},
                    {label: '授权起始时间', code: 'authDateStart', sortable: true, width: 150},
                    {label: '授权结束时间', code: 'authDateEnd', sortable: true, width: 150},
                    {label: '用户列表', code: 'userName', width: 200, sortable: true},
                    {label: '软件列表', code: 'softName', width: 200, sortable: true},
                    {label: '状态', code: 'afStatus', width: 100, mapTypeCode: 'flow_af_status', sortable: true},
                    {label: '反馈信息', code: 'feedback', width: 100, sortable: true},
                ],
                operations:[
                    {name: '查看', callback: this.lookItem,isShow: function (row) {
                            if (row.afStatus == -1) {
                                return false;
                            }
                            return true;
                        },dbclick:true},
                    {
                        name: '编辑', callback: this.updataItem, isShow: function (row) {
                            if (row.afStatus == -1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '删除', callback: this.deleteItem, isShow: function (row) {
                            if (row.afStatus == -1) {
                                return true;
                            }
                            return false;
                        }
                    },
                ],
                buttons:[
                    {name: '返回软件资源库', icon: 'el-icon-back', type: 'primary', callback: this.rollBack}
                ]
            }
        },
        methods:{
            rollBack(){
                this.$router.push("/biz/software/applicationhouse");
            },
            /**查看*/
            lookItem(row){
                this.$router.push("/biz/software/ApplicationAuth?dataId="+row.oid);
            },
            /**编辑*/
            updataItem(row){
                this.$router.push("/biz/software/ApplicationAuth?dataId="+row.oid);
            },
            /**删除*/
            deleteItem(row){
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/BizSoftwareAuditOptAf/del",{"params":{"id":row.oid}}).then(success=>{
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.refresh();
                    }).catch(error=>{
                        this.$message.error("删除出错了")
                    })
                });
            },
        }
    }
</script>

<style scoped>

</style>