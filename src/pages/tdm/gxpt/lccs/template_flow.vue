<template>
    <div class="ice-container">
        <ice-flow-form  v-if="isShow" name valiate ref="flowForm" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign">


        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";

    export default {
        name: "template_flow",
        components:{
            IceFlowForm,
            IceDialog,
            IceSelect,
            IceGridLayout,
        },
        created(){

        },
        computed:{

        },
        data(){
            return{
                isShow:true,
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
                Object.assign(this.bizdata,bizdata);
                //驳回才能编辑
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                return true;
            },
            flowBizData() {
                //获取业务表单数据
                return this.bizdata;
            },
        },
    }
</script>

<style scoped>

</style>