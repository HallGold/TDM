<template>
    <div class="ice-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="任务日历" name="first">

            </el-tab-pane>
            <el-tab-pane label="项目下的任务" name="second">
                <div class="lists">

                </div>

            </el-tab-pane>
        </el-tabs>


        <div class="vxe-full-main">
            <div class="vxe-full-container">
                <div ref="calContainer" style="position: relative;" v-if="activeName=='first'">
                    <full-calendar
                            :calHeight="calHeight"
                            @eventClick="eventClick"
                            @eventOver="eventOver"
                            @eventLeave="eventLeave"
                            lang="zh" @moreClick="moreClick" :events="allData" class="test-fc"
                            first-day='1' locale="fr"
                    >
                        <div slot="fc-header-left" class="colorStatus">
                            <div class="itemColor">
                                <div class="c bg1"></div>
                                <div class="t">执行中</div>
                            </div>
                            <div class="itemColor">
                                <div class="c bg2"></div>
                                <div class="t">暂停</div>
                            </div>
                            <div class="itemColor">
                                <div class="c bg3"></div>
                                <div class="t">逾期</div>
                            </div>
                            <div class="itemColor">
                                <div class="c bg4"></div>
                                <div class="t">变更</div>
                            </div>
                            <div class="itemColor">
                                <div class="c bg5"></div>
                                <div class="t">快到期</div>
                            </div>
                        </div>
                    </full-calendar>
                    <!--展示任务详情-->
                    <div class="showRwDetail" v-show="visibleRwDetail"
                         :style="{top: visibleRwPosition.top+'px', left: visibleRwPosition.left+'px'}">
                        <div class="item">{{calRow.xmname}}</div>
                        <div class="item">{{calRow.rwname}}</div>
                        <div class="item">
                            开始日期:{{calRow.start?moment(calRow.start).format("YYYY-MM-DD"):""}}
                        </div>
                        <div class="item">结束日期:{{calRow.start?moment(calRow.end).format("YYYY-MM-DD"):""}}
                        </div>
                    </div>
                </div>
                <div class="ice-container" v-else>
                    <el-container>
                        <el-aside width="250px" class="asidelayout">
                            <el-tabs type="border-card">
                                <ice-tree :load-url="`/pms/Xminfo/selectByWbs?cyCode=${$userInfo.userCode}`"
                                          label-prop="xmname"
                                          value-prop="oid"
                                          class="tree"
                                          @node-click="xmkNodeClick"
                                          :lazy="false">
                                </ice-tree>
                            </el-tabs>
                        </el-aside>
                        <el-main style="padding: 0">
                            <div class="ice-container">
                                <!--引用vxe组件,定义变量-->
                                <vxe-toolbar setting>
                                    <template v-slot:buttons>
                                        <div class="ice-grid-button-bar">
                                            <el-button type="primary" icon="el-icon-refresh" @click="refreshGrid">刷新
                                            </el-button>
                                            <div style="flex-grow:1;">
                                                <div class="ice-quick-query" style="float: right;">
                                                    <el-input maxlength="50" v-model="queryParam" placeholder="请输入关键字">
                                                    </el-input>
                                                </div>
                                            </div>

                                        </div>

                                    </template>
                                </vxe-toolbar>
                                <div class="vxe-full-main">
                                    <div class="vxe-full-container">
                                        <vxe-table
                                                v-loading="loading"
                                                border
                                                resizable
                                                auto-resize
                                                show-overflow
                                                ref="xGrid"
                                                highlight-current-row
                                                highlight-hover-row
                                                height="100%"
                                                @cell-click="cellClick"
                                                class="wbstable-style"
                                                :cell-class-name="cellClassName"
                                                :toolbar="toolbar"
                                                :data="list"
                                                :edit-config="{trigger: 'click', mode: 'row', showStatus: true, showIcon: false}"
                                                :tree-config="treeConfig"
                                                :keyboard-config="{isArrow: false}">
                                            <vxe-table-column field="dataPxh" title="序号" width="50px"
                                                              fixed="left"></vxe-table-column>
                                            <vxe-table-column field="wbscode" title="WBS编号" width="100px"
                                                              tree-node></vxe-table-column>
                                            <vxe-table-column field="rwzt" width="110px" title="任务状态"
                                                              :cell-render="{name: 'mapTypeCode', mapTypeCode: 'RWZT'}">

                                            </vxe-table-column>
                                            <vxe-table-column field="dataSecretLevcode" title="密级" width="150px"
                                                              :formatter="zlycbh.miji"></vxe-table-column>
                                            <vxe-table-column field="rwname" title="任务内容" width="500px"
                                                              show-overflow="title"></vxe-table-column>
                                            <vxe-table-column field="qzrw" title="前置任务"
                                                              width="100px"></vxe-table-column>
                                            <vxe-table-column field="dateJhStar" title="开始日期"
                                                              :formatter="['toDateString', 'yyyy-MM-dd']" width="100px">
                                            </vxe-table-column>
                                            <vxe-table-column field="dateJhEnd" title="完成日期"
                                                              :formatter="['toDateString', 'yyyy-MM-dd']" width="100px">
                                            </vxe-table-column>
                                            <vxe-table-column field="rwdeptcode" title="责任单位" show-overflow="title"
                                                              width="150px"
                                                              :cell-render="{name: 'mapTypeCode', cusMapTypeCode: 'DEPT'}">
                                            </vxe-table-column>
                                            <vxe-table-column field="rwfzr" title="责任人" width="150px">
                                            </vxe-table-column>
                                            <vxe-table-column title="操作" fixed="right" width="150">
                                                <template v-slot="{ row }">
                                                    <!-- <vxe-button v-if="row.rwfzrcode === currUser" type="primary" @click="rwDelay(row)">变更</vxe-button> -->
                                                    <!--<vxe-button v-if="row.rwfzrcode === currUser && row.rwzt != 'RWZT40'"-->
                                                    <!--type="primary" @click="jfwSubmit(row)">交付物-->
                                                    <!--</vxe-button>-->
                                                    <el-button type="text"
                                                               v-if="row.rwfzrcode === currUser && row.rwzt != 'RWZT40'"
                                                               @click="jfwSubmit(row)">交付物
                                                    </el-button>
                                                    <el-button type="text"
                                                               v-if="row.rwfzrcode === currUser&&(row.rwlx==RWCGXX.CPSJ||row.rwlx==RWCGXX.GYSJ)"
                                                               @click="toPdmRw(row)">
                                                        {{row.rwlx==RWCGXX.CPSJ?'产品设计':'工艺设计'}}
                                                    </el-button>
                                                </template>
                                            </vxe-table-column>
                                        </vxe-table>
                                    </div>
                                </div>
                                <div v-if="isMyTask" style="margin-top: 5px;">
                                    <div style="margin: 10px 0;">
                            <span style="margin-left: 10px"><el-button size="mini" type="primary" icon="el-icon-edit"
                                                                       @click="workLog">进展反馈</el-button></span>
                                        <span style="margin-left: 20px;">({{row.rwname}})</span>
                                    </div>
                                    <div style="height: 300px; overflow-y:auto;padding: 10px 0;">
                                        <el-timeline>
                                            <el-timeline-item v-for="item in logData" :timestamp="item.rztxDate"
                                                              :key="item.oid"
                                                              placement="top">
                                                <el-card>
                                                    <p>{{item.rzms}}</p>
                                                    <p style="color: #07d196;margin-top: 5px;" v-if="jxTxt(item)">
                                                        处理意见：{{jxTxt(item)}}</p>
                                                </el-card>
                                                <div class="logstatus">
                                                    <div class="item"><i class="dot" :class="dotbg(item)"></i>{{dataMapFklx[item.feedbackType]}}
                                                    </div>
                                                    <div class="item">{{item.rztxr}}</div>
                                                    <div class="item">{{dataMapSecret[item.dataSecretLevcode]}}</div>
                                                    <div class="item" v-if="item.feedbackType==FKLX.WTFK">
                                                        {{dataMapSbzt[item.sbzt]}}
                                                    </div>
                                                    <div class="item" style="margin-top: -7px;"
                                                         v-if="item.feedbackType==FKLX.WTFK&&item.sbzt!=SBZT.YSB">
                                                        <el-button size="mini" type="danger" icon="el-icon-edit"
                                                                   @click="toXmWt(item)">
                                                            问题上报
                                                        </el-button>
                                                    </div>
                                                </div>
                                            </el-timeline-item>
                                        </el-timeline>
                                    </div>
                                </div>
                            </div>
                        </el-main>
                    </el-container>
                </div>

            </div>
        </div>


        <!--弹出模态框-->
        <WbsEdit ref="myWbsEdit" :isRefresh=true :isChecked="true"></WbsEdit>
        <WbsRwrz ref="myWbsRwrz" @queryWorkLog="queryWorkLog" :dataSecretLevcode="row.dataSecretLevcode"></WbsRwrz>
