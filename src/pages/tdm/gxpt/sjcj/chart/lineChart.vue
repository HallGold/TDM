<template>
  <div class="line_Chart"></div>
</template>
<script>
export default {
  props: ["LineChartData", "seriesName", "LinexAxisData"],
  data () {
    return {};
  },
  methods: {
    drawChart () {
      let datalist = this.LineChartData;
      let seriesName = this.seriesName;
      /*   console.log(datalist, "datalist"); */
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".line_Chart"));
      let xAxisData = this.LinexAxisData.reverse();
      myChart.setOption({
        textStyle: {
          fontFamily: "Din-Light",
        },
        color: [
          "#ff7e85",
          "#9b52ff",
          "#fac524",
          "#46caff",
          "#a1e867",
          "#10b2b2",
          "#ec87f7",
          "#f4905a",
          "#00baba",
          "#facf24",
          "#e89d67",
          "#23c6c6",
          "#fa8699",
          "#40b7fc",
          "#006d75",
          "#595959",
          "#f4764f",
          "#a640fc",
          "#fda23f",
          "#2d7ae4",
          "#5092ff",
          "#9351ed",
          "#8a89fe",
          "#df89e8",
          "#2797ff",
          "#6ad089",
          "#7c92e8 ",
          "#123dac",
          "#73e2e2",
        ],
        title: {
          text: "",
          left: "47%",
          textStyle: {
            fontSize: 24,
          },
        },
        /* legend: {
          data: [
            {
              name: "本日",
              icon:
                "path://M512 139.81262864a286.42534744 286.42534744 0 1 0 286.42534744 286.42534744 286.42534744 286.42534744 0 0 0-286.42534744-286.42534744z m0 477.3755789a190.95023144 190.95023144 0 1 1 190.95023144-190.95023146 190.95023144 190.95023144 0 0 1-190.95023144 190.95023146z",
            },
            {
              name: "本月",
              icon:
                "path://M512 139.81262864a286.42534744 286.42534744 0 1 0 286.42534744 286.42534744 286.42534744 286.42534744 0 0 0-286.42534744-286.42534744z m0 477.3755789a190.95023144 190.95023144 0 1 1 190.95023144-190.95023146 190.95023144 190.95023144 0 0 1-190.95023144 190.95023146z",
            },
            {
              name: "今年",
              icon:
                "path://M512 139.81262864a286.42534744 286.42534744 0 1 0 286.42534744 286.42534744 286.42534744 286.42534744 0 0 0-286.42534744-286.42534744z m0 477.3755789a190.95023144 190.95023144 0 1 1 190.95023144-190.95023146 190.95023144 190.95023144 0 0 1-190.95023144 190.95023146z",
            },
          ],
          // left: "left",
          selected: {
            本日: true,
            本月: true,
            今年: true,
          },
          itemWidth: 10,
          itemHeight: 10,
          itemGap: 10,
          textStyle: {
            color: "#898989",
            lineHeight: 15,
          },
          type: "scroll",
        }, */

        tooltip: {
          backgroundColor: "#fff",
          trigger: "axis",
          axisPointer: {
            type: "none",
          },
          textStyle: {
            color: "#565656",
            lineHeight: 28,
          },
          confine: true,
          padding: 12,
          extraCssText:
            "box-shadow: 0px 2px 8px 0px #cacaca;border-radius: 4px;opacity: 0.9;max-height: 100%;",
          formatter: {
            _custom: {
              type: "function",
              display: "<span>ƒ</span> (params)",
            },
          },
        },
        grid: {
          left: 10,
          right: 10,
          top: 100,
          bottom: 100,
        },
        xAxis: {
          type: "category",
          boundaryGap: true,
          data: xAxisData,
          axisLabel: {
            color: "#a0a9bc",
            //X轴标签 label 做了特殊处理，防止左右溢出
            /* formatter: (value, index) => {
              console.log(index, "index");
              if (index === 0 || index === xAxisData.length - 1) {
                return "";
              }
              return value;
            }, */
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          name: "",
          nameTextStyle: {
            color: "gray",
          },
          type: "value",
          axisLabel: {
            color: "#a0a9bc",
            inside: true,
            margin: 0,
            verticalAlign: "bottom",
          },
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          minInterval: 1,
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: seriesName,
            data: datalist,
            type: "line",
            smooth: true,
            smoothMonotone: "x",
            cursor: "pointer",
            showSymbol: false,
            lineStyle: {
              shadowColor: "rgba(18,61,172,0.5)",
              shadowBlur: 10,
            },
          },
          /* {
            name: "本月",
            data: [
              23,
              39,
              118,
              71,
              116,
              89,
              58,
              71,
              51,
              146,
              31,
              41,
              61,
              485,
              5,
              0,
              0,
              0,
              0,
              3,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
            ],
            type: "line",
            smooth: true,
            smoothMonotone: "x",
            cursor: "pointer",
            showSymbol: false,
            lineStyle: {
              shadowColor: "rgba(115,226,226,0.5)",
              shadowBlur: 10,
            },
          },
          {
            name: "今年",
            data: [
              20,
              37,
              91,
              72,
              68,
              67,
              54,
              42,
              42,
              115,
              41,
              33,
              64,
              312,
              4,
              0,
              0,
              0,
              3,
              4,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
              0,
            ],
            type: "line",
            smooth: true,
            smoothMonotone: "x",
            cursor: "pointer",
            showSymbol: false,
            lineStyle: {
              shadowColor: "rgba(255,126,133,0.5)",
              shadowBlur: 10,
            },
          }, */
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
