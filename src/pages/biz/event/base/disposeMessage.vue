<template>
    <div class="form">
        <el-form :model="mainData" :rules="formRules" ref="form">
            <ice-grid-layout :columns="3" name="处理信息">
                <el-form-item label="工单号:" label-width="115px" prop="workTicket">
                    <el-input v-model="mainData.workTicket" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="工单状态:" label-width="115px" prop="workStatus">
                    <ice-datamap-translater :value="mainData.status?mainData.status+'':''" mapTypeCode="workStatus"
                                            model="input"></ice-datamap-translater>
                </el-form-item>
                <el-form-item label="服务方式:" label-width="115px" prop="serviceWay">
                    <ice-select
                            v-model="mainData.serviceWay"
                            @change="$nextTick(()=>{$refs.form.validateField('serviceWay',error=>{})})"
                            map-type-code="serviceWay"
                            :disabled="judge">
                    </ice-select>
                </el-form-item>
                <el-form-item label="开始处理时间:" label-width="115px" prop="gmtBegin" id="timeDate">
                    <ice-date-picker v-model="mainData.gmtBegin"
                                     type="datetime" :readonly="readonly"
                                     :disabled="judge"
                                     @change="timeChange"
                                     value-format="yyyy-MM-dd HH:mm:ss"
                                     format="yyyy-MM-dd HH:mm:ss"
                                     :time-filter="stopTimeFilter"></ice-date-picker>

                </el-form-item>
                <el-form-item label="完成处理时间:" label-width="115px" prop="gmtEnd">
                    <ice-date-picker v-model="mainData.gmtEnd"
                                     :readonly="readonly"
                                     :disabled="judge"
                                     type="datetime"
                                     @change="timeChange"
                                     value-format="yyyy-MM-dd HH:mm:ss"
                                     format="yyyy-MM-dd HH:mm:ss"
                                     :time-filter="startTimeFilter"></ice-date-picker>

                </el-form-item>
                <el-form-item label="处置时长:" label-width="115px">
                    <el-input :disabled="true" v-model="mainData.handleTime"></el-input>
                </el-form-item>
                <el-form-item label="解决状态:" label-width="115px" prop="resolveStatus">
                    <ice-select placeholder="请选择.."
                                v-model="mainData.resolveStatus" map-type-code="resolveStatus"
                                :disabled="judge"
                                @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
                    </ice-select>
                </el-form-item>
                <el-form-item label="事件起因:" label-width="115px" prop="reason"><!--reason-->
                    <ice-select placeholder="请选择.."
                                v-model="mainData.reason" map-type-code="eventCause"
                                :disabled="judge"
                                @change="$nextTick(()=>{$refs.form.validateField('reason',error=>{})})">
                    </ice-select>
                </el-form-item>
                <el-form-item label="批量数:" label-width="105px">
                    <el-input-number placeholder="1"
                                     :min="1"
                                     :max="mainData.justNumber?mainData.justNumber:1"
                                     :precision="0"
                                     v-model="mainData.num"
                                     :disabled="judge">
                    </el-input-number>
                </el-form-item>
                <el-form-item label="处理过程:" label-width="115px" prop="measure" layout="3" style="min-height: 40px">
                    <el-input v-model="mainData.measure" type="textarea" :readonly="readonly" rows="6" :disabled="judge"
                              class="textarea"></el-input>
                </el-form-item>
                <el-tabs style="max-height: 500px;overflow: hidden" v-model="activeName" @tab-click="handleClick"
                         layout="3">
                    <el-tab-pane label="工单操作记录" name="first" value="0">
                        <ice-query-grid :data-url="url2"
                                        :columns="columnsFirst"
                                        @selection-change="First"
                                        :gridAutoRefresh="true"
                                        :query="queryFirst"
                                        ref="gridsFirst">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="技术服务目录信息" name="second" value="1" width=100%>
                        <div class="top" v-show="shop">
                            <el-button class="buttons" type="primary" @click="addCata()">新增服务项</el-button>
                            <el-button class="buttons" type="primary" @click="addObject()">新增对象</el-button>
                            <el-button class="buttons" type="primary" @click="deleteCata()">删除服务项</el-button>
                            <el-button class="buttons" type="primary" @click="deleteObject()">删除对象</el-button>
                        </div>
                        <div style="width: 100%">
                            <ice-editable-table
                                    :rules="formTechnologyDe"
                                    @selection-change="technologyMeeage"
                                    :height="400"
                                    :data="mainData.technologyData">
                                <el-table-column type="selection"></el-table-column><!--deptName-->
                                <ice-editable-table-column
                                        prop="shortname"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="区域">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="parentName"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="服务大类">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="techCategoryName"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="服务名称">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="techSname"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="服务项">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="manual"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="技术手册">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="devName"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="true"
                                        label="服务对象">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="operateContent"
                                        :isTooltip="true"
                                        input-type="input"
                                        :disabled="!shop"
                                        label="操作内容">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="operateDate"
                                        :isTooltip="true"
                                        input-type="date"
                                        :width="260"
                                        date-type="datetime"
                                        date-format="yyyy-MM-dd HH:mm:ss"
                                        :disabled="!shop"
                                        label="操作时间">
                                </ice-editable-table-column>
                            </ice-editable-table>
                        </div>

                    </el-tab-pane>
                    <el-tab-pane label="参与人信息" name="party">
                        <div class="top" v-show="shop">
                            <el-button class="buttons" type="primary" @click="newAdd()">新增</el-button>
                            <el-button class="buttons" type="primary" @click="delMeeage()">删除</el-button>
                        </div>
                        <ice-editable-table
                                :rules="formMeeage"
                                @selection-change="actorMeeage"
                                :height="400"
                                :isTooltip="true"
                                :fit="true"
                                :width="null"
                                :data="mainData.dataList"
                                ref="gridPar">
                            <el-table-column type="selection"></el-table-column>
                            <ice-editable-table-column
                                    prop="engineerName"
                                    :width="200"
                                    :isTooltip="true"
                                    :disabled="true"
                                    label="参与人">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="contribution"
                                    input-type="number"
                                    :disabled="!shop"
                                    :width="200"
                                    :isTooltip="true"
                                    :min="1"
                                    :max="99"
                                    label="贡献度（%）">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="contribution"
                                    :disabled="!shop"
                                    :width="null"
                                    :isTooltip="true"
                                    label="操作">
                                <template slot-scope="scope">
                                    <el-button>操作</el-button>
                                </template>
                            </ice-editable-table-column>
                            <!--<ice-editable-table-column
                                    prop="matter"
                                    :width="250"
                                    :isTooltip="true"
                                    input-type="input"
                                    :disabled="!shop"
                                    maxlength="64"
                                    label="参与事项">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="operation"
                                    :fit="true"
                                    :width="null"
                                    :isTooltip="true"
                                    :disabled="!shop"
                                    input-type="input"
                                    maxlength="64"
                                    label="操作内容">
                            </ice-editable-table-column>-->
                        </ice-editable-table>
                    </el-tab-pane>
                    <el-tab-pane label="当前工单关联变更单" name="currentWork" value="3">
                        <ice-query-grid
                                data-url="biz/ProEvtWorkTicketShift/changeWorkTicketList?type=1"
                                :gridAutoRefresh="true"
                                :query="currentWork"
                                :columns="columnsCurrentWork"
                                ref="gridsWork">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="服务单关联的变更单信息" name="serviceMessage" value="4">
                        <ice-query-grid
                                data-url="biz/ProEvtWorkTicketShift/changeWorkTicketList?type=2"
                                :gridAutoRefresh="true"
                                :query="currenList"
                                :columns="columnsTicketList"
                                ref="umnGrid">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="进入申请信息" name="proposerMessage" value="5">
                        <ice-query-grid
                                :columns="columnsProposerMessage"
                                :pagination="false"
                                :buttons="buttons.buttonsProposerMessage">
                        </ice-query-grid>
                    </el-tab-pane>
                    <el-tab-pane label="第三方厂商" name="thirdparty" value="6">
                        <div class="top" v-show="shop">
                            <el-button class="buttons" type="primary" @click="thirdpartyNewAdd()">新增</el-button>
                            <el-button class="buttons" type="primary" @click="thirdpartydelMeeage()">删除</el-button>
                        </div>
                        <ice-editable-table :data="mainData.coopUnitVos"
                                            @selection-change="unitnameMeeage"
                                            :height="400"
                                            input-type="input"
                                            :fit="true"
                                            :rules="formThirdparty"
                                            show-overflow-tooltip="Boolean">
                            <el-table-column type="selection"></el-table-column>
                            <el-table-column
                                    v-if="false"
                                    prop="unitcode"
                                    :width="200"
                                    label="第三方厂商Code">
                            </el-table-column>
                            <el-table-column
                                    prop="unitname"
                                    :disabled="true"
                                    :isTooltip="true"
                                    :width="200"
                                    label="第三方厂商">
                            </el-table-column>
                            <ice-editable-table-column
                                    prop="quality"
                                    :disabled="true"
                                    :isTooltip="true"
                                    label="企业性质">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="responseSpeed"
                                    input-type="number"
                                    :disabled="!shop"
                                    :isTooltip="true"
                                    :min="1"
                                    :max="5"
                                    label="响应速度">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="disposeSpeed"
                                    :disabled="!shop"
                                    :isTooltip="true"
                                    :min="1"
                                    :max="5"
                                    input-type="number"
                                    label="处理速度">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="servSpeed"
                                    :disabled="!shop"
                                    :isTooltip="true"
                                    :min="1"
                                    :max="5"
                                    input-type="number"
                                    label="服务速度">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="ability"
                                    :isTooltip="true"
                                    :disabled="!shop"
                                    input-type="number"
                                    :min="1"
                                    :max="5"
                                    label="专业能力">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="totalScore"
                                    :disabled="!shop"
                                    :isTooltip="true"
                                    input-type="number"
                                    :min="1"
                                    :max="5"
                                    label="总分">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="evaluation"
                                    :isTooltip="true"
                                    :disabled="!shop"
                                    input-type="input"
                                    label="评价">
                            </ice-editable-table-column>
                            <ice-editable-table-column
                                    prop="description"
                                    :isTooltip="true"
                                    :disabled="!shop"
                                    :fit="true"
                                    input-type="input"
                                    label="处理人信息">
                            </ice-editable-table-column>
                        </ice-editable-table>
                    </el-tab-pane>
                </el-tabs>
            </ice-grid-layout>
        </el-form>
        <!-- 技术服务目录-新增目录弹窗 -->
        <pro-sc-tech-tree ref="ProScTechTree" :is-callback="true" @getData="getData"
                          :regionId="mainData.areaId"></pro-sc-tech-tree>
        <!--  技术服务目录 -- 新增对象弹窗 -->
        <dev-select ref="devSelect" :multiple="true" :on-close-handler.sync="selectOverHandler"
                    :width="dataWidth"></dev-select>
        <!--        参与人信息   新增弹窗     -->
        <el-dialog class="serve"
                   v-dialogDrag
                   title="参与人信息"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="VisiblenewAdd"
                   width="690px"
                   style="max-height: 800px;"
                   append-to-body
                   :close-on-click-modal="false">
            <!--       链接运维组织         -->
            <maintain-menber @selection-change="reject"></maintain-menber>
            <div class="message">
                <el-button class="buttons" type="primary" @click="confirm()">确定</el-button>
                <el-button class="buttons" type="primary" @click="abolish()">取消</el-button>
            </div>
        </el-dialog>
        <!-- 第三方厂商 -->
        <ice-pop-selector
                data-url="pro/ProBaseCoopUnit/list"
                :columns=columnsDept
                mode="hidden"
                text-prop="unitname"
                code-prop="oid"
                @select-confirm="getDept"
                choose-item="multiple"
                ref="deptList"
                :selections="coopUnitVos"
        >
        </ice-pop-selector>
    </div>
