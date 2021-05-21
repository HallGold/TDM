<template>
    <div class="content-filled">
        <ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true"
                       label-prop="deptName"
                       value-prop="oid"
                       :lazy="false"
                       parent-prop="deptId"
                       data-url="/permission/user/users_by_condition"
                       :columns="columns"
                       :query="query"
                       :operations="operations"
                       :buttons="buttons"
                       ref="iceGrid"
                       @node-click="dataTree"
                       :operations-width="operationWidth">
        </ice-tree-grid>
        <!--账号详情-->
        <el-dialog :title="title" custom-class="ice-dialog" v-dialogDrag center :visible.sync="dialogVisible"
                   width="900px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <el-tabs v-model="activeName">
                <el-tab-pane label="账号详细" name="first">
                    <div style="height: 450px">
                        <div style="max-height: 450px;overflow-x: hidden">
                            <el-form :model="mainDataForm" label-position="right"
                                     class="conditon-bar"
                                     ref="form"
                                     style="margin-top: 20px">
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="账号" label-width="100px" prop="code">
                                            <el-input placeholder="账号" v-model="mainDataForm.code" maxlength="30"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="用户图像" label-width="100px" prop="headPortraitUrl">
                                            <img :src="$showImage(mainDataForm.headPortraitUrl)"></img>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="是否兼职" label-width="100px" prop="partTimeWorker">
                                            <el-select placeholder="是否兼职" v-model="mainDataForm.partTimeWorker"
                                                       :disabled="true">
                                                <el-option label="是" value="1"></el-option>
                                                <el-option label="否" value="0"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="排序" label-width="100px" prop="sequencing">
                                            <el-input placeholder="只能输入1至7位数字哦" v-model="mainDataForm.sequencing"
                                                      maxlength="7" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="主账号" label-width="100px" prop="mainUserCode">
                                            <el-input placeholder="主账号" v-model="mainDataForm.mainUserCode"
                                                      :disabled="true"
                                                      maxlength="64"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="是否启用" label-width="100px" prop="enabled">
                                            <el-select placeholder="是否启用" v-model="mainDataForm.enabled"
                                                       :disabled="true">
                                                <el-option label="是" value="1"></el-option>
                                                <el-option label="否" value="0"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="姓名:" label-width="100px" prop="name">
                                            <el-input placeholder="姓名" v-model="mainDataForm.name" :disabled="true"
                                                      maxlength="20"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="性别:" label-width="100px" prop="sex">
                                            <el-select placeholder="性别" v-model="mainDataForm.sex" :disabled="true">
                                                <el-option label="男" value="1"></el-option>
                                                <el-option label="女" value="0"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="用户密级:" label-width="100px" prop="securityLevel">
                                            <ice-select v-model="mainDataForm.securityLevel"
                                                        @change="$nextTick(()=>{$refs.form.validateField('securityLevel',error=>{})})"
                                                        map-type-code="OR_SECRET_LEVEL" :disabled="true"></ice-select>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="生日:" label-width="100px" prop="birthDay">
                                            <el-date-picker
                                                    format="yyyy-MM-dd:HH:ss"
                                                    v-model="mainDataForm.birthDay"
                                                    type="date"
                                                    :disabled="true"
                                                    placeholder="选择日期">
                                            </el-date-picker>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="手机电话:" label-width="100px" prop="handphoneTel">
                                            <el-input placeholder="手机电话" v-model="mainDataForm.handphoneTel"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="固定电话:" label-width="100px" prop="landlineTel">
                                            <el-input placeholder="固定电话" v-model="mainDataForm.landlineTel"
                                                      maxlength="30" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="EMAIL:" label-width="100px" prop="email">
                                            <el-input placeholder="EMAIL" v-model="mainDataForm.email"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>

                                <el-row :gutter="60">
                                    <el-col :span="24">
                                        <el-form-item label="工作地址:" label-width="100px" prop="jobAddress">
                                            <el-input placeholder="工作地址" type="textarea" :rows="4"
                                                      v-model="mainDataForm.jobAddress" maxlength="100"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="24">
                                        <el-form-item label="家庭地址:" label-width="100px" prop="homeAddress">
                                            <el-input placeholder="家庭地址" type="textarea" :rows="4"
                                                      v-model="mainDataForm.homeAddress" maxlength="100"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="身份证号:" label-width="100px" prop="idCard">
                                            <el-input placeholder="身份证号" v-model="mainDataForm.idCard"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="员工编号:" label-width="100px" prop="sn">
                                            <el-input placeholder="员工编号" v-model="mainDataForm.sn"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row :gutter="60">
                                    <el-col :span="12">
                                        <el-form-item label="工作卡号:" label-width="100px" prop="workingIdCard">
                                            <el-input placeholder="工作卡号" v-model="mainDataForm.workingIdCard"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="所在部门:" label-width="100px" prop="deptName">
                                            <el-input placeholder="所在部门" v-model="mainDataForm.deptName"
                                                      :disabled="true" maxlength="32"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-form>
                        </div>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="账号信息" v-if="isShow">
                    <div style="height: 450px">
                        <div style="max-height: 450px;overflow-x: hidden">
                            <ice-query-grid
                                    data-url="/permission/user/get_by_sn"
                                    :columns="columnsQ"
                                    :pagination="false"
                                    ref="grid"
                                    :query="queryQ">
                            </ice-query-grid>
                        </div>
                    </div>

                </el-tab-pane>
            </el-tabs>
            <div class="ice-button-bar">
                <el-button type="info" unauth @click="closeDialog">返回</el-button>
            </div>
        </el-dialog>

        <!---->
        <ice-dialog title="查看用户已授权角色"
                    :visible.sync="userRolesDialogVisible"
                    width="800px" remounted>
            <div style="height: 400px">
                <div style="height: 100%; hoverflow-x: hidden; display: flex">
                    <ice-query-grid
                            data-url="/permission/user/get_auth_roles"
                            :columns="columnsUserRoles"
                            :query="queryAuthRoles"
                            :pagination="false"
                            ref="userRolesGrid">
                    </ice-query-grid>
                </div>
            </div>
        </ice-dialog>
        <ice-dialog title="角色授权"
                    :visible.sync="authRolesDialogVisible"
                    width="800px" remounted>
            <div style="height: 600px">
                <ice-query-grid
                        :gridData="tableData"
                        :columns="columnsAuthRoles"
                        :query="queryAuthRoles"
                        :pagination="false"
                        :selectedCodes="selectedCodes"
                        code-prop="oid"
                        chooseItem="multiple"
                        selectedProp="isAuthed"
                        ref="authRolesGrid">
                </ice-query-grid>
            </div>
            <div class="ice-button-bar">
                <el-button type="primary" unauth @click="saveAuthRoleInfos">保存</el-button>
                <el-button type="info" unauth @click="closeAuthRoleDialog">返回</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import OrgTree from "@/pages/system/organization/OrgTree";
    import UserEdit from "./UserEdit";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import ResetPwd from "./ResetPwd";
    import IceImageUploader from "../../../components/common/base/IceImageUpload";
    import {validatePhone, validateTelphone} from "../../../pages/system/comm/Validator.js"
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDialog from "../../../components/common/base/IceDialog";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";

    export default {
        name: "UserManage",
        /* mixins: [OrgComm],*/
        /*inject:['reload'],*/

        data() {
            return {
                selectedCodes: [],
                query: [
                    {type: 'static', code: "loadDisabled", exp: "=", value: true},
                    {type: 'static', code: "cascade", exp: "=", value: true},
                    {type: 'static', code: "enabled", exp: "=", value: 2},
                    {type: 'input', code: "name", label: '姓名'},
                    {type: 'input', code: "code", label: '账号'},
                ],
                queryQ: [
                    {
                        type: 'static', code: "sn", exp: "=", value: () => {
                            return this.mainDataForm.sn
                        }
                    },
                ],
                roleloading: false,
                tableData: [],
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'sn', hidden: true},
                    {label: '账号', code: 'code', width: 160},
                    {label: '姓名', code: 'name', width: 120},
                    {label: '单位', code: 'orgShortName', width: 180},
                    {label: '部门', code: 'deptShortName', width: 160},
                    {label: '部门编码', code: 'deptCode', hidden: true},
                    {
                        label: '是否兼职', code: 'partTimeWorker', width: 80, renderCell(h, data) {
                            return (data.row.partTimeWorker == 1 ? "是" : (data.row.partTimeWorker == 0 ? "否" : ""))
                        }
                    },
                    {
                        label: '启用状态', code: 'enabled', width: 80, renderCell(h, data) {
                            return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
                        }
                    },
                    {label: '锁定时间', code: 'unlockingTime', width: 120},
                    {label: '排序', code: 'sequencing', width: 200}
                    /*{label: '备注', code: 'remark', width: 120},*/
                ],
                columnsQ: [
                    {code: 'oid', hidden: true},
                    {code: 'sn', hidden: true},
                    {code: 'code', label: '账号', width: 150},
                    {label: '姓名', code: 'name', width: 100},
                    {label: '部门', code: 'deptShortName', width: 100},
                    {label: '部门编码', code: 'deptCode', hidden: true},
                    {
                        label: '是否兼职', code: 'partTimeWorker', width: 120, renderCell(h, data) {
                            return (data.row.partTimeWorker == 1 ? "是" : (data.row.partTimeWorker == 0 ? "否" : ""))
                        }
                    },
                    {label: '锁定时间', code: 'unlockingTime', width: 120},
                    {
                        label: '启用状态', code: 'enabled', width: 120, renderCell(h, data) {
                            return (data.row.enabled == 1 ? "是" : (data.row.enabled == 0 ? "否" : ""))
                        }
                    },
                    /*{label: '排序', code: 'sequencing', width: 90},*/
                    /*{label: '备注', code: 'remark', width: 120},*/
                ],
                queryAuthRoles: [
                    {
                        type: 'static', code: "userCode", exp: "=", value: () => {
                            return this.mainDataForm.code
                        }
                    }
                ],
                columnsUserRoles: [
                    {code: 'oid', hidden: true},
                    {label: '角色名称', code: 'name', width: 200},
                    {label: '角色代码', code: 'code', width: 200},
                    {label: '是否启用', code: 'enabled', width: 100, mapTypeCode: 'YES_NO'}
                ],
                columnsAuthRoles: [
                    {code: 'oid', hidden: true},
                    {code: 'userId', hidden: true},
                    {code: 'roleAuthId', hidden: true},
                    {label: '角色名称', code: 'name', width: 200},
                    {label: '角色代码', code: 'code', width: 200}
                ],
                operations: [
                    {
                        name: '查看', ctrlCode: 'BCK', callback: this.viewAccount
                    },
                    {
                        name: '已授权角色', ctrlCode: 'BCKJSXX', callback: this.viewUserRoles
                    },
                    {
                        name: '角色授权', ctrlCode: 'BJSSQ', callback: this.authRoles, isShow: (row) => {
                            if (row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            return true;
                        }
                    }
                ],
                buttons: [],
                dialogVisible: false,
                treeData: '', /*用于表示左边树节点点击后获取到的数据，此数据用来做右边展示的父节点*/
                title: '',
                able: true, /*主账号，所在部门，员工编号是否可编辑的状态*/
                // func11: '',          /*编辑时获取第一次加载进来的账号，如果后面的值没变，则表示没有修改账号*/
                status: 1,
                mainDataForm: {
                    securityLevel: '',
                    deptName: '',
                    deptId: '',
                    sex: '1'
                },
                isShow: false, /*用于表示账号信息是否显示的状态，新增时不显示，编辑时显示*/
                activeName: "first",
                treeDeptName: '',
                userEmployeeVoId: '',
                isAddChild: false, /*是否为新增兼职账号*/
                partTimeWorkerDialogVisible: false,
                curDeptInfo: {
                    oid: '',
                    deptCode: ''
                },
                authRolesDialogVisible: false,
                userRolesDialogVisible: false,
                operationWidth: 200,
                row: {}
            }
        },
        methods: {
            // 获取角色
            getRoleList() {
                let staticConditions = [{
                    column: 'userCode',
                    exp: '=',
                    value: this.mainDataForm.code
                }]
                let params = {
                    staticConditions,
                    conditionLink: 'AND',
                    columns: ['oid', 'userId', 'roleAuthId', 'name', 'code'],
                    userCode: this.mainDataForm.code
                };
                this.$axios.get("/permission/role/outer/get/user_role_infos", {params: params})
                    .then(result => {
                        if (result.data&&result.data.length>0) {
                            this.tableData = result.data.filter(c=>{
                                return c.doEdit == true
                            })
                            this.selectedCodes = this.tableData.map(c=>{
                                if (c.isAuthed) {
                                    return c.oid;
                                }
                            })
                        }
                        this.roleloading = false;
                    })
                    .catch(error => {
                        this.$message.error('获取数据失败!')
                    })
                    .finally(_ => {
                        this.roleloading = false
                    })
            },
            /**
             * 给用户进行角色授权
             */
            authRoles(row) {
                this.mainDataForm.code = row.code;
                this.authRolesDialogVisible = true;
                this.row = row;
                this.getRoleList();
            },
            /**
             * 查看用户角色授权信息
             */
            viewUserRoles(row) {
                this.mainDataForm.code = row.code;
                this.userRolesDialogVisible = true;

            },
            saveAuthRoleInfos(funcCode) {
                let data = this.$refs.authRolesGrid.getGridData();
                console.log(data, 'data')
                if (data && data.length > 0) {
                    this.$axios.post('/permission/role/outer/save/user_auth_roles', {
                        $json: {
                            pageId: '',
                            funcCode: funcCode,
                            userCode: this.row.code,
                            userName: this.row.name,
                            params: data
                        }
                    }).then(result => {
                        this.$message.success("保存成功！");
                        this.closeViewRolesDialog();
                    }).catch(error => {
                        this.$message.error('保存授权信息失败 ' + (error.msg ? error.msg : '!'))
                    });

                } else {
                    this.$message.warning("请选择");
                }
            },
            closeAuthRoleDialog() {
                this.authRolesDialogVisible = false;
            },
            closeViewRolesDialog() {
                this.userRolesDialogVisible = false;
            },
            selectDeptConfirm(row) {
                this.mainDataForm.deptCode = row[0].deptCode;
                this.mainDataForm.deptId = row[0].oid;
            },
            /**清除验证*/
            closeItem() {
                this.mainDataForm = {
                    securityLevel: '',
                    deptName: '',
                    deptId: '',
                    sex: '1'
                };
                this.dialogVisible = false;
            },
            /**获取左边树的点击事件的值*/
            dataTree(row, dataTree) {
                this.treeData = row;
                this.treeDeptName = dataTree.data.deptName;
                this.curDeptInfo = dataTree.data;
            },
            /**编辑*/
            viewAccount(row) {
                this.isAddChild = false;
                this.able = true;
                this.$axios.get("/permission/user/user_code", {"params": {"userCode": row.code}}).then(success => {
                    this.title = '信息编辑';
                    this.isShow = true;
                    this.dialogVisible = true;
                    this.activeName = "first";
                    /*将卡片调到第一个----详细信息*/
                    let obj = {};
                    this.userEmployeeVoId = success.data.userEmployeeVo.oid;
                    Object.assign(obj, success.data.userEmployeeVo, success.data.userBaseVo);
                    /*返回是两个对象，页面只一个对象*/
                    this.mainDataForm = obj;
                    this.mainDataForm.mianUserCode = this.mainDataForm.code;
                    this.mainDataForm.partTimeWorker = this.mainDataForm.partTimeWorker === 1 ? '1' : '0';
                    this.mainDataForm.enabled = this.mainDataForm.enabled === 1 ? '1' : '0';
                    this.mainDataForm.sex = this.mainDataForm.sex === 0 ? '0' : '1';
                    this.mainDataForm.headPortraitUrl = this.mainDataForm.headPortraitUrl ? this.mainDataForm.headPortraitUrl : '';
                    this.$nextTick(() => {
                        this.$refs.grid.refresh();
                    });
                }).catch(error => {
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                });
            },
            /**新增或编辑共用的弹窗---按钮关闭弹窗*/
            closeDialog() {
                this.mainDataForm = {
                    securityLevel: '',
                    deptName: '',
                    deptId: '',
                    sex: '1'
                };
                this.dialogVisible = false;
            }
        },
        created() {
            this.operationWidth = 190;
        },
        components: {
            IceDeptSelector,
            IceDialog,
            IceSelect,
            IceImageUploader,
            IceTreeGrid,
            OrgTree,
            IceQueryGrid,
            UserEdit,
            ResetPwd
        }
    }
</script>

<style scoped>
    .avatar-uploader {
        border: 1px solid #d9d9d9;
        border-radius: 3px;
        position: absolute;
        overflow: hidden;

    }
</style>
