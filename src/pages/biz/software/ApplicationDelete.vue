<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flowReady="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rules" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人" label-width="100px" prop="afUserName">
                            <el-input v-model="mainData.afUserName" disabled placeholder="申请人"></el-input>
                        </el-form-item>

                        <el-form-item label="部门" label-width="100px" prop="afDepartmentName">
                            <el-input v-model="mainData.afOrgName+'-'+mainData.afDepartmentName" disabled placeholder="部门"></el-input>
                        </el-form-item>

                        <el-form-item label="电话" label-width="100px" prop="afPhone">
                            <el-input v-model="mainData.afPhone" disabled placeholder="电话"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="1" name="软件信息">
                        <el-table :data="mainData.details" style="width: 100%">
                            <el-table-column prop="softName"
                                             label="软件名称"
                                             >
                            </el-table-column>
                            <el-table-column prop="softVersion"
                                             label="软件版本"
                                             >
                            </el-table-column>
                            <el-table-column prop="classifyNamePath"
                                             label="所属分类"
                                             >
                            </el-table-column>
                        </el-table>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="申请原因">
                        <el-form-item label="申请原因" label-width="80px" prop="afReason" layout="3">
                            <el-input :disabled="flowScope.formReadonly" :showWordLimit="true" maxlength="128"
                                      placeholder="填写内容不超过128个字" rows="3" type="textarea"
                                      v-model="mainData.afReason"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="禁用级别">
                        <el-form-item label="禁用级别" label-width="80px" prop="phone" layout="3">
                            <el-checkbox :disabled="flowScope.formReadonly" v-model="mainData.typeCheck" :checked="mainData.typeCheck">彻底删除</el-checkbox>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";

    export default {
        name: "ApplicationDelete",
        components: {IceFlowForm, IceGridLayout},
        data(){
            return{
                mainData:{'details':[],type:"INVALID",afReason:'',typeCheck:false},
                rules:{
                    afReason:[{required: true,whitespace: true, message: '请输入申请原因', trigger: 'blur'}]
                },
            }
        },
        methods:{
            flowReady(flowcont, bizdata){
                Object.assign(this.mainData, bizdata);
                let id = this.$route.query['ids'];
                if (id&&!bizdata.oid){
                    this.$axios.get("/biz/BizSoftwareInfo/gets", {params: {ids: id}})
                        .then(result => {
                            let details = [];
                            result.data.forEach(item=>{
                                details.push({
                                    'softwareId':item.oid,
                                    'classifyId':item.classifyId,
                                    'classifyIdPath':item.classifyIdPath,
                                    'classifyNamePath':item.classifyNamePath,
                                    'softRegion':item.softRegion,
                                    'keywords':item.keywords,
                                    'softName':item.softName,
                                    'softIconId':item.softIconId,
                                    'softVersion':item.softVersion,
                                    'softDescribe':item.softDescribe,
                                    'softSize':item.softSize,
                                    'useWay':item.useWay,
                                    'fileId':item.fileId,
                                    'downloadAuth':item.downloadAuth,
                                    'fromYon':item.fromYon
                                });
                            });
                            this.$set(this.mainData, "details", details);
                        })
                }

            },
            flowBizData() {
                if(this.mainData.typeCheck){
                    this.mainData.type="DELETE";
                }else{
                    this.mainData.type="INVALID";
                }
                return this.mainData;
            },
            flowOperateBtn(flowContext,bizdata){
                if(flowContext.operateType == 'save'){
                    return true;
                }

                let isTrue = false;
                this.$refs['bizForm'].validate((valid) => {
                    isTrue = valid;
                })
                if(isTrue){
                    let softRegion = this.mainData.details.find(item=>{return item.softRegion == 0})?0:1;
                    // this.mainData.details.forEach(item=>{
                    //     if(item.softRegion == 0){
                    //         softRegion = 0;
                    //         return;
                    //     }
                    // });
                    flowContext.processVar = {
                        softRegion: softRegion
                    };
                }
                return isTrue;
            }
        }
    }
</script>

<style scoped>
    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>