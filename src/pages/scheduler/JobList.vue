<template>
    <div class="ice-container">
        <ice-query-grid title="调度任务管理"
                        class="scheduler"
                        ref="scheduler"
                        data-url="/scheduler/job/list"
                        :query="query"
                        :auto-refresh-ticker="10000"
                        :operations-width="250"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>
        <ice-dialog title="调度任务管理维护" :visible.sync="dialogVisible" width="800px" height="420px">
            <el-form :model="formData" :rules="rules" label-position="right" class="conditon-bar"
                     ref="form" style="margin-top: 10px">
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="任务名称" label-width="100px" prop="jobName">
                            <el-input placeholder="名称" v-model="formData.jobName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务所属" label-width="100px" prop="jobClassification">
                            <ice-select mapTypeCode="jobClassification"
                                        v-model="formData.jobClassification"></ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="任务类型" label-width="100px" prop="jobType">
                            <ice-select mapTypeCode="scheduler" v-model="formData.jobType"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="任务内容" label-width="100px" prop="jobContent">
                            <div style="display: flex">
                                <el-select style="width: 120px;display: inline-block" v-model="formData.requestMethod">
                                    <el-option label="GET" value="GET"></el-option>
                                    <el-option label="POST" value="POST"></el-option>
                                    <el-option label="DELETE" value="DELETE"></el-option>
                                    <el-option label="PUT" value="PUT"></el-option>
                                </el-select>
                                <el-input placeholder="请选择请求服务" v-model="formData.jobContent"
                                          style="width: 564px;flex-grow: 1">
                                    <!-- <div slot="suffix" style="height: 30px;line-height: 30px">123</div>-->
                                    <el-button slot="append" icon="el-icon-search" @click="serviceVisible=true" unauth>
                                        选择
                                    </el-button>
                                </el-input>
                            </div>

                            <ice-dialog :visible.sync="serviceVisible" title="服务选择" width="1100px" height="560px">
                                <service-manage :isDialog="true"
                                                loadAll="N"
                                                @selection-change="handleSelectionChange"></service-manage>
                            </ice-dialog>
                        </el-form-item>
                    </el-col>
                </el-row>


                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="开始执行时间" label-width="100px" prop="startTime">
                            <el-date-picker v-model="formData.startTime" type="datetime"
                                            placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结束执行时间" label-width="100px" prop="endTime">
                            <el-date-picker v-model="formData.endTime" type="datetime"
                                            placeholder="选择日期时间"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="定时任务规则" label-width="100px" prop="cronExpression">
                            <ice-cron-editor v-model="formData.cronExpression"></ice-cron-editor>
                            <!--<el-input placeholder="请输入定时任务规则" v-model="formData.cronExpression"></el-input>-->
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="任务说明" label-width="100px" prop="jobDescription">
                            <el-input type="textarea"
                                      placeholder="请输入任务说明"
                                      v-model="formData.jobDescription"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="close">返回</el-button>
            </div>
        </ice-dialog>
        <ice-dialog title="执行历史查看" :visible.sync="historyDialogVisible" width="1100px" remounted>
            <job-history :selected-job-id="selectedJobId"></job-history>
            <!-- <div class="ice-button-bar ">
                 <el-button type="info" @click="close">返回</el-button>
             </div>-->
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceSelect from "../../components/common/base/IceSelect";
    import IceDialog from "../../components/common/base/IceDialog";
    import IceCronEditor from "../../components/common/base/IceCronEditor/index";
    import ServiceManage from "../system/serviceInformation/serviceManage";
    import JobBase from './widget/JobBase';
    import JobHistory from "./widget/JobHistory";

    export default {
        name: "JobList",
        mixins: [JobBase],
        data() {
            return {
                dialogVisible: false,
                historyDialogVisible: false,
                query: [
                    {type: 'input', label: '任务名称', code: 'jobName', value: '',},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {
                        label: '任务模块',
                        code: 'jobClassification',
                        width: 150,
                        mapTypeCode: "jobClassification",
                        sortable: true
                    },
                    {label: '任务名称', code: 'jobName', width: 300, align: 'left'},
                    {label: '任务类型', code: 'jobType', width: 100, mapTypeCode: "scheduler"},
                    {
                        label: '任务状态', code: 'jobStatus', width: 100, align: 'left', renderCell: (h, data) => {
                            return (<div class="statusWrapper">
                                <div class={'status ' + this.resolveStatus(data.row.jobStatus).code}></div>
                                <div>{this.resolveStatus(data.row.jobStatus).name}</div>
                            </div>)
                        }
                    },
                    {label: '任务描述', code: 'jobDescription', width: 300, align: 'left'},
                    {label: '最后执行时间', code: 'lastInvokeTime', width: 150, sortable: true},
                    {label: '最后成功执行时间', code: 'lastSuccessTime', width: 150, sortable: true},
                    {label: '最后操作人', code: 'updateUser', width: 150},
                    {label: '最后操作时间', code: 'updateDate', width: 150, sortable: true}],
                operations: [
                    {name: '立即执行', callback: this.exec},
                    {
                        name: '暂停', callback: this.pause, isShow: (row) => {
                            return row.jobStatus == 'NORMAL'
                        }
                    },
                    {
                        name: '恢复', callback: this.resume, isShow: (row) => {
                            return row.jobStatus == 'PAUSED'
                        }
                    },
                    {name: '修改', callback: this.update},
                    {name: '删除', callback: this.delete},
                    {name: '执行历史', callback: this.showHistory},
                ],
                buttons: [
                    {
                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                            this.dialogVisible = true;
                            this.formData = {
                                jobName: '',
                                jobClassification: '',
                                jobType: '',
                                requestMethod: 'GET',
                                jobContent: '',
                                cronExpression: '',
                                jobDescription: '',
                                startTime: '',
                                endTime: ''
                            };
                        }
                    }
                ],
                formData: {
                    jobName: '',
                    jobClassification: '',
                    jobType: '',
                    requestMethod: 'GET',
                    jobContent: '',
                    cronExpression: '',
                    jobDescription: '',
                    startTime: '',
                    endTime: ''
                },
                rules: {
                    jobName: [{required: true, whitespace: true, message: '请输入任务名称', trigger: 'blur'}],
                    jobClassification: [{required: true, whitespace: true, message: '请输入任务所属', trigger: 'blur'}],
                    jobType: [{required: true, whitespace: true, message: '请输入任务类型', trigger: 'blur'}],
                    jobContent: [{required: true, whitespace: true, message: '请输入任务内容', trigger: 'blur'}],
                    cronExpression: [{required: true, whitespace: true, message: '请输入定时任务规则', trigger: 'blur'}],
                    startTime: [{required: true, type: 'date', whitespace: true, message: '请输入开始时间', trigger: 'blur'}],
                    /* endTime: [{required: true, whitespace: true, message: '请输入截止时间', trigger: 'blur'}],*/

                },

                selectedJobId: '',
                serviceVisible: false
            }
        },
        methods: {
            delete(item) {
                this.$confirm('是否确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.delete("/scheduler/job/deletJob", {params: {jobId: item.oid}})
                        .then((result) => {
                            this.close()
                            this.$message.success("删除成功")
                            this.$refs.scheduler.refresh();
                        })
                        .catch(error => {

                        })
                }).catch(() => {

                });
            },


            update(item) {
                this.dialogVisible = true
                this.$axios.get("/scheduler/job/get", {params: {jobId: item.oid}})
                    .then(result => {
                        this.formData = result.data;
                        // this.formData.
                        if (this.formData.startTime) {
                            try {
                                this.formData.startTime = new Date(this.formData.startTime);
                            } catch (e) {
                                this.formData.startTime = '';
                            }
                        }
                        if (this.formData.endTime) {
                            try {
                                this.formData.endTime = new Date(this.formData.endTime);
                            } catch (e) {
                                this.formData.endTime = '';
                            }
                        }
                    }).catch(error => {
                    this.$message.error(error.msg)
                })
            },

            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.formData.oid) {
                            this.$axios.post("/scheduler/job/addJob", this.formData)
                                .then((result) => {
                                    this.close()
                                    this.$refs.scheduler.refresh();
                                })
                                .catch(error => {
                                    this.$message.error(error.msg)
                                })
                        } else {
                            this.$axios.post("/scheduler/job/modifyJob", this.formData)
                                .then((result) => {
                                    this.close()
                                    this.$refs.scheduler.refresh();
                                })
                                .catch(error => {
                                    this.$message.error(error.msg)
                                })
                        }
                    }
                })


            },
            close() {

                this.$refs.form.resetFields();
                this.dialogVisible = false;
            },

            handleSelectionChange(rows) {
                if (rows && rows.length > 0) {
                    let row = rows[0];
                    this.formData.jobContent = row.serviceUrl;
                    this.serviceVisible = false;
                }

            }
        },
        created() {

        },
        mounted() {

        },
        components: {JobHistory, ServiceManage, IceCronEditor, IceDialog, IceSelect, IceQueryGrid}
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
<style lang="less" scoped>

</style>