<template>
    <div style="height: 100%;width: 100%">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" v-show="controlUnInstall">
            <el-form-item prop="username">
                <el-select style="width: 100%" v-model="ruleForm.username" placeholder="请选择登录KEY" size="medium"
                           @change="ruleForm.password=''">
                    <el-option v-for="cert in usernames" :label="cert.name"
                               :value="cert.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" placeholder="请输入PIN码" v-model="ruleForm.password"
                          @keyup.enter.native="submit" prefix-icon="el-icon-lock" size="medium">
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" @click="submit"
                           @keyup.enter.native="submit" :loading="loading">
                    {{loading?'登录中...':'登录'}}
                </el-button>
            </div>
        </el-form>
        <div style="height: 60px;width: 100%;text-align: center;font-size: 16px;background: white;line-height: 60px"
             v-show="!controlUnInstall">
            检测到未安装CA控件,<a href="./control/eps3k_stdSimpChinese.exe">点击下载</a>
        </div>
        <div style="height: 40px;width: 100%;text-align: center;font-size: 16px;background: white;line-height: 40px"
             v-show="!controlUnInstall">
            (安装完成后请<a href="javascript:;" @click="reloadWindow">刷新</a>页面)
        </div>
    </div>


    <!--
    certValue  "MIIEVjCCAz6gAwIBAgIMbOMcn9uSbeQ83m9cMA0GCSqGSIb3DQEBBQUAMB8xCzAJBgNVBAYTAkNOMRAwDgYDVQQDDAdsb2NhbGNhMB4XDTE4MDkwOTA1NDA1MloXDTIxMDkwODA1NDA1MlowNjELMAkGA1UEBhMCQ04xEjAQBgNVBAoMCeaWsOaWh+S7tjETMBEGA1UEAwwKdDQ2MjA1OHNqZjCBnzANBgkqhkiG9w0BAQEFAAOBjQAwgYkCgYEAsRYT/g1ZDDzt2Iy0KR3j4wHN09HlII2pSy3PrPSAWd/cucV9w0B/+G/P+4zcuYCuNfIlb0CNimKJC2UjG3eOxuMoMoeRb7iv9gKGVRfBRWVxuyb9rTWDHft8Oy2uShKGE7peMOkdlypEzzz8eTCVQK5fSJ76eu7RbylQELbje/8CAwEAAaOCAf0wggH5MAwGA1UdEwQFMAMBAQAwHQYDVR0lBBYwFAYIKwYBBQUHAwIGCCsGAQUFBwMEMAsGA1UdDwQEAwIAQDARBglghkgBhvhCAQEEBAMCAIAwJwYDVR0RBCAwHqAcBgorBgEEAYI3FAIDoA4MDHNqZkB0ZXN0LmNvbTAfBgNVHSMEGDAWgBQ3452M55dO8dZa7ToB6wDWLdeJPTCBmwYIKwYBBQUHAQEEgY4wgYswgYgGCCsGAQUFBzAChnxsZGFwOi8vbGRhcC5zZXJ2ZXI6Mzg5L0NOPWxvY2FsY2EsQ049bG9jYWxjYSxPVT1jQUNlcnRpZmljYXRlcyxkYz1hdmljP2NBQ2VydGlmaWNhdGU/YmFzZT9vYmplY3RDbGFzcz1jZXJ0aWZpY2F0aW9uQXV0aG9yaXR5MIGiBgNVHR8EgZowgZcwgZSggZGggY6GgYtsZGFwOi8vbGRhcC5zZXJ2ZXI6Mzg5L0NOPWxvY2FsY2EsQ049bG9jYWxjYSxvdT1DUkxEaXN0cmlidXRlUG9pbnRzLGRjPWF2aWM/Y2VydGlmaWNhdGVSZXZvY2F0aW9uTGlzdD9iYXNlP29iamVjdGNsYXNzPWNSTERpc3RyaWJ1dGlvblBvaW50MB0GA1UdDgQWBBRvBb+U/mTGxd+oIC8zAKdVCAFv/TANBgkqhkiG9w0BAQUFAAOCAQEA01ayY/YRXaNts5kTbShbi5HhJ/INEBnVXopIvVYAWYnfWdAbA3uRhU0WoYS8GsBc7BCH2/2LYDqCfj6ZC8kK24lARtrTA+qqPJaLECxWBr0nPY+DsJl3JZTscN/BAESluor6xVArL8zMWivBePIxRJ9guIYCI2j4NEuBfnzG4z/5Ec1Tm6KjbVHhp4Eu/boOQiNjaJdpWHHeGuFcL7DQDQ2PI+/yVSDZUFS7rnCe7wX7434MAHoalHEbgw18YblqFt19MppppqyGZ8oR5rVV70MuXU75/uQ3HjOLNzmnuleRH5j+++lfAZc/DHr8wxM/ER1GuFw8t2WBJaDcQ0rsIg=="
    issuser:"localca"
    name:t462058sjf"
    sn:"33698942396873445582766501724"

        -->
    <!--   <div>
           <div v-for="cert in certs">
               <div style="height: 32px;line-height: 32px">{{cert.name}}
                   <el-button @click="dologin11(cert.sn)">登录</el-button>
               </div>
           </div>
       </div>-->
