<template>
  <div class="container"
       v-loading="loading">
    <ice-flow-form name
                   valiate
                   ref="flowForm"
                   :flowReady="flowReady"
                   :flowOperateBtn="flowOperateBtn"
                   :flowBizData="flowBizData"
                   :btn-extend1="alterationAssign">
      <div class="fanhui">
        <el-button icon="el-icon-back"
                   type="primary"
                   circle
                   @click="goback"></el-button>
      </div>
      <div class="titleName">实验报告添加</div>
      <el-form ref="form"
               :model="form"
               label-width="150px"
               :rules="rules">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="实验预约编号:"
                          prop="numbering">
              <el-input v-model="form.numbering"
                        :disabled="!isHandleer"
                        placeholder="请选择"
                        readonly>
                <el-button slot="append"
                           class="el-icon-edit-outline"
                           @click="AddReportNumber">
                </el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="实验报告名称:"
                          prop="reportName">
              <el-input v-model="form.reportName"
                        :disabled="!isHandleer"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="预约类型:">
              <el-tag :type="form.reservationType==1?'info':form.reservationType==2?'info':'danger'"
                      v-show="form.reservationType">{{form.reservationType==1?'自主':form.reservationType==2?"委托":"生产"}}</el-tag>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="委托单位:"
                          prop="entrustUnit">
              <el-input v-model="form.entrustUnit"
                        placeholder="请输入内容"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="送样人:"
                          prop="receiveSamplesPeopleName">
              <el-input v-model="form.receiveSamplesPeopleName"
                        placeholder="请输入内容"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="联系方式:"
                          prop="phone">
              <el-input v-model="form.phone"
                        placeholder="请输入内容"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <ice-query-grid title="实验报告添加"
                      :gridData="gridData"
                      :pagination="false"
                      :columns="columns"
                      :operations="operations"
                      ref="grid"
                      :chooseItem="this.isHandleer?'multiple':'single'"
                      :query="this.isHandleer?reportDetailsQuery:[]"
                      :gridIndex="true"
                      :buttons="this.isHandleer?buttons:[]"
                      style="height:600px"
                      @selection-change="handleSelectionChange"></ice-query-grid>
      <!-- 新增 -->
      <ice-dialog v-dialogDrag
                  title="实验报告添加"
                  center
                  :visible.sync="dialogVisible"
                  :close-on-click-modal="false"
                  :before-close="closeItem"
                  append-to-body
                  width="800px">
        <ice-query-grid title="实验报告添加"
                        data-url="tdm/TdmExperimentalReport/getInfoByAppoId"
                        :pagination="false"
                        :columns="columnsAdd"
                        :gridIndex="false"
                        ref="addItemGrid"
                        :query="addItemQuery"
                        chooseItem="multiple"
                        @selection-change="selecAddItem"
                        :selectedCodes="selectedCodes"
                        codeProp="operationId"></ice-query-grid>
        <div class="ice-button-bar">
          <el-button type="primary"
                     size="medium"
                     @click="confirm">确认</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="closeItem">取消</el-button>
        </div>
      </ice-dialog>
      <!-- 实验预约编号 -->
      <ice-dialog v-dialogDrag
                  title="实验预约编号查询"
                  center
                  :visible.sync="reportNumberDialog"
                  :close-on-click-modal="false"
                  :before-close="closeReportNumber"
                  append-to-body
                  width="800px">
        <ice-query-grid title="实验预约编号查询"
                        data-url="tdm/TdmExperimentalReport/filterOrderNumber"
                        :pagination="false"
                        :columns="columnsReportNumber"
                        :gridIndex="false"
                        ref="ReportNumberGrid"
                        :query="ReportNumberQuery"
                        chooseItem="single"
                        @selection-change="selecReportNumber"></ice-query-grid>
        <div class="ice-button-bar">
          <el-button type="primary"
                     size="medium"
                     @click="ReportNumberSave">确认</el-button>
          <el-button type="primary"
                     size="medium"
                     @click="closeReportNumber">取消</el-button>
        </div>
      </ice-dialog>

<!--      查看元数据-->
      <ice-dialog title="实验数据"
                  :visible.sync="dialogGetCraftVisible"
                  width="500">
        <div class="titleName">实验数据</div>
        <ice-query-grid title="实验数据"
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
    </ice-flow-form>
  </div>
</template>

