<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/biz/BizSoftwareAuditPutAf/listByLoginUser"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "ApplicationIntoDepotManger",
        components: {IceQueryGrid},
        data(){
            return{
                query: [
                    {type: 'input', label: '申请单号', code: 'afNo', value: ''},
                    {type: 'input', label: '软件名称', code: 'softName', value: ''},
                    {type: 'select', label: '状态', code: 'afStatus', mapTypeCode: "flow_af_status"},
                    {type: 'date', label: '申请时间从', code: 'afDate', exp: '>='},
                    {type: 'date', label: '申请时间至', code: 'afDate', exp: '<='}
                ],
                columns:[
                    {code:"oid",hidden:true},
                    {label: '申请单号', code: 'afNo', width: 200},
                    {label: '软件名称', code: 'softName', width: 300,align:'left'},
                    {label: '申请原因', code: 'afReason', width: 300,align:'left'},
                    {label: '申请人', code: 'afUserName', width: 100},
                    {label: '明细数量', code: 'afDetailLen', hidden:true},
                    {label: '状态', code: 'afStatus', width: 100,renderCell(h, data){
                            return (data.row.afStatus==-1?"草稿":(data.row.afStatus==1?"运行中":(data.row.afStatus==2?"已完成":(data.row.afStatus==3?"驳回":""))))}},
                    {label: '申请时间', code: 'afDate', sortable: true, width: 150},
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
                if (row.afDetailLen > 1) {
                    this.$router.push("/biz/software/appcationintodepotmore?dataId=" + row.oid);
                    return;
                }
                this.$router.push("/biz/software/ApplicationIntoDepot?dataId=" + row.oid);
            },
            /**编辑*/
            updataItem(row){
                if (row.afDetailLen > 1) {
                    this.$router.push("/biz/software/appcationintodepotmore?dataId=" + row.oid);
                    return;
                }
                this.$router.push("/biz/software/ApplicationIntoDepot?dataId=" + row.oid);
            },
            /**删除*/
            deleteItem(row){
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/BizSoftwareAuditPutAf/del",{"params":{"id":row.oid}}).then(success=>{
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