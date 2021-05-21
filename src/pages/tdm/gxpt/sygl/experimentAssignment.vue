<template>
  <div class="container">
    <ice-query-grid title="实验作业管理"
                    data-url="tdm/experiment/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="grid"
                    :operationsWidth="300"
                    chooseItem="multiple"
                    :gridIndex="true"
                    :buttons="buttons"
                    :query="query"
                    @selection-change="handleSelectionChange"></ice-query-grid>
    <!-- 查看详情 -->
    <ice-dialog v-dialogDrag
                title="实验作业详情"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">实验作业详情</div>
      <div class="headers">
        <h2>
          <div><span>实验作业编号:</span> <span>{{DetailsData.operationNumber}}</span></div>
          <div v-if="false">
            <el-button type="primary"
                       icon="el-icon-video-play">开工</el-button>
            <el-button type="primary"
                       icon="el-icon-switch-button">完工</el-button>
            <el-button type="primary"
                       icon="el-icon-s-tools">修改</el-button>
          </div>
        </h2>
        <ul>
          <li>
            预约编号：<span>{{ DetailsData.reservationNumber }}</span>
          </li>
          <li>
            预约日期：<span>{{ DetailsData.createTime }}</span>
          </li>
          <li>
            样品编号：<span>{{ DetailsData.sampleNumber }}</span>
          </li>
          <li>
            样品名称：<span>{{ DetailsData.sampleName }}</span>
          </li>
          <li>
            检测项目：<span>{{ DetailsData.projectName }}</span>
          </li>
          <li>
            实验室编号：<span>{{ DetailsData.laboratoryName }}</span>
          </li>
          <li>
            作业人员：<span>{{ DetailsData.peopleName }}</span>
          </li>
          <li>
            检测设备：<span>{{ DetailsData.equipmentName }}</span>
          </li>
          <li>
            实验状态：<span>{{
              DetailsData.status == 1
                ? "待试验"
                : DetailsData.status == 2
                ? "实验中"
                : DetailsData.status == 3
                ? "已完成"
                : ""
            }}</span>
          </li>
        </ul>
      </div>
    </ice-dialog>
    <!-- 开工,完工 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisibleEnd"
                :close-on-click-modal="false"
                :before-close="closeItemEnd"
                append-to-body
                width="800px">
      <el-form :model="detailDataForm"
               :rules="detailRules"
               label-position="right"
               class="conditon-bar"
               ref="detailForm">
        <ice-grid-layout :name="title"
                         :columns="1"
                         gutter="0px"
                         :expandable="false">
          <el-row :gutter="40">
            <el-col :span="12">
              <!-- <el-form-item label="样品上机量:"
                            label-width="130px"
                            prop="sampleNum">
                <el-input-number v-model="detailDataForm.sampleNum"
                                 :min="0"
                                 :disabled="parameterverif('sampleNum')"
                                 label="请输入实验剩余数量"
                                 :precision="1"
                                 :step="0.1"></el-input-number>
              </el-form-item> -->
              <el-form-item label="环境温度:"
                            label-width="130px"
                            prop="temperature">
                <el-input v-model="detailDataForm.temperature"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <!-- <el-form-item label="样品下机量:"
                            label-width="130px"
                            prop="remainingSampleNum">
                <el-input-number v-model="detailDataForm.remainingSampleNum"
                                 :min="0"
                                 :disabled="parameterverif('remainingSampleNum')"
                                 label="请输入实验剩余数量"
                                 :precision="1"
                                 :step="0.1"></el-input-number>
              </el-form-item> -->
              <el-form-item label="环境湿度:"
                            label-width="130px"
                            prop="humidity">
                <el-input v-model="detailDataForm.humidity"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实验依据:"
                            label-width="130px"
                            prop="experimentalBasis">
                <el-select v-model="detailDataForm.experimentalBasis"
                           clearable
                           placeholder="请选择">
                  <el-option v-for="item in optionsBasis"
                             :key="item.oid"
                             :label="item.basisName"
                             :value="item.oid">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </ice-grid-layout>
      </el-form>
      <div class="dialog-footer ice-button-bar">
        <el-button type="primary"
                   @click="saveEnd">确定</el-button>
        <el-button type="info"
                   @click="closeItemEnd">取 消</el-button>
      </div>
    </ice-dialog>
    <!--设备复核-->
    <ice-dialog v-dialogDrag
                title="设备复核"
                center
                :visible.sync="dialogReviewVisible"
                :before-close="closeReview"
                append-to-body
                width="800px">
      <el-form :model="equipmentReview"
               label-position="right"
               class="conditon-bar"
               ref="detailReview">
        <ice-grid-layout name="设备复核"
                         :columns="1"
                         gutter="0px"
                         :expandable="false">
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form-item label="设备状态："
                            label-width="130px"
                            prop="status">
                <el-select v-model="equipmentReview.status"
                           placeholder="请选择">
                  <el-option v-for="item in reviewOptions"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="40">
            <el-col :span="24">
              <el-form-item label="备注："
                            label-width="130px"
                            prop="remarks">
                <el-input type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          placeholder="请输入内容"
                          v-model="equipmentReview.remarks">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </ice-grid-layout>
      </el-form>
      <div class="dialog-footer ice-button-bar">
        <el-button type="primary"
                   @click="saveReview">确定</el-button>
        <el-button type="info"
                   @click="closeReview">取 消</el-button>
      </div>
    </ice-dialog>
    <!-- 查看工艺文件 -->
    <ice-dialog title="查看工艺文件/操作规程"
                :visible.sync="dialogGetCraftVisible"
                width="500">

      <div class="titleName">查看操作手册</div>
      <div class="specification" style="height: 80px">
        <ice-query-grid title="操作规程"
                        :pagination="false"
                        :gridData="specificationData"
                        :columns="getCraftColumns"
                        :minHeight="70"
                        ref="getCraft"
                        :gridIndex="false"
                        :operationsWidth="200"
                        :operations="getCraftOperations"
                        chooseItem="single"></ice-query-grid>
      </div>
      <div class="titleName">查看工艺文件</div>
      <ice-query-grid title="检测工艺"
                      :gridData="craftData"
                      :columns="getCraftColumns"
                      ref="getCraft"
                      :gridIndex="false"
                      :operationsWidth="200"
                      :operations="getCraftOperations"
                      chooseItem="single"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="info"
                   size="medium"
                   @click="closeGetCraftDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 实验数据匹配 -->
    <ice-dialog title="实验数据匹配"
                v-dialogDrag
                center
                :visible.sync="DataMatching"
                :before-close="closeDataMatching"
                append-to-body
                width="800px">
      <div class="titleName">实验数据匹配</div>
      <el-row>
        <!-- 上传组件 -->
        <el-row :gutter="24"
                style="margin-bottom:15px">
          <el-col :span="24">
            <!--            <ice-single-upload v-model="FileUpload"-->
            <!--                               :on-success="experimentStandardSuccess"-->
            <!--                               :do-secret="true"-->
            <!--                               ref="fileUploadRef">-->
            <!--            </ice-single-upload>-->
          </el-col>
          <el-col :span="12">
            <span>设备编号：{{equipmentNumber}}</span>
          </el-col>
          <el-col :span="12">
            <span>设备IP：{{equipmentIp}}</span>
          </el-col>
        </el-row>
        <!-- 表格 -->
        <el-row :gutter="24">
          <el-col :span="24">
            <ice-query-grid title="匹配"
                            data-url="tdm/experiment/ipToData"
                            :columns="DataMatchingColumns"
                            ref="DataMatchingRef"
                            :selectedCodes="dataMatchingSelectedCodes"
                            codeProp="id"
                            :beforeBindData="beforeBindData"
                            :pagination="false"
                            :gridIndex="false"
                            :query='DataMatchingQuery'
                            chooseItem="multiple"
                            @selection-change="handleDataMatching"></ice-query-grid>
          </el-col>
        </el-row>
      </el-row>
      <div class="ice-button-bar"
           slot="footer">

        <el-button type="primary"
                   size="medium"
                   @click="DataMatchingSave">确认</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDataMatching">取消</el-button>
      </div>
    </ice-dialog>
    <!--填写结果-->
    <ice-dialog v-dialogDrag
                title="填写结果"
                center
                :visible.sync="resultDialog"
                :before-close="closeResult"
                append-to-body
                width="800px">
      <el-form :model="resultForm"
               label-position="right"
               class="conditon-bar"
               ref="resultRef"
               :rules="resultRules">
        <ice-grid-layout name="填写结果"
                         :columns="1"
                         :expandable="false">
          <el-form-item label="是否合格:"
                        label-width="130px"
                        prop="isPass"
                        v-show="experimentStatus">
            <template>
              <el-radio v-model="resultForm.isPass"
                        label="2">合格</el-radio>
              <el-radio v-model="resultForm.isPass"
                        label="1">不合格</el-radio>
            </template>
          </el-form-item>
          <el-form-item label="填写结果"
                        label-width="130px"
                        prop="experimentalResults">
            <el-input v-model="resultForm.experimentalResults"
                      :rows="3"
                      type="textarea"></el-input>
          </el-form-item>
        </ice-grid-layout>
      </el-form>
      <div class="dialog-footer ice-button-bar">
        <el-button type="primary"
                   @click="saveResult">确定</el-button>
        <el-button type="info"
                   @click="closeResult">取 消</el-button>
      </div>
    </ice-dialog>
    <!--填写委外单位-->
    <ice-dialog v-dialogDrag
                title="委外"
                center
                :visible.sync="entrustDialog"
                :before-close="closeEntrust"
                append-to-body
                width="600px">
      <el-form :model="entrustForm"
               label-position="right"
               class="conditon-bar"
               ref="entrustRef"
               :rules="entrustRules">
        <ice-grid-layout name="委外单位"
                         :columns="1"
                         :expandable="false">
          <el-form-item label="委外单位"
                        label-width="130px"
                        prop="entrustEnterprise">
            <el-input v-model="entrustForm.entrustEnterprise"></el-input>
          </el-form-item>
        </ice-grid-layout>
      </el-form>
      <div class="dialog-footer ice-button-bar">
        <el-button type="primary"
                   @click="saveEntrust">确定</el-button>
        <el-button type="info"
                   @click="closeEntrust">取 消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import IceSingleUpload from "@/components/common/base/IceSingleUpload";
