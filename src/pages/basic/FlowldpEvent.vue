<template>
    <div class="form-content" @valited="">
        <ice-form-dynamic-page :twoTabName="twoTabName"></ice-form-dynamic-page>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../components/common/base/IceGridLayout.vue";
    import IceImageUploader from "../../components/common/base/IceImageUpload";
    import IceFormDynamicPage from "../../components/common/form/IceFormDynamicPage";

    export default {
        name: "FlowFormTets",
        data() {
            return {
                twoTabName:"实施信息"
            }
        },
        methods: {
            extend1(flowContext,bizdata){
                alert(11)
            },
            beforeUpload(file){

            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件`);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`).then(()=>{
                    this.fileList.splice(0,1);
                });
            }
        },
        computed: {},
        watch: {},
        mounted() {

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
        height:0px;
        width: 100px;

    }
</style>
