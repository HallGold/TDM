<template>
    <div class="wrapper">
        <v-head></v-head>
        <div class="home-content">
            <el-container style="height: 100%;width: 100%">
                <el-aside width="180px" style="height: 100%;overflow-x: hidden;background: #f2f2f2;"
                          v-loading="leftLoading">
                    <vue-scroll :ops="{bar:{background:'#fff',opacity:0}}">
                        <div class="application-list">
                            <div class="application-item" v-for="item in apps" :key="item.appId"
                                 @click="openApp(item.appId,item.url)">
                                <img :src="$showImage(item.smallIconUrl)"/>
                                <span>{{item.appName}}</span>
                            </div>
                        </div>
                    </vue-scroll>
                </el-aside>
                <el-main class="elmain">
                    <!-- <line-marker></line-marker> -->
                    <grid-layout
                            :layout.sync="userCards"
                            :colNum="4"
                            :responsive="false"
                            :cols="{ lg: 5, md: 4, sm: 3,xs:2}"
                            :breakpoints="{ lg: 1800, md : 1400, sm: 1000,xs:600}"
                            :row-height="30"
                            :is-draggable="false"
                            :is-resizable="true"
                            :is-mirrored="false"
                            :vertical-compact="true"
                            :margin="[10, 10]"
                            :use-css-transforms="true">
<!--                        <grid-item>-->
<!--                            <el-card style="height: 100%;width: 100%">-->
<!--                                <div>{{userCards}}</div>-->
<!--                            </el-card>-->
<!--                        </grid-item>-->
                        <grid-item v-for="item in userCards"
                                   v-if="item.isShow"
                                   :x="item.x"
                                   :y="item.y"
                                   :w="item.w"
                                   :h="item.h"
                                   :i="item.i" :key="item.i">
                            <el-card style="height: 100%;width: 100%" v-if="item.type!=='navigation'">
                                <div slot="header" class="clearfix" style="position: relative;">
                                    <template v-if="item.type==='gtasks'">
                                        <el-button style="position: absolute;top: 5px ;right: 5px;z-index: 100;"
                                                   @click="item.click" type="text">
                                            查看更多>>
                                        </el-button>
                                        <el-tabs style="width: 100%;" v-model="activeName">
                                            <el-tab-pane label="我的待办" name="first">
                                                <span slot="label"><i class="iconfont iconschedule"></i> 我的待办</span>
                                                <el-table class="item" :data="item.tasks" :show-header="true"
                                                          @row-click="item.openFlow">
                                                    <el-table-column prop="taskName"
                                                                     label="任务描述" align="left" width="450px"
                                                                     style="width:60%"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="beginTime"
                                                                     label="开始时间"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="nodeName"
                                                                     label="当前环节"></el-table-column>
                                                    <el-table-column prop="bizInfo"
                                                                     label="单号"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="已办理" name="second">
                                                <span slot="label"><i class="iconfont iconyiban"></i> 已办理</span>
                                                <el-table class="item" :data="haveDone" :show-header="true"
                                                          @row-click="item.openFlow">
                                                    <el-table-column prop="taskName"
                                                                     label="任务描述" align="left" width="450px"
                                                                     style="width:60%"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="beginTime"
                                                                     label="开始时间"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="nodeName"
                                                                     label="当前环节"></el-table-column>
                                                    <el-table-column prop="bizInfo"
                                                                     label="单号"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                            <el-tab-pane label="我的申请" name="three">
                                                <span slot="label"><i class="iconfont iconshenqing"
                                                                      style="font-size: 14px;"></i> 我的申请</span>
                                                <el-table class="item" :data="myApply" :show-header="true"
                                                          @row-click="toApply">
                                                    <el-table-column prop="bpmDefName"
                                                                     label="流程名称" align="left" width="450px"
                                                                     style="width:60%"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="currentNodeName"
                                                                     label="当前环节"></el-table-column>
                                                    <el-table-column :show-overflow-tooltip=true prop="beginTime"
                                                                     label="发起时间"></el-table-column>
                                                </el-table>
                                            </el-tab-pane>
                                        </el-tabs>
                                    </template>
                                    <template v-else-if="item.type==='msg'">
                                        <span>
                                            <i class="iconfont icontongzhi" ></i>
                                            {{item.name}}</span>
                                        <el-button style="float: right; padding: 3px 0" @click="item.click" type="text">
                                            查看更多>>
                                        </el-button>
                                        <el-table class="item" :data="item.tasks"
                                                  @row-click="item.openFlow">
                                            <el-table-column prop="msgTitle"
                                                             label="标题"></el-table-column>
                                            <el-table-column prop="createDate"
                                                             label="日期"></el-table-column>
                                        </el-table>
                                    </template>
                                    <template v-else-if="item.type==='myOperation'">
                                        <span>
                                            <i class="iconfont icon047stack"></i>
                                            {{item.name}}</span>
                                        <el-button style="float: right; padding: 3px 0" @click="item.click" type="text">
                                            查看更多>>
                                        </el-button>

