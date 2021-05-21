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
                    <ice-grid-layout :columns="2" name="用户">
                        <el-form-item label="用户姓名" prop="name">
                            <el-input v-model="mainData.name"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择用户"
                                           icon="el-icon-more"
                                           @click="choosePersion"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="身份证编号" prop="identityCode">
                            <el-input v-model="mainData.identityCode" readonly placeholder="选择用户后自动带出">
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
                        <el-form-item label="工位位置" prop="workPlace" layout="2">
                            <!--<el-input v-model="mainData.workPlace" maxlength="100"></el-input>-->
                            <el-input v-model="workPlaceA" placeholder="禁用特殊字符"
                                      style="width: 25%" @change="workPlaceRules('a')" maxlength="100">
                                <template slot="prepend">园区</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <div style="position: absolute;color: #F56C6C" v-if="!workPlaceA">请填写园区</div>
                            <el-input v-model="workPlaceB" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('b')" maxlength="20">
                                <template slot="prepend">楼号</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <div style="position: absolute;color: #F56C6C" v-if="!workPlaceB">请填写楼号</div>
                            <el-input v-model="workPlaceC" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('c')" maxlength="20">
                                <template slot="prepend">房间号</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <div style="position: absolute;color: #F56C6C" v-if="!workPlaceC">请填写房间号</div>
                            <el-input v-model="workPlaceD" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('d')" maxlength="50">
                                <template slot="prepend">工位号</template>
                            </el-input>
                            <div style="position: absolute;color: #F56C6C" v-if="!workPlaceD">请填工位号</div>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="业务权限列表">
                        <!--<div style="margin-bottom: 2px" v-if="nodeId==='FirstNode'">
                            <el-button type="primary" @click="add">新增</el-button>
                            <el-button type="primary" @click="del" >删除</el-button>
                        </div>-->
                        <!--<div style="width: 100%">
                            <ice-editable-table :data="tableData" :rules="tableRules" :height="200"
                                                @selection-change="tableSelection" ref="iceTbl">
                                <el-table-column type="selection" width="50px"
                                                 v-if="nodeId==='FirstNode'"></el-table-column>
                                <ice-editable-table-column prop="roleCode"
                                                           label="角色"
                                                           :width="300"
                                                           :options="EMP.roleCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="systemCode"
                                                           label="系统名称"
                                                           :width="260"
                                                           :options="EMP.sysCodeArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                                <ice-editable-table-column prop="newSystemPermission"
                                                           label="权限"
                                                           :width="null"
                                                           :options="EMP.sysPermissionArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                            </ice-editable-table>
                        </div>-->
                        <emp-auth-edit :table-data="tableData" ref="empAuthEdit"></emp-auth-edit>
                    </ice-form-group>
                </el-form>
            </div>
        </ice-flow-form>
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import empComm from "@/pages/biz/personnel/common/empComm";
    import UserSelector from "./common/userSelector";
    import EmpAuthEdit from "./common/empAuthEdit";

    export default {
        name: "joinNet",
        components: {
            EmpAuthEdit,
            UserSelector,
            IceSelect,
            IceEditableTableColumn,
            IceEditableTable,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
        },
        mixins:[empComm],
        data() {
            return {
                mainData: {//人员入网表单对象
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
                    name: '',//入网人员姓名
                    code: '',//人员姓名CODE
                    telephone: '',//联系电话
                    identityCode: '',//身份证编号
                    secretLevel: '',//入网人员密级
                    secretLevelName:'',//入网人员密级名称
                    workKind: '',//用户岗位
                    workPlace: '',//工位位置
                    assignDev: '',//设备配置：1、新设备;2、已有设备
                    details: [],//系统权限列表
                },
                workPlaceA:'',//园区号
                workPlaceB:'',//楼号
                workPlaceC:'',//房间号
                workPlaceD:'',//工位号
                formRules: {//人员入网表单字段规则验证
                    name:[{required: true, message: "请选择用户", trigger: 'change'}],
                    workPlace:[{required:true,message: "工位位置请填写完整",trigger:'blur'}],
                },
                tableData: [//人员入网--系统权限列表数据
                    {
                        systemName: '',//系统名称
                        systemCode: '',//系统名称code
                        roleName:'',//角色
                        roleCode:'',//角色Code
                        newSystemPermission: '',//用户系统权限
                    }
                ],
                tableRules: {//人员入网--系统权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    newSystemPermission: {required: true, message: "请选择权限", trigger: 'change'},
                },
                tableList: [],//表格选中的数据，用于删除
                nodeId: '',//流程当前的节点Id
                oldArr:[],
            }
        },
        watch:{
            workPlaceD(){
                this.getWorkPlace();
            },
            workPlaceC(){
                this.getWorkPlace();
            },
            workPlaceB(){
                this.getWorkPlace();
            },
            workPlaceA(){
                this.getWorkPlace();
            }
        },
        methods: {
            /**流程初始化所带的数据*/
            flowReady(flowCont, bizData) {
                this.nodeId = flowCont.nodeId;
                Object.assign(this.mainData, bizData);
                this.tableData = this.mainData.details.length>0?this.mainData.details:this.tableData;
                let arr = this.mainData.workPlace.split(',');
                if(arr.length>0){
                    this.workPlaceA = arr[0];
                    this.workPlaceB = arr[1];
                    this.workPlaceC = arr[2];
                    this.workPlaceD = arr[3];
                }
                this.mainData.secretLevelName = this.$refs.us.getUserLevelName(this.mainData.secretLevel);
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowCont, bizData) {
                let isTrue = true;
                let tabIsTrue = true;
                this.$refs.bizForm.validate((valid) => {
                    isTrue = valid;
                });
                this.$refs.iceTbl.validateAll((valid) => {
                    tabIsTrue = valid;
                });
                if(this.tableData.length===0){
                    this.$message.warning("权限列表至少需要添加一条");
                    return false;
                }
                if (!(this.listDistinct(this.tableData))) {
                    this.$message.warning("权限列表不可两条数据完全相同")
                    return false;
                }
                return isTrue && tabIsTrue;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                this.getName(this.tableData);
                this.mainData.details = this.tableData;
                return this.mainData;
            },
            getWorkPlace() {
                if (this.workPlaceA && this.workPlaceB && this.workPlaceC && this.workPlaceD) {
                    this.mainData.workPlace = this.workPlaceA + ',' + this.workPlaceB + ',' + this.workPlaceC + ',' + this.workPlaceD
                } else {
                    this.mainData.workPlace = '';
                }
            },
            workPlaceRules(val){
                if(val == 'a'){
                    this.workPlaceA = this.workPlaceA.replace(this.EMP.reg,'');
                }else if(val == 'b'){
                    this.workPlaceB = this.workPlaceB.replace(this.EMP.reg,'');
                }else if(val == 'c'){
                    this.workPlaceC = this.workPlaceC.replace(this.EMP.reg,'');
                }else if(val == 'd'){
                    this.workPlaceD = this.workPlaceD.replace(this.EMP.reg,'');
                }
            },
            /**
             * 打开选人弹窗
             */
            choosePersion() {
                this.$refs.us.openDialog();
            },
            /**
             * 新增
             */
            add() {
                this.$refs.empAuthEdit.addItem();
                /*let obj = {
                    systemName: '',
                    systemCode: '',
                    roleName:'',
                    roleCode:'',
                    newSystemPermission: '',
                };
                this.tableData.push(obj);
                this.$nextTick(() => {
                    this.$refs.iceTbl.clearValidate();
                })*/
            },
            /**
             * 删除
             */
            del() {
                this.$refs.empAuthEdit.delItem();
                /*for (let i = 0; i < this.tableList.length; i++) {
                    this.tableData.splice(this.tableData.indexOf(this.tableList[i]), 1);
                }*/
            },
            tableSelection(data) {
                this.tableList = data;
            },
            /**
             * 选用户--选择行所带出的信息
             * @param data
             */
            getUserData(data) {
                this.mainData.name = data[0].name;
                this.mainData.code = data[0].code;
                this.mainData.identityCode = data[0].idCard;
                this.mainData.deptName = data[0].deptShortName;
                this.mainData.orgName = data[0].orgShortName;
                this.mainData.deptCode = data[0].deptCode;
                this.mainData.secretLevel = data[0].securityLevel;
                this.mainData.secretLevelName = this.$refs.us.getUserLevelName(data[0].securityLevel);
                this.$axios.get("/biz/bizEmpFinalAuth/applyAuth",{params:{userCode:this.mainData.code}}).then(res=>{
                    this.delList(this.tableData, this.oldArr);
                    if(res.data.length>0){
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
                }).catch(e=>{
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