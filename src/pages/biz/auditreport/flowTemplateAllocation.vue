<template>
    <div class="ice-container">
        <ice-query-grid data-url="/permission/work_position_type/list"
                        :pagination="false"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations="operations">
        </ice-query-grid>
        <ice-dialog width="800px" :visible.sync="dialogVisible" title="编辑">
            <el-form v-model="mainData" :rules="formRules" ref="form" label-width="100px">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item prop="a" label="配置名称">
                            <el-input  maxlength="12" placeholder="请输入不超过12个字的配置名称" v-model="mainData.a"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="b" label="环节名称">
                            <el-input  maxlength="12" placeholder="请输入不超过12个字的环节名称" v-model="mainData.b"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item prop="c" label="环节预期用时">
                            <el-input  maxlength="12" placeholder="请输入不超过12个字的环节预期用时" v-model="mainData.c"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item prop="d" label="模板文件ID">
                            <el-input  maxlength="20" placeholder="请输入不超过20个字的模板文件ID" v-model="mainData.d"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item prop="e" label="环节名CODE">
                            <el-input type="textarea" rows="3" maxlength="100" placeholder="请输入不超过100个字的环节名称CODE" v-model="mainData.e"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button type="info" @click="closeDialogEdit">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    export default {
        name: "flowTemplateAllocation",
        components: {IceDialog, IceQueryGrid},
        data(){
            return{
                query:[
                    {type: 'input', label: '配置名称', code: 'name'},
                ],
                columns:[
                    {code: "oid", hidden: true},
                    {label: '配置名称', code: 'name', width: 120},
                    {label: '环节名称', code: 'name', width: 120},
                    {label: '环节名称CODE', code: 'name', width: 120},
                    {label: '环节预期用时', code: 'name', width: 120},
                    {label: '模板文件ID', code: 'name', width: 120},
                ],
                operations:[
                    {name: '编辑', callback: this.upDataItem},
                    {name: '删除', callback: this.deleteItem}
                ],
                dialogVisible:false,
                mainData:{},
                formRules:{}
            }
        },
        methods:{
            /**编辑--打开*/
            upDataItem(){
                this.dialogVisible = true;
            },
            /**编辑--保存*/
            saveEdit(){
                this.$message.success("保存成功");
                this.dialogVisible = false;
            },
            /**编辑--关闭*/
            closeDialogEdit(){
                this.dialogVisible = false;
            },
            /**删除*/
            deleteItem(){
                this.$confirm("确定要删除吗？", '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>