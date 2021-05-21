<template>
    <div class="ice-container">
        <vxe-grid style="height: 400px"
                  border
                  size="small"
                  align="center"
                  headerAlign="center"
                  height="auto"
                  highlight-hover-row
                  :loading="loading"
                  :toolbar="tableToolbar"
                  :start-index="(tablePage.currentPage - 1) * tablePage.pageSize"
                  :pager-config="tablePage"
                  :columns="tableColumn"
                  :data="tableData"
                  @page-change="handlePageChange"
                  @toolbar-button-click="toolbarButtonClickEvent"
                  >
        </vxe-grid>
        <ice-dialog v-bind:title="!formModel.oid?'新增原材料':'修改原材料'" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="批次" label-width="110px" prop="oidPjh">
                            <el-select v-model="formModel.oidPjh"
                                       filterable
                                       @change="getJhpc(formModel.oidPjh)">
                                <el-option
                                        v-for="item in this.jhpcData"
                                        :key="item.oid"
                                        :label="item.jhpc"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="使用工序" label-width="110px" prop="pscjhylGx">
                            <el-input v-model.trim="formModel.pscjhylGx"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="材料名称" label-width="110px" prop="oidYcl">
                            <el-select v-model="formModel.oidYcl" filterable @change="getYcl(formModel.oidYcl)">
                                <el-option
                                        v-for="item in clkData"
                                        :key="item.oid"
                                        :label="item.clkName"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="规格" label-width="110px" prop="clkGg">
                            <el-input v-model.trim="formModel.clkGg" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="复检项目" label-width="110px" prop="pscjhylGxXm">
                            <el-input v-model.trim="formModel.pscjhylGxXm"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="技术要求" label-width="110px" prop="pscjhylGxJsyq">
                            <el-input v-model.trim="formModel.pscjhylGxJsyq"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="工艺检验方法" label-width="110px" prop="pscjhylGxJyff">
                            <el-input v-model.trim="formModel.pscjhylGxJyff"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="有效期限" label-width="110px" prop="pscjhylGxQx">
                            <el-date-picker v-model.trim="formModel.pscjhylGxQx"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="定点定型要求" label-width="110px" prop="pscjhylGxDddx">
                            <el-input v-model.trim="formModel.pscjhylGxDddx"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="非标外协" label-width="110px" prop="pscjhylHwWx">
                            <el-input v-model.trim="formModel.pscjhylHwWx"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="生产厂商" label-width="110px" prop="pscjhylHwCs">
                            <el-input v-model.trim="formModel.pscjhylHwCs"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="订货要求" label-width="110px" prop="pscjhylHwYq">
                            <el-input v-model.trim="formModel.pscjhylHwYq"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="验收项目" label-width="110px" prop="pscjhylHwXm">
                            <el-input v-model.trim="formModel.pscjhylHwXm"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="技术指标" label-width="110px" prop="pscjhylHwJszz">
                            <el-input v-model.trim="formModel.pscjhylHwJszz"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="8">
                        <el-form-item label="货物检验方法" label-width="110px" prop="pscjhylHwJyff">
                            <el-input v-model.trim="formModel.pscjhylHwJyff"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="16">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
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
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";

    export default {
        name: "JHPSCBaseInfo",
        components: {IceTableColumn, IceSelect, IceDialog, IceQueryGrid},
        props:{
            'oidJh':String,
            'jhpcData':Array,
            'oidPjhList':String,
        },
        data() {
            return {
                loading: false,
                visible: false,
                tableData:[],
                clkData:[],
                tablePage: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                formModel: {
                    oid: '',
                    oidPjh: '',//批生产计划主键id
                    jhpc: '',//计划批次
                    oidYcl: '',//原材料主键id
                    clkName: '',//原材料名称
                    clkGg:'',//原材料规格
                    pscjhylGx:'',//使用工序
                    pscjhylGxXm:'',//复检项目
                    pscjhylGxJsyq:'',//工艺技术要求
                    pscjhylGxJyff:'',//工艺检验方法
                    pscjhylGxQx:'',//有效期限
                    pscjhylGxDddx:'',//定点定型要求
                    pscjhylHwWx:'',//非标外协
                    pscjhylHwCs:'',//生产/供货厂商
                    pscjhylHwYq:'',//订货要求
                    pscjhylHwXm:'',//验收项目
                    pscjhylHwJszz:'',//货物技术指标
                    pscjhylHwJyff:'',//货物检验方法
                    dataSecretLevcode:'2',//密级
                    dateRemark:'',//备注
                },
                tableColumn:[
                    {type:'index',title:'序号',width:'50'},
                    {field:'clkName',title:'材料名称',width:'100'},
                    {field:'clkGg',title:'规格',width:'100'},
                    {field:'pscjhylGx',title:'使用工序',width:'100'},
                    {title:'工艺要求',children:[
                        {field:'pscjhylGxXm',title:'复检项目',width:'100'},
                        {field:'pscjhylGxJsyq',title:'技术要求',width:'100'},
                        {field:'pscjhylGxJyff',title:'工艺检验方法',width:'100'},
                        {field:'pscjhylGxQx',title:'有效期限',width:'100', },
                        {field:'pscjhylGxDddx',title:'定点定型要求',width:'120'},
                    ]},
                    {title:'订货及验收要求',children:[
                        {field:'pscjhylHwWx',title:'非标外协',width:'100'},
                        {field:'pscjhylHwCs',title:'生产/供货厂商',width:'120'},
                        {field:'pscjhylHwYq',title:'订货要求',width:'100'},
                        {field:'pscjhylHwXm',title:'验收项目',width:'100'},
                        {field:'pscjhylHwJszz',title:'技术指标',width:'100'},
                        {field:'pscjhylHwJyff',title:'货物检验方法',width:'100'}
                    ]},
                    {field:'dateRemark',title:'备注',width:'200',showOverflow:true},
                ],
                /*tableProxy: {
                    // 配置响应的数据属性
                    props: {
                        result: 'result',
                        total: 'page.total'
                    },
                    ajax: {
                        // page 对象： { pageSize, currentPage }
                        query: ({ page }) => this.$axios.get(`/pms/JhPscYcl/list?size=${page.pageSize}&current=${page.currentPage}`), // 模拟请求

                    }
                },*/
                rules:{
                    oidPjh:[{required: true, message: '请选择批次', trigger: 'change'}],
                    oidYcl:[{required: true, message: '请选择材料', trigger: 'change'}],
                    clkGg:[{required: true, message: '规格不能为空', trigger: 'change'}],
                    pscjhylGx:[{required: true, message: '请输入使用工序', trigger: 'blur'}],
                    pscjhylGxXm:[{required: true, message: '请输入复检项目', trigger: 'blur'}],
                    pscjhylGxJsyq:[{required: true, message: '请输入技术要求', trigger: 'blur'}],
                    pscjhylGxJyff:[{required: true, message: '请输入工艺检验方法', trigger: 'blur'}],
                    pscjhylGxQx:[{required: true, message: '请输入有效期限', trigger: 'blur'}],
                    pscjhylGxDddx:[{required: true, message: '请输入定点定型要求', trigger: 'blur'}],
                    pscjhylHwWx:[{required: true, message: '请输入非标外协', trigger: 'blur'}],
                    pscjhylHwCs:[{required: true, message: '请输入生产厂商', trigger: 'blur'}],
                    pscjhylHwYq:[{required: true, message: '请输入订货要求', trigger: 'blur'}],
                    pscjhylHwXm:[{required: true, message: '请输入验收项目', trigger: 'blur'}],
                    pscjhylHwJszz:[{required: true, message: '请输入技术指标', trigger: 'blur'}],
                    pscjhylHwJyff:[{required: true, message: '请输入货物检验方法', trigger: 'blur'}],
                    dataSecretLevcode:[{required: true, message: '请选择密级', trigger: 'change'}],
                },
                tableToolbar: {
                    buttons: [
                        {code: 'PSC-YCL-XZ', name: '新增' },
                    ],
                    export: true,
                    refresh: true,
                    /*resizable: {
                        storage: true
                    },
                    setting: {
                        storage: true
                    }*/
                }
            }
        },
        methods: {
            findList () {
                this.loading = true
                this.$axios.get(`/pms/JhPscYcl/list`,{
                    params:{
                        size:this.tablePage.pageSize,
                        current:this.tablePage.currentPage,
                        staticConditions:[{column:'oidPjh',exp:'in',value: _ =>{return this.oidPjhList}}],
                        conditionLink:'AND'}
                })
                .then(response => {
                    this.tablePage.total = response.data.total
                    this.tableData = response.data.records
                    this.loading = false
                }).catch(e => {
                    this.$message.error(e)
                    this.loading = false
                }).finally(_ => {
                    this.loading = false
                })
            },
            toolbarButtonClickEvent ({code} , event) {
                switch (code) {
                    case 'PSC-YCL-XZ':
                        let visible = false;
                        this.visible = true;
                        this.$nextTick(_ => {
                            this.$refs.form.resetFields();
                        })
                        break
                }
            },
            refreshGrid() {
                this.reload();
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPscYcl/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                console.log(error)
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

            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/JhPscYcl/del", {params: {id: row.oid}})
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
            reload(){
                this.isRouterAlive=false
                this.$nextTick(() => {this.isRouterAlive="true"})
            },

            //根据批计划id获取批次
            getJhpc(val){
                let index=this.jhpcData.findIndex((value)=>value.oid==val);
                this.formModel.jhpc=this.jhpcData[index].jhpc;
            },
            //根据原材料id获取相关信息
            getYcl(val){
                let index=this.clkData.findIndex((value)=>value.oid==val);
                this.formModel.clkName=this.clkData[index].clkName;
                this.formModel.clkGg=this.clkData[index].clkGg;
            },

            //获取产品信息
            getYclkInfo(){
                this.$axios.get("/pms/Yclk/queryName")
                    .then(result => {
                        this.clkData=result.data;
                    })
                    .catch(error => {
                        console.log(error);
                        this.$message.error("原材料获取失败")
                    })
                    .finally(_ => {

                    })
            },
            handlePageChange ({ currentPage, pageSize }) {
                this.tablePage.currentPage = currentPage
                this.tablePage.pageSize = pageSize
                this.findList()
            }

        }
        ,
        computed: {}
        ,
        watch: {
            oidJh(newVal,oldVal){
                this.$refs.grid.refresh();
                this.formModel.oidJh = newVal;
            }
        },
        mounted() {

        }
        ,
        created() {
            this.findList();
            this.getYclkInfo();
        }
    }
</script>

<style scoped>

</style>
