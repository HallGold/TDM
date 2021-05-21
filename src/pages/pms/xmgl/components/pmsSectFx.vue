<template>
    <div class="ice-container">
        <div class="btns" v-if="!disabled">
            <el-button type="success" @click="addFjVisible"><i class="el-icon-plus"></i>新增</el-button>
        </div>
        <div class="abb">
            <vxe-table
                    ref="vxetable"
                    :loading="vxeloading"
                    resizable
                    border
                    size="mini"
                    height="500"
                    column-min-width="100"
                    header-align="center"
                    :align="allAlign"
                    :data="fxdata">
                <vxe-table-column type="index" width="60" title="序号"></vxe-table-column>
                <vxe-table-column field="fxcode" title="风险编码"></vxe-table-column>
                <vxe-table-column field="fxname" title="风险名称"></vxe-table-column>
                <vxe-table-column field="fxqdZyqy" title="作业区域"></vxe-table-column>
                <vxe-table-column field="fxqdZyhd" title="作业活动"></vxe-table-column>
                <vxe-table-column field="fxqdSglx" title="事故类型">
                    <template v-slot="{ row, rowIndex, columnIndex }">
                        <pms-vxe-column :value="row.fxqdSglx" mapTypeCode="SGLX"></pms-vxe-column>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="dataSecretLevcode" title="项目密级">
                    <template v-slot="{ row, rowIndex, columnIndex }">
                        <pms-vxe-column :value="row.dataSecretLevcode" mapTypeCode="DATA_SECRET_LEVEL"></pms-vxe-column>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="fxqdBbdw" title="识别单位"></vxe-table-column>
                <vxe-table-column field="fxry" title="发现人员"></vxe-table-column>
                <vxe-table-column field="age" title="控制后风险">
                    <vxe-table-column field="lecdL" title="L">

                    </vxe-table-column>
                    <vxe-table-column field="lecdE" title="E">

                    </vxe-table-column>
                    <vxe-table-column field="lecdC" title="C">

                    </vxe-table-column>
                    <vxe-table-column field="lecdD" title="D">

                    </vxe-table-column>
                </vxe-table-column>
                <vxe-table-column field="fxqdFxfq" title="风险分区">
                    <template v-slot="{ row, rowIndex, columnIndex }">
                        <el-tag v-if="row.fxqdFxfq=='蓝区'">{{row.fxqdFxfq}}</el-tag>
                        <el-tag type="danger" v-if="row.fxqdFxfq=='红区'">{{row.fxqdFxfq}}</el-tag>
                        <el-tag type="warning" v-if="row.fxqdFxfq=='黄区'">{{row.fxqdFxfq}}</el-tag>
                        <el-tag color="orange" v-if="row.fxqdFxfq=='橙区'">{{row.fxqdFxfq}}</el-tag>
                    </template>
                </vxe-table-column>
                <vxe-table-column field="xmfxzzr" title="项目风险责任人" width="120"></vxe-table-column>
                <vxe-table-column field="fxzt" title="风险状态">
                    <template v-slot="{ row, rowIndex, columnIndex }">
                        <pms-vxe-column :value="row.fxzt" mapTypeCode="FXZT"></pms-vxe-column>
                    </template>
                </vxe-table-column>
                <vxe-table-column fixed="right" title="操作" v-if="!disabled" width="100">
                    <template v-slot="{ row, rowIndex, columnIndex }">
                        <el-button type="text" @click="handleDel(row)">删除</el-button>
                    </template>
                </vxe-table-column>
            </vxe-table>
        </div>


        <!--新增-->
        <!--添加风险-->
        <ice-dialog :title="activeName" :visible.sync="addFxVisible" width="1300px">
            <div style="padding: 10px;" class="formBox">
                <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                    <el-row :gutter="20">
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="风险名称" label-width="110px" prop="fxname">
                                    <el-input v-model="formModel.fxname" @focus="handleShowSectFx"
                                              placeholder="请选择风险"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险编码" label-width="110px">
                                    <el-input v-model="formModel.fxcode" disabled placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险区域" label-width="110px" prop="fxqdZyqy">
                                    <el-input v-model="formModel.fxqdZyqy" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="作业活动" label-width="110px" prop="fxqdZyhd">
                                    <el-input v-model="formModel.fxqdZyhd" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="事故类型" label-width="110px" prop="fxqdSglx">
                                    <ice-select v-model="formModel.fxqdSglx" disabled
                                                map-type-code="SGLX"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode" disabled
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">

                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="发现人员" label-width="110px" prop="fxry">
                                    <el-input v-model="formModel.fxry" disabled></el-input>

                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="辨别单位" label-width="110px" prop="fxqdBbdw">
                                    <el-input v-model="formModel.fxqdBbdw" disabled></el-input>
                                </el-form-item>

                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="识别日期" label-width="110px" prop="fxdate">
                                    <el-date-picker v-model="formModel.fxdate" disabled></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="严重程度" label-width="110px" prop="yzcd">
                                    <ice-select v-model="formModel.yzcd" disabled
                                                map-type-code="YZCD"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="发生概率" label-width="110px" prop="fsgl">
                                    <ice-select v-model="formModel.fsgl" disabled
                                                map-type-code="FSGL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECK_L" label-width="110px" prop="lecdL">
                                    <el-input type="number" v-model="formModel.lecdL" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="LECD-E" label-width="110px" prop="lecdE">
                                    <el-input type="number" v-model="formModel.lecdE" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECD-C" label-width="110px" prop="lecdC">
                                    <el-input type="number" v-model="formModel.lecdC" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="LECD-D" label-width="110px" prop="lecdD">
                                    <el-input type="number" v-model="formModel.lecdD" disabled></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="风险分区" label-width="110px" prop="value">
                                    <el-input :class="analyze.ys" v-model="analyze.value" disabled></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="风险状态" label-width="110px" prop="fxzt">
                                    <ice-select v-model="formModel.fxzt"
                                                map-type-code="FXZT" disabled
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="危害和危害因素" label-width="110px" prop="fxqdWhys">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit disabled v-model="formModel.fxqdWhys"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="现有控制措施" label-width="110px" prop="fxqdXykzcs">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit disabled v-model="formModel.fxqdXykzcs"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="持续改进意见" label-width="110px" prop="fxqdCxgjyj">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit disabled v-model="formModel.fxqdCxgjyj"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit disabled v-model="formModel.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="项目风险责任人" label-width="110px" prop="xmfxzzr">
                                    <ice-persion-selector chooseItem="single" mode="onlySelect"
                                                          v-model="formModel.xmfxzzr"
                                                          @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-persion-selector>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="项目风险规避措施" label-width="110px" prop="xmfxgbcs">
                                    <el-input placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea" v-model="formModel.xmfxgbcs"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>


                    </el-row>
                </el-form>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
                    <el-button type="info" @click="addFxVisible=false">关闭</el-button>
                </div>
            </div>

        </ice-dialog>
        <!--选择风险-->
        <ice-dialog title="选择风险" :visible.sync="sectFxVisible" width="1300px">
            <div style="padding: 10px;" class="formBox">
                <fx-list :sectDataFx="sectDataFx" v-bind="$attrs" @handleCallback="sectFxCallback" ref="sectFx"></fx-list>
            </div>
        </ice-dialog>

    </div>
