<template>
  <div class="pie_Chart2">11111111</div>
</template>

<script>
export default {
  props: ["pie2Datas"],
  data () {
    return {
      getPie2Datas: [],
    }
  },
  methods: {
    drawChart () {
      let dataList = this.getPie2Datas.map((item) => {
        return {
          value: item.appOkNum,
          name: item.appOk
        }
      });
      /*   console.log(dataList); */
      // 基于准备好的dom，初始化echarts实例
      this.myChart = this.$echarts.init(document.querySelector(".pie_Chart2"));
      this.myChart.setOption(
        {
          title: {
            text: '实验完成率',
            top: '2%',
            left: '2%',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#FFF'
            },
          },
          color: [
            "#ff7e85",
            "#73e2e2",
            "#fac524",
            "#40b7fc",
            "#006d75",
            "#595959",
            "#f4764f",
            "#46caff",
            "#a1e867",
            "#10b2b2",
            "#2797ff",
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
            "#fa8699",
            "#8a89fe",
            "#9351ed",
            "#00baba",
            "#facf24",
            "#23c6c6",
            "#e89d67",
            "#df89e8",
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
    pie2Datas: function (item) {
      this.getPie2Datas = item;
      /*  console.log(this.getPie2Datas); */
      this.drawChart();
    }
  },
  mounted () {
    this.drawChart();
  },
}
</script>

<style lang="less" scoped>
.pie_Chart2 {
  width: 100%;
  height: 100%;
}
</style>