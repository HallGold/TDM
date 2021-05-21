<template>
  <div class="container">
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
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="实验方式:"
                      prop="theway">
          <el-select v-model="form.theway"
                     placeholder="请选择活动区域">
            <el-option label="自主预约"
                       value="1"></el-option>
            <el-option label="委托预约"
                       value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="委托单位:"
                      prop="unit">
          <el-input v-model="form.unit"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="最晚送样时间:"
                      prop="time">
          <el-date-picker v-model="form.time"
                          type="datetime"
                          placeholder="选择日期时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="联系方式:"
                      prop="contact">
          <el-input v-model="form.contact"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="预约人:"
                      prop="personnel">
          <el-input v-model="form.personnel"
                    placeholder="请输入内容:"></el-input>
        </el-form-item>
        <el-form-item label="备注说明:">
          <el-input type="textarea"
                    v-model="form.remarks"
                    placeholder="简略描述预约备注说明"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <!-- 样品登记 -->
    <div class="sample"
         v-if="active == 1">
      <ice-query-grid title="实验预约申请"
                      :pagination="false"
                      :gridData="gridData"
                      :columns="columnsWork"
                      :operations="operationsWork"
                      ref="grid"
                      :operationsWidth="150"
                      chooseItem="multiple"
                      :buttons="buttons"
                      @selection-change="handleSelectionChange">
      </ice-query-grid>
    </div>
    <!-- 设备人员选择 -->
    <div class="personnel"
         v-if="active == 2">
      <div class="leftbox">
        <h3>样品 | 检测项目</h3>
        <div class="left-child-box">
          <div class="A-sample">
            <h4>A样品</h4>
            <el-select v-model="sampleOptions_A"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="B-sample">
            <h4>B样品</h4>
            <el-select v-model="sampleOptions_B"
                       clearable
                       placeholder="请选择">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
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
        <div class="middle-child-box">
          <ul>
            <li>
              <span></span>
              <span>编号: <i>001</i> </span>
              <span>名称: <i>尺寸测量仪</i> </span>
              <span>状态: <i>正常</i> </span>
            </li>
            <li>
              <span></span>
              <span>编号: <i>001</i> </span>
              <span>名称: <i>尺寸测量仪</i> </span>
              <span>状态: <i>正常</i> </span>
            </li>
            <li>
              <span></span>
              <span>编号: <i>001</i> </span>
              <span>名称: <i>尺寸测量仪</i> </span>
              <span>状态: <i>正常</i> </span>
            </li>
            <li>
              <span></span>
              <span>编号: <i>001</i> </span>
              <span>名称: <i>尺寸测量仪</i> </span>
              <span>状态: <i>正常</i> </span>
            </li>
          </ul>
          <div class="manual">
            <p>设备【xxx仪】标准工作效能：【2】小时；</p>
            <p><a href="#">设备操作说明书.pdf</a></p>
            <p><a href="#">设备安全说明书.pdf</a></p>
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
    <!-- 预约成功 -->
    <div class="success"
         v-if="active == 3">
      <div class="handleSuccess">
        <span><img src="https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2027944484,1041176236&fm=26&gp=0.jpg"
               alt="" /></span>
        <span>试验预约成功</span>
        <span>预约受理号
          <i style="color:#C92D30 ;font-weight: bold">SYYY2020071100001</i>,请妥善保管</span>
        <span>您可凭借受理号查询进度和打印报表</span>
      </div>
    </div>
    <!-- 底部操作按钮 -->
    <div class="button">
      <el-button style="margin-top: 12px;"
                 @click="previous"
                 :disabled="active == 0"
                 v-if="active !== 3">上一页</el-button>
      <el-button style="margin-top: 12px;"
                 @click="next"
                 v-if="active !== 3">{{
        active !== 2 ? "下一页" : "提交预约"
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
                      chooseItem="multiple"
                      :selectedCodes="selectedCodesDetectItem"
                      codeProp="id"
                      @selection-change="DetectItemChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
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
                      :query="SelectSampleQuery"
                      chooseItem="multiple"
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
      <el-form ref="addSampleForm"
               :model="addSampleForm"
               label-width="120px"
               :rules="addSampleFormRules"
               class="formList">
        <el-form-item label="样品名称:">
          <el-input v-model="addSampleForm.sampleName"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="样品外观:">
          <el-input v-model="addSampleForm.sampleExterior"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="检测依据:">
          <el-input v-model="addSampleForm.testingStandard"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="是否炸药:"
                      prop="model">
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
                      prop="condition">
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
        <el-form-item label="样品属性:"
                      prop="isCorrosion">
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
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "reservation",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
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
          title: "设备人员选择",
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
        time: "",
        contact: "",
        personnel: "",
        remarks: "",
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
        time: [
          { required: true, message: "请输入最晚送样时间", trigger: "change" },
        ],
        contact: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
        personnel: [
          { required: true, message: "请输入联系人", trigger: "blur" },
        ],
      },
      /* 添加样品表单验证规则 */
      addSampleFormRules: {
        sampleName: [
          { required: true, message: "请输入样品名称", trigger: "blur" },
        ],
        sampleExterior: [
          { required: true, message: "请输入样品外观", trigger: "blur" },
        ],
        testingStandard: [
          { required: true, message: "请输入检测依据", trigger: "blur" },
        ],
        isDynamite: [
          { required: true, message: "请选择是否炸药", trigger: "change" },
        ],
        sampleAttributes: [
          { required: true, message: "请选择样品属性", trigger: "change" },
        ],
        storageConditions: [
          { required: true, message: "请选择存储条件", trigger: "change" },
        ],
      },
      /* 获取添加样品表格数据 */
      snapGridData: [], //临时存储样品表格数据
      gridData: [],
      /* 样品登记表格数据 */
      columnsWork: [
        { code: "oid", hidden: true },
        {
          label: "样品名称",
          code: "sampleName",
          width: 120,
          align: "center",
        },
        {
          label: "样品外观",
          code: "sampleExterior",
          width: 120,
          align: "center",
        },
        {
          label: "检测依据",
          code: "testingStandard",
          width: 120,
          align: "center",
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 120,
          align: "center",
          formatter (row) {
            return row.isDynamite == 0 ? "否" : "是";
          },
        },
        {
          label: "样品属性",
          code: "sampleAttributes",
          width: 120,
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
          width: 120,
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
      ],
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
          label: "检测依据",
          code: "testingStandard",
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
          width: 120,
          align: "center",
        },
        {
          label: "检测项目名称",
          code: "experimentCategoryName",
          width: 120,
          align: "center",
        },
        {
          label: "样品要求",
          code: "sampleRequirements",
          width: 120,
          align: "center",
        },
        { label: "阈值", code: "threshold", width: 120, align: "center" },
        { label: "备注", code: "remarks", width: 120, align: "center" },
        {
          label: "启用状态",
          code: "status",
          width: 120,
          align: "center",
          formatter (row) {
            if (row.status == 0) {
              return "未启用";
            }
            return "已启用";
          },
        },
      ],
      /* 实验人员表格数据 */
      personnelList: [
        { code: "oid", hidden: true },
        {
          label: "工号",
          code: "name",
          width: 70,
          align: "center",
        },
        {
          label: "姓名",
          code: "name",
          width: 70,
          align: "center",
        },
        {
          label: "单位",
          code: "name",
          width: 70,
          align: "center",
        },
        {
          label: "部门",
          code: "name",
          width: 70,
          align: "center",
        },
        {
          label: "联系方式",
          code: "name",
          width: 70,
          align: "center",
        },
      ],
      /* 表格按钮回调 */
      operationsWork: [{ name: "检测项目", callback: this.Detect }],
      buttons: [
        {
          name: "添加",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addSample,
        },
        {
          name: "删除",
          icon: "el-icon-minus",
          type: "danger",
          callback: this.delete,
        },
        {
          name: "保存",
          icon: "el-icon-check",
          type: "success",
        },
        {
          name: "选择",
          icon: "el-icon-zoom-in",
          type: "primary",
          callback: this.SelectSample,
        },
      ],
      dialogVisible: false,
      SelectSampleDialog: false,
      addSampleDialog: false,
      /*  ProduceDialog: false, */
      /* 选择时间 */
      /* dateValue: "", */
      /* AB样品检测选择 */
      sampleOptions_A: [],
      sampleOptions_B: [],
      /* AB样品检测基础数据 */
      options: [
        {
          value: "1",
          label: "成份检测实验",
        },
        {
          value: "2",
          label: "耐火度检测实验",
        },
      ],
      options2: [
        {
          value: "1",
          label: "成份检测实验",
        },
        {
          value: "2",
          label: "耐火度检测实验",
        },
      ],
      /* 产能方案多选 */
      /*  switchValue1: true,
      switchValue2: true,
      switchValue3: true,
      switchValue4: true, */
      /* 产能方案是否维护中 */
      /* isdisabled1: false,
      isdisabled2: false,
      isdisabled3: false,
      isdisabled4: true, */
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
      row: {},
      SelectSampleQuery: [
        { type: 'static', code: 'status', value: 1 }
      ],
    };
  },

  methods: {
    /* 上一步 */
    previous () {
      this.active--;
    },
    /* 下一步 */
    next () {
      if (this.active++ > 2) this.active = 0;
      /* 转换时间格式 */
      let d = new Date(this.form.time);
      let datetime =
        d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " ";
      this.form.time = datetime;
      console.log(this.form.theway);
    },
    /* 确认 */
    confirm () { },
    /* 继续预约 */
    continueApp () {
      this.active = 0;
    },
    /* 检测项目回调 */
    Detect (row) {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.DetectItem.refresh();
      });
      this.row = row;
      this.SelectDetectItem = row.xxx ? row.xxx : [];
    },
    /* 检测项目勾选回调 */
    DetectItemChange (rows) {
      this.SelectDetectItem = rows;
    },
    /* 检测项目保存 */
    DetectItemSave () {
      this.row["xxx"] = this.SelectDetectItem;
      this.dialogVisible = false;
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
    },
    /* 添加样品保存 */
    addSampleSave () {
      this.gridData.push(this.addSampleForm);
      this.addSampleDialog = false;
    },
    /* 选中当前表格数据 */
    handleSelectionChange (row) {
      console.log(row);
      this.deleteData = row;
    },
    /* 删除 */
    delete () {
      let arr1 = this.deleteData;
      let arr2 = this.gridData;
      var resArr = arr2.filter((item) => !arr1.includes(item));
      this.gridData = resArr;
    },
    /* 产能方案保存 */
    ProduceSave () { },
    /* 选择样品勾选回调 */
    selectionChange (row) {
      this.snapGridData = row;
    },
    /* 选择样品保存 */
    SelectSampleSave () {
      this.snapGridData.forEach((row) => {
        this.gridData.push(row);
      });
      this.SelectSampleDialog = false;
    },
    /* 检测项取消 */
    closeDialog () {
      this.dialogVisible = false;
    },
    /* 产能方案关闭弹窗 */
    /* ProduceCloseDialog() {
      this.ProduceDialog = false;
    }, */
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
    /* 产能方案弹窗关闭 */
    /*  ProduceCloseItem() {
      this.ProduceDialog = false;
    }, */
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
    /* 产能方案弹窗 */
    /* SelectEquipment() {
      this.ProduceDialog = true;
    }, */
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
</style>
