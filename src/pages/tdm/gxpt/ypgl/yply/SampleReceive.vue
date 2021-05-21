<template>
  <div class="container">
    <ice-query-grid title="样品收样"
                    data-url="tdm/sample/takeSample"
                    :pagination="true"
                    :columns="columns"
                    :gridIndex="true"
                    :operations="operations"
                    ref="SampleRecycleRef"
                    :operationsWidth="200"
                    chooseItem="single"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
  </div>
</template>
<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
import IceDialog from "@/components/common/base/IceDialog";
export default {
  name: "SampleRecycle",
  components: { IceQueryGrid, IceDialog },
  data () {
    return {
      query: [
        { type: "input", label: "领用编号", code: "searchTerm", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "领用编号",
          code: "receiptNum",
         
          align: "center",
        },
        {
          label: "领用日期",
          code: "receiveSamplesTime",
        
          align: "center",
        },
        {
          label: "领样人",
          code: "receiveSamplesPeopleName",
        
          align: "center",
        },
        {
          label: "领用清单数",
          code: "count",
     
          align: "center",
        },
        // {
        //   label: "预约单编号",
        //   code: "reservationNumber",
        //
        //   align: "center",
        // },
        // {
        //   label: "状态",
        //   code: "status",
        //   align: "center",
        //   renderCell (h, data) {
        //     if (data.row.status == 1) {
        //       return '正式收样'
        //     } else {
        //       return "null"
        //     }
        //   }
        // },
      ],
      operations: [{ name: "查看详情", callback: this.details }],
      buttons: [
        {
          name: "领样登记",
          icon: "el-icon-plus",
          type: "primary",
          callback: this.addItem,
        },
        {
          name: "刷新",
          icon: "el-icon-refresh",
          type: "primary",
          callback: this.refresh,
        },
      ],
    };
  },
  methods: {
    /* 详情 */
    details (row) {
      /*  console.log(row.oid); */
      let routeUrl = this.$router.push({
        name: "/tdm/receiveSampleDetails",
        params: row
      });
    },
    /* 入库登记 */
    addItem () {
      setTimeout(() => {
        let routeUrl = this.$router.resolve("receiveSampleRegister");
        window.open(routeUrl.href, '_blank');
      }, 200);
    },
    refresh () {
      this.$refs.SampleRecycleRef.refresh();
    }
  },
  activated () {
    this.$refs.SampleRecycleRef.refresh();
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  padding: 0;
}
</style>
