<template>
    <el-form :model="applyForm" :rules="Rules" ref="form" :disabled="applyDisabled">
        <ice-grid-layout :columns="2" name="进入申请">
            <el-form-item label="预计进入时间:" label-width="140px" prop="predictIntoDate">
                <ice-date-picker type="datetime" v-model="applyForm.predictIntoDate"
                                 @change="timeChange"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 :time-filter="stopTimeFilter"></ice-date-picker>
            </el-form-item>
            <el-form-item label="预计离开时间:" label-width="140px" prop="predictOutDate">
                <ice-date-picker type="datetime" v-model="applyForm.predictOutDate"
                                 @change="timeChange"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 :time-filter="startTimeFilter"></ice-date-picker>
            </el-form-item>
            <el-form-item label="申请进入部位:" label-width="140px" prop="name">
                <el-input v-model="applyForm.name" :readonly="true">
                    <i slot="suffix" class="el-icon-edit-outline el-input__icon" @click="checkDept"></i>
                </el-input>
            </el-form-item>
            <el-form-item label="受控类型:" label-width="140px" prop="manageType">
                <ice-datamap-translater
                        model="input"
                        :value="applyForm.manageType?applyForm.manageType:''"
                        mapTypeCode="controlledType">
                </ice-datamap-translater>
            </el-form-item>
            <el-form-item label="是否要害部位:" label-width="140px" prop="isCrucial">
                <el-radio-group v-model="applyForm.isCrucial" :disabled="true">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="要害部位责任单位:" label-width="140px" prop="unitName">
                <el-input :disabled="true" v-model="applyForm.unitName"></el-input>
                <el-input :disabled="true" v-model="applyForm.unit" v-if="false"></el-input>
            </el-form-item>
            <el-form-item label="是否接触涉密数据:" label-width="140px" prop="isContact">
                <el-radio-group v-model="applyForm.isContact">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="部位类型:" label-width="140px" prop="type" v-if="applyForm.manageType == '2'">
                <ice-datamap-translater
                        model="input"
                        :value="applyForm.type?applyForm.type:''"
                        mapTypeCode="specificType">
                </ice-datamap-translater>
            </el-form-item>
            <el-form-item layout="2" label="进入原因及主要工作内容:" label-width="140px" prop="content">
                <el-input type="textarea" resize="none" rows="6" v-model="applyForm.content"></el-input>
            </el-form-item>
            <el-form-item layout="3" label="进入人员信息:"></el-form-item>
            <el-form-item layout="3" label="">
                <access-pop :BizCrucialPointEnthetics="applyForm.BizCrucialPointEnthetics" ref="accessPop"></access-pop>
            </el-form-item>
            <el-form-item label="是否携带物品:" label-width="140px" prop="isCarry">
                <el-radio-group v-model="applyForm.isCarry">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="陪同人员:" label-width="140px" prop="escort">
                <ice-persion-selector
                        title="请选择"
                        :all-dept="true"
                        v-model="applyForm.escort"
                        @select-confirm="getPop"
                        choose-item="single"
                        mode="onlySelect"
                ></ice-persion-selector>
                <el-input :disabled="true" v-model="applyForm.escortId" v-if="false"></el-input>
            </el-form-item>
            <el-form-item layout="2" label="携带物品:" label-width="140px" v-if="sureThing" prop="predictCarry">
                <el-input type="textarea" resize="none" rows="4" v-model="applyForm.predictCarry"></el-input>
            </el-form-item>
            <el-form-item label="附件上传:" label-width="140px" layout="2">
                <span v-if="noneT">没有上传附件！</span>
                <ice-multiple-upload doSecret v-model="applyForm.targetId" value-model="string"></ice-multiple-upload>
            </el-form-item>
        </ice-grid-layout>
        <ice-pop-selector
                data-url="/biz/manage/searchByTypePage"
                :columns=columnsDept
                :query="query"
                mode="hidden"
                text-prop="unitname"
                code-prop="oid"
                @select-confirm="getDept"
                choose-item="single"
                ref="deptList"
        >
        </ice-pop-selector>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import AccessPop from "./accessPop";
    import {EventEmitter as $} from "events";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    import positionComm from "../position/positionComm.js"
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";

    export default {
        name: "applyFor",
        components: {
            IceDatamapTranslater,
            IceDatePicker,
            IcePopSelector, AccessPop, IceMultipleUpload, IceSelect, IceGridLayout, IcePersionSelector
        },
        mixins: [positionComm],
        props: {
            applyForm: {}
        },
        data() {
            return {
                noneT: false,
                applyDisabled: false,
                isTrueValue: false,
                sureThing: true,
                dataMessage: [],
                inLocations: ["1412调试间", "1412操作间", "1412配线间", "所B网操作间"],
                Rules: {
                    'escort': [{required: true, message: '请输入陪同人姓名', trigger: 'change'}],
                    'predictIntoDate': [{required: true, message: '请选择预计进入时间', trigger: 'blur'}],
                    'predictOutDate': [{required: true, message: '请选择预计离开时间', trigger: 'blur'}],
                    'isContact': [{required: true, message: '请选择是否涉密', trigger: 'blur'}],
                    'isCrucial': [{required: true, message: '请选择是否要害部位', trigger: 'blur'}],
                    'name': [{required: true, message: '请选择申请进入部位', trigger: 'change'}],
                    'content': [{required: true, message: '请输入进入原因', trigger: 'blur'}],
                    'isCarry': [{required: true, message: '是否携带物品', trigger: 'blur'}],
                    'predictCarry': [{required: true, message: '携带物品', trigger: 'blur'}],
                },
                columnsDept: [
                    {code: 'oid', hidden: true},
                    {label: '部位名称', code: 'name',},
                    {label: '受控类型', code: 'manageType', width: 90, mapTypeCode: "controlledType"},
                    {label: '部位类型', code: 'type', width: 90, mapTypeCode: "specificType"},
                    {label: '是否要害部位', code: 'isCrucial', mapTypeCode: 'YES_NO'},
                    {label: '责任部门', code: 'deptName',},
                    {label: '责任单位', code: 'unitName',},
                    {label: '责任单位Code', code: 'unit', hidden: true}
                ],
                query: [
                    {type: 'input', label: '部位名称', code: 'name', value: ""},
                    {type: 'input', label: '部位类型', code: 'type', value: ""},
                    {type: 'input', label: '是否要害部位', code: 'isCrucial', value: ""},
                    {type: 'input', label: '责任部门', code: 'deptName', value: ""},
                ],
            }
        },
        methods: {
            stopTimeFilter(time) {
                if (!this.applyForm.predictOutDate) {
                    return true
                }
                return time < new Date(this.applyForm.predictOutDate)
            },
            startTimeFilter(time) {
                if (!this.applyForm.predictIntoDate) {
                    return true
                }
                return time > new Date(this.applyForm.predictIntoDate)
            },
            /**时间发生改变*/
            timeChange() {
                if (this.applyForm.predictOutDate && this.applyForm.predictIntoDate && this.applyForm.predictIntoDate > this.applyForm.predictOutDate) {
                    this.$message.warning("完成处理时间不能小于开始处理时间");
                    this.applyForm.predictOutDate = "";
                }
            },
            noneText(data) {
                if (data == "FirstNode") {
                    this.noneT = false;
                } else if (data != "FirstNode" && this.applyForm.targetId == '') {
                    this.noneT = true;
                } else if (data != "FirstNode" && this.applyForm.targetId != '') {
                    this.noneT = false;
                }
            },
            /*校验进入人员信息*/
            acsPeople() {
                this.$refs.accessPop.isCanR();
                return this.$refs.accessPop.isCanR();
            },
            checkDept() {
                this.$refs.deptList.openDialog();
            },
            getDept(data) {
                this.applyForm.name = data[0].name;
                this.applyForm.type = data[0].type;
                this.applyForm.manageType = data[0].manageType;
                this.applyForm.isCrucial = data[0].isCrucial;
                this.applyForm.unitName = data[0].unitName;
                this.applyForm.unit = data[0].unit;
                this.applyForm.manageId = data[0].oid;
            },
            getPop(data) {
                this.applyForm.escortId = data[0].code;
            },
            /**页面禁用*/
            ADisabled(vale) {
                this.applyDisabled = vale;
            },
            /**校验*/
            isOk() {
                this.applyForTrue();
                return this.isTrueValue
            },
            applyForTrue() {
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
        },
        watch: {
            dataMessage(nowVal, oldVal) {
                this.applyForm.popMessage = nowVal;
            },
            "applyForm.isCarry": function (nowVal, oldVal) {
                if (nowVal == "1") {
                    this.sureThing = true;
                } else {
                    this.sureThing = false;
                }
            },
            deep: true
        }
    }
</script>

<style scoped>

</style>