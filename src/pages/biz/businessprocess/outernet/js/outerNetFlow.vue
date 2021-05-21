<template>
    <div class="form-content">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :model="mainData" status-icon :rules="rulesReport" ref="bizForm" label-width="100px">
                    <ice-grid-layout :columns="2" name="申请人信息" >
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

                    <ice-grid-layout :columns="2" name="责任人信息" >
                        <el-form-item label="拟定新责任人" prop="dutyPersonName">
                            <el-input v-model="mainData.dutyPersonName"
                                      readonly
                                      placeholder="请选择责任人">
                                <el-button @click="choosePeople" icon="el-icon-user-solid" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item  label="责任部门" prop="dutyDeptName">
                            <el-input v-model="mainData.dutyDeptName"></el-input>
                        </el-form-item>
                        <el-form-item label="拟定新状态"  prop="newStatus">
                            <el-select v-model="mainData.newStatus">
                                <el-option v-for="item in ENUMS.HARDWARE_REPLACE_TYPE.UNINSTALL_HARDWARE_STATUS.TYPES"
                                           :key="item.CODE"
                                           :label="item.NAME"
                                           :value="item.CODE"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="拟存放地点"  prop="newSettlePlace">
                            <el-input v-model="mainData.newSettlePlace"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-form-group name="出网设备信息">
                        <div style="margin-bottom: 2px;">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addOuter" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <!--<el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteOuter" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>-->
                        </div>
                        <div style="width: 100%">
                            <el-table
                                    class="el-table--scrollable-y"
                                    :data="devOuter"
                                    ref="tbl"
                                    default-expand-all
                                    style="width: 100%;margin-bottom: 20px;"
                                    :height="300"
                                    @select="onselect"
                                    @select-all="selectAll"
                                    row-key="oid">
                                <el-table-column
                                        type="selection"
                                        width="50">
                                </el-table-column>
                                <!--<el-table-column
                                        label="序号"
                                        type="index"
                                        width="50">
                                </el-table-column>-->
                                <el-table-column
                                        align="left"
                                        prop="devSn"
                                        label="设备编号">
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="childType"
                                        label="设备子类">
                                    <!--<template slot-scope="scope">
                                        {{onChildTypeRenderer(scope.row.childType)}}
                                    </template>-->
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.childType">
                                            <el-option label="子类一" value="1"></el-option>
                                            <el-option label="子类二" value="2"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="category"
                                        label="设备类型">
                                </el-table-column>

                                <el-table-column
                                        align="center"
                                        prop="secretSn"
                                        label="保密编号" >
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="sn"
                                        label="资产编号" >
                                </el-table-column>
                                <el-table-column
                                        align="center"
                                        prop="secretLevel"
                                        label="密级">
                                    <template slot-scope="scope">
                                        {{getNameByCode(ENUMS.DATA_SECRET_LEVEL_DATA,scope.row.secretLevel)}}
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" @click="()=>{$message('测试用');aaa = true;}">编辑</el-button>
                                        <el-button type="text" @click="()=>{$message('测试用')}">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--<ice-query-grid :gridData="devOuter"
                                        :columns="columnsOuter"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :chooseItem="chooseItem"
                                        :pagination="false"
                                        @selection-change="devRowsOuter"></ice-query-grid>-->
                    </ice-form-group>
                    <!--<ice-form-group name="关联设备">
                        &lt;!&ndash;<div style="margin-bottom: 2px;">
                            <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                       :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                       @click="addCorrelation" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                            <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                       :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                       @click="deleteCorrelation" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                        </div>&ndash;&gt;
                        <ice-query-grid :gridData="devCorrelation"
                                        :columns="columnsCorrelation"
                                        ref="devGrid"
                                        :minHeight="200"
                                        :pagination="false"
                                        @selection-change="devRowsCorrelation"></ice-query-grid>
                    </ice-form-group>-->
                    <ice-grid-layout :columns="2" name="申请原因">
                        <el-form-item label="保密措施"  prop="" layout="2">
                            <el-input v-model="mainData.q" type="textarea" rows="3" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="出网原因"  prop="afReason" layout="2">
                            <el-input v-model="mainData.afReason" type="textarea" rows="3"  :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="备注"  prop="" layout="2">
                            <el-input v-model="mainData.remark" type="textarea" rows="3"  :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-form-group :columns="1" name="一线运维办理情况">
                        <div class="grid-bar" style="width: 100%;">
                            <div style="margin-bottom: 2px">
                                <el-button type="primary" :icon="COMM_ENUMS.BUTTON.ADD.icon" @click="addDetailItem">新增变更申请</el-button>
                            </div>
                            <ice-editable-table :data="operateTable" style="width: 100%"
                                                v-model="operateTable"
                                                :rules="tableRules"
                                                ref="operateTable">
                                <el-table-column :width="150" label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="workTask"
                                                           label="关联变更单"
                                                           :width="500"
                                                           input-type="input">
                                </ice-editable-table-column>

                                <el-table-column label="操作" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">【绑定】
                                        </el-button>
                                        <el-button type="text"
                                                   size="small" @click="deleteDetailItem(scope.$index)">【解绑】
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>

                    <ice-form-group :columns="1" name="管理员办理情况">
                        <div class="grid-bar" style="width: 100%;">
                            <div style="margin-bottom: 2px">
                                <el-button type="primary" :icon="COMM_ENUMS.BUTTON.ADD.icon" @click="addManagerDetailItem">新增变更申请</el-button>
                            </div>
                            <ice-editable-table :data="managerTable" style="width: 100%"
                                                v-model="managerTable"
                                                :rules="tableRules"
                                                ref="tableRules">
                                <el-table-column :width="150" label="序号">
                                    <template slot-scope="scope">
                                        {{scope.$index+1}}
                                    </template>
                                </el-table-column>
                                <ice-editable-table-column prop="workTask"
                                                           label="关联变更单"
                                                           :width="500"
                                                           input-type="input">
                                </ice-editable-table-column>

                                <el-table-column label="操作" fixed="right">
                                    <template slot-scope="scope">
                                        <el-button type="text"
                                                   size="small" @click="delManagerDetailItem(scope.$index)">【绑定】
                                        </el-button>
                                        <el-button type="text"
                                                   size="small" @click="delManagerDetailItem(scope.$index)">【解绑】
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>

                    <ice-grid-layout :columns="1" name="维修工程师办理情况">
                        <!--<a @click="editDevRepairTask">回执单</a>-->
                        <el-form-item label="设备清除情况描述" prop="devRepairList" label-width="140px">
                            <el-input type="textarea" rows="3" v-model="mainData.repairDesc"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="1" name="保密员办理情况">
                        <el-form-item label="是否已归库" prop="isReturnStore">
                            <el-radio v-model="mainData.isReturnStore" label="1">是</el-radio>
                            <el-radio v-model="mainData.isReturnStore" label="0">否</el-radio>
                        </el-form-item>
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
    </div>