<script>
import IceFlowForm from '@/components/common/base/IceFlowForm.vue'
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import Vue from "vue";
export default {
  components: { IceQueryGrid, IceDialog, IceFlowForm },
  data () {
    return {
      // 查看实验数据
      craftData: [],
      getCraftColumns: [
        {
          label: "文件名称",
          code: "fileName",
          align: "center",
        },
      ],
      getCraftOperations: [
        {
          name: "下载",
          callback: this.downloadCraft
        },
      ],
      dialogGetCraftVisible: false,

      /* 主表格查询 */
      reportDetailsQuery: [
        {
          type: "input",
          label: "样品名称",
          code: "sampleName",
          value: "",
        },
        {
          type: "input",
          label: "样品编号",
          code: "sampleId",
          value: "",
        },
        {
          type: "input",
          label: "样品批号",
          code: "sampleNumber",
          value: "",
        },
        { type: "static", label: "", code: "", value: '' },
      ],
      /* 新增表格查询 */
      addItemQuery: [
        /*  {
           type: "input",
           label: "样品名称",
           code: "searchTerm",
           value: "",
         }, */
        {
          type: "static", label: "", code: "appoId", value: () => {
            return this.appoId
          }
        },
      ],
      /* 预约编号查询 */
      ReportNumberQuery: [
        {
          type: "input",
          label: "预约编号(不支持模糊查询)",
          code: "searchText",
          value: "",
        },
      ],
      /* form表单数据 */
      form: {
        numbering: "",
        reportName: "",
        entrustUnit: "",
        receiveSamplesPeopleName: "",
        phone: "",
        ExperimentType: "",
      },
      gridData: [],
      SnapGridData: [],
      /* 主表格 */
      columns: [
        {
          label: "样品名称",
          code: "sampleName",

          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",

          align: "center",
        },
        {
          label: "样品条码",
          code: "barCode",

          align: "center",
        },
        {
          label: "检测项目",
          code: "projectName",

          align: "center",
        },
        {
          label: "检测结果",
          code: "experimentalResults",

          align: "center",
        },
        {
          label: "合格判定",
          code: "isPass",

          align: "center",
          formatter (row) {
            if (row.isPass == 2) {
              return '合格'
            } else if (row.isPass == 1) {
              return '不合格'
            } else {
              return '未定义'
            }
          },
        },
      ],
      operations:[
        { name: "查看实验数据", callback: this.viewMetadata },
      ],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem
        },
        {
          name: "删除",
          icon: "el-icon-minus",
          type: "danger",
          callback: this.deleteItem
        },
        // {
        //   name: "保存并提交",
        //   icon: "el-icon-check",
        //   type: "success",
        //   callback: this.save,
        // },
      ],
      dialogVisible: false,
      /* 新增表格 */
      columnsAdd: [
        {
          label: "样品名称",
          code: "sampleName",

          align: "center",
        },
        {
          label: "样品编号",
          code: "sampleNumber",

          align: "center",
        },
        {
          label: "样品条码",
          code: "barCode",

          align: "center",
        },
        {
          label: "检测项目",
          code: "projectName",

          align: "center",
        },
        {
          label: "检测结果",
          code: "experimentalResults",
          width: 80,
          align: "center",
        },
        {
          label: "合格判定",
          code: "isPass",
          width: 70,
          align: "center",
          formatter (row) {
            if (row.isPass == 2) {
              return '合格'
            } else if (row.isPass == 1) {
              return '不合格'
            } else {
              return '未定义'
            }

          },
        },
      ],
      /* 表单验证规则 */
      rules: {
        // numbering: [
        //   { required: true, message: "请输入实验报告编号", trigger: "change" },
        // ],
        reportName: [{ required: true, message: "请输入报告名称", trigger: "blur" }],
        entrustUnit: [{ required: true, message: "请输入送样单位", trigger: "blur" }],
        receiveSamplesPeopleName: [
          { required: true, message: "请输入送样人", trigger: "blur" },
        ],
        phone: [
          { required: true, message: "请输入联系方式", trigger: "blur" },
        ],
      },
      /* 实验报告编号 */
      reportNumberDialog: false,
      columnsReportNumber: [
        { code: "appointmentId", hidden: true },
        {
          label: "预约编号",
          code: "appointmentNumber",
          align: "center",
        },
        {
          label: "实验名称",
          code: "appointmentName",
          align: "center",
        },
        {
          label: "委托单位",
          code: "entrustUnit",
          align: "center",
        },
        {
          label: "预约类型",
          code: "reservationType",
          align: "center",
          renderCell (h, data) {
            console.log(data.row.reservationType);
            if (data.row.reservationType == 1) {
              return '自主'
            } else if (data.row.reservationType == 2) {
              return '委托'
            } else {
              return '生产'
            }
          }
        },

      ],
      /* 报告编号临时变量 */
      SnapValue: '',
      /* 新增表格ID */
      appoId: '',
      /* 要删除的数据 */
      deleteData: [],
      loading: false,
      /* 
      权限
      */
      activeName: 'first',
      attaTableData: [],
      isHandleer: true,
      bizdata: { xmname: '', dataSecretLevcode: '2' },
    }
  },
  methods: {
    //下载
    downloadCraft (row) {
      this.downloadById(row.oid);
    },
    downloadById (oid) {
      window.open(Vue.prototype.$apicontext + "resources/attachment/downloadById?id=" + oid, '_blank')
    },

    //关闭查看弹框
    closeGetCraftDialog () {
      this.dialogGetCraftVisible = false;
    },
    //打开弹出
    viewMetadata(row){
      this.$axios.get("/resources/attachment/get", { params: { ids: row.fileIds} })
              .then((success) => {
                this.craftData = success.data;
                this.dialogGetCraftVisible = true;
      })
    },


    /* 保存并提交 */
    save () {
      /*   console.log(this.form); */
      this.$refs.form.validate(vali => {
        if (vali) {
          this.loading = true;
          let reportVo = this.form;
          this.$axios.put('tdm/TdmExperimentalReport/add', reportVo).then(res => {
            this.$message.success('保存成功!')
            this.loading = false;
            if (this.gridData.length == 0) {
              this.form = {};
              this.$refs.form.resetFields()
            }
          }).catch(err => {
            this.$message.error(err.msg)
            this.loading = false;
          })
        }
      })
      this.deleteItem();
    },
    /* 关闭新增 */
    closeItem () {
      this.dialogVisible = false;
    },
    /* 新增 */
    addItem () {
      if (this.form.numbering == '') {
        this.$message.warning('请选择预约编号')
        return;
      }
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs.addItemGrid.refresh()
      })
      /*  console.log(this.appoId); */
    },
    /* 新增选中 */
    selecAddItem (row) {
      this.SnapGridData = row
      /*     console.log(row); */
    },
    /* 新增确认 */
    confirm () {
      this.dialogVisible = false;
      this.gridData = this.SnapGridData
      /*  console.log(this.gridData); */
    },
    /*实验预约编号弹窗 */
    AddReportNumber () {
      this.reportNumberDialog = true
      this.form.numbering = ""
      this.form.reservationType = ''
      this.$nextTick(() => {
        this.$refs.ReportNumberGrid.refresh()
      })
    },
    /* 关闭实验预约编号 */
    closeReportNumber () {
      this.reportNumberDialog = false
    },
    /* 实验报告编号保存 */
    ReportNumberSave () {
      this.form.reportName = this.SnapValue.appointmentName
      this.form.numbering = this.SnapValue.appointmentNumber
      this.appoId = this.SnapValue.appointmentId
      this.form.appointmentId = this.SnapValue.appointmentId
      this.form.reservationType = this.SnapValue.reservationType
      this.form.entrustUnit = this.SnapValue.entrustUnit
      this.form.phone = this.SnapValue.phone
      this.form.receiveSamplesPeopleName = this.SnapValue.receiveSamplesPeopleName
      this.form.receiveSamplesPeople = this.SnapValue.receiveSamplesPeople
      this.reportNumberDialog = false
    },
    /* 编号选中 */
    selecReportNumber (row) {
      this.SnapValue = row[0];
      console.log(this.SnapValue);
    },
    goback () {
      this.$router.go(-1)
    },
    /* 表格选中 */
    handleSelectionChange (row) {
      this.deleteData = row;
      console.log(this.deleteData);
      this.form['operationList'] = this.deleteData;
    },
    /* 删除 */
    deleteItem () {
      let arr1 = this.deleteData;
      let arr2 = this.gridData;
      var resArr = arr2.filter((item) => !arr1.includes(item));
      this.gridData = resArr;
    },
    /**
      权限 
    **/
    alterationAssign (flowContext, bizdata) {
    },
    flowReady (flowContext, bizdata) {
      //流程初始化
      Object.assign(this.bizdata, bizdata);
      //驳回才能编辑
    },
    flowOperateBtn (flowContext, bizdata) {
      //按钮操作事件
      console.log('按钮操作事件')
      return true;
    },
    flowBizData () {
      this.form.operationList = this.gridData;
      this.bizdata = this.form;
      //获取业务表单数据
      return this.bizdata;
    },
  },
  computed: {
    selectedCodes () {
      return this.gridData.map((data) => {
        console.log(data.operationId);
        return data.operationId;
      });
    }
  },
  mounted () {
    if (this.$refs.form) {
      this.$refs.form.resetFields()
    }
    /*  console.log(this.$route.params); */
  },
  created () {
    let query = this.$route.query;
    if (query.dataId) {
      this.loading = true;
      this.$axios.get('/tdm/TdmExperimentalReport/getReportByDataId', { params: { dataId: query.dataId } }).then(res => {
        this.loading = false
        console.log(res.data);
        if (res.data) {
          this.isHandleer = false;
          this.form = res.data;
          this.form.numbering = res.data.reportNumber;
          this.form.reservationType = this.form.reservationType;
          this.gridData = res.data.operationList;
        }
      }).catch(err => {
        this.loading = false
      })
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  padding: 10px;
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
.fanhui {
  position: absolute;
  top: 15px;
  right: 50px;
  z-index: 1;
}
</style>