<template>
    <div class="xm-con" style="position: relative;">
        <!--控制项目输入、项目分享有无提交内容-->
        <!--<div class="onoff" v-if="!flowScope.formReadonly">-->
        <!--&lt;!&ndash;<el-switch&ndash;&gt;-->
        <!--&lt;!&ndash;v-model="onoffval"&ndash;&gt;-->
        <!--&lt;!&ndash;active-text="有"&ndash;&gt;-->
        <!--&lt;!&ndash;inactive-text="无">&ndash;&gt;-->
        <!--&lt;!&ndash;</el-switch>&ndash;&gt;-->
        <!--</div>-->
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
            <el-tab-pane label="项目基本信息" name="first">
                <el-form :v-loading="loading" :model="formModel" status-icon :rules="rules" ref="definition"
                         label-width="140px">
                    <!--第一行-->
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="所内项目编号" label-width="110px" prop="xmcode">
                                <el-input disabled v-model="formModel.xmcode" placeholder="自动生成"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="所外项目编号" label-width="110px" prop="xmcodeSw">
                                <el-input v-model="formModel.xmcodeSw" maxlength="16" placeholder="手动输入"
                                          :disabled="flowScope.formReadonly"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目名称" label-width="110px" prop="xmname">
                                <el-input v-model="formModel.xmname" :disabled="flowScope.formReadonly"
                                          maxlength="33"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="项目来源" label-width="110px" prop="xmly">
                                <pms-select-tree :disabled="flowScope.formReadonly" v-model="formModel.xmly"
                                                 :isemptyBtn="isemptyBtn"
                                                 :showChecked="showChecked"
                                                 :unbrid="unbrid"
                                                 :treeData="treeData"
                                                 :transfer="transferTree.treeData"
                                                 :iscanLevel1=false
                                                 trigger="click"
                                                 @select-xmly="lyy=>{formModel.xmlyName=lyy.name}"
                                >
                                </pms-select-tree>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目密级" label-width="110px" prop="dataSecretLevcode">
                                <ice-select :disabled="flowScope.formReadonly" v-model="formModel.dataSecretLevcode"
                                            map-type-code="DATA_SECRET_LEVEL"
                                            :controlMjPar="maxChildMj"
                                            @changevalue="changeMj"
                                            filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目类别" label-width="110px" prop="xmlb">
                                <ice-select @changevalue="getCode" :disabled="flowScope.formReadonly"
                                            v-model="formModel.xmlb" map-type-code="XMLB" filterable
                                            placeholder="请选择"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <!--第三行-->
                        <el-col :span="8">
                            <el-form-item label="学科方向" label-width="110px" prop="xmxkfx">
                                <ice-select :disabled="flowScope.formReadonly" v-model="formModel.xmxkfx"
                                            map-type-code="XMXKFX" filterable
                                            placeholder="请选择"></ice-select>
                            </el-form-item>
                        </el-col>

                        <!--第四行-->
                        <el-col :span="8">
                            <el-form-item label="责任单位" label-width="110px" prop="orgname">
                                <ice-dept-selector chooseItem="single"
                                                   :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                   v-model="formModel.orgname"
                                                   @select-confirm="depts=>{formModel.orgcode=depts[0].deptCode;formModel.orgid=depts[0].oid;}">
                                </ice-dept-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="业务主管部门" label-width="110px" prop="xmzgbmCode">
