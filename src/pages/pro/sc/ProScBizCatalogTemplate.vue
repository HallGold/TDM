<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-tree-grid
                    exportTitle="业务服务目录模板"
                    load-url="/pro/ProScBizCatalogTemplate/createTree?categoryId="
                    label-prop="name"
                    value-prop="name"
                    data-url="/pro/ProScBizCatalogTemplate/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
                    :operationsWidth=100
                    :buttons="buttons"
                    :chooseItem="chooseItem"
                    @pagClick="pagClick"
                    ref="mainQueryGrid"
                    @selection-change="handleSelectionChange"
                    @node-click="nodeTreeSelectedHandler">
                <div style="display: flex;justify-content:space-around" slot="prefix">
                    <el-button icon="el-icon-circle-plus"
                               type="text"
                               :style="addDisabled?{color: '#8c939d'}:{color: '#85ce61'}"
                               :disabled="addDisabled"
                               @click="addNode">
                        <span style="color: #222222">新增</span>
                    </el-button>
                    <el-button icon="el-icon-edit"
                               type="text"
                               :style="updateDisabled?{color: '#8c939d'}:{color: '#ebb563'}"
                               :disabled="updateDisabled"
                               @click="updateNode">
                        <span style="color: #222222">编辑</span>
                    </el-button>
                    <el-button icon="el-icon-delete"
                               type="text"
                               :style="deleteDisabled?{color: '#8c939d'}:{color: '#ff0000'}"
                               :disabled="deleteDisabled"
                               @click="deleteNode">
                        <span style="color: #222222">删除</span>
                    </el-button>
                </div>
            </ice-tree-grid>
        </div>

        <ice-dialog :title="`${dialogEditReadonly?'查看':(dialogShowType == 'new'?'新增':'编辑')}服务模板`"
                    :visible.sync="dialogEditVisible"
                    :buttons="dialogEditReadonly?[]:addButtons"
                    remounted
                    width="800px">
            <div class="form-content" style="max-height: 500px;overflow-y: scroll;overflow-x: hidden">
                <el-form :disabled="dialogEditReadonly" :model="editData" :rules="editRules" label-position="right"
                         class="conditon-bar" ref="editForm"
                         label-width="100px"
                         style="margin-top: 20px">
                    <ice-grid-layout name="基础属性" :columns="2">

                        <el-form-item label="服务名称:" label-width="120px" prop="categoryName">
                            <el-input :disabled="true"
                                      v-model="editData.categoryName" maxlength="30"></el-input>
                        </el-form-item>

                        <el-form-item label="服务项:" label-width="120px" prop="sname">
                            <el-input placeholder="服务项"
                                      v-model="editData.sname"
                                      maxlength="36"></el-input>
                        </el-form-item>

                        <el-form-item label="是否面向用户:" label-width="120px" prop="isTouser">
                            <ice-select placeholder="是否面向用户" map-type-code="YES_NO"
                                        v-model="editData.isTouser">
                            </ice-select>
                        </el-form-item>

                        <el-form-item label="审批路径:" label-width="120px" prop="apprRoute">
                            <ice-select placeholder="请选择" map-type-code="PRO_SC_BIZ_CATALOG_TEMPLATE"
                                        v-model="editData.apprRoute">
                            </ice-select>
                        </el-form-item>

                    </ice-grid-layout>
                    <ice-grid-layout name="使用说明" :columns="1">
                        <el-form-item label="使用说明:" label-width="120px" prop="instruction">
                            <el-input placeholder="备注" type="textarea" :rows="4"
                                      v-model="editData.instruction" maxlength="256"
                                      resize="none"></el-input>
                        </el-form-item>
                        <el-form-item label-width="120px" label="附件信息:">
                            <ice-multiple-upload doSecret v-model="editData.instructionAtt"></ice-multiple-upload>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="产出说明" :columns="1">

                        <el-form-item label="产出说明:" label-width="120px" prop="output">
                            <el-input placeholder="备注" type="textarea" :rows="4"
                                      v-model="editData.output" maxlength="256"
                                      resize="none"></el-input>
                        </el-form-item>
                        <el-form-item label-width="120px" label="附件信息:">
                            <ice-multiple-upload doSecret v-model="editData.outputAtt"></ice-multiple-upload>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="操作指引" :columns="1">

                        <el-form-item label="操作指引:" label-width="120px" prop="guideline">
                            <el-input placeholder="备注" type="textarea" :rows="4"
                                      v-model="editData.guideline" maxlength="256"
                                      resize="none"></el-input>
                        </el-form-item>
                        <el-form-item label-width="120px" label="附件信息:">
                            <ice-multiple-upload doSecret v-model="editData.guidelineAtt"></ice-multiple-upload>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-dialog>
        <ice-dialog :title="Change"
                    :visible.sync="treeDialogVisible"
                    :buttons="addTreeButtons"
                    remounted
                    width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="服务名称:" label-width="100px" prop="sname">
                                <el-input placeholder="不超过20个字"
                                          v-model="mainDataForm.sname"
                                          maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </ice-dialog>
        <ice-dialog :visible.sync="intoVisible" width="600px" title="业务服务目录模板导入">
            <div style="margin: 15px 15px 10px">
                <ice-excel-uploader service="excelProScBizCatalogTemplateImpl" module="pro"
                                    ref="intoExcel"></ice-excel-uploader>
            </div>
        </ice-dialog>
    </div>

