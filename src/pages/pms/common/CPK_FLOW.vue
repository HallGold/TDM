<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="flowScope.bizdata" status-icon :rules="rules" ref="definition" label-width="140px">

                    <ice-grid-layout :columns="2" name="申请人">
                        <el-form-item label="申请人" prop="typeDesc">
                            <el-input v-model="bizdata.typeDesc" autocomplete="off"
                                      :disabled="flowScope.formReadonly">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="statusDes">
                            <el-input v-model="bizdata.statusDes"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    
                    
                    <ice-grid-layout :columns="2" name="业务表单">

                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="产品名称" label-width="100px" prop="cpName">
                                    <el-input v-model="bizdata.cpName" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编码" label-width="100px" prop="cpCode">
                                    <el-input v-model="bizdata.cpCode" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="材料" label-width="100px" prop="cpCl">
                                    <el-input v-model="bizdata.cpCl" :disabled="flowScope.formReadonly" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="规格" label-width="100px" prop="cpGg">
                                    <el-input v-model="bizdata.cpGg" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                    <ice-select v-model="bizdata.dataSecretLevcode" :disabled="flowScope.formReadonly"  map-type-code="DATA_SECRET_LEVEL"></ice-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="24">
                                <el-form-item label="备注" label-width="100px" prop="dateRemark">
                                    <el-input type="textarea" placeholder="不超过650个字" maxlength="650"
                                              show-word-limit :disabled="flowScope.formReadonly" v-model="bizdata.dateRemark"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";


    export default {
        name: "FlowFormTets",
        data() {
            return {
                percent: 0,
                columns: [],
                selector: '',
                bizdata: {a: 0,softwareInfoList:[{"fileMD5":"123456"}]},
                instProcessVar: {a: 10},
                rules: {
                    typeDesc: [{required: true}],
                    bpmDefName: [{required: true}]
                }
            }
        },
        methods: {
            flowReady(flowContext, bizdata) {
                //流程初始化
                Object.assign(this.bizdata,bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getBizData()))
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                return this.bizdata;
            }
        },
        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },
        components: {
            IceFlowForm,
            IceGridLayout
        }
    }

</script>


<style scoped>

</style>
