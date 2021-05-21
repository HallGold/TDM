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
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择用户"
                                           icon="el-icon-more"
                                           @click="choosePersion"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请单位" prop="afOrgName">
                            <el-input v-model="mainData.afOrgName" :disabled="true">
                            </el-input>
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
                        <el-form-item label="工作单位" prop="orgName">
                            <el-input v-model="mainData.orgName" readonly placeholder="选择用户后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="telephone">
                            <el-input v-model="mainData.telephone" maxlength="20"></el-input>
                        </el-form-item>
                        <el-form-item label="变更类型" prop="changeList">
                            <el-checkbox-group v-model="mainData.changeList" :min="1">
                                <el-checkbox label="1">网络</el-checkbox>
                                <el-checkbox label="2">业务权限</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="访问开通" v-if="mainData.changeList.indexOf('1')!==-1">
                        <el-form-item label="系统名称" prop="netSystemName">
                            <el-input v-model="mainData.netSystemName" readonly>
                                <el-button slot="append"
                                           title="点我选择"
                                           icon="el-icon-more"
                                           @click="chooseSysName"></el-button>
                            </el-input>
                            <dev-select ref="devSelect"
                                        v-if="devSelectShow"
                                        :columns="columnsDev"
                                        width="1050px"
                                        :on-close-handler="selectOverHandler"></dev-select>
                        </el-form-item>
                        <el-form-item label="系统级别" prop="originName">
                            <el-input v-model="mainData.originName" readonly placeholder="选择系统名称后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="系统密级" prop="levelName">
                            <el-input v-model="mainData.levelName" readonly placeholder="选择系统名称后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="联网区域" prop="netSystemArea">
                            <el-input v-model="mainData.netSystemArea" readonly placeholder="选择系统名称后自动带出"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址" prop="masterIp">
                            <el-input v-model="mainData.masterIp"></el-input>
                        </el-form-item>
                        <el-form-item label="开通工位" prop="workPlace">
                            <el-input v-model="mainData.workPlace" maxlength="30"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="系统权限列表" v-if="mainData.changeList.indexOf('2')!==-1">
                        <div style="margin-bottom: 2px" v-if="nodeId === 'FirstNode'">
                            <el-button type="primary" @click="add">新增</el-button>
                            <el-button type="primary" @click="del" :disabled="tableList.length===0">删除</el-button>
                        </div>
                        <!--<div style="width: 100%">
                            <ice-editable-table :data="tableData" :rules="tableRules" :height="200"
                                                @selection-change="tableSelection" ref="iceTbl">
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
                                                           :width="null"
                                                           :options="EMP.sysPermissionArr"
                                                           input-type="selectArray"></ice-editable-table-column>
                            </ice-editable-table>

                        </div>-->
                        <emp-auth-edit></emp-auth-edit>
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
    import UserSelector from "./common/userSelector";
    import DevSelect from "../dev/devSelect";
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import empComm from "@/pages/biz/personnel/common/empComm";
    import {validateIP} from "@/pages/system/comm/Validator.js"
    import EmpAuthEdit from "./common/empAuthEdit";

    export default {
        name: "changeVisitAuthority",
        components: {
            EmpAuthEdit,
            DevSelect,
            UserSelector,
            IceSelect,
            IceEditableTableColumn,
            IceEditableTable,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
        },
        mixins: [bizComm, devComm, renderer, empComm],
        data() {
            return {
                mainData: {//人员访问应用权限变更表单对象
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
                    details: [],
                    changeList: ['1'],
                    visitList: [],
                    name: '',//用户姓名
                    code: '',//用户账号
                    telephone: '',//人员联系电话
                    deptName: '',//用户部门名称
                    deptCode: '',//用户部门Code
                    secretLevelName: '',//用户密级名称
                    secretLevel: '',//用户密级
                    levelName: '',//系统密级名称
                    netSystemName: '',//系统名称
                    netSystemCode: '',//系统编号
                    originName: '',//系统级别名称
                    netSystemLevel: '',//系统级别code
                    netSystemSecretLevel: '',//系统密级
                    netSystemArea: '',//联网区域
                    masterIp: '',//IP地址
                    workPlace: '',//开通工位
                    alterType: '',//变更类型,1为网络访问开通 2为业务权限
                },
                formRules: {//人员访问应用权限变更表单字段规则验证
                    name: [{required: true, message: '请选择用户', trigger: 'change'}],
                    netSystemName: [{required: true, message: '请选择系统', trigger: 'change'}],
                    workPlace: [{required: true, whitespace: true, message: '请输入开通工位', trigger: 'blur'}],
                    masterIp: [
                        {validator: validateIP, trigger: 'blur'},
                        {required: true, message: '请输入IP地址', trigger: 'blur'},
                    ]
                },
                tableData: [//人员访问应用权限变更--系统权限列表数据
                    {
                        systemName: '',//系统名称
                        systemCode: '',//系统编码
                        oldSystemPermission: '',//原系统权限
                        newSystemPermission: '',//变更系统权限
                        roleName: '',//角色
                        roleCode: '',//角色code
                    },
                ],
                tableRules: {//人员访问应用权限变更--系统权限列表--列表字段验证
                    systemCode: {required: true, message: "请选择系统", trigger: 'change'},
                    roleCode: {required: true, message: "请选择角色", trigger: 'change'},
                    oldSystemPermission: {required: true, message: "请选择原系统权限", trigger: 'change'},
                    newSystemPermission: {required: true, message: "请选择变更系统权限", trigger: 'change'},
                },
                tableList: [],//表格选中的数据，用于删除
                nodeId: '',//当前环节的节点id
                columnsDev: [],
                devSelectShow: false,
                oldList: [],//用于--选择用户--删除之前选的用户的原权限列表
            }
        },
        methods: {
            /**流程初始化所带的数据*/
            flowReady(flowCont, bizData) {
                this.nodeId = flowCont.nodeId;
                Object.assign(this.mainData, bizData);
                this.tableData = this.mainData.details;
                this.mainData.changeList = this.mainData.alterType?this.mainData.alterType.split(','):this.mainData.changeList;
                this.mainData.secretLevelName = this.getUserLevelName(this.mainData.secretLevel);
                this.mainData.originName = this.getOriginName(this.mainData.netSystemLevel);
                this.mainData.levelName = this.getLevelName(this.mainData.netSystemSecretLevel);
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowCont, bizData) {
                let isTrue = true;
                let tabIsTrue = true;

                //判断是否为权限列表--是，则需要进行字段校验
                if (this.mainData.changeList.indexOf('2') > -1) {
                    this.$refs.iceTbl.validateAll((valid) => {
                        tabIsTrue = valid;
                    });
                }

                //当变更类型为-业务权限-时-----系统权限列表最少增加一条
                if (this.mainData.changeList.indexOf('2') > -1 && this.tableData.length === 0) {
                    this.$message.warning("系统权限列表不可为空");
                    return false
                }

                if (!(this.listDistinct(this.tableData))) {
                    this.$message.warning("系统权限列表不可两条数据完全相同")
                    return false;
                }
                this.$refs.bizForm.validate((valid) => {
                    isTrue = valid;
                });

                return isTrue && tabIsTrue;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                if (this.nodeId === 'FirstNode') {
                    this.tableData.forEach(item => {
                        item.systemName = this.getSystemName(item.systemCode);
                        item.roleName = this.getRoleName(item.roleCode);
                    });
                }
                this.getName(this.tableData);
                this.mainData.details = this.tableData;
                this.mainData.alterType = this.mainData.changeList.join(',');
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
             * 新增
             */
            add() {
                let obj = {
                    systemName: '',
                    systemCode: '',
                    oldSystemPermission: '',
                    newSystemPermission: '',
                    roleName: '',
                    roleCode: '',
                };
                this.tableData.push(obj);
                this.$nextTick(() => {
                    this.$refs.iceTbl.clearValidate();
                });
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
                    this.delList(this.tableData, this.oldList);
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
                        this.oldList = arr;
                        this.tableData.push(...arr);
                    }
                }).catch(e => {
                    this.$message.error(e.msg);
                })

            },
            /**
             * 获取系统密级名称
             * @param code
             * @returns {*}
             */
            getLevelName(code) {
                for (let i = 0; i < this.ENUMS.DATA_SECRET_LEVEL_DATA.length; i++) {
                    if (Number(this.ENUMS.DATA_SECRET_LEVEL_DATA[i].code) == code) {
                        return this.ENUMS.DATA_SECRET_LEVEL_DATA[i].name;
                    }
                }
                return '';
            },
            /**
             * 获取系统级别名称
             * @param code
             * @returns {*}
             */
            getOriginName(code) {
                for (let i = 0; i < this.ENUMS.SYSTEM_LEVEL_DATA.length; i++) {
                    if (Number(this.ENUMS.SYSTEM_LEVEL_DATA[i].code) == code) {
                        return this.ENUMS.SYSTEM_LEVEL_DATA[i].name;
                    }
                }
                return '';
            },

            /**
             * 获取用户密级名称
             * @param code
             * @returns {*}
             */
            getUserLevelName(code) {
                for (let i = 0; i < this.ENUMS.USER_SECRET_LEVEL_DATA.length; i++) {
                    if (Number(this.ENUMS.USER_SECRET_LEVEL_DATA[i].code) == code) {
                        return this.ENUMS.USER_SECRET_LEVEL_DATA[i].name;
                    }
                }
                return '';
            },
            /**
             * 选择系统
             */
            chooseSysName() {
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            selectOverHandler(data) {
                return new Promise((resolve, reject) => {
                    if (data.length !== 0) {
                        this.mainData.netSystemName = data[0].name;
                        this.mainData.netSystemCode = data[0].code;
                        this.mainData.originName = this.getOriginName(data[0].origin);
                        this.mainData.netSystemLevel = data[0].origin;
                        this.mainData.levelName = this.getLevelName(data[0].secretLevel);
                        this.mainData.netSystemSecretLevel = data[0].secretLevel;
                        this.mainData.netSystemArea = this.onNetAndTypeRenderer(data[0].netArea, data[0].netType, data[0].useFor);
                    }
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                })
            },
            initColumnsDev() {
                let _this = this;
                this.columnsDev = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {code: 'code', hidden: true},
                    {code: 'netArea', hidden: true},
                    {code: 'netType', hidden: true},
                    {code: 'useFor', hidden: true},
                    {
                        label: '系统名称', code: 'name', width: 150
                    },
                    {
                        label: '系统密级', code: 'secretLevel', width: 150, formatter: row => {
                            return _this.getLevelName(row.secretLevel)
                        }
                    },
                    {
                        label: '系统级别', code: 'origin', width: 150, formatter: row => {
                            return _this.getOriginName(row.origin);
                        }
                    },
                    {
                        label: '联网区域', code: 'netAreaAndType', width: 80, ignore: true, formatter: row => {
                            return _this.onNetAndTypeRenderer(row.netArea, row.netType, row.useFor);
                        }
                    },
                ]
            }
        },
        mounted() {
            let prepareTaskChain = [
                this.requestNetAreaTypeData(),
                this.initPermissionList(),
                this.assembleEnumByDataDictionary(
                    this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.SYSTEM_LEVEL.CODE,
                    this.ENUMS.DATA_DICTIONARY.USER_SECRET_LEVEL.CODE
                )
            ];
            Promise.all(prepareTaskChain).then(this.initColumnsDev);
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