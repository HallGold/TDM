<template>

    <el-container style="background: white;">
        <el-header class="application-rep-head">
            <div class="soft-float-right"
                 style="width: calc(34%);padding-top: 14px;display: flex;justify-content: flex-end">
                <el-input
                        placeholder="关键字搜索" style="width: 100%;"
                        v-model="inptKeyword" @keyup.enter.native="load({},true,null)">
                    <i class="el-icon-search el-input__icon" style="cursor: pointer" slot="suffix"
                       @click="load({},true,null)"></i>
                    <!--  <el-button icon="el-icon-search"></el-button>-->
                    }
                </el-input>
                <el-dropdown slot="append" placement="bottom" @command="handleMenuCommand">
                    <el-button>
                        更多<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="order:grade">按评分排序</el-dropdown-item>
                        <el-dropdown-item command="order:down">按下载量排序</el-dropdown-item>
                        <el-dropdown-item command="install" divided>我的安装申请</el-dropdown-item>
                        <el-dropdown-item command="history">我的下载历史</el-dropdown-item>
                        <el-dropdown-item command="auth">我的授权软件</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-button type="text" class="el-icon-d-arrow-right soft-float-right"
                           @click="$router.push('/biz/software/applicationinstall')">没有找到？点这里
                </el-button>
                <!--<el-button  icon="el-icon-search"></el-button>-->

            </div>
            <div class="soft-float-left" style="width: calc(66%);overflow-y: hidden;height: 58px;display: flex">

                <!--:default-active="activeIndex"-->
                <div class="pre" @click="pre" v-show="topOffset>0">
                    <i class="el-icon-d-arrow-left"></i>
                </div>
                <div id="el-menu-nav" style="flex-grow: 1">
                    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect"
                             :style="{top:-topOffset+'px'}" ref="menus">
                        <el-menu-item index="">
                            <div class="menu-item">全部</div>
                        </el-menu-item>

                        <template v-for="(item,index) in navs">

                            <el-menu-item :index="item.classifyIdPath" v-if="item.children.length == 0">
                                <div class="menu-item">
                                    {{item.classifyName}}
                                </div>
                            </el-menu-item>

                            <el-submenu :index="item.classifyIdPath" v-if="item.children.length > 0">
                                <div class="menu-item" slot="title">{{item.classifyName}}</div>
                                <el-menu-item :index="chitem.classifyIdPath" v-for="(chitem,chindex) in item.children">
                                    <!--  <div class="menu-item"> -->{{chitem.classifyName}}<!--</div>-->
                                </el-menu-item>
                            </el-submenu>

                        </template>
                    </el-menu>
                </div>
                <div class="next" @click="next" v-show="topOffset<(menusRows-1)*60">
                    <i class="el-icon-d-arrow-right"></i>
                </div>
                <!-- <div style="width: 40px;display: flex;justify-content: center;align-items: center;flex-basis: 40px">
                     <div style="font-size: 15px;color: #d81902;cursor: pointer;"
                          @click="moreMenuFun()">
                         &lt;!&ndash;{{this.moreMenu}}&ndash;&gt;<i
                             :class="(this.moreMenu == 'next'?'el-icon-d-arrow-right':'el-icon-d-arrow-left')+' el-icon&#45;&#45;right'">更多</i>
                     </div>
                 </div>-->
            </div>

        </el-header>
        <el-main style="position: relative;" v-loading="loading" element-loading-text="拼命加载中">
            <div class="ice-full-absolute">
                <vue-scroll :ops="{bar:{background:'#000',opacity:0.4,keepShow:true}}" @handle-scroll="handleScroll">
                    <div style="width: 100%;display: flex;flex-wrap: wrap;justify-content: flex-start">
                        <div style="width: 20%;" v-for="(item,index) in dataPages"
                             :key="item.softwareId + item.fileId">
                            <el-card class="soft-main-ctx" style="height: 110px;"
                                     :body-style="{ padding: '0px',width:'100%',height:'100%',display:'flex' }">
                                <div class="soft-left-ctx" @click="showDetails(item)">
                                    <img class="soft-icon" :src="$showImage(item.softIconId)">
                                    <div>
                                        <el-button class="soft-float-right" size="mini" icon="el-icon-download"
                                                   round @click.stop="downLoadVis(item)"
                                                   v-if="item.downloadAuthResult == 1">下载
                                        </el-button>
                                        <el-tooltip content="点我办理授权" placement="top" effect="light"
                                                    class="soft-float-right">
                                            <el-button size="mini" round
                                                       v-if="item.downloadAuthResult == 0"
                                                       @click.stop="accreditSoftware(item.oid)">需授权
                                            </el-button>
                                        </el-tooltip>
                                    </div>
                                </div>
                                <div class="soft-right-ctx">
                                    <div>
                                        <!--        <el-tooltip :content="`${item.softName}`" placement="bottom" effect="light">-->
                                        <div class=" soft-title" :title="item.softName"
                                             @click="showDetails(item)">
                                            {{item.softName}}
                                        </div>
                                        <!--  </el-tooltip>-->
                                        <!--<div>{{item.softName}}</div>-->
                                        <div class="soft-size soft-ellipsis" :title="item.softVersion">
                                            版本：{{item.softVersion}}
                                        </div>
                                    </div>
                                    <div>
                                        <!-- <el-ratege
                                                 disabled
                                                 show-score
                                                 text-color="#ff9900"
                                                 :value="item.gradeTotal">
                                         </el-ratege>-->
                                    </div>
                                    <div>
                                        <div class="soft-float-left">
                                            <div class="soft-size soft-down soft-ellipsis">
                                                大小：{{fileSizeFormat(item.softSize)}}
                                            </div>
                                            <div class="soft-size soft-down soft-ellipsis">
                                                下载次数：{{item.downloadTotal}}次
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </el-card>
                        </div>
                        <div style="margin: auto;width: 420px;height: 400px;padding-top: 50px"
                             v-if="dataPages.length==0">
                            <img src="@/assets/img/none.png">
                            <el-button type="text" style="margin: auto;display: block;font-size: 16px;"
                                       @click="$router.push('/biz/software/applicationinstall')">没有找到哦，点我去申请>>
                            </el-button>
                        </div>
                    </div>
                </vue-scroll>
            </div>


        </el-main>
        <ice-dialog title="软件详情" :visible.sync="show2" remounted
                    width="680px">
            <div class="ice-container" style="display: inline-block">

                <ice-grid-layout :columns="0" name="软件基本信息" :expandable="false">
                    <div class="soft-detail-left-ctx soft-float-left">
                        <img class="soft-icon" style="width: 90px;height: 90px"
                             :src="$showImage(detailsData.softIconId)">
                    </div>
                    <div class="soft-detail-right-ctx soft-float-right">
                        <div class="soft-detail-title">
                            <div>{{detailsData.softName}}</div>
                            <div class="soft-detail-size">版本:{{detailsData.softVersion}}</div>
                        </div>
                        <div>
                            <el-rate
                                    disabled
                                    show-score
                                    text-color="#ff9900"
                                    :value="detailsData.gradeTotal">
                            </el-rate>
                        </div>
                        <div>
                            <div class="soft-float-left">
                                <div class="soft-size">发布时间:{{detailsData.publishDate}}</div>
                                <div class="soft-size">大小：{{fileSizeFormat(detailsData.softSize)}}
                                    下载次数：{{detailsData.downloadTotal}}次
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="soft-size">
                        <div class="soft-info-tag">
                            <el-tag type="info" v-if="detailsData.classifyIdPath.indexOf('MAINTAIN')>-1">运维软件</el-tag>
                        </div>
                        <div class="soft-info-tag" v-if="detailsData.keywords">
                            关键字:
                            <el-tag style="margin-left: 10px" type="success"
                                    v-for="(item,index) in detailsData.keywords.split(/,|，/)" v-if="item">{{item}}
                            </el-tag>
                        </div>
                        <div class="soft-info-tag" v-if="detailsData.publishAuthor">发布者：{{detailsData.publishAuthor}}
                        </div>
                        <div class="soft-info-tag" v-if="detailsData.fromYon">
                            <div style="display: inline-block">来源:</div>
                            <ice-datamap-translater :value="detailsData.fromYon" style="display: inline-block"
                                                    mapTypeCode="SOFTWARE_FROM_YON"></ice-datamap-translater>
                        </div>
                        <div class="soft-info-tag" v-if="detailsData.useWay">使用方式：{{detailsData.useWay}}</div>
                        <div class="soft-info-tag"
                             v-if="detailsData.classifyIdPath.indexOf('MAINTAIN')>-1 && detailsData.downloadAuth==1">
                            <el-tag type="danger">需授权使用</el-tag>
                        </div>
                        <div class="soft-info-tag" v-if="detailsData.softRegion==0">
                            <el-tag>院级软件</el-tag>
                        </div>
                        <div v-if="detailsData.supportOsName" style="padding-top: 5px">适配操作系统:
                            <el-tag type="warning" v-for="(item,index) in detailsData.supportOsName.split(/,|，/)"
                                    style="margin-right: 5px">
                                {{item}}
                            </el-tag>
                        </div>
                    </div>
                </ice-grid-layout>

                <ice-grid-layout :columns="0" name="软件详情描述" v-html="detailsData.softDescribe">

                </ice-grid-layout>

                <div v-if="detailsData.authEndDate"
                     style="display: inline-block;line-height:30px;color: rgb(245, 108, 108);" class="soft-size">
                    授权回收时间:{{detailsData.authEndDate}}
                </div>

                <div style="display: flex;justify-content: flex-end">
                    <el-tooltip content="点我办理授权" placement="top" effect="light">
                        <el-button class="soft-float-right"
                                   v-if="detailsData.downloadAuthResult == 0"
                                   @click="accreditSoftware(detailsData.oid)">需授权
                        </el-button>
                    </el-tooltip>
                    <el-button type="primary" icon="el-icon-download"
                               @click="downLoadVis(detailsData)"
                               v-if="detailsData.downloadAuthResult == 1">下载
                    </el-button>
                    <el-button type="info" icon="el-icon-close" @click="show2=false">
                        关闭
                    </el-button>
                </div>

            </div>

        </ice-dialog>
        <el-footer style="height: 36px;position: relative" v-show="loadingMore">
            <div class="loading-more">
                <span class="el-icon-loading"></span>
                <span>&nbsp;正在加载中...</span>
            </div>
        </el-footer>
        <div>
            <auth-software-load-down ref="asl"></auth-software-load-down>
        </div>
    </el-container>


