<template>
  <div class="container">
    <!-- <ice-flow-form name
                   valiate
                   ref="flowForm"
                   :flowReady="flowReady"
                   :flowOperateBtn="flowOperateBtn"
                   :flowBizData="flowBizData"
                   :btn-extend1="alterationAssign"> -->

    <el-steps :active="active"
              finish-status="success"
              align-center>
      <el-step v-for="item in steps"
               :key="item.id"
               :title="item.title"></el-step>
    </el-steps>
    <!-- 实验预约 -->
    <div class="experiment"
         v-if="active == 0">
      <el-form ref="form"
               :model="form"
               label-width="120px"
               :rules="rules"
               class="ExperimentForm">
        <el-form-item label="实验名称:"
                      prop="name">
          <el-input v-model="form.name"
                    :disabled="!isHandleer"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="实验方式:"
                      prop="theway">
          <el-input v-model="form.theway"
                    placeholder="请输入内容"
                    :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="委托单位:"
                      prop="unit">
          <el-input v-model="form.unit"
                    :disabled="!isHandleer"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <!--   <el-form-item label="实验时间:"
                        prop="time">
            <el-date-picker v-model="form.time"
                            type="datetime"
                            placeholder="选择日期时间">
            </el-date-picker>
          </el-form-item> -->
        <el-form-item label="联系方式:"
                      prop="contact">
          <el-input v-model="form.contact"
                    :disabled="!isHandleer"
                    placeholder="请输入电话号码"
                    show-word-limit
                    clearable
                    maxlength="11"
                    oninput="value=value.replace(^0?1[34578]\\d{9}$,'')"></el-input>
        </el-form-item>
        <el-form-item label="预约人:"
                      prop="personnel">
          <el-input v-model="form.personnel"
                    :disabled="!isHandleer"
                    placeholder="请输入预约人:"></el-input>
        </el-form-item>
        <el-form-item label="预计完成时间:"
                      prop="times">
          <el-date-picker v-model="form.times"
                          :disabled="!isHandleer"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注说明:">
          <el-input type="textarea"
                    v-model="form.remarks"
                    :disabled="!isHandleer"
                    placeholder="简略描述预约备注说明"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 样品登记 -->
    <div class="sample"
         v-if="active == 1">
      <div class="buttons"
           v-if="isHandleer"
           style="margin-bottom:15px">
        <el-button icon="el-icon-plus"
                   type="primary"
                   @click='addSample'>添加</el-button>
        <el-button icon="el-icon-minus"
                   type="danger"
                   @click="deleteItem">删除</el-button>
        <!--    <el-button icon="el-icon-check"
                     type="success"
                     @click='addSample'>保存</el-button> -->
        <el-button icon="el-icon-zoom-in"
                   type="primary"
                   @click='SelectSample'>选择</el-button>
      </div>
      <el-table :data="gridData"
                style="width: 100%;min-height:450px"
                stripe
                :border='true'
                @selection-change="handleSelectionChange">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column label="样品名称"
                         align="center"
                         prop="sampleName"></el-table-column>
        <el-table-column label="规格型号"
                         width="160"
                         align="center"
                         prop="sampleAttributes"
                         :formatter="sampleAttributesFormatter"></el-table-column>
        <el-table-column label="数量"
                         align="center"
                         prop="sampleNum">
          <template slot-scope="scope">
            <el-input-number v-model="scope.row.sampleNum"
                             :disabled="!isHandleer"
                             :min="0.1"
                             :max="99999"
                             :precision="1"
                             :step="0.1"
                             label="请输入内容"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="计量单位"
                         align="center"
                         prop="sampleUnit">
          <template slot-scope="scope">
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
          </template>
        </el-table-column>
        <el-table-column label="存储条件"
                         align="center"
                         prop="storageConditions"
                         :formatter="FilterStorageConditions"></el-table-column>
        <el-table-column label="是否炸药"
                         align="center"
                         prop="isDynamite"
                         :formatter="FilterisDynamite"></el-table-column>
        <el-table-column label="操作"
                         align="center">
          <template slot-scope="scope">
            <el-button @click="Detect(scope.row)"
                       type="text"
                       size="small">检测项目</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 选择设备 -->
    <div class="personnel"
         v-if="active == 2">
      <div class="leftbox">
        <h3>样品 | 检测项目</h3>
        <div class="left-child-box">
          <div class="block">
            <el-tree :data="treedata"
                     node-key="id"
                     :expand-on-click-node="false"
                     @node-click="handleNodeClick"
                     :props="defaultProps"
                     ref="tree"
                     default-expand-all>
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
        <div class="middle-child-box"
             v-loading="equipmentLoading">
          <ul>
            <li v-for="item in equipment"
                :key="item.equipmentId"
                @click="selectedEquipment(item.equipmentId,item.checkinStatus,item.projectId,item.equipmentName,item.type, item.sampId,item.projectTime,item.equipmenTask)"
                ref="equipmentRef"
                :class="{Selected: sectOid==item.equipmentId}"
                :id="item.equipmentId">
              <span :class="item.checkinStatus==0?'bgc-color-green':item.checkinStatus==1?'bgc-color-gray':'bgc-color-red'"></span>
              <span>编号: <i>{{item.equipmentNumber}}</i> </span>
              <span>名称: <i>{{item.equipmentName}}</i> </span>
              <span :class="item.checkinStatus==0?'text-color-green':item.checkinStatus==1?'text-color-gray':'text-color-red'">
                状态: <i>{{item.checkinStatus==0?'正常':item.checkinStatus==1?'维护中':'不可预约'}}</i>
              </span>
            </li>
          </ul>
          <div class="manual">
            <p>设备【{{SelectedEquipmentName}}】标准工作效能：【{{projectTime}}】小时;当天设备任务数:【{{equipmenTask}}】</p>
            <p><a href="#"
                 @click="specification(secureDiscipline)">设备操作说明书.pdf</a></p>
            <p><a href="#"
                 @click="secureDiscipline(secureDiscipline )">设备安全说明书.pdf</a></p>
          </div>
        </div>
      </div>
      <!-- <div class="rightbox">
          <h3>日期选择</h3>
          <div class="right-child-box">
            <el-date-picker
              v-model="dateValue"
              type="datetime"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </div>
        </div> -->
    </div>

    <!-- 查看选择设备 -->
    <!--      <div class="personnel"-->
    <!--           v-if="active == 2">-->
    <!--        <div class="leftbox">-->
    <!--          <h3>样品 | 检测项目</h3>-->
    <!--          <div class="left-child-box">-->
    <!--            <div class="block">-->
    <!--              <el-tree :data="treedata"-->
    <!--                       node-key="id"-->
    <!--                       :expand-on-click-node="false"-->
    <!--                       @node-click="handleNodeClick"-->
    <!--                       :props="defaultProps"-->
    <!--                       ref="tree"-->
    <!--                       default-expand-all>-->
    <!--              </el-tree>-->
    <!--            </div>-->
    <!--          </div>-->
    <!--        </div>-->

    <!--      </div>-->

    <!-- 预约成功 -->
    <div class="success"
         v-if="active == 3">
      <div class="handleSuccess"
           v-loading="loading">
        <span><img :src="AppointmentData.Documents!=''?appintmentstatus[0]:appintmentstatus[1]"
               alt="" /></span>
        <span>{{AppointmentData.name}}</span>
        <span>{{AppointmentData.value}}
          <i style="color:#C92D30 ;font-weight: bold">{{AppointmentData.Documents}}</i>,{{AppointmentData.value1}}</span>
        <span>{{AppointmentData.value2}}</span>
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <div class="button">
      <el-button style="margin-top: 12px;"
                 @click="previous"
                 :disabled="active == 0"
                 v-if="active !== 3">上一步</el-button>
      <el-button style="margin-top: 12px;"
                 @click="next"
                 v-if="active < 2 ">{{
          active !== 2 ? "下一步" : "提交预约"
          }}</el-button>
      <el-button style="margin-top: 12px;"
                 @click="continueApp"
                 v-if="active == 3">继续预约</el-button>
      <el-button style="margin-top: 12px;"
                 @click="confirm"
                 v-if="active == 3">确认</el-button>
    </div>
    <!-- 检测项目弹窗 -->
    <ice-dialog v-dialogDrag
                title="检测项目"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="1600px">
      <ice-query-grid title="检测项目"
                      data-url="/tdm/detectProject/list"
                      :pagination="true"
                      :columns="DetectItemData"
                      ref="DetectItem"
                      :gridIndex="false"
                      chooseItem="multiple"
                      :selectedCodes="selectedCodesDetectItem"
                      codeProp="id"
                      @selection-change="DetectItemChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   v-if="isHandleer"
                   @click="DetectItemSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择样品弹窗 -->
    <ice-dialog v-dialogDrag
                title="选择样品"
                :visible.sync="SelectSampleDialog"
                :close-on-click-modal="false"
                :before-close="SelectSampleCloseItem"
                append-to-body
                width="1600px">
      <ice-query-grid title="选择样品"
                      data-url="/tdm/sample/sampleWarehouseList"
                      :pagination="true"
                      :columns="SelectSampleData"
                      ref="SelectSample"
                      chooseItem="multiple"
                      :gridIndex="false"
                      :query="SelectSampleQuery"
                      @selection-change="selectionChange"
                      :selectedCodes="selectedCodes"
                      codeProp="oid"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="SelectSampleSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="SelectSampleSaveClose">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 添加样品弹窗 -->
    <ice-dialog v-dialogDrag
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
        <el-form-item label="样品名称:"
                      prop="sampleName">
          <el-input v-model="addSampleForm.sampleName"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
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
    </ice-dialog>

    <!--  </ice-flow-form> -->

    <!-- 产能方案弹窗 -->
    <!-- <ice-dialog
      v-dialogDrag
      title="产能方案"
      center
      :visible.sync="ProduceDialog"
      :close-on-click-modal="false"
      :before-close="ProduceCloseItem"
      append-to-body
      width="1000px"
    >
      <div class="scheme-personnel">
        <div class="scheme">
          <h3>产能方案</h3>
          <div class="status">
            <span>可预约</span>
            <span>不可预约</span>
            <span>维护中</span>
          </div>
          <div class="planSelection">
            <el-timeline>
              <el-timeline-item timestamp="1" placement="top">
                <el-switch
                  v-model="switchValue1"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :disabled="isdisabled1"
                >
                </el-switch>
              </el-timeline-item>
              <el-timeline-item timestamp="2" placement="top">
                <el-switch
                  v-model="switchValue2"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :disabled="isdisabled2"
                >
                </el-switch>
              </el-timeline-item>
              <el-timeline-item timestamp="3" placement="top">
                <el-switch
                  v-model="switchValue3"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :disabled="isdisabled3"
                >
                </el-switch>
              </el-timeline-item>
              <el-timeline-item timestamp="4" placement="top">
                <el-switch
                  v-model="switchValue4"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                  :disabled="isdisabled4"
                >
                </el-switch>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="experiment-personnel">
          <h3>实验人员</h3>
          <div class="personnelList">
            <ice-query-grid
              title="实验人员"
              data-url="/permission/work_position/list"
              :pagination="false"
              :columns="personnelList"
              ref="grid2"
              chooseItem="multiple"
            >
            </ice-query-grid>
          </div>
        </div>
      </div>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="ProduceSave"
          >保存</el-button
        >
        <el-button type="info" size="medium" @click="ProduceCloseDialog"
          >取消</el-button
        >
      </div>
    </ice-dialog> -->
  </div>
