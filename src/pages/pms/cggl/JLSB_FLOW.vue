<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flowForm" :flowReady="flowReady" :flowOperateBtn="flowOperateBtn"
                       :flowBizData="flowBizData" :btn-extend1="alterationAssign" @callBackSuccess="handleCallbackFlow">
            <div style="height: 500px;" slot-scope="flowScope">
                <!--                <el-form :model="flowScope.bizdata" status-icon :rules="rules" ref="definition" label-width="140px">-->
                <el-row style="height: 508px;">
                    <el-tabs v-model="activeName" type="border-card">
                        <el-tab-pane label="奖励申请" name="first">
                            <el-form :model="bizdata" status-icon ref="form" :rules="rules">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="任务" label-width="140px" prop="rwname">
                                            <el-input v-model="bizdata.rwname" placeholder="点击选择" readonly
                                                      autocomplete="off" :disabled="flowScope.formReadonly">
                                                <el-button v-if="!flowScope.formReadonly" slot="append"
                                                           icon="el-icon-edit-outline" @click="showRw"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="项目" label-width="140px" prop="xmname">
                                            <el-input v-model="bizdata.xmname" placeholder="点击选择" readonly
                                                      autocomplete="off" :disabled="flowScope.formReadonly">
                                                <el-button v-if="!flowScope.formReadonly" slot="append"
                                                           icon="el-icon-edit-outline" @click="showXm"></el-button>
                                            </el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="项目起始时间" label-width="140px" prop="xmdateStart">
                                            <el-date-picker v-model="bizdata.xmdateStart" type="date"
                                                            placeholder="请选择日期"
                                                            :picker-options="pickerOptions(1)"
                                                            :disabled="flowScope.formReadonly"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="项目完成时间" label-width="140px" prop="xmdateEnd">
                                            <el-date-picker v-model="bizdata.xmdateEnd" type="date" placeholder="请选择日期"
                                                            :picker-options="pickerOptions(2)"
                                                            :disabled="flowScope.formReadonly"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="成果奖励名称" label-width="140px" prop="cgname">
                                            <el-input maxlength="33" v-model="bizdata.cgname" placeholder="请输入"
                                                      autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="密级" label-width="140px" prop="dataSecretLevcode">
                                            <ice-select :control-mj="controlMj" :controlMjPar="controlMjPar"
                                                        v-model="bizdata.dataSecretLevcode"
                                                        map-type-code="DATA_SECRET_LEVEL" autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="主要完成人" label-width="140px" prop="sqr">
                                            <!--<el-input v-model="bizdata.sqr" placeholder="请输入"  autocomplete="off"-->
                                            <!--:disabled="flowScope.formReadonly" @focus="showRy"></el-input>-->
                                            <ice-persion-selector mode="onlySelect" chooseItem="single"
                                                                  v-model="bizdata.sqr"
                                                                  @select-confirm="depts=>{bizdata.sqrCode=depts[0].code;bizdata.sqdw=depts[0].deptShortName;bizdata.sqdwCode=depts[0].deptCode}">
                                            </ice-persion-selector>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="主要完成单位" label-width="140px" prop="sqdw">
                                            <ice-dept-selector :disabled="flowScope.formReadonly" chooseItem="single"
                                                               :mode="flowScope.formReadonly?'readonly':'onlySelect'"
                                                               v-model="bizdata.sqdw"
                                                               @select-confirm="depts=>{bizdata.sqdwCode=depts[0].deptCode;}">
                                            </ice-dept-selector>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="申报奖项类型" label-width="140px" prop="jxlx">
                                            <ice-select v-model="bizdata.jxlx" map-type-code="JXLX" placeholder="请选择"
                                                        autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="推荐等级" label-width="140px" prop="tjdj">
                                            <ice-select v-model="bizdata.tjdj" map-type-code="TJDJ" placeholder="请选择"
                                                        autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="专业评审组" label-width="140px" prop="zypsz">
                                            <ice-select v-model="bizdata.zypsz" map-type-code="ZYPSZ" placeholder="请选择"
                                                        autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="成果类型" label-width="140px" prop="cglx">
                                            <ice-select v-model="bizdata.cglx" map-type-code="CGLX" placeholder="请选择"
                                                        autocomplete="off"
                                                        :disabled="flowScope.formReadonly"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-form-item label="成果来源" label-width="140px" prop="cgly">
                                            <el-input maxlength="33" v-model="bizdata.cgly" placeholder="请输入"
                                                      autocomplete="off" :disabled="flowScope.formReadonly"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="申请日期" label-width="140px" prop="sqdate">
                                            <el-date-picker v-model="bizdata.sqdate" type="date" placeholder="请选择日期"
                                                            autocomplete="off"
                                                            :disabled="flowScope.formReadonly"></el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="申请说明" label-width="140px" prop="sqly">
                                            <el-input v-model="bizdata.sqly" type="textarea" autocomplete="off"
                                                      :disabled="flowScope.formReadonly" maxlength="650"
                                                      show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-form-item label="备注" label-width="140px" prop="dateRemark">
                                            <el-input v-model="bizdata.dateRemark" type="textarea" autocomplete="off"
                                                      :disabled="flowScope.formReadonly" maxlength="650"
                                                      show-word-limit></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="附件上传" name="first4">
                            <ATTACHMENT @change="changeFj" :controlMj="controlMjFj" :is-handleer="isHandleer"
                                        :data="attaTableData" ref="attachment"></ATTACHMENT>
                        </el-tab-pane>
                    </el-tabs>
                </el-row>
            </div>
        </ice-flow-form>

        <ice-dialog :visible.sync="visibleProject" width="800px">
            <el-tabs>
                <el-row>
                    <xm-selector chooseItem="single" @closeVisible="visibleProject=false"
                                 @select="selectProject"></xm-selector>
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
    import {isLetterAndNumber} from "@/pages/system/comm/Validator";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
    import PmsTableTree from "../../../components/common/pms/group/PmsTableTree";
    import XmSelector from "../common/XM_SELECT";
    import ATTACHMENT from "../common/ATTACHMENT";
    import UserSelector from "@/pages/biz/personnel/common/userSelector";
    import IceCustomTree from "../../../components/common/pms/IceCustomTree";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import moment from 'moment'

    export default {
        name: "JLSB_FLOW",
        created() {
            this.getHtFjData(this.$route.query.dataId);
        },
        computed: {
            oid() {
                return this.$route.query.oid;
            },
            controlMj() {
                return [this.xmMj, this.rwMj]
            },
            controlMjFj() {
                return this.bizdata.dataSecretLevcode ? [...this.controlMj, this.bizdata.dataSecretLevcode] : this.controlMj;
            },
            controlMjPar() {
                return this.fjdata.map(c => {
                    return c.dataSecretLevcode
                })
            }
        },
        components: {
            IceFlowForm,
            IceDialog,
            isLetterAndNumber,
            IceSelect,
            IceGridLayout,
            PmsTableTree,
            XmSelector,
            ATTACHMENT,
            UserSelector,
            IceCustomTree,
            IceDeptSelector,
            IcePersionSelector
        },
        data() {
            return {
                percent: 0,
                columns: [],
                selector: '',
                // bizdata: {},
                // bizdata: {xmname: '',rwname:'',dataSecretLevcode:'2',a: 0,softwareInfoList:[{"fileMD5":"123456"}]},
                instProcessVar: {a: 10},
                rules: {
                    typeDesc: [{required: true}],
                    bpmDefName: [{required: true}],
                    xmname: [
                        {required: true, message: '项目不能为空', trigger: 'change'}
                    ],
                    xmdateStart: [
                        {required: true, message: '项目起始时间不能为空', trigger: 'change'}
                    ],
                    xmdateEnd: [
                        {required: true, message: '项目完成时间不能为空', trigger: 'change'}
                    ],
                    cgname: [
                        {required: true, message: '成果奖励名称不能为空'}
                    ],
                    dataSecretLevcode: [
                        {required: true, message: '请选择密级', trigger: 'change'}
                    ],
                    sqr: [
                        {required: true, message: '主要完成人不能为空'}
                    ],
                    sqdw: [
                        {required: true, message: '申请单位不能为空'}
                    ],
                    jxlx: [
                        {required: true, message: '申报奖项类型不能为空', trigger: 'change'}
                    ],
                    tjdj: [
                        {required: true, message: '推荐等级不能为空', trigger: 'change'}
                    ],
                    zypsz: [
                        {required: true, message: '专业评审组不能为空', trigger: 'change'}
                    ],
                    cglx: [
                        {required: true, message: '成果类型不能为空', trigger: 'change'}
                    ],
                    cgly: [
                        {required: true, message: '成果来源不能为空',}
                    ],
                },
                activeName: 'first',
                visibleProject: false,
                disabled: false,
                isHandleer: true,
                attaTableData: [],
                width: '300px',
                unbrid: true,
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
                bmTransfer: {
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
                dialogConfig: {
                    title: '选择',
                    width: '80%',
                    height: '500px',
                    visible: false,
                    modal: true,

                },
                tableObject: {
                    buttons: [],
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
                    treeFocusData: [],
                    api: '/pms/PmsWbs/list',
                    title: '表头名字',
                    chooseItem: 'single',
                    loading: false
                },
                bizdata: {
                    oid: '',//
                    cgname: '',//成果奖励名称
                    xmname: '',//项目名称
                    oidXm: '',//项目库主键ID
                    xmcode: '',//所内项目编号
                    rwname: '',//任务名称
                    oidRw: '',//WBSID
                    wbscode: '',//WBS编号
                    dataSecretLevcode: '',//密级
                    sqr: '',//主要完成人
                    sqdw: '',//主要完成单位
                    sqdwCode: '',// 申请单位编码
                    cgly: '',//成果来源
                    jxlx: '',//申报奖项类型
                    tjdj: '',//推荐等级
                    zypsz: '',//专业评审组
                    cglx: '',//成果类型
                    xmdateStart: '',//项目起始时间
                    xmdateEnd: '',//项目完成时间
                    sqdate: '',//申请日期
                    sqly: '',//申请说明
                    dateRemark: '',//备注
                    xtFjs: [],//协同附件
                },
                // 项目密级
                xmMj: 100,
                // 任务密级
                rwMj: 100,
                fjdata: [],
            }
        },
        methods: {
            // 日期控制
            pickerOptions (type) {
                if (type == 1) {
                    let end = this.bizdata.xmdateEnd;
                    return {
                        disabledDate(time) {
                            let dStr = moment(end).valueOf();
                            return time.getTime() > dStr;
                        }
                    }
                } else {
                    let start = this.bizdata.xmdateStart;
                    return {
                        disabledDate(time) {
                            let dStr = moment(start).valueOf();
                            return time.getTime() < dStr;
                        }
                    }
                }
            },
            changeFj(data) {
                this.fjdata = data;
            },
            alterationAssign(flowContext, bizdata) {

            },
            flowReady(flowContext, bizdata) {
                //流程初始化
                let flowData = this.$refs.flowForm.flowInstData;
                // console.log(flowData)
                let bizData;
                if (flowData.proOperates != null) {
                    bizData = JSON.parse(flowData.currentBizData.bizData);
                    this.bizdata = bizdata
                } else {
                    this.get(this.oid)
                    this.getHtFjData(this.oid)
                }
                Object.assign(this.bizdata, bizdata);
                //驳回才能编辑
                this.editable(flowData.proOperates);
            },
            flowOperateBtn(flowContext, bizdata) {
                //按钮操作事件
                console.log('按钮操作事件')
                let isContinue = false;
                this.$refs.form.validate((valid) => {
                    if (!valid) return;
                    flowContext.processVar = {money: 5000};
                    isContinue = true;
                });
                if (isContinue)
                    return true
                else
                    return false
            },
            flowBizData() {
                //获取业务表单数据
                console.log('获取业务表单数据')
                this.bizdata.xtFjs = this.$refs.attachment.getVisibleDataAndDelData();
                return this.bizdata;
            },
            // 保存成功后的回调
            handleCallbackFlow(data) {
                console.log(data, 'data3515611');
                this.bizdata = data;
                this.attaTableData = data.xtFjs;
            },
            //根据oid获取单条
            get(oid) {
                if (!oid) return;
                this.$axios.get("/pms/PmsCgJxsb/get", {params: {id: oid}})
                    .then(result => {
                        this.bizdata = result.data
                    })
                    .catch(error => {
                        this.$message.error("获取数据失败！")
                    })
            },
            // --------- 项目关联 start ----------
            selectProject(item) {
                console.log(item)
                this.bizdata['xmname'] = item[0].xmname
                this.bizdata.oidXm = item[0].oid
                this.bizdata.xmcode = item[0].xmcode
                this.xmMj = item[0].dataSecretLevcode
                this.visibleProject = false;
            },
            showXm() {
                this.visibleProject = true;
            },
            showRw() {
                this.dialogConfig.visible = true;
            },
            // --------- 项目关联 end ----------
            editable(data) {
                if (data) {
                    let operate = data[data.length - 1];
                    // console.log('reject' === operate.operateKey)
                    if ('reject' != operate.operateKey) {
                        // this.disabled = true;
                        this.isHandleer = false;
                    }
                }
            },
            // 获取奖项申报附件数据
            getHtFjData(oidJxsb) {
                if (!oidJxsb) return;
                this.$axios.get("/pms/XtFj/listByBoid", {params: {boid: oidJxsb}})
                    .then(result => {
                        result.data.map(d => {
                            this.attaTableData.push(d);
                        });
                    })
                    .catch(error => {
                        this.$message.error("获取申报附件数据失败！")
                    })
            },
            //左树右表start
            // 获取近5年的年份
            nearFiveYears() {
                let date = new Date();
                let currentYear = date.getFullYear();
                let arr = [];
                for (let i = 0; i < 5; i++) {
                    arr.push(currentYear);
                    currentYear -= 1;
                }
                return arr.join(',');
            },
            handleToggleDialog() {
                this.dialogConfig.visible = !this.dialogConfig.visible;
            },
            // 子组件点击回调  选中的数据
            handleCallback(data) {
                // 回调后数据操作
                this.bizdata.rwname = data[0].rwname
                this.bizdata.oidRw = data[0].oid
                this.bizdata.wbscode = data[0].wbscode
                this.rwMj = data[0].dataSecretLevcode
                this.bizdata.xmname = this.tableObject.treeFocusData.xmname
                this.bizdata.oidXm = this.tableObject.treeFocusData.oid
                this.bizdata.xmcode = this.tableObject.treeFocusData.xmcode
            },
            // 树组件选中回调
            handleTreeCallback(data) {
                this.tableObject.treeFocusData = data
                if (data.oid === '') return;
                this.tableObject.query[0].value = data.oid;
                this.$refs.tableTree.refresh();
            },

            getColumn() {
                return this.tableObject.columns.map((item) => {
                    return item.code;
                })
            },
            //左树右表end
            showRy() {
                this.$refs.us.openDialog();
            },
            getUserData(data) {
                console.log(data[0])
                this.bizdata.sqr = data[0].name;
                this.bizdata.sqdw = data[0].deptShortName;
            },
            //部门树
            handleCallbackTree(data) {
                console.log(data)
                this.bizdata.sqdw = data.deptName;
                if (data.deptName != '三所') {
                    this.visibleBm = false;
                }
            },
        },
        watch: {},
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },

    }
</script>

<style scoped>

</style>
