<template>
  <div class="pie_Chart"></div>
</template>
<script>
export default {
  props: ["PieChartData"],
  data () {
    return {
      myChart: ''
    };
  },
  methods: {
    drawChart (data) {
      let datalist = data;
      // 基于准备好的dom，初始化echarts实例
      if (this.myChart) {
        this.myChart.clear();
      }
      this.myChart = this.$echarts.init(document.querySelector(".pie_Chart"));

      this.myChart.setOption({
        color: [
          "#73e2e2",
          "#ff7e85",
          "#fac524",
          "#40b7fc",
          "#006d75",
          "#595959",
          "#f4764f",
          "#46caff",
          "#a1e867",
          "#10b2b2",
          "#00baba",
          "#facf24",
          "#e89d67",
          "#23c6c6",
          "#fa8699",
          "#9351ed",
          "#8a89fe",
          "#df89e8",
          "#2797ff",
          "#6ad089",
          "#7c92e8 ",
          "#ec87f7",
          "#f4905a",
          "#a640fc",
          "#fda23f",
          "#2d7ae4",
          "#5092ff",
          "#9b52ff",
          "#123dac",
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        toolbox: {
          show: true,
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          left: "10%",
          align: "right",
          top: "middle",
          textStyle: {
            color: "#000",
          },
          height: 150,
        },
        /* series: [
          {
            name: "数据采集类型分析",
            type: "pie",
            radius: [10, 150],
            data: [
              { value: 70, name: "本日" },
              { value: 30, name: "本月" },
              { value: 30, name: "今年" },
            ],
            itemStyle: {
              normal: {
                label: {
                  //此处为指示线文字
                  show: true,
                  position: "outer", //标签的位置
                  textStyle: {
                    fontWeight: 200,
                    fontSize: 10, //文字的字体大小
                  },
                },
              },
            },
          },
        ], */
        series: [
          {
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: "center",
            },
            emphasis: {
              label: {
                show: true,
                fontSize: "30",
                fontWeight: "bold",
              },
            },
            labelLine: {
              show: false,
            },
            data: datalist,
          },
        ],
      });
    },
    refresh (data) {
      this.PieChartData = data;
    }
  },
  mounted () {
    // this.drawChart();
  },
};
</script>
<style lang="less" scoped>
.pie_Chart {
  width: 100%;
  height: 100%;
}
</style>
