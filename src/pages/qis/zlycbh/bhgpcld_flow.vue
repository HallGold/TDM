<template>
    <div class="ice-container">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign" @callBackSuccess="callBackSuccess">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-tabs v-model="activeName" type="border-card">
                    <el-form :model="bizdata" status-icon ref="form" :rules="rules">
                        <el-row :gutter="0">
                            <el-col :span="7">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="选择不合格品" label-width="140px" prop="bhgp">
                                            <el-input v-model="bizdata.bhgp" placeholder="点击选择" @focus="showBhgp"
                                                      :disabled="flowScope.formReadonly" type="textarea"
                                                      :rows="8"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                            <el-col :span="17">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="不合格品处理单编号" label-width="140px" prop="code">
                                            <el-input v-model="bizdata.code" placeholder="自动生成" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="产品图号" label-width="140px" prop="cpth">
                                            <el-input maxlength="30" v-model="bizdata.cpth" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="责任人" label-width="140px" prop="zrr">
                                            <ice-persion-selector chooseItem="single"
                                                                  :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                                  v-model="bizdata.zrr"
                                                                  @select-confirm="sectZrr">
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="责任单位" label-width="140px" prop="zrdw">
                                            <el-input v-model="bizdata.zrdw" placeholder="自动带出"
                                                      :disabled="flowScope.formReadonly" disabled></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                            <ice-select :controlMjPar="controlMjPar" v-model="bizdata.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="型号批次" label-width="140px" prop="xhpc">
                                            <el-input maxlength="65" v-model="bizdata.xhpc" placeholder="请输入"
                                                      :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="附件" label-width="140px" prop="fj">
                                            <ice-single-upload :control-mj="controlFjMj" :fileData="fileInfo"
                                                               v-model="fileInfo.dataid" :doSecret="true"
                                                               :on-success="fileUploadSuccess" ref="fileUpload"
                                                               :disabled="flowScope.formReadonly"
                                                               @fileData="fileData"></ice-single-upload>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="情况描述" label-width="140px" prop="situation">
                                            <el-input v-model="bizdata.situation" :disabled="flowScope.formReadonly"
                                                      type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="产生原因" label-width="140px" prop="reason">
                                            <el-input v-model="bizdata.reason" :disabled="flowScope.formReadonly"
                                                      type="textarea"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="处理意见" label-width="140px" prop="options">
                                            <el-radio-group
                                                    :disabled="flowScope.formReadonly"
                                                    v-model="bizdata.options">
                                                <el-radio v-for="idea in ideas" :label="idea.label" :key="idea.label">
                                                    <span style="color: #000;" v-if="bizdata.options==idea.label">{{idea.value}}</span><span
                                                        v-else>{{idea.value}}</span></el-radio>
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
            <bhgp-selector column="OID_BHG" :sectCp="sectCp" ref="bhgp" @select="select"
                           @closeVisible="visibleBhgp = false"></bhgp-selector>
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
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector.vue";

    import codeConfigRequest from '@/utils/codeConfigRequest'

    export default {
        name: "bhgpcld_flow",
        mixins: [codeConfigRequest],
        components: {
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
        created() {

        },
        computed: {
            oid() {
                return this.$route.query.oid;
            },
            controlFjMj() {
                return this.bizdata.dataSecretLevcode ? [this.bizdata.dataSecretLevcode] : []
            },
            controlMjPar () {
                // 附件
                return this.changeFjSrdata;
            }
        },
        data() {
            return {
                activeName: 'first',
                attaTableData: [],
                isHandleer: true,
                sectCp: [],
                visibleBhgp: false,
                visibleBm: false,
                unbrid: true,
                fileInfo: {},
                checked: false,
                ideas: [
                    {label: 'BHGPCLD_OPTION0', value: '返工'},
                    {label: 'BHGPCLD_OPTION1', value: '返修'},
                    {label: 'BHGPCLD_OPTION2', value: '让步放行'},
                    {label: 'BHGPCLD_OPTION3', value: '报废'},
                    {label: 'BHGPCLD_OPTION4', value: '改作它用'},
                    {label: 'BHGPCLD_OPTION5', value: '异常上报'},
                ],
                rules: {
                    bhgp: [
                        {required: true, message: '请选择不合格品'}
                    ],
                    situation: [
                        {required: true, message: '情况描述不能为空'}
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
                    code: '',//不合格品编码
                    cpth: '',//产品图号
                    xhpc: '',//型号批次
                    sl: '',//不合格数量
                    zrdw: '',//责任单位
                    zrdwcode: '',//责任单位编码
                    zrr: '',//责任人
                    zrrcode: '',//责任人编码
                    // createUser:'',//填报人
                    // createDate:'',//填报时间
                    dataSecretLevcode: '',//密级
                    situation: '',//情况描述
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
                        initModel: {}
                    },
                    value: '',
                    placeholder: '请选择'
                },
                changeFjSrdata: [],
            }
        },
        methods: {
            fileData(data) {
                this.changeFjSrdata = data.fileSecret ? [data.fileSecret] : [];
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'bhgp'}).then(res => {
                    this.bizdata.code = res.number;
                })
            },
            sectZrr(items) {
                console.log(items)
                this.bizdata.zrdw = items[0].deptShortName;
                this.bizdata.zrdwCode = items[0].deptCode;
            },
            alterationAssign(flowContext, bizdata) {

            },
            async flowReady(flowContext, bizdata) {
                //流程初始化
                let flowData = this.$refs.flowForm.flowInstData;
                // let bizData;
                console.log(bizdata, 'biz1111')
                if (flowData.proOperates != null) {
                    this.bizdata = bizdata
                    this.getFjData(bizdata.dataid, bizdata.filename)
                } else {
                    if (this.oid) {
                        this.get(this.oid)
                    }
                    this.getCode();
                }
                Object.assign(this.bizdata, bizdata);
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
                console.log(this.fileInfo, 'filename')
                if (!this.bizdata.oid) {
                    this.bizdata.filledBy = this.$userInfo.userName;
                }
                // return
                return this.bizdata;
            },
            callBackSuccess(data) {
                this.bizdata = data;
            },
            //根据oid获取单条
            get(oid) {
                this.$axios.get("/pms/QisBhgp/get", {params: {id: oid}})
                    .then(result => {
                        this.bizdata = result.data;
                        this.getFjData(this.bizdata.dataid, this.bizdata.filename)
                    })
                    .catch(error => {
                        this.$message.error("获取数据失败！")
                    })
            },
            select(items) {
                var oids = items.map(item => {
                    return item.oid;
                })
                this.bizdata.qisCpBhgOidList = oids.join(",");
                this.bizdata.sl = oids.length;
                this.visibleBhgp = false;
                this.bizdata.bhgp = items.map(item => {
                    return item.cpScCode + '-' + (item.gxCode ? item.gxCode : '');
                }).join("，");
            },
            fileUploadSuccess(response, file) {
                console.log(response, file, '516-------------------')
                let fileId = response.data;
                let record = {filename: file.name, fileSize: file.size, dataid: response.data, dataSecretLevcode: response.securityLevel};
                this.fileInfo = record
            },
            showBhgp() {
                this.visibleBhgp = true;
            },
            getFjData(dataid, filename) {
                if (dataid) {
                    this.fileInfo.filename = filename;
                    this.fileInfo.dataid = dataid;
                }
            },
            showYh() {
                this.$refs.us.openDialog();
            },
            getUserData(data) {
                console.log(data[0])
                this.bizdata.zrr = data[0].name;
                this.bizdata.zrrcode = data[0].code;
                this.bizdata.zrdw = data[0].deptShortName;
                this.bizdata.zrdwcode = data[0].deptCode;
                console.log(this.bizdata)
            },
            showDw() {
                this.visibleBm = true;
            },
            //部门树
            handleCallbackTree(data) {
                this.bizdata.zrdw = data.deptName;
                this.bizdata.zrdwcode = data.deptCode;
                if (data.deptName != '三所') {
                    this.visibleBm = false;
                }
            },
        },
    }
</script>

<style scoped>

</style>