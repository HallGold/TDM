<template>
    <el-form :model="mainData" class="right" :rules="formRules">
        <el-form-item label="挂起时长(小时):" label-width="120px" layout="2" prop="reason">
            <el-input v-model="mainData.hangUpTime" type="number" min="1" max="1000"></el-input>
        </el-form-item>
        <el-form-item label="挂起说明:" label-width="120px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button type="primary" @click="confirmAffirmHangUp">确定</el-button>
            <el-button type="info" @click="cancelAffirmHangUp">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "affirmHangUp",
        data() {
            return {
                mainData: {
                    workTicket: "",
                    operationType: "",
                    reason: "",
                    detail: "",
                    hangUpTime: 0
                },
                formRules: {
                    "hangUpTime": [{required: true, message: '请输入挂起时长', trigger: 'blur'}],
                    "detail": [{required: true, message: '请输入说明', trigger: 'blur'}],
                },
            }
        },
        methods: {
            /*校验是否为空*/
            isTrue() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        return true
                    } else {
                        return false
                    }
                });
            },
            getIsTrue() {
                return this.isTrueValue;
            },
            confirmAffirmHangUp() {
                this.$emit("confirmAffirmHangUp", this.mainData);
            },
            cancelAffirmHangUp() {
                this.$emit("cancelAffirmHangUp", false);
            }
        },

        components: {
            IcePersionSelector,
            IceSelect,
            Validator
        }
    }
</script>

<style scoped>
    .left {
        margin-left: 200px;
    }

    .right {
        padding-right: 20px;
    }
</style>