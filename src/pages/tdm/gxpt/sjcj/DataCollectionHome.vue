<template>
  <div class="containerBox">
    <div class="contentBox-top">
      <div class="nav">
        <ul>
          <li>
            总采集设备 <span>{{ equipmentNum }}</span>台
          </li>
          <li> 在线采集设备
            <span>{{ onlineEquipmentNum == null ? "0" : onlineEquipmentNum }}</span>台
          <li>离线设备
            <span style="color:red">{{ offlineEquipmentNum == null ? "0" : offlineEquipmentNum }}</span>台
          </li>
          <li>
            今日工作采集设备
            <span>{{ dayEquipmentNum == null ? "0" : dayEquipmentNum }}</span>台
          </li>

        </ul>
      </div>
      <div class="buttons">
        <el-button type="primary"
                   @click="toweek('上周')">上周</el-button>
        <el-button type="success"
                   @click="toMonth('上月')">上月</el-button>
        <el-button type="danger"
                   @click="toyaer('今年')">今年</el-button>
      </div>
      <div class="chart">
        <ul>
          <li>
            <h3>数据采集类型分析</h3>
            <div class="chart-pie">
              <pie-chart ref="PieChartRef"
                         :PieChartData="PieChartData"></pie-chart>
            </div>
          </li>
          <li>
            <h3>数据采集情况</h3>
            <div class="chart-line">
              <line-chart ref="LineChartRef"
                          :LineChartData="LineChartData"
                          :seriesName="seriesName"
                          :LinexAxisData="LinexAxisData"></line-chart>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="contentBox-bottom">
      <h3>原始数据清单</h3>
      <ice-query-grid title="原始数据清单"
                      data-url="tdm/dataCollection/list"
                      :pagination="true"
                      :columns="columns"
                      :gridIndex="false"
                      ref="DataCollectionHomeRef"
                      :query="query"></ice-query-grid>
    </div>
  </div>
</template>
<script>
import PieChart from "@/pages/tdm/gxpt/sjcj/chart/PieChart.vue";
import lineChart from "@/pages/tdm/gxpt/sjcj/chart/lineChart.vue";
import IceQueryGrid from "@/components/common/base/IceQueryGrid";

