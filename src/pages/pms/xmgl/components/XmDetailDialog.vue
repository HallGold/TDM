<template>
    <!--详情-->
    <div style="position: relative;">
        <div class="toFlow" v-if="isShowFlowBtn&&row.xmzt !== XM_ZT.LXZ">
            <el-button type="primary" @click="toLookFlow()">流程记录</el-button>
        </div>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="项目基本信息" name="first">
                <div class="detail-tab">

                    <el-form :v-loading="loading" :model="formModel" status-icon ref="definition" label-width="140px"
                             style="padding: 0 15px;">
                        <!--第一行-->
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="所内项目编号" label-width="110px" prop="xmcode">
                                    <el-input disabled v-model="formModel.xmcode" placeholder="自动生成"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="所外项目编号" label-width="110px" prop="xmcodeSw">
                                    <el-input disabled v-model="formModel.xmcodeSw" placeholder="手动输入"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目名称" label-width="110px" prop="xmname">
                                    <el-input v-model="formModel.xmname" :disabled="formDisabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="8">
                                <el-form-item label="项目来源" label-width="110px" prop="dataSecretLevcode">
                                    <pms-select-tree :disabled="formDisabled" v-model="formModel.xmly"
                                                     :isemptyBtn="formDisabled"
                                                     :showChecked="showChecked"
                                                     :unbrid="unbrid"
                                                     :treeData="treeData"
                                                     :transfer="transferTree.treeData"
                                    >
                                    </pms-select-tree>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                    <ice-select :disabled="formDisabled" v-model="formModel.dataSecretLevcode"
                                                map-type-code="DATA_SECRET_LEVEL"
                                                filterable placeholder="请选择">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="项目类别" label-width="110px" prop="xmlb">
                                    <ice-select :disabled="formDisabled" v-model="formModel.xmlb" map-type-code="XMLB"
                                                filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!--第三行-->
                            <el-col :span="8">
                                <el-form-item label="学科方向" label-width="110px" prop="xmxkfx">
                                    <ice-select :disabled="formDisabled" v-model="formModel.xmxkfx"
                                                map-type-code="XMXKFX" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>

                            <!--第四行-->
                            <el-col :span="8">
                                <el-form-item label="责任单位" label-width="110px" prop="orgname">
                                    <ice-dept-selector :disabled="formDisabled" chooseItem="single" mode="readonly"
                                                       v-model="formModel.orgname"
                                                       @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="业务主管部门" label-width="110px" prop="xmzgbmCode">
