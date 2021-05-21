<template>
  <div style="flex-grow: 1;display: flex;flex-direction: column;width: 100%"
       v-loading="loading">
    <!-- 一级列表 -->
    <ice-query-grid title="序列号管理"
                    data-url="/tdm/TdmPersonnelQualification/list"
                    :query="query"
                    :columns="columns"
                    :operations="operations"
                    :operationsWidth="190"
                    :buttons="buttons"
                    ref="grid"
                    :gridIndex="true"
                    chooseItem="single">
    </ice-query-grid>
    <!-- 添加设备弹窗 -->
    <el-dialog v-dialogDrag
               :title="tittle"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible"
               width="800px"
               append-to-body
               :close-on-click-modal="false">
      <div class="titleName">{{ tittle }}</div>
      <div class="grid-container">
        <ice-query-grid title="设备列表"
                        data-url="/tdm/TdmPersonnelQualification/getEquipmentInfos"
                        :query="add_query"
                        :columns="add_columns"
                        ref="addGrid"
                        :gridIndex="false"
                        chooseItem="multiple"
                        @selection-change="changeFun">
        </ice-query-grid>
        <div class="dialog-footer ice-button-bar">
          <el-button type="primary"
                     @click="save">确 定</el-button>
          <el-button type="info"
                     @click="closeDialog">取 消</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 移除设备弹窗 -->
    <el-dialog v-dialogDrag
               :title="tittle"
               custom-class="ice-dialog"
               center
               :visible.sync="dialogVisible_2"
               width="800px"
               append-to-body
               :close-on-click-modal="false">
      <div class="titleName">{{ tittle }}</div>
      <div class="grid-container">
        <ice-query-grid data-url="/tdm/TdmPersonnelQualification/get"
                        :columns="Remove_columns"
                        :query="del_query"
                        ref="delGrid"
                        :gridIndex="false"
                        :buttons="del_buttons"
                        chooseItem="multiple"
                        exportTitle="人员设备资质"
                        @selection-change="changeFun_2"
                        :pagination="false">
        </ice-query-grid>
        <div class="dialog-footer ice-button-bar">
          <el-button type="primary"
                     @click="remove_device">移除认证</el-button>
          <el-button type="info"
                     @click="closeDialog2">取 消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceSelect from "@/components/common/base/IceSelect";
import IceGridLayout from "@/components/common/base/IceGridLayout.vue";
import { isLetterAndNumber } from "@/pages/system/comm/Validator";
// import { isEmpty } from "xe-utils/methods";

