<template>
  <el-container>
    <ice-query-grid title="样品收样统计"
                    data-url="tdm/sample/sampleCount"
                    :pagination="true"
                    :columns="columns"
                    :operations="operations"
                    ref="sampleStatisticsRef"
                    chooseItem="single"
                    :gridIndex="true"
                    :buttons="buttons"
                    :query="query"></ice-query-grid>
  </el-container>
</template>

<script>
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
export default {
  name: 'sampleStatistics',
  components: { IceQueryGrid },
  data () {
    return {
      query: [
        { type: "input", label: "实验名称", code: "projectName", value: "" },
        {
          type: "static", label: "", code: "startTime", value: () => {
            return this.startTime
          }
        },
        {
          type: "static", label: "", code: "endTime", value: () => {
            return this.date
          }
        },
      ],
      columns: [
        { code: "sampleOid", hidden: true },
        {
          label: "样品编号",
          code: "sampleNumber",
          align: "center",
        },
        {
          label: "样品名称",
          code: "sampleName",
          align: "center",
        },
        {
          label: "收样时间",
          code: "dateOfReceipt",
          align: "center",
        },
        {
          label: "规格型号",
          code: "sampleAttributeStr",
          align: "center",
        },
        {
          label: "数量",
          code: "sampleNum",
          align: "center",
        },
        {
          label: "单位",
          code: "unit",
          align: "center",
          renderCell (h, row) {
            return row.row.dictionaryCategory == null ? "" : row.row.dictionaryCategory.name
          }
        },

      ],

      operations: [],
      buttons: [
        {
          name: "按月",
          type: "primary",
          icon: 'el-icon-search',
          callback: this.monthMethods
        },
        {
          name: "按周",
          type: "primary",
          icon: 'el-icon-search',
          callback: this.weekMethods
        },
        {
          name: "按天",
          icon: 'el-icon-search',
          type: "primary",
          callback: this.dayMethods
        },
      ],
      /* 开始时间和结束时间 */
      startTime: '',
      endTime: '',
      date: ''
    }
  },
  methods: {
    /* 按天 */
    dayMethods () {
      let daySart = new Date(new Date(new Date().toLocaleDateString()).getTime());
      /*   console.log(daySart); */
      this.startTime = daySart;
      /* console.log(this.startTime); */
      this.$refs.sampleStatisticsRef.refresh()
    },
    /* 按周 */
    weekMethods () {
      var date = new Date();
      // 本周一的日期
      date.setDate(date.getDate() - date.getDay() + 1);
      var week = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00";
      /*  console.log(week); */
      this.startTime = week;
      /*   console.log(this.startTime); */
      this.$refs.sampleStatisticsRef.refresh()
    },
    /* 按月 */
    monthMethods () {
      var now = new Date(); //当前日期 
      var nowMonth = now.getMonth(); //当前月 
      var nowYear = now.getFullYear(); //当前年 
      //本月的开始时间
      var month = new Date(nowYear, nowMonth, 1);
      /*   console.log(month); */
      this.startTime = month;
      /*  console.log(this.startTime); */
      this.$refs.sampleStatisticsRef.refresh()
    },
  },
  mounted () {
    this.monthMethods();
    this.date = new Date()
    /*   console.log(this.date);
      console.log(this.startTime); */
  }
}
</script>

<style lang="less" scoped>
.el-container {
  background-color: #fff;
}
/deep/.el-button--primary {
  color: #fff;
  background-color: #409eff;
  border-color: #409eff;
}
/deep/.el-button--primary:hover {
  background-color: #91c8ff;
  border-color: #91c8ff;
}
/deep/.el-button--primary:focus {
  background-color: #409eff;
  border-color: #409eff;
}
</style>