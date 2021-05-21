<template>
  <div class="container">
    <!--    <ice-flow-form name-->
    <!--                   valiate-->
    <!--                   ref="flowForm"-->
    <!--                   :flowReady="flowReady"-->
    <!--                   :flowOperateBtn="flowOperateBtn"-->
    <!--                   :flowBizData="flowBizData"-->
    <!--                   :btn-extend1="alterationAssign">-->
    <div class="mian">
      <!-- 实验预约表单 -->
      <div class="experiment">
        <el-form ref="form" :model="form" label-width="120px" :rules="rules">
          <ice-grid-layout :columns="1" name="基本信息" :expandable="true">
            <el-row>
              <el-col :span="8">
                <el-form-item label="实验方式:" prop="theway">
                  <el-select v-model="form.theway" placeholder="请选择" :disabled="!isHandleer" clearable @change="changeTheway">
                    <el-option v-for="item in thewayOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="预约人:" prop="personnel">
                  <!-- <el-input v-model="form.personnel"
                            :disabled="!isHandleer"
                            placeholder="请输入预约人:"></el-input> -->
                  <ice-persion-selector choose-item="single" ref="persionPop" v-model="form.personnel" :disabled="!isHandleer" @select-confirm="selectUserConfirm"></ice-persion-selector>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="委托单位:" prop="unit">
                  <el-input v-model="form.unit" :disabled="!isHandleer" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="联系方式:" prop="contact">
                  <el-input v-model="form.contact" :disabled="!isHandleer" placeholder="请输入电话号码" clearable maxlength="11" onkeyup="value=value.replace(/[^\d]/g,'')"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="timesName" prop="times">
                  <el-date-picker v-model="form.times" :disabled="!isHandleer" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="实验名称:" prop="name" v-if="false">
                  <el-input v-model="form.name" :disabled="!isHandleer" placeholder="请输入内容"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="16">
                <el-form-item label="备注说明:">
                  <el-input type="textarea" v-model="form.remarks" :disabled="!isHandleer" placeholder="简略描述预约备注说明" :autosize="{ minRows: 6}"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6" style="margin-left:45px;margin-top:95px">
                <el-button type="primary" icon="el-icon-s-platform" @click="ViewEquipment">查看设备负荷</el-button>
                <el-button type="primary" icon="el-icon-s-custom" @click="ViewPersonnel">查看人员负荷</el-button>
              </el-col>
            </el-row>
          </ice-grid-layout>
        </el-form>
      </div>
      <!-- 样品登记 -->
      <div class="sample">
        <ice-grid-layout :columns="1" name="样品信息" :expandable="true">
          <div class="buttons" v-if="isHandleer" style="margin-bottom:15px">
            <el-button icon="el-icon-zoom-in" type="primary" @click='SelectSample'>选择样品</el-button>
            <el-button @click="personneLdialog" type="primary" icon="el-icon-monitor" v-if="isSlectedPersonnel">选择设备人员</el-button>
            <el-button icon="el-icon-minus" type="danger" @click="deleteItem">删除</el-button>
            <el-button icon="el-icon-check" type="success" @click='flowOperateBtn'>提交</el-button>
          </div>
          <el-table :data="gridData" style="width: 100%;min-height:400px" stripe :border='true' @selection-change="handleSelectionChange" :header-cell-style="{
                  'background-color': '#F8F8F9',
                  }">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column label="样品名称" align="center" prop="sampleName"></el-table-column>
            <el-table-column label="规格型号" width="160" align="center" prop="sampleAttributes" :formatter="sampleAttributesFormatter"></el-table-column>
            <el-table-column label="数量" align="center" prop="sampleNum">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.sampleNum" :disabled="!isHandleer" :min="0.1" :max="99999" :precision="1" :step="0.1" label="请输入内容"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="计量单位" align="center" prop="sampleUnit" :formatter="filterSampleUnit">
              <!-- <template slot-scope="scope">
                <el-select v-model="scope.row.sampleUnit"
                           :disabled="!isHandleer"
                           placeholder="请选择"
                           clearable
                           @change="selectChangeUnit">
                  <el-option v-for="item in OptionsUnit"
                             :key="item.oid"
                             :label="item.name"
                             :value="item.oid">
                  </el-option>
                </el-select>
              </template> -->
            </el-table-column>
            <el-table-column label="存储条件" align="center" prop="storageConditions" :formatter="FilterStorageConditions"></el-table-column>
            <el-table-column label="是否炸药" align="center" prop="isDynamite" :formatter="FilterisDynamite"></el-table-column>
            <el-table-column label="实验项名称" align="center" prop="detectProject" :formatter="FilterisProjectName" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="Detect(scope.row)" type="text" size="small">实验项目</el-button>
              </template>
            </el-table-column>
          </el-table>
        </ice-grid-layout>
      </div>
      <!-- 预约成功 -->
      <div class="success" v-if="false">
        <div class="handleSuccess" v-loading="loading">
          <span><img :src="AppointmentData.Documents!=''?appintmentstatus[0]:appintmentstatus[1]" alt="" /></span>
          <span>{{AppointmentData.name}}</span>
          <span>{{AppointmentData.value}}
            <i style="color:#C92D30 ;font-weight: bold">{{AppointmentData.Documents}}</i>,{{AppointmentData.value1}}</span>
          <span>{{AppointmentData.value2}}</span>
        </div>
      </div>
    </div>
    <!-- 检测项目 -->
    <ice-dialog v-dialogDrag title="实验项目" center :visible.sync="dialogVisible" :close-on-click-modal="false" :before-close="closeItem" append-to-body width="1600px">
      <el-row class="tagList">
        <el-tag v-for="(item,index) in tagNames" :key="index">{{item.projectName}}</el-tag>
      </el-row>

      <ice-tree-grid load-url="/tdm/detectProjectCategory/tree?parentId=0" ref="DetectItem" label-prop="name" value-prop="oid" :lazy="false" parent-prop="categoryId" :data-url="'/tdm/detectProject/list'" :pagination="true" :query="DetectItemQuery" :columns="DetectItemData" chooseItem="multiple" treeWidth="300px" grid-auto-refresh="true" :selectedCodes="selectedCodesDetectItem" @selection-change="DetectItemChange" codeProp="id" @node-click="dataTree" exportTitle="实验项目" :gridIndex="false">
      </ice-tree-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" v-if="isHandleer" @click="DetectItemSave">确认实验项目</el-button>
        <el-button type="info" size="medium" @click="closeDialog">关闭</el-button>
      </div>
    </ice-dialog>
    <!-- 选择设备 -->
    <ice-dialog v-dialogDrag title="实验项目" center :visible.sync="PersonnelDialogVisible" :close-on-click-modal="false" :before-close="personnelCloseDialog" append-to-body width="1800px">
      <!-- 选择设备 -->
      <div class="personnel">
        <div class="leftbox" v-loading="treeLoading">
          <h3>样品 | 实验项目</h3>
          <div class="left-child-box">
            <div class="block" v-if="isContent">
              <el-tree :data="treedata" node-key="id" @node-click="handleNodeClick" :props="defaultProps" ref="tree" default-expand-all :render-content="renderContent">
              </el-tree>
            </div>
          </div>
        </div>
        <div class="middlebox">
          <h3>
            <span>实验设备选择</span>
            <span>可预约</span>
            <span>不可预约</span>
            <span>维护中</span>
          </h3>
          <div class="middle-child-box" v-loading="equipmentLoading">
            <ul>
              <li v-for="item in equipment" :key="item.equipmentId" @click="selectedEquipment(item)" ref="equipmentRef" :class="{Selected: sectOid==item.equipmentId}" :id="item.equipmentId">
                <span :class="item.checkinStatus==0?'bgc-color-green':item.checkinStatus==1?'bgc-color-gray':'bgc-color-red'"></span>
                <span>编号: <i>{{item.equipmentNumber}}</i> </span>
                <span>名称: <i>{{item.equipmentName}}</i> </span>
                <span>标准工时: <i style="font-size:16px;color:tomato;font-weight:bold">【{{item.projectTime}}】</i> 小时;</span>
                <span>设备任务数:<i style="font-size:16px;color:tomato">【{{item.equipmenTask}}】</i> </span>
                <span :class="item.checkinStatus==0?'text-color-green':item.checkinStatus==1?'text-color-gray':'text-color-red'">
                  状态: <i>{{item.checkinStatus==0?'正常':item.checkinStatus==1?'维护中':'不可预约'}}</i>
                </span>
              </li>
            </ul>
            <div class="manual">
              <!--   <p>设备【{{SelectedEquipmentName}}】</p> -->
              <p><a href="#" @click="specification(secureDiscipline)">设备操作说明书.pdf</a></p>
              <p><a href="#" @click="secureDiscipline(secureDiscipline )">设备安全说明书.pdf</a></p>
            </div>
          </div>
        </div>
        <div class="rightbox" v-if="form.theway==2">
          <h3>选择人员</h3>
          <div class="right-child-box" v-loading="loading2">
            <ul class="personnel-content">
              <li v-for="item in personnelOptions" :key="item.peopleId" @click="handerPersonneID(item)" :class="{Selected:peopleId==item.peopleId}">
                <span><img src="./img/u534.png" alt=""></span>
                <span style="font-weight:bold">{{item.name}}</span>
                <span style="font-size:10px">{{item.parentDeptName}}</span>
                <span style="font-size:10px">{{item.teamName}}</span>
                <span style="font-size:10px;font-weight:bold">任务数:<i style="color:tomato;font-size:14px">{{item.task}}</i></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="ice-button-bar" slot="footer" v-if="isSlectedPersonnel">
        <el-button type="primary" size="medium" v-if="isHandleer" @click="personnelSave">确认并保存设备</el-button>
        <el-button type="info" size="medium" @click="personnelCloseDialog">关闭</el-button>
      </div>
    </ice-dialog>
    <!-- 选择样品 -->
    <ice-dialog v-dialogDrag title="选择样品" :visible.sync="SelectSampleDialog" :close-on-click-modal="false" :before-close="SelectSampleCloseItem" append-to-body width="1600px">
      <ice-query-grid title="选择样品" data-url="/tdm/sample/sampleWarehouseList" :pagination="true" :columns="SelectSampleData" ref="SelectSample" chooseItem="multiple" :gridIndex="false" :query="SelectSampleQuery" @selection-change="selectionChange" :selectedCodes="selectedCodes" codeProp="oid" :buttons="addSampleButtons" :operations="SelectSampleOperations"></ice-query-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="SelectSampleSave">保存</el-button>
        <el-button type="info" size="medium" @click="SelectSampleSaveClose">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 添加样品 -->
    <!-- <ice-dialog v-dialogDrag
                title="添加样品"
                :visible.sync="addSampleDialog"
                :close-on-click-modal="false"
                :before-close="addSampleSaveCloseItem"
                append-to-body
                width="800px">
      <el-form ref="addSampleFormRef"
               :model="addSampleForm"
               label-width="120px"
               :rules="addSampleFormRules"
               class="formList">
        <el-row>
          <el-col :span="12">
            <el-form-item label="样品名称:"
                          prop="sampleName">
              <el-input v-model="addSampleForm.sampleName"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否炸药:"
                          prop="isDynamite">
              <el-select v-model="addSampleForm.isDynamite"
                         placeholder="请选择是否炸药">
                <el-option v-for="item in isDynamiteData"
                           :key="item.id"
                           :label="item.name"
                           :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="存储条件:"
                          prop="storageValue">
              <el-select v-model="storageValue"
                         multiple
                         placeholder="请选择"
                         @change="storageChange"
                         :filterable="true">
                <el-option v-for="item in storageOptions"
                           :key="item.oid"
                           :label="item.name"
                           :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号:"
                          prop="attributesValue">
              <el-select v-model="attributesValue"
                         multiple
                         placeholder="请选择"
                         @change="attributeChange"
                         :filterable="true">
                <el-option v-for="item in attributesOptions"
                           :key="item.oid"
                           :label="item.name"
                           :value="item.name">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="addSampleSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeSelectSample">取消</el-button>
      </div>
    </ice-dialog> -->
    <ice-dialog v-dialogDrag title="添加样品" center :visible.sync="addSampleDialog" :close-on-click-modal="false" :before-close="addSampleSaveCloseItem" append-to-body width="800px">
      <el-form ref="addSampleFormRef" :model="addSampleForm" label-width="100px" :rules="addSampleFormRules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="样品名称:" prop="sampleName">
              <el-input v-model="addSampleForm.sampleName" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="样品外观:" prop="sampleExterior">
              <el-input v-model="addSampleForm.sampleExterior" placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="存储条件:" prop="storageConditions">
              <el-select v-model="storageValue" multiple placeholder="请选择" @change="storageChange" :filterable="true">
                <el-option v-for="item in storageOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="规格型号:" prop="sampleAttributes">
              <el-select v-model="attributesValue" multiple placeholder="请选择" @change="attributeChange" :filterable="true">
                <el-option v-for="item in attributesOptions" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="计量单位:" prop="sampleUnit">
              <!--  <el-input v-model="addSampleForm.sampleUnit"
                        placeholder="请输入内容"></el-input> -->
              <el-select v-model="addSampleForm.sampleUnit" placeholder="请选择" clearable @change="selectChangeUnit">
                <el-option v-for="item in OptionsUnit" :key="item.oid" :label="item.name" :value="item.oid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否炸药:" prop="isDynamite">
              <el-select v-model="addSampleForm.isDynamite" placeholder="请选择是否炸药">
                <el-option v-for="item in isDynamiteData" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="addSampleSave">保存</el-button>
        <el-button type="info" size="medium" @click="closeSelectSample">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 设备负荷 -->
    <ice-dialog v-dialogDrag title="设备负荷" :visible.sync="ViewEquipmentDialog" :close-on-click-modal="false" :before-close="CloseViewEquipment" append-to-body width="1400px">
      <ice-query-grid title="设备负荷" data-url="/tdm/equipment/equipmentLoad" :pagination="true" :columns="ViewEquipmentData" ref="ViewEquipmentRef" chooseItem="multiple" :gridIndex="false" :query="ViewEquipmentQuery" :buttons="ViewEquipmentButtons"></ice-query-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="info" size="medium" @click="CloseViewEquipment">关闭</el-button>
      </div>
    </ice-dialog>
    <!-- 人员负荷 -->
    <ice-dialog v-dialogDrag title="人员负荷" :visible.sync="ViewPersonnelDialog" :close-on-click-modal="false" :before-close="CloseViewPersonnel" append-to-body width="1400px">
      <ice-query-grid title="人员负荷" data-url="/tdm/equipment/personnelLoad" :pagination="true" :columns="ViewPersonnelData" ref="ViewPersonnelRef" chooseItem="multiple" :gridIndex="false" :query="ViewPersonnelQuery" :buttons="ViewPersonnelButtons"></ice-query-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="info" size="medium" @click="CloseViewPersonnel">关闭</el-button>
      </div>
    </ice-dialog>
    <!--    </ice-flow-form>-->
  </div>