import Vue from "vue";
import { map, slice } from 'xe-utils/methods';
export default {
  name: "experimentAssignment",
  components: { IceQueryGrid, IceDialog, IceGridLayout, IceSingleUpload },
  data () {
    return {
      // 委外
      entrustDialog: false,
      entrustForm: {
        operationIds: [],
        entrustEnterprise: "",
      },
      entrustRules: {
        entrustEnterprise: [
          { required: true, message: "请输入委外单位", trigger: "blur", },
        ],
      },

      /*设备复核状态集合*/
      reviewOptions: [
        {
          value: '1',
          label: '设备正常'
        },
        {
          value: '2',
          label: '设备异常'
        }
      ],

      query: [
        {
          type: "input",
          label: "检测项目/实验室编号/设备名称/样品名称",
          code: "searchTerm",
          value: "",
        },
      ],
      /* 样品登记表格数据 */
      columns: [
        { code: "id", hidden: true },
        {
          label: "实验作业编号",
          code: "operationNumber",
          align: "center",
        },
        // {
        //   label: "预约编号",
        //   code: "reservationNumber",
        //   align: "center",
        // },
        // {
        //   label: "预约日期",
        //   code: "createTime",
        //
        //   sortable: true,
        //   align: "center",
        // },
        {
          label: "期望完成时间",
          code: "sendSampleTime",
          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          align: "center",
        },

        {
          label: "样品名称",
          code: "sampleName",
          align: "center",
        },
        {
          label: "检测项目",
          code: "projectName",
          align: "center",
        },
        {
          label: "预约类型",
          code: "reservationType",
          align: "center",
          width: 70,
          formatter: (data) => {
            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
            let obj = {
              color: '#fff',
              background: color[data.reservationType],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.reservationType == 1 ? '自主' : data.reservationType == 2 ? "委托" : "生产"}</span>
          }
        },
        {
          label: "检验设备",
          code: "equipmentName",
          align: "center",
        },
        {
          label: "作业人员",
          code: "peopleName",
          align: "center",
        },
        // {
        //   label: "委外单位",
        //   code: "entrustEnterprise",
        //   align: "center",
        // },
        // {
        //   label: "实验室编号",
        //   code: "laboratoryName",
        //   align: "center",
        // },
        {
          label: "状态",
          code: "status",
          align: "center",
          //   fixed: "right",
          formatter (row) {
            return row.statusDesc;
          },
        },
        {
          label: "备注",
          code: "remarks",
          align: "center",
        },
        {
          label: "结果",
          code: "experimentalResults",
          align: "center",
        },
      ],
      operations: [
        { name: "查看详情", callback: this.SeeDetails},
        {
          name: "工艺文件/操作规程",
          callback: this.viewCraft,
          isShow: (row) => {
            return row.experimentCraft != null;
          },
        },
        {
          name: "实验数据匹配", callback: this.UploadData,
          isShow: (row) => {
            return row.status == 2;
          },
          styles:'color:#F56C6C'
        },
        // {
        //   name: "下载操作规范", callback: this.specification,
        //   isShow: (row) => {
        //     return row.status <= 2;
        //   },
        // },
        {
          name: "填写结果",
          callback: this.result,
          isShow: (row) => {
            return  row.status == 2;
          },
          styles:'color:#F56C6C',
        }
      ],
      buttons: [
        {
          name: "开工",
          icon: "el-icon-video-play",
          type: "primary",
          callback: this.start,
        },
        {
          name: "完工",
          icon: "el-icon-switch-button",
          type: "primary",
          callback: this.end,
        },
        // {
        //   name: "委外",
        //   icon: "el-icon-connection",
        //   callback: this.entrust,
        //   isShow: (row) => {
        //      return false;
        //   },
        // },
      ],
      dialogVisible: false,
      dialogVisibleEnd: false,
      resultDialog: false,
      /* 详情数据 */
      DetailsData: {},
      operation: [],
      /* 开工,完工表单 */
      detailDataForm: {
        /*  sampleNum: "",
         remainingSampleNum: "", */
        operationId: "",
        operationIds: "",
        humidity: "",
        experimentalBasis: "",
        temperature: ""
      },
      /* 开工-完工表单验证 */
      detailRules: {
        /* sampleNum: [
          {
            type: "number", required: true, whitespace: true, message: "请输入样品数量", trigger: "blur", repeatable: false,
          },
        ],
        remainingSampleNum: [
          {
            type: "number", required: true, whitespace: true, message: "请输入样品数量", trigger: "blur", repeatable: false,
          },
        ], */
        humidity: [
          {
            required: true, whitespace: true, message: "请输入环境湿度", trigger: "blur",
          },
        ],
        experimentalBasis: [
          {
            required: true, whitespace: true, message: "请输入实验依据", trigger: "change",
          },
        ],
        temperature: [
          {
            required: true, whitespace: true, message: "请输入环境温度", trigger: "blur",
          },
        ],
      },
      title: "",
      NumberName: "",
      /*工艺文件*/
      craftData: [],
      getCraftColumns: [
        {
          label: "文件名称",
          code: "fileName",
          align: "center",
        },
        {
          label: "上传用户",
          code: "userCode",
          align: "center",
        },
      ],
      getCraftOperations: [
        {
          name: "下载",
          callback: this.downloadCraft
        },
      ],
      // 操作规范
      specificationData:[],

      dialogGetCraftVisible: false,
      /*设备复核*/
      equipmentReview: {
        status: "",
        remarks: "",
      },
      dialogReviewVisible: false,
      /* 数据匹配 */
      DataMatching: false,
      DataMatchingQuery: [
        {
          type: "static", code: "equipmentIp", value: () => {
            return this.equipmentIp
          }
        },
        {
          type: "static", code: "operationId", value: () => {
            return this.Id
          }
        }
      ],
      // 匹配回显选中值数组
      dataMatchingSelectedCodes:[],
      /* 匹配数据表格 */
      DataMatchingColumns: [
        { label: "id", code: "id", hidden: true },
        {
          label: "文件名称",
          code: "fileName",
          align: "center",
        },
        // {
        //   label: "设备编号",
        //   code: "equipmentNumber",
        //   width: 100,
        //   align: "center",
        // },
        // {
        //   label: "设备IP",
        //   code: "hostComputerIp",
        //   width: 100,
        //   align: "center",
        // },
        {
          label: "文件格式",
          code: "fileFormat",
          align: "center",
        },
        {
          label: "文件路径",
          code: "hostComputerPath",
          align: "center",
        },
      ],
      /* 上传 */
      FileUpload: '',
      /* 设备IP */
      equipmentIp: '',
      // 设备编号
      equipmentNumber:'',
      /* 数据匹配保存参数 */
      DataMatchingParams: {

      },
      /* 元数据ID集合 */
      dataIds: [],
      resultOptions: [
        {
          value: '2',
          label: '合格'
        },
        {
          value: '1',
          label: '不合格'
        }
      ],
      /* 填写结果Form */
      resultForm: {
        experimentalResults: '',
        isPass: ''
      },
      /* 填写结果表单验证 */
      resultRules: {
        isPass: [
          { required: true, message: "请选择是否合格", trigger: "change", },
        ],
        experimentalResults: [
          { required: true, message: "填写结果", trigger: "blur", },
        ],
      },
      experimentStatus: false,
      Id: '',
      /* 开工实验依据 */
      optionsBasis: [],
    };
  },
  methods: {

    //实验数据匹配 列表 绑定数据前方法
    beforeBindData(data){
        if(data.dataIds && data.dataIds.length>0){
          this.dataMatchingSelectedCodes = data.dataIds;
        }else{
          this.dataMatchingSelectedCodes = [];
        }
        console.log("dataMatchingSelectedCodes",this.dataMatchingSelectedCodes);
        return data.fileDatas;
    },

    //打开委外弹窗
    entrust () {
      let isTrue = true;
      if (!this.operation || this.operation.length == 0) {
        this.$message.warning("请选择作业！");
        return;
      }
      this.operation.forEach((item) => {
        if (item.status > 1) {
          isTrue = false;
          return;
        }
      })
      if (isTrue) {
        this.entrustForm = {};
        this.entrustDialog = true;
      } else {
        this.$message.warning("请选择未开工作业");
      }
    },
    //保存委外单位
    saveEntrust () {
      let ops = [];
      this.operation.forEach((item) => {
        ops.push(item.id);
      })
      this.entrustForm.operationIds = ops;
      this.$refs.entrustRef.validate(vali => {
        if (vali) {
          this.$axios
            .post("tdm/experiment/outSource", this.entrustForm)
            .then((res) => {
              if (res.status == 200) {
                this.$refs.grid.refresh();
                this.$message.success("操作成功");
                this.closeEntrust();
              }
            })
            .catch((error) => {
              this.$message.error(error.msg);
            });
        }
      })
    },
    // 关闭委外弹窗
    closeEntrust () {
      this.entrustDialog = false;
    },

    downloadCraft (row) {
      this.downloadFile(row.oid);
    },
    /*下载文件*/
    downloadFile (fileId) {
      if (!fileId) {
        this.$message.error("未找到文件！");
        return;
      }
      window.open(
        Vue.prototype.$apicontext +
        "resources/attachment/downloadById?id=" +
        fileId,
        "_blank"
      );
    },
    /*   parameterverif (des) {
        if (this.title === "开工") {
          return des === 'remainingSampleNum';
        } else {
          return des === 'sampleNum';
        }
      }, */
    /*设备复核保存*/
    saveReview () {
      this.$axios
        .post("tdm/experiment/equipmentClockIn", this.equipmentReview)
        .then((res) => {
          if (res.status == 200) {
            this.$refs.grid.refresh();
            this.$message.success("操作成功");
            this.closeReview();
          }
        })
        .catch((error) => {
          this.$message.error(error.msg);
        });
    },
    /*关闭设备复核*/
    closeReview () {
      this.equipmentReview = {};
      this.dialogReviewVisible = false;
    },
    /*设备复合窗口*/
    showEquipmentReview (row) {
      console.log(row);
      this.equipmentReview.operationId = row.id;
      this.dialogReviewVisible = true;
    },
    //关闭查看弹框
    closeGetCraftDialog () {
      this.dialogGetCraftVisible = false;
    },
    //查看文件
    viewCraft (row) {
      console.log("row", row);
      this.$axios.get("/tdm/craft/getOneCraft", { params: { id: row.experimentCraft } })
        .then((success) => {
          if (success.status == 200) {
            let fileIds = success.data.fileId;
            let ids = "";
            for (let i in fileIds) {
              ids += fileIds[i];
              ids += ',';
            }
             this.$axios.get("/resources/attachment/get", { params: { ids: ids } })
              .then((success) => {
                this.craftData = success.data;
                this.dialogGetCraftVisible = true;
              })

             this.$axios.get("/resources/attachment/get", { params: { ids: row.operatingSpecifications } })
                    .then((success) => {
                      this.specificationData = success.data;
             })
          }
        })
    },
    /* 查看详情 */
    SeeDetails (row) {
      this.DetailsData = row;
      this.dialogVisible = true;
    },
    /* 实验数据匹配 */
    UploadData (row) {
      console.log("实验数据匹配row",row);
      this.equipmentIp = row.equipmentIp;
      this.equipmentNumber = row.equipmentNumber;
      this.Id = row.id
      this.DataMatching = true
      this.DataMatchingParams = {}
      this.$nextTick(() => {
        this.$refs.DataMatchingRef.refresh()
      })
    },
    /* 实验工艺 */
    crafts (row) {
      this.downloadFile(row.experimentStandard);
    },
    /*下载文件*/
    downloadFile (fileId) {
      if (!fileId) {
        this.$message.error("未找到文件！");
        return;
      }
      window.open(
        Vue.prototype.$apicontext +
        "resources/attachment/downloadById?id=" +
        fileId,
        "_blank"
      );
    },
    /* 操作规范 */
    specification (row) {
      this.$confirm('确定下载操作规范吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        this.downloadFile(row.operatingSpecifications);
      });
    },
    /* 开工选中 */
    handleSelectionChange (row) {
      let rows = row;
      this.operation = rows;
    },
    /* 开工 */
    start () {
      if (this.$refs.detailForm) {
        this.$refs.detailForm.resetFields()
      }
      if (this.operation.length != 0) {
        this.detailDataForm.operationIds = [];
        this.getExperimentalBasis();
        this.dialogVisibleEnd = true;
        this.title = "开工";
        this.NumberName = "样品总量";
        this.operation.forEach(item => {
          this.detailDataForm.operationIds.push(item.id)
        })
      } else {
        this.$message.warning('请选择开工项!')
      }
    },
    /* 获取实验依据下拉数据 */
    getExperimentalBasis () {
      this.$axios.get('tdm/ExperimentalBasis/list', {
        params: {
          paginaTion: 1,
          size: 20,
          current: 1
        }
      }).then(res => {
        /* console.log(res.data.records); */
        this.optionsBasis = res.data.records;
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 完工 */
    end () {
      if (this.operation.length == 0) {
        this.$message.warning("请选择完工项");
      }
      this.operation.forEach(item => {
        this.detailDataForm.operationIds = new Array();
        this.detailDataForm.operationIds.push(item.id)
      })
      this.$confirm("确定完工操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.title = "完工";
        this.saveEnd();
      });
      // else {
      //   this.getExperimentalBasis();
      //   this.dialogVisibleEnd = true;
      //   this.title = "完工";
      //   this.detailDataForm.operationIds = [];
      //   this.NumberName = "余样";
      //   this.operation.forEach(item => {
      //     this.detailDataForm.operationIds.push(item.id)
      //   })
      // }
    },
    /* 开工,完工确认 */
    saveEnd () {

      if (this.title === "完工") {
        this.$axios
                .post("tdm/experiment/end", this.detailDataForm)
                .then((res) => {
                  this.$message.success("已完工");
                  this.$refs.grid.refresh();
                  this.dialogVisibleEnd = false;
                })
                .catch((error) => {
                  this.$message.error(error.msg);
                });
      } else if (this.title === "开工") {
        /* if (!this.detailDataForm.sampleNum || this.detailDataForm.sampleNum <= 0) {
          this.$message.error("请填写上机数量");
          return;
        } */
        this.$refs.detailForm.validate(vali => {
          if (vali) {
             this.$axios
                    .post("tdm/experiment/start", this.detailDataForm)
                    .then((res) => {
                      this.$message.success("已开工");
                      this.$refs.grid.refresh();
                      this.dialogVisibleEnd = false;
                    })
                    .catch((err) => {
                      this.$message.error(err.msg)
                    });
          }
        });

      }


    },
    closeItemEnd () {
      this.dialogVisibleEnd = false;
    },
    closeItem () {
      this.dialogVisible = false;
    },
    init () {
      this.$refs.grid.refresh();
    },
    /* 关闭数据匹配 */
    closeDataMatching () {
      this.DataMatching = false
    },
    /* 上传成功回调 */
    experimentStandardSuccess (row, data) {
      /*  console.log(data); */
      this.DataMatchingParams.fileName = data.name;
      this.DataMatchingParams.fileSize = data.size;
      this.DataMatchingParams.fileFormat = data.name.substr(-3, 3);
      this.DataMatchingParams.hostComputerPath = '';
      this.DataMatchingParams.hostComputerIp = this.equipmentIp;
      this.DataMatchingParams.fileId = data.response.data;
      this.DataMatchingParams.md5 = '';
      console.log(this.DataMatchingParams);
      this.$axios.post('tdm/TdmExperimentMetadata/saveOrUpdateMetadata', this.DataMatchingParams).then(res => {
        console.log(res);
        this.$refs.DataMatchingRef.refresh()
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 数据匹配确认 */
    DataMatchingSave () {
      if(!this.dataIds || this.dataIds.length==0){
        this.$message.warning("请选择实验元数据");
         return
      }
      this.$axios.post('tdm/experiment/operationBinding', {
        operationId: this.Id,
        dataIds: this.dataIds
      }).then(res => {
        console.log(res);
        this.$message.success('匹配成功!')
        this.dataIds = [];
        this.$refs.grid.refresh();
        this.DataMatching = false
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 数据匹配表格选中 */
    handleDataMatching (row) {
      console.log(row);
      let rows = row
      let dataIDs = []
      rows.forEach(item => {
        dataIDs.push(item.id)
      });
      this.dataIds = dataIDs
      console.log(this.dataIds);
    },
    /* 填写结果 */
    result (row) {
      this.resultForm.oid = row.id
      if(row.experimentalResults){
        this.resultForm.experimentalResults = row.experimentalResults;
      }else{
        this.resultForm.experimentalResults = "";
      }
      this.resultDialog = true
      if (row.experimentType == 2) {
        this.experimentStatus = true
      }
    },
    closeResult () {
      this.resultDialog = false
    },
    saveResult () {
      console.log(this.resultForm);
      this.$axios.post('tdm/sample/experimentalResults', this.resultForm).then(res => {
        this.$message.success('保存成功！');
        this.resultForm = {};
        this.resultDialog = false;
        this.$refs.grid.refresh();
        console.log(res);
      }).catch(err => {
        this.$message.error(err.msg)
        this.resultForm = {}
      })
    }
  },
  mounted () {
    this.init();
  },
  computed: {
  }
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.headers {
  h2 {
    span {
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    margin-top: 10px;
    margin-bottom: 20px;
    box-sizing: border-box;
  }
  ul {
    display: flex;
    flex-wrap: wrap;
    padding: 0 40px;
    box-sizing: border-box;
    li {
      width: 50%;
      margin-bottom: 20px;
    }
  }
}
.titleName {
  position: relative;
  padding: 0 25px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: 15px;
  font-weight: 500;
  &::before {
    content: '';
    display: block;
    width: 5px;
    height: 25px;
    background-color: #0091b0;
    position: absolute;
    top: -2px;
    left: 8px;
  }
}
</style>
