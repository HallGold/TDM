<template>
    <!--服务受理==》新建服务申请-->
    <div style="width: 100%;">
        <el-form :model="mainDataForm" :disabled="aclKeyReadonly">
            <ice-grid-layout :columns="3" name="">
                <el-form-item layout="3" label="用户是否存在:">
                    <el-radio-group v-model="mainDataForm.radio">
                        <el-radio label="1">是</el-radio>
                        <el-radio label="2">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="用户:" label-width="105px" prop="user">
                    <el-input placeholder="用户" v-model="mainDataForm.user" :disabled="aclKeyReadonly">
                    </el-input>
                </el-form-item>
                <el-form-item label="用户单位:" label-width="105px" prop="userUnit">
                    <el-input placeholder="用户单位" v-model="mainDataForm.userUnit" :disabled="aclKeyReadonly">
                    </el-input>
                </el-form-item>
                <el-form-item label="用户星级:" label-width="105px" prop="formname">
                    <el-input :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户座机:" label-width="105px" prop="userPhone" :rules="formRules.prompt1">
                    <el-input placeholder="用户座机" :disabled="aclKeyReadonly" v-model="mainDataForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="用户手机:" label-width="105px" prop="userCellPhone" :rules="formRules2.prompt1">
                    <el-input placeholder="用户手机" :disabled="aclKeyReadonly"
                              v-model="mainDataForm.userCellPhone"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱:" label-width="105px" prop="userEmail" :rules="formRules.prompt2">
                    <el-input placeholder="用户邮箱" :disabled="aclKeyReadonly" v-model="mainDataForm.userEmail"></el-input>
                </el-form-item>
                <el-form-item label="申请人:" label-width="105px" prop="currentvalue">
                    <el-input :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人单位:" label-width="105px" prop="cycle">
                    <el-input :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="申请人座机:" label-width="105px" prop="proposerPhone" :rules="formRules.prompt1">
                    <el-input placeholder="申请人座机" v-model="mainDataForm.proposerPhone"></el-input>
                </el-form-item>
                <el-form-item label="申请人手机:" label-width="105px" prop="proposerCellPhone" :rules="formRules2.prompt1">
                    <el-input placeholder="申请人手机" v-model="mainDataForm.proposerCellPhone"></el-input>
                </el-form-item>
                <el-form-item label="申请人邮箱:" label-width="105px" prop="proposerEmail" :rules="formRules.prompt2">
                    <el-input placeholder="申请人邮箱" v-model="mainDataForm.proposerEmail"></el-input>
                </el-form-item>
                <el-form-item label="来源:" label-width="105px" prop="cycle">
                    <ice-select value="请选择..." placeholder="请选择..." map-type-code="Source">
                    </ice-select>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
    </div>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import ServeMessage from "../base/serveMessage"
    import BaseMessage from "../base/baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "../base/affiliatedMessage"

    export default {
        name: "serviceApplyFor",
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage
        },
        data() {
            return {
                activeIndex: '1',
                devEnterNetData: {
                    detailList: []
                },
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly: false,
                transaction: false,
                mainDataForm: {
                    user: "", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "", remark: '',
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: "", radio: '1'
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
                }
            }
        },
    }
</script>

<style scoped>

</style>