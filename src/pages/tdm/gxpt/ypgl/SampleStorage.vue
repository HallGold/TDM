<template>
  <div class="container">
  <!--   <ice-query-grid-custom title="SampleStorage"
                           :grid-data="gridData"
                           :pagination="true"
                           :columns="columnsReserve"
                           ref="SampleStorageRef"
                           chooseItem="multiple"
                           :buttons="buttons"
                           @selection-change="ReserveSelectionChange"></ice-query-grid-custom> -->

    <el-button @click="showAddEvent">新增</el-button>
    <tdm-query-grid :columns="columnsReserve"
                    :isPagination="false"
                    :tableData="gridData"></tdm-query-grid>
    <!-- 新增弹窗 -->
    <ice-dialog v-dialogDrag
                title="实验预约样品清单"
                center
                :visible.sync="showDetails"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="1600px">
      <ice-query-grid title="实验报告添加"
                      data-url="tdm/sample/list"
                      :pagination="true"
                      :columns="columns"
                      ref="grid"
                      chooseItem="multiple"
                      :query="IceQuery"
                      :gridIndex="false"
                      @selection-change="handleSelectionChange"
                      :selectedCodes="selectedCodesDetectItem"
                      codeProp="id"></ice-query-grid>
      <div class="ice-button-bar">
        <el-button type="primary"
                   size="medium"
                   @click="save">保存</el-button>
        <el-button type="info"
                   size="medium"
                   @click="closeItem">取消</el-button>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
