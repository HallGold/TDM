<template>
    <el-form :model="dataForm" :rules="formRules" ref="dataForms">
        <!--申请补录 基础信息-->
        <ice-grid-layout :columns="3" name="基础信息">
            <el-form-item label="性质:" label-width="115px" prop="ProEvtServiceTicket.serviceProperty">
                <ice-select
                        v-model="dataForm.ProEvtServiceTicket.serviceProperty"
                        placeholder="性质"
                        map-type-code="serviceProperties"></ice-select>
            </el-form-item>
            <el-form-item label="类别:" label-width="115px" prop="ProEvtServiceTicket.isBreakdown">
                <ice-select
                        v-model="dataForm.ProEvtServiceTicket.isBreakdown"
                        placeholder="类别"
                        map-type-code="Category"
                ></ice-select>
            </el-form-item>
            <el-form-item label="影响度:" label-width="115px" prop="ProEvtServiceTicket.serviceRange">
                <ice-select
                        v-model="dataForm.ProEvtServiceTicket.serviceRange"
                        placeholder="影响度"
                        map-type-code="requestPriority"
                        :disabled="aclKeyReadonly"></ice-select>
            </el-form-item>
            <el-form-item label="紧急度:" label-width="115px" prop="ProEvtServiceTicket.serviceEmergency">
                <ice-select
                        v-model="dataForm.ProEvtServiceTicket.serviceEmergency"
                        placeholder="紧急度"
                        map-type-code="requestUrgent"
                        :disabled="aclKeyReadonly"></ice-select>
            </el-form-item>
            <el-form-item label="优先级:" label-width="115px" prop="ProEvtServiceTicket.servicePriority">
                <ice-select
                        v-model="dataForm.ProEvtServiceTicket.servicePriority"
                        placeholder="优先级"
                        map-type-code="servicePriority"
                        :disabled="true"></ice-select>
            </el-form-item>
            <el-form-item label="区域:" label-width="115px" prop="ProEvtServiceTicket.areaCode">
                <el-select v-model="dataForm.ProEvtServiceTicket.areaCode" placeholder="区域" @change="cutArea">
                    <el-option v-for="item in area"
                               :key="item.code"
                               :label="item.shortname"
                               :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务名称:" label-width="115px" prop="ProEvtServiceTicket.psbcname">
                <el-input
                        readonly
                        v-model="dataForm.ProEvtServiceTicket.psbcname"
                        placeholder="服务名称">
                    <el-button slot="append" icon="el-icon-more" @click="selectSome"></el-button>
                </el-input>

            </el-form-item>
            <el-form-item label="服务项:" label-width="115px" prop="ProEvtServiceTicket.sname">
                <el-input placeholder="服务项" :disabled="true" v-model="dataForm.ProEvtServiceTicket.sname"></el-input>
            </el-form-item>
            <el-form-item label="申请级别:" label-width="115px" prop="ProEvtServiceTicket.lvTitle">
                <el-input placeholder="申请级别" :disabled="true" v-model="dataForm.ProEvtServiceTicket.lvTitle"></el-input>
            </el-form-item>
            <el-form-item label="是否0级:" label-width="115px" v-show="whether" prop="ProEvtServiceTicket.isLevelZero">
                <el-radio-group class="user" v-model="dataForm.ProEvtServiceTicket.isLevelZero"
                                @change="isLevelZeroItem">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="label" label-width="115px" prop="ProEvtServiceTicket.durationDoneExpected">
                <el-col :span="14">
                    <el-input :disabled="labels" v-model="timeType"
                    ></el-input>
                </el-col>
                <el-col :span="10">
                    <ice-select :disabled="labels" v-model="dataForm.ProEvtServiceTicket.durationDoneUnit"
                                map-type-code="Time"></ice-select>
                </el-col>
            </el-form-item>
            <el-form-item label="是否影响服务:" label-width="115px" v-show="false">
                <el-radio-group class="user" v-model="dataForm.ProEvtServiceTicket.isServiceBreakdown">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="描述:" label-width="105px" prop="ProEvtServiceTicket.description" layout="3">
                <el-input placeholder="描述" rows="6" v-model="dataForm.ProEvtServiceTicket.description"
                          type="textarea"></el-input>
            </el-form-item>
            <el-form-item layout="3" v-show="showD">
                <!--技术服务目录-->
                <!--传区域code到技术服务目录添加-->
                <el-form-item label-width="115px" label="技术服务目录："></el-form-item>
                <ice-query-grid
                        :query="query"
                        :columns=columns
                        :buttons=twoButton
                        chooseItem="multiple"
                        :gridData="skillNum"
                        :pagination="false"
                        @selection-change="change"
                        ref="skillGrid">
                </ice-query-grid>
            </el-form-item>
            <!--服务名称弹出窗-->
        </ice-grid-layout>
        <ice-grid-layout :columns="1" name="附件信息">
            <el-form-item layout="3" rows="6" label="附件上传:" label-width="105px" prop="">
                <ice-multiple-upload v-model="dataForm.ProEvtServiceTicket.targetId" doSecret value-model="string"
                                     ref="uploadFile"></ice-multiple-upload>
            </el-form-item>
        </ice-grid-layout>
        <div v-show="false">
            <el-input v-model="dataForm.ProEvtServiceTicket.areaId"></el-input>
            <el-input v-model="dataForm.ProEvtServiceTicket.templateId"></el-input>
        </div>
        <pro-sc-common-biz-catalog @selection-change="selectionChange"
                                   :areaId="areaId"
                                   :columns="addColumns"
                                   width="1000px"
                                   ref="bizCatalog"></pro-sc-common-biz-catalog>
        <!--技术服务目录新增-->
        <pro-sc-tech-tree ref="ProScTechTree" :isCallback="true" @getData="getData" btnName="确定"
                          :regionId="areaId"></pro-sc-tech-tree>
    </el-form>
