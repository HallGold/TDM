<!--策略库管理-->
<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-query-grid title="策略库管理"
                        data-url="/datamanage/TsysLibDatapolicy/list?sta=1"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid">
        </ice-query-grid>

        <!--字段反向隔离选择-->
        <el-dialog v-dialogDrag title="表达式维护" custom-class="ice-dialog" center :visible.sync="condexprDialogVisible"
                   width="1200px" append-to-body :close-on-click-modal="false">
            <tsys-lib-condexpr :datapolicyId="datapolicyId" :closePage.sync="condexprDialogVisible"></tsys-lib-condexpr>
        </el-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import TsysLibCondexpr from "./TsysLibCondexpr";

    export default {
        name: "TsysLibDatapolicy",
        data(){
            return {
                query: [],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '策略编码', code: 'datapolicyCode', width: 290},
                    {label: '策略名称', code: 'datapolicyName', width: 190},
                    {label: '策略分类', code: 'datapolicyClass', width: 100},
                    {label: '合并方式', code: 'datapolicyOperator', width: 100,renderCell(h, data){ return "("+data.row.datapolicyOperator+")"+(data.row.datapolicyOperator==1?"OR":"AND")}},
                    {label: '优先级', code: 'datapolicyPirority', width: 100,renderCell(h, data){ return "("+data.row.datapolicyPirority+")"+(data.row.datapolicyPirority==10?"一般":(data.row.datapolicyPirority==20?"强制":"系统强制"))}},
                    /*{label: '条件表达式', code: 'expr', width: 100}*/],
                operations:[{name: "查看表达式", callback: this.viewExprCallback},{
                    name: '停用', callback: this.deleteBtn, isShow: function (row) {
                        if (row.deleteStatus == 0) {
                            return true;
                        }
                        return false;
                    }
                },{
                    name: '启用', callback: this.deleteBtn, isShow: function (row) {
                        if (row.deleteStatus == null || row.deleteStatus == 1) {
                            return true;
                        }
                        return false;
                    }
                }],

                condexprDialogVisible:false,
                datapolicyId:""
            }
        },
        methods:{
            viewExprCallback(row){
                console.log(row)
                this.datapolicyId = row.oid;
                this.condexprDialogVisible = true;
            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysLibDatapolicy/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    });
            }
        },
        components: {IceQueryGrid,TsysLibCondexpr}
    }
</script>

<style scoped>

</style>