<template>
    <div>
        <ice-query-grid :columns="historyColumns"
                        :operations="operations"
                        :operations-width="operationWidth"
                        :query="historyQuery"
                        class="scheduler"
                        data-url="/scheduler/jobHistory/list"
                        ref="schedulerHistory"
                        style="height: 510px">
        </ice-query-grid>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import JobBase from "./JobBase";

    export default {
        name: "JobHistory",
        components: {IceQueryGrid},
        mixins: [JobBase],
        props: {
            selectedJobId: String,
            operations: Array,
            operationWidth: Number,
        },
        data() {
            return {
                historyColumns: [
                    {code: 'oid', hidden: true},
                    {label: '开始执行时间', code: 'startTime', width: 150},
                    {label: '执行完成时间', code: 'endTime', width: 150},
                    {
                        label: '执行结果', code: 'result', width: 120, renderCell: (h, data) => {
                            return (<div class="statusWrapper">
                                <div class={'status ' + this.resolveStatus(data.row.result).code}></div>
                                <div>{this.resolveStatus(data.row.result).name}</div>
                            </div>)
                        }
                    },

                    {label: '执行方式', code: 'invokeReason', width: 120},
                    {
                        label: '执行人', code: 'invoker', width: 150, formatter: (data) => {
                            return data['invoker'] == 'system' ? '系统自动执行' : data['invoker']
                        }
                    },
                    {label: '执行结果内容', code: 'resultMsg', width: 250, align: 'left'},
                ],
                historyQuery: [
                    {type: 'static', code: 'jobId', value: () => this.selectedJobId,},
                ],
            }
        }
    }
</script>

<style scoped>

</style>