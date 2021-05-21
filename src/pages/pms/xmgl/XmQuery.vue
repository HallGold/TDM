<template>
    <div class="ice-container">
        <el-container>
            <!--调用左侧组件格式-->
            <el-aside width="250px" class="asidelayout">
                <el-tabs v-model="activetree" type="border-card" @tab-click="tabClick">
<!--                    <el-tab-pane label="按项目">-->
<!--                        <ice-tree load-url="pms/Xminfo/QueryTreeAll"-->
<!--                                  label-prop="xmname"-->
<!--                                  value-prop="oid"-->
<!--                                  class="tree"-->
<!--                                  :defaultExpandKey="enpandIndex"-->
<!--                                  @node-click="orgNodeClick"-->
<!--                                  :lazy="false"-->
<!--                                  ref="iceGrid"-->
<!--                        >-->
<!--                        </ice-tree>-->
<!--                    </el-tab-pane>-->
                    <el-tab-pane label="按来源" name="first">
                        <ice-tree :load-url="xmlyUrl"
                                  label-prop="name"
                                  value-prop="code"
                                  node-key="code"
                                  class="tree"
                                  :defaultExpandKey="enpandXmlyIndex"
                                  @node-click="xmlyClick"
                                  :lazy="false"
                                  ref="iceGrid"
                        >
                            <div slot="prefix">
                                <date-cus-select  v-model="yearOrangeXmly"></date-cus-select>
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
                                  ref="iceGridyear"
                        >
                            <div slot="prefix">
                                <date-cus-select  v-model="yearOrangeDept"></date-cus-select>
                            </div>
                        </ice-tree>

                    </el-tab-pane>
                </el-tabs>
            </el-aside>

            <!--引用组件,定义变量-->
            <el-main>
                <ice-query-grid
                        :data-url="dataUrl"
                        :columns="columns"
                        chooseItem="single"
                        ref="grid"
                        :operations="operations"
                        :query="querys"
                        exportTitle="科研项目信息"
                >
                </ice-query-grid>
            </el-main>
        </el-container>
        <!--详情-->
        <ice-dialog title="项目详情" :visible.sync="detailVisible" width="1300px">
            <xm-detail-dialog :getFlowList="getFlowList" :row="row" @handleClose="detailVisible=false"></xm-detail-dialog>
        </ice-dialog>
        <ice-dialog title="生产项目库    " :visible.sync="scVisible" width="1000px">
            <el-form :model="formModel" ref="form" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="生产项目编码" label-width="110px" prop="xmcode">
                            <el-input v-model="formModel.xmcode" readonly placeholder="自动生成"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目名称" label-width="110px" prop="xmname">
                            <el-input v-model="formModel.xmname" :disabled="formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="外部项目编码" label-width="110px" prop="xmcodeSw">
                            <el-input v-model="formModel.xmcodeSw" readonly placeholder="自动生成"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="立项时间" label-width="110px" prop="gmtLx">
                            <ice-date-picker v-model="formModel.gmtLx" :disabled="formReadonly"></ice-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="项目来源" label-width="110px" prop="xmly">
                            <pms-select-tree :disabled="formReadonly" v-model="formModel.xmly" :isemptyBtn="isemptyBtn"
                                             :showChecked="showChecked"
                                             unbrid="true"
                                             :treeData="treeData"
                                             :iscanLevel1=false
                                             :transfer="transferTree.treeData"
                                             trigger="click"
                                             @select-xmly="lyy=>{formModel.xmlyName=lyy.name}"
                            >
                            </pms-select-tree>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="项目类别" label-width="110px" prop="xmlb">
                            <ice-select v-model="formModel.xmlb" map-type-code="XMLB"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="主管部门" label-width="110px" prop="xmzgbm">
                            <ice-dept-selector chooseItem="single" :mode="formReadonly?'readonly':'onlySelect'"
                                               v-model="formModel.xmzgbm"
                                               @select-confirm="depts=>formModel.xmzgbmCode=depts[0].deptCode"
                                               :disabled="formReadonly"></ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="110px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-col :span="24">
                            <el-tabs v-model="activeName">
                                <el-tab-pane label="项目成员" name="first">
                                    <div class="hint">项目主管、项目第一责任人、行政负责人、技术负责人是必选角色</div>
                                    <!--<el-button type="success"><i class="el-icon-plus"></i>选择成员</el-button>-->
                                    <pms-sect-member :disabled="formReadonly" ref="pmssectMember"
                                                     :queryListXmcy="queryListXmcy"></pms-sect-member>
                                </el-tab-pane>
                                <el-tab-pane label="项目附件">
                                    <ATTACHMENT :data="attaTableData" ref="attachment"></ATTACHMENT>
                                </el-tab-pane>
                            </el-tabs>
                        </el-col>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <!--                <el-button type="primary" @click="confirm" v-if="!formReadonly">确认</el-button>-->
                <el-button type="info" @click="scVisible=false">关闭</el-button>
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
    import {MUST_ROLE, ROLE_ONE} from "../../../utils/constant";
    import PmsSelectTree from '../../../components/common/pms/PmsSelectTree'
    import Htdj from '../htgl/htdj_edit'
    import WBS from './components/WBS'
    import pmsSectMember from './components/pmsSectMember'
    import pmsSectFx from './components/pmsSectFx'

    import XmDetailDialog from './components/XmDetailDialog.vue'
    import dateCusSelect from './components/dateCusSelect'


    import {mapGetters, mapMutations} from 'vuex'

    import moment from 'moment';

    let date = new Date();

    //export default 只能导出一个默认模块，这个模块可以匿名
    let now = new Date();
    let year = now.getFullYear();
    const initstart = year+'-1-1';
    const initend = year+'-12-31';
    let datesj = [initstart, initend]
    export default {
        name: "Xminfo",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                activetree: 'first',
                oidXmly: '',
                enpandXmlyIndex: [],
                enpandDeptIndex: [],
                xmlyCode: '',
                deptCode: '',
                yearOrangeXmly: datesj,
                yearOrangeDept: datesj,
                row: {},
                formModel: {},
                formReadonly: false,
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                attaTableData: [],
                scVisible: false,
                isemptyBtn: true,
                showChecked: false,
                queryListXmcy: [],
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
                detailVisible: false,
                //调用页面网格数据
                columns: [
                    {code: "oid", hidden: true},
                    {label: "项目名称", code: "xmname", width: 100, sortable: true},
                    {label: "所内项目编号", code: "xmcode", width: 130, sortable: true},
                    {label: "所外项目编号", code: "xmcodeSw", width: 130, sortable: true},
                    {
                        label: '项目密级',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: "项目状态", code: "xmzt", width: 100, sortable: true, mapTypeCode: 'XMZT'},
                    {label: "项目来源编码", code: "xmly", width: 100, hidden: true,},
                    {label: "项目类别", code: "xmlb", width: 100, hiddren: true, mapTypeCode: 'XMLB'},
                    {label: "项目来源", code: "xmlyName", width: 100, sortable: true, },
                    {label: "项目类型", code: "xmlx", width: 100, hiddren: true, mapTypeCode: 'XMLX'},
                    {label: "学科方向", code: "xmxkfx", width: 100, sortable: true, mapTypeCode: 'XMXKFX'},
                    {label: "业务主管部门", code: "xmzgbm", width: 130, sortable: true, hidden: true},
                    {label: "业务主管部门", code: "xmzgbmCode", width: 130, sortable: true, cusMapTypeCode: "DEPT"},
                    {label: "责任单位", code: "orgname", width: 100, sortable: true, hidden: true},
                    {label: "责任单位", code: "orgcode", width: 100, cusMapTypeCode: "DEPT"},
                    {label: "上报状态", code: "sbzt", width: 100, sortable: true, mapTypeCode: 'SBZT'},
                    {label: "审批结果", code: "spzt", width: 100, sortable: true, mapTypeCode: 'SPZT'},
                    {label: "预算经费合计(万元)", code: "ysjfhj", width: 100, sortable: true},
                    // {label: "预算号", code: "xmysh", width: 100, sortable: true},
                    {label: "立项日期", code: "gmtLx", width: 100, sortable: true},
                    {label: "计划结项日期", code: "finishDate", width: 100, sortable: true},
                    {label: "实际结项日期", code: "gmtJx", width: 100, sortable: true},
                    // {label: "删除状态", code: "deleteStatus", width: 100, sortable: true},
                    // {label: "锁定状态", code: "lockedStatus", width: 100, sortable: true},
                    {label: "项目主管", code: "xmzg", width: 100, sortable: true},
                    {label: "责任人", code: "zrr", width: 100, sortable: true},
                    {label: "行政负责人", code: "xzfzr", width: 100, sortable: true},
                    {label: "技术负责人", code: "jsfzr", width: 100, sortable: true},
                    // {label: "项目目标", code: "xmmb", hidden: true},
                    // {label: "备注", code: "dateRemark", hidden: true},

                ],
                //按钮组件1231414
                buttons: [],
                //定义弹出框为false，隐藏状态
                visible: false,
                //定义模态框 转圈加载过程
                loading: false,


                //定义高级模糊查询方法
                querys: [
                    {type: 'static', code: 'pid', label: '父ID', value: ''},
                    // {type: 'static', code: 'xmlx', label: '项目类型', value: 'XMLX01'},
                    {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                    {type: 'input', code: 'xmcode', label: '所内项目编号', value: ''},
                    {type: 'input', code: 'xmcodeyn', label: '所外项目编号', value: ''},
                    {type: 'select', code: 'xmzt', label: '项目状态', value: '', mapTypeCode: 'XMZT'},
                    {type: 'select', code: 'xmlb', label: '项目类别', value: '', mapTypeCode: 'XMLB'},
                    {type: 'select', code: 'xmxkfx', label: '学科方向', value: '', mapTypeCode: 'XMXKFX'},
                    // {type: 'input', code: 'ysjfhj', label: '预算经费合计', value: ''},
                    {type: 'select', code: 'dataSecretLevcode', label: '项目密级', value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {type: 'select', code: 'sbzt', label: '上报状态', value: '', mapTypeCode: 'SBZT'},
                    {type: 'select', code: 'spzt', label: '审批状态', value: '', mapTypeCode: 'SPZT'},

                    {type: 'date', code: 'gmtLx', label: '立项日期'},
                    {type: 'date', code: 'finishDate', label: '完结日期'},
                ],
                condition: {type: 'static', code: 'pid', label: '父ID', value: ''},
                //定义行的编辑,项目结转
                operations: [
                    {
                        name: '查看', callback: this.dbClick, ctrlCode: "BCK"
                    },
                ],


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
            }
        },
        computed: {
            xmlyUrl() {
                return '/pms/DataDictionaryType/getTree?code=XMLY&isTree=1';
                // return '/pms/FrameAppDataDictionaryType/tree?oidType=' + this.oidXmly;
            },
            dataUrl (){
                let dates = this.activetree=='first'?this.yearOrangeXmly:this.yearOrangeDept
                let obj = {
                    sdate: moment(dates[0]).format('YYYY-MM-DD'),
                    edate: moment(dates[1]).format('YYYY-MM-DD'),
                    deptCode: this.activetree!='first'?this.deptCode:'',
                    xmly: this.activetree=='first'?this.xmlyCode:''
                }
                let url = this.urlJoint('pms/Xminfo/queryListByXminfo', obj)
                return  url;
            }
        },
        created() {
            // this.initOidXmly();
            this.membershow = true;
            // this.filterSelectList();
        },
        //触发事件方法
        methods: {

            // 流程记录查看
            getFlowList(row) {
                this.$axios.get("/pms/XtBpmRec/listByBoid", {params: {boid: row.oid}})
                    .then(result => {
                        let dataId = result.data[0].bpmDataId;
                        let arr = result.data.map((c) => {
                            return {
                                bpmName: c.bpmName,
                                bpmDataId: c.bpmDataId,
                            }
                        })
                        this.$router.push({
                            path: '/pms/xmgl/XmLookFlow',
                            query: {oid: row.oid, dataId: dataId, data: JSON.stringify(arr)}
                        });
                        this.detailVisible = false;
                    })
                    .catch(error => {
                        this.$message.error("项目库流程列表失败")
                    })
                    .finally(_ => {

                    })
            },
            // 拼接url
            urlJoint (baseurl, params) {
                let str = "";
                for(let i in params) {
                    str += '&'+i+'='+params[i];
                }
                return baseurl+'?'+str.substring(1);
            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            // 获取详情信息
            // 双击一行
            dbClick(row) {
                this.row = row;
                console.log(row)
                if (row.xmlx == 'XMLX01') {
                    this.detailVisible = true;
                } else if (row.xmlx == 'XMLX02') {
                    this.scVisible = true;
                    this.formReadonly = true;
                    this.$nextTick(_ => {
                        this.$refs.form.resetFields();
                        this.formModel = {...row}
                    });
                    this.getListXmcyData(row.oid);
                    this.getXtfjList(row.oid);
                    // this.$message.info("生产项目库！")
                }
            },
            async initOidXmly() {
                await   this.$axios.get("/permission/app_constant/byCode", {
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
            //获取项目列表数据
            getListXmcyData(oidXm) {
                console.log(oidXm)
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                        console.log(result.data)
                        let arr = [];
                        result.data.forEach((c, i) => {
                            arr.push(c.oid);
                        });
                        this.personIds = arr;
                        console.log(' this.personIds', this.personIds)
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            /**
             * 获取项目附件
             */
            getXtfjList(oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.attaTableData = result.data;
                    })
                    .catch(error => {
                        this.$message.error("查询失败")
                    })
                    .finally(_ => {

                    })
            },
            getTreeData(data) {
                let array = this.arrayFlat(data);
                this.treeDataList = array;
            },
            //刷新按钮
            refreshGrid() {
                this.$refs.grid.refresh();
            },
            tabClick(val) {


            },
            /**
             *左侧树Tree
             * 点击部门，获取右边列表
             */
            orgNodeClick(code, row) {
                console.log(code, 'idfdsk', row)
                this.deptCode = code;
                let arr = row.childNodes;
                this.enpandDeptIndex = arr && arr.length > 0 ? [arr[0].data.deptCode] : []

            },
            /**
             *左侧树Tree
             * 点击项目来源，获取右边列表
             */
            xmlyClick(code, row) {
                console.log(code, 'idfdsk', row)
                this.xmlyCode = code
                let arr = row.childNodes;
                this.enpandXmlyIndex = arr && arr.length > 0 ? [arr[0].data.code] : []

                // let pd = id == row.data.xmcode;
                // if (id == 0 || pd) {
                //     let arr = row.childNodes;
                //     this.enpandIndex = arr && arr.length > 0 ? [arr[0].data.oid] : []
                // }
                // this.selectedDeptId = id;
                // this.curTreeNode = row;  //获取行数据
                // console.log(pd, 'pd', id)
                // if (pd) {
                //     return
                // }
                // this.fun(id, row)
            },
            fun (id, row) {
                if(id == 0){
                    console.log(id, 'id');
                    let index = this.querys.findIndex(c=>{
                        return c.code=='pid';
                    })
                    if (index>=0) {
                        this.querys.shift();
                    }

                }else {
                    this.condition.value = id;
                    this.querys.splice(0, 1, this.condition);
                }
                this.buttons.map((c, i) => {
                    if (i >= 2 && i < 5) {
                        c.disabled = true;
                    }
                })
                if (id!=null) {
                    console.log('开始执行')
                    this.refreshGrid();
                }

            },
            /**
             * 左边树的刷新方法
             */
            refreshTree() {
                this.$refs.iceGrid.refresh();
            },
            xmDateChange(year) {
                this.xmyear = year;
                this.refreshGrid();
            },
            orgDateChange(year) {
                this.orgyear = year;
                this.refreshGrid();
            },
        },  //methods方法底部


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
            XmDetailDialog,
            dateCusSelect
        },
        watch: {
            $route(now, old) {     //监控路由变换，控制返回按钮的显示
                if (old.path == "/pms/xmgl/flowXminfo") {
                    this.refreshGrid();
                    this.refreshTree();
                }
            }
        }
    }
</script>
<style lang="less">
    .box-card {
        height: 580px;
        overflow: auto;
    }

    .hint {
        font-size: 12px;
        line-height: 30px;
        color: #f30213;
    }

    .detail-tab {
        height: 500px;
        overflow: auto;
    }

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
</style>
