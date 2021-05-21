<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm"
                       :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="modifyData" status-icon ref="modify"
                         label-width="120px" :rules="rules" :disabled="readOnly">
                    <ice-grid-layout name="系统基本信息" :columns="3">
                        <el-form-item label="系统名称" prop="name">
                            <el-input v-model="modifyData.name" :disabled="flowScope.formReadonly" :readonly="true">
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline" :disabled="flowScope.formReadonly"
                                               @click="chooseDev(INSTITUTE_ENUMS.INSTITUTE_TYPE.MODIFY)"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="系统级别">
                            <el-select v-model="modifyData.systemLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统密级">
                            <el-select v-model="modifyData.secretLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联网区域">
                            <el-select v-model="modifyData.netAreaAndType" :disabled="true">
                                <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                           :key="item.code"
                                           :label="item.name"
                                           :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人电话" prop="creatorContact">
                            <el-input v-model="modifyData.creatorContact"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="系统来源">
                            <el-select v-model="modifyData.source" :disabled="true">
                                <el-option v-for="item in ENUMS.APP_SYSTEM_ORIGIN_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务主管部门">
                            <el-input v-model="modifyData.competentDeptName" :disabled="true"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>主管部门<br>联系人</div>
                            <ice-editable-table layout="3" :ref="MODIFY_PAGE_ENUM.COMPETENT_GRID.REF"
                                                :rules="manageRules"
                                                :data="modifyData.competentUserList" height="200">
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
                        <div class="divContent" layout="3">
                            <div class="text">系统三员</div>
                            <ice-editable-table layout="3" :ref="MODIFY_PAGE_ENUM.MANAGE_GRID.REF"
                                                :data="modifyData.managerUserList" height="200" :rules="manageRules">
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
                                                   :disabled="true">
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
                    </ice-grid-layout>
                    <ice-grid-layout name="业务数据修改信息" :columns="2">
                        <div class="tips" layout="2">{{tips}}</div>
                        <el-form-item label="操作类型" prop="optionType">
                            <ice-select v-model="modifyData.optionType" map-type-code="modifyOperation"></ice-select>
                        </el-form-item>
                        <el-form-item label="申请内容" prop="changeContent" layout="2">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="modifyData.changeContent"></el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" prop="changeReason" layout="2">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="modifyData.changeReason"></el-input>
                        </el-form-item>
                        <el-form-item label="相关手册" layout="2">
                            <div class="attachmentBorder">
                                <upload-attachment
                                        v-if="showFile"
                                        :is-edit="!flowScope.formReadonly"
                                        :remove-call-back="removeAttachment"
                                        :dev-id="modifyData.oid"
                                        :child-type="ATTACHMENT_ENUMS.institute_xgfj"
                                        :upload-success="uploadSuccessHandler"
                                        :file-info="modifyData.reFileVoList">
                                </upload-attachment>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" layout="2">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="modifyData.remark"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <dev-select v-if="INSTITUTE_ENUMS.DEV_SELECT.SHOW" :ref="INSTITUTE_ENUMS.DEV_SELECT.REF"
                    :querys="INSTITUTE_ENUMS.QUERY_DEV" :on-close-handler="selectDev"
                    :columns="INSTITUTE_ENUMS.DEV_COLUMNS"
                    :filter-tree-data="INSTITUTE_ENUMS.FILTER_TREE_DATA()"></dev-select>
    </div>
</template>

