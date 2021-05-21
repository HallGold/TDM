<template>
    <div>
        <el-card header='页面基本信息' class="card">
            <!--<div>-->
            <ice-label name="页面名称" :required="true" :need-valid="false">
                <el-input v-model="pageInfo.pageName"/>
            </ice-label>
            <ice-label name="页面KEY" :required="true" :need-valid="false">
                <el-input v-model="pageInfo.pageCode"/>
            </ice-label>
            <ice-label name="是否流程页面" :need-valid="false">
                <el-checkbox v-model="pageInfo.isFlowPage" true-label="1" false-label="0"/>
            </ice-label>
            <ice-label name="所属APP" :required="true" :need-valid="false">
                <ice-select map-type-code="FlowType" v-model="pageInfo.appCode"
                            :text.sync="pageInfo.appName"></ice-select>
            </ice-label>

            <ice-label name="所属模块" :required="true" :need-valid="false">
                <ice-select map-type-code="FlowType" v-model="pageInfo.moduleCode"
                            :text.sync="pageInfo.moduleName"></ice-select>
            </ice-label>

            <ice-label name="页面描述" :need-valid="false">
                <el-input
                        v-model="pageInfo.pageDesc"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入内容">
                </el-input>

            </ice-label>
            <ice-label name="版本号" :need-valid="false">
                <el-input v-model="pageInfo.pageVersion" readonly/>
            </ice-label>
            <!--</div>-->
        </el-card>

        <el-card header='页面事件维护' class="card">
            <!--<div>-->
            <ice-label name="dataLoader" :need-valid="false" v-if="pageInfo.isFlowPage!=='1'">
                <script-editor v-model="pageInfo.dataLoader" :init-script="`(async function(pageId){

    let {result} = await this.$axios.get('/');

    return result;

})`"></script-editor>
            </ice-label>

            <ice-label name="dataInBound" :need-valid="false" v-if="pageInfo.isFlowPage=='1'">
                <script-editor v-model="pageInfo.dataInBound" :init-script="`(function(bizData){

    //用于表单数据加载时，将表单数据转换为页面数据
    return bizData;

})`"></script-editor>
            </ice-label>
            <ice-label name="dataOutBound" :need-valid="false" v-if="pageInfo.isFlowPage=='1'">
                <script-editor v-model="pageInfo.dataOutBound" :init-script="`(function(formData){

    //用于提交表单时，将页面数据转换为表单数据
    return formData;

})`"></script-editor>
            </ice-label>

            <ice-label name="flowOperate" :need-valid="false" v-if="pageInfo.isFlowPage=='1'">
                <script-editor v-model="pageInfo.flowOperate" :init-script="`(function(flowContext){

    //用于提交表单时，根据按钮类型不同，校验不同数据
    return true;

})`"></script-editor>
            </ice-label>

            <ice-label name="pageOnload" :need-valid="false"  v-if="pageInfo.isFlowPage!=='1'">
                <script-editor v-model="pageInfo.pageOnload" init-value-model="function"></script-editor>
            </ice-label>
            <ice-label name="dataOnload" :need-valid="false"  v-if="pageInfo.isFlowPage!=='1'">
                <script-editor v-model="pageInfo.dataOnload" init-value-model="function"></script-editor>
            </ice-label>
        </el-card>
        <div style="height: 10px"></div>
    </div>
</template>

<script>
    import IceLabel from "../../base/IceLabel";
    import IceSelect from "../../base/IceSelect";
    import ScriptEditor from "./ScriptEditor";

    export default {
        name: "PageInfoEditor",
        props: {
            value: Object
        },
        data() {
            return {
                pageInfo: {
                    pageName: '',
                    pageCode: '',
                    appCode: '',
                    isFlowPage: false,
                    appName: '',
                    moduleCode: '',
                    moduleName: '',
                    pageDesc: '',
                    pageVersion: 1,
                    dataLoader: '',
                    pageOnload: '',
                    dataOnload: ''
                }
            }
        },
        methods: {},
        computed: {},
        watch: {
            value: {
                handler(newValue, oldValue) {

                    if (newValue) {
                        this.pageInfo = newValue
                    }

                },
                //deep: true,
                immediate: true
            },
            pageInfo: {
                handler(newValue, oldValue) {
                    //console.log(newValue)
                    this.$emit("change", newValue)
                },
                deep: true,
                // immediate: true

            }
        },
        mounted() {

        },
        components: {ScriptEditor, IceSelect, IceLabel}
    }

</script>


<style scoped>

</style>
