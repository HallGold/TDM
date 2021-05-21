<template>
    <el-form class="question-content" :model="formData" :rules="rules" label-position="right"
             :disabled="null!=directData"
             ref="form" style="margin-top: 10px;padding: 0 20px;">
        <el-row :gutter="60">
            <el-col :span="12">
                <el-form-item label="生效时间从:" label-width="100px" prop="startTime">
                    <ice-date-picker v-model="formData.startTime" max="scope:endTime" :scope="formData">
                    </ice-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="生效时间至:" label-width="100px" prop="endTime">
                    <ice-date-picker v-model="formData.endTime" min="scope:startTime" :scope="formData">
                    </ice-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="null==directData">
                <el-form-item label="发布部门:" label-width="100px" prop="deptScopes">
                    <ice-dept-selector v-model="formData.deptScopes" all-dept
                                       @select-confirm="selectConfirm"></ice-dept-selector>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="null==directData">
                <el-form-item label="发布指定人员:" label-width="100px" prop="persionScopes">
                    <ice-persion-selector v-model="formData.persionScopes" all-dept
                                          @select-confirm="selectPersionConfirm"></ice-persion-selector>
                </el-form-item>
            </el-col>
            <el-col :span="24" v-if="null!=directData">
                <el-form-item label="发布范围:" label-width="100px" prop="deptScopes">
                    <el-input v-model="formData.deptScopes"></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="24">
                <el-form-item label="发布说明:" label-width="100px" prop="remark">
                    <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                              v-model="formData.remark"></el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import QuestionView from "./widget/questionView";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";

    export default {
        name: "questionPublishDirect",
        components: {
            IcePersionSelector,
            QuestionView,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
            IceDeptSelector,
            IceDatePicker
        },
        props: {
            directData: Object
        },
        data() {
            return {
                isTrueValue: false,
                formData: {
                    startTime: '',
                    endTime: '',
                    deptScopes: '',
                    deptScope: [],
                    persionScopes: '',
                    persionScope: [],
                    remark: '',
                    afDate: ""
                },
                rules: {
                    startTime: {required: true, message: '生效时间不能为空'},
                    endTime: {required: true, message: '生效时间不能为空'},
                    /* deptScopes: {required: true, message: '发布部门不能为空'}*/
                }
            }
        },
        methods: {
            requiredTrue() {
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

            submit() {
                this.requiredTrue();
                if (this.isTrueValue) {
                    let scope = "";
                    if (this.formData.deptScopes || this.formData.persionScopes) {
                        if (this.formData.deptScopes && this.formData.persionScopes) {
                            scope = "部门：( " + this.formData.deptScopes + " ) ,个人：( " + this.formData.persionScopes + " )"
                        } else if (this.formData.deptScopes) {
                            scope = this.formData.deptScopes
                        } else if (this.formData.persionScopes) {
                            scope = this.formData.persionScopes
                        }
                        return {...this.formData, scope};
                    }
                    this.$message.warning("发布部门或者发布指定人员必须选择一个");
                    return false
                }
                return false
            },
            selectConfirm(items, texts, values) {
                this.formData.deptScope = items.map(item => {
                    return {
                        deptId: item.oid,
                        deptCode: item.deptCode,
                        deptLevCode: item.deptLevCode,
                        orgId: item.orgId,
                        orgCode: item.orgCode,
                        orgLevCode: item.orgLevCode,
                    }
                });
            },
            selectPersionConfirm(items, texts, values) {
                this.formData.persionScope = items.map(item => {
                    return {
                        persionCode: item.code,
                        deptId: item.dataDeptId,
                        deptCode: item.dataDeptCode,
                        deptLevCode: item.dataDeptLevcode,
                        orgId: item.dataOrgId,
                        orgCode: item.dataOrgCode,
                        orgLevCode: item.dataOrgLevcode,
                    }
                });
            },
        },
        mounted() {
            if (this.directData) {
                Object.assign(this.formData, this.directData);
            }
        }
    }
</script>

<style scoped>

</style>
