<template>
    <el-form :model="objForm">
        <ice-grid-layout :columns="3" name="处理信息">
            <el-form-item label="工单号:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.workTicket" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="工单状态:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.workTicketStatus" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="服务方式:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.serviceWay" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="开始处理时间:" label-width="105px" prop="remark">
                <ice-date-picker v-model="objForm.proEvtUserTicket.gmtBegin"
                                 placeholder=""></ice-date-picker>
            </el-form-item>
            <el-form-item label="完成处理时间:" label-width="105px" prop="remark">
                <ice-date-picker v-model="objForm.proEvtUserTicket.gmtEnd" placeholder=""></ice-date-picker>
            </el-form-item>
            <el-form-item label="解决状态:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.resolveStatus" placeholder=""></el-input>
            </el-form-item>
            <el-form-item label="事件起因:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.reason" placeholder=""></el-input>
            </el-form-item>
            <el-form-item layout="3" label="处理过程:" label-width="105px" prop="remark">
                <el-input v-model="objForm.proEvtUserTicket.measure" rows="6" type="textarea" placeholder=""
                ></el-input>
            </el-form-item>
            <!--处理信息列表-->
            <el-form-item layout="3">
                <ice-query-grid
                        :columns="columnsObj"
                        :query="queryObj"
                        ref="gridObj"
                >
                </ice-query-grid>
            </el-form-item>

        </ice-grid-layout>
    </el-form>
</template>

<script>
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "process",
        components: {IceQueryGrid, IceGridLayout, IceDatePicker},
        columnsObj: [
            {label: '操作类型', code: 'operationTypeString',},
            {label: '原因', code: 'reason',},
            {label: '说明', code: 'detail',},
            {label: '操作人', code: 'creatorName',},
            {label: '操作时间', code: 'gmtCreate',},
        ],

        queryObj: [
            {
                type: 'tab',
                label: '状态',
                code: '',
                value: '0',
                click: value => {
                    if (value == 0) {
                        this.columnsObj = [
                            {label: '操作类型', code: 'operationTypeString',},
                            {label: '原因', code: 'reason',},
                            {label: '说明', code: 'detail',},
                            {label: '操作人', code: 'creatorName',},
                            {label: '操作时间', code: 'gmtCreate',},
                        ]
                    } else if (value == 1) {
                        this.columnsObj = [
                            {label: '区域', code: 'areaName',},
                            {label: '服务大类', code: 'parentName',},
                            {label: '服务名称', code: 'categoryName',},
                            {label: '服务项', code: 'catalogName',},
                            {label: '技术手册', code: 'manual',},
                            {label: '服务对象', code: 'devName',},
                            {label: '操作内容', code: 'operation',},
                            {label: '操作时间', code: 'gmtCreate',},
                        ]
                    } else if (value == 2) {
                        this.columnsObj = [
                            {label: '参与人', code: 'engineerName',},
                            {label: '贡献度(%)', code: 'contribution',},
                            {label: '参与事项', code: 'detail',},
                            {label: '操作', code: 'operation',},
                        ]
                    } else if (value == 3) {
                        this.columnsObj = [
                            {label: '变更单号', code: 'shiftTicket',},
                            {label: '变更类型', code: 'shiftType',},
                            {label: '变更状态', code: 'statusName',},
                        ]
                    } else if (value == 4) {
                        this.columnsObj = [
                            {label: '转变更的工单号', code: 'workTicket', width: 200},
                            {label: '变更单号', code: 'shiftTicket',},
                            {label: '变更类型', code: 'shiftType',},
                            {label: '变更状态', code: 'statusName',},
                        ]
                    } else if (value == 5) {
                        this.columnsObj = [
                            {label: '申请编号', code: 'applyCode',},
                            {label: '申请人', code: 'applyerName',},
                            {label: '申请单位', code: 'applyerDepartment',},
                            {label: '申请时间', code: 'applyTime',},
                            {label: '陪同人', code: 'companionName',},
                            {label: '申请进入部位', code: 'inLocation',},
                            {label: '状态', code: 'state',},
                        ]
                    } else if (value == 6) {
                        this.columnsObj = [
                            {label: '第三方厂商', code: 'unitname',},
                            {label: '企业性质', code: 'quality',},
                            {label: '响应速度', code: 'responseSpeed',},
                            {label: '处理速度', code: 'disposeSpeed',},
                            {label: '服务速度', code: 'servSpeed',},
                            {label: '专业能力', code: 'ability',},
                            {label: '总分', code: 'totalScore',},
                            {label: '评价', code: 'evaluation',},
                            {label: '处理人信息', code: 'contacterInfos',},
                            {label: '操作', code: 'operate',},
                        ]
                    }
                },
                tablist: [
                    {label: '工单操作记录', value: '0'},
                    {label: '技术服务目录信息', value: '1'},
                    {label: '参与人信息', value: '2'},
                    {label: '当前工单关联变更单', value: '3'},
                    {label: '服务单关联的变更信息', value: '4'},
                    {label: '进入申请信息', value: '5'},
                    {label: '第三方厂商', value: '6'},
                ]
            }
        ],
        objForm: {
            proEvtUserTicket: {
                //工单号
                workTicket: '',
                //工单状态
                workTicketStatus: '',
                //服务方式
                serviceWay: '',
                //开始处理时间
                gmtBegin: '',
                //完成处理时间
                gmtEnd: '',
                //解决状态
                resolveStatus: '',
                //事件起因
                reason: '',
                //处理过程
                measure: '',

            }
        },
    }
</script>

<style scoped>

</style>