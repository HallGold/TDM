<template>
    <div class="ice-container">
        <el-container>
            <el-aside width="220px" class="aside-cuscom">
                <el-tree
                        :default-expand-all=true
                        :show-checkbox=false
                        :data="data"
                        node-key="id"
                        current-node-key="1"
                        :highlight-current=true
                        :props="defaultProps"
                        ref="tree"
                        @node-click="handleNodeClick"></el-tree>
                <div class="elform">
                    <el-form :v-loading="loading" :model="formModel" status-icon ref="definition"
                             label-width="140px">
                        <!--第一行-->
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="创建日期" label-width="75px" prop="xmcode">
                                    <el-date-picker
                                            v-model="serchForm.sDate"
                                            type="month"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="结束日期" label-width="75px" prop="xmcode">
                                    <el-date-picker
                                            v-model="serchForm.eDate"
                                            type="month"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="项目主管" label-width="75px" prop="xmcode">
                                    <el-select clearable v-model="serchForm.xmcyCode" placeholder="请选择">
                                        <el-option
                                                v-for="item in deptUsers"
                                                :key="item.code"
                                                :label="item.name"
                                                :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="btn">
                        <el-button type="primary" size="mini" @click="handleSearch">
                            <i class="el-icon-search" style="margin-right: 10px;"></i>
                            查询
                        </el-button>
                    </div>

                </div>

            </el-aside>
            <el-main style="padding: 5px 15px;" v-loading="mainloading">
                <div class="con_top">
                    <div class="right" @click="handleExport">

                        <!--<el-button type="text" size="mini"><i class="el-icon-download">导出表格</i></el-button>-->
                    </div>
                    <div class="condition">
                        <span class="td">查询条件</span>
                        <span class="dd">开始日期：<em>{{serchForm.sDate?moment(serchForm.sDate).format('YYYY-MM'):'-'}}</em></span>
                        <span class="dd">结束日期：<em>{{serchForm.sDate?moment(serchForm.eDate).format('YYYY-MM'):'-'}}</em></span>
                        <span class="dd">项目主管：<em>{{serchForm.xmcyCode?serchForm.xmcyCode:'-'}}</em></span>
                    </div>
                </div>

                <div class="content1">
                    <div class="title"></div>
                    <div class="total">
                        <div class="item" v-for="(item, index) in currentTreeNode.totals" :key="index"
                             :style="{width: currentTreeNode.wid}">
                            <div class="td">{{item.label}}</div>
                            <div class="dd">{{item.formatter?item.formatter(xmTotal): xmTotal[item.code]}}
                                <span style="color: #f3ec02;font-weight: 500;" v-if="item.percentageFiled">{{'  /  '+xmTotal[item.percentageFiled]}}</span>
                            </div>
                        </div>

                    </div>
                    <div class="chart">
                        <el-container class="abb">
                            <el-aside width="40%" class="contaner">
                                <div class="chart1">

                                </div>
                                <div class="chart2">
                                    <div id="main"></div>
                                </div>
                            </el-aside>
                            <el-main style="padding: 0 0 0 10px;">
                                <table class="susTable">
                                    <thead>
                                    <tr>
                                        <td v-for="(item, index) in currentTreeNode.exportConfig" :key="index">
                                            {{item.title}}
                                        </td>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="(item, index) in xmTotal[currentTreeNode.datalabel]" :key="index">
                                        <td v-for="(o, oindex) in currentTreeNode.exportConfig"
                                            :key="item.orgname+oindex">
                                            <span v-if="o.code">
                                                <div v-if="o.code instanceof Array">
                                                    <div v-for="(cc, cindex) in o.code" :style="{color: cc.color}">
                                                        {{item[cc.label]}}
                                                    </div>
                                                </div>
                                                <div v-else>
                                                      {{item[o.code]}}
                                                </div>
                                            </span>
                                            <span v-else>{{index+1}}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </el-main>
                        </el-container>
                    </div>
                </div>
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import moment from 'moment'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {mapGetters, mapMutations, mapActions} from 'vuex'

    export default {
        name: "XmMessageInfo",
        components: {
            IceQueryGrid
        },
        data() {
            return {
                // 选中的树节点
                currentTreeNode: {},
                moment: moment,
                loading: false,
                mainloading: false,
                tableData: [
                    {
                        name: '123',
                        sex: '男',
                        age: '100'
                    }
                ],
                currentkey: [],
                columns: [
                    {code: "oid", hidden: true},
                    {label: "承担组织", code: "xmname", width: 100, sortable: true},
                    {label: "项目总数", code: "xmcode", width: 130, sortable: true},
                    {label: "未启动", code: "xmcodeyn", width: 130, sortable: true},
                    {
                        label: '执行中',
                        code: 'dataSecretLevcode',
                        width: 100,
                        sortable: true,
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {label: "暂停", code: "xmzt", width: 100, sortable: true, mapTypeCode: 'XMZT'},
                    // {label: "项目类别", code: "xmlb", width: 100, sortable: true, mapTypeCode: 'XMLB'},
                    {label: "关闭", code: "xmxkfx", width: 100, sortable: true, mapTypeCode: 'XMXKFX'},

                ],
                data: [
                    {
                        label: '统计报表中心',
                        disabled: true,
                        id: '0',
                        children: [
                            {
                                totals: [
                                    {
                                        code: 'num',
                                        label: '项目总数',
                                    },
                                    {
                                        code: '',
                                        label: '科研/生产',
                                        formatter(data) {
                                            return data.ky ? data.ky + '/' + data.sc : ''
                                        }
                                    },
                                    {
                                        code: 'notStart',
                                        label: '未启动项目',
                                    },
                                    {
                                        code: 'normal',
                                        label: '正常数量',
                                    },
                                    {
                                        code: 'overdue',
                                        label: '逾期数量',
                                    },
                                    {
                                        code: 'finished',
                                        label: '完工数量',
                                    }
                                ],
                                label: '项目数量统计',
                                id: '1',
                                dataurl: '/pms/Xminfo/xmStatistics',
                                // 单独统计图表接口
                                ddDataurl: '/pms/Xminfo/xmLbStatistics?typeCode=XMLB',
                                ddLbName: 'xmlbName',
                                ddtitle: '项目类别统计',
                                clCode: 'OIDTYPE_XMLB',
                                oidType: '',
                                // 配置导出字段
                                exportConfig: [
                                    {
                                        code: '',
                                        title: '序号'
                                    },
                                    {
                                        code: 'orgname',
                                        title: '承担组织'
                                    },
                                    {
                                        code: 'num',
                                        title: '项目总数'
                                    },
                                    {
                                        code: 'notStart',
                                        title: '未启动'
                                    },
                                    {
                                        code: 'normal',
                                        title: '正常'
                                    },
                                    {
                                        code: 'overdue',
                                        title: '逾期'
                                    },
                                    {
                                        code: 'finished',
                                        title: '完工'
                                    },
                                ],
                                xmTotalConfig: [
                                    {
                                        name: '未启动项目',
                                        type: 'bar',
                                        stack: '总量',
                                        barWidth: 8,
                                        data: [],
                                        code: 'notStart'
                                    },
                                    {
                                        name: '正常执行',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'normal'
                                    },
                                    {
                                        name: '项目逾期',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'overdue'
                                    },
                                    {
                                        name: '完工项目',
                                        type: 'bar',
                                        stack: '总量',

                                        data: [],
                                        code: 'finished'
                                    },
                                ],
                                title: '责任单位项目统计',
                                datalabel: 'xmBmStatisticsVos',
                                wid: '16.66%'
                            },
                            {
                                totals: [
                                    {
                                        code: 'num',
                                        label: '项目总数',
                                    },
                                    {
                                        code: 'totalExpenses',
                                        label: '项目经费合计',
                                    },
                                    {
                                        code: 'costsNotImplemented',
                                        label: '未实施经费合计',
                                    },
                                    {
                                        code: 'costsInImplementation',
                                        label: '实施中经费合计',
                                    },
                                    {
                                        code: 'costOfClosure',
                                        label: '关闭经费合计',
                                    },
                                ],
                                label: '项目预算经费统计',
                                id: '2',
                                dataurl: '/pms/Xminfo/xmjfStatistics',
                                // 单独统计图表接口
                                ddDataurl: '/pms/Xminfo/xmLbStatistics?typeCode=XMLB',
                                ddLbName: 'xmlbName',
                                ddtitle: '项目类别统计',

                                // 配置导出字段
                                exportConfig: [
                                    {
                                        code: '',
                                        title: '序号'
                                    },
                                    {
                                        code: 'orgname',
                                        title: '承担组织'
                                    },
                                    {
                                        code: 'num',
                                        title: '项目总数'
                                    },
                                    {
                                        code: 'totalExpenses',
                                        title: '项目经费预算合计'
                                    },
                                    {
                                        code: 'costsNotImplemented',
                                        title: '未实施项目经费预算合计'
                                    },
                                    {
                                        code: 'costsInImplementation',
                                        title: '实施中项目经费预算合计'
                                    },
                                    {
                                        code: 'costOfClosure',
                                        title: '关闭项目经费预算合计'
                                    },
                                ],
                                xmTotalConfig: [
                                    {
                                        name: '未实施经费合计',
                                        type: 'bar',
                                        stack: '总量',
                                        barWidth: 8,
                                        data: [],
                                        code: 'costsNotImplemented'
                                    },
                                    {
                                        name: '实施中经费合计',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'costsInImplementation'
                                    },
                                    {
                                        name: '关闭经费合计',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'costOfClosure'
                                    },
                                ],
                                title: '责任单位项目经费统计',
                                datalabel: 'xmBmjfStatisticsVoList',
                                wid: '20%'
                            },
                            {
                                totals: [
                                    {
                                        code: 'pscHours',
                                        label: '批生产计划',
                                        percentageFiled: 'pscFinishedProportion'
                                    },
                                    {
                                        code: 'syjcHours',
                                        label: '试验件生产计划',
                                        percentageFiled: 'syjFinishedProportion'
                                    },
                                    {
                                        code: 'lxHours',
                                        label: '零星生产计划）',
                                        percentageFiled: 'lxFinishedProportion'
                                    },
                                    {
                                        code: 'hjHours',
                                        label: '货架生产计划',
                                        percentageFiled: 'hjFinishedProportion'
                                    },
                                ],
                                label: '生产工时统计',
                                id: '100',
                                dataurl: '/pms/PmsScJh/productionHourStatistics',
                                // 单独统计图表接口
                                ddDataurl: '/pms/PmsScJh/productionHourStatisticsByType?typeCode=XMLB',
                                ddLbName: 'name',
                                ddtitle: '项目类别统计',


                                // 配置导出字段
                                exportConfig: [
                                    {
                                        code: '',
                                        title: '序号'
                                    },
                                    {
                                        code: 'orgname',
                                        title: '承担组织'
                                    },
                                    {
                                        code: [
                                            {
                                                label: 'pscHours'
                                            },
                                            {
                                                label: 'pscFinishedProportion',
                                                color: '#f3ec02'
                                            }
                                        ],
                                        title: '批生产计划'
                                    },
                                    {
                                        code: [
                                            {
                                                label: 'syjcHours'
                                            },
                                            {
                                                label: 'syjFinishedProportion',
                                                color: '#f3ec02'
                                            }
                                        ],
                                        title: '试验件生产计划'
                                    },
                                    {
                                        code: [
                                            {
                                                label: 'lxHours'
                                            },
                                            {
                                                label: 'lxFinishedProportion',
                                                color: '#f3ec02'
                                            }
                                        ],
                                        title: '零星生产计划'
                                    },
                                    {
                                        code: [
                                            {
                                                label: 'hjHours'
                                            },
                                            {
                                                label: 'hjFinishedProportion',
                                                color: '#f3ec02'
                                            }
                                        ],
                                        title: '货架生产计划'
                                    },
                                ],
                                xmTotalConfig: [
                                    {
                                        name: '批生产计划(完工)',
                                        type: 'bar',
                                        stack: '完工工时',
                                        barWidth: 8,
                                        data: [],
                                        code: 'pscHours',
                                        index: 0
                                    },
                                    {
                                        name: '试验件生产计划(完工)',
                                        type: 'bar',
                                        stack: '完工工时',
                                        data: [],
                                        code: 'syjcHours',
                                        index: 0
                                    },
                                    {
                                        name: '零星生产计划(完工)',
                                        type: 'bar',
                                        stack: '完工工时',
                                        data: [],
                                        code: 'lxHours',
                                        index: 0
                                    },
                                    {
                                        name: '货架生产计划(完工)',
                                        type: 'bar',
                                        stack: '完工工时',
                                        data: [],
                                        code: 'hjHours',
                                        index: 0
                                    },
                                    // 标准工时
                                    {
                                        name: '批生产计划(标准)',
                                        type: 'bar',
                                        stack: '标准工时',
                                        barWidth: 8,
                                        data: [],
                                        code: 'pscHours',
                                        index: 1
                                    },
                                    {
                                        name: '试验件生产计划(标准)',
                                        type: 'bar',
                                        stack: '标准工时',
                                        data: [],
                                        code: 'syjcHours',
                                        index: 1
                                    },
                                    {
                                        name: '零星生产计划(标准)',
                                        type: 'bar',
                                        stack: '标准工时',
                                        data: [],
                                        code: 'lxHours',
                                        index: 1
                                    },
                                    {
                                        name: '货架生产计划(标准)',
                                        type: 'bar',
                                        stack: '标准工时',
                                        data: [],
                                        code: 'hjHours',
                                        index: 1
                                    },
                                ],
                                title: '生产工时统计',
                                datalabel: 'pmsScDptHourStatisticVoList',
                                wid: '20%'
                            },

                            {
                                totals: [


                                    {
                                        code: 'num',
                                        label: '生产计划总数',
                                    },
                                    {
                                        code: 'notStart',
                                        label: '未开始',
                                    },
                                    {
                                        code: 'haveInHand',
                                        label: '执行中',
                                    },
                                    {
                                        code: 'finished',
                                        label: '完成',
                                    },
                                    {
                                        code: 'overdue',
                                        label: '逾期',
                                    },
                                ],
                                label: '生产计划统计',
                                id: '3',
                                dataurl: '/pms/PmsScJh/scjhCpStatistics',
                                // 单独统计图表接口
                                ddDataurl: '/pms/PmsScJh/scjhlxStatistics?typeCode=JHLX20',
                                ddLbName: 'name',
                                ddtitle: '生产计划类型统计',

                                // 另外接口
                                otherUrl: '/pms/PmsScJh/scjhStatistics',

                                // 配置导出字段
                                exportConfig: [
                                    {
                                        code: '',
                                        title: '序号'
                                    },
                                    {
                                        code: 'orgname',
                                        title: '承担组织'
                                    },
                                    {
                                        code: 'planNum',
                                        title: '计划数量'
                                    },
                                    // {
                                    //     code: 'totalExpenses',
                                    //     title: '正常进行中'
                                    // },
                                    {
                                        code: 'overdueNum',
                                        title: '逾期'
                                    },
                                    {
                                        code: 'finishedNum',
                                        title: '完工'
                                    },
                                    {
                                        code: 'notFinishedNum',
                                        title: '未完成'
                                    },

                                ],
                                xmTotalConfig: [
                                    {
                                        name: '完成',
                                        type: 'bar',
                                        stack: '总量',
                                        barWidth: 8,
                                        data: [],
                                        code: 'finishedNum'
                                    },
                                    {
                                        name: '逾期',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'overdueNum'
                                    },
                                    {
                                        name: '未完成',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'notFinishedNum'
                                    },
                                ],
                                title: '责任单位计划统计',
                                datalabel: 'jhdatalist',
                                wid: '20%'
                            },
                            {
                                totals: [
                                    {
                                        code: 'num',
                                        label: '科研任务总数',
                                    },
                                    {
                                        code: 'notDistributed',
                                        label: '未下发',
                                    },
                                    {
                                        code: 'inExecution',
                                        label: '执行中',
                                    },
                                    {
                                        code: 'finished',
                                        label: '完成',
                                    },
                                    {
                                        code: 'overdue',
                                        label: '逾期',
                                    },
                                ],
                                label: '科研任务统计',
                                id: '4',
                                dataurl: '/pms/Xminfo/rwStatistics',
                                // 单独统计图表接口
                                ddDataurl: '/pms/Xminfo/rwlxStatistics?typeCode=RWLX',
                                ddLbName: 'name',
                                ddtitle: '任务类型统计',


                                // 配置导出字段
                                exportConfig: [
                                    {
                                        code: '',
                                        title: '序号'
                                    },
                                    {
                                        code: 'orgname',
                                        title: '承担组织'
                                    },
                                    {
                                        code: 'num',
                                        title: '任务数量'
                                    },
                                    {
                                        code: 'notDistributed',
                                        title: '未下发'
                                    },
                                    {
                                        code: 'overdue',
                                        title: '逾期'
                                    },
                                    {
                                        code: 'finished',
                                        title: '完工'
                                    },
                                    {
                                        code: 'inExecution',
                                        title: '执行中'
                                    },
                                ],
                                xmTotalConfig: [
                                    {
                                        name: '完成',
                                        type: 'bar',
                                        stack: '总量',
                                        barWidth: 8,
                                        data: [],
                                        code: 'finished'
                                    },
                                    {
                                        name: '逾期',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'overdue'
                                    },
                                    {
                                        name: '未下发',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'notDistributed'
                                    },
                                    {
                                        name: '执行中',
                                        type: 'bar',
                                        stack: '总量',
                                        data: [],
                                        code: 'inExecution'
                                    },
                                ],
                                title: '责任单位任务统计',
                                datalabel: 'rwBmStatisticsVoList',
                                wid: '20%'
                            },
                        ]
                    },
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                formModel: {},
                // 项目类别
                mapTypeCode: 'XMLB',
                xmlbItems: [],
                serchForm: {
                    sDate: '',
                    eDate: '',
                    xmcyCode: ''
                },
                xmTotal: {},


                deptUsers: [],
                myChart: '',
                myChart1: '',
                appCode: ''
            }
        },
        computed: {
            ...mapGetters('menuStore', ['getAppCode']),
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode);
                } else {
                    return [];
                }

            },
        },
        created() {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }


            this.getZiyAppcode();
            this.$nextTick(_ => {
                console.log(this.$refs.tree.getCurrentNode(), 'fsjf;f;')
                this.currentTreeNode = this.$refs.tree.getCurrentNode();
            })
        },
        methods: {
            ...mapActions('menuStore', ['getAppMenus']),
            //look
            getZiyAppcode() {
                this.getAppMenus(this.getAppCode).then(res => {
                    if (res && res.length > 0) {
                        this.appCode = res[0].appCode;
                        this.getCl();
                        this.getRootDeptCode();
                    }
                }).catch(res => {

                })
            },
            //三所编码
            getRootDeptCode() {
                this.$axios.get("/permission/app_constant/byCode", {
                    params: {
                        appCode: this.appCode,
                        code: 'ROOT_DEPT_CODE',
                    }
                }).then(resault => {
                    if (resault.data != null) {
                        this.rootDeptCode = resault.data.value;
                        this.initTb();
                    } else {
                        this.$message.error("初始化部门编码失败！请确保是否配置了ROOT_DEPT_CODE常量！")
                    }
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            getClData(code) {
                return new Promise((resolve, reject) => {
                    this.$axios.get("/permission/app_constant/byCode", {
                        params: {
                            appCode: 'pms',
                            code: code,
                        }
                    }).then(resault => {
                        if (resault.data != null) {
                            resolve(resault.data);
                        } else {
                            this.$message.error("初始化部门编码失败！请确保是否配置了ROOT_DEPT_CODE常量！")
                        }
                    }).catch(error => {
                        this.$message.error(error.msg)
                        reject(error);
                    })
                });
                return new Promise((resolve, reject) => {

                })

            },
            async initTb() {
                // if (!this.currentTreeNode.oidType) {
                //
                // }
                await this.getXmTotal();
                await this.getLbTotal();
                this.mainloading = false;
                window.onresize = () => {
                    if (this.$route.path == '/pms/statement/XmMessageInfo') {
                        this.myChart.resize();
                        this.myChart1.resize();
                    }

                }
            },
            // 获取常量 配置的获取部门常量
            getCl() {
                let url = "/permission/app_constant/inner/byCode";
                this.$axios.get(url, {params: {code: 'XMZGSSBM', appCode: this.appCode}})
                    .then(result => {
                        let arr = result.data.value.split(',');
                        arr.forEach((c) => {
                            this.getUsers(c);
                        })
                    })
                    .catch(error => {
                        this.$message.error("获取部门人员失败！")
                    })
            },
            // 获取规划处型号处用户信息
            getUsers(val) {
                let url = "/permission/user/dept_code";
                this.$axios.get(url, {params: {deptCode: '9003-' + val}})
                    .then(result => {
                        this.deptUsers = [...this.deptUsers, ...result.data];
                    })
                    .catch(error => {
                        this.$message.error("获取部门人员失败！")
                    })
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMapList']),
            handleSearch() {
                this.serchForm.sDate = this.serchForm.sDate ? moment(this.serchForm.sDate).format('YYYY-MM') : '';
                this.serchForm.eDate = this.serchForm.eDate ? moment(this.serchForm.eDate).format('YYYY-MM') : '';
                this.initTb();
            },
            // 获取统计
            getTotal() {
                let url = this.currentTreeNode.otherUrl;
                this.serchForm.deptCode = this.rootDeptCode;
                this.$axios.get(url, {params: this.serchForm})
                    .then(result => {
                        this.xmTotal = {...this.xmTotal, ...result.data,}
                    })
                    .catch(error => {
                        this.$message.error("获取统计失败！")
                    })
            },
            // 获取项目统计
            getXmTotal() {
                this.docVisible = true;
                let url = this.currentTreeNode.dataurl;
                this.serchForm.deptCode = this.rootDeptCode;
                this.$axios.get(url, {params: this.serchForm})
                    .then(result => {
                        this.xmTotal = {};
                        if (!result.data[this.currentTreeNode.datalabel]) {
                            this.xmTotal[this.currentTreeNode.datalabel] = result.data;
                            this.getTotal();
                        } else {
                            this.xmTotal = result.data;
                        }
                        this.$nextTick(() => {
                            // let data = result.data[this.currentTreeNode.datalabel]?result.data[this.currentTreeNode.datalabel]:result.data;
                            this.initEcharts(this.xmTotal[this.currentTreeNode.datalabel])
                        })
                    })
                    .catch(error => {
                        this.$message.error("获取项目统计失败！")
                    })
            },
            // 获取类别统计
            getLbTotal() {
                this.docVisible = true;
                let url = this.currentTreeNode.ddDataurl;
                this.$axios.get(url, {params: this.serchForm})
                    .then(result => {
                        this.$nextTick(() => {
                            this.initEchartsLb(result.data);
                        })

                    })
                    .catch(error => {
                        this.$message.error("获取项目统计失败！")
                    })
            },
            initEchartsLb(data) {
                if (this.myChart1) {
                    this.myChart1.clear();
                }
                if (this.currentTreeNode.label !='生产工时统计') {
                    let xCol = data.map((map) => {
                        return map[this.currentTreeNode.ddLbName]
                    })
                    let colData = data.map((c) => {
                        return c.num
                    })
                    // 基于准备好的dom，初始化echarts实例
                    this.myChart1 = this.$echarts.init(document.querySelector(".chart1"));
                    let option1 = {
                        //标题配置信息
                        title: {
                            text: this.currentTreeNode.ddtitle,
                            textStyle: {
                                color: "#ddd",
                                fontWeight: "bolder"
                            },
                            left: "center"
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '5%',
                            right: '5%',
                            bottom: '5%',
                            top: '20%',
                            containLabel: true
                        },
                        // legend: {
                        //   show:false,
                        //   left: 'center',
                        //   top: 'bottom',
                        //   data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6']
                        // },
                        xAxis: {
                            show: true,
                            type: "category",
                            data: xCol,
                            itemStyle: {
                                narmal: {
                                    color: "orange"
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ddd',
                                    fontSize: '10'
                                }
                            },
                        },
                        yAxis: {
                            type: "value",
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ddd',
                                    fontSize: '10'
                                }
                            },
                        },
                        series: [
                            {
                                name: '数量',
                                data: colData,
                                type: "bar",
                                barWidth: "70%",
                                itemStyle: {
                                    normal: {
                                        //每根柱子颜色设置
                                        color: function (params) {
                                            let colorList = [
                                                "#4472c4",
                                                "#ed7d31",
                                                "#a5a5a5",
                                                "#ffc000",
                                                "#5b9bd5",
                                                "#70ad47",
                                                "#264478",
                                            ];
                                            return colorList[params.dataIndex];
                                        }
                                    }
                                },
                                //柱状图上显示数据
                                label: {
                                    show: "true",
                                    position: "top",
                                    color: "#FFF",
                                    fontWeight: "bolder",
                                    backgroundColor: "auto",
                                    fontSize: "10"
                                },
                                //平均值
                                markLine: {
                                    data: [{type: "average", name: "平均值"}]
                                }
                            },
                        ]

                    };
                    // 使用刚指定的配置项和数据显示图表。
                    this.myChart1.setOption(option1);
                } else {
                    console.log(data, 'data');
                    let arr = data.map(c=>{
                        return [
                            c.name,
                            c.standardHours,
                            c.finishedHours
                        ]
                    })
                    let option = {
                        title: {
                            text: this.currentTreeNode.ddtitle,
                            textStyle: {
                                color: "#ddd",
                                fontWeight: "bolder"
                            },
                            left: "center"
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                            }
                        },
                        grid: {
                            left: '5%',
                            right: '5%',
                            bottom: '5%',
                            top: '20%',
                            containLabel: true
                        },
                        dataset: {
                            source: [
                                ['product', '标准工时', '完工工时'],
                                ...arr
                            ]
                        },
                        xAxis: {
                            show: true,
                            type: "category",
                            itemStyle: {
                                narmal: {
                                    color: "orange"
                                }
                            },
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ddd',
                                    fontSize: '10'
                                }
                            },
                        },
                        yAxis: {
                            type: "value",
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#ddd',
                                    fontSize: '10'
                                }
                            },
                        },
                        series: [
                            {type: 'bar',show:'false',itemStyle: {
                                    normal: {
                                        color: '#e0a410',   //柱状颜色
                                    }
                                }},
                            {type: 'bar',itemStyle: {
                                    normal: {
                                        color: '#de1512',   //柱状颜色
                                    }
                                }
                            },
                        ]
                    };
                    // 使用刚指定的配置项和数据显示图表。
                    this.myChart1.setOption(option);
                }


            },
            initEcharts(data) {
                if (this.myChart) {

                    this.myChart.clear();
                }

                let yCol = data.map((c) => {
                    return c.orgname
                });
                let yend = this.currentTreeNode.xmTotalConfig.map((c) => {
                    c.data = [];
                    return c.name
                })
                // 判定是否是生产工时统计
                if (this.currentTreeNode.label!='生产工时统计') {
                    data.forEach((c) => {
                        this.currentTreeNode.xmTotalConfig.forEach((p) => {
                            p.data.push(c[p.code])
                        })
                    })
                } else {

                    data.forEach((c) => {

                        this.currentTreeNode.xmTotalConfig.forEach((p) => {
                            let num = c[p.code].split('/')[p.index]*1
                            p.data.push(num);
                        })
                    })
                }

                this.myChart = this.$echarts.init(document.getElementById('main'));
                // 指定图表的配置项和数据
                var option = {
                    color: ['#aaa', '#4472c4', '#f30213', 'green'],
                    title: {
                        text: this.currentTreeNode.title,
                        left: 'center',
                        textStyle: {
                            color: '#ddd'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data: yend,
                        bottom: 10,
                        left: 'center',
                        type: 'scroll',
                        width: '100%',
                        itemWidth: 15,
                        textStyle: {
                            color: '#aaa'
                        }
                    },
                    grid: {
                        top: '10%',
                        left: '3%',
                        right: '4%',
                        bottom: '10%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                        axisLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yCol,
                        axisLine: {
                            lineStyle: {
                                color: '#ddd'
                            }
                        },
                        axisLabel: {
                            show: true,
                            textStyle: {
                                color: '#ddd',
                                fontSize: '10'
                            }
                        },
                    },
                    series: this.currentTreeNode.xmTotalConfig
                };
                console.log(this.currentTreeNode.xmTotalConfig, 'this.currentTreeNode.xmTotalConfig')

                // 使用刚指定的配置项和数据显示图表。
                this.myChart.setOption(option);

                let xmlbItems = this.filterSelectList.map((c) => {
                    return c.label;
                })
            },
            // 页面变化重置图表
            async resetRecharts() {

            },
            // 封装导出表格
            handleExport() {
                let std = '';
                let exportconfig = this.currentTreeNode.exportConfig
                exportconfig.forEach((c) => {
                    std += `<td>${c.title}</td>`
                })
                let str1 = `<tr>${std}</tr>`
                this.xmTotal[this.currentTreeNode.datalabel].forEach((c, i) => {
                    let s = '';
                    exportconfig.forEach((p) => {
                        s += `<td>${p.code ? c[p.code] : (i + 1)}</td>`
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
                ele.download = this.currentTreeNode.label + '.xls'
                ele.click();
                // window.location.href = uri + this.base64(template)
            },
            // 表格转码
            base64(s) {
                return window.btoa(unescape(encodeURIComponent(s)))
            },
            handleNodeClick(data, node) {

                console.log(node)
                if (!node.isLeaf) {
                    this.$refs.tree.setCurrentKey(null);
                    return
                }
                this.mainloading = true;
                this.currentTreeNode = data;
                this.initTb();

            }
        },
    }
</script>

<style lang="less" scoped>
    .aside-cuscom {
        border: 1px solid #ddd;
        padding: 15px 0;
        position: relative;

        .elform {
            border-top: 1px solid #ddd;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px 10px 10px 10px;
            box-sizing: border-box;
        }
    }

    .condition {
        span {
            font-size: 14px;
            color: #555;
            margin-right: 15px;

        }

        .dd {
            em {
                color: #333;
                font-style: normal;
            }
        }

        .td {
            color: #000;

        }
    }

    .content1 {
        padding: 10px 0;
        background: #5a626e;
        height: 96%;
        box-sizing: border-box;
        position: relative;

        .title {
            height: 5px;
            background: #fff;
            position: relative;
            width: 100%;
            margin: 15px 0;

            &::after {
                content: '项目信息统计查询情况';
                position: absolute;
                top: -10px;
                background: #5a626e;
                padding: 0 10px;
                font-size: 16px;
                color: #fff;
            }
        }
    }

    .total {
        margin: 0 20px;

        .item {
            float: left;
            width: 16.667%;

            .td {
                font-size: 20px;
                color: #fff;
            }

            .dd {
                font-size: 18px;
                color: #33CCCC;
                font-weight: bold;
            }
        }

        &::after {
            content: '';
            display: block;
            clear: both;
        }
    }

    .chart1 {

    }

    .abb {
        position: absolute;
        top: 110px;
        bottom: 0;
        width: 100%;

        .contaner {
            position: relative;

            .chart1 {
                position: absolute;
                box-sizing: border-box;
                border: 1px solid #ddd;
                height: 200px;
                width: 100%;
            }

            .chart2 {
                position: absolute;
                width: 100%;
                top: 210px;
                bottom: 0;
                border: 1px solid #ddd;
                box-sizing: border-box;
            }
        }

    }

    #main {
        position: absolute;
        bottom: 0;
        right: 1px;
        left: 1px;
        top: 0;
    }

    .btn {
        margin-bottom: 10px;
        text-align: center;
        margin-top: 10px;
    }

    .susTable {
        width: 100%;
        border-collapse: collapse;
        color: #fff;
        text-align: center;
        font-size: 14px;

        thead {
            tr {
                td {
                    text-align: center;
                }
            }
        }

        td {
            border: 1px solid #fff;
            padding: 5px 10px;
        }
    }

    .con_top {
        &::after {
            content: "";
            display: block;
            clear: both;
        }

        .right {
            float: right;
        }
    }

    .aside-cuscom /deep/ .el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content {
        background-color: #1892b3;
        color: #fff;
    }
</style>
