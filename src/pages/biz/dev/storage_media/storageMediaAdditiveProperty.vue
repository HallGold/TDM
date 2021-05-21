<template>
    <div class="form-content">
        <el-form :model="mainData"
                 :rules="rulesReport"
                 ref="form"
                 :disabled="!isEdit"
                 label-width="110px">
            <ice-grid-layout :columns="3" name="附加属性">
                <el-form-item label="设备编号" prop="commDTO.devSn">
                    <el-input v-model="mainData.commDTO.devSn"></el-input>
                </el-form-item>

                <el-form-item label="设备型号" prop="commDTO.model">
                    <el-input v-model="mainData.commDTO.model"></el-input>
                </el-form-item>
                <el-form-item label="盘柜编号" prop="extendData.trayNo">
                    <el-input v-model="mainData.extendData.trayNo"></el-input>
                </el-form-item>
                <el-form-item label="购置价(元)" prop="commDTO.price">
                    <el-input v-model="mainData.commDTO.price"></el-input>
                </el-form-item>
                <el-form-item label="容量" prop="extendData.capacity">
                    <el-input v-model="mainData.extendData.capacity"></el-input>
                </el-form-item>
                <el-form-item label="出厂日期" prop="commDTO.birthDate">
                    <el-date-picker v-model="mainData.commDTO.birthDate" @change="changeBirthDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="购置时间" prop="commDTO.buyDate">
                    <el-date-picker v-model="mainData.commDTO.buyDate"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"></el-date-picker>
                </el-form-item>
                <el-form-item label="质保期" prop="commDTO.qualityDate">
                    <el-date-picker v-model="mainData.commDTO.qualityDate"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"></el-date-picker>
                </el-form-item>
                <el-form-item label="经费来源">
                    <el-select v-model="mainData.commDTO.fundsSource">
                        <el-option v-for="item in ENUMS.FUNDS_SOURCE_DATA"
                                   :key="Number(item.code)"
                                   :label="item.name"
                                   :value="Number(item.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="软件识别编号" prop="extendData.softwareNo">
                    <el-input v-model="mainData.extendData.softwareNo"></el-input>
                </el-form-item>
                <el-form-item label="出厂编号(SN)" prop="commDTO.birthSn">
                    <el-input v-model="mainData.commDTO.birthSn"></el-input>
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
            let _this = this;
            let validateDevSnV = function (rule, value, callback) {
                if (value === '') {
                    callback(new Error("请输入设备编号"));
                } else {
                    _this.validateSn({
                        devId: _this.mainData.commDTO.oid,
                        devSn: _this.mainData.commDTO.devSn
                    }).then(res => {
                        if (!res.devSn) {
                            callback(new Error("设备编号重复"));
                        } else {
                            callback();
                        }
                    });
                }
            };
            return {
                rulesReport: {//表单字段规则
                    'commDTO.devSn': [{
                        required: true,
                        whitespace: true,
                        trigger: 'blur',
                        validator: validateDevSnV
                    }],
                    'extendData.softwareNo': [{
                        required: true,
                        whitespace: true,
                        message: '请输入软件识别编号',
                        trigger: 'blur'
                    }],
                    'commDTO.model': [{required: true, whitespace: true, message: '请输入设备型号', trigger: 'blur'}],
                    'commDTO.qualityDate': [{required: true, message: '请输入质保期', trigger: 'blur'}],
                    'extendData.capacity': [{required: true, message: '请输入容量', trigger: 'blur'}],
                    'commDTO.birthSn': [{required: true, message: '请输入出厂编号', trigger: 'blur'}],
                    'commDTO.birthDate': [{required: true, message: '请输入出厂日期', trigger: 'blur'}],
                    'commDTO.buyDate': [{required: true, message: '请输入购置时间', trigger: 'blur'}],
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
            /**时间过滤*/
            timeFilter(time) {
                if (time < this.mainData.commDTO.birthDate) {
                    return true
                }
                return false;
            },
            /**出厂日期改变--其他日期是否变化*/
            changeBirthDate() {
                if (this.mainData.commDTO.birthDate > this.mainData.commDTO.buyDate) {
                    this.mainData.commDTO.buyDate = '';
                }
                if (this.mainData.commDTO.birthDate > this.mainData.commDTO.qualityDate) {
                    this.mainData.commDTO.qualityDate = '';
                }
            },
            initControls() {
                //设置页面规则
                resetRule(this.rulesReport, this.mainData.commDTO.category, this.mainData.commDTO.childType);
            }
        },
        async mounted() {
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE).then(() => {
                this.initPageOver();
                this.initControls();
            });//初始化经费来源
        }
    }
</script>

<style scoped>
    .form-content {
        width: 100%;
    }
</style>