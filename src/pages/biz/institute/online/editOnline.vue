<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm"
                       :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData" :btn-extend1="factoryUpload" :btn-extend2="additionDev">
            <div slot-scope="flowScope">
                <el-form :model="onlineData" status-icon ref="online"
                         label-width="120px" :rules="rules" :disabled="readOnly">
                    <ice-grid-layout :columns="3" name="系统上线基本信息">
                        <el-form-item label="系统名称" prop="name">
                            <el-input v-model="onlineData.name" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="系统级别" prop="systemLevel">
                            <el-select v-model="onlineData.systemLevel" :disabled="flowScope.formReadonly">
                                <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统密级" prop="secretLevel">
                            <el-select v-model="onlineData.secretLevel" :disabled="flowScope.formReadonly">
                                <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部署模式" prop="deployMode">
                            <el-select v-model="onlineData.deployMode" :disabled="flowScope.formReadonly">
                                <el-option v-for="item in ENUMS.DEPLOY_MODE_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统来源" prop="source">
                            <el-select v-model="onlineData.source" :disabled="flowScope.formReadonly">
                                <el-option v-for="item in ENUMS.APP_SYSTEM_ORIGIN_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联网区域" prop="netAreaAndType">
                            <el-select v-model="onlineData.netAreaAndType" :disabled="flowScope.formReadonly"
                                       @change="onNetAreaChanged">
                                <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                           :key="item.code"
                                           :label="item.name"
                                           :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人电话" prop="creatorContact">
                            <el-input v-model="onlineData.creatorContact" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="功能介绍" :layout="3">
                            <el-input type="textarea" :rows="4" :disabled="flowScope.formReadonly"
                                      v-model="onlineData.introduce"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" :layout="3">
                            <el-input v-model="onlineData.remark" type="textarea" :rows="3"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="系统主管部门信息" :columns="2">
                        <el-form-item label="业务主管部门" prop="competentDeptName">
                            <ice-dept-selector choose-item="single"
                                               :mode="PAGE_ENUM.MODE"
                                               allDept="true"
                                               v-model="onlineData.competentDeptName"
                                               @select-confirm="componentDeptSelect"></ice-dept-selector>
                        </el-form-item>
                        <div class="divContent" layout="2">
                            <div class="text"><span class="required-star">*</span>主管部门<br>联系人</div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addRow(PAGE_ENUM.COMPETENT_GRID.REF)"
                                           class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow(PAGE_ENUM.COMPETENT_GRID.REF)"
                                           class="tableBtn">删除
                                </el-button>
                                <ice-editable-table layout="3" :ref="PAGE_ENUM.COMPETENT_GRID.REF" :rules="manageRules"
                                                    :data="onlineData.competentUserList" height="200"
                                                    @selection-change="componentSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="30">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="userType"
                                            prop="userType">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="userCode"
                                            prop="userCode">
                                    </el-table-column>
                                    <el-table-column
                                            label="姓名"
                                            prop="userName">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="部门"
                                            prop="deptName">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="deptCode"
                                            prop="deptCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="orgCode"
                                            prop="orgCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="orgName"
                                            prop="orgName">
                                    </el-table-column>
                                    <ice-editable-table-column label="电话" :disabled="flowScope.formReadonly"
                                                               prop="contact" type="input">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="运维部门信息">
                        <div layout="2" class="tips">{{tips}}</div>
                        <el-form-item label="运维部门责任人" prop="ownerName">
                            <ice-persion-selector choose-item="single"
                                                  :mode="PAGE_ENUM.MODE"
                                                  v-model="onlineData.ownerName"
                                                  allDept="true"
                                                  @select-confirm="ownerUserSelect"></ice-persion-selector>
                        </el-form-item>
                        <el-form-item label="运维部门">
                            <el-input v-model="onlineData.ownerDeptName"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="2">
                            <div class="text"><span class="required-star">*</span>运维部门<br>联系人</div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addRow(PAGE_ENUM.OWNER_GRID.REF)"
                                           class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow(PAGE_ENUM.OWNER_GRID.REF)"
                                           class="tableBtn">删除
                                </el-button>
                                <ice-editable-table layout="3" :ref="PAGE_ENUM.OWNER_GRID.REF"
                                                    :data="onlineData.ownerUserList" height="200"
                                                    @selection-change="ownerSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="30">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="userType"
                                            prop="userType">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="userCode"
                                            prop="userCode">
                                    </el-table-column>
                                    <el-table-column
                                            label="姓名"
                                            prop="userName">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="部门"
                                            prop="deptName">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="deptCode"
                                            prop="deptCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="orgCode"
                                            prop="orgCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="orgName"
                                            prop="orgName">
                                    </el-table-column>
                                    <ice-editable-table-column label="电话" :disabled="flowScope.formReadonly"
                                                               prop="contact" type="input">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="使用单位与承建单位">
                        <div class="divContent" layout="2">
                            <div class="text"><span class="required-star">*</span>使用单位</div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addRow(PAGE_ENUM.USE_DEPT_GRID.REF)"
                                           class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow(PAGE_ENUM.USE_DEPT_GRID.REF)"
                                           class="tableBtn">删除
                                </el-button>
                                <ice-editable-table layout="3" :ref="PAGE_ENUM.USE_DEPT_GRID.REF"
                                                    :data="onlineData.useDeptList" height="200"
                                                    @selection-change="useDeptSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="30">
                                    </el-table-column>
                                    <el-table-column
                                            label="单位名称"
                                            prop="deptName">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="deptCode"
                                            prop="deptCode">
                                    </el-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                        <div layout="2" style="width: 100%;display: flex;align-items:center">
                            <div style="width: 40px;height: 100%;"></div>
                            <div class="required-star">*</div>
                            <factory-form :title="factoryTitle" :is-edit="!flowScope.formReadonly"
                                          v-if="showFactoryGrid" style="width: 100%;"
                                          :factory-list="onlineData.factoryList" :ref="PAGE_ENUM.FACTORY_GRID.REF"
                                          :factory-user-list="onlineData.factoryUserList" :show-type="false"
                                          :oid="onlineData.oid" :rele-type="factoryEnum['承建商']"></factory-form>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout name="系统三员" :columns="2">
                        <div class="divContent" layout="2">
                            <div class="text"><span class="required-star"
                                                    v-if="!(onlineData.secretLevel == secretLevelData['公开'] || onlineData.secretLevel == secretLevelData['内部'])">*</span>系统三员
                            </div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addRow(PAGE_ENUM.MANAGE_GRID.REF)" class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow(PAGE_ENUM.MANAGE_GRID.REF)"
                                           class="tableBtn">删除
                                </el-button>
                                <ice-editable-table layout="2" :ref="PAGE_ENUM.MANAGE_GRID.REF" :rules="manageRules"
                                                    :data="onlineData.managerUserList" height="200"
                                                    @selection-change="manageUserSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="30">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="devId"
                                            prop="devId">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="id"
                                            prop="id">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="userCode"
                                            prop="userCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="deptCode"
                                            prop="deptCode">
                                    </el-table-column>
                                    <el-table-column
                                            v-if="false"
                                            label="orgCode"
                                            prop="orgCode">
                                    </el-table-column>
                                    <ice-editable-table-column label="类型" :width="200"
                                                               type="input" prop="userType">
                                        <template slot-scope="scope">
                                            <el-select placeholder="请选择" v-model="scope.row.userType"
                                                       :disabled="flowScope.formReadonly">
                                                <el-option
                                                        v-for="(item,index) in ENUMS.MANAGER_TYPE_DATA.properties"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.code">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </ice-editable-table-column>
                                    <el-table-column
                                            label="姓名"
                                            prop="userName">
                                    </el-table-column>
                                    <el-table-column
                                            label="部门"
                                            prop="deptName">
                                    </el-table-column>
                                    <ice-editable-table-column label="电话" :disabled="flowScope.formReadonly"
                                                               prop="contact" type="input">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1" name="相关附件">
                        <el-form-item label="建设方案" prop="jsfa">
                            <upload-attachment :is-edit="!flowScope.formReadonly"
                                               v-if="showFactoryGrid"
                                               :remove-call-back="removeAttachment"
                                               :dev-id="onlineData.oid" class="attachmentBorder"
                                               :child-type="ATTACHMENT_ENUMS.institute_jsfa"
                                               :upload-success="uploadSuccessHandler"
                                               :file-info="onlineData.reFileVoList"></upload-attachment>
                        </el-form-item>
                        <el-form-item label="评审意见" prop="psyj">
                            <upload-attachment :is-edit="!flowScope.formReadonly"
                                               v-if="showFactoryGrid"
                                               :remove-call-back="removeAttachment"
                                               :dev-id="onlineData.oid" class="attachmentBorder"
                                               :child-type="ATTACHMENT_ENUMS.institute_psyj"
                                               :upload-success="uploadSuccessHandler"
                                               :file-info="onlineData.reFileVoList"></upload-attachment>
                        </el-form-item>
                        <el-form-item label="离线测评报告">
                            <upload-attachment :is-edit="!flowScope.formReadonly"
                                               v-if="showFactoryGrid"
                                               :remove-call-back="removeAttachment"
                                               :dev-id="onlineData.oid" class="attachmentBorder"
                                               :child-type="ATTACHMENT_ENUMS.institute_cpbg"
                                               :upload-success="uploadSuccessHandler"
                                               :file-info="onlineData.reFileVoList"></upload-attachment>
                        </el-form-item>
                        <el-form-item label='安全保密方案及评审意见'>
                            <upload-attachment :is-edit="!flowScope.formReadonly"
                                               v-if="showFactoryGrid"
                                               :remove-call-back="removeAttachment"
                                               :dev-id="onlineData.oid" class="attachmentBorder"
                                               :child-type="ATTACHMENT_ENUMS.institute_bmfa"
                                               :upload-success="uploadSuccessHandler"
                                               :file-info="onlineData.reFileVoList"></upload-attachment>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="承建商上传资料" :columns="1"
                                     v-if="showFactoryAttachment || currentNode == nodeId.createDev || currentNode == nodeId.execute">
                        <factory-upload :oid="onlineData.oid" :is-edit="false" :file-list="onlineData.reFileVoList"
                                        :attachment="ATTACHMENT_ENUMS"></factory-upload>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <ice-persion-by-dept-selector :grid-index="false" :deptCode="currentOrgCode"
                                      chooseItem="multiple" mode="hidden"
                                      :ref="PAGE_ENUM.SELECT_PERSONS_BY_DEPT_CODE.REF"
                                      v-if="PAGE_ENUM.SELECT_PERSONS_BY_DEPT_CODE.SHOW"
                                      @select-confirm="selectPersonByDeptCodeConfirm"></ice-persion-by-dept-selector>
        <ice-persion-selector :grid-index="false"
                              chooseItem="multiple" mode="hidden"
                              :ref="PAGE_ENUM.SELECT_PERSONS.REF"
                              allDept="true"
                              v-if="PAGE_ENUM.SELECT_PERSONS.SHOW"
                              @select-confirm="selectPersonConfirm"></ice-persion-selector>
        <ice-dept-selector mode="hidden"
                           choose-item="multiple"
                           :ref="PAGE_ENUM.SELECT_DEPTS.REF"
                           allDept="true"
                           v-if="PAGE_ENUM.SELECT_DEPTS.SHOW"
                           @select-confirm="selectDeptConfirm"></ice-dept-selector>
        <el-dialog v-dialogDrag title="承建商上传资料" custom-class="ice-dialog" center
                   :visible.sync="PAGE_ENUM.FACTORY_DIALOG.SHOW" :ref="PAGE_ENUM.FACTORY_DIALOG.REF"
                   v-if="PAGE_ENUM.FACTORY_DIALOG.SHOW" width="70%" heigth="70%"
                   :close-on-press-escape="false"
                   append-to-body :close-on-click-modal="false">
            <div style="height: 400px">
                <div style="width: 100%;height: 100%">
                    <factory-upload :oid="onlineData.oid" :is-edit="true"
                                    :attachment="ATTACHMENT_ENUMS" @selectComfirm="factoryUploadSuccess"
                                    @selectCannel="factoryUploadCancel" :file-list="onlineData.reFileVoList"
                                    :ref="PAGE_ENUM.FACTORY_UPLOAD.REF"></factory-upload>
                </div>
            </div>
        </el-dialog>
        <dev-edit :is-edit="true" :ref="PAGE_ENUM.DEV_EDIT.REF" :category-type="ENUMS.CATEGORY_TYPE.SYSTEM.CODE"
                  :dev-id="onlineData.devId" :show-copy-button="false"
                  v-if="PAGE_ENUM.DEV_EDIT.SHOW" :on-close-handler="closeEditHandler"></dev-edit>
    </div>
