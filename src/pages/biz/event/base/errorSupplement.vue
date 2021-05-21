<template>
        <div class="grid-container">
                <el-form>
                        <!--新建故障申报补录-->
                        <ice-grid-layout :columns="1"  name="故障申报信息">
                                <el-form title="新建故障申报" :model="Form" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                                         style="margin-top: 20px">
                                        <el-form-item label-width="105px" label="系统用户:">
                                                <el-radio-group v-model="mainDataForm.radio">
                                                        <el-radio label="1">是</el-radio>
                                                        <el-radio label="2">否</el-radio>
                                                </el-radio-group>
                                        </el-form-item>
                                        <el-row :gutter="10">
                                                <el-col :span="8">
                                                        <el-form-item label="用户:" label-width="105px" prop="user">
                                                                <el-input placeholder="用户" v-model="mainDataForm.user" :disabled="aclKeyReadonly">
                                                                </el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="用户单位:" label-width="105px" prop="userUnit">
                                                                <el-input placeholder="用户单位" v-model="mainDataForm.userUnit" :disabled="aclKeyReadonly"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="用户星级:" label-width="105px" prop="formname">
                                                                <el-input :disabled="true"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>

                                        <el-row :gutter="10">
                                                <el-col :span="8">
                                                        <el-form-item label="用户座机:" label-width="105px" prop="userPhone" :rules="formRules.prompt1">
                                                                <el-input placeholder="用户座机" :disabled="aclKeyReadonly" v-model="mainDataForm.userPhone"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="用户手机:" label-width="105px" prop="userCellPhone" :rules="formRules2.prompt1">
                                                                <el-input placeholder="用户手机" :disabled="aclKeyReadonly"
                                                                          v-model="mainDataForm.userCellPhone"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="用户邮箱:" label-width="105px" prop="userEmail" :rules="formRules.prompt2">
                                                                <el-input placeholder="用户邮箱" :disabled="aclKeyReadonly" v-model="mainDataForm.userEmail"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-col :span="8">
                                                        <el-form-item label="申请人:" label-width="105px" prop="currentvalue">
                                                                <el-input :disabled="true"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="申请人单位:" label-width="105px" prop="cycle">
                                                                <el-input :disabled="true"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-col :span="8">
                                                        <el-form-item label="申请人座机:" label-width="105px" prop="proposerPhone" :rules="formRules.prompt1">
                                                                <el-input placeholder="申请人座机" v-model="mainDataForm.proposerPhone"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="申请人手机:" label-width="105px" prop="proposerCellPhone" :rules="formRules2.prompt1">
                                                                <el-input placeholder="申请人手机" v-model="mainDataForm.proposerCellPhone"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="申请人邮箱:" label-width="105px" prop="proposerEmail" :rules="formRules.prompt2">
                                                                <el-input placeholder="申请人邮箱" v-model="mainDataForm.proposerEmail"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-col :span="8">
                                                        <el-form-item label="申请时间:" label-width="105px" >
                                                                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
                                                        </el-form-item>
                                                </el-col>
                                                <el-col :span="8">
                                                        <el-form-item label="来源:" label-width="105px" prop="cycle">
                                                                <ice-select value="请选择..." placeholder="请选择..." map-type-code="Source">
                                                                </ice-select>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-form-item label="故障开始时间:" label-width="105px" >
                                                        <el-col :span="8">
                                                                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1"></el-date-picker>
                                                        </el-col>
                                                </el-form-item>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-col :span="24">
                                                        <el-form-item label="故障描述:" label-width="105px" prop="remark">
                                                                <el-input placeholder="故障描述" v-model="Form.remark" rows="6" type="textarea"></el-input>
                                                        </el-form-item>
                                                </el-col>
                                        </el-row>
                                        <el-row :gutter="10">
                                                <el-col :span="24" class="ice-upload">
                                                        <access-message></access-message>
                                                </el-col>
                                        </el-row>
                                </el-form>
                        </ice-grid-layout>
                        <!--服务受理==》办理==》基础信息-->
                        <base-message></base-message>
                        <!--附件信息-->
                        <ice-grid-layout :columns="1" name="附件信息">
                                <access-message></access-message>
                        </ice-grid-layout>
                        <!--附属信息-->
                </el-form>
        </div>
</template>

<script>

    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import ServeMessage from "./serveMessage"
    import BaseMessage from "./baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "./affiliatedMessage"
    import serviceApplyFor from "./serviceApplyFor"
    export default {
        name: 'errorSupplement',
        data() {
            return {
                activeIndex:'1',
                devEnterNetData: {
                    detailList:[]
                },
                activetime:'all',
                activeName:'first',
                serviApplyFor: false,
                stoppageApplyFor: false,
                aclKeyReadonly:false,
                transaction:false,
                mainDataForm: {
                    user:"",userPhone:"",userCellPhone:"",userEmail:"",userUnit:"0",remark:'',
                    proposerPhone:"",proposerCellPhone:"",proposerEmail:"",radio:"1"
                },
                Form:{
                    user:"",userPhone:"",userCellPhone:"",userEmail:"",userUnit:"0",remark:'',
                    proposerPhone:"",proposerCellPhone:"",proposerEmail:""
                },
                layoutColumns:[

                ],
                form:{
                    resource:'',
                    region:'',
                    date1:''
                },
                query: [
                    {type: 'input', label: '服务单号', code: 'serviceTicket', value: '', exp: ''},
                    {type: 'input', label: '用户', code: 'userName', value: '', exp: ''},
                    {type:'button',label:'高级查询',code:'',value:''}
                ],
                operations: [
                    {name: '删除', callback:""},
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
        methods: {},
        components: {
            IceQueryGrid,IceSelect,
            IceGridLayout,IceEditableTable,
            ServeMessage,BaseMessage,AccessMessage,
            affiliatedMessage,serviceApplyFor,IceFlowForm
        }

    }

</script>

<style scoped>
        .grid-container{
                width: 100%;
        }
</style>