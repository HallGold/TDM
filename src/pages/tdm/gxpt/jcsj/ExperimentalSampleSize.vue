<template>
  <div class="container">
    <ice-query-grid title="实验最小样品量"
                    data-url="tdm/TdmDetectProjectEquipment/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="ExperimentalSampleSizeRef"
                    :operationsWidth="200"
                    chooseItem="multiple"
                    :gridIndex="false"
                    :buttons="buttons"
                    :query="query"
                    exportTitle="设备检测项绑定关系"
                    @selection-change="selecChange"></ice-query-grid>
    <!-- 编辑与新增 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">{{ title }}</div>
      <el-form ref="form"
               :model="form"
               label-width="120px"
               class="formList"
               :rules="rules">
        <el-form-item label="数量:"
                      prop="Quantity">
          <!--  <el-input v-model="form.Quantity" placeholder="请输入内容"></el-input> -->
          <el-input-number v-model="form.Quantity"
                           :precision="2"
                           :step="0.01"
                           :min="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="单位:"
                      prop="unit">
          <el-select v-model="form.unit"
                     placeholder="请选择">
            <el-option v-for="item in options"
                       :key="item.oid"
                       :label="item.name"
                       :value="item.oid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="实验项:"
                      prop="ExperimentalItem">
          <el-input v-model="form.ExperimentalItem"
                    placeholder="请输入内容"
                    :disabled="title === '最小样品量编辑'"
                    readonly>
            <el-button slot="append"
                       class="el-icon-edit-outline"
                       @click="SelectExperimentalItem()"
                       :disabled="title === '最小样品量编辑'"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="设备:"
                      prop="equipment">
          <el-input v-model="form.equipment"
                    placeholder="请输入内容"
                    :disabled="title === '最小样品量编辑'">
            <el-button slot="append"
                       class="el-icon-edit-outline"
                       @click="OpenSelectEquipment()"
                       :disabled="title === '最小样品量编辑'"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="addSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeItem">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 批量修改弹窗 -->
    <ice-dialog v-dialogDrag
                title="批量修改数量"
                center
                :visible.sync="ModifyNumberDialog"
                :close-on-click-modal="false"
                :before-close="closeNumberDialog"
                append-to-body
                width="800px">
      <el-form ref="formRef"
               :model="Batchform"
               label-width="120px">
        <div class="titleName">批量修改数量</div>
        <el-form-item label="数量:"
                      style="width:80%">
          <el-input-number v-model="Batchform.minSampleName"
                           :precision="2"
                           :step="0.01"
                           :min="0.01"></el-input-number>
        </el-form-item>
        <el-form-item label="单位:"
                      style="width:80%">
          <el-select v-model="Batchform.unit"
                     placeholder="请选择">
            <el-option v-for="item in Batchoptions"
                       :key="item.oid"
                       :label="item.name"
                       :value="item.oid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="ModifyNumberSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeNumberDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择实验项 -->
    <ice-dialog v-dialogDrag
                title="选择实验项"
                center
                :visible.sync="ExperimentalItemDialog"
                :close-on-click-modal="false"
                :before-close="closeExperimentalItem"
                append-to-body
                width="1600px">
      <div class="titleName">选择实验项</div>
      <ice-query-grid title="选择实验项"
                      data-url="tdm/detectProject/list"
                      :pagination="true"
                      :columns="ExperimentalItemColumns"
                      ref="SelectExperimentalItemRef"
                      :operationsWidth="200"
                      chooseItem="single"
                      :query="SelectExperimentalQuery"
                      @selection-change="ExperimentalItemChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="ExperimentalItemSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeExperimentalItem">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择设备 -->
    <ice-dialog v-dialogDrag
                title="选择设备"
                center
                :visible.sync="SelectEquipmentDialog"
                :close-on-click-modal="false"
                :before-close="CloseSelectEquipmentDialog"
                append-to-body
                width="1600px">
      <div class="titleName">选择设备</div>
      <ice-query-grid title="选择设备"
                      data-url="/tdm/equipment/getEquipmentList"
                      :pagination="true"
                      :columns="getEquipmentListColumns"
                      ref="SelectEquipmentRef"
                      :operationsWidth="200"
                      chooseItem="single"
                      :query="SelectEquipmentQuery"
                      @selection-change="SelectEquipmentChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="SelectEquipmentSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="CloseSelectEquipmentDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "ExperimentalSampleSize",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "实验项", code: "searchText", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "实验项",
          code: "projectName",
          width: 300,
          align: "center",
        },
        {
          label: "设备",
          code: "equipmentName",
          width: 300,
          align: "center",
          renderCell (h, data) {
            let equipmentName = data.row.equipmentName;
            let equipmentNum = data.row.equipmentNum;
            if (equipmentName && equipmentNum) {
              return equipmentName + " (" + equipmentNum + ")";
            }
            return equipmentName;
          },
        },
        {
          label: "最小样品数量",
          code: "minSampleName",
          width: 300,
          align: "center",
        },
        {
          label: "单位",
          code: "unit",
          width: 300,
          align: "center",
          renderCell (h, data) {
            var dictionaryCategory = data.row.dictionaryCategory;
            return dictionaryCategory.code + "/" + dictionaryCategory.name;
          },
        },
      ],
      operations: [
        { name: "编辑", callback: this.compiler },
        { name: "删除", callback: this.delete },
      ],
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
          callback: this.refreshView,
        },
        {
          name: "批量修改数量",
          icon: "el-icon-edit",
          type: "primary",
          callback: this.modifyNumber,
        },
        {
          name: '导入',
          icon: 'el-icon-upload2',
          size: 'mini',
          callback: this.handleImport
        },
        { name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export' },
      ],
      /* 表单数据 */
      form: {
        ExperimentalItem: "",
        equipment: "",
        Quantity: "",
        unit: "",
      },
      /* 新增参数 */
      params: {},
      /* 编辑参数 */
      getparams: {
        oidSet: [],
        minSampleName: "",
        unit: "",
      },
      /* 批量修改表单 */
      Batchform: {
        oidSet: [],
        minSampleName: "",
        unit: "",
      },
      /* 新增和编辑单位下拉 */
      options: [],
      /* 批量修改下拉 */
      Batchoptions: [],
      dialogVisible: false,
      ModifyNumberDialog: false,
      ExperimentalItemDialog: false,
      SelectEquipmentDialog: false,
      title: "",
      /* 验证 */
      rules: {
        ExperimentalItem: [
          { required: true, message: "请选择实验项", trigger: "change" },
        ],
        equipment: [
          { required: true, message: "请选择设备", trigger: "change" },
        ],
        Quantity: [{ required: true, message: "请输入数量", trigger: "blur" }],
        unit: [{ required: true, message: "请选择单位", trigger: "blur" }],
      },
      /* 检测项目表格 */
      ExperimentalItemColumns: [
        { code: "oid", hidden: true },
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
      /* 选择设备 */
      getEquipmentListColumns: [
        { code: "oid", hidden: true },
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
          align: "center",
        },
        {
          label: "设备名称",
          code: "equipmentName",
          width: 150,
          align: "center",
        },
        { label: "设备型号", code: "model", width: 150, align: "center" },
        {
          label: "设备编号",
          code: "equipmentNumber",
          width: 150,
          align: "center",
        },
        {
          label: "设备类型",
          code: "classificationName",
          width: 150,
          align: "center",
        },
        { label: "样品要求", code: "sampleClaim", width: 200, align: "center" },
        {
          label: "覆盖检测领域",
          code: "coveredRealm",
          width: 100,
          align: "center",
        },
        {
          label: "实验室",
          code: "laboratoryName",
          width: 100,
          align: "center",
        },
        { label: "设备IP", code: "ip", width: 100, align: "center" },
        { label: "负责人", code: "principal", width: 70, align: "center" },
        {
          label: "设备状态",
          code: "status",
          width: 70,
          align: "center",
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
      /* 查询 */
      SelectExperimentalQuery: [
        { type: "input", label: "实验名称", code: "searchTerm", value: "" },
      ],
      SelectEquipmentQuery: [
        {
          type: "input",
          label: "设备名称/设备编号",
          code: "searchText",
          value: "",
        },
      ],
      row: {},
    };
  },
  methods: {
    /* 关闭弹窗 */
    closeItem () {
      this.dialogVisible = false;
    },
    closeNumberDialog () {
      this.ModifyNumberDialog = false;
    },
    closeExperimentalItem () {
      this.ExperimentalItemDialog = false;
    },
    CloseSelectEquipmentDialog () {
      this.SelectEquipmentDialog = false;
    },
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.dialogVisible = true;
      this.title = "最小样品量新增";
      this.form.Quantity = '';
      this.form.unit = '';
      this.form.ExperimentalItem = '';
      this.form.equipment = '';
      this.$nextTick(() => {
        this.$axios.get("tdm/sample/queryDictionary?type=UNIT").then((res) => {
          this.options = res.data;
          /*  console.log(this.options); */
        });
      });
    },
    /* 编辑 */
    compiler (row) {
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.title = "最小样品量编辑";
      /* console.log(row); */
      this.form.ExperimentalItem = row.projectName;
      this.form.equipment = row.equipmentName;
      this.form.Quantity = row.minSampleName;
      this.form.unit = row.unit;
      this.form.oidSet = row.oid;
      this.$nextTick((row) => {
        this.$axios.get("tdm/sample/queryDictionary?type=UNIT").then((res) => {
          this.options = res.data;
          /*  console.log(this.options); */
        });
      });
      this.getparams.oidSet[0] = row.oid;
    },
    /* 保存 */
    addSave () {
      this.$refs.form.validate(vali => {
        if (vali) {
          if (this.title === "最小样品量新增") {
            this.params.minSampleName = this.form.Quantity;
            this.params.unit = this.form.unit;
            this.$axios
              .put("tdm/TdmDetectProjectEquipment/add", this.params)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "新增成功",
                });
                this.$refs.ExperimentalSampleSizeRef.refresh();
                this.dialogVisible = false;
              })
              .catch((err) => {
                this.$message({
                  type: "err",
                  message: err.msg,
                });
              });
          } else if (this.title === "最小样品量编辑") {
            this.getparams.minSampleName = this.form.Quantity;
            this.getparams.unit = this.form.unit;
            this.$axios
              .post("tdm/TdmDetectProjectEquipment/edit", this.getparams)
              .then((res) => {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.$refs.ExperimentalSampleSizeRef.refresh();
                this.dialogVisible = false;
              })
              .catch((err) => {
                this.$message({
                  type: "err",
                  message: err.msg,
                });
              });
          } else {
            this.$message({
              type: "err",
              message: "出错了",
            });
          }
        } else {
          this.$message.error('表单请填写完整')
        }
      })

    },
    /* 删除 */
    delete (row) {
      console.log(row);
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      })
        .then(() => {
          this.$axios
            .delete("tdm/TdmDetectProjectEquipment/del", {
              params: { id: row.oid },
            })
            .then((result) => {
              this.$message.success("删除成功");
              this.$refs.ExperimentalSampleSizeRef.refresh();
            })
            .catch((err) => {
              this.$message({
                type: "err",
                message: err.msg,
              });
            });
        })
        .catch((error) => {
          /* this.$message({
            type: "error",
            message: error.msg,
          }); */
        });
    },
    /* 实验项弹框 */
    SelectExperimentalItem () {
      this.ExperimentalItemDialog = true;
    },
    /* 选择实验项保存 */
    ExperimentalItemSave () {
      console.log(this.row);
      this.form.ExperimentalItem = this.row.projectName
      this.params.projectId = this.row.id
      this.ExperimentalItemDialog = false;
    },
    /* 实验项选中 */
    ExperimentalItemChange (row) {
      /*   console.log(row[0]); */
      this.row = row[0];
    },
    /* 打开选择设备 */
    OpenSelectEquipment () {
      this.SelectEquipmentDialog = true;
    },
    /* 选择设备保存 */
    SelectEquipmentSave () {
      this.SelectEquipmentDialog = false;
    },
    /* 选择设备选中 */
    SelectEquipmentChange (row) {
      this.form.equipment = row[0].equipmentName;
      this.params.equipmentId = row[0].oid;
    },
    /* 批量选中 */
    selecChange (row) {
      let arr = [];
      row.forEach((e) => {
        arr.push(e.oid);
      });
      this.Batchform.oidSet = arr;
    },
    /* 批量新增数量打开 */
    modifyNumber () {
      this.Batchform.minSampleName = "";
      this.Batchform.unit = "";
      this.ModifyNumberDialog = true;
      this.$nextTick(() => {
        this.$axios.get("tdm/sample/queryDictionary?type=UNIT").then((res) => {
          this.Batchoptions = res.data;
          /*  console.log(this.options); */
        });
      });
    },
    /* 批量批改保存 */
    ModifyNumberSave () {
      this.Batchform.minSampleName = this.Batchform.minSampleName;
      this.Batchform.unit = this.Batchform.unit;
      this.$axios
        .post("tdm/TdmDetectProjectEquipment/edit", this.Batchform)
        .then((res) => {
          this.$message({
            type: "success",
            message: "修改成功",
          });
          this.$refs.ExperimentalSampleSizeRef.refresh();
          this.ModifyNumberDialog = false;
        })
        .catch((err) => {
          this.$message({
            type: "err",
            message: err.msg,
          });
        });
    },
    /* 刷新 */
    refreshView () {
      this.$refs.WarehouseManagement.refresh()
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  padding: 0;
}
.formList {
  box-sizing: border-box;
  padding-right: 30px;
  padding-top: 10px;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}
.el-form-item {
  width: 50%;
  margin-top: 10px;
  margin-bottom: 20px;
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
