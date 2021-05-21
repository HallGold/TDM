<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/QisGkmyd/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        :beforeBindData="beforeBindData"

                        ref="grid">
        </ice-query-grid>
        <ice-dialog :title="title" :visible.sync="visible" width="1000px">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane label="意见登记" name="first">
                    <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="质量计划" label-width="100px" prop="zljhCode">
                                    <el-input readonly v-model="formModel.zljhCode" placeholder="请选择">
                                        <el-button v-if="!sectDisabled" slot="append" icon="el-icon-search"
                                                   @click="showSectJh"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编辑部门" label-width="100px" prop="oidDepRel">
                                    <el-input readonly v-model="formModel.depRelName" maxlength="16"
                                              placeholder="请选择"
                                    >
                                        <el-button v-if="!sectDisabled" slot="append" icon="el-icon-search"
                                                   @click="showSectBm"></el-button>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="顾客单位" label-width="100px" prop="gkdw">
                                    <el-input maxlength="65" v-model="formModel.gkdw"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="提出人" label-width="100px" prop="yjtcr">
                                    <el-input maxlength="16" v-model="formModel.yjtcr"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="责任单位" label-width="100px" prop="zrdw">
                                    <ice-dept-selector chooseItem="single" mode="onlySelect"
                                                       v-model="formModel.zrdw"
                                                       @select-confirm="selectDept">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="负责人" label-width="100px" prop="zrr">
                                    <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                          :dept-code="formModel.zrdwCode" v-model="formModel.zrr">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="整改日期" label-width="100px" prop="zgqxDate">
                                    <el-date-picker v-model="formModel.zgqxDate"
                                                    :picker-options="pickerOptions(3)"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="提出日期" label-width="100px" prop="yjtcDate">
                                    <el-date-picker v-model="formModel.yjtcDate"
                                                    :picker-options="pickerOptions(1)"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="完成日期" label-width="100px" prop="wcDate">
                                    <el-date-picker v-model="formModel.wcDate"
                                                    :picker-options="pickerOptions(2)"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="来源渠道" label-width="100px" prop="yjsjqd">
                                    <ice-select v-model="formModel.yjsjqd" filterable map-type-code="LYQD"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="编号" label-width="100px" prop="dcbCode">
                                    <el-input v-model="formModel.dcbCode" readonly placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                    <ice-select :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                autocomplete="off"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="顾客意见内容" label-width="100px" prop="yjnr">
                                    <el-input type="textarea" v-model="formModel.yjnr" maxlength="650"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="整改措施" label-width="100px" prop="zgcs">
                                    <el-input type="textarea" v-model="formModel.zgcs" maxlength="650"
                                              show-word-limit></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button type="info" @click="visible=false">关闭</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="相关附件" name="second">
                    <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" :data="attaTableData" ref="attachment"
                                :is-handleer="!formReadonly"></ATTACHMENT>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button type="info" @click="visible=false">关闭</el-button>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </ice-dialog>
        <ice-dialog title="顾客意见回访记录" :visible.sync="visibleBack" width="1000px">
            <ice-query-grid data-url="/pms/QisGkyjhf/list"
                            :query="queryBack"
                            :operations-width="200"
                            :columns="columnsBack"
                            :buttons="buttonsBack"
                            :operations="operationsBack"
                            ref="gridBack">
            </ice-query-grid>
        </ice-dialog>
        <ice-dialog titleBack="意见回访" :visible.sync="visibleForm" width="1000px">
            <el-form :model="formModelBack" :rules="rulesBack" ref="formBack" v-loading="loadingBack">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="责任单位" label-width="100px" prop="zrdw">
                            <el-input readonly v-model="formModelBack.zrdw"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="顾客单位" label-width="100px" prop="gkdw">
                            <el-input readonly v-model="formModelBack.gkdw"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="回访类型" label-width="100px" prop="yjsjqd">
                            <ice-select disabled v-model="formModelBack.yjsjqd" map-type-code="LYQD"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="提出日期" label-width="100px" prop="yjtcDate">
                            <el-date-picker readonly v-model="formModelBack.yjtcDate"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                            <ice-select v-model="formModelBack.dataSecretLevcode"
                                        :control-mj="[back.dataSecretLevcode]"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="顾客意见内容" label-width="100px" prop="yjnr">
                            <el-input readonly type="textarea" v-model="formModelBack.yjnr"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="整改情况" label-width="100px" prop="zgqk">
                            <el-input type="textarea" v-model="formModelBack.zgqk"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="顾客对整改的意见" label-width="100px" prop="zgyj">
                            <el-input type="textarea" v-model="formModelBack.zgyj"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="confirmBack">保存</el-button>
                <el-button type="info" @click="visibleForm=false">关闭</el-button>
            </div>
        </ice-dialog>
        <jh-common :jhType="jhType" ref="jhcommon" :jhOid="formModel.oidZljh?formModel.oidZljh:''"
                   @jhConfirm="jhConfirm" @bmConfirm="bmConfirm"></jh-common>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/biz/js/Validator";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import ATTACHMENT from "../../pms/common/ATTACHMENT";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import moment from 'moment';
    import mixins from '../components/mixins'
    import jhCommon from '../components/jhCommon'

    import codeConfigRequest from '@/utils/codeConfigRequest';
    import {ZLJHZT} from '../../../utils/constant'


    export default {
        name: "mydgl",
        mixins: [codeConfigRequest, mixins],
        data() {
            return {
                // 获取计划状态常量
                jhType: ZLJHZT.GKGT,
                changeFjSrdata: [],
                dcbid: '',
                back: {},
                visibleForm: false,
                formReadonly: false,
                visibleBm: false,
                activeName: 'first',
                title: '',
                attaTableData: [],
                titleBack: '',
                visible: false,
                visibleBack: false,
                loading: false,
                loadingBack: false,
                formModel: {
                    oid: '',
                    dcbCode: '',
                    gkdw: '',
                    zrdwId: '',
                    zrrCode: '',
                    yjtcr: '',
                    zrdw: '',
                    zrdwCode: '',
                    yjtcDate: '',
                    zrr: '',
                    zgqxDate: '',
                    wcDate: '',
                    yjsjqd: '',
                    dataSecretLevcode: '',
                    yjnr: '',
                    zgcs: '',
                    xtFjs: [],
                },
                formModelBack: {
                    oid: '',
                    zrdw: '',
                    gkdw: '',
                    yjsjqd: '',
                    yjtcDate: '',
                    yjnr: '',
                    zgqk: '',
                    zgyj: '',
                },
                query: [
                    {type: 'input', code: 'dcbCode', label: '编号', value: ''},
                    {type: 'input', code: 'gkdw', label: '提出人单位', value: ''},
                    {type: 'input', code: 'yjtcr', label: '意见提出人', value: ''},
                    {type: 'input', code: 'yjsjqd', label: '意见收集渠道', value: ''},
                    {type: 'input', code: 'zrr', label: '责任人', value: ''},
                    {type: 'date', code: 'zgqxDate', label: '整改期限', exp: '='},
                    {type: 'input', code: 'zrdw', label: '责任单位'},
                    {type: 'date', code: 'wcDate', label: '完成日期'},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                queryBack: [
                    {
                        type: 'static', code: 'dcbid', exp: '=', value: () => {
                            return this.dcbid
                        }
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'yjnr', hidden: true},
                    {code: 'zgcs', hidden: true},
                    {code: 'yjtcDate', hidden: true},
                    {label: '编号', code: 'dcbCode', width: 140, sortable: true},
                    {label: '顾客单位', code: 'gkdw', width: 200, sortable: true},
                    {label: '计划编码', code: 'zljhCode', width: 100, sortable: true},
                    {label: '执行部门', code: 'depRelCode', width: 100, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: '提出人', code: 'yjtcr', width: 100, sortable: true},
                    {label: '意见收集渠道', code: 'yjsjqd', width: 160, mapTypeCode: 'LYQD', sortable: true},
                    {label: '责任单位', code: 'zrdw', width: 180, sortable: true},
                    {label: '责任人', code: 'zrr', width: 140, sortable: true},
                    {
                        label: '整改期限', code: 'zgqxDate', width: 140, sortable: true, formatter(row) {
                            return moment(row.zgqxDate).format('YYYY-MM-DD')
                        }
                    },
                    {
                        label: '完成日期', code: 'wcDate', width: 140, sortable: true, formatter(row) {
                            return moment(row.wcDate).format('YYYY-MM-DD')
                        }
                    },
                    {
                        label: '密级',
                        code: 'dataSecretLevcode',
                        width: 60,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: '质量计划', code: 'oidZljh', width: 100, hidden: true},
                    {label: '部门', code: 'oidDepRel', width: 100, hidden: true},
                    {label: '部门名字', code: 'depRelName', width: 100},
                    // {label: '附件', code: 'fj', width: 140, sortable: true}
                ],
                columnsBack: [
                    {code: 'oid', hidden: true},
                    {code: 'yjnr', hidden: true},
                    {code: 'zgqk', hidden: true},
                    {code: 'zgyj', hidden: true},
                    {label: '责任单位', code: 'zrdw', width: 140, sortable: true},
                    {label: '意见提出单位', code: 'gkdw', width: 140, sortable: true},
                    {label: '回访类型', code: 'yjsjqd', mapTypeCode: 'LYQD', width: 120, sortable: true},
                    {
                        label: '意见提出时间', code: 'yjtcDate', width: 100, sortable: true, formatter(row) {
                            return moment(row.yjtcDate).format('YYYY-MM-DD')
                        }
                    },
                    {
                        label: '密级',
                        code: 'dataSecretLevcode',
                        width: 50,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL',
                    },
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: "el-icon-refresh",
                        type: 'primary',
                        ctrlCode: "BXZ",
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
                buttonsBack: [
                    {name: '刷新', icon: "el-icon-refresh", type: 'primary', ctrlCode: "BXZ", callback: this.RefreshBack},
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addBack},
                ],
                operationsBack: [
                    {name: '编辑', callback: this.editBack, ctrlCode: "BXZ"},
                    {name: '删除', callback: this.deleteBack, ctrlCode: "BXZ"},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BXZ"},
                    {name: '回访', callback: this.callBack, ctrlCode: "BXZ"},
                    {
                        name: '删除', callback: this.delete, ctrlCode: "BSC", isShow(row) {
                            return row.zljhCode ? false : true
                        }
                    },
                ],
                rules: {
                    gkdw: [
                        {required: true, whitespace: true, message: '请填写顾客单位', trigger: 'blur'}
                    ],
                    yjtcr: [
                        {required: true, whitespace: true, message: '请填写提出人', trigger: 'blur'}
                    ],
                    zrdw: [
                        {required: true, message: '请选择责任单位', trigger: 'change'}
                    ],
                    zrr: [
                        {required: true, message: '请选择单位负责人', trigger: 'change'}
                    ],
                    yjtcDate: [
                        {required: true, message: '请选择提出日期', trigger: 'change'}
                    ],
                    zgqxDate: [
                        {required: true, message: '请选择整改期限', trigger: 'change'}
                    ],
                    wcDate: [
                        {required: true, message: '请选择完成日期', trigger: 'change'}
                    ],
                    yjsjqd: [
                        {required: true, message: '请选择来源渠道', trigger: 'change'}
                    ],
                    yjnr: [
                        {whitespace: true, message: '请填写意见内容', trigger: 'blur'}
                    ],
                    zgcs: [
                        {whitespace: true, message: '请填写整改措施', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [{required: true, message: '请选择密级', trigger: 'change'}],
                },
                rulesBack: {
                    zgqk: [
                        {required: true, whitespace: true, message: '请填写整改情况', trigger: 'blur'}
                    ],
                    zgyj: [
                        {required: true, whitespace: true, message: '请填写整改意见', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [{required: true, message: '请选择密级', trigger: 'change'}],
                }
            }
        },
        methods: {
            // 日期控制
            pickerOptions(type) {
                if (type == 1) {
                    let end = this.formModel.zgqxDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else if (type == 2) {
                    let start = this.formModel.zgqxDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                } else {
                    let start = this.formModel.yjtcDate;
                    let end = this.formModel.wcDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            let eStr = moment(end).valueOf();
                            return time.getTime() < dStr || time.getTime() > eStr;
                        }
                    }
                }
            },
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'gkmyd'}).then(res => {
                    this.formModel.dcbCode = res.number;
                })
            },
            handleClick(e) {
                if (e.name == "second") {
                    this.$nextTick(() => {
                        this.$refs.attachment.resize();
                    })
                }
            },
            confirm() {
                this.formModel.xtFjs = this.$refs.attachment.getData();
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/QisGkmyd/saveOrUpdate", this.formModel)
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
            confirmBack() {
                this.$refs.formBack.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.formModelBack.dcbId = this.back.oid;
                        this.$axios.post("/pms/QisGkyjhf/saveOrUpdate", this.formModelBack)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.visibleForm = false;
                                this.$refs.gridBack.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loadingBack = false
                            })
                    }
                })
            },
            addItem() {
                this.title = '顾客意见登记';
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getCode();
                    this.fuzhiData();
                })
                this.attaTableData = [];
            },
            addBack() {
                this.titleBack = '意见回访';
                this.$nextTick(_ => {
                    for (let i in this.formModelBack) {
                        this.formModelBack[i] = this.back[i]
                    }
                    this.formModelBack.oid = '';
                })
                this.visibleForm = true
            },
            edit(row) {
                this.title = '顾客意见登记';
                this.visible = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                    this.getXtFjData(row.oid)
                    this.$refs.attachment.resize();
                })
            },

            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisGkmyd/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取行数据失败！")
                    })
            },
            editBack(row) {
                this.visibleForm = true;
                this.$nextTick(_ => {
                    this.formModelBack = {...row}
                })
            },
            callBack(row) {
                this.visibleBack = true
                this.back = row
                this.dcbid = row.oid
                this.$nextTick(_ => {
                    this.RefreshBack();
                })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            RefreshBack() {
                this.$refs.gridBack.refresh();
            },
            delete(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisGkmyd/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除成功")
                        })
                }).catch(_ => {

                })
            },
            deleteBack(row) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/pms/QisGkyjhf/del", {params: {id: row.oid}})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.$refs.gridBack.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除成功")
                        })
                }).catch(_ => {

                })
            },
            // 获取系统附件数据
            getXtFjData(boid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                        this.changeFjSrdata = this.attaTableData;
                    })
                    .catch(error => {
                        this.$message.error("获取系统附件数据失败！")
                    })
            },
            selectDept(depts) {
                this.formModel.zrdwCode = depts[0].deptCode
                this.formModel.zrdwId = depts[0].oid
                this.formModel.zrr = '';
            },
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
        components: {
            IceDeptSelector,
            IcePersionSelector,
            IceQueryGrid,
            IceDialog,
            ATTACHMENT,
            IceSelect,
            jhCommon
        }
    }
</script>

<style scoped>

</style>
