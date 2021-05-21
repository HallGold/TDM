<template>
    <div class="form-content" @valited="">
        <ice-flow-form name valiate ref="flow"  :flowReady="flowReady"
                       :flowOperateBtn="flowOperateBtn" :flowBizData="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rules" ref="bizForm" label-width="140px">

                    <ice-grid-layout :columns="3" name="发起人">
                        <el-form-item label="申请人" prop="afUserName">
                            <el-input v-model="mainData.afUserName" disabled placeholder="申请人"></el-input>
                        </el-form-item>

                        <el-form-item label="部门"  prop="afDepartmentName">
                            <el-input disabled placeholder="部门"
                                      v-model="mainData.afOrgName+'-'+mainData.afDepartmentName"></el-input>
                        </el-form-item>

                        <el-form-item label="电话" prop="afPhone">
                            <el-input v-model="mainData.afPhone" :disabled="isDisabled" placeholder="电话"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="3" name="业务表单">
                        <el-form-item label="发起周期" prop="season">
                            <el-input v-model="mainData.season" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <!--  <el-form-item label="接收单位" prop="responseDept">
                              <ice-pop-selector style="box-sizing: border-box"
                                                text-prop="deptName"
                                                code-prop="deptCode"
                                                :mode="isDisabled?'readonly':'onlySelect'"
                                                v-model="mainData.responseDept"
                                                :columns="orgcolumns"
                                                :pagination="false"
                                                data-url="/permission/frame_org/load_table_next_children?deptCode=90&hasSelf=true&loadDisabled=false"
                                                ref="selectFlow"
                                                @select-confirm="selectConfirm">
                              </ice-pop-selector>
                          </el-form-item>-->
                        <el-form-item label="黑名单文件" prop="accessoryId"  layout="2">
                            <ice-single-upload :on-success="success"  :disabled="isDisabled" styleType="input"
                                               @downloadFile="downloadFile"
                                               v-model="mainData.accessoryId">
                            </ice-single-upload>
                        </el-form-item>

                        <el-form-item label="文件名称" prop="remark" layout="3">
                            <el-input type="text" v-model="mainData.accessory" maxlength="50"
                                      :disabled="isDisabled"></el-input>
                        </el-form-item>

                        <el-form-item label="说明/备注" prop="remark" layout="3">
                            <el-input type="textarea" v-model="mainData.remark" maxlength="200"
                                      :disabled="isDisabled"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="2" name="黑名单接收人员" >
                        <el-form-item label="" layout="2">
                            <ice-query-grid
                                    :buttons="buttons"
                                    chooseItem="multiple"
                                    :data-url="dataUrl"
                                    :columns="columns"
                                    @selection-change="handleSelectionChange"
                                    :query="defaultQuery" ref="grid">
                            </ice-query-grid>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <ice-persion-by-dept-selector style="padding: 0 2%;box-sizing: border-box"
                                      label="审核人"
                                      title="请选择"
                                      text-prop="name"
                                      :allDept="true"
                                      code-prop="code"
                                      mode="hidden"
                                      choose-item="multiple" ref="selectUser"
                                      @select-confirm="selectUserConfirm"
                                      @select-cannel="cancelSelectUser">
        </ice-persion-by-dept-selector>
    </div>
</template>

