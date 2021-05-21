<template>
    <div  style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <ice-dialog title="指定岗位"
                    :visible.sync="dialogVisiblec"
                    width="800px">
            <div class="ice-container">
                <el-form :model="mainDataFormc"  :rules="formRules" label-position="right" class="conditon-bar" ref="positionForm">
                    <ice-grid-layout name="预置角色岗位规则信息" :columns="1" gutter="0px" :expandable="false">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="组织" label-width="100px" prop="organizationName">
                                    <el-select placeholder="组织" v-model="mainDataFormc.organizationName"  @input="onOrgChange">
                                        <el-option v-for="(item,index) in orgType"
                                                   :key="index"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组织CODE" label-width="100px" prop="organizationId">
                                    <el-input v-model="mainDataFormc.organizationLable" :disabled="readOnlyOrganizationId"></el-input>
                                    <el-select placeholder="组织" v-model="mainDataFormc.organizationLable" v-if="specialDeptChoosed" @input="onDeptChange">
                                        <el-option v-for="item in specialDeptType"
                                                   :key="item.value"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="岗位线" label-width="100px" prop="lineName">
                                    <el-select placeholder="岗位线" v-model="mainDataFormc.lineName"  @input="onLineChange">
                                        <el-option v-for="(item,index) in lineType"
                                                   :key="index"
                                                   :label="item.name"
                                                   :value="item.code">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="岗位线CODE" label-width="100px" prop="lineId">
                                    <el-input v-model="mainDataFormc.lineId"  :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="岗位" label-width="100px" prop="positionName">
                                    <el-select placeholder="请选择"  v-model="mainDataFormc.positionName"  @input="onPositionChange">
                                        <el-option v-for="(item,index) in positionType"
                                                   :key="index"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="岗位CODE" label-width="100px" prop="positionId">
                                    <el-input v-model="mainDataFormc.positionLable" :disabled="readOnlyPositionId" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :sapn="12">
                                <el-form-item label="为空查询上级" label-width="100px" prop="autoParentPosition">
                                    <el-checkbox v-model="mainDataFormc.autoLeader">{{mainDataFormc.autoLeader?"是":"否"}}</el-checkbox>
                                    <span style="color: red">当目标组织及岗位下人员为空时  查询上级目标岗位</span>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="查询上级规则" label-width="100px" prop="autoParentPositionType">
                                    <el-select placeholder="请选择" v-model="mainDataFormc.type" >
                                        <el-option v-for="(item,index) in optionsC"
                                                   :key="index"
                                                   :label="item.label"
                                                   :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </ice-grid-layout>
                </el-form>
            </div>
            <div class="ice-button-bar " slot="footer" v-if="editData?false:true">
                <el-button type="primary"  @click="savec">确认</el-button>
                <el-button type="info" @click="retc">返回</el-button>
            </div>
        </ice-dialog>

        <ice-dept-selector  label="选择组织"
                            title="请选择"
                            code-prop="code"
                            mode="hidden"
                            choose-item="multiple" ref="selectOrg"
                            @select-confirm="selectOrgConfirm" ></ice-dept-selector>


        <ice-pop-selector style="box-sizing: border-box"
                          label=""
                          title="请选择岗位"
                          text-prop="name"
                          :pagination="false"
                          chooseItem="single"
                          code-prop="code"
                          mode="hidden"
                          :query="queryPosition"
                          :columns="columnsPosition"
                          data-url="/permission/work_position/list"  ref="selectPosition"
                          @select-confirm="selectPositionConfirm">
        </ice-pop-selector>


    </div>
</template>

