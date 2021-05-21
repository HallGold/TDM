<template>
  <div class="container">
    <ice-query-grid title="实验作业管理"
                    data-url="tdm/experiment/lists"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="grid"
                    chooseItem="single"
                    :gridIndex="true"
                    :query="query"
                    @selection-change="handleSelectionChange"></ice-query-grid>
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
                <template>
                  <el-radio v-model="equipmentReview.status"
                            label="1">设备正常</el-radio>
                  <el-radio v-model="equipmentReview.status"
                            label="2">设备异常</el-radio>
                </template>
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
        {
          label: "预约编号",
          code: "reservationNumber",

          align: "center",
        },
        {
          label: "预约日期",
          code: "createTime",

          sortable: true,
          align: "center",
        },
        {
          label: "预计完成时间",
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
          renderCell: (h, data) => {
            /*    console.log(data.row); */
            let color = ['', '#909399', 'rgba(62,132,218,0.6)', '#F56C6C']
            let obj = {
              color: '#fff',
              background: color[data.row.reservationType],
              fontSize: '10px',
              padding: '2px 5px',
              borderRadius: '2px'
            }
            return <span style={obj}>{data.row.reservationType == 1 ? '自主' : data.row.reservationType == 2 ? "委托" : "生产"}</span>
          }
        },
        {
          label: "实验室编号",
          code: "laboratoryName",

          align: "center",
        },
        {
          label: "作业人员",
          code: "peopleName",

          align: "center",
        },
        {
          label: "检验设备",
          code: "equipmentName",

          align: "center",
        },
        {
          label: "状态",
          code: "status",

          align: "center",
          formatter (row) {
            return row.statusDesc;
          },
        },
      ],
      operations: [
        {
          name: "设备复核", callback: this.showEquipmentReview,
          isShow: (row) => {
            return row.status > 2 && (row.equipmentStatus == 0 || row.equipmentStatus == 2);
          },
        },
      ],
      /*设备复核*/
      equipmentReview: {
        status: "",
        remarks: "",
      },
      dialogReviewVisible: false,
    };
  },
  methods: {
    /*设备复核保存*/
    saveReview () {
      console.log("equipmentReview", this.equipmentReview);
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
    /* 表格选中 */
    handleSelectionChange (row) {

    },
  },
  mounted () {
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
</style>
