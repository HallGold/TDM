<template>
  <div class="content-filled">
    <ice-query-grid ref="iceGrid"
                    data-url="/tdm/equipmentState/queryEquipmentState"
                    :query="query"
                    :columns="columns"
                    :buttons="buttons"
                    :pagination="true"
                    :operations="operations"
                    :gridIndex="true"
                    :operations-width="150"
                    chooseItem="single">
    </ice-query-grid>
    <!-- 编辑弹框 -->
    <ice-dialog v-dialogDrag
                title="添加设备状态"
                custom-class="ice-dialog"
                center
                :visible.sync="dialogVisible"
                width="800px"
                append-to-body
                :close-on-click-modal="false"
                :before-close="closeItem">
      <div class="ice-container">
        <el-form :model="mainDataForm"
                 :rules="formRules"
                 label-position="right"
                 class="conditon-bar"
                 ref="form">
          <ice-grid-layout name="添加设备状态"
                           :columns="1"
                           gutter="0px"
                           :expandable="false">
            <el-row :gutter="40">
              <!-- 选择设备 -->
              <el-col :span="12">
                <el-form-item label="选择设备:"
                              label-width="100px"
                              prop="principal">
                  <el-input placeholder="选择设备"
                            v-model="mainDataForm.principal"
                            maxlength="10"
                            readonly>
                    <el-button slot="append"
                               class="el-icon-edit-outline"
                               @click="equipmentFrame"></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <!-- 登记时间 -->
              <el-col :span="12">
                <el-form-item label="登记时间:"
                              label-width="100px"
                              prop="timevalue">
                  <el-date-picker v-model="mainDataForm.timevalue"
                                  type="datetime"
                                  placeholder="登记时间"
                                  align="right"
                                  :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="40">
              <!-- 设备状态 -->
              <el-col :span="12">
                <el-form-item label="设备状态:"
                              label-width="100px"
                              prop="state">
                  <el-select v-model="mainDataForm.state"
                             placeholder="请选择">
                    <el-option v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </ice-grid-layout>
        </el-form>
      </div>

      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择设备弹框 -->
    <ice-dialog v-dialogDrag
                title="选择设备"
                :visible.sync="dialogVisible2"
                center
                width="1600px"
                append-to-body
                :close-on-click-modal="false"
                :before-close="closeItem2">
      <div class="titleName">选择设备</div>
      <ice-query-grid data-url="/tdm/equipment/getEquipmentList"
                      ref="iceGrid2"
                      :query="query2"
                      :columns="columns2"
                      chooseItem="single"
                      :gridIndex="false"
                      :tableCurrentChange="tableCurrentChange">
      </ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save2">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog2">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import OrgComm from "@/pages/system/comm/OrgComm";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import moment from "moment";