</template>

<script>

    import {Device, DEVICE_SKF} from "./login/DeviceControl";
    import {getUUID} from "./login/CertUtil";

    export default {
        name: "CertGeRLogin",
        props: {
            submit: {
                type: Function,
                required: true
            },
            loading: Boolean,

        },
        data() {
            return {
                usernames: [],
                ruleForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, whitespace: true, message: '请选择登录KEY', trigger: 'blur'}
                    ],
                    // password: [
                    //     {required: true, whitespace: true, message: '请输入PIN码', trigger: 'blur'}
                    // ]

                },
                isload_PMkey: "0",
                device: null,
                certs: [],
                pendingCerts: [],
                timer: null,
                controlUnInstall: true
            }
        },
        methods: {
            doSubmit(doNext) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        //doNext({username: this.ruleForm.username, pwd: this.ruleForm.password})
                        this.$emit("update:loading", true)
                        this.$nextTick(_ => {
                            this.$nextTick(async _ => {
                                // const data = await this.dologin11(this.ruleForm.username)
                                // if (data) {
                                //     doNext(data)
                                // }
                                this.ruleForm.isCert = 1;
                                doNext(this.ruleForm);
                            })
                        })

                    }
                })
            },
            then(error) {
                console.error(error)
                this.$message.error(error.msg)
            },
            async dologin11(sn) {

                var passwd = this.ruleForm.password;
                if (passwd) {
                    var containerURI = this.device.getContainerUriByCertSN(sn, false);
                    var appURI = containerURI.substring(0, containerURI.lastIndexOf("|"));
                    try {
                        var returnData = this.device.login2(appURI, passwd);
                        if (returnData != 0) {
                            this.ruleForm.password = "";
                            if (returnData == -1) {
                                this.$message.warning("证书key已暂锁！");
                            } else {
                                this.$message.error("密码不正确！(剩余输入次数" + returnData + ")");
                            }
                            this.$emit("update:loading", false)
                            return;
                        }
                    } catch (e) {
                        this.$message.error("介质设备PIN码(密码)不正确!");
                        this.$emit("update:loading", false)
                        this.ruleForm.password = "";
                        return;
                    }

                    //获取随机数
                    //const {data: {base64, random}} = await this.$axios.post("/occ", {cmd: "getBase64"})
                    const random = getUUID();

                    let Base64 = require('js-base64').Base64;
                    const base64 = Base64.encode(random);

                    var signData;
                    //type 参数 1：普通密码证书    2；非普通密码证书
                    if (this.isload_PMkey === "1")
                        signData = this.device.signData(sn, '{"type":"1","b64":"' + base64 + '"}', passwd, false);
                    else
                        signData = this.device.signData(sn, '{"type":"2","b64":"' + base64 + '"}', passwd, false);

                    var certValue = this.device.getCertValueBySn(sn, 1, false);

                    return {
                        sn: sn,
                        signData: signData,
                        random: random,
                        certValue: certValue
                    }

                }
            },

            refreshCerts() {
                // 读取证书序列号
                var devices = this.device.getDevCount();
                if (devices == 0) {
                    // this.$message.warning("对不起，无法找到任何可用的证书介质设备，请确认介质是否插入！", "error", 2000);
                    this.certs = [];
                    this.pendingCerts = []
                    this.ruleForm.username = "";
                    this.ruleForm.password = "";
                    return;
                }
                var SNList = this.device.enumSNList(false/*false代表获取十进制序列号*/);
                if (SNList == null || SNList.length == 0) {
                    //this.$message.warning("对不起，没有找到任何可用的证书，请确认介质是否插入！", "error", 2000);
                    this.certs = [];
                    this.pendingCerts = []
                    this.ruleForm.username = "";
                    this.ruleForm.password = "";
                    return;
                }
                var certs = [];
                for (var i = 0; i < SNList.length; i++) {
                    var cert = {
                        "sn": SNList[i],
                        //判断是否启动普密key
                        "certValue": this.isload_PMkey === "1" ? this.device.getDuplicateCertValueBySn(SNList[i], 1, false) : this.device.getCertValueBySn(SNList[i], 1, false)
                    };
                    certs.push(cert);
                }
                this.pendingCerts = certs;

                const certSns = this.certs.map(item => item.sn);
                const newCertSns = certs.filter(item => item.certValue).map(item => item.sn);

                var diff = require('arr-diff');

                if (diff(certSns, newCertSns).length == 0 && diff(newCertSns, certSns).length == 0) {
                    return;
                }
                //TODO 后端交付，通过snArray序列号拿到对应的证书信息，然后渲染到表格，显示表格
                //处理参数格式
                this.$axios.post("/ukey/getKeyInfo", {
                    certs: JSON.stringify(certs)
                }).then(({data: returnData}) => {
                    if (returnData) {
                        this.certs = returnData;
                        if (this.certs && this.certs.length > 0) {
                            this.ruleForm.username = this.certs[0].sn;
                            this.ruleForm.password = "";
                        } else {
                            this.ruleForm.username = "";
                            this.ruleForm.password = "";
                        }

                    }
                }).catch(e => {
                    this.$message.error("登录KEY信息获取失败")
                })
            },
            reloadWindow() {
                window.location.reload()
            },
            // 解码时间戳
            deCode(str) {
                var s = str + "";
                s = s.replace(/A/g, '1');
                s = s.replace(/B/g, '0');
                s = s.replace(/E/g, '2');
                s = s.replace(/H/g, '5');
                return s;
            },
            // 解码账号
            deCodeBank (str) {
                // a,d,z,t,s,k,g,y,l
                // e,n,j,h,f,b,c,x,o
                let arr = [
                    {
                        key: "!sA",
                        val: 1
                    },
                    {
                        key: "!sB",
                        val: 0
                    },
                    {
                        key: "!sE",
                        val: 2
                    },
                    {
                        key: "!sH",
                        val: 5
                    },
                    //a
                    {
                        key: "!wE",
                        val: "A"
                    },
                    {
                        key: "!we",
                        val: "a"
                    },
                    //  d
                    {
                        key: "!wN",
                        val: "D"
                    },
                    {
                        key: "!wn",
                        val: "d"
                    },
                    // z
                    {
                        key: "!wJ",
                        val: "Z"
                    },
                    {
                        key: "!wj",
                        val: "z"
                    },
                    // t
                    {
                        key: "!wH",
                        val: "T"
                    },
                    {
                        key: "!wh",
                        val: "t"
                    },
                    // s
                    {
                        key: "!wF",
                        val: "S"
                    },
                    {
                        key: "!wf",
                        val: "s"
                    },

                    // k
                    {
                        key: "!wB",
                        val: "K"
                    },
                    {
                        key: "!wb",
                        val: "k"
                    },
                    // g
                    {
                        key: "!wC",
                        val: "G"
                    },
                    {
                        key: "!wc",
                        val: "g"
                    },

                    // y
                    {
                        key: "!wX",
                        val: "Y"
                    },
                    {
                        key: "!wx",
                        val: "y"
                    },
                    // l
                    {
                        key: "!wO",
                        val: "L"
                    },
                    {
                        key: "!wo",
                        val: "l"
                    },
                ]
                var s=str+"";
                arr.forEach(c => {
                    let reg = new RegExp(c.key, "g");
                    s = s.replace(reg, c.val);
                })
                console.log(s, '解码结果')
                return s;
            },
            // 处理url
            clUrl() {
                let url = decodeURIComponent(window.location.href);
                console.log(url, 'rul')
                let params = url.split('?');
                params.splice(0, 1);
                let arrparams = [];
                params.forEach(c => {
                    arrparams = [...arrparams, ...c.split('&')]
                })
                // 取出参数
                var obj = {};
                for (var i = 0; i < arrparams.length; i++) {
                    var item = arrparams[i].split('=');
                    var key = item[0];
                    let index = item[1].indexOf('#')
                    var value = index >= 0 ? item[1].substring(0, index) : item[1]
                    obj[key] = value;
                }

                return obj
            }
        },
        created() {
            // this.enCodeBank("0001391411test01");
            let obj = this.clUrl();
            if (!obj.t) {
                this.$nextTick(_ => {
                    this.$parent.mode = 'USERNAME-PWD';
                })
                return
            }
            this.usernames = [{
                name: obj.u
            }
            ];
            // 解析后时间戳
            let jxSj = this.deCode(obj.t);

            let date = (new Date()).getTime();
            console.log(jxSj, date, "时间搓比较");
            // 判定是否过期
            if (jxSj < date) {
                this.$message.error('证书已过期请重新获取！');
                return
                // 跳转到获取证书的页面
                window.location.href = '#'
            }

            if (!obj.u) {
                this.$message.error('验证失败,请使用账号登录！');
                this.$nextTick(_ => {
                    this.$parent.mode = 'USERNAME-PWD';
                })
                return false;
            }
            if (this.usernames.length > 0) {
                this.ruleForm.username = this.deCodeBank(this.usernames[0].name);
            }
            // return
            this.$nextTick(_ => {
                let tid = setTimeout(() => {
                    if (this.usernames.length == 1) {
                        this.submit();
                    }
                    clearTimeout(tid);
                }, 500)

            })
        },
        mounted() {
            // try {
            //     this.device = new Device(DEVICE_SKF);
            // } catch (e) {
            //     console.error(e)
            //     this.controlUnInstall = true
            //     // this.$message.error("key连接建立失败,请联系管理员");
            //     return;
            // }
            // this.controlUnInstall = false
            // this.timer = setInterval(_ => {
            //     this.refreshCerts()
            // }, 3000);
            // this.refreshCerts()

        },
        beforeDestroy() {
            if (this.timer) {
                clearInterval(this.timer)
            }
        },
        components: {}
    }
</script>

<style lang="less" scoped>
    .login-btn {
        text-align: center;
    }

    .login-btn button {
        width: 100%;
        height: 36px;
        margin-bottom: 10px;
    }

    .login-tips {
        font-size: 12px;
        line-height: 30px;
        color: #fff;
    }
</style>