</template>

<script>
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptPersionSelector from "@/components/common/biz/IceDeptPersionSelector";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IcePersionByDeptSelector from "@/components/common/biz/IcePersionByDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import UploadAttachment from "../../dev/comm/uploadAttachment";
    import FactoryForm from "../../dev/comm/factoryForm";
    import FactoryUpload from "./factoryUpload";
    import DevEdit from "../../dev/devEdit";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import attachment from "../comm/attachment";
    import institutePublic from "../comm/public";

    export default {
        name: "edit",
        components: {
            DevEdit,
            FactoryUpload,
            FactoryForm,
            UploadAttachment,
            IcePersionSelector,
            IcePersionByDeptSelector,
            IceEditableTableColumn,
            IceEditableTable, IceDeptSelector, IceDeptPersionSelector, IceSelect, IceGridLayout, IceFlowForm
        },
        mixins: [bizComm, devComm, attachment, institutePublic],
        data() {
            let _this = this;
            let validateFile = function (rule, value, callback) {
                if (!_this.attachmentMap[rule.field] || _this.attachmentMap[rule.field].length == 0) {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            return {
                //是否只读
                readOnly: false,
                PAGE_ENUM: {
                    COMPETENT_GRID: {REF: "componentGrid", CURRENT_SELECTS: []},//主管部门联系人表格
                    OWNER_GRID: {REF: "ownerGrid", CURRENT_SELECTS: []},//运维单位联系人表格
                    USE_DEPT_GRID: {REF: "userDeptGrid", CURRENT_SELECTS: []},//使用单位表格
                    FACTORY_GRID: {REF: "factoryGrid"},//承建单位表格
                    MANAGE_GRID: {REF: "manageGrid", CURRENT_SELECTS: []},//系统三员表格
                    SELECT_PERSONS_BY_DEPT_CODE: {REF: "selectPersonByDeptCode", SHOW: false},
                    SELECT_PERSONS: {REF: "selectPerson", SHOW: false},
                    SELECT_DEPTS: {REF: "selectDept", SHOW: false},
                    FIELDS: {
                        DEPT_CODE: "deptCode",
                        USER_CODE: "userCode"
                    },
                    FACTORY_UPLOAD: {REF: "factoryUplaod", SHOW: false},
                    FACTORY_DIALOG: {REF: "factoryUplaodDialog", SHOW: false},
                    DEV_EDIT: {REF: "devEdit", SHOW: false},
                    //部门选择以及人员选择mode
                    MODE: "onlySelect",
                    //部门选择以及人员选择mode值
                    MODE_TYPE: {
                        READ_ONLY: "readonly",
                        ONLY_SELECT: "onlySelect"
                    }
                },
                onlineData: {
                    formCode: "",
                    devId: "",
                    oid: "",//oid
                    name: "",//系统名称
                    systemLevel: 1,//系统级别
                    secretLevel: 1,//系统密级
                    deployMode: 1,//部署模式
                    source: 1,//系统来源
                    creatorContact: "",//申请人联系电话
                    competentDeptName: "",//业务主管部门
                    netAreaAndType: "",//联网区域
                    netArea: "",//
                    netType: "",//
                    competentUserList: [],//主管部门联系人
                    introduce: "",//功能介绍
                    ownerUserList: [],//运维部门联系人
                    ownerName: "",//运维部门责任人
                    ownerDeptName: "",//运维部门
                    ownerOrgName: "",//运维单位
                    useDeptList: [],//使用范围
                    factoryList: [],//承建单位
                    factoryUserList: [],//承建单位联系人
                    managerUserList: [],//系统三元
                    reFileVoList: [],//附件list
                    remark: "",//备注
                    state: "",//状态
                    jGDept: "",//机关单位
                    isConstractionDept: "",
                    competentDeptCode: "",//主管部门code
                    orgCode: "",//主管部门orgCode
                    ownerCode: "",//运维部门责任人code
                    ownerDeptCode: "",//运维部门code
                    ownerOrgCode: "",//运维部门orgCode
                    tacticsChange: "",//策略变更
                    typeCode: "",
                    isCompetentDept: "",
                    ComponentContact: "",//主管部门联系人员指定流程角色
                },
                rules: {//表单字段规则
                    name: {required: true, message: "请输入系统名称", trigger: "change"},
                    creatorContact: {required: true, message: "请输入申请人联系电话", trigger: "change"},
                    systemLevel: {required: true, message: '请选择系统级别', trigger: 'change'},
                    secretLevel: {required: true, message: '请选择密级', trigger: 'change'},
                    deployMode: {required: true, message: '请选择部署模式', trigger: 'change'},
                    source: {required: true, message: '请选择系统来源', trigger: 'change'},
                    netAreaAndType: {required: true, message: '请选择联网类型', trigger: 'change'},
                    competentDeptName: {required: true, message: '请选择业务主管部门', trigger: 'change'},
                    ownerName: {required: true, message: '请选择运维部门责任人', trigger: 'change'},
                    jsfa: {required: true, message: '请上传系统建设方案', validator: validateFile, trigger: 'blur'},
                    psyj: {required: true, message: '请上传评审意见', validator: validateFile, trigger: 'blur'}
                },
                manageRules: {
                    contact: {required: false, message: '请输入联系方式', trigger: 'change'},
                    userType: {required: true, message: '请选择用户类型'},
                },
                factoryTitle: "承建单位",
                currentOperateGrid: "",//当前操作的表格
                currentOrgCode: "",
                factoryEnum: {},
                secretLevelData: {},//数据密级
                attachmentMap: {},//附件map,
                showFactoryAttachment: false,//是否显示承建商上传资料的组件
                tips: "",
                showFactoryGrid: false,//是否显示承建单位组件
                currentNode: "",//当前环节id
                nodeId: {//节点id
                    factoryUpload: "FactoryUpload",//承建商上传资料组件
                    execute: "Execute",//实施节点
                    createDev: "CreateDev"//建立台账节点
                }
            };
        },
        methods: {
            setFactoryComponent() {
                let map = {};
                this.assembleAttachmentMap(this.onlineData.reFileVoList, map);
                if (map[this.ATTACHMENT_ENUMS.institute_pzsc] || map[this.ATTACHMENT_ENUMS.institute_zyxq] || map[this.ATTACHMENT_ENUMS.institute_ywsc]) {
                    this.showFactoryAttachment = true;
                }
            },
            /**
             * 初始化页面数据
             * @param flowcont
             * @param data
             */
            flowReady(flowcont, bizdata) {
                this.currentNode = flowcont.nodeId;
                if (this.$route.query.readOnly) {
                    this.readOnly = JSON.parse(this.$route.query.readOnly);
                }
                if (bizdata.onlineDTO) {
                    //编辑
                    Object.assign(this.onlineData, bizdata.onlineDTO);
                    this.initNetAreaAndNetType(this.onlineData.netType, this.onlineData.netArea);
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.READ_ONLY;
                    //当承建商已经上传了资料，设置承建商上传资料的组件为显示
                    this.setFactoryComponent();
                } else {
                    //新增
                    this.onlineData.creatorContact = bizdata.afPhone;
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.ONLY_SELECT;
                }
                this.showFactoryGrid = true;
            },
            /**
             * 流程按钮
             * @param flowcont
             * @param data
             */
            flowOperateBtn(flowContext, bizdata) {
                let _this = this;
                this.assembleAttachmentMap(this.onlineData.reFileVoList, this.attachmentMap);
                /*      flowContext.processVar = {
                          systemLevel: this.onlineData.systemLevel,
                          jGDept: this.onlineData.jGDept,
                          isConstractionDept: this.onlineData.isConstractionDept,
                          isCompetentDept: this.onlineData.isCompetentDept
                      };*/
                if (flowContext.nodeId == this.nodeId.factoryUpload) {
                    if (!this.attachmentMap[this.ATTACHMENT_ENUMS.institute_pzsc] || !this.attachmentMap[this.ATTACHMENT_ENUMS.institute_zyxq] || !this.attachmentMap[this.ATTACHMENT_ENUMS.institute_ywsc]) {
                        this.$alert("请先上传相关资料", "提示", {
                            confirmButtonText: '确定',
                            callback: action => {
                                _this.factoryUpload();
                            }
                        });
                        return false;
                    }
                    return true;
                } else if (flowContext.nodeId == this.nodeId.createDev) {
                    return new Promise((resolve, reject) => {
                        this.checkDevFields().then(() => {
                            resolve(true);
                        }).catch(() => {
                            this.$alert("请先补全设备台账", "提示", {
                                confirmButtonText: '确定',
                                callback: action => {
                                    _this.additionDev();
                                }
                            });
                            reject(false);
                        });
                    });
                } else {
                    return Promise.all([this.$refs.online.validate(),
                        this.onGridValidation(),
                        this.$refs[this.PAGE_ENUM.FACTORY_GRID.REF].validateFactorys(),
                        this.onManagersGridValidate()]);
                    /* if (this.onGridValidation() && this.onManagersGridValidate()) {
                         return this.$refs.online.validate();
                     }*/
                    // return true;
                }
            },
            /**
             * 向流程引擎提交封装的数据
             * @returns {onlineData|{}}
             */
            flowBizData() {
                this.setSpecialPerson();
                this.onlineData.typeCode = this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.online.code;
                this.assembleFactoryList();
                console.log(JSON.stringify(this.onlineData));
                return {
                    systemLevel: this.onlineData.systemLevel,
                    type: this.onlineData.typeCode,
                    onlineDTO: this.onlineData
                };
            },
            setSpecialPerson() {
                this.onlineData.ComponentContact = this.convertToString("userCode", this.onlineData.competentUserList, ",");
            },
            /**
             * 流程扩展按钮(承建商上传资料)
             */
            factoryUpload() {
                this.PAGE_ENUM.FACTORY_UPLOAD.SHOW = true;
                this.PAGE_ENUM.FACTORY_DIALOG.SHOW = true;
            },
            /**
             * 建立台账阶段补全设备台账
             */
            additionDev() {
                this.PAGE_ENUM.DEV_EDIT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.DEV_EDIT.REF].openDialog();
                });
            },
            /**
             * 人员选择后触发
             */
            selectPersonByDeptCodeConfirm(datas) {
                this.PAGE_ENUM.SELECT_PERSONS_BY_DEPT_CODE.SHOW = false;
                if (this.currentOperateGrid == this.PAGE_ENUM.COMPETENT_GRID.REF) {
                    this.setUserListData(datas, this.onlineData.competentUserList, this.ENUMS.USER_TYPE_DATA.PRINCIPAL_LINKMAN);
                } else if (this.currentOperateGrid == this.PAGE_ENUM.OWNER_GRID.REF) {
                    this.setUserListData(datas, this.onlineData.ownerUserList, this.ENUMS.USER_TYPE_DATA.SERVER_LINKMAN);
                }
            },
            /**
             * 系统三员选中后触发
             */
            selectPersonConfirm(datas) {
                this.PAGE_ENUM.SELECT_PERSONS.SHOW = false;
                this.setUserListData(datas, this.onlineData.managerUserList);
            },
            /**
             * 单位选择后触发
             */
            selectDeptConfirm(datas) {
                this.PAGE_ENUM.SELECT_DEPTS.SHOW = false;
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(this.onlineData.useDeptList, _data.deptCode, this.PAGE_ENUM.FIELDS.DEPT_CODE) == -1) {
                        this.onlineData.useDeptList.push({
                            id: "",
                            deptCode: _data.deptCode,
                            orgCode: _data.orgCode,
                            deptName: _data.deptShortName + "[" + _data.orgName + "]"
                        });
                    }
                }
            },
            /**
             * 业务主管部门选择后触发
             * @param data
             */
            componentDeptSelect(data) {
                if (this.onlineData.orgCode != data[0].orgCode) {
                    this.onlineData.competentUserList = [];
                }
                this.onlineData.competentDeptName = data[0].deptName + "[" + data[0].orgName + "]";
                this.onlineData.competentDeptCode = data[0].deptCode;
                this.onlineData.orgCode = data[0].orgCode;
            },
            /**
             * 人员选择按钮响应事件
             * @param e
             */
            addRow(e) {
                if (e == this.PAGE_ENUM.COMPETENT_GRID.REF || e == this.PAGE_ENUM.OWNER_GRID.REF) {
                    //主管部门联系人或运维部门联系人表格
                    if (this.checkData(e)) {
                        this.setCurrentOrgCode(e);
                        this.PAGE_ENUM.SELECT_PERSONS_BY_DEPT_CODE.SHOW = true;
                        this.$nextTick(() => {
                            this.$refs[this.PAGE_ENUM.SELECT_PERSONS_BY_DEPT_CODE.REF].openDialog();
                        });
                    }
                } else if (e == this.PAGE_ENUM.MANAGE_GRID.REF) {
                    //系统三员表格
                    this.PAGE_ENUM.SELECT_PERSONS.SHOW = true;
                    this.$nextTick(() => {
                        this.$refs[this.PAGE_ENUM.SELECT_PERSONS.REF].openDialog();
                    });
                } else if (e == this.PAGE_ENUM.USE_DEPT_GRID.REF) {
                    //使用单位表格
                    this.PAGE_ENUM.SELECT_DEPTS.SHOW = true;
                    this.$nextTick(() => {
                        this.$refs[this.PAGE_ENUM.SELECT_DEPTS.REF].openDialog();
                    });
                }
            },
            /**
             * 选择主管部门联系人或运维部门联系人时，检查是否选择了主管部门或运维部门联系人
             * @param e
             * @returns {boolean}
             */
            checkData(e) {
                if (e == this.PAGE_ENUM.COMPETENT_GRID.REF) {
                    if (this.onlineData.competentDeptCode == "") {
                        this.$message.warning("请先选择业务主管部门");
                        return false;
                    }
                } else if (e == this.PAGE_ENUM.OWNER_GRID.REF) {
                    if (this.onlineData.ownerCode == "") {
                        this.$message.warning("请先选择运维部门责任人");
                        return false;
                    }
                }
                return true;
            },
            /**
             * 设置当前操作的orgcode
             * @param e
             */
            setCurrentOrgCode(e) {
                this.currentOperateGrid = e;
                if (e == this.PAGE_ENUM.COMPETENT_GRID.REF) {
                    this.currentOrgCode = this.onlineData.orgCode;
                } else if (e == this.PAGE_ENUM.OWNER_GRID.REF) {
                    this.currentOrgCode = this.onlineData.ownerOrgCode;
                }
            },
            /**
             * 删除人员按钮响应事件
             * @param e
             */
            deleteRow(e) {
                if (e == this.PAGE_ENUM.COMPETENT_GRID.REF) {
                    //主管部门联系人
                    this.delete(this.onlineData.competentUserList, this.PAGE_ENUM.COMPETENT_GRID.CURRENT_SELECTS);
                } else if (e == this.PAGE_ENUM.OWNER_GRID.REF) {
                    //运维部门联系人
                    this.delete(this.onlineData.ownerUserList, this.PAGE_ENUM.OWNER_GRID.CURRENT_SELECTS);
                } else if (e == this.PAGE_ENUM.MANAGE_GRID.REF) {
                    //系统三员
                    this.delete(this.onlineData.managerUserList, this.PAGE_ENUM.MANAGE_GRID.CURRENT_SELECTS);
                } else if (e == this.PAGE_ENUM.USE_DEPT_GRID.REF) {
                    //使用单位
                    this.delete(this.onlineData.useDeptList, this.PAGE_ENUM.USE_DEPT_GRID.CURRENT_SELECTS);
                }
            },
            /**
             * 删除list
             * @param list
             * @param deleteList
             */
            delete(list, deleteList) {
                if (deleteList.length == 0) {
                    this.$alert("请选择需要删除的数据", "提示");
                    return;
                }
                this.deletes(list, deleteList);
            },
            /**
             * 设置userlist数据
             * @param datas
             * @param userList
             */
            setUserListData(datas, userList, userType) {
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(userList, _data.code, this.PAGE_ENUM.FIELDS.USER_CODE) == -1) {
                        userList.push({
                            id: "",
                            userType: userType || "",
                            contact: _data.landlineTel ? _data.landlineTel : "",
                            userName: _data.name,
                            userCode: _data.code,
                            deptCode: _data.deptCode,
                            deptName: _data.deptShortName,
                            orgCode: _data.dataOrgCode,
                            orgName: _data.orgName
                        });
                    }
                }
            },
            /**
             * 选择运维部门责任人后触发
             * @param data
             */
            ownerUserSelect(data) {
                if (this.onlineData.ownerOrgCode != data[0].dataOrgCode) {
                    this.onlineData.ownerUserList = [];
                }
                this.onlineData.ownerCode = data[0].code;
                this.onlineData.ownerName = data[0].name;
                this.onlineData.ownerDeptName = data[0].deptShortName + "[" + data[0].orgShortName + "]";
                this.onlineData.ownerDeptCode = data[0].deptCode;
                this.onlineData.ownerOrgCode = data[0].dataOrgCode;
                this.onlineData.ownerOrgName = data[0].orgShortName;
            },
            /**
             * 业务主管部门联系人选中事件
             * @param row
             */
            componentSelectionChange(row) {
                this.PAGE_ENUM.COMPETENT_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 运维部门联系人选中事件
             * @param row
             */
            ownerSelectionChange(row) {
                this.PAGE_ENUM.OWNER_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 系统三员选中后事件
             * @param row
             */
            manageUserSelectionChange(row) {
                this.PAGE_ENUM.MANAGE_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 使用单位选中事件
             * @param row
             */
            useDeptSelectionChange(row) {
                this.PAGE_ENUM.USE_DEPT_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 组装承建单位的list
             */
            assembleFactoryList() {
                let data = this.$refs[this.PAGE_ENUM.FACTORY_GRID.REF].getData();
                this.onlineData.factoryList = data.factoryList;
                this.onlineData.factoryUserList = data.factoryUserList;
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                for (let i = 0; i < this.ENUMS.FACTORY_TYPE_DATA.length; i++) {
                    let _data = this.ENUMS.FACTORY_TYPE_DATA[i];
                    this.factoryEnum[_data.name] = _data.code;
                }
                this.initSecretLevelData();
                this.tips = this.INSTITUTE_ENUMS.APP_SYSTEM_PROMPT_DATA.length > 0 ? this.INSTITUTE_ENUMS.APP_SYSTEM_PROMPT_DATA[0].remark : "";
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType(netType, netArea) {
                if (netArea) {
                    this.onlineData.netAreaAndType = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                } else {
                    this.onlineData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 初始化数据密级map
             */
            initSecretLevelData() {
                for (let i = 0; i < this.ENUMS.DATA_SECRET_LEVEL_DATA.length; i++) {
                    let _secret = this.ENUMS.DATA_SECRET_LEVEL_DATA[i];
                    this.secretLevelData[_secret.name] = _secret.code;
                }
                this.secretLevelData.properties = this.ENUMS.DATA_SECRET_LEVEL_DATA;
            },
            /**
             * 删除附件的回调
             * @param res
             * @param childType
             */
            removeAttachment(res, childType) {
                this.uploadSuccessHandler(res, childType);
            },
            /**
             * 附件上传成功后的回调
             * @param data
             * @param childType
             */
            uploadSuccessHandler(data, childType) {
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType, this.onlineData.reFileVoList);
            },
            /**
             * 页面表格的校验
             * @returns {boolean}
             */
            onGridValidation() {
                let validate = true;
                return new Promise((resolve, reject) => {
                    if (this.onlineData.competentUserList.length == 0) {
                        this.$alert('请选择需要主管部门联系人', '提示', {
                            confirmButtonText: '确定'
                        });
                        validate = false;
                    }
                    if (this.onlineData.ownerUserList.length == 0) {
                        this.$alert('请选择需要运维部门联系人', '提示', {
                            confirmButtonText: '确定'
                        });
                        validate = false;
                    }
                    if (this.onlineData.useDeptList.length == 0) {
                        this.$alert('请选择使用单位', '提示', {
                            confirmButtonText: '确定'
                        });
                        validate = false;
                    }
                    if (this.onlineData.factoryList.length == 0) {
                        this.$alert('请选择承建单位', '提示', {
                            confirmButtonText: '确定'
                        });
                        validate = false;
                    }
                    if (validate) {
                        resolve();
                    } else {
                        reject();
                    }
                });
            },
            /**
             * 承建商上传成功
             * @param list
             */
            factoryUploadSuccess(list) {
                this.PAGE_ENUM.FACTORY_DIALOG.SHOW = false;
                this.PAGE_ENUM.FACTORY_UPLOAD.SHOW = false;
                this.$nextTick(() => {
                    this.showFactoryAttachment = true;
                });
            },
            /**
             * 承建商取消上传
             */
            factoryUploadCancel() {
                this.PAGE_ENUM.FACTORY_DIALOG.SHOW = false;
                this.PAGE_ENUM.FACTORY_UPLOAD.SHOW = false;
                this.setFactoryComponent();
            },
            /**
             * 设备编辑页面关闭的回调
             * @param e
             */
            closeEditHandler(e) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.PAGE_ENUM.DEV_EDIT.SHOW = false;
                    resolve();
                });
            },
            /**
             *判断设备台账必填项
             * @returns {Promise<unknown>}
             */
            checkDevFields() {
                let _this = this;
                return new Promise((reslove, reject) => {
                    this.loadDevById(this.onlineData.devId).then(res => {
                        let _data = res.dataDTO.commDTO;
                        Object.assign(_data, res.dataDTO.extendData);
                        let fieldArr = [];
                        let secret = _data.secret;
                        if (secret == _this.ENUMS.YES_NO.YES) {
                            fieldArr = ["currentPlace", "checkDeptName", "netType"];
                        } else {
                            fieldArr = ["currentPlace", "netType"];
                        }
                        for (let i = 0; i < fieldArr.length; i++) {
                            let _field = fieldArr[i];
                            let _value = null;
                            _value = _data[_field];
                            if (!_value) {
                                reject();
                                break;
                            }
                        }
                        reslove();
                    }).catch(res => {

                    });
                });
            },
            /**
             * 联网区域改变时
             * @param e
             */
            onNetAreaChanged(e) {
                let _code = e.split(this.ENUMS.NET_SEPARATOR());
                this.onlineData.netArea = _code[0];
                this.onlineData.netType = _code[1];
            },
            /**
             * 三元的校验
             * @returns {Promise<any>}
             */
            onManagersGridValidate() {
                if (this.onlineData.secretLevel >= this.ENUMS.DATA_SECRET_LEVEL_DATA[2].code) {
                    let _this = this;
                    let returnValue = false;
                    let managersData = this.onlineData.managerUserList;
                    return new Promise((resolve, reject) => {
                        this.$refs[this.PAGE_ENUM.MANAGE_GRID.REF].validateAll((valid) => {
                            if (!managersData || managersData.length < _this.ENUMS.MANAGER_TYPE_DATA.properties.length) {
                                _this.$alert('请选择三员!', '提示', {
                                    confirmButtonText: '确定'
                                });
                                valid = false;
                            } else {
                                valid = this.userTypeValidate(managersData, true);
                            }
                            if (valid) {
                                resolve();
                            } else {
                                reject();
                            }
                        });
                    });
                } else {
                    return true;
                }
            },
            /**
             * 三元类型的校验
             * @param managersData
             * @param validate
             * @returns {boolean}
             */
            userTypeValidate(managersData, validate) {
                //超过三条记录的检测三员是否全部设置完成
                let counts = {
                    1: 0, 2: 0, 3: 0
                };
                //遍历grid,校验是否每条都设置了管理员
                for (let i = 0; i < managersData.length; i++) {
                    let _data = managersData[i];
                    if (!!!_data.userType) {
                        this.$alert('请为每位管理员设置管理员类型!', '提示', {
                            confirmButtonText: '确定'
                        });
                        validate = false;
                        break;
                    } else {
                        counts[_data.userType]++;
                    }
                }
                //校验是否全部管理员都做了设置
                if (validate) {
                    for (let i = 0; i < this.ENUMS.MANAGER_TYPE_DATA.properties.length; i++) {
                        if (counts[i] == 0) {
                            this.$alert(this.ENUMS.MANAGER_TYPE_DATA.properties[i].name + "没有设置!", '提示', {
                                confirmButtonText: '确定'
                            });
                            validate = false;
                            break;
                        }
                    }
                }
                return validate;
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FACTORY_TYPE.CODE,
                    this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.DEPLOY_MODE.CODE,
                    this.ENUMS.DATA_DICTIONARY.APP_SYSTEM_ORIGIN.CODE),
                this.requestNetAreaTypeData(), this.assembleInstitueEnumByDataDictionary(this.INSTITUTE_ENUMS.DATA_DICTIONARY.APP_SYSTEM_PROMPT.CODE)
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        }
    }
</script>

<style scoped>
    @import "../../dev/style/edit.less";

    .divContent {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: white;
        overflow-y: auto;
    }

    .text {
        width: 150px;
        text-align: right;
        padding-right: 12px;
    }

    .form-content {
        width: 2500px;
    }

    .btn {
        width: 90%;
        /*padding-left: 4px;*/
    }
</style>