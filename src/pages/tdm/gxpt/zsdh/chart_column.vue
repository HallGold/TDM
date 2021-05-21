<template>
  <div class="chart_column"></div>
</template>
<script>
export default {
  data () {
    return {
      defaultProps: {
        name: "fileTypeName",
        oid: "fileTypeId",
        value: "num",
      },
      barChartData: [],
    };
  },
  methods: {
    drawLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.querySelector(".chart_column"));
      var myColor = ["#1089E7", "#F57474", "#56D0E3", "#F8B448", "#8B78F6"];
      var data = [];
      for (let i = 0; i < this.barChartData.length; i++) {
        var barData = {};
        barData.name = this.barChartData[i][this.defaultProps.name];
        barData.value = this.barChartData[i][this.defaultProps.value];
        data.push(barData);
      }
      console.log("最近更新知识 data", data);
      var finalData = data.map((item, index) => {
        var arr = new Array(data.length).fill(0);
        arr[index] = item.value;
        return arr;
      });
      myChart.setOption({
        tooltip: {
          trigger: "item",
        },
        // legend: {
        //   type: "scroll",
        //   x: "center",
        //   data: data.map((item) => item.name),
        // },
        xAxis: {
          type: "category",
          data: data.map((item) => item.name),
          show: true,
        },
        yAxis: {
          type: "value",
          splitLine: {
            lineStyle: {
              type: "dashed",
            },
          },
          // minInterval: 1,
          axisLabel: {
            color: "rgba(0,0,0,0.45)",
          },
          axisLine: {
            show: false,
            lineStyle: {
              type: "dashed",
            },
          },
          axisTick: {
            show: false,
          },
        },
        series: data.map((item, index) => {
          return {
            name: item.name,
            data: finalData[index],
            barWidth: "50%",
            type: "bar",
            stack: "堆叠法",
            label: {
              normal: {
                show: true,
                position: "top",
                formatter: function (params) {
                  return params.value || "";
                },
                fontSize: 12,
              },
            },
            // 每根柱子样式
            itemStyle: {
              color: function (params) {
                return myColor[params.dataIndex];
              },
            },
          };
        }),
      });
    },
  },
  mounted () {
    this.drawLine();
  },
};
</script>
<style lang="less" scoped>
.chart_column {
  width: 100%;
  height: 100%;
}
</style>
