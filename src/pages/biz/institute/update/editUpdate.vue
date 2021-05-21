<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm"
                       :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="updateData" status-icon ref="update"
                         label-width="110px" :rules="rules" :disabled="readOnly">
                    <ice-grid-layout name="系统基本信息" :columns="3">
                        <el-form-item label="系统名称" prop="name">
                            <el-input v-model="updateData.name" :disabled="flowScope.formReadonly" :readonly="true">
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline" :disabled="flowScope.formReadonly"
                                               @click="chooseDev(INSTITUTE_ENUMS.INSTITUTE_TYPE.UPDATE)"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="系统级别">
                            <el-select v-model="updateData.systemLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统密级">
                            <el-select v-model="updateData.secretLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联网区域">
                            <el-select v-model="updateData.netAreaAndType" :disabled="true">
                                <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                           :key="item.code"
                                           :label="item.name"
                                           :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人电话" prop="creatorContact">
                            <el-input v-model="updateData.creatorContact" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="系统来源">
                            <el-select v-model="updateData.source" :disabled="true">
                                <el-option v-for="item in ENUMS.APP_SYSTEM_ORIGIN_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="业务主管部门">
                            <el-input v-model="updateData.competentDeptName" :disabled="true"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>主管部门<br>联系人</div>
                            <ice-editable-table layout="3" :ref="UPDATE_PAGE_ENUM.COMPETENT_GRID.REF"
                                                :rules="supportRules"
                                                :data="updateData.competentUserList" height="200">
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
                                      :factory-list="updateData.factoryList" :ref="UPDATE_PAGE_ENUM.FACTORY_GRID.REF"
                                      :factory-user-list="updateData.factoryUserList" :show-type="false"
                                      :oid="updateData.oid" :rele-type="factoryEnum['承建商']"></factory-form>
                    </ice-grid-layout>
                    <ice-grid-layout name="系统更新信息" :columns="3">
                        <div layout="3" class="tips">{{tips}}</div>
                        <el-form-item label="预计更新开始时间" prop="expectUpdateTime">
                            <el-date-picker v-model="updateData.expectUpdateTime" type="datetime"
                                            :disabled="flowScope.formReadonly" :picker-options="pickerOptions"
                                            format="yyyy-MM-dd HH:mm"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="预计更新结束时间" prop="expectEndTime">
                            <el-date-picker v-model="updateData.expectEndTime" type="datetime"
                                            :disabled="flowScope.formReadonly"
                                            format="yyyy-MM-dd HH:mm"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="是否紧急" prop="urgent">
                            <el-select placeholder="请选择" v-model="updateData.urgent"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="(item,index) in ENUMS.YES_NO.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>软件技术<br>支持人员</div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addRow" class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addUser" class="tableBtn">
                                    选择
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow"
                                           class="tableBtn">删除
                                </el-button>
                                <ice-editable-table layout="2" :ref="UPDATE_PAGE_ENUM.SUPPORT_GRID.REF"
                                                    :data="updateData.supportPersonList" height="200"
                                                    :rules="supportRules"
                                                    @selection-change="supportSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="30">
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
                                    <ice-editable-table-column label="姓名" :disabled="flowScope.formReadonly"
                                                               prop="userName" type="input" :width="360">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column label="部门" :disabled="flowScope.formReadonly"
                                                               prop="deptName" type="input" :width="300">
                                    </ice-editable-table-column>
                                    <el-table-column
                                            label="单位"
                                            v-if="false"
                                            prop="orgName">
                                    </el-table-column>
                                    <ice-editable-table-column label="电话" :disabled="flowScope.formReadonly"
                                                               prop="contact" type="input" :width="300">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                        <el-form-item label="更新文件来源" layout="3" prop="updateSource">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="updateData.updateSource"></el-input>
                        </el-form-item>
                        <el-form-item label="更新原因" layout="3" prop="updateReason">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="updateData.updateReason"></el-input>
                        </el-form-item>
                        <el-form-item label="更新内容" layout="3" prop="updateContent">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="updateData.updateContent"></el-input>
                        </el-form-item>
                        <el-form-item label="部署程序包" layout="3" prop="czsc">
                            <div class="attachmentBorder">
                                <upload-attachment :is-edit="!flowScope.formReadonly"
                                                   :remove-call-back="removeAttachment"
                                                   :dev-id="updateData.oid"
                                                   v-if="showFile"
                                                   :child-type="ATTACHMENT_ENUMS.institute_bsb"
                                                   :upload-success="uploadSuccessHandler"
                                                   :file-info="updateData.reFileVoList"></upload-attachment>
                            </div>
                        </el-form-item>
                        <el-form-item label="部署文件" layout="3" prop="bswj">
                            <div class="attachmentBorder">
                                <upload-attachment :is-edit="!flowScope.formReadonly"
                                                   :remove-call-back="removeAttachment"
                                                   v-if="showFile"
                                                   :dev-id="updateData.oid"
                                                   :child-type="ATTACHMENT_ENUMS.institute_bswj"
                                                   :upload-success="uploadSuccessHandler"
                                                   :file-info="updateData.reFileVoList"></upload-attachment>
                            </div>
                        </el-form-item>
                        <el-form-item label="备注" layout="3">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="updateData.remark"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <dev-select v-if="INSTITUTE_ENUMS.DEV_SELECT.SHOW" :ref="INSTITUTE_ENUMS.DEV_SELECT.REF"
                    :querys="INSTITUTE_ENUMS.QUERY_DEV" :on-close-handler="selectDev"
                    :columns="INSTITUTE_ENUMS.DEV_COLUMNS"
                    :filter-tree-data="INSTITUTE_ENUMS.FILTER_TREE_DATA()"></dev-select>
        <ice-persion-selector :grid-index="false"
                              chooseItem="multiple" mode="hidden"
                              :ref="UPDATE_PAGE_ENUM.SELECT_PERSONS.REF"
                              allDept="true"
                              v-if="UPDATE_PAGE_ENUM.SELECT_PERSONS.SHOW"
                              @select-confirm="selectPersonConfirm">
        </ice-persion-selector>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceSelect from "@/components/common/base/IceSelect";
    import FactoryForm from "../../dev/comm/factoryForm";
    import UploadAttachment from "../../dev/comm/uploadAttachment";
    import DevSelect from "../../dev/devSelect";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import attachment from "../comm/attachment";
    import institutePublic from "../comm/public";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "edit",
        components: {
            IcePersionSelector,
            DevSelect,
            UploadAttachment,
            FactoryForm,
            IceSelect, IceEditableTableColumn, IceEditableTable, IceFlowForm, IceQueryGrid, IceGridLayout
        },
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
                readOnly: false,
                UPDATE_PAGE_ENUM: {
                    COMPETENT_GRID: {
                        REF: "componentGrid",
                    },
                    FACTORY_GRID: {REF: "factoryGrid"},
                    SUPPORT_GRID: {REF: "supportGrid", CURRENT_SELECTS: []},
                    SELECT_PERSONS: {REF: "selectPerson", SHOW: false},
                    FIELDS: {
                        DEPT_CODE: "deptCode",
                        USER_CODE: "userCode"
                    }
                },
                updateData: {
                    formCode: "",
                    oid: "",
                    name: "",
                    devId: "",
                    systemLevel: "",
                    secretLevel: "",
                    creatorContact: "",
                    expectUpdateTime: "",
                    expectEndTime: "",
                    source: "",
                    urgent: "",
                    netAreaAndType: "",
                    netArea: "",
                    netType: "",
                    competentDeptName: "",
                    competentDeptCode: "",
                    competentUserList: [],
                    factoryList: [],
                    factoryUserList: [],
                    updateSource: "",
                    supportPersonList: [],
                    updateReason: "",
                    updateContent: "",
                    remark: "",
                    state: "",
                    tacticsChange: "",
                    deployMode: "",
                    jGDept: "",
                    secretSn: "",
                    useDeptList: [],
                    typeCode: "",
                    reFileVoList: [],
                },
                factoryTitle: "承建单位",
                factoryEnum: {},
                rules: {//表单字段规则
                    name: {required: true, message: "请选择系统名称", trigger: "change"},
                    creatorContact: {required: true, message: "请输入申请人联系电话", trigger: "change"},
                    expectUpdateTime: {required: true, message: "请选择系统更新时间", trigger: "change"},
                    expectEndTime: {required: true, message: "请选择更新结束时间", trigger: "change"},
                    urgent: {required: true, message: "请选择是否紧急", trigger: "change"},
                    updateReason: {required: true, message: "请输入更新原因", trigger: "change"},
                    updateSource: {required: true, message: "请输入更新来源", trigger: "change"},
                    updateContent: {required: true, message: "请输入更新内容", trigger: "change"},
                    bswj: {required: true, validator: validateFile, trigger: 'blur', message: "请上传部署文件"},
                    czsc: {required: true, validator: validateFile, trigger: 'blur', message: "请上传部署程序包"},
                },
                supportRules: {
                    userName: {required: true, message: '请输入用户姓名', trigger: 'change'},
                    deptName: {required: false, message: '请输入用户部门', trigger: 'change'},
                    contact: {required: false, message: '请输入联系方式', trigger: 'change'}
                },
                attachmentMap: {},
                pickerOptions: {
                    disabledDate: (time) => {
                        if (_this.updateData.urgent == _this.ENUMS.YES_NO.NO) {
                            return !(time.getDay() + 1 == 4 || time.getDay() + 1 == 5);
                        }
                    }
                },
                tips: "",
                showFile: false
            }
        },
        mixins: [bizComm, devComm, attachment, institutePublic, renderer],
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
                if (bizdata.updateDTO) {
                    //编辑
                    Object.assign(this.updateData, bizdata.updateDTO);
                    this.initNetAreaAndNetType(this.updateData.netType, this.updateData.netArea);
                } else {
                    //新增
                    this.updateData.creatorContact = bizdata.afPhone;
                }
                this.showFile = true;
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType(netType, netArea) {
                if (netArea) {
                    this.updateData.netAreaAndType = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                } else {
                    this.updateData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 流程按钮
             * @param flowcont
             * @param data
             */
            flowOperateBtn(flowContext, bizdata) {
                this.assembleAttachmentMap(this.updateData.reFileVoList, this.attachmentMap);
                return Promise.all([this.$refs['update'].validate(), this.onGridValidation()]);
                /* if (this.onGridValidation()) {
                     return this.$refs['update'].validate();
                 }*/
            },
            /**
             * 向流程引擎提交封装的数据
             * @returns {updateData|{}}
             */
            flowBizData() {
                this.updateData.typeCode = this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.update.code;
                console.log(JSON.stringify(this.updateData));
                return {
                    type: this.updateData.typeCode,
                    updateDTO: this.updateData
                };
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                for (let i = 0; i < this.ENUMS.FACTORY_TYPE_DATA.length; i++) {
                    let _data = this.ENUMS.FACTORY_TYPE_DATA[i];
                    this.factoryEnum[_data.name] = _data.code;
                }
                this.tips = this.findRemarkByCode(this.INSTITUTE_ENUMS.TIPS_DATA, "dateTip");
            },
            /**
             * 软件技术支持人员选中事件
             * @param row
             */
            supportSelectionChange(row) {
                this.UPDATE_PAGE_ENUM.SUPPORT_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 新增软件技术支持人员
             */
            addRow() {
                this.updateData.supportPersonList.push({
                    userCode: "",
                    userName: "",
                    deptCode: "",
                    deptName: "",
                    orgName: "",
                    contact: "",
                    userType: this.ENUMS.USER_TYPE_DATA.SOFT_SUPPORT
                });
            },
            /**
             * 选择软件技术支持人员
             */
            addUser() {
                this.UPDATE_PAGE_ENUM.SELECT_PERSONS.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.UPDATE_PAGE_ENUM.SELECT_PERSONS.REF].openDialog();
                });
            },
            /**
             * 删除软件技术支持人员
             */
            deleteRow() {
                this.deletes(this.updateData.supportPersonList, this.UPDATE_PAGE_ENUM.SUPPORT_GRID.CURRENT_SELECTS);
            },
            /**
             * 软件技术支持人员选择后
             * @param datas
             */
            selectPersonConfirm(datas) {
                this.setUserListData(datas, this.updateData.supportPersonList, this.ENUMS.USER_TYPE_DATA.SOFT_SUPPORT);
                this.UPDATE_PAGE_ENUM.SELECT_PERSONS.SHOW = false;
            },
            /**
             * 设置userlist数据
             * @param datas
             * @param userList
             */
            setUserListData(datas, userList, userType) {
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(userList, _data.code, this.UPDATE_PAGE_ENUM.FIELDS.USER_CODE) == -1) {
                        userList.push({
                            id: "",
                            userType: userType || "",
                            contact: _data.landlineTel,
                            userName: _data.name,
                            userCode: _data.code,
                            deptCode: _data.deptCode,
                            deptName: _data.deptShortName,
                            orgCode: _data.dataOrgCode
                        });
                    }
                }
            },
            /**
             * 删除附件的回调
             * @param res
             * @param childType
             */
            removeAttachment(res, childType) {
                this.attachmentMap[childType] = res;
                this.setReFileVoList(res, childType, this.updateData.reFileVoList);
            },
            /**
             * 附件上传成功后的回调
             * @param data
             * @param childType
             */
            uploadSuccessHandler(data, childType) {
                this.attachmentMap[childType] = data;
                this.setReFileVoList(data, childType, this.updateData.reFileVoList);
            },
            /**
             * 页面表格的校验
             * @returns {boolean}
             */
            onGridValidation() {
                let _this = this;
                return new Promise((reslove, reject) => {
                    this.$refs[this.UPDATE_PAGE_ENUM.SUPPORT_GRID.REF].validateAll((valid) => {
                        if (_this.updateData.supportPersonList.length == 0) {
                            _this.$alert('请选择软件技术支持人员', '提示', {
                                confirmButtonText: '确定'
                            });
                            valid = false;
                        }
                        if (valid) {
                            reslove();
                        } else {
                            reject();
                        }
                    });
                });
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.APP_SYSTEM_ORIGIN.CODE),
                this.assembleInstitueEnumByDataDictionary(this.INSTITUTE_ENUMS.DATA_DICTIONARY.TIPS.CODE),
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