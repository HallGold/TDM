<template>
  <div class="pie_Chart1"></div>
</template>

<script>
export default {
  props: ["Pie1Datas"],
  data () {
    return {
      getPie1Datas: [],
    }
  },
  methods: {
    drawChart () {
      let dataList = this.getPie1Datas.map((item) => {
        return {
          value: item.appTypeNum,
          name: item.appType
        }
      });
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.querySelector(".pie_Chart1"));
      this.myChart.setOption(
        {
          title: {
            text: '预约受理(单)',
            top: '2%',
            left: '2%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#FFF'
            },
          },
          color: [
            "#f4905a",
            "#a640fc",
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
            "#7c92e8",
            "#ec87f7",
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
            show: true,
            type: "scroll",
            orient: "vertical",
            left: "5%",
            align: "right",
            top: "middle",
            textStyle: {
              color: "#fff",
            },
            height: 150,
          },
          series: [
            {
              type: "pie",
              radius: ["50%", "60%"],
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
              data: dataList,
            },
          ],
        }
      );
    },
  },
  watch: {
    Pie1Datas: function (item) {
      this.getPie1Datas = item;
      this.drawChart();
    }
  },
  mounted () {
    this.drawChart();
  },
}
</script>

<style lang="less" scoped>
.pie_Chart1 {
  width: 100%;
  height: 100%;
}
</style>