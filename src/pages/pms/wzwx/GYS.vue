<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/XtGysinfo/list"
                        exportTitle="供应商台账导出"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid"
                        chooseItem="multiple"
                        @selection-change ="selectionChange">

        </ice-query-grid>
        <ice-dialog :title="titleTop" :visible.sync="visible" height="500px" width="1200px">
            <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                <el-tab-pane :label="title" name="first">
                    <el-form :model="formModel" :rules="rules" ref="form" v-loading="loading">
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="年度" label-width="140px" prop="year">
                                    <el-date-picker v-model="formModel.year" type="year" value-format="yyyy" :disabled="disabled"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="编码" label-width="140px" prop="gysCode">
                                    <el-input v-model="formModel.gysCode" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="供方单位名称" label-width="140px" prop="gysName">
                                    <el-input v-model="formModel.gysName" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="供方单位简称" label-width="140px" prop="gysJc">
                                    <el-input v-model="formModel.gysJc" :disabled="disabled"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                    <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" :disabled="disabled"></ice-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="专业方向" label-width="140px" prop="gysZyfx">
                                    <el-input v-model="formModel.gysZyfx" :disabled="disabled" type = "textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="风险" label-width="140px" prop="gysFx">
                                    <el-input v-model="formModel.gysFx" :disabled="disabled" type = "textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="业务范围" label-width="140px" prop="gysYwfw">
                                    <el-input v-model="formModel.gysYwfw" :disabled="disabled" type = "textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="历史供货情况" label-width="140px" prop="gysGhqk">
                                    <el-input v-model="formModel.gysGhqk" :disabled="disabled" type = "textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-form-item label="外包任务及级别" label-width="140px" prop="gysRwjb">
                                    <el-input v-model="formModel.gysRwjb" :disabled="disabled" type = "textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <div class="ice-button-bar">
                            <el-button type="primary" @click="confirm">确认</el-button>
                            <el-button type="info" @click="visible=false">取消</el-button>
                        </div>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </ice-dialog>
    </div>
</template>
<script>
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";

    export default {
        data(){
            return {
                name:'XtGysinfo',
                activeName:'first',
                title: '',
                titleTop:'',
                visible: false,
                loading: false,
                disabled: false,
                oidJh: '',
                jhData: [],
                selectData:[],
                delIds:[],
                formModel: {
                    oid:'',//
                    year:'',//年度
                    gysCode:'',//编码
                    gysName:'',//供方单位名称
                    gysJc: '',//供方单位简称
                    dataSecretLevcode: '',//密级
                    gysZyfx: '',//专业方向
                    gysFx: '',//风险
                    gysYwfw: '',//业务范围
                    gysGhqk: '',//历史供货情况
                    gysRwjb: '',//外包任务及级别
                },
                query: [
                    {type: 'input', code: 'year', label: '年度'},
                    {type: 'input', code: 'gysCode', label: '编码'},
                    {type: 'input', code: 'gysName', label: '供方单位名称'},
                    {type: 'input', code: 'gysJc', label: '供方单位简称'},
                    {type: 'input', code: 'gysZyfx', label: '专业方向'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    // {code: 'jhid', hidden: true},
                    // {code: 'xmid', hidden: true},
                    {label: '年度', code: 'year', width: 80, sortable: true},
                    {label: '编码', code: 'gysCode', width: 100},
                    {label: '供方单位名称', code: 'gysName', width: 200},
                    {label: '供方单位简称', code: 'gysJc', width: 100},
                    {label: '密级', code: 'dataSecretLevcode', width: 100 , sortable:true,mapTypeCode:'DATA_SECRET_LEVEL'},
                    {label: '专业方向', code: 'gysZyfx', width: 200},
                    {label:'风险' , code:'gysFx' , width:200,},
                    {label:'业务范围' , code:'gysYwfw' , width:200,},
                    {label:'历史供货情况' , code:'gysGhqk' , width:200,},
                    {label:'外包任务及级别 ' , code:'gysRwjb' , width:200,},
                ],
                buttons: [
                    {name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "BXZ",callback: this.buttonRefresh},
                    {name: '添加', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '修改', callback: this.edit, ctrlCode: "BXZ1"},
                ],
                rules: {
                    year: [
                        {required: true, message: '年份不能为空'}
                    ],
                    gysCode: [
                        {validator: isLetterAndNumber, required: true, whitespace: true, message: '编码必填，只能由英文和数字构成', trigger: 'blur'}
                    ],
                    gysJc: [
                        {required: true,  message: '供方单位简称不能为空'}
                    ],
                    // gysZyfx: [
                    //     {required: true,  message: '专业方向不能为空'}
                    // ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ]
                },

            }
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            selectionChange(data){
                this.selectData = data;
                this.delIds = data.map(function(v){return v.oid})
            },
            addItem(row) {
                this.titleTop = '新增';
                this.title = '新增供应商台账';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
                })
            },
            edit(row) {
                this.titleTop = '编辑';
                this.title = '编辑供应商台账'
                this.visible = true
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.formModel = {...row}
                }).finally(_ =>{
                    this.disabled = true;
                })
            },
            delete(row) {
                if(this.delIds.length === 0)
                {
                    this.$alert("请选择要删除的数据！");
                    return;
                }
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.$axios.delete("/pms/XtGysinfo/delList", {params: {id: this.delIds.toString()}})
                        .then(data => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        }).catch(error => {
                        this.$message.error("删除失败");
                    })
                })
            },
            confirm() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/XtGysinfo/saveOrUpdate", this.formModel)
                            .then(result => {
                                this.visible = false
                                this.$message.success("保存成功")
                                this.$refs.grid.refresh();
                            })
                            .catch(error => {
                                this.$message.error("保存失败")
                            })
                            .finally(_ => {
                                this.loading = false
                                this.disabled = true;
                            })
                    }
                })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
        },
        components: {IceDialog, IceQueryGrid, isLetterAndNumber, IceSelect}
    }

</script>