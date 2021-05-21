<template>
    <div class="form-content" @valited="">
       <!-- <ice-flow-form name valiate   :call-act-transmit-var="callActTransmitVar" :flow-biz-data="flowbizdata"
                       :flow-ready="flowReady" :btn-extend1="extend1" :flow-operate-btn="flowOperateBtn">
            <div slot-scope="flowScope">
                <el-form :model="bizdata" status-icon :rules="rules" ref="definition" label-width="100px">
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人" prop="typeDescPe" label-width="70px">
                            <el-input v-model="bizdata.typeDescPe" autocomplete="off"
                                      :disabled="flowScope.formReadonly">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="statusDes">
                            <el-input v-model="bizdata.statusDes"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="statusDes">
                            <el-input v-model="bizdata.statusDes"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="软件详情">
                        <el-form-item label="软件名称" prop="typeDescName" label-width="70px">
                            <el-input v-model="bizdata.typeDescName" autocomplete="off"
                                      :disabled="flowScope.formReadonly">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="软件类别" prop="statusDes">
                            <el-cascader
                                    :options="optionsSoftware"
                                    :props="defult"
                                    change-on-select></el-cascader>
                            &lt;!&ndash;<el-select placeholder="请选择" v-model="bizdata.softwareType" @change="softwareType">
                                <el-option
                                        v-for="item in optionsSoftware"
                                        :key="item.oid"
                                        :label="item.classifyName"
                                        :value="item.oid">
                                </el-option>
                                &lt;!&ndash;<el-option label="白名单" value="11"></el-option>
                                <el-option label="专用软件" value="22"></el-option>
                                <el-option label="运维专用软件" value="33"></el-option>&ndash;&gt;
                            </el-select>&ndash;&gt;
                        </el-form-item>
                        <el-form-item label="所属分类" prop="classType">
                            <el-cascader
                                    placeholder="可以搜索哦"
                                    :options="options"
                                    filterable
                                    change-on-select
                            ></el-cascader>
                        </el-form-item>

                        <el-form-item label="软件级别" prop="className" v-if="false" label-width="70px">
                            <el-select placeholder="请选择" v-model="bizdata.className">
                                <el-option label="院级" value="1"></el-option>
                                <el-option label="所级" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="软件级别" prop="className" v-if="true" label-width="70px">
                            <el-select placeholder="请选择" v-model="bizdata.className">
                                <el-option label="院级" value="1"></el-option>
                                <el-option label="所级" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="软件版本" prop="bpmDescribe">
                            <el-input v-model="bizdata.updateDate"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="软件来源" prop="updateDate" layout="2" label-width="70px">
                            <el-input v-model="bizdata.updateDate"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="软件图片" prop="avatar-uploader">
                            <ice-image-uploader v-model="bizdata.updateDate" :height="150" :width="150"
                                                class="avatar-uploader"></ice-image-uploader>
                        </el-form-item>
                        <el-form-item label="关键字" prop="prossversion" label-width="70px">
                            <el-input v-model="bizdata.versionNo"></el-input>
                        </el-form-item>

                        <el-form-item label="文件大小" prop="specialPerson" >
                            <el-input v-model="bizdata.specialOrganization"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="安装文件" prop="specialPerson2"layout="3" label-width="70px">
                            <el-upload
                                    :file-list="fileList"
                                    :before-upload="beforeUpload"
                                    :before-remove="beforeRemove"
                                    class="file-uploader"
                                    :limit="1"
                                    :on-exceed="handleExceed"
                                    action="https://jsonplaceholder.typicode.com/posts/">
                                <div class="text"><em>点击上传</em></div>
                            </el-upload>
                        </el-form-item>

                        <el-form-item label="软件描述" prop="specialPerson" layout="3" label-width="70px">
                            <el-input placeholder="软件描述" type="textarea" v-model="bizdata.specialOrganization"
                                      :disabled="flowScope.formReadonly" rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" prop="specialPerson" layout="3" label-width="70px">
                            <el-input placeholder="申请原因" type="textarea" v-model="bizdata.specialOrganization"
                                      :disabled="flowScope.formReadonly" rows="3"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="授权信息">
                        <el-form-item label="授权单位" prop="specialPerson" layout="3" label-width="70px">
                            <el-input v-model="bizdata.specialPerson"
                                      :disabled="flowScope.formReadonly" type="textarea" rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="授权人员" prop="specialPerson" layout="3" label-width="70px">
                            <el-input v-model="bizdata.specialOrganization"
                                      :disabled="flowScope.formReadonly" type="textarea" rows="3"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    &lt;!&ndash;<ice-grid-layout :columns="1" name="回执详情">
                        <el-form-item label="原因" label-width="100px" prop="b">
                            <el-select placeholder="原因" v-model="bizdata.x">
                                <el-option label="很多用户都在申请该软件" value="1"></el-option>
                                <el-option label="很多用户都在申请该软件" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="备注" label-width="100px" prop="phone" >
                            <el-input type="textarea" rows="3" v-model="bizdata.a" placeholder="备注"></el-input>
                        </el-form-item>
                    </ice-grid-layout>&ndash;&gt;
                    <ice-excel-uploader service="devEquipmentExcelUploadServiceImpl" module="biz">

                    </ice-excel-uploader>
                    <br/>
                    <ice-excel-uploader service="devMediaExcelUploadServiceImpl" module="biz">
                    </ice-excel-uploader>

                    <ice-excel-uploader service="devNetExcelUploadServiceImpl" module="biz">netExcelImport
                    </ice-excel-uploader>



                </el-form>
            </div>
        </ice-flow-form>-->

        <ice-form-dynamic-page>

        </ice-form-dynamic-page>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../components/common/base/IceGridLayout.vue";
    import IceImageUploader from "../../components/common/base/IceImageUpload";
    import IceExcelUploader from "../../components/common/base/IceExcelUploader";
    import IceFormDynamicPage from "../../components/common/form/IceFormDynamicPage";

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
                callActTransmitVar:{b:8},
                options:[],
                bizdata:{main:{},chlie:{}},
                optionsSoftware:[],
                defult:{
                    value:'oid',
                    label:'classifyName',
                    children:'children'
                },
                fileList:[]
            }
        },
        methods: {
            extend1(flowContext,bizdata){
                alert(11)
            },
            flowReady(flowContext,bizdata) {
               // flowContext.actDefName="年度综合报告上报审批与共享子标题流程";
                Object.assign(this.bizdata,bizdata);
                // alert(JSON.stringify(bizdata)+"---"+JSON.stringify(flowContext))
                // flowContext.flowTitle="tianding";
                // bizdata.typeDesc="dingding";
                //  alert(JSON.stringify(this.$refs.flow.getbizdata()))
            },
            flowOperateBtn(flowContext,bizdata){
                flowContext.processVar={a:18};
                return true;
            },
            /**软件类别---选择不同的值时加载不同的--所属分类*/
            softwareType(){
                alert("待接口");

            },
            flowbizdata(){
                this.bizdata.specialPerson22="tianding,lihuan";
                this.bizdata.specialPerson4="huangcm130100";
                return this.bizdata;
            },
            beforeUpload(file){
                if(this.fileList.length>=1){
                    return;
                }
                let obj = {}
                obj.name = file.name;
                obj.url = "https://jsonplaceholder.typicode.com/posts/"+file.uid;
                this.fileList.push(obj);
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
            this.$axios.get("/biz/BizSoftwareClassify/tree").then(success=>{
                this.optionsSoftware = success.data[0].children;
                /*for(let i=0;i<this.optionsSoftware;i++){

                }*/
            }).catch(error=>{
            })
        },
        components: {
            IceFormDynamicPage,
            IceExcelUploader,
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
