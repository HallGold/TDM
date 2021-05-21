<template>
  <div class="content-filled">
    <!--设备列表-->
    <ice-query-grid ref="equipmentIceGrid"
                    data-url="/tdm/equipment/getEquipmentList"
                    :query="query"
                    :columns="columns"
                    :buttons="buttons"
                    :pagination="true"
                    :operations="operations"
                    :operations-width="150"
                    :gridIndex="false"
                    exportTitle="设备信息"
                    chooseItem="single">
    </ice-query-grid>
    <!-- 新增和编辑弹框 -->
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
          <ice-grid-layout :name="title"
                           :columns="1"
                           :expandable="false">
            <el-form-item label="所属部门:"
                          label-width="100px"
                          prop="departmentName">
              <pms-select-tree ref="selectTree"
                               :isemptyBtn="isemptyBtn"
                               :showChecked="showChecked"
                               :unbrid="unbrid"
                               :treeData="treeData"
                               :transfer="transferTree.treeData"
                               :value="treeData.deptCode"
                               @handleCallback="departmentHandleCallback">
              </pms-select-tree>
            </el-form-item>
            <el-form-item label="设备负责人:"
                          label-width="100px"
                          prop="principal">
              <!--  <el-input placeholder="请选择设备名称"
                        maxlength="30"
                        v-model="mainDataForm.principal"
                        readonly>
                <el-button slot="append"
                           class="el-icon-edit-outline"
                           @click="principalfocus"></el-button>
              </el-input> -->
              <ice-persion-selector choose-item="single"
                                    ref="persionPop"
                                    v-model="mainDataForm.principal"
                                    @select-confirm="selectUserConfirm"></ice-persion-selector>
            </el-form-item>
            <el-form-item label="设备型号:"
                          label-width="100px"
                          prop="equipmentName">
              <el-input placeholder="请选择设备型号"
                        maxlength="30"
                        v-model="mainDataForm.equipmentName"
                        readonly>
                <el-button slot="append"
                           class="el-icon-edit-outline"
                           @click="modelfocus"></el-button>
              </el-input>
            </el-form-item>

            <el-form-item label="实验室:"
                          label-width="100px"
                          prop="laboratoryName">
              <el-input placeholder="请选择实验室"
                        maxlength="30"
                        v-model="mainDataForm.laboratoryName"
                        readonly>
                <el-button slot="append"
                           class="el-icon-edit-outline"
                           @click="laboratoryfocus">
                </el-button>
              </el-input>
            </el-form-item>
            <el-form-item label="设备ip:"
                          label-width="100px"
                          prop="ip">
              <el-input placeholder="请输入设备ip"
                        maxlength="30"
                        v-model="mainDataForm.ip"></el-input>
            </el-form-item>
            <el-form-item label="能否自主:"
                          label-width="100px"
                          prop="isAutonomous">
              <el-radio-group v-model="mainDataForm.isAutonomous">
                <el-radio :label="1"
                          border>可自主预约</el-radio>
                <el-radio :label="0"
                          border>不可自主预约</el-radio>
              </el-radio-group>
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

    <!--设备型号选择-->
    <ice-dialog v-dialogDrag
                title="选择设备型号"
                custom-class="ice-dialog"
                center
                :visible.sync="dialogModelFocus"
                width="900px"
                append-to-body
                :before-close="closedialogModelFocus">
      <div class="titleName">选择设备型号</div>
      <!--选择设备型号-->
      <ice-query-grid ref="iceGrid"
                      data-url="/tdm/equipment/equipmentModelList"
                      :query="modelQuery"
                      :columns="modelColumns"
                      :pagination="true"
                      :operations-width="150"
                      :gridIndex="false"
                      :tableCurrentChange="modelCurrentChange"
                      chooseItem="single">
      </ice-query-grid>
      <!--底部按钮-->
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="saveModel">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closedialogModelFocus">取消</el-button>
      </div>
    </ice-dialog>

    <!--人员选择-->
    <ice-dialog v-dialogDrag
                title="选择人员"
                custom-class="ice-dialog"
                center
                :visible.sync="dialogPrincipalFocus"
                width="900px"
                append-to-body
                :close-on-click-modal="false"
                :before-close="closeDialogPrincipal">
      <div class="titleName">选择人员</div>
      <!--选择人员选择-->
      <ice-query-grid ref="iceGrid"
                      data-url="/permission/user/users_by_condition"
                      :query="principalQuery"
                      :columns="principalColumns"
                      :pagination="true"
                      :operations-width="150"
                      :gridIndex="false"
                      :tableCurrentChange="principalCurrentChange"
                      chooseItem="single">
      </ice-query-grid>

      <!--底部按钮-->
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="savePrincipal">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialogPrincipal">取消</el-button>
      </div>
    </ice-dialog>

    <!--实验室选择-->
    <ice-dialog v-dialogDrag
                title="选择实验室"
                custom-class="ice-dialog"
                center
                :visible.sync="dialogLaboratoryFocus"
                width="900px"
                append-to-body
                :close-on-click-modal="false"
                :before-close="closeDialogLaboratory">
      <div class="titleName">选择实验室</div>
      <!--选择实验室-->
      <ice-query-grid ref="iceGrid"
                      data-url="/tdm/laboratory/list"
                      :query="laboratoryQuery"
                      :columns="laboratoryColumns"
                      :pagination="true"
                      :operations-width="150"
                      :gridIndex="false"
                      :tableCurrentChange="laboratoryCurrentChange"
                      chooseItem="single">
      </ice-query-grid>
      <!--底部按钮-->
      <div class="ice-button-bar"
           slot="footer">
        <el-button type="primary"
                   size="medium"
                   @click="saveLaboratory">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeDialogLaboratory">取消</el-button>
      </div>
    </ice-dialog>

    <!--    导入-->
    <ice-dialog title="设备导入"
                :visible.sync="visibleImport"
                width="500px">
      <ice-excel-uploader @uploadSuccess="uploadSuccess"
                          service="tdmEquipmentExcelService"
                          module="tdm"></ice-excel-uploader>
    </ice-dialog>

  </div>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceGridLayout from "@/components/common/base/IceGridLayout";