<script>
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import attachment from "../comm/attachment";
    import institutePublic from "../comm/public";
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceSelect from "@/components/common/base/IceSelect";
    import DevSelect from "../../dev/devSelect";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import UploadAttachment from "../../dev/comm/uploadAttachment";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "editModify",
        components: {
            UploadAttachment,
            IceEditableTableColumn, IceEditableTable, DevSelect, IceSelect, IceGridLayout, IceFlowForm
        },
        mixins: [bizComm, devComm, attachment, institutePublic, renderer],
        data() {
            return {
                //是否只读
                readOnly: false,
                MODIFY_PAGE_ENUM: {
                    COMPETENT_GRID: {
                        REF: "componentGrid",
                    },
                    MANAGE_GRID: {REF: "managerGrid"}
                },
                modifyData: {
                    formCode: "",
                    oid: "",
                    name: "",
                    devId: "",
                    systemLevel: "",
                    secretLevel: "",
                    competentDeptName: "",
                    competentDeptCode: "",
                    creatorContact: "",
                    netAreaAndType: "",
                    netArea: "",
                    netType: "",
                    typeCode: "",
                    remark: "",
                    state: "",
                    jGDept: "",
                    tacticsChange: "",
                    deployMode: "",
                    secretSn: "",
                    useDeptList: [],
                    factoryList: [],
                    factoryUserList: [],
                    competentUserList: [],
                    managerUserList: [],
                    reFileVoList: [],
                    changeReason: "",
                    changeContent: "",
                    optionType: ""
                },
                rules: {
                    name: {required: true, message: "请选择系统名称", trigger: "change"},
                    creatorContact: {required: true, message: "请输入申请人联系电话", trigger: "change"},
                    changeContent: {required: true, message: "请输入申请内容", trigger: "change"},
                    optionType: {required: true, message: "请选择操作类型", trigger: "change"}
                },
                manageRules: {
                    optionType: {required: false, message: "请输入联系电话", trigger: "change"}
                },
                tips: "",
                showFile: false,
                attachmentMap: {}
            }
        },
        methods: {
            /**
             * 初始化页面数据
             * @param flowcont
             * @param data
             */
            flowReady(flowcont, bizdata) {
                if (this.$route.query.readOnly) {
                    this.readOnly = JSON.parse(this.$route.query.readOnly);
                }
                if (bizdata.modifyDTO) {
                    //编辑
                    Object.assign(this.modifyData, bizdata.modifyDTO);
                    this.initNetAreaAndNetType(this.modifyData.netType, this.modifyData.netArea);
                } else {
                    //新增
                    this.modifyData.creatorContact = bizdata.afPhone;
                }
                this.showFile = true;
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType(netType, netArea) {
                if (netArea) {
                    this.modifyData.netAreaAndType = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                } else {
                    this.modifyData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 流程按钮
             * @param flowcont
             * @param data
             */
            flowOperateBtn(flowContext, bizdata) {
                this.assembleAttachmentMap(this.modifyData.reFileVoList, this.attachmentMap);
                return this.$refs['modify'].validate();
            },
            /**
             * 向流程引擎提交封装的数据
             * @returns {powerData|{}}
             */
            flowBizData() {
                this.modifyData.typeCode = this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.modify.code;
                console.log(JSON.stringify(this.modifyData));
                return {
                    type: this.modifyData.typeCode,
                    modifyDTO: this.modifyData
                };
            },
            /**
             * 删除附件的回调
             * @param res
             * @param childType
             */
            removeAttachment(res, childType) {
                this.attachmentMap[childType] = res;
                this.setReFileVoList(res, childType, this.modifyData.reFileVoList);
            },
            /**
             * 附件上传成功后的回调
             * @param data
             * @param childType
             */
            uploadSuccessHandler(data, childType) {
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType, this.modifyData.reFileVoList);
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.tips = this.findRemarkByCode(this.INSTITUTE_ENUMS.TIPS_DATA, "modifyTips");
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleInstitueEnumByDataDictionary(this.INSTITUTE_ENUMS.DATA_DICTIONARY.TIPS.CODE),
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.APP_SYSTEM_ORIGIN.CODE),
                this.requestNetAreaTypeData(),
                this.requestCategoryData(),
                this.requestCommStateData()
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
        width: 90px;
        text-align: right;
        padding-right: 12px;
    }

    .form-content {
        width: 2500px;
    }

    .btn {
        width: 90%;
        padding-left: 4px;
    }
</style>