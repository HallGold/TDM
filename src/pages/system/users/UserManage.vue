<template>
    <div class="content-filled">
        <ice-tree-grid load-url="/permission/frame_org/load_table_tree?loadDisabled=true"
                       label-prop="deptName"
                       value-prop="oid"
                       :lazy="false"
                       parent-prop="deptId"
                       data-url="/pms/FrameUserInfo/listQuery"
                       export-url="/pms/FrameUserInfo/listQuery"
                       :columns="columns"
                       :query="query"
                       exportTitle="人员导出"
                       :operations="operations"
                       :buttons="buttons"
                       ref="iceGrid"
                       @node-click="dataTree"
                       :operations-width="operationWidth">
        </ice-tree-grid>
        <!--新增兼职账号-->
        <ice-dialog :visible.sync="partTimeWorkerDialogVisible"
                    width="600px"
                    title="新增兼职账号"
                    :before-close="closeDialogPartTimeWorker">
            <el-form :model="mainDataForm"
                     :rules="formRulespx"
                     label-position="right"
                     class="conditon-bar"
                     ref="formp">
                <ice-grid-layout name="兼职账号信息" :columns=1 gutter="0px" :expandable=false>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="账号" label-width="100px" prop="partTimeWorkerCode">
                                <el-input placeholder="2到6位字母或数字"
                                          v-model="mainDataForm.partTimeWorkerCode"
                                          @blur="func"
                                          maxlength="6">
                                    <template slot="prepend">{{mainDataForm.code}}-</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="兼职部门" label-width="100px" prop="deptName">
                            <ice-dept-selector
                                    text-prop="name"
                                    code-prop="deptCode"
                                    choose-item="single"
                                    mode="onlySelect"
                                    v-model="mainDataForm.deptName"
                                    @select-confirm="selectDeptConfirm"></ice-dept-selector>
                        </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="40">
                        <el-col :span="24">
                            <el-form-item label="兼职说明" label-width="100px">
                                <el-input type="textarea"
                                          class="textarea"
                                          v-model="mainDataForm.task"
                                          :rows="6"
                                          resize="none"
                                          :maxlength="128"
                                          :showWordLimit="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </ice-grid-layout>
            </el-form>
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" @click="save">保存</el-button>
                <el-button type="info" size="medium" @click="closeDialogPartTimeWorker">取消</el-button>
            </div>
        </ice-dialog>
        <!--新增编辑账号-->
        <ice-dialog :title="title" v-dialogDrag center :visible.sync="dialogVisible"
                    width="1100px" append-to-body :close-on-click-modal="false" :before-close="closeItem">
            <el-tabs v-model="activeName">
                <el-tab-pane label="账号详细" name="first">

                    <div style="height: 450px">
                        <vue-scroll
                                :ops="{bar:{background:'#000',opacity:0.4,keepShow:true,size:'8px',onlyShowBarOnScroll:true}}">
                            <div style="overflow-x: hidden; padding: 0 30px 0 15px;">
                                <el-form :model="mainDataForm" :rules="formRules" label-position="right"
                                         class="conditon-bar"
                                         ref="form"
                                         style="margin-top: 20px">
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="账号" label-width="100px" prop="code">
                                                <el-input placeholder="账号" v-model="mainDataForm.code" @blur="func"
                                                          maxlength="30"
                                                          :disabled="mainDataForm.oid && mainDataForm.oid.length > 0"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <!--<el-col :span="12">-->
                                            <!--<el-form-item label="用户图像" label-width="100px" prop="headPortraitUrl">-->
                                                <!--<ice-image-uploader v-model="mainDataForm.headPortraitUrl"-->
                                                                    <!--class="avatar-uploader"></ice-image-uploader>-->
                                            <!--</el-form-item>-->
                                        <!--</el-col>-->
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
                                    <!--<el-row :gutter="40">-->
                                        <!--<el-col :span="12">-->
                                            <!--<el-form-item label="是否兼职" label-width="100px" prop="partTimeWorker">-->
                                                <!--<el-select placeholder="是否兼职" v-model="mainDataForm.partTimeWorker"-->
                                                           <!--:disabled="true">-->
                                                    <!--<el-option label="是" value="1"></el-option>-->
                                                    <!--<el-option label="否" value="0"></el-option>-->
                                                <!--</el-select>-->
                                            <!--</el-form-item>-->
                                        <!--</el-col>-->
                                    <!--</el-row>-->
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="排序" label-width="100px" prop="sequencing">
                                                <el-input placeholder="只能输入1至7位数字哦" v-model="mainDataForm.sequencing"
                                                          maxlength="7" @keyup.native="number"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="主账号" label-width="100px" prop="mainUserCode">
                                                <el-input placeholder="主账号" v-model="mainDataForm.mainUserCode"
                                                          :disabled="true"
                                                          maxlength="64"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="是否启用" label-width="100px" prop="enabled">
                                                <el-select placeholder="是否启用" v-model="mainDataForm.enabled">
                                                    <el-option label="是" value="1"></el-option>
                                                    <el-option label="否" value="0"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="姓名:" label-width="100px" prop="name">
                                                <el-input placeholder="姓名" v-model="mainDataForm.name"
                                                          maxlength="20"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="性别:" label-width="100px" prop="sex">
                                                <el-select placeholder="性别" v-model="mainDataForm.sex">
                                                    <el-option label="男" value="1"></el-option>
                                                    <el-option label="女" value="0"></el-option>
                                                </el-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="访问数据密级:" label-width="100px" prop="securityLevel">
                                                <ice-select v-model="mainDataForm.securityLevel"
                                                            @change="$nextTick(()=>{$refs.form.validateField('securityLevel',error=>{})})"
                                                            map-type-code="OR_SECRET_LEVEL"></ice-select>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="生日:" label-width="100px" prop="birthDay">
                                                <el-date-picker
                                                        format="yyyy-MM-dd:HH:ss"
                                                        v-model="mainDataForm.birthDay"
                                                        type="date"
                                                        placeholder="选择日期">
                                                </el-date-picker>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="手机电话:" label-width="100px" prop="handphoneTel">
                                                <el-input placeholder="手机电话"
                                                          v-model="mainDataForm.handphoneTel"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="固定电话:" label-width="100px" prop="landlineTel">
                                                <el-input placeholder="固定电话" v-model="mainDataForm.landlineTel"
                                                          maxlength="30"
                                                          @keyup.native="fixedPhone"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="EMAIL:" label-width="100px" prop="email">
                                                <el-input placeholder="EMAIL" v-model="mainDataForm.email"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>

                                    <el-row :gutter="40">
                                        <el-col :span="24">
                                            <el-form-item label="工作地址:" label-width="100px" prop="jobAddress">
                                                <el-input placeholder="工作地址" type="textarea" :rows="1"
                                                          v-model="mainDataForm.jobAddress" maxlength="100"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="24">
                                            <el-form-item label="家庭地址:" label-width="100px" prop="homeAddress">
                                                <el-input placeholder="家庭地址" type="textarea" :rows="1"
                                                          v-model="mainDataForm.homeAddress" maxlength="100"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="身份证号:" label-width="100px" prop="idCard">
                                                <el-input placeholder="身份证号" v-model="mainDataForm.idCard"
                                                          :disabled="isAddChild"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="员工编号:" label-width="100px" prop="sn">
                                                <el-input placeholder="员工编号" v-model="mainDataForm.sn"
                                                          :disabled="able || isAddChild" @blur="func1"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40">
                                        <el-col :span="12">
                                            <el-form-item label="工作卡号:" label-width="100px" prop="workingIdCard">
                                                <el-input placeholder="工作卡号" v-model="mainDataForm.workingIdCard"
                                                          :disabled="isAddChild"></el-input>
                                            </el-form-item>
                                        </el-col>
                                        <el-col :span="12">
                                            <el-form-item label="所在部门:" label-width="100px" prop="deptName">
