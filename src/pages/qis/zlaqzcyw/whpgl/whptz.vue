<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/QisWhpTz/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid">

        </ice-query-grid>
        <ice-dialog :title="title" :visible.sync="visible" width="800px">
            <el-row>
                <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="危化品名称" label-width="140px" prop="whpName">
                                <el-input maxlength="16" v-model="formModel.whpName" placeholder="请输入" :disabled = "disabled"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="危化品类别" label-width="140px" prop="whplx">
                                <ice-select v-model="formModel.whplx" placeholder="请选择" map-type-code="WHPLB" :disabled="disabled"></ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="技术说明书" label-width="140px" prop="smsCode">
                                <el-input v-model="formModel.smsCode" placeholder="请选择" :disabled="disabled"  @focus="showSms"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所区-工房" label-width="140px" prop="sqName">
                                <el-input maxlength="16" v-model="formModel.sqName" placeholder="请输入" :disabled="disabled"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="年使用量/kg" label-width="140px" prop="nsyl">
                                <el-input v-model="formModel.nsyl" placeholder="请输入" :disabled="disabled" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="现有库存/kg" label-width="140px" prop="xykc">
                                <el-input v-model="formModel.xykc" placeholder="请输入" :disabled="disabled" type="number"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="所属单位" label-width="140px" prop="dwName">
                                <ice-dept-selector chooseItem="single"
                                                   :mode="disabled?'readonly':'onlySelect'"
                                                   v-model="formModel.dwName"
                                                   @select-confirm="depts=>{formModel.dwCode=depts[0].deptCode;formModel.dwid=depts[0].oid;}">
                                </ice-dept-selector>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                <ice-select v-model="formModel.dataSecretLevcode"
                                            map-type-code="DATA_SECRET_LEVEL"
                                            filterable placeholder="请选择">
                                </ice-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-row>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="confirm" :disabled="disabled">确认</el-button>
                    <el-button type="info" @click="visible=false">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>

        <ice-dialog title="部门选择" :visible.sync="visibleBm" width="500px">
            <ice-custom-tree Width="480px" :unbrid="unbrid" :transfer="transfer.treeData"
                             @handleCallback="handleCallbackTree"></ice-custom-tree>
        </ice-dialog>

        <ice-dialog title="说明书选择" :visible.sync="visibleSms" width="800px">
            <whpsms_selector @select="selectSms" @closeVisible="visibleSms = false" ref="grid1"></whpsms_selector>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import Validator from "@/pages/system/comm/Validator";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import IceCustomTree from "../../../../components/common/pms/IceCustomTree";
    import whpsms_selector from "./whpsms_selector"
    import moment from 'moment';
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";

    export default {
        name: "whptz",
        components:{
            IceDialog,
            IceQueryGrid,
            Validator,
            IceSelect,
            IceSingleUpload,
            IceCustomTree,
            whpsms_selector,
            moment,
            IceDeptSelector

        },
        data(){
            return{
                title:'',
                code: true,
                visible:false,
                loading:false,
                disabled: true,
                fileInfo: {},
                visibleBm: false,
                unbrid:true,
                visibleSms:false,
                query: [
                    {type: 'input', code: 'whpName', label: '危化品名称', value: ""},
                    {type: 'select', code: 'whplx', label: '危化品类别', mapTypeCode: 'WHPLB', value: ""},
                    {type: 'input', code: 'smsCode', label: '技术说明书编号', value: ""},
                    {type: 'input', code: 'sqName', label: '所区-工房', value: ""},
                    // {type: 'input', code: 'nsyl', label: '年使用量', value: ""},
                    // {type: 'input', code: 'xykc', label: '现有库存', value: ""},
                    {type: 'input', code: 'dwName', label: '所属单位', value: ""},
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
                    {label: '危化品名称', code: 'whpName', width: 200,},
                    {label: '危化品类别', code: 'whplx', width: 200, mapTypeCode:'WHPLB'},
                    {label: '技术说明书', code: 'smsCode', width: 200, },
                    {label: '所区-工房', code: 'sqName',  width: 200,},
                    {label: '年使用量/kg', code: 'nsyl', width: 200},
                    {label: '现有库存/kg', code: 'xykc', width: 200},
                    {label: '所属单位', code: 'dwName', width: 200},
                    {label: '所属单位', code: 'dwCode', width: 200, cusMapTypeCode: 'DEPT'},
                    {label: '密级', code: 'dataSecretLevcode',mapTypeCode: 'DATA_SECRET_LEVEL'},
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
                    whpName: [
                        { required: true, message: '名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空'}
                    ],
                },
                formModel:{
                    oid:'',
                    whpName:'',//危化品名称
                    whplx:'',//类别
                    smsCode:'',//技术说明书编号
                    sqName:'',//所区-工房
                    nsyl:'',//年使用量/kg
                    xykc:'',//现有库存/kg
                    dwName:'',//所属单位
                    dataSecretLevcode:'',//密级
                },
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/permission/frame_org/load_table_tree?loadDisabled=false',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'deptName',
                            children: 'children'
                        },
                        nodeKey: 'oid',
                        // 请求传递参数
                        initModel: {

                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
            }
        },
        methods:{
            refresh(){
                this.$refs.grid.refresh();
            },
            addItem(){
                this.title = '新增危化品登记表';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
                })
            },
            edit(row){
                this.title = '编辑危化品登记表';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                })
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisWhpTz/get", {params: {id: row.oid}})
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
                    this.save('删除成功！','删除失败！');
                })
            },
            save(success, fail){
                this.loading = true;
                this.$axios.post("/pms/QisWhpTz/saveOrUpdate", this.formModel)
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

            showSms(){
                this.visibleSms = true;
                this.$nextTick(_=>{
                    this.$refs.grid1.refresh();
                })
            },
            selectSms(data){
                this.formModel.smsCode = data[0].smsCode;
                this.visibleSms = false;
            },
            showDw(){
                this.visibleBm = true;
            },
            //部门树
            handleCallbackTree(data){
                this.formModel.dwName = data.deptName;
                if(data.deptName != '三所'){
                    this.visibleBm = false;
                }
            },
        },
    }
</script>

<style scoped>

</style>
