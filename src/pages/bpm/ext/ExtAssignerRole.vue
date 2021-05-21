<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="全局处理人角色"
                        data-url="/bpm/ExtAssignerRole/list"
                        :query="query"
                        :columns="columns"
                        :operations="operations"
                        :buttons="buttons" ref="grid">
        </ice-query-grid>
        <div>
            <ice-dialog :title="tittle"
                        :visible.sync="dialogVisible"
                        width="800px">
                <div class="ice-container">
                    <el-form :model="mainDataForm" :rules="formRules" label-position="right" ref="form">
                        <ice-grid-layout name="全局处理人预置角色信息" :columns="1" gutter="0px" :expandable="false">
                            <el-row :gutter="40">
                                <el-col :span="12">
                                    <el-form-item label="处理人类型:" label-width="100px" prop="assignerType">
                                        <el-select placeholder="类型" v-model="mainDataForm.assignerType">
                                            <el-option label="组织人员" value="comorg"></el-option>
                                            <!--  <el-option label="表单域" value="form"></el-option>-->
                                            <el-option label="任务池" value="pool"></el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="名称描述:" label-width="100px" prop="assignerName">
                                        <el-input placeholder="名称描述" v-model="mainDataForm.assignerName"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="24">
                                    <el-form-item label="规则公式" label-width="100px" prop="roleFormula">
                                        <el-input placeholder="规则公式" v-model="mainDataForm.roleFormula" type="textarea" :rows="5"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="40">
                                <el-col :span="24">
                                    <el-form-item label="描述:" label-width="100px" prop="description">
                                        <el-input placeholder="描述" v-model="mainDataForm.description" type="textarea" :rows="3"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </ice-grid-layout>
                    </el-form>
                </div>
                <div class="ice-button-bar" slot="footer">
                    <el-button type="primary" size="medium" @click="editRole">规则编辑</el-button>
                    <el-button type="primary" size="medium" @click="save">保存</el-button>
                    <el-button type="info" size="medium" @click="closeDialog">取 消</el-button>
                </div>
            </ice-dialog>
            <ext-assigner-editor @set-conf="setRoleFormula" ref="m" :data="mainDataForm.roleFormula"></ext-assigner-editor>
        </div>

    </div>
</template>

<script>

    import IceQueryGrid from '../../../components/common/base/IceQueryGrid'
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue'
    import ExtAssignerEditor from './ExtAssignerEditor'
    export default {
        name: 'ExtAssignerRole',
        data() {
            return {
                query: [
                   /* {type: 'input', label: '处理人类型', code: 'assignerType'},*/
                    {type: 'input', label: '名称描述', code: 'assignerName'}
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '处理人类型', code: 'assignerType', width: 120,mapTypeCode:"assignerRoleType",sortable: true},
                    {label: '名称描述', code: 'assignerName', width: 250,sortable: true,align:'left'},
                    {label: '规则公式', code: 'roleFormula', width: 350,align:'left'},
                    {label: '描述', code: 'description', width: 150,align:'left'}
                    ],
                operations: [
                    {name: '删除', callback: this.deleteAcl},
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.mainDataForm = objMain;
                            this.dialogVisible=true;
                            this.aclKeyReadonly=true;
                            this.tittle='全局处理人预置角色编辑'
                        }
                    }
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.mainDataForm={};
                        this.$refs.m.showRoleText='';
                        this.aclKeyReadonly=false;
                        this.dialogVisible=true;
                        this.tittle='全局处理人预置角色新增'
                        this.$nextTick(()=>{
                            this.$refs.form.clearValidate();
                        })
                    }}],
                dialogVisible: false,
                aclKeyReadonly:false,
                mainDataForm: {},
                formRules: {
                    assignerType: [{required: true, message: '请输入处理人类型', trigger: 'blur'}],
                    assignerName: [{required: true, message: '请输入名称描述', trigger: 'blur'}],
                    roleFormula: [{required: true, message: '请输入规则公式', trigger: 'blur'}],
                    description: [{required: true, message: '请输入描述', trigger: 'blur'}],
                },
                tittle:''
            }
        },
        methods: {
            deleteAcl(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/bpm/ExtAssignerRole/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功");
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
                    if (valid) {
                        let obj =this.mainDataForm;
                        this.$axios.post('/bpm/ExtAssignerRole/saveOrUpdate', obj).then(result => {
                            this.$message.success("操作成功");
                            this.dialogVisible = false;
                            this.$refs.m.showRoleText='';
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            editRole(){
                this.$refs.m.dialogVisiblem=true;
                this.$nextTick(() => {
                    this.$refs.m.init();
                })
            },
            setRoleFormula(data){
                data.type=this.mainDataForm.assignerType;
                this.$set(this.mainDataForm,"roleFormula",JSON.stringify(data));
            }
        },
        components: {
            IceQueryGrid,
            IceGridLayout,
            ExtAssignerEditor
        }
    }

</script>


<style scoped>

</style>
