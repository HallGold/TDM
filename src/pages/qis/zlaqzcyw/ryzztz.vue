<template>
    <div class="ice-container">
        <!--《人员资质台账》列表展示页面-->
        <ice-query-grid
                data-url="pms/QisZzsq/queryListQisZzsq"
                :query="query"
                :columns="columns"
                :buttons="buttons"
                :operations="operations"
                :operations-width="200"
                ref="grid"
                exportTitle="人员资质台账"
        >
        </ice-query-grid>
        <!--新增模态框区域-->
        <ice-dialog :title="title" :visible.sync="visible"  width="800px">
            <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                <!--第一行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="部门" label-width="140px" prop="bmName">
                            <ice-dept-selector  chooseItem="single" mode="onlySelect"
                                                v-model="formModel.bmName"
                                                @select-confirm="depts=>formModel.bmCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="姓名" label-width="140px" prop="ryName">
                            <el-input maxlength="16" v-model="formModel.ryName" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第二行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="操作证号" label-width="140px" prop="czzh">
                            <el-input maxlength="16" v-model="formModel.czzh" placeholder="请输入" :disabled = "disabled"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="操作类别" label-width="140px" prop="czlb">
                            <ice-select v-model="formModel.czlb"
                                        map-type-code="QISCZLB"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第三行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="准操作项目" label-width="140px" prop="zczxm">
                            <ice-select v-model="formModel.zczxm"
                                        map-type-code="QIS_ZCZXM"
                                        filterable placeholder="请选择">
                            </ice-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="发证时间" label-width="140px" prop="fzsj">
                            <el-date-picker v-model="formModel.fzsj" type="datetime"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--第四行-->
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="发证单位" label-width="140px" prop="fzdw">
                            <!--<el-input v-model="formModel.fzdw" placeholder="请输入" :disabled = "disabled"></el-input>-->
                            <ice-dept-selector  chooseItem="single" mode="onlySelect"
                                                v-model="formModel.fzdw"
                                                @select-confirm="depts=>formModel.fzdwCode=depts[0].deptCode">
                            </ice-dept-selector>
                        </el-form-item>

                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="下次复审时间" label-width="140px" prop="fssj">
                            <el-date-picker v-model="formModel.fssj"  type="datetime"></el-date-picker>
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
                    <el-col :span="12">
                        <el-form-item label="是否特总作业证" label-width="110px" prop="jyms">
                            <check-item :mapTypeCode="mapTypeCode" v-model="formModel.isSpecial"></check-item>
                            <!--<el-radio-group v-model="formModel.isSpecial">-->
                                <!--<el-radio v-for="(item, index) in filterSelectList" :label="item.value">{{item.label}}</el-radio>-->
                            <!--</el-radio-group>-->
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="在用状态" label-width="110px" prop="jyms">
                            <check-item :mapTypeCode="mapTypeCode2" v-model="formModel.zyzt"></check-item>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="110px" prop="dateRemark">
                            <el-input v-model="formModel.dateRemark" placeholder="填写不超过500个字" type="textarea" :rows="2">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24">
                        <ATTACHMENT @change="changeFjSr" :control-mj="controlFjMj" Height="200px" :data="xtFjList" ref="qisAqJj"></ATTACHMENT>
                    </el-col>
                </el-row>
                <!--底部按钮-->
                <el-row>
                    <div class="ice-button-bar">
                        <el-button type="primary" @click="conserve"  :disabled = "disabled">保存</el-button>
                        <el-button type="info" @click="visible=false" >返回</el-button>
                    </div>
                </el-row>

            </el-form>

        </ice-dialog>
    </div>
</template>

