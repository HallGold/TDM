<template>
  <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
    <ice-tree-grid load-url="/tdm/TdmEquipmentCategory/tree?parentId=0"
                   ref="iceGrid"
                   label-prop="typeName"
                   value-prop="oid"
                   :lazy="false"
                   parent-prop="classification"
                   :data-url="'/tdm/equipment/equipmentModelList'"
                   :pagination="true"
                   :query="query"
                   :columns="columns"
                   :operations="operations"
                   :operationsWidth="400"
                   :gridIndex="true"
                   :buttons="buttons"
                   treeWidth="300px"
                   grid-auto-refresh="true"
                   @node-click="dataTree"
                   exportTitle="设备型号信息"
                   :operations-width="140">
      <div style="display: flex;justify-content:space-around"
           slot="prefix">
        <el-button icon="el-icon-circle-plus"
                   type="text"
                   style="color: #85ce61"
                   @click="addNode">
          <span style="color: #222222">新增</span>
        </el-button>
        <el-button icon="el-icon-edit"
                   type="text"
                   style="color: #ebb563"
                   @click="updateNode"
                   :disabled="!curTreeNode.doEdit">
          <span style="color: #222222">编辑</span>
        </el-button>
        <el-button icon="el-icon-delete"
                   type="text"
                   style="color: red"
                   @click="deleteDicType"
                   :disabled="!curTreeNode.doEdit">
          <span style="color: #222222">删除</span>
        </el-button>
      </div>
    </ice-tree-grid>
    <!-- 树形结构新增 -->
    <ice-dialog :title="typeTitle"
                :visible.sync="dialogVisibleType"
                width="800px">
      <div class="titleName">{{ typeTitle }}</div>
      <div class="ice-container">
        <el-form :model="detectProjectCategory"
                 label-position="right"
                 class="conditon-bar"
                 ref="form"
                 :rules="rules">
          <ice-grid-layout :columns="1"
                           gutter="0px"
                           :expandable="false">
            <el-row :gutter="40">
              <el-form-item label="设备分类名称:"
                            label-width="120px"
                            prop="typeName"
                            style="width: 100%">
                <el-input placeholder="不超过20个字"
                          v-model="detectProjectCategory.typeName"
                          maxlength="20"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="40">
              <el-form-item label="描述:"
                            label-width="120px"
                            style="width: 100%">
                <el-input type="textarea"
                          :rows="3"
                          placeholder="请输入内容"
                          v-model="detectProjectCategory.description">
                </el-input>
              </el-form-item>
            </el-row>
          </ice-grid-layout>
        </el-form>
      </div>
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="saveType">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialogType">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 新增表单 -->
    <ice-dialog :title="dicTitle"
                :visible.sync="dialogVisible"
                width="1000px">
      <div class="titleName">{{ dicTitle }}</div>
      <el-form ref="formRefs"
               :model="dicDataForm"
               label-width="120px"
               class="formList"
               :rules="rulesRef">
        <!--                <el-row :gutter="40">-->
        <!--                    <div class="uploda-box">-->
        <!--                        <ice-image-uploader v-model="dicDataForm.image"-->
        <!--                                            class="avatar-uploader"></ice-image-uploader>-->
        <!--                    </div>-->
        <!--                </el-row>-->
        <el-form-item label="设备图片:"
                      prop="image">
          <ice-image-uploader v-model="dicDataForm.image"
                              class="avatar-uploader"></ice-image-uploader>
        </el-form-item>
        <el-form-item label="设备名称:"
                      prop="name">
          <el-input v-model="dicDataForm.name"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="设备型号:"
                      prop="model">
          <el-input v-model="dicDataForm.model"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="样品要求:"
                      prop="sampleClaim">
          <el-input v-model="dicDataForm.sampleClaim"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="覆盖检测领域:"
                      prop="coveredRealm">
          <el-input v-model="dicDataForm.coveredRealm"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="操作规范:"
                      prop="specification">
          <ice-single-upload v-model="dicDataForm.specification"
                             :on-success="specificationSuccess"
                             :do-secret="true"
                             ref="upload1">
          </ice-single-upload>
        </el-form-item>
        <el-form-item label="安全制度:"
                      prop="secureDiscipline">
          <ice-single-upload v-model="dicDataForm.secureDiscipline"
                             :on-success="secureDisciplineSuccess"
                             :do-secret="true"
                             ref="upload2">
          </ice-single-upload>
        </el-form-item>
      </el-form>
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

    <!--    导入-->
    <ice-dialog title="设备型号导入"
                :visible.sync="visibleImport"
                width="500px">
      <ice-excel-uploader @uploadSuccess="uploadSuccess"
                          service="tdmEquipmentModelExcelService"
                          module="tdm"></ice-excel-uploader>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import IceEditableTable from "@/components/common/base/IceEditableTable";
