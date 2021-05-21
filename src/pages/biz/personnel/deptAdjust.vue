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
                            <el-input v-model="mainData.name" readonly>
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
                        <el-form-item label="联系电话" prop="telephone">
                            <el-input v-model="mainData.telephone">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="原密级" prop="oldSecretLevelName">
                            <el-input v-model="mainData.oldSecretLevelName" readonly placeholder="选择用户后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="原部门" prop="oldDeptName">
                            <el-input v-model="mainData.oldDeptName" readonly placeholder="选择用户后自动带出">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新部门" prop="newDeptName">
                            <el-input v-model="mainData.newDeptName" readonly>
                                <el-button slot="append"
                                           title="点我选择部门"
                                           icon="el-icon-more"
                                           @click="chooseDept()"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="新密级" prop="newSecretLevel">
                            <el-select v-model="mainData.newSecretLevel" placeholder="请选择">
                                <el-option v-for="(item,index) in ENUMS.USER_SECRET_LEVEL_DATA"
                                           :key=index
                                           :label="item.name"
                                           :value="item.code"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="新工作位置" prop="newWorkPlace" layout="2">
                            <el-input v-model="workPlaceA" placeholder="禁用特殊字符"
                                      style="width: 25%" @change="workPlaceRules('a')" maxlength="100">
                                <template slot="prepend">园区</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <el-input v-model="workPlaceB" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('b')" maxlength="20">
                                <template slot="prepend">楼号</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <el-input v-model="workPlaceC" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('c')" maxlength="20">
                                <template slot="prepend">房间号</template>
                            </el-input>&nbsp;<span>-</span>&nbsp;
                            <el-input v-model="workPlaceD" placeholder="禁用特殊字符"
                                      style="width: 23%" @change="workPlaceRules('d')" maxlength="50">
                                <template slot="prepend">工位号</template>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="带走的设备列表">
                        <div style="margin-bottom: 2px" v-if="nodeId==='FirstNode'">
                            <el-button type="primary" @click="addItem">选择设备</el-button>
                            <el-button type="primary" @click="deleteItem" :disabled="eqTableData.length===0">删除
                            </el-button>
                        </div>
                        <ice-query-grid :gridData="eqTableData"
                                        :columns="columnsDev"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItemDev"
                                        :pagination="false"
                                        @selection-change="devRows"></ice-query-grid>
                    </ice-form-group>
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
            <dev-select ref="devSelect"
                        v-if="devSelectShow"
                        :multiple="true"
                        :columns="columnsDev"
                        width="1000px"
                        :on-close-handler="selectOverHandler"></dev-select>
        </div>
        <div>
            <user-selector ref="us" @getData="getUserData"></user-selector>
        </div>
        <div>
            <ice-dept-selector chooseItem="single"
                               ref="ids"
                               mode="hidden"
                               @select-confirm="selectDeptConfirm">
            </ice-dept-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import DevSelect from "../dev/devSelect";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import empComm from "@/pages/biz/personnel/common/empComm";
    import UserSelector from "./common/userSelector";
    import EmpAuthEdit from "./common/empAuthEdit";

    export default {
        name: "deptAdjust",
        components: {
            EmpAuthEdit,
            UserSelector,
            IceQueryGrid,
            DevSelect,
            IceSelect,
            IceDeptSelector,
            IceEditableTableColumn,
            IceEditableTable,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
        },
        mixins: [bizComm, devComm, renderer,empComm],
        data() {
            return {
                mainData: {//人员部门调整表单对象
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
                    name: '',//人员姓名
                    code: '',//人员姓名CODE
                    cardNo: '',//工作卡号
                    telephone: '',//联系电话
                    oldSecretLevel: '',//原密级
                    oldSecretLevelName:'',//原密级名称
                    newSecretLevel: '',//新密级
                    oldDeptName: '',//原部门名称
                    oldDeptCode: '',//原部门编码
                    newDeptName: '',//新部门名称
                    newDeptCode: '',//新部门编码
                    newWork: '',//新岗位
                    newWorkPlace: '',//新工作位置,
                    devDetails: [],//带走的设备列表
                    permissions: [],//系统权限列表
                },

                formRules: {//人员部门调整表单字段规则验证
                    name:[{required: true, message: "请选择用户", trigger: 'change'}],
                    newSecretLevel:[{required: true, message: "请选择新密级", trigger: 'change'}],
                    newDeptName:[{required: true, message: "请选择新部门", trigger: 'change'}],
                    newWorkPlace:[{required:true,message: "工位位置请填写完整",trigger:'blur'}],
                },
                eqTableData: [],//人员部门调整--带走的设备列表
                eqTableRules: {//人员部门调整--带走的设备列表--列表字段验证

                },
                oldTableData: [//人员部门调整--原角色权限列表
                    {
                        systemName: '',//系统名称
                        systemCode: '',//系统名称code
                        roleName: '',//角色
                        roleCode: '',//角色code
                        oldSystemPermission: '',//原系统权限
                    }
                ],
                newTableData: [//人员部门调整--新角色权限列表
                    {
                        systemName: '',//系统名称
                        systemCode: '',//系统名称code
                        roleName: '',//角色
                        roleCode: '',//角色code
                        newSystemPermission: '',//变更系统权限
                    }
                ],
                oldTableRules: {//人员部门调整--原角色权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    oldSystemPermission: {required: true, message: "请选择权限", trigger: 'change'},
                },
                newTableRules: {//人员部门调整--新角色权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    newSystemPermission: {required: true, message: "请选择权限", trigger: 'change'},
                },
                oldDept: false,//是否是选择原部门，为false则表示选择新部门
                tableList: [],//表格选中的数据，用于删除
                columnsDev: [],//设备组件展示列
                devSelectShow: false,//选择设备的弹窗开关属性
                devList: [],//选中的设备数据，用于删除
                chooseItemDev: 'multiple',
                nodeId: '',//当前环节的节点id
                oldArr: [],//用于--选择用户--删除之前选的用户的原权限列表
                newList:[],
                oldList:[],
                workPlaceA:'',//园区号
                workPlaceB:'',//楼号
                workPlaceC:'',//房间号
                workPlaceD:'',//工位号

            }
        },
        watch:{
            workPlaceD(){
                this.getWorkPlace();
            }
        },
        methods: {
            /**流程初始化所带的数据*/
            flowReady(flowCont, bizData) {
                this.nodeId = flowCont.nodeId;
                Object.assign(this.mainData, bizData);
                let arr = this.mainData.newWorkPlace.split(',');
                if(arr.length>0){
                    this.workPlaceA = arr[0];
                    this.workPlaceB = arr[1];
                    this.workPlaceC = arr[2];
                    this.workPlaceD = arr[3];
                }
                this.eqTableData = this.mainData.devDetails;
                this.oldTableData = this.mainData.permissions;
                this.mainData.oldSecretLevelName = this.$refs.us.getUserLevelName(this.mainData.oldSecretLevel);
                if(this.mainData.permissions.length>0){
                    this.newTableData = [];
                    this.oldTableData = [];
                }
                this.mainData.permissions.forEach(item => {
                    if (item.newSystemPermission) {
                        this.newTableData.push(item);
                    } else {
                        this.oldTableData.push(item);
                    }
                })
                if (flowCont.nodeId === 'FirstNode') {
                    this.chooseItemDev = 'multiple';
                } else {
                    this.chooseItemDev = 'single';
                }
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
                this.mainData.devDetails = this.eqTableData;
                let arr = [];
                this.getName(this.oldTableData);
                this.getName(this.newTableData);
                arr.push(...this.oldTableData);
                arr.push(...this.newTableData);
                this.mainData.permissions = arr;
                return this.mainData;
            },
            getWorkPlace() {
                if (this.workPlaceA && this.workPlaceB && this.workPlaceC && this.workPlaceD) {
                    this.mainData.newWorkPlace = this.workPlaceA + ',' + this.workPlaceB + ',' + this.workPlaceC + ',' + this.workPlaceD
                } else {
                    this.mainData.newWorkPlace = '';
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
             * 初始化设备组件--table展示列
             */
            initColumns() {
                let _this = this;
                this.columnsDev = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {
                        label: '设备子类', code: 'childType', width: 90, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {label: '设备责任人', code: 'dutyName', width: 200},
                    {
                        label: '设备密级',
                        code: 'secretLevel',
                        width: 100,
                        mapTypeCode: _this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE
                    },
                    {type: 'input', label: '保密编号', code: 'secretSn', width: 200},
                ];
            },
            /**
             *
             * @param data
             * @returns {Promise<any>}
             */
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    for (let i = 0; i < data.length; i++) {
                        if (this.findSameRowByCode(this.eqTableData, data[i].oid, 'oid') == -1) {
                            this.eqTableData.push(data[i]);
                        }
                    }
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                })
            },
            /**
             * 带走的设备--新增
             */
            addItem() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 带走的设备--删除
             */
            deleteItem() {
                this.deletes(this.eqTableData, this.devList);
            },
            /**
             * 带走的设备--列表多选框返回所选择的行信息
             */
            devRows(rows) {
                this.devList = rows;
            },
            /**
             * 打开选人弹窗
             */
            choosePersion() {
                this.$refs.us.openDialog();
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
                this.mainData.oldDeptName = data[0].deptShortName;
                this.mainData.orgName = data[0].orgShortName;
                this.mainData.oldDeptCode = data[0].deptCode;
                this.mainData.oldSecretLevel = data[0].securityLevel;
                this.mainData.oldSecretLevelName = this.$refs.us.getUserLevelName(data[0].securityLevel);
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
                                oldSystemPermission: item.oldSystemPermission,
                            });
                        });
                        this.oldArr = arr;
                        this.oldTableData.push(...arr);
                    }
                }).catch(e => {
                    this.$message.error(e.msg);
                })
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
                this.mainData.newDeptName = rows[0].deptName;
                this.mainData.newDeptCode = rows[0].deptCode;
            },
        },
        mounted() {
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USER_SECRET_LEVEL.CODE);
            this.requestCategoryData();
            this.initPermissionList();
            this.initColumns();
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