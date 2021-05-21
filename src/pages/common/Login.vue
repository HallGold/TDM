<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">{{name}}</div>
            <div class="ms-content" v-loading="loading" element-loading-text="登录中...">
                <username-pwd-login :submit="submit" :loading="loading" ref="loginBar"
                                    v-if="mode=='USERNAME-PWD'"></username-pwd-login>
                <cert-ge-r-login :submit="submit" :loading.sync="loading" ref="loginBar"
                                 v-if="mode=='CERT-CA'"></cert-ge-r-login>
            </div>
            <p class="sys-testRun-tips">非密系统，禁止输入涉密信息!</p>
        </div>

    </div>
</template>

<script>

    import localstoreUtil from '@/utils/localstoreUtil';
    import {Loading} from 'element-ui';
    import UsernamePwdLogin from "./loginmode/UsernamePwdLogin";
    import CertGeRLogin from "./loginmode/CertGeRLogin";
    import qs from 'qs'
    import {mapActions, mapMutations} from 'vuex'
    import Vue from "vue";

    export default {
        data: function () {
            return {
                loading: false,
                mode: process.env.NODE_ENV === 'development'?'USERNAME-PWD':'CERT-CA',
                name: process.env.VUE_APP_NAME
            }
        },
        methods: {
            ...mapActions("userinfoStore", ['login']),
            ...mapMutations('menuStore', ['collapseChage', 'resetState']),
            ...mapMutations('datamapStore', ['resetStateDataMap']),
            ...mapMutations('userinfoStore', ['cleanUserInfo']),
            ...mapMutations('permissionStore', ['cleanPermissions']),
            ...mapMutations('questionStore', ['close']),
            submit() {
                const {loginBar} = this.$refs;
                loginBar.doSubmit(params => {
                    this.loading = true;
                    this.submitLogin(params, loginBar);
                    // if (params.isCert) {
                    //     this.submitLogin(params, loginBar);
                    // } else {
                    //     this.submitLogin(params, loginBar);
                        // if (params.pwd == '12345678aA') {
                        //     console.log(4545646)
                        //     this.submitLogin(params, loginBar);
                        //
                        // } else {
                        //     this.$message.error("账号密码错误！");
                        //     this.loading = false;
                        // }
                        // return
                        // this.vilidateUser(params, loginBar);
                        // return
                    // }
                });
            },
            // 账号密码登录验证
            vilidateUser(params, loginBar) {
                this.$axios.post("/pms/FrameUserInfo/check", {code: params.username, psw: params.pwd})
                    .then(result => {
                        if (result.data) {
                            // this.submitLogin(params, loginBar);
                        } else {
                            this.$message.error("账号密码错误！");
                            this.loading = false;
                        }
                    })
                    .catch(error => {
                        this.$message.error("验证失败！")
                        this.loading = false;
                    })
                    .finally(_ => {

                    })
            },
            async submitLogin(params, loginBar) {
              if(!params.sn){
                await Vue.prototype.$axios.get(`/pms/userInfo/encodePwd?pwd=` + params.pwd).then(result => {
                  params.pwd = result.data;
                });
              }
              this.$axios.post("/login",
                  {mode: params.sn ? 'CERT-CA' : 'USERNAME-PWD', username: params.username, params: params, isEncrypt: "true"}, {
                    transformRequest: [function (data, headers) {
                      return qs.stringify(data, {
                        allowDots: false,
                        serializeDate: (date) => {
                          return moment(date).format('YYYY-MM-DD HH:mm:ss')
                        }
                      })
                    }],
                  })
                  .then(result => {
                    /*        this.resetState();
                            this.resetStateDataMap();
                            this.cleanUserInfo();
                            this.cleanPermissions();*/

                    this.loading = false;
                    let userInfo = result.data;
                    this.login({
                      userInfo,
                      next: _ => {
                        localstoreUtil.setLastLoginUser(userInfo);
                        if (this.$route.query['_redirectUrl']) {
                          this.$router.replace({path: decodeURIComponent(this.$route.query['_redirectUrl'])});
                        } else {
                          this.$router.replace({path: '/home'});
                        }
                      }
                    })
                  })
                  .catch(error => {
                    if (error && error.code == '20000') {
                      loginBar.then(error.data)
                    } else {
                      this.$message.error(error.msg)
                    }
                    this.loading = false;
                  }).finally(_ => {
                this.loading = false;
              })
            },
            // 编码
            enCodeBank(str) {
                let arr = [
                    {
                        key: "%sA",
                        val: 1
                    },
                    {
                        key: "%sB",
                        val: 0
                    },
                    {
                        key: "%sE",
                        val: 2
                    },
                    {
                        key: "%sH",
                        val: 5
                    },
                    //a
                    {
                        key: "%wS",
                        val: "A"
                    },
                    {
                        key: "%ws",
                        val: "a"
                    },
                    //  d
                    {
                        key: "%wN",
                        val: "D"
                    },
                    {
                        key: "%wn",
                        val: "d"
                    },
                    // z
                    {
                        key: "%wJ",
                        val: "Z"
                    },
                    {
                        key: "%wj",
                        val: "z"
                    },
                    // t
                    {
                        key: "%wK",
                        val: "T"
                    },
                    {
                        key: "%wk",
                        val: "t"
                    },
                    // s
                    {
                        key: "%wF",
                        val: "S"
                    },
                    {
                        key: "%wf",
                        val: "s"
                    },

                    // k
                    {
                        key: "%wB",
                        val: "K"
                    },
                    {
                        key: "%wb",
                        val: "k"
                    },
                    // g
                    {
                        key: "%wC",
                        val: "G"
                    },
                    {
                        key: "%wc",
                        val: "g"
                    },

                    // y
                    {
                        key: "%wX",
                        val: "Y"
                    },
                    {
                        key: "%wx",
                        val: "y"
                    },
                    // l
                    {
                        key: "%wO",
                        val: "L"
                    },
                    {
                        key: "%wo",
                        val: "l"
                    },
                ]
                var s = str + "";
                arr.reverse().forEach(c => {
                    let reg = new RegExp(c.val, "g");
                    s = s.replace(reg, c.key);
                })
                // console.log(s)
                return s;
            },
            // 解码账号
            deCodeBank(str) {
                let arr = [
                    {
                        key: "%sA",
                        val: 1
                    },
                    {
                        key: "%sB",
                        val: 0
                    },
                    {
                        key: "%sE",
                        val: 2
                    },
                    {
                        key: "%sH",
                        val: 5
                    },
                    //a
                    {
                        key: "%wS",
                        val: "A"
                    },
                    {
                        key: "%ws",
                        val: "a"
                    },
                    //  d
                    {
                        key: "%wN",
                        val: "D"
                    },
                    {
                        key: "%wn",
                        val: "d"
                    },
                    // z
                    {
                        key: "%wJ",
                        val: "Z"
                    },
                    {
                        key: "%wj",
                        val: "z"
                    },
                    // t
                    {
                        key: "%wK",
                        val: "T"
                    },
                    {
                        key: "%wk",
                        val: "t"
                    },
                    // s
                    {
                        key: "%wF",
                        val: "S"
                    },
                    {
                        key: "%wf",
                        val: "s"
                    },

                    // k
                    {
                        key: "%wB",
                        val: "K"
                    },
                    {
                        key: "%wb",
                        val: "k"
                    },
                    // g
                    {
                        key: "%wC",
                        val: "G"
                    },
                    {
                        key: "%wc",
                        val: "g"
                    },

                    // y
                    {
                        key: "%wX",
                        val: "Y"
                    },
                    {
                        key: "%wx",
                        val: "y"
                    },
                    // l
                    {
                        key: "%wO",
                        val: "L"
                    },
                    {
                        key: "%wo",
                        val: "l"
                    },
                ]
                var s = str + "";
                arr.forEach(c => {
                    let reg = new RegExp(c.key, "g");
                    s = s.replace(reg, c.val);
                })
                // console.log(s, '解码结果')
                return s;
            },
        },
        mounted() {
            this.enCodeBank("0001391411test01");
            this.deCodeBank("%sB%sB%sB%sA39%sA4%sA%sA%wke%wf%wk%sB%sA");
            // window.location.href = '/pms/#/login?t=fd&u=fd'

            var req = new XMLHttpRequest();
            req.open('GET', document.location, false);
            req.send(null);
            // console.log(req.getAllResponseHeaders(), 'hhaha');
            this.close();
            //加载默认的登录方式

            if (this.$route.query['mode']) {
                this.mode = this.$route.query['mode'];
            } else {
                // this.$axios.get("/pms/getDefaultLoginModel").then(({data}) => {
                //     if (data) {
                //         this.mode = data;
                //     }
                // }).catch(err => {
                //
                //     console.error(err)
                // })
            }

        },
        components: {CertGeRLogin, UsernamePwdLogin, Loading}
    }
</script>

<style scoped>
    .login-wrap {
        position: relative;
        width: 100%;
        height: 100%;
        background-image: url(../../assets/img/login-bg.jpg);
        background-size: 100%;
    }

    .ms-title {
        width: 100%;
        line-height: 50px;
        text-align: center;
        font-size: 28px;
        color: #333;
        border-bottom: 1px solid #ddd;
    }

    .ms-login {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 350px;
        margin: -190px 0 0 -175px;
        border-radius: 5px;
        background: rgba(255, 255, 255, 0.3);

    }

    .ms-content {
        padding: 30px 30px;
    }

    .sys-testRun-tips {
        font-size: 35px;
        line-height: 40px;
        color: #f00;
        text-align: center;
        position: absolute;
        bottom: -50px;
        width: 800px;
        left: 50%;
        font-weight: bold;
        margin-left: -400px;
        letter-spacing: 2px;
        text-shadow: 5px 2px 6px #000;
    }

</style>
