<template>
    <el-form :model="realityForm" :rules="Rules" ref="form" :disabled="realityDisabled">
        <ice-grid-layout :columns="2" name="实际进入信息">
            <el-form-item label="是否进入:" label-width="140px" prop="isInto">
                <ice-select map-type-code="YES_NO" v-model="realityForm.isInto" @change="ynAccess"></ice-select>
            </el-form-item>
            <el-form-item label="工作内容:" label-width="140px" prop="workContent" v-if="showMsg">
                <el-input v-model="realityForm.workContent"></el-input>
            </el-form-item>
            <el-form-item label="实际进入时间:" label-width="140px" prop="actualIntoDate" v-if="showMsg">
                <ice-date-picker type="datetime" v-model="realityForm.actualIntoDate"
                                 @change="timeChange"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 :time-filter="stopTimeFilter"></ice-date-picker>
            </el-form-item>
            <el-form-item label="实际离开时间:" label-width="140px" prop="actualOutDate" v-if="showMsg">
                <ice-date-picker type="datetime" v-model="realityForm.actualOutDate"
                                 @change="timeChange"
                                 value-format="yyyy-MM-dd HH:mm:ss"
                                 format="yyyy-MM-dd HH:mm:ss"
                                 :time-filter="startTimeFilter"></ice-date-picker>
            </el-form-item>
            <el-form-item layout="2" label="实际携带物品情况:" label-width="140px" prop="actualCarryArticle" v-if="showMsg">
                <el-input v-model="realityForm.actualCarryArticle" type="textarea" resize="none" rows="4"></el-input>
            </el-form-item>
            <el-form-item label="安全保密教育情况:" label-width="140px" prop="isSave" v-if="showMsg">
                <ice-select map-type-code="YES_NO" v-model="realityForm.isSave"></ice-select>
            </el-form-item>
            <el-form-item v-if="showMsg">
                <i style="color: red">*是否告知进入人员安全保密事项</i>
            </el-form-item>
            <el-form-item layout="2" label="安全保密事项:" label-width="140px" porp="saveItem" v-if="showMsg">

                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <el-checkbox-group v-model="realityForm.saveItem" @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="item in options" :label="item" :key="item.value">{{item.label}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import empComm from './empComm.js'
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";

    export default {
        name: "reality",
        components: {IceDatePicker, IceSelect, IceGridLayout},
        props: {
            realityForm: {}
        },
        mixins: [empComm],
        data() {
            return {
                arr: [],
                checkAll: false,
                realityDisabled: false,
                isIndeterminate: false,
                isTrueValue: false,
                showMsg: true,
                conditionOptions: [],
                options: [],
                Rules: {
                    'isInto': [{required: true, message: '是否进入', trigger: 'blur'}],
                    'actualIntoDate': [{required: true, message: '实际进入时间', trigger: 'blur'}],
                    'actualOutDate': [{required: true, message: '实际离开时间', trigger: 'blur'}],
                    'actualCarryArticle': [{required: true, message: '实际携带物品情况', trigger: 'blur'}],
                    'workContent': [{required: true, message: '工作内容', trigger: 'blur'}],
                    'isSave': [{required: true, message: '安全保密教育情况', trigger: 'blur'}],
                    'saveItem': [{required: true, message: '安全保密事项', trigger: 'blur'}],
                }
            }
        },
        methods: {
            stopTimeFilter(time) {
                if (!this.realityForm.actualOutDate) {
                    return true
                }
                return time < new Date(this.realityForm.actualOutDate)
            },
            startTimeFilter(time) {
                if (!this.realityForm.actualIntoDate) {
                    return true
                }
                return time > new Date(this.realityForm.actualIntoDate)
            },
            /**时间发生改变*/
            timeChange() {
                if (this.realityForm.actualOutDate && this.realityForm.actualIntoDate && this.realityForm.actualIntoDate > this.realityForm.actualOutDate) {
                    this.$message.warning("完成处理时间不能小于开始处理时间");
                    this.realityForm.actualOutDate = "";
                }
            },
            async getData() {
                this.conditionOptions = await this.getDataMapListData('secretItem');
                for (let i = 0; i < this.conditionOptions.length; i++) {
                    let condition = {
                        value: this.conditionOptions[i].value,
                        label: this.conditionOptions[i].name
                    };
                    this.options.push(condition);
                }
                this.numSelect(this.options);
            },
            handleCheckAllChange(val) {
                this.realityForm.saveItem = val ? this.options : [];
                this.isIndeterminate = false;
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.options.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length;
            },
            /**页面禁用*/
            RDisabled(value) {
                this.realityDisabled = value;
            },
            /**页面校验*/
            pass() {
                if (this.realityForm.isInto == "0") {
                    this.isTrueValue = true;
                    return this.isTrueValue
                } else {
                    this.realityTrue();
                    return this.isTrueValue
                }
            },
            realityTrue() {
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
            /**是否进入条件*/
            ynAccess() {
                if (this.realityForm.isInto == "0") {
                    this.showMsg = false;
                } else {
                    this.showMsg = true;
                }
            },
            /**安全保密事项选择*/
            matterSelect(data) {
                this.arr = data;
            },
            /**数据回显*/
            numSelect(data) {
                this.$nextTick(() => {
                    let mm = [];
                    for (let i = 0; i < this.arr.length; i++) {
                        for (let j = 0; j < data.length; j++) {
                            if (this.arr[i] == data[j].value) {
                                mm.push(data[j]);
                            }
                        }
                    }
                    this.realityForm.saveItem = mm;
                    this.handleCheckedCitiesChange(mm);
                    if (mm.length == data.length) {
                        this.handleCheckAllChange(mm)
                    }
                });
            }
        },
        async mounted() {
            await this.initDatamapListTree();
            this.getData();
            this.ynAccess();
            let routeObj = this.$route.query;
            if (routeObj.button != undefined) {
                if (routeObj.button == "look") {
                    this.RDisabled(true);
                } else {
                    this.RDisabled(false);
                }
            }
        },
    }
</script>

<style scoped>

</style>