</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import common from '@/utils/common.js';
    import IceSelect from "../../../components/common/base/IceSelect";
    import ProBasePostShift from "../base/ProBasePostShift";
    import ProBaseMaintainMember from "../module/ProBaseMaintainMember";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceDialog from "@/components/common/base/IceDialog";
    import IceExcelUploader from "../../../components/common/base/IceExcelUploader";
    import {specialCharacter} from "./common/validator.js";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";

    export default {
        name: "ProScBizCatalogTemplate",
        components: {
            IceExcelUploader,
            ProBaseMaintainMember, ProBasePostShift, IceSelect, IceTreeGrid, IceGridLayout, IceDialog, IceMultipleUpload
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                // {label: 'categoryId', code: 'categoryId', hidden: true},
                {label: '是否面向用户', code: 'isTouser', mapTypeCode: "YES_NO", hidden: true},
                {label: '审批路径', code: 'apprRoute', mapTypeCode: "PRO_SC_BIZ_CATALOG_TEMPLATE", hidden: true},
                {label: '操作指引', code: 'guideline', hidden: true},
                {label: '产出说明', code: 'output', width: 120, hidden: true},
                {label: '服务名称', code: 'categoryName', width: 200, required: true},
                {label: '服务项', code: 'sname', required: true, width: 200},
                {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled", required: true, sortable: true},
                {label: '创建人', code: 'createUser', width: 150},
                {label: '使用说明', code: 'instruction', width: 120},
                {label: '创建时间', code: 'createDate', sortable: true,},
                {label: '修改人', code: 'updateUser', sortable: true, width: 110},
                {label: '修改时间', code: 'updateDate', sortable: true,}];
            return {
                intoVisible: false,      //导入弹框的开关属性
                addDisabled: false,      //类型是否可新增
                updateDisabled: false,   //类型是否可编辑
                deleteDisabled: false,   //类型是否可删除
                firstNode: '',          //是否为第一个节点，如果是，则不可增加服务项
                treeId: '0',
                treeName: '',
                rootNode: null,
                activeName: 'first',
                query: [
                    {
                        type: 'static', value: () => {
                            return this.treeId == '0' ? null : this.treeId
                        }, code: 'oid'
                    },
                    // {type: 'input', label: '申请人', code: 'deptName', value: ''},
                    {type: 'input', label: '服务名称', code: 'categoryName', exp: 'upperLike', value: ''},
                    {type: 'input', label: '服务项', code: 'sname', exp: 'upperLike', value: ''},
                    // {type:'select',label: '是否启用', code: 'isDisabled', mapTypeCode: "enabled" },
                    {
                        type: 'select',
                        label: '是否启用',
                        code: 'isDisabled',
                        mapTypeCode: "enabled",
                        value: ''
                    },
                    {type: 'input', label: '创建人', code: 'createUser', exp: 'upperLike', value: ''},
                    {type: 'date', label: '创建时间', code: 'createDate',compare:1},
                    {type: 'input', label: '修改人', code: 'updateUser', exp: 'upperLike', value: ''},
                    {type: 'date', label: '修改时间', code: 'updateDate',compare:2},

                    // {type: 'date', label: '申请日期(起)', code: 'afDate', exp: ">"},
                    // {type: 'date', label: '申请日期(止)', code: 'afDate', exp: "<"}
                ],
                Change: "",
                editData: common.toInitData(ncolumns, {
                    isDisabled: '0',
                    categoryId: this.treeId,
                    name: this.treeName,
                    outputAtt: "",
                    instructionAtt: "",
                    guidelineAtt: ""
                }),
                editRules: {
                    sname: [
                        {required: true, whitespace: true, message: '请填写服务项'},
                        {validator: specialCharacter, trigger: 'blur'}
                    ],
                    apprRoute: [
                        {required: true, message: '请选择审批路径', trigger: 'change'},
                    ],
                },
                columns: ncolumns,
                operations: [{name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem}],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}
                    , {name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.deleteCallback}
                    , {name: '导入', icon: 'el-icon-download', type: 'primary', callback: this.intoCallback}
                    , {name: '导出', icon: 'el-icon-upload2', type: 'export'}
                    , {name: '启用', icon: 'el-icon-check', type: 'primary', callback: this.startCallback}
                    , {name: '停用', icon: 'el-icon-close', type: 'primary', callback: this.endCallback}],
                addButtons: [
                    {name: '保存', iscannel: false, click: this.saveData},
                    {name: '取消', iscannel: true},
                ],
                addTreeButtons: [
                    {name: '保存', iscannel: false, click: this.treeSave},
                    {name: '取消', iscannel: true},
                ],
                mainDataForm: {
                    sname: '',
                },
                formRules: {
                    sname: [
                        {required: true, whitespace: true, message: '请填写服务名称'},
                        {validator: specialCharacter, trigger: 'blur'}
                    ]
                },
                dialogEditVisible: false,
                dialogEditReadonly: false,
                dialogVisibleProBaseMaintainMember: false,
                tendId: '',
                dialogVisibleProBasePostShift: false,
                chooseItem: 'multiple',
                checked_ids: '',
                choosedFlag: false,
                approvePath: '',
                dialogShowType: '',
                currentNode: 1,
                treeDialogVisible: false,
                forbidDelTreeNode: true
            }
        },
        methods: {
            /**
             * 导入
             */
            intoCallback() {
                this.intoVisible = true;
            },
            addCallback() {
                if (this.firstNode) {
                    if (this.treeId == '0') {
                        this.$message.warning('请选择左边区域再进行新增。');
                        return;
                    }
                    if (!this.forbidAddFlag) {
                        this.$message.warning('请先选择服务名称');
                        return;
                    }
                    this.editData = common.toInitData(this.columns, {
                        categoryName: this.treeName + '',
                        apprRoute: '',
                        isTouser: '0',
                        isDisabled: '1'
                    });
                    if (this.currentNode == 3) {
                        this.editData.oid = this.treeId
                    } else {
                        this.editData.categoryId = this.treeId
                    }
                    this.dialogEditVisible = true;
                    this.dialogEditReadonly = false;
                    this.dialogShowType = 'new';
                } else {
                    this.$message.warning("根节点不可新增");
                }

            },
            pagClick(data) {
                this.choosedFlag = false;
            },
            deleteCallback() {
                if (this.choosedFlag) {
                    this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete("/pro/ProScBizCatalogTemplate/dels", {"params": {"ids": this.checked_ids}})
                            .then(result => {
                                this.$message.success("操作成功");
                                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
                                this.refresh();
                                this.choosedFlag = false;
                            }).catch(error => {
                            this.$message.error(error.msg);
                        });
                    });
                } else {
                    this.$message.warning('请先选择需要操作的记录！');
                }
            },
            /**
             * table列表新增或编辑--保存
             */
            async saveData() {
                try {
                    await this.$refs['editForm'].validate();
                } catch (e) {
                    return false;
                }
                await this.$axios.post("/pro/ProScBizCatalogTemplate/saveOrUpdate", this.editData);
                this.$message.success("保存成功");
                this.refreshTable();
                this.refresh();
                return true;

            },
            viewItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = true;
                this.editData = Object.assign({}, row);
            },
            editItem(row) {
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
                this.editData = Object.assign({}, row);
                this.dialogShowType = '';
            },
            closeItem() {
                this.$refs.editForm.clearValidate();
                this.dialogEditVisible = false;
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                this.firstNode = data;
                if (node) {
                    let level1 = {
                        type: 'static', value: () => {
                            return null
                        }, code: 'categoryId'
                    };
                    let level2 = {
                        type: 'static', value: () => {
                            return node.data.categoryId
                        }, code: 'categoryId'
                    };
                    let level3 = {
                        type: 'static', value: () => {
                            return node.data.oid
                        }, code: 'oid'
                    };
                    if (node.level == 1) {
                        this.query.splice(0, 1, level1)
                        this.treeId = node.data.categoryId;
                        this.currentNode = 1
                    } else if (node.level == 2) {
                        this.query.splice(0, 1, level2)
                        this.treeId = node.data.categoryId;
                        this.currentNode = 2
                        if (node.childNodes && node.childNodes.length > 0) {
                            this.forbidDelTreeNode = true;
                        } else {
                            this.forbidDelTreeNode = false;
                        }
                    } else if (node.level == 3) {
                        this.query.splice(0, 1, level3)
                        this.treeId = node.data.oid;
                        this.currentNode = 3
                    }
                    if (node.childNodes.length > 0) {
                        this.forbidAddFlag = false
                    } else {
                        this.forbidAddFlag = true
                    }
                    this.treeName = node.data.name;

                    //类型是否可新增
                    if (this.currentNode == 1) {
                        this.addDisabled = false;
                    } else {
                        this.addDisabled = true;
                    }

                    //类型是否可编辑
                    if (this.currentNode == 2) {
                        this.updateDisabled = false;
                        this.$set(this.buttons[0], 'disabled', false);
                    } else {
                        this.updateDisabled = true;
                        this.$set(this.buttons[0], 'disabled', true);
                    }

                    //类型是否可删除
                    if (this.currentNode == 2 && !this.forbidDelTreeNode) {
                        this.deleteDisabled = false;
                    } else {
                        this.deleteDisabled = true;
                    }
                }
            },
            /**
             * 网格选中事件
             * @param rows
             */
            handleSelectionChange(rows) {
                if (rows.length > 0) {
                    let checked_ids = ''
                    for (let i = 0; i < rows.length; i++) {

                        checked_ids += rows[i].oid + ','
                    }
                    this.checked_ids = checked_ids
                    this.choosedFlag = true
                } else {
                    this.choosedFlag = false
                }
            },
            startCallback() {
                let url = "/pro/ProScBizCatalogTemplate/modifyStandardState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要启用当前选中记录吗?"
                let tip = "启用"
                this.confirmTemp(url, warning, tip, paramData)
            },
            endCallback() {
                let url = "/pro/ProScBizCatalogTemplate/modifyStandardState"
                let paramData = {"params": {"type": 0, "ids": this.checked_ids}}
                let warning = "确定要停用当前选中记录吗?"
                let tip = "停用"
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
                                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
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
            /**新增到树形结构*/
            addNode() {
                this.mainDataForm.categoryId = "0";
                this.mainDataForm.sname = '';
                this.mainDataForm.oid = '';
                this.treeDialogVisible = true;
                this.Change = "新增服务名称"
            },
            /**修改类型*/
            updateNode() {
                this.mainDataForm.sname = this.treeName;
                this.mainDataForm.oid = this.treeId;
                this.treeDialogVisible = true;
                this.Change = "编辑服务名称"
            },
            /**删除类型*/
            deleteNode() {
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/pro/ProScBizCategory/treeDel", {"params": {"id": this.treeId}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
                            this.refresh();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
                /*if (this.currentNode != 1 && !this.forbidDelTreeNode) {

                } else {
                    this.$message.error('该节点为根节点或节点下面存在子项，不允许删除');
                }*/
            },
            async treeSave() {
                try {
                    await this.$refs.form.validate();
                } catch (e) {
                    return false;
                }
                console.log(this.mainDataForm);
                await this.$axios.post("/pro/ProScBizCategory/saveOrUpdate", this.mainDataForm);
                this.$message.success("保存成功");
                this.refresh();
                return true

            },
            refresh() {
                this.$refs.mainQueryGrid.$refs.tree.refresh();
            },
            refreshTable() {
                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
            }
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