<template>
    <el-dialog v-dialogDrag
               title="服务信息维护"
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
                         :disabled="!isEdit"
                         style="margin-top: 15px"
                         label-width="100px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="服务名称" prop="serviceName">
                                <el-input v-model="mainDataForm.serviceName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务类型" prop="serviceType">
                                <ice-select v-model="mainDataForm.serviceType"
                                            @change="$nextTick(()=>{$refs.form.validateField('serviceType',error=>{})})"
                                            map-type-code="serviceType">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="内部服务" prop="isInner">
                                <el-checkbox v-model="mainDataForm.isInner"
                                             true-label='1'
                                             false-label='0'></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="外部服务" prop="isOuter">
                                <el-checkbox v-model="mainDataForm.isOuter"
                                             true-label='1'
                                             false-label='0'></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="服务Url" prop="serviceUrl">
                                <el-input v-model="mainDataForm.serviceUrl"
                                          type="textarea" rows="2"
                                          maxlength="100" disabled></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="服务描述" prop="remark">
                                <el-input v-model="mainDataForm.remark"
                                          type="textarea" rows="3"
                                          maxlength="256"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
        <div class="ice-button-bar ">
            <el-button type="primary" @click="save" v-if="isEdit" unauth>保存</el-button>
            <el-button type="info" @click="closeDialog" unauth>取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        name: "serviceInformationEdit",
        components: {IceSelect},
        props: {
            isEdit: {//是否为编辑状态
                type: Boolean,
                default: true
            },
            serviceId: {
                type: String
            },
            isSuccess:Function
        },
        data() {
            return {
                dialogVisible: false, //弹窗的开关属性
                mainDataForm: {
                    oid: '',
                    serviceCode: '',
                    serviceName: '',
                    serviceType: 'B10',
                    serviceUrl: '',
                    logEnabled: 'Y',
                    logLevel: 'INFO',
                    logTemplate: '',
                    isInner: '0',
                    isOuter: '1',
                    funcAuthEnabled: 'Y',
                    dataAuthEnabled: 'Y',
                    isSystem: 'N',
                    isEnabled: 'Y',
                    remark: '',
                    updateStatus: '20',
                    version: '1'

                },
                formRules: {//表单字段验证规则
                    serviceName:[{required:true,whitespace:true,message:'请输入服务名称',trigger:'blur'}],
                    serviceType:[{required:true,message:'请选择服务类型',trigger:'change'}],
                    serviceUrl:[{required:true,message:'选输入服务url',trigger:'blur'}]
                }
            }
        },
        methods: {
            /**
             * 弹窗关闭
             */
            closeDialog() {
                this.resetForm();
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(serviceOid) {
                if (serviceOid == '' || !serviceOid) {
                    return;
                }
                this.$axios.get("/permission/res/service/outer/get_baseinfo_byid", {
                    params: {"serviceId": serviceOid}
                })
                    .then(result => {
                        this.mainDataForm = result.data;
                        this.mainDataForm.isInner = result.data.isInner ? '1' : '0';
                        this.mainDataForm.isOuter = result.data.isOuter ? '1' : '0';
                        this.dialogVisible = true;
                    }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                    this.closeDialog();
                });

            },
            /**
             * 保存
             */
            save() {
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.$axios.post("/permission/res/service/outer/save_res_base_info", this.mainDataForm)
                            .then(success => {
                                this.$message.success("保存成功");
                                this.closeDialog();
                                this.isSuccess();
                            }).catch(error => {
                            this.$message.error(error.msg ? error.msg : '操作出错了');
                        });
                    }
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
