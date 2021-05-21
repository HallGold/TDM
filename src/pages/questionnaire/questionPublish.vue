<template>

    <ice-flow-form :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                   :flow-biz-data="flowBizData">
        <el-form slot-scope="flowScope" :model="formData" :rules="rules" label-position="right"
                 ref="form" style="margin-top: 10px;padding: 0 20px;">
            <ice-grid-layout :columns="3" name="申请人">
                <el-form-item label="申请人" label-width="100px" prop="afUserName">
                    <el-input v-model="formData.afUserName" disabled placeholder="申请人"></el-input>
                </el-form-item>

                <el-form-item label="部门" label-width="100px" prop="afDepartmentName">
                    <el-input disabled placeholder="部门"
                              v-model="formData.afOrgName+'-'+formData.afDepartmentName"></el-input>
                </el-form-item>

                <el-form-item label="电话" label-width="100px" prop="afPhone">
                    <el-input v-model="formData.afPhone" disabled placeholder="电话"></el-input>
                </el-form-item>
            </ice-grid-layout>
            <ice-form-group name="发布信息">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="生效时间从:" label-width="100px" prop="startTime">
                            <ice-date-picker v-model="formData.startTime" max="scope:endTime" :scope="formData"
                                             value-format="yyyy-MM-dd"
                                             format="yyyy-MM-dd"
                                             @change="timeChange"
                                             :time-filter="stopTimeFilter"
                                             :disabled="flowScope.formReadonly">

                            </ice-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="生效时间至:" label-width="100px" prop="endTime">
                            <ice-date-picker v-model="formData.endTime" min="scope:startTime" :scope="formData"
                                             value-format="yyyy-MM-dd"
                                             format="yyyy-MM-dd"
                                             @change="timeChange"
                                             :time-filter="startTimeFilter"
                                             :disabled="flowScope.formReadonly">
                            </ice-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="发布部门:" label-width="100px" prop="deptScopes">
                            <ice-dept-selector v-model="formData.deptScopes" all-dept
                                               :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                               @select-confirm="selectConfirm"></ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="发布指定人员:" label-width="100px" prop="persionScopes">
                            <ice-persion-selector v-model="formData.persionScopes" all-dept
                                                  :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                  @select-confirm="selectPersionConfirm"></ice-persion-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="发布说明:" label-width="100px" prop="remark">
                            <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 6}"
                                      v-model="formData.remark" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </ice-form-group>
            <ice-form-group name="问卷详情(预览)">
                <question-view :pager-id="formData.pagerId" @loadTitle="loadTitle">

                </question-view>
            </ice-form-group>
        </el-form>
    </ice-flow-form>
</template>

<script>
    import IceDatePicker from "../../components/common/base/IceDatePicker";
    import IceDeptSelector from "../../components/common/biz/IceDeptSelector";
    import IceFlowForm from "../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../components/common/base/IceFormGroup";
    import QuestionView from "./widget/questionView";
    import IcePersionSelector from "../../components/common/biz/IcePersionSelector";

    export default {
        name: "questionPublish",
        components: {
            IcePersionSelector,
            QuestionView,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
            IceDeptSelector,
            IceDatePicker
        },
        data() {
            return {
                formData: {
                    oid: '',
                    pagerId: '',
                    startTime: '',
                    endTime: '',
                    deptScopes: '',
                    deptScope: [],
                    persionScopes: '',
                    persionScope: [],
                    remark: ''
                },
                rules: {
                    startTime: {required: true, message: '生效时间不能为空'},
                    endTime: {required: true, message: '生效时间不能为空'},
                    /* deptScopes: {required: true, message: '发布部门不能为空'}*/
                }
            }
        },
        methods: {
            /**开始处理时间*/
            stopTimeFilter(time) {
                if (!this.formData.endTime) {
                    return true
                }
                return time < new Date(this.formData.endTime)
            },
            /**结束处理时间*/
            startTimeFilter(time) {
                if (!this.formData.startTime) {
                    return true
                }
                return time > new Date(this.formData.startTime)
            },
            /**开始处理时间和结束处理时间的对比*/
            timeChange() {
                if (this.formData.endTime && this.formData.startTime && this.formData.startTime >= this.formData.endTime) {
                    this.formData.endTime = "";
                }
            },
            flowReady(flowContext, bizdata) {
                Object.assign(this.formData, bizdata);
                this.formData.pagerId = this.$route.query['pagerId'];
            },
            async flowOperateBtn(flowcont) {
                if (flowcont.operateType == 'submit') {
                    try {
                        await this.$refs.form.validate();
                    } catch (e) {
                        // console.error(e)
                        return false
                    }

                    if (!this.formData.deptScopes && !this.formData.persionScopes) {
                        this.$message.warning("发布部门或者发布指定人员必须选择一个")
                        return false
                    }

                }

                return true
            },
            flowBizData() {
                let scope = "";
                if (this.formData.deptScopes && this.formData.persionScopes) {
                    scope = "部门：( " + this.formData.deptScopes + " ) ,个人：( " + this.formData.persionScopes + " )"
                } else if (this.formData.deptScopes) {
                    scope = this.formData.deptScopes
                } else if (this.formData.persionScopes) {
                    scope = this.formData.persionScopes
                }

                return {...this.formData, scope}
            },
            selectConfirm(items, texts, values) {
                this.formData.deptScope = items.map(item => {
                    return {
                        deptId: item.oid,
                        deptCode: item.deptCode,
                        deptLevCode: item.deptLevCode,
                        orgId: item.orgId,
                        orgCode: item.deptCode,
                        orgLevCode: item.deptLevCode,
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
            loadTitle(title) {
                this.formData.quesTitle = title
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>

</style>
