<template>
        <!--修改-->
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%">
                <el-form title="修改" :model="Form" :rules="formRules" label-position="right" class="conditon-bar"
                         ref="form"
                         style="margin-top: 20px;width: 100%">
                        <ice-grid-layout :columns="1" name="故障申报信息">
                                <service-apply-for></service-apply-for>
                                <el-row :gutter="10">
                                        <el-col :span="8">
                                                <el-form-item label="故障开始时间:" label-width="105px">
                                                        <el-date-picker type="date" placeholder="选择日期"
                                                                        v-model="form.date1"></el-date-picker>
                                                </el-form-item>
                                        </el-col>
                                </el-row>
                                <el-row :gutter="10">
                                        <el-col :span="24">
                                                <el-form-item label="故障描述:" label-width="105px" prop="remark">
                                                        <el-input placeholder="故障描述" v-model="Form.remark" rows="6"
                                                                  type="textarea"></el-input>
                                                </el-form-item>
                                        </el-col>
                                </el-row>
                        </ice-grid-layout>
                        <ice-grid-layout :columns="1" name="附件信息">
                                <el-row :gutter="10">
                                        <el-col :span="24" class="ice-upload">
                                                <access-message></access-message>
                                        </el-col>
                                </el-row>
                        </ice-grid-layout>
                </el-form>
        </div>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import ServeMessage from "./serveMessage"
    import BaseMessage from "./baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "./affiliatedMessage"
    import serviceApplyFor from "./serviceApplyFor"
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";

    export default {
        name: "changeFile",
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, IceFlowForm
        },
        data() {
            return {
                activeIndex: '1',
                devEnterNetData: {
                    detailList: []
                },
                activetime: 'all',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                mainDataForm: {
                    user: "0", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "0", remark: '',
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: ""
                },
                Form: {
                    user: "0", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "0", remark: '',
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: ""
                },
                layoutColumns: [],
                form: {
                    resource: '',
                    region: '',
                    date1: ''
                },
                operations: [
                    {name: '删除', callback: ""},
                    {name: '详情', callback: ""},
                    {name: '删除', callback: ""},
                ],
                formRules: {
                    prompt1: [{required: true, message: '请输入座机号', trigger: 'blur'}],
                    prompt2: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                },
                formRules2: {
                    prompt1: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                }
            }
        },
    }
</script>

<style scoped>

</style>