<!--                                <ice-dept-selector :disabled="flowScope.formReadonly" chooseItem="single"-->
<!--                                                   :mode="flowScope.formReadonly?'readonly':'onlySelect'"-->
<!--                                                   v-model="formModel.xmzgbm"-->
<!--                                                   @select-confirm="depts=>{formModel.xmzgbmCode=depts[0].deptCode;formModel.xmzgbmId=depts[0].oid;}">-->
<!--                                </ice-dept-selector>-->
                                <ice-select :disabled="flowScope.formReadonly" v-model="formModel.xmzgbmCode"
                                            map-type-code="ZGBM" filterable
                                            placeholder="请选择"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>

                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="立项日期" label-width="110px" prop="gmtLx">
                                <el-date-picker v-model="formModel.gmtLx" type="date" placeholder="请选择"
                                                :picker-options="pickerOptions(1)"
                                                :disabled="flowScope.formReadonly"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="计划结项日期" label-width="110px" prop="finishDate">
                                <el-date-picker v-model="formModel.finishDate" type="date" placeholder="请选择"
                                                :picker-options="pickerOptions(2)"
                                                :disabled="flowScope.formReadonly"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">

                        <!--第六行-->
                        <el-col :span="8">
                            <el-form-item label="全时人力投入" label-width="110px" prop="rltr">
                                <pms-input v-model="formModel.rltr" maxlen="10" unit="人/年 "
                                           :disabled="flowScope.formReadonly"></pms-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="预算经费合计" label-width="110px" prop="ysjfhj">
                                <!--<el-input :disabled="flowScope.formReadonly" type="number" v-model="formModel.ysjfhj"-->
                                <!--placeholder="请输入"-->
                                <!--&gt;-->
                                <pms-input v-model="formModel.ysjfhj" maxlen="12" precision="2" unit="万元"
                                           :disabled="flowScope.formReadonly"></pms-input>
                                <!--</el-input>-->
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="项目目标" label-width="110px" prop="xmmb">
                                <el-input type="textarea" :disabled="flowScope.formReadonly" v-model="formModel.xmmb"
                                          placeholder="不超过650个字" maxlength="650"
                                          show-word-limit
                                          :rows="2">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="terminateOrNot || formModel.terminateOrNot">
                        <el-col :span="24">
                            <el-form-item label="项目终止：" label-width="110px" prop="options">
                                <el-radio-group
                                        v-model="formModel.terminateOrNot">
                                    <el-radio v-for="idea in ideas" :label="idea.label" :key="idea.label">
                                        {{idea.value}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="suspendOrNot || formModel.suspendOrNot">
                        <el-col :span="24">
                            <el-form-item label="项目暂停：" label-width="110px" prop="options">
                                <el-radio-group
                                        v-model="formModel.suspendOrNot">
                                    <el-radio v-for="idea in ideas" :label="idea.label" :key="idea.label">
                                        {{idea.value}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--第七行-->
                    <el-row v-if="judgeType===2||formModel.change">
                        <el-col :span="24">
                            <el-form-item label="调整原因说明" label-width="110px" prop="change">
                                <el-input
                                        :disabled="(terminateOrNot || suspendOrNot)?flowScope.flowScope.formReadonly:flowScope.formReadonly"
                                        v-model="formModel.change"
                                        placeholder="不超过650个字" maxlength="650"
                                        show-word-limit type="textarea"
                                        :rows="2">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--第八行-->
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="备注" label-width="110px" prop="dateRemark">
                                <el-input :disabled="flowScope.formReadonly" v-model="formModel.dateRemark"
                                          type="textarea"
                                          placeholder="不超过650个字" maxlength="650"
                                          show-word-limit
                                          :rows="2">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-tabs v-model="activeName1">
                                <el-tab-pane label="成员管理" name="first"></el-tab-pane>
                            </el-tabs>
                            <template v-if="!flowScope.formReadonly">
                                <div class="hint">项目主管、项目第一责任人、行政负责人、技术负责人是必选角色</div>
                            </template>
                            <!--<el-button type="success"><i class="el-icon-plus"></i>选择成员</el-button>-->

                            <pms-sect-member :disabled="isCheck" ref="pmssectMember"
                                             :queryListXmcy="queryListXmcy"></pms-sect-member>
                        </el-col>
                    </el-row>
                </el-form>

            </el-tab-pane>
            <!--点击编辑打开项目输出-->
            <el-tab-pane label="项目合同" name="xmht">
                <ice-query-grid
                        :pagination=false
                        :gridData="gridData"
                        exportTitle="合同信息登记"
                        :operations-width="120"
                        :columns="projectContract.columns"
                        :buttons="projectContract.buttons"
                        :query="projectContract.query"
                        :operations="projectContract.operations"
                        ref="grid1">
                </ice-query-grid>
            </el-tab-pane>

            <!--点击编辑打开项目输入-->
            <el-tab-pane label="项目输入" name="xmsr">
                <div class="onoff" v-if="!flowScope.formReadonly">
                    <span style="margin-right: 15px;">是否有内容</span>
                    <el-checkbox v-model="formModel.isConSr">{{formModel.isConSr?'是':'否'}}</el-checkbox>
                </div>
                <ATTACHMENT :controlMj="formModel.dataSecretLevcode?[formModel.dataSecretLevcode]:[]"
                            :isHandleer="!flowScope.formReadonly" :data="queryListXmsr"
                            ref="pmsXmRwFjListXmsr1" @change="changeFjSr"></ATTACHMENT>
            </el-tab-pane>

            <el-tab-pane label="项目风险" name="fengxian">
                <div class="onoff" v-if="!flowScope.formReadonly">
                    <span style="margin-right: 15px;">是否有内容</span>
                    <el-checkbox v-model="formModel.isConFx">{{formModel.isConFx?'是':'否'}}</el-checkbox>
                </div>
                <div :style="{width: num+'px'}">
                    <pms-sect-fx @change="changeFx" :maxMj="formModel.dataSecretLevcode"
                                 :disabled="flowScope.formReadonly" :fxqdList="fxqdList" ref="pmsSectFx"
                                 @handleCallback="sectFxData"></pms-sect-fx>
                </div>
            </el-tab-pane>

        </el-tabs>
        <!--合同选择-->
        <ice-dialog title="合同选择" :visible.sync="contractVisible" width="1200px">
            <div>
                <ice-query-grid
                        data-url="/pms/PmsHtinfo/list"
                        exportTitle="合同信息登记"
                        :operations-width="120"
                        :columns="projectContract.columns"
                        :buttons="projectContract.buttons1"
                        :query="projectContract.query"
                        :operations="projectContract.buttons1"
                        codeProp="oid"
                        :selectedCodes="selectedCodes"
                        chooseItem="multiple"
                        @selection-change="handleSectedContract"
                        ref="grid2">
                </ice-query-grid>
            </div>

            <div class="ice-button-bar">
                <el-button type="primary" @click="handleSectContract">确认</el-button>
                <el-button type="info" @click="contractVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
        <!--添加合同-->
        <ice-dialog title="添加合同" :visible.sync="addContractVisible" width="1200px">
            <htdj :isvisibleBtn="isvisibleBtn" ref="HTDJ" @handleCallback="handleCallbackHtdj"></htdj>
            <div class="ice-button-bar">
                <el-button type="primary" @click="handleConfirmAdd">确认</el-button>
                <el-button type="info" @click="addContractVisible=false">关闭</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceTree from "../../../../components/common/base/IceTree";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import ATTACHMENT from "../../common/ATTACHMENT";
    import member from "./member";
    import {MUST_ROLE, ROLE_ONE} from "../../../../utils/constant";
    import PmsSelectTree from '../../../../components/common/pms/PmsSelectTree'

    import Htdj from '../../htgl/htdj_edit'
    import pmsSectMember from './pmsSectMember'
    import pmsSectFx from './pmsSectFx'
    import {mapGetters, mapMutations} from 'vuex'
    import moment from 'moment';
    import {validatePassNumber} from '../../../../utils/validator'
    import codeConfigRequest from '../../../../utils/codeConfigRequest'
    import PmsInput from '@/components/common/pms/PmsInput'

    export default {
        name: "XmForm",
        mixins: [codeConfigRequest],
        props: {
            flowScope: {
                default: function () {
                    return {}
                }
            },
            /**
             *
             * 判定状态，是否是立项或者变更 默认是立项1
             * */
            judgeType: {
                default: 1,
            },
        },
        data() {
            return {
                numc: 0,
                onoffval: true,
                // 项目输入变化
                changeFjSrdata: [],
                // 风险变化数据
                changeFxData: [],
                // 选择成员关闭按钮
                visibleMember: false,
                // 树组件参数配置
                membershow: true,

                //定义弹出框为false，隐藏状态
                visible: false,
                ideas: [
                    {label: true, value: '是'}
                ],
                //定义模态框里面的新增内容字段
                formModel: {
                    finishDate: "",
                    oid: '',
                    xmname: '',
                    xmcode: '',
                    xmcodeyn: '',
                    pid: '',
                    dataSecretLevcode: '',
                    xmzt: 'XMZT01',
                    xmlb: '',
                    xmxkfx: 'XMXKFX01',
                    xmjfqd: '',
                    xmzgbm: '',
                    xmzgbmCode: '',
                    xmzgbmId: '',
                    xmzg: '',
                    orgid: '',
                    orgcode: '',
                    orgname: '',
                    personid: '',
                    personidJs: '',
                    personidXz: '',
                    sbzt: 'SBZT01',
                    xmmb: '',
                    ysjfhj: '',
                    rltr: '',
                    gmtLx: new Date(),
                    xmysh: '',
                    dateRemark: '',
                    pmsXmRwFjListXmsr: [],
                    pmsXminfoCyList: [],
                    pmsXmRwFjListXmsc: [],
                    xtFjList: [],
                    yscode: '',
                    xmly: '',
                    $json: {},
                    change: '',
                    terminateOrNot: false,
                    suspendOrNot: false,
                    // 判定项目输入是否有内容
                    isConSr: true,
                    // 判定项目风险是否有内容
                    isConFx: true,
                    addOrNot: true
                },
                //定义模态框里面必填项,是以数组形式保存，里面存放的是JSON
                rules: {
                    xmname: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
                    xmcode: [{required: true, message: '所内项目编号', trigger: 'blur'}],
                    // xmcodeyn: [{required: true, message: '所外项目编号', trigger: 'blur'}],

                    dataSecretLevcode: [{required: true, message: '项目密集', trigger: 'blur'}],
                    xmzt: [{required: true, message: '项目状态', trigger: 'blur'}],
                    xmlb: [{required: true, message: '项目类别', trigger: 'blur'}],

                    xmxkfx: [{required: true, message: '学科方向', trigger: 'blur'}],
                    sbzt: [{required: true, message: '上报状态', trigger: 'blur'}],
                    // gmtLx: [{type: 'date', required: true, message: '立项日期', trigger: 'blur'}],
                    gmtLx: [{required: true, message: '立项日期', trigger: 'blur'}],
                    orgname: [{required: true, message: '责任单位', trigger: 'change'}],

                    // xmzgbm: [{required: true, message: '业务主管部门', trigger: 'change'}],


                    // rltr: [{required: true, message: '全时人力投入', trigger: 'blur'}],

                    xmmb: [{required: true, message: '项目目标', trigger: 'blur'}],
                    xmly: [{required: true, message: '项目来源', trigger: 'change'}],
                    change: [{required: true, message: '项目变更原因', trigger: 'blur'}],
                    // rltr: [
                    //     {required: true, message: '请输入人力投入', trigger: 'blur'},
                    //     { validator: validatePassNumber, trigger: 'blur' }
                    // ],
                    ysjfhj: [
                        {required: true, message: '请输入预算经费合计', trigger: 'blur'},
                        {validator: validatePassNumber, trigger: 'blur'}
                    ],
                    // finishDate: [
                    //     {required: true, message: '完成日期', trigger: 'change'}
                    // ]
                },
                //定义模态框 转圈加载过程
                loading: false,


                //定义模态框项目名称为空：
                titleName: '新增项目',

                /**
                 * 定义右侧模态框首选《项目信息》
                 */
                activeName: 'first',
                activeName1: 'first',

                /**
                 * 定义项目输入attaTableData: [],
                 */
                attaTableData: [],
                /**
                 * 定义项目输入的数据源数组空[]
                 */
                queryListXmsr: [],
                xtFjs: [],
                /**
                 * 定义项目输出的数据源为空
                 */
                queryListXmsc: [],
                /**
                 * ----------------------------------项目成员------------------------------
                 */
                queryListXmcy: [],

                /**
                 *
                 * 项目合同
                 *
                 * */
                contractVisible: false,
                addContractVisible: false,
                projectContract: {
                    query: [
                        {type: 'input', code: 'htname', label: '合同名称'},
                        {type: 'input', code: 'htcode', label: '合同编号'},
                        {type: 'input', code: 'htjf', label: '甲方'},
                        {type: 'input', code: 'htyf', label: '乙方'},
                        {type: 'static', code: 'spzt', value: 'SPZT30', exp: '='},
                        {
                            type: 'static', code: 'dataSecretLevcode', value: () => {
                                return this.formModel.dataSecretLevcode
                            }, exp: '<='
                        },
                        {type: 'static', code: 'dataSecretLevcode', value: 4, exp: '<='},
                        //过滤合同生效日期
                        {
                            type: 'static', code: 'dateStart',
                            value: () => {
                                let t = new Date();
                                // return t.getFullYear() + '-' + (t.getMonth()*1 + 1) + '-' + (t.getDate() + 1) + ' 00:00:00'
                                return moment(new Date().getTime() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD') + ' 00:00:00'
                            }
                            , exp: '<'
                        },
                        //过滤合同失效日期
                        {
                            type: 'static', code: 'dateEnd',
                            value: () => {
                                let t = new Date();
                                // return t.getFullYear() + '-' + (t.getMonth()*1 + 1) + '-' + (t.getDate() + 1) + ' 00:00:00'
                                return moment(new Date().getTime() + 24 * 60 * 60 * 1000).format('YYYY-MM-DD') + ' 00:00:00'
                            }
                            , exp: '>'
                        },
                        // {type: 'date', code: 'dateCreate', label: '合同签订日期', exp: '='},
                        // {type: 'date', code: 'dateStart', label: '合同生效日期', exp: '='},
                        // {type: 'date', code: 'dateEnd', label: '合同终止日期', exp: '='},
                    ],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'dateRemark', hidden: true},
                        {label: '合同名称', code: 'htname', width: 160},
                        {label: '合同', code: 'htcode', width: 140},
                        {label: '甲方', code: 'htjf', width: 120},
                        {label: '乙方', code: 'htyf', width: 120},
                        {label: '合同金额(元)', code: 'htje', width: 120},
                        {
                            label: '合同签订日期', code: 'dateCreate', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateCreate).format('YYYY-MM-DD');
                            }
                        },
                        {
                            label: '合同生效日期', code: 'dateStart', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateStart).format('YYYY-MM-DD');
                            }
                        },
                        {
                            label: '合同终止日期', code: 'dateEnd', width: 130, sortable: true, formatter(row) {
                                return moment(row.dateEnd).format('YYYY-MM-DD');
                            }
                        },
                        {label: '合同类型', code: 'htlx', width: 100, mapTypeCode: 'HTLX'},
                        {label: '份数', code: 'htNum', width: 80},
                        {label: '合同概要', code: 'htrw', width: 100},
                        {label: '登记部门', code: 'htdept', width: 120},
                        {label: '密级', code: 'dataSecretLevcode', mapTypeCode: 'DATA_SECRET_LEVEL', width: 100},
                    ],
                    buttons: [
                        //{name: '添加合同', icon: 'el-icon-plus', type: 'primary', callback: this.handleAddContract, hidden: this.isCheck},
                        {
                            name: '合同选择',
                            icon: 'el-icon-thumb',
                            type: 'success',
                            callback: this.addContract,
                            hidden: this.isCheck
                        },
                    ],
                    // 合同选择buttons
                    buttons1: [],
                    operations: [
                        {
                            name: '删除', callback: this.removeDel, ctrlCode: "BSC", isShow: () => {
                                return !this.isCheck
                            }
                        },
                    ],
                },
                gridData: [],
                selectedCodes: [],
                sectedContract: [],

                // 隐藏添加合同组件的按钮
                isvisibleBtn: false,
                // 编辑时选中的合同列表
                editContractList: [],
                // 删除了的项目合同
                canRemoveContaractList: [],
                /**
                 *
                 * 项目风险
                 *
                 * */
                xmRist: {
                    query: [
                        {type: 'static', code: 'oid', value: ''},
                    ],
                    columns: [
                        {code: 'oid', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', align: "left", width: 140, sortable: true},
                        {label: '任务名称', code: 'rwname', width: 140},
                        {label: '部门', code: 'rwdept', width: 140, sortable: true},
                        {label: '前置任务', code: 'qzrw', width: 140},
                        {label: '工期', code: 'rwgq', width: 140},
                        {label: '材料费需求', code: 'rwysYcl', width: 140},
                        {label: '材料费/万元', code: 'rwysYclfy', width: 140},
                        {label: '专用费需求', code: 'rwysZy', width: 140},
                        {label: '专用费/万元', code: 'rwysZyfy', width: 140},
                        {label: '外协费需求', code: 'rwysWx', width: 140},
                        {label: '外协费/万元', code: 'rwysWxfy', width: 140},
                        {label: '事务费需求', code: 'rwysSw', width: 140},
                        {label: '事务费/万元', code: 'rwysSwfy', width: 140},
                        {label: '其他费需求', code: 'rwysQt', width: 140},
                        {label: '其他费/万元', code: 'rwysQtfy', width: 140},
                        {label: '预算经费合计（万元）', code: 'rwysJfSum', width: 140, sortable: true},
                        {label: '全时人力投入（人x年）', code: 'rwysRl', width: 140},
                    ],
                    buttons: [
                        {name: '添加风险', icon: 'el-icon-thumb', type: 'success', callback: this.addContract},
                    ],
                },
                /**
                 *
                 * 项目成员
                 *
                 * */
                memberlist: [
                    {
                        'name': '项目主管',
                        'type': '是',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '行政负责人',
                        'type': '是',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '技术负责人',
                        'type': '是',
                        'num': '可多个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '第一责任人',
                        'type': '是',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '第二责任人',
                        'type': '否',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '第三责任人',
                        'type': '否',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },
                    {
                        'name': '第四责任人',
                        'type': '否',
                        'num': '一个',
                        'dept': '',
                        'member': '',
                    },

                ],
                pmstreeValue: '',
                activeName1: 'first',
                // 项目来源
                unbrid: true,
                width: '285px',
                showChecked: false,
                isemptyBtn: true,
                transferTree: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/DataDictionaryType/getTree?code=XMLY&isTree=1',
                        lazy: false,
                        nodeKey: 'code',
                        // 配置字段
                        props: {
                            label: 'name',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {},
                        code: 'code',
                        // 返回解析字段
                        callback: this.getTreeData
                    },

                },
                treeData: {
                    value: '',
                    placeholder: '请选择'
                },
                treeDataList: [],
                // 必选角色
                /**
                 *  必选角色 必须选角色数据初始化
                 * */
                mustRoleData: [
                    {
                        oid: '',
                        oidXm: '',
                        xmname: '',
                        xmcode: '',
                        xmcylx: 'XMCYLX01',
                        name: '',
                        code: '',
                        deptName: '',
                        deptCode: ''
                    },
                    {
                        oid: '',
                        oidXm: '',
                        xmname: '',
                        xmcode: '',
                        xmcylx: 'XMCYLX02',
                        name: '',
                        code: '',
                        deptName: '',
                        deptCode: ''
                    },
                    {
                        oid: '',
                        oidXm: '',
                        xmname: '',
                        xmcode: '',
                        xmcylx: 'XMCYLX11',
                        name: '',
                        code: '',
                        deptName: '',
                        deptCode: ''
                    },
                    {
                        oid: '',
                        oidXm: '',
                        xmname: '',
                        xmcode: '',
                        xmcylx: 'XMCYLX03',
                        name: '',
                        code: '',
                        deptName: '',
                        deptCode: ''
                    }
                ],
                /**
                 *
                 * 传递给wbs 组件的树数据
                 *
                 * */
                transferWbsTreeData: {
                    id: '',
                    obj: ''
                },
                /**
                 *
                 * 风险
                 * */
                fxqdList: [],
                personIds: [],
                num: 0,
                // 密级变更之前的值
                changeBeforeVal: '',
                // 删除数据集合 单审批中删除数据集合
                delGathers: {
                    delCy: [],
                    delHt: [],
                    delFx: [],
                    delSr: []
                }
            }
        },
        methods: {
            // 日期控制
            pickerOptions(type) {
                if (type == 1) {
                    let end = this.formModel.finishDate;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.formModel.gmtLx;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            // 项目输入变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            // 项目风险变化
            changeFx(data) {
                this.changeFxData = data
            },
            // 选择密级获取焦点
            handleFocus() {
                const a = this.formModel.dataSecretLevcode;
                this.changeBeforeVal = a;
            },
            // 密级改变
            changeMj(val) {
                if (this.$refs.grid2) {
                    this.$refs.grid2.refresh();
                }

            },
            getCode(xmlb) {
                let param = xmlb ? xmlb : 'XMLB01'
                this.loadProjectCode({name: 'XM', param: param}).then(res => {
                    this.formModel.xmcode = res.number;
                })
            },
            // 提交后隐藏按钮
            resetBtn() {
                this.projectContract.buttons.map((c) => {
                    c.hidden = this.isCheck
                })
            },
            // 表单验证
            async getyzResult() {
                if (!this.terminateOrNot && !this.suspendOrNot) {
                    let sr = this.$refs.pmsXmRwFjListXmsr1.getVisibleDataAndDelData();
                    if (sr.length <= 0 && this.formModel.isConSr) {
                        this.$message.error('项目输入必须要有内容！');
                        return false
                    }

                    // 项目风险数据
                    let fxsj = this.$refs.pmsSectFx.getData();
                    if (fxsj.length <= 0 && this.formModel.isConFx) {
                        this.$message.error('项目风险必须要有内容！');
                        return false;
                    }
                }
                return await this.$refs.definition.validate();
            },
            // 获取表单数据
            getData() {
                const sjid = this.formModel.oid;
                let insertDataCy = this.$refs.pmssectMember.getData();
                let deleteDataCy = this.$refs.pmssectMember.getDeleteData();
                let memberListSect = [];
                if (insertDataCy) {
                    memberListSect = insertDataCy.concat(deleteDataCy);
                } else {
                    return
                }
                console.log(memberListSect, 'memberListSect');
                memberListSect.map(c => {
                    c.oid = c.oid ? c.oid : ''
                })
                this.formModel.pmsXminfoCyList = memberListSect;
                // 项目输入
                let sr = this.$refs.pmsXmRwFjListXmsr1.getVisibleDataAndDelData();
                this.formModel.xtFjListXmsr = sr;

                // 协同附件
                this.formModel.xtFjList = sr;
                // 选中的合同
                this.formModel.pmsHtinfoList = [...this.gridData, ...this.canRemoveContaractList];
                this.formModel.pmsHtinfoList.map((c) => {
                    c.xtFjs = [];
                    c.xminfos = [];
                })
                // 项目风险数据

                let fxsj = this.$refs.pmsSectFx.getData();
                console.log('执行到这里了')
                let newfxsj = [];
                fxsj.forEach((c) => {
                    let obj = {
                        xmfxzzr: c.xmfxzzr,
                        xmfxgbcs: c.xmfxgbcs,
                        pmsFxqd: c,
                        deleteStatus: c.deleteStatus,
                        oid: c.oidxmfx ? c.oidxmfx : ''
                    }
                    newfxsj.push(obj);
                })
                this.formModel.pmsXmFxList = newfxsj;
                this.formModel.xmInfoOid = JSON.parse(JSON.stringify(this.formModel.xmInfoOid ? this.formModel.xmInfoOid : this.formModel.oid));
                this.formModel.addOrNot = true;
                //获取业务表单数据  formModel 传给控件处理
                if (this.judgeType === 2) {
                    this.formModel.addOrNot = false;
                }
                this.formModel.oid = '';
                console.log(this.formModel)
                return this.formModel;
            },
            // 多项目审核
            getBatchData() {
                let delGather = this.formModel.delGather ? this.formModel.delGather : {}
                let insertDataCy = this.$refs.pmssectMember.getData();
                let deleteDataCy = this.$refs.pmssectMember.getDeleteData();
                let memberListSect = [];
                if (insertDataCy) {
                    memberListSect = insertDataCy.concat(deleteDataCy);
                } else {
                    return
                }
                memberListSect.map(c => {
                    c.oid = c.oid ? c.oid : ''
                })
                delGather.delCy = delGather.delCy ? [...delGather.delCy, ...deleteDataCy] : deleteDataCy;
                this.formModel.pmsXminfoCyList = [...memberListSect, ...delGather.delCy];
                // 成员删除数据整理
                // 项目输入
                let sr = this.$refs.pmsXmRwFjListXmsr1.getVisibleDataAndDelData();
                let delSrdata = sr.filter(c => {
                    return c.version == -1;
                })
                // 输入删除数据
                delGather.delSr = delGather.delSr ? [...delGather.delSr, ...delSrdata] : delSrdata;
                let visiblesr = sr.filter(c => {
                    return c.version != -1;
                })
                let fj = [...visiblesr, ...delGather.delSr];
                // 项目输出
                let sc = [];
                // 协同附件
                this.formModel.xtFjList = sc.concat(fj);
                this.formModel.xtFjListXmsr = fj;

                // 删除的合同数据
                delGather.delHt = delGather.delHt ? [...delGather.delHt, ...this.canRemoveContaractList] : this.canRemoveContaractList;
                // 选中的合同
                this.formModel.pmsHtinfoList = [...this.gridData, ...delGather.delHt];
                this.formModel.pmsHtinfoList.map((c) => {
                    c.xtFjs = [];
                    c.xminfos = [];
                })
                // 项目风险数据
                let fxsj = this.$refs.pmsSectFx.getData();

                let delfxdata = fxsj.filter(c => {
                    return c.deleteStatus == 1;
                })
                let visiblefx = fxsj.filter(c => {
                    return c.deleteStatus != 1;
                })
                // 删除的风险数据
                delGather.delFx = delGather.delFx ? [...delGather.delFx, ...delfxdata] : delfxdata;
                let fxlist = [...visiblefx, ...delfxdata];
                let newfxsj = [];
                // fxlist.forEach((c) => {
                //     let obj = {
                //         xmfxzzr: c.xmfxzzr,
                //         xmfxgbcs: c.xmfxgbcs,
                //         pmsFxqd: c,
                //         deleteStatus: c.deleteStatus,
                //         oid: c.oidxmfx ? c.oidxmfx : ''
                //     }
                //     newfxsj.push(obj);
                // })
                this.formModel.pmsXmFxList = fxlist;

                this.formModel.delGather = delGather;
                console.log(this.formModel.pmsXmFxList)
                // return
                return this.formModel;
            },
            // 保存成功后的回调  赋值
            handleCallbackFlow(data) {
                this.formModel = data;
                // 项目成员
                // 未删除的成员
                this.queryListXmcy = data.pmsXminfoCyList ? data.pmsXminfoCyList : [];

                // 项目合同
                this.gridData = data.pmsHtinfoList ? data.pmsHtinfoList.filter((c) => {
                    return c.deleteStatus != 1;
                }) : [];

                this.canRemoveContaractList = data.pmsHtinfoList ? data.pmsHtinfoList.filter((c) => {
                    return c.deleteStatus == 1;
                }) : [];

                this.selectedCodes = this.gridData.map(c => {
                    return c.oid;
                })
                // 项目输入
                this.queryListXmsr = data.xtFjListXmsr ? data.xtFjListXmsr : [];

                this.changeFjSrdata = this.queryListXmsr;
                // 项目风险
                if (data.pmsXmFxList && data.pmsXmFxList.length > 0 && data.pmsXmFxList[0].pmsFxqd) {
                    this.fxqdList = data.pmsXmFxList.map(c => {
                        c.pmsFxqd.oidxmfx = c.oid ? c.oid : "";
                        return c.pmsFxqd
                    })

                } else {
                    this.fxqdList = data.pmsXmFxList ? data.pmsXmFxList : [];
                }
                this.$refs.pmssectMember.empty();
            },
            handleClick(val) {
                // console.log(val.name)
                if (val.name == 'wbs') {
                    this.$refs.wbsFj.refresh();
                }
                if (val.name == "xmsr") {
                    // console.log('羡慕输入')
                    this.$refs.pmsXmRwFjListXmsr1.resize();
                }
                if (val.name == "xmsc") {
                    this.$refs.pmsXmRwFjListXmsc1.resize();
                }
                if (val.name == "fengxian") {
                    this.$refs.pmsSectFx.resize();
                }
            },
            ...mapGetters('datamapStore', ['getDataMapList']),
            confirm() {

            },
            // 获取详情数据
            dbClick(rowDataId) {
                let row = {
                    oid: rowDataId
                }
                this.visible = true;  //打开模态框
                this.titleName = '编辑项目库';
                this.activeName = 'first';
                // this.$nextTick(_ => {   //事件循环
                //   this.$refs.definition.resetFields();  //刷新模态框
                //   this.formModel = {...row};
                // })
                this.gridData = [];
                this.sectedContract = [];
                this.canRemoveContaractList = [];
                this.queryListXmsr = []; //点击编辑的时候项目输入模态框先清空
                this.queryListXmsc = []; //点击编辑的时候项目输出模态框先清空
                this.queryListXmcy = []; //点击编辑的时候项目成员模态框先清空
                this.getBasicMsg(row.oid)
                this.getListXmsrData(row.oid);  //获取当前行的项目信息主键OID --查询项目输入
                this.getListXmcyData(row.oid)   //获取当前行的项目信息主键OID --查询项目成员
                this.getEditContractList(row.oid);//获取当前行的项目信息主键OID --查询合同

                this.getListFzqd(row.oid);//获取风险清单

                this.fxqdList = [];


                // wbs
                this.transferWbsTreeData.id = row.oid;
                this.transferWbsTreeData.obj = {data: row};
                this.$nextTick(() => {
                    // this.$refs.wbsFj.xmkNodeClick();
                    this.$refs.pmssectMember.empty();
                })
            },
            // 项目基本信息查询
            getBasicMsg(xmOid) {
                this.$axios.get("/pms/Xminfo/queryListXminfoaData", {params: {oid: xmOid}})
                    .then(result => {
                        // console.log(result)
                        this.$nextTick(_ => {   //事件循环
                            this.$refs.definition.resetFields();  //刷新模态框
                            let rowdata = result.data[0];
                            rowdata.isConFx = true;
                            rowdata.isConSr = true;
                            this.formModel = {...rowdata};

                            this.formModel.terminateOrNot = this.terminateOrNot;
                            this.formModel.suspendOrNot = this.suspendOrNot;

                        })

                    })
                    .catch(error => {
                        this.$message.error("获取项目基本数据失败！")
                    })
            },

            /**
             * ---------------------------------------项目输入输出附件上传下载----------
             */
            //获取项目输入,添加附件数据
            getListXmsrData(xmOid) {
                this.$axios.get("pms/XtFj/querylistByOidXmsrFj", {params: {bOid: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsr.push(d);

                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            /**
             *  点击编辑的时候根据项目OID获取项目输出数据
             */
            getListXmscData(xmOid) {
                this.$axios.get("pms/XtFj/querylistByOidXmscFj", {params: {bOid: xmOid}})
                    .then(result => {
                        result.data.map(d => {
                            this.queryListXmsc.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            /**
             * ----------------------------------项目成员------------------------------
             */

            //获取项目列表数据
            getListXmcyData(oidXm) {
                // console.log(oidXm)
                this.$axios.get("/pms/PmsXminfoCy/querListByOidXmcy", {params: {oidXm: oidXm}})
                    .then(result => {
                        this.queryListXmcy = result.data;
                        // console.log(result.data)
                        let arr = [];
                        result.data.forEach((c, i) => {
                            arr.push(c.oid);
                        });
                        this.personIds = arr;
                        // console.log(' this.personIds', this.personIds)
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // 数组拉平
            arrayFlat(array) {
                let arr = [];
                let self = this;

                function hanle(s) {
                    for (var i = 0, j = s.length; i < j; i++) {//历遍数组

                        arr.push(s[i]);
                        if (Object.prototype.toString.call(s[i][self.transferTree.treeData.props.children]) == "[object Array]") {//判断是否为数组
                            // console.log(s[i][self.transferTree.treeData.props.children])
                            hanle(s[i][self.transferTree.treeData.props.children]);//递归调用
                        }
                    }
                }

                hanle(array);
                return arr;
            },
            getTreeData(data) {
                // console.log(data)
                let array = this.arrayFlat(data);
                this.treeDataList = array;
            },
            // ###################### 项目合同#####################3
            //选择合同
            addContract() {
                this.contractVisible = true;
                // this.$nextTick(_=>{
                //     // console.log(123456)
                //     this.$refs.grid2.$refs.eltable.clearSelection();
                //
                //     this.gridData.forEach((c)=>{
                //         if (c.deleteStatus!=1) {
                //             this.$refs.grid2.$refs.eltable.toggleRowSelection(c, true);
                //         } else {
                //             this.$refs.grid2.$refs.eltable.toggleRowSelection(c, false);
                //         }
                //
                //     })
                // })
            },
            // 选中的合同
            handleSectedContract(data) {
                this.sectedContract = data;
            },
            // 合同确定选择
            handleSectContract() {
                // 去重
                let arrIds = [];
                // console.log(this.gridData)
                this.gridData.forEach((c, i) => {
                    arrIds.push(c.oid);
                })
                this.sectedContract.forEach((c, i) => {
                    if (arrIds.indexOf(c.oid) < 0) {
                        this.gridData.push(c);
                    }
                })
                this.contractVisible = false;
            },
            // 删除选择的合同
            removeDel(row) {
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    row.deleteStatus = 1;
                    let tractIndex = this.gridData.findIndex((val) => {
                        return val.oid === row.oid;
                    })
                    let b = this.editContractList.find((val) => {
                        return val.oid === row.oid;
                    })
                    if (b) {
                        this.canRemoveContaractList.push(row);
                    }
                    // console.log('this.canRemoveContaractList', this.canRemoveContaractList)
                    this.gridData.splice(tractIndex, 1);

                }).catch(() => {
                    // console.log('取消成功')
                })

            },
            // 获取编辑时的合同
            getEditContractList(xmOid) {
                this.$axios.get("/pms/Xminfo/querylistByOidXmht", {params: {oid: xmOid}})
                    .then(result => {
                        this.gridData = [...this.gridData, ...result.data];
                        this.selectedCodes = this.gridData.map(c => {
                            return c.oid;
                        })
                        this.editContractList = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
            // 新增合同显示
            handleAddContract() {
                /*this.addContractVisible = true;
                this.$nextTick(()=>{
                  this.$refs.HTDJ.emptyFormModel();
                })*/
                this.$router.push({path: '/pms/htgl/htdj_flow'});

            },
            // 确定添加合同
            handleConfirmAdd() {
                this.$refs.HTDJ.confirmSave();
            },
            handleCallbackHtdj(data) {
                // console.log('新增合同数据',data);
                this.gridData = [...this.gridData, data];
                this.addContractVisible = false;
            },
            // ########################风险回调数据
            sectFxData(data) {
                // console.log(data);
            },
            //获取项目风险数据
            getListFzqd(oidXm) {
                // console.log(oidXm)
                this.$axios.get("pms/Xminfo/querylistByOidXmfx", {params: {oid: oidXm}})
                    .then(result => {
                        this.fxqdList = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取项目输入数据失败！")
                    })
            },
        },
        computed: {
            // 根据地址判定是否是立项或者变更
            // 控制项目密级
            maxChildMj() {
                // 获取项目合同密级集合
                let arr1 = this.gridData.map(c => {
                    return c.dataSecretLevcode
                })
                // 获取项目输入密级集合
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })

                // 获取项目风险密级集合
                console.log(this.fxqdList, 'this.fxqdList')
                let arr3 = this.fxqdList.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr1, ...arr2, ...arr3];
            },
            selectedDeptId() {
                return this.$route.query.selectedDeptId
            },
            // 项目成员
            memberList() {
                return this.queryListXmcy.filter((c) => {
                    return c.deleteStatus !== 1;
                })
            },

            // 行数据id
            rowDataId() {
                if (this.$route.query.oid) {
                    return this.$route.query.oid
                } else {
                    return '';
                }
            },
            // 判定是否提交审核了
            isCheck() {
                // console.log(this.flowScope.formReadonly, 'this.flowScope.formReadonly')
                return this.flowScope.formReadonly
            },
            // 获取是否为变更
            isChange() {
                return this.$route.query.isChange ? true : false
            },
            suspendOrNot() {
                return this.$route.query.suspendOrNot ? true : false;
            },
            terminateOrNot() {
                return this.$route.query.terminateOrNot ? true : false;
            },
        },
        watch: {
            rowData() {
                if (this.rowDataId) {
                    this.dbClick(this.rowDataId);
                }
            },
            isCheck() {
                this.resetBtn();
                if (this.isCheck) {
                    this.projectContract.operations = [];
                }
            },
            formModel() {
                console.log(this.formModel.xmly, 'xmly 变化了');
            },
        },
        created() {

            this.membershow = true;

            this.resetBtn();
            this.$nextTick(() => {
                // console.log(document.querySelector('.xm-con').offsetWidth)
                let num = document.querySelector('.xm-con').offsetWidth
                this.num = num;
            })
        },
        components: {
            ATTACHMENT,
            IceSingleUpload,
            IcePersionSelector,
            IceDeptSelector,
            IceTree,
            IceSelect,
            IceDialog,
            IceQueryGrid,
            member,
            PmsSelectTree,
            Htdj,
            pmsSectMember,
            pmsSectFx,
            PmsInput
        }
    }
</script>

<style lang="less" scoped>
    .onoff {
        position: absolute;
        right: 10px;
        top: 10px;
        z-index: 1000;
    }
</style>
