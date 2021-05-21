<template>
    <!-- 服务单分派-->
    <div style="display:flex;flex-direction:column;height:100%;">
        <div style="flex-grow: 1;overflow-y: auto">
            <el-form :model="assign" :disabled="aclKeyReadonly" :rules="formRules" ref="Form">
                <el-row :gutter="10">
                    <el-form-item label="派工时间:" label-width="105px">
                        <el-col :span="8">
                            <el-date-picker type="date" placeholder="可不选，默认当前时间"
                                            v-model="assign.gmtSchedule"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="处理角色:" label-width="105px" prop="engineerRole">
                        <el-col :span="8">
                            <ice-select type="date" placeholder="请选择" @change="showApplyIn"
                                        v-model="assign.engineerRole"
                                        map-type-code="engineerRole">
                            </ice-select>
                        </el-col>
                    </el-form-item>
                </el-row>
                <ice-grid-layout :columns="1" name="进入申请" v-show="isShowApply">
                    <ice-query-grid
                            :columns=columnsAccess
                            :buttons="buttonsAccess"
                            :gridData="assign.applyIns"
                            chooseItem="multiple"
                            @selection-change="selectApplyIn"
                            ref="gridAccess">
                    </ice-query-grid>
                </ice-grid-layout>
                <ice-grid-layout :columns="1" name="工程师">
                    <ice-query-grid
                            data-url=""
                            :columns=columnsPeople
                            :buttons="buttonsPeople"
                            ref="gridPeople"
                            chooseItem="multiple"
                            :gridData="assign.maintainMembers"
                            @selection-change="selectPeople"
                    >
                    </ice-query-grid>
                </ice-grid-layout>
                <ice-grid-layout :columns="1" name="第三方厂商">
                    <ice-query-grid
                            :columns=columnsDepts
                            :buttons="buttonsDept"
                            :gridData="assign.coopUnits"
                            chooseItem="multiple"
                            @selection-change="selectDept"
                            ref="gridDept">
                    </ice-query-grid>
                </ice-grid-layout>
                <!-- 工程师角色选择 -->
                <!--tendCode    工程师线数 0,1,2,3-->
                <!--areaId      区域ID-->
                <ice-pop-selector
                        title="工程师"
                        :columns="columnsPeople"
                        code-prop="usercode"
                        text-prop="username"
                        mode="hidden"
                        :gridData="Num"
                        @select-confirm="getEngineer"
                        choose-item="multiple"
                        ref="memberList">
                </ice-pop-selector>
                <!--第三方厂商-->
                <!--pro/ProBaseCoopUnit/list-->
                <ice-pop-selector
                        title="第三方厂商"
                        data-url="pro/ProBaseCoopUnit/list"
                        :columns=columnsDept
                        mode="hidden"
                        text-prop="unitname"
                        code-prop="oid"
                        @select-confirm="getDept"
                        choose-item="multiple"
                        ref="deptList"
                >
                </ice-pop-selector>
                <!--进入申请-->
                <!--biz/applyIn/list-->
                <ice-pop-selector
                        title="进入申请"
                        data-url="biz/applyIn/list"
                        :columns=columnsApplyIn
                        mode="hidden"
                        text-prop="applyName"
                        code-prop="applyId"
                        @select-confirm="getApply"
                        choose-item="single"
                        ref="applyList"
                >
                </ice-pop-selector>
            </el-form>
        </div>
        <div class="ice-center-button-bar" style="bottom: 0;">
            <el-button type="primary" @click="selectConfirm">保存</el-button>
            <el-button type="info" @click="selectCancel">返回</el-button>
        </div>
    </div>
</template>