</template>

<script>

    // fade/zoom 等
    /*   import 'element-ui/lib/theme-chalk/base.css';*/
    import IceDrawer from "../../../components/common/base/IceDrawer";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import VueScroll from 'vuescroll'
    import IceDatamapTranslater from "../../../components/common/base/IceDatamapTranslater";
    import fileUtil from '@/utils/fileUtil.js';
    import IceDialog from "../../../components/common/base/IceDialog";
    import AuthSoftwareLoadDown from "./authSoftwareLoadDown";

    export default {
        name: "ApplicationHouse",
        components: {AuthSoftwareLoadDown, IceDialog, IceDatamapTranslater, IceGridLayout, IceDrawer, VueScroll},
        data() {
            return {
                clypath: '',
                inptKeyword: '',
                navs: [],
                dataPages: [],
                show2: false,
                detailsData: {'classifyIdPath': '', 'downloadAuth': 0},
                loadingMore: false,
                size: 30,
                current: 0,
                pages: 1,
                moreMenu: '',
                topOffset: 0,
                menusRows: 1,
                loading: false,
                activeIndex: '1'
            }
        },
        computed: {
            /*menusRows() {
                console.log(this.$refs.menus)
                if (this.$refs.menus) {

                    return Number(this.$refs.menus.offsetHeight) / 60;
                }

                return 1
            }*/
        },
        mounted() {
            this.$axios.get("/biz/BizSoftwareClassify/treeByName", {"params": {}}).then(success => {
                this.navs = success.data;
                console.log(this.navs)
                setTimeout(() => {
                    let nav = document.getElementById('el-menu-nav');
                    this.moreMenu = this.pxTNumber(window.getComputedStyle(nav).height) > 60 ? 'next' : '';
                    this.menusRows = Number(this.$refs.menus.$el.offsetHeight) / 60;
                }, 800)
            }).catch(error => {
                this.$message.error(error);
            });

            this.load({}, true, data => {
                this.loadingMore = false;
            });

        },
        methods: {

            pre() {
                this.topOffset -= 60;
            },
            next() {
                this.topOffset += 60;
            },


            pxTNumber(n) {
                return parseFloat(n.replace('px', ''));
            },
            moreMenuFun() {
                let nav = document.getElementById('el-menu-nav');
                let wd = 60;
                let zwd = this.pxTNumber(window.getComputedStyle(nav).height);
                let page = zwd / wd;
                let ctop = Math.abs(this.pxTNumber(nav.style.top));
                let cpage = ctop == 0 ? 1 : parseInt(ctop / wd) + 1;
                cpage = cpage >= page ? 0 : cpage;

                nav.style.top = (-parseInt(cpage * wd)) + 'px';
                if (page - 1 == cpage) {
                    this.moreMenu = 'pre';
                } else {
                    this.moreMenu = 'next';
                }
                console.log('ctop:' + ctop + ',page:' + page + ',cpage:' + cpage)
            },
            fileSizeFormat(b) {
                return fileUtil.fileSizeFormat(b);
            },
            showDetails(item) {
                this.detailsData = item;
                this.show2 = true;
            },
            /**需要授权的软件*/
            accreditSoftware(oid) {
                this.show2 = false;
                this.$router.push("/biz/software/applicationinstall?oid=" + oid);
            },
            handleMenuCommand(command) {
                /**我的--安装列表*/
                if (command == 'install') {
                    this.$router.push("/biz/software/appcationinstallmanger");
                    return;
                }
                /**我的--下载历史*/
                if (command == 'history') {
                    this.$router.push("/biz/software/applicationupdownhistory");
                    return;
                }
                if (command.indexOf('order:') > -1) {//排序
                    let comms = command.split(':');
                    let opt = {};
                    opt[comms[0]] = comms[1];
                    this.load(opt, true)
                }
                /**我的运维专用软件申请*/
                if(command == 'auth'){
                    this.$refs.asl.openDialog();
                }
            },
            load(opt, reload, endFun) {
                // 添加默认排序
                let existOpt = Object.keys(opt);
                if (existOpt.length === 0) {
                    opt['order'] = 'down';
                }

                if (this.loading) {
                    return
                }
                if (reload) {
                    this.current = 0;
                }
                endFun = endFun ? endFun : function () {
                };
                this.loading = true
                this.$axios.get("/biz/BizSoftwareInfo/list", {
                    "params": Object.assign({
                        clypath: this.clypath,
                        name: this.inptKeyword,
                        size: this.size,
                        current: this.current += 1
                    }, opt)
                }).then(success => {
                    if (reload) {
                        this.dataPages = [];
                    }
                    this.pages = success.data.pages;
                    success.data.records.forEach(item => {
                        this.dataPages.push(item);
                        endFun(item);
                    })
                }).catch(error => {
                    this.$message.error(error);
                    endFun(error);
                }).finally(_ => {
                    this.loading = false;
                });
            },
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
                this.clypath = key;
                this.load({}, true, data => {
                    this.loadingMore = false;
                });
            },
            handleOpen(key, keyPath) {
                alert(key)
            },
            handleScroll(v) {
                if (v.process === 1 && this.pages > this.current) {
                    this.loadingMore = true;
                    this.load({}, false, data => {
                        this.loadingMore = false;
                    });
                }
            },
            downLoadVis(item) {
                this.$axios.get("/biz/BizSoftwareInfo/download", {
                    "params": {
                        id: item.oid,
                    }
                }).then(success => {
                    this.$downloadFile(item.fileId);
                    item.downloadTotal++;
                }).catch(error => {
                    this.$message.error(error);
                });
            }
        }
    }
