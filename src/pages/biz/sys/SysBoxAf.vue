<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow"  :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rules" ref="bizForm" label-width="140px">

                    <ice-grid-layout :columns="3" name="填单人信息" :defaultExpanded="false">
                        <el-form-item label="单号" label-width="100px" prop="afPhone">
                            <el-input v-model="mainData.afNo" disabled placeholder="单号"></el-input>
                        </el-form-item>
                        <el-form-item label="申请人" label-width="100px" prop="afUserName">
                            <el-input v-model="mainData.afUserName" disabled placeholder="申请人"></el-input>
                        </el-form-item>
                        <el-form-item label="部门" label-width="100px" prop="afDepartmentName">
                            <el-input disabled placeholder="部门"
                                      v-model="mainData.afOrgName+'-'+mainData.afDepartmentName"></el-input>
                        </el-form-item>
                        <el-form-item label="电话" label-width="100px" prop="afPhone">
                            <el-input v-model="mainData.afPhone"  placeholder="电话" :disabled="flowScope.formReadonly" ></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="3" name="反馈信息">

                        <el-form-item label="类型" label-width="100px" prop="type" >
                            <ice-select placeholder="请选择" v-model="mainData.type" mapTypeCode="SYS_TYPE" disabled></ice-select>
                        </el-form-item>
                        <el-form-item label="反馈项目" label-width="100px" prop="sysType">
                            <ice-select placeholder="请选择" v-model="mainData.sysType" mapTypeCode="sys_type_" :disabled="flowScope.formReadonly"></ice-select>
                        </el-form-item>


                        <el-form-item label="主题" label-width="100px" prop="complaintTitle"  layout="3">
                            <el-input v-model="mainData.complaintTitle"
                                      maxlength="60":disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="内容" label-width="100px" prop="complaintContent" layout="3">
                            <el-input type="textarea" rows="6" v-model="mainData.complaintContent"
                                      maxlength="500":disabled="flowScope.formReadonly" ></el-input>
                        </el-form-item>
                        <el-form-item label="附件" label-width="100px" prop="accessory" layout="3" >
                            <ice-single-upload :on-success="success" styleType="input"  v-model="mainData.accessoryId" :disabled="flowScope.formReadonly">
                            </ice-single-upload>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="3" v-if="showReply" name="调度协调">
                        <el-form-item label="送处理"  label-width="100px" prop="myLeader" >
                            <ice-select placeholder="请选择" v-model="mainData.myLeader" mapTypeCode="leader_type"
                                        :disabled="!showSelectReplyDept"  @change="myLeaderChange"></ice-select>
                        </el-form-item>
                        <!--<el-form-item label="主管部门协调"  v-if="showLeader" l label-width="100px" prop="leader" >
                            <ice-select placeholder="请选择" v-model="mainData.leader" mapTypeCode="YES_NO"
                                        :disabled="showBiz" @change="myLeaderChange" ></ice-select>
                        </el-form-item>-->

                        <el-form-item label="业务回复人员" label-width="110px" prop="replyDept" layout="2">
                            <ice-persion-selector title="请选择"
                                                  code-prop="code"
                                                  :mode="selectDeptMode"
                                                  v-model="mainData.replyDept"
                                                  :allDept="allDept"
                                                  :disabled="!flowScope.isAuthor"
                                                  choose-item="multiple" ref="selectOrg"
                                                  @select-confirm="selectConfirm" ></ice-persion-selector>
                            <!--<ice-dept-selector  ></ice-dept-selector>-->
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" v-if="showPublished" name="是否发布">
                        <el-form-item label="发布" label-width="100px" prop="ispublished" >
                            <ice-select placeholder="请选择" v-model="mainData.ispublished" mapTypeCode="YES_NO"
                                        :disabled="!flowScope.isAuthor" ></ice-select>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" v-if="showBiz" name="回复信息">
                        <!--<el-form-item label="答复时间" label-width="100px" prop="replyDate" >
                            <el-input disabled v-model="mainData.replyDate" placeholder="选择日期"></el-input>
                        </el-form-item>-->
                        <!--<el-form-item label="处理意见" label-width="100px" prop="replyContent" layout="2">
                            <el-input type="textarea" rows="6" :disabled="!flowScope.isAuthor"  v-model="mainData.replyContent"></el-input>
                        </el-form-item>-->
                                <ice-query-grid
                                        :pagination="false"
                                        :operations="operations"
                                        :buttons="buttons"
                                        :data-url="dataUrl"
                                        :columns="columns"
                                        :query="defaultQuery" ref="grid">
                                </ice-query-grid>
                    </ice-grid-layout>


                    <el-dialog v-dialogDrag :title="dialogTittle" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                               width="50%" append-to-body :close-on-click-modal="false">
                        <div class="grid-container">
                            <el-form :model="dialogForm" :rules="dialogRules" label-position="right" class="conditon-bar" ref="form"
                                     style="margin-top: 20px">
                                <el-form-item  prop="aclType">
                                    <el-input type="textarea" placeholder="请输入处理意见" rows="6" maxlength="500" v-model="dialogForm.context"></el-input>
                                </el-form-item>
                            </el-form>
                            <div class="dialog-footer ice-button-bar">
                                <el-button type="primary" @click="saveDialog">确 定</el-button>
                                <el-button type="info" @click="closeDialog">取 消</el-button>
                            </div>
                        </div>
                    </el-dialog>

                </el-form>
            </div>
        </ice-flow-form>
        <ice-datamap-translater style="display: none" map-type-code="SYS_TYPE" :value="mainData.type" :text.sync="typeText">
        </ice-datamap-translater>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout.vue";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector.vue";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import common from '@/utils/common.js';
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    import IceSelect from "../../../components/common/base/IceSelect";
    import IceDatamapTranslater from "../../../components/common/base/IceDatamapTranslater";
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";


    export default {
        name: "blackListAf",
        data() {
            let type = this.$route.query['type'];
            return {
                selectDeptMode:'readonly',
                allDept:false,
                showReply:false,
                showSelectReplyDept:false,
                showSelectReplyDeptNode:["node2","EndEvent"],
                selectReplyDeptNode:["node2","node3","node"],
                showMyLeaderNode:["node2","node","node4","node5","EndEvent"],
                showBiz:false,
                showBizNode:["node4","node5","EndEvent","YWBMLD","EndEvent"],
                showPublished:false,
                showPublishedNode:["node5","EndEvent"],
                publishedUserNode:["node2","node3","node"],
                typeText:'',
                isAdmin:false,
                mainData: {
                    accessory:"",
                    accessoryId:"",
                    complaintTitle:"",
                    afDate:"",
                    replyDate:"",
                    replyDept:"",
                    replyDeptCode:"",
                    complaintContent:"",
                    replyContent:"",
                    myLeader:"0",
                    leader:"0",
                    ispublished:"0",
                    sysType:"",
                    type:type
                },
                rules: {
                    complaintTitle: [{required: true,message:"请输入主题"}],
                    complaintContent: [{required: true,message:"请输入内容"}],
                    sysType: [{required: true,message:"请选择反馈项目"}],
                    replyDept:[{required: true,message:"请选择答复部门"}]
                },
                dialogForm:{context:""},
                dialogRules:{replyContent: [{required: true,message:"请输入意见"}]},
                dataUrl:"",
                dialogTittle:"",
                defaultQuery: [],
                dialogVisible:false,
                isAuth:false,
                columns: [
                    {code: 'oid', hidden: true},
                    {code: 'userCode', hidden: true},
                    {label: '处理人', code: 'userName', width: 250},
                    {label: '处理意见', code: 'context'},
                    {label: '处理时间', code: 'createDate', width: 150}
                ],
                operations: [
                    {name: '删除', callback: this.deleteItem, isShow:(row)=>{
                            let del=(row.userCode === this.$userInfo.userCode)&&this.isAuth;
                            return del||this.isAdmin;
                        }
                    },
                    {
                        name: '编辑', callback: (row) => {
                            let objMain = {};
                            Object.assign(objMain, row);
                            this.dialogForm = objMain;
                            this.dialogVisible=true;
                            this.tittle='编辑处理意见'
                        }, isShow:(row)=>{
                            let del=(row.userCode === this.$userInfo.userCode)&&this.isAuth;
                            return del||this.isAdmin;
                        }
                    }
                ],
                buttons: []
            }
        },
        methods: {
            saveDialog(){
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let obj =this.dialogForm;
                        obj.afId=this.mainData.afNo;
                        obj.afName=this.mainData.complaintTitle;

                        this.$axios.post('/biz/BoxReply/saveOrUpdate', obj).then(result => {
                            this.$message.success("成功");
                            this.dialogVisible = false;
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message.error(error.msg)
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            deleteItem(row) {
                this.$confirm('确定删除操作吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    this.$axios.delete('/biz/BoxReply/del', {params: {id: row.oid}}).then(result => {
                        this.$message.success("删除成功")
                        this.$refs.grid.refresh();
                    }).catch(error => {
                        this.$message.error(error.msg)
                    })
                });
            },
            closeDialog() {
                this.dialogVisible = false;
            },
            success(response, file, fileList) {
                this.mainData.accessory = file.name;
                this.mainData.accessoryId = response.data;
            },
            flowReady(flowContext, bizdata) {
                this.isAuth=flowContext.getIsAuthor()&&flowContext.nodeId=="node4";
                if(this.isAuth||this.isAdmin){
                    this.buttons=[
                        {name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                                this.dialogForm={};
                                this.dialogVisible=true;
                                this.dialogTittle='添加处理意见'
                            }
                        }
                    ];
                }
                Object.assign(this.mainData,bizdata);
                if(this.typeText){
                    flowContext.actDefName=this.typeText;
                }
                if(flowContext.nodeId!="FirstNode"){
                    this.showReply=true;
                }
                if(flowContext.nodeId=="node3"&&flowContext.getIsAuthor()){
                    this.allDept=true;
                }

                if(this.showSelectReplyDeptNode.indexOf(flowContext.nodeId)!=-1&&flowContext.getIsAuthor()){
                    this.showSelectReplyDept=true;
                }
                if(this.isShow(flowContext,this.showPublishedNode,flowContext.getIsAuthor())){//显示是否发布
                    this.showPublished=true;
                }
                if(this.showBizNode.indexOf(flowContext.nodeId)!=-1){//显示回复
                    this.showBiz=true;
                    this.defaultQuery=[{type: 'static', label: '表单id', code: 'afId',exp:"=",value:bizdata.afNo}];
                    this.dataUrl="/biz/BoxReply/list";
                }
                if(this.isShow(flowContext,this.selectReplyDeptNode,flowContext.getIsAuthor())){
                    this.rules["replyDept"]=[{required: true,message:"请选择答复部门"}];
                    this.selectDeptMode="input";
                }
            },
            isShow(flowContext,nodes,isAuthor){
                if((nodes.indexOf(flowContext.nodeId)!=-1&&isAuthor)){
                    return true;
                }
                return false;
            },
            flowOperateBtn(flowContext, bizdata) {
                let isTrue=false;
                this.$refs['bizForm'].validate((valid) => {
                    isTrue = valid;
                });
                //发布确认人
                if(flowContext.operateType=="submit"&&this.publishedUserNode.indexOf(flowContext.nodeId)!=-1){
                    this.mainData.publishedUser=this.$userInfo.userCode;
                }
                if(flowContext.operateType=="submit"&&flowContext.nodeId=="node4"){
                   let data=this.$refs.grid.getDataList();
                   let userCode=this.$userInfo.userCode;
                   if(data&&data.length>0){
                       for(let i=0;i<data.length;i++){
                           if(data[i].userCode==userCode){
                               return true;
                           }
                       }
                   }
                    this.$message.error("必须填写回复意见");
                    return false;
                }
                return isTrue;
            },
            flowBizData() {
                return this.mainData;
            },
            myLeaderChange(val){
                if(val=="0"){
                    this.rules["replyDept"]=[{required: true,message:"请选择答复部门"}];
                    this.selectDeptMode="input";
                }else{
                    this.rules["replyDept"]=[{required: false,message:"请选择答复部门"}];
                    this.selectDeptMode="readonly";
                }
            },
            selectConfirm(rows, label) {
                let userCode="",userName="";
                if(rows.length>10){
                    this.$message.error("选择不能多于10个");
                    return false;
                }
                for(let i=0;i<rows.length;i++){
                    userCode+=","+rows[i].code;
                    userName+=","+rows[i].name;
                }
                // debugger
                this.mainData.replyDeptCode=userCode.substr(1);
                this.mainData.replyDept=userName.substr(1);

                let obj = this.$refs.flow.flowInstData.nodeUserSetList.find(item => item.nodeId == "node4");
                if (obj) {
                    obj.assignerId ="";
                    obj.assignerName = "";
                }
            }
        },
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
        },
        components: {
            IceQueryGrid,
            IceDatamapTranslater,
            IceSelect,
            IceDeptSelector,
            IceSingleUpload,
            IceTreeGrid,
            IcePopSelector,
            IceFlowForm,
            IcePersionSelector,
            IceGridLayout
        }
    }

</script>


<style scoped>
    .form-content {
        width: 80%;
        height: 100%;
        flex-grow: 1;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
</style>
