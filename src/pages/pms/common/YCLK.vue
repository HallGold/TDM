<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/Yclk/list"
                exportTitle="原材料库"
                :operations-width="200"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                ref="grid">
        </ice-query-grid>
        <ice-dialog title="产品库编辑" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="名称" label-width="100px" prop="clkName">
                            <el-input v-model="formModel.clkName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格" label-width="100px" prop="clkGg">
                            <el-input v-model="formModel.clkGg"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品批号" label-width="100px" prop="clkClph">
                            <el-input v-model="formModel.clkClph"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="单位重量" label-width="100px" prop="clkDwzl">
                            <el-input v-model="formModel.clkDwzl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="质量情况" label-width="100px" prop="clkZlqk">
                            <el-input v-model="formModel.clkZlqk"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="进库日期" label-width="100px" prop="clkRkDate">
                            <el-date-picker v-model="formModel.clkRkDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="dateRemark">
                            <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model="formModel.dateRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader service="yclkExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";

    export default {
        components: {IceExcelUploader, IceSelect, IceDialog, IceQueryGrid},
        data() {
            return {
                loading: false,
                visible: false,
                visibleImport: false,
                formModel: {
                    oid: '',
                    clkName: '',
                    clkGg: '',
                    clkClph: '',
                    clkDwzl: '',
                    clkZlqk: '',
                    clkRkDate: '',
                    dataSecretLevcode: '',
                    dateRemark: '',
                },
                query: [
                    {type: 'input', code: 'clkName', label: '名称'},
                    {type: 'input', code: 'clkGg', label: '规格'},
                    {type: 'input', code: 'clkClph', label: '产品批号'},
                    {type: 'date', code: 'clkRkDate', label: '进库日期', exp: '='},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '名称', code: 'clkName', width: 160},
                    {label: '规格', code: 'clkGg', width: 140},
                    {label: '产品批号', code: 'clkClph', width: 120, sortable: true},
                    {label: '单位重量', code: 'clkDwzl', width: 120},
                    {label: '质量情况', code: 'clkZlqk', width: 200},
                    {label: '进库日期', code: 'clkRkDate', width: 120, sortable: true, formatter(row) {
                        return moment(row.clkRkDate).format('YYYY-MM-DD');
                    }},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                    {label: '备注', code: 'dateRemark', width: 200},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '导入', icon: 'el-icon-upload2', type: 'primary', ctrlCode: "BDR", callback: this.importExcel},
                    // {name: '导出', ctrlCode: "BDC", type: 'export'},
                ],
                rules: {
                    clkName: [
                        {required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    clkGg: [
                        {required: true, whitespace: true, message: '请输入规格', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC"},
                ]
            }
        },
        methods: {
            addItem() {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                })
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/Yclk/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                            })
                    }
                })

            },
            edit(row) {
                this.visible = true;

                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                })
            }
            ,
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/Yclk/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },
            importExcel() {
                this.visibleImport = true;
            },
        }
        ,
        computed: {}
        ,
        watch: {}
        ,
        mounted() {

        }
        ,
    }
</script>


<style scoped>

</style>