</script>

<style scoped lang="less">

    .menu-item {
        display: flex;
        max-width: 130px;
        min-width: 50px;
        line-height: 20px;
        justify-content: center;
        align-items: center;
        white-space: normal;
        height: 93%;
        overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
    }


    .up {
        border: 0;
    }

    /*box-shadow:0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);*/
    /*border-radius:3px;*/
    .soft-main-ctx {
        max-width: 300px;
        width: 90%;
        height: 96px;
        padding: 5px;
        margin: 10px auto;
    }

    .soft-main-ctx:hover {
        box-shadow: 0px 0px 1px 1px rgba(251, 185, 188, 0.5), 0px 0px 1px 1px rgba(251, 185, 188, 0.5);
    }

    .soft-left-ctx {
        width: 80px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        /*justify-content: center;
        align-items: center;*/
    }

    .soft-right-ctx {
        width: 60%;
        flex-grow: 1;
    }

    .soft-float-left {
        float: left;
        /*  display: flex;*/

        .pre {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            color: #d81902;
            cursor: pointer;
        }

        .next {
            width: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 15px;
            color: #d81902;
            cursor: pointer;
        }
    }

    .soft-float-right {
        float: right;
        text-decoration: none;
    }

    .soft-title {
        margin-top: 4px;
        margin-bottom: 4px;
        text-align: initial;
        white-space: inherit;
        font-size: 15px;
        line-height: 20px;
        max-height: 40px;
        height: auto;
        width: 100%;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        overflow-wrap: break-word;
    }

    .soft-size {
        font-size: 12px;
        color: #7c7e82;
    }

    .soft-fl-clear {
        clear: both
    }

    .soft-icon {
        width: 60px;
        height: 60px;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.08);
        cursor: pointer;
    }


    .soft-detail-left-ctx {
        width: 100px;
    }

    .soft-detail-right-ctx {
        width: 480px;
    }

    .soft-down {
        width: 103px;
    }

    .soft-ellipsis {
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: initial;
        white-space: nowrap;
    }

    .soft-info-tag {
        display: inline-block;
        margin-left: 10px;
    }


    .soft-label-yuan {
        z-index: 9;
        position: relative;
        top: -27px;
        left: 68px;
        overflow: hidden;
        font-size: 15px;
    }


    .advance-query-title {
        margin: 0px 10px;
        display: flex;
        padding-bottom: 10px;
        justify-content: space-between;
        border-bottom: 1px solid #dee1eb;
        margin-bottom: 20px;
    }

    .title {
        color: rgb(83, 168, 255);
    }

    .loading-more {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 140px;
        height: 32px;
        margin-top: -16px;
        margin-left: -70px;
        display: flex;
        align-items: center;
        justify-content: center;
        /*background: red;*/
    }
</style>
<style lang="less">
    .application-rep-head {
        background: #f6f6f6;
        padding-left: 0;

        .el-menu {
            background: inherit;
            height: 100%;
        }

        .el-menu.el-menu--horizontal {
            border-bottom: 2px solid #0091b0;
            height: 100%;

            > .el-menu-item.is-active {
                color: #000000;
                font-weight: bold;
                height: 100%;
            }

            .el-submenu.is-active {
                color: #000000;
                font-weight: bold;
                border-bottom: 2px solid #0091b0;
            }
        }

        .el-submenu.is-opened {
            background: #f6f6f6;
            border-bottom: 2px solid #0091b0;
        }

        .el-submenu.is-opened:hover {
            background: #f6f6f6;
        }

        .el-menu el-menu-item:hover {
            background: #f6f6f6;
        }

        .el-menu--horizontal .el-submenu__title:hover {
            background: #f6f6f6;
        }

        .el-menu--horizontal > .el-submenu .el-submenu__icon-arrow {
            position: absolute;
            right: 3px;
            margin-top: -5px;
        }

    }
</style>