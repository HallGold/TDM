<template>
    <el-form :model="mainData" class="right" :rules="formRules" ref="form">
        <el-form-item label="未解决原因:" label-width="100px" layout="2" prop="reason">
            <ice-select v-model="mainData.undoneReason"
                        map-type-code="noSolve"
                        @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
            </ice-select>
        </el-form-item>
        <el-form-item label="说明:" label-width="100px" prop="detail" layout="3" style="min-height: 40px">
            <el-input v-model="mainData.undoneDetail" type="textarea" rows="6" class="textarea">
            </el-input>
        </el-form-item>
        <el-form-item label="" label-width="" class="ice-button-bar">
            <el-button type="primary" class="buttons" @click="confirmAppraiseUnsolved">确定</el-button>
            <el-button type="info" class="buttons" @click="cancelAppraiseUnsolved">取消</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import Validator from "./Validator";

    export default {
        name: "appraiseUnsolved",
        data() {
            return {
                mainData: {
                    ticketNumber: "",
                    undoneReason: "",
                    undoneDetail: "",
                    isDone: ""
                },
                formRules: {
                    "undoneReason": [{required: true, message: '请选择未解决原因', trigger: 'blur'}],
                    'undoneDetail': [{required: true, message: '输入说明', trigger: 'blur'}],
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
            confirmAppraiseUnsolved() {
                this.$emit("confirmAppraiseUnsolved", this.mainData);
            },
            cancelAppraiseUnsolved() {
                this.$emit("cancelAppraiseUnsolved", false);
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