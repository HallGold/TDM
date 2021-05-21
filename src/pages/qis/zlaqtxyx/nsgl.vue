<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/QisNsgl/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        :beforeBindData="beforeBindData"
                        ref="grid">
        </ice-query-grid>

        <ice-dialog :title="titleTop" :visible.sync="visible" width="1025px">
            <el-row>
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="基本信息" name="first">
                        <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="质量计划" label-width="140px" prop="zljhCode">
                                        <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                            <el-button v-if="disabled?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                       @click="showSectJh"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="编辑部门" label-width="140px" prop="oidDepRel">
                                        <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                                  placeholder="请选择"
                                        >
                                            <el-button v-if="disabled?false:!sectDisabled" slot="append" icon="el-icon-search"
                                                       @click="showSectBm"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="编号" label-width="140px" prop="nsbgcode">
                                        <el-input v-model="formModel.nsbgcode" placeholder="自动生成"
                                                  :disabled=true></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="报告名称" label-width="140px" prop="nsbgname">
                                        <el-input maxlength="80" v-model="formModel.nsbgname" placeholder="请输入"
                                                  :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="批准人" label-width="140px" prop="pzr">
                                        <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                              v-model="formModel.pzr"
                                                              @select-confirm="depts=>formModel.pzrCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="批准日期" label-width="140px" prop="pzrq">
                                        <el-date-picker v-model="formModel.pzrq" type="date" placeholder="请选择日期"
                                                        :disabled="disabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="受审核方" label-width="140px" prop="sshf">
                                        <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                           v-model="formModel.sshf"
                                                           @select-confirm="depts=>formModel.sshfCode=depts[0].deptCode">
                                        </ice-dept-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="受审核负责人" label-width="140px" prop="sshr">
                                        <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                              v-model="formModel.sshr"
                                                              @select-confirm="depts=>formModel.sshrCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="审核组组长" label-width="140px" prop="shzz">
                                        <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                              v-model="formModel.shzz"
                                                              @select-confirm="depts=>formModel.shzzCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="审核员" label-width="140px" prop="shy">
                                        <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                              v-model="formModel.shy"
                                                              @select-confirm="depts=>formModel.shyCode=depts[0].code">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="审核目的" label-width="140px" prop="shmd">
                                        <el-input v-model="formModel.shmd" type="textarea" :disabled="disabled"
                                                  :rows="4" maxlength="650"
                                                  show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="审核范围" label-width="140px" prop="shfw">
                                        <el-input v-model="formModel.shfw" type="textarea" :disabled="disabled"
                                                  :rows="4" maxlength="650"
                                                  show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="审核准则" label-width="140px" prop="shgz">
                                        <el-input v-model="formModel.shgz" type="textarea" :disabled="disabled"
                                                  :rows="4" maxlength="650"
                                                  show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="审核日期" label-width="140px" prop="shrq">
                                        <el-date-picker v-model="formModel.shrq" type="date" placeholder="请选择日期"
                                                        :disabled="disabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="上次审核日期" label-width="140px" prop="shrqsc">
                                        <el-date-picker v-model="formModel.shrqsc" type="date" placeholder="自动带入"
                                                        :disabled=true></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="上次审核编号" label-width="140px" prop="shbhsc">
                                        <el-input v-model="formModel.shbhsc" placeholder="自动带入"
                                                  :disabled=true></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :control-mj-par="controlMjPar" v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL" :disabled="disabled"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="附件上传" name="first2">
                        <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" :is-handleer="isHandleer"
                                    :data="attaTableData"
                                    ref="attachment"></ATTACHMENT>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="confirm" :disabled="disabled">确认</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>

        <!-- 选择人员 -->
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
        <ice-dialog title="部门选择" :visible.sync="visibleBm" width="500px">
            <ice-custom-tree Width="480px" :unbrid="unbrid" :transfer="transfer.treeData"
                             @handleCallback="handleCallbackTree"></ice-custom-tree>
        </ice-dialog>
        <jh-common ref="jhcommon" :jhType="jhType" :jhOid="formModel.oidZljh?formModel.oidZljh:''"
                   @jhConfirm="jhConfirm" @bmConfirm="bmConfirm"></jh-common>
    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import moment from 'moment';
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import UserSelector from "@/pages/biz/personnel/common/userSelector";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";

    import codeConfigRequest from '@/utils/codeConfigRequest'
    import mixins from '../components/mixins'
    import jhCommon from '../components/jhCommon'
    import {ZLJHZT} from '../../../utils/constant'

    export default {
        name: "nsgl",
        mixins: [codeConfigRequest, mixins],
        components: {
            IceFormGroup,
            IceDialog,
            IceQueryGrid,
            isLetterAndNumber,
            IceSelect,
            PmsTableTree,
            ATTACHMENT,
            UserSelector,
            IceCustomTree,
            IceDeptSelector,
            IcePersionSelector,
            jhCommon
        },
        computed: {
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar() {
                // 附件
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr2];
            }
        },
        created() {
            this.lastAuditInfo();
        },
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.NS,
                changeFjSrdata: [],
                activeName: 'first',
                titleTop: '',
                disabled: true,
                loading: false,
                visible: false,
                visibleBm: false,
                unbrid: true,
                isHandleer: true,
                person: '',
                attaTableData: [],
                LastAuditInfo: {},
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/permission/frame_org/load_table_tree?loadDisabled=false',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'deptName',
                            children: 'children'
                        },
                        nodeKey: 'oid',
                        // 请求传递参数
                        initModel: {}
                    },
                    value: '',
                    placeholder: '请选择'
                },
                formModel: {
                    oid: '',//
                    nsbgcode: '',//报告编号
                    nsbgname: '',//报告名称
                    shzz: '',//审核组长
                    oidShzz: '',//审核组长ID
                    shzzCode: '',//审核组长编号
                    shrq: '',//审核日期
                    pzr: '',//批准
                    oidPzr: '',//批准人ID
                    pzrCode: '',//批准人编号
                    pzrq: '',//批准日期
                    sshf: '',//受审核方
                    oidSshf: '',//受审核方ID
                    sshfCode: '',//受审核方编号
                    sshr: '',//受审核负责人
                    sshrid: '',//受审核负责人ID
                    shrqsc: '',//上次审核日期
                    shbhsc: '',//上次审核编号
                    dataSecretLevcode: '',//密级
                    shy: '',//审核员
                    oidShy: '',//审核员ID
                    shyCode: '',//审核员编号
                    shmd: '',//审核目的
                    shfw: '',//审核范围
                    shgz: '',//审核准则
                },
                query: [
                    {type: 'input', code: 'nsbgcode', label: '报告编号', value: ""},
                    {type: 'input', code: 'nsbgname', label: '报告名称', value: ""},
                    {type: 'input', code: 'shzz', label: '审核组长', value: ""},
                    {type: 'date', code: 'shrq', label: '审核日期', value: ""},
                    {type: 'input', code: 'pzr', label: '批准人', value: ""},
                    {type: 'date', code: 'pzrq', label: '批准时间', value: ""},
                    {type: 'input', code: 'sshf', label: '受审核方', value: ""},
                    {type: 'input', code: 'sshr', label: '受审核负责人', value: ""},
                    {type: 'date', code: 'shrqsc', label: '上次审核日期', value: ""},
                    {type: 'input', code: 'shbhsc', label: '上次审核编号', value: ""},
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
                    {label: '报告编号', code: 'nsbgcode', width: 200,},
                    {label: '报告名称', code: 'nsbgname', width: 200},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '审核组长', code: 'shzz', width: 200,},
                    {label: '审核组长ID', code: 'oidShzz', hidden: true},
                    {label: '审核组长编号', code: 'shzzCode', hidden: true},
                    {
                        label: '审核日期', code: 'shrq', width: 200, formatter(row) {
                            return row.shrq === null ? null : moment(row.shrq).format('YYYY-MM-DD');
                        }
                    },
                    {label: '批准', code: 'pzr', width: 200},
                    {label: '批准人ID', code: 'oidPzr', hidden: true},
                    {label: '批准人编号', code: 'pzrCode', hidden: true},
                    {
                        label: '批准日期', code: 'pzrq', width: 200, formatter(row) {
                            return row.pzrq === null ? null : moment(row.pzrq).format('YYYY-MM-DD');
                        }
                    },
                    {label: '受审核方', code: 'sshf', width: 200,},
                    {label: '受审核方ID', code: 'oidSshf', hidden: true},
                    {label: '受审核方编号', code: 'sshfCode', hidden: true},
                    {label: '受审核负责人', code: 'sshr', width: 200,},
                    {label: '受审核负责人ID', code: 'sshrid', hidden: true,},
                    {label: '受审核负责人编码', code: 'sshrcode', hidden: true,},
                    {
                        label: '上次审核日期', code: 'shrqsc', width: 200, formatter(row) {
                            return row.shrqsc === null ? null : moment(row.shrqsc).format('YYYY-MM-DD');
                        }
                    },
                    {label: '上次审核编号', code: 'shbhsc', width: 200},
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '审核员', code: 'shy', hidden: true,},
                    {label: '审核员ID', code: 'oidShy', hidden: true},
                    {label: '审核员编号', code: 'shyCode', hidden: true},
                    {label: '审核目的', code: 'shmd', hidden: true},
                    {label: '审核范围', code: 'shfw', hidden: true},
                    {label: '审核准则', code: 'shgz', hidden: true},
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    {label: '部门名字', code: 'depRelName', width: 100},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-right',
                        type: 'primary',
                        ctrlCode: "BSX",
                        callback: this.buttonRefresh
                    },
                    {
                        name: '新增',
                        icon: 'el-icon-plus',
                        type: 'primary',
                        ctrlCode: "BXZ",
                        callback: this.addItem,
                        disabled: () => {
                            return this.isExist || (this.jhdata.isDetail ? true : false)
                        }
                    },
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            return row.zljhCode ? false : true
                        }
                    },
                ],
                rules: {
                    pzr: [
                        {required: true, message: '批准人不能为空'}
                    ],
                    pzrq: [
                        {required: true, message: '批准日期不能为空'}
                    ],
                    sshf: [
                        {required: true, message: '受审核方不能为空'}
                    ],
                    sshr: [
                        {required: true, message: '受审核负责人不能为空'}
                    ],
                    shzz: [
                        {required: true, message: '审核组长不能为空'}
                    ],
                    shy: [
                        {required: true, message: '审核员不能为空'}
                    ],
                    shmd: [
                        {required: true, message: '审核目的不能为空'}
                    ],
                    shfw: [
                        {required: true, message: '审核范围不能为空'}
                    ],
                    shgz: [
                        {required: true, message: '审核准则不能为空'}
                    ],
                    shrq: [
                        {required: true, message: '审核日期不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],
                },
            }
        },
        methods: {
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'nsgl'}).then(res => {
                    this.formModel.nsbgcode = res.number;
                })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            addItem() {
                this.titleTop = '新增';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.attaTableData = [];
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getCode();
                    this.fuzhiData();
                })
                this.formModel.deleteStatus = 0;
                this.lastAuditInfo();
            },
            edit(row) {
                this.titleTop = '编辑';
                this.visible = true;
                this.disabled = false;
                this.isHandleer = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                })
                this.getFjData(row.oid);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisNsgl/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.formModel.xtFjs = this.$refs.attachment.getData();
                        this.$axios.post('/pms/QisNsgl/saveOrUpdate', this.formModel).then(reault => {
                            this.visible = false;
                            this.LastAuditInfo = {};
                            this.buttonRefresh();
                            this.$message.success("保存成功！");
                        }).catch(error => {
                            this.$message.error("保存失败！");
                        }).finally(_ => {
                            this.loading = false;
                        })
                    }
                })
            },
            delete(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.loading = true;
                    this.formModel = {...row};
                    this.formModel.deleteStatus = 1;
                    this.formModel.xtFjs = [];
                    this.$axios.post('/pms/QisNsgl/saveOrUpdate', this.formModel).then(reault => {
                        this.buttonRefresh();
                        this.$message.success("删除成功！");
                    }).catch(error => {
                        this.$message.error("删除失败！");
                    }).finally(_ => {
                        this.loading = false;
                    })
                })
            },
            getFjData(oid) {
                this.attaTableData = [];
                this.$axios.get('/pms/XtFj/listByBoid', {params: {boid: oid}})
                    .then(result => {
                        if (result.data.length != 0) {
                            result.data.map(d => {
                                this.attaTableData.push(d);
                            });
                            this.changeFjSrdata = this.attaTableData;
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取附件失败！");
                    })
            },
            //上次审核信息
            lastAuditInfo() {
                if (!this.LastAuditInfo.shbhsc) {
                    this.$axios.get('/pms/QisNsgl/lastAuditInfo').then(resault => {
                        if (resault.data) {
                            this.LastAuditInfo = resault.data;
                            this.formModel.shrqsc = this.LastAuditInfo.shrqsc;
                            this.formModel.shbhsc = this.LastAuditInfo.shbhsc;
                        }
                    }).catch(error => {
                        this.$message.error("获取上次审批信息失败！");
                    })
                } else {
                    this.formModel.shrqsc = this.LastAuditInfo.shrqsc;
                    this.formModel.shbhsc = this.LastAuditInfo.shbhsc;
                }
            },
            //部门树
            handleCallbackTree(data) {
                this.formModel.sshf = data.deptName;
                this.formModel.sshfCode = data.deptCode;
                // this.formModel.oidSshf = data.deptCode;
                if (data.deptName != '三所') {
                    this.visibleBm = false;
                }
            },
            getUserData(data) {
                switch (this.person) {
                    case "pzr":
                        this.formModel.pzr = data[0].name;
                        this.formModel.oidPzr = data[0].oid;
                        this.formModel.pzrCode = data[0].code;
                        break;
                    case "sshr":
                        this.formModel.sshr = data[0].name;
                        this.formModel.sshrid = data[0].oid;
                        this.formModel.sshrcode = data[0].code;
                        break;
                    case "shzz":
                        this.formModel.shzz = data[0].name;
                        this.formModel.oidShzz = data[0].oid;
                        this.formModel.shzzCode = data[0].code;
                        break;
                    case "shy":
                        this.formModel.shy = data[0].name;
                        this.formModel.oidShy = data[0].oid;
                        this.formModel.shyCode = data[0].code;
                        break;
                    default:
                }
            },
            showPzr(data) {
                this.person = 'pzr';
                this.showRy();
            },
            showShef(data) {
                this.visibleBm = true;
            },
            showFzr(data) {
                this.person = 'sshr';
                this.showRy();
            },
            showZz(data) {
                this.person = 'shzz';
                this.showRy();
            },
            showShy(data) {
                this.person = 'shy';
                this.showRy();
            },
            showRy() {
                this.$refs.us.openDialog();
            },


        },
    }
</script>

<style scoped>

</style>
