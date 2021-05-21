<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm"
                       :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="powerData" status-icon ref="power"
                         label-width="100px" :rules="rules" :disabled="readOnly">
                    <ice-grid-layout name="系统基本信息" :columns="3">
                        <el-form-item label="系统名称" prop="name">
                            <el-input v-model="powerData.name" :disabled="flowScope.formReadonly" :readonly="true">
                                <template slot="append">
                                    <el-button icon="el-icon-edit-outline" :disabled="flowScope.formReadonly"
                                               @click="chooseDev(INSTITUTE_ENUMS.INSTITUTE_TYPE.POWER)"></el-button>
                                </template>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="系统级别">
                            <el-select v-model="powerData.systemLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.SYSTEM_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="系统密级">
                            <el-select v-model="powerData.secretLevel" :disabled="true">
                                <el-option v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                           :key="Number(item.code)"
                                           :label="item.name"
                                           :value="Number(item.code)"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="联网区域">
                            <el-select v-model="powerData.netAreaAndType" :disabled="true">
                                <el-option v-for="item in ENUMS.NET_AREA_TYPE_DATA"
                                           :key="item.code"
                                           :label="item.name"
                                           :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人电话" prop="creatorContact">
                            <el-input v-model="powerData.creatorContact" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="业务主管部门">
                            <el-input v-model="powerData.competentDeptName" :disabled="true"></el-input>
                        </el-form-item>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>主管部门<br>联系人</div>
                            <ice-editable-table layout="3" :ref="POWER_PAGE_ENUM.COMPETENT_GRID.REF" :rules="userRules"
                                                :data="powerData.competentUserList" height="200">
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
                    </ice-grid-layout>
                    <ice-grid-layout name="系统变更信息" :columns="3">
                        <el-form-item label="是否紧急" prop="urgent">
                            <el-select placeholder="请选择" v-model="powerData.urgent"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="(item,index) in ENUMS.YES_NO.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="有效期" prop="changeExpirationType">
                            <el-select placeholder="请选择" v-model="powerData.changeExpirationType"
                                       :disabled="flowScope.formReadonly" @change="changeExpirationTypeChangedHandler">
                                <el-option
                                        v-for="(item,index) in INSTITUTE_ENUMS.EXPIRATION_TYPE_DATA.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="截至日期" prop="changeExpiration"
                                      v-if="powerData.changeExpirationType == INSTITUTE_ENUMS.EXPIRATION_TYPE_DATA.FREE">
                            <el-date-picker v-model="powerData.changeExpiration"
                                            :disabled="flowScope.formReadonly"></el-date-picker>
                        </el-form-item>
                        <div layout="3" class="tips">{{tips}}</div>
                        <div class="divContent" layout="3">
                            <div class="text"><span class="required-star">*</span>变更用户</div>
                            <div class="btn" ref="table">
                                <el-button icon="el-icon-plus" type="primary" v-if="!flowScope.formReadonly"
                                           @click="addUser" class="tableBtn">
                                    增加
                                </el-button>
                                <el-button icon="el-icon-delete" type="primary" v-if="!flowScope.formReadonly"
                                           @click="deleteRow" class="tableBtn">删除
                                </el-button>
                                <el-button icon="el-icon-download" type="primary" v-if="!flowScope.formReadonly"
                                           @click="exportUser" class="tableBtn">导入
                                </el-button>
                                <ice-editable-table layout="2" :ref="POWER_PAGE_ENUM.POWER_GRID.REF"
                                                    :data="powerData.userUpdateList" height="200" :rules="userRules"
                                                    @selection-change="userUpdateSelectionChange">
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
                                    <el-table-column
                                            label="姓名"
                                            prop="userName">
                                    </el-table-column>
                                    <el-table-column
                                            label="部门"
                                            prop="deptName">
                                    </el-table-column>
                                    <el-table-column
                                            label="单位"
                                            prop="orgName">
                                    </el-table-column>
                                    <ice-editable-table-column label="变更类型" :disabled="flowScope.formReadonly"
                                                               prop="changeType">
                                        <template slot-scope="scope">
                                            <el-select placeholder="请选择" v-model="scope.row.changeType"
                                                       :disabled="flowScope.formReadonly">
                                                <el-option
                                                        v-for="(item,index) in INSTITUTE_ENUMS.CHANGE_TYPE_DATA"
                                                        :key="index"
                                                        :label="item.name"
                                                        :value="item.code">
                                                </el-option>
                                            </el-select>
                                        </template>
                                    </ice-editable-table-column>
                                    <ice-editable-table-column label="现IP地址" :disabled="flowScope.formReadonly"
                                                               prop="newIp" type="input">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column label="原IP地址" :disabled="flowScope.formReadonly"
                                                               prop="oldIp" type="input">
                                    </ice-editable-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                        <el-form-item label="变更原因" layout="3" prop="changeReason">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="powerData.changeReason"></el-input>
                        </el-form-item>
                        <el-form-item label="变更内容" layout="3" prop="changeContent">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="powerData.changeContent"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" layout="3">
                            <el-input type="textarea" :rows="3" :disabled="flowScope.formReadonly"
                                      v-model="powerData.remark"></el-input>
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
                              :ref="POWER_PAGE_ENUM.SELECT_PERSONS.REF"
                              v-if="POWER_PAGE_ENUM.SELECT_PERSONS.SHOW"
                              @select-confirm="selectPersonConfirm"></ice-persion-selector>
        <el-dialog v-dialogDrag
                   title="模板下载"
                   width="30%"
                   custom-class="edit-dialog"
                   :modal-append-to-body="false"
                   :visible.sync="dialogVisible"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false">
            <ice-excel-uploader :service="POWER_PAGE_ENUM.EXCEL_UPLOAD.SERVICE" module="biz"
                                :ref="POWER_PAGE_ENUM.EXCEL_UPLOAD.REF">
            </ice-excel-uploader>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureClick">确 定</el-button>
                <el-button @click="closeDialog">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import attachment from "../comm/attachment";
    import institutePublic from "../comm/public";
    import IceSelect from "@/components/common/base/IceSelect";
    import DevSelect from "../../dev/devSelect";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import IceExcelUploader from "../../../../components/common/base/IceExcelUploader";
    import renderer from "@/pages/biz/dev/js/comm/renderer"

    export default {
        name: "editPower",
        components: {
            IceExcelUploader,
            IcePersionSelector,
            DevSelect, IceSelect, IceEditableTableColumn, IceEditableTable, IceGridLayout, IceFlowForm
        },
        mixins: [bizComm, devComm, attachment, institutePublic, renderer],
        data() {
            var validateIP = function (rule, value, callback) {
                if (value != '' && value != undefined && value != null) {
                    const reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
                    if ((!reg.test(value)) && value != '') {
                        callback(new Error('请输入正确的IP地址'));
                    } else {
                        callback();
                    }
                }
            };
            return {
                readOnly: false,
                dialogVisible: false,
                powerData: {
                    formCode: "",
                    oid: "",
                    name: "",
                    devId: "",
                    systemLevel: "",
                    secretLevel: "",
                    competentDeptName: "",
                    competentDeptCode: "",
                    creatorContact: "",
                    urgent: "",
                    netAreaAndType: "",
                    netArea: "",
                    netType: "",
                    changeExpirationType: "",
                    changeExpiration: "",
                    competentUserList: [],
                    userUpdateList: [],//权限变更列表
                    typeCode: "",
                    changeReason: "",
                    changeContent: "",
                    remark: "",
                    state: "",
                    jGDept: "",
                    tacticsChange: "",
                    deployMode: "",
                    secretSn: "",
                    useDeptList: [],
                    factoryList: [],
                    factoryUserList: []
                },
                rules: {
                    name: {required: true, message: "请选择系统名称", trigger: "change"},
                    creatorContact: {required: true, message: "请输入申请人联系电话", trigger: "change"},
                    urgent: {required: true, message: "请选择是否紧急", trigger: "change"},
                    changeReason: {required: true, message: "请输入变更原因", trigger: "change"},
                    changeContent: {required: true, message: "请输入变更内容", trigger: "change"},
                    changeExpirationType: {required: true, message: "请选择变更有效期", trigger: "change"},
                    changeExpiration: {required: true, message: "请选择变更截止日期", trigger: "change"}
                },
                userRules: {
                    // changeType: {required: true, message: "请选择变更类型", trigger: "change"},
                    newIp: {validator: validateIP, trigger: 'change'},
                    oldIp: {validator: validateIP, trigger: 'change'},
                    contact: {required: false, message: "请输入联系方式", trigger: "change"}
                },
                POWER_PAGE_ENUM: {
                    COMPETENT_GRID: {
                        REF: "componentGrid",
                    },
                    POWER_GRID: {REF: "powerGrid", CURRENT_SELECTS: []},
                    SELECT_PERSONS: {REF: "selectPerson", SHOW: false},
                    FIELDS: {
                        DEPT_CODE: "deptCode",
                        USER_CODE: "userCode"
                    },
                    EXCEL_UPLOAD: {REF: "excelUpload", SERVICE: ""}
                },
                tips: ""
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
                if (bizdata.powerDTO) {
                    //编辑
                    Object.assign(this.powerData, bizdata.powerDTO);
                    this.initNetAreaAndNetType(this.powerData.netType, this.powerData.netArea);
                } else {
                    //新增
                    this.powerData.creatorContact = bizdata.afPhone;
                }
            },
            /**
             * 初始化联网区域
             */
            initNetAreaAndNetType(netType, netArea) {
                if (netArea) {
                    this.powerData.netAreaAndType = netArea + this.ENUMS.NET_SEPARATOR() + netType;
                } else {
                    this.powerData.netAreaAndType = this.ENUMS.NET_AREA_TYPE_DATA[0].code;
                }
            },
            /**
             * 流程按钮
             * @param flowcont
             * @param data
             */
            flowOperateBtn(flowContext, bizdata) {
                /*  if (this.onGridValidation()) {
                      return this.$refs['power'].validate();
                  }*/
                return Promise.all([this.$refs['power'].validate(), this.onGridValidation()]);
            },
            /**
             * 页面表格的校验
             * @returns {Promise<unknown>}
             */
            onGridValidation() {
                let _this = this;
                let userpowerData = this.powerData.userUpdateList;
                return new Promise((resolve, reject) => {
                    this.$refs[_this.POWER_PAGE_ENUM.POWER_GRID.REF].validateAll((valid) => {
                        if (userpowerData.length == 0) {
                            _this.$alert('请选择变更用户', '提示', {
                                confirmButtonText: '确定'
                            });
                            valid = false;
                        }
                        if (valid) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                });
            },
            /**
             * 向流程引擎提交封装的数据
             * @returns {powerData|{}}
             */
            flowBizData() {
                this.powerData.typeCode = this.INSTITUTE_ENUMS.SYSTEM_APPLY_TYPE_DATA.power.code;
                console.log(JSON.stringify(this.powerData));
                return {
                    type: this.powerData.typeCode,
                    powerDTO: this.powerData
                };
            },
            /**
             * 选择变更用户
             */
            addUser() {
                this.POWER_PAGE_ENUM.SELECT_PERSONS.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.POWER_PAGE_ENUM.SELECT_PERSONS.REF].openDialog();
                });
            },
            /**
             * 删除变更用户
             */
            deleteRow() {
                if (this.POWER_PAGE_ENUM.POWER_GRID.CURRENT_SELECTS.length == 0) {
                    this.$message.warning("请选择需要删除的变更用户");
                    return;
                }
                this.deletes(this.powerData.userUpdateList, this.POWER_PAGE_ENUM.POWER_GRID.CURRENT_SELECTS);
            },
            /**
             * 变更用户选择事件
             * @param row
             */
            userUpdateSelectionChange(row) {
                this.POWER_PAGE_ENUM.POWER_GRID.CURRENT_SELECTS = row;
            },
            /**
             * 变更用户选择后
             * @param datas
             */
            selectPersonConfirm(datas) {
                this.setUserListData(datas, this.powerData.userUpdateList);
                this.POWER_PAGE_ENUM.SELECT_PERSONS.SHOW = false;
            },
            /**
             * 设置userlist数据
             * @param datas
             * @param userList
             */
            setUserListData(datas, userList) {
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(userList, _data.code, this.POWER_PAGE_ENUM.FIELDS.USER_CODE) == -1) {
                        userList.push({
                            id: "",
                            orders: i + 1,
                            userName: _data.name,
                            userCode: _data.code,
                            deptCode: _data.deptCode,
                            deptName: _data.deptShortName,
                            orgCode: _data.dataOrgCode,
                            orgName: _data.orgShortName
                        });
                    }
                }
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.tips = this.findRemarkByCode(this.INSTITUTE_ENUMS.TIPS_DATA, "powerTips");
            },
            /**
             * 导入按钮响应事件
             */
            exportUser() {
                this.dialogVisible = true;
            },
            /**
             * 关闭窗口
             */
            closeDialog() {
                this.dialogVisible = false;
            },
            /**
             * 确定按钮响应事件
             */
            sureClick() {
                this.dialogVisible = false;
            },
            /**
             * 有效期改变时
             * @param e
             */
            changeExpirationTypeChangedHandler(e) {
                let now = new Date();
                if (e != this.INSTITUTE_ENUMS.EXPIRATION_TYPE_DATA.FREE) {
                    now.setFullYear(now.getFullYear() + e);
                    this.powerData.changeExpiration = now;
                }
            },
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE),
                this.requestNetAreaTypeData(),
                this.assembleInstitueEnumByDataDictionary(this.INSTITUTE_ENUMS.DATA_DICTIONARY.TIPS.CODE),
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