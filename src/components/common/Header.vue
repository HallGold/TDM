<template>
  <div class="header">

    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="ishome?_=>{}:collapseChage(undefined)">
      <img src="@/assets/img/theme/logo.png" style="height: 40px;">
    </div>

    <div class="left">
      <div class="logo" @click="goHome" title="回到首页">{{ name }}</div>
      <div style="line-height: 70px;color: white;float: left;font-size: 12px;" class="tusongmsg">
        【 <span style="font-size: 12px;font-weight: 400;cursor: pointer;"
                @click="$router.push('/myTask')"><i
          class="iconfont iconschedule"></i>待办 (<em>{{ totalTask }}</em>)</span>
        <span style="font-size: 12px;font-weight: 400;cursor: pointer;margin:0 0 0 10px;"
              @click="$router.push('/myApply')"><i class="iconfont iconshenqing"
                                                   style="font-size: 10px;"></i>申请 (<em>{{ totalApply }}</em>)</span>
<!--        <span @click="$router.push('/system/inform')" style="font-size: 12px;font-weight: 400;cursor: pointer; "><i-->
<!--            class="iconfont icontongzhi"></i>通知 (<em>{{ msgTotal }}</em>)</span>-->
        】
      </div>
    </div>
    <div class="header-right">
      <div class="header-user-con">

        <!-- <theme-picker></theme-picker>-->

        <!-- 日期 -->
        <div class="show-date">
          <span @click="$router.push('/home')" style="margin-right: 30px;cursor: pointer"><i class="el-icon-s-home"
                                                                                             style="margin-right: 5px;font-size: 20px;"></i>首页</span>
          <span>{{ currentYear }}年{{ currentMonth }}月{{ currentDay }}日 星期{{ currentWeek }}</span>
        </div>

        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 消息中心 -->
        <!--<div class="btn-bell">
            <el-tooltip effect="dark" :content="message?`有${message}条未读消息`:`消息中心`" placement="bottom">
                <router-link to="/tabs">
                    <i class="el-icon-bell"></i>
                </router-link>
            </el-tooltip>
            <span class="btn-bell-badge" v-if="message"></span>
        </div>-->
        <!-- 用户头像 -->
        <div class="user-avator"><img src="../../assets/img/img.png"></div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{ username }}({{ deptName }}) <i class="el-icon-caret-bottom"></i>
                    </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled v-if="relateUsers&&relateUsers.length>0">账号切换</el-dropdown-item>
            <div class="relateUsers" v-bind:key="user.usercode" v-for="user in relateUsers"
                 @click="quickSwitch(user.usercode)"
                 :title="`点击快速切换账号至：${user.orgname}-${user.deptname}(${user.usercode})`">
              <el-dropdown-item>{{ user.deptname }}({{ user.usercode }})</el-dropdown-item>
            </div>
            <el-dropdown-item divided command="changePwd" v-if="showChangePwdBtn">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>


        <!-- 帮助文档 -->
        <!--<div>-->
        <!--<el-tooltip effect="dark" content="操作手册" placement="bottom">-->
        <!--<a href="/assets/doc/用户操作手册_QIS分册-V1.0.doc" target="_blank" download="用户操作手册_QIS分册-V1.0.doc">-->
        <!--<img src="@/assets/img/theme/help.png" style="height: 25px; margin: 5px 0px 0px 10px; cursor: pointer;">-->
        <!--</a>-->
        <!--</el-tooltip>-->
        <!--</div>-->
        <el-dropdown class="user-name" trigger="click">
                    <span class="el-dropdown-link">
                        <img src="@/assets/img/theme/help.png"
                             style="height: 35px; margin: 5px 0px 0px 10px; cursor: pointer;">
                    </span>
          <el-dropdown-menu slot="dropdown">
            <!--<div class="bgs">-->
            <!--&lt;!&ndash;<div class="item" v-for="(item, index) in bgs" :key="index" @click="handleColor(item, index)">&ndash;&gt;-->
            <!--&lt;!&ndash;<div :style="{backgroundColor: item.bg}"></div>&ndash;&gt;-->
            <!--&lt;!&ndash;{{item.text}}&ndash;&gt;-->
            <!--&lt;!&ndash;</div>&ndash;&gt;-->
            <!--</div>-->
            <div class="docitem">
              <a href="/pms/assets/doc/用户操作手册_PMS分册.zip" target="_blank" download="用户操作手册_TDM分册.zip">
                TDM操作文册
              </a>
            </div>
