<template>
    <div class="form">
        <el-form :model="workForm" :rules="formRules" ref="form">
            <ice-grid-layout :columns="3" name="处理信息">
                <el-form-item label="工单号:" label-width="115px" prop="proEvtUserTicket.workTicket">
                    <el-input v-model="workForm.proEvtUserTicket.serviceTicket" v-show="false"></el-input>
                    <el-input v-model="workForm.proEvtUserTicket.engineerCode" v-show="false"></el-input>
                    <el-input v-model="workForm.proEvtUserTicket.workTicket" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="工单状态:" label-width="115px" prop="proEvtUserTicket.workStatus">
                    <ice-select v-model="workForm.proEvtUserTicket.status"
                                map-type-code="workStatus"
                                :disabled="true"></ice-select>
                </el-form-item>
                <el-form-item label="服务方式:" label-width="115px" prop="proEvtUserTicket.serviceWay">
                    <ice-select
                            v-model="workForm.proEvtUserTicket.serviceWay"
                            @change="$nextTick(()=>{$refs.form.validateField('serviceWay',error=>{})})"
                            map-type-code="serviceWay">
                    </ice-select>
                </el-form-item>
                <el-form-item label="工程师角色:" label-width="115px" prop="proEvtUserTicket.engineerRole">
                    <ice-select value="请选择" v-model="workForm.proEvtUserTicket.engineerRole"
                                map-type-code="engineerRole"></ice-select>
                </el-form-item>
                <el-form-item label="工程师姓名:" label-width="115px" prop="proEvtUserTicket.engineerName">
                    <el-input v-model="workForm.proEvtUserTicket.engineerName" readonly>
                        <el-button slot="append"
                                   icon="el-icon-more" @click="addEngineer"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item label="开始处理时间:" label-width="115px" prop="proEvtUserTicket.gmtBegin">
                    <el-date-picker v-model="workForm.proEvtUserTicket.gmtBegin"
                                    @change="changeGmtBegin"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    type="datetime" :readonly="readonly"
                                    default-time></el-date-picker>
                </el-form-item>
                <el-form-item label="完成处理时间:" label-width="115px" prop="proEvtUserTicket.gmtEnd">
                    <el-date-picker v-model="workForm.proEvtUserTicket.gmtEnd" :readonly="readonly"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                    default-time></el-date-picker>
                </el-form-item>
                <el-form-item label="解决状态:" label-width="115px" prop="proEvtUserTicket.resolveStatus">
                    <ice-select placeholder="请选择.."
                                v-model="workForm.proEvtUserTicket.resolveStatus" map-type-code="resolveStatus"
                                @change="$nextTick(()=>{$refs.form.validateField('resolveStatus',error=>{})})">
                    </ice-select>
                </el-form-item>
                <el-form-item label="事件起因:" label-width="115px" prop="proEvtUserTicket.reason"><!--reason-->
                    <ice-select placeholder="请选择.."
                                v-model="workForm.proEvtUserTicket.reason" map-type-code="eventCause"
                                @change="$nextTick(()=>{$refs.form.validateField('reason',error=>{})})">
                    </ice-select>
                </el-form-item>
                <el-form-item label="处理过程:" label-width="115px" prop="proEvtUserTicket.measure" layout="3"
                              style="min-height: 40px">
                    <el-input v-model="workForm.proEvtUserTicket.measure" type="textarea" :readonly="readonly" rows="6"
                              class="textarea"></el-input>
                </el-form-item>
                <el-form-item layout="3">
                    <el-tabs style="max-height: 500px;overflow: hidden" v-model="activeName" @tab-click="handleClick">
                        <el-tab-pane label="技术服务目录信息" name="second" value="1" width=100%>
                            <div class="top">
                                <el-button class="buttons" @click="addCata()">新增服务项</el-button>
                                <el-button class="buttons" @click="addObject()">新增对象</el-button>
                                <el-button class="buttons" @click="deleteCata()">删除服务项</el-button>
                                <el-button class="buttons" @click="deleteObject()">删除对象</el-button>
                            </div>
                            <div style="width: 100%">
                                <ice-editable-table
                                        :rules="formTechnologyDe"
                                        @selection-change="technologyMeeage"
                                        :height="450"
                                        :data="technologyData"
                                        :fit="true"
                                        :width="null">
                                    <el-table-column type="selection"></el-table-column>
                                    <ice-editable-table-column
                                            prop="deptName"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="区域">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="shortname"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="服务大类">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="categoryName"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="服务名称">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="sname"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="服务项">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="manual"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="技术手册">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="devName"
                                            :width="100"
                                            input-type="input"
                                            :disabled="true"
                                            label="服务对象">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="operation"
                                            :width="180"
                                            input-type="input"
                                            label="操作内容">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column
                                            prop="gmtCreate"
                                            min-width="220px"
                                            :fit="true"
                                            :width="null"
                                            input-type="date"
                                            date-type="datetime"
                                            date-format="yyyy-MM-dd HH:mm:ss"
                                            label="操作时间">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="参与人信息" name="party">
                            <div class="top">
                                <el-button class="buttons" @click="newAdd()">新增</el-button>
                                <el-button class="buttons" @click="delMeeage()">删除</el-button>
                            </div>
                            <ice-editable-table
                                    :rules="formMeeage"
                                    @selection-change="actorMeeage"
                                    :height="450"
                                    :fit="true"
                                    :width="null"
                                    :data="workForm.ProEvtEngineer"
                                    ref="gridPar">
                                <el-table-column type="selection"></el-table-column>
                                <ice-editable-table-column
                                        prop="engineerName"
                                        :width="250"
                                        :disabled="true"
                                        label="参与人">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="contribution"
                                        input-type="number"
                                        :width="250"
                                        :min="1"
                                        :max="99"
                                        label="贡献度（%）">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="matter"
                                        :width="250"
                                        input-type="input"
                                        maxlength="64"
                                        label="参与事项">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="operation"
                                        min-width="220px"
                                        :fit="true"
                                        :width="null"
                                        input-type="input"
                                        maxlength="64"
                                        label="操作内容">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        v-if="false"
                                        prop="userCode"
                                        min-width="220px"
                                        :fit="true"
                                        :width="null"
                                        input-type="input"
                                        maxlength="64"
                                        label="操作内容">
                                </ice-editable-table-column>
                                <!--<ice-editable-table-column prop="userCode"></ice-editable-table-column>-->
                            </ice-editable-table>
                        </el-tab-pane>
                        <el-tab-pane label="进入申请信息" name="proposerMessage" value="5">
                            <ice-query-grid
                                    :columns="columnsProposerMessage"
                                    :pagination="false"
                                    :buttons="buttons">
                            </ice-query-grid>
                        </el-tab-pane>
                        <el-tab-pane label="第三方厂商" name="thirdparty" value="6">
                            <div class="top">
                                <el-button class="buttons" @click="thirdpartyNewAdd()">新增</el-button>
                                <el-button class="buttons" @click="thirdpartydelMeeage()">删除</el-button>
                            </div>
                            <ice-editable-table :data="unitnameData"
                                                @selection-change="unitnameMeeage"
                                                :height="450"
                                                :fit="true"
                                                :width="null"
                                                :rules="formThirdparty">
                                <el-table-column type="selection"></el-table-column>
                                <el-table-column
                                        prop="unitname"
                                        :width="100"
                                        input-type="input"
                                        :disabled="true"
                                        label="第三方厂商">
                                </el-table-column>
                                <ice-editable-table-column
                                        prop="quality"
                                        input-type="input"
                                        :disabled="true"
                                        :width="100"
                                        label="企业性质">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="responseSpeed"
                                        :width="120"
                                        input-type="number"
                                        maxlength="64"
                                        :min="1"
                                        :max="5"
                                        label="响应速度">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="disposeSpeed"
                                        :width="120"
                                        :min="1"
                                        :max="5"
                                        input-type="number"
                                        label="处理速度">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="servSpeed"
                                        :width="120"
                                        :min="1"
                                        :max="5"
                                        input-type="number"
                                        label="服务速度">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="ability"
                                        :width="120"
                                        :min="1"
                                        :max="5"
                                        input-type="number"
                                        label="专业能力">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="totalScore"
                                        :width="120"
                                        :min="1"
                                        :max="5"
                                        input-type="number"
                                        label="总分">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="evaluation"
                                        :width="100"
                                        input-type="input"
                                        label="评价">
                                </ice-editable-table-column>
                                <ice-editable-table-column
                                        prop="contacterInfos"
                                        :fit="true"
                                        :width="null"
                                        input-type="input"
                                        label="处理人信息">
                                </ice-editable-table-column>
                            </ice-editable-table>
                        </el-tab-pane>
                    </el-tabs>
                </el-form-item>
            </ice-grid-layout>
        </el-form><!-- style="max-height: 500px;" -->
        <!-- 技术服务目录-新增目录弹窗 -->
        <pro-sc-tech-tree ref="ProScTechTree" :is-callback="true" @getData="getData"
                          :regionId="this.number.areaId"></pro-sc-tech-tree>
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
                <el-button class="buttons-min" @click="confirm()">确定</el-button>
                <el-button class="buttons-min" @click="abolish()">取消</el-button>
            </div>
        </el-dialog>
        <!-- 工程师人员选择 -->
        <ice-pop-selector
                :grid-data="Num"
                :columns="columnsPeople"
                code-prop="usercode"
                text-prop="username"
                mode="hidden"
                @select-confirm="getEngineer"
                :pagination="false"
                choose-item="single"
                ref="memberList">
        </ice-pop-selector>
        <!--  第三方厂商 -->
        <ice-pop-selector
                data-url="pro/ProBaseCoopUnit/list"
                :columns=columnsDept
                mode="hidden"
                text-prop="unitname"
                code-prop="oid"
                :pagination="false"
                @select-confirm="getDept"
                choose-item="multiple"
                ref="deptList">
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
    import bus from "./bus.js"
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";

    export default {name: "disposeMessage",
        mixins: [bizComm, devComm, renderer],
        props: {
            workForm: {},
            number: {},
            clickNum: Number,
            lookNum: String
        },
        data() {
            return {
                unitnameDataMeeage: [],
                technologyData: [],
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
                selectIds: "",
                query: [],
                mainForm: false,
                aclKeyReadonly: false,
                VisibleServe: false,
                VisiblenewAdd: false,
                deviManage: false,
                readonly: false,
                activeName: "second",
                checkedNodeList: "",
                tendId: '',
                arrList: [],                     //用于接受选人组件传过来的参数
                unitnameData: [],
                Num: [],
                nowValue: "",
                operations: [
                    {name: "删除", callback: this.deleteItem},
                ],
                /*工程师*/
                columnsPeople: [
                    {code: 'tendId', hidden: true},
                    {code: 'unitCode', hidden: true},
                    {code: 'usercode', hidden: true},
                    {code: 'isCoop', hidden: true},
                    {label: '工程师', code: 'username'},
                    {label: '单位', code: 'unitname'}
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
                buttons: [
                    {
                        name: '添加', type: 'primary',
                    },
                    {
                        name: '删除', type: 'primary',
                    },
                ],
                /*第三方厂商*/
                /* columnsThirdparty:[
                     {label: '申请编号', code: 'applyCode'},
                     {label: '企业性质', code: 'quality'},
                     {label: '响应速度', code: 'responseSpeed'},
                     {label: '服务速度', code: 'disposeSpeed'},
                     {label: '专业能力', code: 'ability'},
                     {label: '总分', code: 'totalScore'},
                     {label: '评价', code: 'evaluation'},
                     {label: '处理人信息', code: 'contacterInfos'},
                     {label: '操作', code: 'operation'},
                 ],*/
                /*第三方厂商--新增初始值*/
                columnsDept: [
                    {label: '第三方厂商', code: 'unitname'},
                    {label: '企业性质', code: 'quality', mapTypeCode: "PRO_QUALITY"},
                ],
                /* 第三方厂商校验 */
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
                        message: "请输入处理速度",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "servSpeed": [{
                        required: true,
                        type: 'integer',
                        message: "请输入服务速度",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "ability": [{
                        required: true,
                        type: 'integer',
                        message: "请输入专业能力",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "totalScore": [{
                        required: true,
                        type: 'integer',
                        message: "请输入总分",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "evaluation": [{required: true, message: '请输入评价', trigger: 'blur'}],
                    "contacterInfos": [{required: true, message: '请输入处理人信息', trigger: 'blur'}],
                },

                formRules: {
                    "proEvtUserTicket.serviceWay": [{required: true, message: '请输入服务方式', trigger: 'blur'}],
                    "proEvtUserTicket.gmtBegin": [{required: true, message: '请输入开始处理时间', trigger: 'blur'}],
                    "proEvtUserTicket.gmtEnd": [{required: true, message: '请输入完成处理时间', trigger: 'blur'}],
                    "proEvtUserTicket.resolveStatus": [{required: true, message: '请输入解决状态', trigger: 'blur'}],
                    "proEvtUserTicket.measure": [{required: true, message: '请输入处理过程', trigger: 'blur'}],
                    "proEvtUserTicket.engineerRole": [{required: true, message: "请选择工程师角色", trigger: 'blur'}],
                    "proEvtUserTicket.engineerName": [{required: true, message: "请选择工程师姓名", trigger: 'blur'}],
                    "proEvtUserTicket.reason": [{required: true, message: "请选择事件起因", trigger: 'blur'}],
                },
                formMeeage: {
                    contribution: [{
                        required: true,
                        type: 'integer',
                        message: "请输入贡献度",
                        repeatable: true,
                        trigger: 'change'
                    }],
                    "matter": [{required: true, message: '请输入参与事项', trigger: 'blur'}],
                    "operation": [{required: true, message: '请输入操作内容', trigger: 'blur'}],
                },
                formTechnologyDe: {
                    "operation": [{required: true, message: '请输入操作内容', trigger: 'blur'}],
                }
            }
        },
        methods: {
            /**数据清除*/
            delData() {
                this.technologyData = [];
                this.workForm.ProEvtEngineer = [];
                this.unitnameData = [];
                this.$refs.form.resetFields();
            },
            /**时间过滤*/
            timeFilter(time) {
                if (time < new Date(this.workForm.proEvtUserTicket.gmtBegin)) {
                    return true
                }
                return false;
            },
            changeGmtBegin() {
                if (new Date(this.workForm.proEvtUserTicket.gmtBegin) > new Date(this.workForm.proEvtUserTicket.gmtEnd)) {
                    this.workForm.proEvtUserTicket.gmtEnd = '';
                }
            },
            /*刷新form*/
            /* refreshForm() {
                 this.$refs.form.resetFields();
             },*/
            /*form必填校验*/
            formIsTrue() {
                let flag = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            /**
             * 获取选中工程师数据并渲染
             * */
            getEngineer(list, texts, values) {
                this.workForm.proEvtUserTicket.engineerName = list[0].username;
                this.workForm.proEvtUserTicket.engineerCode = list[0].usercode;
            },
            addEngineer() {
                if (this.workForm.proEvtUserTicket.engineerRole == "" || this.workForm.proEvtUserTicket.engineerRole == "请选择" || this.workForm.proEvtUserTicket.engineerRole == null) {
                    this.$confirm('请先选择工程师线数！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$axios.get('pro/ProBaseMaintainGroup/getId', {
                        params: {
                            areaId: this.number.areaId,
                            tendCode: this.nowValue
                        }
                    }).then(result => {
                        this.$axios.get('pro/ProBaseMaintainMember/getId', {params: {tendId: result.data[0].oid}}).then(result => {
                            this.Num = result.data;
                            this.$refs.memberList.openDialog();
                        })
                    });
                }
            },
            /*服务目录传过来的数据*/
            getData(data) {
                let arr = [];
                this.arrList = data;
                if (!this.workForm.proEvtUserTicket.technologyData) {
                    this.workForm.proEvtUserTicket.technologyData = [];
                }
                let arrList = [];
                Object.assign(arrList, this.technologyData);
                arr = this.distinctItem(this.workForm.proEvtUserTicket.technologyData, this.arrList);
                arr.forEach(item => {
                    item.shortname = item.areaName;
                    item.catalogName = item.name;
                    item.sname = item.catalogName;
                    item.deptName = item.areaName;
                    arrList.push(item);
                });
                this.workForm.proEvtUserTicket.technologyData = [];
                this.workForm.proEvtUserTicket.technologyData = arrList;
                this.technologyData = [];
                this.technologyData = arrList;

            },
            /*添加第三方厂商的数据*/
            getDept(list) {
                this.workForm.unitnameData = list;
                let arr = [];
                for (let i = 0; i < this.workForm.unitnameData.length; i++) {
                    if (this.workForm.unitnameData[i].quality == 0) {
                        this.workForm.unitnameData[i].quality = "军工单位"
                    } else if (this.workForm.unitnameData[i].quality == 1) {
                        this.workForm.unitnameData[i].quality = "政府部门"
                    } else if (this.workForm.unitnameData[i].quality == 2) {
                        this.workForm.unitnameData[i].quality = "企事业单位"
                    } else {
                        this.workForm.unitnameData[i].quality = "其他"
                    }
                }
                Object.assign(arr, this.workForm.unitnameData);
                this.unitnameData = [];
                this.unitnameData = arr;
            },
            /*第三方厂商列表选中的信息*/
            unitnameMeeage(data) {
                this.unitnameDataMeeage = data;
            },
            /*第三方厂商新增*/
            thirdpartyNewAdd() {
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
                                this.workForm.unitnameData.remove(this.unitnameDataMeeage[i]);
                                this.unitnameData.remove(this.unitnameDataMeeage[i]);
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
                if (this.activeName == "party") {
                    this.$emit("change", "estimate");
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
                this.techCataObj.push(this.workForm.proEvtUserTicket);
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
                                this.workForm.proEvtUserTicket.technologyData.remove(this.selectable[i])
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
                                _this.workForm.proEvtUserTicket.technologyData.push(_this.suspendData);
                                _this.workForm.proEvtUserTicket.technologyData.remove(_this.selectable);
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
                this.$refs.ProScTechTree.openDialog(this.number.templateId);
            },
            /* 技术服务选中信息 */
            technologyMeeage(data) {
                this.selectable = data;
            },
            /*技术服务目录--新增对象*/
            addObject() {
                if (this.selectable.length == 1) {
                    this.$nextTick(() => {
                        this.$refs.devSelect.openDialog();
                    });
                } else {
                    this.$confirm("请选择一条数据进行新增！", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    })
                }
            },
            /* 新增对象传过来的数据 */
            selectOverHandler(data) {
                let _this = this;
                this.musterData = [];
                return new Promise((resolve, reject) => {
                    let obj = {};
                    let arr = [];
                    let oneData = [];
                    Object.assign(obj, _this.selectable[0]);
                    if (data.length == 1 && !_this.selectable[0].devName) {
                        /*Object.assign(oneData,obj);*/
                        obj.devName = data[0].name;
                        obj.devId = data[0].oid;
                        _this.workForm.proEvtUserTicket.technologyData.push(obj);
                        _this.workForm.proEvtUserTicket.technologyData.remove(_this.selectable[0]);
                    } else if (data.length > 1 && !_this.selectable[0].devName) {
                        for (let i = 0; i < data.length; i++) {
                            let objItem = {};
                            let arr = [];
                            this.arrList = objItem;
                            Object.assign(objItem, obj);
                            objItem.devName = data[i].name;
                            objItem.devId = data[i].oid;
                            _this.workForm.proEvtUserTicket.technologyData.push(objItem);
                            _this.workForm.proEvtUserTicket.technologyData.remove(_this.selectable[0]);
                        }
                    } else if (data.length > 0 && _this.selectable[0].devName) {
                        let objDataList = [];
                        Object.assign(objDataList, _this.workForm.proEvtUserTicket.technologyData);
                        for (let c = 0; c < data.length; c++) {
                            let objData = {};
                            Object.assign(objData, obj);
                            objData.devName = data[c].name;
                            objData.devId = data[c].oid;
                            _this.workForm.proEvtUserTicket.technologyData.push(objData);
                        }
                        for (let a = 0; a < objDataList.length; a++) {
                            for (let j = 0; j < _this.workForm.proEvtUserTicket.technologyData.length; j++) {
                                if (JSON.stringify(objDataList[a]) == JSON.stringify(_this.workForm.proEvtUserTicket.technologyData[j])) {
                                    delete objDataList[a];
                                    delete _this.workForm.proEvtUserTicket.technologyData[j];
                                }
                            }
                        }
                    }
                    this.$nextTick(() => {
                        resolve();
                    });
                });
            },
            /*根据工单状态判断是否可编辑*/
            refresh(data) {
                this.workForm.proEvtUserTicket.workTicket = data[0];
                this.workForm.proEvtUserTicket.workStatus = data[1];
                if (this.workForm.proEvtUserTicket.workStatus.status == "1") {
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
                if (this.removeMeeage.length !== 0) {
                    this.$confirm("是否确定删除?", "提示", {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.removeMeeage.length; i++) {
                            if (this.removeMeeage !== "") {
                                this.workForm.ProEvtEngineer.remove(this.removeMeeage[i]);
                            }
                        }
                        /* _this.deleteMore(_this.workForm.proEvtUserTicket.ProEvtEngineer,_this.removeMeeage);*/
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
                if (!this.workForm.ProEvtEngineer) {
                    this.workForm.ProEvtEngineer = [];
                }
                arr = this.distinctItem(this.workForm.ProEvtEngineer, this.arrList);
                arr.forEach(item => {
                    this.workForm.ProEvtEngineer.push(item);
                    item.engineerName = item.username;
                });
            },
            /*参与人信息 取消*/
            abolish() {
                this.VisiblenewAdd = false;
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE, this.ENUMS.DATA_DICTIONARY.FUNDS_SOURCE.CODE),
                this.requestCategoryData(),
                this.requestCommStateData()
            ];
            Promise.all(prepareTaskChain).then(res => {
            });
            this.workForm.proEvtUserTicket.serviceTicket = this.number.serviceTicket;
            this.workForm.proEvtUserTicket.workTicket = this.number.serviceTicket + "_0" + this.clickNum;
        },
        created() {
            this.workForm.proEvtUserTicket.serviceTicket = this.number.serviceTicket;
            this.workForm.proEvtUserTicket.workTicket = this.number.serviceTicket + "_0" + this.clickNum;
        },
        watch: {
            clickNum(nowVal) {
                if (nowVal < 10) {
                    nowVal = "0" + nowVal;
                    this.workForm.proEvtUserTicket.workTicket = this.number.serviceTicket + "_" + nowVal
                } else {
                    nowVal = nowVal;
                    this.workForm.proEvtUserTicket.workTicket = this.number.serviceTicket + "_" + nowVal
                }
            },
            "workForm.proEvtUserTicket.engineerRole": function (nowVal, oldVal) {
                this.nowValue = nowVal;
            },
            "workForm.proEvtUserTicket.engineerName": function (nowVal, oldVal) {
                this.$refs.form.clearValidate("proEvtUserTicket.engineerName");
            },
            deep: true
        },
        components: {
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
            ProScTechTree,
            bus
        }

    }
</script>

<style scoped>
    .buttons {
        color: #FFFFFF;
        background-color: #0091B0;
        border-color: #0091B0;
        margin-bottom: 9px;
    }

    .top {
        padding-left: 15px;
    }

    .message {
        margin-left: 230px;
    }

    .buttons-min {
        margin-top: 9px;
        color: #FFFFFF;
        background-color: #0091B0;
        border-color: #0091B0;
        margin-bottom: 9px;
    }
</style>