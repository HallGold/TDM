<template>
    <div style="overflow-y: scroll;overflow-x: hidden;max-height: 500px">
        <div style="width: 100%;flex-grow: 1;display: flex;flex-direction: column;">
            <div style="width: 100%;">
                <!--data-url="biz/ProEvtServiceTicket/searchWorkTickets"-->
                <!--上列表-->
                <ice-query-grid
                        data-url="biz/ProEvtServiceTicket/searchWorkTickets"
                        :columns=columnsTop
                        :query="queryTop"
                        chooseItem="single"
                        @selection-change="select"
                        :beforeBindData="topList"
                        ref="gridTop">
                </ice-query-grid>
            </div>
            <div style="width: 100%;margin-top: 20px;">
                <el-form :model="Form">
                    <el-row>
                        <el-col :span="4">
                            <el-form-item label="区域:" label-width="95px">
                                <el-input
                                        v-model="Form.proEvtUserTicket.shortname"
                                        :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="业务服务名称:"
                                          label-width="105px">
                                <el-input
                                        v-model="Form.proEvtUserTicket.categoryName"
                                        :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="业务服务项:" label-width="95px">
                                <el-input
                                        v-model="Form.proEvtUserTicket.sname"
                                        :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="级别类型:" label-width="95px">
                                <el-input
                                        v-model="Form.proEvtUserTicket.isUsrLv"
                                        :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="4">
                            <el-form-item label="对应级别:" label-width="95px">
                                <el-input
                                        v-model="Form.proEvtUserTicket.lv"
                                        :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
            <div style="width: 100%;">
                <!--biz/ProEvtWorkTicket/searchWorkTickets-->
                <ice-query-grid
                        data-url="biz/ProEvtWorkTicketCatalog/listDevs"
                        :columns=columnsBottom
                        :query="queryBottom"
                        :gridAutoRefresh="refresh"
                        ref="gridBottom">
                </ice-query-grid>
            </div>
        </div>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "lookOver",
        components: {
            IceQueryGrid,
        },
        data() {
            return {
                work: "",
                bottomUrl: "",
                refresh: true,
                columnsTop: [
                    {label: '工单号', code: 'workTicket', width: 200},
                    {label: '工单状态', code: 'workTicketStatus', mapTypeCode: "workStatus"},
                    {label: '工程师角色', code: 'engineerRole', width: 100, mapTypeCode: "operationalRole"},
                    {label: '工程师名称', code: 'engineerName', width: 100},
                    {label: '起因', code: 'reason', mapTypeCode: "eventCause"},
                    {label: '服务方式', code: 'serviceWay', mapTypeCode: "serviceWay"},
                    {label: '解决状态', code: 'resolveStatus', mapTypeCode: "resolveStatus"},
                    {
                        label: '是否影响服务', code: 'isServiceBreakdown', width: 100,
                        renderCell(h, data) {
                            if (data.row.isServiceBreakdown == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                    {
                        label: '是否返工', code: 'isRework', width: 100,
                        renderCell(h, data) {
                            if (data.row.isRework == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                    {
                        label: '是否转变更', code: 'isShift', width: 100,
                        renderCell(h, data) {
                            if (data.row.isShift == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                    {
                        label: '是否转知识库', code: 'isLibrary', width: 100,
                        renderCell(h, data) {
                            if (data.row.isLibrary == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                    {
                        label: '是否转问题', code: 'isProblem', width: 100,
                        renderCell(h, data) {
                            if (data.row.isProblem == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                    {
                        label: '是否快速解决', code: 'isInstant', width: 100,
                        renderCell(h, data) {
                            if (data.row.isInstant == false) {
                                return "否"
                            }
                            return "是"
                        }
                    },
                ],
                queryTop: [
                    {
                        type: 'static', code: 'service_Ticket', exp: '=', value: () => {
                            return this.hasTicket;
                        }
                    },
                ],
                Form: {
                    proEvtUserTicket: {
                        shortname: "",
                        psbcname: "",
                        sname: "",
                        categoryName: "",
                        isUsrLv: "",
                        lv: ""
                    }
                },
                columnsBottom: [
                    {label: '区域', code: 'areaName',},
                    {label: '技术服务大类', code: 'parentName', width: 200},
                    {label: '技术服务名称', code: 'categoryName', width: 200},
                    {label: '技术服务项', code: 'catalogName', width: 200},
                    {label: '技术手册', code: 'manual',},
                    {label: '服务对象', code: 'devName',},
                ],
                queryBottom: [
                    {
                        type: 'static', code: 'work_Ticket', exp: '=', value: () => {
                            return this.work;
                        }
                    },
                ],
            }
        },
        props: {
            hasTicket: String,
            catalogNum: String,
        },
        methods: {
            select(row) {
                this.work = row[0].workTicket;
                this.$refs.gridBottom.refresh();
            },
            topList(data) {
                this.work = data[0].workTicket;
                this.refresh = true;
                this.$refs.gridBottom.refresh();
                return data
            },
        },
        created() {
            if (this.catalogNum == undefined || this.catalogNum == null || this.catalogNum == "") {
            } else {
                this.$axios.get('biz/ProEvtServiceTicket/searchObject', {params: {id: this.catalogNum}}).then(result => {
                    this.Form.proEvtUserTicket.shortname = result.data.shortname;
                    this.Form.proEvtUserTicket.psbcname = result.data.psbcname;
                    this.Form.proEvtUserTicket.sname = result.data.sname;
                    this.Form.proEvtUserTicket.categoryName = result.data.categoryName;
                    let level = ["服务级别", "申请级别"];
                    this.Form.proEvtUserTicket.isUsrLv = level[result.data.isUsrLv];
                    this.Form.proEvtUserTicket.lv = result.data.lv + "级";

                });
            }
        }
    }
</script>

<style scoped>

</style>