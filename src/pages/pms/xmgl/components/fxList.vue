<template>
    <div class="ice-container">
        <div class="btns">
            <div class="right">
                <search-input :query="query" @search="search"></search-input>
            </div>
        </div>
        <vxe-table
                ref="vxetable"
                :loading="vxeloading"
                resizable
                border
                size="mini"
                highlight-hover-row
                highlight-current-row
                height="500"
                header-align="center"
                :align="allAlign"
                @cell-dblclick="dbClick"
                :data="list">
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
        </vxe-table>
        <vxe-pager
                perfect
                size="mini"

                :current-page="tablePage.currentPage"
                :page-size="tablePage.pageSize"
                :total="tablePage.totalResult"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="handlePageChange">
        </vxe-pager>
        <!--新增-->
    </div>
</template>

<script>
    import searchInput from "../../../qis/zlycbh/searchInput"

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

    export default {
        name: "FXQD",
        props: {
            maxMj: {
                default: 100
            },
            sectDataFx: {
                default: () => {
                    return []
                }
            }
        },
        components: {
            ATTACHMENT,
            IceSingleUpload,
            UploadAttachment,
            IceMultipleUpload,
            XM_SELECT,
            IceSelect,
            IceDialog,
            pmsVxeColumn,
            IceDeptSelector,
            IcePersionSelector,
            searchInput
        },
        data() {
            return {
                vxeloading: false,
                tableData: [],
                allAlign: null,
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    conditions:[],
                    conditionLink:'OR',
                },
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
                    {label: '风险状态', code: 'fxzt'},
                    {label: '危害和危害因素', code: 'fxqdWhys'},
                    {label: '持续改进意见', code: 'fxqdCxgjyj',},
                    {label: '备注', code: 'dateRemark'},
                    {label: '现有控制措施', code: 'fxqdXykzcs'},
                ],

                //查询
                query: [
                    {type: 'input', code: 'fxcode', label: '风险编码', exp: 'like', value: ''},
                    {type: 'input', code: 'fxname', label: '风险名称', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdZyqy', label: '作业区域', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdZyhd', label: '作业活动', exp: 'like', value: ''},
                    {type: 'select', code: 'fxqdSglx', label: '事故类型', exp: 'like', value: '', mapTypeCode: "SGLX"},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        exp: 'like',
                        value: '',
                        mapTypeCode: "DATA_SECRET_LEVEL"
                    },
                    {type: 'input', code: 'fxry', label: '发现人员', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdBbdw', label: '辨别单位', exp: 'like', value: ''},
                    {type: 'date', code: 'fxdate', label: '识别日期', exp: 'like', value: ''},
                    {type: 'select', code: 'yzcd', label: '严重程度', exp: 'like', value: '', mapTypeCode: "YZCD"},
                    {type: 'select', code: 'fsgl', label: '发生概率', exp: 'like', value: '', mapTypeCode: "FSGL"},
                    {type: 'input', code: 'lecdL', label: 'LECD_L', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdE', label: 'LECD_E', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdC', label: 'LECD_C', exp: 'like', value: ''},
                    {type: 'input', code: 'lecdD', label: 'LECD_D', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdFxfq', label: '风险分区', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdWhys', label: '危害和危害因素', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdCxgjyj', label: '持续改进意见', exp: 'like', value: ''},
                    {type: 'input', code: 'fxqdXykzcs', label: '现有控制措施', exp: 'like', value: ''},
                    {type: 'static', code: 'fxzt', label: '现有控制措施', exp: '=', value: 'FXZT01'},
                    {
                        type: 'static', code: 'dataSecretLevcode', label: '现有控制措施', exp: '<=', value: () => {
                            return this.maxMj
                        }
                    },
                ],
            }
        },
        computed: {
            sectoids() {
                return this.sectDataFx.map(c => {
                    return c.fxcode;
                })
            },
            list() {
                console.log(this.sectoids, 'sectoids')
                let arr = this.tableData.filter(c => {
                    return this.sectoids.indexOf(c.fxcode) == -1;
                })
                return arr;
            },
            staticQuerys() {
                let arr = this.query.filter(item => item.type == "static")
                return arr.map(c => {
                    return {
                        column: c.code,
                        exp: c.exp,
                        value: typeof c.value == "function" ? c.value() : c.value
                    }
                });
            },
        },
        watch: {
            maxMj() {
                this.getList();
            },
            sectDataFx() {
                console.log(this.sectDataFx, 'sectDataFx')
            }
        },
        created() {
            this.getList();
        },
        methods: {
            search(data) {
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;
                this.getList();
            },
            // 获取列表数据
            getList() {
                this.vxeloading = true;
                let arr = [];
                this.columns1.forEach((c) => {
                    arr.push(c.code);
                })
                this.tablePage.columns = arr;
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/PmsFxqd/querylistFxqd", {params: this.tablePage})
                    .then(result => {
                        this.tableData = result.data.records;
                        this.tablePage.totalResult = result.data.total;
                    })
                    .catch(error => {
                        this.$message.error("获取失败");
                    })
                    .finally(_ => {
                        this.vxeloading = false;
                    })
            },

            // 分页点击
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage
                this.tablePage.size = pageSize
                this.getList();
            },
            resize() {
                this.$nextTick(() => {
                    console.log(this.$refs.vxetable)
                    this.$refs.vxetable.recalculate();
                })
            },
            // 双击单元格
            dbClick({row, rowIndex}) {
                console.log(row);
                this.$emit('handleCallback', row)
            }

        }
    }
</script>

<style lang="less" scoped>
    .btns {
        margin-bottom: 10px;
        margin-top: 10px;
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

    .btns {
        margin-top: -15px;
        .right {
            float: right;
        }
    }
</style>
