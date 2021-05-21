<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesReport" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" name="申请责任人信息">
                        <el-form-item label="申请人"  prop="afUserName" label-width="140px">
                            <el-input v-model="mainData.afUserName"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item  label="申请部门" prop="afDepartmentName" label-width="140px">
                            <el-input v-model="mainData.afDepartmentName"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话"  prop="afPhone" label-width="140px">
                            <el-input v-model="mainData.afPhone"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间"  prop="afDate" label-width="140px">
                            <el-input v-model="mainData.afDate"  :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="2" name="设备相关信息" >
                        <el-form-item label="责任人"  prop="dutyName" label-width="140px">
                            <el-input v-model="mainData.dutyPersonName"
                                      readonly
                                      placeholder="请选择责任人">
                                <el-button @click="choosePeople" icon="el-icon-user-solid" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="责任部门"  prop="dutyDeptName" label-width="140px">
                            <el-input v-model="mainData.dutyDeptName"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="宿主设备名称"  prop="devName" label-width="140px">
                            <el-input v-model="mainData.devName">
                                <el-button slot="append" icon="el-icon-edit" @click="chooseDevice"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="资产编号"  prop="sn" label-width="140px">
                            <el-input v-model="mainData.sn"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="设备编号"  prop="devSn" label-width="140px">
                            <el-input v-model="mainData.devSn"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="设备类型"  prop="category" label-width="140px">
                            <el-input v-model="mainData.categoryText"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="设备子类"  prop="childType" label-width="140px">
                            <el-input v-model="mainData.childTypeText"  :disabled="true" ></el-input>
                        </el-form-item>
                        <el-form-item label="保密编号"  prop="secretSn" label-width="140px">
                            <el-input v-model="mainData.secretSn"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="密级"  prop="secretLevel" label-width="140px">
                            <ice-select v-model="mainData.secretLevel" map-type-code="OR_SECRET_LEVEL" :disabled="true"></ice-select>
                            <!--<el-input v-model="mainData.secretLevel"  :disabled="true"></el-input>-->
                        </el-form-item>
                        <el-form-item label="放置地点"  prop="currentPlace" label-width="140px">
                            <el-input v-model="mainData.currentPlace"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="IP地址"  prop="masterIp" label-width="140px">
                            <el-input v-model="mainData.masterIp"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联网类型/用途"  prop="netAreaAndType" label-width="140px">
                            <el-input v-model="mainData.netAreaAndType"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="操作类型"  prop="operateType" label-width="140px">
                            <el-select v-model="mainData.operateType" clearable placeholder="请选择" @change="showOrHideReplaceTable">
                                <el-option
                                        v-for="item in PAGE_ENUMS.HW_REPLACE_OPERATE.TYPES"
                                        :key="item.CODE"
                                        :label="item.LABEL"
                                        :value="item.CODE">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="更换/新增设备类型"  prop="hardwareTypeName" label-width="140px" v-if="showHardTypeChoose">
                            <el-input v-model="mainData.hardwareTypeName"
                                      readonly>
                                <el-button @click="chooseDevCategory" icon="el-icon-edit" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="是否重装系统"  prop="isOSReinstall" label-width="140px">
                            <el-select v-model="mainData.isOSReinstall" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in PAGE_ENUMS.DEV_OS_REINSTALL.TYPES"
                                        :key="item.CODE"
                                        :label="item.LABEL"
                                        :value="item.CODE">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-form-group name="待更换设备" v-if="replaceOperTypeFlag">
                        <div style="margin-bottom: 2px;">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addReplaceHardware" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteReplaceHardware" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                        </div>
                        <ice-query-grid :gridData="willReplaceHwList"
                                        :columns="cloumnReplaceHw"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItem"
                                        :pagination="false"
                                        @selection-change="devRowsSelected"></ice-query-grid>
                    </ice-form-group>

                    <ice-form-group name="运维部门办理情况">
                        <div class="grid-bar" style="width: 100%;">
                            <div style="margin-bottom: 2px;">
                                <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                           :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                           @click="addNewHardwareByMaintainPerson" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            </div>
                            <ice-query-grid :gridData="willReplaceHwList"
                                            :columns="cloumnReplaceHw"
                                            ref="devGrid"
                                            :minHeight="200"
                                            :chooseItem="chooseItem"
                                            :pagination="false"
                                            @selection-change="devRowsSelected"></ice-query-grid>
                        </div>

                        <div class="grid-bar" style="width: 100%;">
                            <div style="margin-bottom: 2px">
                                <el-button type="primary" @click="addDetailItem">关联变更单</el-button>
                            </div>
                            <ice-editable-table :data="attachHardware" style="width: 100%"
                                                v-model="attachHardware"
                                                ref="editTable">
                                <el-table-column :width="150" label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="devType"
                                                           label="变更单号"
                                                           :width="500"
                                                           input-type="select"
                                                           map-type-code="SC_LEVEL">
                                </ice-editable-table-column>

                                <el-table-column label="操作" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">绑定
                                        </el-button>
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">解绑
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>

                    <ice-grid-layout :columns="1" name="维修工程师办理情况">
                        <el-form-item label="信息清除" prop="devRepairList" label-width="140px">
                            <a @click="editDevRepairTask">回执单</a>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="1" name="申请人确认">

                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="true"
                    :on-close-handler="selectOverHandler"></dev-select>

        <ice-persion-selector
                choose-item="single"
                ref="persionPop"
                mode="hidden"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>

        <dev-category-tree
                @nodeClick="treeNodeClick"
                :filterTreeData="filterTreeData"
                :ref="PAGE_ENUMS.REFS.DEV_CATEGORY.REF">
        </dev-category-tree>

        <ice-dialog :visible.sync="visible" width="50%" title="选择需要拆除的硬件" :buttons="addButtons">
            <el-form :model="editData"  label-position="right"
                     class="conditon-bar" ref="editFormDialog"
                     style="margin-top: 20px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="设备类型:" label-width="100px" prop="hwTypeName">
                            <el-input v-model="editData.hwTypeName"
                                      readonly>
                                <el-button @click="chooseDevCategory" icon="el-icon-edit" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="设备名称" label-width="100px" prop="hwName">
                            <el-input v-model="editData.hwName" v-if="!isSameHardware" :disabled="forbidEdit"></el-input>
                            <el-select v-model="editData.hwName" placeholder="请选择" v-if="isSameHardware">
                                <el-option
                                        v-for="item in sameHardwareList"
                                        :key="item.devId"
                                        :label="item.name"
                                        :value="item.devId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="资产编号" label-width="100px" prop="sn">
                            <el-input v-model="editData.sn" :disabled="forbidEdit"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="保密编号" label-width="100px" prop="secretSn">
                            <el-input v-model="editData.secretSn" :disabled="forbidEdit"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="拟新责任人" label-width="100px" prop="newDutyPerson">
                            <el-input v-model="editData.newDutyPerson"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="拟新状态:" label-width="100px" prop="newStatus">
                            <el-input v-model="editData.newStatus" v-if="!isReplaceHardDisk"></el-input>
                            <el-select
                                    v-model="editData.newStatus"
                                    v-if="isReplaceHardDisk">
                                <el-option
                                        v-for="item in hwNewStatusOpt"
                                        :key="item.CODE"
                                        :label="item.LABEL"
                                        :value="item.CODE">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </ice-dialog>

    </div>
