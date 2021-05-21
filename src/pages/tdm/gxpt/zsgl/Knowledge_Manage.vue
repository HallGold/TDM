<template>
  <div class="content-filled">
    <ice-tree-grid load-url="/tdm/TdmDocumentCategory/tree"
                   ref="iceGrid"
                   label-prop="name"
                   childrenProp="child"
                   value-prop="oid"
                   :lazy="false"
                   @node-click="dataTree"
                   :data-url="'tdm/TdmKnowledge/tree'"
                   :gridAutoRefresh="false"
                   :pagination="true"
                   :gridIndex="false"
                   :query="query"
                   :columns="columns"
                   :buttons="buttons"
                   :operations="operations"
                   :operationsWidth="50"
                   chooseItem="multiple"
                   @selection-change="selectionChange">
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
                   @click="updateNode">
          <span style="color: #222222">编辑</span>
        </el-button>
        <el-button icon="el-icon-delete"
                   type="text"
                   style="color: red"
                   @click="deleteNode">
          <span style="color: #222222">删除</span>
        </el-button>
      </div>
    </ice-tree-grid>
    <!-- 树形结构新增 -->
    <el-dialog v-dialog-drag
               :title="treeTitle"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :before-close="closeDialog"
               :close-on-click-modal="false">
      <el-form :model="treeFormData"
               :rules="treeFormRules"
               ref="form"
               label-width="100px"
               style="margin-top: 15px">
        <el-row :gutter="60">
          <el-col :span="12">
            <el-form-item label="菜单名称"
                          prop="name"
                          style="width:100%">
              <el-input v-model="treeFormData.name"
                        @input="tblgroupNameChanged"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单编码"
                          prop="tblgroupCode"
                          style="width:100%">
              <el-input v-model="treeFormData.tblgroupCode"
                        :disabled="isUpData"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="使用状态"
                          style="width:100%">
              <el-switch v-model="treeFormData.status"
                         inactive-text="禁用"
                         active-text="启用"
                         active-value="1"
                         inactive-value="0"
                         @change="switchChange">
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="ice-button-bar">
        <el-button type="primary"
                   @click="save">保存</el-button>
        <el-button type="info"
                   @click="closeDialog">取消</el-button>
      </div>
    </el-dialog>
    <!-- 表单上传 -->
    <el-dialog v-dialog-drag
               :title="title"
               custom-class="ice-dialog"
               center
               :visible.sync="UploadVisible"
               width="800px"
               append-to-body
               :before-close="closeUpload"
               :close-on-click-modal="false"
               ref="UploadRef">
      <el-form ref="Uploadform"
               :model="dicDataForm"
               label-width="120px"
               :rules="dicDataFormRules"
               class="formList">
        <el-form-item label="文件上传:">
          <ice-single-upload v-model="dicDataForm.experimentStandard"
                             :on-success="experimentStandardSuccess"
                             :do-secret="true"
                             ref="fileUpload">
          </ice-single-upload>
        </el-form-item>
        <el-form-item label="文件名称:"
                      prop="fileName">
          <el-input v-model="dicDataForm.fileName"
                    placeholder="请输入内容"></el-input>
        </el-form-item>
        <el-form-item label="文件大小:">
          <span :v-model="dicDataForm.fileSize">{{
            dicDataForm.fileSize
          }}</span>
        </el-form-item>
        <el-form-item label="文件格式:">
          <span :v-model="dicDataForm.fileFormat">{{
            dicDataForm.fileFormat
          }}</span>
        </el-form-item>
        <el-form-item label="标签:">
          <el-select v-model="dicDataForm.selectData"
                     multiple
                     placeholder="请选择"
                     @change="changeSelect">
            <el-option v-for="item in options"
                       :key="item.oid"
                       :label="item.tagName"
                       :value="item.oid">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="ice-button-bar">
        <el-button type="primary"
                   @click="saveUpload">保存</el-button>
        <el-button type="info"
                   @click="closeUpload">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IceTreeGrid from "@/components/common/base/IceTreeGrid";