<!--                                        <el-table class="item" :data="item.tasks" :show-header="true"-->
<!--                                                  :header-cell-style="{'text-align':'left'}"-->
<!--                                                  :cell-style="{'text-align':'center'}">-->
<!--                                            <el-table-column label="实验作业编号"-->
<!--                                                             prop="operationNumber"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="预约编号"-->
<!--                                                             prop="reservationNumber"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="预约日期"-->
<!--                                                             prop="createTime" a-->
<!--                                                             lign="center"></el-table-column>-->

<!--                                            <el-table-column label="期望完成时间"-->
<!--                                                             prop="sendSampleTime"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="样品编号"-->
<!--                                                             prop="sampleNumber"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="样品名称"-->
<!--                                                             prop="sampleName"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="检测项目"-->
<!--                                                             prop="projectName"-->
<!--                                                             align="center"></el-table-column>-->

<!--                                            <el-table-column label="实验类型"-->
<!--                                                             prop="experimentType"-->
<!--                                                             align="center">-->
<!--                                                <template slot-scope="scope">-->
<!--                                                    <span :style="getBack(scope.row.reservationType)" >{{getBackName(scope.row.reservationType)}}</span>-->
<!--                                                </template>-->
<!--                                            </el-table-column>-->

<!--                                            <el-table-column label="检验设备"-->
<!--                                                             prop="equipmentName"-->
<!--                                                             align="center"></el-table-column>-->
<!--                                        </el-table>-->

                                        <ice-query-grid title="实验作业管理"
                                                        :gridData="item.tasks"
                                                        :pagination="false"
                                                        :parHeight="216"
                                                        :columns="columns"
                                                        ref="grid"
                                                        chooseItem="single"
                                                        :gridIndex="true"></ice-query-grid>
                                    </template>
                                </div>
