<template>
    <div>
        <div class="factoryContent">
            <div class="text">{{title}}</div>
            <div style="width: 45%">
                <el-button icon="el-icon-plus" type="primary" @click="addFactory()" class="tableBtn"
                           v-if="isEdit">增加
                </el-button>
                <ice-editable-table :height="200" v-if="factoryList"
                                    style="width: 100%"
                                    :data="factoryList"
                                    highlight-current-row
                                    :rules="rules"
                                    @current-change="handleCurrentChange"
                                    :ref="PAGE_ENUM.REFS.FACTORYS_TABLE.REF">
                    <el-table-column
                            type="index"
                            width="50">
                    </el-table-column>
                    <ice-editable-table-column prop="releType" :width="160"
                                               label="单位性质" v-if="showType">
                        <template slot-scope="scope">
                            <el-select placeholder="请选择" v-model="scope.row.releType" :disabled="!isEdit">
                                <el-option
                                        v-for="(item,index) in ENUMS.FACTORY_TYPE_DATA"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </template>
                    </ice-editable-table-column>
                    <el-table-column prop="factoryName"
                                     label="单位名称">
                    </el-table-column>
                    <el-table-column label="操作" :width="60" v-if="isEdit">
                        <template slot-scope="scope">
                            <el-button type="text"
                                       size="small" @click="deleteFactory(scope.$index,scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id" v-if="false"
                                     label="id">
                    </el-table-column>
                    <el-table-column prop="devId" v-if="false"
                                     label="devId">
                    </el-table-column>
                    <el-table-column prop="factoryId" v-if="false"
                                     label="factoryId">
                    </el-table-column>
                </ice-editable-table>
            </div>
            &nbsp;&nbsp;
            <div style="width: 45%">
                <div v-if="isOrgDept">
                    <el-button icon="el-icon-plus" type="primary" @click="addContactor()" class="tableBtn"
                               v-if="isEdit">
                        增加
                    </el-button>
                    <el-button icon="el-icon-delete" type="primary" @click="deleteContactor()" v-if="isEdit"
                               class="tableBtn">删除
                    </el-button>
                </div>
                <div style="height: 40px" v-if="!isOrgDept && isEdit"></div>
                <ice-editable-table :height="200" v-if="factoryList"
                                    :data="userList"
                                    style="width: 100%"
                                    @selection-change="userSelectionChange"
                                    ref="editTable">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column prop="userName"
                                     label="联系人">
                    </el-table-column>
                    <!-- <ice-editable-table-column prop="contact"
                                                input-type="input"
                                                label="联系电话"
                                                :disabled="!isEdit">
                     </ice-editable-table-column>-->
                    <el-table-column prop="contact"
                                     input-type="input"
                                     label="联系电话">
                    </el-table-column>
                    <el-table-column prop="id" v-if="false"
                                     label="id">
                    </el-table-column>
                    <el-table-column prop="devId" v-if="false"
                                     label="devId">
                    </el-table-column>
                    <el-table-column prop="userCode" v-if="false"
                                     label="userCode">
                    </el-table-column>
                    <el-table-column prop="deptCode" v-if="false"
                                     label="deptCode">
                    </el-table-column>
                    <el-table-column prop="deptName" v-if="false"
                                     label="deptName">
                    </el-table-column>
                    <el-table-column prop="orgCode" v-if="false"
                                     label="orgCode">
                    </el-table-column>
                    <el-table-column prop="orgName" v-if="false"
                                     label="orgName">
                    </el-table-column>
                </ice-editable-table>
            </div>
        </div>
        <ice-persion-by-dept-selector :grid-index="false" :deptCode="PAGE_ENUM.SELCTION_DEPT.factoryId"
                                      chooseItem="multiple" mode="hidden"
                                      :ref="PAGE_ENUM.REFS.PERSON_SELECT.REF"
                                      v-if="PAGE_ENUM.REFS.PERSON_SELECT.SHOW"
                                      @select-confirm="selectPersonConfirm"></ice-persion-by-dept-selector>
        <el-dialog v-dialogDrag title="选择厂商" custom-class="ice-dialog" center
                   :visible.sync="dialog.deptSelect" :ref="PAGE_ENUM.REFS.DEPT_SELECT.REF"
                   v-if="PAGE_ENUM.REFS.DEPT_SELECT.SHOW"
                   :close-on-press-escape="false"
                   append-to-body :close-on-click-modal="false">
            <frame-dept-coop-choose
                    @select-confirm="dcpSelectConfirm"
                    @select-cannel="dcpSelectCannel" :check-strictly="true"
            ></frame-dept-coop-choose>
        </el-dialog>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js"
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionByDeptSelector from "@/components/common/biz/IcePersionByDeptSelector";
    import IceSelect from "@/components/common/base/IceSelect";
    import FrameDeptCoopChoose from "../../../pro/module/FrameDeptCoopChoose";
    import {validatePhoneTwo} from "@/pages/biz/js/Validator.js";

    export default {
        name: "factoryForm",
        mixins: [bizComm, devComm],
        components: {
            FrameDeptCoopChoose,
            IceSelect,
            IcePersionByDeptSelector,
            IceDeptSelector,
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout
        },
        watch: {
            // mainData: {
            //     handler(newData) {
            //         debugger;
            //         this.$emit("update:mainData", newData);
            //     }, deep: true
            // },
        },
        props: {
            factoryList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            factoryUserList: {
                type: Array,
                default: () => {
                    return []
                }
            },
            isEdit: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: "厂商信息"
            },
            oid: {
                type: String,
                default: ""
            },
            showType: {
                type: Boolean,
                default: true
            },
            releType: {
                type: String
            }
        },
        data() {
            return {
                dialog: {
                    deptSelect: false,
                    personSelect: false
                },
                PAGE_ENUM: {
                    REFS: {
                        FACTORYS_TABLE: {REF: "factorysTable"},
                        DEPT_SELECT: {REF: "selectDepts", SHOW: false},
                        PERSON_SELECT: {REF: "selectPersons", SHOW: false},
                    },
                    SELCTION_DEPT: {},
                    SELECTION_USER: [],
                    FIELDS: {
                        DEPT_CODE: "factoryId",
                        USER_CODE: "userCode"
                    }
                },
                //厂商map
                factoryMap: {},
                userList: [],
                rules: {
                    releType: {required: true, message: '请选择厂商类型', trigger: 'blur'}
                },
                contactRules: {
                    contact: {required: false, validator: validatePhoneTwo}
                },
                //是否院内单位
                isOrgDept: true,
            }
        },
        methods: {
            /**
             * 增加厂商
             */
            addFactory() {
                this.dialog.deptSelect = true;
                this.PAGE_ENUM.REFS.DEPT_SELECT.SHOW = true;
            },
            /**
             * 厂商选择
             */
            dcpSelectConfirm(datas) {
                let dataArr = [];
                dataArr.push(...datas.gridSelect);
                dataArr.push(...datas.treeSelects);
                for (let i = 0; i < dataArr.length; i++) {
                    let _data = dataArr[i];
                    if (this.findSameRowByCode(this.factoryList, _data.code, this.PAGE_ENUM.FIELDS.DEPT_CODE) == -1) {
                        this.factoryList.push({
                            id: "",
                            devId: this.oid,
                            factoryName: _data.name,
                            factoryId: _data.code,
                            releType: this.releType
                        });
                    }
                }
                this.setCurrentRow(this.factoryList[0]);
                this.dialog.deptSelect = false;
                this.PAGE_ENUM.REFS.DEPT_SELECT.SHOW = false;
            },
            /**
             * 厂商行选择改变事件
             */
            handleCurrentChange(row) {
                if (row) {
                    this.PAGE_ENUM.SELCTION_DEPT = row;
                    console.log(row);
                    let _this = this;
                    this.isOrgDeptByCode(row.factoryId).then(res => {
                        _this.isOrgDept = res;
                        if (this.isOrgDept) {//院内单位
                            this.setFactoryContactData();
                        } else {
                            this.getFactoryContact(row.factoryId).then(data => {
                                _this.userList = data;
                            });
                        }
                    });
                } else {
                    this.userList = [];
                }
            },
            /**
             * 删除厂商
             */
            deleteFactory(index, row) {
                this.factoryList.splice(index, 1);
                this.isOrgDeptByCode(row.factoryId).then(res => {
                    if (res) {//院内单位
                        this.factoryMap[row.factoryId] = [];
                    } else {
                        this.userList = [];
                    }
                    this.setCurrentRow(this.factoryList[0]);
                });
            },
            /**
             * 选择表格的某一行
             */
            setCurrentRow(row) {
                if (this.$refs[this.PAGE_ENUM.REFS.FACTORYS_TABLE.REF]) {
                    this.$refs[this.PAGE_ENUM.REFS.FACTORYS_TABLE.REF].setCurrentRow(row);
                }
            },
            /**
             * 添加厂商联系人
             */
            addContactor() {
                if (!this.PAGE_ENUM.SELCTION_DEPT.factoryId) {
                    this.$message.warning('请选择单位!');
                } else {
                    this.PAGE_ENUM.REFS.PERSON_SELECT.SHOW = true;
                    this.$nextTick(() => {
                        this.$refs[this.PAGE_ENUM.REFS.PERSON_SELECT.REF].openDialog();
                    });
                }
            },
            /**
             * 删除厂商联系人
             */
            deleteContactor() {
                if (this.PAGE_ENUM.SELECTION_USER.length == 0) {
                    this.$message.warning('请选择需要删除的厂商联系人');
                }
                this.deletes(this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId], this.PAGE_ENUM.SELECTION_USER);
            },
            /**
             * 选择人员
             * @param datas
             */
            selectPersonConfirm(datas) {
                this.PAGE_ENUM.REFS.PERSON_SELECT.SHOW = false;
                console.log(datas);
                for (let i = 0; i < datas.length; i++) {
                    let _data = datas[i];
                    if (!this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId]) {
                        this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId] = [this.setUserInfo(_data)];
                    } else {
                        if (this.findSameRowByCode(this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId], _data.code, this.PAGE_ENUM.FIELDS.USER_CODE) == -1) {
                            this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId].push(this.setUserInfo(_data));
                        }
                    }
                }
                this.setFactoryContactData();
            },
            /**
             * 取消选择厂商
             */
            dcpSelectCannel(e) {
                this.dialog.deptSelect = false;
            },
            /**
             * 设置用户信息
             */
            setUserInfo(data) {
                return {
                    id: "",
                    devId: this.oid,
                    userName: data.name,
                    contact: data.landlineTel,
                    userType: this.ENUMS.USER_TYPE_DATA.BUILD_LINKMAN,
                    userCode: data.code,
                    deptCode: data.deptCode,
                    deptName: data.deptShortName,
                    orgCode: data.dataOrgCode,
                    orgName: data.orgShortName
                };
            },
            /**
             * 设置厂商联系人data
             */
            setFactoryContactData() {
                this.userList = this.factoryMap[this.PAGE_ENUM.SELCTION_DEPT.factoryId];
            },
            /**
             * 初始化控件
             */
            initControls() {
                this.initStyle();
            },
            /**
             * 初始化页面样式
             */
            initStyle() {
                if (this.factoryList || this.factoryList.length > 0) {
                    this.setCurrentRow(this.factoryList[0]);
                }
            },
            /**
             * 设置厂商联系人map
             */
            setFactoryMap() {
                if (this.factoryList && this.factoryUserList) {
                    for (let i = 0; i < this.factoryList.length; i++) {
                        let _factoryList = this.factoryList[i];
                        this.factoryMap[_factoryList.factoryId] = this.factoryMap[_factoryList.factoryId] || [];
                        if (this.factoryMap[_factoryList.factoryId].length == 0) {
                            for (let j = 0; j < this.factoryUserList.length; j++) {
                                let _userList = this.factoryUserList[j];
                                if (_factoryList.factoryId == _userList.deptCode || _factoryList.factoryId == _userList.orgCode) {
                                    this.factoryMap[_factoryList.factoryId].push(_userList);
                                }
                            }
                        }
                    }
                }
            },
            /**
             * 用户选择行改变事件
             * @param rows
             */
            userSelectionChange(rows) {
                this.PAGE_ENUM.SELECTION_USER = rows;
            },
            /**
             * 组装厂商联系人
             */
            assembleFactoryList() {
                let factoryUser = [];
                for (let i in this.factoryMap) {
                    if (!!this.factoryMap[i] && this.factoryMap[i].length != 0) {
                        factoryUser.push(...this.factoryMap[i]);
                    }
                }
                return factoryUser;
            },
            /**
             * 校验厂商类型是否选择
             * @returns {Promise<any>}
             */
            validateFactorys() {
                return Promise.all([this.validateContact(), this.validateRele()]);
            },
            /**
             * 联系方式的校验
             * @return Promise
             */
            validateContact() {
                return new Promise((resolve, reject) => {
                    this.$refs.editTable.validateAll((valid) => {
                        if (valid) {
                            resolve();
                        } else {
                            reject(this.title + '联系人电话校验失败,请核对!');
                        }
                    });
                });
            },
            /**
             * 厂商类型的校验
             *@return Promise
             */
            validateRele() {
                return new Promise((resolve, reject) => {
                    this.$refs[this.PAGE_ENUM.REFS.FACTORYS_TABLE.REF].validateAll((valid) => {
                        if (valid) {
                            resolve();
                        } else {
                            reject(this.title + '校验失败,请核对!');
                        }
                    });
                });
            },
            /**
             * 是否院内单位
             * @param deptCode
             */
            isOrgDeptByCode(deptCode) {
                return new Promise((reslove, reject) => {
                    this.axios(this.ENUMS.ACTIONS.IS_ORG_DEPT, {deptCodes: deptCode}, [res => {
                        if (res.data.length == 0) {//院外
                            reslove(false)
                        } else {//院内
                            reslove(true);
                        }
                    }, res => {
                        reject();
                        console.log("出错啦");
                    }]);
                });
            },
            /**
             * 获取院外联系人
             * @param code
             */
            getFactoryContact(code) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    this.axios(this.ENUMS.ACTIONS.GET_FACTORY_CONTACT, {customerIds: code}, [res => {
                        let userList = [];
                        let userLists = res.data[code] || [];
                        for (let i = 0; i < userLists.length; i++) {
                            userList.push({
                                contact: userLists[i].contact,
                                userName: userLists[i].username
                            });
                        }
                        resolve(userList);
                    }, res => {

                    }]);
                });
            },
            /**
             * 获取组件数据
             * @returns {{factoryList: (default.props.factoryList|{default, type}), factoryUserList: (default.props.factoryUserList|{default, type})}}
             */
            getData() {
                return {
                    factoryList: this.factoryList,
                    factoryUserList: this.assembleFactoryList()
                };
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.FACTORY_TYPE.CODE)
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        },
        watch: {
            factoryList: {
                immediate: true,
                handler(newValue) {
                    this.factoryList = newValue;
                    this.setFactoryMap();
                    this.initStyle();
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../style/edit.less";

    .text {
        width: 60px;
        text-align: right;
        padding-right: 12px;
    }

    .factoryContent {
        display: flex;
        align-items: center;
    }

</style>