<script>
    import IceGridLayout from '../../../components/common/base/IceGridLayout.vue';
    import IceDeptSelector from "@/components/common/biz/IceDeptSelector.vue";
    import IcePopSelector from "@/components/common/base/IcePopSelector";
    export default {
        name: "ExtPosition",
        components: {IceGridLayout,IceDeptSelector,IcePopSelector},
        props:{
            editData:{
                type: Object
            }
        },
        data(){
            return{
                mainDataFormc: {
                    type:"",
                    positionId:'',
                    positionLable:'',
                    positionName:'',
                    organizationId:'',
                    organizationLable:'',
                    organizationName:'',
                    lineId:"",
                    lineLable:"",
                    autoLeader:true,
                    leaderOrgType:[]
                },
                readOnlyOrganizationId:true,
                readOnlyPositionId:true,
                orgSelet:"",  lineSelet:"", positionSelet:"",
                dialogVisiblec:false,
                orgType:[
                    {label:"申请人组织",value:"{applierOrganization}"},
                    {label:"发起人组织",value:"{currentOrganization}"},
                    {label:"变量:特定组织",value:"{specialOrganization}"},
                    {label:"变量:特定部门",value:"{specialDeptName}"},
                    {label:"指定:指定组织",value:"6"}],
                lineType:[],
                positionType:[/*{label:"组织负责人岗",value:"[1]"},*/{label:"变量:特定岗位",value:"{specialPosition}"},{label:"指定:指定岗位",value:"[2]"}],
                optionsC:[{label:"精准查找",value:"10"},{label:"组织机构",value:"20"}],
                 queryPosition:[
                     {type: 'input', label: '岗位名称', code: 'name', value: ''},
                     {type: 'input', label: '类型编码', code: 'code', value: ''}
                 ],
                columnsPosition: [
                {code:"oid",hidden:true},
                {label: '类型编码', code: 'code', width: 120},
                {label: '岗位名称', code: 'name', width: 120},
                {label: '描述', code: 'desp', width: 120}
               ],
                formRules: {
                    organizationName: [{required: true, message: '请选择组织', trigger: 'change'}],
                    organizationId: [{required: true,trigger: 'change',message: '请左边选择组织'}],
                    positionName: [{required: true, message: '请选择岗位', trigger: 'change'}],
                    positionId: [{required: true, message: '请左边选择岗位', trigger: 'change'}]
                },
                specialDeptType:[
                    {label:"变量:信息管理部门",value:"{infoDepartment}"},
                    {label:"变量:设备管理部门",value:"{devManageDepartment}"},
                    {label:"变量:保密管理部门",value:"{secrecyManageDepartment}"},
                    {label:"变量:运维责任单位",value:"{maintainOrganization}"},
                    {label:"变量:人员资格审查部门",value:"{hrQualifyCheckDept}"},
                    {label:"变量:委托运维责任单位",value:"{entrustMaintainResUnit}"},
                    {label:"变量:委托信息管理部门",value:"{entrustInfoManageDept}"},
                    {label:"变量:委托设备管理部门",value:"{entrustDevManageDept}"},
                    {label:"变量:委托保密管理部门",value:"{entrustSecrecyManageDept}"},
                    {label:"变量:委托人员资格审查部门",value:"{entrustHrQualifyCheckDept}"},
                ],
                specialDeptChoosed:false,
            }
        },
        methods:{
            /**清除表单验证*/
            resetForm(){
                if(this.$refs.positionForm){
                    this.$refs.positionForm.resetFields();
                }
            },
            edit(){
                if(this.editData){
                    this.resetForm();
                    Object.assign(this.mainDataFormc,this.editData);
                    if(!this.mainDataFormc.positionLable){
                        this.mainDataFormc.positionLable=this.mainDataFormc.positionId;
                    }
                    if(!this.mainDataFormc.organizationLable){
                        this.mainDataFormc.organizationLable=this.mainDataFormc.organizationId;
                    }
                }
            },
            clean(){
                this.resetForm();
                this.mainDataFormc.positionId='';
                this.mainDataFormc.positionName='';
                this.mainDataFormc.positionLable='';
                this.mainDataFormc.autoLeader=true;
                this.mainDataFormc.leaderOrgType=[];

                this.mainDataFormc.lineId='';
                this.mainDataFormc.lineName='';
                this.mainDataFormc.organizationId='';
                this.mainDataFormc.organizationLable='';
                this.mainDataFormc.organizationName='';

                this.positionSelet="";
                this.lineSelet="";
                this.orgSelet="";
                if(!this.lineType||this.lineType.length<=1){
                    this.getOnLineTypeData();
                }
            },
            onOrgChange(val){
               // this.lineType =[];
                this.mainDataFormc.organizationId=val;
                this.mainDataFormc.organizationLable=val;
                if(val=="{specialOrganization}"){
                    this.readOnlyOrganizationId=false;
                }else{
                    this.readOnlyOrganizationId=true;
                }
                if(val=="6"){
                    this.mainDataFormc.organizationId="";
                    this.$refs.selectOrg.openDialog();
                }
                if(val=="{specialDeptName}"){
                    this.mainDataFormc.organizationId=this.specialDeptType[0].value;
                    this.mainDataFormc.organizationLable=this.specialDeptType[0].value;
                    this.specialDeptChoosed = true;
                }else{
                    this.specialDeptChoosed = false;
                }
            },
            onPositionChange(val){
                this.mainDataFormc.positionId=val;
                this.mainDataFormc.positionLable=val;
                if(val=="{specialPosition}"){
                    this.readOnlyPositionId=false;
                }else{
                    this.readOnlyPositionId=true;
                }
                if(val=="[2]"){
                    this.mainDataFormc.positionId="";
                    this.$refs.selectPosition.openDialog();
                }
            },
            onLineChange(val){
                this.mainDataFormc.lineId=val;
            },
            getOnLineTypeData(){
                this.$axios.get("/permission/work_position_type/list", {
                }).then(result => {
                    this.lineType = result.data;
                });
            },
            selectOrgConfirm(rows){
                let deptCode="",deptName="";
                rows.forEach(item=>{
                    deptCode+=","+item.deptCode;
                    deptName+=","+item.deptName;
                })
                this.mainDataFormc.organizationLable=deptName.substr(1)+"("+deptCode.substr(1)+")";
                this.mainDataFormc.organizationId=deptCode.substr(1);
                this.$refs.selectOrg.cleanColumnSelect();

                //this.getOnLineTypeData();//加载岗位线
            },
            selectPositionConfirm(rows){
                let deptCode="",deptName="";
                rows.forEach(item=>{
                    deptCode+=","+item.code;
                    deptName+=","+item.name;
                })
                this.mainDataFormc.positionLable=deptName.substr(1)+"("+deptCode.substr(1)+")";
                this.mainDataFormc.positionId=deptCode.substr(1);
                this.$refs.selectPosition.cleanColumnSelect();
            },
            savec(){
                this.$refs['positionForm'].validate((valid) => {
                    if (valid) {
                        this.dialogVisiblec=false;
                        if(this.mainDataFormc.organizationId=="{specialOrganization}"){
                            this.mainDataFormc.organizationId=this.mainDataFormc.organizationLable;
                            this.mainDataFormc.organizationName=this.mainDataFormc.organizationLable;
                        }
                        if(this.mainDataFormc.positionId=="{specialPosition}"){
                            this.mainDataFormc.positionId=this.mainDataFormc.positionLable;
                            this.mainDataFormc.positionName=this.mainDataFormc.positionLable;
                        }
                        if(this.mainDataFormc.organizationName=="{specialDeptName}"){
                            this.mainDataFormc.organizationName=this.mainDataFormc.organizationLable;
                        }
                        this.$emit("set-ext-position",{...this.mainDataFormc});
                    }
                })
            },
            retc(){
                this.dialogVisiblec=false;
            },
            onDeptChange(val){
                this.mainDataFormc.organizationId=val;
                this.mainDataFormc.organizationLable=val;
            }
        },
        mounted() {
            // 在这里你想初始化的时候展开哪一行都可以了
            this.getOnLineTypeData();
        }
    }
</script>

<style scoped>

</style>