<script>
    import IceQueryGrid from '../../../../components/common/base/IceQueryGrid'
    import IceSelect from '../../../../components/common/base/IceSelect'
    import IceGridLayout from '../../../../components/common/base/IceGridLayout.vue'
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import ServeMessage from "../base/serveMessage"
    import BaseMessage from "../base/baseMessage"
    import AccessMessage from "./AccessoryMessage"
    import affiliatedMessage from "../base/affiliatedMessage"
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IcePopSelector from "../../../../components/common/base/IcePopSelector";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import positionComm from "./positionComm.js"

    export default {
        name: "assignAddTo",
        mixins: [positionComm],
        props: {
            areaID: String,
            serviceT: String
        },
        data() {
            return {
                VisiblenewAdd: false,
                assign: {
                    serviceTicket: '',
                    workTicket: '',
                    gmtSchedule: '',
                    engineerRole: '',
                    maintainMembers: [],
                    applyIns: [],
                    coopUnits: [],
                },
                isShowApply: false,
                aclKeyReadonly: false,
                Visible: false,
                dataArr: [],
                delSum: [],
                deptArr: [],
                delDepts: [],
                applyArr: [],
                applyInes: [],
                // popUrl: "",
                nowValue: "",
                Num: [],
                area: "",
                areaId: "",
                coopUnitVos: {},
                techCataMsgData: {},
                /*工程师*/
                columnsPeople: [
                    {code: 'tendId', hidden: true},
                    {code: 'unitCode', hidden: true},
                    {code: 'usercode', hidden: true},
                    {code: 'isCoop', hidden: true},
                    {label: '工程师', code: 'username'},
                    {label: '单位', code: 'unitname'}
                ],
                /*第三方厂商*/
                columnsDept: [
                    {label: '第三方厂商Code', code: 'unitcode', hidden: true},
                    {label: '第三方厂商', code: 'unitname'},
                    {label: '企业性质', code: 'quality', mapTypeCode: "PRO_QUALITY"},
                    // {label: '处理人信息', code: 'contacterInfos'},
                ],
                columnsDepts: [
                    {label: '第三方厂商', code: 'unitname'},
                    {label: '企业法人', code: 'incor'},
                    {label: '电子邮箱', code: 'email'},
                    {label: '处理人信息', code: 'contacterInfos'},
                ],
                /*申请进入*/
                columnsAccess: [
                    {label: '申请编号', code: 'applyNum'},
                    {label: '申请人', code: 'applyName'},
                    {label: '申请人ID', code: 'applyId', hidden: true},
                    {label: '所在单位', code: 'applyUnit'},
                    {label: '申请进入时间', code: 'createTime'},
                    {label: '陪同人', code: 'escort'},
                    {label: '申请进入部位', code: 'inLocation'},
                    // {label: '状态', code: 'state'},
                ],
                columnsApplyIn: [],
                /*工程师button*/
                buttonsPeople: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: '', code: '', callback: this.addPeople
                    },
                    {
                        name: '删除', icon: 'el-icon-close', type: '', code: '', callback: this.delPeople
                    },
                ],
                /*第三方厂商button*/
                buttonsDept: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: '', code: '', callback: this.addDept
                    },
                    {
                        name: '删除', icon: 'el-icon-close', type: '', code: '', callback: this.delDept
                    },
                ],
                /*进入申请button*/
                buttonsAccess: [
                    {
                        name: '添加', icon: 'el-icon-plus', type: '', code: '', callback: this.addAccess
                    },
                    {
                        name: '删除', icon: 'el-icon-close', type: '', code: '', callback: this.delAccess
                    },
                ],
                formRules: {
                    "engineerRole": [{required: true, message: '请选择工程师线路', trigger: 'blur'}]
                }
            }
        },
        methods: {
            /**初始化*/
            initColumns() {
                let _this = this;
                this.columnsApplyIn = [
                    {label: '申请编号', code: 'applyNum',},
                    {label: '申请人', code: 'applyName',},
                    {label: '申请人ID', code: 'applyId', hidden: true},
                    {label: '所在单位', code: 'applyUnit',},
                    {label: '部位名称', code: 'name',},
                    {
                        label: '部位类型', code: 'type', formatter: row => {
                            if (row.type == null) {

                            } else {
                                return _this.onTypeRenderer(row.type);
                            }
                        }
                    },
                    // {label: '是否要害部位', code: '',},
                    {label: '申请进入时间', code: 'createTime',},
                    {label: '陪同人', code: 'escort',},
                    {
                        label: '是否进入', code: 'isInto', renderCell(h, data) {
                            if (data.row.type == "1") {
                                return "是"
                            } else {
                                return "否"
                            }
                        }
                    },
                    {label: '实际进入时间', code: 'actualIntoDate',},
                    {label: '实际离开时间', code: 'actualOutDate',},
                    {label: '申请进入部位', code: 'inLocation', hidden: true},
                    // {label: '关联单号', code: '',},
                    // {label: '关联单号状态', code: '',},
                    // {label: '状态', code: 'state',},
                ]
            },
            /**
             * 校验
             * */
            perfect() {
                let flag = false;
                this.$refs.Form.validate((valid) => {
                    if (valid) {
                        flag = true;
                        return true
                    } else {
                        return false
                    }
                });
                return flag;
            },
            /**
             * 添加工程师角色
             * */
            addPeople() {
                if (this.assign.engineerRole == "" || this.assign.engineerRole == "请选择" || this.assign.engineerRole == null) {
                    this.$confirm('请先选择工程师线数！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$axios.get('pro/ProBaseMaintainGroup/getId', {
                        params: {
                            areaId: this.areaId,
                            tendCode: this.nowValue
                        }
                    }).then(result => {
                        this.$axios.get('pro/ProBaseMaintainMember/getId', {params: {tendId: result.data[0].oid}}).then(result => {
                            this.Num = result.data;
                            this.$refs.memberList.openDialog();
                        })
                    });
                }
            },
            /**
             * 删除工程师角色
             * */
            delPeople() {
                if (this.dataArr.length == "0") {
                    this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.delSum.length; i++) {
                            for (let j = 0; j < this.dataArr.length; j++) {
                                if (this.delSum[i].oid === this.dataArr[j].oid) {
                                    this.$message.success("删除成功");
                                    this.assign.maintainMembers.splice(i, 1);
                                    this.$refs.gridPeople.refresh();
                                }
                            }
                        }
                    })
                }
            },
            /**
             * 添加第三方厂商
             * */
            addDept() {
                this.$refs.deptList.openDialog();
            },
            /**
             * 删除第三方厂商
             * */
            delDept() {
                if (this.deptArr.length == "0") {
                    this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.delDepts.length; i++) {
                            for (let j = 0; j < this.deptArr.length; j++) {
                                if (this.delDepts[i].oid === this.deptArr[j].oid) {
                                    this.$message.success("删除成功");
                                    this.assign.coopUnits.splice(i, 1);
                                    this.$refs.gridDept.refresh();
                                }
                            }
                        }
                    })
                }
            },
            /**
             * 添加申请信息
             * */
            addAccess() {
                this.$refs.applyList.openDialog();
            },
            /**
             * 删除申请信息
             * */
            delAccess() {
                if (this.applyArr.length == "0") {
                    this.$confirm('请选择数据进行删除！', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    });
                } else {
                    this.$confirm('确定删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        for (let i = 0; i < this.applyInes.length; i++) {
                            for (let j = 0; j < this.applyArr.length; j++) {
                                if (this.applyInes[i].oid === this.applyArr[j].oid) {
                                    this.$message.success("删除成功");
                                    this.assign.applyIns.splice(i, 1);
                                    this.$refs.gridAccess.refresh();
                                }
                            }
                        }
                    })
                }
            },
            /**
             * 三线工程师附加表格
             * */
            showApplyIn(value) {
                if (value == "3") {
                    this.isShowApply = true;
                } else {
                    this.isShowApply = false;
                }
            },
            /**
             * 获取选中工程师数据并渲染
             * */
            getEngineer(list, texts, values) {
                this.$message.success("添加成功");
                this.assign.maintainMembers = [...list];
                this.delSum = this.assign.maintainMembers;
            },
            /**
             * 获取选中第三方厂商数据
             * */
            getDept(list) {
                this.$message.success("添加成功");
                this.assign.coopUnits = [...list];
                this.delDepts = this.assign.coopUnits;
            },
            /**
             * 获取选中进入申请数据
             * */
            getApply(list) {
                this.$message.success("添加成功");
                this.assign.applyIns = [...list];
                this.applyInes = this.assign.applyIns;
            },
            /**
             * 返回时的点击事件，关闭弹窗
             * */
            selectCancel() {
                this.$emit("cancel", false);
            },
            /**
             * 确定时的点击事件，关闭弹窗并上传数据
             * */
            selectConfirm() {
                if (this.perfect() == true) {
                    let applyArray = [];
                    if (this.assign.maintainMembers.length !== 0) {
                        if (this.applyInes.length != 0) {
                            for (let j = 0; j < this.applyInes.length; j++) {
                                let arr = {
                                    applyTime: this.applyInes[j].createTime,
                                    applyCode: this.applyInes[j].applyNum,
                                    inLocation: this.applyInes[j].inLocation,
                                    applyerName: this.applyInes[j].applyName,
                                    applyerCode: this.applyInes[j].applyId,
                                    factInTime: this.applyInes[j].actualIntoDate,
                                    factOutTime: this.applyInes[j].actualOutDate,
                                };
                                applyArray.push(arr);
                            }
                        }
                        let assign = {
                            serviceTicket: this.serviceT,
                            assignVo:
                                {
                                    engineerRole: this.assign.engineerRole,
                                    serviceTicket: this.serviceT,
                                    maintainMembers: this.assign.maintainMembers,
                                    applyIns: applyArray
                                },
                            coopUnitVos: this.assign.coopUnits
                        };
                        this.$axios.put('/biz/ProEvtServiceTicket/createChildFlow',
                            assign
                        ).then(result => {
                            this.$message.success("追派成功!");
                            this.$emit("cancel", false);
                        }).finally(() => {
                            this.$emit("cancel", true);
                        })
                    } else {
                        this.$confirm('请选择工程师！', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'info'
                        });
                    }
                }
            },
            /**
             * 工程师选中数据
             * */
            selectPeople(row) {
                this.dataArr = row;
            },
            /**
             * 第三方厂商选中数据
             * */
            selectDept(row) {
                this.deptArr = row;
            },
            /**
             * 第三方厂商选中数据
             * */
            selectApplyIn(row) {
                this.applyArr = row;
            },
        },
        mounted() {
            this.initColumns();
            this.$axios.get('/pro/ProBaseArea/tree').then(result => {
                this.area = result.data[0].children;
                for (let i = 0; i < this.area.length; i++) {
                    if (this.area[i].code == this.areaID) {
                        this.areaId = this.area[i].oid;
                    }
                }
            });
        },
        watch: {
            /*  /pro/ProBaseMaintainMember/list  */
            /*tendCode    工程师线数 0,1,2,3
              areaId      区域ID
              */
            "assign.engineerRole": function (nowVal, oldVal) {
                if (nowVal != oldVal) {
                    this.nowValue = nowVal;
                    this.assign.maintainMembers = [];
                }
            },
            deep: true
        },
        components: {
            IceDeptSelector, IcePopSelector, IceDialog,
            IceQueryGrid, IceSelect,
            IceGridLayout, IceEditableTable,
            ServeMessage, BaseMessage, AccessMessage,
            affiliatedMessage
        }
    }
</script>

<style scoped>

</style>