</template>

<script>
    import IceFlowForm from "@/components/common/base/IceFlowForm";
    import IceGridLayout from "@/components/common/base/IceGridLayout";
    import IceFormGroup from "@/components/common/base/IceFormGroup";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import bizComm from "@/pages/biz/js/comm";
    import devComm from "@/pages/biz/dev/js/comm/devComm.js";
    import IceQueryGrid from "../../../../../components/common/base/IceQueryGrid";
    import DevSelect from "../../../dev/devSelect";
    import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
    import IceEditableTable from "@/components/common/base/IceEditableTable";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    export default {
        name: "outerNetFlow",
        components: {
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
                aaa:false,
                mainData:{//表单对象
                    afUserName:'',
                    afDepartmentName:'',
                    afPhone:'',
                    afDate:'',
                    afReason:'',
                    dutyPersonName:'',//责任人名称
                    dutyPersonCode:'',//责任人编号
                    dutyDeptName:'',//责任人所在部门名称
                    dutyDeptCode:'',//责任人所在部门编号
                    q:'',
                    remark:'',
                    detailList:[],
                    childList:[]
                },
                rulesReport:{//字段规则

                },
                tableRules: {//参考指标字段的验证规则
                    workTask: {required: true, message: '变更单号不能为空', trigger: 'change'}
                },
                devCorrelation:[],              //关联设备数据
                devOuter:[
                    {oid:1,devSn:'123',secretSn:'sh_cc13462',childType:'应用系统',category:'应用系统',secretLevel:'3',sn:'456',children:[{
                            oid:2,devSn:'456',secretSn:'sh_cc13462',childType:'应用系统',category:'应用系统',secretLevel:'2',sn:'456',children:[]
                        }]},
                    {oid:3,devSn:'adsf',secretSn:'adsf',childType:'应用系统',category:'应用系统',secretLevel:'3',sn:'456',children:[{
                            oid:4,devSn:'asdf',secretSn:'asdf',childType:'应用系统',category:'应用系统',secretLevel:'2',sn:'456',children:[]
                        }]}
                ],                    //出网设备数据
                columnsCorrelation:[],          //关联设备列展示信息
                columnsOuter:[],                //出网设备列表展示信息
                devSelectShow:false,           //设备选择弹窗的开关属性
                devList:[],                    //选择的数据集合--用于列表删除操作
                devId:'devId',                 //用于关联设备和出网设备的参数
                chooseItem:'multiple',          //出网信息是多选还是单选--single单选，multiple多选
                operateTable:[],//一线运维办理情况
                managerTable:[],//管理员办理情况
                tableData:[],
                isTrue:false,
            }
        },
        methods:{
            selectAll(selection){
                this.isTrue = this.isTrue?false:true;
                this.hasChild(this.devOuter,this.isTrue);
            },
            hasChild(arr,isTrue){
                arr.forEach(item=>{
                    this.$refs.tbl.toggleRowSelection(item,isTrue);
                    if(item.children&&item.children.length>0){
                        this.hasChild(item.children,isTrue);
                    }
                })
                /*for(let i=0;i<arr.length;i++){
                    debugger;
                    this.$refs.tbl.toggleRowSelection(arr[i],isTrue);
                    if(arr[i].children&&arr[i].children.length>0){
                        this.hasChild(arr[i].children,isTrue);
                    }
                }*/
            },
            onselect(selection,row){
                if(selection.indexOf(row)>-1){
                    if(row.children&&row.children.length>0){
                        this.hasChild(row.children,true);
                    }
                }else{
                    if(row.children&&row.children.length>0){
                        this.hasChild(row.children,false);
                    }
                }
            },

            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(data){
                let _this = this;
                return new Promise((resolve, reject) => {
                    let arrObj = [];
                    for (let i = 0; i < data.length; i++) {
                        data[i].devId = data[i].oid;
                        if (_this.findSameRowByCode(_this.devOuter, data[i].devId, _this.devId) == -1) {
                            _this.loadDevById(data[i].devId).then(res => {
                                if(res.dataDTO && res.dataDTO.commDTO){
                                    arrObj.push(res.dataDTO.commDTO)
                                }
                                if(i == data.length-1){
                                    if(_this.checkData(arrObj,_this.devOuter)){
                                        for (let i=0;i<arrObj.length;i++){
                                            arrObj[i].devId = arrObj[i].oid;
                                            arrObj[i].netAreaAndType = _this.onNetAndTypeRenderer(arrObj[i].netArea,arrObj[i].netType,arrObj[i].useFor);
                                            _this.devOuter.push(arrObj[i]);
                                            arrObj[i].children = arrObj[i].children?arrObj[i].children:[];
                                            _this.loadDevById(arrObj[i].devId).then(res=>{
                                                _this.getCorrelationData(res,arrObj[i].children);
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
            getCorrelationData(data,child){
                let arr = data.dataDTO.dependDTOList ? data.dataDTO.dependDTOList : [];
                /*let _this = this;*/
                if(arr.length>0){
                    arr.forEach(item=>{
                        if(item.dependDevDTO&&item.dependDevDTO.commDTO){
                            item.dependDevDTO.commDTO.devId = item.devId;
                            /*_this.devCorrelation.push(item.dependDevDTO.commDTO);*/
                            child.push(item.dependDevDTO.commDTO)
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
                this.$refs.correlation.addItem();
            },
            /**关联设备--删除*/
            deleteCorrelation(){
                this.$refs.correlation.deleteItem();
            },
            /**出网设备--新增*/
            addOuter(){
                this.devSelectShow = true;
                this.$nextTick(()=>{
                    this.$refs.devSelect.openDialog();
                });
            },
            /**出网设备--删除*/
            deleteOuter(){
                if (this.devList.length > 0) {
                    this.deletes(this.devOuter, this.devList);
                    this.deleteCorrelationList(this.devList,this.devCorrelation);
                    this.devList = [];
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
                    this.devOuter = this.mainData.detailList;
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
                this.mainData.detailList = this.devOuter;
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
                    {code: 'devId', hidden: true},
                    {label: '设备子类', code: 'childType',renderCell(h, data) {
                            if(data.row.childType){
                                return _this.onChildTypeRenderer(data.row.childType);
                            }
                            return data.row.childType
                        }},
                    {label: '资产编号', code: 'sn'},
                    {label: '保密编号', code: 'secretSn'},
                    {label: '责任人', code: 'dutyName'},
                    {label: '密级', code: 'secretLevel',renderCell(h, data) {
                            if(data.row.secretLevel){
                                return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA,data.row.secretLevel);
                            }
                            return data.row.secretLevel
                        }}
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
                ]
            },
            /**
             * 出网设备列选择的数据
             */
            devRowsOuter(rows){
                this.devList = rows;
            },
            devRowsCorrelation(rows){

            },
            deleteDetailItem(index){
                this.operateTable.splice(index, 1);
            },
            addDetailItem(){
                this.operateTable.push({workTask: ''});
            },
            delManagerDetailItem(){
                this.managerTable.splice(index, 1);
            },
            addManagerDetailItem(){
                this.managerTable.push({workTask: ''});
            },
            editDevRepairTask(){//回执单
                alert('待开发')
            },
            /**选人--form表单*/
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
</style>
