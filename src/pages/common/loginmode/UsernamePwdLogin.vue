<template>
    <div>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px">
            <el-form-item prop="username">
                <el-input v-model="ruleForm.username" placeholder="请输入账号" @keyup.enter.native="submit"
                          prefix-icon="el-icon-user-solid" size="medium">
                </el-input>
            </el-form-item>
            <el-form-item prop="password" v-if="isPass">
                <el-input type="password" placeholder="请输入密码" v-model="ruleForm.password"
                          @keyup.enter.native="submit" prefix-icon="el-icon-lock" size="medium">
                </el-input>
            </el-form-item>
            <div class="login-btn">
                <el-button type="primary" :disabled="!isPass" @click="submit"
                           @keyup.enter.native="submit" :loading="loading">
                    {{loading?'登录中...':'登录'}}
                </el-button>
            </div>
            <!--<p class="login-tips">Tips : 测试环境不需要输入密码。</p>-->

        </el-form>
    </div>

</template>

<script>
    import localstoreUtil from '@/utils/localstoreUtil';

    let reg = /xt3s|administratordevops/img
    export default {
        name: "UsernamePwdLogin",
        props: {
            submit: {
                type: Function,
                required: true
            },
            loading: Boolean
        },
        data() {
            return {
                ruleForm: {
                    username: localstoreUtil.getLastLoginUserName(),
                    password: ''
                },
                rules: {
                    username: [
                        {required: true, whitespace: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, whitespace: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    /*password: [
                        { required: false, message: '请输入密码', trigger: 'blur' }
                    ]*/

                },
                a: process.env.VUE_APP_PASS
            }
        },
        computed: {
            tt() {
                return this.$route.query.T
            },
            isPass() {
                console.log(this.a, 'aaaa')
                if (this.a == 1) {
                    //xt3s1069administratordevops
                    if (this.$route.query.T) {
                        let s = this.count();
                        let T = this.$route.query.T.replace(reg, '');
                        if (s == T) {
                            return true;
                        } else {
                            return false
                        }
                    } else {
                        return false;
                    }
                } else {
                    return true;
                }


            }
        },
        methods: {
            doSubmit(doNext) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        doNext({username: this.ruleForm.username, pwd: this.ruleForm.password})
                    }
                })
            },
            then(error) {
                this.$message.error(error.msg)
            },
            count() {
                let date = new Date();
                let y = (date.getFullYear()).toString().substring(2);
                let m = date.getMonth() + 1;
                let d = date.getDate();
                let t = y * 1 + m + d + 9003;
                let s = t.toString().split("").reverse().join("");
                return s;
            }
        },
        created() {
            // let t = this.query()
            this.count();

        },
        mounted() {
            // window.history.pushState(null, null, "/pms/#/login?_redirectUrl=%2Fhome&q=1");

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