<script>

    import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
    import IcePopSelector from "../../../components/common/base/IcePopSelector";
    import IceTreeGrid from "../../../components/common/base/IceTreeGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout.vue";
    import IceSingleUpload from "../../../components/common/base/IceSingleUpload";
    import common from '@/utils/common.js';
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IcePersionByDeptSelector from "../../../components/common/biz/IcePersionByDeptSelector";


    export default {
        name: "blackListAf",
        components: {
            IcePersionByDeptSelector,
            IceQueryGrid,
            IceSingleUpload,
            IceTreeGrid,
            IcePopSelector,
            IceFlowForm,
            IceGridLayout
        },
        data() {
            return {
                orgquery: [],
                orgcolumns: [{label: 'oid', code: 'oid', hidden: true},
                    {label: 'deptCode', code: 'deptCode', hidden: true},
                    {label: '部门名称', code: 'deptName', width: 190},
                    {label: '部门简称', code: 'deptShortName', width: 100}
                ],
                isAdmin:false,
                isDisabled:true,
                percent: 0,
                uploading:false,
                mainData: {
                    accessory:"",
                    season:"",
                    releaseTime:"",
                    accessoryId:"",
                    responseDept:"",
                    responseDeptcode:"",
                    remark:"",
                    userName:""
                   },
                dataUrl:"",
                defaultQuery: [],
                elTable:[],
                buttons: [],
                columns: [
                    {code: 'oid', hidden: true},
                    {label: '需下载人员', code: 'userName',align:"left"},
                    {label: '是否下载', code: 'isDownload', width: 100,mapTypeCode:"YES_NO"},
                    // {label: '附件内容', code: 'accessory', width: 140},
                    {label: '下载时间', code: 'downloadDate', width: 150}
                ],
                rules: {
                    accessoryId: [{required: true,message:"请上传黑名单数字证书"}]
                }
            }
        },
        methods: {
            downloadFile(){
                this.$axios.post("/biz/BlacklistAf/download",{"id":this.mainData.oid}).then(success=>{
                    this.$refs.grid.refresh();
                })
            },
            success(response, file, fileList) {
                this.mainData.accessory = file.name;
                this.mainData.accessoryId = response.data;
            },
            flowReady(flowContext, bizdata) {
                Object.assign(this.mainData,bizdata);
                if((flowContext.nodeId=="node1"&&flowContext.getIsAuthor())||this.isAdmin){
                    this.isDisabled=false;
                    this.buttons=[{name: '新增', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                            this.selectUserVisible=true;
                            this.$refs.selectUser.openDialog();
                        }
                    },{name: '删除', icon: 'el-icon-plus', type: 'primary', callback:()=>{
                            this.deleteMore();
                        }
                    }
                    ];
                }
                this.defaultQuery=[{type: 'static', label: '表单id', code: 'afId',exp:"=",
                    value:flowContext.actDefId.indexOf("SZZSHMD")!=-1?bizdata.oid:bizdata.afId}];
                this.dataUrl="/biz/BlacklistDownload/list";
            },
            flowOperateBtn(flowContext, bizdata) {
                let isTrue=false;
                this.$refs['bizForm'].validate((valid) => {
                    isTrue = valid;
                });

                let data=this.$refs.grid.getDataList();
                if(!data||data.length<1){
                    this.$message.error("请设置接收人员");
                    return false;
                }
                return isTrue;
            },
            flowBizData() {
                return this.mainData;
            },
            selectConfirm(rows, label) {
                let userCode="",userName="";
                for(let i=0;i<rows.length;i++){
                    userCode+=","+rows[i].deptCode;
                    userName+=","+rows[i].deptName;
                }
                this.mainData.responseDeptcode=userCode.substr(1);
                this.mainData.responseDept=userName.substr(1);
            },
            cancelSelectUser(){
                this.$refs.selectUser.cleanColumnSelect();
            },
            selectUserConfirm(rows, texts, values) {
                this.selectUserVisible = false;
                let userCode="";
                rows.forEach(item=>{
                    userCode+=","+item.code;
                })
                userCode=userCode.substr(1);
                this.$axios.post('/biz/BlacklistAf/saveNeedDownload', {userCode:userCode,"id":this.mainData.oid}).then(result => {
                    this.$message.success("新增成功");
                    this.$refs.grid.refresh();
                }).catch(error => {
                    this.$message.error("出错啦")
                })
                this.$refs.selectUser.cleanColumnSelect();
            },
            /**列表多选框返回所选择的行信息*/
            handleSelectionChange(rows) {
                this.elTable = rows;
            },
            /**删除*/
            deleteMore() {
                if(this.elTable.length<1){
                    this.$message.error("请选择数据");
                    return;
                }
                this.$confirm('确定要删除吗？删除后不可恢复，请谨慎操作！！！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'info'
                }).then(() => {
                    if (this.elTable.length != 0) {
                        let id = '';
                        this.elTable.forEach(item => {
                            id += ","+item.oid;
                        });
                        id=id.substr(1);
                        this.$axios.delete("/biz/BlacklistDownload/del", {"params": {"id": id}}).then(success => {
                            this.$message.success(success.data?success.data:'删除成功');
                            this.$refs.grid.refresh();
                        }).catch(error => {
                            this.$message({
                                type:'error',
                                message:error.msg
                            })
                        });
                    }
                })
            }
        },
        mounted() {
            //  this.$refs.flow.get.definition.name="fsaf";
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
