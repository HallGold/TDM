<template>
    <div class="content-filled">
        <el-form :model="ruleForm" :rules="rules" ref="ruleFormRef">
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="原密码" prop="pass" label-width="100px">
                        <el-input v-model="ruleForm.pass" placeholder="请输入原密码" type="password"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="新密码" prop="newpass" label-width="100px">
                        <el-input v-model="ruleForm.newpass" placeholder="请输入新密码" id="newkey" type="password"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row :gutter="60">
                <el-col :span="24">
                    <el-form-item label="重复新密码" prop="checknewpass" label-width="100px">
                        <el-input v-model="ruleForm.checknewpass" placeholder="请再次输入新密码" id='newkey1' type="password"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
    export default {
        name: "ResetPwd",
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === "") {
                    callback(new Error("请再次输入密码"));
                } else if (value !== this.ruleForm.newpass) {
                    callback(new Error("两次输入密码不一致!"));
                } else {
                    callback();
                }
            };
            return {
                ruleForm:{},
                rules: {
                    pass: [{required: true, message: "请输入密码"}],
                    newpass: [{required: true, message: "请输入新密码"}],
                    checknewpass: [{required: true, validator: validatePass2, trigger: "blur"}]
                }
            }
        },
        methods:{

        }
    }
</script>

<style scoped>

</style>
