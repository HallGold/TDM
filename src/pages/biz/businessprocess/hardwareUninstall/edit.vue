<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesReport" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" name="申请责任人信息" >
                        <el-form-item label="申请人"  prop="afUserName">
                            <el-input v-model="mainData.afUserName"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item  label="申请部门" prop="afDepartmentName">
                            <el-input v-model="mainData.afDepartmentName"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话"  prop="afPhone">
                            <el-input v-model="mainData.afPhone"  :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间"  prop="afDate">
                            <el-input v-model="mainData.afDate"  :disabled="true"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group :columns="2" name="硬件拆除宿主设备信息">
                        <div style="margin-bottom: 2px;" v-if="!flowScope.formReadonly">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addParasitiferDev" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteParasitiferDev" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                        </div>
                        <ice-query-grid :gridData="parasitiferDevs"
                                        :columns="columnsOuter"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItem"
                                        :pagination="false"
                                        @selection-change="devRowsOuter"></ice-query-grid>
                    </ice-form-group>
                    <ice-form-group name="需拆除的部件信息">
                        <div style="margin-bottom: 2px;">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addCorrelation" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteCorrelation" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                        </div>
                        <div style="width: 100%">
                            <el-table :data="assoHwUnInfoList">
                                <el-table-column width="50px"
                                                 type="selection"></el-table-column>
                                <el-table-column label="序号"
                                                 width="50px"
                                                 type="index"></el-table-column>
                                <el-table-column label="设备编号"
                                                 prop="a"></el-table-column>
                                <el-table-column label="需要拆除的硬件"
                                                 prop="b">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.b">
                                            <el-option label="硬盘" value="1"></el-option>
                                            <el-option label="主板" value="2"></el-option>
                                            <el-option label="显卡" value="3"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="拆除原因"
                                                 prop="c">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.c"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column label="拟拆卸后去向"
                                                 width="300px"
                                                 prop="d">
                                    <template slot-scope="scope">
                                        <div style="width: 100%">
                                            <el-select v-model="scope.row.e" slot="prepend" :style="{width:scope.row.e!=3?'100%':'30%'}">
                                                <el-option label="报废" value="1"></el-option>
                                                <el-option label="归库" value="2"></el-option>
                                                <el-option label="其他" value="3"></el-option>
                                            </el-select>
                                            <el-input v-model="scope.row.d" v-if="scope.row.e==3" style="width: 70%" clearable></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--<ice-query-grid :gridData="assoHwUnInfoList"
                                        :columns="columnsCorrelation"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItem"
                                        :pagination="false"
                                        @selection-change="devRowsCorrelation"></ice-query-grid>-->
                    </ice-form-group>

                    <ice-form-group :columns="1" name="硬件维修工程师操作记录">
                        <div style="margin-bottom: 2px;">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addRepairEngineerOperation">{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteRepairEngineerOperation">{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                        </div>
                        <ice-query-grid :gridData="engineerOperData"
                                        :columns="columnsEngineer"
                                        ref="engGrid"
                                        :minHeight="200"
                                        :pagination="false"
                                        @selection-change="engineerOperRows"></ice-query-grid>

                        <div style="margin-top: 20px;width: 100%">
                            <el-form-item label="其他操作记录"  prop="otherOper">
                                <el-input placeholder="备注" type="textarea" :rows="2"
                                          v-model="mainData.otherOper"></el-input>
                            </el-form-item>
                        </div>
                    </ice-form-group>

                    <ice-grid-layout :columns="1" name="设备管理员审核记录">
                        <el-form-item label="审核台账的记录"  prop="otherOper" label-width="120px">
                            <el-input type="textarea" :rows="3"
                                      v-model="mainData.devManagerCheckLog"></el-input>
                        </el-form-item>

                        <el-form-item label="附件" prop="attachment" label-width="120px">
                            <ice-multiple-upload v-model="mainData.attachment"></ice-multiple-upload>
                        </el-form-item>

                        <el-form-item label="备注"  prop="devManagerRemark" label-width="120px">
                            <el-input placeholder="备注" type="textarea" :rows="3"
                                      v-model="mainData.devManagerRemark"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                </el-form>
            </div>
        </ice-flow-form>

        <dev-select ref="devSelect"
                    v-if="devSelectShow"
                    :multiple="true"
                    :on-close-handler="selectOverHandler"></dev-select>

        <ice-dialog :visible.sync="visible" width="70%" title="选择需要拆除的硬件" :buttons="addButtons">
            <el-form :model="editData"  label-position="right"
                     class="conditon-bar" ref="editFormDialog"
                     style="margin-top: 20px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="设备编号:" label-width="140px" prop="dev">
                            <el-select placeholder="请选择" v-model="editData.devId" @change="associatedHardware">
                                <el-option v-for="item in parasitiferDevs"
                                           :key="item.devId"
                                           :label="item.devSn"
                                           :value="item.devId"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="需要拆除的硬件:" label-width="140px" prop="needUninstallHw">
                            <el-select placeholder="请选择" v-model="editData.needUninstallHwId">
                                <el-option v-for="item in curChoosedHw"
                                           :key="item.oid"
                                           :label="item.name"
                                           :value="item.oid"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12" v-if="!isEngineerOper">
                        <el-form-item label="拆卸原因:" label-width="140px" prop="reason">
                            <el-input placeholder="备注" type="textarea" :rows="2"
                                      v-model="editData.reason"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="isEngineerOper">
                        <el-form-item label="拆卸时间:" label-width="140px" prop="unInstallDate">
                            <el-date-picker
                                    v-model="editData.unInstallDate"
                                    type="date"
                                    placeholder="选择日期" format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="拟拆卸后去向:" label-width="140px" prop="desc">
                            <el-radio v-model="editData.desc" label="报废">报废</el-radio>
                            <el-radio v-model="editData.desc" label="归库">归库</el-radio>
                            <el-radio v-model="editData.desc" label="其他">其他</el-radio>
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
    import IceSingleUpload from "../../../../components/common/base/IceSingleUpload";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import moment from 'moment'
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    export default {
        name: "edit",
        components: {
            IceMultipleUpload,
            IceDialog,
            IceSingleUpload,
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
                mainData:{//表单对象
                    afUserName:'',
                    afDepartmentName:'',
                    afPhone:'',
                    afDate:'',
                    afReason:'',
                    q:'',
                    remark:'',
                    detailList:[],
                    childList:[]
                },
                rulesReport:{//字段规则

                },
                devCorrelation:[],              //关联设备数据
                parasitiferDevs:[],             //宿主设备数据
                columnsCorrelation:[],          //关联设备列展示信息
                columnsOuter:[],                //出网设备列表展示信息
                devSelectShow:false,           //设备选择弹窗的开关属性
                devList:[],                    //选择的数据集合--用于列表删除操作
                devId:'devId',                 //用于关联设备和出网设备的参数
                chooseItem:'multiple',          //出网信息是多选还是单选--single单选，multiple多选
                operateTable:[],
                sysOperTable:[],
                addButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveData}
                ],
                visible:false,
                editData:{
                    devId:'',
                    needUninstallHwId:'',
                    reason:'',
                    unInstallDate:'',
                    desc:''
                },
                curChoosedHw:[],//当前选中的设备的关联硬件
                assoHwUnInfoList:[
                    {a:'453825135qkk',b:'',c:'',d:'',e:''}
                ],//关联硬件拆除信息
                assoDevList:[],//选择的数据集合--用于删除选中的硬件拆除
                engineerDelList:[],//选择的数据集合--用于删除选中的工程师操作记录
                columnsEngineer:[],//
                engineerOperData:[],//工程师执行记录
                isEngineerOper:false,//是否为工程师填写记录
                percent:0//上传百分比
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
                        if (_this.findSameRowByCode(_this.parasitiferDevs, data[i].devId, _this.devId) == -1) {
                            _this.loadDevById(data[i].devId).then(res => {
                                if(res.dataDTO && res.dataDTO.commDTO){
                                    arrObj.push(res.dataDTO.commDTO)
                                }
                                if(i == data.length-1){
                                    if(_this.checkData(arrObj,_this.parasitiferDevs)){
                                        for (let i=0;i<arrObj.length;i++){
                                            arrObj[i].devId = arrObj[i].oid;
                                            arrObj[i].netAreaAndType = _this.onNetAndTypeRenderer(arrObj[i].netArea,arrObj[i].netType,arrObj[i].useFor);
                                            _this.parasitiferDevs.push(arrObj[i]);
                                            _this.loadDevById(arrObj[i].devId).then(res=>{
                                                _this.getCorrelationData(res);
                                            });
                                        }
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
                if(arr.length>0){
                    deptCode = arr[0].deptCode;
                    dutyCode = arr[0].dutyCode;
                    for(let i=0;i<data.length;i++){

                        if((i+1)<data.length){
                            if(data[i].deptCode !=data[i+1].deptCode || data[i].dutyCode !=data[i+1].dutyCode ||
                                data[i].deptCode != deptCode ||  data[i].dutyCode != dutyCode){
                                this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                                return false
                            }
                        }else{
                            if(data[i].deptCode != deptCode ||  data[i].dutyCode != dutyCode){
                                this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                                return false
                            }
                        }
                    }
                }else{
                    for(let i=0;i<data.length;i++){
                        if((i+1)<data.length){
                            if(data[i].deptCode !=data[i+1].deptCode || data[i].dutyCode !=data[i+1].dutyCode){
                                this.$alert("请选择【设备责任单位】【设备责任人】相同的设备","提示");
                                return false
                            }
                        }
                    }
                }
                return true;
            },
            /**关联设备--新增*/
            addCorrelation(){
                this.isEngineerOper = false
                this.editData={
                    devId:'',
                    needUninstallHwId:'',
                    reason:'',
                    unInstallDate:'',
                    desc:''
                }
                this.visible = true;
            },
            /**关联设备--删除*/
            deleteCorrelation(){
                if (this.assoDevList.length > 0) {
                    this.$confirm('确定要删除选中的硬件', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.deletes(this.assoHwUnInfoList, this.assoDevList);
                        this.assoDevList = [];
                    });
                }else{
                    this.$message.warning('请选择需要删除的硬件');
                }
            },
            /**出网设备--新增*/
            addParasitiferDev(){
                this.devSelectShow = true;
                this.$nextTick(()=>{
                    this.$refs.devSelect.openDialog();
                });
            },
            /**出网设备--删除*/
            deleteParasitiferDev(){
                if (this.devList.length > 0) {
                    this.$confirm('确定要删除选中的宿主设备', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.deletes(this.parasitiferDevs, this.devList);
                        this.deleteCorrelationList(this.devList,this.assoHwUnInfoList);
                        this.devList = [];
                    });
                }else{
                    this.$message.warning('请选择需要删除的关联设备');
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
                    this.parasitiferDevs = this.mainData.detailList;
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
                this.mainData.detailList = this.parasitiferDevs;
                this.mainData.childList = this.devCorrelation;
                return this.mainData;
            },
            /**
             * 初始化页面控件
             * @returns {*}
             */
            initControls() {
                let _this = this;
                this.columnsCorrelation = [
                    { label: '设备编号',code: 'devSn'},
                    {label: '需拆除的硬件', code: 'assoHwName'},
                    {label: '拆卸原因', code: 'unInstallReason'},
                    {label: '拟拆卸后去向', code: 'desc'}
                ];
                this.columnsOuter = [
                    {code: 'devId', hidden: true},
                    /*{code: 'netArea', hidden: true},
                    {code: 'netType', hidden: true},
                    {code: 'useFor', hidden: true},*/
                    {label: '设备编号', code: 'devSn'},
                    {label: '设备类型', code: 'category', renderCell(h, data) {
                            if(data.row.category){//this.getNameByCode(this.ENUMS.SHAPE_TYPE_DATA, code);
                                return _this.onCategoryRenderer(data.row.category);
                            }
                            return data.row.category
                        }},
                    {label: '设备子类', code: 'childType',renderCell(h, data) {
                            if(data.row.childType){
                                return _this.onChildTypeRenderer(data.row.childType);
                            }
                            return data.row.childType
                        }},
                    {label: '保密编号', code: 'secretSn'},
                    {label: '资产编号', code: 'sn'},
                    {label: '密级', code: 'secretLevel',renderCell(h, data) {
                            if(data.row.secretLevel){
                                return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA,data.row.secretLevel);
                            }
                            return data.row.secretLevel
                        }},
                    {label: '放置地点', code: 'currentPlace'},
                    {label: 'IP地址', code: 'masterIp'},
                    {label: '联网类型', code: 'netAreaAndType'},
                ];
                this.columnsEngineer = [
                    {label: '设备编号',code: 'devSn'},
                    {label: '需拆除的硬件', code: 'assoHwName'},
                    {label: '硬件拆卸时间', code: 'unInstallDate',renderCell(h,data){
                            return moment(data.row.unInstallDate).format('YYYY-MM-DD');
                        }},
                    {label: '拟拆卸后去向', code: 'desc'}
                ]
            },
            /**
             * 出网设备列选择的数据
             */
            devRowsOuter(rows){
                this.devList = rows;
            },
            devRowsCorrelation(rows){
                this.assoDevList = rows;
            },
            engineerOperRows(rows){
                this.engineerDelList = rows;
            },
            editDevRepairTask(){//回执单
                alert('待开发')
            },
            associatedHardware(){//设备关联的硬件
                this.editData.needUninstallHwId = ''
                this.curChoosedHw = this.devCorrelation.filter(item => item.devId == this.editData.devId)
            },
            saveData(){
                let choosedDev = this.parasitiferDevs.filter(item => item.devId == this.editData.devId)
                let choosedHardware = this.curChoosedHw.filter(item => item.oid == this.editData.needUninstallHwId)
                //填充到工程师拆除操作记录中
                if(this.isEngineerOper){
                    let engineerOperInfo = {
                        devId:this.editData.devId,
                        devSn:choosedDev[0].devSn,
                        assoHwId:this.editData.needUninstallHwId,
                        assoHwName:choosedHardware[0].name,
                        unInstallDate:this.editData.unInstallDate,
                        desc:this.editData.desc
                    }
                    // debugger
                    this.engineerOperData.push(engineerOperInfo)
                }else{//填充到申请拆卸操作记录中

                    let assoHwUnInfo = {
                        devId:this.editData.devId,
                        devSn:choosedDev[0].devSn,
                        assoHwId:this.editData.needUninstallHwId,
                        assoHwName:choosedHardware[0].name,
                        unInstallReason:this.editData.reason,
                        desc:this.editData.desc
                    }
                    this.assoHwUnInfoList.push(assoHwUnInfo)
                }

                this.visible = false;
            },
            addRepairEngineerOperation(){//硬件维修工程师添加执行记录
                this.isEngineerOper = true;
                this.editData={
                    dev:'',
                    needUninstallHwId:'',
                    reason:'',
                    unInstallDate:'',
                    desc:''
                }
                this.visible = true;
            },
            deleteRepairEngineerOperation(){
                if (this.engineerDelList.length > 0) {
                    this.deletes(this.engineerOperData, this.engineerDelList);
                    // this.deleteCorrelationList(this.assoDevList,this.assoHwUnInfoList);
                    this.engineerDelList = [];
                }else{
                    this.$message.warning('请选择需要删除的操作记录');
                }
            },
            /**下载查看*/
            look(id){
                this.$downloadFile(id);
            },
            /**上传触发事件*/
            progress(event, file, fileList) {
                this.percent = Number(event.percent).toFixed(0)
                this.percent = this.percent > 100 ? 100 : this.percent;
            },
            /**上传成功触发事件*/
            success(response, file, fileList) {
                this.percent = 100;
                this.$refs.uploader.reset();
                this.mainData.tmpFileName = file.name;
                this.mainData.fileId = response.data;
                /*this.$refs.editTable.validateField('tmpFileName',error=>{});*/
                /*this.$nextTick(()=>{});*/
            },
            uploadBeforeUpload(file){
                this.percent = 0;
                this.mainData.fileMD5 = file.md5;
            },
        },
        mounted() {
            this.requestCategoryData();//初始化设备类型
            this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE);//初始化密级
            this.requestNetAreaTypeData();//初始化联网类型
            this.initControls();
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

    .upload-progress{
        width: 100%;
        background: #67c23a;
        position: absolute;
        top: 1px;
        text-align: right;
        z-index: 0;
        height: 3px;
    }
</style>
