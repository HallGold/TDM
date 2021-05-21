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
                        <el-form-item label="所在部门" prop="statusDes">
                            <el-input v-model="bizData.afOrgName+'-'+bizData.afDepartmentName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="statusDes">
                            <el-input v-model="bizData.afPhone"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="软件详情">
                        <el-form-item label="软件名称" prop="softwareInfoList[0].softName" label-width="80px">
                            <el-autocomplete
                                    :maxlength="64"
                                    :showWordLimit="true"
                                    popper-class="my-autocomplete"
                                    v-model="bizData.softwareInfoList[0].softName"
                                    :fetch-suggestions="querySearchSoft"
                                    :disabled="flowScope.formReadonly"
                                    placeholder="软件名称"

                                    @select="handleSelectSoft">
                                <template slot-scope="{ item }">
                                    <div style="border-bottom: dashed 1px #c73c41;">
                                        <div class="softName">{{ item.softName }}</div>
                                        <span class="softVersion" style="">版本:{{ item.softVersion }}</span>
                                        <span class="softVersion" style="">{{ item.classifyNamePath }}</span>
                                    </div>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="软件来源" prop="softwareInfoList[0].fromYon">
                            <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                        v-model="bizData.softwareInfoList[0].fromYon"
                                        @change="$nextTick(()=>{$refs.bizForm.validateField('softwareInfoList[0].fromYon',error=>{})})"
                                        :disabled="flowScope.formReadonly">
                            </ice-select>
                        </el-form-item>

                        <el-form-item label="发布者" prop="softwareInfoList[0].publishAuthor">
                            <el-input v-model="bizData.softwareInfoList[0].publishAuthor" placeholder="软件发布者"
                                      maxlength="64"
                                      :showWordLimit="true"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="级别" label-width="80px" prop="softwareInfoList[0].softRegion">
                            <el-select :disabled="flowScope.formReadonly" @change="bizData.classifyIdArray=[]"
                                       placeholder="请选择" v-model="bizData.softwareInfoList[0].softRegion">
                                <el-option
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                        v-for="item in softRegions">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="软件类别" prop="level">
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
                        <el-form-item label="所属分类" prop="classifyIdArray">
                            <el-input :disabled="true" v-if="flowScope.formReadonly"
                                      v-model="bizData.classifyName"></el-input>
                            <application-classify-selector :level="bizData.level"
                                                           @textvalue="classifyIdChange" ref="classifySelector"
                                                           v-model="bizData.classifyIdArray"
                                                           :region="bizData.softwareInfoList[0].softRegion"
                                                           @change="$nextTick(()=>{
                                                           $refs.bizForm.validateField('classifyIdArray',error=>{});
                                                           $set(bizData.softwareInfoList[0], 'classifyId', item[item.length - 1]);
                                                           })"
                                                           v-if="!flowScope.formReadonly"
                                                           :disabled="flowScope.formReadonly">
                            </application-classify-selector>
                        </el-form-item>
                        <el-form-item label="软件版本" prop="softwareInfoList[0].softVersion" label-width="80px">
                            <el-input v-model="bizData.softwareInfoList[0].softVersion"
                                      :disabled="flowScope.formReadonly" maxlength="64"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>

                        <el-form-item label="文件大小" prop="softwareInfoList[0].softSizeKb">
                            <el-input v-model="bizData.softwareInfoList[0].softSizeKb"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="安装文件" prop="softwareInfoList[0].fileId" layout="2" label-width="80px">

                            <div class="upload-progress">
                                <el-progress :percentage="percent"
                                             :status="percent > 99?'success':null"
                                             style="width: 100%;padding-right: 0"
                                             v-show="uploading"></el-progress>
                            </div>
                            <div style="position: absolute;right:1%;margin-top:0.5%;z-index: 4">
                                <el-button type="text"
                                           class="el-icon-delete"
                                           v-if="percent==100 && isFirstNode"
                                           @click="bizData.softwareInfoList[0].fileId = null;percent=0;uploading=false;">
                                    删除
                                </el-button>
                            </div>
                            <div>
                                <div class="file-uploader">
                                    <div v-if="bizData.softwareInfoList[0].fileId">
                                        <div style="position: absolute;margin-left: 38%">
                                            <div style="height: 15px;position: relative;margin-top: 4%">
                                                <el-tooltip placement="top">
                                                    <div slot="content" style="text-align: center;margin-top:10px;">
                                                        {{filename}}
                                                    </div>
                                                    <el-button type="text" style="text-align: center;margin-top:10px;">
                                                        {{filename.length>10?filename.substring(0,11)+'...':filename}}
                                                    </el-button>
                                                </el-tooltip>
                                            </div>
                                            <!--<div style="text-align: center;margin-top:10px;">{{bizData.softwareInfoList[0].softName}}</div>-->
                                            <div style="margin-top: 15%;position: relative">
                                                <el-button type="text"
                                                           v-if="!flowScope.isEndNode"
                                                           @click.prevent.stop="look(bizData.softwareInfoList[0].fileId)"
                                                           class="el-icon-view">下载查看
                                                </el-button>
                                                <ice-single-upload style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;"
                                                                   :progress="progress"
                                                                   :on-success="success"
                                                                   :beforeUpload="uploadBeforeUpload"
                                                                   v-model="bizData.softwareInfoList[0].fileId"
                                                                   ref="uploader"
                                                                   v-if="!flowScope.formReadonly">
                                                    <el-button type="text" class="el-icon-upload2">重新上传</el-button>
                                                </ice-single-upload>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-if="!bizData.softwareInfoList[0].fileId">
                                        <ice-single-upload :beforeUpload="uploadBeforeUpload"
                                                           :on-success="success" :progress="progress"
                                                           style="width: 110px;margin-top: 20px;margin-left: 40%;"
                                                           v-model="bizData.softwareInfoList[0].fileId"
                                                           ref="uploader" v-if="!flowScope.formReadonly">
                                            <el-button type="text" class="el-icon-upload2">请选择上传的文件</el-button>
                                        </ice-single-upload>
                                    </div>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="软件图片" prop="softwareInfoList[0].softIconId">
                            <ice-image-uploader v-model="bizData.softwareInfoList[0].softIconId" :width="100"
                                                :height="100"
                                                class="avatar-uploader"
                                                v-if="!flowScope.formReadonly"></ice-image-uploader>
                            <img v-if="flowScope.formReadonly" :src="$showImage(bizData.softwareInfoList[0].softIconId)"
                                 class="avatar-uploader"/>
                        </el-form-item>
                        <el-form-item label="适配系统" label-width="80px" layout="3"
                                      prop="softwareInfoList[0].supportOsCode">
                            <ice-select :disabled="flowScope.formReadonly"
                                        :text.sync="bizData.softwareInfoList[0].supportOsName" collapse-tags
                                        map-type-code="SOFT_OS"
                                        multiple
                                        placeholder="适配系统"
                                        v-if="!flowScope.formReadonly"
                                        v-model="bizData.softwareInfoList[0].supportOsCode"
                                        valueModel="string">
                            </ice-select>
                            <el-input :readonly="flowScope.formReadonly"
                                      v-if="flowScope.formReadonly"
                                      v-model="bizData.softwareInfoList[0].supportOsName"></el-input>
                        </el-form-item>
                        <el-form-item label="关键字" prop="softwareInfoList[0].keywords" layout="3" label-width="80px">
                            <el-input v-model="bizData.softwareInfoList[0].keywords" placeholder="关键字之间用逗号间隔"
                                      maxlength="128" :showWordLimit="true"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="软件描述" prop="softwareInfoList[0].softDescribe" layout="3"
                                      label-width="80px">
                            <el-input :disabled="flowScope.formReadonly" :rows="5"
                                      :showWordLimit="true" maxlength=300 placeholder="请输入内容" ref="myTextEditor"
                                      type="textarea"
                                      v-model="bizData.softwareInfoList[0].softDescribe"></el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" prop="afReason" layout="3" label-width="80px">
                            <el-input :disabled="flowScope.formReadonly" :showWordLimit="true" maxlength="128"
                                      placeholder="填写内容不超过128个字" type="textarea" v-model="bizData.afReason"
                                      rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="是否查杀" label-width="80px" layout="1" prop="safeCheck"
                                      title="已对安装文件进行计算机病毒与恶意代码查杀、查验">
                            <el-checkbox :disabled="flowScope.formReadonly" border false-label="0"
                                         label="已经过病毒与恶意代码查杀" style="color: #333" true-label="1"
                                         v-model="bizData.safeCheck"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="查杀工具" label-width="80px" layout="1" prop="safeCheckTool"
                                      title="计算机病毒与恶意代码查杀工具">
                            <el-input maxlength=64 placeholder="查杀工具" v-model="bizData.safeCheckTool"
                                      :showWordLimit="true" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="检查人" label-width="80px" layout="1"
                                      prop="safeCheckUserCode" title="计算机病毒与恶意代码查杀工具">
                            <el-input placeholder="选择检查人" readonly type="input" v-model="bizData.safeCheckUserName">
                                <el-button :disabled="flowScope.formReadonly" @click="choosePerson" icon="el-icon-more"
                                           slot="append" title="点我选择检查人"></el-button>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="授权信息" v-if="bizData.level!='SHARE'">
                        <el-form-item label="是否使用授权"
                                      v-if="bizData.level=='MAINTAIN'"
                                      label-width="80px" layout="3" prop="downloadAuth">
                            <el-select placeholder="请选择" v-model="bizData.softwareInfoList[0].downloadAuth"
                                       :disabled="flowScope.formReadonly">
                                <el-option
                                        v-for="item in downloadAuthList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授权人员部门" prop="specialPerson" label-width="100px"
                                      v-if="bizData.level=='AUTH'">
                            <el-button :disabled="flowScope.formReadonly" @click="chooseItem"
                                       icon="el-icon-edit-outline"
                                       style="color: #dd6161">
                                <span style="color: #222222">选择</span>
                            </el-button>
                        </el-form-item>
                        <el-form-item label="人员" prop="specialPerson" label-width="80px"
                                      v-if="bizData.level=='AUTH'" layout="3">
                            <el-input type="textarea" rows="3" v-model="user" readonly></el-input>
                        </el-form-item>
                        <el-form-item label="部门" prop="specialPerson" label-width="80px"
                                      v-if="bizData.level=='AUTH'" layout="3">
                            <el-input type="textarea" rows="3" v-model="dept" readonly></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <ice-persion-selector
                    choose-item="single"
                    ref="personPop"
                    mode="hidden"
                    @select-cannel="selectCannel"
                    :selected-persion="bizData.safeCheckUserCode"
                    @select-confirm="selectPersonConfirm">
            </ice-persion-selector>
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
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "ApplicationUpData",
        components: {
            IceDeptPersionSelector,
            quillEditor,
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
            IceDeptSelector
        },
        data() {
            let safeCheckValidate = (rule, value, callback) => {
                if ('1' !== value) {
                    callback(new Error('请勾选'));
                } else {
                    callback();
                }
            };
            return {
                uploading: false,
                quillOptions: {
                    placeholder: '请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                rules: {
                    'softwareInfoList[0].softName': [{
                        required: true,
                        whitespace: true,
                        message: '请输入名称',
                        trigger: 'change'
                    }],
                    level: [{required: true, message: '请输入软件类别', trigger: 'change'}],
                    classifyIdArray: [{required: true, message: '请输入所属分类', trigger: 'change'}],
                    'softwareInfoList[0].fromYon': [{required: true, message: '请输入软件来源', trigger: 'blur'}],
                    'softwareInfoList[0].fileId': [{required: true, message: '请选择文件', trigger: 'blur'}],
                    'softwareInfoList[0].softDescribe': [{
                        required: true,
                        whitespace: true,
                        message: '请输入软件描述',
                        trigger: 'blur'
                    }],
                    'softwareInfoList[0].softVersion': [{
                        required: true,
                        whitespace: true,
                        message: '请输入软件版本',
                        trigger: 'blur'
                    }],
                    afReason: [{required: true, whitespace: true, message: '请输入申请原因', trigger: 'blur'}],
                    safeCheck: [{required: true, validator: safeCheckValidate, trigger: 'change'}],
                    safeCheckTool: [{required: true, whitespace: true, message: '请输入检查工具', trigger: 'blur'}],
                    safeCheckUserCode: [{required: true, message: '请选择检查人', trigger: 'change'}],
                    'softwareInfoList[0].softRegion': [{required: true, message: '请输入授权单位', trigger: 'blur'}],
                    'softwareInfoList[0].keywords': [{
                        required: true,
                        whitespace: true,
                        message: '请输入关键字',
                        trigger: 'blur'
                    },],
                },
                valueUser: [],
                valueDept: [],
                optionsUser: [],
                optionsDept: [],
                user: '',
                dept: '',
                authDeptNamesText: '',
                selectedPersion: [],
                selectedDept: [],
                bizData: {
                    authUserCodes: '',
                    specialDept: '',
                    afUserCode: '',
                    afUserName: '',
                    afPhone: '',
                    details: {},
                    afReason: '',
                    dynamicDeptTags: [],
                    dynamicUserTags: [],
                    classifyIdArray: [],
                    softwareInfoList: [{
                        fileMD5: '',
                        softRegion: 1,
                        keywords: '',
                        fileId: '',
                        softIconId: '',
                        fromYon: '',
                        softName: '',
                        softVersion: '',
                        softDescribe: '',
                        downloadAuth: 0,
                        supportOsCode: '',
                        supportOsName: ''
                    }],
                    classifyName: '',
                    level: 'SHARE',
                    safeCheck: '',
                    safeCheckTool: '',
                    safeCheckUserCode: [],
                    safeCheckUserName: ''
                },
                // 安装文件名称
                filename: '',
                softRegions: [{
                    value: 1,
                    label: '所级'
                }],
                safeCheckData: [{
                    value: 0,
                    label: '否'
                }, {
                    value: 1,
                    label: '是'
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

                options: [],
                isYunwei: false,
                percent: 0,
                deptMode: 'readonly',
                isFirstNode: false
            }
        },
        methods: {
            look(id) {
                this.$downloadFile(id);
            },
            chooseItem() {
                this.$nextTick(() => {
                    this.$refs.persionPop.openDialog();
                })
            },
            classifyIdChange(text) {
                this.bizData.classifyName = text;
            },
            /**当类别发生变化时，清空部门岗位的值*/
            levelChange() {
                if (this.bizData.level != 'AUTH') {
                    this.bizData.authUserCodes = '';
                    this.bizData.authUserNames = '';
                    this.bizData.authDeptCodes = '';
                    this.bizData.authDeptNames = '';
                }
                if (this.bizData.level != 'MAINTAIN') {
                    this.bizData.softwareInfoList[0].downloadAuth = 0;
                }
                this.bizData.classifyIdArray = [];
            },
            querySearchSoft(queryString, cb) {
                if (!this.bizData.softwareInfoList[0].softName || this.bizData.softwareInfoList[0].softName.length == 0) {
                    cb([]);
                    return;
                    this.$userInfo()
                }
                this.$axios.get("/biz/BizSoftwareInfo/listByName", {
                    "params": {
                        "name": this.bizData.softwareInfoList[0].softName
                        , "userCode": this.bizData.afUserCode, "orgCode": this.bizData.afOrgCode
                        , "deptCode": this.bizData.afDepartmentCode
                    }
                }).then(success => {
                    // this.bizData.softwareInfoList[0].softVersion = '';
                    // this.bizData.softwareInfoList[0].softDescribe = '';
                    cb(success.data);
                }).catch(error => {
                    this.$message.error(error);
                });
            },
            handleSelectSoft(item) {
                let softInfo = {};
                Object.assign(softInfo, item);
                this.bizData.level = softInfo.classifyIdPath.split("_")[0];
                this.bizData.classifyIdArray = softInfo.classifyIdPath.split('_').splice(1);
                softInfo.oid = null;
                softInfo.softSizeKb = fileUtil.fileSizeFormat(softInfo.softSize);
                this.$set(this.bizData, "softwareInfoList", [softInfo]);
            },
            flowBizData() {
                this.bizData.softwareInfoList[0].classifyId = this.bizData.classifyIdArray[this.bizData.classifyIdArray.length - 1];
                this.bizData.softRegion = this.bizData.softwareInfoList[0].softRegion;
                return this.bizData;
            },
            flowOperateBtn(flowContext, bizdata) {
                if (flowContext.operateType == 'save') {
                    return true;
                }
                let formValid = false;
                this.$refs['bizForm'].validate((valid) => {
                    formValid = valid;
                });
                return formValid;
            },
            deleteDetailItem(index) {
                this.bizData.details.splice(index, 1);
            },
            loadRegions(flowcont) {
                this.$axios.get("/biz/BizSoftwareConstant/auth/user").then(success => {
                    if (success.data.is_global || this.$refs.flowForm.formReadonly) {
                        this.softRegions.push({
                            value: 0,
                            label: '院级'
                        })
                    }
                });
            },
            flowReady(flowcont, bizdata) {
                this.loadRegions(flowcont);
                if ('FirstNode' == flowcont.nodeId && this.$refs.flowForm.flowInstData.isAuthor) {
                    this.isFirstNode = true;
                    if (bizdata.softwareInfoList && bizdata.softwareInfoList[0].fileId) {
                        this.percent = 100;
                    }
                } else {
                    this.isFirstNode = false;
                }

                Object.assign(this.bizData, bizdata);
                if (null != bizdata.softwareInfoList && bizdata.softwareInfoList.length > 0) {
                    this.$set(this.bizData.softwareInfoList[0], 'softRegion', bizdata.softRegion);
                    this.filename = bizdata.softwareInfoList[0].softName;
                }

                if (!this.bizData.softwareInfoList || !this.bizData.softwareInfoList[0].softIconId) {
                    fileUtil.getSoftWareDefaultImg.call(this, id => {
                        this.bizData.softwareInfoList[0].softIconId = id;
                    })
                }

                // if (bizdata.oid) {
                /*this.$nextTick(() => {
                    this.$refs.bizForm.validateField('level', error => {
                    })
                });*/
                // }
                this.authDeptNamesText = bizdata.afOrgName;
                this.dept = this.bizData.authDeptNames;
                this.user = this.bizData.authUserNames;
                if (this.bizData.authUserCodes) {
                    this.selectedPersion = this.bizData.authUserCodes.split(",");
                }
                if (this.bizData.authDeptCodes) {
                    this.selectedDept = this.bizData.authDeptCodes.split(",");
                }
                this.bizData.afUserName = bizdata.afUserName;
                this.bizData.afOrgName = bizdata.afOrgName;
                this.bizData.afPhone = bizdata.afPhone;
            },
            choosePerson() {
                this.$refs.personPop.openDialog();
            },
            /**选人保存按钮*/
            selectPersonConfirm(row) {
                this.bizData.safeCheckUserCode = row[0].code;
                this.bizData.safeCheckUserName = row[0].name;
            },
            selectCannel() {
                this.$refs.persionPop.cleanColumnSelect();
            },
            choosePerson() {
                this.$refs.personPop.openDialog();
            },
            /**选人保存按钮*/
            selectPersonConfirm(row) {
                this.bizData.safeCheckUserCode = row[0].code;
                this.bizData.safeCheckUserName = row[0].name;
            },
            selectCannel() {
                this.$refs.persionPop.cleanColumnSelect();
            },
            cancelSelectUser() {

            },
            selectUserConfirm(rows, texts) {
                let deptName = '';
                let deptCode = '';
                rows.forEach((item) => {
                    deptName += ',' + item.deptName;
                    deptCode += ',' + item.deptCode;
                });
                deptName = deptName.substr(1);
                deptCode = deptCode.substr(1);
                this.dept = deptName;
                let userName = '';
                let userCode = '';
                texts.forEach((item) => {
                    userName += ',' + item.name;
                    userCode += ',' + item.code;
                });
                userName = userName.substr(1);
                userCode = userCode.substr(1);
                this.user = userName;
                this.bizData.authUserCodes = userCode;
                this.bizData.authUserNames = userName;
                this.bizData.authDeptCodes = deptCode;
                this.bizData.authDeptNames = deptName;
                this.selectedDept = deptCode
            },
            selectDeptConfirm(rows, texts, values) {

            },
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            success(response, file, fileList) {
                console.log(response);
                this.percent = 100;
                this.$refs.uploader.reset();
                this.bizData.softwareInfoList[0].softSize = file.size;
                this.bizData.softwareInfoList[0].softSizeKb = fileUtil.fileSizeFormat(file.size);
                this.filename = file.name;
                if (!this.bizData.softwareInfoList[0].softName) {
                    // 如果没有软件名称,自动将文件名设置成软件名
                    file.name = file.name.substring(0, file.name.lastIndexOf('.'));
                    this.bizData.softwareInfoList[0].softName = file.name.substring(0, 30);
                }
                this.bizData.softwareInfoList[0].fileId = response.data;
                this.$nextTick(() => {
                    this.$refs.bizForm.validateField('softwareInfoList[0].fileId', error => {
                    })
                })
            },
            uploadBeforeUpload(file) {
                this.percent = 0;
                this.uploading = true;
                this.bizData.softwareInfoList[0].fileMD5 = file.md5;
            }
        },
        mounted() {
            this.bizData.classifyIdPath = this.$route.query['classifyIdPath'];
            let region = this.$route.query['region'];
            if (null != region && '0' === region) {
                this.bizData.softwareInfoList[0].softRegion = 0;
            } else if (null != region && '1' === region) {
                this.bizData.softwareInfoList[0].softRegion = 1;
            }
            if (this.bizData.classifyIdPath) {
                this.bizData.level = this.bizData.classifyIdPath.split('_')[0];
                this.bizData.softwareInfoList[0].classifyId = this.bizData.classifyIdPath.split('_').reverse()[0];
                this.bizData.classifyIdArray = this.bizData.classifyIdPath.split('_').splice(1);
                if (null != this.bizData.level
                    && 'SHARE' === this.bizData.level
                    && 1 === this.bizData.softwareInfoList[0].softRegion) {
                    this.$refs.classifySelector.loadPickList();
                }
            } else {
                this.$refs.classifySelector.loadPickList();
            }
        }
    }
</script>

<style scoped>
    .upload-btn {
        position: absolute;
        left: 80%;
        width: 120px;
        height: 30px;
        margin-top: 30px;
        text-align: center;
        cursor: pointer;
        z-index: 3;
    }

    .upload-btn:hover {
        color: red;
    }

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
        height: 100px;
        width: 100px;
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

    .upload-progress {
        width: 80%;
        position: absolute;
        margin-top: 2%;
        margin-left: 5%;
        text-align: right;
        z-index: 4;

    }


</style>