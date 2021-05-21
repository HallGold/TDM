<template>
    <el-form :model="mainData" class="right" :rules="formRules" rer="form">
        <el-form-item label="拒绝挂起原因:" label-width="85px" layout="2" prop="reason">
            <ice-select v-model="mainData.reason"
                        map-type-code="refuseHangUpReason"
                        @change="$nextTick(()=>{$refs.form.validateField('reason',error=>{})})"></ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="82px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button type="primary" @click="confirmRefuseHangUp">确定</el-button>
            <el-button type="info" @click="cancelRefuseHangUp">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "refuseHangUp",
        data() {
            return {
                mainData: {
                    workTicket: "",
                    operationType: "",
                    reason: "",
                    detail: "",
                    nextEngineer: ""
                },
                formRules: {
                    "reason": [{required: true, message: '拒绝挂起原因', trigger: 'blur'}],
                    'detail': [{required: true, message: '说明', trigger: 'blur'}],

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
            confirmRefuseHangUp() {
                this.$emit("confirmRefuseHangUp", this.mainData);
            },
            cancelRefuseHangUp() {
                this.$emit("cancelRefuseHangUp", false);
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
        margin-left: 160px;
    }

    .right {
        padding-right: 20px;
    }
</style>