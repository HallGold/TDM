<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-query-grid title="授权查看"
                        data-url="/permission/dataDictionary/page"
                        :query="query"
                        :columns="columns"
                        ref="grid"
                        :operations-width="200"
                        :operations="operations">
        </ice-query-grid>
        <el-dialog v-dialogDrag title="已授权人员" custom-class="ice-dialog" center :visible.sync="dialogVisibleRole"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <ice-query-grid title="已授权人员"
                                data-url="/permission/role_user/users_by_role_id"
                                :query="queryAuthorizeRole"
                                :columns="columnsAuthorizeRole">
                </ice-query-grid>
            </div>
            <div class="ice-button-bar ">
                <el-button type="info" @click="closeDialogRole">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="已授权资源" custom-class="ice-dialog" center :visible.sync="dialogVisibleResource"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <ice-query-grid title="已授权资源"
                                data-url="/permission/role_user/users_by_role_id"
                                :query="queryAuthorizeResource"
                                :columns="columnsAuthorizeResource">
                </ice-query-grid>
            </div>
            <div class="ice-button-bar ">
                <el-button type="info" @click="closeDialogResource">返回</el-button>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="已授权APP" custom-class="ice-dialog" center :visible.sync="dialogVisibleApp"
                   width="1000px" append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <ice-query-grid title="已授权APP"
                                data-url="/permission/role_user/users_by_role_id"
                                :query="queryAuthorizeApp"
                                :columns="columnsAuthorizeApp">
                </ice-query-grid>
            </div>
            <div class="ice-button-bar ">
                <el-button type="info" @click="closeDialogApp">返回</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    export default {
        name: "RoleAuthorize",
        components: {IcePersionSelector, IceQueryGrid},
        data(){
            return{
                dialogVisibleResource:false,
                dialogVisibleRole:false,
                dialogVisibleApp:false,
                OID:'',
                lookOID:'',
                /**角色页面*/
                query:[
                    {type: 'input', label: '角色', code: 'name'},
                ],
                columns:[
                    {label: 'id', code: 'oid', width: 0, hidden: true},
                    {label: '机构编码', code: 'orgCode', width: 0, hidden: true},
                    {label: '启用状态', code: 'enabled', width: 0, hidden: true},
                    {label: '名称', code: 'name', width: 200},
                    {label: '编码', code: 'code', hidden: true},
                    {label: '描述', code: 'desp', width: 200},
                    {label: '备注', code: 'remark', width: 200},
                    {label: '排序', code: 'sequencing', width: 100},
                ],
                operations:[
                    /*{name: '授权', callback: this.authorize},*/
                    {name:'APP', callback:this.lookAppAuthorize},
                    {name:'人员', callback:this.lookRoleAuthorize},
                    {name:'资源', callback:this.lookResourceAuthorize},
                ],

                /**已授权角色页面字段*/
                queryAuthorizeRole:[
                    {type: 'static',  code: "roleId",exp:"=",value:()=>{return this.lookOID}},
                    {type: 'input', label: '角色', code: 'name'}
                ],
                columnsAuthorizeRole:[
                    {code: 'oid', hidden: true},
                    {label: '姓名', code: 'name', width: 120},
                    {label: '编码', code: 'code', width: 120},
                    {label: '联系电话', code: 'phone', width: 120},
                    {label: '部门', code: 'deptCode', width: 120},
                ],

                /**已授权资源页面字段*/
                queryAuthorizeResource:[
                    {type: 'static',  code: "roleId",exp:"=",value:()=>{return this.lookOID}},
                    {type: 'input', label: '资源名', code: 'name'}
                ],
                columnsAuthorizeResource:[
                    {code: 'oid',hidden: true},
                    {label: '资源名称', code: 'name', width: 120},
                    /*{label: '角色代码', code: 'code', width: 120},
                    {label: '角色描述', code: 'desp', width: 120},*/
                ],

                /**已授权APP页面字段*/
                queryAuthorizeApp:[
                    {type: 'static',  code: "roleId",exp:"=",value:()=>{return this.lookOID}},
                    {type: 'input', label: 'APP名', code: 'name'}
                ],
                columnsAuthorizeApp:[
                    {code: 'oid', hidden: true},
                    {label: 'APP名', code: 'name', width: 120},
                    {label: 'APP编码', code: 'appCode', width: 120},
                    {label: 'APP图标', code: 'smallIconUrl', width: 160,renderCell:(h, data)=>{
                            return <img src={this.$showImage(data.row.smallIconUrl)} width="22px" height="22px" />
                        }
                    },
                    {label: 'APP描述', code: 'desp', width: 120},
                ]
            }
        },
        methods:{
            /**选择授权对象*/
            authorize(row){
                this.OID = row.oid;
                this.$refs.selectUser.openDialog();
                this.$refs.selectUser.cleanColumnSelect();

            },
            /**查看已授权角色*/
            lookRoleAuthorize(row){
                this.lookOID = row.oid;
                this.dialogVisibleRole = true;
            },
            /**查看已授权APP*/
            lookAppAuthorize(row){
                this.lookOID = row.oid;
                this.dialogVisibleApp = true;
            },
            /**查看已授权资源*/
            lookResourceAuthorize(row){
                this.lookOID = row.oid;
                this.dialogVisibleResource = true;
            },
            /**关闭角色弹窗*/
            closeDialogRole(){
                this.dialogVisibleRole = false;
            },
            /**关闭资源弹窗*/
            closeDialogResource(){
                this.dialogVisibleResource = false;
            },
            /**关闭app弹窗*/
            closeDialogApp(){
                this.dialogVisibleApp = false;
            }
        }
    }
</script>

<style scoped>

</style>
