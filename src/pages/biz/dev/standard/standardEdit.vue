<template>
    <div>
        <el-dialog v-dialogDrag
                   title="设备规格编辑"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="600px"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <div style="height: 260px;">
                <div style="max-height: 260px;overflow-x: hidden">
                    <el-form :model="mainDataForm"
                             status-icon
                             :rules="formRules"
                             ref="form"
                             :disabled="!isEdit"
                             style="margin-top: 15px"
                             label-width="80px">
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="属性名称" prop="propertyName">
                                    <el-input v-model="mainDataForm.propertyName" maxlength="30"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="属性排序" prop="sort">
                                    <el-input-number v-model="mainDataForm.sort"
                                                     controls-position="right"
                                                     :min="0"
                                                     :max="99"></el-input-number>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="12">
                                <el-form-item label="是否必填" prop="necessary">
                                    <el-radio v-model="mainDataForm.necessary" label='1'>是</el-radio>
                                    <el-radio v-model="mainDataForm.necessary" label='0'>否</el-radio>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="是否启用" prop="using">
                                    <el-radio v-model="mainDataForm.using" label='1'>是</el-radio>
                                    <el-radio v-model="mainDataForm.using" label='0'>否</el-radio>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="60">
                            <el-col :span="23">
                                <el-form-item label="属性说明" prop="detail">
                                    <el-input v-model="mainDataForm.detail"
                                              type="textarea" rows="5"
                                              maxlength="256"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </div>
            </div>
            <div class="ice-button-bar ">
                <el-button type="primary" @click="save" v-if="isEdit">确定</el-button>
                <el-button type="info" @click="closeDialog">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "standardEdit",
        props:{
            mainDataForm:{},      //表单对象
            category:String,     //所属类型的code值
            isSuccess:{         //保存成功后的回调
                type:Function
            },
            isEdit:{            //是否为编辑状态
                type:Boolean,
                default:false
            }
        },
        data(){
            return{
                dialogVisible:false,                    //弹框开关属性
                formRules:{//表单验证对象
                    propertyName:[{required: true,whitespace: true, message: '请输入属性名称', trigger: 'blur'}],
                    necessary:[{required: true, message: '请选择是否必填', trigger: 'blur'}],
                    using:[{required: true,message: '请选择是否启用', trigger: 'blur'}],
                },
            }
        },
        methods:{
            /**打开弹框*/
            openDialog(){
                this.dialogVisible = true;
            },
            /**保存*/
            save(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.mainDataForm.category = this.category;
                        this.$axios.post("/biz/BizDevChildTypeProperty/saveOrUpdate",this.mainDataForm).then(success=>{
                            this.$message.success("保存成功");
                            this.dialogVisible = false;
                            this.isSuccess();
                        }).catch(error=>{
                            this.$message({
                                type:'error',
                                message:error.msg
                            })
                        })
                    }
                });
            },
            /**关闭*/
            closeDialog(){
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
        }
    }
</script>

<style scoped>
    .outer {
        width: 100%;
        height: 260px;
        position: relative;
        overflow: hidden
    }

    .inner {
        position: absolute;
        right: -20px;
        width: 100%;
        overflow-y: scroll;
        overflow-x: hidden;
        max-height: 260px
    }
</style>