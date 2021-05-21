<template>
    <div class="ice-container">
        <ice-query-grid title="调度任务管理"
                        class="scheduler"
                        ref="scheduler"
                        data-url="/scheduler/job/list"
                        :query="jobQuery"
                        :operations-width="250"
                        :columns="columns"
                        :operations="operations">
        </ice-query-grid>
        <ice-dialog title="执行历史查看" :visible.sync="historyDialogVisible" width="1100px" height="600px" remounted>
            <job-history :selected-job-id="selectedJobId"></job-history>
        </ice-dialog>
        <ice-dialog title="执行周期修改" :visible.sync="cronDialogVisible" width="810px" remounted>
            <crontab :expression="selectedJobCron" @fill="fill" @hide="cronDialogVisible=false"></crontab>
        </ice-dialog>
    </div>
</template>

<script>
    import JobBase from './JobBase'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import JobHistory from "./JobHistory";
    import Crontab from '@/components/common/base/IceCronEditor/widget/Crontab.vue'

    export default {
        name: "JobWidget",
        components: {JobHistory, IceDialog, IceQueryGrid, Crontab},
        mixins: [JobBase],
        props: {
            jobClassification: {
                type: String,
                required: true
            },
            query: {
                type: Array,
                default: _ => {
                    return []
                }
            },
            columns: {
                type: Array,
                default: function () {
                    return [
                        {code: 'oid', hidden: true},
                        {label: '任务名称', code: 'jobName', width: 140},
                        {label: '任务描述', code: 'jobDescription', width: 200},
                        {
                            label: '任务状态', code: 'jobStatus', width: 100, renderCell: (h, data) => {
                                return (<div class="statusWrapper">
                                    <div class={'status ' + this.resolveStatus(data.row.jobStatus).code}></div>
                                    <div>{this.resolveStatus(data.row.jobStatus).name}</div>
                                </div>)
                            }
                        },
                        {label: '最后执行时间', code: 'lastInvokeTime', width: 150, sortable: true},
                        {label: '最后成功执行时间', code: 'lastSuccessTime', width: 150, sortable: true},
                        {label: '最后操作人', code: 'updateUser', width: 100},
                        {label: '最后操作时间', code: 'updateDate', width: 140, sortable: true}]
                }
            },
            operations: {
                type: Array,
                default: function () {
                    return [
                        {name: '立即执行', callback: item => this.exec(item)},
                        {
                            name: '暂停', callback: item => this.pause(item), isShow: (row) => {
                                return row.jobStatus == 'NORMAL'
                            }
                        },
                        {
                            name: '恢复', callback: item => this.resume(item), isShow: (row) => {
                                return row.jobStatus == 'PAUSED'
                            }
                        },
                        {name: '执行时间修改', callback: item => this.updateJob(item)},
                        {name: '执行历史', callback: item => this.showHistory(item)},
                    ]
                }
            },
        },
        data() {
            return {
                jobQuery: [
                    {type: 'input', label: '任务名称', code: 'jobName', value: '',},
                    {
                        type: 'static',
                        code: 'jobClassification',
                        value: _ => this.jobClassification ? this.jobClassification : '----'
                    },
                    ...this.query
                ],
                historyDialogVisible: false,
                selectedJobId: '',
                cronDialogVisible: false,
                selectedJobCron: '',
                formData: ''
            }
        },
        methods: {
            updateJob(item) {
                this.cronDialogVisible = true;
                this.$axios.get("/scheduler/job/get", {params: {jobId: item.oid}})
                    .then(result => {
                        this.selectedJobId = item.oid;
                        this.selectedJobCron = result.data.cronExpression;
                        this.formData = result.data;
                    })
                    .catch(error => {
                        this.$message.error(error.msg)
                    })
            },
            fill(value) {
                /*  this.$confirm('是否确认修改?', '提示', {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                  }).then(() => {*/
                this.$axios.post("/scheduler/job/modifyJob", {...this.formData, cronExpression: value})
                    .then((result) => {
                        this.$refs.scheduler.refresh();
                        this.$message.success("修改成功")
                    })
                    .catch(error => {
                        this.$message.error(error.msg)
                    })
                /*}).catch(_ => {
                })*/

            }
        }
    }
</script>

<style lang="less">
    .scheduler {
        .statusWrapper {

            display: flex;
            justify-content: center;
            align-items: center;

            .status {
                width: 16px;
                height: 16px;
                border-radius: 8px;
                vertical-align: baseline;
                margin-right: 4px;

            }

            .status.success {
                background: #13ce66;
            }

            .status.normal {
                background: #13ce66;
            }

            .status.paused {
                background: #fffe46;
                /*animation: jobStatusAn 1s linear infinite;*/
            }

            .status.blocking {
                background: #5e9dce;
                /*animation: jobStatusAn 1s linear infinite;*/
            }

            .status.error {
                background: red;
                animation: jobStatusAn 1s linear infinite;
            }
        }

    }

    @keyframes jobStatusAn {
        0% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }

</style>