</template>

<script>
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import serviceList from "../base/serviceList"
    import IceSelect from "../../../../components/common/base/IceSelect";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import ProScCommonTemplate from "../../../pro/sc/common/ProScCommonTemplate";
    import ProScCommonTree from "../../../pro/sc/common/ProScCommonTree";
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import ServiceAsk from "./serviceAsk";
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import bus from "./bus.js"
    import ProScTechTree from "../../../pro/sc/ProScTechTree";
    import DevSelect from "../../dev/devSelect";
    import ProScCommonBizCatalog from "../../../pro/sc/common/ProScCommonBizCatalog";

    export default {
        name: "addToMessage",
        props: {
            dataForm: {},
        },
        components: {
            ProScCommonBizCatalog,
            DevSelect,
            ProScTechTree,
            IceMultipleUpload, bus,
            ServiceAsk,
            ProScCommonTree,
            ProScCommonTemplate,
            IceSelect, IceSingleUpload,
            IceGridLayout, IceEditableTable, serviceList, IceDialog, IceQueryGrid
        },
        data() {
            return {
                aclKeyReadonly: true,
                whether: false,
                Visible: false,
                only: false,
                label: "预计处置时长:",
                labels: true,
                area: [],
                information: [],
                dataArr: [],
                areaId: "",
                catalogIds: "",
                showD: true,
                //所选区域oid
                areaOid: "",
                skillNum: [],
                timeNum: "",
                timeUnit: "",
                timeType: "",
                addColumns: [
                    {label: '区域名称', code: 'areaName',},
                    {label: '服务名称', code: 'categoryName', width: 150},
                    {label: '服务项', code: 'catalogName', width: 150},
                    {
                        label: '服务级别', code: 'lv', renderCell(h, data) {
                            return data.row.lv + "级"
                        }
                    },
                    {label: '是否使用用户级别', code: 'isUsrLv', mapTypeCode: "YES_NO"},
                    {label: '主管部门名称', code: 'deptName',},
                    {label: '有效开始时间', code: 'gmtBegin', width: 150},
                    {label: '有效结束时间', code: 'gmtEnd', width: 150},
                    {label: '创建人', code: 'creatorName',},
                ],
                columns: [
                    {label: '区域', code: 'areaName',},
                    {label: '服务大类', code: 'parentName',},
                    {label: '服务分类', code: 'categoryName',},
                    {label: '服务项', code: 'catalogName',},
                ],
                query: [{
                    type: 'static', code: 'BIZAREA_ID', exp: '=', value: () => {
                        return this.areaId;
                    },
                    type: 'static', code: 'BIZCATALOG_ID', exp: '=', value: () => {
                        return this.templateId;
                    }
                }],
                twoButton: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: 'primary', callback: this.add
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.del
                    },
                ],
                formRules: {
                    'ProEvtServiceTicket.serviceProperty': [{required: true, message: '请选择性质', trigger: 'blur'}],
                    "ProEvtServiceTicket.isBreakdown": [{required: true, message: '请选择类别', trigger: 'blur'}],
                    "ProEvtServiceTicket.psbcname": [{required: true, message: '请选择服务名称', trigger: 'change'}],
                }
            }
        },
        methods: {
            /*修改区域*/
            cutArea() {
                this.dataForm.ProEvtServiceTicket.psbcname = "";
                this.dataForm.ProEvtServiceTicket.sname = "";
                this.dataForm.ProEvtServiceTicket.lvTitle = "";
                this.dataForm.ProEvtServiceTicket.durationDoneExpected = "";
                this.dataForm.ProEvtServiceTicket.durationDoneCustom = "";
                this.timeType = "";
            },
            /**
             * 刷新数据
             * */
            refreshData() {
                this.dataForm.ProEvtServiceTicket = {
                    serviceProperty: "",
                    isBreakdown: "0",
                    serviceRange: "",
                    serviceEmergency: "",
                    servicePriority: "",
                    areaCode: "请选择",
                    psbcname: "",
                    sname: "",
                    lvTitle: "",
                    handlerText: "",
                    description: "",
                    isServiceBreakdown: "0",
                    durationDoneUnit: "",
                    isLevelZero: "0",
                    targetId: [],
                };
                this.timeType = "";
                this.skillNum = [];
                this.$refs.skillGrid.refresh();
                if (this.dataForm.ProEvtServiceTicket.targetId != "" || this.dataForm.ProEvtServiceTicket.targetId != undefined) {
                    this.$refs.uploadFile.clearFiles();
                }
            },
            /*获取树的数据*/
            getData(data) {
                for (let i = 0; i < data.length; i++) {
                    let oneNum = {
                        areaName: data[i].areaName,
                        parentName: data[i].bigCategoryName,
                        categoryName: data[i].categoryName,
                        catalogName: data[i].name,
                        techId: data[i].techId
                    };
                    this.skillNum.push(oneNum);
                }
            },
            /*技术服务目录删除*/
            del() {
                if (this.dataArr.length == "0") {
                    this.$confirm('请选择一条或者多条数据进行操作！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确定删除?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.skillNum.length; i++) {
                            for (let j = 0; j < this.dataArr.length; j++) {
                                if (this.skillNum[i].catalogName === this.dataArr[j].catalogName) {
                                    this.skillNum.splice(i, 1);
                                    this.$message.success("删除成功");
                                }
                            }
                        }
                    })
                }
            },
            /*是否0级*/
            //0 是 1 否
            isLevelZeroItem() {
                if (this.dataForm.ProEvtServiceTicket.isLevelZero == "0") {
                    this.label = "自定义处置时长:";
                    this.labels = false;
                    this.timeType = "";
                    this.dataForm.ProEvtServiceTicket.durationDoneCustom = this.timeType;
                    this.dataForm.ProEvtServiceTicket.durationDoneUnit = "2";
                    this.dataForm.ProEvtServiceTicket.durationDoneExpected = "";
                } else if (this.dataForm.ProEvtServiceTicket.isLevelZero == "1") {
                    this.label = "预计处置时长:";
                    this.labels = true;
                    this.timeType = this.timeNum;
                    this.dataForm.ProEvtServiceTicket.durationDoneExpected = this.timeNum;
                    this.dataForm.ProEvtServiceTicket.durationDoneUnit = this.timeUnit;
                    this.dataForm.ProEvtServiceTicket.durationDoneCustom = "";

                }
            },
            selectionChange(data) {
                this.dataForm.ProEvtServiceTicket.catalogId = data[0].oid;
                //categoryName  服务名称
                this.dataForm.ProEvtServiceTicket.psbcname = data[0].categoryName;
                //catalogName   服务项
                this.dataForm.ProEvtServiceTicket.sname = data[0].catalogName;
                //lv    申请级别
                this.dataForm.ProEvtServiceTicket.lvTitle = data[0].lv + "级";
                this.templateId = data[0].templateId;
                this.$axios.get('pro/ProScSlaLevel/listTime', {
                    params: {
                        lvType: "2",
                        lv: data[0].lv,
                        areaId: this.areaId
                    }
                }).then(result => {
                    if (result.data.length == "0") {
                        this.timeNum = "24";
                        this.timeUnit = "2";
                    } else {
                        this.timeNum = result.data[0].target;
                        this.timeUnit = result.data[0].unit;
                    }
                    /**
                     * target    时间
                     * unit      单位
                     * */
                    if (data[0].isUsrLv == "0") {
                        this.whether = false;
                        this.label = "预计处置时长:";
                        this.labels = true;
                        this.timeType = "";
                        this.dataForm.ProEvtServiceTicket.durationDoneExpected = this.timeNum;
                        this.timeType = this.timeNum;
                        this.dataForm.ProEvtServiceTicket.durationDoneUnit = this.timeUnit;
                        this.dataForm.ProEvtServiceTicket.durationDoneCustom = "";
                    } else if (data[0].isUsrLv == "1") {
                        this.timeType = "";
                        this.whether = true;
                        this.label = "自定义处置时长:";
                        this.labels = false;
                        this.dataForm.ProEvtServiceTicket.durationDoneExpected = "";
                        this.dataForm.ProEvtServiceTicket.durationDoneCustom = this.timeType;
                        this.dataForm.ProEvtServiceTicket.durationDoneUnit = "2";
                    }

                })
            },
            isOK() {
                let flag = false;
                this.$refs.dataForms.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            ATMRefresh() {
                this.$refs.dataForms.resetFields();
            },
            changeRegion() {
                this.$refs.$region.opendialog()
            },
            //技术目录新增
            add() {
                if (this.dataForm.ProEvtServiceTicket.areaCode == "请选择" || this.dataForm.ProEvtServiceTicket.areaCode == "" || this.dataForm.ProEvtServiceTicket.areaCode == undefined) {
                    this.$confirm('请先选择区域！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$refs.ProScTechTree.openDialog(this.templateId);
                }
            },
            change(row) {
                this.dataArr = row;
            },
            selectSome() {
                if (this.dataForm.ProEvtServiceTicket.areaCode == "请选择" || this.dataForm.ProEvtServiceTicket.areaCode == "") {
                    this.$confirm('请先选择区域！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    for (let i = 0; i < this.area.length; i++) {
                        if (this.area[i].code == this.dataForm.ProEvtServiceTicket.areaCode) {
                            this.areaId = this.area[i].oid;
                            this.dataForm.ProEvtServiceTicket.areaId = this.areaId;
                        }
                    }
                    this.$refs.bizCatalog.openDialog();
                }
            },
        },
        beforeUpdate() {
            //影响度*紧急度=N；N<4,优先级=1；N<9,优先级=2；N<16，优先级=3；N=16,优先级=4；
            if (this.dataForm.ProEvtServiceTicket.serviceRange == "" || this.dataForm.ProEvtServiceTicket.serviceEmergency == "") {
            } else {
                let N = this.dataForm.ProEvtServiceTicket.serviceRange * this.dataForm.ProEvtServiceTicket.serviceEmergency;
                if (N < 4) {
                    this.dataForm.ProEvtServiceTicket.servicePriority = "1";
                } else if (N >= 4 && N < 9) {
                    this.dataForm.ProEvtServiceTicket.servicePriority = "2";
                } else if (N >= 9 && N < 16) {
                    this.dataForm.ProEvtServiceTicket.servicePriority = "3";
                } else if (N == 16) {
                    this.dataForm.ProEvtServiceTicket.servicePriority = "4";
                }
            }
            //服务申请与故障申报的区别
            if (this.dataForm.ProEvtServiceTicket.isBreakdown == "0") {
                this.aclKeyReadonly = true;
                this.only = false;
            } else {
                this.aclKeyReadonly = false;
                this.only = true;
            }
            //区域与技术服务目录
            if (this.dataForm.ProEvtServiceTicket.areaCode !== "请选择") {
                for (let i = 0; i < this.area.length; i++) {
                    if (this.area[i].code === this.dataForm.ProEvtServiceTicket.areaCode) {
                        this.areaOid = this.area[i].oid;
                    }
                }
            }
        },
        beforeCreate() {
            this.$axios.get('/pro/ProBaseArea/tree').then(result => {
                this.area = result.data[0].children;
            });
        },
        mounted() {
            this.$nextTick(() => {
                this.$refs.dataForms.resetFields();
            })
            this.timeType = "";
            this.timeUnit = "";
            this.timeNum = "";
            this.dataForm.ProEvtServiceTicket.durationDoneCustom = "";
            this.dataForm.ProEvtServiceTicket.durationDoneUnit = "";
            this.dataForm.ProEvtServiceTicket.durationDoneExpected = "";
        },
        watch: {
            skillNum(nowVal) {
                this.dataForm.serviceTicketCatalogs = nowVal;
            },
            "dataForm.ProEvtServiceTicket.isBreakdown": function (nowVal) {
                if (nowVal == "0") {
                    this.dataForm.ProEvtServiceTicket.serviceRange = "";
                    this.dataForm.ProEvtServiceTicket.serviceEmergency = "";
                    this.dataForm.ProEvtServiceTicket.servicePriority = "";
                }
            },
            timeType(nowVal, oldVal) {
                if (this.dataForm.ProEvtServiceTicket.isLevelZero == "0") {
                    this.dataForm.ProEvtServiceTicket.durationDoneCustom = this.timeType;
                    this.dataForm.ProEvtServiceTicket.durationDoneExpected = "";
                } else {
                    this.dataForm.ProEvtServiceTicket.durationDoneExpected = this.timeType;
                    this.dataForm.ProEvtServiceTicket.durationDoneCustom = "";
                }
            },
            deep: true
        }
    }
</script>

<style scoped>
</style>