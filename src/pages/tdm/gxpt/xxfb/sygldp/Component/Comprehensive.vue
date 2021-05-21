<template>
  <div class="Box">
    <div class="childBox">
      <div class="chartBox">
        <!-- 柱形图 -->
        <column-chart :columnDatas="columnDatas"></column-chart>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'column')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'column')">本月</el-button>
        </div>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
    </div>
    <div class="childBox">
      <div class="chartBox">
        <!-- 饼图1 -->
        <pie-chart1 :pie1Datas="pie1Datas"></pie-chart1>
        <div class="buttons">
          <el-button type="info"
                     @click="getWeekData(WeekData,'pie1')">本周</el-button>
          <el-button type="info"
                     @click="getMonthData(MonthData,'pie1')">本月</el-button>
        </div>
        <i class="borderStyle1"></i>
        <i class="borderStyle2"></i>
      </div>
      <div class="chartBox">
        <!-- 饼图2 -->
        <pie-chart2 :pie2Datas="pie2Datas"></pie-chart2>
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
import columnChart from './ComprehensivechartComponent/columnChart.vue'
import pieChart1 from './ComprehensivechartComponent/pieChart1.vue'
import pieChart2 from './ComprehensivechartComponent/pieChart2.vue'
export default {
  components: { columnChart, pieChart1, pieChart2 },
  data () {
    return {
      /* 本周 */
      WeekData: '',
      /* 本月 */
      MonthData: '',
      /* 柱形图数据 */
      columnDatas: [],
      /* 饼图1 */
      pie1Datas: [],
      /* 饼图2 */
      pie2Datas: [],
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
      /* console.log(category); */
      /*  console.log(WeekData); */
      if (category == "column") {
        /* 柱形图 */
        this.getColumnData(WeekData)
      }
      if (category == "pie1") {
        /* 饼图1 */
        this.getPie1ChartData(WeekData)
      }
      if (category == "pie2") {
        /* 饼图2 */
        this.getPie2ChartData(WeekData)
      }
      if (category == undefined || null || '') {
        this.getColumnData(WeekData)
        this.getPie1ChartData(WeekData)
        this.getPie2ChartData(WeekData)
      }
    },
    /* 本月数据 */
    getMonthData (MonthData, category) {
      /*   console.log(category); */
      /*   console.log(MonthData); */
      if (category == "column") {
        /* 柱形图 */
        this.getColumnData(MonthData)
      }
      if (category == "pie1") {
        /* 饼图1 */
        this.getPie1ChartData(MonthData)
      }
      if (category == "pie2") {
        /* 饼图2 */
        this.getPie2ChartData(MonthData)
      }
      if (category == undefined || null || '') {
        this.getColumnData(MonthData)
        this.getPie1ChartData(MonthData)
        this.getPie2ChartData(MonthData)
      }
    },
    /* 柱形图 */
    getColumnData (date) {
      this.$axios.get('tdm/visualization/deptAppCount', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /*   console.log(res); */
        this.columnDatas = res.data;
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 饼图1 */
    getPie1ChartData (date) {
      this.$axios.get('tdm/visualization/equipmentView', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /*  console.log(res.data); */
        this.pie1Datas = res.data
      }).catch(err => {
        this.$message.error(err.msg)
      })
    },
    /* 饼图2 */
    getPie2ChartData (date) {
      this.$axios.get('tdm/visualization/appOk', {
        params: {
          startTime: date,
          endTime: new Date()
        }
      }).then(res => {
        /*  console.log(res.data.appRateOk); */
        this.pie2Datas = res.data.appRateOk
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
  justify-content: space-between;
  padding: 15px;
  box-sizing: border-box;
  .childBox {
    &:nth-child(1) {
      flex: 2.5;
      margin-right: 20px;
      .chartBox {
        width: 100%;
        height: 100%;
        border: 1px solid #0523a3;
        border-radius: 10px;
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
    &:nth-child(2) {
      flex: 1;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      .chartBox {
        position: relative;
        flex: 1;
        width: 100%;
        border: 1px solid #0523a3;
        border-radius: 10px;
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
}
</style>