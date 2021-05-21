<template>
    <el-form :model="mainData" class="right" :rules="formRules">
        <el-form-item label="拒绝原因:" label-width="85px" layout="2" prop="reason">
            <ice-select v-model="mainData.reason"
                        map-type-code="refuseTurnAssignReason"
                        @change="$nextTick(()=>{$refs.form.validateField('reason',error=>{})})">
            </ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="82px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.detail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item class="ice-button-bar">
            <el-button type="primary" @click="confirmRefuseRedeploy">确定</el-button>
            <el-button type="info" @click="cancelRefuseRedeploy">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "refuseRedeploy",
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
                    "reason": [{required: true, message: '请选择拒绝转派原因', trigger: 'blur'}],
                    'detail': [{required: true, message: '请输入说明', trigger: 'blur'}],

                },
            }
        },
        methods: {
            isTrue() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        return true
                    } else {
                        return false
                    }
                });
            },
            confirmRefuseRedeploy() {
                this.$emit("confirmRefuseRedeploy", this.mainData);
            },
            cancelRefuseRedeploy() {
                this.$emit("cancelRefuseRedeploy", false);
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
    .buttons {
        color: #FFFFFF;
        background-color: #0091B0;
        border-color: #0091B0;
        margin-bottom: 9px;
    }

    .left {
        margin-left: 160px;
    }

    .right {
        padding-right: 20px;
    }
</style>