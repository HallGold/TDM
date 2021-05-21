<template>
  <div class="Box">
    <div class="childBox">
      <div class="chartBox">
        <!-- 线图 -->
        <line-chart :LineDatas="LineDatas"></line-chart>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'line')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'line')">本月</el-button>
        </div>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
      <div class="chartBox">
        <!-- 饼图1 -->
        <pie-chart1 :Pie1Datas="Pie1Datas"></pie-chart1>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'pie1')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'pie1')">本月</el-button>
        </div>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
    </div>
    <div class="childBox">
      <div class="chartBox">
        <!-- 图片 -->
        <img src="../images/flowers072.jpg"
             alt="">
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
      <div class="chartBox">
        <!-- 表格 -->
        <div class="title">今日开工清单</div>
        <ice-query-grid title="今日开工清单"
                        data-url="tdm/visualization/appList"
                        :pagination="false"
                        :columns="columns"
                        :gridIndex="false"
                        highlight-current-row
                        ref="grid"
                        chooseItem="single"
                        :query="query"></ice-query-grid>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
    </div>
    <div class="childBox">
      <div class="chartBox">
        <!-- 柱图 -->
        <column-chart></column-chart>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'column')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'column')">本月</el-button>
        </div>
      </div>
      <div class="chartBox">
        <!-- 饼图2 -->
        <pie-chart2 :Pie2Datas="Pie2Datas"></pie-chart2>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'pie2')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'pie2')">本月</el-button>
        </div>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
    </div>
  </div>
