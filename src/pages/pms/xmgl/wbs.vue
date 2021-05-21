<template>
    <div class="ice-container" v-loading="loading">
        <el-container>
            <!-- <el-aside width="250px">
                <el-tabs type="border-card">
                    <ice-tree load-url="/pms/Xminfo/QueryTree"
                                label-prop="xmname"
                                value-prop="oid"
                                style="height: 400px"
                                @node-click="xmkNodeClick"
                                :lazy="false">
                    </ice-tree>
                </el-tabs>
            </el-aside> -->
            <el-main>
                <el-tag style="width: 100%; font-size: 14px">
                    {{this.insertRecord.xmcode}}({{this.insertRecord.xmname}})年度任务计划 <span
                        style="color: #ff3366; margin: 0 10px; cursor: pointer"
                        @click="()=>{this.$router.go(-1);}">返回</span></el-tag>
                <!--引用vxe组件,定义变量-->
                <vxe-toolbar setting>
                    <template v-slot:buttons>
                        <div class="ice-grid-button-bar" style="height: auto;">
                            <div class="left">
                                <div class="ttop">
                                    <el-button type="success" icon="el-icon-position" @click="saveBatch"
                                               :disabled="spText=='提交变更'">保存
                                    </el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-refresh" @click="refreshGrid">刷新
                                    </el-button>
                                    <el-button type="primary" icon="el-icon-setting" @click="setModel">设置模板</el-button>
                                    <el-button type="primary" icon="el-icon-tickets" :disabled="isUserTemp" @click="useModel">使用模板</el-button>
                                    <el-button type="primary" icon="el-icon-tickets" @click="sectNodeToFlow"
                                               :disabled="spText!='类型不同、禁止提交'&&selection.length>0?false:true">
                                        {{spText}}
                                    </el-button>
                                    <!--<el-button type="primary" icon="el-icon-download" @click="exportFun">导出</el-button>-->
                                </div>
                                <div class="tb">
                                    <!--<el-button type="primary" icon="el-icon-edit" @click="editItem" :disabled="selectRecords?false:true">{{opera}}</el-button>-->

                                    <el-button type="primary" icon="el-icon-plus" @click="addItem">新增</el-button>
                                    <el-button type="primary" icon="el-icon-circle-plus-outline" @click="insertAtEvent"
                                               :disabled="selectRecords?false:true">插入
                                    </el-button>
                                    <el-button type="primary" icon="el-icon-plus" @click="addChild"
                                               :disabled="selectRecords?false:true">子节点
                                    </el-button>
                                    <!-- <el-button type="primary" icon="el-icon-edit" @click="changeItem">变更</el-button> -->

                                    <el-button type="primary" icon="el-icon-back" @click="rwUp"
                                               :disabled="!isUpDown">升级
                                    </el-button>
                                    <el-button type="primary" icon="el-icon-right" @click="rwDown"
                                               :disabled="!isUpDown">降级
                                    </el-button>
                                    <el-button type="danger" icon="el-icon-minus" :disabled="!isUpDown"
                                               @click="deleteItem">
                                        移除
                                    </el-button>
                                </div>
                            </div>
                            <div class="ice-quick-query" style="float: right;">
                                <el-input maxlength="50" v-model="queryParam" placeholder="请输入关键字">
                                </el-input>
                            </div>
                        </div>
                    </template>
                </vxe-toolbar>
                <vxe-table
                        class="wbstable-style"
                        border
                        resizable
                        show-overflow
                        ref="xGrid"
                        highlight-hover-row
                        highlight-current-row
                        :height="screenHeight-230"
                        @context-menu-click="contextMenuClickEvent"
                        @cell-click="vxeCellClick"
                        :customs.sync="customColumns"
                        :edit-rules="validRules"
                        :toolbar="toolbar"
                        :data="list"
                        :cell-class-name="cellClassName"
                        :context-menu="{body: {options: bodyMenus}, visibleMethod}"
                        :edit-config="{trigger: 'click', mode: 'row', showStatus: true, showIcon: false}"
                        :tree-config="treeConfig"
                        :checkbox-config="{labelField: 'dataPxh', highlight: true, checkMethod: setCheckStatus, checkStrictly: true}"
                        @select-all="selectAllEvent"
                        @checkbox-change="checkboxChange"
                        @current-change="currentChange"
                        :keyboard-config="{isArrow: false}">
                    <vxe-table-column type="checkbox" field="dataPxh" title="序号" width="60"
                                      fixed="left"></vxe-table-column>
                    <vxe-table-column field="rwzt" width="110px" title="任务状态">
                        <template v-slot="{ row }">
                            {{datamap[row.rwzt]}}
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="qzrw" title="前置任务" width="80" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row, rowIndex }">
                            <el-input name="points" v-model="row.qzrw"
                                      :disabled="rowDisabled(row)"
                                      @blur="qzrwBlurEvent({ row, rowIndex })"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="wbscode" title="WBS编号" width="80px" tree-node
                                      fixed="left"></vxe-table-column>
                    <vxe-table-column field="rwname" title="任务内容" width="500px" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <el-input v-model="row.rwname" :disabled="rowDisabled(row)" maxlength="1000"
                                      show-word-limit=""
                                      :title="row.rwname"></el-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dateJhStar" title="开始日期" width="150px" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <el-date-picker
                                    type="date"
                                    @change="(val)=>{dateJhStartChange(val, row)}"
                                    @focus="dateJhStartFocus(row)"
                                    :disabled="rowDisabled(row)"
                                    :picker-options="pickerOptions(1, row)"
                                    v-model="row.dateJhStar" format="yyyy/MM/dd"></el-date-picker>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="dateJhEnd" title="完成日期" width="150px" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <el-date-picker
                                    type="date"
                                    @change="dateJhEndChange(row)"
                                    :disabled="rowDisabled(row)"
                                    :picker-options="pickerOptions(2, row)"
                                    v-model="row.dateJhEnd" format="yyyy/MM/dd"></el-date-picker>
                        </template>
                    </vxe-table-column>
                    <!--<vxe-table-column field="rwmb" title="任务目标" width="500px" :edit-render="{type: 'visible'}">-->
                    <!--<template v-slot:edit="{ row }">-->
                    <!--<el-input v-model="row.rwmb" :disabled="rowDisabled(row)" maxlength="650"-->
                    <!--show-word-limit=""-->
                    <!--:title="row.rwmb"></el-input>-->
                    <!--</template>-->
                    <!--</vxe-table-column>-->
                    <vxe-table-column field="rwfzr" title="责任人" width="150" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <ice-persion-selector :mode="rowDisabled(row)?'readonly': 'onlySelect'"
                                                  chooseItem="single"
                                                  @select-confirm="persion=>{selectConfirm(row, persion)}"
                                                  v-model="row.rwfzr">
                            </ice-persion-selector>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="rwdept" title="责任单位" width="150">

                    </vxe-table-column>
                    <vxe-table-column field="jjcd" width="100px" title="紧急程度">
                        <template v-slot="{ row }">
                            <ice-select :disabled="rowDisabled(row)" v-model="row.jjcd"
                                        map-type-code="JJCD"></ice-select>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="yscode" title="预算号" width="200" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <el-input v-if="row.pid=='0'" v-model="row.yscode" :disabled="rowDisabled(row)"
                                      maxlength="100"
                                      show-word-limit=""
                                      :title="row.yscode"></el-input>
                            <span v-else>无</span>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="rwdept" title="操作" width="100" fixed="right">
                        <template v-slot="{ row }">
                            <el-button type="text" @click="toDetail(row)" v-if="rowDisabled(row)">查看更多</el-button>
                            <el-button type="text" @click="editItem(row)" v-else>编辑更多</el-button>

                        </template>
                    </vxe-table-column>


                    <!-- <vxe-table-column field="rwgq" title="工期" width="130px" :edit-render="{type: 'visible'}">
                        <template v-slot:edit="{ row }">
                            <el-input-number v-model="row.rwgq" :disabled="row.rwzt=='RWZT40'" @change="rwgqChangeEvent({ row })"></el-input-number>
                        </template>
                    </vxe-table-column> -->

                    <!--<vxe-table-column field="rwlx" title="任务成果形式" width="150">-->
                    <!--<template v-slot="{ row }">-->
                    <!--<ice-select :disabled="rowDisabled(row)" v-model="row.rwlx"-->
                    <!--map-type-code="RWLX"></ice-select>-->
                    <!--</template>-->
                    <!--</vxe-table-column>-->

                    <vxe-table-column field="dataSecretLevcode" title="密级" width="100px"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'DATA_SECRET_LEVEL'}">
                        <template v-slot="{ row }">
                            <ice-select :disabled="rowDisabled(row)" :controlMj="[$route.query.dataSecretLevcode]"
                                        v-model="row.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        placeholder="请选择">
                            </ice-select>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="spzt" width="110px" title="审批状态"
                                      :cell-render="{name: 'mapTypeCode', mapTypeCode: 'SPZT'}"></vxe-table-column>

                </vxe-table>
            </el-main>
        </el-container>
        <!--弹出模态框-->
        <WbsEdit ref="myWbsEdit" @getInfoDate="getInfoDate" :pcomputeDate="computeDate"
                 :controlMj="[$route.query.dataSecretLevcode]"></WbsEdit>
        <wbsTypeLate ref="wbsTypeLate"></wbsTypeLate>
        <ice-dialog title="使用模板" :visible.sync="visible" width="1300px">
            <div>
                <wbsTypelateQuery ref="wbsTypelateQuery" :getModelData="getModelData" :visible="visible"
                                  :isUseModel="isUseModel"></wbsTypelateQuery>
                <div class="ice-button-bar">
                    <!-- <slot name="footer" :row="formModel"></slot> -->
                    <el-button type="primary" @click="selectModel">确定</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </div>

        </ice-dialog>
        <!--// 导出-->
        <ice-dialog title="数据导出预览" :visible.sync="exportSelectorShow"
                    height="700px" width="1200px" remounted>
            <ice-query-grid-export :exportQuery="querys"
                                   :exportColumn="exprortcolumns"
                                   data-url="/pms/PmsWbs/list"
                                   exportTitle="年度任务计划导出"
                                   exportType="remote"
                                   :pager="pagination"
                                   @export-cancel="exportSelectorShow=false">

            </ice-query-grid-export>
        </ice-dialog>
        <!--审核错误提示-->
        <ice-dialog title="提交审批必填项错误提示" :visible.sync="errVisible" width="1200px">
            <div>
                <ice-query-grid
                        :grid-data="errData"
                        :columns="sprulesColums"
                        ref="gridErr"
                        :gridAutoRefresh="false"
                        :pagination="false"
                        exportTitle="科研项目信息"
                >
                </ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="success" @click="exportErr">导出</el-button>
                    <el-button type="primary" @click="errVisible=false">确认</el-button>
                </div>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import WbsEdit from "./wbsEdit";
    import wbsTypeLate from "./wbsTypeLate";
    import wbsTypelateQuery from "./wbsTypeLateQuery";
    import moment from 'moment'
    import IceQueryGridExport from "../../../components/common/base/IceQueryGridExport";
    import {mapGetters, mapMutations} from 'vuex'

    import {RWZT, SPZT, XMJS} from "../../../utils/constant";

    const m = new Map();
    m.set('RWZT10', '新建')
    m.set('RWZT20', '未下发')
    m.set('RWZT30', '执行中')
    m.set('RWZT31', '执行中(暂停)')
    m.set('RWZT32', '执行中(逾期)')
    m.set('RWZT33', '执行中(更新)')
    m.set('RWZT40', '完成')
    m.set('RWZT41', '取消')

    const levelMap = new Map();
    levelMap.set('1', '公开')
    levelMap.set('2', '内部')
    levelMap.set('3', '秘密')
    levelMap.set('4', '机密')
    levelMap.set('5', '绝密')

    const rwlxMap = new Map();
    rwlxMap.set('DEFAULT', '一般任务')
    rwlxMap.set('PDM', '设计任务PDM')
    rwlxMap.set('CAPP', '工艺任务CAPP')
    rwlxMap.set('MES', '生产任务MES')
    rwlxMap.set('QIS', '质量任务QIS')
    rwlxMap.set('JDRW', '阶段性任务')

    const jjcdMap = new Map();
    jjcdMap.set('yb', '一般')
    jjcdMap.set('tj', '特级')
    jjcdMap.set('jj', '紧急')
    export default {
        name: "wbs",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                // 变更状态控制
                isChangeEdit: false,
                queryParam: '',
                opera: '编辑',
                //调用页面网格数据
                tableData: [],
                removeList: [],
                toolbar: {
                    id: 'toolbar_demo_2',
                    refresh: false,
                    setting: {
                        storage: true
                    }
                },
                tablePage: {
                    total: 0,
                    currentPage: 1,
                    pageSize: 10
                },
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    indent: '10',
                    expandAll: true
                },
                customColumns: [
                    {field: 'dataSecretLevcode', visible: true}
                ],
                validRules: {
                    rwname: [
                        {required: true, message: '任务名称必须填写'}
                    ],
                    rwfzr: [
                        {required: true, message: '责任人必须选择', trigger: 'change'}
                    ],
                    rwdept: [
                        {required: true, message: '责任单位必须选择', trigger: 'change'}
                    ],
                    rwjd: [
                        {type: 'number', min: 0, message: '任务进度必须大于0'}
                    ],
                    rwgq: [
                        {type: 'number', min: 1, message: '任务工期必须大于0'}
                    ],
                    rwgs: [
                        {type: 'number', min: 1, message: '任务工时必须大于0'}
                    ],
                },
                rules: {
                    rwname: [
                        {required: true, whitespace: true, message: '请输入任务名称', trigger: 'blur'}
                    ],
                    wbscode: [
                        {required: true, whitespace: true, message: '请输入WBS编号', trigger: 'blur'}
                    ],
                    version: [
                        {required: true, whitespace: true, message: '请输入版本', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, whitespace: true, message: '请选择密级', trigger: 'blur'}
                    ],
                },
                //定义弹出框为false，隐藏状态
                visible: false,
                title: '',
                xmysjfhj: 0,
                xmrltr: 0,
                insertRecord: {
                    oid: this.getRandomId(),
                    oidXm: '',
                    xmname: '',
                    xmcode: '',
                    pid: '0',
                    wbscode: '0',
                    rwname: '',
                    rwlx: 'DEFAULT',
                    qzrw: '',
                    rwjd: '0',
                    rwgq: '1',
                    rwgs: '1',
                    rwms: 'RWMS01',
                    rwzt: RWZT.XJ,
                    xzlx: 'XZLX01',
                    jjcd: 'yb',
                    dateJhStar: this.defaultDate(),
                    dateJhEnd: this.defaultDate(),
                    oidRwdept: '',
                    rwdeptcode: '',
                    rwdept: '',
                    oidRwfzr: '',
                    rwfzrcode: '',
                    rwfzr: '',
                    dataPxh: '',
                    dataSecretLevcode: '',
                    rwtj: 'FS',
                    rwysJfSum: 0,
                    rwysRl: 0,
                    fileList: [],
                    isNew: true
                },
                // 导出
                exportSelectorShow: false,
                pagination: true,
                querys: [
                    {
                        type: 'static', code: 'oidXm', label: '项目oid', value: () => {
                            return this.$route.query.oid
                        }
                    },
                    {type: 'input', code: 'rwname', label: '任务名称'},
                ],
                exprortcolumns: [
                    {code: "oid", hidden: true},
                    {label: "wbs编码", code: "wbscode"},
                    {label: "任务内容", code: "rwname"},
                    {label: "前置任务", code: "qzrw"},
                    {label: "开始日期", code: "dateJhStar"},
                    {label: "完成日期", code: "dateJhEnd"},
                    {label: "任务成果形式", code: "rwlx", mapTypeCode: 'RWLX'},
                    {label: "紧急程度", code: "jjcd", mapTypeCode: 'JJCD'},
                    {label: "密级", code: "dataSecretLevcode", mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "责任单位", code: "rwdept"},
                    {label: "责任人", code: "rwfzr"},
                    {label: "任务状态", code: "rwzt", mapTypeCode: 'RWZT'},
                    {label: "项目经费渠道", code: "xmjfqd", mapTypeCode: 'XMLY'},
                    {label: "财务脱密代码", code: "cwtmdm"},
                    {label: "预算号", code: "yscode"},
                    {label: "任务目标", code: "rwmb"},
                ],
                sprulesColums: [
                    {label: "任务内容", code: "rwname"},
                    {label: "责任人", code: "rwfzr"},
                    {label: "密级", code: "dataSecretLevcode", mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: "项目经费渠道", code: "xmjfqd", mapTypeCode: 'XMLY'},
                    {
                        label: "开始日期", code: "dateJhStar", formatter(row) {
                            return row.dateJhStar ? moment(row.dateJhStar).format("YYYY-MM-DD") : ""
                        }
                    },
                    {
                        label: "完成日期", code: "dateJhEnd", formatter(row) {
                            return row.dateJhEnd ? moment(row.dateJhEnd).format("YYYY-MM-DD") : ""
                        }
                    },
                    {label: "财务脱密代码", code: "cwtmdm"},
                    {
                        label: "预算号", code: "yscode", formatter(row) {
                            return row.pid == 1 ? row.yscode : "无"
                        }
                    },
                    {label: "任务目标", code: "rwmb"},
                ],
                dataPxh: 0,
                //定义模态框 转圈加载过程
                loading: false,
                pickerOptionsStart: {},
                pickerOptionsEnd: {
                    // disabledDate(time) {
                    //   return time.getTime() > Date.now();
                    // },
                },
                bodyMenus: [
                    [
                        {
                            code: 'insertAt',
                            name: '插入',
                            prefixIcon: 'el-icon-circle-plus-outline',
                            disabled: false
                        },
                        {
                            code: 'childNode',
                            name: '子节点',
                            prefixIcon: 'el-icon-plus',
                            disabled: false
                        },
                        {
                            code: 'remove',
                            name: '移除',
                            prefixIcon: 'el-icon-minus',
                            disabled: false
                        },
                        {
                            code: 'shengji',
                            name: '升级',
                            prefixIcon: 'el-icon-back',
                            disabled: false
                        },
                        {
                            code: 'jiangji',
                            name: '降级',
                            prefixIcon: 'el-icon-right',
                            disabled: false
                        },
                        {
                            code: 'upone',
                            name: '上移',
                            prefixIcon: 'el-icon-top',
                            disabled: false
                        },
                        {
                            code: 'downone',
                            name: '下移',
                            prefixIcon: 'el-icon-bottom',
                            disabled: false
                        }
                    ]
                ],
                //删除按钮状态,false：可用 true 不可用
                delBtnState: true,
                isUseModel: true,
                screenHeight: window.innerHeight,
                // 选中的节点
                selection: [],
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                // 单选选中的节点
                selectRecords: null,
                mapTypeCode: 'RWZT',
                sprules: [
                    'rwname',
                    'rwfzr',
                    'dataSecretLevcode',
                    'xmjfqd',
                    'dateJhEnd',
                    'dateJhStar',
                    'cwtmdm',
                    'yscode',
                    'rwmb'
                ],
                // 错误数据集合
                errData: [],
                errVisible: false,
                // 项目第一责任人数据
                zrrData: {}

            }
        },
        created() {
            // this.pickerOptions = {
            //     disabledDate(time) {
            //         if (new Date(time).getDay() == 0 || new Date(time).getDay() == 6) {
            //             return true
            //         }
            //         return false;
            //     }
            // }
            if (this.mapTypeCode) {
                console.log('开始穿穿件')
                this.addUndoTypeCodes(this.mapTypeCode);
            }

        },
        mounted() {
            window.onresize = () => {
                return (() => {
                    this.screenHeight = window.innerHeight
                })()
            },
                this.$nextTick(() => {
                    this.xmkNodeClick()
                })
        },
        //触发事件方法
        methods: {
            // 日期控制
            pickerOptions(type, row) {
                if (type == 1) {
                    let end = row.dateJhEnd;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr || (new Date(time).getDay() == 0 || new Date(time).getDay() == 6);
                        }
                    }
                } else {
                    let start = row.dateJhStar;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr || (new Date(time).getDay() == 0 || new Date(time).getDay() == 6);
                        }
                    }
                }
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            // 获取项目成员
            getListXmcyData(oidXm) {
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.zrrData = result.data.find(c => {
                            return c.xmcylx == XMJS.YZZR
                        })

                        if (!this.tableData || this.tableData.length == 0) {
                            //自动创建年度阶段性任务
                            this.addItem(new Date().getFullYear() + "年度阶段性任务", 1);
                        }
                        // 设置默认值

                    })
                    .catch(error => {
                        this.$message.error("获取项目成员数据失败！")
                    })
            },
            // 行编辑禁用
            rowDisabled(row) {

                let issectrow = this.selection.filter(c => {
                    return c.oid == row.oid
                })
                let a = false
                if (issectrow.length > 0) {
                    a = true;
                }
                let pan = a;
                if (row.rwname == "哈哈哈哈哈") {
                    console.log(row.spzt != null && row.spzt != SPZT.WSP && !pan, 'row');
                }
                if (row.spzt != null && row.spzt != SPZT.WSP && !pan) {
                    return true;
                } else {
                    return false;
                }
            },
            selectConfirm(row, persion) {
                console.log(row, 'row');
                console.log(persion, 'persion');
                row.oidRwfzr = persion[0].oid;
                row.rwfzrcode = persion[0].code;
                row.rwfzr = persion[0].name;
                row.oidRwdept = persion[0].deptId;
                row.rwdeptcode = persion[0].deptCode;
                row.rwdept = persion[0].deptShortName;
            },
            // 设置行选中状态
            setCheckStatus({row}) {
                let arr = [...row.wbscode.toString()];
                if (row.spzt == SPZT.SPZ || arr.length > 3) {
                    return false;
                } else {
                    return true;
                }
            },
            // 选中所有事件
            selectAllEvent({selection}) {
                this.selection = selection;
                this.selectRecords = null;
                this.$refs.xGrid.clearCurrentRow();
            },
            checkboxChange() {
                this.selectRecords = null;
                this.$refs.xGrid.clearCurrentRow();
            },
            // 选中行
            currentChange({row}) {
                this.selectRecords = row;
            },
            // 选中节点走流程
            sectNodeToFlow() {
                let data = this.$refs.xGrid.getSelectRecords();
                // 验证通过
                let errData = [];
                data.forEach(c => {
                    let a = false;
                    if (c.pid != '0') {
                        return;
                    }
                    this.sprules.forEach(p => {
                        if (c[p] == null || c[p] == undefined || !c[p]) {
                            a = true;
                            return;
                        }
                    })
                    if (a) {
                        errData.push(c);
                    }
                })
                if (errData.length > 0) {
                    this.errData = errData;
                    this.errVisible = true;
                    this.$message.error('请检查表单，有些必填项为空！');

                    return;
                }
                if (this.spText == '变更') {
                    this.isChangeEdit = true;
                    return
                }
                if (this.spText == '提交变更') {
                    // return
                    this.$router.push({
                        name: '/pms/xmgl/wbsFlow', params: {
                            data: JSON.stringify(data),
                            change: 1,
                            xmoid: this.$route.query.oid
                        }
                    })
                    return
                }
                let updateAttaData = this.$refs.xGrid.getUpdateRecords();
                let insertRecords = this.$utils.filterTree(this.tableData, item => item.isNew, this.treeConfig)
                let removeRecords = this.removeList
                let noconfirmitem = insertRecords.concat(removeRecords, updateAttaData);
                if (noconfirmitem.length > 0) {
                    this.$message.error('有未保存的项，请先保存在走流程');
                    return
                }


                // // 找出根节点数据
                // let rootnodes = data.filter(c => {
                //     return c.wbscode * 1 % 1 === 0
                // })
                // if (rootnodes.length <= 0) {
                //     this.$message.error('请选择至少一个根节点');
                //     return
                // }
                console.log(data, 'data')
                // return
                this.$router.push({
                    name: '/pms/xmgl/wbsFlow', params: {
                        data: JSON.stringify(data),
                        xmoid: this.$route.query.oid
                    }
                })
            },
            // 导出错误
            exportErr() {
                this.handleExport();
            },
            // 封装导出表格
            handleExport() {
                let std = '';
                this.sprulesColums.forEach((c) => {
                    std += `<td>${c.label}</td>`
                })
                let str1 = `<tr>${std}</tr>`
                this.errData.forEach((c, i) => {
                    let s = '';
                    this.sprulesColums.forEach((p) => {
                        let item = c[p.code] ? c[p.code] : "";
                        ;s += `<td>${p.code ? item : (i + 1)}</td>`
                    })
                    let strb = `<tr>${s}</tr>`
                    str1 += strb
                })
                let str = str1;
                //Worksheet名
                let worksheet = 'Sheet1'
                let uri = 'data:application/vnd.ms-excel;base64,';

                //下载的表格模板数据
                let template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
                //下载模板
                let ele = document.createElement('a');
                ele.href = uri + this.base64(template);
                ele.download = '错误数据' + '.xls'
                ele.click();
                // window.location.href = uri + this.base64(template)
            },
            // 表格转码
            base64(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            getValue(key) {
                return m.get(key)
            },
            query() {
                console.log(this.screenHeight)
                //获取查询框的值
                const queryParam = this.queryParam
                let iceQueryCondition = [{
                    column: 'oidXm',
                    exp: '=',
                    value: this.insertRecord.oidXm
                }]
                if (queryParam != '') {
                    iceQueryCondition.push({
                        column: 'rwname',
                        exp: 'like',
                        value: queryParam
                    })
                }
                let columns = Object.keys(this.$refs.myWbsEdit.formModel)
                columns.push('spzt');
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
                        this.tableData = data
                        this.getListXmcyData(this.$route.query.oid);

                        this.removeList = [];
                        this.selection = [];
                        this.selectRecords = null;
                        this.$nextTick(() => {
                            this.$refs.xGrid.setAllTreeExpansion(true)
                        })

                    })
            },
            // 导出方法封装
            exportFun() {
                this.exportSelectorShow = true;
                return
                let params = {};
                const exportColumns = this.exprortcolumns.filter(item => !item.hidden || item.export).map(column => column.code + "::" + column.label + "::" + (column.mapTypeCode ? column.mapTypeCode : ''));//添加导出需要的列信息
                // params.exportColumnsName = this.columns.filter(item => !item.hidden).map(column => column.name);//添加导出需要的列信息
                if (!exportColumns || exportColumns.length == 0) {
                    this.$message.warning("没有找到可以导出的列")
                    return
                }
                //params.columns=null;
                params.columns = this.exprortcolumns.map(c => {
                    return c.code
                })
                params.exportColumns = exportColumns.join(",");
                params.exportTitle = '年度任务计划'
                let conditionLink = 'AND';
                let staticConditions = [
                    {
                        column: 'oidXm',
                        exp: '=',
                        value: this.$route.query.oid,
                    },
                    {
                        column: 'deleteStatus',
                        exp: '=',
                        value: 0,
                    },
                    {
                        column: 'lockedStatus',
                        exp: '=',
                        value: 0,
                    }
                ]
                this.$axios.get('/pms/PmsWbs/list', {
                    params: {
                        ...params,
                        size: 100000,
                        staticConditions,
                        conditionLink,
                        current: 1
                    },
                    headers: {'Accept': 'application/ice-xls;q=1,*/*;q=0.5'},
                    responseType: 'blob',
                }).finally(() => {
                    // this.loading = false;
                    // this.exportSelectorShow = false;
                })
            },
            //rwname 自动新增一行时的任务名称，type 1 自动生成一行，0 手动
            addItem(rwname, type) {
                console.log(this.insertRecord, 'insertRecord开始')
                this.insertRecord.pid = "0"
                let xGrid = this.$refs.xGrid
                this.insertRecord.oid = this.getRandomId();
                console.log(this.zrrData)
                if (type) {
                    let date = new Date;
                    let min = this.$route.query.gmtLx;
                    let max = moment(date).format("YYYY") + '-12-31';


                    let gq = this.countGq(min, max);
                    console.log(gq, 'gq')
                    this.insertRecord.rwname = rwname;
                    if (this.zrrData) {
                        this.insertRecord.oidRwfzr = this.zrrData.oidUser;
                        this.insertRecord.rwfzrcode = this.zrrData.code;
                        this.insertRecord.rwfzr = this.zrrData.name;
                        this.insertRecord.oidRwdept = this.zrrData.deptId;
                        this.insertRecord.rwdeptcode = this.zrrData.deptCode;
                        this.insertRecord.rwdept = this.zrrData.deptName;
                    }
                    this.insertRecord.dateJhStar = min;
                    this.insertRecord.dateJhEnd = max;
                    this.insertRecord.rwgq = gq;
                } else {
                    this.insertRecord.rwname = '';
                    this.insertRecord.oidRwfzr = '';
                    this.insertRecord.rwfzrcode = '';
                    this.insertRecord.rwfzr = '';
                    this.insertRecord.oidRwdept = '';
                    this.insertRecord.rwdeptcode = '';
                    this.insertRecord.rwdept = '';
                    this.insertRecord.dateJhStar = '';
                    this.insertRecord.dateJhEnd = '';
                    this.insertRecord.rwgq = '';
                }
                console.log(this.insertRecord, 'insertRecord')
                xGrid.createRow(this.insertRecord).then(newRow => {
                    //计算wbs编码
                    newRow.wbscode = this.tableData.length + 1
                    this.tableData.push(newRow)
                    this.dataPxh = 0
                    this.computePxh(this.tableData)
                    this.updateFlage()
                    xGrid.refreshData().then(() => xGrid.setActiveRow(newRow))
                    console.log(newRow)
                })
            },
            // 查看详情
            toDetail(row) {
                this.$nextTick(_ => {
                    this.$refs.myWbsEdit.getPeripheralParams("详情", row)
                })

            },
            editItem(row) {
                this.title = "编辑"
                //获取选中的数据
                // let selectRecords = this.$refs.xGrid.getCurrentRow();
                let selectRecords = row;
                console.log(selectRecords, 'selectRecords')
                if (!selectRecords) {
                    this.$message.warning("请选择一条数据！")
                    return
                }
                let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
                let {item, parent} = matchObj
                //预算号是否可修改，只允许修改顶级任务预算号
                let isYscodeEdit = true
                if (parent) {
                    item.yscode = parent.yscode
                    //直接继承父类预算号，不可修改
                    isYscodeEdit = false
                }

                let cgydList = item.cgydList
                if (cgydList) {
                    cgydList.forEach(element => {
                        element.iscgjf = element.cgjf === 'IS_YES'
                    });
                }

                this.$refs.myWbsEdit.getParentParams(this.title, item, this.tableData, isYscodeEdit)
            },
            changeItem() {
                let selectRecords = this.$refs.xGrid.getCurrentRow()
                if (!selectRecords) {
                    this.$message.warning("请选择一条数据！")
                    return
                }
                let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
                let {item} = matchObj
                this.$router.push({path: '/pms/xmgl/wbsChange', query: {oid: item.oid}})
            },
            getInfoDate(tableData) {
                console.log(tableData)
                let xGrid = this.$refs.xGrid
                this.tableData = tableData;
                xGrid.refreshData();
                // 执行保存  在表格加载完成后
                this.$nextTick(_ => {
                    this.saveBatch(1);
                })
            },
            deleteItem(selectRecords, column) {
                // let isChild = false;
                // this.selection.forEach(c=>{
                //     if (c.children&&c.children.length>0) {
                //         isChild = true;
                //     }
                // })
                // if (isChild) {
                //     this.$message.error('有存在子任务的数据，请先移除子任务！');
                //     return
                //
                // }
                this.$confirm('是否确认移除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //获取选中的数据
                    let xGrid = this.$refs.xGrid
                    if (!column) {
                        selectRecords = xGrid.getCurrentRow()
                        if (!selectRecords) {
                            this.$message.warning("请选择一条数据！")
                            return
                        }
                    }

                    //从列表中移除
                    let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
                    if (matchObj) {
                        let {items, index, item, parent} = matchObj
                        //如果存在子节点，提示用户先删除子节点
                        if (item.children && item.children.length > 0) {
                            this.$message.warning("该任务存在子任务，请先移除子任务！")
                            return
                        }
                        // 从树节点中移除
                        let restRow = items.splice(index, 1)[0]
                        if (!restRow.isNew) {
                            this.removeList.push(restRow)
                        }

                        if (parent) {
                            this.cumpteWbsCode(parent, items)
                        } else {
                            this.cumpteWbsCode(null, items)
                        }
                        //删除后，如果存在后置节点，则将后置节点的前置任务设置为空
                        //根据旧序号，得到所有后置任务
                        let rowNodes = this.$utils.filterTree(this.tableData, itemf => Number(itemf.qzrw) === item.dataPxh, this.treeConfig)
                        if (rowNodes && rowNodes.length > 0) {
                            rowNodes.forEach(item => {
                                item.qzrw = ''
                                item.dateJhStar = this.defaultDate()
                                //计划开始日期改变
                                this.dateJhStartChange(item)
                            })
                        }
                        //重新计算树节点序号
                        this.dataPxh = 0
                        this.computePxh(this.tableData)
                        this.updateFlage()
                        xGrid.refreshData()
                    }
                }).catch(() => {
                    console.log('取消成功')
                })

            },
            // 删除方法
            delFun(data) {
                this.$confirm('是否确认移除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {

                    data.forEach(selectRecords => {
                        //从列表中移除
                        let matchObj = this.$utils.findTree(this.tableData, item => item === selectRecords, this.treeConfig)
                        if (matchObj) {
                            let {items, index, item, parent} = matchObj
                            //如果存在子节点，提示用户先删除子节点
                            if (item.children && item.children.length > 0) {
                                let str = `第${index}条数据存在子任务，请选移除子任务`;
                                this.$message.warning(str);
                                return
                            }
                            // 从树节点中移除
                            let restRow = items.splice(index, 1)[0]
                            if (!restRow.isNew) {
                                this.removeList.push(restRow)
                            }

                            if (parent) {
                                this.cumpteWbsCode(parent, items)
                            } else {
                                this.cumpteWbsCode(null, items)
                            }
                            //删除后，如果存在后置节点，则将后置节点的前置任务设置为空
                            //根据旧序号，得到所有后置任务
                            let rowNodes = this.$utils.filterTree(this.tableData, itemf => Number(itemf.qzrw) === item.dataPxh, this.treeConfig)
                            if (rowNodes && rowNodes.length > 0) {
                                rowNodes.forEach(item => {
                                    item.qzrw = ''
                                    item.dateJhStar = this.defaultDate()
                                    //计划开始日期改变
                                    this.dateJhStartChange(item)
                                })
                            }
                            //重新计算树节点序号
                            this.dataPxh = 0
                            this.computePxh(this.tableData)
                            this.updateFlage()
                            xGrid.refreshData()
                        }
                    })

                }).catch(() => {
                    console.log('取消成功')
                })
            },
            addChild(selectRecords, column) {
                let xGrid = this.$refs.xGrid
                if (!column) {
                    selectRecords = xGrid.getCurrentRow()
                    if (!selectRecords) {
                        this.$message.warning("请选择一条数据！")
                        return
                    }
                }
                this.insertRecord.pid = selectRecords.oid
                this.insertRecord.oid = this.getRandomId()
                // 置空
                this.insertRecord.rwname = '';
                this.insertRecord.oidRwfzr = '';
                this.insertRecord.rwfzrcode = '';
                this.insertRecord.rwfzr = '';
                this.insertRecord.oidRwdept = '';
                this.insertRecord.rwdeptcode = '';
                this.insertRecord.rwdept = '';
                this.insertRecord.dateJhStar = '';
                this.insertRecord.dateJhEnd = '';
                xGrid.createRow(this.insertRecord).then(newRow => {
                    // 插入到 选中节点的子节点
                    let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)

                    if (rowNode) {
                        if (!rowNode.item.children) {
                            rowNode.item.children = []
                        }
                        //wbscode
                        //判断父节点有几位小数
                        const arrNum = rowNode.item.wbscode.toString().split(".")
                        let fixnum = 0
                        if (arrNum.length > 1) {
                            fixnum = rowNode.item.wbscode.toString().split(".")[1].length
                        }
                        newRow.wbscode = rowNode.item.wbscode + '.' + (rowNode.item.children.length + 1)
                        rowNode.item.children.push(newRow)
                        //计算序号,获取列表全部列数
                        this.dataPxh = 0
                        this.computePxh(this.tableData)
                        this.updateFlage()
                        xGrid.setTreeExpansion(selectRecords, true)
                        xGrid.refreshData().then(() => xGrid.setActiveRow(newRow))
                    }
                })
            },
            submitCheck() {

            },
            // 输入验证
            async fullValidEvent() {

                const errMap = await this.$refs.xGrid.fullValidate().catch(errMap => errMap)
                console.log(errMap, 'errmap')
                if (errMap) {
                    let msgList = []
                    Object.values(errMap).forEach(errList => {
                        errList.forEach(params => {
                            let {row, column, rules} = params
                            let matchObj = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
                            console.log(matchObj, 'matchobj')
                            let seq = matchObj.path.filter(item => item !== this.treeConfig.children).map(item => Number(item) + 1).join('.')
                            rules.forEach(rule => {
                                msgList.push(`wbs编号是 ${seq}  ${column.title} 校验错误：${rule.message}`)
                            })
                        })
                    })
                    this.$XModal.message({
                        status: 'error',
                        message: () => {
                            return [
                                <div class="red" style="max-height: 400px;overflow: auto;">
                                    {
                                        msgList.map(msg => <div>{msg}</div>)
                                    }
                                </div>
                            ]
                        }
                    })
                    return false;
                } else {
                    return true;
                }
            },
            saveBatch(type) {
                this.fullValidEvent().then(res => {
                    console.log(res, 'res')
                    if (res) {
                        this.$refs.xGrid.validate(valid => {
                            if (valid) {
                                let text = "是否保存未审批的新建任务？"
                                if (this.rwrltr > this.xmrltr) {
                                    text = "人力投入超过项目预算投入，确认保存吗？"
                                }
                                if (this.rwysjfhj > this.xmysjfhj) {
                                    text = "经费预算超过项目预算，确认保存吗？"
                                }
                                let xGrid = this.$refs.xGrid
                                let insertRecords = this.$utils.filterTree(this.tableData, item => item.isNew, this.treeConfig)
                                let removeRecords = this.removeList;
                                let updateRecordsA = this.$refs.xGrid.getUpdateRecords();
                                let updateRecords = this.$utils.filterTree(this.tableData, item => !item.isNew, this.treeConfig);
                                let zlupdateRecords = updateRecords.filter(c => {
                                    return c.spzt == SPZT.WSP || c.spzt == null || c.spzt == undefined
                                })
                                let he = insertRecords.concat(removeRecords, zlupdateRecords);
                                if (this.tableData.length == 0) {
                                    this.$message.warning("不能全部删除！")
                                    return
                                }
                                if (he.length <= 0) {
                                    if (type) {
                                        return;
                                    }
                                    this.$message.error('没有需要保存的任务！');
                                    return;
                                }
                                let entities = {
                                    insertEntity: insertRecords,
                                    updateEntity: zlupdateRecords,
                                    deleteEntity: removeRecords,
                                    xmOid: this.insertRecord.oidXm
                                }
                                this.loading = true;
                                this.$axios.post("/pms/PmsWbs/saveBatch", {$json: entities})
                                    .then(result => {
                                        this.$message.success("保存成功");  //保存完毕之后的提示
                                        this.query();
                                    })
                                    .catch(error => {
                                        this.$message.error("保存失败");
                                    })
                                    .finally(_ => {
                                        this.loading = false;
                                    })
                            }
                        })
                    }
                })

            },
            //刷新按钮方法
            refreshGrid() {
                this.query()
            },
            //随机数做为临时id
            getRandomId() {
                return new Date().getTime() + ''
            },
            rwmsChangeEvent({row}, evnt) {
                // 由于重写了内部的 model 事件，所以需要自行处理赋值相关的逻辑
                row.rwms = evnt
            },
            //项目树点击
            xmkNodeClick() {
                this.insertRecord.oidXm = this.$route.query.oid
                this.$axios.get("/pms/Xminfo/get", {params: {id: this.insertRecord.oidXm}})
                    .then(result => {
                        const data = result.data
                        this.xmysjfhj = data.ysjfhj
                        this.xmrltr = data.rltr
                    })
                this.insertRecord.dataSecretLevcode = this.$route.query.dataSecretLevcode;
                this.insertRecord.xmname = this.$route.query.xmname;
                this.insertRecord.xmcode = this.$route.query.xmcode;
                this.query()
            },
            startRw() {
                let xGrid = this.$refs.xGrid
                let selectRecords = xGrid.getCurrentRow()
                if (!selectRecords) {
                    this.$message.warning("请选择一条数据！")
                    return
                }
                this.$confirm('确定启动任务：' + selectRecords.rwname + '?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    selectRecords.rwzt = 'RWZT02'
                    this.$axios.post("/pms/PmsWbs/startRw", {$json: selectRecords})
                        .then(result => {
                            this.$message.success("启动成功")
                            this.query()
                        })
                        .catch(error => {
                            this.$message.error(error.msg)
                        })
                }).catch(_ => {

                })
            },
            rwUp(selectRecords, column) {
                let xGrid = this.$refs.xGrid
                if (!column) {
                    selectRecords = xGrid.getCurrentRow()
                    if (!selectRecords) {
                        this.$message.warning("请选择一条数据！")
                        return
                    }
                }
                let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)
                console.log(rowNode)
                if (rowNode) {
                    //获取到父节点
                    let parentNode = rowNode.parent
                    //从父节点中移除该节点
                    if (parentNode) {
                        rowNode.item.pid = parentNode.pid
                        let {items, index} = rowNode
                        // 从树节点中移除
                        items.splice(index, 1)[0]
                        //重新计算兄弟节点的编码
                        //this.cumpteWbsCode(parentNode, items)
                        //将该节点放到与父节点同一级，即和父节点变成兄弟节点
                        //从tableData中找到父节点
                        let rowNode1 = this.$utils.findTree(this.tableData, item => item.oid === parentNode.oid, this.treeConfig)
                        if (rowNode1) {
                            //找到父节点的父节点
                            let parentNode1 = rowNode1.parent
                            if (parentNode1) {
                                if (!parentNode1.children) {
                                    parentNode1.children = []
                                }
                                parentNode1.children.push(rowNode.item)
                                this.cumpteWbsCode(parentNode1, parentNode1.children)
                            } else {
                                this.tableData.splice(rowNode1.index + 1, 0, rowNode.item)
                                this.cumpteWbsCode(null, this.tableData)
                            }
                            //重新计算树节点序号
                            this.dataPxh = 0
                            this.computePxh(this.tableData)
                            this.updateFlage()
                        }
                    } else {
                        //已经是最顶层
                        this.$message.success(rowNode.item.rwname + "已是最顶级")
                    }
                }
            },

            rwDown(selectRecords, column) {
                let xGrid = this.$refs.xGrid
                if (!column) {
                    selectRecords = xGrid.getCurrentRow()
                    if (!selectRecords) {
                        this.$message.warning("请选择一条数据！")
                        return
                    }
                }
                let rowNode = this.$utils.findTree(this.tableData, item => item.oid === selectRecords.oid, this.treeConfig)
                if (rowNode) {
                    //获取选中节点的上一个兄弟节点
                    if (rowNode.index == 0) {
                        this.$message.success(rowNode.item.rwname + "已是最后一级")
                    } else {
                        let {items, index} = rowNode
                        // 从树节点中移除
                        items.splice(index, 1)[0]
                        let preNode = items[index - 1]
                        if (!preNode.children) {
                            preNode.children = []
                        }
                        rowNode.item.pid = preNode.oid
                        preNode.children.push(rowNode.item)
                        //重新计算wbscode
                        if (rowNode.parent) {
                            this.cumpteWbsCode(rowNode.parent, items)
                        } else {
                            this.cumpteWbsCode(null, items)
                        }
                        xGrid.setTreeExpansion(preNode, true)
                        //重新计算树节点序号
                        this.dataPxh = 0
                        this.computePxh(this.tableData)
                        this.updateFlage()
                    }
                }
            },
            cumpteWbsCode(parentNode, items) {
                let pWbsCode = 0
                for (let i = 0; i < items.length; i++) {
                    if (parentNode) {
                        pWbsCode = parentNode.wbscode
                        items[i].wbscode = pWbsCode + '.' + (i + 1)
                    } else {
                        items[i].wbscode = pWbsCode + (i + 1)
                    }
                    if (items[i].children) {
                        this.cumpteWbsCode(items[i], items[i].children)
                    }
                }
            },
            /**
             * items 需要该表序号的
             */
            computePxh(items) {
                //重新计算树节点的序号
                if (items) {
                    items.forEach(element => {

                        //获取重新计算之前的序号
                        const oldPxh = element.dataPxh
                        const newPxh = this.dataPxh + 1
                        //根据旧序号，得到所有后置任务
                        let rowNodes = this.$utils.filterTree(this.tableData, item => Number(item.qzrw) === oldPxh && !item.flag, this.treeConfig)
                        if (rowNodes && rowNodes.length > 0) {
                            rowNodes.forEach(item => {
                                item.qzrw = newPxh + ''
                                //标记本次前置任务已经更新
                                item.flag = true
                            })
                        }
                        this.dataPxh = newPxh
                        element.dataPxh = this.dataPxh
                        this.computePxh(element.children)
                    });
                }
            },
            //每次序号重新排序后，调用，将flag改为false，方便下次排序
            updateFlage() {
                let rowNodes = this.$utils.filterTree(this.tableData, item => item.flag, this.treeConfig)
                if (rowNodes && rowNodes.length > 0) {
                    rowNodes.forEach(item => {
                        item.flag = false
                    })
                }
            },
            //计划开始日期改变，根据工期计算计划结束日期
            dateJhStartChange(val, row) {
                console.log('change', row, val)
                if (row) {
                    //获取前置任务，计划开始日期必须大于前置任务的结束日期
                    let rowNodes = this.$utils.filterTree(this.tableData, item => row.qzrw == null ? false : row.qzrw.indexOf(item.dataPxh) != -1, this.treeConfig)
                    if (rowNodes && rowNodes.length > 0) {
                        rowNodes.sort(this.arraySort('dateJhEnd'))
                        let diffDayObj = this.$utils.getDateDiff(rowNodes[0].dateJhEnd, row.dateJhStar)
                        if (!diffDayObj.done || diffDayObj.dd == 0) {
                            row.dateJhStar = this.computeDate(rowNodes[0].dateJhEnd, 1)
                        }
                    }
                    //计算结束日期
                    row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq) - 1)
                    //获取该任务的后置任务
                    this.changeHzrw(row)
                }
            },
            // 开始日期获得焦点  -- 获取焦点后判定前置任务，如果前置任务有，那么就找到他的前置任务字段
            dateJhStartFocus(row) {
                console.log(row)
                if (row.qzrw) {
                    let arr = row.qzrw.split(',').map(c => {
                        if (c) {
                            return c.trim()
                        }
                    })
                    console.log(arr);
                }
                console.log('获得焦点')
            },
            //计划结束日期改变，根据计划开始日期计算工期
            dateJhEndChange(row) {
                if (row) {
                    //计算结束日期
                    let diffDayObj = this.$utils.getDateDiff(row.dateJhStar, row.dateJhEnd)
                    if (diffDayObj.done) {
                        let day = 0
                        const diffDay = diffDayObj.time / (24 * 60 * 60 * 1000) //时间转换为天数
                        //找出结束日期与开始日期之间的周末
                        for (let i = 0; i < diffDay; i++) {
                            let nextDate = this.$utils.getWhatDay(row.dateJhStar, i + 1)
                            if (new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6) {
                                day++
                            }
                        }
                        row.rwgq = diffDay - day + 1
                        //获取该任务的后置任务
                        this.changeHzrw(row)
                    }
                }
            },

            // 计算工期
            countGq(dateJhStar, dateJhEnd) {
                //计算结束日期
                let diffDayObj = this.$utils.getDateDiff(dateJhStar, dateJhEnd);
                if (diffDayObj.done) {
                    let day = 0
                    const diffDay = diffDayObj.time / (24 * 60 * 60 * 1000) //时间转换为天数
                    //找出结束日期与开始日期之间的周末
                    for (let i = 0; i < diffDay; i++) {
                        let nextDate = this.$utils.getWhatDay(dateJhStar, i + 1)
                        if (new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6) {
                            day++
                        }
                    }
                    return diffDay - day + 1;
                }
            },
            arraySort(field) {
                return (a, b) => {
                    const datea = a[field]
                    const dateb = b[field]
                    if (this.$utils.getDateDiff(datea, dateb).done) {
                        return 1
                    } else {
                        return -1
                    }
                }
            },
            //修改前置任务，联动
            qzrwBlurEvent({row, rowIndex}, evnt) {

                // 获取表格数据
                if (row.qzrw) {
                    let qzrwArr = row.qzrw.split(',').map((c) => {
                        if (c) {
                            return c.trim();
                        }
                    });
                    // 验证数据输入合法不
                    let islegalNum = true
                    qzrwArr.forEach((c) => {
                        let n = c * 1;
                        console.log(c, rowIndex + 1)
                        if (n === (row.dataPxh) || !Number.isInteger(n)) {
                            islegalNum = false;
                        } else {
                            // if (n > len || n < 1) {
                            //     islegalNum = false;
                            // }
                        }
                    })
                    if (!islegalNum) {
                        this.$message.error('任务无前置任务！');
                        row.qzrw = '';
                        return
                    }
                    let qzrwNodes = []
                    qzrwArr.forEach(qzrw => {
                        let rowNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(qzrw), this.treeConfig)
                        console.log(rowNode)
                        if (rowNode) {
                            qzrwNodes.push(rowNode.item)
                        }
                    })
                    if (qzrwNodes.length > 0) {
                        qzrwNodes.sort(this.arraySort('dateJhEnd'))
                        row.dateJhStar = this.computeDate(qzrwNodes[0].dateJhEnd, 1)
                        row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq) - 1)
                        //获取该任务的后置任务
                        this.changeHzrw(row)
                    }
                }
            },
            rwgqChangeEvent({row}, evnt) {
                if (this.$utils.isInteger(row.rwgq) && Number(row.rwgq) > 0) {
                    row.dateJhEnd = this.computeDate(row.dateJhStar, Number(row.rwgq) - 1)
                    this.changeHzrw(row)
                }
            },
            changeHzrw(row) {
                let rowNodes = this.$utils.filterTree(this.tableData, item => item.qzrw == null ? false : item.qzrw.indexOf(row.dataPxh) != -1, this.treeConfig)
                if (rowNodes && rowNodes.length > 0) {
                    rowNodes.forEach(item => {
                        //找到后置任务的所有前置任务，然后计算前置任务中结束日期最大的
                        let qzrwArr = item.qzrw.split(',');
                        let qzrwNodes = []
                        qzrwArr.forEach(qzrw => {
                            let rowNode = this.$utils.findTree(this.tableData, item => item.dataPxh === Number(qzrw), this.treeConfig)
                            if (rowNode) {
                                qzrwNodes.push(rowNode.item)
                            }
                        })
                        if (qzrwNodes.length > 0) {
                            qzrwNodes.sort(this.arraySort('dateJhEnd'))
                            item.dateJhStar = this.computeDate(qzrwNodes[0].dateJhEnd, 1)
                            item.dateJhEnd = this.computeDate(item.dateJhStar, Number(item.rwgq) - 1)
                            this.changeHzrw(item)
                        }
                    })
                }
            },
            /**
             * startDate 日期计算的起始值·
             * rwgq 需要增加的天数，工期减1
             * return 返回计算后的日期
             */
            //根据日期和工期，返回真实的工作日，排除周末
            computeDate(startDate, rwgq) {
                let day = rwgq;
                let nday = rwgq;
                let index = 0;
                let end = '';
                // 计算结束日期
                while (nday >= 0) {
                    end = this.$utils.getWhatDay(startDate, index);
                    // 判定是否是周末
                    if (new Date(end).getDay() != 0 && new Date(end).getDay() != 6) {
                        nday--;
                    }
                    index++;

                }
                console.log(moment(end).format('YYYY-MM-DD'), 'end')
                // //包含周末的结束日期
                // let endDate = this.$utils.getWhatDay(startDate, rwgq);
                // //开始日期和结束日期之间存在多少需要屏蔽的天数
                // let diffDayObj = this.$utils.getDateDiff(startDate, endDate)
                // if (diffDayObj.done) {
                //     const diffDay = diffDayObj.dd
                //     for (let i = 0; i < diffDay; i++) {
                //         let nextDate = this.$utils.getWhatDay(startDate, i + 1)
                //         if (new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6) {
                //             day++
                //         }
                //     }
                // }
                //工期内的屏蔽日期已经过滤，特例情况，c此时结束日期正好是需要屏蔽的日期，需要找到紧邻的第一天工作日
                // endDate = this.$utils.getWhatDay(startDate, day)
                // if (new Date(endDate).getDay() == 0 || new Date(endDate).getDay() == 6) {
                //     console.log(this.hasShieldDate(endDate, 1))
                //     endDate = this.hasShieldDate(endDate, 1)
                // }
                return end
            },
            hasShieldDate(date, day) {
                let nextDate = this.$utils.getWhatDay(date, day)
                if (new Date(nextDate).getDay() == 0 || new Date(nextDate).getDay() == 6) {
                    nextDate = this.hasShieldDate(nextDate, day)
                }
                return nextDate
            },
            defaultDate() {
                return new Date(new Date().getFullYear() + "/" + (new Date().getMonth() + 1) + "/" + new Date().getDate() + " 00:00:00")
            },
            getRowsData(data) {
                data.forEach(row => {
                    row.rwzt = m.get(row.rwzt)
                    row.dataSecretLevcode = levelMap.get(row.dataSecretLevcode)
                    row.rwlx = rwlxMap.get(row.rwlx)
                    row.jjcd = jjcdMap.get(row.jjcd)
                    row.dateJhStar = this.$utils.toDateString(row.dateJhStar, 'yyyy-MM-dd')
                    row.dateJhEnd = this.$utils.toDateString(row.dateJhEnd, 'yyyy-MM-dd')
                    if (row.children && row.children.length > 0) {
                        this.getRowsData(row.children);
                    }
                });
            },
            // exportCsvEvent() {
            //     let tableList = this.list
            //     let data = JSON.parse(JSON.stringify(tableList))
            //     console.log(data)
            //     // return
            //     // debugger
            //     this.getRowsData(data)
            //     //this.$utils.
            //     let xGrid = this.$refs.xGrid
            //     let columns = xGrid.getColumns()
            //     //额外列
            //     let otherColumns = [
            //         {
            //             id: 'dataSecretLevcode',
            //             property: 'dataSecretLevcode',
            //             title: '密级',
            //             getTitle() {
            //                 return '密级'
            //             }
            //         },
            //         {
            //             id: 'rwzt',
            //             property: 'rwzt',
            //             title: '任务状态',
            //             getTitle() {
            //                 return '任务状态'
            //             }
            //         },
            //         {
            //             id: 'xmjfqd',
            //             property: 'xmjfqd',
            //             title: '项目经费渠道',
            //             getTitle() {
            //                 return '项目经费渠道'
            //             }
            //         },
            //         {
            //             id: 'cwtmdm',
            //             property: 'cwtmdm',
            //             title: '财务脱密代码',
            //             getTitle() {
            //                 return '财务脱密代码'
            //             }
            //         },
            //         {
            //             id: 'yscode',
            //             property: 'yscode',
            //             title: '预算号',
            //             getTitle() {
            //                 return '预算号'
            //             }
            //         },
            //         {
            //             id: 'rwmb',
            //             property: 'rwmb',
            //             title: '任务目标',
            //             getTitle() {
            //                 return '任务目标'
            //             }
            //         }
            //     ]
            //     let a = this.$refs.xGrid.exportData({
            //         type: 'csv',
            //         filename: '项目年度任务计划',
            //         data,
            //         columns: [...columns, ...otherColumns],
            //         download: false
            //     })
            //     a.then(res => {
            //         console.log(res, 'res')
            //         this.downloadFile(res.content);
            //     })
            // },
            downloadFile(content) {
                var filename = '项目年度任务计划',
                    type = 'xlsx';
                var name = "".concat(filename, ".").concat(type);

                if (window.Blob) {
                    var blob = new Blob([content], {
                        type: "text/".concat(type)
                    });

                    if (navigator.msSaveBlob) {
                        navigator.msSaveBlob(blob, name);
                    } else {
                        var linkElem = document.createElement('a');
                        linkElem.target = '_blank';
                        linkElem.download = name;
                        linkElem.href = URL.createObjectURL(blob);
                        document.body.appendChild(linkElem);
                        linkElem.click();
                        document.body.removeChild(linkElem);
                    }
                }
            },
            //右键菜单
            visibleMethod({row}) {
                console.log(row)
                this.bodyMenus.forEach(list => {
                    list.forEach(item => {
                        if (item.code === 'remove') {
                            item.disabled = row.rwzt !== RWZT.WXF && row.rwzt !== RWZT.XJ
                        }

                    })
                })

                return true
            },
            contextMenuClickEvent({menu, row, column}) {
                console.log(column)
                let xGrid = this.$refs.xGrid
                switch (menu.code) {
                    case 'childNode':
                        this.addChild(row, column)
                        break
                    case 'remove':
                        this.deleteItem(row, column)
                        break
                    case 'shengji':
                        this.rwUp(row, column)
                        break
                    case 'jiangji':
                        this.rwDown(row, column)
                        break
                    case 'insertAt':
                        this.insertAtEvent(row, column)
                        break
                    case 'upone':
                        this.moveUpOrDown(row, 1)
                        break
                    case 'downone':
                        this.moveUpOrDown(row, 2)
                        break
                }
            },
            insertAtEvent(row, column) {
                let xGrid = this.$refs.xGrid
                if (!column) {
                    row = xGrid.getCurrentRow()
                    if (!row) {
                        this.$message.warning('请选择一行！')
                        return
                    }
                }
                console.log(row)
                this.insertRecord.pid = row.pid
                this.insertRecord.oid = this.getRandomId()
                xGrid.createRow(this.insertRecord).then(newRow => {
                    // 插入到指定节点位置中
                    let rowNode = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
                    if (rowNode) {
                        let {items, parent} = rowNode
                        items.splice(rowNode.index, 0, newRow)
                        xGrid.refreshData().then(() => xGrid.setActiveCell(newRow))
                        if (parent) {
                            this.cumpteWbsCode(parent, items)
                        } else {
                            this.cumpteWbsCode(null, items)
                        }
                        //重新计算树节点序号
                        this.dataPxh = 0
                        this.computePxh(this.tableData)
                        this.updateFlage()
                    }
                })
            },
            // type 1 上移 2 下移
            moveUpOrDown(row, type) {
                let xGrid = this.$refs.xGrid
                let rowNode = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
                if (rowNode) {
                    console.log(rowNode)
                    let {index, item, items, parent} = rowNode
                    if (type == 1) {
                        if (index == 0) {
                            this.$message.warning('无法上移！')
                            return
                        }
                        items[index] = items.splice(index - 1, 1, items[index])[0]
                    } else if (type == 2) {
                        if (index + 1 == items.length) {
                            this.$message.warning('无法下移！')
                            return
                        }
                        items[index] = items.splice(index + 1, 1, items[index])[0]
                    }
                    if (parent) {
                        this.cumpteWbsCode(parent, items)
                    } else {
                        this.cumpteWbsCode(null, items)
                    }
                    //重新计算树节点序号
                    this.dataPxh = 0
                    this.computePxh(this.tableData)
                    this.updateFlage()
                }

            },
            //任务模板
            setModel() {
                this.$refs.wbsTypeLate.getParentParams("设置任务模板", this.tableData)
            },
            useModel() {
                //this.$router.push({ path: "/pms/xmgl/wbsTypelateQuery"});
                this.isUseModel = true
                this.visible = true
            },
            selectModel() {
                console.log(this.tableData)
                let remove = this.$utils.filterTree(this.tableData, item => !item.isNew, this.treeConfig)
                this.removeList = remove;
                this.$confirm('模板数据覆盖以前的数据', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.wbsTypelateQuery.getParentParams()
                    this.visible = false
                }).catch(() => {
                    console.log('取消成功')
                })

            },
            // 使用模板
            getModelData(data) {
                this.tableData = this.modelZl(data);
            },
            // 模板数据整理
            modelZl(data) {
                let abb = JSON.parse(JSON.stringify(data));
                let self = this;
                let index = 0;

                function zli(modeldata, pid) {
                    modeldata.map(c => {
                        c.oid = self.getRandomId() + index++;
                        c.pid = pid ? pid : '0'
                        c.isNew = true;
                        if (c.children && c.children.length > 0) {
                            zli(c.children, c.oid);
                        }
                    })
                }

                zli(abb);
                console.log(abb);
                return abb;
            },
            //单击vxe行
            vxeCellClick({row, column}) {
                // if (column.property=='wbscode'||column.property=='spzt') {
                //     this.$refs.xGrid.toggleCheckboxRow(row);
                // }
                this.selection = this.$refs.xGrid.getSelectRecords();
                this.opera = '编辑'
                this.delBtnState = true
                if (row.rwzt == RWZT.WXF || row.rwzt == RWZT.XJ) {
                    this.delBtnState = false
                } else if (row.rwzt == RWZT.WC) {
                    this.opera = '详情'
                }
            },
            cellClassName({row, rowIndex, column, columnIndex}) {
                if (column.property === "rwzt") {
                    return row.rwzt
                }
            }
        },
        computed: {
            // 是否能够升级降级
            isUpDown() {
                return this.selectRecords && (this.selectRecords.spzt == SPZT.WSP || this.selectRecords.spzt == null || this.selectRecords.spzt == undefined)
            },
            // 审批按钮控制
            spText() {
                let sp = this.selection.filter(c => {
                    return c.spzt == SPZT.YSP
                })
                if (sp.length == 0) {
                    return '提交审批'
                }
                // if (sp.length == this.selection.length&&!this.isChangeEdit) {
                //     return '变更'
                // }
                if (sp.length == this.selection.length) {
                    return '提交变更'
                }
                return '类型不同、禁止提交'
            },
            list() {
                let filterName = this.queryParam + ''.trim().toLowerCase()
                if (filterName) {
                    let searchProps = ['rwname', 'rwdept', 'rwfzr']
                    let rest = this.$utils.searchTree(this.tableData, item => searchProps.some(key => this.$utils.toString(item[key]).toLowerCase().indexOf(filterName) > -1), this.treeConfig)
                    return rest
                }
                return this.tableData
            },
            rwrltr() {
                let allData = this.tableData
                let rwrltr = 0
                allData.forEach(item => {
                    rwrltr += item.rwysRl
                })
                return rwrltr
            },
            rwysjfhj() {
                let allData = this.tableData
                let rwjfys = 0
                allData.forEach(item => {
                    rwjfys += item.rwysJfSum
                })
                return rwjfys
            },
            datamap() {
                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
                // console.log(this.getDataMap()(this.mapTypeCode), 'this.getDataMap()(this.mapTypeCode)')
                return this.getDataMap()(this.mapTypeCode) ? this.getDataMap()(this.mapTypeCode) : {};
            },

            // 判定能否使用模板
            isUserTemp() {
                let a = false;
                if (this.tableData && this.tableData.length > 0) {
                    this.tableData.forEach(c => {
                        if (c.sbzt == 'SBZT20') {
                            a = true;
                        }
                    })
                }
                return a
            }

        },
        //这个是你引用插件生成的,不用管它
        components: {
            IceDialog,
            IceSelect,
            IceQueryGrid,
            IceTree,
            IceDeptSelector,
            IcePersionByDeptSelector,
            IcePersionSelector,
            IcePopSelector,
            WbsEdit,
            wbsTypeLate,
            wbsTypelateQuery,
            IceQueryGridExport
        }
    }
</script>
<style lang="less" scoped>
    .wbstable-style /deep/ .vxe-body--column.RWZT10 {
        background-color: #777;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT20 {
        background-color: #777;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT30 {
        background-color: #35f314;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT31 {
        background-color: #ff9e12;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT32 {
        background-color: #e0361b;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT40 {
        background-color: #1216f3;
        color: #ffffff;
    }

    .wbstable-style /deep/ .vxe-body--column.RWZT41 {
        background-color: #1216f3;
        color: #ffffff;
    }

    .vxe-toolbar {
        height: auto !important;
    }

    .el-button {
        margin-bottom: 5px;
        margin-right: 0;
        margin-left: 10px;
    }

    .ice-grid-button-bar {
        justify-content: space-between;
    }
</style>
