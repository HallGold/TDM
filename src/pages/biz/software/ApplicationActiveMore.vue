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
                        <div class="grid-bar" style="width: 100%">
                            <ice-editable-table :data="bizData.details" style="width: 100%">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="softName"
                                                           label="软件名称"
                                                           :disabled="true">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="softVersion"
                                                           label="版本"
                                                           input-type="input"
                                                           :disabled="true">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="fromYon"
                                                           label="来源"
                                                           :disabled="true">
                                    <template slot-scope="scope">
                                        <ice-select placeholder="软件来源" map-type-code="SOFTWARE_FROM_YON"
                                                    v-model="scope.row.fromYon"
                                                    :disabled="true">
                                        </ice-select>
                                    </template>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="keywords"
                                                           label="关键字"
                                                           maxlength="16"
                                                           placeholder="关键字之间用逗号间隔"
                                                           :disabled="true">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="fromYon"
                                                           label="级别"
                                                           :disabled="true">
                                    <template slot-scope="scope">
                                        <el-select placeholder="请选择" v-model="scope.row.softRegion"
                                                   :disabled="true">
                                            <el-option
                                                    v-for="item in softRegions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </ice-editable-table-column>

                                <ice-editable-table-column prop="fromYon"
                                                           label="使用时授权"
                                                           :disabled="flowScope.formReadonly">
                                    <template slot-scope="scope">
                                        <el-select placeholder="请选择" v-model="scope.row.downloadAuth"
                                                   :disabled="true">
                                            <el-option
                                                    v-for="item in downloadAuthList"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </template>
                                </ice-editable-table-column>
                                <el-table-column prop="softSizeKB" label="文件大小"></el-table-column>
                            </ice-editable-table><br/>
                            <el-form-item label="申请原因" prop="afReason" layout="3" label-width="80px">
                                <el-input :disabled="flowScope.formReadonly" :showWordLimit="true" maxlength="128"
                                          placeholder="填写内容不超过128个字" rows="3" type="textarea"
                                          v-model="bizData.afReason"></el-input>
                            </el-form-item>
                        </div>
                    </ice-form-group>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>
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
    import fileUtil from '@/utils/fileUtil.js';

    export default {
        name: "ApplicationActiveMore",
        components: {
            IceFormGroup,
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
            return {
                rules: {
                    afReason:[{required: true,whitespace: true, message: '请输入申请原因', trigger: 'blur'}]
                },
                bizData: {
                    softRegion: '1',
                    authUserCodes: '',
                    specialDept: '',
                    afUserCode: '',
                    afUserName: '',
                    afReason:'',
                    afPhone: '',
                    details: [],
                    dynamicDeptTags: [],
                    dynamicUserTags: [],
                    classifyId: ''
                },
                softRegions: [{
                    value: 0,
                    label: '院级'
                },{
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

            }
        },
        methods: {
            beforeUpload(file, scope) {
                this.$set(scope.row, 'fileId', file.uid);
                this.$set(scope.row, 'uploading', true);
                this.$set(scope.row, 'softName', file.name);
                this.$set(scope.row, 'softSize', file.size);
                this.$set(scope.row, 'size', fileUtil.fileSizeFormat(file.size));
            },

            flowBizData() {
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
                if(formValid){
                    let softRegion = this.bizData.details.find(item=>{return item.softRegion == 0})?0:1;
                    // this.bizData.details.forEach(item=>{
                    //     if(item.softRegion == 0){
                    //         softRegion = 0;
                    //     }
                    // });
                    flowContext.processVar = {
                        softRegion: softRegion
                    };
                }
                return formValid;
            },
            deleteDetailItem(index) {
                this.bizData.details.splice(index, 1);
            },
            flowReady(flowcont, bizdata) {
                Object.assign(this.bizData, bizdata);

                let id = this.$route.query['ids'];
                if (id&&!bizdata.oid){
                    this.$axios.get("/biz/BizSoftwareInfo/gets", {params: {ids: id}})
                        .then(result => {
                            this.bizData.details = result.data;

                            this.bizData.details.forEach(item=>{
                                item.softSizeKB = fileUtil.fileSizeFormat(item.softSize);
                            })

                        });
                }
            },
            cancelSelectUser() {

            },
            selectUserConfirm(rows, texts, values) {
                this.bizData.authUserCodes = '';
                this.bizData.authUserNames = '';
                this.bizData.authUserCodes += values;
                this.bizData.authUserNames += texts;
            },
            selectDeptConfirm(rows, texts, values) {
                this.bizData.authDeptCodes = '';
                this.bizData.authDeptNames = '';
                this.bizData.authDeptCodes += values;
                this.bizData.authDeptNames += texts;
            },
            classifyIdChange(item) {
                this.$set(this.bizData, 'classifyId', item[item.length - 1]);
            },
            /*fileSizeTo(data){
                let sizeG = data.substr(0,data.indexOf('G'))*1024*3;
                let sizeMB = data.substr(0,data.indexOf('MB'))*1024*2;
                let sizeKB = data.substr(0,data.indexOf('KB'))*1024;
                let sizeK = data.substr(0,data.indexOf('K'));
                if(data.indexOf('G')!=-1){
                    return sizeG;
                }
                if(data.indexOf('MB')!=-1){
                    return sizeMB;
                }
                if(data.indexOf('KB')!=-1){
                    return sizeKB;
                }
                if(data.indexOf('KB')==-1 && data.indexOf('K')!=-1){
                    return sizeK;
                }
            }*/
        },
        mounted() {

        },
        created() {
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