import IceImageUploader from "@/components/common/base/IceImageUpload";
import PmsSelectTree from "@/components/common/pms/PmsSelectTree";
import IceExcelUploader from "@/components/common/base/IceExcelUploader";
import IcePersionSelector from "@/components/common/biz/IcePersionSelector";

export default {
  name: "EquipmentManagement",
  components: { IceImageUploader, IceGridLayout, IceQueryGrid, PmsSelectTree, IceExcelUploader, IcePersionSelector },
  data () {
    return {
      /*部门*/
      showChecked: false,
      isemptyBtn: true,
      unbrid: true,
      transferTree: {
        treeData: {
          // 请求树接口地址
          api: "/tdm/laboratory/department",
          lazy: false,
          nodeKey: "deptCode",
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
        deptCode: "",
      },

      title: "",
      /*设备*/
      query: [
        {
          type: "input",
          label: "设备名称/设备编号",
          code: "searchText",
          value: "",
        },
      ],
      columns: [
        {
          label: "设备图片",
          code: "image",
          align: "center",
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
        { label: "设备名称", code: "equipmentName", align: "center", },
        { label: "设备型号", code: "model", align: "center" },
        { label: "设备编号", code: "equipmentNumber", align: "center" },
        { label: "设备类型", code: "classificationName", align: "center" },
        { label: "样品要求", code: "sampleClaim", align: "center" },
        { label: "覆盖检测领域", code: "coveredRealm", align: "center" },
        { label: "实验室", code: "laboratoryName", align: "center" },
        { label: "部门", code: "departmentName", align: "center" },
        { label: "设备IP", code: "ip", align: "center" },
        { label: "负责人", code: "principal", align: "center" },
        {
          label: "设备状态",
          code: "status"
          , align: "center",
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
      operations: [
        { name: "查看详情", callback: this.confItem },
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

      /*设备型号*/
      modelQuery: [
        { type: "input", label: "设备名称", code: "searchText", value: "" },
      ],
      modelColumns: [
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
      model1: null,

      /*人员信息*/
      principalQuery: [
        { type: "input", label: "姓名", code: "name", value: "" },
        { type: "input", label: "账号", code: "code", value: "" },
        { type: "static", label: "部门", code: "deptId", value: 1 },
        {
          type: "static",
          label: "负载禁用",
          code: "loadDisabled",
          value: true,
        },
        { type: "static", label: "已启用", code: "enabled", value: 2 },
        { type: "static", label: "已启用", code: "cascade", value: true },
      ],
      principalColumns: [
        { label: "账号", code: "code", align: "center" },
        { label: "姓名", code: "name", align: "center" },
        { label: "单位", code: "orgShortName", align: "center" },
        { label: "部门", code: "deptShortName", align: "center" },
        { label: "部门编号", code: "deptCode", align: "center" },
        { label: "联系电话", code: "landlineTel", align: "center" },
      ],
      principal: null,

      /*实验室信息*/
      laboratoryQuery: [
        { type: "input", label: "实验室名称", code: "searchTerm", value: "" },
      ],
      laboratoryColumns: [
        { label: "实验室名称", code: "laboratoryName", align: "center" },
        { label: "楼层", code: "floor", align: "center" },
        { label: "所属部门", code: "departmentName", align: "center" },
      ],
      laboratory: null,

      /*弹框*/
      dialogVisible: false,
      dialogModelFocus: false,
      dialogPrincipalFocus: false,
      dialogLaboratoryFocus: false,

      //设备表单数据
      mainDataForm: {
        equipmentName: "",
        principal: "",
        laboratoryName: "",
        ip: "",
        department: "",
        departmentName: "",
        isAutonomous: 1,
      },

      /*导入*/
      visibleImport: false,

      // 表单验证规则
      formRules: {
        equipmentName: [
          { required: true, message: "请选择设备型号", trigger: "change", },
        ],
        principal: [
          { required: true, message: "请选择设人员", trigger: "change", },
        ],
        laboratoryName: [
          { required: true, message: "请选择实验室", trigger: "change", },
        ],
        ip: [{ required: true, message: "请输入设备IP地址", trigger: "blur" }],
        isAutonomous: [{ required: true, message: "请选择是否可自主", trigger: "blur" }],
      },
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

    // 部门子组件点击回调  选中的数据
    departmentHandleCallback (data) {
      /*  console.log("data", data); */
      // 回调后数据操作
      this.mainDataForm.departmentName = data.deptName;
      this.mainDataForm.department = data.deptCode;
      this.treeData.deptCode = data.deptCode;
    },
    /*打开设备型号选择弹框*/
    modelfocus () {
      this.dialogModelFocus = true;
    },
    /*设备型号选中回调*/
    modelCurrentChange (data) {
      let row = data.row;
      this.model1 = row;
    },
    /*关闭设备型号选择弹框*/
    closedialogModelFocus () {
      this.dialogModelFocus = false;
    },
    /*保存设备型号*/
    saveModel () {
      if (!this.model1) {
        this.$message.error("请选中一行数据！");
        return;
      }
      this.mainDataForm.equipmentName = this.model1.name;
      this.mainDataForm.modelId = this.model1.oid;
      this.dialogModelFocus = false;
    },

    /*打开人员选择弹框*/
    principalfocus () {
      this.dialogPrincipalFocus = true;
    },
    /*关闭人员选择弹框*/
    closeDialogPrincipal () {
      this.dialogPrincipalFocus = false;
    },
    /*人员选中回调*/
    principalCurrentChange (data) {
      let row = data.row;
      this.principal = row;
    },
    /*保存人员*/
    savePrincipal () {
      if (!this.principal) {
        this.$message.error("请选中一行数据！");
        return;
      }
      this.mainDataForm.principal = this.principal.name;
      this.mainDataForm.principalId = this.principal.oid;
      this.mainDataForm.tel = this.principal.landlineTel;
      this.dialogPrincipalFocus = false;
    },
    selectUserConfirm (row) {
      /* console.log(row[0]); */
      this.mainDataForm.principal = row[0].name;
      this.mainDataForm.principalId = row[0].oid;
      this.mainDataForm.tel = row[0].landlineTel;
    },
    /*打开实验室选择弹框*/
    laboratoryfocus () {
      this.dialogLaboratoryFocus = true;
    },
    /*关闭实验室选择弹框*/
    closeDialogLaboratory () {
      this.dialogLaboratoryFocus = false;
    },
    /*实验室选中回调*/
    laboratoryCurrentChange (data) {
      let row = data.row;
      /* console.log("row", row); */
      this.laboratory = row;
    },
    /*保存实验室*/
    saveLaboratory () {
      if (!this.laboratory) {
        this.$message.error("请选中一行数据！");
        return;
      }
      this.mainDataForm.laboratoryName = this.laboratory.laboratoryName;
      this.mainDataForm.laboratoryId = this.laboratory.oid;
      this.closeDialogLaboratory();
    },

    /**编辑*/
    editItem (row) {
      this.title = "设备编辑";
      this.mainDataForm = {};
      this.mainDataForm = JSON.parse(JSON.stringify(row));
      this.treeData.deptCode = this.mainDataForm.department;
      this.treeData.deptName = this.mainDataForm.departmentName;
      this.dialogVisible = true;
    },
    /**新增*/
    addItem () {
      this.title = "新增设备";
      /* 必须要加空格 不然添加一次之后在添加会vali会默认选中第一个表单 自动弹出来表格出来 */
      this.mainDataForm = {};
      this.treeData.oid = "";
      this.treeData.deptName = "";
      this.treeData.deptCode = "";
      this.dialogVisible = true;
      if (this.$refs.form) {
        this.$refs.form.resetFields()
      }
    },
    // 设备详情
    confItem (row) {
      this.$router.push({
        path: "/tdm/EquipmentDetails",
        query: { equipmentId: row.oid },
      });
    },
    /* 刷新 */
    refreshItdm () {
      this.$refs.equipmentIceGrid.refresh();
    },
    closeItem () {
      this.$refs.form.clearValidate();
      this.dialogVisible = false;
    },
    /**保存*/
    save () {
      console.log(this.isTrue());
      if (this.isTrue()) {
        this.$message.error("表单请填写完整");
        return;
      }
      if (this.mainDataForm.oid) {
        this.$axios
          .post("/tdm/equipment/editEquipment", this.mainDataForm)
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
          .put("/tdm/equipment/addEquipment", this.mainDataForm)
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
      let validate = false;
      if (!this.mainDataForm.equipmentName) {
        validate = true;
      }
      if (!this.mainDataForm.principal) {
        validate = true;
      }
      if (!this.mainDataForm.laboratoryName) {
        validate = true;
      }
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
          .delete("/tdm/equipment/delEquipment", {
            params: { equipmentId: row.oid },
          })
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
