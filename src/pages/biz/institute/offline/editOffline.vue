<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm"
                       :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="offlineData" status-icon ref="offline"
                         label-width="120px" :rules="rules" :disabled="readOnly">
                    <ice-grid-layout name="系统基本信息" :columns="3">
                        <el-form-item label="系统名称" prop="name">
                            <el-input v-model="offlineData.name" :disabled="flowScope.formReadonly" :readonly="true">
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline" :disabled="flowScope.formReadonly"
                                               @click="chooseDev(INSTITUTE_ENUMS.INSTITUTE_TYPE.OFFLINE)"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="系统级别">
                            <el-select v-model="offlineData.systemLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统密级">
                            <el-select v-model="offlineData.secretLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联网区域">
                            <el-select v-model="offlineData.netAreaAndType" :disabled="true">
                                <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                           :key="item.code"
                                           :label="item.name"
                                           :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人电话" prop="creatorContact">
                            <el-input v-model="offlineData.creatorContact"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="系统来源">
                            <el-select v-model="offlineData.source" :disabled="true">
                                <el-option v-for="item in ENUMS.APP_SYSTEM_ORIGIN_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务主管部门">
                            <el-input v-model="offlineData.competentDeptName" :disabled="true"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>主管部门<br>联系人</div>
                            <ice-editable-table layout="3" :ref="OFFLINE_PAGE_ENUM.COMPETENT_GRID.REF" :rules="rules"
                                                :data="offlineData.competentUserList" height="200">
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
                        <factory-form :title="factoryTitle" layout="3" :is-edit="false"
                                      :factory-list="offlineData.factoryList" :ref="OFFLINE_PAGE_ENUM.FACTORY_GRID.REF"
                                      :factory-user-list="offlineData.factoryUserList" :show-type="false"
                                      :oid="offlineData.oid" :rele-type="factoryEnum['承建商']"></factory-form>
                    </ice-grid-layout>
                    <ice-grid-layout name="系统下线信息" :columns="2">
                        <el-form-item label="软件处理方式" prop="softDealWay">
                            <el-select placeholder="请选择" v-model="offlineData.softDealWay"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="(item,index) in INSTITUTE_ENUMS.DATA_DEAL_TYPE_DATA.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="数据处理方式" prop="dataDealWay">
                            <el-select placeholder="请选择" v-model="offlineData.dataDealWay"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="(item,index) in INSTITUTE_ENUMS.DATA_DEAL_TYPE_DATA.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="软件存档周期(个月)" prop="softSaveTimeLimit"
                                      v-if="offlineData.softDealWay == INSTITUTE_ENUMS.DATA_DEAL_TYPE_DATA.COMPONENT_SAVE">
                            <el-input-number size="small" v-model="offlineData.softSaveTimeLimit"
                                             :min="OFFLINE_PAGE_ENUM.MIN"
                                             :max="OFFLINE_PAGE_ENUM.MAX"></el-input-number>
                        </el-form-item>
                        <el-form-item label="数据存档周期(个月)" prop="dataSaveTimeLimit"
                                      v-if="offlineData.dataDealWay == INSTITUTE_ENUMS.DATA_DEAL_TYPE_DATA.COMPONENT_SAVE">
                            <el-input-number size="small" v-model="offlineData.dataSaveTimeLimit"
                                             :min="OFFLINE_PAGE_ENUM.MIN"
                                             :max="OFFLINE_PAGE_ENUM.MAX"></el-input-number>
                        </el-form-item>
                        <el-form-item label="下线原因" layout="2">
                            <el-input type="textarea" :rows="3" v-model="offlineData.downLineReason"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="相关附件" layout="2">
                            <div class="attachmentBorder">
                                <upload-attachment :is-edit="!flowScope.formReadonly"
                                                   v-if="showFile"
                                                   :remove-call-back="removeAttachment"
                                                   :dev-id="offlineData.oid"
                                                   :child-type="ATTACHMENT_ENUMS.institute_xxfj"
                                                   :upload-success="uploadSuccessHandler"
                                                   :file-info="offlineData.reFileVoList"></upload-attachment>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" layout="2">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="offlineData.remark"></el-input>
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
    import IceSelect from "@/components/common/base/IceSelect";
    import DevSelect from "../../dev/devSelect";
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import FactoryForm from "../../dev/comm/factoryForm";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import UploadAttachment from "../../dev/comm/uploadAttachment";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "editOffline",
        components: {
            DevSelect,
            IceSelect,
            UploadAttachment,
            IceEditableTableColumn,
            IceEditableTable,
            FactoryForm,
            IceGridLayout,
            IceFlowForm
        },
        mixins: [bizComm, devComm, attachment, institutePublic, renderer],
        data() {
            return {
                readOnly: false,
                OFFLINE_PAGE_ENUM: {
                    COMPETENT_GRID: {
                        REF: "componentGrid",
                    },
                    FACTORY_GRID: {REF: "factoryGrid"},
                    MIN: 1,
                    MAX: 12
                },
                offlineData: {
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
                    isConstractionDept: "",
                    tacticsChange: "",
                    deployMode: "",
                    secretSn: "",
                    useDeptList: [],
                    factoryList: [],
                    factoryUserList: [],
                    competentUserList: [],
                    softDealWay: "",
                    softSaveTimeLimit: 1,
                    dataDealWay: "",
                    dataSaveTimeLimit: 1,
                    downLineReason: "",
                    reFileVoList: [],
                    isCompetentDept: ""
                },
                rules: {
                    name: {required: true, message: "请选择系统名称", trigger: "change"},
                    creatorContact: {required: true, message: "请输入申请人联系电话", trigger: "change"},
                    softDealWay: {required: true, message: "请选择软件处理方式", trigger: "change"},
                    dataDealWay: {required: true, message: "请选择数据处理方式", trigger: "change"},
                    softSaveTimeLimit: {required: true, message: "请选择软件存档周期", trigger: "change"},
                    dataSaveTimeLimit: {required: true, message: "请选择数据存档周期", trigger: "change"},
                },
                factoryEnum: {},
                factoryTitle: "承建单位",
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
                if (bizdata.offlineDTO) {
                    //编辑
                    Object.assign(this.offlineData, bizdata.offlineDTO);
                    this.initNetAreaAndNetType(this.offlineData.netType, this.offlineData.netArea);
                } else {
                    //新增
                    this.offlineData.creatorContact = bizdata.afPhone;
                }
                this.showFile = true;
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType(netType, netArea) {
                if (netArea) {
                    this.offlineData.netAreaAndType = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                } else {
                    this.offlineData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 流程按钮
             * @param flowcont
             * @param data
             */
            flowOperateBtn(flowContext, bizdata) {
                this.assembleAttachmentMap(this.offlineData.reFileVoList, this.attachmentMap);
                /*   flowContext.processVar = {
                       systemLevel: this.offlineData.systemLevel,
                       jGDept: this.offlineData.jGDept,
                       isConstractionDept: this.offlineData.isConstractionDept,
                       isCompetentDept: this.offlineData.isCompetentDept
                   };*/
                return this.$refs['offline'].validate();
            },
            /**
             * 向流程引擎提交封装的数据
             * @returns {powerData|{}}
             */
            flowBizData() {
                this.offlineData.typeCode = this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.offline.code;
                console.log(JSON.stringify(this.offlineData));
                return {
                    systemLevel: this.offlineData.systemLevel,
                    type: this.offlineData.typeCode,
                    offlineDTO: this.offlineData
                };
            },
            /**
             * 删除附件的回调
             * @param res
             * @param childType
             */
            removeAttachment(res, childType) {
                this.attachmentMap[childType] = res;
                this.setReFileVoList(res, childType, this.offlineData.reFileVoList);
            },
            /**
             * 附件上传成功后的回调
             * @param data
             * @param childType
             */
            uploadSuccessHandler(data, childType) {
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType, this.offlineData.reFileVoList);
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                for (let i = 0; i < this.ENUMS.FACTORY_TYPE_DATA.length; i++) {
                    let _data = this.ENUMS.FACTORY_TYPE_DATA[i];
                    this.factoryEnum[_data.name] = _data.code;
                }
            }
        },
        mounted() {
            let prepareTaskChain = [
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