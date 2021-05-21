<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady"  :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign" @callBackSuccess="callBackSuccess">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-tabs v-model="activeName"  type="border-card">
                    <el-form :model="bizdata" status-icon ref="form" :rules="rules" >
                        <el-row :gutter="0">
                            <el-col :span="7">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="问题来源" label-width="140px" prop="wtly">
                                            <ice-select v-model="bizdata.wtly" placeholder="请选择"
                                                      map-type-code="ZLWTGL_YCLY"
                                                      @changevalue="wtSelectChange"
                                                      :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="问题关联" label-width="140px" prop="wtlyId">
                                            <el-select v-model="bizdata.wtlyCode" placeholder="请选择" @change="glSelectChange" :disabled="disabled || flowScope.formReadonly">
                                                <el-option
                                                        v-for="item in bhgOptions"
                                                        :key="item.oid"
                                                        :label="item.code"
                                                        :value="item">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="选择不合格品" label-width="140px" prop="bhgp">
                                            <el-input v-model="bizdata.bhgp" placeholder="点击选择" @focus="showBhgp"
                                                      :disabled="flowScope.formReadonly" type="textarea" :rows="4"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="17">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="问题编号" label-width="140px" prop="wtCode">
                                            <el-input v-model="bizdata.wtCode" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="问题名称" label-width="140px" prop="wtName">
                                            <el-input maxlength="30" v-model="bizdata.wtName" placeholder="请输入" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="责任人" label-width="140px" prop="zrr">
                                            <ice-persion-selector  chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                   v-model="bizdata.zrr"
                                                                   @select-confirm="sectZrr">
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="责任单位" label-width="140px" prop="zrdw">
                                            <el-input v-model="bizdata.zrdw" placeholder="自动带出" :disabled="flowScope.formReadonly" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="问题类别" label-width="140px" prop="wtType">
                                            <ice-select v-model="bizdata.wtType" map-type-code="ZLWTGL_WTLB"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                            <ice-select :controlMjPar="controlMjPar" v-model="bizdata.dataSecretLevcode" map-type-code="DATA_SECRET_LEVEL"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="附件" label-width="140px" prop="fj">
                                            <ice-single-upload :control-mj="controlFjMj" :fileData="fileInfo" v-model="fileInfo.dataid" :doSecret="true"
                                                               :on-success="fileUploadSuccess" ref="fileUpload" :disabled="flowScope.formReadonly" @fileData="fileData"></ice-single-upload>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="问题描述" label-width="140px" prop="situation">
                                            <el-input v-model="bizdata.situation" :disabled="flowScope.formReadonly" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="故障排查" label-width="140px" prop="reason">
                                            <el-input v-model="bizdata.reason" :disabled="flowScope.formReadonly" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20" class="chuli">
                                    <el-col :span="24">
                                        <el-form-item label="处理意见" label-width="140px"  prop="options">
                                            <el-radio-group
                                                    :disabled="flowScope.formReadonly"
                                                    v-model="bizdata.options">
                                                <el-radio v-for="idea in ideas" :label="idea.label" :key="idea.label">{{idea.value}}</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </el-form>
                </el-tabs>
            </div>
        </ice-flow-form>


        <ice-dialog title="选择不合格品" :visible.sync="visibleBhgp" width="800px">
            <bhgp-selector :column="column" :sectCp="sectCp" ref="bhgp" @select="select" @closeVisible="visibleBhgp = false"></bhgp-selector>
        </ice-dialog>

        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>

        <ice-dialog title="部门选择" :visible.sync="visibleBm" width="500px">
            <ice-custom-tree Width="480px" :unbrid="unbrid" :transfer="transfer.treeData"
                             @handleCallback="handleCallbackTree"></ice-custom-tree>
        </ice-dialog>

    </div>
</template>

