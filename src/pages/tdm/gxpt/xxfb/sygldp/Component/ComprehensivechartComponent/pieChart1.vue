<template>
  <div class="pie_Chart1">11111111</div>
</template>

<script>
export default {
  props: ["pie1Datas"],
  data () {
    return {
      getPie1Datas: [],
    }
  },
  methods: {
    drawChart () {
      let dataList = this.getPie1Datas.map((item) => {
        return {
          name: item.equipmentName,
          value: item.equipmentCount
        }
      });
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.querySelector(".pie_Chart1"));
      this.myChart.setOption(
        {
          title: {
            text: '设备利用率(百分比)',
            top: '2%',
            left: '2%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#FFF'
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
            show: false,
            type: "scroll",
            orient: "vertical",
            left: "0%",
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
              radius: ["60%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "12",
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
  watch: {
    pie1Datas: function (item) {
      /*  console.log(item); */
      this.getPie1Datas = item;
      /*  console.log(this.getPie1Datas); */
      this.drawChart()
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