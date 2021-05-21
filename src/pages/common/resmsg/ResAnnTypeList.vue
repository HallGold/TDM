<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="公告管理"
                        data-url="/resources/ResAnnType/list"
                        :query="query"
                        :columns="columns"
                        ref="mainQueryGrid"
                        :operations="operations"
                        :buttons="buttons">
        </ice-query-grid>

        <!-- 弹出层 新增OR修改 -->
        <el-dialog v-dialogDrag title="公告类型维护" custom-class="ice-dialog" center :visible.sync="dialogAddVisible"
                   width="600px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="addItemForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="类型编码:" label-width="100px" prop="code">
                                <el-input placeholder="类型编码" v-model="mainDataForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型名称:" label-width="100px" prop="name">
                                <el-input placeholder="类型名称" v-model="mainDataForm.name"></el-input>
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
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    export default {
        name: "ResAnnTypeList",
        data(){
            return {
                query: [
                    {type: 'input', label: '编码', code: 'code', value: ''},
                    {type: 'input', label: '名称', code: 'name', value: ''},
                ],
                columns: [
                    {code:'oid',hidden:true},
                    {label: '编码', code: 'code', width: 190},
                    {label: '名称', code: 'name', width: 190}
                ],
                operations: [
                    {name: '修改', callback: this.updateItem},
                    {name: '删除', callback: this.deleteItem},
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback: this.addItem}],
                dialogAddVisible:false,
                mainDataForm:{oid:null,code:null,name:null},
                formRules:{
                    code: [{required: true, message: '请输入类型编码', trigger: 'blur'}],
                    name: [{required: true, message: '请输入类型名称', trigger: 'blur'}],
                }
            }
        },
        methods:{
            addItem(){
                this.mainDataForm = {oid:null,code:null,name:null};
                this.dialogAddVisible = true;
            },
            updateItem(row){
                this.mainDataForm = row;
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
                    this.$axios.post("/resources/ResAnnType/saveOrUpdate", this.mainDataForm)
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
                    this.$axios.delete("/resources/ResAnnType/del", {params:{"id":row.oid}})
                        .then(result => {
                            this.$message.success("操作成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.closeDialog();
                        });
                });
            }
        },
        components: {IceQueryGrid}
    }
</script>

<style scoped>

</style>
