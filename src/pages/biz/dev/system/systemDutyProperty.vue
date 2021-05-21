<template>
    <div class="form-content">
        <el-form :ref="PAGE_ENUM.REFS.FORM.REF" label-width="100px" :rules="rules">
            <ice-grid-layout :columns="3" name="责任相关">
                <el-form-item label="主管部门" prop="deptName">
                    <ice-dept-selector choose-item="single" v-model="mainData.commDTO.deptName"
                                       @select-confirm="selectDeptCodeConfirm"
                                       :allDept="true"
                                       :mode="PAGE_ENUM.MODE"></ice-dept-selector>
                </el-form-item>
                <el-form-item label="联系人" prop="dutyName">
                    <ice-persion-selector
                            v-model="mainData.commDTO.dutyName"
                            text-prop="name"
                            code-prop="code"
                            :allDept="true"
                            :mode="PAGE_ENUM.MODE"
                            choose-item="single" @select-confirm="selectDutyNameConfirm">
                    </ice-persion-selector>
                </el-form-item>
                <el-form-item label="联系电话" prop="">
                    <el-input v-model="mainData.commDTO.dutyPhone" :disabled="!isEdit"></el-input>
                </el-form-item>
                <div class="dutyContent" layout="3">
                    <div class="text"><span class="required-star"
                                            v-if="!(mainData.commDTO.secretLevel == secretLevelData['公开'] || mainData.commDTO.secretLevel == secretLevelData['内部'])">*</span>系统三员
                    </div>
                    <div style="padding-left: 4px;width: 90%" ref="table">
                        <el-button icon="el-icon-plus" type="primary" @click="addManage" class="tableBtn"
                                   v-if="isEdit">
                            增加
                        </el-button>
                        <el-button icon="el-icon-delete" type="primary" @click="deleteManage"
                                   class="tableBtn" v-if="isEdit">删除
                        </el-button>
                        <ice-editable-table layout="3" :ref="PAGE_ENUM.REFS.MANAGE_TABLE.REF"
                                            :data="mainData.dutyDTOList" height="200" :rules="manageRules"
                                            @selection-change="manageSelectionChange">
                            <el-table-column
                                    type="selection"
                                    :width="30">
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
                            <ice-editable-table-column label="类型" :width="300"
                                                       type="input" prop="userType">
                                <template slot-scope="scope">
                                    <el-select placeholder="请选择" v-model="scope.row.userType" :disabled="!isEdit">
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
                            <el-table-column
                                    label="电话"
                                    prop="contact">
                            </el-table-column>
                        </ice-editable-table>
                        <div class="tableTips" v-if="PAGE_ENUM.VALIDATE_TYPE.manageRules">请选择系统三员</div>
                        <div class="tableTips" v-if="PAGE_ENUM.VALIDATE_TYPE.everyManageType">
                            【{{PAGE_ENUM.NO_MANAGE_TYPE}}】管理员没有设置
                        </div>
                    </div>
                </div>
                <div class="dutyContent" layout="3">
                    <div class="text"><span class="required-star"
                                            v-if="mainData.commDTO.category != ENUMS.CATEGORY_TYPE.SYSTEM.CODE">*</span>使用单位
                    </div>
                    <div style="width: 95%">
                        <div>
                            <ice-query-grid title=""
                                            :gridData="mainData.useRangeDTOList"
                                            :query="[]"
                                            :columns="columns"
                                            :ref="PAGE_ENUM.REFS.USE_RANAGES_TABLE.REF"
                                            :operations="[]"
                                            chooseItem="multiple"
                                            :operationsWidth=100
                                            :minHeight="200"
                                            :pagination="false"
                                            layout="3"
                                            @selection-change="useRanagesSelectionChange"
                                            :buttons="buttons"></ice-query-grid>
                        </div>
                        <div class="tableTips" v-if="PAGE_ENUM.VALIDATE_TYPE.useRanageV">请选择使用单位</div>
                    </div>
                </div>
            </ice-grid-layout>
        </el-form>
        <ice-persion-selector :grid-index="false"
                              chooseItem="multiple" mode="hidden"
                              :ref="PAGE_ENUM.REFS.SELECT_PERSONS.REF"
                              allDept="true"
                              v-if="PAGE_ENUM.REFS.SELECT_PERSONS.SHOW"
                              @select-confirm="selectPersonConfirm"></ice-persion-selector>
        <ice-dept-selector mode="hidden"
                           choose-item="multiple"
                           allDept="true"
                           :ref="PAGE_ENUM.REFS.SELECT_DEPT.REF"
                           v-if="PAGE_ENUM.REFS.SELECT_DEPT.SHOW"
                           @select-confirm="selectDeptConfirm"></ice-dept-selector>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector.vue";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import {resetRule} from "@/pages/biz/dev/js/comm/devT.js";

    export default {
        name: "dutyProperty",
        components: {
            IceGridLayout,
            IceSelect,
            IceEditableTable,
            IceEditableTableColumn,
            IceQueryGrid,
            IcePersionSelector,
            IceDeptSelector
        },
        mixins: [bizComm, devComm],
        props: {
            isEdit: {
                type: Boolean,
                default: true
            },
            mainData: {
                type: Object,
                default: {}
            }
        },
        watch: {
            /*   mainData: {
                   handler(newData) {
                       this.$emit("update:mainData", newData);
                   }, deep: true
               },
               mainData: {
                   handler(newData) {
                       Object.assign(this.mainData, newData);
                   }, deep: true
               }*/
        },
        data() {
            let _this = this;
            let validateText = function (rule, value, callback) {
                if (_this.mainData.commDTO.deptName == "" && rule.field == 'deptName') {
                    callback(new Error(rule.message));
                } else if (_this.mainData.commDTO.dutyName == '' && rule.field == 'dutyName') {
                    callback(new Error(rule.message));
                } else {
                    callback();
                }
            };
            return {
                //页面枚举
                PAGE_ENUM: {
                    //页面组件ref
                    REFS: {
                        SELECT_PERSONS: {REF: "selectPersons", SHOW: false},
                        SELECT_DEPT: {REF: "selectDepts", SHOW: false},
                        FORM: {REF: "form"},
                        MANAGE_TABLE: {REF: "manageTable"},
                        USE_RANAGES_TABLE: {REF: "useRanageTable"}
                    },
                    //表格选择行数据
                    SELECTION: {
                        MANAGE: [],
                        USE_RANAGES: []
                    },
                    //部门选择以及人员选择mode值
                    MODE_TYPE: {
                        READ_ONLY: "readonly",
                        ONLY_SELECT: "onlySelect"
                    },
                    //部门选择以及人员选择mode
                    MODE: "onlySelect",
                    FIELDS: {
                        DEPT_CODE: "deptCode",
                        USER_CODE: "userCode"
                    },
                    NO_MANAGE_TYPE: "",//没有设置管理员类型的值
                    VALIDATE_TYPE: {//表格校验规则
                        manageRules: false,
                        everyManageType: false,
                        useRanageV: false
                    }
                },
                //使用范围表格列
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'devId', hidden: true},
                    {label: 'deptCode', code: 'deptCode', hidden: true},
                    {label: 'orgCode', code: 'orgCode', hidden: true},
                    {label: '部门', code: 'deptName'}
                ],
                //使用范围表格按钮
                buttons: [],
                //页面校验规则
                rules: {
                    dutyName: {required: true, message: '请选择主管部门联系人', validator: validateText, trigger: 'blur'},
                    deptName: {required: true, message: '请选择主管部门', validator: validateText, trigger: 'blur'}
                },
                manageRules: {
                    userType: {required: true, message: '请选择用户类型'}
                },
                secretLevelData: {}
            };
        },
        methods: {
            /**
             * 初始化页面样式
             */
            initControls() {
                //设置页面规则
                resetRule(this.rules, this.mainData.commDTO.category, this.mainData.commDTO.childType);
                if (this.isEdit) {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.ONLY_SELECT;
                    this.buttons = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addRanages}),
                        Object.assign({}, this.COMM_ENUMS.BUTTON.DELETE, {callback: this.deleteRanages})];
                } else {
                    this.PAGE_ENUM.MODE = this.PAGE_ENUM.MODE_TYPE.READ_ONLY;
                    this.buttons = [];
                }
                this.initPageOver();
            },
            /**
             * 初始化页面数据
             */
            initData() {
                this.initSecretLevelData();
            },
            /**
             * 添加系统三元
             */
            addManage() {
                this.PAGE_ENUM.REFS.SELECT_PERSONS.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.SELECT_PERSONS.REF].openDialog();
                });
            },
            /**
             * 删除系统三元
             */
            deleteManage() {
                if (this.PAGE_ENUM.SELECTION.MANAGE.length == 0) {
                    this.$message('请选择需要删除的系统三元');
                }
                this.deletes(this.mainData.dutyDTOList, this.PAGE_ENUM.SELECTION.MANAGE);
            },
            /**
             * 选择人员
             */
            selectPersonConfirm(datas) {
                this.PAGE_ENUM.REFS.SELECT_PERSONS.SHOW = false;
                this.mainData.dutyDTOList = this.mainData.dutyDTOList || [];
                console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(this.mainData.dutyDTOList, _data.code, this.PAGE_ENUM.FIELDS.USER_CODE) == -1) {
                        this.mainData.dutyDTOList.push({
                            id: "",
                            devId: this.mainData.commDTO.oid,
                            phone: _data.handphoneTel + "/  " + _data.landlineTel,
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
             * 选择使用范围
             */
            addRanages() {
                this.PAGE_ENUM.REFS.SELECT_DEPT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.SELECT_DEPT.REF].openDialog();
                });
            },
            /**
             * 删除使用范围
             */
            deleteRanages() {
                if (this.PAGE_ENUM.SELECTION.USE_RANAGES.length == 0) {
                    this.$message('请选择需要删除的使用单位');
                }
                this.deletes(this.mainData.useRangeDTOList, this.PAGE_ENUM.SELECTION.USE_RANAGES);
            },
            /**
             * 单位选择
             */
            selectDeptConfirm(datas) {
                this.PAGE_ENUM.REFS.SELECT_DEPT.SHOW = false;
                this.mainData.useRangeDTOList = this.mainData.useRangeDTOList || [];
                console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (this.findSameRowByCode(this.mainData.useRangeDTOList, _data.deptCode, this.PAGE_ENUM.FIELDS.DEPT_CODE) == -1) {
                        this.mainData.useRangeDTOList.push({
                            id: "",
                            devId: this.mainData.commDTO.oid,
                            deptName: _data.deptName,
                            deptCode: _data.deptCode,
                            orgCode: _data.orgCode
                        });
                    }
                }
            },
            selectDeptCodeConfirm(data) {
                this.mainData.commDTO.deptCode = data[0].deptCode;
                this.mainData.commDTO.deptName = data[0].deptName;
                this.mainData.commDTO.deptOrgCode = data[0].orgCode;
                this.mainData.commDTO.dutyOrgName = data[0].orgShortName;//责任部门orgName
            },
            /**
             * 主管部门联系人选择
             */
            selectDutyNameConfirm(data) {
                this.mainData.commDTO.dutyPhone = data[0].landlineTel;
                this.mainData.commDTO.dutyName = data[0].name;
                this.mainData.commDTO.dutyCode = data[0].deptCode;
                this.mainData.commDTO.dutyOrgCode = data[0].deptCode;
            },
            /**
             * 根据code查找相同行
             * @param data
             * @param code
             * @param filedName
             * @returns {number}
             */
            findSameRowByCode(data, code, filedName) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i][filedName] == code) {
                        return i;
                    }
                }
                return -1;
            },
            /**
             * 使用范围选择行改变事件
             * @param rows
             */
            useRanagesSelectionChange(rows) {
                this.PAGE_ENUM.SELECTION.USE_RANAGES = rows;
            },
            /**
             * 系统三元选择改变事件
             * @param rows
             */
            manageSelectionChange(rows) {
                this.PAGE_ENUM.SELECTION.MANAGE = rows;
            },
            /**
             * 校验页面数据
             */
            validateData() {
                return Promise.all([this.$refs[this.PAGE_ENUM.REFS.FORM.REF].validate(), this.onManagersGridValidate(), this.onUseRanagesValidate()]);
            },
            /**
             * 使用范围的校验
             */
            onUseRanagesValidate() {
                let _this = this;
                if (this.mainData.commDTO.category != this.ENUMS.CATEGORY_TYPE.SYSTEM.CODE) {
                    return new Promise((resolve, reject) => {
                        if (!_this.mainData.useRangeDTOList || _this.mainData.useRangeDTOList.length == 0) {
                            _this.PAGE_ENUM.VALIDATE_TYPE.useRanageV = true;
                            reject();
                        } else {
                            _this.PAGE_ENUM.VALIDATE_TYPE.useRanageV = false;
                            resolve('使用单位校验失败,请核对!');
                        }
                    });
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
            },
            /**
             * 三元的校验
             * @returns {Promise<any>}
             */
            onManagersGridValidate() {
                let _this = this;
                this.mainData.dutyDTOList = this.mainData.dutyDTOList || [];
                let managersData = this.mainData.dutyDTOList;
                if (_this.mainData.commDTO.secretLevel == this.secretLevelData['公开'] || _this.mainData.commDTO.secretLevel == this.secretLevelData['内部']) {
                } else {
                    return new Promise((resolve, reject) => {
                        _this.$refs[_this.PAGE_ENUM.REFS.MANAGE_TABLE.REF].validateAll((valid) => {
                            if (!managersData || managersData.length < _this.ENUMS.MANAGER_TYPE_DATA.properties.length) {
                                _this.PAGE_ENUM.VALIDATE_TYPE.manageRules = true;
                                _this.PAGE_ENUM.VALIDATE_TYPE.everyManageType = false;
                                valid = false;
                            } else {
                                _this.PAGE_ENUM.VALIDATE_TYPE.manageRules = false;
                                valid = this.userTypeValidate(managersData, true);
                            }
                            if (valid) {
                                resolve();
                            } else {
                                reject('系统三员校验失败');
                            }
                        });
                    });
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
                    counts[_data.userType]++;
                }
                //校验是否全部管理员都做了设置
                if (validate) {
                    for (let j = 0; j < this.ENUMS.MANAGER_TYPE_DATA.properties.length; j++) {
                        if (counts[j] == 0) {
                            this.PAGE_ENUM.VALIDATE_TYPE.everyManageType = true;
                            this.PAGE_ENUM.NO_MANAGE_TYPE = this.ENUMS.MANAGER_TYPE_DATA.properties[j - 1].name;
                            validate = false;
                            break;
                        } else {
                            this.PAGE_ENUM.VALIDATE_TYPE.everyManageType = false;
                            this.PAGE_ENUM.NO_MANAGE_TYPE = "";
                        }
                    }
                }
                return validate;
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE)
            ];
            Promise.all(prepareTaskChain).then(() => {
                this.initControls();
                this.initData();
                this.initPageOver();
            });
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";

    .dutyContent {
        width: 100%;
        display: flex;
        align-items: center;
        background-color: white;
    }

    .text {
        width: 70px;
    }

</style>