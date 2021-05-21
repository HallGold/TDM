<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid :title="tittle"
                        :data-url="defaultGrid.dataUrl"
                        :query="defaultGrid.query"
                        :columns="defaultGrid.columns"
                        :operations="defaultGrid.operations"
                        :buttons="defaultGrid.buttons" ref="grid">
        </ice-query-grid>
        <ice-dialog :title="tittle" :visible.sync="dialogVisible"
                    width="1250px" height="500px">
            <div class="grid-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px" :disabled="mainDataForm.state=='1'">

                    <ice-grid-layout :columns="2" name="基础信息">
                        <el-form-item label="停用原因:" label-width="120px" prop="reason">
                            <ice-select placeholder="停用原因" mapTypeCode="REASON"
                                        v-model="mainDataForm.reason"></ice-select>
                        </el-form-item>
                        <el-form-item label="是否影响服务:" label-width="120px" prop="isaffectservice">
                            <ice-select placeholder="是否影响服务" mapTypeCode="YES_NO" maxlength="60"
                                        v-model="mainDataForm.isaffectservice"></ice-select>
                        </el-form-item>
                        <el-form-item label="服务停用时间:" label-width="120px" prop="stoptime">
                            <ice-date-picker
                                    v-model="mainDataForm.stoptime"
                                    type="datetime"
                                    @change="timeChange"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    :time-filter="stopTimeFilter"
                                    placeholder="选择日期">
                            </ice-date-picker>
                        </el-form-item>
                        <el-form-item label="服务启用时间:" label-width="120px" prop="starttime">
                            <ice-date-picker
                                    v-model="mainDataForm.starttime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    :time-filter="startTimeFilter"
                                    type="datetime"
                                    @change="timeChange"
                                    placeholder="选择日期">
                            </ice-date-picker>
                        </el-form-item>
                        <el-form-item label="创建人联系方式:" label-width="120px" prop="creatorcontact">
                            <el-input placeholder="创建人联系方式" maxlength="40"
                                      v-model="mainDataForm.creatorcontact"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-form-group name="操作人员">
                        <div>
                            <div class="ice-grid-button-bar">
                                <el-button type="primary" icon="el-icon-plus" @click="showSelectUser">
                                    新增
                                </el-button>
                            </div>

                            <ice-editable-table :data="operateEditGrid.gridData" :rules="operateEditGrid.rules"
                                                ref="detailtable">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-table-column prop="operationname"
                                                  :width="450"
                                                  label="操作人员">
                                </ice-table-column>

                                <ice-editable-table-column prop="operationcontact"
                                                           label="联系电话"
                                                           :width="550"
                                                           input-type="input"
                                >
                                </ice-editable-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteOperateItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>

                    </ice-form-group>
                    <ice-form-group name="涉及影响的业务">
                        <div>
                            <div class="ice-grid-button-bar">
                                <el-button type="primary" icon="el-icon-plus" @click="showYwSelect">新增</el-button>
                            </div>
                            <div class="grid-bar" style="width: 100%;">
                                <ice-editable-table style="width: 100%;" :data="bizEditGrid.gridData"
                                                    :rules="bizEditGrid.rules" ref="influenceUserTable">
                                    <el-table-column :width="70"
                                                     label="序号">
                                        <template slot-scope="scope">
                                            {{scope.$index+1}}
                                        </template>
                                    </el-table-column>
                                    <ice-table-column prop="psbcname"
                                                      :width="220"
                                                      label="服务名称">
                                    </ice-table-column>
                                    <ice-table-column prop="area"
                                                      label="区域"
                                                      :width="220"
                                                      input-type="input">
                                    </ice-table-column>

                                    <ice-editable-table-column prop="stoptime"
                                                               label="业务服务停用时间"
                                                               input-type="input"
                                                               :width="210">
                                        <template slot-scope="scope">
                                            <ice-date-picker
                                                    type="datetime"
                                                    :time-filter="stopTimeFilter"
                                                    v-model="scope.row.stoptime"
                                                    placeholder="选择日期">
                                            </ice-date-picker>
                                        </template>

                                    </ice-editable-table-column>
                                    <ice-editable-table-column prop="starttime"
                                                               label="业务服务启用时间"
                                                               input-type="input"
                                                               :width="210">
                                        <template slot-scope="scope">
                                            <ice-date-picker
                                                    type="datetime"
                                                    :time-filter="startTimeFilter"
                                                    v-model="scope.row.starttime"
                                                    placeholder="选择日期">
                                            </ice-date-picker>
                                        </template>
                                    </ice-editable-table-column>
                                    <ice-table-column prop="expendtime"
                                                      label="总耗时(分钟)"
                                                      input-type="input"
                                                      :width="100">
                                    </ice-table-column>

                                    <el-table-column label="操作" :width="120" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button type="text"
                                                       size="small" @click="deleteBizItem(scope.$index)">删除
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                    </ice-form-group>
                    <ice-form-group name="涉及影响的技术服务">
                        <div class="ice-grid-button-bar">
                            <el-button type="primary" icon="el-icon-plus" @click="showJsSelect">新增</el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;">
                            <ice-editable-table style="width: 100%;" :data="bizJsGrid.gridData"
                                                :rules="bizJsGrid.rules" ref="influenceUserTable">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-table-column prop="parentname"
                                                  :width="140"
                                                  label="服务大类">
                                </ice-table-column>
                                <ice-table-column prop="categoryname"
                                                  label="服务分类"
                                                  :width="140"
                                                  input-type="input">
                                </ice-table-column>

                                <ice-table-column prop="area"
                                                  label="区域"
                                                  :width="140"
                                                  input-type="input">
                                </ice-table-column>

                                <ice-editable-table-column prop="stoptime"
                                                           label="技术服务停用时间"
                                                           input-type="input"
                                                           :width="220">
                                    <template slot-scope="scope">
                                        <ice-date-picker
                                                type="datetime"
                                                :time-filter="stopTimeFilter"
                                                v-model="scope.row.stoptime"
                                                placeholder="选择日期">
                                        </ice-date-picker>
                                    </template>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="starttime"
                                                           label="技术服务启用时间"
                                                           input-type="input"
                                                           :width="220">
                                    <template slot-scope="scope">
                                        <ice-date-picker
                                                type="datetime"
                                                :time-filter="startTimeFilter"
                                                v-model="scope.row.starttime"
                                                placeholder="选择日期">
                                        </ice-date-picker>
                                    </template>
                                </ice-editable-table-column>
                                <ice-table-column prop="expendtime"
                                                  label="总耗时(分钟)"
                                                  input-type="input"
                                                  :width="110">
                                </ice-table-column>

                                <el-table-column label="操作" :width="130">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteJsItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                    <ice-form-group name="涉及影响的设备">
                        <div class="ice-grid-button-bar">
                            <el-button type="primary" icon="el-icon-plus" @click="showSbSelect">新增</el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;">
                            <ice-editable-table style="width: 100%;" :data="bizSbGrid.gridData"
                                                :rules="bizSbGrid.rules" ref="influenceUserTable">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-table-column prop="devname"
                                                  :width="140"
                                                  label="设备名称">
                                </ice-table-column>
                                <ice-table-column prop="category"
                                                  label="设备子类"
                                                  :width="140"
                                                  input-type="input">
                                </ice-table-column>
                                <ice-table-column prop="area"
                                                  label="区域"
                                                  :width="140"
                                                  input-type="input">
                                </ice-table-column>

                                <ice-editable-table-column prop="stoptime"
                                                           label="设备停用时间"
                                                           input-type="input"
                                                           :width="220">
                                    <tempserviceTracklate slot-scope="scope">
                                        <ice-date-picker
                                                type="datetime"
                                                :time-filter="stopTimeFilter"
                                                v-model="scope.row.stoptime"
                                                placeholder="选择日期">
                                        </ice-date-picker>
                                    </tempserviceTracklate>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="starttime"
                                                           label="设备启用时间"
                                                           input-type="input"
                                                           :width="220">
                                    <template slot-scope="scope">
                                        <ice-date-picker
                                                type="datetime"
                                                :time-filter="startTimeFilter"
                                                v-model="scope.row.starttime"
                                                placeholder="选择日期">
                                        </ice-date-picker>
                                    </template>
                                </ice-editable-table-column>
                                <ice-table-column prop="expendtime"
                                                  label="总耗时(分钟)"
                                                  input-type="input"
                                                  :width="110">
                                </ice-table-column>

                                <el-table-column label="操作" :width="130">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteSbItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="描述:" label-width="80px" style="width:1167px">
                                <div class="grid-bar" style="width: 100%;">
                                    <el-input type="textarea" maxlength="170" v-model="mainDataForm.reamrk"></el-input>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>

            </div>
            <div class="dialog-footer ice-button-bar" slot="footer">
                <el-button type="primary" :disabled="checkDisable" v-if="mainDataForm.state != '1'" @click="save(2)">保
                    存
                </el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>


        <ice-persion-selector :grid-index="false"
                              mode="hidden"
                              ref="operateUser"
                              @select-confirm="addOperateData"></ice-persion-selector>

        <pro-sc-common-catalog-tree @tree-check="treeCheck" ref="proCatalogTree"></pro-sc-common-catalog-tree>
        <pro-sc-common-tech-catalog-tree @tree-check="treeJsCheck"
                                         ref="proTechCatalogTree"></pro-sc-common-tech-catalog-tree>
        <dev-select ref="devSelect" v-if="devSelectShow"
                    :multiple="true"
                    :on-close-handler="selectOverHandler"></dev-select>

    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";
    import IceDatePicker from "../../../components/common/base/IceDatePicker";
    import ProScCommonCatalogTree from "@/pages/pro/sc/common/ProScCommonCatalogTree";
    import ProScCommonTechCatalogTree from "@/pages/pro/sc/common/ProScCommonTechCatalogTree";
    import DevSelect from "@/pages/biz/dev/devSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";

    export default {
        name: 'startandstopCommon',
        props: {
            execuNum: {
                type: String,
                default: ""
            },
            readOnly: {
                type: Boolean,
                default: false
            }
        },
        data() {
            /* let tabChange = {
                 type: 'tab',
                 code: '',
                 value: 'startaandstop',
                 click: value => {
                     this.defaultGrid = this[value];
                 },
                 tablist: [
                     {label: '启停信息', value: 'startaandstop'},
                 ]
             };*/
            return {
                tableData: [
                    {
                        id: '记录单号',
                        name: '',
                        amount1: '',
                    }
                ],
                devSelectShow: false,
                defaultGrid: {
                    dataUrl: "/biz/BizStartandstopRecord/searchByTypePage",
                    query: [],
                    columns: [],
                    buttons: [],
                    operations: []
                },
                startaandstop: {
                    dataUrl: "/biz/BizStartandstopRecord/searchByTypePage",
                    query: [
                        {type: 'input', label: '记录单号', code: 'recordid', value: ''},
                        {type: 'static', label: '实施单号', code: 'execuNum', value: () => this.execuNum},
                        {type: 'input', label: '服务名称', code: 'psbcname', value: ''},
                        {type: 'input', label: '服务分类', code: 'categoryname', value: ''},
                        {type: 'input', label: '设备名称', code: 'devname', value: ''},
                        {type: 'select', label: '是否影响服务', code: 'isaffectservice', mapTypeCode: "YES_NO", value: ''},
                        {type: 'select', label: '停用原因', code: 'reason', mapTypeCode: "REASON", value: ''},
                    ],
                    columns: [
                        {code: 'oid', hidden: true},
                        {label: '记录单号', code: 'recordid', width: 200, sortable: true},
                        {label: '服务名称', code: 'psbcname', width: 120, sortable: true},
                        {label: '服务分类', code: 'categoryname', width: 110, sortable: true},
                        {label: '设备名称', code: 'devname', width: 100, sortable: true},
                        {label: '是否影响服务', code: 'isaffectservice', width: 120, mapTypeCode: "YES_NO"},
                        {label: '服务启动时间', code: 'starttime', width: 130, sortable: true},
                        {label: '服务停用时间', code: 'stoptime', width: 130, sortable: true},
                        {label: '停用原因', code: 'reason', width: 120, sortable: true, mapTypeCode: "REASON"},
                        {label: '创建人', code: 'creatorname', width: 80},
                        {label: '创建时间', code: 'createtime', width: 200, sortable: true},
                        {label: '操作人员', code: 'operatorname', width: 100, sortable: true}
                    ],
                    buttons: [],
                    operations: []
                },
                operateEditGrid: {
                    gridData: [],
                    rules: {
                        operationcontact: {
                            required: true,
                            whitespace: true,
                            message: '请输入联系方式',
                            repeatable: true,
                            trigger: 'blur'
                        },
                    }
                },
                // 业务服务目录
                bizEditGrid: {
                    gridData: [],
                    rules: {
                        code: {required: true, whitespace: true, message: '请输入编码', repeatable: false, trigger: 'blur'},
                        name: {required: true, whitespace: true, message: '请输入名称'},
                    }
                },
                // 技术服务目录
                bizJsGrid: {
                    gridData: [],
                    rules: {
                        code: {required: true, whitespace: true, message: '请输入编码', repeatable: false, trigger: 'blur'},
                        name: {required: true, whitespace: true, message: '请输入名称'},
                    }
                },
                //设备
                bizSbGrid: {
                    gridData: [],
                    rules: {
                        devname: {required: true, whitespace: true, message: '', repeatable: false, trigger: 'blur'},
                        category: {required: true, whitespace: true, message: '请输入名称'},
                    }
                },
                dialogVisible: false,
                aclKeyReadonly: false,
                mainDataForm: {
                    execuNum: "",
                    reason: "",
                    isaffectservice: "",
                    stoptime: "",
                    starttime: "",
                    creatorcontact: ""
                },
                mainDataFormval: {},
                formRules: {
                    reason: [{required: true, message: '请选择停用原因', trigger: 'blur'}],
                    isaffectservice: [{required: true, message: '请选择停用原因', trigger: 'blur'}],
                    stoptime: [{required: true, message: '请选择停用时间', trigger: 'blur'}],
                },
                tittle: '服务启停',
                currentUser: [],
                flagRowData: '',
                checkDisable: false
            }
        },
        methods: {
            /**
             * 初始化页面控件
             */
            initControls() {
                if (this.readOnly) {
                    this.startaandstop.operations = [];
                    this.startaandstop.buttons = [];
                } else {
                    this.startaandstop.operations = [{name: '删除', callback: this.deleteAcl}];
                    this.startaandstop.buttons = [{
                        name: '新增', icon: 'el-icon-plus', type: 'primary', callback: () => {
                            this.mainDataForm = {
                                reason: "",
                                isaffectservice: "",
                                stoptime: "",
                                starttime: "",
                                creatorcontact: this.$userInfo.handphoneTel
                            };
                            this.bizEditGrid.gridData = [];
                            this.bizSbGrid.gridData = [];
                            this.bizJsGrid.gridData = [];
                            this.operateEditGrid.gridData = [];
                            let user = {};
                            user.operationcode = this.$userInfo.userCode;
                            user.operationname = this.$userInfo.userName;
                            user.operationcontact = this.$userInfo.handphoneTel;
                            user.operationdeptcode = this.$userInfo.deptCode;
                            user.operationdeptname = this.$userInfo.deptName;
                            user.operationorgcode = this.$userInfo.orgCode;
                            user.operationorgname = this.$userInfo.orgName;
                            this.operateEditGrid.gridData.push(user);
                            this.aclKeyReadonly = false;
                            this.dialogVisible = true;
                            this.tittle = '服务启停新增'
                        }
                    }];
                }
            },
            deleteAcl(row) {
                if (row && (row.state == 1)) {
                    this.$message.error("已发布服务，不许删除");
                    return;
                }
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get('/biz/BizStartandstopRecord/delete', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            },
            stopTimeFilter(time) {
                if (!this.mainDataForm.starttime) {
                    return true
                }
                return time < new Date(this.mainDataForm.starttime)
            },
            startTimeFilter(time) {
                if (!this.mainDataForm.stoptime) {
                    return true
                }
                return time > new Date(this.mainDataForm.stoptime)
            },
            timeChange() {
                if (this.mainDataForm.stoptime && this.mainDataForm.starttime && this.mainDataForm.stoptime > this.mainDataForm.starttime) {
                    this.$message.warning("服务启用时间不能小于服务停用时间");
                    this.mainDataForm.starttime = "";
                }
                let _this = this;
                if (_this.mainDataForm.stoptime && _this.mainDataForm.starttime) {
                    _this.bizEditGrid.gridData.forEach(item => {
                        if (!item.stoptime && !item.starttime) {
                            item.stoptime = _this.mainDataForm.stoptime;
                            item.starttime = _this.mainDataForm.starttime;
                        }
                    });
                    let arr1 = [];
                    Object.assign(arr1, _this.bizEditGrid.gridData);
                    _this.bizEditGrid.gridData = [];
                    _this.bizEditGrid.gridData = arr1;

                    _this.bizJsGrid.gridData.forEach(item => {
                        if (!item.stoptime && !item.starttime) {
                            item.stoptime = _this.mainDataForm.stoptime;
                            item.starttime = _this.mainDataForm.starttime;
                        }
                    });
                    let arr2 = [];
                    Object.assign(arr2, _this.bizJsGrid.gridData);
                    _this.bizJsGrid.gridData = [];
                    _this.bizJsGrid.gridData = arr2;

                    _this.bizSbGrid.gridData.forEach(item => {
                        if (!item.stoptime && !item.starttime) {
                            item.stoptime = _this.mainDataForm.stoptime;
                            item.starttime = _this.mainDataForm.starttime;
                        }
                    });
                    let arr3 = [];
                    Object.assign(arr3, _this.bizSbGrid.gridData);
                    _this.bizSbGrid.gridData = [];
                    _this.bizSbGrid.gridData = arr3;
                }
            },
            deleteOperateItem(index) {
                this.operateEditGrid.gridData.splice(index, 1);
            },
            //人员选择弹窗
            showSelectUser(index) {
                this.$refs.operateUser.openDialog();
                this.$nextTick(() => {
                    this.$refs.operateUser.cleanColumnSelect();
                })
            },
            addOperateData(rows) {
                let flag = true;
                for (let i = 0; i < rows.length; i++) {
                    for (let j = 0; j < this.operateEditGrid.gridData.length; j++) {
                        if (this.operateEditGrid.gridData[j].operationcode == rows[i].code) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        let use = {};
                        use.operationcode = rows[i].code;
                        use.operationname = rows[i].name;
                        use.operationcontact = rows[i].phone;
                        use.operationdeptcode = rows[i].dataDeptCode;
                        use.operationdeptname = rows[i].deptShortName;
                        use.operationorgcode = rows[i].dataOrgCode;
                        use.operationorgname = rows[i].orgShortName;
                        this.operateEditGrid.gridData.push(use);
                    }
                }
            },

            //设计影响的业务 弹窗
            showYwSelect() {
                this.$refs.proCatalogTree.opendialog();
            },
            treeCheck(currentCheckedNode, nodeStatus) {
                nodeStatus.checkedNodes.forEach(item => {
                    let flag = true;
                    if (item.children.length == 0 && item.categoryId != null) {
                        this.bizEditGrid.gridData.forEach(data => {
                            if (data.psbcname == item.name && data.area == item.areaName) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            let node = {};
                            node.psbcname = item.name;
                            node.area = item.areaName;
                            node.stoptime = this.mainDataForm.stoptime;
                            node.starttime = this.mainDataForm.starttime;
                            this.bizEditGrid.gridData.push(node)
                        }
                    }
                })
            },
            //设计影响的技术服务 弹窗
            showJsSelect() {
                this.$refs.proTechCatalogTree.opendialog();
            },
            treeJsCheck(currentCheckedNode, nodeStatus) {
                nodeStatus.checkedNodes.forEach(item => {
                    let flag = true;
                    if (item.children.length == 0 && null != item.categoryId) {
                        this.bizJsGrid.gridData.forEach(data => {
                            if (data.area == item.areaName && data.parentname == item.name && data.categoryname == item.bigCategoryName) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            let node = {};
                            node.parentname = item.name;
                            node.categoryname = item.bigCategoryName;
                            node.area = item.areaName;
                            node.stoptime = this.mainDataForm.stoptime;
                            node.starttime = this.mainDataForm.starttime;
                            this.bizJsGrid.gridData.push(node)
                        }
                    }
                })
            },
            //设计影响的设备 弹窗
            showSbSelect() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },

            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    data.forEach(item => {
                        let flag = true;
                        this.bizSbGrid.gridData.forEach(data => {
                            if (data.devid == item.oid) {
                                flag = false;
                            }
                        })
                        if (flag) {
                            let node = {};
                            node.devid = item.oid;
                            node.devname = item.name;
                            this.$axios.get('biz/BizDev/loadDevTree').then(result => {
                                result.data.forEach(r => {
                                    r.childCategory.forEach(c => {
                                        if (c.code == item.childType) {
                                            node.category = c.name;
                                        }
                                    })

                                })
                                node.area = item.netAreaAndType;
                                node.stoptime = this.mainDataForm.stoptime;
                                node.starttime = this.mainDataForm.starttime;
                                this.bizSbGrid.gridData.push(node);
                            }).catch(error => {
                                this.$message.error(error.msg)
                            })
                        }
                    })
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                });
            },
            deleteBizItem(index) {
                this.bizEditGrid.gridData.splice(index, 1);
            },
            deleteJsItem(index) {
                this.bizJsGrid.gridData.splice(index, 1);
            },
            deleteSbItem(index) {
                this.bizSbGrid.gridData.splice(index, 1);
            },
            editAcl(row, index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                if (row && (row.state == 1)) {
                    this.$message.error("已发布服务，不许删除");
                    return;
                }
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.get('/biz/BizStartandstopRecord/delete', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            updateRow(row) {
                this.$axios.get('/biz/BizStartandstopRecord/searchById', {params: {id: row.oid}}).then(result => {
                    this.dialogVisible = true;
                    this.aclKeyReadonly = true;

                    this.tittle = result.data.state == 1 ? ' 服务启停详情' : '服务启停编辑';
                    this.$nextTick(() => {
                        this.operateEditGrid.gridData = [];
                        this.bizEditGrid.gridData = [];
                        this.bizJsGrid.gridData = [];
                        this.bizSbGrid.gridData = [];
                        result.data.userList.forEach(item => {
                            this.operateEditGrid.gridData.push(item);
                        });
                        result.data.psbcList.forEach(item => {
                            this.bizEditGrid.gridData.push(item);
                        });
                        result.data.serviceList.forEach(item => {
                            this.bizJsGrid.gridData.push(item);
                        });
                        result.data.devList.forEach(item => {
                            this.bizSbGrid.gridData.push(item);
                        });
                        this.mainDataForm = result.data;
                    });
                }).catch(error => {
                    this.$message.error(error.msg)
                })
            },
            save(type) {
                this.checkDisable = true;
                this.$refs['form'].validate((valid) => {
                    this.$refs.detailtable.validateAll((valid1) => {
                        if (this.operateEditGrid.gridData.length == 0) {
                            valid = false;
                            this.$message.error("请至少选择一个操作人员");
                            this.checkDisable = false;
                        }
                        if (this.bizJsGrid.gridData.length == 0 && this.bizEditGrid.gridData.length == 0 && this.bizSbGrid.gridData.length == 0) {
                            valid = false;
                            this.$message.error("请至少选择一种需要停用的服务或设备");
                            this.checkDisable = false;
                        }
                        if (valid && valid1) {
                            this.mainDataForm.state = type + "";
                            let obj = this.mainDataForm;

                            obj.userList = this.operateEditGrid.gridData;
                            obj.psbcList = this.bizEditGrid.gridData;
                            obj.serviceList = this.bizJsGrid.gridData;
                            obj.devList = this.bizSbGrid.gridData;
                            obj.execuNum = this.execuNum;
                            this.$axios.post('/biz/BizStartandstopRecord/save', obj).then(result => {
                                this.$message.success("成功");
                                this.dialogVisible = false;
                                this.checkDisable = false;
                                this.$refs.grid.refresh();
                            }).catch(error => {
                                this.checkDisable = false;
                                this.$message.error(error.msg)
                            })
                        } else {
                            this.checkDisable = false;
                            return false;
                        }
                    });
                })
            },
            closeDialog() {
                this.dialogVisible = false;
            },

        },
        mounted() {
            this.defaultGrid = this.startaandstop;
        },
        watch: {
            readOnly: {
                immediate: true,
                handler(newValue) {
                    this.readOnly = newValue;
                    this.initControls();
                }
            }
        },
        components: {
            IceFormGroup,
            IceDialog,
            IceDatePicker,
            IceTableColumn,
            IceSelect,
            IcePersionSelector,
            IceEditableTableColumn,
            IceEditableTable,
            IceQueryGrid,
            IceGridLayout,
            ProScCommonCatalogTree,
            ProScCommonTechCatalogTree,
            DevSelect
        }
    }

</script>


<style scoped>

</style>
