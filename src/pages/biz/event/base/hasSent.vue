<template>
    <div style="width: 100%;flex-grow: 1;display: flex;flex-direction: column;">
        <div style="width: 100%;">
            <!--                        data-url="biz/ProEvtServiceTicket/searchWorkTickets"-->
            <ice-query-grid
                    :columns=columns
                    :query="query"
                    ref="grid">
            </ice-query-grid>
        </div>
        <div style="width: 100%;margin-top: 20px;">
            <el-form :model="Form">
                <el-row :gutter="10">
                    <el-col :span="4">
                        <el-form-item label="区域:" label-width="105px" prop="">
                            <el-input v-model="Form.proEvtUserTicket.shortname" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="业务服务名称:" label-width="105px" prop="">
                            <el-input v-model="Form.proEvtUserTicket.psbcname" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="业务服务项:" label-width="105px" prop="">
                            <el-input v-model="Form.proEvtUserTicket.sname" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="级别类型:" label-width="105px" prop="">
                            <el-input v-model="Form.proEvtUserTicket.isUsrLv" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="5">
                        <el-form-item label="对应级别:" label-width="105px" prop="">
                            <el-input v-model="Form.proEvtUserTicket.lv" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </div>
        <div style="width: 100%;">
            <!--               biz/ProEvtWorkTicket/searchWorkTickets         -->
            <ice-query-grid
                    data-url=""
                    :columns=columns2
                    ref="grid">
            </ice-query-grid>
        </div>
    </div>
</template>

<script>

    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";

    export default {
        name: 'serviceTicket',
        data() {
            return {
                Form: {
                    proEvtUserTicket:{
                        shortname:"",
                        psbcname:"",
                        sname:"",
                        isUsrLv:"",
                        lv:""
                    }
                },
                columns: [

                    {label: '工单号', code: 'workTicket', width: 80},
                    {label: '工单状态', code: 'workTicketStatus', width: 100},
                    {label: '工程师角色', code: 'engineerRole', width: 100,},
                    {label: '工程师名称', code: 'engineerName', width: 100},
                    {label: '起因', code: 'reason', width: 100},
                    {label: '服务方式', code: 'serviceWay', width: 100},
                    {label: '解决状态', code: 'resolveStatus', width: 150},
                    {label: '是否影响服务', code: 'serviceBreakdown', width: 150},
                    {label: '是否返工', code: 'rework', width: 150},
                    {label: '是否转变更', code: 'shift', width: 150},
                    {label: '是否转知识库', code: 'library', width: 150},
                    {label: '是否转问题', code: 'problem', width: 150},
                    {label: '是否快速解决', code: 'instant', width: 150},
                ],
                query:[
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return    "IM_201908080002";
                        }
                    },
                ],
                columns2: [

                    {label: '区域', code: 'areaName', width: 250},
                    {label: '技术服务大类', code: 'parentName', width: 300},
                    {label: '技术服务名称', code: 'categoryName', width: 300,},
                    {label: '技术服务项', code: 'catalogName', width: 300},
                    {label: '技术手册', code: 'manual', width: 300},
                    {label: '服务对象', code: 'devName', width: 250},
                ],
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
        .ice-container{height: 50%;}
</style>
