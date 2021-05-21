<template>
        <el-form :model="mainDataForm" :disabled="aclKeyReadonly">
                <ice-grid-layout :columns="3" name="">
                        <el-form-item layout="3" label="用户是否存在:">
                                <el-radio-group class="user" v-model="mainDataForm.radio">
                                        <el-radio label="0">是</el-radio>
                                        <el-radio label="1">否</el-radio>
                                </el-radio-group>
                        </el-form-item>
                        <el-form-item label="用户:" label-width="105px" prop="user">
                                <ice-persion-selector
                                        title="请选择"
                                ></ice-persion-selector>
                        </el-form-item>
                        <el-form-item label="用户单位:" label-width="105px" prop="userUnit">
                                <ice-dept-selector></ice-dept-selector>
                        </el-form-item>
                        <el-form-item label="用户星级:" label-width="105px" prop="formname">
                                <el-input :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="用户座机:" label-width="105px" prop="userPhone"
                                      :rules="formRules.prompt1">
                                <el-input placeholder="用户座机" :disabled="aclKeyReadonly"
                                          v-model="mainDataForm.userPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="用户手机:" label-width="105px" prop="userCellPhone"
                                      :rules="formRules2.prompt1">
                                <el-input placeholder="用户手机" :disabled="aclKeyReadonly"
                                          v-model="mainDataForm.userCellPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="用户邮箱:" label-width="105px" prop="userEmail"
                                      :rules="formRules.prompt2">
                                <el-input placeholder="用户邮箱" :disabled="aclKeyReadonly"
                                          v-model="mainDataForm.userEmail"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人:" label-width="105px" prop="currentvalue">
                                <el-input :disabled="true" v-model="mainDataForm.proposer"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人单位:" label-width="105px" prop="cycle">
                                <el-input :disabled="true" v-model="mainDataForm.proposerUnit"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人座机:" label-width="105px" prop="proposerPhone"
                                      :rules="formRules.prompt1">
                                <el-input placeholder="申请人座机" v-model="mainDataForm.proposerPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人手机:" label-width="105px" prop="proposerCellPhone"
                                      :rules="formRules2.prompt1">
                                <el-input placeholder="申请人手机"
                                          v-model="mainDataForm.proposerCellPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人邮箱:" label-width="105px" prop="proposerEmail"
                                      :rules="formRules.prompt2">
                                <el-input placeholder="申请人邮箱" v-model="mainDataForm.proposerEmail"></el-input>
                        </el-form-item>
                        <el-form-item label="来源:" label-width="105px" prop="cycle">
                                <ice-select value="请选择..." placeholder="请选择..." map-type-code="Source"
                                            v-model="mainDataForm.source">
                                </ice-select>
                        </el-form-item>
                        <el-form-item layout="3" label="故障描述：" label-width="105px">
                                <el-input rows="6" type="textarea" v-model="mainDataForm.describe"></el-input>
                        </el-form-item>
                        <el-form-item layout="3" label="附件上传:" label-width="105px" prop="remark">
                                <ice-multiple-upload></ice-multiple-upload>
                        </el-form-item>
                </ice-grid-layout>
        </el-form>
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
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";

    export default {
        name: "basedOnRepeat",
        components: {
            IceDialog,
            IceFlowForm,
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor,IceDeptSelector,
            IcePersionSelector,IceMultipleUpload
        },
        data() {
            return {
                activeIndex: '1',
                devEnterNetData: {
                    detailList: []
                },
                activeTab: '0',
                activeName: 'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                visible: false,
                visibles: false,
                visiblis:false,
                message:"",
                mainDataForm: {
                    user: "", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "",
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: "", radio: "0",
                    source: "", describe: "",proposer:"",proposerUnit:""
                },
                layoutColumns: [],
                form: {
                    resource: '',
                    region: '',
                    date1: ''
                },
                formRules: {
                    prompt1: [{required: true, message: '请输入座机号', trigger: 'blur'}],
                    prompt2: [{required: true, message: '请输入邮箱', trigger: 'blur'}],
                },
                formRules2: {
                    prompt1: [{required: true, message: '请输入手机号', trigger: 'blur'}],
                },
            }
        },
        methods: {}
    }
</script>

<style scoped>

</style>