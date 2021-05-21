<template>
  <div class="container">
    <ice-query-grid title="实验项目时效管理"
                    data-url="/tdm/detectProjectTime/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="ProjectTimeliness"
                    :operationsWidth="200"
                    chooseItem="single"
                    :gridIndex="false"
                    :buttons="buttons"
                    exportTitle="标准工时"
                    :query="query"></ice-query-grid>
    <!-- 新增和编辑 -->
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
               :rules="rules"
               class="formList">
        <el-form-item label="实验数量:">
          <el-input-number v-model="form.num"
                           @change="handleChangeNum"
                           :min="1"
                           :max="20"
                           :precision="0"
                           :step="1"
                           label="不能大于20"></el-input-number>
        </el-form-item>
        <el-form-item label="实验时间(时):">
          <el-input-number v-model="form.time"
                           @change="handleChangeTime"
                           :min="1"
                           :max="20"
                           :precision="0"
                           :step="1"
                           label="不能大于20"></el-input-number>
        </el-form-item>
        <el-form-item label="选择实验项目:"
                      prop="projectName">
          <el-input v-model="form.projectName"
                    placeholder="请输入内容"
                    :disabled="this.title == '编辑样品'"
                    readonly>
            <el-button slot="append"
                       class="el-icon-edit-outline"
                       @click="equipmentFrame()"></el-button>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 选择实验项目弹框 -->
    <ice-dialog v-dialogDrag
                :title="title2"
                center
                :visible.sync="dialogVisibleSelect"
                :close-on-click-modal="false"
                :before-close="closeSelectDialog"
                append-to-body
                width="1600px">
      <div class="titleName">{{ title2 }}</div>
      <ice-query-grid title="实验项目时效管理"
                      data-url="/tdm/detectProject/list"
                      :pagination="true"
                      :columns="columns2"
                      ref="ProjectTimeliness2"
                      chooseItem="single"
                      :query="query2"
                      :gridIndex="false"
                      :tableCurrentChange="tableCurrentChange"></ice-query-grid>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="saveSelect">保存</el-button>
        <el-button type="primary"
                   size="medium"
                   @click="closeDialog2">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
export default {
  name: "ProjectTimeliness",
  components: { IceQueryGrid, IceDialog, IceGridLayout },
  data () {
    return {
      query: [
        { type: "input", label: "实验项目名称", code: "searchTerm", value: "" },
      ],
      query2: [
        {
          type: "input",
          label: "检测项目名称",
          code: "searchTerm",
          value: "",
        },
      ],
      columns: [
        {
          label: "实验项目名称",
          code: "projectName",
          width: 270,
          align: "center",
        },
        {
          label: "实验数量",
          code: "num",
          width: 270,
          align: "center",
        },
        {
          label: "实验时间",
          code: "time",
          width: 270,
          align: "center",
        },
        {
          label: "创建时间",
          code: "createTime",
          width: 270,
          align: "center",
        },
      ],
      columns2: [
        {
          label: "检测项目名称",
          code: "projectName",
          align: "center",
        },
        {
          label: "检测项目分类名称",
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
          align: "center",
        },
        {
          label: "备注",
          code: "remarks",
          align: "center",
        },
      ],
      operations: [
        { name: "编辑", callback: this.compiler},
        { name: "删除", callback: this.delete ,ctrlCode:"BSC" },
      ],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
          ctrlCode:"BTJ",
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
        {name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export'},
      ],
      dialogVisible: false,
      dialogVisibleSelect: false,
      title: "",
      title2: "选择实验项目",
      /* form表单数据 */
      form: {
        id: "",
        projectId: "",
        projectName: "",
        num: "",
        time: "",
      },

      /* 表单验证规则 */
      rules: {
        projectName: [
          { required: true, message: "请输入名称", trigger: "change" },
        ]
      },
    };
  },
  methods: {
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
      this.title = "添加标准工时";
      this.dialogVisible = true;
      this.form.projectName = " ";
      this.form.num = "";
      this.form.time = "";
      this.form.projectId = '';
    },
    /* 编辑 */
    compiler (row) {
      this.title = "编辑标准工时";
      this.dialogVisible = true;
      this.form = JSON.parse(JSON.stringify(row));
    },
    /* 删除 */
    delete (row) {
      console.log(row.oid);
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("tdm/detectProjectTime/delete", { params: { id: row.oid } })
          .then((success) => {
            this.$message({
              type: "success",
              message: "删除成功",
            });
            this.$refs.ProjectTimeliness.refresh();
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error.msg,
            });
          });
      });
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.ProjectTimeliness.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    closeSelectDialog () {
      this.dialogVisibleSelect = false;
    },
    /* 保存 */
    save () {
      if (this.title === "添加标准工时") {
        this.$axios
          .put("tdm/detectProjectTime/add", this.form)
          .then((success) => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.$refs.ProjectTimeliness.refresh();
            this.dialogVisible = false;
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error.msg,
            });
          });
      } else if (this.title === "编辑标准工时") {
        console.log(this.form);
        this.form.detectProjectId = this.form.projectId;
        this.$axios
          .post("tdm/detectProjectTime/edit", this.form)
          .then((success) => {
            this.$message({
              type: "success",
              message: "保存成功",
            });
            this.$refs.ProjectTimeliness.refresh();
            this.dialogVisible = false;
          })
          .catch((error) => {
            this.$message({
              type: "error",
              message: error.msg,
            });
          });
      }
    },
    /* 选择实验项目保存 */
    saveSelect () {
      this.dialogVisibleSelect = false;
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    closeDialog2 () {
      this.dialogVisibleSelect = false;
    },
    equipmentFrame () {
      this.dialogVisibleSelect = true;
      this.$nextTick(() => {
        this.$refs.ProjectTimeliness2.refresh()
      })
    },
    /* 表单选中回调 */
    tableCurrentChange (row) {
      console.log("row==>", row);
      this.form.projectName = row.row.projectName;
      this.form.projectId = row.row.id;
    },
    handleChangeNum (row) {
      /*  console.log(row); */
      if (row >= 20) {
        this.$message({
          type: "warning",
          message: "最大数字为20",
        });
      }
    },
    handleChangeTime (row) {
      if (row >= 20) {
        this.$message({
          type: "warning",
          message: "最大数字为20",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
.headers {
  h2 {
    font-size: 20px;
    font-weight: bold;
    color: #000;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    margin-top: 10px;
    margin-bottom: 30px;
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
      font-size: 15px;
    }
  }
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
