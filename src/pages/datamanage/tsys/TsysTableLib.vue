<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-query-grid title="库表管理"
                        data-url="/datamanage/TsysTableLib/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <!-- 库表字段查看 -->
        <el-dialog v-dialogDrag title="库表字段查看" custom-class="ice-dialog" center :visible.sync="viewFieldDialogVisible"
                   width="960px" append-to-body :close-on-click-modal="false">
            <ice-query-grid title="库表字段查看"
                            :data-url="viewFieldUrl"
                            :query="viewFieldQuery"
                            :columns="viewFieldColumns"
                            ref="fieldQueryGrid"
                            :pagination=false
                            :operationsWidth=60
                            :operations="fieldOperations">
            </ice-query-grid>
        </el-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {Loading} from 'element-ui';

    export default {
        name: "TsysTableLib",
        data (){
            return{
                query: [{type: 'input', label: '数据库编码', code: 'dbCode'},
                    {type: 'input', label: '表名', code: 'tableCode'},
                    {type: 'input', label: '中文名称', code: 'tableName'},
                    {type: 'input', label: '描述', code: 'tableDesc'},
                    {type: 'select', label: '授权模式', code: 'permMode', mapTypeCode:  "perm_mode"},
                    {type: 'select', label: '表类型', code: 'tableType', mapTypeCode:  "table_type"},
                    {type: 'select', label: '表分类', code: 'tableCls', mapTypeCode:  "table_cls"}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: '数据库编码', code: 'dbCode', width: 190},
                    {label: '数据表名', code: 'tableCode', width: 190},
                    {label: '数据表中文名称', code: 'tableName', width: 190},
                    {label: '表类型', code: 'tableType', width: 100, mapTypeCode:  "table_type"},
                    {label: '表分类', code: 'tableCls', width: 100, mapTypeCode:  "table_cls"},
                    {label: '授权模式', code: 'permMode', width: 100, mapTypeCode:  "perm_mode"},
                    {label: '数据表版本号', code: 'tableVer', width: 100},
                    {label: '是否删除', code: 'deleteStatus', width: 100,renderCell(h, data){ return data.row.deleteStatus==0?"否":"是"}},
                    {label: '数据表描述', code: 'tableDesc', width: 190}],
                operations:[{
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
                },{name: "查看字段", callback: this.viewFieldCallback}],
                buttons:[{name: '数据库同步', icon: 'el-icon-plus', type: 'primary', callback: this.syncCallback }],

                /*表字段查看*/
                viewFieldDialogVisible:false,
                viewFieldUrl:"",
                viewFieldQuery:[
                    {type: 'input', label: '字段编码', code: 'columnCode'},
                    {type: 'input', label: '字段名称', code: 'columnName'},
                    {type: 'input', label: '数据类型', code: 'datatype'},
                    {type: 'select', label: '字段分类', code: 'columnCls',mapTypeCode:"globalFieldType"},
                    {type: 'select', label: '数据类型', code: 'columnType',mapTypeCode:"globalVarType"}],
                viewFieldColumns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '字段编码', code: 'columnCode', width: 140},
                    {label: '字段名称', code: 'columnName', width: 140},
                    {label: '数据类型', code: 'datatype', width: 140},
                    {label: '字段长度', code: 'columnLength', width: 140},
                    {label: '字段分类', code: 'columnCls', width: 140,mapTypeCode:"globalFieldType"},
                    {label: '字段类型', code: 'columnType', width: 140,mapTypeCode:"globalVarType"}
                ],
                fieldOperations:[{
                    name: '停用', callback: this.deleteFieldBtn, isShow: function (row) {
                        if (row.deleteStatus == 0) {
                            return true;
                        }
                        return false;
                    }
                },{
                    name: '启用', callback: this.deleteFieldBtn, isShow: function (row) {
                        if (row.deleteStatus == null || row.deleteStatus == 1) {
                            return true;
                        }
                        return false;
                    }
                }]
            }
        },
        methods:{
            syncCallback(){
                let loadingInstance  = Loading.service({ fullscreen: true ,text:"系统同步中,请稍等。"});
                this.$axios.get("/datamanage/TsysTableLib/syncDB",{"params":{}}).then(success=>{
                    loadingInstance.close();
                    this.$refs.mainQueryGrid.refresh();
                    this.$message.success("同步成功");
                }).catch(error=>{
                    loadingInstance.close();
                    this.$message.error("出错了");
                });
            },
            viewFieldCallback(row){
                this.viewFieldUrl = "/datamanage/TsysFieldLib/list?tableId="+row.oid;
                this.viewFieldDialogVisible = true;
            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysTableLib/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    });
            },
            deleteFieldBtn(row){
                this.$axios.delete("/datamanage/TsysFieldLib/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.fieldQueryGrid.refresh();
                        this.closeDialog();
                    });
            },
        },
        components: {IceQueryGrid,Loading}
    }
</script>

<style lang="less" scoped>

</style>