<script>
    //@author lihengg
    //@date  2020-03-12
    //@Version 1.0.0.1
    //人员资质台账
    //export dafault 所有的方法都写在这里面
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import {mapGetters, mapMutations} from 'vuex';
    import IceSelect from "@/components/common/base/IceSelect";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import checkItem from "../components/checkItem";
    export default {
        name: "ryzztz",
        components: {IceQueryGrid, ATTACHMENT, IceSelect, IceDeptSelector, checkItem},

        data(){
            return{
                //默认模态框标题为空
                title:'',
                //默认模态框状态为“关闭”
                visible:false,
                //加载动态转圈
                loading:false,

                disabled: true,

                //查询
                query: [
                    {type: 'input', code: 'bmName', label: '部门', value: ""},
                    {type: 'input', code: 'ryName', label: '姓名', value: ""},
                    {type: 'input', code: 'czzh', label: '操作证号', value: ""},
                    {type: 'select', code: 'czzh', label: '操作类别', mapTypeCode: 'QISCZLB', value: ""},
                    {type: 'select', code: 'czzh', label: '准操作项目', mapTypeCode: 'QIS_ZCZXM', value: ""},
                    {type: 'input', code: 'czzh', label: '发证时间', value: ""},
                    {type: 'input', code: 'czzh', label: '下次复审时间', value: ""},
                    {type: 'input', code: 'czzh', label: '发证单位', value: ""},
                    {type: 'select', code: 'czzh', label: '在用状态', mapTypeCode: 'QIS_ZYZT'},
                    {type: 'select', code: 'czzh', label: '是否特种作业', mapTypeCode: 'IS_YES_NO'},
                    {
                        type: 'select',
                        code: 'dataSecretLevcode',
                        label: '项目密级',
                        value: '',
                        mapTypeCode: 'DATA_SECRET_LEVEL'
                    },
                ],

                //调用网格数据
                columns:[
                    {code: "oid", hidden: true},
                    {label: "部门", code: "bmName", },
                    {label: "姓名", code: "ryName",},
                    {label: "操作证号", code: "czzh",sortable: true},
                    {label: "操作类别", code: "czlb", mapTypeCode: 'QISCZLB'},
                    {label: "准操作项目", code: "zczxm", mapTypeCode: 'QIS_ZCZXM'},
                    {label: "发证时间", code: "fzsj"},
                    {label: "下次复审时间", code: "fssj"},
                    {label: "发证单位", code: "fzdw"},
                    {label: "在用状态", code: "zyzt",mapTypeCode: 'QIS_ZYZT' },
                    {label: "是否特种作业", code: "isSpecial", mapTypeCode: 'IS_YES_NO'},
                    {label: "备注", code: "dateRemark"},
                    {label: "所属部门编号", code: "bmCode", hidden: true},
                    {label: "附件ID集合", code: "docIds", hidden: true},
                    {label: "密级", code: "dataSecretLevcode", width: 100,mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                //按钮操作
                buttons: [
                    {
                        name: '刷新',
                        icon: 'el-icon-refresh',
                        type: 'success',
                        callback: this.refresh
                    },
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    //{name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "add",callback: this.refresh},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC",type: 'danger'},
                ],

                //验证不能为空
                rules:{
                    hdName: [
                        { required: true, message: '名称不能为空'}
                    ],
                    ryName: [
                        { required: true, message: '请输入姓名'}
                    ],
                    bmName: [
                        { required: true, message: '请选择部门', trigger: 'blur'}
                    ],
                    czzh: [
                        { required: true, message: '操作证号'}
                    ],
                    czlb: [
                        { required: true, message: '请选择操作类别'}
                    ],
                    fzdw: [
                        { required: true, message: '发证单位'}
                    ],
                    fssj: [
                        { required: true, message: '请输入复审时间'}
                    ],
                    dataSecretLevcode: [
                        { required: true, message: '请选择密级'}
                    ],
                    fzsj: [
                        { required: true, message: '发证时间'}
                    ],
                },
                //模态框输入需要的，如果没有则输入不成功，注意每个字段相互匹配
                formModel:{
                    oid:'',
                    ryName:'',//人员名称
                    bmCode:'',//所属部门编号
                    bmName:'',//所属单位名称
                    czzh:'',//操作证号
                    czlb:'',//操作类别
                    fzdw:'',//发证单位
                    fssj:'',//复审时间
                    isSpecial:'IS_YES',//是否特种作业
                    dataSecretLevcode:'',//密级
                    dateRemark:'',//备注
                    fzsj: new Date(),//发证时间
                    zyzt:'QIS_ZYZT_QY',//在用状态
                    fzdwCode:'',//发证单位编码
                    zczxm:'',//准操作项目
                },
                xtFjList: [],

                mapTypeCode: 'IS_YES_NO',
                mapTypeCode2: 'QIS_ZYZT',
                changeFjSrdata: []
            }
        },
        computed: {
            filterSelectList() {
                if (this.mapTypeCode) {
                    return this.getDataMapList()(this.mapTypeCode);
                } else {
                    return [];
                }

            },
            filterSelectList1() {
                if (this.mapTypeCode2) {
                    return this.getDataMapList()(this.mapTypeCode2);
                } else {
                    return [];
                }

            },
            controlFjMj() {
                return this.formModel.dataSecretLevcode ? [this.formModel.dataSecretLevcode] : []
            },
            controlMjPar() {
                // 附件
                let arr2 = this.changeFjSrdata.map(c => {
                    return c.dataSecretLevcode
                })
                return [...arr2];
            }
        },
        created () {
            if (this.mapTypeCode) {
                this.addUndoTypeCodes(this.mapTypeCode);
            }
            if (this.mapTypeCode2) {
                this.addUndoTypeCodes(this.mapTypeCode2);
            }
        },

        //专门写方法的区域
        methods:{
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
            ...mapGetters('datamapStore', [ 'getDataMapList']),
            //刷新方法,保存，关闭，编辑，删除等时候进行调用
            refresh(){
                this.$refs.grid.refresh();
            },
            // 附件变化
            changeFjSr(data) {
                this.changeFjSrdata = data;
            },
            //新增安全论证申报模态框
            addItem(){
                this.title = '新增人员资质台账';
                this.visible = true;
                this.disabled = false;
                this.formModel.oid = '';
                this.xtFjList = [];
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                    }
                })
            },

            //调用保存方法
            conserve(){
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        var files = [];
                        files.push(this.fileInfo)
                        this.save('保存成功！','保存失败！');
                    }
                })
            },

            //保存方法  success：成功提示信息，fail：失败信息
            save(success, fail){
                this.loading = true;
                let fj = this.$refs.qisAqJj.getData();
                this.formModel.xtFjList = fj.length != 0 ? fj : [];
                console.log(this.formModel)
                // return
                this.$axios.post("/pms/QisZzsq/saveOrUpdateByMultiTable", this.formModel)
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
            // 查询附件
            getFj (oid) {
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oid}})
                    .then(result => {
                        this.xtFjList = result.data;
                        this.changeFjSrdata = this.xtFjList;
                    })
                    .catch(error => {
                        this.$message.error(fail)
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            //选中一行进行编辑
            edit(row){
                this.title = '编辑人员资质台账';
                this.visible = true;
                this.disabled = false;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row);
                    this.$refs.qisAqJj.resize();
                })
                this.getFj(row.oid);
                //this.getFjData(row);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/QisZzsq/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取单个失败！")
                    })
            },
            //选中一行进行删除
            delete(row){
                this.formModel = {...row}
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {

                    this.$axios.delete("/pms/QisZzsq/del", {params: {id: this.formModel.oid}})
                        .then(result => {
                            this.$message.success('删除成功！')
                            this.$refs.grid.refresh();
                        })
                        .catch(error => {
                            this.$message.error(fail)
                        })
                        .finally(_ => {
                            this.loading = false
                        })
                })
            },
        },
    }
</script>