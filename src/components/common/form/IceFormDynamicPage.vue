<template>
    <ice-flow-form :flow-ready="flowReady" :twoTabName="twoTabName" :flow-operate-btn="flowOperateBtn" :flow-biz-data="flowBizData">
        <ice-dynamic-page ref="dynamicPage" :pageId="pageId">

        </ice-dynamic-page>
    </ice-flow-form>
</template>

<script>
    import IceFlowForm from "../base/IceFlowForm";

    export default {
        name: "IceFormDynamicPage",
        methods: {
            flowReady(flowContext, bizdata, flowNodes) {
                this.$refs.dynamicPage.setFormData(bizdata);
                this.$refs.dynamicPage.setFlowContext(flowContext);
            },
            flowOperateBtn(flowContext, bizdata) {
                return this.$refs.dynamicPage.flowOperateBtn(flowContext);
            },
            flowBizData() {
                return this.$refs.dynamicPage.getFormData();
            },
            pageDataLoader() {
                return {};
            }
        },
        props: {
            twoTabName:String,
            pageId: String
        },
        components: {IceFlowForm}
    }
</script>

<style scoped>

</style>