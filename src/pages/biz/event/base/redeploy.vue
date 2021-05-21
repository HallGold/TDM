<template>
    <el-form :model="mainData" class="right" :rules="formRules" ref="form">
        <el-form-item label="转派原因:" label-width="85px" layout="2" prop="reason">
            <ice-select
                    v-model="mainData.reason"
                    map-type-code="turnAssignReason">
            </ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="82px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item label="推荐工程师:" label-width="105px" layout="2" prop="nextEngineer">
            <next-engineer title="请选择"
                           v-model="mainData.nextEngineer"
                           choose-item="single"
                           @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
            </next-engineer>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button type="primary" @click="confirmShift">确定</el-button>
            <el-button type="info" @click="cancelShift">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import nextEngineer from "./nextEngineer"
    import IceSelect from '../../../../components/common/base/IceSelect';
    import Validator from "./Validator";


    export default {
        name: "redeploy.vue",
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
                    "reason": [{required: true, message: '请选择转派原因', trigger: 'blur'}],
                    "detail": [{required: true, message: '请输入说明', trigger: 'blur'}],
                },
            }
        },
        methods: {
            /*校验表格*/
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
            confirmShift() {
                this.$emit("confirmShift", this.mainData);
            },
            cancelShift() {
                this.$emit("cancelShift", false);
            }
        },

        components: {
            /*IcePersionSelector,*/
            IceSelect,
            Validator,
            nextEngineer
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