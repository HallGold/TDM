<template>
    <el-form :model="mainData" class="right" :rules="formRules" ref="form">
        <el-form-item label="拒绝返工原因:" label-width="100px" layout="2" prop="reason">
            <ice-select v-model="mainData.reason"
                        map-type-code="sendBackReason"
                        @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
            </ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="100px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button @click="confirmRefuseRework">确定</el-button>
            <el-button @click="cancelRefuseRework">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "refuseRework",
        data() {
            return {
                mainData: {
                    serviceTicket: "",
                    operationType: "",
                    reason: "",
                    detail: "",
                },
                formRules: {
                    "reason": [{required: true, message: '请选择拒绝返工原因', trigger: 'blur'}],
                    'detail': [{required: true, message: '输入说明', trigger: 'blur'}],
                },
                isTrueValue: false,
            }
        },
        methods: {
            /*校验是否为空*/
            isTrue() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.isTrueValue = true;
                        return true
                    } else {
                        this.isTrueValue = false;
                        return false
                    }
                });
            },
            getIsTrue() {
                return this.isTrueValue;
            },
            confirmRefuseRework() {
                this.$emit("confirmRefuseRework", this.mainData);
            },
            cancelRefuseRework() {
                this.$emit("cancelRefuseRework", false);
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

</style>