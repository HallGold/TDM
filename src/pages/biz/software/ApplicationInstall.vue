<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesInstall" ref="bizForm" label-width="140px">
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人" label-width="100px" prop="afUserName">
                            <el-input v-model="mainData.afUserName" disabled placeholder="申请人"></el-input>
                        </el-form-item>

                        <el-form-item label="部门" label-width="100px" prop="afDepartmentName">
                            <el-input disabled placeholder="部门"
                                      v-model="mainData.afOrgName+'-'+mainData.afDepartmentName"></el-input>
                        </el-form-item>

                        <el-form-item label="电话" label-width="100px" prop="afPhone">
                            <el-input v-model="mainData.afPhone" disabled placeholder="电话"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="软件详情">
                        <el-form-item label="软件名称" label-width="100px" prop="softName">
                            <el-autocomplete
                                    :maxlength="18"
                                    :showWordLimit="true"
                                    popper-class="my-autocomplete"
                                    v-model="mainData.softName"
                                    :fetch-suggestions="querySearchSoft"
                                    :disabled="(id && isNodeFirst == 'FirstNode')?true:flowScope.formReadonly"
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
                        <el-form-item label="版本" label-width="100px" prop="softVersion">
                            <el-input :disabled="(id && isNodeFirst == 'FirstNode')?true:flowScope.formReadonly"
                                      v-model="mainData.softVersion"
                                      placeholder="版本" maxlength="18"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                        <el-form-item label="来源" label-width="100px" prop="fromYon">
                            <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                        @change="$nextTick(()=>{$refs.bizForm.validateField('fromYon',error=>{})})"
                                        :disabled="(id && isNodeFirst == 'FirstNode')?true:flowScope.formReadonly"
                                        v-model="mainData.fromYon">
                            </ice-select>
                        </el-form-item>
                        <el-form-item label="申请原因" label-width="100px" prop="afReason" layout="3">
                            <el-input :disabled="flowScope.formReadonly" rows="3" type="textarea"
                                      v-model="mainData.afReason"
                                      maxlength="128" placeholder="填写内容不超过128个字"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                        <el-form-item label="软件描述" label-width="100px" prop="softDescribe" layout="3">
                            <el-input :disabled="(id && isNodeFirst == 'FirstNode')?true:flowScope.formReadonly"
                                      :rows="5"
                                      :showWordLimit="true" maxlength=300 placeholder="请输入内容" ref="myTextEditor"
                                      type="textarea"
                                      v-model="mainData.softDescribe"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="安装设备" v-show="false">
                        <div v-if="!flowScope.formReadonly" style="margin-bottom: 2px">
                            <el-button type="primary" @click="add">新增设备</el-button>
                        </div>
                        <div v-if="!flowScope.formReadonly" style="margin-bottom: 2px;margin-left: 10px">
                            <!--<el-button type="primary" @click="chooseDev" >选择设备</el-button>-->
                        </div>

                        <div class="grid-bar" style="width: 100%;">
                            <ice-editable-table :data="mainData.eqs" style="width: 100%" v-model="mainData.eqs"
                                                ref="editTable" :rules="editRules">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="deviceCode"
                                                           :disabled="flowScope.formReadonly"
                                                           input-type="input" label="设备编号">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceName"
                                                           :disabled="flowScope.formReadonly"
                                                           input-type="input" label="设备名称">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceType"
                                                           :disabled="flowScope.formReadonly"
                                                           input-type="input" label="设备类型">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceIp"
                                                           :disabled="flowScope.formReadonly"
                                                           input-type="input" label="设备IP">

                                </ice-editable-table-column>
                                <!--<ice-editable-table-column prop="deviceLocation"-->
                                <!--label="位置"-->
                                <!--input-type="input" :disabled="flowScope.formReadonly">-->
                                <!--</ice-editable-table-column>-->
                                <ice-editable-table-column :width="380" label="位置" prop="deviceLocation"
                                                           type="input">
                                    <template slot-scope="scope">
                                        <el-input style="width:15%" v-show="false"
                                                  v-model="scope.row.deviceLocation">
                                        </el-input>
                                        <el-input :disabled="flowScope.formReadonly" style="width:25%"
                                                  @change="scope.row.deviceLocation=scope.row.currentPlace1+'-'+scope.row.currentPlace2+'-'+scope.row.currentPlace3+'-'+scope.row.currentPlace4"
                                                  v-model="scope.row.currentPlace1">
                                        </el-input>&nbsp;-&nbsp;
                                        <el-input :disabled="flowScope.formReadonly" style="width:25%"
                                                  @change="scope.row.deviceLocation=scope.row.currentPlace1+'-'+scope.row.currentPlace2+'-'+scope.row.currentPlace3+'-'+scope.row.currentPlace4"
                                                  v-model="scope.row.currentPlace2">
                                        </el-input>&nbsp;-&nbsp;
                                        <el-input style="width:25%" :disabled="flowScope.formReadonly"
                                                  @change="scope.row.deviceLocation=scope.row.currentPlace1+'-'+scope.row.currentPlace2+'-'+scope.row.currentPlace3+'-'+scope.row.currentPlace4"
                                                  v-model="scope.row.currentPlace3">
                                        </el-input>&nbsp;-&nbsp;
                                        <el-input :disabled="flowScope.formReadonly" style="width:25%"
                                                  @change="scope.row.deviceLocation=scope.row.currentPlace1+'-'+scope.row.currentPlace2+'-'+scope.row.currentPlace3+'-'+scope.row.currentPlace4"
                                                  v-model="scope.row.currentPlace4">
                                        </el-input>
                                    </template>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceUser"
                                                           :disabled="flowScope.formReadonly"
                                                           input-type="input" label="责任人">
                                </ice-editable-table-column>
                                <el-table-column label="操作" v-if="!flowScope.formReadonly" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                    <ice-grid-layout :columns="3" name="处理回执单" v-if="handleVisible">
                        <el-form-item label="回执处理选项" label-width="100px" prop="phone" layout="3">
                            <ice-select placeholder="选择回执处理选项" map-type-code="SOFTWARE_HANDLE_STA"
                                        v-model="mainData.handleSta" @change="handleChange"
                                        :disabled-list="handleSelectDisabledList">
                            </ice-select>
                        </el-form-item>
                        <el-form-item label="选择授权软件" label-width="100px" layout="3" prop="softName"
                                      v-if="mainData.handleSta=='SUCCAUTH'">
                            <el-autocomplete
                                    popper-class="my-autocomplete"
                                    v-model="mainData.softNameTemp"
                                    :fetch-suggestions="querySearch"
                                    placeholder="软件名称"
                                    @select="handleSelect">
                                <template slot-scope="{ item }">
                                    <div style="border-bottom: dashed 1px #c73c41;">
                                        <div class="softName">{{ item.softName }}</div>
                                        <span class="softVersion" style="">版本:{{ item.softVersion }}</span>
                                        <span class="softVersion" style="">{{ item.classifyNamePath }}</span><br/>
                                        <span class="softVersion" style="color: red;"
                                              v-if="item.downloadAuthResult == 1">申请人已有权限</span>
                                    </div>
                                </template>
                            </el-autocomplete>
                            <template v-if="typeof(mainData.softwareId) == 'string' && mainData.softwareId.length > 0">
                                已选择授权软件:{{mainData.softNameTemp}}
                                <el-button @click="handleSelectDelete" circle icon="el-icon-delete"
                                           type="danger"></el-button>
                            </template>
                            &nbsp;<span style="color: #67c23a">*该环节提交后系统自动授权</span>
                        </el-form-item>
                        <el-form-item label="摆渡申请编号" label-width="100px" prop="handleFerryNo" layout="1"
                                      v-if="mainData.handleSta=='SUCCBD'">
                            <el-input v-model="mainData.handleFerryNo" placeholder="摆渡申请编号"></el-input>
                        </el-form-item>
                        <el-form-item label="安装文件" prop="specialPerson" layout="1" label-width="100px"
                                      v-if="mainData.handleSta=='SUCCBD'">
                            <el-button icon="el-icon-upload2" style="color: #85ce61" @click="upLoadFile"><span
                                    style="color: #222222">点击上传</span></el-button>
                        </el-form-item>
                        <el-form-item label="已上传" prop="specialPerson" layout="1" label-width="100px"
                                      v-if="mainData.softwareInfo != undefined && mainData.softwareInfo != null && mainData.softwareInfo.fileId && 　mainData.handleSta=='SUCCBD'">
                            {{mainData.softwareInfo?''+mainData.softwareInfo.softName.substring(0,10)+'...，大小:'+mainData.softwareInfo.softSizeKb:''}}
                        </el-form-item>
                        <el-form-item label="处理备注" label-width="100px" prop="handleMark" layout="3">
                            <el-input maxlength="18" rows="3" type="textarea" v-model="mainData.handleMark"
                                      :showWordLimit="true"
                                      placeholder="处理消息"></el-input>
                        </el-form-item>
                        <el-form-item label="处理消息" label-width="100px" prop="handleMsg" layout="3">
                            <el-input type="textarea" rows="3" v-model="mainData.handleMsg" maxlength="256"
                                      :showWordLimit="true"
                                      placeholder="处理消息"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="回执详情" v-if="handleViewVisible">
                        <el-form-item label="办理状态" label-width="100px" prop="fileId">
                            {{mainData.handleSta == 'FAIL'?'失败':'成功'}}
                        </el-form-item>
                        <el-form-item label="附件下载" label-width="100px" prop="fileId"
                                      v-if="mainData.handleSta != 'FAIL' && mainData.handleFileId != null && !flowScope.isEndNode">
                            <el-button icon="el-icon-download" style="color: #85ce61"
                                       @click="downLoadVis(mainData.handleFileId)">
                                <span style="color: #222222">下载附件</span>
                            </el-button>
                            附件名称：{{mainData.softwareInfo.softName?mainData.softwareInfo.softName:mainData.softNameTemp}}
                        </el-form-item>
                        <el-form-item label="已授权" label-width="100px" prop="handleSta"
                                      v-if="mainData.handleSta != 'FAIL' && mainData.softwareId">
                            {{mainData.softName}}。
                        </el-form-item>
                        <el-form-item label="回执消息" label-width="100px" prop="handleMsg" v-if="mainData.handleMsg">
                            {{mainData.handleMsg}}。
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>

        </ice-flow-form>
        <div>
            <appaction-edit ref="edit" @app-edit="AppEdit"></appaction-edit>
            <!--   <dev-select :ref="PAGE_ENUM.REFS.DEV_SELECT.REF"
                           v-if="PAGE_ENUM.REFS.DEV_SELECT.SHOW"
                           :multiple="true"
                           :get-all-dev-info="true"
                           width="1200px"
                           :on-close-handler="selectOverHandler"></dev-select>-->
        </div>
    </div>
