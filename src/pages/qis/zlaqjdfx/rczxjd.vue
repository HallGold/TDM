<template>
    <div class="ice-container">
        <ice-query-grid
                data-url="/pms/QisRczxjd/list"
                :operations-width="120"
                :columns="columns"
                :buttons="buttons"
                :query="query"
                :operations="operations"
                ref="grid">
        </ice-query-grid>
        <ice-dialog title="日常/专项监督编辑" :visible.sync="visible" width="800px">
            <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="编号" label-width="100px" prop="code">
                            <el-input v-model="formModel.code" placeholder="自动生成" readonly="readonly"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="被检单位" label-width="100px" prop="bjdw">
                            <ice-dept-selector chooseItem="single" mode="onlySelect" v-model="formModel.bjdw"
                                               @select-confirm="selectDept"></ice-dept-selector>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="被检项目" label-width="100px" prop="xmname">
                            <el-input v-model="formModel.xmname" readonly="readonly" @focus="addProject"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="检查时间" label-width="100px" prop="jcsj">
                            <el-date-picker v-model="formModel.jcsj"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="监督检查人" label-width="100px" prop="jcr">
                            <ice-persion-selector mode="onlySelect" chooseItem="single" @select-confirm="selectPerson"
                                                  v-model="formModel.jcr"></ice-persion-selector>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="检查依据" label-width="100px" prop="jcyj">
                            <el-input type="textarea" v-model="formModel.jcyj" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="检查信息" name="first">
                            <el-button type="primary" icon="el-icon-plus" @click="addInfo">新增</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="reform">整改督促</el-button>
                            <vxe-table border show-overflow
                                       ref="infoTable"
                                       max-height="200"
                                       :edit-config="{trigger: 'click', mode: 'row'}"
                                       :data="infoTableData">
                                <vxe-table-column type="checkbox" width="60"></vxe-table-column>
                                <vxe-table-column type="index" title="序号" width="60"></vxe-table-column>
                                <vxe-table-column field="jcnr" title="检查内容" width="200"
                                                  :edit-render="{name: 'input'}"></vxe-table-column>
                                <vxe-table-column field="jcjg" title="检查结果" width="200"
                                                  :edit-render="{name: 'input'}"></vxe-table-column>
                                <vxe-table-column field="czwt" title="存在问题" width="200"
                                                  :edit-render="{name: 'input'}"></vxe-table-column>
                                <vxe-table-column field="dateRemark" title="备注" width="200"
                                                  :edit-render="{name: 'input'}"></vxe-table-column>
                                <vxe-table-column title="操作" width="120">
                                    <template v-slot="{ row }">
                                        <el-button type="text" @click="$refs.infoTable.remove(row)">删除</el-button>
                                        <el-button type="text" @click="viewChange(row)">查看整改</el-button>
                                    </template>
                                </vxe-table-column>
                            </vxe-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm">确认</el-button>
                <el-button type="info" @click="visible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="整改监督" :visible.sync="visibleReform" width="800px">
            <el-form :model="formModelReform" :rules="rulesReform" ref="reform" v-loading="loading">
                <el-row>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="基本信息" name="first">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="编号" label-width="100px">
                                        <el-input v-model="formModel.code" placeholder="自动生成"
                                                  readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目名称" label-width="100px">
                                        <el-input v-model="formModel.xmname" readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="监督检查人" label-width="100px">
                                        <el-input v-model="formModel.jcr" readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="检查时间" label-width="100px">
                                        <el-date-picker v-model="formModel.jcsj" readonly="readonly"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="检查依据" label-width="100px">
                                        <el-input type="textarea" v-model="formModel.jcyj"
                                                  readonly="readonly"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                    <el-tabs v-model="activeName">
                        <el-tab-pane label="问题整改" name="first">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="主送" label-width="100px" prop="zsr">
                                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                              @select-confirm="selectMainPerson"
                                                              v-model="formModelReform.zsr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="抄送" label-width="100px" prop="csr">
                                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                              @select-confirm="selectCopyPerson"
                                                              v-model="formModelReform.csr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                        <ice-select v-model="formModelReform.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="整改期限" label-width="100px" prop="zgqx">
                                        <el-date-picker v-model="formModelReform.zgqx"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="存在问题" label-width="100px" prop="czwt">
                                        <el-input type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.czwt"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改要求" label-width="100px" prop="zgyq">
                                        <el-input type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgyq"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="责任人处理情况" label-width="100px" prop="zrrclqk">
                                        <el-input type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zrrclqk"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改情况小结" label-width="100px" prop="zgqkxj">
                                        <el-input type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgqkxj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="监督检查负责人确认意见" label-width="100px" prop="jcryj">
                                        <el-input type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.jcryj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否完成整改" label-width="100px" prop="isWc">
                                        <!--<ice-select v-model="formModelReform.isWc" :options="options"></ice-select>-->
                                        <el-select v-model="formModelReform.isWc" placeholder="请选择">
                                            <el-option
                                                    v-for="item in options"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirm(1)">确认</el-button>
                <el-button type="info" @click="visibleReform=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @closeVisible="closeVisible" @select="selectProject"></XM_SELECT>
        </ice-dialog>
        <rcjd-detail ref="detail" :to-flow="view"></rcjd-detail>
    </div>
