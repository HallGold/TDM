<template>
    <!--服务受理==》办理-->
    <el-form :model="Form" :disabled="keyRea" :rules="formRules" ref="form">
        <ice-grid-layout :columns="3" name="基础信息">
            <el-form-item label="性质:" label-width="130px" prop="centerServiceVo.serviceProperty">
                <ice-select v-model="Form.centerServiceVo.serviceProperty" placeholder="性质"
                            map-type-code="serviceProperties"></ice-select>
            </el-form-item>
            <el-form-item label="类别:" label-width="130px" prop="centerServiceVo.isBreakdown">
                <ice-select v-model="Form.centerServiceVo.isBreakdown" placeholder="类别" @changevalue="changeIsBreakdown"
                            map-type-code="Category"
                ></ice-select>
            </el-form-item>
            <el-form-item label="影响度:" label-width="130px" prop="centerServiceVo.serviceRange">
                <ice-select v-model="Form.centerServiceVo.serviceRange" placeholder="影响度"
                            map-type-code="requestPriority"
                            :disabled="aclKeyReadonly"></ice-select>
            </el-form-item>
            <el-form-item label="紧急度:" label-width="130px" prop="centerServiceVo.serviceEmergency">
                <ice-select v-model="Form.centerServiceVo.serviceEmergency" placeholder="紧急度"
                            map-type-code="requestUrgent"
                            :disabled="aclKeyReadonly"></ice-select>
            </el-form-item>
            <el-form-item label="优先级:" label-width="130px" prop="centerServiceVo.servicePriority">
                <ice-select v-model="Form.centerServiceVo.servicePriority" placeholder="优先级"
                            map-type-code="servicePriority"
                            :disabled="true"></ice-select>
            </el-form-item>
            <el-form-item label="批量数:" label-width="130px">
                <el-input-number placeholder="1"
                                 :min="1"
                                 :precision="0"
                                 v-model="mainDataForm.proEvtUserTicket.num"></el-input-number>
            </el-form-item>
            <el-form-item label="区域:" label-width="130px" prop="centerServiceVo.shortname">
                <el-select v-model="Form.centerServiceVo.areaCode" placeholder="区域" @change="cutArea">
                    <el-option v-for="item in area"
                               :key="item.code"
                               :label="item.shortname"
                               :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务名称:" label-width="130px" prop="centerServiceVo.psbcname">
                <el-input v-model="Form.centerServiceVo.psbcname" placeholder="服务名称" readonly>
                    <el-button slot="append" icon="el-icon-more" @click="selectSome"></el-button>
                </el-input>

            </el-form-item>
            <el-form-item label="服务项:" label-width="130px">
                <el-input v-model="Form.centerServiceVo.sname" placeholder="服务项" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="申请级别:" label-width="130px">
                <el-input v-model="Form.centerServiceVo.lvTitle" placeholder="申请级别" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="是否0级:" label-width="130px" v-show="whether">
                <el-radio-group class="user" v-model="Form.centerServiceVo.isLevelZero" @change="isLevelZeroItem">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="label" label-width="130px" prop="centerServiceVo.durationDoneExpected">
                <el-col :span="14">
                    <!--自定义处置时长-->
                    <el-input v-if="timeCl"
                              v-model="Form.centerServiceVo.durationDoneCustom"></el-input>
                    <!--预计处置时长-->
                    <el-input v-if="!timeCl" disabled
                              v-model="Form.centerServiceVo.durationDoneExpected"></el-input>
                </el-col>
                <!--
                durationDoneCustom 自定义处置时长
                durationDoneExpected 预计处置时长
                -->
                <el-col :span="10">
                    <ice-select :disabled="labels"
                                v-model="Form.centerServiceVo.durationDoneUnit"
                                mapTypeCode="Time"></ice-select>
                </el-col>
            </el-form-item>
            <el-form-item label="是否影响服务:" label-width="130px" v-if="YRN">
                <el-radio-group class="user" v-model="Form.centerServiceVo.isServiceBreakdown">
                    <el-radio label="0">是</el-radio>
                    <el-radio label="1">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="描述:" label-width="130px" layout="3">
                <el-input placeholder="描述" v-model="Form.centerServiceVo.description" rows="6"
                          type="textarea"></el-input>
                <el-input v-model="Form.centerServiceVo.areaId" v-show="false"></el-input>
            </el-form-item>
            <el-form-item layout="3">
                <!--技术服务目录-->
                <!--传区域code到技术服务目录添加-->
                <el-form-item label-width="130px" label="技术服务目录："></el-form-item>
                <!--
                :beforeBindData="skill"
                biz/ProEvtServiceTicket/searchTech
                -->
                <ice-query-grid
                        data-url="biz/ProEvtServiceTicket/searchTech"
                        :query="query"
                        :gridAutoRefresh="false"
                        :columns=columns
                        :buttons=twoButton
                        chooseItem="multiple"
                        :gridData="skillNum"
                        :pagination="false"
                        @selection-change="change"
                        ref="skillGrid">
                </ice-query-grid>
            </el-form-item>
        </ice-grid-layout>
        <pro-sc-common-biz-catalog @selection-change="selectionChange"
                                   :areaId="areaId"
                                   ref="bizCatalog"
                                   :columns="addColumns"
                                   width="1000px"
        ></pro-sc-common-biz-catalog>
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
    import {EventEmitter as $} from "events";
    import ProScCommonTemplate from "../../../pro/sc/common/ProScCommonTemplate";
    import ProScCommonTechTree from "../../../pro/sc/common/ProScCommonTechTree.vue";
    import Bus from "./bus.js"
    import ProScTechTree from "../../../pro/sc/ProScTechTree";
    import ProScCommonBizCatalog from "../../../pro/sc/common/ProScCommonBizCatalog";

    export default {
        name: "baseMessage",
        props: {
            Form: {},
            serviceStatu: String,
            serviceTicket: String,
            mainDataForm: {}
        },
        components: {
            ProScCommonBizCatalog,
            ProScTechTree,
            ProScCommonTechTree, ProScCommonTemplate, IceSelect, Bus,
            IceGridLayout, IceEditableTable, serviceList, IceDialog, IceQueryGrid
        },
        data() {
            return {
                url: "",
                artUrl: "",
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
                flag: false,
                //所选区域oid
                areaOid: "",
                checkedNodeList: "",
                YRN: false,
                templateId: "",
                URLS: "",
                keyRea: false,
                timeCl: false,
                isZero: "",
                /**
                 * 时长 数目及单位
                 * */
                timeNum: "",
                timeUnit: "",
                arrData: [],
                skillNum: [],
                columns: [
                    {label: '区域', code: 'areaName',},
                    {label: '服务大类', code: 'parentName',},
                    {label: '服务分类', code: 'categoryName',},
                    {label: '服务项', code: 'catalogName',},
                ],
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
                twoButton: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: 'primary', callback: this.add
                    },
                    {
                        name: '删除', icon: 'el-icon-delete', type: 'primary', callback: this.del
                    },
                ],
                formRules: {
                    'centerServiceVo.serviceProperty': [{required: true, message: '请选择性质', trigger: 'blur'}],
                    "centerServiceVo.psbcname": [{required: true, message: '请选择服务名称', trigger: 'blur'}],
                    "centerServiceVo.isBreakdown": [{required: true, message: '请选择服务类别', trigger: 'blur'}],
                    // "centerServiceVo.shortname": [{required: true, message: '请选择区域类别', trigger: 'blur'}],
                },
                typeRulesZero: {
                    'centerServiceVo.serviceProperty': [{required: true, message: '请选择性质', trigger: 'blur'}],
                    "centerServiceVo.psbcname": [{required: true, message: '请选择服务名称', trigger: 'change'}],
                    "centerServiceVo.isBreakdown": [{required: true, message: '请选择服务类别', trigger: 'blur'}],
                    // "centerServiceVo.shortname": [{required: true, message: '请选择区域类别', trigger: 'blur'}],
                },
                typeRulesOne: {
                    "centerServiceVo.serviceRange": [{required: true, message: '请选择影响度', trigger: 'blur'}],
                    "centerServiceVo.serviceEmergency": [{required: true, message: '请选择紧急度', trigger: 'blur'}],
                },
                query: [
                    {
                        type: 'static', code: 'serviceTicket', exp: '=', value: () => {
                            return this.serviceTicket;
                        },
                    }
                ],
            }
        },
        methods: {
            changeIsBreakdown(data) {
                this.formRules = {};
                if (data == '0') {
                    Object.assign(this.formRules, this.typeRulesZero);
                } else {
                    Object.assign(this.formRules, this.typeRulesZero, this.typeRulesOne);
                }
            },
            /*获取树的数据*/
            getData(data) {
                for (let i = 0; i < data.length; i++) {
                    let oneNum = {
                        areaName: data[i].areaName,
                        parentName: data[i].bigCategoryName,
                        categoryName: data[i].categoryName,
                        catalogName: data[i].name
                    };
                    this.skillNum.push(oneNum);
                }
                this.Form.centerServiceVo.techId = data;
            },
            /*刷新form表单*/
            refreshForm() {
                this.$refs.form.resetFields();
                this.keyRea = false;
            },
            async startUrl() {
                this.$refs.skillGrid.refresh();
            },
            hidens() {
                this.keyRea = true;
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
            selectionChange(data) {
                this.Form.centerServiceVo.catalogId = data[0].oid;
                //categoryName  服务名称
                this.Form.centerServiceVo.psbcname = data[0].categoryName;
                //catalogName   服务项
                this.Form.centerServiceVo.sname = data[0].catalogName;
                //lv    申请级别
                this.Form.centerServiceVo.lvTitle = data[0].lv + "级";
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
                    /**使用用户级别*/
                    this.isZero = data[0].isUsrLv;
                    if (data[0].isUsrLv == "0") {
                        this.timeCl = false;
                        this.Form.centerServiceVo.durationDoneExpected = this.timeNum;
                        this.Form.centerServiceVo.durationDoneUnit = this.timeUnit;
                    }
                    /**不使用用户级别*/
                    else if (data[0].isUsrLv == "1") {
                        this.whether = true;
                        this.timeCl = true;
                        this.labels = false;
                        this.Form.centerServiceVo.durationDoneUnit = "2";
                    }
                })
            },
            /**点击保存时确定到底是预计处置时长还是自定义处置时长*/
            suerType() {
                if (this.isZero == "0") {
                    /**预计处置时长*/
                    /**清空自定义处置时长所赋值*/
                    this.Form.centerServiceVo.durationDoneExpected = '';
                } else {
                    /**判断是否0级*/
                    /**是0级，自定义处置时长 清除预计处置时长所赋值*/
                    if (this.Form.centerServiceVo.isLevelZero == "0") {
                        this.Form.centerServiceVo.durationDoneExpected = '';
                    }
                    /**不是0级，预计处置时长 清除自定义处置时长所赋值*/
                    else {
                        this.Form.centerServiceVo.durationDoneCustom = '';
                    }
                }
            },
            /**获取techId*/
            techId(data, list, result) {
                for (let i = 0; i < result.length; i++) {
                    let oneNum = {
                        areaName: result[i].areaName,
                        parentName: result[i].bigCategoryName,
                        categoryName: result[i].categoryName,
                        catalogName: result[i].name
                    };
                    this.skillNum.push(oneNum);
                }
                this.Form.centerServiceVo.techId = data;
            },
            /**
             * 验证
             * */
            testing() {
                let flag = false;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            changeRegion() {
                this.$refs.$region.opendialog()
            },
            //技术目录新增
            add() {
                if (this.Form.centerServiceVo.areaCode == "请选择" || this.Form.centerServiceVo.areaCode == "" || this.Form.centerServiceVo.areaCode == undefined) {
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
            isLevelZeroShow(result) {
                /**判断数据存在哪里
                 * durationDoneCustom       自定义处置时长
                 * durationDoneExpected     预计处置时长
                 * */
                this.Form.centerServiceVo.isLevelZero = result.isLevelZero;
                if (result.durationDoneCustom != null) {
                    this.Form.centerServiceVo.durationDoneUnit = result.durationDoneUnit ? result.durationDoneUnit + '' : '';
                    this.Form.centerServiceVo.durationDoneCustom = result.durationDoneCustom;
                    this.label = "自定义处置时长:";
                    this.timeCl = true;
                    this.labels = true;
                    this.whether = true;
                } else {
                    this.Form.centerServiceVo.durationDoneUnit = "2";
                    this.Form.centerServiceVo.durationDoneExpected = result.durationDoneExpected ? result.durationDoneExpected : '24';
                    this.label = "预计处置时长:";
                    this.timeCl = false;
                    this.labels = true;
                }
            },
            isLevelZeroItem() {
                //判断是否0级
                if (this.Form.centerServiceVo.isLevelZero == "0") {
                    this.timeCl = true;
                    this.labels = false;
                    this.Form.centerServiceVo.durationDoneUnit = "2";
                } else if (this.Form.centerServiceVo.isLevelZero == "1") {
                    this.timeCl = false;
                    this.labels = true;
                    this.Form.centerServiceVo.durationDoneUnit = this.timeUnit;
                    this.Form.centerServiceVo.durationDoneUnit = "2";
                }
            },
            selectSome() {
                for (let i = 0; i < this.area.length; i++) {
                    //techCatalogId 服务项ID
                    if (this.area[i].code == this.Form.centerServiceVo.areaCode) {
                        this.areaId = this.area[i].oid;
                        // pro/ProScBizTech/list
                    }
                }
                //TECHCATALOG_ID 技术服务项ID        BIZAREA_ID 区域ID
                if (this.Form.centerServiceVo.areaCode == "请选择" || this.Form.centerServiceVo.areaCode == "" || this.Form.centerServiceVo.areaCode == undefined) {
                    this.$confirm('请先选择区域！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    for (let i = 0; i < this.area.length; i++) {
                        if (this.area[i].code == this.Form.centerServiceVo.areaCode) {
                            this.areaId = this.area[i].oid;
                            this.Form.centerServiceVo.areaId = this.areaId;
                            this.Form.centerServiceVo.areaShortname = this.area[i].shortname;
                        }
                    }
                    this.$refs.bizCatalog.openDialog();
                }
            },
            templateData(data1, data2) {
                if (data1 != "" && data1 != undefined) {
                    this.templateId = data1;
                    this.areaId = data2;
                }
            },
            /**选择新的区域时清空之前所选数据*/
            cutArea() {
                this.Form.centerServiceVo.psbcname = "";
                this.Form.centerServiceVo.sname = "";
                this.Form.centerServiceVo.lvTitle = "";
                this.Form.centerServiceVo.durationDoneExpected = "";
                this.Form.centerServiceVo.durationDoneCustom = "";
            }
        },
        mounted() {
            let type = this.$route.query['type'];
            let click = this.$route.query['click'];
            if (type == "detail") {
                this.twoButton = [];
            }
            if (click != undefined && click == "look") {
                this.keyRea = true;
            }
            this.isTrue = false;
        },
        beforeUpdate() {
            //影响度*紧急度=N；N<4,优先级=1；N<9,优先级=2；N<16，优先级=3；N=16,优先级=4；
            if (this.Form.centerServiceVo.serviceRange == "" || this.Form.centerServiceVo.serviceEmergency == "") {
                this.Form.centerServiceVo.servicePriority = "";
            } else {
                let N = this.Form.centerServiceVo.serviceRange * this.Form.centerServiceVo.serviceEmergency;
                if (N < 4) {
                    this.Form.centerServiceVo.servicePriority = '1';
                } else if (N >= 4 && N < 9) {
                    this.Form.centerServiceVo.servicePriority = '2';
                } else if (N >= 9 && N < 16) {
                    this.Form.centerServiceVo.servicePriority = '3';
                } else if (N == 16) {
                    this.Form.centerServiceVo.servicePriority = '4';
                }
            }

            //服务申请与故障申报的区别
            if (this.Form.centerServiceVo.isBreakdown == "0") {
                this.Form.centerServiceVo.serviceRange = "";
                this.Form.centerServiceVo.serviceEmergency = "";
                this.Form.centerServiceVo.servicePriority = "";
                this.YRN = false;
                this.aclKeyReadonly = true;
                this.only = false;
            } else {
                this.aclKeyReadonly = false;
                this.only = true;
                this.YRN = true;
            }
            //区域与技术服务目录
            if (this.Form.centerServiceVo.areaCode !== "请选择") {
                for (let i = 0; i < this.area.length; i++) {
                    if (this.area[i].code === this.Form.centerServiceVo.areaCode) {
                        this.areaOid = this.area[i].oid;
                    }
                }
            }
        },
        beforeCreate() {
            this.$axios.get('/pro/ProBaseArea/tree').then(result => {
                this.area = result.data[0].children;
            });
            // biz/ProEvtServiceTicket/searchObject
            //前一页面所传值
            let tabs = this.$route.query['tabs'];
            //前一页面所传属性
            let type = this.$route.query['type'];
            if (tabs == "0" && type == "detail") {
                this.keyRea = true;
                this.twoButton = [];
            } else if (tabs === "1" && type == "detail") {
                this.keyRea = true;
                this.twoButton = [];
            } else if (tabs === "2" && type == "detail") {
                this.keyRea = true;
                this.twoButton = [];
            } else if (tabs === "3" && type == "detail") {
                this.keyRea = true;
                this.twoButton = [];
            } else {
                this.keyRea = false;
            }
        },
        watch: {
            /*树返回的techId*/
            "Form.centerServiceVo.techId": function (nowVal, oldVal) {
                if (nowVal != oldVal) {
                    this.Form.techId = nowVal;
                }
            },
            "Form.centerServiceVo.psbcname": function (nowVal, oldVal) {
                this.$refs.form.clearValidate("centerServiceVo.psbcname");
            },
            timeCl(nowVal) {
                if (nowVal == true) {
                    this.label = "自定义处置时长:";
                } else {
                    this.label = "预计处置时长:"
                }
            },
            deep: true
        }
    }
</script>

<style scoped>

</style>