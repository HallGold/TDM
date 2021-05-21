<template>
  <div class="line_Chart"></div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
    drawChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".line_Chart"));
      myChart.setOption({
        backgroundColor: "#0C1C45",
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#285E94",
            },
          },
        },
        legend: {
          data: [
            {
              name: "当月实验项目量",
              textStyle: {
                rich: {
                  a: {
                    width: 16,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "rgba(90, 255, 164,,1)",
                  },
                },
              },
            },
            {
              name: "上月实验项目量",
              textStyle: {
                rich: {
                  a: {
                    width: 16,
                    height: 10,
                    borderRadius: 5,
                    backgroundColor: "rgba(86, 200, 255,,1)",
                  },
                },
              },
            },
          ],
          bottom: "1%",
          icon: "none",
          formatter (name) {
            const arr = ["{a|}", `{b|${name}}`];
            return arr.join("");
          },
          textStyle: {
            rich: {
              a: {
                width: 16,
                height: 10,
                borderRadius: 5,
                backgroundColor: "#ccc",
              },
              b: {
                fontSize: 14,
                align: "center",
                padding: [0, 5, 0, 5],
                lineHeight: 20,
                color: "#BADFFF",
              },
            },
          },
        },
        grid: {
          left: "2%",
          right: "2%",
          bottom: "15%",
          top: "8%",
          containLabel: true,
        },
        xAxis: {
          axisLine: {
            lineStyle: {
              color: "rgba(196, 196, 196, 0.1)",
            },
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(196, 196, 196, 0.1)",
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            textStyle: {
              color: "#50AFFF",
              fontSize: "13",
            },
          },
          data: ["第一周", "第二周", "第三周", "第四周"],
        },
        yAxis: [
          {
            type: "value",
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontSize: "13",
                color: "#50AFFF",
              },
            },
            axisLine: {
              lineStyle: {
                color: "rgba(196, 196, 196, 0.1)",
              },
            },
            splitLine: {
              lineStyle: {
                color: "rgba(196, 196, 196, 0.1)",
              },
            },
          },
        ],
        series: [
          {
            name: "当月实验项目量",
            type: "line",
            symbol: "circle",
            showSymbol: true,
            symbolSize: 5,
            lineStyle: {
              color: "rgba(90, 255, 164, 1)",
            },
            areaStyle: {
              normal: {
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
                      color: "rgba(90, 255, 164, 0.2)",
                    },
                    {
                      offset: 0.6,
                      color: "rgba(90, 255, 164, 0.1)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(90, 255, 164, 0.01)",
                    },
                  ],
                },
                shadowColor: "rgba(90, 255, 164, 0.1)",
                shadowBlur: 6,
              },
            },
            data: [1, 10, 20, 30],
            color: "rgba(90, 255, 164, 1)",
          },
          {
            name: "上月实验项目量",
            type: "line",
            symbol: "circle",
            showSymbol: true,
            symbolSize: 5,
            lineStyle: {
              color: "rgba(86, 200, 255, 1)",
            },
            areaStyle: {
              normal: {
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
                      color: "rgba(86, 200, 255, 0.2)",
                    },
                    {
                      offset: 0.6,
                      color: "rgba(86, 200, 255, 0.1)",
                    },
                    {
                      offset: 0.8,
                      color: "rgba(86, 200, 255, 0.01)",
                    },
                  ],
                },
                shadowColor: "rgba(86, 200, 255, 0.1)",
                shadowBlur: 6,
              },
            },
            data: [20, 40, 60, 80],
            color: "rgba(86, 200, 255, 1)",
          },
        ],
      });
    },
  },
  mounted () {
    this.drawChart();
  },
};
</script>
<style lang="less" scoped>
.line_Chart {
  width: 100%;
  height: 100%;
}
</style>
