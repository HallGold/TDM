<template>
  <div class="container">
    <ice-query-grid title="检测工艺"
                    data-url="tdm/ExperimentalBasis/list"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="InspectionProcess"
                    :gridIndex="true"
                    :operationsWidth="300"
                    chooseItem="single"
                    :buttons="buttons"
                    exportTitle="实验依据"
                    :query="query"></ice-query-grid>
    <!-- 新增-编辑 -->
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
               :rules="rules">
        <el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="依据名称:"
                            prop="basisName">
                <el-input v-model="form.basisName"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="12">-->
            <!--              <el-form-item label="实验项:"-->
            <!--                            prop="projectName">-->
            <!--                <el-input v-model="form.projectName"-->
            <!--                          placeholder="请输入内容"-->
            <!--                          @focus="SelectExperimentalItem()"-->
            <!--                          :disabled="title === '编辑'"-->
            <!--                          readonly></el-input>-->
            <!--              </el-form-item>-->
            <!--            </el-col>-->
            <el-col :span="12">
              <el-form-item label="描述:"
                            prop="remarks">
                <el-input v-model="form.remarks"
                          placeholder="请输入内容"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24">
            <el-col :span="12">
              <el-form-item label="上传文件"
                            prop="fileId">
                <ice-multiple-upload v-model="form.fileId"
                                     ref="fileUpload"
                                     :on-success="handleAvatarSuccess"></ice-multiple-upload>
              </el-form-item>
            </el-col>
          </el-row>
        </el-row>
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
    <!-- 文件下载 -->
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
        { type: "input", label: "依据名称", code: "searchText", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "依据名称",
          code: "basisName",
          align: "center",
        },
        // {
        //   label: "实验项",
        //   code: "projectName",
        //   align: "center",
        // },
        {
          label: "备注",
          code: "remarks",
          align: "center",
        },
      ],
      operations: [
        {
          name: "实验依据附件下载",
          callback: this.viewCraft,
          isShow: (row) => {
            return row.fileIds != null;
          },
        },
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
      dialogGetCraftVisible: false,
      ExperimentalItemDialog: false,
      title: "",
      /* form表单数据 */
      form: {
        basisName: "",
        remarks: "",
        projectName: "",
        fileId: []
      },
      /* 表单验证规则 */
      rules: {
        basisName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        remarks: [{ required: false, message: "请输入描述", trigger: "blur" }],
        projectName: [{ required: true, message: "请选择实验项", trigger: "change" }],
        fileId: [
          { required: true, message: "请输入上传人", trigger: "blur" },
        ],
      },
      /* 实验项数据 */
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
      /* 查询 */
      SelectExperimentalQuery: [
        { type: "input", label: "实验名称", code: "searchTerm", value: "" },
      ],
      /* 实验项选中 */
      row: {},
      /* 新增参数 */
      params: {},
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
    closeExperimentalItem () {
      this.ExperimentalItemDialog = false;
    },
    /* 实验项弹框 */
    SelectExperimentalItem () {
      this.ExperimentalItemDialog = true;
    },
    /* 选择实验项保存 */
    ExperimentalItemSave () {
      /* console.log(this.row); */
      this.form.projectName = this.row.projectName
      this.params.projectId = this.row.id
      this.form.projectId = this.row.id
      this.ExperimentalItemDialog = false;
    },
    /* 实验项选中 */
    ExperimentalItemChange (row) {
      /*   console.log(row[0]); */
      this.row = row[0];
    },
    //实验依据附件下载
    viewCraft (row) {
      console.log(row);
      this.dialogGetCraftVisible = true;
      this.$axios.get("/resources/attachment/get", { params: { ids: row.fileIds } })
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
      this.title = "编辑";
      if (this.$refs.fileUpload) {
        this.$refs.fileUpload.reset();
      }
      this.form.fileId = row.fileIds.split(",");
      this.dialogVisible = true;
      this.form.basisName = row.basisName
      this.form.projectName = row.projectName
      this.form.oid = row.oid
      this.form.remarks = row.remarks
      this.form.projectId = row.projectId
      console.log(this.form);
    },
    /* 新增 */
    addItem () {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.title = "新增";
      this.dialogVisible = true;
      this.form = {};
      this.$nextTick(() => {
        this.$refs.fileUpload.reset();
      });
    },
    /* 删除 */
    delete (row) {
      console.log(row);
      if (row.oid) {
        this.$confirm('确定要删除该类型吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$axios.delete('tdm/ExperimentalBasis/del', {
            params: {
              oid: row.oid
            }
          }).then((res) => {
            this.$message.success('删除成功！')
            this.$refs.InspectionProcess.refresh();
          }).catch((err) => {
            this.$message.error(err.msg)
          })
        })
      } else {
        return this.$message.warning('请选择要删除的类型!')
      }
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.InspectionProcess.refresh();
    },
    closeItem () {
      this.dialogVisible = false;
    },
    /* 保存 */
    save () {
      if (!this.form.fileId || this.form.fileId.length <= 0) {
        this.$message({
          type: "error",
          message: "请上传工艺文件",
        });
        return
      }
      this.$refs.form.validate((vali) => {
        if (vali) {
          if (this.title == '编辑') {
            let fildIsStrBj = this.form.fileId.toString()
            this.form.fileIds = fildIsStrBj
            console.log(this.form);
            this.$axios.post("/tdm/ExperimentalBasis/edit", this.form).then(res => {
              this.$message.success('修改成功!')
              this.dialogVisible = false;
              this.$refs.InspectionProcess.refresh();
              console.log(res);
            }).catch((err => {
              this.$message.error(err.msg)
            }))
          } else {
            let fildIsStr = this.form.fileId.toString()
            this.form.fileIds = fildIsStr
            console.log(this.form);
            this.$axios.put('tdm/ExperimentalBasis/add', this.form).then((res) => {
              this.$message.success('添加成功!')
              this.dialogVisible = false;
              this.$refs.InspectionProcess.refresh();
              console.log(res);
            }).catch((err) => {
              this.$message.error(err.msg)
            })
          }
        } else {
          this.$message({
            type: "error",
            message: "请按照要求将表单输入完整",
          });
        }
      });
    },
    closeDialog () {
      this.dialogVisible = false;
    },
    //文件上传成功回调
    handleAvatarSuccess (response, file, fileList) {
      console.log(response);
      console.log(file);
      console.log(fileList);
    }
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
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