import IceDialog from "@/components/common/base/IceDialog";
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceSingleUpload from "@/components/common/base/IceSingleUpload";
import pinyin4js from "pinyin4js";
import Vue from "vue";

export default {
  name: "Knowledge_Manage",
  components: { IceTreeGrid, IceDialog, IceQueryGrid, IceSingleUpload },
  data () {
    return {
      query: [], //组件查询
      columns: [
        { code: "oid", hidden: true },
        {
          label: "类型",
          code: "fileType",
          width: 80,
          align: "center",
          renderCell: (h, data) => {
            // console.log(data.row.fileFormat, '============================');
            if (this.iconsUrl[data.row.fileFormat]) {
              return <img src={this.iconsUrl[data.row.fileFormat]} width="22px" height="22px" />;
            } else {
              return <img src={this.iconsUrl.ty} width="22px" height="22px" />;
            }
          },
        },
        {
          label: "文档名称",
          code: "fileName",
          width: 280,
          showTips: true,
          align: "center",
        },
        { label: "标签", code: "tagName", width: 280, align: "center" },
        {
          label: "作者",
          code: "uploadUserName",
          width: 280,
          align: "center",
        },
        {
          label: "下载数量",
          code: "downloadNumber",
          width: 280,
          align: "center",
        },
      ], //组件table列展示
      /* 图标 */
      iconsUrl: {
        jpg: "../tdm/static/icon/tp.png",
        png: '../tdm/static/icon/tp.png',
        doc: '../tdm/static/icon/word.png',
        docx: '../tdm/static/icon/word.png',
        xls: '../tdm/static/icon/excel.png',
        xlsx: '../tdm/static/icon/excel.png',
        mp4: '../tdm/static/icon/mp4.png',
        mp3: '../tdm/static/icon/mp3.png',
        xml: '../tdm/static/icon/xml.png',
        txt: '../tdm/static/icon/txt.png',
        ty: '../tdm/static/icon/qita.png',
      },
      buttons: [], //组件按钮
      operations: [], //组件table列按钮
      title: "",
      isEdit: false,
      groupId: "", //用于根据左边树形的类型来获取右边列表数据的参数
      isUpData: false, //是否为编辑状态
      dialogVisible: false,
      UploadVisible: false,
      treeTitle: "",
      parentTblgroupId: "",
      deleteid: "",
      treeFormData: {
        //树形表单对象
        name: "",
        tblgroupCode: "",
        status: "1",
      },
      /* 标签数据 */
      options: [],
      /* 操作栏 */
      operations: [
        {
          name: "删除",
          callback: this.deleteList,
        },
      ],
      /* 新增表单数据 */
      dicDataForm: {
        experimentStandard: "" /* 上传文件 */,
        fileName: "" /*文件名称*/,
        fileFormat: "" /* 文件格式 */,
        fileSize: "" /* 文件大小 */,
        fileType: "" /* 树形节点当前ID */,
        parentNodeId: "" /* 上级分类ID */,
        tag: [] /* 标签 */,
      },
      /* 树形结构新增验证 */
      treeFormRules: {
        //树形表单字段规则
        name: [
          {
            required: true,
            whitespace: true,
            message: "请输入分类名称",
            trigger: "blur",
          },
        ],
        tblgroupCode: [
          {
            required: true,
            whitespace: true,
            message: "请输入分类编码",
            trigger: "blur",
          },
        ],
      },
      /* 上传表单验证 */
      dicDataFormRules: {
        //树形表单字段规则
        fileName: [
          {
            required: true,
            whitespace: true,
            message: "请输入文件名称",
            trigger: "blur",
          },
        ],
      },
      nodeData: {},
      /* 下载文件ID*/
      DownloadFileData: [],
      /* 下载数量ID */
      DownloadNumberData: [],
    };
  },
  methods: {
    tblgroupNameChanged (e) {
      this.treeFormData.tblgroupCode = pinyin4js
        .convertToPinyinString(e, "", pinyin4js.FIRST_LETTER)
        .toUpperCase();
    },
    /**
     * 表编辑后的网格数据刷新
     */
    isSuccess () {
      this.$refs.iceGrid.$refs.queryGrid.refresh();
    },
    /**
     * 保存
     */
    save () {
      console.log(this.treeFormData, 'this.treeFormData');
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (!this.isUpData) {
            // this.treeFormData.parentTblgroupId = this.groupId;
            // this.treeFormData.version = this.nodeData.version
            //   ? this.nodeData.version
            //   : "1";
            this.treeFormData.parentNodeId = this.nodeData.oid;
            this.treeFormData.sort = this.nodeData.version
              ? this.nodeData.version
              : "1";
          }
          /*  console.log(this.treeFormData, "===="); */
          this.$axios
            .put("tdm/TdmDocumentCategory/saveOrUpdate", this.treeFormData)
            .then((success) => {
              this.$message.success("保存成功");
              this.$refs.iceGrid.$refs.tree.refresh();
              this.dialogVisible = false;
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: error.msg,
              });
            });
        }
      });
    },
    /**
     * 取消
     */
    closeDialog () {
      this.resetForm();
      this.dialogVisible = false;
    },
    closeUpload () {
      this.UploadVisible = false;
    },
    resetForm () {
      this.$refs.form.resetFields();
    },

    /**
     * 点击树节点返回节点信息
     * @param data
     */
    dataTree (data, node) {
      this.groupId = data;
      this.nodeData = node.data;
      this.deleteid = node.data.oid;
      this.$refs.iceGrid.$refs.queryGrid.refresh();
    },
    /**
     * 树形节点--新增
     */
    addNode () {
      this.treeTitle = "新增";
      this.isUpData = false;
      if (this.groupId == "-1" || this.groupId) {
        this.treeFormData = {
          name: "",
          tblgroupCode: "",
          status: "1",
        };
        this.dialogVisible = true;
      } else {
        this.$message.warning("请选择节点");
      }
    },
    /**
     * 树形节点--编辑
     */
    updateNode () {
      this.treeTitle = "编辑";
      this.isUpData = true;
      if (this.groupId) {
        this.dialogVisible = true;
        let obj = {};
        Object.assign(obj, this.nodeData);
        this.$nextTick(() => {
          this.treeFormData = obj;
          this.treeFormData.status = "1";
          this.treeFormData.tblgroupCode = this.treeFormData.name;
          this.treeFormData.child = [];
        });
      } else {
        this.$message.warning("请选择要编辑的节点");
      }
    },
    /**
     * 树形节点--删除
     */
    deleteNode () {
      if (this.groupId) {
        this.$confirm("确定删除操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .delete("/tdm/TdmDocumentCategory/del", {
              params: { id: this.deleteid },
            })
            .then((success) => {
              this.$message.success("删除成功");
              this.$refs.iceGrid.$refs.tree.refresh();
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: error.msg ? error.msg : "操作出错了",
              });
            });
        });
      }
    },
    /**
     * 上传新增
     */
    add () {
      this.$nextTick(() => {
        this.$refs.fileUpload.reset();
        this.dicDataForm.fileName = "";
        this.dicDataForm.fileSize = "";
        this.dicDataForm.fileFormat = "";
        this.dicDataForm.selectData = "";
      });
      this.title = "上传文件";
      this.isEdit = false;
      if (this.groupId) {
        this.UploadVisible = true;
      } else {
        this.$message.warning("请选择节点");
      }
    },
    /* 上传保存 */
    saveUpload () {
      console.log(this.dicDataForm);
      this.$axios
        .put("tdm/TdmKnowledge/saveOrUpdate", this.dicDataForm)
        .then((success) => {
          console.log(success);
          this.$message.success("保存成功");
          this.UploadVisible = false;
          this.$refs.iceGrid.$refs.queryGrid.refresh();
        })
        .catch((err) => {
          this.$message({
            type: "error",
            message: error.msg,
          });
        });
    },
    /* 上传成功回调 */
    experimentStandardSuccess (row, data) {
      this.dicDataForm.fileName = data.raw.name;
      this.dicDataForm.fileSize = data.raw.size;
      this.dicDataForm.fileType = this.nodeData.oid;
      this.dicDataForm.fileFormat = data.raw.name.split('.')[1];
      console.log(this.dicDataForm.fileFormat);
      this.dicDataForm.parentNodeId = this.nodeData.parentNodeId;
      this.dicDataForm.sort = "1";
      this.dicDataForm.status = this.nodeData.status;
      this.dicDataForm.isDirectory = "0";
      this.dicDataForm.fileUrl = row.data;
    },
    /**
     * 初始化组件部分
     */
    initComponent () {
      this.query = [
        { type: "input", label: "搜索", code: "searchText", value: "" },
        {
          type: "static",
          code: "oid",
          label: "",
          value: () => {
            return this.groupId;
          },
        }, //定义高级模糊查询方法
      ];
      this.buttons = [
        { name: "上传文件", icon: "el-icon-upload2", callback: this.add },
        {
          icon: "el-icon-download",
          name: "下载文件",
          callback: this.DownloadFile,
        },
      ];
    },
    /**
     * 列表勾选的数据
     */
    selectionChange (rows) {
      let oids = [];
      let fileUrls = [];
      rows.forEach((e) => {
        oids.push(e.oid);
        fileUrls.push(e.fileUrl);
      });
      this.DownloadNumberData = oids;
      this.DownloadFileData = fileUrls;
    },
    /* 下载文件 */
    DownloadFile () {
      let NumberID = this.DownloadNumberData;
      let FileID = this.DownloadFileData;
      let newArr = FileID.map((FildID, i) => ({
        FildID,
        NumberID: NumberID[i],
      }));
      newArr.forEach((e) => {
        /* console.log(e.FildID);
        console.log(e.NumberID); */
        this.downloadFile(e.FildID, e.NumberID);
      });
    },
    /* 下载 */
    downloadFile (FileID, NumberID) {
      window.open(
        Vue.prototype.$apicontext +
        "resources/attachment/downloadById?id=" +
        FileID
      );
      this.$axios
        .post("tdm/TdmKnowledge/download", {
          id: NumberID,
        })
        .then((res) => {
          this.$refs.iceGrid.$refs.queryGrid.refresh();
        })
        .catch((err) => {
          this.$refs.iceGrid.$refs.queryGrid.refresh();
        });
    },
    /* 开关切换 */
    switchChange (row) {
      console.log(row);
    },
    /* 获取标签数据 */
    async getOptions () {
      let { data: res } = await this.$axios.get("tdm/TdmKnowledge/tags");
      this.options = res;
    },
    /* 下拉多选框回调 */
    changeSelect (row) {
      let newArr = [];
      newArr = row.map((item) => ({ oid: item }));
      this.dicDataForm.tag = newArr;
      console.log(this.dicDataForm.tag);
    },
    /* 删除表格 */
    deleteList (row) {
      if (row.oid) {
        this.$confirm("确定删除操作吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "info",
        }).then(() => {
          this.$axios
            .delete("/tdm/TdmKnowledge/del", {
              params: { id: row.oid },
            })
            .then((success) => {
              this.$message.success("删除成功");
              this.$refs.iceGrid.$refs.queryGrid.refresh();
            })
            .catch((error) => {
              this.$message({
                type: "error",
                message: error.msg ? error.msg : "操作出错了",
              });
            });
        });
      }
    },
  },
  created () {
    this.getOptions();
  },
  mounted () {
    this.initComponent();
  },
};
</script>

<style scoped>
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
</style>