export default {
  name: "DataCollectionHome",
  components: { PieChart, lineChart, IceQueryGrid },
  data () {
    return {
      query: [
        { type: "input", label: "文件名称", code: "searchTerm", value: "" },
        { type: "input", label: "文件格式", code: "fileFormat", value: "" },
        { type: "input", label: "设备名称", code: "equipmentName", value: "" },
        {
          type: "static", label: "开始时间", code: "startTime", value: () => {
            return this.startEndTime.startTime;
          }
        },
        {
          type: "static", label: "结束时间", code: "endTime", value: () => {
            return this.startEndTime.endTime;
          }
        },
      ],
      startEndTime: {
        startTime: "",
        endTime: ""
      },
      columns: [
        { code: "id", hidden: true },
        {
          label: "设备名称",
          code: "equipmentName",
          width: 200,
          align: "center",
        },
        {
          label: "设备编号",
          code: "equipmentNumber",
          width: 200,
          align: "center",
        },
        {
          label: "文件名称",
          code: "fileName",
          width: 200,
          align: "center",
        },
        {
          label: "文件格式",
          code: "fileFormat",
          width: 200,
          align: "center",
        },
        {
          label: "设备IP地址",
          code: "hostComputerIp",
          width: 200,
          align: "center",
        },
        /*    {
          label: "负责人",
          code: "dsName",
          width: 200,
          align: "center",
        }, */
        {
          label: "文件路径",
          code: "hostComputerPath",
          width: 200,
          align: "center",
        },
      ],
      /* 采集设备数量 */
      equipmentNum: "",
      /* 今日采集设备数量 */
      dayEquipmentNum: "",
      /*在线采集设备数*/
      onlineEquipmentNum: 0,
      /*离线采集设备数*/
      offlineEquipmentNum: 0,
      /* 线图组件的数据 */
      LineChartData: [],
      LinexAxisData: [],
      /* 线图请求的临时值 */
      getChartData: [],
      seriesName: "本周",
      /* 饼图请求的临时值 */
      getPieChartData: [],
      PieChartDataNum: [],
      PieChartDataFormat: [],
      /* 饼图组件的数据 */
      PieChartData: [],
    };
  },
  methods: {
    /* 上周 */
    toweek (names) {
      this.seriesName = names;
      let week = this.getProWeek(new Date());
      this.sendRequest(week);
    },
    /* 上月 */
    toMonth (names) {
      this.seriesName = names;
      let month = this.getMonth(new Date());
      this.sendRequest(month);
    },
    /* 今年 */
    toyaer (names) {
      this.seriesName = names;
      let year = this.getYear(new Date());
      this.sendRequest(year);
    },
    /*发送请求*/
    sendRequest (data) {
      this.startEndTime = data;
      this.$refs.DataCollectionHomeRef.refresh();
      this.$axios
        .get("tdm/dataCollection/homeOverview", {
          params: {
            startTime: data.startTime,
            endTime: data.endTime,
          },
        })
        .then((res) => {
          this.dataRendering(res);
        })
        .catch((err) => {
        });
    },
    /*渲染数据*/
    dataRendering (data) {
      this.LineChartData = [];
      this.LinexAxisData = [];
      this.PieChartDataNum = [];
      this.PieChartDataFormat = [];

      this.equipmentNum = data.data.equipmentNum;
      this.dayEquipmentNum = data.data.dayEquipmentNum;
      this.onlineEquipmentNum = data.data.onlineEquipmentNum;
      this.offlineEquipmentNum = data.data.offlineEquipmentNum;
      /* 图表数据 */
      this.getChartData = data.data.dateList;
      this.getPieChartData = data.data.dataType;
      /* Pie */
      for (let i = 0; i < this.getPieChartData.length; i++) {
        this.PieChartDataNum.push(this.getPieChartData[i].formatNum);
        this.PieChartDataFormat.push(this.getPieChartData[i].format);
      }
      let leng = this.getChartData.length;
      /* Line */
      for (let i = 0; i < leng; i++) {
        this.LineChartData.push(this.getChartData[i].dateNum);
        this.LinexAxisData.push(this.getChartData[(leng - (1 + i))].dates);
      }
      /* 获取Pie的值 */
      this.PieChartData = this.PieChartDataNum.map((value, i) => ({
        value,
        name: this.PieChartDataFormat[i],
      }));
      this.$nextTick(() => {
        this.$refs.PieChartRef.drawChart(this.PieChartData);
        this.$refs.LineChartRef.drawChart();
      });
    },
    /*根据日期获取上周周一和周日*/
    getProWeek (date) {
      let dateTime = date.getTime(); // 获取现在的时间
      let dateDay = date.getDay();
      let oneDayTime = 24 * 60 * 60 * 1000;
      let proWeek = {};
      let time = dateTime - (dateDay + (7 - 1 - 0)) * oneDayTime;
      proWeek.startTime = this.getMyDate(time);
      time = dateTime - (dateDay + (7 - 1 - 6)) * oneDayTime;
      proWeek.endTime = this.getMyDate(time);
      return proWeek;
    },
    /*根据日期获取上月第一天和最后一天*/
    getMonth (date) {
      let month = {};
      let firstDay = new Date(date.getFullYear(), date.getMonth() - 1, 1).getTime();
      let lastDay = new Date(date.getFullYear(), date.getMonth(), 0, 23, 59, 59).getTime();
      month.startTime = this.getMyDate(firstDay);
      month.endTime = this.getMyDate(lastDay);
      return month;
    },
    getYear (date) {
      let year = {};
      year.startTime = this.getMyDate(new Date(date.getFullYear(), 0, 1).getTime());
      year.endTime = this.getMyDate(new Date().getTime());
      return year;
    },
    //将时间戳格式化
    getMyDate (time) {
      //补0操作,当时间数据小于10的时候，给该数据前面加一个0
      function getzf (num) {
        if (parseInt(num) < 10) {
          num = '0' + num;
        }
        return num;
      }

      if (typeof (time) == "undefined") {
        return "";
      }
      var oDate = new Date(time),
        oYear = oDate.getFullYear(),
        oMonth = oDate.getMonth() + 1,
        oDay = oDate.getDate(),
        oHour = oDate.getHours(),
        oMin = oDate.getMinutes(),
        oSen = oDate.getSeconds(),
        oTime = oYear + '-' + getzf(oMonth) + '-' + getzf(oDay) + ' ' + getzf(oHour) + ':' + getzf(oMin) + ':' + getzf(oSen);//最后拼接时间

      return oTime;
    },


  },
  mounted () {
    this.toweek();
  }
  ,
  created () {

    //this.toweek();
  }
  ,
}
  ;
</script>
<style lang="less" scoped>
.containerBox {
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;

  .contentBox-top {
    flex: 1;
    margin-bottom: 10px;
  }

  .contentBox-bottom {
    flex: 1;
  }
}

.nav {
  ul {
    display: flex;
    justify-content: center;

    li {
      width: 200px;
      height: 70px;
      border: 1px solid #33ab9f;
      margin-right: 20px;
      text-align: center;
      line-height: 70px;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;

      span {
        color: #33ab9f;
        margin-right: 5px;
      }

      /*&:nth-child(3) {*/
      /*    background-color: #33ab9f;*/
      /*    color: #fff;*/
      /*}*/

      /*&:nth-child(4) {*/
      /*    color: #fff;*/
      /*    background-color: #ff6666;*/
      /*    border: none;*/
      /*}*/
    }
  }
}

.buttons {
  height: 40px;
  text-align: right;
  line-height: 40px;
}

.chart {
  height: 480px;

  ul {
    width: 100%;
    height: 100%;
    display: flex;

    li {
      flex: 1;
      background-color: #f3f3f3;
      position: relative;
      border-radius: 5px;
      box-sizing: border-box;
      padding-top: 40px;

      h3 {
        font-size: 15px;
        font-weight: bold;
        color: #424242;
        position: absolute;
        top: 15px;
        left: 40px;

        &::before {
          content: '';
          display: block;
          width: 5px;
          height: 20px;
          position: absolute;
          top: 1px;
          left: -15px;
          background-color: #33ab9f;
        }
      }

      &:nth-child(1) {
        margin-right: 10px;
      }

      .chart-pie {
        width: 100%;
        height: 100%;
      }

      .chart-line {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.contentBox-bottom {
  position: relative;

  h3 {
    font-size: 15px;
    font-weight: bold;
    color: #424242;
    position: relative;
    position: absolute;
    top: 10px;
    left: 25px;

    &::before {
      content: '';
      display: block;
      width: 5px;
      height: 20px;
      position: absolute;
      top: 1px;
      left: -10px;
      background-color: #33ab9f;
    }
  }
}
</style>