import IceEditableTableColumn from "@/components/common/base/IceEditableTableColumn";
import IceSelect from "@/components/common/base/IceSelect";
import IceTreeGrid from "@/components/common/base/IceTreeGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceExcelUploader from "@/components/common/base/IceExcelUploader";
import Vue from "vue";
export default {
  name: "ExperimentalItem",
  components: {
    IceTreeGrid,
    IceSelect,
    IceEditableTableColumn,
    IceEditableTable,
    IceGridLayout,
    IceQueryGrid,
    IceDialog,
    IceExcelUploader
  },
  data () {
    return {
      /*查询字段*/
      query: [
        { type: "input", label: "设备名称", code: "searchText", value: "" },
      ],
      /*展示字段*/
      columns: [
        { label: "设备名称", code: "name", width: 120, align: "center" },
        {
          label: "设备图片",
          code: "image",
          align: "center",
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
        { label: "设备型号", code: "model", width: 120, align: "center" },
        { label: "样品要求", code: "sampleClaim", width: 120, align: "center" },
        {
          label: "覆盖检测领域",
          code: "coveredRealm",
          width: 120,
          align: "center",
        },
      ],
      operations: [
        {
          name: "编辑",
          callback: this.updateItem,
          /* isShow: (row) => {
                          return row.doEdit && this.curTreeNode.doEdit;
                        }, */
        },
        {
          name: "删除",
          callback: this.deleteItem,
        },
        {
          name: "下载安全制度",
          callback: this.standarDownloadFile,
          isShow: (row) => {
            if (row.secureDiscipline) {
              return true;
            }
            return false;
          },
        },
        {
          name: "下载操作规范",
          callback: this.operatingSpecificationsDownloadFile,
          isShow: (row) => {
            if (row.specification) {
              return true;
            }
            return false;
          },
        },
      ],
      buttons: [
        {
          name: "新增设备",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
        },
        {
          name: '导入',
          icon: 'el-icon-upload2',
          size: 'mini',
          callback: this.handleImport
        },
        { name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export' },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refreshTable,
        },
      ],
      dialogVisible: false,
      dialogVisibleType: false,

      /*导入*/
      visibleImport: false,

      /* 详情 */
      DetailsVisible: false,
      nodeType: "",
      curTreeNode: {
        doEdit: false,
      },
      isUpData: false,
      isUpDataValue: false,
      funCode: "",
      isLook: false,
      dicTitle: "",
      typeTitle: " 添加设备分类",
      /* 新增表单数据 */
      dicDataForm: {
        oid: "",
        name: "",
        image: "",
        model: "",
        classification: "",
        sampleClaim: "",
        coveredRealm: "",
        specification: "",
        secureDiscipline: "",
      },
      /* 树形结构表单数据*/
      detectProjectCategory: {
        typeName: "",
        description: "",
        oid: "",
      },
      options: [
        {
          value: "1",
          label: "文档类型",
        },
        {
          value: "2",
          label: "文档格式",
        },
      ],
      /* 树形表单验证 */
      rules: {
        typeName: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
      },
      /* 添加和编辑表单验证 */
      rulesRef: {
        image: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
        model: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
        sampleClaim: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
        coveredRealm: [
          { required: true, message: '请填写完整!', trigger: 'blur' },
        ],
        specification: [
          { required: true, message: '请上传文件!', trigger: 'blur' },
        ],
        secureDiscipline: [
          { required: true, message: '请上传文件', trigger: 'blur' },
        ],
      }
    };
  },
  methods: {
    uploadSuccess () {
      this.refreshTable();
      this.visibleImport = false;
    },
    /*导入弹窗打开*/
    handleImport () {
      this.visibleImport = true;
    },

    /*刷新table*/
    refreshTable () {
      this.$refs.iceGrid.$refs.queryGrid.refresh();
    },
    /*下载安全规范*/
    standarDownloadFile (row) {
      this.downloadFile(row.secureDiscipline);
    },
    /*下载操作规范*/
    operatingSpecificationsDownloadFile (row) {
      this.downloadFile(row.specification);
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
    closeItem () {
      this.dialogVisibleType = false;
    },
    /**树形节点获取*/
    dataTree (row) {
      this.nodeType = row;
      this.$nextTick(() => {
        let obj = this.$refs.iceGrid.$refs.tree.getNode(row);
        this.curTreeNode = obj.data;
        this.curTreeNode.doEdit = true;
      });
    },
    /*操作规范上传成功回调*/
    specificationSuccess (result, data) {
      if (result.code == 1) {
        this.dicDataForm.specification = result.data;
      }
    },
    /*安全制度上传成功回调*/
    secureDisciplineSuccess (result, data) {
      if (result.code == 1) {
        this.dicDataForm.secureDiscipline = result.data;
      }
    },
    /**新增检测项*/
    addItem () {
      this.dicTitle = "新增设备";
      this.refreshDataFrom();
      this.isLook = true;
      this.isUpDataValue = false;
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.formRefs.resetFields()
      }
    },
    /*编辑检测项*/
    updateItem (row) {
      this.dicTitle = "编辑设备";
      this.refreshDataFrom();
      this.dicDataForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.formRefs.resetFields()
      }
    },
    /*刷新表单*/
    refreshDataFrom () {
      this.dicDataForm = {};
      if (this.$refs.upload1) {
        this.$refs.upload1.reset();
      }
      if (this.$refs.upload2) {
        this.$refs.upload2.reset();
      }
    },
    /**树形结构新增*/
    addNode () {
      this.typeTitle = "添加设备分类";
      this.detectProjectCategory = {};
      this.dialogVisibleType = true;
      this.isUpData = false;
      this.funCode = "";
    },
    /*校验字典编码是否重复*/
    checkDicCodeUnique () { },
    /**编辑树形结构*/
    updateNode () {
      this.typeTitle = "编辑设备分类";
      console.log(this.curTreeNode);
      this.dialogVisibleType = true;
      this.detectProjectCategory = this.curTreeNode;
    },
    /*删除树形结构*/
    deleteDicType () {
      let param = { id: this.curTreeNode.oid };
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("/tdm/TdmEquipmentCategory/delete", { params: param })
          .then((result) => {
            console.log("result", result);
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.$refs.iceGrid.$refs.tree.refresh();
          })
          .catch((error) => {
            this.$message.error("删除失败！");
          })
          .finally((_) => { });
      });
    },
    /**添加/编辑检测项*/
    save () {
      console.log("dicDataForm", this.dicDataForm);
      this.$refs.formRefs.validate(vali => {
        if (vali) {
          if (this.dicDataForm.oid && this.dicDataForm.oid != "") {
            this.$axios
              .post("/tdm/equipment/editEquipmentModel", this.dicDataForm)
              .then((result) => {
                if ((result.status = 200)) {
                  this.$message.success("编辑成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.dialogVisible = false;
                this.refreshTable();
              })
              .catch((error) => {
                this.$message.error(error.msg);
              });
          } else {
            this.dicDataForm.classification = this.nodeType;
            this.$axios
              .put("/tdm/equipment/addEquipmentModel", this.dicDataForm)
              .then((result) => {
                if ((result.status = 200)) {
                  this.$message.success("添加成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.dialogVisible = false;
                this.refreshTable();
              })
              .catch((error) => {
                this.$message.error(error.msg);
              });
          }
        }

      });

    },
    /**新增与编辑树形结构的保存*/
    saveType () {
      if (!this.detectProjectCategory.oid) {
        //判断父节点
        if (!this.nodeType) {
          this.detectProjectCategory.parentId = "0";
        } else {
          this.detectProjectCategory.parentId = this.nodeType;
        }
        this.$axios
          .put("/tdm/TdmEquipmentCategory/add", this.detectProjectCategory)
          .then((result) => {
            console.log("result", result);
            if ((result.status = 200)) {
              this.$message.success("添加成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.dialogVisibleType = false;
            this.$refs.iceGrid.$refs.tree.refresh();
          })
          .catch((error) => {
            this.$message.error("添加失败！");
          })
          .finally((_) => { });
      } else {
        this.detectProjectCategory.description = this.detectProjectCategory.desc;
        this.$axios
          .post("/tdm/TdmEquipmentCategory/edit", this.detectProjectCategory)
          .then((result) => {
            console.log("result", result);
            if ((result.status = 200)) {
              this.$message.success("编辑成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.dialogVisibleType = false;
            this.$refs.iceGrid.$refs.tree.refresh();
          })
          .catch((error) => {
            this.$message.error("编辑失败！");
          })
          .finally((_) => { });
      }
    },
    /**关闭表单弹窗*/
    closeDialog () {
      this.dialogVisible = false;
    },
    /**关闭树形结构弹窗*/
    closeDialogType () {
      this.dialogVisibleType = false;
    },
    /*删除设备型号*/
    deleteItem (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        this.$axios
          .delete("/tdm/equipment/delEquipmentModel", {
            params: { modelId: row.oid },
          })
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.dialogVisible = false;
            this.refreshTable();
          })
          .catch((error) => {
            this.$message.error("删除失败！");
          });
      });
    },
  },
};
</script>
<style lang="less" scoped>
.headers {
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
.SelectDate {
  display: flex;
}
.ice-image-upload {
  top: 0;
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