</template>

<script>
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceFormGroup from "@/components/common/base/IceFormGroup";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import DevSelect from "../../dev/devSelect";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import DevCategoryTree from "./devCategoryTree";
    import IceSelect from "../../../../components/common/base/IceSelect";
    export default {
        name: "edit",
        components: {
            IceSelect,
            DevCategoryTree,
            IceDialog,
            IcePersionSelector,
            DevSelect,
            IceQueryGrid,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
            IceEditableTableColumn,
            IceEditableTable},
        mixins:[bizComm,devComm,renderer],
        data(){
            return{
                PAGE_ENUMS:{
                    REFS: {
                        DEV_CATEGORY: {REF:"treeCategory"},
                    },
                    HW_REPLACE_OPERATE:{
                        NAME:'更换设备的操作类型',
                        TYPES:[
                            {CODE:'1',LABEL:'新增'},
                            {CODE:'2',LABEL:'更换'}
                        ]
                    },
                    DEV_OS_REINSTALL:{
                        NAME:'是否存在设备操作系统重装',
                        TYPES:[
                            {CODE:'1',LABEL:'是'},
                            {CODE:'0',LABEL:'否'}
                        ]
                    },
                    NEW_STATUS_TYPES:[
                        {CODE:'1',LABEL:'报废'},
                        {CODE:'2',LABEL:'归库'},
                        {CODE:'3',LABEL:'停用'},
                    ]
                },
                mainData:{//表单对象
                    afUserName:'',
                    afDepartmentName:'',
                    afPhone:'',
                    afDate:'',
                    dutyPersonName:'',//责任人名称
                    dutyPersonCode:'',//责任人编号
                    dutyDeptName:'',//责任人所在部门名称
                    dutyDeptCode:'',//责任人所在部门编号
                    devName:'',//宿主设备名称
                    sn:'',//宿主设备资产编号
                    devSn:'',//宿主设备编号
                    category:'',//宿主设备类型
                    childType:'',//宿主设备子类型
                    secretSn:'',//宿主设备保密编号
                    secretLevel:'',//宿主设备密级
                    currentPlace:'',//宿主设备放置地点
                    masterIp:'',//宿主设备IP地址
                    netAreaAndType:'',//宿主设备联网类型/用途
                    hardwareTypeName:'',//新增/更换设备类型名称
                    hardwareTypeCode:'',//新增/更换设备类型编码
                    detailList:[],
                    childList:[],
                    childTypeText:'',//翻译后的设备子类
                    categoryText:'',//翻译后的设备类型
                },
                rulesReport:{},//表单字段规则验证
                tableRules: {//参考指标字段的验证规则
                    workTask: {required: true, message: '变更单号不能为空', trigger: 'change'}
                },
                devCorrelation:[],              //关联设备数据
                parasitiferDevData:[],          //宿主设备数据
                cloumnReplaceHw:[],          //关联设备列展示信息
                devSelectShow:false,           //设备选择弹窗的开关属性
                devList:[],                    //选择的数据集合--用于列表删除操作
                devId:'devId',                 //用于关联设备和出网设备的参数
                chooseItem:'multiple',          //出网信息是多选还是单选--single单选，multiple多选
                addButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveData}
                ],
                visible:false,
                editData:{
                    hwTypeName:'',//更换的硬件类型
                    hwTypeCode:'',//更换的硬件编号
                    hwName:'',//更换的硬件名称
                    sn:'',//资产编号
                    secretSn:'',//保密编号
                    newDutyPerson:'',//拟新责任人
                    newStatus:''//拟新状态
                },
                curChoosedHw:[],//当前选中的设备的关联硬件
                willReplaceHwList:[],//关联硬件更换信息
                assoDevList:[],//选择的数据集合--用于删除选中的硬件拆除
                engineerDelList:[],//选择的数据集合--用于删除选中的工程师操作记录
                engineerOperData:[],//工程师执行记录
                isEngineerOper:false,//是否为工程师填写记录
                replaceDevData:[],//待拆卸硬件
                attachParasitiferDevData:[],//新增加的硬件
                attachHardware:[],
                replaceOperTypeFlag:false,//更换设备硬件标识
                showHardTypeChoose:false,
                filterTreeData:[],
                hwNewStatusOpt:[],//待更换设备的新状态选择器
                isReplaceHardDisk:false,//待更换设备为硬盘
                isSameHardware:false,//同一台设备存在类型相同的多个硬件，比如一台微机存在两根相同的内存条
                sameHardwareList:[],//同一台设备相同的类型的硬件的集合
                forbidEdit:true,//待更换设备新增时，是否可输入控制
            }
        },
        methods:{
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data){
                let _this = this;
                return new Promise((resolve, reject) => {
                    let arrObj = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].devId = data[i].oid;
                        if (_this.findSameRowByCode(_this.parasitiferDevData, data[i].devId, _this.devId) == -1) {
                            _this.loadDevById(data[i].devId).then(res => {
                                if(res.dataDTO && res.dataDTO.commDTO){
                                    arrObj.push(res.dataDTO.commDTO)
                                }
                                if(i == data.length-1){
                                    if(_this.checkData(arrObj,_this.parasitiferDevData)){
                                        for (let i=0;i<arrObj.length;i++){
                                            arrObj[i].devId = arrObj[i].oid;
                                            arrObj[i].netAreaAndType = _this.onNetAndTypeRenderer(arrObj[i].netArea,arrObj[i].netType,arrObj[i].useFor);
                                            _this.parasitiferDevData.push(arrObj[i]);
                                            _this.loadDevById(arrObj[i].devId).then(res=>{
                                                _this.getCorrelationData(res);
                                            });
                                        }
                                        _this.chooseSingleDev(_this.parasitiferDevData[0]);
                                    }
                                }
                            });
                        }
                    }
                    resolve();
                    _this.devSelectShow = false;
                });
            },
            /**
             * 获取关联设备
             */
            getCorrelationData(data){
                let arr = data.dataDTO.dependDTOList ? data.dataDTO.dependDTOList : [];
                let _this = this;
                if(arr.length>0){
                    arr.forEach(item=>{
                        if(item.dependDevDTO&&item.dependDevDTO.commDTO){
                            item.dependDevDTO.commDTO.devId = item.devId;
                            _this.devCorrelation.push(item.dependDevDTO.commDTO);
                        }
                    });
                }
            },
            /**
             * 检查选择的设备是否符合条件
             */
            checkData(data,arr){
                //1、保密员可提交其部门的所有设备出网
                //2、责任人可提交本人设备出网
                let deptCode = '';
                let dutyCode = '';
                // if(arr.length>0){
                //     deptCode = arr[0].deptCode;
                //     dutyCode = arr[0].dutyCode;
                //     for(let i=0;i<data.length;i++){
                //
                //         if((i+1)<data.length){
                //             if(data[i].deptCode !=data[i+1].deptCode || data[i].dutyCode !=data[i+1].dutyCode ||
                //                 data[i].deptCode != deptCode ||  data[i].dutyCode != dutyCode){
                //                 this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                //                 return false
                //             }
                //         }else{
                //             if(data[i].deptCode != deptCode ||  data[i].dutyCode != dutyCode){
                //                 this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                //                 return false
                //             }
                //         }
                //     }
                // }else{
                //     for(let i=0;i<data.length;i++){
                //         if((i+1)<data.length){
                //             if(data[i].deptCode !=data[i+1].deptCode || data[i].dutyCode !=data[i+1].dutyCode){
                //                 this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                //                 return false
                //             }
                //         }
                //     }
                // }
                return true;
            },
            /**关联设备--新增*/
            addReplaceHardware(){
                this.editData={
                    hwTypeName:'',
                    hwTypeCode:'',
                    hwName:'',
                    sn:'',
                    secretSn:'',
                    newDutyPerson:'',
                    newStatus:''
                }
                this.visible = true;
            },
            /**关联设备--删除*/
            deleteReplaceHardware(){
                if (this.assoDevList.length > 0) {
                    this.$confirm('确定要删除选中的硬件', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.deletes(this.willReplaceHwList, this.assoDevList);
                        this.assoDevList = [];
                    });
                }else{
                    this.$message.warning('请选择需要删除的设备');
                }
            },
            /**
             * 删除出网设备的时候--删除与出网设备相关的关联设备
             */
            deleteCorrelationList(arr,arrCorrelation){
                if(arrCorrelation.length>0){
                    for(let i=0;i<arr.length;i++){
                        for(let j=0;j<arrCorrelation.length;j++){
                            if(arr[i].devId == arrCorrelation[j].devId){
                                arrCorrelation.splice(j,1);
                            }
                        }
                    }
                }
            },
            /**流程初始化所带的数据*/
            flowReady(flowcont, bizdata, flowNodes) {
                if(flowcont.nodeId!='FirstNode'){
                    this.mainData = bizdata;
                    this.parasitiferDevData = this.mainData.detailList;
                    this.devCorrelation = this.mainData.childList;
                    this.chooseItem = 'single';
                }else{
                    this.mainData.afUserName = bizdata.afUserName;
                    this.mainData.afDepartmentName = bizdata.afDepartmentName;
                    this.mainData.afPhone = bizdata.afPhone;
                    this.mainData.afDate = bizdata.afDate;
                }
            },
            /**流程提交或保存按钮触发事件*/
            flowOperateBtn(flowcont, bizdata){
                this.mainData.isAfter=0;
                return true;
            },
            /**将界面的数据给流程*/
            flowBizData() {
                this.mainData.detailList = this.parasitiferDevData;
                this.mainData.childList = this.devCorrelation;
                return this.mainData;
            },
            /**
             * 初始化页面控件
             * @returns {*}
             */
            initControls() {
                this.cloumnReplaceHw = [
                    {label: '设备类型',code: 'hwTypeName'},
                    {label: '设备名称',code: 'hwName'},
                    {label: '资产编号', code: 'sn'},
                    {label: '保密编号', code: 'secretSn'},
                    {label: '拟新责任人', code: 'newDutyPerson'},
                    {label: '拟新状态', code: 'newStatus'},
                ];

            },
            devRowsSelected(rows){
                this.assoDevList = rows;
            },
            editDevRepairTask(){//回执单
                alert('待开发')
            },
            associatedHardware(){//设备关联的硬件
                let clearCloumn = {
                    hwName:'',//更换的硬件名称
                    sn:'',//资产编号
                    secretSn:'',//保密编号
                    newDutyPerson:'',//拟新责任人
                    newStatus:''//拟新状态
                }
                Object.assign(this.editData,clearCloumn);
                let matchHwList = this.devCorrelation.filter(item => item.childType == this.editData.hwTypeCode)
                if(matchHwList.length == 1){
                    this.editData.hwName = matchHwList[0].name
                    this.editData.sn = matchHwList[0].sn
                    this.editData.secretSn = matchHwList[0].secretSn
                    if('1501_1502_1503'.indexOf(this.editData.hwTypeCode) != -1){//硬盘类型
                        this.hwNewStatusOpt = this.PAGE_ENUMS.NEW_STATUS_TYPES
                        this.isReplaceHardDisk = true
                    }else{
                        this.isReplaceHardDisk = false
                    }
                    this.isSameHardware = false
                    this.forbidEdit = true
                }else if(matchHwList.length >1 ){//存在设备类型相同的多个硬件
                    this.sameHardwareList = matchHwList
                    this.isSameHardware = true
                    this.forbidEdit = true
                }else{
                    this.forbidEdit = false
                    this.isSameHardware = false
                }
            },
            saveData(){
                this.willReplaceHwList.push(this.editData)
                this.visible = false;
            },
            addRepairEngineerOperation(){//硬件维修工程师添加执行记录
                this.isEngineerOper = true;
                this.editData={
                    dev:'',
                    needUninstallHw:'',
                    reason:'',
                    unInstallDate:'',
                    desc:''
                }
                this.visible = true;
            },
            deleteRepairEngineerOperation(){
                if (this.engineerDelList.length > 0) {
                    this.deletes(this.engineerOperData, this.engineerDelList);
                    // this.deleteCorrelationList(this.assoDevList,this.willReplaceHwList);
                    this.engineerDelList = [];
                }else{
                    this.$message.warning('请选择需要删除的操作记录');
                }
            },
            //选择宿主设备相关信息
            chooseDevice(){
                this.multiple = false;
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            },
            addDetailItem(){

            },
            /**选择责任人及责任部门*/
            choosePeople(){
                this.$refs.persionPop.openDialog();
                this.$nextTick(()=>{
                    this.$refs.persionPop.cleanColumnSelect();
                });
            },
            /**选人保存按钮*/
            selectUserConfirm(row){
                console.log(row)
                this.mainData.dutyPersonName = row[row.length-1].name;
                this.mainData.dutyPersonCode = row[row.length-1].code;
                this.mainData.dutyDeptName = row[row.length-1].deptShortName;
                this.mainData.dutyDeptCode = row[row.length-1].deptCode;
            },
            /**
             * 单选设备
             * @param data
             */
            chooseSingleDev(data) {
                Object.assign(this.mainData, data);
                this.mainData.oid = "";
                this.mainData.devId = data;
                this.mainData.devModel = data.model;
                this.mainData.devName = data.name;
                this.mainData.childTypeText = this.onChildTypeRenderer(data.childType);
                this.mainData.categoryText = this.onCategoryRenderer(data.category);
                this.mainData.secretLevel = this.mainData.secretLevel+'';
            },
            showOrHideReplaceTable(){
                if(this.mainData.operateType == 2){//更换
                    this.replaceOperTypeFlag = true
                    this.showHardTypeChoose = false
                }else{//新增
                    this.replaceOperTypeFlag = false
                    this.showHardTypeChoose = true
                }
            },
            chooseDevCategory(){
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUMS.REFS.DEV_CATEGORY.REF].opendialog();
                });

            },
            treeNodeClick(node,row){
                if(this.showHardTypeChoose){
                    this.mainData.hardwareTypeName = row.data.name
                    this.mainData.hardwareTypeCode = row.data.code
                }else{
                    this.editData.hwTypeName = row.data.name
                    this.editData.hwTypeCode = row.data.code
                }
            },
            /**运维工程师给设备添加新硬件*/
            addNewHardwareByMaintainPerson(){
                this.visible = true;

            }
        },
        mounted() {
            // this.requestCategoryData();//初始化设备类型
            // this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE);//初始化密级
            // this.requestNetAreaTypeData();//初始化联网类型
            this.requestCategoryData();
            this.initControls();
        },
        watch:{
            'editData.hwTypeName':{
                handler:function (newVal,oldVal) {
                    if(newVal != "" && newVal != oldVal){
                        this.$nextTick(() => {
                            this.associatedHardware();
                        });
                    }

                }
            },
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

    a{
        color:blue;
        text-decoration:underline;
        cursor: pointer;
        margin-left: 10px;
    }

</style>
