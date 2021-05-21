<!--生产批次-->
<template>
    <div class="ice-container">
        <el-button type="primary" size="mini" style="width: 60px" @click="addItem" :disabled="disabledAdd">新增</el-button>
        <el-table stripe
                  highlight-current-row
                  height="100%"
                  @current-change="handleCurrentChange"
                  :data="tableData" style="width: 100%">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="jhpc" label="组次"></el-table-column>
            <el-table-column prop="jhsl" label="数量"></el-table-column>
            <el-table-column prop="jhsl" label="单位"></el-table-column>
            <el-table-column prop="jhdateQt" label="齐套时间"></el-table-column>
            <el-table-column prop="jhdateJf" label="交付时间"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ice-dialog title="组次编辑" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="组次" label-width="110px" prop="jhpc">
                            <el-input v-model="formModel.jhpc"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" label-width="110px" prop="jhsl">
                            <el-input v-model="formModel.jhsl" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="齐套时间" label-width="110px" prop="jhdateQt">
                            <ice-date-picker v-model="formModel.jhdateQt"></ice-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交付时间" label-width="110px" prop="jhdateJf">
                            <ice-date-picker v-model="formModel.jhdateJf"></ice-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
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
    </div>

</template>

<script>

    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDialog from "../../../components/common/base/IceDialog";
    export default {
        components: {IceDialog, IceDatePicker, IceSingleUpload},
        data() {
            return {
                tableData: [],
                visible: false,
                loading: false,
                disabledAdd: true,

                formModel: {
                    oid: '',
                    oidScjh: '',
                    jhpc: '',
                    jhsl: '',
                    jhdateQt: '',
                    jhdateJf: '',
                    dataSecretLevcode: '2',
                    dateRemark: '',
                },
            }
        },
        methods: {

            loadTableData () {
                if(this.oidScjh){
                    this.$axios.get("/pms/JhPsc/listByOidScjh", {params: {oidScjh: this.oidScjh}})
                        .then(result => {
                            this.tableData = result.data;
                            this.tableData.map(o => {
                                o.jhdateQt = o.jhdateQt.substring(0,10);
                                o.jhdateJf = o.jhdateJf.substring(0,10);
                            })
                        })
                        .catch(error => {
                            this.$message.error("查询生产计划批次失败")
                        })
                        .finally(_ => {

                        })
                }else{
                    this.tableData = [];
                }
            },

            confirm() {
                this.formModel.oidScjh = this.oidScjh;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPsc/saveOrUpdate", this.formModel)
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
                    this.$axios.delete("/pms/JhPsc/del", {params: {id: row.oid}})
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
        }
        ,
        computed: {}
        ,
        watch: {
            oidScjh () {
                if(this.oidScjh){
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
            'oidScjh'
        ]
    }

</script>

<style scoped>

</style>