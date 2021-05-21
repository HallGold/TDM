<template>
    <div class="ice-container">
        <div class="btns">
            <div class="right">
                <search-input :query="query" @search = "search"></search-input>
            </div>
            <div class="left">
                <el-button type="primary"  @click="addItem"><i class="el-icon-plus"></i>新增</el-button>
                <el-button type="primary" @click="refresh"><i class="el-icon-refresh-right"></i>刷新</el-button>
                <el-select v-model="value" placeholder="请选择" style="margin-left: 10px;" @change="selectChange">
                    <el-option
                            v-for="item in options"
                            :key="item"
                            :label="item"
                            :value="item">
                    </el-option>
                </el-select>
            </div>
        </div>
        <vxe-table
                resizable
                :align="allAlign"
                border
                height="90%"
                align='center'
                class="vxe"
                :data="tableData">
            <vxe-table-column type="seq" width="60" title="序号"></vxe-table-column>
            <vxe-table-column v-for="(item, index) in columns" :key="index" :col="item"
                              is="qis-vxe-columns"></vxe-table-column>
            <vxe-table-column fixed="right" title="操作" width="100">
                <template v-slot="{ row, rowIndex, columnIndex }">
                    <el-button type="text" @click="handleEdit(row)">编辑</el-button>
                    <el-button type="text" @click="handleDel(row)">删除</el-button>
                </template>
            </vxe-table-column>
        </vxe-table>
        <vxe-pager
                perfect
                :loading="loading"
                size="mini"
                :current-page="tablePage.current"
                :page-size="tablePage.size"
                :total="tablePage.total"
                :layouts="['PrevPage', 'JumpNumber', 'NextPage', 'FullJump', 'Sizes', 'Total']"
                @page-change="data=>{handlePageChange(data[0])}">
        </vxe-pager>

        <ice-dialog :title="title" :visible.sync="visible" width="800px" height="300px">
            <el-form :model="formModel" status-icon ref="form" :rules="rules" v-loading="loading">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="危化品名称" label-width="140px" prop="whpName">
                            <el-input maxlength="16" v-model="formModel.whpName" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所属单位" label-width="140px" prop="dwName">
                            <ice-dept-selector chooseItem="single"
                                               :mode="disabled?'readonly':'onlySelect'"
                                               v-model="formModel.dwName"
                                               @select-confirm="depts=>{formModel.dwCode=depts[0].deptCode;formModel.dwid=depts[0].oid;}">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所区" label-width="140px" prop="sqName">
                            <el-input maxlength="16" v-model="formModel.sqName" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="库房代号" label-width="140px" prop="kfName">
                            <el-input maxlength="16" v-model="formModel.kfName" placeholder="请输入" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="限量(kg)" label-width="140px" prop="whpXl">
                            <el-input v-model="formModel.whpXl" placeholder="请输入" type="number" :disabled="disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="库存量(kg)" label-width="140px" prop="whpKc">
                            <el-input v-model="formModel.whpKc" placeholder="请输入" type="number"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="选择年月" label-width="140px" prop="date">
                            <el-date-picker v-model="formModel.date" type="month"  placeholder="请选择"
                                            format="yyyy-MM" @change="dateChange"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="应急措施" label-width="140px" prop="yjcs">
                            <ice-select v-model="formModel.yjcs" placeholder="请选择" map-type-code="WHPYJCS" :disabled="disabled"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                            <ice-select v-model="formModel.dataSecretLevcode"
                                        map-type-code="DATA_SECRET_LEVEL"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="confirm">确认</el-button>
                        <el-button type="info" @click="visible=false">返回</el-button>
                    </div>
                </el-row>
            </el-form>
        </ice-dialog>

        <ice-dialog title="部门选择" :visible.sync="visibleBm" width="500px">
            <ice-custom-tree Width="480px" :unbrid="unbrid" :transfer="transfer.treeData"
                             @handleCallback="handleCallbackTree"></ice-custom-tree>
        </ice-dialog>

    </div>
</template>

