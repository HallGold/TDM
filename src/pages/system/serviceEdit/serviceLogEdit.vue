<template>
    <el-dialog v-dialogDrag
               title="日志配置维护"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="750px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
        <div class="outer">
            <div class="inner">
                <el-form :model="mainDataForm"
                         :rules="formRules"
                         ref="form"
                         style="margin-top: 15px"
                         label-width="100px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="是否启用日志" prop="logEnabled">
                                <el-checkbox v-model="mainDataForm.logEnabled"
                                             true-label="Y"
                                             false-label="N"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="选择日志模板" prop="logtemplId">
                                <el-select v-model="mainDataForm.logtemplId">
                                    <el-option label="模板一" value="1"></el-option>
                                    <el-option label="模板二" value="2"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="自定义模板" prop="logTemplate">
                                <el-input v-model="mainDataForm.logTemplate"
                                          type="textarea" rows="5"
                                          maxlength="256"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save" unauth>保存</el-button>
            <el-button type="info" @click="closeDialog" unauth>取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "serviceLogEdit",
        props:{
            mainDataForm:{},
            isSuccess:Function
        },
        data(){
            return{
                dialogVisible:false, //弹窗的开关属性
                formRules:{//表单字段验证规则

                }
            }
        },
        methods:{
            /**
             * 弹窗关闭
             */
            closeDialog(){
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(){
                this.dialogVisible = true;
            },
            /**
             * 保存
             */
            save(){
                this.$axios.post("/permission/res/service/outer/save_res_base_info",this.mainDataForm).then(success=>{
                    this.$message.success("保存成功");
                    this.closeDialog();
                    this.isSuccess();
                }).catch(error=>{
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            resetForm(){
                this.$refs.form.resetFields();
            }
        }
    }
</script>

<style scoped>

</style>
