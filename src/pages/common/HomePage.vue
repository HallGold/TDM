<template>
    <div class="home-div">
        <div class="home-container">
            <!--<home-header ref="header"></home-header>-->
            165165
            <v-head></v-head>
            <div class="ice-content">
                <div class="search">
                    <input type="text">
                    <button>搜索</button>
                </div>
                <div class="app app-ex">
                    <el-carousel :autoplay="false"
                                 style="width: 100%;height: 100%; flex-grow: 1; min-height: 315px; display: flex; flex-direction: column;justify-content:center">
                        <el-carousel-item v-for="(apps,index) in appsChild" :key="index"
                                          style="width: 100%;display: flex;flex-wrap:wrap;">
                            <div class="item" v-for="item in apps" :key="item.appId"
                                 @click="openApp(item.appId,item.url)">
                                <div><img :src="$showImage(item.smallIconUrl)"><span>{{item.appName}}</span></div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
                <div class="bottom">
                    <div class="notice">
                        <div class="title">
                            <div v-for="item in notice.title" @click="noticeTitleClick(item)"
                                 :class="item.type==notice.current?'item active':'item'">{{item.name}}
                            </div>
                            <!--<div class="item">我的申请</div>
                            <div class="item">通知公告</div>-->
                        </div>
                        <div class="notice_content">
                            <ul>
                                <li v-for="li in liData" @click="li.clickOpen(li)" :title="li.taskName">{{li.showName}}
                                    <span>{{li.beginTime}}</span></li>
                            </ul>
                        </div>
                    </div>
                    <div class="hot_service">
                        <div class="hottitle">热门服务</div>
                        <div class="hot">
                            <div class="item">
                                <div><img style="height: 60px;width: 60px"
                                          src="../../assets/img/home/ico/fuwutai.png"><span>建设中...</span></div>
                            </div>
                            <div class="item">
                                <div><img style="height: 60px;width: 60px"
                                          src="../../assets/img/home/ico/zizhufuwu.png"><span>建设中...</span></div>
                            </div>
                            <div class="item">
                                <div><img style="height: 60px;width: 60px"
                                          src="../../assets/img/home/ico/qingqiudengji.png"><span>建设中...</span></div>
                            </div>
                            <div class="item">
                                <div><img style="height: 60px;width: 60px"
                                          src="../../assets/img/home/ico/xinzengpeizhixiang.png"><span>建设中...</span>
                                </div>
                            </div>
                            <div class="item">
                                <div><img style="height: 60px;width: 60px"
                                          src="../../assets/img/home/ico/xinzengkuaijiexiang.png"><span>建设中...</span>
                                </div>
                            </div>
                            <!--            <div class="item">
                                            <div><img src="../../assets/img/home/ico/fuwutai.png"><span>服务台</span></div>
                                        </div>
                                        <div class="item">
                                            <div><img src="../../assets/img/home/ico/zizhufuwu.png"><span>自助服务</span></div>
                                        </div>
                                        <div class="item">
                                            <div><img src="../../assets/img/home/ico/qingqiudengji.png"><span>登记请求</span></div>
                                        </div>
                                        <div class="item">
                                            <div><img src="../../assets/img/home/ico/xinzengpeizhixiang.png"><span>新增配置项</span></div>
                                        </div>
                                        <div class="item">
                                            <div><img src="../../assets/img/home/ico/xinzengkuaijiexiang.png"><span>新增快捷项</span></div>
                                        </div>-->
                        </div>
                    </div>
                </div>
            </div>
            <div class="ice-footer">
                <div class="img"><img src="../../assets/img/home/底部.png"></div>
                <div class="icp">中国工程物理研究院化工材料研究所 版权所有</div>
            </div>
        </div>
    </div>

</template>

