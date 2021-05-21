<template>

    <div class="ice-container">

        <el-container>
            <!--调用左侧组件格式-->
            <el-aside width="250px" class="asidelayout">
                <el-tabs v-model="activetree" type="border-card" @tab-click="tabClick">
                    <el-tab-pane label="按来源" name="first">
                        <ice-tree :load-url="xmlyUrl"
                                  label-prop="name"
                                  value-prop="code"
                                  node-key="code"
                                  class="tree"
                                  :defaultExpandKey="enpandXmlyIndex"
                                  @node-click="xmlyClick"
                                  :lazy="false"
                                  ref="iceGridxmly"
                        >
                            <div slot="prefix">
                                <!--<el-date-picker v-model="xmyear" type="year" value-format="yyyy"-->
                                <!--@change="xmDateChange"></el-date-picker>-->
                                <date-cus-select v-model="yearOrangeXmly"></date-cus-select>
                            </div>
                        </ice-tree>

                    </el-tab-pane>
                    <el-tab-pane label="按部门" name="second">
                        <ice-tree load-url="/pms/Xminfo/treeByDeptCode?deptCode=9003"
                                  label-prop="deptName"
                                  value-prop="deptCode"
                                  node-key="deptCode"
                                  class="tree"
                                  :defaultExpandKey="enpandDeptIndex"
                                  @node-click="orgNodeClick"
                                  :lazy="false"
                                  ref="iceGriddept"
                        >
                            <div slot="prefix">
                                <date-cus-select v-model="yearOrangeDept"></date-cus-select>
                            </div>
                        </ice-tree>

                    </el-tab-pane>
                </el-tabs>
            </el-aside>
            <!--引用组件,定义变量-->
            <el-main class="right_main">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="科研项目" name="first">
                        <ice-query-grid
                                :data-url="dataUrl"
                                :columns="columns"
                                :exportUrl="exportUrl"
                                chooseItem="single"
                                :buttons="buttons"
                                ref="grid"
                                :operations="operations"
                                :query="querys"
                                :gridAutoRefresh="false"
                                :operationsWidth=200
                                @selection-change="handleSectItem"
                                exportTitle="科研项目信息"
                        >
                            <div slot="operation-bar-expand" style="margin-left: 15px;">
                                <el-dropdown @command="handlecommand">
                                    <el-button type="primary"
                                               :disabled="changeDisabled">
                                        项目变更<i class="el-icon-arrow-down el-icon--right"></i>
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="1">项目变更</el-dropdown-item>
                                        <el-dropdown-item command="2">项目暂停</el-dropdown-item>
                                        <el-dropdown-item command="3">项目终止</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                        </ice-query-grid>

                    </el-tab-pane>
                    <el-tab-pane label="型号项目" name="second">
                        <SCXMK :activetree="activetree" :conditions="conditions"></SCXMK>
                    </el-tab-pane>
                </el-tabs>

            </el-main>
        </el-container>
        <ice-dialog title="验收材料" :visible.sync="endVisible" width="800px">
            <ATTACHMENT :data="endlist" ref="enddata" :fun="handleToXmClose" :control-mj="closeXmMj"></ATTACHMENT>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleCloseXmFjUpload">确认</el-button>
                <el-button type="info" @click="endVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <!--// 导入项目-->
        <!--导入-->
        <ice-dialog title="项目导入" :visible.sync="visibleImport" width="500px">
            <ice-excel-uploader @uploadSuccess="uploadSuccess"
                                service="XminfoProjectExcelService" module="pms"></ice-excel-uploader>
        </ice-dialog>
        <!--详情-->
        <ice-dialog title="项目详情" :visible.sync="detailVisible" width="1300px">
            <xm-detail-dialog :row="row" @handleClose="detailVisible=false"></xm-detail-dialog>
        </ice-dialog>
        <!--成员维护-->
        <ice-dialog title="成员维护" :visible.sync="visiblemaintain" width="1300px">
            <pms-sect-member ref="pmssectMember" :queryListXmcy="queryListXmcy"
                             :forbidDelRole="forbidDelRole"></pms-sect-member>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleConfirmMember">确认</el-button>
                <el-button type="info" @click="visiblemaintain=false">关闭</el-button>
            </div>
        </ice-dialog>

        <!--审批-->
        <ice-dialog title="审批" :visible.sync="visiblesp" width="1300px">
            <el-container>
                <el-aside width="80%">
                    <ice-query-grid
                            data-url="pms/Xminfo/listMemberCode"
                            :columns="columnsSp"
                            chooseItem="multiple"
                            ref="gridSp"
                            codeProp="oid"
                            :selectedCodes="selectedCodes"
                            :query="querysSp"
                            @selection-change="mulCallback"
                            :before-bind-data="dataFilter"
                            exportTitle="科研项目信息"
                    >
                    </ice-query-grid>
                </el-aside>
                <el-main>
                    <div class="xm-item" v-for="(item, index) in spdata" :key="item.oid">
                        <el-tag @close="spClose(item, index)" closable>{{item.xmname}}</el-tag>
                    </div>
                </el-main>
            </el-container>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleToSp">确认</el-button>
                <el-button type="info" @click="visiblesp=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTree from "../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XmBaseInfo from "./XmBaseInfo";
    import XmBaseXmcy from "./XmBaseXmcy";
    import XmBaseXmsr from "./XmBaseXmsr";
    import XmBaseXmsc from "./XmBaseXmsc";
    import ATTACHMENT from "../common/ATTACHMENT";
    import member from "./components/member";
    import {MUST_ROLE, ROLE_ONE, defineXmStatusColor, XM_ZT, forbidDelRole, SPZT} from "../../../utils/constant";
    import PmsSelectTree from '../../../components/common/pms/PmsSelectTree'
    import Htdj from '../htgl/htdj_edit'
    import WBS from './components/WBS'
    import pmsSectFx from './components/pmsSectFx'
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";

    import XmDetailDialog from './components/XmDetailDialog.vue'
    import pmsSectMember from './components/pmsSectMember'

    import localstoreUtil from '@/utils/localstoreUtil';
    import {mapGetters, mapMutations} from 'vuex'
    import dateCusSelect from './components/dateCusSelect'
    import SCXMK from '../scrw/SCXMK'

    import moment from 'moment';

    let date = new Date();

    //export default 只能导出一个默认模块，这个模块可以匿名


    let now = new Date();
    let year = now.getFullYear();
    const start = (year - 2) + '-1-1';
    const end = year + '-12-31';
    let datesj = [start, end]
    export default {
        name: "Xminfo",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                closeXmMj: [],
                yearOrangeXmly: datesj,
                yearOrangeDept: datesj,
                xmlyCode: '',
                deptCode: '',
                // 审批
                visiblesp: false,
                // spdata
                spdata: [],
                activetree: 'first',
                oidXmly: '',
                // 按部门url
                orgsdataurl: '',
                enpandXmlyIndex: [],
                enpandDeptIndex: [],
                currUser: localstoreUtil.getLastLoginUserName(),
                // 禁止删除角色
                forbidDelRole: forbidDelRole,
                // 成员维护弹窗
                visiblemaintain: false,
                queryListXmcy: [],
                oidXmForCy: '', // 成员维护时选择的项目ID
                xmSecret: '', // 成员维护时选择的项目密级
                row: {},
                detailVisible: false,
                visibleImport: false,
                // 项目收尾
                endVisible: false,
                endlist: [],
                // 树组件参数配置
                a: {
                    scrollY: {
                        rHeight: 10
                    }
                },
                dialogVisible: true,
                membershow: true,
                attaTableData: [],
                //调用页面网格数据
                columns: [
                    {
                        self: this,
                        label: "项目状态",
                        code: "xmzt",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'XMZT',
                        renderCell: (h, data) => {
                            let obj = {
                                color: '#fff',
                                background: defineXmStatusColor[data.row.xmzt],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{this.datamap ? this.datamap[data.row.xmzt] : ''}</span>
                        }
                    },
                    {code: "oid", hidden: true},
                    {code: "xmcyCodes", hidden: true},
                    {code: "xmcyZg", hidden: true},
                    {code: "xmcyDyzrr", hidden: true},
                    {label: "项目名称", code: "xmname", width: 100, sortable: true},
                    {label: "所内项目编号", code: "xmcode", width: 130, sortable: true},
                    {label: "所外项目编号", code: "xmcodeSw", width: 130, sortable: true,},


                    {label: "项目类别", code: "xmlb", width: 100, sortable: true, mapTypeCode: 'XMLB'},
                    {
                        label: "项目来源名称", code: "xmlyName", width: 100, sortable: true, hidden: true
                    },
                    {
                        label: "项目来源", code: "xmly", width: 100, sortable: true, cusMapTypeCode: "XMLY"
                    },
                    {label: "学科方向", code: "xmxkfx", width: 100, sortable: true, mapTypeCode: 'XMXKFX',},
                    {label: "业务主管部门名称", code: "xmzgbm", width: 130, sortable: true, hidden: true},
                    {label: "业务主管部门", code: "xmzgbmCode", width: 130, sortable: true, cusMapTypeCode: "DEPT"},
                    // {label: "项目主管", code: "xmzg", width: 100, sortable: true},
                    {label: "责任单位", code: "orgid", width: 100, hidden: true, sortable: true},
                    {label: "责任单位", code: "orgcode", width: 100, cusMapTypeCode: "DEPT", sortable: true},
                    {label: "责任单位", code: "orgname", width: 100, sortable: true, hidden: true},

                    {label: "预算经费合计（万元）", code: "ysjfhj", width: 200, sortable: true},
                    // {label: "全时人力投入", code: "rltr", hidden: true},
                    {
                        label: "立项日期", code: "gmtLx", width: 100, sortable: true, formatter(row) {
                            return moment(row.gmtLx).format('YYYY-MM-DD');
                        }
                    },
                    {
                        label: "完结日期", code: "finishDate", width: 100, sortable: true, formatter(row) {
                            return row.finishDate ? moment(row.finishDate).format('YYYY-MM-DD') : '';
                        }
                    },
                    // {label: "进度", code: "gmtLx", width: 100, sortable: true},
                    // {label: "预算号", code: "yscode", width: 100, sortable: true},
                    {label: "上级项目编号", code: "pid", hidden: true},
                    {label: "项目目标", code: "xmmb", hidden: true},
                    {
                        label: '项目密级',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: "上报状态", code: "sbzt", width: 100, sortable: true, mapTypeCode: 'SBZT'},
                    {label: "审批结果", code: "spzt", width: 100, sortable: true, mapTypeCode: 'SPZT'},
                    {label: "备注", code: "dateRemark", width: 100, sortable: true, hidden: true},
                    {label: "项目主管", code: "xmzg", width: 100, sortable: true, hidden: true},
                    {label: "项目第一责任人", code: "zrr", width: 100, sortable: true, hidden: true},

                ],
                //定义高级模糊查询方法
                querys: [
                    {type: 'static', code: 'pid', label: '父ID', value: ''},
                    {type: 'static', code: 'xmlx', label: '项目类型', value: 'XMLX01'},
                    {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                    {type: 'input', code: 'xmcode', label: '所内项目编号', value: ''},
                    {type: 'input', code: 'xmcodeyn', label: '所外项目编号', value: ''},
                    {type: 'select', code: 'xmzt',multiple: true, label: '项目状态', value: 'XMZT10,XMZT20,XMZT30,XMZT31,XMZT32,XMZT33', mapTypeCode: 'XMZT'},
                    {type: 'select', code: 'xmlb',multiple: true, label: '项目类别', value: '', mapTypeCode: 'XMLB'},
                    {type: 'select', code: 'xmxkfx',multiple: true, label: '学科方向', value: '', mapTypeCode: 'XMXKFX'},
                    // {type: 'input', code: 'ysjfhj', label: '经费合计', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},

                    {type: 'date', code: 'gmtLx', label: '立项日期'},
                    {type: 'date', code: 'finishDate', label: '完结日期'},
                ],
                columnsSp: [
                    {
                        self: this,
                        label: "项目状态",
                        code: "xmzt",
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'XMZT',
                        renderCell: (h, data) => {
                            let obj = {
                                color: '#fff',
                                background: defineXmStatusColor[data.row.xmzt],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{this.datamap ? this.datamap[data.row.xmzt] : ''}</span>
                        }
                    },
                    {code: "oid", hidden: true},
                    {code: "xmcyCodes", hidden: true},
                    {code: "xmcyZg", hidden: true},
                    {code: "xmcyDyzrr", hidden: true},
                    {label: "项目名称", code: "xmname", width: 100, sortable: true},
                    {label: "所内项目编号", code: "xmcode", width: 130, sortable: true},
                    {label: "所外项目编号", code: "xmcodeSw", width: 130, sortable: true,},

                    // {label: "项目类别", code: "xmlb", width: 100, sortable: true, mapTypeCode: 'XMLB'},
                    {
                        label: "项目来源", code: "xmlyName", width: 100, sortable: true
                    },
                    {
                        label: "项目来源Code", code: "xmly", width: 100, sortable: true, hidden: true
                    },
                    {label: "学科方向", code: "xmxkfx", width: 100, sortable: true, mapTypeCode: 'XMXKFX',},
                    {label: "业务主管部门名称", code: "xmzgbm", width: 130, sortable: true, hidden: true},
                    {label: "业务主管部门", code: "xmzgbmCode", width: 130, sortable: true, cusMapTypeCode: 'DEPT'},
                    // {label: "项目主管", code: "xmzg", width: 100, sortable: true},
                    {label: "责任单位", code: "orgid", width: 100, hidden: true},
                    {label: "责任单位", code: "orgcode", width: 100, cusMapTypeCode: 'DEPT'},
                    {label: "责任单位", code: "orgname", width: 100, sortable: true, hidden: true},

                    {label: "预算经费合计（万元）", code: "ysjfhj", width: 200, sortable: true},
                    // {label: "全时人力投入", code: "rltr", hidden: true},
                    {
                        label: "立项日期", code: "gmtLx", width: 100, sortable: true, formatter(row) {
                            return moment(row.gmtLx).format('YYYY-MM-DD');
                        }
                    },
                    // {label: "进度", code: "gmtLx", width: 100, sortable: true},
                    // {label: "预算号", code: "yscode", width: 100, sortable: true},
                    {label: "上级项目编号", code: "pid", hidden: true},
                    {label: "项目目标", code: "xmmb", hidden: true},
                    {label: "创建人", code: "createUser", hidden: true},
                    {
                        label: '项目密级',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },

                ],
                //按钮组件
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        ctrlCode: "BSXXMLB",
                        type: 'success',
                        size: 'mini',
                        callback: this.refreshGrid
                    },
                    {
                        name: '新增',
                        icon: 'el-icon-plus',
                        ctrlCode: "BSXXMLB",
                        type: 'primary',
                        size: 'mini',
                        callback: this.handleToAddProject
                    },
                    {
                        name: '项目分解',
                        ctrlCode: "BNDRWJH",
                        icon: 'el-icon-key',
                        type: 'success',
                        disabled: true,
                        size: 'mini',
                        callback: this.handleWbs
                    },
                    // {
                    //     name: '项目变更',
                    //     ctrlCode: "BXMBG",
                    //     type: 'success',
                    //     icon: 'el-icon-chicken',
                    //     disabled: true,
                    //     size: 'mini',
                    //     callback: this.handleToChangeProject
                    // },
                    // {
                    //     name: '项目暂停',
                    //     ctrlCode: "BXMZT",
                    //     type: 'success',
                    //     icon: 'el-icon-chicken',
                    //     disabled: true,
                    //     size: 'mini',
                    //     callback: this.handleToSuspendProject
                    // },
                    // {
                    //     name: '项目终止',
                    //     ctrlCode: "BXMZZ",
                    //     type: 'success',
                    //     icon: 'el-icon-chicken',
                    //     disabled: true,
                    //     size: 'mini',
                    //     callback: this.handleToEndProject
                    // },
                    {
                        name: '项目收尾',
                        ctrlCode: "BXMSW",
                        type: 'success',
                        icon: 'el-icon-timer',
                        disabled: true,
                        size: 'mini',
                        callback: this.handleShowEnd
                    },
                    {
                        name: '导入',
                        icon: 'el-icon-upload2',
                        ctrlCode: "BDR",
                        size: 'mini',
                        callback: this.handleImport,
                        disabled: () => {
                            return this.crewCodes.indexOf(this.$userInfo.userCode) == -1 ? true : false
                        }
                    },
                    {name: '导出', ctrlCode: "BDC", icon: 'el-icon-download', size: 'mini', type: 'export'},  //导出Excel表需要定义一个组件就行，这里声明就可以使用

                    {
                        name: '批量审批',
                        icon: 'el-icon-plus',
                        ctrlCode: "BSXXMLB",
                        type: 'success',
                        size: 'mini',
                        callback: this.handleExamine
                    },


                ],
                //定义弹出框为false，隐藏状态
                visible: false,

                //定义模态框里面的新增内容字段
                formModel: {
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    pid: '',
                    dataSecretLevcode: '',
                    xmzt: 'XMZT01',
                    xmlb: 'XMLB21',
                    xmxkfx: 'XMXKFX01',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzg: '',
                    orgid: '',
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
                    $json: {},
                    num: 50
                },
                //定义模态框里面必填项,是以数组形式保存，里面存放的是JSON
                rules: {
                    xmname: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
                    // xmcode: [{required: true, message: '所内项目编号', trigger: 'blur'}],
                    // xmcodeyn: [{required: true, message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true, message: '项目密集', trigger: 'blur'}],
                    xmzt: [{required: true, message: '项目状态', trigger: 'blur'}],
                    xmlb: [{required: true, message: '项目类别', trigger: 'blur'}],

                    xmxkfx: [{required: true, message: '学科方向', trigger: 'blur'}],
                    sbzt: [{required: true, message: '上报状态', trigger: 'blur'}],
                    gmtLx: [{required: true, message: '立项日期', trigger: 'blur'}],

                    orgid: [{required: true, message: '责任单位', trigger: 'blur'}],

                    xmzgbm: [{required: true, message: '业务主管部门', trigger: 'blur'}],


                    // rltr: [{required: true, message: '全时人力投入', trigger: 'blur'}],
                    // ysjfhj: [{required: true, message: '预算经费合计', trigger: 'blur'}],

                    xmmb: [{required: true, message: '项目目标', trigger: 'blur'}],
                    xmly: [{required: true, message: '项目来源', trigger: 'blur'}],
                },
                //定义模态框 转圈加载过程
                loading: false,

                //定义行的编辑,项目结转
                operations: [
                    {
                        name: '编辑', callback: this.dbClick, ctrlCode: "BBJ", isShow: function (row) {
                            return row.spzt === SPZT.WSP && row.xmzt === XM_ZT.LXZ;
                        }
                    },
                    {
                        name: '删除', callback: this.deleteNode, ctrlCode: "BSC", isShow: function (row) {
                            return row.spzt === SPZT.WSP && row.xmzt === XM_ZT.LXZ;
                        }
                    },
                    {
                        name: '查看', callback: this.handleLook, ctrlCode: "BCK"
                    },
                    // {
                    //     name: '流程记录', callback: this.getFlowList, ctrlCode: "BLCJL", isShow: function (row) {
                    //         return row.xmzt !== XM_ZT.LXZ
                    //     }
                    // },
                    {
                        name: '成员维护', callback: this.handleMember, ctrlCode: "BCYWH", isShow: (row) => {
                            let arr = row.xmzg ? row.xmzg.split(",") : [];
                            return arr.indexOf(this.currUser) != -1 || row.zrr == this.currUser
                        }
                    },
                ],


                querysSp:
                    [
                        {type: 'static', code: 'xmlx', label: '项目类型', value: 'XMLX01'},
                        {type: 'static', code: 'xmzt', label: '项目状态', value: 'XMZT10'},
                        {type: 'static', code: 'spzt', label: '审批状态', value: 'SPZT10'},
                        {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                        {type: 'input', code: 'xmcode', label: '所内项目编号', value: ''},
                        {type: 'input', code: 'xmcodeyn', label: '所外项目编号', value: ''},
                        {type: 'date', code: 'gmtLx', label: '立项日期'},
                    ],
                condition: {type: 'static', code: 'pid', label: '父ID', value: ''},
                /**
                 * 左边树tree
                 * 点击获取节点内容ID
                 */
                selectedDeptId: '',

                /**
                 * 左边树Tree 加载
                 * loding转圈加载
                 */
                loadingTree: false,

                /**
                 * 左边树Tree
                 * 弹出模态框默认为true
                 */
                treevisible: false,

                /**
                 * 左边树Tree
                 * 定义左侧树节点 默认为空
                 */
                nodeType: '',
                /**
                 * 左边树
                 * 定义获取行内容
                 */
                curTreeNode: {},
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
                 * ------------------------------------项目结转---------------------------------
                 */
                //项目结转模态框默认为关闭false状态
                visibleXmjz: false,

                //定义项目结转模态框字段，数据双向绑定
                formModelXmjz: {
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    pid: '',
                    dataSecretLevcode: '',
                    xmzt: '',
                    xmlb: '',
                    xmxkfx: '',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzg: '',
                    orgid: '',
                    personid: '',
                    personidJs: '',
                    personidXz: '',
                    sbzt: '',
                    xmmb: '',
                    ysjfhj: '',
                    rltr: '',
                    gmtLx: '',
                    xmysh: '',
                    dateRemark: '',
                },

                //定义项目结转里面的必填项验证rulesXmjz
                rulesXmjz: {
                    xmname: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
                    xmcode: [{required: true, message: '所内项目编号', trigger: 'blur'}],
                    xmcodeyn: [{required: true, message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true, message: '项目密集', trigger: 'change'}],
                    xmzt: [{required: true, message: '项目状态', trigger: 'change'}],
                    xmlb: [{required: true, message: '项目类别', trigger: 'change'}],

                    xmxkfx: [{required: true, message: '学科方向', trigger: 'change'}],
                    sbzt: [{required: true, message: '上报状态', trigger: 'change'}],
                    gmtLx: [{required: true, message: '立项日期', trigger: 'blur'}],

                    orgid: [{required: true, message: '责任单位', trigger: 'change'}],

                    xmzgbm: [{required: true, message: '业务主管部门', trigger: 'change'}],

                    xmzgbm: [{required: true, message: '业务主管部门', trigger: 'change'}],

                    rltr: [{required: true, message: '全时人力投入', trigger: 'blur'}],
                    ysjfhj: [{required: true, message: '预算经费合计', trigger: 'blur'}],
                    yscode: [{required: true, message: '预算号', trigger: 'blur'}],

                    xmmb: [{required: true, message: '项目目标', trigger: 'blur'}],
                },
                //定义项目结转loadingXmjz
                loadingXmjz: false,

                /**
                 * ----------------------------------项目成员------------------------------
                 */
                queryListXmcy: [],
                rowData: {},
                mapTypeCode: 'XMZT',
                crewCodes: [],

            }
        },
        computed: {
            // changeDisabled
            changeDisabled() {
                let arr = this.rowData.xmzg ? this.rowData.xmzg.split(",") : [];
                if (arr.indexOf(this.currUser)!=-1  || this.rowData.zrr == this.currUser) {
                    return this.rowData.xmzt == 'XMZT30' || this.rowData.xmzt == 'XMZT31' ? false : true;
                } else {
                    return true;
                }
            },
            xmlyUrl() {
                return '/pms/DataDictionaryType/getTree?code=XMLY&isTree=1';
                // return '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidXmly;
            },
            // 项目成员
            memberList() {
                return this.queryListXmcy.filter((c) => {
                    return c.deleteStatus !== 1;
                })
            },
            datamap() {
                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];

                return this.getDataMap()(this.mapTypeCode);
            },
            selectedCodes() {
                return this.spdata.map(c => {
                    return c.oid
                })
            },
            dataUrl() {
                let dates = this.activetree == 'first' ? this.yearOrangeXmly : this.yearOrangeDept
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                    deptCode: this.activetree != 'first' ? this.deptCode : '',
                    xmly: this.activetree == 'first' ? this.xmlyCode : '',
                    sortOrder: 'desc',
                    sortColumn: 'xmzt'
                }
                let url = this.urlJoint('pms/Xminfo/listByCondition', obj);
                return url;
            },
            exportUrl() {
                let dates = this.activetree == 'first' ? this.yearOrangeXmly : this.yearOrangeDept
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                    deptCode: this.activetree != 'first' ? this.deptCode : '',
                    xmly: this.activetree == 'first' ? this.xmlyCode : ''
                }
                let url = this.urlJoint('pms/Xminfo/listByConditionExport', obj);
                return url;
            },
            xmOid() {
                return this.$route.query.oid
            },
            // 查询条件
            conditions() {
                let dates = this.activetree == 'first' ? this.yearOrangeXmly : this.yearOrangeDept;
                return {
                    xmlyCode: this.xmlyCode,
                    deptCode: this.deptCode,
                    dates
                }
            }
        },
        created() {
            this.getConstant();
            // this.initOidXmly();
            this.membershow = true;
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
            this.$nextTick(_ => {
                if (this.xmOid && this.$route.query.prev == 'home') {
                    console.log(123)
                    this.handleLook({oid: this.xmOid});
                }
            })

        },
        mounted () {

        },
        //触发事件方法
        methods: {
            dataFilter(data) {
                let user = this.$userInfo.userCode;
                console.log(this.$userInfo, 'userinfo')
                let list = data.filter(c => {
                    console.log(c.createUser, c.xmcyDyzrr, c.xmcyZg)
                    return c.createUser.indexOf(user) != -1 || c.xmcyDyzrr.indexOf(user) != -1 || c.xmcyZg.indexOf(user) != -1
                })
                console.log(list);
                return list
            },
            // 获取常量
            getConstant() {
                // console.log(this.getAppMenus(this.getAppCode), 'getAppMenus')
                this.$axios.get("permission/app_constant/byCode", {params: {appCode: 'PMS', code: 'GL_RY_DR_CODE'}})
                    .then(result => {
                        this.crewCodes = result.data.value.split(',');
                    })
                    .catch(error => {

                    })
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            ...mapGetters('userinfoStore', ['getUserInfo']),

            // 拼接url
            urlJoint(baseurl, params) {
                let str = "";
                for (let i in params) {
                    str += '&' + i + '=' + params[i];
                }

                return baseurl + '?' + str.substring(1);
            },
            // 审批
            handleExamine() {
                this.visiblesp = true;
                this.$nextTick(_ => {
                    this.$refs.gridSp.refresh();
                })
            },
            async initOidXmly() {
                await this.$axios.get("/permission/app_constant/byCode", {
                    params: {
                        appCode: 'PMS',
                        code: 'OID_XMLY',
                    }
                }).then(resault => {
                    if (resault.data != null) {
                        this.oidXmly = resault.data.value;
                    } else {
                        this.$message.error("初始化项目来源数据字典oid失败！请确保是否配置了OID_XMLY常量！")
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            // 成员维护确定
            handleConfirmMember() {
                let insertDataCy = this.$refs.pmssectMember.getData();
                if (!insertDataCy) {
                    return;
                }
                let deleteDataCy = this.$refs.pmssectMember.getDeleteData();

                let xminfo = {oid: this.oidXmForCy, dataSecretLevcode: this.xmSecret};
                xminfo.pmsXminfoCyList = insertDataCy.concat(deleteDataCy);

                this.$axios.post("/pms/Xminfo/saveMember", xminfo)
                    .then(result => {
                        this.$message.success("保存成功");
                        this.visiblemaintain = false;
                    })
                    .catch(error => {
                        this.$message.error("保存失败：" + error.msg)
                    })
                    .finally(_ => {

                    })
            },
            // 展示弹窗
            handleMember(row) {
                this.oidXmForCy = row.oid;
                this.xmSecret = row.dataSecretLevcode;
                this.visiblemaintain = true;
                this.$nextTick(_ => {
                    this.getListXmcyData(row.oid);
                })

            },
            /**
             * ----------------------------------项目成员------------------------------
             */

            //获取项目列表数据
            getListXmcyData(oidXm) {
                this.$refs.pmssectMember.loading = true;
                // console.log(oidXm)
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                        this.$refs.pmssectMember.loading = false;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            uploadSuccess() {
                this.refreshTree();
                this.visibleImport = false;
            },
            handleImport() {
                this.visibleImport = true;
            },
            // 到wbs
            handleWbs() {
                let obj = {
                    oid: this.rowData.oid,
                    dataSecretLevcode: this.rowData.dataSecretLevcode,
                    xmname: this.rowData.xmname,
                    gmtLx: this.rowData.gmtLx
                }
                this.$router.push({path: '/pms/xmgl/wbs', query: obj})
            },
            // 去添加项目
            handleToAddProject() {
                // if (this.curTreeNode.data.oid == this.curTreeNode.data.xmcode) {
                //     this.$message.error('请选择项目后再添加!');
                //     return;
                // }
                // this.$router.push('?selectedDeptId='+this.selectedDeptId);
                this.$router.push({
                    path: '/pms/xmgl/flowXminfo?isAdd=1',
                    // query: {selectedDeptId: this.selectedDeptId == '0' ? '' : this.selectedDeptId}
                });
            },
            // 验收材料展示弹窗
            handleShowEnd() {
                this.endVisible = true;
                this.getCloseFjList();
            },
            // 项目收尾
            handleToXmClose() {

                // let sr = this.$refs.enddata.getData();
                let sectItems = this.$refs.enddata.getSectedItems();
                if (sectItems.length <= 0) {
                    this.$message.error('请选择要发起审批的附件！');
                    return;
                }
                let isContinue = true;
                for (let i = 0; i < sectItems.length; i++) {
                    if (sectItems[i].spzt == SPZT.SPZ || sectItems[i].spzt == SPZT.YSP || sectItems[i].spzt == SPZT.ZZSP) {
                        isContinue = false;
                        break;
                    }
                }
                if (!isContinue) {
                    this.$message.error('请选择未审批的附件！');
                    return;
                }
                // if (sr.length > 0) {
                //     this.handleCloseXmFjUpload(sectItems);
                // } else {
                this.endVisible = false;
                this.rowData['pmsXmRwFjListXmjw'] = sectItems;
                this.$router.push({name: '/pms/xmgl/XmEnd', params: {row: JSON.stringify(this.rowData)}});
                // }

            },
            // 编辑项目
            dbClick(row) {
                this.$router.push('/pms/xmgl/flowXminfo?oid=' + row.oid);
                // this.$router.push('/pms/xmgl/flowXminfo?dataId=' + row.oid+'&oid='+row.oid);
            },
            handlecommand(val) {
                if (val == 1) {
                    this.handleToChangeProject();
                } else if (val == 2) {
                    this.handleToSuspendProject();
                } else {
                    this.handleToEndProject();
                }
            },
            // 变更项目
            handleToChangeProject() {
                this.$router.push('/pms/xmgl/flowXminfo?oid=' + this.rowData.oid + '&isChange=1');
            },
            // 变更暂停
            handleToSuspendProject() {
                this.$router.push('/pms/xmgl/flowXminfo?oid=' + this.rowData.oid + '&isChange=1&suspendOrNot=true');
            },
            // 变更终止
            handleToEndProject() {
                this.$router.push('/pms/xmgl/flowXminfo?oid=' + this.rowData.oid + '&isChange=1&terminateOrNot=true');
            },
            handleClick(val) {
                if (val.name == 'wbs') {
                    this.$refs.wbsFj.refresh();
                }
                if (val.name == "xmsr") {
                    console.log('羡慕输入')
                    this.$refs.pmsXmRwFjListXmsr1.resize();
                }
                if (val.name == "xmsc") {
                    this.$refs.pmsXmRwFjListXmsc1.resize();
                }
                if (val.name == "fengxian") {
                    this.$refs.pmsSectFx.resize();
                }
            },
            handleCallback2() {

            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            confirm() {

            },
            // 整理数据 获取点击删除的节点树
            tidyData(comlun, id) {
                let a = '';
                if (comlun.data.oid == id) {
                    return comlun;
                } else {
                    if (comlun.childNodes.length >= 0) {
                        comlun.childNodes.forEach((c) => {
                            a = this.tidyData(c, id);
                        })
                    } else {
                        return [];
                    }
                }
                if (a) {
                    return a;
                } else {
                    return '';
                }
            },
            //刷新按钮
            refreshGrid() {
                this.$refs.grid.refresh();
            },
            tabClick(val) {
                // if (val.name == 'first') {
                //     this.dataUrl = 'pms/Xminfo/listByCondition?year=' + this.xmyear + '&xmly=' + this.xmlyCode + '&deptCode=';
                // } else if (val.name == 'second') {
                //     this.dataUrl = 'pms/Xminfo/listByCondition?year=' + this.orgyear + '&deptCode=' + this.deptCode + '&xmly=';
                // } else {
                //     this.refreshTree();
                // }

            },
            /**
             *左侧树Tree
             * 点击部门，获取右边列表
             */
            orgNodeClick(code, row) {
                this.deptCode = code;
                let arr = row.childNodes;
                this.enpandDeptIndex = arr && arr.length > 0 ? [arr[0].data.deptCode] : []
            },
            /**
             *左侧树Tree
             * 点击项目来源，获取右边列表
             */
            xmlyClick(code, row) {

                this.xmlyCode = code
                let arr = row.childNodes;
                this.enpandXmlyIndex = arr && arr.length > 0 ? [arr[0].data.code] : []
                console.log(code, 'idfdsk', this.enpandXmlyIndex)
            },
            fun(id, row) {
                if (id == 0) {
                    console.log(id, 'id');
                    let index = this.querys.findIndex(c => {
                        return c.code == 'pid';
                    })
                    if (index >= 0) {
                        this.querys.shift();
                    }

                } else {
                    this.condition.value = id;
                    this.querys.splice(0, 1, this.condition);
                }
                this.buttons.map((c, i) => {
                    if (i >= 2 && i < 5) {
                        c.disabled = true;
                    }
                })
                if (id != null) {
                    console.log('开始执行')
                    this.$refs.grid.refresh();
                }

            },
            /**
             * 左侧树Tree 保存方法
             */
            TreeSave() {
                this.$refs.treeform.validate((valid) => {
                    if (valid) {
                        this.loadingTree = true;   //定义加载转圈
                        //调用save保存接口
                        this.formModelTree.pid = this.curTreeNode.data.oid;
                        this.$axios.post("/pms/Xminfo/saveOrUpdate", this.formModelTree)
                            .then(result => {
                                this.$message.success("保存成功");          //保存完毕之后的提示
                                this.treevisible = false;                //保存成功之后关闭模态框
                                this.$refs.iceGrid.addNode(result.data); //保存之后刷新左侧树
                                this.$refs.grid.refresh();              //保存成功grid网格刷新页面
                            })
                            .catch(error => {
                                this.$message.error("保存失败");
                            })
                            .finally(_ => {
                                this.loadingTree = false;
                            })
                    }
                })
            },
            /**
             * 左侧树Tree 删除功能
             */
            deleteNode(data) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("pms/Xminfo/deleteStatusMultiTable", {"params": {"oid": data.oid}}).then(
                        result => {
                            this.$message.success("删除成功");          //保存完毕之后的提示
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error("删除报错");
                        })
                        .finally(_ => {

                        })


                });
                //let length = this.curTreeNode.pid();


            },
            /**
             * 左边树的刷新方法
             */
            refreshTree() {
                this.$refs.iceGridxmly.refresh();
            },
            // 提交审核查看信息
            handleLook(row) {
                this.row = row;
                this.detailVisible = true;
            },
            handleToLookFlow(row) {
                this.$router.push('/pms/xmgl/XmLookFlow?oid=' + row.oid + '&dataId=' + row.oid);
            },

            // 点击行选中回调
            handleSectItem(row) {
                let ss = XM_ZT.SSZ;
                this.rowData = row[0];
                this.buttons.map((c, i) => {
                    if (i != 4) {
                        c.disabled = false;
                    }
                    if (i == 3) {
                        let arr = this.rowData.xmzg ? this.rowData.xmzg.split(",") : [];
                        if (arr.indexOf(this.currUser) != -1 || this.rowData.zrr == this.currUser) {
                            if (this.rowData.xmzt != ss && this.rowData.xmzt != XM_ZT.GB) {
                                c.disabled = true;
                            } else {
                                c.disabled = false;
                            }
                        } else {
                            c.disabled = true;
                        }
                    }
                    if ((ss.indexOf(this.rowData.xmzt) < 0 && XM_ZT.GB.indexOf(this.rowData.xmzt) < 0) && i == 3) {
                        c.disabled = true;
                    }
                    if (this.rowData.xmzt == XM_ZT.ZT && i == 3) {
                        c.disabled = true;
                    }
                    if ((this.rowData.xmzt == XM_ZT.GB || this.rowData.xmzt == XM_ZT.ZZ) && i == 2) {
                        c.disabled = true;
                    }
                })

            },
            // 获选回调
            mulCallback(data, deldata) {
                if (deldata.length > 0) {
                    deldata.forEach(c => {
                        let index = this.spdata.indexOf(c);
                        this.spdata.splice(index, 1);
                    })
                    this.spdata = this.spdata.filter(c => {

                        return c.oid != deldata[0].oid
                    })
                }
                data.forEach(c => {
                    if (this.spdata.indexOf(c) == -1) {
                        this.spdata = [...this.spdata, c];
                    }
                })
            },
            // 去审批
            handleToSp() {
                if (this.spdata.length <= 0) {
                    this.$message.error('请选择需要审批的项目！');
                    return;
                }
                let spjhdata = this.spdata.map(c => {
                    return {
                        oid: c.oid,
                        xmname: c.xmname
                    }
                })
                this.visiblesp = false;
                this.$router.push({path: '/pms/xmgl/XmBatchFlow', query: {xmdata: JSON.stringify(spjhdata)}})
            },
            // 删除选中
            spClose(item, index) {
                this.spdata.splice(index, 1);
                this.$refs.gridSp.closeSelection(item.oid);
            },
            // ############# 项目收尾-材料附件上传#############3
            handleCloseXmFjUpload() {
                // 项目输入
                let sr = this.$refs.enddata.getData();
                let obj = this.rowData;
                obj.pmsXmRwFjListXmjw = sr;
                // return;
                if (sr.length > 0) {
                    this.$axios.post("pms/Xminfo/saveOrUpdateXmClose", {$json: obj})
                        .then(result => {
                            this.$message.success("保存数据成功！");
                            this.getCloseFjList();
                            // if (sectItems) {
                            // this.endVisible = false;
                            // this.rowData['pmsXmRwFjListXmjw'] = sectItems;
                            // this.$router.push({name: '/pms/xmgl/XmEnd', params: {row: JSON.stringify(this.rowData)}});
                            // }
                            // else {
                            //     this.getCloseFjList();
                            //     this.endVisible = true;
                            // }
                        })
                        .catch(error => {
                            this.$message.error("保存数据失败！")
                        })
                } else {
                    this.$message.success("保存数据成功！");
                }
            },
            // 获取项目收尾
            getCloseFjList() {
                // return
                this.closeXmMj = [this.rowData.dataSecretLevcode]
                this.$axios.get("pms/PmsXmRwFj/queryListXmOidClose", {params: {xmOid: this.rowData.oid}})
                    .then(result => {
                        this.endlist = result.data
                    })
                    .catch(error => {
                        this.$message.error("获取失败！")
                    })
            },
            xmDateChange(year) {
                this.xmyear = year;
                // console.log('来源时间变了', year)
                this.refreshGrid();
            },
            orgDateChange(year) {
                this.sdate = year[0];
                this.edate = year[1];
                // console.log('部门时间变了')
                this.$refs.grid.refresh();
            },
        },  //methods方法底


        //这个是你引用插件生成的,不用管它
        components: {
            ATTACHMENT,
            XmBaseXmsc,
            XmBaseXmsr,
            XmBaseXmcy,
            XmBaseInfo,
            IceSingleUpload,
            IcePersionSelector,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            member,
            PmsSelectTree,
            WBS,
            Htdj,
            pmsSectMember,
            pmsSectFx,
            IceExcelUploader,
            XmDetailDialog,
            dateCusSelect,
            SCXMK
        },
        watch: {
            queryListXmcy() {
                console.log(this.pmstreeValue, 'pmstreeValue')
            },
            $route(now, old) {     //监控路由变换，控制返回按钮的显示
                if (old.path == "/pms/xmgl/flowXminfo") {
                    this.$refs.grid.refresh();
                    this.refreshTree();
                }
            },
            querys () {
                console.log(this.querys, 'wgw4gw4gwgw34g43g4')
            }
        }
    }
</script>
<style lang="less">
    .asidelayout {
        position: relative;
    }

    .asidelayout /deep/ .el-tabs {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content {
        position: absolute;
        top: 39px;
        left: 0;
        right: 0;
        bottom: 0;
    }

    .asidelayout /deep/ .el-tabs .el-tabs__content .tree {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 15px;
        width: auto !important;
        overflow-y: auto;
    }

    .box-card {
        height: 580px;
        overflow: auto;
    }

    .hint {
        font-size: 12px;
        line-height: 30px;
        color: #f30213;
    }

    .press {
        background: #ddd;
        height: 10px;
        border-radius: 5px;
        width: 50px;

        span {
            display: block;
            background: #0000ff;
            width: 10%;
            height: 100%;
            border-radius: 5px;
        }
    }

    .xm-item {
        margin-bottom: 10px;
    }

    .right_main {
        position: relative;
        padding-top: 0px !important;
    }

    .right_main /deep/ .el-tabs__content {

        position: absolute;
        top: 50px;
        left: 20px;
        right: 20px;
        bottom: 0;
    }

    .right_main /deep/ .el-tabs__content .el-tab-pane {
        height: 100%;
    }
</style>
