<template>
    <div class="ice-container">
        <ice-query-grid data-url="/biz/BizArSchedulerConfig/list"
                        :pagination="true"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        v-loading="loading"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        element-loading-spinner="el-icon-loading"
                        element-loading-text="任务发起中..."
                        :operationsWidth="190"
                        :buttons="buttons"
                        :operations="operations">
        </ice-query-grid>
        <ice-persion-selector
                choose-item="single"
                ref="persionPop"
                :allDept="true"
                mode="hidden"
                :selectedPersion="selectedPersion"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>

        <ice-dialog width="1100px" :visible.sync="dialogVisible" :title="title" :before-close="closeDialog" remounted>
            <div style="margin: 0;padding-right: 5px;max-height: 500px;overflow-x: hidden;overflow-y: scroll">
                <el-form :model="mainData" :rules="formRules" label-width="120px" ref="form">
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item label="报告类型" prop="reportCode">
                                <ice-select map-type-code="OR_REPORT_TYPE"
                                            :disabled="!isEdit"
                                            @change="$nextTick(()=>{$refs.form.validateField('reportName',error=>{})})"
                                            :text.sync="mainData.reportName" v-model="mainData.reportCode"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="schedulerCode" label="报告周期">
                                <ice-select map-type-code="REPORT_CYCLE"
                                            :disabled="!isEdit"
                                            @change="$nextTick(()=>{$refs.form.validateField('schedulerCode',error=>{})})"
                                            :text.sync="mainData.schedulerName"
                                            v-model="mainData.schedulerCode"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item label="对应流程" prop="flowKey">
                                <ice-select :text.sync="mainData.flowName"
                                            :disabled="!isEdit"
                                            map-type-code="OR_FLOW_TYPE"
                                            v-model="mainData.flowKey">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态" prop="status">
                                <ice-select map-type-code="OR_STATUS"
                                            :disabled="!isEdit"
                                            v-model="mainData.status"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="12">
                            <el-form-item label="报告模板" prop="tmpFileId">
                                <ice-single-upload :on-success="success"
                                                   v-if="isEdit"
                                                   style-type="input"
                                                   ref="isu"
                                                   v-model="mainData.tmpFileId"></ice-single-upload>
                                <el-input disabled v-if="!isEdit"
                                          v-model="mainData.tmpFileName">
                                    <el-button @click="downloadTmpFile" icon='el-icon-download'
                                               slot="append"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="预计用时(工作日)" prop="expectTakeDay">
                                <el-input-number :max="365" :min="0"
                                                 @change="expectTakeDayVal"
                                                 :disabled="!isEdit"
                                                 v-model="mainData.expectTakeDay"></el-input-number>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50" v-if="!isEdit">
                        <el-col :span="12">
                            <el-form-item label="定时任务状态" prop="cronStatus">
                                <ice-select mapTypeCode="OR_CRON_STATUS" v-model="mainData.cronStatus"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="定时任务" prop="cronExp">
                                <ice-cron-editor v-model="mainData.cronExp" @change="jobIdChange"></ice-cron-editor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="24">
                            <el-form-item label="上报要求" prop="demand" v-if="isEdit">
                                <el-input :row="3"
                                          :showWordLimit="true"
                                          :disabled="!isEdit"
                                          maxlength=600
                                          type="textarea"
                                          v-model="mainData.demand">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div>
                    <el-button type="primary" @click="addTableItem" style="margin-bottom: 2px" v-if="isEdit">新增</el-button>
                    <el-button type="primary" @click="startAllItem" style="margin-bottom: 2px" v-if="!isEdit">发起所有</el-button>
                </div>
                <ice-editable-table :data="tableList" :rules="tableRules" ref="editTable" style="width: 100%" :disabled="!isEdit">
                    <el-table-column :width="50" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <ice-editable-table-column label="责任人"
                                               prop="applyUserName"
                                               :width="230">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyUserName"
                                      readonly
                                      placeholder="请选择责任人">
                                <el-button @click="chooseTablePeople(scope.$index)" icon="el-icon-user-solid" slot="append"
                                           title="点我选择责任人" :disabled="!isEdit"></el-button>
                            </el-input>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column label="责任单位"
                                               prop="applyOrgName"
                                               :width="200">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.applyOrgName" placeholder="选择责任人后自动带出" readonly>
                            </el-input>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column prop="status"
                                               :width="150"
                                               label="状态"
                                               input-type="select"
                                               :disabled="!isEdit"
                                               map-type-code="OR_STATUS">
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="null"
                                               label="区域"
                                               prop="areaName">
                        <template slot-scope="scope">
                            <el-input readonly
                                      v-model="scope.row.areaName"
                                      placeholder="请选择区域">
                                <el-button @click="chooseArea(scope.$index)" icon="el-icon-edit-outline" slot="append"
                                           title="点我选择区域" :disabled="!isEdit"></el-button>
                            </el-input>
                        </template>
                    </ice-editable-table-column>
                    <el-table-column :width="100" fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       size="small" @click="startSingleItem(scope.row)" v-if="!isEdit">发起
                            </el-button>
                            <el-button type="text"
                                       size="small" @click="deleteTableItem(scope.$index)" v-if="isEdit">删除
                            </el-button>

                        </template>
                    </el-table-column>

                </ice-editable-table>
            </div>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">返回</el-button>
            </div>
        </ice-dialog>
        <ice-dialog :visible.sync="visibleDialogJob" remounted title="任务记录" width="800px">
            <job-history :selectedJobId="jobId"></job-history>
        </ice-dialog>
        <base-area @getData="getAreaData" ref="baseArea"></base-area>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import BaseArea from "./baseArea";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import IceCronEditor from "../../../components/common/base/IceCronEditor/index";
    import JobList from "../../scheduler/JobList";
    import JobHistory from "../../scheduler/widget/JobHistory";
    import date from "@/components/common/base/calendar/date.js"

    export default {
        name: "timingTask",
        components: {
            JobHistory,
            JobList,
            IceCronEditor,
            BaseArea,
            IceSingleUpload,
            IcePersionSelector, IceSelect, IceEditableTableColumn, IceEditableTable, IceDialog, IceQueryGrid
        },
        mixins:[devComm],
        data() {
            return {
                jobId:'',
                loading: false,
                query: [
                    {type: 'input', label: '报告类型', code: 'reportName', value: ''},
                    {type: 'input', label: '对应流程', code: 'flowName', value: ''},
                    {type: 'select', label: '报告类型', code: 'reportCode', value: '', mapTypeCode: 'OR_REPORT_TYPE'},
                    {type: 'select', label: '报告周期', code: 'schedulerCode', mapTypeCode: 'REPORT_CYCLE', value: ''},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {code: "cronJobId", hidden: true},
                    {label: '报告周期', code: 'schedulerCode', mapTypeCode: 'REPORT_CYCLE', width: 100, sortable: true},
                    {
                        label: '状态', code: 'status', width: 100, sortable: true, renderCell(h, data) {
                            return (data.row.status == 0 ? "启用" : (data.row.status == 1 ? "禁用" : ""))
                        }
                    },
                    {label: '对应流程', code: 'flowName', width: 250, sortable: true},
                    {label: '报告类型', code: 'reportCode', mapTypeCode: 'OR_REPORT_TYPE', width: 250, sortable: true},
                    {label: '定时状态', code: 'cronStatus', mapTypeCode: 'OR_CRON_STATUS', width: 100, sortable: true},
                    // {label: '定时规则', code: 'cronExp', width: 100, sortable: true},
                    {label: '更新时间', code: 'updateDate', sortable: true}
                ],
                operations: [
                    {name: '编辑', callback: this.upDataItem},
                    {name: '删除', callback: this.deleteItem},
                    {name: '定时任务', callback: this.startItem},
                    {
                        name: '任务记录', callback: this.objLook, isShow: function (row) {
                            return row.cronJobId;
                        }
                    }
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', callback: this.addItem}
                ],
                dialogVisible: false,
                cronJobId:'',
                priorDisabled:false,
                mainData: {
                    cronExp:'',
                    cronStatus:'1',
                    cronJobId:'',
                    reportCode: '',
                    reportName: '',
                    applyOrgName: '',
                    applyOrgCode: '',
                    applyUserName: '',
                    applyUserCode: '',
                    schedulerCode: '',
                    schedulerName: '',
                    status: '0',
                    networkCode: '',
                    networkName: '',
                    flowKey: '',
                    flowName: '',
                    tmpFileName: '',
                    tmpFileId: '',
                    expectTakeDay: 0,
                    chs: [],
                    demand:'',
                },
                formRules: {
                    reportCode: [{required: true, message: '请选择报告类型', trigger: 'change'}],
                    applyUserName: [{required: true, message: '请选择责任人', trigger: 'change'}],
                    flowKey: [{required: true, message: '请选择发起的流程', trigger: 'change'}],
                    schedulerCode: [{required: true, message: '请选择报告周期', trigger: 'change'}],
                },
                tableList: [],
                tableRules: {
                    applyUserName: {required: true, message: '请选择责任人', trigger: 'change'},
                    areaName: {required: true, message: '请选择区域', trigger: 'change'},
                },
                percent: 0,
                uploading: false,
                options: [],
                title: '',
                tableIndex:0,
                selectedPersion:[],
                isEdit:true,
                rowOid:'',
                visibleDialogJob:false,
                jobIdObj:{}
            }
        },
        methods: {
            /**定时任务参数*/
            jobIdChange(){
                this.jobIdObj = {
                    jobName: this.mainData.schedulerName+'_'+this.mainData.reportName,
                    jobClassification: 'OpsReport',
                    jobType: 'InnerInvokeJob',
                    requestMethod: 'POST',
                    jobContent: '/biz/opsreport/schedulerConfig/start?oid='+this.rowOid,
                    cronExpression: this.mainData.cronExp,
                    jobDescription: '',
                    startTime: date.format(new Date(),'yyyy-MM-dd HH:mm:ss'),
                    endTime: ''
                };
            },
            /**任务记录*/
            objLook(row){
                this.jobId = row.cronJobId;
                this.visibleDialogJob = true;
            },
            /**选择区域所带数据*/
            getAreaData(data){
                let arr = Object.assign([],this.tableList);
                arr[this.tableIndex].networkCode = data[0].network;
                arr[this.tableIndex].networkName = this.getNetworkName(data[0].network);
                arr[this.tableIndex].areaName = data[0].shortname;
                arr[this.tableIndex].areaCode = data[0].code;
                this.tableList = [];
                this.tableList = arr;
                this.validTable(this.tableIndex,'areaName');
            },
            /**选择区域*/
            chooseArea(index){
                this.tableIndex = index;
                this.$refs.baseArea.openDialog();
            },
            /**设置预计用时最小值为0*/
            expectTakeDayVal() {
                if (!this.mainData.expectTakeDay) {
                    this.mainData.expectTakeDay = '0';
                }
            },
            getNetworkName(code){
                for(let i=0;i<this.ENUMS.PRO_NETWORK_DATA.length;i++){
                    if(this.ENUMS.PRO_NETWORK_DATA[i].code==code){
                        return this.ENUMS.PRO_NETWORK_DATA[i].name;
                    }
                }
                return '';
            },
            /**新增*/
            addItem() {
                this.isEdit = true;
                this.title = "新增";
                this.percent = 0;
                this.tableList = [];
                this.dialogVisible = true;
                this.mainData = {
                    reportCode: '',
                    reportName: '',
                    applyOrgName: '',
                    applyOrgCode: '',
                    applyUserName: '',
                    applyUserCode: '',
                    schedulerCode: '',
                    schedulerName: '',
                    status: '0',
                    networkCode: '',
                    networkName: '',
                    flowKey: '',
                    flowName: '',
                    tmpFileName: '',
                    tmpFileId: '',
                    expectTakeDay: 0,
                    chs: [],
                    demand:'',
                };

            },
            /**重置form表单字段*/
            resetForm(){
                this.$refs.form.resetFields();
            },
            /**上传之前的操作*/
            beforeUpload(file, scope) {
                this.$set(scope.row, 'uploading', true);
            },
            /**下载查看*/
            look(id) {
                this.$downloadFile(id);
            },
            /**上传触发事件*/
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            /**上传成功触发事件*/
            success(response, file, fileList) {
                this.mainData.tmpFileName = file.name;
                this.mainData.tmpFileId = response.data;
            },
            /**编辑--打开*/
            upDataItem(row) {
                this.isEdit = true;
                this.title = '编辑';
                this.percent = 0;
                this.getData(row);
            },
            /**复制*/
            copyItem(row) {
                this.$axios.post("/biz/BizArSchedulerConfig/copy", {"id": row.oid}).then(success => {
                    this.$message.success("保存成功");
                    this.$refs.grid.refresh();
                    this.dialogVisible = false;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                })
            },
            validTable(index,field){
                this.$refs.editTable.validateField(index,field);
            },
            /**编辑--保存*/
            save() {
                let isTrue = false;
                this.$refs.editTable.validateAll((valid) => {
                    isTrue = valid;
                });
                if(this.tableList.length===0){
                    isTrue = false;
                    this.$message.warning("请选择责任人");
                }
                this.$refs.form.validate((valid) => {
                    if (valid && isTrue) {
                        this.mainData.chs = this.tableList;
                        this.$axios.post("/biz/BizArSchedulerConfig/saveOrUpdates", this.mainData).then(success => {
                            this.$message.success("保存成功");
                            this.$refs.grid.refresh();
                            this.dialogVisible = false;
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                });

            },
            /**编辑--关闭*/
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**删除*/
            deleteItem(row) {
                this.$confirm("确定要删除吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/biz/BizArSchedulerConfig/del", {"params": {"id": row.oid}}).then(success => {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })
                    })
                })
            },
            getData(row){
                this.$axios.get("/biz/BizArSchedulerConfig/getcfg", {"params": {"id": row.oid}}).then(success => {
                    success.data.cronStatus = success.data.cronStatus||success.data.cronStatus == 0?success.data.cronStatus.toString():'1';
                    this.mainData = success.data;
                    this.mainData.status = this.mainData.status.toString();
                    this.tableList = this.mainData.chs;
                    this.tableList.forEach(item => {
                        item.status = item.status.toString();
                    });
                    if (this.mainData.cronJobId) {
                        this.$axios.get("/scheduler/job/get", {"params": {"jobId": this.mainData.cronJobId}}).then(success => {
                            if (success.data && success.data.jobStatus === 'PAUSED') {
                                this.mainData.cronStatus = '0';
                            } else {
                                this.mainData.cronStatus = '1';
                            }
                            this.mainData.cronExp = success.data.cronExpression;
                        });
                    }
                    this.dialogVisible = true;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            /**发起所有*/
            startAllItem(){
                this.startAll(this.rowOid);
            },
            startAll(oid){
                this.$confirm("确定要立即发起流程吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.loading = true;
                    if (this.mainData.cronJobId) {
                        this.$axios.post("/scheduler/job/exec", {"jobId": this.mainData.cronJobId}).then(success => {
                            this.loading = false;
                            this.$message({
                                type: 'success',
                                message: '执行成功'
                            })
                        }).catch(error => {
                            this.loading = false;
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    } else {
                        this.$axios.get("/biz/BizArSchedulerConfig/startFlow", {"params": {"id": oid}}).then(success => {
                            this.loading = false;
                            this.$message({
                                type: 'success',
                                message: '执行成功'
                            })
                        }).catch(error => {
                            this.loading = false;
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                });
            },
            /**流程发起*/
            startItem(row) {
                this.title = '流程发起';
                this.isEdit = false;
                this.rowOid = row.oid;
                this.getData(row);
            },
            /**发起*/
            startSingleItem(row){
                this.$axios.get("/biz/BizArSchedulerConfig/startFlow", {"params": {"id": row.oid}}).then(success => {
                    this.loading = false;
                    this.$message({
                        type: 'success',
                        message: '执行成功'
                    })
                }).catch(error => {
                    this.loading = false;
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            /**选人--form表单*/
            choosePeople() {
                this.selectedPersion = [];
                this.$nextTick(() => {
                    this.$refs.persionPop.openDialog();
                });
            },
            /**选人--table列*/
            chooseTablePeople(index) {
                this.tableIndex = index;
                this.$refs.persionPop.openDialog();

            },
            /**选人保存按钮*/
            selectUserConfirm(row) {
                let arr = Object.assign([],this.tableList);
                arr[this.tableIndex].applyUserName = row[row.length - 1].name;
                arr[this.tableIndex].applyUserCode = row[row.length - 1].code;
                arr[this.tableIndex].applyOrgName = row[row.length - 1].orgShortName;
                arr[this.tableIndex].applyOrgCode = row[row.length - 1].dataOrgCode;
                this.tableList = [];
                this.tableList = arr;
                this.validTable(this.tableIndex,'applyUserName');
                this.$refs.persionPop.selections = [];
                this.$refs.persionPop.$refs.select.$refs.queryTreeGridPop.$refs.tree.refresh();
            },
            /**删除--弹框--table列表*/
            deleteTableItem(index) {
                this.$confirm("确定要删除吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.tableList.splice(index, 1);
                });
            },
            /**新增--弹框--table列表*/
            addTableItem() {
                this.options = [];
                this.tableList.push({
                    applyUserName: '',
                    applyUserCode: '',
                    applyOrgName: '',
                    applyOrgCode:'',
                    status:'0',
                    networkName:'',
                    networkCode:'',
                    areaName:'',
                    areaCode:''
                });
            },
            downloadTmpFile() {
                this.$downloadFile(this.mainData.tmpFileId);
            }
        },
        mounted() {
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.PRO_NETWORK.CODE);
        },
    }
</script>

<style scoped>
    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 80px;
        width: 100%;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;
    }

    .file-uploader .progress {
        background: #5daf34;
        height: 100%;
        width: 0;
        left: 0;
        position: absolute;
        top: 0;
        text-align: right;
    }
</style>