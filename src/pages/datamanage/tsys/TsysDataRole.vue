<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <!-- 主表格 -->
        <ice-query-grid title="授权角色管理"
                        data-url="/datamanage/TsysDataRole/list"
                        :query="query"
                        :columns="columns"
                        :operationsWidth=200
                        :operations="operations"
                        ref="mainQueryGrid"
                        :buttons="buttons">
        </ice-query-grid>


        <!-- 弹出层 库表导入 -->
        <el-dialog v-dialogDrag title="角色维护" custom-class="ice-dialog" center :visible.sync="dialogAddVisible"
                   width="800px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataForm" :rules="formRules" label-position="right" class="conditon-bar" ref="addRoleForm"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="角色编码:" label-width="100px" prop="dataroleCode">
                                <el-input placeholder="角色编码" v-model="mainDataForm.dataroleCode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="角色名称:" label-width="100px" prop="dataroleName">
                                <el-input placeholder="角色名称" v-model="mainDataForm.dataroleName"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="角色说明:" label-width="100px" prop="dataroleType">
                                <el-input placeholder="说明例如：一般角色、系统管理员、安全管理员、安全审计员" type="textarea" :rows="4"
                                          v-model="mainDataForm.dataroleType"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="addRoleSave">保存</el-button>
                    <el-button type="info" @click="addRoleCloseDialog">返回</el-button>
                </div>

            </div>
        </el-dialog>

        <!-- 角色库表授权维护 -->
        <el-dialog v-dialogDrag title="角色库表授权维护" custom-class="ice-dialog" center :visible.sync="tablePermDialogVisible"
                   width="999px" append-to-body :close-on-click-modal="false">
            <tsys-data-role-table-perm :roid="rowDataRoid"></tsys-data-role-table-perm>
        </el-dialog>

        <!--用户授权-->
        <ice-persion-selector
                mode="hidden"
                choose-item="multiple"
                ref="persionPop"
                :selected-persion="selectedUsers"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>


    </div>
</template>

<script>

    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import  TsysDataRoleTablePerm from  "./TsysDataRoleTablePerm";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector.vue";

    //角色维护数据格式
    let roleDataConstant = {oid: '',dataroleCode: '',dataroleName: '',dataroleType: ''};
    let selectRoleOid = null;

    export default {
        name: "TsysDataRole",
        data(){
            return {
                rowDataRoid:"",
                query:[{type: 'input', label: '角色名称', code: 'dataroleName'}],
                columns:[ {label: 'oid', code: 'oid', hidden:true},
                    {label: 'deleteStatus', code: 'deleteStatus', hidden:true},
                    {label: '角色编码', code: 'dataroleCode', width: 190},
                    {label: '角色名称', code: 'dataroleName', width: 190},
                    {label: '角色类型', code: 'dataroleType', width: 190},
                    {label: '创建人', code: 'createUser', width: 190},
                    {label: '修改用户', code: 'updateUser', width: 190},
                    {label: '修改时间', code: 'updateDate', width: 190}],
                operations:[{
                    name: '停用', callback: this.deleteBtn, isShow: function (row) {
                        if (row.deleteStatus == 0) {
                            return true;
                        }
                        return false;
                    }
                },{
                    name: '启用', callback: this.deleteBtn, isShow: function (row) {
                        if (row.deleteStatus == null || row.deleteStatus == 1) {
                            return true;
                        }
                        return false;
                    }
                },{name: '修改', callback: this.updateRoleCallback},
                    {name: '用户授权', callback: this.rolePermCallback},
                    {name: '库表授权', callback: this.tablePermCallback}],
                buttons:[{name: '新增角色', icon: 'el-icon-plus', type: 'primary', callback: this.addCallback }],

                /*角色维护表格所需信息 start*/
                mainDataForm: roleDataConstant,
                formRules: {
                    dataroleCode: [{required: true, message: '请输入角色编码', trigger: 'blur'}],
                    dataroleName: [{required: true, message: '请输入角色名字', trigger: 'blur'}],
                    dataroleType: [{required: true, message: '请输入角色说明', trigger: 'blur'}],
                },
                dialogAddVisible:false,
                /*角色维护表格所需信息 end*/
                selectedUsers:[],
                tablePermDialogVisible:false
            }
        },
        methods: {

            /** 角色维护 start **/
            addCallback(){
                this.mainDataForm = roleDataConstant;
                this.dialogAddVisible = true;
            },
            addRoleSave(){
                this.$refs['addRoleForm'].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    this.$axios.post("/datamanage/TsysDataRole/saveOrUpdate", this.mainDataForm)
                        .then(result =>{
                            console.log(result);
                            this.$message.success("保存成功");
                            this.$refs.mainQueryGrid.refresh();
                            this.addRoleCloseDialog();
                        }).catch(error => {
                            this.$message.error(error.data.msg)
                    });
                });
            },
            addRoleCloseDialog(row){
                this.dialogAddVisible = false;
            },
            updateRoleCallback(row){
                this.mainDataForm = row;
                this.dialogAddVisible = true;
            },
            rolePermCallback(row){
                selectRoleOid = row.oid;
                //alert('load')
                this.$axios.get("/datamanage/TsysRolePerm/roleList", {params: {code: row.dataroleCode,type:'role'}})
                    .then(result => {
                        this.selectedUsers.splice(0,this.selectedUsers.length);
                        result.data.forEach(item =>{
                            this.selectedUsers.push(item['USER_CODE']);
                            }
                        )
                        this.$refs.persionPop.openDialog();
                    });
            },
            selectUserConfirm(rows){
                let data = [];
                console.log(rows)
                for(let i = 0 ; i < rows.length ; i++){
                    let userCode = rows[i]["code"];
                    if( this.selectedUsers.indexOf(userCode) == -1 ){
                        data.push({dataroleId:selectRoleOid,userCode:userCode})
                    }
                }
                if(data.length == 0){//无任何授权
                    return;
                }
                this.$axios.post('/datamanage/TsysRolePerm/saveOrUpdateList', {list: data},
                ).then(result => {
                    this.$message.success("保存成功")
                }).catch(error => {
                    this.$message.error("出错啦")
                });
            },
            /** 角色维护 end **/
            tablePermCallback(row){
                this.rowDataRoid = row.oid;
                this.tablePermDialogVisible = true;
            },
            deleteBtn(row){
                this.$axios.delete("/datamanage/TsysDataRole/del", {params:{"id":row.oid,"del":row.deleteStatus}})
                    .then(result => {
                        this.$message.success("操作成功");
                        this.$refs.mainQueryGrid.refresh();
                        this.closeDialog();
                    });
            }
        },
        components: {IceQueryGrid,TsysDataRoleTablePerm,IcePersionSelector}
    }
</script>

<style scoped>

</style>