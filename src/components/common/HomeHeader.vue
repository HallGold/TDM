<template>
    <div class="ice-header">
        <!-- 折叠按钮 -->
        <div class="logimg">
            <img src="../../assets/img/home/logo.svg" :style="ishome?'cursor:normal':'cursor: pointer'"
                 @click="ishome?_=>{}:collapseChage(undefined)">
        </div>
        <div class="logo" @click="goHome" title="回到首页">
            <span class="name">院</span><span class="sm">IT</span><!--<span class="sm"></span>--><span class="name">服务管理平台(机密)</span>
        </div>
        <div style="width: 350px;line-height: 70px;color: white">
            【 <span style="font-size: 12px;font-weight: 400;cursor: pointer;"
                    @click="$router.push('/myTask')">待办({{totalTask}})</span>
            <span style="font-size: 12px;font-weight: 400;cursor: pointer;margin:0 10px;"
                  @click="$router.push('/myApply')">申请({{totalApply}})</span>
            <span style="font-size: 12px;font-weight: 400;cursor: no-drop; ">消息(0)</span>
            】
        </div>
        <div class="ice-header-right">
             今天是{{new Date().toLocaleDateString()}}，欢迎您！
             <!--【
             <span @click="$router.push('/myTask')">待办({{totalTask}})</span>
             <span @click="$router.push('/myApply')">申请({{totalApply}})</span>-->
            <!--<span>通知(5)</span>
            <span>关注(5)</span>-->
            <!--<span @click="$router.push('/taskPool')">我要抢单({{totalPool}})</span>
            <span @click="$router.push('/myDeliver')">抄送给我({{myDeliver}})</span>-->
            <!--            】-->
            <!-- 全屏显示 -->
            <div class="btn-fullscreen" @click="handleFullScreen">
                <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                    <i class="el-icon-rank"></i>
                </el-tooltip>
            </div>
            <!-- 用户头像 -->
            <img src="../../assets/img/home/user.png">
            <!-- 用户名下拉菜单 -->
            <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}({{deptName}}) <i class="el-icon-caret-bottom"></i>
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled v-if="relateUsers&&relateUsers.length>0">账号切换</el-dropdown-item>
                    <div class="relateUsers" v-for="user in relateUsers" @click="quickSwitch(user.usercode)"
                         :title="`点击快速切换账号至：${user.orgname}-${user.deptname}(${user.usercode})`">
                        <el-dropdown-item>{{user.deptname}}({{user.usercode}})</el-dropdown-item>
                    </div>
                    <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>

            <!-- 选择主题下拉菜单 -->
            <el-dropdown class="user-name" trigger="click">
                    <span class="el-dropdown-link">
                        主题颜色
                    </span>
                <el-dropdown-menu slot="dropdown">
                    <div class="bgs">
                        <div class="item" v-for="(item, index) in bgs" :key="index" @click="handleColor(item, index)">
                            <div :style="{backgroundColor: item.bg}"></div>
                            {{item.text}}
                        </div>
                    </div>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>