<script>

    import {mapActions, mapMutations} from 'vuex'
    // import homeHeader from '@/components/common/HomeHeader.vue';
    import vHead from '@/components/common/Header.vue';


    export default {
        name: "HomePage",
        data() {
            return {
                notice: {
                    current: 1,
                    title: [
                        {name: "我的待办", type: 1, loadData: this.myTask},
                        {name: "我的申请", type: 2, loadData: this.myApply},
                        /* {name: "我要抢单", type: 3, loadData: this.myPool}*/
                    ],
                },
                totalTask: 0,
                totalApply: 0,
                totalPool: 0,
                liData: [],
                userCards: [],
                appsChild: [],
                apps: []
            }
        },
        methods: {
            ...mapActions("menuStore", ['setActiveApp']),
            ...mapMutations('menuStore', ['collapseChage']),
            ...mapActions('permissionStore', ['openPageById']),
            noticeTitleClick(item) {
                this.notice.current = item.type;
                item.loadData();
            },
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
            async openApp(appId, indexUrl) {

                // this.setActiveApp(appcode);
                const menus = await this.setActiveApp(appId);

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

                    if (firstMenu) {

                        this.openPageById({
                            id: firstMenu.pageId, next: pageInfo => {
                                this.collapseChage(false);
                                this.$router.push({name: pageInfo.$url, params: {appId}});
                            }
                        });

                    }

                }

            },
            substrTask(list) {
                list.forEach(item => {
                    if (item.taskName.length > 38) {
                        item.showName = item.taskName.substr(0, 38) + "…";
                    } else {
                        item.showName = item.taskName;
                    }
                })
                return list;
            },
            myTask() {
                let staticConditions = [{column: "groupTask", exp: "!=", value: 1}, {
                    column: "status",
                    exp: "=",
                    value: 0
                }];
                this.$axios.get("/bpm/proTaskUser/myTask", {
                    params: {
                        current: 1,
                        size: 8,
                        staticConditions: staticConditions
                    }
                }).then(result => {
                    let data = result.data.records;
                    data.forEach(item => {
                        item.clickOpen = this.openMyTask;
                    })
                    this.liData = this.substrTask(data);
                    this.totalTask = result.data.total;
                })
            },
            myApply() {
                this.$axios.get("/bpm/pro/myApply", {params: {current: 1, size: 8}})
                    .then(result => {
                        let data = result.data.records;
                        data.forEach(item => {
                            item.taskName = item.bpmDefName + "[" + item.currentNodeName + "]";
                            item.clickOpen = this.openMyApply;
                        })
                        this.liData = this.substrTask(data);
                        this.totalApply = result.data.total;
                    })
            },
            myPool() {
                let staticConditions = [{column: "groupTask", exp: "=", value: 1}, {
                    column: "status",
                    exp: "=",
                    value: 0
                }];
                this.$axios.get("/bpm/proTaskUser/myTask", {
                    params: {
                        current: 1,
                        size: 8,
                        staticConditions: staticConditions
                    }
                })
                    .then(result => {
                        let data = result.data.records;
                        data.forEach(item => {
                            // item.taskName=item.bpmDefName;
                            item.clickOpen = this.openMyTask;
                        })
                        this.liData = this.substrTask(data);
                        this.totalPool = result.data.total;
                    })
            },
            myNotice() {

            },
            showApps() {
                this.$axios.get("/permission/auth/user/get_auth_applist")
                    .then(result => {
                        let num = Math.ceil(result.data.length / 12);//向上取整数
                        let data = [];
                        let child = [];
                        for (let i = 0; i < result.data.length; i++) {
                            child.push(result.data[i]);
                            if (child.length == 12) {
                                data.push(child);
                                child = [];
                            }
                        }
                        if (child.length > 0) {
                            data.push(child);
                        }
                        /* result.data.forEach(item=>{
                             if(data.length%12){
                                 data.push(item)
                             }
                         })*/
                        this.appsChild = data;
                        this.apps = result.data;
                    })
                    .catch(error => {
                        console.error(error)
                    })
            },
            initData() {
                //初始化我的待办
                this.myTask();
                //显示APP信息
                this.showApps();
            }
        },
        computed: {
            username() {
                return this.$userInfo.userName;
            },
            deptName() {
                return this.$userInfo.deptName;
            },
            relateUsers() {
                return this.$userInfo.relateUsers
            },
            ishome() {
                return this.$route.fullPath == '/home'
            }
        },
        watch: {},
        mounted() {
            this.initData();
        },
        components: {
            // homeHeader,
            vHead
        }
    }

</script>


<style lang="less" scoped>
    .ice-header {
        padding-left: 10%;
        padding-right: 10%;
    }
</style>

<style src="../../assets/css/home.css" scoped>

</style>

<style lang="less">
    .home-container .el-carousel__button {
        height: 8px !important;
        background-color: #0091b0 !important;
        border-radius: 4px;
    }

    .home-container .el-carousel__arrow {
        top: 48% !important;
    }

    .el-carousel__indicators--horizontal {
        bottom: 5px;
    }

    .home-container .app-ex {
        display: flex;
        flex-grow: 1;
        justify-content: center;
    }
</style>
