<template>
    <div class="form-content">
        <ice-flow-form name valiate :call-act-transmit-var="callActTransmitVar" :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <ice-dialog :before-close="closeDialog" :title="itemTitle" :visible.sync="dialogVisible"
                            width="800px">
                    <div style="height: 320px">
                        <div style="max-height: 320px;overflow-x: hidden;margin-top: 15px">
                            <el-form :model="mainData" label-width="100px" :rules="mainDataRules" ref="form">
                                <el-row :gutter="60" v-if="leak">
                                    <el-col :span="12">
                                        <el-form-item label="漏洞名称"  prop="leakName">
                                            <el-input v-model="mainData.leakName"
                                                      :showWordLimit="true" maxlength="30" placeholder="漏洞名称"
                                                      :disabled="isLook || flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="影响IP"  prop="leakIp">
                                            <el-input v-model="mainData.leakIp"
                                                      :showWordLimit="true" maxlength="20" placeholder="影响IP"
                                                      :disabled="isLook || flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="责任部门" prop="dutyDeptName">
                                            <el-input :disabled="isLook || flowScope.formReadonly" readonly
                                                      v-model="mainData.dutyDeptName">
                                                <el-button @click="chooseDept" icon="el-icon-search" slot="append"
                                                           :disabled="isLook || flowScope.formReadonly"
                                                           title="选择部门" v-if="!isLook"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="责任单位" prop="dutyOrgName">
                                            <el-input placeholder="责任人带出"
                                                      v-model="mainData.dutyOrgName"
                                                      readonly
                                                      :disabled="isLook || flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12" v-if="dutyUserSelect">
                                        <el-form-item label="责任人" prop="dutyUserName">
                                            <el-input readonly v-model="mainData.dutyUserName">
                                                <el-button @click="choosePeople" icon="el-icon-search" slot="append"
                                                           title="选择责任人"></el-button>
                                            </el-input>
                                            <!--<el-input v-model="mainData.dutyUserName"-->
                                            <!--placeholder="责任人"-->
                                            <!--readonly></el-input>-->
                                            <!--<el-tooltip content="点我选择人员" placement="top" effect="light">-->
                                            <!--<i class="el-icon-upload-success el-icon-circle-check"-->
                                            <!--style="position: absolute;right: 1%;top:10px;"-->
                                            <!--@click="choosePeople"></i>-->
                                            <!--</el-tooltip>-->
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="安全风险" prop="auditRisk" v-if="user">
                                            <ice-select :disabled="isLook || flowScope.formReadonly"
                                                        @change="$nextTick(()=>{$refs.form.validateField('auditRisk',error=>{})})"
                                                        map-type-code="OR_RISK_LEVEL"
                                                        placeholder="安全风险"
                                                        v-model="mainData.auditRisk">
                                            </ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <!--<el-row :gutter="60">-->
                                <!--<el-col :span="24">-->
                                <!--<el-form-item label="责任单位"  prop="dutyOrgName">-->
                                <!--<el-input v-model="mainData.dutyOrgName"-->
                                <!--placeholder="责任人带出"-->
                                <!--readonly-->
                                <!--:disabled="isLook || flowScope.formReadonly"></el-input>-->
                                <!--</el-form-item>-->
                                <!--</el-col>-->
                                <!--</el-row>-->
                                <el-row :gutter="60">
                                    <el-col :span="24">
                                        <el-form-item label="审计问题" prop="auditIssue" v-if="user || privilege">
                                            <el-input placeholder="审计问题"
                                                      v-model="mainData.auditIssue"
                                                      :showWordLimit="true" maxlength="256" rows="3" type="textarea"
                                                      :disabled="isLook || flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="24">
                                        <el-form-item label="整改建议" prop="correctiveSuggest" v-if="user || privilege">
                                            <el-input :disabled="isLook || flowScope.formReadonly"
                                                      placeholder="整改建议"
                                                      :showWordLimit="true" maxlength="256" rows="3"
                                                      type="textarea" v-model="mainData.correctiveSuggest"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60" v-if="!isFirstNode">
                                    <el-col :span="12">
                                        <el-form-item label="是否完成" prop="completeType"
                                                      v-if="correctiveStatus || correctiveStatusView">
                                            <ice-select :disabled="isLook"
                                                        map-type-code="OR_CORR_COMPLETE_TYPE"
                                                        v-model="mainData.completeType"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="完成时间" prop="endTimeExpect"
                                                      v-if="correctiveStatus || correctiveStatusView">
                                            <el-date-picker format="yyyy-MM-dd HH:mm:ss"
                                                            value-format="yyyy-MM-dd HH:mm:ss"
                                                            type="datetime"
                                                            @blur="$nextTick(()=>{$refs.form.validateField('endTimeExpect',error=>{})})"
                                                            :disabled="isLook"
                                                            v-model="mainData.endTimeExpect">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60" v-if="!isFirstNode">
                                    <el-col :span="24">
                                        <el-form-item label="整改附件" prop="correctiveFileId"
                                                      v-if="correctiveStatus || correctiveStatusView">
                                            <ice-single-upload :disabled="isLook" :doSecret="true"
                                                               :on-success="corrDetailFileSuccess"
                                                               style-type="input"
                                                               v-model="mainData.correctiveFileId"></ice-single-upload>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60" v-if="!isFirstNode">
                                    <el-col :span="24">
                                        <el-form-item label="整改情况" prop="correctiveStatus"
                                                      v-if="correctiveStatus || correctiveStatusView">
                                            <el-input v-model="mainData.correctiveStatus"
                                                      type="textarea"
                                                      :showWordLimit="true" maxlength="200"
                                                      :disabled="isLook"
                                                      placeholder="整改情况"
                                                      rows="3"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60" v-if="!isFirstNode">
                                    <el-col :span="24">
                                        <el-form-item label="备注" prop="remark"
                                                      v-if="correctiveStatus || correctiveStatusView">
                                            <el-input type="textarea"
                                                      v-model="mainData.remark"
                                                      :showWordLimit="true" maxlength="200"
                                                      placeholder="备注"
                                                      :disabled="isLook"
                                                      rows="3"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>
                    <div class="ice-button-bar ">
                        <el-button type="primary" @click="save" v-if="!isLook">保存</el-button>
                        <el-button type="info" @click="closeDialog">返回</el-button>
                    </div>
                </ice-dialog>
                <el-form :model="mainDataReport" status-icon  ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" name="申请人">
                        <el-form-item label="整改单号" prop="corrNo">
                            <el-input v-model="mainDataReport.corrNo"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请人" prop="afUserName">
                            <el-input v-model="mainDataReport.afUserName"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="statusDes">
                            <el-input v-model="mainDataReport.afOrgName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="statusDes">
                            <el-input v-model="mainDataReport.afPhone"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="整改详情">
                        <div style="margin-bottom: 2px">
                            <el-button type="primary" @click="add" v-if="!flowScope.formReadonly">新增</el-button>
                            <el-button :disabled="arr.length===0" @click="exportExcel" code="exportBtn" type="primary"
                                       v-if="!isFirstNode">导出
                            </el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;">
                            <el-table ref="tableRef"
                                      @selection-change="handleSelectionChange"
                                      :data="details"
                                      style="width: 100%">
                                <el-table-column type="selection" :width="50">
                                </el-table-column>
                                <el-table-column  label="序号" :width="50">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        v-if="user || privilege"
                                        label="审计问题"
                                        prop="auditIssue">
                                </el-table-column>
                                <ice-table-column
                                        v-if="user"
                                        label="安全风险"
                                        map-type-code="OR_RISK_LEVEL"
                                        prop="auditRisk">
                                </ice-table-column>
                                <el-table-column
                                        v-if="leak"
                                        label="漏洞名称"
                                        prop="leakName">
                                </el-table-column>
                                <el-table-column
                                        v-if="leak"
                                        label="影响IP"
                                        prop="leakIp">
                                </el-table-column>
                                <el-table-column
                                        label="责任人"
                                        prop="dutyUserName">
                                </el-table-column>
                                <el-table-column
                                        label="责任部门"
                                        prop="dutyDeptName">
                                </el-table-column>
                                <el-table-column label="操作" v-if="!flowScope.formReadonly" fixed="right" width="150px">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                                        </el-button>
                                        <el-button type="text"
                                                   size="small" @click="upDataItem(scope.$index)">编辑
                                        </el-button>
                                        <el-button type="text"
                                                   size="small" @click="lookItem(scope.$index)">查看
                                        </el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column label="操作" v-if="flowScope.formReadonly" fixed="right" width="120px">
                                    <template slot-scope="scope">
                                        <el-button type="text" v-if="!editor"
                                                   size="small" @click="lookItem(scope.$index)">查看
                                        </el-button>
                                        <el-button type="text" v-if="!correctiveStatus && editor"
                                                   size="small" @click="upDataItem(scope.$index)">编辑
                                        </el-button>
                                        <el-button @click="upDataItem(scope.$index)" size="small"
                                                   type="text" v-if="dutyUserSelect">选择责任人
                                        </el-button>
                                        <el-button @click="upDataItem(scope.$index)" size="small"
                                                   type="text" v-if="correctiveStatus">填写整改情况
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </ice-form-group>
                    <ice-grid-layout :columns="2" name="报告信息">
                        <el-form-item label="运维报告编号" label-width="100px" prop="reportNo">
                            <el-input disabled v-model="mainDataReport.reportNo">
                                <el-button slot="append" icon="el-icon-view" @click="detailItem" title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="报告分类" label-width="100px" prop="reportType">
                            <ice-datamap-translater :value="mainDataReport.reportType" map-type-code="OR_REPORT_TYPE"
                                                    model="input"></ice-datamap-translater>
                        </el-form-item>
                        <el-form-item label="报告名称" label-width="100px" prop="reportName">
                            <el-input disabled v-model="mainDataReport.reportName"></el-input>
                        </el-form-item>
                        <el-form-item label="报告周期" label-width="100px" prop="reportPeriod">
                            <el-input disabled v-model="mainDataReport.reportPeriod"></el-input>
                        </el-form-item>
                        <el-form-item label="报告编制人" label-width="100px" prop="afUserName">
                            <el-input disabled v-model="mainDataReport.afUserName"></el-input>
                        </el-form-item>
                        <el-form-item label="报告区域" label-width="100px" prop="reportScope">
                            <el-input disabled v-model="mainDataReport.areaName"></el-input>
                        </el-form-item>
                        <el-form-item label="整改下发类型" label-width="100px" prop="issueType">
                            <ice-select :disabled="flowScope.formReadonly" map-type-code="ISSUE_TYPE"
                                        placeholder="整改下发类型" v-model="mainDataReport.issueType">
                            </ice-select>
                        </el-form-item>
                        <el-form-item label="整改附件" label-width="100px" prop="correctiveFileId">
                            <ice-single-upload style-type="input" v-if="!flowScope.formReadonly" :doSecret="true" v-model="mainDataReport.correctiveFileId" :on-success="corrFileSuccess"></ice-single-upload>
                            <el-input disabled v-if="flowScope.formReadonly"
                                      v-model="mainDataReport.correctiveFileName">
                                <el-button slot="append" @click="corrFileDown" icon='el-icon-download'></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="整改完成附件" label-width="100px" prop="correctiveFinalFileId">
                            <ice-single-upload style-type="input" v-if="lastCorrFileUploadable" :doSecret="true" v-model="mainDataReport.correctiveFinalFileId" :on-success="corrFinalFileSuccess"></ice-single-upload>
                            <el-input disabled v-if="!lastCorrFileUploadable"
                                      v-model="mainDataReport.correctiveFinalFileName">
                                <el-button slot="append" @click="corrFinalFileDown" icon='el-icon-download'></el-button>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <ice-persion-selector
                    choose-item="multiple"
                    ref="persionPop"
                    mode="hidden"
                    @select-cannel="selectCannel"
                    :selected-persion="selectedPersion"
                    @select-confirm="selectUserConfirm">
            </ice-persion-selector>
            <ice-dept-selector
                    choose-item="single"
                    ref="deptPop"
                    :allDept="isAllDept"
                    mode="hidden"
                    @select-cannel="selectCannel"
                    :selected-persion="selectedDept"
                    @select-confirm="selectDeptConfirm">
            </ice-dept-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";
    import IceDatamapTranslater from "../../../components/common/base/IceDatamapTranslater";
    import {validateIP} from "@/pages/system/comm/Validator.js"

    export default {
        name: "questionImproveReport",
        components: {
            IceDatamapTranslater,
            IceTableColumn,
            IceSelect,
            IceDeptSelector,
            IcePersionSelector,
            IceDialog,
            IceEditableTable, IceEditableTableColumn, IceFormGroup, IceSingleUpload, IceGridLayout, IceFlowForm
        },
        data(){
            return{
                callActTransmitVar: {type: 'parent'},
                mainData:{
                    callActTransmitVar: {type: 'parent'},
                    leakName:'',
                    leakIp:'',
                    auditIssue:'',
                    auditRisk: '',
                    correctiveSuggest:'',
                    dutyUserName:'',
                    dutyUserCode:'',
                    dutyDeptName:'',
                    dutyDeptCode:'',
                    dutyOrgName:'',
                    dutyOrgCode:'',
                    completeType:'',
                    endTimeExpect:'',
                    correctiveStatus:'',
                    remark:'',
                    correctiveFileId:'',
                },
                dialogVisible:false,
                itemTitle: '新增',
                mainDataRules:{
                    leakName: [{required: true,whitespace: true, message: '请输入漏洞名称', trigger: 'blur'}],
                    leakIp: [{validator: validateIP, trigger: 'blur'}, {
                        required: true,
                        message: '请输入IP地址',
                        trigger: 'blur'
                    }],
                    auditIssue: [{required: true,whitespace: true, message: '请输入审计问题', trigger: 'blur'}],
                    auditRisk: [{required: true, message: '请输入安全风险', trigger: 'change'}],
                    correctiveSuggest: [{required: true,whitespace: true, message: '请输入整改建议', trigger: 'blur'}],
                    dutyUserName: [{required: true,message: '请选择责任人', trigger: 'blur'}],
                    dutyDeptName: [{required: true,message: '请选择责任部门', trigger: 'blur'}],
                    completeType: [{required: true, message: '请选择整改完成情况', trigger: 'change'}],
                    endTimeExpect: [{required: true, message: '请选择完成情况', trigger: 'change'}],
                    // correctiveFileId: [{required: true,message: '请上传整改文件', trigger: 'blur'}],
                    correctiveStatus: [{required: true, whitespace: true, message: '请输入名称整改情况', trigger: 'blur'}],
                },
                details:[],
                mainDataReport:{
                    afUserName:'',
                    afOrgName:'',
                    afPhone:'',
                    corrNo:'',
                    reportNo:'',
                    areaName: '',
                    reportId:'',
                    reportPeriod:'',
                    reportType:'',
                    reportSecretLevel:'',
                    reportName:'',
                    reportScope:'',
                    specialPerson1:'',
                    specialPerson:'',
                    details: [],
                    childBizData: {},
                    correctiveFileId:'',
                    correctiveFileName:'',
                    correctiveFinalFileId:'',
                    correctiveFinalFileName:'',
                    auditRisk: '',
                    issueType: 'ORGANIZATION'
                },                                      /*报告信息对象*/
                OID:'',                                 /*流程OID*/
                indexItem:'',                           /*table下标*/
                selectedPersion:[],
                selectedDept:[],
                isUpData:false,                         /*是否是编辑*/
                isLook:false,                           /*是否为查看*/
                leak:true,                             /*类型--扫漏*/
                user:true,                             /*类型--用户整改*/
                privilege:true,                        /*类型--特权审计*/
                isFirstNode:false,                       /*是否为第一环节*/
                isFlow:false,                            /*是否为流程查看状态*/
                editor:false,                           /*表示是否可编辑*/
                lastCorrFileUploadable:false,           /*表示是否可上传最后一个整改文件*/
                dutyUserSelect:false,                   /*表示是否可选责任人*/
                correctiveStatus: false,                 /*整改情况编写*/
                correctiveStatusView: false,             /*整改情况查看*/
                paramsItem:{
                    columns:[],
                    conditions:[],
                    size:100000,
                    current:1,
                    exportColumns:'',
                    exportTitle:'整改问题导出',
                    conditionLink:'AND'
                },
                arr: [],
            }
        },
        computed:{
            isAllDept() {
                if ('INSTITUTION' === this.mainDataReport.issueType) {
                    return true;
                } else {
                    return false;
                }
                const temp = new Date(this.date.getTime());
                temp.setDate(0);
                return fecha.format(temp, 'yyyy-MM');
            },
        },
        methods:{
            handleSelectionChange(row){
                this.arr = row;
                this.paramsItem = {
                    columns:[],
                    conditions:[],
                    size:100000,
                    current:1,
                    exportColumns:'',
                    exportTitle:'整改问题导出',
                    conditionLink:'AND'
                };
                let obj = {};
                obj = row[0];
                for(let str in obj){
                    this.paramsItem.columns.push(str);
                }
                let oid = '';
                row.forEach(item=>{
                    oid += ','+item.oid;
                });
                oid = oid.substring(1);
                this.paramsItem.conditions.push({
                    column: 'oid',
                    exp: 'in',
                    value: oid
                });
            },
            /**流程初始化所带的数据*/
            flowReady(flowcont, bizdata,flowNodes){
                if(this.isFlow){
                    this.OID = bizdata.oid
                }
                let currentNode=flowNodes[flowcont.nodeId];
                if (currentNode.formRole) {
                    let roleArray = JSON.parse(currentNode.formRole);
                    let editor = roleArray.filter(role => 'editor' === role.code);
                    if (editor.length > 0 && 'true' === editor[0].remark) {
                        this.editor = true;
                    }
                    let lastCorrFileUploadable = roleArray.filter(role => 'lastCorrFileUploadable' === role.code);
                    if (lastCorrFileUploadable.length > 0 && 'true' === lastCorrFileUploadable[0].remark) {
                        this.lastCorrFileUploadable = true;
                    }
                    let dutyUserSelect = roleArray.filter(role => 'dutyUserSelect' === role.code);
                    if (dutyUserSelect.length > 0 && 'true' === dutyUserSelect[0].remark) {
                        this.dutyUserSelect = true;
                    }
                    let correctiveStatus = roleArray.filter(role => 'correctiveStatus' === role.code);
                    if (correctiveStatus.length > 0 && 'true' === correctiveStatus[0].remark) {
                        this.correctiveStatus = true;
                    }
                    let correctiveStatusView = roleArray.filter(role => 'correctiveStatusView' === role.code);
                    if (correctiveStatusView.length > 0 && 'true' === correctiveStatusView[0].remark) {
                        this.correctiveStatusView = true;
                    }
                }
                if(flowcont.nodeId == 'FirstNode'){
                    this.isFirstNode = true
                }else{
                    this.isFirstNode = false;
                }
                if(this.isFlow){
                    this.mainDataReport = bizdata;
                    this.details = bizdata.details;

                    this.$axios.get("/biz/BizArCorrectiveAf/corrType",{"params":{"reportType":this.mainDataReport.reportType}}).then(success=>{
                        if(success.data=='USER'){
                            this.user = true;
                            this.leak = false;
                            this.privilege = false;
                        }else if(success.data=='LEAK'){
                            this.leak = true;
                            this.user = false;
                            this.privilege = false;
                        }else if(success.data=='PRIVILEGE'){
                            this.privilege = true;
                            this.leak = false;
                            this.user = false;
                        }
                        this.$nextTick(_=>{
                            this.$refs.tableRef.doLayout();
                        })
                    })
                }
                this.mainDataReport.afUserName = bizdata.afUserName;
                this.mainDataReport.afOrgName = bizdata.afOrgName;
                this.mainDataReport.afPhone = bizdata.afPhone;
            },
            isTure(arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i].dutyUserName) {
                        return false;
                    }
                }
                return true;
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowcont, bizdata) {
                if ('submit' === flowcont.operateType && this.correctiveStatus) {
                    // 当需要填写整改情况时,校验此字段为必填
                    if (!this.mainData.correctiveStatus) {
                        this.$message.warning("请填写整改情况");
                        return false;
                    }
                }

                let flowKey = flowcont.actDefId.split(":")[0];
                if ('AR_CORR_CHILD' == flowKey && 'node1' == flowcont.nodeId) {
                    let isTrue = this.isTure(this.details);
                    if (!isTrue) {
                        this.$message.warning("请指定负责人");
                        return false;
                    }
                }
                if(this.details.length == 0){
                    this.$message.warning("整改详情不能为空");
                    return false;
                }
                return true;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                this.mainDataReport.details = this.details;
                let userCodes = [];
                let deptCodes = [];
                let afUserCodes = [];
                this.details.forEach(d => {
                    userCodes.push(d.dutyUserCode);
                    deptCodes.push(d.dutyDeptCode);
                    afUserCodes.push(this.mainDataReport.afUserCode);
                });
                this.mainDataReport.specialPerson1 = afUserCodes.join(',');

                this.mainDataReport.specialPerson = userCodes.join(',');
                this.mainDataReport.specialOrganization = deptCodes.join(',');

                let chidData={...this.mainDataReport};
                this.mainDataReport.childBizData = {};
                chidData.childBizData = {};
                if (this.details.length <= 1) {
                    let childData = {...chidData};
                    childData.specialPerson = this.details[0].dutyUserCode;
                    childData.specialOrganization = this.details[0].dutyDeptCode;
                    childData.details = [];
                    childData.details.push(this.details[0]);
                    childData.oid = null;
                    this.mainDataReport.childBizData[this.mainDataReport.afUserCode] = childData;
                } else {
                    this.details.forEach((d, i) => {
                        let childData = {...chidData};
                        childData.specialPerson = d.dutyUserCode;
                        childData.specialOrganization = d.dutyDeptCode;
                        childData.details = [];
                        childData.details.push(d);
                        childData.oid = null;
                        this.mainDataReport.childBizData[this.mainDataReport.afUserCode + '_' + (i + 1)] = childData;
                    });
                }
                return this.mainDataReport;
            },
            /**报告编号旁的跳转--详情按钮*/
            detailItem(){
                window.open("#/biz/auditreport/seasonReport?dataId=" + this.mainDataReport.reportId, "_blank");
            },
            progress(event) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            /**上传成功*/
            success(response, file, fileList) {
                this.percent = 100;
                this.$refs.uploader.reset();
                this.mainData.softName = file.name;
                this.mainData.fileId = response.data;
            },
            /**选人--form表单*/
            choosePeople(){
                if(this.mainData.dutyUserCode){
                    this.selectedPersion = this.mainData.dutyUserCode.split(',');
                }
                this.$nextTick(()=>{
                    this.$refs.persionPop.openDialog();
                })
            },
            /**选人--form表单*/
            chooseDept(){
                if(this.mainData.dutyDeptCode){
                    this.selectedDept = this.mainData.dutyDeptCode.split(',');
                }
                this.$nextTick(()=>{
                    this.$refs.deptPop.openDialog();
                })
            },
            /**选人保存按钮*/
            selectUserConfirm(row){
                this.mainData.dutyUserName = '';
                this.mainData.dutyDeptName = '';
                this.mainData.dutyDeptCode = '';
                this.mainData.dutyUserCode = '';
                row.forEach(item=>{
                    this.mainData.dutyUserName += ','+item.name;
                    this.mainData.dutyUserCode += ','+ item.code;
                    this.mainData.dutyDeptName += ','+ item.deptShortName;
                    this.mainData.dutyDeptCode += ','+ item.deptCode;
                });
                this.mainData.dutyUserName = this.mainData.dutyUserName.substr(1);
                this.mainData.dutyDeptName = this.mainData.dutyDeptName.substr(1);
                this.mainData.dutyDeptCode = this.mainData.dutyDeptCode.substr(1);
                this.mainData.dutyUserCode = this.mainData.dutyUserCode.substr(1);
                this.$nextTick(()=>{
                    this.$refs.form.validateField('dutyUserName',error=>{});
                })
            },
            /**选部门保存按钮*/
            selectDeptConfirm(row){
                if (row.length > 0) {
                    this.mainData.dutyDeptName = row[0].deptName;
                    this.mainData.dutyDeptCode = row[0].deptCode;
                    this.mainData.dutyOrgCode = row[0].orgCode;
                    this.mainData.dutyOrgName = row[0].orgCode;
                }
                this.$nextTick(()=>{
                    this.$refs.form.validateField('dutyDeptName',error=>{});
                })
            },
            selectCannel(){
                this.$refs.persionPop.cleanColumnSelect();
            },
            /**table--列表--新增*/
            add() {
                this.isUpData = false;
                this.isLook = false;
                this.mainData = {
                    leakName:'',
                    leakIp:'',
                    auditIssue:'',
                    auditRisk:'',
                    correctiveSuggest:'',
                    dutyUserName:'',
                    dutyDeptName:'',
                    dutyDeptCode:'',
                    completeType:'',
                    endTimeExpect:'',
                    correctiveStatus:'',
                    remark:'',
                    dutyUserCode:''
                };
                this.itemTitle = '新增';
                this.dialogVisible = true;
            },
            exportExcel() {
                let leak = 'leakName::漏洞名称::,leakIp::影响IP::,';
                let user = 'auditIssue::审计问题::,auditRisk::安全风险::,correctiveSuggest::整改建议::,';
                let privilege = 'auditIssue::审计问题::,correctiveSuggest::整改建议::,';
                let params = 'reportPeriod::整改报告周期::,reportName::整改报告名称::,reportType::整改报告分类::,' +
                    'reportSecretLevel::整改报告密级::,startTime::整改发起时间::,' +
                    'dutyUserName::责任人名称::,dutyDeptName::责任部门名称::,' +
                    'completeType::是否完成::,endTimeExpect::要求完成时间::,' +
                    'correctiveStatus::整改情况::,remark::备注::';
                if(this.user){
                    this.paramsItem.exportColumns = user + params;
                }else if(this.leak){
                    this.paramsItem.exportColumns = leak + params;
                }else if(this.privilege){
                    this.paramsItem.exportColumns = privilege + params;
                }
                let headers = {'Accept': 'application/ice-xls;q=1,*/*;q=0.5'};
                this.$axios.get("/biz/BizArCorrectiveDetail/list", {
                    params: this.paramsItem,
                    headers: headers,
                    responseType: 'blob'
                }).then(success => {
                }).catch(error => {
                    this.$message.error("导出失败");
                });
            },
            save(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        if(this.isUpData){
                            this.details[this.indexItem] = this.mainData;
                            this.dialogVisible = false;
                            this.$refs.form.clearValidate();
                            this.refresh(this.details);
                        }else{
                            this.details.push(this.mainData);
                            this.dialogVisible = false;
                            this.$refs.form.clearValidate();
                        }
                    }
                })
            },
            /**table--列表--编辑*/
            upDataItem(index){
                this.indexItem = index;
                this.isUpData = true;
                this.isLook = false;
                this.mainData = {
                    leakName:'',
                    leakIp:'',
                    auditIssue:'',
                    auditRisk:'',
                    correctiveSuggest:'',
                    dutyUserName:'',
                    dutyDeptName:'',
                    dutyDeptCode:'',
                    completeType:'',
                    endTimeExpect:'',
                    correctiveStatus:'',
                    remark:'',
                    dutyUserCode:''
                };
                Object.assign(this.mainData,this.details[index]);
                this.itemTitle = '编辑';
                this.dialogVisible = true;
            },
            /**table--列表--查看*/
            lookItem(index){
                this.indexItem = index;
                this.isLook = true;
                this.isUpData = true;
                this.mainData = {
                    leakName:'',
                    leakIp:'',
                    auditIssue:'',
                    auditRisk:'',
                    correctiveSuggest:'',
                    dutyUserName:'',
                    dutyDeptName:'',
                    dutyDeptCode:'',
                    completeType:'',
                    endTimeExpect:'',
                    correctiveStatus:'',
                    remark:'',
                    dutyUserCode:''
                };
                Object.assign(this.mainData,this.details[index]);
                this.itemTitle = '查看';
                this.dialogVisible = true;
            },
            /**关闭--table--新增，编辑--弹窗*/
            closeDialog(){
                this.dialogVisible = false;
                this.$refs.form.clearValidate();
            },
            /**table--列表--删除*/
            deleteDetailItem(index) {
                this.details.splice(index, 1);
            },
            refresh(arr){
                this.details = [];
                let obj = [];
                Object.assign(obj,arr);
                this.details = obj;
            },
            corrDetailFileSuccess(response, file, fileList) {
                this.mainData.correctiveFileId = response.data;
                this.mainData.correctiveFileName = file.name;
            },
            corrFileSuccess(response, file, fileList) {
                this.mainDataReport.correctiveFileId = response.data;
                this.mainDataReport.correctiveFileName = file.name;
            },
            corrFinalFileSuccess(response, file, fileList) {
                this.mainDataReport.correctiveFinalFileId = response.data;
                this.mainDataReport.correctiveFinalFileName = file.name;
            },
            corrFileDown(){
                this.$downloadFile(this.mainDataReport.correctiveFileId);
            },
            corrFinalFileDown(){
                this.$downloadFile(this.mainDataReport.correctiveFinalFileId);
            },
        },
        mounted() {
            if(this.$route.query['dataId']){
                this.isFlow = true;
            }else{
                this.isFlow = false;
                let id = this.$route.query['id'];
                this.$axios.get("/biz/BizArReportForm/get",{"params":{"id":id}}).then(success=>{
                    this.OID = success.data.oid;
                    this.mainDataReport.reportId = success.data.oid;
                    this.mainDataReport.reportPeriod = success.data.reportPeriod;
                    this.mainDataReport.reportType =  success.data.reportType;
                    this.mainDataReport.reportName =  success.data.reportName;
                    this.mainDataReport.reportNo =  success.data.reportNo;
                    this.mainDataReport.areaName = success.data.areaName;
                    this.mainDataReport.reportSecretLevel =  success.data.reportSecretLevel;
                    this.mainDataReport.reportSecretLevel =  success.data.reportSecretLevel;
                    this.mainDataReport.reportScope =  success.data.reportScope;
                    success.data.details = [];
                    this.$axios.get("/biz/BizArCorrectiveAf/corrType",{"params":{"reportType":success.data.reportType}}).then(success=>{
                        if(success.data=='USER'){
                            this.user = true;
                            this.leak = false;
                            this.privilege = false;
                        }else if(success.data=='LEAK'){
                            this.leak = true;
                            this.user = false;
                            this.privilege = false;
                        }else if(success.data=='PRIVILEGE'){
                            this.privilege = true;
                            this.leak = false;
                            this.user = false;
                        }
                    })
                }).catch(error=>{
                    this.$message({
                        type:'error',
                        message:error.msg
                    })
                })
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
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }
</style>
