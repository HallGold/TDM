<!--生产计划-->
<template>
    <div class="ice-container">
        <el-button type="primary" size="mini" style="width: 60px" @click="addItem" :disabled="disabledAdd">新增</el-button>
        <el-table stripe
                  highlight-current-row
                  height="100%"
                  @current-change="handleCurrentChange"
                  :data="tableData" style="width: 100%;">
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="scJhcode" label="计划编号"></el-table-column>
            <el-table-column prop="scJhname" label="计划名称"></el-table-column>
            <el-table-column prop="scJhlxName" label="计划类型" width="140"></el-table-column>
            <el-table-column prop="jhztName" label="计划状态"></el-table-column>
            <el-table-column prop="dataSecretLevcodeName" label="密集"></el-table-column>
            <el-table-column fixed="right" label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="del(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ice-dialog title="生产计划编辑" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="计划名称" label-width="110px" prop="scJhname">
                            <el-input v-model="formModel.scJhname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划编号" label-width="110px" prop="scJhcode">
                            <el-input v-model="formModel.scJhcode"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划类型" label-width="110px" prop="scJhlx">
                            <ice-select v-model="formModel.scJhlx" map-type-code="JHLX"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划状态" label-width="110px" prop="jhzt">
                            <ice-select v-model="formModel.jhzt" map-type-code="JHZT"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"></ice-select>
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
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    export default {
        components: {IceSelect, IceDialog, IceQueryGrid, IceSingleUpload},
        data() {
            return {
                tableData: [],
                visible: false,
                loading: false,
                disabledAdd: true,

                DATA_DICT_JHLX: [],
                DATA_DICT_JHZT: [],
                DATA_DICT_DATASECRET: [],

                formModel: {
                    oid: '',
                    oidXm: '',
                    scJhname: '',
                    scJhcode: '',
                    scJhlx: '',
                    jhzt: '',
                    dataSecretLevcode: '2',
                    dateRemark: '',
                },
            }
        },
        methods: {

            loadTableData () {
                if(this.oidXm){
                    this.$axios.get("/pms/PmsScJh/listByOidXm", {params: {oidXm: this.oidXm}})
                        .then(result => {
                            this.tableData = result.data;
                            this.tableData.map(o => {
                                this.DATA_DICT_JHLX.map(d => {
                                    if (o.scJhlx == d.code) {
                                        o.scJhlxName = d.name;
                                    }
                                });
                                this.DATA_DICT_JHZT.map(d => {
                                    if (o.jhzt == d.code) {
                                        o.jhztName = d.name;
                                    }
                                });
                                this.DATA_DICT_DATASECRET.map(d => {
                                    if (o.dataSecretLevcode == d.code) {
                                        o.dataSecretLevcodeName = d.name;
                                    }
                                });
                            })
                        })
                        .catch(error => {
                            this.$message.error("查询生产计划失败")
                        })
                        .finally(_ => {

                        })
                }else{
                    this.tableData = [];
                }
            },

            confirm() {
                this.formModel.oidXm = this.oidXm;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsScJh/saveOrUpdate", this.formModel)
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
                    this.$axios.delete("/pms/PmsScJh/del", {params: {id: row.oid}})
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
            oidXm () {
                if(this.oidXm){
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
        created () {
            this.$axios.get("permission/dataDictionary/listByActType?typeCodes=JHLX,JHZT,DATA_SECRET_LEVEL")
                .then(result => {
                    result.data.map(o => {
                        if (o.code == 'JHLX') {
                            this.DATA_DICT_JHLX = o.appDataList;
                        }else if (o.code == 'JHZT') {
                            this.DATA_DICT_JHZT = o.appDataList;
                        }else if (o.code == 'DATA_SECRET_LEVEL') {
                            this.DATA_DICT_DATASECRET = o.appDataList;
                        }
                    })
                })
                .catch(error => {
                    this.$message.error("查询字典数据失败")
                })
        },
        props: [
            'oidXm'
        ]
    }

    /**
     * ice-query-grid
     * ice-gird
     * el-table字典翻译
     */
</script>

<style scoped>

</style>