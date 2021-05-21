<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesReport" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" name="申请人基础信息" >
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

                    <ice-form-group name="涉密终端设备位置变更相关信息">
                        <!--<el-form-item label="" label-width="1px" prop="safeManagerOperLog">

                        </el-form-item>-->
                        <div style="margin-bottom: 2px;" v-if="!flowScope.formReadonly">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="chooseDevice(1)" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                        </div>
                        <div style="width: 100%">
                            <el-table :data="wantReplaceDevs">
                                <el-table-column
                                        prop="devSn"
                                        width="200"
                                        label="设备编号">
                                    <!--<template slot-scope="scope">
                                        <div v-if="scope.$index === 0">
                                            <span>{{scope.row.devSn}}</span>
                                        </div>
                                    </template>-->
                                </el-table-column>
                                <el-table-column
                                        prop="associateDevSn"
                                        width="100"
                                        label="关联设备">
                                    <template slot-scope="scope">
                                        <el-popover
                                                placement="right"
                                                width="500"
                                                trigger="click">
                                            <el-table :data="gridData">
                                                <el-table-column  property="date" label="设备子类"></el-table-column>
                                                <el-table-column  property="name" label="设备编号"></el-table-column>
                                                <el-table-column  property="address" label="保密编号"></el-table-column>
                                                <el-table-column  property="c" label="设备序列号"></el-table-column>
                                            </el-table>
                                            <el-button slot="reference" type="text">查看关联设备</el-button>
                                        </el-popover>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="b"
                                        width="300"
                                        label="原放置地点" >
                                    <template slot-scope="scope">
                                        <div style="width: 100%">
                                            <el-input v-model="scope.row.a" placeholder="园区"
                                                      style="width: 23%" @change="workPlaceRules('a')" maxlength="100">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.b" placeholder="楼号"
                                                      style="width: 23%" @change="workPlaceRules('b')" maxlength="20">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.c" placeholder="房间号"
                                                      style="width: 25%" @change="workPlaceRules('c')" maxlength="20">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.d" placeholder="工位号"
                                                      style="width: 25%" @change="workPlaceRules('d')" maxlength="50">
                                            </el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="c"
                                        width="300"
                                        label="新放置地点" >
                                    <template slot-scope="scope">
                                        <div style="width: 100%">
                                            <el-input v-model="scope.row.e" placeholder="园区"
                                                      style="width: 23%" @change="workPlaceRules('a')" maxlength="100">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.f" placeholder="楼号"
                                                      style="width: 23%" @change="workPlaceRules('b')" maxlength="20">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.g" placeholder="房间号"
                                                      style="width: 25%" @change="workPlaceRules('c')" maxlength="20">
                                            </el-input><span>-</span>
                                            <el-input v-model="scope.row.h" placeholder="工位号"
                                                      style="width: 25%" @change="workPlaceRules('d')" maxlength="50">
                                            </el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                               <!-- <el-table-column
                                        prop="oldSettlePlace"
                                        label="原放置地点">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index === 0" style="width: 100%">
                                            <el-input style="width: 50px" v-model="mainData.ip1"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.ip2"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.ip3"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.ip4"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="newSettlePlace"
                                        label="拟新放置地点">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index === 0" style="width: 100%">
                                            <el-input style="width: 50px" v-model="mainData.new_ip1"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.new_ip2"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.new_ip3"></el-input>-
                                            <el-input style="width: 50px" v-model="mainData.new_ip4"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>-->
                                <el-table-column
                                        prop="replaceReason"
                                        width="200"
                                        label="位置变更原因">
                                    <template slot-scope="scope">
                                        <div style="width: 100%">
                                            <el-input v-model="scope.row.replaceReason" type="textarea" :rows="2"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>

                    </ice-form-group>

                    <ice-grid-layout :columns="1" name="原位置机房管理员的确认信息">
                        <el-form-item label="原位置复核" prop="devRepairList" label-width="140px">
                            <el-checkbox-group v-model="mainData.confirmReceiveDev" >
                                <el-checkbox label="1" style="width: 130px"
                                             key="1">
                                    确认设备原位置无误
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="补充信息" prop="devRepairList" label-width="140px">
                            <el-input type="textarea" :rows="2"
                                      v-model="mainData.auditReviewResult"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <!--<ice-grid-layout :columns="1" name="运维工程师执行情况记录">
                        <div class="grid-bar" style="width: 100%;">
                            <div style="margin-bottom: 2px">
                                <el-button type="primary" @click="addDetailItem">新增</el-button>
                            </div>
                            <ice-editable-table :data="replaceDevData" style="width: 100%"
                                                v-model="replaceDevData"
                                                ref="editTable">
                                <el-table-column :width="150" label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="newPlace"
                                                           label="新放置地点"
                                                           :width="300">
                                </ice-editable-table-column>
                                <ice-editable-table-column prop="masterIp"
                                                           label="IP地址"
                                                           :width="300">
                                </ice-editable-table-column>

                                <el-table-column label="操作" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-grid-layout>-->

                    <ice-grid-layout :columns="1" name="新位置机房管理员的确认信息">
                        <el-form-item label="新位置复核" prop="devRepairList" label-width="140px">
                            <el-checkbox-group v-model="mainData.confirmReceiveDev">
                                <el-checkbox label="1" style="width: 130px"
                                             key="1">
                                    确认设备原位置无误
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>

                        <el-form-item label="补充信息" prop="devRepairList" label-width="140px">
                            <el-input type="textarea" :rows="2"
                                      v-model="mainData.auditReviewResult"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="1" name="台账审核相关记录">
                        <el-form-item label="审核台账的记录:"  prop="otherOper">
                            <el-input type="textarea" :rows="3"
                                      v-model="mainData.devManagerCheckLog"></el-input>
                        </el-form-item>

                        <el-form-item layout="3" label="附件上传:" label-width="105px" prop="remark">
                            <ice-multiple-upload></ice-multiple-upload>
                        </el-form-item>

                        <el-form-item label="备注:"  prop="devManagerRemark">
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
    import IceMultipleUpload from "../../../../components/common/base/IceMultipleUpload";
    import IceDialog from "../../../../components/common/base/IceDialog";
    export default {
        name: "edit",
        components: {
            IceDialog,
            IceMultipleUpload,
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
                    childList:[],
                    confirmReceiveDev:[]
                },
                gridData: [{
                    date: 'adsf',
                    name: 'qwer',
                    address: 'qwer',
                    c:'qewr123'
                }, {
                    date: 'tyurtyu',
                    name: 'qwfghgjer',
                    address: 'q2141234wer',
                    c:'qewrgfhjt123'
                },],
                rulesReport:{//字段规则

                },
                devCorrelation:[],              //关联设备数据
                replaceSettleDevData:[],                    //出网设备数据
                columnsOuter:[],                //出网设备列表展示信息
                devSelectShow:false,           //设备选择弹窗的开关属性
                devId:'devId',                 //用于关联设备和出网设备的参数
                chooseItem:'multiple',          //出网信息是多选还是单选--single单选，multiple多选
                addButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveData}
                ],
                visible:false,
                editData:{
                    devId:'',
                    devSn:'',
                    associateDevSn:'',
                    oldSettlePlace:'',
                    newSettlePlace:'',
                    replaceReason:''
                },
                curChoosedHw:[],//当前选中的设备的关联硬件
                assoHwUnInfoList:[],//关联硬件拆除信息
                assoDevList:[],//选择的数据集合--用于删除选中的硬件拆除
                engineerDelList:[],//选择的数据集合--用于删除选中的工程师操作记录
                engineerOperData:[],//工程师执行记录
                replaceDevData:[],//待拆卸硬件

                wantReplaceDevs:[
                    {replaceReason:'',a:'',b:'',c:'',d:'',e:'',f:'',g:'',h:'',devSn:'13qrew'}
                ],//申请放置地点变更的设备
                columnsDevReplace:[],//
                delOperateDevs:[],//当前选中的需要删除的设备
                action:'',//当前动作来源，1为选择设备，2为选择关联设备
                totalSize:0,
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
                        if (_this.findSameRowByCode(_this.replaceSettleDevData, data[i].devId, _this.devId) == -1) {
                            _this.loadDevById(data[i].devId).then(res => {
                                if(res.dataDTO && res.dataDTO.commDTO){
                                    arrObj.push(res.dataDTO.commDTO)
                                }
                                if(i == data.length-1){
                                    if(_this.checkData(arrObj,_this.replaceSettleDevData)){
                                        for (let i=0;i<arrObj.length;i++){
                                            arrObj[i].devId = arrObj[i].oid;
                                            arrObj[i].netAreaAndType = _this.onNetAndTypeRenderer(arrObj[i].netArea,arrObj[i].netType,arrObj[i].useFor);
                                            _this.replaceSettleDevData.push(arrObj[i]);
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

                _this.combinationData();
            },
            /**组装表格数据*/
            combinationData(){
                let associateDevs = this.devCorrelation
                // debugger
                // this.wantReplaceDevs = [
                    //     {devSn:'',associateDevSn:'',oldSettlePlace:'',newSettlePlace:'',replaceReason:''},
                    // ]
                let wantReplaceDevs = []
                let temp = {devSn:this.replaceSettleDevData[0].devSn,associateDevSn:'',oldSettlePlace:'123',newSettlePlace:'',replaceReason:''}
                associateDevs.forEach(item =>{
                    temp.associateDevSn = item.devSn;
                    wantReplaceDevs.push(temp)
                })
                this.wantReplaceDevs = wantReplaceDevs;
                this.totalSize = wantReplaceDevs.length
                // debugger;
            },
            /**
             * 检查选择的设备是否符合条件
             */
            checkData(data,arr){
                //1、保密员可提交其部门的所有设备出网
                //2、责任人可提交本人设备出网
                // let deptCode = '';
                // let dutyCode = '';
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
                    dev:'',
                    needUninstallHw:'',
                    reason:'',
                    unInstallDate:'',
                    desc:''
                }
                this.visible = true;
            },
            /**关联设备--删除*/
            deleteReplaceHardware(){
                if (this.assoDevList.length > 0) {
                    this.deletes(this.assoHwUnInfoList, this.assoDevList);
                    // this.deleteCorrelationList(this.assoDevList,this.assoHwUnInfoList);
                    this.assoDevList = [];
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
                    this.replaceSettleDevData = this.mainData.detailList;
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
                this.mainData.detailList = this.replaceSettleDevData;
                this.mainData.childList = this.devCorrelation;
                return this.mainData;
            },
            /**
             * 初始化页面控件
             * @returns {*}
             */
            initControls() {
                // this.columnsDevReplace = [
                //     {label: '设备id',code: 'devId',hidden: true},
                //     {label: '设备编号',code: 'devSn'},
                //     {label: '关联设备的设备编号', code: 'associateDevSn'},
                //     {label: '原放置地点', code: 'oldSettlePlace'},
                //     {label: '拟新放置地点', code: 'newSettlePlace'},
                //     {label: '位置变更原因', code: 'replaceReason'}
                // ]
                // devId:'',
                //     devSn:'',
                //     associateDevSn:'',
                //     oldSettlePlace:'',
                //     newSettlePlace:'',
                //     replaceReason:''
                // this.wantReplaceDevs = [
                //     {devSn:'',associateDevSn:'',oldSettlePlace:'',newSettlePlace:'',replaceReason:''},
                // ]
            },
            rowsSelected(rows){
                this.delOperateDevs = rows;
            },
            saveData(){
                this.wantReplaceDevs.push(this.editData)
                this.visible = false;
            },
            //选择宿主设备相关信息
            chooseDevice(action){
                this.action = action;
                this.devSelectShow = true;
                this.$nextTick(()=>{
                    this.$refs.devSelect.openDialog();
                });
            },
            addDetailItem(){
                let aa ={newPlace:'',masterIp:''}
                this.replaceDevData.push(aa)
            },
            addParasitiferDev(){
                this.visible = true
            },
            deleteParasitiferDev(){

            },
            /**
             * 合并单元格
             * 参数：当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
             * 返回值：[a,b] a为rowspan,b为colspan
             *
             */
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if(rowIndex === 0){
                        return [this.totalSize,1]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 0){
                        return [this.totalSize,1]
                    }else{
                        return [0,0]
                    }
                }else if(columnIndex === 3){
                    if(rowIndex === 0){
                        return [this.totalSize,1]
                    }else{
                        return [0,0]
                    }
                }else{
                    if(rowIndex === 0){
                        return [this.totalSize,1]
                    }else{
                        return [0,0]
                    }
                }
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
