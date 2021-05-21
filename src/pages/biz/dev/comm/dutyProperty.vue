<template>
    <div class="form-content">
        <el-form :model="mainData.commDTO"
                 :rules="rulesReport"
                 ref="form"
                 :disabled="!isEdit"
                 label-width="100px">
            <ice-grid-layout :columns="2" name="责任相关">
                <el-form-item label="责任人" prop="dutyName">
                    <ice-persion-selector
                            choose-item="single"
                            mode="onlySelect"
                            :allDept="true"
                            v-model="mainData.commDTO.dutyName"
                            @select-confirm="blameSelectUser"></ice-persion-selector>
                </el-form-item>
                <el-form-item label="所属部门" prop="deptName">
                    <el-input v-model="mainData.commDTO.deptName" :readonly="true"></el-input>
                </el-form-item>
                <el-form-item label="使用人" prop="userName">
                    <ice-persion-selector
                            choose-item="single"
                            mode="onlySelect"
                            :allDept="true"
                            v-model="mainData.commDTO.userName"
                            @select-confirm="useSelectUser"></ice-persion-selector>
                </el-form-item>
                <el-form-item label="使用部门" prop="userDeptName">
                    <el-input v-model="mainData.commDTO.userDeptName" :readonly="true"></el-input>
                </el-form-item>
            </ice-grid-layout>
            <el-input v-model="mainData.commDTO.dutyCode" v-if="false"></el-input>
            <el-input v-model="mainData.commDTO.deptCode" v-if="false"></el-input>
            <el-input v-model="mainData.commDTO.userCode" v-if="false"></el-input>
            <el-input v-model="mainData.commDTO.userDeptCode" v-if="false"></el-input>
            <el-input v-model="mainData.commDTO.dutyOrgCode" v-if="false"></el-input>
            <el-input v-model="mainData.commDTO.deptOrgCode" v-if="false"></el-input>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import {resetRule} from "@/pages/biz/dev/js/comm/devT.js";

    export default {
        name: "dutyProperty",
        components: {IcePersionSelector, IceGridLayout},
        mixins: [devComm],
        props: {
            mainData: {},//表单对象
            isEdit: {//是否为编辑状态
                type: Boolean,
                default: false
            }
        },
        data() {
            let _this = this;
            let validateText = function (rule, value, callback) {
                if (_this.mainData.commDTO.dutyName == "" && rule.field == 'dutyName') {
                    callback(new Error(rule.message));
                } else if (_this.mainData.commDTO.userName == '' && rule.field == 'userName') {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            return {
                rulesReport: {//表单字段规则
                    dutyName: [{required: true, message: '请选择责任人', validator: validateText}],
                    deptName: [{required: true, message: '请输入责任人部门', trigger: 'blur'}],
                    userName: {required: true, message: '请选择使用人', validator: validateText},
                    userDeptName: [{required: true, message: '请输入使用人部门', trigger: 'blur'}]
                }
            }
        },
        methods: {
            /**责任人*/
            blameSelectUser(row) {
                console.log(row);
                this.mainData.commDTO.deptName = row[0].deptShortName;//责任部门
                this.mainData.commDTO.deptCode = row[0].deptCode;//责任部门code
                this.mainData.commDTO.deptOrgCode = row[0].dataOrgCode;//责任部门orgcode
                this.mainData.commDTO.dutyCode = row[0].deptCode;//责任人部门code
                this.mainData.commDTO.dutyOrgCode = row[0].dataOrgCode;//责任人部门orgcode
                this.mainData.commDTO.dutyOrgName = row[0].orgShortName;//责任部门orgName
                //如果使用人为空，将责任人信息--》使用人
                if (!this.mainData.commDTO.userName) {
                    this.mainData.commDTO.userName = row[0].name;//使用人name
                    this.mainData.commDTO.userCode = row[0].code;//使用人code
                    this.mainData.commDTO.userDeptName = row[0].deptShortName;//使用人部门
                    this.mainData.commDTO.userDeptCode = row[0].deptCode;//使用人部门code
                }
            },
            /**使用人*/
            useSelectUser(row) {
                this.mainData.commDTO.userCode = row[0].code;//使用人code
                this.mainData.commDTO.userDeptName = row[0].deptShortName;//使用人部门
                this.mainData.commDTO.userDeptCode = row[0].deptCode;//使用人部门code
            },
            /**表单验证的规则返回的promise*/
            validateData() {
                return this.$refs.form.validate();
            },
            initControls() {
                //设置页面规则
                resetRule(this.rulesReport, this.mainData.commDTO.category, this.mainData.commDTO.childType);
            }
        }, mounted() {
            this.initPageOver();
            this.initControls();
        }
    }
</script>

<style scoped>
    .form-content {
        width: 100%;
    }
</style>