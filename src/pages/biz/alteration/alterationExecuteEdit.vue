<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData" :btn-extend3="accpet" v-loading="isLoading">
            <div slot-scope="flowScope">
                <el-form :model="executeData" status-icon :rules="rules" ref="execute"
                         label-width="140px">
                    <ice-grid-layout :columns="3" name="变更基础信息">
                        <el-form-item label="变更单号" :layout="3">
                            <el-button type="text" size="medium" @click="viewMain">{{executeData.alterationNum}}
                            </el-button>
                        </el-form-item>
                        <el-form-item label="服务申请用户">
                            <el-input v-model="executeData.proposerName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="服务申请单位">
                            <el-input v-model="executeData.builderUnit" :readonly="true"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <el-input v-model="executeData.phone" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间">
                            <el-date-picker v-model="executeData.gmtApply" type="datetime"
                                            :disabled="true"
                                            format="yyyy-MM-dd HH:mm"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="变更发起人">
                            <el-input v-model="executeData.builderName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发起人单位">
                            <el-input v-model="executeData.builderUnit"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="变更类型">
                            <el-select placeholder="请选择" clearable v-model="executeData.alterationType"
                                       　 :disabled="true">
                                <el-option
                                        v-for="item in ENUM.ALTERATION_TYPE.properties"
                                        :key="item.oid"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="变更来源">
                            <ice-select placeholder="变更来源" map-type-code="SOURCE"
                                        v-model="executeData.alterationSource"
                                        :disabled="true"></ice-select>
                        </el-form-item>
                        <el-form-item label="区域">
                            <el-select placeholder="请选择" v-model="executeData.area" clearable
                                       　 :disabled="true">
                                <el-option
                                        v-for="(item,index) in ENUM.AREA"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                            <el-input v-model="executeData.netArea" style="display: none"></el-input>
                            <el-input v-model="executeData.netType" style="display: none"></el-input>
                        </el-form-item>

                        <el-form-item label="紧急程度"
                                      v-if="executeData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-select placeholder="请选择" v-model="executeData.emerdegr"
                                       　 :disabled="true" clearable>
                                <el-option
                                        v-for="(item,index) in ENUM.EMERGENT_DEGREE.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="是否策略变更"
                                      v-if="executeData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-select placeholder="请选择" v-model="executeData.isStrategy"
                                       :disabled="true" clearable>
                                <el-option
                                        v-for="(item,index) in ENUM.YES_NO.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预计完成时间"
                                      v-if="executeData.alterationType != ENUM.ALTERATION_TYPE.BZBG">
                            <el-date-picker v-model="executeData.gmtEsticomp" type="datetime"
                                            :disabled="true" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="变更执行">
                        <el-form-item label="变更实施单号">
                            <el-input v-model="executeData.execuNum" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="变更实施人员">
                            <el-input v-model="executeData.executorName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="变更实施人员单位">
                            <el-input v-model="executeData.executorUnit" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="实施单状态">
                            <el-select v-model="executeData.execuStatus" placeholder="请选择" clearable
                                       :disabled="true">
                                <el-option
                                        v-for="(item,index) in ENUM.EXECUTE_STATUS.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="开始实施时间" prop="gmtStart">
                            <el-date-picker v-model="executeData.gmtStart" type="datetime" :disabled="formReadOnly"
                                            format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束实施时间" prop="gmtEnd">
                            <el-date-picker v-model="executeData.gmtEnd" type="datetime" :disabled="formReadOnly"
                                            format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                        </el-form-item>
                        <el-tabs v-model="tabActiveName" @tab-click="" layout="3"
                                 style="min-height: 350px;" v-show="$route.query.actionType != 'view'">
                            <el-tab-pane label="变更实施" name="first">
                                <div class="content-filled" style="width: 95%" v-if="false">
                                    <div class="right">
                                        <ice-query-grid title=""
                                                        :gridData="executeData.alterationExecuteDetailVos"
                                                        :query="[]"
                                                        :pagination="false"
                                                        :columns="columns.executeColums"
                                                        :operations="executeOperations"
                                                        chooseItem="single"
                                                        :minHeight="300"
                                                        :operationsWidth=50
                                                        @selection-change="executeTableChange"
                                                        :buttons="executeButton" ref="executeGrid">
                                        </ice-query-grid>
                                    </div>
                                    <div class="left">
                                        <div style="margin-bottom: 8px;margin-top: 4px">
                                            <el-button icon="el-icon-plus" type="primary" @click="addDev()"
                                                       v-if="!formReadOnly">新增变更对象
                                            </el-button>
                                            <el-button icon="el-icon-plus" type="primary" @click="addRow()"
                                                       v-if="!formReadOnly">手动增加变更对象
                                            </el-button>
                                            <el-button icon="el-icon-delete" type="primary" @click="deleteDev()"
                                                       v-if="!formReadOnly">删除变更对象
                                            </el-button>
                                        </div>
                                        <ice-editable-table :data="executeData.alterationExecuteObjVos"
                                                            @selection-change="devTableChange" :rules="editTableRules"
                                                            ref="executeTable" height="270">
                                            <el-table-column
                                                    type="selection"
                                                    width="30">
                                            </el-table-column>
                                            <!--       <el-table-column
                                                           label="变更对象"
                                                           width="80" prop="devName">
                                                   </el-table-column>
                                                   <el-table-column
                                                           label="变更对象IP"
                                                           width="90" prop="devIp">
                                                   </el-table-column>-->
                                            <ice-editable-table-column label="变更对象" :width="120" prop="devName"
                                                                       type="input" :disabled="formReadOnly">
                                            </ice-editable-table-column>
                                            <ice-editable-table-column label="变更对象Ip" :width="120" prop="devIp"
                                                                       type="input" :disabled="formReadOnly">
                                            </ice-editable-table-column>
                                            <el-table-column v-if="false"
                                                             label="对象编号"
                                                             width="95" prop="devNum">
                                            </el-table-column>
                                            <el-table-column v-if="false"
                                                             label="变更对象ID"
                                                             width="95" prop="devId">
                                            </el-table-column>
                                            <ice-editable-table-column label="配置相关信息" :width="200" prop="setting">
                                                <template slot-scope="scope">
                                                    <el-input type="textarea"
                                                              :rows="2" :disabled="formReadOnly"
                                                              v-model="scope.row.setting">>
                                                    </el-input>
                                                </template>
                                            </ice-editable-table-column>
                                            <ice-editable-table-column label="实施内容" :width="200" prop="content">
                                                <template slot-scope="scope">
                                                    <el-input type="textarea"
                                                              :rows="2" :disabled="formReadOnly"
                                                              v-model="scope.row.content">>
                                                    </el-input>
                                                </template>
                                            </ice-editable-table-column>
                                            <ice-editable-table-column label="是否自动化" :width="90" prop="isAuto">
                                                <template slot-scope="scope">
                                                    <el-select placeholder="请选择" v-model="scope.row.isAuto"
                                                               clearable :disabled="formReadOnly">
                                                        <el-option
                                                                v-for="(item,index) in ENUM.YES_NO.properties"
                                                                :key="index"
                                                                :label="item.name"
                                                                :value="item.code">
                                                        </el-option>
                                                    </el-select>
                                                </template>
                                            </ice-editable-table-column>
                                            <ice-editable-table-column prop="gmtComplete"
                                                                       label="完成时间"
                                                                       :width="170">
                                                <template slot-scope="scope">
                                                    <el-date-picker v-model="scope.row.gmtComplete" type="datetime"
                                                                    format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                                                </template>
                                            </ice-editable-table-column>
                                        </ice-editable-table>
                                    </div>
                                </div>
                                <add-tec-dev @getTechData="getTechData" :columns="childColumns" :rules="editTableRules"
                                             :ref="EDIT_ENUMS.REFS.EXECUTE_TABLE.REF" v-if="!isLoading"
                                             :execute-list="executeData.alterationExecuteDetailVos"
                                             :execute-num="executeData.execuNum" :is-edit="!formReadOnly"
                                             :dev-columns-condition="EDIT_ENUMS.REFS.DEV_SELECT.DEV_COLUMNS"></add-tec-dev>
                            </el-tab-pane>
                            <el-tab-pane label="其他人员实施情况" name="second">
                                <ice-query-grid title=""
                                                :gridData="executeData.alterationExcuteOtherUserList"
                                                :query="query"
                                                :columns="columns.executeOtherUserColumns"
                                                ref="tichQueryGrid"
                                                :operations="[]"
                                                :operationsWidth=0
                                                :minHeight="350"
                                                v-model="executeData.alterationExcuteOtherUserList"
                                                :pagination="false"
                                                :buttons="[]">
                                </ice-query-grid>
                            </el-tab-pane>
                            <el-tab-pane label="服务启停信息" name="third">
                                <startandstop-common :execu-num="executeData.execuNum" v-if="executeData.execuNum != ''"
                                                     :read-only="formReadOnly"></startandstop-common>
                            </el-tab-pane>
                        </el-tabs>
                        <ice-query-grid title="" v-show="$route.query.actionType == 'view'"
                                        :query="[]"
                                        :gridData="executeData.alterationExecuteList"
                                        :columns="columns.allExecuteColumns"
                                        ref="mainQueryGrid"
                                        :operations="[]"
                                        :operationsWidth=0
                                        :minHeight="350"
                                        :pagination="false"
                                        :buttons="[]">
                        </ice-query-grid>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <template v-if="dialog.assign">
            <el-dialog title="排程" :visible.sync="dialog.assign" width="60%">
                <alteration-assign :alteration-num="executeData.alterationNum" :show-delete-btn="false"
                                   :close-handler="closeAssign"></alteration-assign>
            </el-dialog>
        </template>
        <pro-sc-tech-tree :ref="EDIT_ENUMS.REFS.TECH_SELECT.REF" :is-callback="true"
                          @getData="getTechData"
                          v-if="EDIT_ENUMS.REFS.TECH_SELECT.SHOW"></pro-sc-tech-tree>
        <dev-select v-if="EDIT_ENUMS.REFS.DEV_SELECT.SHOW" :ref="EDIT_ENUMS.REFS.DEV_SELECT.REF"
                    :querys="EDIT_ENUMS.REFS.DEV_SELECT.QUERY_DEV" :on-close-handler="selectDev" :multiple="true"
                    :columns="EDIT_ENUMS.REFS.DEV_SELECT.DEV_COLUMNS"></dev-select>
    </div>
