<template>
  <div class="container">
    <ice-query-grid title="仓库管理"
                    data-url="tdm/warehouse/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="WarehouseManagement"
                    :operationsWidth="200"
                    chooseItem="single"
                    :buttons="buttons"
                    :gridIndex="true"
                    exportTitle="仓库信息"
                    :query="query"></ice-query-grid>
    <!-- 新增和编辑 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="AddDialog"
                :close-on-click-modal="false"
                :before-close="closeAddDialog"
                append-to-body
                width="1000px">
      <div class="titleName">{{ title }}</div>
      <el-form ref="form"
               :model="Warehouseform"
               label-width="100px"
               :rules="WarehouseRules">
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="仓库名称:"
                          prop="name"
                          style="width:90%">
              <el-input v-model="Warehouseform.name"
                        placeholder="请输入内容"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="当前容量:"
                          style="width:90%"
                          prop="nowCapacity">
              <el-input-number v-model="Warehouseform.nowCapacity"
                               :precision="2"
                               :step="0.1"
                               :min="0"
                               :max="99999"
                               placeholder="请输入内容"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="最大容量:"
                          style="width:90%"
                          prop="maximumCapacity">
              <el-input-number v-model="Warehouseform.maximumCapacity"
                               :precision="2"
                               :step="0.1"
                               :min="0"
                               :max="99999"
                               placeholder="请输入内容"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位:"
                          style="width:90%"
                          prop="unit">
              <el-select v-model="Warehouseform.unit"
                         placeholder="请选择">
                <el-option v-for="item in options"
                           :key="item.oid"
                           :label="item.name"
                           :value="item.oid">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="部门名称:"
                          prop="departmentName">
              <pms-select-tree ref="selectTree"
                               :isemptyBtn="isemptyBtn"
                               :showChecked="showChecked"
                               :inpWidth="width"
                               :unbrid="unbrid"
                               :treeData="treeData"
                               :transfer="transferTree.treeData"
                               :value="treeData.deptCode"
                               @handleCallback="handleCallback2">
              </pms-select-tree>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门code:"
                          style="width:90%"
                          prop="department">
              <el-input v-model="Warehouseform.department"
                        placeholder="请输入内容"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="12">
            <el-form-item label="人员code:"
                          style="width:90%"
                          prop="principalId">
              <el-input v-model="Warehouseform.principalId"
                        placeholder="请输入内容" 
                        :disabled="
                  this.Warehouseform.department == ''
                    ? true
                    : this.Warehouseform.department == undefined
                    ? true
                    : false
                "
                        readonly>
                <el-button slot="append"
                           icon="el-icon-edit-outline"
                           @click="selectCode"
                           :disabled="
                  this.Warehouseform.department == ''
                    ? true
                    : this.Warehouseform.department == undefined
                    ? true
                    : false
                "></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="负责人名称:"
                          style="width:90%"
                          prop="principalName">
              <el-input v-model="Warehouseform.principalName"
                        placeholder="请输入内容"
                        :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="24">
            <el-form-item label="描述:"
                          style="width:95%">
              <el-input v-model="Warehouseform.warehouseDesc"
                        placeholder="请输入内容"
                        type="textarea"
                        :rows="4"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="AddSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeAddDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 人员code弹窗 -->
    <ice-dialog v-dialogDrag
                title="选择人员code"
                :visible.sync="selectCodeDialog"
                :close-on-click-modal="false"
                :before-close="closeSelectCodeDialog"
                append-to-body
                width="800px"
                ref="selectCodedialogRef">
      <div class="titleName">选择人员code</div>
      <ice-query-grid title="仓库管理"
                      data-url="permission/user/dept_code"
                      :pagination="false"
                      :columns="selectCodeColumns"
                      ref="selectCodeRef"
                      chooseItem="single"
                      :gridIndex="false"
                      :query="selectCodeQuery"
                      @selection-change="handleSelectionChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="SelectCodeSave">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeSelectCodeDialog">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import PmsSelectTree from "@/components/common/pms/PmsSelectTree";
