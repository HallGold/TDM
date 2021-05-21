<template>
    <ice-flow-form
            ref="flowForm"
            style="width: 100%"
            :flow-ready="flowReady"
            :flow-biz-data="flowBizData"
            :flow-operate-btn="flowOperateBtn">
        <el-form :rules="Rules" :model="dangerMessage" ref="form" :disabled="dangerDisabled">
            <ice-grid-layout :columns="2" name="">
                <el-form-item label="申请人:" label-width="140px" prop="applyName">
                    <ice-persion-selector
                            title="请选择"
                            :all-dept="true"
                            @select-confirm="selectDeptConfirm"
                            v-model="dangerMessage.applyName"
                            choose-item="single"
                            mode="onlySelect"
                    ></ice-persion-selector>
                    <el-input v-model="dangerMessage.applyId" v-if="false"></el-input>
                </el-form-item>
                <el-form-item label="申请单位:" label-width="140px" prop="applyUnit">
                    <el-input v-model="dangerMessage.applyUnit" :disabled="true"></el-input>
                    <el-input v-model="dangerMessage.applyCode" v-if="false"></el-input>
                </el-form-item>
                <el-form-item label="申请时间:" label-width="140px" prop="createTime">
                    <el-date-picker :disabled="true" type="datetime"
                                    v-model="dangerMessage.createTime"></el-date-picker>
                </el-form-item>
            </ice-grid-layout>
            <!--进入申请-->
            <apply-for :applyForm="applyForm" ref="applyR"></apply-for>
            <!--实际进入信息-->
            <reality :realityForm="realityForm" ref="realityR" v-if="escortShow"></reality>
        </el-form>
    </ice-flow-form>
</template>

