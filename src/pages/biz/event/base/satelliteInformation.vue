<template>
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
                <ice-grid-layout :columns="1" name="附属信息">
                        <el-tabs v-model="activeName">
                                <el-tab-pane label="服务申请" name="first">
                                        <ice-query-grid
                                                data-url=""
                                                :columns=columns1
                                                ref="grid">
                                        </ice-query-grid>
                                </el-tab-pane>
                                <el-tab-pane label="故障" name="second">
                                        <ice-query-grid
                                                data-url=""
                                                :columns=columns2
                                                ref="grid">
                                        </ice-query-grid>
                                </el-tab-pane>
                        </el-tabs>
                </ice-grid-layout>
        </div>
</template>

<script>

    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";

    export default {
        name: 'affiliatedMessage',
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
                aclKeyReadonly: true,
                transaction: false,
                Visible: false,
                mainDataForm: {
                    user: "0", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "0", remark: '',
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: ""
                },
                Form: {
                    user: "0", userPhone: "", userCellPhone: "", userEmail: "", userUnit: "0", remark: '',
                    proposerPhone: "", proposerCellPhone: "", proposerEmail: ""
                },
                layoutColumns: [],
                columns1: [
                    {code: 'formcodeRuleid', hidden: true},

                    {label: '服务单号', code: 'serviceTicket', },
                    {label: '状态', code: 'serviceStatus', },
                    {label: '用户事件描述', code: 'userName', },
                ],
                columns2: [
                    {code: 'formcodeRuleid', hidden: true},

                    {label: '操作类型', code: 'serviceTicket', },
                    {label: '原因', code: 'serviceStatus', },
                    {label: '说明', code: 'userName',},
                    {label: '确认人', code: 'userLevel',},
                    {label: '确认时间', code: 'disposePerson', },
                ],
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
        methods: {},
        components: {
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
        }
    }

</script>


<style scoped>

</style>