<script>
    import ATTACHMENT from "@/pages/pms/common/ATTACHMENT";
    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IceDialog from "@/components/common/base/IceDialog";
    import Validator from "@/pages/system/comm/Validator";
    import IceSelect from "@/components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import bhgpSelector from "./bhgp";
    import UserSelector from "@/pages/biz/personnel/common/userSelector";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    import codeConfigRequest from '@/utils/codeConfigRequest'
    export default {
        name: "zlwtgl_flow",
        mixins: [codeConfigRequest],
        components:{
            ATTACHMENT,
            IceFlowForm,
            IceDialog,
            Validator,
            IceSelect,
            IceGridLayout,
            bhgpSelector,
            UserSelector,
            IceCustomTree,
            IceDeptSelector,
            IcePersionSelector
        },
        created(){

        },
        computed:{
            controlFjMj() {
                return this.bizdata.dataSecretLevcode ? [this.bizdata.dataSecretLevcode] : []
            },
            controlMjPar () {
                // 附件
                return this.changeFjSrdata;
            }
        },
        data(){
            return{
                changeFjSrdata: [],
                activeName :'first',
                attaTableData:[],
                isHandleer:true,
                sectCp: [],
                visibleBhgp: false,
                visibleBm: false,
                unbrid:true,
                fileInfo: {},
                checked:false,
                bhgOptions:[],
                options:[],
                column:'OID_WT',
                sglyText:'',
                disabled:true,
                ideas: [
                    {label:'ZLWTGL_OPTION0', value:'技术归零'},
                    {label:'ZLWTGL_OPTION1', value:'管理归零'},
                ],
                rules:{
                    // bhgp: [
                    //     {required: true, message: '请选择不合格品'}
                    // ],
                    situation: [
                        {required: true, message: '问题描述不能为空'}
                    ],
                    reason: [
                        {required: true, message: '故障排查不能为空'}
                    ],
                    options: [
                        {required: true, message: '请选择处理意见', trigger:'change'}
                    ],
                },

                bizdata: {
                    oid: '',
                    bhgp: '',//不合格品
                    wtly: '',//问题来源
                    wtlyId: '',//问题关联
                    wtlyCode: '',//问题关联编码
                    wtCode:'',//问题编号
                    wtName:'',//问题名称
                    wtType:'',//问题类别
                    zrdw: '',//责任单位
                    zrdwcode: '',//责任单位编码
                    zrr: '',//责任人
                    zrrcode: '',//责任人编码
                    // createUser:'',//填报人
                    // createDate:'',//填报时间
                    dataSecretLevcode: '',//密级
                    situation: '',//问题描述
                    reason: '',//故障排查
                    options: '',//处理意见
                    dataid: '',//附件数据ID
                    filename: '',//附件名称

                    qisCpBhgOidList: '',//不合格品oid
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
            fileData(data) {
                this.changeFjSrdata = data.fileSecret ? [data.fileSecret] : [];
            },
            sectZrr (items) {
                console.log(items)
                this.bizdata.zrdw = items[0].deptShortName;
                this.bizdata.zrdwCode = items[0].deptCode;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'zlgl'}).then(res => {
                    this.bizdata.wtCode = res.number;
                })
            },
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                this.getFjData(bizdata.dataid, bizdata.filename)
                Object.assign(this.bizdata,bizdata);
                if (bizdata.oid) {

                } else {
                    this.getCode();
                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                return await this.$refs.form.validate();
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                this.bizdata.dataid = this.fileInfo.dataid;
                this.bizdata.filename = this.fileInfo.filename;
                console.log(this.bizdata)
                if (!this.bizdata.oid) {
                    this.bizdata.filledBy = this.$userInfo.userName;
                }
                return this.bizdata;
            },
            callBackSuccess(data){
                this.bizdata = data;
            },
            select(items) {
                var oids = items.map(item => {
                    return item.oid;
                })
                this.bizdata.qisCpBhgOidList = oids.join(",");
                this.bizdata.bhgp = items.map(item => {
                    return item.cpScCode + '-' + item.gxCode;
                }).join("，");
                this.visibleBhgp = false;
                // console.log(items);
            },
            fileUploadSuccess(response, file) {
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                this.fileInfo = record
            },
            showBhgp() {
                // if(!this.bizdata.wtly){
                //     this.$message.warning('请选择问题来源！');
                //     return;
                // }
                if(('YCSB' === this.bizdata.wtly || 'SGCL' === this.bizdata.wtly) && !this.bizdata.wtlyId){
                    this.$message.warning('请选择问题关联');
                    return;
                }
                this.visibleBhgp = true;
            },
            getFjData(dataid, filename){
                if(dataid) {
                    this.fileInfo.filename = filename;
                    this.fileInfo.dataid = dataid;
                }
            },
            showYh(){
                this.$refs.us.openDialog();
            },
            getUserData(data){
                this.bizdata.zrr = data[0].name;
                this.bizdata.zrrcode = data[0].code;
                this.bizdata.zrdw = data[0].deptShortName;
                this.bizdata.zrdwcode = data[0].deptCode;
            },
            showDw(){
                this.visibleBm = true;
            },
            //部门树
            handleCallbackTree(data){
                this.bizdata.zrdw = data.deptName;
                this.bizdata.zrdwcode = data.deptCode;
                if(data.deptName != '三所'){
                    this.visibleBm = false;
                }
            },
            //来源选择变更
            wtSelectChange(value){
                this.bizdata.bhgp = '';
                this.bizdata.qisCpBhgOidList = '';
                this.sectCp = [];
                this.bizdata.wtlyId = '';
                this.sglyText = value;
                if('YCSB' === value){
                    //异常上报
                    this.disabled = false;
                    this.getZlycdInfo();
                }else if('ZZFX' === value){
                    //自主发现
                    this.bhgOptions = [];
                    this.disabled = true;
                }else if('SGCL' === value){
                    //事故处理
                    this.disabled = false;
                    this.getZlsgdInfo();
                }
            },
            //获取问题关联数据(质量异常单信息)
            getZlycdInfo(){
                this.$axios.get("/pms/QisZlyc/ecInfo", {params: {options: 'ZLYC_OPTION2'}
                    })
                    .then(result => {
                        this.bhgOptions = result.data;
                        // console.log(this.bhgOptions);
                    }).catch(error => {
                        this.$Message.error("获取质量异常单信息失败！")
                    })
            },
            //获取问题关联数据(质量事故调查处理单信息)
            getZlsgdInfo(){
                this.$axios.get("/pms/QisZlsg/ecInfo", {params: {options: 'ZLSGDCCL_OPTION1'}
                    })
                    .then(result => {
                        this.bhgOptions = result.data;
                        // console.log(this.bhgOptions);
                    }).catch(error => {
                        this.$Message.error("获取质量事故调查处理单信息失败！")
                    })
            },
            //问题关联选择变更
            async glSelectChange(option){
                console.log(option.oid)
                switch(this.sglyText){
                    case 'YCSB':
                        await this.getBhgByOidYc(option.oid);
                        break;
                    case 'SGCL':
                        await this.getBhgByOidSg(option.oid);
                        break;
                    default:
                }
                if(this.sectCp.length != 0){
                    var oids = this.sectCp.map(item => {
                        return item.oid;
                    })
                    this.bizdata.wtlyCode = option.code;
                    this.bizdata.wtlyId = option.oid;
                    this.bizdata.qisCpBhgOidList = oids.join(",");
                    this.bizdata.bhgp = this.sectCp.map(item => {
                        let a = item.cpScCode?item.cpScCode:'';
                        let b = item.gxCode?item.gxCode:''
                        return a + '-' + b;
                    }).join("，");
                }
            },
            async getBhgByOidYc(wtlyId){
                await this.$axios.get("/pms/QisCpBhg/listByOidYcForZlyc", {params: {oidYc: wtlyId}
                }).then(result => {
                    this.sectCp = result.data ? result.data : [];
                }).catch(error => {

                })
            },
            async getBhgByOidSg(wtlyId){
                await this.$axios.get("/pms/QisCpBhg/listByOidSgForZlsg", {params: {oidSg: wtlyId}
                }).then(result => {
                    this.sectCp = result.data ? result.data : [];
                }).catch(error => {

                })
            },
        },
    }
</script>

<style scoped>

</style>
