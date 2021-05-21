<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="formModel" status-icon :rules="rules" ref="definition" label-width="140px">
                    <ice-grid-layout :columns="2" name="业务表单">
                        <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                            <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                <el-button v-if="formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                           @click="showSectJh"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                            <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                      placeholder="请选择"
                            >
                                <el-button v-if="formReadonly?false:!sectDisabled" slot="append" icon="el-icon-search"
                                           @click="showSectBm"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="编号" prop="code">
                            <el-input v-model="formModel.code" placeholder="自动生成" readonly="readonly"></el-input>
                        </el-form-item>
                        <el-form-item label="被检单位" prop="bjdw">
                            <ice-dept-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'" v-model="formModel.bjdw"
                                               @select-confirm="selectDept"
                                               :disabled="formReadonly"></ice-dept-selector>
                        </el-form-item>
                        <el-form-item label="被检项目" prop="xmname">
                            <el-input v-model="formModel.xmname" readonly="readonly" @focus="addProject" :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="密级" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        autocomplete="off" :disabled="formReadonly"></ice-select>
                        </el-form-item>
                        <el-form-item label="检查时间" prop="jcsj">
                            <el-date-picker v-model="formModel.jcsj" :disabled="formReadonly"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="监督检查人" prop="jcr">
                            <ice-persion-selector :mode="formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                  @select-confirm="selectPerson" v-model="formModel.jcr"
                                                  :disabled="formReadonly"></ice-persion-selector>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1">
                        <el-form-item label="检查依据" prop="jcyj">
                            <el-input type="textarea" v-model="formModel.jcyj" placeholder="不超过650个字" maxlength="650"
                                      show-word-limit autocomplete="off" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1" name="关联数据">
                        <el-tabs v-model="activeName">
                            <el-tab-pane label="检查信息" name="first">
                                <el-button type="primary" icon="el-icon-plus" @click="addInfo" v-show="!formReadonly">
                                    新增
                                </el-button>
                                <el-button type="primary" icon="el-icon-plus" @click="reform" v-show="!formReadonly">
                                    整改督促
                                </el-button>
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
                                            <el-button type="text" @click="deleteRow(row)" v-show="!formReadonly">删除
                                            </el-button>
                                            <el-button type="text" @click="viewChange(row)" v-show="row.oid != null">
                                                查看整改
                                            </el-button>
                                        </template>
                                    </vxe-table-column>
                                </vxe-table>
                            </el-tab-pane>
                        </el-tabs>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <ice-dialog title="选择项目" :visible.sync="visibleProject" width="1000px">
            <XM_SELECT @closeVisible="closeVisible" @select="selectProject" chooseItem="single"></XM_SELECT>
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
                                        <ice-persion-selector :mode="isLook?'readonly':'onlySelect'" chooseItem="single"
                                                              @select-confirm="selectMainPerson"
                                                              v-model="formModelReform.zsr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="抄送" label-width="100px" prop="csr">
                                        <ice-persion-selector :mode="isLook?'readonly':'onlySelect'" chooseItem="single"
                                                              @select-confirm="selectCopyPerson"
                                                              v-model="formModelReform.csr"></ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                        <ice-select :control-mj="controlMj" :disabled="isLook"
                                                    v-model="formModelReform.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="整改期限" label-width="100px" prop="zgqx">
                                        <el-date-picker :disabled="isLook"
                                                        v-model="formModelReform.zgqx"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="存在问题" label-width="100px" prop="czwt">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.czwt"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改要求" label-width="100px" prop="zgyq">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgyq"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="责任人处理情况" label-width="100px" prop="zrrclqk">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zrrclqk"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="整改情况小结" label-width="100px" prop="zgqkxj">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.zgqkxj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="监督检查负责人确认意见" label-width="100px" prop="jcryj">
                                        <el-input :disabled="isLook" type="textarea" maxlength="650"
                                                  show-word-limit
                                                  placeholder="不超过650个字" v-model="formModelReform.jcryj"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="是否完成整改" label-width="100px" prop="isWc">
                                        <!--<ice-select v-model="formModelReform.isWc" :options="options"></ice-select>-->
                                        <el-select :disabled="isLook" v-model="formModelReform.isWc" placeholder="请选择">
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
                <el-button type="primary" @click="confirmData()">确认</el-button>
                <el-button type="info" @click="visibleReform=false">关闭</el-button>
            </div>
        </ice-dialog>
        <jh-common :jhType="jhType" ref="jhcommon" :jhOid="formModel.oidZljh?formModel.oidZljh:''"
                   @jhConfirm="jhConfirm" @bmConfirm="bmConfirm"></jh-common>
    </div>
</template>

