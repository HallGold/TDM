<template>
    <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
        <el-dialog v-dialogDrag title="策略配置" custom-class="ice-dialog" center :visible.sync="dialogVisible"
                   width="1100px" append-to-body :close-on-click-modal="false" >
            <div class="ice-container">
                <el-form :model="mainDataForm"
                         label-position="right"
                         class="conditon-bar"
                         :rules="mainRules"
                         ref="formmain"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="策略编码:" label-width="100px" prop="datapolicyCode">
                                <el-input placeholder="策略编码" v-model="mainDataForm.datapolicyCode" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="策略名称:" label-width="100px" prop="datapolicyName">
                                <el-input placeholder="策略名称" v-model="mainDataForm.datapolicyName" maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="8">
                            <el-form-item label="适用操作:" label-width="100px" prop="name">
                                <!-- <el-checkbox-group v-model="mainDataForm.name">-->
                                <el-checkbox :true-label=1 :false-label=0 label="查询" v-model="mainDataForm.validSelect"></el-checkbox>
                                <el-checkbox :true-label=1 :false-label=0 label="修改" v-model="mainDataForm.validUpdate"></el-checkbox>
                                <el-checkbox :true-label=1 :false-label=0 label="删除" v-model="mainDataForm.validDelete"></el-checkbox>
                                <!-- </el-checkbox-group>-->
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="优先级:" label-width="100px" prop="datapolicyPirority">
                                <el-select placeholder="优先级" v-model="mainDataForm.datapolicyPirority">
                                    <el-option label="一般" value="10"></el-option>
                                    <el-option label="强制" value="20"></el-option>
                                    <el-option label="系统强制" value="99"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="合并模式:" label-width="100px" prop="datapolicyOperator">
                                <el-select placeholder="合并模式" v-model="mainDataForm.datapolicyOperator">
                                    <el-option label="OR" value="1"></el-option>
                                    <el-option label="AND" value="2"></el-option>
                                </el-select>
                            </el-form-item>

                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="12">
                            <el-form-item label="表名:" label-width="100px">
                                <el-input placeholder="表名" v-model="this.tableCode" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="表中文名:" label-width="100px">
                                <el-input placeholder="表中文名" v-model="this.tableName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="save">保存策略库</el-button>
                    <el-button type="info" @click="celue">套用策略库策略</el-button>
                </div>
                <div class="ice-streak"></div>
                <div><el-button type="text" icon="el-icon-menu">条件表达式</el-button></div>
                <div class="ice-grid-button-bar">

                    <el-button type="primary" icon="el-icon-plus" @click="addField">添加字段</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="addExpression">新增表达式</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="emptyColumn(detailGridData)">清空列表</el-button>
                    <!--<el-button type="primary" icon="el-icon-plus" @click="expressionVaild">表达式效验</el-button>-->
                </div>
                <div class="grid-bar">

                    <ice-editable-table :data="detailGridData" :rules="detailRules" ref="detailtable">
                        <el-table-column :width="50"
                                         label="序号">
                            <template slot-scope="scope">
                                {{scope.$index+1}}
                            </template>
                        </el-table-column>

                       <!-- <ice-editable-table-column prop="exprLpthesis"
                                                   label="左括号"
                                                   :width="110"
                                                   input-type="select"
                                                   map-type-code="aleft">
                        </ice-editable-table-column>-->
                        <el-table-column prop="exprLpthesis"
                                         label="左括号">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.exprLpthesis">
                                    <el-option label="(" value="("></el-option>
                                    <el-option label="((" value="(("></el-option>
                                    <el-option label="(((" value="((("></el-option>
                                    <el-option label="((((" value="(((("></el-option>
                                    <el-option label="NULL" value=" "></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <!--<ice-editable-table-column prop="exprType"
                                                   label="类型"
                                                   :width="110"
                                                   input-type="select"
                                                   map-type-code="exprTypes">
                        </ice-editable-table-column>-->
                        <el-table-column prop="exprType"
                                         label="类型"
                                         :width="110">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.exprType" @change="onSelectedDrug(scope.$index)">
                                    <el-option label="部门" value="110" ></el-option>
                                    <el-option label="部门及所有下级" value="120"></el-option>
                                    <el-option label="单位" value="210"></el-option>
                                    <el-option label="密级" value="300"></el-option>
                                    <el-option label="自定义" value="900"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column prop="fieldCode"
                                         :width="110"
                                         label="字段">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.fieldCode">
                                    <el-option v-for="item in scope.row.optionField"
                                               :key="scope.row.index"
                                               :label="item.label"
                                               :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <!--<ice-editable-table-column prop="operator"
                                                   label="操作符"
                                                   :width="110"
                                                   input-type="select"
                                                   map-type-code="handle">
                        </ice-editable-table-column>-->
                        <el-table-column prop="operator"
                                         :width="110"
                                         label="操作符">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择"  v-if="scope.row.exprType=='900'||scope.row.exprType==''" v-model="scope.row.operator">
                                    <el-option label="=" value="=" ></el-option>
                                    <el-option label="<" value="<"></el-option>
                                    <el-option label=">" value=">"></el-option>
                                    <el-option label=">=" value=">="></el-option>
                                    <el-option label="<=" value="<="></el-option>
                                    <el-option label="IN" value="IN"></el-option>
                                    <el-option label="NOT" value="NOT"></el-option>
                                    <el-option label="LIKE" value="LIKE"></el-option>
                                </el-select>
                                <el-select placeholder="请选择" v-if="scope.row.exprType=='110'" v-model="scope.row.operator">
                                    <el-option label="=" value="=" ></el-option>
                                    <el-option label="IN" value="IN"></el-option>
                                </el-select>
                                <el-select placeholder="请选择" v-if="scope.row.exprType=='120'" v-model="scope.row.operator">
                                    <el-option label="LIKE" value="LIKE"></el-option>
                                </el-select>
                                <el-select placeholder="请选择"  v-if="scope.row.exprType=='210'" v-model="scope.row.operator">
                                    <el-option label="=" value="=" ></el-option>
                                </el-select>
                                <el-select placeholder="请选择"  v-if="scope.row.exprType=='300'" v-model="scope.row.operator">
                                    <el-option label="=" value="=" ></el-option>
                                    <el-option label="<=" value="<="></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column prop="param"
                                         :width="170"
                                         label="参数值">
                            <template slot-scope="scope">
                                <el-input placeholder="参数值" v-model="scope.row.param" >
                                    <el-dropdown slot="append" placement="bottom-end">
                                        <el-button type="primary">
                                            <i class="el-icon-arrow-down el-icon--right"></i>
                                        </el-button>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item v-if="scope.row.operator=='IN'"><el-button @click="globalVar(scope.$index)" style="border: 0">全局参数变量选择</el-button></el-dropdown-item>
                                            <el-dropdown-item v-if="scope.row.operator!='IN'"><el-button @click="globalVarSingle(scope.$index)" style="border: 0">全局参数变量选择(单选)</el-button></el-dropdown-item>
                                            <el-dropdown-item v-if="scope.row.operator=='IN'"><el-button @click="dept(scope.$index)" style="border: 0">部门选择</el-button></el-dropdown-item>
                                            <el-dropdown-item v-if="scope.row.operator!='IN'"><el-button @click="deptSingle(scope.$index)" style="border: 0">部门选择(单选)</el-button></el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-input>
                            </template>
                        </el-table-column>

                        <!--<ice-editable-table-column prop="exprRpthesis"
                                                   :width="110"
                                                   label="右括号"
                                                   input-type="select"
                                                   map-type-code="aright">
                        </ice-editable-table-column>-->
                        <el-table-column prop="exprRpthesis"
                                         label="右括号">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.exprRpthesis" >
                                    <el-option label=")" value=")" ></el-option>
                                    <el-option label="))" value="))"></el-option>
                                    <el-option label=")))" value=")))"></el-option>
                                    <el-option label="))))" value="))))"></el-option>
                                    <el-option label="NULL" value=" "></el-option>
                                </el-select>
                                <!--<el-select placeholder="请选择" v-if="scope.row.exprLpthesis=='('" v-model="scope.row.exprRpthesis=')'">
                                    <el-option label=")" value=")" ></el-option>
                                </el-select>
                                <el-select placeholder="请选择" v-if="scope.row.exprLpthesis=='(('" v-model="scope.row.exprRpthesis='))'">
                                    <el-option label="))" value="))" ></el-option>
                                </el-select>
                                <el-select placeholder="请选择"  v-if="scope.row.exprLpthesis=='((('" v-model="scope.row.exprRpthesis=')))'">
                                    <el-option label=")))" value=")))" ></el-option>
                                </el-select>
                                <el-select placeholder="请选择"  v-if="scope.row.exprLpthesis=='(((('" v-model="scope.row.exprRpthesis='))))'">
                                    <el-option label="))))" value="))))" ></el-option>-->

                                <!--<el-select placeholder="请选择"  v-if="scope.row.exprLpthesis==' '" v-model="scope.row.exprRpthesis='NULL'">
                                    <el-option label="NULL" value=" " ></el-option>
                                </el-select>-->

                            </template>
                        </el-table-column>

                        <el-table-column prop="datapolicyOperator"
                                         label="逻辑操作符">
                            <template slot-scope="scope">
                                <el-select placeholder="请选择" v-model="scope.row.datapolicyOperator" v-if="scope.$index!=detailGridData.length-1" >
                                    <el-option label="AND" value="2"></el-option>
                                    <el-option label="OR" value="1"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作" :width="180">
                            <template slot-scope="scope">
                                <el-button type="text"
                                           size="small" @click="del(scope.$index,scope.row)">删除
                                </el-button>
                                <el-button type="text" v-if="scope.$index!=0"
                                           size="small" @click="moveup(scope.$index)">上移
                                </el-button>
                                <el-button type="text" v-if="scope.$index!=detailGridData.length-1"
                                           size="small" @click="movedown(scope.$index)">下移
                                </el-button>
                            </template>
                        </el-table-column>
                    </ice-editable-table>
                </div><br/>

                <div class="ice-container">
                    <el-row >
                        <el-col :span="24">
                            <el-input placeholder="表达式效验" type="textarea" :rows="4"
                                      v-model="detailGridDataText" ref="yy"></el-input>
                        </el-col>
                    </el-row>
                </div><br/>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="saveConfiguration">保存</el-button>
                    <el-button type="info" @click="retConfiguration">返回</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="全局字段变量选择" custom-class="ice-dialog" center :visible.sync="dialogVisibleChoose"
                   width=1100px append-to-body :close-on-click-modal="false">
            <TsysFieldLibChoose @select-confirm="selectConfirm"
                                chooseItem="multiple"
                                :pagination=false
                                :tableId="tableId"
                                @select-cannel="selectCannel"></TsysFieldLibChoose>
        </el-dialog>
        <el-dialog v-dialogDrag title="全局参数变量选择" custom-class="ice-dialog"
                   center :visible.sync="dialogVisibleGlobalVal"
                   width=1100px
                   append-to-body
                   :close-on-click-modal="false">
            <TsysCfgGlobalValChoose :chooseItem="cho"
                                    @select-confirm="selectConfirmVal"
                                    @select-cannel="selectCannelVal"></TsysCfgGlobalValChoose>
        </el-dialog>
        <el-dialog v-dialogDrag title="套用策略库策略" custom-class="ice-dialog"
                   center :visible.sync="dialogVisibleCl"
                   width=1100px
                   append-to-body
                   height=500px
                   :close-on-click-modal="false">
            <ice-query-grid title="套用策略库策略"
                            data-url="/datamanage/TsysLibDatapolicy/list"
                            :query="query"
                            :columns="columns"
                            ref="grid"
                            :operations="operations">
            </ice-query-grid>
        </el-dialog>
        <el-dialog v-dialogDrag title="保存到策略库" custom-class="ice-dialog" center :visible.sync="dialogVisibleStrategy"
                   width=600px append-to-body :close-on-click-modal="false">
            <div class="ice-container">
                <el-form :model="mainDataFormStrategy"
                         label-position="right"
                         class="conditon-bar"
                         ref="form"
                         :rules="formRulesStrategy"
                         style="margin-top: 20px">
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="数据策略编码" label-width="130px" prop="datapolicyCode">
                                <el-input placeholder="数据策略编码" v-model="mainDataFormStrategy.datapolicyCode">
                                    <template slot="prepend">{{this.tableCode}}</template>
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item  label="数据策略名称" label-width="130px" prop="datapolicyName">
                                <el-input placeholder="数据策略名称" v-model="mainDataFormStrategy.datapolicyName">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="60">
                        <el-col :span="24">
                            <el-form-item label="数据策略分类" label-width="130px" prop="datapolicyClass">
                                <el-select placeholder="数据策略分类" v-model="mainDataFormStrategy.datapolicyClass">
                                    <el-option v-for="item in optionStrategy"
                                               :key="item.value"
                                               :label="item.label"
                                               :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div class="ice-button-bar ">
                    <el-button type="primary" @click="saveStrategy">保存</el-button>
                    <el-button type="info" @click="retStrategy">返回</el-button>
                </div>
            </div>
        </el-dialog>
        <el-dialog v-dialogDrag title="INPUT输入时聚焦匹配输入建议"
                   width="600px"
                   append-to-body
                   :close-on-click-modal="false"
                   center :visible.sync="dialogVisibleinput" >
            <el-autocomplete
                class="inline-input"
                v-model="state"
                :fetch-suggestions="querySearch"
                placeholder="请输入内容"
                :trigger-on-focus="true"></el-autocomplete>
        </el-dialog>

        <ice-dept-selector
                text-prop="name"
                code-prop="code"
                mode="hidden"
                :choose-item="cho"
                ref="persionPop"
                @select-cannel="selectDeptCannel"
                @select-confirm="selectDeptConfirm"></ice-dept-selector>
    </div>

