<template>
    <div style="width: 100%;height: 100%;background: white">
        <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
            <ice-tree-grid
                    exportTitle="技术服务目录模板"
                    load-url="/pro/ProScTechCatalogTemplate/createTree?parentId="
                    label-prop="name"
                    value-prop="name"
                    data-url="/pro/ProScTechCatalogTemplate/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
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

        <ice-dialog :title="`${dialogEditReadonly?'查看':(isAddFlag?'新增':'编辑')}技术服务模板`"
                    :visible.sync="dialogEditVisible"
                    :buttons="dialogEditReadonly?[]:addButtons"
                    remounted
                    width="900px" :before-close="closeItem">
            <div style="height: 400px;">
                <div style="max-height: 400px;overflow-x: hidden">
                    <el-form :disabled="dialogEditReadonly"
                             :model="editData"
                             :rules="editRules"
                             label-position="right"
                             class="conditon-bar"
                             ref="editForm"
                             style="margin-top: 20px">
                        <ice-grid-layout name="基础属性" :columns="2">

                            <el-form-item label="服务大类:" label-width="140px" prop="bigcategoryName">
                                <el-input :disabled="true"
                                          v-model="editData.bigcategoryName"></el-input>
                            </el-form-item>

                            <el-form-item label="服务名称:" label-width="140px" prop="categoryName">
                                <el-input :disabled="true" v-model="editData.categoryName" maxlength="30"></el-input>
                            </el-form-item>

                            <el-form-item label="服务项:" label-width="140px" prop="sname">
                                <el-input :disabled="!isAddFlag"
                                          placeholder="服务项，不可输入特殊字符"
                                          v-model="editData.sname"
                                          maxlength="36"></el-input>
                            </el-form-item>

                            <el-form-item label="第三方技术支持:" label-width="140px" prop="unitName">
                                <el-select placeholder="请选择" v-model="editData.thirdparty">
                                    <el-option v-for="item in thirdPartyList"
                                               :key="item.oid"
                                               :label="item.unitname"
                                               :value="item.oid"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="贡献值:" label-width="140px" prop="score">
                                <el-input-number v-model="editData.score"
                                                 controls-position="right"
                                                 :max="99"
                                                 :precision="2"
                                                 style="width:100%"
                                                 :min="0">

                                </el-input-number>
                            </el-form-item>
                            <el-form-item label="担当岗位:" label-width="140px" prop="roleId">
                                <el-input placeholder="担当岗位" v-model="editData.roleId" maxlength="30"></el-input>
                            </el-form-item>
                            <el-form-item label="技术手册:" label-width="140px" prop="anual" layout="2">
                                <el-input placeholder="技术手册" type="textarea" :rows="4" maxlength="256"
                                          v-model="editData.manual"></el-input>
                            </el-form-item>
                        </ice-grid-layout>
                    </el-form>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog :title="Change"
                    :visible.sync="treeDialogVisible"
                    :buttons="addTreeButtons"
                    remounted
                    width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm"
                         :rules="formRules"
                         label-position="right"
                         class="conditon-bar"
                         ref="treeForm"
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
        <ice-dialog :visible.sync="intoVisible" width="600px" title="技术服务目录模板导入">
            <div style="margin: 15px 15px 10px">
                <ice-excel-uploader service="excelProScTechCatalogTemplateImpl"
                                    module="pro"
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
    import {specialCharacter} from "./common/validator.js"

    export default {
        name: "ProScTechCatalogTemplate",
        components: {
            IceExcelUploader,
            ProBaseMaintainMember,
            ProBasePostShift,
            IceSelect,
            IceTreeGrid,
            IceGridLayout,
            IceDialog
        },
        data() {
            let ncolumns = [{label: 'oid', code: 'oid', hidden: true},
                {label: '担当岗位', code: 'roleId', hidden: true},
                {label: '技术手册', code: 'manual', hidden: true},
                {label: '服务大类', code: 'bigcategoryName', width: 120, required: true},
                {label: '服务名称', code: 'categoryName', width: 150, required: true, exp: 'upperLike', value: ''},
                {label: '服务项', code: 'sname', width: 100, required: true},
                {label: '贡献值', code: 'score', width: 100, sortable: true},
                {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "YES_NO"},
                {label: '第三方技术支持id', code: 'thirdparty', hidden: true},
                {label: '第三方技术支持', code: 'unitName', width: 150}]
            return {
                treeId: '0', treeName: '', rootNode: null, secondTreeName: '',
                activeName: 'first',
                query: [
                    {
                        type: 'static', value: () => {
                            return null
                        }, code: 'parentId'
                    },
                    {label: '服务大类', code: 'bigcategoryName', exp: 'upperLike', value: '',type:'input'},
                    {label: '服务名称', code: 'categoryName', exp: 'upperLike', value: '',type:'input'},
                    {label: '服务项', code: 'sname', exp: 'upperLike', value: '',type:'input'},
                    {label: '贡献值', code: 'score',  exp: 'upperLike',value: '',type:'input'},
                    {label: '是否启用', code: 'isDisabled', mapTypeCode: "YES_NO", value: '',type:'select'},
                    {label: '第三方技术支持', code: 'unitName', exp: 'upperLike', value: '',type:'input'}
                ],
                editData: common.toInitData(ncolumns, {
                    sort: '0',
                    isFactorychoosed: '0',
                    isDisabled: '1',
                }),
                editRules: {
                    sname: [
                        {required: true, whitespace: true, message: '请填写服务项'},
                        {validator: specialCharacter, trigger: 'blur'}
                    ],
                },
                columns: [{label: 'oid', code: 'oid', hidden: true},
                    {label: '担当岗位', code: 'roleId', hidden: true},
                    {label: '技术手册', code: 'manual', hidden: true},
                    {label: '服务大类', code: 'bigcategoryName', width: 180},
                    {label: '服务名称', code: 'categoryName', width: 200, exp: 'upperLike', value: ''},
                    {label: '服务项', code: 'sname', width: 200},
                    {label: '贡献值', code: 'score', width: 100},
                    {label: '是否启用', code: 'isDisabled', width: 100, mapTypeCode: "enabled"},
                    {label: '第三方技术支持id', code: 'thirdparty', hidden: true},
                    {label: '第三方技术支持', code: 'unitName', width: 150}],
                operations: [
                    {name: '详情', callback: this.viewItem},
                    {name: '编辑', callback: this.editItem}
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback}
                    , {name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.deleteCallback}
                    , {name: '导入', icon: 'el-icon-download', type: 'primary', callback: this.intoCallback}
                    , {name: '导出', icon: 'el-icon-upload2', type: 'export'}
                    , {name: '启用', icon: 'el-icon-check', type: 'primary', callback: this.startCallback}
                    , {name: '停用', icon: 'el-icon-close', type: 'primary', callback: this.endCallback}],
                Change:"",
                addButtons: [
                    {name: '保存', iscannel: false, click: this.saveData},
                    {name: '取消', iscannel: true},
                ],
                addTreeButtons: [
                    {name: '保存', iscannel: false, click: this.saveTreeData},
                    {name: '取消', iscannel: true},
                ],
                dialogEditVisible: false,
                dialogEditReadonly: false,
                dialogVisibleProBaseMaintainMember: false,
                tendId: '',
                dialogVisibleProBasePostShift: false,
                chooseItem: 'multiple',
                checked_ids: '',
                choosedFlag: false,
                thirdPartyList: [],
                isAddFlag: false,
                currentNode: 1,
                treeDialogVisible: false,
                mainDataForm: {
                    sname: '',
                },
                formRules: {
                    sname: [
                        {required: true, whitespace: true, message: '请填写服务名称'},
                        {validator: specialCharacter, trigger: 'blur'}
                    ]
                },
                addDisabled: false,      //类型是否可新增
                updateDisabled: false,   //类型是否可编辑
                deleteDisabled: false,   //类型是否可删除
                intoVisible: false,      //导入弹框的开关属性
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
                this.editData = common.toInitData(this.columns, {
                    isDisabled: '1',
                    categoryName: this.secondTreeName,
                    bigcategoryName: this.treeName + ''
                });
                if (this.currentNode == 3) {
                    this.editData.categoryId = this.treeId
                } else if (this.currentNode == 4) {
                    this.editData.oid = this.treeId
                } else {
                    this.editData.parentId = this.treeId
                }
                this.isAddFlag = true;
                this.dialogEditVisible = true;
                this.dialogEditReadonly = false;
            },
            pagClick(data){
                this.choosedFlag = false;
            },
            deleteCallback() {
                if (this.choosedFlag) {
                    this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete("/pro/ProScTechCatalogTemplate/dels", {"params": {"ids": this.checked_ids}})
                            .then(result => {
                                this.$message.success("操作成功");
                                this.refresh();
                                this.refreshTree();
                                this.choosedFlag = false;
                            }).catch(error => {
                            this.$message.warning(error.msg);
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
                    await this.$refs.editForm.validate();
                } catch (e) {
                    return false;
                }
                await this.$axios.post("/pro/ProScTechCatalogTemplate/saveOrUpdate", this.editData);
                this.$message.success("保存成功");
                this.refresh();
                this.refreshTree();
                return true;

            },
            getAreaName(oid) {
                if (this.rootNode == null) {
                    return '';
                }
                let name = this.rootNode[oid];
                return name ? name : '';
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
            },
            closeItem() {
                this.$refs.editForm.clearValidate();
                this.dialogEditVisible = false;
                this.isAddFlag = false;
            },
            /**
             * 树节点选中事件
             * @param node
             */
            nodeTreeSelectedHandler(data, node) {
                if (node) {
                    let level1 = {
                        type: 'static', value: () => {
                            return null
                        }, code: 'parentId'
                    };
                    let level2 = {
                        type: 'static', value: () => {
                            return node.data.parentId
                        }, code: 'parentId'
                    };
                    let level3 = {
                        type: 'static', value: () => {
                            return node.data.categoryId
                        }, code: 'categoryId'
                    };
                    let level4 = {
                        type: 'static', value: () => {
                            return node.data.oid
                        }, code: 'oid'
                    };
                    let isDelete = true;
                    if (node.level == 1) {
                        this.query.splice(0, 1, level1)
                        this.treeId = node.data.parentId;
                        this.currentNode = 1
                    } else if (node.level == 2) {
                        this.query.splice(0, 1, level2)
                        this.treeId = node.data.parentId;
                        this.currentNode = 2;
                        if (node.childNodes && node.childNodes.length > 0) {
                            isDelete = false;
                        } else {
                            isDelete = true;
                        }
                    } else if (node.level == 3) {
                        this.query.splice(0, 1, level3)
                        this.treeId = node.data.categoryId;
                        this.currentNode = 3;
                        if (node.childNodes && node.childNodes.length > 0) {
                            isDelete = false;
                        } else {
                            isDelete = true;
                        }
                    } else if (node.level == 4) {
                        this.query.splice(0, 1, level4)
                        this.treeId = node.data.oid;
                        this.currentNode = 4
                    }
                    this.secondTreeName = node.data.name;
                    this.treeName = node.parent.data.name;

                    //该类型下是否可新增数据
                    if (this.currentNode == 3) {
                        this.$set(this.buttons[0], 'disabled', false);
                    } else {
                        this.$set(this.buttons[0], 'disabled', true);
                    }
                    //该类型下是否可新增
                    if (this.currentNode >= 3) {
                        this.addDisabled = true;
                    } else {
                        this.addDisabled = false;
                    }
                    //该类型是否可编辑或删除
                    if (this.currentNode == 2 || this.currentNode == 3) {
                        this.updateDisabled = false;
                        if (isDelete) {
                            this.deleteDisabled = false;
                        } else {
                            this.deleteDisabled = true;
                        }
                    } else {
                        this.updateDisabled = true;
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
                let url = "/pro/ProScTechCatalogTemplate/modifyStandardState"
                let paramData = {"params": {"type": 1, "ids": this.checked_ids}}
                let warning = "确定要启用当前选中记录吗?"
                let tip = "启用"
                this.confirmTemp(url, warning, tip, paramData)
            },
            endCallback() {
                let url = "/pro/ProScTechCatalogTemplate/modifyStandardState"
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
            /**新增到树形结构*/
            addNode() {
                this.mainDataForm.categoryId = "0";
                this.mainDataForm.sname = '';
                this.mainDataForm.parentId = this.treeId;
                this.mainDataForm.oid=""
                this.treeDialogVisible = true;
                this.Change = "新增服务名称"
            },
            /**修改类型*/
            updateNode() {
                this.mainDataForm.sname = this.secondTreeName;
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
                    this.$axios.delete("/pro//ProScTechCategory/treeDel", {"params": {"id": this.treeId}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.refresh();
                            this.refreshTree();
                        }).catch(error => {
                        this.$message.error(error.msg);
                    });
                });
            },
            /**
             * 树型服务类型--保存
             */
            async saveTreeData() {
                try {
                    await this.$refs.treeForm.validate();
                } catch (e) {
                    return false;
                }
                await this.$axios.post("/pro/ProScTechCategory/saveOrUpdate", this.mainDataForm);
                this.$message.success("保存成功");
                this.refreshTree();
                return true;

            },
            /**
             * 表格刷新
             */
            refresh() {
                this.$refs.mainQueryGrid.$refs.queryGrid.refresh();
            },
            /**
             * 树型刷新
             */
            refreshTree() {
                this.$refs.mainQueryGrid.$refs.tree.refresh();
            }
        },
        mounted() {
            this.$nextTick(() => {
                //获取第三方技术支持方信息
                this.$axios.get('/pro/ProScTechCatalog/allThirdparty')
                    .then(result => {
                        this.thirdPartyList = result.data
                    }).catch(error => {
                    this.$message.error(error.msg);
                });
            })
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