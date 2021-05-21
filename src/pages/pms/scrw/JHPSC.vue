<template>
    <div class="ice-container">
        <el-select v-model="jhpcForm.oidJh" @change="jhChange" style="width: 250px;margin-bottom: 10px">
            <el-option
                    v-for="item in jhData"
                    :key="item.oid"
                    :label="item.jhname"
                    :value="item.oid"
            ></el-option>
        </el-select>
        <el-container>
            <el-aside width="250px" style="height:100%">
                <el-tabs type="border-card" style="width: 100%;height: 300px;">
                    <el-tab-pane label="按批次">
                        <el-input placeholder="请输入批次">
                            <el-button slot="append" icon="el-icon-search"></el-button>
                            <el-button slot="append" icon="el-icon-plus" @click="addJhpcDialog"></el-button>
                            <el-button slot="append" icon="el-icon-upload"></el-button>
                        </el-input>
                        <!--<ul style="align-content: center">
                            <template v-for="item in jhpcList">
                                <li><el-link :underline="false" :type="type">{{item.jhpc}}</el-link></li>
                            </template>
                        </ul>-->
                        <el-timeline :reverse="reverse" style="height: 300px;margin: 10px;">
                            <template v-for="item in jhpcList">
                                <el-timeline-item
                                        placement="bottom"
                                        :key="item.oid"
                                        :timestamp="item.updateDate">
                                    <!--<el-tag style="cursor: pointer" type="info" size="lager" effect="plain">{{item.jhpc}}</el-tag>-->
                                    <el-link :underline="false" :type="item.oid==currentJhpc.oid?'primary':'default'"
                                             @click="jhpcClick(item.oid)">{{item.jhpc}}
                                    </el-link>
                                </el-timeline-item>
                            </template>
                        </el-timeline>
                    </el-tab-pane>
                    <el-tab-pane label="按产品">
                        <ul style="align-content: center">
                            <template v-for="item in pscCpList">
                                <li>
                                    <el-link :underline="false" :type="type">{{item.jhpc}}</el-link>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>

                <el-card body-style="width:100%;height:30%">
                    <div><p>数量：{{currentJhpc.jhsl}}</p></div>
                    <el-divider></el-divider>
                    <div><p>齐套时间：{{currentJhpc.jhdateQt}}</p></div>
                    <el-divider></el-divider>
                    <div><p>交付时间：{{currentJhpc.jhdateJf}}</p></div>
                </el-card>
            </el-aside>
            <!--<el-main></el-main>-->
            <div class="ice-container" style="height: 100%">
                <ice-query-grid
                        :data-url="dataUrl"
                        exportTitle="基本信息"
                        :operations-width="200"
                        :query="pscCpQuery"
                        :columns="pscCpColumns"
                        :buttons="pscCpButtons"
                        :operations="pscCpOperations"
                        ref="grid">
                </ice-query-grid>
            </div>

        </el-container>
        <ice-dialog :title="!jhpcForm.oid?'新增批次':'修改批次信息'" :visible.sync="visible" width="600px">
            <el-form :model="jhpcForm" :rules="jhpcRules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="综合计划" label-width="100px" prop="oidJh">
                            <el-select v-model="jhpcForm.oidJh"
                                       filterabl>
                                <el-option
                                        v-for="item in jhData"
                                        :key="item.oid"
                                        :label="item.jhname"
                                        :value="item.oid"
                                        :disabled="item.oid==jhpcForm.oidJh?false:true"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="jhpcForm.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="批次" label-width="100px" prop="jhpc">
                            <el-input v-model.trim="jhpcForm.jhpc"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="数量" label-width="100px" prop="jhsl">
                            <el-input-number v-model.number.trim="jhpcForm.jhsl" controls-position="right"
                                             :min="1"></el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="齐套时间" label-width="100px" prop="jhdateQt">
                            <el-date-picker v-model="jhpcForm.jhdateQt"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交付时间" label-width="100px" prop="jhdateJf">
                            <el-date-picker v-model="jhpcForm.jhdateJf"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="计划类型" label-width="100px" prop="jhlx">
                            <el-select v-model="jhpcForm.jhlx" filterable placeholder="请选择">
                                <el-option v-for="item in jhlxData"
                                           :key="item.value"
                                           :label="item.label"
                                           :value="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="计划状态" label-width="100px" prop="jhzt">
                            <ice-select v-model="jhpcForm.jhzt" map-type-code="JHZT" filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="dateRemark">
                            <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model.trim="jhpcForm.dateRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="上传附件" label-width="100px" prop="dateRemark">
                            <ice-single-upload>

                            </ice-single-upload>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveJhpcConfirm">保存</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog :title="!pscCpForm.oid?'新增产品':'修改产品信息'" :visible.sync="cp_visible" width="600px">
            <el-form :model="pscCpForm" :rules="pscCpRules" ref="cpform">
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="批次" label-width="100px" prop="oidPjh">
                            <el-select v-model="pscCpForm.oidPjh" filterable @change="getJhpc(pscCpForm.oidPjh)">
                                <el-option
                                        v-for="item in this.jhpcList"
                                        :key="item.oid"
                                        :label="item.jhpc"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="pscCpForm.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="产品名称" label-width="100px" prop="oidCpk">
                            <el-select v-model="pscCpForm.oidCpk"
                                       filterabl
                                       no-data-text="无数据"
                                       @change="getCpCode(pscCpForm.oidCpk)">
                                <el-option
                                        v-for="item in cpkList"
                                        :key="item.oid"
                                        :label="item.cpName"
                                        :value="item.oid"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="产品编号" label-width="100px" prop="cpCode">
                            <el-input v-model="pscCpForm.cpCode"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="文件编号" label-width="100px" prop="cpfilename">
                            <el-input v-model.trim="pscCpForm.cpfilename"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="文件编码" label-width="100px" prop="cpfilecode">
                            <el-input v-model.trim="pscCpForm.cpfilecode"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="12">
                        <el-form-item label="编写单位" label-width="100px" prop="cpfilebxdw">
                            <el-input v-model.trim="pscCpForm.cpfilebxdw"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="编写人" label-width="100px" prop="cpfilebxr">
                            <el-input v-model.trim="pscCpForm.cpfilebxr"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="dateRemark">
                            <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit v-model.trim="pscCpForm.dateRemark"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveCpConfirm">保存</el-button>
                <el-button type="info" @click="cp_visible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import moment from 'moment';

    export default {
        name: 'jhpsc',
        components: {IceQueryGrid, IceSelect, IceSingleUpload, IceDialog},
        data() {
            return {
                reverse: true,
                visible: false,
                cp_visible: false,
                loading: false,
                type: 'dufault',
                dataUrl: '',
                pscCpQuery: [],
                jhData: [],
                jhpcList: [],
                currentJhpc: {},
                cpkList: [],
                jhlxData: [
                    {value: 'lx01', label: '计划类型一'},
                    {value: 'lx02', label: '计划类型二'},
                    {value: 'lx03', label: '计划类型三'},
                ],
                jhpcForm: {
                    oid: '',//批生产质量计划id
                    oidJh: this.$route.query.oid,//综合计划id
                    jhcode: '',//综合计划编码
                    jhname: '',//综合计划名称
                    jhyear: '',//综合计划年份
                    jhpc: '',//计划批次
                    jhsl: '',//计划数量
                    jhdateQt: '',//齐套时间
                    jhdateJf: '',//交付时间
                    jhlx: '',//计划类型
                    jhzt: 'JHZT01',//计划状态，默认值：未开始
                    dataSecretLevcode: '2',//密级：内部
                    dateRemark: ''//备注
                },
                pscCpForm: {//产品表单
                    oid: '',//计划于产品关联表id
                    oidPjh: '',//计划批次id
                    jhpc: '',//计划批次
                    dataSecretLevcode: '2',//密级
                    oidCpk: '',//产品库id
                    cpName: '',//产品名称
                    cpCode: '',//产品编号
                    cpfilename: '',//文件名称
                    cpfilecode: '',//文件编号
                    cpfilebxdw: '',//编写单位
                    cpfilebxr: '',//编写人
                    dateRemark: '',//备注
                    progress: [],//进度安排
                },
                pscCpList: [
                    {
                        oidCpk: '1',//产品库id
                        cpName: '产品1',//产品名称
                        cpCode: '产品code1',//产品编号
                        cpfilename: '文件一',//文件名称
                        cpfilecode: '文件编号一',//文件编号
                        cpfilebxdw: '单位一',//编写单位
                        cpfilebxr: '编写人',//编写人
                        dateRemark: 'aa',//备注
                        progress: [{year: '2019', item: [{month: 1, sl: 5}, {month: 2, sl: 10}]}, {
                            year: '2020',
                            item: [{month: 5, sl: 20}, {month: 6, sl: 30}]
                        }],
                    },
                    {
                        oidCpk: '2',//产品库id
                        cpName: '产品2',//产品名称
                        cpCode: '产品code2',//产品编号
                        cpfilename: '文件er',//文件名称
                        cpfilecode: '文件编号er',//文件编号
                        cpfilebxdw: '单位er',//编写单位
                        cpfilebxr: '编写人er',//编写人
                        dateRemark: 'bb',//备注
                        progress: [{
                            year: '2019',
                            item: [{month: 4, sl: 6}, {month: 5, sl: 7}, {month: 6, sl: 8}]
                        }, {year: '2020', item: [{month: 11, sl: 20}, {month: 12, sl: 30}]}],
                    },
                ],
                jhpcRules: {
                    jhpc: [{required: true, whitespace: true, message: '请输入计划批次', trigger: 'blur'}],
                    oidJh: [{required: true, message: '请选择综合计划', trigger: 'change'}],
                    jhsl: [{required: true, trigger: 'blur'}],
                    jhdateQt: [{required: true, message: '请输入齐套时间', trigger: 'blur'}],
                    jhdateJf: [{required: true, message: '请输入交付时间', trigger: 'blur'}],
                    jhlx: [{required: true, message: '请选择计划类型', trigger: 'blur'}],
                    jhzt: [{required: true, message: '请选择计划状态', trigger: 'blur'}],
                    dataSecretLevcode: [{required: true, message: '请选择密级', trigger: 'blur'}],
                },
                pscCpColumns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidPjh', hidden: true},
                    {code: 'oidCpk', hidden: true},
                    {label: '产品编号', code: 'cpCode', width: 120},
                    {label: '产品名称', code: 'cpName', width: 120},
                    {label: '文件名称', code: 'cpfilename', width: 120},
                    {label: '文件编号', code: 'cpfilecode', width: 120},
                    {label: '编写单位', code: 'cpfilebxdw', width: 120},
                    {label: '编写人', code: 'cpfilebxr', width: 120},
                    {
                        label: '编写时间', code: 'updateDate', width: 120, formatter(row) {
                            return moment(row.updateDate).format('YYYY-MM-DD')
                        }
                    },
                    {label: '密级', code: 'dataSecretLevcode', width: 100, mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                pscCpButtons: [
                    {
                        name: '新增',
                        icon: 'el-icon-plus',
                        ctrlCode: "PSC_CP_BXZ",
                        type: 'primary',
                        callback: this.addCpDialog
                    },
                    {name: '导出', ctrlCode: "PSC_CP_BDC", type: 'export'},
                ],
                pscCpOperations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "PSC-CP-BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "PSC-CP-BSC"},
                ],
                pscCpRules: {},

            }
        },
        methods: {
            //获取综合计划信息
            getJhglListAll() {
                this.$axios.get(`/pms/Jhgl/list?size=100&current=1`,
                    {
                        params: {
                            columns: ['oid', 'jhname', 'jhcode', 'jhyear'],
                            staticConditions: [{column: 'jhlx', exp: '=', value: 'JHLX02'}],
                            conditionLink: 'AND'
                        }
                    }
                )
                    .then(result => {
                        this.jhData = result.data.records
                        if (!this.jhpcForm.oidJh) {//未选择综合计划时，默认选择第一个
                            this.jhData.some((data, index) => {//some遍历，条件为true时跳出
                                this.jhpcForm.oidJh = data.oid
                                return index == 0//遍历一次就跳出
                            })
                        }
                        this.getPscByJh(this.jhpcForm.oidJh);
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error('计划列表获取失败')
                    })
                    .finally(_ => {
                    })
            },
            //根据综合计划id获取计划批次信息
            getPscByJh(oidJh) {
                this.$axios.get("/pms/JhPsc/list/query",
                    {
                        params: {
                            columns: ['oid', 'oidJh', 'jhcode', 'jhname', 'jhyear', 'jhpc', 'jhsl', 'jhdateQt', 'jhdateJf', 'jhlx', 'jhzt', 'dataSecretLevcode', 'dateRemark'],
                            staticConditions: [{column: 'oidJh', exp: '=', value: oidJh}],
                            conditionLink: 'AND'
                        }
                    }).then(result => {
                    this.jhpcList = result.data
                    /*let last = result.data.length()-1*/
                    this.currentJhpc = result.data[0]
                    this.jhpcForm.oid = this.pscCpForm.oidPjh = result.data[0].oid
                    this.pscCpQuery.push({type: 'static', code: 'oidPjh', exp: 'in', value: this.jhpcForm.oid})
                    this.dataUrl = '/pms/JhPscCp/list'
                })
                    .catch(error => {
                        this.$message.error("批次获取失败", error)
                    })
                    .finally(_ => {

                    })
            },
            //选择综合计划时的点击事件
            jhChange(val) {
                this.jhpcForm.oidJh = val
                this.getPscByJh(val)
            },
            //新增批次对话框
            addJhpcDialog() {
                let visible = false;
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                })
            },
            //保存批次信息
            saveJhpcConfirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPsc/saveOrUpdate", this.jhpcForm)
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
            //产品新增对话框
            addCpDialog() {
                let cp_visible = false;
                this.cp_visible = true;
                this.$nextTick(_ => {
                    this.$refs.cpform.resetFields();
                })
            },
            //保存产品信息
            saveCpConfirm() {
                this.$refs.cpform.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/JhPscCp/saveOrUpdate", this.pscCpForm)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.cp_visible = false;
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

            //根据批次id获取批次
            getJhpc(val) {
                let index = this.jhpcList.findIndex((value) => value.oid == val);
                this.pscCpForm.jhpc = this.jhpcList[index].jhpc;
            },

            //获取产品库信息
            getProductInfo() {
                this.$axios.get("/pms/Cpk/queryName")
                    .then(result => {
                        this.cpkList = result.data;
                    })
                    .catch(error => {
                        this.$message.error("产品获取失败")
                    })
            },
            //获取产品名称和编码
            getCpCode(val) {
                let index = this.cpkList.findIndex((value) => value.oid == val);
                this.pscCpForm.cpCode = this.cpkList[index].cpCode;
                this.pscCpForm.cpName = this.cpkList[index].cpName;
            },
            //选择批次的点击事件
            jhpcClick(val) {
                this.type = "primary"
                this.pscCpForm.oidPjh = val
                let index = this.jhpcList.findIndex((value) => value.oid == val)
                this.currentJhpc = this.jhpcList[index]
                this.pscCpQuery.splice(0, 1, {type: 'static', code: 'oidPjh', exp: 'in', value: val})
                this.dataUrl = "/pms/JhPscCp/list"
                this.$refs.grid.refresh()
            }
        },
        watch: {},
        created() {
            this.getJhglListAll()
            this.getProductInfo()
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .height {
        height: 100%;
    }
</style>
