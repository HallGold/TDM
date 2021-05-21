<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="邮件账号配置"
                        data-url="/resources/ResMailAccount/list"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>
        <el-dialog v-dialogDrag title="邮件账号配置" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">

                            <el-form-item label="用户名:" label-width="100px" prop="usercode">
                                <el-input placeholder="用户名" v-model="mainDataForm.usercode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="邮箱名:" label-width="100px" prop="emailUsername">
                                <el-input placeholder="邮箱名" v-model="mainDataForm.emailUsername"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="邮箱:" label-width="100px" prop="email">
                                <el-input  placeholder="邮箱" v-model="mainDataForm.email"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密码" label-width="100px" prop="emailPass">
                                <el-input  placeholder="密码" v-model="mainDataForm.emailPass"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="24">-->
                            <!--<el-form-item label="邮箱Url:" label-width="100px" prop="email">-->
                                <!--<el-input placeholder="邮箱Url" :rows="6" v-model="mainDataForm.email"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="save">保存</el-button>
                    <el-button type="info" @click="closeDialog">返回</el-button>
                </div>
            </div>

        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";

    export default {
        name: "AnnountcementList",
        data() {
            return {
                query: [
                    {type: 'input', label: '用户名', code: 'usercode', value: ''},
                    {type: 'input', label: '邮箱名', code: 'emailUsername', value: ''},
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {label: '用户名', code: 'usercode', width: 190},
                    {label: '邮箱名', code: 'emailUsername', width: 240},
                    {label: '邮箱Url', code: 'email', width: 160},
                ],
                operations: [
                    {name: '修改', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                dialogVisible: false,
                mainDataForm: {
                    oid: '',
                    usercode: '',
                    emailUsername: '',
                    email: '',
                    emailPass: '',
                },
                formRules: {
                    title: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    content: [{required: true, message: '请输入公告内容', trigger: 'blur'}],
                    type: [{required: true, message: '请输入类型', trigger: 'blur'}],
                },
            }
        },
        methods: {
            addItem() {
                this.mainDataForm.oid = '';
                this.mainDataForm.usercode = '';
                this.mainDataForm.emailUsername = '';
                this.mainDataForm.email = '';
                this.mainDataForm.emailPass = '';
                this.dialogVisible = true;
            },
            updateItem(row) {
                this.mainDataForm.oid = row.oid;
                this.mainDataForm.usercode = row.usercode;
                this.mainDataForm.emailUsername = row.emailUsername;
                this.mainDataForm.email = row.email;
                this.mainDataForm.emailPass = row.emailPass;
                this.dialogVisible = true;
            },
            deleteItem(row) {
                this.$axios.post("/resources/ResMailAccount/delete", row)
                    .then(result => {
                        this.$message.success("保存成功");
                        this.$refs.grid.refresh();
                        this.closeDialog();
                    })
            },
            lookItem(row){
                    this.mainDataForm.oid = row.oid;
                    this.mainDataForm.title = row.title;
                    this.mainDataForm.content = row.content;
                    this.mainDataForm.type = row.type;
                    this.mainDataForm.scope = row.scope;
                    this.mainDataForm.desp = row.desp;
                    this.dialogLook = true;
            },
            save() {
                        this.$axios.post("/resources/ResMailAccount/saveOrUpdate", this.mainDataForm)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.$refs.grid.refresh();
                                this.closeDialog();
                            })
            },
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        computed: {},
        watch: {},
        mounted() {

        },
        components: {IceEditableTableColumn, IceEditableTable, IceGridLayout, IceQueryGrid}
    }

</script>


<style lang="less" scoped>
    .editor-wrapper {
        display: flex;
        flex-direction: column;
    }
        .button-area {
            display: flex;
            justify-content: flex-end;
        }

</style>
