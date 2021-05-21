<template>
    <div class="ice-container">
        <el-container>
            <!--自定义树控件-->
            <pms-project-tree :conceal="conceal" @handleCallback="handleCallback"></pms-project-tree>
            <el-container>
                <el-header height="300px">
                    <SCJH :projectData="projectDataVo" @select="scjhSelect"></SCJH>
                </el-header>
                <el-main>
                    <div style="height: 200px;">
                        <ice-query-grid
                                data-url="/pms/PmsJhSyj/list"
                                exportTitle="试验件生产计划"
                                :columns="columns"
                                :query="query"
                                :gridAutoRefresh="false"
                                :operations-width="180"
                                :minHeight="300"
                                ref="grid">
                        </ice-query-grid>
                    </div>

                </el-main>
            </el-container>
        </el-container>

        <ice-dialog title="试验件生产计划编辑" :visible.sync="visible" width="900px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产计划" label-width="120px" prop="jhname">
                            <el-input v-model="formModel.jhname"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="120px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="选择项目" label-width="120px" prop="oidXm">
                            <el-input placeholder="请选择项目" v-model="formModel.xmname" readonly
                                      @focus="showProjectDialog">
                                <el-button slot="append" icon="el-icon-search" @click="showProjectDialog"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="选择产品" label-width="120px" prop="oidCpk">
                            <el-input placeholder="请选择项目" v-model="formModel.cpName" readonly
                                      @focus="showProductDialog">
                                <el-button slot="append" icon="el-icon-search" @click="showProductDialog"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="技术要求(图样)" label-width="120px" prop="jsyq">
                            <el-input v-model="formModel.jsyq"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" label-width="120px" prop="sl">
                            <!-- <el-input v-model="formModel.sl"></el-input> -->
                            <el-input-number v-model="formModel.sl" :precision="0"></el-input-number>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量单位" label-width="120px" prop="sldw">
                            <ice-select v-model="formModel.sldw" map-type-code="SLDW"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="开始日期" label-width="120px" prop="dateStart">
                            <el-date-picker v-model="formModel.dateStart"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束日期" label-width="120px" prop="dateEnd">
                            <el-date-picker v-model="formModel.dateEnd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="实施单位" label-width="120px" prop="ssdw">
                            <el-input v-model="formModel.ssdw"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="120px" prop="dateRemark">
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

        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @select="selectProject"></XM_SELECT>
        </ice-dialog>
        <ice-dialog title="选择产品" :visible.sync="visibleProduct" width="800px">
            <CP_SELECT @select="selectProduct"></CP_SELECT>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import moment from 'moment';
    import IceSelect from "../../../components/common/base/IceSelect";
    import XM_SELECT from "../common/XM_SELECT";
    import CP_SELECT from "../common/CP_SELECT";
    import PmsProjectTree from "../../../components/common/pms/PmsProjectTree";
    import SCJH from "./SCJH";

    export default {
        components: {SCJH, CP_SELECT, XM_SELECT, IceSelect, IceDialog, IceQueryGrid, PmsProjectTree},
        data() {
            return {
                loading: false,
                visible: false,
                visibleProduct: false,
                visibleProject: false,
                projectDataVo: null,
                oidScjhQuery: null,
                // 不需要的查询集合
                conceal: [],
                formModel: {
                    oid: '',
                    jhyear: '',
                    jhname: '',
                    jhcode: '',
                    jsyq: '',
                    sl: '',
                    sldw: '',
                    dateStart: '',
                    dateEnd: '',
                    ssdw: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    oidCpk: '',
                    cpName: '',
                    cpCode: '',
                    dataSecretLevcode: '2',
                    dateRemark: '',
                    jhzt: 'JHZT01',
                },
                projectData: [],
                productData: [],
                planData: [],
                query: [
                    {type: 'input', code: 'cpName', label: '产品名称'},
                    {type: 'input', code: 'cpCode', label: '产品编号'},
                    {type: 'date', code: 'dateStart', label: '开始日期', exp: '>='},
                    {type: 'date', code: 'dateEnd', label: '结束日期', exp: '<='},
                    {
                        type: 'static', code: 'oidScjh', exp: '=', value: () => {
                            return this.oidScjhQuery;
                        }
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidCpk', hidden: true},
                    {code: 'dateRemark', hidden: true},
                    {label: '年份', code: 'jhyear', width: 100, sortable: true},
                    {label: '计划名称', code: 'jhname', width: 120},
                    {label: '计划编码', code: 'jhcode', width: 120},
                    {label: '技术要求(图样)', code: 'jsyq', width: 120},
                    {label: '产品名称', code: 'cpName', width: 100},
                    {label: '编号', code: 'cpCode', width: 60},
                    {label: '数量', code: 'sl', width: 100},
                    {label: '数量单位', code: 'sldw', width: 100, mapTypeCode: 'SLDW'},
                    {
                        label: '开始日期', code: 'dateStart', width: 100, sortable: true, formatter(row) {
                            return moment(row.dateStart).format('YYYY-MM-DD');
                        }
                    },
                    {
                        label: '结束日期', code: 'dateEnd', width: 100, sortable: true, formatter(row) {
                            return moment(row.dateEnd).format('YYYY-MM-DD');
                        }
                    },
                    {label: '实施单位', code: 'ssdw', width: 100},
                    {
                        label: '密级',
                        code: 'dataSecretLevcode',
                        mapTypeCode: 'DATA_SECRET_LEVEL',
                        width: 80
                    },
                    {label: '创建人', code: 'createUser', width: 100},
                    {label: '创建时间', code: 'createDate', width: 160},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    // {name: '导出', ctrlCode: "BDC", type: 'export'},
                    {
                        name: '计划下发',
                        icon: 'el-icon-bottom-right',
                        type: 'primary',
                        ctrlCode: "BJHXF",
                        callback: this.planRelease
                    },
                ],
                rules: {
                    oidXm: [
                        {required: true, whitespace: true, message: '请选择项目', trigger: 'blur'}
                    ],
                    oidCpk: [
                        {required: true, whitespace: true, message: '请选择产品', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC"},
                ],
                selected: '',
                tabs: [
                    {
                        name: '按年份',
                        api: '/pms/Xminfo/listByYear',
                        yibu: false,
                        lazy: false,
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        bg: '#393d49',
                        fontColor: '#fff',
                        initModel: {
                            years: ['2019', '2013'].join(',')
                        }
                    },
                    {
                        name: '按状态',
                        // 请求接口
                        api: '/pms//Xminfo/listByStatus',
                        yibu: false,
                        // 是否需要异步加载
                        lazy: false,
                        // 字段配置
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        // 背景颜色
                        bg: '#393d49',
                        // 字体颜色
                        fontColor: '#fff',
                        // 请求数据
                        initModel: {}
                    },
                ],
            }
        },
        methods: {
            // 接受回调数据
            handleCallback(data) {
                this.projectDataVo = data;
            },
            handleClick() {
            },
            addItem() {
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel.oidXm = '';
                    this.formModel.xmname = '';
                    this.formModel.xmcode = '';
                    this.formModel.oidCpk = '';
                    this.formModel.cpCode = '';
                    this.formModel.cpName = '';
                });
                this.selectComPlan(this.planQuery);
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhSyj/saveOrUpdate", this.formModel)
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
                    this.formModel = {...row};
                })
            }
            ,
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/PmsJhSyj/del", {params: {id: row.oid}})
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
            planRelease(row) {
                //this.formModel = {...row};
                //this.formModel.jhzt = 'JHZT02',
                this.$confirm('是否确认下发?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/pms/Jhgl/updateStatus", {id: this.planQuery, jhzt: 'JHZT02'})
                        .then(result => {
                            this.$message.success("下发成功")
                            //this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("下发失败")
                        })
                }).catch(_ => {

                })
            },
            selectComPlan(option) {
                for (let i = 0; i < this.planData.length; i++) {
                    if (this.planData[i].oid == option) {
                        this.formModel.jhyear = this.planData[i].jhyear;
                        this.formModel.jhname = this.planData[i].jhname;
                        this.formModel.jhcode = this.planData[i].jhcode;
                        break;
                    }
                }
            },

            showProjectDialog() {
                this.visibleProject = true;
            },
            selectProject(item) {
                this.formModel.oidXm = item[0].oid;
                this.formModel.xmcode = item[0].xmcode;
                this.formModel.xmname = item[0].xmname;
                this.visibleProject = false;
            },
            showProductDialog() {
                this.visibleProduct = true;
            },
            selectProduct(item) {
                this.formModel.oidCpk = item[0].oid;
                this.formModel.cpName = item[0].cpName;
                this.formModel.cpCode = item[0].cpCode;
                this.visibleProduct = false;
            },
            selectPlan(option) {
                this.$refs.grid.refresh();
            },
            scjhSelect(item) {
                //this.formModel.jhyear = item[0].year;
                //this.formModel.jhname = item[0].jhname;
                //this.formModel.jhcode = item[0].jhcode;
                this.oidScjhQuery = item[0].oid;
                this.$refs.grid.refresh();
            }
        }
        ,
        computed: {}
        ,
        watch: {}
        ,
        mounted() {

        }
        ,
        created() {
            this.$axios.get("/pms/Xminfo/QueryXmName")
                .then(result => {
                    for (let i = 0; i < result.data.length; i++) {
                        result.data[i].oidXm = result.data[i].oid;
                    }
                    this.projectData = result.data;
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(_ => {

                });
            this.$axios.get("/pms/Cpk/queryName")
                .then(result => {
                    for (let i = 0; i < result.data.length; i++) {
                        result.data[i].oidCpk = result.data[i].oid;
                    }
                    this.productData = result.data;
                })
                .catch(error => {
                    console.error(error);
                })
                .finally(_ => {

                });

        }
    }

</script>


<style scoped>

</style>
