<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="width: 90%;margin: 0 auto;padding: 10px 20px;border: 1px solid #ddd;" slot-scope="flowScope">
                <xm-form ref="xmform" :flowScope="(terminateOrNot || suspendOrNot)?{formReadonly: true, flowScope: flowScope}: flowScope" :judgeType="judgeType"
                        ></xm-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import XmForm from './components/XmForm'


    import {mapGetters, mapMutations} from 'vuex'

    export default {
        name: "flowxminfo",
        data() {
            return {
                judgeType: 2
            }
        },
        computed: {
            // 行数据id
            rowDataId() {
                if (this.$route.query.oid) {
                    return this.$route.query.oid
                } else {
                    return '';
                }
            },
            suspendOrNot() {
                return this.$route.query.suspendOrNot ? true : false;
            },
            terminateOrNot() {
                return this.$route.query.terminateOrNot ? true : false;
            },
        },
        created() {

        },
        methods: {
            flowReady(flowContext, bizdata) {
                //流程初始化
                // Object.assign(this.bizdata,bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getBizData()))
                console.log(bizdata, 'bizdata')
                let flowData = this.$refs.flow.flowInstData;
                if (flowData.proOperates != null) {
                    this.$refs.xmform.handleCallbackFlow(bizdata);
                } else {
                    if (this.rowDataId) {
                        this.$refs.xmform.dbClick(this.rowDataId);
                    }

                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return this.$refs.xmform.getyzResult();
            },
            flowBizData() {
                // 传递数据整合
                //获取业务表单数据  formModel 传给控件处理
                // console.log(this.$refs.xmform.getData())
                // return
                //   console.log(this.$refs.xmform.getData());

                return this.$refs.xmform.getData();
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                this.$refs.xmform.handleCallbackFlow(data);
            },
        },
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },
        components: {
            IceFlowForm,
            XmForm
        }
    }
    /**
     * 流程数据提交验证
     * 申请人。。。没有加载出来
     * 流程保存
     */

</script>


<style scoped>

</style>
