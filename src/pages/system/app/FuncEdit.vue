<template>
    <div>
        <div class="ice-grid-tool-bar">
            <el-button type="primary" class="el-icon-plus" @click="add">新增</el-button>
        </div>
        <div style="height: 500px;position: relative">
            <div class="ice-full-absolute">
                <el-table
                        class="app-fun-edit el-table--scrollable-y"
                        :data="tableData"
                        style="width: 100%;margin-bottom: 20px;"
                        :height="500"
                        border
                        row-key="oid">
                    <el-table-column
                            align="left"
                            prop="name"
                            label="名称"
                            width="250">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="url"
                            label="URL"
                            width="150">
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="bigIconUrl"
                            label="大图"
                            width="150">
                        <template slot-scope="scope">
                            <img :src="$showImage(scope.row.bigIconUrl)" width="22px" height="22px"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="center"
                            prop="smallIconUrl"
                            label="小图">
                        <template slot-scope="scope">
                            <img :src="$showImage(scope.row.smallIconUrl)" width="22px" height="22px"/>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="openType"
                            label="打开方式">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="enabled"
                            label="启用状态">
                    </el-table-column>
                    <el-table-column
                            align="left"
                            sortable
                            prop="sequencing"
                            label="排序">
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="操作"
                            width="200">
                        <template slot-scope="scope">
                            <el-button @click="remove(scope.row)" type="text" size="small">删除</el-button>
                            <el-button @click="updata(scope.row)" type="text" size="small">编辑</el-button>
                            <el-button @click="addChildren(scope.row)" type="text" size="small">新增</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <div>
            <el-dialog v-dialogDrag :title="title" custom-class="ice-dialog" center :visible.sync="addFuncDialogVisible"
                       width="1000px" append-to-body :close-on-click-modal="false" height=500px>
                <div class="ice-container">
                    <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar"
                             ref="form"
                             style="margin-top: 20px">
                        <el-row :gutter="60">
                            <el-col :span="24">
                                <el-form-item label="功能点名称" label-width="100px" prop="name">
                                    <el-input placeholder="功能点名称" v-model="mainDataForm.name" maxlength="20"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="URL" label-width="100px" prop="url">
                                    <el-input placeholder="URL" v-model="mainDataForm.url" maxlength="128"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="打开方式" label-width="100px" prop="openType">
                                    <el-select placeholder="打开方式" v-model="mainDataForm.openType">
                                        <el-option label="主页面" value="1"></el-option>
                                        <el-option label="弹出页面" value="2"></el-option>
                                        <el-option label="内嵌页面" value="3"></el-option>
                                        <el-option label="下拉页面" value="4"></el-option>
                                        <el-option label="管理页面" value="5"></el-option>
                                        <el-option label="公共页面" value="6"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="大图" label-width="100px" prop="bigIconUrl">
                                    <ice-image-uploader v-model="mainDataForm.bigIconUrl"
                                                        class="avatar-uploader"></ice-image-uploader>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="小图" label-width="100px" prop="smallIconUrl">
                                    <ice-image-uploader v-model="mainDataForm.smallIconUrl"
                                                        class="avatar-uploader"></ice-image-uploader>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="启用状态:" label-width="100px" prop="enabled">
                                    <el-select placeholder="启用状态" v-model="mainDataForm.enabled">
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序" label-width="100px" prop="sequencing">
                                    <el-input placeholder="只能输入1至7位数字哦" v-model="mainDataForm.sequencing" maxlength="7"
                                              @keyup.native="number"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div class="ice-button-bar ">
                        <el-button type="primary" @click="save">保存</el-button>
                        <el-button type="info" @click="closeDialog">返回</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
    </div>
</template>


<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import OrganizationTypeEdit from "../../../pages/system/organization/OrganizationTypeEdit";
    import OrgComm from "../../../pages/system/comm/OrgComm";
    import OrgTree from "../../../pages/system/organization/OrgTree";
    import UserEdit from "../../../pages/system/users/UserEdit";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";

    export default {
        name: "FuncEdit",
        props: {
            appCode: String
        },
        mixins: [OrgComm],
        data() {
            return {
                mainDataForm: {},
                addFuncDialogVisible: false,
                tableData: [],
                title: '',
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入类型编码', trigger: 'blur'}],
                    name: [{required: true, whitespace: true, message: '请输入类型名称', trigger: 'blur'}],
                }
            }
        },
        methods: {
            /**初始化加载菜单*/
            init() {
                this.$axios.get("/permission/app_function/load_tree", {"params": {"appCode": this.appCode}}).then(success => {
                    if (!success.data) {
                        return;
                    }
                    this.tableData = success.data;
                    this.cleanRul(this.tableData);
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '加载菜单出错了'
                    })
                });
            },
            /**当菜单有子菜单时清除当前菜单的URL*/
            cleanRul(x) {
                for (let i = 0; i < x.length; i++) {
                    if (x[i].children != null) {
                        x[i].url = '';
                        this.cleanRul(x[i].children);
                    }
                }
            },
            /**添加菜单*/
            add() {
                this.mainDataForm = {};
                this.addFuncDialogVisible = true;
                this.title = '新增功能节点';
            },
            /**删除菜单*/
            remove(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/app_function/delete", {"params": {"oid": row.oid}}).then(success => {
                        this.$message.success("删除成功");
                        this.init();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '删除出错了'
                        })
                    });
                });
            },
            /**编辑菜单信息*/
            updata(row) {
                this.addFuncDialogVisible = true;
                this.$axios.get("/permission/app_function/by_id", {"params": {"oid": row.oid}}).then(success => {
                    this.title = '编辑';
                    this.addFuncDialogVisible = true;
                    this.mainDataForm = success.data
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '出错了'
                    })
                });
            },
            /**添加子菜单*/
            addChildren(row) {
                this.mainDataForm = {};
                this.mainDataForm.parentId = row.oid;
                this.addFuncDialogVisible = true;
                this.title = '新增功能子节点';
            },
            /**保存菜单*/
            save() {
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        // console.log('error submit!!');
                        return false;
                    }
                    this.mainDataForm.appCode = this.appCode;
                    if (!this.mainDataForm.oid) {
                        this.tableData.push(this.mainDataForm);
                    }
                    this.$axios.patch("/permission/app_function/save", this.mainDataForm).then(success => {
                        this.$message.success("保存成功");
                        this.closeDialog();
                        this.init();
                    }).catch(error => {
                        /*this.addFuncDialogVisible=false;*/
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '保存出错了'
                        })
                    });
                });
            },
            /**弹窗的返回按钮---关闭弹窗*/
            closeDialog() {
                this.addFuncDialogVisible = false;
                this.mainDataForm = {};
            },
            /**效验排序只能输入数字*/
            number() {
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace(/[^\.\d]/g, '');
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace('.', '');
            },
        },
        computed: {},
        watch: {},
        mounted() {
        },
        components: {IceImageUploader, IceTreeGrid, IceQueryGrid, OrganizationTypeEdit, OrgTree, UserEdit}
    }
</script>

<style>
    .app-fun-edit.el-table .el-table__body .is-left .cell {
        justify-content: left;
    }

    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;

    }
</style>
