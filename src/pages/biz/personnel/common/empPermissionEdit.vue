<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <div style="margin-bottom: 2px">
            <el-button type="primary" @click="addItem">新增</el-button>
            <el-button type="primary" @click="saveItem">保存</el-button>
        </div>
        <el-table :data="tableData">
            <el-table-column type="index" label="序号" width="50px"></el-table-column>
            <el-table-column prop="userCode"
                             width="150"
                             label="用户账号">
            </el-table-column>
            <el-table-column prop="roleName"
                             width="150"
                             label="角色">
            </el-table-column>
            <el-table-column prop="systemName"
                             width="150"
                             label="系统/服务器">
            </el-table-column>
            <el-table-column prop="userAuth"
                             width="120"
                             label="权限">
            </el-table-column>
            <el-table-column prop="alterStatus"
                             width="100"
                             label="变更状态">
                <template slot-scope="scope">
                    {{scope.row.alterStatus=='1'?"回收权限":"赋予权限"}}
                </template>
            </el-table-column>
            <el-table-column prop="sureFlag"
                             width="150"
                             label="变更确认">
                <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.sureFlag" true-label="1" false-label="0"
                                 :disabled="userCode!=scope.row.engineerCode && !!scope.row.engineerCode">是否已实施
                    </el-checkbox>
                </template>
            </el-table-column>
            <el-table-column prop="operateTime"
                             label="变更时间">
            </el-table-column>
            <el-table-column prop="engineerName"
                             label="变更实施者">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="updateItem(scope.row,scope.$index)"
                               v-if="userCode===scope.row.engineerCode || !scope.row.engineerCode">编辑
                    </el-button>
                    <el-button type="text" @click="deleteItem(scope.$index)" v-if="!scope.row.engineerCode">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ice-dialog :visible.sync="visibleDialog" :width="width" :title="title">
            <el-form :model="mainData" :rules="formRules" label-width="100px" ref="form" style="margin-top: 15px">
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="角色" prop="roleCode">
                            <el-select v-model="mainData.roleCode">
                                <el-option v-for="(item,index) in EMP.roleCodeArr"
                                           :key="index+item.label"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="系统/服务器" prop="systemCode">
                            <el-select v-model="mainData.systemCode">
                                <el-option v-for="(item,index) in EMP.sysCodeArr"
                                           :key="index+item.label"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="8">
                        <el-form-item label="权限" prop="userAuth">
                            <el-select v-model="mainData.userAuth">
                                <el-option v-for="(item,index) in EMP.sysPermissionArr"
                                           :key="index+item.label"
                                           :label="item.label"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="变更状态" prop="alterStatus">
                            <el-select v-model="mainData.alterStatus">
                                <el-option label="回收权限" value="1"></el-option>
                                <el-option label="赋予权限" value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div class="ice-button-bar">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button type="info" @click="closeDialog">取消</el-button>
            </div>
        </ice-dialog>
    </div>
</template>

