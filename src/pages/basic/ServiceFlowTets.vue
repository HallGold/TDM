<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :inst-process-var="instProcessVar" :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-form :model="flowScope.bizdata" :rules="rules" ref="definition" label-width="140px">

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
                        <el-form-item label="测试的" prop="typeDesc">
                            <ice-persion-selector
                                    v-model="bizdata.typeDesc"
                                    text-prop="name"
                                    code-prop="code"
                                    choose-item="multiple"
                                    @select-confirm="selectConfirm">
                            </ice-persion-selector>
                        </el-form-item>

                        <el-form-item label="流程类型" prop="typeDesc">
                            <el-input v-model="bizdata.typeDesc" autocomplete="off"
                                      :disabled="flowScope.formReadonly">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="状态" prop="statusDes">
                            <el-input v-model="bizdata.statusDes"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="流程KEY" prop="actDefKey">
                            <el-input v-model="bizdata.actDefKey"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>

                        <el-form-item label="流程名称" prop="bpmDefName">
                            <el-input v-model="bizdata.bpmDefName"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>

                        <el-form-item label="流程描述" prop="bpmDescribe" layout="2">
                            <el-input type="textarea" v-model="bizdata.bpmDescribe"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>

                        <el-form-item label="修改时间" prop="updateDate">
                            <el-input v-model="bizdata.updateDate"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="修改人" prop="updateUser">
                            <el-input v-model="bizdata.updateUser"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="流程版本" prop="prossversion">
                            <el-input-number v-model="bizdata.a"></el-input-number>
                        </el-form-item>

                        <el-button type="text"
                                   @click.prevent.stop="look(bizdata.fileId)"
                                   class="el-icon-view">下载查看</el-button>

                        <el-form-item label="指定部门" prop="specialOrganization">
                            <el-input v-model="bizdata.specialOrganization"></el-input>
                        </el-form-item>

                        <ice-single-upload style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;"
                                           :progress="progress"
                                           :on-success="success"
                                           :beforeUpload="uploadBeforeUpload"
                                           v-model="bizdata.fileId"
                                           ref="uploader"
                                           v-if="!flowScope.formReadonly">
                            <el-button type="text" class="el-icon-upload2">重新上传</el-button>
                        </ice-single-upload>

                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../components/common/base/IceGridLayout.vue";
    import IcePersionSelector from "../../components/common/biz/IcePersionSelector.vue";
    import IceSingleUpload from "../../components/common/base/IceSingleUpload";


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
            look(id){
                this.$downloadFile(id);
            },
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            uploadBeforeUpload(file){
                this.percent = 0;
                this.uploading = true;
                this.bizdata.softwareInfoList[0].fileMD5 = file.md5;
            },
            success(response, file, fileList) {
                console.log(response);
                this.percent = 100;
                this.$refs.uploader.reset();
                this.bizdata.softwareInfoList[0].softSize = file.size;
                //this.bizdata.softwareInfoList[0].softSizeKb = fileUtil.fileSizeFormat(file.size);
                this.filename = file.name;
                if (!this.bizdata.softwareInfoList[0].softName) {
                    // 如果没有软件名称,自动将文件名设置成软件名
                    file.name = file.name.substring(0, file.name.lastIndexOf('.'));
                    this.bizdata.softwareInfoList[0].softName = file.name.substring(0, 30);
                }
                this.bizdata.fileId = response.data;

            },
            flowReady(flowContext, bizdata) {
                //Object.assign(this.bizdata,bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getBizData()))
            },
            async flowOperateBtn(flowContext, bizdata) {


                flowContext.processVar={a:10,ab12:1001,ab1:2};
               //  return true;
               // this.$axios.get
                return true;
            },
            flowBizData() {
                this.bizdata.childBizData={
                    "lihuan":{"flow":"子流程","afUserCode":"lihuan"},
                };

                return this.bizdata;
            },
            selectConfirm(rows, label) {
                this.selector = label
                console.log(rows)
            },
            selectCannel() {

            }
        },
        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },
        components: {
            IceSingleUpload,
            IceTreeGrid,
            IcePopSelector,
            IceFlowForm,
            IcePersionSelector,
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
</style>
