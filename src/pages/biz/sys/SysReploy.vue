<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">

        <ice-query-grid
                :pagination="false"
                :operations="operations"
                :buttons="buttons"
                :data-url="dataUrl"
                :columns="columns"
                :query="defaultQuery" ref="grid">
        </ice-query-grid>

        <el-dialog v-dialogDrag :title="dialogTittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="50%" append-to-body :close-on-click-modal="false">
            <div class="grid-container">
                <el-form :model="dialogForm" :rules="dialogRules" label-position="right" class="conditon-bar" ref="form"
                         style="margin-top: 20px">
                    <el-form-item  prop="aclType">
                        <el-input type="textarea" placeholder="请输入处理意见" rows="6" maxlength="500" v-model="dialogForm.context"></el-input>
                    </el-form-item>
                </el-form>
                <div class="dialog-footer ice-button-bar">
                    <el-button type="primary" @click="saveDialog">确 定</el-button>
                    <el-button type="info" @click="closeDialog">取 消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceForm from "../../../components/common/base/IceForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSelect from "../../../components/common/base/IceSelect";
    export default {
        name: "SysComplaininfo",
        components: {IceSelect, IceGridLayout, IceForm, IceDialog, IceQueryGrid},
        props:{
            afNo:{
                type: String
            }
        },
        data(){
            return{
                dialogVisible:false,
                dialogTittle:"",
                dialogForm:{context:""},
                dialogRules:{replyContent: [{required: true,message:"请输入意见"}]},
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'userCode', hidden: true},
                    {label: '处理人', code: 'userName', width: 250},
                    {label: '处理意见', code: 'context'},
                    {label: '处理时间', code: 'createDate', width: 150}
                ],
                operations: [
                    {name: '删除', callback: this.deleteItem},
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.dialogForm = objMain;
                            this.dialogVisible=true;
                            this.tittle='编辑处理意见'
                        }
                    }
                ],
                buttons: [{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                        this.dialogForm={};
                        this.dialogVisible=true;
                        this.dialogTittle='添加处理意见'
                    }
                }
                ],
                defaultQuery: [],
                buttonsReply: []
            }
        },
        methods:{
            saveDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let obj =this.dialogForm;
                        obj.afId=this.afNo;

                        this.$axios.post('/biz/BoxReply/saveOrUpdate', obj).then(result => {
                            this.$message.success("成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/biz/BoxReply/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            },
            showDialog(){
                this.defaultQuery=[{type: 'static', label: '表单id', code: 'afId',exp:"=",value:this.afNo}];
                this.dataUrl="/biz/BoxReply/list";
                this.$refs.grid.refresh();
            }
        }
    }
</script>