<!--                                <template v-for="da in item.tasks">-->
<!--                                    <div v-if="item.type=='resAnnount'"-->
<!--                                         style="border-bottom: solid 1px #dcdfe6;padding:5px;">-->
<!--                                        <i class="el-icon-time"></i>-->
<!--                                        <el-link type="primary" @click="openResAnnount(da)">{{ da.title }}</el-link>-->
<!--                                    </div>-->
<!--                                </template>-->
                            </el-card >
                            <el-card style="height: 100%;width: 100%" v-else="item.type==='navigation'">
                                <div class="application-item-nav" v-for="nav in item.navigations" @click="hotKey(nav.url)" v-if="nav.isShow">
                                    <el-badge :value="nav.msgNum" class="item">
                                        <img :src="tdmShowImage(nav.icon)"/>
                                    </el-badge>
                                    <span>{{nav.name}}</span>
                                </div>
                            </el-card >
                        </grid-item>
                    </grid-layout>

                </el-main>
            </el-container>
        </div>
        <ice-dialog title="反馈" :visible.sync="visibleFeedback" width="800px">
            <el-input type="textarea" v-model="feedbackModel.feedback"></el-input>
            <div class="ice-button-bar">
                <el-button type="primary" @click="feedback">确认</el-button>
                <el-button type="info" @click="visibleFeedback=false">关闭</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="消息通知" :visible.sync="msgvisible" width="800px">
            <el-form>
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息标题：" label-width="110px">
                            {{msgDetail.msgTitle}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="发送人：" label-width="110px">
                            {{msgDetail.userCodeFrom}}
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第六行-->
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="消息内容：" label-width="110px">
                            <div style="border: 1px solid #ddd;min-height: 100px;max-height: 300px;overflow: auto;padding: 0 20px;">
                                {{msgDetail.msgContent}}
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="info" @click="msgvisible=false" ctrlCode="return">返回</el-button>
                    </div>
                </el-row>
            </el-form>
        </ice-dialog>

        <!--     <res-announcement-view title="公告" ref="viewann"></res-announcement-view>-->
    </div>
</template>

<script>

    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import vHead from '@/components/common/Header.vue';
    import VueScroll from 'vuescroll'
    import VueGridLayout from 'vue-grid-layout';
    import Schart from 'vue-schart';
    import ResAnnouncementView from "./resmsg/ResAnnouncementView";
    import {mapActions, mapMutations, mapState, mapGetters} from 'vuex'


    export default {
        name: "UserHome",
        data() {


            return {
                visibleFeedback: false,
                feedbackContent: '',

                feedbackModel: {
                    id: '',
                    feedback: '',
                },
                columns:[

                    {
                        label: "实验作业编号",
                        code: "operationNumber",
                        align: "center",
                    },
                    {
                        label: "预约编号",
                        code: "reservationNumber",
                        align: "center",
                    },
                    {
                        label: "预约日期",
                        code: "createTime",
                        align: "center",
                    },
                    {
                        label: "期望完成时间",
                        code: "sendSampleTime",
                        align: "center",
                    },
                    {
                        label: "样品编号",
                        code: "sampleNumber",
                        align: "center",
                    },
                    {
                        label: "样品名称",
                        code: "sampleName",
                        align: "center",
                    },
                    {
                        label: "检测项目",
                        code: "projectName",
                        align: "center",
                    },
                    {
                        label: "实验类型",
                        code: "experimentType",
                        align: "center",
                        formatter: (data) => {
                            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
                            let obj = {
                                color: '#fff',
                                background: color[data.reservationType],
                                fontSize: '10px',
                                padding: '2px 5px',
                                borderRadius: '2px'
                            }
                            return <span style={obj}>{data.reservationType == 1 ? '自主' : data.reservationType == 2 ? "委托" : "生产"}</span>
                        }
                    },
                    {
                        label: "检验设备",
                        code: "equipmentName",
                        align: "center",
                    },
                ],
                activeName: 'first',
                activeName1: 'first',
                leftLoading: false,
                scrwDataSource: [],
                navigation: {
                    name: '导航',
                    "x": 0,
                    "y": 0,
                    "w": 5,
                    "h": 3,
                    "i": "d",
                    type: 'navigation',
                    loadUrl: '',
                    more: '',
                    isShow: false,
                    navigations:[
                        {
                            name:"实验预约",
                            icon:"/static/yy.png",
                            url:"/tdm/#/tdm/reservationLedger",
                            code:"HOME_SYYY_ICON",
                            isShow: false,
                            isMsg: false,
                        },{
                            name:"送样",
                            icon:"/static/souyang.png",
                            url:"/tdm/#/tdm/sendSamples",
                            code:"HOME_YYSY_ICON",
                            isShow: false,
                            //消息个数
                            msgNum:'',
                        },{
                            name:"受理",
                            icon:"/static/sl.png",
                            url:"/tdm/#/tdm/AcceptanceLedger",
                            code:"HOME_YYSL_ICON",
                            isShow: false,
                            //消息个数
                            msgNum:'',
                        },{
                            name:"指派",
                            icon:"/static/zp.png",
                            url:"/tdm/#/tdm/ProductionAssign",
                            code:"HOME_SCRWZP_ICON",
                            isShow: false,
                            //消息个数
                            msgNum:'',
                        },{
                            name:"调度",
                            icon:"/static/dd.png",
                            url:"/tdm/#/tdm/dispatchRoster",
                            code:"HOME_DDPB_ICON",
                            isShow: false,
                            //消息个数
                            msgNum:'',
                        },{
                            name:"实验",
                            icon:"/static/sy.png",
                            url:"/tdm/#/tdm/experimentAssignment",
                            code:"HOME_SYRYJCYS_ICON",
                            isShow: false,
                            //消息个数
                            msgNum:'',
                        },{
                            name:"实验报告",
                            icon:"/static/sybg.png",
                            url:"/tdm/#/tdm/experimentalReport",
                            code:"HOME_SYBGWXZ_ICON",
                            isShow: false,
                            isMsg: false,
                        },{
                            name:"余样处理",
                            icon:"/static/yycl.png",
                            url:"/tdm/#/tdm/RemainingSample",
                            code:"HOME_YYCL_ICON",
                            isShow: false,
                            isMsg: false,
                        },{
                            name:"设备复核",
                            icon:"/static/sbfh.png",
                            url:"/tdm/#/tdm/equipmentReview",
                            code:"HOME_SBFH_ICON",
                            isShow: false,
                            isMsg: false,
                        },{
                            name:"样品收样",
                            icon:"/static/ypsy.png",
                            url:"/tdm/#/tdm/SampleRegister",
                            code:"HOME_YPSY_ICON",
                            isShow: false,
                            isMsg: false,
                        },{
                            name:"样品领样",
                            icon:"/static/ypsoy.png",
                            url:"/tdm/#/tdm/receiveSampleRegister",
                            code:"HOME_YPLY_ICON",
                            isShow: false,
                            isMsg: false,
                        }
                    ],


                },
                operation:{
                    name: '我的作业',
                    "x": 0,
                    "y": 2,
                    "w": 5,
                    "h": 7,
                    "i": "x",
                    type: 'myOperation',
                    code: "HOME_MYZY_MODE",
                    loadUrl: '',
                    more: '',
                    tasks: [],
                    isShow: false,
                    openFlow: this.openMyProject,
                    click: (row) => {
                        window.location.href = '/tdm/#/tdm/experimentAssignment'
                    }
                },
                msg:{
                    name: '通知',
                    "x": 3,
                    "y": 1,
                    "w": 1,
                    "h": 10,
                    "i": "2",
                    type: 'msg',
                    loadUrl: '',
                    more: '',
                    isShow: true,
                    openFlow: this.openMyTask,
                    click: () => {
                        // this.$router.push("/system/inform");
                        window.location.href = '/tdm/#/system/inform'
                    }
                },
                userCards: [
                    {
                        name: '我的待办',
                        "x": 0,
                        "y": 1,
                        "w": 5,
                        "h": 10,
                        "i": "myTask",
                        type: 'gtasks',
                        loadUrl: '',
                        code: "HOME_TASK_MODE",
                        more: '',
                        tasks: [],
                        isShow: false,
                        openFlow: this.openMyTask,
                        click: () => {
                            if (this.activeName == 'three') {
                                this.$router.push("/myApply");
                            } else {
                                this.$router.push("/myTask");
                            }

                        }
                    },
                ],
                waitTasks: [],
                userCode: 'tianding',
                apps: [],
                // 已办记录
                haveDone: [],
                // 查看通知弹窗
                msgvisible: false,
                msgDetail: {},
                noShowRoleCode: [],
                // 判定是否存在隐藏部分展示角色
                panding: [],
                // 我的申请
                myApply: [],
                //当前用户的角色
                roleCodes:[]
            }
        },
        methods: {
            getBackName(type){
                 if(type==1){
                     return '自主';
                 }else if(type==2){
                     return '委托';
                 }else{
                     return '生产';
                 }
            },
            getBack(type){
                let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
                let back = {
                    color: '#fff',
                    background: color[type],
                    fontSize: '10px',
                    padding: '2px 5px',
                    borderRadius: '2px'
                }
                return back;
            },

            tdmShowImage(url){
                return "../tdm"+url;
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', ['getDataMap']),
            // 获取禁止展示我的项目，我的科研任务，我的生产任务 角色编码集合
            getnoShowRole() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("permission/app_constant/byCode", {
                        params: {
                            appCode: 'SYSTEM_COMMON_90',
                            code: 'NO_SHOW_HOME_ROLE'
                        }
                    })
                        .then(result => {
                            if (result.data) {
                                this.noShowRoleCode = result.data.value.split(',').map((c) => {
                                    return c.trim();
                                });
                            } else {
                                this.noShowRoleCode = result.data;
                            }
                            resolve(result.data);
                        })
                        .catch(error => {
                            console.log('获取失败');
                        })
                })
                // console.log(this.getAppMenus(this.getAppCode), 'getAppMenus')

            },
            handleClickException(row) {
                this.$axios.post("/pms/PmsCpkGx/receive", {id: row.gxid})
                    .then(result => {
                        this.initScjh();
                    });
            },

            showFeedback(row) {
                this.feedbackModel.id = row.gxid;
                this.visibleFeedback = true;
            },

            feedback() {
                if (!this.feedbackModel.feedback) {
                    this.$alert("请输入反馈内容", "提示");
                    return;
                }
                this.$axios.post("/pms/PmsCpkGx/feedback", this.feedbackModel)
                    .then(result => {
                        this.visibleFeedback = false;
                        this.initScjh();
                    })
            },

            initScjh() {
                this.$axios.get("/pms/PmsScJh/listShowScjh", {
                    params: {
                        current: 1,
                        size: 5,
                        columns: ['name', 'jhsl', 'gxdept', 'startendtime', 'gxid', 'gxtype']
                    }
                })
                    .then(result => {
                        let data = result.data.records;
                        this.scrwDataSource = data;
                    })
            },

            ...mapActions("menuStore", ['setActiveApp']),
            ...mapMutations('menuStore', ['collapseChage']),
            ...mapActions('permissionStore', ['openPageById']),
            loadResAnnount() {
                //循环加载数据
                this.userCards.forEach((item, index) => {
                    if (item.type != 'resAnnount') {
                        return;
                    }
                    this.$axios.get(item.loadUrl, {params: {current: 1, size: 5}})
                        .then(result => {
                            let data = result.data.records;
                            this.userCards[index].tasks = data;
                        });
                });
            },
            openResAnnount(da) {
                this.$refs.viewann.open(da);
            },
            openMyTask(data) {
                let url = "/basic/ServiceFlowTets";
                if (data.formId) {
                    url = data.formId;
                    let sys = url.slice(1).split("/")[0];
                    if (sys == 'pdm') {
                        window.location.href = "/" + sys + "/#" + data.formId;
                    }
                }
                if (data.msgTitle) {
                    this.lookMsg(data);
                    return
                }
                if (url.indexOf("?") == -1) {
                    url += "?";
                }
                if (url.indexOf("actInstId") == -1) {
                    if (data.actInstId) {
                        url += "&actInstId=" + data.actInstId + "&taskUserId=" + data.oid;
                    }
                }

                this.$router.push(this.$routerCheckPush(data.assignerId, url));
                //this.$router.push(url);
            },
            toApply(data) {
                this.$router.push(data.formId);
            },
            // 查看通知详情
            lookMsg(data) {
                console.log('查看通知详情', data);
                this.msgDetail = data;
                this.msgvisible = true;
                this.handleLookConfirm(data);

            },
            handleLookConfirm(data) {
                this.$axios.post("pms/ResMsg/ack", {"id": data.oid}).then(result => {
                    // this.msgvisible = false;
                    this.getMsgList();
                }).catch(error => {

                        this.$message.error("错误")
                    }
                )
            },
            getMsgList() {
                let staticConditions2 = [{column: "sr", exp: "=", value: 1}, {column: "ifRead", exp: "=", value: 0}];
                this.$axios.get("/pms/ResMsg/list", {
                    params: {
                        current: 1,
                        size: 5,
                        staticConditions: staticConditions2,
                        columns: ['oid', 'msgTitle', 'createDate', 'userCodeFrom', 'userCodeTo', 'msgContent'],
                        conditionLink: 'AND',
                    }
                })
                    .then(result => {
                        let data = result.data.records;
                        data.map(o => {
                            o.createDate = o.createDate.substring(0, 10)
                        });
                        this.msg = data;
                        this.userCards[1].tasks = data;
                        // this.userCards.push(this.msg);
                        console.log("=======",this.userCards);
                    })
            },
            openMyApply(data) {
                let url = "/basic/ServiceFlowTets";
                if (data.formId) {
                    url = data.formId;
                }
                if (url.indexOf("?") == -1) {
                    url += "?";
                }
                if (url.indexOf("actInstId") == -1) {
                    if (data.actInstId) {
                        url += "&actInstId=" + data.actInstId;
                    }
                }
                this.$router.push(url);
            },

            openMyProject(data) {
                this.$router.push('/pms/xmgl/Xminfo?prev=home&oid=' + data.oid);
            },

            openMyWbs(row) {
                window.location.href = '/pms/#/pms/xmgl/wbsdetail?wbsoid=' + row.oid

            },
            taskMore(row) {
                if (row.gxtype === 'GXTYPE01') {
                    window.location.href = '/mes/#/mes/ptm/planResolveArrange'
                } else {
                    window.location.href = '/mes/#/mes/ptm/detectionPlan'
                }

            },
            hotKey(url) {
                window.location.href = url;
            },
            async openApp(appcode, indexUrl) {
                // this.setActiveApp(appcode);
                const menus = await this.setActiveApp(appcode);

                if (menus) {
                    const loadFirstMenu = (menusList) => {
                        if (menusList && menusList.length > 0) {
                            const firstMenu = menusList[0];
                            if (firstMenu.children && firstMenu.children.length > 0) {
                                return loadFirstMenu(firstMenu.children)
                            } else {
                                return firstMenu
                            }
                        }
                    }

                    const firstMenu = loadFirstMenu(menus);
                    // return

                    if (firstMenu) {
                        this.openPageById({
                            id: firstMenu.pageId, next: pageInfo => {
                                this.collapseChage(false);
                                //this.$router.push(pageInfo.$url);
                                let p = pageInfo.$url.split("/")[1];
                                if (p == 'system') {
                                    this.$router.push(pageInfo.$url);
                                } else if (p == 'qis') {
                                    let url = "/pms/#" + pageInfo.$url;
                                    window.location.href = url;
                                } else if (p == 'pdm') {
                                    let url = "/pdm/#" + pageInfo.$url;
                                    window.location.href = url;
                                } else if (p == 'capp') {
                                    let url = "/pdm/#" + pageInfo.$url;
                                    window.location.href = url;
                                } else if (p == 'mes') {
                                    let url = "/mes/#" + pageInfo.$url;
                                    window.location.href = url;
                                } else if (p == 'auditlog') {
                                    this.$router.push(pageInfo.$url);
                                } else {
                                    let url = "/" + p + "/#" + pageInfo.$url;
                                    window.location.href = url;
                                }
                            }
                        });

                    }

                }

            },


            myOperation(){
                this.$axios.get("tdm/experiment/list", {params: {current:1,size: 5,status:1}})
                    .then(result => {
                       if(result.data){
                           let data = result.data.records;
                           this.operation.tasks = data;
                           //this.userCards.push(this.operation);
                       }
                    }).catch(error => {
                        console.log('获取失败');
                    })
            },
            //拉取所有图标角色
            getConstantCodeList(codes){
                return new Promise((resolve, reject) => {
                    this.$axios.get("/tdm/base/getConstantList", {params: {codes:codes}})
                        .then(result => {
                            if(result.data){
                                resolve(result.data);
                            }
                        }).catch(error => {
                        console.log('获取失败');
                    })
                })
            },
            // 获取用户当前生效的角色(从权限缓存中读取)
            getUserRole() {
                return new Promise((resolve, reject) => {
                    this.$axios.get("permission/user/get_valid_roles", {params: {userCode: this.userInfo.userCode}})
                        .then(result => {
                            resolve(result.data);
                        }).catch(error => {
                        console.log('获取失败');
                    })
                })

            },
            //获取当前用户 需要执行的任务数量
            getCurrentUserNodeMsg(){
                return new Promise((resolve, reject) => {
                    this.$axios.get("tdm/base/getCurrentUserNodeMsg")
                        .then(result => {
                            resolve(result.data);
                        }).catch(error => {
                          console.log('getCurrentUserNodeMsg 获取失败');
                    })
                })
            },
            //判断当前用户 显示的图标
            showIcon(constantCode,resRoles){
                let isShow = false;
                for (let i in this.navigation.navigations) {
                    //图标对象
                    let icon = this.navigation.navigations[i];
                    //图标对应的角色code
                    let iconRoles;
                    for (let f in constantCode){
                        let constant = constantCode[f];
                        if(constant.code == icon.code){
                            iconRoles = constant.value;
                        }
                    }
                    //角色code不为空
                    if(iconRoles){
                        //查询当前用户是否有显示图标的角色
                        for (let r in resRoles){
                            let roles = resRoles[r];
                            if(iconRoles.indexOf(roles.code)!=-1){
                                icon.isShow = true;
                                isShow = true;
                            }
                        }
                    }

                }
                this.navigation.isShow = isShow;
                if(isShow){
                    this.userCards.push(this.navigation);
                }
            },
            // 模块显示
            modeShow(constantCode,resRoles){
                this.userCards.push(this.operation);
                let models = this.userCards;
                for (let i in models) {
                    //模块对象
                    let mode = models[i];
                    //模块对应的角色code
                    let modeRoles;
                    for (let f in constantCode){
                        let constant = constantCode[f];
                        if(constant.code == mode.code){
                            modeRoles = constant.value;
                        }
                    }
                    //角色code不为空
                    if(modeRoles){
                        //查询当前用户是否有显示模块的角色
                        for (let r in resRoles){
                            let roles = resRoles[r];
                            if(modeRoles.indexOf(roles.code)!=-1){
                                mode.isShow = true;
                            }
                        }
                    }
                }
                console.log("models",models);
            }
        },
        computed: {
            ...mapState('userinfoStore', ['userInfo']),
            datamap() {
                // let datamap = this.$store.state.datamapStore.datamap[this.mapTypeCode];
                return this.getDataMap()('XMLB');
            }
        },
        watch: {},
        created() {
            this.myOperation();
            //拉取常量
            this.getConstantCodeList().then(constantCode => {
                //拉取角色
                this.getUserRole().then(resRoles => {
                    //判断图标显示
                    this.showIcon(constantCode,resRoles);
                    //模块显示
                    this.modeShow(constantCode,resRoles)
                })
            })

            //获取节点消息个数
            this.getCurrentUserNodeMsg().then(nodeMsgs =>{
                for (let i in this.navigation.navigations) {
                    //图标对象
                    let icon = this.navigation.navigations[i];
                    for (let j in nodeMsgs) {
                        let nodeNum = nodeMsgs[j];
                        if(nodeNum.nodeCode === icon.code){
                            if(nodeNum.num!=0){
                                icon.msgNum = nodeNum.num;
                            }
                        }
                    }
                }
            })
            this.addUndoTypeCodes('XMLB');

        },
        mounted() {

            this.leftLoading = true;
            //初始化我的待办
            let staticConditions = [{column: "groupTask", exp: "!=", value: 1}, {column: "status", exp: "=", value: 0}];
            this.$axios.get("/bpm/proTaskUser/myTask", {
                params: {
                    current: 1,
                    size: 5,
                    staticConditions: staticConditions
                }
            }).then(result => {
                let data = result.data.records;
                this.userCards[0].tasks = data;
            })

            // 初始化我的已办
            let staticConditions1 = [{column: "groupTask", exp: "!=", value: 1}, {
                column: "status",
                exp: "=",
                value: 1
            }];
            this.$axios.get("/bpm/proTaskUser/myTask", {
                params: {
                    current: 1,
                    size: 5,
                    staticConditions: staticConditions1,
                    groupTask: 1,
                    status: 1,
                    conditionLink: 'AND',
                }
            }).then(result => {
                let data = result.data.records;
                this.haveDone = data;
            })
            //初始化我的申请
            /*this.$axios.get("/bpm/pro/myApply", {params: {current: 1, size: 5}})
                .then(result => {
                    let data = result.data.records;
                    this.userCards[1].tasks = data;
                })*/
            //初始化任务池
            staticConditions = [{column: "groupTask", exp: "=", value: 1}, {column: "status", exp: "=", value: 0}];
            this.$axios.get("/bpm/proTaskUser/myTask", {
                params: {
                    current: 1,
                    size: 5,
                    staticConditions: staticConditions
                }
            }).then(result => {
                let data = result.data.records;
                //this.userCards[2].tasks = data;
            })
            let staticConditions2 = [{
                column: "afStatus",
                exp: "=",
                value: 1
            }];
            this.$axios.get("/bpm/pro/myApply", {
                params: {
                    current: 1,
                    size: 5,
                    staticConditions: staticConditions2,
                    afStatus: 1,
                    conditionLink: 'AND',
                    columns: ['oid', 'formId', 'bizInfo', 'actDefKey', 'bpmDefName', 'currentNodeName', 'beginTime', 'endTime', 'afStatus']
                }
            }).then(result => {
                this.myApply = result.data.records;
            })
                .catch(error => {
                    console.error(error)
                })


            // 获取我的申请
            this.$axios.get("/permission/auth/user/get_auth_applist")
                .then(result => {
                    this.leftLoading = false;
                    this.apps = result.data;
                })
                .catch(error => {
                    console.error(error)
                })
            // 获取通知
            this.getMsgList();

            /*this.$axios.get("/pms/PmsScJh/listShowScjh", {params: {
                    current: 1,
                    size: 5,
                    columns: ['name','jhsl','gxdept','startendtime','gxid']
                }})
                .then(result => {
                    let data = result.data.records;
                    this.scrwDataSource = data;
                })*/
            //初始化通知卡片
            /*this.$axios.get("/resources/ResAnnType/all")
                .then(result => {
                    result.data.forEach(item => {
                        this.userCards.push({
                            code: item.code,
                            name: item.name,
                            "x": 3,
                            "y": 0,
                            "w": 1,
                            "h": 6,
                            "i": "3",
                            type: 'resAnnount',
                            loadUrl: '/resources/ResAnnouncement/read?annTypeCode=' + item.code,
                            tasks: [],
                            more: '',
                            openFlow: this.openMyTask,
                            click: () => {
                                this.$router.push('/common/resAnnouncement')
                            }
                        });
                    });
                    this.loadResAnnount();
                })
                .catch(error => {
                    console.error(error)
                })*/
        },
        components: {
            ResAnnouncementView,
            vHead,
            VueScroll,
            GridLayout: VueGridLayout.GridLayout,
            GridItem: VueGridLayout.GridItem,
            Schart,
            IceQueryGrid
        }
    }

