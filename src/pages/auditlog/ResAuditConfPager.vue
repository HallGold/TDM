<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid load-url="/resources/ResAuditLogType/update-tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="oid"
                       :lazy="false"
                       data-url="/resources/ResAuditLogClist/list"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       treeWidth="300px"
                       exportTitle="审计日志"
                       :grid-auto-refresh="false"
                       @node-click="dataTree"
                       :operations-width="100">
            <div style="display: flex;justify-content:space-around" slot="prefix">
                <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode">
                    <span style="color: #222222">新增</span>
                </el-button>
                <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode"
                           :disabled="curTreeNode.node.level<2">
                    <span style="color: #222222">编辑</span>
                </el-button>
                <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteType"
                           :disabled="curTreeNode.node.level<2">
                    <span style="color: #222222">删除</span>
                </el-button>
            </div>
        </ice-tree-grid>
        <ice-dialog v-dialogDrag :title="dicTitle"
                    center
                    :visible.sync="dialogVisible"
                    width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="auditConfig" :rules="auditConfigRules" label-position="right" class="conditon-bar"
                         ref="dicForm">
                    <ice-grid-layout name="审计日志配置信息" :columns=1 gutter="0px" :expandable=false>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="日志性质:" label-width="100px" prop="logCategory">
                                    <el-select v-model="auditConfig.logCategory" placeholder="请选择">
                                        <el-option value="1" label="一般审计日志"></el-option>
                                        <!-- <el-option value="2" label="流程审计日志"></el-option>-->
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否强制审计:" label-width="100px" prop="isForce">
                                    <el-checkbox v-model="auditConfig.isForce" true-label="1"
                                                 false-label="0"></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="审计服务:" label-width="100px" prop="serviceUrl">
                                    <el-input placeholder="请选择审计服务" v-model="auditConfig.serviceUrl" style="flex-grow: 1">
                                        <el-button slot="append" icon="el-icon-search" @click="serviceVisible=true"
                                                   unauth>选择
                                        </el-button>
                                    </el-input>
                                    <ice-dialog :visible.sync="serviceVisible" title="服务选择" width="1100px"
                                                height="560px">
                                        <service-manage :isDialog="true"
                                                        loadAll="N"
                                                        @selection-change="handleSelectionChange"></service-manage>
                                    </ice-dialog>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="功能描述:" label-width="100px" prop="funDesc">
                                    <el-input placeholder="请输入功能描述" type="textarea" :rows="2" v-model="auditConfig.funDesc"
                                              maxlength="120"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="展示方式:" label-width="100px" prop="showType">
                                    <el-select v-model="auditConfig.showType" placeholder="请选择">
                                        <el-option value="1" label="自定义模板"></el-option>
                                        <el-option value="2" label="默认模板"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40" v-if="auditConfig.showType=='1'">
                            <el-col :span="24">
                                <el-form-item label="模板内容:" label-width="100px" prop="logTemplate">
                                    <el-input placeholder="请输入模板内容" type="textarea" :rows="6"
                                              v-model="auditConfig.logTemplate"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialog">返回</el-button>
            </div>
        </ice-dialog>
        <ice-dialog v-dialogDrag :title="typeTitle" custom-class="ice-dialog" center :visible.sync="dialogVisibleType"
                   width="800px" append-to-body :close-on-click-modal="false" :show-close="true"
                   :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="auditType" :rules="auditTypeRules" label-position="right" class="conditon-bar"
                         ref="form">
                    <ice-grid-layout name="审计日志分类" :columns=1 gutter="0px" :expandable=false>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="类型名称:" label-width="100px" prop="name">
                                    <el-input placeholder="不超过20个字" v-model="auditType.name" maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="分类所属:" label-width="100px" prop="owner">
                                    <el-select v-model="auditType.owner">
                                        <el-option value="1" label="安全管理员"></el-option>
                                        <el-option value="2" label="审计管理员"></el-option>
                                        <el-option value="3" label="公用"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <!--    <el-col :span="12">
                                    <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                        <el-checkbox v-model="auditType.enabled"
                                                     :true-label=1
                                                     :false-label=0></el-checkbox>
                                    </el-form-item>
                                </el-col>-->
                            <el-col :span="12">
                                <el-form-item label="排序:" label-width="100px" prop="sequence">
                                    <el-input-number v-model="auditType.sequence" :min="0" :max="99"
                                                     controls-position="right"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="saveType">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialogType">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../components/common/base/IceGridLayout";
    import IceSelect from "../../components/common/base/IceSelect";
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";
    import ServiceManage from "../system/serviceInformation/serviceManage";
    import IceDialog from "../../components/common/base/IceDialog";


    export default {
        name: "ResAuditConfPager",
        data() {
            return {
                query: [
                    {
                        type: 'static',
                        code: 'rankCode',
                        value: () => this.curTreeNode.node.data.rankCode,
                        exp: 'likeRight'
                    },
                    {
                        type: 'input',
                        code: 'funDesc',
                        label: '功能描述',
                        value: ''
                    }
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {
                        label: '日志性质', code: 'logCategory', width: 120, formatter: row => {
                            if (row.logCategory != '2') {
                                return "一般审计日志"
                            } else {
                                return "流程审计日志"
                            }
                        }
                    },
                    {label: '功能描述', code: 'funDesc', align: 'left'},
                    {
                        label: '展示方式', code: 'showType', width: 120, formatter: row => {
                            if (row.showType == '1') {
                                return "自定义模板"
                            } else {
                                return "默认模板"
                            }
                        }
                    },
                    {label: '关联服务URL/流程KEY', code: 'serviceUrl', width: 300, align: 'left'},
                ],
                operations: [
                    {
                        name: '编辑', callback: this.updateItem
                    },
                    {
                        name: '删除', callback: this.deleteItem
                    },
                ],
                buttons: [
                    {
                        name: '新增', icon: 'el-icon-plus', disabled: () => {
                            return this.curTreeNode.node.level < 2;
                        }, type: 'primary', callback: this.addItem
                    },
                ],
                curTreeNode: {data: {}, node: {level: -1}},
                dialogVisible: false,
                dialogVisibleType: false,
                typeTitle: '审计日志分类维护',
                dicTitle: '审计日志配置维护',

                auditType: {
                    oid: '',
                    name: '',
                    owner: '3',
                    sequence: 0,
                    parentId: ''
                },
                auditTypeRules: {
                    name: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    owner: [{required: true, whitespace: true, message: '请选择分类所属', trigger: 'blur'}]
                },
                auditConfig: {
                    oid: '',
                    typeId: '',
                    rankCode: '',
                    logCategory: '1',
                    serviceId: '',
                    serviceUrl: '',
                    flowKey: '',
                    isForce: '1',
                    showType: '2',
                    logTemplate: '',
                    funDesc: ''
                },
                auditConfigRules: {
                    logCategory: [{required: true, whitespace: true, message: '请选择日志性质', trigger: 'blur'}],
                    serviceUrl: [{required: true, whitespace: true, message: '请输入/选择审计服务', trigger: 'blur'}],
                },
                serviceVisible: false
            }
        },
        methods: {
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisibleType = false;
            },
            /**树形节点获取*/
            dataTree(row, node) {
                //debugger
                this.curTreeNode = {data: row, node};
                //this.$refs.iceGrid.refreshAndPageReset();
            },

            /**新增到树形结构*/
            addNode() {
                this.auditType = {
                    oid: '',
                    name: '',
                    owner: '3',
                    sequence: this.curTreeNode.node.childNodes.length,
                    parentId: this.curTreeNode.data
                }
                this.dialogVisibleType = true;
            },

            /**修改类型*/
            updateNode() {
                if (this.curTreeNode.node.level <= 1) {
                    this.$message({
                        message: '该节点为根节点，不可修改',
                        type: 'warning'
                    });
                } else {
                    this.auditType = {...this.curTreeNode.node.data};
                    delete this.auditType.children
                    this.dialogVisibleType = true;

                }
            },

            /**新增与更新数据字典类型的保存*/
            saveType() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/resources/ResAuditLogType/saveOrUpdate", {
                            ...this.auditType
                        }).then(success => {
                            this.$message.success("保存类型成功");
                            this.dialogVisibleType = false;
                            if (!this.auditType.oid) {
                                this.$refs.iceGrid.addNode(success.data);
                            } else {
                                this.$nextTick(() => {
                                    this.$refs.iceGrid.updateNode(success.data);
                                });

                            }
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        });
                    }
                });

            },

            /**删除类型*/
            deleteType() {
                if (this.curTreeNode.node.level <= 1) {
                    this.$message({
                        message: '该节点为根节点，不可删除',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确定要删除该类型吗', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.$axios.delete("/resources/ResAuditLogType/del", {params: {id: this.curTreeNode.data}})
                            .then(result => {
                                this.$refs.iceGrid.deleteNode();
                                this.$message.success("删除类型成功");
                                this.$refs.iceGrid.setTreeCurrentKey(this.curTreeNode.node.data.parentId);
                            })
                            .catch(error => {
                                this.$message({
                                    type: 'error',
                                    message: error.msg
                                })
                            })
                    }).catch(_ => {

                    })
                }
            },

            /**新增数据值类型*/
            addItem() {
                if (this.nodeType == 0) {
                    this.$message({
                        message: '该节点为根节点，不可添加审计项',
                        type: 'warning'
                    });
                } else {
                    if (this.$refs.dicForm) {
                        this.$refs.dicForm.resetFields();
                    }
                    this.auditConfig.oid = '';
                    this.auditConfig.typeId = this.curTreeNode.data;
                    this.auditConfig.rankCode = this.curTreeNode.node.data.rankCode;
                    this.dialogVisible = true;
                }

            },

            handleSelectionChange(rows) {
                if (rows && rows.length > 0) {
                    let row = rows[0];

                    this.auditConfig.serviceUrl = row.serviceUrl;
                    this.auditConfig.serviceId = row.oid;
                    this.auditConfig.funDesc = row.serviceName;
                    // debugger
                    this.serviceVisible = false;
                }
            },

            /**编辑*/
            updateItem(row) {

                this.$axios.get("/resources/ResAuditLogClist/get", {params: {"id": row.oid}})
                    .then(success => {
                        this.auditConfig = success.data;
                    }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
                this.dialogVisible = true;
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                if (this.mainDataForm.code === null || this.mainDataForm.code === undefined || this.mainDataForm.code === '') {

                } else {
                    this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/, '');
                }
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItemDic() {
                this.dicDataForm.code = this.dicDataForm.code.replace(/[^\w||_||/]+$/, '');
            },
            /**删除字典值*/
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/resources/ResAuditLogClist/del", {"params": {"id": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.refreshAndPageReset();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })
                    });
                });
            },
            /**新增下拉需要的值*/
            addDetailItem() {
                this.detailGridData.push({name: '', code: '', value: '', enabled: 1, remark: ''})
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.detailGridData.splice(index, 1);
            },
            /**此方法为替换，用于上移或下移操作*/
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            /**上移*/
            moveup(index) {
                if (index != 0) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index - 1);
                }
            },
            /**下移*/
            movedown(index) {
                if (index + 1 != this.detailGridData.length) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index + 1);
                }
            },
            /**保存*/
            save() {
                this.$refs.dicForm.validate((valid) => {
                    if (valid) {
                        this.$axios.post("/resources/ResAuditLogClist/saveOrUpdate", this.auditConfig)
                            .then(success => {
                                this.$message.success("保存成功");
                                this.$refs.iceGrid.refreshAndPageReset();
                                this.dialogVisible = false;
                            }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg
                            })
                        })
                    }
                });
            },

            /**关闭新增弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            },
            /**关闭新增类型弹窗*/
            closeDialogType() {
                this.$refs.form.clearValidate();
                this.dialogVisibleType = false;
            }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        components: {
            IceDialog,
            ServiceManage,
            IceTreeGrid,
            IceSelect,
            IceGridLayout,
            IceQueryGrid
        }
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;

        .button-area {
            display: flex;
            justify-content: flex-end;
        }

    }
</style>
