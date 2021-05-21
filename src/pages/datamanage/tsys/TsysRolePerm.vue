<template>
    <div class="grid-container">
        <!-- 主表格 -->
        <ice-query-grid title="数据用户管理"
                    data-url="/datamanage/TsysRolePerm/list"
                    :query="query"
                    :columns="columns"
                    :buttons="buttons"
                        ref="mainQueryGrid"
                    :operationsWidth=260
                    :operations="operations">
        </ice-query-grid>

        <!--查看权限-->
        <!--:pagination=false-->
        <tsys-role-perm-table ref="permTableRef" mode="dialog"></tsys-role-perm-table>

        <el-dialog
                title="查看接口代码"
                :visible.sync="dialogVisible"
                width="50%">
            <div style="height: 60vh;overflow-y: scroll;border: solid 1px #c7c5c5;background-color: #f1f1f1;"><pre>{{dialogText}}</pre></div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="授权角色管理"
                :visible.sync="dialogRoleMrgVisible"
                width="60%">
            <ice-query-grid title="已拥有的角色权限"
                            :data-url="'/datamanage/TsysRolePerm/roleList?type=user&code='+selectUserCode"
                            :query="[]"
                            :columns="roleMrgColumns"
                            :operationsWidth=100
                            ref="roleMrgQueryGrid"
                            :pagination="false"
                            :operations="roleMrgOperations">
            </ice-query-grid>
        </el-dialog>

   </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import TsysRolePermTable from "./TsysRolePermTable";

    export default {
        name: "TsysRolePerm",
        data (){
            return{
                query: [{type: 'input',label: '用户编码', code: 'USER_CODE', width: 190}],
                columns: [
                    {label: '用户编码', code: 'USER_CODE', width: 190},
                    {label: '已拥有角色数量', code: 'ROLE_COUNT'}
                ],
                operations:[{name: "授权角色管理", callback: this.roleMgrCallback},
                    {name: "查看数据权限", callback: this.viewDataCallback},
                    {name: "查看接口代码", callback: this.viewInterfaceDataCallback}],
                buttons:[],

                dialogVisible:false,
                dialogText:"",

                dialogRoleMrgVisible:false,
                selectUserCode:"",
                roleMrgColumns:[
                    {label: 'OID', code: 'OID',hidden:true},
                    {label: '用户编码', code: 'USER_CODE', width: 120},
                    {label: '授权角色编码', code: 'DATAROLE_CODE', width: 120},
                    {label: '授权角色名称', code: 'DATAROLE_NAME', width: 120},
                    {label: '授权人', code: 'CREATE_USER_', width: 120},
                    {label: '授权时间', code: 'CREATE_DATE_', width: 190}],
                roleMrgOperations:[{name: "取消授权", callback: this.deleteCallback}]
            }
        },
        methods:{
            viewDataCallback(row){
                this.$refs.permTableRef.open(row.USER_CODE);
            },
            viewInterfaceDataCallback(row){
                this.$axios.get("/datamanage/TsysRolePerm/userPerm",{"params":{userCode:row.USER_CODE}}).then(success=>{
                    console.log(success.data)
                    this.dialogText = JSON.stringify(success.data,null, 4);
                    this.dialogVisible = true;
                }).catch(error=>{
                    this.$message.error("出错啦")
                });
            },
            roleMgrCallback(row){
                this.selectUserCode = row["USER_CODE"];
                this.dialogRoleMrgVisible = true;
            },
            deleteCallback(row){
                this.$confirm('确定取消授权吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.delete("/datamanage/TsysRolePerm/del", {params:{"id":row["OID"]}})
                        .then(result => {
                            this.$message.success("取消授权成功");
                            this.$refs.roleMrgQueryGrid.refresh();
                            this.closeDialog();
                        })
                });
            },
            closeDialog(){
                this.$refs.mainQueryGrid.refresh();
                this.dialogRoleMrgVisible = false;
            }
        },
        components: {IceQueryGrid,TsysRolePermTable}
    }

</script>

<style scoped>
    .grid-container{width: 100%;}
</style>