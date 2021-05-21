<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%" id="$gridwrapper$">
        <ice-query-grid title="岗位管理"
                        data-url="/permission/work_position/list"
                        :pagination="false"
                        :query="queryWork"
                        :columns="columnsWork"
                        :chooseItem="choose"
                        ref="grid"
                        :operationsWidth="100"
                        :operations="operationsWork"
                        :buttons="buttonsWork"></ice-query-grid>
        <ice-dialog v-dialogDrag :title="title" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar"
                         ref="form">
                    <ice-grid-layout name="岗位信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item  label="岗位名称:" label-width="100px" prop="name">
                                <el-input placeholder="不超过20个字" v-model="mainDataForm.name" maxlength="20"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item  label="岗位编码:" label-width="100px" prop="code">
                                <el-input placeholder="由数字英文字母或者下划线组成"
                                          v-model="mainDataForm.code"
                                          :disabled="isUpData"
                                          maxlength="30"
                                          @keyup.native="codeItem"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item  label="排序" label-width="100px" prop="sequencing">
                                <el-input placeholder="只能输入1至7位数字哦" v-model="mainDataForm.sequencing" maxlength="7"
                                          @keyup.native="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item  label="描述" label-width="100px" prop="desp">
                                <el-input placeholder="描述不超过256个字" v-model="mainDataForm.desp" type="textarea" :rows="3"
                                          maxlength="256"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="备注" label-width="100px" prop="remark">
                                <el-input placeholder="备注" v-model="mainDataForm.remark" type="textarea" :rows="3"
                                          maxlength="256"></el-input>
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
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import {Loading} from 'element-ui';
    import IceGridLayout from "../../../components/common/base/IceGridLayout";

    export default {
        name: "WorkPositionWorkManger",
        components: {IceGridLayout, IcePersionSelector, IceDialog, IceQueryGrid},
        props: {
            choose: String
        },
        data() {
            return {
                queryLook: [
                    {type: 'input', label: '人员名称', code: 'name', value: ''},
                    {
                        type: 'static', code: "positionId", exp: "=", value: () => {
                            return this.lookOID;
                        }
                    },
                ],
                columnsLook: [
                    {code: "oid", hidden: true},
                    {label: '人员名称', code: 'name', width: 120},
                    {label: '单位名称', code: 'orgName', width: 160},
                    {label: '部门名称', code: 'deptName', width: 150},
                ],
                queryWork: [
                    {type: 'input', label: '岗位名称', code: 'name', value: ''},
                    {type: 'input', label: '岗位编码', code: 'code', value: ''},
                ],
                columnsWork: [
                    {code: "oid", hidden: true},
                    {label: '岗位名称', code: 'name', width: 180,align:'left'},
                    {label: '岗位编码', code: 'code', width: 180,align:'left'},
                    {label: '描述', code: 'desp', width: 280, align:'left'},
                    {label: '备注', code: 'remark', showTips:true,align:'left'},
                    {label: '排序', code: 'sequencing', width: 90},
                ],
                operationsWork: [
                    {name: '编辑', callback: this.updataItem},
                    {name: '删除', callback: this.deleteItem}
                ],
                buttonsWork: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}
                ],
                mainDataForm: {},
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入岗位编码', trigger: 'blur'}],
                    name: [{required: true, whitespace: true, message: '请输入岗位名称', trigger: 'blur'}],
                },
                dialogVisible: false,
                title: '',
                positionId: '',
                isLook: false,
                isUpData: false,
                lookOID: '',
                selectedPersion: []
            }
        },
        methods: {
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**新增岗位*/
            addItem() {
                this.title = '新增岗位';
                this.mainDataForm = {};
                this.dialogVisible = true;
                this.isUpData = false;
            },
            /**岗位维护*/
            updataItem(row) {
                this.isUpData = true;
                this.$axios.get("/permission/work_position/by_id", {"params": {"oid": row.oid}}).then(success => {
                    this.title = '岗位维护';
                    this.dialogVisible = true;
                    this.mainDataForm = success.data;
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '获取岗位信息失败'
                    })
                });
            },

            /**删除*/
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    let loading = Loading.service({target: document.getElementById('$gridwrapper$'), lock: true});
                    this.$axios.delete("/permission/work_position/delete", {"params": {"oid": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        loading.close();
                        this.$nextTick(() => {
                            this.$refs.grid.refresh();
                        })
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '删除失败'
                        })
                        loading.close();
                    });
                });
            },

            selectCannel() {
                this.$refs.persionPop.cleanColumnSelect();
            },

            /**保存*/
            save() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.patch("/permission/work_position/save_update", this.mainDataForm).then(success => {
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
            closeDialog() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            /**效验排序只能输入数字*/
            number() {
                if (this.mainDataForm.sequencing) {
                    this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace(/[^\.\d]/g, '');
                    this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace('.', '');
                }
            },
            /**校验编码只能由数字，下划线，英文字母组成*/
            codeItem() {
                if (this.mainDataForm.code) {
                    this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/, '');
                }
            }
        },
        mounted() {

        }
    }
</script>

<style scoped>
    .look {
        margin: 0;
        padding: 0;
    }
</style>