<script>
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AccessPop from "./comm/accessPop";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceMultipleUpload from "../../../components/common/base/IceMultipleUpload";
    import bus from "./comm/bus.js"
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import ApplyFor from "./comm/applyFor";
    import Reality from "./comm/reality";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";

    export default {
        name: "addNew",
        components: {
            IcePersionSelector,
            Reality,
            ApplyFor, IceFlowForm, IceMultipleUpload, IceSelect, AccessPop, IceQueryGrid, IceGridLayout, bus
        },
        data() {
            return {
                escortShow: false,
                dangerDisabled: false,
                isTrueValue: false,
                flowContent: '',
                userData: {},
                /*主页form*/
                dangerMessage: {
                    applyName: "",
                    applyUnit: "",
                    applyCode: "",
                    createTime: "",
                    applyId: ""
                },
                /*进入申请form*/
                applyForm: {
                    escort: "",
                    predictIntoDate: "",
                    predictOutDate: "",
                    isContact: '1',
                    isCrucial: '1',
                    name: "",
                    content: "",
                    manageType: "",
                    type: "",
                    unitName: "",
                    unit: "",
                    isCarry: "1",
                    targetId: "",
                    predictCarry: "",
                    escortId: "",
                    /*申请进入部位ID*/
                    manageId: "",
                    BizCrucialPointEnthetics: []
                },
                /*实际进入信息form*/
                realityForm: {
                    isInto: "1",
                    actualIntoDate: "",
                    actualOutDate: "",
                    actualCarryArticle: "",
                    workContent: "",
                    isSave: "",
                    saveItem: ""
                },
                /*流程提交Form数据主对象*/
                finalNum: {
                    ApplyInVo: {},
                },
                Rules: {
                    'applyName': [{required: true, message: '请输入申请人姓名', trigger: 'blur'}],
                    'applyUnit': [{required: true, message: '请输入申请单位', trigger: 'blur'}],
                    'createTime': [{required: true, message: '请选择申请时间', trigger: 'blur'}],
                }
            }
        },
        methods: {
            /**清除localStorage中存储的数据*/
            clearData() {

            },
            /**申请人选择*/
            selectDeptConfirm(rows) {
                this.dangerMessage.applyUnit = rows[0].deptShortName;
                this.dangerMessage.applyId = rows[0].code;
                this.dangerMessage.applyCode = rows[0].dataDeptCode;
            },
            /**页面校验*/
            dangerRe() {
                this.dangerTrue();
                return this.isTrueValue
            },
            dangerTrue() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.isTrueValue = true;
                        return true
                    } else {
                        this.isTrueValue = false;
                        return false
                    }
                });
            },
            /**流程开始加载*/
            flowReady(flowContext, bizdata) {
                this.flowContent = flowContext;
                let routeObj = this.$route.query;
                if (flowContext.nodeId != "FirstNode") {
                    this.drawData(bizdata);
                    this.dangerDisabled = true;
                    this.$refs.applyR.ADisabled(true);
                    this.$nextTick(() => {
                        this.$refs.applyR.noneText(flowContext.nodeId);
                    });
                    if (flowContext.nodeId == "sixthNode") {
                        this.escortShow = true;
                    }
                    if (flowContext.nodeId == "EndEvent") {
                        this.escortShow = true;
                    }
                    this.$refs.flowForm.hiddenBtn("save");
                } else {
                    if (routeObj.dataId != undefined) {
                        this.drawData(bizdata);
                    } else {
                        let userData = this.$userInfo;
                        this.dangerMessage.applyName = userData.userName;
                        this.dangerMessage.applyId = userData.userCode;
                        this.dangerMessage.applyUnit = userData.deptName;
                        this.dangerMessage.unitCode = userData.deptCode;
                        this.dangerMessage.applyCode = userData.deptCode;
                        /**当前进入新增时间*/
                        let time = new Date();
                        this.dangerMessage.createTime = time;
                    }
                    /**详情*/
                    if (routeObj.button != undefined) {
                        if (routeObj.button == "look") {
                            this.dangerDisabled = true;
                            this.$refs.applyR.ADisabled(true);
                            this.$refs.applyR.RDisabled(true);
                        } else {
                            this.dangerDisabled = false;
                            this.$refs.applyR.RDisabled(false);
                        }
                    }
                }
            },
            /**流程数据存储*/
            flowBizData() {
                let obj = this.$refs.flowForm.flowInstData.nodeUserSetList.find(item => item.nodeId == "FirstNode");
                if (obj.nodeId == "FirstNode") {
                    obj.assignerId = this.dangerMessage.applyId;
                    obj.assignerName = this.dangerMessage.applyName;
                }
                this.finalNum.ApplyInVo = this.applyForm;
                this.finalNum.ApplyInVo.applyName = this.dangerMessage.applyName;
                this.finalNum.ApplyInVo.applyUnit = this.dangerMessage.applyUnit;
                this.finalNum.ApplyInVo.createTime = this.dangerMessage.createTime;
                this.finalNum.ApplyInVo.applyId = this.dangerMessage.applyId;
                Object.assign(this.finalNum.ApplyInVo, this.realityForm);
                return this.finalNum.ApplyInVo;
            },
            /**流程按钮*/
            flowOperateBtn(flowContext, bizdata) {
                if (flowContext.nodeId == "FirstNode" && flowContext.operateType == "save") {
                    /*保存*/
                    return true
                } else if (flowContext.nodeId == "FirstNode" && flowContext.operateType == "submit") {
                    /*提交*/
                    this.$refs.applyR.isOk();
                    this.$refs.applyR.acsPeople();
                    this.dangerTrue();
                    if (this.$refs.applyR.isOk() == true && this.dangerRe() == true && this.$refs.applyR.acsPeople() == true) {
                        this.finalNum.ApplyInVo = this.applyForm;
                        this.finalNum.ApplyInVo.applyName = this.dangerMessage.applyName;
                        this.finalNum.ApplyInVo.applyUnit = this.dangerMessage.applyUnit;
                        this.finalNum.ApplyInVo.createTime = this.dangerMessage.createTime;
                        return true
                    } else {
                        return false
                    }
                } else if (flowContext.nodeId == "SecondNode" && flowContext.operateType == "submit") {
                    if (bizdata.unit == bizdata.afDepartmentCode || bizdata.isCrucial == 0) {
                        //进入非要害部位或者申请人单位和要害部位责任单位
                        flowContext.processVar = {
                            proposerSort: 2
                        };
                    } else {

                        flowContext.processVar = {
                            proposerSort: 1
                        };
                    }
                    return true
                } else if (flowContext.nodeId == "SecondNode" && flowContext.operateType == "save") {
                    return true
                } else if (flowContext.nodeId == "ThirdNode" && flowContext.operateType == "submit") {
                    return true
                } else if (flowContext.nodeId == "FourthNode" && flowContext.operateType == "submit") {
                    if (bizdata.isCrucial == "1") {
                        flowContext.processVar = {
                            accessLocation: 1
                        }
                    } else {
                        flowContext.processVar = {
                            accessLocation: 2
                        }
                    }
                    return true
                } else if (flowContext.nodeId == "FifthNode" && flowContext.operateType == "submit") {
                    return true
                } else if (flowContext.nodeId == "sixthNode" && flowContext.operateType == "submit") {
                    let arr = [];
                    if (this.flowContent.nodeId == "sixthNode") {
                        if (this.realityForm.saveItem.length != "0") {
                            for (let i = 0; i < this.realityForm.saveItem.length; i++) {
                                arr.push(this.realityForm.saveItem[i].value);
                            }
                            this.realityForm.saveItem = JSON.stringify(arr);
                        }
                    }
                    return this.$refs.realityR.pass();
                }

            },
            drawData(DATA) {
                this.dangerMessage = DATA;
                this.applyForm = DATA;
                this.applyForm.BizCrucialPointEnthetics = DATA.bizCrucialPointEnthetics;
                this.realityForm = DATA;
                if (DATA.saveItem != "" && this.flowContent.nodeId == "EndEvent") {
                    this.realityForm.saveItem = JSON.parse(DATA.saveItem);
                    this.$nextTick(() => {
                        this.$refs.realityR.matterSelect(this.realityForm.saveItem);
                    })
                }
            }
        },
    }
</script>

<style scoped>

</style>