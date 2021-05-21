<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-main style="padding: 20px 20px;">
                    <el-form :model="bizdata" :rules="rules" ref="form">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="型号" label-width="100px" prop="xh">
                                    <el-input maxlength="65" v-model="bizdata.xh" :disabled="flowScope.formReadonly"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="100px" prop="dataSecretLevcode">
                                    <ice-select :disabled="flowScope.formReadonly" v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL">
                                    </ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="责任单位" label-width="100px" prop="zrdw">
                                    <ice-dept-selector   chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                        v-model="bizdata.zrdw"
                                                        @select-confirm="depts=>bizdata.zrdwCode=depts[0].deptCode">
                                    </ice-dept-selector>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="处理期限" label-width="100px" prop="clqx">
                                    <el-date-picker :disabled="flowScope.formReadonly"  v-model="bizdata.clqx"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="问题描述" label-width="100px" prop="wtms">
                                    <el-input type="textarea" :disabled="flowScope.formReadonly"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.wtms"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="原因分析" label-width="100px" prop="yyfx">
                                    <el-input type="textarea" :disabled="flowScope.formReadonly"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.yyfx"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="纠正措施" label-width="100px" prop="jzcs">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.jzcs"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="所审查意见" label-width="100px" prop="scyj">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.scyj"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="纠正措施效果" label-width="100px" prop="jzcsxg">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.jzcsxg"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="有效性验证" label-width="100px" prop="yxxyz">
                                    <el-input :disabled="flowScope.formReadonly" type="textarea"
                                              placeholder="不超过330个字" maxlength="330" show-word-limit height="200px" v-model="bizdata.yxxyz"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-main>
            </div>
        </ice-flow-form>
        <ice-dialog title="部门选择" :visible.sync="visibleBm" width="500px">
            <ice-custom-tree Width="480px" :unbrid="unbrid" :transfer="transfer.treeData" @handleCallback="handleCallbackTree"></ice-custom-tree>
        </ice-dialog>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceSelect from "../../../components/common/base/IceSelect";
    import {isLetterAndNumber} from "@/pages/biz/js/Validator";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import IceDialog from "@/components/common/base/IceDialog";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";

    export default {
        data() {
            return {
                visibleBm:false,
                unbrid:true,
                bizdata: {
                    oid: '',
                    oidZrdw:'',
                    xh: '',
                    zrdw: '',
                    clqx: '',
                    wtms: '',
                    yyfx: '',
                    jzcs: '',
                    scyj: '',
                    jzcsxg: '',
                    dataSecretLevcode: '',
                    yxxyz: '',
                },
                rules: {
                    dataSecretLevcode:[{required: true}],
                    xh: [
                        {required: true, whitespace: true, message: '请填写型号', trigger: 'change'}
                    ],
                    clqx: [
                        {required: true, message: '请选择处理期限', trigger: 'change'}
                    ],
                    zrdw: [
                        {required: true, whitespace: true, message: '请选择责任单位', trigger: 'change'}
                    ],
                    wtms: [
                        {whitespace: true, message: '请填写问题描述', trigger: 'blur'}
                    ],
                    yyfx: [
                        {whitespace: true, message: '请填写负责人', trigger: 'blur'}
                    ],
                    jzcs: [
                        {whitespace: true, message: '请填写纠正错误', trigger: 'blur'}
                    ],
                    scyj: [
                        {whitespace: true, message: '请填写所审查意见', trigger: 'blur'}
                    ],
                    jzcsxg: [
                        {whitespace: true, message: '请填写纠正错误效果', trigger: 'blur'}
                    ],
                    yxxyz: [
                        {whitespace: true, message: '请填写有效验证性', trigger: 'blur'}
                    ]
                },
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/permission/frame_org/load_table_tree?loadDisabled=false',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'deptName',
                            children: 'children'
                        },
                        nodeKey: 'oid',
                        // 请求传递参数
                        initModel: {

                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
            }
        },
        methods: {
            showDw(){
                this.visibleBm = true;
            },
            flowReady(flowContext, bizdata) {
                //流程初始化编辑赋值
                if (bizdata.oid) {
                    this.bizdata = bizdata;
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                let sts
                this.$refs.form.validate((valid) => {
                    if(!valid){
                        sts = false
                    }else{
                        sts = true
                    }
                })
                return sts
            },
            flowBizData() {
                return this.bizdata
            },
            //部门树
            handleCallbackTree(data){
                this.bizdata.zrdw = data.deptName;
                this.bizdata.zrdwcode = data.deptCode;
                if(data.deptName != '三所'){
                    this.visibleBm = false;
                }
            },
        },
        created() {

        },
        components: {
            IceCustomTree,
            IceDeptSelector,
            IceFlowForm,
            IceSelect,
            IceQueryGrid,
            IceDialog
        }
    }

</script>


<style scoped>

</style>
