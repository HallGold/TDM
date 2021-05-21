<template>
<!--    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 500px" >-->
        <el-form style="height: 100%">
                        <el-row :gutter="4" >
                                <el-col :span="6">
                                        <el-form-item label="服务单号:" label-width="80px" prop="remark">
                                                <el-input placeholder="IM_201907230001" label-width="130px"
                                                          :disabled="true"></el-input>
                                        </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                        <el-form-item label="服务单状态:" label-width="105px" prop="remark">
                                                <el-input placeholder="待分派" label-width="60px"
                                                          :disabled="true"></el-input>
                                        </el-form-item>
                                </el-col>
                                <el-col :span="8">
                                        <el-form-item></el-form-item>
                                </el-col>
                                <el-col :span="4">
                                        <el-form-item label-width="105px" prop="remark">
                                                <el-row :gutter="10" class="ice-button-bar">
                                                        <el-button placeholder="抄送" :row="8" type="primary"
                                                                   icon="el-icon-tickets">抄送
                                                        </el-button>
                                                        <el-button placeholder="关注" :row="8" type="primary"
                                                                   icon="el-icon-plus">关注
                                                        </el-button>
                                                        <el-button placeholder="流程监控" :row="8" type="primary">流程监控
                                                        </el-button>
                                                </el-row>
                                        </el-form-item>
                                </el-col>
                        </el-row>
<!--                <div style="height: 50px;" ></div>-->
                <!--服务申请信息-->
                <serve-message></serve-message>
                <!--服务受理==》办理==》基础信息-->
                <serve-foundation></serve-foundation>
                <!--附件信息-->
                <ice-grid-layout :columns="1" name="附件信息">
                        <access-message></access-message>
                </ice-grid-layout>
                <!--附属信息-->
                <affiliated-message></affiliated-message>
        </el-form>
<!--        </div>-->
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
    import serveFoundation from './serveFoundation'

    export default {
        name: 'detail',
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
                query: [
                    {type: 'input', label: '服务单号', code: 'serviceTicket', value: '', exp: ''},
                    {type: 'input', label: '用户', code: 'userName', value: '', exp: ''},
                    {type: 'button', label: '高级查询', code: '', value: ''}
                ],
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
        methods: {},
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage, serviceApplyFor, serveFoundation
        }

    }
</script>

<style scoped>

</style>