<!--            -->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/用户操作手册_PDM分册.zip" target="_blank" download="用户操作手册_PDM分册.zip">-->
<!--                PDM操作文册-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/用户操作手册_CAPP分册.zip" target="_blank" download="用户操作手册_CAPP分册.zip">-->
<!--                CAPP操作文册-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/用户操作手册_MES分册.zip" target="_blank" download="用户操作手册_MES分册.zip">-->
<!--                MES操作文册-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/用户操作手册_QIS分册.zip" target="_blank" download="用户操作手册_QIS分册.zip">-->
<!--                QIS操作文册-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/Intevue2020.zip" target="_blank" download="Intevue2020.zip">-->
<!--                Intevue插件-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/360se12.exe" target="_blank" download="360se12.exe">-->
<!--                360极速浏览器安装程序-->
<!--              </a>-->
<!--            </div>-->
<!--            <div class="docitem">-->
<!--              <a href="/pms/assets/doc/GP-9034T.zip" target="_blank" download="GP-9034T.zip">-->
<!--                条码打印机驱动-->
<!--              </a>-->
<!--            </div>-->
          </el-dropdown-menu>
        </el-dropdown>

        <!-- 选择主题下拉菜单 -->
        <el-dropdown class="user-name" trigger="click">
                    <span class="el-dropdown-link">
                        主题
                    </span>
          <el-dropdown-menu slot="dropdown">
            <div class="bgs">
              <div class="item" v-for="(item, index) in bgs" :key="index" @click="handleColor(item, index)">
                <div :style="{backgroundColor: item.bg}"></div>
                {{ item.text }}
              </div>
            </div>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <ice-dialog :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="400px" height="200px">
      <change-password @dialogVisible="changeDialogVisible" showOldPwd="true" v-bind:oid="changeUserId"></change-password>
    </ice-dialog>
  </div>
</template>
<script>
import {mapActions, mapMutations, mapGetters} from 'vuex'
import {cleanCookie} from '../../utils/cookieUtil'
import Vue from 'vue';
import ChangePassword from "@/components/common/ChangePassword";

