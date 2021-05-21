<template>
  <div class="content-filled">
    <!--实验室列表-->
    <ice-query-grid ref="laboratoryIceGrid"
                    data-url="/tdm/laboratory/list"
                    :query="query"
                    :columns="columns"
                    :buttons="buttons"
                    :pagination="true"
                    :gridIndex="true"
                    :operations="operations"
                    :operations-width="150"
                    exportTitle="实验室信息"
                    chooseItem="single">
    </ice-query-grid>
    <!-- 编辑弹框 -->
    <ice-dialog v-dialogDrag
                :title="title"
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
          <ice-grid-layout :name="namess"
                           :columns="1"
                           gutter="0px"
                           :expandable="false">
            <el-form-item label="实验室名称:"
                          label-width="100px"
                          prop="laboratoryName">
              <el-input placeholder="请输入实验室名称"
                        maxlength="30"
                        v-model="mainDataForm.laboratoryName"></el-input>
            </el-form-item>
            <el-form-item label="楼层:"
                          label-width="100px"
                          prop="floor">
              <el-select v-model="mainDataForm.floor"
                         placeholder="请选择楼层">
                <el-option v-for="item in options"
                           :key="item.value"
                           :label="item.label"
                           :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="所属部门:"
                          label-width="100px"
                          prop="departmentName">
              <pms-select-tree ref="selectTree"
                               :isemptyBtn="isemptyBtn"
                               :showChecked="showChecked"
                               :unbrid="unbrid"
                               :treeData="treeData"
                               :transfer="transferTree.treeData"
                               :value="treeData.oid"
                               @handleCallback="handleCallback2">
              </pms-select-tree>
            </el-form-item>
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
  </div>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import IceImageUploader from "@/components/common/base/IceImageUpload";
import PmsSelectTree from "@/components/common/pms/PmsSelectTree";

export default {
  name: "laboratoryInfo",
  components: { IceImageUploader, IceGridLayout, IceQueryGrid, PmsSelectTree },
  data () {
    return {
      title: "",
      /*实验室*/
      query: [
        { type: "input", label: "实验室名称", code: "searchTerm", value: "" },
      ],
      columns: [
        { label: "实验室编号", code: "laboratoryNumber", align: "center" },
        { label: "实验室名称", code: "laboratoryName", align: "center" },
        { label: "楼层", code: "floor", align: "center" },
        { label: "所属部门", code: "departmentName", align: "center" },
      ],
      operations: [
        { name: "编辑", callback: this.editItem },
        { name: "删除", callback: this.deleteFrom },
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
          callback: this.refreshItdm,
        },
        {
          name: '导入',
          icon: 'el-icon-upload2',
          size: 'mini',
          callback: this.handleImport
        },
        { name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export' },
      ],
      /*楼层*/
      options: [
        {
          value: "一楼",
          label: "一楼",
        },
        {
          value: "二楼",
          label: "二楼",
        },
        {
          value: "三楼",
          label: "三楼",
        },
        {
          value: "四楼",
          label: "四楼",
        },
        {
          value: "五楼",
          label: "五楼",
        },
      ],

      /*部门*/
      showChecked: false,
      isemptyBtn: true,
      unbrid: true,
      transferTree: {
        treeData: {
          // 请求树接口地址
          api: "/tdm/laboratory/department",
          lazy: false,
          nodeKey: "oid",
          // 配置字段
          props: {
            label: "deptName",
            children: "children",
          },
          // 请求传递参数
          initModel: {},
        },
      },
      treeData: {
        oid: "",
        deptName: "",
        placeholder: "请选择",
      },

      /*弹框*/
      dialogVisible: false,

      //设备表单数据
      mainDataForm: {
        laboratoryName: "",
        floor: "",
        departmentName: "",
        department: "",
      },
      // 表单验证规则
      formRules: {
        laboratoryName: [
          {
            required: true,
            message: "请输入实验室名称",
            trigger: "blur",
            pattern: "[^ \x22]+",
          },
        ],
        floor: [
          { required: true, message: "请输入实验室楼层", trigger: "blur" },
        ],
      },
      namess: "",
    };
  },
  methods: {
    // 部门子组件点击回调  选中的数据
    handleCallback2 (data) {
      // 回调后数据操作
      this.mainDataForm.departmentName = data.deptName;
      this.mainDataForm.department = data.oid;
      this.treeData.oid = data.oid;
    },
    /**编辑*/
    editItem (row) {
      this.title = "实验室编辑";
      this.namess = "实验室编辑";
      this.mainDataForm = {};
      this.treeData.oid = "";
      this.mainDataForm = JSON.parse(JSON.stringify(row));
      this.treeData.oid = row.department;
      this.dialogVisible = true;
    },
    /**新增*/
    addItem () {
      this.title = "新增实验室";
      this.namess = "新增实验室";
      this.mainDataForm = {};
      this.treeData.oid = "";
      this.dialogVisible = true;
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.laboratoryIceGrid.refresh();
    },
    closeItem () {
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    },
    /**保存*/
    save () {
      if (!this.isTrue()) {
        return;
      }
      if (this.mainDataForm.oid) {
        this.$axios
          .post("/tdm/laboratory/edit", this.mainDataForm)
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("编辑成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.dialogVisible = false;
            this.refreshItdm();
          })
          .catch((error) => {
            this.$message.error("编辑失败！");
          });
      } else {
        this.$axios
          .put("/tdm/laboratory/add", this.mainDataForm)
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("添加成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.dialogVisible = false;
            this.refreshItdm();
          })
          .catch((error) => {
            this.$message.error("添加失败！");
          });
      }
    },
    /*验证*/
    isTrue () {
      let validate = true;
      this.$refs.form.validate((valid) => {
        validate = valid;
      });
      return validate;
    },
    /* 删除 */
    deleteFrom (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("/tdm/laboratory/delete", { params: { id: row.oid } })
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.refreshItdm();
          })
          .catch((error) => {
            this.$message.error("删除失败！");
          });
      });
    },
    /**弹窗关闭*/
    closeDialog () {
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    },
  },
};
</script>
<style scoped lang="less">
.textcolor {
  margin-left: 20px;
  color: blue;
}
.ice-image-upload {
  top: 0;
}
.uploda-box {
}
</style>
