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
                    <ice-form-group name="软件详情">
                        <div style="margin-left: 19px;margin-bottom: 2px">
                            <el-button type="primary" @click="add" v-if="!flowScope.formReadonly">新增</el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;height:200px;position: relative;overflow: hidden">
                            <div style="position:absolute;;right: -19px;width: 100%">
                                <ice-editable-table :data="bizData.softwareInfoList" :height="200" style="width: 100%"
                                                    :rules="tableData"
                                                    ref="editTable">
                                    <el-table-column :width="50"
                                                     fixed
                                                     label="序号">
                                        <template slot-scope="scope">
                                            {{scope.$index+1}}
                                        </template>
                                    </el-table-column>
                                    <ice-editable-table-column prop="softName"
                                                               fixed
                                                               :width="200"
                                                               maxlength=64
                                                               :showWordLimit="true"
                                                               input-type="input"
                                                               label="软件名称"
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column prop="softVersion"
                                                               label="版本"
                                                               :width="110"
                                                               maxlength=64
                                                               :showWordLimit="true"
                                                               input-type="input"
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column prop="fromYon"
                                                               label="来源"
                                                               :width="180"
                                                               input-type="select"
                                                               map-type-code="SOFTWARE_FROM_YON"
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>
                                    <ice-editable-table-column prop="publishAuthor"
                                                               label="发布者"
                                                               :showWordLimit="true"
                                                               maxlength=64
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>

                                    <ice-editable-table-column prop="softIconId"
                                                               :width="150"
                                                               label="图标">
                                        <template slot-scope="scope">
                                            <ice-image-uploader v-model="scope.row.softIconId" :height="46" :width="75"
                                                                v-if="!flowScope.formReadonly"
                                                                @uploadChange="$nextTick(()=>{$refs.editTable.validateField(scope.$index,'softIconId')})">

                                            </ice-image-uploader>
                                            <img v-if="flowScope.formReadonly" :src="$showImage(scope.row.softIconId)"
                                                 width="74px" height="46px"/>
                                        </template>
                                    </ice-editable-table-column>
                                    <el-table-column prop="size"
                                                     label="文件大小">
                                    </el-table-column>

                                    <el-table-column width="120"
                                                     label="上传进度" v-if="!flowScope.formReadonly">
                                        <template slot-scope="scope">
                                            <el-progress :percentage="scope.row.percent"
                                                         :status="scope.row.percent > 99?'success':''"
                                                         style="width: 100%;padding-right: 0"
                                                         v-show="scope.row.uploading"></el-progress>
                                        </template>
                                    </el-table-column>
                                    <ice-editable-table-column prop="keywords"
                                                               label="关键字"
                                                               maxlength="128"
                                                               :showWordLimit="true"
                                                               placeholder="关键字之间用逗号间隔"
                                                               :disabled="flowScope.formReadonly">
                                    </ice-editable-table-column>

                                    <ice-editable-table-column prop="supportOsCode"
                                                               :width="350"
                                                               label="适配系统">
                                        <template slot-scope="scope">
                                            <ice-select placeholder="适配系统" map-type-code="SOFT_OS" multiple
                                                        v-if="!flowScope.formReadonly"
                                                        collapse-tags
                                                        style="width: 100%"
                                                        :text.sync="scope.row.supportOsName"
                                                        v-model="scope.row.supportOsCode"
                                                        valueModel="string"
                                                        :disabled="flowScope.formReadonly">
                                            </ice-select>
                                            <el-input :readonly="flowScope.formReadonly"
                                                      v-if="flowScope.formReadonly"
                                                      v-model="scope.row.supportOsName"></el-input>
                                        </template>
                                    </ice-editable-table-column>

                                    <el-table-column label="操作" width="150"
                                                     v-if="flowScope.formReadonly&& !flowScope.isEndNode" fixed="right">
                                        <template slot-scope="scope">
                                            <el-button type="text"
                                                       size="small" @click="downloadLook(scope.row.fileId)">下载查看
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作" width="150" v-if="!flowScope.formReadonly"
                                                     fixed="right">
                                        <template slot-scope="scope">
                                            <!--<el-progress :percentage="scope.row.percent"-->
                                            <!--:status="scope.row.percent > 99?'success':'exception'"-->
                                            <!--style="width: 100%"-->
                                            <!--v-show="scope.row.uploading"></el-progress>-->
                                            <ice-single-upload v-model="scope.row.fileId"
                                                               :ref="scope.$index"
                                                               :before-upload="(file)=>{
                                                                    beforeUpload(file,scope)
                                                               }" :progress="(event)=>{
                                                               scope.row.percent=Number(Number(event.percent).toFixed(0))
                                                               }"
                                                               :on-success="(response)=>{return success(response,scope)}">
                                                <el-button type="text" size="small">上传
                                                </el-button>
                                            </ice-single-upload>&nbsp;
                                            <el-button type="text"
                                                       size="small" @click="deleteDetailItem(scope.$index)">删除
                                            </el-button>
                                            <el-button type="text" v-if="scope.row.fileId"
                                                       size="small" @click="downloadLook(scope.row.fileId)">下载
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </ice-editable-table>
                            </div>
                        </div>
                        <!--<div class="grid-bar" style="width: 100%">-->

                        <!--</div>-->

                    </ice-form-group>
                    <ice-grid-layout :columns="3" name="申请原因">
                        <br/>
                        <el-form-item label="是否查杀" label-width="80px" layout="1" prop="safeCheck"
                                      title="已对安装文件进行计算机病毒与恶意代码查杀、查验">
                            <el-checkbox :disabled="flowScope.formReadonly" border false-label="0"
                                         label="已经过病毒与恶意代码查杀" style="color: #333" true-label="1"
                                         v-model="bizData.safeCheck"></el-checkbox>
                        </el-form-item>
                        <el-form-item label="查杀工具" prop="safeCheckTool" title="计算机病毒与恶意代码查杀工具"
                                      layout="1" label-width="80px">
                            <el-input placeholder="查杀工具" type="input" v-model="bizData.safeCheckTool" maxlength=64
                                      :showWordLimit="true" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="检查人" title="计算机病毒与恶意代码查杀工具"
                                      prop="safeCheckUserCode" layout="1" label-width="80px">
                            <el-input placeholder="请选择检查人" type="input" v-model="bizData.safeCheckUserName"
                                      :disabled="flowScope.formReadonly" readonly>
                                <el-button :disabled="flowScope.formReadonly" @click="choosePerson" icon="el-icon-more"
                                           slot="append"
                                           title="点我选择检查人"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="软件描述" prop="softDescribe" layout="3" label-width="80px">
                            <el-input type="textarea" :rows="5" placeholder="请输入内容" ref="myTextEditor"
                                      :showWordLimit="true" maxlength=300 v-model="bizData.softDescribe"
                                      :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="申请原因" prop="afReason" layout="3" label-width="80px">
                            <el-input :disabled="flowScope.formReadonly" maxlength=128 placeholder="填写类容不超过128个字"
                                      rows="3" type="textarea" v-model="bizData.afReason"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="授权信息">
                        <el-form-item label="级别" prop="softRegion" label-width="80px" layout="1">
                            <el-select placeholder="请选择" v-model="bizData.softRegion"
                                       :disabled="flowScope.formReadonly"
                                       @change="bizData.classifyIdArray=[]">
                                <el-option
                                        v-for="item in softRegions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类别" prop="level" label-width="80px" layout="1">
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
                        <el-form-item label="分类" prop="classifyIdArray" label-width="80px" layout="1">
                            <el-input :disabled="true" v-if="flowScope.formReadonly"
                                      v-model="bizData.classifyName"></el-input>
                            <application-classify-selector @textvalue="classifyIdChange"
                                                           v-if="!flowScope.formReadonly"
                                                           ref="classifySelector"
                                                           :disabled="flowScope.formReadonly"
                                                           :level="bizData.level"
                                                           :region="bizData.softRegion"
                                                           v-model="bizData.classifyIdArray">
                            </application-classify-selector>
                        </el-form-item>
                        <el-form-item label="是否使用授权" prop=""
                                      v-if="bizData.level=='MAINTAIN'"
                                      label-width="80px" layout="3">
                            <el-select placeholder="请选择" v-model="bizData.downloadAuth"
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
                            <el-button icon="el-icon-edit-outline" style="color: #dd6161" @click="chooseItem"
                                       :disabled="flowScope.formReadonly">
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
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceDeptPersionSelector from "../../../components/common/biz/IceDeptPersionSelector";
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "AppcationIntoDepotMore",
        components: {
            IceDeptPersionSelector,
            IceFormGroup,
            IceSelect,
            quillEditor,
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
                quillOptions: {
                    placeholder: '请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                rules: {
                    softDescribe: [{required: true, whitespace: true, message: '请输入软件描述', trigger: 'blur'}],
                    afReason: [{required: true, whitespace: true, message: '请输入申请原因', trigger: 'blur'}],
                    softRegion: [{required: true, message: '请输入软件级别', trigger: 'blur'}],
                    level: [{required: true, message: '请输入软件类别', trigger: 'blur'}],
                    classifyIdArray: [{required: true, message: '请输入软件分类', trigger: 'change'}],
                    safeCheck: [{required: true, validator: safeCheckValidate, trigger: 'change'}],
                    safeCheckTool: [{required: true, whitespace: true, message: '请输入检查工具', trigger: 'blur'}],
                    safeCheckUserCode: [{required: true, whitespace: true, message: '请选择检查人', trigger: 'blur'}],
                },
                tableData: {
                    softName: {required: true, whitespace: true, message: '请输入软件名称', trigger: 'blur'},
                    keywords: {required: true, whitespace: true, message: '请输入关键字', trigger: 'blur'},
                    softVersion: {required: true, whitespace: true, message: '请输入软件版本', trigger: 'blur'},
                    /*softSize: [{required: true, message: '请输入软件大小', trigger: 'blur'}],*/
                    fromYon: {required: true, whitespace: true, message: '请输入软件来源', trigger: 'blur'},
                    softIconId: {required: true, whitespace: true, message: '附件必须上传'}
                },
                selectedPersion: [],
                selectedDept: [],
                dept: '',
                user: '',
                authDeptNamesText: '',
                bizData: {
                    softRegion: 1,
                    authUserCodes: '',
                    specialDept: '',
                    afUserCode: '',
                    afUserName: '',
                    afPhone: '',
                    afReason: '',
                    softDescribe: '',
                    downloadAuth: 0,
                    level: 'SHARE',
                    safeCheck: 0,
                    safeCheckTool: '',
                    safeCheckUserCode: [],
                    safeCheckUserName: '',
                    softwareInfoList: [],
                    dynamicDeptTags: [],
                    dynamicUserTags: [],
                    classifyIdArray: [],
                    classifyArray: []
                },
                classifyName: '',
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
                classifyIdProps: {
                    value: 'oid',
                    label: 'classifyName',
                    children: 'children'
                },
                isyunwei: false,
                defaultImg: '',
            }
        },
        methods: {
            /**当类别发生变化时，清空部门岗位的值*/
            levelChange() {
                if (this.bizData.level != 'AUTH') {
                    this.bizData.authUserCodes = '';
                    this.bizData.authUserNames = '';
                    this.bizData.authDeptCodes = '';
                    this.bizData.authDeptNames = '';
                }
                if (this.bizData.level != 'MAINTAIN') {
                    this.bizData.downloadAuth = 0;
                }
                this.bizData.classifyIdArray = []
            },
            success(response, scope) {
                this.$refs[scope.$index].reset();
                this.bizData.softwareInfoList[scope.$index].fileId = response.data;
                this.bizData.softwareInfoList[scope.$index].percent = 100;
                let obj = [];
                Object.assign(obj, this.bizData.softwareInfoList);
                this.bizData.softwareInfoList = [];
                this.bizData.softwareInfoList = obj;
            },
            downloadLook(id) {
                this.$downloadFile(id);
            },
            beforeUpload(file, scope) {
                scope.row.percent = 0;
                this.$set(scope.row, 'uploading', true);
                // if(!scope.row.softName){
                //     this.$set(scope.row, 'softName', file.name.substring(0,30));
                // }
                this.$set(scope.row, 'fileMD5', file.md5);
                this.$set(scope.row, 'softSize', file.size);
                this.$set(scope.row, 'size', fileUtil.fileSizeFormat(file.size));
            },
            flowBizData() {
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
                if (flowContext.nodeId === "FirstNode") {
                    this.bizData.classifyId = this.bizData.classifyIdArray[this.bizData.classifyIdArray.length - 1];
                    //同批软件校验
                    // this.bizData.softwareInfoList.splice(index, 1);
                    this.bizData.softwareInfoList.forEach(e => {
                        let softcons = this.bizData.softwareInfoList.filter(v => v.softName == e.softName && v.softVersion == e.softVersion);
                        if (softcons.length > 1) {
                            this.$message({
                                type: 'warning',
                                message: softcons[0].softName + ',软件重复'
                            });

                            return false;
                        }

                    })
                }
                this.bizData.softwareInfoList.forEach(item => {
                    if (!item.softDescribe) {
                        item.softDescribe = this.bizData.softDescribe;
                    }
                });
                this.$refs.editTable.validateAll((valid) => {
                    let isOk = true;
                    let validData = this.$refs.editTable.data.filter(data => data.fileId != "");
                    if (validData.length === 0) {
                        this.$message({
                            type: 'warning',
                            message: '软件不能为空'
                        });
                        isOk = false;
                    }
                    formValid = formValid && valid && isOk;
                });
                return formValid;
            },
            add() {
                this.bizData.softwareInfoList.push({
                    softName: '',
                    softVersion: '',
                    softIconId: this.defaultImg + '',
                    fromYon: 'INTERNET',
                    publishAuthor: '',
                    keywords: '',
                    softSize: 0,
                    fileId: '',
                    uploading: false,
                    percent: 0
                });
            },
            deleteDetailItem(index) {
                this.bizData.softwareInfoList.splice(index, 1);
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
                Object.assign(this.bizData, bizdata);
                if (this.bizData.classifyIdPath) {
                    this.bizData.level = this.bizData.classifyIdPath.split('_')[0];
                    this.bizData.classifyIdArray = this.bizData.classifyIdPath.split('_').splice(1);
                }
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
            cancelSelectUser() {

            },
            /*selectUserConfirm(rows, texts, values) {
                this.bizData.authUserCodes = '';
                this.bizData.authUserNames = '';
                this.bizData.authUserCodes += values;
                this.bizData.authUserNames += texts;
            },*/
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
            chooseItem() {
                this.$nextTick(() => {
                    this.$refs.persionPop.openDialog();
                })
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
                this.bizData.authDeptCodes = '';
                this.bizData.authDeptNames = '';
                this.bizData.authDeptCodes += values;
                this.bizData.authDeptNames += texts;
            },
            classifyIdChange(text) {
                this.bizData.classifyName = text;
            }
        },
        mounted() {
            let classifyIdPath = this.$route.query['classifyIdPath'];
            let region = this.$route.query['region'];
            if (null != region && '0' === region) {
                this.bizData.softRegion = 0;
            } else if (null != region && '1' === region) {
                this.bizData.softRegion = 1;
            }
            if (classifyIdPath) {
                this.bizData.level = classifyIdPath.split('_')[0];
                this.bizData.classifyIdArray = classifyIdPath.split('_').splice(1);
                if (null != this.bizData.level
                    && 'SHARE' === this.bizData.level
                    && 1 === this.bizData.softRegion) {
                    this.$refs.classifySelector.loadPickList();
                }
            } else {
                this.$refs.classifySelector.loadPickList();
            }
            fileUtil.getSoftWareDefaultImg.call(this, id => {
                this.defaultImg = id;
            })
        },
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

    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 90px;
        width: 100%;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;
    }
</style>