</template>
<script>
// import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceTreeGrid from "@/components/common/base/IceTreeGrid";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import IcePersionSelector from "@/components/common/biz/IcePersionSelector";
export default {
  name: "AutonomousExperiment",
  components: { IceQueryGrid, IceDialog, IceTreeGrid, IceGridLayout, IcePersionSelector },
  data () {
    return {
      activeName: 'first',
      attaTableData: [],
      isHandleer: true,
      bizdata: { xmname: '', dataSecretLevcode: '2' },
      /* 实验方式 */
      thewayOptions: [
        {
          value: 1,
          label: '自主实验预约'
        },
        {
          value: 2,
          label: '委托实验预约'
        },
        {
          value: 3,
          label: '生产实验预约'
        },
      ],
      /* 实验预约表单数据 */
      form: {
        name: "padding",
        theway: "",
        unit: "",
        contact: "",
        personnel: "",
        remarks: "",
        times: "",
      },
      /* 添加样品表单数据 */
      addSampleForm: {
        sampleName: "",
        sampleExterior: "",
        sampleUnit: "",
        isDynamite: "",
        sampleAttributes: '',
        storageConditions: '',
      },
      /* 实验预约表单验证规则 */
      rules: {
        name: [{ required: false, message: "请输入实验名称", trigger: "blur" }],
        theway: [
          { required: true, message: "请选择实验方式", trigger: "change" },
        ],
        unit: [{ required: true, message: "请输入委托单位", trigger: "blur" }],
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        personnel: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
        times: [
          { required: true, message: "请选择预计完成时间", trigger: "change" },
        ]
      },
      /* 添加样品表单验证规则 */
      addSampleFormRules: {
        sampleName: [
          { required: true, message: "请输入样品名称", trigger: "blur" },
        ],
        sampleExterior: [
          { required: true, message: "请输入样品外观", trigger: "blur" },
        ],
        sampleUnit: [
          { required: true, message: "请选择计量单位", trigger: "change" },
        ],
        isDynamite: [
          { required: true, message: "请选择是否炸药", trigger: "change" },
        ],
        sampleAttributes: [
          { required: false, message: "请选择样品属性", trigger: "change" },
        ],
        storageConditions: [
          { required: false, message: "请选择存储条件", trigger: "change" },
        ],
      },
      /* 获取添加样品表格数据 */
      snapGridData: [], //临时存储样品表格数据
      gridData: [],
      /* 选择样品表格数据 */
      SelectSampleData: [
        { code: "oid", hidden: true },
        {
          label: "样品名称",
          code: "sampleName",
          align: "center",
        },
        {
          label: "样品外观",
          code: "sampleExterior",
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          align: "center",
          formatter (row) {
            return row.isDynamite == 0 ? "否" : "是";
          },
        },
        {
          label: "样品属性",
          code: "sampleAttributes",
          align: "center",
          renderCell (h, data) {
            let str = "";
            if (data.row) {
              for (let i = 0; i < data.row.sampleAttributes.length; i++) {
                str += data.row.sampleAttributes[i].name + ";";
              }
            }
            return str;
          },
        },
        {
          label: "计量单位",
          code: "sampleUnit",
          align: "center",
          renderCell (h, data) {
            if (data.row.dictionaryCategory.name) {
              return data.row.dictionaryCategory.name
            }
          }
        },
        {
          label: "存储条件",
          code: "storageConditions",
          align: "center",
          renderCell (h, data) {
            let str = "";
            if (data.row) {
              for (let i = 0; i < data.row.storageConditions.length; i++) {
                str += data.row.storageConditions[i].name + ";";
              }
            }
            return str;
          },
        },
        {
          label: "状态",
          code: "status",
          align: "center",
          formatter (row) {
            return row.status == 0 ? "禁用" : "启用";
          },
        },
      ],
      DetectItemQuery: [
        { type: 'static', code: 'isAll', value: 0 },
        { type: "input", label: "实验名称", code: "searchTerm", value: "" },
      ],
      /* 检测项目表格数据 */
      DetectItemData: [
        {
          label: "实验项名称",
          code: "projectName",

          align: "center",
        },
        {
          label: "实验项分类",
          code: "experimentCategoryName",
          align: "center",

        },
        {
          label: "样品要求",
          code: "sampleRequirements",

          align: "center",
        },
        {
          label: "阈值",
          code: "threshold",
          align: "center"
        },

        {
          label: "备注",
          code: "remarks",
          align: "center"
        },
        {
          label: "启用状态",
          code: "status",
          align: "center",
          formatter (row) {
            if (row.status == 0) {
              return "未启用";
            }
            return "已启用";
          },
        },
      ],
      dialogVisible: false,
      SelectSampleDialog: false,
      addSampleDialog: false,
      /* 是否炸药 */
      isDynamiteData: [
        {
          id: 0,
          name: "否",
        },
        {
          id: 1,
          name: "是",
        },
      ],
      /*存储条件下拉列表值 */
      storageValue: [],
      /*存储条件 */
      storageOptions: [],
      /*样品属性下拉列表值 */
      attributesValue: [],
      /* 样品属性条件 */
      attributesOptions: [],
      /* 要删除的表格数据 */
      deleteData: [],
      /* 检测项数据 */
      SelectDetectItem: [],
      /* 计算已选中的表格 */
      row: {},
      /* 计量单位下拉 */
      OptionsUnit: [
      ],
      /* 树形数据 */
      treedata: [
      ],
      /* 树形配置表 */
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      /* 获取设备数据 */
      equipment: [],
      flag: 0,
      /* 请求参数 */
      params: {},
      /* 预约单据 */
      AppointmentData: {
        name: '',
        Documents: '',
        value: '',
        value1: '',
        value2: ''
      },
      /* 预约成功和预约失败图片 */
      appintmentstatus: [
        'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2027944484,1041176236&fm=26&gp=0.jpg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1607518834830&di=b76384216ea986ee6eaeca23dafa5ab2&imgtype=0&src=http%3A%2F%2Fwww.fjmingfeng.com%2Fimg%2F0%2F6500222851%2F62%2F67013f85bd0684c429dc419c3b747982%2F9943203471%2F1662437863.jpg'
      ],
      loading: true,
      equipmentLoading: false,
      /* 设备名字 */
      SelectedEquipmentName: '',
      /* 工效时间 */
      projectTime: '',
      row: {},
      sectOid: '',
      /* 任务数 */
      equipmenTask: '',
      SelectSampleQuery: [
        { type: 'static', code: 'status', value: 1 },
        { type: "input", label: "样品名称", code: "sampleName", value: "" },
      ],
      timesName: '计划完成时间',
      /* 是否选择设备 */
      isSlectedPersonnel: false,
      /* 选择设备弹窗 */
      PersonnelDialogVisible: false,
      /* 设备负荷 */
      ViewEquipmentDialog: false,
      /* 人员负荷 */
      ViewPersonnelDialog: false,
      ViewEquipmentData: [
        { code: "oid", hidden: true },
        {
          label: "设备编号",
          code: "equipmentNumber",
          align: "center",
        },
        {
          label: "设备名称",
          code: "equipmentName",
          align: "center",
        },
        {
          label: "样品要求",
          code: "sampleClaim",
          align: "center",
        },
        {
          label: "覆盖检测领域",
          code: "coveredRealm",
          align: "center",
        },
        {
          label: "实验室名称",
          code: "laboratoryName",
          align: "center",
        },
        {
          label: "设备负责人名称",
          code: "principal",
          align: "center",
        },
        {
          label: "设备预约数",
          code: "appCount",
          align: "center",
        },

      ],
      ViewEquipmentQuery: [
        {
          type: 'static', code: 'start', value: () => {
            return this.start;
          }
        },
        {
          type: "input",
          label: "设备名称",
          code: "searchText",
          value: "",
        },
      ],
      ViewEquipmentButtons: [
        {
          name: "显示未预约设备",
          icon: "el-icon-d-caret",
          callback: () => {
            this.start = '0';
            this.$refs.ViewEquipmentRef.refresh()
          }
        },
      ],
      start: '',
      ViewPersonnelData: [
        { code: "code", hidden: true },
        {
          label: "名称",
          code: "personName",
          align: "center",
        },
        {
          label: "部门",
          code: "deptName",
          align: "center",
        },
        {
          label: "受理作业预约数",
          code: "appCount",
          align: "center",
        },
        {
          label: "工时(小时)",
          code: "workingHours",
          align: "center",
        },

      ],
      ViewPersonnelQuery: [
        {
          type: 'static', code: 'start', value: () => {
            return this.start;
          }
        },
        {
          type: "input",
          label: "人员名称",
          code: "searchText",
          value: "",
        },
      ],
      ViewPersonnelButtons: [
        {
          name: "显示未预约人员",
          icon: "el-icon-d-caret",
          callback: () => {
            this.start = '0';
            this.$refs.ViewPersonnelRef.refresh()
          }
        },
      ],
      loading2: false,
      personnelOptions: [],
      /* 人员ID */
      peopleId: '',
      teamId: '',
      Eid: {},
      addSampleButtons: [
        {
          name: "添加样品",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addSample,
        },
      ],
      SelectSampleOperations: [
        {
          name: "删除", callback: this.SelectSampleDelete, isShow: (row) => {
            if (row.openDel == 1) {
              return true;
            } else {
              return false;
            }
          }
        },
      ],
      tagNames: [],
      /* 禁用日期 */
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      treeLoading: false,
      ele: {},
      isContent: false,
    };
  },
  methods: {
    flowOperateBtn (flowContext, bizdata) {
      /*  if (this.params) {
         this.params.samples.forEach(val1 => {
           val1.sampleAttributes.forEach(val2 => {
             this.attributesOptions.forEach(val3 => {
               if (val2.name == val3.name) {
                 val2.id = val3.code
               }
             })
           })
         })
         this.params.samples.forEach(val1 => {
           val1.storageConditions.forEach(val2 => {
             this.storageOptions.forEach(val3 => {
               if (val2.name == val3.name) {
                 val2.id = val3.code
               }
             })
           })
         })
       } */
      console.log(this.params);
      let status = false
      this.$refs.form.validate(vali => {
        if (vali) {
          this.params.name = this.form.name;
          this.params.entrustUnit = this.form.unit;
          this.params.people = this.form.personnel;
          this.params.phone = this.form.contact;
          this.params.remarks = this.form.remarks;
          this.params.sendSampleTime = this.form.times;
          this.params.samples = this.gridData;
          status = true;

          this.$axios.put('/tdm/experimentAppointment/submit', this.params).then(res => {
            if (res.data != '') {
              this.AppointmentData.name = '实验预约完成'
              this.AppointmentData.value = '预约受理号:'
              this.AppointmentData.Documents = res.data
              this.AppointmentData.value1 = '请妥善保管'
              this.AppointmentData.value3 = '您可凭借受理号查询进度和打印报表'
              this.loading = false
              this.$confirm('提交成功! 预约编号为：' + res.data, '提示', {
                confirmButtonText: '预约台账',
                cancelButtonText: '再次预约',
                type: 'success'
              }).then(() => {
                this.$router.push({
                  path: '/tdm/reservationLedger'
                })
              }).catch(() => {
                location.reload()
                // this.$router.push({
                //   path: '/tdm/supplierAllBack'
                // })
              });
            }
          }).catch(err => {

            this.$message.error(err.msg)
            this.AppointmentData.name = '实验预约失败'
            this.AppointmentData.value = ''
            this.AppointmentData.Documents = ''
            this.AppointmentData.value1 = ''
            this.AppointmentData.value3 = ''
            this.loading = false
          })

        } else {
          this.$message.error('请将表单输入完整')
          status = false
        }
      })
      return status
    },
    /**树形节点获取*/
    dataTree (row, data) { },
    /* 实验方式状态选择 */
    changeTheway (row) {
      this.params.reservationType = this.form.theway;
      if (this.form.theway == 1) {
        this.params.experimentType = 1;
        this.timesName = "完成时间";
        /* 自主预约 选择设备 */
        this.isSlectedPersonnel = true;
      } else if (this.form.theway == 2) {
        /* 委托预约 */
        this.params.experimentType = 1;
        this.timesName = "完成时间"
        this.isSlectedPersonnel = true;
      } else if (this.form.theway == 3) {
        /* 生产预约 */
        this.params.experimentType = 2;
        this.timesName = "预计完成时间"
        this.isSlectedPersonnel = false;
      } else {
        this.params.reservationType = '';
        this.params.experimentType = '';
        this.timesName = "完成时间"
        this.isSlectedPersonnel = false;
      }
      /* console.log(this.params, 'this.params'); */
    },
    /* 检测项目回调 */
    Detect (row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.DetectItem.$refs.tree.refresh();
      });
      this.row = row;
      this.SelectDetectItem = row.detectProject ? row.detectProject : [];
      if (row.detectProject) {
        this.tagNames = row.detectProject;
      } else {
        this.tagNames = [];
      }
    },
    /* 检测项目勾选回调 */
    DetectItemChange (rows, removerows) {
      if (removerows && removerows.length > 0) {
        this.SelectDetectItem = this.SelectDetectItem.filter((item) => {
          let boo = true;
          removerows.forEach((removeItem) => {
            if (item.id === removeItem.id) {
              boo = false;
            }
          })
          return boo;
        });
      } else {
        let datas = rows.filter((item) => {
          let boo = true;
          this.SelectDetectItem.forEach((removeItem) => {
            if (item.id === removeItem.id) {
              boo = false;
            }
          })
          return boo;
        });
        for (var i = 0; i < datas.length; i++) {
          this.SelectDetectItem.push(datas[i]);
        }
      }
      this.tagNames = this.SelectDetectItem
    },
    /* 检测项目保存 */
    DetectItemSave () {
      this.row["detectProject"] = this.SelectDetectItem;
      let datalist = this.gridData;
      let arr = [];
      var index = 0;
      var indexs = 0;
      datalist.forEach((item) => {
        if (item.detectProject) {
          let arrs = [];
          item.detectProject.forEach((items) => {
            let objs = {
              value: items.id,
              label: items.projectName,
              id: items.id,
              type: ++index

            };
            arrs.push(objs);
          });
          let obj = {
            value: item.oid,
            label: item.sampleName,
            children: arrs,
            id: item.oid,
            type: ++indexs
          };
          arr.push(obj);
        }
      })
      this.treedata = arr // 树形列表数据
      this.dialogVisible = false;
      this.params.name = this.form.name;
      this.params.entrustUnit = this.form.unit;
      this.params.people = this.form.personnel;
      this.params.phone = this.form.contact;
      this.params.remarks = this.form.remarks;
      this.params.sendSampleTime = this.form.times;
      this.params.samples = this.gridData;
      this.SelectSampleSave();
    },
    /* 选择设备保存 */
    personnelSave () {
      this.PersonnelDialogVisible = false;
      this.isContent = false;
    },
    /* 选择样品回调 */
    SelectSample () {
      if (this.form.theway) {
        this.SelectSampleDialog = true;
        this.$nextTick(() => {
          this.$refs.SelectSample.refresh();
        });
      } else {
        this.$message.warning('请选择实验方式!')
      }

    },
    /* 打开添加样品弹窗 */
    addSample () {
      this.addSampleDialog = true;
      this.emptyForm();
      if (this.$refs.addSampleFormRef) {
        this.$refs.addSampleFormRef.resetFields()
      }
    },
    /* 添加样品保存 */
    addSampleSave () {
      this.$refs.addSampleFormRef.validate((vali) => {
        console.log(vali);
        if (vali) {
          this.$axios
            .put("/tdm/sample/addSampleWarehouse", this.addSampleForm)
            .then((res) => {
              this.$message.success('添加成功!');
              this.$refs.SelectSample.refresh();
              this.closeSelectSample();
            })
            .catch((error) => {
              this.$message.error(error.msg);
            })
        } else {
          this.$message.error("请将信息填写完整");
        }
      });
    },
    //刷新表单
    emptyForm () {
      this.addSampleForm = {};
      let that = this;
      this.queryDictionary("ypsx", function (data) {
        that.attributesOptions = data;
        console.log(that.attributesOptions);
      });
      this.queryDictionary("ypcctj", function (data) {
        that.storageOptions = data;
        console.log(that.storageOptions);
      });
    },
    queryDictionary (code, dictionary) {
      this.$axios
        .get("/tdm/sample/queryDictionary", { params: { type: code } })
        .then((result) => {
          if ((result.status = 200)) {
            let zds = [];
            for (let i in result.data) {
              let d = result.data[i];
              let zd = {};
              zd.name = d.name;
              zd.id = d.code;
              zds.push(zd);
            }
            dictionary(zds);
          }
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
    },
    /* 选中当前表格数据 */
    handleSelectionChange (row) {
      console.log(row);
      this.deleteData = row;
    },
    /* 删除 */
    deleteItem () {
      let arr1 = this.deleteData;
      let arr2 = this.gridData;
      var resArr = arr2.filter((item) => !arr1.includes(item));
      this.gridData = resArr;
    },
    /* 选择样品勾选回调 */
    selectionChange (row) {
      this.snapGridData = row;
    },
    /* 选择样品保存 */
    SelectSampleSave () {
      let rows = [];
      this.snapGridData.forEach((row) => {
        rows.push(row)
      });
      this.gridData = rows
      this.SelectSampleDialog = false;
    },
    /* 检测项取消 */
    closeDialog () {
      this.dialogVisible = false;
    },
    /* 选择样品关闭 */
    SelectSampleSaveClose () {
      this.SelectSampleDialog = false;
    },
    closeSelectSample () {
      this.addSampleDialog = false;
    },
    /* 边框关闭弹框 */
    closeItem () {
      this.dialogVisible = false;
    },
    /* 选择样品弹窗关闭 */
    SelectSampleCloseItem () {
      this.SelectSampleDialog = false;
    },
    /* 添加样品弹窗关闭 */
    addSampleSaveCloseItem () {
      this.addSampleDialog = false;
    },
    //存储条件值
    storageChange (data) {
      console.log(data);
      this.addSampleForm.storageConditions = new Array();
      //循环选中的值
      for (let j in data) {
        let da = data[j];
        //循环总列表
        for (let i in this.storageOptions) {
          let storage = this.storageOptions[i];
          if (storage.id == da) {
            this.addSampleForm.storageConditions.push(storage);
          }
        }
      }
    },
    //样品属性值
    attributeChange (data) {
      console.log(data);
      this.addSampleForm.sampleAttributes = new Array();
      //循环选中的值
      for (let j in data) {
        let da = data[j];
        //循环总列表
        for (let i in this.attributesOptions) {
          let attribute = this.attributesOptions[i];
          if (attribute.id == da) {
            this.addSampleForm.sampleAttributes.push(attribute);
          }
        }
      }
    },
    /* 规格型号过滤 */
    sampleAttributesFormatter (row, column) {
      let value = "";
      if (row) {
        row.sampleAttributes.forEach(e => {
          value += e.name + ';'
        });
      }
      return value;
    },
    /* 存储条件过滤 */
    FilterStorageConditions (row, column) {
      let str = '';
      if (row) {
        row.storageConditions.map((item, index) => {
          str += item.name + ';'
        })
      }
      return str;
    },
    /* 表格单位下拉选中 */
    selectChangeUnit (row) {
      console.log(row);
    },
    /* 获取单位 */
    getUnit () {
      this.$axios.get("tdm/sample/queryDictionary?type=UNIT").then((res) => {
        this.OptionsUnit = res.data;
      });
    },
    /* 是否炸药 */
    FilterisDynamite (row) {
      if (row.isDynamite == 0) {
        return '否'
      } else {
        return '是'
      }
    },
    /* 树形节点点击回调 */
    handleNodeClick (row, node, ele) {
      console.log("row", row)
      /*  this.equipmentLoading = true; */
      this.treeLoading = true;
      setTimeout(() => {
        this.treeLoading = false;
      }, 800)
      this.equipment = [];
      this.row = row;
      this.Eid = row;
      let isAutonomous = this.form.theway == 1 ? 1 : 0;
      this.$axios.get('/tdm/TdmDetectProjectEquipment/getProEquipment', {
        params: {
          proOid: row.id,
          typeUrl: this.form.theway,
          isAutonomous: isAutonomous
        }
      }).then(res => {
        this.equipmentLoading = false
        row['equipment'] = res.data;
        row['Eval'] = res.data;
        /*  console.log(this.Eid); */
        res.data.map(item => {
          item['sampId'] = node.parent.data.value;
        })
        this.sectOid = row['sectOid'] ? row['sectOid'] : '';
        this.equipment = row['equipment'];
        this.peopleId = row['peopleId'] ? row['peopleId'] : '';
        if (this.sectOid == row['equipment'][0].equipmentId) {
          this.selectedEquipment(row['equipment'][0])
        }
        /*  console.log(this.Eid); */
        if (!this.isHandleer) {
          //    console.log(res.data[0], 'res.data');
          /*  this.SelectedEquipmentName = res.data[0].equipmentName;
           this.projectTime = res.data[0].projectTime;
           this.equipmenTask = res.data[0].equipmenTask; */
        }
      }).catch(err => {
        this.$message.error(err.msg)
        this.equipmentLoading = false
      });
      //   console.log(row);
    },
    /* 选择设备弹窗 */
    personneLdialog () {
      this.PersonnelDialogVisible = true;
      this.isContent = true;

    },
    renderContent (h, { node, data, store }) {
      if (!data.children) {
        /*       console.log(data);
              console.log(this.Eid); */
        if (this.Eid.sectOid && !data["sectOid"] && this.Eid.type == data.type) {
          this.Eid.sectOid = "";
          this.sectOid = ""
        }
      }
      return (
        <span style="width:100%;display:flex;justify-content:space-between;">
          <span>{data.label}</span>
          <span style="color: rgb(60, 201, 107);font-size:16px">{data.sectOid ? '✔' : ''}</span>
        </span>
      )
    },
    /* 选中设备 */
    selectedEquipment (item) {
      /*  console.log("item", item); */
      this.equipmentLoading = true;
      this.treeLoading = true;
      this.isContent = false;
      setTimeout(() => {
        this.equipmentLoading = false;
        this.treeLoading = false;
        this.isContent = true;
      }, 500)
      this.loading2 = true;
      if (item.checkinStatus == 0) {
        /* this.SelectedEquipmentName = item.equipmentName
        this.projectTime = item.projectTime
        this.equipmenTask = item.equipmenTask */
        this.sectOid = item.equipmentId;
        this.row['sectOid'] = item.equipmentId;
        if (this.params.samples) {
          this.params.samples.forEach(res => {
            res.detectProject.forEach(data => {
              if (data.id == item.projectId && res.oid == item.sampId) {
                data.equipmentId = item.equipmentId;
              }
            })
          })
        }

        /* console.log(item); */
        /* 选中设备查询人员 */
        this.$axios.get('tdm/team/getPeoples', {
          params: {
            equipmentId: item.equipmentId,
            teamId: item.teamId
          }
        }).then((res) => {
          res.data.forEach(value => {
            value.projectId = item.projectId
            value.sampId = item.sampId
          })
          this.personnelOptions = res.data;
          this.personnelOptions.forEach(res => {
            res.projectId = item.projectId;
          })
          this.loading2 = false;
          /*   console.log(this.Eid); */
        }).catch((err) => {
          this.$message.error(err.msg)
          this.loading2 = false;
        })
      } else if (checkinStatus == 1) {
        this.$message.warning('该设备维护中')
      } else {
        this.$message.warning('该设备不可预约')
      }
      /*  console.log(this.params, 'this.params') */
      /*   if (this.form.theway != 2) {
          if (this.Eid.sectOid) {
            this.ele.$el.children[0].className = ' treeStyle'
          } else {
            this.ele.$el.children[0].className = ''
          }
        } */

    },
    /* 选中人员 */
    handerPersonneID (datas) {
      this.loading2 = true;
      setTimeout(() => {
        this.loading2 = false;
      }, 500)
      this.peopleId = datas.peopleId;
      this.teamId = datas.teamId;
      this.Eid['peopleId'] = datas.peopleId;
      this.params.samples.forEach(val1 => {
        /* console.log(val1); */
        val1.detectProject.forEach(val2 => {
          /*  console.log(val2); */
          if (val2.id == datas.projectId && val1.oid == datas.sampId) {
            val2.peopleId = datas.peopleId;
            val2.teamId = datas.teamId;
          }
        })
      })
      /* console.log(this.params); */
      /*  if (this.form.theway == 2) {
         if (this.Eid.sectOid && this.Eid.peopleId) {
           this.ele.$el.children[0].className = 'treeStyle'
         } else {
           this.ele.$el.children[0].className = ''
         }
       } */

    },
    /* 操作规范 */
    specification (specification) {
      this.$downloadFile(specification)
    },
    /* 安全制度 */
    secureDiscipline (secureDiscipline) {
      this.$downloadFile(secureDiscipline)
    },
    /* 关闭选择设备人员弹窗 */
    personnelCloseDialog () {
      this.PersonnelDialogVisible = false;
      this.isContent = false;
    },
    /* 查看设备负荷 */
    ViewEquipment () {
      this.ViewEquipmentDialog = true;
      this.$nextTick(() => {
        this.$refs.ViewEquipmentRef.refresh()
      })
    },
    /* 查看人员负荷 */
    ViewPersonnel () {
      this.ViewPersonnelDialog = true;
      this.$nextTick(() => {
        this.$refs.ViewPersonnelRef.refresh()
      })
    },
    CloseViewEquipment () {
      this.ViewEquipmentDialog = false;
    },
    CloseViewPersonnel () {
      this.ViewPersonnelDialog = false;
    },
    SelectSampleDelete (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$axios
            .delete("/tdm/sample/delSampleWarehouse", {
              params: { oid: row.oid },
            })
            .then((result) => {
              this.$message.success("删除成功");
              this.$refs.SelectSample.refresh();
            })
            .catch((error) => {
              this.$message.error(error.msg);
            })
        })
    },
    /* 实验项名称 */
    FilterisProjectName (row) {
      console.log(row, 'detectProject');
      let projectName = '';
      if (row.detectProject) {
        row.detectProject.forEach(item => {
          projectName += item.projectName + ';' + '\r\n'
        })
        return projectName
      }
    },
    /* 计量单位 */
    filterSampleUnit (row) {
      /*  console.log(row); */
      return row.dictionaryCategory.name
    },
    selectUserConfirm (row) {
      /*  console.log(row[0]); */
      let da = row[0];
      /*  this.form.selectNameData = row[0].name;
       this.form.selectCodeData = row[0].code; */
      this.form.contact = da.landlineTel;
      this.form.unit = da.deptShortName;
      console.log(this.form);
    }
  },
  computed: {
    selectedCodes () {
      return this.gridData.map((data) => {
        return data.oid;
      });
    },
    selectedCodesDetectItem () {
      return this.SelectDetectItem.map((data) => {
        return data.id;
      });
    },
  },
  created () {
    /*  this.form.theway = this.$route.query.name; */
    this.getUnit();

    let query = this.$route.query;
    if (query.dataId) {
      this.loading = true;
      this.$axios.get('/tdm/experimentAppointment/getAppointmentByDataId', { params: { dataId: query.dataId } }).then(res => {
        this.loading = false
        console.log("res===", res);
        if (res.data != '') {
          this.isHandleer = false;
          this.form.name = res.data.name;
          this.form.unit = res.data.entrustUnit;
          this.form.personnel = res.data.people;
          this.form.contact = res.data.phone;
          this.form.remarks = res.data.remarks;
          this.form.times = res.data.sendSampleTime;
          this.gridData = res.data.samples;
          this.form.theway = res.data.reservationType;
          this.DetectItemSave();
        }
      }).catch(err => {
        this.loading = false
      })
    }
  },
  mounted () {
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  overflow: auto;
  .experiment {
    width: 100%;
  }
}
.button {
  text-align: center;
}
.personnel {
  width: 100%;
  display: flex;
  margin-bottom: 20px;
  font-size: 16px;
  box-sizing: border-box;
  padding: 0 20px;
}
.leftbox,
.middlebox,
.rightbox {
  flex: 1;
  position: relative;
  h3 {
    margin-bottom: 10px;
    padding: 0 25px;
    &::after {
      content: '';
      display: block;
      width: 5px;
      height: 20px;
      background-color: #219fba;
      position: absolute;
      left: 10px;
      top: 2px;
    }
  }
}
.middlebox {
  flex: 2.5;
  h3 {
    span {
      margin-right: 40px;
      position: relative;
      &:nth-child(2) {
        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #4acf2b;
          position: absolute;
          top: 3px;
          left: -15px;
        }
      }
      &:nth-child(3) {
        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ff6666;
          position: absolute;
          top: 3px;
          left: -15px;
        }
      }
      &:nth-child(4) {
        &::before {
          content: '';
          display: block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #ccc;
          position: absolute;
          top: 3px;
          left: -15px;
        }
      }
    }
  }
}
.left-child-box,
.right-child-box,
.middle-child-box {
  height: 450px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #ccc;
}
.left-child-box {
  overflow: auto;
}
.right-child-box {
  overflow: auto;
}
/* 人员 */
.personnel-content {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  box-sizing: border-box;
  overflow: auto;
  padding: 10px;
  li {
    display: flex;
    flex-direction: column;
    border: 1px dashed #ccc;
    width: 100px;
    padding: 5px;
    margin-right: 10px;
    margin-bottom: 10px;
    position: relative;
    cursor: pointer;
    &:nth-child(3n) {
      margin-right: 0;
    }
    span {
      text-align: center;
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
}
.left-child-box {
  box-sizing: border-box;
  padding: 20px 30px;
}
.middle-child-box {
  /*  background-color: #f6f6f6; */
  padding: 25px 10px;
  overflow: auto;
  box-sizing: border-box;
  margin: 0 15px;
  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    box-sizing: border-box;
    padding: 0 20px;
    li {
      width: 260px;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      padding: 5px 0;
      padding-left: 15px;
      box-shadow: 0px 0px 10px #ccc;
      margin-bottom: 15px;
      margin-left: 20px;
      span {
        font-size: 13px;
        margin-bottom: 5px;
        overflow: hidden;
        &:nth-child(1) {
          display: block;
          height: 100%;
          width: 6px;
          background-color: #4acf2b;
          position: absolute;
          left: 0;
          top: 0;
        }
      }
    }
  }
  .manual {
    margin-left: 20px;
    font-size: 14px;
    a {
      color: #0066ff;
    }
  }
}
.scheme-personnel {
  width: 100%;
  height: 500px;
  box-sizing: border-box;
  padding: 10px;
  display: flex;
  .scheme {
    width: 400px;
    height: 100%;
    margin-right: 20px;
    box-shadow: 0px 0px 10px #ccc;
    box-sizing: border-box;
    padding: 10px;
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .status {
      text-align: center;
      margin-bottom: 25px;
      span {
        margin-right: 40px;
        position: relative;
        &:nth-child(1) {
          &::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #4acf2b;
            position: absolute;
            top: 3px;
            left: -15px;
          }
        }
        &:nth-child(2) {
          &::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ff6666;
            position: absolute;
            top: 3px;
            left: -15px;
          }
        }
        &:nth-child(3) {
          &::before {
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: #ccc;
            position: absolute;
            top: 3px;
            left: -15px;
          }
        }
      }
    }
    .planSelection {
      padding: 0 30px;
    }
  }
  .experiment-personnel {
    width: 550px;
    height: 100%;
    box-shadow: 0px 0px 10px #ccc;
    box-sizing: border-box;
    padding: 10px;
    h3 {
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
}
.success {
  display: flex;
  justify-content: center;
  .handleSuccess {
    width: 450px;
    height: 320px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 150px;
    span {
      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
/deep/ .el-timeline-item__wrapper {
  display: flex;
}
/deep/ .el-timeline-item__timestamp {
  margin-right: 50px;
  font-size: 16px;
}
.formList {
  box-sizing: border-box;
  padding: 10px 10px;
  padding-right: 20px;
}
/deep/ .cell {
  text-align: center !important;
}
.el-tree /deep/ .el-tree-node__label {
  display: inline-block;
  width: 72%;
}
.el-tree /deep/ .el-tree-node__children .is-current .el-tree-node__content {
  cursor: pointer;
  color: rgb(243, 89, 89) !important;
}
.el-tree /deep/ .el-tree-node__children .treeStyle {
  position: relative;
  display: flex;
  justify-content: start;
}
.el-tree /deep/ .el-tree-node__children .treeStyle::after {
  content: '\2714';
  font-size: 20px;
  position: absolute;
  right: 0;
  bottom: 0;
  cursor: pointer;
  color: rgb(60, 201, 107) !important;
}
.el-tree .el-tree-node__expand-icon {
  color: #fff !important;
}
.el-tree-node__expand-icon.is-leaf {
  color: transparent !important;
}
/* 设备选中样式 */
.Selected {
  &::before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 10;
  }
  &::after {
    content: '';
    position: absolute;
    left: 38%;
    top: 30%;
    width: 40px;
    height: 20px;
    border: 5px solid rgb(11, 243, 30);
    border-radius: 1px;
    border-top: none;
    border-right: none;
    background: transparent;
    -ms-transform: rotate(-45deg);
    transform: rotate(-45deg);
    z-index: 11;
  }
}
.bgc-color-red {
  background-color: red !important;
}
.text-color-red {
  color: red;
}
.bgc-color-green {
  background-color: rgb(4, 212, 4) !important;
}
.text-color-green {
  color: rgb(4, 212, 4);
}
.bgc-color-gray {
  background-color: gray !important;
}
.text-color-gray {
  color: gray;
}
body {
  margin: 0;
}
/* 影藏组件自定义滚动条 */
/deep/.__bar-is-vertical {
  display: none !important;
}
.tagList {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  padding: 0 50px;
  .el-tag {
    margin-right: 20px;
    margin-bottom: 10px;
  }
}
</style>
<style>
.el-tooltip__popper {
  max-width: 400px;
  line-height:1.5
}
</style>
