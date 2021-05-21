<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-query-grid title="全局字段配置"
                        data-url="/datamanage/TsysCfgGlobalfield/list?sta=1"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>

        <!--编辑-->
        <el-dialog v-dialogDrag title="全局字段维护" custom-class="ice-dialog" center :visible.sync="dialogSaveVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="saveForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="字段编码:" label-width="100px" prop="commfieldCfgCode">
                                <el-input placeholder="字段配置编码" v-model="mainDataForm.commfieldCfgCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段名称:" label-width="100px" prop="commfieldCfgName">
                                <el-input placeholder="字段配置名称" v-model="mainDataForm.commfieldCfgName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="默认字段名:" label-width="100px" prop="defaultTblcolCode">
                                <el-input placeholder="默认表字段名" v-model="mainDataForm.defaultTblcolCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字段分类:" label-width="100px" prop="commfieldCfgType">
                                <ice-select placeholder="字段配置分类" map-type-code="globalVarType" v-model="mainDataForm.commfieldCfgType">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="字段描述:" label-width="100px" prop="commfieldCfgDesc">
                                <el-input placeholder="字段配置描述"
                                          v-model="mainDataForm.commfieldCfgDesc"
                                          type="textarea" :rows="4"></el-input>
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
                query: [{type: 'input', label: '字段配置编码', code: 'commfieldCfgCode'},
                    {type: 'input', label: '字段配置名称', code: 'commfieldCfgName'},
                    {type: 'select', label: '字段配置分类', code: 'commfieldCfgType', mapTypeCode:  "globalVarType"}],
                columns: [
                    {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '字段配置编码', code: 'commfieldCfgCode', width: 190},
                    {label: '字段配置名称', code: 'commfieldCfgName', width: 190},
                    {label: '默认表字段名', code: 'defaultTblcolCode', width: 190},
                    {label: '字段配置分类', code: 'commfieldCfgType', width: 190, mapTypeCode:  "globalVarType"},
                    {label: '字段配置描述', code: 'commfieldCfgDesc', width: 190}
                    ],
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
                mainDataForm:{},
                formRules: {
                    commfieldCfgCode: [{required: true, message: '请输入字段编码', trigger: 'blur'}],
                    commfieldCfgName: [{required: true, message: '请输入字段名称', trigger: 'blur'}],
                    defaultTblcolCode: [{required: true, message: '请输入默认字段名', trigger: 'blur'}],
                    commfieldCfgType: [{required: true, message: '请输入字段配置分类', trigger: 'blur'}]
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
                    this.$axios.post("/datamanage/TsysCfgGlobalfield/saveOrUpdate", this.mainDataForm)
                        .then(result => {
                            this.$message.success("保存成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.closeDialog();
                        })
                });
            },
            updateCallback(row){
                this.mainDataForm = row;
                this.dialogSaveVisible = true;
            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysCfgGlobalfield/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    }).catch(error => {
                    this.$message.error(error.data.msg)
                });
            }
        },
        components: {IceQueryGrid,IceSelect}
    }
</script>

<style scoped>

</style>