</template>
<script>
import lineChart from './ExperimentchartComponent/lineChart.vue'
import pieChart1 from './ExperimentchartComponent/pieChart-1.vue'
import columnChart from './ExperimentchartComponent/columnChart.vue'
import pieChart2 from './ExperimentchartComponent/pieChart-2.vue'
import IceQueryGrid from "@/components/common/base/IceQueryGrid";
export default {
  components: { lineChart, pieChart1, columnChart, pieChart2, IceQueryGrid },
  data () {
    return {
      query: [
        { type: "static", code: "size", value: 20 },
        { type: "static", code: "current", value: 1 },
      ],
      columns: [
        // { code: "id", hidden: true },
        {
          label: "预约编号",
          code: "reservationNumber",
          align: "center",
          width: 100,
        },
        {
          label: "实验名称",
          code: "name",
          align: "center",
          width: 100,
        },
        {
          label: "委托单位",
          code: "entrustUnit",
          align: "center",
          width: 100,
        },
        {
          label: "实验人员",
          code: "sendSampleTime",
          align: "center",
          width: 100,
        },
      ],
      /* 本周 */
      WeekData: '',
      /* 本月 */
      MonthData: '',
      /* 线图 */
      LineDatas: [],
      /* 饼图1 */
      Pie1Datas: [],
      /*  饼图2*/
      Pie2Datas: [],
    }
  },
  methods: {
    /* 获取本周周一 */
    initWeekData () {
      var date = new Date();
      date.setDate(date.getDate() - date.getDay() + 1);
      var Startweek = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " 00:00:00";
      this.WeekData = Startweek;
    },
    /* 获取本月第一天 */
    initMonthData () {
      var date = new Date();
      var nowMonth = date.getMonth(); //当前月 
      var nowYear = date.getFullYear(); //当前年 
      //本月的开始时间
      var monthStartDate = new Date(nowYear, nowMonth, 1);
      this.MonthData = monthStartDate;
    },
    /* 本周数据 */
    getWeekData (WeekData, category) {
      /*  console.log(category); */
      if (category == "line") {
        /* 线图 */
        this.getLineChartData(WeekData);
      }
      if (category == "pie1") {
        /* 饼图1 */
        this.getpie1ChartData(WeekData)
      }
      if (category == "column") {
        /* 柱形图 */

      }
      if (category == "pie2") {
        /* 饼图2 */
        this.getpie2ChartData(WeekData)
      }
      if (category == undefined || null || '') {
        this.getLineChartData(WeekData);
        this.getpie1ChartData(WeekData);
        this.getpie2ChartData(WeekData)
      }
    },
    /* 本月数据 */
    getMonthData (MonthData, category) {
      if (category == "line") {
        /* 线图 */
        this.getLineChartData(MonthData);
      }
      if (category == "pie1") {
        /* 饼图1 */
        this.getpie1ChartData(MonthData);
      }
      if (category == "column") {
        /* 柱形图 */

      }
      if (category == "pie2") {
        /* 饼图2 */
        this.getpie2ChartData(MonthData)
      }
      if (category == undefined || null || '') {
        this.getLineChartData(MonthData);
        this.getpie1ChartData(MonthData);
        this.getpie2ChartData(MonthData)
      }
    },
    /* 线图 */
    getLineChartData (date) {
      this.$axios.get('tdm/visualization/viewAppChecklist', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /* console.log(res.data.experimentType); */
        this.LineDatas = res.data.experimentType
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 饼图1 */
    getpie1ChartData (date) {
      this.$axios.get('tdm/visualization/appAcceptView', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /*   console.log(res.data.appointmentType); */
        this.Pie1Datas = res.data.appointmentType;
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 饼图2 */
    getpie2ChartData (date) {
      this.$axios.get('tdm/visualization/appOk', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /*  console.log(res); */
        this.Pie2Datas = res.data.appRateOk
      }).catch(err => {
        this.$message.error(err.msg)
      })
    }
  },
  created () {
    /* 获取时间戳 */
    this.initWeekData()
    this.initMonthData()
  },
  mounted () {
    this.getMonthData(this.MonthData)
  },
}
</script>

<style lang="less" scoped>
.Box {
  width: 100%;
  height: 900px;
  display: flex;
  box-sizing: border-box;
  padding: 10px;
  .childBox {
    flex: 1;
    margin-right: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    &:nth-child(2) {
      display: flex;
      flex-direction: column;
      .chartBox {
        &:nth-child(1) {
          flex: 3;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
        &:nth-child(2) {
          flex: 1;
          box-sizing: border-box;
          overflow: hidden;
          padding: 10px;
          .title {
            color: #fff;
            font-size: 14px;
            box-sizing: border-box;
            margin-bottom: 5px;
          }
          /deep/.ice-container {
            min-height: 140px !important;
            height: 180px;
            background: transparent !important;
          }
          /deep/.vxe-table--header-wrapper,
          /deep/.vxe-table--body-wrapper {
            background-color: transparent !important;
            color: #fff;
          }
          /deep/.vxe-body--row,
          /deep/.row--current {
            background: none;
          }
        }
      }
    }
    .chartBox {
      position: relative;
      flex: 1;
      border-radius: 10px;
      border: 1px solid #0523a3;
      position: relative;
      &::before {
        content: '';
        width: 30px;
        height: 30px;
        border-left: 1px solid #43dfe6;
        border-top: 1px solid #43dfe6;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 10px 0 0 0;
      }
      &::after {
        content: '';
        width: 30px;
        height: 30px;
        border-right: 1px solid #43dfe6;
        border-top: 1px solid #43dfe6;
        position: absolute;
        right: 0;
        top: 0;
        border-radius: 0 10px 0 0;
      }
      .borderStyle1 {
        width: 30px;
        height: 30px;
        border-left: 1px solid #43dfe6;
        border-bottom: 1px solid #43dfe6;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 0 0 0 10px;
      }
      .borderStyle2 {
        width: 30px;
        height: 30px;
        border-right: 1px solid #43dfe6;
        border-bottom: 1px solid #43dfe6;
        position: absolute;
        bottom: 0;
        right: 0;
        border-radius: 0 0 10px 0;
      }
      &:nth-child(1) {
        margin-bottom: 10px;
      }
      .buttons {
        position: absolute;
        top: 10px;
        right: 10px;
        .el-button {
          height: 20px;
          padding: 4px 10px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>