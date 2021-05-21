<template>
  <div class="container">
    <ice-query-grid title="样品台账"
                    data-url="tdm/sample/list"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="false"
                    :operations="operations"
                    ref="grid"
                    :operationsWidth="100"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
    <!-- 查看详情 -->
    <ice-dialog v-dialogDrag
                title="实验作业详情"
                center
                :visible.sync="dialogVisible"
                :close-on-click-modal="false"
                :before-close="closeItem"
                append-to-body
                width="800px">
      <div class="headers">
        <h2>
          实验作业编号
        </h2>
        <ul>
          <li>
            预约编号：<span>{{ DetailsData.reservationNumber }}</span>
          </li>
          <li>
            样品编号：<span>{{ DetailsData.sampleNumber }}</span>
          </li>
          <li>
            样品名称：<span>{{ DetailsData.sampleName }}</span>
          </li>
          <li>
            送样人:<span>{{ DetailsData.receiveSamplesPeopleName }}</span>
          </li>
          <li>
            收样人:<span>{{ DetailsData.receivePeopleName }}</span>
          </li>
          <li>
            收样时间:<span>{{ DetailsData.receiveSamplesTime }}</span>
          </li>
          <li>
            收样仓库:<span>{{ DetailsData.receiveSamplesWarehouseName }}</span>
          </li>
          <li>
            入库总量:<span>{{ DetailsData.sampleNum }}</span>
          </li>
          <li>
            单位:<span>{{ DetailsData.unit }}</span>
          </li>
          <li>
            入库状态:<span>{{
              DetailsData.status == 2 ? "已入库" : "未入库"
            }}</span>
          </li>
        </ul>
      </div>
    </ice-dialog>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "experimentAssignment",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
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
      type: "1",
      /* 样品登记表格数据 */
      columns: [
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
        /*  {
          label: "送样单位",
          code: "sampleDeliveryUnit",
          width: 80,
          align: "center",
        }, */
        {
          label: "送样人",
          code: "receiveSamplesPeopleName",
          width: 80,
          align: "center",
        },
        {
          label: "收样人",
          code: "receivePeopleName",
          width: 80,
          align: "center",
        },
        {
          label: "收样时间",
          code: "receiveSamplesTime",
          width: 80,
          align: "center",
        },
        {
          label: "属性",
          code: "sampleAttribute",
          width: 80,
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
          label: "收样仓库",
          code: "receiveSamplesWarehouseName",
          width: 80,
          align: "center",
        },
        {
          label: "储存条件",
          code: "storageConditions",
          width: 80,
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
          label: "入库总量",
          code: "sampleNum",
          width: 80,
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
        /*  {
          label: "委外单位",
          code: "entrustEnterprise",
          width: 80,
          align: "center",
        }, */
      ],
      buttons: [
        {
          name: "导出",
          icon: "el-icon-download",
          type: "primary",
          callback: this.download,
        },
        {
          name: "导入",
          icon: "el-icon-upload2",
          type: "primary",
          callback: this.UploadData,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "success",
          callback: this.ManualRefresh,
        },
      ],
      operations: [{ name: "查看详情", callback: this.SeeDetails }],
      dialogVisible: false,
      /* 详情数据 */
      DetailsData: {},
    };
  },
  methods: {
    /* 查看详情 */
    SeeDetails (row) {
      this.DetailsData = row;
      this.dialogVisible = true;
      this.DetailsData.unit = row.dictionaryCategory.name;
    },
    /* 导入 */
    UploadData () { },
    /* 导出 */
    download () { },
    closeItem () {
      this.dialogVisible = false;
    },
    /* 初始化 */
    init () {
      this.$refs.grid.refresh();
    },
    /* 刷新 */
    ManualRefresh () {
      this.$refs.grid.refresh();
    },
  },
  mounted () {
    this.init();
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
    margin-bottom: 20px;
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
