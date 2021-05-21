<template>
    <div>
        <slot :bizdata="bizdata" :flowcontext="{flowInstData:flowInstData}" :isAuthor="isAuthor"
              :formReadonly="formReadonly" :isEndNode="isEndNode">
            <h1>申请信息</h1>
        </slot>
        <div>
            <div class="shr">处理意见</div>
            <el-timeline class="shyj">
                <el-timeline-item v-for="(item, index) in operateDataList"
                                  :key="item.oid" color="#0bbd87"
                                  :timestamp="new Date(item.operateTime).toLocaleString()"
                                  v-if="item.operateKey!='save'&&item.opinion!=null&&item.opinion!=''">
                    {{item.nodeName}}：{{item.operaterName}}
                    {{item.opinion==null?'':'-'+item.opinion}}
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>

<script>
    import emitter from "element-ui/src/mixins/emitter";
    import IceFlowFormJs from "./IceFlow/IceFlowForm";

    export default {
        name: "IceFlowCard",
        props: {
            dataId: String
        },
        mixins: [emitter, IceFlowFormJs]
    }
</script>

<style scoped>

</style>