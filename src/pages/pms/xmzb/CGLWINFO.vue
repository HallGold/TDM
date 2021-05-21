<template>
    <div class="ice-container">
        <ice-query-grid data-url="/pms/PmsCgLwinfo/list"
                        :query="query"
                        :operations-width="200"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations"
                        ref="grid"
                        @selection-change ="selectionChange">

        </ice-query-grid>
        <ice-dialog :title="titleTop" :visible.sync="visible"  height="665px" width="1025px">
            <el-row style="height: 600px;" >
                <el-tabs v-model="activeName"  type="border-card">
                    <div>


                        <!--                            <el-tab-pane label="奖励申请" name="first">-->
                        <!--                                <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="任务" label-width="140px" prop="rwname">-->
                        <!--                                                <el-input v-model="formModel.rwname" placeholder="点击选择" @focus ="showRw" :disabled="disabled"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="项目" label-width="140px" prop="xmname">-->
                        <!--                                                <el-input v-model="formModel.xmname" placeholder="点击选择" @focus ="showXm" :disabled="disabled"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="申请奖项" label-width="140px" prop="sqjx">-->
                        <!--                                                <el-input v-model="formModel.sqjx" placeholder="请输入" :disabled="disabled"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">-->
                        <!--                                                <ice-select v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" :disabled="disabled"></ice-select>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="申请人" label-width="140px" prop="sqr">-->
                        <!--                                                <el-input v-model="formModel.sqr" placeholder="请输入" :disabled="disabled"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="申请单位" label-width="140px" prop="sqdw">-->
                        <!--                                                <el-input v-model="formModel.sqdw" placeholder="请输入" :disabled="disabled"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="12">-->
                        <!--                                            <el-form-item label="申请日期" label-width="140px" prop="sqdate">-->
                        <!--                                                <el-date-picker v-model="formModel.sqdate" type="datetime" placeholder="请选择日期" :disabled="disabled"></el-date-picker>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="24">-->
                        <!--                                            <el-form-item label="申请理由" label-width="140px" prop="sqly">-->
                        <!--                                                <el-input v-model="formModel.sqly" :disabled="disabled" type = "textarea"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->
                        <!--                                    <el-row :gutter="20">-->
                        <!--                                        <el-col :span="24">-->
                        <!--                                            <el-form-item label="备注" label-width="140px" prop="dateRemark">-->
                        <!--                                                <el-input v-model="formModel.dateRemark" :disabled="disabled" type = "textarea"></el-input>-->
                        <!--                                            </el-form-item>-->
                        <!--                                        </el-col>-->
                        <!--                                    </el-row>-->

                        <!--                                </el-form>-->
                        <!--                            </el-tab-pane>-->
                    </div>
                    <el-tab-pane label="论文清单" name="first">
                        <el-form :model="formModel" ref="form" :rules="rules" v-loading="loading">
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="任务" label-width="140px" prop="rwname">
                                        <el-input v-model="formModel.rwname" placeholder="点击选择" @focus ="showRw" :disabled="disabled">

                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="项目" label-width="140px" prop="xmname">
                                        <el-input v-model="formModel.xmname" placeholder="点击选择" @focus ="showXm" :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="论文编码" label-width="140px" prop="lwcode">
                                        <el-input v-model="formModel.lwcode" placeholder="请输入" :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="论文标题" label-width="140px" prop="lwtitle">
                                        <el-input maxlength="33" v-model="formModel.lwtitle" placeholder="请输入" :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="第一作者" label-width="140px" prop="lwzz">
                                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                              v-model="formModel.lwzz"
                                                              @select-confirm="depts=>{personFz(depts, 1)}">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="第一作者单位" label-width="140px" prop="dw">
                                        <el-input readonly v-model="formModel.dw" placeholder="请输入" :disabled="disabled"></el-input>

                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="第二作者" label-width="140px" prop="lwzz2">
                                        <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                              v-model="formModel.lwzz2"
                                                              @select-confirm="depts=>{personFz(depts)}">
                                        </ice-persion-selector>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="第二作者单位" label-width="140px" prop="dw2">
                                        <el-input readonly v-model="formModel.dw2" placeholder="请输入" :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="论文类型" label-width="140px" prop="lwlx">
                                        <ice-select v-model="formModel.lwlx" map-type-code="LWLX" :disabled="disabled"></ice-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                        <ice-select :control-mj="controlMj" :controlMjPar="controlMjPar" v-model="formModel.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL" :disabled="disabled"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="发表刊物" label-width="140px" prop="fbkw">
                                        <el-input maxlength="16" v-model="formModel.fbkw" placeholder="请输入" :disabled="disabled"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="12">
                                    <el-form-item label="期刊类型" label-width="140px" prop="qklx">
                                        <ice-select v-model="formModel.qklx" map-type-code="QKLX" placeholder="请选择" :disabled="disabled"></ice-select>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="12">
                                    <el-form-item label="发表日期" label-width="140px" prop="fbdate">
                                        <el-date-picker v-model="formModel.fbdate" type="date" placeholder="请选择" :disabled="disabled"></el-date-picker>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="论文检索关键字" label-width="140px" prop="lwkeys">
                                        <el-input v-model="formModel.lwkeys" :disabled="disabled" type = "textarea"
                                                  placeholder="不超过33个字" maxlength="33" show-word-limit></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row :gutter="20">
                                <el-col :span="24">
                                    <el-form-item label="摘要" label-width="140px" prop="lwzy">
                                        <el-input v-model="formModel.lwzy" :disabled="disabled" type = "textarea" maxlength="650" show-word-limit></el-input>
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

                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="附件上传" name="first4">
                        <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" :is-handleer="isHandleer" :data="attaTableData" ref="attachment"></ATTACHMENT>
                    </el-tab-pane>
                </el-tabs>
            </el-row>
            <el-row>
                <div class="ice-button-bar">
                    <el-button type="primary" @click="confirm" ctrlCode = "confirm" :disabled="disabled">确认</el-button>
                    <el-button type="info" @click="visible=false" ctrlCode = "return">返回</el-button>
                </div>
            </el-row>
        </ice-dialog>
        <ice-dialog :visible.sync="visibleProject" width="800px">
            <el-tabs>
                <el-row>
                    <xm-selector chooseItem="single" @closeVisible="visibleProject=false" @select="selectProject"></xm-selector>
                </el-row>
            </el-tabs>
        </ice-dialog>
        <pms-table-tree ref="tableTree" :unbrid="unbrid" :dialogConfig="dialogConfig"
                        :tableObject="tableObject" :inpWidth="width"
                        :transfer="transfer" @handleCallback="handleCallback"
                        @handleClose="handleToggleDialog"
                        @handleTreeCallback="handleTreeCallback"></pms-table-tree>
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import XmSelector from "../common/XM_SELECT";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import moment from 'moment';
    import ATTACHMENT from "../common/ATTACHMENT";
    import UserSelector from "@/pages/biz/personnel/common/userSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";


    import codeConfigRequest from '@/utils/codeConfigRequest'
    export default {
        mixins: [codeConfigRequest],
        components: {
                IceFlowForm,
                IceDialog,
                IceQueryGrid,
                isLetterAndNumber,
                IceSelect,
                IceSingleUpload,
                XmSelector,
                PmsTableTree,
                ATTACHMENT,
                UserSelector,
            IcePersionSelector
        },
        name: "CGLWINFO",
        data(){
            return {
                activeName:'first',
                title: '',
                titleTop:'',
                visible: false,
                loading: false,
                disabled: false,
                isHandleer:true,
                selectData:[],
                attaTableData: [],
                visibleProject: false,
                //左树右表start
                dialogVisible: true,
                input2: '',
                value: '',
                width: '300px',
                unbrid: true,
                selectindex:0,
                transfer: {
                    treeData: {
                        // 请求树接口地址
                        api: '/pms/Xminfo/listByYear',
                        lazy: false,
                        // 配置字段
                        props: {
                            label: 'xmname',
                            children: 'children'
                        },
                        // 请求传递参数
                        initModel: {
                            years: this.nearFiveYears()
                        }
                    },
                    value: '',
                    placeholder: '请选择'
                },
                // title: '123',
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,

                },
                tableObject: {
                    buttons: [

                    ],
                    columns: [
                        {code: 'oid', hidden: true},
                        {code: 'oidXm', hidden: true},
                        {label: 'WBS编号', code: 'wbscode', width: 200},
                        {label: '任务名称', code: 'rwname', width: 200,},
                        {label: '前置任务', code: 'qzrw', width: 200},
                        {label: '工期', code: 'rwgq', width: 100},
                        {label: '实际开始日期', code: 'dateSjStar', width: 200},
                        {label: '实际完成日期', code: 'dateSjEnd', width: 200,},
                        {label: '部门', code: 'rwdept', width: 140,},
                        {label: '任务负责人', code: 'rwfzr', width: 140},
                        {label: '密级', code: 'dataSecretLevcode', width: 140, mapTypeCode: 'DATA_SECRET_LEVEL'},


                    ],
                    query: [
                        {type: 'static', code: 'oidXm', value: '0'},
                        //过滤掉任务状态为未下发的
                        {type: 'static', code: 'rwzt', value: 'RWZT10', exp: '!='},
                    ],
                    treeFocusData:[],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                //左树右表end
                formModel: {
                    oid:'',//
                    lwtitle:'',//论文标题
                    xmname:'',//项目名称
                    oidXm:'',//项目库主键ID
                    xmcode:'',//所内项目编号
                    rwname:'',//任务名称
                    oidRw:'',//WBSID
                    wbscode:'',//WBS编号
                    dataSecretLevcode:'',//密级
                    lwcode:'',//论文编码
                    dw: '',//单位
                    oiddw: '',//单位id
                    dwcode: '',//单位编码
                    lwzz: '',//作者
                    oidlwzz: '',//作者id
                    lwzzcode: '',//作者编码
                    lwzz2:'',//第二作者
                    oidlwzz2:'',//第二作者id
                    lwzzcode2:'',//第二作者编码
                    dw2:'',//第二作者单位
                    oiddw2:'',//第二作者单位id
                    dwcode2:'',//第二作者单位编码
                    fbkw: '',//发表刊物
                    qklx: '',//期刊类型
                    lwkeys: '',//论文检索关键字
                    lwzy: '',//摘要
                    deleteStatus: '',//删除状态
                    fbdate:'',//发表日期
                    dateRemark:'',//备注
                    lwlx:'',//论文类型

                    xtFjs: [],//协同附件
                },
                query: [
                    {type: 'input', code: 'xmname', label: '项目名称', value: ''},
                    {type: 'input', code: 'rwname', label: '任务名称', value: ''},
                    {type: 'input', code: 'lwtitle', label: '论文标题', value: ''},
                    {type: 'input', code: 'lwcode', label: '论文编码', value: ''},
                    {type: 'input', code: 'lwzz', label: '作者', value: ''},
                    {type: 'input', code: 'lwzz2', label: '第二作者', value: ''},
                    {type: 'input', code: 'lwkeys', label: '论文检索关键字', value: ''},
                    {type: 'date', code: 'fbdate', label: '发表日期', value: ''},
                    {type: 'input', code: 'fbkw', label: '发表刊物', value: ''},
                    {type: 'select', code: 'qklx', label: '期刊类型', value: '', mapTypeCode: 'QKLX'},
                    {type: 'select', code: 'dataSecretLevcode', label: '密级',  value: '', mapTypeCode: 'DATA_SECRET_LEVEL'},
                ],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '项目名称', code: 'xmname', width: 200,},
                    {label: '项目库主键ID', code: 'oidXm', hidden: true},
                    {label: '所内项目编号', code: 'xmcode', hidden: true},
                    {label: 'WBSID', code: 'oidRw', hidden: true},
                    {label: 'WBS编号', code: 'wbscode', hidden: true},
                    {label: '任务名称', code: 'rwname', width: 200},
                    {label: '论文标题', code: 'lwtitle',  width: 200,},
                    {label: '密级', code: 'dataSecretLevcode',mapTypeCode: 'DATA_SECRET_LEVEL'},
                    {label: '论文编码', code: 'lwcode', width: 200},
                    {label: '单位', code: 'dw', width: 200, hidden: true},
                    {label: '单位id', code: 'oiddw', width: 200, hidden: true},
                    {label: '单位', code: 'dwcode', width: 200, cusMapTypeCode: 'DEPT'},
                    {label: '作者', code: 'lwzz'},
                    {label: '作者id', code: 'oidlwzz', hidden: true},
                    {label: '作者编码', code: 'lwzzcode', hidden: true},
                    {label:'第二作者' , code:'lwzz2'},
                    {label:'第二作者id' , code:'oidlwzz2', hidden: true},
                    {label:'第二作者编码' , code:'lwzzcode2', hidden: true},
                    {label:'第二作者单位' , code:'dw2', hidden: true},
                    {label:'第二作者单位id' , code:'oiddw2', hidden: true},
                    {label:'第二作者单位' , code:'dwcode2', cusMapTypeCode: 'DEPT'},
                    {label: '发表日期', code: 'fbdate', width: 200,formatter(row) {
                            return row.fbdate === null ? null : moment(row.fbdate).format('YYYY-MM-DD');
                        }},
                    {label: '发表刊物', code: 'fbkw', width: 200,},
                    {label:'期刊类型' , code:'qklx', width:200,mapTypeCode: 'QKLX'},
                    {label: '论文检索关键字', code: 'lwkeys', width: 200  },
                    {label: '摘要', code: 'lwzy', width: 200,hidden: true },
                    {label: '删除状态', code: 'deleteStatus', hidden: true},
                    {label: '备注', code: 'dateRemark', width: 200,hidden: true },
                    {label:'论文类型' , code:'lwlx', width:200,hidden: true },
                ],
                buttons: [
                    {name: '刷新',icon: 'el-icon-refresh-right',type: 'primary',ctrlCode: "BSX",callback: this.buttonRefresh},
                    {name: '新增', icon: 'el-icon-plus', type: 'primary', ctrlCode: "BXZ", callback: this.addItem},
                    // {name: '删除', icon: 'el-icon-minus', type: 'danger', ctrlCode: "BXZ", callback: this.delete},
                    // {name: '导出',icon : 'el-icon-download', type: 'export'},
                ],
                operations: [
                    {name: '编辑', callback: this.edit, ctrlCode: "BBJ"},
                    {name: '删除', callback: this.delete, ctrlCode: "BSC",type: 'danger'},
                ],
                rules: {
                    lwtitle: [
                        { required: true, message: '论文标题不能为空'}
                    ],
                    lwzz: [
                        { required: true, message: '第一作者不能为空'}
                    ],
                    dw: [
                        { required: true, message: '第一作者单位不能为空'}
                    ],
                    xmname: [
                        {required: true, message: '项目不能为空'}
                    ],
                    lwlx: [
                        { required: true, message: '论文类型不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                    lwkeys: [
                        {required: true,  message: '论文检索关键字不能为空'}
                    ],
                },
                // 项目密级
                xmMj: 100,
                // 任务密级
                rwMj: 100,
                fjdata: [],
            }
        }
        ,
        computed: {
            controlMj () {
                console.log([this.xmMj, this.rwMj], '[this.xmMj, this.rwMj]')
                return [this.xmMj, this.rwMj]
            },
            controlMjFj () {
                return this.formModel.dataSecretLevcode?[...this.controlMj, this.formModel.dataSecretLevcode]: this.controlMj;
            },
            controlMjPar () {
                return this.fjdata.map(c=>{
                    return c.dataSecretLevcode
                })
            }
        },
        methods:{
            changeFj (data) {
                this.fjdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'lwqd'}).then(res => {
                    this.formModel.lwcode = res.number;
                })
            },
            //左树右表start
            // 获取近5年的年份
            nearFiveYears () {
                let date = new Date();
                let currentYear = date.getFullYear();
                let arr = [];
                for (let i=0;i<5;i++) {
                    arr.push(currentYear);
                    currentYear-=1;
                }
                return arr.join(',');
            },
            handleToggleDialog () {
                this.dialogConfig.visible = !this.dialogConfig.visible;
            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {
                // 回调后数据操作
                this.formModel.rwname = data[0].rwname
                this.formModel.oidRw = data[0].oid
                this.formModel.wbscode = data[0].wbscode
                this.rwMj = data[0].dataSecretLevcode;
                this.formModel.xmname = this.tableObject.treeFocusData.xmname
                this.formModel.oidXm = this.tableObject.treeFocusData.oid
                this.formModel.xmcode = this.tableObject.treeFocusData.xmcode
            },
            // 树组件选中回调
            handleTreeCallback (data) {
                this.tableObject.treeFocusData = data
                if(data.oid === '')return;
                this.tableObject.query[0].value = data.oid;
                this.$refs.tableTree.refresh();
            },

            getColumn(){
                return this.tableObject.columns.map((item)=>{
                    return item.code;
                })
            },
            //左树右表end
            selectionChange(data){
                this.selectData = data;
            },
            addItem(row){
                this.titleTop = '新增论文清单';
                this.visible = true;
                this.disabled = false;
                this.isHandleer = true;
                this.attaTableData = [];
                this.formModel.oid = '';
                this.formModel.deleteStatus = 0;
                this.$nextTick(_ => {
                    if (this.$refs.form !== undefined) {
                        this.$refs.form.resetFields();
                        this.getCode();
                    }
                })
            },
            // edit(row){
            //     this.visible = true;
            // },
            edit(row) {
                this.titleTop = '论文清单详情';
                this.visible = true
                this.disabled = false;
                this.isHandleer = true;
                this.$nextTick(_ => {
                    this.$refs.form.resetFields();
                    this.getSingle(row)
                })
                this.attaTableData = [];
                this.getHtFjData(row.oid);
            },
            // 获取单个详情
            getSingle(row) {
                this.$axios.get("/pms/PmsCgLwinfo/get", {params: {id: row.oid}})
                    .then(result => {
                        this.formModel = result.data;
                    })
                    .catch(error => {
                        this.$message.error("获取论文清单详情失败！/n" + error.msg)
                    })
            },
            delete(row) {
                this.formModel = {...row}
                this.formModel.xtFjs = [];
                this.$confirm('是否确认删除', '提示', {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(_ => {
                    this.formModel.deleteStatus = 1
                    this.$axios.post("/pms/PmsCgLwinfo/saveOrUpdate", this.formModel)
                        .then(data => {
                            this.$message.success("删除成功");
                            this.$refs.grid.refresh();
                        }).catch(error => {
                        this.$message.error("删除失败");
                    })
                })
            },

            confirm() {
                this.formModel.xtFjs = this.$refs.attachment.getData();

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.loading = true
                        this.$axios.post("/pms/PmsCgLwinfo/saveOrUpdate", this.formModel)
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
                                // this.disabled = true;
                            })
                    }
                })
            },
            buttonRefresh() {
                this.$refs.grid.refresh();
            },
            deleteAtta () {
                this.$refs.attaTable.removeSelecteds()
            },
            // 获取论文附件数据
            getHtFjData(oidLw){
                this.$axios.get("/pms/PmsCgLwinfoFj/listByOidLw", {params: {oidLw: oidLw}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取奖项申报数据失败！")
                    })
            },
            // --------- 项目关联 start ----------
            selectProject(item) {
                this.formModel.xmname = item[0].xmname
                this.formModel.oidXm = item[0].oid
                this.formModel.xmcode = item[0].xmcode
                this.xmMj = item[0].dataSecretLevcode;
                this.visibleProject = false;
            },
            showXm () {
                this.visibleProject = true;
            },
            showRw () {
                this.dialogConfig.visible = true;
            },
            // --------- 项目关联 end ----------
            showYh1(){
                this.selectindex = 1;
                this.$refs.us.openDialog();
            },
            showYh2(){
                this.selectindex = 2;
                this.$refs.us.openDialog();
            },
            // 选择人员赋值
            personFz (data, type) {
                if(type === 1) {
                    this.formModel.lwzz = data[0].name;
                    this.formModel.oidlwzz = data[0].oid;
                    this.formModel.lwzzcode = data[0].code;

                    this.formModel.dw = data[0].deptShortName;
                    this.formModel.oiddw = data[0].deptId;
                    this.formModel.dwcode = data[0].deptCode;
                }else{
                    this.formModel.lwzz2 = data[0].name;
                    this.formModel.oidlwzz2 = data[0].oid;
                    this.formModel.lwzzcode2 = data[0].code;

                    this.formModel.dw2 = data[0].deptShortName;
                    this.formModel.oiddw2 = data[0].deptId;
                    this.formModel.dwcode2 = data[0].deptCode;
                }
            },
            getUserData(data){
                if(this.selectindex === 1) {
                    this.formModel.lwzz = data[0].name;
                    this.formModel.oidlwzz = data[0].oid;
                    this.formModel.lwzzcode = data[0].code;

                    this.formModel.dw = data[0].deptShortName;
                    this.formModel.oiddw = data[0].deptId;
                    this.formModel.dwcode = data[0].deptCode;
                }else if(this.selectindex === 2){
                    this.formModel.lwzz2 = data[0].name;
                    this.formModel.oidlwzz2 = data[0].oid;
                    this.formModel.lwzzcode2 = data[0].code;

                    this.formModel.dw2 = data[0].deptShortName;
                    this.formModel.oiddw2 = data[0].deptId;
                    this.formModel.dwcode2 = data[0].deptCode;
                }
            },
        }

    }
</script>

<style scoped>

</style>
