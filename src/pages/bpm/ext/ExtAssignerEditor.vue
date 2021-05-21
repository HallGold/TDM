<template>
    <div  style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-dialog title="编辑主页"
                    :visible.sync="dialogVisiblem"
                    width="800px">
            <div class="ice-container">
                <el-form :model="mainDataForm" label-position="right" ref="form">
                    <ice-grid-layout name="预置角色规则信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="是否表单显示" label-width="100px" prop="visible">
                                    <el-checkbox v-model="mainDataForm.visible">{{mainDataForm.visible?"是":"否"}}</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="是否必须" label-width="100px" prop="required">
                                    <el-checkbox v-model="mainDataForm.required">{{mainDataForm.required?"是":"否"}}</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <!--   <el-col :span="8">
                                   <el-form-item label="使用人员上级" label-width="100px" prop="autoPersonLeader">
                                       <el-checkbox v-model="mainDataForm.autoPersonLeader">{{mainDataForm.autoPersonLeader?"是":"否"}}</el-checkbox>
                                   </el-form-item>
                               </el-col>-->
                            <el-col :span="8">
                                <el-form-item label="是否允许多人" label-width="100px" prop="multiple">
                                    <el-checkbox v-model="mainDataForm.multiple">{{mainDataForm.multiple?"是":"否"}}</el-checkbox>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="8">
                                <el-form-item label="允许用户修改" label-width="100px" prop="modifiable">
                                    <el-checkbox v-model="mainDataForm.modifiable">{{mainDataForm.modifiable?"是":"否"}}</el-checkbox>
                                </el-form-item>
                            </el-col>
                            <el-col :span="8">
                                <el-form-item label="默认显示人数" label-width="100px" prop="defaultShow">
                                    <el-input placeholder="默认显示人数" v-model="mainDataForm.defaultShow"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
                <div class="ice-button-bar" slot="footer">
                    <el-button type="primary" @click="openExtPerson">指定人员</el-button>
                    <!--<el-button type="primary" @click="openExtOrganization">指定组织岗位</el-button>-->
                    <el-button type="primary" @click="openExtPosition">指定组织岗位</el-button>
                   <!-- <el-button type="primary" @click="openExtRole">指定角色</el-button>-->
                    <el-button type="primary" @click="openClean">清除表达式</el-button>
                </div>
               <!-- <el-row :gutter="60" style="margin-top: 5px">
                    <el-col :span="24">
                        <el-input placeholder="预览表达式" v-model="showRoleText" type="textarea" :rows="3"></el-input>
                    </el-col>
                </el-row>-->
                <div style="height: 250px;">
                    <el-table :data="mainDataForm.nodeAssigners"
                              style="width: 100%" height="250px">
                        <el-table-column
                                prop="personId"
                                label="人员"
                                width="150">
                        </el-table-column>
                        <ice-table-column
                                :showTips="true"
                                prop="organizationLable"
                                label="组织"
                                width="150">
                        </ice-table-column>
                        <el-table-column
                                prop="lineName"
                                label="岗位线"
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="positionLable"
                                label="岗位">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                width="100">
                            <template slot-scope="scope">
                                <el-button @click="delClick(scope.$index)" type="text" size="small">删除</el-button>
                                <el-button @click="editClick(scope.$index)"  type="text" size="small">查看</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
            <div class="ice-button-bar ">
                <el-button type="primary" size="medium" @click="save">确认</el-button>
                <el-button type="info" size="medium" @click="ret">返回</el-button>
            </div>
        </ice-dialog>

        <ExtOrganization :edit-data="editData" @set-ext-organization="setNodeAssigner" ref="org"></ExtOrganization> <!--/*指定组织*/-->
        <ExtRole :edit-data="editData" @set-ext-role="setNodeAssigner"  ref="role"></ExtRole>                  <!--  /*指定角色*/-->
        <ExtPosition :edit-data="editData" @set-ext-position="setNodeAssigner" ref="position"></ExtPosition>     <!--       /*指定岗位*/-->
        <ExtPerson :edit-data="editData" @set-ext-person="setNodeAssigner"  ref="person"></ExtPerson>           <!--     /*指定人员*/-->
    </div>
