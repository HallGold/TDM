<template>
  <div class="column_Chart"></div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
    drawChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".column_Chart"));
      myChart.setOption({
        backgroundColor: "#0C1C45",
        color: ["#63caff", "#3608FE"],
        legend: {
          data: ["已完成", "未完成", "进行中"],
        },
        grid: {
          containLabel: true,
          left: 20,
          right: 20,
          bottom: 10,
          top: 40,
        },
        xAxis: {
          axisLabel: {
            color: "#c0c3cd",
            fontSize: 14,
            interval: 0,
          },
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: "#384267",
              width: 1,
              type: "dashed",
            },
            show: true,
          },
          data: ["已完成", "未完成", "进行中"],
          type: "category",
        },
        yAxis: {
          axisLabel: {
            color: "#c0c3cd",
            fontSize: 14,
          },

          splitLine: {
            show: true,
            lineStyle: {
              color: "#384267",
              type: "dashed",
            },
          },
          axisLine: {
            lineStyle: {
              color: "#384267",
              width: 1,
              type: "dashed",
            },
            show: true,
          },
          name: "单位",
        },
        series: [
          {
            data: [10, 20, 30],
            type: "bar",
            barWidth: 30,
            itemStyle: {
              color: {
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                type: "linear",
                global: false,
                colorStops: [
                  {
                    offset: 0,
                    color: "#3A1BFD",
                  },
                  {
                    offset: 1,
                    color: "#3BEFFD",
                  },
                ],
              },
            },
            label: {
              show: true,
              position: "top",
              distance: 10,
              color: "#fff",
            },
          },
          {
            data: [1, 1, 1],
            type: "pictorialBar",
            barMaxWidth: "20",
            symbol: "diamond",
            symbolOffset: [0, "50%"],
            symbolSize: [3, 15],
          },
          {
            data: [10, 20, 30],
            type: "pictorialBar",
            barMaxWidth: "20",
            symbolPosition: "end",
            symbol: "diamond",
            symbolOffset: [0, "-50%"],
            symbolSize: [30, 12],
            zlevel: 2,
          },
        ],
        tooltip: {
          trigger: "item",
          show: true,
        },
      });
    },
  },
  mounted () {
    this.drawChart();
  },
};
</script>
<style lang="less" scoped>
.column_Chart {
  width: 100%;
  height: 100%;
}
</style>