export default {
  name: "WarehouseManagement",
  components: { IceQueryGrid, IceDialog, PmsSelectTree },
  data () {
    return {
      query: [
        { type: "input", label: "仓库名称", code: "searchText", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "仓库编号",
          code: "warehouseNumber",
          width: 141,
          align: "center",
        },
        {
          label: "仓库名称",
          code: "name",
          width: 141,
          align: "center",
        },
        {
          label: "仓库描述",
          code: "warehouseDesc",
          width: 141,
          align: "center",
        },
        {
          label: "当前容量",
          code: "nowCapacity",
          width: 141,
          align: "center",
        },
        {
          label: "最大容量",
          code: "maximumCapacity",
          width: 141,
          align: "center",
        },
        {
          label: "单位",
          code: "unit",
          width: 141,
          align: "center",
          renderCell (h, data) {
            console.log(data.row.dictionaryCategory);
            return data.row.dictionaryCategory
              ? data.row.dictionaryCategory.name
              : "";
          },
        },
        {
          label: "负责人名称",
          code: "principalName",
          width: 141,
          align: "center",
        },
        {
          label: "部门",
          code: "departmentName",
          width: 141,
          align: "center",
        },
        {
          label: "状态",
          code: "status",
          width: 141,
          align: "center",
          formatter (row) {
            return row.status == 0 ? "禁用" : "启用";
          },
        },
      ],
      operations: [
        {
          name: "启用",
          callback: this.isEnable,
          isShow: (row) => {
            return row.status == 0;
          },
        },
        {
          name: "禁用",
          callback: this.isEnable,
          isShow: (row) => {
            return row.status == 1;
          },
        },
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
          name: '导入',
          icon: 'el-icon-upload2',
          size: 'mini',
          callback: this.handleImport
        },
        {name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export'},
      ],
      /* 仓库表单 */
      Warehouseform: {
        oid: "",
        name: "",
        nowCapacity: "",
        maximumCapacity: "",
        unit: "",
        principalId: "",
        principalName: "",
        warehouseDesc: "",
        department: "",
        departmentName: "",
      },
      /* 人员查询 */
      selectCodeQuery: [
        { type: "input", label: "名称", code: "name", value: "" },
        { type: "static", label: "", code: "loadDisabled", value: false },
        {
          type: "static",
          code: "deptCode",
          label: "部门code",
          value: () => {
            return this.Warehouseform.department;
          },
        },
      ],
      /* 人员表格 */
      selectCodeColumns: [
        { code: "oid", hidden: true },
        {
          label: "code",
          code: "code",
          width: 141,
          align: "center",
        },
        {
          label: "选择人员",
          code: "name",
          width: 141,
          align: "center",
        },
      ],
      /* 选择人员数据 */
      row: {},
      /* 单位 */
      options: [],
      AddDialog: false, // 新增
      selectCodeDialog: false, //人员
      title: "",
      WarehouseRules: {
        name: [{ required: true, message: "请输入数量", trigger: "blur" }],
        nowCapacity: [
          { required: true, message: "请输入当前容量", trigger: "blur" },
        ],
        maximumCapacity: [
          { required: true, message: "请输入最大容量", trigger: "blur" },
        ],
        unit: [{ required: true, message: "请选择单位", trigger: "change" }],
        principalId: [
          { required: true, message: "请选择人员code", trigger: "change" },
        ],
        principalName: [
          { required: true, message: "请输入负责人名称", trigger: "blur" },
        ],
        department: [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "请选择部门", trigger: "change" },
        ],
      },
      /* 选择部门 */
      isemptyBtn: true,
      showChecked: false,
      width: "330px",
      unbrid: false,
      treeData: {
        oid: "",
        deptName: "",
        placeholder: "请选择",
        deptCode: "",
      },
      transferTree: {
        treeData: {
          // 请求树接口地址
          api: "permission/frame_org/load_all_tree",
          lazy: false,
          nodeKey: "deptCode",
          // 配置字段
          props: {
            label: "deptName",
            children: "children",
          },
          // 请求传递参数
          initModel: {
            loadDisabled: false,
          },
        },
      },
    };
  },
  methods: {
    closeAddDialog () {
      this.AddDialog = false;
    },
    /* 新增 */
    addItem () {
      this.AddDialog = true;
      this.title = "仓库新增";
      this.Warehouseform = {};
      this.treeData = {
        oid: "",
        deptName: "",
        placeholder: "请选择",
        deptCode: "",
      };
      // this.$nextTick(() => {
      //   this.$refs.form.resetFields()
      // })
      /* 单位接口 */
      this.$axios
        .get("tdm//sample/queryDictionary")
        .then((res) => {
          this.options = res.data;
        })
        .catch((err) => {
          // console.log(err);
        });
    },
    /* 编辑 */
    compiler (row) {
      this.AddDialog = true;
      this.Warehouseform = JSON.parse(JSON.stringify(row));
      this.treeData.deptCode = this.Warehouseform.department;
      this.treeData.deptName = this.Warehouseform.departmentName;
      this.$axios
        .get("tdm//sample/queryDictionary")
        .then((res) => {
          this.options = res.data;
        }).catch((err) => {
          // console.log(err);
        });
    },
    /* 保存 */
    AddSave () {
      console.log(this.Warehouseform);
      this.$refs.form.validate((vali) => {
        if (vali) {
          if (this.title === "仓库新增") {
            this.$axios
              .put("tdm/warehouse/add", this.Warehouseform)
              .then((res) => {
                this.$message.success("成功");
                this.AddDialog = false;
                this.$refs.WarehouseManagement.refresh();
              })
              .catch((e) => {
                this.$message.error(e.msg);
              });
          } else if (this.title === "仓库编辑") {
            this.$axios
              .post("tdm/warehouse/edit", {
                oid: this.Warehouseform.oid,
                name: this.Warehouseform.name,
                unit: this.Warehouseform.unit,
                maximumCapacity: this.Warehouseform.maximumCapacity,
                warehouseDesc: this.Warehouseform.warehouseDesc,
                principalId: this.Warehouseform.principalId,
                principalName: this.Warehouseform.principalName,
                nowCapacity: this.Warehouseform.nowCapacity,
                departmentName: this.Warehouseform.departmentName,
              })
              .then((res) => {
                this.$message.success("成功");
                this.AddDialog = false;
                this.$refs.WarehouseManagement.refresh();
              })
              .catch((error) => {
                this.$message.error(error.msg);
              });
          }
        } else {
          this.$message.error("添加信息请填写完整!");
        }
      });
    },
    /* 删除 */
    delete (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then((res) => {
        this.$axios
          .delete("tdm/warehouse/delete", { params: { id: row.oid } })
          .then((res) => {
            this.$message.success("删除成功");
            this.$refs.WarehouseManagement.refresh();
          });
      });
    },
    //禁用  启用
    isEnable (row) {
      let status;
      if (row.status == 0) {
        status = 1;
      } else {
        status = 0;
      }
      this.$axios
        .post("tdm/warehouse/isEnable", {
          id: row.oid,
          status: status,
        })
        .then((result) => {
          if ((result.status = 200)) {
            this.$message.success("成功");
          } else {
            this.$message.success(result.statusText);
          }
          this.$refs.WarehouseManagement.refresh();
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
    },
    /* 选择人员code弹窗 */
    selectCode () {
      this.selectCodeDialog = true;
      this.row = {};
      this.$nextTick(() => {
        this.$refs.selectCodeRef.refresh();
      });
    },
    /* 关闭人员选择 */
    closeSelectCodeDialog () {
      this.selectCodeDialog = false;
    },
    /* 人员表格选中 */
    handleSelectionChange (row) {
      console.log("row", row);
      this.row = row[0];
    },
    /* 选择人员保存 */
    SelectCodeSave () {
      this.Warehouseform.principalId = this.row.code;
      this.Warehouseform.principalName = this.row.name;
      this.selectCodeDialog = false;
    },
    /* 部门回调  选中的数据 */
    handleCallback2 (data) {
      console.log("部门回调  选中的数据", data);
      this.treeData = data;
      this.Warehouseform.departmentName = data.deptName;
      this.Warehouseform.department = data.deptCode;
      this.Warehouseform.principalId = "";
      this.Warehouseform.principalName = "";
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
.el-form-item {
  margin-top: 20px;
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
