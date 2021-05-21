<template>
  <div class="container">
    <ice-query-grid title="样品收样"
                    data-url="tdm/sample/inboundRecord"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    :gridIndex="true"
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
        { type: "input", label: "收样编号", code: "searchTerm", value: "" },
      ],
      columns: [
        { code: "oid", hidden: true },
        {
          label: "收样编号",
          code: "receiptNum",
          width: 200,
          align: "center",
        },
        {
          label: "收样日期",
          code: "receiveSamplesTime",
          width: 200,
          align: "center",
        },
        {
          label: "送样人",
          code: "receiveSamplesPeopleName",
          width: 200,
          align: "center",
        },
        {
          label: "清单数量",
          code: "count",
          width: 200,
          align: "center",
        },
        {
          label: "状态",
          code: "status",
          width: 200,
          align: "center",
          renderCell (h, data) {
            if (data.row.status == 1) {
              return '已收样'
            } else {
              return "null"
            }
          }
        },
      ],
      operations: [
        { name: "查看详情", callback: this.details },
        {
          name: "快速领样", callback: this.FastReceive, isShow: (row) => {
            return row.isCollarSample == 0
          },
        }
      ],
      buttons: [
        {
          name: "入库登记",
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
      let routeUrl = this.$router.push({
        name: "/tdm/RecycleDetails",
        params: row
      });
    },
    /* 入库登记 */
    addItem () {
      setTimeout(() => {
        let routeUrl = this.$router.resolve("SampleRegister");
        window.open(routeUrl.href, '_blank');
      }, 200);
    },
    refresh () {
      this.$refs.SampleRecycleRef.refresh();
    },
    /* 快速领样 */
    FastReceive (row) {
      /*  console.log(row); */
      this.$axios.post('tdm/sample/quickSample', {
        rSamplesOid: row.oid
      }).then(res => {
        console.log(res);
        this.$message.success('领样成功!')
        this.$refs.SampleRecycleRef.refresh()
      }).catch(err => {
        this.$message.error(err.msg)
      })
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
