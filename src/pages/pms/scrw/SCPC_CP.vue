<!--生产批次产品-->
<template>
    <div class="ice-container">
        <el-button type="primary" size="mini" style="width: 60px" @click="addItem" :disabled="disabledAdd">新增</el-button>
        <el-table stripe
                  highlight-current-row
                  @current-change="handleCurrentChange"
                  :data="tableData">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="cpCode" label="产品编号"></el-table-column>
            <el-table-column prop="cpName" label="产品名称"></el-table-column>
            <el-table-column prop="cpfilecode" label="文件编号"></el-table-column>
            <el-table-column prop="cpfilename" label="文件名称"></el-table-column>
            <el-table-column prop="cpjfsl" label="交付数量"></el-table-column>
            <el-table-column prop="cpbjsl" label="备件数量"></el-table-column>
            <el-table-column prop="cpscsl" label="实际生产数量"></el-table-column>
            <el-table-column prop="dataSecretLevcode" label="密级"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ice-dialog title="批次产品编辑" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-tabs v-model="activeNameBase">
                    <el-tab-pane label="产品基本信息" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="产品编码" label-width="110px" prop="cpCode">
                                    <el-input v-model="formModel.cpCode" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="产品名称" label-width="110px" prop="cpName">
                                    <el-input placeholder="请选择产品" v-model="formModel.cpName" readonly>
                                        <el-button slot="append" icon="el-icon-search" @click="showProductDialog"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="文件编号" label-width="110px" prop="cpfilecode">
                                    <el-input v-model="formModel.cpfilecode" readonly></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="文件名称" label-width="110px" prop="cpfilename">
                                    <el-input v-model="formModel.cpfilename" readonly></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
                <el-tabs v-model="activeNamePlan">
                    <el-tab-pane label="产品计划信息" name="first">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="交付数量" label-width="110px" prop="cpjfsl">
                                    <el-input v-model="formModel.cpjfsl"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="备件数量" label-width="110px" prop="cpbjsl">
                                    <el-input v-model="formModel.cpbjsl"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit v-model="formModel.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="选择产品" :visible.sync="visibleProduct" width="1000px">
            <CP_SELECT @select="selectProduct"></CP_SELECT>
        </ice-dialog>
    </div>
</template>

<script>

    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import CP_SELECT from "../common/CP_SELECT";
    import IceDialog from "../../../components/common/base/IceDialog";
    export default {
        components: {IceDialog, CP_SELECT, IceSingleUpload},
        data() {
            return {
                tableData: [],
                visible: false,
                loading: false,
                visibleProduct: false,
                disabledAdd: true,

                activeNameBase: 'first',
                activeNamePlan: 'first',

                formModel: {
                    oid: '',
                    oidPjh: '',
                    cpCode: '',
                    cpName: '',
                    cpfilecode: '',
                    cpfilename: '',
                    cpjfsl: '',
                    cpbjsl: '',
                    dataSecretLevcode: '2',
                    dateRemark: '',
                },
            }
        },
        methods: {

            loadTableData () {
                if(this.oidPjh){
                    this.$axios.get("/pms/JhPscCp/listByOidPjh", {params: {oidPjh: this.oidPjh}})
                        .then(result => {
                            this.tableData = result.data;
                        })
                        .catch(error => {
                            this.$message.error("查询生产计划批次产品失败")
                        })
                        .finally(_ => {

                        })
                }else{
                    this.tableData = [];
                }
            },

            confirm() {
                this.formModel.oidPjh = this.oidPjh;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPscCp/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.loadTableData();
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

            addItem() {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                })
            },

            edit(row) {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                });
            },

            del(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/JhPscCp/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.loadTableData();
                        })
                        .catch(error => {
                            this.$message.error("删除失败")
                        })
                }).catch(_ => {

                })
            },

            handleCurrentChange (row) {
                this.$emit('select', row)
            },

            showProductDialog () {
                this.visibleProduct = true;
            },

            selectProduct (item) {
                this.formModel.cpCode = item[0].cpCode;
                this.formModel.cpName = item[0].cpName;
                this.visibleProduct = false;
            },
        }
        ,
        computed: {}
        ,
        watch: {
            oidPjh () {
                if(this.oidPjh){
                    this.disabledAdd = false;
                }else{
                    this.disabledAdd = true;
                }
                this.loadTableData();
            }
        }
        ,
        mounted() {

        }
        ,
        props: [
            'oidPjh'
        ]
    }

</script>

<style scoped>

</style>