<script>

    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import XM_SELECT from "../../pms/common/XM_SELECT";
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import mixins from '../components/mixins'
    import jhCommon from '../components/jhCommon'
    import {ZLJHZT} from '../../../utils/constant'


    export default {
        mixins: [codeConfigRequest, mixins],
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.JDJC,
                formModel: {
                    code: '',
                    bjdw: '',
                    xmname: '',
                    dataSecretLevcode: '',
                    jcsj: '',
                    jcr: '',
                    jcyj: '',
                },
                formReadonly: false,
                visibleProject: false,
                loading: false,
                activeName: 'first',
                infoTableData: [],
                oidOld: '',

                options: [
                    {value: '1', label: '是'},
                    {value: '0', label: '否'}
                ],

                rules: {
                    bjdw: [
                        {required: true, whitespace: true, message: '请输入被检单位', trigger: 'change'}
                    ],
                    xmname: [
                        {required: true, message: '请选择被检项目', trigger: 'change'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                    jcsj: [
                        {required: true, message: '请选择检查时间', trigger: 'change'}
                    ],
                    jcr: [
                        {required: true, message: '请选择检查人', trigger: 'change'}
                    ],
                    jcyj: [
                        {required: true, whitespace: true, message: '请输入检查依据', trigger: 'blur'}
                    ],
                },

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

                visibleReform: false,
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
                // 是否查看监督
                isLook: false,

                // 流程
                isFlow: true
            }
        },
        methods: {
            handleCallbackFlow(formModel) {
                console.log(formModel.oid)
                this.formModel = formModel;
                this.getInfoData(formModel.oid)
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'rcjd'}).then(res => {
                    this.formModel.code = res.number;
                })
            },
            flowReady(flowContext, formModel) {
                //流程初始化
                //Object.assign(this.formModel,formModel);
                if (formModel.oid) {
                    this.formModel = formModel;
                    this.getInfoData(formModel.oid)
                }

                if (flowContext.nodeId == 'FirstNode') {
                    this.formReadonly = false;
                } else {
                    this.formReadonly = true;
                    //this.rules = {};
                }
            },
            async flowOperateBtn(flowContext, formModel) {
                // this.formModel.qisRczxjdInfos.map(info => {
                //     console.log(info.wtzg)
                //     if (typeof ) {
                //         // info.wtzg = null;
                //     }
                // })
                return await this.$refs.definition.validate();
            },
            flowBizData() {
                //获取业务表单数据
                this.formModel.qisRczxjdInfos = this.getInfoTableData();
                this.formModel.qisRczxjdInfos.map(c => {
                    c.dataSecretLevcode = this.formModel.dataSecretLevcode;
                })
                console.log(this.formModel)
                return this.formModel;
            },

            selectDept(depts) {
                this.formModel.oidBjdw = depts[0].oid;
                this.formModel.bjdwCode = depts[0].deptCode;
            },

            addProject() {
                this.visibleProject = true;
            },
            closeVisible() {
                this.visibleProject = false;
            },
            selectProject(item) {
                this.formModel.oidXm = item[0].oid;
                this.formModel.xmname = item[0].xmname;
                this.formModel.xmcode = item[0].xmcode;
                this.visibleProject = false;
            },
            selectPerson(p) {
                this.formModel.oidJcr = p[0].oid;
                this.formModel.jcrcode = p[0].code;
            },

            addInfo() {
                let record = {}
                this.$refs.infoTable.insertAt(record, -1)
                    .then(({row}) => this.$refs.infoTable.setActiveRow(row))
            },

            reform() {
                this.isLook = false;
                let valid = this.$refs.definition.validate();
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
                    });
                    if (this.oidOld == oid) {
                        if (!this.formModelReform.zsr) {
                            this.getByOidJcinfo(oid);
                        }
                    } else {
                        this.formModelReform = {};
                        if (oid) {
                            this.getByOidJcinfo(oid);
                        }
                    }
                    this.oidOld = oid;
                    this.visibleReform = true;
                }
            },

            viewChange(row) {
                this.getByOidJcinfo(row.oid);
                this.visibleReform = true;
                this.isLook = true;
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

            refresh() {
                this.$refs.grid.refresh();
            },

            confirmData() {
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
                //this.formModel.qisRczxjdInfos = infoData;
                this.$refs.reform.validate((valid) => {
                    if (valid) {
                        this.visibleReform = false;
                    }
                })
            },

            getInfoTableData() {
                return this.$refs.infoTable.getTableData().tableData;
            },

            selectMainPerson(p) {
                this.formModelReform.oidZsr = p[0].oid;
                this.formModelReform.zsrcode = p[0].code;
            },

            selectCopyPerson(p) {
                this.formModelReform.oidCsr = p[0].oid;
                this.formModelReform.csrcode = p[0].code;
            },

            // 获取检查信息数据
            getInfoData(oidRczxjc) {
                this.$axios.get("/pms/QisRczxjdInfo/listByOidRczxjd", {params: {oidRczxjc: oidRczxjc}})
                    .then(result => {
                        this.infoTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取检查信息数据失败！")
                    })
            },
            deleteRow(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.infoTable.remove(row)
                }).catch(() => {
                    console.log('取消成功')
                })
            },
        },

        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
            this.fuzhiData();
        },
        computed: {
            controlMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
        },
        created() {
            this.getCode();
        },

        components: {
            IcePersionSelector,
            XM_SELECT,
            IceDeptSelector,
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            IceSelect,
            IceGridLayout,
            jhCommon
        }
    }

</script>


<style scoped>

</style>
