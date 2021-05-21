<template>
    <div class="content-filled">
        <ice-tree-grid load-url="/permission/res/table/outer/load_tblgrp_tree"
                       ref="iceGrid"
                       label-prop="tblgroupName"
                       value-prop="oid"
                       :lazy="false"
                       :data-url="'/permission/res/table/outer/search_tbl_baseinfo?groupId='+groupId"
                       :gridAutoRefresh="false"
                       :pagination="true"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       chooseItem="multiple"
                       @selection-change="selectionChange"
                       @node-click="dataTree"
                       :operations-width="120">
            <div style="display: flex;justify-content:space-around" slot="prefix">
                <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode">
                    <span style="color: #222222">新增</span>
                </el-button>
                <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode">
                    <span style="color: #222222">编辑</span>
                </el-button>
                <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteNode">
                    <span style="color: #222222">删除</span>
                </el-button>
            </div>
        </ice-tree-grid>
        <data-table-edit ref="dataTableEdit" :title="title" :is-edit="isEdit" :isSuccess="isSuccess"></data-table-edit>
        <field-preserve-edit ref="fieldPreserveEdit"></field-preserve-edit>
        <form-database-sync-edit ref="formDatabase"></form-database-sync-edit>
        <sync-to-database-edit ref="syncDatabase"></sync-to-database-edit>
        <move-data-edit ref="moveDataEdit" :isSuccess="isSuccess"></move-data-edit>
        <el-dialog v-dialog-drag
                   :title="treeTitle"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="800px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <el-form :model="treeFormData" :rules="treeFormRules" ref="form" label-width="100px"
                     style="margin-top: 15px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="tblgroupName">
                            <el-input v-model="treeFormData.tblgroupName" @input="tblgroupNameChanged"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="分类编码" prop="tblgroupCode">
                            <el-input v-model="treeFormData.tblgroupCode" :disabled="isUpData"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import DataTableEdit from "./dataTableEdit";
    import FieldPreserveEdit from "./fieldPreserveEdit";
    import FormDatabaseSyncEdit from "./formDatabaseSyncEdit";
    import SyncToDatabaseEdit from "./syncToDatabaseEdit";
    import MoveDataEdit from "./moveDataEdit";
    import pinyin4js from 'pinyin4js';

    export default {
        name: "dataTablePage",
        components: {
            MoveDataEdit,
            SyncToDatabaseEdit, FormDatabaseSyncEdit, FieldPreserveEdit, DataTableEdit, IceTreeGrid
        },
        data() {
            return {
                query: [],       //组件查询
                columns: [
                    {label: '表名', code: 'tableCode', width: 300,align:'left'},
                    {label: '表中文名', code: 'tableName', width: 300, showTips:true,align:'left'},
                    {label: '同步状态', code: 'code', width: 90},
                    {
                        label: '数据隔离', code: 'isEnabled', width: 100, renderCell(h, data) {
                            return data.row.dataAuthEnabled == 'Y' ? '启用' : '停用'
                        }
                    },
                    {label: '表分类', code: 'tableClazz', width: 100, mapTypeCode: 'TABLE_CLASS'},
                    {label: '表类型', code: 'tableType', width: 100, mapTypeCode: 'TABLE_TYPE'},
                    {label: '描述', code: 'remark', width: 200,align:'left'},
                ],     //组件table列展示
                buttons: [],     //组件按钮
                operations: [],  //组件table列按钮
                title: '',
                isEdit: false,
                groupId: '',     //用于根据左边树形的类型来获取右边列表数据的参数
                isUpData: false,         //是否为编辑状态
                dialogVisible: false,
                treeTitle: '',
                parentTblgroupId: '',
                treeFormData: {//树形表单对象
                    tblgroupName: '',
                    tblgroupCode: ''
                },
                treeFormRules: {//树形表单字段规则
                    tblgroupName: [{required: true, whitespace: true, message: '请输入分类名称', trigger: 'blur'}],
                    tblgroupCode: [{required: true, whitespace: true, message: '请输入分类编码', trigger: 'blur'}]
                },
                tableIds: '',    //待移动的表Id列表,用于移动
                nodeData: {},
            }
        },
        methods: {
            tblgroupNameChanged(e) {
                if (!this.treeFormData.oid || this.treeFormData.oid == '') {
                    this.treeFormData.tblgroupCode = pinyin4js.convertToPinyinString(e, '', pinyin4js.FIRST_LETTER).toUpperCase();
                }
            },
            /**
             * 表编辑后的网格数据刷新
             */
            isSuccess() {
                this.$refs.iceGrid.$refs.queryGrid.refresh();
            },
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (!this.isUpData) {
                            this.treeFormData.parentTblgroupId = this.groupId;
                            this.treeFormData.version = this.nodeData.version ? this.nodeData.version : '1';
                        }
                        this.$axios.post("/permission/res/table/outer/save_tbl_grp", this.treeFormData).then(success => {
                            this.$message.success("保存成功");
                            if (!this.isUpData) {
                                this.$refs.iceGrid.addNode(success.data);
                            } else {
                                this.$refs.iceGrid.updateNode(success.data);
                            }
                            this.closeDialog();
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                });
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            resetForm() {
                this.$refs.form.resetFields();
            },
            /**
             * 列表勾选的数据
             */
            selectionChange(rows) {
                this.tableIds = '';
                let arr = [];
                rows.forEach(item => {
                    arr.push(item.oid);
                });
                if (arr.length > 0) {
                    this.tableIds = arr.join(',');
                }
            },
            /**
             * 点击树节点返回节点信息
             * @param data
             */
            dataTree(data, node) {
                this.groupId = data;
                this.nodeData = node.data;
            },
            /**
             * 树形节点--新增
             */
            addNode() {
                this.treeTitle = '新增'
                this.isUpData = false;
                if (this.groupId == '-1' || this.groupId) {
                    this.treeFormData = {
                        tblgroupName: '',
                        tblgroupCode: ''
                    };
                    this.dialogVisible = true;
                } else {
                    this.$message.warning("请选择节点")
                }

            },
            /**
             * 树形节点--编辑
             */
            updateNode() {
                this.treeTitle = '编辑';
                this.isUpData = true;
                if (this.groupId) {
                    this.dialogVisible = true;
                    let obj = {};
                    Object.assign(obj, this.nodeData);
                    this.$nextTick(() => {
                        this.treeFormData = obj;
                    });
                } else {
                    this.$message.warning("请选择要编辑的节点")
                }
            },
            /**
             * 树形节点--删除
             */
            deleteNode() {
                if (this.groupId == '-1') {
                    this.$message.warning("该节点为根节点，不可删除");
                } else {
                    if (this.nodeData.canDelete) {
                        if (this.groupId) {
                            this.$confirm('确定要删除该类型吗', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                            }).then(() => {
                                this.$axios.delete("/permission/res/table/outer/del_tbl_grp", {"params": {"tblGrpId": this.groupId}})
                                    .then(success => {
                                        this.$refs.iceGrid.deleteNode();
                                        this.$refs.iceGrid.setTreeCurrentKey('-1')
                                        this.groupId = '-1'
                                        this.$message.success("删除成功");
                                    }).catch(error => {
                                    this.$message({
                                        type: 'error',
                                        message: error.msg ? error.msg : '操作出错了'
                                    })
                                })
                            });
                        } else {
                            this.$message.warning("请选择要删除的节点");
                        }
                    } else {
                        if (this.groupId) {
                            this.$message.warning("该节点为系统内置节点，不可删除");
                        } else {
                            this.$message.warning("请选择要删除的节点");
                        }

                    }
                }
            },
            /**
             * 编辑
             */
            editPageFuncItem(row) {
                this.title = '表信息编辑';
                this.isEdit = true;
                this.$refs.dataTableEdit.openDialog(row.oid);
            },
            /**
             * 字段维护
             */
            preserveItem(row) {
                this.$refs.fieldPreserveEdit.openDialog(row);
            },
            /**
             * 新增
             */
            add() {
                this.title = '表信息新增';
                this.isEdit = false;
                if (this.groupId == '-1') {
                    this.$message.warning("该节点为根节点，不可新增表")
                } else {
                    if (this.groupId) {
                        this.$refs.dataTableEdit.openDialog(this.groupId);
                    } else {
                        this.$message.warning("请选择节点")
                    }
                }
            },
            /**
             * 从数据库同步
             */
            formDatabaseSync() {
                this.$refs.formDatabase.openDialog();
            },
            /**
             * 同步到数据库
             */
            syncToDatabase() {
                this.$refs.syncDatabase.openDialog();
            },
            /**
             * 批量删除
             */
            deleteMore() {
                if (!this.tableIds || this.tableIds.length == 0) {
                    this.$message.error('未选择需要删除的表')
                    return;
                }

                this.$confirm("是否确认删除所选表？", "提示", {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let tblIdArr = this.tableIds.split(",");
                    // console.log("%o", {"params": {"tableIds": tblIdArr}});
                    this.$axios.post('/permission/res/table/outer/del_table_byids', {"tableIds": this.tableIds})
                        .then(result => {
                            this.$message.success("删除成功")
                            this.isSuccess()
                        }).catch(error => {
                        this.$message.error("删除失败")
                    })
                });

            },
            /**
             * 移动
             */
            moveData() {
                if (this.tableIds) {
                    this.$refs.moveDataEdit.openDialog(this.tableIds, this.groupId);
                } else {
                    this.$message.warning("请选择需要移动的数据")
                }
            },
            /**
             * 初始化组件部分
             */
            initComponent() {
                this.query = [
                    {type: 'input', label: '表名', code: 'tableCode', value: ''},
                    {type: 'input', label: '表中文名', code: 'tableName', value: ''}
                ];

                this.buttons = [
                    {name: '新增', callback: this.add},
                    {name: '从数据库同步', callback: this.formDatabaseSync},
                    {name: '同步到数据库', callback: this.syncToDatabase},
                    {name: '批量删除', callback: this.deleteMore},
                    {name: '移动', callback: this.moveData},
                ];
                this.operations = [
                    {name: '编辑', callback: this.editPageFuncItem},
                    {name: '字段维护', callback: this.preserveItem},
                ];
            },
        },
        mounted() {
            this.initComponent();
        }
    }
</script>

<style scoped>

</style>
