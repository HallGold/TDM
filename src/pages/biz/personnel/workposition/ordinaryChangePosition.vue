<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" :rules="formRules" ref="bizForm" label-width="100px"
                         :disabled="flowScope.formReadonly">
                    <ice-grid-layout :columns="2" name="申请人">
                        <el-form-item label="申请编号" prop="afNo">
                            <el-input v-model="mainData.afNo"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="afDate">
                            <el-input v-model="mainData.afDate"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请人" prop="afUserName">
                            <el-input v-model="mainData.afUserName"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请单位" prop="afOrgName">
                            <el-input v-model="mainData.afOrgName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="用户信息">
                        <el-form-item label="用户姓名" prop="name">
                            <el-input v-model="mainData.name"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择用户"
                                           icon="el-icon-more"
                                           @click="choosePersion"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="工作卡号" prop="cardNo">
                            <el-input v-model="mainData.cardNo">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="telephone">
                            <el-input v-model="mainData.telephone"
                                      :disabled="flowScope.formReadonly">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="用户部门" prop="afUserName">
                            <el-input v-model="mainData.deptName"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择部门"
                                           icon="el-icon-more"
                                           @click="chooseDept"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="原岗位" prop="oldWorkRole">
                            <el-input v-model="mainData.oldWorkRole"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择岗位"
                                           icon="el-icon-more"
                                           @click="chooseWorkPosition(0)"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新岗位" prop="newWorkRole">
                            <el-input v-model="mainData.newWorkRole"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择岗位"
                                           icon="el-icon-more"
                                           @click="chooseWorkPosition(1)"></el-button>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="系统权限列表">
                        <div style="margin-bottom: 2px" v-if="nodeId === 'FirstNode'">
                            <el-button type="primary" @click="add">新增</el-button>
                            <el-button type="primary" @click="del" :disabled="tableList.length===0">删除</el-button>
                        </div>
                        <div style="width: 100%">
                            <ice-editable-table :data="tableData" :rules="tableRules" :height="200"
                                                @selection-change="tableSelection">
                                <el-table-column type="selection" width="50px"
                                                 v-if="nodeId==='FirstNode'"></el-table-column>
                                <ice-editable-table-column prop="roleCode"
                                                           label="角色"
                                                           :options="EMP.roleCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="systemCode"
                                                           label="系统名称"
                                                           :options="EMP.sysCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="oldSystemPermission"
                                                           label="原系统权限"
                                                           :options="EMP.sysPermissionArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="newSystemPermission"
                                                           label="变更系统权限"
                                                           :options="EMP.sysPermissionArr"
                                                           :width="null"
                                                           input-type="selectArray"></ice-editable-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <ice-persion-selector
                    chooseItem="single"
                    ref="ips"
                    mode="hidden"
                    @select-confirm="selectUserConfirm">
            </ice-persion-selector>
        </div>
        <div>
            <ice-dept-selector chooseItem="single"
                               ref="ids"
                               mode="hidden"
                               @select-confirm="selectDeptConfirm">
            </ice-dept-selector>
        </div>
        <div>
            <work-position-selector ref="wps" @choosePosition="choosePosition"></work-position-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IcePersionSelector from "../../../../components/common/biz/IcePersionSelector";
    import IceDeptSelector from "../../../../components/common/biz/IceDeptSelector";
    import WorkPositionSelector from "../common/workPositionSelector";
    import empComm from "@/pages/biz/personnel/common/empComm";

    export default {
        name: "ordinaryChangePosition",
        components: {
            IceEditableTable,
            IceEditableTableColumn,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
            IcePersionSelector,
            IceDeptSelector,
            WorkPositionSelector
        },
        mixins:[empComm],
        data() {
            return {
                mainData: {//一般人员换岗表单对象
                    afNo: '',//申请单号
                    afDate: '',//申请时间
                    afUserCode: '',//申请人编码
                    afUserName: '',//申请人姓名
                    afDepartmentCode: '',//申请人部门编码
                    afDepartmentName: '',//申请人部门名字
                    afOrgCode: '',//申请人单位编码
                    afOrgName: '',//申请人单位名称
                    afOrgPhone: '',//申请人电话
                    afReason: '',//申请原因
                    afStatus: '',//流程状态[-1:草稿,1:运行中,2:已完成,3驳回]
                    deptCode: '',//部门名称
                    deptName: '',//部门编码
                    name: '',//一般换岗人员的姓名
                    code: '',//一般换岗人员姓名CODE
                    cardNo: '',//一般换岗人员卡号
                    telephone: '',//一般换岗人员联系电话
                    oldWorkRole: '',//一般换岗人员原岗位
                    newWorkRole: '',//一般换岗人员新岗位
                    details: [],//系统权限列表
                },
                formRules: {//一般人员换岗表单字段规则验证

                },
                tableData: [//一般人员换岗--系统权限列表数据
                    {
                        systemName: '',//系统名称
                        systemNameCode: '',//系统名称code
                        secretLevel: '',//密级
                        oldSystemPermission: '',//原系统权限
                        newSystemPermission: ''//变更系统权限
                    }
                ],
                tableRules: {//一般人员换岗--系统权限列表--列表字段验证

                },
                tableList: [],//表格选中的数据，用于删除
                nodeId: '',//当前环节的节点id
                oldWorkPosition: false,//当前选择的是否为原部门
            }
        },
        methods: {
            /**流程初始化所带的数据*/
            flowReady(flowCont, bizData) {
                this.nodeId = flowCont.nodeId;
                if (flowCont.nodeId === 'FirstNode') {
                    this.mainData.afNo = bizData.afNo;
                    this.mainData.afDate = bizData.afDate;
                    this.mainData.afUserName = bizData.afUserName;
                    this.mainData.afOrgName = bizData.afOrgName;
                } else {
                    Object.assign(this.mainData, bizData);
                    this.tableData = this.mainData.details;
                }
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowCont, bizData) {
                return true;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                this.mainData.details = this.tableData;
                return this.mainData;
            },
            /**
             * 打开选人弹窗
             */
            choosePersion() {
                this.$refs.ips.openDialog();
            },
            /**
             * 选人--选择行所带出的信息
             * @param rows
             */
            selectUserConfirm(rows) {
                this.mainData.name = rows[0].name;
                this.mainData.code = rows[0].code;
            },
            /**
             * 打开选部门弹窗
             */
            chooseDept() {
                this.$refs.ids.openDialog();
            },
            /**
             * 选部门--选择行所带出的信息
             * @param rows
             */
            selectDeptConfirm(rows) {
                this.mainData.deptName = rows[0].deptName;
                this.mainData.deptCode = rows[0].deptCode;
            },
            /**
             * 打开选择岗位弹窗
             */
            chooseWorkPosition(val) {
                if (val == 0) {
                    this.oldWorkPosition = true;
                } else {
                    this.oldWorkPosition = false;
                }
                this.$refs.wps.openDialog();
            },
            /**
             * 选择岗位的数据
             * @param rows
             */
            choosePosition(rows) {
                if (this.oldWorkPosition) {
                    this.mainData.oldWorkRole = rows[0].name;
                } else {
                    this.mainData.newWorkRole = rows[0].name;
                }

            },
            /**
             * 新增
             */
            add() {
                let obj = {
                    systemName: '',
                    systemNameCode: '',
                    secretLevel: '',
                    oldSystemPermission: '',
                    newSystemPermission: ''
                };
                this.tableData.push(obj);
            },
            /**
             * 删除
             */
            del() {
                for (let i = 0; i < this.tableList.length; i++) {
                    this.tableData.splice(this.tableData.indexOf(this.tableList[i]), 1);
                }
            },
            tableSelection(data) {
                this.tableList = data;
            }
        },
        mounted() {
            this.initPermissionList();//初始化角色，系统，权限数组;
        }
    }
</script>

<style scoped>
    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>