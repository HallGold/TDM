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

                    <ice-form-group name="安全保密产品信息">
                        <div style="margin-bottom: 2px">
                            <el-button type="primary">新增</el-button>
                            <el-button type="primary">删除</el-button>
                        </div>
                        <div style="width: 100%">
                            <el-table :data="tableData">
                                <el-table-column width="50px" type="selection"></el-table-column>
                                <el-table-column width="50px" type="index" label="序号"></el-table-column>
                                <el-table-column label="设备编号" prop="a"></el-table-column>
                                <el-table-column label="设备名称" prop="b"></el-table-column>
                                <el-table-column label="待卸载的安全保密产品" width="240px">
                                    <template slot-scope="scope">
                                        <!--<el-select v-model="scope.row.c" collapse-tags multiple>
                                            <el-option label="防病毒软件" value="1"></el-option>
                                            <el-option label="网络准入软件" value="2"></el-option>
                                            <el-option label="登陆保护软件" value="3"></el-option>
                                            <el-option label="主机监控与审计软件" value="4"></el-option>
                                            <el-option label="打印监控与审计软件" value="5"></el-option>
                                            <el-option label="三合一软件" value="6"></el-option>
                                        </el-select>-->
                                        <el-checkbox-group v-model="chanPing">
                                            <div style="width: 100%">
                                                <el-checkbox label="防病毒软件"></el-checkbox>
                                            </div>
                                            <div style="width: 100%">
                                                <el-checkbox label="网络准入软件"></el-checkbox>
                                            </div>
                                            <div style="width: 100%">
                                                <el-checkbox label="登陆保护软件"></el-checkbox>
                                            </div>
                                            <div style="width: 100%">
                                                <el-checkbox label="主机监控与审计软件"></el-checkbox>
                                            </div>
                                            <div style="width: 100%">
                                                <el-checkbox label="打印监控与审计软件"></el-checkbox>
                                            </div>
                                            <div style="width: 100%">
                                                <el-checkbox label="三合一软件"></el-checkbox>
                                            </div>

                                        </el-checkbox-group>
                                    </template>
                                </el-table-column>
                                <el-table-column label="是否回收License">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.h">
                                            <el-option label="是" value="1"></el-option>
                                            <el-option label="否" value="0"></el-option>
                                        </el-select>
                                    </template>
                                </el-table-column>
                                <el-table-column label="卸载原因">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.d" type="textarea" :rows="8"></el-input>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!--<el-form-item label="" label-width="1px" prop="deleteDataCapacity">

                            <el-table
                                    :data="editTables"
                                    border
                                    style="width: 100%">
                                <el-table-column
                                        prop="devSn"
                                        label="设备编号"
                                        width="180">
                                    <template slot-scope="scope">
                                        <el-input v-model="mainData.devSn" :disabled="true">
                                            <el-button slot="append" icon="el-icon-edit" @click="chooseDevice"></el-button>
                                        </el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="devName"
                                        label="设备名称">
                                    <template slot-scope="scope">
                                        <el-input v-model="mainData.devName" :disabled="true"></el-input>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="devCategory"
                                        label="待卸载的安全保密产品">
                                    <template slot-scope="scope">
                                        <el-checkbox-group v-model="mainData.devCategory" :max="1">
                                            <el-checkbox v-for="column in ENUMS.SAFE_SECRECY_PRODUCT_TYPE.TYPES" :label="column.CODE"
                                                         style="width: 130px;display: block"
                                                         :key="column.CODE">
                                                {{column.NAME}}
                                            </el-checkbox>
                                        </el-checkbox-group>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="reclaimLicense"
                                        label="是否回收License">
                                    <template slot-scope="scope">
                                        <el-radio v-model="mainData.reclaimLicense" label="1" >是</el-radio>
                                        <el-radio v-model="mainData.reclaimLicense" label="0" >否</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="uninstallReason"
                                        label="卸载原因">
                                    <template>
                                        <div style="height: 100%;width: 100%">
                                            <el-input type="textarea" :rows="6"
                                                      v-model="mainData.uninstallReason"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </el-form-item>-->
                    </ice-form-group>

                    <ice-grid-layout :columns="1" name="安全保密管理员实施记录">
                        <el-form-item label="" label-width="10px" prop="safeManagerOperLog">
                            <!--<el-table
                                    :data="safeManagerOperTable"
                                    :span-method="arraySpanMethod"
                                    border
                                    :show-header="false"
                                    style="width: 100%">
                                <el-table-column
                                        prop="column1"
                                        label="column1">
                                    
                                </el-table-column>
                                <el-table-column
                                        prop="column2"
                                        label="column2">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index === 0">
                                            <span>{{scope.row.column2}}</span>
                                        </div>
                                        <div v-if="scope.$index === 1">
                                            <el-input v-model="safeManagerOperData.bigCategory">
                                                <el-button slot="append" icon="el-icon-edit" @click="chooseTechServeBigCategory"></el-button>
                                            </el-input>
                                        </div>
                                        <div v-if="scope.$index === 2">
                                            <el-input v-model="safeManagerOperData.serveOption">
                                            </el-input>
                                        </div>

                                        <div v-if="scope.$index === 5" style="width: 100%">
                                            <el-input v-model="safeManagerOperData.otherOper" type="textarea" :rows="2">
                                            </el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="column3"
                                        label="column3">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index ===1 || scope.$index === 2 || scope.$index === 0">
                                            <span>{{scope.row.column3}}</span>
                                        </div>
                                        <div v-if="scope.$index === 3">
                                            <el-checkbox-group v-model="safeManagerOperData.productType" :max="1">
                                                <el-checkbox v-for="column in ENUMS.SAFE_SECRECY_PRODUCT_TYPE.TYPES" :label="column.CODE"
                                                             style="width: 130px;display: block"
                                                             :key="column.CODE">
                                                    {{column.NAME}}
                                                </el-checkbox>
                                            </el-checkbox-group>
                                        </div>

                                        <div v-if="scope.$index === 4">
                                            <el-radio v-model="safeManagerOperData.isRegainLicense" label="1">是</el-radio>
                                            <el-radio v-model="safeManagerOperData.isRegainLicense" label="0">否</el-radio>
                                        </div>

                                        <div v-if="scope.$index === 5">
                                            <el-input type="textarea" :rows="2"
                                                      v-model="editData.uninstallReason"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                        prop="column4"
                                        label="column4">
                                    <template slot-scope="scope">
                                        <div v-if="scope.$index === 0">
                                            <span>{{scope.row.column4}}</span>
                                        </div>
                                        <div v-if="scope.$index === 1">
                                            <el-input v-model="safeManagerOperData.serveCategory" :disabled="true"></el-input>
                                        </div>
                                        <div v-if="scope.$index === 2">
                                            <el-input v-model="safeManagerOperData.alterationObject" :disabled="true"></el-input>
                                        </div>
                                    </template>
                                </el-table-column>
                            </el-table>-->
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="1" name="安全审计员的审计意见" >
                        <el-form-item label="备注:"  prop="auditReviewResult">
                            <el-input placeholder="备注" type="textarea" :rows="3"
                                      v-model="mainData.auditReviewResult"></el-input>
                        </el-form-item>
                    </ice-grid-layout>

                    <ice-grid-layout :columns="1" name="设备管理员核对台账信息">
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
                    :multiple="false"
                    :on-close-handler="selectOverHandler"></dev-select>
        <pro-sc-common-tech-catalog-tree @tree-check="techTreeChecked"></pro-sc-common-tech-catalog-tree>

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
    import IceMultipleUpload from "@/components/common/base/IceMultipleUpload";
    import ProScCommonTechCatalogTree from "../../../pro/sc/common/ProScCommonTechCatalogTree";
    export default {
        name: "edit",
        components: {
            ProScCommonTechCatalogTree,
            DevSelect,
            IceQueryGrid,
            IceFormGroup,
            IceGridLayout,
            IceFlowForm,
            IceMultipleUpload},
        mixins:[bizComm,devComm,renderer],
        data(){
            return{
                chanPing:[],
                activeNames: ['1'],
                checkAll: false,
                checkedCities: ['上海', '北京'],
                cities: ['防病毒软件', '网络准入软件', '登陆保护软件', '主机监控与审计软件','打印监控与审计软件','三合一软件'],
                isIndeterminate: true,
                tableData:[{a:'asdf',b:'asdf',c:'qwer'}],
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
                    devCategory:[]
                },
                rulesReport:{//字段规则

                },
                devCorrelation:[],              //关联设备数据
                secrecyProductList:[],          //安全保密产品卸载集合
                columnsCorrelation:[],          //关联设备列展示信息
                columnsOuter:[],                //出网设备列表展示信息
                devSelectShow:false,           //设备选择弹窗的开关属性
                devList:[],                    //选择的数据集合--用于列表删除操作
                devId:'devId',                 //用于关联设备和出网设备的参数
                chooseItem:'multiple',          //出网信息是多选还是单选--single单选，multiple多选
                operateTable:[],
                sysOperTable:[],
                editTables:[],
                addButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveData}
                ],
                visible:false,
                editData:{
                    devId:'',//设备id
                    product:'',//设备编号
                    productName:'',//设备名称
                    productType:'',//设备类型
                    isRegainLicense:'1',//是否回收license 1是,0否
                    uninstallReason:''//卸载原因
                },
                curChoosedHw:[],//当前选中的设备的关联硬件
                assoHwUnInfoList:[],//关联硬件拆除信息
                assoDevList:[],//选择的数据集合--用于删除选中的硬件拆除
                engineerDelList:[],//选择的数据集合--用于删除选中的工程师操作记录
                columnsEngineer:[],//
                engineerOperData:[],//工程师执行记录
                isEngineerOper:false,//是否为工程师填写记录
                percent:0,//上传百分比
                /*safeManagerOperTable:[
                    {column1:'设备编号',column2:this.mainData.devSn,column3:'设备名称',column4:this.mainData.devName},
                    {column1:'服务大类',column2:'',column3:'服务分类',column4:''},
                    {column1:'服务项',column2:'',column3:'变更对象',column4:''},
                    {column1:'卸载的安全保密产品',column2:'',column3:'',column4:''},
                    {column1:'是否回收License',column2:'',column3:'',column4:''},
                    {column1:'其他操作',column2:'',column3:'',column4:''},
                ],*/
                safeManagerOperData:{
                    productType:[]
                }
            }
        },
        methods:{
            /**
             * 设备选择弹窗--选择的数据
             */
            selectOverHandler(datas){
                let _this = this;
                return new Promise((resolve, reject) => {
                    let arr = [];
                    Object.assign(arr,this.editTables);
                    if(datas.length>0){
                        _this.mainData.devId = datas[0].oid
                        _this.mainData.devSn = datas[0].devSn
                        _this.mainData.devName = datas[0].name
                    }
                    this.editTables = arr;
                    _this.devSelectShow = false;
                    resolve();
                });
            },
            /**流程初始化所带的数据*/
            flowReady(flowcont, bizdata, flowNodes) {
                if(flowcont.nodeId!='FirstNode'){
                    this.mainData = bizdata;
                    this.secrecyProductList = this.mainData.detailList;
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
                this.mainData.detailList = this.secrecyProductList;
                this.mainData.childList = this.devCorrelation;
                return this.mainData;
            },
            /**
             * 初始化页面控件
             * @returns {*}
             */
            initControls() {
                this.editTables = [
                    {devSn:'',devName:'',devCategory:'',reclaimLicense:'',uninstallReason:''},
                ]
            },
            editDevRepairTask(){//回执单
                alert('待开发')
            },
            saveData(){

                this.secrecyProductList.push(this.editData)

                this.visible = false;
            },
            /**
             * 合并单元格
             * 参数：当前行row、当前列column、当前行号rowIndex、当前列号columnIndex四个属性
             * 返回值：[a,b] a为rowspan,b为colspan
             *
             */
            arraySpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if(rowIndex === 3){
                        return [1,2]
                    }else if(rowIndex === 4){
                        return [1,2]
                    }else if(rowIndex === 5){
                        return [1,1]
                    }
                }else if(columnIndex === 1){
                    if(rowIndex === 3){
                        return [0,0]
                    }else if(rowIndex === 4){
                        return [0,0]
                    }else if(rowIndex === 5){
                        return [1,3]
                    }
                }else if(columnIndex === 2){
                    if(rowIndex === 3){
                        return [1,2]
                    }else if(rowIndex === 4){
                        return [1,2]
                    }else if(rowIndex === 5){
                        return [0,0]
                    }
                }else{
                    if(rowIndex === 3){
                        return [0,0]
                    }else if(rowIndex === 4){
                        return [0,0]
                    }else if(rowIndex === 5){
                        return [0,0]
                    }
                }
            },
            chooseTechServeBigCategory(){//选择技术服务目录数据
                
            },
            techTreeChecked(currentCheckedNode, nodeStatus){//选中的技术服务目录的数据

            },
            chooseDevice(){
                this.devSelectShow = true;
                this.$nextTick(() => {
                    this.$refs.devSelect.openDialog();
                });
            }
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
