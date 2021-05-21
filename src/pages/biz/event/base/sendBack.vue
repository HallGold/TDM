<template>
    <el-form :model="mainData" class="right" :rules="formRules" ref="form">
        <el-form-item label="退回原因:" label-width="85px" layout="2" prop="reason">
            <ice-select v-model="mainData.reason"
                        map-type-code="returnReason"
                        @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
            </ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="82px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button type="primary" @click="confirmReturn">确定</el-button>
            <el-button type="info" @click="cancelReturn">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "sendBack",
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
                    "reason": [{required: true, message: '请选择退回原因', trigger: 'blur'}],
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
            confirmReturn() {
                this.$emit("confirmReturn", this.mainData);
            },
            cancelReturn() {
                this.$emit("cancelReturn", false);
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