</template>

<script>
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue';
    import ExtOrganization from "./ExtOrganization";
    import ExtRole from "./ExtRole";
    import ExtPosition from "./ExtPosition";
    import ExtPerson from "./ExtPerson";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";

    export default {
        name: "ExtAssignerEditor",
        components: {IceTableColumn, ExtPerson, ExtPosition, ExtRole,ExtOrganization,IceGridLayout},
        props:{
            data:{
                type: String,
                default:""
            }
        },
        data(){
            return{
                dialogVisiblem:false,
                showRoleText:"",
                editData:{},
                mainDataForm:{
                   assignerId:'',
                   assignerName:'',
                    visible:true,
                    required:true,
                    autoPersonLeader:false,
                    multiple:false,
                    defaultShow:1,
                    modifiable:false,
                    nodeAssigners:[]
                }
            }
        },
        watch:{
            mainDataForm:{
                handler(newName, oldName) {
                    this.showRoleText=JSON.stringify(newName);
                },
                deep: true
            }
        },
        methods:{
            init(){
                if(this.data){
                    this.mainDataForm=JSON.parse(this.data);
                    if(this.mainDataForm.nodeAssigners){
                        this.mainDataForm.nodeAssigners.forEach(item=>{
                            if(!item.positionLable){
                                item.positionLable=item.positionId;
                            }
                            if(!item.organizationLable){
                                item.organizationLable=item.organizationId;
                            }
                        })
                    }
                }else{
                    this.cleanEditor();
                }
            },
            cleanMainDataForm(){
                this.mainDataForm={
                    userType:'',
                    visible:true,
                    required:true,
                    autoPersonLeader:false,
                    multiple:false,
                    defaultShow:1,
                    modifiable:false,
                    nodeAssigners:[]
                };
            },
            delClick(idx){
                this.mainDataForm.nodeAssigners.splice(idx,1);
            },
            editClick(idx){
                let obj=this.mainDataForm.nodeAssigners[idx];
               this.editData={};
                Object.assign(this.editData,obj);
                if(obj.personId){
                    this.$refs.person.dialogVisibled=true;
                    this.$nextTick(() => {
                        this.$refs.person.edit();
                    });
                }
                if(obj.organizationId){
                    this.$refs.position.dialogVisiblec=true;
                    this.$nextTick(() => {
                        this.$refs.position.edit();
                    });
                }
                if(obj.roleId){
                    this.$refs.role.dialogVisibleb=true;
                    this.$nextTick(() => {
                        this.$refs.role.edit();
                    });
                }
            },
            cleanEditor(){
                this.cleanMainDataForm();
                this.$refs.role.clean();
                this.$refs.position.clean();
                this.$refs.person.clean();
            },
            save(){
                this.dialogVisiblem=false;
                this.$emit("set-conf",this.mainDataForm);
            },
            ret(){
                this.dialogVisiblem=false;
            },
            setNodeAssigner(data){
                if(data.length>0){
                    data.forEach(item=>{
                        if(!item.positionLable){
                            item.positionLable=item.positionId;
                        }
                        if(!item.organizationLable){
                            item.organizationLable=item.organizationId;
                        }
                    })
                }
                this.mainDataForm.nodeAssigners.push(data);
                this.showRoleText+=JSON.stringify(this.mainDataForm.nodeAssigners);
            },
            openExtOrganization(){
                this.$refs.org.dialogVisiblea=true;
            },
            openExtRole(){
                this.editData=null;
                this.$refs.role.dialogVisibleb=true;
                this.$nextTick(() => {
                    this.$refs.role.clean();
                });
            },
            openExtPosition(){
                this.editData=null;
                this.$refs.position.dialogVisiblec=true;
                this.$nextTick(() => {
                    this.$refs.position.clean();
                });
            },
            openExtPerson(){
                this.editData=null;
                this.$refs.person.dialogVisibled=true;
                this.$nextTick(() => {
                    this.$refs.person.clean();
                });
            },
            openClean(){
                /*this.cleanMainDataForm();*/
                this.cleanEditor();
                this.showRoleText='';
            }
        }
    }
</script>

<style scoped>

</style>