</script>


<style lang="less" scoped>
    // 引入图标
    @import "../../assets/icon/iconfont.css";

    /* .item {
         !* background: red;*!
         position: absolute;
         top: 0;
         bottom: 0;
         left: 0;
         right: 0;
         margin: auto;
         height: 100%;
         width: 100%;
     }*/

    .home-content {
        width: 100%;
        position: absolute;
        top: 70px;
        bottom: 0;
        left: 0;
        .elmain {
            padding: 5px;
        }
        .application-list {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            /* display: flex;*/
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            border-right: 1px solid #f4ebee;
            background: #f2f2f2;
            /*background: #f4ebee;*/

            .application-item {
                display: flex;
                width: 140px;
                height: 140px;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                margin: 0 auto;

                img {
                    cursor: pointer;
                    height: 60px;
                    width: 60px;
                    transition: all 0.4s ease-out;
                    border-radius: 60px;
                }

                /*img:hover {*/
                /**/
                /*}*/

                span {
                    text-align: center;
                    font-size: 16px;
                    margin-top: 10px;
                    font-family: microsoft yahei;
                    transition: all 0.4s ease-out;
                }
                &:hover {
                    img {
                        transform: scale(1.2);
                    }
                    span {
                        color: #09f305;
                    }
                }

            }



        }

    }
    .application-item-nav {
        margin-right: 20px;
        margin-top: 21px;
        display: flex;
        width: 90px;
        height: 60px;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        float: left;
        img {
            cursor: pointer;
            height: 50px;
            width: 50px;
            transition: all 0.4s ease-out;
            border-radius: 50%;
        }

        /*img:hover {*/
        /**/
        /*}*/

        span {
            text-align: center;
            font-size: 16px;
            //margin-top: 10px;
            font-family: microsoft yahei;
            transition: all 0.4s ease-out;
        }
        /*&:hover {*/
        /*    img {*/
        /*        transform: scale(1.2);*/
        /*    }*/
        /*    span {*/
        /*        color: #0091B0;*/
        /*    }*/
        /*}*/

    }

    .home-content /deep/ .el-card__header {
        padding: 10px;
    }

    .home-content /deep/ .el-card__body {
        padding: 10px;
    }

    .clearfix {
        span {
            font-weight: bold;
        }
    }
</style>