<script>
    import qisVxeColumns from '../../../basePage/VxeColumns'
    import searchInput from "../../zlycbh/searchInput"
    import IceDialog from "../../../../components/common/base/IceDialog"
    import IceSelect from "@/components/common/base/IceSelect"
    import Validator from "@/pages/system/comm/Validator";
    import IceCustomTree from "../../../../components/common/pms/IceCustomTree";
    import moment from 'moment';
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";

    export default {
        name: "whpkctz",
        components: {
            qisVxeColumns,
            searchInput,
            IceDialog,
            IceSelect,
            Validator,
            IceCustomTree,
            moment,
            IceDeptSelector
        },
        data() {
            return {
                input: '',
                loading: false,
                options: [],
                value: '',
                title:'',
                visible:false,
                disabled:true,
                unbrid:true,
                visibleBm: false,
                query: [
                    {type: 'input', code: 'sqName', label: '所区', exp: 'like', value: ''},
                    {type: 'input', code: 'kfName', label: '库房代码', exp: 'like', value: ''},
                    // {type: 'input', code: 'whpXl', label: '限量/kg', exp: 'like', value: ''},
                    {type: 'input', code: 'whpName', label: '危化品名称', exp: 'like', value: ''},
                    {type: 'input', code: 'dwName', label: '所属单位', exp: 'like', value: ''},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                    {
                        type: 'static', code: 'kcYear', exp: '=', value: () => {
                            return this.value ? this.value : moment(new Date()).format("YYYY")
                        }
                    }
                ],
                allAlign: null,
                tableData: [],
                columns: [
                    {code: "oid", hidden: true},
                    {label: "所区", code: "sqName", width: 200,},
                    {label: "库房代码", code: "kfName", width: 200, sortable: true},
                    {label: "限量/kg", code: "whpXl", width: 200, sortable: true},
                    {label: "危化品名称", code: "whpName", width: 200, sortable: true},
                    {label: '所属单位', code: 'dwName', width: 200, sortable: true},
                    {label: '密级', code: 'dataSecretLevcode', width: 100,mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {
                        label: '库存量/kg', code: 'whpKc', width: 200, sortable: true, columns:
                            [
                                {label: '1月', code: 'january', width: 100, sortable: true},
                                {label: '2月', code: 'february', width: 100, sortable: true},
                                {label: '3月', code: 'march', width: 100, sortable: true},
                                {label: '4月', code: 'aprill', width: 100, sortable: true},
                                {label: '5月', code: 'may', width: 100, sortable: true},
                                {label: '6月', code: 'june', width: 100, sortable: true},
                                {label: '7月', code: 'july', width: 100, sortable: true},
                                {label: '8月', code: 'august', width: 100, sortable: true},
                                {label: '9月', code: 'september', width: 100, sortable: true},
                                {label: '10月', code: 'october', width: 100, sortable: true},
                                {label: '11月', code: 'november', width: 100, sortable: true},
                                {label: '12月', code: 'december', width: 100, sortable: true},
                            ],
                    },
                    {label: '应急措施', code: 'yjcs', width: 200, sortable: true, mapTypeCode: 'WHPYJCS'},

                ],
                tablePage: {
                    current: 1,
                    size: 20,
                    total: 0,
                    columns: [
                        'sqName',//所区
                        'kfName',//库存代码
                        'whpXl',//限量/KG
                        'whpName',//危化品名称
                        'dwName',//所属单位
                        'january',//1月
                        'february',//2月
                        'march',//3月
                        'aprill',//4月
                        'may',//5月
                        'june',//6月
                        'july',//7月
                        'august',//8月
                        'september',//9月
                        'october',//10月
                        'november',//11月
                        'december',//12月
                        'yjcs',//应急措施
                        'dataSecretLevcode',
                    ],
                    conditions: [],
                    conditionLink: 'OR',
                },
                formModel:{
                    sqName:'',//所区
                    kfName:'',//库房代码
                    whpXl:'',//限量/kg
                    whpKc:'',//库存量/kg
                    whpName:'',//危化品名称
                    dwName:'',//所属单位
                    kcYear:'',//记录年份
                    kcMonth:'',//记录月份
                    yjcs:'',//应急措施
                    date:'',
                    dataSecretLevcode:''

                },
                rules:{
                    whpName: [
                        {required: true, message: '危化品名称不能为空'}
                    ],
                    dwName: [
                        {required: true, message: '所属单位不能为空'}
                    ],
                    sqName: [
                        {required: true, message: '所区不能为空'}
                    ],
                    kfName: [
                        {required: true, message: '库房代号不能为空'}
                    ],
                    whpXl: [
                        {required: true, message: '请填写限量'}
                    ],
                    yjcs: [
                        {required: true, message: '请选择应急措施'}
                    ],
                    date: [
                        {required: true, message: '请选择时间'}
                    ],
                    whpKc: [
                        {required: true, message: '请填写库存量'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '密级不能为空', trigger:'change'}
                    ],
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
        async created() {
            this.allRefresh();
        },
        computed: {
            staticQuerys() {
                let arr = this.query.filter(item => item.type == "static")
                return arr.map(c => {
                    return {
                        column: c.code,
                        exp: c.exp,
                        value: typeof c.value == "function" ? c.value() : c.value
                    }
                });
            },
        },
        methods: {
            handlePageChange({currentPage, pageSize}) {
                this.tablePage.current = currentPage
                this.tablePage.size = pageSize
                this.refresh()
            },
            async allRefresh(){
                await this.getYears();
                this.refresh();
            },
            async getYears(){
                await this.$axios.get("/pms/QisWhpKctz/getYears").then(result => {
                    this.options = result.data;
                    if(this.options.length != 0 && this.options.indexOf(this.value) === -1){
                        this.value = this.options[0];
                    }
                }).catch(e => {

                })
            },
            refresh() {
                this.loading = true
                this.tablePage.staticConditions = this.staticQuerys;
                this.$axios.get("/pms/QisWhpKctz/list", {params: this.tablePage}).then(result => {
                    // console.log(result)
                    this.tableData = result.data.records;
                    this.tablePage.total = result.data.total;
                    this.loading = false
                }).catch(e => {
                    this.loading = false
                })
            },
            selectChange(){
                this.refresh();
            },
            search(data){
                this.tablePage.conditionLink = data.conditionLink;
                this.tablePage.conditions = data.conditions;
                this.tablePage.current = 1;

                this.refresh();
            },
            addItem() {
                this.title='新增危化品库存记录';
                this.disabled = false;
                this.visible = true;
                this.$nextTick(_ =>{
                    this.$refs.form.resetFields();
                })
            },
            handleEdit(row){
                this.title='编辑危化品库存记录';
                this.disabled = true;
                this.visible = true;
                this.$nextTick(_ =>{
                    this.$refs.form.resetFields();
                    this.formModel = {...row};
                })
            },
            async confirm(){
                this.$refs.form.validate((valid) =>{
                    if(valid){
                        this.loading = true;
                        this.$axios.post('/pms/QisWhpKctz/saveOrUpdate', this.formModel).then(result =>{
                            if(this.value != this.formModel.kcYear){
                                this.getYears();
                                this.value = this.formModel.kcYear;
                            }
                            this.refresh();
                            this.visible = false;
                            this.$message.success("保存成功！")
                        }).catch(error =>{
                            this.$message.error("保存失败！")
                        }).finally(_ =>{
                            this.loading = false;
                        })
                    }
                })
            },
            handleDel(row){
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ =>{
                    this.formModel = {...row};
                    this.formModel.kcYear = this.value;
                    this.$axios.post('/pms/QisWhpKctz/delCurrentYear', this.formModel).then(result =>{
                        if(this.tableData.length === 1){
                            this.allRefresh();
                        }else {
                            this.refresh();
                        }
                        this.$message.success("删除成功！");
                    }).catch(error =>{
                        this.$message.error("删除失败！");
                    })
                })
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
            dateChange(value){
                if(value != 'undefined'){
                    this.formModel.kcYear = value.getFullYear();
                    this.formModel.kcMonth = value.getMonth() + 1;
                }
            }
        },
        watch:{
        }
    }
</script>

<style lang="less" scoped>
    .btns {
        padding: 10px 15px;

        .right {
            float: right;
        }

        .btn {
            margin-right: 10px;
        }
    }

    .vxe {
        flex-grow: 1;
    }
</style>
