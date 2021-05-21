<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign">

            <div style="height: 500px;margin-top:15px;" slot-scope="flowScope">
                <div style="padding: 0 20px;">
                    <file-common :flowScope="{formReadonly: true}" :assignmentData="dataFwg" :oid-type="oidType"></file-common>
                </div>
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
    import fileCommon from './fileCommon'

    export default {
        name: "template_flow",
        components: {
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            isLetterAndNumber,
            IceSelect,
            IceGridLayout,
            fileCommon


        },
        created() {

            this.dataFwg = this.dataFwgParams;
            console.log(this.dataFwg, 'data')
            this.oidType = this.dataFwg[0].oidType;
        },
        computed: {
            dataFwgParams() {
                return this.$route.params.data ? this.$route.params.data : []
            }
        },
        data() {
            return {
                activeName: 'first',
                attaTableData: [],
                isHandleer: true,
                //有点击选择的输入框给个默认的空值，如：xmname
                bizdata: {xmname: '', dataSecretLevcode: '2'},
                rules: {
                    // xmname: [
                    //     {required: true, message: '项目不能为空'}
                    // ],
                },
                dataFwg: this.dataFwgParams,
                oidType: ''
            }
        },
        watch: {
            dataFwgParams () {
                this.dataFwg =  this.dataFwgParams;
                this.oidType = this.dataFwg[0].oidType;
            }
        },
        methods: {
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'biz')
                //流程初始化
                if (bizdata.oid) {
                    this.dataFwg = bizdata.fileinfoVoList;
                    this.oidType = bizdata.fileinfoVoList[0].oidType;
                    console.log(this.dataFwg, '20200288')
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                let obj = {
                    fileinfoVoList: this.dataFwg
                }
                console.log(obj);
                return obj;
            },
        },
    }
</script>

<style scoped>

</style>
