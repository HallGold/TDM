<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-tree-grid load-url="/permission/dataDictionary/get_by_tree"
                       ref="iceGrid"
                       label-prop="name"
                       value-prop="oid"
                       :lazy="false"
                       parent-prop="typeId"
                       :data-url="'/permission/dataDictionary/listByTypeId'"
                       :pagination="false"
                       :query="query"
                       :columns="columns"
                       :operations="operations"
                       :buttons="buttons"
                       treeWidth="300px"
                       grid-auto-refresh="true"
                       @node-click="dataTree"
                       :operations-width="140">
            <div style="display: flex;justify-content:space-around" slot="prefix">
                <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode">
                    <span style="color: #222222">新增</span>
                </el-button>
                <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode"
                           :disabled="!curTreeNode.doEdit">
                    <span style="color: #222222">编辑</span>
                </el-button>
                <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteDicType"
                           :disabled="!curTreeNode.doEdit">
                    <span style="color: #222222">删除</span>
                </el-button>
            </div>
        </ice-tree-grid>
        <ice-dialog :title="dicTitle"
                    :visible.sync="dialogVisible"
                    height="345px"
                    width="800px">
            <div class="ice-container">
                <el-form :model="dicDataForm" :rules="dicFormRules" label-position="right" class="conditon-bar"
                         ref="dicForm">
                    <ice-grid-layout name="数据字典值" :columns=1 gutter="0px" :expandable=false>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="名称:" label-width="100px" prop="name">
                                    <el-input placeholder="不超过50个字" v-model="dicDataForm.name"
                                              maxlength="50"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编码:" label-width="100px" prop="code">
                                    <el-input placeholder="由数字英文字母或者下划和/线组成"
                                              v-model="dicDataForm.code"
                                              @blur="checkDicCodeUnique"
                                              maxlength="50"
                                              @keyup.native="codeItemDic"
                                              :disabled="isUpDataValue"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="简称:" label-width="100px" prop="value">
                                    <el-input placeholder="由数字英文字母或者下划线组成"
                                              v-model="dicDataForm.value"
                                              maxlength="30"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                    <el-checkbox v-model="dicDataForm.enabled"
                                                 :true-label=1
                                                 :false-label=0></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序:" label-width="100px" prop="sequencing">
                                    <el-input-number v-model="dicDataForm.sequencing" :min="0" :max="99"
                                                     controls-position="right" value="0"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40" v-if="($userInfo.userType & 33) === 33">
                            <el-col :span="12">
                                <el-form-item label="是否可见:" label-width="100px" prop="isVisiblable">
                                    <el-checkbox v-model="dicDataForm.isVisiblable"
                                                 true-label="Y"
                                                 false-label="N"></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否可编辑:" label-width="100px" prop="isEditable">
                                    <el-checkbox v-model="dicDataForm.isEditable"
                                                 true-label="Y"
                                                 false-label="N"></el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="备注:" label-width="100px" prop="desp">
                                    <el-input placeholder="不超过256个字" type="textarea" :rows="4"
                                              v-model="dicDataForm.remark" maxlength="256"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>
        <ice-dialog :title="typeTitle" :visible.sync="dialogVisibleType" width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar"
                         ref="form">
                    <ice-grid-layout name="数据字典类型" :columns=1 gutter="0px" :expandable=false>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="类型名称:" label-width="100px" prop="name">
                                    <el-input placeholder="不超过20个字" v-model="mainDataForm.name"
                                              maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="类型编码:" label-width="100px" prop="code">
                                    <el-input placeholder="由数字英文字母或者下划线组成"
                                              v-model="mainDataForm.code"
                                              @blur="checkDicTypeUnique"
                                              maxlength="30"
                                              @keyup.native="codeItem"
                                              :disabled="isUpData"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                    <el-checkbox v-model="mainDataForm.enabled"
                                                 :true-label=1
                                                 :false-label=0></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序:" label-width="100px" prop="sequencing">
                                    <el-input-number v-model="mainDataForm.sequencing" :min="0" :max="99"
                                                     controls-position="right"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40" v-if="($userInfo.userType & 33) === 33">
                            <el-col :span="12">
                                <el-form-item label="是否可见:" label-width="100px" prop="isVisiblable">
                                    <el-checkbox v-model="mainDataForm.isVisiblable"
                                                 true-label="Y"
                                                 false-label="N"></el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否可编辑:" label-width="100px" prop="isEditable">
                                    <el-checkbox v-model="mainDataForm.isEditable"
                                                 true-label="Y"
                                                 false-label="N"></el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>

                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="描述说明:" label-width="100px" prop="desp">
                                    <el-input placeholder="不超过256个字" type="textarea" :rows="4"
                                              v-model="mainDataForm.desp" maxlength="256"></el-input>
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
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";

    export default {
        name: "DatamapList",
        data() {
            return {
                query: [
                    // {type: 'input', label: '类型编码', code: 'code', value: ''},
                    // {type: 'input', label: '类型名称', code: 'name', value: ''},
                ],
                columns: [
                    {label: '类型名称', code: 'name', width: 200,align:'left'},
                    {label: '类型编码', code: 'code', width: 180,align:'left'},
                    {label: '状态', code: 'enabled', width: 100, mapTypeCode: 'enabled'},
                    {label: '备注', code: 'remark', align: 'left'},
                ],
                operations: [
                    {
                        name: '编辑', callback: this.updateItem, isShow: (row) => {
                            return row.doEdit && this.curTreeNode.doEdit;
                        }
                    },
                    {
                        name: '删除', callback: this.deleteItem, isShow: (row) => {
                            return row.doEdit && this.curTreeNode.doEdit;
                        }
                    },
                ],
                buttons: [
                    {
                        name: '新增值', icon: 'el-icon-plus', disabled: () => {
                            return !this.curTreeNode.doEdit;
                        }, type: 'primary', callback: this.addItem
                    },
                    {
                        name: '从全局数据字典同步', icon: 'el-icon-plus', type: 'primary', callback: this.asyncItem
                    }
                ],
                dialogVisible: false,
                dialogVisibleType: false,
                mainDataForm: {
                    appCode: '',
                    code: '',
                    name: '',
                    parentid: '',
                    enabled: '1',
                    desp: '',
                },
                dicDataForm: {
                    oid: "",
                    code: "",
                    name: "",
                    value: "",
                    remark: '',
                    enabled: 1,
                    sequencing: '0',
                    isSystem: "N",
                    isVisiblable: "Y",
                    isEditable: "Y",
                    orgCode: "",
                    typeId: "",
                    doEdit: false
                },
                dicFormRules: {
                    code: [{required: true, whitespace: true, message: '请输入编码', trigger: 'change'}],
                    name: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                },
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入类型编码', trigger: 'change'}],
                    name: [{required: true, whitespace: true, message: '请输入类型名称', trigger: 'blur'}],
                },
                detailGridData: [
                    {name: '', code: '', value: '', enabled: '1', remark: ''}
                ],
                detailRules: {
                    code: {required: true, whitespace: true, message: '请输入值编码', repeatable: false, trigger: 'blur'},
                    name: {required: true, whitespace: true, message: '请输入值名称'},
                },
                mainDataFormType: [],
                formRulesType: [],
                nodeType: '',
                curTreeNode: {
                    doEdit: false
                },
                isUpData: false,
                isUpDataValue: false,
                funCode: '',
                isLook: false,
                typeTitle: '数据字典类型维护',
                dicTitle: '数据字典值维护'
            }
        },
        methods: {
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisibleType = false;
            },
            /**树形节点获取*/
            dataTree(row) {
                this.nodeType = row;
                this.$nextTick(() => {
                    let obj = this.$refs.iceGrid.$refs.tree.getNode(row);
                    this.curTreeNode = obj.data;
                })

            },
            /**新增数据值类型*/
            addItem() {
                if (this.nodeType == 0) {
                    this.$message({
                        message: '该节点为根节点，不可添加字典值',
                        type: 'warning'
                    });
                } else {
                    this.isLook = true;
                    this.isUpDataValue = false;
                    //this.detailGridData = [{name: '', code: '', value: '', enabled: 1, remark: ''}];
                    this.dicDataForm = {
                        oid: "",
                        code: "",
                        name: "",
                        value: "",
                        remark: '',
                        enabled: 1,
                        sequencing: '0',
                        isSystem: "N",
                        isVisiblable: "Y",
                        isEditable: "Y",
                        orgCode: "",
                        typeId: this.typeId,
                        doEdit: true
                    }
                    this.dialogVisible = true;
                    this.$nextTick(() => {
                        this.$refs.dicForm.clearValidate();
                    })

                }

            },

            /**新增到树形结构*/
            addNode() {
                this.typeTitle = '新增数据字典类型';
                this.mainDataForm = {enabled: 1, isVisiblable: 'Y', isEditable: 'Y', sequencing: '0'};
                this.dialogVisibleType = true;
                this.isUpData = false;
                this.funCode = '';
                this.$nextTick(()=>{
                    this.$refs.form.clearValidate();
                })
            },
            /*校验字典编码是否重复*/
            checkDicCodeUnique() {

            },
            /**验证编码值是否重复*/
            checkDicTypeUnique() {
                if (this.mainDataForm.code) {
                    this.$axios.get("/permission/dataDictionary/repeat_dictionary_type", {"params": {"typeCode": this.mainDataForm.code}}).then(success => {
                        if (!success.data) {
                            if (this.funCode != this.mainDataForm.code) {
                                this.$message.warning("该编码已存在，请换一个");
                                this.mainDataForm.code = '';
                            }
                        }
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg
                        })

                    });
                }
            },
            /**修改类型*/
            updateNode() {
                if (this.nodeType == 0) {
                    this.$message({
                        message: '该节点为根节点，不可修改',
                        type: 'warning'
                    });
                } else {
                    this.typeTitle = '编辑数据字典类型';
                    this.$axios.get("/permission/dataDictionary/byId", {"params": {"typeId": this.nodeType}})
                        .then(success => {
                            this.dialogVisibleType = true;
                            this.mainDataForm = success.data;
                            // this.mainDataForm.enabled = this.mainDataForm.enabled == 1 ? "是" : (this.mainDataForm.enabled == 0 ? "否" : this.mainDataForm.enabled);
                            this.isUpData = true;
                            this.funCode = this.mainDataForm.code;
                        }).catch(error => {
                        this.$message.error("加载数据字典类型出错了");
                    })
                }
            },
            /**删除类型*/
            deleteDicType() {
                if (this.nodeType == 0) {
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
                        this.$axios.delete("/permission/dataDictionary/delete", {"params": {"typeId": this.nodeType}})
                            .then(success => {
                                this.$refs.iceGrid.deleteNode();
                                this.$message.success("删除数据字典类型成功");
                                this.$refs.iceGrid.$refs.tree.refresh();

                            }).catch(error => {

                            this.$message({
                                type: 'error',
                                message: error.msg ? error.msg : error
                            })
                        })
                    });
                }
            },
            /**同步*/
            asyncItem() {
                this.$axios.put("/permission/dataDictionary/syn_data_dictionary").then(success => {
                    this.$message.success("同步成功");
                    this.$refs.iceGrid.$refs.queryGrid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg
                    })
                });
            },
            /**编辑*/
            updateItem(row) {
                this.isLook = false;
                this.isUpDataValue = true;
                this.$axios.get("/permission/dataDictionary/dictionary_by_id", {"params": {"id": row.oid}})
                    .then(success => {
                        this.dicDataForm = success.data;
                        // this.detailGridData = [];
                        // this.detailGridData.push(success.data);
                        // this.detailGridData[0].enabled = this.detailGridData[0].enabled == 1 ? "是" : (this.detailGridData[0].enabled == 0 ? "否" : this.detailGridData[0].enabled);
                        /*this.detailGridData.forEach(item => item.enabled = item.enabled ? true : false)*/
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
                    this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_||\-]+$/, '');
                }
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItemDic() {
                this.dicDataForm.code = this.dicDataForm.code.replace(/[^\w||\-||_||/]+$/, '');
            },
            /**删除字典值*/
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/dataDictionary/delete_dictionary_id", {"params": {"id": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        this.$refs.iceGrid.$refs.queryGrid.refresh();
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
                        this.detailGridData = [];
                        this.detailGridData.push(this.dicDataForm);
                        this.$axios.patch("/permission/dataDictionary/save_data_dictionary_cascade", {
                            "appDictionaryVoList": this.detailGridData,
                            "typeId": this.nodeType
                        })
                            .then(success => {
                                this.$message.success("保存数据字典值成功");
                                this.$refs.iceGrid.$refs.queryGrid.refresh();
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
            /**新增与更新数据字典类型的保存*/
            saveType() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.nodeType == 0) {
                            this.mainDataForm.parentId = null;
                        } else {
                            if (!this.isUpData) {
                                this.mainDataForm.parentId = this.nodeType;
                            }
                        }
                        this.$axios.patch("/permission/dataDictionary/save_type_cascade", this.mainDataForm).then(success => {
                            this.$message.success("保存数据字典类型成功");
                            this.dialogVisibleType = false;
                            if (!this.isUpData) {
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
            /**关闭新增弹窗*/
            closeDialog() {
                this.dialogVisible = false;
            },
            /**关闭新增类型弹窗*/
            closeDialogType() {
                this.dialogVisibleType = false;
            }
        },
        computed: {},
        watch: {},
        mounted() {
        },
        components: {
            IceTreeGrid,
            IceSelect,
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout,
            IceQueryGrid
        }
    }

</script>


<style lang="less" scoped>
    /*.editor-wrapper {*/
    /*    display: flex;*/
    /*    flex-direction: column;*/

    /*    .button-area {*/
    /*        display: flex;*/
    /*        justify-content: flex-end;*/
    /*    }*/

    /*}*/
</style>
