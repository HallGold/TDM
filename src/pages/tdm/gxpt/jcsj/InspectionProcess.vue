<template>
  <div class="container">
    <ice-query-grid title="检测工艺"
                    data-url="/tdm/craft/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="InspectionProcess"
                    :gridIndex="true"
                    :operationsWidth="300"
                    chooseItem="single"
                    exportTitle="工艺文件"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
    <!-- 新增 -->
    <ice-dialog v-dialogDrag
                :title="title"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="titleName">{{title}}</div>
      <el-form ref="form"
               :model="form"
               label-width="120px"
               :rules="rules"
               class="formList">
        <el-form-item label="工艺名称:"
                      prop="name">
          <el-input v-model="form.name"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="工艺描述:"
                      prop="desc">
          <el-input v-model="form.desc"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="上传文件"
                      prop="fileId">
          <ice-multiple-upload v-model="form.fileId"
                               :on-success="fileUploadSuccess"
                               :do-secret="true"
                               ref="fileUpload"></ice-multiple-upload>
        </el-form-item>

      </el-form>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="save('form')">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 查看详情 -->
    <ice-dialog v-dialogDrag
                title="实验工艺详情"
                center
                :visible.sync="dialogVisibleDetails"
                :close-on-click-modal="false"
                :before-close="closeDetails"
                append-to-body
                width="800px">
      <div class="titleName">实验工艺详情</div>
      <div class="headers">
        <ul>
          <li>
            工艺名称：<span> {{ name }} </span>
          </li>
          <li>
            工艺描述：<span>{{ desc }}</span>
          </li>
          <li>
            上传时间：<span>{{ UploadTime }}</span>
          </li>
          <li>
            上传人：<span>{{ updataUser }}</span>
          </li>
        </ul>
      </div>
    </ice-dialog>

    <ice-dialog title="查看工艺文件"
                :visible.sync="dialogGetCraftVisible"
                width="500">
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
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceMultipleUpload from "@/components/common/base/IceMultipleUpload";
import Vue from "vue";
export default {
  name: "InspectionProcess",
  components: { IceQueryGrid, IceDialog, IceMultipleUpload },
  data () {
    return {
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
      query: [
        { type: "input", label: "工艺名称", code: "searchText", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "工艺名称",
          code: "name",
          align: "center",
        },
        {
          label: "工艺描述",
          code: "description",
          align: "center",
        },
        {
          label: "上传人",
          code: "userName",
          align: "center",
          sortable: true
        },
        {
          label: "上传时间",
          code: "updataDate",
          align: "center",
          sortable: true
        },

      ],
      operations: [
        {
          name: "查看工艺文件",
          callback: this.viewCraft,
          isShow: (row) => {
            return row.fileId != null;
          },
        },
        // { name: "查看详情", callback: this.compiler },
        { name: "编辑", callback: this.edit },
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
      dialogVisible: false,
      dialogVisibleDetails: false,
      dialogGetCraftVisible: false,
      title: "",
      /* form表单数据 */
      form: {
        name: "",
        desc: "",
        updataUser: "",
        fileId: []
      },
      /* 表单验证规则 */
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        desc: [{ required: true, message: "请输入描述", trigger: "blur" }],
        fileId: [
          { required: true, message: "请输入上传人", trigger: "blur" },
        ],
      },
      /* 详情数据 */
      name: "",
      desc: "",
      UploadTime: "",
      updataUser: "",
      fileInfo: []
    };
  },
  methods: {
    downloadCraft (row) {
      this.downloadById(row.oid);
    },
    //关闭查看弹框
    closeGetCraftDialog () {
      this.dialogGetCraftVisible = false;
    },
    //查看文件
    viewCraft (row) {
      let fileIds = JSON.parse(row.fileId);
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
    },
    downloadById (oid) {
      window.open(Vue.prototype.$apicontext + "resources/attachment/downloadById?id=" + oid, '_blank')
    },
    /* 编辑 */
    edit (row) {
      console.log(row);
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.title = "修改工艺文件";
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.reset();
      }
      /*  this.form = JSON.parse(JSON.stringify(row)) */
      this.form.fileId = JSON.parse(row.fileId);
      this.dialogVisible = true;
      this.form.name = row.name
      this.form.desc = row.description
      this.form.oid = row.oid
    },
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.title = "新增工艺文件";
      this.dialogVisible = true;
      this.form.name = "";
      this.form.desc = "";
      this.form.updataUser = "";
      this.form.fileId = [];
      this.$nextTick(() => {
        this.$refs.fileUpload.reset();
      });
    },
    /* 查看详情 */
    compiler (row) {
      console.log(row);
      this.name = row.name;
      this.desc = row.description;
      this.UploadTime = row.updataDate;
      this.fileId = row.fileId;
      this.updataUser = row.userName;
      this.dialogVisibleDetails = true;
      //this.getFileInfo(this.fileId);
    },
    getFileInfo (fileId) {
      let fileIds = JSON.parse(fileId);
      let ids = "";
      for (let i in fileIds) {
        ids += fileIds[i];
        ids += ',';
      }
      this.$axios.get("/resources/attachment/get", { params: { ids: ids } })
        .then((success) => {
          this.fileInfo = success.data;
        })
    },
    /* 删除 */
    delete (row) {
      console.log(row);
      this.$confirm('确定删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        if (row.oid) {
          this.$axios
            .delete("tdm/craft/delete", { params: { id: row.oid } })
            .then((success) => {
              this.$message({
                type: "success",
                message: "删除成功",
              });
              this.$refs.InspectionProcess.refresh();
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: error.msg,
              });
            });
        }
      })

    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.InspectionProcess.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    closeDetails () {
      this.dialogVisibleDetails = false;
    },
    /* 保存 */
    save (formName) {
      if (!this.form.fileId || this.form.fileId.length <= 0) {
        this.$message({
          type: "error",
          message: "请上传工艺文件",
        });
        return
      }
      this.$refs.form.validate((vali) => {
        if (vali) {
          if (this.title == '修改工艺文件') {
            console.log(this.form);
            this.$axios
              .post("tdm/craft/edit", this.form)
              .then((success) => {
                this.$message({
                  type: "success",
                  message: "修改成功",
                });
                this.$refs.InspectionProcess.refresh();
                this.dialogVisible = false;
              })
              .catch((error) => {
                this.$message({
                  type: "error",
                  message: error.msg,
                });
              });
          } else {
            this.$axios
              .put("tdm/craft/add", this.form)
              .then((success) => {
                this.$message({
                  type: "success",
                  message: "保存成功",
                });
                this.$refs.InspectionProcess.refresh();
                this.dialogVisible = false;
              })
              .catch((error) => {
                this.$message({
                  type: "error",
                  message: error.msg,
                });
              });
          }
        } else {
          this.$message({
            type: "error",
            message: "请按照要求表单输入完整",
          });
        }
      });
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    //文件上传成功回调
    fileUploadSuccess (data, file) {

    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
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
}
.headers {
  padding: 20px;
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
