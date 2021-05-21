<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow" :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData" @callBackSuccess="handleCallbackFlow">
            <div style="height: 500px;" slot-scope="flowScope">
                <el-main style="padding: 0px;">
                    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
                        <el-tab-pane label="问题上报" name="first">
                            <el-form :model="bizdata" :rules="rules" ref="form">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="项目" prop="xmname" label-width="140px">
                                            <el-input readonly v-model="bizdata.xmname" :disabled="flowScope.formReadonly" placeholder="选择项目">
                                                <el-button v-if="!flowScope.formReadonly&&!bizdata.oidProgressFeedback"  slot="append" icon="el-icon-search"
                                                           @click="showSectXm"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="任务" prop="rwname" label-width="140px">
                                            <el-input v-model="bizdata.rwname" readonly :disabled="flowScope.formReadonly">
                                                <el-button :disabled="bizdata.oidXM?false:true" v-if="!flowScope.formReadonly&&!bizdata.oidProgressFeedback"  slot="append" icon="el-icon-search"
                                                           @click="shouMissionDialog"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="问题编号" prop="wtLsm" label-width="140px">
                                            <el-input disabled v-model="bizdata.wtLsm" readonly placeholder="自动生成"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="密级" prop="dataSecretLevcode" label-width="140px">
                                            <ice-select :control-mj="controlMj" :controlMjPar="controlMjPar" v-model="bizdata.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL" :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="问题接受部门" prop="wtjsDept" label-width="140px">
                                            <ice-dept-selector chooseItem="single" :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                               v-model="bizdata.wtjsDept"
                                                               @IcePopSelectorchange="IcePopSelectorchange"
                                                               @select-confirm="depts=>bizdata.deptCode=depts[0].deptCode">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="问题接收人" prop="wtjsr" label-width="140px">
                                            <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                                  :dept-code="bizdata.deptCode"
                                                                  v-model="bizdata.wtjsr">
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="上报人" prop="wtSbr" label-width="140px">
                                            <ice-persion-selector :mode="flowScope.formReadonly?'readonly':'onlySelect'" chooseItem="single"
                                                                  v-model="bizdata.wtSbr"></ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="上报日期" prop="wtSbDate" label-width="140px">
                                            <el-date-picker :disabled="flowScope.formReadonly" v-model="bizdata.wtSbDate" type="date"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="期望反馈日期" prop="wtjsDate" label-width="140px">
                                            <el-date-picker :disabled="flowScope.formReadonly" v-model="bizdata.wtjsDate" type="date"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="是否公开" prop="isOpen" label-width="140px">
                                            <el-select :disabled="flowScope.formReadonly" v-model="bizdata.isOpen">
                                                <el-option value="0" label="否"></el-option>
                                                <el-option value="1" label="是"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="问题类型" prop="wtlx" label-width="140px">
                                            <ice-select :disabled="flowScope.formReadonly" v-model="bizdata.wtlx" map-type-code="WTLX"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="问题描述" prop="wtms" label-width="140px">
                                            <el-input :disabled="flowScope.formReadonly" type="textarea" placeholder="不超过650个字" maxlength="650"
                                                      show-word-limit v-model="bizdata.wtms"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="处理意见" prop="handlingOpinions" label-width="140px">
                                            <el-input type="textarea" placeholder="不超过330个字" maxlength="330"
                                                      show-word-limit v-model="bizdata.handlingOpinions"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="备注" prop="dateRemark" label-width="140px">
                                            <el-input :disabled="flowScope.formReadonly" type="textarea" placeholder="不超过650个字" maxlength="650"
                                                      show-word-limit v-model="bizdata.dateRemark"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="附件详情" name="second">
                            <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" :isHandleer="!flowScope.formReadonly" :data="attaTableData" ref="attachment"></ATTACHMENT>
                        </el-tab-pane>
                    </el-tabs>
                </el-main>
            </div>
        </ice-flow-form>
        <!--<ice-dialog title="选择产品" :visible.sync="visibleProduct" width="900px">-->
            <!--<CP_SELECT  @select="selectProduct"></CP_SELECT>-->
        <!--</ice-dialog>-->
        <ice-dialog title="选择任务" :visible.sync="visibleMission" width="900px">
            <MISSION_SELECT @select="selectMission" :oidXm="bizdata.oidXM" ref="rw"></MISSION_SELECT>
        </ice-dialog>
        <ice-dialog title="选择项目" :visible.sync="visibleXm" width="900px">
            <x-m_-s-e-l-e-c-t @select="sectXm" chooseItem="single" @closeVisible="visibleXm=false"></x-m_-s-e-l-e-c-t>
        </ice-dialog>
    </div>
