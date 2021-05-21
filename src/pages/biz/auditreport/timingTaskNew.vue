<template>
    <div class="ice-container">
        <ice-query-grid :buttons="buttons"
                        :columns="columns"
                        :operations="operations"
                        :operationsWidth="180"
                        :pagination="true"
                        :query="query"
                        data-url="/biz/BizArSchedulerConfig/list"
                        element-loading-background="rgba(0, 0, 0, 0.8)"
                        element-loading-spinner="el-icon-loading"
                        element-loading-text="任务发起中..."
                        ref="grid"
                        v-loading="loading">
        </ice-query-grid>
        <ice-persion-selector
                :allDept="true"
                @select-confirm="selectUserConfirm"
                choose-item="single"
                mode="hidden"
                ref="persionPop">
        </ice-persion-selector>

        <ice-dialog :before-close="closeDialog" :title="title" :visible.sync="dialogVisible" width="1100px">
            <div style="margin: 0;padding: 0;max-height: 600px;overflow-x: hidden;overflow-y: scroll">
                <el-form :model="mainData" :rules="formRules" label-width="120px" ref="form">
                    <el-row :gutter="50">
                        <el-col :span="8">
                            <el-form-item label="报告类型" prop="reportName">
                                <ice-select :text.sync="mainData.reportName"
                                            @change="$nextTick(()=>{$refs.form.validateField('reportName',error=>{})})"
                                            map-type-code="OR_REPORT_TYPE" v-model="mainData.reportCode"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="报告周期" prop="schedulerCode">
                                <ice-select :text.sync="mainData.schedulerName"
                                            @change="$nextTick(()=>{$refs.form.validateField('schedulerCode',error=>{})})"
                                            map-type-code="REPORT_CYCLE"
                                            v-model="mainData.schedulerCode"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="8">
                            <el-form-item label="责任人" prop="applyUserName">
                                <el-input placeholder="请选择责任人"
                                          readonly
                                          v-model="mainData.applyUserName">
                                    <el-button @click="choosePeople" icon="el-icon-user-solid" slot="append"
                                               title="点我选择责任人"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="区域" prop="areaName">
                                <el-input placeholder="请选择区域"
                                          readonly
                                          v-model="mainData.areaName">
                                    <el-button @click="chooseArea" icon="el-icon-edit-outline" slot="append"
                                               title="点我选择区域"></el-button>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="8">
                            <el-form-item label="网络类型" prop="networkCode">
                                <ice-select :disabled="true" :text.sync="mainData.networkName"
                                            map-type-code="PRO_NETWORK" v-model="mainData.networkCode"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="责任单位" prop="applyOrgName">
                                <el-input placeholder="选择区域后自动带出" readonly v-model="mainData.applyOrgName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="8">
                            <el-form-item label="主流程" prop="flowKey">
                                <ice-select :text.sync="mainData.flowName" @changevalue="parentFlowChange"
                                            map-type-code="OR_FLOW_TYPE" v-model="mainData.flowKey">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="状态" prop="status">
                                <ice-select map-type-code="OR_STATUS"
                                            v-model="mainData.status"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="50">
                        <el-col :span="8">
                            <el-form-item label="预计用时(工作日)" prop="expectTakeDay">
                                <el-input-number :max="365" :min="0" @change="expectTakeDayVal"
                                                 v-model="mainData.expectTakeDay"></el-input-number>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="报告模板" prop="tmpFileId">
                                <ice-single-upload :on-success="success"
                                                   style-type="input"
                                                   v-model="mainData.tmpFileId"></ice-single-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div>
                    <el-button @click="addTableItem" style="margin-bottom: 2px" type="primary">新增</el-button>
                </div>
                <ice-editable-table :data="tableList" :rules="tableData" ref="editTable" style="width: 100%">
                    <el-table-column :width="50" label="序号">
                        <template slot-scope="scope">
                            {{scope.$index+1}}
                        </template>
                    </el-table-column>
                    <ice-editable-table-column :options="options"
                                               :width="180"
                                               input-type="selectArray"
                                               label="子流程选择"
                                               prop="flowKey"
                                               title="请先选择主流程">
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="180"
                                               label="报告类型"
                                               prop="reportCode">
                        <template slot-scope="scope">
                            <ice-select :text.sync="scope.row.reportName" map-type-code="OR_REPORT_TYPE"
                                        v-model="scope.row.reportCode"></ice-select>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="150"
                                               label="责任人"
                                               prop="applyUserName">
                        <template slot-scope="scope">
                            <el-input placeholder="请选择责任人"
                                      readonly
                                      v-model="scope.row.applyUserName">
                                <el-button @click="chooseTablePeople(scope)" icon="el-icon-user-solid" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="180"
                                               label="网络类型"
                                               prop="networkCode">
                        <template slot-scope="scope">
                            <ice-select :text.sync="scope.row.networkName" map-type-code="PRO_NETWORK"
                                        v-model="scope.row.networkCode"></ice-select>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="200"
                                               input-type="input"
                                               label="报告模板"
                                               maxlength="30"
                                               prop="tmpFileName">
                        <template slot-scope="scope">
                            <ice-single-upload :on-success="(response,file)=>{
                                               scope.row.tmpFileId=response.data;
                                               scope.row.tmpFileName=file.name;
                                               }"
                                               style-type="input"
                                               v-model="scope.row.tmpFileId"></ice-single-upload>
                        </template>
                    </ice-editable-table-column>
                    <ice-editable-table-column :width="100"
                                               input-type="select"
                                               label="状态"
                                               map-type-code="OR_STATUS"
                                               prop="status">
                    </ice-editable-table-column>
                    <ice-editable-table-column :max="365"
                                               :min="0"
                                               :width="100"
                                               input-type="number"
                                               label="预计用时"
                                               prop="expectTakeDay">
                    </ice-editable-table-column>
                    <el-table-column :width="100" fixed="right" label="操作">
                        <template slot-scope="scope">
                            <el-button @click="deleteTableItem(scope.$index)"
                                       size="small" type="text">删除
                            </el-button>
                            <el-button @click="downLoadTableItem(scope.row.tmpFileId)"
                                       size="small"
                                       type="text" v-show="scope.row.tmpFileId">下载
                            </el-button>
                        </template>
                    </el-table-column>
                </ice-editable-table>
            </div>
            <div class="ice-button-bar ">
                <el-button @click="save" type="primary">保存</el-button>
                <el-button @click="closeDialog" type="info">返回</el-button>
            </div>
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

    export default {
        name: "timingTask",
        components: {
            BaseArea,
            IceSingleUpload,
            IcePersionSelector, IceSelect, IceEditableTableColumn, IceEditableTable, IceDialog, IceQueryGrid
        },
        data() {
            let areaNameValid = (rule, value, callback) => {
                console.log(this.mainData.areaName);
                // debugger;
                if (!value) {
                    callback(new Error('年龄不能为空'));
                } else {
                    callback();
                }
            };
            return {
                loading: false,
                query: [
                    {type: 'input', label: '报告类型', code: 'reportName'},
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '报告类型', code: 'reportName', width: 150, sortable: true},
                    {label: '责任单位', code: 'applyOrgName', width: 150, sortable: true},
                    {label: '网络类型', code: 'networkName', width: 150, sortable: true},
                    {label: '报告周期', code: 'schedulerName', width: 120, sortable: true},
                    {label: '责任人', code: 'applyUserName', width: 150, sortable: true},
                    {
                        label: '状态', code: 'status', width: 100, sortable: true, renderCell(h, data) {
                            return (data.row.status == 0 ? "启用" : (data.row.status == 1 ? "禁用" : ""))
                        }
                    },
                    {label: '创建时间', code: 'createDate', sortable: true}
                ],
                operations: [
                    {name: '编辑', callback: this.upDataItem},
                    {name: '删除', callback: this.deleteItem},
                    {name: '立即执行', callback: this.startItem},
                    {name: '复制', callback: this.copyItem},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', callback: this.addItem}
                ],
                dialogVisible: false,
                mainData: {
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
                    areaName: '',
                    areaCode: '',
                },
                formRules: {
                    reportName: [{required: true, message: '请选择报告类型', trigger: 'blur'}],
                    applyUserName: [{required: true, message: '请选择责任人', trigger: 'change'}],
                    flowKey: [{required: true, message: '请选发起的流程', trigger: 'blur'}],
                    schedulerCode: [{required: true, message: '请选择报告周期', trigger: 'blur'}],
                    areaName: [{required: true, message: '请选择区域', trigger: 'change'}],
                    /*networkCode: {required: true, message: '请选择网络类型', trigger: 'blur'},*/
                },
                tableList: [],
                tableData: {
                    reportName: {required: true, message: '请选择报告类型', trigger: 'blur'},
                    applyUserName: {required: true, message: '请选择责任人', trigger: 'change'},
                    flowKey: {required: true, message: '请选择子流程', trigger: 'blur'},
                },
                percent: 0,
                uploading: false,
                percentA: 0,
                isTable: false,
                tablePeopleIndex: '',
                options: [],
                title: '',
                text: '',
            }
        },
        watch: {},
        methods: {
            /**选择区域所带数据*/
            getAreaData(data) {
                this.mainData.applyOrgName = data[0].unitName;
                this.mainData.applyOrgCode = data[0].unit;
                this.mainData.networkCode = data[0].network;
                this.mainData.areaName = data[0].shortname;
                this.mainData.areaCode = data[0].code;
            },
            /**选择区域*/
            chooseArea() {
                this.$refs.baseArea.openDialog();
            },
            /**设置预计用时最小值为0*/
            expectTakeDayVal() {
                if (!this.mainData.expectTakeDay) {
                    this.mainData.expectTakeDay = '0';
                }
            },
            /**新增*/
            addItem() {
                this.title = "新增";
                this.percent = 0;
                this.tableList = [];
                this.dialogVisible = true;
                this.$nextTick(() => {
                    this.resetForm();
                });

            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            beforeUpload(file, scope) {
                this.$set(scope.row, 'uploading', true);
            },
            downLoadTableItem(id) {
                this.$downloadFile(id);
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
                this.title = '编辑';
                this.percent = 0;
                this.$axios.get("/biz/BizArSchedulerConfig/getcfg", {"params": {"id": row.oid}}).then(success => {
                    this.mainData = success.data;
                    this.mainData.status = this.mainData.status.toString();
                    this.tableList = this.mainData.chs;
                    this.tableList.forEach(item => {
                        item.status = item.status.toString();
                    });
                    this.dialogVisible = true;
                    this.parentFlowChange(this.mainData.flowKey);
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
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
            /**编辑--保存*/
            save() {
                let isTrue = false;
                this.$refs.editTable.validateAll((valid) => {
                    isTrue = valid;
                });
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
                        })
                    }
                });

            },
            /**编辑--关闭*/
            closeDialog() {
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
            /**立即执行*/
            startItem(row) {
                this.$confirm("确定要立即发起该流程吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.loading = true;
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
                });
            },
            /**选人--form表单*/
            choosePeople() {
                this.isTable = false;
                this.$refs.persionPop.openDialog();
                this.$nextTick(() => {
                    this.$refs.persionPop.cleanColumnSelect();
                });
            },
            /**选人--table列*/
            chooseTablePeople(scope) {
                this.tablePeopleIndex = scope.$index;
                this.isTable = true;
                this.$refs.persionPop.openDialog();
                this.$nextTick(() => {
                    this.$refs.persionPop.cleanColumnSelect();
                });
            },
            /**选人保存按钮*/
            selectUserConfirm(row) {
                if (this.isTable) {
                    this.tableList[this.tablePeopleIndex].applyUserName = row[row.length - 1].name;
                    this.tableList[this.tablePeopleIndex].applyUserCode = row[row.length - 1].code;
                    this.$refs.editTable.validateField('applyUserName');
                } else {
                    this.mainData.applyUserName = row[row.length - 1].name;
                    this.mainData.applyUserCode = row[row.length - 1].code;
                }
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
                    flowName: '',
                    flowKey: '',
                    reportName: '',
                    applyUserName: '',
                    applyUserCode: '',
                    tmpFileId: '',
                    tmpFileName: '',
                    status: '0',
                    percentA: 0,
                    applyOrgName: '',
                    expectTakeDay: 0
                })
            },
            parentFlowChange(item) {
                this.$axios.get("/bpm/definition/getChildren", {"params": {"bpmDefKey": item}}).then(success => {
                    this.options = [];
                    success.data.subProcessNodes.forEach(flow => {
                        let childFlow = {};
                        childFlow.value = flow.processDefKey;
                        childFlow.label = flow.processDefName;
                        this.options.push(childFlow);
                    });
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            }
        },
        mounted() {
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