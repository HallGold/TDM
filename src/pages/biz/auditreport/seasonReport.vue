<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesReport" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" :defaultExpanded="false" name="上报人信息">
                        <el-form-item label="上报人" label-width="100px" prop="afUserName">
                            <el-input :disabled="true" placeholder="上报人" v-model="mainData.afUserName"></el-input>
                        </el-form-item>
                        <el-form-item label="上报单位" label-width="100px" prop="afOrgName">
                            <el-input :disabled="true" placeholder="上报单位" v-model="mainData.afOrgName"></el-input>
                        </el-form-item>
                        <el-form-item label="上报时间" label-width="100px" prop="afDate">
                            <el-input :disabled="true" placeholder="上报时间" v-model="mainData.afDate"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" :defaultExpanded="false" name="任务下发表单" v-if="flowShow">
                        <el-form-item label="年度" label-width="100px" prop="reportForm.year">
                            <el-input v-model="mainData.reportForm.year" placeholder="年度" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item prop="period" label="周期">
                            <el-input v-model="mainData.reportForm.period" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="任务发起时间" label-width="100px" prop="reportForm.createDate">
                            <el-input v-model="mainData.reportForm.createDate" placeholder="任务发起时间"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="上报截止时间" label-width="100px" prop="reportForm.endTimeExpect">
                            <el-input v-model="mainData.reportForm.endTimeExpect" placeholder="上报截止时间"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="上报要求" label-width="100px" prop="reportForm.demand" layout="2">
                            <el-input v-model="mainData.reportForm.demand" placeholder="备注" type="textarea" rows="3"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="报告模板" label-width="100px" prop="reportForm.demandFileId" layout="2">
                            <el-button :disabled="!!!mainData.reportForm.demandFileId"
                                       @click="downloadReport(mainData.reportForm.demandFileId)" class="el-icon-view">
                                下载查看
                            </el-button>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="报告单类别">
                        <el-form-item label="报告编号" label-width="100px" prop="reportNo">
                            <el-input v-model="mainData.reportNo" placeholder="报告编号" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="报告分类" label-width="100px" prop="reportName">
                            <ice-datamap-translater mapTypeCode="OR_REPORT_TYPE" model="input"
                                                    v-model="mainData.reportType"></ice-datamap-translater>
                        </el-form-item>
                        <el-form-item label="报告年度" label-width="100px" prop="periodYear">
                            <el-date-picker :disabled="!editor||!flowScope.isAuthor"
                                            format="yyyy年" placeholder="选择年" type="year" v-model="mainData.periodYear"
                                            value-format="yyyy">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="报告季度" label-width="100px" prop="periodQuarter">
                            <ice-select :disabled="!editor||!flowScope.isAuthor" mapTypeCode="OA_QUARTER"
                                        v-model="mainData.periodQuarter"></ice-select>
                        </el-form-item>
                        <el-form-item label="报告月度" label-width="100px" prop="periodMonth">
                            <el-date-picker :disabled="!editor||!flowScope.isAuthor"
                                            format="MM月" placeholder="选择月" type="month" v-model="mainData.periodMonth"
                                            value-format="MM">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="报告名称" label-width="100px" prop="reportName">
                            <el-input v-model="mainData.reportName" placeholder="报告名称"
                                      :disabled="!editor||!flowScope.isAuthor"></el-input>
                        </el-form-item>
                        <el-form-item label="报告总大小" label-width="100px" prop="">
                            <el-input v-model="mainData.allSize" disabled placeholder="报告大小"></el-input>
                        </el-form-item>
                        <el-form-item label="附件最高密级" label-width="100px" prop="">
                            <ice-select v-model="mainData.reportSecretLevel" map-type-code="DATA_SECRET_LEVEL"
                                        :disabled="true"></ice-select>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="报告信息">
                        <div style="margin-bottom: 2px;margin-left: 17px">
                            <el-button @click="openFineReport" icon="el-icon-edit" type="primary"
                                       v-if="mainData.fineReportState&&editor&&flowScope.isAuthor">填报运行数据
                            </el-button>
                            <el-button @click="viewFineReport" code="viewFineReport" icon="el-icon-edit" type="primary"
                                       v-if="mainData.fineReportState">查看运行数据
                            </el-button>
                            <el-button @click="add" icon="el-icon-plus" type="primary"
                                       v-if="editor&&flowScope.isAuthor">上传报告
                            </el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;height:200px;position: relative;overflow: hidden">
                            <div style="position:absolute;;right: -17px;width: 100%">
                                <ice-editable-table :data="tableData" :height="200" style="width: 100%"
                                                    :rules="tableRules"
                                                    ref="editTable">
                                    <el-table-column :width="50"
                                                     label="序号">
                                        <template slot-scope="scope">
                                            {{scope.$index+1}}
                                        </template>
                                    </el-table-column>
                                    <ice-editable-table-column prop="reportFileName"
                                                               maxlength="20"
                                                               label="附件名称"
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column prop="reportSecretLevelCode"
                                                               label="附件密级"
                                                               :disabled="true"
                                                               placeholder="上传附件带出"
                                                               input-type="select"
                                                               map-type-code="DATA_SECRET_LEVEL">
                                    </ice-editable-table-column>
                                    <el-table-column prop="reportFileSize"
                                                     label="文件大小">
                                        <template slot-scope="scope">
                                            {{fileSize(scope.row.reportFileSize)}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="140" v-if="!editor" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button type="text"
                                                       size="small"
                                                       @click="downLoadTableItem(scope.row.reportFileId,scope.row)">下载
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="170" v-if="editor&&flowScope.isAuthor"
                                                     fixed="right">
                                        <template slot-scope="scope">
                                            <el-progress :percentage="scope.row.percent"
                                                         :status="scope.row.percent > 99?'success':'exception'"
                                                         :style="{width: scope.row.percent > 99?'30px':'100%'}"
                                                         v-show="scope.row.uploading"></el-progress>
                                            <ice-single-upload v-model="scope.row.reportFileId"
                                                               ref="uploader"
                                                               :doSecret="true"
                                                               :before-upload="(file)=>{
                                                                    beforeUpload(file,scope)}"
                                                               :progress="progress"
                                                               @security="security"
                                                               @upLoadData="upLoadData"
                                                               :on-success="(response)=>{return success(response,scope)}">
                                                <template slot-scope="upload" v-if="!scope.row.reportFileId">
                                                    <el-button type="text" size="small" @click="upload.click(scope.$index)">上传
                                                    </el-button>
                                                </template>
                                            </ice-single-upload>&nbsp;&nbsp;
                                            <el-button type="text"
                                                       size="small" @click="deleteItem(scope.$index)">删除
                                            </el-button>
                                            <el-button type="text"
                                                       v-show="scope.row.percentA==100 || !!(scope.row.reportFileId)"
                                                       size="small"
                                                       @click="downLoadTableItem(scope.row.reportFileId,scope.row)">下载
                                            </el-button>&nbsp;&nbsp;&nbsp;
                                        </template>
                                    </el-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                    </ice-form-group>
                    <ice-grid-layout :columns="2" name="备注信息">
                        <el-form-item label="报告周期" label-width="100px" prop="reportPeriod" v-if="false">
                            <el-input v-model="mainData.reportPeriod" placeholder="报告周期" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" label-width="100px" prop="remark" layout="2">
                            <el-input v-model="mainData.remark" placeholder="备注" type="textarea" rows="3"
                                      :disabled="!editor||!flowScope.isAuthor"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group code="reportList" name="关联报告">
                        <div style="margin-bottom: 2px">
                            <el-button @click="openReportSelect" type="primary" v-if="editor&&flowScope.isAuthor">
                                选择关联报告
                            </el-button>
                        </div>
                        <div style="width: 100%">
                            <el-table :data="relevanceData"
                                      height="250">
                                <el-table-column
                                        label="序号"
                                        type="index"
                                        width="50">
                                </el-table-column>
                                <el-table-column prop="reportName"
                                                 label="报告名称"
                                                 align="left"
                                                 :show-overflow-tooltip="true"></el-table-column>
                                <el-table-column prop="reportPeriod" label="报告周期"></el-table-column>
                                <el-table-column prop="reportScope" label=报告范围""></el-table-column>
                                <el-table-column prop="afUserName" label="责任人"></el-table-column>
                                <el-table-column prop="afStatus" label="状态">
                                    <template slot-scope="scope">
                                        {{scope.row.afStatus == -1 ? "草稿" : (scope.row.afStatus == 1 ? "运行中" :
                                        (scope.row.afStatus == 2 ? "已完成" : (scope.row.afStatus == 3 ? "驳回" : "")))}}
                                    </template>
                                </el-table-column>
                                <el-table-column prop="updateDate" label="完成时间"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="lookItem(scope.row)" type="text">查看</el-button>
                                        <el-button @click="deleteReportNoItem(scope.$index)" type="text" v-if="editor&&flowScope.isAuthor">删除</el-button> &nbsp;&nbsp;
                                        <el-popover
                                                placement="right"
                                                trigger="click">
                                            <el-table :data="gridData" height="200">
                                                <el-table-column prop="reportFileName"
                                                                 width="200"
                                                                 label="附件名称"
                                                                 :show-overflow-tooltip="true"
                                                                 align="left"></el-table-column>
                                                <el-table-column label="附件大小"
                                                                 prop="reportFileSize">
                                                </el-table-column>
                                                <ice-table-column prop="reportSecretLevelCode"
                                                                  label="附件密级"
                                                                  map-type-code="DATA_SECRET_LEVEL"></ice-table-column>
                                                <el-table-column label="操作">
                                                    <template slot-scope="scope">
                                                        <el-button
                                                                @click="downLoadTableItem(scope.row.reportFileId,scope.row)"
                                                                type="primary">下载
                                                        </el-button>
                                                    </template>
                                                </el-table-column>
                                            </el-table>
                                            <el-button @click="getGridData(scope.row.reportNo)" slot="reference"
                                                       type="text">附件
                                            </el-button>
                                        </el-popover>

                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>


                    </ice-form-group>
                    <ice-grid-layout :columns="2" code="corrList" name="关联整改" v-if="false">
                        <ice-query-grid data-url="/biz/BizArCorrectiveAf/list"
                                        :pagination="true" questionImproveReportList
                                        :min-height="200"
                                        style="max-height: 400px"
                                        ref="iceGrid"
                                        :gridAutoRefresh="false"
                                        :query="queryQ"
                                        :columns="columnsQ"
                                        :operations="operationsQ">
                        </ice-query-grid>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <report-selectors :report-type="reportTypeStr" :selectedReport="oidArr" @getData="getReportData"
                              ref="rs"></report-selectors>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import fileUtil from '@/utils/fileUtil.js';
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";
    import ReportSelectors from "./reportSelectors";
    import IceDatamapTranslater from "../../../components/common/base/IceDatamapTranslater";

    export default {
        name: "seasonReport",
        components: {
            IceDatamapTranslater,
            ReportSelectors,
            IceTableColumn,
            IceFormGroup,
            IceEditableTableColumn,
            IceEditableTable, IceQueryGrid, IceSingleUpload, IceSelect, IceGridLayout, IceFlowForm
        },
        data() {
            return {
                relevanceData: [],   //关联报告数据
                gridData: [],        //关联报告--单条所拥有的附件数--点击下载时展示出来
                mainData: {
                    reportNo: '',
                    reportName: '',
                    reportType: '',
                    periodYear: '',
                    periodQuarter: '',
                    periodMonth: '',
                    allSize: '',
                    reportFileSize: 0,
                    softName: '',
                    afOrgName: '',
                    afUserName: '',
                    afDate: '',
                    remark: '',
                    reportSecretLevel: '',
                    reportList: [],
                    fineReportState: '',
                    reportForm: {
                        year: '',
                        period: '',
                        createDate: '',
                        endTimeExpect: '',
                        demand: '',
                        demandFileId: ''
                    },
                    relevanceData: [],
                },
                flowShow: true,
                childUrl: "/biz/BizArReportForm/child",
                rulesReport: {},
                query: [
                    // {type: 'static',code:'parentId',exp:'=',value:()=>{
                    //     return this.mainData.oid;
                    //     }}
                ],
                queryQ: [
                    {
                        type: 'static', code: 'reportId', exp: '=', value: () => {
                            return this.mainData.oid;
                        }
                    }
                ],
                columns: [
                    {code: "oid", hidden: true},
                    {code: "reportFileId", hidden: true},
                    {label: '报告名称', code: 'reportName', width: 160},
                    {label: '报告周期', code: 'reportPeriod', width: 160},
                    {label: '报告范围', code: 'reportScope', width: 160},
                    {label: '责任人', code: 'afUserName', width: 120},
                    {
                        label: '状态', code: 'afStatus', width: 100, renderCell(h, data) {
                            return (data.row.afStatus == -1 ? "草稿" : (data.row.afStatus == 1 ? "运行中" : (data.row.afStatus == 2 ? "已完成" : (data.row.afStatus == 3 ? "驳回" : ""))))
                        }
                    },
                    {label: '完成时间', code: 'updateDate', width: 120},
                ],
                columnsQ: [
                    {code: "oid", hidden: true},
                    {code: "correctiveFileId", hidden: true},
                    {label: '整改单号', code: 'corrNo', width: 160},
                    {label: '整改报告名称', code: 'reportName', width: 160},
                    {label: '整改报告周期', code: 'reportPeriod', width: 160},
                    {label: '整改报告密级', code: 'reportSecretLevel', width: 120},
                    /*{label: '状态', code: 'afStatus', width: 100,renderCell(h, data){
                            return (data.row.afStatus==-1?"草稿":(data.row.afStatus==1?"运行中":(data.row.afStatus==2?"已完成":(data.row.afStatus==3?"驳回":""))))}},
                    {label: '完成时间', code: 'updateDate', width: 120},*/
                ],
                operations: [
                    {name: '查看', callback: this.lookItem},
                    {name: '下载', callback: this.download}
                ],
                operationsQ: [
                    {name: '查看', callback: this.corrLookItem},
                ],
                tableData: [],                                       /*列表数据*/
                tableRules: {},                                      /*列表验证*/
                editor: false,                                       /*当前环节是否可以编辑*/
                isReportExist: false,                                /*附件是否存在--用来取oid来判断查看记录*/
                reportTypeStr: '',//根据条件查询
                oidArr: [],
                index: 0
            }
        },
        methods: {
            getReportData(data) {
                this.relevanceData = data;
            },
            openReportSelect() {
                this.$refs.rs.openDialog();
                this.oidArr = this.relevanceData;
            },
            /**
             * 获取关联报告附件信息
             */
            getGridData(reportNo) {
                this.$axios.get("/biz/BizArReport/all", {params: {reportNo: reportNo}}).then(success => {
                    this.gridData = [];
                    this.gridData = success.data ? success.data : [];
                    this.gridData.forEach(item => {
                        item.reportFileSize = item.reportFileSize ? fileUtil.fileSizeFormat(item.reportFileSize) : '';
                    });
                }).catch(e => {
                    this.$message.error(e.msg);
                })
            },
            /**
             * 下载关联报告附件
             */
            downloadFileItem(reportFileId) {
                this.$downloadFile(reportFileId);
            },
            add() {
                let obj = {
                    reportFileName: '',
                    reportSecretLevelCode: '',
                    reportFileSize: '',
                    uploading: false,
                    reportFileId: '',
                    percent: 0
                }
                this.tableData.push(obj);
            },
            openFineReport() {
                // 填报运行数据按钮
                this.$axios.get("/biz/BizArReport/fineReportUrl").then(success => {
                    let fineReportUrl = success.data.value;
                    this.$axios.get("/token/refresh").then(success => {
                        let token = success.data;
                        let url = fineReportUrl + "&token=" + token + "&year=" + this.mainData.periodYear
                            + "&quarter=" + this.mainData.periodQuarter + "&inter=" + this.mainData.schedulerConfig.areaName;
                        console.log(url);
                        window.open(url);
                    })
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            viewFineReport() {
                // 查看帆软运行数据按钮
                this.$axios.get("/biz/BizArReport/fineReportHomeUrl").then(success => {
                    let fineReportUrl = success.data.value;
                    this.$axios.get("/token/refresh").then(success => {
                        let token = success.data;
                        let url = fineReportUrl + "&token=" + token + "&year=" + this.mainData.periodYear
                            + "&quarter=" + this.mainData.periodQuarter + "&inter=" + this.mainData.schedulerConfig.areaName;
                        console.log(url);
                        window.open(url);
                    })
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            deleteItem(index) {
                this.tableData.splice(index, 1);
                this.sizeNum(this.tableData);
            },
            deleteReportNoItem(index){
                this.relevanceData.splice(index, 1);
            },
            beforeUpload(file, scope) {
                scope.row.percent = 0;
                this.$set(this.tableData[scope.$index], 'uploading', true);
                this.$set(this.tableData[scope.$index], 'reportFileName', file.name);
                /*if (!this.tableData[scope.$index].reportFileName) {
                    this.$set(this.tableData[scope.$index], 'reportFileName', file.name);
                }*/
                this.$set(this.tableData[scope.$index], 'reportFileSize', file.size);
            },
            sizeNum(arr) {
                let obj = [];
                Object.assign(obj, arr);
                this.mainData.allSize = 0;
                this.tableData = [];
                let num = '';
                obj.forEach(item => {
                    this.mainData.allSize += item.reportFileSize;
                    if (item.reportSecretLevelCode > num) {
                        num = item.reportSecretLevelCode;
                    }
                });
                this.mainData.reportSecretLevel = num;
                this.tableData = obj;
                this.mainData.reportFileSize = this.mainData.allSize;
                this.mainData.allSize = fileUtil.fileSizeFormat(this.mainData.allSize);
            },
            lookItem(row) {
                this.$axios.post("/biz/BizArReportOptRecord/record/view", {"formId": row.oid}).then(success => {//查看记录
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
                window.open("#/biz/auditreport/seasonReport?dataId=" + row.oid, "_blank");
            },
            corrLookItem(row) {
                this.$router.push("/biz/auditreport/questionImproveReport?dataId=" + row.oid);
            },
            /**
             * 获取关联报告
             */
            getRelevanceData(url) {
                this.$axios.get(url).then(success => {
                    this.relevanceData = [];
                    this.relevanceData = success.data ? success.data.records : [];
                }).catch(e => {
                    this.$message.error(e.msg);
                });
            },
            /**流程初始化所带的数据*/
            flowReady(flowcont, bizdata, flowNodes) {
                this.editor = false;
                let currentNode = flowNodes[flowcont.nodeId];
                /* this.childUrl = "/biz/BizArReportForm/child?parentId=" + bizdata.oid+"&current=1&size=1000";
                 this.getRelevanceData(this.childUrl);*/
                bizdata.reportForm = {};
                this.tableData = bizdata.reportList;
                this.mainData = bizdata;
                this.relevanceData = this.mainData.relevanceData;
                if (currentNode.formRole) {
                    let roleArray = JSON.parse(currentNode.formRole);
                    let editor = roleArray.filter(role => 'editor' === role.code);
                    if (editor.length > 0 && 'true' === editor[0].remark) {
                        this.editor = true;
                    }
                    let reportType = roleArray.filter(role => 'reportType' === role.code);
                    if (reportType.length > 0) {
                        this.reportTypeStr = reportType[0].remark;
                    }
                    let fineReportState = roleArray.filter(role => 'fineReportState' === role.code);
                    if (fineReportState.length > 0) {
                        this.mainData.fineReportState = fineReportState[0].remark;
                    }
                }
                this.sizeNum(this.tableData);
                this.$nextTick(() => {
                    this.$axios.get("/biz/BizArIssueForm/get", {"params": {"id": this.mainData.oid}}).then(success => {
                        this.mainData.reportForm = success.data;
                        /*this.$refs.grid.refresh();*/
                        if (this.$refs.iceGrid) {
                            this.$refs.iceGrid.refresh();
                        }

                    }).catch(error => {
                        console.error(error)
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })
                    })
                });
            },
            hasReportFileId() {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].reportFileId) {
                        return true;
                    }
                }
                return false;
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowcont, bizdata) {
                let isTrue = false;
                if (this.$refs.editTable.data.length < 1) {
                    isTrue = false;
                    this.$message.warning("请上传报告");
                    if (!this.hasReportFileId) {
                        this.$message.warning("请上传报告")
                    }
                } else if (!this.hasReportFileId()) {
                    this.$message.warning("请上传报告")
                } else {
                    isTrue = true;
                }
                return isTrue;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                this.mainData.reportList = this.tableData;
                this.mainData.relevanceData = this.relevanceData;
                return this.mainData;
            },
            /**上传触发事件*/
            progress(event) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            /**上传成功触发事件*/
            success(response, scope) {
                this.tableData[scope.$index].reportFileId = response.data;
                this.tableData[scope.$index].percent = 100;
                this.sizeNum(this.tableData);
            },
            /**获取密级*/
            security(data) {
                //①可在上传成功出发事件里完成，此方法可以省略，之所以写这个方法是因为当时可在页面更改密级，但
                //上传组件不支持页面修改密级，之所以保留，因为不影响页面功能，方便以后需要追加此功能
                let arr = Object.assign([], this.tableData);
                this.tableData = [];
                arr[this.index].reportSecretLevelCode = data;
                this.tableData = arr;
                let num = '';
                this.tableData.forEach(item => {
                    if (item.reportSecretLevelCode > num) {
                        num = item.reportSecretLevelCode;
                    }
                });
                this.mainData.reportSecretLevel = num;
            },
            /**获取当前改动的下标*/
            upLoadData(index){
                //同上①
                this.index = index;
            },
            /**文件大小单位转化*/
            fileSize(data) {
                if(data){
                    return data / 1024 / 1024 >= 1024 ? (data / 1024 / 1024 / 1024).toFixed(2) + 'G' :
                        (data / 1024 / 1024 >= 1 ? (data / 1024 / 1024).toFixed(2) + 'MB'
                            : (data / 1024 >= 1 ? (data / 1024).toFixed(0) + 'KB' :
                                data.toFixed(0) + 'B'));
                }
                return '';
            },
            /**下载*/
            download(row) {
                this.$downloadFile(row.reportFileId);
            },
            downloadReport(id) {
                this.$downloadFile(id);
            },
            downLoadTableItem(id, row) {
                this.$downloadFile(id);
                if (row.oid) {
                    this.$axios.post("/biz/BizArReportOptRecord/record/download", {
                        "formId": this.mainData.oid,
                        "reportId": row.oid
                    }).then(success => {
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })
                    });
                }
            }
        },
        mounted() {
            let formId = this.$route.query['dataId'];
            this.$axios.post("/biz/BizArReportOptRecord/record/view", {"formId": formId}).then(success => {//查看记录
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.msg
                })
            });
            this.$axios.get("/biz/BizArReport/reportForm", {params: {"formId": formId}}).then(success => {
                if (success.data) {
                    this.tableData = success.data;
                    this.isReportExist = true;
                }
            }).catch(error => {
                this.$message({
                    type: 'error',
                    message: error.msg
                })
            });
            let flowShow = this.$route.query['flowShow'];
            if ("false" === flowShow) {
                this.flowShow = false;
            }
        }
    }
</script>

<style scoped>
    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 90px;
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