</template>

<script>

    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import AppactionEdit from "./AppactionEdit"
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import common from '@/utils/common.js';
    import DevSelect from "@/pages/biz/dev/devSelect";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import devComm from "../dev/js/comm/devComm"
    import bizComm from "@/pages/biz/js/comm";

    export default {
        name: "ApplicationInstall",
        components: {
            IceFormGroup,
            quillEditor,
            IceSelect,
            IceSingleUpload,
            IceGridLayout,
            IceFlowForm,
            IceEditableTableColumn,
            IceEditableTable,
            AppactionEdit,
            DevSelect
        },
        mixins: [bizComm, devComm, renderer],
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
                //枚举
                ENUMS: {
                    /**
                     * 网络区域类型分隔符
                     */
                    NET_SEPARATOR: () => {
                        return "__";
                    }
                },
                quillOptions: {
                    placeholder: '请输入软件描述...',
                    modules: {
                        toolbar: [['bold', 'italic', 'underline', 'strike'], ['blockquote', 'code-block'], [{'align': []}]]
                    },
                },
                mainData: {
                    softName: "",
                    softVersion: "",
                    softNameTemp: "",
                    fromYon: "",
                    handleSta: "",
                    afReason: "",
                    softDescribe: "",
                    isMaintain: 0,
                    softwareInfo: {},
                    handleMark: '',
                },
                dialogVisible: false,
                handleVisible: false,
                handleViewVisible: false,
                rulesInstall: {
                    softName: [{required: true, whitespace: true, message: '请输入名称', trigger: 'blur'}],
                    softVersion: [{required: true, whitespace: true, message: '请输入版本', trigger: 'blur'}],
                    afReason: [{required: true, whitespace: true, message: '请输入申请原因', trigger: 'blur'}],
                    softDescribe: [{required: true, whitespace: true, message: '请输入软件描述', trigger: 'blur'}],
                    fromYon: [{required: true, message: '请输入软件来源', trigger: 'blur'}]
                },
                restaurants: [],
                softName: '',
                handleSelectDisabledList: [],
                editRules: {
                    deviceCode: {required: true, whitespace: true, message: '请输入设备编号', trigger: 'blur'},
                    deviceName: {required: true, whitespace: true, message: '请输入设备名称', trigger: 'blur'},
                    deviceType: {required: true, whitespace: true, message: '请输入设备类型', trigger: 'blur'},
                    deviceIp: {required: true, whitespace: true, message: '请输入设备IP', trigger: 'blur'},
                    deviceLocation: {required: true, whitespace: true, message: '请输入位置', trigger: 'blur'},
                    deviceUser: {required: true, whitespace: true, message: '请输入责任人', trigger: 'blur'}
                },
                id: '',
                isNodeFirst: '',
                PAGE_ENUM: {
                    REFS: {
                        DEV_SELECT: {REF: "devSelect", SHOW: false},
                        FORM: {REF: "form"}
                    }
                }
            }
        },
        methods: {
            AppEdit(data) {
                this.$set(this.mainData, "softwareInfo", data);
                this.handleChange();
            },
            flowReady(flowcont, bizdata) {
                Object.assign(this.mainData, bizdata);
                this.id = this.$route.query['oid'];
                if (null == this.id || '' === this.id) {
                    this.id = bizdata.oid;
                }
                this.isNodeFirst = flowcont.nodeId;
                if (this.id && !bizdata.oid) {
                    this.$axios.get("/biz/BizSoftwareInfo/get", {params: {id: this.id}})
                        .then(result => {
                            this.$set(this.mainData, "softwareId", result.data.oid + '');
                            this.$set(this.mainData, "softName", result.data.softName + '');
                            this.$set(this.mainData, "softVersion", result.data.softVersion + '');
                            this.$set(this.mainData, "softDescribe", result.data.softDescribe + '');
                            this.$set(this.mainData, "fromYon", result.data.fromYon + '');
                        })
                } else if (!bizdata.oid) {
                    this.$axios.get("/biz/BizSoftwareConstant/auth/user").then(authData => {
                        this.mainData.isMaintain = authData.data.is_maintain || authData.data.is_maintain ? 1 : 0
                    })

                }
                if (flowcont.nodeId == 'node4' && this.$refs.flowForm.flowInstData.isAuthor) {//运维人员办理
                    this.handleVisible = true;
                    if (this.mainData.softwareId) {//如果有ID 这默认选择授权处理
                        this.mainData.handleSta = 'SUCCAUTH';
                        this.handleSelectDisabledList.push('SUCCBD');
                    } else {
                        this.mainData.handleSta = 'SUCCBD';
                    }
                    this.$set(this.mainData, "softNameTemp", this.mainData.softName + '');
                    this.handleChange();
                }
                if (flowcont.nodeId == 'node5') {//申请人回执
                    this.handleViewVisible = true;
                }
                // console.log(flowcont)
                if (flowcont.nodeId == 'EndEvent') {//流程结束
                    this.handleViewVisible = true;
                }
                this.mainData.eqs = this.mainData.eqs ? this.mainData.eqs : [];
                this.mainData.softNameTemp = this.mainData.softNameTemp ?
                    this.mainData.softNameTemp : this.mainData.softName + '';
            },
            flowOperateBtn(flowcont, bizdata) {
                if (flowcont.operateType == 'save') {
                    return true;
                }
                let isTrue = false;
                this.$refs['bizForm'].validate((valid) => {
                    isTrue = valid;
                });
                this.$refs.editTable.validateAll((valid) => {
                    let isOk = true;
                    // if(this.$refs.editTable.data.length==0){
                    //     this.$message({
                    //         type: 'warning',
                    //         message: '安装设备不能为空'
                    //     });
                    //     isOk = false;
                    // }
                    isTrue = valid && isTrue && isOk;
                });
                if (flowcont.nodeId == 'FirstNode') {//安装软件校验
                    // this.$axios.get("/biz/BizSoftwareInfo/listByName", {
                    //     "params": {
                    //         "name": this.mainData.softNameTemp
                    //         , "userCode": this.mainData.afUserCode, "orgCode": '999', "auth": 0
                    //     }
                    // }).then(success => {
                    //     this.mainData.softwareId = '';
                    //     cb(success.data);
                    // }).catch(error => {
                    //     this.$message.error(error);
                    // });
                }
                if (flowcont.nodeId == 'node4') {
                    if (!this.mainData.handleSta) {
                        this.$message.error('请选择回执单处理结果');
                        return false;
                    }
                    if (this.mainData.handleSta == 'SUCCAUTH' && !this.mainData.softwareId) {
                        this.$message.error('请选择授权软件');
                        return false;
                    }
                    if (this.mainData.handleSta == 'SUCCBD') {
                        // if (!this.mainData.handleFerryNo) {
                        //     this.$message.error('请输入摆渡入网单号');
                        //     return false;
                        // }
                        if (!this.mainData.softwareInfo) {
                            this.$message.error('请上传摆渡入网的软件');
                            return false;
                        }
                        if (!this.mainData.softwareInfo.fileId) {
                            this.$message.error('请上传摆渡入网的软件');
                            return false;
                        }
                    }
                }
                return isTrue;
            },
            flowBizData() {
                return this.mainData;
            },
            add() {
                this.mainData.eqs.push({
                    fileId: '',
                    valueCode: '',
                    name: '',
                    enabled: '',
                    remark: '',
                    uploading: false,
                    percent: 0,
                    deviceUser: this.mainData.afUserName
                });
            },
            /**删除下拉的值*/
            deleteDetailItem(index) {
                this.mainData.eqs.splice(index, 1);
            },
            /**此方法为替换，用于上移或下移操作*/
            swapArray(arr, index1, index2) {
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },
            /**上移*/
            moveup(index) {
                if (index != 0) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index - 1);
                }
            },
            /**下移*/
            movedown(index) {
                if (index + 1 != this.detailGridData.length) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index + 1);
                }
            },
            /**下载文件*/
            downLoadVis(id) {
                this.$downloadFile(id)
            },
            save() {

            },
            saveUp() {

            },
            closeDialog() {

            },
            /**上传文件同时入库*/
            upLoadFile() {
                if (!this.mainData.softwareInfo.fileId) {
                    let temp = common.copy({
                        c: false, pros: ['softName', 'softVersion', 'softDescribe']
                    }, this.mainData.softwareInfo, this.mainData)
                    Object.assign(this.mainData.softwareInfo, temp);
                }
                this.$set(this.$refs.edit, "mainDataForm", Object.assign(this.$refs.edit.mainDataForm, this.mainData.softwareInfo));
                // if (!this.$refs.edit.mainDataForm.softName) {
                //     this.$set(this.$refs.edit, "mainDataForm", this.mainData.softwareInfo);
                // }
                this.$refs.edit.openDialogEdit();
            },
            querySearch(queryString, cb) {
                if (!this.mainData.softNameTemp || this.mainData.softNameTemp.length == 0) {
                    cb([]);
                    return;
                }
                this.$axios.get("/biz/BizSoftwareInfo/listByName", {
                    "params": {
                        "name": this.mainData.softNameTemp
                        , "userCode": this.mainData.afUserCode, "orgCode": this.mainData.afOrgCode,
                        "deptCode": this.mainData.afDepartmentCode
                    }
                }).then(success => {
                    this.mainData.softwareId = '';
                    cb(success.data);
                }).catch(error => {
                    this.$message.error(error);
                });
            },
            handleSelect(item) {
                if (item.downloadAuthResult == 1) {
                    this.mainData.softNameTemp = item.softName;
                    this.$message.error('申请人已有' + item.softName + '的下载权限,无需再次授权！');
                    return;
                }
                this.mainData.softwareId = item.oid;
                this.mainData.softNameTemp = item.softName;
                this.handleChange();
            },
            handleSelectDelete() {
                this.mainData.softwareId = '';
                this.mainData.softNameTemp = '';
            },
            querySearchSoft(queryString, cb) {
                if (!this.mainData.softName || this.mainData.softName.length == 0) {
                    cb([]);
                    return;
                }

                this.$axios.get("/biz/BizSoftwareInfo/listByName", {
                    "params": {
                        "name": this.mainData.softName
                        , "userCode": this.mainData.afUserCode, "orgCode": this.mainData.afOrgCode
                        , "deptCode": this.mainData.afDepartmentCode, "auth": 0
                    }
                }).then(success => {
                    this.mainData.softwareId = '';
                    // this.mainData.softVersion = '';
                    // this.mainData.softDescribe = '';
                    cb(success.data);
                }).catch(error => {
                    this.$message.error(error);
                });
            },
            handleSelectSoft(item) {
                this.mainData.softwareId = item.oid;
                this.$set(this.mainData, "softName", item.softName);
                this.$set(this.mainData, "softVersion", item.softVersion);
                this.$set(this.mainData, "softDescribe", item.softDescribe);
            },
            handleChange(item) {
                if (!item) {
                    item = this.mainData.handleSta;
                }
                if (item == 'SUCCAUTH' && this.mainData.softwareId) {
                    this.mainData.handleMsg = '已为申请人授权软件的下载权限，请在软件库中搜索下载。';
                } else if (item == 'FAIL' && !this.mainData.softwareId) {
                    this.mainData.handleMsg = '摆渡入网失败，没有找到此软件。';
                } else if (item == 'FAIL' && this.mainData.softwareId) {
                    this.mainData.handleMsg = '软件授权失败。';
                } else if (item == 'SUCCBD' && this.mainData.softwareInfo && this.mainData.softwareInfo.fileId) {
                    this.mainData.handleMsg = '摆渡入网成功，请在软件库中搜索下载。';
                }
            },
            /**
             * 设备选择页面关闭事件
             * @param data
             */
            selectOverHandler(data) {
                console.log(data)
                let _this = this;
                // this.mainData.eqs
                return new Promise((resolve, reject) => {
                    data.forEach(item =>{
                        let _data = {}
                        if(item.currentPlace){
                            _data.deviceLocation = item.currentPlace
                            _this.setCurrentPlace(_data);
                        }

                        _data.deviceCode = item.devSn
                        _data.deviceName = item.name
                        _data.deviceIp = item.masterIp
                        _data.deviceUser = item.dutyName
                        _data.deviceType = this.categoryFormatter(item.category)
                        // _data.deviceTypeName = this.categoryFormatter(item.category)
                        // _data.deviceLocation = item.currentPlace
                        _this.mainData.eqs.push(_data)
                    })
                    resolve();
                    _this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = false;
                });
            },
            /**
             * 设置放置地点
             */
            setCurrentPlace(data) {
                if (data.deviceLocation) {
                    let placeStr = data.deviceLocation;
                    if (placeStr) {
                        let place = data.deviceLocation.split(this.ENUMS.NET_SEPARATOR());
                        data.currentPlace1 = place[0];
                        data.currentPlace2 = place[1];
                        if (place[2]) {
                            data.currentPlace3 = place[2];
                        }
                        if (place[3]) {
                            data.currentPlace4 = place[3];
                        }
                    }
                }
            },
            chooseDev(){
                this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_SELECT.REF].openDialog();
                });
            },
            /**
             * 设别类型的渲染
             * @param row
             * @param column
             * @param cellValue
             * @param index
             * @returns {*|Array}
             */
            categoryFormatter(category) {
                return this.onCategoryRenderer(category);
            },
        },
        mounted() {
            //TODO 临时屏蔽设备相关，后期请恢复
            /*  let prepareTaskChain = [
                  // this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE, this.ENUMS.DATA_DICTIONARY.USE_FOR_TWO.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                  this.requestCategoryData(),
                  // this.requestNetAreaTypeData()
              ];
              Promise.all(prepareTaskChain).then();*/
        }
    }
</script>

<style scoped lang="less">
    .install {
        text-align: center;
    }

    .file-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        height: 90px;
        width: 97.5%;
        overflow: hidden;
        text-align: center;
        vertical-align: bottom;
    }

    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .my-autocomplete {
        li {
            line-height: normal;
            padding: 7px;

            .softName {
                text-overflow: ellipsis;
                overflow: hidden;
            }

            .softVersion {
                font-size: 12px;
                color: #b4b4b4;
            }

            .highlighted .addr {
                color: #ddd;
            }
        }
    }
</style>