<template>
    <div style="flex-grow: 1;display: flex;width: 100%;">
        <div class="container_left">
            <ice-query-grid
                    data-url="/biz/ProEvtServiceTicket/searchServiceTicket"
                    :columns=columnsLeft
                    ref="gridTop"
                    :query=query
                    chooseItem="single"
                    @selection-change="select"
            ></ice-query-grid>
        </div>
        <div style="width: 10px"></div>
        <div class="container_right">
            <ice-query-grid
                    :data-url=url
                    :columns=columnsRight
                    ref="gridBottom"
                    :buttons=buttons
                    :query="querys"
                    :operations="operations"
            ></ice-query-grid>
        </div>
        <ice-dialog title="追派" width="1200px" height="450px" :visible.sync="dialogVisible" remounted>
            <assign-add-to :areaID="areaID" :serviceT="serviceT" @cancel="closeAssign"></assign-add-to>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import AssignAddTo from "./base/assignAddTo";

    export default {
        name: "haveSent",
        components: {AssignAddTo, IceDialog, IceQueryGrid},
        data() {
            return {
                ID: "",
                url: "",
                rowNew: [],
                multiple: [],
                areaID: "",
                serviceT: "",
                dialogVisible: false,
                columnsLeft: [
                    {label: '', code: 'oid', width: 150, hidden: true},
                    {label: '', code: 'id', width: 150, hidden: true},
                    {label: '服务单号', code: 'serviceTicket', width: 150},
                    {label: '状态', code: 'serviceStatus', width: 100, mapTypeCode: "serviceStatus"},
                    {label: '用户', code: 'userName', width: 100},
                    {label: '描述', code: 'description',},
                    {label: '区域ID', code: 'areaId', hidden: true},
                ],
                query: [
                    {type: 'input', label: '服务单号', code: 'serviceTicket', value: '', exp: ''},
                    {type: 'input', label: '用户', code: 'userName', value: '', exp: ''},
                ],
                columnsRight: [
                    {label: '工单号', code: 'workTicket', width: 180},
                    {label: '状态', code: 'status', width: 100, mapTypeCode: "workStatus"},
                    {label: '用户', code: 'userName', width: 100},
                    {label: '处理过程', code: 'measure', width: 200},
                ],
                buttons: [
                    {
                        name: '追派', icon: 'el-icon-plus', type: 'primary', callback: this.newNum
                    }
                ],
                querys: [
                    {
                        type: 'static', code: 'service_Ticket', exp: '=', value: () => {
                            return this.ID;
                        }
                    },
                ],
                operations: [
                    {
                        name: '撤回',
                        icon: 'el-icon-delete',
                        type: "primary",
                        callback: this.recall,
                        isShow: function (row) {
                            if (row.status == "14") {
                                return false
                            } else {
                                return true
                            }
                        }
                    }
                ]
            }
        },
        methods: {
            ///biz/ProEvtServiceTicket/searchServiceTicket
            ///biz/ProEvtServiceTicket/searchWorkTicket
            select(row) {
                this.rowNew = row;
                if (row.length == 1) {
                    this.url = "/biz/ProEvtServiceTicket/searchWorkTicket";
                    this.ID = row[0].serviceTicket;
                    this.$refs.gridBottom.refresh();
                    this.serviceT = row[0].serviceTicket;
                    this.areaID = row[0].areaCode;
                    row = [];
                } else {
                    this.$confirm('请选择一条数据进行查看！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                    this.$refs.gridTop.refresh();
                    this.$refs.gridBottom.refresh();
                    row = [];
                }
            },
            newNum() {
                if (this.rowNew.length == "0") {
                    this.$confirm('请选择一条数据进行新增！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.dialogVisible = true;
                    this.areaID = this.rowNew[0].areaCode;
                    this.rowNew = [];
                    this.$refs.gridTop.refresh();
                    this.$refs.gridBottom.refresh();
                }
            },
            recall(row) {
                //biz/ProEvtWorkTicketLog/revokeWorkTicket
                this.$axios.post("biz/ProEvtWorkTicketLog/revokeWorkTicket", {workTicket: row.workTicket}).then(result => {
                    this.$message.success("撤回成功！");
                    this.$refs.gridTop.refresh();
                    this.$refs.gridBottom.refresh();
                });
            },
            /*关闭追派页面*/
            // closeAssign(){},
            closeAssign(value) {
                if (value == false) {
                    this.dialogVisible = value;
                    this.$refs.gridBottom.refresh();
                }
            }
        },
    }
</script>

<style scoped>
    .container_left {
        flex-grow: 1;
        display: flex;
    }

    .container_right {
        flex-grow: 1;
        display: flex;
    }
</style>