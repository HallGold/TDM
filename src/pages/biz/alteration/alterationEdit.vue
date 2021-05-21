<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData" :btn-extend1="alterationAssign">
            <div slot-scope="flowScope">
                <el-form :model="alterationData" status-icon :rules="rules" ref="alteration"
                         label-width="110px">
                    <ice-grid-layout :columns="3" name="变更基本信息">
                        <el-form-item label="服务申请用户" prop="typeDescPe">
                            <el-input v-model="alterationData.proposerName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务申请单位" prop="statusDes">
                            <el-input v-model="alterationData.builderUnit" :readonly="true"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="statusDes">
                            <el-input v-model="alterationData.phone" :disabled="formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="gmtApply">
                            <el-date-picker v-model="alterationData.gmtApply" type="datetime"
                                            :disabled="formReadonly"
                                            format="yyyy-MM-dd HH:mm"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="变更发起人" prop="statusDes">
                            <el-input v-model="alterationData.builderName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发起人单位" prop="statusDes">
                            <el-input v-model="alterationData.builderUnit"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="变更类型" prop="alterationType">
                            <el-select placeholder="请选择" clearable v-model="alterationData.alterationType"
                                       　:disabled="formReadonly" @change="onTypeChanged">
                                <el-option
                                        v-for="item in ENUM.ALTERATION_TYPE.properties"
                                        :key="item.oid"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="变更来源" prop="alterationSource">
                            <ice-select placeholder="变更来源" map-type-code="SOURCE"
                                        v-model="alterationData.alterationSource"
                                        :disabled="formReadonly"></ice-select>
                        </el-form-item>
                        <el-form-item label="区域" prop="area">
                            <el-select placeholder="请选择" v-model="alterationData.area" clearable
                                       　:disabled="formReadonly" @change="onAreaChanged">
                                <el-option
                                        v-for="(item,index) in ENUM.AREA"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                            <el-input v-model="alterationData.netArea" style="display: none"></el-input>
                            <el-input v-model="alterationData.netType" style="display: none"></el-input>
                        </el-form-item>

                        <el-form-item label="紧急程度" prop="emerDegr"
                                      v-if="alterationData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-select placeholder="请选择" v-model="alterationData.emerdegr"
                                       　:disabled="formReadonly" clearable>
                                <el-option
                                        v-for="(item,index) in ENUM.EMERGENT_DEGREE.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否策略变更" prop="isStrategy"
                                      v-if="alterationData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-select placeholder="请选择" v-model="alterationData.isStrategy"
                                       　:disabled="formReadonly" clearable>
                                <el-option
                                        v-for="(item,index) in ENUM.YES_NO.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预计完成时间" prop="gmtEsticomp"
                                      v-if="alterationData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-date-picker v-model="alterationData.gmtEsticomp" type="datetime"
                                            :disabled="formReadonly"
                                            format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="关联单据信息">
                        <ice-query-grid title=""
                                        :gridData="alterationData.alterationOtherModelVoList"
                                        :query="query"
                                        :columns="columns.contactColumns"
                                        ref="contactQueryGrid"
                                        :operations="operations"
                                        :operationsWidth=100
                                        :minHeight="200"
                                        :pagination="false"
                                        :buttons="buttons.contactButtons">
                        </ice-query-grid>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="业务服务目录信息">
                        <ice-query-grid title=""
                                        :gridData="alterationData.alterationBizCatalogList"
                                        :query="query"
                                        :columns="columns.bizColumns"
                                        ref="bizQueryGrid"
                                        chooseItem="multiple"
                                        :operations="[]"
                                        :operationsWidth=0
                                        :minHeight="250"
                                        :pagination="false"
                                        @selection-change="bizHandleSelectionChange"
                                        :buttons="buttons.bizButtons">
                        </ice-query-grid>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="技术服务目录信息">
                        <ice-query-grid title=""
                                        :gridData="alterationData.alterationTichCatalogList"
                                        :query="query"
                                        chooseItem="multiple"
                                        :columns="columns.techColumns"
                                        ref="tichQueryGrid"
                                        :operations="[]"
                                        layout="3"
                                        :operationsWidth=80
                                        @selection-change="techHandleSelectionChange"
                                        :minHeight="250"
                                        :pagination="false"
                                        :buttons="buttons.techButtons">
                        </ice-query-grid>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="描述信息">
                        <el-form-item label="变更描述" label-width="100px" prop="applyCont" layout="3">
                            <el-input type="textarea"
                                      :rows="4" :disabled="formReadonly"
                                      placeholder="请输入变更描述"
                                      v-model="alterationData.applyCont">>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="特殊情况说明" label-width="100px" layout="3">
                            <el-input type="textarea"
                                      :rows="4" :disabled="formReadonly"
                                      placeholder="请输入特殊情况说明"
                                      v-model="alterationData.remark">>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="变更方案"
                                     v-show="alterationData.apprStatus == ENUM.APPR_STATUS.PLAN_EDIT || alterationData.alterationPlanList.length > 0">
                        <el-form-item label="方案描述" label-width="100px" prop="planCont" layout="3"
                                      v-if="alterationData.apprStatus == ENUM.APPR_STATUS.PLAN_EDIT">
                            <el-input type="textarea" :rows="4" placeholder="请输入方案描述"
                                      v-model="alterationData.planCont"></el-input>
                            <el-input v-model="alterationData.planContOid" style="display: none"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3"
                             v-show="alterationData.alterationPlanList && alterationData.alterationPlanList.length > 0 && alterationData.apprStatus != ENUM.APPR_STATUS.PLAN_EDIT">
                            <div class="text">变更方案</div>
                            <ice-query-grid
                                    title=""
                                    :gridData="alterationData.alterationPlanList"
                                    :query="query"
                                    :columns="columns.planColumns"
                                    ref="planQueryGrid"
                                    :operations="[]"
                                    :operationsWidth=0
                                    :minHeight="150"
                                    :pagination="false"
                                    :buttons="buttons.planButtons">
                            </ice-query-grid>
                        </div>
                    </ice-grid-layout>
                    <!--                    <div v-show="alterationData.alterationType != ENUM.ALTERATION_TYPE.BZBG">-->
                    <ice-grid-layout :columns="3" name="风险评估"
                                     v-if="alterationData.apprStatus == ENUM.APPR_STATUS.RISK_EVALUATE || alterationData.alterationRiskEvaluateList.length > 0">
                        <el-form-item label="风险评估" label-width="100px" prop="asseOpin" layout="3"
                                      v-if="alterationData.apprStatus == ENUM.APPR_STATUS.RISK_EVALUATE">
                            <el-input type="textarea"
                                      :rows="4"
                                      placeholder="请输入风险评估"
                                      v-model="alterationData.asseOpin">>
                            </el-input>
                            <el-input v-model="alterationData.asseOpinOid" style="display: none"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3"
                             v-show="alterationData.alterationRiskEvaluateList && alterationData.alterationRiskEvaluateList.length > 0 && alterationData.apprStatus != ENUM.APPR_STATUS.RISK_EVALUATE">
                            <div class="text">风险评估</div>
                            <ice-query-grid title=""
                                            :gridData="alterationData.alterationRiskEvaluateList"
                                            :query="query"
                                            :columns="columns.riskColumns"
                                            ref="planQueryGrid"
                                            :operations="[]"
                                            :operationsWidth=0
                                            :minHeight="150"
                                            :pagination="false"
                                            :buttons="buttons.riskButtons">
                            </ice-query-grid>
                        </div>
                    </ice-grid-layout>
                    <!--                    </div>-->
                    <ice-grid-layout :columns="3" name="实施人员信息"
                                     v-show="alterationData.alterationExecuteVos && alterationData.alterationExecuteVos.length > 0">
                        <div class="divContent" layout="3">
                            <div class="text">实施<br>人员信息</div>
                            <ice-query-grid title=""
                                            :gridData="alterationData.alterationExecuteVos"
                                            :query="query"
                                            :columns="columns.executeUserColumns"
                                            ref="executeQueryGrid"
                                            :operations="[]"
                                            :operationsWidth=0
                                            :minHeight="200"
                                            :pagination="false"
                                            chooseItem="multiple"
                                            @selection-change="executeHandleSelectionChange"
                                            :buttons="buttons.riskButtons">
                            </ice-query-grid>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="实施执行信息"
                                     v-show="alterationData.alterationExecuteList.length > 0">
                        <div class="divContent" layout="3">
                            <div class="text">实施执行信息</div>
                            <ice-query-grid title=""
                                            :gridData="alterationData.alterationExecuteList"
                                            :query="query"
                                            :columns="columns.executeColumns"
                                            ref="executeQueryGrid"
                                            :operations="[]"
                                            :operationsWidth=0
                                            :minHeight="200"
                                            :pagination="false"
                                            :buttons="buttons.riskButtons">
                            </ice-query-grid>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="附件信息">
                        <el-form-item label="相关附件" layout="3">
                            <biz-upload-attachment :readonly="formReadonly"
                                                   :obj-id="alterationData.oid"
                                                   :remove-call-back="removeFileCallBack"
                                                   :childType="EDIT_ENUMS.FILE"
                                                   :change-success-handler="changeSuccessHandler"
                                                   :file-info="alterationData.reFileVoList"></biz-upload-attachment>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <template v-if="dialog.assign">
            <el-dialog title="变更排程" :visible.sync="dialog.assign" width="800px">
                <alteration-assign :alteration-num="alterationData.alterationNum"
                                   :close-handler="closeAssign"></alteration-assign>
            </el-dialog>
        </template>
        <pro-sc-common-template :ref="EDIT_ENUMS.REFS.BIZ_SELECT.REF" v-if="EDIT_ENUMS.REFS.BIZ_SELECT.SHOW"
                                :region-id="areaId" @grid-check="regionNodeClick"
                                chooseItem="multiple"></pro-sc-common-template>
        <pro-sc-tech-tree :regionId="areaId" :ref="EDIT_ENUMS.REFS.TECH_SELECT.REF" :is-callback="true"
                          @getData="getTechData"
                          v-if="EDIT_ENUMS.REFS.TECH_SELECT.SHOW"></pro-sc-tech-tree>
        <ice-dialog v-dialogDrag title="关联单据信息" custom-class="ice-dialog" center
                    :visible.sync="EDIT_ENUMS.REFS.RELE_SELECT.SHOW" remounted
                    width="1200px" append-to-body :close-on-click-modal="false">
            <relevance @selection-change="selectRele"></relevance>
            <div style="float: right;padding-top: 16px;margin-bottom: 16px;padding-right: 16px">
                <el-button type="primary" @click="confirmWith">确定
                </el-button>
                <el-button type="info" @click="close">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "@/components/common/base/IcePopSelector";
    import IceTreeGrid from "@/components/common/base/IceTreeGrid";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceImageUploader from "@/components/common/base/IceImageUpload";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import IceMultipleUpload from "@/components/common/base/IceMultipleUpload.vue"
    import IceSelect from "@/components/common/base/IceSelect"
    import renderer from './js/renderer'
    import comm from "./js/comm";
    import validate from "./js/validation";
    import other from "./js/alterationEdit/otherModel";
    import biz from "./js/alterationEdit/biz";
    import tec from "./js/alterationEdit/tec";
    import AlterationAssign from "./alterationAssign";
    import BizUploadAttachment from "@/pages/biz/components/BizUploadAttachment"
    import ProScCommonTemplate from "../../pro/sc/common/ProScCommonTemplate";
    import ProScTechTree from "../../pro/sc/ProScTechTree";
    import Relevance from "../event/base/relevance";
    import IceDialog from "../../../components/common/base/IceDialog";
    import bus from "../event/base/bus.js"

    export default {
        name: "alterationEdit",
        mixins: [comm, validate, other, biz, tec, renderer],
        components: {
            IceDialog,
            Relevance,
            ProScTechTree,
            ProScCommonTemplate,
            BizUploadAttachment,
            AlterationAssign,
            IceImageUploader,
            IceTreeGrid,
            IcePopSelector,
            IceFlowForm,
            IceGridLayout,
            IceQueryGrid,
            IceMultipleUpload,
            IceSelect,
            IcePersionSelector,
            IceEditableTable,
            IceEditableTableColumn,
            bus
        },
        props: {
            alterationData: {
                type: Object,
                default() {
                    return {
                        prosperityData: [],
                        alterationNum: "",//变更单号
                        apprStatus: "",//状态
                        oid: "",//oid
                        netArea: "",//网络区域
                        netType: "",//网络type
                        proposerName: "",//申请人
                        applyUnit: "",//申请单位
                        builderName: "",//发起人
                        builderUnit: "",//发起人单位
                        area: "",//区域
                        phone: "",//申请人联系电话
                        gmtApply: "",//申请时间
                        alterationType: "",//变更类型
                        alterationSource: "",//变更来源
                        emerdegr: "",//紧急程度
                        isStrategy: "",//是否策略变更
                        gmtEsticomp: "",//预计完成时间
                        alterationOtherModelVoList: [],//关联
                        alterationBizCatalogList: [],//业务服务
                        alterationTichCatalogList: [],//技术服务
                        alterationPlanList: [],//变更方案list
                        alterationRiskEvaluateList: [],//风险评估list
                        alterationExecuteVos: [],//实施人员列表
                        alterationExecuteList: [],//实施执行list
                        applyCont: "",//变更描述
                        remark:"",//特殊情况说明
                        asseOpin: "",//风险评估
                        asseOpinOid: "",//风险评估oid
                        planCont: "",//方案描述
                        planContOid: "",//方案描述oid
                        childBizData: {},//子流程的map对象
                        revertAlterationExecuteList: [],//回退子流程的list
                        doAgainSpecialPerson: "",//再实施指定人员
                        specialPerson: "",//自定义参与人code
                        reFileVoList: []
                    }
                }
            }
        },
        data() {
            return {
                EDIT_ENUMS: {
                    FILE: "fjxx",
                    REFS: {
                        BIZ_SELECT: {REF: "bizSelect", SHOW: false},
                        TECH_SELECT: {REF: "techSelect", SHOW: false},
                        RELE_SELECT: {REF: "releSelect", SHOW: false}
                    }
                },
                flowParam: {
                    isRootInEvent: 1//是否事件转变更[0---确认关闭 1---结束]
                },
                isAssemblePlanList: false,
                isAssembleRiskList: false,
                percent: 0,
                dialog: {
                    assign: false,  //排程弹出框
                },
                //表单只读
                formReadonly: false,
                //变更主表data
                /*      alterationData: {
                          alterationNum: "",//变更单号
                          apprStatus: "",//状态
                          oid: "",//oid
                          netArea: "",//网络区域
                          netType: "",//网络type
                          proposerName: "",//申请人
                          applyUnit: "",//申请单位
                          builderName: "",//发起人
                          builderUnit: "",//发起人单位
                          area: "",//区域
                          phone: "",//申请人联系电话
                          gmtApply: "",//申请时间
                          alterationType: "",//变更类型
                          alterationSource: "",//变更来源
                          emerdegr: "",//紧急程度
                          isStrategy: "",//是否策略变更
                          gmtEsticomp: "",//预计完成时间
                          alterationOtherModelVoList: [],//关联
                          alterationBizCatalogList: [],//业务服务
                          alterationTichCatalogList: [],//技术服务
                          alterationPlanList: [],//变更方案list
                          alterationRiskEvaluateList: [],//风险评估list
                          alterationExecuteVos: [],//实施人员列表
                          alterationExecuteList: [],//实施执行list
                          applyCont: "",//变更描述
                          asseOpin: "",//风险评估
                          asseOpinOid: "",//风险评估oid
                          planCont: "",//方案描述
                          planContOid: "",//方案描述oid
                          childBizData: {},//子流程的map对象
                          revertAlterationExecuteList: [],//回退子流程的list
                          doAgainSpecialPerson: "",//再实施指定人员
                          specialPerson: "",//自定义参与人code
                          reFileVoList: []
                      },*/
                percent: 0,
                operations: [
                    {name: '删除', callback: this.deleteContact}
                ],
                areaId: "",
                selector: '',
                creatorDept: "",
                query: [],
                query3: [],
                gridData: {
                    contactData: [],
                    bizGridData: [],
                    techData: []
                },
                columns: {
                    contactColumns: [
                        {code: 'oid', hidden: true},
                        {label: '模块主键', code: 'otherModelId', hidden: true},
                        {label: '模块实体', code: 'otherModelModel', hidden: true},
                        {label: '工单号', code: 'workTicket', hidden: true},
                        {label: '关联URL', code: 'url', hidden: true},
                        // {label: '关联单号', code: 'alterationNum', width: 250},
                        {
                            label: '单据类型', code: 'otherModelName', width: 250, renderCell: (h, data) => {
                                /*return <div style="color: blue;text-decoration: underline; cursor: pointer;"
                                            v-on:click="click">{data.row.otherModelName}</div>*/
                                return <el-button type="text" {...{
                                    "on": {
                                        "click": () => {
                                            this.clcik(data.row);
                                        }
                                    }
                                }}>{data.row.otherModelName}</el-button>
                                // return <a href='10.99.12.70'>{data.row.otherModelName}</a>
                            }
                        }
                    ],
                    bizColumns: [],
                    techColumns: [],
                    planColumns: [
                        {code: 'oid', hidden: true},
                        {label: '变更单号', code: 'alteratioNum', hidden: true},
                        {label: '方案内容', code: 'planCont', width: 500},
                        {label: '编制人姓名', code: 'creatorName', width: 200},
                        {label: '编制日期', code: 'gmtCreate', width: 260},
                        {label: '编制人CODE', code: 'orgCode', hidden: true},
                        {label: '创建组织机构code', code: 'orgCode', hidden: true},
                        {label: '创建时间', code: 'gmtCreate', hidden: true}
                    ],
                    riskColumns: [
                        {code: 'oid', hidden: true},
                        {label: '变更单号', code: 'alteratioNum', hidden: true},
                        {label: '评估意见', code: 'asseOpin', width: 500},
                        {label: '评估人姓名', code: 'creatorName', width: 200},
                        {label: '评估日期', code: 'gmtCreate', width: 260},
                        {label: '评估人CODE', code: 'creatorCode', hidden: true},
                        {label: '创建人', code: 'creatorName', hidden: true},
                        {label: '创建code', code: 'creatorCode', hidden: true},
                        {label: '创建组织机构code', code: 'orgCode', hidden: true},
                        {label: '创建时间', code: 'gmtCreate', hidden: true}
                    ],
                    executeUserColumns: [
                        {code: 'oid', hidden: true},
                        {label: '姓名', code: 'executorName', width: 250},
                        {label: '单位', code: 'executorUnit', width: 200},
                        {
                            label: '实施状态', code: 'execuStatus', width: 160, formatter: (row) => {
                                return this.onExecuteStateRenderer(row);
                            }
                        },
                        {label: '工作事项', code: 'alterationItems', width: 320},
                        {label: '执行人code', code: 'executorCode', hidden: true}
                    ],
                    executeColumns: []
                },
                buttons: {
                    contactButtons: [],
                    bizButtons: [],
                    techButtons: [],
                    planButtons: [],
                    riskButtons: []
                },
                tableSelect: {
                    executeUser: [],//实施人员表格选择的列
                    biz: [],//业务服务表格选择的列
                    tec: []//技术服务表格选择的列
                },
                fileIds: "",
                releSelect: []
            }
        },
        methods: {
            /**
             * 附件上传成功后回调
             * @param dataArr
             * @param childType
             */
            changeSuccessHandler(dataArr, childType) {
                this.alterationData.reFileVoList = dataArr;
            },
            /**
             * 附件删除后回调
             * @param fileId
             * @return Promise
             */
            removeFileCallBack({fileId}) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(_this.COMM_ENUMS.ACTION.REMOVE_FILE, {fileId: fileId}, [res => {
                        if (res.data) {
                            _this.$message.success("文件已删除!");
                        } else {
                            _this.$message.error("文件删除失败!");
                        }
                        resolve();
                    }, res => {
                        _this.$message.error("文件删除失败!");
                        resolve();
                    }]);
                });
            },
            /**
             * 联网类型变化时发生
             */
            onAreaChanged(e) {
                let split = e.split(this.netSeparator);
                this.alterationData.netArea = split[0];
                this.alterationData.netType = split[1];
                this.setAreaId(e);
                this.alterationData.alterationBizCatalogList = [];
                this.alterationData.alterationTichCatalogList = [];
            },
            /**
             * 设置区域oid
             *@param areaCode
             */
            setAreaId(areaCode) {
                for (let i = 0; i < this.ENUM.AREA.length; i++) {
                    let _area = this.ENUM.AREA[i];
                    if (_area.code == areaCode) {
                        this.areaId = _area.oid;
                    }
                }
            },
            /**
             * 根据areaid获取areacode
             * @param areaId
             */
            getAreaByAreaId(areaId) {
                for (let i = 0; i < this.ENUM.AREA.length; i++) {
                    let _area = this.ENUM.AREA[i];
                    if (_area.oid == areaId) {
                        let areaCode = _area.code.split(this.ENUM.NET_SEPARATOR());
                        this.alterationData.netType = areaCode[1];
                        this.alterationData.netArea = areaCode[0];
                        this.alterationData.area = _area.code;
                        break;
                    }
                }
            },
            /**
             * 变更类型变化时发生
             */
            onTypeChanged(e) {
                if (e > this.ENUM.ALTERATION_TYPE.BZBG) {//非标准变更
                    this.initRules();
                }
            },
            /**
             * 初始化页面校验规则
             */
            initRules() {
                Object.assign(this.rules, this.otherRules);
            },
            /**
             * 设置自定义参与人
             */
            setSpecialPerson() {
                if (this.alterationData.alterationExecuteVos.length != 0) {
                    this.alterationData.specialPerson = this.convertToString("executorCode", this.alterationData.alterationExecuteVos, ",");
                }
                if (this.tableSelect.executeUser.length != 0) {
                    this.alterationData.doAgainSpecialPerson = this.convertToString("executorCode", this.tableSelect.executeUser, ",");
                }
            },
            /**
             * 设置变更方案list
             */
            setPlanList() {
                if (!this.isAssemblePlanList) {
                    if (this.alterationData.planCont != "") {
                        if (this.alterationData.alterationPlanList.length > 0) {
                            for (let i = 0; i < this.alterationData.alterationPlanList.length; i++) {
                                let plan = this.alterationData.alterationPlanList[i];
                                if (plan.oid == this.alterationData.planContOid) {
                                    plan.planCont = this.alterationData.planCont;
                                    return;
                                }
                            }
                            this.alterationData.alterationPlanList.push({planCont: this.alterationData.planCont});
                        } else {
                            this.alterationData.alterationPlanList.push({planCont: this.alterationData.planCont});
                        }
                    }
                    this.isAssemblePlanList = true;
                }
            },
            /**
             * 设置风险评估list
             */
            setRiskList() {
                if (!this.isAssembleRiskList) {
                    if (this.alterationData.asseOpin != "") {
                        if (this.alterationData.alterationRiskEvaluateList.length > 0) {
                            for (let i = 0; i < this.alterationData.alterationRiskEvaluateList.length; i++) {
                                let risk = this.alterationData.alterationRiskEvaluateList[i];
                                if (risk.oid == this.alterationData.asseOpinOid) {
                                    risk.asseOpin = this.alterationData.asseOpin;
                                    return;
                                }
                            }
                            this.alterationData.alterationRiskEvaluateList.push({asseOpin: this.alterationData.asseOpin});
                        } else {
                            this.alterationData.alterationRiskEvaluateList.push({asseOpin: this.alterationData.asseOpin});
                        }
                    }
                    this.isAssembleRiskList = true;
                }
            },
            /**
             * 初始化变更方案数据
             */
            initPlanCont() {
                if (this.alterationData.alterationPlanList.length > 0) {
                    for (let i = 0; i < this.alterationData.alterationPlanList.length; i++) {
                        let _plan = this.alterationData.alterationPlanList[i];
                        if (_plan.creatorCode == this.$userInfo.code) {
                            this.alterationData.planCont = _plan.planCont;
                            this.alterationData.planContOid = _plan.oid;
                            break;
                        }
                    }
                }
            },
            /**
             * 初始化风险评估数据
             */
            initRiskCont() {
                if (this.alterationData.alterationRiskEvaluateList.length > 0) {
                    for (let i = 0; i < this.alterationData.alterationRiskEvaluateList.length; i++) {
                        let risk = this.alterationData.alterationRiskEvaluateList[i];
                        if (risk.creatorCode == this.$userInfo.code) {
                            this.alterationData.asseOpin = risk.asseOpin;
                            this.alterationData.asseOpinOid = risk.oid;
                            break;
                        }
                    }
                }
            },
            /**
             * 设置子流程的数据
             */
            setChildBus() {
                if (this.alterationData.alterationExecuteVos.length > 0) {
                    for (let i = 0; i < this.alterationData.alterationExecuteVos.length; i++) {
                        let executeVo = this.alterationData.alterationExecuteVos[i];
                        this.alterationData.childBizData[executeVo.executorCode] = executeVo;
                    }
                }
            },
            /**
             * 提交封装data数据
             */
            flowBizData() {
                this.setSpecialPerson();
                this.setChildBus();
                if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.PLAN_EDIT) {
                    this.setPlanList();
                }
                if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.RISK_EVALUATE) {
                    this.setRiskList();
                }
                if (this.tableSelect.executeUser.length > 0) {
                    this.alterationData.revertAlterationExecuteList = this.tableSelect.executeUser;
                }
                console.log(JSON.stringify(this.alterationData));
                return this.alterationData;
            },
            /**
             * 初始化页面校验
             */
            initValidation() {
                //当前环节为方案编制时，设置方案编制为必填
                if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.PLAN_EDIT) {
                    this.rules.planCont.required = true;
                } else if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.RISK_EVALUATE) {
                    //当前环节为风险评估时，设置方案编制为必填
                    this.rules.asseOpin.required = true;
                }
            },
            /**
             * 初始化页面数据
             */
            flowReady(flowcont, bizdata) {
                if (bizdata.oid) {//编辑或查看详情或审批中
                    this.loadData(bizdata);
                    this.initValidation();
                    this.hiddenBizButton(bizdata.apprStatus);
                    this.hiddenTecButton(bizdata.apprStatus);
                    this.hiddenOtherButton(bizdata.apprStatus);
                    this.initStyle();
                    this.setEnabled(bizdata.apprStatus);
                    this.getExecuteUser();
                }
                /*if (this.alterationData.oid) {
                    this.alterationData.area = this.getAreaByNetAreaAndNetType(this.alterationData.netArea, this.alterationData.netType);
                    this.hiddenBizButton(this.alterationData.apprStatus);
                    this.hiddenTecButton(this.alterationData.apprStatus);
                    this.hiddenOtherButton(this.alterationData.apprStatus);
                    this.setEnabled(this.alterationData.apprStatus);
                    this.getExecuteUser();
                }*/ else {
                    this.alterationData.gmtApply = bizdata.afDate;
                    this.alterationData.proposerName = bizdata.afUserName;
                    this.alterationData.applyUnit = bizdata.afOrgName;
                    this.alterationData.phone = bizdata.afPhone;
                    this.alterationData.builderName = bizdata.afUserName;
                    this.alterationData.builderUnit = bizdata.afOrgName;
                }
            },
            /**
             * 流程按钮
             */
            flowOperateBtn(flowContext, bizdata) {
                let _this = this;
                if (flowContext.nodeId == this.ENUM.ALTERATION_NODE_ID.DO_AGAIN) {
                    if (this.tableSelect.executeUser.length == 0) {
                        this.$alert('请在【实施人员信息】列表中选择需要重新实施的工程师', '提示', {
                            confirmButtonText: '确定'
                        });
                        return;
                    }
                } else if (flowContext.nodeId == this.ENUM.ALTERATION_NODE_ID.ASSIGN && flowContext.operateType == this.ENUM.OPERATE_TYPE.SUBMIT) {
                    if (!this.alterationData.alterationExecuteVos || this.alterationData.alterationExecuteVos.length == 0) {
                        this.assignValidation();
                        return;
                    }
                }
                flowContext.processVar = {
                    alterationType: this.alterationData.alterationType,
                    isStrategy: this.alterationData.isStrategy,
                    isRootInEvent: this.flowParam.isRootInEvent
                };
                let _p = this.$refs['alteration'].validate();
                _p.catchHandler = function (res) {
                    _this.$refs['alteration'].validate((flag, object) => {
                    });
                };
                localStorage.removeItem(_this.$route.query.actionData);
                return _p;
                // return true;
            },
            /**
             * 变更排程节点页面的校验
             */
            assignValidation() {
                this.$alert('请先进行变更排程', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.dialog.assign = true;
                    }
                });
            },
            /**
             * 变更排程
             */
            alterationAssign() {
                this.dialog.assign = true;
            },
            /**
             * 关闭排程弹出框
             */
            closeAssign() {
                this.dialog.assign = false;
                this.getExecuteUser();
            },
            /**
             * 实施人员表格选择行
             */
            executeHandleSelectionChange(row) {
                this.tableSelect.executeUser = row;
            },
            /**
             * 获取实施人员列表
             */
            getExecuteUser() {
                let that = this;
                this.axios(this.ENUM.ACTIONS.GET_ALTERATION_EXECUTE_LIST, {alterationNum: that.alterationData.alterationNum}, [res => {
                    that.alterationData.alterationExecuteVos = res.data;
                    that.$refs.executeQueryGrid.refresh();
                }]);
            },
            /**
             * 根据变更单号获取所有实施list
             */
            getAllExecByAlterationNum() {
                let that = this;
                this.axios(this.ENUM.ACTIONS.GET_ALL_EXEC_BY_ALTERATION_NUM, {alterationNum: that.alterationData.alterationNum}, [res => {
                    that.alterationData.alterationExecuteList = res.data;
                }]);
            },
            /**
             * 加载页面数据
             */
            loadData(bizdata) {
                Object.assign(this.alterationData, bizdata);
                this.getAllExecByAlterationNum();
                if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.PLAN_EDIT) {
                    this.initPlanCont();
                }
                if (this.alterationData.apprStatus == this.ENUM.APPR_STATUS.RISK_EVALUATE) {
                    this.initRiskCont();
                }
            },
            /**
             * 设置表单不可编辑
             */
            setEnabled(value) {
                if (value != this.ENUM.APPR_STATUS.DRAFT && value != null) {
                    this.formReadonly = true;
                    return;
                }
                if (this.$route.query.actionType == this.ENUM.ACTIONTYPE.VIEW) {
                    this.formReadonly = true;
                }
            },
            //初始化页面数据
            initData() {
                if (this.$route.query.actionType != this.ENUM.ACTIONTYPE.ADD) {
                    let that = this;
                    this.axios(this.ENUM.ACTIONS.VIEW_ALTERATION, {oid: this.$route.query.dataId}, [res => {
                        Object.assign(that.alterationData, res.data);
                    }]);
                }
            },
            /**
             * 初始化页面样式
             */
            initStyle() {
                let actionType = this.$route.query.actionType;
                if (actionType == this.ENUM.ACTIONTYPE.VIEW) {
                    this.operations = [];
                    this.initButton();
                }
            },
            /**
             * 初始化页面按钮
             */
            initButton() {
                this.$refs[`flowForm`].hiddenBtn("save,submit,reject,jump,extend1");
            },
            initControls() {
                this.alterationData.area = this.getAreaByNetAreaAndNetType(this.alterationData.netArea, this.alterationData.netType);
                this.setAreaId(this.alterationData.netArea + this.alterationData.netType);
                let that = this;
                this.columns.executeColumns = [
                    {code: 'oid', hidden: true},
                    {
                        label: '实施状态', code: 'execuStatus', width: 100, renderCell(h, data) {
                            return that.onExecuteStateRenderer(data.row);
                        }
                    },
                    {label: '实施人员', code: 'eoCreatorName', width: 80},
                    {label: '区域', code: 'area', width: 70},
                    {label: '区域type', code: 'areaType', hidden: true},
                    {label: '区域code', code: 'areaCode', hidden: true},
                    {label: '服务大类', code: 'categoryName', width: 100},
                    {label: '服务分类', code: 'catalogName', width: 100},
                    {label: '服务项', code: 'itemName', width: 100},
                    {label: '变更对象', code: 'devName', width: 110},
                    {label: '配置相关信息', code: 'setting', width: 120},
                    {label: '实施内容', code: 'content', width: 100},
                    {
                        label: '是否自动化', code: 'isAuto', width: 100, renderCell(h, data) {
                            return that.onYesOrNoRenderer(data.row);
                        }
                    },
                    {label: '完成日期', code: 'gmtComplete', width: 100}
                ];
                this.columns.bizColumns = [
                    {code: 'oid', hidden: true},
                    {label: '变更单号', code: 'alteratioNum', hidden: true},
                    {label: '业务服务目录ID', code: 'catalogId', hidden: true},
                    {label: '区域', code: 'area', width: 160},
                    {label: '区域type', code: 'areaType', hidden: true},
                    {label: '区域code', code: 'areaCode', hidden: true},
                    {label: '服务名称', code: 'catalogName', width: 180},
                    {label: '服务项', code: 'itemName', width: 180},
                    {label: '服务级别', code: 'serviceLevel', width: 120, mapTypeCode: "SC_LEVEL"},
                    {label: '有效开始时间', code: 'startTime', width: 150},
                    {label: '有效结束时间', code: 'endTime', width: 150},
                    {label: '创建人', code: 'catalogCreator', width: 100},
                    {label: '创建code', code: 'creatorCode', hidden: true},
                    {label: '创建时间', code: 'gmtCreate', hidden: true}
                ];
                this.columns.techColumns = [
                    {code: 'oid', hidden: true},
                    {label: '变更单号', code: 'alteratioNum', hidden: true},
                    {label: '区域', code: 'area', width: 220},
                    {label: '服务大类', code: 'categoryName', width: 220},
                    {label: '服务名称', code: 'catalogName', width: 290},
                    {label: '服务项', code: 'itemName', width: 300},
                    {label: '技术服务目录ID', code: 'catalogId', hidden: true},
                    {label: '变更对象ID', code: 'devId', hidden: true},
                    {label: '创建人', code: 'catalogCreator', hidden: true},
                    {label: '创建code', code: 'creatorCode', hidden: true},
                    {label: '创建组织机构code', code: 'orgCode', hidden: true},
                    {label: '创建时间', code: 'gmtCreate', hidden: true}
                ];
            },
            removeAttachment() {

            },
            uploadSuccessHandler() {

            },
        },
        watch: {},
        mounted() {
            let _this = this;
            Promise.all([_this.initEnumApprStatus(), _this.initEnumExecuteStatus(), _this.requestNetAreaData()]).then(res => {
                this.initControls();
                let total = {};
                if (!!_this.$route.query.actionData) {
                    total = JSON.parse(localStorage.getItem(_this.$route.query.actionData));
                    /*关联单据信息*/
                    if (total.isBreakdown == 1) {
                        _this.alterationData.alterationSource = '0';
                        total.isBreakdown = "故障申报"
                    } else if (total.isBreakdown == 0) {
                        _this.alterationData.alterationSource = "1";
                        total.isBreakdown = "服务申请"
                    }
                    let OtherModelVoList = {};
                    OtherModelVoList.otherModelName = total.isBreakdown;
                    OtherModelVoList.url = total.url;
                    OtherModelVoList.otherModelId = total.id;
                    OtherModelVoList.workTicket = total.workTicket;
                    _this.alterationData.alterationOtherModelVoList.push(OtherModelVoList);
                    _this.alterationData.area = total.areaName;
                    _this.alterationData.areaCode = total.areaCode;
                    _this.areaId = total.areaId;
                    _this.getAreaByAreaId(total.areaId);
                    /*业务服务目录*/
                    let objList = {};
                    objList.catalogId = total.areaId;
                    objList.area = total.alterationDatalist.areaShortname;
                    objList.catalogName = total.alterationDatalist.psbcname;
                    objList.itemName = total.alterationDatalist.sname;
                    objList.startTime = total.alterationDatalist.gmtCreate;
                    objList.endTime = total.alterationDatalist.gmtModify;
                    if (total.alterationDatalist.isUserLevel == 0) {
                        objList.serviceLevel = "级别1"
                    } else if (total.alterationDatalist.isUserLevel == 1) {
                        objList.serviceLevel = "级别2"
                    } else if (total.alterationDatalist.isUserLevel == 2) {
                        objList.serviceLevel = "级别3"
                    } else if (total.alterationDatalist.isUserLevel == 3) {
                        objList.serviceLevel = "级别4"
                    } else if (total.alterationDatalist.isUserLevel == 4) {
                        objList.serviceLevel = "级别5"
                    } else if (total.alterationDatalist.isUserLevel == 5) {
                        objList.serviceLevel = "级别6"
                    } else if (total.alterationDatalist.isUserLevel == 6) {
                        objList.serviceLevel = "级别7"
                    }
                    /*objList.serviceLevel = total.alterationDatalist.isUserLevel;*/
                    _this.alterationData.alterationBizCatalogList.push(objList);
                    /*技术服务目录*/
                    for (let i = 0; i < total.provisionalData.length; i++) {
                        let ObjData = {};
                        ObjData.catalogId = total.provisionalData[i].catalogId;
                        ObjData.area = total.provisionalData[i].shortname;
                        ObjData.categoryName = total.provisionalData[i].parentName;
                        ObjData.catalogName = total.provisionalData[i].techCategoryName;
                        ObjData.itemName = total.provisionalData[i].techSname;
                        _this.alterationData.alterationTichCatalogList.push(ObjData)
                    }
                }
            });
        },

    }
</script>

<style scoped>
    @import "../dev/style/edit.less";

    .form-content {
        width: 2500px;
    }

    .divContent {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: white;
        overflow-y: auto;
    }

    .text {
        width: 90px;
        text-align: right;
        padding-right: 12px;
    }

    .click-label {
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }

</style>