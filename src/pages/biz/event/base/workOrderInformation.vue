<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                :gridAutoRefresh="true"
                :data-url=url
                :columns=columns
                :query=query
                ref="grid"
        ></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";

    export default {
        name: "workOrderInformation",
        components: {IceQueryGrid},
        data() {
            return {
                url: "",
                columns: [
                    {label: '工单号', code: 'workTicket', width: 200},
                    {label: '工单状态', code: 'status', mapTypeCode: "workStatus"},
                    {label: '工程师角色', code: 'engineerRole', mapTypeCode: "operationalRole"},
                    {label: '工程师名称', code: 'engineerName',},
                    {label: '起因', code: 'reason', mapTypeCode: "eventCause"},
                    {label: '服务方式', code: 'serviceWay', mapTypeCode: "serviceWay"},
                    {label: '开始处理时间', code: 'gmtBegin',},
                    {label: '问题解决时间', code: 'gmtEnd',},
                    {label: '解决状态', code: 'resolveStatus', mapTypeCode: "resolveStatus"},
                    {
                        label: '是否返工', code: 'isRework', renderCell(h, data) {
                            if (data.row.isRework == "1") {
                                return "是"
                            } else {
                                return "否"
                            }
                        }
                    },
                ],
                query: [
                    {
                        type: 'static', code: 'service_Ticket', exp: '=', value: () => {
                            return this.serviceID;
                        }
                    },
                ],

            }
        },
        methods: {
            refresh(serviceID, look) {
                let type = this.$route.query['type'];
                if (type === "detail") {
                    this.buttons = [];
                    this.serviceID = serviceID;
                    this.url = "biz/ProEvtWorkTicket/orderTicket";
                }
                if (look === "head") {
                    this.buttons = [];
                    this.serviceID = serviceID;
                    this.url = "biz/ProEvtWorkTicket/orderTicket";
                }
                this.$refs.grid.refresh();
            }
        },
    }
</script>

<style scoped>

</style>