</template>

<script>
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceDialog from "@/components/common/base/IceDialog";
    import ATTACHMENT from "../common/ATTACHMENT";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import MISSION_SELECT from "../common/MISSION_SELECT";
    import CP_SELECT from "../common/CP_SELECT";
    import XM_SELECT from "../common/XM_SELECT"

    import codeConfigRequest from '@/utils/codeConfigRequest'

    export default {
        mixins: [codeConfigRequest],
        data() {
            return {
                visibleXm: false,
                loadIndex: 1,
                attaTableData: [],
                visibleProduct: false,
                visibleMission: false,
                activeName: 'first',
                bizdata: {
                    handlingOpinions: "", // 处理意见
                    oidProgressFeedback: "", // 进展反馈id
                    oidXM: '',
                    xmcode: '',
                    oidRW: '',
                    wbscode: '',
                    wtTitle: '',
                    dataSecretLevcode: '',
                    xmname: '',
                    rwname: '',
                    wtjsDept: '',
                    wtjsr: '',
                    wtjsDate: '',
                    isOpen: '0',
                    wtclDept: '',
                    wtclr: '',
                    wtclDate: '',
                    wtlx: '',
                    wtLsm: '',//流水码暂未配置
                    wtms: '',
                    dateRemark: '',
                    wtSbDate: new Date(),
                    wtSbr: '',
                    wtclhf: '',
                    xtFjs: []
                },
                rules: {
                    wtTitle: [
                        {required: true, whitespace: true, message: '请输入标题', trigger: 'blur'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                    cpName: [
                        {required: true, message: '请选择产品', trigger: 'change'}
                    ],
                    wtjsDept: [
                        {required: true, message: '请选择问题接收部门', trigger: 'change'}
                    ],
                    wtjsr: [
                        {required: true, message: '请选择问题接收人', trigger: 'change'}
                    ],
                    wtjsDate: [
                        {required: true, message: '请选择回复反馈日期', trigger: 'change'}
                    ],
                    wtclDept: [
                        {required: true, message: '请选择问题处理部门', trigger: 'change'}
                    ],
                    wtclr: [
                        {required: true, message: '请选择问题处理人', trigger: 'change'}
                    ],
                    wtclDate: [
                        {required: true, message: '请选择问题处理日期', trigger: 'change'}
                    ],
                    wtlx: [
                        {required: true, message: '请选择问题类型', trigger: 'change'}
                    ],
                    wtms: [
                        {required: true, message: '请填写问题描述', whitespace: true, trigger: 'blur'}
                    ],
                    wtSbDate: [
                        {required: true, message: '请选择上报日期', trigger: 'change'}
                    ],
                    wtSbr: [
                        {required: true, message: '请选择上报人', trigger: 'change'}
                    ],
                    xmname: [
                        {required: true, message: '请选择项目', trigger: 'change'}
                    ],
                    // rwname: [
                    //     {required: true, message: '请选择任务', trigger: 'change'}
                    // ],
                    isOpen: [
                        {required: true, message: '请选择', trigger: 'change'}
                    ],
                    handlingOpinions: [
                        {required: true, message: '请填写处理意见', trigger: 'blur'}
                    ]
                },
                rwMj: 100,
                fjdata: []
            }
        },
        computed: {
            controlMj () {
                return [this.rwMj]
            },
            controlMjFj () {
                return this.bizdata.dataSecretLevcode?[...this.controlMj, this.bizdata.dataSecretLevcode]: this.controlMj;
            },
            controlMjPar () {
                return this.fjdata.map(c=>{
                    return c.dataSecretLevcode
                })
            },
            fkdata () {
                return this.$route.query.fkdata?JSON.parse(this.$route.query.fkdata):null
            }
        },
        created () {
            // if (this.fkdata) {
            //     this.assignment(this.fkdata)
            // }
            if (this.fkdata) {
                this.getRw(this.fkdata.oidRw);
            }

        },
        methods: {
            // 获取单个
            getRw(id) {
                this.loading = true
                this.$axios.get("/pms/PmsWbs/get", {params: {id: id}})
                    .then(result => {
                        if  (result.data) {
                            let data = result.data;
                            data.oidProgressFeedback = this.fkdata.oidProgressFeedback;
                            this.assignment(data);
                        }
                    })
                    .catch(error => {
                        this.$message.error("获取失败！")
                    })
                    .finally(_ => {
                        this.loading = false
                    })
            },
            showSectXm () {
                this.visibleXm = true;
            },
            // 选择项目
            sectXm (items) {
                this.bizdata.oidXM = items[0].oid;
                this.bizdata.xmcode = items[0].xmcode;
                this.bizdata.xmname = items[0].xmname;
                this.bizdata.rwname = "";
                this.visibleXm = false;
            },
            changeFj (data) {
                this.fjdata = data;
            },
            // 获取编码
            getCode() {
                this.loadProjectCode({name: 'wt'}).then(res => {
                    this.bizdata.wtLsm = res.number;
                })
            },
            flowReady(flowContext, bizdata) {
                //流程初始化编辑赋值
                if (bizdata.oid) {
                    this.bizdata = bizdata;
                    this.getXtFjData(bizdata.oid)
                } else {
                    this.getCode();
                }
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                let sts
                this.$refs.form.validate((valid) => {
                    if (!valid) {
                        sts = false
                    } else {
                        sts = true
                    }
                })
                return sts
            },
            flowBizData() {
                this.bizdata.xtFjs = this.$refs.attachment.getVisibleDataAndDelData();
                console.log(this.bizdata)
                return this.bizdata
            },
            // 保存成功后的回调
            handleCallbackFlow (data) {
                this.bizdata = data;
                this.attaTableData = [];
                this.attaTableData = data.xtFjs;
                this.bizdata.xtFjs = data.xtFjs;
            },
            showProductDialog() {
                this.visibleProduct = true;
            },
            shouMissionDialog() {
                this.visibleMission = true;
                this.$nextTick(_=>{
                    this.$refs.rw.refresh();
                })
            },
            //选择产品
            selectProduct(item) {

                this.bizdata.oidCPK = item[0].cpid;
                this.bizdata.cpName = item[0].cpname;
                this.bizdata.cpCode = item[0].cpcode;
                this.visibleProduct = false;
            },
            //选择人物和项目信息
            selectMission(item) {
                this.bizdata.oidRW = item[0].oid;
                this.bizdata.wbscode = item[0].wbscode
                this.bizdata.rwname = item[0].rwname;
                this.bizdata.oidXM = item[0].oidXm;
                this.bizdata.xmcode = item[0].xmcode;
                this.bizdata.xmname = item[0].xmname;
                this.rwMj = item[0].dataSecretLevcode;
                this.visibleMission = false;
            },
            // 赋值
            assignment (obj) {
                console.log(obj, 'obj')
                this.bizdata.oidRW = obj.oidRw;
                this.bizdata.wbscode = obj.wbscode;
                this.bizdata.rwname = obj.rwname;
                this.bizdata.oidXM = obj.oidXm;
                this.bizdata.xmcode = obj.xmcode;
                this.bizdata.xmname = obj.xmname;
                this.bizdata.oidProgressFeedback = obj.oidProgressFeedback;
                this.rwMj = obj.dataSecretLevcode;
            },
            // 获取系统附件数据
            getXtFjData(boid) {
                this.attaTableData = [];
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: boid}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取系统附件数据失败！")
                    })
            },
            handleClick(e) {
                if (e.name == "second") {
                    this.$nextTick(() => {
                        this.$refs.attachment.resize();
                    })
                }
            },
            IcePopSelectorchange () {
                if (this.loadIndex != 1) {
                    this.bizdata.wtjsr = '';
                }
                this.loadIndex++;
            }
        },
        watch: {
            oid() {
                this.getXtFjData(dataId)
            }
        },
        components: {
            CP_SELECT,
            MISSION_SELECT,
            IcePersionSelector,
            ATTACHMENT,
            IceDeptSelector,
            IceFlowForm,
            IceSelect,
            IceDialog,
            XM_SELECT
        }
    }

</script>


<style scoped>

</style>