</template>

<script>
    import {mapMutations} from 'vuex'
    import IceQueryGrid from "../../../components/common/base/IceQueryGrid";
    import IceGridLayout from "../../../components/common/base/IceGridLayout";
    import IceEditableTable from "../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../components/common/base/IceEditableTableColumn";
    import IceSelect from "../../../components/common/base/IceSelect";
    import TsysFieldLibChoose from "../../../pages/datamanage/tsys/TsysFieldLibChoose.vue";
    import TsysCfgGlobalValChoose from "../../../pages/datamanage/tsys/global/TsysCfgGlobalValChoose.vue";
    import IceDeptSelector from "../../../components/common/biz/IceDeptSelector";
    export default {
        name: "TsysTblDatapolicy",
        props:{
            tblPermId:String,
            tableCode:String,
            tableName:String,
            tableId:String
        },
        data(){
            return{
                dialogVisible:false,            /*策略配置弹框主页的dialog*/
                dialogVisibleChoose:false,      /*全局字段变量选择的dialog*/
                dialogVisibleGlobalVal:false,   /*全局参数变量选择的dialog*/
                dialogVisibleStrategy:false,    /*保存到策略库dialog*/
                dialogVisibleCl:false,          /*套用策略库策略*/
                condexprs:'',                           /*保存导数据库里的一个值*/
                val:'',
                cho:'',
                dialogVisibleinput:false,
                restaurants:[],
                state:'',

                /*套用策略库策略*/
                query:[
                    {type: 'input', label: '编码', code: 'datapolicyCode', value: ''},
                    {type: 'input', label: '名称', code: 'datapolicyName', value: ''},
                ],
                columns:[
                    {code:"oid",hidden:true},
                    {code:"validSelect",hidden:true},
                    {code:"validUpdate",hidden:true},
                    {code:"validDelete",hidden:true},
                    {label: '编码', code: 'datapolicyCode', width: 200},
                    {label: '名称', code: 'datapolicyName', width: 120},
                    {label: '优先级', code: 'datapolicyPirority', width: 100,renderCell(h, data){
                        return (data.row.datapolicyOperator==1?"OR":(data.row.datapolicyOperator==2?"AND":""))}
                        },
                    {label: '合并方式', code: 'datapolicyOperator', width: 100,renderCell(h, data){
                        return (data.row.datapolicyPirority==10?"一般":(data.row.datapolicyPirority==20?"强制":(data.row.datapolicyPirority==99?"系统强制":"")))}}
                ],
                operations:[
                    {
                        name: '选择', callback: (row) => {
                            this.$confirm('确定套用操作吗?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'info'
                            }).then(() => {
                                let objMain = {};
                                Object.assign(objMain, row);
                                this.mainDataForm = objMain;
                                this.mainDataForm.datapolicyLibId = objMain.oid;
                                this.mainDataForm.datapolicyPirority=this.mainDataForm.datapolicyPirority?this.mainDataForm.datapolicyPirority+'':this.mainDataForm.datapolicyPirority;
                                this.mainDataForm.datapolicyOperator=this.mainDataForm.datapolicyOperator?mainDataForm.datapolicyOperator+'':mainDataForm.datapolicyOperator;
                                this.$axios.get('/datamanage/TsysLibCondexpr/list', {params: {"datapolicyId": this.mainDataForm.datapolicyLibId}}).then(result => {
                                    this.$message.success("套用成功")
                                    if (!result.data){
                                        this.detailGridData =[];
                                        return;
                                    }
                                    this.detailGridData =[];
                                    let backData = [];
                                    Object.assign(backData, result.data);
                                    for(let i=0;i<backData.length;i++){
                                        this.detailGridData.push({exprLpthesis: '',
                                            exprType: '',
                                            fieldCode:'',
                                            operator: '',
                                            param:'',
                                            exprRpthesis:'',
                                            datapolicyOperator:null,
                                            exprCode: '',
                                            exprName: '',
                                            sortNum: ''})
                                        this.detailGridData[i].exprLpthesis=backData[i].exprLpthesis;
                                        this.detailGridData[i].exprType=backData[i].exprType+'';
                                        this.detailGridData[i].fieldCode=backData[i].fieldCode;
                                        this.detailGridData[i].operator=backData[i].operator;
                                        this.detailGridData[i].param=backData[i].param;
                                        this.detailGridData[i].exprRpthesis=backData[i].exprRpthesis;
                                        this.detailGridData[i].datapolicyOperator=backData[i].datapolicyOperator?backData[i].datapolicyOperator+'':backData[i].datapolicyOperator;

                                        this.detailGridData[i].exprCode=backData[i].exprCode;
                                        this.detailGridData[i].exprName=backData[i].exprName;
                                        this.detailGridData[i].sortNum=backData[i].sortNum;
                                    }
                                    this.dialogVisibleCl=false;
                                }).catch(error => {
                                    this.dialogVisibleCl=false;
                                    this.$message.error("出错啦")
                                })
                            });

                        }
                    }

                ],
                /*策略配置里的form表单绑定数据*/
                mainDataForm:{
                    datapolicyCode:'',
                    datapolicyName:'',
                    validSelect:1,
                    validUpdate:0,
                    validDelete:0,
                    datapolicyPirority:'',
                    datapolicyOperator:null,
                    datapolicyLibId:''
                },

                /*策略配置弹窗主页下的form验证规则*/
                mainRules:{
                    datapolicyCode:{required: true, message: '请输入编码'},
                    datapolicyname:{required: true, message: '请输入名称'},
                    datapolicyPirority: {required: true, message: '请输入优先级'},
                    datapolicyOperator: {required: true, message: '请输入合并模式'}
                },
                /*策略配置弹窗主页下的table验证规则*/
                detailRules:{
                    exprLpthesis: {required: true, message: '请输入左括号'},
                    exprType: {required: true, message: '请输入类型'},
                    fieldCode: {required: true, message: '请输入字段'},
                    operator: {required: true, message: '请输入操作符'},
                    param: {required: true, message: '请输入参数'},
                    exprRpthesis: {required: true, message: '请输入右括号'},
                    /*datapolicyOperator: {required: true, message: '请输入逻辑符'}*/
                },

                detailGridData:[],          /*策略配置弹窗主页下的table的data*/
                detailGridDataText:'',      /*表达式验证input框绑定的变量*/
                optionField:[],             /*策略配置弹窗主页下的table的字段下拉绑定的数组*/

                /*保存到策略库里的form表单绑定数据*/
                mainDataFormStrategy:{
                    datapolicyCode:"",
                    datapolicyName:"",
                    datapolicyClass:""
                },

                /*保存到策略库里的form表单验证规则*/
                formRulesStrategy:{
                    datapolicyCode: {required: true, message: '请输入编码', repeatable: false},
                    datapolicyName: {required: true, message: '请输入名称'},
                    datapolicyClass: {required: true, message: '请输入类型'},
                },

                /*保存到策略库里的form表单里的数据策略分类下拉绑定的数组*/
                optionStrategy:[
                    {
                        label:"系统内置",
                        value:"1"
                    },
                    {
                        label:"台账类",
                        value:"2"
                    },
                    {
                        label:"工单类",
                        value:"3"
                    }
                ]
            }
        },

        watch:{
            /*深度监听策略配置弹框*/
            detailGridData: {
                handler() {
                    this.detailGridDataText="";
                    this.detailGridData.forEach(item=>{
                        for(let i in item) {
                            if(i=="exprLpthesis"
                                ||i=="exprType"
                                ||i=="fieldCode"
                                ||i=="operator"
                                ||i=="param"
                                ||i=="exprRpthesis"
                                ||i=="datapolicyOperator"
                                ||i=="optionField"){
                                /*optionField这个参数传入是为了给当行字段fieldCode下的下拉选赋值，只监听下拉选选中的值*/
                                if(item[i]&&i!="optionField"){
                                    this.detailGridDataText+=item[i]+" ";
                                }

                            }
                                /*if(item[i]&&i!="optionField"){
                                    this.detailGridDataText+=item[i]+" ";
                                }*//*else if(i=="optionField"){
                                    console.log("---i--:"+i)
                                    debugger
                                    this.detailGridDataText+=item[i][0].value+" ";
                                }*/
                        }
                    })
                    /*将字符串转为json*/
                    /*this.detailGridDataText=JSON.stringify(this.detailGridData);*/
                },
                immediate: true,
                deep: true
            }
        },
        methods:{
            querySearch(queryString,cb){
              var results  = queryString?this.restaurants.filter(this.createFilter(queryString)) :this.restaurants;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    cb(results);
                }, 3000 * Math.random());
              /*cb(results);*/
            },
            createFilter(queryString){
                return(restaurant)=>{
                    return(restaurant.value.toLowerCase().indexOf(queryString.toLowerCase())===0);
                }
            },
            loadAll(){
                return[
                    { "value": "三全鲜食（北新泾店）", "address": "长宁区新渔路144号" },
                    { "value": "Hot honey 首尔炸鸡（仙霞路）", "address": "上海市长宁区淞虹路661号" },
                    { "value": "新旺角茶餐厅", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                    { "value": "泷千家(天山西路店)", "address": "天山西路438号" },
                    { "value": "胖仙女纸杯蛋糕（上海凌空店）", "address": "上海市长宁区金钟路968号1幢18号楼一层商铺18-101" },
                    { "value": "贡茶", "address": "上海市长宁区金钟路633号" },
                    { "value": "豪大大香鸡排超级奶爸", "address": "上海市嘉定区曹安公路曹安路1685号" },
                    { "value": "茶芝兰（奶茶，手抓饼）", "address": "上海市普陀区同普路1435号" },
                    { "value": "十二泷町", "address": "上海市北翟路1444弄81号B幢-107" },
                    { "value": "星移浓缩咖啡", "address": "上海市嘉定区新郁路817号" },
                    { "value": "阿姨奶茶/豪大大", "address": "嘉定区曹安路1611号" }
                ]
            },
            /*选择部门下的选择按钮*/
            selectDeptConfirm(rows,index){
                index = this.val;
                this.detailGridData[index]["param"]="";         /*清空参数列表的值*/
                for(let i=0;i<rows.length;i++){
                    if(rows.length==1){
                        this.detailGridData[index]["param"] += rows[i]["deptCode"]+" ";
                    }else{
                        if(i==rows.length-1){
                            this.detailGridData[index]["param"] += rows[i]["deptCode"]+" ";
                        }else{
                            this.detailGridData[index]["param"] += rows[i]["deptCode"]+" ,";
                        }
                    }

                }
                this.$refs.persionPop.selectCannel();
                this.$refs.persionPop.cleanColumnSelect();
                /*let data = [];deptCode
                console.log(rows)
                for(let i = 0 ; i < rows.length ; i++){
                    data.push({dataroleId:selectRoleOid,userCode:rows[i]["code"]})
                }
                this.$axios.post('/datamanage/TsysRolePerm/saveOrUpdateList', {list: data},
                ).then(result => {
                    this.$message.success("保存成功")
                }).catch(error => {
                    this.$message.error("出错啦")
                });*/
            },
            /*选择部门下的取消按钮*/
            selectDeptCannel(){
                this.$refs.persionPop.cleanColumnSelect();
            },
            /*当类型发生改变时*/
            onSelectedDrug(index){
                this.detailGridData[index].operator='';
            },
            /*添加字段*/
            addField(){
                this.dialogVisibleChoose=true;
            },
            init(){
                this.$axios.get("/datamanage/TsysTblDatapolicy/get",{"params":{"tblPermId":this.tblPermId}}).then(success=>{
                    if (!success.data){
                        this.detailGridData =[];
                        this.mainDataForm ={};
                        return;
                    }
                    this.detailGridData =[];
                    this.mainDataForm ={};
                    let backData = {};
                    Object.assign(backData, success.data);
                    /*this.detailGridData = backData.condexprs;*/
                  for(let i=0;i<backData.condexprs.length;i++){
                        this.detailGridData.push({exprLpthesis: '',exprType: '', fieldCode:'',operator: '',param:'',exprRpthesis:'', datapolicyOperator:null,
                            condexpr: '',
                            exprCode: '',
                            exprLibId: '',
                            exprName: '',
                            sortNum: ''

                            /*createDate: '',
                            createUser: '',
                            dataDeptCode: '',
                            dataDeptId: '',
                            dataDeptLevcode: '',
                            dataOrgCode: '',
                            dataOrgId:'',
                            dataOrgLevcode: '',
                            dataSecretLevcode: '',
                            dataTenantId: '',
                            datapolicyId: '',
                            deleteStatus: '',
                            lockedStatus: '',
                            tenantCode: '',
                            updateDate: '',
                            updateUser: '',
                            version: ''*/})
                        this.detailGridData[i].exprLpthesis=backData.condexprs[i].exprLpthesis;
                        this.detailGridData[i].exprType=backData.condexprs[i].exprType+'';
                        this.detailGridData[i].fieldCode=backData.condexprs[i].fieldCode;
                        this.detailGridData[i].operator=backData.condexprs[i].operator;
                        this.detailGridData[i].param=backData.condexprs[i].param;
                        this.detailGridData[i].exprRpthesis=backData.condexprs[i].exprRpthesis;
                        this.detailGridData[i].datapolicyOperator=backData.condexprs[i].datapolicyOperator?backData.condexprs[i].datapolicyOperator+'':backData.condexprs[i].datapolicyOperator;
                       this.detailGridData[i].oid=backData.condexprs[i].oid;

                      this.detailGridData[i].condexpr=backData.condexprs[i].condexpr;
                      // this.detailGridData[i].createDate=backData.condexprs[i].createDate;
                      // this.detailGridData[i].createUser=backData.condexprs[i].createUser;
                      // this.detailGridData[i].dataDeptCode=backData.condexprs[i].dataDeptCode;
                      // this.detailGridData[i].dataDeptId=backData.condexprs[i].dataDeptId;
                      // this.detailGridData[i].dataDeptLevcode=backData.condexprs[i].dataDeptLevcode;
                      // this.detailGridData[i].dataOrgCode=backData.condexprs[i].dataOrgCode;
                      // this.detailGridData[i].dataOrgId=backData.condexprs[i].dataOrgId;
                      // this.detailGridData[i].dataOrgLevcode=backData.condexprs[i].dataOrgLevcode;
                      // this.detailGridData[i].dataSecretLevcode=backData.condexprs[i].dataSecretLevcode;
                      // this.detailGridData[i].dataTenantId=backData.condexprs[i].dataTenantId;
                      // this.detailGridData[i].datapolicyId=backData.condexprs[i].datapolicyId;
                      // this.detailGridData[i].deleteStatus=backData.condexprs[i].deleteStatus;
                      this.detailGridData[i].exprCode=backData.condexprs[i].exprCode;
                      this.detailGridData[i].exprLibId=backData.condexprs[i].exprLibId;
                      this.detailGridData[i].exprName=backData.condexprs[i].exprName;
                      // this.detailGridData[i].lockedStatus=backData.condexprs[i].lockedStatus;
                      this.detailGridData[i].sortNum=backData.condexprs[i].sortNum;
                      // this.detailGridData[i].tenantCode=backData.condexprs[i].tenantCode;
                      // this.detailGridData[i].updateDate=backData.condexprs[i].updateDate;
                      // this.detailGridData[i].updateUser=backData.condexprs[i].updateUser;
                      // this.detailGridData[i].version=backData.condexprs[i].version;
                    }
                    delete backData.condexprs;
                    this.mainDataForm=backData;
                    this.mainDataForm.datapolicyOperator=this.mainDataForm.datapolicyOperator?this.mainDataForm.datapolicyOperator+'':this.mainDataForm.datapolicyOperator;
                    this.mainDataForm.datapolicyPirority=this.mainDataForm.datapolicyPirority+'';
                }).catch(error=>{
                    this.$message.error("出错了")
                });
            },
            /*yesNo(){
                console.log(this.detailGridData[this.detailGridData.length-1].d+"------------------------");
                if(this.detailGridData.length<=1){
                    this.d=true;
                }else {
                   /!* for(let i=0;i<detailGridData.length-1;i++){
                        if(i==i<detailGridData.length-1){
                            this.detailGridData[this.detailGridData.length-1].d=true;
                        }
                        this.detailGridData[i].d=false;
                    }*!/
                    this.d=false;
                    this.detailGridData[this.detailGridData.length-1].d=true;
                }

            },*/
            /*保存策略库按钮--弹出保存到策略库界面*/
            save(){
                this.dialogVisibleStrategy=true;
            },
            /*弹出保存到策略库界面--保存策略库按钮*/
            saveStrategy(){
                let that = this;
                let vtable = false;
                let vform = false;
                this.$refs.detailtable.validateAll((valid) => {
                    if (valid) {
                        vtable = true
                    } else {
                        return false;
                    }
                });

                this.$refs.form.validate((valid) => {
                    if (valid && vtable) {
                        let newData = {
                            condexprs:that.detailGridData
                        };
                        console.log(this.detailGridData)
                        console.log('----------')
                        Object.assign(newData, that.mainDataForm,that.mainDataFormStrategy);
                        newData.datapolicyCode =  that.tableCode+"_"+newData.datapolicyCode;
                        this.$axios.post('/datamanage/TsysLibDatapolicy/saveOrUpdate', newData).then(result => {
                            this.$message.success("操作成功");
                            this.dialogVisibleStrategy=false;
                            /*this.$refs.formmain.refresh();*/
                        }).catch(error => {
                            this.$message.error("出错啦")
                        })
                    } else {
                        return false;
                    }
                });
            },
            /*保存到到策略库的返回按钮*/
            retStrategy(){
                this.dialogVisibleStrategy=false;
            },

            /*新增表达式*/
            /*当没有点新增字段时，字段的下拉选的值为请求到的所有的字段*/
            addExpression(){
                let that = this;
                let detailGridData = [];
                this.$axios.get("/datamanage/TsysFieldLib/list",{"params":{"tableId":this.tableId}}).then(success=>{
                    Object.assign(detailGridData, success.data);
                    for(let i=0;i<detailGridData.length;i++){
                        let obj = {};
                        obj.label=detailGridData[i].columnName;
                        obj.value=detailGridData[i].columnCode;
                        that.optionField.push(obj);
                    }
                }).catch(error=>{
                    this.$message.error("出错了")
                });
                this.detailGridData.push({exprLpthesis: '',exprType: '', fieldCode:'',operator: '',param:'',exprRpthesis:'', datapolicyOperator:null,optionField:that.optionField});
            },
            /*清空列表*/
            emptyColumn(detailGridData){
                let clean= [];
                this.detailGridData=clean;
            },

           /* /!*表达式校验*!/
            expressionVaild(){

            },*/
            /*添加字段下的选择按钮*/
            selectConfirm(rows){
                for(let i=0;i<rows.length;i++){
                    let obj={};
                    obj.label=rows[i].columnName;
                    obj.value=rows[i].columnCode;
                    let optionField=[];
                    optionField.push(obj);
                    this.detailGridData.push({exprLpthesis: '',exprType: '', fieldCode:rows[i].columnCode,operator: '',param:'',exprRpthesis:'', datapolicyOperator:null,optionField:optionField});
                }

                this.selectCannel();

            },
            /*添加字段下的取消按钮*/
            selectCannel(){
                this.dialogVisibleChoose=false;
            },

            /*选择全局参数变量*/
            globalVar(index){
                this.cho="multiple";
                this.dialogVisibleGlobalVal = true;
                this.val=index;
            },
            globalVarSingle(index){
                this.cho="single";
                this.dialogVisibleGlobalVal = true;
                this.val=index;
            },

            /*选择全局参数变量的弹框下的选择按钮*/
            selectConfirmVal(rows,index){
                index = this.val;
                this.detailGridData[index]["param"]="";         /*清空参数列表的值*/
                for(let i=0;i<rows.length;i++){
                    if(rows.length==1){
                        this.detailGridData[index]["param"] += rows[i]["globalVarCode"]+" ";
                    }else{
                        if(i==rows.length-1){
                            this.detailGridData[index]["param"] += rows[i]["globalVarCode"]+" ";
                        }else{
                            this.detailGridData[index]["param"] += rows[i]["globalVarCode"]+" ,";
                        }
                    }

                }
                this.detailGridData[index]["param"]="{"+this.detailGridData[index]["param"]+"}";
                this.dialogVisibleGlobalVal =false;
            },
            selectCannelVal(){
                this.dialogVisibleGlobalVal =false;
            },
            /*选择部门*/
            dept(index){
                this.cho="multiple";
                this.$refs.persionPop.openDialog();
                this.val=index;
            },
            deptSingle(index){
                this.cho="single";
                this.$refs.persionPop.openDialog();
                this.val=index;
            },
            /*替换函数，可实现换位*/
            swapArray(arr, index1, index2){
                arr[index1] = arr.splice(index2, 1, arr[index1])[0];
                return arr;
            },

            /*删除当前行*/
            del(index){
                this.detailGridData.splice(index,1);
            },

            /*上移*/
            moveup(index){
                if (index != 0) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index - 1);
                }
            },

            /*下移*/
            movedown(index){
                if (index + 1 != this.detailGridData.length) {
                    this.detailGridData = this.swapArray(this.detailGridData, index, index + 1);
                }
            },
            /*resetForm(formName) {
                this.$refs[formName].resetFields();
            },*/
            /*套用策略库策略*/
            celue(){
                this.dialogVisibleCl=true;
            },

            /*套用策略库则略弹框---操作---选择*/
            chose(){
                this.dialogVisibleinput = true;
            },
            /*策略配置弹框页面下的保存按钮*/
            saveConfiguration(){
                let vtable = false;
                this.$refs.detailtable.validateAll((valid) => {
                    if (valid) {
                        vtable = true
                    } else {
                        return false;
                    }
                });
                this.$refs.formmain.validate((valid) => {
                    if (valid && vtable) {
                        let newData = {};
                        Object.assign(newData, this.mainDataForm);
                        newData.condexprs=this.detailGridData;
                        newData.tblPermId = this.tblPermId;
                        if(newData.condexprs.length>0){
                            newData.condexprs[newData.condexprs.length-1].datapolicyOperator=null;
                        }
                        this.$axios.post('/datamanage/TsysTblDatapolicy/saveOrUpdate', newData).then(result => {
                            this.$message.success("操作成功");
                            this.dialogVisible=false;
                        }).catch(error => {
                            this.$message.error("出错了")
                        })
                    } else {
                        return false;
                    }
                });
            },

            /*策略配置弹框页面下的返回按钮*/
            retConfiguration(){
                this.dialogVisible=false;
            },
            ...mapMutations('datamapStore', ['addUndoTypeCodes']),
        },
        created(){
            this.addUndoTypeCodes('aleft','aright','handle','exprTypes');
        },
        mounted(){
            this.restaurants = this.loadAll();
        },
        components: {
            IceDeptSelector,
            IceSelect,
            IceEditableTableColumn,
            IceEditableTable,
            IceGridLayout,
            TsysFieldLibChoose,
            TsysCfgGlobalValChoose,
            IceQueryGrid
        }
    }
</script>

<style scoped>

</style>