export default {
  name: "EquipmentAnnal",
  data () {
    return {
      query: [
        { type: "input", label: "设备名称/设备编号", code: "searchText", value: "" },
      ],
      query2: [
        {
          type: "input",
          label: "设备名称/设备编号",
          code: "searchText",
          value: "",
        },
      ],
      columns: [
        { label: "设备名称", code: "name", align: "center" },
        { label: "设备编号", code: "numbers", align: "center" },
        {
          label: "设备状态",
          code: "status",
          align: "center",
          renderCell (h, data) {
            return data.row.status == 1
              ? "检修"
              : data.row.status == 2
                ? "故障"
                : "正常";
          },
        },
        { label: "登记时间", code: "checkinTime", align: "center" },
      ],
      columns2: [
        {
          label: "设备图片",
          code: "image",
          width: 100,
          renderCell (h, data) {
            return (
              <img
                src={"/api/resources/image.png?id=" + data.row.image}
                width="33px"
                height="33px"
              />
            );
          },
        },
        { label: "设备名称", code: "equipmentName", width: 150 },
        { label: "设备型号", code: "model", width: 150 },
        { label: "设备编号", code: "equipmentNumber", width: 150 },
        { label: "设备类型", code: "classificationName", width: 150 },
        { label: "样品要求", code: "sampleClaim", width: 200 },
        { label: "覆盖检测领域", code: "coveredRealm", width: 100 },
        { label: "实验室", code: "laboratoryName", width: 100 },
        { label: "设备IP", code: "ip", width: 100 },
        { label: "负责人", code: "principal", width: 70 },
        {
          label: "设备状态",
          code: "status",
          width: 70,
          formatter (row) {
            if (row.status == 1) {
              return "检修";
            } else if (row.status == 2) {
              return "故障";
            } else {
              return "正常";
            }
          },
        },
      ],
      operations: [{ name: "删除", callback: this.deleteFrom }],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refreshItdm,
        },
      ],
      dialogVisible: false,
      dialogVisible2: false,
      status: true,
      editTypeList: false,
      isUpData: false,
      //表单数据
      mainDataForm: {
        principal: "",
        timevalue: "",
        equipmentId: "",
        state: 1,
      },
      //设备选中临时数据
      equipmentDataFrom: {},
      options: [
        {
          value: 1,
          label: "检修",
        },
        {
          value: 2,
          label: "故障",
        },
      ],
      // 表单校验规则
      formRules: {
        principal: [
          {
            required: true,
            message: "请选择设备",
            trigger: "change",
          },
        ],
        timevalue: [
          {
            required: true,
            message: "请选择登记时间",
            trigger: "change",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择设备状态",
            trigger: "change",
          },
        ],
      },
      // 快捷日期时间
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick (picker) {
              picker.$emit("pick", new Date());
            },
          },
          {
            text: "昨天",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            },
          },
          {
            text: "一周前",
            onClick (picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            },
          },
        ],
      },
    };
  },
  methods: {
    /**
     * 选中设备回调
     */
    tableCurrentChange (data) {
      console.log(data.row);
      this.equipmentDataFrom = data.row;
    },
    /**新增*/
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.isUpData = false;
      this.mainDataForm.principal = " ";
      this.mainDataForm.equipmentId = "";
      this.dialogVisible = true;
      this.editTypeList = false;
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.iceGrid.refresh();
    },
    /**编辑*/
    /*  editPageFuncItem(row) {
      console.log(row);
      this.isUpData = true;
      this.mainDataForm.code = row.code;
      this.mainDataForm.name = row.name;
      this.dialogVisible = true;
      this.editTypeList = true;
    }, */
    closeItem () {
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    },
    closeItem2 () {
      this.$refs.form.clearValidate();
      this.dialogVisible2 = false;
    },
    /**校验编码只能由数字，下划线，英文字母组成*/
    codeItem () {
      this.mainDataForm.code = this.mainDataForm.code.replace(/[^\w||_]+$/, "");
    },
    /**保存*/
    save () {
      this.$refs.form.validate((vali) => {
        if (vali) {
          console.log(" this.mainDataForm", this.mainDataForm);
          //转换时间为字符串
          this.mainDataForm.checkinTime = moment(
            this.mainDataForm.timevalue
          ).format("YYYY-MM-DD HH:mm:ss");
          this.$axios
            .put("/tdm/equipmentState/addEquipmentState", this.mainDataForm)
            .then(
              (ret) => {
                console.log(ret);
                if (ret.status === 200) {
                  this.$message.success("状态新增成功");
                  this.refreshItdm();
                  this.closeItem();
                }
              },
              (error) => {
                this.$message({
                  type: "error",
                  message: "保存失败",
                });
              }
            );
        } else {
          this.$message.error("请将信息填写完整");
        }
      });
    },
    /* 删除 */
    deleteFrom (data) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        console.log(data);
        this.$axios
          .delete("/tdm/equipmentState/delEquipmentState", {
            params: { equipmentId: data.oid },
          })
          .then(
            (ret) => {
              console.log(ret);
              if (ret.status === 200) {
                this.$message.success("删除成功");
                this.refreshItdm();
              }
            },
            (error) => {
              this.$message({
                type: "error",
                message: "删除失败",
              });
            }
          );
      })

    },
    /**弹窗关闭*/
    closeDialog () {
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    },
    // 选择设备弹框
    equipmentFrame () {
      this.equipmentDataFrom = {};
      this.dialogVisible2 = true;
      this.$refs.iceGrid2.refresh();
    },
    /* 选择设备框关闭 */
    closeDialog2 () {
      this.dialogVisible2 = false;
    },
    /* 选择设备框保存 */
    save2 () {
      if (!this.equipmentDataFrom) {
        this.$message.error("请选中一行数据！");
        return;
      }
      console.log(this.equipmentDataFrom);
      this.mainDataForm.equipmentId = this.equipmentDataFrom.oid;
      this.mainDataForm.principal = this.equipmentDataFrom.equipmentName;
      this.dialogVisible2 = false;
    },
  },
  components: { IceGridLayout, IceQueryGrid },
};
</script>
<style scoped lang="less">
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
