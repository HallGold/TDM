<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid
                :data-url="url"
                :columns=columns
                :buttons=buttons
                :query=query
                :gridData="information"
                chooseItem="single"
                @selection-change="select"
                :title="exportTitle"
                ref="grid"
        ></ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";

    export default {
        name: "serviceObjectQuery",
        components: {IceQueryGrid},

        data() {
            return {
                exportTitle: "服务对象查询-服务单关联服务对象",
                url: "biz/ProEvtServiceTicket/searchServiceTicketObject",
                columns: [
                    {label: '服务单号', code: 'serviceTicket',},
                    {label: '服务单状态', code: 'serviceStatus',},
                    {label: '开始时间', code: 'gmtCreate',},
                    {label: '性质', code: 'serviceProperty',},
                    {label: '类别', code: 'isBreakdown',},
                    {label: '技术服务大类', code: 'parentName',},
                    {label: '技术服务名称', code: 'categoryName',},
                    {label: '技术服务项', code: 'catalogName',},
                    {label: '服务对象名称', code: 'devName',},
                    {label: '', code: 'oid', hidden: true},
                    {label: '', code: 'id', hidden: true},
                ],
                buttons: [
                    {
                        name: '详情',
                        icon: 'el-icon-info',
                        type: 'primary',
                        callback: this.compile
                    },
                    {
                        name: '导出',
                        icon: 'el-icon-download',
                        type: 'export',
                    },
                ],
                information: [],
                objData: [],
                query: [
                    {
                        type: 'tab',
                        label: '状态',
                        code: '',
                        value: 'all',
                        click: value => {
                            if (value === 'all') {
                                this.exportTitle = "服务对象查询-服务单关联服务对象",
                                    this.columns = [
                                        {label: '服务单号', code: 'serviceTicket', width: 200},
                                        {label: '服务单状态', code: 'serviceStatus',},
                                        {label: '开始时间', code: 'gmtCreate',},
                                        {label: '性质', code: 'serviceProperty',},
                                        {label: '类别', code: 'isBreakdown',},
                                        {label: '技术服务大类', code: 'parentName',},
                                        {label: '技术服务名称', code: 'categoryName',},
                                        {label: '技术服务项', code: 'catalogName',},
                                        {label: '服务对象名称', code: 'devName',},
                                        {label: '', code: 'oid', hidden: true},
                                        {label: '', code: 'id', hidden: true},
                                    ];
                                /*biz/ProEvtWorkTicket/searchWorkTicketObject*/
                                this.url = "biz/ProEvtServiceTicket/searchServiceTicketObject";
                            } else if (value === '1') {
                                this.exportTitle = "服务对象查询-工单关联服务对象",
                                    this.columns = [
                                        {label: '工单号', code: 'workTicket', width: 200},
                                        {label: '工单状态', code: 'status', mapTypeCode: "workStatus"},
                                        {label: '处理角色', code: 'engineerRole', mapTypeCode: "operationalRole"},
                                        {label: '起因', code: 'reason', mapTypeCode: "eventCause"},
                                        {label: '技术服务大类', code: 'parentName',},
                                        {label: '技术服务名称', code: 'categoryName',},
                                        {label: '技术服务项', code: 'catalogName',},
                                        {label: '服务对象名称', code: 'devName',},
                                        {label: '', code: 'oid', hidden: true},
                                        {label: '', code: 'id', hidden: true},
                                    ];
                                /*biz/ProEvtServiceTicket/searchServiceTicketObject*/
                                this.url = "biz/ProEvtWorkTicket/searchWorkTicketObject"
                            }
                            this.$refs.grid.refreshAndPageReset();
                            // this.$refs.grid.refresh();
                        },
                        tablist: [
                            {label: '服务单关联服务对象', value: 'all', name: "all"},
                            {label: '工单关联服务对象', value: '1'},
                        ]
                    },
                ],
            }
        },
        methods: {
            compile() {
                console.log(this.query[0].value)
                if (this.query[0].value == "all") {
                    if (this.objData.length == "0") {
                        this.$confirm('请选择一条数据进行查看！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        })
                    } else {
                        //传入tabs=obj
                        if (this.objData[0].isBreakdown == "0") {
                            /*服务*/
                            this.$router.push("/biz/event/workTransaction?dataId=" + this.objData[0].id);
                        } else {
                            /*故障*/
                            this.$router.push("/biz/event/workTransaction?dataId=" + this.objData[0].id);
                        }
                    }
                } else {
                    this.$router.push("/biz/event/workTransaction?dataId=" + this.objData[0].id);
                }
            },
            select(row) {
                this.objData = row;
            },
        }
    }
</script>

<style scoped>

</style>