export default {
  name: "formcode",
  data () {
    return {
      loading: false,
      query: [{ type: "input", label: "名称/code", code: "searchText" }],
      // 添加设备弹框搜索
      add_query: [
        { type: "input", label: "设备编码或设备名称", code: "searchText" },
        {
          type: "static",
          label: "用户Id",
          code: "userId",
          value: this.selectValue,
        },
      ],
      //移除设备搜索
      del_query: [
        {
          type: "static",
          label: "用户Id",
          code: "userId",
          value: this.selectValue,
        },
      ],
      // 一级数据列表
      columns: [
        { label: "登录名", code: "code", width: 250, align: "center" },
        { label: "名称", code: "name", width: 250, align: "center" },
        { label: "单位", code: "deptShortName", width: 250, align: "center" },
        { label: "部门", code: "orgShortName", width: 250, align: "center" },
        {
          label: "是否添加资质",
          code: "isAdd",
          width: 250,
          align: "center",
          formatter (row) {
            if (row.isAdd == 0) {
              return "否";
            }
            return "是";
          },
        },
      ],
      // 添加设备数据列表
      add_columns: [
        {
          label: "图片",
          code: "image",
          width: 141,
          align: "center",
          renderCell (h, data) {
            return (
              <img
                src={"/api/resources/image.png?id=" + data.row.image}
                width="22px"
                height="22px"
              />
            );
          },
        },
        {
          label: "设备编码",
          code: "model",
          width: 141,
          align: "center",
        },
        {
          label: "设备名称",
          code: "equipmentName",
          width: 141,
          align: "center",
        },
      ],
      // 移除设备数据列表
      Remove_columns: [
        {
          label: "图片",
          code: "image",
          width: 121,
          align: "center",
          renderCell (h, data) {
            return (
              <img
                src={"/api/resources/image.png?id=" + data.row.image}
                width="22px"
                height="22px"
              />
            );
          },
        },
        {
          label: "设备型号",
          code: "model",
          width: 121,
          align: "center",
        },
        {
          label: "设备名称",
          code: "equipmentName",
          width: 121,
          align: "center",
        },
        {
          label: "状态",
          code: "status",
          width: 121,
          align: "center",
          formatter (row) {
            return row.status == 1 ? "检修" : row.status == 2 ? "故障" : "正常";
          },
        },
      ],
      del_buttons: [
        {
          name: '导入',
          icon: 'el-icon-upload2',
          size: 'mini',
          callback: this.handleImport
        },
        { name: '导出', icon: 'el-icon-download', size: 'mini', type: 'export' },
      ],
      operations: [
        {
          name: "添加认证",
          ctrlCode:"BTJRZ",
          callback: (row) => {
            this.personnelQualification.userId = row.code;
            this.dialogVisible = true;
            /* this.aclKeyReadonly = true; */
            this.tittle = "添加人员资质";
            this.$nextTick(() => {
              this.$refs.addGrid.refresh();
            });
          },
        },
        {
          name: "查看详情",
          ctrlCode:"BYC",
          callback: (row) => {
            this.dialogVisible_2 = true;
            /*  this.aclKeyReadonly_2 = true; */
            this.tittle = "查看详情";
            this.personnelQualification.userId = row.code;
            this.$nextTick(() => {
              this.$refs.delGrid.refresh();
            });
          },
        },
      ],
      buttons: [
        // {
        //   // name: "人员状态",
        //   // icon: "el-icon-plus",
        //   // type: "primary",
        //   // callback: () => {
        //   //   this.mainDataForm = { usecycle: "0", isprefix: "0", cycle: "" };
        //   //   this.aclKeyReadonly = false;
        //   //   this.dialogVisible = true;
        //   //   this.tittle = "人员状态";
        //   // },
        // },
      ],
      // 添加设备
      dialogVisible: false,
      aclKeyReadonly: false,
      // 移除设备
      dialogVisible_2: false,
      aclKeyReadonly_2: false,
      tittle: "",
      personnelQualification: {
        userId: "",
        equipments: [],
      },
      equipments_list: [],
      equipments_list_2: [],
      equipments_userid: [],
      dataurl: "",
    };
  },
  methods: {
    selectValue (row) {
      return this.personnelQualification.userId;
    },
    // 添加设备
    save () {
      console.log(this.equipments_list, '====');
      this.personnelQualification.equipments = [];
      this.equipments_list.forEach((val) => {
        this.personnelQualification.equipments.push(val.id);
      });
      console.log("this.personnelQualification", this.personnelQualification);
      if (
        !this.personnelQualification.equipments ||
        this.personnelQualification.equipments.length == 0 ||
        this.personnelQualification.equipments == null ||
        this.personnelQualification.equipments == undefined
      ) {
        this.$message.error("请选择设备");
        return;
      }
      this.loading = true;
      this.$axios
        .put(
          "tdm/TdmPersonnelQualification/addPersonnelQualification",
          this.personnelQualification
        )
        .then((res) => {
          this.$message.success("添加成功!");
          this.closeDialog();
          this.$refs.grid.refresh();
          this.loading = false;
        });
    },
    // 移除设备
    remove_device () {
      this.$confirm('确定删除操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info'
      }).then(() => {
        console.log(this.equipments_list_2);
        this.equipments_userid = [];
        this.equipments_list_2.forEach((val) => {
          // console.log(val.id);
          this.equipments_userid.push(val.id);
        });
        if (
          !this.equipments_userid ||
          this.equipments_userid.length == 0 ||
          this.equipments_userid == null ||
          this.equipments_userid == undefined
        ) {
          this.$message.error("请选择设备");
          return;
        }
        this.$axios
          .delete("/tdm/TdmPersonnelQualification/del", {
            params: {
              ids: this.equipments_userid.join(),
            },
          })
          .then((res) => {
            this.$message.success("删除成功");
            this.closeDialog2();
            this.Refresh();
          });
      })

    },
    // 关闭弹窗
    closeDialog () {
      this.dialogVisible = false;
    },
    closeDialog2 () {
      this.dialogVisible_2 = false;
    },
    // 获取多选框数据列表
    changeFun (val) {
      this.equipments_list = val;
      console.log(this.equipments_list);
    },
    changeFun_2 (val) {
      // console.log(val);
      this.equipments_list_2 = val;
      // console.log(this.equipments_list_2);
    },

    //刷新列表
    Refresh () {
      this.$refs.grid.refresh();
    },
    // 刷新移除设备列表
    delGridRefresh () {
      this.$refs.delGrid.refresh();
    },
  },
  components: {
    IceQueryGrid,
    IceSelect,
    IceGridLayout,
  },
  mounted () {
    this.Refresh();
  },
};
</script>

<style lang="less" scoped>
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
