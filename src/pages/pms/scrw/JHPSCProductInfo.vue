<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/JhPscCp/list"
                exportTitle="产品要求"
                :operations-width="150"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                ref="grid">
            <slot name="grid-bar-button-group" slot="operation-bar-expand"></slot>
        </ice-query-grid>

        <ice-dialog :title="!formModel.oid?'新增产品要求':'修改产品要求'" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="批次" label-width="100px" prop="oidPjh">
                            <el-select v-model="formModel.oidPjh" filterable @change="getJhpc(formModel.oidPjh)">
                                <el-option
                                        v-for="item in this.jhpcData"
                                        :key="item.oid"
                                        :label="item.jhpc"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="产品名称" label-width="100px" prop="oidCpk">
                            <el-select v-model="formModel.oidCpk"
                                       filterabl
                                       no-data-text="无数据"
                                       @change="getCpCode(formModel.oidCpk)">
                                <el-option
                                    v-for="item in cpk_data"
                                    :key="item.oid"
                                    :label="item.cpName"
                                    :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编号" label-width="100px" prop="cpCode">
                            <el-input v-model="formModel.cpCode"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="文件编号" label-width="100px" prop="cpfilename">
                            <el-input v-model.trim="formModel.cpfilename"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文件编码" label-width="100px" prop="cpfilecode">
                            <el-input v-model.trim="formModel.cpfilecode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="编写单位" label-width="100px" prop="cpfilebxdw">
                            <el-input v-model.trim="formModel.cpfilebxdw"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编写人" label-width="100px" prop="cpfilebxr">
                            <el-input v-model.trim="formModel.cpfilebxr"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="dateRemark">
                            <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model.trim="formModel.dateRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">保存</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>

        <ice-dialog title="导入" :visible.sync="importVisible" width="500px">
            <ice-excel-uploader service="pscCpExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import moment from 'moment';
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";

    export default {
        name: "JHPSCProductInfo",
        components: {IceSelect, IceDialog, IceQueryGrid},
        props:{
            'oidJh':String,
            'jhpcData':Array,
            'oidPjhList':String,
        },
        data() {
            return {
                loading: false,
                visible: false,
                importVisible:false,
                dataUrl:"",
                cpk_data:[],
                formModel: {
                    oid: '',//计划于产品关联表id
                    oidPjh:'',//计划批次id
                    jhpc: '',//计划批次
                    dataSecretLevcode: '2',//密级
                    oidCpk: '',//产品库id
                    cpName: '',//产品名称
                    cpCode: '',//产品编号
                    cpfilename: '',//文件名称
                    cpfilecode: '',//文件编号
                    cpfilebxdw: '',//编写单位
                    cpfilebxr: '',//编写人
                    dateRemark:''//备注
                },
                query: [
                    {type: 'static', code: 'oidPjh', exp: 'in', value: _ =>{return this.oidPjhList}},
                    {type: 'input', code: 'jhpc', label: '批次'},
                    {type: 'input', code: 'cpName', label: '产品名称'},
                    {type: 'input', code: 'cpCode', label: '产品编号'},
                    {type: 'input', code: 'cpfilename', label: '文件名称'},
                    {type: 'input', code: 'cpfilecode', label: '文件编号'},
                    {type: 'input', code: 'cpfilebxdw', label: '编写单位'},
                    {type: 'input', code: 'cpfilebxr', label: '编写人'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidPjh', hidden: true},
                    {code: 'oidCpk', hidden: true},
                    {label: '批次', code: 'jhpc', width: 150},
                    {label: '产品名称', code: 'cpName', width: 120},
                    {label: '产品编号', code: 'cpCode', width: 120},
                    {label: '文件名称', code: 'cpfilename', width: 120},
                    {label: '文件编号', code: 'cpfilecode', width: 120},
                    {label: '编写单位', code: 'cpfilebxdw', width: 120},
                    {label: '编写人', code: 'cpfilebxr', width: 120},
                    {label: '编写时间', code: 'updateDate', width: 120, formatter(row){
                        return moment(row.updateDate).format('YYYY-MM-DD')
                    }},
                    {label: '密级', code: 'dataSecretLevcode', width: 100, mapTypeCode:'DATA_SECRET_LEVEL'},
                ],
                buttons: [
                    {name: '刷新', icon: 'el-icon-refresh', ctrlCode: "PSC_CP_BSX", type: 'success',callback: this.refreshGrid},
                    {name: '新增', icon: 'el-icon-plus', ctrlCode: "PSC_CP_BXZ", type: 'primary',callback: this.addItem},
                    {name: '导入', icon: 'el-icon-upload2', ctrlCode: "PSC_CP_BDR", type: 'primary',callback: _ => {this.importVisible = true}},
                    // {name: '导出', ctrlCode: "PSC_CP_BDC", type: 'export'},
                ],
                rules: {
                    oidPjh: [
                        {required: true, message: '请选择批次', trigger: 'change'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                    oidCpk: [
                        {required: true, message: '请选择产品', trigger: 'change'}
                    ],
                    cpCode: [
                        {required: true, message: '编号不能为空', trigger: 'blur'}
                    ],
                    cpfilebxdw: [
                        {required: true, message: '请输入编写单位', trigger: 'blur'}
                    ],
                    cpfilebxr: [
                        {required: true, message: '请输入编写人', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "PSC-CP-BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "PSC-CP-BSC"},
                ]
            }
        },
        methods: {
            refreshGrid() {
                this.dataUrl="/pms/JhPscCp/list"
                this.$refs.grid.refresh()
                this.$message.success("刷新成功")
            },
            addItem() {
                let visible = false;
                this.visible = true;

                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                })
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPscCp/saveOrUpdate", this.formModel)
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
                    this.$axios.delete("/pms/JhPscCp/del", {params: {id: row.oid}})
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

            getCpCode(val){
                let index=this.cpk_data.findIndex((value)=>value.oid==val);
                this.formModel.cpCode=this.cpk_data[index].cpCode;
                this.formModel.cpName=this.cpk_data[index].cpName;
            },

            //根据批计划id获取批次
            getJhpc(val){
                let index=this.jhpcData.findIndex((value)=>value.oid==val);
                this.formModel.jhpc=this.jhpcData[index].jhpc;
            },
            //获取产品信息
            getProductInfo(){
                this.$axios.get("/pms/Cpk/queryName")
                    .then(result => {
                        this.cpk_data=result.data;
                    })
                    .catch(error => {
                        this.$message.error("产品获取失败")
                    })
                    .finally(_ => {

                    })
            },

        }
        ,
        computed: {}
        ,
        watch: {
            oidPjhList(val){
                this.oidPjhList=val;
                this.dataUrl="/pms/JhPscCp/list";
                this.$refs.grid.refresh();
            }
        }
        ,
        mounted() {

        }
        ,
        created() {
            this.getProductInfo();
            /*this.query.push({type: 'static', code: 'oidPjh', exp: 'in', value: this.oidPjhList});
            */
        }
    }
</script>

<style scoped>

</style>
