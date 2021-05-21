<template>
    <div class="grid-container">
        <ice-query-grid title="角色数据授权库表管理"
                        :data-url="'/datamanage/TsysTablePerm/list?roid='+this.roid"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=210
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <!-- 弹出层 选择新增的库表 -->
        <el-dialog v-dialogDrag title="新增授权库表" custom-class="ice-dialog" center :visible.sync="dialogTablePermVisible"
                   width="960px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <ice-query-grid title="选择库表授权"
                                 :data-url="dialogTablePermUrl"
                                 queryModel="normal"
                                 choose-item="multiple"
                                 :query="dialogTablePermQuery"
                                 :columns="dialogTablePermColumns"
                                 :columnsNumber=2
                                 ref="tablePermQueryGrid"
                                 style="height: 600px;">
                </ice-query-grid>
                <el-row style="text-align: center;">
                    <el-button @click="dialogTablePermSelectCannel">取消</el-button>
                    <el-button type="primary" @click="dialogTablePermSelectConfirm">确定授权</el-button>
                </el-row>
            </div>
        </el-dialog>

        <!--字段授权：增删改查 维护弹出层-->
        <el-dialog v-dialogDrag title="授权库表权限维护" custom-class="ice-dialog" center :visible.sync="dialogTablePermOperationVisible"
                   width="600px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="tablePermOperationDataForm" :rules="tablePermOperationRules" label-position="right" class="conditon-bar" ref="tablePermOperationForm"
                         style="margin-top: 20px;margin-bottom: 20px;">

                    <el-row :gutter="20">

                        <el-col :span="10">
                            <el-form-item label="查询权限:" label-width="100px" prop="permSelect">
                                <ice-select placeholder="选择权限" map-type-code="isorno" v-model="tablePermOperationDataForm.permSelect">
                                </ice-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="10">
                            <el-form-item label="修改权限:" label-width="100px" prop="permUpdate">
                                <ice-select placeholder="选择权限" map-type-code="isorno" v-model="tablePermOperationDataForm.permUpdate"></ice-select>
                            </el-form-item>
                        </el-col>

                    </el-row>

                    <el-row :gutter="20">

                        <el-col :span="10">
                            <el-form-item label="新增权限:" label-width="100px" prop="permInsert">
                                <ice-select placeholder="选择权限" map-type-code="isorno" v-model="tablePermOperationDataForm.permInsert">
                                </ice-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="10">
                            <el-form-item label="删除权限:" label-width="100px" prop="permDelete">
                                <ice-select placeholder="选择权限" map-type-code="isorno" v-model="tablePermOperationDataForm.permDelete">
                                </ice-select>
                            </el-form-item>
                        </el-col>

                    </el-row>

                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="tablePermOperationSave">保存</el-button>
                    <el-button type="info" @click="tablePermOperationCloseDialog">返回</el-button>
                </div>
            </div>
        </el-dialog>


        <!--字段反向隔离选择-->
        <el-dialog v-dialogDrag title="字段反向隔离维护" custom-class="ice-dialog" center :visible.sync="fieldPermDialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <tsys-date-role-field-perm :tableId="tableId" :roleId="roid" :closePage.sync="fieldPermDialogVisible"></tsys-date-role-field-perm>
        </el-dialog>


            <tsys-tbl-datapolicy ref="tblDatapolicyRef" :tblPermId="tblPermId" :tableCode="tableCode" :tableName="tableName" :tableId="tableId"></tsys-tbl-datapolicy>
            <!--<tsys-date-role-field-perm :tableId="tableId" :roleId="roid" :closePage.sync="tblDatapolicyDialogVisible">
            </tsys-date-role-field-perm>-->


    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from '../../../components/common/base/IceSelect';
    import TsysDateRoleFieldPerm from "./TsysDateRoleFieldPerm";
    import TsysTblDatapolicy from  "./TsysTblDatapolicy";

    export default {
        name: "TsysDataRoleTablePerm",
        props:{
            roid:String
        },
        data(){
            return{
                query:[{type: 'input', label: '数据库编码', code: 'dbCode'},
                    {type: 'input', label: '数据表名', code: 'tableCode'}],
                columns:[ {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '数据库编码', code: 'dbCode', width: 80},
                    {label: '数据表名', code: 'tableCode', width: 190},
                    {label: '数据表中文名称', code: 'tableName', width: 190},
                    {label: '查询权限', code: 'permSelect', width: 68,renderCell(h, data){ return data.row.permSelect==0?"否":"是"}},
                    {label: '修改权限', code: 'permUpdate', width: 68,renderCell(h, data){ return data.row.permUpdate==0?"否":"是"}},
                    {label: '新增权限', code: 'permInsert', width: 68,renderCell(h, data){ return data.row.permInsert==0?"否":"是"}},
                    {label: '删除权限', code: 'permDelete', width: 68,renderCell(h, data){ return data.row.permDelete==0?"否":"是"}}],
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
                },{name: '修改权限', callback: this.updateTablePermOperationCallback},
                    {name: '策略配置', callback: this.datapolicyCallback},{name: '字段隔离', callback: this.fieldPermCallback}],
                buttons:[{name: '新增授权库表', icon: 'el-icon-plus', type: 'primary', callback: this.addTablePermCallback }],

                /****库表授权 START****/
                dialogTablePermVisible:false,
                dialogTablePermUrl:"",
                dialogTablePermQuery:[{type: 'input', label: '数据库编码', code: 'dbCode'},
                    {type: 'input', label: '数据表名', code: 'tableCode'}],
                dialogTablePermColumns:[ {label: 'oid', code: 'oid', hidden:true},
                    {label: '数据库编码', code: 'dbCode', width: 80},
                    {label: '数据表名', code: 'tableCode', width: 190},
                    {label: '数据表中文名称', code: 'tableName', width: 190},
                    {label: '数据表类型', code: 'tableType', width: 80, mapTypeCode:  "table_type"},
                    /*{label: '数据表分类', code: 'tableCls', width: 80, mapTypeCode:  "table_cls"},*/
                    /*{label: '授权模式', code: 'permMode', width: 80, mapTypeCode:  "perm_mode"},*/
                    {label: '数据表描述', code: 'tableDesc', width: 190}],
                /****库表授权 END****/

                /*字段授权：增删改查 维护弹出层*/
                dialogTablePermOperationVisible:false,
                tablePermOperationDataForm:{oid:"",permSelect:"",permUpdate:"",permDelete:"",permInsert:""},
                tablePermOperationRules: {
                    permSelect: [{required: true, message: '请选择查询权限', trigger: 'blur'}],
                    permUpdate: [{required: true, message: '请选择修改权限', trigger: 'blur'}],
                    permDelete: [{required: true, message: '请选择删除权限', trigger: 'blur'}],
                    permInsert: [{required: true, message: '请选择新增权限', trigger: 'blur'}],
                },

                /*字段反向隔离选择*/
                tableId:"",
                fieldPermDialogVisible:false,

                /*数据授权策略*/
                tblPermId:"",tableCode:"",tableName:""
            }
        },
        methods:{
            addTablePermCallback(){
                if(typeof (this.roid) != "string" || this.roid.length == 0){
                    this.$message.error("页面调用错误。")
                    return false;
                }
                this.dialogTablePermVisible = true;
                this.dialogTablePermUrl = "/datamanage/TsysTableLib/role/list?roid="+this.roid;
            },
            dialogTablePermSelectCannel(){
                this.dialogTablePermVisible = false;
            },
            dialogTablePermSelectConfirm(){
                if(typeof (this.roid) != "string" || this.roid.length == 0){
                    this.$message.error("页面调用错误。")
                    return false;
                }
                let rows = this.$refs.tablePermQueryGrid.getSelections();
                if(rows.length == 0){
                    this.$message.error("请选择授权库表。");
                    return;
                }
                let datas = [];
                for(let i=0;i<rows.length;i++){
                    datas.push({"tableId":rows[i]["oid"],"dataroleId":this.roid})
                }
                this.$axios.post("/datamanage/TsysTablePerm/saveList", {"list":datas})
                    .then(result => {
                        this.$message.success("保存成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.dialogTablePermSelectCannel();
                    })
            },
            updateTablePermOperationCallback(row){
                /*this.$refs.tablePermOperationForm.resetField();*/
                this.tablePermOperationDataForm.oid = row.oid;
                this.tablePermOperationDataForm.permDelete = row.permDelete;
                this.tablePermOperationDataForm.permInsert = row.permInsert;
                this.tablePermOperationDataForm.permSelect = row.permSelect;
                this.tablePermOperationDataForm.permUpdate = row.permUpdate;
                this.dialogTablePermOperationVisible = true;
                console.log(this.tablePermOperationDataForm);
            },
            tablePermOperationCloseDialog(){
                this.dialogTablePermOperationVisible = false;
            },
            tablePermOperationSave(){
                this.$refs['tablePermOperationForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/datamanage/TsysTablePerm/update", this.tablePermOperationDataForm)
                        .then(result => {
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.tablePermOperationCloseDialog();
                        })
                });

                this.$refs.tablePermQueryGrid.refresh();
            },
            fieldPermCallback(row){
                this.tableId = row.tableId,
                this.fieldPermDialogVisible = true;
            },
            /*数据授权策略*/
            datapolicyCallback(row){
                this.tblPermId = row.oid;
                this.tableCode = row.tableCode;
                this.tableName = row.tableName;
                this.tableId = row.tableId;
                this.$refs.tblDatapolicyRef.dialogVisible = true;
                this.$nextTick(()=>{
                    this.$refs.tblDatapolicyRef.init();
                })

            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysTablePerm/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    });
            }
        },
        components: {IceQueryGrid,IceSelect,TsysDateRoleFieldPerm,TsysTblDatapolicy}
    }
</script>

<style scoped>

</style>
