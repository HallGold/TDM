<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="公告管理"
                        data-url="/resources/ResAnnouncement/list"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>
        <el-dialog v-dialogDrag title="公告管理" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">

                            <el-form-item label="标题:" label-width="100px" prop="title">
                                <el-input placeholder="标题" v-model="mainDataForm.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型:" label-width="100px" prop="type">
                                <el-input placeholder="类型" v-model="mainDataForm.type"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="范围:" label-width="100px" prop="scope">
                                <el-input  placeholder="范围" v-model="mainDataForm.scope"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="内容:" label-width="100px" prop="content">
                                <el-input placeholder="公告内容" type="textarea" :rows="6" v-model="mainDataForm.content"></el-input>
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

        <el-dialog v-dialogDrag title="公告预览" custom-class="ice-dialog" center :visible.sync="dialogLook"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <label style="text-align: center;">111</label>
                <!--<el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="form"-->
                         <!--style="margin-top: 20px">-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="12">-->

                            <!--<el-form-item label="标题:" label-width="100px" prop="title">-->
                                <!--<el placeholder="标题" v-model="mainDataForm.title"></el>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="类型:" label-width="100px" prop="type">-->
                                <!--<el-input placeholder="类型" v-model="mainDataForm.type"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="12">-->
                            <!--<el-form-item label="范围:" label-width="100px" prop="scope">-->
                                <!--<el-input  placeholder="范围" v-model="mainDataForm.scope"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                    <!--<el-row :gutter="60">-->
                        <!--<el-col :span="24">-->
                            <!--<el-form-item label="内容:" label-width="100px" prop="content">-->
                                <!--<el-input placeholder="公告内容" type="textarea" :rows="6" v-model="mainDataForm.content"></el-input>-->
                            <!--</el-form-item>-->
                        <!--</el-col>-->
                    <!--</el-row>-->
                <!--</el-form>-->
                <div class="ice-button-bar ">
                    <!--<el-button type="primary" @click="save">保存</el-button>-->
                    <el-button type="info" @click="closeLookDialog">返回</el-button>
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
                    {type: 'input', label: '标题', code: 'title', value: ''},
                    {type: 'input', label: '发送用户', code: 'type', value: ''},
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {code:'scope',hidden:true},
                    {label: '标题', code: 'title', width: 190},
                    {label: '内容', code: 'content', width: 240},
                    {label: '类型', code: 'type', width: 160},
                ],
                operations: [
                    {name: '预览', callback: this.lookItem},
                    {name: '修改', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                dialogVisible: false,
                dialogLook:false,
                mainDataForm: {
                    oid: '',
                    title: '',
                    content: '',
                    type: '',
                    scope: '',
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
                this.mainDataForm.title = '';
                this.mainDataForm.content = '';
                this.mainDataForm.type = '';
                this.mainDataForm.scope = '';
                this.dialogVisible = true;
            },
            updateItem(row) {
                this.mainDataForm.oid = row.oid;
                this.mainDataForm.title = row.title;
                this.mainDataForm.content = row.content;
                this.mainDataForm.type = row.type;
                this.mainDataForm.scope = row.scope;
                this.mainDataForm.desp = row.desp;
                this.dialogVisible = true;
            },
            deleteItem(row) {
                this.$axios.post("/resources/ResAnnouncement/delete", row)
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
                        this.$axios.post("/resources/ResAnnouncement/saveOrUpdate", this.mainDataForm)
                            .then(result => {
                                this.$message.success("保存成功");
                                this.$refs.grid.refresh();
                                this.closeDialog();
                            })
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            closeLookDialog() {
                this.dialogLook = false;
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
