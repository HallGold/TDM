<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%;height: 100%;">
        <ice-query-grid data-url="/biz/bizEmpAuthorized/list"
                        ref="grid"
                        :query="query"
                        :columns="columns"
                        :buttons="buttons"
                        :operations="operations">
        </ice-query-grid>
        <ice-dialog :visible.sync="visibleDialog" width="600px" :title="title">
            <el-form :model="mainData" :rules="formRules" label-width="100px" ref="form">

                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="角色" prop="roleCode">
                            <ice-select v-model="mainData.roleCode"
                                        map-type-code="Role_Type"
                                        :text.sync="mainData.roleName"></ice-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="权限" prop="authorized">
                            <el-input v-model="mainData.authorized" maxlength="30"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="30">
                    <el-col :span="24">
                        <el-form-item label="系统/服务器" prop="systemName">
                            <el-input v-model="mainData.systemName"
                                      readonly>
                                <el-button slot="append"
                                           title="点我选择"
                                           icon="el-icon-edit-outline"
                                           @click="chooseSys"></el-button>
                            </el-input>
                            <dev-select ref="devSelect"
                                        v-if="devSelectShow"
                                        :columns="columnsDev"
                                        width="900px"
                                        :on-close-handler="selectOverHandler"></dev-select>
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
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import IceSelect from "../../../../components/common/base/IceSelect";
    import DevSelect from "../../dev/devSelect";
    export default {
        name: "empBaseMaintain",
        components: {DevSelect, IceSelect, IceDialog, IceQueryGrid},
        data(){
            return{
                query:[],
                columns:[],
                buttons:[],
                operations:[],
                title:'',
                visibleDialog:false,
                mainData:{//表单字段
                    roleName:'',
                    roleCode:'',
                    systemName:'',
                    authorized:'',
                    systemCode:'',
                },
                formRules:{//表单字段规则
                    roleCode:[{required:true,message:'请选择角色',trigger:'change'}],
                    systemCode:[{required:true,message:'请选择系统/服务器',trigger:'change'}],
                    authorized:[{required:true,whitespace:true,message:'请填写权限',trigger:'blur'}],
                },
                devSelectShow:false,
                columnsDev:[],
            }
        },
        methods:{
            /**
             * 初始化组件
             */
            initTemplate(){
                this.query = [
                    {label:'角色',type:'input',value:'',exp:'=',code:'roleName'},
                    {label:'系统/服务器',type:'input',value:'',exp:'=',code:'systemName'},
                    {label:'权限',type:'input',value:'',exp:'=',code:'authorized'},
                ];
                this.columns = [
                    {code:'oid',hidden:true},
                    {code:'roleCode',hidden:true},
                    {code:'systemCode',hidden:true},
                    {label:'角色',code:'roleName',width:260},
                    {label:'系统/服务器',code:'systemName',width:300},
                    {label:'权限',code:'authorized',width:260}
                ];
                this.buttons = [
                    {name:'新增',callback:this.addItem},
                ];
                this.operations = [
                    {name:'编辑',callback:this.updateItem},
                    {name:'删除',callback:this.deleteItem},
                ];
                this.columnsDev = [
                    {code: 'devId', hidden: true},
                    {code: 'oid', hidden: true},
                    {code: 'dependType', hidden: true},
                    {code: 'code', hidden: true},
                    {
                        label: '系统名称', code: 'name', renderCell(h, data) {
                            return data.row.name;
                        }, width: 150
                    },
                ]
            },
            selectOverHandler(data){
                return new Promise((resolve, reject) => {
                    if(data.length!==0){
                        this.mainData.systemName = data[0].name;
                        this.mainData.systemCode = data[0].oid;
                    }
                    this.$nextTick(() => {
                        resolve();
                        this.devSelectShow = false;
                    });
                })
            },
            chooseSys(){
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            /**
             * 修改
             * @param row
             */
            updateItem(row){
                this.mainData = Object.assign({},row);
                this.title = '编辑';
                this.visibleDialog = true;
            },
            /**
             * 删除
             * @param row
             */
            deleteItem(row){
                this.$confirm('确定要删除吗', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(()=>{
                    this.$axios.delete("/biz/bizEmpAuthorized/del",{params:{id:row.oid}}).then(res=>{
                        this.$message.success("删除成功");
                        this.refresh();
                    }).catch(e=>{
                        this.$message.error(e.msg);
                    })
                })
            },
            /**
             * 新增
             */
            addItem(){
                this.title = '新增';
                this.visibleDialog = true;
            },
            /**
             * 取消
             */
            closeDialog(){
                this.resetForm();
                this.visibleDialog = false;
            },
            /**
             * 保存
             */
            save(){
                this.$refs.form.validate((valid)=>{
                    if(valid){
                        this.$axios.post("/biz/bizEmpAuthorized/saveOrUpdate",this.mainData).then(res=>{
                            this.$message.success("保存成功");
                            this.closeDialog();
                            this.refresh();
                        }).catch(e=>{
                            this.$message.error(e.msg);
                        });
                    }
                });
            },
            refresh(){
                this.$refs.grid.refresh();
            },
            resetForm(){
                this.$refs.form.resetFields();
            }
        },
        mounted() {
            this.initTemplate();
            console.log(this.$userInfo);
        }
    }
</script>

<style scoped>

</style>