</template>
<script>
import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";

export default {
  name: "AutonomousExperiment",
  components: { IceFlowForm, IceQueryGrid, IceDialog },
  data () {
    return {
      activeName: 'first',
      attaTableData: [],
      isHandleer: true,
      bizdata: { xmname: '', dataSecretLevcode: '2' },

      /* 步骤 */
      active: 0,
      steps: [
        {
          id: 1,
          title: "实验预约",
        },
        {
          id: 2,
          title: "样品登记",
        },
        {
          id: 3,
          title: "选择设备",
        },
        {
          id: 4,
          title: "预约成功",
        },
      ],
      /* 实验预约表单数据 */
      form: {
        name: "",
        theway: "",
        unit: "",
        contact: "",
        personnel: "",
        remarks: "",
        times: "",
      },
      /* 添加样品表单数据 */
      addSampleForm: {},
      /* 实验预约表单验证规则 */
      rules: {
        name: [{ required: true, message: "请输入实验名称", trigger: "blur" }],
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
        isDynamite: [
          { required: true, message: "请选择是否炸药", trigger: "change" },
        ],
        attributesValue: [
          { required: false, message: "请选择规格型号", trigger: "change" },
        ],
        storageValue: [
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
          width: 150,
          align: "center",
        },
        {
          label: "样品外观",
          code: "sampleExterior",
          width: 150,
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 150,
          align: "center",
          formatter (row) {
            return row.isDynamite == 0 ? "否" : "是";
          },
        },
        {
          label: "样品属性",
          code: "sampleAttributes",
          width: 300,
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
          label: "存储条件",
          code: "storageConditions",
          width: 300,
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
          width: 100,
          align: "center",
          formatter (row) {
            return row.status == 0 ? "禁用" : "启用";
          },
        },
      ],
      /* 检测项目表格数据 */
      DetectItemData: [
        {
          label: "实验项名称",
          code: "projectName",
          width: 200,
          align: "center",
        },
        {
          label: "检测项目名称",
          code: "experimentCategoryName",
          align: "center",
          width: 200,
        },
        {
          label: "样品要求",
          code: "sampleRequirements",
          width: 200,
          align: "center",
        },
        { label: "阈值", code: "threshold", width: 200, align: "center" },
        { label: "备注", code: "remarks", width: 200, align: "center" },
        {
          label: "启用状态",
          code: "status",
          width: 200,
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
        label: 'label'
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
      equipmentLoading: true,
      /* 设备名字 */
      SelectedEquipmentName: '',
      /* 工效时间 */
      projectTime: '',
      row: {},
      sectOid: '',
      /* 任务数 */
      equipmenTask: '',
      SelectSampleQuery: [
        { type: 'static', code: 'status', value: 1 }
      ],
    };
  },

  methods: {
    /*  alterationAssign (flowContext, bizdata) {
 
     }, */
    /*  flowReady (flowContext, bizdata) {
       //流程初始化
       Object.assign(this.bizdata, bizdata);
       //驳回才能编辑
     }, */
    /*  flowOperateBtn (flowContext, bizdata) {
       //按钮操作事件
       console.log('按钮操作事件')
       return true;
     }, */
    /*  flowBizData () {
       let params = {};
       params.name = this.form.name;
       params.reservationType = 3;
       params.experimentType = 2;
       params.entrustUnit = this.form.unit;
       params.people = this.form.personnel;
       params.phone = this.form.contact;
       params.remarks = this.form.remarks;
       params.sendSampleTime = this.form.times;
       params.samples = this.gridData;
       //获取业务表单数据
       return params;
     }, */



    /* 上一步 */
    previous () {
      this.active--;
    },
    /* 下一步 */
    next () {
      if (this.active++ > 3) this.active = 0;
      if (this.active == 2) {
        this.params.name = this.form.name;
        this.params.reservationType = 1;
        this.params.experimentType = 1;
        this.params.entrustUnit = this.form.unit;
        this.params.people = this.form.personnel;
        this.params.phone = this.form.contact;
        this.params.remarks = this.form.remarks;
        this.params.sendSampleTime = this.form.times;
        this.params.samples = this.gridData;
      }
      if (this.active == 3) {
        console.log(this.params);
        this.$confirm('此操作将提交预约, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.put('/tdm/experimentAppointment/submit', this.params).then(res => {
            console.log(res);
            if (res.data != '') {
              this.loading = false
              this.AppointmentData.name = '实验预约完成'
              this.AppointmentData.value = '预约受理号:'
              this.AppointmentData.Documents = res.data
              this.AppointmentData.value1 = '请妥善保管'
              this.AppointmentData.value3 = '您可凭借受理号查询进度和打印报表'
            }
          }).catch(err => {
            console.log(err);
            this.$message.error(err)
            this.loading = false
            this.AppointmentData.name = '实验预约失败'
            this.AppointmentData.value = ''
            this.AppointmentData.Documents = ''
            this.AppointmentData.value1 = ''
            this.AppointmentData.value3 = ''
          })
        })
      }
    },
    /* 确认 */
    confirm () {
      this.$router.push('SelfHelpNavigations');
      this.AppointmentData = {};
      this.active = 0;
      this.form.name = "";
      this.form.unit = "";
      this.form.contact = "";
      this.form.personnel = "";
      this.form.remarks = "";
      this.form.times = "";
      this.gridData = [];
    },
    /* 继续预约 */
    continueApp () {
      this.active = 0;
      this.form.name = "";
      this.form.unit = "";
      this.form.contact = "";
      this.form.personnel = "";
      this.form.remarks = "";
      this.form.times = "";
      this.gridData = [];
      this.AppointmentData = {};
      this.equipment = [];
      this.treedata = []
    },
    /* 检测项目回调 */
    Detect (row) {
      /*   this.treedata = []; */
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.DetectItem.refresh();
      });
      this.row = row;
      /*  console.log(this.row, '==='); */
      this.SelectDetectItem = row.detectProject ? row.detectProject : [];
    },
    /* 检测项目勾选回调 */
    DetectItemChange (rows) {
      this.SelectDetectItem = rows;
      /*     console.log(this.SelectDetectItem, '=this.SelectDetectItem'); */
    },
    /* 检测项目保存 */
    DetectItemSave () {
      this.dialogVisible = false;
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
      console.log(this.treedata, '=this.treedata');
    },
    /* 选择样品回调 */
    SelectSample () {
      this.SelectSampleDialog = true;
      this.$nextTick(() => {
        this.$refs.SelectSample.refresh();
      });
    },
    /* 打开添加样品弹窗 */
    addSample () {
      this.emptyForm();
      this.addSampleDialog = true;
      this.addSampleForm = {};
    },
    /* 添加样品保存 */
    addSampleSave () {
      this.$refs.addSampleFormRef.validate(vali => {
        if (vali) {
          this.gridData.push(this.addSampleForm);
          this.addSampleDialog = false;
        } else {
          this.$message.error('表单请输入完整!')
        }
      })

    },
    /* 选中当前表格数据 */
    handleSelectionChange (row) {
      console.log(row);
      this.deleteData = row;
      console.log(this.treedata, 'this.treedata');
    },
    /* 删除 */
    deleteItem () {
      let arr1 = this.deleteData;
      let arr2 = this.gridData;
      var resArr = arr2.filter((item) => !arr1.includes(item));
      this.gridData = resArr;
      this.DetectItemSave();
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
      /*   console.log(this.gridData, '=this.gridData'); */
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
      let fruits = this.storageValue;
      let OldJson = fruits.map((item, index) => {
        let newJson = {};
        newJson.name = item;
        return newJson;
      });
      this.addSampleForm.storageConditions = OldJson;
      console.log(this.addSampleForm);
    },
    //样品属性值
    attributeChange (data) {
      let fruits = this.attributesValue;
      let OldJson = fruits.map((item, index) => {
        let newJson = {};
        newJson.name = item;
        return newJson;
      });
      this.addSampleForm.sampleAttributes = OldJson;
    },
    //刷新表单
    emptyForm () {
      this.addSampleForm = {};
      this.attributesValue = [];
      this.storageValue = [];
      let that = this;
      this.queryDictionary("ypsx", function (data) {
        that.attributesOptions = data;
      });
      this.queryDictionary("ypcctj", function (data) {
        that.storageOptions = data;
      });
    },
    queryDictionary (code, dictionary) {
      this.$axios
        .get("/tdm/sample/queryDictionary", { params: { type: code } })
        .then((result) => {
          // console.log("result", result);
          if ((result.status = 200)) {
            dictionary(result.data);
          }
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
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
    handleNodeClick (row, node) {
      console.log(node.data.value)
      this.equipmentLoading = true;
      this.equipment = [];
      this.row = row;
      setTimeout(() => {
        this.$axios.get('/tdm/TdmDetectProjectEquipment/getProEquipment', {
          params: {
            proOid: row.id
          }
        }).then(res => {
          row['equipment'] = res.data;
          res.data.map(c => {
            c['sampId'] = node.parent.data.value;
          })
          this.sectOid = row['sectOid'] ? row['sectOid'] : '';
          this.equipment = row['equipment'];

          this.equipmentLoading = false
        }).catch(err => {
          console.log(err);
        })
      }, 200)

    },
    /* 选中设备 */
    selectedEquipment (equipmentId, checkinStatus, projectId, equipmentName, type, sampId, projectTime, equipmenTask) {
      if (checkinStatus == 0) {
        this.SelectedEquipmentName = equipmentName
        this.projectTime = projectTime
        this.equipmenTask = equipmenTask
        console.log(projectTime);
        this.sectOid = equipmentId;
        this.row['sectOid'] = equipmentId;
        console.log(equipmentId, sampId, 'projectId')
        this.params.samples.forEach(item => {
          item.detectProject.forEach(items => {
            if (items.id == projectId && item.oid == sampId) {

              items.equipmentId = equipmentId
            }
          })
        })
      } else if (checkinStatus == 1) {
        this.$message.warning('该设备维护中')
      } else {
        this.$message.warning('该设备不可预约')
      }

      console.log(this.params, 'this.params')
    },
    /* 操作规范 */
    specification (specification) {
      this.$downloadFile(specification)
    },
    /* 安全制度 */
    secureDiscipline (secureDiscipline) {
      this.$downloadFile(secureDiscipline)
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
    this.form.theway = this.$route.query.name;
    this.getUnit();

    let query = this.$route.query;
    if (query.dataId) {
      this.loading = true;
      this.$axios.get('/tdm/experimentAppointment/getAppointmentByDataId', { params: { dataId: query.dataId } }).then(res => {
        this.loading = false
        if (res.data != '') {
          this.isHandleer = false;
          this.form.name = res.data.name;
          this.form.unit = res.data.entrustUnit;
          this.form.personnel = res.data.people;
          this.form.contact = res.data.phone;
          this.form.remarks = res.data.remarks;
          this.form.times = res.data.sendSampleTime;
          this.gridData = res.data.samples;
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
  .experiment {
    padding: 40px 200px;
    padding-left: 50px;
    .ExperimentForm {
      display: flex;
      flex-direction: column;
      align-items: center;
      .el-form-item {
        margin-bottom: 25px;
        width: 50%;
      }
    }
  }
}
.button {
  text-align: center;
}
.sample {
  margin-top: 20px;
}
.personnel {
  width: 100%;
  display: flex;
  margin-top: 20px;
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
.A-sample {
  margin-bottom: 20px;
  font-size: 14px;
  h4 {
    margin-bottom: 15px;
  }
}
.B-sample {
  font-size: 14px;
  h4 {
    margin-bottom: 15px;
  }
}
.middlebox {
  flex: 2;
  margin: 0 20px;
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
.middle-child-box,
.right-child-box {
  height: 400px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px #ccc;
}
.right-child-box {
  box-shadow: none;
}
.left-child-box {
  box-sizing: border-box;
  padding: 20px 30px;
}
.middle-child-box {
  background-color: #f6f6f6;
  padding: 25px 10px;
  box-sizing: border-box;
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      margin: 0 0 20px 20px;
      width: 175px;
      height: 100px;
      background-color: #fff;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      padding-left: 15px;
      padding-top: 20px;
      display: flex;
      flex-direction: column;
      cursor: pointer;
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
  padding-right: 30px;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
}
.el-form-item {
  width: 50%;
}
/deep/ .cell {
  text-align: center !important;
}
.el-tree /deep/ .el-tree-node__label {
  display: inline-block;
  width: 72%;
}
.el-tree /deep/ .el-tree-node__children .is-current .el-tree-node__content:after {
  content: '\2022';
  font-size: 60px;
  position: relative;
  right: 10px;
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
</style>