<!--                                    <ice-dept-selector :disabled="formDisabled" chooseItem="single" mode="readonly"-->
<!--                                                       v-model="formModel.xmzgbm"-->
<!--                                                       @select-confirm="depts=>formModel.deptCode=depts[0].deptCode">-->
<!--                                    </ice-dept-selector>-->
                                    <ice-select :disabled="formDisabled" v-model="formModel.xmzgbmCode"
                                                map-type-code="ZGBM" filterable
                                                placeholder="请选择"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="20">

                            <el-col :span="8">
                                <el-form-item label="立项日期" label-width="110px" prop="gmtLx">
                                    <el-date-picker :disabled="formDisabled" v-model="formModel.gmtLx"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="计划结项日期" label-width="110px" prop="finishDate">
                                    <el-date-picker v-model="formModel.finishDate" type="date" placeholder="请选择"
                                                    :disabled="formDisabled"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="实际结项日期" label-width="110px" prop="gmtLx">
                                    <el-date-picker :disabled="formDisabled" v-model="formModel.gmtJx"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <!--第六行-->
                            <el-col :span="8">
                                <el-form-item label="全时人力投入" label-width="110px" prop="rltr">
                                    <el-input :disabled="formDisabled" disabled placeholder="自动生成"
                                              v-model="formModel.rltr">
                                        <template slot="append">人/年</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="8">
                                <el-form-item label="预算经费合计" label-width="110px" prop="ysjfhj">
                                    <el-input :disabled="formDisabled" v-model="formModel.ysjfhj" disabled
                                              placeholder="自动生成">
                                        <template slot="append">元</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第二行-->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="项目目标" label-width="110px" prop="xmmb">
                                    <el-input :disabled="formDisabled" v-model="formModel.xmmb" placeholder="不超过650个字"
                                              maxlength="650"
                                              show-word-limit type="textarea"
                                              :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!--第七行-->
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                    <el-input :disabled="formDisabled" v-model="formModel.dateRemark"
                                              placeholder="不超过650个字" maxlength="650"
                                              show-word-limit type="textarea"
                                              :rows="2">
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-tabs v-model="activeName1">
                                    <el-tab-pane label="成员管理" name="first"></el-tab-pane>
                                </el-tabs>
                                <div class="hint" v-if="!formDisabled">项目主管、项目第一责任人、行政负责人、技术负责人是必选角色</div>
                                <!--<el-button type="success"><i class="el-icon-plus"></i>选择成员</el-button>-->

                                <pms-sect-member :disabled="formDisabled" ref="pmssectMember"
                                                 :queryListXmcy="queryListXmcy"></pms-sect-member>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="年度计划任务" name="ndjh">
                <div class="detail-tab">
                    <!--<ice-query-grid-->
                    <!--:gridData="wbsData"-->
                    <!--exportTitle="年度计划任务"-->
                    <!--:operations-width="120"-->
                    <!--:columns="wbscolumns"-->
                    <!--ref="grid2">-->
                    <!--</ice-query-grid>-->
                    <vxe-table
                            resizable
                            ref="vxetable"
                            border="inner"
                            height="100%"
                            :align="allAlign"
                            :tree-config="treeConfig"
                            :tooltip-config="{theme: 'light'}"
                            :data="wbsData"
                    >
                        <vxe-table-column field="dataPxh" title="序号" width="50"></vxe-table-column>
                        <vxe-table-column field="wbscode" title="WBS编号" width="80px" tree-node
                                          show-overflow="title"></vxe-table-column>
                        <vxe-table-column field="spzt" width="110px" title="审批状态" show-overflow="title"
                                          :cell-render="{name:'mapTypeCode',mapTypeCode:'SPZT'}"/>
                        <vxe-table-column field="rwzt" width="110px" title="任务状态" show-overflow="title"
                                          :cell-render="{name:'mapTypeCode',mapTypeCode:'RWZT'}">

                        </vxe-table-column>
                        <vxe-table-column field="rwname" title="任务内容" width="500px" show-overflow="title">

                        </vxe-table-column>
                        <vxe-table-column field="qzrw" title="前置任务" width="70px" show-overflow="title">

                        </vxe-table-column>
                        <!-- <vxe-table-column field="rwgq" title="工期" width="130px" :edit-render="{type: 'visible'}">
                            <template v-slot:edit="{ row }">
                                <el-input-number v-model="row.rwgq" :disabled="row.rwzt=='RWZT40'" @change="rwgqChangeEvent({ row })"></el-input-number>
                            </template>
                        </vxe-table-column> -->
                        <vxe-table-column field="dateJhStar" title="开始日期" width="150" show-overflow="title">

                        </vxe-table-column>
                        <vxe-table-column field="dateJhEnd" title="完成日期" width="150px" show-overflow="title">

                        </vxe-table-column>
                        <vxe-table-column field="rwlx" title="任务成果形式" width="150" show-overflow="title"
                                          :cell-render="{name: 'mapTypeCode', mapTypeCode: 'RWLX'}">

                        </vxe-table-column>
                        <vxe-table-column field="jjcd" width="100px" title="紧急程度" show-overflow="title"
                                          :cell-render="{name: 'mapTypeCode', mapTypeCode: 'JJCD'}">

                        </vxe-table-column>
                        <vxe-table-column field="rwdept" title="责任单位" width="100" show-overflow="title">

                        </vxe-table-column>
                        <vxe-table-column field="rwfzr" title="责任人" width="100" show-overflow="title">

                        </vxe-table-column>
                        <vxe-table-column fixed="right" title="操作" width="100">
                            <template v-slot="{ row, rowIndex, columnIndex }">
                                <el-button type="text" @click="handleLook(row)">查看</el-button>
                            </template>
                        </vxe-table-column>
                    </vxe-table>
                </div>
            </el-tab-pane>
            <!--点击编辑打开项目输出-->
            <el-tab-pane label="项目合同" name="xmht">
                <div class="detail-tab">
                    <ice-query-grid
                            :gridData="gridData"
                            exportTitle="合同信息登记"
                            :operations-width="120"
                            :columns="projectContract.columns"

                            :operations="projectContract.operations"
                            :pagination=false
                            ref="grid1">
                        <template v-slot:pagination-bar>
                            <ice-pagination
                                    @size-change="sizeChange"
                                    @current-change="currentChange"
                                    :current-page="projectContractpage.page"
                                    :layout="pageLayout"
                                    :page-size="projectContractpage.size"
                                    :total="projectContractpage.total">
                            </ice-pagination>
                        </template>

                    </ice-query-grid>
                    >
                </div>
            </el-tab-pane>

            <!--点击编辑打开项目输入-->
            <el-tab-pane label="项目输入" name="xmsr">
                <div class="detail-tab">
                    <ATTACHMENT Height="500px" :isHandleer="!formDisabled" :data="queryListXmsr"
                                ref="pmsXmRwFjListXmsr1"></ATTACHMENT>
                </div>
            </el-tab-pane>

            <!--点击编辑打开项目输出-->
            <el-tab-pane label="项目输出" name="xmsc">
                <div class="detail-tab">
                    <ice-query-grid
                            :gridData="queryListXmsc"
                            exportTitle="生产计划"
                            :operations-width="120"
                            :columns="xmsccolumns"
                            :pagination=false
                            :operations="xmscoperations"
                            ref="grid3">
                    </ice-query-grid>
                </div>

            </el-tab-pane>
            <el-tab-pane label="项目风险" name="fengxian">
                <div class="detail-tab">
                    <div>
                        <pms-sect-fx :disabled="formDisabled" :fxqdList="fxqdList" ref="pmsSectFx"></pms-sect-fx>
                    </div>
                </div>

            </el-tab-pane>
            <el-tab-pane label="经费支出" name="jfzc">
                <div class="detail-tab">
                    <ice-query-grid
                            :gridData="jfzcData"
                            exportTitle="生产计划"
                            :operations-width="120"
                            :columns="jfzccolumns"
                            :pagination=false
                            ref="grid2">
                    </ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="生产计划" name="scjh">
                <div class="detail-tab">
                    <ice-query-grid
                            :gridData="scjhData"
                            exportTitle="生产计划"
                            :operations-width="120"
                            :columns="scjhcolumns"
                            :pagination=false
                            ref="grid2">
                    </ice-query-grid>
                </div>
            </el-tab-pane>
            <!--<el-tab-pane label="生产计划" name="scjh">-->
            <!--<div class="detail-tab">-->
            <!--<ice-query-grid-->
            <!--:gridData="scjhData"-->
            <!--exportTitle="生产计划"-->
            <!--:operations-width="120"-->
            <!--:columns="scjhcolumns"-->
            <!--:pagination=false-->
            <!--ref="grid2">-->
            <!--</ice-query-grid>-->
            <!--</div>-->
            <!--</el-tab-pane>-->
        </el-tabs>
        <WbsEdit ref="wbsGrid"></WbsEdit>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceTree from "../../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../../common/ATTACHMENT";
    import member from "./member";
    import PmsSelectTree from '../../../../components/common/pms/PmsSelectTree'
    import Htdj from '../../htgl/htdj_edit'
    import pmsSectMember from './pmsSectMember'
    import pmsSectFx from './pmsSectFx'
    import {mapGetters, mapMutations} from 'vuex'
    import moment from 'moment';
    import IcePagination from '@/components/common/base/IcePagination.vue'
    import WbsEdit from "../wbsEdit";
    import {XM_ZT} from "../../../../utils/constant"

    let date = new Date();
    export default {
        name: "XmDetailDialog",
        components: {
            ATTACHMENT,
            IceSingleUpload,
            IcePersionSelector,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            member,
            PmsSelectTree,
            Htdj,
            pmsSectMember,
            pmsSectFx,
            WbsEdit,
            IcePagination
        },
        props: {
            row: {
                default: function () {
                    return {}
                },

            },
        },
        data() {
            return {
                XM_ZT,
                allAlign: null,
                formDisabled: true,
                detailVisible: false,
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    indent: '10',
                    expandAll: true
                },
                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    xmcodeSw: '',
                    pid: '',
                    dataSecretLevcode: '2',
                    xmzt: 'XMZT01',
                    xmlb: 'XMLB21',
                    xmxkfx: 'XMXKFX01',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzg: '',
                    orgid: '',
                    orgname: '',
                    personid: '',
                    personidJs: '',
                    personidXz: '',
                    sbzt: 'SBZT01',
                    xmmb: '',
                    ysjfhj: '',
                    rltr: '',
                    gmtLx: new Date(),
                    xmysh: '',
                    dateRemark: '',
                    pmsXmRwFjListXmsr: [],
                    pmsXminfoCyList: [],
                    pmsXmRwFjListXmsc: [],
                    xtFjList: [],
                    yscode: '',
                    xmly: 'XMLY13',
                    $json: {}
                },
                //定义模态框 转圈加载过程
                loading: false,

                /**
                 * 定义右侧模态框首选《项目信息》
                 */
                activeName: 'first',
                activeName1: 'first',

                /**
                 * 定义项目输入attaTableData: [],
                 */
                attaTableData: [],
                /**
                 * 定义项目输入的数据源数组空[]
                 */
                queryListXmsr: [],
                xtFjs: [],
                /**
                 * 定义项目输出的数据源为空
                 */
                queryListXmsc: [],

                /**
                 * ----------------------------------项目成员------------------------------
                 */
                queryListXmcy: [],
                rowData: {},
                // 项目来源
                unbrid: false,
                width: '285px',
                showChecked: false,
                isemptyBtn: true,
                transferTree: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/DataDictionaryType/getTree?code=XMLY&isTree=1',
                        lazy: false,
                        nodeKey: 'code',
                        // 配置字段
                        props: {
                            label: 'name',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {},
                        code: 'code',
                        // 返回解析字段
                        callback: this.getTreeData
                    },

                },
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                // 合同选择弹窗
                contractVisible: false,
                addContractVisible: false,
                projectContractpage: {
                    size: 20,
                    page: 1,
                    total: 0
                },
                pageLayout: "total, sizes, prev, pager, next, jumper",
                projectContract: {
                    query: [
                        {type: 'input', code: 'htname', label: '合同名称', value: ""},
                        {type: 'input', code: 'htcode', label: '合同编号', value: ""},
                        {type: 'input', code: 'htjf', label: '甲方', value: ""},
                        {type: 'input', code: 'htyf', label: '乙方', value: ""},
                        {type: 'date', code: 'dateCreate', label: '合同签订日期', exp: '=', value: ""},
                        {type: 'date', code: 'dateStart', label: '合同生效日期', exp: '=', value: ""},
                        {type: 'date', code: 'dateEnd', label: '合同终止日期', exp: '=', value: ""},
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
                        {
                            name: '添加合同',
                            icon: 'el-icon-plus',
                            type: 'primary',
                            callback: this.handleAddContract,
                            hidden: this.isCheck
                        },
                        {
                            name: '合同选择',
                            icon: 'el-icon-thumb',
                            type: 'success',
                            callback: this.addContract,
                            hidden: this.isCheck
                        },
                    ],
                    // 合同选择buttons
                    buttons1: [],
                    operations: [
                        // {name: '详情', callback: this.toDetail},
                    ],
                },
                gridData: [],
                sectedContract: [],
                // 风险
                fxqdList: [],
                tablePage: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                wbsFormModel: {
                    oid: '',
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    rwms: 'RWMS01',
                    rwlx: 'SS',
                    qzrw: '',
                    rwjd: '',
                    rwgq: '1',
                    rwgs: '',
                    dateJhStar: '',
                    dateJhEnd: '',
                    dateSjStar: '',
                    dateSjEnd: '',
                    rwfzr: '',
                    rwcjr: '',
                    dateCj: '',
                    rwdept: '',
                    rwdeptName: '',
                    zylx: '',
                    zynqme: '',
                    rwzt: 'RWZT01',
                    spzt: '',
                    gdrq: '',
                    xzlx: 'XZLX01',
                    xzdate: '',
                    isLcb: '',
                    isGj: '',
                    yscode: '',
                    xmjfqd: '',
                    cwtmdm: '',
                    version: '',
                    dataSecretLevcode: '2',
                    rwysJfSum: '',
                    rwysRl: '',
                    rwysYcl: '',
                    rwysYclfy: '',
                    rwysZy: '',
                    rwysZyfy: '',
                    rwysWx: '',
                    rwysWxfy: '',
                    rwysSw: '',
                    rwysSwfy: '',
                    rwysQt: '',
                    rwysQtfy: '',
                    rwtj: 'FS',
                    dataPxh: '',
                    jjcd: 'yb',
                    rwmb: '',
                    rwwc: '',
                    rwxf: '',
                    cgydms: ''
                },
                wbscolumns: [
                    {label: "wbs编号", code: "wbscode", width: 130, sortable: true},
                    {label: "任务名称", code: "rwname", width: 130, sortable: true},
                    {label: "前置任务", code: "qzrw", width: 130, sortable: true},
                    {label: "工期", code: "rwgq", width: 130, sortable: true},
                    {label: "开始时间", code: "dateJhStar", width: 130, sortable: true},
                    {label: "结束时间", code: "dateJhEnd", width: 130, sortable: true},
                    {label: "部门", code: "rwdept", width: 130, sortable: true},
                    {label: "责任人", code: "rwfzr", width: 130, sortable: true},
                ],
                wbsData: [],
                /**
                 *   生产计划数据
                 *
                 *
                 * */
                scjhData: [],
                scjhcolumns: [
                    {label: "计划编号", code: "scJhcode", width: 130, sortable: true},
                    {label: "计划名称", code: "scJhname", width: 130, sortable: true},
                    {label: "项目名称", code: "xmname", width: 130, sortable: true},
                    {label: "计划类型", code: "scJhlx", width: 130, sortable: true, mapTypeCode: 'JHLX20'},
                    {label: "计划状态", code: "jhzt", width: 130, sortable: true, mapTypeCode: 'JHZT'},
                    {label: "紧急程度", code: "jjcd", width: 130, sortable: true, mapTypeCode: 'JJCD'},
                    {label: "外部文号", code: "scJhwhWb", width: 130, sortable: true},
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 130,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                // 经费支出
                jfzcData: [],
                jfzccolumns: [
                    {label: "项目名称", code: "xmname", width: 130, sortable: true},
                    {label: "任务名称", code: "rwname", width: 130, sortable: true},
                    {label: "合同名称", code: "htname", width: 130, sortable: true},
                    {label: "支出金额(元)", code: "zcje", width: 130, sortable: true},
                    {label: "支出申请人", code: "zcSqr", width: 130, sortable: true},
                    {label: "支出申请时间", code: "dateSq", width: 130, sortable: true},
                    {label: "支出审批人", code: "dateSpr", width: 130, hidden: true},
                    {label: "支出审批日期", code: "dateSp", width: 130, hidden: true},
                    {label: "付款日期", code: "dateZc", width: 130, sortable: true},
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 130,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL',
                        hidden: true
                    },
                ],
                // 项目输出
                xmsccolumns: [
                    {label: "文件名称", code: "filename", width: 130, sortable: true},
                    {label: "文件编码", code: "filecode", width: 130, sortable: true},
                    {
                        label: "文件大小", code: "fileSize", width: 130, sortable: true, formatter(row) {
                            return row.fileSize ? (row.fileSize / 1024).toFixed(2) + 'kb' : '';
                        }
                    },
                    {
                        label: "上传日期", code: "createDate", width: 130, sortable: true, formatter(row) {
                            return row.createDate ? moment(row.createDate).format('YYYY-MM-DD') : '';
                        }
                    },
                    {
                        label: "密级",
                        code: "dataSecretLevcode",
                        width: 130,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: "任务名称", code: "rwname", width: 130, sortable: true},
                ],
                xmscoperations: [
                    {name: '下载', callback: this.downloadFile},
                ],
                // 是否展示流程实例按钮
                isShowFlowBtn: false,
                // 流程数据
                flowDataList: []
            }
        },
        watch: {
            row() {
                this.getDetail(this.row);
            },
        },
        created() {
            this.getDetail(this.row);
        },
        methods: {
            // 下载
            downloadFile(row) {
                this.$downloadFile(row.dataid);
            },
            handleClick(val) {
                if (val.name == 'wbs') {
                    this.$refs.wbsFj.refresh();
                }
                if (val.name == "xmsr") {
                    this.$refs.pmsXmRwFjListXmsr1.resize();
                }
                // if (val.name=="xmsc") {
                //   this.$refs.pmsXmRwFjListXmsc1.resize();
                // }
                if (val.name == "fengxian") {
                    this.$refs.pmsSectFx.resize();
                }
                if (val.name == "ndjh") {
                    this.$nextTick(_ => {
                        this.$refs.vxetable.recalculate();
                    })

                }
            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            // 获取详情数据
            getDetail(row) {
                this.detailVisible = true;  //打开模态框
                this.activeName = 'first';
                this.gridData = [];
                this.sectedContract = [];
                this.canRemoveContaractList = [];
                this.queryListXmsr = []; //点击编辑的时候项目输入模态框先清空
                this.queryListXmsc = []; //点击编辑的时候项目输出模态框先清空
                this.queryListXmcy = []; //点击编辑的时候项目成员模态框先清空
                this.getBasicMsg(row.oid)
                this.getListXmsrData(row.oid);  //获取当前行的项目信息主键OID --查询项目输入
                this.getListXmscData(row.oid);  //获取当前行的项目信息主键OID --查询项目输出
                this.getListXmcyData(row.oid)   //获取当前行的项目信息主键OID --查询项目成员
                this.getEditContractList(row.oid);//获取当前行的项目信息主键OID --查询合同
                this.queryWbs(row.oid);//获取当前行的项目信息主键OID --项目计划任务
                this.getListFzqd(row.oid);//获取风险清单
                this.getscjh(row.oid);//获取生产计划
                this.getjfzc(row.oid);//获取经费支出
                this.getFlowList(row.oid); // 获取流程
                this.fxqdList = [];
                // wbs
                this.$nextTick(() => {
                    // this.$refs.wbsFj.xmkNodeClick();
                    this.$refs.pmssectMember.empty();

                })
            },
            toDetail(row) {
                this.$router.push('/pms/htgl/htdj_flow?dataId=' + row.oid)
                this.$emit('handleClose');
            },
            // 获取流程权限
            getLimit(dataid) {
                this.$axios.get("/bpm/pro/init", {params: {dataId: dataid}})
                    .then(result => {
                        this.isShowFlowBtn = true
                    })
                    .catch(error => {
                        this.isShowFlowBtn = false
                    })
            },
            // 流程记录查看
            getFlowList(xmOid) {
                this.$axios.get("/pms/XtBpmRec/listByBoid", {params: {boid: xmOid}})
                    .then(result => {
                        this.flowDataList = result.data;
                        if (this.flowDataList.length > 0) {
                            let dataId = result.data[0].bpmDataId;
                            this.getLimit(dataId);
                            return;
                        }


                    })
                    .catch(error => {
                        this.$message.error("项目库流程列表失败")
                    })
                    .finally(_ => {

                    })
            },
            toLookFlow () {
                let data = this.flowDataList;
                let dataId = data[0].bpmDataId;
                let arr = data.map((c) => {
                    return {
                        bpmName: c.bpmName,
                        bpmDataId: c.bpmDataId,
                    }
                })
                this.$router.push({
                    path: '/pms/xmgl/XmLookFlow',
                    query: {oid: this.row.oid, dataId: dataId, data: JSON.stringify(arr)}
                });
                this.$emit('handleClose')
            },
            // 项目基本信息查询
            getBasicMsg(xmOid) {
                this.$axios.get("/pms/Xminfo/queryListXminfoaData", {params: {oid: xmOid}})
                    .then(result => {
                        this.$nextTick(_ => {   //事件循环
                            this.$refs.definition.resetFields();  //刷新模态框
                            this.formModel = {...result.data[0]};
                        })
                    })
                    .catch(error => {
                        this.$message.error("获取项目基本数据失败！")
                    })
            },
            //获取项目输入,添加附件数据
            getListXmsrData(xmOid) {
                this.$axios.get("pms/XtFj/querylistByOidXmsrFj?isAll=1", {params: {bOid: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsr.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            /**
             *  点击编辑的时候根据项目OID获取项目输出数据
             */
            getListXmscData(xmOid) {
                this.$axios.get("pms/XtFj/listXmXtfj", {params: {oidXm: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsc.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // 获取编辑时的合同
            getEditContractList(xmOid) {
                this.$axios.get("/pms/Xminfo/querylistByOidXmht", {params: {oid: xmOid}})
                    .then(result => {
                        this.gridData = [...this.gridData, ...result.data];
                        this.editContractList = result.data;
                        this.projectContractpage.total = result.total
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            //获取项目列表数据
            getListXmcyData(oidXm) {
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                        let arr = [];
                        result.data.forEach((c, i) => {
                            arr.push(c.oid);
                        });
                        this.personIds = arr;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // ############### 查询wbs 分解
            getWbsData(xmOid) {
                this.$axios.get("/pms/Xminfo/querylistByOidWbs", {params: {oid: xmOid}})
                    .then(result => {
                        this.wbsData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取项目年度计划失败！")
                    })
            },
            //获取项目风险数据
            getListFzqd(oidXm) {
                this.$axios.get("pms/Xminfo/querylistByOidXmfx", {params: {oid: oidXm}})
                    .then(result => {
                        this.fxqdList = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // 获取生产计划
            getscjh(oidXm) {
                this.$axios.get("pms/PmsScJh/listByParams", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.scjhData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划数据失败！")
                    })
            },
            // 获取经费支出
            getjfzc(oidXm) {
                this.$axios.get("pms/PmsXmJfzctz/queryListByXmOidXmjfzcTzData", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.jfzcData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取生产计划数据失败！")
                    })
            },
            queryWbs(oid) {
                //获取查询框的值
                let iceQueryCondition = [{
                    column: 'oidXm',
                    exp: '=',
                    value: oid
                }]
                let columns = Object.keys(this.wbsFormModel)
                if (columns.findIndex(item => item === '_XID') != -1) {
                    columns.splice(columns.findIndex(item => item === '_XID'), 1)
                }
                if (columns.findIndex(item => item === 'ROW_ID') != -1) {
                    columns.splice(columns.findIndex(item => item === 'ROW_ID'), 1)
                }
                if (columns.findIndex(item => item === 'isNew') != -1) {
                    columns.splice(columns.findIndex(item => item === 'isNew'), 1)
                }
                if (columns.findIndex(item => item === 'children') != -1) {
                    columns.splice(columns.findIndex(item => item === 'children'), 1)
                }
                if (columns.findIndex(item => item === 'fileList') != -1) {
                    columns.splice(columns.findIndex(item => item === 'fileList'), 1)
                }
                if (columns.findIndex(item => item === 'insertList') != -1) {
                    columns.splice(columns.findIndex(item => item === 'insertList'), 1)
                }
                if (columns.findIndex(item => item === 'updateList') != -1) {
                    columns.splice(columns.findIndex(item => item === 'updateList'), 1)
                }
                if (columns.findIndex(item => item === 'deleteList') != -1) {
                    columns.splice(columns.findIndex(item => item === 'deleteList'), 1)
                }
                const query = {columns, conditions: iceQueryCondition}
                this.pageList(query)
            },
            pageList(queryParam) {
                let {currentPage, pageSize} = this.tablePage
                this.$axios.get("/pms/PmsWbs/treeList", {params: queryParam})
                    .then(result => {
                        const data = result.data
                        this.wbsData = data
                    })
            },
            // 查看wbs详情
            async handleLook(row) {
                await this.$axios.get("/pms/PmsWbs/getPmsWbs", {params: {id: row.oid}})
                    .then(result => {
                        this.wbsData = result.data;
                    })
                this.$refs.wbsGrid.getPeripheralParams("详情", this.wbsData)
            },
            // 项目合同分页
            sizeChange() {

            },
            currentChange() {

            }
        }

    }
</script>

<style lang="less" scoped>
    .detail-tab {
        height: 500px;
        overflow: auto;
    }

    .toFlow {
        position: absolute;
        top: 5px;
        right: 10px;
        z-index: 10000;
    }
</style>