</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import moment from 'moment';
    import XM_SELECT from "../../common/XM_SELECT";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import UploadAttachment from "../../../biz/dev/comm/uploadAttachment";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../../common/ATTACHMENT";
    import pmsVxeColumn from '.././components/pmsVxeColumn'
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import fxList from "./fxList";

    export default {
        name: "FXQD",
        props: {
            fxqdList: {
                default: function () {
                    return []
                }
            },
            disabled: false
        },
        components: {
            ATTACHMENT,
            IceSingleUpload,
            UploadAttachment,
            IceMultipleUpload,
            XM_SELECT,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            pmsVxeColumn,
            IceDeptSelector,
            IcePersionSelector,
            fxList
        },
        watch: {
            fxqdList() {
                this.fxdata = this.fxqdList.filter(c => {
                    return c.deleteStatus != 1
                });
                this.sectDataFx = this.fxdata;
            }
        },
        data() {
            return {
                fxdata: this.fxqdList.filter(c => {
                    return c.deleteStatus != 1
                }),
                vxeloading: false,
                tableData: [],
                allAlign: null,
                tablePage: {
                    currentPage: 1,
                    pageSize: 10,
                    totalResult: 0
                },
                activeName: '添加风险',
                loading: false,
                addFxVisible: false,
                sectFxVisible: false,
                //列表展示字段
                columns: [
                    // {code: 'oid', hidden: true},
                    // {code: 'oidXm', hidden: true},
                    // {code: 'xmname', hidden: true},
                    // {code: 'xmcode', hidden: true},
                    // {code: 'dataSecretLevcode', hidden: true},
                    {label: '风险编码', code: 'fxcode'},
                    {label: '风险名称', code: 'fxname'},
                    {label: '作业区域', code: 'fxqdZyqy'},
                    {label: '作业活动', code: 'fxqdZyhd'},
                    {label: '事故类型', code: 'fxqdSglx', dataTypeCode: 'SGLX'},
                    {label: '密级', code: 'dataSecretLevcode', dataTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '发现人员', code: 'fxry'},
                    {label: '辨别单位', code: 'fxqdBbdw'},
                    {label: '识别日期', code: 'fxdate'},
                    {label: '严重程度', code: 'yzcd', dataTypeCode: 'YZCD'},
                    {label: '发生概率', code: 'fsgl', dataTypeCode: 'FSGL'},
                    {
                        label: '控制后风险', code: 'xxx',
                        children: [
                            {label: 'LECD_L', code: 'lecdL',},
                            {label: 'LECD_E', code: 'lecdE'},
                            {label: 'LECD_C', code: 'lecdC',},
                            {label: 'LECD_D', code: 'lecdD',},
                        ]
                    },
                    {label: '风险分区', code: 'fxqdFxfq'},
                    {label: '危害和危害因素', code: 'fxqdWhys'},
                    {label: '持续改进意见', code: 'fxqdCxgjyj',},
                    {label: '备注', code: 'dateRemark'},
                    {label: '现有控制措施', code: 'fxqdXykzcs'},
                ],
                columns1: [
                    {code: 'oid', hidden: true},
                    {label: '风险编码', code: 'fxcode'},
                    {label: '风险名称', code: 'fxname'},
                    {label: '作业区域', code: 'fxqdZyqy'},
                    {label: '作业活动', code: 'fxqdZyhd'},
                    {label: '事故类型', code: 'fxqdSglx', dataTypeCode: 'SGLX'},
                    {label: '密级', code: 'dataSecretLevcode', dataTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '发现人员', code: 'fxry'},
                    {label: '辨别单位', code: 'fxqdBbdw'},
                    {label: '识别日期', code: 'fxdate'},
                    {label: '严重程度', code: 'yzcd', dataTypeCode: 'YZCD'},
                    {label: '发生概率', code: 'fsgl', dataTypeCode: 'FSGL'},
                    {label: 'LECD_L', code: 'lecdL'},
                    {label: 'LECD_E', code: 'lecdE'},
                    {label: 'LECD_C', code: 'lecdC',},
                    {label: 'LECD_D', code: 'lecdD',},
                    {label: '风险分区', code: 'fxqdFxfq'},
                    {label: '危害和危害因素', code: 'fxqdWhys'},
                    {label: '持续改进意见', code: 'fxqdCxgjyj',},
                    {label: '备注', code: 'dateRemark'},
                    {label: '现有控制措施', code: 'fxqdXykzcs'},
                ],
                formModel: {
                    oid: '',
                    fxcode: '',
                    fxname: '',
                    fxqdZyqy: '',
                    fxqdZyhd: '',
                    fxqdSglx: '',
                    dataSecretLevcode: '',
                    fxry: '',
                    fxqdBbdw: '',
                    fxdate: '',
                    yzcd: '',
                    fsgl: '',
                    lecdl: '',
                    lecdE: '',
                    lecdC: '',
                    lecdD: '',
                    fxqdFxfq: '',
                    fxqdWhys: '',
                    fxqdCxgjyj: '',
                    dateRemark: '',
                    fxqdXykzcs: '',
                    fxzt: '',
                    xmfxzzr: '',
                    xmfxgbcs: ''
                },
                // 需要填的两个字段
                formModel1: {
                    xmfxzzr: '',
                    xmfxgbcs: ''
                },
                rules: {
                    fxname: [
                        {required: true, whitespace: true, message: '请选择', trigger: 'change'}
                    ],
                    xmfxzzr: [
                        {required: true, whitespace: true, message: '请选择项目风险责任人', trigger: 'change'}
                    ],
                    xmfxgbcs: [
                        {required: true, whitespace: true, message: '请输入规避措施', trigger: 'blur'}
                    ]
                },
                // 选中风险数据
                sectDataFx: []
            }
        },
        computed: {
            // initdel
            initdel() {
                return this.fxqdList.filter(c => {
                    return c.deleteStatus == 1
                })
            },
            // 风险分析
            analyze() {
                if (!(this.formModel.lecdL && this.formModel.lecdE && this.formModel.lecdC)) {
                    this.formModel.lecdD = '';
                    return {
                        value: '',
                        ys: '',
                    }
                }
                let num = this.formModel.lecdL * this.formModel.lecdE * this.formModel.lecdC;
                this.formModel.lecdD = num;
                if (num >= 160) {
                    return {
                        value: '红区',
                        ys: 'red',
                    }
                } else if (num >= 70 && num < 160) {
                    return {
                        value: '橙区',
                        ys: 'orange'
                    }
                } else if (num >= 20 && num < 70) {
                    return {
                        value: '黄区',
                        ys: 'yellow'
                    }
                } else {
                    return {
                        value: '蓝区',
                        ys: 'blue'
                    }
                }
            }
        },
        created() {
            this.$nextTick(_=>{
                this.sectDataFx = this.fxdata;
            })
        },
        methods: {
            handleConfirmAdd() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$refs.vxetable.insert(this.formModel);
                        this.addFxVisible = false;


                        this.sectDataFx = this.$refs.vxetable.getTableData().visibleData;
                    }
                })
            },
            // 删除
            handleDel(row) {
                console.log(row)
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {

                    this.$refs.vxetable.remove(row);
                    this.$message.success("删除成功");
                    this.$emit('change', this.$refs.vxetable.getTableData().visibleData)
                });
            },
            getData() {
                let insertAttaData = this.$refs.vxetable.getInsertRecords();
                let removeAttaData = JSON.parse(JSON.stringify(this.$refs.vxetable.getRemoveRecords()));
                let updateAttaData = this.$refs.vxetable.getUpdateRecords();
                let tabledata = this.$refs.vxetable.getTableData().visibleData;
                removeAttaData.map(o => {
                    o.deleteStatus = 1
                });
                removeAttaData = removeAttaData.concat(this.initdel);
                return tabledata.concat(removeAttaData);
            },
            // 添加显示
            addFjVisible() {
                this.addFxVisible = true;
                this.$nextTick(() => {
                    this.$refs.form.resetFields();
                })
            },
            // 分页点击
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.currentPage = currentPage
                this.tablePage.pageSize = pageSize
                this.getList();
            },
            resize() {
                this.$nextTick(() => {
                    this.$refs.vxetable.recalculate();
                })
            },
            // 展示选择风险
            handleShowSectFx() {
                this.sectFxVisible = true;
                this.$nextTick(() => {
                    this.$refs.sectFx.resize();
                })

            },
            // 选择风险回调
            sectFxCallback(data) {
                data['xmfxzzr'] = '';
                data['xmfxgbcs'] = '';
                this.formModel = Object.assign({}, data);
                this.$nextTick(() => {

                    this.sectFxVisible = false;
                })
                this.$emit('change', this.$refs.vxetable.getTableData().visibleData)

            }

        }
    }
</script>

<style scoped>
    table {
        width: 100%;
    }

    .btns {
        /*margin-bottom: 10px;*/
        /*margin-top: 10px;*/
    }

    .formBox /deep/ input {
        transition: all 1s;
    }

    .formBox /deep/ .red input {
        background: red;
        color: #fff;
    }

    .formBox /deep/ .blue input {
        background: blue;
        color: #fff;
    }

    .formBox /deep/ .orange input {
        background: orange;
        color: #fff;
    }

    .formBox /deep/ .yellow input {
        background: yellow;
        color: #fff;
    }
</style>
