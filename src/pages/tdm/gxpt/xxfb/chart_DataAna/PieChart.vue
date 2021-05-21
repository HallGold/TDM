<template>
  <div class="pie_Chart"></div>
</template>
<script>
export default {
  data () {
    return {};
  },
  methods: {
    drawChart () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".pie_Chart"));
      myChart.setOption({
        color: ["#0090ff", "#ffbc32"],
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
            color: "#fff",
          },
          height: 150,
        },
        series: [
          {
            name: "总设备利用率(月)",
            type: "pie",
            radius: [10, 70],
            data: [
              { value: 70, name: "使用时间" },
              { value: 30, name: "闲置时间" },
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
.pie_Chart {
  width: 100%;
  height: 100%;
}
</style>
