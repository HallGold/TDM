<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-tree-grid
                    exportTitle="业务服务目录"
                    load-url="/pro/ProScBizCatalog/createTree?areaId="
                    label-prop="name"
                    value-prop="name"
                    data-url="/pro/ProScBizCatalog/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
                    :operationsWidth=100
                    :buttons="buttons"
                    :chooseItem="chooseItem"
                    ref="mainQueryGrid"
                    @pagClick="pagClick"
                    @selection-change="handleSelectionChange"
                    @node-click="nodeTreeSelectedHandler"
            >
            </ice-tree-grid>
        </div>

        <ice-dialog :title="`${dialogEditReadonly?'查看':(isAddFlag?'新增':'编辑')}服务`"
                    remounted
                    :visible.sync="dialogEditVisible"
                    :buttons="dialogEditReadonly?[]:addButtons"
                    width="900px">
            <div style="height: 500px" class="form-content">
                <div style="max-height: 500px;overflow-x: hidden">
                    <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                             class="conditon-bar" ref="editForm"
                             style="margin-top: 20px">
                        <ice-grid-layout name="基础属性" :columns="2">

                            <el-form-item label="区域:" label-width="140px" prop="areaId">
                                <el-select placeholder="请选择" v-model="editData.areaId" :disabled="!isAddFlag"
                                           v-if="isAddFlag">
                                    <el-option v-for="item in regionList"
                                               :key="item.oid"
                                               :label="item.shortname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.areaName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务名称:" label-width="140px" prop="categoryId">
                                <el-select placeholder="请选择" v-model="editData.categoryId" :disabled="!isAddFlag"
                                           @change="linkCatalogName" v-if="isAddFlag">
                                    <el-option v-for="item in serviceNameList"
                                               :key="item.oid"
                                               :label="item.sname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.categoryName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务项:" label-width="140px" prop="templateId">
                                <el-select placeholder="请选择" v-model="editData.templateId" :disabled="!isAddFlag"
                                           v-if="isAddFlag" @change="templateData">
                                    <el-option v-for="item in serviceOptionList"
                                               :key="item.oid"
                                               :label="item.sname"
                                               :value="item.oid"></el-option>
                                </el-select>
                                <el-input :disabled="true" v-if="!isAddFlag"
                                          v-model="editData.catalogName"></el-input>
                            </el-form-item>

                            <el-form-item label="是否使用用户级别:" label-width="140px" prop="isUsrLv">
                                <ice-select placeholder="是否有合作商" map-type-code="YES_NO"
                                            v-model="editData.isUsrLv">
                                </ice-select>
                            </el-form-item>

                            <el-form-item label="服务级别:" label-width="140px" prop="lv">
                                <div>
                                    <ice-select placeholder="请选择" map-type-code="SC_LEVEL"
                                                v-model="editData.lv" style="width:80%;float:left">
                                    </ice-select>
                                    <el-button type="info"
                                               icon="el-icon-search"
                                               @click="innerSLAVisible = true"
                                               style="float:right" plain>
                                    </el-button>
                                </div>
                            </el-form-item>

                            <el-form-item label="主管部门:" label-width="140px" prop="deptName">
                                <el-input v-model="editData.deptName"
                                          readonly>
                                    <el-button slot="append"
                                               title="点我选择部门"
                                               icon="el-icon-more"
                                               @click="chooseDept(0)"></el-button>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="服务责任部门:" label-width="140px" prop="serviceDutydeptName">
                                <el-input v-model="editData.serviceDutydeptName"
                                          readonly>
                                    <el-button slot="append"
                                               title="点我选择部门"
                                               icon="el-icon-more"
                                               @click="chooseDept(1)"></el-button>
                                </el-input>
                            </el-form-item>

                            <el-form-item label="是否面向用户:" label-width="140px" prop="isTouser">
                                <ice-select map-type-code="YES_NO"
                                            v-model="editData.isTouser">
                                </ice-select>
                            </el-form-item>

                            <el-form-item label="审批路径:" label-width="140px" prop="apprRoute">
                                <ice-select
                                        v-model="editData.apprRoute"
                                        map-type-code="PRO_SC_BIZ_CATALOG_TEMPLATE">
                                </ice-select>
                            </el-form-item>

                            <el-form-item label="有效开始时间:" label-width="140px" prop="gmtBegin">
                                <el-date-picker
                                        v-model="editData.gmtBegin"
                                        @change="changeGmtBegin"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="有效结束时间:" label-width="140px" prop="gmtEnd">
                                <el-date-picker
                                        v-model="editData.gmtEnd"
                                        :picker-options="{disabledDate(time) {return timeFilter(time)}}"
                                        placeholder="选择日期">
                                </el-date-picker>
                            </el-form-item>
                        </ice-grid-layout>
                        <ice-grid-layout name="使用说明" :columns="1">
                            <el-form-item label="使用说明:" label-width="120px" prop="instruction">
                                <el-input placeholder="使用说明"
                                          type="textarea"
                                          :rows="4"
                                          v-model="editData.instruction"
                                          maxlength="256"></el-input>
                            </el-form-item>
                            <el-form-item label-width="120px" label="附件信息:">
                                <ice-multiple-upload doSecret v-model="editData.instructionAtt"></ice-multiple-upload>
                            </el-form-item>
                        </ice-grid-layout>
                        <ice-grid-layout name="产出说明" :columns="1">

                            <el-form-item label="产出说明:" label-width="120px" prop="output">
                                <el-input placeholder="产出说明"
                                          type="textarea"
                                          :rows="4"
                                          v-model="editData.output"
                                          maxlength="256"></el-input>
                            </el-form-item>
                            <el-form-item label-width="120px" label="附件信息:">
                                <ice-multiple-upload doSecret v-model="editData.outputAtt"></ice-multiple-upload>
                            </el-form-item>
                        </ice-grid-layout>
                        <ice-grid-layout name="操作指引" :columns="1">

                            <el-form-item label="操作指引:" label-width="120px" prop="guideline">
                                <el-input placeholder="操作指引"
                                          type="textarea"
                                          :rows="4"
                                          v-model="editData.guideline"
                                          maxlength="256"></el-input>
                            </el-form-item>
                            <el-form-item label-width="120px" label="附件信息:">
                                <ice-multiple-upload doSecret v-model="editData.guidelineAtt"></ice-multiple-upload>
                            </el-form-item>
                        </ice-grid-layout>
                    </el-form>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog v-dialogDrag title="基础信息"
                    :visible.sync="dialogVisibleProScBizCatalog"
                    :buttons="moreButtons"

                    width="1000px">
            <pro-sc-biz-catalog-dialog ref="$moreOpt" :checkedIds="checked_ids"
                                       @closeDialog="closeDialog"></pro-sc-biz-catalog-dialog>
        </ice-dialog>
        <pro-sc-biz-catalog-batch-dialog ref="serviceBatch"
                                         @closeBatchDialog="closeBatchDialog">
        </pro-sc-biz-catalog-batch-dialog>

        <ice-dialog width="600px" title="查看服务级别信息" :visible.sync="innerSLAVisible">
            <div style="flex-grow: 1;display: flex;flex-direction: row;height: 400px">
                <ice-query-grid data-url="/pro/ProScSlaLevel/list"
                                :query="querySlaLevel"
                                :columns="columnsSlaLevel"
                                ref="mainQueryGrid">
                </ice-query-grid>
            </div>
        </ice-dialog>
        <ice-dept-selector
                allDept
                ref="deptSelect"
                chooseItem="single"
                mode="hidden"
                @select-cannel="selectCannel"
                :selectedDept="selectedDept"
                @select-confirm="selectDeptConfirm"></ice-dept-selector>
    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProScBizCatalogDialog from "./ProScBizCatalogDialog";
    import ProScBizCatalogBatchDialog from "./ProScBizCatalogBatchDialog";
    import ProBaseMaintainMember from "../module/ProBaseMaintainMember";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceTree from '@/components/common/base/IceTree.vue'
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IceDialog from "@/components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";

    export default {
        name: "ProScBizCatalogTemplate",
        components: {
            IceMultipleUpload,
            IceQueryGrid,
            ProBaseMaintainMember,
            ProScBizCatalogDialog,
            IceSelect,
            IceTreeGrid,
            ProScBizCatalogBatchDialog,
            IceGridLayout,
            IceTree,
            IceDeptSelector,
            IceDialog
        },
        data() {
            let ncolumns = [
                {label: 'oid', code: 'oid', hidden: true},
                {label: '区域', code: 'areaId', hidden: true},
                {label: '服务名称', code: 'categoryId', hidden: true},
                {label: '服务项名称', code: 'templateId', hidden: true},
                {label: '是否面向用户', code: 'isTouser', hidden: true},
                {label: '主管部门所在id', code: 'managementId', hidden: true},
                {label: '所在责任部门id', code: 'serviceDutydeptId', hidden: true},
                {label: '所在责任部门名称', code: 'serviceDutydeptName', hidden: true},
                {label: '审批路径', code: 'apprRoute', mapTypeCode: "PRO_SC_BIZ_CATALOG_TEMPLATE", hidden: true},
                {label: '产出说明', code: 'output', hidden: true, width: 155},
                {label: '操作指引', code: 'guideline', hidden: true, width: 100},
                {label: '使用说明', code: 'instruction', hidden: true, width: 100},

                {label: '区域名称', code: 'areaName', width: 200},
                {label: '服务名称', code: 'categoryName', width: 250},
                {label: '服务项', code: 'catalogName', width: 250},
                {label: '是否使用用户级别', code: 'isUsrLv', width: 140, mapTypeCode: "YES_NO", required: true, hidden: true},
                {label: '服务级别', code: 'lv', width: 80, required: true, mapTypeCode: "SC_LEVEL", hidden: true},
                {label: '主管部门名称', code: 'deptName', width: 140, required: true},
                {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled", sortable: true,},
                {label: '是否发布', code: 'isPublished', width: 100, mapTypeCode: "SERVICE_PUBLISH", sortable: true,},
                {label: '有效开始时间', code: 'gmtBegin', width: 150, sortable: true,},
                {label: '有效结束时间', code: 'gmtEnd', width: 150, sortable: true,},
                {label: '创建人', code: 'createUser', width: 100, hidden: true},
                {label: '创建时间', code: 'createDate', width: 150, sortable: true,}]
            return {
                isEdit: false,
                treeId: '0',
                treeName: '',
                query: [],
                selectedDept: [],
                queryObj: [
                    {
                        type: 'static', exp: 'in', value: () => {
                            return this.treeId == '0' ? null : this.treeId
                        }, code: 'areaId'
                    },
                    {label: '区域名称', code: 'areaName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务名称', code: 'categoryName', type: 'input', exp: 'upperLike', value: ''},
                    {label: '服务项', code: 'catalogName', type: 'input', exp: 'upperLike', value: ''},
                    // {label: '是否使用用户级别', code: 'isUsrLv', type: 'input', mapTypeCode: "YES_NO"},
                    {
                        type: 'select',
                        label: '是否使用用户级别',
                        code: 'isUsrLv',
                        mapTypeCode: "YES_NO",
                        value: ''
                    },
                    {label: '服务级别', code: 'lv', type: 'input', exp: 'upperLike', value: ''},
                    {label: '主管部门名称', code: 'deptName', type: 'input', exp: 'upperLike', value: ''},
                    {
                        type: 'select',
                        label: '是否发布',
                        code: 'isPublished',
                        mapTypeCode: "YES_NO",
                        value: ''
                    },
                    {
                        type: 'select',
                        label: '是否停用',
                        code: 'isDisabled',
                        mapTypeCode: "YES_NO",
                        value: ''
                    },
                    {label: '有效开始时间', code: 'gmtBegin', type: 'date', exp: ">=",compare:2},
                    {label: '有效结束时间', code: 'gmtEnd', type: 'date', exp: "<=",compare:3},
                    {label: '创建人', code: 'createUser', type: 'input', exp: 'upperLike', value: ''},
                    {label: '创建时间', code: 'createDate', type: 'date',compare:1}
                ],
                editData: common.toInitData(ncolumns, {
                    isTouser: '0',
                    isDisabled: '1',
                    oid: this.treeId + '',
                    serviceDutydeptName: '',
                    outputAtt: "",
                    instructionAtt: "",
                    guidelineAtt: ""
                }),
                //页面校验规则
                editRules: {
                    areaId: {required: true, message: '请选择区域'},
                    categoryId: {required: true, message: '请选择服务名称'},
                    templateId: {required: true, message: '请选择服务项'},
                    isUsrLv: {required: true, message: '请填写用户级别'},
                    lv: {required: true, message: '不能为空'},
                    apprRoute: {required: true, message: '请选择审批路径'},
                    deptName: {required: true, message: '请选择主管部门'}
                },
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem}],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}
                    , {name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.deleteCallback}
                    , {name: '导出', icon: 'el-icon-upload2', type: 'export'}
                    , {name: '更多操作', icon: 'el-icon-upload2', type: 'primary', callback: this.moreOptionCallback},
                    {
                        name: '更多功能',
                        icon: 'el-icon-plus',
                        type: 'dropdown',
                        callback: this.moreItem,
                        items: [
                            {name: '发布', code: 'publishCallback'},
                            {name: '取消发布', code: 'cancelPublishCallback'},
                            {name: '启用', code: 'startCallback'},
                            {name: '停用', code: 'endCallback'},
                            {name: '批量新增实例', code: 'addBatchCallback'}
                        ]
                    },],

                addButtons: [
                    {name: '保存', click: this.saveData},
                    {name: '取消', iscannel: true},
                ],
                moreButtons: [
                    {name: '保存', iscannel: false, click: this.saveMoreOptData},
                    {name: '取消', iscannel: true},
                ],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                dialogVisibleProBaseMaintainMember: false,
                tendId: '',
                dialogVisibleProScBizCatalog: false,
                chooseItem: 'multiple',
                checked_ids: '',
                checked_status: '',
                choosedFlag: false,
                dialogVisibleBatchProScBizCatalog: false,
                options: [
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                ],
                selectedNode: {},
                innerVisible: false,
                innerServiceVisible: false,
                selectedServiceNode: {},
                isAddFlag: false,
                regionList: [],
                serviceNameList: [],
                serviceOptionList: [],
                innerSLAVisible: false,
                querySlaLevel: [
                    {type: 'static', value: '1', code: 'lvType', exp: '='},
                ],
                columnsSlaLevel: [
                    {label: '主键id', code: 'loid', hidden: true, width: 125},
                    {label: '区域', code: 'areaName', width: 125},
                    {label: 'SLA指标', code: 'sname', width: 125},
                    {label: '等级1', code: 'lv1', width: 125},
                    {label: '等级2', code: 'lv2', width: 125},
                    {label: '等级3', code: 'lv3', width: 125},
                    {label: '等级4', code: 'lv4', width: 125},
                    {label: '等级5', code: 'lv5', width: 125},
                    {label: '等级6', code: 'lv6', width: 125},
                    {label: '等级7', code: 'lv7', width: 125},
                ],
                isDeptName: false,
                isServiceDutydeptName: false,
            }
        },
        methods: {
            /**根据服务项渲染说明*/
            templateData() {
                for (let i = 0; i < this.serviceOptionList.length; i++) {
                    if (this.editData.templateId == this.serviceOptionList[i].oid) {
                        this.editData.instruction = this.serviceOptionList[i].instruction;
                        this.editData.output = this.serviceOptionList[i].output;
                        this.editData.guideline = this.serviceOptionList[i].guideline;
                    }
                }
            },
            /**时间过滤*/
            timeFilter(time) {
                if (time < new Date(this.editData.gmtBegin)) {
                    return true
                }
                return false;
            },
            changeGmtBegin() {
                if (new Date(this.editData.gmtBegin) > new Date(this.editData.gmtEnd)) {
                    this.editData.gmtEnd = '';
                }
            },
            chooseDept(val) {
                if (val == 0) {
                    this.isDeptName = true;
                    this.isServiceDutydeptName = false;
                } else {
                    this.isDeptName = false;
                    this.isServiceDutydeptName = true;
                }
                this.$refs.deptSelect.openDialog();
            },
            pagClick(data) {
                this.choosedFlag = false;
            },
            /**
             * 更多功能
             */
            moreItem(code) {
                if (code == 'publishCallback') {//发布
                    this.publishCallback();
                } else if (code == 'cancelPublishCallback') {//取消发布
                    this.cancelPublishCallback();
                } else if (code == 'startCallback') {//启用
                    this.startCallback();
                } else if (code == 'endCallback') {//停用
                    this.endCallback();
                } else if (code == 'addBatchCallback') {//批量新增实例
                    this.addBatchCallback();
                }
            },
            addCallback() {
                this.isEdit = false;
                this.editData = common.toInitData(this.columns, {
                    approvePath: '',
                    isUsrLv: '0',
                    isDisabled: '1',
                    isTouser: '0',
                    lv: '1',
                    areaName: this.treeName + ''
                });
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.isAddFlag = true;
            },
            addBatchCallback() {
                this.$refs.serviceBatch.openDialog();
            },
            deleteCallback() {
                if (this.checked_status.indexOf("1") != -1) {
                    this.$message.warning("不能选择已发布的数据进行删除！！！");
                } else {
                    if (this.choosedFlag) {
                        this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        }).then(() => {
                            this.$axios.delete("/pro/ProScBizCatalog/dels", {"params": {"ids": this.checked_ids}})
                                .then(result => {
                                    this.$message.success("操作成功");
                                    this.refresh();
                                    this.choosedFlag = false;
                                }).catch(error => {
                                this.$message.error(error.msg);
                            });
                        });
                    } else {
                        this.$message.warning('请先选择需要操作的记录！');
                    }
                }
            },
            async saveData() {
                try {
                    await this.$refs['editForm'].validate()
                } catch (e) {
                    return false;
                }
                this.editData.isPublished = '0'
                if (!this.isEdit) {
                    this.editData.oid = null;
                }
                await this.$axios.post("/pro/ProScBizCatalog/saveOrUpdate", this.editData);
                this.$message.success("保存成功");
                this.refresh();
                return true
            },
            saveMoreOptData() {
                this.$refs.$moreOpt.saveData();
                return false
            },
            getAreaName(oid) {
                if (this.rootNode == null) {
                    return '';
                }
                let name = this.rootNode[oid];
                return name ? name : '';
            },
            /**
             * 详情
             */
            async viewItem(row) {
                await this.$axios.get('/pro/ProScBizCatalog/catalogAll', {"params": {"categoryId": row.categoryId}}).then(success => {
                    this.serviceOptionList = success.data;
                });
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
                this.editData.sort = this.editData.sort + '';
                this.editData.lv = this.editData.lv + '';
                this.editData.areaShortname = this.getAreaName(this.editData.areaId);
            },
            /**
             * 编辑
             */
            editItem(row) {
                this.isEdit = true;
                this.dialogEditVisible = true;
                this.isAddFlag = false;
                this.dialogEditReadonly = false;
                let obj = {};
                Object.assign(obj, row);
                this.editData = obj;
                this.editData.lv = this.editData.lv + '';
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                if (node) {
                    let level1 = [{
                        type: 'static', value: () => {
                            return null
                        }, code: 'areaId'
                    }];
                    let level2 = [{
                        type: 'static', value: () => {
                            return node.data.areaId
                        }, code: 'areaId'
                    }];
                    let level3 = [
                        {
                            type: 'static', value: () => {
                                return node.data.categoryId
                            }, code: 'categoryId'
                        },
                        {
                            type: 'static', value: () => {
                                return node.data.areaId
                            }, code: 'areaId'
                        }
                    ];
                    if (node.level == 1) {
                        this.dynamicQuery(level1);
                    } else if (node.level == 2) {
                        this.dynamicQuery(level2)
                    } else if (node.level == 3) {
                        this.dynamicQuery(level3);
                    }
                    this.treeName = node.data.name;
                }

            },
            /**
             * 动态切换查询条件
             */
            dynamicQuery(arr) {
                this.query = [];
                this.query = arr;
                this.query.push(...this.queryObj);
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                if (rows.length > 0) {
                    let checked_ids = '';
                    let checked_status = '';
                    for (let i = 0; i < rows.length; i++) {
                        checked_status += rows[i].isPublished + ',';
                        checked_ids += rows[i].oid + ',';
                    }
                    this.checked_status = checked_status;
                    this.checked_ids = checked_ids;
                    this.choosedFlag = true
                } else {
                    this.choosedFlag = false
                }
            },
            publishCallback() {
                let url = "/pro/ProScBizCatalog/modifyPublishedState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要发布当前选中记录吗?"
                let tip = "发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            cancelPublishCallback() {
                let url = "/pro/ProScBizCatalog/modifyPublishedState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要取消发布当前选中记录吗?"
                let tip = "取消发布"
                this.confirmTemp(url, warning, tip, paramData)
            },
            startCallback() {
                let url = "/pro/ProScBizCatalog/modifyDisabledState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要启用当前选中记录吗?";
                let tip = "启用"
                this.confirmTemp(url, warning, tip, paramData)
            },
            endCallback() {
                let url = "/pro/ProScBizCatalog/modifyDisabledState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要停用当前选中记录吗?";
                let tip = "停用";
                this.confirmTemp(url, warning, tip, paramData)
            },
            confirmTemp(url, warning, tip, paramData) {
                if (this.choosedFlag) {
                    this.$confirm(warning, tip, {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.get(url, paramData)
                            .then(result => {
                                this.$message.success("操作成功");
                                this.refresh();
                                this.choosedFlag = false;
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
                    }).catch(() => {
                    });
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }
            },
            moreOptionCallback() {
                if (this.choosedFlag) {
                    this.dialogVisibleProScBizCatalog = true;
                    this.$nextTick(() => {
                        this.$refs.$moreOpt.show();
                    })
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }

            },
            closeDialog() {
                this.dialogVisibleProScBizCatalog = false;
                this.refresh();
            },
            closeBatchDialog() {
                this.refreshTree();
                this.refresh();
            },
            initRegion() {
                //获取服务目录区域
                this.$axios.get('/pro/ProScBizCatalog/areaAll')
                    .then(result => {
                        this.regionList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
                //获取服务目录服务信息
                this.$axios.get('/pro/ProScBizCatalog/categoryAll')
                    .then(result => {
                        this.serviceNameList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            linkCatalogName() {
                //获取服务项信息
                this.$axios.get('/pro/ProScBizCatalog/catalogAll', {"params": {"categoryId": this.editData.categoryId}})
                    .then(result => {
                        this.serviceOptionList = result.data;
                        this.editData.instruction = "";
                        this.editData.output = "";
                        this.editData.guideline = "";
                        this.editData.templateId = '';
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
            },
            selectDeptConfirm(datas) {
                if (this.isDeptName) {
                    this.editData.deptName = datas[0].deptName;
                    this.editData.managementId = datas[0].deptCode;
                } else {
                    this.editData.serviceDutydeptName = datas[0].deptName;
                    this.editData.serviceDutydeptId = datas[0].deptCode;
                }

            },
            selectCannel() {
                let arr = [];
                this.selectedDept = arr;
                this.$refs.deptSelect.treeRefresh();
            },
            /**
             * 刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
            },
            /**
             * 树形刷新
             */
            refreshTree() {
                this.$refs.mainQueryGrid.$refs.tree.refresh();
            },
        },
        mounted() {
            this.initRegion()
        },
    }
</script>

<style lang="less" scoped>

    .dev-container {
        width: 94%;
        background-color: #FFFFFF;
        overflow-y: auto;
        height: 400px;
        max-height: 400px;
    }

    .required-star {
        color: red;
    }

    .tableBtn {
        margin-bottom: 8px;
        margin-left: 8px;
    }

    .form-content {
        width: 100%;
    }
</style>