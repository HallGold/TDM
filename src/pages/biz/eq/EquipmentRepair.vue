<template>
    <div class="form-content" >
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="mainDataRules" ref="bizForm" label-width="100px" >
                    <ice-grid-layout :columns="3" name="申请人">
                        <el-form-item label="申请人"  prop="afUserName">
                            <el-input v-model="mainData.afUserName" disabled placeholder="申请人"></el-input>
                        </el-form-item>
                        <el-form-item label="部门"  prop="afDepartmentName">
                            <el-input v-model="mainData.afDepartmentName" disabled placeholder="部门"></el-input>
                        </el-form-item>

                        <el-form-item label="电话" prop="afPhone">
                            <el-input v-model="mainData.afPhone" disabled placeholder="电话"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="申请设备">
                        <el-form-item label="设备型号"  prop="">
                            <el-input v-model="mainData.a"  placeholder="设备型号"></el-input>
                        </el-form-item>
                        <el-form-item label="设备编号"  prop="b">
                            <el-input v-model="mainData.b"  placeholder="设备编号"></el-input>
                        </el-form-item>
                        <el-form-item label="设备类型"  prop="c">
                            <el-input v-model="mainData.c"  placeholder="设备类型"></el-input>
                        </el-form-item>
                        <el-form-item label="设备密级"  prop="d">
                            <el-input v-model="mainData.d"  placeholder="设备密级"></el-input>
                        </el-form-item>
                        <el-form-item label="责任人"  prop="e">
                            <el-input v-model="mainData.e"  placeholder="责任人"></el-input>
                        </el-form-item>
                        <el-form-item label="责任人单位"  prop="f">
                            <el-input v-model="mainData.f"  placeholder="责任人单位"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="3" name="维修类型">
                        <el-form-item label="维修地址"  prop="">
                            <el-radio v-model="mainData.g" label="1">所内</el-radio>
                            <el-radio v-model="mainData.g" label="2">所外</el-radio>
                        </el-form-item>
                        <el-form-item label="是否涉密"  prop="b">
                            <el-radio v-model="mainData.h" label="1">是</el-radio>
                            <el-radio v-model="mainData.h" label="2">否</el-radio>
                        </el-form-item>
                        <el-form-item label="是否质保期"  prop="c">
                            <el-radio v-model="mainData.i" label="1">是</el-radio>
                            <el-radio v-model="mainData.i" label="2">否</el-radio>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="设备子类">
                        <div>
                            <el-button type="primary" @click="add">新增</el-button>
                        </div>
                        <div class="grid-bar" style="width: 100%;">
                            <ice-editable-table :data="mainData.eqs" style="width: 100%" v-model="mainData.eqs"
                                                ref="editTable" :rules="editRules">
                                <el-table-column :width="50"
                                                 label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="deviceCode"
                                                           label="设备型号"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=150>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceName"
                                                           label="设备密级"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=150>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceType"
                                                           label="保密编号"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=150>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceIp"
                                                           label="设备序列号"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=150>

                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceLocation"
                                                           label="容量"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=120>
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="deviceUser"
                                                           label="备注"
                                                           input-type="input" :disabled="flowScope.formReadonly"
                                                           :width=100>
                                </ice-editable-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                    <ice-grid-layout :columns="1" name="故障现象">
                        <el-form-item label="故障描述"  prop="softDescribe" >
                            <quill-editor style="height: 200px;display: flex;flex-direction: column;"
                                          ref="myTextEditor" v-model="mainData.softDescribe"
                                          :options="{placeholder:'请输入故障描述...'}" :disabled="flowScope.formReadonly">
                            </quill-editor>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="点我" :columns="1">
                        <el-button @click="clic">点我</el-button>
                    </ice-grid-layout>
                </el-form>
                <el-form :model="mainDataForm" status-icon :rules="rulesInstall" ref="bizForm" label-width="100px" >
                    <ice-grid-layout :columns="3" name="送修详情">
                        <el-form-item label="送修单位"  prop="a" >
                            <el-radio v-model="mainDataForm.a" label="1" disabled>所内</el-radio>
                            <el-radio v-model="mainDataForm.a" label="2" disabled>委托运维单位</el-radio>
                        </el-form-item>
                        <el-form-item label="送修人"  prop="b">
                            <el-input v-model="mainDataForm.b" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话"  prop="c">
                            <el-input v-model="mainDataForm.c" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="送修部门"  prop="c">
                            <el-input v-model="mainDataForm.d" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="送修日期"  prop="c">
                            <el-date-picker v-model="mainDataForm.e">

                            </el-date-picker>
                            <!--<el-input ></el-input>-->
                        </el-form-item>
                        <el-form-item label="维修模式"  prop="" layout="3">
                            <el-radio v-model="mainDataForm.f" label="1" v-if="mainData.g==1">所内自行维修</el-radio>
                            <el-radio v-model="mainDataForm.f" label="2" v-if="mainData.g==1 && mainData.i==1">质保单位所内维修</el-radio>
                            <el-radio v-model="mainDataForm.f" label="3" v-if="mainData.g==2">所外维修</el-radio>
                        </el-form-item>
                        <el-form-item label="维修类别"  prop="" layout="3">
                            <el-checkbox-group v-model="mainDataForm.g">
                                <el-checkbox label="A">硬件维修</el-checkbox>
                                <el-checkbox label="B">数据恢复</el-checkbox>
                                <el-checkbox label="C">介质消磁</el-checkbox>
                                <el-checkbox label="D">信息消除</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label="设备密级"  prop="h" layout="3">
                            <el-radio v-model="mainDataForm.h" label="1" disabled>机密</el-radio>
                            <el-radio v-model="mainDataForm.h" label="2" disabled>密级</el-radio>
                            <el-radio v-model="mainDataForm.h" label="3" disabled>内部</el-radio>
                            <el-radio v-model="mainDataForm.h" label="4" disabled>公开</el-radio>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout :columns="2" name="保密手续">
                        <!--<el-input >将维修审批号自动填入，并能连接查看，如果是所外单位送来维修，需附上维修审批的扫描件</el-input>-->
                        <el-form-item label="送修单位保密审批手续"  prop="i"  label-width="200px">
                            <el-checkbox v-model="mainDataForm.i">{{mainDataForm.i?"有":"无"}}</el-checkbox>
                        </el-form-item>
                        <el-form-item label="是否与送修审批单一致并接受" v-if="mainDataForm.i" label-width="200px">
                            <el-radio v-model="mainDataForm.j" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.j" label="2">否</el-radio>
                        </el-form-item>
                        <el-form-item label="签字"  prop="k"  layout="3">
                            <el-input v-model="mainDataForm.k" ></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="接件日期">
                        <el-form-item label="时间"  prop="l">
                            <!--<el-input v-model="mainData.k"></el-input>-->
                            <el-date-picker v-model="mainDataForm.l"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="签字"  prop="">
                            <el-input v-model="mainDataForm.m"></el-input>
                        </el-form-item>
                    </ice-form-group>
                    <ice-form-group name="所内维修工程师">
                        <el-form-item label="签字"  prop="">
                            <el-input v-model="mainDataForm.n"></el-input>
                        </el-form-item>
                    </ice-form-group>
                    <ice-grid-layout name="保密措施监管情况" :columns="2" v-if="mainData.h==1 && mainDataForm.f!=3 && mainDataForm.f!=''">
                        <el-form-item label="送修人是否已向您明确密保要求"  prop="" label-width="210px" v-if="mainDataForm.f==1">
                            <el-radio v-model="mainDataForm.o" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.o" label="2">否</el-radio>
                            <!--所内自行维修模式才填写-->
                        </el-form-item>
                        <!--维修模式是质保单位所内维修模式才填写-->
                        <el-form-item label="是否告知维修人员密保要求"  prop=""  label-width="210px" v-if="mainDataForm.f==2">
                            <el-radio v-model="mainDataForm.p" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.p" label="2">否</el-radio>
                        </el-form-item>
                        <el-form-item label="是否全程旁站陪同"  prop="" label-width="210px" v-if="mainDataForm.f==2">
                            <el-radio v-model="mainDataForm.q" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.q" label="2">否</el-radio>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="保密措施监管情况" :columns="2" v-if="mainData.h==1&&mainDataForm.f==3">
                        <el-form-item label="是否已拆除涉密储存硬件和固件"  prop="" label-width="210px">
                            <el-radio v-model="mainDataForm.r" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.r" label="2">否</el-radio>
                            <!--所内自行维修模式才填写-->
                        </el-form-item>
                        <!--维修模式是送外维修模式才填写-->
                        <el-form-item label="维修完毕，是否完成保密检查"  prop=""  label-width="210px">
                            <el-radio v-model="mainDataForm.s" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.s" label="2">否</el-radio>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="送外维修详情" :columns="3" v-if="mainData.g==2">
                        <el-form-item label="送外维修单位"  prop="">
                            <el-input v-model="mainDataForm.t"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人姓名"  prop="">
                            <el-input v-model="mainDataForm.u"></el-input>
                        </el-form-item>
                        <el-form-item label="联系人电话"  prop="">
                            <el-input v-model="mainDataForm.v"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="质保单位" v-if="mainData.i==1 && mainDataForm.f==2">
                        <!--维修模式是质保单位所内维修模式才填写-->
                        <el-form-item label="质保单位名称"  prop="">
                            <el-input v-model="mainDataForm.w"></el-input>
                        </el-form-item>
                        <el-form-item label="人员名称"  prop="">
                            <el-input v-model="mainDataForm.xn"></el-input>
                        </el-form-item>
                        <el-form-item label="人员联系方式"  prop="">
                            <el-input v-model="mainDataForm.x"></el-input>
                        </el-form-item>
                    </ice-form-group>
                    <ice-form-group name="硬件详情">
                        <el-form-item label="设备类别"  prop="" layout="3">
                            <el-radio v-model="mainDataForm.y" label="1" disabled>台式PC</el-radio>
                            <el-radio v-model="mainDataForm.y" label="2" disabled>笔记本</el-radio>
                            <el-radio v-model="mainDataForm.y" label="3" disabled>工控机</el-radio>
                            <el-radio v-model="mainDataForm.y" label="4" disabled>服务器(含工作站)</el-radio>
                            <el-radio v-model="mainDataForm.y" label="5" disabled>计算机外设</el-radio>
                        </el-form-item>
                    </ice-form-group>
                    <ice-form-group name="故障详情">
                        <el-form-item label="故障现象" style="width: 100%">
                            <!--从申请时带过来，不可编辑，但是可以追加其他-->
                            <el-input v-model="mainDataForm.z" type="textarea" rows="3"></el-input>
                        </el-form-item>
                    </ice-form-group>
                    <ice-form-group name="故障诊断">
                        <el-form-item label="诊断情况">
                            <el-input v-model="mainDataForm.aa"></el-input>
                        </el-form-item>
                        <el-form-item label="签字">
                            <el-input v-model="mainDataForm.ab"></el-input>
                        </el-form-item>
                        <el-form-item label="完成日期">
                            <el-date-picker v-model="mainDataForm.ac"></el-date-picker>
                            <!--<el-input v-model="mainDataForm.ac"></el-input>-->
                        </el-form-item>
                        <el-form-item label="是否更换储存设备"  prop="" label-width="150px">
                            <el-radio v-model="mainDataForm.ad" label="1">是</el-radio>
                            <el-radio v-model="mainDataForm.ad" label="2">否</el-radio>
                        </el-form-item>
                    </ice-form-group>
                    <ice-grid-layout name="数据恢复" :columns="2">
                        <el-form-item label="设备类型"  prop="" layout="2">
                            <el-radio v-model="mainDataForm.ae" label="1">普通存储介质</el-radio>
                            <el-radio v-model="mainDataForm.ae" label="2">服务器存储介质</el-radio>
                            <el-radio v-model="mainDataForm.ae" label="3">磁盘阵列</el-radio>
                        </el-form-item>
                        <el-form-item label="预恢复量" prop="">
                            <el-input v-model="mainData.af"></el-input>
                        </el-form-item>
                        <el-form-item label="实际恢复量" prop="">
                            <el-input v-model="mainData.ag"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="数据粉碎">
                        <el-form-item label="数据量" prop="">
                            <el-input v-model="mainData.ah"></el-input>
                        </el-form-item>
                    </ice-form-group>
                    <ice-form-group name="费用结算">
                        <el-button @click="clicf">点我</el-button>
                    </ice-form-group>
                </el-form>
            </div>
        </ice-flow-form>
    </div>
