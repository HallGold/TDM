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
                <el-form-item label="出厂编号" prop="commDTO.birthSn">
                    <el-input v-model="mainData.commDTO.birthSn"></el-input>
                </el-form-item>
                <el-form-item label="出厂日期" prop="commDTO.birthDate">
                    <el-date-picker v-model="mainData.commDTO.birthDate" @change="changeBirthDate"></el-date-picker>
                </el-form-item>
                <el-form-item label="购置价(元)" prop="commDTO.price">
                    <el-input v-model="mainData.commDTO.price"></el-input>
                </el-form-item>
                <el-form-item label="购置时间" prop="commDTO.buyDate">
                    <el-date-picker v-model="mainData.commDTO.buyDate"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"></el-date-picker>
                </el-form-item>
                <el-form-item label="经费来源" prop="commDTO.origin">
                    <el-select v-model="mainData.extendData.origin">
                        <el-option v-for="item in ENUMS.FUNDS_SOURCE_DATA"
                                   :key="Number(item.code)"
                                   :label="item.name"
                                   :value="Number(item.code)"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="质保期" prop="commDTO.qualityDate">
                    <el-date-picker v-model="mainData.commDTO.qualityDate"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"></el-date-picker>
                </el-form-item>
                <el-form-item label="IP地址(主)" prop="commDTO.masterIp">
                    <el-input v-model="mainData.commDTO.masterIp"></el-input>
                </el-form-item>
                <el-form-item label="设备形态" prop="extendData.shape">
                    <el-select v-model="mainData.extendData.shape">
                        <el-option v-for="item in ENUMS.SHAPE_TYPE_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统版本" prop="extendData.osVersion">
                    <el-select v-model="mainData.extendData.osVersion">
                        <el-option v-for="item in ENUMS.DEV_VERSION_DATA"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统安装时间" prop="extendData.setupDate">
                    <el-date-picker v-model="mainData.extendData.setupDate"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"></el-date-picker>
                </el-form-item>
                <el-form-item label="是否终端" prop="extendData.terminal">
                    <el-select v-model="mainData.extendData.terminal">
                        <el-option v-for="item in ENUMS.TRUE_AND_FALSE.properties"
                                   :key="item.code"
                                   :label="item.name"
                                   :value="item.code"></el-option>
                    </el-select>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import {validateIP} from "@/pages/system/comm/Validator.js"

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
                    'commDTO.devSn': [{required: true, whitespace: true, message: '请输入设备编号', trigger: 'blur'}],
                    'commDTO.model': [{required: true, whitespace: true, message: '请输入设备型号', trigger: 'blur'}],
                    'commDTO.birthSn': [{required: true, whitespace: true, message: '请输入出厂编号', trigger: 'blur'}],
                    'commDTO.birthDate': [{required: true, message: '请输入出厂日期', trigger: 'blur'}],
                    'commDTO.buyDate': [{required: true, message: '请输入购置时间', trigger: 'blur'}],
                    'commDTO.qualityDate': [{required: true, message: '请输入保质期', trigger: 'blur'}],
                    'extendData.shape': [{required: true, message: '请选择设备形态', trigger: 'blur'}],
                    'extendData.osVersion': [{required: true, message: '请选择系统版本', trigger: 'blur'}],
                    'extendData.setupDate': [{required: true, message: '请输入系统安装日期', trigger: 'blur'}],
                    'commDTO.masterIp':[{validator: validateIP, trigger: 'blur'},{ required: true, message: '请输入IP地址', trigger: 'blur' },],
                    'extendData.terminal': [{required: true, message: '请选择是否终端', trigger: 'blur'}],
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
                if (this.mainData.commDTO.birthDate > this.mainData.extendData.setupDate) {
                    this.mainData.extendData.setupDate = '';
                }
            }
        },
        async mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(
                    this.ENUMS.DATA_DICTIONARY.DEV_VERSION.CODE,//初始化系统版本
                    this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE),//初始化经费来源
                this.requestEnumsShapeTypeData()//初始化设备形态
            ];
            Promise.all(prepareTaskChain).then();
        }
    }
</script>

<style scoped>
    .form-content {
        width: 100%;
    }
</style>