<!--        <el-calendar v-model="value">-->
<!--        </el-calendar>-->


    </div>
</template>

<script>
    import localstoreUtil from '@/utils/localstoreUtil';
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceTree from "../../../components/common/base/IceTree";
    import WbsEdit from "./wbsEdit";
    import WbsRwrz from "./wbsRwrz";
    import zlycbh from "@/utils/zlycbh"
    import {RWZT, whether, FKLX, SPZT, SBZT, RWCGXX, fastDay} from "../../../utils/constant";
    import {mapGetters, mapMutations} from 'vuex'
    import FullCalendar from '../../../assets/vue-fullcalendar/fullCalendar.vue'
    import moment from "moment";


    export default {
        name: "wbsExcute",
        //为了不让多处的组件共享同一data对象，只能返回函数。
        data() {
            return {
                value: "",
                activeName: 'first',
                visibleRwDetail: false,
                visibleRwPosition: {
                    left: 0,
                    top: 0
                },
                moment,
                FKLX,
                SBZT,
                RWCGXX,
                loading: false,
                zlycbh: zlycbh,
                queryParam: '',
                //调用页面网格数据
                tableData: [],
                toolbar: {
                    id: 'toolbar_demo_2',
                    refresh: false,
                    setting: {
                        storage: true
                    }
                },
                treeConfig: {
                    trigger: 'default',
                    children: 'children',
                    expandAll: true,
                    indent: '10'
                },
                logData: [],
                oidXm: '',
                oidRw: '',
                //定义弹出框为false，隐藏状态
                visible: false,
                title: '',
                //定义模态框 转圈加载过程
                loading: false,
                isMyTask: false,
                //currUser: '__$Anonymity_User$__'
                currUser: localstoreUtil.getLastLoginUserName(),
                row: {},
                calRow: {},
                allList: [],
                calHeight: 0
            }
        },
        created() {
            this.addUndoTypeCodes(['DATA_SECRET_LEVEL', 'RW_FKLX']);
            this.$nextTick(_ => {

                this.getAllList();
            })
        },
        watch: {
            isMyTask() {
                this.$nextTick(_ => {
                    console.log(this.$refs.xGrid)
                    this.$refs.xGrid.recalculate();
                })
            }
        },
        mounted() {
            this.$nextTick(_ => {
                let tid = setTimeout(() => {
                    // console.log( this.$refs.calContainer.offsetHeight, ' this.$refs.calContainer.offsetHeight')
                    this.calHeight = this.$refs.calContainer.offsetHeight;
                    clearTimeout(tid)
                }, 20)

            })
        },
        //触发事件方法
        methods: {
            // 点击事件
            eventClick(event, jsEvent, pos) {
                // console.log('eventClick', event, jsEvent, pos);
                console.log(event, 'event')
                this.allClick(event);
            },
            eventOver(event, jsEvent, pos) {
                // console.log('eventOver', event, jsEvent, pos);
                this.calRow = event;
                this.visibleRwDetail = true;
                this.visibleRwPosition.top = pos.top > (this.calHeight - 170) ? pos.top - 170 : pos.top;
                this.visibleRwPosition.left = pos.left < 0 ? 0 : pos.left;
            },
            eventLeave() {
                this.visibleRwDetail = false;
            },
            // 查看更多
            moreClick(day, events, jsEvent) {
                console.log('moreCLick', day, events, jsEvent)
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            toPdmRw(row) {
                let url = `/pdm/#//pdm/project/project?xmOid=${row.oidXm}`
                window.location.href = url;
            },
            toXmWt(item) {
                console.log(item)
                let obj = {
                    oidProgressFeedback: item.oid,
                    xmcode: item.xmcode,
                    xmname: item.xmname,
                    wbscode: item.wbscode,
                    rwname: item.rwname,
                    oidRw: item.oidRw,
                    oidXm: item.oidXm,
                    dataSecretLevcode: item.dataSecretLevcode
                }
                obj = {
                    oidProgressFeedback: item.oid,
                    oidRw: item.oidRw,
                }
                this.$router.push('/pms/gtgl/wtsbglFlow?fkdata=' + JSON.stringify(obj))
            },
            dotbg(item) {
                if (item.feedbackType == FKLX.ZCJZ) {
                    return 'dotblue'
                } else if (item.feedbackType == FKLX.YCFK) {
                    return 'dotorange'
                } else {
                    return 'dotred'
                }
            },
            jxTxt(row) {
                if (row.spzt == SPZT.WSP) {
                    return ""
                } else if (row.spzt == SPZT.SPZ) {
                    return "问题正在上报审批中，请等待处理意见！"
                } else {
                    return row.handlingOpinions
                }
            },
            query() {
                console.log(this.screenHeight)
                //获取查询框的值
                const queryParam = this.queryParam
                let iceQueryCondition = [{
                    column: 'oidXm',
                    exp: '=',
                    value: this.oidXm
                }, {
                    column: 'rwzt',
                    exp: '>',
                    value: RWZT.WXF
                }]
                if (queryParam != '') {
                    iceQueryCondition.push({
                        column: 'rwname',
                        exp: 'like',
                        value: queryParam
                    })
                }
                let columns = Object.keys(this.$refs.myWbsEdit.formModel)
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
                this.loading = true;
                this.pageList(query)
            },
            pageList(queryParam) {
                this.$axios.get("/pms/PmsWbs/treeList2", {params: queryParam})
                    .then(result => {
                        this.loading = false;
                        const data = result.data
                        this.tableData = data
                        this.$nextTick(() => {
                            if (this.$refs.xGrid) {
                                this.$refs.xGrid.setAllTreeExpansion(true)
                            }
                        })
                    })
            },
            // 获取所有任务
            getAllList() {
                let colums = Object.keys(this.$refs.myWbsEdit.formModel);
                let obj = {
                    colums,
                    conditions: [{column: "rwzt", exp: "in", value: "RWZT30,RWZT31,RWZT32,RWZT33"}],
                    size: 1000,
                    current: 1
                }
                this.$axios.get("/pms/PmsWbs/list", {params: obj})
                    .then(result => {
                        this.allList = result.data.records;
                    })
                    .catch(error => {
                        this.$message.error("保存失败")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },

            getInfoDate(tableData) {
                console.log(tableData)
                let xGrid = this.$refs.xGrid
                this.tableData = tableData
                xGrid.refreshData()
            },

            //刷新按钮方法
            refreshGrid() {
                this.query()
            },

            //项目树点击
            xmkNodeClick(id, row) {
                this.oidXm = id
                this.query()
            },
            jfwSubmit(row) {
                this.title = "上传交付物"
                let matchObj = this.$utils.findTree(this.tableData, item => item === row, this.treeConfig)
                let {item} = matchObj
                let cgydList = item.cgydList
                if (cgydList) {
                    cgydList.forEach(element => {
                        element.iscgjf = element.cgjf === whether.IS_YES
                    });
                }
                this.$refs.myWbsEdit.getWbsRwJfwParams(this.title, item, this.tableData)
            },
            // allClick
            allClick(row, type) {
                this.title = "上传交付物";

                let {item} = {item: row};
                let cgydList = item.cgydList
                if (cgydList) {
                    cgydList.forEach(element => {
                        element.iscgjf = element.cgjf === whether.IS_YES
                    });
                }
                this.$refs.myWbsEdit.getWbsRwJfwParams(this.title, item, this.tableData)
            },
            cellClick({row}) {
                console.log(row, 'row')
                this.row = row;
                if (row.rwfzrcode === this.currUser) {
                    this.isMyTask = true
                    this.oidRw = row.oid
                    this.queryWorkLog();
                } else {
                    this.isMyTask = false;
                }
            },
            queryWorkLog() {
                let iceQueryCondition = [{
                    column: 'oidRw',
                    exp: '=',
                    value: this.oidRw
                }]
                let columns = Object.keys(this.$refs.myWbsRwrz.formModel)
                const query = {columns, conditions: iceQueryCondition}
                this.$axios.get("/pms/PmsRwRz/getList", {params: query})
                    .then(result => {
                        const data = result.data
                        console.log(data)
                        this.logData = data
                    })
            },
            //工作日志
            workLog() {
                this.$refs.myWbsRwrz.getParentParams(this.row)
            },
            rwDelay(row) {
                this.$router.push({path: '/pms/xmgl/wbsChange', query: {oid: row.oid}})
            },
            cellClassName({row, rowIndex, column, columnIndex}) {
                if (column.property === "rwzt") {
                    return row.rwzt
                }
            },
            // 比较时间大小
            compareTime(d1, d2) {
                return new Date(d1).getTime() > new Date(d2).getTime();
            },

        },
        computed: {
            list() {
                let filterName = this.queryParam + ''.trim().toLowerCase()
                if (filterName) {
                    let searchProps = ['rwname', 'rwdept', 'rwfzr']
                    let rest = this.$utils.searchTree(this.tableData, item => searchProps.some(key => this.$utils.toString(item[key]).toLowerCase().indexOf(filterName) > -1), this.treeConfig);
                    rest.map(c => {
                        c.title = c.rwname;
                        c.start = c.dateJhStar;
                        c.end = c.dateJhEnd;
                    })
                    return rest
                }
                this.tableData.map(c => {
                    c.title = c.rwname;
                    c.start = c.dateJhStar;
                    c.end = c.dateJhEnd;
                })
                return this.tableData
            },
            allData() {
                let date = new Date();
                let obj = {
                    [RWZT.ZXZ]: "bg1",
                    [RWZT.ZT]: "bg2",
                    [RWZT.YQ]: "bg3",
                    [RWZT.BG]: "bg4",
                }
                console.log(obj)
                date.setDate(date.getDate() + fastDay);
                this.allList.map(c => {
                    c.title = c.rwname;
                    c.start = c.dateJhStar;
                    c.end = c.dateJhEnd;
                    let b = this.compareTime(date, c.dateJhEnd);
                    if (b && c.rwzt == RWZT.ZXZ) {
                        console.log(c, 'c')
                        c.cssClass = "bg5";
                    } else {
                        c.cssClass = obj[c.rwzt];
                    }

                })
                console.log(this.allList, 'this.allList')
                return this.allList
            },
            relateUsers() {
                return this.$userInfo.relateUsers
            },
            dataMapSecret() {

                let data = this.getDataMap()('DATA_SECRET_LEVEL');
                return data ? data : {};
            },
            dataMapFklx() {
                let data = this.getDataMap()('RW_FKLX');
                console.log(data, 'data')
                return data ? data : {};
            },
            dataMapSbzt() {
                let data = this.getDataMap()('SBZT');
                console.log(data, 'data')
                return data ? data : {};
            }
        },
        //这个是你引用插件生成的,不用管它
        components: {
            IceDialog,
            IceTree,
            WbsEdit,
            WbsRwrz,
            FullCalendar
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

    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;
        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }

    .logstatus {
        position: absolute;
        padding-top: 4px;
        top: 0;
        left: 180px;
        line-height: 1;
        font-size: 14px;
        color: #909399;
        .item {
            margin-right: 30px;
            float: left;
        }
        .dot {
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;

            vertical-align: middle;
            margin-right: 10px;
        }
        .dotblue {
            background: #00D1B2;
        }
        .dotred {
            background: #d11723;
        }
        .dotorange {
            background: #d1800f;
        }
    }

    .showRwDetail {
        position: absolute;
        top: 200px;
        left: 500px;
        z-index: 10000000;
        background: #fff;
        box-shadow: 1px 1px 6px 1px #aaa;
        border-radius: 5px;
        padding: 20px;
        .item {
            line-height: 25px;
            color: #444;
        }
    }

    .tabs {
        width: 100%;
        position: relative;
        height: 100%;
    }

    .vxe-full-main {
        flex-grow: 1;
        -ms-flex-negative: 1;
        flex-shrink: 1;
        position: relative;

        .vxe-full-container {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }
    }

    .colorStatus {
        display: flex;
        .itemColor {
            margin-right: 10px;
            display: flex;
            align-items: center;
            .c {
                width: 10px;
                height: 10px;
                margin-right: 5px;
                font-size: 12px;
            }
            .t {
                white-space: nowrap;
            }
        }
    }

    .bg1 {
        background: rgba(0, 187, 0, 0.5);
    }

    .bg2 {
        background: #bb2aa3;
        background: rgba(136, 136, 136, 0.5);
    }

    .bg3 {
        background: #e42712;
        background: rgba(228, 39, 18, 0.5);
    }

    .bg4 {
        background: #23a1bb;
        background: rgba(35, 161, 187, 0.5);
    }

    .bg5 {
        background: #ff7f11;
        background: rgba(225, 127, 17, 0.5);
    }
</style>