<script>
    import {mapMutations, mapActions, mapGetters} from 'vuex'
    import {cleanCookie} from '../../utils/cookieUtil'
    import Vue from 'vue';


    export default {
        data() {
            return {
                totalTask: 0,
                totalApply: 0,
                totalPool: 0,
                myDeliver: 0,
                collapse: false,
                fullscreen: false,
                name: '',
                message: 2,
                wsUrl: '',
                ws: null,
                bgs: [
                    {
                        colorurl: './lib/css/color-default.css',
                        bg: '#0091b0',
                        text: '蓝色'
                    },
                    {
                        colorurl: './lib/css/color-dark.css',
                        bg: '#242f42',
                        text: '黑色'
                    },
                    {
                        colorurl: './lib/css/color-green.css',
                        bg: '#B7462A',
                        text: '红色'
                    },
                ]
            }
        },
        computed: {
            ...mapGetters('themeStore', ['getTheme']),
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
        methods: {

            ...mapMutations('menuStore', ['collapseChage', 'resetState']),
            ...mapMutations('datamapStore', ['resetStateDataMap']),
            ...mapMutations('userinfoStore', ['cleanUserInfo']),
            ...mapMutations('permissionStore', ['cleanPermissions']),
            ...mapMutations('questionStore', ['close']),
            ...mapMutations('cacheStore', ['clearAllCache']),
            ...mapMutations('themeStore', ['settheme']),
            ...mapActions('userinfoStore', ['switchLoginUser']),
            // 用户名下拉菜单选择事件
            handleCommand(command) {
                if (command == 'loginout') {
                    this.resetState();
                    this.resetStateDataMap();
                    this.cleanUserInfo();
                    this.cleanPermissions();
                    this.close();
                    this.clearAllCache();
                    cleanCookie();
                    this.$router.push('/login');
                    this.$axios.post("/logout").catch(e => {
                        console.error(e);
                    })
                }
            },
            // 全屏事件
            handleFullScreen() {
                let element = document.documentElement;
                if (this.fullscreen) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.webkitCancelFullScreen) {
                        document.webkitCancelFullScreen();
                    } else if (document.mozCancelFullScreen) {
                        document.mozCancelFullScreen();
                    } else if (document.msExitFullscreen) {
                        document.msExitFullscreen();
                    }
                } else {
                    if (element.requestFullscreen) {
                        element.requestFullscreen();
                    } else if (element.webkitRequestFullScreen) {
                        element.webkitRequestFullScreen();
                    } else if (element.mozRequestFullScreen) {
                        element.mozRequestFullScreen();
                    } else if (element.msRequestFullscreen) {
                        // IE11
                        element.msRequestFullscreen();
                    }
                }
                this.fullscreen = !this.fullscreen;
            },
            createWebSocket() {
                if (window.WebSocket || window.MozWebSocket) {
                    if (!Vue.prototype.$ws) {
                        this.ws = new WebSocket(this.wsUrl);
                        Vue.prototype.$ws = this.ws;
                    }

                }
            },
            quickSwitch(userCode) {
                this.switchLoginUser({
                    targetUserCode: userCode, next: async _ => {
                        console.log(this.$route.path)
                        if (this.$route.path == '/' || this.$route.path == '/home') {
                            window.location.reload(true)
                            // this.$message.success("账号切换成功")
                        } else {
                            window.location.replace("#/home")
                            window.location.reload(true)
                        }

                    }, isTemp: false
                })
            },
            goHome() {
                if (this.$route.path != '/home') {
                    this.$router.push('/home')
                }

            },
            myCount() {
                this.$axios.get("/bpm/proTaskUser/count", {
                    params: {}
                }).then(result => {
                    this.totalTask = result.data.myTask;
                    this.totalApply = result.data.myApply;
                    this.totalPool = result.data.myPool;
                    this.myDeliver = result.data.myDeliver;
                })
            },
            // 选择主题
            handleColor (item, index) {
                let href = '';
                if (item) {
                    href = item.colorurl;
                    this.settheme(index);
                } else {
                    href = this.bgs[this.getTheme].colorurl;
                }

                this.$nextTick(()=>{
                    let tid = setTimeout(()=>{
                        let head = document.querySelector('head');
                        let islink = document.querySelector('.abbbbbb');
                        if (!islink) {
                            let ele = document.createElement('link');
                            ele.rel = 'stylesheet';
                            ele.href = './lib/css/color-default.css';
                            ele.className = 'abbbbbb';
                            head.appendChild(ele);
                            clearTimeout(tid)
                        } else {
                            islink.href = href?href:'./lib/css/color-default.css';
                        }

                    }, 20)
                })
            }
        },
        created () {
            this.handleColor();
        },
        mounted() {
            this.myCount();
        }
    }
</script>
<style scoped>

    .ice-header {
        display: -webkit-flex;
        display: flex;
        background: #0091b0;
        height: 70px;
        /* padding-left: 10%;
         padding-right: 10%;*/
    }

    .ice-header .logimg {
        margin-left: 5px;
        display: flex;
        align-items: center;
    }

    .ice-header .logo {
        margin-left: 10px;
        min-width: 250px;
        line-height: 70px;
        cursor: pointer;
        font-size: 19px;
        font-family: microsoft yahei, arial, STHeiTi, sans-serif;
        color: white;
        font-weight: 600;
    }

    .ice-header .logo .sm {
        color: #42ff1b;
        margin-right: 5px;
        margin-left: 5px;
        font-size: 22px;
    }

    .ice-header .logo .it {
        font-size: 22px;
    }

    .ice-header .logo .name {
        font-size: 22px;
    }

    .ice-header .ice-header-right {
        width: 100%;
        font-size: 12px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .ice-header .ice-header-right img {
        width: 40px;
    }

    .ice-header .ice-header-right .menu img {
        height: 18px;
        width: 13px;
        margin-bottom: -4px;
        margin-left: 6px;
    }

    .ice-header .ice-header-right span {
        margin: 0 5px 0 5px;
        cursor: pointer;
    }

    .btn-fullscreen {
        transform: rotate(45deg);
        margin-right: 5px;
        font-size: 24px;
    }

    .user-name {
        font-size: 12px;
        color: white;
    }

</style>
<style lang="less">
    .relateUsers {
        li {
            max-width: 90px;
            word-break: keep-all; /* 不换行 */
            white-space: nowrap; /* 不换行 */
            overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
            text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
        }

    }
    .bgs {
        padding: 10px 15px;
        .item {
            line-height: 26px;
            font-size: 14px;
            cursor: pointer;
            &::after{
                content: "";
                display: block;
                clear:both;
            }
            div {
                float: left;
                width: 24px;
                height:24px;
                border: 1px solid #ddd;
                margin-right: 15px;
                margin-bottom: 10px;
            }
            &:hover {
                color: #ff9e12;
            }
        }
    }
</style>
