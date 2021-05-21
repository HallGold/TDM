<template>
    <el-tabs v-model="permTabActive" type="card" @tab-click="permTabActiveHandleClick">
        <el-tab-pane label="字段隔离选择" name="permSelectTab">
            <div class="grid-container">
                <ice-query-grid
                                :data-url="'/datamanage/TsysFieldLib/getNPermFds?roleId='+this.roleId+'&tableId='+this.tableId"
                                :query="queryNPermFd"
                                :columns="columnsNPermFd"
                                choose-item="multiple"
                                :pagination=false
                                ref="queryGridNPermFd">
                </ice-query-grid>
                <el-row style="text-align: center;">
                    <el-button @click="selectCannelNPermFd">取消</el-button>
                    <el-button type="primary" @click="selectConfirmNPermFd">确定隔离</el-button>
                </el-row>
            </div>
        </el-tab-pane>
        <el-tab-pane label="已隔离字段" name="permHasTab">
            <div class="grid-container">
                <ice-query-grid
                        :data-url="'/datamanage/TsysFieldPerm/list?roleId='+this.roleId+'&tableId='+this.tableId"
                        :query="queryHPermFd"
                        :columns="columnsHPermFd"
                        choose-item="multiple"
                        :pagination=false
                        :operations="hoperations"
                        ref="queryGridHPermFd">
                </ice-query-grid>
                <el-row style="text-align: center;">
                    <el-button @click="selectCannelNPermFd">取消</el-button>
                    <el-button type="primary" @click="selectConfirmHPermFd">取消隔离限制</el-button>
                </el-row>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "TsysDateRoleFieldPerm",
        props:{
            tableId:String,
            roleId:String,
            closePage:Boolean
        },
        data(){
            return {
                permTabActive:"permSelectTab",
                /*字段隔离选择*/
                queryNPermFd:[{type: 'input', label: '表字段编码', code: 'columnCode'},
                    {type: 'input', label: '表字段名称', code: 'columnName'},
                    {type: 'select', label: '字段分类', code: 'columnCls',mapTypeCode:"globalFieldType"},
                    {type: 'select', label: '数据类型', code: 'columnType',mapTypeCode:"globalVarType"}],
                columnsNPermFd:[ {label: 'oid', code: 'oid', hidden:true},
                    {label: '表字段编码', code: 'columnCode', width: 190},
                    {label: '表字段名称', code: 'columnName', width: 190},
                    {label: '字段分类', code: 'columnCls', width: 100,mapTypeCode:"globalFieldType"},
                    {label: '字段类型', code: 'columnType', width: 140,mapTypeCode:"globalVarType"}],

                /*已隔离字段*/
                queryHPermFd:[{type: 'input', label: '表字段编码', code: 'columnCode'},
                    {type: 'input', label: '表字段名称', code: 'columnName'},
                    {type: 'select', label: '字段分类', code: 'columnCls',mapTypeCode:"globalFieldType"},
                    {type: 'select', label: '数据类型', code: 'columnType',mapTypeCode:"globalVarType"}],
                columnsHPermFd:[ {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '表字段编码', code: 'columnCode', width: 190},
                    {label: '表字段名称', code: 'columnName', width: 190},
                    {label: '字段分类', code: 'columnCls', width: 100,mapTypeCode:"globalFieldType"},
                    {label: '字段类型', code: 'columnType', width: 140,mapTypeCode:"globalVarType"},
                    {label: '授权人', code: 'createUser', width: 100}],
                hoperations:[]
            }
        },
        methods:{
            permTabActiveHandleClick(tab, event){
                if(tab.name == "permSelectTab"){
                    this.$refs.queryGridNPermFd.refresh();
                }else{
                    this.$refs.queryGridHPermFd.refresh();
                }
            },
            /*字段隔离选择*/
            selectConfirmNPermFd(){
                let rows = this.$refs.queryGridNPermFd.getSelections();
                if(rows.length == 0){
                    this.$message.error("请选择隔离字段。");
                    return;
                }
                let datas = [];
                for(let i=0;i<rows.length;i++){
                    datas.push({columnId:rows[i].oid,dataroleId:this.roleId,deleteStatus:0});
                }
                this.$confirm('确定隔离选中的字段吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.post("/datamanage/TsysFieldPerm/saveList",{"list":datas}).then(success=>{
                        this.$message.success("操作成功");
                        this.$refs.queryGridNPermFd.refresh();
                    }).catch(error=>{
                        this.$message.error("出错了")
                    });
                });

            },
            selectConfirmHPermFd(){
                let rows = this.$refs.queryGridHPermFd.getSelections();
                if(rows.length == 0){
                    this.$message.error("请选择取消隔离限制的字段。");
                    return;
                }
                let ids = [];
                rows.forEach(item =>{
                    ids.push(item.oid);
                })
                this.$axios.delete("/datamanage/TsysFieldPerm/del", {params:{"id":JSON.stringify(ids).replace(/\[|\]|"/g,"")}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.queryGridHPermFd.refresh();
                    });

            },
            selectCannelNPermFd(){
                this.$emit('update:closePage', false);
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>