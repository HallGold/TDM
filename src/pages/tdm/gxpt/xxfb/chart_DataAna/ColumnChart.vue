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
          data: [
            "X射线电子能谱仪",
            "扫描电镜",
            "原子力显微镜",
            "扫描探针近场拉曼平台",
            "扫描电镜",
            "扫描电镜",
            "扫描电镜",
            "原子力显微镜",
            "扫描电镜",
            "原子力显微镜",
          ],
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
            color: "#4D799F",
            fontSize: 12,
            interval: 0,
            formatter: function (value) {
              var str = "";
              var num = 3; //每行显示字数
              var valLength = value.length; //该项x轴字数
              var rowNum = Math.ceil(valLength / num); // 行数

              if (rowNum > 1) {
                for (var i = 0; i < rowNum; i++) {
                  var temp = "";
                  var start = i * num;
                  var end = start + num;

                  temp = value.substring(start, end) + "\n";
                  str += temp;
                }
                return str;
              } else {
                return value;
              }
            },
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
          data: [
            "X射线电子能谱仪",
            "扫描电镜",
            "原子力显微镜",
            "扫描探针近场拉曼平台",
            "扫描电镜",
            "扫描电镜",
            "扫描电镜",
            "原子力显微镜",
            "扫描电镜",
            "原子力显微镜",
          ],
          type: "category",
        },
        yAxis: {
          axisLabel: {
            color: "#4D799F",
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
          name: "预约次数",
        },
        series: [
          {
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
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
