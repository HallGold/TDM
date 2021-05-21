<template>
  <div class="pie_Chart"></div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    drawChart () {
      let dataList = [
        {
          name: "A类",
          value: "3720"
        },
        {
          name: "B类",
          value: "2920"
        },
        {
          name: "C类",
          value: "2200"
        },
        {
          name: "D类",
          value: "1420"
        }
      ];
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.querySelector(".pie_Chart"));
      this.myChart.setOption(
        {
          title: {
            text: '实验进度占比',
            top: '2%',
            left: '2%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#000'
            },
          },
          color: [
            "#6ad089",
            "#7c92e8",
            "#ec87f7",
            "#f4905a",
            "#a640fc",
            "#fda23f",
            "#2d7ae4",
            "#5092ff",
            "#9b52ff",
            "#123dac",
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

          ],
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          toolbox: {
            show: true,
          },
          legend: {
            show: true,
            type: "scroll",
            orient: "vertical",
            left: "0%",
            align: "right",
            top: "middle",
            textStyle: {
              color: "#000",
            },
            height: 150,
          },
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
                  fontSize: "20",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: dataList,
            },
          ],
        });
    },
  },
  mounted () {
    this.drawChart();
  },
}
</script>

<style lang="less" scoped>
.pie_Chart {
  width: 100%;
  height: 100%;
}
</style>