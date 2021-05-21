<template>
    <div class="content-filled">
        <el-dialog v-dialogDrag title="软件信息" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <el-form :model="mainDataForm" status-icon :rules="rulesEdit" ref="definition" label-width="100px">
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="软件名称" prop="softName">
                            <el-input v-model="mainDataForm.softName" autocomplete="off" maxlength="64"
                                      :showWordLimit="true">
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="软件级别" prop="softRegion">
                            <el-select placeholder="请选择" v-model="mainDataForm.softRegion" @change="mainDataForm.classifyArray=[]">
                                <el-option
                                        v-for="item in softRegions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="软件类别" prop="level">
                            <el-select placeholder="请选择" v-model="mainDataForm.level" disabled @change="mainDataForm.classifyArray=[]">
                                <el-option
                                        v-for="item in levels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="所属分类" prop="classifyArray">
                            <application-classify-selector v-model="mainDataForm.classifyArray"
                                                           ref="classifySelector"
                                                           :region="mainDataForm.softRegion"
                                                           :level="mainDataForm.level"
                                                           @changevalue="classifyIdChange"></application-classify-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="软件版本" prop="softVersion">
                            <el-input v-model="mainDataForm.softVersion" maxlength="64"
                                      :showWordLimit="true"
                            ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="软件来源" prop="fromYon">
                            <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                        v-model="mainDataForm.fromYon"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="8">
                        <el-form-item label="发布者" prop="publishAuthor">
                            <el-input v-model="mainDataForm.publishAuthor" placeholder="发布者" maxlength="64" :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="8">
                        <el-form-item label="文件大小" prop="softSizeKb">
                            <el-input v-model="mainDataForm.softSizeKb" disabled></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="软件图片" prop="softIconId">
                            <ice-image-uploader v-model="mainDataForm.softIconId" :height="150" :width="150"
                                                class="avatar-uploader"></ice-image-uploader>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="16">
                        <el-form-item label="安装文件" prop="fileId" layout="2">

                            <div class="upload-progress">
                                <el-progress :percentage="percent"
                                             :status="percent > 99?'success':'exception'"
                                             style="width: 100%;padding-right: 0"
                                             v-show="uploading"></el-progress>
                            </div>
                            <div style="position: absolute;right:1%;margin-top:0.5%;z-index: 4">
                                <el-button @click="mainDataForm.fileId = null;percent=0;uploading=false;"
                                           class="el-icon-delete"
                                           type="text"
                                           v-if="percent==100">删除
                                </el-button>
                            </div>
                            <div>
                                <div class="file-uploader">
                                    <div v-if="mainDataForm.fileId">
                                        <div style="position: absolute;margin-left: 38%">
                                            <div style="height: 15px;position: relative;margin-top: 4%">
                                                <el-tooltip placement="top">
                                                    <div slot="content" style="text-align: center;margin-top:10px;">
                                                        {{mainDataForm.softName}}
                                                    </div>
                                                    <el-button style="text-align: center;margin-top:10px;" type="text">
                                                        {{mainDataForm.softName.length>10?mainDataForm.softName.substring(0,11)+'...':mainDataForm.softName}}
                                                    </el-button>
                                                </el-tooltip>
                                            </div>
                                            <!--<div style="text-align: center;margin-top:10px;">{{bizData.softwareInfoList[0].softName}}</div>-->
                                            <div style="margin-top: 15%;position: relative">
                                                <el-button @click.prevent.stop="look(mainDataForm.fileId)"
                                                           class="el-icon-view"
                                                           type="text">下载查看
                                                </el-button>
                                                <ice-single-upload :beforeUpload="uploadBeforeUpload"
                                                                   :on-success="success"
                                                                   :progress="progress"
                                                                   ref="uploader"
                                                                   style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;"
                                                                   v-model="mainDataForm.fileId">
                                                    <el-button class="el-icon-upload2" type="text">重新上传</el-button>
                                                </ice-single-upload>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="!mainDataForm.fileId">
                                        <ice-single-upload style="width: 110px;margin-top: 20px;margin-left: 40%;" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                           v-model="mainDataForm.fileId"
                                                           ref="uploader">
                                            <el-button type="text" class="el-icon-upload2">请选择上传的文件</el-button>
                                        </ice-single-upload>
                                    </div>
                                </div>
                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="关键字" prop="keywords">
                            <el-input v-model="mainDataForm.keywords" placeholder="关键字之间用逗号间隔" maxlength="128"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="软件描述" prop="softDescribe">
                            <el-input :rows="5" :showWordLimit="true"
                                      maxlength=300 placeholder="请输入内容" ref="myTextEditor" type="textarea"
                                      v-model="mainDataForm.softDescribe"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="saveEdit">保存</el-button>
                <el-button type="info" @click="closeDialogEdit">返回</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceAdvanceUploader from '@/components/common/base/IceAdvanceUploader.js'
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import ApplicationClassifySelector from "./ApplicationClassifySelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "AppcationEdit",
        mixins: [IceAdvanceUploader],
        components: { quillEditor,IceSelect, ApplicationClassifySelector, IceSingleUpload, IceGridLayout, IceImageUploader},
        data() {
            let validateSoftDescribe = (rule, value, callback) =>{
                let obj = document.createElement("div");
                obj.innerHTML = value;
                let val = obj.innerText;
                if (val.length > 64) {
                    callback(new Error('软件描述不能超过64个字'));
                } else {
                    callback();
                }
            };
            return {
                uploading: false,
                quillOptions:{
                    placeholder:'请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                mainDataForm: {fromYon: '',classifyArray:[],softDescribe:'',softName:'',level:'AUTH',softVersion:'',publishAuthor:'',keywords:'',softSizeKb:'',softRegion:1,fileId:'',softIconId:''},
                softRegions: [{
                    value: 1,
                    label: '所级'
                }],
                activeName: 'first',
                restaurants: [],
                fileList: [],                           /*上传文件数组*/
                percent: 0,
                rulesEdit: {
                    softName: [{required: true,whitespace: true, message: '请输入软件名称', trigger: 'blur'}],
                    level: [{required: true, message: '请输入软件类别', trigger: 'change'}],
                    softRegion: [{required: true, message: '请输入软件级别', trigger: 'change'}],
                    softVersion: [{required: true,whitespace: true, message: '请输入软件版本', trigger: 'blur'}],
                    softSizeKb: [{required: true, message: '请输入软件大小', trigger: 'blur'}],
                    fromYon: [{required: true, message: '请输入软件来源', trigger: 'blur'}],
                    classifyArray: [{required: true, message: '请输入所属分类', trigger: 'change'}],
                    keywords: [{required: true,whitespace: true, message: '请输入关键字', trigger: 'blur'}],
                    fileId: [{required: true, message: '请选择安装文件', trigger: 'blur'}],
                    softDescribe: [{required: true, message: '请填写软件描述', trigger: 'change'}]
                },
                dialogVisible: false,
                isProgress:false,
                isClass:false,
                levels: [{
                    value: 'SHARE',
                    label: '白名单'
                }, {
                    value: 'AUTH',
                    label: '授权专用'
                }, {
                    value: 'MAINTAIN',
                    label: '运维专用'
                }]
            }
        },
        methods: {
            look(id){
                this.$downloadFile(id);
            },
            saveEdit() {
                this.$refs.definition.validate((valid) => {
                    if (valid) {
                        this.dialogVisible = false;
                        this.$emit("app-edit", this.mainDataForm);
                    }
                });
            },
            closeDialogEdit() {
                this.dialogVisible = false;
            },
            openDialogEdit(){
                this.dialogVisible = true;
            },
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            success(response, file, fileList) {
                this.percent = 100;
                this.$refs.uploader.reset();
                this.mainDataForm.softSize = file.size;
                this.mainDataForm.softSizeKb = fileUtil.fileSizeFormat(file.size) ;
                // this.mainDataForm.softName = file.name.substring(0,30);
                this.mainDataForm.fileId = response.data;
            },
            uploadBeforeUpload(file){
                this.percent = 0;
                this.uploading = true;
                this.mainDataForm.fileMD5 = file.md5;
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
            },
            classifyIdChange(item) {
                this.$set(this.mainDataForm, 'classifyId', item[item.length - 1]);
            }
        },
        mounted() {
            // this.$axios.get("/biz/BizSoftwareConstant/auth/user").then(success => {
            //     if(success.data.is_global){
            //         this.softRegions.push({
            //             value: 0,
            //             label: '院级'
            //         })
            //     }
            // });
            if(!this.mainDataForm.softIconId){
                fileUtil.getSoftWareDefaultImg.call(this,id=>{
                    this.mainDataForm.softIconId = id;
                })
            }
        },
        watch: {
            dialogVisible(value) {
                if (value) {
                    this.$nextTick(_ => {
                        this.$refs.classifySelector.loadPickList();
                    });
                }
            }
        }
    }
</script>

<style scoped>
    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 90px;
        width: 100%;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;

    }

    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        height: 150px;
        width: 150px;
        overflow: hidden;
    }

    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .file-uploader .progress {
        background: #5daf34;
        height: 100%;
        width: 0;
        left: 0;
        position: absolute;
        top: 0;
        text-align: right;
    }
    .upload-progress{
        width: 80%;
        position: absolute;
        margin-top: 2%;
        margin-left: 5%;
        text-align: right;
        z-index: 4;

    }

    /*.upload-progress{*/
    /*width: 100%;*/
    /*background: #67c23a;*/
    /*position: absolute;*/
    /*top: 1px;*/
    /*text-align: right;*/
    /*z-index: 0;*/
    /*height: 3px;*/
    /*}*/
</style>