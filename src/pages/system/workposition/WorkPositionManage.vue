<template>
    <div class="ice-container">
        <div style="display: flex;flex-grow: 1">
            <ice-query-grid data-url="/permission/work_position_type/list"
                            :pagination="false"
                            chooseItem="single"
                            @selection-change="tableChange"
                            :columns="columns"
                            ref="grid"
                            :operations="operations"
                            :buttons="buttons"></ice-query-grid>
            <div style="flex-grow: 1;display: flex;flex-direction: column;margin-left: 5px;min-width: 700px; width: 700px;min-height: 400px">
                <div class="ice-grid-button-bar">
                    <el-button type="primary" icon="el-icon-plus" @click="add">新增</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="saveItem">保存</el-button>
                </div>
                <div class="main-content">
                    <div class="ice-full-absolute">
                        <ice-editable-table :data="dataTable" :rules="tableRules" ref="editTable" height="100%"
                                            tooltip-effect="light">
                            <el-table-column :width="50"
                                             label="序号">
                                <template slot-scope="scope">
                                    {{scope.$index+1}}
                                </template>
                            </el-table-column>
                            <el-table-column :width="130"
                                             prop="name"
                                             label="岗位名称">
                            </el-table-column>
                            <el-table-column :width="100"
                                             prop="code"
                                             label="岗位编码">
                            </el-table-column>
                            <ice-editable-table-column prop="rank"
                                                       :width="120"
                                                       label="职级码"
                                                       :min="0"
                                                       :max="999"
                                                       input-type="number">
                            </ice-editable-table-column>
                            <ice-table-column prop="desp"
                                              :show-tips="true"
                                              align="left"
                                              label="描述">
                            </ice-table-column>
                            <el-table-column label="操作" :width="80">
                                <template slot-scope="scope">
                                    <el-button type="text"
                                               size="small" @click="deleteDetailItem(scope.row)">删除
                                    </el-button>
                                    <!--<el-button type="text"
                                               size="small" @click="chooseDeptItem(scope.row)">选人
                                    </el-button>-->
                                </template>
                            </el-table-column>
                        </ice-editable-table>
                    </div>
                </div>
                <ice-pop-selector style="box-sizing: border-box"
                                  label=""
                                  title="请选择岗位"
                                  text-prop="name"
                                  :pagination="false"
                                  chooseItem="multiple"
                                  code-prop="code"
                                  mode="hidden"
                                  :query="queryWork"
                                  :columns="columnsWork"
                                  data-url="/permission/work_position/list"
                                  ref="selectPosition"
                                  @select-confirm="selectConfirmPosition">
                </ice-pop-selector>
                <ice-persion-selector
                        choose-item="multiple"
                        ref="persionPop"
                        mode="hidden"
                        @select-confirm="selectUserConfirm">
                </ice-persion-selector>
            </div>
        </div>
        <ice-dialog v-dialogDrag :title="title" center :visible.sync="dialogVisible"
                    width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar"
                         ref="form">
                    <ice-grid-layout name="岗位线信息" :columns=1 gutter="0px" :expandable=false>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="岗位线名称:" label-width="100px" prop="name">
                                    <el-input placeholder="不超过20个字" v-model="mainDataForm.name"
                                              maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="类型编码:" label-width="100px" prop="code">
                                    <el-input placeholder="由数字英文字母或下滑线组成"
                                              v-model="mainDataForm.code"
                                              maxlength="30"
                                              :disabled="isUpData"
                                              @keyup.native="codeItem"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="所属机构编码:" label-width="100px" prop="orgCode">
                                    <el-input placeholder="所属机构编码" v-model="mainDataForm.orgCode"
                                              :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序" label-width="100px" prop="sequencing">
                                    <el-input placeholder="只能输1至7位入数字哦" v-model="mainDataForm.sequencing" maxlength="7"
                                              @keyup.native="number"></el-input>

                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="描述" label-width="100px" prop="desp">
                                    <el-input placeholder="描述" v-model="mainDataForm.desp" type="textarea"
                                              :rows="3" maxlength="256"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="100px" prop="remark">
                                    <el-input placeholder="备注" v-model="mainDataForm.remark" type="textarea"
                                              :rows="3" maxlength="256"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                    <el-select placeholder="启用状态" v-model="mainDataForm.enabled">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="0"></el-option>
                                    </el-select>
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
    </div>
</template>

