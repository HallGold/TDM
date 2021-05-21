<template>
    <el-form :model="form" :rules="formRules" ref="form">
        <ice-grid-layout :columns="2" name="">
            <el-form-item label="响应速度:" label-width="105px" prop="responseSpeed">
                <el-rate
                        v-model="form.responseSpeed"
                ></el-rate>
            </el-form-item>
            <el-form-item label="处理速度:" label-width="105px" prop="disposeSpeed">
                <el-rate
                        v-model="form.disposeSpeed"
                ></el-rate>
            </el-form-item>
            <el-form-item label="服务态度:" label-width="105px" prop="servSpeed">
                <el-rate
                        v-model="form.servSpeed"
                ></el-rate>
            </el-form-item>
            <el-form-item label="专业能力:" label-width="105px" prop="ability">
                <el-rate
                        v-model="form.ability"
                ></el-rate>
            </el-form-item>
            <el-form-item layout="2" label="总分:" label-width="105px" prop="totalScore">
                <el-input v-model="form.totalScore" readonly></el-input>
            </el-form-item>
            <el-form-item layout="2" label="评价:" label-width="105px" prop="evaluation">
                <el-input type="textarea" rows="6" v-model="form.evaluation"></el-input>
            </el-form-item>
        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";

    export default {
        name: "evaluate",
        components: {IceGridLayout},
        props: {
            form: {}
        },
        data() {
            return {
                formRules: {
                    'totalScore': [{required: true, message: '请打分', trigger: 'blur'}]
                },
                formRulesT: {
                    'totalScore': [{required: true, message: '请打分', trigger: 'blur'}],
                    "evaluation": [{required: true, message: '请输入原因', trigger: 'blur'}]
                },
                formRulesTs: {
                    'totalScore': [{required: true, message: '请打分', trigger: 'blur'}],
                }
            }
        },
        beforeUpdate() {
            if (!!this.form.responseSpeed && !!this.form.disposeSpeed && !!this.form.servSpeed && !!this.form.ability) {
                this.form.totalScore = (this.form.responseSpeed + this.form.disposeSpeed + this.form.servSpeed + this.form.ability) * 0.25;
            }
        },
        methods: {
            /*重置评价页面数据*/
            refNum() {
                this.$refs.form.resetFields();
            },
            isOK() {
                let flag = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            }
        },
        watch: {
            "form.totalScore": function (nowVal) {
                if (nowVal < 4) {
                    this.formRules = {};
                    Object.assign(this.formRules, this.formRulesT);
                } else {
                    this.formRules = {};
                    Object.assign(this.formRules, this.formRulesTs);
                    this.$refs.form.clearValidate("evaluation")
                }
            }
        }
    }
</script>

<style scoped>

</style>