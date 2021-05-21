<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/Cpk/list"
                exportTitle="产品库"
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
                        <el-form-item label="产品名称" label-width="100px" prop="cpName">
                            <el-input v-model="formModel.cpName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编码" label-width="100px" prop="cpCode">
                            <el-input v-model="formModel.cpCode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="材料" label-width="100px" prop="cpCl">
                            <el-input v-model="formModel.cpCl"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="规格" label-width="100px" prop="cpGg">
                            <el-input v-model="formModel.cpGg"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"></ice-select>
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
            <ice-excel-uploader service="excelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
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
                    cpCode: '',
                    cpName: '',
                    cpCl: '',
                    cpGg: '',
                    projectValue: '',
                    dataSecretLevcode: '',
                    dateRemark: ''
                },
                projectData: [],
                query: [
                    {type: 'input', code: 'cpCode', label: '项目编号'},
                    {type: 'input', code: 'cpName', label: '项目名称'},
                    {type: 'input', code: 'cpCl', label: '材料'},
                    {type: 'input', code: 'cpGg', label: '规格'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'dateRemark', hidden: true},
                    {label: '产品名称', code: 'cpName', width: 100, sortable: true},
                    {label: '编号', code: 'cpCode', width: 100, sortable: true},
                    {label: '材料', code: 'cpCl', width: 120, sortable: true},
                    {label: '规格', code: 'cpGg', width: 140, sortable: true},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100, sortable: true},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '导入', icon: 'el-icon-upload2', type: 'primary', ctrlCode: "BDR", callback: this.importExcel},
                    // {name: '导出', ctrlCode: "BDC", type: 'export'},
                ],
                rules: {
                    cpName: [
                        {required: true, whitespace: true, message: '请输入产品名称', trigger: 'blur'}
                    ],
                    cpCode: [
                        {required: true, whitespace: true, message: '请输入编码', trigger: 'blur'}
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
                        this.$axios.post("/pms/Cpk/saveOrUpdate", this.formModel)
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
                    this.$axios.delete("/pms/Cpk/del", {params: {id: row.oid}})
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
    /**
     * select选择弹出搜索页，数据返回
     * 编辑页面tab标签页编辑数据
     * grid工具栏 添加下拉框搜索
     *
     * 页面竖着排两个grid
     * 后台字典数据获取
     * */

</script>


<style scoped>

</style>