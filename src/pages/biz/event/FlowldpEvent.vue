<template>
    <div class="form-content" @valited="">
        <ice-form-dynamic-page pageId="auto_event_test"></ice-form-dynamic-page>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout.vue";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import IceFormDynamicPage from "../../../components/common/form/IceFormDynamicPage";

    export default {
        name: "FlowFormTets",
        data() {
            return {
                columns: [],
                selector: '',
                rules: {
                    typeDesc: [{required: true}],
                    bpmDefName: [{required: true}]
                },
                callActTransmitVar: {b: 8},
                options: [],
                bizdata: {main: {}, chlie: {}},
                optionsSoftware: [],
                defult: {
                    value: 'oid',
                    label: 'classifyName',
                    children: 'children'
                },
                fileList: []
            }
        },
        methods: {
            extend1(flowContext, bizdata) {
                alert(11)
            },
            flowReady(flowContext, bizdata) {
                // flowContext.actDefName="天丁标题";
                Object.assign(this.bizdata, bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getbizdata()))
            },
            flowOperateBtn(flowContext, bizdata) {
                flowContext.processVar = {a: 18};
                return true;
            },
            /**软件类别---选择不同的值时加载不同的--所属分类*/
            softwareType() {
                alert("待接口");

            },
            flowbizdata() {
                this.bizdata.specialPerson22 = "tianding,lihuan";
                this.bizdata.specialPerson4 = "huangcm130100";
                return this.bizdata;
            },
            beforeUpload(file) {
                if (this.fileList.length >= 1) {
                    return;
                }
                let obj = {}
                obj.name = file.name;
                obj.url = "https://jsonplaceholder.typicode.com/posts/" + file.uid;
                this.fileList.push(obj);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${file.name}？`).then(() => {
                    this.fileList.splice(0, 1);
                });
            }
        },
        computed: {},
        watch: {},
        mounted() {
            this.$axios.get("/biz/BizSoftwareClassify/tree").then(success => {
                this.optionsSoftware = success.data[0].children;
                /*for(let i=0;i<this.optionsSoftware;i++){

                }*/
            }).catch(error => {
            })
        },
        components: {
            IceFormDynamicPage,
            IceImageUploader,
            IceTreeGrid,
            IcePopSelector,
            IceFlowForm,
            IceGridLayout
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

    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;

    }

    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;

        height: 90px;
        width: 63%;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;

    }

    .file-uploader .text {
        color: blue;

    }

    .el-upload__input {
        height: 0px;
        width: 100px;

    }
</style>