</template>

<script>
    import IceFlowForm from "../../../components/common/base/IceFlowForm";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceFormGroup from "../../../components/common/base/IceFormGroup";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import {quillEditor} from 'vue-quill-editor';
    export default {
        name: "equipmentService",
        components: {IceEditableTable, IceEditableTableColumn, IceFormGroup, IceGridLayout, IceFlowForm,quillEditor},
        data(){
            return{
                mainData:{g:[]},
                mainDataForm:{g:[]},
                mainDataRules:{},
                editRules:{},
                rulesInstall:{},
                aaa:true,
                AA:true,                        /*是否涉密*/
            }
        },
        methods:{
            /**流程组件初始化*/
            flowReady(flowcont, bizdata){
                Object.assign(this.mainData, bizdata);
                this.mainData.eqs = this.mainData.eqs ? this.mainData.eqs : [];
            },
            /**点击提交时触发*/
            flowOperateBtn(flowcont, bizdata){

            },
            /**返回的数据交给流程*/
            flowBizData(){

            },
            add() {
                this.mainData.eqs.push({
                    fileId: '',
                    valueCode: '',
                    name: '',
                    enabled: '',
                    remark: '',
                    uploading: false,
                    percent: 0
                });
            },
            /**删除设备子类*/
            deleteDetailItem(index) {
                this.mainData.eqs.splice(index, 1);
            },
            clic(){
                this.aaa=false;
            },
            clicf(){
                this.aaa=true;
            }
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