</template>

<script>
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceSelect from "@/components/common/base/IceSelect"
    import AlterationAssign from "./alterationAssign";
    import renderer from './js/renderer'
    import comm from "./js/comm";
    import validate from "./js/validation";
    import execute from "./js/alterationEdit/execute";
    import ProScTechTree from "../../pro/sc/ProScTechTree";
    import DevSelect from "../dev/devSelect";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import devRenderer from "@/pages/biz/dev/js/comm/renderer"
    import StartandstopCommon from "../startandstop/startandstopCommon";
    import AlterationEdit from "./alterationEdit";
    import AddTecDev from "./addTecDev";

    export default {
        name: "alterationExecuteEdit",
        mixins: [comm, validate, execute, renderer, devComm, devRenderer],
        components: {
            AddTecDev,
            AlterationEdit,
            StartandstopCommon,
            DevSelect,
            ProScTechTree,
            IceFlowForm,
            IceGridLayout,
            IceQueryGrid,
            IceSelect,
            IceEditableTable,
            AlterationAssign,
            IceEditableTableColumn
        },
        data() {
            return {
                childColumns: [
                    {label: '配置相关信息', width: 200, placeholder: '请输入配置相关信息', type: 'textarea', prop: 'setting'},
                    {label: '实施内容', width: 200, type: 'textarea', placeholder: '请输入实施内容', prop: 'content'},
                    {
                        label: '是否自动化', width: 120, type: 'select', prop: 'isAuto', data: () => {
                            return this.ENUM.YES_NO.properties
                        }
                    },
                    {label: '完成时间', width: 200, type: 'date', placeholder: '请选择完成时间', prop: 'gmtComplete'}
                ],
                EDIT_ENUMS: {
                    REFS: {
                        TECH_SELECT: {REF: "techSelect", SHOW: false},
                        DEV_SELECT: {REF: "devSelect", SHOW: false, QUERY_DEV: [], DEV_COLUMNS: []},
                        EXECUTE_TABLE: {REF: "executeTable"}
                    }
                },
                dialog: {
                    assign: false,  //排程弹出框
                },
                formReadOnly: true,
                executeOperations: [],
                columns: {
                    executeColums: [
                        {code: 'oid', hidden: true},
                        {label: '变更单号', code: 'alteratioNum', hidden: true},
                        {label: '区域', code: 'area', width: 90},
                        {label: '服务大类', code: 'categoryName', width: 90},
                        {label: '服务名称', code: 'catalogName', width: 90},
                        {label: '服务项', code: 'itemName', width: 90},
                        /*  {label: '变更对象', code: 'devName', width: 120},
                          {label: '配置相关信息', code: 'setting', width: 120},
                          {label: '实施内容', code: 'content', width: 120},
                          {label: '是否自动化', code: 'isAuto', width: 100},
                          {label: '完成时间', code: 'gmtComplete', width: 120},*/
                        {label: '技术服务目录ID', code: 'catalogId', hidden: true},
                        {label: '变更对象ID', code: 'devId', hidden: true},
                        {label: '创建人', code: 'catalogCreator', hidden: true},
                        {label: '创建code', code: 'creatorCode', hidden: true},
                        {label: '创建组织机构code', code: 'orgCode', hidden: true},
                        {label: '创建时间', code: 'gmtCreate', hidden: true}
                    ],
                    executeOtherUserColumns: [],
                    allExecuteColumns: []
                },
                executeButton: [],
                devSelected: [],
                executeSelected: [],//实施执行选中的列
                //tab选中的标签页
                tabActiveName: 'first',
                //实施执行data
                executeData: {
                    oid: "",//oid
                    alterationNum: "",//变更单号
                    execuNum: "",//实施单号
                    execuStatus: "",//实施状态
                    gmtStart: "",//实施开始时间
                    gmtEnd: "",//实施结束时间
                    gmtAccept: "",//受理时间
                    alterationExecuteList: [],//实施详情list
                    alterationExecuteVos: [],//实施人员list
                    alterationExecuteObjVos: [],//实施执行变更对象list
                    alterationExecuteDetailVos: [],//实施执行list
                    alterationExcuteOtherUserList: [],//其他人员实施执行list
                },
                devMap: {},//变更对象Map
                query: [],
                Listener1: null,
                executeList: [],//实施对象list
                executeDevList: [],
                isLoading: true,
                alteraion: {}//主表信息
            }
        },
        methods: {
            initControls() {
                let that = this;
                this.columns.executeOtherUserColumns = [
                    {code: 'oid', hidden: true},
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
                    {label: '开始时间', code: 'gmtCreate', width: 100},
                    {label: '结束时间', code: 'gmtComplete', width: 100},
                    {label: '实施人员', code: 'creatorName', width: 80}
                ];
                this.columns.allExecuteColumns = [{code: 'oid', hidden: true},
                    {label: '区域', code: 'area', width: 70},
                    {label: '区域type', code: 'areaType', hidden: true},
                    {label: '区域code', code: 'areaCode', hidden: true},
                    {label: '服务大类', code: 'categoryName', width: 100},
                    {label: '服务分类', code: 'catalogName', width: 100},
                    {label: '服务项', code: 'itemName', width: 100},
                    {label: '变更对象', code: 'devName', width: 110},
                    {label: '实施人员', code: 'eoCreatorName', width: 80},
                    {label: '配置相关信息', code: 'setting', width: 120},
                    {label: '实施内容', code: 'content', width: 100},
                    {
                        label: '是否自动化', code: 'isAuto', width: 100, renderCell(h, data) {
                            return that.onYesOrNoRenderer(data.row);
                        }
                    },
                    {label: '完成日期', code: 'gmtComplete', width: 100},
                    {
                        label: '实施状态', code: 'execuStatus', width: 100, renderCell(h, data) {
                            return that.onExecuteStateRenderer(data.row);
                        }
                    }];
                if (this.$route.query.actionType != this.ENUM.ACTIONTYPE.VIEW) {
                    this.executeOperations = [Object.assign({}, this.ENUM.OPERATION.DELETE, {callback: this.deleteExecute})];
                }
            },
            /**
             * 初始化页面按钮
             */
            initButton() {
                this.$refs[`flowForm`].hiddenBtn("save,submit,reject,jump,extend3");
            },
            /**
             * 提交封装data数据
             */
            flowBizData() {
                // this.assembleExecuteList();
                this.assembleData();
                console.log(this.executeData);
                return this.executeData;
            },
            assembleData() {
                let _data = this.$refs[this.EDIT_ENUMS.REFS.EXECUTE_TABLE.REF].getData();
                this.executeData.alterationExecuteDetailVos = _data.catalogData;
                for (let i = 0; i < this.executeData.alterationExecuteDetailVos.length; i++) {
                    let catalogId = this.executeData.alterationExecuteDetailVos[i].catalogId;
                    if (_data.map[catalogId]) {
                        this.executeData.alterationExecuteDetailVos[i].alterationExecuteObjVos = _data.map[catalogId];
                    }
                }
            },
            /**
             * 初始化页面数据
             */
            flowReady(flowcont, bizdata) {
                this.getExecuteByOid(bizdata.oid);
                this.getByAlterationNum(bizdata.alterationNum).then((data) => {
                    data.alteraionOid = data.oid;
                    delete data.oid;
                    Object.assign(this.executeData, data);
                    this.executeData.area = this.getAreaByNetAreaAndNetType(this.executeData.netArea, this.executeData.netType);
                });
            },
            /**
             * 根据oid查找单条实施数据
             */
            getExecuteByOid(oid) {
                let that = this;
                this.axios(this.ENUM.ACTIONS.GET_EXECUTE_BY_OID, {oid: oid}, [res => {
                    if (res.data) {
                        Object.assign(that.executeData, res.data);
                        that.executeData.gmtStart = res.data.gmtAccept;
                        that.onSuccessHandler();
                    }
                }]);
            },
            /**
             * 成功接收数据
             */
            onSuccessHandler() {
                this.getMyselfExcuteList();
                this.getOtherExecute();
                this.getAllExecByAlterationNum();
            },
            /**
             * 初始化流程按钮
             */
            initFlowButtons() {
                if (this.executeData.gmtAccept != null) {
                    this.hiddenButtons("extend3");
                }
                if (this.executeData.execuStatus != this.ENUM.EXECUTE_STATUS.HANG_UP) {
                    this.hiddenButtons("extend2");
                }
            },
            /**
             * 初始化页面样式
             */
            initStyle() {
                if (this.executeData.gmtAccept != null && this.executeData.gmtAccept != "" || this.executeData.execuStatus == this.ENUM.EXECUTE_STATUS.HANDLING) {
                    this.formReadOnly = false;
                }
            },
            /**
             * 隐藏按钮
             */
            hiddenButtons(btnId) {
                if (this.$refs[`flowForm`]) {
                    this.$refs[`flowForm`].hiddenBtn(btnId);
                }
            },
            /**
             * 流程按钮
             */
            flowOperateBtn(flowContext, bizdata) {
                let that = this;
                if (this.$refs.flowForm.flowInstData.currentNode.nodeId == this.ENUM.EXECUTE_NODE_ID.TURN_ASSIGN && flowContext.nodeId == this.ENUM.EXECUTE_NODE_ID.AGREEN) {
                    return new Promise(resolve => {
                        flowContext.processVar = {};
                        that.turnAssign();
                        that.Listener1 = (value) => {
                            resolve(true);
                        }
                    }, reject => {
                    });
                } else if (flowContext.nodeId == this.ENUM.EXECUTE_NODE_ID.SAVE || flowContext.nodeId == this.ENUM.EXECUTE_NODE_ID.FINISH) {
                    return Promise.all([this.$refs['execute'].validate(), this.validateData()]);
                } else {
                    return true;
                }
            },
            /**
             * 申请转派
             */
            turnAssign() {
                this.dialog.assign = true;
            },
            /**
             * 排程页面关闭
             */
            closeAssign() {
                this.dialog.assign = false;
                let that = this;
                Promise.all([this.getExecuteUser(this.executeData.alterationNum)]).then(res => {
                    this.createExecuFlow(that.executeData.alteraionOid, that.assembleExecuteFlowList(res[0].data))
                        .then(res => {
                            this.Listener1("close");
                        })
                });
            },
            /**
             * 根据变更单号获取所有实施list
             */
            getAllExecByAlterationNum() {
                let that = this;
                this.axios(this.ENUM.ACTIONS.GET_ALL_EXEC_BY_ALTERATION_NUM, {alterationNum: that.executeData.alterationNum}, [res => {
                    that.executeData.alterationExecuteList = res.data;
                }]);
            },
            /**
             *根据变更单号获取变更主对象
             */
            getByAlterationNum(alterationNum) {
                let that = this;
                return new Promise(resolve => {
                    that.axios(that.ENUM.ACTIONS.GET_BY_ALTERATION_NUM, {alterationNum: alterationNum}, [res => {
                        resolve(res.data);
                    }]);
                });
            },
            /**
             * 页面数据的校验
             */
            validateData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.$refs[_this.EDIT_ENUMS.REFS.EXECUTE_TABLE.REF].validateData().then((res) => {
                        resolve();
                    }).catch((res) => {
                        if (!res) {
                            //数据校验失败
                            res = "数据校验失败!请核对页面数据!";
                        }
                        //校验失败
                        _this.$message.error(res);
                        reject();
                    });
                });
                /* return new Promise((resolve, reject) => {
                     let that = this;
                     this.$refs.executeTable.validateAll((valid) => {
                         if (that.executeData.alterationExecuteDetailVos == null || that.executeData.alterationExecuteDetailVos.length == 0) {
                             that.$alert('请选择相关服务目录', '提示', {
                                 confirmButtonText: '确定'
                             });
                             valid = false;
                         } else {
                             for (let i = 0; i < that.executeData.alterationExecuteDetailVos.length; i++) {
                                 let _detail = that.executeData.alterationExecuteDetailVos[i];
                                 if (that.devMap[_detail.catalogId] == null) {
                                     let num = i + 1;
                                     that.$alert('请补充序号为【' + num + '】的服务目录的变更对象', '提示', {
                                         confirmButtonText: '确定'
                                     });
                                     valid = false;
                                     break;
                                 }
                             }
                         }
                         if (valid) {
                             resolve();
                         } else {
                             reject();
                         }
                     });
                 });*/
            },
            /**
             *受理按钮响应事件
             */
            accpet() {
                this.$confirm('是否确认受理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let that = this;
                    this.axios(this.ENUM.ACTIONS.EXECUTE_ACCEPT, {oid: that.executeData.oid}, [res => {
                        Object.assign(that.executeData, res.data);
                        this.$message({
                            type: 'success',
                            message: '受理成功!'
                        });
                    }]);
                }).catch(() => {
                });
            },
            /**
             * 变更单号点击事件
             */
            viewMain() {
                let host = window.location.href.substring(0, window.location.href.indexOf("#") + 1);
                window.open(host + "biz/alteration/alterationEdit?dataId=" + this.executeData.alteraionOid);
            }
        },
        watch: {
            executeData: {
                handler(newValue, oldValue) {
                    if (this.$route.query.actionType == this.ENUM.ACTIONTYPE.VIEW) {
                        this.formReadOnly = true;
                        this.initButton();
                    } else if (newValue.execuStatus != this.ENUM.EXECUTE_STATUS.HANDLING) {
                        this.formReadOnly = true;
                    } else {
                        this.initFlowButtons();
                        this.initStyle();
                    }
                },
                deep: true,
                immediate: true
            },
            formReadOnly: {
                handler(newValue, oldValue) {
                    if (!newValue) {
                        this.executeButton = this.initExecuteButton();
                    }
                },
                deep: true,
                immediate: true
            }
        },
        mounted() {
            let _this = this;
            Promise.all([_this.assembleEnumByDataDictionary(_this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE), _this.requestNetAreaData(),
                _this.requestCategoryData(),
                _this.initEnumExecuteStatus()]).then(this.initControls);
        }
    }
</script>

<style scoped>
    .right {
        width: 42%;
        height: 100%;
        padding-right: 4px
    }

    .left {
        width: 58%;
        height: 100%;
        padding-left: 4px
    }

    .form-content {
        width: 3000px;
    }
</style>