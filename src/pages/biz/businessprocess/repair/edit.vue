<template>
    <div class="content-filled">
        <ice-flow-form name valiate :flow-ready="flowReady" ref="flowForm" :flow-operate-btn="flowOperateBtn"
                       :flow-biz-data="flowBizData">
            <div slot-scope="flowScope">
                <el-form :rules="formRules" :model="devRepairData" status-icon :ref="PAGE_ENUM.REFS.FORM.REF">
                    <ice-grid-layout name="申请人信息" :columns="2">
                        <el-form-item label="申请人" label-width="140px">
                            <!--<el-input autocomplete="off" v-model="devRepairData.afUserName">-->
                            <!--</el-input>-->
                            <el-input v-model="devRepairData.afUserName"
                                      :disabled="flowScope.formReadonly"
                                      placeholder="请选择责任人">
                                <el-button @click="choosePeople" icon="el-icon-user-solid" slot="append"
                                           title="点我可以查看详情" v-if="showButton"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="申请单位" label-width="140px">
                            <el-input v-model="devRepairData.afOrgName" :disabled="flowScope.formReadonly"></el-input>
                        </el-form-item>
                        <el-form-item label="联系电话" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.afPhone"></el-input>
                        </el-form-item>
                        <el-form-item label="申请时间" prop="afDate" label-width="140px">
                            <el-date-picker type="datetime"
                                            :disabled="flowScope.formReadonly"
                                            format="yyyy-MM-dd HH:mm" v-model="devRepairData.afDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item label="维修申请类型" prop="afDate" label-width="140px">
                            <el-radio v-model="devRepairData.repairAppType" label="1">介质与信息消除</el-radio>
                            <el-radio v-model="devRepairData.repairAppType" label="2">设备维修</el-radio>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-form-group name="介质消磁详情" v-if="devRepairData.repairAppType == '1'">
                        <div style="margin-bottom: 2px">
                            <el-button type="primary">新增</el-button>
                            <el-button type="primary">删除</el-button>
                        </div>
                        <div style="width: 100%">
                            <ice-editable-table :data="tableData" :height="200">
                                <el-table-column type="selection"></el-table-column>
                                <ice-editable-table-column label="介质类型">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.a">
                                            <el-option label="硬盘" value="1"></el-option>
                                            <el-option label="U盘" value="1"></el-option>
                                            <el-option label="录音笔" value="1"></el-option>
                                            <el-option label="移动硬盘" value="1"></el-option>
                                            <el-option label="储存卡" value="1"></el-option>
                                            <el-option label="录像带" value="1"></el-option>
                                            <el-option label="其他" value="1"></el-option>
                                        </el-select>
                                    </template>
                                </ice-editable-table-column>
                                <ice-editable-table-column label="介质责任人">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.b"
                                                  readonly
                                                  placeholder="请选择责任人">
                                            <el-button @click="chooseTablePeople(scope.$index)" icon="el-icon-user-solid" slot="append"
                                                       title="点我选择责任人" ></el-button>
                                        </el-input>
                                    </template>
                                </ice-editable-table-column>
                                <ice-editable-table-column label="密级">
                                    <template slot-scope="scope">
                                        <el-select v-model="scope.row.h">
                                            <el-option label="公开" value="1"></el-option>
                                            <el-option label="内部" value="2"></el-option>
                                            <el-option label="机密" value="3"></el-option>
                                            <el-option label="绝密" value="4"></el-option>
                                        </el-select>
                                    </template>
                                </ice-editable-table-column>
                                <el-table-column label="保密编号" prop="secretSn">
                                </el-table-column>
                                <ice-editable-table-column label="设备序列号">
                                    <template slot-scope="scope">
                                        <el-input v-model="scope.row.d"
                                                  placeholder="请选择设备序列号">
                                            <el-button @click="chooseTablePeople(scope.$index)" icon="el-icon-edit-outline" slot="append"
                                                       title="点我选择设备序列号" ></el-button>
                                        </el-input>
                                    </template>
                                </ice-editable-table-column>
                            </ice-editable-table>
                        </div>
                    </ice-form-group>
                    <ice-grid-layout :cloumns="1" name="申请原因" v-if="devRepairData.repairAppType == '1'">
                        <el-form-item label="申请原因" label-width="80px">
                            <el-input v-model="devRepairData.w" type="textarea" :rows="3"></el-input>
                        </el-form-item>
                    </ice-grid-layout>
                    <ice-grid-layout name="设备维修基本信息" :columns="3" v-if="devRepairData.repairAppType == '2'">
                        <el-form-item label="设备名称" prop="devName" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.devName">
                                <el-button slot="append" icon="el-icon-edit" @click="chooseDev"></el-button>
                            </el-input>
                        </el-form-item>
                        <el-form-item label="设备型号" prop="devModel" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.devModel"
                                      :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="设备编号" prop="devSn" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.devSn"
                                      :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="设备类型" prop="category" label-width="140px">
                            <el-select :disabled="true" v-model="devRepairData.category">
                                <el-option
                                        v-for="(item,index) in ENUMS.CATEGORY_DATA"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="设备密级" prop="secretLevel" label-width="140px">
                            <el-select :disabled="true" v-model="devRepairData.secretLevel">
                                <el-option
                                        v-for="(item,index) in ENUMS.DATA_SECRET_LEVEL_DATA"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="责任人" prop="dutyName" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.dutyName"
                                      :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="责任单位" prop="deptName" label-width="140px">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.deptName"
                                      :readonly="true"></el-input>
                        </el-form-item>
                        <el-form-item label="质保信息" prop="" label-width="140px">
                            <el-select v-model="devRepairData.qualityDateAvailable" :disabled="true">
                                <el-option
                                        v-for="(item,index) in REPAIR_ENUMS.QUALITY_INFO.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="维修类别" prop="repairType" label-width="140px">
                            <el-select v-model="devRepairData.repairType" @change="chooseDevRepairType">
                                <el-option
                                        v-for="(item,index) in REPAIR_ENUMS.REPAIR_TYPE.properties"
                                        :key="index"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="送外维修人" prop="externalRepairmanName" label-width="140px" v-if="showPublicOutRepair || showPrivateOutRepair">
                            <ice-persion-selector
                                choose-item="single"
                                mode="onlySelect"
                                v-model="devRepairData.externalRepairmanName"
                                @select-confirm="blameSelectUser">

                            </ice-persion-selector>
                        </el-form-item>
                        <el-form-item label="送外维修单位" prop="externalRepairDeptName" label-width="140px" v-if="showPublicOutRepair || showPrivateOutRepair">
                            <el-input :disabled="flowScope.formReadonly"
                                v-model="devRepairData.externalRepairDeptName"
                            :readonly="true">

                            </el-input>
                        </el-form-item>
                        <el-form-item label="维修单位名称" prop="repairDeptName" label-width="140px" v-if="showPublicOutRepair || showPrivateOutRepair">
                            <el-input v-model="devRepairData.repairDeptName">

                            </el-input>
                        </el-form-item>
                        <div layout="3">
                            <div v-if="showButton">
                                <el-button :type="COMM_ENUMS.BUTTON.ADD.type"
                                           :icon="COMM_ENUMS.BUTTON.ADD.icon"
                                           @click="addRepairDevAssociateHw" >{{COMM_ENUMS.BUTTON.ADD.name}}</el-button>
                                <el-button :type="COMM_ENUMS.BUTTON.DELETE.type"
                                           :icon="COMM_ENUMS.BUTTON.DELETE.icon"
                                           @click="deleteDev" >{{COMM_ENUMS.BUTTON.DELETE.name}}</el-button>
                            </div>
                            <ice-query-grid title="关联存储硬件或固件"
                                            :gridData="devRepairData.details"
                                            :columns="columns"
                                            ref="contactQueryGrid"
                                            :operationsWidth=100
                                            :minHeight="150"
                                            :pagination="false"
                                            chooseItem="multiple"
                                            @selection-change="devRowsSelected">
                            </ice-query-grid>
                        </div>
                    </ice-grid-layout>
                    <ice-grid-layout name="设备维修信息" :columns="3" v-if="devRepairData.repairAppType == '2'">

                        <el-form-item label="设备故障现象" prop="faultPhenomenon" label-width="140px" layout="3">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.faultPhenomenon"
                                      type="textarea"
                                      :rows="4"
                                      placeholder="请输入设备故障现象"></el-input>
                        </el-form-item>

                        <el-form-item label="备注" prop="remark" label-width="140px" layout="3">
                            <el-input :disabled="flowScope.formReadonly" v-model="devRepairData.remark"
                                      type="textarea"
                                      :rows="4"
                                      placeholder="请输入备注信息"></el-input>
                        </el-form-item>

                        <el-form-item label="送外维修原因" prop="externalRepairCause" label-width="140px" layout="3" v-if="showPrivateOutRepair ||showPublicOutRepair">
                            <el-input v-model="devRepairData.externalRepairCause"
                                      type="textarea"
                                      :rows="4"
                                      placeholder="请输入送外维修原因"></el-input>
                        </el-form-item>

                        <el-form-item label="存储硬件/固件拆除" label-width="140px" prop="removeSecretModule" layout="3" v-if="showPrivateOutRepair">

                            <el-radio v-model="devRepairData.removeSecretModule" v-for="item in ENUMS.YES_NO.properties"
                                      :label="item.code">{{item.name}}</el-radio>
                        </el-form-item>

                        <el-form-item label="设备维修单" prop="devRepairList" label-width="140px">
                            <a @click="editDevRepairTask">编辑</a>
                        </el-form-item>

                        <el-form-item label="维修回执" prop="devRepairReceipt" label-width="80px" >
                            <div style="width:20%;float:left"><a @click="printReceipt">打印</a></div>
                            <div style="width:80%;float:left">
                                <div class="upload-progress" :style="{width:percent+'%'}">
                                    <em>{{percent>0&&percent!=100?percent+'%':''}}</em>
                                    <em v-if="percent==100" class="el-icon-success" style="color: #c2371d;
                                        position: absolute;
                                        bottom: -6px;
                                        right: -2px;"></em>
                                    <el-button type="text" class="el-icon-delete" v-if="percent==100" @click="devRepairData.fileId = null;percent=0;">删除</el-button>
                                </div>

                                <div>
                                    <div v-if="devRepairData.fileId">
                                        <div style="">
                                            <el-button type="text" v-if="!flowScope.isEndNode" @click.prevent.stop="look(devRepairData.fileId)" class="el-icon-view">下载查看</el-button>
                                            <ice-single-upload style="display: inline-block;
                                                padding-left: 10px;
                                                border-left: solid 1px #d81902;
                                                margin-left: 10px;" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                               v-model="devRepairData.fileId" ref="uploader" >
                                                <el-button type="text" class="el-icon-upload2">重新上传</el-button>
                                            </ice-single-upload>
                                        </div>
                                    </div>
                                    <div v-if="!devRepairData.fileId">
                                        <ice-single-upload style="width: 110px;margin-left: 15px" :progress="progress" :on-success="success" :beforeUpload="uploadBeforeUpload"
                                                           v-model="devRepairData.fileId"
                                                           ref="uploader" >
                                            <a>上传</a>
                                        </ice-single-upload>
                                    </div>

                                </div>
                            </div>
                        </el-form-item>

                        <!--涉密所内上门维修 -->
                        <el-form-item label="保密承诺书" prop="privatePromise" label-width="140px" v-if="showPrivateInnerQualRepair">
                            <a @click="printReceipt">打印</a>
                            <a>上传</a>
                        </el-form-item>



                    </ice-grid-layout>
                </el-form>
            </div>
        </ice-flow-form>
        <dev-select :ref="PAGE_ENUM.REFS.DEV_SELECT.REF" v-if="PAGE_ENUM.REFS.DEV_SELECT.SHOW"
                    :multiple="multiple" :get-all-dev-info="true"
                    :on-close-handler="selectOverHandler"></dev-select>
        <dev-repair-task :ref="PAGE_ENUM.REFS.DEV_TASK.REF" v-if="PAGE_ENUM.REFS.DEV_TASK.SHOW" :devRepairObject="devRepairData.record" :save-repair-from="saveRepairFrom"></dev-repair-task>
        <dev-repair-inner-receipt :ref="PAGE_ENUM.REFS.DEV_INNER_RECEIPT_TASK.REF" v-if="PAGE_ENUM.REFS.DEV_INNER_RECEIPT_TASK.SHOW" :innerReceiptData="devRepairData.record"></dev-repair-inner-receipt>
        <dev-repair-out-receipt :ref="PAGE_ENUM.REFS.DEV_OUTER_RECEIPT_TASK.REF" v-if="PAGE_ENUM.REFS.DEV_OUTER_RECEIPT_TASK.SHOW" :outerReceiptData="devRepairData.record"></dev-repair-out-receipt>
        <dev-category-tree
                @nodeClick="treeNodeClick"
                :filterTreeData="filterTreeData"
                :ref="PAGE_ENUM.REFS.DEV_CATEGORY.REF">
        </dev-category-tree>

        <ice-persion-selector
                choose-item="single"
                ref="persionPop"
                mode="hidden"
                @select-confirm="selectUserConfirm">
        </ice-persion-selector>

        <ice-dialog :visible.sync="visible" width="50%" title="新增存储硬件或固件" :buttons="addButtons">
            <el-form :model="editData"  label-position="right"
                     class="conditon-bar" ref="editFormDialog"
                     style="margin: 20px">
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="设备子类:" label-width="100px" prop="hwTypeName">
                            <el-input v-model="editData.hwTypeName"
                                      readonly>
                                <el-button @click="chooseDevCategory" icon="el-icon-edit" slot="append"
                                           title="点我可以查看详情"></el-button>
                            </el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="型号" label-width="100px" prop="name">
                            <el-input v-model="editData.name"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="密级" label-width="100px" prop="secretLevel">
                            <el-select v-model="editData.secretLevel" clearable placeholder="请选择">
                                <el-option
                                        v-for="item in ENUMS.DATA_SECRET_LEVEL_DATA"
                                        :key="item.code"
                                        :label="item.name"
                                        :value="item.code">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="保密编号" label-width="100px" prop="secretSn">
                            <el-input v-model="editData.secretSn"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="12">
                        <el-form-item label="设备序列号" label-width="100px" prop="licenseType">
                            <el-input v-model="editData.licenseType"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="12">
                        <el-form-item label="容量:" label-width="100px" prop="capacity">
                            <div style="width: 100%">
                                <div style="float: left;width: 95%">
                                    <el-input v-model="editData.capacity"></el-input>
                                </div>
                                <div style="float: left;width: 5%">
                                    <span>G</span>
                                </div>

                            </div>

                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="60">
                    <el-col :span="24">
                        <el-form-item label="备注" label-width="100px" prop="license">
                            <el-input v-model="editData.license" type="textarea" :rows="2"></el-input>
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
    import IceQueryGrid from "@/components/common/base/IceQueryGrid";
    import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
    import bizComm from "@/pages/biz/js/comm";
    import renderer from "@/pages/biz/dev/js/comm/renderer"
    import devComm from "../../dev/js/comm/devComm"
    import editComm from "./js/comm"
    import DevSelect from "../../dev/devSelect";
    import DevRepairTask from "./DevRepairTask";
    import DevRepairInnerReceipt from "./DevRepairInnerReceipt";
    import DevRepairOutReceipt from "./DevRepairOutReceipt";
    import IceSingleUpload from "@/components/common/base/IceSingleUpload";
    import IceDialog from "../../../../components/common/base/IceDialog";
    import DevCategoryTree from "../hardwareReplace/devCategoryTree";
    import DevRepairPriceByHw from "./DevRepairPriceByHw";
    import IceFormGroup from "../../../../components/common/base/IceFormGroup";
    import IceEditableTable from "../../../../components/common/base/IceEditableTable";
    import IceEditableTableColumn from "../../../../components/common/base/IceEditableTableColumn";

    export default {
        name: "edit",
        components: {
            IceEditableTableColumn,
            IceEditableTable,
            IceFormGroup,
            DevRepairPriceByHw,
            DevCategoryTree,
            IceDialog,
            DevSelect, IcePersionSelector, IceQueryGrid, IceGridLayout, IceFlowForm,DevRepairTask,IceSingleUpload,DevRepairInnerReceipt,DevRepairOutReceipt},
        mixins: [bizComm, renderer, devComm, editComm],
        data() {
            return {
                PAGE_ENUM: {
                    REFS: {
                        FORM: {REF: "form"},
                        DEV_SELECT: {REF: "devSelect", SHOW: false},
                        DEV_TASK:{REF:"devTask",SHOW:false},
                        DEV_INNER_RECEIPT_TASK:{REF:"devInnerReceiptTask",SHOW:false},
                        DEV_OUTER_RECEIPT_TASK:{REF:"devOuterReceiptTask",SHOW:false},
                        DEV_CATEGORY: {REF:"treeCategory"}
                    },
                    NODE_TYPE:{
                        FIRST_NODE:{NAME:'首节点',CODE:'FirstNode'},
                        SECOND_NODE:{NAME:'部门审批节点',CODE:'node1'},
                    }
                },
                formRules: {
                    devName: {required: true, message: '请选择需要维修的设备', trigger: 'change'},
                    faultPhenomenon: {required: true, message: '请输入设备故障现象', trigger: 'blur'},//故障现象描述
                    // devName: {required: true, message: '请选择需要维修的设备', trigger: 'change'},
                    // qualityDateAvailable: {required: true, message: '请选择是否在质保期内', trigger: 'blur'},
                    // externalRepairmanName: {required: true, message: '请选择送外维修人', trigger: 'blur'},
                    // repairDeptName: {required: true, message: '请输入维修单位', trigger: 'blur'},
                    // repairType: {required: true, message: '请选择维修类别', trigger: 'change'},
                    // removeSecretModule: {required: true, message: '请选择是否拆除存储硬件或固件', trigger: 'blur'},
                    // faultPhenomenon: {required: true, message: '请输入设备故障现象', trigger: 'blur'},//故障现象描述
                    // externalRepairCause: {required: true, message: '请输入送外维修原因', trigger: 'blur'},//送外维修原因
                },
                devRepairData: {
                    w:'',
                    oid: "",
                    devId: "",
                    devModel: "",//设备型号
                    devName: "",//设备名称
                    devSn: "",//设备编号
                    category: "",//设备类型
                    secretLevel: "",//设备密级
                    dutyName: "",//责任人
                    dutyCode: "",//责任人code
                    deptName: "",//责任单位
                    deptCode: "",//责任单位code
                    dutyOrgCode: "",//责任人orgcode
                    dutyOrgName: "",//责任人orgName
                    qualityDate: "",//质保期
                    qualityDateAvailable: "",//是否质保期内
                    repairType: "",//维修类型
                    externalRepairmanCode: "",//送外维修人编码
                    externalRepairmanName: "",//送外维修人名称
                    externalRepairDeptCode: "",//送外维修单位编码
                    externalRepairDeptName: "",//送外维修单位名称
                    repairDeptName: "",//维修单位
                    removeSecretModule: "",//是否涉密存储硬件或固件是否已拆除. 0=否,1=是
                    faultPhenomenon: "",//故障现象描述
                    externalRepairCause: "",//送外维修原因
                    devRepairNo: "",//设备维修单编号
                    afNo: "",//审批单号
                    afDate: "",//申请时间
                    afUserCode: "",//申请人编码
                    afUserName: "",//申请人名字
                    afDepartmentCode: "",//申请人部门编码
                    afDepartmentName: "",//申请人部门名字
                    afOrgCode: "",//申请人单位编码
                    afOrgName: "",//申请人单位名字
                    afReason: "",//申请原因
                    afPhone: "",//申请人联系电话
                    remark:"",//备注
                    details: [],
                    repairAppType:'2',//维修申请类型 1、介质与信息消除 2、设备维修
                    record:{
                        afNo:"", //维修申请单ID
                        model:"", // 设备型号
                        applyOrgName:"", //  送修单位
                        applyOrgCode:"", //  送修人单位编码
                        applyOrgType:"", //  送修单位类型
                        applyUserName:"", //  送修人
                        applyUserCode:"", // 送修人编码
                        applyPhone:"", // 联系电话
                        applyDeptName:"", // 送修部门
                        applyDeptCode:"", // 送修部门编码
                        devSecretLevel:"", // 设备密级
                        category:"", // 硬件维修--》设备类别
                        fault:"", // 故障现象

                    }
                },
                addButtons:[
                    {name: '取消', iscannel: true},
                    {name: '保存', iscannel: false,click: this.saveData}
                ],
                columns: [],
                singleDev: false,
                multiple: false,
                showPrivateInnerQualRepair:false,//涉密所内质保内维修
                showPrivateInnerUnqualRepair:false,//涉密所内质保外维修
                showPrivateOutRepair:false,//涉密送外维修
                showPublicInnerQualRepair:false,//非密所内质保内维修
                showPublicInnerUnqualRepair:false,//非密所内质保外维修
                showPublicOutRepair:false,//非密送外维修
                percent:0,
                editData:{
                    hwTypeName:'',//设备关联的硬件或者固件类型名称
                    childType:'',//更换的硬件编号
                    name:'',
                    secretLevel:'',
                    secretSn:'',//保密编号
                    licenseType:'',//拟新责任人
                    capacity:'',
                    license:''
                },
                visible:false,
                filterTreeData:[],
                assoDevList:[],
                showButton:false,
                showPrice:false,
                tableData:[{a:'',secretSn:'asdf46',b:'张887'}],
            }
        },
        methods: {
            chooseTablePeople(){

            },
            /**
             * 初始化页面数据
             * @param flowcont
             * @param bizdata
             */
            flowReady(flowcont, bizdata) {
                if(this.PAGE_ENUM.NODE_TYPE.FIRST_NODE.CODE !== flowcont.nodeId){
                    this.showButton = false
                }else {
                    this.showButton = true
                }

                Object.assign(this.devRepairData, bizdata);

                if (!bizdata.oid || bizdata.oid == "") {
                    this.devRepairData.afDepartmentName = bizdata.afDepartmentName + "[" + bizdata.afOrgName + "]";
                    this.devRepairData.externalRepairmanCode = bizdata.afUserCode;
                    this.devRepairData.externalRepairDeptName = bizdata.afDepartmentName + "[" + bizdata.afOrgName + "]";
                    this.devRepairData.externalRepairDeptCode = bizdata.afDepartmentCode;
                    this.devRepairData.externalRepairmanName = bizdata.afUserName;
                }
                // this.$refs[this.PAGE_ENUM.REFS.FORM.REF].clearValidate();
                // this.setCurrentPlace(this.devRepairData.detailList);
            },
            /**
             * 流程操作按钮监听事件
             * @param flowContext
             * @param bizdata
             */
            flowOperateBtn(flowContext, bizdata) {
                flowContext.processVar={
                    secretLevel:this.devRepairData.secretLevel
                };
                return this.$refs[this.PAGE_ENUM.REFS.FORM.REF].validate();
            },
            /**
             * 向流程引擎传递数据
             * @returns {devRepairData|{}}
             */
            flowBizData() {

                return this.devRepairData;
            },
            /**
             * 设备选择
             */
            chooseDev() {
                this.multiple = false;
                this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_SELECT.REF].openDialog();
                    this.singleDev = true;
                });
            },
            /**
             * 追加存储硬件
             */
            addDevs() {
                this.multiple = true;
                if (!this.devRepairData.devName || this.devRepairData.devName == "") {
                    this.$alert("请先选择需要维修的设备", "提示");
                    return;
                }
                this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_SELECT.REF].openDialog();
                    this.singleDev = false;
                });
            },
            /**
             * 人员选择
             * @param row
             */
            blameSelectUser(row) {
                this.devRepairData.externalRepairmanName = row[0].name;
                this.devRepairData.externalRepairmanCode = row[0].code;
                this.devRepairData.externalRepairDeptName = row[0].deptShortName + "[" + row[0].orgShortName + "]";
                this.devRepairData.externalRepairDeptCode = row[0].deptCode;
            },
            /**
             * 初始化页面控件
             */
            initControls() {
                this.initColumns();
            },
            /**
             * 初始化表格列
             */
            initColumns() {
                let _this = this;
                this.columns = [{code: 'devId', hidden: true},
                    // {
                    //     label: '设备类型', code: 'category', width: 120, renderCell(h, data) {
                    //         return _this.onCategoryRenderer(data.row.category);
                    //     }
                    // },
                    {
                        label: '设备子类', code: 'childType', width: 120, renderCell(h, data) {
                            return _this.onChildTypeRenderer(data.row.childType);
                        }
                    },
                    {label: '型号', code: 'name', width: 150},
                    {
                        label: '密级', code: 'secretLevel', width: 100, renderCell(h, data) {
                            return _this.getNameByCode(_this.ENUMS.DATA_SECRET_LEVEL_DATA, data.row.secretLevel);
                        }
                    },
                    {label: '保密编号', code: 'secretSn', width: 150},
                    {label: '设备序列号', code: 'licenseType', width: 120},
                    {label: '容量', code: 'capacity', width: 150},
                    {label: '备注', code: 'license', width: 150},
                    ]
            },
            /**
             * 设备选择后
             */
            selectOverHandler(datas) {
                let _this = this;
                return new Promise((resolve, reject) => {
                    if(datas.length>0){
                        if (_this.singleDev) {
                            _this.chooseSingleDev(datas[0]);
                        } else {
                            _this.chooseMultipleDev(datas);
                        }
                    }
                    _this.PAGE_ENUM.REFS.DEV_SELECT.SHOW = false;
                    resolve();
                });
            },
            /**
             * 单选设备
             * @param data
             */
            chooseSingleDev(data) {
                let _this = this;
                this.getDevInfo(data.oid).then(res => {
                    Object.assign(_this.devRepairData, res.commDTO);
                    _this.devRepairData.oid = "";
                    _this.devRepairData.devId = res.commDTO.oid;
                    _this.devRepairData.devModel = res.commDTO.model;
                    _this.devRepairData.devName = res.commDTO.name;
                    _this.devRepairData.qualityDateAvailable = new Date(res.commDTO.qualityDate).getTime() > new Date().getTime() ? this.REPAIR_ENUMS.QUALITY_INFO.BEFORE : this.REPAIR_ENUMS.QUALITY_INFO.AFTER;
                    _this.devRepairData.details = _this.getChildList(res.dependDTOList);
                }).catch(res => {
                    _this.$message.warning(res);
                });
            },
            /**
             * 多选设备
             */
            chooseMultipleDev(datas) {
                let _this = this;
                for (let i = 0; i < datas.length; i++) {
                    if (this.findSameRowByCode(this.devRepairData.details, datas[i].oid, "devId") == -1) {
                        this.getDevInfo(datas[i].oid).then(res => {
                            _this.devRepairData.details = _this.devRepairData.details || [];
                            res.extendData = res.extendData || {};
                            _this.devRepairData.details.push({
                                devId: res.commDTO.oid,
                                name: res.commDTO.name,
                                category: res.commDTO.category,
                                childType: res.commDTO.childType,
                                secretLevel: res.commDTO.secretLevel,
                                secretSn: res.commDTO.secretSn,
                                licenseType:'test123',
                                // capacity: res.extendData.capacity,
                                capacity: '500G',
                                license: 'test'
                            });
                        });
                    }
                }
            },
            /**
             * 获取关联设备
             */
            getChildList(data) {
                let res = [];
                console.log(data)
                for (let i = 0; i < data.length; i++) {
                    let _cur = data[i].dependDevDTO;
                    _cur.extendData = _cur.extendData || {};
                    res.push({
                        devId: _cur.commDTO.oid,
                        name: _cur.commDTO.name,
                        category: _cur.commDTO.category,
                        childType: _cur.commDTO.childType,
                        secretLevel: _cur.commDTO.secretLevel,
                        secretSn: _cur.commDTO.secretSn,
                        capacity: _cur.extendData.capacity,
                        license: _cur.extendData.license
                    });
                }
                return res;
            },
            /**
             * 获取设备信息
             * @param devId
             */
            getDevInfo(devId) {
                return new Promise((reslove, reject) => {
                    this.loadDevById(devId).then(res => {
                        reslove(res.dataDTO);
                    }).catch(res => {
                        reject(res);
                    });
                });
            },
            editDevRepairTask(){
                //审批单传递给维修申请单的相关信息
                this.devRepairData.record.afNo = this.devRepairData.devRepairNo
                this.devRepairData.record.model = this.devRepairData.devModel
                this.devRepairData.record.applyOrgName = this.devRepairData.afOrgName
                this.devRepairData.record.applyOrgCode = this.devRepairData.afOrgCode
                this.devRepairData.record.applyUserName = this.devRepairData.afUserName
                this.devRepairData.record.applyUserCode = this.devRepairData.afUserCode
                this.devRepairData.record.applyPhone = this.devRepairData.afPhone
                this.devRepairData.record.applyDeptName = this.devRepairData.afDepartmentName
                this.devRepairData.record.applyDeptCode = this.devRepairData.afDepartmentCode
                this.devRepairData.record.devSecretLevel = this.devRepairData.secretLevel
                this.devRepairData.record.category = this.devRepairData.category
                this.devRepairData.record.fault = this.devRepairData.faultPhenomenon
                this.devRepairData.record.repairType = this.devRepairData.repairType

                this.PAGE_ENUM.REFS.DEV_TASK.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_TASK.REF].opendialog();
                });
            },
            saveRepairFrom(repairFormData){
                Object.assign(this.devRepairData.record, repairFormData);
            },
            chooseDevRepairType(){
                // 非密所内上门维修=非密&所内维修&质保内
                // 非密所内自行维修=非密&所内维修&质保外
                // 非密送外维修=非密&送外维修
                // 涉密所内上门维修=涉密&所内维修&质保内
                // 涉密所内自行维修=涉密&所内维修&质保外
                // 涉密送外维修=涉密&送外维修
                //devRepairData.repairType 所内0，所外1
                //devRepairData.qualityDateAvailable 1质保内，2质保外
                //secretLevel 密级,1：未定密；2：公开；3：内部；4：机密；5：绝密

                if(this.devRepairData.secretLevel > 1){//涉密
                    if(this.devRepairData.repairType === 0){//所内维修
                        if(this.devRepairData.qualityDateAvailable === 1){//质保内
                            this.showPrivateInnerQualRepair = true
                            this.showPrivateOutRepair = false
                        }else{//质保外
                            this.showPrivateInnerUnqualRepair = true
                            this.showPrivateOutRepair = false
                        }
                    }else{//所外维修
                        this.showPrivateOutRepair = true
                        this.showPrivateInnerQualRepair = false
                    }
                }else{//非密
                    if(this.devRepairData.repairType === 0){//所内维修
                        if(this.devRepairData.qualityDateAvailable === 1){//质保内
                            this.showPublicInnerQualRepair = true
                            this.showPublicOutRepair = false
                        }else{//质保外
                            this.showPublicInnerUnqualRepair = true
                            this.showPublicOutRepair = false
                        }
                    }else{//所外维修
                        this.showPublicOutRepair = true
                        this.showPublicInnerQualRepair = false
                        this.showPublicInnerUnqualRepair = false
                    }
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
                this.devRepairData.tmpFileName = file.name;
                this.devRepairData.fileId = response.data;
                /*this.$refs.editTable.validateField('tmpFileName',error=>{});*/
                /*this.$nextTick(()=>{});*/
            },
            uploadBeforeUpload(file){
                this.percent = 0;
                this.devRepairData.fileMD5 = file.md5;
            },
            printReceipt(){
                this.PAGE_ENUM.REFS.DEV_INNER_RECEIPT_TASK.SHOW = true;
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_INNER_RECEIPT_TASK.REF].opendialog();
                });
            },
            saveData(){
                this.devRepairData.details.push(this.editData)
                this.visible = false;
            },
            /**关联设备--新增*/
            addRepairDevAssociateHw(){
                if (!this.devRepairData.devName || this.devRepairData.devName == "") {
                    this.$alert("请先选择需要维修的设备", "提示");
                    return;
                }
                this.editData={
                    hwTypeName:'',
                        childType:'',
                        name:'',
                        secretLevel:'',
                        secretSn:'',
                        licenseType:'',
                        capacity:'',
                        license:''
                },
                this.visible = true;
            },
            chooseDevCategory(){
                this.$nextTick(() => {
                    this.$refs[this.PAGE_ENUM.REFS.DEV_CATEGORY.REF].opendialog();
                });

            },
            treeNodeClick(node,row){
                this.editData.hwTypeName = row.data.name
                this.editData.childType = row.data.code
            },
            deleteDev(){
                if (this.assoDevList.length > 0) {
                    this.$confirm('确定要删除选中的硬件', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'info'
                    }).then(() => {
                        this.deletes(this.devRepairData.details, this.assoDevList);
                        this.assoDevList = [];
                    });
                }else{
                    this.$message.warning('请选择需要删除的设备');
                }
            },
            devRowsSelected(rows){
                this.assoDevList = rows;
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
                this.devRepairData.afUserName = row[row.length-1].name;
                this.devRepairData.afUserCode = row[row.length-1].code;
                this.devRepairData.afOrgName = row[row.length-1].orgShortName;
                this.devRepairData.afOrgCode = row[row.length-1].dataOrgCode;
            },
        },
        mounted() {
            let prepareTaskChain = [
                this.assembleEnumByDataDictionary(this.ENUMS.DATA_DICTIONARY.USE_FOR.CODE, this.ENUMS.DATA_DICTIONARY.USE_FOR_TWO.CODE, this.ENUMS.DATA_DICTIONARY.DATA_SECRET_LEVEL.CODE),
                this.requestCategoryData()
            ];
            Promise.all(prepareTaskChain).then(this.initControls);
        },
    }
</script>

<style scoped>
    a{
        color:blue;
        text-decoration:underline;
        cursor: pointer;
        margin-left: 10px;
    }

    .file-uploader .progress {
        background: #5daf34;
        height: 100%;
        width: 0;
        left: 0;
        position: absolute;
        top: 0;
        text-align: right;
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