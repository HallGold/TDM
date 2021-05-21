<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="消息模板配置"
                        data-url="/bpm/ExtMessageTemplate/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <ice-dialog :title="tittle" :visible.sync="dialogVisible" width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" ref="form">
                    <ice-grid-layout name="消息模板信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="类型" label-width="90px" prop="msgType">
                                    <el-select placeholder="类型" v-model="mainDataForm.msgType">
                                        <el-option label="邮件" value="mail"></el-option>
                                        <el-option label="站内信" value="msg"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="标题" label-width="90px" prop="msgTitle">
                                    <el-input placeholder="标题" v-model="mainDataForm.msgTitle" :disabled="aclKeyReadonly"></el-input>
                                </el-form-item>
                            </el-col>

                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="24">
                                <el-form-item label="模板内容" label-width="90px" prop="msgContext">
                                    <el-input placeholder="模板内容" v-model="mainDataForm.msgContext" resize="none" type="textarea" :rows="6" maxlength="256"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" @click="save">确 定</el-button>
                <el-button type="info" @click="closeDialog">取 消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'

    export default {
        name: 'ExtMessageTemplate',
        data() {
            return {
                query: [
                  /*  {type: 'input', label: '类型', code: 'msgType'},*/
                    {type: 'input', label: '标题', code: 'msgTitle'}

                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '类型', code: 'msgType', width: 120,mapTypeCode:'msgType',sortable: true,align:'left'},
                    {label: '标题', code: 'msgTitle', width: 140,sortable: true,align:'left'},
                    {label: '模板内容', code: 'msgContext', width: 240,align:'left'}
                    ],
                operations: [
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                            this.dialogVisible=true;
                            this.aclKeyReadonly=true;
                            this.tittle='消息模板配置'
                        }
                    },
                    {name: '删除', callback: this.deleteAcl}
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.mainDataForm={};
                        this.aclKeyReadonly=false;
                        this.dialogVisible=true;
                        this.tittle='消息模板新增'
                    }}],
                dialogVisible: false,
                aclKeyReadonly:false,
                mainDataForm: {},
                formRules: {
                    msgTitle: [{required: true, message: '请输入标题', trigger: 'blur'}],
                    msgContext: [{required: true, message: '请输入模板内容', trigger: 'blur'}],
                    msgType: [{required: true, message: '请输入类型', trigger: 'blur'}],
                },
                tittle:''
            }
        },
        methods: {
            editAcl(row,index) {
                this.dialogVisible = true;
            },
            deleteAcl(row) {
                this.delAcl = true;
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/ExtMessageTemplate/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error("出错啦")
                    })
                });
            },
            addItem() {
                this.dialogVisible = true;
            },
            save(){


                this.$refs['form'].validate((valid) => {
                    //console.log("form", valid)
                    if (valid) {
                        let obj =this.mainDataForm;
                        this.$axios.post('/bpm/ExtMessageTemplate/saveOrUpdate', obj).then(result => {
                            this.$message.success("操作成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