</template>

<script>

    import moment from 'moment';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import XM_SELECT from "../../pms/common/XM_SELECT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import {SBZT, SPZT} from "../../../utils/constant";
    import mixins from '../components/mixins'
    import rcjdDetail from './details/rcjdDetail'


    export default {
        components: {IceDeptSelector, IcePersionSelector, XM_SELECT, IceQueryGrid, rcjdDetail},
        mixins: [mixins],
        data() {
            return {
                editPageUrl: '/qis/zlaqjdfx/rczxjd_flow',
                loading: false,
                visible: false,
                activeName: 'first',
                infoTableData: [],

                visibleProject: false,

                options: [
                    {value: '1', label: '是'},
                    {value: '0', label: '否'}
                ],

                formModel: {
                    oid: '',
                    code: '',
                    oidBjdw: '',
                    bjdwCode: '',
                    bjdw: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    jcsj: '',
                    oidJcr: '',
                    jcrcode: '',
                    jcr: '',
                    dataSecretLevcode: '2',
                    jcyj: '',

                    qisRczxjdInfos: [],
                },

                query: [
                    {type: 'input', code: 'code', label: '编号', value: ""},
                    {type: 'input', code: 'bjdw', label: '被检单位', value: ""},
                    {type: 'input', code: 'xmname', label: '被检项目', value: ""},
                    {type: 'date', code: 'jcsj', label: '检查时间', value: ""},
                    {type: 'input', code: 'jcyj', label: '检查依据', value: ""},
                    {type: 'input', code: 'jcr', label: '监督检查人', value: ""},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'oidBjdw', hidden: true},
                    {code: 'bjdwCode', hidden: true},
                    {code: 'sbzt', hidden: true},
                    {code: 'spzt', hidden: true},
                    {label: '编号', code: 'code', width: 140},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '被检单位', code: 'bjdw', width: 140},
                    {label: '被检项目', code: 'xmname', width: 140},
                    {
                        label: '检查时间', code: 'jcsj', width: 140, sortable: true, formatter(row) {
                            return moment(row.jcsj).format('YYYY-MM-DD');
                        }
                    },
                    {label: '检查依据', code: 'jcyj', width: 200},
                    {label: '监督检查人', code: 'jcr', width: 200},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 80},
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    // {label: '部门名字', code: 'depRelName', width: 100},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem, disabled: () => {
                            return this.jhdata.isDetail ? true : false
                        }},
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-left',
                        ctrlCode: "BSX",
                        type: 'primary',
                        callback: this.refresh,
                    },
                ],
                rules: {
                    bjdw: [
                        {required: true, whitespace: true, message: '请输入被检单位', trigger: 'change'}
                    ],
                    xmname: [
                        {required: true, message: '请选择被检项目', trigger: 'change'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    jcsj: [
                        {required: true, message: '请选择检查时间', trigger: 'blur'}
                    ],
                    jcr: [
                        {required: true, message: '请选择检查人', trigger: 'change'}
                    ],
                    jcyj: [
                        {required: true, whitespace: true, message: '请输入检查依据', trigger: 'blur'}
                    ],
                },
                operations: [
                    {
                        name: '编辑', callback: this.edit, ctrlCode: "BBJ", isShow(row) {
                            if (row.sbzt == SBZT.WSB) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            if (row.sbzt == SBZT.WSB) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    },
                    {
                        name: '查看', callback: this.showDetail, ctrlCode: "BCK",
                    },
                ],

                visibleReform: false,
                formModelReform: {
                    oid: '',
                    oidZsr: '',
                    zsrcode: '',
                    zsr: '',
                    oidCsr: '',
                    csrcode: '',
                    csr: '',
                    dataSecretLevcode: '2',
                    zgqx: '',
                    zgyq: '',
                    zrrclqk: '',
                    zgqkxj: '',
                    jcryj: '',
                    isWc: '0',
                },

                rulesReform: {
                    zsr: [
                        {required: true, message: '请选择主送人', trigger: 'blur'}
                    ],
                    csr: [
                        {required: true, message: '请选择抄送人', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'blur'}
                    ],
                    zgqx: [
                        {required: true, message: '请选择整改期限', trigger: 'blur'}
                    ],
                    czwt: [
                        {required: true, message: '请输入存在的问题', trigger: 'blur'}
                    ],
                    zgyq: [
                        {required: true, message: '请输入整改要求', trigger: 'blur'}
                    ],
                },

            }
        },
        methods: {

            addItem() {
                /*this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                });
                this.infoTableData = [];
                this.formModel.oid = '';*/

                this.$router.push({path: this.editPageUrl});

                //this.$router.push({ path: this.editPageUrl, query: { dataId: row.oid }});

            },

            refresh() {
                this.$refs.grid.refresh();
            },

            confirm(type) {
                let ele = type == 1 ? this.$refs.reform : this.$refs.form
                let selectionRecords = this.$refs.infoTable.getSelectRecords();
                let infoData = this.getInfoTableData();
                infoData.map((item, index) => {
                    selectionRecords.forEach((select, index) => {
                        if (item.ROW_ID == select.ROW_ID) {
                            item.wtzg = this.formModelReform;
                        } else {
                            item.wtzg = {};
                        }
                    })
                })

                this.formModel.qisRczxjdInfos = infoData;
                ele.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/QisRczxjd/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visible = false;
                                this.visibleReform = false;
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

            getInfoTableData() {
                /*let insertAttaData = this.$refs.infoTable.getInsertRecords();
                let removeAttaData = this.$refs.infoTable.getRemoveRecords();
                let updateAttaData = this.$refs.infoTable.getUpdateRecords();
                removeAttaData.map(o => {o.version = -1});
                return insertAttaData.concat(removeAttaData,updateAttaData);
                */
                return this.$refs.infoTable.getTableData().tableData;
            },

            edit(row) {
                /*this.visible = true;

                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                });

                this.infoTableData = [];
                this.getInfoData(row.oid);*/

                this.$router.push({path: this.editPageUrl, query: {dataId: row.oid}});
            }
            ,
// 查看
            showDetail (row) {
                this.$refs.detail.getDetail(row.oid)
            },
            view(row) {
                this.$router.push({path: this.editPageUrl, query: {dataId: row.oid}});
            },

            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisRczxjd/del", {params: {id: row.oid}})
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

            selectDept(depts) {
                this.formModel.oidBjdw = depts[0].oid;
                this.formModel.bjdwCode = depts[0].deptCode;
            },

            addInfo() {
                let record = {}
                this.$refs.infoTable.insertAt(record, -1)
                    .then(({row}) => this.$refs.infoTable.setActiveRow(row))
            },

            // 获取检查信息数据
            getInfoData(oidRczxjc) {
                this.$axios.get("/pms/QisRczxjdInfo/listByOidRczxjd", {params: {oidRczxjc: oidRczxjc}})
                    .then(result => {
                        result.data.map(d => {
                            this.infoTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取检查信息数据失败！")
                    })
            },

            addProject() {
                this.visibleProject = true;
            },

            selectProject(item) {
                this.formModel.oidXm = item[0].oid;
                this.formModel.xmname = item[0].xmname;
                this.formModel.xmcode = item[0].xmcode;
                this.visibleProject = false;
            },

            closeVisible() {
                this.visibleProject = false;
            },

            selectPerson(p) {
                this.formModel.oidJcr = p[0].oid;
                this.formModel.jcrcode = p[0].code;
            },

            reform() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        let selectionRecords = this.$refs.infoTable.getSelectRecords();
                        if (selectionRecords.length == 0) {
                            this.$message.warning("请选择检查信息!")
                            return;
                        }
                        let oid;
                        selectionRecords.forEach((select, index) => {
                            if (oid == null || oid == '' || oid != undefined) {
                                if (select.oid != null && select.oid != '' && select.oid != undefined) {
                                    oid = select.oid;
                                }
                            }
                        })
                        if (oid) {
                            this.getByOidJcinfo(oid);
                        } else {
                            this.formModelReform = {};
                        }
                        this.visibleReform = true;
                    }
                })
            },

            selectMainPerson(p) {
                this.formModelReform.oidZsr = p[0].oid;
                this.formModelReform.zsrcode = p[0].code;
            },

            selectCopyPerson(p) {
                this.formModelReform.oidCsr = p[0].oid;
                this.formModelReform.csrcode = p[0].code;
            },

            viewChange(row) {
                this.getByOidJcinfo(row.oid);
                this.visibleReform = true;
            },

            getByOidJcinfo(oidJcinfo) {
                this.$axios.get("/pms/QisRczxjdWtzg/getByOidJcinfo", {params: {oidJcinfo: oidJcinfo}})
                    .then(result => {
                        this.formModelReform = {...result.data};
                    })
                    .catch(error => {
                        this.$message.error("获取问题整改数据失败！")
                    })
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