<!--                                                <el-input placeholder="所在部门" v-model="mainDataForm.deptName"-->

<!--                                                          maxlength="32"></el-input>-->
                                                <ice-dept-selector chooseItem="single"
                                                                   v-model="mainDataForm.deptName"
                                                                   @select-confirm="deptChange">
                                                </ice-dept-selector>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="40" v-if="mainDataForm.partTimeWorker === '1'">
                                        <el-col :span="24">
                                            <el-form-item label="兼职说明" label-width="100px">
                                                <el-input type="textarea"
                                                          class="textarea"
                                                          v-model="mainDataForm.task"
                                                          :rows="3"
                                                          resize="none"
                                                          :maxlength="128"
                                                          :showWordLimit="true"></el-input>
                                            </el-form-item>
                                        </el-col>
                                    </el-row>
                                </el-form>
                            </div>
                        </vue-scroll>
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
            <div class="ice-button-bar" slot="footer">
                <el-button type="primary" size="medium" ctrlCode="BYHXXBC" @click="save">保存</el-button>
                <el-button type="info" size="medium" unauth @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>

<!--  modify by 杨炳乾 start  -->
      <ice-dialog :title="dialogChangePwdTitle"
                  :visible.sync="dialogChangePwdVisible"
                  width="400px" height="200px">
        <change-password @dialogVisible="changeDialogPwdVisible" showOldPwd="false" v-bind:oid="changeUserId"></change-password>
      </ice-dialog>