export default {
  components: {ChangePassword},
  data() {
    return {
      totalTask: 0,
      totalApply: 0,
      totalPool: 0,
      myDeliver: 0,
      msgTotal: 0,
      collapse: false,
      fullscreen: false,
      name: '',
      message: 2,
      wsUrl: '',
      ws: null,
      currentYear: '',
      currentMonth: '',
      currentDay: '',
      currentWeek: '',
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
      ],
      name: process.env.VUE_APP_NAME,
      dialogVisible: false,
      dialogTitle: '修改密码',
      showChangePwdBtn: false,
      changeUserId: this.$userInfo.userId,
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

  methods: {
    ...mapMutations('menuStore', ['collapseChage', 'resetState']),
    ...mapMutations('datamapStore', ['resetStateDataMap']),
    ...mapMutations('userinfoStore', ['cleanUserInfo']),
    ...mapMutations('permissionStore', ['cleanPermissions']),
    ...mapMutations('questionStore', ['close']),
    ...mapActions('userinfoStore', ['switchLoginUser']),
    ...mapGetters('constant', ['getConstants']),
    ...mapMutations('constant', ['addUndoTypeCodes']),
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
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        this.resetState();
        this.resetStateDataMap();
        this.cleanUserInfo();
        this.cleanPermissions();
        this.close();
        cleanCookie();
        // this.$router.push('/login');
        // let url = process.env.NODE_ENV === 'development'?'/pms/#/login':'http://192.168.0.142:9005/index.jsp'
        // let url = process.env.NODE_ENV === 'development'?'/pms/#/login':'http://192.168.30.11:9005/index.jsp'
        // let url = process.env.NODE_ENV === 'development'?'/pms/#/login':'http://10.3.202.70:9005/index.jsp'
        let url = process.env.NODE_ENV === 'development' ? '/tdm/#/login' : '/tdm/#/login'
        // let url = process.env.NODE_ENV === 'development'?'/pms/#/login':'http://10.12.41.180:8081/index.jsp'
        // window.location.href='/pms/#/login'
        window.location.href = url
        this.$axios.post("/logout").catch(e => {
          console.error(e);
        })
      } else if (command == 'changePwd') {
        this.dialogVisible = true;
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
        // window.location.href="/pms/#/home"
        this.$router.push('/home')
      }

    },
    getMsgList() {
      let staticConditions2 = [{column: "sr", exp: "=", value: 1}, {column: "ifRead", exp: "=", value: 0}];
      this.$axios.get("/pms/ResMsg/list", {
        params: {
          current: 1,
          size: 5,
          staticConditions: staticConditions2,
          columns: ['oid', 'msgTitle', 'createDate', 'userCodeTo', 'msgContent'],
          conditionLink: 'AND',
        }
      })
          .then(result => {
            this.msgTotal = result.data.total;
          })
    },
    // 选择主题
    handleColor(item, index) {
      let href = '';
      if (item) {
        href = item.colorurl;
        window.localStorage.colorThem = index;
      } else {
        let i = window.localStorage.colorThem != undefined ? window.localStorage.colorThem : 0
        href = this.bgs[i].colorurl;
      }
      this.$nextTick(() => {
        let tid = setTimeout(() => {
          let head = document.querySelector('head');
          let islink = document.querySelector('.abbbbbb');
          if (!islink) {
            let ele = document.createElement('link');
            ele.rel = 'stylesheet';
            ele.href = href ? href : './lib/css/color-default.css';
            ele.className = 'abbbbbb';
            head.appendChild(ele);
            clearTimeout(tid)
          } else {
            islink.href = href ? href : './lib/css/color-default.css';
          }

        }, 20)
      })
    },
    changeDialogVisible(visible) {
      this.dialogVisible = visible;
    },
    async isShowChangePwd() {

      let {data} = await Vue.prototype.$axios.get(`permission/app_constant/byCode?appCode=SYSTEM_COMMON_90&code=MODIFY_PWD`);
      this.showChangePwdBtn = data.value == "1";
    }
  },
  mounted() {
    /*       this.wsUrl = 'ws://10.99.16.70:8073/resources/websocket/' + this.$userInfo.code
           this.createWebSocket();
           if (this.ws) {
               this.ws.onopen = (e) => {
                   //发送登录信息
                   // this.ws.send('xxx');
                   console.log("ws 连接成功")
               };

               this.ws.onclose = (e) => {
                   setTimeout(() => {
                       this.createWebSocket()
                   }, 5000)
               };
               this.ws.onerror = (e) => {
                   setTimeout(() => {
                       this.createWebSocket()
                   }, 5000)
               };
           }*/
  },
  created() {
    let nowDate = new Date();
    this.currentYear = nowDate.getFullYear();
    this.currentMonth = nowDate.getMonth() + 1;
    this.currentDay = nowDate.getDate();
    this.currentWeek = nowDate.getDay();
    this.currentWeek = "日一二三四五六".charAt(nowDate.getDay());
    this.handleColor();

    this.myCount();
    this.getMsgList();
    this.isShowChangePwd();
  }

}
</script>
<style scoped>
@import "../../assets/icon/iconfont.css";

.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
  position: relative;
}

.show-date {
  font-size: 14px;
  margin-right: 10px;
}

.collapse-btn {
  position: absolute;
  left: 20px;
  top: 15px;
  cursor: pointer;
  line-height: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header .logo {
  margin-left: 200px;
  float: left;
  margin-right: 20px;
  line-height: 70px;
  cursor: pointer;
}

.header-right {
  float: right;
  padding-right: 30px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell, .btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
  background: #fff;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 50%;
  overflow: hidden;
}

.user-avator img {
  width: 30px;
  height: 30px;
  margin-top: 4px;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

/*.relateUsers {
    max-width: 100px;
}*/

.el-dropdown-menu__item {
  text-align: center;
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

    &::after {
      content: "";
      display: block;
      clear: both;
    }

    div {
      float: left;
      width: 24px;
      height: 24px;
      border: 1px solid #ddd;
      margin-right: 15px;
      margin-bottom: 10px;
    }

    &:hover {
      color: #ff9e12;
    }
  }
}

.tusongmsg {
  em {
    color: #f30213;
    font-weight: bold;
    font-style: normal;
    margin: 0 2px;
  }

  i {
    font-size: 13px;
    margin-right: 2px;
  }
}

.docitem {
  padding: 5px 20px;

  a {
    color: #333;

    &:hover {
      color: #00D1B2;
      text-decoration: underline;
    }
  }
}
</style>
