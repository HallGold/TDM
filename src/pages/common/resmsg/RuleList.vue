<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="规则"
                        data-url="/resources/ResAnnRule/list"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>

        <!-- 弹出层 新增OR修改 -->
        <el-dialog v-dialogDrag title="规则维护" custom-class="ice-dialog" center :visible.sync="dialogAddVisible"
                   width="600px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="addItemForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="100">
                            <el-form-item label="规则名称:" label-width="100px" prop="name">
                                <el-input placeholder="规则名称" v-model="mainDataForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="addItemSave">保存</el-button>
                    <el-button type="info" @click="addItemCloseDialog">返回</el-button>
                </div>
            </div>
        </el-dialog>

        <el-dialog v-dialogDrag title="规则明细维护" custom-class="ice-dialog" center :visible.sync="detailDialogVisible"
                   width="999px" append-to-body :close-on-click-modal="false">
            <rule-list-detail :roid="rowDataRoid"></rule-list-detail>
        </el-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import RuleListDetail from "./RuleListDetail.vue";
    export default {
        name: "RuleList",
        data() {
            return {
                query: [
                    {type: 'input', label: '规则名称', code: 'code', value: ''},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '规则名称', code: 'name', width: 190},
                ],
                operations: [
                    {name: '修改', callback: this.updateItem},
                    {name: '规则明细', callback: this.detailMgr},
                    {name: '删除', callback: this.deleteItem},
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                mainDataForm: {name:null},
                formRules: {
                    name: [{required: true, message: '请输入规则名称', trigger: 'blur'}],
                },
                dialogAddVisible:false,

                detailDialogVisible:false,
                rowDataRoid:""
            }
        },
        methods:{
            addItem(){
                this.mainDataForm = {name:null};
                this.dialogAddVisible = true;
            },
            updateItem(row){
                Object.assign(this.mainDataForm,row);
                this.dialogAddVisible = true;
            },
            addItemCloseDialog(){
                this.dialogAddVisible = false;
            },
            addItemSave(){
                this.$refs['addItemForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/resources/ResAnnRule/saveOrUpdate", this.mainDataForm)
                        .then(result => {
                            this.$message.success("保存成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.addItemCloseDialog();
                        })
                });
            },
            deleteItem(row){
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.delete("/resources/ResAnnRule/del", {params:{"id":row.oid}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.closeDialog();
                        });
                });
            },
            detailMgr(row){
                this.rowDataRoid = row.oid;
                this.detailDialogVisible = true;
            }
        },
        components: {IceQueryGrid,RuleListDetail}
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