<!--  end    -->
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
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import VueScroll from 'vuescroll'
    /*modify by 杨炳乾 start*/
    import ChangePassword from "@/components/common/ChangePassword";
    /*end*/
    import Vue from "vue";

    export default {
        name: "UserManage",
        /* mixins: [OrgComm],*/
        /*inject:['reload'],*/
        data() {
            return {
                query: [
                    // {type: 'static', code: "loadDisabled", exp: "=", value: true},
                    // {type: 'static', code: "cascade", exp: "=", value: true},
                    {type: 'static', code: "enabled", exp: "=", value: 1},
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
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'sn', hidden: true},
                    {label: '账号', code: 'code', width: 160,align:'left'},
                    {label: '姓名', code: 'name', width: 120,align:'left'},
                    // {label: '单位', code: 'orgShortName', width: 180,align:'left'},
                    {label: '部门', code: 'deptShortName', width: 160,align:'left'},
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
                    {label: '排序', code: 'sequencing', width: 200,align:'left'},
                    /*{label: '备注', code: 'remark', width: 120},*/
                ],
                columnsQ: [
                    {code: 'oid', hidden: true},
                    {code: 'sn', hidden: true},
                    {code: 'code', label: '账号', width: 150},
                    {label: '姓名', code: 'name', width: 120},
                    {label: '单位', code: 'orgShortName', width: 180},
                    {label: '部门', code: 'deptShortName', width: 150},
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
                    {label: '锁定时间', code: 'unlockingTime'},
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
                        name: '编辑', ctrlCode: 'BYHBJ', callback: this.update, isShow: (row) => {
                            if (row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        name: '启用', ctrlCode: 'BQY', callback: this.enabl, isShow: (row) => {
                            if (row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            if (row.enabled == 0) {
                                return true;
                            }
                            return false;
                        }
                    },
                    {
                        name: '停用', ctrlCode: 'BTY', callback: this.enabl, isShow: (row) => {
                            if (row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            if (row.enabled == null || row.enabled == 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                  /* modify by 杨炳乾 start*/
                    {
                        name: '修改密码', ctrlCode: 'CPW', callback: this.changePwd, isShow: (row) => {
                            if (this.showChangePwdBtn == false || row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            // 取后台配置

                            if (row.enabled == null || row.enabled == 1) {
                                return true;
                            }
                            return false;
                        }
                    },
                    /*end*/
                    {
                        name: '新增兼职账号', ctrlCode: 'BXZJZYH', callback: this.addChild, isShow: (row) => {
                            if (row.code == this.$userInfo.userCode) {
                                return false;
                            }
                            if (row.partTimeWorker == 1) {
                                return false;
                            }

                            return true;
                        }
                    },
                    // {
                    //     name: '删除', ctrlCode: 'BSCYH', callback: this.removeItem, isShow: (row) => {
                    //         if (row.code == this.$userInfo.userCode) {
                    //             return false;
                    //         }
                    //         return true;
                    //     }
                    // }
                ],
                buttons: [
                    {
                        name: '新增',
                        ctrlCode: 'BXZYH',
                        icon: 'el-icon-plus',
                        type: 'primary',
                        callback: this.addMainAccount
                    },
                    {name: '导出', ctrlCode: "BDC", icon: 'el-icon-download', size: 'mini', type: 'export'},  //导出Excel表需要定义一个组件就行，这里声明就可以使用
                ],
                dialogVisible: false,
                formRules: {
                    code: [{required: true, whitespace: true, message: '请输入账号', trigger: 'blur'}],
                    name: [{required: true, whitespace: true, message: '请输入姓名', trigger: 'blur'}],
                    securityLevel: [{required: true, message: '请输入用户密级', trigger: 'blur'}],
                    sn: [{required: true, whitespace: true, message: '请输入员工编码', trigger: 'blur'}],
                    email: [
                        {type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
                    ],
                    handphoneTel: [{validator: validatePhone, trigger: 'blur'}]
                },
                formRulespx: {
                    partTimeWorkerCode: [{required: true, whitespace: true, message: '请输入账号', trigger: 'blur'},
                        {pattern: /^[a-z,A-Z,0-9]{2,6}$/, min: 3, max: 3, message: "请输入2到6位字母或数字"}],
                    /* deptName:[{required: true, message: '请选择部门', trigger: 'blur'}],*/
                },
                dialogChangePwdVisible: false,
                treeData: '',               /*用于表示左边树节点点击后获取到的数据，此数据用来做右边展示的父节点*/
                title: '',
                able: true,             /*主账号，所在部门，员工编号是否可编辑的状态*/
                status: 1,
                mainDataForm: {
                    securityLevel: '',
                    deptName: '',
                    deptId: '',
                    sex: '1',
                    task:'',
                },
                isShow: false,                           /*用于表示账号信息是否显示的状态，新增时不显示，编辑时显示*/
                activeName: "first",
                treeDeptName: '',
                userEmployeeVoId: '',
                isAddChild: false,                               /*是否为新增兼职账号*/
                partTimeWorkerDialogVisible: false,
                curDeptInfo: {
                    oid: '',
                    deptCode: ''
                },
                authRolesDialogVisible: false,
                userRolesDialogVisible: false,
                operationWidth: 200,

              /* modify by 杨炳乾 start*/
              dialogChangePwdTitle: '修改密码',
              changeUserId: '',
              showChangePwdBtn: false
              /*end*/
            }
        },
        methods: {
            // 人员换部门
            deptChange (depts) {
                let row = depts[0];

                this.mainDataForm.deptCode = row.deptCode;
                this.mainDataForm.deptName = row.deptName;//treeDeptName;
                this.mainDataForm.deptId = row.oid;
            },
            selectDeptConfirm(row) {
                this.mainDataForm.deptCode = row[0].deptCode;
                this.mainDataForm.deptId = row[0].oid;
            },
            /**清除验证*/
            closeItem() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },
            fixedPhone() {
                this.mainDataForm.landlineTel = this.mainDataForm.landlineTel.replace(/[^\d||-]+$/, '');
            },
            /**获取左边树的点击事件的值*/
            dataTree(row, dataTree) {
                this.treeData = row;
                this.treeDeptName = dataTree.data.deptName;
                this.curDeptInfo = dataTree.data;
            },
            /**效验账号*/
            func() {
                if (!this.isAddChild) {
                    if (this.mainDataForm.code) {
                        this.$axios.get("/permission/user/unique", {"params": {"userCode": this.mainDataForm.code}}).then(success => {
                            if (this.mainDataForm.code.trim() == '') {
                                this.$message.warning("账号不能为空");
                                this.mainDataForm.code = '';
                            }
                            if (success.data) {
                                if (this.mainDataForm.code != this.mainDataForm.mainUserCode) {
                                    this.$message.warning("账号已存在，请换一个");
                                    this.mainDataForm.code = '';
                                }
                            }
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg ? error.msg : '操作出错了'
                            })
                        });
                    }
                } else {
                    if (this.mainDataForm.partTimeWorkerCode) {
                        this.$axios.get("/permission/user/unique", {"params": {"userCode": (this.mainDataForm.code + '-' + this.mainDataForm.partTimeWorkerCode)}}).then(success => {
                            if (success.data) {
                                this.$message.warning("账号已存在，请换一个");
                                this.mainDataForm.partTimeWorkerCode = '';
                            }
                        }).catch(error => {
                            this.$message({
                                type: 'error',
                                message: error.msg ? error.msg : '操作出错了'
                            })
                        });
                    }
                }
            },
            /**效验员工编号*/
            func1() {
                /*this.$axios.get("/permission/user/user_code",{"params":{"sn":this.mainDataForm.sn}}).then(success=>{
                    if(success.data){
                        this.$message.error("账号已存在，请换一个");
                        this.mainDataForm.sn = '';
                    }
                }).catch(error=>{
                    this.$message.error("效验员工编号出错了");
                });*/
            },
            /**效验排序只能输入数字*/
            number() {
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace(/[^\.\d]/g, '');
                this.mainDataForm.sequencing = this.mainDataForm.sequencing.replace('.', '');
            },
            numberIdCard() {
                /*/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/*/
                this.mainDataForm.idCard = this.mainDataForm.idCard.replace(/[^\.\d]/g, '');
                this.mainDataForm.idCard = this.mainDataForm.idCard.replace('.', '');
                this.mainDataForm.idCard = this.mainDataForm.idCard.replace(/^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/);
            },
            /**新增主账号*/
            addMainAccount() {
                this.isAddChild = false;
                if (this.treeData) {
                    this.mainDataForm.parentCode = this.treeData;
                    this.title = '新增账号';
                    this.able = false;
                    this.isShow = false;
                    this.activeName = "first";
                    this.mainDataForm = {
                        partTimeWorker: '0',
                        securityLevel: '',
                        enabled: '1',
                        sex: '1',
                        mainUserCode:'',
                        code:'',
                        headPortraitUrl:'',
                        sequencing:'',
                        name:'',
                        birthDay:'',
                        handphoneTel:'',
                        landlineTel:'',
                        email:'',
                        jobAddress:'',
                        homeAddress:'',
                        idCard:'',
                        sn:'',
                        workingIdCard:'',
                        deptName:'',
                    };
                    this.dialogVisible = true;
                    this.mainDataForm.deptCode = this.curDeptInfo.deptCode;
                    this.mainDataForm.deptName = this.curDeptInfo.deptName;//treeDeptName;
                    this.mainDataForm.deptId = this.curDeptInfo.oid;
                    this.mainDataForm.mainUserCode = '';
                    this.userEmployeeVoId = '';
                } else {
                    this.$confirm('请选择要添加的层级', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.closeDialog();
                    })
                }
            },
            /**删除*/
            removeItem(row) {
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete("/permission/user/remove", {"params": {"userCode": row.code}}).then(success => {
                        this.$message.success("删除成功");
                        this.dialogVisible = false;
                        this.$refs.iceGrid.$refs.queryGrid.refresh();
                    }).catch(error => {
                        this.$message({
                            type: 'error',
                            message: error.msg ? error.msg : '操作出错了'
                        })
                    })
                })

            },
            /**新增兼职账号*/
            addChild(row) {
                this.isAddChild = true;
                this.able = false;
                this.isShow = false;
                this.$axios.get("/permission/user/user_code", {"params": {"userCode": row.code}}).then(success => {
                    this.title = '新增兼职账号';
                    this.able = false;
                    this.isShow = false;
                    this.mainDataForm = {
                        securityLevel: '',
                        deptName: '',
                        deptCode: '',
                        deptId: '',
                        mainUserCode: ''
                    };
                    this.mainDataForm.mainUserCode = '';
                    let obj = {};
                    Object.assign(obj, success.data.userEmployeeVo, success.data.userBaseVo);  /*返回是两个对象，页面只一个对象*/
                    this.mainDataForm = obj;
                    this.mainDataForm.partTimeWorker = '1';
                    this.mainDataForm.oid = '';
                    this.mainDataForm.mainUserCode = row.code;
                    this.partTimeWorkerDialogVisible = true;
                    this.mainDataForm.headPortraitUrl = this.mainDataForm.headPortraitUrl ? this.mainDataForm.headPortraitUrl : '';
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                })
            },
            /**关闭新增兼职弹窗*/
            closeDialogPartTimeWorker() {
                this.$refs.formp.clearValidate();
                this.partTimeWorkerDialogVisible = false;
            },
            /**编辑*/
            update(row) {
                this.isAddChild = false;
                this.able = true;
                this.$axios.get("/permission/user/user_code", {"params": {"userCode": row.code}}).then(success => {
                    this.title = '信息编辑';
                    this.isShow = true;
                    this.dialogVisible = true;
                    this.activeName = "first";  /*将卡片调到第一个----详细信息*/
                    let obj = {};
                    this.userEmployeeVoId = success.data.userEmployeeVo.oid;
                    Object.assign(obj, success.data.userEmployeeVo, success.data.userBaseVo);  /*返回是两个对象，页面只一个对象*/
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
            /**禁用、启用*/
            enabl(row) {
                if (row.enabled == 1) {
                    this.status = 0;
                } else {
                    this.status = 1;
                }
                this.$axios.patch("/permission/user/enabled_status", {
                    userCode: row.code,
                    status: this.status
                }).then(success => {
                    this.$message.success("操作成功");
                    this.$refs.iceGrid.$refs.queryGrid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                });
            },
            saveData() {
                let obj = {};
                Object.assign(obj, this.mainDataForm);
                if (this.isAddChild) {
                    obj.code = obj.code + '-' + this.mainDataForm.partTimeWorkerCode;
                    delete obj.partTimeWorkerCode;
                } else {
                    this.mainDataForm.oid = this.userEmployeeVoId;
                }

                this.$axios.patch("/permission/user/save", {
                    "userBaseVo": obj,
                    "userEmployeeVo": this.mainDataForm
                }).then(success => {
                    this.$message.success("保存成功");
                    this.mainDataForm = {
                        securityLevel: '',
                        deptName: '',
                        deptCode: '',
                        deptId: ''
                    };
                    if (this.isAddChild) {
                        this.closeDialogPartTimeWorker()
                    } else {
                        this.closeDialog();
                    }
                    this.$refs.iceGrid.$refs.queryGrid.refresh();
                }).catch(error => {
                    this.$message({
                        type: 'error',
                        message: error.msg ? error.msg : '操作出错了'
                    })
                });
            },
            /**新增或编辑共用的弹窗---按钮保存*/
            save() {
                if (this.isAddChild) {
                    this.$refs['formp'].validate((valid) => {
                        if (!valid) {
                            return false;
                        }
                        this.saveData();
                    });
                } else {
                    this.$refs['form'].validate((valid) => {
                        if (!valid) {
                            return false;
                        }
                        this.saveData();
                    });
                }
            },
            /**新增或编辑共用的弹窗---按钮关闭弹窗*/
            closeDialog() {
                this.$refs.form.clearValidate();
                this.dialogVisible = false;
            },

          /* modify by 杨炳乾 start*/
          changePwd(row){
              this.changeUserId = row.oid;
              this.dialogChangePwdVisible = true;
          },
          changeDialogPwdVisible(visible){
            this.dialogChangePwdVisible = visible;
          },
          async isShowChangePwd() {

            let {data} = await Vue.prototype.$axios.get(`permission/app_constant/byCode?appCode=SYSTEM_COMMON_90&code=MODIFY_PWD`);
            this.showChangePwdBtn = data.value == "1";
          }
          /*end*/
        },
        created() {
            // if (this.$userInfo && this.$userInfo.userType) {
            //     if (this.$userInfo.userType === 0xFF) {
            //         this.operationWidth = 360;
            //     } else if ((this.$userInfo.userType & 0x02) === 0x02) {
            //         this.operationWidth = 150;
            //     } else {
            //         this.operationWidth = 200;
            //     }
            // } else {
            //     this.operationWidth = 200;
            // }
            this.operationWidth = 200;

          /* modify by 杨炳乾 start*/
          this.isShowChangePwd();
          /*end*/
        },
        components: {
            IceGridLayout,
            IceDeptSelector,
            IceDialog,
            IceSelect,
            IceImageUploader,
            IceTreeGrid,
            OrgTree,
            IceQueryGrid,
            UserEdit,
            ResetPwd,
            VueScroll,
          /* modify by 杨炳乾 start*/
          ChangePassword
          /*end*/
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
