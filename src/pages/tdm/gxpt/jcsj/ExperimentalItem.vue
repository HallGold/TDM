<template>
  <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%">
    <ice-tree-grid load-url="/tdm/detectProjectCategory/tree?parentId=0" ref="iceGrid" label-prop="name" value-prop="oid" :lazy="false" parent-prop="categoryId" :data-url="'/tdm/detectProject/list'" :pagination="true" :query="query" :columns="columns" :operations="operations" :operationsWidth="400" :buttons="buttons" treeWidth="300px" grid-auto-refresh="true" @node-click="dataTree" exportTitle="实验项信息" :gridIndex="false">
      <div style="display: flex;justify-content:space-around" slot="prefix">
        <el-button icon="el-icon-circle-plus" type="text" style="color: #85ce61" @click="addNode">
          <span style="color: #222222">新增</span>
        </el-button>
        <el-button icon="el-icon-edit" type="text" style="color: #ebb563" @click="updateNode" :disabled="!curTreeNode.doEdit">
          <span style="color: #222222">编辑</span>
        </el-button>
        <el-button icon="el-icon-delete" type="text" style="color: red" @click="deleteDicType" :disabled="!curTreeNode.doEdit">
          <span style="color: #222222">删除</span>
        </el-button>
      </div>
    </ice-tree-grid>
    <!-- 树形结构新增 -->
    <ice-dialog :title="typeTitle" :visible.sync="dialogVisibleType" width="800px">
      <div class="titleName">{{ typeTitle }}</div>
      <div class="ice-container">
        <el-form :model="detectProjectCategory" label-position="right" class="conditon-bar" ref="TypeFormRef" :rules="formrules">
          <ice-grid-layout :columns="1" gutter="0px" :expandable="false">
            <el-row :gutter="40">
              <el-form-item label="分类名称:" label-width="100px" style="width: 100%" prop="name">
                <el-input placeholder="不超过20个字" v-model="detectProjectCategory.name" maxlength="20"></el-input>
              </el-form-item>
            </el-row>
            <el-row :gutter="40">
              <el-form-item label="描述:" label-width="100px" prop="desc" style="width: 100%">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="detectProjectCategory.desc">
                </el-input>
              </el-form-item>
            </el-row>
          </ice-grid-layout>
        </el-form>
      </div>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="saveType">保存</el-button>
        <el-button type="info" size="medium" @click="closeDialogType">取消</el-button>
      </div>
    </ice-dialog>
    <!-- 新增编辑表单 -->
    <ice-dialog :title="dicTitle" :visible.sync="dialogVisible" width="1200px">
      <div class="titleName">{{ dicTitle }}</div>
      <el-form ref="form" :model="dicDataForm" label-width="120px" :rules="dicDataFormRules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="实验项目名称:" prop="projectName">
              <el-input v-model="dicDataForm.projectName" placeholder="请输入实验项目名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="实验标准:" prop="experimentStandard">
              <ice-single-upload v-model="dicDataForm.experimentStandard" ref="upload1" :on-success="experimentStandardSuccess" @change="experimentStandardChange" :do-secret="true">
              </ice-single-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="选择工艺文件:" prop="experimentCraftName">
              <el-input v-model="dicDataForm.experimentCraftName" placeholder="请选择工艺文件" readonly>
                <el-button slot="append" class="el-icon-edit-outline" @click="experimentCraftFocus"></el-button>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作规范:" prop="operatingSpecifications">
              <ice-single-upload v-model="dicDataForm.operatingSpecifications" ref="upload2" :on-success="operatingSpecificationsSuccess" @change="operatingSpecificationsChange" :do-secret="true">
              </ice-single-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="阈值:" prop="threshold">
              <el-input v-model="dicDataForm.threshold" placeholder="请输入阈值"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="样品要求:" style="width:100%" prop="sampleRequirements">
              <el-input type="textarea" v-model="dicDataForm.sampleRequirements" placeholder="请输入样品要求"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注:" style="width:100%">
              <el-input type="textarea" v-model="dicDataForm.remarks"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="save">保存</el-button>
        <el-button type="info" size="medium" @click="closeDialog">取消</el-button>
      </div>
    </ice-dialog>

    <ice-dialog title="选择工艺文件" :visible.sync="dialogCraftVisible" width="800">
      <div class="titleName">选择工艺文件</div>
      <ice-query-grid title="检测工艺" data-url="/tdm/craft/list" :pagination="true" :columns="craftColumns" ref="craft" :gridIndex="false" :operationsWidth="200" chooseItem="single" @selection-change="craftSelectionChange" :query="craftQuery"></ice-query-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="primary" size="medium" @click="craftSave">保存</el-button>
        <el-button type="info" size="medium" @click="closeCraftDialog">取消</el-button>
      </div>
    </ice-dialog>

    <ice-dialog title="查看工艺文件" :visible.sync="dialogGetCraftVisible" width="800">
      <div class="titleName">查看工艺文件</div>
      <ice-query-grid title="检测工艺" :gridData="craftData" :columns="getCraftColumns" ref="getCraft" :gridIndex="false" :operationsWidth="200" :operations="getCraftOperations" chooseItem="single"></ice-query-grid>
      <div class="ice-button-bar" slot="footer">
        <el-button type="info" size="medium" @click="closeGetCraftDialog">取消</el-button>
      </div>
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
  },
  data () {
    return {
      /*工艺文件*/
      craftQuery: [{ type: "input", label: "工艺名称", code: "searchText", value: "" },],
      craftColumns: [
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
          label: "上传时间",
          code: "updataDate",
          align: "center",
        },
        {
          label: "上传人",
          code: "userName",
          align: "center",
        },
      ],
      craft: {},
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
        { type: "input", label: "实验名称", code: "searchTerm", value: "" },
        { type: "static", label: "全部查询", code: "isAll", value: 1 },
      ],
      columns: [
        {
          label: "实验项",
          code: "projectName",

          align: "center",
        },
        {
          label: "实验项分类",
          code: "experimentCategoryName",
          align: "center",

        },
        {
          label: "样品要求",
          code: "sampleRequirements",

          align: "center",
        },
        { label: "阈值", code: "threshold", align: "center" },
        { label: "备注", code: "remarks", align: "center" },
        {
          label: "启用状态",
          code: "status",

          align: "center",
          formatter (row) {
            if (row.status == 0) {
              return "禁用";
            }
            return "已启用";
          },
        },
      ],
      operations: [
        {
          name: "查看工艺文件",
          callback: this.viewCraft,
          isShow: (row) => {
            return row.experimentStandard != null;
          },
        },
        {
          name: "编辑",
          callback: this.updateItem,
        },
        {
          name: "禁用",
          callback: this.isDisable,
          isShow: (row) => {
            return row.status == 1;
          },
        },
        {
          name: "启用",
          callback: this.isDisable,
          isShow: (row) => {
            return row.status == 0;
          },
        },
        {
          name: "删除",
          callback: this.deleteItem,
        },
        {
          name: "下载实验标准",
          callback: this.standarDownloadFile,
          isShow: (row) => {
            return row.experimentStandard != null;
          },
        },
        {
          name: "下载操作规范",
          callback: this.operatingSpecificationsDownloadFile,
          isShow: (row) => {
            return row.operatingSpecifications != null;
          },
        },
      ],
      buttons: [
        {
          name: "新增实验项",
          icon: "el-icon-plus",
          type: "primary",
          ctrlCode: "BTJ",
          callback: this.addItem,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.ManualRefresh,
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
      dialogVisibleType: false,
      /* 详情 */
      DetailsVisible: false,
      dialogCraftVisible: false,
      dialogGetCraftVisible: false,
      nodeType: "",
      curTreeNode: {
        doEdit: false,
      },
      isUpData: false,
      isUpDataValue: false,
      funCode: "",
      isLook: false,
      dicTitle: "",
      typeTitle: "",
      /* 新增表单数据 */
      dicDataForm: {
        projectName: "" /*检测项目名称*/,
        experimentCategory: "" /*检测项目分类*/,
        experimentStandard: "" /*实验标准*/,
        operatingSpecifications: "" /*操作规范*/,
        sampleRequirements: "" /*样品要求*/,
        threshold: "" /*阈值*/,
        remarks: "" /*备注*/,
        experimentCraft: "",
        experimentCraftName: ""
      },
      /* 树形新增验证 */
      formrules: {
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      /* 表单验证规则 */
      dicDataFormRules: {
        projectName: [
          { required: true, message: "请输入检测项目名称", trigger: "blur" },
        ],
        experimentStandard: [
          { required: true, message: "请上传实验标准", trigger: "change" },
        ],
        operatingSpecifications: [
          { required: true, message: "请上传操作规范", trigger: "change" },
        ],
        sampleRequirements: [
          { required: true, message: "请输入样品要求", trigger: "blur" },
        ],
        threshold: [
          { required: false, message: "请输入阈值", trigger: "blur" },
        ],
        experimentCraftName: [
          { required: true, message: "请选择工艺文件", trigger: "change" },
        ]
      },
      /* 树形结构表单数据*/
      detectProjectCategory: {
        name: "",
        desc: "",
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
    };
  },
  methods: {
    downloadCraft (row) {
      this.downloadFile(row.oid);
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
    //工艺文件选择
    craftSelectionChange (data) {
      this.craft = data[0];
    },
    //工艺文件保存
    craftSave () {
      this.dicDataForm.experimentCraft = this.craft.oid;
      this.dicDataForm.experimentCraftName = this.craft.name;
      this.dialogCraftVisible = false;
    },
    //关闭工艺文件选择弹窗
    closeCraftDialog () {
      this.dialogCraftVisible = false;
    },
    //打开工艺文件选择弹窗
    experimentCraftFocus () {
      this.dialogCraftVisible = true
    },
    /*下载实验标准*/
    standarDownloadFile (row) {
      this.downloadFile(row.experimentStandard);
    },
    /*下载操作规范*/
    operatingSpecificationsDownloadFile (row) {
      this.downloadFile(row.operatingSpecifications);
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
    dataTree (row, node) {
      this.nodeType = row;
      this.$nextTick(() => {
        let obj = node;
        this.curTreeNode = obj.data;
        console.log(this.curTreeNode);
        this.curTreeNode.doEdit = true;
      });
    },
    /*操作规范上传成功回调*/
    operatingSpecificationsSuccess (result, data) {
      if (result.code == 1) {
        this.dicDataForm.operatingSpecifications = result.data;
      }
    },
    /*操作规范文件选择*/
    operatingSpecificationsChange (data, dd) { },
    /*实验标准上传成功回调*/
    experimentStandardSuccess (result, data) {
      if (result.code == 1) {
        this.dicDataForm.experimentStandard = result.data;
      }
    },
    /*实验标准文件选择*/
    experimentStandardChange (data, dd) { },
    /*启用/禁用*/
    isDisable (row) {
      let status = 0;
      if (row.status == 0) {
        status = 1;
      }
      let param = { id: row.id, status: status };
      console.log("param", param);
      this.$axios
        .post("/tdm/detectProject/isDisable", param)
        .then((result) => {
          console.log("result", result);
          if ((result.status = 200)) {
            this.$message.success("成功");
          } else {
            this.$message.success(result.statusText);
          }
          this.$refs.iceGrid.$refs.queryGrid.refresh();
        })
        .catch((error) => {
          this.$message.error("失败！");
        })
        .finally((_) => { });
    },
    /**新增检测项*/
    addItem () {
      if (this.nodeType == 0) {
        this.$message({
          message: "该节点为根节点，不可添加字典值",
          type: "warning",
        });
      } else {
        if (this.$refs.form) {
          this.$refs.form.resetFields();
        }

        this.dicTitle = '添加实验项'
        this.isLook = true;
        this.isUpDataValue = false;
        this.dicDataForm = {};
        this.dialogVisible = true;
        if (this.$refs.upload1) {
          this.$refs.upload1.reset();
        }
        if (this.$refs.upload2) {
          this.$refs.upload2.reset();
        }
      }
    },
    /*编辑检测项*/
    updateItem (row) {
      this.dicTitle = '编辑实验项'
      if (this.$refs.upload1) {
        this.$refs.upload1.reset();
      }
      if (this.$refs.upload2) {
        this.$refs.upload2.reset();
      }
      this.dicDataForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }

    },
    /**树形结构新增*/
    addNode () {
      if (this.$refs.TypeFormRef) {
        this.$refs.TypeFormRef.resetFields()
      }
      this.typeTitle = "添加实验项目";
      this.detectProjectCategory.name = "";
      this.detectProjectCategory.desc = "";
      this.detectProjectCategory.oid = "";
      this.dialogVisibleType = true;
      this.isUpData = false;
      this.funCode = "";
    },
    /*校验字典编码是否重复*/
    checkDicCodeUnique () { },
    /**编辑树形结构*/
    updateNode () {
      this.dialogVisibleType = true;
      this.typeTitle = '编辑实验项目'
      console.log(this.curTreeNode);
      this.detectProjectCategory.name = this.curTreeNode.name;
      this.detectProjectCategory.desc = this.curTreeNode.description;
      this.detectProjectCategory.oid = this.curTreeNode.oid;
      this.detectProjectCategory.parentId = this.curTreeNode.parentId;
      console.log(this.detectProjectCategory);
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
          .delete("/tdm/detectProjectCategory/delete", { params: param })
          .then((result) => {
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.$refs.iceGrid.$refs.tree.refresh();
          })
          .catch((error) => {
            this.$message.error("删除失败!" + error.msg);
          })
          .finally((_) => { });
      });
    },
    /**同步*/
    asyncItem () {
      this.$axios
        .put("/permission/dataDictionary/syn_data_dictionary")
        .then((success) => {
          this.$message.success("同步成功");
          this.$refs.iceGrid.$refs.queryGrid.refresh();
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.msg,
          });
        });
    },
    /**删除字典值*/
    deleteItem (row) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        let param = { id: row.id };
        console.log("param", param);
        this.$axios
          .delete("/tdm/detectProject/delete", { params: param })
          .then((result) => {
            console.log("result", result);
            if ((result.status = 200)) {
              this.$message.success("删除成功");
            } else {
              this.$message.success(result.statusText);
            }
            this.$refs.iceGrid.$refs.queryGrid.refresh();
          })
          .catch((error) => {
            this.$message.error("删除失败！");
          })
          .finally((_) => { });
      });
    },
    /**新增下拉需要的值*/
    addDetailItem () {
      this.detailGridData.push({
        name: "",
        code: "",
        value: "",
        enabled: 1,
        remark: "",
      });
    },
    /**删除下拉的值*/
    deleteDetailItem (index) {
      this.detailGridData.splice(index, 1);
    },
    /**此方法为替换，用于上移或下移操作*/
    swapArray (arr, index1, index2) {
      arr[index1] = arr.splice(index2, 1, arr[index1])[0];
      return arr;
    },
    /**上移*/
    moveup (index) {
      if (index != 0) {
        this.detailGridData = this.swapArray(
          this.detailGridData,
          index,
          index - 1
        );
      }
    },
    /**下移*/
    movedown (index) {
      if (index + 1 != this.detailGridData.length) {
        this.detailGridData = this.swapArray(
          this.detailGridData,
          index,
          index + 1
        );
      }
    },
    /**添加/编辑检测项*/
    save () {
      this.$refs.form.validate((vali) => {
        if (vali) {
          if (
            this.dicDataForm.id != null &&
            this.dicDataForm.id != "" &&
            this.dicDataForm.id != undefined
          ) {
            this.$axios
              .post("/tdm/detectProject/update", this.dicDataForm)
              .then((result) => {
                if ((result.status = 200)) {
                  this.$message.success("编辑成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.dialogVisible = false;
                this.$refs.iceGrid.$refs.queryGrid.refresh();
              })
              .catch((error) => {
                this.$message.error("编辑失败！");
              })
              .finally((_) => { });
          } else {
            //设置检测分类
            this.dicDataForm.experimentCategory = this.curTreeNode.oid;
            this.$axios
              .put("/tdm/detectProject/add", this.dicDataForm)
              .then((result) => {
                console.log("result", result);
                if ((result.status = 200)) {
                  this.$message.success("添加成功");
                } else {
                  this.$message.success(result.statusText);
                }
                this.dialogVisible = false;
                this.$refs.iceGrid.$refs.queryGrid.refresh();
              })
              .catch((error) => {
                this.$message.error("添加失败！");
              })
              .finally((_) => { });
          }
        } else {
          this.$message.error('表单信息请填写完整')
        }
      })

    },
    /**新增与编辑树形结构的保存*/
    saveType () {
      this.$refs.TypeFormRef.validate(vali => {
        if (vali) {
          if (!this.detectProjectCategory.oid) {
            //判断父节点
            if (!this.nodeType) {
              this.detectProjectCategory.parentId = "0";
            } else {
              this.detectProjectCategory.parentId = this.nodeType;
            }
            this.$axios
              .put("/tdm/detectProjectCategory/add", this.detectProjectCategory)
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
              .post("/tdm/detectProjectCategory/edit", this.detectProjectCategory)
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
        } else {
          this.$message.error("请输入分类名称")
        }
      })

    },
    /**关闭表单弹窗*/
    closeDialog () {
      this.dialogVisible = false;
    },
    /**关闭树形结构弹窗*/
    closeDialogType () {
      this.dialogVisibleType = false;
    },
    ManualRefresh () {
      this.$refs.iceGrid.$refs.queryGrid.refresh();
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
.SelectDate {
  display: flex;
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