</template>

<script>
    import ProScTechTree from "../../../pro/sc/ProScTechTree";
    import bizComm from "../../js/comm";
    import renderer from "../../dev/js/comm/renderer"
    import devComm from "../../dev/js/comm/devComm";
    import deviceManage from "./deviceManage"
    import ProScCommonTechTree from "../../../pro/sc/common/ProScCommonTechTree";
    import ProBaseMaintainMember from "../../../pro/module/ProBaseMaintainMember";
    import IceSelect from '../../../../components/common/base/IceSelect';
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid';
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceTreeGrid from "../../../../components/common/base/IceTreeGrid";
    import proposerMessage from "./proposerMessage";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import MaintainMenber from "./maintainMenber";
    import IceDatamapTranslater from "../../../../components/common/base/IceDatamapTranslater";
    import DevSelect from "../../dev/devSelect";
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    import IceDatePicker from "../../../../components/common/base/IceDatePicker";

    export default {
        name: "disposeMessage",
        mixins: [bizComm, devComm, renderer],
        props: {
            mainData: {
                type: Object,
                /*dataList: Array,
                technologyData: Array,*/
            },
            workTicket: String,
            areaCode: "",
            dataList: Array,
            technologyData: Array,
        },
        data() {
            return {
                KKK: "",
                coopUnitVos: [],
                timeDate: "",
                datas: "",
                data1: "",
                data2: "",
                flagList: "",
                flag5: true,
                url2: "",
                unitnameDataMeeage: [],
                opinionData: "",
                drawData: [],
                head: false,
                catalogId: "",
                dataWidth: "1000px",
                musterData: [],
                selectable: [],
                initQuery_: [],
                initColumns_: null,
                techCataObj: [],
                removeMeeage: [],
                areaId: "",
                party: [],
                First: [],
                selectIds: "",
                shop: false,
                judge: true,
                query: [],
                mainForm: false,
                aclKeyReadonly: false,
                VisibleServe: false,
                VisiblenewAdd: false,
                deviManage: false,
                readonly: false,
                activeName: "second",
                checkedNodeList: "",
                buttons: false,
                tendId: '',
                arrList: [],                     //用于接受选人组件传过来的参数
                operations: [
                    {name: "删除", callback: this.deleteItem},
                ],
                /*进入申请信息*/
                columnsProposerMessage: [
                    {type: 'input', label: '申请编号', code: 'applyCode'},
                    {type: 'input', label: '申请人', code: 'applyerName'},
                    {type: 'input', label: '申请单位', code: 'applyerDepartment'},
                    {type: 'input', label: '申请时间', code: 'applyTime'},
                    {type: 'input', label: '陪同人', code: 'companionName'},
                    {type: 'input', label: '申请进入部位', code: 'inLocation'},
                    {type: 'input', label: '状态', code: 'state'},
                ],
                /*工单操作记录*/
                columnsFirst: [
                    {label: '操作类型', code: 'operationType', mapTypeCode: 'operationType'},
                    {label: '原因', code: 'reason', mapTypeCode: 'sendBackReason'},
                    {label: '说明', code: 'detail'},
                    {label: '操作人', code: 'creatorName'},
                    {label: '操作时间', code: 'gmtCreate'}
                ],
                queryFirst: [
                    {
                        type: 'static', code: "workTicket", exp: '=', value: () => {
                            return this.mainData.workTicket
                        }
                    }
                ],
                /*当前工单关联变更单*/
                columnsCurrentWork: [
                    {type: 'input', label: '变更单号', code: 'shiftTicket'},
                    {type: 'input', label: '变更类型', code: 'shiftType'},
                    {type: 'input', label: '变更状态', code: 'statusName'},
                ],
                currentWork: [
                    {
                        type: 'static', code: "workTicket", exp: '=', value: () => {
                            return this.mainData.workTicket
                        }
                    }
                ],
                /*服务单关联的变更单信息*/
                columnsTicketList: [
                    {label: '转变更的工单号', code: 'workTicket'},
                    {label: '变更单号', code: 'shiftTicket'},
                    {label: '变更类型', code: 'shiftType'},
                    {label: '变更状态', code: 'statusName'},
                ],
                currenList: [
                    {
                        type: 'static', code: "workTicket", exp: '=', value: () => {
                            return this.mainData.workTicket
                        }
                    }
                ],
                /*第三方厂商--添加列表*/
                columnsDept: [
                    {label: '第三方厂商', code: 'unitname'},
                    {label: '第三方厂商Code', code: 'unitcode', hidden: true},
                    {label: '企业性质', code: 'quality', mapTypeCode: "PRO_QUALITY"},
                ],
                formRules: {
                    "num": [{required: true, message: '请输入数量', trigger: 'change'}],
                    "serviceWay": [{required: true, message: '请输入服务方式', trigger: 'blur'}],
                    "mainData.gmtBegin": [{required: true, message: '请输入开始时间', trigger: 'blur'}],
                    "gmtEnd": [{required: true, message: '完成处理时间不能在开始时间之前', trigger: 'blur'}],
                    "resolveStatus": [{required: true, message: '请输入解决状态', trigger: 'blur'}],
                    "reason": [{required: true, message: '请输入事件起因', trigger: 'blur'}],
                    "measure": [{required: true, message: '请输入处理过程', trigger: 'blur'}],
                },
                /*参与人信息校验字段*/
                formMeeage: {
                    "contribution": [{
                        required: true,
                        type: 'integer',
                        message: '请输入贡献度',
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "matter": [{required: true, message: '请输入参与事项', trigger: 'blur'}],
                    "operation": [{required: true, message: '请输入操作内容', trigger: 'blur'}],
                },
                /*技术服务目录校验字段*/
                formTechnologyDe: {
                    "operateContent": [{required: true, message: '请输入操作内容', trigger: 'blur'}],
                    "operateDate": [{
                        required: true,
                        type: 'date',
                        message: '请输入操作时间',
                        repeatable: true,
                        trigger: 'change'
                    }],
                },
                /*第三方厂商*/
                formThirdparty: {
                    "responseSpeed": [{
                        required: true,
                        type: 'integer',
                        message: "请输入响应速度",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "disposeSpeed": [{
                        required: true,
                        type: 'integer',
                        message: '请输入处理速度',
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "servSpeed": [{
                        required: true,
                        type: 'integer',
                        message: '请输入服务速度',
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "ability": [{
                        required: true,
                        type: 'integer',
                        message: '请输入专业能力',
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "totalScore": [{
                        required: true,
                        type: 'integer',
                        message: '请输入总分',
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "evaluation": [{required: true, message: '请输入评价', trigger: 'blur'}],
                    "description": [{required: true, message: '请输入处理人信息', trigger: 'blur'}],
                }
            }
        },
        methods: {
            stopTimeFilter(time) {
                if (!this.mainData.gmtEnd) {
                    return true
                }
                return time < new Date(this.mainData.gmtEnd)
            },
            startTimeFilter(time) {
                if (!this.mainData.gmtBegin) {
                    return true
                }
                return time > new Date(this.mainData.gmtBegin)
            },
            timeChange() {
                if (this.mainData.gmtEnd && this.mainData.gmtBegin && this.mainData.gmtBegin > this.mainData.gmtEnd) {
                    this.$message.warning("完成处理时间不能小于开始处理时间");
                    this.mainData.gmtEnd = "";
                }
            },
            /*服务目录传过来的数据*/
            getData(data) {
                let arr = [];
                this.arrList = data;
                if (!this.mainData.technologyData) {
                    this.mainData.technologyData = [];
                }
                arr = this.distinctItem(this.mainData.technologyData, this.arrList);
                arr.forEach(item => {
                    item.shortname = item.areaName;
                    item.parentName = item.bigCategoryName;
                    item.techCategoryName = item.categoryName;
                    item.techSname = item.name;
                    item.catalogId = item.techId;
                    this.mainData.technologyData.push(item);
                });
            },
            /*添加第三方厂商的数据*/
            getDept(list) {
                this.mainData.coopUnitVos = list;
                this.filtrate();
            },
            /*第三方厂商列表选中的信息*/
            unitnameMeeage(data) {
                this.unitnameDataMeeage = data;
            },
            /*第三方厂商新增*/
            thirdpartyNewAdd() {
                this.coopUnitVos = this.mainData.coopUnitVos;
                this.$refs.deptList.openDialog();
            },
            /*第三方厂商删除*/
            thirdpartydelMeeage() {
                if (this.unitnameDataMeeage.length !== 0) {
                    this.$confirm("是否确定删除?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.unitnameDataMeeage.length; i++) {
                            if (this.unitnameDataMeeage !== "") {
                                this.mainData.coopUnitVos.remove(this.unitnameDataMeeage[i])
                            }
                        }
                    })
                } else {
                    this.$confirm("请选择要删除的目录?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /*点击tab刷新*/
            handleClick(tab, event) {
                if (this.activeName == "first") {
                    if (this.flag5) {
                        this.url2 = 'biz/ProEvtWorkTicketLog/list';
                        this.queryFirst = [
                            {
                                type: 'static', code: "workTicket", exp: '=', value: () => {
                                    return this.mainData.workTicket
                                }
                            }
                        ];
                        this.flag5 = !this.flag5;
                    } else {
                        this.$refs.gridsFirst.refresh();
                    }
                } else if (this.activeName == "currentWork") {
                    this.$refs.gridsWork.refresh();
                } else if (this.activeName == "serviceMessage") {
                    this.$refs.umnGrid.refresh();
                } else if (this.activeName == "party") {
                    this.$emit("change", "estimate");
                } else if (this.activeName == "second") {
                    this.$emit("changeRefurbish", "technology");
                } else if (this.activeName == "thirdparty") {
                    this.$emit("refurbish", "thirdparty");
                }
            },
            /* 校验填写内容 */
            isTrue() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.isTrueValue = true;
                        return true
                    } else {
                        this.isTrueValue = false;
                        return false
                    }
                });
            },
            getIsTrue() {
                this.techCataObj = this.mainData;
                this.techCataObj.technologyData = this.mainData.technologyData;
                this.$emit("saveMeeage", this.techCataObj);
                return this.isTrueValue;
            },
            /*删除目录*/
            deleteCata() {
                if (this.selectable.length !== 0) {
                    this.$confirm("是否确定删除?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.selectable.length; i++) {
                            if (this.selectable !== "") {
                                this.mainData.technologyData.remove(this.selectable[i])
                            }
                        }
                    })
                } else {
                    this.$confirm("请选择要删除的目录?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /*删除对象*/
            deleteObject() {
                let _this = this;
                if (_this.selectable.length !== 0) {
                    _this.$confirm("是否确定删除?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < _this.selectable.length; i++) {
                            if (_this.selectable != "") {
                                let suspendData = [];
                                _this.suspendData = _this.selectable;
                                _this.suspendData[i].devName = "";
                                _this.mainData.technologyData.push(_this.suspendData);
                                _this.mainData.technologyData.remove(_this.selectable);
                            }
                        }
                    })
                } else {
                    this.$confirm("请选择要删除的目录?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /*技术服务目录新增目录*/
            addCata() {
                this.catalogId = this.mainData.catalogId;
                this.$refs.ProScTechTree.openDialog(this.catalogId);
            },
            /* 技术服务选中信息 */
            technologyMeeage(data) {
                this.selectable = data;
            },
            /*技术服务目录--新增对象*/
            addObject() {
                if (this.selectable.length == 1) {
                    this.$refs.devSelect.openDialog();
                } else {
                    this.$confirm("请选择一条服务目录?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /* 新增对象传过来的数据 */
            selectOverHandler(data) {
                let _this = this;
                _this.musterData = [];
                return new Promise((resolve, reject) => {
                    let obj = {};
                    let arr = [];
                    let objDataList = [];
                    let oneData = [];
                    Object.assign(obj, _this.selectable[0]);
                    if (data.length == 1 && !_this.selectable[0].devName) {
                        /*Object.assign(oneData,obj);*/
                        obj.devName = data[0].name;
                        obj.devId = data[0].oid;
                        _this.mainData.technologyData.push(obj);
                        _this.mainData.technologyData.remove(_this.selectable[0]);
                    } else if (data.length > 1 && !_this.selectable[0].devName) {
                        for (let i = 0; i < data.length; i++) {
                            let objItem = {};
                            let arr = [];
                            this.arrList = objItem;
                            Object.assign(objItem, obj);
                            objItem.devName = data[i].name;
                            objItem.devId = data[i].oid;
                            _this.mainData.technologyData.push(objItem);
                            _this.mainData.technologyData.remove(_this.selectable[0]);
                        }
                    } else if (data.length > 0 && _this.selectable[0].devName) {
                        Object.assign(objDataList, _this.mainData.technologyData);
                        for (let c = 0; c < data.length; c++) {
                            let objData = {};
                            Object.assign(objData, obj);
                            objData.devName = data[c].name;
                            objData.devId = data[c].oid;
                            _this.musterData.push(objData);
                        }
                        /*objDataList.forEach(item=>{
                            delete item.operation;
                            delete item.gmtCreate;
                            delete item.manual;
                        });*/
                        for (let j = 0; j < _this.musterData.length; j++) {
                            let flag = true;
                            for (let a = 0; a < objDataList.length; a++) {
                                if ((objDataList[a].parentName == _this.musterData[j].parentName &&
                                    objDataList[a].techCategoryName == _this.musterData[j].techCategoryName &&
                                    objDataList[a].techSname == _this.musterData[j].techSname) &&
                                    objDataList[a].devName == _this.musterData[j].devName) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                arr.push(_this.musterData[j]);
                            }
                        }
                        for (let e = 0; e < arr.length; e++) {
                            _this.mainData.technologyData.push(arr[e]);
                        }
                    }
                    this.$nextTick(() => {
                        resolve();
                    });
                });
            },
            /*根据工单状态判断是否可编辑*/
            refresh(data) {
                this.mainData.workTicket = data.workTicket;
                this.mainData.status = data.status;
                this.opinionData = data.opinionData;
                if (this.mainData.status == "1") {
                    if (this.opinionData !== "1") {
                        this.buttons = {
                            buttonsProposerMessage: [
                                {
                                    name: '添加', callback: () => {
                                        this.addMessage();
                                        this.VisibleaddMessage = true;
                                    }
                                },
                                {name: "删除", callback: this.delete()},
                            ],
                        };
                        this.judge = false;
                        this.shop = true;
                    }
                }
            },
            /*数据修改页面判断是修改还是查看*/
            lookChange(data) {
                if (data == "change") {
                    this.shop = true;
                    this.judge = false;
                } else {
                    this.judge = true;
                    this.shop = false;
                }
            },
            reject(rows) {
                this.arrList = rows;
            },
            addMessage() {
                this.VisibleaddMessage = true
            },
            /* 参与人 添加*/
            newAdd() {
                this.VisiblenewAdd = true;
            },
            /*参与人信息-选中的信息*/
            actorMeeage(selection) {
                this.removeMeeage = selection
            },
            /*批量删除参与人信息*/
            delMeeage() {
                console.log(this.mainData.dataList);
                if (this.removeMeeage.length !== 0) {
                    this.$confirm("是否确定删除?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.removeMeeage.length; i++) {
                            if (this.removeMeeage !== "") {
                                this.mainData.dataList.remove(this.removeMeeage[i])
                            }
                        }
                        /* _this.deleteMore(_this.mainData.dataList,_this.removeMeeage);*/
                    })
                } else {
                    this.$confirm("请选择要删除的信息?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }

            },
            messageItem(rowdata) {
                this.rowItem = rowdata[0];
            },
            delete() {
            },

            /**
             * 数组去重
             */
            distinctItem(arrList, targetList) {
                let arr = [];
                for (let i = 0; i < targetList.length; i++) {
                    if (arrList && arrList.indexOf(targetList[i]) == -1) {
                        arr.push(targetList[i]);
                    }
                }
                return arr;
            },
            confirm() {
                this.VisiblenewAdd = false;
                let arr = [];
                if (!this.mainData.dataList) {
                    this.mainData.dataList = [];
                }
                arr = this.distinctItem(this.mainData.dataList, this.arrList);
                arr.forEach(item => {
                    this.mainData.dataList.push(item);
                    item.engineerName = item.username;
                    item.engineercode = item.usercode;
                });
                this.$emit("change", "estimate");
            },
            /*参与人信息 取消*/
            abolish() {
                this.VisiblenewAdd = false;
            },
            /*企业性质遍历*/
            filtrate() {
                if (this.mainData.coopUnitVos && this.mainData.coopUnitVos.length > 0) {
                    for (let i = 0; i < this.mainData.coopUnitVos.length; i++) {
                        if (this.mainData.coopUnitVos[i].quality == 0) {
                            this.mainData.coopUnitVos[i].quality = "军工单位"
                        } else if (this.mainData.coopUnitVos[i].quality == 1) {
                            this.mainData.coopUnitVos[i].quality = "政府部门"
                        } else if (this.mainData.coopUnitVos[i].quality == 2) {
                            this.mainData.coopUnitVos[i].quality = "企事业单位"
                        } else {
                            this.mainData.coopUnitVos[i].quality = "其他"
                        }
                    }
                }
            },
            /**处置时长调用接口*/
            async handleF() {
                this.mainData.handleTime = this.KKK;
            }
        },
        watch: {
            "mainData.gmtEnd": function (nowVal, oldVal) {
                if (this.mainData.gmtBegin != null && this.mainData.gmtEnd != null) {
                    this.$axios.post("biz/ProEvtWorkTicket/calculateDate", {
                        endDate: this.mainData.gmtEnd,
                        startDate: this.mainData.gmtBegin
                    }).then(result => {
                        this.KKK = result.data;
                        this.$nextTick(() => {
                            this.handleF();
                        })
                    })
                }
            }
        },
        mounted() {
            if (this.mainData.gmtBegin != "" && this.mainData.gmtEnd != "") {
                this.handleF();
            }
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE, this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE),
                this.requestCategoryData(),
                this.requestCommStateData()
            ];
            Promise.all(prepareTaskChain).then(res => {
            });
            this.filtrate();
        },
        components: {
            IceDatePicker,
            IcePopSelector,
            DevSelect,
            IceDatamapTranslater,
            MaintainMenber,
            IceEditableTableColumn,
            IceDialog,
            proposerMessage,
            IceTreeGrid,
            IceEditableTable,
            IceSelect,
            IceQueryGrid,
            IceGridLayout,
            ProBaseMaintainMember,
            ProScCommonTechTree,
            deviceManage,
            devComm,
            bizComm,
            renderer,
            ProScTechTree
        }

    }
</script>

<style scoped>
    .buttons {
        margin-bottom: 9px;
    }

    .top {
        padding-left: 15px;
    }

    .message {
        margin-left: 300px;
    }

    .buttons-min {
        margin-top: 9px;
        color: #FFFFFF;
        background-color: #0091B0;
        border-color: #0091B0;
        margin-bottom: 9px;
    }
</style>