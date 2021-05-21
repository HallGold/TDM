<template>
    <div class="form-content">
        <el-form :model="mainData"
                 :rules="rulesReport"
                 ref="form"
                 :disabled="!isEdit"
                 label-width="110px">
            <ice-grid-layout :columns="3" name="附加属性">
                <el-form-item label="来源" prop="extendData.origin">
                    <el-select v-model="mainData.extendData.origin">
                        <el-option v-for="item in ENUMS.FUNDS_SOURCE_DATA"
                                   :key="Number(item.code)"
                                   :label="item.name"
                                   :value="Number(item.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部署模式" prop="extendData.deployMode">
                    <el-select v-model="mainData.extendData.deployMode">
                        <el-option v-for="item in ENUMS.DEPLOY_MODE_DATA"
                                   :key="Number(item.code)"
                                   :label="item.name"
                                   :value="Number(item.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统级别" prop="extendData.systemLevel" v-if="false">
                    <el-select v-model="mainData.extendData.systemLevel">
                        <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="功能描述" prop="extendData.functionalDesc" layout="3">
                    <el-input v-model="mainData.extendData.functionalDesc" type="textarea" rows="3">
                    </el-input>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import {resetRule} from "@/pages/biz/dev/js/comm/devT.js";

    export default {
        name: "additiveProperty",
        components: {IceGridLayout},
        mixins: [bizComm, devComm],
        props: {
            mainData: {},//表单对象
            isEdit: {//是否为编辑状态
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                rulesReport: {//表单字段规则
                    'extendData.origin': [{required: false, message: '请选择来源', trigger: 'blur'}],
                    'extendData.deployMode': [{required: false, message: '请选择部署模式', trigger: 'blur'}],
                    'extendData.systemLevel': [{required: true, message: '请选择系统级别', trigger: 'blur'}],
                }
            }
        },
        methods: {
            /**获取当前组件的数据*/
            getData() {
                return this.mainData;
            },
            /**表单验证的规则返回的promise*/
            validateData() {
                return this.$refs.form.validate();
            },
            /**清除表单验证*/
            clearValidateAdditive() {
                this.$refs.form.clearValidate();
            },
            initControls() {
                //设置页面规则
                resetRule(this.rulesReport, this.mainData.commDTO.category, this.mainData.commDTO.childType);
            }
        },
        mounted() {
            //初始化经费来源,部署模式,系统级别
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE,
                this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE).then(() => {
                this.initPageOver();
                this.initControls();
            });
        }
    }
</script>

<style scoped>
    .form-content {
        width: 100%;
    }
</style>