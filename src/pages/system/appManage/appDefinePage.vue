<template>
    <div>
        <el-dialog v-dialogDrag
                   title="APP菜单定义"
                   custom-class="ice-dialog"
                   center
                   :visible.sync="dialogVisible"
                   width="80%"
                   append-to-body
                   :before-close="closeDialog"
                   :close-on-click-modal="false">
            <ice-query-grid data-url="/permission/res/app/outer/get/menulist_of_app"
                            ref="grid"
                            :gridAutoRefresh="false"
                            :pagination="false"
                            :operationsWidth="270"
                            :query="query"
                            :columns="columns"
                            :operations="operations"
                            :buttons="buttons"></ice-query-grid>
<!--            <div class="ice-button-bar ">-->
<!--                <el-button type="info" @click="closeDialog">取消</el-button>-->
<!--            </div>-->
        </el-dialog>
        <app-preserve-edit ref="appPreserveEdit"
                           :title="title"
                           :mainDataForm="appPreserveEditData"
                           :is-edit="isEdit"
                           :isSuccess="refresh"></app-preserve-edit>
        <app-dept-edit ref="appDeptEdit"></app-dept-edit>
        <app-preserve-more-edit ref="appPreserveMoreEdit"></app-preserve-more-edit>
    </div>
</template>

<script>
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import AppPreserveEdit from "./appPreserveEdit";
    import AppDeptEdit from "./appDeptEdit";
    import AppPreserveMoreEdit from "./appPreserveMoreEdit";
    export default {
        name: "appDefinePage",
        components: {AppPreserveMoreEdit, AppDeptEdit, AppPreserveEdit, IceQueryGrid},
        data(){
            return{
                query:[],       //组件查询
                columns:[],     //组件table列展示
                buttons:[],     //组件按钮
                operations:[],  //组件table列按钮
                dialogVisible:false,
                title:'',
                appId:'',       //父页面的oid
                appCode:'',     //符页面的appCode
                appPreserveEditData:{//app菜单维护--表单对象
                    menulistCode:'',
                    menulistName:'',
                    isEnabled:'',
                    isDefappres:'N',
                    remark:''
                },
                isEdit:false
            }
        },
        methods:{
            /**
             * 初始化组件部分
             */
            initComponent(){
                this.query = [
                    {type: 'input', label: '菜单名称', code: 'menulistName', value: ''},
                    {type: 'static', code: 'appId',exp:'=',value:()=>{
                        return this.appId;
                        }}
                ];
                this.columns = [
                    {code:'oid',hidden:true},
                    {label:'菜单编码',code:'menulistCode',width:200},
                    {label:'菜单名称',code:'menulistName',width:200},
                    {label:'默认',code:'isDefault',width:90,renderCell(h,data){
                        return data.row.isDefault == 'Y'?'是':'否'
                        }},
                    {label:'状态',code:'isEnabled',width:90,renderCell(h,data){
                            return data.row.isEnabled == 'Y'?'启用':'停用'
                        }},
                    {label:'菜单描述',code:'remark'},
                ];
                this.buttons = [
                    {name:'新增',callback:this.add},
                ];
                this.operations = [
                    {name:'部门',callback:this.deptItem},
                    {name:'设为默认',callback:this.defaultItem,isShow:function (row) {
                            return row.doEdit;
                        }},
                    {name: '启用', callback: this.enabledOrDisabled,isShow:function (row) {
                            if (row.isEnabled == 'N'&& row.doEdit) {
                                return true;
                            }
                            return false;
                        }},
                    {name: '停用', callback: this.enabledOrDisabled,isShow:function (row) {
                            if (row.isEnabled == 'Y' && row.doEdit) {
                                return true;
                            }
                            return false;
                        }},
                    {name:'菜单',callback:this.appItem,isShow:function (row) {
                            return row.doEdit;
                        }},
                    {name:'编辑',callback:this.editPageFuncItem,isShow:function (row) {
                            return row.doEdit;
                        }},
                    {name:'删除',callback:this.deleteItem,isShow:function (row) {
                            return row.doEdit;
                        }}
                ];
            },
            /**
             * 关闭
             */
            closeDialog(){
                this.dialogVisible = false;
            },
            /**
             * 打开弹窗
             */
            openDialog(appId,appCode){
                this.appId = appId;
                this.appCode = appCode;
                this.dialogVisible = true;
            },
            /**
             * 新增
             */
            add(){
                this.isEdit = false;
                this.title = '新增菜单';
                this.$refs.appPreserveEdit.openDialog(this.appId,this.appCode);
            },
            /**
             * 部门
             * @param row
             */
            deptItem(row){
                console.log('==>row : %o', row);
                this.$refs.appDeptEdit.openDialog(row.oid);
            },
            /**
             * 设为默认
             * @param row
             */
            defaultItem(row){
                this.$axios.post("/permission/res/app/outer/save/set_default",{menulistId:row.oid}).then(success=>{
                    this.$message.success("设置成功");
                    this.refresh();
                }).catch(error=>{
                    this.$message.error(error.msg);
                })
            },
            /**
             * 启用或停用
             * @param row
             */
            enabledOrDisabled(row){
                let isEnabled = false;
                if(row.isEnabled == 'N'){
                    isEnabled = true;
                }
                this.$axios.post("/permission/res/app/outer/save/set_menu_enabled",{menulistId :row.oid,enabled:isEnabled,version:row.version}).then(success=>{
                    /*this.$message.success("操作成功");*/
                    this.refresh();
                }).catch(error=>{
                    this.$message.error(error.msg ? error.msg : '操作出错了');
                })
            },
            /**
             * 菜单
             * @param row
             */
            appItem(row){
                this.$refs.appPreserveMoreEdit.openDialog(row.oid,this.appId,this.appCode);
            },
            /**
             * 编辑
             * @param row
             */
            editPageFuncItem(row){
                this.isEdit = true;
                this.title = '菜单维护';
                let obj = {};
                Object.assign(obj,row);
                this.$refs.appPreserveEdit.openDialog();
                this.$nextTick(()=>{
                    this.appPreserveEditData = obj
                });
            },
            /**
             * 删除
             * @param row
             */
            deleteItem(row){
                this.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.delete("/permission/res/app/outer/delete/menulist_byid",{params:{menulistId:row.oid}}).then(success=>{
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(error=>{
                        this.$message.error(error.msg ? error.msg : '操作出错了');
                    });
                });
            },
            /**
             * 刷新
             */
            refresh(){
                this.$refs.grid.refresh();
            },
        },
        mounted(){
            this.initComponent();
        }
    }
</script>

<style scoped>

</style>
