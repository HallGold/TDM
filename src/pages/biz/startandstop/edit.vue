<template>
    <div class="form-content">
        <el-form label-width="140px" status-icon ref="form" :model="startAndStopData">
            <ice-grid-layout :columns="2" name="服务启停基本信息">
                <el-form-item label="停用原因">
                    <ice-select map-type-code="stopReason" placeholder="停用原因"
                                v-model="startAndStopData.reason"></ice-select>
                </el-form-item>
                <el-form-item label="是否影响服务">
                    <el-select placeholder="是否影响服务" v-model="startAndStopData.isAffectService">
                        <el-option
                                v-for="(item,index) in 1"
                                :key="index"
                                :label="item.name"
                                :value="item.code">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务停用时间">
                    <el-date-picker type="datetime" v-model="startAndStopData.stopTime"
                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                </el-form-item>
                <el-form-item label="服务启用时间">
                    <el-date-picker type="datetime" v-model="startAndStopData.startTime"
                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="创建人">
                     <el-input></el-input>
                 </el-form-item>
                 <el-form-item label="创建人联系电话">
                     <el-input></el-input>
                 </el-form-item>-->
                <div class="content" :layout="2">
                    <div class="text"><span class="required-star">*</span>操作人员</div>
                    <ice-query-grid title="" class="table"
                                    :gridData="startAndStopData.userList"
                                    :query="PAGE_ENUMS.OPERATOR_GRID.querys"
                                    :columns="PAGE_ENUMS.OPERATOR_GRID.columns"
                                    :ref="PAGE_ENUMS.OPERATOR_GRID.ref"
                                    :operations="PAGE_ENUMS.OPERATOR_GRID.operations"
                                    :operationsWidth=100
                                    chooseItem="multiple"
                                    :minHeight="200"
                                    :pagination="false"
                                    @selection-change="operatorSelectionChange"
                                    :buttons="PAGE_ENUMS.OPERATOR_GRID.buttons">
                    </ice-query-grid>
                </div>
            </ice-grid-layout>
            <ice-grid-layout name="启停服务" :columns="2">
                <div class="content" :layout="2">
                    <div class="text" style="padding-right: 8px"><span class="required-star">*</span>涉及影响的服务</div>
                    <div style="background-color: white">
                        <el-button icon="el-icon-plus" type="primary" @click="addManage" class="tableBtn">
                            增加
                        </el-button>
                        <el-button icon="el-icon-delete" type="primary" @click="deleteManage" class="tableBtn">删除
                        </el-button>
                        <ice-editable-table layout="2" :ref="PAGE_ENUMS.PSBC_GRID.ref"
                                            :data="startAndStopData.psbcList" height="200">
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="type"
                                    prop="type">
                            </el-table-column>
                            <el-table-column
                                    label="服务名称"
                                    :width="300"
                                    prop="psbcName">
                            </el-table-column>
                            <el-table-column
                                    label="区域"
                                    :width="150"
                                    prop="area">
                            </el-table-column>
                            <ice-editable-table-column label="业务服务停用时间" :width="250"
                                                       type="input" prop="stopTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.stopTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <ice-editable-table-column label="业务服务启用时间" :width="250"
                                                       type="input" prop="startTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.startTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <el-table-column
                                    label="总耗时(分钟)"
                                    :width="170"
                                    prop="expendTime">
                            </el-table-column>
                        </ice-editable-table>
                    </div>
                </div>
                <div class="content" :layout="2">
                    <div class="text" style="padding-right: 8px"><span class="required-star">*</span>涉及影响的<br>技术服务</div>
                    <div style="background-color: white">
                        <el-button icon="el-icon-plus" type="primary" @click="addManage" class="tableBtn">
                            增加
                        </el-button>
                        <el-button icon="el-icon-delete" type="primary" @click="deleteManage" class="tableBtn">删除
                        </el-button>
                        <ice-editable-table layout="2" :ref="PAGE_ENUMS.SERVICE_GRID.ref"
                                            :data="startAndStopData.serviceList" height="200">
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="type"
                                    prop="type">
                            </el-table-column>
                            <el-table-column
                                    label="服务大类"
                                    :width="200"
                                    prop="parentName">
                            </el-table-column>
                            <el-table-column
                                    label="服务分类"
                                    :width="200"
                                    prop="categoryName">
                            </el-table-column>
                            <el-table-column
                                    label="区域"
                                    :width="150"
                                    prop="area">
                            </el-table-column>
                            <ice-editable-table-column label="技术服务停用时间" :width="200"
                                                       type="input" prop="stopTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.stopTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <ice-editable-table-column label="技术服务启用时间" :width="200"
                                                       type="input" prop="startTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.startTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <el-table-column
                                    label="总耗时(分钟)"
                                    :width="170"
                                    prop="expendTime">
                            </el-table-column>
                        </ice-editable-table>
                    </div>
                </div>
                <div class="content" :layout="2">
                    <div class="text" style="padding-right: 8px"><span class="required-star">*</span>涉及影响的<br>设备</div>
                    <div style="background-color: white">
                        <el-button icon="el-icon-plus" type="primary" @click="addManage" class="tableBtn">
                            增加
                        </el-button>
                        <el-button icon="el-icon-delete" type="primary" @click="deleteManage" class="tableBtn">删除
                        </el-button>
                        <ice-editable-table layout="2" :ref="PAGE_ENUMS.SERVICE_GRID.ref"
                                            :data="startAndStopData.devList" height="200">
                            <el-table-column
                                    type="selection"
                                    width="30">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="type"
                                    prop="type">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="devId"
                                    prop="devId">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="sn"
                                    prop="sn">
                            </el-table-column>
                            <el-table-column
                                    v-if="false"
                                    label="secretSn"
                                    prop="secretSn">
                            </el-table-column>
                            <el-table-column
                                    label="设备名称"
                                    :width="200"
                                    prop="devName">
                            </el-table-column>
                            <el-table-column
                                    label="设备子类"
                                    :width="200"
                                    prop="category">
                            </el-table-column>
                            <el-table-column
                                    label="区域"
                                    :width="150"
                                    prop="area">
                            </el-table-column>
                            <ice-editable-table-column label="设备停用时间" :width="200"
                                                       type="input" prop="stopTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.stopTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <ice-editable-table-column label="设备启用时间" :width="200"
                                                       type="input" prop="startTime">
                                <template slot-scope="scope">
                                    <el-date-picker type="datetime" v-model="scope.row.startTime"
                                                    format="yyyy-MM-dd HH:mm"></el-date-picker>
                                </template>
                            </ice-editable-table-column>
                            <el-table-column
                                    label="总耗时(分钟)"
                                    :width="170"
                                    prop="expendTime">
                            </el-table-column>
                        </ice-editable-table>
                    </div>
                </div>
            </ice-grid-layout>
            <ice-grid-layout :columns="2" name="备注">
                <el-form-item label="备注" layout="2" label-width="140px">
                    <el-input type="textarea" :rows="4"
                              placeholder="请输入备注" v-model="startAndStopData.remark"></el-input>
                </el-form-item>
            </ice-grid-layout>
        </el-form>
        <ice-persion-selector :grid-index="false"
                              chooseItem="multiple" mode="hidden"
                              :ref="PAGE_ENUMS.SELECT_PERSONS.ref"
                              v-if="PAGE_ENUMS.SELECT_PERSONS.show"
                              @select-confirm="selectPersonConfirm"></ice-persion-selector>
    </div>
