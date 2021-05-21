<template>
    <div class="content-filled">
        <ice-query-grid
                ref="iceGrid"
                data-url="/biz/BizSoftwareAuditInstallAf/listByLoginUser"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AppcationDetails from "./AppcationDetails"
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import ApplicationClassifySelector from "./ApplicationClassifySelector";
    export default {
        name: "AppcationInstallManger",
        components: {ApplicationClassifySelector, IceImageUploader, IceQueryGrid,AppcationDetails},
        data(){
            return{
                query:[
                    {type: 'input', label: '软件名称', code: 'softName', value: ''}
                ],
                columns:[
                    {code:"oid",hidden:true},
                    {label: '申请单号', code: 'afNo', width: 200},
                    {label: '软件名称', code: 'softName', width: 130},
                    {label: '软件版本', code: 'softVersion', width: 130},
                    {label: '申请人', code: 'afUserName', hidden:true},
                    {label: '状态', code: 'afStatus', width: 100,renderCell(h, data){
                            return (data.row.afStatus==-1?"草稿":(data.row.afStatus==1?"运行中":(data.row.afStatus==2?"已完成":(data.row.afStatus==3?"驳回":""))))}},
                    {label: '申请时间', code: 'afDate', width: 150},
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
                    {name: '返回软件中心', icon: 'el-icon-back', type: 'primary', callback: this.rollBack}
                ],
                levels: [{
                    value: 'SHARE',
                    label: '白名单'
                }, {
                    value: 'AUTH',
                    label: '授权专用'
                }, {
                    value: 'MAINTAIN',
                    label: '运维专用'
                }]
            }
        },
        methods:{
            rollBack(){
                this.$router.push("/biz/software/applicationrepertory");
            },
            lookItem(row){
                this.$router.push("/biz/software/applicationinstall?dataId="+row.oid);
            },
            updataItem(row){
                this.$router.push("/biz/software/applicationinstall?dataId="+row.oid);
            },
            deleteItem(row){
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/BizSoftwareAuditInstallAf/del",{"params":{"id":row.oid}}).then(success=>{
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.refresh();
                    }).catch(error=>{
                        this.$message.error("删除出错了")
                    })
                });
                /*alert("根据状态来判断，当状态为草稿时可以删除");*/
            }
        }
    }
</script>

<style scoped>
    .avatar-uploader{
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;
    }
</style>