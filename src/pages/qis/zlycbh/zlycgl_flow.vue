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
                                        <el-form-item label="异常来源" label-width="140px" prop="ycly">
                                            <ice-select v-model="bizdata.ycly" placeholder="请选择"
                                                      map-type-code="ZLYC_YCLY"
                                                      @changevalue="lySelectChange"
                                                      :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="异常关联" label-width="140px" prop="yclyId">
                                            <el-select ref="ycgl" v-model="bizdata.lycode" placeholder="请选择" @change="glSelectChange" :disabled="disabled || flowScope.formReadonly">
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
                                                      :disabled="flowScope.formReadonly" type="textarea" :rows="3"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="17">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="质量异常处理单编号" label-width="140px" prop="ycCode">
                                            <el-input v-model="bizdata.ycCode" placeholder="自动生成" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
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
                                                               :on-success="fileUploadSuccess" ref="fileUpload" :disabled = "flowScope.formReadonly" @fileData="fileData"></ice-single-upload>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="异常信息" label-width="140px" prop="situation">
                                            <el-input v-model="bizdata.situation" :disabled="flowScope.formReadonly" type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="产生原因" label-width="140px" prop="reason">
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
            <bhgp-selector column="OID_YC" :sectCp="sectCp" ref="bhgp" @select="select" @closeVisible="visibleBhgp = false"></bhgp-selector>
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
    import codeConfigRequest from '@/utils/codeConfigRequest'
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";
    export default {
        mixins: [codeConfigRequest],
        name: "zlycgl_flow",
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
            IcePersionSelector
        },
        created(){
            // this.getBhgpcldInfo();
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
                disabled:true,
                ideas: [
                    {label:'ZLYC_OPTION0', value:'已处理，无纠正措施'},
                    {label:'ZLYC_OPTION1', value:'以《纠正措施处理单》完成整改'},
                    {label:'ZLYC_OPTION2', value:'以《质量问题归零报告》完成归零'},
                ],
                rules:{
                    // bhgp: [
                    //     {required: true, message: '请选择不合格品'}
                    // ],
                    situation: [
                        {required: true, message: '异常信息不能为空'}
                    ],
                    reason: [
                        {required: true, message: '产生原因不能为空'}
                    ],
                    options: [
                        {required: true, message: '请选择处理意见', trigger: 'change'}
                    ],

                },

                bizdata: {
                    oid: '',
                    bhgp: '',//不合格品
                    ycCode: '',//异常编码
                    ycly: '',//异常来源
                    yclyId: '',//异常关联
                    lycode: '',//异常编码
                    zrdw: '',//责任单位
                    zrdwcode: '',//责任单位编码
                    zrr: '',//责任人
                    zrrcode: '',//责任人编码
                    // createUser:'',//填报人
                    // createDate:'',//填报时间
                    dataSecretLevcode: '',//密级
                    situation: '',//异常信息
                    reason: '',//产生原因
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
                this.loadProjectCode({name: 'zlyc'}).then(res => {
                    this.bizdata.ycCode = res.number;
                })
            },
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                console.log(bizdata, 'biz')
                //流程初始化
                this.getFjData(bizdata.dataid, bizdata.filename)
                Object.assign(this.bizdata,bizdata);
                if (bizdata.oid) {

                }else {
                    this.getCode();
                }
            },
            async flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                return await this.$refs.form.validate();
            },
            flowBizData() {
                //获取业务表单数据
                this.bizdata.dataid = this.fileInfo.dataid;
                this.bizdata.filename = this.fileInfo.filename;
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
                // if(!this.bizdata.ycly){
                //     this.$message.warning('请选择异常来源！');
                //     return;
                // }
                if('BHGPSB' === this.bizdata.ycly && !this.bizdata.yclyId){
                    this.$message.warning('请选择异常关联');
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
            lySelectChange(value){
                this.bizdata.bhgp = '';
                this.bizdata.qisCpBhgOidList = '';
                this.sectCp = [];
                if('BHGPSB' === value){
                    this.disabled = false;
                    this.getBhgpcldInfo();
                }else if('ZZFX' === value){
                    this.disabled = true;
                    this.bhgOptions = [];
                    this.bizdata.yclyId = '';
                    this.bizdata.lycode = '';
                    this.bizdata.bhgp = '';
                }
            },
            //获取异常关联数据(不合格品处理单信息)
            getBhgpcldInfo(){
                this.$axios.get("/pms/QisBhgp/ecInfo", {params: {options: 'BHGPCLD_OPTION5'}
                    })
                    .then(result => {
                        this.bhgOptions = result.data;
                        // console.log(this.bhgOptions);
                    }).catch(error => {
                        this.$Message.error("获取异常关联数据失败！")
                    })
            },
            //异常关联选择变更
            async glSelectChange(option){
                console.log(option)
                if(option.oid){
                    await this.getBhgByOidbhg(option.oid);
                    var oids = this.sectCp.map(item => {
                        return item.oid;
                    })
                    this.bizdata.lycode = option.code
                    this.bizdata.yclyId = option.oid
                    this.bizdata.qisCpBhgOidList = oids.join(",");
                    this.bizdata.bhgp = this.sectCp.map(item => {
                        return item.cpScCode + '-' + item.gxCode;
                    }).join("，");
                    console.log(this.bizdata)
                }
            },
            async getBhgByOidbhg(yclyId){
                await this.$axios.get("/pms/QisCpBhg/listByOidBhgForBhg", {params: {oidbhg: yclyId}
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
