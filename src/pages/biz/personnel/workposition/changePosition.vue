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
                    <ice-grid-layout :columns="2" name="用户信息">
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
                            <el-input v-model="mainData.cardNo" readonly placeholder="选择用户后自动带出">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="用户部门" prop="deptName">
                            <el-input v-model="mainData.deptName" readonly placeholder="选择用户后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="用户密级" prop="secretLevelName">
                            <el-input v-model="mainData.secretLevelName" readonly placeholder="选择用户后自动带出">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="telephone">
                            <el-input v-model="mainData.telephone" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="是否兼任" prop="assumeMultiWork">
                            <el-checkbox v-model="mainData.assumeMultiWork" true-label="1" false-label="2">
                                {{mainData.assumeMultiWork=='1'?'是':'否'}}
                            </el-checkbox>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="角色权限列表">
                        <div style="margin-bottom: 2px" v-if="nodeId==='FirstNode'">
                            <el-button type="primary" @click="add">新增</el-button>
                            <el-button type="primary" @click="del" :disabled="oldList.length===0">删除</el-button>
                        </div>
                        <emp-auth-edit></emp-auth-edit>
                        <!--<div style="width: 100%">
                            <ice-editable-table :data="oldTableData"
                                                :rules="oldTableRules"
                                                :height="200"
                                                @selection-change="oldTableSelection" ref="oldTbl">
                                <el-table-column type="selection" width="50px"
                                                 v-if="nodeId==='FirstNode'"></el-table-column>
                                <ice-editable-table-column prop="roleCode"
                                                           label="角色"
                                                           style="width: 100%"
                                                           :options="EMP.roleCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="systemCode"
                                                           label="系统名称"
                                                           style="width: 100%"
                                                           :options="EMP.sysCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="oldSystemPermission"
                                                           label="权限"
                                                           :width="null"
                                                           :options="EMP.sysPermissionArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                            </ice-editable-table>
                        </div>-->
                    </ice-form-group>
                    <!--<ice-form-group name="新角色权限列表">
                        <div style="margin-bottom: 2px" v-if="nodeId==='FirstNode'">
                            <el-button type="primary" @click="newAdd">新增</el-button>
                            <el-button type="primary" @click="newDel" :disabled="newList.length===0">删除</el-button>
                        </div>
                        <div style="width: 100%">
                            <ice-editable-table :data="newTableData"
                                                :rules="newTableRules"
                                                :height="200"
                                                @selection-change="newTableSelection" ref="newTbl">
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
                                <ice-editable-table-column prop="newSystemPermission"
                                                           label="权限"
                                                           :options="EMP.sysPermissionArr"
                                                           :width="null"
                                                           input-type="selectArray"></ice-editable-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>-->
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import empComm from "@/pages/biz/personnel/common/empComm";
    import UserSelector from "../common/userSelector";
    import EmpAuthEdit from "../common/empAuthEdit";

    export default {
        name: "relieveGuard",
        components: {
            EmpAuthEdit,
            UserSelector,
            IceEditableTable,
            IceEditableTableColumn,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm
        },
        mixins: [empComm],
        data() {
            return {
                mainData: {//三员换岗表单对象
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
                    deptName: '',//部门名称
                    deptCode: '',//部门编码
                    name: '',//换岗三员的姓名
                    code: '',//换岗三员的姓名CODE
                    cardNo: '',//换岗三员的卡号
                    secretLevelName: '',//换岗三员密级名称
                    secretLevel: '',//换岗三员的密级
                    telephone: '',//换岗三员的联系电话
                    details: [],//系统权限列表
                    assumeMultiWork: '',//是否兼任 1-为是,2-为否

                },
                formRules: {//三员换岗表单字段规则验证
                    name:[{required: true, message: "请选择用户", trigger: 'change'}],
                },
                oldTableData: [],//三员换岗--原角色权限列表
                newTableData: [//三员换岗--新角色权限列表
                    {
                        systemName: '',//系统名称
                        systemCode: '',//系统名称code
                        roleName: '',//角色
                        roleCode: '',//角色code
                        newSystemPermission: '',//变更系统权限
                    }
                ],
                oldTableRules: {//三员换岗--原角色权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    oldSystemPermission: {required: true, message: "请选择权限", trigger: 'change'},
                },
                newTableRules: {//三员换岗--新角色权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    newSystemPermission: {required: true, message: "请选择权限", trigger: 'change'},
                },
                nodeId: '',//当前环节的节点id
                oldList: [],
                newList: [],
                oldArr: [],//用于--选择用户--删除之前选的用户的原权限列表
            }
        },
        methods: {
            /**流程初始化所带的数据*/
            flowReady(flowCont, bizData) {
                this.nodeId = flowCont.nodeId;
                Object.assign(this.mainData, bizData);
                this.mainData.secretLevelName = this.$refs.us.getUserLevelName(this.mainData.secretLevel);
                if(this.mainData.details.length>0){
                    this.newTableData = [];
                    this.oldTableData = [];
                }
                this.mainData.details.forEach(item => {
                    if (item.newSystemPermission) {
                        this.newTableData.push(item);
                    } else {
                        this.oldTableData.push(item);
                    }
                })
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowCont, bizData) {
                let tabIsTrue = true;
                let isTrue = true;
                this.$refs.oldTbl.validateAll((valid) => {
                    tabIsTrue = valid;
                });
                this.$refs.newTbl.validateAll((valid) => {
                    tabIsTrue = valid;
                });
                if(this.newTableData.length===0){
                    this.$message.warning("新角色权限列表至少需要添加一条");
                    return false;
                }
                if (!(this.listDistinct(this.oldTableData))) {
                    this.$message.warning("原角色权限列表不可两条数据完全相同")
                    return false;
                }
                if (!(this.listDistinct(this.newTableData))) {
                    this.$message.warning("新角色权限列表不可两条数据完全相同")
                    return false;
                }
                this.$refs.bizForm.validate((valid) => {
                    isTrue = valid;
                });
                return isTrue && tabIsTrue;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                let arr = [];
                this.getName(this.oldTableData);
                this.getName(this.newTableData);
                arr.push(...this.oldTableData);
                arr.push(...this.newTableData);
                this.mainData.details = arr;
                return this.mainData;
            },
            /**
             * 打开选人弹窗
             */
            choosePersion() {
                this.$refs.us.openDialog();
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
             * 原角色权限列表---新增
             */
            add() {
                let obj = {
                    roleName: '',
                    roleCode: '',
                    systemName: '',
                    systemNameCode: '',
                    oldSystemPermission: '',
                };
                this.oldTableData.push(obj);
                this.$nextTick(() => {
                    this.$refs.oldTbl.clearValidate();
                })
            },
            /**
             *原角色权限列表--删除
             */
            del() {
                this.delList(this.oldTableData, this.oldList);
            },
            /**
             *新角色权限列表--删除
             */
            newAdd() {
                let obj = {
                    roleName: '',
                    roleCode: '',
                    systemName: '',
                    systemNameCode: '',
                    newSystemPermission: '',
                };
                this.newTableData.push(obj);
                this.$nextTick(() => {
                    this.$refs.newTbl.clearValidate();
                })
            },
            /**
             *新角色权限列表--删除
             */
            newDel() {
                this.delList(this.newTableData, this.newList);
            },
            oldTableSelection(data) {
                this.oldList = data;
            },
            newTableSelection(data) {
                this.newList = data;
            },
            /**
             * 选用户--选择行所带出的信息
             * @param data
             */
            getUserData(data) {
                this.mainData.name = data[0].name;
                this.mainData.code = data[0].code;
                this.mainData.cardNo = data[0].workCard;
                this.mainData.deptName = data[0].deptShortName;
                this.mainData.orgName = data[0].orgShortName;
                this.mainData.deptCode = data[0].deptCode;
                this.mainData.secretLevel = data[0].securityLevel;
                this.mainData.secretLevelName = this.$refs.us.getUserLevelName(data[0].securityLevel);
                this.$axios.get("/biz/bizEmpFinalAuth/applyAuth", {params: {userCode: this.mainData.code}}).then(res => {
                    this.delList(this.tableData, this.oldArr);
                    if (res.data.length > 0) {
                        let arr = [];
                        res.data.forEach(item=>{
                            arr.push({
                                systemName: item.systemName,
                                systemCode: item.systemCode,
                                roleName:item.roleName,
                                roleCode:item.roleCode,
                                newSystemPermission: item.oldSystemPermission,
                            });
                        });
                        this.oldArr = arr;
                        this.tableData.push(...arr);
                    }
                }).catch(e => {
                    this.$message.error(e.msg);
                })
            },
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