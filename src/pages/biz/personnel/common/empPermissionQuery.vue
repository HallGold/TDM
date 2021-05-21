<template>
    <div class="outer col">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="full-content">
            <el-tab-pane label="个人权限" name="first" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/bizEmpFinalAuth/userAuth"
                                    exportTitle="个人权限导出"
                                    ref="grid"
                                    :query="queryA"
                                    :columns="columns"
                                    :buttons="buttons"></ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="一般人员权限" name="second" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/bizEmpFinalAuth/userAuth"
                                    exportTitle="一般人员权限导出"
                                    :query="queryB"
                                    :columns="columns"
                                    :buttons="buttons"></ice-query-grid>
                </div>
            </el-tab-pane>
            <el-tab-pane label="管理员权限" name="third" class="outer">
                <div class="inner">
                    <ice-query-grid data-url="/biz/bizEmpFinalAuth/userAuth"
                                    exportTitle="管理员权限导出"
                                    :query="queryC"
                                    :columns="columns"
                                    :buttons="buttons"></ice-query-grid>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    
</template>

<script>
    import IceTreeGrid from "../../../../components/common/base/IceTreeGrid";
    import IceQueryGrid from "../../../../components/common/base/IceQueryGrid";
    export default {
        name: "empPermissionQuery",
        components: {IceQueryGrid, IceTreeGrid},
        data(){
            return{
                columns:[],
                buttons:[],
                userCode:'',
                activeName:'first',
                queryA:[
                    {type:'static',code:'userCode',exp:'=',value:()=>{
                            return this.userCode;
                        }}
                ],
                queryB:[
                    {type:'static',code:'roleCode',exp:'=',value:()=>{
                            return '0';
                        }}
                ],
                queryC:[
                    {type:'static',code:'roleCode',exp:'>',value:()=>{
                            return '0';
                        }}
                ],
                queryObj:[
                    {label:'用户姓名',code:'userName',type:'input',value:''},
                    {label:'角色名称',code:'roleName',type:'input',value:''},
                    {label:'系统名称',code:'systemName',type:'input',value:''},
                    {label:'授予的权限',code:'userAuth',type:'input',value:''},
                ]
            }
        },
        methods:{
            initTemplate(){
                this.columns = [
                    {code:'oid',hidden:true},
                    {label:'用户编码',code:'userCode',hidden:true},
                    {label:'角色编码',code:'roleCode',hidden:true},
                    {label:'系统名称code',code:'systemCode',hidden:true},
                    {label:'用户姓名',code:'userName',width:200},
                    {label:'角色名称',code:'roleName',width:260},
                    {label:'系统名称',code:'systemName',width:260},
                    {label:'授予的权限',code:'userAuth',width:200},
                ];
                this.buttons = [
                    {name: '导出', icon: 'el-icon-upload2', type: 'export',selectable:true}
                ];
                this.queryA.push(...this.queryObj);
                this.queryB.push(...this.queryObj);
                this.queryC.push(...this.queryObj);
            },
            refresh(){
                this.$refs.grid.refresh();
            },
            handleClick(){
                this.refresh();
            }
        },
        mounted() {
            this.initTemplate();
            this.userCode = this.$userInfo.userCode;
        }
    }
</script>

<style scoped>
    .outer{
        width: 100%;
        height: 100%;
    }
    .col{
        background: white;
    }
    .inner{
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
    }
</style>