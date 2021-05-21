<template>
    <div class="ice-container">
        <el-container>
            <ice-query-grid
                    :data-url="dataUrl"
                    exportTitle="基本信息"
                    :operations-width="200"
                    :columns="columns"
                    :buttons="buttons"
                    :query="query"
                    :operations="operations"
                    ref="grid">
                <slot name="grid-bar-button-group" slot="operation-bar-expand"></slot>
            </ice-query-grid>
        </el-container>

        <ice-dialog :title="!formModel.oid?'新增产品要求':'修改产品要求'" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="综合计划" label-width="100px" prop="oidJh">
                            <el-select v-model="this.oidJh"
                                       filterabl>
                                <el-option
                                        v-for="item in jhData"
                                        :key="item.oid"
                                        :label="item.jhname"
                                        :value="item.oid"
                                        :disabled="item.oid==formModel.oidJh?false:true"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="计划批次" label-width="100px" prop="jhpc">
                            <el-input v-model.trim="formModel.jhpc"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" label-width="100px" prop="jhsl">
                            <el-input-number v-model.number.trim="formModel.jhsl" controls-position="right" :min="1"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="齐套时间" label-width="100px" prop="jhdateQt">
                            <el-date-picker v-model="formModel.jhdateQt"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交付时间" label-width="100px" prop="jhdateJf">
                            <el-date-picker v-model="formModel.jhdateJf"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="计划类型" label-width="100px" prop="jhlx">
                            <el-select v-model="formModel.jhlx" filterable placeholder="请选择">
                                <el-option v-for="item in jhlxData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划状态" label-width="100px" prop="jhzt">
                            <ice-select v-model="formModel.jhzt" map-type-code="JHZT" filterable placeholder="请选择">
                            </ice-select>
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
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="上传附件" label-width="100px" prop="dateRemark">
                            <ice-single-upload></ice-single-upload>
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
            <ice-excel-uploader service="pscExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import moment from 'moment';
    import IceSelect from "../../../components/common/base/IceSelect";
    import {isInteger} from"@/pages/biz/js/Validator";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";

    export default {
        name: "JHPSCBaseInfo",
        components: {IceSingleUpload, IceExcelUploader, IceMultipleUpload, IceSelect, IceDialog, IceQueryGrid},
        props:{
            'oidJh':String,
            'jhData':Array,
            'currentJh':Object
        },
        data() {
            return {
                loading: false,
                visible: false,
                importVisible: false,
                dataUrl:'',
                jhname:this.currentJh.jhname,
                jhlxData:[
                    {value:'lx01',label:'计划类型一'},
                    {value:'lx02',label:'计划类型二'},
                    {value:'lx03',label:'计划类型三'},
                ],
                formModel: {
                    oid: '',//批生产质量计划id
                    oidJh:this.oidJh,//综合计划id
                    jhcode:'',//综合计划编码
                    jhname:'',//综合计划名称
                    jhyear:'',//综合计划年份
                    jhpc: '',//计划批次
                    jhsl: '',//计划数量
                    jhdateQt: '',//齐套时间
                    jhdateJf: '',//交付时间
                    jhlx: '',//计划类型
                    jhzt: 'JHZT01',//计划状态，默认值：未开始
                    dataSecretLevcode:'2',//密级：内部
                    dateRemark:''//备注
                },
                query: [
                    {type: 'input', code: 'jhpc', label: '计划批次'},
                    {type: 'date', code: 'jhdateQt', label: '齐套时间', exp: '='},
                    {type: 'date', code: 'jhdateJf', label: '交付时间', exp: '='},
                    {type: 'select', code: 'jhlx', label: '计划类型', exp: '='},
                    {type: 'select', code: 'jhzt', label: '计划状态', mapTypeCode:'JHZT', exp: '='},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级', mapTypeCode: 'DATA_SECRET_LEVEL', exp: '='},
                    {type: 'static', code: 'oidJh', exp: '=', value:_ =>{return this.oidJh}}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidJh', hidden: true},
                    {label: '计划编码', code: 'jhcode', width: 150},
                    {label: '计划名称', code: 'jhname', width: 150},
                    {label: '计划年份', code: 'jhyear', width: 150},
                    {label: '批次', code: 'jhpc', width: 150, sortable: true},
                    {label: '数量', code: 'jhsl', width: 100, sortable: true},
                    {label: '齐套时间', code: 'jhdateQt', width: 120, formatter(row){
                        return moment(row.jhdateQt).format('YYYY-MM-DD')
                    }},
                    {label: '交付时间', code: 'jhdateJf', width: 120, formatter(row){
                        return moment(row.jhdateJf).format('YYYY-MM-DD')
                    }},
                    {label: '计划类型', code: 'jhlx', width: 120},
                    {label: '计划状态', code: 'jhzt', width: 120, mapTypeCode: 'JHZT'},
                    {label: '密级', code: 'dataSecretLevcode', width: 100, mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '编写人', code: 'updateUser', width: 100},
                    {label: '编写时间', code: 'updateDate', width: 100, formatter(row){
                            return moment(row.updateDate).format('YYYY-MM-DD')
                        }},
                    {code: 'dateRemark', hidden: true},
                ],
                buttons: [
                    {name: '刷新', icon: 'el-icon-refresh', ctrlCode: "PSC-BSX", type: 'success',callback: this.refreshGrid},
                    {name: '新增', icon: 'el-icon-plus', ctrlCode: "PSC-BXZ", type: 'primary',callback: this.addItem},
                    {name: '导入', icon: 'el-icon-upload2', ctrlCode: "PSC-BDR", type: 'primary',callback: _ => {this.importVisible = true}},
                    // {name: '导出', ctrlCode: "PSC-BDC", type: 'export'},
                ],
                rules: {
                    jhpc: [
                        {required: true, whitespace: true, message: '请输入计划批次', trigger: 'blur'}
                    ],
                    oidJh: [
                        {required: true, message: '请选择综合计划', trigger: 'change'}
                    ],
                    jhsl: [
                        {validator: isInteger, required: true, trigger: 'blur'}
                    ],
                    jhdateQt: [
                        {required: true, message: '请输入齐套时间', trigger: 'blur'}
                    ],
                    jhdateJf: [
                        {required: true, message: '请输入交付时间', trigger: 'blur'}
                    ],
                    jhlx: [
                        {required: true, message: '请选择计划类型', trigger: 'blur'}
                    ],
                    jhzt: [
                        {required: true, message: '请选择计划状态', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '计划下发', callback: this.editJhzt, ctrlCode: "PSC-BXF",
                        isShow:(row)=>{return row.jhzt=='JHZT01'?true:false}
                    },
                    {name: '编辑', callback: this.edit, ctrlCode: "PSC-BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "PSC-BSC"},
                ]
            }
        },
        methods: {
            refreshGrid() {
                this.dataUrl="/pms/JhPsc/list"
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
                this.formModel.oidJh = this.currentJh.oid
                this.formModel.jhname = this.currentJh.jhname
                this.formModel.jhcode = this.currentJh.jhcode
                this.formModel.jhyear = this.currentJh.jhyear//重新赋值，父组件传递的动态值
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPsc/saveOrUpdate", this.formModel)
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
            },
            editJhzt(row){
                this.$confirm('是否确认下发计划?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.formModel = {...row};
                    this.formModel.jhzt = 'JHZT02';
                    if (this.formModel.oid){
                        this.$axios.post("/pms/JhPsc/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("计划下发成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("计划下发失败")
                            })
                            .finally(_ => {
                            })
                    }
                }).catch(_ => {

                })

            },
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/JhPsc/del", {params: {id: row.oid}})
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

        },
        computed: {
            getJhName(){
                console.log(this.currentJh.jhname)
                return this.currentJh.jhname
            }
        },
        watch: {
            oidJh(newVal,oldVal){
                this.formModel.oidJh = newVal
                this.dataUrl="/pms/JhPsc/list"
                this.$refs.grid.refresh()
            },
            currentJh(data){
                this.formModel.oidJh = data.oid
                this.formModel.jhname = data.jhname
                this.formModel.jhcode = data.jhcode
                this.formModel.jhyear = data.jhyear
                // this.dataUrl="/pms/JhPsc/list"
                // this.$refs.grid.refresh()
            }
        },
        mounted() {
        }
        ,
        created() {
            /*if (!this.currentJh){
                this.dataUrl="/pms/JhPsc/list"
                console.log(this.currentJh)
            }*/
            this.dataUrl="/pms/JhPsc/list"
        },
        beforeCreate() {
        }
    }
</script>

<style scoped>

</style>
