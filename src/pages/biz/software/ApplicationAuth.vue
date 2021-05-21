<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flow">
                <el-form :model="bizData" status-icon :rules="rules" ref="form" label-width="100px">
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人" prop="afUserName" label-width="80px">
                            <el-input v-model="bizData.afUserName" autocomplete="off"
                                      :disabled="true">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="所在部门" prop="afDepartmentName">
                            <el-input v-model="bizData.afDepartmentName"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" prop="afPhone">
                            <el-input v-model="bizData.afPhone"
                                      :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="是否代申请" prop="isConsignor">
                            <el-checkbox @change="isReplace(bizData.isConsignor)"
                                         false-label="0"
                                         true-label="1"
                                         :disabled="flow.formReadonly"
                                         v-model="bizData.isConsignor">
                                {{bizData.isConsignor=='1'?'是':'否'}}
                            </el-checkbox>
                        </el-form-item>
                        <el-form-item label="代申请人" prop="consignorName" v-if="bizData.isConsignor=='1'">
                            <el-input v-model="bizData.consignorName" readonly :disabled="flow.formReadonly">
                                <i class="el-icon-edit-outline" @click="chooseUserSingle" slot="append" v-if="!flow.formReadonly"></i>
                            </el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="申请概要">
                        <el-form-item label="授权时间" layout="2" prop="datetimerange">
                            <el-date-picker
                                    class="fontColor"
                                    :disabled="flow.formReadonly"
                                    v-model="bizData.datetimerange"
                                    type="datetimerange"
                                    :picker-options="pickerOptions"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="授权码" prop="authCode" v-show="bizData.authCode">
                            <div style="font-size: 20px;font-weight: bolder">
                                {{bizData.authCode}}
                                &nbsp;&nbsp;&nbsp;<span style="color: #F56C6C;font-weight: normal;font-size: 14px;">流程结束后授权将失效</span>
                            </div>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group  name="授权软件">
                        <div style="width: 44.7%;margin-right: 2px">
                            <div style="margin-bottom: 2px" v-if="!flow.formReadonly">
                                <el-button type="primary" @click="chooseUser">选择运维用户</el-button>
                            </div>
                            <div style="width: 100%">
                                <el-table :data="perTableData" :height="200">
                                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                                    <el-table-column label="用户名" prop="userName"></el-table-column>
                                    <ice-table-column label="密级" prop="secretLevel" map-type-code="OR_SECRET_LEVEL"></ice-table-column>
                                    <el-table-column label="部门" prop="deptName"></el-table-column>
                                    <el-table-column label="操作" v-if="!flow.formReadonly" width="100">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="del(scope.$index,'per')">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                        <div style="width: 55%">
                            <div style="margin-bottom: 2px" v-if="!flow.formReadonly">
                                <el-button type="primary" @click="chooseSoftware">选择运维软件</el-button>
                            </div>
                            <div style="width: 100%">
                                <el-table :data="tableData" :height="200">
                                    <el-table-column type="index" label="序号" width="50"></el-table-column>
                                    <el-table-column label="软件名称" prop="softName"></el-table-column>
                                    <el-table-column label="软件类别" prop="classifyNamePath"></el-table-column>
                                    <el-table-column label="软件版本" prop="softVersion"></el-table-column>
                                    <el-table-column label="操作" v-if="!flow.formReadonly" width="100">
                                        <template slot-scope="scope">
                                            <el-button type="text" @click="del(scope.$index)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>

                    </ice-form-group>
                    <ice-grid-layout :columns="1" name="运维人员回执"  code="returnReceipt">
                        <el-form-item label="是否卸载" prop="h">
                            <el-checkbox true-label="1" false-label="0" v-model="bizData.isUninstall" @change="isUnload(bizData.isUninstall)">{{bizData.isUninstall=='1'?'是':'否'}}</el-checkbox>
                        </el-form-item>
                        <el-form-item label="填写回执" prop="feedback">
                            <el-input type="textarea"
                                      v-model="bizData.feedback"
                                      rows="3"
                                      :disabled="!flow.formReadonly"
                                      maxlength="256"
                                      :showWordLimit="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                </el-form>
                <div>
                    <ice-persion-selector
                            :choose-item="chooseItem"
                            ref="icePs"
                            mode="hidden"
                            :selectedPersion="selectedPersion"
                            @select-confirm="selectUserConfirm">
                    </ice-persion-selector>
                </div>
            </div>
        </ice-flow-form>
        <div>
            <auth-software-selector @getData="getData" ref="ass" :selected-software="selectedSoftware"></auth-software-selector>
        </div>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IcePersionSelector from "../../../components/common/biz/IcePersionSelector";
    import AuthSoftwareSelector from "./authSoftwareSelector";
    import AuthSoftwareLoadDown from "./authSoftwareLoadDown";
    import IceTableColumn from "../../../components/common/base/IceTableColumn";

    export default {
        name: "ApplicationAuth",
        components: {
            IceTableColumn,
            AuthSoftwareLoadDown,
            AuthSoftwareSelector, IcePersionSelector, IceFormGroup, IceGridLayout, IceFlowForm},
        data(){
            return{
                chooseItem:'single',
                selectedPersion: [],
                perTableData:[],
                bizData:{//表单对象
                    afUserName:'',//申请人
                    afDepartmentName:'',//所在部门
                    afPhone:'',//联系电话
                    authCode:'',//密码
                    feedback:'',//填写回执
                    isConsignor: '0',//是否代申请
                    isUninstall:'',//是否卸载
                    h: '1',//是否卸载--用于验证
                    softList: [],
                    userList: [],//运维用户
                    datetimerange: [new Date(), new Date(new Date().getTime() + 3600 * 1000 * 24 * 5)],//授权时间
                    authDateStart: '',//授权开始时间
                    authDateEnd: '',//授权结束时间
                    consignorName:'',//代申请人
                    consignorCode:'',//代申请人code
                    softName: '',
                    userName: ''
                },
                rules:{//表单字段规则
                    datetimerange: [{required: true, message: '请填写授权时间', trigger: 'change'}],
                    h:[{required:true,message:'请确保该软件已卸载',trigger:'change'}],
                },
                consignorName:[{required:true,message:'请选择代申请人',trigger:'change'}],
                tableData:[],
                selectedSoftware:[],
                pickerOptions: {
                    shortcuts: [
                        {
                            text: '最近五天',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(end.getTime() + 3600 * 1000 * 24 * 5);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一周',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
                                picker.$emit('pick', [start, end]);
                            }
                        }, {
                            text: '最近一个月',
                            onClick(picker) {
                                const end = new Date();
                                const start = new Date();
                                end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                                picker.$emit('pick', [start, end]);
                            }
                        }]
                },
            }
        },
        methods:{
            /**
             * 流程初始化所带的数据
             * @param flowCont
             * @param bizData
             */
            flowReady(flowCont, bizData){
                if(bizData.userList&&bizData.userList.length>0){
                    this.perTableData = bizData.userList;
                    bizData.h = bizData.isUninstall;
                    this.tableData = bizData.softList;
                }
                Object.assign(this.bizData, bizData);

            },
            /**
             * 流程提交或保存按钮触发事件
             * @param flowCont
             * @param bizData
             */
            flowOperateBtn(flowCont, bizData){
                let isTrue = true;
                this.$refs.form.validate(valid=>{
                    isTrue = valid;
                });
                if(this.tableData.length === 0){
                    this.$message.warning("运维软件不可为空");
                    return false;
                }
                if(this.perTableData.length===0){
                    this.$message.warning("运维用户不可为空");
                    return false;
                }
                return isTrue
            },
            /**
             * 将界面的数据给流程
             */
            flowBizData(){
                this.bizData.authDateStart = this.bizData.datetimerange[0];
                this.bizData.authDateEnd = this.bizData.datetimerange[1];
                this.bizData.softList = this.tableData;
                this.bizData.softName = this.bizData.softList.map(e => e.softName).join();
                this.bizData.userName = this.bizData.userList.map(e => e.userName).join();
                this.bizData.userList = this.perTableData;
                return this.bizData;
            },
            /**
             * 选择软件
             */
            chooseSoftware(){
                this.$refs.ass.openDialog();
                let arr = Object.assign([],this.tableData);
                this.selectedSoftware = arr;
            },
            /**
             * 选择代申请人--点击确定触发的事件
             * @param row
             */
            selectUserConfirm(row){
                if(this.chooseItem == 'single'){
                    this.bizData.consignorName = row[0].name;
                    this.bizData.consignorCode = row[0].code;
                }else{
                    this.perTableData = [];
                    row.forEach(item=>{
                        let obj = {};
                        obj.userName = item.name;
                        obj.userCode = item.code;
                        obj.deptName = item.deptShortName;
                        obj.deptCode = item.deptCode;
                        obj.secretLevel = item.securityLevel;
                        this.perTableData.push(obj);
                    });
                }
            },
            /**
             *选择软件--点击确定返回的数据
             * @param data
             */
            getData(data){
                data.forEach(one => {
                    one.softId = one.oid;
                    one.oid = '';
                });
                this.tableData = data;
            },
            /**
             * 是否代申请
             * @param val
             */
            isReplace(val){
                if(val=='1'){
                    this.rules.consignorName = this.consignorName;
                }else{
                    this.bizData.consignorName = '';
                    if(this.rules.consignorName){
                        delete this.rules.consignorName;
                    }
                }
            },
            /**
             * 是否卸载
             * @param val
             */
            isUnload(val){
                if(val=='0'){
                    this.bizData.h = '';
                }else{
                    this.bizData.h = 1;
                }
            },
            del(index,val){
                if(val){
                    this.perTableData.splice(index,1);
                }else{
                    this.tableData.splice(index,1);
                }

            },
            chooseUser(){
                this.chooseItem = 'multiple';
                let arr = [];
                this.perTableData.forEach(item=>{
                    arr.push(item.userCode);
                });
                this.selectedPersion = arr;
                this.$refs.icePs.openDialog();
            },
            chooseUserSingle(){
                this.chooseItem = 'single';
                let arr = [this.bizData.consignorCode];
                this.selectedPersion = arr;
                this.$refs.icePs.openDialog();
            }
        }
    }
</script>

<style scoped>

</style>
<style lang="less">
    .fontColor.is-disabled input{
        color: black;
    }
</style>