<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="bizData" status-icon :rules="rules" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人" prop="afUserName" label-width="80px">
                            <el-input v-model="bizData.afUserName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="afOrgName">
                            <el-input v-model="bizData.afOrgName+'-'+bizData.afDepartmentName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="afPhone">
                            <el-input v-model="bizData.afPhone"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="软件详情">
                        <el-form-item label="软件名称" prop="softwareInfo.softName" label-width="80px">
                            <el-input v-model="bizData.softwareInfo.softName"
                                      :disabled="flowScope.formReadonly" maxlength="64" :showWordLimit="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="发布者" prop="softwareInfo.publishAuthor">
                            <el-input v-model="bizData.softwareInfo.publishAuthor" placeholder="发布者" maxlength="64" :showWordLimit="true"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="关键字" prop="softwareInfo.keywords">
                            <el-input v-model="bizData.softwareInfo.keywords" placeholder="关键字之间用逗号间隔" maxlength="128" :showWordLimit="true"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="级别" prop="" label-width="80px">
                            <el-select placeholder="请选择" v-model="bizData.softwareInfo.softRegion"
                                       :disabled="flowScope.formReadonly" @change="bizData.classifyId=[]">
                                <el-option
                                        v-for="item in softRegions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="软件类别" prop="level" >
                            <el-select placeholder="请选择"
                                       v-model="bizData.level"
                                       @change="levelChange"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="item in levels"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属分类" prop="classifyId">
                            <el-input :disabled="true" v-if="flowScope.formReadonly"
                                      v-model="bizData.classifyName"></el-input>
                            <application-classify-selector :level="bizData.level"
                                                           @textvalue="classifyIdChange" ref="classifySelector"
                                                           v-model="bizData.classifyId"
                                                           v-if="!flowScope.formReadonly"
                                                           :region="bizData.softwareInfo.softRegion"
                                                           :disabled="flowScope.formReadonly">
                            </application-classify-selector>
                        </el-form-item>

                        <el-form-item label="软件版本" prop="softwareInfo.softVersion" label-width="80px">
                            <el-input v-model="bizData.softwareInfo.softVersion"
                                      :disabled="flowScope.formReadonly" maxlength="64" :showWordLimit="true"></el-input>
                        </el-form-item>
                        <el-form-item label="文件大小" prop="softwareInfo.softSizeKb">
                            <el-input v-model="bizData.softwareInfo.softSizeKb"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="软件图片" prop="updateDate">
                            <ice-image-uploader v-model="bizData.softwareInfo.softIconId" :width="150" :height="150"
                                                class="avatar-uploader"
                                                v-if="!flowScope.formReadonly"></ice-image-uploader>
                            <img v-if="flowScope.formReadonly" :src="$showImage(bizData.softwareInfo.softIconId)"
                                 class="avatar-uploader"/>
                        </el-form-item>
                        <el-form-item label="安装文件" prop="softwareInfo.fileId" layout="2" label-width="80px">

                            <!--<div class="upload-progress" :style="{width:percent+'%'}">
                                <em>{{percent>0&&percent!=100?percent+'%':''}}</em>
                                <em v-if="percent==100" class="el-icon-success" style="color: #c2371d;
                                    position: absolute;
                                    bottom: -6px;
                                    right: -2px;"></em>
                                <el-button type="text" class="el-icon-delete" v-if="percent==100" @click="bizData.softwareInfo.fileId = null;percent=0;">删除</el-button>
                            </div>-->
                            <div class="upload-progress">
                                <el-progress :percentage="percent"
                                             :status="percent > 99?'success':''"
                                             style="width: 100%;padding-right: 0"
                                             v-show="uploading"></el-progress>
                            </div>
                            <div style="position: absolute;right:1%;margin-top:0.5%;z-index: 4">
                                <el-button type="text"
                                           class="el-icon-delete"
                                           v-if="percent==100 && isFirstNode"
                                           @click="bizData.softwareInfo.fileId = null;percent=0;uploading=false;">删除</el-button>
                            </div>
                            <div>
                                <div class="file-uploader">
                                    <div v-if="bizData.softwareInfo.fileId">
                                        <div style="position: absolute;margin-left: 38%">
                                            <div style="height: 15px;position: relative;margin-top: 4%">
                                                <el-tooltip placement="top">
                                                    <div slot="content" style="text-align: center;margin-top:10px;">
                                                        {{bizData.softwareInfo.softName}}
                                                    </div>
                                                    <el-button type="text" style="text-align: center;margin-top:10px;">
                                                        {{bizData.softwareInfo.softName.length>10?bizData.softwareInfo.softName.substring(0,11)+'...':bizData.softwareInfo.softName}}
                                                    </el-button>
                                                </el-tooltip>
                                            </div>
                                            <!--<div style="text-align: center;margin-top:10px;">{{bizData.softwareInfoList[0].softName}}</div>-->
                                            <div style="margin-top: 15%;position: relative">
                                                <el-button type="text"
                                                           v-if="!flowScope.isEndNode"
                                                           @click.prevent.stop="downloadLook(bizData.softwareInfo.fileId)"
                                                           class="el-icon-view">下载查看</el-button>
                                                <ice-single-upload style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;"
                                                                   :progress="progress"
                                                                   :on-success="success"
                                                                   :beforeUpload="uploadBeforeUpload"
                                                                   v-model="bizData.softwareInfo.fileId"
                                                                   ref="uploader"
                                                                   v-if="!flowScope.formReadonly">
                                                    <el-button type="text" class="el-icon-upload2">重新上传</el-button>
                                                </ice-single-upload>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-if="!bizData.softwareInfo.fileId">
                                        <ice-single-upload style="width: 110px;margin-top: 20px;margin-left: 40%;" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                           v-model="bizData.softwareInfo.fileId"
                                                           ref="uploader" v-if="!flowScope.formReadonly">
                                            <el-button type="text" class="el-icon-upload2">请选择上传的文件</el-button>
                                        </ice-single-upload>
                                    </div>
                                </div>
                            </div>
                            <!--<div>
                                <div class="file-uploader">

                                    <div v-if="bizData.softwareInfo.fileId">
                                        <div style="">
                                            <div style="text-align: center;margin-top:10px;">{{bizData.softwareInfo.softName}}</div>
                                            <el-button type="text" v-if="!flowScope.isEndNode" @click.prevent.stop="downloadLook(bizData.softwareInfo.fileId)" class="el-icon-view">下载查看</el-button>
                                            <ice-single-upload style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                               v-model="bizData.softwareInfo.fileId" ref="uploader" v-if="!flowScope.formReadonly">
                                                <el-button type="text" class="el-icon-upload2">重新上传</el-button>
                                            </ice-single-upload>
                                        </div>
                                    </div>
                                    <div v-if="!bizData.softwareInfo.fileId">
                                        <ice-single-upload style="width: 110px;margin-top: 20px;margin-left: 40%;" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                           v-model="bizData.softwareInfo.fileId"
                                                           ref="uploader" v-if="!flowScope.formReadonly">
                                            <el-button type="text" class="el-icon-upload2">请选择上传的文件</el-button>
                                        </ice-single-upload>
                                    </div>


                                </div>

                            </div>-->

                        </el-form-item>

                        <el-form-item label="软件描述" prop="softwareInfo.softDescribe" layout="3" label-width="80px">
                            <!--<el-input placeholder="软件描述" type="textarea" v-model="bizData.softwareInfo.softDescribe"
                                      :disabled="flowScope.formReadonly" rows="3" maxlength="64"></el-input>-->
                            <el-input :disabled="flowScope.formReadonly" :rows="5"
                                      :showWordLimit="true" maxlength=300 placeholder="请输入内容" ref="myTextEditor"
                                      type="textarea"
                                      v-model="bizData.softwareInfo.softDescribe"></el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" prop="afReason" layout="3" label-width="80px">
                            <el-input :disabled="flowScope.formReadonly" maxlength="128" placeholder="填写内容不超过128个字"
                                      rows="3" type="textarea" v-model="bizData.afReason"></el-input>
                        </el-form-item>

                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="授权信息" v-if="bizData.level!='SHARE'">

                        <el-form-item label="修改记录" v-if="flowScope.formReadonly">
                            <el-button @click="look(flowScope.bizdata.afNo)" class="el-icon-view">查看
                            </el-button>
                        </el-form-item>
                        <el-form-item label="是否使用授权" prop=""
                                      v-if="bizData.level=='MAINTAIN'"
                                      label-width="120px" layout="1">
                            <el-select placeholder="请选择" v-model="bizData.softwareInfo.downloadAuth"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="item in downloadAuthList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <!--<el-form-item label="授权单位" prop="specialDept" label-width="80px"
                                      v-if="bizData.softwareInfo.softRegion==1">
                            <el-input v-model="bizData.afOrgName" :disabled="true"></el-input>
                        </el-form-item>-->
                        <el-form-item label="授权人员部门" prop="specialPerson" label-width="100px"
                                      v-if="bizData.level=='AUTH'">
                            <el-button icon="el-icon-edit-outline" style="color: #dd6161" @click="chooseItem"
                                       :disabled="flowScope.formReadonly">
                                <span style="color: #222222">选择</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item label="人员" prop="specialPerson" label-width="80px"
                                      v-if="bizData.level=='AUTH'" layout="3">
                            <el-input type="textarea" rows="3" v-model="bizData.authUserNames" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="specialPerson" label-width="80px"
                                      v-if="bizData.level=='AUTH'" layout="3">
                            <el-input type="textarea" rows="3" v-model="bizData.authDeptNames" readonly></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <el-dialog v-dialogDrag title="修改记录" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                       width="800px" append-to-body :close-on-click-modal="false">
                <ice-query-grid
                        :pagination="true"
                        ref="iceGrid"
                        data-url="/biz/BizSoftwareProUpdateHistor/list"
                        :query="queryLook"
                        :columns="columnsLook"></ice-query-grid>
                <div class="ice-button-bar">
                    <el-button type="info" @click="closeDetailDialog">返回</el-button>
                </div>
            </el-dialog>
        </div>
        <div>
            <ice-dept-persion-selector choose-item="multiple"
                                       ref="persionPop"
                                       :selectedPersion="selectedPersion"
                                       :selectedDept="selectedDept"
                                       @select-confirm="selectUserConfirm"
                                       mode="hidden">
            </ice-dept-persion-selector>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import fileUtil from '@/utils/fileUtil.js';
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector.vue";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector.vue";
    import ElSelectDropdown from "element-ui/packages/select/src/select-dropdown";
    import ApplicationClassifySelector from "./ApplicationClassifySelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDeptPersionSelector from "../../../components/common/biz/IceDeptPersionSelector";

    export default {
        name: "ApplicationUpData",
        components: {
            IceDeptPersionSelector,
            IceQueryGrid,
            IceSelect,
            ApplicationClassifySelector,
            ElSelectDropdown,
            IceImageUploader,
            IceSingleUpload,
            IceFlowForm,
            IceEditableTable,
            IceEditableTableColumn,
            IceGridLayout,
            IcePersionSelector,
            IceDeptSelector,
            quillEditor
        },
        data() {
            let validateSoftDescribe = (rule, value, callback) => {
                let obj = document.createElement("div");
                obj.innerHTML = value;
                let val = obj.innerText;
                if (val.length > 64) {
                    callback(new Error('软件描述不能超过64个字'));
                } else if (val.length == 0) {
                    callback(new Error('软件描述不能为空'));
                } else {
                    callback();
                }
            };
            return {
                uploading: false,
                isFirstNode:false,
                rules: {
                    'softwareInfo.softName': [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    level: [{required: true, message: '请输入软件类别', trigger: 'change'}],
                    classifyId: [{required: true, message: '请输入所属分类', trigger: 'change'}],
                    'softwareInfo.softSizeKb': [{required: true, message: '请输入文件大小', trigger: 'blur'}],
                    'softwareInfo.fileId': [{required: true, message: '请选择安装文件', trigger: 'blur'}],
                    'softwareInfo.softDescribe': [{
                        required: true,
                        whitespace: true,
                        message: '请输入软件描述',
                        trigger: 'blur'
                    }],
                    'softwareInfo.softVersion': [{
                        required: true,
                        whitespace: true,
                        message: '请输入软件版本',
                        trigger: 'blur'
                    }],
                    afReason: [{required: true, whitespace: true, message: '请输入申请原因', trigger: 'blur'}],
                    /*fromYon: [{required: true, message: '请输入软件来源', trigger: 'blur'}],
                    softRegion: [{required: true, message: '请输入授权单位', trigger: 'blur'}],*/
                    'softwareInfo.keywords': [{required: true, whitespace: true, message: '请输入关键字', trigger: 'blur'}]
                },
                quillOptions: {
                    placeholder: '请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                selectedPersion: [],
                selectedDept: [],
                bizData: {
                    softwareInfo: {
                        downloadAuth:0,
                        softRegion: 1
                    },
                    classifyName: '',
                    authUserNames: '',
                    authUserCodes: '',
                    authDeptCodes: '',
                    authDeptNames: '',
                    specialDept: '',
                    afUserCode: '',
                    afUserName: '',
                    afReason: '',
                    afPhone: '',
                    details: {},
                    dynamicDeptTags: [],
                    dynamicUserTags: [],
                    level: 'SHARE',
                    classifyId: []
                },
                softRegions: [{
                    value: 1,
                    label: '所级'
                }],
                levels: [{
                    value: 'SHARE',
                    label: '白名单'
                }, {
                    value: 'AUTH',
                    label: '授权专用'
                }, {
                    value: 'MAINTAIN',
                    label: '运维专用'
                }],
                downloadAuthList: [{
                    value: 0,
                    label: '否'
                }, {
                    value: 1,
                    label: '是'
                }],
                authUses: [{
                    value: '0',
                    label: '否'
                }, {
                    value: '1',
                    label: '是'
                }],
                classifyIdProps: {
                    value: 'oid',
                    label: 'classifyName',
                    children: 'children'
                },
                isYunwei: false,
                percent: 0,
                dialogVisible: false,
                queryLook: [
                    /*{type: 'input', label: '属性名称', code: 'proName', value: ''},*/
                    {
                        type: 'static', code: "afId", exp: "=", value: () => {
                            return this.afIdNum
                        }
                    },
                ],
                columnsLook: [
                    {code: "oid", hidden: true},
                    {label: '属性名称', code: 'proName', width: 200},
                    {label: '修改前', code: 'beforeVal', width: 200},
                    {label: '修改后', code: 'afterVal', width: 200},
                ],
                afIdNum: ''
            }
        },
        methods: {
            /**当类别发生变化时，清空部门岗位的值*/
            levelChange(){
                if(this.bizData.level!='AUTH'){
                    this.bizData.authUserCodes = '';
                    this.bizData.authUserNames = '';
                    this.bizData.authDeptCodes = '';
                    this.bizData.authDeptNames = '';
                }
                if(this.bizData.level!='MAINTAIN'){
                    this.bizData.softwareInfo.downloadAuth = 0;
                }
                this.bizData.classifyId = [];
            },
            downloadLook(id) {
                this.$downloadFile(id);
            },
            /**查看修改记录*/
            look(afId) {
                this.afIdNum = afId;
                this.dialogVisible = true;
            },
            /**关闭弹窗--修改记录*/
            closeDetailDialog() {
                this.dialogVisible = false;
            },
            beforeUpload(file, scope) {
                this.$set(scope.row, 'uploading', true);
                // this.$set(scope.row, 'softName', file.name);
                this.$set(scope.row, 'softSize', file.size);
                this.$set(scope.row, 'size', fileUtil.fileSizeFormat(file.size));
            },
            flowBizData() {
                // let obj='';
                this.bizData.softwareInfo.classifyId = this.bizData.classifyId[this.bizData.classifyId.length - 1];
                this.bizData.softRegion = this.bizData.softwareInfo.softRegion;
                return this.bizData;
            },
            flowOperateBtn(flowContext, bizdata) {
                if(flowContext.operateType == 'save'){
                    return true;
                }
                let formValid = false;
                this.$refs['bizForm'].validate((valid) => {
                    formValid = valid;
                });
                // flowContext.processVar = {
                //     a: this.bizData.softwareInfo.softRegion == 0 ? 9 : 7
                // };
                if(!this.bizData.softwareInfo.fileId || this.bizData.softwareInfo.fileId.length == 0){
                    this.$message.error('请上传软件');
                    return false;
                }
                return formValid;
            },
            deleteDetailItem(index) {
                this.bizData.details.splice(index, 1);
            },
            loadRegions(flowcont){
                this.$axios.get("/biz/BizSoftwareConstant/auth/user").then(success => {
                    if(success.data.is_global || this.$refs.flowForm.formReadonly){
                        this.softRegions.push({
                            value: 0,
                            label: '院级'
                        })
                    }
                });
            },
            flowReady(flowcont, bizdata) {
                this.loadRegions(flowcont);
                if (flowcont.nodeId == 'FirstNode' && this.$refs.flowForm.flowInstData.isAuthor) {
                    this.isFirstNode = true;
                    if(bizdata.softwareInfo&&bizdata.softwareInfo.fileId){
                        this.percent=100;
                    }
                }else{
                    this.isFirstNode = false;
                }
                Object.assign(this.bizData, bizdata);
                if (!bizdata.oid) {
                    this.loadPageData(data => {
                        if (this.bizData.authUserCodes) {
                            this.selectedPersion = this.bizData.authUserCodes.split(",");
                        }
                        if (this.bizData.authDeptCodes) {
                            this.selectedDept = this.bizData.authDeptCodes.split(",");
                        }
                    });
                } else {
                    if (this.bizData.authUserCodes) {
                        this.selectedPersion = this.bizData.authUserCodes.split(",");
                    }
                    if (this.bizData.authDeptCodes) {
                        this.selectedDept = this.bizData.authDeptCodes.split(",");
                    }
                }
            },
            cancelSelectUser() {

            },
            chooseItem() {
                this.$nextTick(() => {
                    this.$refs.persionPop.openDialog();
                })
            },
            selectUserConfirm(rows, texts) {
                this.bizData.authUserNames = texts.map(item=>item.name).join(',');
                this.bizData.authUserCodes = texts.map(item=>item.code).join(',');
                this.bizData.authDeptCodes = rows.map(item=>item.deptCode).join(',');
                this.bizData.authDeptNames = rows.map(item=>item.deptName).join(',');
                this.selectedDept = rows.length == 0?[]:this.bizData.authDeptCodes.split(",");
                this.selectedPersion = texts.length == 0?[]:this.bizData.authUserCodes.split(",");
            },
            classifyIdChange(text) {
                this.bizData.classifyName = text;
            },
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            success(response, file, fileList) {
                this.percent = 100;
                this.$refs.uploader.reset();
                this.bizData.softwareInfo.softSize = file.size;
                this.bizData.softwareInfo.softSizeKb = fileUtil.fileSizeFormat(file.size);
                // this.bizData.softwareInfo.softName = file.name;
                this.bizData.softwareInfo.fileId = response.data;
            },
            uploadBeforeUpload(file){
                this.percent = 0;
                this.uploading = true;
                this.bizData.softwareInfo.fileMD5 = file.md5;
            },
            loadPageData(call) {
                let ids = this.$route.query['ids'];
                if (!(ids && ids.length > 0)) {
                    return;
                }
                this.$axios.get("/biz/BizSoftwareInfo/gets", {params: {ids: ids}})
                    .then(result => {
                            this.bizData.softwareInfo = result.data[0];
                            this.bizData.level = this.bizData.softwareInfo.classifyIdPath.split("_")[0];
                            this.bizData.classifyId = this.bizData.softwareInfo.classifyIdPath.split('_').splice(1);
                            this.bizData.softwareInfo.softSize = this.bizData.softwareInfo.softSize;
                            this.bizData.softwareInfo.softSizeKb = fileUtil.fileSizeFormat(this.bizData.softwareInfo.softSize);
                            return this.$axios.get("/biz/BizSoftwareAuthUser/getAuth", {"params": {"softwareId": this.bizData.softwareInfo.oid}});
                        }
                    ).then(result => {
                        console.log('--------------')
                        // this.bizData.softwareInfo
                        console.log(result.data)
                        this.bizData.authUserCodes = result.data.filter(item => item.type == 'USER').map(item => item.code).join(',');
                        this.bizData.authDeptCodes = result.data.filter(item => item.type == 'DEPT').map(item => item.code).join(',');
                        this.bizData.authUserNames = result.data.filter(item => item.type == 'USER').map(item => item.name).join(',');
                        this.bizData.authDeptNames = result.data.filter(item => item.type == 'DEPT').map(item => item.name).join(',');
                        call(this.bizData)
                    }
                )
            }
        },

        mounted() {
            this.$refs.classifySelector.loadPickList();
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
    /*.upload-progress{
        width: 100%;
        background: #67c23a;
        position: absolute;
        top: 1px;
        text-align: right;
        z-index: 0;
        height: 3px;
    }*/
    .upload-progress{
        width: 80%;
        position: absolute;
        margin-top: 2%;
        margin-left: 5%;
        text-align: right;
        z-index: 4;

    }
</style>