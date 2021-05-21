<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-query-grid title="全局变量配置"
                        data-url="/datamanage/TsysCfgGlobalvar/list?sta=1"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <!--编辑-->
        <el-dialog v-dialogDrag title="全局变量维护" custom-class="ice-dialog" center :visible.sync="dialogSaveVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="saveForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="变量编码:" label-width="100px" prop="globalVarCode">
                                <el-input placeholder="变量编码" v-model="mainDataForm.globalVarCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="变量名称:" label-width="100px" prop="globalVarName">
                                <el-input placeholder="变量名称" v-model="mainDataForm.globalVarName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="变量类型:" label-width="100px" prop="globalVarType">
                                <ice-select placeholder="变量类型" map-type-code="globalFieldType" v-model="mainDataForm.globalVarType">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="变量描述:" label-width="100px" prop="globalVarDesc">
                                <el-input placeholder="变量描述" v-model="mainDataForm.globalVarDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="saveDialog">保存</el-button>
                    <el-button type="info" @click="closeDialog">返回</el-button>
                </div>

            </div>
        </el-dialog>

    </div>
</template>

<script>

    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceSelect from '../../../../components/common/base/IceSelect'

    export default {
        name: "TsysCfgGlobalvar",
        data(){
            return{
                query: [{type: 'input', label: '变量编码', code: 'globalVarCode'},
                    {type: 'input', label: '变量名称', code: 'globalVarName'},
                    {type: 'select', label: '变量类型', code: 'globalVarType', mapTypeCode:  "globalFieldType"}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '变量编码', code: 'globalVarCode', width: 190},
                    {label: '变量名称', code: 'globalVarName', width: 190},
                    {label: '变量类型', code: 'globalVarType', width: 190, mapTypeCode:  "globalFieldType"},
                    {label: '变量描述', code: 'globalVarDesc', width: 190}],
                operations:[{name: '修改', callback: this.updateCallback},{
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
                buttons:[{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback }],

                dialogSaveVisible:false,
                mainDataForm:{oid:"",globalVarCode:"",globalVarName:"",globalVarType:"",globalVarDesc:""},
                formRules: {
                    globalVarCode: [{required: true, message: '请输入变量编码', trigger: 'blur'}],
                    globalVarName: [{required: true, message: '请输入变量名称', trigger: 'blur'}],
                    globalVarType: [{required: true, message: '请输入变量类型', trigger: 'blur'}],
                },
            }
        },
        methods:{
            addCallback(){
                this.mainDataForm ={oid:"",globalVarCode:"",globalVarName:"",globalVarType:"",globalVarDesc:""};
                this.dialogSaveVisible = true;
            },
            closeDialog(){
                this.dialogSaveVisible = false;
            },
            saveDialog(){
                this.$refs['saveForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/datamanage/TsysCfgGlobalvar/saveOrUpdate", this.mainDataForm)
                        .then(result => {
                            this.$message.success("保存成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.closeDialog();
                        }).catch(error => {
                        this.$message.error(error.data.msg)
                    });
                });
            },
            updateCallback(row){
                this.mainDataForm = row;
                this.dialogSaveVisible = true;
            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysCfgGlobalvar/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    });
            }
        },
        components: {IceQueryGrid,IceSelect}
    }
</script>

<style scoped>

</style>