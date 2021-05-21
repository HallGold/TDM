<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/QisWhpSms/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid">

        </ice-query-grid>
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-row  >
                <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="编码" label-width="140px" prop="smsCode">
                                <el-input v-model="formModel.smsCode" placeholder="编码自动生成" :disabled = "code" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="名称" label-width="140px" prop="smsName">
                                <el-input maxlength="16" v-model="formModel.smsName" placeholder="请输入" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="来源" label-width="140px" prop="smsLy">
                                <ice-select v-model="formModel.smsLy" map-type-code="SMS_LY" :disabled="disabled"></ice-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="版本" label-width="140px" prop="versionCode">
                                <el-input maxlength="6" v-model="formModel.versionCode" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                <ice-select :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode"
                                            map-type-code="DATA_SECRET_LEVEL"
                                            filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                <el-input v-model="formModel.dateRemark" :disabled="disabled" type = "textarea" maxlength="650" show-word-limit></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="24">
                            <el-form-item label="说明书文件" label-width="140px" prop="fj">
                                <ice-single-upload :control-mj="controlFjMj" :fileData="fileInfo" v-model="fileInfo.dataid" :doSecret="true"
                                                   :on-success="fileUploadSuccess" ref="fileUpload" @fileData="fileData"></ice-single-upload>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="confirm"  :disabled="disabled">确认</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import Validator from "@/pages/system/comm/Validator";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import moment from 'moment';
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import {mapGetters} from 'vuex'
    export default {
        name: "aqjssms",
        mixins: [codeConfigRequest],
        components:{
            IceDialog,
            IceQueryGrid,
            Validator,
            IceSelect,
            IceSingleUpload,
            moment,

        },
        data(){
            return{
                title:'',
                code: true,
                visible:false,
                loading:false,
                disabled: true,
                fileInfo: {},

                query: [
                    {type: 'input', code: 'smsCode', label: '编号', value: ""},
                    {type: 'input', code: 'smsName', label: '名称', value: ""},
                    {type: 'select', code: 'smsLy', label: '来源', value: "", mapTypeCode: "SMS_LY"},
                    {type: 'input', code: 'versionCode', label: '版本', value: ""},
                    {type: 'input', code: 'uploadPerson', label: '上传人', value: ""},
                    {type: 'date', code: 'createDate', label: '上传时间', value: ""},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '编号', code: 'smsCode', width: 200,},
                    {label: '名称', code: 'smsName', width: 200,},
                    {label: '来源', code: 'smsLy', width: 200, mapTypeCode:'SMS_LY'},
                    {label: '版本', code: 'versionCode',  width: 200,},
                    {label: '备注', code: 'dateRemark', width: 500},
                    {label: '上传人', code: 'uploadPerson', width: 200},
                    {label: '上传人编码', code: 'uploadPersonCode', hidden: true},
                    {label: '上传时间', code: 'createDate', width: 200,formatter(row) {
                            return row.createDate === null ? null : moment(row.createDate).format('YYYY-MM-DD');
                        }},
                    {label: '密级', code: 'dataSecretLevcode', width: 100,mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '附件ID集合', code: 'docIds', hidden: true},
                ],
                buttons: [
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "BSX",callback: this.refresh},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC",type: 'danger'},
                ],
                rules:{
                    smsName: [
                        { required: true, message: '名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        { required: true, message: '名称不能为空', trigger: 'change'}
                    ],
                },
                formModel:{
                    oid:'',
                    smsCode:'',//编号
                    smsName:'',//名称
                    smsLy:'',//来源
                    versionCode:'',//版本号
                    dateRemark:'',//备注
                    dataSecretLevcode:'',//密级
                    docIds:''//附件ID集合
                },
                changeFjSrdata: [],
            }
        },
        computed: {
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar () {
                // 附件
                return this.changeFjSrdata;
            }
        },
        methods:{
            fileData(data) {
                this.changeFjSrdata = data.fileSecret ? [data.fileSecret] : [];
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'aqjssms'}).then(res => {
                    this.formModel.smsCode = res.number;
                })
            },
            refresh(){
                this.$refs.grid.refresh();
            },
            addItem(){
                this.title = '新增危化品安全说明书';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                        this.$refs.fileUpload.reset();
                    }
                    this.getCode();
                })
            },
            edit(row){
                this.title = '编辑危化品安全说明书';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                    this.$refs.fileUpload.reset();
                })
                this.getFjData(row);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisWhpSms/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取单个失败！")
                    })
            },
            confirm(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var files = [];
                        files.push(this.fileInfo)
                        this.formModel.xtFjs = files;
                        this.formModel.docIds = this.getFjOids();
                        this.save('保存成功！','保存失败！');
                    }
                })
            },
            delete(row){
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.formModel.deleteStatus = 1;
                    // return
                    this.save('删除成功！','删除失败！');
                })
            },
            save(success, fail){
                this.loading = true;
                // this.formModel.dataSecretLevcode = 2;
                this.$axios.post("/pms/QisWhpSms/saveOrUpdate", this.formModel)
                    .then(result => {
                        this.visible = false
                        this.$message.success(success)
                        this.$refs.grid.refresh();
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            getFjData(row){
                if(!row.docIds) return;
                this.$axios.get('/pms/XtFj/listByBoid', {params :{boid: row.oid}})
                    .then(result =>{
                        if(result.data.length != 0){
                            var fileinfo = result.data[0];
                            let record = {filename: fileinfo.filename, fileSize: fileinfo.fileSize, dataid: fileinfo.dataid};
                            this.fileInfo = record
                        }
                    })
                    .catch(error =>{
                        this.$message.error("获取附件失败！");
                    })
            },
            getFjOids(){
                if(this.formModel.xtFjs.length != 0){
                    return this.formModel.xtFjs.map(item =>{
                        return item.dataid;
                    }).join(",")
                }
                return '';
            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                this.fileInfo = record
                this.formModel.uploadPersonCode = this.$userInfo.userCode
                this.formModel.uploadPerson = this.$userInfo.userName
            },
        },
    }
</script>

<style scoped>

</style>