</template>

<script>
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import bizComm from "@/pages/biz/js/comm";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";

    export default {
        name: "edit",
        components: {
            IcePersionSelector,
            IceQueryGrid, IceSelect, IceGridLayout, IceEditableTable, IceEditableTableColumn
        },
        mixins: [bizComm],
        data() {
            return {
                PAGE_ENUMS: {
                    OPERATOR_GRID: {
                        columns: [],
                        buttons: [],
                        querys: [],
                        operations: [],
                        slections: [],
                        ref: "operatorGrid"
                    },
                    //业务服务表格
                    PSBC_GRID: {
                        ref: "psbcGrid"
                    },
                    //技术服务表格
                    SERVICE_GRID: {
                        ref: "serviceGrid"
                    },
                    DEV_GRID: {
                        ref: "devGrid"
                    },
                    SELECT_PERSONS: {
                        ref: "personsSelect",
                        show: false
                    },
                    FIELDS: {
                        USER_CODE: "userCode"
                    }
                },
                startAndStopData: {
                    oid: "",
                    reason: "",//启停原因
                    isAffectService: "",//是否影响服务
                    stopTime: "",//停用时间
                    startTime: "",//启用时间
                    creatorContact: "",//创建人联系方式
                    remark: "",//备注
                    state: "",//状态
                    creatorCode: "",//创建人code
                    creatorName: "",//创建人姓名
                    creatorDeptName: "",//创建人部门
                    creatorDeptCode: "",//创建人部门code
                    creatorOrgName: "",//创建人org
                    creatorOrgCode: "",//创建人orgcode
                    createTime: "",//创建时间
                    psbcList: [],//业务服务list
                    serviceList: [],//技术服务list
                    devList: [],//设备list
                    userList: []//操作人员list
                }
            }
        },
        methods: {
            /**
             * 初始化页面
             */
            initControls() {
                this.initColumns();
                this.initButtons();
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                this.PAGE_ENUMS.OPERATOR_GRID.columns = [
                    {code: 'oid', hidden: true},
                    {code: 'operatorCode', hidden: true},
                    {code: 'operatorDeptCode', hidden: true},
                    {code: 'operatorOrgCode', hidden: true},
                    {code: 'operatorOrgName', hidden: true},
                    {label: '操作人员', code: 'operatorName'},
                    {label: '操作人员部门', code: 'operatorDeptName'},
                    {label: '联系方式', code: 'operatorContact'},
                ];
            },
            /**
             * 初始化表格按钮
             */
            initButtons() {
                this.PAGE_ENUMS.OPERATOR_GRID.buttons = [Object.assign({}, this.COMM_ENUMS.BUTTON.ADD, {callback: this.addOperator}),
                    Object.assign({}, this.COMM_ENUMS.BUTTON.DELETE, {callback: this.deleteOperator})]
            },
            /**
             * 添加操作人员按钮响应事件
             */
            addOperator() {
                this.PAGE_ENUMS.SELECT_PERSONS.show = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUMS.SELECT_PERSONS.ref].openDialog();
                });
            },
            /**
             * 删除操作人员按钮响应事件
             */
            deleteOperator() {
                if (this.PAGE_ENUMS.OPERATOR_GRID.slections.length == 0) {
                    this.$message('请选择需要删除的操作人员');
                }
                this.deletes(this.startAndStopData.userList, this.PAGE_ENUMS.OPERATOR_GRID.slections);
            },
            /**
             * 人员选择后续操作
             * @param data
             */
            selectPersonConfirm(data) {
                this.PAGE_ENUMS.SELECT_PERSONS.show = false;
                this.startAndStopData.userList = this.startAndStopData.userList || [];
                for (let i = 0; i < data.length; i++) {
                    let _data = data[i];
                    if (this.findSameRowByCode(this.startAndStopData.userList, _data.code, this.PAGE_ENUMS.FIELDS.USER_CODE) == -1) {
                        this.startAndStopData.userList.push({
                            oid: "",
                            operatorContact: _data.phone,
                            operatorName: _data.name,
                            operatorCode: _data.code,
                            operatorDeptCode: _data.deptCode,
                            operatorDeptName: _data.deptShortName + "[" + _data.orgShortName + "]",
                            operatorOrgCode: _data.dataOrgCode,
                            operatorOrgName: _data.orgShortName
                        });
                    }
                }
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
             * 操作人员选择行改变事件
             * @param rows
             */
            operatorSelectionChange(rows) {
                this.PAGE_ENUMS.OPERATOR_GRID.slections = rows;
            },
            /**
             * 批量删除
             * @param list
             * @param deleteList
             */
            deletes(list, deleteList) {
                for (let i = 0; i < deleteList.length; i++) {
                    list.splice(list.indexOf(deleteList[i]), 1);
                }
            },
        },
        mounted() {
            this.initControls();
        }
    }
</script>

<style scoped>
    @import "./style/edit.less";

    .content {
        display: flex;
        align-items: center;
    }

    .text {
        width: 140px;
        height: 100%;
        text-align: right;
    }

    .table {
        width: 100%;
        padding-left: 16px
    }
</style>