var that;
import IceQueryGridCustom from "@/pages/tdm/gxpt/ypgl/IceQueryGrid";
import TdmQueryGrid from "@/pages/tdm/gxpt/sygl/TdmQueryGrid";
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "SampleStorage",
  components: { IceQueryGrid, IceDialog, IceQueryGridCustom, TdmQueryGrid },
  data () {
    return {
      /*  query: [
        { type: "input", label: "样品名称", code: "searchText", value: "" },
      ], */
      IceQuery: [
        { type: "input", label: "样品名称", code: "searchTerm", value: "" },
        {
          type: "static",
          code: "type",
          label: "",
          value: () => {
            return this.type;
          },
        },
      ],
      type: "2",
      /* 表格 */
      gridData: [],
      attributes: [],
      columnsReserve: [
        { code: "id", hidden: true },
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 80,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 80,
          align: "center",
        },
        {
          label: "预约编号",
          code: "reservationNumber",
          width: 80,
          align: "center",
        },
        {
          label: "送样单位",
          code: "sampleDeliveryUnit",
          width: 80,
          align: "center",
        },
        {
          label: "送样人",
          code: "receiveSamplesPeople",
          width: 80,
          align: "center",
        },
        {
          label: "收样人",
          code: "receivePeople",
          width: 80,
          align: "center",
        },
        {
          label: "收样时间",
          code: "receiveSamplesTime",
          width: 80,
          align: "center",
          isEdit: true,
        },
        {
          label: "属性",
          code: "sampleAttributes",
          align: "center",
          isEdit: true,
          props: {
            type: 'select',
            selectData: that.attributes,
            propName: { value: 'code', label: 'name' },
            multiple: true
          },
        },
        {
          label: "收样仓库",
          code: "receiveSamplesWarehouseId",
          width: 80,
          align: "center",
        },
        {
          label: "储存条件",
          code: "storageConditions",
          width: 80,
          align: "center",
        },
        {
          label: "入库总量",
          code: "sampleNum",
          width: 80,
          align: "center",
          isEdit: true,
        },
        {
          label: "单位",
          code: "dictionaryCategory",
          width: 80,
          align: "center",
          renderCell (h, data) {
            if (data.data[0].dictionaryCategory.name != "") {
              return data.data[0].dictionaryCategory.name;
            }
          },
        },
        {
          label: "库存状态",
          code: "status",
          width: 80,
          align: "center",
          formatter (row) {
            if (row.status == 1) {
              return "暂缓";
            } else if (row.status == 0) {
              return "未收样";
            } else if (row.status == 2) {
              return "已收样";
            }
          },
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 80,
          align: "center",
          formatter (row) {
            if (row.isDynamite == 1) {
              return "是";
            } else if (row.isDynamite == 0) {
              return "否";
            }
          },
        },
        {
          label: "是否委外",
          code: "isEntrust",
          width: 80,
          align: "center",
          formatter (row) {
            if (row.isEntrust == 1) {
              return "是";
            } else if (row.isEntrust == 0) {
              return "否";
            }
          },
        },
        {
          label: "委外单位",
          code: "entrustEnterprise",
          width: 80,
          align: "center",
        },
      ],
      buttons: [
        {
          name: "新增",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.showAddEvent,
        },
        {
          name: "删除",
          icon: "el-icon-delete-solid",
          type: "primary",
          callback: this.deletedItem,
        },
        {
          name: "保存",
          icon: "el-icon-check",
          type: "primary",
          callback: this.saveItem,
        },
      ],
      /* 弹窗 */
      showDetails: false,
      /* 弹窗表格 */
      columns: [
        { code: "id", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",
          width: 100,
          align: "center",
        },
        {
          label: "预约单位",
          code: "entrustUnit",
          width: 100,
          align: "center",
        },
        {
          label: "预约时间",
          code: "reservationTime",
          width: 100,
          align: "center",
        },
        {
          label: "预约人",
          code: "reservationPeople",
          width: 100,
          align: "center",
        },
        {
          label: "检测项目",
          code: "testItems",
          width: 100,
          align: "center",
          renderCell (h, data) {
            let testItems = "";
            let items = data.row.testItems;
            if (items && items.length > 0) {
              for (let i = 0; i < items.length; i++) {
                testItems += items[i].projectName;
                testItems += "; ";
              }
            }
            return testItems;
          },
        },
        {
          label: "样品编号",
          code: "sampleNumber",
          width: 100,
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          width: 100,
          align: "center",
        },
        {
          label: "数量",
          code: "sampleNum",
          width: 100,
          align: "center",
        },
        {
          label: "单位",
          code: "dictionaryCategory",
          width: 80,
          align: "center",
          renderCell (h, data) {
            if (data.data[0].dictionaryCategory.name != "") {
              return data.data[0].dictionaryCategory.name;
            }
          },
        },
        {
          label: "属性",
          code: "sampleAttributes",
          width: 100,
          align: "center",
          renderCell (h, data) {
            let sampleAttributes = "";
            let attributes = data.row.sampleAttributes;
            if (attributes && attributes.length > 0) {
              for (let i = 0; i < attributes.length; i++) {
                sampleAttributes += attributes[i].name;
                sampleAttributes += "; ";
              }
            }
            return sampleAttributes;
          },
        },
        {
          label: "是否炸药",
          code: "isDynamite",
          width: 100,
          align: "center",
          formatter (row) {
            if (row.isDynamite == 1) {
              return "是";
            } else if (row.isDynamite == 0) {
              return "否";
            }
          },
        },
        {
          label: "是否委外",
          code: "isEntrust",
          width: 100,
          align: "center",
          formatter (row) {
            if (row.isEntrust == 1) {
              return "是";
            } else if (row.isEntrust == 0) {
              return "否";
            }
          },
        },
      ],
      /* 弹窗表格选中的数据 */
      SelectedData: [],
      /* 提交参数 */
      vo: [],
      voList: {},
      /* 删除 */
      tableChecked: [],
    };
  },
  methods: {
    /* 新增事件 */
    showAddEvent () {
      this.showDetails = true;
      this.SelectedData = [];
      this.$nextTick(() => {
        this.$refs.grid.refresh();
      });
    },
    /* 弹框保存 */
    save () {
      for (let i in this.SelectedData) {
        let attributeIds = [];
        let attributes = this.SelectedData[i].sampleAttributes;
        for (let at in attributes) {
          attributeIds.push(attributes[at].id)
        }
        this.SelectedData[i].sampleAttributes = attributeIds;
      }
      this.gridData = this.SelectedData;
      this.showDetails = false;
    },
    /* 保存提交 */
    saveItem () {
      if (this.gridData.length == 0) {
        this.$message.warning("请选中要保存的列表");
        return;
      }
      this.vo.forEach((e) => {
        let attributes = [];
        let conditions = [];
        let type = "";
        e.sampleAttributes.forEach((item) => {
          attributes.push(item.id);
        });
        e.storageConditions.forEach((item) => {
          conditions.push(item.id);
        });
        e.sampleAttributes = attributes;
        e.storageConditions = conditions;
      });
      this.voList.vo = this.vo;
      console.log(this.voList);
      this.$axios
        .post("tdm/sample/warehousing", this.voList)
        .then((success) => {
          this.$message({
            type: "success",
            message: "执行成功",
          });
          for (
            var i = this.$refs.SampleStorageRef.selections.length - 1;
            i >= 0;
            i--
          ) {
            this.gridData.splice(
              this.$refs.SampleStorageRef.selections[i].index - 1,
              1
            );
          }
        })
        .catch((error) => {
          this.$message({
            type: "error",
            message: error.msg,
          });
        });
    },
    /* 提交选中 */
    ReserveSelectionChange (row) {
      this.vo = row;
      this.tableChecked = row;
    },
    closeItem () {
      this.showDetails = false;
    },
    /* 新增列表选中 */
    handleSelectionChange (row) {
      this.SelectedData = row;
    },
    /* 删除列表 */
    deletedItem (index, rows) {
      this.$confirm("确定删除操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "info",
      }).then(() => {
        console.log(this.$refs.SampleStorageRef.selections);
        for (
          var i = this.$refs.SampleStorageRef.selections.length - 1;
          i >= 0;
          i--
        ) {
          this.gridData.splice(
            this.$refs.SampleStorageRef.selections[i].index - 1,
            1
          );
        }
      });
    },
    getAttributes () {
      this.$axios
        .get("tdm/sample/queryDictionary", { params: { type: 'ypsx' } })
        .then((success) => {
          if (success.status == 200) {
            this.attributes = success.data;
          }
        })
    }
  },
  created () {
    this.getAttributes();
    that = this;
  },
  computed: {
    selectedCodesDetectItem () {
      return this.gridData.map((data) => {
        return data.id;
      });
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
</style>