<script>
    import IceDialog from "../../../../components/common/base/IceDialog";
    import empComm from "@/pages/biz/personnel/common/empComm";
    import date from "@/components/common/base/calendar/date.js"

    export default {
        name: "empPermissionEdit",
        components: {IceDialog},
        mixins: [empComm],
        props: {
            width: {//弹窗宽度
                type: String || Number,
                default: '600px'
            },
        },
        data() {
            return {
                tableData: [],
                title: '',
                visibleDialog: false,
                mainData: {//表单对象
                    associateNo: '',//关联申请单号
                    userName: '',//用户姓名
                    userCode: '',//用户编码
                    roleName: '',//角色名称
                    roleCode: '',//角色编码
                    systemName: '',//系统名称
                    systemCode: '',//系统名称code
                    userAuth: '',//授予的权限
                    alterStatus: '',//变更状态 1为回收权限 2为赋予权限
                    engineerName: '',//变更实施者名称
                    engineerCode: '',//实施工程师编号
                    sureFlag: '',//变更确认：0为未确认，1为已确认
                    operateType: '',//操作类型:0为申请状态(默认) 1为新增行状态 2为删除行状态 3为编辑行状态
                    status: '',//变更类型,1为网络访问开通 2为业务权限
                },
                formRules: {//表单字段规则
                    roleCode:[{required:true,message:'请选择角色',trigger:'change'}],
                    systemCode:[{required:true,message:'请选择系统',trigger:'change'}],
                    userAuth:[{required:true,message:'请选择角色',trigger:'change'}],
                    alterStatus:[{required:true,message:'请选择角色',trigger:'change'}],
                },
                userCode: '',//用于检测table当条数据的变更实施者是否为当前登录用户
                userName: '',
                tblIndex: 0,//记录编辑的是当前的那一条
                delArr: [],
                defUserCode:'',
                isAdd:true,
            }
        },
        methods: {
            /**
             * 编辑
             */
            updateItem(row, index) {
                this.isAdd = false;
                this.tblIndex = index;
                this.title = '编辑';
                this.visibleDialog = true;
                this.mainData = Object.assign({}, row);
            },
            /**
             * 删除
             */
            deleteItem(index) {
                this.$confirm('确定删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    if(!!this.tableData[index].oid){
                        this.delArr.push(this.tableData[index]);
                    }
                    this.tableData.splice(index, 1);
                });

            },
            /**
             * 新增
             */
            addItem() {
                this.isAdd = true;
                this.title = '新增';
                this.visibleDialog = true;
            },
            /**
             * 取消
             */
            closeDialog() {
                this.resetForm();
                this.visibleDialog = false;
            },
            /**
             * 确定
             */
            save() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.mainData.oid || !this.isAdd) {//当条数据是否有oid或者当前行的isAdd为false，如果是，则判定为编辑，否则为新增
                            this.mainData.systemName = this.getSystemName(this.mainData.systemCode);
                            this.mainData.roleName = this.getRoleName(this.mainData.roleCode);
                            this.mainData.operateType = 3;
                            this.tableData[this.tblIndex] = Object.assign({}, this.mainData);
                            let arr = Object.assign([],this.tableData);
                            this.tableData = [];
                            this.tableData = arr;
                        } else {
                            this.mainData.systemName = this.getSystemName(this.mainData.systemCode);
                            this.mainData.roleName = this.getRoleName(this.mainData.roleCode);
                            this.mainData.operateType = 1;
                            this.mainData.userCode = this.defUserCode;
                            let obj = Object.assign({}, this.mainData);
                            this.tableData.push(obj);
                        }
                        this.closeDialog();
                    }
                });
            },
            /**
             * 将数据提交到后台--保存
             */
            saveItem() {
                this.$confirm('确定变更吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.delArr.forEach(item => {
                        item.operateType = 2;
                    });
                    let arr = Object.assign([],this.tableData);
                    arr.push(...this.delArr);
                    arr.forEach(item=>{
                        if(item.sureFlag == '1'){
                            item.engineerName = !!item.engineerName?item.engineerName:this.userName;
                            item.engineerCode = !!item.engineerCode?item.engineerCode:this.userCode;
                            item.operateTime = !!item.operateTime?item.operateTime:date.format(new Date(),'yyyy-MM-dd HH:mm:ss');
                        }
                        if(item.operateType == 1 || item.operateType == 3){
                            item.engineerName = this.userName;
                            item.engineerCode = this.userCode;
                            item.operateTime = date.format(new Date(),'yyyy-MM-dd HH:mm:ss');
                        }
                    });
                    this.$axios.post("/biz/bizEmpDynamicAuthorization/savePermission", {
                        userCode: this.userCode,
                        list: JSON.stringify(arr)
                    }).then(res => {
                        this.refresh();
                        this.$message.success("保存成功");
                    }).catch(e => {
                        if(e.msg){
                            this.$message.error(e.msg);
                        }else{
                            this.$message.error("系统繁忙，请稍后再试");
                        }
                        this.refresh();
                    })

                });
            },
            resetForm() {
                this.$refs.form.resetFields()
            },
            refresh() {
                this.$axios.get("/biz/bizEmpDynamicAuthorization/list", {
                    params: {
                        afNo: this.afNo,
                        alterType: !this.alterType?"":this.alterType
                    }
                }).then(res => {
                    this.tableData = res.data ? res.data : [];
                    if(this.tableData.length>0){
                        this.defUserCode = this.tableData[0].userCode;
                    }
                    this.delArr = [];
                }).catch(e => {
                    this.$message.error(e.msg);
                })
            }
        },
        mounted() {
            this.initPermissionList();
            this.userCode = this.$userInfo.userCode;
            this.userName = this.$userInfo.userName;
            this.afNo = this.$route.query['afNo'];
            this.alterType = this.$route.query['alterType'];
            this.refresh();
        }
    }
</script>

<style scoped>

</style>