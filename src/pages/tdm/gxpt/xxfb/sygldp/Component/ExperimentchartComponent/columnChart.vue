<template>
  <div class="column_Chart">
    柱
  </div>
</template>

<script>
export default {
  data () {
    return {

    }
  },
  methods: {
    drawChart () {
      let myChart = this.$echarts.init(document.querySelector(".column_Chart"));

      myChart.setOption(
        {
          /*  backgroundColor: '#00265f', */
          title: {
            text: '实验状态(单)',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            top: '2%',
            left: '2%'
          },
          tooltip: {
            trigger: 'axis',
            /* 指示器 */
            axisPointer: {
              type: 'none'
            }
          },
          grid: {
            top: '15%',
            right: '3%',
            left: '5%',
            bottom: '12%'
          },
          xAxis: [
            {
              type: 'category',
              data: [],
              axisLine: {
                lineStyle: {
                  color: 'rgba(255,255,255,0.12)'
                }
              },
              axisLabel: {
                margin: 10,
                color: '#e2e9ff',
                textStyle: {
                  fontSize: 14
                },
              },
            }
          ],
          yAxis: [
            {
              show: false,
              splitNumber: 3,
              axisLabel: {
                formatter: '{value}',
                color: '#e2e9ff',
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: false,
                lineStyle: {
                  color: '#233e64'
                }
              },
            }
          ],
          series: [
            {
              type: 'bar',
              data: [300, 450, 770, 203, 255, 188, 156],
              barWidth: '20px',
              itemStyle: {
                normal: {
                  color: 'rgba(0,244,255,1)',
                  barBorderRadius: [30, 30, 30, 30],
                  shadowColor: 'rgba(0,160,221,1)',
                  shadowBlur: 4,
                }
              },
            }
          ]
        }
      )

    }
  },
  mounted () {
    this.drawChart()
  }
}
</script>

<style lang="less" scoped>
.column_Chart {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
</style>