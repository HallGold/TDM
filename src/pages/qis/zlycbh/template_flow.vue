<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign">

            <div style="height: 500px;" slot-scope="flowScope">
                <el-tabs v-model="activeName"  type="border-card">
                    <el-tab-pane label="业务表单" name="first">
                        <el-form :model="bizdata" status-icon ref="form" :rules="rules" >
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="流程模板" label-width="140px" prop="cgname">
                                        <el-input v-model="bizdata.cgname" placeholder="请输入"   autocomplete="off" :disabled="flowScope.formReadonly" ></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"  autocomplete="off" :disabled="flowScope.formReadonly"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="项目起始时间" label-width="140px" prop="xmdateStart">
                                        <el-date-picker v-model="bizdata.xmdateStart" type="datetime" placeholder="请选择日期"  autocomplete="off" :disabled="flowScope.formReadonly" ></el-date-picker>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="24">
                                    <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                        <el-input v-model="bizdata.dateRemark"  type = "textarea"  autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                    </el-form-item>
<!--                                    <el-form-item label="附件" label-width="140px" prop="fj">-->
<!--                                        <ice-single-upload :fileData="fileInfo" v-model="fileInfo.dataid"-->
<!--                                                           :on-success="fileUploadSuccess" ref="fileUpload"></ice-single-upload>-->
<!--                                    </el-form-item>-->
                                </el-col>

                            </el-row>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="附件上传" name="first2">
                        <ATTACHMENT :is-handleer="isHandleer" :data="attaTableData" ref="attachment"></ATTACHMENT>
                    </el-tab-pane>
                </el-tabs>
            </div>

        </ice-flow-form>
    </div>
</template>

<script>
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";

    export default {
        name: "template_flow",
        components:{
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            isLetterAndNumber,
            IceSelect,
            IceGridLayout,

        },
        created(){

        },
        computed:{

        },
        data(){
            return{
                activeName :'first',
                attaTableData:[],
                isHandleer:true,
                //有点击选择的输入框给个默认的空值，如：xmname
                bizdata: {xmname:'', dataSecretLevcode:'2'},
                rules:{
                    // xmname: [
                    //     {required: true, message: '项目不能为空'}
                    // ],
                },
            }
        },
        methods:{
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                // console.log(this.$refs.flowForm.flowInstData)
                // let flowData = this.$refs.flowForm.flowInstData;
                // let bizData;
                // if(flowData.proOperates != null){
                //     bizData = JSON.parse(flowData.currentBizData.bizData);
                //     this.bizdata = bizdata
                // }else {
                //     this.get(this.oid)
                //     this.getHtFjData(this.oid)
                // }
                Object.assign(this.bizdata,bizdata);
                //驳回才能编辑
                // this.editable(flowData.proOperates);
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                // let isContinue = false;
                // this.$refs.form.validate((valid) => {
                //     if(!valid)return;
                //     flowContext.processVar={money:5000};
                //     isContinue = true;
                // });
                // if(isContinue)
                //     return true
                // else
                //     return false
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                // this.bizdata.xtFjs = this.$refs.attachment.getData();
                return this.bizdata;
            },
        },
    }
</script>

<style scoped>

</style>