<script>
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "WorkPosition",
        components: {
            IceGridLayout,
            IceTableColumn,
            IcePersionSelector,
            IceEditableTable,
            IceEditableTableColumn, IcePopSelector, IceQueryGrid, IceTreeGrid
        },
        data() {
            return {
                queryWork: [
                    {type: 'input', label: '岗位名称', code: 'name', value: ''},
                    {type: 'input', label: '岗位编码', code: 'code', value: ''},
                ],
                columnsWork: [
                    {code: "oid", hidden: true},
                    {label: '岗位名称', code: 'name', width: 200},
                    {label: '岗位编码', code: 'code', width: 120},
                    {label: '描述', code: 'desp', width: 100, align: 'left', showTips: true},

                ],
                columns: [
                    {code: "oid", hidden: true},
                    {label: '岗位线名称', code: 'name', width: 170,align:'left'},
                    /*{label: '类型编码', code: 'code', width: 120},
                    {label: '描述', code: 'desp', width: 120},*/
                    /*{label: '所属机构编码', code: 'orgCode', width: 120},*/
                    {
                        label: '启用状态', code: 'enabled', width: 80, renderCell(h, data) {
                            return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
                        }
                    },
                    {label: '排序', code: 'sequencing', width: 80},
                    {label: '备注', code: 'remark', width: 170, align: 'left', showTips: true},
                ],
                operations: [
                    {name: '编辑', callback: this.updataItem},
                    {
                        name: '启用', callback: this.enable, isShow: function (row) {
                            if (row.enabled == 0) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', callback: this.enable, isShow: function (row) {
                            if (row.enabled == null || row.enabled == 1) {
                                return true;
                            }
                            return false;
                        }
                    }
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}
                ],
                mainDataForm: {},
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入类型编码', trigger: 'blur'}],
                    name: [{required: true, whitespace: true, message: '请输入岗位线名称', trigger: 'blur'}],
                },
                tableRules: {
                    rank: {required: true, whitespace: true, type: 'integer', message: "职级码必须是数字", repeatable: true},
                },
                dataTable: [],
                dialogVisible: false,
                isUpData: false,
                title: '',
                edit: false,
                org: '',
                typeId: '',
                positionId: ''
            }
        },
        methods: {
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/, '');
            },
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            add() {
                if (this.typeId) {
                    this.$nextTick(() => {
                        this.$refs.selectPosition.openDialog();
                    })
                } else {
                    this.$alert('请选择要添加的岗位线', '提示');
                }
            },
            del() {
                this.$nextTick(() => {
                    this.upData();
                })
            },
            upData() {
                this.$axios.get("/permission/work_position_relate/by_line_id", {"params": {"typeId": this.typeId}}).then(success => {
                    this.dataTable = success.data;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '根据岗位线加载岗位出错了'
                    })
                })
            },
            /**保存*/
            save() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.edit) {
                        this.mainDataForm.enabled = this.mainDataForm.enabled == "是" ? 1 : (this.mainDataForm.enabled == "否" ? 0 : this.mainDataForm.enabled)
                    }
                    this.$axios.patch("/permission/work_position_type/save", this.mainDataForm).then(success => {
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.$nextTick(() => {
                            this.$refs.grid.refresh();
                        });

                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '保存失败'
                        })
                    });
                });
            },
            /*按职级码排序*/
            sortPositiionByRank() {
                // this.dataTable.sort((item1, item2) => item1.rank - item2.rank)
                this.dataTable.sort((item1, item2) => item2.rank - item1.rank)
            },
            /**关闭弹窗*/
            closeDialog() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**新增*/
            addItem() {
                this.isUpData = false;
                this.title = '新增岗位线';
                this.mainDataForm = {};
                this.dialogVisible = true;
                this.mainDataForm.orgCode = this.org;
                this.edit = false;
            },
            /**维护*/
            updataItem(row) {
                this.isUpData = true;
                this.$axios.get("/permission/work_position_type/get", {"params": {"oid": row.oid}}).then(success => {
                    this.title = '岗位线维护';
                    this.dialogVisible = true;
                    this.mainDataForm = success.data;
                    this.mainDataForm.enabled = this.mainDataForm.enabled == 1 ? "是" : (this.mainDataForm.enabled == 0 ? "否" : "")
                    this.edit = true;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '出错了'
                    })
                });
            },
            /**禁用与启用*/
            enable(row) {
                if (row.enabled == 1) {
                    this.status = false;
                } else {
                    this.status = true;
                }
                this.$axios.patch("/permission/work_position_type/enabled_status", {
                    ids: row.oid,
                    status: this.status
                }).then(success => {
                    this.$refs.grid.refresh();
                    this.$message.success("操作成功");
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '出错了'
                    })
                });
            },
            /**效验排序只能输入数字*/
            number() {
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace(/[^\.\d]/g, '');
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace('.', '');
            },
            /**树节点点击之后触发的回调*/
            tableChange(val) {
                this.typeId = val[0].oid;
                this.getData(this.typeId);
            },
            /**根据岗位线加载岗位*/
            getData(val) {
                this.$axios.get("/permission/work_position_relate/by_line_id", {"params": {"typeId": val}}).then(success => {
                    this.dataTable = success.data;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '根据岗位线加载岗位出错了'
                    })
                })
            },

            /**删除*/
            deleteDetailItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/work_position_relate/delete", {"params": {"oid": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        this.getData(this.typeId);
                        this.$emit("click-del");
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '出错了'
                        })
                    });
                });
            },
            /**选人弹框的开启按钮*/
            chooseDeptItem(row) {
                this.positionId = row.oid;
                this.$refs.persionPop.openDialog();
                this.$nextTick(() => {
                    this.$refs.persionPop.cleanColumnSelect();
                });
            },
            /**选人---勾选的数据*/
            selectUserConfirm(rows) {
                let obj = {};
                obj.positionUsers = rows;
                obj.positionId = this.positionId;
                this.$axios.patch("/permission/position_user/save_position_users", obj).then(success => {
                    this.$message.success("选人成功");
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '出错了'
                    })
                })
            },
            /**保存*/
            selectConfirmPosition(rows) {
                let postList = [];
                rows.forEach(item => {
                    let o = {};
                    o.code = item.code;
                    o.rank = 1;
                    o.typeId = this.typeId;
                    postList.push(o);
                });
                this.$axios.patch("/permission/work_position_relate/save_updates", {"workPositionRelateVoList": postList}).then(success => {
                    this.$message.success("保存成功");
                    this.dialogVisible = false;
                    this.getData(this.typeId);
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : "保存失败"
                    })
                });

            },
            /**保存岗位职级码*/
            saveItem() {
                this.$refs.editTable.validateAll((valid) => {
                    if (!valid) {
                        return false
                    }
                    this.$axios.patch("/permission/work_position_relate/save_updates", {"workPositionRelateVoList": this.dataTable}).then(success => {
                        this.sortPositiionByRank();
                        this.$message.success("保存成功");
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : "保存失败"
                        })
                    });
                })

            },

        },
        mounted() {
            this.org = this.$userInfo.dataOrgCode;
        }
    }
</script>

<style scoped>

</style>
