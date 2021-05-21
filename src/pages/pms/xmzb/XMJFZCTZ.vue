<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/PmsXmJfzctz/list"
                        exportTitle="项目经费支出台账导出"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid"
                        @selection-change="selectionChange">

        </ice-query-grid>
        <ice-dialog :title="titleTop" :visible.sync="visible" height="500px" width="1025px">
            <el-row style="height: 450px;">
                <el-tabs v-model="activeName" type="border-card">
                    <el-tab-pane label="经费支出登记" name="first">
                        <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="任务" label-width="140px" prop="rwname">
                                        <el-input v-model="formModel.rwname" placeholder="点击选择" @focus="showRw"
                                                  :disabled="disabled">
                                            <el-button v-if="!disabled" slot="append" icon="el-icon-edit-outline"
                                                       @click="showRw"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目" label-width="140px" prop="xmname">
                                        <el-input v-model="formModel.xmname" placeholder="点击选择" @focus="showXm"
                                                  :disabled="disabled">
                                            <el-button v-if="!disabled" slot="append" icon="el-icon-edit-outline"
                                                       @click="showXm"></el-button>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="合同" label-width="140px" prop="htname">
                                        <el-input v-model="formModel.htname" placeholder="点击选择" @focus="showHt"
                                                  :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :control-mj="controlMj" :controlMjPar="controlMjPar"
                                                    v-model="formModel.dataSecretLevcode"
                                                    map-type-code="DATA_SECRET_LEVEL" :disabled="disabled"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="经手人" label-width="140px" prop="zcSqr">
                                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                              v-model="formModel.zcSqr"
                                                              @select-confirm="depts=>{getUserData(depts)}">
                                        </ice-persion-selector>

                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="支出申请日期" label-width="140px" prop="dateSq">
                                        <el-date-picker v-model="formModel.dateSq" type="date" placeholder="请选择"
                                                        :disabled="disabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="支出金额" label-width="140px" prop="zcje">
                                        <el-input v-model="formModel.zcje" placeholder="请输入" type="number"
                                                  :disabled="disabled">
                                            <template slot="append">元</template>
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="付款日期" label-width="140px" prop="dateZc">
                                        <el-date-picker v-model="formModel.dateZc" type="date" placeholder="请选择"
                                                        :disabled="disabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="付款说明" label-width="140px" prop="fksm">
                                        <el-input v-model="formModel.fksm" :disabled="disabled" type="textarea"
                                                  placeholder="不超过330字" maxlength="330" show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                        <el-input v-model="formModel.dateRemark" :disabled="disabled"
                                                  type="textarea" maxlength="650" show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <!-- <el-row :gutter="20">
                                <ice-single-upload :fileData="fileInfo" v-model="fileInfo.dataid" :on-success="fileUploadSuccess" ref="fileUpload" :isUploader=true></ice-single-upload>
                            </el-row> -->
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="附件列表" name="second">
                        <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" :data="attaTableData"
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
        <ice-dialog :visible.sync="visibleProject" width="800px">
            <el-tabs>
                <el-row>
                    <xm-selector chooseItem="single" @closeVisible="visibleProject=false"
                                 @select="selectProject"></xm-selector>
                </el-row>
            </el-tabs>
        </ice-dialog>
        <pms-table-tree ref="tableTree" :unbrid="unbrid" :dialogConfig="dialogConfig"
                        :tableObject="tableObject" :inpWidth="width"
                        :transfer="transfer" @handleCallback="handleCallback"
                        @handleClose="handleToggleDialog"
                        @handleTreeCallback="handleTreeCallback"></pms-table-tree>
        <ice-dialog title="合同选择" :visible.sync="contractVisible" width="1200px">
            <ice-query-grid
                    data-url="/pms/PmsHtinfo/list"
                    exportTitle="合同信息登记"
                    :operations-width="120"
                    :columns="projectContract.columns"
                    :buttons="projectContract.buttons1"
                    :query="projectContract.query"
                    :operations="projectContract.buttons1"
                    chooseItem="single"
                    @selection-change="handleSectedContract"
                    ref="grid2">
            </ice-query-grid>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleSectContract">确认</el-button>
                <el-button type="info" @click="contractVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader service="XmJfzctzExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XmSelector from "../common/XM_SELECT";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import moment from 'moment';
    import ATTACHMENT from "../common/ATTACHMENT";
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import UserSelector from "@/pages/biz/personnel/common/userSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";


    export default {
        components: {
            IceFormGroup,
            IceFlowForm,
            IceDialog,
            IceQueryGrid,
            isLetterAndNumber,
            IceSelect,
            IceSingleUpload,
            XmSelector,
            PmsTableTree,
            ATTACHMENT,
            IceExcelUploader,
            UserSelector,
            IcePersionSelector
        },
        name: "XMJFZCTZ",
        data() {
            return {
                activeName: 'first',
                title: '',
                titleTop: '',
                visible: false,
                loading: false,
                disabled: false,
                isHandleer: true,
                selectData: [],
                attaTableData: [],
                visibleProject: false,
                fileInfo: {},
                //左树右表start
                dialogVisible: true,
                input2: '',
                value: '',
                width: '300px',
                unbrid: true,
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/Xminfo/listByYear',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {
                            years: this.nearFiveYears()
                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
                fileData: {
                    filename: '文件名称',
                },
                // title: '123',
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,

                },
                visibleImport: false,
                sectedContract: [],
                contractVisible: false,
                projectContract: {
                    query: [
                        {type: 'input', code: 'htname', label: '合同名称'},
                        {type: 'input', code: 'htcode', label: '合同编号'},
                        {type: 'input', code: 'htjf', label: '甲方'},
                        {type: 'input', code: 'htyf', label: '乙方'},
                        {type: 'date', code: 'dateCreate', label: '合同签订日期', exp: '='},
                        {type: 'date', code: 'dateStart', label: '合同生效日期', exp: '='},
                        {type: 'date', code: 'dateEnd', label: '合同终止日期', exp: '='},
                        {type: 'static', code: 'spzt', label: '审批状态', exp: '=', value: 'SPZT30'},
                        {
                            type: 'static', code: 'dataSecretLevcode', label: '密级', exp: 'in', value: () => {
                                let he = this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode, ...this.controlMj] : this.controlMj;

                                let min = he.length>0?Math.min.apply(null, he):'';
                                console.log(min)
                                let arr = [];
                                if (min) {
                                    for (let i = 1; i <= min; i++) {
                                        arr.push(i);
                                    }
                                }
                                return min?arr.join(','):'';
                            }
                        },
                    ],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'dateRemark', hidden: true},
                        {label: '合同名称', code: 'htname', width: 160},
                        {label: '合同', code: 'htcode', width: 140},
                        {label: '甲方', code: 'htjf', width: 120},
                        {label: '乙方', code: 'htyf', width: 120},
                        {label: '合同金额(元)', code: 'htje', width: 120},
                        {
                            label: '合同签订日期', code: 'dateCreate', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateCreate).format('YYYY-MM-DD');
                            }
                        },
                        {
                            label: '合同生效日期', code: 'dateStart', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateStart).format('YYYY-MM-DD');
                            }
                        },
                        {
                            label: '合同终止日期', code: 'dateEnd', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateEnd).format('YYYY-MM-DD');
                            }
                        },
                        {label: '合同类型', code: 'htlx', width: 100, mapTypeCode: 'HTLX'},
                        {label: '份数', code: 'htNum', width: 80},
                        {label: '合同概要', code: 'htrw', width: 100},
                        {label: '登记部门', code: 'htdept', width: 120},
                        {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                    ],
                    buttons: [
                        {name: '添加合同', icon: 'el-icon-plus', type: 'primary', callback: this.handleAddContract},
                        {name: '合同选择', icon: 'el-icon-thumb', type: 'success', callback: this.addContract},
                    ],
                    // 合同选择buttons
                    buttons1: [],
                    operations: [
                        {name: '删除', callback: this.removeDel, ctrlCode: "BSC"},
                    ],
                },
                tableObject: {
                    buttons: [],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'oidXm', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', width: 200},
                        {label: '任务名称', code: 'rwname', width: 200,},
                        {label: '前置任务', code: 'qzrw', width: 200},
                        {label: '工期', code: 'rwgq', width: 100},
                        {label: '实际开始日期', code: 'dateSjStar', width: 200},
                        {label: '实际完成日期', code: 'dateSjEnd', width: 200,},
                        {label: '部门', code: 'rwdept', width: 140,},
                        {label: '任务负责人', code: 'rwfzr', width: 140},
                        {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: 'DATA_SECRET_LEVEL'},

                    ],
                    query: [
                        {type: 'static', code: 'oidXm', value: '0'},
                        //过滤掉任务状态为未下发的
                        {type: 'static', code: 'rwzt', value: 'RWZT10', exp: '!='},
                    ],
                    treeFocusData: [],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                //左树右表end
                formModel: {
                    oid: '',//
                    xmname: '',//项目名称
                    oidXm: '',//项目库主键ID
                    xmcode: '',//所内项目编号
                    rwname: '',//任务名称
                    oidRw: '',//WBSID
                    wbscode: '',//WBS编号
                    dataSecretLevcode: '',//密级
                    htname: '',//合同名称
                    htcode: '',//合同编号
                    oidHt: '',//合同ID
                    zcje: '',//支出金额
                    zcSqr: '',//经手人
                    oidsqr: '',//经手人id
                    sqrcode: '',//经手人编码
                    dateSq: '',//支出申请日期
                    zcSpr: '',//支出审批人
                    oidspr: '',//支出审批人id
                    sprcode: '',//支出审批人编码
                    dateSp: '',//支出审批日期
                    dateZc: '',//付款日期
                    fksm: '',//付款说明
                    dateRemark: '',//备注
                    deleteStatus: '',//删除状态
                    oidfj: '',//附件ID
                    filename: '',//文件名称
                    filecode: '',//文件编号
                    filedatecreate: '',//上传日期
                    dataid: '',//附件数据ID

                    xtFjs: [],//协同附件
                },
                query: [
                    {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                    {type: 'input', code: 'rwname', label: '任务名称', value: ''},
                    {type: 'input', code: 'htname', label: '合同名称', value: ''},
                    // {type: 'input', code: 'zcje', label: '支出金额', value: ''},
                    {type: 'input', code: 'zcSqr', label: '经手人', value: ''},
                    {type: 'input', code: 'zcSpr', label: '支出审批人', value: ''},
                    {type: 'date', code: 'dateSq', label: '支出申请日期', value: ''},
                    {type: 'date', code: 'dateZc', label: '付款日期', value: ''},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '项目名称', code: 'xmname', width: 200,},
                    {label: '项目库主键ID', code: 'oidXm', hidden: true},
                    {label: '所内项目编号', code: 'xmcode', hidden: true},
                    {label: 'WBSID', code: 'oidRw', hidden: true},
                    {label: 'WBS编号', code: 'wbscode', hidden: true},
                    {label: '任务名称', code: 'rwname', width: 200},
                    {label: '合同名称', code: 'htname', width: 200,},
                    {label: '合同ID', code: 'oidHt', width: 200, hidden: true},
                    {label: '合同编号', code: 'htcode', width: 200, hidden: true},
                    {label: '支出金额(元)', code: 'zcje', width: 200},
                    {label: '经手人', code: 'zcSqr'},
                    {label: '经手人id', code: 'oidsqr', hidden: true},
                    {label: '经手人编码', code: 'sqrcode', hidden: true},
                    {
                        label: '支出申请日期 ', code: 'dateSq', formatter(row) {
                            return row.dateSq === null ? null : moment(row.dateSq).format('YYYY-MM-DD');
                        }
                    },
                    // {label: '支出审批人', code: 'zcSpr', width: 200},
                    // {label: '支出审批人id', code: 'oidspr', width: 200,hidden: true},
                    // {label: '支出审批人编码', code: 'sprcode', width: 200,hidden: true},
                    // {label: '支出审批日期', code: 'dateSp', width: 200,formatter(row) {
                    //         return row.dateSp === null ? null : moment(row.dateSp).format('YYYY-MM-DD');
                    //     }},
                    {
                        label: '付款日期', code: 'dateZc', width: 200, formatter(row) {
                            return row.dateZc === null ? null : moment(row.dateZc).format('YYYY-MM-DD');
                        }
                    },
                    {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '付款说明', code: 'fksm', width: 200, hidden: true},
                    {label: '备注', code: 'dateRemark', width: 200, hidden: true},
                    {label: '附件ID', code: 'oidfj', width: 200, hidden: true},
                    {label: '文件名称', code: 'filename', width: 200, hidden: true},
                    {label: '文件编号', code: 'filecode', width: 200, hidden: true},
                    {label: '上传日期', code: 'filedatecreate', width: 200, hidden: true},
                    {label: '附件数据ID', code: 'dataid', width: 200, hidden: true},
                ],
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh-right',
                        type: 'primary',
                        ctrlCode: "BSX",
                        callback: this.buttonRefresh
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '导入', icon: 'el-icon-upload2', type: 'primary', ctrlCode: "BDR", callback: this.export},
                    // {name: '导出', icon: 'el-icon-download', type: 'export', ctrlCode: 'BDC'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC", type: 'danger'},
                ],
                rules: {
                    xmname: [
                        {required: true, message: '项目不能为空'}
                    ],
                    zcSqr: [
                        {required: true, message: '经手人不能为空'}
                    ],
                    zcje: [
                        {required: true, message: '支出金额不能为空'}
                    ],
                    dateZc: [
                        {required: true, message: '付款日期不能为空'}
                    ],
                    fksm: [
                        {required: true, message: '付款说明不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                },

                // 项目密级
                xmMj: 8,
                // 任务密级
                rwMj: 8,
                fjdata: [],
            }
        },
        computed: {
            controlMj() {
                console.log([this.xmMj, this.rwMj], '[this.xmMj, this.rwMj]')
                return [this.xmMj, this.rwMj]
            },
            controlMjFj() {
                console.log(this.formModel.dataSecretLevcode ? [...this.controlMj, this.formModel.dataSecretLevcode] : this.controlMj, 'this.formModel.dataSecretLevcode?[...this.controlMj, this.formModel.dataSecretLevcode]: this.controlMj')
                return this.formModel.dataSecretLevcode ? [...this.controlMj, this.formModel.dataSecretLevcode] : this.controlMj;
            },
            controlMjPar() {
                return this.fjdata.map(c => {
                    return c.dataSecretLevcode
                })
            }
        }
        , methods: {
            changeFj(data) {
                this.fjdata = data;
            },
            //左树右表start
            // 获取近5年的年份
            nearFiveYears() {
                let date = new Date();
                let currentYear = date.getFullYear();
                let arr = [];
                for (let i = 0; i < 5; i++) {
                    arr.push(currentYear);
                    currentYear -= 1;
                }
                return arr.join(',');
            },
            handleToggleDialog() {
                this.dialogConfig.visible = !this.dialogConfig.visible;
            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {
                // 回调后数据操作
                this.formModel.rwname = data[0].rwname
                this.formModel.oidRw = data[0].oid
                this.formModel.wbscode = data[0].wbscode
                this.rwMj = data[0].dataSecretLevcode

                this.formModel.xmname = this.tableObject.treeFocusData.xmname
                this.formModel.oidXm = this.tableObject.treeFocusData.oid
                this.formModel.xmcode = this.tableObject.treeFocusData.xmcode
            },
            // 树组件选中回调
            handleTreeCallback(data) {
                this.tableObject.treeFocusData = data
                if (data.oid === '') return;
                this.tableObject.query[0].value = data.oid;
                this.$refs.tableTree.refresh();
            },

            getColumn() {
                return this.tableObject.columns.map((item) => {
                    return item.code;
                })
            },
            //左树右表end
            selectionChange(data) {
                this.selectData = data;
            },
            export() {
                this.visibleImport = true
            },
            addItem(row) {
                this.titleTop = '新增';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
                    this.attaTableData = [];
                })
            },
            edit(row) {
                this.titleTop = '详情';
                this.visible = true
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    let tid = setTimeout(() => {
                        this.getFJ(row);
                        clearTimeout(tid)
                    }, 20);
                    this.getSingle(row);
                })
                this.getXtFjData(row.oid);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/PmsXmJfzctz/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划信息失败！")
                    })
            },
            delete(row) {
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.formModel.deleteStatus = 1
                    this.formModel.xtFjs = [];
                    this.$axios.post("/pms/PmsXmJfzctz/saveOrUpdate", this.formModel)
                        .then(data => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        }).catch(error => {
                        this.$message.error("删除失败");
                    })
                })
            },
            confirm() {

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.formModel.xtFjs = this.$refs.attachment.getData();
                        this.$axios.post("/pms/PmsXmJfzctz/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.visible = false
                                this.$message.success("保存成功")
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                                this.disabled = true;
                            })
                    }
                })
            },
            //获取附件
            getFJ(row) {
                this.fileInfo.filename = row.filename;
                this.fileInfo.dataid = row.dataid;
            },
            getXtFjData(boid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        console.log(error)
                        this.$message.error("获取附件数据失败！")
                    })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            deleteAtta() {
                this.$refs.attaTable.removeSelecteds()
            },
            // --------- 项目关联 start ----------
            selectProject(item) {
                this.formModel.xmname = item[0].xmname
                this.formModel.oidXm = item[0].oid
                this.formModel.xmcode = item[0].xmcode
                this.xmMj = item[0].dataSecretLevcode
                this.visibleProject = false;

            },
            showXm() {
                this.visibleProject = true;
            },
            showRw() {
                this.dialogConfig.visible = true;
            },
            // --------- 项目关联 end ----------
            // 选中的合同
            handleSectedContract(data) {
                this.sectedContract = data
                console.log(this.sectedContract)
            },
            //确认
            handleSectContract() {
                console.log(this.sectedContract[0].htname)
                console.log(this.sectedContract[0].oid)
                console.log(this.sectedContract[0].htcode)
                this.formModel.htname = this.sectedContract[0].htname
                this.formModel.oidHt = this.sectedContract[0].oid
                this.formModel.htcode = this.sectedContract[0].htcode
                this.contractVisible = false;
            },
            showHt() {
                this.contractVisible = true;
                this.$nextTick(_=>{
                    this.$refs.grid2.refresh();
                })

            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                this.fileInfo = record
                console.log(this.fileInfo)
            },
            showYh() {
                this.$refs.us.openDialog();
            },
            getUserData(data) {
                this.formModel.zcSqr = data[0].name;
                this.formModel.oidsqr = data[0].oid;
                this.formModel.sqrcode = data[0].code;
            },
        }

    }
</script>

<style scoped>

</style>
